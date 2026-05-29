# Grafana con Docker: Monitoreo de Contenedores

## Contexto

Este documento cubre el despliegue de **Grafana y su ecosistema LGTM** en Docker Compose, y cómo monitorear contenedores (métricas, logs, trazas) desde un entorno 100% local. Es el enfoque utilizado en el taller de observabilidad.

## Arquitectura del Stack LGTM en Docker

```
                  ┌───────────────────┐
                  │   Aplicación App   │
                  │ (Fastify + React)  │
                  └────────┬──────────┘
                           │ OTLP (OpenTelemetry)
                           ▼
                  ┌───────────────────┐
                  │  OpenTelemetry     │
                  │    Collector       │
                  └──┬──────┬──────┬──┘
                     │      │      │
               ┌─────┘      │      └──────┐
               ▼            ▼             ▼
         ┌──────────┐ ┌──────────┐ ┌──────────┐
         │   Loki   │ │  Tempo   │ │  Mimir   │
         │  (logs)  │ │ (trazas) │ │(métricas)│
         │ :3100    │ │ :3200    │ │ :9009    │
         └────┬─────┘ └────┬─────┘ └────┬─────┘
              │            │            │
              └──────────┬─┴────────────┘
                         ▼
                  ┌──────────────┐
                  │   Grafana    │
                  │   :3000      │
                  └──────────────┘
```

## Componentes del Stack

| Componente | Imagen Docker | Puerto | Función |
|-----------|--------------|--------|---------|
| **Grafana** | `grafana/grafana:latest` | 3000 | Visualización y dashboards |
| **Loki** | `grafana/loki:latest` | 3100 | Almacenamiento y consulta de logs |
| **Tempo** | `grafana/tempo:latest` | 3200 (3200 UI) / 4317 (gRPC) | Trazado distribuido |
| **Mimir** | `grafana/mimir:latest` | 9009 | Métricas de series temporales |
| **OTel Collector** | `otel/opentelemetry-collector-contrib:latest` | 4317 (gRPC) / 4318 (HTTP) | Pipeline de telemetría |
| **PostgreSQL** | `postgres:16-alpine` | 5432 | Base de datos de la app |
| **Node App** | Build local | 3001 | Backend + Frontend |

## docker-compose.yml Esencial

```yaml
version: "3.8"
services:
  app:
    build: .
    ports: ["3001:3001"]
    environment:
      - OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/taller
    depends_on: [postgres, otel-collector]

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: taller
      POSTGRES_PASSWORD: postgres
    ports: ["5432:5432"]

  otel-collector:
    image: otel/opentelemetry-collector-contrib:latest
    volumes:
      - ./otel-collector/config.yml:/etc/otel/config.yml
    command: ["--config", "/etc/otel/config.yml"]
    ports: ["4317:4317", "4318:4318"]
    depends_on: [loki, tempo, mimir]

  loki:
    image: grafana/loki:latest
    ports: ["3100:3100"]

  tempo:
    image: grafana/tempo:latest
    ports: ["3200:3200", "4317:4317"]

  mimir:
    image: grafana/mimir:latest
    ports: ["9009:9009"]

  grafana:
    image: grafana/grafana:latest
    ports: ["3000:3000"]
    volumes:
      - ./grafana/datasources:/etc/grafana/provisioning/datasources
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
    depends_on: [loki, tempo, mimir]
```

## Monitoreo de Contenedores

### Métricas de Contenedores (cAdvisor + Mimir)

Para monitorear el consumo de recursos de los contenedores (CPU, RAM, red), se agrega **cAdvisor** al stack:

```yaml
cadvisor:
  image: gcr.io/cadvisor/cadvisor:latest
  ports: ["8080:8080"]
  volumes:
    - /:/rootfs:ro
    - /var/run:/var/run:ro
    - /sys:/sys:ro
    - /var/lib/docker/:/var/lib/docker:ro
    - /dev/disk/:/dev/disk:ro
```

cAdvisor expone métricas en `/metrics` en formato Prometheus. El OTel Collector o un scraper de Prometheus las recolecta y las envía a Mimir.

**Dashboard de contenedores:**
- **CPU**: % de uso por contenedor
- **Memoria**: RAM usada vs límite
- **Red**: bytes enviados/recibidos por interfaz
- **Disk I/O**: operaciones de lectura/escritura

### Logs de Contenedores (Loki + Promtail/Alloy)

