import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

/**
 * Quiénes cuentan la historia: una lista que se tacha, la cordillera con un punto rojo que baja
 * a un lugar (ficha y escala de altura), una gota de mercurio que se vuelve barra de plata, un
 * corte a negro de 10 cuadros, los nombres de los que denunciaron y el índice de la serie.
 */
export const esquema = z.object({
  ficha: z.string(),
  /** Rótulo de la escala de altura. */
  altura: z.string(),
  denunciantes: z.array(z.string()).min(1).max(6),
  capitulos: z.array(z.object({ desde: z.number().int(), hasta: z.number().int(), titulo: z.string() })).min(1).max(12),
  encabezado: z.string().default('Índice'),
});

export const beats = {
  lista: 'aparece la lista',
  tacha: 'la lista se tacha',
  cordillera: 'la lista se va y se dibuja la cordillera (3 s)',
  huanca: 'el punto rojo baja al lugar; se escribe la ficha',
  altura: 'línea y escala de altura',
  mercurio: 'cae la gota de mercurio',
  plata: 'la gota se vuelve barra de plata',
  limpiar: 'un brillo barre la barra',
  perdio: 'corte a negro de 10 cuadros',
  otros: 'primer nombre',
  paso_nombres: 'segundos entre un nombre y el siguiente',
  capitulos: 'el índice: se enciende un capítulo cada 0.62 s',
  serie: 'todo encendido',
};

/** Como se usa en 000-quiroz. */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 44.8,
  cola_s: 4.5,
  beats: { lista: 0.2, tacha: 4.9, cordillera: 5.8, huanca: 14.2, altura: 15.9, mercurio: 20.0, plata: 22.2, limpiar: 24.6, perdio: 27.8, otros: 30.8, paso_nombres: 1.42, capitulos: 37.1, serie: 43.3 },
  props: {
    ficha: 'HUANCAVELICA · 1758 · ~3600 M.S.N.M.',
    altura: '3600 m',
    denunciantes: ['Domingo Elías', 'Manuel González Prada', 'Jorge Basadre', 'Héctor Vargas Haya'],
    capitulos: [
      { desde: 1750, hasta: 1820, titulo: 'El fracaso de las reformas coloniales' },
      { desde: 1821, hasta: 1859, titulo: 'Cimientos socavados de la temprana república' },
      { desde: 1860, hasta: 1883, titulo: 'El sinuoso camino al desastre' },
      { desde: 1884, hasta: 1930, titulo: 'La modernización y sus secuaces' },
      { desde: 1931, hasta: 1962, titulo: 'Dictadores venales y pactos secretos' },
      { desde: 1963, hasta: 1989, titulo: 'Asaltos a la democracia' },
      { desde: 1990, hasta: 2000, titulo: 'Conspiraciones corruptas' },
    ],
    encabezado: 'Índice',
  },
};
