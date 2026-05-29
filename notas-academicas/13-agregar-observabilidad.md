# Cómo Agregar una Capa de Observabilidad a un Proyecto Existente

## Acerca de esta nota

Esta nota resume **todo lo aprendido** durante la construcción del taller de observabilidad y lo sintetiza en una **guía práctica** para agregar observabilidad a proyectos existentes — como los trabajos integradores de los alumnos.

No asume que puedas reescribir la app desde cero. Parte de **código existente** y agrega capas.

> **Ver también**: `12-integracion-conceptos.md` para el mapa conceptual completo

---

## 1. ¿Por qué AGREGAR observabilidad y no DISEÑAR para ella?

Idealmente, la observabilidad se diseña desde el día 1 (ADR-004 del taller). Pero en la realidad:

- Tenés un TP avanzado con miles de líneas
- No podés reescribir todo
- Tenés que entregar en 2 semanas

**La buena noticia**: podés agregar observabilidad sin modificar la lógica de negocio, gracias a:
- **Auto-instrumentación**: OTel captura HTTP, DB, logs sin tocar tu código
- **Arquitectura Hexagonal**: si tu proyecto separa capas, es más fácil
- **Docker Compose**: agregás servicios sin modificar tu app

---

## 2. El Enfoque en 4 Pasos

```
Paso 1: Pipeline        ──► Docker Compose con LGTM
Paso 2: Instrumentación  ──► OTel SDK + auto-instrumentación
Paso 3: Logs            ──► Pino + trace_id correlacionado
Paso 4: Dashboards      ──► Grafana provisioning
```

### Paso 1: Pipeline de Observabilidad (30 min)

Agregá estos servicios a tu `docker-compose.yml` **sin tocar tu código**:

```yaml
# docker-compose.yml — agregá estos servicios
services:
  # ... tu app existente ...

  otel-collector:
    image: otel/opentelemetry-collector-contrib:latest
    ports: ["4317:4317", "4318:4318"]

  loki:
    image: grafana/loki:latest
    ports: ["3100:3100"]

  tempo:
    image: grafana/tempo:latest
    ports: ["3200:3200"]

  mimir:
    image: grafana/mimir:latest
    ports: ["9009:9009"]

  grafana:
    image: grafana/grafana:latest
    ports: ["3000:3000"]
    volumes:
      - ./grafana/datasources:/etc/grafana/provisioning/datasources
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
```

Agregá el OTel Collector config:

```yaml
# otel-collector/config.yml
receivers:
  otlp:
    protocols:
      grpc: { endpoint: 0.0.0.0:4317 }
      http: { endpoint: 0.0.0.0:4318 }
exporters:
  otlp/tempo:
    endpoint: tempo:4317
    tls: { insecure: true }
  prometheusremotewrite:
    endpoint: http://mimir:9009/api/v1/push
service:
  pipelines:
    traces:  [otlp → batch → otlp/tempo]
    metrics: [otlp → batch → prometheusremotewrite]
    logs:    [otlp → batch → loki]  # si usás OTel para logs
```

Y configurá Grafana con provisioning:

```yaml
# grafana/datasources.yml
datasources:
  - name: Loki
    type: loki
    url: http://loki:3100
  - name: Tempo
    type: tempo
    url: http://tempo:3200
  - name: Mimir
    type: prometheus
    url: http://mimir:9009/prometheus
```

> **✅ Logro**: Tenés el backend de observabilidad funcionando. Tu app todavía no envía datos, pero los servicios están listos.

### Paso 2: Instrumentar el Backend (2-3 horas)

#### 2a. Agregar dependencias

```bash
npm install @opentelemetry/api @opentelemetry/sdk-node \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/exporter-trace-otlp-grpc \
  @opentelemetry/exporter-metrics-otlp-grpc
```

#### 2b. Crear el inicializador de OTel

```typescript
// observability/telemetry.ts
import { NodeSDK } from "@opentelemetry/sdk-node"
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc"
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { Resource } from "@opentelemetry/resources"
import { SEMRESATTRS_SERVICE_NAME } from "@opentelemetry/semantic-conventions"

let sdk: NodeSDK | null = null

export function initTelemetry(): void {
  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318"

  sdk = new NodeSDK({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || "mi-app",
    }),
    traceExporter: new OTLPTraceExporter({ url: `${endpoint}/v1/traces` }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({ url: `${endpoint}/v1/metrics` }),
      exportIntervalMillis: 5000,
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  })

  sdk.start()
}

export async function shutdownTelemetry(): Promise<void> {
  await sdk?.shutdown()
}
```

#### 2c. Inicializar ANTES que el servidor

```typescript
// src/index.ts (bootstrap)
import { initTelemetry, shutdownTelemetry } from "./observability/telemetry"

async function main() {
  initTelemetry()  // ← ANTES que cualquier otra cosa
  // ... el resto de tu bootstrap ...
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  await shutdownTelemetry()
  process.exit(0)
})
```

