---
marp: true
theme: uncover
class:
  - lead
paginate: true
header: "Taller de Observabilidad con Grafana"
footer: "Ingeniería y Calidad de Software — 2026"
style: |
  /* ===== VARIABLES ===== */
  :root {
    --primary: #FF671D;
    --primary-light: #FFF0E8;
    --primary-dark: #CC5200;
    --secondary: #1E6BFF;
    --secondary-light: #E8F0FF;
    --accent: #00D9A6;
    --accent-light: #E0FFF5;
    --dark: #1A1A2E;
    --dark-2: #2D2D44;
    --gray-100: #F7F8FA;
    --gray-200: #EDEEF2;
    --gray-300: #D1D5DB;
    --gray-400: #9CA3AF;
    --gray-500: #6B7280;
    --text: #1F2937;
    --text-light: #6B7280;
    --white: #FFFFFF;
    --shadow: 0 4px 16px rgba(0,0,0,0.06);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.1);
    --radius: 12px;
    --radius-sm: 6px;
    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  }

  /* ===== BASE ===== */
  section {
    background: var(--white);
    color: var(--text);
    padding: 48px 56px;
    font-size: 18px;
    line-height: 1.7;
  }

  /* ===== LEAD (PORTADA) ===== */
  section.lead {
    background: linear-gradient(135deg, var(--dark) 0%, #16213E 60%, #0F3460 100%);
    color: var(--white);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section.lead h1 {
    color: var(--white);
    font-size: 3.2em;
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 8px;
    border: none;
  }
  section.lead h1 strong { color: var(--primary); }
  section.lead h2 {
    color: rgba(255,255,255,0.9);
    font-size: 1.4em;
    font-weight: 400;
    border: none;
    margin-top: 0;
  }
  section.lead p { color: var(--gray-400); font-size: 0.95em; }
  section.lead .divider-center {
    width: 80px;
    height: 4px;
    background: var(--primary);
    margin: 20px auto;
    border-radius: 2px;
  }

  /* ===== SECTION TITLE ===== */
  section.section-title {
    background: linear-gradient(135deg, var(--primary) 0%, #FF8A4C 100%);
    color: var(--white);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section.section-title h2 {
    color: var(--white);
    font-size: 2.6em;
    font-weight: 700;
    border: none;
    margin-bottom: 8px;
  }
  section.section-title p {
    color: rgba(255,255,255,0.85);
    font-size: 1.1em;
  }
  section.section-title .divider-center {
    width: 60px;
    height: 3px;
    background: rgba(255,255,255,0.6);
    margin: 16px auto;
    border-radius: 2px;
  }

  /* ===== TYPOGRAPHY ===== */
  h1, h2, h3, h4 { color: var(--dark); margin: 0 0 12px 0; }
  h1 { font-size: 2.4em; font-weight: 700; letter-spacing: -0.5px; }
  h2 {
    font-size: 1.8em;
    font-weight: 700;
    border-bottom: 3px solid var(--primary);
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  h3 { font-size: 1.3em; font-weight: 600; color: var(--dark-2); }
  h4 { font-size: 1.05em; font-weight: 600; color: var(--primary); }
  a { color: var(--secondary); text-decoration: none; }
  a:hover { text-decoration: underline; }
  p { margin: 0 0 12px 0; }

  /* ===== CODE ===== */
  code {
    background: var(--gray-200);
    color: #E74C3C;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 0.85em;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
  }
  pre {
    background: var(--dark);
    border-radius: var(--radius-sm);
    padding: 16px 20px;
    border-left: 4px solid var(--primary);
    margin: 12px 0;
    overflow-x: auto;
  }
  pre code {
    background: transparent;
    color: #E8E8E8;
    padding: 0;
    font-size: 0.75em;
    line-height: 1.6;
    border: none;
  }

  /* ===== TABLES ===== */
  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 0.82em;
    margin: 12px 0;
    border-radius: var(--radius-sm);
    overflow: hidden;
    box-shadow: var(--shadow);
  }
  th {
    background: var(--primary);
    color: var(--white);
    padding: 10px 14px;
    font-weight: 600;
    text-align: left;
  }
  td {
    border: 1px solid var(--gray-200);
    padding: 8px 14px;
  }
  tr:nth-child(even) { background: var(--gray-100); }
  tr:hover { background: var(--primary-light); }

  /* ===== QUOTES ===== */
  blockquote {
    border-left: 4px solid var(--primary);
    background: var(--primary-light);
    padding: 14px 20px;
    margin: 16px 0;
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    font-style: italic;
    color: var(--text);
  }
  blockquote strong { color: var(--primary); font-style: normal; }

  /* ===== CARDS ===== */
  .card {
    border-radius: var(--radius);
    padding: 20px 24px;
    border: 1px solid var(--gray-200);
    box-shadow: var(--shadow);
    margin-bottom: 12px;
  }
  .card-light { background: var(--gray-100); }
  .card-orange { background: var(--primary-light); border-left: 4px solid var(--primary); }
  .card-blue { background: var(--secondary-light); border-left: 4px solid var(--secondary); }
  .card-green { background: var(--accent-light); border-left: 4px solid var(--accent); }
  .card-dark {
    background: var(--dark);
    color: var(--white);
    border: none;
  }
  .card-dark code { background: rgba(255,255,255,0.1); color: #FFD700; }
  .card-dark h4 { color: var(--primary); }
  .card-dark strong { color: var(--accent); }

  /* ===== GRID ===== */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
  }
  .grid-4 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 12px;
  }

  /* ===== COMPONENTS ===== */
  .tag {
    display: inline-block;
    font-size: 0.65em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-radius: 4px;
    padding: 3px 10px;
    margin-bottom: 6px;
  }
  .tag-orange { background: var(--primary); color: var(--white); }
  .tag-blue { background: var(--secondary); color: var(--white); }
  .tag-green { background: var(--accent); color: var(--dark); }
  .tag-dark { background: var(--dark); color: var(--white); }

  .step {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--primary);
    color: var(--white);
    font-weight: 700;
    font-size: 0.8em;
    margin-right: 8px;
    flex-shrink: 0;
  }
  .step-blue { background: var(--secondary); }
  .step-green { background: var(--accent); color: var(--dark); }

  .pillar-box {
    text-align: center;
    padding: 24px 16px;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    border: 1px solid var(--gray-200);
  }

  .divider {
    width: 100%;
    height: 1px;
    background: var(--gray-300);
    margin: 20px 0;
  }
  .divider-short {
    width: 60px;
    height: 4px;
    background: var(--primary);
    margin: 16px 0;
    border-radius: 2px;
  }

  .icon { font-size: 2em; display: block; margin-bottom: 8px; }

  img[alt~="center"] {
    display: block;
    margin: 0 auto;
  }
  img[alt~="right"] {
    display: block;
    margin-left: auto;
  }

  ul, ol { margin: 8px 0; padding-left: 24px; }
  li { margin-bottom: 6px; }
  li strong { color: var(--primary); }

  .flex { display: flex; gap: 20px; align-items: center; }
  .flex-1 { flex: 1; }
  .text-center { text-align: center; }
  .text-small { font-size: 0.8em; color: var(--text-light); }

  .diagram-box {
    background: var(--gray-100);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius);
    padding: 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.75em;
    line-height: 1.7;
  }
  .diagram-box .arrow { color: var(--primary); font-weight: bold; }
  .diagram-box .highlight { color: var(--primary); font-weight: bold; }
  .diagram-box .dim { color: var(--gray-400); }

  .query-sample {
    background: var(--dark);
    color: #E8E8E8;
    border-radius: var(--radius-sm);
    padding: 12px 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72em;
    line-height: 1.5;
    margin: 8px 0;
  }
  .query-sample .kw { color: #FFD700; }
  .query-sample .fn { color: #00D9A6; }
  .query-sample .str { color: #FF8A4C; }
  .query-sample .cmt { color: var(--gray-400); }
---

<!-- _class: lead -->

# Taller de Observabilidad<br>con <strong>Grafana</strong>

<div class="divider-center"></div>

### OpenTelemetry + LGTM Stack + Práctica en Aula

<br>
<br>

Ingeniería y Calidad de Software — 2026

![center width:180](public/assets/grafana-logo.png)

---

## Agenda

<div class="grid-2">
<div>

### Parte I — Teoría <span class="text-small">(20 min)</span>

<div class="card card-light" style="padding: 12px 16px;">

1. ¿Qué es observabilidad?
2. Monitoreo vs Observabilidad
3. Los 3 pilares
4. Métricas, Logs, Trazas
5. OpenTelemetry
6. Stack LGTM
7. Pipeline completo
8. Arquitectura del taller

</div>
</div>
<div>

### Parte II — Laboratorio <span class="text-small">(35 min)</span>

<div class="card card-light" style="padding: 12px 16px;">

1. Setup con Docker Compose
2. Explorar la app
3. Métricas con Mimir
4. Logs con Loki
5. Trazas con Tempo
6. Dashboard completo
7. Ejercicios
8. Aplicación al TP

</div>
</div>
</div>

<div class="card card-dark text-center" style="margin-top: 8px;">
<strong>⏱ Objetivo:</strong> Al finalizar, vas a poder aplicar una capa de observabilidad a tu TP integrador usando Grafana + OpenTelemetry.
</div>

---

<!-- _class: section-title -->

# Parte I: Teoría

<div class="divider-center"></div>
Conceptos fundamentales de observabilidad en ingeniería de software

---

## ¿Qué es Observabilidad?

<div class="grid-2">
<div>

### Definición

El término proviene de la **teoría de control**: un sistema es observable si podés entender su estado interno midiendo sus salidas externas.

> **Observabilidad** es la capacidad de inferir el estado interno de un sistema a partir de sus **señales externas** (telemetría).

</div>
<div>

### ¿Por qué ahora?

Los sistemas modernos son:
- **Distribuidos**: microservicios, colas, APIs
- **Dinámicos**: containers que nacen y mueren
- **Complejos**: decenas de tecnologías distintas

Sin observabilidad, son **cajas negras**. Sabés que funcionan... hasta que dejan de funcionar.

</div>
</div>

<div class="card card-dark">

**📚 Según el SWEBOK v4** (Guide to the Software Engineering Body of Knowledge): la observabilidad se integra en el área de **Software Engineering Operations** (KA 06), abarcando monitoreo, telemetría y retroalimentación continua en todas las capas del stack.

</div>

---

## Monitoreo vs Observabilidad

<div class="grid-2">
<div class="card card-orange">

### 🔴 Monitoreo

"Saber si algo anda mal"

- Definís **qué** medir de antemano
- Dashboards fijos y estáticos
- Preguntas conocidas: "¿está caído?"
- Alertas predefinidas
- **Reactivo**: actuás cuando la alerta suena
- Te dice el **síntoma**

Ej: *"El servidor respondió 503"*

</div>
<div class="card card-green">

### 🟢 Observabilidad

"Entender por qué anda mal"

- Podés hacer **preguntas nuevas** sin deployar
- Exploración interactiva de datos
- Preguntas desconocidas: "¿por qué está lento?"
- Descubrimiento de patrones
- **Proactivo**: diagnosticás antes de que escalen
- Te dice la **causa raíz**

Ej: *"El 503 se debe a que la DB está saturada porque una query no usa índice"*

</div>
</div>

<div class="card card-dark text-center">

**💡 El monitoreo te dice QUE algo anda mal. La observabilidad te dice POR QUÉ.**

</div>

---

## Los 3 Pilares de la Observabilidad

<div class="grid-3">
<div class="pillar-box" style="border-top: 4px solid var(--primary);">

<span class="icon">📈</span>

### Métricas

Datos **cuantitativos** agregados en el tiempo

**Tipos:**
- **Counter**: solo incrementa (requests totales)
- **Gauge**: sube y baja (CPU, RAM)
- **Histogram**: distribución de valores (latencia)

**Framework RED:**
Rate, Errors, Duration

</div>
<div class="pillar-box" style="border-top: 4px solid var(--secondary);">

<span class="icon">📝</span>

### Logs

Eventos **discretos** con timestamp

**Estructura ideal:**
```json
{
  "event": "post.created",
  "postId": "...",
  "trace_id": "..."
}
```

**Clave:** formato JSON
+ `trace_id` para correlación

</div>
<div class="pillar-box" style="border-top: 4px solid var(--accent);">

<span class="icon">🔍</span>

### Trazas

**Recorrido** de una petición a través del sistema

**Componentes:**
- **Span**: una operación individual
- **Trace**: árbol de spans
- **Contexto**: trace_id, span_id

**Utilidad:**
- Identificar cuellos de botella
- Seguir peticiones entre servicios

</div>
</div>

<div class="divider"></div>

<div class="card card-dark text-center">
<strong>🔗 La correlación entre las 3 señales se logra mediante el trace_id:</strong> un identificador único que viaja en CADA métrica, CADA log y CADA traza, permitiendo saltar de una señal a otra en Grafana.
</div>

---

## 📈 Métricas en Profundidad

### Tipos de Métricas

<div class="grid-2">
<div>

| Tipo | Ejemplo | Pregunta |
|------|---------|----------|
| **Counter** | `http_requests_total` | ¿Cuántos requests? |
| **Gauge** | `memory_usage_bytes` | ¿Cuánta RAM ahora? |
| **Histogram** | `http_duration_ms` | ¿Cómo se distribuye? |

</div>
<div>

### Frameworks de Métricas

**RED** — para servicios (Rate, Errors, Duration)

| Señal | PromQL |
|-------|--------|
| Rate | `rate(metric[5m])` |
| Errors | `rate(metric{status=~"5.."}[5m])` |
| Duration | `histogram_quantile(0.95, rate(metric_bucket[5m]))` |

**USE** — para infraestructura (Utilization, Saturation, Errors)

</div>
</div>

<div class="card card-orange">

### Las 4 Señales Doradas (SRE — Google)

| Señal | Pregunta | Por qué importa |
|-------|----------|-----------------|
| **Latencia** | ¿Cuánto tarda en responder? | Experiencia de usuario |
| **Tráfico** | ¿Cuántas peticiones por segundo? | Carga del sistema |
| **Errores** | ¿Cuántos requests fallan? | Salud del servicio |
| **Saturación** | ¿Qué tan lleno está? | Capacidad restante |

</div>

---

## 📝 Logs en Profundidad

### Logs de Texto Libre vs Estructurados

<div class="grid-2">
<div class="card card-orange">

#### ❌ Texto libre

```
2024-05-29 12:00:00 Post creado
2024-05-29 12:00:01 Error al crear
  post: validation failed
```

❌ No se puede filtrar por campo
❌ No hay correlación con trazas
❌ Difícil de parsear automáticamente
❌ El mensaje cambia según el developer

</div>
<div class="card card-green">

#### ✅ JSON Estructurado

```json
{
  "level": 30,
  "time": 1717000000,
  "event": "post.created",
  "postId": "01HXYZ...",
  "title": "Mi post",
  "author": "Alumno",
  "trace_id": "abc123...",
  "span_id": "def456...",
  "duration_ms": 42
}
```

✅ Filtrable por `event`, `author`
✅ Correlacionado con trazas
✅ Analizable automáticamente
✅ Consultas tipo: "todos los errores de creación del alumno X"

</div>
</div>

<div class="divider"></div>

### Buenas Prácticas

<div class="grid-3">
<div class="card card-blue">

**📌 Cada log debe tener un `event` único**

Ej: `user.created`, `payment.failed`, `auth.login`, `order.shipped`

</div>
<div class="card card-blue">

**🔗 Siempre incluir `trace_id`**

Permite saltar del log a la traza en Tempo con 1 click

</div>
<div class="card card-blue">

**📊 Niveles consistentes**

`info` = operación normal
`warn` = algo inesperado
`error` = algo que afecta al usuario

</div>
</div>

---

## 🔍 Trazas en Profundidad

### Anatomía de una Traza

<div class="grid-2">
<div>

```
GET /api/posts — 8ms            ← TRACE
  │
  ├─ [HTTP] router              ← SPAN (2ms)
  │   atributos: method, route
  │
  ├─ [App] listar-posts          ← SPAN (5ms)
  │   atributos: posts.count
  │   │
  │   └─ [DB] SELECT *          ← SPAN (1ms)
  │       atributos: db.system
  │
  └─ [HTTP] response            ← SPAN (1ms)
      atributos: status_code
```

</div>
<div>

### Componentes

| Componente | Descripción |
|------------|-------------|
| **Trace ID** | UUID único para toda la petición |
| **Span ID** | ID de cada operación individual |
| **Parent Span ID** | ID del span padre (jerarquía) |
| **Span Name** | Nombre de la operación |
| **Duration** | Duración en milisegundos |
| **Attributes** | Metadata contextual |
| **Status** | OK / ERROR |
| **Events** | Ocurrencias puntuales (excepciones) |

</div>
</div>

<div class="card card-dark">

**🔗 Trazabilidad Distribuida:** Una traza puede cruzar múltiples servicios. El `trace_id` se propaga via headers HTTP (`traceparent`), permitiendo seguir una petición desde el frontend → backend → DB → cola de mensajes.

</div>

---

## OpenTelemetry: El Estándar de la Industria

<div class="grid-2">
<div>

### ¿Qué problema resuelve?

**Antes de OTel:** cada proveedor tenía su propio SDK

| Proveedor | SDK |
|-----------|-----|
| Datadog | `dd-trace` |
| New Relic | `newrelic` |
| AWS X-Ray | `aws-xray-sdk` |
| Jaeger | `jaeger-client` |

**Vendor lock-in:** cambiar de proveedor = re-instrumentar toda la app

</div>
<div>

### La solución OTel

```
┌────────────┐     ┌──────────────┐     ┌──────────┐
│  App SDK    │────►│   Collector   │────►│ Grafana  │
│ (neutral)   │     │  (pipeline)   │     │ Datadog  │
│             │     │              │     │ NewRelic │
│             │     │              │     │  Jaeger  │
└────────────┘     └──────────────┘     └──────────┘
```

Instrumentás **una vez** con OTel. Enviás a **cualquier** backend.

</div>
</div>

<div class="divider"></div>

<div class="grid-3 text-center">
<div class="card card-orange">

**API**
Interfaz estándar
`Tracer`, `Meter`, `Logger`
Independiente del proveedor

</div>
<div class="card card-blue">

**SDK**
Implementación concreta
Pipeline de datos
Exporters configurables

</div>
<div class="card card-green">

**Collector**
Pipeline central
Recibe, procesa, filtra
Reenvía a uno o más backends

</div>
</div>

---

## Stack LGTM de Grafana

<div class="grid-2">
<div>

| Componente | Señal | Puerto | Función |
|-----------|-------|--------|---------|
| **Loki** | Logs | 3100 | Almacena logs con labels (no indexa contenido) |
| **Grafana** | Visualización | 3000 | Dashboards unificados, 40+ datasources |
| **Tempo** | Trazas | 3200 | Rastreo distribuido, integración OTel nativa |
| **Mimir** | Métricas | 9009 | TSDB compatible con Prometheus, alta escala |

</div>
<div>

### Filosofía "Big Tent"

Grafana no obliga a centralizar los datos. Podés visualizar datos **donde residan**:

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Postgres │  │  Loki    │  │  Tempo   │
├──────────┤  ├──────────┤  ├──────────┤
│ Prometheus│ │  Mimir   │  │  MySQL   │
├──────────┤  ├──────────┤  ├──────────┤
│  CSV     │  │  Json    │  │  Datadog │
└──────────┘  └──────────┘  └──────────┘
         └──────────┬──────────┘
                    ▼
              ┌──────────┐
              │ Grafana  │
              └──────────┘
```

</div>
</div>

---

## Pipeline de Datos: App → Grafana

<div class="diagram-box">

```
                    ┌─────────────────────────────────────┐
                    │         APP NODE.JS                  │
                    │  ┌──────────┐  ┌──────────┐         │
                    │  │  Routes   │  │  Prisma   │         │
                    │  │ (span     │  │ (span     │         │
                    │  │  auto)    │  │  auto)    │         │
                    │  └────┬─────┘  └────┬─────┘         │
                    │       │              │               │
                    │  ┌────▼──────────────▼─────┐         │
                    │  │     startSpan()         │         │
                    │  │   "crear-post" (manual) │         │
                    │  └────────────┬────────────┘         │
                    │               │                      │
                    │  logger.info({event, trace_id})      │
                    └───────────────╪══════════════════════╪┘
                                    │ OTLP HTTP (4318)     │
                                    ▼                      ▼
                    ┌──────────────────────────────────────┐
                    │          OTEL COLLECTOR               │
                    │  ┌─────────┬──────────┬──────────┐   │
                    │  │  Batch  │  Filter  │  Attrib  │   │
                    │  └────┬────┴────┬─────┴────┬─────┘   │
                    └───────╪────────╪══════════╪═════════┘
                            │        │          │
              ┌─────────────┘        │          └──────────────┐
              ▼                      ▼                        ▼
      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
      │    LOKI      │      │    TEMPO     │      │    MIMIR     │
      │    :3100     │      │    :3200     │      │    :9009     │
      │    logs      │      │   trazas     │      │   métricas   │
      └──────┬───────┘      └──────┬───────┘      └──────┬───────┘
             └──────────┬──────────┴─────────────────────┘
                        ▼
                  ┌──────────────┐
                  │   GRAFANA    │
                  │    :3000     │
                  │  dashboards  │
                  └──────────────┘
```

</div>

---

## ¿Cómo se Instrumenta con OTel?

<div class="grid-2">
<div class="card card-light">

### Auto-instrumentación

**Sin tocar tu código**, OTel captura:

| Librería | Qué captura |
|----------|-------------|
| **HTTP** | Cada request entrante/saliente |
| **Fastify** | Spans por ruta |
| **Pino** | Logs → registros OTel |
| **pg** | Consultas PostgreSQL |

```typescript
// Solo esto activa TODO:
getNodeAutoInstrumentations()
```

</div>
<div class="card card-dark">

### Instrumentación manual

**Para datos de negocio**, agregás spans con contexto:

```typescript
import { startSpan } from "./tracer"

app.post("/api/posts", async (req, reply) => {
  return startSpan("crear-post", async (span) => {
    span.setAttribute("post.title", input.title)
    span.setAttribute("post.author", input.author)
    // ↑ atributos de negocio

    logger.info({
      event: "post.created",
      postId: post.id
    })

    return reply.status(201).send(post)
  })
})
```

</div>
</div>

---

## Nuestra Arquitectura

<div class="grid-2">
<div>

### Stack del Taller

```
FRONTEND (React 19 + Chakra UI)
   │ HTTP (con traceparent)
   ▼
BACKEND (Fastify + Prisma)
   │
   ├─ Core: dominio puro
   │   Entidad Post, Casos de Uso
   │   Puertos (interfaces)
   │
   ├─ Infra: adaptadores
   │   PrismaPostRepository
   │   Rutas HTTP
   │   OTel + Logger
   │
   ▼
PostgreSQL
```

</div>
<div>

### Principio Hexagonal

> El dominio NO depende de nada externo.
> Las dependencias apuntan hacia adentro.

```
Driving Adapter (HTTP)
       │
       ▼
    Puerto (CreatePostUseCase)
       │
       ▼
    Core (Post, validaciones)
       │
       ▼
    Puerto (PostRepository)
       │
       ▼
Driven Adapter (Prisma)
       │
       ▼
    PostgreSQL
```

**Cada capa se instrumenta por separado**, dando visibilidad granular.

</div>
</div>

---

## Lo que se Genera Automáticamente

<div class="grid-3">
<div class="card card-orange text-center">

### 📈 Métricas

**Cada request genera:**
- `http_server_duration_ms_count` +1
- `http_server_duration_ms_bucket`
- Atributos: method, route, status

**Cada 5 segundos** se exportan a Mimir

</div>
<div class="card card-blue text-center">

### 📝 Logs

**Cada logger.info() genera:**
```json
{
  "event": "post.created",
  "level": 30,
  "trace_id": "abc...",
  "span_id": "def..."
}
```

**En tiempo real** a Loki via OTel

</div>
<div class="card card-green text-center">

### 🔍 Trazas

**Cada request genera una traza con:**

```
POST /api/posts
  ├─ HTTP router
  ├─ crear-post (manual)
  │   └─ prisma:post.create
  └─ response
```

**Inmediatamente** disponible en Tempo

</div>
</div>

<div class="card card-dark text-center">

**📌 El alumno no escribe NINGUNA línea de observabilidad. La app ya genera todo.** Su tarea es explorar, consultar y crear dashboards.

</div>

---

<!-- _class: section-title">

# Parte II: Laboratorio

<div class="divider-center"></div>

Práctica guiada — 35 minutos — Stack funcionando con 1 comando

---

## Setup: 1 Comando

<div class="grid-2">
<div class="card card-orange">

### Prerrequisitos

<div class="flex" style="align-items: flex-start;">
<div>

<span class="step">1</span> **Docker 24+**
<br>Docker Compose v2

<span class="step step-blue">2</span> **Git**
<br>Clonar el repo

<span class="step step-green">3</span> **Navegador**
<br>Chrome o Firefox

</div>
</div>

</div>
<div class="card card-dark">

### Comandos

```bash
# 1. Clonar
git clone https://github.com/rodriguezemautn/
  taller-observabilidad-grafana.git

cd taller-observabilidad-grafana/docker

# 2. ¡Un solo comando!
docker compose up -d

# 3. Verificar
docker compose ps
```

</div>
</div>

<div class="card card-light">

### Servicios que se levantan

| Servicio | Puerto | Estado esperado |
|----------|--------|-----------------|
| App (Backend + Frontend) | 3001 | ✅ Up |
| PostgreSQL | 5432 | ✅ Healthy |
| OTel Collector | 4317, 4318 | ✅ Up |
| Loki | 3100 | ✅ Up |
| Tempo | 3200 | ✅ Up |
| Mimir | 9009 | ✅ Up |
| Grafana | 3000 | ✅ Up |

</div>

---

## Paso 1: Explorar la Aplicación

<div class="grid-2">
<div>

<span class="tag tag-orange">1.1</span> **Abrir la app**

```
http://localhost:3001
```

Lo que ves:
- **Lista de posts** (vacía al inicio)
- **Pestaña "Crear Post"** con formulario
- Diseño con Chakra UI

<br>

<span class="tag tag-orange">1.2</span> **Creá 3-4 posts**

Con diferentes:
- Títulos
- Contenidos
- Autores

</div>
<div>

<span class="tag tag-orange">1.3</span> **Verificar via API**

```bash
curl http://localhost:3001/api/posts
```

Deberías ver algo como:

```json
[
  {
    "id": "01KSR...",
    "title": "Mi primer post",
    "content": "Probando...",
    "author": "Alumno",
    "createdAt": "2026-05-29..."
  }
]
```

<div class="card card-blue" style="margin-top: 12px;">
<strong>💡</strong> La app ya está instrumentada con OTel. Mientras creás posts, el backend genera trazas, métricas y logs automáticamente. Ahora vamos a verlos en Grafana.
</div>

</div>
</div>

---

## Paso 2: Primer Vistazo a Grafana

<div class="grid-2">
<div>

<span class="tag tag-blue">2.1</span> **Abrir Grafana**

```
http://localhost:3000
```

Credenciales: `admin` / `admin`

> Grafana usa **provisioning**: los datasources se configuran automáticamente desde archivos YAML montados como volúmenes. **Sin clicks manuales.**

<br>

<span class="tag tag-blue">2.2</span> **Ver datasources**

Menú → Connections → Data Sources

Deberías ver:
- ✅ **Loki** (type: loki)
- ✅ **Tempo** (type: tempo)
- ✅ **Mimir** (type: prometheus)

</div>
<div>

### ¿Cómo funciona provisioning?

```yaml
# docker/grafana/datasources.yml
apiVersion: 1
datasources:
  - name: Loki
    type: loki
    url: http://loki:3100
    access: proxy

  - name: Tempo
    type: tempo
    url: http://tempo:3200
    access: proxy

  - name: Mimir
    type: prometheus
    url: http://mimir:9009/prometheus
    access: proxy
```

<div class="card card-dark" style="margin-top: 8px;">
<strong>📁 Los dashboards también se provisioning:</strong> archivos JSON en <code>docker/grafana/dashboards/</code> que se cargan automáticamente al iniciar Grafana.
</div>

</div>
</div>

---

## Paso 3: Métricas con Mimir

<div class="card card-dark">

### Consultas que vamos a probar

```promql
# 📊 RATE — Requests por segundo
rate(http_server_duration_ms_count[5m])

# ❌ ERRORS — Requests con error 4xx
rate(http_server_duration_ms_count{http_status_code=~"4.."}[5m])

# ⏱ DURATION — Latencia percentil 95
histogram_quantile(0.95,
  rate(http_server_duration_ms_bucket[5m]))
```

</div>

<div class="grid-2" style="margin-top: 12px;">
<div>

<span class="tag tag-green">3.1</span> **Ir a Explore**

Menú → Explore → Datasource: **Mimir**

Pegá la query de Rate y ejecutá.

</div>
<div>

<span class="tag tag-green">3.2</span> **Generar tráfico**

Creá posts desde la UI mientras mirás la gráfica. La línea debería subir.

</div>
</div>

<div class="grid-2" style="margin-top: 8px;">
<div class="card card-orange">

### Para ver errores

1. Creá un post **sin título**
2. Ejecutá la query de Errors
3. Deberías ver el error 400

</div>
<div class="card card-blue">

### Consulta con filtros

```promql
# Rate solo para POST
rate(http_server_duration_ms_count{
  http_request_method="POST"
}[5m])
```

Agregá filtros con `{}`.

</div>
</div>

---

## Paso 4: Dashboard RED

<div class="grid-2">
<div>

<span class="tag tag-green">4.1</span> **Crear dashboard**

1. Menú → Dashboards → **New Dashboard**
2. **+ Add visualization**
3. Datasource: **Mimir**
4. Query: `rate(http_server_duration_ms_count[5m])`
5. Panel title: `"Rate de Requests"`
6. **Apply**

<br>

<span class="tag tag-green">4.2</span> **Agregar panels**

Repetir para Errors y Duration:

| Panel | Query |
|-------|-------|
| Tasa de Errores | `rate(...{status=~"4.."}[5m])` |
| Latencia p95 | `histogram_quantile(0.95, rate(..._bucket[5m]))` |

</div>
<div>

<div class="card card-dark">

### Dashboard RED

```
┌────────────────────────────────────┐
│ 📊 Panel 1: Rate de Requests       │
│  ────╱╲────╱╲──                    │
│ ╱    ╲╱    ╲╱    ╲                │
│ ────────────────────────────────  │
│ Datasource: Mimir                  │
│ Query: rate(...[5m])              │
├────────────────────────────────────┤
│ 📊 Panel 2: Tasa de Errores        │
│  ▁▁▁▁▁▁▁╲▁▁▁▁▁▁▁╲▁▁▁              │
│ Datasource: Mimir                  │
├────────────────────────────────────┤
│ 📊 Panel 3: Latencia p95           │
│  ╱╲    ╱╲    ╱╲                    │
│ Datasource: Mimir                  │
└────────────────────────────────────┘
```

</div>

<div class="card card-primary" style="margin-top: 8px;">
<strong>🔴 RED</strong> = Rate, Errors, Duration — el framework estándar de SRE para monitorear servicios.
</div>

</div>
</div>

---

## Paso 5: Logs con Loki

<div class="grid-2">
<div>

<span class="tag tag-orange">5.1</span> **Explorar logs**

Explore → Datasource: **Loki**

```logql
{service_name="taller-backend"}
```

Todos los logs del backend aparecen en vivo.

<br>

<span class="tag tag-orange">5.2</span> **Ver en tiempo real**

Creá un post desde la UI. El log aparece instantáneamente en Loki.

</div>
<div>

<span class="tag tag-orange">5.3</span> **Filtrar por evento**

```logql
# Solo creaciones exitosas
{service_name="taller-backend"}
  |= "post.created"

# Solo errores
{service_name="taller-backend"}
  |= "error"

# Un evento específico
{service_name="taller-backend"}
  |= "post.validation_error"
```

<div class="card card-blue" style="margin-top: 8px;">
<strong>🔗 Correlación:</strong> Cada log contiene <code>trace_id</code>. En la vista de log, hacé click en el trace_id para abrir la traza en Tempo.
</div>

</div>
</div>

---

## Paso 6: Trazas con Tempo

<div class="grid-2">
<div>

<span class="tag tag-blue">6.1</span> **Buscar trazas**

Explore → Datasource: **Tempo**

```traceql
{service.name="taller-backend"}
```

<br>

<span class="tag tag-blue">6.2</span> **Explorar una traza**

Hacé click en cualquier traza. Vas a ver la estructura completa:

```
POST /api/posts
  ├─ [HTTP] request       ← 2ms
  ├─ [Fastify] handler    ← 1ms
  ├─ [App] crear-post     ← 5ms  ← span manual
  │   ├─ atributos: 
  │   │  post.title="..."
  │   │  post.author="..."
  │   └─ [DB] prisma      ← 1ms
  └─ [HTTP] response      ← 1ms
```

</div>
<div>

<span class="tag tag-blue">6.3</span> **Spans lentos**

Buscá spans que tardan más de 100ms:

```traceql
{service.name="taller-backend"}
  | span.duration > 100ms
```

<br>

<span class="tag tag-blue">6.4</span> **Trazas con error**

```traceql
{service.name="taller-backend"}
  | span.status = error
```

<div class="card card-green" style="margin-top: 8px;">
<strong>💡</strong> Cada span contiene atributos de negocio: <code>post.title</code>, <code>post.author</code>, <code>post.id</code>. Estos atributos se agregan manualmente con <code>span.setAttribute()</code>.
</div>

</div>
</div>

---

## Paso 7: Dashboard Completo

<div class="grid-2">
<div>

<span class="tag tag-dark">7.1</span> **Agregar panel de logs**

1. Dashboard → **+ Add**
2. Datasource: **Loki**
3. Query: `{service_name="taller-backend"}`
4. Panel type: **Logs**
5. **Apply**

<br>

<span class="tag tag-dark">7.2</span> **Agregar panel de trazas**

1. Dashboard → **+ Add**
2. Datasource: **Tempo**
3. Query: `{service.name="taller-backend"}`
4. Panel type: **Trace List**
5. **Apply**

</div>
<div>

<div class="card card-dark">

### Dashboard Final

```
┌──────────────────────────────┐
│      📊 RED Dashboard        │
│  ╱╲    ╱╲    ╱╲              │
├──────────────────────────────┤
│  📊 Rate     📊 Errors       │
│  ──╱╲──     ▁▁╲▁▁╲           │
├──────────────────────────────┤
│  📊 Latencia p95             │
│  ╱╲    ╱╲    ╱╲              │
├──────────────────────────────┤
│  📝 Logs en Vivo             │
│  post.created ✓             │
│  post.listed  ✓             │
├──────────────────────────────┤
│  🔍 Últimas Trazas           │
│  POST /api/posts  42ms      │
│  GET  /api/posts   8ms      │
└──────────────────────────────┘
```

</div>

<div class="card card-orange" style="margin-top: 8px;">
<strong>🎯</strong> En un solo dashboard tenés las 3 señales: métricas RED, logs estructurados y trazas distribuidas.
</div>

</div>
</div>

---

## Ejercicios para el Aula

<div class="grid-2">
<div class="card card-orange">

### 📝 Ejercicio 1: Correlación

**Objetivo:** vincular logs con trazas

1. En Tempo, abrí una traza cualquiera
2. Copiá el `trace_id` del span raíz
3. Andá a Explore > Loki
4. Buscá: `{...} |= "<trace_id>"`
5. **¿Qué ves?** El log exacto que generó esa traza

**🔗 Esto es la correlación logs↔trazas en acción**

</div>
<div class="card card-blue">

### 🔬 Ejercicio 2: Error Forzado

**Objetivo:** ver un error en las 3 señales

1. Creá un post **sin título** desde la UI
2. **Mimir:** ejecutá la query de errores
3. **Loki:** buscá `|= "validation_error"`
4. **Tempo:** buscá spans con `status = error`
5. **¿Qué señal te da más información?**

</div>
</div>

<div class="grid-2" style="margin-top: 12px;">
<div class="card card-green">

### 🎯 Ejercicio 3: Cuello de Botella

**Objetivo:** identificar lentitud

1. Buscá en Tempo: `{...} | span.duration > 50ms`
2. ¿Hay spans lentos?
3. ¿Cuál es el span más lento?
4. ¿Cómo mejorarías ese tiempo?

**💡 Pensá como un SRE: encontrá el瓶颈**

</div>
<div class="card card-dark">

### 🚀 Ejercicio 4: Dashboard Propio

**Objetivo:** crear un dashboard desde cero

1. Creá un nuevo dashboard
2. Agregá un panel con métrica de tu elección
3. Agregá un panel de logs filtrado por `post.created`
4. Agregá un panel de trazas lentas
5. **Guardalo como "Mi Dashboard"**

**⏱ Tiempo: 5 minutos**

</div>
</div>

---

## ¿Cómo Aplicar esto a tu TP?

<div class="grid-2">
<div class="card card-light">

### Lo que necesitás

<div class="flex" style="align-items: flex-start;">
<div>

<span class="step">1</span> Docker Compose

<span class="step step-blue">2</span> Node.js / Python / Java

<span class="step step-green">3</span> 3-6 horas

</div>
<div>

<span class="step">4</span> Agregar OTel SDK

<span class="step step-blue">5</span> Reemplazar console.log

<span class="step step-green">6</span> Agregar docker-compose.yml

</div>
</div>

</div>
<div class="card card-dark">

### Pasos concretos

```bash
# 1. Agregar pipeline al docker-compose
#    (copiar servicios LGTM del taller)

# 2. Instalar OTel
npm install @opentelemetry/api \
  @opentelemetry/sdk-node \
  @opentelemetry/auto-instrumentations-node

# 3. Crear telemetry.ts + logger.ts
#    (copiar del taller)

# 4. Inicializar antes del servidor
initTelemetry()

# 5. console.log → logger.info()
#    (con event y trace_id)

# 6. docker compose up
```

</div>
</div>

<div class="card card-primary text-center">

**📚 Ver nota completa:** `notas-academicas/13-agregar-observabilidad.md` — Guía paso a paso con checklist y tiempos estimados.

</div>

---

## Resumen: Conceptos Clave

<div class="grid-4 text-center">
<div class="card card-orange" style="padding: 16px 8px;">

<span style="font-size: 2em;">📈</span>

**Métricas**

Framework RED
Rate, Errors, Duration
Automáticas con OTel

</div>
<div class="card card-blue" style="padding: 16px 8px;">

<span style="font-size: 2em;">📝</span>

**Logs**

Estructurados (JSON)
Con `event` único
Con `trace_id` y `span_id`

</div>
<div class="card card-green" style="padding: 16px 8px;">

<span style="font-size: 2em;">🔍</span>

**Trazas**

Spans con duración
Atributos de negocio
Tracing distribuido

</div>
<div class="card card-dark" style="padding: 16px 8px;">

<span style="font-size: 2em;">🔗</span>

**Correlación**

trace_id en TODAS
las señales
Unifica la observabilidad

</div>
</div>

<div class="divider"></div>

<div class="grid-4 text-center">
<div class="card card-light" style="padding: 12px;">

**🔶 OpenTelemetry**
Estándar neutral
Una instrumentación
Cualquier backend

</div>
<div class="card card-light" style="padding: 12px;">

**🐳 Docker**
7 servicios LGTM
1 comando:
`docker compose up`

</div>
<div class="card card-light" style="padding: 12px;">

**📊 Grafana**
Provisioning automático
Datasources listos
Dashboards pre-cargados

</div>
<div class="card card-light" style="padding: 12px;">

**🏗️ Hexagonal**
Capas separadas
Cada capa instrumentada
Sin acoplar el dominio

</div>
</div>

---

## Recursos

<div class="grid-2">
<div>

### 📚 Notas del Taller

Todas en `notas-academicas/`:

| Archivo | Tema |
|---------|------|
| `12-integracion-conceptos.md` | Mapa conceptual completo |
| `11-otel-instrumentacion.md` | OTel paso a paso |
| `06-grafana-docker.md` | Grafana + Docker |
| `13-agregar-observabilidad.md` | 🎯 Guía para aplicar al TP |
| `05-arquitectura-hexagonal.md` | Puertos y adaptadores |
| `02-opentelemetry.md` | OTel en profundidad |

</div>
<div>

### 🔗 Links útiles

| Recurso | URL |
|---------|-----|
| **Repositorio** | [github.com/rodriguezemautn/taller-observabilidad-grafana](https://github.com/rodriguezemautn/taller-observabilidad-grafana) |
| **OTel Docs** | opentelemetry.io/docs/ |
| **Grafana Docs** | grafana.com/docs/ |
| **Play de Grafana** | play.grafana.org |
| **SWEBOK v4** | IEEE Computer Society |

### 📖 Bibliografía

- Beyer et al., **"Site Reliability Engineering"** (O'Reilly, 2016)
- Turnbull, **"The Art of Monitoring"** (2016)
- Martin, **"Clean Architecture"** (Prentice Hall, 2017)
- Kim et al., **"The DevOps Handbook"** (IT Revolution, 2021)

</div>
</div>

---

<!-- _class: lead -->

# Gracias

<div class="divider-center"></div>

## La observabilidad no es un producto.

## Es una **capacidad de ingeniería**.

<br>
<br>

> *"You can't improve what you can't measure."* — Peter Drucker
>
> *"A monolith that is well-observed is better than 50 microservices that are not."* — Charity Majors

<br>
<br>

![center width:120](public/assets/grot.svg)

<br>

<span class="text-small">Ingeniería y Calidad de Software — 2026</span>
