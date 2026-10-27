import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

const lugar = z.object({ lon: z.number(), lat: z.number() });

/**
 * Una pregunta que encuentra sus pruebas: el título de un ensayo a máquina (los signos de
 * interrogación, grandes y rojos), un televisor con estática y REC (nunca las imágenes reales),
 * el globo con fichas de lo que pasaba en el mundo y dos palabras a pantalla completa.
 */
export const esquema = z.object({
  /** Título del ensayo. Lo que va entre ¿? sale en rojo y grande. */
  titulo: z.string(),
  tv: z.object({ fecha: z.string(), rec: z.string().default('REC') }),
  /** Fichas sobre el globo, cada una unida a un lugar. */
  fichas: z.array(z.object({ texto: z.string(), lugar: lugar })).max(3),
  /** Longitud que mira el globo al principio y al final (gira despacio). */
  giro: z.tuple([z.number(), z.number()]).default([-40, -78]),
  /** Dos palabras finales, una encima de la otra. */
  cierre: z.tuple([z.string(), z.string()]),
});

export const beats = {
  titulo: 'empieza a escribirse el título (11 letras por segundo)',
  tv: 'corte al televisor que se enciende',
  globo: 'aparece el globo',
  ficha1: 'primera ficha',
  ficha2: 'segunda ficha',
  pregunta: 'primera palabra a pantalla completa',
  pruebas: 'segunda palabra',
};

/** Como se usa en 000-quiroz. */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 40,
  cola_s: 2,
  beats: { titulo: 2.2, tv: 9.0, globo: 22.4, ficha1: 26.4, ficha2: 29.6, pregunta: 36.3, pruebas: 39.3 },
  props: {
    titulo: 'Historia de la corrupción en el Perú: ¿es factible su estudio?',
    tv: { fecha: '2000', rec: 'REC' },
    fichas: [
      { texto: 'BANCO MUNDIAL · 1996 · «CÁNCER»', lugar: { lon: -77.04, lat: 38.9 } },
      { texto: 'ONU · 2000', lugar: { lon: -73.97, lat: 40.75 } },
    ],
    giro: [-40, -78],
    cierre: ['pregunta', 'pruebas'],
  },
};
