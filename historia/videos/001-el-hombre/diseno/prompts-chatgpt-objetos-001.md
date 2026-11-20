# Prompts para ChatGPT · objetos del 0·1 en el estilo de grabado

20 de noviembre de 2026. El 0·2 está pidiendo sus objetos a ChatGPT en estilo de grabado coloreado (contorno de tinta, grano, sombreado en trazos), y el 0·1 tiene sus láminas en vector de color plano (VectorCraft). Para que no haya un salto de estilo entre los dos episodios, este documento dice qué se pide para el 0·1, qué se reutiliza del 0·2 y qué se queda en vector, con el criterio del skill de diseño y animación.

## Qué se pide y qué no (el criterio)

1. **Contenido o marco** (ley 3, fidelidad). El contenido es lo que se comunica: cifras, fechas, nombres, gráficos, mapas, la tiza de la clase. El marco es lo que lo rodea: objetos, papeles, edificios, barcos. El contenido se queda en vector o en Remotion, exacto y legible. El grabado es para el marco: ahí vive la expresividad.
2. **El mismo objeto es el mismo archivo** (oficio Identidad). El 0·1 termina en el guano y la deuda, y el 0·2 empieza ahí. El saco, el vale y la pila de vales del 0·1 son los mismos del 0·2: **se reutilizan sus imágenes, no se piden otra vez**. Si se pidieran dos veces, el espectador vería dos vales distintos.
3. **Primero lo que comparten los dos episodios**: las pruebas de imprenta (gramática de la serie, abren y cierran cada episodio), el libro, las islas, el barco y el edificio del Estado. Después, los objetos propios del 0·1.
4. **Lo que se anima se pide en piezas.** Una balanza que se inclina necesita el brazo separado de la base; una brújula que gira, la aguja separada de la caja; un libro que se abre, cerrado y abierto. Cada pieza en su propio chat, con la anterior adjunta para que sea la misma.
5. **Todo declara su oficio** (ley 2). Si un objeto no tiene un momento en el guion, no se pide.
6. **Sin personas reales.** Quiroz no se dibuja: no hay licencia para su imagen y el canal no inventa su cara (DIRECCION_DE_VIDEO §2.8, «no tenemos esa cercanía»). Los trabajadores de las islas se reutilizan del 0·2.

## Cómo pedirlos

Igual que en el 0·2, para que salgan de la misma mano:

- Un chat por objeto (o por grupo de piezas), **adjuntando como referencia de estilo `reclamante-a-ofrece-folio.png` y `trabajador-2b-levanta-saco.png`** del 0·2. Para las piezas de un mismo objeto, adjuntar también la primera pieza que salió.
- **Sin texto legible, nunca.** Donde haya escritura, trazos de pluma ilegibles; los títulos, cifras, nombres y fechas los pone Remotion encima.
- Fondo transparente (PNG). Si no sale transparente, blanco liso #FFFFFF, sin sombra proyectada: el montaje pone la sombra y la lámpara común del 0·1.
- Al recibirlos: guardarlos en `public/videos/001-el-hombre/imagenes/chatgpt/` (fuera de git) con el número de esta lista (`obj01-04-libro-cerrado.png`), y registrar fecha y prompt en `fuentes.md`.
- **Verificar antes de integrar** (fase F del skill): poner el objeto junto a una figura del 0·2 sobre el fondo verde oscuro del 0·1 y mirarlo a tamaño real, a 1/8 y en grises. El contorno de tinta tiene que leerse sobre el fondo oscuro, y ningún objeto puede ganarle en saturación al dato que acompaña (el rojo es del corrector y de la culpa).

## Estilo común (ya incluido en cada prompt)

El mismo bloque del 0·2, sin cambios:

Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados (crudo, ocre, terracota, verde azulado, marrón); luz suave desde arriba a la izquierda. Objeto aislado, sin suelo, sin sombra proyectada, sin texto legible, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF.

## Se reutilizan del 0·2 (no se piden)

