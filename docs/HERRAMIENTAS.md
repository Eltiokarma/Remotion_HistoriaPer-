# Herramientas de producción

Qué herramienta hace qué en la base de producción educativa del canal, y cuánto sabemos de cada una
por haberla probado. **No hace falta instalar todas para empezar**: Remotion sigue siendo el motor;
las demás entran cuando una escena lo pide y una muestra del [laboratorio](../historia/laboratorio/)
demuestra que suman.

La identidad no se negocia con la herramienta: historia del Perú y del altiplano, rigor histórico,
la voz de Gerson, papel, tinta, grabado y pizarra. Cada movimiento ayuda a explicar algo
([`historia/CLAUDE.md`](../historia/CLAUDE.md)). Una herramienta que obliga a otra estética se usa
para preparar material, no para dirigir.

## Estados

| Estado | Qué significa |
|---|---|
| **verificada** | Se usó en este repositorio y hay un resultado visible (episodio o muestra), con código, versión y medida. Dice *dónde* se verificó. |
| **propuesta** | Tiene un uso claro en el canal y una prueba diseñada en el [roadmap](../ROADMAP.md), pero todavía no se probó aquí. |
| **pendiente de prueba** | Puede servir, pero falta hardware, licencia o una escena que la justifique. No se planifica hasta que eso cambie. |

> **Dónde se verificó.** Todo lo «verificado» del laboratorio corrió en un contenedor en la nube
> (Intel Xeon 2,1 GHz, 4 hilos, 15,7 GB de RAM, **sin GPU**), no en la laptop de render
> (i7-11370H, Iris Xe, 16 GB) ni en la PC que se está evaluando (Ryzen 7 9700X, RTX 5070 12 GB,
> 32 GB). Los tiempos de una máquina no se trasladan a otra.

## Las herramientas

| Herramienta | Función en el canal | Estado | Evidencia o prueba prevista |
|---|---|---|---|
| **Remotion** | Composición, montaje, sincronización con la voz y los beats, exportación. El motor de todos los episodios. Con los skills oficiales `remotion-dev/skills` instalados (`historia/CLAUDE.md` §15: las reglas del canal mandan). | verificada (episodios 000 y 001; muestras 02–05) | [`historia/`](../historia/), [muestra 05](../historia/laboratorio/muestras/05-mapa-documento/) |
| **Manim** | Explicaciones matemáticas, estadísticas y conceptuales: proporciones, regresiones, series. | verificada (contenedor) | [muestra 01](../historia/laboratorio/muestras/01-monedas-manim/) |
| **JavaScript/TypeScript + SVG/Canvas** | Ilustración procedural y animación 2D: mapas, grabados, trazos que se dibujan. | verificada (episodios; muestras 02, 05) | [muestra 02](../historia/laboratorio/muestras/02-cordillera-tinta/) |
| **Rough.js** | Trazos y rellenos con aspecto dibujado (rayado a pluma), con semilla. | verificada (contenedor) | [muestra 02](../historia/laboratorio/muestras/02-cordillera-tinta/) |
| **p5.js** | Dibujo generativo: campos de flujo, patrones, partículas (viento, agua, polvo). | verificada (contenedor) | [muestra 03](../historia/laboratorio/muestras/03-viento-p5/) |
| **PixiJS** | Escenas 2D con miles de elementos y filtros por GPU (multitudes, granos, lluvia). | verificada (contenedor; WebGL por software, SwiftShader: ~7× más lento que p5 por los filtros y las capas a pantalla completa; con GPU sin probar) | [muestra 06](../historia/laboratorio/muestras/06-lluvia-pixi/) |
| **Three.js + React Three Fiber + drei** (con `@remotion/three`) | Escenas 3D programables dentro de Remotion: objetos con volumen (libros, maquetas), cámara con motivo. | verificada (contenedor y CI; WebGL por software, ANGLE + SwiftShader; con GPU sin probar) | [muestra 04](../historia/laboratorio/muestras/04-libro-3d/) |
| **Blender** | Modelos, materiales y planos 3D detallados (barcos, edificios, objetos de época) que Three.js no alcanza. Sale como secuencia de imágenes o video que Remotion monta. | propuesta | Tanda 2 (`t2-blender`); serie naval |
| **Houdini** | Construcción procedural y simulaciones especializadas (humo, agua, destrucción). | pendiente de prueba | Necesita GPU y decidir licencia; ver roadmap (`t4-houdini`) |
| **Unreal Engine** | Escenarios y recorridos cinematográficos en tiempo real. | pendiente de prueba | Necesita la PC con GPU; ver roadmap (`t4-unreal`) |
| **QGIS** | Cartografía y preparación de datos geográficos (lagos, ríos, relieve, límites históricos) para exportar a GeoJSON/SVG que dibuja Remotion. | propuesta | Tanda 2 (`t2-qgis`): el mapa de la muestra 05 no tiene lagos |
| **ComfyUI** | Generación de recursos (texturas, fondos, referencias) con flujos locales o externos. | pendiente de prueba | Antes de usarlo: licencia de cada modelo y regla 1.1·3 del canal (imágenes con licencia clara) |
| **DaVinci Resolve / Fusion** y **After Effects** | Alternativas de composición y acabado (etalonaje, limpieza de audio, ajustes finales). | pendiente de prueba | Solo si el acabado en Remotion no alcanza |

## Control por MCP (investigado el 2026-11-07, nada probado todavía)

MCP deja que Claude maneje un programa (crear capas, mover claves, exportar) en vez de escribir solo
código. Lo que hay, según sus repositorios y documentación (no según pruebas propias):

