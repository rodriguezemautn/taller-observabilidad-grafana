# Observabilidad en Ingeniería de Software: Mapa Integrador

## Acerca de esta nota

Esta nota **integra todos los conceptos** del taller y **referencia las notas académicas** específicas de cada tema. Es el punto de partida: leela primero para tener el mapa mental, y profundizá en las notas referenciadas según lo que necesites.

---

## 1. ¿Qué es la Observabilidad?

> **Observabilidad** es la capacidad de entender el estado interno de un sistema a partir de sus señales externas (telemetría).

No es "tener herramientas de monitoreo". Es una **capacidad de ingeniería** que permite hacer preguntas nuevas sobre el sistema sin tener que deployar código nuevo.

### Monitoreo ≠ Observabilidad

| Monitoreo | Observabilidad |
|-----------|---------------|
| Sabés lo que querés medir de antemano | Podés descubrir problemas inesperados |
| Dashboards fijos | Exploración interactiva |
| "¿Está caído?" | "¿Por qué está lento?" |
| Reactivo | Proactivo |

> **Ver**: `00-intro.md` — Conceptos fundamentales y estándares ISO
> **Ver**: `03-swebok.md` — La observabilidad en el SWEBOK v4 (KA 06: Software Engineering Operations)

---

## 2. El Stack Tecnológico

El taller construye una aplicación completa con **3 capas** que se comunican entre sí:

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                              │
│       React 19 + Chakra UI (Vite)                       │
│   Componentes: PostList, PostForm                       │
│   Cliente HTTP: fetch() a /api/posts                    │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP (con traceparent header)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    BACKEND (Fastify)                     │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │  Driving Adapter (HTTP)                         │   │
│   │  Rutas → startSpan() → logger.info()            │   │
│   └────────────────────┬────────────────────────────┘   │
│                        │                                 │
│   ┌────────────────────▼────────────────────────────┐   │
│   │  Core (Dominio Puro)                            │   │
│   │  Entidad Post, Casos de Uso, Puertos            │   │
│   │  SIN dependencias externas                       │   │
│   └────────────────────┬────────────────────────────┘   │
│                        │                                 │
│   ┌────────────────────▼────────────────────────────┐   │
│   │  Driven Adapter (Persistencia)                  │   │
│   │  PrismaPostRepository → PostgreSQL              │   │
│   └─────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────┘
                           │ OTLP (OpenTelemetry Protocol)
                           ▼
┌─────────────────────────────────────────────────────────┐
│              OBSERVABILIDAD (Grafana LGTM)               │
│                                                         │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│   │  Loki    │  │  Tempo   │  │  Mimir   │              │
│   │  (logs)  │  │ (trazas) │  │(métricas)│              │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│        └──────────┬──┴─────────────┘                    │
│                   ▼                                      │
│             ┌──────────┐                                 │
│             │ Grafana  │                                 │
│             │ (3000)   │                                 │
│             └──────────┘                                 │
└─────────────────────────────────────────────────────────┘
```

> **Ver**: `07-typescript.md` — Tipado en todo el stack
> **Ver**: `08-react-chakra.md` — Componentes del frontend
> **Ver**: `09-prisma-postgresql.md` — Persistencia con Prisma
> **Ver**: `10-fastify.md` — Servidor HTTP y plugins

---

## 3. Arquitectura Hexagonal (Puertos y Adaptadores)

El backend está organizado en **Arquitectura Hexagonal**, también llamada **Puertos y Adaptadores**.

### El Principio

> **El dominio no debe depender de nada externo. Las dependencias apuntan hacia adentro.**

### Cómo se aplica en el taller

```
packages/
├── core/                     ← Núcleo: NO tiene dependencias externas
│   └── src/
│       ├── domain/           ← Entidades, Value Objects
│       │   ├── post.entity.ts
│       │   ├── types.ts
│       │   ├── errors.ts
│       │   └── ports/        ← INTERFACES (puertos)
│       │       └── post.repository.ts
│       └── application/
│           └── use-cases/    ← Casos de uso (lógica de negocio)
│               ├── create-post.use-case.ts
│               ├── list-posts.use-case.ts
│               └── get-post.use-case.ts
│
└── infrastructure/           ← Implementaciones concretas
    └── src/
        ├── persistence/      ← Driven adapter
        │   └── prisma/
        │       └── repository.ts  ← IMPLEMENTA PostRepository
        └── http/             ← Driving adapter
            └── fastify/
                └── routes/posts.ts  ← USA casos de uso
