import type { PostRepository, PostResponse } from "@taller/core"
import { Post } from "@taller/core"
import { getPrismaClient } from "./client"

export class PrismaPostRepository implements PostRepository {
  private get db() {
    return getPrismaClient()
  }

  async create(post: Post): Promise<PostResponse> {
    const data = post.toResponse()
    const saved = await this.db.post.create({ data })
    return saved
  }

  async findAll(): Promise<PostResponse[]> {
    return this.db.post.findMany({
      orderBy: { createdAt: "desc" },
    })
  }

  async findById(id: string): Promise<PostResponse | null> {
    return this.db.post.findUnique({ where: { id } })
  }
}
