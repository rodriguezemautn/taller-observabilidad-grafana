# TypeScript en el Taller de Observabilidad

## ¿Qué es TypeScript?

TypeScript es un **superconjunto de JavaScript** que agrega tipado estático opcional. Fue creado por Microsoft y se ha convertido en el estándar de facto para aplicaciones web modernas.

```typescript
// JavaScript (sin tipos)
function sumar(a, b) {
  return a + b
}

// TypeScript (con tipos)
function sumar(a: number, b: number): number {
  return a + b
}
```

## ¿Por qué TypeScript para el taller?

| Razón | Explicación |
|-------|-------------|
| **Seguridad en tiempo de desarrollo** | Los errores se detectan en compilación, no en runtime |
| **Autocompletado y documentación** | Las interfaces sirven como documentación viva |
| **Refactorización segura** | El compilador detecta usos incompatibles |
| **Estandar industrial** | React, Fastify, Prisma — todos tienen tipos first-class |

## Tipos Fundamentales

### Tipos primitivos

```typescript
const nombre: string = "Alumno"
const edad: number = 25
const activo: boolean = true
const id: symbol = Symbol("id")
```

### Tipos compuestos

```typescript
// Array
const posts: string[] = ["Post 1", "Post 2"]
const numeros: Array<number> = [1, 2, 3]

// Tupla
const par: [string, number] = ["edad", 25]

// Enum
enum Status {
  Activo = "activo",
  Inactivo = "inactivo",
}
```

## Interfaces y Types

La diferencia clave: `interface` se puede extender (declaration merging), `type` es una alias que no se puede re-abrir.

```typescript
// Interface — recomendada para objetos/contratos
interface Post {
  id: string
  title: string
  content: string
  author: string
  createdAt: Date
  updatedAt: Date
}

// Type — útil para uniones, tuplas, y composición
type CreatePostInput = {
  title: string
  content: string
  author: string
}

type ApiResponse<T> = {
  data: T
  error?: string
}
```

## Genéricos

Permiten crear componentes reutilizables que funcionan con múltiples tipos:

```typescript
// Sin genéricos — perdemos el tipo
function identity(arg: any): any {
  return arg
}

// Con genéricos — preservamos el tipo
function identity<T>(arg: T): T {
  return arg
}

const result = identity<string>("hola") // tipo: string
const num = identity(42) // tipo inferido: number
```

## Utility Types

TypeScript trae tipos utilitarios que simplifican transformaciones comunes:

```typescript
interface Post {
  id: string
  title: string
  content: string
  createdAt: Date
}

// Hace todo opcional
type PartialPost = Partial<Post>

// Hace todo obligatorio
type RequiredPost = Required<PartialPost>

// Omite propiedades
type PostWithoutDates = Omit<Post, "createdAt" | "updatedAt">

// Selecciona propiedades
type PostSummary = Pick<Post, "id" | "title">

// Hace todas las propiedades readonly
type ReadonlyPost = Readonly<Post>
```

## Configuración del Proyecto (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2022",        // Código JS moderno
    "module": "ESNext",         // Módulos ES nativos
    "moduleResolution": "bundler", // Resolución tipo bundler
    "strict": true,             // TODAS las verificaciones estrictas
    "esModuleInterop": true,    // Compatibilidad CommonJS/ESM
    "skipLibCheck": true,       // Saltea chequeo de librerías
    "declaration": true,        // Genera .d.ts
    "sourceMap": true           // Source maps para debugging
  }
}
```

## Project References (Monorepo)

TypeScript soporta **project references** para monorepos, permitiendo compilación incremental y dependencias entre paquetes:

```json
// packages/infrastructure/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "references": [
    { "path": "../core" }
  ]
}
```

Para compilar: `tsc -b tsconfig.json` que compila en orden: core → infrastructure.

## Strict Mode

Con `strict: true` se habilitan:

| Flag | Qué hace |
|------|----------|
| `noImplicitAny` | Error si TS no puede inferir un tipo |
| `strictNullChecks` | `null` y `undefined` son tipos distintos |
| `strictFunctionTypes` | Verifica contravarianza en funciones |
| `strictBindCallApply` | Tipado correcto de bind/call/apply |
| `strictPropertyInitialization` | Propiedades de clase deben inicializarse |

## Patrones Usados en el Taller

### Módulos con barrel export

```typescript
// src/index.ts (barrel export)
export { Post } from "./domain/post.entity"
export type { PostResponse } from "./domain/types"
export { CreatePostUseCaseImpl } from "./application/use-cases/create-post.use-case"
```

### Inversión de dependencias con interfaces

```typescript
// Puerto: define el contrato
interface PostRepository {
  save(post: Post): Promise<PostResponse>
}

// Implementación: cumple el contrato
class PrismaPostRepository implements PostRepository {
  async save(post: Post): Promise<PostResponse> {
    return getPrismaClient().post.create({ data: post.toResponse() })
  }
}
```

## Recursos

- **Documentación oficial**: https://www.typescriptlang.org/docs/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook/intro.html
- **TypeScript Playground**: https://www.typescriptlang.org/play/
