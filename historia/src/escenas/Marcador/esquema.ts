import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

/**
 * Un marcador visible para lo que falta decidir (etiqueta `DEFINIR:` de DIRECCION_DE_VIDEO §5):
 * una tarjeta sobria que dice qué va ahí. No es contenido: `npm run validar -- <id> --final` no
 * pasa mientras haya uno.
 */
export const esquema = z.object({
  /** Qué va en este lugar (p. ej. "El gancho"). */
  titulo: z.string(),
  /** Lo que ya se sabe de esa decisión, una línea por renglón. */
  notas: z.array(z.string()).max(6).default([]),
});

export const beats = {};

export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 4,
  cola_s: 0,
  beats: {},
  props: { titulo: 'El gancho', notas: ['20–60 s · DIRECCION_DE_VIDEO §2.5', 'Primero el golpe, después Alfonso'] },
};
