# Historia del Altiplano — videos animados (Remotion)

Prototipo del video **000 — El hombre que le sacó la cuenta al Perú**: todo animado
(tipografía, vectores y números), sin fotos ni metraje.

## Usar

Necesitas Node 18 o más nuevo.

```
npm install
npm run studio                                   # vista previa en el navegador
npx remotion render v000-quiroz out/v000.mp4     # video final (1920×1080, 30 fps)
```

`remotion.config.ts` usa 4 hilos de render, pensado para la laptop i7-11370H.

## Cómo está armado

```
videos/000-quiroz/
  escenas.json   ← textos, duraciones, beats, paleta: todo lo que cambia va aquí
  guion.md       ← la narración
  fuentes.md     ← cada dato con su fuente; lo que dice [VERIFICAR] falta confirmar
src/
  direction/     ← easings por "peso", helpers de animación y cálculo de tiempos
  components/    ← piezas reutilizables (máquina de escribir, pila de páginas)
  videos/v000/   ← las seis escenas de este video
public/fonts/    ← fuentes incluidas (el render no depende de internet)
```

## La voz manda

Por ahora suena una **voz provisional** (TTS, en `public/voz-provisional/`), solo para probar
ritmo y tiempos. Para reemplazarla, graba cada escena por separado y guárdala en
`public/voz/000-quiroz/s01.wav`, `s02.wav`, … (esa carpeta está fuera de git). No hay que tocar
nada más: la voz real gana sola. Al abrir el Studio o renderizar:

- si existe la voz de una escena (la real o, si falta, la provisional), **la escena dura lo que
  dura la voz** más su `cola_s`;
- si no hay ninguna, usa `duracion_s` de `escenas.json`.

Mientras tanto, los `beats` (momentos clave, en segundos) se escalan en proporción a la nueva
duración. Para el corte final, cuádralos a mano con la palabra justa —por ejemplo
`s02.beats.sello` en el momento en que dices "1974"— y pon `"beats_ajustados": true` en esa
escena para que ya no se escalen.

## Música, ambiente y efectos

Todo el audio sale de `scripts/generar_audio.py` (síntesis con numpy, sin muestras de terceros):
`python scripts/generar_audio.py` lo vuelve a generar en `public/audio/`.

En `escenas.json`, cada escena tiene su bloque `audio`:

- `musica` y `ambientes`: pista, `nivel` (0–1) y opcionalmente `desde_beat` / `hasta_beat`
  (entran o salen con un fundido en ese momento clave).
- `silencio`: música y ambiente se callan del todo entre dos beats (el silencio deliberado
  antes del dato fuerte, en s04).
- `duck_db`: cuánto baja la música cuando habla la voz (se mide la voz cuadro a cuadro).

Entre escenas, el sonido de la siguiente entra 12 frames antes que su imagen y el de la
anterior se queda 15 frames (cortes J/L). Los efectos (teclas, hojas, sello, pluma, campanas,
golpe…) están en cada escena y caen en sus beats, así que se mueven solos si cambian los tiempos.

Estados de la música: s01 ausente · s02–s04 presente · silencio · golpe en "la mitad" ·
s05 protagonista · s06 se apaga.

La voz provisional se genera con `scripts/voz_provisional.py` desde
`videos/000-quiroz/voz_provisional.txt` (necesita `piper-tts` y la voz `es_MX-claude-high`).

## Pendiente

- Verificar todos los datos de `fuentes.md` (la cifra de s03 es un marcador).
- Grabar la voz real y cuadrar los beats con ella (`"beats_ajustados": true`).
