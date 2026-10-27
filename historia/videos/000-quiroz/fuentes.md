# Fuentes — 000-quiroz

Libro base: Alfonso W. Quiroz, *Historia de la corrupción en el Perú* (Lima: IEP / IDL, 2013).
Las páginas son las que indica el guion (fase 2). Antes del render final hay que cotejar cada dato
con el libro; lo que todavía no tiene fuente segura dice `[VERIFICAR]` y hace fallar
`npm run validar -- 000-quiroz --final`.

## Datos en pantalla o en la voz

| Escena | Dato | Fuente | Estado |
|---|---|---|---|
| s01 | Corrige en Nueva York las pruebas de la traducción al español; no le queda mucho tiempo | Agradecimientos, p. 35; Nota de los editores | cotejar |
| s01 | Ficha `NUEVA YORK · MEMORIAL SLOAN-KETTERING` (nombre del hospital) | ¿Nota de los editores? | [VERIFICAR] |
| s01 | **Frase en pantalla:** «…a mis médicos, por alargar estos días para poder completar la tarea.» Está compuesta como cita de libro: tiene que ser el texto exacto | Agradecimientos, p. 35 | [VERIFICAR] — copiar la frase textual en `escenas.json → s01.props.cita` |
| s01 | Menciona a su hijo recién nacido | Agradecimientos, p. 35 | cotejar |
| s01 | Murió en enero de 2013; el libro salió en mayo (sellos `ENERO 2013` / `MAYO 2013`) | Nota de los editores; créditos (1.ª ed., mayo 2013) | cotejar |
| s02 | Alfonso W. Quiroz Norris, Lima, 1956 — 2013; nadador de competencia infantil y juvenil | Prólogo de Marcos Cueto, p. 15 | cotejar |
| s02 | «Inagotable» (la palabra de Cueto) | Prólogo, p. 15 | cotejar |
| s03 | Ingreso a la PUCP en 1974, entre los primeros puestos (sello `PUCP · 1974`, rótulo `ADMISIÓN · 1974`) | Prólogo, pp. 15–16 | cotejar |
| s03 | Gobierno de Velasco, militancia trotskista, Franklin Pease, Fernand Braudel | Prólogo, pp. 15–16 | cotejar |
| s03 | Afiches `REFORMA AGRARIA`, `NACIONALIZACIÓN`, `UN PAÍS NUEVO` | — | Tipografía genérica de época, no son afiches reales (así lo pide el guion) |
| s03 | Nombres de gobernantes que pasan rápido por la capa de arriba (Virreinato, San Martín, Castilla, Piérola, Leguía, Benavides, Odría, Prado, Belaunde, Velasco, Morales Bermúdez, García, Fujimori) | Conocimiento general; los agregó la producción | [VERIFICAR] — revisar lista y grafía |
| s04 | Félix Denegri Luna; consolidación de la deuda interna (1850); funcionarios cómplices; tesis 1980; *La deuda defraudada*, 1987 | Prólogo, pp. 17–18 | cotejar |
| s04 | Vale de `1 000` a `3 000` | — | Ilustración del mecanismo, no un dato: en pantalla dice «ejemplo ilustrativo» |
| s05 | Columbia, beca de Herbert S. Klein; historia cuantitativa; Kenneth Maxwell; bancos, crédito colonial, casa Grace; Baruch College y CUNY; de trotskista a liberal | Prólogo, pp. 18–23 | cotejar |
| s06 | Ensayo de 2000 «Historia de la corrupción en el Perú: ¿es factible su estudio?» | Prólogo, p. 23; Prefacio, pp. 31–32 | cotejar título exacto |
| s06 | Fichas `BANCO MUNDIAL · 1996 · «CÁNCER»` y `ONU · 2000` | Prólogo, p. 25; Prefacio, pp. 31–32 | cotejar |
| s07 | Las tres razones y la excusa; diplomáticos extranjeros; cuentas fiscales; diccionario de 1729 (cohecho, prevaricato, corruptela); «grava en el engranaje» | Introducción, pp. 40–44; Apéndice, pp. 536–537 | cotejar |
| s07 | Sellos `FOREIGN OFFICE`, `QUAI D'ORSAY`, `STATE DEPT.` | Introducción, pp. 40–44 (archivos diplomáticos que usó) | cotejar que sean esos tres archivos |
| s08 | 30–40 % del gasto del Estado; 3–4 % de la producción cada año (1820–2000); ninguna época de corrupción baja; ≈ la mitad del crecimiento que no tuvo | Apéndice, cuadro A.7 y conclusión, pp. 551–554; Prólogo, p. 24 | cotejar |
| s08 | **Niveles por período en el gráfico** (alta / muy alta por época) | Apéndice, cuadro A.7 | [VERIFICAR] — son un marcador: copiar la clasificación real en `escenas.json → s08.props.periodos` |
| s08 | Silueta «fantasma» del país, 1,45 veces más grande | — | Ilustración de «la mitad del crecimiento», no una medida |
| s09 | *Corrupt Circles*, 2008; premios; «roba, pero hace obra» | Prólogo, pp. 23–25 | cotejar |
| s10 | Antonio de Ulloa, Huancavelica 1758, ~3 600 m; la mina de mercurio | Introducción, pp. 55–56; cap. 1, pp. 59–60 | cotejar |
| s10 | Domingo Elías, Manuel González Prada, Jorge Basadre, Héctor Vargas Haya | Introducción, pp. 55–56 | cotejar |
| s10 | Los siete capítulos con sus títulos y años | Índice | cotejar títulos exactos |
| s11 | Cueto cierra el prólogo en Río de Janeiro, febrero de 2013; «siempre había querido ser como él» | Prólogo, p. 29 | cotejar |

## Assets

No hay fotos, metraje, carátulas originales ni imágenes de los vladivideos (el televisor solo muestra estática).

| Asset | Origen | Licencia |
|---|---|---|
| Mapa, globo y silueta del Perú | Natural Earth vía `world-atlas` (tierras 1:50 M y 1:110 M, países 1:50 M) | Dominio público |
| EB Garamond (texto de libro) | Google Fonts | SIL OFL 1.1 (`public/compartido/fuentes/licencias/`) |
| Oswald (afiches y cartel) | Google Fonts | SIL OFL 1.1 |
| Special Elite | Google Fonts | Apache 2.0 |
| Playfair Display, IBM Plex Mono, IM Fell English, Pinyon Script | Google Fonts | SIL OFL 1.1 |
| Texturas de papel, grano y cáusticas | `scripts/generar_texturas.py` | Material propio |
| Grabados, libro contable, vales, edificio, engranajes, televisor, carteles, portadas… | Dibujados en código (SVG), diseño propio | Material propio |
| Música, tema del canal, ambientes y efectos | Sintetizados con `scripts/generar_audio.py`, sin muestras de terceros | Material propio |
| Voz **provisional** (`public/videos/000-quiroz/voz-provisional/`) | TTS Piper, voz `es_MX-claude-high` | Apache 2.0 — **solo para el prototipo**: se reemplaza por la voz de Gerson antes de publicar |
| (no se usa todavía) *Los pulpos de Leguía*, Chambon, 1907 | — | [VERIFICAR] dominio público antes de usarla de fondo en s10 |

## Decisiones que rompen una regla del canal

- **Amarillo del cartel (s09).** El guion pide un cartel de obra amarillo y negro; la paleta del
  video no tiene amarillo. Se usa el ocre de la paleta llevado a amarillo (`CartelObra`), solo ahí.
  Si se prefiere no salir de la paleta, poner `"color_cartel"` en `s09.props`.
