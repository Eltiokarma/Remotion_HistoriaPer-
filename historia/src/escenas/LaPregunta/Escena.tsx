import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Luz } from '../../components/atmosfera/Luz';
import { Papel } from '../../components/atmosfera/Papel';
import { Sfx } from '../../components/audio/Sfx';
import { Globo, proyectarGlobo } from '../../components/graficos/Globo';
import { TelevisorCRT } from '../../components/graficos/TelevisorCRT';
import { Ficha } from '../../components/texto/Ficha';
import { beat, clamp, mix, tramo } from '../../direction/anim';
import { azar, semillaDe } from '../../direction/azar';
import type { EscenaProps } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;
const CPS = 11;

/** Título a máquina: los signos de interrogación salen grandes y rojos. Corta la línea en los dos puntos. */
const TituloAMaquina: React.FC<{ texto: string; t: number; tinta: string; rojo: string }> = ({ texto, t, tinta, rojo }) => {
  if (t < 0) return null;
  const r = azar(semillaDe(texto));
  const tipos = texto.split('').map(() => ({ dy: r.rango(-1.6, 1.6), rot: r.rango(-1.8, 1.8), tinta: r.rango(0.75, 1) }));
  const n = Math.floor(t * CPS);
  const corte = texto.indexOf(': ¿');
  const lineas = corte > 0 ? [[0, corte + 1], [corte + 2, texto.length]] : [[0, texto.length]];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      {lineas.map(([a, z_], li) => (
        <div key={li} style={{ display: 'flex', alignItems: 'baseline', fontFamily: fuente.maquina, fontSize: 74, color: tinta, whiteSpace: 'pre', letterSpacing: '0.04em' }}>
          {texto.slice(a, z_).split('').map((ch, j) => {
            const i = a + j;
            if (i >= n) return null;
            const signo = ch === '¿' || ch === '?';
            const golpe = Math.min(1, (t * CPS - i) / 1.5);
            return (
              <span key={i} style={{ display: 'inline-block', color: signo ? rojo : tinta, fontSize: signo ? 180 : undefined, lineHeight: signo ? 0.8 : undefined,
                opacity: (signo ? 1 : tipos[i].tinta) * (0.55 + 0.45 * golpe), transform: `translateY(${tipos[i].dy + (signo ? 18 : 0)}px) rotate(${tipos[i].rot}deg) scale(${1.15 - 0.15 * golpe})` }}>{ch}</span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const LaPregunta: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const frame = useCurrentFrame();
  const fps = video.fps;
  const t = frame / fps;
  const pal = video.paleta;
  const b = escena.beats;
  const tTitulo = beat(b, 'titulo', 1), tTv = beat(b, 'tv', 9), tGlobo = beat(b, 'globo', 22);
  const tFichas = [beat(b, 'ficha1', 26), beat(b, 'ficha2', 29.5), beat(b, 'ficha3', 32)];
  const tPregunta = beat(b, 'pregunta', 36), tPruebas = beat(b, 'pruebas', 39);
  const noche = mezclar(pal.fondo, '#000000', 0.35);
  const fase = t < tTv ? 1 : t < tGlobo ? 2 : t < tPregunta - 0.2 ? 3 : 4;
  const lon = mix(props.giro[0], props.giro[1], tramo(t, tGlobo, tPregunta - tGlobo, 'natural'));
  const GL = { cx: 960, cy: 600, r: 400 };

  return (
    <AbsoluteFill style={{ backgroundColor: noche }}>
      {fase === 1 ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Luz color={pal.ocre} x={50} y={45} radio={60} intensidad={0.2} />
          <div style={{ width: 1500, height: 820, position: 'relative', boxShadow: `14px 20px 40px ${alfa('#000000', 0.55)}`, transform: `scale(${mix(0.98, 1.03, tramo(t, 0, tTv, 'natural'))})` }}>
            <Papel color={pal.papel} envejecido={0.22}>
              <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
                <TituloAMaquina texto={props.titulo} t={t - tTitulo} tinta={pal.fondo} rojo={pal.rojo} />
              </AbsoluteFill>
            </Papel>
          </div>
        </AbsoluteFill>
      ) : null}

      {fase === 2 ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Luz color="#9fb3c8" x={50} y={45} radio={55} intensidad={0.1 + 0.03 * Math.sin(t * 23)} />
          <div style={{ transform: `scale(${mix(0.92, 1.08, tramo(t, tTv, tGlobo - tTv, 'natural'))})`, marginTop: 40 }}>
            <TelevisorCRT paleta={pal} id={`${escena.id}-tv`} frame={frame} fps={fps} rec={props.tv.rec} fecha={props.tv.fecha} encendido={tramo(t, tTv + 0.2, 0.5, 'ligero')} width={1180} />
          </div>
        </AbsoluteFill>
      ) : null}

      {fase === 3 ? (
        <AbsoluteFill style={{ opacity: tramo(t, tGlobo, 1, 'natural') }}>
          <Globo paleta={pal} id={`${escena.id}-globo`} lon={lon} cx={GL.cx} cy={GL.cy} radio={GL.r}
            marcas={props.fichas.map((f, i) => ({ ...f.lugar, k: tramo(t, tFichas[i], 0.6, 'ligero') }))} />
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            {props.fichas.map((f, i) => {
              const p = proyectarGlobo(lon, 18, GL.cx, GL.cy, GL.r, f.lugar.lon, f.lugar.lat);
              const k = tramo(t, tFichas[i] + 0.3, 0.6, 'natural');
              if (!p || k <= 0) return null;
              const fx = i % 2 === 0 ? 300 : 1420, fy = 180 + i * 90;
              return <path key={i} d={`M${p[0]} ${p[1]} L${fx + (i % 2 === 0 ? 260 : -40)} ${fy + 50}`} stroke={alfa(pal.papel, 0.6)} strokeWidth={1.4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} fill="none" />;
            })}
          </svg>
          {props.fichas.map((f, i) => (
            <div key={i} style={{ position: 'absolute', top: 180 + i * 90, ...(i % 2 === 0 ? { left: 120 } : { right: 120 }) }}>
              <Ficha texto={f.texto} t={t - tFichas[i] - 0.4} color={pal.papel} acento={pal.rojo} size={30} />
            </div>
          ))}
        </AbsoluteFill>
      ) : null}

      {fase === 4 ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          {props.cierre.map((w, i) => {
            const k = tramo(t, i === 0 ? tPregunta : tPruebas, 0.7, 'natural');
            return (
              <div key={i} style={{ fontFamily: fuente.libro, fontStyle: 'italic', fontSize: 190, lineHeight: 1.05, color: i === 0 ? alfa(pal.papel, mix(1, 0.55, clamp((t - tPruebas) / 0.8))) : pal.papel,
                opacity: k, transform: `translateY(${(1 - k) * 22}px)` }}>{w}</div>
            );
          })}
        </AbsoluteFill>
      ) : null}

      {props.titulo.split('').map((ch, i) => (ch === ' ' ? null : <Sfx key={`k${i}`} nombre={ch === '¿' || ch === '?' ? 'golpe-tecla' : `tecla-${(i % 3) + 1}`} en={tTitulo + i / CPS} fps={fps} volumen={ch === '¿' || ch === '?' ? 0.6 : 0.35} />))}
      <Sfx nombre="crt" en={tTv + 0.15} fps={fps} volumen={0.6} />
      <Sfx nombre="estatica" en={tTv + 0.4} fps={fps} volumen={0.3} bucle dura={tGlobo - tTv - 0.4} />
      {props.fichas.map((f, i) => f.texto.split('').map((ch, j) => (ch === ' ' ? null : <Sfx key={`f${i}-${j}`} nombre={`tecla-${(j % 3) + 1}`} en={tFichas[i] + 0.4 + j / 18} fps={fps} volumen={0.25} />)))}
      <Sfx nombre="soplo" en={tGlobo} fps={fps} volumen={0.3} />
    </AbsoluteFill>
  );
};
