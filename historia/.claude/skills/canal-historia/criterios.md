# Criterios de Gerson

El estilo del canal ya está escrito. No se resume aquí para no tener dos versiones: se lee en su
lugar, antes de trabajar.

## Dónde está

| Documento | Fecha | Qué dice | Autoridad |
|---|---|---|---|
| `historia/videos/NNN-slug/revision_*.md` | por video | Notas del director sobre ese video, con etiquetas (`VERIFICAR`, `DEFINIR`, `IDEA`…) | La más alta para ese video |
| `historia/DIRECCION_DE_VIDEO.md` | 2026-10-30 | Formato «El profe que explica»: gancho de frente y con hechos, pizarra, brillo de lo que se nombra, remates, contexto de fechas, respeto en lo humano, música final. Cada regla con su porqué en palabras del director | Gana ante un choque (`historia/CLAUDE.md` §2) |
| `historia/CLAUDE.md` | vigente | Reglas del canal: innegociables, oficio, gramática de la serie, código | Base de todo |
| `.claude/skills/direccion-historia/` | 2026-10-27 | Criterio de dirección: la voz de la serie («una persona peruana que leyó el libro… con calma y con bronca contenida»), cada escena gira, «pero / por eso», lo concreto, escribir para el oído, **lista negra de lo que suena a IA**, 17 caracteres por segundo, quietud antes del golpe, curva de intensidad, pase final | Vale salvo donde choca con lo de arriba |

## Choques para que Gerson decida

Encontrados al traer `direccion-historia` a `main` (2026-11-03). Mientras no decida, se aplica la
columna «Hoy manda».

| Tema | `direccion-historia` (27 oct) | Lo vigente | Hoy manda |
|---|---|---|---|
| El rojo | «solo para la culpa» (la deuda inflada, la flecha al Estado) | «el rojo de corrector es para lo que importa: subrayar, tachar, señalar el dato»; «rojo apagado para una pérdida» (`CLAUDE.md` §1.3, §4) | `CLAUDE.md` |
| El gancho | 10–15 s; abre con una persona en un momento concreto, no con contexto | 20–60 s; dice de frente qué va a encontrar la gente, con hechos duros (`DIRECCION_DE_VIDEO.md` §2.5) | La guía |
| El silencio | «un solo silencio total en el video», antes del dato más fuerte | «al menos un momento de 1,5–3 s sin música por video» (`CLAUDE.md` §6) | `CLAUDE.md` (al menos uno) |
| Ejemplos | §8 calibra el 000 de 6 escenas | El 000 tiene hoy 11 escenas y el 0·1 se separó | Usar §8 como ejemplo, no como estado |

Consecuencia ya visible: en el laboratorio el rojo marca el «30 %» (muestra 01) y el subrayado de
«Puno» (muestra 05). Con la regla «solo para la culpa» no irían en rojo.

## Lo que falta: el veredicto sobre el laboratorio

Lo único vacío es cómo juzga Gerson las **muestras** (tarea `t1-revision`). No se completa con
suposiciones del agente. Formato para cada entrada:

- **Qué miró:** muestra o escena, y el cuadro o tramo si aplica.
- **Veredicto:** aprobado / no aprobado / aprobado con cambios.
- **Por qué, en sus palabras:** cita o paráfrasis marcada como tal.
- **Regla que se deriva:** lo que el agente debe hacer distinto la próxima vez.
- **Dónde aplica:** este canal, esta serie, o solo este tipo de escena.
