import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

/** Repisa con un libro por capítulo, de grosor proporcional a sus años, y la línea de tiempo. */
export const esquema = z.object({
  capitulos: z.array(z.object({ desde: z.number().int(), hasta: z.number().int() })).min(1).max(12),
  /** Imagen de fondo opcional en public/videos/<id>/imagenes/ (con licencia en fuentes.md). */
  fondo_asset: z.string().nullable().optional(),
  etiqueta_hoy: z.string().default('hoy'),
});

export const beats = {
  linea: 'aparecen la repisa y la línea de tiempo',
  capitulos: 'se enciende el primer libro',
  paso: 'segundos entre un libro y el siguiente',
  pregunta: 'la línea roja sigue hasta "hoy"',
};

/** Como se usó en 000-quiroz. */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 20,
  beats: { linea: 0, capitulos: 2.8, paso: 0.72, pregunta: 14 },
  props: {
    capitulos: [
      { desde: 1750, hasta: 1820 }, { desde: 1821, hasta: 1859 }, { desde: 1860, hasta: 1883 },
      { desde: 1884, hasta: 1930 }, { desde: 1931, hasta: 1962 }, { desde: 1963, hasta: 1989 },
      { desde: 1990, hasta: 2000 },
    ],
    etiqueta_hoy: 'hoy',
  },
};
