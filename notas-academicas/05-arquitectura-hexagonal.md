# Arquitectura Hexagonal (Puertos y Adaptadores)

## ¿Qué es?

La **Arquitectura Hexagonal**, también conocida como **Puertos y Adaptadores** (Ports & Adapters), fue propuesta por **Alistair Cockburn** en 2005. Su objetivo principal es **aislar la lógica de negocio del mundo exterior** (frameworks, bases de datos, APIs, UI).

El nombre "hexagonal" es arbitrario — no significa que tenga que tener 6 lados. Cockburn usó un hexágono para tener suficientes "caras" donde conectar distintos adaptadores sin que el diagrama se vea abarrotado.

## Principio Fundamental

> **El dominio no debe depender de nada externo. Las dependencias apuntan hacia adentro.**

Esto se logra mediante **inversión de dependencias** (Dependency Inversion Principle — el "D" de SOLID):
- Las capas externas (infraestructura) **dependen de interfaces** definidas por el núcleo
- El núcleo **no sabe nada** de frameworks, bases de datos, HTTP, etc.

## Capas de la Arquitectura

```
┌──────────────────────────────────────┐
│          Adaptadores (Entrada)        │
│  ┌─────────┐ ┌────────┐ ┌────────┐  │
│  │  HTTP    │ │   CLI  │ │ GraphQL│  │  ← Driving adapters
│  │(Fastify) │ │        │ │        │  │
│  └────┬─────┘ └───┬────┘ └───┬────┘  │
└───────┼───────────┼──────────┼───────┘
        │           │          │
        ▼           ▼          ▼
┌──────────────────────────────────────┐
│           Puertos (Entrada)           │
│  ┌────────────────────────────────┐   │
│  │  Interfaces de casos de uso    │   │  ← Driving ports
│  │  CreatePostUseCase, etc.       │   │
│  └────────────┬───────────────────┘   │
└───────────────┼───────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│           Dominio / Núcleo            │
│  ┌────────────────────────────────┐   │
│  │  Entidades, Value Objects      │   │
│  │  Casos de Uso, Reglas de Neg.  │   │  ← Core (sin dependencias)
│  └────────────┬───────────────────┘   │
└───────────────┼───────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│           Puertos (Salida)            │
│  ┌────────────────────────────────┐   │
│  │  Interfaces para repositorios  │   │  ← Driven ports
│  │  PostRepository, etc.          │   │
│  └────────────┬───────────────────┘   │
└───────────────┼───────────────────────┘
                │
                ▼
┌──────────────────────────────────────┐
│          Adaptadores (Salida)         │
│  ┌─────────┐ ┌────────┐ ┌────────┐  │
│  │  Prisma  │ │  Send  │ │  File  │  │  ← Driven adapters
│  │   ORM    │ │  Email │ │ System │  │
│  └─────────┘ └────────┘ └────────┘  │
└──────────────────────────────────────┘
```

## Conceptos Clave

### Puertos (Ports)

Son **interfaces** que definen contratos. Hay dos tipos:

| Tipo | También llamado | Propósito | Ejemplo |
|------|----------------|-----------|---------|
| **Driving Port** | Puerto de entrada | Define cómo el exterior PUEDE usar el núcleo | `CreatePostUseCase` (interfaz con método `execute()`) |
| **Driven Port** | Puerto de salida | Define cómo el núcleo QUIERE comunicarse con el exterior | `PostRepository` (interfaz con `save()`, `findAll()`) |

### Adaptadores (Adapters)

Son **implementaciones concretas** de los puertos. También hay dos tipos:

| Tipo | También llamado | Propósito | Ejemplo |
|------|----------------|-----------|---------|
| **Driving Adapter** | Adaptador de entrada | Convierte requests externos en llamadas a puertos de entrada | Controlador Fastify que llama a `CreatePostUseCase.execute()` |
| **Driven Adapter** | Adaptador de salida | Implementa puertos de salida usando tecnología concreta | `PrismaPostRepository` que implementa `PostRepository` |

### Drivers vs Driven

| Concepto | Drivers (Entrada) | Driven (Salida) |
|----------|------------------|-----------------|
| **Quién inicia** | El exterior (HTTP, CLI) inicia la comunicación | El núcleo inicia la comunicación hacia afuera |
| **Dirección de llamada** | Exterior → Núcleo | Núcleo → Exterior |
| **Ejemplos** | Controladores REST, handlers GraphQL, comandos CLI | Repositorios, servicios de email, clientes HTTP |
| **Puerto** | Driving port (caso de uso) | Driven port (repositorio) |

## Estructura de Directorios (ejemplo del taller)

```
packages/
└── core/                          # Núcleo: CERO dependencias externas
    └── src/
        ├── domain/
        │   ├── entities/          # Entidades del negocio
        │   │   └── post.entity.ts
        │   ├── value-objects/     # Value Objects
        │   └── ports/             # PUERTOS (interfaces)
        │       ├── driving/       # Puertos de entrada
        │       │   └── create-post.use-case.ts
        │       └── driven/        # Puertos de salida
        │           └── post.repository.ts
        └── application/
            └── use-cases/         # Casos de uso (implementan driving ports)
                ├── create-post.use-case.ts
                └── list-posts.use-case.ts

packages/
└── infrastructure/                # Infraestructura: ADAPTADORES
    └── src/
        ├── http/
        │   └── fastify/
        │       ├── routes/        # Driving adapters
        │       └── plugins/
        └── persistence/
            └── prisma/
                ├── schema.prisma
                └── repository.ts  # Driven adapter

packages/
└── web-app/                       # Frontend (driving adapter)
    └── src/
        ├── components/
        └── pages/
```

## Beneficios

- **Testeabilidad**: El dominio se testea sin infraestructura (mockeando puertos)
- **Flexibilidad tecnológica**: Cambiar de Prisma a TypeORM no afecta el core
- **Mantenibilidad**: Las reglas de negocio están en un solo lugar
- **Independencia de frameworks**: El core no importa nada de Express, Fastify, React, etc.

## Ejemplo Concreto del Taller

```typescript
// === PUERTO DE SALIDA (Driven Port) — definido en core ===
// El core dice: "Necesito poder guardar posts, pero no me importa cómo"
interface PostRepository {
  save(post: Post): Promise<Post>
  findAll(): Promise<Post[]>
}

// === CASO DE USO (Core) — usa el puerto, no sabe de Prisma ===
class CreatePostUseCase {
  constructor(private repo: PostRepository) {}  // Inyección de dependencia

  async execute(input: { title: string; content: string; author: string }) {
    const post = new Post(input)
    return this.repo.save(post)  // No sabe si es Prisma, SQL, MongoDB...
  }
}

// === ADAPTADOR DE SALIDA (Driven Adapter) — en infraestructura ===
// Implementa el puerto usando Prisma
class PrismaPostRepository implements PostRepository {
  async save(post: Post) {
    return prisma.post.create({ data: post })
  }
}
```

## Referencias

- Alistair Cockburn, "Hexagonal Architecture" — https://alistair.cockburn.us/hexagonal-architecture/
- Robert C. Martin, "Clean Architecture" — Prentice Hall, 2017
- Bass, Clements, Kazman, "Software Architecture in Practice" (4th ed.) — Addison-Wesley, 2021
- SWEBOK Guide v4.0 — KA 02 (Software Design), KA 06 (Software Engineering Operations)
