import { useEffect, useState } from "react"
import { Card, Heading, Text, Spinner, Center, Stack, Badge, Box } from "@chakra-ui/react"
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
      .catch((err: Error) => setError(err.message))
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
        <Text color="gray.500">No hay posts todav\u00eda. \u00a1Cre\u00e1 el primero!</Text>
      </Center>
    )
  }

  return (
    <Stack gap={4}>
      {posts.map((post: Post) => (
        <Card.Root key={post.id} variant="outline">
          <Card.Body>
            <Stack gap={2}>
              <Heading as="h3" size="md">
                {post.title}
              </Heading>
              <Text>{post.content}</Text>
              <Box>
                <Badge colorPalette="blue">{post.author}</Badge>
                <Text textStyle="sm" color="gray.500" display="inline" ml={2}>
                  {new Date(post.createdAt).toLocaleDateString("es-AR")}
                </Text>
              </Box>
            </Stack>
          </Card.Body>
        </Card.Root>
      ))}
    </Stack>
  )
}
