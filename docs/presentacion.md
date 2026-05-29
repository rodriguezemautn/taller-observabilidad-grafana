---
marp: true
theme: uncover
class:
  - lead
  - invert
paginate: true
header: "Taller de Observabilidad con Grafana"
footer: "Ing. y Calidad de Software — 2026"
style: |
  :root {
    --color-primary: #FF671D;
    --color-secondary: #1E6BFF;
    --color-accent: #00D9A6;
    --color-dark: #1A1A2E;
    --color-bg: #FFFFFF;
    --color-text: #333333;
    --color-light: #F5F7FA;
    --color-border: #E2E8F0;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }
  section {
    background: var(--color-bg);
    color: var(--color-text);
    padding: 40px;
  }
  section.lead {
    background: linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%);
    color: white;
  }
  section.lead h1 { color: white; font-size: 2.8em; }
  section.lead p { color: #CCD6F6; }
  section.section-title {
    background: linear-gradient(135deg, #FF671D 0%, #FF8A4C 100%);
    color: white;
  }
  section.section-title h2 { color: white; font-size: 2.2em; text-align: center; }
  section.section-title p { color: rgba(255,255,255,0.9); text-align: center; }
  h1, h2, h3 { color: var(--color-dark); }
  h1 { font-size: 2em; }
  h2 { font-size: 1.6em; border-bottom: 3px solid var(--color-primary); padding-bottom: 8px; }
  h3 { font-size: 1.2em; color: var(--color-primary); }
  a { color: var(--color-secondary); }
  code {
    background: #F0F2F5;
    color: #E74C3C;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 0.85em;
  }
  pre {
    background: #1A1A2E;
    border-radius: 8px;
    padding: 16px;
    border-left: 4px solid var(--color-primary);
  }
  pre code {
    background: transparent;
    color: #E8E8E8;
    padding: 0;
    font-size: 0.75em;
    line-height: 1.5;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 0.85em;
  }
  th { background: var(--color-primary); color: white; padding: 8px 12px; }
  td { border: 1px solid var(--color-border); padding: 8px 12px; }
  tr:nth-child(even) { background: var(--color-light); }
  blockquote {
    border-left: 4px solid var(--color-primary);
    background: #FFF5ED;
    padding: 12px 20px;
    border-radius: 0 8px 8px 0;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
  }
  .card {
    background: var(--color-light);
    border-radius: 12px;
    padding: 20px;
    border: 1px solid var(--color-border);
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  .card-primary {
    background: #FFF5ED;
    border-left: 4px solid var(--color-primary);
  }
  .card-blue {
    background: #EDF2FF;
    border-left: 4px solid var(--color-secondary);
  }
  .card-green {
    background: #EDFDF5;
    border-left: 4px solid var(--color-accent);
  }
  .card-dark {
    background: var(--color-dark);
    color: white;
    border-radius: 12px;
    padding: 20px;
  }
  .card-dark code { background: rgba(255,255,255,0.1); color: #FFD700; }
  .step {
    display: inline-block;
    background: var(--color-primary);
    color: white;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-weight: bold;
    margin-right: 8px;
  }
  .tag {
    display: inline-block;
    background: var(--color-primary);
    color: white;
    border-radius: 4px;
    padding: 2px 10px;
    font-size: 0.7em;
    font-weight: bold;
    text-transform: uppercase;
  }
  .tag-blue { background: var(--color-secondary); }
  .tag-green { background: var(--color-accent); color: #1A1A2E; }
  .tag-dark { background: var(--color-dark); }
  .pillar {
    text-align: center;
    padding: 24px 16px;
    border-radius: 12px;
    font-weight: bold;
    font-size: 1.1em;
  }
  .divider {
    width: 60px;
    height: 4px;
    background: var(--color-primary);
    margin: 16px 0;
    border-radius: 2px;
  }
  .emoji-big { font-size: 2.5em; display: block; text-align: center; margin-bottom: 8px; }
  img[alt~="center"] {
    display: block;
    margin: 0 auto;
  }
  ul { line-height: 1.8; }
  li { margin-bottom: 4px; }
  .columns { display: flex; gap: 24px; }
  .columns > * { flex: 1; }
---

<!-- _class: lead -->

# Taller de Observabilidad<br>con **Grafana**

## OpenTelemetry + LGTM Stack + Práctica en Aula

<div class="divider" style="margin: 24px auto; background: #FF671D;"></div>

**Ingeniería y Calidad de Software** — 2026

![center width:200](public/assets/grafana-logo.png)

---

<!-- _class: section-title -->

# Agenda

---

## Agenda

<div class="columns">
<div>

### Parte I — Teoría (20 min)

1. ¿Qué es observabilidad?
2. Monitoreo vs Observabilidad
3. Los 3 pilares + OpenTelemetry
4. Stack LGTM
5. Arquitectura del taller

</div>
<div>

### Parte II — Laboratorio (35 min)

6. Setup del entorno
7. Explorar Grafana
8. Métricas con Mimir
9. Logs con Loki
10. Trazas con Tempo
11. Dashboard completo

</div>
</div>

<br>

<div class="card card-dark">
<strong>⏱ Objetivo:</strong> Al finalizar, vas a poder aplicar una capa de observabilidad a tu TP integrador usando Grafana + OpenTelemetry.
</div>

---

<!-- _class: section-title -->

# Parte I: Teoría

## Conceptos fundamentales de observabilidad

---

## ¿Qué es Observabilidad?

<div class="columns">
<div class="card card-primary">

### Definición

> **Observabilidad** es la capacidad de entender el estado interno de un sistema a partir de sus **señales externas** (telemetría).

Sin observabilidad, un sistema es una **caja negra**: solo sabés que funciona... hasta que deja de funcionar.

</div>
<div class="card card-blue">

### En Ingeniería de Software

Según el **SWEBOK v4** (KA 06), la observabilidad se integra en:

- **Operaciones**: monitoreo continuo de KPIs
- **Construcción**: logs y registros para verificación
- **Mantenimiento**: diagnóstico de fallas en producción
- **Calidad**: validación de confiabilidad y disponibilidad

</div>
</div>

---

## Monitoreo vs Observabilidad

<div class="columns">
<div class="card card-primary">

### 🔴 Monitoreo Tradicional

- Sabés **qué** medir de antemano
- Dashboards fijos
- "¿Está caído?"
- **Reactivo**
- Alertas que ignoramos

</div>
<div class="card card-green">

### 🟢 Observabilidad

- Podés hacer **preguntas nuevas** sin deployar
- Exploración interactiva
- "¿Por qué está lento?"
- **Proactivo**
- Descubrís lo inesperado

</div>
</div>

<br>

> **El monitoreo te dice que algo anda mal. La observabilidad te dice POR QUÉ.**

---

## Los 3 Pilares de la Observabilidad

<div class="grid-3">
<div class="card card-primary pillar">

<span class="emoji-big">📈</span>

**Métricas**

Datos cuantitativos en el tiempo

- Rate de requests
- Uso de CPU/RAM
- Latencia percentiles

</div>
<div class="card card-blue pillar">

<span class="emoji-big">📝</span>

**Logs**

Eventos discretos estructurados

- "Post creado exitosamente"
- Error con stack trace
- JSON con contexto

</div>
<div class="card card-green pillar">

<span class="emoji-big">🔍</span>

**Trazas**

Recorrido de una petición

- HTTP → Controller → DB
- Spans con duración
- Tracing distribuido

</div>
</div>

<br>

<div class="card-dark" style="text-align:center;">
<strong>💡 Clave:</strong> La correlación entre las 3 señales se logra mediante el <strong>trace_id</strong> — un identificador único que viaja en cada log, métrica y traza.
</div>

---

## Métricas: Framework RED

<div class="columns">
<div>

**Para servicios** — ¿Qué medir?

| Señal | Pregunta |
|-------|----------|
| **R**ate | ¿Cuántos requests por segundo? |
| **E**rrors | ¿Cuántos errores? |
| **D**uration | ¿Cuánto tarda? |

</div>
<div>

**Consulta en Mimir (PromQL):**

```promql
// Rate de requests
rate(http_server_duration_ms_count[5m])

// Tasa de errores
rate(http_requests_total{status=~"5.."}[5m])

// Latencia p95
histogram_quantile(0.95,
  rate(http_duration_bucket[5m]))
```

</div>
</div>

<div class="card card-primary">
<strong>📐 Las 4 Señales Doradas (SRE):</strong> Latencia · Tráfico · Errores · Saturación
</div>

---

## Logs: Estructurados vs Texto Libre

<div class="columns">
<div class="card card-primary">

### ❌ Log de texto libre

```
2024-05-29 12:00:00 Post creado
2024-05-29 12:00:01 Error al crear post
```

No se puede filtrar por campo.
No hay correlación con trazas.

</div>
<div class="card card-green">

### ✅ Log estructurado (JSON)

```json
{
  "level": 30,
  "time": 1717000000,
  "event": "post.created",
  "postId": "01HXYZ...",
  "trace_id": "abc123...",
  "span_id": "def456..."
}
```

Filtrable por `event`, `postId`.
Correlacionado con trazas via `trace_id`.

</div>
</div>

<br>

<div class="card card-blue">
<strong>💡 Regla:</strong> Cada log debe tener un <strong>event</strong> único y buscable. Ej: <code>user.created</code>, <code>payment.failed</code>, <code>auth.login</code>
</div>

---

## Trazas: Tracing Distribuido

<div class="card card-dark">

```
GET /api/posts — 8ms
  │
  ├─ [HTTP] router ── 2ms
  │
  ├─ [Handler] listar-posts ── 5ms
  │    │
  │    └─ [DB] SELECT * FROM posts ── 1ms
  │
  └─ [Response] JSON ── 1ms
```

</div>

<div class="columns" style="margin-top: 16px;">
<div class="card card-primary">

### Componentes de un Span

- **Nombre**: qué operación
- **Duración**: cuánto tardó
- **Atributos**: post.id, http.method
- **Eventos**: error, exception
- **Contexto**: trace_id, span_id

</div>
<div class="card card-blue">

### ¿Por qué son importantes?

- Identificar **cuellos de botella**
- Seguir una petición **entre servicios**
- Reducir **MTTR** (tiempo de reparación)
- Entender **causa raíz** de fallos

</div>
</div>

---

## OpenTelemetry: El Estándar

<div class="columns">
<div>

![center width:300](public/assets/opentelemetry.png)

### API + SDK + Collector

**Problema original:** Cada proveedor tenía su propio SDK (Datadog, New Relic, AWS X-Ray).

**Solución OTel:** Instrumentás una vez, enviás a cualquier backend.

</div>
<div>

### Arquitectura

```
┌──────────┐   ┌──────────────┐   ┌──────────┐
│  App SDK  │──►│   Collector  │──►│  Backend │
│ (traces,  │   │ (recibe,     │   │ (Grafana,│
│  metrics, │   │  procesa,    │   │  Datadog,│
│  logs)    │   │  exporta)    │   │  etc.)   │
└──────────┘   └──────────────┘   └──────────┘
```

</div>
</div>

<div class="card card-primary" style="margin-top: 16px;">
<strong>✅ Ventaja:</strong> OTel es neutral — no hay vendor lock-in. Podés cambiar de backend sin re-instrumentar.
</div>

---

## Stack LGTM de Grafana

<div class="grid-3">
<div class="card card-primary">

### 📝 Loki
Logs

- Almacena logs etiquetados
- No indexa contenido
- Eficiente en costos

</div>
<div class="card card-blue">

### 📊 Grafana
Visualización

- Dashboards unificados
- 40+ datasources
- Alertas contextuales

</div>
<div class="card card-green">

### 🔍 Tempo
Trazas

- Rastreo distribuido
- Escala masiva
- Integración OTel nativa

</div>
</div>

<div style="text-align:center; margin-top: 16px;">
<div class="card card-dark" style="display:inline-block; text-align:left;">

**Mimir** 📈 — Métricas de series temporales (compatible con Prometheus)

</div>
</div>

---

## Pipeline Completo

```
                  ┌──────────────┐
                  │  App Node.js  │
                  │  (OTel SDK)   │
                  └──────┬───────┘
                         │ OTLP
                         ▼
                  ┌──────────────┐
                  │  OTel Collector │
                  └──┬────┬────┬──┘
                     │    │    │
               ┌─────┘    │    └──────┐
               ▼          ▼           ▼
          ┌────────┐ ┌────────┐ ┌────────┐
          │  Loki  │ │ Tempo  │ │ Mimir  │
          │ (logs) │ │(trazas)│ │(métric)│
          └────┬───┘ └───┬────┘ └───┬────┘
               └────┬────┴──────────┘
                    ▼
             ┌──────────┐
             │ Grafana  │
             │  :3000   │
             └──────────┘
```

---

## Arquitectura del Taller

<div class="grid-3">
<div class="card card-green">

### 🖥️ Frontend

React 19 + Chakra UI
Vite + TypeScript

- PostList (consume API)
- PostForm (crea posts)

</div>
<div class="card card-primary">

### ⚙️ Backend

Fastify + Prisma + PostgreSQL
Arquitectura Hexagonal

- Core: dominio puro
- Infra: adaptadores
- OTel: instrumentación

</div>
<div class="card card-blue">

### 🐳 Infraestructura

Docker Compose (7 servicios)

- PostgreSQL
- OTel Collector
- Loki + Tempo + Mimir
- Grafana

</div>
</div>

---

## Arquitectura Hexagonal

```
┌──────────────────────────────────────────┐
│           Driving Adapters                │
│    Rutas Fastify (controladores HTTP)     │
│    startSpan() + logger.info()            │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│           Puertos (Interfaces)            │
│    CreatePostUseCase, PostRepository      │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│        Core (Dominio Puro)                │
│    Entidad Post, Casos de Uso             │
│    SIN dependencias externas              │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│           Driven Adapters                 │
│    PrismaPostRepository → PostgreSQL      │
└──────────────────────────────────────────┘
```

---

<!-- _class: section-title -->

# Parte II: Laboratorio

## Práctica guiada — 35 minutos

---

## Prerrequisitos

<div class="grid-3">
<div class="card card-primary">

<span class="step">1</span> **Docker**

Docker 24+ con Docker Compose v2

</div>
<div class="card card-blue">

<span class="step">2</span> **Git**

Clonar el repositorio del taller

</div>
<div class="card card-green">

<span class="step">3</span> **Navegador**

Chrome / Firefox / Edge

</div>
</div>

<br>

<div class="card card-dark">

```bash
# Clonar el repositorio
git clone https://github.com/rodriguezemautn/taller-observabilidad-grafana.git
cd taller-observabilidad-grafana/docker

# Levantar todo el stack
docker compose up -d

# Verificar que todos los servicios estén corriendo
docker compose ps
```

</div>

---

## Paso 1: Explorar la Aplicación

<div class="columns">
<div>

<span class="tag">1.1</span> **Abrir la app**

```
http://localhost:3001
```

Deberías ver el frontend con:
- Lista de posts (vacía al inicio)
- Pestaña "Crear Post" con formulario

<span class="tag" style="margin-top: 12px;">1.2</span> **Crear posts**

Creá 3 o 4 posts con diferentes títulos y autores.

</div>
<div>

<span class="tag">1.3</span> **Verificar API**

```bash
curl http://localhost:3001/api/posts
```

Debería devolver los posts que creaste.

<span class="tag" style="margin-top: 12px;">💡</span> **Tip**

La app ya está instrumentada con OTel. Mientras vos creás posts, el backend está generando **trazas, métricas y logs** automáticamente. Ahora vamos a verlos en Grafana.

</div>
</div>

---

## Paso 2: Primer Vistazo a Grafana

<div class="columns">
<div>

<span class="tag tag-blue">2.1</span> **Abrir Grafana**

```
http://localhost:3000
```

Usuario: `admin` / Contraseña: `admin`

<span class="tag tag-blue" style="margin-top: 12px;">2.2</span> **Explorar Datasources**

Menú → Connections → Data Sources

Ya deberías ver:
- ✅ **Loki** (logs)
- ✅ **Tempo** (trazas)
- ✅ **Mimir** (métricas)

</div>
<div>

<span class="tag tag-blue">2.3</span> **¿Por qué ya están configurados?**

Grafana usa **provisioning**: los datasources se configuran automáticamente desde archivos YAML montados como volúmenes en Docker.

```yaml
# docker/grafana/datasources.yml
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

</div>
</div>

---

## Paso 3: Métricas con Mimir

<div class="columns">
<div>

<span class="tag tag-green">3.1</span> **Explorar métricas**

Menú → Explore → Datasource: **Mimir**

Ejecutá esta consulta:

```promql
rate(http_server_duration_ms_count[5m])
```

<div class="card card-primary" style="margin-top: 12px;">
<strong>❓ ¿Qué ves?</strong> Una línea que muestra la tasa de requests por segundo. Si creás más posts, la línea sube.
</div>

</div>
<div>

<span class="tag tag-green">3.2</span> **Probar más consultas**

```promql
// Tasa de errores
rate(http_server_duration_ms_count{http_status_code=~"4.."}[5m])
```

Para ver errores: creá un post **sin título** desde la UI.

```promql
// Latencia p95
histogram_quantile(0.95,
  rate(http_server_duration_ms_bucket[5m]))
```

</div>
</div>

---

## Paso 3b: Crear Dashboard RED

<div class="columns">
<div>

<span class="tag tag-green">3.3</span> **Crear Dashboard**

1. Menú → Dashboards → New Dashboard
2. **+ Add visualization**
3. Datasource: **Mimir**
4. Query: la consulta de Rate
5. Panel title: "Rate de Requests"
6. **Apply**

<span class="tag tag-green" style="margin-top: 12px;">3.4</span> **Agregar más paneles**

Repetir para Errors y Duration.

</div>
<div>

<div class="card card-dark">

### 📊 Dashboard RED

| Panel | Query | Unidad |
|-------|-------|--------|
| Rate | `rate(http..._count[5m])` | rps |
| Errors | `rate(http...{status=~"4.."}[5m])` | rps |
| Duration p95 | `histogram_quantile(0.95, rate(http..._bucket[5m]))` | ms |

</div>

<div class="card card-primary" style="margin-top: 12px;">
<strong>🔴 RED = Rate, Errors, Duration</strong>
Framework para monitorear servicios.
</div>

</div>
</div>

---

## Paso 4: Logs con Loki

<div class="columns">
<div>

<span class="tag">4.1</span> **Explorar logs**

Explore → Datasource: **Loki**

```logql
{service_name="taller-backend"}
```

<span class="tag" style="margin-top: 12px;">4.2</span> **Logs en vivo**

Creá un post desde la UI y mirá cómo aparece el log en tiempo real en Loki.

</div>
<div>

<span class="tag">4.3</span> **Filtrar por evento**

```logql
{service_name="taller-backend"} |= "post.created"
```

<span class="tag" style="margin-top: 12px;">4.4</span> **Ver errores**

```logql
{service_name="taller-backend"} |= "error"
```

<div class="card card-blue" style="margin-top: 12px;">
<strong>💡 Correlación:</strong> Cada log contiene <code>trace_id</code>. Hacé click en uno para ir a la traza en Tempo.
</div>

</div>
</div>

---

## Paso 4b: Agregar Logs al Dashboard

<div class="columns">
<div>

<span class="tag">4.5</span> **Agregar panel de logs**

Volvé al dashboard que creaste antes.

1. **+ Add** → **+ Add visualization**
2. Datasource: **Loki**
3. Query: `{service_name="taller-backend"}`
4. Panel type: **Logs**
5. **Apply**

</div>
<div>

<div class="card card-dark">

### 📋 Logs que genera la app

| Evento | Cuándo ocurre |
|--------|---------------|
| `post.created` | Creación exitosa |
| `post.listed` | Listado de posts |
| `post.found` | Búsqueda por ID |
| `post.validation_error` | Error de validación |
| `post.not_found` | Post inexistente |
| `post.error` | Error interno |

</div>
</div>
</div>

---

## Paso 5: Trazas con Tempo

<div class="columns">
<div>

<span class="tag tag-blue">5.1</span> **Buscar trazas**

Explore → Datasource: **Tempo**

```traceql
{service.name="taller-backend"}
```

<span class="tag tag-blue" style="margin-top: 12px;">5.2</span> **Explorar una traza**

Hacé click en una traza. Vas a ver:

```
POST /api/posts (HTTP span)
  └─ crear-post (span manual)
       └─ prisma:post.create (DB span)
```

</div>
<div>

<span class="tag tag-blue">5.3</span> **Identificar lentitud**

Buscá spans lentos:

```traceql
{service.name="taller-backend"} 
| span.duration > 50ms
```

<div class="card card-green" style="margin-top: 12px;">
<strong>🔍 Cada span tiene:</strong>
- Nombre de la operación
- Duración exacta
- Atributos (post.id, etc.)
- Trace ID para correlación
</div>

</div>
</div>

---

## Paso 5b: Agregar Trazas al Dashboard

<div class="columns">
<div>

<span class="tag tag-blue">5.4</span> **Agregar panel de trazas**

1. **+ Add** → **+ Add visualization**
2. Datasource: **Tempo**
3. Query: `{service.name="taller-backend"}`
4. Panel type: **Trace List**
5. **Apply**

</div>
<div>

<div class="card card-dark">

### 🏁 Dashboard Completo

```
┌────────────────────────────┐
│ 📊 Panel: Rate de Requests │ ← Mimir
├────────────────────────────┤
│ 📊 Panel: Tasa de Errores  │ ← Mimir
├────────────────────────────┤
│ 📊 Panel: Latencia p95     │ ← Mimir
├────────────────────────────┤
│ 📝 Panel: Logs en vivo      │ ← Loki
├────────────────────────────┤
│ 🔍 Panel: Últimas Trazas   │ ← Tempo
└────────────────────────────┘
```

</div>
</div>
</div>

---

## Ejercicios para Seguir Explorando

<div class="grid-3">
<div class="card card-primary">

### 📝 Ejercicio 1

**Correlacionar logs y trazas**

1. En Tempo, abrí una traza
2. Copiá el `trace_id`
3. En Loki, buscá: `{...} |= "trace_id"`
4. ¿Qué ves?

</div>
<div class="card card-blue">

### 🔬 Ejercicio 2

**Forzar un error**

1. Creá un post sin título
2. Buscalo en Loki: `|= "validation"`
3. ¿Cómo aparece el error?
4. ¿ Qué status code devolvió?

</div>
<div class="card card-green">

### 🎯 Ejercicio 3

**Explorar spans lentos**

1. Buscá: `{...} | span.duration > 100ms`
2. ¿Hay spans lentos?
3. ¿Cuál es el cuello de botella?
4. ¿Cómo mejorarías eso?

</div>
</div>

---

## ¿Cómo aplicar esto a tu TP?

<div class="columns">
<div class="card card-primary">

### Stack del TP

Si tu TP usa **cualquier** stack moderno:

| Tecnología | ¿Funciona con OTel? |
|------------|:-------------------:|
| Express / Fastify | ✅ Automático |
| Prisma / TypeORM | ✅ Automático |
| React / Vue / Angular | ✅ Manual |
| PostgreSQL / MySQL | ✅ Automático |
| Redis / RabbitMQ | ✅ Automático |

</div>
<div class="card card-green">

### Pasos para tu proyecto

1. Agregar servicios LGTM al `docker-compose.yml`
2. Instalar paquetes OTel
3. Inicializar SDK antes del servidor
4. Reemplazar `console.log` por `logger.info`
5. Envolver operaciones clave con `startSpan()`
6. Crear dashboards en Grafana

**⏱ Tiempo estimado: 3-6 horas**

</div>
</div>

---

## Conceptos Clave — Resumen

<div class="grid-3">
<div class="card card-dark">

### 📈 Métricas

Framework **RED**:
Rate, Errors, Duration

Se generan automáticamente
con OTel

</div>
<div class="card card-dark">

### 📝 Logs

**Estructurados** con:
- event único
- trace_id y span_id
- JSON siempre

</div>
<div class="card card-dark">

### 🔍 Trazas

**Spans** con:
- Nombre de operación
- Duración
- Atributos de negocio
- Correlación con logs

</div>
</div>

<br>

<div class="grid-3">
<div class="card card-dark">

### 🔗 OTel

Estándar neutral
Una instrumentación
cualquier backend

</div>
<div class="card card-dark">

### 🐳 Docker

LGTM en 7 servicios
Un solo comando:
`docker compose up`

</div>
<div class="card card-dark">

### 📊 Grafana

Provisioning automático
Datasources + Dashboards
Sin clicks manuales

</div>
</div>

---

## Recursos

<div class="columns">
<div>

### 📚 Notas del Taller

Todas en `notas-academicas/`:

- `12-integracion-conceptos.md` — Mapa conceptual
- `11-otel-instrumentacion.md` — OTel paso a paso
- `06-grafana-docker.md` — Grafana + Docker
- `13-agregar-observabilidad.md` — Guía para TP

</div>
<div>

### 🔗 Links

- **Repositorio**: [github.com/rodriguezemautn/taller-observabilidad-grafana](https://github.com/rodriguezemautn/taller-observabilidad-grafana)
- **Documentación OTel**: opentelemetry.io/docs/
- **Grafana Docs**: grafana.com/docs/
- **SWEBOK v4**: IEEE Computer Society

### 📖 Libros Clave

- "Site Reliability Engineering" (Google)
- "The Art of Monitoring" (Turnbull)
- "Clean Architecture" (Martin)

</div>
</div>

---

<!-- _class: lead -->

# Gracias

<div class="divider" style="margin: 24px auto; background: #FF671D;"></div>

## La observabilidad no es un producto.
## Es una **capacidad de ingeniería**.

<br>

> *"You can't improve what you can't measure."*
> — Peter Drucker

<br>

![center width:150](public/assets/grot.svg)
