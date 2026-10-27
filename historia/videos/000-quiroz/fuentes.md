# Fuentes — 000-quiroz

Todo dato en pantalla o en la voz necesita fuente. Mientras diga `[VERIFICAR]`, el video es un
**prototipo** y no se renderiza la versión final.

## Datos del guion

| Escena | Dato | Fuente | Estado |
|---|---|---|---|
| s01 | Nueva York, fines de 2012, enfermo terminal | | [VERIFICAR] |
| s01 | Agradece a sus médicos "por los días extra" en la última página del libro (¿qué edición? ¿qué página?) | | [VERIFICAR] |
| s02 | Nombre completo "Alfonso W. Quiroz Norris" y años 1956–2013 | | [VERIFICAR] |
| s02 | Nadó por el Perú de chico | | [VERIFICAR] |
| s02 | Ingresó a la PUCP en 1974 entre los primeros puestos | | [VERIFICAR] |
| s03 | Su primera investigación fue sobre el guano y la consolidación de la deuda interna | | [VERIFICAR] |
| s03 | **Cifra en pantalla:** deuda interna de ~4,8 a ~23,2 millones de pesos (puesta como marcador, de memoria) | | [VERIFICAR] — cambiar en `escenas.json` → `s03.props.cifra` |
| s04 | La pregunta del año 2000 y la frase "¿Es factible su estudio?" (¿cita textual? ¿de dónde?) | | [VERIFICAR] |
| s04 | Archivos de Sevilla, Madrid, París, Londres y Washington | | [VERIFICAR] — cambiar en `s04.props.destinos` |
| s04 | "Cerca de la mitad del desarrollo que no tuvimos" (¿qué estimación exacta y de qué capítulo?) | | [VERIFICAR] |
| s05 | Siete capítulos con los períodos 1750–1820 … 1990–2000 | | [VERIFICAR] — cambiar en `s05.props.capitulos` |
| s06 | "No llegó a ver este libro impreso" | | [VERIFICAR] |

> Ojo con s01, s04 y s06: el libro salió primero en inglés (*Corrupt Circles: A History of Unbound
> Graft in Peru*, 2008, si no me equivoco) y la edición en castellano del IEP es de 2013. Hay que
> definir de qué libro se habla en cada frase para que las tres no se contradigan. [VERIFICAR]

## Assets

| Asset | Origen | Licencia |
|---|---|---|
| Mapa (costas 1:50 M, fronteras 1:110 M) | Natural Earth vía `world-atlas` | Dominio público |
| Special Elite | Google Fonts | Apache 2.0 (`public/compartido/fuentes/licencias/`) |
| Playfair Display | Google Fonts | SIL OFL 1.1 |
| IBM Plex Mono | Google Fonts | SIL OFL 1.1 |
| IM Fell English SC / Italic | Google Fonts (Igino Marini) | SIL OFL 1.1 |
| Pinyon Script | Google Fonts | SIL OFL 1.1 |
| Texturas de papel, grano y cáusticas (`public/compartido/texturas/`) | Generadas con `scripts/generar_texturas.py` | Material propio |
| Grabado de las islas, libro contable, mapa, repisa, carpeta… | Dibujados en código (SVG) | Material propio |
| (opcional, s05) *Los pulpos de Leguía*, Chambon, 1907 | — | [VERIFICAR] dominio público antes de usarla |
| Música (`public/videos/000-quiroz/musica/`), ambientes y efectos (`public/compartido/audio/`) | Sintetizados con `scripts/generar_audio.py`, sin muestras de terceros | Material propio |
| Voz **provisional** (`public/videos/000-quiroz/voz-provisional/`) | TTS Piper, voz `es_MX-claude-high` | Apache 2.0 — **solo para el prototipo**: se reemplaza por la voz de Gerson antes de publicar |