| Objeto del 0·2 | Dónde va en el 0·1 |
|---|---|
| 1 y 2 · Saco de guano abierto y cerrado | s06: los sacos que suben al barco («Ahí estaba el guano») |
| 4 · Vale de consolidación | s06: el vale de arriba de la pila, cuyo monto se infla («Algunos inflaron…»); el monto lo pone Remotion en el centro en blanco |
| 5 · Pila de vales | s06: la deuda que se apila («una deuda vieja…») y recibe el sello `1850` |
| Figuras de trabajadores (`trabajador-2b-levanta-saco.png` y las demás) | s06: quienes cargan los sacos en las islas, pequeños y lejanos |

## Lista

| N.º | Objeto | Escena del 0·1 | Comparte con el 0·2 | Prioridad |
|---|---|---|---|---|
| 1 | Pila de pruebas de imprenta | s01 (abre), s07 (cierra) | sí: el 0·2 también abre con ellas | alta |
| 2 | Página suelta de prueba de imprenta | s01 (los agradecimientos) | sí | alta |
| 3 | Lápiz rojo de corrector | s01, s07 | sí | alta |
| 4 | Libro de 2013, cerrado | s00 (el libro que no vio), s01 | sí (gancho del 0·2) | alta |
| 5 | Libro del siglo XIX, cerrado y abierto | s06 (la biblioteca de Denegri) | no | alta |
| 6 | Islas guaneras con mar y aves, sin barco | s06 | sí (escena 1 del 0·2) | alta |
| 7 | Barco de carga de vela | s06 (zarpa hacia Europa) | sí | alta |
| 8 | Edificio del Estado | s06 (la flecha de la plata) | sí | alta |
| 9 | Balanza de platillos, en piezas | s05 (Maxwell: profundidad y claridad) | no | media |
| 10 | Brújula de bolsillo, en piezas | s08 (las ideas que cambian) | no | media |
| 11 | Moneda sola | s00 (de cada diez soles) | no | media |
| 12 | Cuatro libros de lomo y una repisa | s08 (el estante de sus libros) | no | media |
| 13 | Fichero de madera | s05 (el archivo del que salen los puntos) | no | baja |

### 1. Pila de pruebas de imprenta

Es la gramática de la serie: el libro como objeto que se corrige y se cierra. Las marcas rojas las dibuja Remotion encima, porque se animan.

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin suelo, sin sombra proyectada, sin texto legible, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato vertical 1024 × 1365.

Una pila de unas cuarenta hojas sueltas de pruebas de imprenta de un libro moderno, papel blanco roto algo amarillento, vista desde arriba y un poco de frente, con las hojas apenas desalineadas y una esquina levantada. La hoja de arriba tiene márgenes amplios y bloques de texto impreso en gris, pero son líneas ilegibles, sin letras reconocibles. Sin marcas de corrección, sin lápiz, sin clips.
```

### 2. Página suelta de prueba de imprenta

La cámara entra a esta página y Remotion escribe encima la frase textual de los agradecimientos.

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin sombra proyectada, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato vertical 1024 × 1365.

La misma hoja de prueba de imprenta, sola, vista de frente y plana, papel blanco roto con grano y bordes apenas amarillentos. Márgenes amplios. Solo el tercio superior tiene unas pocas líneas de texto impreso en gris, ilegibles; el resto de la página queda en blanco para poner el texto encima. Sin marcas, sin número de página legible.
```

### 3. Lápiz rojo de corrector

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin suelo, sin sombra proyectada, sin texto ni marcas, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato horizontal 1536 × 512.

Un lápiz de corrector de madera, hexagonal, pintado de rojo apagado, usado y algo corto, con la punta afilada a cuchilla y la mina roja a la vista. Visto de costado, en diagonal suave, con la punta hacia abajo a la derecha. Sin marca ni letras en el cuerpo.
```

### 4. Libro de 2013, cerrado

El libro que Quiroz no llegó a ver. No copia la carátula real de la edición del IEP: la tapa queda vacía y Remotion pone el título, el autor y el año.

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin suelo, sin sombra proyectada, sin texto legible, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato vertical 1024 × 1365.

Un libro grueso de unas seiscientas páginas, de tapa dura, cerrado, visto de frente y apenas girado para que se vea el lomo y el canto de las hojas. Tapa de tela color terracota oscuro, lisa, con un recuadro fino hundido en el centro, vacío. Lomo sin letras. Se ve nuevo, sin desgaste.
```

