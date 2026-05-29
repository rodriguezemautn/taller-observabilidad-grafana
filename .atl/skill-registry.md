# Registro de Skills

**Solo para uso del delegador.** Cualquier agente que lance sub-agentes lee este registro para resolver reglas compactas e inyectarlas directamente en los prompts de los sub-agentes. Los sub-agentes NO leen este registro ni los archivos SKILL.md individuales.

Ver `_shared/skill-resolver.md` para el protocolo completo de resolución.

## Skills de Usuario

| Trigger | Skill | Ruta |
|---------|-------|------|
| When creating a pull request, opening a PR, or preparing changes for review | branch-pr | /home/ema/.config/opencode/skills/branch-pr/SKILL.md |
| When editing or creating opencode's own configuration | customize-opencode | built-in |
| When writing Go tests, using teatest, or adding test coverage | go-testing | /home/ema/.config/opencode/skills/go-testing/SKILL.md |
| When creating a GitHub issue, reporting a bug, or requesting a feature | issue-creation | /home/ema/.config/opencode/skills/issue-creation/SKILL.md |
| When user says "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar", "que lo juzguen" | judgment-day | /home/ema/.config/opencode/skills/judgment-day/SKILL.md |
| When user asks to create a new skill, add agent instructions, or document patterns for AI | skill-creator | /home/ema/.config/opencode/skills/skill-creator/SKILL.md |

## Reglas Compactas

Reglas pre-digeridas por skill. Los delegadores copian los bloques que correspondan en los prompts de sub-agentes como `## Project Standards (auto-resolved)`.

### branch-pr
- Todo PR DEBE vincular un issue aprobado con label `status:approved` — sin excepción
- El cuerpo del PR DEBE incluir: `Closes #N`, exactamente un checkbox de tipo + label correspondiente, 1-3 bullets de resumen, tabla de cambios, plan de test y checklist de contribuidor
- Naming de ramas: `^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)\/[a-z0-9._-]+$`
- Ejecutar shellcheck en scripts modificados antes de abrir el PR
- Los checks automatizados DEBEN pasar antes del merge
- NO agregar "Co-Authored-By" ni atribución a IA en los commits

### go-testing
- Funciones puras → tests table-driven con `[]struct{name, input, expected, wantErr}`
- Bubbletea TUI: testear `Model.Update()` directamente con `tea.KeyMsg` para transiciones de estado
- Tests de integración: usar `teatest.NewTestModel(t, m)` de Charmbracelet para flujos completos
- Output visual: golden file testing con `testdata/*.golden` y flag `-update`
- System/exec: mockear `os/exec` vía interfaz; comandos reales usar `testing.Short()` para skip
- Operaciones de archivo: usar SIEMPRE `t.TempDir()` para archivos temporales

### issue-creation
- Issues en blanco deshabilitados — DEBE usarse template (bug_report.yml o feature_request.yml)
- Todo issue recibe `status:needs-review` automáticamente; un maintainer DEBE agregar `status:approved` antes del PR
- Buscar issues existentes para evitar duplicados antes de crear uno nuevo
- Bug report requiere: pre-flight checks, descripción, pasos para reproducir, comportamiento esperado vs real, SO
- Las preguntas van a Discussions, no a issues

### judgment-day
- Lanzar DOS jueces ciegos vía `delegate` en PARALELO — nunca secuencial, nunca auto-revisión
- Clasificar cada WARNING como REAL (causa bug en producción) o TEÓRICO (escenario rebuscado)
- WARNINGs teóricos → reportar como INFO, NO corregir, NO disparar re-evaluación
- Ronda 1: presentar veredicto, PREGUNTAR al usuario antes de corregir. Ronda 2+: corregir sin preguntar solo CRITICALs confirmados
- Convergencia: 0 CRITICALs confirmados + 0 WARNINGs reales = APROBADO después de Ronda 1
- Máximo 2 iteraciones de corrección antes de escalar al usuario
- Antes de lanzar jueces: resolver skill registry → matchear por contexto de código/tarea → inyectar Project Standards

### skill-creator
- Estructura: `skills/{nombre}/SKILL.md` con directorios opcionales `assets/` y `references/`
- Frontmatter OBLIGATORIO: name, description (con línea Trigger:), license (Apache-2.0), metadata.author (gentleman-programming), metadata.version
- HACER: arrancar con patrones críticos, usar tablas de decisión, mantener ejemplos de código mínimos
- NO HACER: agregar sección Keywords, duplicar documentación existente, incluir explicaciones extensas, usar URLs web en references
- Después de crear: registrar en la tabla de skills de AGENTS.md
- Crear solo para patrones reutilizables — saltear one-offs y casos triviales

## Convenciones del Proyecto

No se encontraron archivos de convenciones a nivel proyecto.

