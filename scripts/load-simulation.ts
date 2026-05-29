/**
 * Simulador de Carga — Taller de Observabilidad
 *
 * Genera tráfico realista contra la API de posts para poblar los dashboards
 * de Grafana con métricas, logs y trazas.
 *
 * Modo de uso:
 *   npx tsx scripts/load-simulation.ts
 *
 * Flags:
 *   --users <N>       Cantidad de usuarios virtuales (default: 3)
 *   --delay-min <ms>  Delay mínimo entre acciones (default: 200)
 *   --delay-max <ms>  Delay máximo entre acciones (default: 3000)
 *   --duration <s>    Duración total en segundos (default: 0 = infinito)
 *   --url <url>       URL base de la API (default: http://localhost:3001)
 *   --invalid-rate    Probabilidad de crear posts inválidos (default: 0.15)
 *
 * Ejemplos:
 *   npx tsx scripts/load-simulation.ts --users 5 --duration 120
 *   npx tsx scripts/load-simulation.ts --users 10 --delay-min 100 --delay-max 500
 *   npx tsx scripts/load-simulation.ts --invalid-rate 0.3
 */

// ---------------------------------------------------------------------------
// Frases célebres — autores clásicos y contemporáneos
// ---------------------------------------------------------------------------
const FRASES_CELEBRES: Array<{ frase: string; autor: string }> = [
  { frase: "La vida es lo que pasa mientras estás ocupado haciendo otros planes", autor: "John Lennon" },
  { frase: "El éxito es ir de fracaso en fracaso sin perder el entusiasmo", autor: "Winston Churchill" },
  { frase: "El único modo de hacer un gran trabajo es amar lo que haces", autor: "Steve Jobs" },
  { frase: "No cuentes los días, haz que los días cuenten", autor: "Muhammad Ali" },
  { frase: "La imaginación es más importante que el conocimiento", autor: "Albert Einstein" },
  { frase: "Sé el cambio que quieres ver en el mundo", autor: "Mahatma Gandhi" },
  { frase: "El propósito de nuestras vidas es ser felices", autor: "Dalai Lama" },
  { frase: "Vive como si fueras a morir mañana. Aprende como si fueras a vivir para siempre", autor: "Mahatma Gandhi" },
  { frase: "En medio de la dificultad reside la oportunidad", autor: "Albert Einstein" },
  { frase: "No todo lo que cuenta se puede contar, y no todo lo que se puede contar cuenta", autor: "Albert Einstein" },
  { frase: "El mayor riesgo es no tomar ningún riesgo", autor: "Mark Zuckerberg" },
  { frase: "La mejor manera de predecir el futuro es crearlo", autor: "Peter Drucker" },
  { frase: "El éxito no es la clave de la felicidad. La felicidad es la clave del éxito", autor: "Albert Schweitzer" },
  { frase: "Si puedes soñarlo, puedes hacerlo", autor: "Walt Disney" },
  { frase: "La única persona a la que debes superar es a ti mismo del día anterior", autor: "Anónimo" },
  { frase: "No hay que ir para atrás ni para darse impulso", autor: "Lao Tsé" },
  { frase: "El pesimista se queja del viento. El optimista espera que cambie. El realista ajusta las velas", autor: "William Arthur Ward" },
  { frase: "La pregunta no es quién me va a dejar, sino quién va a impedirme ser yo mismo", autor: "Ayn Rand" },
  { frase: "El hombre es dueño de su silencio y esclavo de sus palabras", autor: "Antonio Machado" },
  { frase: "Lo esencial es invisible a los ojos", autor: "Antoine de Saint-Exupéry" },
  { frase: "Caminante no hay camino, se hace camino al andar", autor: "Antonio Machado" },
  { frase: "El sabio no dice lo que sabe, y el necio no sabe lo que dice", autor: "Proverbio chino" },
  { frase: "La libertad no es hacer lo que uno quiere, sino querer lo que uno hace", autor: "Jean-Paul Sartre" },
  { frase: "La única lucha que se pierde es la que se abandona", autor: "Ernesto 'Che' Guevara" },
  { frase: "No se puede nadar hacia nuevos horizontes si no tienes el coraje de perder de vista la orilla", autor: "William Faulkner" },
  { frase: "El infierno está vacío y todos los demonios están aquí", autor: "William Shakespeare" },
  { frase: "Serás recordado por las preguntas que respondas, no por las que hagas", autor: "Berta Cáceres" },
  { frase: "La educación es el arma más poderosa que puedes usar para cambiar el mundo", autor: "Nelson Mandela" },
  { frase: "Nunca es demasiado tarde para ser lo que podrías haber sido", autor: "George Eliot" },
  { frase: "La simplicidad es la máxima sofisticación", autor: "Leonardo da Vinci" },
  { frase: "No hay nada permanente excepto el cambio", autor: "Heráclito" },
  { frase: "El arte de vencer se aprende en las derrotas", autor: "Simón Bolívar" },
  { frase: "El hábito no hace al monje", autor: "Refrán popular" },
  { frase: "El que sabe pensar, pero no sabe expresar lo que piensa, está al mismo nivel del que no sabe pensar", autor: "Periandro" },
  { frase: "Lo importante no es qué haces sino cómo lo haces", autor: "Mafalda (Quino)" },
  { frase: "Paren el mundo que me quiero bajar", autor: "Mafalda (Quino)" },
  { frase: "Las palabras son como las cerezas: aunque quieras, salen de a dos", autor: "Julio Cortázar" },
  { frase: "Andábamos sin buscarnos, pero sabiendo que andábamos para encontrarnos", autor: "Julio Cortázar" },
  { frase: "El sur también existe", autor: "Mario Benedetti" },
  { frase: "No te rindas, por favor no cedas, aunque el frío queme, aunque el miedo muerda", autor: "Mario Benedetti" },
  { frase: "El software es una gran máquina de estados", autor: "Fernando de Terán (traducción libre)" },
  { frase: "La paciencia es amarga, pero su fruto es dulce", autor: "Jean-Jacques Rousseau" },
  { frase: "El verdadero viaje de descubrimiento no consiste en buscar nuevos paisajes, sino en mirar con nuevos ojos", autor: "Marcel Proust" },
  { frase: "Sé tú mismo, todos los demás ya están ocupados", autor: "Oscar Wilde" },
  { frase: "No hay nada tan injusto como tratar por igual a los desiguales", autor: "Aristóteles" },
  { frase: "Programar es el arte de decirle a otro ser humano lo que quieres que la computadora haga", autor: "Donald Knuth" },
  { frase: "Cualquier tonto puede escribir código que una computadora entienda. Los buenos programadores escriben código que los humanos entienden", autor: "Martin Fowler" },
  { frase: "La primera regla de la optimización: no la hagas. La segunda regla (solo para expertos): no la hagas todavía", autor: "Michael A. Jackson" },
  { frase: "Debuggear es el doble de difícil que escribir el código. Por lo tanto, si escribes código lo más inteligentemente posible, no serás lo suficientemente inteligente para debuggearlo", autor: "Brian Kernighan" },
  { frase: "Siempre codea como si la persona que va a mantener tu código fuera un psicópata violento que sabe dónde vives", autor: "John Woods" },
  { frase: "La perfección se alcanza no cuando no hay nada más que añadir, sino cuando no hay nada más que quitar", autor: "Antoine de Saint-Exupéry" },
  { frase: "El software, al igual que la catedral, primero se debe construir y luego rezar", autor: "Anónimo" },
  { frase: "Si depurar es el proceso de eliminar errores, entonces programar debe ser el proceso de introducirlos", autor: "Edsger Dijkstra" },
  { frase: "La pregunta no es si podemos hacerlo, sino si podemos hacerlo bien", autor: "Edsger Dijkstra" },
  { frase: "La tecnología es solo una herramienta. En términos de motivación e impacto, lo más importante son las personas", autor: "Tim Berners-Lee" },
  { frase: "La medida de la inteligencia es la capacidad de cambiar", autor: "Albert Einstein" },
  { frase: "El conocimiento es poder", autor: "Francis Bacon" },
  { frase: "La duda es el principio de la sabiduría", autor: "Aristóteles" },
  { frase: "La ciencia es el alma de la prosperidad de las naciones y la fuente viva de todo progreso", autor: "Louis Pasteur" },
  { frase: "Aprender sin pensar es inútil. Pensar sin aprender es peligroso", autor: "Confucio" },
]

