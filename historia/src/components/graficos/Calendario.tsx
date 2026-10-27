import { azar } from '../../direction/azar';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import { Papel } from '../atmosfera/Papel';

type Props = {
  paleta: Paleta;
  /** Número que muestra la hoja de arriba. */
  dia: number;
  /** Hoja que se está arrancando (su número y su avance 0–1), si hay una. */
  cayendo?: { dia: number; k: number } | null;
  /** Ángulo (grados) con que se levanta la hoja que no quiere caer. */
  tiron?: number;
  /** Cuántas hojas ya se arrancaron (deja los restos pegados arriba). */
  arrancadas?: number;
  etiqueta?: string;
  width?: number;
  height?: number;
};

const CABEZAL = 64;

const Hoja: React.FC<{ paleta: Paleta; dia: number; etiqueta: string; sombreado?: number }> = ({ paleta, dia, etiqueta, sombreado = 0 }) => (
  <Papel color={paleta.papel} envejecido={0.18} escala={512}>
    {/* línea troquelada por donde se arranca */}
    <div style={{ position: 'absolute', left: 14, right: 14, top: 10, borderTop: `2px dotted ${alfa(paleta.fondo, 0.35)}` }} />
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 10 }}>
      <div style={{ fontFamily: fuente.imprenta, fontSize: 30, letterSpacing: '0.42em', color: paleta.rojo, marginRight: '-0.42em' }}>{etiqueta}</div>
      <div style={{ width: 120, height: 1.5, background: alfa(paleta.fondo, 0.4), margin: '10px 0 4px' }} />
      <div style={{ fontFamily: fuente.titulo, fontWeight: 700, fontSize: 200, lineHeight: 1, color: paleta.fondo, fontVariantNumeric: 'lining-nums' }}>{dia}</div>
    </div>
    {/* la hoja no es plana: un poco más oscura abajo */}
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(0,0,0,0) 55%, ${alfa(paleta.fondo, 0.14)} 100%)` }} />
    {sombreado > 0 ? <div style={{ position: 'absolute', inset: 0, background: alfa(paleta.fondo, sombreado) }} /> : null}
  </Papel>
);

/**
 * Taco de calendario de los que se arrancan: cabezal con ojales, grosor de hojas, troquel,
 * y la hoja que cae girando en 3D con su sombra.
 */
export const Calendario: React.FC<Props> = ({ paleta, dia, cayendo, tiron = 0, arrancadas = 0, etiqueta = 'DÍA', width = 380, height = 430 }) => {
  const r = azar(41);
  const restos = Array.from({ length: 24 }, (_, i) => `${(i / 23) * 100}% ${r.rango(0, 100)}%`).join(', ');
  const k = cayendo?.k ?? 0;
  const arranque = Math.min(1, k / 0.25);
  const caida = Math.max(0, (k - 0.2) / 0.8);
  return (
    <div style={{ position: 'relative', width, height: height + CABEZAL, perspective: 1600 }}>
      {/* sombra del taco sobre la mesa */}
      <div style={{ position: 'absolute', left: 18, right: -18, top: 30, bottom: -22, background: '#000', opacity: 0.5, filter: 'blur(18px)' }} />
      {/* grosor: los bordes de las hojas de abajo */}
      {[6, 5, 4, 3, 2, 1].map((i) => (
        <div key={i} style={{ position: 'absolute', left: i * 0.6, right: -i * 0.6, top: CABEZAL, bottom: -i * 3,
          background: mezclar(paleta.papel, paleta.fondo, 0.12 + i * 0.05), borderBottom: `1px solid ${alfa(paleta.fondo, 0.25)}` }} />
      ))}
      {/* hoja de arriba (la que se ve) */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: CABEZAL, bottom: 0, transformOrigin: '50% 0%',
        transform: `rotateX(${-tiron * 0.6}deg) rotateZ(${tiron * 0.25}deg)` }}>
        <Hoja paleta={paleta} dia={dia} etiqueta={etiqueta} sombreado={0.18 * arranque * (1 - caida)} />
      </div>
      {/* restos de papel de las hojas ya arrancadas */}
      {arrancadas > 0 ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: CABEZAL - 2, height: 12, background: mezclar(paleta.papel, paleta.fondo, 0.08),
          clipPath: `polygon(0% 0%, 100% 0%, ${restos.split(', ').reverse().join(', ')})` }} />
      ) : null}
      {/* hoja que se arranca: gira hacia la cámara, se suelta y cae */}
      {cayendo ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: CABEZAL, bottom: 0, transformOrigin: '50% 0%',
          transform: `translateY(${980 * caida * caida}px) translateX(${-60 * caida}px) rotateX(${-38 * arranque - 30 * caida}deg) rotateZ(${-7 * arranque - 24 * caida}deg)`,
          opacity: 1 - Math.max(0, (caida - 0.75) / 0.25) }}>
          <Hoja paleta={paleta} dia={cayendo.dia} etiqueta={etiqueta} sombreado={0.25 * arranque} />
        </div>
      ) : null}
      {/* cabezal de cartón con dos ojales de metal */}
      <div style={{ position: 'absolute', left: -6, right: -6, top: 0, height: CABEZAL,
        background: `linear-gradient(180deg, ${mezclar(paleta.rojo, paleta.papel, 0.18)} 0%, ${paleta.rojo} 45%, ${mezclar(paleta.rojo, paleta.fondo, 0.35)} 100%)`,
        boxShadow: `0 6px 10px ${alfa('#000000', 0.35)}` }}>
        {[0.28, 0.72].map((x) => (
          <div key={x} style={{ position: 'absolute', left: `${x * 100}%`, top: 22, width: 20, height: 20, marginLeft: -10, borderRadius: '50%',
            background: `radial-gradient(circle at 35% 30%, ${paleta.papel} 0%, ${paleta.ocre} 35%, ${mezclar(paleta.ocre, paleta.fondo, 0.6)} 100%)`,
            boxShadow: `inset 0 0 0 4px ${alfa(paleta.fondo, 0.0)}, 0 1px 2px ${alfa('#000000', 0.5)}` }}>
            <div style={{ position: 'absolute', inset: 6, borderRadius: '50%', background: mezclar(paleta.fondo, paleta.rojo, 0.2) }} />
          </div>
        ))}
      </div>
    </div>
  );
};
