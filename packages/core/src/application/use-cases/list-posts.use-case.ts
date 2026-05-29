import type { PostResponse } from "../../domain/types.js"
import type { PostRepository, ListPostsUseCase } from "../../domain/ports/post.repository.js"

export class ListPostsUseCaseImpl implements ListPostsUseCase {
  constructor(private readonly repo: PostRepository) {}

  async execute(): Promise<PostResponse[]> {
    return this.repo.findAll()
  }
}
