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
  /** Una palabra que al final queda sola en pantalla (p. ej. cómo lo describió alguien). */
  palabra: z.string().optional(),
});

export const beats = {
  nombre: 'entra el nombre, letra por letra',
  frenar: '(piscina) el carril empieza a frenar',
  renglon: '(piscina) el agua se vuelve papel',
  sello: '(con sello) cae el sello',
  palabra: '(con palabra) todo se retira y queda la palabra sola',
};

/** Como se usa en 000-quiroz (el sello se usó en la primera versión). */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 26.1,
  cola_s: 3,
  beats: { nombre: 1.0, frenar: 17.6, renglon: 20.6, sello: 11.3, palabra: 25.0 },
  props: {
    fondo: 'piscina',
    nombre: 'ALFONSO W. QUIROZ NORRIS',
    anios: '1956 — 2013',
    sello: { centro: 'PUCP', fecha: '1974', arco: 'INGRESO · INGRESO · INGRESO ·' },
    palabra: 'INAGOTABLE',
  },
};