// ---------------------------------------------------------------------------
// Nombres de usuario para simular sesiones
// ---------------------------------------------------------------------------
const USUARIOS = [
  "emajp", "juanperez", "marialopez", "carlosgarcia", "analiafernandez",
  "pedrorodriguez", "luciagonzalez", "diegomartinez", "sofiadias", "facundoramirez",
  "lucasmolina", "florenciatorres", "nicolasacosta", "camilaolivera", "tomasruiz",
  "agostinacastro", "santiagovargas", "julietaherrera", "matiasmedina", "valentinarojas",
]

// ---------------------------------------------------------------------------
// Tipos y utils
// ---------------------------------------------------------------------------
interface Stats {
  created: number
  listed: number
  getById: number
  invalid: number
  notFound: number
  errors: number
  total: number
  startTime: number
}

type HttpMethod = "GET" | "POST"

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ---------------------------------------------------------------------------
// Parsing de argumentos
// ---------------------------------------------------------------------------
function parseArgs(): Record<string, string | number | boolean> {
  const args: Record<string, string | number | boolean> = {}
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i]
    if (arg.startsWith("--")) {
      const key = arg.slice(2)
      const val = process.argv[i + 1]
      if (val !== undefined && !val.startsWith("--")) {
        args[key] = isNaN(Number(val)) ? val : Number(val)
        i++
      } else {
        args[key] = true
      }
    }
  }
  return args
}

