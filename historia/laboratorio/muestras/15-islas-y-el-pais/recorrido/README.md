# Del mapa del Perú a Pisco y Chincha

Apertura solicitada por Gerson: acercarse desde el país hasta Pisco, pasar del mapa a una ciudad en 2D y salir sobre el mar hasta las islas. La dirección conserva una sola relación espacial: el Pacífico al oeste y las islas al oeste-noroeste de Pisco.

| Segundos | Acción |
|---|---|
| 0–3,3 | Perú en el mapa y punto de Pisco. |
| 3,3–7,7 | Acercamiento con peso; el punto de Pisco termina en la misma ancla de pantalla. |
| 8–9,8 | El plano cartográfico se inclina y da paso al paisaje lateral; Pisco conserva su ancla. |
| 9,8–12,2 | Pausa para reconocer Pisco y escuchar su nombre. |
| 12,2–17,5 | Travelling hacia el mar y las islas; la ciudad sale por la derecha y la roca entra por la izquierda. |
| 17,5–18,3 | Se encuadra el mar y se enlaza con el grabado aprobado en su posición y escala originales. |
| 18,3–21 | Isla y guano a la vista; pausa de lectura y cierre de la muestra. |

La ciudad tiene fachadas, puertas, contraventanas, cornisa, balcón, pasaje, playa y dunas, dibujados con el MCP de VectorCraft. Es una reconstrucción esquemática de época: no se afirma que reproduzca calles, edificios identificados o infraestructura portuaria de Pisco en 1850.

El contorno de Perú usa [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/) a 1:10 millones mediante world-atlas 2.0.2; es una referencia de localización, no un mapa de las fronteras de 1850. Pisco y Chincha conservan las coordenadas orientativas ya utilizadas en el episodio. El movimiento de cámara no representa un itinerario naval, una distancia o una escala física de la ciudad. No se dibuja un barco navegando por una ruta inventada.

## Archivos y continuidad

- [Editable de VectorCraft](pisco.vectorcraft), con capas de mapa, mar, costa, dunas y ciudad. La capa de mapa se activa para editarla; el fondo continental descartado permanece oculto.
- [Piezas e identificadores nativos](piezas.json), y cinco SVG independientes en `../public/prueba-002/`.
- [Geografía, rótulos y cámara](../geografia.json); [SVG del mapa preparado para su vista móvil](../mapa-inline.json).
- [Montaje](../GeografiaIntro.tsx), conectado a [Muestra.tsx](../Muestra.tsx).

El acercamiento modifica el viewBox del SVG, manteniendo el tamaño del lienzo. Así no se crea una imagen de decenas de miles de píxeles al ampliar. El paisaje posterior usa capas 2D, con menor desplazamiento de las dunas. El grabado de la roca y las aves conserva al llegar la transformación `translate(375,-160) scale(1.5)` del montaje anterior.

Se reutilizan los dos primeros archivos de locución provisional. Se añade una pausa de cuatro segundos para situar la ciudad; las entradas posteriores se desplazan juntas. La composición de muestra reproduce solo esos dos párrafos, evitando cortar la frase siguiente. No se solicita otra voz ni una API de mapas de pago.

## Comprobación

Se comparan el mapa, la transición a Pisco, el travelling y el enlace con la isla. Se corrigieron el fondo que ocultaba el azul del océano y el borde entre capas de mar durante el desplazamiento. Los datos medidos del MP4 y las comprobaciones quedan en `validacion.json`; la aprobación de Gerson está pendiente.

Evidencia previa: [fondo del mapa](antes-mapa.jpg) y [unión entre capas del mar](antes-mar.jpg). Las capturas corresponden al primer pase estático de esta apertura.

Solo se exporta esta apertura de 21 segundos. El resto del montaje revisado queda preparado en la fuente y conserva su comprobación audiovisual pendiente. Los navegadores, capturas, codificación y salida de esta entrega se guardan en D. El MP4 y los registros privados del equipo no se suben a GitHub.

## Resultado medido

Muestra de 21.01 segundos, 1.83 MB, 960 × 540 y 15 fps. Se decodifica completa sin errores. Audio: -16.82 LUFS y -4.60 dBTP de pico. El render tardó 113.8 segundos en la laptop local Windows, i7-11370H, con dos capturas simultáneas.

[Contacto del recorrido](contacto.jpg). [Perú](peru.jpg). [Pisco](pisco.jpg). [Travelling](travelling.jpg). [Llegada a las islas](islas.jpg). [Datos de comprobación](validacion.json).
