# Prompts para ChatGPT · objetos y papeles en el estilo de grabado

19 de noviembre de 2026. Las figuras que llegaron (`public/videos/003-la-deuda-defraudada/imagenes/chatgpt/`) tienen grano, sombreado de trazos y contorno de tinta; los objetos en SVG son de color plano. Para que figura y objeto parezcan del mismo mundo, los objetos que más se ven se piden en el mismo estilo. Los mapas, diagramas, tiza, fichas a máquina, sellos y rótulos siguen en vector o en Remotion: son información, no utilería.

## Cómo pedirlos

- Un chat por objeto (o por grupo, si sale bien), **adjuntando como referencia de estilo `reclamante-a-ofrece-folio.png` y `trabajador-2b-levanta-saco.png`**.
- **Sin texto legible, nunca.** ChatGPT deforma las letras y un documento con letras inventadas parece un facsímil falso. Donde haya escritura, que sean trazos de pluma ilegibles; las cifras, nombres y fechas los pone Remotion encima.
- Fondo transparente (PNG). Si no sale transparente, fondo blanco liso #FFFFFF, sin sombra proyectada: el montaje pone la sombra.
- Vista **frontal y plana** para los papeles (sirve igual sobre la pizarra, en una mano o sobre la mesa vista desde arriba). Luz suave desde arriba a la izquierda, como las figuras.
- Al recibirlos: guardarlos en la misma carpeta con el número de esta lista en el nombre (`obj-04-vale.png`), registrar fecha y prompt en `fuentes.md` y correr `python3 storyboard.py`.

## Estilo común (ya incluido en cada prompt)

Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados (crudo, ocre, terracota, verde azulado, marrón); luz suave desde arriba a la izquierda. Objeto aislado, sin suelo, sin sombra proyectada, sin texto legible, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF.

## Lista

| N.º | Objeto | Planos | Prioridad |
|---|---|---|---|
| 1 | Saco de guano abierto | 1.3 | alta |
| 2 | Saco de guano cerrado | 1.3 | alta |
| 3 | Folio de reclamo con pestaña roja | 1.5, 2.1–2.2, 2.6 | alta |
| 4 | Vale de consolidación | 2.4, 3.4–3.6, 4.3, 4.8 | alta |
| 5 | Pila de vales | 0.1–0.4, 4.1, 4.6, 4.9 | alta |
| 6 | Sobre de pago | 2.6 | alta |
| 7 | Carpeta de legajo, cerrada y abierta | 1.5, 3.1, 4.1 | media |
| 8 | Libro de la ley, abierto | 2.2, 2.5 | media |
| 9 | Folio sencillo (préstamo, bienes, respuesta, aprobación) | 2.1, 3.2–3.6 | media |
| 10 | Bono de deuda externa | 4.3 | media |
| 11 | Página de periódico | 4.4 | baja |
| 12 | Monedas | 2.4 | baja |

### 1. Saco de guano abierto

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin suelo, sin sombra proyectada, sin texto ni marcas, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato cuadrado 1024 × 1024, el objeto ocupa el 70 % del alto.

Un saco de yute grueso de mediados del siglo XIX, de pie, visto de frente y un poco desde arriba, con la boca abierta y el borde doblado hacia afuera. Está lleno hasta la mitad de guano: un polvo granuloso color ocre pálido y gris arena, que se ve por la boca. La tela tiene trama visible, costura lateral y algo de polvo en la base. Sin letras ni sellos en la tela.
```

### 2. Saco de guano cerrado

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin suelo, sin sombra proyectada, sin texto ni marcas, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato cuadrado 1024 × 1024, el objeto ocupa el 70 % del ancho.

El mismo saco de yute, ahora lleno y cerrado con una cuerda atada en la boca, visto de frente y apenas inclinado, como si alguien lo sostuviera por los costados: unos 35 cm de ancho y 50 cm de alto, panzón y pesado, con la tela tensa y arrugas en las esquinas. Sin letras ni sellos.
```

### 3. Folio de reclamo con pestaña roja

Es el papel que el espectador sigue de la escena 1 a la 2: la pestaña roja lo identifica.

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin sombra proyectada, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato vertical 1024 × 1365.

Una hoja de papel grueso de oficio de mediados del siglo XIX, vista de frente y plana, color crudo con los bordes un poco amarillentos y una esquina apenas doblada. En el borde superior izquierdo, una pestaña de papel rojo apagado sujeta con un hilo. La hoja tiene renglones de escritura a pluma en tinta sepia, pero son trazos ilegibles, sin letras reconocibles. La mitad inferior de la hoja queda en blanco, para poner encima un sello y un rótulo.
```

### 4. Vale de consolidación

El documento central del episodio. Tiene que poder leerse como «título del Estado» sin una sola letra: el marco lo dice.

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin sombra proyectada, sin marco exterior. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato horizontal 1536 × 1024.

Un título de deuda pública de mediados del siglo XIX, visto de frente y plano: papel grueso color marfil, con un marco doble impreso en tinta sepia y ornamentos de grabado en las esquinas, una franja de guilloché fino en el borde superior y un pequeño óvalo vacío a la izquierda, como para un escudo, sin dibujar ningún escudo. El centro del documento queda en blanco, sin letras ni números: ahí se pondrán la cifra y el texto. Desgaste leve en los bordes. Sin escudos nacionales, banderas ni texto legible.
```

