# Esfuerzo medio y extra: qué hizo uno que no hizo el otro

2026-11-04, muestra 06 (`laboratorio/muestras/06-mesa-con-volumen/`). Gerson subió el esfuerzo de
medio a extra y pidió tres cosas: ser eficientes, un video más fluido y con más detalle, y aprender
aquí qué hace el extra que no hace el medio.

## Qué se puede afirmar y qué no

- No sé por dentro qué cambia el nivel de esfuerzo. Lo que sigue es lo que se vio en el trabajo
  (**observado**) y lo que dice el registro de la sesión (**medido**).
- **No es una comparación limpia.** La vuelta extra empezó con lo que dejó la media (código, defectos
  ya corregidos) y con otro pedido (fluidez y detalle). Para comparar de verdad: el protocolo
  `laboratorio/MEDIR_SKILL.md` (sesiones nuevas, mismo pedido, juicio a ciegas).

## Números (medido)

Con `laboratorio/scripts/consumo_sesion.py`; registros en
`laboratorio/resultados/06-mesa-con-volumen/esfuerzo/`. Costo API equivalente con las tarifas del
script (no es lo que cobra una suscripción).

| Vuelta | Llamadas | Minutos | Tokens de salida | Salida por llamada | Lectura de caché | Costo API eq. | Cuadros revisados | Renders del clip |
|---|---|---|---|---|---|---|---|---|
| Medio (02:46–02:57) | 37 | 11,4 | 32 502 | 878 | 5,06 M | $2,67 | 34 (`remotion still`, de a uno) | 1 |
| Extra (10:37–10:58) | 27 | 20,2 | 88 176 | 3 266 | 6,44 M | $5,07 | 60 (6 corridas de `cuadros.mjs`) | 1 |

La fila del extra va hasta 10:58:06. Las llamadas posteriores (estos documentos, el roadmap y el
commit) no están contadas.

- El extra costó 1,9 veces más, tardó 1,8 veces más y usó **menos** llamadas, cada una con 3,7 veces
  más salida (más razonamiento y archivos más grandes).
- El clip: el render pasó de 63,2 s a 110,6 s (+75 %) por el detalle nuevo (en el contenedor).

## Qué hizo el extra que el medio no (observado)

| # | Extra | Medio |
|---|---|---|
| 1 | Midió la vuelta anterior **antes** de empezar, para tener contra qué comparar | No midió |
| 2 | Buscó primero qué reutilizar: `Atmosfera` (grano y viñeta del canal), `Pluma`, el generador de texturas | Escribió su propia viñeta |
| 3 | Separó el movimiento del dibujo (`movimiento.ts`, funciones puras del tiempo) | Todo dentro del componente |
| 4 | Fijó un criterio numérico de fluidez antes de mirar (`fluidez.ts`): la hoja de la versión media frenaba 195 px por cuadro en un solo cuadro (se clavaba) y quedaba 5 cuadros colgada en el aire | Juzgó con hojas de contactos, que no muestran la velocidad |
| 5 | Eligió la curva por el material: el papel cae con aire (se mece, colchón de aire, roce); el libro, con peso (`tenso` y golpe) | Usó `tenso` (lo pesado) para el papel |
| 6 | Cuidó que la velocidad no se corte entre tramos: cero a los dos lados, o continuada por el roce | — |
| 7 | Revisó el primer y el último cuadro visible de cada cosa, y así encontró que su propia pluma aparecía ya dentro del cuadro (200) y desaparecía dentro (245) | No lo revisó |
| 8 | Desenfoque de movimiento solo donde algo va rápido, con el número de copias calculado | Sin desenfoque |
| 9 | Hizo la herramienta antes de iterar (`cuadros.mjs`: un bundle y un navegador para todos los cuadros) | Un `remotion still` por cuadro |
| 10 | Midió el costo por cuadro antes de decidir si optimizar | — |
| 11 | Cada detalle con su motivo: la sombra de contacto apoya, el relleno frío separa la sombra del negro, el temblor de la lámpara une el golpe con la luz | Menos detalle, sin anotar el motivo |
| 12 | Se corrigió a sí mismo: dijo 38,7 s por still (un primer arranque en frío), lo repitió y eran 6,6 s | — |

## Lo que pasa al procedimiento

Lo que hizo el extra queda escrito como pasos en [`procedimiento.md`](procedimiento.md) §3–§4 y en
[`trampas.md`](trampas.md) («Movimiento y CSS 3D»). La idea del skill: que no dependa del nivel de
esfuerzo, para que una sesión en medio con el skill haga lo mismo. Si lo logra o no, se mide con
`MEDIR_SKILL.md`.

## Eficiencia: lo aprendido

- **Cada llamada relee todo el contexto.** En esta sesión, 137 mil tokens por llamada en medio y 239
  mil en extra (lectura de caché): unos $0,03–0,05 por llamada solo en releer. Juntar en una llamada
  los comandos que no dependen entre sí ahorra más que acortar las respuestas.
- **Herramientas antes que vueltas.** `cuadros.mjs`: 1,6–2 s por cuadro más un bundle de 4–10 s, contra
  6,6 s por cuadro con `remotion still` en caliente. `fluidez.ts` encuentra frenazos sin renderizar.
- **Mirar con una pregunta.** Cada revisión de cuadros con un propósito (entradas y salidas, detalle a
  tamaño real, costo por cuadro), no hojas genéricas.
- No cortar con `| head` la salida de un script que guarda al final: el `EPIPE` lo mata antes de guardar.
