# Prisma ORM y PostgreSQL en el Taller

## PostgreSQL

### ¿Qué es PostgreSQL?

PostgreSQL es un **sistema de gestión de bases de datos relacional** (RDBMS) de código abierto, conocido por su robustez, extensibilidad y cumplimiento de estándares SQL.

### Características Clave

| Característica | Descripción |
|----------------|-------------|
| **SQL estándar** | Cumple con ANSI SQL:2011 |
| **Transacciones ACID** | Atomicidad, Consistencia, Aislamiento, Durabilidad |
| **Tipos avanzados** | JSON, arrays, intervalos, enumeraciones |
| **Extensiones** | PostGIS (geoespacial), pgvector (búsqueda semántica) |
| **Concurrencia** | MVCC (Multi-Version Concurrency Control) |

### Conectarse a PostgreSQL

```bash
# Con Docker
docker run -d \
  --name taller-pg \
  -e POSTGRES_DB=taller \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine

# URI de conexión
postgresql://postgres:postgres@localhost:5432/taller
```

### Comandos SQL Básicos

```sql
CREATE TABLE posts (
  id        TEXT PRIMARY KEY,
  title     TEXT NOT NULL,
  content   TEXT NOT NULL,
  author    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO posts (id, title, content, author)
VALUES ('001', 'Mi primer post', 'Contenido', 'Alumno');

SELECT * FROM posts ORDER BY created_at DESC;
```

---

## Prisma ORM

### ¿Qué es Prisma?

Prisma es un **ORM (Object-Relational Mapper)** para Node.js y TypeScript que simplifica el acceso a bases de datos. A diferencia de otros ORMs, Prisma genera un cliente tipado automáticamente a partir del schema.

### Componentes de Prisma

| Componente | Propósito |
|------------|-----------|
| **Prisma CLI** | Herramienta de línea de comandos (`prisma generate`, `prisma db push`) |
| **Prisma Schema** | Archivo declarativo que define modelos y relaciones |
| **Prisma Client** | Cliente tipado generado automáticamente |

### El Schema de Prisma

El archivo `schema.prisma` es la fuente de verdad de la base de datos:

```prisma
// 1. Generator: qué cliente generar
generator client {
  provider = "prisma-client-js"
}

// 2. Datasource: conexión a la base de datos
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 3. Modelos: definición de tablas
model Post {
  id        String   @id           // Clave primaria
  title     String
  content   String
  author    String
  createdAt DateTime @default(now())  // Valor por defecto
  updatedAt DateTime @updatedAt       // Auto-actualizado

  @@map("posts")  // Nombre de la tabla en PostgreSQL
}
```

### Tipos de Datos en Prisma

| Tipo Prisma | PostgreSQL | Uso |
|-------------|------------|-----|
| `String` | `TEXT` | Texto, IDs, UUIDs |
| `Int` | `INTEGER` | Números enteros |
| `Float` | `REAL` | Números decimales |
| `Boolean` | `BOOLEAN` | Verdadero/falso |
| `DateTime` | `TIMESTAMPTZ` | Fechas y horas |
| `Json` | `JSONB` | Datos JSON |

### Atributos Comunes

```prisma
model Ejemplo {
  id        String   @id @default(uuid())  // UUID automático
  unique    String   @unique               // Restricción única
  default   Int      @default(0)           // Valor por defecto
  updated   DateTime @updatedAt            // Auto-actualiza al modificar
  oculto    String   @map("campo_oculto")  // Mapeo a columna diferente
  @@map("ejemplos")                        // Nombre de tabla
  @@index([campo])                         // Índice
}
```

### Comandos Prisma

| Comando | Propósito |
|---------|-----------|
| `prisma generate` | Genera Prisma Client a partir del schema |
| `prisma db push` | Sincroniza schema con la base de datos |
| `prisma db pull` | Invierte: genera schema desde BD existente |
| `prisma migrate dev` | Crea migraciones (para producción) |
| `prisma studio` | UI web para explorar datos |

### Operaciones CRUD con Prisma Client

```typescript
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

// CREATE
const post = await prisma.post.create({
  data: { id: "001", title: "Mi post", content: "...", author: "Alumno" },
})

// READ ALL
const posts = await prisma.post.findMany({
  orderBy: { createdAt: "desc" },
})

// READ BY ID
const post = await prisma.post.findUnique({
  where: { id: "001" },
})

// UPDATE
const updated = await prisma.post.update({
  where: { id: "001" },
  data: { title: "Título actualizado" },
})

// DELETE
await prisma.post.delete({
  where: { id: "001" },
})
```

### Relaciones en Prisma

```prisma
model User {
  id    String @id
  name  String
  posts Post[]
}

model Post {
  id       String @id
  title    String
  userId   String
  user     User   @relation(fields: [userId], references: [id])
}
```

### Patrón Singleton del Cliente

En el taller usamos un singleton para PrismaClient porque la aplicación debe tener una sola instancia:

```typescript
import { PrismaClient } from "@prisma/client"

let client: PrismaClient | null = null

export function getPrismaClient(): PrismaClient {
  if (!client) {
    client = new PrismaClient({
      log: [
        { emit: "event", level: "query" },
        { emit: "stdout", level: "info" },
        { emit: "stdout", level: "warn" },
        { emit: "stdout", level: "error" },
      ],
    })
  }
  return client
}

export async function disconnectPrisma(): Promise<void> {
  if (client) {
    await client.$disconnect()
    client = null
  }
}
```

### Prisma + Arquitectura Hexagonal

En el taller, Prisma es un **driven adapter** que implementa el puerto `PostRepository`:

```typescript
// Puerto (core)
interface PostRepository {
  create(post: Post): Promise<PostResponse>
  findAll(): Promise<PostResponse[]>
  findById(id: string): Promise<PostResponse | null>
}

// Adaptador (infrastructure)
class PrismaPostRepository implements PostRepository {
  async create(post: Post): Promise<PostResponse> {
    return getPrismaClient().post.create({
      data: post.toResponse(),
    })
  }

  async findAll(): Promise<PostResponse[]> {
    return getPrismaClient().post.findMany({
      orderBy: { createdAt: "desc" },
    })
  }

  async findById(id: string): Promise<PostResponse | null> {
    return getPrismaClient().post.findUnique({ where: { id } })
  }
}
```

---

## Docker + PostgreSQL

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: taller
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

## Recursos

- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Prisma Docs**: https://www.prisma.io/docs
- **Prisma Schema Reference**: https://www.prisma.io/docs/orm/prisma-schema/overview
