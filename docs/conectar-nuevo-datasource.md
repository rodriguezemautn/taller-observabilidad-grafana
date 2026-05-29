# Cómo Conectar un Nuevo Datasource a Grafana

## El Problema

Grafana no muestra datos. El panel dice "No data". Pero vos sabés que la app está generando métricas, logs o trazas. **¿Qué falta?**

El 99% de las veces el problema no está en la app, sino en la cadena:

```
App → Exporter/OTel SDK → OTel Collector → Backend (Mimir/Loki/Tempo) → Grafana → Dashboard
```

Esta guía te muestra **el proceso completo** para conectar un nuevo datasource, usando PostgreSQL como ejemplo real de este taller.

---

## Paso 1: Entender la cadena

Antes de tocar un archivo, dibujá la cadena:

```
PostgreSQL → postgres-exporter (metrics HTTP) → OTel Collector (prometheus receiver) → Mimir → Grafana
```

Si no sabés cómo va a viajar el dato, **no sabés dónde está el problema**.

Para cada tipo de señal:

| Señal | Origen | Exporter/SDK | Transporte | Backend |
|-------|--------|-------------|------------|---------|
| Métricas | App Node.js | `@opentelemetry/exporter-metrics-otlp-http` | HTTP/OTLP → OTel Collector → PRW | Mimir |
| Métricas | PostgreSQL | postgres-exporter (9187) | scrape → OTel Collector → PRW | Mimir |
| Métricas | Contenedores | cadvisor (8080) | scrape → OTel Collector → PRW | Mimir |
| Métricas | Host | node-exporter (9100) | scrape → OTel Collector → PRW | Mimir |
| Logs | App Node.js | `pino-loki` | HTTP directo a Loki | Loki |
| Trazas | App Node.js | `@opentelemetry/exporter-trace-otlp-http` | HTTP/OTLP → OTel Collector → gRPC/OTLP | Tempo |

**Concepto clave**: El OTel Collector recibe métricas de 2 formas:
1. **Ingestadas vía OTLP** (SDK → HTTP/gRPC → Collector)
2. **Scrapeadas vía Prometheus receiver** (Collector → HTTP → exporters externos)

Ambos caminos terminan en el mismo pipeline: `prometheusremotewrite → Mimir`.

---

## Paso 2: Agregar el exporter al docker-compose

El exporter expone métricas en formato Prometheus en un endpoint HTTP. Se agrega como un servicio más en `docker/docker-compose.yml`.

**Ejemplo concreto — postgres-exporter:**

```yaml
postgres-exporter:
    image: quay.io/prometheuscommunity/postgres-exporter:latest
    container_name: docker-postgres-exporter-1
    environment:
      DATA_SOURCE_NAME: "postgresql://taller:taller@postgres:5432/taller?sslmode=disable"
    ports:
      - "9187:9187"
    depends_on:
      postgres:
        condition: service_healthy
```

**Las preguntas que tenés que responder:**

1. **¿Qué imagen usar?** Buscala en hub.docker.com o github del proyecto. NO inventes nombres.
2. **¿Qué necesita el exporter para funcionar?** PostgreSQL necesita `DATA_SOURCE_NAME` con la URL de conexión.
3. **¿Qué puerto expone?** Cada exporter tiene uno por defecto (postgres=9187, node=9100, cadvisor=8080, etc).
4. **¿De qué depende?** No arranques el exporter si el servicio que monitorea no está listo.

> **Error común**: poner `image: prometheus/node-exporter` cuando el nombre real es `prom/node-exporter`. Docker no te avisa hasta el pull.

---

## Paso 3: Configurar el OTel Collector para scrape

El OTel Collector necesita un receiver `prometheus` que sepa dónde están los exporters y qué métricas scrapear.

En `docker/otel-collector/config.yml`:

```yaml
receivers:
  prometheus:
    config:
      scrape_configs:
        - job_name: "postgres-exporter"
          scrape_interval: 15s
          static_configs:
            - targets: ["postgres-exporter:9187"]
```

**Concepto clave**: El receiver `prometheus` convierte métricas de formato Prometheus a OTel internamente, y el pipeline las envía a `prometheusremotewrite` que las vuelve a convertir a Prometheus para Mimir. Sí, hay una doble conversión. No, no afecta los nombres de métricas.

Después de agregar el receiver, actualizás el pipeline de metrics:

```yaml
service:
  pipelines:
    metrics:
      receivers: [otlp, prometheus]
      processors: [batch]
      exporters: [prometheusremotewrite]
```

**"Pero yo agregué el receiver al config ¿y no funciona?"** — Acordate de reiniciar el collector:

```bash
docker compose -f docker/docker-compose.yml up -d --force-recreate otel-collector
```

