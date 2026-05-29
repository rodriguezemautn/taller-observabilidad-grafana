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

**⏱ 60 minutos — 20' teoría + 35' laboratorio + 5' cierre**

<br>

Ingeniería y Calidad de Software — 2026

![center width:180](public/assets/grafana-logo.png)

---

## Agenda

<div class="grid-2">
<div>

### ⏱ 0-20' — Teoría

<div class="card card-light" style="padding: 10px 16px; font-size: 0.85em;">

| Min | Tema | Slides |
|-----|------|--------|
| 0-2 | ¿Qué es observabilidad? | 3-4 |
| 2-5 | Monitoreo vs 3 pilares | 5-7 |
| 5-10 | 📈 Métricas + 📝 Logs | 8-11 |
| 10-13 | 🔍 Trazas | 12-13 |
| 13-17 | OTel + LGTM + Pipeline | 14-19 |
| 17-20 | Arquitectura del taller | 20-21 |

</div>
</div>
<div>

### ⏱ 20-60' — Laboratorio

<div class="card card-light" style="padding: 10px 16px; font-size: 0.85em;">

| Min | Paso | Slides |
|-----|------|--------|
| 20-25 | Setup + Grafana | 23-26 |
| 25-33 | Métricas + Dashboard RED | 27-31 |
| 33-37 | Logs con Loki | 32-34 |
| 37-40 | Trazas con Tempo | 35-37 |
| 40-50 | Ejercicios | 38-41 |
| 50-55 | Aplicación al TP | 42 |
| 55-60 | Cierre | 43-44 |

</div>
</div>
</div>

<div class="card card-dark text-center" style="margin-top: 4px;">
<strong>🎯 Objetivo:</strong> Aplicar observabilidad a tu TP con Grafana + OpenTelemetry
</div>

---

<!-- _class: section-title -->

# ⏱ 0-20' — Teoría

<div class="divider-center"></div>
Conceptos fundamentales de observabilidad

---

## ¿Qué es Observabilidad?

<div class="grid-2">
<div>

### Definición

El término proviene de la **teoría de control**: un sistema es observable si podés determinar su **estado interno** midiendo sus **salidas externas**.

> **Observabilidad** es la capacidad de entender el estado interno de un sistema a partir de sus señales externas (telemetría).

**Pregunta clave:** Si tu app se cae en producción, ¿cuánto tardás en saber por qué?

</div>
<div>

### ¿Por qué ahora?

Los sistemas modernos son:

| Ayer | Hoy |
|------|-----|
| Monolítico | Microservicios |
| Servidores fijos | Containers dinámicos |
| Despliegues semanales | Deploys múltiples/día |
| Equipo pequeño | Equipos distribuidos |
| "Funciona en mi máquina" | "Funciona en K8s" |

Sin observabilidad → **caja negra**

</div>
</div>

---

## ¿Por qué importa?

<div class="grid-2">
<div class="card card-orange">

### Sin observabilidad...

- Error en producción → revisar logs manualmente
- Usuario reporta lentitud → no sabés por dónde empezar
- Microservicio falla → no sabés cuál
- Pico de tráfico → no sabés si es normal

**MTTR (tiempo de reparación)**: horas o días

</div>
<div class="card card-green">

### Con observabilidad...

- Error en producción → traza con causa raíz en segundos
- Lentitud → span lento identificado al instante
- Microservicio falla → dashboard con alerta contextual
- Pico de tráfico → métricas RED en tiempo real

**MTTR (tiempo de reparación)**: minutos

</div>
</div>

<div class="card card-dark">

**📚 SWEBOK v4:** La observabilidad se integra en **Software Engineering Operations** (KA 06): telemetría pervasiva en todas las capas del stack (aplicación, SO, servidor) con ciclos de retroalimentación continua.

</div>

---

## Monitoreo vs Observabilidad

<div class="grid-2">
<div class="card card-orange">

### 🔴 Monitoreo

"Saber si algo anda mal"

- Definís **qué** medir de antemano
- Dashboards fijos
- Preguntas conocidas: "¿está caído?"
- Alertas predefinidas
- **Reactivo**
- Te dice el **síntoma**

> *"El servidor respondió 503"*

</div>
<div class="card card-green">

### 🟢 Observabilidad

"Entender por qué anda mal"

- Hacés **preguntas nuevas** sin deployar
- Exploración interactiva
- Preguntas: "¿por qué está lento?"
- Descubrís lo inesperado
- **Proactivo**
- Te dice la **causa raíz**

> *"503 porque la DB está saturada"*

</div>
</div>

<div class="card card-dark text-center">

**💡 El monitoreo te dice QUE algo anda mal. La observabilidad te dice POR QUÉ.**

