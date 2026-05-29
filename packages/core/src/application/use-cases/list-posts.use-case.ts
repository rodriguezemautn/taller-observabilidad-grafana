import type { PostResponse } from "../../domain/types"
import type { PostRepository, ListPostsUseCase } from "../../domain/ports/post.repository"

export class ListPostsUseCaseImpl implements ListPostsUseCase {
  constructor(private readonly repo: PostRepository) {}

  async execute(): Promise<PostResponse[]> {
    return this.repo.findAll()
  }
}
