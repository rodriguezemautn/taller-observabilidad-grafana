# Tareas: setup-workshop-base

## Fase 1: Fundamentos (Monorepo + Config)

- [ ] 1.1 Crear `package.json` raíz con npm workspaces (core, infrastructure, web-app)
- [ ] 1.2 Crear `tsconfig.base.json` con configuración base TypeScript
- [ ] 1.3 Crear `packages/*/package.json` heredando tsconfig
- [ ] 1.4 Instalar dependencias base: TypeScript, types, ESLint

## Fase 2: Núcleo (Domain + Use Cases)

- [ ] 2.1 Crear `post.entity.ts` — entidad Post con id, title, content, author, timestamps
- [ ] 2.2 Crear `post.repository.ts` — interfaz PostRepository (create, findAll, findById)
- [ ] 2.3 Crear `create-post.use-case.ts` — CreatePostUseCase con validaciones
- [ ] 2.4 Crear `list-posts.use-case.ts` — ListPostsUseCase
- [ ] 2.5 Crear `get-post.use-case.ts` — GetPostUseCase con manejo de not found
- [ ] 2.6 Crear `packages/core/src/index.ts` — barrel export

## Fase 3: Infraestructura (Persistencia + HTTP + OTel)

- [ ] 3.1 Crear `schema.prisma` — modelo Post
- [ ] 3.2 Crear `prisma/client.ts` — inicialización PrismaClient
- [ ] 3.3 Crear `prisma/repository.ts` — PrismaPostRepository
- [ ] 3.4 Crear `observability/telemetry.ts` — OTel SDK con métricas RED
- [ ] 3.5 Crear `observability/logger.ts` — logger Pino con OTel
- [ ] 3.6 Crear `http/fastify/server.ts` — setup Fastify
- [ ] 3.7 Crear `http/fastify/plugins/otel.ts` — plugin OTel para Fastify
- [ ] 3.8 Crear `http/fastify/routes/posts.ts` — rutas CRUD
- [ ] 3.9 Crear `packages/infrastructure/src/index.ts` — bootstrap

## Fase 4: Frontend (React + Chakra UI)

- [ ] 4.1 Crear `vite.config.ts` — configuración Vite + proxy
- [ ] 4.2 Crear `src/main.tsx` — entry point con ChakraProvider
- [ ] 4.3 Crear `src/App.tsx` — layout principal
- [ ] 4.4 Crear `src/components/PostForm.tsx` — formulario de creación
- [ ] 4.5 Crear `src/components/PostList.tsx` — lista de posts
- [ ] 4.6 Crear `src/api/posts.ts` — cliente HTTP
- [ ] 4.7 Crear `index.html` — HTML base

## Fase 5: Docker + Grafana

- [ ] 5.1 Crear `Dockerfile` — build multistage
- [ ] 5.2 Crear `docker-compose.yml` — 7 servicios
- [ ] 5.3 Crear `otel-collector/config.yml` — pipeline OTel
- [ ] 5.4 Crear `grafana/datasources.yml` — provisioning datasources
- [ ] 5.5 Crear `grafana/dashboards.yml` — provisioning provider
- [ ] 5.6 Crear `grafana/dashboards/red-dashboard.json`
- [ ] 5.7 Crear `grafana/dashboards/logs-dashboard.json`
- [ ] 5.8 Crear `grafana/dashboards/traces-dashboard.json`
