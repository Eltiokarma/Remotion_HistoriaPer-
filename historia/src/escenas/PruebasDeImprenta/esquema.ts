import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

/**
 * Pruebas de imprenta sobre la mesa: una ficha a máquina, correcciones en rojo, una frase del
 * libro compuesta en página con una parte subrayada y dos sellos de fecha separados por un corte seco.
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
  /** Dos sellos: el primero sobre negro, el segundo sobre la página impresa. */
  sellos: z.tuple([z.string(), z.string()]),
});

export const beats = {
  ficha: 'empieza a escribirse la ficha',
  correcciones: 'el corrector empieza a marcar las pruebas (9 s)',
  cita: 'se entra a la página: aparece la frase compuesta',
  subrayado: 'se subraya en rojo la parte elegida',
  abajo: 'la cámara baja unas líneas por la página',
  corte1: 'corte seco a negro',
  sello1: 'cae el primer sello',
  corte2: 'corte seco a la página impresa',
  sello2: 'cae el segundo sello',
  final: 'la página se aleja despacio (aquí entra la música)',
};

/** Como se usa en 000-quiroz. */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 41,
  cola_s: 1.5,
  beats: { ficha: 0.4, correcciones: 4.6, cita: 15.4, subrayado: 21.9, abajo: 25.8, corte1: 31.7, sello1: 32.3, corte2: 34.6, sello2: 35.8, final: 37.4 },
  props: {
    ficha: 'NUEVA YORK · MEMORIAL SLOAN-KETTERING',
    seccion: 'Agradecimientos',
    cita: { texto: '…a mis médicos, por alargar estos días para poder completar la tarea.', subrayado: 'alargar estos días' },
    sellos: ['ENERO 2013', 'MAYO 2013'],
  },
};
