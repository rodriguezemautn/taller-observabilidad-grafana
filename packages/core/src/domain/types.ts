export interface CreatePostInput {
  title: string
  content: string
  author: string
}

export interface PostResponse {
  id: string
  title: string
  content: string
  author: string
  createdAt: Date
  updatedAt: Date
}
