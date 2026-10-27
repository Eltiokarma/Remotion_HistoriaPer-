import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

const nivel = z.enum(['moderada', 'alta', 'muy alta']);

/**
 * Una estimación hecha cuadro a cuadro: una regla de décadas que se va marcando, cien unidades
 * de gasto de las que se desprende el rango rojo, la producción que pierde una franja cada año,
 * los niveles por época (la banda "baja" queda vacía) y el país real contra el que pudo ser.
 */
export const esquema = z.object({
  /** Años de la regla de décadas del principio. */
  regla: z.tuple([z.number().int(), z.number().int()]).default([1750, 2000]),
  /** Años del gráfico de niveles. */
  desde: z.number().int(),
  hasta: z.number().int(),
  /** Porcentaje del gasto del Estado (de 100 unidades). */
  gasto: z.object({ min: z.number().min(0).max(100), max: z.number().min(0).max(100), rotulo: z.string().default('GASTO DEL ESTADO · 100') }),
  /** Porcentaje de la producción, cada año. */
  pib: z.object({ min: z.number(), max: z.number(), rotulo: z.string().default('PRODUCCIÓN DEL PAÍS') }),
  periodos: z.array(z.object({ desde: z.number().int(), hasta: z.number().int(), nivel })).min(1),
  crecimiento: z.string(),
  /** Código ISO numérico del país (Perú = 604). */
  pais: z.number().int(),
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
  baja: 'la banda vacía parpadea una vez',
  ni: 'la banda vacía se queda',
  silueta: 'aparece el país',
  mitad: 'aparece el fantasma del país que pudo ser',
  nota: 'aparece la nota al pie',
  patron: 'el país y su fantasma se quedan',
};

/** Como se usa en 000-quiroz (los niveles por período son un marcador: ver fuentes.md). */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 61.9,
  cola_s: 2,
  beats: { decadas: 6.9, barra: 13.7, rojo: 20.5, cae: 23.2, pib: 24.9, niveles: 30.2, baja: 38.4, ni: 40.2, silueta: 43.2, mitad: 47.6, nota: 50.8, patron: 59.3 },
  props: {
    regla: [1750, 2000], desde: 1820, hasta: 2000,
    gasto: { min: 30, max: 40, rotulo: 'GASTO DEL ESTADO · 100' }, pib: { min: 3, max: 4, rotulo: 'PRODUCCIÓN DEL PAÍS' },
    periodos: [{ desde: 1820, hasta: 1859, nivel: 'alta' }, { desde: 1860, hasta: 1883, nivel: 'muy alta' }, { desde: 1884, hasta: 1930, nivel: 'alta' },
      { desde: 1931, hasta: 1962, nivel: 'alta' }, { desde: 1963, hasta: 1989, nivel: 'muy alta' }, { desde: 1990, hasta: 2000, nivel: 'muy alta' }],
    crecimiento: '≈ ½ del crecimiento que no tuvimos', pais: 604, nota: 'Estimados provisionales — Quiroz, Apéndice',
  },
};
