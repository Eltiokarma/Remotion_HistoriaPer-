import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

const lugar = z.object({ nombre: z.string(), lon: z.number().min(-180).max(180), lat: z.number().min(-90).max(90) });

/**
 * Un método en seis cuadros: la ruta que duda y cambia de destino, la ficha de la beca, la
 * nube de puntos con su recta (los discursos se apagan), una balanza con dos palabras, los
 * temas como libros en una repisa, un aula que se llena y una brújula que gira entre dos épocas.
 */
export const esquema = z.object({
  origen: lugar,
  /** El destino que todos soñaban: la ruta llega a medias, duda y se borra. */
  tentacion: lugar,
  /** A donde fue de verdad. */
  destino: lugar,
  /** Distancia en línea recta del origen al destino, en km (el contador del viaje; sin ella, no hay contador). */
  distancia_km: z.number().int().positive().optional(),
  /** Encuadre del mapa en grados: [oeste, sur, este, norte]. */
  encuadre: z.tuple([z.number(), z.number(), z.number(), z.number()]).default([-105, -28, 22, 62]),
  ficha: z.string(),
  balanza: z.tuple([z.string(), z.string()]),
  temas: z.array(z.string()).min(1).max(5),
  ficha_aulas: z.string().optional(),
  /** false: sin el aula que se llena (la carrera va en la ficha del estante, sin narrarla). */
  aula: z.boolean().default(true),
  /** Ficha a máquina sobre el estante (p. ej. dónde enseñó). */
  ficha_estante: z.string().optional(),
  /** La recta «busca» su lugar y se marca su pendiente: para explicar qué es una regresión. */
  explicar_regresion: z.boolean().default(false),
  /** A la izquierda del gráfico, un fichero de archivo del que salen los puntos (de dónde vienen los datos). */
  fichero: z.boolean().default(false),
  /** Las dos épocas de la brújula. */
  brujula: z.tuple([z.string(), z.string()]),
  /** "arriba-abajo" (sin lectura política) o "izquierda-derecha": la aguja va de tope a tope (revisión del director). */
  brujula_polos: z.enum(['arriba-abajo', 'izquierda-derecha']).default('arriba-abajo'),
  /** Lo que se escribe junto a cada polo (hechos con fuente, no frases inventadas), un renglón por línea. */
  brujula_notas: z.tuple([z.array(z.string()), z.array(z.string())]).optional(),
  /** La frase que se escribe con tiza cuando la brújula pasa a la pizarra. */
  brujula_frase: z.string().optional(),
  /** Título en pantalla del método (DIRECCION_DE_VIDEO §2.4). */
  titulo_metodo: z.string().optional(),
  /** Rótulo del gráfico (p. ej. "Regresión"), con el beat `regresion`. */
  rotulo_grafico: z.string().optional(),
  /**
   * Del método al dato (beat `serie`): la nube se vuelve una serie real que el autor midió, un
   * punto por etiqueta, que se enciende con su valor. Sin recta ajustada: solo sus números.
   */
  serie: z.object({
    rotulo: z.string(),
    unidad: z.string(),
    etiquetas: z.array(z.string()).min(2),
    valores: z.array(z.number()).min(2),
    maximo: z.number().positive(),
    banda: z.tuple([z.number(), z.number()]).optional(),
    texto_banda: z.string().optional(),
    fuente: z.string().optional(),
    /** La página del cuadro que se ve a la izquierda, con su título y las dos columnas. */
    cuadro: z.object({ titulo: z.string(), columnas: z.tuple([z.string(), z.string()]) }).optional(),
  }).refine((s) => s.etiquetas.length === s.valores.length, { message: 'una etiqueta por valor' }).optional(),
});

export const beats = {
  mapa: 'aparece el mapa',
  paris: 'sale la ruta hacia la tentación',
  duda: 'la ruta se detiene, duda y se borra',
  sale: 'la cámara retrocede apenas y se lanza: sigue la ruta hacia el destino (se encienden los paralelos al cruzarlos)',
  llega: 'la ruta llega: sello y campana',
  abre: 'la cámara se abre hasta ver la ruta entera, y se asienta',
  ficha: 'se escribe la ficha',
  puntos: 'papel milimetrado: caen los puntos (3 s)',
  caen: '(con explicar_regresion) caen los puntos (el papel ya estaba)',
  recta: 'se traza la recta de regresión',
  pendiente: '(con explicar_regresion) se marca la pendiente: cuánto pesa',
  discursos: 'los bloques de discurso se apagan',
  balanza: 'aparece la balanza',
  profundidad: 'cae la primera palabra (se inclina)',
  claridad: 'cae la segunda (se equilibra)',
  estante: 'aparece la repisa',
  temas: 'bajan los temas, uno cada 0.5 s',
  aulas: '(con aula) el aula se va llenando',
  brujula: 'aparece la brújula',
  giro: 'la aguja gira despacio de una época a la otra (izquierda-derecha: va al otro tope)',
  izquierda: '(izquierda-derecha) la aguja va al primer tope; se escriben sus notas',
  tiza: '(con brujula_frase) la brújula y su fondo pasan a la pizarra; los rótulos se borran',
  frase: '(con brujula_frase) se escribe la frase con tiza',
  regresion: '(con rotulo_grafico) aparece el rótulo del gráfico',
  serie: '(con serie) la nube se va, los puntos viajan a la serie real y se encienden de a uno; después, la banda',
};

/** Como se usa en 000-quiroz. */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 64.7,
  cola_s: 1.5,
  beats: { mapa: 0.2, paris: 6.4, duda: 7.7, sale: 8.9, llega: 12.4, abre: 13.1, ficha: 14.9, puntos: 19.1, recta: 22.9, discursos: 28, balanza: 29.3, profundidad: 32.5, claridad: 34.6, estante: 35.7, temas: 40.3, aulas: 43.5, brujula: 51.4, giro: 54.2 },
  props: {
    origen: { nombre: 'Lima', lon: -77.04, lat: -12.05 },
    tentacion: { nombre: 'París', lon: 2.35, lat: 48.86 },
    destino: { nombre: 'Nueva York', lon: -74.0, lat: 40.71 },
    distancia_km: 5900,
    encuadre: [-105, -28, 22, 62],
    ficha: 'COLUMBIA UNIVERSITY · BECA · H. S. KLEIN',
    balanza: ['PROFUNDIDAD', 'CLARIDAD'],
    temas: ['Bancos', 'Crédito colonial', 'Casa Grace'],
    ficha_aulas: 'BARUCH COLLEGE · CUNY',
    brujula: ['1970s', '1990s'],
  },
};
