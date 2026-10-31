import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

const rango = z.object({ min: z.number(), max: z.number(), rotulo: z.string() });

/**
 * El golpe antes de la historia (DIRECCION_DE_VIDEO §2.5): cinco cuadros que van con su frase.
 * Los años pasan y la producción del país pierde su tajada roja cada año (se apila abajo); diez
 * soles de los que caen tres y el cuarto queda en duda; una regla de siglos donde los puntos
 * sueltos se vuelven una franja continua que llega hasta la colonia, con la frase del autor; la
 * ficha con las cifras; y el libro, que queda solo cuando la luz baja.
 */
export const esquema = z.object({
  /** Años que corre el contador mientras la barra pierde su tajada. */
  anios: z.tuple([z.number().int(), z.number().int()]),
  /** La tajada de la producción (en %), con su rótulo. */
  pbi: rango,
  /** Las monedas: cuántas hay y cuántas caen (min seguras, max la que queda en duda). */
  monedas: z.object({ total: z.number().int().min(2).max(12), min: z.number().int(), max: z.number().int(), rotulo: z.string(), cifra: z.string() }),
  /** La regla del final: de dónde a dónde, y dónde termina la colonia. */
  regla: z.object({ desde: z.number().int(), hasta: z.number().int(), corte: z.number().int(), antes: z.string(), despues: z.string() }),
  /** La frase del autor, textual, con su pie. */
  cita: z.object({ texto: z.string(), pie: z.string() }),
  /** Los renglones de la ficha de las cifras (se escriben a máquina). */
  ficha: z.array(z.string()).min(1).max(4),
  /** El libro del final. */
  libro: z.object({ titulo: z.string(), autor: z.string(), anio: z.string() }),
});

export const beats = {
  anio: 'aparece la barra de la producción y empieza a correr el año',
  rojo: 'se tiñe la tajada (min seguro, hasta max rayado); desde aquí cae una tajada por año y se apila',
  soles: 'aparecen las monedas, una tras otra',
  caen: 'caen las monedas seguras',
  cuatro: 'la moneda de la duda se inclina y queda a medias, punteada',
  sueltos: 'la regla de siglos; puntos rojos sueltos que parpadean',
  sistema: 'los puntos se unen en una franja continua (de lo medido); entra la cita',
  colonia: 'la franja se alarga hacia atrás, hasta el comienzo de la regla',
  calculo: 'la ficha con las cifras se escribe a máquina',
  libro: 'la ficha se va y queda el libro; la luz baja',
};

/** Como se usa en 001-el-hombre (cifras: Quiroz, Apéndice p. 554 y Epílogo pp. 531–532). */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 32.24,
  cola_s: 1.5,
  beats: { anio: 0.3, rojo: 6.35, soles: 11.22, caen: 15.74, cuatro: 16.23, sueltos: 18.45, sistema: 20.4, colonia: 21.58, calculo: 24.49, libro: 27.91 },
  props: {
    anios: [1820, 2000],
    pbi: { min: 3, max: 4, rotulo: 'LO QUE PRODUCE EL PAÍS (PBI), CADA AÑO' },
    monedas: { total: 10, min: 3, max: 4, rotulo: 'PRESUPUESTO DEL ESTADO', cifra: '30–40 %' },
    regla: { desde: 1680, hasta: 2000, corte: 1820, antes: 'COLONIA', despues: 'REPÚBLICA' },
    cita: { texto: '«un fenómeno sistémico, no un acontecimiento anecdótico o periódico»', pie: 'QUIROZ, EPÍLOGO, P. 531' },
    ficha: ['3–4 % DEL PBI · CADA AÑO', '30–40 % DEL PRESUPUESTO', '1820–2000 · ESTIMADOS PRELIMINARES'],
    libro: { titulo: 'Historia de la corrupción en el Perú', autor: 'Alfonso W. Quiroz', anio: '2013' },
  },
};
