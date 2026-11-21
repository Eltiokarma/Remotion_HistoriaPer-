# Informe · animatic de la escena 4

## Parte A: auditoría de A1 y versión A2 (21 de noviembre de 2026)

Gerson, al ver A1: «Se ve bien, pero en partes tiene poco movimiento, se desperdicia un poco el tiempo de pantalla, incluso con texto estaría más llenito». Auditoría con `estructura-visual-motion` (protocolo de revisión de video).

**Veredicto de A1.**

- ¿Se entiende? Sí: la pila, el nombre, Londres y el lavado se leen.
- ¿Se siente? A medias: hay tramos largos sin cambio mientras la voz sigue explicando.

**Diagnóstico** (capa de secuencia): la imagen llega con su palabra y después se queda quieta durante la frase de «sentido». La voz sigue dando información, y la pantalla no suma nada.

**Prueba aplicada:** diferencia media entre cuadros (a 10 fps y 192 × 108). En A1, el 76 % del tiempo está quieto (diferencia < 0,15). Hay tramos quietos de más de 2 s que no son respiros:

| Tramo de video | Voz | Qué decía la voz |
|---|---|---|
| 13,6–24,3 s | frases 2–4 | «que el Estado tendría que pagar», «no toda la diferencia fue fraude» |
| 43,2–51,6 s | frase 8 | «la palabra… terminó nombrando…» |
| 65,4–77,2 s | frases 11–12 | el mercado y el lavado |

**Hojas de revisión, cada una con su cambio en A2:**

| # | Momento | Observación | Cambio (A2) | Cómo comprobar |
|---|---|---|---|---|
| 1 | 4.1, después de «veinticuatro» | La pila llega a 24 y no dice nada más. | Tiras con datos que la voz no da: «5 millones · 1851» en la altura de 5 y «24 millones · 1852» arriba (Q, p. 170). Debajo, «≈ 3 400 millones de soles de hoy*» (el mismo cálculo de la escena 3, en `fuentes.md`). | ¿Se nota que la pila creció en un año? |
| 2 | 4.1, «el Estado tendría que pagar» | La frase nombra al deudor y no se ve. | Entra el edificio del Estado de la escena 1 con la etiqueta «Estado peruano · deudor». Una flecha roja va de la pila al Estado: el rojo de la culpa, para la deuda inflada hacia el Estado (CLAUDE §1.3). | ¿Quién paga? |
| 3 | 4.1, «no toda la diferencia fue fraude» | «La diferencia» queda abstracta. | Una llave entre 5 y 24 y la tira «la diferencia: 19 millones». Después, la carpeta que se abre se aparta de las tiras. | ¿Cuánto hay que revisar? |
| 4 | 4.2, frase 8 | La red queda quieta 8 s. | Con «una forma de pagar», la tira «Consolidación · ley de 1850»; con «nombrando», una flecha hacia «Los consolidados»; con «robo político», las fichas de la red se vuelven rojas de a una. | ¿La palabra cambió de qué a qué? |
| 5 | 4.3, frase 12 | Las barras ya están llenas y no pasa nada hasta «manchado». | Un arco del 40 % al casi 100 % con la tira «al cambiarlo por bono: ≈ 2,5 veces más» (100 / 40). Explica por qué convenía convertir, que la voz no dice. | ¿Por qué cambiaban vales por bonos? |
| 6 | detalle | En la primera prueba de A2, la carpeta abierta pisaba las tiras, la flecha cruzaba «la diferencia» y la nota del asterisco quedaba detrás del rótulo de versión. | Se movieron la carpeta, la flecha y la nota. | Cuadros 19,5, 23,5 y 26 s |

**Lo que funciona y no se toca:** la pila que crece vale por vale, la palabra a pantalla completa, el viaje con su tic y la mancha.

**Lo que no se cambió:** los respiros de montaje siguen quietos a propósito (CLAUDE §8: la imagen terminada sostiene el párrafo).

### A3: cámara con motivo en los tramos de sentido

A2 tenía más información, pero la medición seguía casi igual: los datos nuevos entran y se quedan fijos. En A3 se agrega un acercamiento lento de cámara (peso `solemne`) hacia lo que la voz examina, solo en los tramos de sentido que seguían quietos. La cámara vuelve a 1 con la salida de cada plano. Los respiros y la palabra del episodio siguen quietos a propósito.

| Tramo | Escala | Hacia | Motivo |
|---|---|---|---|
| 4.1, de «Esos millones» a «uno por uno» | 1 → 1,06 | la pila y su diferencia | lo que hay que revisar |
| 4.2, frase 8 | 1 → 1,07 | la red | la palabra que pasa de una ley a unas personas |
| 4.3, del 40 % al final | 1 → 1,05 | las barras | la ganancia de convertir |

**Medición** (diferencia media entre cuadros < 0,15, a 10 fps; mismo método en las tres):

| Versión | Tiempo quieto | Tramos quietos de más de 2 s | Render (contenedor) |
|---|---:|---|---:|
| A1 | 76 % | 11, el más largo de 8,4 s | 210,8 s |
| A2 | 75 % | 12, el más largo de 7,1 s | 237,8 s |
| A3 | 48 % | 6 | 289,9 s |

Los seis tramos quietos de A3:

- **El respiro final** (79,6–82,4 s).
- **De «docenas» hasta la salida de la palabra del episodio** (31,2–43,1 s). Contiene la palabra a pantalla completa, que es quieta a propósito.
- **Antes de «cinco»** (9,8–12,0 s): la mesa espera la cifra.
- **Antes de «casi»** (65,4–67,6 s): 2,2 s.

Los dos últimos se pueden aceptar.

Sigue pendiente la prueba con otra persona: preguntarle, sin anticipar nada, «¿qué pasó con los vales y por qué convenía cambiarlos?».