Si solo editás el archivo pero no recreás el container, el collector sigue con el config viejo.

---

## Paso 4: Verificar que las métricas llegan a Mimir

Antes de tocar Grafana, verifica que el dato existe en Mimir:

```bash
# Listar todas las métricas disponibles
curl -s -H "X-Scope-OrgID: anonymous" \
  "http://localhost:9009/prometheus/api/v1/label/__name__/values"

# Ver si hay métricas de postgres
curl -s -H "X-Scope-OrgID: anonymous" \
  "http://localhost:9009/prometheus/api/v1/label/__name__/values" | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print([m for m in d['data'] if 'pg_' in m])"
```

Si las métricas **no aparecen**:
1. Verifica que el exporter responde: `curl http://localhost:9187/metrics | head`
2. Verifica que el collector puede llegar al exporter: `docker exec docker-otel-collector-1 wget -qO- http://postgres-exporter:9187/metrics | head`
3. Revisa los logs del collector: `docker logs docker-otel-collector-1 | grep -i error`

---

## Paso 5: Conectar Grafana al backend

En `docker/grafana/datasources.yml` se definen los datasources de Grafana.

```yaml
apiVersion: 1
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

**Regla de oro**: TODOS los datasources DEBEN tener un `uid` explícito. Si no ponés `uid`, Grafana genera uno aleatorio y los dashboards provisionados se rompen.

**¿Por qué Mimir necesita X-Scope-OrgID?** — Mimir es multi-tenant. Sin ese header, rechaza la request. Es parte de su arquitectura desde Grafana Mimir 2.0.

---

## Paso 6: Crear el dashboard

En `docker/grafana/dashboards/` creás un JSON con la estructura de Grafana.

**Los campos OBLIGATORIOS que hacen que funcione:**

```json
{
  "title": "Base de Datos - PostgreSQL",
  "uid": "postgres-db",
  "version": 1,
  "schemaVersion": 40,
  "editable": true,
  "time": { "from": "now-15m", "to": "now" },
  "panels": [
    {
      "title": "Conexiones activas",
      "datasource": { "type": "prometheus", "uid": "mimir" },
      "type": "timeseries",
      "targets": [
        {
          "expr": "avg(pg_stat_activity_count) by (datname, state)",
          "legendFormat": "{{datname}} - {{state}}"
        }
      ]
    }
  ]
}
```

**Campos que SIEMPRE rompen si faltan:**
- `datasource.uid` en cada panel — sin esto, el panel no sabe de dónde sacar datos
- `uid` del dashboard — necesario para que Grafana no duplique el dashboard en cada restart

---

## Paso 7: Configurar cómo Grafana maneja los dashboards

En `docker/grafana/dashboards.yml`:

```yaml
apiVersion: 1
providers:
  - name: "default"
    folder: ""
    type: file
    options:
      path: /etc/grafana/provisioning/dashboards
    allowUiUpdates: true
```

**`allowUiUpdates: true`** permite editar el dashboard desde la UI de Grafana y guardar los cambios en la base de datos de Grafana. En cada restart, Grafana compara versión del JSON vs versión en DB y se queda con la más alta.

> **Antes de este cambio**, teníamos `disableDeletion: true` que impedía borrar dashboards accidentalmente, pero también impedía editarlos desde la UI. Datazo: en la vida real usamos `allowUiUpdates: true` en dev y los bloqueamos en prod.

---

## Checklist Final

Antes de decir "no funciona", repasá esta lista:

- [ ] **Paso 1**: Dibujé la cadena completa (App → Exporter → Collector → Backend → Grafana)
- [ ] **Paso 2**: El exporter está en docker-compose con la imagen correcta
- [ ] **Paso 3**: El OTel Collector tiene el receiver `prometheus` con el target correcto
- [ ] **Paso 3b**: Reinicié el collector después de cambiar el config
- [ ] **Paso 4**: Verifiqué que las métricas existen en Mimir/Loki/Tempo
- [ ] **Paso 5**: El datasource en Grafana tiene `uid` explícito
- [ ] **Paso 6**: El dashboard tiene `datasource.uid` en cada panel
- [ ] **Paso 7**: `allowUiUpdates: true` (al menos en dev)

Si todo esto está bien y aún no funciona → **el error está en la consulta (query)** y no en la cadena. Fijate los nombres de métricas y labels.

---

## Referencias

- [Mimir multi-tenancy](https://grafana.com/docs/mimir/latest/manage/multi-tenancy/)
- [OTel Collector Prometheus receiver](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/receiver/prometheusreceiver)
- [postgres-exporter](https://github.com/prometheus-community/postgres_exporter)
- [node-exporter](https://github.com/prometheus/node_exporter)
- [cadvisor](https://github.com/google/cadvisor)