</div>

---

## Los 3 Pilares

<div class="grid-3 text-center">
<div class="pillar-box" style="border-top: 4px solid var(--primary);">

<span style="font-size: 2.5em;">📈</span>

### Métricas

Datos cuantitativos

- Counters, Gauges
- Histograms
- Framework **RED**
- Automáticas con OTel

</div>
<div class="pillar-box" style="border-top: 4px solid var(--secondary);">

<span style="font-size: 2.5em;">📝</span>

### Logs

Eventos con timestamp

- JSON estructurado
- Con `trace_id`
- Filtrables por `event`
- Niveles: info, warn, error

</div>
<div class="pillar-box" style="border-top: 4px solid var(--accent);">

<span style="font-size: 2.5em;">🔍</span>

### Trazas

Recorrido de peticiones

- Spans con duración
- Árbol de llamadas
- Atributos de negocio
- Tracing distribuido

</div>
</div>

<div class="card card-dark text-center">

**🔗 La correlación entre las 3 señales se logra mediante el trace_id** — mismo ID en métricas, logs y trazas.

</div>

---

## 📈 Métricas: Tipos

<div class="grid-2">
<div>

| Tipo | Ejemplo | Comportamiento |
|------|---------|----------------|
| **Counter** | `http_requests_total` | Solo incrementa |
| **Gauge** | `memory_usage_bytes` | Sube y baja |
| **Histogram** | `http_duration_ms` | Distribución |

</div>
<div class="card card-dark">

```promql
# Rate: requests/segundo
rate(http_server_duration_ms_count[5m])

# Latencia percentil 95
histogram_quantile(0.95,
  rate(http_duration_bucket[5m]))
```

</div>
</div>

<div class="divider"></div>

### Frameworks de Métricas

<div class="grid-2">
<div class="card card-orange">

#### RED — Para servicios

| Señal | Consulta |
|-------|----------|
| **R**ate | `rate(metric[5m])` |
| **E**rrors | `rate(metric{status=~"5.."}[5m])` |
| **D**uration | `histogram_quantile(0.95, ...)` |

</div>
<div class="card card-blue">

#### USE — Para infraestructura

| Señal | Pregunta |
|-------|----------|
| **U**tilization | ¿Qué % de CPU/RAM? |
| **S**aturation | ¿Hay colas de espera? |
| **E**rrors | ¿Errores de sistema? |

</div>
</div>

---

## 📈 4 Señales Doradas (SRE)

<div class="grid-2">
<div class="card card-dark">

### Las 4 que importan

Google SRE define que **todo servicio** debería medir:

| Señal | Pregunta |
|-------|----------|
| **Latencia** | ¿Cuánto tarda en responder? |
| **Tráfico** | ¿Cuántas peticiones/segundo? |
| **Errores** | ¿Cuántos requests fallan? |
| **Saturación** | ¿Qué tan cerca del límite? |

</div>
<div class="card card-green">

> *"If you measure 100 metrics, you measure none. Pick the 4 that matter."*

### En nuestro taller:

| Señal | Query Mimir |
|-------|-------------|
| Rate | `rate(http...count[5m])` |
| Errors | `rate(http...{status=~\"4..\"}[5m])` |
| Duration | `histogram_quantile(0.95, ...)` |

🔴 RED en acción

</div>
</div>

---

## 📝 Logs: Texto vs Estructurados

<div class="grid-2">
<div class="card card-orange">

### ❌ Texto libre

```
2024-05-29 Post creado
2024-05-29 Error: validation failed
```

❌ No se puede filtrar por campo
❌ Sin correlación con trazas
❌ Difícil de analizar

</div>
<div class="card card-green">

### ✅ JSON estructurado

```json
{
  "event": "post.created",
  "postId": "01HXYZ...",
  "trace_id": "abc123...",
  "span_id": "def456..."
}
```

✅ Filtrable por `event`, `postId`
✅ Correlacionado con trazas
✅ Analizable automáticamente

</div>
</div>

---

## 📝 Buenas Prácticas de Logs

### Cada log debe tener:

<div class="grid-3">
<div class="card card-blue">

**📌 Un `event` único**

`user.created`
`payment.failed`
`order.shipped`
`auth.login`

Buscable y agrupable

</div>
<div class="card card-blue">

**🔗 El `trace_id` siempre**

```json
{
  "event": "post.created",
  "trace_id": "abc..."
}
```

1 click → de log a traza

</div>
<div class="card card-blue">

**📊 Niveles consistentes**

| Nivel | Significado |
|-------|-------------|
| `info` | Operación normal |
| `warn` | Algo inesperado |
| `error` | Afecta al usuario |

