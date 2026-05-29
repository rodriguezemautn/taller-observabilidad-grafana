# Diseño Técnico: setup-workshop-base

## Enfoque Técnico

Monorepo npm workspaces con 3 paquetes (core, infrastructure, web-app) + Docker Compose para el entorno completo. El backend se instrumenta con OpenTelemetry desde el inicio, exportando trazas, métricas y logs estructurados hacia el pipeline de OTel Collector, que los distribuye a Loki (logs), Tempo (trazas) y Mimir (métricas). Grafana consume estos datasources con dashboards pre-configurados via provisioning YAML.

## Decisiones de Arquitectura

### ADR-005: Monorepo npm workspaces

| Opción | Tradeoff | Decisión |
|--------|----------|----------|
| Monorepo (npm workspaces) | +tipos compartidos, +un solo npm install | ✅ Elegido |
| Multi-repo | -gestión más compleja, +independencia | ❌ Descartado |

### ADR-006: OTel Collector como pipeline central

| Opción | Tradeoff | Decisión |
|--------|----------|----------|
| OTel Collector | +desacopla emisores de destinos, +filtrado | ✅ Elegido |
| Export directo a Grafana | -acoplamiento, -sin buffering | ❌ Descartado |

### ADR-007: Provisioning de Grafana con YAML

| Opción | Tradeoff | Decisión |
|--------|----------|----------|
| Provisioning YAML | +reproducible, +versionable, +sin clicks | ✅ Elegido |
| Config manual desde UI | -no reproducible, -error-prone | ❌ Descartado |

## Flujo de Datos

```
                  ┌──────────────┐
                  │   Frontend    │
                  │  (React 19)   │
                  └──────┬───────┘
                         │ HTTP (traza propagada via headers)
                         ▼
┌─────────────────────────────────────────────┐
│             Backend (Fastify)                │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐ │
│  │  Routes  │→ │ Use Case │→ │ Repository │ │
│  │ (adapter)│  │  (core)  │  │  (adapter) │ │
│  └────┬─────┘  └──────────┘  └──────┬─────┘ │
│       │                             │       │
│       └──── OTel SDK ───────────────┘       │
│       (traces + metrics + logs)             │
└──────────────────────┬──────────────────────┘
                       │ OTLP (gRPC/HTTP)
                       ▼
                ┌──────────────┐
                │OTel Collector│
                └───┬───┬───┬──┘
                    │   │   │
              ┌─────┘   │   └──────┐
              ▼         ▼          ▼
          ┌──────┐ ┌───────┐ ┌────────┐
          │ Loki │ │ Tempo │ │ Mimir  │
          │(logs)│ │(traces)│ │(metrics)│
          └──┬───┘ └───┬───┘ └───┬────┘
             │         │         │
             └─────┬───┴─────────┘
                   ▼
            ┌──────────┐
            │  Grafana │
            │ (3000)   │
            └──────────┘
```

## Archivos a Crear

| Archivo | Descripción |
|---------|-------------|
| package.json | npm workspaces raíz |
| tsconfig.base.json | Config TypeScript base |
| packages/core/src/domain/post.entity.ts | Entidad Post |
| packages/core/src/domain/ports/post.repository.ts | Puerto de salida: interfaz PostRepository |
| packages/core/src/application/use-cases/create-post.use-case.ts | Caso de uso: CreatePost |
| packages/core/src/application/use-cases/list-posts.use-case.ts | Caso de uso: ListPosts |
| packages/core/src/application/use-cases/get-post.use-case.ts | Caso de uso: GetPost |
| packages/infrastructure/src/persistence/prisma/schema.prisma | Schema Prisma: Post model |
| packages/infrastructure/src/persistence/prisma/repository.ts | Adaptador PrismaPostRepository |
| packages/infrastructure/src/http/fastify/routes/posts.ts | Rutas Fastify: CRUD posts |
| packages/infrastructure/src/http/fastify/plugins/otel.ts | Plugin Fastify OTel |
| packages/infrastructure/src/observability/telemetry.ts | Configuración OTel SDK |
| packages/infrastructure/src/observability/logger.ts | Logger estructurado (Pino) |
| packages/web-app/src/App.tsx | Componente principal React |
| packages/web-app/src/components/PostList.tsx | Lista de posts |
| packages/web-app/src/components/PostForm.tsx | Formulario de creación |
| docker/docker-compose.yml | Stack completo (7 servicios) |
| docker/Dockerfile | Dockerfile multistage |
| docker/grafana/datasources.yml | Provisioning: datasources |
| docker/grafana/dashboards/red-dashboard.json | Dashboard RED |
| docker/grafana/dashboards/logs-dashboard.json | Dashboard logs |
| docker/grafana/dashboards/traces-dashboard.json | Dashboard trazas |
| docker/otel-collector/config.yml | Config OTel Collector |

## Contratos / Interfaces

```typescript
// Puerto de entrada (driving)
interface CreatePostUseCase {
  execute(input: { title: string; content: string; author: string }): Promise<Post>
}

// Puerto de salida (driven)
interface PostRepository {
  create(data: CreatePostDTO): Promise<Post>
  findAll(): Promise<Post[]>
  findById(id: string): Promise<Post | null>
}

// Entidad
interface Post {
  id: string
  title: string
  content: string
  author: string
  createdAt: Date
  updatedAt: Date
}
```

## Pipeline OTel

```yaml
receivers:
  otlp:
    protocols: { grpc, http }
processors:
  batch:
    timeout: 1s
  attributes:
    actions: [{ key: "service.name", value: "backend", action: upsert }]
exporters:
  loki: { endpoint: "http://loki:3100" }
  tempo: { endpoint: "http://tempo:4317" }
  prometheus: { endpoint: "http://mimir:9009/api/v1/push" }
service:
  pipelines:
    traces: [otlp → batch → tempo]
    metrics: [otlp → batch → prometheus]
    logs: [otlp → batch → loki]
```

## Migración

No se requiere migración. Prisma genera la BD al iniciar con `prisma db push`.

## Preguntas Abiertas

Ninguna — diseño resuelto en base a proposal + specs.
