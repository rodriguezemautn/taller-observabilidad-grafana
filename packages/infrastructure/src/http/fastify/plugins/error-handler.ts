import type { FastifyInstance } from "fastify"
import { ValidationError, NotFoundError } from "@taller/core"

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ValidationError) {
      return reply.status(400).send({ error: error.message })
    }

    if (error instanceof NotFoundError) {
      return reply.status(404).send({ error: error.message })
    }

    app.log.error(error, "Error interno del servidor")
    return reply.status(500).send({ error: "Error interno del servidor" })
  })
}
