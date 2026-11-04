# 06 · Tormenta sobre el lago, con miles de gotas y filtros

**Herramienta:** PixiJS 8.22.0 (WebGL) dentro de Remotion. **Código:** [`Muestra.tsx`](Muestra.tsx).
**Pregunta:** ¿mueve Pixi miles de elementos con filtros, gobernado por el cuadro, y cuánto cuesta
frente a la muestra 03 (p5)? Y, tras el veredicto de la tanda 1 («está bien, pero se ve muy plano»):
¿le dan volumen a la tinta la profundidad y la luz?

![hoja de contactos](../../resultados/06-lluvia-pixi/hoja.jpg)

## Qué demuestra

- **Pixi se deja gobernar por el cuadro.** `autoStart: false`, ticker parado: cada cuadro se arma
  desde el número de cuadro y se dibuja una vez con `renderer.render()`. Nada se simula paso a paso:
  la caída acumulada de cada plano se precalcula (integral de la velocidad) y la posición de cada
  gota es una fórmula de esa caída y de su semilla. Los salpicones salen de `azar()` por ciclo.
  Revisión: 150 cuadros, sin parpadeos ni cuadros vacíos (`resultados/06-lluvia-pixi/revision.json`).
- **Miles de elementos no son el problema.** 3830 gotas (sprites de una sola textura) y 280
  salpicones. Con 10 veces menos gotas el render tardó lo mismo (45,5 s contra 45,8 s, 30 cuadros).
- **Profundidad, respuesta al «muy plano».** Tres planos de lluvia (lejos fina y algo borrosa,
  medio nítida, cerca gruesa y desenfocada), tres capas de cordillera con perspectiva aérea (más
  clara y borrosa cuanto más lejos) y el reflejo de la cordillera en el lago, aplastado y borroso.
- **Luz con intención y ritmo.** Llueve (0–1,6 s); la lluvia afloja y el cielo se cierra (1,6–2,5 s,
  la quietud antes del golpe); relámpago en dos pulsos (cuadros 75 y 80): el papel se vuelve luz y
  la cordillera, por un filtro de color, queda negra contra el cielo; el rayo baja detrás de la
  cordillera media. Después, el aguacero inclinado por el viento hasta el final.
  Sin rojo: aquí no hay culpa ni dato que señalar.

## Qué salió mal

| Problema | Estado |
|---|---|
| La sierra no llegaba a los bordes (el perfil de la muestra 02 va de x = 60 a 1860). | resuelto: perfil de −60 a 1980 (`antes/cuadros-v1.jpg`) |
| Lluvia tan tenue que se leía como rayones; el cielo casi no se cerraba antes del rayo. | resuelto: más opacidad y oscuridad (`antes/cuadros-v1.jpg` → `antes/cuadros-v2.jpg`) |
| El rayo pasaba por delante de las montañas. | resuelto: se dibuja entre la capa lejana y la media |
| Franjas horizontales en el cielo: las bandas del degradado se solapaban 1 px. | resuelto: bandas de 2 px con bordes enteros (`antes/franjas-cielo-c72.png`) |
| Hornear el desenfoque de lo quieto (`cacheAsTexture`) no ahorró tiempo (42,7 s / 30 cuadros) y recortó la sierra en el borde derecho y borró el reflejo. | descartado (`antes/horneado-descartado.jpg`) |
| Los salpicones casi no se ven; el reflejo no se rompe con la lluvia. | queda |
| El rayo es una línea de tinta plana, sin resplandor. | queda |
| Sin trueno: el golpe es solo visual. El sonido lo daría `scripts/generar_audio.py`. | queda |
| MP4 de 8 MB (la 03: 5 MB): lluvia fina en movimiento comprime mal. | queda; normal para esta imagen |

## Qué costó

Todo en el **contenedor** (Xeon 2,1 GHz, 4 hilos, sin GPU: WebGL por SwiftShader, que el registro
confirma: `[lab06] Pixi webgl: ANGLE (… SwiftShader …)`).

| Render | Pared | Pico PSS |
|---|---|---|
| final, frío | 211,0 s | 3,2 GB |
| final, caliente | 180,5 s | 2,4 GB |
| previa, caliente | 168,8 s | 2,1 GB |
| 03 p5, final caliente, misma sesión (referencia) | 28,6 s | 3,6 GB |

**Pixi tarda ~6 veces lo que p5 aquí**, pero no por los elementos. Dónde se va (30 cuadros, 90–119,
una corrida cada uno; el contenedor varía ±25 %):

| Variante | Pared |
|---|---|
| tal cual | 41–46 s |
| sin desenfoques | 26 s |
| sin ningún filtro | 23 s |
| 10× menos gotas | 45,5 s |
| tal cual, 1 hilo de render en vez de 4 | 44,8 s |
| 03 p5, mismos cuadros | 13,7 s |

- **El cuello es un solo proceso GPU.** Con 1 hilo tarda lo mismo que con 4, y durante el render el
  proceso GPU de Chrome está al 235 % de CPU y cada pestaña al ~9 %: las cuatro pestañas esperan al
  mismo SwiftShader. Por eso la previa a media escala casi no ahorra (el búfer sigue a 1920×1080).
- **Los desenfoques son la mitad del costo** (cinco `BlurFilter` a pantalla completa por cuadro).
- **Con GPU real esto debería cambiar**, pero es hipótesis: no se probó en la laptop (Iris Xe) ni en
  la PC objetivo. Hay que pasar `--gl` y confirmar en el registro que el renderizador cambió.
- **Límite de la medición:** `segundos_cpu` de `medir.py` sale de `getrusage(RUSAGE_CHILDREN)` y dio
  41,7 s para 180 s de pared con el proceso GPU al 235 %: casi seguro no cuenta a Chrome. Vale
  también para la tanda 1. El tiempo de pared y la memoria (árbol de procesos) sí son confiables.
- **Agente:** 2026-11-04; registros de render entre 12:40 y 12:50 UTC. El inicio de la sesión no quedó registrado.
- **Humano:** desconocido.

## Para qué escenas del canal

- Atmósfera con profundidad: lluvia, granizo, nevada en la puna, polvo, ceniza; siempre que la
  escena pida miles de elementos y capas.
- Un golpe de luz que revela (el relámpago que recorta la cordillera): sirve como «quietud y golpe»
  antes de un dato, con el trueno como acento.
- Comparado con p5: p5 es más barato sin GPU y mejor para trazos con estela (la 03); Pixi da filtros
  (desenfoque de profundidad, matriz de color) que en p5 habría que programar. Sin GPU, usar Pixi
  solo donde los filtros hagan falta, y pocos.

## Reproducir

```bash
cd historia
```

```bash
./laboratorio/scripts/remotion.sh 06-lluvia-pixi final
```

Parámetros: `SEMILLA = 61`, planos de 2600 / 1100 / 130 gotas, 280 salpicones, horizonte en
y = 742, relámpago en el cuadro 75 (`RAYO = 2.5` s), curvas `lluvia()`, `viento()`, `oscuridad()`,
`fogonazo()`. La cordillera reutiliza `perfil()` de la muestra 02. Recursos externos: ninguno
(PixiJS es MIT).
