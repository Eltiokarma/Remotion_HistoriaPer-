# Movimiento: decidir y coreografiar

Adaptado al video del canal desde los skills de Emil Kowalski (`emilkowalski/skills`, licencia MIT,
revisados el 2026-11-05 en el commit `c8a7962`), sobre todo `animate` y `choreograph`, a pedido de
Gerson. Esos skills son para interfaces web: aquí se tomó lo que vale para un video y se tradujo a
las herramientas del canal. **Lo que choca no se aplica** (lista al final). Mandan `historia/CLAUDE.md`
§4 y `direccion-historia` §4.

## 1. Antes de animar: ¿se mueve?

El primer error es mover lo que no debía moverse. A veces la respuesta correcta es no animar.

- **Nombrar el motivo en una palabra** antes de escribir código: *explicar* (muestra cómo funciona
  algo), *recorrer* (el paso del tiempo o del espacio, §4 «el movimiento guía»), *revelar* (llega lo
  importante), *relacionar* (une causa y efecto), *atmósfera* (el lugar respira). Sin motivo, no se
  mueve.
- **Un dato que se está leyendo no se mueve por estilo.** Una cifra, una fecha o un rótulo quietos
  mientras se leen (17 caracteres por segundo, `direccion-historia` §4.2).

## 2. Repartir los papeles (antes de fijar ningún tiempo)

Ante un beat donde se mueven varias cosas, listar todo lo que se mueve y darle un papel:

| Papel | Qué es | Cómo se mueve |
|---|---|---|
| **Protagonista** | Lo único que el espectador tiene que ver (el dato, la ruta, la palabra) | Primero, el recorrido más largo, se queda más; peso `solemne` o `pesado` |
| **Apoyo** | Lo que acompaña al protagonista (el rótulo de una cifra, la flecha) | Después, más corto y más chico |
| **Decoración** | Texturas, partículas, adornos | Solo aparece o se apaga, sin desplazarse; o nada |
| **Quieto** | Todo lo demás, y el contenedor si su contenido se mueve | No se mueve |

Si dos cosas quieren ser protagonistas, el problema es de composición (§5: una idea por cuadro), no
de movimiento. Casi siempre el grupo se achica en este paso.

## 3. La relación entre cada par

```
¿Son el mismo objeto o el mismo instante?
├── Sí → JUNTOS: mismo arranque, mismo peso.
└── No → ¿El orden significa algo (lectura, causa → efecto, uno llega antes)?
         ├── No → JUNTOS. Un orden sin significado es solo espera.
         └── Sí → ¿Verse a la vez se ve mal (se tapan, se cruzan)?
                  ├── Sí → EN SERIE: el segundo empieza justo antes de que termine el primero.
                  └── No → SOLAPADOS: escalonados, el segundo arranca mientras el primero se mueve.
```

- **Una sola entrada por contenedor.** Si entra la ficha, su texto ya está en ella: no se anima la
  ficha y además cada línea.
- **Escalonado parejo, prohibido.** Si todos tienen el mismo retraso, distancia, duración y peso, el
  grupo se mueve como un metrónomo: es lo robótico (`historia/CLAUDE.md` §0). Variar por importancia:
  el protagonista viaja más; los retrasos se acortan a medida que avanza el grupo. En el canal,
  2–6 cuadros entre piezas que se asientan (§4, principio 5), no un `i * 4` fijo.
- **En serie, con un poco de solape.** Que el segundo arranque uno o dos cuadros antes de que el
  primero termine convierte una fila de espera en un solo gesto.

## 4. Lo secundario se engancha a un momento

Cada movimiento de apoyo se ata a un instante del protagonista (su arranque, su golpe o su
asentamiento), no a un retraso «que se ve bien».

- **Al golpe, no antes.** El polvo del sello sale cuando el sello toca el papel; el efecto de sonido
  cae en ese cuadro (§6: un efecto por beat, y solo si el beat es una acción).
- **Los acentos aterrizan con el protagonista**: en el último tramo de su movimiento, el más
  importante primero y los demás uno o dos cuadros detrás.
- En el código: el beat del protagonista se nombra una vez y lo secundario se calcula desde él
  (`beats.golpe + 2`), así, si la voz mueve el beat, todo se mueve con él.

## 5. La duración según lo que cambia

- Un recorrido largo dura más que uno corto con el mismo peso; no usar una duración fija para todo.
- Con pocos casos, poner los valores a mano para cada uno: una docena de tiempos ajustados vale más
  que una fórmula que no se puede afinar.

## 6. Salidas

- **Las salidas son más cortas y simples que las entradas**, y todo sale a la vez: no se escalona al
  revés (§4: lo importante entra lento y sale rápido).
- Lo que entró por un lado sale por ese lado, o se apaga; no cambia de dirección sin motivo.

## 7. Antes de dar por hecho un beat con varias piezas

Escribir la línea de tiempo antes del código (una fila por pieza que se mueve, en orden de arranque):

| Pieza | Papel | Arranca (cuadro) | Dura | Movimiento y peso | Relación |
|---|---|---|---|---|---|

Y debajo, de 2 a 5 cosas a las que **se les quitó** el movimiento y por qué. Después del render, mirar
el tramo cuadro a cuadro: un escalonado que se lee como ola y uno que se lee como fila se ven iguales
en la cabeza y distintos en el clip.

## Lo que no se toma (choca con el canal)

| El skill dice | En el canal | Por qué |
|---|---|---|
| Transiciones y animaciones CSS, WAAPI, Motion | Todo con `useCurrentFrame()` y `tramo()` | Remotion dibuja cada cuadro por separado; `npm run reglas` lo prohíbe (`css-animado`) |
| Curvas fijas (`cubic-bezier(0.23, 1, 0.32, 1)`…) | Los cinco pesos de `src/direction/easings.ts` | Cada movimiento declara su peso; una curva suelta es una falta (`easing-suelto`) |
| «Nunca `ease-in`» | `tenso` acelera a propósito hacia un corte o un golpe | En un video, lo que cae acelera; la regla es de botones que deben responder rápido |
| Menos de 300 ms | La duración la manda la voz; lo importante, lento | Un video no es una interfaz que el usuario espera para usar |
| Frecuencia de uso, interrupción, teclado, `prefers-reduced-motion`, hover | No aplica | El espectador no interactúa con el cuadro |
| Nunca `scale(0)`; partir de 0,95 | Vale como idea (nada aparece de la nada), pero la escala se decide por material (§4, comprimir y estirar) | El canal ya tiene su tabla de impacto por material |

Los demás skills de ese repositorio (`review-animations`, `improve-animations`,
`find-animation-opportunities`, `remove-animations`, `animation-performance`, `animate-expo`,
`apple-design`, `animation-vocabulary` y los de interfaz o Swift) no se adaptaron: son de interfaces o
de rendimiento en el navegador. Si Gerson quiere el vocabulario (nombres de efectos para pedir
movimiento), se puede sumar aparte.

## Impeccable (pbakaus/impeccable)

Evaluado el 2026-11-05 (commit `5af4319`, Apache 2.0) y **no se instala**: es un sistema de diseño de
interfaces web (landing pages, paneles, formularios), su lanzador descarga y ejecuta un binario la
primera vez y agrega un *hook* que revisa cada edición de UI. No tiene una superficie que sea un video.
Su idea de **color por papeles** (cada color con una función, el más fuerte en una región decidida y
no salpicado) coincide con la paleta con significado del canal (`historia/CLAUDE.md` §5,
`direccion-historia` §4.2), que ya manda.
