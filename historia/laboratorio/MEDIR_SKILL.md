# Protocolo: ¿el skill reemplaza esfuerzo?

Tarea `f0-skill-medir` del roadmap. Preparado el 2026-11-04; **no se ha ejecutado**.

## La pregunta

¿Una sesión en esfuerzo **medio con los skills** del canal llega al mismo resultado que una en
esfuerzo **alto sin skills**, con menos tokens?

Si se compara solo eso (A contra B), cambian dos cosas a la vez y no se sabe cuál pesó. Por eso hay
un tercer brazo opcional (C) que separa el efecto del skill.

| Brazo | Esfuerzo | Skills | Para qué |
|---|---|---|---|
| **A** | medio | sí: `canal-historia`, `direccion-historia` y los oficiales de Remotion | La propuesta |
| **B** | alto | no | Lo que se quiere igualar |
| C (opcional) | medio | no | Separa el efecto del skill del efecto del esfuerzo (A contra C) |

## La muestra

La primera muestra nueva que Gerson apruebe hacer después de revisar la tanda 1
(`t1-revision`). Se sugiere **`es-ticket`** (Receipt Printer): es Remotion puro, no pide instalar
nada (menos ruido) y toca las trampas conocidas (texturas, tipografía, rojo de corrector).

Que no haya sido hecha antes: si un brazo la ve hecha en el repo, la comparación no vale.

## Cómo se corre

1. **Mismo punto de partida.** Un commit de `main` (anotar el SHA). Para B y C, una rama desde ese
   commit sin los skills:

   ```bash
   git checkout -b medir/sin-skills <SHA>
   ```

   ```bash
   git rm -r --quiet .claude/skills/direccion-historia historia/.claude historia/.agents historia/skills-lock.json && git commit -m "Medición: rama sin skills"
   ```

   `historia/CLAUDE.md` queda en las dos ramas: las reglas del canal son la base, no el skill.
2. **Sesiones nuevas**, una por brazo, en el mismo tipo de entorno. No reutilizar esta conversación
   ni otra larga: el contexto acumulado ya es una ventaja.
3. **El mismo pedido**, palabra por palabra, en las dos (o tres). Se escribe antes de empezar y se
   guarda en `resultados/medir-skill/<muestra>/pedido.md`. El pedido no dice cómo resolverlo: pide la
   muestra de 5 s con su informe, como en la tanda 1.
4. **Mismas reglas de intervención.** Gerson responde lo que el agente pregunte, igual en todos los
   brazos, y no da pistas de cómo hacerlo. Se cuentan las intervenciones.
5. **Fin del brazo:** cuando el agente dice que terminó y pasan `typecheck`, `reglas` y `validar`.
   Si después Gerson pide cambios, esas vueltas se cuentan aparte («vueltas de revisión»).
6. **Antes de cerrar cada sesión**, guardar el consumo. En la nube el contenedor se borra al cerrar:

   ```bash
   python3 historia/laboratorio/scripts/consumo_sesion.py ~/.claude/projects/<carpeta>/<sesión>.jsonl --json historia/laboratorio/resultados/medir-skill/<muestra>/consumo-<brazo>.json
   ```

   Y anotar el total de la plataforma (`get_session`, campo `usage`) para contrastar.

## Qué se registra

En `resultados/medir-skill/<muestra>/<brazo>.json`:

| Campo | De dónde |
|---|---|
| SHA de partida, rama, modelo, esfuerzo | `git`, `get_session` |
| Llamadas, tokens (entrada, salida, caché), costo API equivalente | `consumo_sesion.py` [medido] |
| Tiempo de pared de la sesión | primera y última llamada del registro [medido] |
| Renders hechos | contar en el registro de la sesión [medido] |
| Defectos que encontró el revisor (`revisar.py`) en la entrega | [medido] |
| Defectos que encuentra Gerson al mirar el clip | [observado] |
| Intervenciones de Gerson y vueltas de revisión | conteo a mano |
| Veredicto de Gerson: aprobado / con cambios / no | a ciegas (ver abajo) |

## Juicio a ciegas

Gerson ve los clips sin saber de qué brazo es cada uno: alguien más (o un script) los renombra
`X.mp4` e `Y.mp4` y guarda la clave aparte. Primero el veredicto, después se destapa.

## Cómo leer el resultado

- **A gana** si llega a un veredicto igual o mejor que B con menos tokens. Si además A cuesta menos
  que C, el skill es el que ahorra.
- **Una sola muestra no alcanza para concluir**: hay variación entre sesiones (en el laboratorio,
  ±25 % solo en tiempos de render). Una corrida es una señal; para decidir, 2 o 3 muestras.
- Lo que no se mide: si el skill ayuda en un episodio completo (otra forma de trabajo). Eso es otra
  medición.

## Costo de la medición

Dos o tres sesiones completas. Como referencia, solo como orden de magnitud: el turno 1 de la sesión
que hizo la tanda 1 (cinco muestras más la infraestructura) costó $8,17 de equivalente API. Una sola
muestra debería costar bastante menos, pero no está medido.
