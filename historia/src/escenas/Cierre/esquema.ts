import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

/** Cierre: la carpeta del manuscrito se cierra, fundido a negro y tarjeta del próximo episodio. */
export const esquema = z.object({
  proximo: z.object({
    etiqueta: z.string().default('Próximo'),
    /** Número grande: el año o el capítulo del próximo episodio. */
    anio: z.string(),
    titulo: z.string(),
  }),
});

export const beats = {
  cerrar: 'la tapa empieza a cerrarse (1.6 s)',
  negro: 'fundido a negro',
  tarjeta: 'aparece la tarjeta (con la nota final)',
};

/** Como se usó en 000-quiroz. */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 6.3,
  cola_s: 4,
  beats: { cerrar: 2.2, negro: 6.4, tarjeta: 7.2 },
  props: { proximo: { etiqueta: 'Próximo', anio: '1750', titulo: 'El fracaso de las reformas coloniales' } },
};
