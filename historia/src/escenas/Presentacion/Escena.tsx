import { AbsoluteFill, interpolateColors, spring, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Papel } from '../../components/atmosfera/Papel';
import { Sfx } from '../../components/audio/Sfx';
import { cubierto, Piscina } from '../../components/graficos/Piscina';
import { Sello } from '../../components/graficos/Sello';
import { Ornamento } from '../../components/texto/Ornamento';
import { beat, clamp, mix, tramo } from '../../direction/anim';
import type { EscenaProps } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;
const V = 620, FRENO = 1.6; // velocidad de la cámara sobre el agua (px/s) y segundos de frenado

export const Presentacion: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const frame = useCurrentFrame();
  const fps = video.fps;
  const t = frame / fps;
  const pal = video.paleta;
  const b = escena.beats;
  const piscina = props.fondo === 'piscina';
  const tNombre = beat(b, 'nombre', 1), tFrenar = beat(b, 'frenar', 4), tRenglon = beat(b, 'renglon', 5), tSello = beat(b, 'sello', 10);

  // Frenado parejo que arranca a la velocidad que traía (sin tirón): x = v·F/2·(1-(1-u)²).
  const u = clamp((t - tFrenar) / FRENO);
  const dx = -(V * Math.min(t, tFrenar) + V * (FRENO / 2) * (1 - (1 - u) ** 2));
  const renglon = piscina ? tramo(t, tRenglon, 1.4, 'solemne') : 1;
  // La tinta de cada letra cambia cuando el papel pasa por debajo de ella.
  const tintaEn = (x: number) => interpolateColors(piscina ? cubierto(x, renglon) : 1, [0, 1], [pal.papel, pal.fondo]);
  const tinta = tintaEn(960);
  const ANCHO_NOMBRE = props.nombre.length * 62; // aproximado, para ubicar cada letra
  const margen = piscina ? tramo(t, tRenglon + 0.8, 0.9, 'pesado') : 1;

  const golpe = spring({ frame: frame - tSello * fps, fps, config: { damping: 14, mass: 1.4, stiffness: 200 } });
  const escalaSello = t < tSello ? 0 : mix(1.7, 1, golpe);
  const temblor = t > tSello + 0.1 && t < tSello + 0.28 ? Math.sin(frame * 3.1) * 2.5 : 0;

  return (
    <AbsoluteFill style={{ transform: `translateY(${temblor}px)` }}>
      {piscina ? <Piscina paleta={pal} t={t} dx={dx} renglon={renglon} /> : <Papel color={pal.papel} envejecido={0.3} />}
      {/* margen rojo doble del libro contable */}
      <svg width={1920} height={1080} style={{ position: 'absolute' }}>
        <line x1={250} x2={250} y1={0} y2={1080 * margen} stroke={pal.rojo} strokeWidth={2.5} opacity={0.75} />
        <line x1={258} x2={258} y1={0} y2={1080 * margen} stroke={pal.rojo} strokeWidth={1.2} opacity={0.6} />
      </svg>

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 40 }}>
        <div style={{ fontFamily: fuente.titulo, fontWeight: 700, fontSize: 118, letterSpacing: '0.02em', display: 'flex' }}>
          {props.nombre.split('').map((ch, i) => {
            // cada letra se asienta con 2 frames de desfase: nada se detiene a la vez
            const k = tramo(t, tNombre + (i * 2) / fps, 0.9, 'solemne');
            const x = 960 + (i / Math.max(1, props.nombre.length - 1) - 0.5) * ANCHO_NOMBRE;
            const agua = piscina ? 1 - cubierto(x, renglon) : 0;
            return (
              <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre', opacity: k, transform: `translateY(${(1 - k) * 46}px)`, color: tintaEn(x),
                textShadow: agua > 0 ? `0 0 28px ${alfa(pal.fondo, 0.9 * agua)}, 0 2px 4px ${alfa(pal.fondo, 0.6 * agua)}` : 'none' }}>{ch}</span>
            );
          })}
        </div>
        {props.anios ? (
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <Ornamento color={tinta} ancho={560} k={tramo(t, tNombre + 1.2, 1.0, 'natural')} opacidad={0.8} />
            <div style={{ fontFamily: fuente.imprenta, fontSize: 50, letterSpacing: '0.32em', marginRight: '-0.32em', color: tinta,
              opacity: 0.85 * tramo(t, tNombre + 1.6, 0.8, 'natural') }}>
              {props.anios}
            </div>
          </div>
        ) : null}
      </AbsoluteFill>

      {props.sello ? (
        <>
          <div style={{ position: 'absolute', left: 1330, top: 640, transform: `rotate(-12deg) scale(${escalaSello})`, opacity: clamp(escalaSello * 3) }}>
            <Sello paleta={pal} id={`${escena.id}-sello`} centro={props.sello.centro} fecha={props.sello.fecha} arco={props.sello.arco} size={340}
              color={mezclar(pal.rojo, pal.fondo, 0.1)} />
          </div>
          {/* el golpe suena cuando el sello toca el papel, no cuando empieza a caer */}
          <Sfx nombre="sello" en={tSello + 0.1} fps={fps} volumen={0.9} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};
