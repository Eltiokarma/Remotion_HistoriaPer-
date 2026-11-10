# Resultado de la prueba

Informe de la primera muestra, conservada en la [versión 25493fd](https://github.com/Eltiokarma/Remotion_HistoriaPer-/tree/25493fd187a18d192783f3c32f35824f43598f4e/historia/laboratorio/muestras/15-islas-y-el-pais). La apertura revisada se documenta aparte en [recorrido/README.md](recorrido/README.md).

Extracto de «Las islas y el país» preparado a pedido de Gerson. El episodio completo sigue pendiente de integración.

## Medido

- 76.14 segundos; 960 × 540; 15 fps; 1142 cuadros.
- H.264 y AAC; **5.37 MB** frente a un presupuesto de 10 MB. Decodificación completa sin errores.
- Audio integrado: -17.05 LUFS; pico verdadero -4.20 dBTP. Ocho párrafos de locución sintética provisional.
- Render: 293.1 segundos en la laptop local Windows con Intel i7-11370H, dos capturas simultáneas. No extrapolar este tiempo a otra máquina o al episodio completo.
- No se utilizó una API de TTS de pago. No se midieron costo del modelo, tiempo humano ni pico de memoria.

## Observado y corregido

| Problema | Corrección | Evidencia |
|---|---|---|
| El mar invadía el pie del cuadro durante el acercamiento | Reencuadre inicial y máscara dentro de la pizarra | Registro textual; la captura previa no quedó respaldada |
| Rótulos duplicados durante la apertura comercial | Separar salida de la definición y entrada de las etiquetas | [Mercado corregido](resultados/final-1.jpg); la captura previa no quedó respaldada |
| El libro quedaba vacío al llegar | Recuperar la venta como concepto conocido y destacar las partidas con sus palabras | [Cuentas](resultados/final-2.jpg) |
| La flecha de ingreso quedaba suelta tras el paneo | Retirarla antes del cambio de escala y conservar el mismo edificio | [Secuencia del paneo](resultados/paneo.jpg) |
| El recorrido final podía sugerir emisión del reclamo por el Estado | Dibujar la relación desde el reclamo hacia el Estado | [Reclamo](resultados/final-4.jpg) |

Se inspeccionan fotogramas del MP4 comprimido y una secuencia de avance del paneo. El audio se verifica por sus archivos, tiempos, presencia de pista y medición de nivel; queda pendiente una escucha crítica humana. La aprobación de Gerson también está pendiente.

## Para qué sirve y qué falta

Permite revisar la voz provisional, la lectura a baja resolución, la apertura del esquema, la construcción del libro por piezas y la continuidad hacia el reclamo. El [inventario](inventario.json) identifica los 16 vectores integrados y sus fuentes.

Faltan la extracción y el trabajo humano, los agarres y traspasos, el contexto fiscal completo y las escenas 2–5. El grano dinámico y la música de la versión completa no se desarrollan aquí. No se declara integración completa del episodio ni aprobación audiovisual final.

[Mediciones y comprobaciones](resultados/validacion.json). [Instrucciones para reproducir](README.md). El MP4 se entrega localmente y no se sube al repositorio.