</div>
</div>

<div class="card card-dark text-center">

**Regla de oro:** Si un log no tiene `event` y `trace_id`, no es un log estructurado. Es ruido.

</div>

---

## 🔍 Trazas: Anatomía

<div class="grid-2">
<div>

### Una traza = árbol de spans

```
GET /api/posts — 8ms           ← TRACE
  │
  ├─ [HTTP] router             ← SPAN (2ms)
  │   method=GET, route=/api/posts
  │
  ├─ [App] listar-posts        ← SPAN (5ms)
  │   posts.count=3
  │   │
  │   └─ [DB] SELECT *         ← SPAN (1ms)
  │       db.system=postgres
  │
  └─ [HTTP] response           ← SPAN (1ms)
      status_code=200
```

</div>
<div>

### Componentes de un Span

| Componente | Descripción |
|------------|-------------|
| **Trace ID** | UUID único de toda la petición |
| **Span ID** | ID de cada operación |
| **Parent ID** | ID del span padre (jerarquía) |
| **Name** | `crear-post`, `listar-posts` |
| **Duration** | Tiempo en milisegundos |
| **Attributes** | `post.id`, `http.method` |
| **Status** | `OK` / `ERROR` |
| **Events** | Excepciones, logs internos |

</div>
</div>

---

## 🔍 Trazabilidad Distribuida

<div class="card card-dark">

### El trace_id viaja con la petición

```
Frontend                         Backend                        DB
   │                              │                             │
   │  ─── POST /api/posts ──────► │                             │
   │                              │                             │
   │  traceparent: abc123        │  ─── INSERT INTO ──────────► │
   │                              │  traceparent: abc123        │
   │                              │                             │
   │  ◄───── 201 Created ──────── │                             │
   │                              │                             │
```

</div>

<div class="grid-2" style="margin-top: 12px;">
<div class="card card-orange">

### ¿Por qué es importante?

- Seguir una petición **entre servicios**
- Identificar **cuellos de botella**
- Reducir **MTTR** (tiempo de reparación)
- Entender **causa raíz** de fallos

</div>
<div class="card card-blue">

### ¿Dónde se propaga?

Via headers HTTP estándar:

```
traceparent: 00-abc123...-def456...-01
```

- **00**: versión
- **abc123...**: trace_id
- **def456...**: span_id
- **01**: trace flags

</div>
</div>

---

## OpenTelemetry: El Problema

<div class="grid-2">
<div class="card card-orange">

### Antes de OTel: Vendor Lock-in

| Proveedor | SDK propio |
|-----------|------------|
| Datadog | `dd-trace` |
| New Relic | `newrelic` |
| AWS X-Ray | `aws-xray-sdk` |
| Jaeger | `jaeger-client` |
| Zipkin | `zipkin-js` |

**Problema:** cambiar de backend = re-instrumentar toda la app

</div>
<div class="card card-green">

### Con OTel: Una vez, cualquier backend

```
┌──────────┐   ┌──────────┐   ┌──────────┐
│  App SDK  │──►│ Collector │──►│ Grafana  │
│ (OTel)    │   │ (pipeline)│   │ Datadog  │
│           │   │          │   │ NewRelic │
│           │   │          │   │  Jaeger  │
└──────────┘   └──────────┘   └──────────┘
```

✅ Instrumentás **1 vez**
✅ Enviás a **cualquier** backend
✅ **Sin vendor lock-in**

</div>
</div>

---

## OpenTelemetry: API + SDK + Collector

<div class="grid-3 text-center">
<div class="card card-orange">

### 📡 API

Interfaz estándar

`Tracer`
`Meter`
`Logger`

Solo definiciones
Independiente del proveedor

</div>
<div class="card card-blue">

### 🧩 SDK

Implementación

Pipeline de datos
Exporters OTLP
Auto-instrumentaciones

</div>
<div class="card card-green">

### 🔄 Collector

Servidor aparte

Recibe OTLP
Procesa (filtra, agrega)
Exporta a 1+ backends

</div>
</div>

<br>

<div class="card card-dark">

**📡 OTLP** (OpenTelemetry Protocol) es el protocolo estándar para transportar telemetría. Soporta gRPC (4317) y HTTP (4318).

</div>

---

## Auto-instrumentación: Sin Código

<div class="grid-2">
<div>

### Sin tocar tu código, OTel captura:

| Librería | Qué captura automáticamente |
|----------|----------------------------|
| **HTTP** | Cada request entrante/saliente |
| **Fastify** | Spans por ruta y handler |
| **Pino** | Logs → registros OTel |
| **pg** (PostgreSQL) | Cada consulta SQL |

