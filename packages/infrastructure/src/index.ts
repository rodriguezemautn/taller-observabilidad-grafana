import { buildServer } from "./http/fastify/server"
import { PrismaPostRepository } from "./persistence/prisma/repository"
import { disconnectPrisma } from "./persistence/prisma/client"

const PORT = parseInt(process.env.PORT || "3001", 10)
const HOST = process.env.HOST || "0.0.0.0"

async function main() {
  const postRepository = new PrismaPostRepository()

  const app = await buildServer({ postRepository })

  await app.listen({ port: PORT, host: HOST })
  app.log.info(`Servidor iniciado en http://${HOST}:${PORT}`)
}

process.on("SIGINT", async () => {
  await disconnectPrisma()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  await disconnectPrisma()
  process.exit(0)
})

main().catch((err) => {
  console.error("Error al iniciar el servidor:", err)
  process.exit(1)
})