### 5. Pila de vales

Se usa para mostrar la deuda que crece: en el montaje se revela de abajo hacia arriba, así que tiene que ser alta y pareja.

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin suelo, sin sombra proyectada, sin texto legible, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato vertical 1024 × 1792.

Una pila alta y ordenada de documentos de papel marfil apilados uno sobre otro, vista de frente a la altura de los ojos, de modo que se ven los cantos de cientos de hojas como franjas finas y desiguales, con algún papel que sobresale un poco. Arriba de todo, la hoja superior se ve apenas en perspectiva, con un marco doble impreso en sepia. La pila es recta, del mismo ancho de abajo arriba, y ocupa casi todo el alto del cuadro. Sin cintas, sin pesos encima, sin texto legible.
```

### 6. Sobre de pago

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin sombra proyectada, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato horizontal 1024 × 768.

Un sobre de papel grueso color ocre claro de mediados del siglo XIX, visto de frente y plano, cerrado con un sello de lacre rojo oscuro sin escudo ni letras. Algo abultado, como si llevara billetes o papeles dentro. Sin dirección escrita, sin texto.
```

### 7. Carpeta de legajo, cerrada y abierta

Pedir las dos en el mismo chat, para que sean la misma carpeta.

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin sombra proyectada, sin texto legible, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Dos imágenes de 1536 × 1024.

Una carpeta de expediente de mediados del siglo XIX, de cartón grueso marrón con las esquinas gastadas y una cinta de tela atada. Vista desde arriba, plana. Imagen 1: cerrada, con una etiqueta de papel blanco vacía en la tapa. Imagen 2: la misma carpeta abierta como un libro, las dos tapas planas, con varias hojas sueltas de papel crudo en el lado derecho, escritas con trazos ilegibles. Sin texto legible.
```

### 8. Libro de la ley, abierto

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin sombra proyectada, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato horizontal 1536 × 1024.

Un libro grande de tapas de cuero marrón de mediados del siglo XIX, abierto y plano, visto desde arriba. Las dos páginas de papel crudo tienen columnas de texto impreso, pero son líneas grises ilegibles, sin letras reconocibles. En la página derecha, a media altura, hay dos renglones dejados en blanco, separados por texto, con el espacio vacío bien visible. Una cinta roja de marcador cae sobre la página izquierda.
```

### 9. Folio sencillo

Una hoja base para el préstamo, los bienes tomados, la respuesta de Echenique, la aprobación y lo recibido por Novoa: Remotion pone encima el rótulo de cada uno.

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin sombra proyectada, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato vertical 1024 × 1365.

Una hoja de papel de oficio de mediados del siglo XIX, vista de frente y plana, color crudo con bordes apenas amarillentos. Solo el tercio superior tiene unas pocas líneas de escritura a pluma en tinta sepia, ilegibles; el resto de la hoja queda en blanco. Sin pestaña, sin sellos, sin texto legible.
```

### 10. Bono de deuda externa

Tiene que distinguirse del vale a primera vista: otro color de tinta y otra forma, más lujosa.

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin sombra proyectada, sin marco exterior. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato horizontal 1536 × 1024.

Un bono financiero europeo de mediados del siglo XIX, visto de frente y plano: papel blanco limpio, marco impreso en tinta verde azulada con guilloché fino y ornamentos más ricos que un documento común, y una tira de cupones recortables en el borde inferior separados por líneas de puntos. El centro queda en blanco, sin letras ni números. Sin escudos, banderas, retratos ni texto legible. Se ve nuevo y sin desgaste.
```

### 11. Página de periódico

Solo si las cartas de *El Comercio* necesitan algo más que la ficha. No simula el periódico real: el nombre y la fecha los pone Remotion.

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin sombra proyectada, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato vertical 1024 × 1365.

Una página de periódico de mediados del siglo XIX, vista de frente y plana, papel amarillento: cuatro columnas estrechas de texto impreso apretado, todo en líneas grises ilegibles sin letras reconocibles, y una franja superior vacía donde iría la cabecera. Sin ilustraciones ni anuncios. Sin texto legible.
```

### 12. Monedas

```text
Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objetos aislados, sin suelo, sin sombra proyectada, sin marco. Fondo transparente (PNG); si no es posible, blanco liso #FFFFFF. Formato horizontal 1024 × 768.

Un pequeño grupo de cinco monedas de plata gastadas de mediados del siglo XIX, sueltas y algo superpuestas, vistas desde arriba. Las caras muestran solo un relieve borroso, sin letras, números, escudos ni retratos reconocibles.
```

## Lo que sigue en vector o en Remotion

Mapa y localizadores, diagrama de venta, flechas y llaves de tiza, barras de precio y valor, fichas a máquina, sellos con fecha, rótulos y cifras, y la mancha roja del lavado (se pinta sobre el vale en el montaje). El barco y el edificio del Estado vienen de las láminas aprobadas del 001; si junto a las figuras se notan planos, se piden después en este mismo estilo.
