# Propuesta: setup-workshop-base

## Intención

Establecer la base del taller de observabilidad: un monorepo TypeScript con un CRUD de Posts (backend + frontend), instrumentado con OpenTelemetry, y el stack LGTM de Grafana funcionando en Docker Compose. El alumno debe poder ejecutar `docker compose up` y tener todo funcionando.

## Alcance

### Incluye
- Monorepo TypeScript con estructura hexagonal (core + infra + web-app)
- Backend Fastify + Prisma + PostgreSQL con CRUD de Posts
- Frontend React + Vite + Chakra UI (lista de posts + formulario)
- Instrumentación con OpenTelemetry (manual en casos de uso, auto en HTTP/DB)
- Docker Compose con: app (backend+frontend), PostgreSQL, OTel Collector, Loki, Grafana, Tempo, Mimir
- Dashboards de Grafana pre-configurados por provisioning
- Logs estructurados visibles en Loki
- Trazas distribuidas visibles en Tempo
- Métricas RED visibles en Mimir/Grafana

### Excluye
- Tests automatizados (el taller es de observabilidad, no de testing)
- CI/CD pipeline
- Autenticación de usuarios
- Despliegue a cloud
- Perfilado continuo con Pyroscope

## Capacidades

### Nuevas Capacidades
- `crud-posts`: API REST + UI para crear, listar, obtener y eliminar posts
- `observabilidad-otel`: Instrumentación con OpenTelemetry (traces, metrics, logs estructurados)
- `infra-docker`: Docker Compose con el stack LGTM completo
- `dashboards-grafana`: Dashboards pre-configurados con métricas RED, logs y trazas

### Capacidades Modificadas
Ninguna (proyecto greenfield).

## Enfoque

1. Monorepo con npm workspaces (packages/core, packages/infrastructure, packages/web-app)
2. Core: entidad Post + puertos (CreatePost, ListPosts, etc.)
3. Infra: Fastify adapters + Prisma repository + OTel instrumentación
4. Web: React simple con Chakra UI
5. Docker: Dockerfile multistage para la app + docker-compose.yml con todos los servicios
6. Grafana: provisioning YAML para datasources (Loki, Tempo, Mimir) y dashboards JSON

## Áreas Afectadas

| Área | Impacto | Descripción |
|------|---------|-------------|
| packages/core/ | Nuevo | Entidades, puertos y casos de uso |
| packages/infrastructure/ | Nuevo | Adaptadores HTTP, persistencia, OTel |
| packages/web-app/ | Nuevo | Frontend React |
| docker/ | Nuevo | Dockerfiles, compose, provisioning |
| Raíz | Nuevo | package.json, tsconfig, etc. |

## Riesgos

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| Stack LGTM requiere mucha RAM (~4-6GB) | Alta | Documentar requisitos mínimos; ofrecer variante slim sin Mimir |
| 60 minutos es muy poco tiempo | Alta | Todo debe funcionar con 1 comando; dashboards pre-configurados |
| Compatibilidad de versiones OTel | Media | Pin versions específicas en package.json y Dockerfile |

## Plan de Rollback

Eliminar la rama del cambio. No hay migraciones de BD destructivas (Prisma puede resetear). No hay datos en producción.

## Dependencias

- Node.js 20+
- Docker 24+ con Docker Compose v2
- Puertos: 3000 (Grafana), 3001 (app), 5432 (PostgreSQL), 4318 (OTel)

## Criterios de Éxito

- [ ] `docker compose up` completa sin errores
- [ ] Backend responde en `localhost:3001/api/posts`
- [ ] Frontend muestra lista de posts y permite crear uno nuevo
- [ ] Grafana accesible en `localhost:3000` con datasources configurados
- [ ] Al crear un post, se genera una traza visible en Tempo
- [ ] Al crear un post, se genera un log visible en Loki
- [ ] Dashboard muestra métricas RED del backend
