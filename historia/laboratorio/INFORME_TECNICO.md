# Informe técnico del laboratorio · tanda 1

Para que otro agente (o una persona) revise el laboratorio y se decidan los pasos siguientes con
evidencia. Fecha: 2026-11-03. Rama `claude/tender-gauss-dx3rfc`, PR
[Eltiokarma/Remotion_HistoriaPer-#1](https://github.com/Eltiokarma/Remotion_HistoriaPer-/pull/1).

**Etiquetas usadas en todo el informe**

| Etiqueta | Significa |
|---|---|
| **[medido]** | Sale de un instrumento con su registro en el repo (JSON, log, script). Se puede repetir. |
| **[observado]** | Lo vio el agente mirando cuadros o recortes. Queda la imagen, pero no hay una cuenta. |
| **[inferido]** | Se deduce de código, documentación o medidas, sin comprobarlo directamente. |
| **[desconocido]** | No se midió o no se puede medir desde aquí. No se estima. |

Los tiempos de render son de **escenas distintas**: no son un ranking de rendimiento entre
herramientas.

---

## 1. Estado y acceso

### 1.1 PR, commits y checks

- PR: <https://github.com/Eltiokarma/Remotion_HistoriaPer-/pull/1>, abierto, sin fusionar, `mergeable_state: clean` [medido, API de GitHub].
- Commit revisado al empezar esta revisión: `9cc5e00`. Sus checks: los 2 runs de `roadmap / comprobar` en verde [medido]. Era el único workflow: **no había CI de typecheck ni de render**.
- Esta revisión agrega commits. El SHA final y el resultado de sus checks están en §1.5.
- Comprobaciones locales sobre el último commit: `npm run typecheck` OK, `npm run validar` («Todo en orden») y `node roadmap/generar.mjs --comprobar` OK [medido].

### 1.2 Instalar, validar y regenerar

Desde la raíz del repo (Linux; en Windows y macOS Manim trae ruedas y no necesita los paquetes del sistema):

```bash
sudo apt-get install -y libpango1.0-dev libcairo2-dev pkg-config ffmpeg
```

```bash
cd historia && npm ci
```

```bash
python3.12 -m venv ~/.venvs/manim && ~/.venvs/manim/bin/pip install -r laboratorio/muestras/01-monedas-manim/requirements.txt && python3 -m pip install numpy pillow
```

```bash
npm run typecheck && npm run validar && node ../roadmap/generar.mjs --comprobar
```

Regenerar las cinco muestras y el carrete (una pasada):

```bash
LAB_MAQUINA="nombre de la máquina" MANIM_PY=~/.venvs/manim/bin/python ./laboratorio/scripts/ci.sh
```

Medir en frío y en caliente (lo que produjo las tablas de §2):

```bash
LAB_MAQUINA="nombre de la máquina" MANIM_PY=~/.venvs/manim/bin/python ./laboratorio/scripts/medir_tanda.sh
```

### 1.3 Dependencias y versiones [medido: `package.json`, `requirements.txt`, `resultados/*/final-caliente.json`]

| Pieza | Versión |
|---|---|
| Node | 22.23.4 (la CI usa 22) |
| Remotion, @remotion/three | 4.0.539 |
| Chrome Headless Shell (lo baja Remotion) | 157.0.8080.0 |
| three · @react-three/fiber · @react-three/drei | 0.187.0 · 9.8.2 · 10.7.9 |
| roughjs · p5 | 4.6.6 · 2.3.4 |
| Python para Manim | 3.12 (con 3.13 `manimpango` no instaló sin Pango del sistema) |
| manim · ManimPango · pycairo · av · numpy | 0.22.1 · 0.7.1 · 1.29.2 · 19.0.2 · 2.5.4 |
| Sistema | `libpango1.0-dev`, `libcairo2-dev`, `pkg-config`, ffmpeg 6.1.1 |
| Scripts de medida | Python 3 con numpy y pillow |

### 1.4 Dónde están los MP4

- **En este contenedor** (no accesibles desde afuera): `historia/laboratorio/out/<muestra>/final.mp4`,
  `out/tanda-1.mp4` (carrete de 25 s) y `out/antes/` (las versiones anteriores, para comparar).
- **Enlaces accesibles:** el workflow `laboratorio` los renderiza en una máquina limpia de GitHub y
  los publica como **artefacto del run** (14 días). El repo ya es **público** y los clips salen del
  código que está en él: no se publica nada privado ni se cambiaron permisos. Bajar un artefacto
  pide una sesión iniciada en GitHub. Enlace en §1.5.
- En git solo hay evidencia liviana: hojas de contactos, recortes y JSON (regla 1.1·5 del canal).

### 1.5 Resultado de la CI y artefactos

Run [`laboratorio` #1](https://github.com/Eltiokarma/Remotion_HistoriaPer-/actions/runs/41566067394)
sobre el commit `fe4826b`: **éxito** (typecheck, validar, render de las cinco, revisión, carrete) en
3 min 22 s, de los que el render fueron 2 min 8 s [medido, API de GitHub].

- **Artefacto** `laboratorio-tanda-1` (16,9 MB, sha256 `d49896f1…14f0dc`, vence el 2026-11-17):
  <https://github.com/Eltiokarma/Remotion_HistoriaPer-/actions/runs/41566067394/artifacts/13199232142>.
  Trae los cinco `out/<muestra>/final.mp4`, el carrete `out/tanda-1.mp4`, los registros y las hojas.
- Verificado al bajarlo [medido]: las cinco con 1920×1080, 30/1 y 150 cuadros; el carrete con 750.
- Máquina de la CI [medido]: AMD EPYC 9V45, 4 hilos, 15,6 GB, sin GPU. WebGL también por SwiftShader.
- Tiempos en la CI (una pasada, **otra máquina**, no comparables con §2.1): 01 3,6 s · 02 27,3 s
  (incluye bajar el navegador y empaquetar en frío: fue el primer render de Remotion del job) ·
  03 15,8 s · 04 50,0 s · 05 15,0 s.
- Los commits posteriores a `fe4826b` solo cambian documentación y una línea de registro de la 04.
  Cada push al PR vuelve a correr el workflow y deja su propio artefacto.

---

## 2. Resultados por muestra

Todas: **1920×1080, 30 fps, 150 cuadros, 5,0 s** [medido: ffprobe contando cuadros, en
`resultados/<m>/final-caliente.json` → `salida`]. La 01 dura 4,9997 s en el contenedor MP4 por el
redondeo del audio AAC; tiene 150 cuadros.

**Condiciones de medida** (`scripts/medir_tanda.sh`, contenedor sin otra carga):
- **frío**: Remotion con la caché de webpack borrada (`node_modules/.cache`) y el navegador ya
  descargado; Manim con la carpeta de medios y `__pycache__` borrados.
- **caliente**: el mismo comando repetido enseguida.
- La **«primera vez absoluta»** (bajar Chrome Headless Shell + empaquetar) es otra condición: el
  primer render de la sesión tardó 90,5 s; repetida después con el navegador borrado, 30 s
  (render de 16 cuadros a media escala). Depende de la red [medido, ver §4.4].

**Comando y configuración de render**
- Remotion: `npx remotion render laboratorio/remotion/index.ts lab-<muestra> <salida>`, con
  `remotion.config.ts`: concurrencia 4, imágenes JPEG intermedias, H.264 (por defecto). Previa:
  `--scale 0.5 --jpeg-quality 70`. Sin `--gl`: el valor por defecto dio ANGLE + SwiftShader [medido].
- Manim: `python -m manim render --resolution 1920,1080 --frame_rate 30 --disable_caching`; previa: `-ql` (854×480, 15 fps).

### 2.1 Tiempos y memoria [medido]

| # | Muestra | Final frío | Final caliente | Previa (caliente) | Pico PSS final caliente | Detalle del pico (PSS) |
|---|---|---|---|---|---|---|
| 01 | Monedas (Manim) | 5,9 s | 5,6 s | 2,8 s (854×480, 15 fps) | 0,51 GB | Python 0,51 |
| 02 | Tinta (SVG + Rough.js) | 41,7 s | 25,3 s | 15,2 s | 2,54 GB | Chrome 1,13 · Node 0,83 · ffmpeg 0,53 |
| 03 | Viento (p5.js) | 40,9 s | 22,3 s | 18,2 s | 3,65 GB | Chrome 2,23 · Node 0,83 · ffmpeg 0,54 |
| 04 | Libro 3D (Three.js) | 86,8 s ¹ | 68,9 · 69,5 · 72,4 s ² | 67,5 s ¹ | 2,28–2,76 GB | Chrome 1,50 · ffmpeg 0,54 · Node 0,19–0,66 |
| 05 | Mapa y documento (Remotion) | 38,0 s | 22,1 s | 19,9 s | 2,71 GB | Chrome 1,28 · Node 0,83 · ffmpeg 0,55 |

¹ Antes de la corrección del libro vacío (§2.2); el arreglo no cambia el trabajo por cuadro [inferido].
² Tres corridas después de la corrección (`final-caliente-{1,2,3}.json`).

- **Variación entre corridas** [medido]: la 02 en caliente dio 19,2 s en la primera tanda y 25,3 s
  ahora. La 04, 68,9–72,4 s en tres corridas seguidas. Es un contenedor compartido: tomar los números
  con ±25 %.
- **Memoria**: suma de PSS del árbol de procesos del comando (npx/node con webpack, Chrome Headless
  Shell y sus 8 procesos, ffmpeg; en Manim, Python), muestreada cada 0,25 s desde
  `/proc/<pid>/smaps_rollup`. PSS reparte la memoria compartida. El RSS también se registra y da
  0,7–0,8 GB más, porque cuenta en cada proceso de Chrome lo que comparten. Un pico más corto que
  0,25 s se puede perder.
- **Frío contra caliente**: la diferencia (≈ 16–19 s en las de Remotion) es el empaquetado de webpack;
  en frío Node sube a ~1,2–1,4 GB [medido].

### 2.2 Defectos y estado

| # | Corregidos (con evidencia antes/después) | Pendientes | Render técnico | Revisión visual del agente | Aprobado por Gerson |
|---|---|---|---|---|---|
| 01 | Duración 5,13 s → 5,00 s; monedas que se cruzaban; «sopa» de glifos 3/10→30 %; **monedas en vuelo sobre las quietas** (ver abajo) | 6 cuadros oscuros al inicio (decisión, no falla); el rótulo «DIEZ MONEDAS» puede repetir la voz | correcto | hoja de contactos + recortes 48–74 | **no** |
| 02 | Textura de papel en el cuadro 0 (prevención, §6.2); montañas de triángulos; sierra del fondo vista a través; agua sobre la vela; **rayado que excedía la ladera** ([antes](resultados/02-cordillera-tinta/antes/rayado-ladera.jpg) / [después](resultados/02-cordillera-tinta/despues-rayado-ladera.jpg)) | barco esquemático ([recorte](resultados/02-cordillera-tinta/pendientes/barco-esquematico.jpg)); la tapa podría ir delante de la pluma (inferido del código, **no observado**) | correcto | hoja + recortes del último cuadro y del 40 | **no** |
| 03 | Partículas que salían; amontonamiento; rayas de historieta | agua pareja sin profundidad ([recorte](resultados/03-viento-p5/pendientes/agua-pareja.jpg)); el viento no tiene forma | correcto | hoja + cuadro de 2,3 s a tamaño real | **no** |
| 04 | UV de la tapa; hoja que desaparecía (geometría que se deformaba entre cuadros); hoja bajo la guarda; **libro ausente en los cuadros 0 y 3** ([antes](resultados/04-libro-3d/antes/parpadeo-cuadros-0-5.jpg) / [después](resultados/04-libro-3d/despues-cuadros-0-5.jpg)) | estética de «render 3D», no de grabado; **franja negra en el lomo** ([recorte](resultados/04-libro-3d/pendientes/franja-negra-lomo-y-estetica.jpg)); dorso espejado; `ContactShadows` invisible; el parpadeo era intermitente: 3 renders limpios no lo descartan | correcto en 3 de 3 desde el arreglo | hoja + cuadros 0–5 + último cuadro | **no** |
| 05 | Ficha que nombraba un lago ausente; línea que tachaba el texto; zoom sin contexto | el mapa no tiene lagos ([recorte](resultados/05-mapa-documento/pendientes/mapa-sin-lagos.jpg)); prueba composición y transiciones, **no** que el párrafo se entienda en 5 s | correcto | hoja + último cuadro | **no** |

«Render técnico correcto» = 150 cuadros a 1920×1080 y 30 fps, sin parpadeos globales ni locales y sin
cuadros vacíos fuera de los fundidos de entrada declarados [medido, `resultados/<m>/revision.json`].
«Revisión visual del agente» = lo que se miró, no el clip entero cuadro a cuadro [observado].
Ninguna muestra está aprobada por Gerson.

### 2.3 La contradicción de las monedas, aclarada

- **Primer arreglo (tanda 1):** las tres monedas en vuelo se cruzaban **entre sí**. Se corrigió
  cambiando el orden de salida (primero la de más a la derecha).
- **Lo que quedó y reporté mal:** con `path_arc=-0.6` el arco subía por encima de la fila de arriba
  y las monedas en vuelo pasaban **sobre las que se quedan**. Lo llamé «roce de 2–3 cuadros». La
  geometría dice otra cosa [medido con `scripts/geometria_monedas.py`, que usa la misma trayectoria
  de Manim]: distancia mínima entre centros de **0,71 y 0,76** para dos de las tres monedas (se
  tocan por debajo de 1,0). Es un solape de hasta 0,29 unidades, unos 39 px a 1080p, visible en los
  cuadros ~56–62 ([antes](resultados/01-monedas-manim/antes/roce-cuadros-56-63.jpg)).
- **Ahora:** `path_arc=0.7`, el arco va por debajo. Distancia mínima **1,10** para las tres
  [medido]: no se tocan ([después](resultados/01-monedas-manim/despues-cuadros-56-63.jpg)).

---

## 3. Calidad visual

### 3.1 El revisor automático (`scripts/revisar.py`)

- **Entrada**: todos los cuadros del MP4, convertidos a gris de 320×180.
- **Parpadeo global**: el cuadro *i* se marca si su diferencia media con *i−1* y con *i+1* supera 4
  (en 0–255) y además es más de 4× la diferencia entre *i−1* e *i+1*. Es decir: aparece y desaparece
  en un cuadro mientras los vecinos se parecen.
- **Parpadeo local** (agregado en esta revisión): la misma regla, por zona de una rejilla de 8×8
  (40×22 px), con umbral 10. Se agregó porque **el global no vio el libro ausente del cuadro 3** de
  la 04: el libro ocupa poca pantalla y el promedio no llegaba a 4. El local sí lo marcó (salto 17,2)
  [medido, `resultados/04-libro-3d/antes/revision-con-parpadeo.json`].
- **Falso positivo conocido del local**: movimiento rápido. Marca los cuadros 59 y 61 de la 01 porque
  una moneda cruza una zona en un solo cuadro (~70 px/cuadro). Se revisaron los cuadros 58–62: es
  movimiento, no defecto [observado].
- **Cuadro vacío**: desviación estándar < 2 (negro o color plano).
- **Quietud final**: cambio medio del último segundo.
- **Hoja de contactos**: 12 cuadros, 1 cada 12 (0,4 s).
- **Lo que no ve**: el primer y el último cuadro como parpadeo (no tienen dos vecinos); defectos de 2
  cuadros o más; cambios de color o de forma con el mismo brillo; solapes, textos mal escritos o
  contenido equivocado. Las monedas superpuestas, la franja del lomo y el mapa sin lagos los vio
  una persona, no el revisor.

### 3.2 Qué significa «sin parpadeos»

Que el clip **pasó el detector**, no que alguien lo miró entero cuadro a cuadro. La revisión visual
del agente fue sobre hojas de contactos (12 cuadros por muestra) y recortes en los tramos de
movimiento. En la primera tanda «sin parpadeos» se dijo solo por el detector global, que tenía el
punto ciego de §3.1.

### 3.3 Hojas de contactos (después de las correcciones)

[01](resultados/01-monedas-manim/hoja.jpg) · [02](resultados/02-cordillera-tinta/hoja.jpg) ·
[03](resultados/03-viento-p5/hoja.jpg) · [04](resultados/04-libro-3d/hoja.jpg) ·
[05](resultados/05-mapa-documento/hoja.jpg). Las anteriores están en `resultados/<m>/antes/hoja.jpg`.
Recortes de pendientes: `resultados/<m>/pendientes/`.

### 3.4 Lo que la 05 no demuestra

Demuestra composición, orden y transiciones con piezas del canal [observado]. **No** demuestra que
un párrafo educativo se entienda en 5 s: no tiene voz y nadie la vio para responder qué entendió
[desconocido]. Para medirlo hace falta la voz de Gerson y al menos una persona que no conozca el
guion y diga, después de verla, qué explicó.

---

## 4. Rendimiento

### 4.1 El entorno real [medido salvo indicación]

- Contenedor en la nube de Claude Code (sesión `session_01WwsfbV8MJXu3bQ5WqkWsJX`). CPU «Intel Xeon
  Processor @ 2.10GHz», 4 hilos visibles, AVX2 y AVX-512; 15,7 GB de RAM; **sin GPU** (`nvidia-smi` no
  existe); Linux 6.18.
- Límites del contenedor: no hay `cpu.max` ni `memory.max` legibles en `/sys/fs/cgroup`, así que el
  límite real de CPU y RAM es **[desconocido]**. Hay un cupo de disco por sesión que no muestra `df`.
  Es una máquina compartida: la variación de §2.1 sale de ahí [inferido].
- **No es** la laptop de render (i7-11370H, Iris Xe, 16 GB) **ni** la PC objetivo (Ryzen 7 9700X,
  RTX 5070 12 GB). Nada de esto se traslada a esas máquinas.
- La CI usa otra máquina: runner `ubuntu-24.04` de GitHub. Sus números quedan en el artefacto con su
  nombre y no se mezclan con estos.

### 4.2 Backend gráfico de Three.js [medido]

Cada pestaña registra, al crear el lienzo (`console.warn` de la muestra 04, en
`out/04-libro-3d/*.log` y en `registro_destacado` de los JSON):

```
WebGL: Google Inc. (Google) | ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver) | WebGL 2.0 (OpenGL ES 3.0 Chromium) | búfer 1920×1080 | dpr 1
```

Es **render por software**: ANGLE sobre Vulkan sobre SwiftShader. Three.js avisa además que
`PCFSoftShadowMap` ya no existe en 0.187 y usa `PCFShadowMap` (sombras más duras que las pedidas).

### 4.3 ¿Mejoraría la RTX 5070 la muestra 04?

- **Evidencia que hay**: la 04 dibuja por software [medido]. En caliente tarda ~70 s, contra ~22–25 s
  de las muestras SVG con la misma tubería (Chrome + captura + ffmpeg) [medido]. Si esa tubería cuesta
  parecido en todas, unos 45 s son de dibujar el 3D [inferido].
- **Evidencia que falta**: ningún render con GPU. Además, Remotion en Linux sin `--gl` usa SwiftShader
  aunque haya GPU; habría que pasar `--gl=angle` o `--gl=vulkan` y comprobar en el registro que el
  backend cambió [inferido de lo medido aquí; sin probar con GPU].
- **Conclusión: hipótesis.** Una GPU podría bajar a lo sumo esos ~45 s; los ~25 s de captura y
  codificación seguirían. Se decide midiendo en la PC con el mismo registro de backend.

### 4.4 La memoria de p5 («4 GB»)

- El «4 GB» del primer informe (4 036 MB) era la **suma de RSS** del árbol: incluía Node (CLI de
  Remotion y webpack), Chrome Headless Shell con sus 8 procesos y ffmpeg. RSS cuenta varias veces la
  memoria compartida entre los procesos de Chrome.
- Medido ahora con PSS: **3,65 GB en caliente** (Chrome 2,23 · Node 0,83 · ffmpeg 0,54) y **4,28 GB
  en frío** (Node sube a 1,41 por webpack).
- Chrome usa ~2,2 GB en la 03 contra 1,1–1,5 GB en las otras [medido]. Que se deba a la simulación
  precalculada en cada una de las 4 pestañas más un lienzo de p5 de 1920×1080 por pestaña es
  **hipótesis** [inferido del código].

### 4.5 La previa a media escala: ahorro real y posibles causas

| Muestra | Final caliente | Previa caliente | Ahorro |
|---|---|---|---|
| 02 (primera tanda) | 19,2 s | 14,6 s | 24 % |
| 02 (esta revisión) | 25,3 s | 15,2 s | 40 % |
| 04 (primera tanda) | 69,8 s | 64,8 s | 7 % |
| 04 (esta revisión) | 69,8 s ¹ | 67,5 s ¹ | 3 % |

[medido; ¹ antes del arreglo del libro, ver §2.1]. Posibles causas, **no demostradas** salvo la
primera:

1. **En la 04 el WebGL no se achica.** Con `--scale 0.5` el búfer sigue en **1920×1080 con dpr 1**
   [medido]. React Three Fiber limita el dpr a un mínimo de 1 (`dpr` por defecto `[1, 2]`) [inferido
   de su documentación]: solo se achica la captura, no el dibujo. Lo mismo pasaría en la 03, donde p5
   fija `pixelDensity(1)` [inferido del código].
2. En la 02 el SVG sí se rasteriza a menor tamaño. Lo que queda (pestañas, filtros SVG, captura,
   codificación) no depende tanto de los píxeles [hipótesis].
3. La variación entre corridas (§2.1) se come buena parte de la diferencia [medido que existe; su
   peso en este caso, desconocido].

Para una previa barata de verdad: el Studio, un tramo (`--frames=60-90`), o en las de WebGL, un
`dpr` explícito menor que 1 en el lienzo [propuesta, sin probar].

---

## 5. Consumo del agente

### 5.1 Qué hay y de dónde sale

- **Modelo y esfuerzo** [medido, `get_session`]: `claude-opus-5-5`, último modelo servido
  `claude-opus-5-5`, esfuerzo `medium`, modo de permisos `auto`, Claude Code 2.1.316.
- **Tokens y llamadas** [medido]: el registro local de la sesión
  (`~/.claude/projects/.../<sesión>.jsonl`, fuera del repo) trae el `usage` de **cada llamada al
  modelo** con su hora. El script que lo resume suma por llamada única (deduplica por id de mensaje).
- **Total de la plataforma** [medido, `get_session.usage`]: es otra fuente. Se usa para contrastar.
- **[desconocido]**: tokens de razonamiento por separado (vienen dentro de los de salida);
  reintentos de la API (el registro no los muestra); el cupo real de la suscripción consumido.

### 5.2 Totales (ver la tabla final de §8 para el cierre de la sesión)

Los números de la sesión completa al cierre de esta revisión están en §8.2. Primera tanda (turno 1,
01:08–01:58 UTC, desde el registro local):

| | Llamadas | Entrada sin caché | Salida (incl. razonamiento) | Lectura de caché | Escritura de caché | Errores de herramienta |
|---|---|---|---|---|---|---|
| Turno 1 | 101 | 192 | 123 918 | 18 622 937 | 245 961 | 4 |

Por ventana de tiempo dentro del turno 1. Las ventanas las fijé yo con las marcas de tiempo de los
archivos de cada muestra; **mezclan trabajo común**: la de la 02 incluye crear la entrada de Remotion
y `remotion.sh`, la de la 03 incluye `revisar.py`. Los tokens son de llamadas reales, no
reconstruidos:

| Ventana (UTC) | Contenido | Llamadas | Salida | Lectura caché | Escritura caché |
|---|---|---|---|---|---|
| 01:08–01:14 | lectura del repo + instalación | 10 | 5 166 | 868 230 | 49 346 |
| 01:14–01:25 | muestra 01 (incluye instalar Manim y `medir.py`) | 29 | 21 756 | 3 871 421 | 56 811 |
| 01:25–01:32 | muestra 02 + infraestructura de Remotion | 17 | 19 415 | 2 942 311 | 36 441 |
| 01:32–01:35 | muestra 03 + `revisar.py` | 9 | 10 555 | 1 810 253 | 16 668 |
| 01:35–01:42 | muestra 04 | 9 | 15 965 | 1 978 197 | 20 554 |
| 01:42–01:46 | muestra 05 | 7 | 7 976 | 1 663 117 | 15 324 |
| 01:46–01:58 | documentación, roadmap, PR | 20 | 43 085 | 5 489 408 | 50 817 |

### 5.3 Costo API equivalente

Tarifas de `claude-opus-5-5` por millón de tokens [documentación de la API, tabla del 2026-10-06]:
entrada $4,00 · salida $20,00 · lectura de caché $0,20 · escritura de caché 1,25× la entrada
($5,00) con TTL de 5 min o 2× ($8,00) con TTL de 1 h.

```
costo = (entrada·4 + salida·20 + lectura_caché·0,20 + escritura_caché·p) / 1 000 000,  p = 5 u 8
```

Turno 1: con p = 8, **$8,17**; con p = 5, $7,43. La plataforma reportaba **$8,17** para la sesión en
ese momento [medido]. Que coincida con p = 8 sugiere caché de 1 h [inferido]. Es un **equivalente de
API**, no lo que se cobró en la suscripción: el consumo del cupo no se puede leer desde aquí y no se
convierte en «videos por suscripción».

### 5.4 Tiempo

- **Agente** [medido, marcas de tiempo del registro]: turno 1 de 01:08:50 a 01:58 UTC. Turno 2 en §8.2.
  Incluye esperas (instalar Manim, renders en segundo plano), así que no es tiempo de cómputo del
  modelo.
- **Humano** [desconocido]: el tiempo de Gerson escribiendo los pedidos y revisando no se registra.

---

## 6. Roadmap y riesgos

### 6.1 Pendientes y dependencias reales

Fuente única: [`roadmap/roadmap.json`](../../roadmap/roadmap.json) → [`ROADMAP.md`](../../ROADMAP.md),
comprobado en CI (`roadmap / comprobar`) y por `node roadmap/generar.mjs --comprobar` [medido]. El
validador ya atrapó un error real en esta revisión: evidencia que se había movido.

- `t1-revision` (Gerson aprueba o no cada muestra) ← depende de las cinco muestras: **listo para
  empezar**.
- `f5-laptop` (repetir con `medir_tanda.sh` en la laptop) ← lo corre Gerson; no depende de nada más.
- Tanda 2 (`t2-*`) y naval (`n*`) ← dependen de `t1-revision`. **No se empezó** (pedido explícito).
- `f5-pc`, `t4-houdini-prueba`, `t4-unreal-prueba` ← bloqueados por la PC objetivo.

Las fechas con origen «propuesta» las propuso el agente y **no son compromisos**: ninguna está
aprobada. `ROADMAP.md` las marca «(propuesta)» en el Gantt.

### 6.2 El caso «Papel»

- **Qué se vio** [observado, una vez]: el cuadro 0 del primer render de la 02 salió con el papel liso,
  sin fibra.
- **Qué lo comparte** [medido con grep]: texturas pintadas como fondo CSS en `Papel`, `Atmosfera`
  (el grano, en **todos** los episodios por `VideoLargo`), `Pizarra`, `Piscina`, `LibroHojeable`,
  `Carpeta` y `PortadaLibro`, y como `<image>` de SVG en `PatronPapel`. Remotion espera a `<Img>`,
  pero no a esas imágenes [inferido de cómo funciona Remotion; coherente con lo visto].
- **Reproducción** [medido, `resultados/infra-texturas/`]: **no se reprodujo** en 6 intentos con la
  muestra 02 sin el arreglo: 3 renders en caliente, 2 con la caché de webpack vacía y 1 con el
  navegador recién descargado. Tampoco en 7 escenas del episodio 001 (cuadro 45) ni en 3 (cuadro 0).
  El método `still` en frío contra `render` en caliente da 0,0 de diferencia en todos los casos,
  incluso sin arreglo: **no es una prueba capaz de atrapar el defecto**, solo de detectar regresiones.
- **Corrección aplicada** (preventiva): `src/components/atmosfera/PrecargaTexturas.tsx` pide todas
  las texturas con `<Img>` en cada cuadro, en `VideoLargo` (episodios y catálogo) y en cada muestra.
  Comprobado que **no cambia la imagen**: diferencia máxima 0 en dos escenas del 001
  (`resultados/infra-texturas/sin-cambio-de-imagen.json`).
- **Cómo comprobarla de verdad**: hace falta reproducir el defecto primero. Lo más parecido al
  original es el primer render en una máquina nueva (laptop o CI) de la 02 en una versión sin
  precarga, repetido N veces con `revisar.py` (cuadros vacíos y parpadeo local en el cuadro 0).
  Riesgo aceptado mientras tanto: si la causa es otra, la precarga no la cubre.

### 6.3 Houdini y Unreal: qué avanza sin la PC objetivo

| Tarea | ¿Necesita la PC? | Por qué |
|---|---|---|
| Houdini: decidir licencia (Apprentice no comercial; Indie de pago) | no | es lectura de términos |
| Houdini: receta de humo de cañón (parámetros, resolución, duración) | no | diseño |
| Houdini: prueba chica de pyro por CPU en la laptop | no necesariamente | el solver pyro corre en CPU [inferido; sin probar]; lo instala Gerson |
| Houdini: simulación al tamaño final | sí, o una máquina con más RAM | memoria y tiempo [inferido] |
| Unreal: revisar la EULA para contenido lineal | no | lectura |
| Unreal: guion del plano y lista de assets con licencia (Fab/Quixel) | no | planificación |
| Unreal: cualquier render | sí (GPU compatible) | el render práctico necesita GPU [inferido]; en este contenedor no hay |

En el roadmap quedan separadas: `t4-*-preparar` (pendiente, sin PC) y `t4-*-prueba` (bloqueada).

---

## 7. Cierre de esta tanda

| Prioridad | Hecho | Evidencia |
|---|---|---|
| 1. Checks y fallos de la entrega | checks en verde; CI de render agregada; roadmap con rutas de evidencia corregidas | §1.1, §1.5 |
| 2. Problema compartido de «Papel» | precarga común aplicada; no cambia la imagen; el defecto no se pudo reproducir para validarla | §6.2 |
| 3. Monedas y rayado | corregidos y medidos | §2.2, §2.3 |
| 3b. (encontrado en la revisión) Libro ausente en cuadros 0 y 3 | corregido; 3 de 3 limpios | §2.2 |
| 4. Listas para que Gerson apruebe | sí, con la hoja de §8.3 | §8.3 |

No se fusionó el PR y no se empezó la tanda 2.

---

## 8. Resumen para decidir

### 8.1 Qué está demostrado · qué es hipótesis

**Demostrado [medido]**
- Las cinco herramientas producen clips de exactamente 150 cuadros a 1920×1080 y 30 fps desde código
  versionado, con azar con semilla. Se reproducen en una máquina limpia: ver §1.5.
- Manim se ata a beats en cuadros exactos (después de compensar su redondeo).
- Rough.js con semilla da un trazo estable: el último segundo de la 02 cambia 0,023 en promedio
  (0–255).
- Three.js funciona dentro de Remotion por software (SwiftShader), a ~0,46 s por cuadro en este
  contenedor.
- La precarga de texturas no cambia la imagen de los episodios.

**Hipótesis o sin demostrar**
- Que una GPU acelere la 04, y cuánto.
- Que la memoria extra de la 03 venga de la simulación por pestaña.
- La causa del papel sin textura, y que la precarga lo evite.
- Que el libro ya no falte nunca (3 renders limpios no bastan para un defecto intermitente).
- Que la 05 enseñe algo en 5 s.
- Cualquier número en la laptop o en la PC objetivo.

### 8.2 Consumo al cierre

Registro local de la sesión, por llamada, hasta las **02:31:10 UTC** [medido]. Las últimas llamadas
(commit, push y respuesta final) quedan fuera. El total de la plataforma (`get_session.usage`) se
actualiza al terminar cada turno: durante este turno seguía mostrando el del turno 1 (que coincide
exactamente con el registro local). El total definitivo se lee ahí después.

| | Ventana (UTC) | Llamadas | Entrada sin caché | Salida (incl. razonamiento) | Lectura de caché | Escritura de caché | Errores de herramienta |
|---|---|---|---|---|---|---|---|
| Turno 1: laboratorio, muestras, docs, PR | 01:08:50–01:58 | 101 | 192 | 123 918 | 18 622 937 | 245 961 | 4 |
| Turno 2: esta revisión técnica | 01:58–02:31:10 | 59 | 118 | 79 921 | 22 539 239 | 190 610 | 1 |
| **Sesión** | | **160** | **310** | **203 839** | **41 162 176** | **436 571** | **5** |

El turno 2 no se reparte por tarea: hizo verificación, correcciones y documentación mezcladas.
Cualquier reparto sería inventado.

Costo API equivalente (fórmula de §5.3) [calculado de lo medido]:

| | p = 8 (caché de 1 h, coincide con la plataforma en el turno 1) | p = 5 (caché de 5 min) |
|---|---|---|
| Turno 1 | $8,17 | $7,43 |
| Turno 2 (hasta 02:31) | $7,63 | $7,06 |
| Sesión (hasta 02:31) | **$15,80** | $14,49 |

La lectura de caché es la mayor parte del costo (~52 % con p = 8): cada llamada vuelve a leer el
contexto acumulado. Por eso el costo crece con la duración de la sesión más que con el código
escrito [inferido de la fórmula]. Herramientas usadas: 121 Bash, 28 Read, 13 Write, 11 llamadas a
GitHub y a la sesión, 1 Skill [medido].

### 8.3 Qué tiene que revisar Gerson

Por muestra: ¿sirve para el canal? ¿para qué escena? ¿qué cambiaría? Usar los MP4 del artefacto de
§1.5 o el carrete. En particular:

1. **01**: ¿el rótulo «DIEZ MONEDAS» sobra si la voz lo dice? ¿Le molestan los 0,2 s oscuros al
   inicio?
2. **02**: ¿el trazo se siente de pluma o de computadora? ¿El barco es aceptable como dibujo?
3. **03**: ¿se lee viento sobre el lago? ¿El agua necesita más trabajo o la muestra se descarta?
4. **04**: la pregunta abierta: ¿el 3D cabe en el canal así, o solo con un acabado de grabado
   (tarea `t2-toon`)? ¿Se nota la franja negra del lomo?
5. **05**: ¿es el estándar contra el que se juzga lo demás?

Y de planificación: confirmar o cambiar las fechas propuestas del roadmap.

### 8.4 Qué falta para estimar costo y producción mensual

- Tiempo humano por video: guion, grabación de voz, revisión. **No hay ninguna medida.**
- Cuántos segundos de cada tipo de escena tiene un episodio real: la mezcla Manim/SVG/3D decide el
  render.
- Render en la máquina real (`f5-laptop`) y, si se compra, en la PC (`f5-pc`), con el mismo
  `medir_tanda.sh`.
- Consumo del agente **por video completo**, no por muestra de 5 s: un episodio tiene otra forma de
  trabajo (guion, escaleta, revisiones).
- El cupo real de la suscripción que consume una sesión. No se puede leer desde la sesión; lo sabe
  la cuenta. Sin eso no se puede calcular cuántos videos entran en un mes.
- Cuántas rondas de revisión pide Gerson por escena.
