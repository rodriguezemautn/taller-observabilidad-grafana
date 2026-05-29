import type { PostResponse } from "../../domain/types"
import type { PostRepository, GetPostUseCase } from "../../domain/ports/post.repository"
import { NotFoundError } from "../../domain/errors"

export class GetPostUseCaseImpl implements GetPostUseCase {
  constructor(private readonly repo: PostRepository) {}

  async execute(id: string): Promise<PostResponse> {
    const post = await this.repo.findById(id)
    if (!post) {
      throw new NotFoundError("Post", id)
    }
    return post
  }
}
