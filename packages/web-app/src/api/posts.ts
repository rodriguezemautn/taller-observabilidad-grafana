import type { Post, CreatePostInput } from "./types"

const BASE_URL = "/api"

export async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(`${BASE_URL}/posts`)
  if (!res.ok) {
    throw new Error(`Error al obtener posts: ${res.status}`)
  }
  return res.json()
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Error desconocido" }))
    throw new Error(error.error || `Error al crear post: ${res.status}`)
  }
  return res.json()
}