```typescript
import { getNodeAutoInstrumentations } from
  "@opentelemetry/auto-instrumentations-node"

// ¡Activa TODO automáticamente!
getNodeAutoInstrumentations()
```

</div>
<div>

### En acción:

```
Sin OTel:
  POST /api/posts → ??? → ??? → ??? → 201

Con OTel (automático):
  POST /api/posts → [HTTP: 1ms] → 
  [Fastify: 1ms] → [PG: 3ms] → 201
```

<div class="card card-orange" style="margin-top: 12px;">
<strong>💡</strong> Esto funciona porque OTel hace <strong>monkey-patching</strong> de las librerías al iniciar. No modifica tu código fuente.
</div>

</div>
</div>

---

## Instrumentación Manual: Datos de Negocio

<div class="card card-dark">

### Para agregar contexto semántico a las trazas:

```typescript
import { startSpan } from "./observability/tracer"
import { logger } from "./observability/logger"

app.post("/api/posts", async (req, reply) => {
  return startSpan("crear-post", async (span) => {
    // Atributos de NEGOCIO (no técnicos)
    span.setAttribute("post.title", input.title)
    span.setAttribute("post.author", input.author)

    logger.info({
      event: "post.created",
      postId: post.id,
      title: input.title
    })

    return reply.status(201).send(post)
  })
})
```

</div>

<div class="grid-2" style="margin-top: 8px;">
<div class="card card-green">

#### ✅ Automático

HTTP, Fastify, DB
Sin código adicional
Trazas genéricas

</div>
<div class="card card-orange">

#### ✍️ Manual

Spans con nombre de negocio
Atributos del dominio
Logs con contexto

</div>
</div>

---

## Stack LGTM

<div class="grid-2">
<div>

| Componente | Señal | Puerto | Función |
|-----------|-------|--------|---------|
| **Loki** | Logs | 3100 | Almacena logs con labels |
| **Grafana** | Visualización | 3000 | Dashboards + Explore |
| **Tempo** | Trazas | 3200 | Rastreo distribuido |
| **Mimir** | Métricas | 9009 | TSDB Prometheus-compatible |

</div>
<div>

### Filosofía "Big Tent"

Grafana visualiza datos **donde residan**:

```
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│Loki  │ │Tempo │ │Mimir │ │MySQL │
├──────┤ ├──────┤ ├──────┤ ├──────┤
│CSV   │ │Json  │ │...   │ │...   │
└──────┘ └──────┘ └──────┘ └──────┘
     └──────────┬──────────┘
                ▼
          ┌──────────┐
          │ Grafana  │
          └──────────┘
```

</div>
</div>

<div class="card card-dark">
<strong>✅ Provisioning:</strong> Datasources y dashboards se configuran desde archivos YAML/JSON montados como volúmenes. <strong>Sin clicks manuales.</strong>
</div>

---

## Pipeline Completo

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
                    │  │  startSpan("crear-post")│         │
                    │  │  logger.info({event,    │         │
                    │  │    trace_id})           │         │
                    │  └────────────┬────────────┘         │
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
      │    logs      │      │   trazas     │      │   métricas   │
      └──────┬───────┘      └──────┬───────┘      └──────┬───────┘
             └──────────┬──────────┴─────────────────────┘
                        ▼
                  ┌──────────────┐
                  │   GRAFANA    │
                  │  dashboards  │
                  └──────────────┘
```

</div>

---

## Nuestra Arquitectura

<div class="grid-2">
<div>

### Stack del Taller

```
FRONTEND (React 19 + Chakra UI)
   │ HTTP (traceparent header)
   ▼
BACKEND (Fastify + Prisma)
   │
   ├─ Core: dominio puro
   │   Post, Casos de Uso
   │   Puertos (interfaces)
   │
   ├─ Infra: adaptadores
   │   PrismaPostRepository
   │   OTel + Logger + Routes
   │
   ▼
PostgreSQL
```

</div>
<div>

### Principio Hexagonal

```
Driving Adapter (HTTP Fastify)
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

**Cada capa se instrumenta por separado**

</div>
</div>

---

## Lo que Genera la App Automáticamente

<div class="grid-3">
<div class="card card-orange text-center">

<span style="font-size: 2em;">📈</span>

### Métricas

Cada request:
- `http...count` +1
- `http..._bucket`

**Cada 5s** → Mimir

**RED automático** ✨

</div>
<div class="card card-blue text-center">

<span style="font-size: 2em;">📝</span>

### Logs

Cada `logger.info()`:
```json
{
  "event": "post.created",
  "trace_id": "abc..."
}
```

**Tiempo real** → Loki

