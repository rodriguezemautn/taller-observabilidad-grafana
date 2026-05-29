import type { Post } from "../post.entity.js"
import type { PostResponse, CreatePostInput } from "../types.js"

export interface PostRepository {
  create(post: Post): Promise<PostResponse>
  findAll(): Promise<PostResponse[]>
  findById(id: string): Promise<PostResponse | null>
}

export interface CreatePostUseCase {
  execute(input: CreatePostInput): Promise<PostResponse>
}

export interface ListPostsUseCase {
  execute(): Promise<PostResponse[]>
}

export interface GetPostUseCase {
  execute(id: string): Promise<PostResponse>
}
