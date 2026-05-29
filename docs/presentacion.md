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
    --primary-gradient: linear-gradient(135deg, #FF671D 0%, #FF8A4C 100%);
    --secondary: #1E6BFF;
    --secondary-light: #DBE9FF;
    --accent: #059669;
    --accent-light: #D1FAE5;
    --dark: #0F172A;
    --slate-50: #F8FAFC;
    --slate-100: #F1F5F9;
    --slate-200: #E2E8F0;
    --slate-300: #CBD5E1;
    --slate-400: #94A3B8;
    --slate-500: #64748B;
    --text: #0F172A;
    --text-secondary: #475569;
    --white: #FFFFFF;
    --radius: 8px;
    --shadow: 0 1px 2px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.05);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  section {
    background: var(--white);
    color: var(--text);
    padding: 40px 48px;
    font-size: 17px;
    line-height: 1.6;
  }
  section.lead {
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
    color: var(--white);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section.lead h1 {
    color: var(--white); font-size: 3em; font-weight: 800;
    letter-spacing: -0.5px; margin-bottom: 4px; border: none;
  }
  section.lead h1 strong { color: var(--primary); }
  section.lead p { color: #94A3B8; font-size: 0.9em; }
  section.lead .lead-divider { width: 60px; height: 3px; background: var(--primary); margin: 16px auto; border-radius: 2px; }
  section.section-title {
    background: var(--primary-gradient);
    color: var(--white);
    display: flex; flex-direction: column; justify-content: center;
    align-items: center; text-align: center;
  }
  section.section-title h2 {
    color: var(--white); font-size: 2.2em; font-weight: 700; border: none; margin-bottom: 4px;
  }
  section.section-title p { color: rgba(255,255,255,0.85); font-size: 1em; }
  section.section-title .lead-divider { width: 50px; height: 3px; background: rgba(255,255,255,0.4); margin: 12px auto; border-radius: 2px; }
  h1, h2, h3, h4 { color: var(--text); margin: 0 0 8px 0; }
  h1 { font-size: 2em; font-weight: 700; letter-spacing: -0.3px; }
  h2 { font-size: 1.4em; font-weight: 700; border-bottom: 2px solid var(--primary); padding-bottom: 6px; margin-bottom: 14px; }
  h3 { font-size: 1.05em; font-weight: 600; color: #1E293B; }
  h4 { font-size: 0.85em; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
  a { color: var(--secondary); }
  p { margin: 0 0 8px 0; }
  code {
    background: #F1F5F9; color: #DC2626;
    border-radius: 3px; padding: 1px 5px;
    font-size: 0.8em; font-family: 'JetBrains Mono', 'Fira Code', monospace;
  }
  pre {
    background: #0F172A; border-radius: var(--radius);
    padding: 12px 16px; border-left: 3px solid var(--primary);
    margin: 8px 0; font-size: 0.75em;
  }
  pre code { background: transparent; color: #E2E8F0; padding: 0; font-size: 1em; line-height: 1.5; border: none; }
  table {
    border-collapse: collapse; width: 100%; font-size: 0.78em;
    margin: 8px 0; border-radius: var(--radius); overflow: hidden;
  }
  th { background: #0F172A; color: var(--white); padding: 8px 12px; font-weight: 600; }
  td { border: 1px solid #E2E8F0; padding: 6px 12px; }
  tr:nth-child(even) { background: #F8FAFC; }
  blockquote {
    border-left: 3px solid var(--primary); background: var(--primary-light);
    padding: 10px 16px; margin: 12px 0;
    border-radius: 0 var(--radius) var(--radius) 0; color: var(--text);
  }
  blockquote strong { color: var(--primary); }
  .card {
    border-radius: var(--radius); padding: 16px 18px;
    border: 1px solid #E2E8F0; box-shadow: var(--shadow); margin-bottom: 8px;
    color: var(--text); background: var(--white);
  }
  .card-light { background: #F8FAFC; border-color: #E2E8F0; }
  .card-orange { background: #FFF0E8; border-left: 3px solid var(--primary); }
  .card-green { background: #D1FAE5; border-left: 3px solid var(--accent); }
  .card-dark {
    background: #1E293B; color: #F1F5F9; border: none;
  }
  .card-dark code { background: rgba(255,255,255,0.1); color: #FBBF24; }
  .card-dark strong { color: #34D399; }
  .card-dark h4 { color: #FBBF24; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; }
  .tag {
    display: inline-block; font-size: 0.55em; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.4px;
    border-radius: 3px; padding: 2px 7px; margin-bottom: 4px;
  }
  .tag-orange { background: var(--primary); color: var(--white); }
  .tag-green { background: #059669; color: var(--white); }
  .tag-dark { background: #1E293B; color: var(--white); }
  .step {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--primary); color: var(--white);
    font-weight: 700; font-size: 0.7em; margin-right: 6px; flex-shrink: 0;
  }
  .step-green { background: #059669; }
  .pillar-box {
    text-align: center; padding: 18px 12px;
    border-radius: var(--radius); box-shadow: var(--shadow-md);
    border: 1px solid #E2E8F0; background: var(--white);
    color: var(--text);
  }
  .divider { width: 100%; height: 1px; background: #E2E8F0; margin: 12px 0; }
  .text-muted { color: #64748B; font-size: 0.8em; }
  .text-center { text-align: center; }
  .diagram-box {
    background: #0F172A; color: #E2E8F0;
    border-radius: var(--radius); padding: 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68em; line-height: 1.5;
  }
  .diagram-box .hl { color: var(--primary); font-weight: bold; }
  .diagram-box .dim { color: #64748B; }
  .diagram-box .grn { color: #34D399; }
  img[alt~="center"] { display: block; margin: 0 auto; }
  ul, ol { margin: 6px 0; padding-left: 20px; }
  li { margin-bottom: 4px; }
  li strong { color: var(--primary); }
  .badge {
    display: inline-block; background: var(--primary); color: var(--white);
    font-size: 0.65em; font-weight: 600; padding: 1px 8px; border-radius: 8px;
  }
  .divider-center { width: 50px; height: 3px; background: var(--primary); margin: 14px auto; border-radius: 2px; }
  .text-small { color: #64748B; font-size: 0.78em; }
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

<div class="timeline">
<div class="tl-item"><span class="badge">0-2'</span> ¿Qué es observabilidad?</div>
<div class="tl-item"><span class="badge">2-5'</span> Monitoreo vs 3 pilares</div>
<div class="tl-item"><span class="badge">5-10'</span> 📈 Métricas + 📝 Logs</div>
<div class="tl-item"><span class="badge">10-13'</span> 🔍 Trazas</div>
<div class="tl-item"><span class="badge">13-17'</span> OTel + LGTM + Pipeline</div>
<div class="tl-item"><span class="badge">17-20'</span> Arquitectura del taller</div>
</div>
<style>
.timeline { display: flex; flex-direction: column; gap: 6px; }
.tl-item { display: flex; align-items: center; gap: 10px; padding: 6px 12px; border-radius: 6px; background: var(--gray-50); font-size: 0.85em; }
</style>
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
<div class="card card-orange">

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
<div class="card card-orange">

**📌 Un `event` único**

`user.created`
`payment.failed`
`order.shipped`
`auth.login`

Buscable y agrupable

</div>
<div class="card card-orange">

**🔗 El `trace_id` siempre**

```json
{
  "event": "post.created",
  "trace_id": "abc..."
}
```

1 click → de log a traza

</div>
<div class="card card-orange">

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
<div class="card card-orange">

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
<div class="card card-orange">

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
<div class="card card-orange text-center">

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

<div class="card card-orange" style="margin-top: 8px;">
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

<div class="card card-orange text-center" style="margin-top: 8px;">

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
<div class="card card-orange">

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
<div class="card card-orange" style="padding: 14px 8px;">

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
