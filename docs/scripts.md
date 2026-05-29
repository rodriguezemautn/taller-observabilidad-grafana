🚀 Script de Simulación de Carga
scripts/load-simulation.ts — autónomo, corre con npx tsx sin necesidad de build.
Lo que hace
🔹 emajp          📝 creó post status=201 autor=Donald Knuth
🔹 juanperez      📋 listó posts count=80
🔹 marialopez     ❌ post inválido rechazado error=El contenido es obligatorio
🔹 emajp          🔍 post no encontrado (404 esperado)
- 
60 frases célebres de Einstein, Cortázar, Mafalda, Dijkstra, Shakespeare, etc.
- 
20 usuarios virtuales con User-Agent único cada uno
- 
4 acciones: crear post con frase célebre, listar, buscar por ID, crear inválido
- 
3 escenarios de error: campos vacíos, campos que exceden tamaño máximo, mixtos
- 
30% de probabilidad de buscar IDs inexistentes (para generar 404s)
- 
Reporte de estadísticas cada 30s
- 
0 errores de servidor en la prueba (73 requests, 3 usuarios, 30s)
Cómo usarlo
# Default: 3 usuarios, delays de 200ms-3s
npm run load
# Heavy: 8 usuarios, más rápido, más inválidos
npm run load:heavy
# Custom completo
npx tsx scripts/load-simulation.ts --users 5 --duration 120 --delay-min 100 --delay-max 1000
Flags
Flag	Default	Descripción
--users	3	Cantidad de usuarios concurrentes
--duration	0 (infinito)	Duración en segundos
--delay-min	200	Delay mínimo entre acciones (ms)
--delay-max	3000	Delay máximo entre acciones (ms)
--invalid-rate	0.15	Probabilidad de post inválido
--url	localhost:3001	URL base de la API
Dale npm run load y fijate cómo se llenan los dashboards en vivo.