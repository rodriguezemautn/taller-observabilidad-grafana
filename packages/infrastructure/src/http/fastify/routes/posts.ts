import type { FastifyInstance } from "fastify"
import { CreatePostUseCaseImpl, ListPostsUseCaseImpl, GetPostUseCaseImpl } from "@taller/core"
import type { AppDependencies } from "../server"

export async function registerPostRoutes(app: FastifyInstance, deps: AppDependencies): Promise<void> {
  const createPost = new CreatePostUseCaseImpl(deps.postRepository)
  const listPosts = new ListPostsUseCaseImpl(deps.postRepository)
  const getPost = new GetPostUseCaseImpl(deps.postRepository)

  app.post("/api/posts", async (request, reply) => {
    const input = request.body as { title: string; content: string; author: string }
    const post = await createPost.execute(input)
    return reply.status(201).send(post)
  })

  app.get("/api/posts", async (_request, reply) => {
    const posts = await listPosts.execute()
    return reply.send(posts)
  })

  app.get<{ Params: { id: string } }>("/api/posts/:id", async (request, reply) => {
    const post = await getPost.execute(request.params.id)
    return reply.send(post)
  })
}
