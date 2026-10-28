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
  /**
   * Qué parte de la escena se muestra: "todo"; "epoca" (la lista, los afiches y el volante: termina
   * en la pregunta) o "capas" (Braudel y sus capas: empieza en la ficha). Así se parte en dos escenas.
   */
  parte: z.enum(['todo', 'epoca', 'capas']).default('todo'),
  /** La palabra del episodio, a pantalla completa y quieta sobre las capas (con el beat `palabra`). */
  palabra: z.string().optional(),
  /** La capa que se enciende con el beat `realce` (la que el personaje va a estudiar). */
  realce: z.enum(['rapida', 'media', 'lenta']).optional(),
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
  capas: 'el muro se apaga y se dibujan las capas (con capa1–3: solo el marco, vacío)',
  braudel: '(con ficha) aparece la ficha',
  capa1: '(capas de a una) se llena la capa de arriba',
  capa2: '(capas de a una) se llena la del medio',
  capa3: '(capas de a una) se llena la de abajo',
  bajar: 'la cámara baja hasta la capa que casi no se mueve (2.4 s)',
  palabra: '(con palabra) la palabra del episodio, a pantalla completa',
  subir: '(opcional) la cámara vuelve a ver las tres capas; se va la palabra',
  realce: '(con realce) se enciende una capa',
};

/** Con `parte`, qué beats usa cada mitad (los de la otra no hacen falta). */
export const partes = {
  epoca: ['sello', 'primeros', 'afiches', 'afiche1', 'afiche2', 'afiche3', 'despegue', 'volante'],
  capas: ['capas', 'braudel', 'capa1', 'capa2', 'capa3', 'bajar', 'palabra', 'subir', 'realce'],
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
