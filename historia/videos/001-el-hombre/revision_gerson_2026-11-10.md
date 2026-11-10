# Notas de Gerson sobre la voz y el sonido del 0·1 (2026-11-10)

Anotaciones del director al escuchar las pruebas. Etiquetas de `DIRECCION_DE_VIDEO.md` §5.

## La narración no puede sonar cortada — lo más importante

> «Lo más importante es que no se sienta cortado, o como si se grabara a diferentes distancias del
> micrófono.»

**Causa (diagnóstico de Claude).** La narración se generó **frase por frase** (`narracion.json`):
cada frase es una toma distinta de ElevenLabs, con su propio timbre, nivel y aire, y entre frases
quedaba silencio digital puro. Eso suena a cortes y a micrófonos a distancias distintas. Afecta a la
narración actual (`voz/`, «Narrador Historia Puno») y a las pruebas con otras voces.

**Arreglo propuesto** (`EN OBSERVACIÓN`: se aplica en la próxima generación de voz):

1. **Una toma por escena, no por frase.** Toda la escena en una sola llamada (v3), con las pausas
   escritas en el texto («…», punto y aparte) y las etiquetas de emoción donde cambian. Mismo
   timbre y misma distancia de principio a fin. Si una escena es muy larga, por párrafos.
2. **La voz manda, los beats se mueven.** En vez de mover cada frase al tiempo de la voz
   provisional, se alinea la toma con el guion (alineación forzada de ElevenLabs: el segundo de
   cada palabra) y se reescriben los beats de `escenas.json` (`beats_ajustados: true`). La música
   montada sobre beats (`montaje_musica/`) se vuelve a correr con los tiempos nuevos.
3. **Nunca silencio digital dentro de la voz.** Si hay que unir dos tomas, fundido cruzado y el
   aire de la propia voz debajo, no un hueco a cero.
4. **Un solo nivel.** Se normaliza la escena entera, no cada frase.

## Voz «Joder Jolines» (prueba)

- **«Cada año» (s00):** se queda la **toma original, susurrada**, aunque la transcripción automática
  la lea como «Cabaño»/«Caballo». La versión «clara» que la reemplazó se sentía cortada. Regla
  general: la transcripción sirve para detectar palabras cambiadas, no para elegir tomas; si la
  diferencia es de interpretación (un susurro), decide Gerson de oído.
- Toma guardada en `public/videos/001-el-hombre/voz-pruebas/joder-jolines/s00-01.mp3` (fuera de git).

## Ya aplicado

- Primera oración del video más lenta (velocidad 0,85, «Narrador Historia Puno»).
- Fondo sin cortes: los ambientes se cortaban 10–25 ms en cada vuelta del bucle; ahora duran 115 s.
  Efectos igualados por volumen percibido (no por pico). Teclas con fundido final.

## Estado

Anotado, sin renderizar (pedido de Gerson: «solo estoy dejando anotaciones»). Pendiente: decidir
la voz (Narrador Historia Puno, Jolines Narrador o Joder Jolines) y regenerarla por escena con el
arreglo de arriba.

## Estado de la revisión (2026-11-10, después)

Gerson eligió **«Joder Jolines»**. Aplicado:

- `scripts/narracion.py`: una toma por escena; s01 partida solo en la cruz sobre negro, con el aire de
  la toma; 25 respiros del guion alargados con ese aire; fundidos de entrada y salida en cada toma (la
  toma terminaba con un resto de sonido y se oía un corte); carraspeos en pausas limpiados (s02, s04,
  s05). Tomas regeneradas: s05 (decía «hacía» por «hace»), s04 (decía «Quiroga»), s02 y s06.
- `scripts/beats_a_la_voz.py`: todos los beats llevados a la voz (`beats_ajustados: true`).
- `scripts/montar_musica.py`: la música de s00 a s06 rearmada sobre los beats nuevos; el empalme
  s01→s02 recalculado al cuadro.
- La escaleta mide ahora con la narración real: la voz ocupa del 54 al 76 % de cada escena.
- Control del audio completo: 0 cortes en seco, empalme parejo, −16,7 LUFS. El efecto `saco`, −2 dB
  (sumado a la voz en s06 dejaba el pico en −0,6 dBFS).
- El episodio dura **5:36** (antes 6:37): la voz habla más rápido aun con los respiros.

Pendiente antes de publicar: el permiso de la voz clonada y los enlaces de Suno (`fuentes.md`).
