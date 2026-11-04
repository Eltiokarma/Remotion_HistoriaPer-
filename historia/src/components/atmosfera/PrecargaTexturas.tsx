import { Img } from 'remotion';
import { textura } from '../../estilo/recursos';

const TODAS = [textura.papel, textura.caustica, textura.madera, ...[0, 1, 2, 3, 4, 5].map((i) => textura.grano(i))];

/**
 * Las texturas del canal se pintan como fondo CSS (`Papel`, el grano de `Atmosfera`, `Pizarra`,
 * `Piscina`, `LibroHojeable`, `Carpeta`, `PortadaLibro`) o como <image> de SVG (`PatronPapel`), y
 * Remotion no espera a que esas imágenes carguen antes de sacar la captura. <Img> de Remotion sí
 * espera. Esta capa invisible pide todas las texturas en cada cuadro: la primera vez retiene el
 * cuadro hasta que llegan; después salen de la caché del navegador.
 *
 * Origen: en el laboratorio (muestra 02) el primer cuadro salió una vez con el papel liso. No se
 * pudo volver a reproducir (ver laboratorio/INFORME_TECNICO.md); esto lo previene sin cambiar la
 * imagen.
 */
export const PrecargaTexturas: React.FC = () => (
  <div style={{ display: 'none' }} aria-hidden>
    {TODAS.map((src) => <Img key={src} src={src} />)}
  </div>
);
