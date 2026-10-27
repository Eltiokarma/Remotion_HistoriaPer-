import { geoNaturalEarth1 } from 'd3-geo';
import { useMemo } from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Luz } from '../../components/atmosfera/Luz';
import { Papel } from '../../components/atmosfera/Papel';
import { Sfx } from '../../components/audio/Sfx';
import { Aula } from '../../components/graficos/Aula';
import { Balanza } from '../../components/graficos/Balanza';
import { Brujula } from '../../components/graficos/Brujula';
import { Dispersion } from '../../components/graficos/Dispersion';
import { Estante } from '../../components/graficos/Estante';
import { Mapa } from '../../components/graficos/Mapa';
import { Ficha } from '../../components/texto/Ficha';
import { beat, clamp, mix, tramo } from '../../direction/anim';
import type { EscenaProps } from '../../esquema';
import { mezclar } from '../../estilo/color';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;

export const AprenderAMedir: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const frame = useCurrentFrame();
  const fps = video.fps;
  const t = frame / fps;
  const pal = video.paleta;
  const b = escena.beats;
  const T = (n: string, d: number) => beat(b, n, d);
  const tMapa = T('mapa', 0.2), tParis = T('paris', 6), tDuda = T('duda', 7.5), tNY = T('nuevayork', 9), tFicha = T('ficha', 11);
  const tPuntos = T('puntos', 16), tRecta = T('recta', 20), tDiscursos = T('discursos', 25), tBalanza = T('balanza', 26);
  const tProf = T('profundidad', 29), tClar = T('claridad', 31.5), tEstante = T('estante', 33), tTemas = T('temas', 37);
  const tAulas = T('aulas', 40.5), tBrujula = T('brujula', 48.5), tGiro = T('giro', 51);
  const noche = mezclar(pal.fondo, '#000000', 0.3);

  // —— el mapa: la ruta a la tentación llega a medias, duda, se borra; la otra llega
  const hacia = tramo(t, tParis, tDuda - tParis, 'natural') * 0.62;
  const duda = t > tDuda && t < tDuda + 0.7 ? 0.015 * Math.sin((t - tDuda) * 18) : 0;
  const borra = tramo(t, tDuda + 0.7, 0.9, 'natural');
  const kTentacion = Math.max(0, (hacia + duda) * (1 - borra));
  const kDestino = tramo(t, tNY, 1.5, 'pesado');
  const llegaDestino = t < tNY + 1.5 ? 0 : spring({ frame: frame - (tNY + 1.5) * fps, fps, config: { damping: 9, mass: 0.6, stiffness: 150 } }) * 1.0;
  const ny = useMemo(() => {
    const [o, s, e, n] = props.encuadre;
    const pr = geoNaturalEarth1().fitExtent([[40, 60], [1880, 1040]], { type: 'MultiPoint', coordinates: [[o, s], [e, n], [o, n], [e, s]] });
    return pr([props.destino.lon, props.destino.lat]) ?? [960, 540];
  }, [props.encuadre, props.destino]);
  const acerca = tramo(t, tFicha - 0.6, 2.4, 'pesado');

  // —— la balanza: se inclina con la primera palabra y se equilibra con la segunda (con vaivén)
  const cae1 = tramo(t, tProf, 0.6, 'tenso'), cae2 = tramo(t, tClar, 0.6, 'tenso');
  const vaiven = (t0: number) => (t < t0 ? 0 : Math.exp(-(t - t0) * 2.2) * Math.sin((t - t0) * 7));
  const angulo = (cae1 >= 1 ? -12 : 0) * (cae2 >= 1 ? 0 : 1) + 5 * vaiven(tProf + 0.6) + 4 * vaiven(tClar + 0.6);

  // —— la brújula: gira despacio de una época a la otra y se asienta con un vaivén
  const giro = tramo(t, tGiro, 4.5, 'solemne');
  const anguloAguja = 180 * giro + (giro >= 1 ? 6 * Math.exp(-(t - tGiro - 4.5) * 1.8) * Math.sin((t - tGiro - 4.5) * 6) : 0);

  const fase = t < tPuntos ? 1 : t < tBalanza ? 2 : t < tEstante ? 3 : t < tAulas ? 4 : t < tBrujula ? 5 : 6;
  const entra = (t0: number) => tramo(t, t0 - 0.2, 0.8, 'natural');

  return (
    <AbsoluteFill style={{ backgroundColor: noche }}>
      {fase === 1 ? (
        <AbsoluteFill style={{ opacity: tramo(t, tMapa, 1, 'natural') }}>
          <AbsoluteFill style={{ transformOrigin: `${ny[0]}px ${ny[1]}px`, transform: `scale(${mix(1, 1.9, acerca)})` }}>
            <Luz color={pal.ocre} x={40} y={40} radio={70} intensidad={0.08} />
            <Mapa paleta={pal} id={`${escena.id}-mapa`} origen={props.origen} destinos={[props.tentacion, props.destino]} encuadre={props.encuadre}
              rutas={[kTentacion, kDestino]} llegadas={[t > tParis ? mix(0.5, 0.18, borra) : 0, llegaDestino]} />
          </AbsoluteFill>
          <div style={{ position: 'absolute', left: 120, top: 90 }}>
            <Ficha texto={props.ficha} t={t - tFicha - 0.6} color={pal.papel} acento={pal.rojo} size={30} />
          </div>
        </AbsoluteFill>
      ) : null}

      {fase === 2 ? (
        <Papel color={pal.papel} envejecido={0.25}>
          <Dispersion paleta={pal} id={`${escena.id}-disp`} t={t - tPuntos} tRecta={tRecta - tPuntos} apagaDiscursos={tramo(t, tDiscursos, 1.2, 'natural')}
            aparece={entra(tPuntos)} />
        </Papel>
      ) : null}

      {fase === 3 ? (
        <AbsoluteFill style={{ opacity: entra(tBalanza) }}>
          <Luz color={pal.ocre} x={50} y={35} radio={60} intensidad={0.2} />
          <Balanza paleta={pal} id={`${escena.id}-bal`} angulo={angulo} izquierda={props.balanza[0]} derecha={props.balanza[1]} cae={[cae1, cae2]} />
        </AbsoluteFill>
      ) : null}

      {fase === 4 ? (
        <AbsoluteFill style={{ opacity: entra(tEstante) }}>
          <Luz color={pal.ocre} x={50} y={50} radio={60} intensidad={0.2} />
          <Estante paleta={pal} id={`${escena.id}-est`} titulos={props.temas} aparece={entra(tEstante)}
            entra={props.temas.map((_, i) => (t < tTemas + i * 0.55 ? 0 : spring({ frame: frame - (tTemas + i * 0.55) * fps, fps, config: { damping: 14, mass: 0.9, stiffness: 140 } })))} />
        </AbsoluteFill>
      ) : null}

      {fase === 5 ? (
        <AbsoluteFill style={{ opacity: entra(tAulas) }}>
          <Luz color={pal.ocre} x={50} y={90} radio={70} intensidad={0.18} />
          <Aula paleta={pal} id={`${escena.id}-aula`} llenado={tramo(t, tAulas + 1, tBrujula - tAulas - 2, 'natural')} />
          {props.ficha_aulas ? (
            <div style={{ position: 'absolute', left: 120, top: 90 }}>
              <Ficha texto={props.ficha_aulas} t={t - tAulas - 0.4} color={pal.papel} acento={pal.rojo} size={30} />
            </div>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {fase === 6 ? (
        <AbsoluteFill style={{ opacity: entra(tBrujula) }}>
          <Luz color={pal.ocre} x={50} y={45} radio={55} intensidad={0.22} />
          <Brujula paleta={pal} id={`${escena.id}-bru`} angulo={anguloAguja} radio={290}
            polos={[{ texto: props.brujula[0], angulo: 0 }, { texto: props.brujula[1], angulo: 180 }]} />
        </AbsoluteFill>
      ) : null}

      {/* sonido */}
      <Sfx nombre="soplo" en={tParis} fps={fps} volumen={0.3} />
      <Sfx nombre="borrar" en={tDuda + 0.7} fps={fps} volumen={0.5} />
      <Sfx nombre="soplo" en={tNY} fps={fps} volumen={0.35} />
      <Sfx nombre="campana" en={tNY + 1.5} fps={fps} volumen={0.3} />
      {props.ficha.split('').map((ch, i) => (ch === ' ' ? null : <Sfx key={`k${i}`} nombre={`tecla-${(i % 3) + 1}`} en={tFicha + 0.6 + i / 18} fps={fps} volumen={0.3} />))}
      {Array.from({ length: 12 }, (_, i) => <Sfx key={`p${i}`} nombre="tic" en={tPuntos + i * 0.25} fps={fps} volumen={0.25} />)}
      <Sfx nombre="lapiz" en={tRecta} fps={fps} volumen={0.5} />
      <Sfx nombre="metal" en={tProf + 0.6} fps={fps} volumen={0.55} />
      <Sfx nombre="metal" en={tClar + 0.6} fps={fps} volumen={0.45} />
      {props.temas.map((_, i) => <Sfx key={`l${i}`} nombre="carpeta" en={tTemas + i * 0.55 + 0.35} fps={fps} volumen={0.4} />)}
      {props.ficha_aulas ? props.ficha_aulas.split('').map((ch, i) => (ch === ' ' ? null : <Sfx key={`a${i}`} nombre={`tecla-${(i % 3) + 1}`} en={tAulas + 0.4 + i / 18} fps={fps} volumen={0.3} />)) : null}
      {Array.from({ length: 9 }, (_, i) => <Sfx key={`g${i}`} nombre="tic" en={tGiro + i * 0.5} fps={fps} volumen={0.2 + clamp(i / 9) * 0.1} />)}
    </AbsoluteFill>
  );
};
