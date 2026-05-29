# Especificación: CRUD de Posts

## Propósito

API REST y UI para gestionar posts. Es la aplicación demo del taller de observabilidad.

## Requerimientos

### R1: Crear Post

El sistema DEBE permitir crear un post con title, content y author.

#### Escenario: Creación exitosa

- DADO datos válidos {title: "Mi post", content: "Contenido", author: "Alumno"}
- CUANDO se envía POST /api/posts
- ENTONCES respuesta 201 con el post creado
- Y el post persiste en base de datos

#### Escenario: Title vacío

- DADO title vacío
- CUANDO se envía POST /api/posts
- ENTONCES respuesta 400 con error de validación

#### Escenario: Content muy largo

- DADO content > 1000 caracteres
- CUANDO se envía POST /api/posts
- ENTONCES respuesta 400

### R2: Listar Posts

El sistema DEBE listar posts ordenados por createdAt descendente.

#### Escenario: Lista con datos

- DADO 3 posts en base de datos
- CUANDO se envía GET /api/posts
- ENTONCES respuesta 200 con array de 3 posts

#### Escenario: Lista vacía

- DADO 0 posts en base de datos
- CUANDO se envía GET /api/posts
- ENTONCES respuesta 200 con array vacío

### R3: Obtener Post por ID

El sistema DEBE retornar un post individual por su ID.

#### Escenario: Post encontrado

- DADO post existente con ID "abc-123"
- CUANDO se envía GET /api/posts/abc-123
- ENTONCES respuesta 200 con el post

#### Escenario: Post no encontrado

- DADO ID inexistente
- CUANDO se envía GET /api/posts/xyz-999
- ENTONCES respuesta 404

### R4: UI de Posts

El frontend DEBE mostrar lista de posts y formulario de creación.

#### Escenario: Carga inicial

- DADO frontend cargado en el navegador
- CUANDO se monta el componente
- ENTONCES muestra lista de posts desde GET /api/posts

#### Escenario: Crear desde UI

- DADO formulario completado con datos válidos
- CUANDO se hace submit
- ENTONCES se envía POST /api/posts
- Y la lista se actualiza con el nuevo post

#### Escenario: Error en creación

- DADO formulario con title vacío
- CUANDO se hace submit
- ENTONCES muestra mensaje de error sin enviar request
