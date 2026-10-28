import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Luz } from '../../components/atmosfera/Luz';
import { Papel } from '../../components/atmosfera/Papel';
import { Sfx } from '../../components/audio/Sfx';
import { PilaDePaginas } from '../../components/graficos/PilaDePaginas';
import { LineaDeTiempo } from '../../components/graficos/LineaDeTiempo';
import { Ficha } from '../../components/texto/Ficha';
import { Renglones } from '../../components/texto/Renglones';
import { TrazoRojo } from '../../components/texto/TrazoRojo';
import { anticipa, beat, clamp, mix, tramo } from '../../direction/anim';
import type { EscenaProps } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;
const DUR_CORR = 9, TRAZOS = 9, CPS = 18;
/** Cuánto baja la cámara por la página: unas líneas, o hasta la segunda frase si la hay. */
const BAJA_CORTO = 130, BAJA_SEGUNDA = 560;

/** Un nombre compuesto («Sloan-Kettering») no se corta en el guion al final de la línea. */
const sinCortar = (s: string) =>
  s.split(/(\S+-\S+)/).map((p, i) => (i % 2 ? <span key={i} style={{ whiteSpace: 'nowrap' }}>{p}</span> : p));

/** La frase con su parte subrayada. */
const Cita: React.FC<{ texto: string; subrayado?: string; k: number; color: string; rojo: string }> = ({ texto, subrayado, k, color, rojo }) => {
  const i = subrayado ? texto.indexOf(subrayado) : -1;
  if (i < 0 || !subrayado) return <span style={{ color }}>{sinCortar(texto)}</span>;
  return (
    <span style={{ color }}>
      {sinCortar(texto.slice(0, i))}
      <TrazoRojo k={k} color={rojo} grosor={5}>{subrayado}</TrazoRojo>
      {sinCortar(texto.slice(i + subrayado.length))}
    </span>
  );
};

