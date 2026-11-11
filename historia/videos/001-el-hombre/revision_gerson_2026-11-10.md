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

«Joder Jolines» es el clon de la voz de Gerson (confirmado por él). Pendiente antes de publicar:
los enlaces de Suno (`fuentes.md`).

## Segunda escucha (2026-11-10)

> «"El primer caso antes de irse": hay que precisar cuántos años antes de irse y a qué destino.»
> «Se siguen sintiendo saltos de volumen en el guion, con mínimos, pero se siente.»

- **s06:** «Pero su primer caso lo había encontrado en Lima, en 1980, poco antes de irse a Nueva
  York.» El libro no da el año de la partida: la tesis es de 1980 (p. 17) y en 1981 ya tenía la beca
  de Columbia (p. 19), así que «poco antes» es una deducción segura (`fuentes.md`).
- **Volumen:** `narracion.py` nivela frase por frase (cada frase se acerca un 65 % al nivel medio de
  su escena; el cambio de ganancia ocurre en la pausa, con rampa). Diferencia entre frases de una
  escena: de 6–8 dB a 1–3 dB.
- La música se ancla ahora a beats (`montaje_musica/*.json`): si la voz cambia, `montar_musica.py`
  la vuelve a calzar sola.

## Tercera escucha (2026-11-10)

> «2:25–2:26 hay un salto de volumen en el guion; 3:16–3:18, un ligero salto; también en el 5:23.
> ¿No has puesto la canción G de Suno? No la sentí.»

- Los tres saltos eran **cambios de escena** (s03→s04, s04→s05, s06→s07): cada escena se normalizaba
  sola. Ahora todas las frases van a un **nivel común del episodio** (`NIVEL_COMUN` en
  `narracion.py`): escenas entre −15,8 y −16,2 LUFS; de una escena a la siguiente, 0,1–2 dB.
- **G** estaba en s06 (el guano), pero su parte fuerte va bajo la voz y su acorde final caía encima de
  la pregunta. Ahora el acorde suena ~0,5 s **después** de «¿Adónde fue a parar esa plata?», cuando
  la voz ya soltó la música, con +8 dB, y queda solo en la cola de s06, alargada de 1,5 a 3,5 s
  (medido: de −35 a −24 dB).
- Un control de s06 mostró un pico de +1,5 dBFS: las monedas (con la flecha) sobre la voz y la
  música. Monedas −2 dB y **limitador final** (−1 dBFS) en `render.yml` y en las muestras.

## Orden cronológico: el guano antes del viaje (2026-11-11)

> «Creo que vamos a tener que presentar el tema de Isla del Guano antes de su decisión de viajar a
> Nueva York. ¿Tenemos información para respaldar el viaje luego de encontrar el tema del guano?»

- **Lo que respalda el libro:** el orden (Denegri → tesis de 1980 → beca de Columbia, 1981 →
  *La deuda defraudada*, 1987; prólogo, pp. 16–19). **No respalda la causa:** el libro no dice que se
  fue por el guano; las razones que da son la beca de Klein y elegir Estados Unidos cuando se iba a
  París. El guion dice «después», nunca «por eso».
- **Aplicado:** el primer caso (`s06`) va ahora antes del viaje (`s05`). Textos nuevos: «Su primer
  caso lo encontró todavía en Lima.» · «En su tesis de 1980 mostró que se había inflado el valor de
  la deuda…» · y al cerrar `s05`, «Pero no se olvidó de aquella tesis sobre la deuda, que en 1987 se
  convertiría en un libro.» (redacción de Gerson), al que responde la tarjeta del próximo episodio.
- `s05` se genera en dos tramos, partidos en el respiro de 2,45 s después de «…la corrupción en el
  Perú»: con la frase nueva, ElevenLabs devolvía 502 a la toma entera.
- Curva de intensidad: 4 3 1 3 3 **5** 2 1 (el pico en el guano, el respiro en el viaje). 5:39.
