import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import { FiltroTiza, TIZA } from '../texto/Tiza';
import { RosaDeLosVientos } from './RosaDeLosVientos';

type Props = {
  paleta: Paleta;
  id: string;
  /** Grados de la aguja (0 = arriba, sentido horario). */
  angulo: number;
  /** Rótulos de los dos polos entre los que gira la aguja, con su ángulo. */
  polos: { texto: string; angulo: number }[];
  radio?: number;
  /** Ángulos de los topes del dial: la aguja choca ahí y rebota. */
  topes?: number[];
  /** 0–1: la brújula se vuelve dibujo de tiza (DIRECCION_DE_VIDEO §2.3); los rótulos se borran. */
  tiza?: number;
};

/** Brújula de bronce: rosa grabada, vidrio con reflejo y una aguja que gira despacio entre dos rótulos. */
export const Brujula: React.FC<Props> = ({ paleta, id, angulo, polos, radio: R = 300, topes = [], tiza = 0 }) => {
  const bronce = mezclar(paleta.ocre, paleta.fondo, 0.1);
  const cx = 960, cy = 560;
  const punto = (a: number, r: number) => [cx + Math.sin((a * Math.PI) / 180) * r, cy - Math.cos((a * Math.PI) / 180) * r];
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      {/* la brújula de tiza: el mismo dibujo, a mano, sobre la pizarra (trazos dobles que no cierran
          justo, la rosa con un lado sombreado con la tiza de costado, la aguja en tiza roja) */}
      {tiza > 0 ? (() => {
        // círculo a mano: el radio tiembla un poco y el trazo se pasa del cierre
        const aMano = (r: number, semilla: number, pasa = 14) => {
          let d = '';
          for (let a = -6; a <= 360 + pasa; a += 4) {
            const rr = r + 2.2 * Math.sin((a * Math.PI) / 180 * 3 + semilla) + 1.4 * Math.sin((a * Math.PI) / 180 * 7 + semilla * 2);
            const [x, y] = punto(a + semilla * 9, rr);
            d += `${a === -6 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
          }
          return d;
        };
        const ROJA = '#e08a7e';
        const estrella = (r1: number, r2: number, n: number, giro = 0) =>
          Array.from({ length: n * 2 }, (_, i) => {
            const [x, y] = punto(giro + (i * 180) / n, i % 2 === 0 ? r1 : r2);
            return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
          }).join(' ') + ' Z';
        // el lado sombreado de cada punta de la rosa: rayas de tiza de costado
        const sombra = (a: number, r1: number, r2: number) => {
          const [x0, y0] = punto(a, r1), [x1, y1] = punto(a + 45 / 2, r2);
          return `M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} L${x1.toFixed(1)} ${y1.toFixed(1)} Z`;
        };
        return (
          <g opacity={tiza}>
            <defs>
              <FiltroTiza id={`${id}-tiza`} semilla={21} />
              <pattern id={`${id}-costado`} width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
                <rect x={0} y={0} width={7} height={3.2} fill={TIZA} opacity={0.55} />
              </pattern>
              <radialGradient id={`${id}-polvo`}>
                <stop offset="0.6" stopColor={TIZA} stopOpacity={0} />
                <stop offset="0.85" stopColor={TIZA} stopOpacity={0.07} />
                <stop offset="1" stopColor={TIZA} stopOpacity={0} />
              </radialGradient>
            </defs>
            {/* el polvo de lo que se borró alrededor */}
            <circle cx={cx} cy={cy} r={R + 80} fill={`url(#${id}-polvo)`} />
            <g filter={`url(#${id}-tiza)`} stroke={TIZA} fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d={aMano(R + 22, 1.3)} strokeWidth={4.5} />
              <path d={aMano(R + 14, 4.1, -10)} strokeWidth={1.8} opacity={0.6} />
              <path d={aMano(R - 10, 2.7, 6)} strokeWidth={2.2} opacity={0.75} />
              {/* marcas: cada 10°, más largas cada 30° y en los puntos cardinales */}
              {Array.from({ length: 36 }, (_, i) => {
                const largo = i % 9 === 0 ? 46 : i % 3 === 0 ? 30 : 16;
                const [x1, y1] = punto(i * 10, R - 10), [x2, y2] = punto(i * 10 + (i % 2 ? 0.6 : -0.4), R - 10 - largo);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i % 3 === 0 ? 3 : 1.8} opacity={i % 3 === 0 ? 1 : 0.7} />;
              })}
              {/* la rosa: dos estrellas, con el lado de cada punta sombreado */}
              <path d={estrella(R * 0.62, R * 0.12, 4)} strokeWidth={2.6} />
              <path d={estrella(R * 0.4, R * 0.1, 4, 45)} strokeWidth={1.8} opacity={0.75} />
              {[0, 90, 180, 270].map((a) => <path key={a} d={sombra(a, R * 0.62, R * 0.12)} fill={`url(#${id}-costado)`} stroke="none" />)}
            </g>
            {/* los puntos cardinales, escritos a mano */}
            {[['N', 0], ['E', 90], ['S', 180], ['O', 270]].map(([l, a]) => {
              const [x, y] = punto(a as number, R + 56);
              return (
                <text key={l as string} x={x} y={y + 13} textAnchor="middle" fill={TIZA} fontFamily={fuente.imprentaItalica} fontSize={l === 'N' ? 40 : 32}
                  filter={`url(#${id}-tiza)`} opacity={l === 'N' ? 1 : 0.8}>{l}</text>
              );
            })}
            {/* la aguja: la mitad que apunta en tiza roja, la otra en blanca; rellenas de costado */}
            <g transform={`rotate(${angulo} ${cx} ${cy})`} filter={`url(#${id}-tiza)`} strokeLinejoin="round">
              <path d={`M${cx} ${cy - R * 0.86} L${cx + 22} ${cy} L${cx - 22} ${cy} Z`} fill={ROJA} fillOpacity={0.55} stroke={ROJA} strokeWidth={4} />
              <path d={`M${cx} ${cy + R * 0.86} L${cx + 22} ${cy} L${cx - 22} ${cy} Z`} fill={`url(#${id}-costado)`} stroke={TIZA} strokeWidth={4} />
              <line x1={cx} y1={cy - R * 0.8} x2={cx} y2={cy + R * 0.8} stroke={TIZA} strokeWidth={1.4} opacity={0.5} />
            </g>
            <g filter={`url(#${id}-tiza)`} fill="none" stroke={TIZA}>
              <circle cx={cx} cy={cy} r={13} strokeWidth={3.5} />
              <circle cx={cx} cy={cy} r={4} fill={TIZA} />
            </g>
          </g>
        );
      })() : null}
      <g opacity={1 - tiza}>
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
      {/* los topes del dial: la aguja llega hasta acá */}
      {topes.map((a, i) => {
        const [x, y] = punto(a, R - 34);
        return <circle key={`t${i}`} cx={x} cy={y} r={9} fill={mezclar(bronce, '#000000', 0.25)} stroke={mezclar(bronce, '#ffffff', 0.3)} strokeWidth={2} />;
      })}
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
      </g>
    </svg>
  );
};