// ---------------------------------------------------------------------------
// Registro de eventos con timestamp
// ---------------------------------------------------------------------------
type LogLevel = "info" | "action" | "warn" | "stats"

function log(level: LogLevel, msg: string, data?: Record<string, unknown>): void {
  const ts = new Date().toISOString().slice(11, 19)
  const icon =
    level === "info" ? "ℹ️" :
    level === "action" ? "🔹" :
    level === "warn" ? "⚠️" :
    level === "stats" ? "📊" : "•"
  const prefix = data?.user ? `${data.user}`.padEnd(14) : "              "
  const extra = data ? " " + Object.entries(data)
    .filter(([k]) => k !== "user")
    .map(([k, v]) => `${k}=${v}`)
    .join(" ") : ""
  console.log(`${ts} ${icon} ${prefix} ${msg}${extra}`)
}

// ---------------------------------------------------------------------------
// Cliente HTTP
// ---------------------------------------------------------------------------
class ApiClient {
  private baseUrl: string
  private userAgent: string

  constructor(baseUrl: string, userName: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, "")
    this.userAgent = `LoadSimulator/1.0 (${userName}; taller-observabilidad)`
  }

  async request(method: HttpMethod, path: string, body?: unknown): Promise<{ status: number; body: unknown }> {
    const url = `${this.baseUrl}${path}`
    const headers: Record<string, string> = {
      "User-Agent": this.userAgent,
      "Accept": "application/json",
    }
    let fetchBody: string | undefined
    if (body !== undefined) {
      headers["Content-Type"] = "application/json"
      fetchBody = JSON.stringify(body)
    }

    const response = await fetch(url, {
      method,
      headers,
      body: fetchBody,
    })

    let responseBody: unknown
    try {
      responseBody = await response.json()
    } catch {
      responseBody = await response.text()
    }

    return { status: response.status, body: responseBody }
  }

  async createPost(title: string, content: string, author: string): Promise<{ status: number; body: unknown }> {
    return this.request("POST", "/api/posts", { title, content, author })
  }

  async listPosts(): Promise<{ status: number; body: unknown }> {
    return this.request("GET", "/api/posts")
  }

  async getPost(id: string): Promise<{ status: number; body: unknown }> {
    return this.request("GET", `/api/posts/${id}`)
  }
}

// ---------------------------------------------------------------------------
// Usuario virtual
// ---------------------------------------------------------------------------
class VirtualUser {
  name: string
  client: ApiClient
  knownPostIds: string[] = []
  config: { invalidRate: number; delayMin: number; delayMax: number }
  stats: Stats

  constructor(
    name: string,
    baseUrl: string,
    config: { invalidRate: number; delayMin: number; delayMax: number },
    stats: Stats,
  ) {
    this.name = name
    this.client = new ApiClient(baseUrl, name)
    this.config = config
    this.stats = stats
  }

  private async randomDelay(): Promise<void> {
    const ms = randInt(this.config.delayMin, this.config.delayMax)
    await sleep(ms)
  }

  private pickAction(): "create" | "create-invalid" | "list" | "get-by-id" {
    // Bias: mostly creates and lists, occasional get-by-id and invalid
    const r = Math.random()
    if (r < 0.35) return "create"
    if (r < 0.35 + this.config.invalidRate) return "create-invalid"
    if (r < 0.75) return "list"
    return "get-by-id"
  }

