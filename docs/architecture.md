# Arquitectura del Taller de Observabilidad

## Stack Tecnológico

- **Frontend**: TypeScript, React 19 + Vite + Chakra UI
- **Backend**: Fastify + Prisma ORM + PostgreSQL
- **Infraestructura**: Docker + Docker Compose (multistage)
- **Patrón**: Arquitectura Hexagonal (Puertos y Adaptadores)
- **Observabilidad**: Grafana LGTM (Loki, Grafana, Tempo, Mimir) + OpenTelemetry

## Principios de Diseño

### Arquitectura Hexagonal

Se adopta **Arquitectura Hexagonal** (también conocida como Puertos y Adaptadores) por las siguientes razones:

- **Separación de concerns**: La lógica de negocio está completamente aislada de los detalles de infraestructura (BBDD, frameworks web, sistemas de logging)
- **Testeabilidad**: Al depender de interfaces (puertos), se pueden intercambiar implementaciones concretas (adaptadores) sin modificar la lógica de negocio
- **Mantenibilidad**: Los cambios en la infraestructura (ej. cambiar Prisma por otro ORM) no afectan el dominio
- **Alineación pedagógica**: Refuerza los conceptos de Ingeniería de Software que los alumnos ven en la materia

### Estructura de Capas

```
┌─────────────────────────────────────┐
│           Adaptadores (Entrada)      │
│  HTTP (Fastify) / CLI / WebSocket    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│           Puertos (Entrada)          │
│  Interfaces que definen casos de uso │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│           Dominio / Núcleo           │
│  Entidades, Value Objects,          │
│  Casos de Uso, Reglas de Negocio    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│           Puertos (Salida)           │
│  Interfaces para repositorios,      │
│  servicios externos, etc.           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│          Adaptadores (Salida)        │
│  Prisma, PostgreSQL, Logging, etc.   │
└─────────────────────────────────────┘
```

### Estructura de Directorios Propuesta

```
packages/
├── core/                  # Lógica de dominio pura
│   ├── domain/
│   │   ├── entities/       # Entidades del negocio
│   │   ├── value-objects/  # Value Objects
│   │   └── ports/          # Interfaces (entrada y salida)
│   └── application/
│       └── use-cases/      # Casos de uso
│
├── infrastructure/        # Adaptadores de infraestructura
│   ├── persistence/        # Prisma, repositorios concretos
│   ├── http/              # Fastify, rutas, middlewares
│   └── observability/     # OpenTelemetry, logging
│
├── web-app/               # Aplicación React (frontend)
│   ├── components/         # Componentes atómicos
│   └── pages/             # Páginas
│
└── docker/                # Configuración Docker
    ├── Dockerfile
    └── docker-compose.yml
```

## Lineamientos de Observabilidad

### Stack LGTM

El taller utiliza el stack **LGTM** de Grafana Labs:

| Componente | Señal | Función |
|-----------|-------|---------|
| **Loki** | Logs | Agregación de logs con etiquetas (no indexa contenido completo) |
| **Grafana** | Visualización | Dashboards unificados para todas las señales |
| **Tempo** | Trazas | Rastreo distribuido de peticiones entre frontend y backend |
| **Mimir** | Métricas | Almacenamiento de series temporales a largo plazo |

### OpenTelemetry

- **Instrumentación basada en código** para la lógica de negocio (spans personalizados, atributos)
- **Instrumentación Zero-code** para librerías estándar (HTTP, gRPC, DB drivers)
- **Propagación de contexto** para seguimiento de peticiones entre frontend y backend
- **Collector** de OTel como pipeline de datos hacia Grafana

### Métricas Estratégicas

Siguiendo el framework **RED** (Rate, Errors, Duration) para servicios:

| Métrica | Descripción |
|---------|-------------|
| Tasa de requests | Cantidad de peticiones por segundo |
| Tasa de errores | Proporción de respuestas con error |
| Duración | Latencia de las peticiones (percentiles p50, p95, p99) |

Y el framework **USE** (Utilization, Saturation, Errors) para infraestructura:

| Métrica | Descripción |
|---------|-------------|
| Utilización de CPU/RAM | Porcentaje de uso de recursos del contenedor |
| Saturación | Longitud de colas, conexiones activas |
| Errores | Fallos en el sistema operativo o runtime |

## Decisiones Arquitectónicas (ADR)

### ADR-001: Monorepo con TypeScript

**Contexto**: El taller necesita ser simple y rápido de configurar (60 minutos).
**Decisión**: Usar un monorepo con TypeScript para compartir tipos entre frontend y backend.
**Consecuencias**: Simplifica la gestión de dependencias y la configuración del entorno de desarrollo.

### ADR-002: Arquitectura Hexagonal

**Contexto**: Los alumnos necesitan entender cómo separar la lógica de negocio de la infraestructura.
**Decisión**: Implementar Puertos y Adaptadores para que la lógica de dominio sea independiente de frameworks y BBDD.
**Consecuencias**: Mayor cantidad de archivos e interfaces, pero mejor separación de concerns y testeabilidad.

### ADR-003: Docker Compose para el entorno completo

**Contexto**: El taller se ejecuta en un aula con 60 minutos de duración.
**Decisión**: Todo el stack (frontend, backend, BBDD, Grafana, OTel Collector) se despliega con Docker Compose.
**Consecuencias**: Tiempo de setup mínimo, pero consumo de recursos en las máquinas de los alumnos.

### ADR-004: Observabilidad desde el inicio

**Contexto**: La observabilidad no es un agregado, sino el tema central del taller.
**Decisión**: La instrumentación con OpenTelemetry se integra desde la primera línea de código del backend.
**Consecuencias**: Los alumnos ven la telemetría generarse en tiempo real mientras interactúan con la aplicación.
