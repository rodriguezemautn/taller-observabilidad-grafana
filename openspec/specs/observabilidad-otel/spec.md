# Especificación: Observabilidad con OpenTelemetry

## Propósito

Instrumentar backend y frontend con OpenTelemetry para generar trazas, métricas y logs estructurados.

## Requerimientos

### R5: Trazas en Backend

El backend DEBE generar un span por cada request HTTP, con atributos del negocio.

#### Escenario: Traza completa

- DADO un POST /api/posts exitoso
- CUANDO se completa el request
- ENTONCES existe una traza con spans: {HTTP request, caso de uso, Prisma query}

#### Escenario: Error traceado

- DADO un POST /api/posts que falla
- CUANDO retorna error
- ENTONCES el span del caso de uso incluye atributo error=true

#### Escenario: Propagación de contexto

- DADO un request desde el frontend
- CUANDO llega al backend
- ENTONCES el traceparent se propaga correctamente via headers HTTP

### R6: Métricas RED

El backend DEBE exportar métricas RED (Rate, Errors, Duration) para cada endpoint.

#### Escenario: Rate de requests

- DADO 10 requests a GET /api/posts en 1 minuto
- CUANDO se consulta Mimir
- ENTONCES rate ≈ 0.166 requests por segundo

#### Escenario: Conteo de errores

- DADO requests con error 400
- CUANDO se consulta Mimir
- ENTONCES error count > 0

#### Escenario: Duración de requests

- DADO requests exitosos
- CUANDO se consulta Mimir
- ENTONCES p50 de duración < 500ms

### R7: Logs Estructurados

El backend DEBE emitir logs estructurados en formato JSON con contexto.

#### Escenario: Log de creación

- DADO un post creado exitosamente
- CUANDO la operación se completa
- ENTONCES el log contiene {event: "post.created", postId, title, duration}

#### Escenario: Log de error

- DADO una operación que falla
- CUANDO retorna error
- ENTONCES el log contiene {event: "post.error", error, stack}
