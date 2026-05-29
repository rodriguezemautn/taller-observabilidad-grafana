# OpenTelemetry: Instrumentación Paso a Paso

## ¿Qué es OpenTelemetry?

OpenTelemetry (OTel) es un **framework de código abierto** para generar, recolectar y exportar telemetría. Es el estándar de facto de la industria, con soporte de Google, Microsoft, AWS, Grafana y más.

### ¿Qué problema resuelve?

Antes de OTel, cada proveedor tenía su propio SDK:
- Si usabas Datadog, instrumentabas con `dd-trace`
- Si usabas New Relic, instrumentabas con `newrelic`
- Si usabas AWS X-Ray, instrumentabas con `aws-xray-sdk`

**Vendor lock-in**: cambiar de proveedor requería re-instrumentar toda la app.

OTel abstrae la instrumentación del backend de destino. Una vez instrumentado con OTel, podés enviar los datos a **cualquier** backend compatible.

### Arquitectura de OTel

```
┌──────────┐    ┌──────────────┐    ┌───────────┐
│  App SDK  │───►│   Collector  │───►│  Backend  │
│ (traces,  │    │ (recibe,     │    │ (Grafana, │
│  metrics, │    │  procesa,    │    │  Datadog, │
│  logs)    │    │  exporta)    │    │  etc.)    │
└──────────┘    └──────────────┘    └───────────┘
```

| Componente | Rol |
|------------|-----|
| **API** | Define las interfaces (Tracer, Meter, Logger) |
| **SDK** | Implementa la API, maneja el pipeline de datos |
| **Collector** | Pipeline central: recibe OTLP, procesa, exporta |
| **Instrumentations** | Plugins que instrumentan librerías (HTTP, DB, etc.) |
| **Exporters** | Envían datos al backend (OTLP gRPC, HTTP, Prometheus, etc.) |

---

## Las 3 Señales de Telemetría

### 1. Trazas (Traces)

Registran el **recorrido de una petición** a través del sistema.

```
GET /api/posts
  │
  ├─ [HTTP] router ── 2ms
  │
  ├─ [Fastify] handler ── 5ms
  │    │
  │    ├─ [App] listar-posts ── 3ms
  │    │    │
  │    │    └─ [DB] SELECT * FROM posts ── 1ms
  │    │
  │    └─ [Response] JSON ── 1ms
  │
  └─ Total: 8ms
```

Cada `·` es un **span**. Los spans tienen:
- **Nombre**: qué operación
- **Duración**: cuánto tardó
- **Atributos**: metadata contextual (post.id, http.method, etc.)
- **Eventos**: ocurrencias puntuales (error, exception)
- **Contexto**: trace_id, span_id, parent_span_id

### 2. Métricas (Metrics)

Datos **cuantitativos** agregados en el tiempo.

| Tipo | Ejemplo | Descripción |
|------|---------|-------------|
| **Counter** | `http_requests_total` | Cuenta que solo incrementa |
| **Histogram** | `http_request_duration_ms` | Distribución de valores |
| **Gauge** | `memory_usage_bytes` | Valor que sube y baja |

Framework **RED** para servicios:
- **R**ate: requests por segundo
- **E**rrors: tasa de errores
- **D**uration: latencia (p50, p95, p99)

### 3. Logs (Registros)

Eventos **discretos** con timestamp y payload estructurado.

```json
{
  "level": 30,
  "time": 1717000000000,
  "msg": "Post creado exitosamente",
  "event": "post.created",
  "postId": "01HXYZ...",
  "trace_id": "abc123...",
  "span_id": "def456..."
}
```

**Clave**: los logs llevan `trace_id` y `span_id` para correlacionar con trazas.

---

## Implementación Paso a Paso en el Taller

### Paso 1: Inicializar el SDK (`telemetry.ts`)

```typescript
// packages/infrastructure/src/observability/telemetry.ts
import { NodeSDK } from "@opentelemetry/sdk-node"
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc"
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { Resource } from "@opentelemetry/resources"
import { SEMRESATTRS_SERVICE_NAME } from "@opentelemetry/semantic-conventions"

let sdk: NodeSDK | null = null

export function initTelemetry(): void {
  const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318"

  sdk = new NodeSDK({
    // Resource: identifica este servicio
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || "taller-backend",
    }),
    // Exporters: hacia el OTel Collector via OTLP HTTP
    traceExporter: new OTLPTraceExporter({ url: `${otlpEndpoint}/v1/traces` }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({ url: `${otlpEndpoint}/v1/metrics` }),
      exportIntervalMillis: 5000,  // cada 5 segundos
    }),
    // Auto-instrumentaciones
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-pino": { enabled: true },
        "@opentelemetry/instrumentation-fastify": { enabled: true },
        "@opentelemetry/instrumentation-http": { enabled: true },
        "@opentelemetry/instrumentation-pg": { enabled: true },
      }),
    ],
  })

  sdk.start()
}

export async function shutdownTelemetry(): Promise<void> {
  await sdk?.shutdown()
}
```