```

### Tipos de Puertos

| Tipo | También llamado | Ejemplo en el código |
|------|----------------|---------------------|
| **Driving Port** | Puerto de entrada | `CreatePostUseCase` — define cómo el exterior USA el core |
| **Driven Port** | Puerto de salida | `PostRepository` — define cómo el core QUIERE guardar datos |

### Tipos de Adaptadores

| Tipo | También llamado | Ejemplo en el código |
|------|----------------|---------------------|
| **Driving Adapter** | Adaptador de entrada | Rutas Fastify — convierten HTTP en llamadas a casos de uso |
| **Driven Adapter** | Adaptador de salida | `PrismaPostRepository` — implementa `PostRepository` usando Prisma |

### ¿Por qué es importante para la observabilidad?

La separación en capas permite **instrumentar CADA capa por separado**:

```
POST /api/posts
  ├─ [Fastify] Driving Adapter  ← traza automática (HTTP)
  ├─ [CreatePostUseCase] Core    ← traza manual (negocio)
  │   └─ [PrismaPostRepository] Driven Adapter ← traza automática (PG)
  └─ [Response]                 ← log con resultado
```

Cada capa aporta una perspectiva distinta a la traza.

> **Ver**: `05-arquitectura-hexagonal.md` — Explicación completa con ejemplos

---

## 4. OpenTelemetry: El Pegamento

OTel es el **puente** entre la aplicación y las herramientas de observabilidad.

### Flujo de Datos

```
App (SDK OTel)
  │
  ├─ Trazas:   cada request HTTP → span automático + spans manuales
  ├─ Métricas: cada request → contadores RED (rate, errors, duration)
  └─ Logs:     cada logger.info() → log estructurado con trace_id
  │
  └─ OTLP (OpenTelemetry Protocol)
      │
      ▼
OTel Collector
  │
  ├─ → Loki   (logs)
  ├─ → Tempo  (trazas)
  └─ → Mimir  (métricas)
      │
      ▼
