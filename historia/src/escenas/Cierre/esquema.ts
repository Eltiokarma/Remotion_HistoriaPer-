import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

/** Cierre: la carpeta del manuscrito se cierra, fundido a negro y tarjeta del próximo episodio. */
export const esquema = z.object({
  /** Ficha a máquina arriba a la izquierda (lugar y fecha). */
  ficha: z.string().optional(),
  /** Las hojas son las pruebas de imprenta del inicio y sus correcciones se desvanecen. */
  limpiar: z.boolean().default(false),
  /** Un objeto que late sobre la tarjeta del próximo episodio. */
  emblema: z.enum(['mercurio']).nullable().optional(),
  proximo: z.object({
    etiqueta: z.string().default('Próximo'),
    /** Número grande: el año o el capítulo del próximo episodio. */
    anio: z.string(),
    titulo: z.string(),
  }),
});

export const beats = {
  limpiar: '(con limpiar) las correcciones rojas se desvanecen (4 s)',
  ficha: '(con ficha) empieza a escribirse la ficha',
  cerrar: 'la tapa empieza a cerrarse (1.6 s)',
  negro: 'fundido a negro',
  tarjeta: 'aparece la tarjeta (con la nota final)',
};

/** Como se usa en 000-quiroz. */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 25,
  cola_s: 6,
  beats: { limpiar: 0.6, ficha: 2.4, cerrar: 14.4, negro: 18.9, tarjeta: 19.9 },
  props: {
    ficha: 'RÍO DE JANEIRO · FEBRERO 2013',
    limpiar: true,
    emblema: 'mercurio',
    proximo: { etiqueta: 'Próximo', anio: '1758', titulo: 'Huancavelica' },
  },
};
