import { AbsoluteFill, interpolateColors, spring, useCurrentFrame } from 'remotion';
import { beat, mix, tramo } from '../../direction/anim';
import { fuente } from '../../fonts';
import { texto, type EscenaProps } from './comun';

const CARRILES = 10, SEP = 92, Y0 = 130, BOYA = 38;

export const S02Nadador: React.FC<EscenaProps> = ({ escena, paleta, fps }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const b = escena.beats;

  // El carril corre y se va frenando (como quien termina un largo).
  const avance = tramo(t, 0, 4.2, 'natural');
  const dx = -2600 * avance;
  // Al frenar, las boyas se funden en una línea: el carril se vuelve renglón.
  const renglon = tramo(t, 3.0, 0.9, 'solemne');
  const fondo = interpolateColors(renglon, [0, 1], [paleta.fondo, paleta.papel]);
  const margen = tramo(t, 4.0, 0.9, 'pesado');

  const tNombre = beat(b, 'nombre', 4.6);
  const nombre = texto(escena, 'nombre');
  const tSello = beat(b, 'sello', 12.8);
  const golpe = spring({ frame: frame - tSello * fps, fps, config: { damping: 13, mass: 1.5, stiffness: 190 } });
  const escalaSello = t < tSello ? 0 : mix(2.3, 1, golpe);
  // Un temblor mínimo al caer el sello: 0.15 s, y nada más se mueve.
  const temblor = t > tSello + 0.12 && t < tSello + 0.3 ? Math.sin(frame * 3.1) * 3 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: fondo, transform: `translateY(${temblor}px)` }}>
      <svg width={1920} height={1080} style={{ position: 'absolute' }}>
        {Array.from({ length: CARRILES }, (_, i) => {
          const y = Y0 + i * SEP;
          return (
            <g key={i}>
              <line x1={0} x2={1920} y1={y} y2={y} stroke={paleta.fondo} strokeWidth={2} opacity={0.18 + 0.32 * renglon} />
              {renglon < 1 && Array.from({ length: Math.ceil(1920 / BOYA) + 2 }, (_, k) => {
                const x = (((k * BOYA + dx * (1 + (i % 3) * 0.08)) % (BOYA * 52)) + BOYA * 52) % (BOYA * 52) - BOYA;
                return x < 1960 ? (
                  <circle key={k} cx={x} cy={y} r={9 * (1 - renglon)}
                    fill={k % 6 < 3 ? paleta.rojo : paleta.ocre} opacity={1 - renglon} />
                ) : null;
              })}
            </g>
          );
        })}
        {/* margen rojo del libro contable */}
        <line x1={250} x2={250} y1={0} y2={1080 * margen} stroke={paleta.rojo} strokeWidth={3} opacity={0.8} />
      </svg>

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
        <div style={{ fontFamily: fuente.titulo, fontWeight: 700, fontSize: 112, color: paleta.fondo, letterSpacing: '0.02em', display: 'flex' }}>
          {nombre.split('').map((ch, i) => {
            // cada letra se asienta con 2 frames de desfase: nada se detiene a la vez
            const k = tramo(t, tNombre + (i * 2) / fps, 0.9, 'solemne');
            return <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre', opacity: k, transform: `translateY(${(1 - k) * 46}px)` }}>{ch}</span>;
          })}
        </div>
        <div style={{ fontFamily: fuente.mono, fontSize: 46, color: paleta.fondo, letterSpacing: '0.2em', marginTop: 18,
          opacity: 0.75 * tramo(t, tNombre + 1.6, 0.8, 'natural') }}>
          {texto(escena, 'anios')}
        </div>
      </AbsoluteFill>

      {/* sello */}
      <div style={{ position: 'absolute', left: 1290, top: 700, transform: `rotate(-9deg) scale(${escalaSello})`,
        opacity: Math.min(1, escalaSello * 3), border: `6px double ${paleta.rojo}`, padding: '14px 34px',
        fontFamily: fuente.mono, fontWeight: 600, fontSize: 54, letterSpacing: '0.18em', color: paleta.rojo, mixBlendMode: 'multiply' }}>
        {texto(escena, 'sello')}
      </div>
    </AbsoluteFill>
  );
};
