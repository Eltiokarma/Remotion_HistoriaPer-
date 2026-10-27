import { clamp, mix } from '../../direction/anim';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import { TrazoRojo } from '../texto/TrazoRojo';

type Props = {
  paleta: Paleta;
  /** Frase del cartel (se corta en dos líneas después de la coma). */
  frase: string;
  /** Palabra que se tacha. */
  tachar?: string;
  /** Palabra que queda sola al final. */
  queda?: string;
  /** Color del cartel (por defecto, el ocre llevado a amarillo de obra). */
  color?: string;
  /** 0–1: el cartel se planta. */
  planta: number;
  /** 0–1: las letras se colocan, una tras otra. */
  letras: number;
  /** 0–1: tachado. */
  tachado: number;
  /** 0–1: todo se apaga menos la palabra que queda. */
  soloQueda: number;
};

/**
 * Cartel de obra pública genérico (no imita ninguno real): tablero amarillo con franjas de
 * peligro, pernos y dos postes; letras de palo seco que se colocan una a una.
 */
export const CartelObra: React.FC<Props> = ({ paleta, frase, tachar, queda, color, planta, letras, tachado, soloQueda }) => {
  const amarillo = color ?? mezclar(paleta.ocre, '#f2c230', 0.62);
  const negro = mezclar(paleta.fondo, '#000000', 0.4);
  // dos líneas lo más parejas posible
  const todas = frase.split(/\s+/);
  let mejor = 1, peor = Infinity;
  for (let c = 1; c < todas.length; c++) {
    const largo = Math.max(todas.slice(0, c).join(' ').length, todas.slice(c).join(' ').length);
    if (largo < peor) { peor = largo; mejor = c; }
  }
  const palabras = todas.length > 1 ? [todas.slice(0, mejor), todas.slice(mejor)] : [todas];
  const cuerpo = Math.min(168, 1060 / (0.5 * peor));
  const total = frase.replace(/\s/g, '').length;
  let n = 0;
  const caida = (1 - planta) * -900;
  return (
    <div style={{ position: 'relative', width: 1400, height: 900, transform: `translateY(${caida}px)` }}>
      {/* postes */}
      {[260, 1140].map((x) => (
        <div key={x} style={{ position: 'absolute', left: x - 18, top: 520, width: 36, height: 420, background: `linear-gradient(90deg, ${mezclar(negro, '#ffffff', 0.1)}, ${negro})` }} />
      ))}
      {/* tablero con franjas de peligro */}
      <div style={{ position: 'absolute', left: 100, top: 40, width: 1200, height: 560, background: `repeating-linear-gradient(-45deg, ${amarillo} 0 34px, ${negro} 34px 68px)`,
        boxShadow: `14px 22px 40px ${alfa('#000000', 0.55)}`, borderRadius: 6 }}>
        <div style={{ position: 'absolute', inset: 34, background: amarillo, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
          boxShadow: `inset 0 0 50px ${alfa('#000000', 0.25)}` }}>
          {palabras.map((ps, li) => (
            <div key={li} style={{ display: 'flex', gap: 34, fontFamily: fuente.afiche, fontWeight: 700, fontSize: cuerpo, lineHeight: 1.02, color: negro, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
              {ps.map((p, pi) => {
                const limpia = p.replace(/[,.]/g, '');
                const esTachada = tachar && limpia === tachar;
                const esQueda = queda && limpia === queda;
                const letrasP = p.split('').map((ch, ci) => {
                  const k = clamp(letras * total - n++);
                  // la puntuación no es parte de la palabra que queda: se apaga con lo demás
                  const signo = /[,.;:]/.test(ch);
                  return <span key={ci} style={{ display: 'inline-block', opacity: k * (signo && esQueda ? mix(1, 0.04, soloQueda) : 1), transform: `translateY(${(1 - k) * -40}px) rotate(${(1 - k) * (ci % 2 ? 6 : -6)}deg)` }}>{ch}</span>;
                });
                const apaga = esQueda ? 1 : mix(1, 0.04, soloQueda);
                return (
                  <span key={pi} style={{ opacity: apaga, whiteSpace: 'nowrap', color: esQueda ? mezclar(negro, paleta.rojo, soloQueda * 0.85) : negro }}>
                    {esTachada ? <TrazoRojo k={tachado} color={paleta.rojo} tipo="tachar" grosor={16}>{letrasP}</TrazoRojo> : letrasP}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
        {/* pernos */}
        {[[50, 50], [1150, 50], [50, 510], [1150, 510]].map(([x, y], i) => (
          <div key={i} style={{ position: 'absolute', left: x - 9, top: y - 9, width: 18, height: 18, borderRadius: 9, background: `radial-gradient(circle at 35% 35%, #ddd, #444)` }} />
        ))}
      </div>
    </div>
  );
};
