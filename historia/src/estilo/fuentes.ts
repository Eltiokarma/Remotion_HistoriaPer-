import { loadFont } from '@remotion/fonts';
import { compartido } from './recursos';

// Fuentes incluidas en public/compartido/fuentes (licencias en .../licencias):
// el render no depende de internet y sale igual en cualquier máquina.
const cargar = (family: string, file: string, weight = '400', style = 'normal') =>
  loadFont({ family, url: compartido(`fuentes/${file}`), weight, style });

cargar('HA Maquina', 'SpecialElite-Regular.ttf');
cargar('HA Titulo', 'PlayfairDisplay-VF.ttf', '400 900');
cargar('HA Titulo', 'PlayfairDisplay-Italic-VF.ttf', '400 900', 'italic');
cargar('HA Mono', 'IBMPlexMono-Regular.ttf', '400');
cargar('HA Mono', 'IBMPlexMono-SemiBold.ttf', '600');
cargar('HA Caligrafia', 'PinyonScript-Regular.ttf');
cargar('HA Imprenta', 'IMFeENsc28P.ttf');
cargar('HA Imprenta Italica', 'IMFeENit28P.ttf');
cargar('HA Libro', 'EBGaramond-VF.ttf', '400 800');
cargar('HA Libro', 'EBGaramond-Italic-VF.ttf', '400 800', 'italic');
cargar('HA Afiche', 'Oswald-VF.ttf', '200 700');

/** Familias tipográficas del canal, por función (no por nombre de fuente). */
export const fuente = {
  /** máquina de escribir: fechas y lugares del presente */
  maquina: '"HA Maquina", monospace',
  /** títulos y números grandes */
  titulo: '"HA Titulo", Georgia, serif',
  /** cifras y datos técnicos */
  mono: '"HA Mono", monospace',
  /** escritura a mano del siglo XIX (libros contables, cartas) */
  caligrafia: '"HA Caligrafia", cursive',
  /** imprenta antigua en versalitas: rótulos, encabezados, etiquetas */
  imprenta: '"HA Imprenta", Georgia, serif',
  /** imprenta antigua en cursiva: nombres de lugares, notas */
  imprentaItalica: '"HA Imprenta Italica", Georgia, serif',
  /** texto de libro (EB Garamond): citas, frases compuestas, portadas */
  libro: '"HA Libro", Georgia, serif',
  /** palo seco condensado (Oswald): afiches, carteles, titulares de época */
  afiche: '"HA Afiche", Impact, sans-serif',
};