**¿Qué hace cada cosa?**

| Config | Efecto |
|--------|--------|
| `resource` | Etiqueta todos los datos con `service.name="taller-backend"` |
| `traceExporter` | Envía trazas al Collector vía OTLP cada vez que un span termina |
| `metricReader` | Cada 5s lee las métricas acumuladas y las exporta |
| `instrumentation-pino` | Captura cada `logger.info()` y lo convierte en un log OTel |
| `instrumentation-fastify` | Crea un span por cada request HTTP entrante |
| `instrumentation-http` | Crea spans para requests HTTP salientes |
| `instrumentation-pg` | Crea spans para cada consulta a PostgreSQL |

### Paso 2: Logger con contexto de trazas (`logger.ts`)

```typescript
import pino from "pino"
import { trace, context, isSpanContextValid } from "@opentelemetry/api"

export const logger = pino({
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
  level: process.env.LOG_LEVEL || "info",
  // mixin() se ejecuta en CADA llamada a logger.info/warn/error()
  // TOMA el span activo en ese momento y agrega trace_id + span_id al log
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

**¿Por qué es importante?**

Sin `mixin()`:
```
log: "Post creado exitosamente"  ← no se puede vincular a una traza
```

Con `mixin()`:
```
log: "Post creado exitosamente" trace_id="abc..." span_id="def..."
```

Esto permite que en Grafana puedas:
1. Ver un log en Loki
2. Hacer click en el `trace_id`
3. Saltar directo a la traza en Tempo
4. Ver el span exacto que generó ese log

### Paso 3: Spans manuales con atributos de negocio (`tracer.ts`)

```typescript
import { trace, Span, SpanStatusCode } from "@opentelemetry/api"

const tracer = trace.getTracer("taller-backend")

// startSpan es un wrapper que:
// 1. Crea un span con el nombre dado
// 2. Ejecuta la función async dentro del span
// 3. Setea OK o ERROR según el resultado
// 4. Cierra el span automáticamente
export function startSpan<T>(name: string, fn: (span: Span) => Promise<T>): Promise<T> {
  return tracer.startActiveSpan(name, async (span: Span) => {
    try {
      const result = await fn(span)
      span.setStatus({ code: SpanStatusCode.OK })
      return result
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : "Error desconocido",
      })
      span.recordException(error instanceof Error ? error : new Error(String(error)))
      throw error
    } finally {
      span.end()
    }
  })
}
```

**¿Qué logramos con los spans manuales?**

- **Span automático** (de Fastify): `POST /api/posts` — solo dice método y ruta
- **Span manual** (nuestro): `crear-post` — dice QUÉ se hizo en términos de negocio

Además, podemos agregar **atributos** que enriquecen la traza:

```typescript
span.setAttribute("post.title", input.title)  // ← aparece en la traza
span.setAttribute("post.author", input.author)  // ← aparece en la traza
```

### Paso 4: Usar en las rutas (`routes/posts.ts`)

```typescript
app.post("/api/posts", async (request, reply) => {
  const input = request.body as { title: string; content: string; author: string }

  // Cada ruta envuelve su lógica en startSpan()
  return startSpan("crear-post", async (span: Span) => {
    span.setAttribute("post.title", input.title)
    span.setAttribute("post.author", input.author)

    try {
      const post = await createPost.execute(input)
      span.setAttribute("post.id", post.id)

      // Log estructurado con evento y trace_id automático
      logger.info({
        event: "post.created",
        postId: post.id,
        title: input.title,
      }, "Post creado exitosamente")

      return reply.status(201).send(post)
    } catch (error) {
      if (error instanceof ValidationError) {
        span.setAttribute("error.type", "validation")
        logger.warn({
          event: "post.validation_error",
          error: error.message,
        }, "Error de validación al crear post")
      }
      throw error
    }
  })
})
```

### Paso 5: Inicializar en el bootstrap (`index.ts`)

```typescript
async function main() {
  // 1. OTel ANTES que nada
  initTelemetry()

  // 2. Después: dependencias y servidor
  const postRepository = new PrismaPostRepository()
  const app = await buildServer({ postRepository })
  await app.listen({ port: 3001, host: "0.0.0.0" })
}

