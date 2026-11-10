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

## Choques decididos por Gerson (2026-11-03)

Aparecieron al traer `direccion-historia` a `main`. Ya están aplicados en ese skill (marcados
**Decidido**) y en `historia/CLAUDE.md`.

| Tema | Había | Decisión |
|---|---|---|
| El rojo | `direccion-historia`: «solo para la culpa». `CLAUDE.md`: «rojo de corrector para lo que importa» | **Para ambos**: la culpa y el corrector (subrayar, tachar, señalar el dato). Sigue el rojo apagado para una pérdida (§4). El «30 %» de la muestra 01 y el subrayado de «Puno» de la 05 quedan bien |
| El gancho | 10–15 s, una persona en un momento concreto / 20–60 s, de frente y con hechos (guía) | **El de la guía** (`DIRECCION_DE_VIDEO.md` §2.5) |
| El silencio | «uno solo por video» / «al menos uno» | **Al menos uno**, de 1,5–3 s, junto al dato más fuerte (`CLAUDE.md` §6) |

Si aparece otro choque entre los documentos del director, gana la guía hasta que Gerson decida, y
se anota aquí.

## Veredictos sobre el laboratorio

### Tanda 1, en conjunto (2026-11-04)

- **Qué miró:** las cinco muestras de la tanda 1, en conjunto (no muestra por muestra).
- **Veredicto:** aprobado con cambios.
- **Por qué (paráfrasis de Gerson, en la conversación):** «está bien, pero se ve muy plano»; mejorará
  con el tiempo, y el skill también.
- **Regla que se deriva:** técnicamente correcto no alcanza. Antes de mostrar una muestra, buscar qué
  le da volumen y vida: profundidad (capas, paralaje, sombra), textura y luz con intención, contraste
  de ritmo (quietud y golpe), algo que el espectador sienta. Lo plano es lo que el canal existe para
  evitar (`historia/CLAUDE.md` §0).
- **Dónde aplica:** todo el laboratorio y, mientras no diga otra cosa, las escenas del canal.
- **Pendiente:** el veredicto muestra por muestra, cuando Gerson lo dé.

### Muestra 06, tormenta sobre el lago (2026-11-04)

- **Qué miró:** la primera versión de la 06 (PixiJS), entera.
- **Veredicto:** no aprobado.
- **Por qué, en sus palabras:** «se parecen a mis dibujos, planos y sin corazón». Mandó tres paisajes
  vectoriales de la comunidad (lago con sol al atardecer, lago con luna y penínsulas, cordillera
  nevada con nubes): «son trabajo vectorial, pero dan sensación de profundidad… tenemos que apuntar
  a eso».
- **Regla que se deriva (lectura del agente de esas referencias, para que Gerson la corrija):** la
  profundidad no sale del desenfoque sino de:
  1. **Una escala de valor y color de lejos a cerca**, en 5–7 capas: lo lejano toma el color del
     cielo (bruma), lo cercano es oscuro y saturado. No tres grises.
  2. **Bruma al pie de cada capa**: cada capa se aclara hacia su base, y eso la separa de la de atrás.
  3. **Una fuente de luz con halo** (sol, luna) que da dirección; las caras de las montañas tienen
     lado de luz y lado de sombra, y nieve en las cumbres.
  4. **Primer plano que enmarca**, cortado por el borde del cuadro (árboles, totora), y objetos que
     dan escala (grandes adelante, chicos atrás).
  5. **Un suelo que se aleja**: orillas y penínsulas en diagonal que entran al agua, no franjas
     horizontales de borde a borde.
  6. **Agua que refleja** el cielo y las capas, con líneas de oleaje que cortan el reflejo y la
     columna de luz del sol.
  7. **Composición asimétrica**, con el horizonte fuera del centro.
- **Dónde aplica:** todo paisaje del canal. La paleta del canal ya trae ocre y verde: la escala de
  profundidad se arma mezclando sus colores, sin salir de ella.

### Muestra 06, versión 2 (2026-11-05)

- **Qué miró:** la versión 2 de la 06 (seis planos, bruma, sol, totora, reflejo, paralaje).
- **Veredicto:** aprobado con cambios.
- **Por qué, en sus palabras:** «Sí, mejor; sé que ahora es más tema de la paleta, la cámara, efectos de
  sonido y demás».
- **Regla que se deriva:** las siete lecturas de profundidad funcionan; lo siguiente a cuidar es la
  paleta, la cámara con motivo y el sonido (el trueno faltó).
- **Dónde aplica:** todo paisaje del canal.

### Escalar a ~200 videos (2026-11-10)

- **Decisión:** catálogo de piezas afinado en el Studio editable; episodios como datos en
  `escenas.json`; revisión automática. Detalle en `historia/CLAUDE.md` §15.

### Muestras 09 a 13 y el oficio del skill (2026-11-10)

- **Qué miró:** las muestras 09 (Puno de noche), 10 (balsa, Inkscape por MCP), 11 (título con
  Inkscape), 12 (Studio editable) y 13 (efectos), y el oficio del skill v1.
- **Veredicto:**
  - 12 y 13: aprobadas para usar («estoy tranquilo con que te encargues de 12, 13»);
  - el oficio del skill: aprobado («está bien»);
  - Inkscape (10, 11): se reemplaza por **VectorCraft**;
  - 09: sin veredicto propio.
- **Regla que se deriva:**
  - las láminas se dibujan en VectorCraft (por MCP, desde ChatGPT o Claude), no en Inkscape;
  - para afinar piezas del catálogo, el Studio editable (12);
  - para foco, luz o llevar una imagen a la paleta, `@remotion/effects` (13), solo los que usan WebGL2;
  - el oficio (referencias, pase de imagen, coreografía, sonido en el golpe) vale para animar las
    láminas de VectorCraft.
- **Dónde aplica:** todo el canal.

## Formato para los próximos veredictos

No se completan con suposiciones del agente. Formato para cada entrada:

- **Qué miró:** muestra o escena, y el cuadro o tramo si aplica.
- **Veredicto:** aprobado / no aprobado / aprobado con cambios.
- **Por qué, en sus palabras:** cita o paráfrasis marcada como tal.
- **Regla que se deriva:** lo que el agente debe hacer distinto la próxima vez.
- **Dónde aplica:** este canal, esta serie, o solo este tipo de escena.
