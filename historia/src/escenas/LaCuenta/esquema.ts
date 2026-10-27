import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

const rango = z.object({ min: z.number(), max: z.number(), rotulo: z.string() });

/**
 * Una estimación hecha cuadro a cuadro: una regla de décadas que se va marcando, cien unidades
 * de gasto de las que se desprende el rango rojo, la producción que pierde una franja cada año,
 * los niveles por década con su número (la banda "baja" queda vacía), la cuenta del crecimiento
 * perdido y, al final, otra vez la línea de niveles: el patrón.
 */
export const esquema = z.object({
  /** Años de la regla de décadas del principio (una marca por década con estimado). */
  regla: z.tuple([z.number().int(), z.number().int()]).default([1750, 2000]),
  /** Porcentaje del gasto del Estado (de 100 unidades). */
  gasto: z.object({ min: z.number().min(0).max(100), max: z.number().min(0).max(100), rotulo: z.string().default('GASTO DEL ESTADO · 100') }),
  /** Porcentaje de la producción, cada año. */
  pib: z.object({ min: z.number(), max: z.number(), rotulo: z.string().default('PRODUCCIÓN DEL PAÍS') }),
  /** Niveles por década: un valor por década y los bordes de cada nivel (copiados de la fuente). */
  niveles: z.object({
    serie: z.array(z.object({ desde: z.number().int(), valor: z.number().min(0) })).min(2),
    /** [baja | moderada, moderada | alta, alta | muy alta]. */
    umbrales: z.tuple([z.number(), z.number(), z.number()]),
    /** Qué mide el eje y de dónde sale. */
    eje: z.string(),
  }),
  /** La cuenta del desarrollo perdido: lo que hace falta para crecer contra lo que se llevaba la corrupción. */
  cuenta: z.object({ crecer: rango, corrupcion: rango, conclusion: z.string() }),
  /** Nota al pie: de dónde salen las cifras y que son estimados. */
  nota: z.string(),
});

export const beats = {
  decadas: 'la regla de décadas se va marcando (4 s)',
  barra: 'aparecen las cien unidades',
  rojo: 'se tiñe el mínimo; un segundo después, el rango',
  cae: 'las unidades rojas se desprenden',
  pib: 'aparece la producción y pierde una franja cada año',
  niveles: 'gráfico de niveles: se traza la línea (5 s)',
  baja: 'la banda vacía parpadea; se marca el punto más bajo',
  ni: 'la banda vacía se queda',
  crecer: 'crece la barra de lo que hace falta para crecer',
  corrupcion: 'crece, en la misma escala, la barra roja de la corrupción',
  mitad: 'aparece la conclusión',
  nota: 'aparece la nota al pie',
  patron: 'vuelve la línea de niveles entera: el patrón',
};

/** Como se usa en 000-quiroz (Quiroz, Apéndice: cuadros A.4 y A.6, escala y conclusión de la p. 554). */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 77.84,
  cola_s: 2,
  beats: { decadas: 6.9, barra: 13.6, rojo: 20.3, cae: 23, pib: 24.7, niveles: 29.9, baja: 38.2, ni: 40, crecer: 45.3, corrupcion: 52.7, mitad: 61, nota: 66.9, patron: 75.2 },
  props: {
    regla: [1680, 1990],
    gasto: { min: 30, max: 40, rotulo: 'GASTO DEL ESTADO · 100' }, pib: { min: 3, max: 4, rotulo: 'PRODUCCIÓN DEL PAÍS' },
    niveles: {
      serie: [
        { desde: 1820, valor: 6.1 }, { desde: 1830, valor: 4.3 }, { desde: 1840, valor: 4.2 }, { desde: 1850, valor: 4.3 },
        { desde: 1860, valor: 3.5 }, { desde: 1870, valor: 4.6 }, { desde: 1880, valor: 5 }, { desde: 1890, valor: 2.2 },
        { desde: 1900, valor: 1 }, { desde: 1910, valor: 1.1 }, { desde: 1920, valor: 3.8 }, { desde: 1930, valor: 3.1 },
        { desde: 1940, valor: 3.3 }, { desde: 1950, valor: 3.6 }, { desde: 1960, valor: 3.7 }, { desde: 1970, valor: 4.9 },
        { desde: 1980, valor: 3.9 }, { desde: 1990, valor: 4.5 },
      ],
      umbrales: [1, 2, 4],
      eje: 'COSTO DE LA CORRUPCIÓN · % DEL PBI · PROMEDIO POR DÉCADA',
    },
    cuenta: {
      crecer: { min: 5, max: 8, rotulo: 'PARA CRECER · CADA AÑO' },
      corrupcion: { min: 3, max: 4, rotulo: 'LA CORRUPCIÓN · CADA AÑO' },
      conclusion: '40–50 % de sus posibilidades de desarrollo',
    },
    nota: 'Estimados preliminares — Quiroz, Apéndice',
  },
};
