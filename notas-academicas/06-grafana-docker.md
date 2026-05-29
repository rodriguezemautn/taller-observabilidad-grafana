# Grafana con Docker: Monitoreo de Contenedores

## Contexto

Este documento cubre el despliegue de **Grafana y su ecosistema LGTM** en Docker Compose, y cómo monitorear contenedores (métricas, logs, trazas) desde un entorno 100% local. Es el enfoque utilizado en el taller de observabilidad.

A diferencia de otros stacks de monitoreo (Prometheus + Grafana básico), este stack está diseñado para ser **didáctico**: muestra los 3 pilares de la observabilidad (métricas, logs, trazas) integrados en un solo dashboard.

---

## Arquitectura del Stack

```
                    ┌───────────────────┐
                    │   Aplicación App   │
                    │ (Fastify + React)  │
                    └────────┬──────────┘
                             │ OTLP HTTP (metrics + traces)
                             │ Pino → Loki (logs, directo)
                             ▼
                    ┌───────────────────┐
                    │  OpenTelemetry     │
                    │    Collector       │
                    │  scrapers:         │
                    │  postgres-exporter │
                    │  cadvisor          │
                    │  node-exporter     │
                    └──┬──────┬──────┬──┘
                       │      │      │
                 ┌─────┘      │      └──────┐
                 ▼            ▼             ▼
           ┌──────────┐ ┌──────────┐ ┌──────────┐
           │   Loki   │ │  Tempo   │ │  Mimir   │
           │  (logs)  │ │ (trazas) │ │(métricas)│
           │  :3100   │ │ :3200    │ │ :9009    │
           └────┬─────┘ └────┬─────┘ └────┬─────┘
                │            │            │
                └──────────┬─┴────────────┘
                           ▼
                    ┌──────────────┐
                    │   Grafana    │
                    │   :3000      │
                    │   Loki       │
                    │   Tempo      │
                    │   Mimir      │
                    └──────────────┘
```

---

## Componentes del Stack

| Componente | Imagen Docker | Puerto(s) | Función |
|-----------|--------------|-----------|---------|
| **Grafana** | `grafana/grafana:latest` | 3000 | Visualización y dashboards |
| **Loki** | `grafana/loki:latest` | 3100 | Almacenamiento y consulta de logs |
| **Tempo** | `grafana/tempo:latest` | 3200 | Almacenamiento de trazas (tracing distribuido) |
| **Mimir** | `grafana/mimir:latest` | 9009 | Métricas de series temporales (compatible Prometheus) |
| **OTel Collector** | `otel/opentelemetry-collector-contrib:latest` | 4317 (gRPC), 4318 (HTTP), 13133 (health) | Pipeline de telemetría + scraper Prometheus |
| **PostgreSQL** | `postgres:16-alpine` | 5432 | Base de datos de la aplicación |
| **App** | Build local (multistage) | 3001 | Backend (Fastify) + Frontend (React) |
| **postgres-exporter** | `quay.io/prometheuscommunity/postgres-exporter` | 9187 | Exporta métricas de PostgreSQL a Prometheus |
| **cAdvisor** | `gcr.io/cadvisor/cadvisor` | 8080 | Exporta métricas de contenedores |
| **node-exporter** | `prom/node-exporter` | 9100 | Exporta métricas del host (CPU, RAM, disco, red) |

**Total: 10 servicios.**

---

## docker-compose.yml (versión actual)

El archivo completo está en `docker/docker-compose.yml`. Acá los patrones clave:

### Variables de Entorno

```yaml
# docker/.env
POSTGRES_DB=taller
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
GF_SECURITY_ADMIN_USER=admin
GF_SECURITY_ADMIN_PASSWORD=admin
```

Docker Compose carga `.env` automáticamente. Se referencian con sintaxis de shell:

```yaml
environment:
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
```

> **¿Por qué `${VAR:-default}`?** Así el compose funciona incluso si no existe el `.env`. El default es el valor del taller.

### Ancla de Logging

```yaml
x-logging: &default-logging
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

Se aplica a cada servicio con `logging: *default-logging`. Sin esto, Docker acumula logs sin límite.

### Límites de Recursos

```yaml
deploy:
  resources:
    limits:
      cpus: "0.5"
      memory: "256M"
```

Sin límites, un contenedor puede consumir toda la RAM del host. Con límites, el stack total usa ~2.5 GB máximos.

### Healthchecks

```yaml
healthcheck:
  test: ["CMD", "wget", "--spider", "http://localhost:3000/api/health"]
  interval: 10s
  timeout: 5s
  retries: 3
  start_period: 15s
```

Permiten que `depends_on: condition: service_healthy` espere a que el servicio esté realmente listo, no solo el container running.

### Dependencias

```yaml
depends_on:
  postgres:
    condition: service_healthy
  otel-collector:
    condition: service_healthy
