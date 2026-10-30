import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

/**
 * Pruebas de imprenta sobre la mesa: una ficha a máquina, correcciones en rojo, una frase del
 * libro compuesta en página con una parte subrayada (y, si hay, otra unas líneas más abajo, que
 * entra en foco cuando la cámara baja). Después, corte seco a una línea de tiempo que la cámara
 * recorre del primer evento al último, y al final se abre para verla entera.
 */
export const esquema = z.object({
  /** Ficha monoespaciada arriba a la izquierda (lugar). */
  ficha: z.string(),
  /** La ficha grande y con brillo, para que no se olvide dónde estamos (DIRECCION_DE_VIDEO §2.1). */
  ficha_destacada: z.boolean().default(false),
  /** Encabezado de la página donde está la frase (p. ej. "Agradecimientos"). */
  seccion: z.string().default('Agradecimientos'),
  cita: z.object({
    texto: z.string(),
    /** Parte del texto que se subraya en rojo (tiene que aparecer tal cual en `texto`). */
    subrayado: z.string().optional(),
  }),
  /** Otra frase de la misma página, unas líneas más abajo: queda desenfocada hasta que la cámara baja. */
  segunda: z.object({ texto: z.string() }).optional(),
  /**
   * Una muerte no se cuenta como un dato más (DIRECCION_DE_VIDEO §2.8): antes de la línea, una cruz
   * sobre negro; cuando la voz termina la frase, la fecha; y recién después, la línea con su punto.
   */
  cruz: z.object({ fecha: z.string() }).optional(),
  /** La línea de tiempo del final: el primer evento es donde arranca la cámara; el último, donde llega. */
  linea: z.object({
    /** Un rótulo por tramo (p. ej. meses): el tramo i va de i a i + 1 en la escala. */
    tramos: z.array(z.string()).min(2),
    /** Nombre largo de cada tramo, para el fondo. */
    fondo: z.array(z.string()).optional(),
    eventos: z
      .array(z.object({ en: z.number(), rotulo: z.string(), detalle: z.string().optional(), tono: z.enum(['sombra', 'luz', 'nota']) }))
      .min(2),
  }),
});

export const beats = {
  ficha: 'empieza a escribirse la ficha',
  correcciones: 'el corrector empieza a marcar las pruebas (9 s)',
  cita: 'se entra a la página: aparece la frase compuesta',
  subrayado: 'se subraya en rojo la parte elegida',
  abajo: 'la cámara baja unas líneas por la página (con `segunda`, el foco pasa a esa frase)',
  muerte: 'corte seco a la línea de tiempo: aparece el primer evento (con `cruz`: la cruz sobre negro)',
  fecha: '(con cruz) aparece la fecha, cuando la voz ya terminó la frase',
  linea: '(con cruz) aparece la línea con su punto rojo (2–3 s después de la fecha)',
  recorre: 'la cámara empieza a recorrer la línea (arranca y frena despacio)',
  mayo: 'llega al último evento: se enciende',
  final: 'la cámara se abre y se ve el camino entero (aquí entra la música)',
  hombre: 'pulso en el primer evento',
  encontro: 'el último evento brilla más',
};

/** Como se usa en 000-quiroz. */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 41.89,
  cola_s: 2.5,
  beats: { ficha: 0.4, correcciones: 3.3, cita: 14.3, subrayado: 20.7, abajo: 24.6, muerte: 32.6, recorre: 35, mayo: 38.6, final: 41, hombre: 42.4, encontro: 43.6 },
  props: {
    ficha: 'NUEVA YORK · 2012',
    seccion: 'Agradecimientos',
    cita: {
      texto: 'A mis médicos del hospital Memorial Sloan-Kettering les agradezco inmensamente el alargar estos días para poder completar la tarea.',
      subrayado: 'alargar estos días',
    },
    segunda: { texto: 'La reciente llegada a este mundo de nuestro precioso Alfonsito ha colocado todo esto en su debida perspectiva vital.' },
    linea: {
      tramos: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY'],
      fondo: ['enero', 'febrero', 'marzo', 'abril', 'mayo'],
      eventos: [
        { en: 0.03, rotulo: '† 2 ENE 2013', tono: 'sombra' },
        { en: 1.5, rotulo: 'PRÓLOGO', detalle: 'RÍO DE JANEIRO', tono: 'nota' },
        { en: 4.5, rotulo: 'MAYO 2013', detalle: 'PRIMERA EDICIÓN', tono: 'luz' },
      ],
    },
  },
};
