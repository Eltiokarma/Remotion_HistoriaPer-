import { useMemo } from 'react';
import { clamp } from '../../direction/anim';
import { azar } from '../../direction/azar';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';

type Props = {
  paleta: Paleta;
  id: string;
  /** 0–1: se van ocupando los asientos (en desorden, como entra la gente). */
  llenado: number;
  /** 0–1: aparición del aula vacía. */
  aparece?: number;
};

const CX = 960, CY = 1090;

/** Un aula en anfiteatro vista desde la tarima: filas de asientos que se van llenando. */
export const Aula: React.FC<Props> = ({ paleta, id, llenado, aparece = 1 }) => {
  const asientos = useMemo(() => {
    const r = azar(1990);
    const out: { x: number; y: number; r: number; orden: number }[] = [];
    for (let f = 0; f < 11; f++) {
      const radio = 380 + f * 62;
      const n = Math.round(14 + f * 3.2);
      for (let i = 0; i < n; i++) {
        const a = Math.PI * (1.12 + (0.76 * (i + 0.5)) / n);
        out.push({ x: CX + radio * Math.cos(a), y: CY + radio * Math.sin(a) * 0.72, r: 9 + f * 0.6, orden: r.n() });
      }
    }
    return out;
  }, []);
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: aparece }}>
      {/* gradas */}
      {Array.from({ length: 12 }, (_, f) => {
        const radio = 350 + f * 62;
        return <path key={f} d={`M${CX + radio * Math.cos(Math.PI * 1.1)} ${CY + radio * Math.sin(Math.PI * 1.1) * 0.72} A ${radio} ${radio * 0.72} 0 0 1 ${CX + radio * Math.cos(Math.PI * 1.9)} ${CY + radio * Math.sin(Math.PI * 1.9) * 0.72}`}
          fill="none" stroke={alfa(paleta.ocre, 0.35)} strokeWidth={1.4} />;
      })}
      {asientos.map((s, i) => {
        const on = clamp((llenado - s.orden * 0.9) / 0.1);
        return (
          <g key={i}>
            <circle cx={s.x} cy={s.y} r={s.r} fill="none" stroke={alfa(paleta.ocre, 0.45)} strokeWidth={1.2} />
            {on > 0 ? <circle cx={s.x} cy={s.y} r={s.r * 0.78 * on} fill={mezclar(paleta.papel, paleta.ocre, 0.2)} opacity={0.9} /> : null}
          </g>
        );
      })}
      {/* la tarima */}
      <path d={`M${CX - 260} 1080 L${CX - 200} 1010 L${CX + 200} 1010 L${CX + 260} 1080 Z`} fill={mezclar(paleta.fondo, paleta.ocre, 0.25)} stroke={alfa(paleta.ocre, 0.5)} />
    </svg>
  );
};