```

### Versiones de imágenes

```yaml
image: grafana/loki:${IMAGE_TAG_LOKI:-latest}
```

Por defecto `latest`. Para fijar versiones (recomendado para producción del taller), descomentar las versiones en `.env`:

```bash
IMAGE_TAG_LOKI=3.4.2
IMAGE_TAG_GRAFANA=11.6.0
```

---

## Monitoreo de Contenedores

### Métricas de Contenedores (cAdvisor → Mimir)

cAdvisor expone métricas en `/metrics` (formato Prometheus):

```yaml
cadvisor:
  image: gcr.io/cadvisor/cadvisor:latest
  ports: ["8080:8080"]
  volumes:
    - /:/rootfs:ro
    - /var/run:/var/run:ro
    - /sys:/sys:ro
    - /var/lib/docker/:/var/lib/docker:ro
  privileged: true
```

El OTel Collector scrapea `cadvisor:8080/metrics` cada 15s y envía a Mimir.

**Dashboard de contenedores:**
- **CPU**: `rate(container_cpu_usage_seconds_total{name!=""}[$__rate_interval])` por container
- **Memoria**: `container_memory_usage_bytes{name!=""}` por container
- **Red**: `rate(container_network_receive_bytes_total{name!=""}[$__rate_interval])`
- **Contenedores activos**: `count(container_last_seen{name!=""})`

### Métricas del Host (node-exporter → Mimir)

```yaml
node-exporter:
  image: prom/node-exporter:latest
  volumes:
    - /proc:/host/proc:ro
    - /sys:/host/sys:ro
    - /:/rootfs:ro
  command:
    - "--path.procfs=/host/proc"
    - "--path.sysfs=/host/sys"
    - "--path.rootfs=/rootfs"
```

**Dashboard de host:**
- **CPU**: `100 - avg by(instance)(rate(node_cpu_seconds_total{mode="idle"}[$__rate_interval]) * 100)`
- **Memoria**: `node_memory_MemTotal_bytes - node_memory_MemFree_bytes`
- **Disco**: `node_filesystem_size_bytes{mountpoint="/"} - node_filesystem_free_bytes`
- **Load**: `node_load15`
- **Uptime**: `node_time_seconds - node_boot_time_seconds`

### Métricas de PostgreSQL (postgres-exporter → Mimir)

```yaml
postgres-exporter:
  image: quay.io/prometheuscommunity/postgres-exporter:latest
  environment:
    DATA_SOURCE_NAME: "postgresql://postgres:postgres@postgres:5432/taller?sslmode=disable"
```

**Dashboard PostgreSQL:**
- **Conexiones activas**: `avg(pg_stat_activity_count) by (datname, state)`
- **Transacciones/s**: `rate(pg_stat_database_xact_commit_total[$__rate_interval])`
- **Cache hit ratio**: `rate(blks_hit_total) / (rate(blks_hit_total) + rate(blks_read_total))`
- **Operaciones r/w**: `rate(pg_stat_database_tup_fetched_total[$__rate_interval])`
- **Deadlocks**: `rate(pg_stat_database_deadlocks_total[$__rate_interval])`

> **Atención**: Las métricas de postgres-exporter usan sufijo `_total` en los counters. Ej: `pg_stat_database_xact_commit_total` (no `pg_stat_database_xact_commit`). Este sufijo lo agrega el exporter automáticamente.

---

## Logs de Contenedores

La aplicación envía logs directamente a Loki usando `pino-loki`:

```typescript
// packages/infrastructure/src/observability/logger.ts
const transport = pino.transport({
  targets: [
    { target: 'pino-pretty', options: { colorize: true } },
    {
      target: 'pino-loki',
      options: {
        host: 'http://loki:3100',
        labels: { service_name: 'taller-backend' },
      },
    },
  ],
});
```

No se necesita Promtail/Grafana Alloy porque los logs van directo de la app a la API de Loki.

**Filtros en Grafana (LogQL):**
```logql
{service_name="taller-backend"}                           // Todos
{service_name="taller-backend"} |= "post.created"         // Por evento
{service_name="taller-backend"} |= "error"                 // Solo errores
{service_name="taller-backend"} | json | level > 30       // Warn/Error por nivel
```

---

## Trazas entre Contenedores (Tempo + OTel)

La app exporta trazas vía OTLP HTTP al OTel Collector, que las reenvía a Tempo vía gRPC:

```
HTTP Request → OTel SDK → OTLP/HTTP → OTel Collector → OTLP/gRPC → Tempo
```

**Flujo de una traza de creación de post:**

```
POST /api/posts (span HTTP)
  └─ create-post (span manual en el caso de uso)
       └─ prisma:post.create (span de base de datos)
