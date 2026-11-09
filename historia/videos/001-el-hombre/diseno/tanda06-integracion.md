# Tanda 6 · Integración VectorCraft

9 de noviembre de 2026. Alcance: mapa de Lima, viaje a Nueva York con París como alternativa, explicación de regresión y serie del costo de la corrupción. Los SVG aprobados se conservan en `public/videos/001-el-hombre/vectorcraft/`. Las tandas anteriores, excepto la adaptación previa de la pizarra, siguen pendientes de integración.

Las capas se extraen con `scripts/vectorcraft-capas.ps1`. El componente VectorCraft las carga antes de capturar el cuadro y anima con los beats resueltos de Remotion, sin relojes ni transiciones CSS. Los textos exportados están convertidos a contornos. Cambiar el orden de objetos en un SVG exige revisar la correspondencia de la animación. Si cambian las cifras del guion, hay que actualizar y reexportar la lámina de costo.

- s02: mapa a partir de `lugar`, relieve en secuencia y población tomada de los datos existentes; se retira antes de la entrada de la piscina.
- s05: París se traza primero; las notas de los profesores aparecen en `paris_notas`; se atenúa al decidir; Nueva York se traza de `sale` a `llega`, con cámara acotada al mapa. Se abre en `abre`.
- s05: observaciones de ejemplo en `caen`, recta en `recta`, residuos en `pendiente`. Esquema expresamente rotulado como simulado; no son estimados de Quiroz ni se afirma causalidad.
- s05: la serie real entra en `serie`, muestra las 18 décadas del guion y la banda 3–4 % al final. Se mantienen fuente y cautela de estimados preliminares.

## Comprobaciones

TypeScript, reglas del proyecto y validación de `001-el-hombre`. Render de pruebas a 960×540 / 30 fps: s02, cuadros 60–284; s05, cuadros 480–749 y 1380–2129. Revisión visual de cuadros iniciales, intermedios, finales y transición al gráfico. MP4 fuera de Git, como exige el proyecto. Estos fragmentos usan la voz provisional existente y no constituyen un render final para publicación.
