import { initTelemetry, shutdownTelemetry } from "./observability/telemetry.js"
import { buildServer } from "./http/fastify/server.js"
import { PrismaPostRepository } from "./persistence/prisma/repository.js"
import { disconnectPrisma } from "./persistence/prisma/client.js"
import { logger } from "./observability/logger.js"

const PORT = parseInt(process.env.PORT || "3001", 10)
const HOST = process.env.HOST || "0.0.0.0"

async function main() {
  // 1. Inicializar OTel (trazas, métricas y logs)
  initTelemetry()

  // 2. Dependencias
  const postRepository = new PrismaPostRepository()

  // 3. Servidor
  const app = await buildServer({ postRepository })
  await app.listen({ port: PORT, host: HOST })
  logger.info(`Servidor iniciado en http://${HOST}:${PORT}`)
}

// Graceful shutdown
async function shutdown() {
  logger.info("Deteniendo servidor...")
  await disconnectPrisma()
  await shutdownTelemetry()
  process.exit(0)
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)

main().catch((err) => {
  console.error("Error al iniciar el servidor:", err)
  process.exit(1)
})
