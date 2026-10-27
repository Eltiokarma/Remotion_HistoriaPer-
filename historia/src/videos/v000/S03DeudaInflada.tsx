import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { beat, tramo } from '../../direction/anim';
import { peso } from '../../direction/easings';
import { fuente } from '../../fonts';
import { texto, type EscenaProps } from './comun';

type Cifra = { desde: number; hasta: number; moneda: string };

// Islas: silueta, y el montículo de guano encima (x, ancho, alto).
const ISLAS = [
  { x: 330, w: 420, h: 120, monte: 150 },
  { x: 860, w: 300, h: 90, monte: 110 },
  { x: 1300, w: 360, h: 105, monte: 130 },
];

const miles = (n: number): string => Math.round(n).toLocaleString('es-PE').replace(/,/g, ' ');

export const S03DeudaInflada: React.FC<EscenaProps> = ({ escena, paleta, fps }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const b = escena.beats;
  const cifra = escena.cifra as Cifra;
  const tLibro = beat(b, 'libro', 6), tCifra = beat(b, 'cifra', 8), tFlecha = beat(b, 'flecha', 13.8);

  const telon = tramo(t, tLibro, 0.9, 'pesado'); // la página del libro tapa el mar
  // La cifra sube acelerando: crece más rápido de lo que debería.
  const valor = interpolate(t, [tCifra, tFlecha - 0.6], [cifra.desde, cifra.hasta], {
    easing: peso.tenso, extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const flecha = tramo(t, tFlecha, 1.1, 'tenso');
  const puntaX = interpolate(flecha, [0, 1], [500, 2010]);

  return (
    <AbsoluteFill style={{ backgroundColor: paleta.fondo }}>
      {/* Mar e islas guaneras */}
      <svg width={1920} height={1080} style={{ position: 'absolute' }}>
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={0} x2={1920} y1={700 + i * 46} y2={700 + i * 46} stroke={paleta.ocre}
            strokeWidth={1.5} opacity={0.35 - i * 0.04} strokeDasharray="60 24" strokeDashoffset={-t * (12 + i * 3)} />
        ))}
        {ISLAS.map((is, i) => {
          const crece = tramo(t, 0.4 + i * 0.5, 2.2, 'pesado');
          const base = 690;
          return (
            <g key={i}>
              <path d={`M${is.x} ${base} Q ${is.x + is.w * 0.15} ${base - is.h} ${is.x + is.w * 0.5} ${base - is.h * 0.9} T ${is.x + is.w} ${base} Z`}
                fill={paleta.fondo} stroke={paleta.ocre} strokeWidth={2.5} />
              <g transform={`translate(0 ${base - is.h * 0.82}) scale(1 ${crece}) translate(0 ${-(base - is.h * 0.82)})`}>
                <path d={`M${is.x + is.w * 0.18} ${base - is.h * 0.82} Q ${is.x + is.w * 0.5} ${base - is.h * 0.82 - is.monte} ${is.x + is.w * 0.82} ${base - is.h * 0.82} Z`}
                  fill={paleta.papel} />
              </g>
            </g>
          );
        })}
      </svg>

      {/* Libro de cuentas */}
      <AbsoluteFill style={{ backgroundColor: paleta.papel, transform: `translateX(${(1 - telon) * 1920}px)` }}>
        <svg width={1920} height={1080} style={{ position: 'absolute' }}>
          {Array.from({ length: 11 }, (_, i) => (
            <line key={i} x1={0} x2={1920} y1={260 + i * 72} y2={260 + i * 72} stroke={paleta.fondo} strokeWidth={1.5} opacity={0.22} />
          ))}
          <line x1={220} x2={220} y1={0} y2={1080} stroke={paleta.rojo} strokeWidth={3} opacity={0.75} />
          <line x1={1180} x2={1180} y1={200} y2={1080} stroke={paleta.fondo} strokeWidth={1.5} opacity={0.35} />
          {/* flecha: sale del casillero "Estado" hacia afuera */}
          <path d="M500 612 C 860 612, 1060 760, 2010 760" pathLength={1} fill="none" stroke={paleta.rojo} strokeWidth={9}
            strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - flecha} opacity={flecha > 0 ? 1 : 0} />
          {flecha > 0 && flecha < 1 ? (
            <polygon points="0,-18 34,0 0,18" fill={paleta.rojo}
              transform={`translate(${puntaX} ${interpolate(puntaX, [500, 1060, 1500, 2010], [612, 690, 748, 760], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`} />
          ) : null}
        </svg>
        <div style={{ position: 'absolute', left: 260, top: 120, fontFamily: fuente.mono, fontSize: 38, letterSpacing: '0.1em', color: paleta.fondo,
          opacity: tramo(t, tLibro + 0.6, 0.8, 'natural') }}>
          {texto(escena, 'rotulo')}
        </div>
        <div style={{ position: 'absolute', left: 260, top: 410, fontFamily: fuente.titulo, fontStyle: 'italic', fontWeight: 400, fontSize: 52, color: paleta.fondo }}>
          {texto(escena, 'concepto')}
        </div>
        <div style={{ position: 'absolute', right: 1920 - 1700, top: 392, fontFamily: fuente.mono, fontWeight: 600, fontSize: 76,
          color: t > tFlecha - 0.6 ? paleta.rojo : paleta.fondo, fontVariantNumeric: 'tabular-nums', opacity: tramo(t, tCifra - 0.4, 0.4, 'ligero') }}>
          {miles(valor)}
        </div>
        <div style={{ position: 'absolute', right: 1920 - 1700, top: 486, fontFamily: fuente.mono, fontSize: 26, color: paleta.fondo, opacity: 0.6 * tramo(t, tCifra, 0.6, 'natural') }}>
          {cifra.moneda}
        </div>
        <div style={{ position: 'absolute', left: 260, top: 576, padding: '8px 26px', border: `3px solid ${paleta.fondo}`,
          fontFamily: fuente.mono, fontSize: 40, color: paleta.fondo, letterSpacing: '0.12em' }}>
          {texto(escena, 'estado')}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
