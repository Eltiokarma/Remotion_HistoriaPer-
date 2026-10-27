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

Graba cada escena por separado y guárdala en `public/voz/000-quiroz/s01.wav`, `s02.wav`, …
(la carpeta está fuera de git). Al abrir el Studio o renderizar:

- si existe el audio de una escena, **la escena dura lo que dura la voz** + 0.8 s de cola;
- si no existe, usa `duracion_s` de `escenas.json`.

Mientras tanto, los `beats` (momentos clave, en segundos) se escalan en proporción a la nueva
duración. Para el corte final, cuádralos a mano con la palabra justa —por ejemplo
`s02.beats.sello` en el momento en que dices "1974"— y pon `"beats_ajustados": true` en esa
escena para que ya no se escalen.

## Pendiente

- Verificar todos los datos de `fuentes.md` (la cifra de s03 es un marcador).
- Música y ambiente (hoy no hay audio aparte de la voz).