</div>
<div class="card card-green text-center">

<span style="font-size: 2em;">🔍</span>

### Trazas

Cada request:
```
POST /api/posts
  ├─ [HTTP] router
  ├─ [App] crear-post
  │   └─ [DB] prisma
  └─ [HTTP] response
```

**Inmediato** → Tempo

</div>
</div>

<div class="card card-dark text-center">

**📌 El alumno NO escribe código de observabilidad.** La app ya genera todo: trazas, métricas y logs via OTel. Su tarea es explorar, consultar queries y crear dashboards.

</div>

---

<!-- _class: section-title -->

# ⏱ 20-55' — Laboratorio

<div class="divider-center"></div>

Práctica guiada — Stack funcionando con 1 comando

---

## Setup: Prerrequisitos

<div class="grid-2">
<div class="card card-orange">

### Qué necesitás

<div style="display: flex; gap: 8px; flex-direction: column;">
<div><span class="step">1</span> <strong>Docker 24+</strong> con Docker Compose v2</div>
<div><span class="step step-blue">2</span> <strong>Git</strong></div>
<div><span class="step step-green">3</span> <strong>Navegador</strong> (Chrome / Firefox)</div>
<div><span class="step">4</span> <strong>~4-6 GB RAM</strong> libre para el stack</div>
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

### 7 servicios que se levantan

| Servicio | Puerto | Para qué |
|----------|--------|----------|
| **App** (Frontend + Backend) | 3001 | La app del taller |
| **PostgreSQL** | 5432 | Base de datos |
| **OTel Collector** | 4317-4318 | Pipeline de telemetría |
| **Loki** | 3100 | 📝 Logs |
| **Tempo** | 3200 | 🔍 Trazas |
| **Mimir** | 9009 | 📈 Métricas |
| **Grafana** | 3000 | 📊 Dashboards |

</div>

---

## ⏱ 20-23': Paso 1 — Explorar la App

<div class="grid-2">
<div>

<span class="tag tag-orange">1.1</span> **Abrrir la app**

```
http://localhost:3001
```

Vas a ver:
- **Lista de posts** (vacía al inicio)
- **Pestaña "Crear Post"**
- UI con Chakra UI

<br>

<span class="tag tag-orange">1.2</span> **Creá 3-4 posts**

Con distintos títulos y autores.

</div>
<div>

<span class="tag tag-orange">1.3</span> **Verificar via API**

```bash
curl http://localhost:3001/api/posts
```

```json
[
  {
    "id": "01KSR...",
    "title": "Mi primer post",
    "author": "Alumno",
    "createdAt": "2026-05-29..."
  }
]
```

<div class="card card-blue" style="margin-top: 8px;">
💡 La app ya genera métricas, logs y trazas via OTel. Sin que hayas escrito código de observabilidad.
</div>

</div>
</div>

---

## ⏱ 23-25': Paso 2 — Grafana

<div class="grid-2">
<div>

<span class="tag tag-blue">2.1</span> **Abrir Grafana**

```
http://localhost:3000
```

Usuario: `admin` / Contraseña: `admin`

<br>

<span class="tag tag-blue">2.2</span> **Ver datasources**

Menú → Connections → Data Sources

✅ **Loki** (logs)
✅ **Tempo** (trazas)
✅ **Mimir** (métricas)

Ya configurados sin clicks.

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
  - name: Tempo
    type: tempo
    url: http://tempo:3200
  - name: Mimir
    type: prometheus
    url: http://mimir:9009/prometheus
```

<div class="card card-dark" style="margin-top: 8px;">
📁 Los dashboards también se auto-cargan desde archivos JSON en <code>docker/grafana/dashboards/</code> — 3 dashboards listos para explorar.
</div>

</div>
</div>

---

## ⏱ 25-28': Paso 3 — Métricas con Mimir

<div class="grid-2">
<div>

<span class="tag tag-green">3.1</span> **Explore → Mimir**

```promql
# RATE — requests/segundo
rate(http_server_duration_ms_count[5m])
```

Una línea que sube y baja con el tráfico.

<br>

<span class="tag tag-green">3.2</span> **Generar tráfico**

Creá posts mientras mirás la gráfica. La línea sube.

</div>
<div>

<span class="tag tag-green">3.3</span> **Errors + Duration**

```promql
# ERRORS — tasa de error 4xx
rate(http_server_duration_ms_count{
  http_status_code=~"4.."
}[5m])
```

<div class="card card-orange" style="margin: 8px 0;">
<strong>💡 Probar:</strong> Creá un post SIN título → error 400 → aparece en Errors
</div>

```promql
# DURATION — latencia p95
histogram_quantile(0.95,
  rate(http_server_duration_ms_bucket[5m]))
