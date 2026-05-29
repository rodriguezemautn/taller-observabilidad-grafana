import { Post } from "../../domain/post.entity.js"
import type { PostResponse, CreatePostInput } from "../../domain/types.js"
import type { PostRepository, CreatePostUseCase } from "../../domain/ports/post.repository.js"
import { ulid } from "ulid"

export class CreatePostUseCaseImpl implements CreatePostUseCase {
  constructor(private readonly repo: PostRepository) {}

  async execute(input: CreatePostInput): Promise<PostResponse> {
    const id = ulid()
    const post = Post.create(input, id)
    return this.repo.create(post)
  }
}
