# Remotion_HistoriaPer-

Herramientas y contenidos para videos cortos.

- **[karaoke-fansub/](karaoke-fansub/)**: editor local de karaoke sílaba por sílaba, con un color por personaje (estilo fansub de anime de los 2000). Exporta el video quemado con ffmpeg, en formato original o vertical para TikTok/Shorts. Instrucciones en su [README](karaoke-fansub/README.md).
- **[ROADMAP.md](ROADMAP.md)**: fases, entregables, estados, dependencias, fechas previstas y reales, bloqueos y evidencia, con vista Gantt. Se genera de [`roadmap/roadmap.json`](roadmap/roadmap.json) (única fuente): `node roadmap/generar.mjs`.
- **[docs/HERRAMIENTAS.md](docs/HERRAMIENTAS.md)**: qué herramienta hace qué en la producción (Remotion, Manim, SVG/Canvas, Rough.js, p5.js, PixiJS, Three.js, Blender, Houdini, Unreal, QGIS, ComfyUI, Resolve/AE) y si está verificada, propuesta o pendiente de prueba.
- **[historia/laboratorio/](historia/laboratorio/)**: muestras audiovisuales de 5 s para probar herramientas con la identidad del canal, con su código, medidas de render e informe.
- **[historia/](historia/)**: videos animados del canal de historia del altiplano, hechos con Remotion. Cada video es un guion y un `escenas.json` que se dibujan con una biblioteca de escenas reutilizables. Instrucciones en su [README](historia/README.md).
