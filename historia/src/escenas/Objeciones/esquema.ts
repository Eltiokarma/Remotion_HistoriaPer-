import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

/**
 * Un tablero de objeciones: cuatro tarjetas en fila; cada una pasa al centro y se da vuelta
 * cuando llega su respuesta (legajos con sellos de embajada, un medidor que tiembla contra un
 * libro de cuentas quieto, una página de diccionario antiguo); la última se tacha. Remate:
 * un engranaje que gira, una gota de aceite, corte, grava, y el engranaje se traba.
 */
export const esquema = z.object({
  tarjetas: z.array(z.object({ numero: z.string(), nombre: z.string() })).length(4),
  /** Sellos de los legajos (respuesta 1). */
  sellos: z.array(z.string()).min(1).max(4),
  /** Página de diccionario (respuesta 3). Solo se leen el año y las entradas; las definiciones son texto simulado. */
  diccionario: z.object({ anio: z.string(), entradas: z.array(z.string()).min(1).max(4) }),
  engranaje: z.object({ antes: z.string(), despues: z.string() }),
});

export const beats = {
  tarjetas: 'se reparten las cuatro tarjetas',
  excusa: 'la cuarta se aparta (es una excusa, no una razón)',
  t1: 'la tarjeta 1 pasa al centro',
  r1: 'se da vuelta: legajos',
  sellos: 'caen los sellos de embajada',
  t2: 'la tarjeta 2 pasa al centro',
  r2: 'se da vuelta: medidor contra libro de cuentas',
  t3: 'la tarjeta 3 pasa al centro',
  r3: 'se da vuelta: diccionario',
  entradas: 'se subrayan las entradas, una tras otra',
  t4: 'la tarjeta 4 pasa al centro',
  r4: 'se tacha',
  engranaje: 'corte al engranaje que gira',
  aceite: 'cae una gota de aceite',
  corte: 'corte seco: sin aceite',
  grava: 'cae la grava',
  traba: 'el engranaje se traba (el golpe fuerte)',
  fin: 'termina el silencio que sigue al golpe',
};

/** Como se usa en 000-quiroz. */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 83.1,
  cola_s: 2.8,
  beats: { tarjetas: 3.3, excusa: 10.1, t1: 11.2, r1: 16.9, sellos: 25.0, t2: 30.5, r2: 35.8, t3: 44.3, r3: 49.6, entradas: 56.2, t4: 61.9, r4: 68.8, engranaje: 69.9, aceite: 73.9, corte: 78.2, grava: 81.4, traba: 82.4, fin: 84.6 },
  props: {
    tarjetas: [{ numero: '01', nombre: 'SECRETA' }, { numero: '02', nombre: 'PERCEPCIÓN' }, { numero: '03', nombre: 'RELATIVISMO' }, { numero: '04', nombre: 'CULTURA' }],
    sellos: ['FOREIGN OFFICE', "QUAI D'ORSAY", 'STATE DEPT.'],
    diccionario: { anio: '1729', entradas: ['cohecho', 'prevaricato', 'corruptela'] },
    engranaje: { antes: 'lo que decían', despues: 'lo que encontró' },
  },
};
