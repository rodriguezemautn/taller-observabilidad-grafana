import Fastify from "fastify"
import { registerCors } from "./plugins/cors"
import { registerErrorHandler } from "./plugins/error-handler"
import type { PostRepository } from "@taller/core"
import { registerPostRoutes } from "./routes/posts"

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

  return app
}
