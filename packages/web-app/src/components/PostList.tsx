import { useEffect, useState } from "react"
import { Card, Heading, Text, Spinner, Center, Stack, Badge } from "@chakra-ui/react"
import { fetchPosts } from "../api/posts"
import type { Post } from "../api/types"

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetchPosts()
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Center py={12}>
        <Spinner size="xl" />
      </Center>
    )
  }

  if (error) {
    return (
      <Center py={12}>
        <Text color="red.500">Error: {error}</Text>
      </Center>
    )
  }

  if (posts.length === 0) {
    return (
      <Center py={12}>
        <Text color="gray.500">No hay posts todavía. ¡Creá el primero!</Text>
      </Center>
    )
  }

  return (
    <Stack gap={4}>
      {posts.map((post) => (
        <Card.Root key={post.id} variant="outline">
          <Card.Body>
            <Stack gap={2}>
              <Heading as="h3" size="md">
                {post.title}
              </Heading>
              <Text>{post.content}</Text>
              <Stack direction="row" gap={2} align="center">
                <Badge colorScheme="blue">{post.author}</Badge>
                <Text textStyle="sm" color="gray.500">
                  {new Date(post.createdAt).toLocaleDateString("es-AR")}
                </Text>
              </Stack>
            </Stack>
          </Card.Body>
        </Card.Root>
      ))}
    </Stack>
  )
}
