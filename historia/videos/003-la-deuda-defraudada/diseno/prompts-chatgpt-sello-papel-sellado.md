# Prompt para ChatGPT · sello del papel sellado (reconstrucción)

21 de noviembre de 2026. Lo decidió Gerson: el sello reconstruido va en el **reclamo de Novoa**, que era el trámite de un particular. El oficio de Echenique conserva su sello genérico hasta saber si el gobierno respondía en papel sellado ([VERIFICAR], ver `fuentes.md`, «Búsqueda del sello de 1852»).

## Qué se sabe y qué se reconstruye

- **Documentado** en el inventario del Fondo Riva-Agüero (IRA-PUCP):
  - En Lima, en 1851, el papel sellado llevaba el «escudo de la República».
  - Se emitía por bienio y por valor («papel sellado de dos reales en el bienio de 1856 - 1857»). Al reclamo de 1852 le corresponde el bienio de 1852 y 1853.
- **Reconstruido:** la forma del sello, el marco y la disposición de las leyendas. No se encontró una imagen del pliego de esos años. Por eso no se pone un valor en reales: no sabemos de qué clase era el papel del reclamo.

## Cómo pedirlo

- Adjuntar las dos referencias del zip `referencias-sello.zip`:
  - `escudo-nacional-commons.png`: el escudo nacional, en dominio público en Wikimedia Commons. Se usa solo para los elementos del escudo: la vicuña, el árbol de la quina, la cornucopia con monedas y la corona de encina.
  - `timbre-1866-commons.jpg`: un timbre fiscal peruano de 1866, también en dominio público. Se usa solo para el oficio de grabado fiscal: guilloché, filetes y la densidad de línea.
- **ChatGPT no escribe las leyendas.** El anillo del sello queda vacío, y Remotion escribe encima, en curva, «REPÚBLICA PERUANA» arriba y «BIENIO DE 1852 Y 1853» abajo. Así no salen letras deformadas.
- Una sola tinta, porque el sello se imprimía sobre el papel. Remotion lo pone sobre la hoja de la carpeta con un modo de mezcla que deja ver el papel.
- Al recibirlo: guardarlo como `obj-16-sello-papel-sellado.png` en la galería y registrarlo en `fuentes.md` como reconstrucción.

## Prompt

```text
Usa la primera imagen adjunta (escudo nacional del Perú) solo para los elementos del escudo y la segunda (timbre fiscal peruano de 1866) solo como referencia de técnica de grabado fiscal: guilloché, filetes finos y densidad de línea. No copies el timbre ni sus textos.

Dibuja UN sello fiscal impreso de mediados del siglo XIX, como el que venía impreso en la parte superior de un pliego de papel sellado, visto de frente y plano. Formato cuadrado 1024 × 1024, el sello ocupa el 90 % del ancho.

Forma: un sello circular. De afuera hacia adentro:
1. Un filete exterior doble y fino.
2. Un anillo ancho completamente VACÍO, sin letras, números ni signos: ahí se escribirá después la leyenda.
3. Un filete interior con una cenefa delicada de guilloché.
4. En el centro, el escudo de la República: un escudo de contorno clásico dividido en tres campos. Arriba a la izquierda, una vicuña de pie mirando a la derecha. Arriba a la derecha, un árbol de la quina. Abajo, una cornucopia derramando monedas. Encima del escudo, una corona de hojas de encina. A los costados, dos ramas cruzadas por debajo. Sin banderas ni estandartes.

Técnica: grabado en talla dulce impreso con UNA SOLA tinta negra parduzca, como tinta de imprenta sobre papel. Los campos del escudo se distinguen solo por tramas de líneas (rayado horizontal, vertical, punteado), sin colores. Impresión ligeramente irregular: tinta algo más cargada en unos puntos y apenas desvaída en otros, como un sello impreso de verdad.

Fondo transparente (PNG con canal alfa): solo la tinta es opaca, sin papel detrás. Si no es posible, fondo blanco liso #FFFFFF.

Prohibido: cualquier letra, número, fecha o palabra (ni legible ni falsa); colores; bandas o estandartes; marco cuadrado; sombra; relieve; papel de fondo.
```
