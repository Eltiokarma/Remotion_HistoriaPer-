import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { beat, tramo } from '../../direction/anim';
import { fuente } from '../../fonts';
import type { EscenaProps } from './comun';

type Capitulo = { desde: number; hasta: number };
const ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const X0 = 150, X1 = 1650, Y = 560, ALTO = 30;

export const S05Serie: React.FC<EscenaProps> = ({ escena, paleta, fps }) => {
  const t = useCurrentFrame() / fps;
  const b = escena.beats;
  const caps = escena.capitulos as Capitulo[];
  const fondoAsset = escena.fondo_asset as string | null;
  const inicio = caps[0].desde, fin = caps[caps.length - 1].hasta + 1;
  // Cada época mide lo que duraron sus años: el largo de un período también es un dato.
  const px = (anio: number) => X0 + ((anio - inicio) / (fin - inicio)) * (X1 - X0);
  const tLinea = beat(b, 'linea', 1), tCaps = beat(b, 'capitulos', 2), paso = beat(b, 'paso', 1.5);
  const tPregunta = beat(b, 'pregunta', 15.5);
  const eje = tramo(t, tLinea, 1, 'pesado');
  // En la pregunta, la línea sigue más allá del 2000: el problema no terminó.
  const hoy = tramo(t, tPregunta, 1.6, 'pesado');

  return (
    <AbsoluteFill style={{ backgroundColor: paleta.fondo }}>
      {fondoAsset ? (
        <Img src={staticFile(fondoAsset)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12, filter: 'grayscale(1)' }} />
      ) : null}
      <svg width={1920} height={1080} style={{ position: 'absolute' }}>
        <line x1={X0} x2={X0 + (X1 - X0) * eje} y1={Y + ALTO + 18} y2={Y + ALTO + 18} stroke={paleta.papel} strokeWidth={2} opacity={0.6} />
        {[1750, 1800, 1850, 1900, 1950, 2000].map((a) => (
          <g key={a} opacity={0.45 * eje}>
            <line x1={px(a)} x2={px(a)} y1={Y + ALTO + 10} y2={Y + ALTO + 26} stroke={paleta.papel} strokeWidth={2} />
          </g>
        ))}
        <line x1={X1} x2={X1 + (1920 - X1) * hoy} y1={Y + ALTO / 2} y2={Y + ALTO / 2} stroke={paleta.rojo} strokeWidth={6} strokeDasharray="14 10" />
        {caps.map((c, i) => {
          const t0 = tCaps + i * paso;
          const enciende = tramo(t, t0, 0.7, 'pesado');
          const siguiente = i < caps.length - 1 ? tramo(t, t0 + paso, 0.5, 'natural') : 0;
          const x = px(c.desde) + 2, w = px(c.hasta + 1) - px(c.desde) - 4;
          const color = siguiente > 0.5 ? paleta.papel : paleta.ocre;
          const op = 1 - 0.45 * siguiente;
          const abajo = i % 2 === 0;
          return (
            <g key={i}>
              <rect x={x} y={Y} width={w} height={ALTO} fill="none" stroke={paleta.papel} strokeOpacity={0.25 * eje} />
              <rect x={x} y={Y} width={w * enciende} height={ALTO} fill={color} opacity={op} />
              <text x={x + w / 2} y={Y - 26} textAnchor="middle" fill={paleta.papel} fontFamily={fuente.titulo} fontWeight={700} fontSize={44}
                opacity={enciende * op}>{ROMANOS[i]}</text>
              <text x={x + w / 2} y={Y + ALTO + (abajo ? 66 : 108)} textAnchor="middle" fill={paleta.ocre} fontFamily={fuente.mono} fontSize={25}
                opacity={enciende}>{`${c.desde}–${c.hasta}`}</text>
            </g>
          );
        })}
        <text x={1900} y={Y - 26} textAnchor="end" fill={paleta.rojo} fontFamily={fuente.mono} fontSize={30} opacity={hoy}>hoy</text>
      </svg>
    </AbsoluteFill>
  );
};