Grafana (dashboards + exploración)
```

### Las 3 Señales

| Señal | Qué captura | Cómo se genera | Dónde se ve |
|-------|-------------|----------------|-------------|
| **Traza** | Recorrido de una petición (spans) | Automático (Fastify, PG) + Manual (startSpan) | Tempo |
| **Métrica** | Datos cuantitativos agregados | Automático (contadores HTTP) | Mimir |
| **Log** | Evento discreto con timestamp | `logger.info()`, `logger.error()` | Loki |

La **correlación** entre ellas se logra mediante el `trace_id`:
- Cada traza tiene un `trace_id` único
- Cada log lleva el `trace_id` del span activo
- En Grafana, hacés click en un `trace_id` del log y saltás a la traza

> **Ver**: `02-opentelemetry.md` — OpenTelemetry en profundidad (API, SDK, Collector)
> **Ver**: `11-otel-instrumentacion.md` — Paso a paso de la implementación en el código

---

## 5. Métricas: Frameworks RED y USE

No todas las métricas tienen sentido. La industria define dos frameworks para decidir QUÉ medir:

### RED (para servicios)

| Métrica | Pregunta | Query ejemplo en Mimir |
|---------|----------|----------------------|
| **R**ate | ¿Cuántos requests por segundo? | `rate(http_server_duration_ms_count[5m])` |
| **E**rrors | ¿Cuántos errores? | `rate(http...{status=~"5.."}[5m])` |
| **D**uration | ¿Cuánto tarda? | `histogram_quantile(0.95, rate(http..._bucket[5m]))` |

### USE (para infraestructura)

| Métrica | Pregunta |
|---------|----------|
| **U**tilization | ¿Qué % de CPU/RAM se usa? |
| **S**aturation | ¿Hay colas de espera? |
| **E**rrors | ¿Hay errores a nivel de sistema? |

### Las 4 Señales Doradas (SRE de Google)

Si solo podés medir 4 cosas, medí:

1. **Latencia** — ¿cuánto tarda en responder?
2. **Tráfico** — ¿cuántas peticiones por segundo?
3. **Errores** — ¿cuántos requests fallan?
4. **Saturación** — ¿qué tan cerca del límite estás?

> **Ver**: `01-frameworks.md` — SRE, DevOps, métricas
> **Ver**: `06-grafana-docker.md` — Consultas RED/USE en PromQL y LogQL

---

## 6. El Pipeline de Observabilidad

### Con Docker Compose

```yaml
# 7 servicios que conforman el stack completo
services:
  app:              # Backend + Frontend (build local)
  postgres:         # Base de datos
  otel-collector:   # Pipeline de telemetría
  loki:             # Almacenamiento de logs
  tempo:            # Almacenamiento de trazas
  mimir:            # Almacenamiento de métricas
  grafana:          # Visualización y dashboards
```

### Cómo levantar todo

```bash
# Un solo comando
cd docker && docker compose up -d

# Servicios disponibles:
# - http://localhost:3001 → App (CRUD de Posts)
# - http://localhost:3000 → Grafana (admin/admin)
```

### Provisioning vs Configuración Manual

Grafana se configura **automáticamente** al iniciar via provisioning:

```yaml
# docker/grafana/datasources.yml
datasources:
  - name: Loki    # URL: http://loki:3100
  - name: Tempo   # URL: http://tempo:3200
  - name: Mimir   # URL: http://mimir:9009/prometheus
```

Los 3 dashboards (RED, Logs, Trazas) también se cargan automáticamente desde archivos JSON montados como volúmenes.

> **Ver**: `04-grafana.md` — Filosofía "Big Tent" y stack LGTM
> **Ver**: `06-grafana-docker.md` — Configuración completa de Docker + Grafana

---

## 7. Plan de Clase: 60 minutos

### ⏱ 0-5' — Setup
- `git clone`, `docker compose up`
- Mientras levanta: concepto de observabilidad vs monitoreo

### ⏱ 5-10' — Exploración
- Crear posts desde `localhost:3001`
- Entrar a Grafana (`localhost:3000`)
- Ver datasources ya configurados

### ⏱ 10-25' — Métricas (Mimir)
- `rate(http_server_duration_ms_count[5m])`
- Generar error, verlo en métricas
- Framework RED: Rate, Errors, Duration
- **Crear dashboard con panel de métricas**

### ⏱ 25-35' — Logs (Loki)
- `{service_name="taller-backend"}`
- Crear post, ver log en tiempo real
- Filtrar por evento: `|= "post.created"`
- Logs estructurados: JSON con trace_id
- **Agregar panel de logs al dashboard**

### ⏱ 35-45' — Trazas (Tempo)
- `{service.name="taller-backend"}`
- Click en una traza: ver spans (HTTP → negocio → DB)
- Identificar cuello de botella
- **Agregar panel de trazas al dashboard**

### ⏱ 45-55' — Dashboard Final + Conceptos
- Ver el dashboard completo con 3 señales
- 4 señales doradas de SRE
- ¿Cómo aplicar esto al TP integrador?

### ⏱ 55-60' — Cierre
- El código está en GitHub
- Ejercicios para seguir explorando
- La observabilidad es una capacidad, no un producto

---

## 8. Referencia Rápida de Consultas

### PromQL (Mimir) — Métricas

```promql
// Rate de requests total
rate(http_server_duration_ms_count[5m])

