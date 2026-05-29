import { useState } from "react"
import {
  Button,
  Input,
  Textarea,
  FieldRoot,
  FieldLabel,
  FieldErrorText,
  Stack,
} from "@chakra-ui/react"
import { createPost } from "../api/posts"
import { toaster } from "../api/toaster"

interface PostFormProps {
  onSuccess: () => void
}

export function PostForm({ onSuccess }: PostFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [errors, setErrors] = useState<{ title?: string; content?: string; author?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  const validate = (): boolean => {
    const newErrors: typeof errors = {}
    if (!title.trim()) newErrors.title = "El t\u00edtulo es obligatorio"
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
      toaster.create({ title: "Post creado", type: "success" })
      onSuccess()
    } catch (err) {
      toaster.create({
        title: "Error",
        description: err instanceof Error ? err.message : "Error desconocido",
        type: "error",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Stack gap={4} maxW="600px">
      <FieldRoot invalid={!!errors.title}>
        <FieldLabel>T\u00edtulo</FieldLabel>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="T\u00edtulo del post" />
        <FieldErrorText>{errors.title}</FieldErrorText>
      </FieldRoot>

      <FieldRoot invalid={!!errors.content}>
        <FieldLabel>Contenido</FieldLabel>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Contenido del post"
          rows={4}
        />
        <FieldErrorText>{errors.content}</FieldErrorText>
      </FieldRoot>

      <FieldRoot invalid={!!errors.author}>
        <FieldLabel>Autor</FieldLabel>
        <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Tu nombre" />
        <FieldErrorText>{errors.author}</FieldErrorText>
      </FieldRoot>

      <Button colorScheme="blue" onClick={handleSubmit} loading={submitting} loadingText="Creando...">
        Crear Post
      </Button>
    </Stack>
  )
}
