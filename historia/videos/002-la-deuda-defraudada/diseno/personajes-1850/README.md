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

El rostro tiene una vista casi frontal, con un giro leve. Las expresiones de reposo, atención, inquietud y esfuerzo se muestran en las láminas; también hay cejas de sorpresa y bocas A, O y MBP. Hay manos relajada, de agarre, para señalar y de apoyo. Los brazos, antebrazos, manos, piernas, cabeza y rasgos del rostro tienen piezas independientes. El sombrero de los civiles es opcional y está oculto por defecto; la reclamante usa el recogido y el chal.

Se actualizaron las viñetas 04, 07, 08, 11 y 14 del [storyboard 1](../storyboard-seccion01/revision-detallada/README.md). El canon queda disponible para revisar las figuras de las otras secciones; esos dibujos anteriores no se consideran sustituidos automáticamente. La reclamante es un personaje de ejemplo, no un retrato de Novoa. El comerciante de la oficina no identifica a un miembro de Gibbs & Sons.

La decisión de Gerson permite movimiento y expresión en el episodio 002 y sustituye la indicación anterior de figuras siempre quietas. El detalle de dirección está en [la revisión del episodio](../../revision_personajes.md). Las poses se revisaron estáticamente en VectorCraft; no se ha implementado ni comprobado todavía una animación en Remotion y no se generó video.

## Corrección anatómica de los rostros

Revisión del 10 de noviembre de 2026 a pedido de Gerson. Se eliminó la nariz de perfil que formaba parte del contorno y duplicaba los trazos interiores. La mejilla ahora tiene una curva continua y una sola nariz dentro del plano facial, entre los ojos y la boca. Nariz y oreja tienen grupos distintos dentro de 20_cabeza: nariz_central y oreja_visible.

Se corrigieron los cuatro modelos, cuatro poses y ocho expresiones exportadas. Se sustituyeron las dieciocho figuras de las láminas y las seis figuras de las cinco viñetas del storyboard 1. Las otras 131 piezas SVG y los datos de los gestos conservan sus bytes.

- [Detalle de Atención corregido](qa/rostro-atencion-corregido.png)
- [Lámina anterior para comparar](https://github.com/Eltiokarma/Remotion_HistoriaPer-/blob/a1210a30b6d733f7005f6e03bc12bda5038de5f9/historia/videos/002-la-deuda-defraudada/diseno/personajes-1850/personajes-1850-lamina2.png)

La revisión se hizo sobre los vectores de origen y sus copias incrustadas. La ropa, los pivotes y las combinaciones de expresión se mantienen. Sigue pendiente la aprobación visual de Gerson.