export const PruebasDeImprenta: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const frame = useCurrentFrame();
  const fps = video.fps;
  const t = frame / fps;
  const pal = video.paleta;
  const b = escena.beats;
  const tFicha = beat(b, 'ficha', 0.4), tCorr = beat(b, 'correcciones', 4), tCita = beat(b, 'cita', 14), tSub = beat(b, 'subrayado', 20);
  const tAbajo = beat(b, 'abajo', 24), tMuerte = beat(b, 'muerte', 30), tRecorre = beat(b, 'recorre', tMuerte + 2.4);
  const tMayo = beat(b, 'mayo', tRecorre + 3.6), tFinal = beat(b, 'final', tMayo + 2.4);
  const tHombre = beat(b, 'hombre', tFinal + 1.4), tEncontro = beat(b, 'encontro', tFinal + 2.6);
  const noche = mezclar(pal.fondo, '#000000', 0.35);

  // —— A: la pila sobre la mesa (hasta entrar a la página)
  const entra = tramo(t, 0, 1.4, 'natural');
  // cámara quieta mientras la pluma corrige: se mueve recién para entrar a la página
  const zambulle = anticipa(t, tCita - 0.5, 1.1, 'pesado', 0.035, 0.3); // la cámara toma aire y se mete en la hoja
  // —— C: la página del libro
  const pagina = tramo(t, tCita - 0.1, 0.9, 'natural');
  const zoomCita = mix(1, 1.08, tramo(t, tCita, tMuerte - tCita, 'natural'));
  const baja = tramo(t, tAbajo, 2.6, 'pesado');
  // con segunda frase, el foco pasa de la primera a ella mientras la cámara baja
  const foco = props.segunda ? tramo(t, tAbajo + 0.5, 2.2, 'natural') : 0;
  // —— D: de la muerte al libro, recorriendo los meses (no un salto: un camino)
  const linea = props.linea;
  const e0 = linea.eventos[0].en, eN = linea.eventos[linea.eventos.length - 1].en;
  const viaje = tramo(t, tRecorre, tMayo - tRecorre, 'solemne'); // la cámara arranca y frena despacio
  const abre = tramo(t, tFinal, 1.8, 'natural'); // al final se abre para ver el camino entero
  const recorrido = mix(e0, eN, viaje);
  const centro = mix(recorrido, (e0 + eN) / 2, abre);
  const ESCALA_VIAJE = 420, ESCALA_TODO = 1300 / Math.max(1, eN - e0);
  const escala = mix(ESCALA_VIAJE, ESCALA_TODO, abre);
  const guia = clamp(viaje * 10) * (1 - tramo(t, tMayo - 0.5, 0.5, 'natural'));
  // un pulso: sube rápido y se apaga despacio
  const pulso = (tb: number) => (t < tb ? 0 : Math.exp(-(t - tb) * 1.4) * clamp((t - tb) / 0.25));
  const realce = linea.eventos.map((e, k) =>
    k === 0 ? Math.max(pulso(tMuerte + 0.2), pulso(tHombre)) : k === linea.eventos.length - 1 ? clamp(pulso(tMayo) + 0.6 * tramo(t, tEncontro, 0.8, 'natural')) : 0,
  );
  // en qué momento la cámara cruza cada borde de tramo: ahí suena un tic (el tiempo pasa, se cuenta)
  const cruces: number[] = [];
  for (let k = Math.ceil(e0); k <= Math.floor(eN); k++) {
    if (k <= e0) continue;
    for (let tt = tRecorre; tt <= tMayo; tt += 1 / fps) {
      if (mix(e0, eN, tramo(tt, tRecorre, tMayo - tRecorre, 'solemne')) >= k) { cruces.push(tt); break; }
    }
  }

  const fase = t < tMuerte ? 'mesa' : 'linea';

  return (
    <AbsoluteFill style={{ backgroundColor: noche }}>
      {fase === 'mesa' ? (
        <>
          {/* A: pruebas de imprenta bajo la lámpara */}
          <AbsoluteFill style={{ opacity: entra * (1 - pagina) }}>
            <Luz color={pal.ocre} x={52} y={44} radio={62} intensidad={0.22} />
            <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center',
              transform: `scale(${mix(1, 2.6, zambulle)}) rotate(${mix(-1.5, 0, zambulle)}deg)`, transformOrigin: '54% 40%' }}>
              <div style={{ marginTop: 60 }}>
                <PilaDePaginas paleta={pal} id={`${escena.id}-pila`} width={620} variante="pruebas" semilla={2013}
                  correcciones={tramo(t, tCorr, DUR_CORR, 'natural')} />
              </div>
            </AbsoluteFill>
            <div style={{ position: 'absolute', left: 120, top: 96 }}>
              <Ficha texto={props.ficha} t={t - tFicha} color={pal.papel} acento={pal.rojo} size={28} cps={CPS} />
            </div>
          </AbsoluteFill>

          {/* C: la página del libro, con la frase compuesta */}
          {pagina > 0 ? (
            <AbsoluteFill style={{ opacity: pagina }}>
              <Papel color={pal.papel} envejecido={0.28}>
                <AbsoluteFill style={{ transform: `scale(${zoomCita * mix(1.12, 1, pagina)}) translateY(${-(props.segunda ? BAJA_SEGUNDA : BAJA_CORTO) * baja}px)`, transformOrigin: '50% 45%' }}>
                  <div style={{ position: 'absolute', left: 410, top: 96, width: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontFamily: fuente.libro, fontSize: 30, letterSpacing: '0.42em', marginRight: '-0.42em', color: alfa(pal.fondo, 0.7), fontVariant: 'small-caps' }}>
                      {props.seccion.toLowerCase()}
                    </div>
                    <div style={{ width: 80, height: 1, background: alfa(pal.fondo, 0.4), margin: '22px 0 46px' }} />
                    <Renglones ancho={1100} lineas={5} interlinea={52} alto={13} color={pal.fondo} opacidad={0.28} semilla={35} style={{ filter: 'blur(1.2px)' }} />
                    <div style={{ fontFamily: fuente.libro, fontSize: 62, lineHeight: 1.42, textAlign: 'center', margin: '34px 0 40px', maxWidth: 1080,
                      textWrap: 'balance', opacity: tramo(t, tCita + 0.4, 1.2, 'natural') * (1 - 0.45 * foco), filter: `blur(${2 * foco}px)` }}>
                      <Cita texto={props.cita.texto} subrayado={props.cita.subrayado} k={tramo(t, tSub, 1.1, 'natural')} color={pal.fondo} rojo={pal.rojo} />
                    </div>
                    {props.segunda ? (
                      <>
                        <Renglones ancho={1100} lineas={2} interlinea={52} alto={13} color={pal.fondo} opacidad={0.28} semilla={36} style={{ filter: 'blur(1.2px)' }} />
                        {/* impresa desde siempre, pero ilegible hasta que la cámara llega: la imagen no se adelanta a la voz */}
                        <div style={{ fontFamily: fuente.libro, fontSize: 54, lineHeight: 1.42, textAlign: 'center', margin: '30px 0 34px', maxWidth: 1040,
                          textWrap: 'balance', color: pal.fondo, opacity: mix(0.2, 1, foco), filter: `blur(${mix(7, 0, foco)}px)` }}>
                          {sinCortar(props.segunda.texto)}
                        </div>
                        <Renglones ancho={1100} lineas={4} interlinea={52} alto={13} color={pal.fondo} opacidad={0.28} semilla={37} style={{ filter: 'blur(1.2px)' }} />
                      </>
                    ) : (
                      <Renglones ancho={1100} lineas={9} interlinea={52} alto={13} color={pal.fondo} opacidad={0.28} semilla={36} style={{ filter: 'blur(1.2px)' }} />
                    )}
                  </div>
                  {/* «unas líneas más abajo»: una marca del autor al margen */}
                  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                    <path d={props.segunda ? 'M1546 1040 l 9 13 l 18 -30' : 'M1546 905 l 9 13 l 18 -30'} fill="none" stroke={pal.rojo} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"
                      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tramo(t, tAbajo + 1.6, 0.5, 'ligero')} opacity={0.85} />
                  </svg>
                </AbsoluteFill>
              </Papel>
            </AbsoluteFill>
          ) : null}
        </>
      ) : null}

      {/* D: corte seco a la línea de tiempo; la cámara la recorre de la muerte al libro */}
      {fase === 'linea' ? (
        <AbsoluteFill style={{ backgroundColor: mezclar(noche, pal.ocre, 0.05 * viaje) }}>
          <LineaDeTiempo paleta={pal} id={`${escena.id}-linea`} tramos={linea.tramos} fondo={linea.fondo} eventos={linea.eventos}
            centro={centro} escala={escala} recorrido={recorrido} aparece={tramo(t, tMuerte, 0.6, 'natural')} guia={guia} realce={realce} fondoVisible={1 - abre}
            tras={linea.eventos.map((_, k) => (k === linea.eventos.length - 1 ? t - tMayo : -1))} />
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 52%, rgba(0,0,0,0) 50%, ${alfa('#000000', 0.5)} 100%)` }} />
        </AbsoluteFill>
      ) : null}

      {/* sonido: papel, lápiz y máquina; en la línea, un tic por mes que pasa y la hoja del libro al llegar */}
      {props.ficha.split('').map((ch, i) => (ch === ' ' ? null : <Sfx key={`k${i}`} nombre={`tecla-${(i % 3) + 1}`} en={tFicha + i / CPS} fps={fps} volumen={0.32} />))}
      {Array.from({ length: TRAZOS }, (_, i) => <Sfx key={`p${i}`} nombre="lapiz" en={tCorr + (i * DUR_CORR) / TRAZOS} fps={fps} volumen={0.22} />)}
      <Sfx nombre="hoja" en={tCita - 0.4} fps={fps} volumen={0.5} />
      <Sfx nombre="lapiz" en={tSub} fps={fps} volumen={0.28} />
      {cruces.map((tc, k) => <Sfx key={`c${k}`} nombre="tic" en={tc} fps={fps} volumen={0.24} />)}
      <Sfx nombre="hoja" en={tMayo - 0.15} fps={fps} volumen={0.45} />
    </AbsoluteFill>
  );
};
