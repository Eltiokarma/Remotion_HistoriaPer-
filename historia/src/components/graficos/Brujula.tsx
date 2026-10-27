import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import { RosaDeLosVientos } from './RosaDeLosVientos';

type Props = {
  paleta: Paleta;
  id: string;
  /** Grados de la aguja (0 = arriba, sentido horario). */
  angulo: number;
  /** Rótulos de los dos polos entre los que gira la aguja, con su ángulo. */
  polos: { texto: string; angulo: number }[];
  radio?: number;
};

/** Brújula de bronce: rosa grabada, vidrio con reflejo y una aguja que gira despacio entre dos rótulos. */
export const Brujula: React.FC<Props> = ({ paleta, id, angulo, polos, radio: R = 300 }) => {
  const bronce = mezclar(paleta.ocre, paleta.fondo, 0.1);
  const cx = 960, cy = 560;
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <radialGradient id={`${id}-bisel`} cx="40%" cy="35%">
          <stop offset="0.75" stopColor={mezclar(bronce, '#ffffff', 0.3)} />
          <stop offset="0.9" stopColor={bronce} />
          <stop offset="1" stopColor={mezclar(bronce, '#000000', 0.55)} />
        </radialGradient>
        <radialGradient id={`${id}-esfera`} cx="50%" cy="45%">
          <stop offset="0" stopColor={mezclar(paleta.papel, paleta.ocre, 0.12)} />
          <stop offset="1" stopColor={mezclar(paleta.papel, paleta.fondo, 0.3)} />
        </radialGradient>
        <linearGradient id={`${id}-vidrio`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.35} />
          <stop offset="0.45" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <filter id={`${id}-sombra`}><feGaussianBlur stdDeviation={14} /></filter>
      </defs>
      <circle cx={cx + 18} cy={cy + 26} r={R + 34} fill="#000" opacity={0.55} filter={`url(#${id}-sombra)`} />
      <circle cx={cx} cy={cy} r={R + 34} fill={`url(#${id}-bisel)`} />
      <circle cx={cx} cy={cy} r={R} fill={`url(#${id}-esfera)`} />
      {/* graduación */}
      {Array.from({ length: 120 }, (_, i) => {
        const a = (i * 3 * Math.PI) / 180, l = i % 10 === 0 ? 26 : i % 5 === 0 ? 16 : 8;
        return <line key={i} x1={cx + Math.sin(a) * (R - 8)} y1={cy - Math.cos(a) * (R - 8)} x2={cx + Math.sin(a) * (R - 8 - l)} y2={cy - Math.cos(a) * (R - 8 - l)} stroke={paleta.fondo} strokeWidth={i % 10 === 0 ? 2 : 1} opacity={0.6} />;
      })}
      <g opacity={0.5}><RosaDeLosVientos x={cx} y={cy} radio={R * 0.62} paleta={{ ...paleta, ocre: mezclar(paleta.fondo, paleta.ocre, 0.4), fondo: mezclar(paleta.papel, paleta.fondo, 0.15) }} opacidad={1} /></g>
      {/* los dos polos */}
      {polos.map((p, i) => {
        const a = (p.angulo * Math.PI) / 180;
        const near = 1 - Math.min(1, Math.abs(((angulo - p.angulo + 540) % 360) - 180) / 60);
        return (
          <g key={i}>
            <line x1={cx + Math.sin(a) * (R + 40)} y1={cy - Math.cos(a) * (R + 40)} x2={cx + Math.sin(a) * (R + 90)} y2={cy - Math.cos(a) * (R + 90)} stroke={paleta.ocre} strokeWidth={2} />
            <text x={cx + Math.sin(a) * (R + 150)} y={cy - Math.cos(a) * (R + 150) + 14} textAnchor="middle" fill={near > 0.3 ? paleta.papel : alfa(paleta.ocre, 0.7)}
              fontFamily={fuente.mono} fontSize={44} letterSpacing={4}>{p.texto}</text>
          </g>
        );
      })}
      {/* la aguja: roja hacia donde apunta, oscura atrás */}
      <g transform={`rotate(${angulo} ${cx} ${cy})`}>
        <path d={`M${cx} ${cy - R * 0.86} L${cx + 22} ${cy} L${cx - 22} ${cy} Z`} fill={paleta.rojo} />
        <path d={`M${cx} ${cy - R * 0.86} L${cx + 22} ${cy} L${cx} ${cy} Z`} fill="#000" opacity={0.2} />
        <path d={`M${cx} ${cy + R * 0.86} L${cx + 22} ${cy} L${cx - 22} ${cy} Z`} fill={mezclar(paleta.fondo, paleta.papel, 0.15)} />
      </g>
      <circle cx={cx} cy={cy} r={16} fill={`url(#${id}-bisel)`} stroke={mezclar(bronce, '#000000', 0.4)} />
      <circle cx={cx} cy={cy} r={R} fill={`url(#${id}-vidrio)`} />
      <path d={`M${cx - R * 0.7} ${cy - R * 0.45} A ${R * 0.9} ${R * 0.9} 0 0 1 ${cx - R * 0.1} ${cy - R * 0.88}`} fill="none" stroke="#fff" strokeOpacity={0.4} strokeWidth={6} strokeLinecap="round" />
    </svg>
  );
};