### 5. Libro del siglo XIX, cerrado y abierto

Pedir las dos imágenes en el mismo chat. Es el libro de la biblioteca de Denegri: con «siglo diecinueve», la cámara entra a su página derecha, donde el montaje pone el grabado de las islas (n.º 6).

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin sombra proyectada, sin texto legible, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Dos imágenes de 1536 × 1024.

Un libro antiguo de mediados del siglo XIX, de tapas de cuero marrón gastado con los cantos rozados y nervios en el lomo, visto desde arriba. Imagen 1: cerrado, la tapa con un filete dorado gastado y sin letras. Imagen 2: el mismo libro abierto y plano. La página izquierda tiene columnas de texto impreso en líneas grises ilegibles. La página derecha tiene un recuadro grande, enmarcado con una línea fina de tinta, completamente vacío, que ocupa casi toda la página: ahí irá una ilustración. Papel crudo con manchas leves de humedad.
```

### 6. Islas guaneras con mar y aves, sin barco

Es fondo, y lo usan los dos episodios. El barco va aparte porque zarpa.

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Sin texto, sin marco. Formato horizontal 1920 × 1080, la escena llena todo el cuadro.

Las islas guaneras de la costa del Perú a mediados del siglo XIX, vistas desde el mar: un islote rocoso y empinado, cubierto en lo alto por una capa espesa de guano color ocre pálido y gris, con cortes escalonados donde se ha excavado. Al pie, un muelle de madera precario y una rampa de tablas que baja al agua. Mar del Pacífico en calma, verde azulado y gris, con poco oleaje. Bandadas de aves marinas (piqueros y guanayes) en el cielo y sobre las rocas. Cielo nublado claro, de garúa. Sin barcos, sin personas, sin banderas. El tercio derecho del mar queda libre para poner un barco.
```

### 7. Barco de carga de vela

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin sombra proyectada, sin texto legible, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato horizontal 1536 × 1024.

Un barco mercante de vela de tres palos de mediados del siglo XIX, de casco de madera oscura, visto de costado con la proa hacia la izquierda, con las velas desplegadas color crudo y algo gastadas. Navega cargado: el casco va hundido en el agua, con solo una línea de agua corta bajo la quilla. Sin bandera, sin nombre en el casco, sin figuras humanas visibles.
```

### 8. Edificio del Estado

Una fachada simbólica, no una sede real (como la lámina aprobada). El rótulo `ESTADO` lo pone Remotion en el frontón vacío.

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin suelo, sin sombra proyectada, sin texto legible, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato horizontal 1536 × 1024.

La fachada frontal de un edificio público neoclásico del siglo XIX, vista de frente y simétrica: escalinata ancha, seis columnas, frontón triangular con una franja lisa y vacía en el centro, ventanas altas de madera y una puerta central. Muros de estuco color crudo con manchas de humedad. Sin escudos, banderas, letras ni personas. No es ningún edificio real.
```

### 9. Balanza de platillos, en piezas

Se inclina con «profundidad» y se equilibra con «claridad»: el brazo tiene que girar sobre el fiel. Tres imágenes en el mismo chat; las palabras las pone Remotion sobre los platillos.

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objetos aislados, sin suelo, sin sombra proyectada, sin texto legible, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Tres imágenes de 1536 × 1024, a la misma escala.

