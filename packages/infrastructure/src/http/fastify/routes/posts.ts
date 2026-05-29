import type { FastifyInstance } from "fastify"
import { CreatePostUseCaseImpl, ListPostsUseCaseImpl, GetPostUseCaseImpl } from "@taller/core"
import { ValidationError, NotFoundError } from "@taller/core"
import type { AppDependencies } from "../server"
import { startSpan } from "../../observability/tracer"
import { logger } from "../../observability/logger"
import { SpanStatusCode } from "@opentelemetry/api"

export async function registerPostRoutes(app: FastifyInstance, deps: AppDependencies): Promise<void> {
  const createPost = new CreatePostUseCaseImpl(deps.postRepository)
  const listPosts = new ListPostsUseCaseImpl(deps.postRepository)
  const getPost = new GetPostUseCaseImpl(deps.postRepository)

  app.post("/api/posts", async (request, reply) => {
    const input = request.body as { title: string; content: string; author: string }

    return startSpan("crear-post", async (span) => {
      span.setAttribute("post.title", input.title)
      span.setAttribute("post.author", input.author)

      try {
        const post = await createPost.execute(input)

        span.setAttribute("post.id", post.id)
        logger.info({ event: "post.created", postId: post.id, title: input.title }, "Post creado exitosamente")

        return reply.status(201).send(post)
      } catch (error) {
        if (error instanceof ValidationError) {
          span.setAttribute("error.type", "validation")
          logger.warn({ event: "post.validation_error", error: error.message }, "Error de validación al crear post")
        } else {
          span.setStatus({ code: SpanStatusCode.ERROR })
          logger.error({ event: "post.error", error }, "Error al crear post")
        }
        throw error
      }
    })
  })

  app.get("/api/posts", async (_request, reply) => {
    return startSpan("listar-posts", async (span) => {
      const posts = await listPosts.execute()

      span.setAttribute("posts.count", posts.length)
      logger.info({ event: "post.listed", count: posts.length }, "Posts listados")

      return reply.send(posts)
    })
  })

  app.get<{ Params: { id: string } }>("/api/posts/:id", async (request, reply) => {
    return startSpan("obtener-post", async (span) => {
      span.setAttribute("post.id", request.params.id)

      try {
        const post = await getPost.execute(request.params.id)

        logger.info({ event: "post.found", postId: post.id }, "Post encontrado")
        return reply.send(post)
      } catch (error) {
        if (error instanceof NotFoundError) {
          span.setAttribute("error.type", "not_found")
          logger.warn({ event: "post.not_found", postId: request.params.id }, "Post no encontrado")
        } else {
          span.setStatus({ code: SpanStatusCode.ERROR })
          logger.error({ event: "post.error", error }, "Error al obtener post")
        }
        throw error
      }
    })
  })
}
