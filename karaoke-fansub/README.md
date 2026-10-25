# Karaoke Fansub

Editor local para ponerle letra a tus clips (TikTok, YouTube Shorts) con **karaoke sílaba por sílaba** y **un color por personaje**, como los fansubs de anime de los 2000 hechos con Aegisub. Solo hace tres cosas: letra, tiempos y estilo.

- Corre en tu PC, sin internet y sin GPU: está pensado para laptops modestas.
- La vista previa usa **libass**, el mismo motor con el que ffmpeg quema la letra, así que lo que ves es exactamente lo que sale.
- Exporta el video final (también vertical 1080×1920), y los subtítulos `.ass` (se abren en Aegisub) y `.srt`.

Al abrirlo por primera vez aparece un **proyecto de ejemplo** (una canción inventada con tres personajes) que ya funciona: dale Play.

---

## Instalación en Windows (paso a paso)

### 1. Python

1. Entra a <https://www.python.org/downloads/> y descarga **Python 3.12** (o más nuevo).
2. Abre el instalador y **marca la casilla “Add python.exe to PATH”** antes de darle a *Install Now*. Si te la saltas, el programa no encontrará Python.

### 2. ffmpeg (para exportar el video)

Sin ffmpeg igual puedes escribir la letra, marcar tiempos y bajar el `.ass`; solo no podrás exportar el video.