Una balanza antigua de platillos, de latón envejecido, vista de frente. Imagen 1: solo la base y la columna con el fiel arriba, sin brazo. Imagen 2: solo el brazo horizontal recto, con el orificio central donde se apoya en el fiel y un gancho en cada extremo. Imagen 3: un solo platillo con sus tres cadenas, colgando de una argolla. Las tres piezas, del mismo latón y la misma luz, para armarlas encima unas de otras.
```

### 10. Brújula de bolsillo, en piezas

La aguja gira de una época a otra. Los puntos cardinales y las notas los pone Remotion (son letras).

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objetos aislados, sin sombra proyectada, sin texto legible, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Dos imágenes cuadradas de 1024 × 1024, a la misma escala.

Una brújula de bolsillo antigua de latón, vista desde arriba. Imagen 1: la caja redonda con su argolla, el vidrio y una esfera de papel crudo con una rosa de los vientos dibujada en tinta, sin letras ni números, y sin aguja. Imagen 2: solo la aguja, larga y fina, una punta en rojo apagado y la otra en negro, con su eje central redondo, vista desde arriba y horizontal.
```

### 11. Moneda sola

Remotion la repite diez veces, tiñe las que caen y deja la cuarta a medias. Es una moneda genérica, no un sol real.

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin suelo, sin sombra proyectada, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato cuadrado 1024 × 1024, la moneda ocupa el 80 % del ancho.

Una sola moneda de metal amarillento gastado, vista de frente y plana, con el canto estriado y un borde en relieve. La cara tiene solo un relieve circular liso y borroso, sin números, letras, escudos ni retratos.
```

### 12. Cuatro libros de lomo y una repisa

Los títulos de sus libros los pone Remotion en cada lomo: tienen que leerse exactos.

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objetos aislados, sin sombra proyectada, sin texto legible, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato horizontal 1536 × 1024.

Cuatro libros académicos de tapa dura, de pie y separados entre sí, vistos de frente por el lomo: uno terracota, uno verde azulado, uno ocre y uno azul pizarra, de alturas y grosores apenas distintos. Cada lomo es liso, con un recuadro vacío en el centro y dos filetes finos arriba y abajo. Debajo, una repisa de madera oscura, larga y sencilla. Sin letras.
```

### 13. Fichero de madera

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin suelo, sin sombra proyectada, sin texto legible, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato horizontal 1536 × 1024.

Un cajón de fichero de biblioteca, de madera clara barnizada y gastada, visto de frente y un poco desde arriba, abierto, lleno de fichas de cartulina crema con pestañas de distintas alturas. Las fichas no tienen escritura. En el frente, un portaetiquetas de metal con una tarjeta vacía y un tirador.
```

## Lo que se queda en vector o en Remotion

Son contenido, o su forma es el argumento.

| Qué | Escena | Por qué no se pide en grabado |
|---|---|---|
| Barra de lo que produce el país, tajadas, contador de años | s00 | Son datos: tienen que ser exactos y animarse por unidades |
| Regla de 1680 a 2000 con la franja | s00 | Es una escala de tiempo |
| Fichas a máquina, sellos, rótulos, cifras y la tarjeta final | todas | Texto legible y exacto (gramática de la serie) |
| Línea de tiempo y cruz sobre negro | s01 | La muerte se cuenta con lo mínimo (§2.8); la línea es un recorrido medido |
| Mapa del Perú y de Lima, mapa del viaje | s02, s05 | Mapas: información (Natural Earth) |
| Piscina | s02 | Sus carriles se vuelven renglones: la transformación necesita líneas en vector |
| Afiches de los setenta y el volante | s03 | Son papeles que dicen algo, con texto legible (§2.9). Además, su estilo plano es el de la serigrafía de esa época: es el estilo del objeto, no del canal. Excepción declarada |
| Pizarra, tiza, capas de Braudel y la regresión | s04, s05 | Concepto (§2.3): el 0·2 también deja la tiza en vector |
| Gráfico del costo de la corrupción | s05 | Datos reales (§2.10) |
| Rótulo de la versión de los lujos, la flecha punteada y el tachón | s06 | Texto y gramática del corrector |

## Orden sugerido

1. Primero el n.º 1 (las pruebas) y el n.º 7 (el barco), y ponerlos junto a una figura del 0·2 antes de seguir: si el estilo cuadra en el objeto más plano y en el más grande, cuadra en todo.
2. Después, el resto de los de prioridad alta: son los que comparten los dos episodios.
3. Los de prioridad media solo si, al ver el 0·1 montado, la balanza, la brújula o el estante de vector se notan planos junto a los objetos nuevos.
