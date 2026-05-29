# Taller de Observabilidad con Grafana

Taller teórico-práctico de **60 minutos** para la cátedra de **Ingeniería y Calidad de Software**.
El objetivo es introducir conceptos de observabilidad y aplicar una capa de telemetría sobre un stack moderno usando **Grafana** y su ecosistema **LGTM**.

## Stack Tecnológico 2026

| Capa | Tecnología |
|------|-----------|
| **Frontend** | TypeScript, React (Vite + Chakra UI) |
| **Backend** | Fastify + Prisma ORM |
| **Base de Datos** | PostgreSQL |
| **Infraestructura** | Docker + multistage + Docker Compose |
| **Arquitectura** | Hexagonal (Puertos y Adaptadores) |
| **Observabilidad** | Grafana LGTM (Loki, Grafana, Tempo, Mimir) + OpenTelemetry |

## Objetivo del Taller

- Introducir los conceptos fundamentales de observabilidad desde la ingeniería de software
- Brindar herramientas para que los alumnos apliquen observabilidad a sus trabajos integradores
- Construir un entorno "Hola Mundo" con el stack del trabajo integrador
- Integrar Grafana para la ingesta de **logs**, **métricas** y **trazas** del frontend, backend y base de datos
- Crear un dashboard funcional con datos concretos: requests, responses, recursos de contenedores y métricas de BBDD

## Estructura del Proyecto

```
taller-observabilidad-grafana/
├── README.md                    # Este archivo
├── docs/
│   ├── project.md               # Plan de clase y objetivos pedagógicos
│   └── architecture.md          # Decisiones y diseño arquitectónico
├── notas-academicas/            # Material de estudio y referencias
│   ├── 00-intro.md              # Estándares y conceptos de observabilidad
│   ├── 01-frameworks.md         # Marcos de trabajo y metodologías
│   ├── 02-opentelemetry.md      # OpenTelemetry en profundidad
│   ├── 03-swebok.md             # Observabilidad en el SWEBOK v4
│   └── 04-grafana.md            # Grafana y el ecosistema LGTM
└── .atl/
    └── skill-registry.md        # Registro de skills para asistentes IA
```

## Prerrequisitos

- Node.js 20+
- Docker y Docker Compose
- Git
- Conocimientos básicos de TypeScript, React y Node.js

## Cómo Empezar

> El proyecto se encuentra en etapa de diseño. Una vez definida la arquitectura, acá estarán las instrucciones para levantar el entorno.

<!-- TODO: Agregar pasos de instalación y ejecución -->

## Licencia

Este proyecto es material educativo de la cátedra de Ingeniería y Calidad de Software.
