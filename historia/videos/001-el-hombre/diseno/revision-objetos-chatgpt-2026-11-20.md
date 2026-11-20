# Revisión de los objetos de ChatGPT (20 de noviembre de 2026)

Tres entregas de Gerson: `video01_lote01.rar` y `video01_lote02.rar` (los 12 objetos de la lista del 0·2, 13 PNG) y el ZIP de las islas, el mar, el barco y el Estado (4 PNG, con sus prompts en [prompts-usados-obj01-06-08.md](prompts-usados-obj01-06-08.md)). Revisión con la fase F del skill de diseño: transparencia, texto, consistencia de estilo, y cada pieza sobre el fondo verde oscuro del 0·1, a tamaño real, a 1/8 y en grises.

Las imágenes quedan fuera de git (`public/videos/*/imagenes/`, `.gitignore`): todas en `public/videos/002-la-deuda-defraudada/imagenes/chatgpt/`, y las que usa el 0·1 copiadas en `public/videos/001-el-hombre/imagenes/chatgpt/` (sacos, vale, pila, islas, mar, barco y Estado).

## Veredicto

**Aprobados los 17.** Mismo trazo, misma paleta y misma luz que las figuras del 0·2; los 17 tienen canal alfa (el mar es fondo completo, como se pidió). Ninguno tiene letras legibles: los folios y la carpeta llevan trazos de pluma, y el vale, el bono, el frontón del Estado y la tapa de la carpeta dejan su espacio en blanco para que Remotion escriba encima. Sobre el fondo verde oscuro, el contorno de tinta se lee en todos.

| Archivo | Observación |
|---|---|
| obj-01 y obj-02 · sacos | Bien: el abierto muestra el guano; el cerrado, la cuerda. |
| obj-03 · folio de reclamo | Bien: la pestaña roja identifica el papel que se sigue. |
| obj-04 · vale | Bien: óvalo vacío y centro libre para la cifra. |
| obj-05 · pila de vales | Bien: recta y del mismo ancho, sirve para revelarla de abajo arriba. |
| obj-06 · sobre | Bien. El lacre rojo es fuerte: en el 0·2, el rojo es de la culpa, y aquí lo es (el pago ilegal). |
| obj-07 · carpeta abierta y cerrada | Se leen como la misma carpeta. |
| obj-08 · libro de la ley | Bien; los dos huecos de la página derecha se notan poco: el corrector los encierra en rojo encima, como pide el storyboard. |
| obj-09 a obj-12 | Bien. El bono se distingue del vale a primera vista (tinta verde azulada y cupones). Las monedas son de plata del siglo XIX, para el 0·2; el gancho del 0·1 necesita una moneda sola (n.º 11 de la lista del 0·1), que todavía no se pidió. |
| obj01-06 · islas y mar | **Calzan:** el horizonte del mar cae en la fila 706 de 1080 y el prompt pedía la 707. La isla baja hasta la fila 868, así que se asienta en el agua. |
| obj01-07 · barco | Bien. **Montaje:** va **volteado en horizontal** (proa a la derecha). Ver abajo. |
| obj01-08 · Estado | Bien: seis columnas, simétrico, frontón y franja del entablamento vacíos para `ESTADO`. |

## Reglas de montaje que salen de la revisión

1. **El barco zarpa hacia la derecha, volteado.** La imagen tiene la proa a la izquierda, hacia la isla. Europa está al este, a la derecha de un mapa con el norte arriba, y la isla ocupa la izquierda del cuadro: el guano sale hacia la derecha y la plata vuelve hacia la izquierda, al Estado. Se voltea en Remotion (`scaleX(-1)`); el barco no tiene letras, así que voltearlo no falsea nada. Esa dirección se mantiene en toda la escena (continuidad del plano 2D, Murch).
2. **La línea de flotación del barco va en el agua, no en el horizonte.** Con el horizonte en la fila 707, un barco cuya base cae ahí parece flotar en el cielo (se probó). A escala 0,5 a 0,55, su base va entre las filas 760 y 850; sobre el horizonte, solo a escala mucho menor (lejos).
3. **Cuando el barco es el protagonista (`zarpa`), la isla baja.** En grises y a 1/8, la isla es la masa que domina el cuadro. Para que el ojo siga al barco, la isla se oscurece un poco con la lámpara o la viñeta: primero se baja la competencia y después se sube el énfasis.
4. **La carga a la vista.** El barco lleva el guano en montones sobre la cubierta; en la época se cargaba en la bodega. Para una escena de dos segundos se acepta como ilustración: dice «va cargado de guano». Si se usa en un plano largo o cercano, rotular `ILUSTRACIÓN` o pedir una versión con la carga tapada.

## Lo que falta de la lista del 0·1

Pruebas de imprenta (1), página suelta (2), lápiz rojo (3), libro de 2013 (4), libro del siglo XIX cerrado y abierto (5), balanza en piezas (9), brújula en piezas (10), moneda sola (11), lomos y repisa (12) y fichero (13). Los prompts están en [prompts-chatgpt-objetos-001.md](prompts-chatgpt-objetos-001.md).
