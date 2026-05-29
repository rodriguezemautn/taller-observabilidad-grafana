# Lecciones Aprendidas — Taller de Observabilidad

> Errores encontrados durante la puesta en marcha del stack LGTM + OpenTelemetry,
> con sus causas raíz, soluciones aplicadas y por qué funcionan.

---

## 1. Pipelines rotos por protocol mismatch

### Error: Métricas, logs o trazas no llegan a Grafana

Los componentes del pipeline se inician correctamente pero no hay datos en los
dashboards. El OTel Collector no muestra errores, Mimir/Loki/Tempo responden
healthchecks, pero las queries devuelven vacío.

### Causa raíz

Los exportadores de OpenTelemetry JS (`OTLPTraceExporter`, `OTLPMetricExporter`)
usaban el protocolo **gRPC** (importados de `@opentelemetry/exporter-trace-otlp-grpc`),
pero la URL de conexión apuntaba al puerto **HTTP** del OTel Collector (4318) con
rutas estilo `/v1/traces`.

```typescript
// ❌ INCORRECTO: Exporter gRPC apuntando a puerto HTTP con ruta REST
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc"

const otlpEndpoint = "http://otel-collector:4318"
new OTLPTraceExporter({ url: `${otlpEndpoint}/v1/traces` })
//   ↑ gRPC protocol        ↑ HTTP port  ↑ REST path
//   Protocol mismatch → conexión falla silenciosamente
```

El puerto 4318 del Collector acepta **HTTP/protobuf**, no gRPC. El puerto 4317
es para gRPC. Al usar el protocolo equivocado, las exportaciones fallan sin
log visible (el SDK traga el error internamente).

### Solución

Usar los exportadores **HTTP** de OpenTelemetry JS, que sí usan la ruta
`/v1/traces` con POST de protobuf sobre HTTP/1.1:

```typescript
// ✅ CORRECTO: Exporter HTTP apuntando a puerto HTTP
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http"

const otlpEndpoint = "http://otel-collector:4318"
new OTLPTraceExporter({ url: `${otlpEndpoint}/v1/traces` })
//   ↑ HTTP protocol       ↑ HTTP port  ↑ REST path
//   Compatible → datos fluyen correctamente
```

**Paquetes**: `@opentelemetry/exporter-trace-otlp-http` y
`@opentelemetry/exporter-metrics-otlp-http` (ambos v0.55+).

### Por qué funciona

El OTel Collector expone dos protocolos en el receiver OTLP:

| Puerto | Protocolo | Ruta |
|--------|-----------|------|
| 4317 | gRPC (HTTP/2) | Determinada por proto service |
| 4318 | HTTP (HTTP/1.1) | `/v1/traces`, `/v1/metrics`, etc. |

Cada exportador JS debe coincidir con el protocolo del puerto al que apunta.
La regla es simple: **puerto 4317 → exporter gRPC, puerto 4318 → exporter HTTP**.

---

## 2. Mimir requiere autenticación multi-tenant

### Error: Mimir rechaza pushes y queries con 401/403

El OTel Collector no puede hacer remote write a Mimir. Grafana no puede
consultar métricas. El healthcheck `/ready` responde 200 pero las APIs
devuelven error de autorización.

### Causa raíz

Mimir tiene **multi-tenencia habilitada por defecto**. Toda request a sus APIs
(push, query, labels) debe incluir el header `X-Scope-OrgID` con un identificador
de tenant. Sin este header, Mimir rechaza la operación.

Es un diseño deliberado de Mimir (heredado de Cortex/Thanos) para permitir
que múltiples equipos compartan la misma instancia sin mezclar datos.

### Solución

Agregar el header en **dos lugares**:

1. **En el OTel Collector** (exporter prometheusremotewrite):

```yaml
exporters:
  prometheusremotewrite:
    endpoint: http://mimir:9009/api/v1/push
    headers:
      X-Scope-OrgID: "anonymous"
```

2. **En el datasource de Grafana** (para que las queries también funcionen):

```yaml
datasources:
  - name: Mimir
    uid: mimir
    type: prometheus
    url: http://mimir:9009/prometheus
    jsonData:
      httpHeaderName1: "X-Scope-OrgID"
    secureJsonData:
      httpHeaderValue1: "anonymous"
```

### Por qué funciona

Mimir necesita saber a qué tenant pertenece cada serie de tiempo. El header
`X-Scope-OrgID` identifica al tenant. Usando `"anonymous"` como valor para un
entorno local de desarrollo es suficiente — en producción usarías identificadores
reales de equipo/proyecto.

---

## 3. Mimir en single-node necesita config explícita

### Error: Mimir no arranca o entra en crash loop

Mimir se inicia pero no responde en el puerto esperado, o los rings de
ingester/distributor no se estabilizan (log hanging en "waiting for JOINING").

### Causa raíz

Mimir por defecto:
- Escucha en **puerto 8080** (no 9009 como esperábamos)
- Usa **memberlist** para el KV store de rings, que requiere múltiples instancias
  para formar quorum

