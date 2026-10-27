import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

/**
 * Pruebas de imprenta sobre la mesa: una ficha a máquina, correcciones en rojo, una frase del
 * libro compuesta en página con una parte subrayada (y, si hay, otra unas líneas más abajo, que
 * entra en foco cuando la cámara baja) y dos sellos de fecha separados por un corte seco.
 */
export const esquema = z.object({
  /** Ficha monoespaciada arriba a la izquierda (lugar). */
  ficha: z.string(),
  /** Encabezado de la página donde está la frase (p. ej. "Agradecimientos"). */
  seccion: z.string().default('Agradecimientos'),
  cita: z.object({
    texto: z.string(),
    /** Parte del texto que se subraya en rojo (tiene que aparecer tal cual en `texto`). */
    subrayado: z.string().optional(),
  }),
  /** Otra frase de la misma página, unas líneas más abajo: queda desenfocada hasta que la cámara baja. */
  segunda: z.object({ texto: z.string() }).optional(),
  /** Dos sellos: el primero sobre negro, el segundo sobre la página impresa. */
  sellos: z.tuple([z.string(), z.string()]),
});

export const beats = {
  ficha: 'empieza a escribirse la ficha',
  correcciones: 'el corrector empieza a marcar las pruebas (9 s)',
  cita: 'se entra a la página: aparece la frase compuesta',
  subrayado: 'se subraya en rojo la parte elegida',
  abajo: 'la cámara baja unas líneas por la página (con `segunda`, el foco pasa a esa frase)',
  corte1: 'corte seco a negro',
  sello1: 'cae el primer sello',
  corte2: 'corte seco a la página impresa',
  sello2: 'cae el segundo sello',
  final: 'la página se aleja despacio (aquí entra la música)',
};

/** Como se usa en 000-quiroz. */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 41.89,
  cola_s: 2.5,
  beats: { ficha: 0.4, correcciones: 3.3, cita: 14.3, subrayado: 20.7, abajo: 24.6, corte1: 32.6, sello1: 33.2, corte2: 35.5, sello2: 36.7, final: 38.3 },
  props: {
    ficha: 'NUEVA YORK · 2012',
    seccion: 'Agradecimientos',
    cita: {
      texto: 'A mis médicos del hospital Memorial Sloan-Kettering les agradezco inmensamente el alargar estos días para poder completar la tarea.',
      subrayado: 'alargar estos días',
    },
    segunda: { texto: 'La reciente llegada a este mundo de nuestro precioso Alfonsito ha colocado todo esto en su debida perspectiva vital.' },
    sellos: ['ENERO 2013', 'MAYO 2013'],
  },
};