1. Entra a <https://www.gyan.dev/ffmpeg/builds/> y descarga **`ffmpeg-release-essentials.zip`**.
2. Descomprímelo. Adentro hay una carpeta `bin` con `ffmpeg.exe` y `ffprobe.exe`.
3. La forma más fácil: crea la carpeta `karaoke-fansub\ffmpeg\` y copia **la carpeta `bin` completa** ahí dentro, para que quede `karaoke-fansub\ffmpeg\bin\ffmpeg.exe`. El programa la busca ahí primero.
   (Si prefieres, agrega esa carpeta `bin` al PATH de Windows; también funciona.)

### 3. Karaoke Fansub

1. Descarga este repositorio: en GitHub, botón verde **Code → Download ZIP**, y descomprímelo (o `git clone`).
2. Entra a la carpeta `karaoke-fansub` y haz **doble clic en `iniciar.bat`**.
3. La primera vez tarda uno o dos minutos: crea un entorno propio (`.venv`) e instala lo necesario. Las siguientes veces abre al toque.
4. Se abre el navegador con el editor. **No cierres la ventana negra** mientras lo usas: es el programa. Para salir, ciérrala.

> ¿Prefieres la consola? Dentro de `karaoke-fansub`: `python -m pip install -r requirements.txt` y luego `python run.py`.

### 4. (Opcional) Modo automático con Whisper

Transcribe videos hablados y alinea letras de canciones. Es aparte para que lo básico no dependa de él. Cierra el programa y, dentro de `karaoke-fansub`, ejecuta:

```
.venv\Scripts\python -m pip install -r requirements-whisper.txt
```

La primera vez que lo uses descargará el modelo elegido (unos 460 MB para «small») a la carpeta `modelos\`.

### Linux

```
sudo apt install python3-venv ffmpeg     # o el equivalente de tu distro
cd karaoke-fansub
./iniciar.sh
```

---

## Cómo se usa

### 1. Video y letra

- **Carga el video** con el botón o arrastrándolo sobre el escenario. Se copia dentro del proyecto (`proyectos\<nombre>\`), así que puedes mover o borrar el original.
- En la pestaña **Letra**, un verso por línea:

  ```
  Kaito: Zar|pa|mos con el al|ba
  Mirei: el vien|to can|ta a fa|vor
  no hay ma|pa que nos de|ten|ga        ← sin nombre: sigue cantando Mirei
  Coro: ¡más a|llá del ho|ri|zon|te!
  ```

  - `Nombre:` al inicio elige el personaje (y su color). Si no lo pones, se queda el del verso anterior.
  - `|` separa sílabas. Una palabra sin `|` cuenta como una sola sílaba.
  - **Silabear automático** pone las `|` por ti (español). Revisa nombres propios y palabras en quechua o aymara: el silabeador sigue las reglas del castellano.

### 2. Marcar tiempos (tap-sync)

1. Elige un verso en la lista (o deja que empiece por el primero sin marcar) y pulsa **Empezar a marcar**. El video arranca un poco antes del verso.
2. **Mantén apretado Espacio mientras suena cada sílaba** y suéltalo cuando termina. Al apretar empieza la sílaba; al soltar, termina. “Sílaba que sigue” te muestra cuál viene.
3. Si te equivocas:
   - `R` repite el verso desde el inicio.
   - `Backspace` vuelve a la sílaba anterior (la siguiente vez que la marques se sobrescribe).
   - `←` / `→` retroceden o adelantan 2 segundos.
   - `Esc` sale del modo marcado.
4. **Velocidad 0.5× / 0.75×**: para canciones rápidas, marca en cámara lenta. Los tiempos se guardan en tiempo real del video, así que no hay que corregir nada después.

Consejos:

- Si todo sale un poquito tarde (es normal: el reflejo tarda), usa **Estilo → Compensar reflejo** con un valor negativo, por ejemplo −80 ms. Mueve todos los tiempos a la vez y no toca lo que marcaste.
- Para afinar una sílaba, en la **línea de tiempo** arrastra su borde izquierdo o derecho. Arrastrar el fondo mueve el tiempo.
  Con teclado (con la línea de tiempo enfocada): `,` y `.` eligen sílaba, `Shift+←/→` mueven su inicio y `Ctrl+←/→` su final, de 10 en 10 ms.
- Los versos aparecen en dos filas alternadas: mientras se canta uno, el siguiente ya se ve.

### 3. Personajes y estilo

- **Personajes**: se crean solos con los nombres de la letra. Elige el color de cada uno; ese color pinta las sílabas cuando se cantan.
- **Estilo**: fuente (M PLUS Rounded 1c, Dela Gothic One, Bangers, Anton, Kosugi Maru, todas incluidas en `fonts\`), tamaño, borde, color antes de cantar, posición arriba o abajo, margen, cuánto antes aparece el verso, brillo y **salto por sílaba** (un pequeño rebote cuando se canta cada sílaba).
- **Plantillas de estilo**: guarda el estilo actual con los colores de tus personajes y aplícalo a otros proyectos, para que todo tu canal tenga la misma identidad. Se guardan en `plantillas\`.

### 4. Exportar

En la pestaña **Exportar**:

- **Formato**: *Original*, *Vertical 1080×1920 · recortar* (corta los costados) o *Vertical · fondo difuminado* (el video entero al centro sobre una copia borrosa). La vista previa cambia para mostrar el encuadre final.
  En vertical, TikTok tapa la parte de abajo con sus botones: sube el **margen** a 18–22 % o pon la letra arriba.
- **Exportar video**: quema la letra con ffmpeg (H.264, `crf 18`, audio copiado) con barra de progreso real y botón **Cancelar**. El archivo queda en `exportados\`.
  En una laptop modesta, la velocidad **Rápida** sirve bien para TikTok; **Lenta** da archivos más livianos con la misma calidad.
- **Descargar .ass / .srt**: el `.ass` trae todo el karaoke con colores y se abre en Aegisub para retoques finos; el `.srt` es un verso por línea, para subirlo como subtítulos a YouTube.

### 5. Modo automático (Whisper, opcional)

En la pestaña **Automático**:

- **Video hablado**: transcribe, arma los versos y pone los tiempos de cada palabra (repartidos entre sus sílabas). Luego corriges lo que haga falta.
- **Canción**: pega primero la letra. Whisper escucha y se usan los tiempos de las palabras que reconoce como punto de partida. **Si la confianza es baja, te lo dice y no aplica tiempos** (puedes aplicar solo las palabras seguras y marcar el resto con Espacio). Con música fuerte reconoce menos; ahí el tap-sync manual sigue siendo lo mejor.
- **Glosario**: escribe nombres propios y palabras en quechua o aymara separados por comas (por ejemplo `Choquehuanca, Titicaca, jallalla`); Whisper los escribirá mejor.
- Modelos: `tiny` y `base` son rápidos; `small` (recomendado) es un buen equilibrio; `medium` es más preciso pero lento en CPU. En tu laptop puede tardar varios minutos: corre en segundo plano y puedes seguir trabajando.

### Proyectos

Todo se **guarda solo** (cada segundo después de un cambio) en `proyectos\<nombre>\proyecto.json`, junto con la copia del video. Con el selector de arriba cambias de proyecto; **Nuevo** crea otro. **Descargar .json** e **Importar .json** sirven para pasar un proyecto a otra PC (el video se vuelve a cargar). También se pueden importar los `.json` del prototipo `karaoke-fansub.html`.

---

## Problemas típicos

| Problema | Solución |
|---|---|
| Doble clic en `iniciar.bat` dice “No encuentro Python” | Reinstala Python marcando **Add python.exe to PATH**. Luego cierra y vuelve a abrir la carpeta. |
| La instalación se cortó a la mitad (sin internet, etc.) | Vuelve a hacer doble clic: retoma la instalación. Si sigue fallando, borra la carpeta `.venv` y prueba otra vez. |
| Arriba sale “No encuentro ffmpeg” | Revisa que exista `karaoke-fansub\ffmpeg\bin\ffmpeg.exe` (también vale una carpeta intermedia, como `ffmpeg\ffmpeg-7.1-essentials_build\bin\ffmpeg.exe`). Reinicia el programa. |
| “Tu ffmpeg no trae el filtro ass” | Descarga la versión *essentials* o *full* de gyan.dev; algunas versiones mínimas vienen sin libass. |
| “Tu navegador no puede reproducir este video” | Pasa con videos HEVC (H.265) del celular. Pulsa **Convertir para la vista previa**: hace una copia liviana solo para el editor; al exportar se usa el original. |
| La vista previa va a saltos | Baja el **brillo** mientras editas (el blur es lo que más CPU pide) y súbelo antes de exportar. Cierra otras pestañas pesadas. Usa Chrome o Edge actualizados. |
| Las sílabas se pintan tarde respecto a la voz | **Estilo → Compensar reflejo** con un valor negativo (−50 a −150 ms). |
| Un verso largo sale chiquito | Se achica solo para no salirse de la pantalla. Pártelo en dos versos o baja el tamaño general. |
| El puerto 8765 está ocupado | El programa usa el siguiente libre (8766, 8767…) y abre esa dirección solo. |
| No se abre el navegador | Abre a mano la dirección que aparece en la ventana negra (por ejemplo `http://127.0.0.1:8765/`). |
| Whisper: “no está instalado” | Instálalo como en el paso 4 de la instalación, con el programa cerrado. |
| Whisper tarda muchísimo | Usa el modelo `base` o `tiny`, o recorta el video. La primera vez también descarga el modelo. |
| Exporté pero no encuentro el video | Está en `karaoke-fansub\exportados\`. En la pestaña Exportar, **Abrir carpeta** te lleva ahí. |

---

## Para quien quiera tocar el código

```
karaoke-fansub/
├─ run.py, iniciar.bat, iniciar.sh   arranque (busca puerto libre y abre el navegador)
├─ app/                              backend FastAPI
│  ├─ lyrics.py                      parser "Nombre:" + "|" y silabeador de español
│  ├─ ass_gen.py                     genera el .ass (\kf) y el .srt: la única fuente de verdad
│  ├─ fonts.py                       catálogo y métricas de fonts/ (fontTools)
│  ├─ project.py, storage.py         modelo del proyecto y guardado en disco
│  ├─ ffmpeg_tools.py, jobs.py       ffmpeg, progreso y trabajos en segundo plano
│  └─ whisper_mod.py                 modo automático (opcional)
├─ web/                              una sola página, JS con módulos ES, sin build
│  ├─ js/  app, store, player, tapsync, timeline, preview (JASSUB), export, whisper, templates
│  └─ vendor/jassub/                 libass en WebAssembly (JASSUB 1.8.8)
├─ fonts/                            fuentes libres + licencias
├─ ejemplo/                          proyecto de ejemplo (se copia a proyectos/ la primera vez)
├─ scripts/make_example.py           regenera el ejemplo
└─ tests/                            pytest
```

Decisiones:

- **Un solo generador de `.ass`, en Python.** El navegador le pide el `.ass` al backend en cada cambio y se lo pasa a JASSUB, y ffmpeg quema ese mismo texto. Por eso la vista previa coincide con el video final (se comprobó píxel a píxel contra un cuadro quemado por ffmpeg).
- **JASSUB en modo canvas**, con el tamaño del video final: la vista previa vertical muestra el encuadre real aunque el video sea horizontal.
- **ffmpeg corre con rutas relativas** a esta carpeta (`ass=exportados/.tmp/x.ass:fontsdir=fonts`) para evitar el problema de escapar `C:` en los filtros en Windows.
- Sin Node ni compilación: para usarlo solo hacen falta Python y ffmpeg.

Tests:

```
python -m pip install -r requirements-dev.txt
python -m pytest
```

Incluyen el silabeador, un `.ass` dorado (`tests/data/esperado.ass`; si cambias el generador a propósito, regenéralo con `UPDATE_GOLDEN=1 python -m pytest tests/test_ass.py`), integración real con ffmpeg (video de prueba de 5 s con `testsrc` + tono, quemado en los tres formatos, más la cancelación) y la alineación de Whisper con palabras grabadas (no necesita el modelo). Los tests de ffmpeg se saltan solos si no está instalado.

## Licencias

- Fuentes: M PLUS Rounded 1c, Dela Gothic One, Bangers y Anton bajo SIL Open Font License; Kosugi Maru bajo Apache 2.0. Textos en `fonts/licencias/`.
- JASSUB (libass en WebAssembly): LGPL-2.1 y otras, detalle en `web/vendor/jassub/COPYRIGHT`.