```

**TraceQL (consulta de trazas):**
```traceql
{resource.service.name="taller-backend"}
{resource.service.name="taller-backend"} | span.duration > 100ms
{resource.service.name="taller-backend"} && name="create-post"
```

> **Nota**: Las trazas se consultan con `resource.service.name` (scope del resource), no `service.name` (scope del span). Usar `service.name` da error "unknown identifier".

---

## Provisioning de Grafana

Grafana arranca con datasources y dashboards ya configurados:

### Datasources (`docker/grafana/datasources.yml`)

```yaml
apiVersion: 1
datasources:
  - name: Loki
    uid: loki
    type: loki
    url: http://loki:3100

  - name: Tempo
    uid: tempo
    type: tempo
    url: http://tempo:3200

  - name: Mimir
    type: prometheus
    uid: mimir
    url: http://mimir:9009/prometheus
    jsonData:
      httpHeaderName1: "X-Scope-OrgID"
    secureJsonData:
      httpHeaderValue1: "anonymous"
```

> **Cada datasource tiene `uid` explícito**. Sin eso, Grafana genera uno aleatorio y los dashboards provisionados se rompen (no encuentran el datasource).

> **Mimir requiere `X-Scope-OrgID: anonymous`** porque es multi-tenant. Sin ese header, rechaza todas las consultas.

### Dashboards (`docker/grafana/dashboards.yml`)

```yaml
apiVersion: 1
providers:
  - name: "default"
    type: file
    options:
      path: /etc/grafana/provisioning/dashboards
    allowUiUpdates: true
```

**`allowUiUpdates: true`** permite que los alumnos editen dashboards desde la UI sin perder cambios al reiniciar. En producción esto iría en `false`.

### Dashboards incluidos (5)

| Archivo | Dashboard | Señal |
|---------|-----------|-------|
| `red-dashboard.json` | RED - Backend | Métricas (PromQL) |
| `logs-dashboard.json` | Logs de la Aplicación | Logs (LogQL) |
| `traces-dashboard.json` | Trazas del Backend | Trazas (TraceQL) |
| `postgres-dashboard.json` | Base de Datos - PostgreSQL | Métricas (PromQL) |
| `infra-dashboard.json` | Infraestructura - Host y Contenedores | Métricas (PromQL) |

---

## Mejores Prácticas Aplicadas

### 1. Variables de entorno externas

No hardcodear config en el YAML. Usar `.env` + sintaxis `${VAR:-default}`.

### 2. Límites de recursos por servicio

Cada servicio tiene `deploy.resources.limits` para CPU y RAM. Evita que un contenedor se coma toda la RAM del alumno.

### 3. Healthchecks en todos los servicios

`depends_on: condition: service_healthy` evita race conditions al arrancar.

### 4. Logging con rotación

`max-size: 10m` + `max-file: 3` evita que logs llenen el disco. Ancla YAML `x-logging` para no repetir.

### 5. Volúmenes read-only

Configuraciones montadas como `:ro` para seguridad. Solo los volúmenes de datos son RW.

### 6. Versiones fijas (recomendado)

Aunque el default es `latest`, el `.env.example` documenta las versiones verificadas. Copiar al `.env` para entornos estables.

### 7. Dockerfile multistage

3 stages: deps (cache npm), build (compilar), run (solo dist). Imagen final ~350 MB (vs ~1.2 GB sin multistage).

### 8. Red bridge personalizada

Todos los servicios en `taller-net` para comunicación por nombre de servicio.

### 9. Capacidades mínimas (excepto cadvisor)

cAdvisor es el único que requiere `privileged: true` (documentado con link al issue de GitHub).

### 10. No exponer puertos innecesarios

Cada servicio expone solo los puertos que necesita el taller.

---

## Comparación: Antes vs Después

| Aspecto | Antes | Después |
|---------|-------|---------|
| Configuración | Hardcodeada en YAML | `.env` + defaults |
| Límites de RAM | Ninguno | 64M-512M por servicio |
| Límites de CPU | Ninguno | 0.1-0.5 cores por servicio |
| Healthchecks | Solo PostgreSQL | Todos los servicios |
| Logging | Default (sin límite) | Rotación 10m × 3 archivos |
| Seguridad | Bind mounts RW | `:ro` en configuraciones |
| OTel health check | No | Sí (extensión health_check) |
| Dependencias | `service_started` | `service_healthy` |
| Versiones | `latest` fijo | Variables con default latest |
| Documentación | Solo README | `.env.example` + `docs/docker-best-practices.md` |

---

## Referencias

- Grafana Labs, "Grafana Documentation" — https://grafana.com/docs/
- OpenTelemetry, "Documentación oficial" — https://opentelemetry.io/docs/
- Docker, "Compose file reference" — https://docs.docker.com/compose/compose-file/
- Docker, "Best practices for writing Dockerfiles" — https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
- cAdvisor, "GitHub repository" — https://github.com/google/cadvisor
- Postgres Exporter, "GitHub repository" — https://github.com/prometheus-community/postgres_exporter
- Node Exporter, "GitHub repository" — https://github.com/prometheus/node_exporter
- OTel Collector, "Health Check Extension" — https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/extension/healthcheckextension
