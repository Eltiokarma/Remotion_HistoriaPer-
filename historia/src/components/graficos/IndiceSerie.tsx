import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';

const ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

type Props = {
  paleta: Paleta;
  capitulos: { desde: number; hasta: number; titulo: string }[];
  /** 0–1 por capítulo: se enciende su línea del índice y su tramo de la línea de tiempo. */
  encendido: number[];
  /** 0–1: aparición de la página. */
  aparece?: number;
  /** Encabezado de la página. */
  encabezado?: string;
};

/**
 * El mapa de la serie: un índice de libro (número, título, años con puntos guía) y debajo la
 * línea de tiempo, con el largo de cada época proporcional a sus años.
 */
export const IndiceSerie: React.FC<Props> = ({ paleta, capitulos, encendido, aparece = 1, encabezado = 'Índice' }) => {
  const ini = capitulos[0].desde, fin = capitulos[capitulos.length - 1].hasta + 1;
  const X0 = 300, X1 = 1620;
  const X = (a: number) => X0 + ((a - ini) / (fin - ini)) * (X1 - X0);
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: aparece }}>
      <div style={{ position: 'absolute', left: 300, top: 110, width: 1320, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontFamily: fuente.libro, fontSize: 34, letterSpacing: '0.4em', fontVariant: 'small-caps', color: paleta.ocre, textAlign: 'center', marginBottom: 26 }}>
          {encabezado.toLowerCase()}
        </div>
        {capitulos.map((c, i) => {
          const k = encendido[i] ?? 0;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 24, fontFamily: fuente.libro, fontSize: 40, lineHeight: 1.62,
              color: k > 0 ? alfa(paleta.papel, 0.35 + 0.65 * k) : alfa(paleta.papel, 0.25) }}>
              <span style={{ width: 70, textAlign: 'right', fontFamily: fuente.titulo, fontWeight: 700, color: k > 0.5 ? paleta.ocre : 'inherit' }}>{ROMANOS[i]}</span>
              <span style={{ fontStyle: 'italic' }}>{c.titulo}</span>
              <span style={{ flex: 1, borderBottom: `2px dotted ${alfa(paleta.papel, 0.25 + 0.3 * k)}`, transform: 'translateY(-10px)' }} />
              <span style={{ fontFamily: fuente.mono, fontSize: 30, letterSpacing: '0.08em', color: k > 0.5 ? paleta.papel : 'inherit' }}>{`${c.desde}–${c.hasta}`}</span>
            </div>
          );
        })}
      </div>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <line x1={X0} x2={X1} y1={930} y2={930} stroke={alfa(paleta.ocre, 0.5)} strokeWidth={2} />
        {capitulos.map((c, i) => {
          const k = encendido[i] ?? 0;
          return (
            <g key={i}>
              <rect x={X(c.desde) + 2} y={906} width={X(c.hasta + 1) - X(c.desde) - 4} height={48} rx={3}
                fill={k > 0 ? mezclar(mezclar(paleta.fondo, paleta.ocre, 0.25), i % 2 ? paleta.rojo : paleta.ocre, 0.55 * k) : alfa(paleta.ocre, 0.12)} />
              <text x={(X(c.desde) + X(c.hasta + 1)) / 2} y={939} textAnchor="middle" fill={k > 0.5 ? paleta.papel : alfa(paleta.papel, 0.4)} fontFamily={fuente.titulo} fontWeight={700} fontSize={22}>{ROMANOS[i]}</text>
            </g>
          );
        })}
        {[ini, fin - 1].map((a) => <text key={a} x={X(a === ini ? a : a + 1)} y={994} textAnchor="middle" fill={alfa(paleta.ocre, 0.8)} fontFamily={fuente.mono} fontSize={24}>{a}</text>)}
      </svg>
    </div>
  );
};
