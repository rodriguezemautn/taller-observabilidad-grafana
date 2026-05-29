# Especificación: Dashboards de Grafana

## Propósito

Dashboards pre-configurados en Grafana via provisioning.

## Requerimientos

### R10: Datasources Configurados

Grafana DEBE tener datasources Loki, Tempo y Mimir configurados por provisioning.

#### Escenario: Datasources disponibles

- DADO Grafana inicia
- CUANDO se carga la configuración de provisioning
- ENTONCES Loki, Tempo y Mimir aparecen como datasources configurados

### R11: Dashboard RED

Grafana DEBE tener un dashboard con métricas RED del backend.

#### Escenario: Panel de Rate

- DADO dashboard RED abierto
- CUANDO hay requests activos
- ENTONCES el panel muestra rate de requests por endpoint

#### Escenario: Panel de Errors

- DADO dashboard RED abierto
- CUANDO hay errores en los requests
- ENTONCES el panel muestra conteo de errores

#### Escenario: Panel de Duration

- DADO dashboard RED abierto
- CUANDO hay requests
- ENTONCES el panel muestra p50/p95/p99 de latencia

### R12: Dashboard de Logs

Grafana DEBE tener un panel que consulte logs desde Loki.

#### Escenario: Logs en vivo

- DADO dashboard de logs abierto
- CUANDO se crea un post
- ENTONCES el log aparece en menos de 5 segundos

#### Escenario: Filtro por evento

- DADO dashboard de logs
- CUANDO se filtra por event="post.created"
- ENTONCES solo se muestran logs de creación de posts

### R13: Dashboard de Trazas

Grafana DEBE tener un panel que consulte trazas desde Tempo.

#### Escenario: Búsqueda por servicio

- DADO dashboard de trazas
- CUANDO se busca por servicio "backend"
- ENTONCES muestra trazas del backend

#### Escenario: Detalle de span

- DADO una traza seleccionada
- CUANDO se abre el detalle
- ENTONCES muestra duración de cada span individual