```

</div>
</div>

---

## ⏱ 28-30': Consultas con Filtros

<div class="grid-2">
<div class="card card-dark">

### Filtrar por endpoint

```promql
# Rate solo para POST
rate(http_server_duration_ms_count{
  http_request_method="POST"
}[5m])

# Rate solo para GET
rate(http_server_duration_ms_count{
  http_request_method="GET"
}[5m])
```

</div>
<div class="card card-dark">

### Filtrar por status

```promql
# Solo status 200 (éxito)
rate(http_server_duration_ms_count{
  http_status_code="200"
}[5m])

# Solo status 400 (error)
rate(http_server_duration_ms_count{
  http_status_code="400"
}[5m])
```

</div>
</div>

<div class="card card-blue text-center" style="margin-top: 8px;">

**💡 Los filtros `{}` en PromQL son clave para hacer preguntas específicas.** Sin filtros: todas las métricas juntas. Con filtros: métricas segmentadas por endpoint, método, status, etc.

</div>

---

## ⏱ 30-33': Paso 4 — Dashboard RED

<div class="grid-2">
<div>

<span class="tag tag-green">4.1</span> **Crear dashboard**

1. Menú → Dashboards → **New Dashboard**
2. **+ Add visualization**
3. Datasource: **Mimir**
4. Query: `rate(http...count[5m])`
5. Panel title: "Rate de Requests"
6. **Apply**

<br>

<span class="tag tag-green">4.2</span> **Agregar 2 paneles más**

| Panel | Query |
|-------|-------|
| Tasa de Errores | `rate(...{status=~"4.."}[5m])` |
| Latencia p95 | `histogram_quantile(0.95, ...)` |

</div>
<div>

<div class="card card-dark">

### RED Dashboard

```
┌────────────────────────────────────┐
│ 📊 Rate de Requests                │
│  ────╱╲────╱╲──                    │
│ Mimir · rate(...[5m])              │
├────────────────────────────────────┤
│ 📊 Tasa de Errores                 │
│  ▁▁▁▁▁▁▁╲▁▁▁▁▁▁▁╲▁▁▁              │
│ Mimir · rate(...{status=~"4.."})   │
├────────────────────────────────────┤
│ 📊 Latencia p95                    │
│  ╱╲    ╱╲    ╱╲                    │
│ Mimir · histogram_quantile(0.95)   │
└────────────────────────────────────┘
```

</div>

<div class="card card-orange" style="margin-top: 6px;">
<strong>🔴 RED</strong> = Rate, Errors, Duration — framework SRE
</div>

</div>
</div>

---

## ⏱ 33-35': Paso 5 — Logs con Loki

<div class="grid-2">
<div>

<span class="tag tag-orange">5.1</span> **Explore → Loki**

```logql
# Todos los logs del backend
{service_name="taller-backend"}
```

Todos los logs aparecen en vivo.

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

# Error de validación
{service_name="taller-backend"}
  |= "post.validation_error"

# Listado de posts
{service_name="taller-backend"}
  |= "post.listed"
```

</div>
</div>

---

## ⏱ 35-37': Filtrar Logs por Trace ID

<div class="grid-2">
<div>

<span class="tag tag-orange">5.4</span> **Correlación logs↔trazas**

Cada log contiene `trace_id`. Usalo para vincular:

```logql
# Buscar logs de una traza específica
{service_name="taller-backend"}
  |= "01HXYZ..."  ← trace_id
```

<br>

### ¿Cómo obtener el trace_id?

1. Andá a Tempo (Explore)
2. Abrí cualquier traza
3. Copiá el `trace_id`
4. Pegalo en Loki

</div>
<div class="card card-dark">

### Eventos en nuestra app

| Evento | Cuándo ocurre |
|--------|---------------|
| `post.created` | Creación exitosa |
| `post.listed` | Listado de posts |
| `post.found` | Búsqueda por ID |
| `post.validation_error` | Error de validación |
| `post.not_found` | Post inexistente |
| `post.error` | Error interno |

```json
{
  "event": "post.created",
  "postId": "01KSR...",
  "trace_id": "abc...",
  "level": 30
}
```

</div>
</div>

---

## ⏱ 37-39': Paso 6 — Trazas con Tempo

<div class="grid-2">
<div>

<span class="tag tag-blue">6.1</span> **Explore → Tempo**

```traceql
{service.name="taller-backend"}
```

<br>

<span class="tag tag-blue">6.2</span> **Explorar una traza**

Click en cualquier traza. Ves la estructura completa:

