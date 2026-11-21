# Prompts para ChatGPT · tres papeles distintos para la escena 3

21 de noviembre de 2026. Lo pidió la auditoría estética del animatic de la escena 3 (laboratorio 16, versión E6, elegida por Gerson). Hoy el folio de Elías, la respuesta de Echenique y la parte de Novoa son la misma imagen (`obj-09-folio-sencillo.png`). Con las etiquetas se sabe de quién es cada uno, pero a la vista son tres copias del mismo papel. Cada dueño necesita un papel que diga qué clase de documento es antes de que se lea el nombre:

| N.º | Archivo | Dueño | Qué es | Plano |
|---|---|---|---|---|
| 13 | `obj-13-carta-elias.png` | Domingo Elías | Carta privada de un capitalista, doblada en tres | 3.2, 3.5 |
| 14 | `obj-14-oficio-echenique.png` | Echenique (gobierno) | Oficio del gobierno en papel sellado | 3.3 |
| 15 | `obj-15-recibo-novoa.png` | Ignacia Novoa | Recibo de vales, una tira de papel más angosta | 3.6 |

## Cómo pedirlos

- Los tres en el **mismo chat**, uno por mensaje, para que tengan la misma mano y la misma luz.
- Adjuntar como referencia de estilo `obj-09-folio-sencillo.png` y `obj-04-vale.png` (los dos papeles que ya están en pantalla).
- **Sin texto legible.** Remotion escribe encima las cifras y los nombres. Por eso cada papel deja **libre la mitad de abajo**: ahí van «pide 500 000–600 000», «Fuera de plazo» o «≈ 180 000 de los 948 500».
- Mismo formato vertical que el folio de hoy (3 : 4), para que el animatic no cambie de posiciones.
- Al recibirlos: guardarlos en `public/videos/002-la-deuda-defraudada/imagenes/chatgpt/` con el nombre de la tabla, registrar fecha y prompt en `fuentes.md` y correr `python3 galeria.py`.

## Estilo común (ya incluido en cada prompt)

Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin sombra proyectada, sin marco.

### 13. Carta de Domingo Elías

```text
Usa las ilustraciones adjuntas solo como referencia de técnica, paleta, grano y grosor de línea; no copies sus papeles. Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin sombra proyectada, sin marco. Fondo transparente (PNG con canal alfa); si no es posible, blanco liso #FFFFFF. Formato vertical 1086 × 1448; la hoja ocupa casi todo el cuadro, con un margen pequeño.

Una carta privada de un hombre de negocios de Lima, hacia 1852, vista de frente y plana. Papel de carta de buena calidad, color marfil algo más claro y más liso que un papel de oficio, con las marcas de haber estado doblado en tres: dos pliegues horizontales visibles, apenas sombreados. Escritura a pluma en tinta sepia oscura, inclinada y segura, solo en el tercio superior: un encabezado corto, unas cinco líneas ilegibles y una rúbrica grande y enlazada al final de ese tercio. Los dos tercios de abajo quedan en blanco, con el papel limpio. En la esquina superior derecha, un pequeño resto de lacre rojo oscuro roto, de cuando la carta estuvo sellada. Sin sellos oficiales, sin membrete, sin escudo, sin texto legible.
```

### 14. Oficio del gobierno (respuesta de Echenique)

```text
Usa las ilustraciones adjuntas solo como referencia de técnica, paleta, grano y grosor de línea; no copies sus papeles. Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin sombra proyectada, sin marco. Fondo transparente (PNG con canal alfa); si no es posible, blanco liso #FFFFFF. Formato vertical 1086 × 1448; la hoja ocupa casi todo el cuadro, con un margen pequeño.

Un oficio del gobierno peruano de mediados del siglo XIX en papel sellado, visto de frente y plano. Papel de oficio grueso, color crudo grisáceo, más frío y más áspero que una carta privada, con el borde izquierdo algo gastado. Arriba a la izquierda, un sello oficial redondo impreso en tinta negra desvaída, de unos 4 cm, con un dibujo simple de grabado y un anillo de letras ilegibles; nada reconocible como escudo. Debajo, una franja estrecha de letras impresas ilegibles y luego cuatro líneas de escritura de amanuense, rectas y regulares, en tinta negra, ilegibles. Un margen ancho a la izquierda, marcado por un doblez vertical. Los dos tercios de abajo quedan en blanco. Sin rúbrica, sin lacre, sin texto legible.
```

### 15. Recibo de Ignacia Novoa

```text
Usa las ilustraciones adjuntas solo como referencia de técnica, paleta, grano y grosor de línea; no copies sus papeles. Ilustración dibujada a mano con contorno de tinta negro, fino y continuo; color de lápiz y acuarela con grano de papel y sombreado en trazos, como un grabado coloreado; colores cálidos y apagados; luz suave desde arriba a la izquierda. Objeto aislado, sin sombra proyectada, sin marco. Fondo transparente (PNG con canal alfa); si no es posible, blanco liso #FFFFFF. Formato vertical 1086 × 1448; el papel ocupa el alto del cuadro y deja aire a los lados.

Un recibo de mediados del siglo XIX: media hoja de papel crudo cortada a mano, más angosta que una hoja de oficio, con el borde superior irregular y rasgado, como arrancado de un talonario. Arriba, dos líneas cortas de escritura a pluma en tinta sepia, ilegibles, y una raya horizontal hecha con regla. Al costado derecho, una columna estrecha con tres o cuatro trazos cortos, como un renglón de cuentas, ilegibles. El resto del papel, de la mitad hacia abajo, queda en blanco. Abajo a la izquierda, una firma pequeña y vacilante, distinta de la rúbrica de un hombre de negocios. Sin sellos, sin lacre, sin texto legible.
```

## Notas de rigor

- No hay imagen conocida de estos documentos: son papeles genéricos de la época que dicen qué tipo de documento es cada uno. Por eso no llevan texto legible ni escudos que puedan confundirse con un facsímil.
- El «papel sellado» de las oficinas públicas peruanas del siglo XIX llevaba un sello impreso arriba. Se pide genérico y sin escudo para no inventar uno. [VERIFICAR con una imagen de archivo si se quiere el sello exacto de 1852.]
- Que Novoa firme «vacilante» es un recurso visual, no un dato: no sabemos cómo firmaba. Si molesta, se pide sin firma.
