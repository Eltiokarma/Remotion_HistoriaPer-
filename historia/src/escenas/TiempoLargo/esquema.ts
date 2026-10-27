import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

/**
 * Una época y lo que no cambia: sello de ingreso sobre una lista de admisión, afiches
 * tipográficos que se pegan en un muro (y uno se despega), un volante encima y, al final,
 * las tres capas del tiempo de Braudel; la cámara baja hasta la que casi no se mueve.
 */
export const esquema = z.object({
  sello: z.object({ centro: z.string(), fecha: z.string().optional(), arco: z.string().optional() }),
  /** Rótulo de la lista donde cae el sello (p. ej. "ADMISIÓN · 1974"). */
  lista: z.string().default(''),
  /** Titulares de los afiches: tipografía genérica, nunca afiches reales. */
  titulares: z.array(z.string()).min(1).max(4),
  /** Ficha que aparece con las capas (el autor de la idea). */
  ficha: z.string().optional(),
  capas: z.object({ rapida: z.string(), media: z.string(), lenta: z.string() }),
  /** Nombres que pasan rápido por la capa de arriba. */
  gobiernos: z.array(z.string()).min(3),
});

export const beats = {
  sello: 'cae el sello sobre la lista',
  primeros: 'se marcan los primeros puestos',
  afiches: 'aparece el muro',
  afiche1: 'se pega el primer afiche',
  afiche2: 'se pega el segundo',
  afiche3: '(con 3 titulares) se pega el tercero',
  despegue: 'una esquina se despega: debajo hay afiches viejos',
  volante: 'entra el volante',
  capas: 'el muro se apaga y se dibujan las capas',
  braudel: '(con ficha) aparece la ficha',
  bajar: 'la cámara baja hasta la capa que casi no se mueve (2.4 s)',
};

/** Como se usa en 000-quiroz. */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 56.4,
  cola_s: 1.5,
  beats: { sello: 2.0, primeros: 5.8, afiches: 10.2, afiche1: 12.3, afiche2: 13.6, afiche3: 16.7, despegue: 28.8, volante: 33.6, capas: 39.2, braudel: 44.3, bajar: 51.2 },
  props: {
    sello: { centro: 'PUCP', fecha: '1974', arco: 'INGRESO · INGRESO · INGRESO ·' },
    lista: 'ADMISIÓN · 1974',
    titulares: ['REFORMA AGRARIA', 'NACIONALIZACIÓN', 'UN PAÍS NUEVO'],
    ficha: 'F. BRAUDEL · LA LARGA DURACIÓN',
    capas: { rapida: 'gobiernos', media: 'economía', lenta: 'estructuras' },
    gobiernos: ['VIRREINATO', 'SAN MARTÍN', 'CASTILLA', 'PIÉROLA', 'LEGUÍA', 'BENAVIDES', 'ODRÍA', 'PRADO', 'BELAUNDE', 'VELASCO', 'MORALES BERMÚDEZ', 'GARCÍA', 'FUJIMORI'],
  },
};