```
POST /api/posts
  ├─ [HTTP] request       ← 2ms
  ├─ [Fastify] handler    ← 1ms
  ├─ [App] crear-post     ← 5ms  ← manual
  │   ├─ post.title="..."
  │   ├─ post.author="..."
  │   └─ [DB] prisma      ← 1ms
  └─ [HTTP] response      ← 1ms
```

</div>
<div>

<span class="tag tag-blue">6.3</span> **Consultas útiles**

```traceql
# Spans lentos (>100ms)
{service.name="taller-backend"}
  | span.duration > 100ms

# Trazas con error
{service.name="taller-backend"}
  | span.status = error

# Spans de negocio específicos
{service.name="taller-backend"}
  && name="crear-post"
```

<div class="card card-green" style="margin-top: 8px;">
💡 Los atributos de negocio (<code>post.title</code>, <code>post.author</code>) se agregan con <code>span.setAttribute()</code> en los spans manuales.
</div>

</div>
</div>

---

## ⏱ 39-42': Paso 7 — Dashboard Completo

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
│ 📊 Rate    │ 📊 Errors       │
│ ──╱╲──    │ ▁▁╲▁▁╲          │
├──────────────────────────────┤
│ 📊 Latencia p95              │
│ ╱╲    ╱╲    ╱╲               │
├──────────────────────────────┤
│ 📝 Logs en Vivo              │
│ post.created ✓              │
├──────────────────────────────┤
│ 🔍 Últimas Trazas            │
│ POST /api/posts  42ms       │
│ GET  /api/posts   8ms       │
└──────────────────────────────┘
```

</div>

<div class="card card-orange" style="margin-top: 6px;">
<strong>🎯 3 señales en 1 dashboard:</strong> métricas RED + logs + trazas
</div>

</div>
</div>

---

## ⏱ 42-46': Ejercicios 1 y 2

<div class="grid-2">
<div class="card card-orange">

### 📝 Ejercicio 1: Correlación

**Vincular logs con trazas**

1. En Tempo, abrí una traza
2. Copiá el `trace_id`
3. En Loki, buscá: `{...} |= "<trace_id>"`
4. **Respondé:** ¿Qué información adicional tiene el log que no está en la traza?

🔗 **Correlación logs↔trazas en acción**

⏱ 2 minutos

</div>
<div class="card card-blue">

### 🔬 Ejercicio 2: Error Forzado

**Ver un error en las 3 señales**

1. Creá un post **sin título** desde la UI
2. **Mimir:** ejecutá la query de errores 4xx
3. **Loki:** buscá `|= "validation_error"`
4. **Tempo:** `| span.status = error`
5. **Respondé:** ¿Qué señal te da más información para debuggear?

⏱ 3 minutos

</div>
</div>

---

## ⏱ 46-50': Ejercicios 3 y 4

<div class="grid-2">
<div class="card card-green">

### 🎯 Ejercicio 3: Cuello de Botella

**Identificar lentitud en el sistema**

1. Buscá en Tempo: `| span.duration > 50ms`
2. ¿Hay spans lentos?
3. ¿Cuál es el span más lento?
4. **Respondé:** ¿Cómo mejorarías ese tiempo?

💡 Pensá como un SRE

⏱ 2 minutos

</div>
<div class="card card-dark">

### 🚀 Ejercicio 4: Dashboard Propio

**Crear un dashboard desde cero**

1. Creá un **nuevo** dashboard
2. Agregá un panel de métrica a elección
3. Agregá un panel de logs filtrado por `post.created`
4. Agregá un panel de trazas lentas
5. **Guardalo como "Mi Dashboard"**

**⏱ 4 minutos — el más completo**

</div>
</div>

---

## ⏱ 50-55': Aplicar a tu TP

<div class="grid-2">
<div class="card card-light">

### Lo que necesitás

<span class="step">1</span> **Docker Compose** en tu proyecto

<span class="step step-blue">2</span> **Node.js** / Python / Java

<span class="step step-green">3</span> **3-6 horas** de trabajo

<span class="step">4</span> Agregar **OTel SDK**

<span class="step step-blue">5</span> Reemplazar **console.log** por logger

<span class="step step-green">6</span> Agregar servicios **LGTM** al compose

</div>
<div class="card card-dark">

### Pasos concretos

```bash
# 1. Copiar servicios LGTM del taller
#    a tu docker-compose.yml

# 2. Instalar OTel
npm install @opentelemetry/api \
  @opentelemetry/sdk-node \
  @opentelemetry/auto-instrumentations-node

# 3. Crear telemetry.ts + logger.ts
#    (copiar de packages/infrastructure/src/observability/)

# 4. Inicializar ANTES del servidor
initTelemetry()

