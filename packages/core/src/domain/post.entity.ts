import type { CreatePostInput, PostResponse } from "./types"
import { ValidationError } from "./errors"

export class Post {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly content: string,
    public readonly author: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(input: CreatePostInput, id: string): Post {
    Post.validate(input)

    const now = new Date()
    return new Post(id, input.title.trim(), input.content.trim(), input.author.trim(), now, now)
  }

  static fromPersistence(data: PostResponse): Post {
    return new Post(data.id, data.title, data.content, data.author, data.createdAt, data.updatedAt)
  }

  toResponse(): PostResponse {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      author: this.author,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  private static validate(input: CreatePostInput): void {
    if (!input.title?.trim()) {
      throw new ValidationError("El título es obligatorio")
    }
    if (input.title.trim().length > 200) {
      throw new ValidationError("El título no puede superar los 200 caracteres")
    }
    if (!input.content?.trim()) {
      throw new ValidationError("El contenido es obligatorio")
    }
    if (input.content.trim().length > 1000) {
      throw new ValidationError("El contenido no puede superar los 1000 caracteres")
    }
    if (!input.author?.trim()) {
      throw new ValidationError("El autor es obligatorio")
    }
    if (input.author.trim().length > 100) {
      throw new ValidationError("El autor no puede superar los 100 caracteres")
    }
  }
}
