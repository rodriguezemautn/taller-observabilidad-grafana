import { useState } from "react"
import {
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Stack,
  useToast,
} from "@chakra-ui/react"
import { createPost } from "../api/posts"

interface PostFormProps {
  onSuccess: () => void
}

export function PostForm({ onSuccess }: PostFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [errors, setErrors] = useState<{ title?: string; content?: string; author?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const toast = useToast()

  const validate = (): boolean => {
    const newErrors: typeof errors = {}
    if (!title.trim()) newErrors.title = "El título es obligatorio"
    if (!content.trim()) newErrors.content = "El contenido es obligatorio"
    if (!author.trim()) newErrors.author = "El autor es obligatorio"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setSubmitting(true)
    try {
      await createPost({ title: title.trim(), content: content.trim(), author: author.trim() })
      setTitle("")
      setContent("")
      setAuthor("")
      toast({ title: "Post creado", status: "success", duration: 3000 })
      onSuccess()
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Error desconocido",
        status: "error",
        duration: 5000,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Stack gap={4} maxW="600px">
      <FormControl isInvalid={!!errors.title}>
        <FormLabel>Título</FormLabel>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del post" />
        <FormErrorMessage>{errors.title}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.content}>
        <FormLabel>Contenido</FormLabel>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Contenido del post"
          rows={4}
        />
        <FormErrorMessage>{errors.content}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.author}>
        <FormLabel>Autor</FormLabel>
        <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Tu nombre" />
        <FormErrorMessage>{errors.author}</FormErrorMessage>
      </FormControl>

      <Button colorScheme="blue" onClick={handleSubmit} loading={submitting} loadingText="Creando...">
        Crear Post
      </Button>
    </Stack>
  )
}
