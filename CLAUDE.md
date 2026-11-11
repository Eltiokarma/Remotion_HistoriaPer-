# Este repositorio

Dos proyectos independientes:

- **`historia/`** — videos animados del canal de historia del altiplano (Remotion). Antes de tocar
  algo ahí, leer **`historia/CLAUDE.md`**: son las reglas del canal (rigor, dirección, sonido, cómo
  enseñar) y cómo está ordenado el código.
- **`karaoke-fansub/`** — editor local de karaoke (ver su README).

**Roadmap (requisito de todos los proyectos).** El estado del trabajo vive en
`roadmap/roadmap.json` (fuente única) y se publica en `ROADMAP.md` con `node roadmap/generar.mjs`;
nunca se edita `ROADMAP.md` a mano. Al terminar o bloquear una tarea, se actualiza el JSON: estado,
fecha real, evidencia y tiempo medido (humano, agente, render). Lo que no se midió queda en `null`:
no se inventan tiempos, porcentajes ni tokens.
Si una fusión choca en `ROADMAP.md`, no se resuelve a mano: se resuelve `roadmap.json` (conservando
las tareas de las dos ramas), se corre `node roadmap/generar.mjs` y se comprueba con `--comprobar`.

**Herramientas y laboratorio.** `docs/HERRAMIENTAS.md` dice qué herramienta está verificada,
propuesta o pendiente. Las pruebas de herramientas nuevas van en `historia/laboratorio/` (ver su
README), nunca dentro de un episodio.
Los prompts de Suno siguen `docs/REGLAS_SUNO.md`; ElevenLabs, `docs/RUTINA_ELEVENLABS.md`.

Se trabaja sobre `main`. Mensajes de commit en español.
