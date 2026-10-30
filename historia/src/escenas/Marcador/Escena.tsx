import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { tramo } from '../../direction/anim';
import type { EscenaProps } from '../../esquema';
import { alfa } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;

/** Tarjeta de «por definir»: se ve que falta algo, y qué. */
export const Marcador: React.FC<EscenaProps<P>> = ({ props, video }) => {
  const t = useCurrentFrame() / video.fps;
  const pal = video.paleta;
  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0b0a', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ opacity: tramo(t, 0.1, 0.6, 'natural'), border: `2px dashed ${alfa(pal.rojo, 0.8)}`, padding: '48px 80px', textAlign: 'center' }}>
        <div style={{ fontFamily: fuente.mono, fontSize: 26, letterSpacing: '0.4em', color: pal.rojo, marginBottom: 24 }}>POR DEFINIR</div>
        <div style={{ fontFamily: fuente.libro, fontSize: 72, color: pal.papel }}>{props.titulo}</div>
        {props.notas.map((n, i) => (
          <div key={i} style={{ fontFamily: fuente.mono, fontSize: 24, letterSpacing: '0.12em', color: alfa(pal.papel, 0.6), marginTop: i ? 10 : 30 }}>{n}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
