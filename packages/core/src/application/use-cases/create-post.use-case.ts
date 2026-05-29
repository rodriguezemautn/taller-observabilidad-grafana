import { Post } from "../../domain/post.entity"
import type { PostResponse, CreatePostInput } from "../../domain/types"
import type { PostRepository, CreatePostUseCase } from "../../domain/ports/post.repository"
import { ulid } from "ulid"

export class CreatePostUseCaseImpl implements CreatePostUseCase {
  constructor(private readonly repo: PostRepository) {}

  async execute(input: CreatePostInput): Promise<PostResponse> {
    const id = ulid()
    const post = Post.create(input, id)
    return this.repo.create(post)
  }
}
