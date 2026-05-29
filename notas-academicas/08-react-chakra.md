# React y Chakra UI en el Taller de Observabilidad

## React 19

### ¿Qué es React?

React es una **biblioteca para construir interfaces de usuario** basada en componentes. Creada por Meta (Facebook), es la librería frontend más utilizada del mundo.

### Componentes en React 19

Los componentes son funciones que retornan JSX (HTML dentro de JavaScript):

```tsx
// Componente simple
function Saludo({ nombre }: { nombre: string }) {
  return <h1>Hola, {nombre}!</h1>
}
```

### Hooks Principales

| Hook | Propósito | Ejemplo |
|------|-----------|---------|
| `useState` | Estado local del componente | `const [count, setCount] = useState(0)` |
| `useEffect` | Efectos secundarios (API calls, etc.) | `useEffect(() => { fetchData() }, [])` |
| `useCallback` | Memoiza funciones | `const fn = useCallback(() => {}, [dep])` |
| `useMemo` | Memoiza valores computados | `const val = useMemo(() => compute(a), [a])` |

En React 19, los hooks funcionan igual pero hay mejoras en:
- **Server Components** (con framework)
- **Actions** para manejo de formularios
- **use()** para promises y context

### Manejo de Estado

#### Estado local (useState)

```tsx
function PostForm() {
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("El título es obligatorio")
      return
    }
    // ... enviar al backend
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  )
}
```

#### Efectos secundarios (useEffect)

```tsx
function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data)
        setLoading(false)
      })
  }, []) // Array vacío = solo al montar

  if (loading) return <p>Cargando...</p>
  return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
}
```

### JSX

JSX es una extensión de sintaxis que permite escribir HTML en JavaScript:

```tsx
// JSX
const element = <h1 className="title">Hola Mundo</h1>

// Compila a:
const element = React.createElement("h1", { className: "title" }, "Hola Mundo")
```

Reglas de JSX:
1. **Un solo elemento raíz** — usar `<></>` (Fragment) si es necesario
2. **Cerrar todas las etiquetas** — `<img />`, `<br />`
3. **Atributos en camelCase** — `className`, `onClick`, `htmlFor`
4. **Expresiones con `{}`** — `<p>{variable}</p>`, `<p>{condition ? "A" : "B"}</p>`

### Props y Tipado

```tsx
// Definir props con interface
interface PostCardProps {
  title: string
  author: string
  createdAt: Date
}

function PostCard({ title, author, createdAt }: PostCardProps) {
  return (
    <div>
      <h2>{title}</h2>
      <p>Por {author} — {createdAt.toLocaleDateString()}</p>
    </div>
  )
}
```

---

## Chakra UI v3

### ¿Qué es Chakra UI?

Chakra UI es una **biblioteca de componentes** para React que proporciona componentes accesibles, personalizables y listos para usar. Está construida sobre **Emotion** (CSS-in-JS) y **Framer Motion** (animaciones).

### Instalación

```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

### Configuración (ChakraProvider)

```tsx
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { createRoot } from "react-dom/client"

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
})

createRoot(document.getElementById("root")!).render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
)
```

### Componentes Principales

#### Layout

```tsx
import { Container, Stack, Flex, Grid, Box } from "@chakra-ui/react"

function Layout() {
  return (
    <Container maxW="container.lg" py={8}>
      <Stack gap={6}>
        <Header />
        <Flex gap={4}>
          <Box flex={1}>Contenido principal</Box>
          <Box w="300px">Sidebar</Box>
        </Flex>
      </Stack>
    </Container>
  )
}
```

| Componente | Propósito |
|------------|-----------|
| `<Container>` | Contenedor centrado con ancho máximo |
| `<Stack>` | Layout vertical con gap |
| `<Flex>` | Layout horizontal con flexbox |
| `<Grid>` | Layout en grilla |
| `<Box>` | Caja genérica (div con estilo) |

#### Formularios

```tsx
import { Input, Textarea, Button, FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react"

function PostForm() {
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>Título</FormLabel>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ingresá el título"
      />
      <FormErrorMessage>{error}</FormErrorMessage>
      <Button colorScheme="blue" mt={4} onClick={handleSubmit}>
        Crear Post
      </Button>
    </FormControl>
  )
}
```

| Componente | Propósito |
|------------|-----------|
| `<Input>` | Campo de texto |
| `<Textarea>` | Área de texto multilínea |
| `<Button>` | Botón con variantes (solid, outline, ghost) |
| `<FormControl>` | Wrapper que maneja estados (error, disabled) |
| `<FormLabel>` | Label del campo |
| `<FormErrorMessage>` | Mensaje de error |

#### Feedback

```tsx
import { Alert, Spinner, Toast, useToast } from "@chakra-ui/react"

function Feedback() {
  const toast = useToast()

  return (
    <>
      <Alert status="success">Post creado correctamente</Alert>
      <Spinner size="lg" />
      <Button onClick={() => toast({ title: "Éxito", status: "success" })}>
        Mostrar toast
      </Button>
    </>
  )
}
```

### Sistema de Diseño

Chakra UI usa un **sistema de diseño por defecto** basado en tokens:

```tsx
// Espaciado: 4, 8, 12, 16, 20, 24... (múltiplos de 4)
<Stack gap={4}>   // = 16px

// Tamaños: xs, sm, md, lg, xl, 2xl...
<Button size="md" />

// Variantes de color: blue, green, red, orange, teal...
<Button colorScheme="blue" variant="solid" />
```

### Responsive

```tsx
// Array: [base, md, lg]
<Stack direction={["column", "row"]} gap={4}>
  <Box w={["100%", "50%"]}>Columna 1</Box>
  <Box w={["100%", "50%"]}>Columna 2</Box>
</Stack>
```

### Dark Mode

```tsx
import { useColorMode, Switch } from "@chakra-ui/react"

function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  return <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode} />
}
```

### Animaciones con Framer Motion

Chakra UI integra Framer Motion para animaciones fluidas:

```tsx
import { motion } from "framer-motion"

< motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <PostCard post={post} />
</motion.div>
```

## Buenas Prácticas en el Taller

1. **Componentes atómicos**: cada componente hace una sola cosa
2. **Props tipadas**: siempre definir interfaz para las props
3. **Estado mínimo**: solo estado que realmente cambia
4. **Separación de concerns**: lógica de negocio en el backend, UI en el frontend
5. **Manejo de errores**: siempre mostrar feedback al usuario

## Recursos

- **React 19 Docs**: https://react.dev/
- **Chakra UI v3 Docs**: https://chakra-ui.com/
- **Framer Motion**: https://www.framer.com/motion/
