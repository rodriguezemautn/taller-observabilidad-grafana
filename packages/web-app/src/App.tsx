import { Container, Heading, Stack, Tabs } from "@chakra-ui/react"
import { PostList } from "./components/PostList"
import { PostForm } from "./components/PostForm"
import { useState, useCallback } from "react"
import type { Post } from "./api/types"

export function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  const onPostCreated = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  return (
    <Container maxW="container.lg" py={8}>
      <Stack gap={8}>
        <Heading as="h1" size="2xl" textAlign="center">
          Taller de Observabilidad
        </Heading>

        <Tabs.Root defaultValue="posts" variant="enclosed">
          <Tabs.List>
            <Tabs.Trigger value="posts">Posts</Tabs.Trigger>
            <Tabs.Trigger value="create">Crear Post</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="posts">
            <PostList key={refreshKey} />
          </Tabs.Content>

          <Tabs.Content value="create">
            <PostForm onSuccess={onPostCreated} />
          </Tabs.Content>
        </Tabs.Root>
      </Stack>
    </Container>
  )
}
