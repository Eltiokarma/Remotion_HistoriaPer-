# Laboratorio de muestras audiovisuales (5 s)

Pruebas cortas para descubrir qué puede hacer cada herramienta **con la identidad del canal**
(papel, tinta, grabado, pizarra; cada movimiento explica algo) antes de usarla en un episodio.
Una muestra no es una escena terminada: es una pregunta con un resultado visible.

- Catálogo de herramientas y su estado: [`docs/HERRAMIENTAS.md`](../../docs/HERRAMIENTAS.md)
- Plan, estados, fechas y bloqueos: [`ROADMAP.md`](../../ROADMAP.md) (se genera de `roadmap/roadmap.json`)

## Reglas para que las muestras se puedan comparar

1. **5 s exactos**: 150 cuadros a 30 fps (lo comprueba `scripts/medir.py` con ffprobe contando cuadros).
2. **Entrega inicial 1920 × 1080, 30 fps**, H.264. Primero una **previa** barata, después la **final**.
3. **Paleta y tipografías del canal** (las del video 001 y `public/compartido/fuentes`).
4. **El cuadro manda**: en Remotion todo se calcula con `useCurrentFrame()`, con los pesos de
   `src/direction/easings.ts` y azar con semilla (`azar()`, `seed` de Rough.js, `noiseSeed` de p5).
5. **Se conserva todo**: código, parámetros, versiones (`resultados/<muestra>/*.json`) y los pasos
   para repetirlo (abajo).
6. **Recursos externos**: origen y licencia en el informe de la muestra. En la tanda 1 no hay
   ninguno: todo es código, más las fuentes, texturas y efectos que ya están en `public/compartido/`.
7. **Se revisa el clip**: hoja de contactos y cuentas por cuadro (`scripts/revisar.py`: parpadeos,
   cuadros vacíos, quietud final) y además mirar los cuadros a tamaño real.
8. **Se mide en la máquina real** donde corrió, y se dice cuál. Nada se atribuye a una máquina que
   no se usó.

## Organización

```
laboratorio/
├── README.md                 ← este archivo: reglas, resultados, cómo reproducir
├── remotion/                 ← entrada propia de Remotion (no toca src/index.ts ni los episodios)
│   ├── index.ts  Root.tsx    ← registra las muestras (carpeta «laboratorio» del Studio)
│   └── comun.ts              ← 5 s, 1920×1080, 30 fps, paleta
├── muestras/NN-nombre/       ← código + INFORME.md de cada muestra
├── scripts/
│   ├── medir.py              ← corre un render y registra tiempo, CPU, memoria, máquina, versiones, salida
│   ├── revisar.py            ← hoja de contactos y cuentas por cuadro
│   ├── manim.sh              ← render de la muestra 01 (previa | final)
│   ├── remotion.sh           ← render de una muestra de Remotion (previa | final)
│   ├── carrete.sh            ← une las cinco finales en out/tanda-1.mp4 (25 s)
│   └── todo.sh               ← todo lo anterior, en orden
├── resultados/NN-nombre/     ← EN GIT: previa.json, final.json, revision.json, hoja.jpg
└── out/                      ← FUERA DE GIT: los MP4
```

Las muestras importan piezas del canal (`Papel`, `MapaLugar`, `Ficha`, `trazoManuscrito`, `tramo`,
`azar`…) pero nada del canal importa al laboratorio: borrar `laboratorio/` no rompe ningún episodio.
Las dependencias nuevas (`three`, `@react-three/fiber`, `@react-three/drei`, `@remotion/three`,
`roughjs`, `p5`) están en `package.json` con versión exacta.

## Dónde están los MP4 y cómo obtenerlos

Los MP4 **no van a git** (regla 1.1·5 del canal: `out/` está en `.gitignore`). En git queda la
evidencia liviana: la hoja de contactos (`resultados/*/hoja.jpg`, ~60–200 kB) y los registros JSON.
Para tener los clips:

```bash
cd historia
npm ci
```

```bash
python3 -m venv ~/.venvs/manim && ~/.venvs/manim/bin/pip install -r laboratorio/muestras/01-monedas-manim/requirements.txt
```

```bash
LAB_MAQUINA="laptop Huawei i7-11370H" MANIM_PY=~/.venvs/manim/bin/python ./laboratorio/scripts/todo.sh
```

Quedan en `historia/laboratorio/out/<muestra>/{previa,final}.mp4` y el carrete en
`historia/laboratorio/out/tanda-1.mp4`. Una sola muestra: `./laboratorio/scripts/remotion.sh
04-libro-3d final` o `./laboratorio/scripts/manim.sh final`. En el Studio:
`npx remotion studio laboratorio/remotion/index.ts`.

Manim necesita Pango y Cairo del sistema para compilar `manimpango` (en Ubuntu:
`libpango1.0-dev`, `libcairo2-dev`, `pkg-config`); en Windows y macOS hay ruedas precompiladas.