  async runOnce(): Promise<void> {
    const action = this.pickAction()

    switch (action) {
      case "create": {
        const { frase, autor } = pick(FRASES_CELEBRES)
        const title = `${autor}: ${frase.slice(0, 80)}${frase.length > 80 ? "…" : ""}`
        const content = frase
        const author = autor

        const { status, body } = await this.client.createPost(title, content, author)

        if (status === 201) {
          this.stats.created++
          const id = (body as Record<string, unknown>)?.id as string
          if (id) {
            this.knownPostIds.push(id)
            // Keep only the most recent 50 IDs to avoid unbounded memory
            if (this.knownPostIds.length > 50) this.knownPostIds.shift()
          }
          log("action", "📝 creó post", { user: this.name, status, autor: autor.slice(0, 20) })
        } else if (status === 400) {
          // Rare: a valid phrase might trigger validation (shouldn't, but track it)
          this.stats.errors++
          log("warn", "POST válido rechazado (error inesperado)", { user: this.name, status })
        } else {
          this.stats.errors++
          log("warn", "POST falló", { user: this.name, status })
        }
        break
      }

      case "create-invalid": {
        const scenario = randInt(0, 2)
        let title: string
        let content: string
        let author: string

        switch (scenario) {
          case 0:
            // Empty fields
            title = ""
            content = ""
            author = ""
            break
          case 1:
            // Missing content, oversize author
            title = pick(FRASES_CELEBRES).frase
            content = ""
            author = "A".repeat(150) // > 100 chars
            break
          case 2:
            // Oversize title
            title = "X".repeat(250) // > 200 chars
            content = pick(FRASES_CELEBRES).frase
            author = pick(USUARIOS)
            break
          default:
            title = ""
            content = ""
            author = ""
        }

        const { status, body } = await this.client.createPost(title, content, author)

        if (status === 400) {
          this.stats.invalid++
          const msg = (body as Record<string, unknown>)?.error ?? ""
          log("action", "❌ post inválido rechazado", { user: this.name, error: msg as string })
        } else if (status === 201) {
          // Shouldn't happen, but if validation passes, track it
          this.stats.created++
          log("warn", "⚠️ post inválido ACEPTADO (revisar validación)", { user: this.name })
        } else {
          this.stats.errors++
          log("warn", "POST inválido falló con código inesperado", { user: this.name, status })
        }
        break
      }

      case "list": {
        const { status, body } = await this.client.listPosts()

        if (status === 200) {
          this.stats.listed++
          const posts = body as Array<Record<string, unknown>>
          log("action", "📋 listó posts", { user: this.name, count: posts?.length ?? 0 })
        } else {
          this.stats.errors++
          log("warn", "GET /api/posts falló", { user: this.name, status })
        }
        break
      }

      case "get-by-id": {
        // 70% of the time try a known ID, 30% a random non-existent ID
        let id: string
        let expectNotFound = false

        if (this.knownPostIds.length > 0 && Math.random() < 0.7) {
          id = pick(this.knownPostIds)
        } else {
          // Use a random ULID-like string that won't exist
          id = `01ZZZZZZZZZZZZZZZZZZZZZZZZ` // definitely won't exist
          expectNotFound = true
        }

        const { status } = await this.client.getPost(id)

        if (status === 200) {
          this.stats.getById++
          log("action", "🔍 buscó post por ID", { user: this.name, id: id.slice(0, 8) + "…" })
        } else if (status === 404 && expectNotFound) {
          this.stats.notFound++
          log("action", "🔍 post no encontrado (404 esperado)", { user: this.name })
        } else if (status === 404) {
          this.stats.notFound++
          log("warn", "🔍 post conocido devolvió 404", { user: this.name, id: id.slice(0, 8) + "…" })
        } else {
          this.stats.errors++
          log("warn", "GET /api/posts/:id falló", { user: this.name, status })
        }
        break
      }
    }
  }

  async runLoop(durationMs: number): Promise<void> {
    const deadline = Date.now() + durationMs
    while (durationMs === 0 || Date.now() < deadline) {
      try {
        await this.runOnce()
      } catch (err) {
        this.stats.errors++
        log("warn", "❌ excepción en acción", { user: this.name, error: String(err).slice(0, 80) })
      }
      await this.randomDelay()
    }
  }
}