// Rate por endpoint
rate(http_server_duration_ms_count{http_route="/api/posts"}[5m])

// Tasa de errores 4xx
rate(http_server_duration_ms_count{http_status_code=~"4.."}[5m])

// Latencia p95
histogram_quantile(0.95, rate(http_server_duration_ms_bucket[5m]))
```

### LogQL (Loki) — Logs

```logql
// Todos los logs
{service_name="taller-backend"}

// Por evento
{service_name="taller-backend"} |= "post.created"

// Por trace_id (correlación con trazas)
{service_name="taller-backend"} |= "01HXYZ..."

// Solo warnings y errors
{service_name="taller-backend"} | json | level > 30
```

### TraceQL (Tempo) — Trazas

```traceql
// Todas las trazas
{service.name="taller-backend"}

// Trazas lentas
{service.name="taller-backend"} | span.duration > 100ms

// Trazas con error
{service.name="taller-backend"} | span.status = error

// Spans de negocio
{service.name="taller-backend"} && name="crear-post"
```

---

## 9. Mapa de Conceptos

```
                        OBSERVABILIDAD
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
         TRAZAS           MÉTRICAS            LOGS
        (Tempo)           (Mimir)           (Loki)
            │                 │                 │
            │            ┌────┴────┐            │
            │            │         │            │
            │           RED       USE           │
            │      (servicios) (infra)          │
            │            │                     │
            └────────────┼─────────────────────┘
                         │
               OpenTelemetry SDK
                         │
                   OTel Collector
                         │
               ┌─────────┴─────────┐
               │                   │
          Docker Compose      Grafana
          (7 servicios)      (dashboards)
               │                   │
               │    ┌──────────────┘
               │    │
          Arquitectura Hexagonal
          (Puertos y Adaptadores)
               │
       ┌───────┴───────┐
       │               │
     Frontend        Backend
     (React +       (Fastify +
      Chakra)        Prisma)
```

---

## 10. Para Seguir Explorando

### Notas del Taller

| # | Archivo | Tema | Duración lectura |
|---|---------|------|-----------------|
| 00 | `00-intro.md` | Estándares ISO, conceptos de observabilidad | 10 min |
| 01 | `01-frameworks.md` | DevOps, SRE, Agile, metodologías | 10 min |
| 02 | `02-opentelemetry.md` | OTel: API, SDK, Collector | 15 min |
| 03 | `03-swebok.md` | Observabilidad en SWEBOK v4 | 10 min |
| 04 | `04-grafana.md` | Grafana y ecosistema LGTM | 15 min |
| 05 | `05-arquitectura-hexagonal.md` | Puertos y Adaptadores | 20 min |
| 06 | `06-grafana-docker.md` | Grafana con Docker + monitoreo | 15 min |
| 07 | `07-typescript.md` | TypeScript en el proyecto | 15 min |
| 08 | `08-react-chakra.md` | React 19 + Chakra UI v3 | 15 min |
| 09 | `09-prisma-postgresql.md` | Prisma ORM + PostgreSQL | 15 min |
| 10 | `10-fastify.md` | Fastify + Pino logger | 15 min |
| **11** | **`11-otel-instrumentacion.md`** | **OTel paso a paso en el código** | **20 min** |

### Referencias Externas

- **OpenTelemetry**: https://opentelemetry.io/docs/
- **Grafana Docs**: https://grafana.com/docs/
- **SWEBOK v4**: IEEE Computer Society, "Guide to the Software Engineering Body of Knowledge"
- **SRE Book**: Beyer et al., "Site Reliability Engineering" (O'Reilly, 2016)
- **The Art of Monitoring**: James Turnbull (2016)
- **Clean Architecture**: Robert C. Martin (Prentice Hall, 2017)
