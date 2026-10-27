import { clamp, mix } from '../../direction/anim';

type Props = {
  id: string;
  /** Ancho en px del dibujo. */
  size?: number;
  /** 0 = gota de mercurio, 1 = barra de plata (la gota se aplasta y de ella sale la barra). */
  forma?: number;
  /** Segundos: hace latir la gota y corre el brillo (para una gota que "respira"). */
  latido?: number;
  /** 0–1: aparición (cae desde arriba y rebota apenas). */
  caida?: number;
};

const PLATA = ['#f4f6f7', '#c9cfd3', '#8d969c', '#4f575d', '#2a2f33'];

/**
 * Mercurio y plata: una gota esférica (el mercurio no moja, se queda redondo) con reflejos de
 * ventana y borde, que puede aplastarse y convertirse en una barra de plata con biseles.
 */
export const GotaMercurio: React.FC<Props> = ({ id, size = 220, forma = 0, latido, caida = 1 }) => {
  const f = clamp(forma);
  const aplasta = clamp(f / 0.45); // la gota se aplasta…
  const barra = clamp((f - 0.35) / 0.65); // …y de ella sale la barra
  const pulso = latido === undefined ? 0 : Math.sin((latido * 2 * Math.PI) / 1.8);
  const cae = clamp(caida);
  const y0 = mix(-160, 0, cae ** 2) + (cae < 1 ? 0 : 0);
  const sx = mix(1, 1.9, aplasta) * (1 + 0.025 * pulso), sy = mix(1, 0.22, aplasta) * (1 - 0.02 * pulso);
  const brillo = latido === undefined ? 0 : (latido / 3.2) % 1;
  return (
    <svg viewBox="-130 -120 260 200" width={size} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={`${id}-esfera`} cx="38%" cy="30%" r="75%">
          <stop offset="0" stopColor={PLATA[0]} />
          <stop offset="0.25" stopColor={PLATA[1]} />
          <stop offset="0.6" stopColor={PLATA[2]} />
          <stop offset="0.86" stopColor={PLATA[3]} />
          <stop offset="1" stopColor={PLATA[4]} />
        </radialGradient>
        <linearGradient id={`${id}-reflejo`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity={0.95} />
          <stop offset="1" stopColor="#ffffff" stopOpacity={0.1} />
        </linearGradient>
        <linearGradient id={`${id}-tapa`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={PLATA[2]} />
          <stop offset={0.15 + 0.7 * brillo} stopColor={PLATA[0]} />
          <stop offset="1" stopColor={PLATA[1]} />
        </linearGradient>
        <linearGradient id={`${id}-frente`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={PLATA[1]} />
          <stop offset="0.5" stopColor={PLATA[2]} />
          <stop offset="1" stopColor={PLATA[3]} />
        </linearGradient>
        <filter id={`${id}-sombra`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={6} /></filter>
      </defs>

      {/* sombra en la mesa */}
      <ellipse cx={0} cy={56} rx={mix(54, 120, Math.max(aplasta, barra)) * mix(0.5, 1, cae)} ry={10} fill="#000" opacity={0.45 * cae} filter={`url(#${id}-sombra)`} />

      {/* la gota */}
      {barra < 1 ? (
        <g transform={`translate(0 ${y0 + 54}) scale(${sx} ${sy}) translate(0 -54)`} opacity={1 - barra}>
          <ellipse cx={0} cy={0} rx={56} ry={54} fill={`url(#${id}-esfera)`} />
          {/* reflejo de ventana arriba y borde de luz abajo: eso lo hace metal líquido */}
          <path d="M-34 -30 C -28 -44, -8 -48, 6 -44 C -6 -36, -20 -30, -30 -18 Z" fill={`url(#${id}-reflejo)`} opacity={0.9} />
          <ellipse cx={-18} cy={-36} rx={5} ry={3.4} fill="#fff" opacity={0.95} />
          <path d="M-40 26 C -20 46, 24 48, 44 22" fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" />
          <path d="M-56 4 C -50 30, -20 50, 10 52" fill="none" stroke="#000" strokeOpacity={0.25} strokeWidth={6} />
        </g>
      ) : null}

      {/* la barra de plata: tapa, frente biselado y costado */}
      {barra > 0 ? (
        <g transform={`translate(0 ${56 - 60 * barra}) scale(${mix(0.6, 1, barra)} ${barra})`} opacity={Math.min(1, barra * 2)}>
          <path d="M-96 0 L96 0 L120 40 L-120 40 Z" fill={`url(#${id}-frente)`} transform="translate(0 20)" />
          <path d="M-80 -22 L80 -22 L96 20 L-96 20 Z" fill={`url(#${id}-tapa)`} />
          <path d="M96 20 L120 60 L120 62 L96 20 Z" fill={PLATA[3]} />
          <path d="M-80 -22 L80 -22" stroke="#fff" strokeOpacity={0.7} strokeWidth={1.4} />
          <path d="M-96 20 L96 20" stroke="#fff" strokeOpacity={0.35} strokeWidth={1} />
          {/* marcas de quinto real, sin texto: tres punzones */}
          {[-38, 0, 38].map((x) => <circle key={x} cx={x} cy={0} r={6} fill="none" stroke={PLATA[3]} strokeWidth={1.6} opacity={0.6} />)}
        </g>
      ) : null}
    </svg>
  );
};
