import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

/**
 * Un libro y la frase que desarma: el título hecho geometría (anillos que se cierran sobre sí
 * mismos y una red que crece hasta salirse del cuadro) y un cartel de obra pública con la frase;
 * una palabra se tacha y al final queda una sola.
 */
export const esquema = z.object({
  titulo: z.string(),
  anio: z.string(),
  frase: z.string(),
  tachar: z.string().optional(),
  queda: z.string().optional(),
  /** Color del cartel. Por defecto, el ocre de la paleta llevado a amarillo de obra. */
  color_cartel: z.string().optional(),
});

export const beats = {
  circulos: 'los anillos empiezan a cerrarse (4 s)',
  titulo: 'aparece el título (y el año)',
  red: 'la red crece hacia afuera (6 s)',
  cartel: 'se planta el cartel',
  frase: 'se colocan las letras (1.4 s)',
  tachar: 'se tacha una palabra',
  roba: 'todo se apaga menos la palabra que queda',
};

/** Como se usa en 000-quiroz. */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 24.3,
  cola_s: 2.6,
  beats: { circulos: 0.2, titulo: 1.8, red: 5.3, cartel: 17.3, frase: 22.1, tachar: 23.6, roba: 25.0 },
  props: { titulo: 'Corrupt Circles', anio: '2008', frase: 'ROBA, PERO HACE OBRA', tachar: 'PERO', queda: 'ROBA' },
};