| Programa | MCP | Qué hace | Costo | Para el canal |
|---|---|---|---|---|
| **Inkscape** (vectorial libre, como Illustrator) | Comunitarios: `inksmcp`, `inkscape-mcp` (PyPI) | Crear, editar y exportar SVG con Inkscape 1.x | Gratis (GPL) | **El que más calza:** ilustraciones vectoriales (grabado, mapas, objetos) que Remotion anima como SVG. Podría probarse en el contenedor (Inkscape sin pantalla) |
| **Blender** | `ahujasid/blender-mcp` (MIT, el más usado) | Escena, objetos, materiales, capturas del visor | Gratis | Tarea `t2-blender`. Corre en la máquina de Gerson (complemento dentro de Blender); sin GPU, el render es lento |
| **Illustrator** | Oficial dentro de Illustrator (Beta), 40 herramientas, según la ayuda de Adobe; y comunitarios (`ie3jp/illustrator-mcp-server`, 63 herramientas) | Leer, crear y exportar el documento abierto | Suscripción de Adobe | Igual que Inkscape, si Gerson ya tiene Creative Cloud |
| **After Effects** | Solo comunitarios (ocho o más: `kumoproductions/mcp-aftereffects`, `ishu86/after-effects-mcp`…); ninguno de Adobe | Composiciones, capas, claves, expresiones, render | Suscripción de Adobe | Se superpone con Remotion. Saldría como video que Remotion monta; los beats se fijan en segundos |
| **Adobe for creativity** | Conector oficial de Adobe para Claude (abril 2026), 50+ herramientas | Según una prueba de terceros, opera al nivel de Adobe Express (reencuadre, ajustes básicos), no el control fino de Photoshop o Premiere | Cuenta de Adobe para más uso | Poco: no es el control de capas que necesita una escena |
| **Figma** | Oficial (`mcp.figma.com`), escribe en el lienzo (`use_figma`), en beta | Diseñar con componentes; exportar SVG | Gratis en beta; asiento Full para escribir | Medio: diseño de piezas planas que se exportan a SVG |
| **DaVinci Resolve / Fusion** | Comunitarios (`samuelgursky`, `tooflex`, `apvlv`) | Proyecto, línea de tiempo, Fusion, color, render | La API externa suele pedir Resolve Studio (de pago) | Acabado, si hiciera falta (ya listado arriba) |
| **GIMP / Krita** | Comunitarios | Pintura y retoque | Gratis | Texturas y fondos pintados |
| **Rive** | Oficial dentro del editor (Early Access) y comunitarios | Animación interactiva `.riv` | Plan de Rive | Poco: es animación interactiva, no video lineal |
| **Remotion** | El MCP oficial de documentación cerró el 2026-10-26; lo reemplazan los skills (ya instalados) | — | — | Ya cubierto |

**Dónde corren.** Los MCP de programas de escritorio (Blender, Illustrator, After Effects, Inkscape con
interfaz) corren en la computadora donde está el programa: hace falta Claude Code o Claude Desktop en
esa máquina. Los remotos (Adobe for creativity, Figma) funcionan desde claude.ai.

**Antes de instalar uno comunitario:** son código de terceros que ejecuta scripts dentro del
programa (ExtendScript, Python). Revisar el repositorio, la licencia y la actividad, como con los
skills (`historia/CLAUDE.md` §15).

**Uno propio.** Se puede escribir un servidor MCP del canal (renderizar un tramo, sacar un cuadro,
medir, revisar, validar `escenas.json`). Dentro de Claude Code ya se hace con los scripts; serviría
para trabajar desde Claude Desktop o claude.ai sin el repositorio.

## Cómo entra cada una al video

- **Dentro de Remotion, cuadro a cuadro** (lo preferido: el cuadro manda, se renderiza todo junto):
  SVG/Canvas, Rough.js, p5.js, PixiJS, Three.js. Reglas: animación según `useCurrentFrame()`,
  azar con semilla, nada de bucles ni relojes propios de la biblioteca.
- **Afuera, como material** (se exporta y Remotion lo monta con `<OffthreadVideo>` o una secuencia
  de imágenes): Manim, Blender, Houdini, Unreal, ComfyUI. Hay que fijar los beats en segundos para
  que el clip calce con la voz (la muestra 01 muestra cómo: cuadros exactos).
- **Antes del video, como datos**: QGIS prepara GeoJSON/TopoJSON que dibujan los componentes de
  mapas (`Mapa`, `MapaLugar`).
- **Después, como acabado**: DaVinci Resolve o After Effects, solo si hace falta.

## Licencias (a confirmar al adoptar)

Lo que se sabe hoy, para decidir; **se verifica en la página oficial antes de usar cada una en un
video publicado** y se anota en el `fuentes.md` del video si deja material propio.

| Herramienta | Licencia o condición conocida |
|---|---|
| Remotion | Licencia propia: gratuita para individuos y empresas chicas; empresas más grandes pagan. El canal la usa como individuo. |
| Manim Community | MIT |
| Rough.js | MIT |
| p5.js | LGPL-2.1 |
| PixiJS | MIT |
| Three.js, React Three Fiber, drei | MIT |
| Blender | GPL (el material que uno hace con Blender es de uno) |
| QGIS | GPL; los **datos** tienen su propia licencia (Natural Earth es dominio público; otros no) |
| Houdini | Apprentice gratis pero no comercial; Indie de pago con límite de ingresos |
| Unreal Engine | Gratis con condiciones de la EULA de Epic; revisar para contenido lineal |
| ComfyUI | GPL-3.0; **cada modelo** tiene su licencia, que es la que importa |
| DaVinci Resolve | Versión gratuita y versión Studio de pago |
| After Effects | Suscripción de Adobe |

El estado de cada prueba, sus fechas y sus bloqueos viven en el [roadmap](../ROADMAP.md).