// ---------------------------------------------------------------------------
// Reporte de estadísticas
// ---------------------------------------------------------------------------
function printStats(stats: Stats, usersCount: number): void {
  const elapsed = (Date.now() - stats.startTime) / 1000
  const rate = elapsed > 0 ? (stats.total / elapsed).toFixed(1) : "0"
  const successRate = stats.total > 0
    ? (((stats.created + stats.listed + stats.getById) / stats.total) * 100).toFixed(1)
    : "0"

  console.log("")
  log("stats", "═══ ESTADÍSTICAS ═══", {})
  console.log(`   ⏱  Transcurrido: ${(elapsed / 60).toFixed(1)} minutos`)
  console.log(`   👥 Usuarios:     ${usersCount}`)
  console.log(`   📈 Total reqs:   ${stats.total} (${rate}/s)`)
  console.log(`   ✅ Éxito:        ${successRate}%`)
  console.log(``)
  console.log(`   📝 Posts creados:      ${stats.created}`)
  console.log(`   📋 Posts listados:     ${stats.listed}`)
  console.log(`   🔍 Posts por ID:       ${stats.getById}`)
  console.log(`   ❌ Inválidos (400):    ${stats.invalid}`)
  console.log(`   🔍 No encontrados:     ${stats.notFound}`)
  console.log(`   ❌ Errores:           ${stats.errors}`)
  console.log("")
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main(): Promise<void> {
  const args = parseArgs()
  const USERS_COUNT = (args["users"] as number) || 3
  const DELAY_MIN = (args["delay-min"] as number) || 200
  const DELAY_MAX = (args["delay-max"] as number) || 3000
  const DURATION_SEC = (args["duration"] as number) || 0
  const BASE_URL = (args["url"] as string) || "http://localhost:3001"
  const INVALID_RATE = (args["invalid-rate"] as number) || 0.15
  const STATS_INTERVAL_MS = 30_000

  const DURATION_MS = DURATION_SEC * 1000
  const startTime = Date.now()

  console.log(`
╔══════════════════════════════════════════════════╗
║   🚀 Simulador de Carga — Taller Observabilidad  ║
╠══════════════════════════════════════════════════╣
║  Usuarios:     ${String(USERS_COUNT).padStart(4)}                        ║
║  Delay:        ${String(DELAY_MIN).padStart(3)}-${String(DELAY_MAX).padStart(4)} ms                    ║
║  Duración:     ${DURATION_SEC === 0 ? "∞ (infinito)" : String(DURATION_SEC).padStart(4) + " s"}             ║
║  URL:          ${BASE_URL.padEnd(29)}║
║  Invalid rate: ${(INVALID_RATE * 100).toFixed(0).padStart(3)}%                          ║
╚══════════════════════════════════════════════════╝
  `)

  // Stats compartido entre todos los usuarios
  const stats: Stats = {
    created: 0,
    listed: 0,
    getById: 0,
    invalid: 0,
    notFound: 0,
    errors: 0,
    total: 0,
    startTime,
  }

  // Objeto proxy para trackear total
  const trackedStats = new Proxy(stats, {
    set(target, prop, value) {
      const result = Reflect.set(target, prop, value)
      // Recalcular total en cada modificación
      target.total = target.created + target.listed + target.getById + target.invalid + target.notFound + target.errors
      return result
    },
  })

  // Crear usuarios virtuales
  const users: VirtualUser[] = []
  for (let i = 0; i < USERS_COUNT; i++) {
    const name = USUARIOS[i % USUARIOS.length]
    const user = new VirtualUser(name, BASE_URL, {
      invalidRate: INVALID_RATE,
      delayMin: DELAY_MIN,
      delayMax: DELAY_MAX,
    }, trackedStats)
    users.push(user)
  }

  // Lanzar todos los usuarios en paralelo
  log("info", "Iniciando simulación...", {})
  const userPromises = users.map((u) => u.runLoop(DURATION_MS))

  // Reporte periódico de stats
  const statsInterval = setInterval(() => {
    printStats(trackedStats, USERS_COUNT)
  }, STATS_INTERVAL_MS)

  // Esperar a que terminen los usuarios
  await Promise.all(userPromises)

  // Limpiar
  clearInterval(statsInterval)
  printStats(trackedStats, USERS_COUNT)

  log("info", "Simulación finalizada", { totalRequests: trackedStats.total })
}

main().catch((err) => {
  console.error("Error fatal:", err)
  process.exit(1)
})