Sin configuración explícita, un solo nodo de Mimir no logra establecer quorum
en los rings y nunca pasa a estado ACTIVE.

### Solución

Crear `docker/mimir.yml` con configuración single-node explícita:

```yaml
server:
  http_listen_port: 9009

distributor:
  ring:
    kvstore:
      store: inmemory

ingester:
  ring:
    kvstore:
      store: inmemory
    replication_factor: 1

store_gateway:
  sharding_ring:
    kvstore:
      store: inmemory

compactor:
  sharding_ring:
    kvstore:
      store: inmemory

runtime_config:
  file: /etc/mimir/mimir-overrides.yaml
```

Y crear `docker/mimir-overrides.yaml` (archivo requerido por `runtime_config`,
puede estar vacío o con valores mínimos):

```yaml
overrides: {}
```

### Por qué funciona

`store: inmemory` elimina la dependencia de memberlist/etcd para sincronizar
estado entre nodos. Con `replication_factor: 1`, cada serie se almacena una
sola vez (sin replicación). Esto permite que Mimir funcione correctamente con
una sola instancia — ideal para desarrollo y talleres.

---

## 4. Las etiquetas Prometheus usan guión bajo, no punto

### Error: Queries PromQL devuelven "label not found"

Las queries del dashboard RED usan etiquetas con puntos (`.`) como
`http.method`, `http.route`, `http.status_code`, pero Mimir reporta que esas
etiquetas no existen.

### Causa raíz

OpenTelemetry usa **atributos con puntos** en su modelo de datos (ej.
`http.method`, `http.status_code`). Sin embargo, el exporter
`prometheusremotewrite` del OTel Collector **sanitiza** estos nombres para
cumplir con las reglas de nomenclatura de Prometheus:

- Los puntos (`.`) se convierten en guiones bajos (`_`)
- camelCase se convierte a snake_case
- Caracteres especiales se eliminan

### Solución

Usar guiones bajos en las queries PromQL:

```
# ❌ Incorrecto (atributo OTel original)
rate(http_server_duration_count{http.method="GET"}[5m])

# ✅ Correcto (sanitizado por PRW exporter)
rate(http_server_duration_milliseconds_count{http_method="GET"}[1m])
```

**Regla práctica**: en las métricas exportadas por OTel a Prometheus, TODAS
las etiquetas usan guión bajo. Nunca verás un punto en un label name de Mimir.

Para verificar los labels reales disponibles:

```bash
curl -H "X-Scope-OrgID: anonymous" \
  http://localhost:9009/prometheus/api/v1/labels
```

### Por qué funciona

El protocolo remote write de Prometheus define que los label names deben
coincidir con `[a-zA-Z_][a-zA-Z0-9_]*`. OTel sanitiza automáticamente al
exportar, pero las queries en Grafana las escribimos nosotros — y es fácil
olvidar la conversión.

---

## 5. Los nombres de métricas OTel no son obvios

### Error: Queries PromQL devuelven "metric not found"

Las queries del dashboard usan `http_server_duration_count` pero Mimir reporta
que la métrica no existe.

### Causa raíz

La instrumentación HTTP de OpenTelemetry (`@opentelemetry/instrumentation-http`)
genera métricas con nombres que incluyen la unidad:

```
# Nombre real en Mimir:
http_server_duration_milliseconds_count
#                    ↑ "milliseconds" está incluido
```

No es `http_server_duration_count` ni `http_server_duration_ms_count`.

### Solución

Usar el nombre completo de la métrica:

```promql
# ❌ No existe
rate(http_server_duration_count[1m])

# ✅ Nombre real
rate(http_server_duration_milliseconds_count[1m])
```

Para descubrir los nombres reales:

```bash
curl -H "X-Scope-OrgID: anonymous" \
  http://localhost:9009/prometheus/api/v1/label/__name__/values
```

### Por qué funciona

OTel incluye la unidad en el nombre de la métrica como convención.
`http_server_duration` se mide en **milliseconds**, y OTel lo refleja en el
nombre: `_milliseconds_`. Es consistente con otras métricas OTel como
`http_client_duration_milliseconds_*`.

---

## 6. Pino-Loki requiere dual transport

### Error: Los logs no llegan a Loki

La aplicación logea correctamente en consola (pino-pretty), pero no se ven
entradas en Loki ni en el dashboard de logs.

### Causa raíz

Pino 9+ cambió el sistema de transports. Ya no se usa `pino.transport()`
con un solo destino — se requiere `pino.transport({targets: [...]})` para
múltiples salidas. Además, `pino-loki` v3 usa `pino-abstract-transport` y
necesita la opción `api-compatible: true` para ciertas versiones de Loki.

### Solución

Configurar dual transport con `pino.transport({targets})`:

```typescript
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: pino.transport({
    targets: [
      {
        target: "pino-pretty",
        level: "info",
        options: { colorize: true },
      },
      {
        target: "pino-loki",
        level: "info",
        options: {
          host: "http://loki:3100",
          labels: { service_name: "taller-backend" },
          apiCompatible: true,
        },
      },
    ],
  }),
})
```

### Por qué funciona

