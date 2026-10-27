import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

// Fuentes incluidas en public/fonts (licencias en public/fonts/licencias):
// el render no depende de internet y sale igual en cualquier máquina.
const cargar = (family: string, file: string, weight = '400', style = 'normal') =>
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, style });

cargar('KF Maquina', 'SpecialElite-Regular.ttf');
cargar('KF Titulo', 'PlayfairDisplay-VF.ttf', '400 900');
cargar('KF Titulo', 'PlayfairDisplay-Italic-VF.ttf', '400 900', 'italic');
cargar('KF Mono', 'IBMPlexMono-Regular.ttf', '400');
cargar('KF Mono', 'IBMPlexMono-SemiBold.ttf', '600');

export const fuente = {
  maquina: '"KF Maquina", monospace',
  titulo: '"KF Titulo", Georgia, serif',
  mono: '"KF Mono", monospace',
};
