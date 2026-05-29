# Docker: Mejores Prácticas para el Taller

## Índice

1. [Variables de Entorno y `.env`](#1-variables-de-entorno-y-env)
2. [Límites de Recursos](#2-límites-de-recursos)
3. [Healthchecks](#3-healthchecks)
4. [Logging y Rotación](#4-logging-y-rotación)
5. [Seguridad](#5-seguridad)
6. [Redes y Dependencias](#6-redes-y-dependencias)
7. [Volúmenes y Persistencia](#7-volúmenes-y-persistencia)
8. [Versiones Fijas](#8-versiones-fijas)
9. [Dockerfile Multistage](#9-dockerfile-multistage)
10. [Verificación de cambios](#10-verificación-de-cambios)

---

## 1. Variables de Entorno y `.env`

### El problema

El `docker-compose.yml` original tenía **valores hardcodeados**:
- Contraseña de PostgreSQL: `postgres`
- URLs de conexión: `http://mimir:9009/prometheus`
- Puertos: `5432`, `3000`, `3001`

Si querías cambiar la contraseña de la DB, tenías que editar el YAML. Si había un conflicto de puertos, tenías que buscar y reemplazar.

### La solución

Separar configuración de implementación usando variables de entorno:

```bash
# docker/.env.example → copiar como .env
POSTGRES_DB=taller
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
GF_SECURITY_ADMIN_USER=admin
GF_SECURITY_ADMIN_PASSWORD=admin
```

Docker Compose carga automáticamente el archivo `.env` del mismo directorio. Se referencian con `${VAR:-default}`:

```yaml
# docker-compose.yml
environment:
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
```

### Lo que NO va en `.env`

- **Rutas de volúmenes**: son parte de la infraestructura, no de la configuración
- **Nombres de servicio**: cambiarlos rompe la red interna
- **Nombres de container**: mismos motivos

> **Regla práctica**: si cambiarlo requiere modificar más de un archivo, va al `.env`. Si cambiarlo rompe la comunicación entre servicios, NO va al `.env`.

### Buenas prácticas con `.env`

1. **`.env.example` con defaults comentados** — para que cualquiera sepa qué configuración existe sin tener que leer todo el compose
2. **No comitear `.env`** — ya está en `.gitignore`
3. **Usar `${VAR:-default}`** — así el compose funciona incluso sin el `.env`
4. **Documentar cada variable** — qué hace, qué valores acepta

---

## 2. Límites de Recursos

### El problema

Sin límites, **un contenedor puede consumir toda la RAM del host**. En un taller con laptops de estudiantes que tienen 8-16 GB de RAM, Mimir solo puede comerse 4 GB sin control.

### La solución

Agregar límites de CPU y memoria a **cada servicio**:

```yaml
deploy:
  resources:
    limits:
      cpus: "0.5"          # máx 50% de un core
      memory: "256M"        # máx 256 MB de RAM
    reservations:
      cpus: "0.25"          # mínimo 25% de un core
      memory: "128M"        # mínimo 128 MB de RAM
```

### Tabla de límites usados en el taller

| Servicio | CPU máx | RAM máx | RAM min | ¿Por qué este valor? |
|----------|---------|---------|---------|---------------------|
| postgres | 0.5 | 256M | 128M | PostgreSQL en idle usa ~50M, con carga ~150M |
| mimir | 0.5 | 512M | 256M | Mimir es el que más RAM consume (series en memoria) |
| loki | 0.3 | 256M | 128M | Loki comprime logs, consume moderado |
| tempo | 0.3 | 256M | 128M | Trazas en memoria, depende del throughput |
| grafana | 0.3 | 256M | 128M | Carga dashboards y plugins al inicio |
| otel-collector | 0.3 | 256M | 128M | Pipeline de datos, consume según throughput |
| app | 0.5 | 256M | 128M | Node.js + React build |
| cadvisor | 0.2 | 128M | 64M | Scrapea cgroups cada 15s |
| node-exporter | 0.1 | 64M | 32M | Mínimo, solo expone métricas del host |
| postgres-exporter | 0.1 | 64M | 32M | Mínimo, consulta pg_stat cada 15s |

**Total estimado con límites**: ~2.5 GB de RAM máxima, ~1 GB en reposo.

### Cómo ajustar para laptops con poca RAM

```bash
# En .env, límites reducidos
LIMIT_CPU_MIMIR=0.25
LIMIT_MEM_MIMIR=256M
LIMIT_CPU_APP=0.25
LIMIT_MEM_APP=128M
```

O directamente comentar Mimir del compose (quedan Loki + Tempo que consumen menos).

---

## 3. Healthchecks

### El problema

Sin healthchecks, `depends_on` solo espera que el container **esté corriendo**, no que el servicio **esté listo**. El OTel Collector podía empezar a enviar datos antes de que Mimir estuviera escuchando.

Con `depends_on: condition: service_healthy`, Docker espera a que el healthcheck pase antes de arrancar los dependientes.

### El problema REAL: imágenes minimalistas

**Acá está el truco**: no todas las imágenes Docker tienen herramientas para hacer healthchecks.

| Imagen | Base | ¿Tiene shell? | ¿Tiene wget? | ¿Healthcheck? |
|--------|------|:---:|:---:|:---:|
| `postgres:16-alpine` | Alpine | ✅ | ❌ | ✅ `pg_isready` |
| `grafana/grafana:latest` | Alpine | ✅ | ✅ | ✅ |
| `prom/node-exporter` | Alpine | ✅ | ✅ | ✅ |
| `gcr.io/cadvisor/cadvisor` | Alpine | ✅ | ✅ | ✅ |
| `quay.io/prometheuscommunity/postgres-exporter` | Alpine | ✅ | ✅ | ✅ |
| `grafana/loki:latest` | **scratch** | ❌ | ❌ | ❌ |
| `grafana/tempo:latest` | **scratch** | ❌ | ❌ | ❌ |
| `grafana/mimir:latest` | **scratch** | ❌ | ❌ | ❌ |
| `otel/opentelemetry-collector-contrib` | **distroless** | ❌ | ❌ | ❌ |

> **scratch**: imagen vacía, solo el binario. **distroless**: solo runtime, sin shell ni package manager.

### Healthchecks implementados

```yaml
# PostgreSQL — usa pg_isready (nativo, no necesita wget)
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres}"]
  interval: 5s
  timeout: 5s
  retries: 5

# Grafana — usa wget (imagen Alpine, lo incluye)
healthcheck:
  test: ["CMD", "wget", "--spider", "http://localhost:3000/api/health"]
  interval: 15s
  timeout: 5s
  retries: 3
  start_period: 30s
```

### ¿Qué pasa con Loki, Tempo, Mimir y OTel Collector?

Son imágenes **scratch/distroless** — no tienen ni shell, ni wget, ni curl. No podemos ejecutar ningún healthcheck dentro de esos contenedores.

Solución: usamos `condition: service_started` en lugar de `service_healthy` para las dependencias. Esto hace que Grafana y la app esperen a que el contenedor **esté corriendo**, no a que el servicio **esté listo**.

```yaml
app:
  depends_on:
    postgres:
      condition: service_healthy  # ✅ Postgres SÍ tiene healthcheck
    otel-collector:
      condition: service_started  # ⚠️ OTel no tiene, esperamos que corra
```

**¿Es esto un problema?** Para un taller, no. Loki, Tempo, Mimir y OTel Collector son procesos Go estáticos que arrancan en ~1 segundo. Para producción, deberías:
- Usar imágenes custom con busybox agregado
- Usar un orquestador (K8s) con `startupProbe` / `livenessProbe`
- O implementar un healthcheck externo que verifique los endpoints HTTP de cada servicio

### Errores comunes

| Síntoma | Causa | Solución |
|---------|-------|----------|
| Container restart loop | Healthcheck falla siempre | Revisar que el endpoint exista |
| `start_period` muy corto | Mimir tarda 20-30s en arrancar | Usar `start_period: 30s` |
| `wget` no existe en la imagen | Imagen scratch/distroless | Cambiar a `service_started` o no usar healthcheck |
| `status: unhealthy` en Loki/Tempo/Mimir | No tienen wget ni shell | Remover el healthcheck — son imágenes scratch |
| OTel Collector unhealthy aunque funcione | Imagen distroless sin wget | Lo mismo — no usar healthcheck en estos servicios |

---

## 4. Logging y Rotación

### El problema

Por defecto, Docker guarda logs en archivos JSON **sin límite de tamaño**. En un taller de 2 horas, los logs de 10 servicios pueden crecer a varios GB y llenar el disco.

### La solución

Configurar logging con rotación usando un ancla YAML:

```yaml
x-logging: &default-logging
  driver: "json-file"
  options:
    max-size: "10m"    # máximo 10 MB por archivo
    max-file: "3"       # máximo 3 archivos rotados
```

Cada servicio referencia el ancla:

```yaml
services:
  app:
    logging: *default-logging
```

Con esta configuración, **cada servicio usa máximo 30 MB de logs** (3 archivos × 10 MB). Para 10 servicios, ~300 MB total como máximo.

### ¿Por qué no usar `local` driver?

El driver `local` no tiene opciones de rotación configurables. `json-file` es el default de Docker y funciona bien para este caso.

### Para entornos productivos

```yaml
# Opciones más restrictivas
x-logging:
  driver: "local"
  options:
    max-size: "5m"
    max-file: "2"
```

O usar un driver externo como Loki, GELF, o Fluentd para centralizar logs.

---

## 5. Seguridad

### Principios aplicados

1. **Read-only volumes** donde sea posible: `:ro` al final de los bind mounts
2. **No exponer puertos internos**: solo exponer los necesarios para el host
3. **Evitar `privileged: true`**: solo cadvisor lo necesita y está documentado por qué

### `privileged` en cadvisor

```yaml
cadvisor:
  # Privilegiado requerido por cAdvisor para acceder a cgroups del host
  # https://github.com/google/cadvisor/issues/3038
  privileged: true
  devices:
    - /dev/kmsg:/dev/kmsg
```

**¿Por qué lo necesita?** cAdvisor lee estadísticas de cgroups del kernel para reportar CPU/memoria de contenedores. Desde Linux 4.x, algunos paths de cgroups solo son accesibles con `--privileged`. Alternativas:
- Usar `--cap-add SYS_ADMIN` + montar cgroups (pero depende de la versión del kernel)
- Usar `docker stats` (menos granularidad)

### Volúmenes `ro`

```yaml
# Antes
- ./mimir.yml:/etc/mimir.yml

# Después
- ./mimir.yml:/etc/mimir.yml:ro
```

Marcar configuraciones como `:ro` previene que un proceso comprometido modifique archivos de configuración del host.

### Puertos expuestos

Solo se exponen los puertos necesarios:

| Servicio | Puerto expuesto | ¿Por qué? |
|----------|----------------|-----------|
| app | 3001 → 3001 | Los alumnos acceden al frontend |
| grafana | 3000 → 3000 | Los alumnos acceden a Grafana |
| postgres | 5432 → 5432 | Acceso directo a la DB para explorar |
| mimir | 9009 → 9009 | Consultas directas (debug) |
| loki | 3100 → 3100 | Consultas directas (debug) |
| tempo | 3200 → 3200 | UI de Tempo |
| cadvisor | 8080 → 8080 | Ver métricas raw |
| node-exporter | 9100 → 9100 | Ver métricas raw |
| postgres-exporter | 9187 → 9187 | Ver métricas raw |

Los puertos de OTel Collector (4317, 4318) que no están expuestos al host porque solo la app los necesita, que ya está en la red interna. En realidad sí los exponemos para debug.

### Lo que NO estamos haciendo (y está bien para un taller)

- **No usamos secrets de Docker**: para production usar `docker secret` o HashiCorp Vault. Para un taller local, `.env` es suficiente.
- **No limitamos capabilities**: en producción usar `--cap-drop ALL --cap-add CHOWN --cap-add SETUID --cap-add SETGID`
- **No usamos rootless**: Docker rootless tiene limitaciones con volúmenes bind y redes.

---

## 6. Redes y Dependencias

### Red interna

Todos los servicios se comunican por nombre a través de la red `taller-net`:

```yaml
networks:
  taller-net:
    driver: bridge
```

Esto permite que `app` se conecte a `postgres:5432` y el `otel-collector` a `mimir:9009/prometheus` sin configurar IPs.

### Dependencias correctas

```yaml
app:
  depends_on:
    postgres:
      condition: service_healthy     # espera a que Postgres esté listo
    otel-collector:
      condition: service_healthy     # espera al health check OTel
```

**No es un orquestador**: `depends_on` no maneja crashes ni restart. Para eso está `restart: unless-stopped`.

### Árbol de dependencias actual

```
app ──┬── postgres:healthy
      └── otel-collector:started ──┬── loki:started
                                   ├── tempo:started
                                   └── mimir:started

postgres-exporter ─── postgres:healthy
grafana ──┬── loki:started
          ├── tempo:started
          └── mimir:started
```

> **Nota**: `started` significa que el contenedor está corriendo pero no esperamos a que el servicio esté listo. Las imágenes scratch/distroless no permiten healthchecks, pero estos servicios arrancan en ~1 segundo por ser Go estáticos.

---

## 7. Volúmenes y Persistencia

### Volúmenes nombrados

```yaml
volumes:
  pgdata:        # datos de PostgreSQL
  mimir-data:    # datos de Mimir (series temporales)
```

Estos persisten entre reinicios de Docker. Para borrarlos:

```bash
docker compose down -v   # borra containers + volúmenes
docker compose down      # borra containers, conserva datos
```

### Bind mounts (configuraciones)

Todas las configuraciones se montan como bind mounts desde el repositorio:

```yaml
volumes:
  - ./otel-collector/config.yml:/etc/otel/config.yml:ro
```

Esto permite editar configs en caliente (algunos servicios recargan automáticamente, otros necesitan restart).

### Read-only mount

Siempre que sea posible, montar como `:ro`:

```
/etc/otel/config.yml:ro         ← config del OTel Collector
/etc/mimir.yml:ro               ← config de Mimir
/etc/grafana/provisioning/:ro   ← configs de Grafana
```

Los únicos volúmenes que necesitan escritura son los de datos (`pgdata`, `mimir-data`) y logs.

---

## 8. Versiones Fijas

### El problema

Usar `:latest` en imágenes Docker es una bomba de tiempo:

- **La próxima vez que levanten el taller**, puede bajar una versión incompatible
- **Los alumnos tienen cached versions distintas** → comportamientos distintos
- **Breaking changes upstream** — el OTel Collector v0.153+ eliminó el exporter Loki

### La solución

En el `.env.example` están las versiones verificadas como comentarios:

```bash
# Versiones recomendadas (verificadas con el taller):
# IMAGE_TAG_POSTGRES=16-alpine
# IMAGE_TAG_LOKI=3.4.2
# IMAGE_TAG_GRAFANA=11.6.0
```

Para fijarlas, descomentar en `.env`:

```bash
IMAGE_TAG_LOKI=3.4.2
IMAGE_TAG_GRAFANA=11.6.0
```

El compose usa el default `latest` si no se especifica:

```yaml
image: grafana/loki:${IMAGE_TAG_LOKI:-latest}
```

### ¿Por qué dejamos `latest` como default?

Para que el taller funcione **out of the box** sin tener que editar archivos. Si querés versiones fijas para producción del taller, copiás las versiones del `.env.example` a tu `.env`.

---

## 9. Dockerfile Multistage

```dockerfile
# Stage 1: Dependencias (node:20-alpine)
#   Instala dependencies npm (npm ci)
#   Solo copia package.json de cada workspace
#   → Cacheable: si no cambian deps, usa cache

# Stage 2: Build
#   Copia node_modules del Stage 1
#   Genera Prisma Client
#   Compila TypeScript
#   Build Frontend (React)
#   → El más pesado: archivos intermedios se descartan

# Stage 3: Run (node:20-alpine)
#   Copia solo dist/ + node_modules + schema.prisma
#   Imagen final: ~350 MB
#   → No incluye TypeScript, sources, ni devDependencies
```

### Tamaños de stage

| Stage | Tamaño | Contenido |
|-------|--------|-----------|
| deps | ~800 MB | node_modules |
| build | ~850 MB | node_modules + dist + tsbuildinfo |
| run | **~350 MB** | solo dist + production node_modules |

### Buenas prácticas aplicadas

1. **COPY solo package.json primero** — aprovecha cache de Docker si no cambiaron deps
2. **`npm ci` en vez de `npm install`** — respeta el lockfile exactamente, más rápido en CI
3. **`ENV NODE_ENV=production`** — Node.js no carga devDependencies
4. **`--enable-source-maps`** — stack traces con referencias al source `.ts`
5. **No dejar `tsbuildinfo`** — se borra explícitamente en el build

---

## 10. Verificación de Cambios

### Cómo probar que todo funciona después de cambios

```bash
# 1. Validar sintaxis del compose
docker compose config > /dev/null && echo "✅ YAML válido"

# 2. Recrear servicios (con los cambios)
docker compose up -d --force-recreate

# 3. Ver estado
docker compose ps

# 4. Ver logs de arranque (primeros 30s)
docker compose logs --tail=20 | grep -i error || echo "✅ Sin errores"

# 5. Ver healthchecks
docker compose ps --format "table {{.Names}}\t{{.Status}}"

# 6. Verificar pipelines
curl -s -H "X-Scope-OrgID: anonymous" \
  "http://localhost:9009/prometheus/api/v1/label/__name__/values" | \
  python3 -c "import sys,json; print(f'{len(json.load(sys.stdin)[\"data\"])} métricas en Mimir')"

# 7. Verificar UI
curl -s -o /dev/null -w "App: %{http_code}\n" http://localhost:3001
curl -s -o /dev/null -w "Grafana: %{http_code}\n" http://localhost:3000/api/health

# 8. Carga de prueba
npm run load -- --duration 30
```

### Script de smoke test

Crear un archivo `docker/smoke-test.sh` que ejecute todos estos checks de una:

```bash
#!/bin/bash
set -e

echo "=== Smoke Test: Taller Observabilidad ==="

echo "1. Validando compose..."
docker compose config > /dev/null && echo "   ✅ YAML válido"

echo "2. Servicios arriba..."
docker compose ps --format "table {{.Names}}\t{{.Status}}" | tail -n +2

# (continuar con los checks de arriba)
```
