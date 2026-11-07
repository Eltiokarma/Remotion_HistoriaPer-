import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AbsoluteFill, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sfx } from '../../../src/components/audio/Sfx';
import { Papel } from '../../../src/components/atmosfera/Papel';
import { Ficha } from '../../../src/components/texto/Ficha';
import { tramo } from '../../../src/direction/anim';
import { azar } from '../../../src/direction/azar';
import type { Peso } from '../../../src/direction/easings';
import { PALETA } from '../../remotion/comun';

/**
 * Muestra 11 · Título animado: Inkscape (por MCP) compone el título con las fuentes del canal y lo
 * pasa a trazos; Remotion dibuja cada letra (su contorno, como el «trim paths» de After Effects) y
 * después la llena de tinta.
 *
 * Coreografía (movimiento.md), cámara quieta:
 *   Apoyo de entrada: la ficha a máquina de la serie (con su cuadrito rojo), tecleada.
 *   Protagonista: «le sacó la cuenta», más grande y más lento; antes, «El hombre que», rápido y chico;
 *     después, «al Perú.». Cada palabra: el contorno se dibuja y, cuando va por el 70 %, la tinta la
 *     llena (solapados: una ola, no una fila). Los retrasos no son parejos: los marca el peso de cada
 *     palabra en la frase.
 *   Quietud (2,9–3,3 s) y golpe: el subrayado rojo del corrector bajo «la cuenta», con el lápiz.
 *   Quieto: el papel y la luz de la lámpara.
 */

const SVG = staticFile('laboratorio/11-titulo.svg');
const SERIE = 'HISTORIA DE LA CORRUPCIÓN EN EL PERÚ · 0·1';
const T_FICHA = 0.25;
const CPS_FICHA = 26;
const T_SUBRAYA = 3.3;

/** Cuándo empieza a dibujarse cada palabra (w-0 … w-8), cuánto tarda y con qué peso. */
const PALABRAS: { t: number; dura: number; peso: Peso }[] = [
  { t: 1.0, dura: 0.45, peso: 'ligero' }, // El
  { t: 1.12, dura: 0.55, peso: 'ligero' }, // hombre
  { t: 1.3, dura: 0.45, peso: 'ligero' }, // que
  { t: 1.55, dura: 0.6, peso: 'natural' }, // le
  { t: 1.75, dura: 0.85, peso: 'solemne' }, // sacó
  { t: 2.05, dura: 0.6, peso: 'natural' }, // la
  { t: 2.2, dura: 0.95, peso: 'solemne' }, // cuenta
  { t: 2.5, dura: 0.45, peso: 'natural' }, // al
  { t: 2.6, dura: 0.6, peso: 'natural' }, // Perú.
];

type Glifo = { el: SVGPathElement; largo: number; palabra: number; orden: number; deLaPalabra: number };

