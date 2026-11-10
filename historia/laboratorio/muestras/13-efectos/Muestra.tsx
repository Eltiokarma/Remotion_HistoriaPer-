import { glow } from '@remotion/effects/glow';
import { lut } from '@remotion/effects/lut';
import { pageTurn } from '@remotion/effects/page-turn';
import { radialProgressiveBlur } from '@remotion/effects/radial-progressive-blur';
import { zoomBlur } from '@remotion/effects/zoom-blur';
import { AbsoluteFill, getInputProps, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../../src/components/audio/Sfx';
import { Papel } from '../../../src/components/atmosfera/Papel';
import { mix, tramo } from '../../../src/direction/anim';
import { PALETA } from '../../remotion/comun';

/**
 * Muestra 13 · Efectos «tipo After Effects» de @remotion/effects, sobre la ilustración de la balsa
 * (muestra 10). Cada efecto con una intención, en cuatro tramos:
 *
 *   0–1,3 s   desenfoque radial progresivo (WebGL2): foco en la balsa; el resto se va desenfocando.
 *   1,3–2,5 s LUT (WebGL2) a dos tonos del canal (tinta → papel) y resplandor (WebGL2): la luz se abre.
 *   2,5–3,5 s desenfoque de zoom (WebGL2) hacia la balsa: un golpe.
 *   3,5–5 s   pasar página (WebGPU): la ilustración se da vuelta como una hoja y deja ver el título.
 *             Sin WebGPU (el contenedor no tiene), un fundido con desenfoque de zoom (WebGL2). Para pedir la
 *             hoja: --props='{"webgpu":true}' en una máquina con WebGPU.
 *
 * Qué se mide: si cada efecto funciona sin GPU (el contenedor), y cuánto cuesta cada tramo.
 */

const BALSA = staticFile('laboratorio/10-balsa.svg');
const TITULO = staticFile('laboratorio/11-titulo.svg');
const T = { lut: 1.3, zoom: 2.5, pagina: 3.5 };
const CON_WEBGPU = (getInputProps() as { webgpu?: boolean }).webgpu === true;

/** LUT 3D de 2×2×2: el negro va a la tinta y el blanco al papel (dos tonos del canal). */
const aCubo = (hex: string) => [1, 3, 5].map((i) => (parseInt(hex.slice(i, i + 2), 16) / 255).toFixed(4)).join(' ');
const DOS_TONOS = (() => {
  const t = PALETA.fondo, p = PALETA.papel;
  const mezcla = (k: number) => {
    const a = [1, 3, 5].map((i) => parseInt(t.slice(i, i + 2), 16));
    const b = [1, 3, 5].map((i) => parseInt(p.slice(i, i + 2), 16));
    return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * k).toString(16).padStart(2, '0')).join('');
  };
  // ocho esquinas del cubo RGB (r varía más rápido): el brillo de cada esquina decide el tono
  const esquinas: string[] = [];
  for (let b = 0; b < 2; b++) for (let g = 0; g < 2; g++) for (let r = 0; r < 2; r++) esquinas.push(aCubo(mezcla(0.3 * r + 0.59 * g + 0.11 * b)));
  return `TITLE "Dos tonos del canal"\nLUT_3D_SIZE 2\n\n${esquinas.join('\n')}`;
})();

export const Efectos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const foco = 1 - tramo(t, 1.0, 0.3, 'natural'); // el desenfoque de foco se suelta al pasar al tramo 2
  const luz = tramo(t, T.lut, 0.6, 'natural') * (1 - tramo(t, T.zoom - 0.2, 0.2, 'natural'));
  const golpe = tramo(t, T.zoom, 0.25, 'tenso') * (1 - tramo(t, T.zoom + 0.35, 0.6, 'natural'));
  const pagina = tramo(t, T.pagina, 1.3, 'pesado');

  const efectos = [
    radialProgressiveBlur({ center: [0.62, 0.7], width: 0.55, height: 0.45, start: 0.35, startBlur: 0, endBlur: 22 * foco, disabled: foco < 0.01 }),
    lut({ content: DOS_TONOS, disabled: t < T.lut || t >= T.zoom }),
    glow({ radius: 24, intensity: 0.9 * luz, threshold: 0.66, color: PALETA.papel, disabled: luz < 0.01 }),
    zoomBlur({ amount: 70 * golpe + (CON_WEBGPU ? 0 : 90 * pagina), center: [0.63, 0.7], samples: 24, disabled: golpe < 0.01 && (CON_WEBGPU || pagina < 0.01) }),
    // la hoja se dobla desde la esquina de abajo a la derecha y cruza hasta salir por arriba a la izquierda
    pageTurn({ foldPosition: [mix(1.05, -0.35, pagina), mix(1.05, -0.35, pagina)], foldDirection: 315, foldRadius: 90, lightDirection: -45, render: 'both', backPageOpacity: 0.12, paperColor: PALETA.papel, disabled: !CON_WEBGPU || pagina < 0.001 }),
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: PALETA.fondo }}>
      {/* debajo de la hoja: el título de la muestra 11, ya escrito */}
      <AbsoluteFill>
        <Papel color={PALETA.papel} envejecido={0.55} />
        <Img src={TITULO} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      </AbsoluteFill>
      <Img src={BALSA} effects={efectos} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: CON_WEBGPU ? 1 : 1 - pagina }} />
      <Sfx nombre="soplo" en={T.zoom} fps={fps} volumen={0.6} />
      <Sfx nombre="hoja" en={T.pagina} fps={fps} volumen={0.8} />
    </AbsoluteFill>
  );
};
