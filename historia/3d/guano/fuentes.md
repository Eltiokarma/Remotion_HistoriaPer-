# Fuentes — experimento 3D: islas de Chincha hacia 1850

Clip de prueba, no es parte de ningún video todavía. Todo lo que la escena **afirma con la imagen**
(formas, alturas, cómo se cargaba) está abajo. Casi nada tiene fuente todavía: lo que dice
`[VERIFICAR]` no puede salir en un video publicado hasta resolverse (CLAUDE.md §1.1, regla 2).

El único libro cotejado del repo, Quiroz (2013), no describe las islas ni la carga. Solo dice, citando
a un diplomático en 1841, que el guano «se le encuentra en gran abundancia en unas pequeñas islas unos
cuantos grados al sur de Lima» (p. 165, ver [`bibliografia/quiroz-2013.md`](../../bibliografia/quiroz-2013.md)).
Y que en 1857 «barcos ingleses y franceses rondaban las islas» (pp. 183–185, en la ficha es paráfrasis,
no cita).

---

## Assets y licencias

| Elemento | Origen | Licencia |
|---|---|---|
| Toda la geometría (islas, cerros, mar, barcos, manga, sacos, aves) | Procedural, `escena.py` | Material propio |
| Materiales, cielo, niebla | Nodos procedurales en `escena.py` | Material propio |
| Texturas, HDRI, modelos externos | **Ninguno** (no se usó Poly Haven ni otro banco) | — |
| Blender 5.2.3 | Herramienta | GPL. La licencia no alcanza a lo que se renderiza con él |

---

## Lo que la imagen afirma

| # | Qué se ve | Qué puse | Estado | Dónde buscar |
|---|---|---|---|---|
| G1 | Tres islas: la Norte al frente y la Centro y la Sur detrás, en fila hacia el fondo | Separación de ~1 km y tamaños de 500 a 650 m de largo, a ojo | [VERIFICAR] forma, tamaño, orientación y distancias reales | Carta náutica actual (HIDRONAV), Cushman 2013 |
| G2 | Acantilados de roca oscura casi verticales | 24 m de alto | [VERIFICAR] altura y color de la roca | Fotos actuales (Agrorural / SERNANP) y grabados de la época |
| G3 | Cerros de guano blancos sobre la meseta | De 20 a 58 m por encima del borde del acantilado (hasta ~80 m sobre el mar en total) | [VERIFICAR]. Se cita a menudo que los depósitos medían decenas de metros de espesor; no tengo la cifra con fuente | Cushman 2013; Peck 1854 (testigo); Duffield 1877 |
| G4 | Color del guano | Papel del canal (#EDE4D3). En la realidad tiraba más a ocre o pardo claro | Decisión de estilo, pedida por la dirección («montañas blancas»). Declararla si se publica | — |
| G5 | Un corte vertical en el cerro más cercano (guano tostado por dentro) | La cara que deja la excavación | [VERIFICAR] que se excavaba así, en frentes verticales | Peck 1854; grabados de la época |
| G6 | Barco fondeado al pie del acantilado | Fragata mercante de tres palos, ~40 m de eslora, velas aferradas, casco negro con una franja clara y fondo forrado de cobre (verde óxido) | [VERIFICAR] el tipo y el tamaño típicos de los barcos guaneros hacia 1850, y si el casco pintado con franja corresponde | Mathew 1981 (registros de Gibbs); Lloyd's Register |
| G7 | Que los barcos se acercaban tanto a la isla (~30 m del pie del acantilado) | Puesto así para que la manga llegue a la cubierta | [VERIFICAR] | Peck 1854; Duffield 1877 |
| G8 | Flota que espera turno, seis barcos en la niebla | Seis, a ojo | [VERIFICAR] cuántos barcos esperaban a la vez hacia 1850 (se dice que llegaron a ser más de cien, no sé en qué año) | Cushman 2013; Levin 1960 |
| G9 | **Sacos que bajan por una manga de madera desde una plataforma hasta la escotilla** | Un saco cada 8 frames | **[VERIFICAR] — probablemente inexacto.** Lo que recuerdo, sin fuente a la mano: el guano se echaba **suelto** por mangas o tubos de lona («mangueras») desde lo alto del acantilado hasta lanchas o hasta la bodega. Los sacos son una licencia que pidió la dirección para que la carga se vea. Antes de publicar, confirmar el método o cambiar la escena | Peck 1854; Stewart 1951; grabados de la época |
| G10 | Plataforma de madera con una ruma de sacos en el borde | Inventada para que la manga tenga de dónde salir | [VERIFICAR] (depende de G9) | Ídem |
| G11 | Aves: guanayes en cintas largas sobre el mar y sobre la isla | *Leucocarbo bougainvillii*. Volando en filas a ~15 m/s, 1,3 m de envergadura | [VERIFICAR] envergadura, velocidad y cómo vuelan las bandadas | Guías de aves del Perú (Schulenberg et al.), IMARPE |
| G12 | Cielo cubierto, garúa, mar gris frío | Atmósfera pedida por la dirección | [VERIFICAR] si la garúa es frecuente frente a Pisco y en qué meses. La garúa limeña es de invierno | SENAMHI |
| G13 | Gallardete rojo en el tope del palo mayor | Un gallardete genérico, **no** la bandera de ningún país (a propósito: no sé de qué bandera era cada barco) | Sin afirmación histórica. Es el único rojo del cuadro | — |
| G14 | Sin personas | Pedido de la dirección. Probé tres siluetas lejanas al pie del corte, pero no se veían en ningún fotograma y las saqué | Cuando entren, es la parte más delicada: el trabajo lo hacían culíes chinos, presidiarios y otros trabajadores forzados, en condiciones terribles. Representarlo con respeto (DIRECCION_DE_VIDEO.md: «respeto en lo humano») y con fuente | Stewart 1951; Cushman 2013 |
| G15 | «Hacia 1850» | La escena no muestra nada que fije el año más allá de los barcos de vela | [VERIFICAR] que en 1850 ya se explotaba la isla Norte a esta escala | Cushman 2013; Levin 1960 |

### Bibliografía para resolver los [VERIFICAR] (no consultada todavía)

- Gregory T. Cushman, *Guano and the Opening of the Pacific World: A Global Ecological History*
  (Cambridge University Press, 2013).
- W. M. Mathew, *The House of Gibbs and the Peruvian Guano Monopoly* (Londres: Royal Historical
  Society, 1981).
- Jonathan V. Levin, *The Export Economies* (Harvard University Press, 1960). Tiene un capítulo
  sobre el guano peruano.
- Watt Stewart, *Chinese Bondage in Peru* (Duke University Press, 1951).
- George Washington Peck, *Melbourne, and the Chincha Islands* (Nueva York, 1854). Relato de un
  testigo, de dominio público. Puede servir también como fuente de grabados.
- Alexander J. Duffield, *Peru in the Guano Age* (Londres, 1877). De dominio público.
- Jorge Basadre, *Historia de la República del Perú*, capítulos del guano.

Las ediciones y los años de arriba son de memoria: hay que confirmarlos al conseguir los libros.
