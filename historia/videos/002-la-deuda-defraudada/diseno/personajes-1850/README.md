# Personajes del Perú hacia 1850

Cuatro personajes dibujados con herramientas nativas de VectorCraft mediante MCP el 10 de noviembre de 2026. Adaptan el vestuario al episodio 002 y adoptan de las plantillas proporcionadas por Gerson la organización por piezas, manos y estados de expresión. Son dibujos propios, pendientes de revisión de Gerson.

- [Vestuario](personajes-1850-lamina1.png)
- [Expresiones y manos](personajes-1850-lamina2.png)
- [Estados de carga y entrega](personajes-1850-lamina3.png)
- [PDF de las tres láminas](personajes-1850.pdf)
- [Original editable de las láminas](personajes-1850.vectorcraft)
- [Guía de animación para Claude](ANIMACION.md)
- [Referencias de vestuario y de construcción](REFERENCIAS.md)

| Personaje | Vestuario | Piezas | Original | Datos de articulación |
|---|---|---|---|---|
| Trabajador | Camisa holgada, mangas remangadas, faja, pantalón, sombrero de ala corta | 33 | [VectorCraft](trabajador/trabajador.vectorcraft) | [rig.json](trabajador/rig.json) |
| Comerciante | Levita, chaleco, corbatín y cuello alto | 34 | [VectorCraft](comerciante/comerciante.vectorcraft) | [rig.json](comerciante/rig.json) |
| Funcionario civil | Levita oscura y chaleco; sin insignias supuestas | 34 | [VectorCraft](funcionario/funcionario.vectorcraft) | [rig.json](funcionario/rig.json) |
| Reclamante | Falda larga, corpiño, chal y cabello recogido | 34 | [VectorCraft](reclamante/reclamante.vectorcraft) | [rig.json](reclamante/rig.json) |

Cada personaje tiene un lienzo transparente de 900 × 1200. Las 135 SVG de piezas conservan ese mismo lienzo, con gradientes, nombre de grupo, orden y pivote. El nativo mantiene las variantes ocultas como capas editables. Las SVG con sufijo recorte y las poses completas sirven para colocar la ilustración o revisar el gesto; la animación articulada utiliza las piezas.

La vista es de tres cuartos. Las expresiones de reposo, atención, inquietud y esfuerzo se muestran en las láminas; también hay cejas de sorpresa y bocas A, O y MBP. Hay manos relajada, de agarre, para señalar y de apoyo. Los brazos, antebrazos, manos, piernas, cabeza y rasgos del rostro tienen piezas independientes. El sombrero de los civiles es opcional y está oculto por defecto; la reclamante usa el recogido y el chal.

Se actualizaron las viñetas 04, 07, 08, 11 y 14 del [storyboard 1](../storyboard-seccion01/revision-detallada/README.md). El canon queda disponible para revisar las figuras de las otras secciones; esos dibujos anteriores no se consideran sustituidos automáticamente. La reclamante es un personaje de ejemplo, no un retrato de Novoa. El comerciante de la oficina no identifica a un miembro de Gibbs & Sons.

La decisión de Gerson permite movimiento y expresión en el episodio 002 y sustituye la indicación anterior de figuras siempre quietas. El detalle de dirección está en [la revisión del episodio](../../revision_personajes.md). Las poses se revisaron estáticamente en VectorCraft; no se ha implementado ni comprobado todavía una animación en Remotion y no se generó video.
