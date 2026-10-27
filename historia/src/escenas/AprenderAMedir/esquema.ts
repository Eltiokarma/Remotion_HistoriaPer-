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
  /** Encuadre del mapa en grados: [oeste, sur, este, norte]. */
  encuadre: z.tuple([z.number(), z.number(), z.number(), z.number()]).default([-105, -28, 22, 62]),
  ficha: z.string(),
  balanza: z.tuple([z.string(), z.string()]),
  temas: z.array(z.string()).min(1).max(5),
  ficha_aulas: z.string().optional(),
  /** Las dos épocas de la brújula (arriba y abajo: nunca izquierda/derecha). */
  brujula: z.tuple([z.string(), z.string()]),
});

export const beats = {
  mapa: 'aparece el mapa',
  paris: 'sale la ruta hacia la tentación',
  duda: 'la ruta se detiene, duda y se borra',
  nuevayork: 'sale la ruta hacia el destino',
  ficha: 'la cámara se acerca y se escribe la ficha',
  puntos: 'papel milimetrado: caen los puntos (3 s)',
  recta: 'se traza la recta de regresión',
  discursos: 'los bloques de discurso se apagan',
  balanza: 'aparece la balanza',
  profundidad: 'cae la primera palabra (se inclina)',
  claridad: 'cae la segunda (se equilibra)',
  estante: 'aparece la repisa',
  temas: 'bajan los temas, uno cada 0.5 s',
  aulas: 'el aula se va llenando',
  brujula: 'aparece la brújula',
  giro: 'la aguja gira despacio de una época a la otra',
};

/** Como se usa en 000-quiroz. */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 61.8,
  cola_s: 1.5,
  beats: { mapa: 0.2, paris: 7.0, duda: 8.4, nuevayork: 9.9, ficha: 12.1, puntos: 16.3, recta: 20.0, discursos: 25.0, balanza: 26.3, profundidad: 29.5, claridad: 31.7, estante: 32.8, temas: 37.4, aulas: 40.6, brujula: 48.5, giro: 51.4 },
  props: {
    origen: { nombre: 'Lima', lon: -77.04, lat: -12.05 },
    tentacion: { nombre: 'París', lon: 2.35, lat: 48.86 },
    destino: { nombre: 'Nueva York', lon: -74.0, lat: 40.71 },
    encuadre: [-105, -28, 22, 62],
    ficha: 'COLUMBIA UNIVERSITY · BECA · H. S. KLEIN',
    balanza: ['PROFUNDIDAD', 'CLARIDAD'],
    temas: ['Bancos', 'Crédito colonial', 'Casa Grace'],
    ficha_aulas: 'BARUCH COLLEGE · CUNY',
    brujula: ['1970s', '1990s'],
  },
};