Los MP4 de esta tanda también se entregaron en la conversación de trabajo; si se quieren
compartidos, el lugar natural es una *release* de GitHub o una carpeta de Drive, enlazada desde el
roadmap (`evidencia`).

## Resultados de la tanda 1

Medidos el 2026-11-03 en un **contenedor en la nube** (sesión de Claude Code): Intel Xeon 2,1 GHz,
4 hilos visibles, 15,7 GB de RAM, **sin GPU**, Linux. Remotion con 4 hilos de render
(`remotion.config.ts`). **No** es la laptop de render ni la PC objetivo: hay que volver a medir allá.

| # | Muestra | Herramienta | Cuadros | Previa | Final (pared) | Pico de memoria (final) | MP4 final |
|---|---|---|---|---|---|---|---|
| 01 | [Diez monedas → 30 %](muestras/01-monedas-manim/INFORME.md) | Manim 0.22.1 | 150 | 2,8 s (854×480, 15 fps) | **5,6 s** | 0,5 GB | 0,33 MB (con sonido) |
| 02 | [Cordillera, lago y barco en tinta](muestras/02-cordillera-tinta/INFORME.md) | SVG + Rough.js 4.6.6 | 150 | 14,6 s (960×540) | **19,2 s** | 2,8 GB | 0,74 MB |
| 03 | [Viento sobre el lago](muestras/03-viento-p5/INFORME.md) | p5.js 2.3.4 | 150 | 18,4 s (960×540) | **22,8 s** | 4,0 GB | 5,07 MB |
| 04 | [Libro 3D que se abre](muestras/04-libro-3d/INFORME.md) | Three.js 0.187 + R3F 9.8 + drei 10.7 | 150 | 64,8 s (960×540) | **69,8 s** | 3,3 GB | 1,82 MB |
| 05 | [Mapa y documento → explicación](muestras/05-mapa-documento/INFORME.md) | Remotion 4.0.539 | 150 | 19,0 s (960×540) | **24,8 s** | 3,8 GB | 1,08 MB |

Cómo leer la tabla:

- **Pared** = tiempo del comando completo. En Remotion incluye el empaquetado con webpack: **el
  primer render en frío tardó 90,5 s** (muestra 02, previa) y los siguientes usan la caché.
- **Memoria** = suma del RSS del árbol de procesos, muestreada cada 0,25 s (Chrome abre varios
  procesos; el pico real puede ser algo mayor).
- **CPU** (en los JSON) solo cuenta los procesos hijos que terminaron y fueron esperados: en
  Remotion subestima, porque no siempre alcanza a los procesos de Chrome. Usar la pared.
- La **previa a media escala** casi no ahorra en Remotion (02: 14,6 → 19,2 s; 04: 64,8 → 69,8 s):
  el costo está en dibujar cada cuadro, no en codificar. Para revisar ritmo sale más barato el
  Studio o renderizar un tramo (`--frames=60-90`). En Manim la previa sí rinde (2×).
- La 04 es la cara: **≈ 0,47 s por cuadro** sin GPU (WebGL por software, con sombras). Es la que
  más puede cambiar con la RTX 5070; hay que medirla ahí.

Revisión automática de las finales (`resultados/*/revision.json`): **ningún parpadeo** detectado en
las cinco. Cuadros casi vacíos: la 01 arranca con 6 cuadros oscuros (0,2 s, las monedas entran
desde nada) y la 05 con uno (todo aparece con fundido). Las dos son decisiones, no fallas; en
montaje lo cubre un corte J.

### Tiempo y costo

| | Medido | Desconocido |
|---|---|---|
| **Render** | Por muestra, en la tabla de arriba y en `resultados/*/final.json`. | — |
| **Ejecución del agente** | Ventana total de la tanda: 01:09–01:48 UTC del 2026-11-03 (reloj del contenedor), incluidas las esperas de instalación (~10 min para compilar Manim). Por muestra, según las marcas de tiempo de archivos y registros: lectura e instalación 01:09–01:22; 01 → 01:25; 02 → 01:31; 03 → 01:35; 04 → 01:42; 05 → 01:46; documentación y roadmap desde 01:47. | Cuánto de cada ventana fue cómputo y cuánto espera. |
| **Tiempo humano** | — | Todo: Gerson todavía no revisó la tanda. Se anota en el roadmap cuando la revise. |
| **Tokens** | — | No se pueden leer desde la sesión. No se estiman. |

## Qué sigue

Ver el roadmap. En corto: Gerson revisa la tanda 1 (fase `t1-revision`); después la tanda 2
(PixiJS, Blender, QGIS) y las pruebas navales en piezas chicas (mar y balanceo; barco e
iluminación; fogonazo y humo), sin prometer calidad final antes de probar.
