import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Luz } from '../../components/atmosfera/Luz';
import { Sfx } from '../../components/audio/Sfx';
import { BarraUnidades } from '../../components/graficos/BarraUnidades';
import { GraficoNiveles } from '../../components/graficos/GraficoNiveles';
import { SiluetaPais } from '../../components/graficos/SiluetaPais';
import { beat, clamp, tramo } from '../../direction/anim';
import type { EscenaProps } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;
const PERIODO_PIB = 1.15; // una franja por "año"

export const LaCuenta: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const frame = useCurrentFrame();
  const fps = video.fps;
  const t = frame / fps;
  const pal = video.paleta;
  const b = escena.beats;
  const T = (n: string, d: number) => beat(b, n, d);
  const tDecadas = T('decadas', 5), tBarra = T('barra', 13), tRojo = T('rojo', 20), tCae = T('cae', 23), tPib = T('pib', 25);
  const tNiveles = T('niveles', 30), tBaja = T('baja', 38), tSilueta = T('silueta', 43), tMitad = T('mitad', 47.5), tNota = T('nota', 50.8);
  const noche = mezclar(pal.fondo, '#000000', 0.3);
  const fase = t < tBarra ? 1 : t < tNiveles ? 2 : t < tSilueta ? 3 : 4;
  const [r0, r1] = props.regla;
  const decadas = Math.floor((r1 - r0) / 10) + 1;
  const marcadas = Math.floor(tramo(t, tDecadas, 4, 'natural') * decadas);
  // la producción: barra larga; cada "año" se le va una franja del 3–4 %
  const PX0 = 260, PX1 = 1660, PY = 760;
  const anchoFranja = ((props.pib.min + props.pib.max) / 2 / 100) * (PX1 - PX0);
  const ciclo = t >= tPib + 1 ? ((t - tPib - 1) % PERIODO_PIB) / PERIODO_PIB : -1;

  return (
    <AbsoluteFill style={{ backgroundColor: noche }}>
      <Luz color={pal.ocre} x={50} y={45} radio={65} intensidad={0.14} />

      {fase === 1 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: tramo(t, 0, 1, 'natural') }}>
          {/* regla de décadas: cada una se marca, una tras otra */}
          <line x1={200} x2={1720} y1={560} y2={560} stroke={alfa(pal.papel, 0.6)} strokeWidth={2} />
          {Array.from({ length: decadas }, (_, i) => {
            const x = 200 + (i / (decadas - 1)) * 1520;
            const anio = r0 + i * 10;
            const hecha = i < marcadas;
            return (
              <g key={i}>
                <line x1={x} x2={x} y1={anio % 50 === 0 ? 530 : 546} y2={560} stroke={alfa(pal.papel, 0.7)} strokeWidth={anio % 50 === 0 ? 2 : 1} />
                {anio % 50 === 0 ? <text x={x} y={612} textAnchor="middle" fill={alfa(pal.papel, 0.75)} fontFamily={fuente.mono} fontSize={26}>{anio}</text> : null}
                {/* marca de «calculada»: todas iguales, no es un dato por década */}
                {hecha ? <path d={`M${x - 9} 514 l 6 9 l 13 -20`} fill="none" stroke={pal.rojo} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /> : null}
              </g>
            );
          })}
        </svg>
      ) : null}

      {fase === 2 ? (
        <AbsoluteFill>
          <BarraUnidades paleta={pal} id={`${escena.id}-gasto`} rotulo={props.gasto.rotulo} rango={[props.gasto.min, props.gasto.max]} y={230}
            aparece={tramo(t, tBarra, 1.6, 'natural')} tinte={tramo(t, tRojo, 0.9, 'natural') + tramo(t, tRojo + 1.0, 0.7, 'natural')} cae={t - tCae} />
          {t >= tPib ? (
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: tramo(t, tPib, 0.8, 'natural') }}>
              <text x={PX0} y={PY - 30} fill={alfa(pal.papel, 0.8)} fontFamily={fuente.mono} fontSize={26} letterSpacing={5}>{props.pib.rotulo}</text>
              <rect x={PX0} y={PY} width={PX1 - PX0 - anchoFranja} height={54} fill={mezclar(pal.fondo, pal.ocre, 0.55)} />
              <rect x={PX1 - anchoFranja} y={PY} width={anchoFranja} height={54} fill={pal.rojo} />
              {ciclo >= 0 ? (
                <rect x={PX1 - anchoFranja} y={PY + 0.5 * 2200 * (ciclo * PERIODO_PIB) ** 2} width={anchoFranja} height={54} fill={pal.rojo}
                  opacity={clamp(1 - ciclo * 1.2)} transform={`rotate(${ciclo * 40} ${PX1} ${PY})`} />
              ) : null}
              <text x={PX1} y={PY + 100} textAnchor="end" fill={pal.rojo} fontFamily={fuente.mono} fontWeight={600} fontSize={34} letterSpacing={2}>
                {`${props.pib.min}–${props.pib.max} % · cada año`}
              </text>
            </svg>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {fase === 3 ? (
        <GraficoNiveles paleta={pal} id={`${escena.id}-niv`} desde={props.desde} hasta={props.hasta} periodos={props.periodos}
          aparece={tramo(t, tNiveles, 0.8, 'natural')} linea={tramo(t, tNiveles + 0.6, 5, 'natural')} parpadeo={clamp((t - tBaja) / 0.8)} />
      ) : null}

      {fase === 4 ? (
        <AbsoluteFill>
          <SiluetaPais paleta={pal} id={`${escena.id}-pais`} codigo={props.pais} caja={[460, 60, 1000, 800]}
            real={tramo(t, tSilueta, 1, 'natural')} fantasma={tramo(t, tMitad, 1.6, 'solemne')} />
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 150 }}>
            <div style={{ fontFamily: fuente.libro, fontStyle: 'italic', fontSize: 64, color: pal.papel, opacity: tramo(t, tMitad + 0.6, 1, 'natural') }}>{props.crecimiento}</div>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      {/* nota al pie: honestidad que protege */}
      <div style={{ position: 'absolute', left: 120, bottom: 54, fontFamily: fuente.mono, fontSize: 22, letterSpacing: '0.12em', color: alfa(pal.papel, 0.65),
        opacity: tramo(t, tNota, 1, 'natural') }}>{props.nota}</div>

      {Array.from({ length: 12 }, (_, i) => <Sfx key={`d${i}`} nombre="tic" en={tDecadas + (i * 4) / 12} fps={fps} volumen={0.25} />)}
      <Sfx nombre="soplo" en={tBarra} fps={fps} volumen={0.25} />
      <Sfx nombre="lapiz" en={tRojo} fps={fps} volumen={0.28} />
      <Sfx nombre="monedas" en={tCae + 0.2} fps={fps} volumen={0.55} />
      {Array.from({ length: Math.max(0, Math.floor((tNiveles - tPib - 1) / PERIODO_PIB)) }, (_, i) => <Sfx key={`p${i}`} nombre="tic" en={tPib + 1 + i * PERIODO_PIB} fps={fps} volumen={0.3} />)}
      <Sfx nombre="lapiz" en={tNiveles + 0.6} fps={fps} volumen={0.28} />
      <Sfx nombre="campana" en={tBaja} fps={fps} volumen={0.25} />
      <Sfx nombre="soplo" en={tMitad} fps={fps} volumen={0.3} />
    </AbsoluteFill>
  );
};
