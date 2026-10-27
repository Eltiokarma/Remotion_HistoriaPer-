import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

/** Presentación de un personaje: nombre grande, años y un sello opcional. */
export const esquema = z.object({
  /** "piscina": el carril se vuelve renglón (Quiroz nadador). "papel": directo sobre papel. */
  fondo: z.enum(['piscina', 'papel']).default('papel'),
  nombre: z.string(),
  /** Años de vida u otro dato corto bajo el nombre. */
  anios: z.string().optional(),
  sello: z.object({
    centro: z.string(),
    fecha: z.string().optional(),
    arco: z.string().optional(),
  }).optional(),
});

export const beats = {
  nombre: 'entra el nombre, letra por letra',
  frenar: '(piscina) el carril empieza a frenar',
  renglon: '(piscina) el agua se vuelve papel',
  sello: '(con sello) cae el sello',
};

/** Como se usó en 000-quiroz. */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 16,
  beats: { nombre: 1.2, frenar: 5.6, renglon: 6.6, sello: 11.3 },
  props: {
    fondo: 'piscina',
    nombre: 'ALFONSO W. QUIROZ NORRIS',
    anios: '1956–2013',
    sello: { centro: 'PUCP', fecha: '1974', arco: 'INGRESO · INGRESO · INGRESO ·' },
  },
};