# 5. console.log → logger.info()
#    con event + trace_id

# 6. docker compose up
```

</div>
</div>

<div class="card card-orange text-center" style="margin-top: 6px;">
<strong>📚 Guía completa:</strong> <code>notas-academicas/13-agregar-observabilidad.md</code> — Checklist + tiempos por stack
</div>

---

## Resumen: Conceptos Clave

<div class="grid-4 text-center">
<div class="card card-orange" style="padding: 14px 8px;">

<span style="font-size: 1.8em;">📈</span>

**Métricas**

Framework RED
Rate, Errors, Duration
Automáticas con OTel

</div>
<div class="card card-blue" style="padding: 14px 8px;">

<span style="font-size: 1.8em;">📝</span>

**Logs**

JSON estructurados
Con `event` único
Con `trace_id`

</div>
<div class="card card-green" style="padding: 14px 8px;">

<span style="font-size: 1.8em;">🔍</span>

**Trazas**

Spans con duración
Atributos de negocio
Tracing distribuido

</div>
<div class="card card-dark" style="padding: 14px 8px;">

<span style="font-size: 1.8em;">🔗</span>

**Correlación**

trace_id en TODAS
las señales
→ Dashboard unificado

</div>
</div>

<div class="divider"></div>

<div class="grid-4 text-center">
<div class="card card-light" style="padding: 10px;">

**🔶 OpenTelemetry**
Estándar neutral
1 instrumentación
Cualquier backend

</div>
<div class="card card-light" style="padding: 10px;">

**🐳 Docker**
7 servicios LGTM
1 comando:
`docker compose up`

</div>
<div class="card card-light" style="padding: 10px;">

**📊 Grafana**
Provisioning automático
Sin clicks manuales
Dashboards pre-cargados

</div>
<div class="card card-light" style="padding: 10px;">

**🏗️ Hexagonal**
Capas separadas
Cada capa instrumentada
Dominio puro sin OTel

</div>
</div>

---

## Recursos

<div class="grid-2">
<div>

### 📚 Notas del Taller

`notas-academicas/`:

| Archivo | Tema |
|---------|------|
| `12-integracion-conceptos.md` | Mapa conceptual completo |
| `11-otel-instrumentacion.md` | OTel paso a paso |
| `06-grafana-docker.md` | Grafana + Docker |
| `13-agregar-observabilidad.md` | 🎯 Guía para aplicar al TP |
| `05-arquitectura-hexagonal.md` | Puertos y adaptadores |

</div>
<div>

### 🔗 Links útiles

| Recurso | URL |
|---------|-----|
| **Repositorio** | [github.com/rodriguezemautn/taller-observabilidad-grafana](https://github.com/rodriguezemautn/taller-observabilidad-grafana) |
| **OTel Docs** | opentelemetry.io/docs/ |
| **Grafana Docs** | grafana.com/docs/ |
| **Grafana Play** | play.grafana.org |

### 📖 Libros

- **SRE Book** — Beyer et al. (O'Reilly)
- **The Art of Monitoring** — Turnbull
- **Clean Architecture** — Martin
- **SWEBOK v4** — IEEE Computer Society

</div>
</div>

---

## ⏱ 55-60': Conclusiones

<div class="grid-2">
<div class="card card-light">

### Qué aprendimos hoy

| Concepto | Lo aplicamos en... |
|----------|-------------------|
| 📈 Métricas RED | Mimir + PromQL |
| 📝 Logs estructurados | Loki + LogQL |
| 🔍 Trazas distribuidas | Tempo + TraceQL |
| 🔗 Correlación | trace_id en 3 señales |
| 📊 Dashboards | RED + Logs + Trazas |
| 🐳 Docker | LGTM en 7 servicios |

</div>
<div class="card card-dark">

### Para seguir explorando

1. Agregá observabilidad a tu **TP integrador** (guía en nota 13)
2. Explorá **Grafana Play** (play.grafana.org)
3. Leé el **SRE Book** de Google
4. Probá **Pyroscope** (perfilado continuo)
5. Investigá **Grafana Alloy** (reemplazo de Promtail)

> *"The best time to add observability was yesterday. The second best time is now."*

</div>
</div>

---

<!-- _class: lead -->

# Gracias

<div class="divider-center"></div>

## La observabilidad no es un producto.
## Es una **capacidad de ingeniería**.

<br>

> *"You can't improve what you can't measure."* — Peter Drucker

> *"A monolith that is well-observed is better than 50 microservices that are not."* — Charity Majors

<br>

![center width:120](public/assets/grot.svg)

<br>

**¿Preguntas?**

<span class="text-small">Ingeniería y Calidad de Software — 2026</span>
