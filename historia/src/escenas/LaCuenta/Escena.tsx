import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Luz } from '../../components/atmosfera/Luz';
import { Sfx } from '../../components/audio/Sfx';
import { BarraUnidades } from '../../components/graficos/BarraUnidades';
import { GraficoNiveles } from '../../components/graficos/GraficoNiveles';
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
  const tNiveles = T('niveles', 30), tBaja = T('baja', 38), tCrecer = T('crecer', 45), tCorrup = T('corrupcion', 52.5), tMitad = T('mitad', 61);
  const tNota = T('nota', 67), tPatron = T('patron', 75);
  const noche = mezclar(pal.fondo, '#000000', 0.3);
  const fase = t < tBarra ? 1 : t < tNiveles ? 2 : t < tCrecer ? 3 : t < tPatron ? 4 : 5;
  const [r0, r1] = props.regla;
  const decadas = Math.floor((r1 - r0) / 10) + 1;
  const marcadas = Math.floor(tramo(t, tDecadas, 4, 'natural') * decadas);
  // la producción: barra larga; cada "año" se le va una franja del 3–4 %
  const PX0 = 260, PX1 = 1660, PY = 760;
  const anchoFranja = ((props.pib.min + props.pib.max) / 2 / 100) * (PX1 - PX0);
  const ciclo = t >= tPib + 1 ? ((t - tPib - 1) % PERIODO_PIB) / PERIODO_PIB : -1;
  // la cuenta: dos barras en la misma escala (de 0 al máximo de lo que hace falta para crecer)
  const { crecer, corrupcion } = props.cuenta;
  const CX0 = 300, CW = 1200, U = CW / crecer.max;
  const niveles = (linea: number, parp: number, minimo: number, aparece: number) => (
    <GraficoNiveles paleta={pal} id={`${escena.id}-niv`} serie={props.niveles.serie} umbrales={props.niveles.umbrales} eje={props.niveles.eje}
      aparece={aparece} linea={linea} parpadeo={parp} minimo={minimo} />
  );

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

      {fase === 3
        ? niveles(tramo(t, tNiveles + 0.6, 5, 'natural'), clamp((t - tBaja) / 0.8), tramo(t, tBaja + 0.3, 0.8, 'natural'), tramo(t, tNiveles, 0.8, 'natural'))
        : null}

      {fase === 4 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id={`${escena.id}-raya-o`} width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width={10} height={10} fill={mezclar(pal.fondo, pal.ocre, 0.3)} />
              <line x1={0} y1={0} x2={0} y2={10} stroke={mezclar(pal.fondo, pal.ocre, 0.7)} strokeWidth={4} />
            </pattern>
            <pattern id={`${escena.id}-raya-r`} width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width={10} height={10} fill={mezclar(pal.rojo, pal.fondo, 0.55)} />
              <line x1={0} y1={0} x2={0} y2={10} stroke={pal.rojo} strokeWidth={4} />
            </pattern>
          </defs>
          {[
            { r: crecer, y: 330, k: tramo(t, tCrecer, 1.4, 'natural'), solido: mezclar(pal.fondo, pal.ocre, 0.55), raya: `url(#${escena.id}-raya-o)`, tinta: alfa(pal.papel, 0.9) },
            { r: corrupcion, y: 530, k: tramo(t, tCorrup, 1.2, 'natural'), solido: pal.rojo, raya: `url(#${escena.id}-raya-r)`, tinta: pal.rojo },
          ].map(({ r, y, k, solido, raya, tinta }) => (
            <g key={y} opacity={clamp(k * 3)}>
              <text x={CX0} y={y - 26} fill={alfa(pal.papel, 0.8)} fontFamily={fuente.mono} fontSize={26} letterSpacing={5}>{r.rotulo}</text>
              {/* sólido hasta el mínimo, rayado hasta el máximo: es un rango */}
              <rect x={CX0} y={y} width={Math.min(k * r.max, r.min) * U} height={72} fill={solido} />
              <rect x={CX0 + r.min * U} y={y} width={Math.max(0, k * r.max - r.min) * U} height={72} fill={raya} />
              <text x={CX0 + r.max * U + 24} y={y + 50} fill={tinta} fontFamily={fuente.mono} fontWeight={600} fontSize={34} letterSpacing={2}
                opacity={clamp(k * 2 - 1)}>{`${r.min}–${r.max} % del PBI`}</text>
            </g>
          ))}
          {/* la escala común, de 0 al máximo */}
          <g opacity={tramo(t, tCrecer, 1, 'natural')}>
            <line x1={CX0} x2={CX0 + CW} y1={650} y2={650} stroke={alfa(pal.papel, 0.45)} />
            {Array.from({ length: crecer.max + 1 }, (_, i) => (
              <g key={i}>
                <line x1={CX0 + i * U} x2={CX0 + i * U} y1={650} y2={i % 2 ? 658 : 664} stroke={alfa(pal.papel, 0.5)} />
                {i % 2 ? null : <text x={CX0 + i * U} y={694} textAnchor="middle" fill={alfa(pal.papel, 0.6)} fontFamily={fuente.mono} fontSize={22}>{`${i} %`}</text>}
              </g>
            ))}
          </g>
          {/* hasta dónde llega la corrupción sobre lo que hacía falta */}
          <g opacity={tramo(t, tMitad - 0.4, 0.8, 'natural')}>
            {[corrupcion.min, corrupcion.max].map((v) => (
              <line key={v} x1={CX0 + v * U} x2={CX0 + v * U} y1={318} y2={612} stroke={alfa(pal.papel, 0.55)} strokeWidth={2} strokeDasharray="5 6" />
            ))}
          </g>
          <text x={960} y={830} textAnchor="middle" fill={pal.papel} fontFamily={fuente.libro} fontStyle="italic" fontSize={64}
            opacity={tramo(t, tMitad + 0.3, 1, 'natural')}>{props.cuenta.conclusion}</text>
        </svg>
      ) : null}

      {/* al final vuelve la línea entera: el patrón que no se rompe */}
      {fase === 5 ? niveles(1, 0, 1, tramo(t, tPatron, 0.9, 'natural')) : null}

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
      <Sfx nombre="soplo" en={tCrecer} fps={fps} volumen={0.22} />
      <Sfx nombre="lapiz" en={tCorrup} fps={fps} volumen={0.28} />
      <Sfx nombre="soplo" en={tMitad} fps={fps} volumen={0.3} />
    </AbsoluteFill>
  );
};
