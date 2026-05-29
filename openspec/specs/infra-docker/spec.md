# Especificación: Infraestructura Docker

## Propósito

Desplegar toda la aplicación y el stack de observabilidad con Docker Compose.

## Requerimientos

### R8: Stack LGTM Completo

Docker Compose DEBE incluir los siguientes servicios: app, PostgreSQL, OTel Collector, Loki, Grafana, Tempo, Mimir.

#### Escenario: Todos los servicios inician

- DADO docker compose up
- CUANDO todos los contenedores inician
- ENTONCES los healthchecks pasan en menos de 60 segundos

#### Escenario: Red interna

- DADO servicios levantados
- CUANDO la app se conecta a PostgreSQL
- ENTONCES la conexión es exitosa sin exponer puerto de BD público

### R9: Build Multistage

El Dockerfile DEBE usar build multistage para la imagen de la app.

#### Escenario: Build exitoso

- DADO Dockerfile multistage (deps → build → run)
- CUANDO se ejecuta docker build
- ENTONCES la imagen final es menor a 500MB

#### Escenario: Hot reload en desarrollo

- DADO entorno de desarrollo
- CUANDO se ejecuta docker compose up
- ENTONCES la app hace hot reload con los cambios locales
