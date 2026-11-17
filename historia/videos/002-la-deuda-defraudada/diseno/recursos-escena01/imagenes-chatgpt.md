# Imágenes que hay que generar en ChatGPT · Escena 1

Lista concreta para el reparto vigente: ChatGPT hace personajes PNG con transparencia y, si conviene, fondos; los objetos ya existen en SVG. Las medidas y puntos se refieren a la [composición de trabajo y embarque](revision/composicion-trabajo-embarque.png) y a la [hoja de montaje](revision/hoja-montaje.png) (cuadro 1920 × 1080). Pendiente de que Gerson apruebe esta lista antes de generar.

## Condiciones comunes a todos los personajes

- **Referencia de estilo y vestuario:** adjuntar `../personajes-1850/personajes-1850-lamina1.png` (trabajador: camisa holgada clara con mangas remangadas, faja, pantalón, sombrero de ala corta) y una captura de `revision/composicion-trabajo-embarque.png`. Ilustración plana con contorno fino oscuro, degradados suaves y paleta ocre, arena, verde oliva apagado; nada fotográfico ni 3D.
- **Archivo:** PNG con fondo transparente real (canal alfa), figura completa de pies a cabeza, al menos 2048 px de alto, con un margen libre del 5 % alrededor. Sin suelo, sombra proyectada, texto ni marco: la sombra la pone el montaje.
- **Perspectiva:** vista lateral a la altura de los ojos (horizonte del cuadro en y = 568), sin contrapicado ni escorzo fuerte. Pies apoyados sobre una misma línea horizontal.
- **Luz:** cálida y suave desde arriba a la izquierda, como el grabado de las islas del episodio 001.
- **Escala de montaje:** la figura ocupará ≈ 440 px de alto en el cuadro final.
- **Manos sin objeto:** las manos se dibujan cerradas o abiertas en la posición de agarre, **sin la pala ni el saco**, que se ponen después como SVG. Un mango de unos 7 px de grosor a escala de cuadro (asta de 18 px al 37 %) debe caber dentro del puño.
- **Rigor:** las figuras representan funciones, no personas identificadas. En las islas trabajaron jornaleros libres, presos, personas esclavizadas y trabajadores chinos sometidos a coerción (Q, pp. 164–169; B, pp. 10–11), pero la condición jurídica no se deduce del aspecto: sin cadenas, látigos, capataces, rasgos caricaturizados ni gestos de sufrimiento teatral. Rostro sereno y concentrado en el esfuerzo.

## 1. Trabajador 1 · extrae y llena (momento 1B)

| Pose | Qué hace | Encuadre y orientación | Puntos de contacto (cuadro) |
|---|---|---|---|
| 1A · hunde la pala | De pie, tres cuartos de perfil mirando a la izquierda, hacia el depósito. Rodillas algo flexionadas, peso adelante, torso inclinado unos 10°. La mano derecha cierra arriba (empuñadura en D) a la altura del hombro; la izquierda, más baja y adelantada, sobre el mango. | Cuerpo entero. Ocupa x ≈ 600–820, pies en y = 1000. | Mano superior (766, 609); mano inferior (633, 703). El mango va de arriba a la derecha hacia abajo a la izquierda, unos 55° respecto a la vertical. |
| 1B · vierte en el saco | Gira hacia la derecha, hacia el saco abierto; brazos bajos y adelante, como sosteniendo una pala cargada sobre la boca del saco. | Tres cuartos de perfil mirando a la derecha. Pies en y = 1000, x ≈ 640–840. | Las manos quedan sobre la boca del saco (centro de la boca ≈ 900, 814). |

## 2. Trabajador 2 · prepara y lleva el saco (momentos 1B–1C)

| Pose | Qué hace | Encuadre y orientación | Puntos de contacto (cuadro) |
|---|---|---|---|
| 2A · sujeta el saco apoyado | Agachado, rodillas flexionadas, espalda recta; las dos manos abiertas rodean los lados de un saco que sigue en el suelo. | Tres cuartos de perfil mirando a la derecha. | Agarres a la altura de las caderas del saco: separación ≈ 103 px entre manos. |
| 2B · levanta | De pie, el saco a la altura del pecho, sostenido por ambos lados; las manos no cruzan el torso. | De frente a tres cuartos, mirando a la derecha. Pies en y = 985, x ≈ 1290–1510. | Agarres en (1375, 736) y (1478, 736). |
| 2C · camina con el saco | Igual que 2B, pero dando un paso: pierna izquierda adelante, peso visible del saco (hombros algo bajados). | Mirando a la derecha, hacia el borde de la roca y el barco. | Mismos agarres, desplazados con el cuerpo. |

## 3. Fondo opcional · superficie de la isla (1B)

Solo si la composición necesita más profundidad que el cielo y el mar del grabado v3. Debe pedirse **después** de que Gerson revise la composición de prueba.

- Lámina horizontal 1920 × 1080 (o 3840 × 2160), sin personas, herramientas, barcos, construcciones, muelles ni mecanismos de carga.
- Horizonte en y = 568; mar a la derecha y al fondo; en primer plano a la izquierda, una explanada de guano estratificado sobre roca oscura, que termina en un borde de roca a la derecha (x ≈ 1450).
- Misma luz y paleta que las condiciones comunes. Mar azul verdoso (DIRECCION_DE_VIDEO §2.13: el agua es azul), cielo de papel claro.
- PNG o JPG opaco; no hace falta transparencia.

## Lo que no hay que generar

- Objetos (pala, sacos, barco, edificio, carpeta, folios, libro, mapa): ya están en SVG en `svg/`.
- Retrato de Castilla para 1D: se usa la ficha a máquina del canal.
- Comerciante, funcionario o agente de la casa consignataria: el storyboard vigente no los pide en esta escena.
