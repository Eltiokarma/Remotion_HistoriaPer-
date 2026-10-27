import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

/** Calendario que suelta hojas cada vez más lento + manuscrito que se corrige con pluma. */
export const esquema = z.object({
  /** Texto a máquina arriba (lugar y año). */
  fecha: z.string(),
  /** Rótulo de cada hoja del calendario. */
  etiqueta_dia: z.string().default('DÍA'),
});

export const beats = {
  fecha: 'empieza a escribirse la fecha',
  correcciones: 'la pluma empieza a corregir el manuscrito (dura 5 s)',
  ultima_hoja: 'la última hoja intenta caer y se queda pegada',
};

/** Como se usó en 000-quiroz. */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 18,
  beats: { fecha: 0.3, correcciones: 9.8, ultima_hoja: 16.5 },
  props: { fecha: 'NUEVA YORK · 2012', etiqueta_dia: 'DÍA' },
};