export const TituloInkscape: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const caja = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [espera] = useState(() => delayRender('svg del título'));
  const [glifos, setGlifos] = useState<Glifo[] | null>(null);
  const [subrayado, setSubrayado] = useState<{ d: string; largo: number } | null>(null);
  const trazo = useRef<SVGPathElement>(null);

  useEffect(() => {
    fetch(SVG).then((r) => r.text()).then(setSvg).catch((e) => cancelRender(e as Error));
  }, []);

  // medir cada letra (largo del contorno) y la caja de «la cuenta» para el subrayado
  useLayoutEffect(() => {
    if (!svg || !caja.current || glifos) return;
    const raiz = caja.current.querySelector('svg');
    if (!raiz) return cancelRender(new Error('sin svg'));
    raiz.setAttribute('width', '100%');
    raiz.setAttribute('height', '100%');
    const lista: Glifo[] = [];
    PALABRAS.forEach((_, p) => {
      const caminos = Array.from(raiz.querySelectorAll<SVGPathElement>(`#w-${p} path`));
      caminos.forEach((el, i) => {
        const largo = el.getTotalLength();
        el.style.fill = PALETA.fondo;
        el.style.stroke = PALETA.fondo;
        el.style.strokeWidth = p >= 3 && p <= 6 ? '2.2' : '1.4';
        el.style.strokeLinejoin = 'round';
        el.style.strokeDasharray = `${largo}`;
        lista.push({ el, largo, palabra: p, orden: i, deLaPalabra: caminos.length });
      });
    });
    if (lista.length === 0) return cancelRender(new Error('el SVG no trae letras en #w-*'));
    // el subrayado: de «la» a «cuenta», un poco debajo de la línea base, con el pulso de una mano
    const a = (raiz.querySelector('#w-5') as SVGGraphicsElement).getBBox();
    const b = (raiz.querySelector('#w-6') as SVGGraphicsElement).getBBox();
    const r = azar(11);
    const y = Math.max(a.y + a.height, b.y + b.height) + 22;
    const x0 = a.x - 14, x1 = b.x + b.width + 18;
    const d = `M ${x0} ${y + r.rango(-2, 2)} C ${x0 + (x1 - x0) * 0.3} ${y + r.rango(-5, 3)}, ${x0 + (x1 - x0) * 0.7} ${y + r.rango(-3, 6)}, ${x1} ${y - 4}`;
    setSubrayado({ d, largo: 0 });
    setGlifos(lista);
  }, [svg, glifos]);

  useLayoutEffect(() => {
    if (!subrayado || subrayado.largo || !trazo.current) return;
    setSubrayado({ ...subrayado, largo: trazo.current.getTotalLength() });
    continueRender(espera);
  }, [subrayado, espera]);

  const t = frame / fps;
  useLayoutEffect(() => {
    if (!glifos) return;
    for (const g of glifos) {
      const w = PALABRAS[g.palabra];
      // dentro de la palabra, las letras arrancan escalonadas (la mano va de izquierda a derecha)
      const t0 = w.t + (g.orden / g.deLaPalabra) * w.dura * 0.55;
      const dibujo = tramo(t, t0, w.dura * 0.6, w.peso);
      const tinta = tramo(t, w.t + w.dura * 0.7, 0.35, 'natural');
      g.el.style.strokeDashoffset = `${(g.largo * (1 - dibujo)).toFixed(2)}`;
      g.el.style.fillOpacity = tinta.toFixed(3);
      g.el.style.strokeOpacity = dibujo > 0 ? '1' : '0';
    }
  }, [t, glifos]);

  const k = tramo(t, T_SUBRAYA, 0.35, 'ligero');
  const teclas = Array.from({ length: Math.ceil(SERIE.length / 3) }, (_, i) => T_FICHA + (i * 3) / CPS_FICHA);

  return (
    <AbsoluteFill>
      <Papel color={PALETA.papel} envejecido={0.55} />
      {/* la luz de la lámpara, arriba a la izquierda: el papel se calienta ahí y se apaga hacia la esquina */}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 70% 80% at 22% 28%, rgba(255,236,200,0.32), rgba(255,236,200,0) 60%), radial-gradient(ellipse 90% 90% at 80% 95%, rgba(28,27,25,0.22), rgba(28,27,25,0) 70%)' }} />
      <div ref={caja} style={{ position: 'absolute', inset: 0, filter: 'drop-shadow(1.5px 2.5px 1.5px rgba(28,27,25,0.22))' }} dangerouslySetInnerHTML={svg ? { __html: svg } : undefined} />
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {subrayado ? (
          <path ref={trazo} d={subrayado.d} fill="none" stroke={PALETA.rojo} strokeWidth={9} strokeLinecap="round"
            strokeDasharray={subrayado.largo || 1} strokeDashoffset={(subrayado.largo || 1) * (1 - k)} opacity={k > 0 ? 0.92 : 0} />
        ) : null}
      </svg>
      <div style={{ position: 'absolute', left: 236, top: 280 }}>
        <Ficha texto={SERIE} t={t - T_FICHA} color={PALETA.fondo} acento={PALETA.rojo} size={24} cps={CPS_FICHA} />
      </div>
      {/* sonido: teclas mientras se escribe la ficha (una de cada tres letras), el lápiz del corrector */}
      {teclas.map((en, i) => <Sfx key={i} nombre={`tecla-${(i % 3) + 1}`} en={en} fps={fps} volumen={0.35} />)}
      <Sfx nombre="lapiz" en={T_SUBRAYA} fps={fps} volumen={0.75} />
    </AbsoluteFill>
  );
};