> **⚠️ Crítico**: OTel debe inicializarse ANTES de importar cualquier librería que quieras instrumentar (Express, Fastify, Prisma, etc.). La auto-instrumentación hookea imports.

> **✅ Logro**: Sin cambiar UNA línea de tu lógica de negocio, ahora tenés:
> - Trazas HTTP (cada request genera un span)
> - Trazas de base de datos (Prisma consultas → spans)
> - Métricas RED (rate, errors, duration) automáticas

### Paso 3: Logs Estructurados (1 hora)

#### 3a. Agregar Pino

```bash
npm install pino pino-pretty
```

#### 3b. Reemplazar console.log

```typescript
// observability/logger.ts
import pino from "pino"
import { trace, context, isSpanContextValid } from "@opentelemetry/api"

export const logger = pino({
  transport: { target: "pino-pretty", options: { colorize: true } },
  level: process.env.LOG_LEVEL || "info",
  mixin() {
    const span = trace.getSpan(context.active())
    if (!span) return {}
    const spanContext = span.spanContext()
    if (!isSpanContextValid(spanContext)) return {}
    return {
      trace_id: spanContext.traceId,
      span_id: spanContext.spanId,
    }
  },
})
```

#### 3c. Buscar y reemplazar en tu código

```typescript
// ANTES
console.log("Usuario creado:", userId)
console.error("Error al crear usuario:", err)

// DESPUÉS
logger.info({ event: "user.created", userId }, "Usuario creado exitosamente")
logger.error({ event: "user.error", err }, "Error al crear usuario")
```

**Regla de eventos**: cada `logger.info()` debería tener un `event` único y buscable:
- `user.created`, `user.deleted`, `order.placed`
- `payment.failed`, `validation.error`
- `auth.login`, `auth.logout`

> **✅ Logro**: Tus logs ahora:
> - Son JSON estructurados (no texto libre)
> - Tienen `trace_id` y `span_id` (correlación con trazas)
> - Son filtrables por `event` en Loki

### Paso 4: Spans Manuales (1-2 horas)

La auto-instrumentación te da spans a nivel HTTP y DB. Pero los spans más valiosos son los de **negocio**:

```typescript
import { trace, Span, SpanStatusCode } from "@opentelemetry/api"

const tracer = trace.getTracer("mi-app")

export function startSpan<T>(name: string, fn: (span: Span) => Promise<T>): Promise<T> {
  return tracer.startActiveSpan(name, async (span: Span) => {
    try {
      const result = await fn(span)
      span.setStatus({ code: SpanStatusCode.OK })
      return result
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: String(error) })
      span.recordException(error instanceof Error ? error : new Error(String(error)))
      throw error
    } finally {
      span.end()
    }
  })
}
```

Usalo en tus controladores/rutas:

```typescript
app.post("/api/users", async (req, reply) => {
  return startSpan("crear-usuario", async (span) => {
    span.setAttribute("user.email", req.body.email)  // ← atributo de negocio

    const user = await createUser(req.body)

    logger.info({ event: "user.created", userId: user.id }, "Usuario creado")
    return reply.status(201).send(user)
  })
})
```

> **✅ Logro**: Tus trazas ahora tienen spans con nombres como `crear-usuario`, `procesar-pago`, `enviar-email` — no solo `HTTP POST /api/users`.

---

## 3. Lo que NO Necesitás Hacer

| Preocupación común | Realidad |
|-------------------|----------|
| "Tengo que reescribir todo" | ❌ La auto-instrumentación cubre HTTP, DB, caché, colas |
| "Mi código no está preparado" | ❌ Solo necesitás 3 archivos nuevos + reemplazar console.log |
| "No entiendo de métricas" | ❌ Las métricas RED vienen solas con OTel |
| "Voy a romper algo" | ❌ OTel no modifica el comportamiento — solo observa |
| "Es mucho esfuerzo" | ❌ 4-6 horas para un proyecto backend típico |

---

## 4. Lo que SÍ Necesitás Hacer (Checklist)

### Fase 1: Pipeline (30 min)
- [ ] Agregar servicios LGTM al docker-compose.yml
- [ ] Configurar OTel Collector
- [ ] Configurar Grafana provisioning (datasources + dashboards)

### Fase 2: Instrumentación (2-3 horas)
- [ ] Instalar paquetes OTel
- [ ] Crear `observability/telemetry.ts`
- [ ] Llamar `initTelemetry()` antes del bootstrap
- [ ] Agregar graceful shutdown
- [ ] Configurar variable `OTEL_EXPORTER_OTLP_ENDPOINT`
- [ ] Buildear y verificar que el SDK inicia

### Fase 3: Logs (1 hora)
- [ ] Instalar Pino
- [ ] Crear `observability/logger.ts` con `mixin()`
- [ ] Reemplazar `console.log` → `logger.info`
- [ ] Reemplazar `console.error` → `logger.error`
- [ ] Agregar `event` a cada log

