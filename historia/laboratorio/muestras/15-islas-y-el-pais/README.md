# Prueba de montaje: Las islas y el país

Extracto del episodio 002 autorizado por Gerson el 10 de noviembre de 2026 como prueba económica con locución provisional. No es el episodio completo ni sustituye la revisión de sus cinco escenas largas.

## Qué integra

- Roca de Chincha, aves posadas, mar azul, barco, producto, mapa de Gran Bretaña, almacén y cultivos del kit vectorial detallado.
- Libro revisado separado en cubierta y páginas, venta, gastos y comisión, e ingreso del Estado.
- Edificio del Estado y folio de reclamo con campos y marca «Por revisar», exportados por selección mediante el MCP de VectorCraft.
- Apertura del encuadre para comparar origen y mercado; paneo hasta las cuentas y continuidad del mismo edificio al pasar al reclamo.
- Gradientes originales, sombra de papel, textura estática de pizarra, viñeta, foco, entradas ancladas a palabras y pausas.
- Voz sintética peruana `es-PE-AlexNeural`, ambiente de mar y cuarto, hoja y pluma. La voz se identifica en pantalla como provisional.

La flecha comercial es un esquema de relación, no un itinerario naval. El documento es un modelo editorial, sin importe inventado. La relación final se dibuja desde el reclamo hacia el Estado; no representa aprobación ni pago.

## Alcance y diferencias de la prueba

Se omiten aquí extracción, levantamiento y traspaso de sacos, actuación de personajes, contexto fiscal completo, Novoa e investigación. Quedan pendientes del montaje completo. Las aves del recurso están posadas: no se mueve todo el conjunto como si estuviera volando.

Exportación prevista: 960 × 540, 15 fps, H.264, video objetivo 650 kb/s y audio AAC 96 kb/s, con dos capturas simultáneas. Objetivo de archivo inferior a 10 MB. Los elementos fuera de cuadro se desmontan para reducir el trabajo de composición. El grano dinámico está desactivado para esta previa; se conservan textura, degradado, luz y volumen. La música de la versión completa no se desarrolla en este extracto.

Los MP4, los paquetes de render, las dependencias y las copias de las fuentes compartidas no se guardan aquí. Se respaldan el código, los vectores utilizados, los textos, la voz provisional y sus tiempos, y evidencia pequeña de la revisión.

## Reproducir

Desde `historia/`, con sus dependencias instaladas:

```sh
node laboratorio/muestras/15-islas-y-el-pais/preparar.mjs
npx remotion studio laboratorio/muestras/15-islas-y-el-pais/index.tsx --public-dir=laboratorio/muestras/15-islas-y-el-pais/public
node laboratorio/muestras/15-islas-y-el-pais/renderizar.mjs --solo-video
```

La salida por defecto es `historia/out/prueba-002/002-prueba-islas.mp4`. Los temporales quedan en `historia/laboratorio/out/15-islas-y-el-pais/`. Se pueden cambiar con `PRUEBA_OUTPUT_DIR` y `PRUEBA_TEMP_DIR`. `--solo-cuadros` revisa imágenes y `--reuse` reutiliza un paquete ya creado.

Los MP3 incluidos permiten reproducir sin solicitar otra locución. Para regenerarla se necesita Python con [edge-tts](https://github.com/rany2/edge-tts), acceso a su servicio y ffmpeg; ejecutar `crear_voz.py`. Si cambia el texto o la voz, borrar primero el MP3 y su archivo de palabras correspondiente; las pausas se pueden recalcular reutilizando el audio. `narracion.json` contiene el texto, la voz y las pausas; `tiempos.json` se calcula midiendo cada archivo. Los marcadores de palabras proceden del servicio y guían las revelaciones, sin afirmar alineación fonética manual.

## Fuentes y dirección

Se reutilizan los cotejos de [fuentes.md](../../../videos/002-la-deuda-defraudada/fuentes.md), el [kit detallado](../../../videos/002-la-deuda-defraudada/diseno/storyboard-seccion01/revision-detallada/README.md), los [dibujos revisados](../../../videos/002-la-deuda-defraudada/diseno/escenas-largas/recursos/revision-02/README.md) y la [dirección de movimiento](../../../videos/002-la-deuda-defraudada/diseno/escenas-largas/MOVIMIENTO-Y-EFECTOS.md). No se atribuye a esta prueba una nueva lectura independiente de los libros.

Los resultados medidos y las limitaciones observadas se registran en `INFORME.md`. La aceptación del director queda pendiente.
