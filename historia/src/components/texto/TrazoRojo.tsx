import { azar, semillaDe } from '../../direction/azar';
import { clamp } from '../../direction/anim';

type Props = {
  children: React.ReactNode;
  /** 0–1: cuánto del trazo está dibujado (de izquierda a derecha). */
  k: number;
  color: string;
  tipo?: 'subrayar' | 'tachar';
  grosor?: number;
  /** Semilla del pulso de la mano (por defecto, el texto). */
  semilla?: string;
};

/**
 * Subrayado o tachado a mano sobre un texto en línea: un trazo con temblor, que se dibuja
 * con la velocidad de una mano (no una regla). El tachado lleva una segunda pasada.
 */
export const TrazoRojo: React.FC<Props> = ({ children, k, color, tipo = 'subrayar', grosor = 4, semilla }) => {
  const r = azar(semillaDe(semilla ?? String(children)));
  const y = tipo === 'subrayar' ? 92 : 55;
  const sube = tipo === 'tachar' ? r.rango(-8, -3) : r.rango(-2, 2);
  const d1 = `M-2 ${y + r.rango(-2, 2)} C 30 ${y + sube * 0.3 + r.rango(-3, 3)}, 70 ${y + sube * 0.7 + r.rango(-3, 3)}, 102 ${y + sube}`;
  const d2 = `M101 ${y + sube + 5} C 70 ${y + sube * 0.6 + 7}, 30 ${y + 4 + r.rango(-2, 2)}, 1 ${y + 8}`;
  const k1 = clamp(tipo === 'tachar' ? k / 0.7 : k);
  const k2 = tipo === 'tachar' ? clamp((k - 0.7) / 0.3) : 0;
  // se revela con un recorte (no con dasharray: con trazo de grosor fijo el guion se deforma)
  const id = `tr-${semillaDe((semilla ?? String(children)) + tipo)}`;
  return (
    <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'pre' }}>
      {children}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
        <defs>
          <clipPath id={`${id}-a`}><rect x={-5} y={-50} width={110 * k1} height={200} /></clipPath>
          <clipPath id={`${id}-b`}><rect x={105 - 110 * k2} y={-50} width={110 * k2} height={200} /></clipPath>
        </defs>
        {k1 > 0 ? <path d={d1} clipPath={`url(#${id}-a)`} fill="none" stroke={color} strokeWidth={grosor} vectorEffect="non-scaling-stroke" strokeLinecap="round" opacity={0.92} /> : null}
        {k2 > 0 ? <path d={d2} clipPath={`url(#${id}-b)`} fill="none" stroke={color} strokeWidth={grosor * 0.7} vectorEffect="non-scaling-stroke" strokeLinecap="round" opacity={0.8} /> : null}
      </svg>
    </span>
  );
};
