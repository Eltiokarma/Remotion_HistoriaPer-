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
│   ├── todo.sh               ← previa y final de todas, revisión y carrete
│   ├── medir_tanda.sh        ← medición en frío y en caliente
│   ├── ci.sh                 ← lo que corre la CI (una pasada)
│   ├── comprobar_texturas.py ← mismo cuadro en frío y en caliente (texturas)
│   └── geometria_monedas.py  ← distancia entre monedas en vuelo y quietas (muestra 01)
├── resultados/NN-nombre/     ← EN GIT: final-frio/final-caliente/previa-caliente.json, revision.json, hoja.jpg, antes/, pendientes/
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

Sin instalar nada: el workflow `laboratorio` los renderiza en cada push al PR y los deja como
artefacto del run (14 días). Enlace del último run revisado en `INFORME_TECNICO.md` §1.5.

## Resultados de la tanda 1

Las medidas completas, con condiciones (frío/caliente), memoria por proceso, defectos corregidos y
pendientes y lo que está medido, observado, inferido o desconocido, están en
**[`INFORME_TECNICO.md`](INFORME_TECNICO.md)**. En corto:

- Las cinco salen con 150 cuadros a 1920×1080 y 30 fps, en este contenedor y en una máquina limpia de
  GitHub (workflow `laboratorio`, que además publica los MP4 como artefacto).
- Los tiempos son de escenas distintas: **no** son un ranking entre herramientas.
- Ninguna muestra está aprobada por Gerson todavía.

Archivos por muestra en `resultados/<muestra>/`: `final-frio.json`, `final-caliente.json`,
`previa-caliente.json` (con `scripts/medir_tanda.sh`), `revision.json`, `hoja.jpg`; `antes/` guarda
lo de la primera tanda; `pendientes/` los recortes de lo que falta.

## Tanda 2

- **06 · Tormenta sobre el lago (PixiJS)**, [informe](muestras/06-lluvia-pixi/INFORME.md). La versión 1
  (tinta, tres grises) la rechazó Gerson por plana; la versión 2 toma de sus referencias la escala de
  color de lejos a cerca, la bruma al pie de cada capa, la luz con dirección, el suelo que se aleja,
  el primer plano que enmarca y el agua que refleja. En el contenedor (sin GPU) tarda ~7× lo que la
  03 (p5): cuesta pintar píxeles a pantalla completa en un solo proceso GPU por software, no la
  cantidad de elementos.

## Qué sigue

Ver el roadmap. En corto: Gerson revisa la tanda 1 (fase `t1-revision`); después la tanda 2
(PixiJS, Blender, QGIS) y las pruebas navales en piezas chicas (mar y balanceo; barco e
iluminación; fogonazo y humo), sin prometer calidad final antes de probar.
