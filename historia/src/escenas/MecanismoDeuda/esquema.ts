import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

/** Los pasos de la escena, en orden (son también sus beats). */
export const PASOS = ['islas', 'sacos', 'flecha', 'vales', 'consolidacion', 'promesa', 'lujos', 'expedientes', 'inflado', 'caudal', 'funcionarios',
  'frase', 'tachar', 'mecanismo', 'tesis', 'libro', 'titulo'] as const;

/**
 * Cómo funciona un fraude con la deuda, paso a paso: el guano entra (islas, sacos, barco), la
 * plata llega al Estado, los vales viejos se consolidan, lo que se prometía y lo que se decía
 * (en línea punteada: hipótesis), el vale que se infla, el caudal hacia pocos bolsillos, la
 * frase que corrige la versión aceptada y el libro donde quedó escrito.
 */
export const esquema = z.object({
  /** Ficha del grabado inicial. */
  ficha: z.string().optional(),
  /** Rótulo del edificio. */
  estado: z.string().default('ESTADO'),
  /** Palabra del sello sobre los vales. */
  sello: z.string(),
  /** Monto del vale de ejemplo: desde → hasta (es una ilustración, no un dato; se rotula así). */
  vale: z.object({ desde: z.number(), hasta: z.number(), rotulo: z.string().default('ejemplo ilustrativo') }),
  /** Etiqueta de las siluetas en las ventanas. */
  funcionario: z.string().default('funcionario'),
  /** Dos líneas: la primera se tacha. */
  frase: z.tuple([z.string(), z.string()]),
  tesis: z.object({ etiqueta: z.string(), anio: z.string() }),
  libro: z.object({ titulo: z.string(), anio: z.string(), autor: z.string().optional() }),
  /**
   * El último paso que se muestra: lo que sigue no ocurre (sirve para usar solo el comienzo, p. ej.
   * como puente al episodio que cuenta el resto). Los beats posteriores no hacen falta.
   */
  hasta: z.enum(PASOS).optional(),
  /**
   * Se llega al grabado desde un libro que se hojea hasta su página (con los beats hoja_entra,
   * hojea, hoja_pagina y hoja_zoom): el grabado no se ve repetirse (DIRECCION_DE_VIDEO §2.12).
   */
  hojear: z.object({ encabezado: z.string() }).optional(),
  /** Del Estado a los vales, la cámara hace un paneo (con una flecha que sigue la plata) en vez de cortar (§2.11). */
  paneo: z.boolean().default(false),
  /** La pregunta que acusa, escrita fuerte con el beat `pregunta` (§2.14). */
  pregunta: z.string().optional(),
});

export const beats = {
  hoja_entra: '(con hojear) entra el libro, cerrado',
  hojea: '(con hojear) se abre y se hojea',
  hoja_pagina: '(con hojear) cae la última hoja: la página con el grabado',
  hoja_zoom: '(con hojear) la cámara entra al grabado hasta llenar la pantalla',
  islas: 'el grabado de las islas',
  sacos: 'empiezan a subir sacos al barco',
  flecha: 'barco y Estado: sale la flecha de dinero',
  vales: 'se apilan los vales de la deuda',
  consolidacion: 'cae el sello sobre la pila',
  promesa: 'se dibuja en punteado lo que se prometía (una fábrica)',
  lujos: 'lo prometido se borra y se dibuja lo que se decía (lujos)',
  expedientes: 'primer plano de un vale',
  inflado: 'el monto sube (2.4 s) mientras la pluma marca',
  caudal: 'el Estado y el caudal hacia pocos bolsillos',
  funcionarios: 'se encienden las ventanas con funcionarios',
  frase: 'primera línea a pantalla completa',
  tachar: 'se tacha la primera línea',
  mecanismo: 'aparece la segunda línea',
  tesis: 'portada de la tesis, a máquina',
  libro: 'la tesis se vuelve libro',
  titulo: 'se estampa el título en la tapa',
  pregunta: '(con pregunta) la pregunta se escribe fuerte',
};

/** Como se usa en 000-quiroz. */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 65,
  cola_s: 2,
  beats: { islas: 0.2, sacos: 9.6, flecha: 14.3, vales: 17.0, consolidacion: 24.0, promesa: 25.4, lujos: 31.9, expedientes: 40.0, inflado: 43.6, caudal: 46.6, funcionarios: 49.3, frase: 51.3, tachar: 52.0, mecanismo: 53.4, tesis: 55.5, libro: 59.2, titulo: 63.9 },
  props: {
    ficha: 'SIGLO XIX · GUANO', estado: 'ESTADO', sello: 'CONSOLIDACIÓN', vale: { desde: 1000, hasta: 3000, rotulo: 'ejemplo ilustrativo' }, funcionario: 'funcionario',
    frase: ['No era derroche.', 'Era un mecanismo.'], tesis: { etiqueta: 'TESIS', anio: '1980' }, libro: { titulo: 'La deuda defraudada', anio: '1987', autor: 'Alfonso W. Quiroz' },
  },
};
