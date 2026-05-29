import { PrismaClient } from "@prisma/client"

let client: PrismaClient | null = null

export function getPrismaClient(): PrismaClient {
  if (!client) {
    client = new PrismaClient({
      log: [
        { emit: "event", level: "query" },
        { emit: "stdout", level: "info" },
        { emit: "stdout", level: "warn" },
        { emit: "stdout", level: "error" },
      ],
    })
  }
  return client
}

export async function disconnectPrisma(): Promise<void> {
  if (client) {
    await client.$disconnect()
    client = null
  }
}
