import { useMemo } from 'react';
import { clamp } from '../../direction/anim';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { textura } from '../../estilo/recursos';
import { Papel } from '../atmosfera/Papel';

type Props = {
  paleta: Paleta;
  /** Segundos de la escena (para el movimiento del agua). */
  t: number;
  /** Cuánto avanzó la cámara sobre la piscina, en px. */
  dx: number;
  /** 0–1: el agua se vuelve papel y las corcheras, renglones de libro contable. */
  renglon: number;
  carriles?: number;
  /** Separación entre corcheras (px). También es la interlínea del libro que queda. */
  separacion?: number;
  /** Primera corchera (px desde arriba). */
  y0?: number;
};

const ANCHO = 1920, ALTO = 1080, BOYA = 34, SUAVE = 180;

/**
 * Dónde va el frente del papel (px) cuando el agua se seca de derecha a izquierda, en la
 * dirección en que avanza la cámara. A la derecha del frente ya hay papel.
 */
export const frenteSecado = (renglon: number) => ANCHO + SUAVE - renglon * (ANCHO + 2 * SUAVE);

/** 0 = todavía agua, 1 = ya papel, en la posición x. */
export const cubierto = (x: number, renglon: number) => clamp((x - frenteSecado(renglon)) / SUAVE + 0.5);

/**
 * Piscina vista desde arriba: agua con cáusticas, líneas del fondo, corcheras con boyas de
 * volumen y su sombra. Con `renglon` el agua se seca en papel y las corcheras quedan como
 * renglones: la disciplina del nadador pasa al archivo.
 */
export const Piscina: React.FC<Props> = ({ paleta, t, dx, renglon, carriles = 10, separacion = 92, y0 = 130 }) => {
  const agua = mezclar(paleta.fondo, paleta.ocre, 0.14);
  const fondoProfundo = mezclar(paleta.fondo, '#000000', 0.35);
  const boyas = useMemo(() => Array.from({ length: Math.ceil(ANCHO / BOYA) + 3 }, (_, k) => k), []);
  const frente = frenteSecado(renglon);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* agua: más clara al centro, donde pega la luz */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 70% at 50% 40%, ${agua} 0%, ${paleta.fondo} 75%, ${fondoProfundo} 100%)` }} />
      {/* líneas del fondo de la piscina (más hondas: se mueven más lento) */}
      <svg width={ANCHO} height={ALTO} style={{ position: 'absolute', filter: 'blur(2px)' }}>
        {Array.from({ length: carriles - 1 }, (_, i) => {
          const y = y0 + (i + 0.5) * separacion;
          const off = ((dx * 0.82) % 1400 + 1400) % 1400;
          return (
            <g key={i} opacity={0.5}>
              <rect x={0} y={y - 7} width={ANCHO} height={14} fill={fondoProfundo} />
              {[0, 1, 2].map((k) => <rect key={k} x={k * 1400 + off - 1400} y={y - 34} width={14} height={68} fill={fondoProfundo} />)}
            </g>
          );
        })}
      </svg>
      {/* cáusticas: dos capas de luz que se cruzan */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${textura.caustica})`, backgroundSize: '760px 760px',
        backgroundPosition: `${dx * 0.85 + t * 18}px ${t * 11}px`, mixBlendMode: 'screen', opacity: 0.11, filter: 'blur(1.5px)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${textura.caustica})`, backgroundSize: '1100px 1100px',
        backgroundPosition: `${dx * 0.85 - t * 14}px ${-t * 9}px`, mixBlendMode: 'screen', opacity: 0.07, filter: 'blur(3px)' }} />

      {/* el agua se seca de derecha a izquierda y queda papel */}
      {renglon > 0 ? (
        <div style={{ position: 'absolute', inset: 0,
          WebkitMaskImage: `linear-gradient(90deg, transparent ${frente - SUAVE / 2}px, #000 ${frente + SUAVE / 2}px)`,
          maskImage: `linear-gradient(90deg, transparent ${frente - SUAVE / 2}px, #000 ${frente + SUAVE / 2}px)` }}>
          <Papel color={paleta.papel} envejecido={0.3} />
        </div>
      ) : null}

      <svg width={ANCHO} height={ALTO} style={{ position: 'absolute' }}>
        <defs>
          <radialGradient id="piscina-boya-r" cx="35%" cy="30%" r="70%">
            <stop offset="0" stopColor={mezclar(paleta.rojo, paleta.papel, 0.55)} />
            <stop offset="0.5" stopColor={paleta.rojo} />
            <stop offset="1" stopColor={mezclar(paleta.rojo, '#000000', 0.45)} />
          </radialGradient>
          <radialGradient id="piscina-boya-p" cx="35%" cy="30%" r="70%">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.45" stopColor={paleta.papel} />
            <stop offset="1" stopColor={mezclar(paleta.papel, paleta.fondo, 0.45)} />
          </radialGradient>
          <filter id="piscina-sombra"><feGaussianBlur stdDeviation={4} /></filter>
          {/* la cuerda es clara sobre el agua y tinta sobre el papel */}
          <linearGradient id="piscina-cuerda" gradientUnits="userSpaceOnUse" x1={frente - SUAVE / 2} x2={frente + SUAVE / 2} y1={0} y2={0}>
            <stop offset="0" stopColor={paleta.papel} stopOpacity={0.25} />
            <stop offset="1" stopColor={paleta.fondo} stopOpacity={0.42} />
          </linearGradient>
        </defs>
        {Array.from({ length: carriles }, (_, i) => {
          const y = y0 + i * separacion;
          const vel = 1 + (i % 3) * 0.04; // las corcheras no están rígidas: se mecen distinto
          return (
            <g key={i}>
              {/* la cuerda; al final es el renglón del libro */}
              <line x1={0} x2={ANCHO} y1={y} y2={y} stroke="url(#piscina-cuerda)" strokeWidth={2} />
              {renglon < 1 ? (
                <>
                  <g filter="url(#piscina-sombra)" opacity={0.45}>
                    {boyas.map((k) => {
                      const x = ((((k * BOYA + dx * vel) % (BOYA * boyas.length)) + BOYA * boyas.length) % (BOYA * boyas.length)) - BOYA;
                      const e = 1 - cubierto(x, renglon);
                      return e > 0 ? <ellipse key={k} cx={x + 5} cy={y + 9} rx={11 * e} ry={8 * e} fill="#000" /> : null;
                    })}
                  </g>
                  {boyas.map((k) => {
                    const x = ((((k * BOYA + dx * vel) % (BOYA * boyas.length)) + BOYA * boyas.length) % (BOYA * boyas.length)) - BOYA;
                    const meneo = Math.sin(t * 2.2 + x * 0.018 + i) * 1.3;
                    const rojo = (k + i * 2) % 8 < 3;
                    const e = 1 - cubierto(x, renglon); // al llegar el papel, la boya se encoge hasta ser renglón
                    return e > 0 ? <circle key={k} cx={x} cy={y + meneo} r={10.5 * e} fill={`url(#piscina-boya-${rojo ? 'r' : 'p'})`} opacity={Math.min(1, e * 2)} /> : null;
                  })}
                </>
              ) : null}
            </g>
          );
        })}
      </svg>
      {/* reflejo de luz general sobre el agua */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${alfa(paleta.papel, 0.06 * (1 - renglon))} 0%, rgba(0,0,0,0) 40%)` }} />
    </div>
  );
};
