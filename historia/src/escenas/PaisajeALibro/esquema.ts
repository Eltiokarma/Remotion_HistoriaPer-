import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

/** Un grabado de época que se da vuelta como página y deja ver un libro de cuentas. */
export const esquema = z.object({
  /** Qué grabado se ve antes del libro. */
  paisaje: z.enum(['islas-guaneras']).default('islas-guaneras'),
  /** Encabezado del libro de cuentas. */
  rotulo: z.string(),
  columnas: z.tuple([z.string(), z.string()]).default(['Concepto', 'Pesos']),
  /** Asiento principal (en caligrafía). */
  concepto: z.string(),
  /** Casillero del que sale la flecha roja. */
  estado: z.string(),
  /** La cifra que se infla: desde → hasta. */
  cifra: z.object({ desde: z.number(), hasta: z.number(), unidad: z.string().optional() }),
});

export const beats = {
  libro: 'la página del grabado se da vuelta (1.5 s)',
  cifra: 'la cifra empieza a inflarse',
  flecha: 'la flecha sale del casillero (la cifra termina de inflarse 0.6 s antes)',
};

/** Como se usó en la primera versión de 000-quiroz (6 escenas). */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 19,
  beats: { libro: 10.7, cifra: 13.3, flecha: 16.7 },
  props: {
    paisaje: 'islas-guaneras',
    rotulo: 'Consolidación de la deuda · 1850',
    concepto: 'Deuda interna reconocida',
    estado: 'Estado',
    cifra: { desde: 4800000, hasta: 23200000, unidad: 'pesos' },
  },
};
