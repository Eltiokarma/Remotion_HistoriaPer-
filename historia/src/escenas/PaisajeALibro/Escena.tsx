import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Papel } from '../../components/atmosfera/Papel';
import { Sfx } from '../../components/audio/Sfx';
import { GrabadoGuanero } from '../../components/graficos/GrabadoGuanero';
import { LibroContable } from '../../components/graficos/LibroContable';
import { beat, tramo } from '../../direction/anim';
import { peso } from '../../direction/easings';
import type { EscenaProps } from '../../esquema';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;
const GIRO = 1.5;

export const PaisajeALibro: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const frame = useCurrentFrame();
  const fps = video.fps;
  const t = frame / fps;
  const pal = video.paleta;
  const b = escena.beats;
  const tLibro = beat(b, 'libro', 6), tCifra = beat(b, 'cifra', 8), tFlecha = beat(b, 'flecha', 13.8);
  const tFinCifra = Math.max(tCifra + 0.5, tFlecha - 0.6);

  // La cifra sube acelerando: crece más rápido de lo que debería.
  const valorEn = (s: number) => interpolate(s, [tCifra, tFinCifra], [props.cifra.desde, props.cifra.hasta], {
    easing: peso.tenso, extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const valor = valorEn(t);
  const velocidad = (valorEn(t + 1 / fps) - valor) * fps;
  const giro = tramo(t, tLibro, GIRO, 'pesado');
  const sombra = Math.sin(Math.PI * giro);

  // La cifra hace tic cada vez más seguido: suena a algo que se descontrola.
  const tics: number[] = [];
  for (let tc = tCifra, gap = 0.28; tc < tFinCifra; tc += gap, gap = Math.max(0.05, gap * 0.86)) tics.push(tc);

  return (
    <AbsoluteFill>
      <LibroContable paleta={pal} id={`${escena.id}-libro`} fps={fps} rotulo={props.rotulo} columnas={props.columnas} concepto={props.concepto}
        cifra={valor} velocidad={velocidad} unidad={props.cifra.unidad} alerta={t > tFinCifra ? 1 : 0}
        casillero={props.estado} flecha={tramo(t, tFlecha, 1.4, 'natural')} aparece={tramo(t, tLibro + 0.4, 1.2, 'natural')} />
      {/* sombra que la página proyecta sobre el libro mientras gira */}
      {giro > 0 && giro < 1 ? (
        <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(0,0,0,${0.5 * sombra}) 0%, rgba(0,0,0,0) ${30 + 60 * (1 - giro)}%)` }} />
      ) : null}
      {/* la página del grabado, que se da vuelta desde el lomo izquierdo */}
      {giro < 1 ? (
        <AbsoluteFill style={{ perspective: 2600 }}>
          <AbsoluteFill style={{ transformOrigin: '0% 50%', transform: `rotateY(${-180 * giro}deg)`, backfaceVisibility: 'hidden' }}>
            <Papel color={pal.papel} envejecido={0.45}>
              <GrabadoGuanero paleta={pal} t={t} guano={tramo(t, 0.4, 3.2, 'pesado')} id={`${escena.id}-grabado`} />
            </Papel>
            <AbsoluteFill style={{ background: `linear-gradient(270deg, rgba(0,0,0,${0.55 * sombra}) 0%, rgba(0,0,0,${0.15 * sombra}) 60%)` }} />
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      <Sfx nombre="hoja" en={tLibro} fps={fps} volumen={0.75} />
      <Sfx nombre="hoja" en={tLibro + 0.5} fps={fps} volumen={0.4} />
      {tics.map((tc, i) => <Sfx key={i} nombre="tic" en={tc} fps={fps} volumen={0.25} />)}
      <Sfx nombre="pluma" en={tFlecha} fps={fps} volumen={0.22} />
    </AbsoluteFill>
  );
};
