import { staticFile } from 'remotion';

/**
 * Rutas de archivos. Regla del repo:
 *  - public/compartido/  → lo que sirve para cualquier video (fuentes, texturas, efectos, ambientes)
 *  - public/videos/<id>/ → lo propio de un video (música, voz, imágenes)
 */
export const compartido = (ruta: string) => staticFile(`compartido/${ruta}`);
export const delVideo = (videoId: string, ruta: string) => staticFile(`videos/${videoId}/${ruta}`);

/** Efecto de sonido de la biblioteca compartida (public/compartido/audio/sfx/<nombre>.mp3). */
export const sfx = (nombre: string) => compartido(`audio/sfx/${nombre}.mp3`);
/** Ambiente de la biblioteca compartida (public/compartido/audio/ambiente/<nombre>.mp3). */
export const ambiente = (nombre: string) => compartido(`audio/ambiente/${nombre}.mp3`);

export const textura = {
  papel: compartido('texturas/papel.jpg'),
  caustica: compartido('texturas/caustica.png'),
  grano: (i: number) => compartido(`texturas/grano-${((i % 6) + 6) % 6}.png`),
};
