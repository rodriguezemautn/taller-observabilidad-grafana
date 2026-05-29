# Demo en Clase: Conectar Datasource desde la UI de Grafana

## Objetivo

Mostrar el **flujo completo** de conectar un datasource desde la UI de Grafana, crear un dashboard desde cero, y usar el **query builder visual** para construir consultas.

A diferencia de los datasources provisionados (Mimir, Loki, Tempo), este se configura **manualmente desde la interfaz** — exactamente como se hace en la vida real cuando agregás una base de datos nueva.

---

## Requisitos

- Docker compose levantado (`docker compose up -d`)
- Grafana accesible en `http://localhost:3000`
- Usuario: `admin` / Contraseña: `admin`
- PostgreSQL funcionando (puerto 5432 interno, expuesto como 5432)

---

## Paso 1: Conectar el Datasource desde la UI

> **Duración**: 2-3 minutos. Ideal para que los alumnos sigan en sus propias máquinas.

### 1.1 Abrir Conexiones

En el menú lateral izquierdo → **Connections** → **Add new connection**

![Add connection](https://grafana.com/media/docs/grafana/add-connection.png)
*(mostrar la interfaz real proyectada)*

### 1.2 Buscar PostgreSQL

En la barra de búsqueda escribir: `postgres`

Seleccionar **PostgreSQL** (aparece con logo de elefante, es el built-in de Grafana).

### 1.3 Configurar la conexión

Click en **"Add new datasource"** y completar:

| Campo | Valor | Nota |
|-------|-------|------|
| **Name** | `Demo - PostgreSQL` | El nombre que aparecerá en los paneles |
| **Host URL** | `postgres:5432` | Así se llama el container Docker |
| **Database** | `taller` | La base de datos de la app |
| **Username** | `postgres` | Usuario de la DB |
| **Password** | `postgres` | Contraseña del usuario |
| **TLS/SSL** | `disable` | Es desarrollo local |

**Importante**: En una base de datos real NUNCA usarías disable SSL. Esto es solo para el taller.

### 1.4 Verificar

Click en **"Save & test"**. Debería aparecer un cartel verde:

```
✓ Database Connection OK
```

**Si no funciona**, los problemas más comunes son:
1. El hostname no es `postgres` sino `localhost` (si Grafana está fuera de Docker)
2. El puerto no es `5432` (si hay conflictos de puertos)
3. La contraseña no coincide con la del docker-compose

---

## Paso 2: Crear un Dashboard desde Cero

> **Duración**: 30 segundos. Rápido, pero importante mostrar que se puede empezar vacío.

### 2.1 Nuevo Dashboard

Menú → **Dashboards** → **+ Create dashboard** → **+ Add visualization**

Grafana abre un panel vacío. Lo primero que pide es **seleccionar un datasource**.

### 2.2 Seleccionar el Datasource

Elegir: **Demo - PostgreSQL** (el que creamos en el paso anterior).

---

## Paso 3: Construir Queries con el Query Builder

> **Duración**: 10-15 minutos. El corazón de la demo.

El query builder de PostgreSQL en Grafana tiene 2 modos:

| Modo | Cuándo usarlo |
|------|---------------|
| **Visual Builder** | Queries simples (SELECT, WHERE, GROUP BY, ORDER BY) |
| **SQL Raw** | Queries complejas (joins, subqueries, CTEs, funciones) |

Para la demo, vamos a construir **4 paneles** que muestren distintos aspectos:

---

### Panel 1: Total de Posts (Stat)

**Formato**: Stat (número grande)

**Query** (SQL Raw):
```sql
SELECT count(*) AS "total" FROM posts
```

**Configuración visual**:
- **Format as**: Table
- **Field > Unit**: `short`

**Qué muestra**: Un número grande con la cantidad total de posts (deberían ser ~260+).

> 💡 *Dato para la clase: Notar que el alias `total` necesita dobles comillas porque Grafana lo interpreta como nombre de columna.*

---

### Panel 2: Posts por Autor (Bar Chart)

**Formato**: Bar chart (de la nueva visualización, no legacy)

**Query**:
```sql
SELECT
  author,
  count(*) AS "total"
FROM posts
GROUP BY author
ORDER BY "total" DESC
LIMIT 15
```

**Configuración visual**:
- **Format as**: Table
- En **Transformations**: Add transformation → **Group by**
  - Group by: `author`
  - Calculate: `total` → Count

O directamente desde el **Visual Builder**:
1. Seleccionar tabla: `posts`
2. Columns: `author`, con función `count(*)`
3. Group by: `author`
4. Order by: `count(*)` DESC
5. Limit: `15`

**Qué muestra**: Barras horizontales con los autores que más posts tienen. Deberían aparecer Antonio Machado (13), Albert Einstein (12), Mahatma Gandhi (10), etc.

---

### Panel 3: Posts en el Tiempo (Time Series)

**Formato**: Time series (líneas)

**Query**:
```sql
SELECT
  "createdAt" AS "time",
  count(*) AS "value"
FROM posts
WHERE $__timeFilter("createdAt")
GROUP BY 1
ORDER BY 1
```

**Explicación de la query**:
- `$__timeFilter("createdAt")` — macro de Grafana que filtra por el rango de tiempo seleccionado
- `"createdAt"` necesita dobles comillas porque PostgreSQL ve camelCase como mayúsculas/minúsculas
- `AS "time"` — Grafana espera una columna llamada `time` para series temporales

**Configuración visual**:
- **Format as**: Time series
- **Field > Unit**: `short`

**Qué muestra**: Una línea que muestra cómo se crearon posts a lo largo del tiempo.

> 💡 *Este es el panel más importante pedagógicamente: muestra la macro `$__timeFilter`, el formato `time` para series temporales, y por qué necesitamos quote en camelCase.*

---

### Panel 4: Últimos Posts (Table)

**Formato**: Table

**Query**:
```sql
SELECT
  "createdAt" AS "Creado",
  LEFT(title, 50) AS "Título",
  author AS "Autor"
FROM posts
ORDER BY "createdAt" DESC
LIMIT 20
```

**Configuración visual**:
- **Format as**: Table
- **Field > Column width**: ajustar para que se vea bien

**Qué muestra**: Una tabla con los últimos 20 posts, ordenados por fecha descendente.

> 💡 *La tabla es el formato más natural para inspeccionar datos. Útil para mostrar que Grafana puede mostrar datos crudos además de visualizaciones.*

---

## Paso 4: Guardar el Dashboard

> **Duración**: 30 segundos.

Click en **"Save dashboard"** (ícono de diskette arriba a la derecha).

Nombre sugerido: `📊 Demo - PostgreSQL en Clase`

---

## Resumen para el Pizarrón

```
1. Connections → Add new → PostgreSQL
   Host: postgres:5432
   DB:   taller
   User: postgres / Pass: postgres
   SSL:  disable
   
2. Dashboard → + New → + Add visualization

3. Query Builder:
   ┌─────────────────────────────────────────────┐
   │  SQL Raw:  Escribís SQL directamente        │
   │  Builder:  Seleccionás tablas/columnas      │
   ├─────────────────────────────────────────────┤
   │  Format: Table | Time series | Logs         │
   │  Macros: $__timeFilter, $__timeGroup        │
   └─────────────────────────────────────────────┘

4. Tipos de panel: Stat | Bar chart | Time series | Table
```

---

## Posibles Problemas y Soluciones

| Problema | Causa | Solución |
|----------|-------|----------|
| "Missing URL" | No se completó el host | `postgres:5432` |
| "Connection refused" | Grafana no alcanza Postgres | Verificar que `postgres` es el service name de Docker |
| "SSL required" | El servidor exige TLS | Poner `sslmode: disable` en JSON data |
| "column ... does not exist" | `createdAt` en camelCase | Usar `"createdAt"` con dobles comillas |
| "No data" en time series | El rango de tiempo no tiene datos | Usar `$__timeFilter` macro |
| "Unknown" en el type | No se ve el plugin | Grafana 13+ lo tiene built-in como `grafana-postgresql-datasource` |

---

## Después de la Demo

Si querés dejar el entorno limpio para que los alumnos repitan:

```bash
# Borrar el datasource creado
curl -s -u admin:admin -X DELETE "http://localhost:3000/api/datasources/uid/$(curl -s -u admin:admin 'http://localhost:3000/api/datasources' | python3 -c \"import sys,json; d=json.load(sys.stdin); print([x['uid'] for x in d if 'Demo' in x['name']][0])\")"

# Borrar el dashboard creado
curl -s -u admin:admin -X DELETE "http://localhost:3000/api/dashboards/uid/$(curl -s -u admin:admin 'http://localhost:3000/api/search?type=dash-db' | python3 -c \"import sys,json; d=json.load(sys.stdin); print([x['uid'] for x in d if 'Demo' in x['title']][0])\")"
```

O simplemente reiniciar Grafana sin el volume de provisioning de dashboards:

```bash
docker compose -f docker/docker-compose.yml down grafana
docker volume rm docker_grafana-data  # si existe
docker compose up -d
```