// Graceful shutdown: cierra OTel antes de salir
async function shutdown() {
  await disconnectPrisma()
  await shutdownTelemetry()  // <- envía los últimos spans antes de cerrar
  process.exit(0)
}
```

**Orden crítico**: OTel debe inicializarse ANTES de cualquier importación que use instrumentación. Si el servidor arranca antes que OTel, las primeras requests no serán traceadas.

---

## Pipeline Completo de Datos

```
                  ╔══════════════════════╗
                  ║      App Node.js     ║
                  ║                      ║
   POST /api/posts║  ┌────────────────┐  ║
   ───────────────╫─►│ Fastify Handler │  ║
                  ║  │ (span automático)│  ║
                  ║  └───────┬────────┘  ║
                  ║          │            ║
                  ║  ┌───────▼────────┐  ║
                  ║  │ startSpan()    │  ║
                  ║  │ "crear-post"  │  ║  ← span manual
                  ║  │ (atributos)   │  ║
                  ║  └───────┬────────┘  ║
                  ║          │            ║
                  ║  ┌───────▼────────┐  ║
                  ║  │ PostRepository │  ║
                  ║  │ (Prisma)       │  ║
                  ║  │ (span autom.   │  ║
                  ║  │  de PG)        │  ║
                  ║  └───────┬────────┘  ║
                  ║          │            ║
                  ║  logger.info(         ║
                  ║   {event:             ║
                  ║    "post.created",    ║
                  ║    trace_id,          ║
                  ║    span_id})          ║
                  ║          │            ║
                  ╚══════════╪════════════╝
                             │ OTLP HTTP (4318)
                             ▼
                  ┌─────────────────────┐
                  │   OTel Collector    │
                  │  ┌───┬───┬────────┐ │
                  │  │   │   │        │ │
                  │  ▼   ▼   ▼        │ │
                  │ LOKI TEMPO MIMIR  │ │
                  └──┬───┬───┬────────┘ │
                     │   │   │          │
                     ▼   ▼   ▼          │
                  ┌─────────────────────┐
                  │      Grafana        │
                  │  - Dashboard RED    │
                  │  - Dashboard Logs   │
                  │  - Dashboard Traces │
                  └─────────────────────┘
```

---

## Lo que ve el alumno en Grafana

### 1. Métricas RED (Mimir)

```promql
# Rate: requests por segundo
rate(http_server_duration_ms_count[5m])

# Errors: requests con status 5xx
rate(http_server_duration_ms_count{http_status_code=~"5.."}[5m])

# Latencia p95
histogram_quantile(0.95, rate(http_server_duration_ms_bucket[5m]))
```

### 2. Logs (Loki)

```logql
# Todos los logs del backend
{service_name="taller-backend"}

# Solo logs de creación de posts
{service_name="taller-backend"} |= "post.created"

# Solo errores
{service_name="taller-backend"} |= "error"
```

### 3. Trazas (Tempo)

```traceql
# Todas las trazas del backend
{service.name="taller-backend"}

# Spans lentos (>100ms)
{service.name="taller-backend"} | span.duration > 100ms
```

---

## Lo que NO se ve pero está pasando

Cuando el alumno crea un post desde la UI, esto sucede por debajo:

```
1. POST /api/posts (Frontend → Backend)
2. Fastify crea span automático [http.request] (2ms)
3. startSpan("crear-post") crea span manual [crear-post] (5ms)
   ├─ Atributo: post.title = "Mi post"
   ├─ Atributo: post.author = "Alumno"
   ├─ Atributo: post.id = "01HXYZ..."
   ├─ Prisma genera span [pg.query] (1ms)
   │   └─ SELECT/INSERT en PostgreSQL
   ├─ logger.info() genera log con trace_id
   │   └─ Pino instrumentation lo envía vía OTLP
   └─ span se cierra con status OK
4. Span [http.request] se cierra con status 200
5. Métricas: http_server_duration_ms_count +1
6. Cada 5s: métricas se exportan a Mimir
7. En tiempo real: logs llegan a Loki
8. Inmediatamente: trazas disponibles en Tempo
```

**TODO automático**, sin que el alumno haya escrito una línea de código de observabilidad.

---

## Ejercicios para el Aula

### Ejercicio 1: Explorar una traza
1. Crear un post desde la UI
2. Ir a Explore > Tempo
3. Buscar `{service.name="taller-backend"}`
4. Click en una traza
5. Identificar: ¿cuántos spans tiene? ¿cuánto tardó cada uno?

### Ejercicio 2: Correlacionar logs y trazas
1. En Tempo, abrir una traza
2. Copiar el `trace_id`
3. Ir a Explore > Loki
4. Buscar `{service_name="taller-backend"} |= "<trace_id>"`
5. Ver el log que corresponde a esa traza

### Ejercicio 3: Forzar un error y observarlo
1. Ir a la UI, crear un post SIN título
2. Ir a Explore > Loki: buscar `{service_name="taller-backend"} |= "validation"`
3. Ir a Explore > Mimir: `rate(http_server_duration_ms_count{http_status_code="400"}[5m])`
4. Ver el error en 3 señales distintas

### Ejercicio 4: Crear un panel en el dashboard
1. Ir a Dashboards > New > New Dashboard
2. Agregar panel: métrica de rate de requests
3. Agregar panel: logs filtrados por evento
4. Agregar panel: últimas trazas

---

## Referencias

- OpenTelemetry Documentation: https://opentelemetry.io/docs/
- OTel JS Repository: https://github.com/open-telemetry/opentelemetry-js
- Semantic Conventions: https://opentelemetry.io/docs/specs/semconv/
- Grafana + OTel: https://grafana.com/docs/grafana/latest/datasources/tempo/
