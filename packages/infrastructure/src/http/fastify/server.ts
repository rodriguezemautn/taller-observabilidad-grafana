import Fastify from "fastify"
import fastifyStatic from "@fastify/static"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { registerCors } from "./plugins/cors.js"
import { registerErrorHandler } from "./plugins/error-handler.js"
import type { PostRepository } from "@taller/core"
import { registerPostRoutes } from "./routes/posts.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

export type AppDependencies = {
  postRepository: PostRepository
}

export async function buildServer(deps: AppDependencies) {
  const app = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
        options: { colorize: true },
      },
    },
  })

  await registerCors(app)
  registerErrorHandler(app)
  await registerPostRoutes(app, deps)

  // Servir frontend estático en producción
  const frontendDist = join(__dirname, "..", "..", "..", "..", "web-app", "dist")
  await app.register(fastifyStatic, {
    root: frontendDist,
    prefix: "/",
  })

  // SPA fallback: cualquier ruta no-API sirve index.html
  app.setNotFoundHandler((request, reply) => {
    if (request.url.startsWith("/api")) {
      return reply.status(404).send({ error: "Ruta no encontrada" })
    }
    return reply.sendFile("index.html")
  })

  return app
}
