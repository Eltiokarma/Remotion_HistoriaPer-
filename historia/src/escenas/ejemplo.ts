import type { z } from 'zod';

/**
 * Datos de muestra de una escena del catálogo: con esto se ve en el Studio (carpeta
 * «catalogo») sin armar un video. Sirve de modelo para copiar a un escenas.json.
 */
export type Ejemplo<S extends z.ZodType> = {
  duracion_s: number;
  cola_s?: number;
  beats: Record<string, number>;
  props: z.input<S>;
};