Para recolectar logs de todos los contenedores, se usa **Promtail** (o **Grafana Alloy**, el reemplazo moderno):

```yaml
promtail:
  image: grafana/promtail:latest
  volumes:
    - /var/log:/var/log:ro
    - /var/lib/docker/containers:/var/lib/docker/containers:ro
  command: -config.file=/etc/promtail/config.yml
```

Promtail etiqueta cada log con metadatos del contenedor: `container_name`, `service_name`, `image`, etc. Esto permite filtrar logs por servicio en Grafana.

### Trazas entre Contenedores (Tempo + OTel)

Cada servicio (frontend, backend) exporta trazas vía OTLP al OTel Collector. Tempo recibe las trazas del collector y las almacena indexadas por `service.name` y `span.name`.

**Flujo de una traza:**

```
POST /api/posts (Frontend)
  └─ HTTP POST → backend:3001/api/posts (Span HTTP)
       └─ CreatePostUseCase.execute() (Span de negocio)
            └─ Prisma: post.create() (Span de DB)
```

## Provisioning de Grafana

Grafana permite configurar datasources y dashboards **sin intervención manual** via archivos YAML/JSON montados como volúmenes.

### Datasources (`/etc/grafana/provisioning/datasources/datasources.yml`)

```yaml
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

### Dashboards (`/etc/grafana/provisioning/dashboards/dashboards.yml`)

```yaml
apiVersion: 1
providers:
  - name: "default"
    folder: "Taller"
    type: file
    options:
      path: /etc/grafana/provisioning/dashboards
```

## Tipos de Datasources Clave

| Datasource | Señal | Query de ejemplo |
|-----------|-------|------------------|
| **Loki** | Logs | `{service_name="backend"} \|= "post.created"` |
| **Tempo** | Trazas | `{service.name="backend"}` — busca trazas del backend |
| **Mimir** | Métricas | `rate(http_requests_total[5m])` — tasa de requests |

## Frameworks de Métricas

### RED (para servicios)
| Métrica | Consulta Mimir/PromQL |
|---------|----------------------|
| Rate | `rate(http_requests_total[5m])` |
| Errors | `rate(http_requests_total{status=~"5.."}[5m])` |
| Duration | `histogram_quantile(0.95, rate(http_duration_seconds_bucket[5m]))` |

### USE (para infraestructura/recursos)
| Métrica | Consulta |
|---------|----------|
| Utilization | `container_cpu_usage_seconds_total` / `container_spec_cpu_quota` |
| Saturation | `container_memory_working_set_bytes` / `container_spec_memory_limit_bytes` |
| Errors | `container_last_seen` (faltante indica caída) |

## Configuración OpenTelemetry Collector

```yaml
# config.yml del OTel Collector
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:
    timeout: 1s
    send_batch_size: 1024

exporters:
  loki:
    endpoint: http://loki:3100/loki/api/v1/push
  prometheus:
    endpoint: http://mimir:9009/api/v1/push
  otlp/tempo:
    endpoint: tempo:4317
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp/tempo]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus]
    logs:
      receivers: [otlp]
      processors: [batch]
      exporters: [loki]
```

## Mejores Prácticas

1. **Usar redes de Docker**: Todos los servicios deben estar en la misma red para comunicarse por nombre de servicio
2. **Healthchecks**: Agregar healthchecks a cada servicio para que Docker sepa cuándo están listos
3. **Versiones fijas**: Pinear versiones de imágenes (no usar `latest`) para evitar roturas por cambios upstream
4. **Volúmenes nombrados**: Usar volúmenes para datos persistentes (PostgreSQL, Loki, Mimir)
5. **Límites de recursos**: Agregar `deploy.resources.limits` a cada servicio para evitar que un contenedor consuma toda la RAM del alumno
6. **Logs estructurados**: La aplicación debe emitir logs en JSON para que Loki los pueda indexar correctamente

## Referencias

- Grafana Labs, "Grafana Documentation" — https://grafana.com/docs/
- OpenTelemetry, "Documentación oficial" — https://opentelemetry.io/docs/
- Grafana, "Loki documentation" — https://grafana.com/docs/loki/
- Grafana, "Tempo documentation" — https://grafana.com/docs/tempo/
- Grafana, "Mimir documentation" — https://grafana.com/docs/mimir/
- cAdvisor, "GitHub repository" — https://github.com/google/cadvisor