### Fase 4: Spans de negocio (1-2 horas)
- [ ] Crear `observability/tracer.ts`
- [ ] Envolver operaciones clave con `startSpan()`
- [ ] Agregar atributos de negocio (IDs, tipos, resultados)

### Fase 5: Dashboards (30 min)
- [ ] Dashboard RED: rate, errors, duration
- [ ] Dashboard de logs: filtros por evento
- [ ] Dashboard de trazas: búsqueda por servicio

### Fase 6: Verificación
- [ ] Generar tráfico en la app
- [ ] Ver trazas en Grafana Explore > Tempo
- [ ] Ver logs en Grafana Explore > Loki
- [ ] Ver métricas en Grafana Explore > Mimir
- [ ] Ver dashboard completo

---

## 5. Arquitectura Antes vs Después

### Antes

```
┌──────────────────┐     ┌──────────────┐
│    Tu App        │     │  PostgreSQL   │
│  console.log()   │────►│              │
│  sin métricas    │     └──────────────┘
│  sin trazas      │
└──────────────────┘
```

### Después

```
┌──────────────────┐     ┌──────────────┐
│    Tu App        │────►│  PostgreSQL   │
│  logger.info()   │     └──────────────┘
│  startSpan()     │              │
│  OTel SDK        │              │ (traza automática)
└────────┬─────────┘              │
         │ OTLP (4318)            │
         ▼                        ▼
   ┌───────────────────────────────────┐
   │         OTel Collector            │
   └──┬────────────┬──────────┬────────┘
      │            │          │
      ▼            ▼          ▼
   ┌──────┐   ┌────────┐  ┌───────┐
   │ Loki │   │ Tempo  │  │ Mimir │
   │ logs │   │ trazas │  │ métric│
   └──┬───┘   └───┬────┘  └───┬───┘
      └─────┬─────┴───────────┘
            ▼
      ┌──────────┐
      │ Grafana  │
      └──────────┘
```

**Sin cambiar la lógica de negocio**, agregaste:

| Señal | Cobertura |
|-------|-----------|
| 📈 Métricas HTTP | Rate, Errors, Duration (automático) |
| 🔍 Trazas HTTP | Cada request → span en Tempo (automático) |
| 🔍 Trazas DB | Cada consulta → span (automático, Prisma/PG) |
| 🔍 Trazas de negocio | `startSpan()` en operaciones clave (manual) |
| 📝 Logs estructurados | JSON con event, trace_id, span_id |
| 📊 Dashboards | RED, Logs, Trazas (pre-configurados) |

---

## 6. Tiempo Estimado

| Si tu proyecto usa... | Tiempo total |
|----------------------|--------------|
| Express/Fastify + Prisma/TypeORM | 3-4 horas |
| Express/Fastify + SQL directo | 4-5 horas |
| NestJS + Prisma | 2-3 horas (NestJS tiene módulo OTel propio) |
| Django/Flask + SQLAlchemy | 3-4 horas (Python OTel SDK) |
| Spring Boot + JPA | 2-3 horas (Java OTel agent, zero-code) |

> **Zero-code**: Java y .NET tienen agentes OTel que se inyectan sin tocar código. TypeScript requiere mínimo setup.

---

## 7. Lo que Aprendimos en el Taller

| Concepto | Dónde se aplica |
|----------|----------------|
| **Arquitectura Hexagonal** | Separar core de infra facilita agregar OTel sin tocar dominio |
| **OpenTelemetry SDK** | 3 archivos: telemetry.ts, logger.ts, tracer.ts |
| **Auto-instrumentación** | HTTP, Fastify, Pino, PG — sin código adicional |
| **Logs estructurados** | JSON con event, trace_id, span_id → filtrables en Loki |
| **Spans manuales** | Atributos de negocio en operaciones clave |
| **RED framework** | Rate, Errors, Duration — las métricas que importan |
| **Provisioning** | Grafana configurable sin clicks |
| **Docker Compose** | 7 servicios, 1 comando |

---

## 8. Referencias Rápidas

### Para el TP

```bash
# 1. Agregar al docker-compose.yml existente
# 2. Instalar dependencias
npm install @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-grpc @opentelemetry/exporter-metrics-otlp-grpc pino pino-pretty

# 3. Crear carpeta
mkdir -p src/observability

# 4. Copiar telemetry.ts, logger.ts, tracer.ts del taller
# 5. Inicializar OTel en el entry point
# 6. Reemplazar console.log por logger.info
# 7. Agregar docker-compose.yml con LGTM
# 8. docker compose up
# 9. Ver en Grafana :3000
```

### Para el taller

- **Nota principal**: `12-integracion-conceptos.md`
- **OTel paso a paso**: `11-otel-instrumentacion.md`
- **Grafana + Docker**: `06-grafana-docker.md`
- **Código fuente**: https://github.com/rodriguezemautn/taller-observabilidad-grafana
