# Taller de Observabilidad con Grafana

<div align="center">

**Ingeniería y Calidad de Software** — UTN

![GitHub](https://img.shields.io/badge/stack-TypeScript_•_React_•_Fastify_•_Prisma-3178C6?style=flat-square)
![Docker](https://img.shields.io/badge/infra-Docker_•_LGTM-2496ED?style=flat-square)
![Observabilidad](https://img.shields.io/badge/observabilidad-OpenTelemetry_•_Grafana-FF671D?style=flat-square)

</div>

---

## 📋 Descripción

Este taller te introduce a la **observabilidad** en ingeniería de software. Vas a explorar una aplicación web completa (React + Fastify + PostgreSQL) que ya está instrumentada con **OpenTelemetry**, y vas a usar **Grafana** y su stack **LGTM** (Loki, Tempo, Mimir) para visualizar métricas, logs y trazas en tiempo real.

> **No vas a programar.** Vas a explorar, consultar y crear dashboards — como lo haría un Site Reliability Engineer (SRE).

---

## 🚀 Quick Start (1 comando)

```bash
# 1. Clonar el repositorio
git clone https://github.com/rodriguezemautn/taller-observabilidad-grafana.git
cd taller-observabilidad-grafana/docker

# 2. ¡Levantar todo el stack!
docker compose up -d

# 3. Verificar que esté todo funcionando
docker compose ps
```

Deberías ver **7 servicios** con estado `Up`:

| Servicio | Puerto | Para qué sirve |
|----------|--------|----------------|
| **App** (Frontend + Backend) | [localhost:3001](http://localhost:3001) | La aplicación web del taller |
| **PostgreSQL** | 5432 | Base de datos |
| **OTel Collector** | 4317-4318 | Pipeline de telemetría |
| **Loki** | 3100 | Almacenamiento de logs |
| **Tempo** | 3200 | Almacenamiento de trazas |
| **Mimir** | 9009 | Almacenamiento de métricas |
| **Grafana** | [localhost:3000](http://localhost:3000) | Visualización y dashboards |

---

## 🎯 Qué vas a aprender

| Concepto | Lo que vas a hacer | Herramienta |
|----------|-------------------|-------------|
| **📈 Métricas** | Consultar rate, errores y latencia con PromQL | Mimir (Explore) |
| **📝 Logs** | Filtrar logs estructurados por evento y trace_id | Loki (Explore) |
| **🔍 Trazas** | Explorar spans, identificar cuellos de botella | Tempo (Explore) |
| **📊 Dashboards** | Crear paneles con las 3 señales | Grafana |
| **🔗 Correlación** | Vincular logs, métricas y trazas con trace_id | Grafana |
| **🏗️ Arquitectura** | Entender cómo se instrumenta una app con OTel | Código + Docker |

---

## 📖 Plan de la Clase (60 min)

### Parte I — Teoría (20 min)

| Minuto | Tema | Conceptos clave |
|--------|------|-----------------|
| 0-3 | ¿Qué es observabilidad? | Definición, SWEBOK v4, monitoreo vs observabilidad |
| 3-7 | Los 3 pilares | Métricas (RED), logs (estructurados), trazas (spans) |
| 7-12 | OpenTelemetry | API, SDK, Collector, auto-instrumentación |
| 12-16 | Stack LGTM | Loki, Grafana, Tempo, Mimir |
| 16-20 | Pipeline + Arquitectura | App → OTel → Collector → LGTM → Grafana |

### Parte II — Laboratorio (35 min)

| Minuto | Paso | Qué hacés |
|--------|------|-----------|
| 20-23 | Setup | `docker compose up`, crear posts desde la UI |
| 23-25 | Grafana | Explorar datasources (ya configurados) |
| 25-30 | Métricas | Consultar Mimir con PromQL, ver RED |
| 30-33 | Dashboard RED | Crear dashboard con 3 paneles |
| 33-37 | Logs | Consultar Loki, filtrar por evento |
| 37-40 | Trazas | Explorar Tempo, ver spans |
| 40-43 | Dashboard completo | Agregar logs + trazas al dashboard |
| 43-50 | Ejercicios | 4 ejercicios prácticos |
| 50-55 | Aplicación al TP | ¿Cómo agregar observabilidad a tu proyecto? |
| 55-60 | Cierre | Preguntas, recursos, conclusiones |

---

## 🎮 Laboratorio Paso a Paso

### 1. Crear posts desde la UI

Abrí [http://localhost:3001](http://localhost:3001) y creá 3 o 4 posts con distintos títulos y autores. La app ya está generando telemetría.

```bash
# Alternativamente, desde la terminal:
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Mi primer post","content":"Hola taller!","author":"Alumno"}'
```

### 2. Explorar Grafana

Abrí [http://localhost:3000](http://localhost:3000) — usuario: `admin`, contraseña: `admin`.

Ya hay **datasources configurados** (sin clicks):
- **Loki** para logs
- **Tempo** para trazas
- **Mimir** para métricas

Ver: Menú → Connections → Data Sources

### 3. Consultar métricas (Mimir)

**Explore** → Datasource: **Mimir**

```promql
# Rate: requests por segundo
rate(http_server_duration_ms_count[5m])

# Errors: requests con error
rate(http_server_duration_ms_count{http_status_code=~"4.."}[5m])

# Duration: latencia p95
histogram_quantile(0.95, rate(http_server_duration_ms_bucket[5m]))
```

### 4. Consultar logs (Loki)

**Explore** → Datasource: **Loki**

```logql
# Todos los logs del backend
{service_name="taller-backend"}

# Solo creaciones de posts
{service_name="taller-backend"} |= "post.created"

# Solo errores
{service_name="taller-backend"} |= "error"
```

### 5. Consultar trazas (Tempo)

**Explore** → Datasource: **Tempo**

```traceql
# Todas las trazas del backend
{service.name="taller-backend"}

# Spans lentos (>100ms)
{service.name="taller-backend"} | span.duration > 100ms
```

### 6. Crear dashboard

1. Menú → Dashboards → **New Dashboard**
2. **+ Add visualization**
3. Agregá paneles con las queries de arriba
4. Guardá el dashboard

---

## 🧪 Ejercicios

### Ejercicio 1: Correlacionar logs y trazas
1. En Tempo, abrí una traza
2. Copiá el `trace_id`
3. En Loki, buscá `{service_name="taller-backend"} |= "<trace_id>"`
4. **Respondé:** ¿Qué información adicional tiene el log que no está en la traza?

### Ejercicio 2: Forzar un error
1. Creá un post **sin título** desde la UI
2. Buscalo en Loki: `|= "validation_error"`
3. Buscalo en Mimir: errores 4xx
4. **Respondé:** ¿En qué señal encontraste más información sobre el error?

### Ejercicio 3: Encontrar el cuello de botella
1. Buscá en Tempo: `{...} | span.duration > 50ms`
2. Identificá el span más lento
3. **Respondé:** ¿Qué operación es la más lenta? ¿Cómo la mejorarías?

### Ejercicio 4: Dashboard desde cero
1. Creá un nuevo dashboard
2. Agregá un panel de métrica, uno de logs y uno de trazas
3. Ajustá los rangos de tiempo
4. Guardalo como "Mi Dashboard"

---

## 📚 Material de Estudio

Todas las notas están en el repositorio, en `notas-academicas/`:

| # | Archivo | Tema | ⏱ Lectura |
|---|---------|------|-----------|
| 00 | `00-intro.md` | Estándares ISO y conceptos de observabilidad | 10 min |
| 01 | `01-frameworks.md` | DevOps, SRE, metodologías ágiles | 10 min |
| 02 | `02-opentelemetry.md` | OpenTelemetry: API, SDK, Collector | 15 min |
| 03 | `03-swebok.md` | Observabilidad en el SWEBOK v4 | 10 min |
| 04 | `04-grafana.md` | Grafana y ecosistema LGTM | 15 min |
| 05 | `05-arquitectura-hexagonal.md` | Puertos y adaptadores | 20 min |
| 06 | `06-grafana-docker.md` | Grafana con Docker monitoreando contenedores | 15 min |
| 07 | `07-typescript.md` | TypeScript en el proyecto | 15 min |
| 08 | `08-react-chakra.md` | React 19 y Chakra UI v3 | 15 min |
| 09 | `09-prisma-postgresql.md` | Prisma ORM y PostgreSQL | 15 min |
| 10 | `10-fastify.md` | Fastify y Pino logger | 15 min |
| 11 | `11-otel-instrumentacion.md` | OTel paso a paso en el código | 20 min |
| 12 | `12-integracion-conceptos.md` | 🌟 Mapa conceptual del taller | 15 min |
| 13 | `13-agregar-observabilidad.md` | 🎯 Guía para aplicar a tu TP | 15 min |

---

## 🛠️ Arquitectura del Proyecto

```
taller-observabilidad-grafana/
├── docker/                          ← 🐳 Infraestructura (todo con 1 comando)
│   ├── docker-compose.yml           ← 7 servicios
│   ├── Dockerfile                   ← Build multistage
│   ├── otel-collector/config.yml    ← Pipeline de telemetría
│   └── grafana/
│       ├── datasources.yml          ← Provisioning automático
│       └── dashboards/*.json        ← 3 dashboards pre-configurados
├── packages/
│   ├── core/                        ← 🧠 Dominio puro (sin dependencias)
│   │   └── src/
│   │       ├── domain/              ← Entidad Post, puertos, errores
│   │       └── application/         ← Casos de uso (CreatePost, ListPosts, GetPost)
│   ├── infrastructure/              ← ⚙️ Adaptadores (Fastify, Prisma, OTel)
│   │   └── src/
│   │       ├── http/fastify/        ← Rutas CRUD + plugins
│   │       ├── persistence/prisma/  ← PrismaPostRepository
│   │       └── observability/       ← 📡 OTel SDK + Logger + Tracer
│   └── web-app/                     ← 🖥️ Frontend React
│       └── src/
│           ├── components/          ← PostList + PostForm
│           └── api/                 ← Cliente HTTP
├── docs/
│   ├── presentacion.md              ← 📽️ Slides MARP para la clase
│   └── architecture.md              ← Decisiones arquitectónicas
├── notas-academicas/                ← 📚 13 archivos de teoría
└── public/assets/                   ← Imágenes (Grafana, OTel, Grot)
```

---

## 🔗 Referencia Rápida de Consultas

### PromQL (Mimir) — Métricas

```promql
rate(http_server_duration_ms_count[5m])                       // Rate total
rate(http...{http_status_code=~"4.."}[5m])                     // Solo errores 4xx
rate(http...{http_status_code=~"5.."}[5m])                     // Solo errores 5xx
rate(http...{http_request_method="POST"}[5m])                  // Solo POST
histogram_quantile(0.95, rate(http..._bucket[5m]))             // Latencia p95
histogram_quantile(0.99, rate(http..._bucket[5m]))             // Latencia p99
```

### LogQL (Loki) — Logs

```logql
{service_name="taller-backend"}                                 // Todos los logs
{service_name="taller-backend"} |= "post.created"               // Por evento
{service_name="taller-backend"} |= "error"                      // Solo errores
{service_name="taller-backend"} |= "01HXYZ..."                  // Por trace_id
{service_name="taller-backend"} | json | level > 30             // Solo warn/error
```

### TraceQL (Tempo) — Trazas

```traceql
{service.name="taller-backend"}                                 // Todas las trazas
{service.name="taller-backend"} | span.duration > 100ms         // Spans lentos
{service.name="taller-backend"} | span.status = error           // Spans con error
{service.name="taller-backend"} && name="crear-post"            // Spans de negocio
```

---

## ❓ Preguntas Frecuentes

<details>
<summary><strong>¿Los datasources ya están configurados o tengo que hacerlo yo?</strong></summary>
Ya están configurados automáticamente via <strong>provisioning</strong>. Grafana leyó archivos YAML al iniciar y configuró Loki, Tempo y Mimir sin intervención manual.
</details>

<details>
<summary><strong>¿La app ya viene instrumentada o tengo que agregar OTel?</strong></summary>
Ya está instrumentada. El backend tiene OTel SDK, Pino con trace_id, y spans manuales. El alumno solo explora.
</details>

<details>
<summary><strong>¿Por qué no veo datos en Grafana?</strong></summary>
1. Asegurate de haber creado algunos posts desde la UI (http://localhost:3001)
2. Verificá que todos los servicios estén corriendo: <code>docker compose ps</code>
3. En Grafana, seleccioná el rango de tiempo correcto (últimos 15 minutos)
</details>

<details>
<summary><strong>¿Cómo agrego observabilidad a mi propio proyecto?</strong></summary>
Leé la guía completa en <code>notas-academicas/13-agregar-observabilidad.md</code>. En resumen: agregá los servicios LGTM a tu docker-compose, instalá OTel SDK, y reemplazá console.log por logger.info.
</details>

<details>
<summary><strong>¿Cuánta RAM necesita el stack?</strong></summary>
Aproximadamente 4-6 GB para los 7 servicios. Si tenés poca RAM, podés comentar Mimir (métricas) y usar solo Loki + Tempo.
</details>

---

## 🧠 Para Seguir Aprendiendo

- **OpenTelemetry**: [opentelemetry.io/docs](https://opentelemetry.io/docs/)
- **Grafana Play**: [play.grafana.org](https://play.grafana.org/) — probá sin instalar nada
- **Grafana Tutorials**: [grafana.com/tutorials](https://grafana.com/tutorials/)
- **SWEBOK v4**: IEEE Computer Society — "Guide to the Software Engineering Body of Knowledge"
- **The Art of Monitoring**: James Turnbull (2016)
- **Site Reliability Engineering**: Beyer et al., O'Reilly (2016)

---

<div align="center">

**Ingeniería y Calidad de Software** — 2026

Material educativo de la cátedra.

</div>
