import { z } from 'zod';
import type { Ejemplo } from '../ejemplo';

const persona = z.object({
  nombre: z.string(),
  /** Dónde va en la línea de tiempo (año). */
  en: z.number(),
  /** Rótulo chico sobre el nombre (p. ej. el año, si está verificado). */
  detalle: z.string().optional(),
});

/**
 * Quiénes cuentan la historia: una lista que se tacha, la cordillera con un punto rojo que baja
 * a un lugar (ficha y escala de altura), una gota de mercurio que se vuelve barra de plata, un
 * corte a negro de 10 cuadros y una línea de tiempo con los capítulos de la serie: la cámara la
 * recorre de un denunciante al siguiente, se abre hasta verla entera, los capítulos se encienden
 * uno por uno y la línea baja y se vuelve el índice de la serie.
 */
export const esquema = z.object({
  ficha: z.string(),
  /** Rótulo de la escala de altura. */
  altura: z.string(),
  /** Quien abre la serie: la línea empieza en él (ya se contó su historia). */
  abre: persona,
  /** Los que vienen después, en el orden en que los nombra la voz. */
  denunciantes: z.array(persona).min(1).max(6),
  capitulos: z.array(z.object({ desde: z.number().int(), hasta: z.number().int(), titulo: z.string() })).min(1).max(12),
  encabezado: z.string().default('Índice'),
});

export const beats = {
  lista: 'aparece la lista',
  tacha: 'la lista se tacha',
  cordillera: 'la lista se va y se dibuja la cordillera (3 s)',
  huanca: 'el punto rojo baja al lugar; se escribe la ficha',
  altura: 'línea y escala de altura',
  mercurio: 'cae la gota de mercurio',
  plata: 'la gota se vuelve barra de plata',
  limpiar: 'un brillo barre la barra',
  perdio: 'corte a negro de 10 cuadros; después aparece la línea, en quien abre la serie',
  otros: 'la cámara arranca hacia la derecha por la línea de tiempo',
  nombre_1: 'la cámara llega al primer nombre',
  nombre_2: '(con dos nombres o más) llega al segundo',
  nombre_3: '(con tres nombres o más) llega al tercero',
  nombre_4: '(con cuatro nombres o más) llega al cuarto',
  nombre_5: '(con cinco nombres o más) llega al quinto',
  nombre_6: '(con seis nombres) llega al sexto',
  capitulos: 'la cámara se abre hasta ver la línea entera; los nombres se apagan',
  ciclos: 'los capítulos se encienden uno por uno (0,28 s)',
  virreinato: 'el año del comienzo, abajo a la izquierda; un brillo sale de ahí y recorre la línea',
  dos_mil: 'el año del final, abajo a la derecha; el brillo llega',
  serie: 'la línea baja y arriba aparece el índice de la serie',
};

/** Como se usa en 000-quiroz. */
export const ejemplo: Ejemplo<typeof esquema> = {
  duracion_s: 49.6,
  cola_s: 4.5,
  beats: {
    lista: 0.2, tacha: 4.9, cordillera: 5.8, huanca: 14.2, altura: 15.9, mercurio: 19.9, plata: 22.1, limpiar: 24.5, perdio: 27.7, otros: 28.9,
    nombre_1: 31.2, nombre_2: 33.3, nombre_3: 35.7, nombre_4: 37.8, capitulos: 40.4, ciclos: 42.6, virreinato: 45.0, dos_mil: 46.2, serie: 48.2,
  },
  props: {
    ficha: 'HUANCAVELICA · 1758 · ~3600 M.S.N.M.',
    altura: '3600 m',
    abre: { nombre: 'Antonio de Ulloa', en: 1758, detalle: '1758' },
    denunciantes: [
      { nombre: 'Domingo Elías', en: 1853, detalle: '1853' },
      { nombre: 'Manuel González Prada', en: 1907.5 },
      { nombre: 'Jorge Basadre', en: 1947 },
      { nombre: 'Héctor Vargas Haya', en: 1976.5 },
    ],
    capitulos: [
      { desde: 1750, hasta: 1820, titulo: 'El fracaso de las reformas coloniales' },
      { desde: 1821, hasta: 1859, titulo: 'Cimientos socavados de la temprana república' },
      { desde: 1860, hasta: 1883, titulo: 'El sinuoso camino al desastre' },
      { desde: 1884, hasta: 1930, titulo: 'La modernización y sus secuaces' },
      { desde: 1931, hasta: 1962, titulo: 'Dictadores venales y pactos secretos' },
      { desde: 1963, hasta: 1989, titulo: 'Asaltos a la democracia' },
      { desde: 1990, hasta: 2000, titulo: 'Conspiraciones corruptas' },
    ],
    encabezado: 'Índice',
  },
};