Pino 9 permite múltiples targets en un solo transport. `pino-loki` envía cada
log como una entrada JSON a la API HTTP de Loki (`/loki/api/v1/push`). La
etiqueta `service_name` permite filtrar logs por servicio en Grafana.

---

## 7. Mimir requiere sobreescritura de Grafana

### Error: Los dashboards de Grafana muestran "No data"

Mimir tiene datos (las queries directas via curl funcionan), pero los paneles
de Grafana no muestran nada.

### Causa raíz

El dashboard no especifica un `datasource`, o lo especifica incorrectamente.
Grafana no puede asociar las queries al datasource de Mimir.

### Solución

Cada panel debe referenciar explícitamente el datasource:

```json
{
  "title": "Rate de Requests",
  "datasource": { "type": "prometheus", "uid": "mimir" },
  "targets": [
    {
      "expr": "rate(http_server_duration_milliseconds_count[$__rate_interval])",
      "legendFormat": "{{http_method}} {{http_status_code}}"
    }
  ]
}
```

Y el datasource debe tener un `uid` explícito:

```yaml
datasources:
  - name: Mimir
    uid: mimir
    type: prometheus
    url: http://mimir:9009/prometheus
```

### Por qué funciona

Grafana asigna UIDs auto-generados a los datasources provisionados. Sin un
`uid` explícito, no podemos referenciarlos desde los dashboards. Al fijar
`uid: mimir` (o `uid: tempo`, `uid: loki`), los paneles pueden apuntar al
datasource correcto de forma determinística.

---

## 8. TraceQL usa scope para atributos de recurso

### Error: El dashboard de Trazas no muestra datos

El panel de búsqueda de trazas en Grafana no encuentra traces, aunque Tempo
tiene datos (la API `/api/search` devuelve resultados).

### Causa raíz

TraceQL requiere especificar el **scope** del atributo. `service.name` es un
atributo de **recurso** (resource), no de span. La query:

```traceql
# ❌ Incorrecto — "service" no es un identificador conocido
{service.name="taller-backend"}
```

...falla porque TraceQL no sabe si buscar en span, resource, o event.

### Solución

Prefijar con `resource.`:

```traceql
# ✅ Correcto
{resource.service.name="taller-backend"}
```

### Por qué funciona

Tempo organiza los atributos en scopes:

| Scope | Contenido | Sintaxis TraceQL |
|-------|-----------|------------------|
| `span` | Atributos del span (http.method, http.status_code) | `span.http.method` |
| `resource` | Atributos del recurso (service.name, host.name) | `resource.service.name` |
| `event` | Atributos de eventos (exception.message) | `event.exception.message` |
| `intrinsic` | Campos intrínsecos (duration, status, kind) | `duration`, `status` |

El scope `resource` incluye `service.name` porque el nombre del servicio es
una propiedad del recurso (la aplicación), no del span individual.

Para descubrir los atributos disponibles por scope:

```bash
curl http://localhost:3200/api/v2/search/tags
```

---

## 9. Dashboard provisionado necesita metadata completa

### Error: El dashboard se importa pero no se muestra en Grafana

El archivo JSON del dashboard está en el directorio provisionado, pero Grafana
no lo muestra.

### Causa raíz

Grafana provisioning requiere ciertos campos mínimos en el JSON del dashboard.
Sin `uid`, `schemaVersion`, o con `version` incorrecto, el dashboard puede no
cargarse o sobrescribirse incorrectamente.

### Solución

Incluir metadata completa:

```json
{
  "title": "RED - Backend",
  "uid": "red-backend",
  "version": 1,
  "schemaVersion": 40,
  "editable": true,
  "time": { "from": "now-15m", "to": "now" },
  "timepicker": {}
}
```

### Por qué funciona

Grafana usa `uid` para identificar dashboards de forma única (incluso entre
reimportaciones). `version` controla la sobrescritura. `schemaVersion` asegura
compatibilidad con la versión de Grafana en uso.

---

## Resumen rápido

| # | Problema | Síntoma | Solución en 1 línea |
|---|----------|---------|---------------------|
| 1 | Protocol mismatch OTel | No llegan métricas/trazas | Usar exporter HTTP para puerto 4318 |
| 2 | Mimir multi-tenant | APIs rechazan requests | Agregar header `X-Scope-OrgID: anonymous` |
| 3 | Mimir sin config single-node | Crash loop en rings | `kvstore: inmemory` + `replication_factor: 1` |
| 4 | Labels con puntos en PromQL | "label not found" | Usar guión bajo: `http_method` no `http.method` |
| 5 | Metric name sin milliseconds | "metric not found" | `http_server_duration_milliseconds_count` |
| 6 | Pino-loki no configurado | Logs no llegan a Loki | `pino.transport({targets:[...]})` dual |
| 7 | Dashboard sin datasource | "No data" en Grafana | Setear `datasource: {type, uid}` en cada panel |
| 8 | TraceQL sin scope resource | Trazas no aparecen | `{resource.service.name="..."}` |
| 9 | Dashboard sin metadata | No se muestra | Agregar `uid`, `version`, `schemaVersion` |
