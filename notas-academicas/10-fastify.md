# Fastify en el Taller de Observabilidad

## ¿Qué es Fastify?

**Fastify** es un framework web para Node.js inspirado en Hapi y Express, diseñado para ser **rápido**, **eficiente** y **extensible**. Se ha convertido en el framework backend principal para aplicaciones TypeScript modernas.

### ¿Por qué Fastify y no Express?

| Aspecto | Fastify | Express |
|---------|---------|---------|
| **Rendimiento** | ~2x más rápido (benchmarks) | Más lento |
| **Tipado** | Tipos nativos, schema validation | Sin tipos nativos |
| **Plugin system** | Encapsulado y modular | Middleware lineal |
| **JSON Schema** | Validación y serialización nativa | Sin validación nativa |
| **Logging** | Pino integrado | Morgan o similar externo |
| **Ecosistema** | Más pequeño pero enfocado | Maduro pero sobrecargado |

## Conceptos Fundamentales

### Plugins

Fastify usa un sistema de **plugins encapsulados**. Cada plugin crea un contexto aislado:

```typescript
import Fastify from "fastify"
import cors from "@fastify/cors"

const app = Fastify({ logger: true })

// Registrar un plugin
await app.register(cors, {
  origin: ["http://localhost:5173"],
})
```

Los plugins pueden ser:
- **De terceros**: `@fastify/cors`, `@fastify/swagger`
- **Propios**: funciones async que reciben la instancia

### Routes

```typescript
// Ruta simple
app.get("/api/posts", async (_request, reply) => {
  const posts = await listPosts.execute()
  return reply.send(posts)
})

// Ruta con params y tipado
app.get<{ Params: { id: string } }>("/api/posts/:id", async (request, reply) => {
  const post = await getPost.execute(request.params.id)
  return reply.send(post)
})

// Ruta POST con body
app.post("/api/posts", async (request, reply) => {
  const input = request.body as { title: string; content: string; author: string }
  const post = await createPost.execute(input)
  return reply.status(201).send(post)
})
```

### Schemas y Validación

Fastify puede validar requests automáticamente con JSON Schema:

```typescript
const createPostSchema = {
  body: {
    type: "object",
    required: ["title", "content", "author"],
    properties: {
      title: { type: "string", minLength: 1, maxLength: 200 },
      content: { type: "string", minLength: 1, maxLength: 1000 },
      author: { type: "string", minLength: 1, maxLength: 100 },
    },
  },
}

app.post("/api/posts", { schema: createPostSchema }, async (request, reply) => {
  const input = request.body
  // input ya está validado y tipado
})
```

### Error Handling

Fastify tiene un sistema de error handlers centralizados:

```typescript
import { ValidationError, NotFoundError } from "@taller/core"

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ValidationError) {
    return reply.status(400).send({ error: error.message })
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({ error: error.message })
  }

  // Error no manejado → log + 500
  app.log.error(error, "Error interno")
  return reply.status(500).send({ error: "Error interno del servidor" })
})
```

### Lifecycle de un Request

```
Incoming Request
      │
      ▼
[Plugins] → [PreHandler] → [Handler] → [Serializer] → [Reply]
                                      │
                                      ▼
                                  [Error Handler] (si hay error)
```

1. **Plugins**: CORS, auth, compresión, etc.
2. **PreHandler**: Validación de schema, hooks
3. **Handler**: Tu lógica de negocio
4. **Serializer**: Transforma la respuesta (optimizado con JSON Schema)
5. **Reply**: Envía la respuesta al cliente

## Logger (Pino)

Fastify usa **Pino** como logger por defecto, uno de los loggers más rápidos de Node.js:

```typescript
const app = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",   // Formato legible en desarrollo
      options: { colorize: true },
    },
    level: "info",              // Nivel mínimo de log
  },
})

// Loggeo automático por cada request
// [2024] INFO: GET /api/posts request completed

// Loggeo manual
app.log.info("Servidor iniciado")
app.log.error({ err }, "Error al procesar request")
app.log.warn({ slowRequest: true }, "Request lento detectado")
```

### Niveles de Log

| Nivel | Prioridad | Uso |
|-------|-----------|-----|
| `fatal` | 60 | Error irrecuperable |
| `error` | 50 | Error que afecta al usuario |
| `warn` | 40 | Algo inesperado pero no crítico |
| `info` | 30 | Información normal de operación |
| `debug` | 20 | Información detallada para debugging |
| `trace` | 10 | Tracing interno |

## Arquitectura en el Taller

En el taller, Fastify actúa como **driving adapter**:

```
Request HTTP
    │
    ▼
  Fastify Route (driving adapter)
    │
    ▼
  Use Case (core) — depende de PostRepository
    │
    ▼
  PrismaPostRepository (driven adapter)
    │
    ▼
  PostgreSQL
```

### buildServer Factory

Usamos una factory function que recibe las dependencias:

```typescript
export type AppDependencies = {
  postRepository: PostRepository
}

export async function buildServer(deps: AppDependencies) {
  const app = Fastify({ logger: { transport: { target: "pino-pretty" } } })

  await registerCors(app)
  registerErrorHandler(app)
  await registerPostRoutes(app, deps)

  return app
}
```

Esto permite:
- **Testeabilidad**: pasar dependencias mock en tests
- **Separación**: server.ts no sabe qué repositorio concreto se usa
- **Composición**: el bootstrap crea las dependencias y llama a buildServer

## Bootstrap

```typescript
async function main() {
  const postRepository = new PrismaPostRepository()
  const app = await buildServer({ postRepository })

  await app.listen({ port: 3001, host: "0.0.0.0" })
  app.log.info(`Servidor en http://0.0.0.0:3001`)
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  await disconnectPrisma()
  process.exit(0)
})
```

## Recursos

- **Fastify Documentation**: https://fastify.dev/docs/latest/
- **Fastify Plugins**: https://github.com/fastify
- **Pino Logger**: https://getpino.io/
