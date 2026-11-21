# Animatic de la escena 4 del 0·2: «Lo investigan y los títulos siguen circulando»

Sobre la **voz real** (`voz/s04.mp3`, «Joder Jolines», `eleven_v4`), con el sistema que Gerson fijó en la escena 3 (muestra 16, versión F):

- mesa desaturada;
- papeles opacos que entran y salen con trayecto;
- texto escrito en tinta y etiquetas en tiras de cartón;
- medallones, y presentación en primer plano solo para quien aparece por primera vez.

El plan está en [`videos/002-la-deuda-defraudada/diseno/plan-animatic-s04.md`](../../../videos/002-la-deuda-defraudada/diseno/plan-animatic-s04.md).

La escena dura unos 3 min 33 s con los respiros, así que va en dos partes, para revisarla y renderizarla por mitades:

| Parte | Planos | Qué cuenta | Estado |
|---|---|---|---|
| **A** | 4.1–4.3 (frases 0–12) | El fraude y su nombre: la pila crece a 24 millones, se junta en pocas manos y se llama «los consolidados», viaja a Londres y vuelve limpia. | hecha, en revisión |
| B | 4.4–4.9 (frases 13–31) | La investigación y la absolución. | pendiente |

## Qué se ve en la parte A

- **4.1.**
  - Arranca en el archivo: la carpeta de Novoa entra en su estante.
  - La cámara baja a la mesa. Una línea de 1852 marca los plazos de junio y octubre, y antes de cada plazo se apilan los expedientes.
  - Con «cinco» aparece una pila de 5 vales, y con «veinticuatro», de 24: un vale por millón, así que la altura cuenta la cifra.
  - Con «uno por uno», una carpeta se abre.
- **4.2.**
  - La pila se reparte por la mesa y, con «pocas manos», se junta en tres pilas.
  - Con «varias docenas», salen fichas de papel unidas a su pila: la red.
  - Con «consolidados», la palabra del episodio va a pantalla completa y quieta. Es la única excepción de la escena. Después queda como etiqueta sobre la red.
- **4.3.**
  - Un vale se levanta y viaja de Lima a Londres sobre el mapa de la escena 1, con un tic por tramo, y se vuelve bono.
  - Con «Manuel de Mendiburu», su presentación en primer plano. Su etiqueta va en el bono.
  - Con «mitad», en el bono se escribe «≈ 46 % de toda la deuda consolidada, convertida en bonos».
  - Con «En el mercado», vuelta a la mesa: el vale y el bono, cada uno con su barra. «≈ 40 %» y «casi el 100 %» aparecen de a uno, y el 46 % se retira antes para que nunca haya dos porcentajes a la vez.
  - Con «manchado», el vale se mancha de rojo, y con «limpio», queda debajo del bono.

Los segundos de las palabras se midieron con Scribe sobre la voz.

## Provisional

- **Medallón de Mendiburu**: hasta que llegue el de ChatGPT, va una silueta (prompt en `diseno/prompts-chatgpt-s04.md`).
- **Etiquetas sin persona**: el vale y el bono llevan etiqueta sin medallón, porque son papeles sin un dueño con cara: «Vale de consolidación · Lima», y el bono lleva la de Mendiburu.

## Reproducir

Desde `historia/`:

```sh
node laboratorio/muestras/17-animatic-s04/preparar.mjs
node laboratorio/muestras/17-animatic-s04/renderizar.mjs A
```

La salida queda en `laboratorio/out/17-animatic-s04/`, fuera de git; los tiempos, en `resultados/render-A.json`. Las piezas (papel, etiqueta, medallón, presentación) se importan de `../16-animatic-novoa/Animatic.tsx`.
