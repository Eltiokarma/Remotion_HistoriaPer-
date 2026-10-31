import { getLength, getPointAtLength } from '@remotion/paths';
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
import { Mapa, arco, proyeccionDe } from '../../components/graficos/Mapa';
import { Ficha } from '../../components/texto/Ficha';
import { Pizarra } from '../../components/atmosfera/Pizarra';
import { TextoTiza } from '../../components/texto/Tiza';
import { Odometro } from '../../components/texto/Odometro';
import { anticipa, asienta, beat, clamp, estiraCon, impacto, mix, tramo, velocidad } from '../../direction/anim';
import type { EscenaProps } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;
/** Zoom de la cámara mientras sigue la ruta, y cuánto mira por delante de la punta (aire en la dirección del viaje). */
const ZOOM_VIAJE = 2.1, MIRA_ADELANTE = 0.07;
/** Paralelos que se encienden al cruzarlos (el viaje pasa del sur al norte). */
const PARALELOS = [{ lat: 0, rotulo: 'ECUADOR · 0°' }, { lat: 15, rotulo: '15° N' }, { lat: 30, rotulo: '30° N' }];

export const AprenderAMedir: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const frame = useCurrentFrame();
  const fps = video.fps;
  const t = frame / fps;
  const pal = video.paleta;
  const b = escena.beats;
  const T = (n: string, d: number) => beat(b, n, d);
  const tMapa = T('mapa', 0.2), tParis = T('paris', 6), tDuda = T('duda', 7.5), tSale = T('sale', 9), tLlega = T('llega', tSale + 3.5);
  const tAbre = T('abre', tLlega + 0.7), tFicha = T('ficha', tAbre + 1.8);
  const tPuntos = T('puntos', 16), tRecta = T('recta', 20), tDiscursos = T('discursos', 25), tBalanza = T('balanza', 26);
  const tProf = T('profundidad', 29), tClar = T('claridad', 31.5), tEstante = T('estante', 33), tTemas = T('temas', 37);
  const tBrujula = T('brujula', 48.5), tGiro = T('giro', 51);
  const tAulas = props.aula ? T('aulas', 40.5) : tBrujula; // sin aula, el estante sigue hasta la brújula
  const explica = props.explicar_regresion;
  const tCaen = explica ? T('caen', tPuntos + 2) : tPuntos, tPendiente = explica ? T('pendiente', tRecta + 3) : undefined;
  const noche = mezclar(pal.fondo, '#000000', 0.3);

  // —— el mapa: la ruta a la tentación llega a medias, duda, se borra
  const hacia = tramo(t, tParis, tDuda - tParis, 'natural') * 0.62;
  const duda = 0.015 * asienta(t, tDuda, 1, 18, 4) * (t < tDuda + 0.6 ? 1 : 0);
  const borra = tramo(t, tDuda + 0.6, 0.6, 'natural');
  const kTentacion = Math.max(0, (hacia + duda) * (1 - borra));

  // —— el viaje a Nueva York: la cámara lo hace con él (CLAUDE.md §4, «El movimiento guía»)
  const ruta = useMemo(() => {
    const pr = proyeccionDe(props.encuadre);
    const a = pr([props.origen.lon, props.origen.lat]) ?? [0, 0];
    const bb = pr([props.destino.lon, props.destino.lat]) ?? [0, 0];
    const d = arco(a, bb);
    return { pr, d, largo: getLength(d) };
  }, [props.encuadre, props.origen, props.destino]);
  const avance = (tt: number) => tramo(tt, tSale, tLlega - tSale, 'solemne'); // arranca y frena despacio
  const k = avance(t);
  const punto = (u: number) => getPointAtLength(ruta.d, ruta.largo * clamp(u)) ?? { x: 960, y: 540 };
  const mira = punto(k + MIRA_ADELANTE);
  // anticipación: la cámara retrocede apenas antes de lanzarse; al abrirse se pasa un poco y se asienta
  const entraCam = anticipa(t, tSale, 1.1, 'pesado', 0.05, 0.35);
  const sale = t < tAbre ? 0 : spring({ frame: frame - tAbre * fps, fps, config: { damping: 13, mass: 1, stiffness: 60 } });
  const z0 = entraCam * (1 - sale);
  // lo que pasa de largo (la anticipación y el rebote) se nota, pero no deja ver el borde del mapa
  const z = z0 < 0 ? z0 * 0.35 : z0;
  const S = mix(1, ZOOM_VIAJE, z);
  const cx = mix(960, mira.x, clamp(z)), cy = mix(540, mira.y, clamp(z));
  const camara = `translate(${960 - S * cx}px, ${540 - S * cy}px) scale(${S})`;
  const llegaDestino = t < tLlega ? 0 : spring({ frame: frame - tLlega * fps, fps, config: { damping: 9, mass: 0.6, stiffness: 150 } });
  const anuncia = tramo(t, tSale - 0.6, 0.8, 'natural') * (1 - tramo(t, tLlega, 0.5, 'natural'));
  // cuándo cruza cada paralelo (para encenderlo y que suene)
  const cruces = useMemo(() => PARALELOS.map((p) => {
    for (let tt = tSale; tt <= tLlega; tt += 1 / fps) {
      const q = getPointAtLength(ruta.d, ruta.largo * avance(tt));
      const lat = q ? ruta.pr.invert?.([q.x, q.y])?.[1] ?? -90 : -90;
      if (lat >= p.lat) return tt;
    }
    return Infinity;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [ruta, tSale, tLlega, fps]);
  const paralelos = PARALELOS.map((p, i) => {
    const tc = cruces[i];
    const pulso = t < tc ? 0 : clamp((t - tc) / 0.15) * (0.15 + 0.85 * Math.exp(-(t - tc) * 1.6));
    return { ...p, brillo: pulso * (1 - clamp(sale)) };
  });
  const KM = props.distancia_km ?? 0;
  const km = Math.round(KM * k);
  const velocidadKm = (KM * (avance(t + 1 / fps) - k)) * fps;
  const contador = tramo(t, tSale, 0.6, 'natural') * (1 - tramo(t, tFicha - 0.3, 0.6, 'natural'));

  // —— la balanza: se inclina con la primera palabra y se equilibra con la segunda (con vaivén)
  const cae1 = tramo(t, tProf, 0.6, 'tenso'), cae2 = tramo(t, tClar, 0.6, 'tenso');
  const angulo = (cae1 >= 1 ? -12 : 0) * (cae2 >= 1 ? 0 : 1) + asienta(t, tProf + 0.6, 5) + asienta(t, tClar + 0.6, 4);

  // —— la brújula: gira despacio de una época a la otra y se asienta con un vaivén
  const ladoALado = props.brujula_polos === 'izquierda-derecha';
  const tIzq = T('izquierda', tBrujula + 1.5), tTiza = props.brujula_frase ? T('tiza', Infinity) : Infinity, tFrase = props.brujula_frase ? T('frase', tTiza + 2) : Infinity;
  const giro = tramo(t, tGiro, 4.5, 'solemne');
  // de tope a tope: la aguja va con decisión (acelera), choca con el tope y rebota (lo que llega se pasa y vuelve)
  const DUR_IZQ = 1.1, DUR_DER = 1.5;
  const anguloAguja = !ladoALado ? 180 * giro + asienta(t, tGiro + 4.5, 6, 6, 1.8)
    : -90 * tramo(t, tIzq, DUR_IZQ, 'tenso') + asienta(t, tIzq + DUR_IZQ, 7, 14, 6) * (t < tGiro ? 1 : 0)
      + 180 * tramo(t, tGiro, DUR_DER, 'tenso') - asienta(t, tGiro + DUR_DER, 7, 14, 6);
  const tizaK = tramo(t, tTiza, 1.4, 'natural');
  const tRegresion = props.rotulo_grafico ? T('regresion', Infinity) : Infinity;
  const tSerie = props.serie ? T('serie', Infinity) : Infinity;

  // —— los libros bajan a la repisa: el resorte se pasaría de la repisa; ese sobrepaso se vuelve
  // aplastamiento contra la madera (comprimir y estirar); al caer, se estiran apenas con la velocidad
  const caidaLibro = (i: number, tt: number) =>
    tt < tTemas + i * 0.55 ? 0 : spring({ frame: (tt - (tTemas + i * 0.55)) * fps, fps, config: { damping: 14, mass: 0.9, stiffness: 140 } });
  const deformaLibro = (i: number) => {
    const t0 = tTemas + i * 0.55;
    let contacto = Infinity;
    for (let tt = t0; tt < t0 + 2; tt += 1 / fps) if (caidaLibro(i, tt) >= 1) { contacto = tt; break; }
    if (t < contacto) return estiraCon(velocidad((tt) => 520 * Math.min(1, caidaLibro(i, tt)), t, fps), 0.05);
    return impacto(t, contacto, 0.06);
  };
  const fase = t < tPuntos ? 1 : t < tBalanza ? 2 : t < tEstante ? 3 : t < tAulas ? 4 : t < tBrujula ? 5 : 6;
  const entra = (t0: number) => tramo(t, t0 - 0.2, 0.8, 'natural');

  return (
    <AbsoluteFill style={{ backgroundColor: noche }}>
      {fase === 1 ? (
        <AbsoluteFill style={{ opacity: tramo(t, tMapa, 1, 'natural') }}>
          <Luz color={pal.ocre} x={40} y={40} radio={70} intensidad={0.08} />
          <AbsoluteFill style={{ transformOrigin: '0 0', transform: camara }}>
            <Mapa paleta={pal} id={`${escena.id}-mapa`} origen={props.origen} destinos={[props.tentacion, props.destino]} encuadre={props.encuadre}
              rutas={[kTentacion, k]} llegadas={[t > tParis ? mix(0.5, 0.18, borra) : 0, llegaDestino]}
              adelante={[0, anuncia]} faro={[0, anuncia * mix(0.35, 1, k)]} paralelos={paralelos} t={t} />
          </AbsoluteFill>
          {/* viñeta: los bordes se oscurecen y el ojo va al centro, donde está la punta del viaje */}
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, ${alfa('#000000', 0.45)} 100%)` }} />
          {/* el contador del viaje: kilómetros en línea recta que se van sumando */}
          {KM > 0 && contador > 0 ? (
            <div style={{ position: 'absolute', right: 120, bottom: 96, opacity: contador, textAlign: 'right' }}>
              <div style={{ fontFamily: fuente.mono, fontSize: 20, letterSpacing: '0.3em', color: alfa(pal.papel, 0.6), marginBottom: 8 }}>
                {`${props.origen.nombre.toUpperCase()} → ${props.destino.nombre.toUpperCase()}`}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: 12, color: pal.papel }}>
                <span style={{ fontFamily: fuente.mono, fontSize: 34, opacity: 0.6 }}>≈</span>
                <Odometro valor={km} digitos={String(KM).length} velocidad={velocidadKm} fps={fps} fontFamily={fuente.mono} fontSize={46} color={pal.papel} />
                <span style={{ fontFamily: fuente.mono, fontSize: 28, opacity: 0.75 }}>km</span>
              </div>
            </div>
          ) : null}
          <div style={{ position: 'absolute', left: 120, top: 90 }}>
            <Ficha texto={props.ficha} t={t - tFicha - 0.6} color={pal.papel} acento={pal.rojo} size={30} />
          </div>
        </AbsoluteFill>
      ) : null}

      {fase === 2 ? (
        <Papel color={pal.papel} envejecido={0.25}>
          <Dispersion paleta={pal} id={`${escena.id}-disp`} t={t - tPuntos} tRecta={tRecta - tPuntos} apagaDiscursos={tramo(t, tDiscursos, 1.2, 'natural')}
            aparece={entra(tPuntos)} tCaen={tCaen - tPuntos} busca={explica} residuos={!explica}
            tPendiente={tPendiente === undefined ? undefined : tPendiente - tPuntos}
            serie={props.serie && Number.isFinite(tSerie) ? { desde: tSerie - tPuntos, etiquetas: props.serie.etiquetas, valores: props.serie.valores, maximo: props.serie.maximo,
              unidad: props.serie.unidad, banda: props.serie.banda, textoBanda: props.serie.texto_banda, fuente: props.serie.fuente } : undefined}
            origen={props.fichero || props.serie?.cuadro ? { fichero: props.fichero, cuadro: props.serie?.cuadro } : undefined} />
          {/* el título del método: la frase que se anota (DIRECCION_DE_VIDEO §2.4) */}
          {props.titulo_metodo ? (
            <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: fuente.libro, fontStyle: 'italic', fontSize: 52,
              color: pal.fondo, opacity: tramo(t, tPuntos + 0.3, 1.0, 'natural'), transform: `translateY(${10 * (1 - tramo(t, tPuntos + 0.3, 1.0, 'natural'))}px)` }}>
              {props.titulo_metodo}
            </div>
          ) : null}
          {props.rotulo_grafico ? (
            <div style={{ position: 'absolute', left: 830, top: 196, fontFamily: fuente.mono, fontSize: 30, letterSpacing: '0.3em', color: pal.rojo,
              opacity: tramo(t, tRegresion, 0.6, 'natural') * (1 - tramo(t, tSerie, 0.5, 'natural')) }}>{props.rotulo_grafico.toUpperCase()}</div>
          ) : null}
          {props.serie ? (
            <div style={{ position: 'absolute', left: 830, top: 196, fontFamily: fuente.mono, fontSize: 26, letterSpacing: '0.22em', color: pal.rojo,
              opacity: tramo(t, tSerie + 0.4, 0.6, 'natural') }}>{props.serie.rotulo.toUpperCase()}</div>
          ) : null}
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
            entra={props.temas.map((_, i) => caidaLibro(i, t))} escalas={props.temas.map((_, i) => deformaLibro(i))} />
          {props.ficha_estante ? (
            <div style={{ position: 'absolute', left: 120, top: 90 }}>
              <Ficha texto={props.ficha_estante} t={t - tEstante - 0.4} color={pal.papel} acento={pal.rojo} size={30} />
            </div>
          ) : null}
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
          {tizaK > 0 ? <Pizarra aparece={tizaK} /> : null}
          <Luz color={pal.ocre} x={50} y={45} radio={55} intensidad={0.22 * (1 - tizaK)} />
          <Brujula paleta={pal} id={`${escena.id}-bru`} angulo={anguloAguja} radio={ladoALado ? 250 : 290} tiza={tizaK}
            topes={ladoALado ? [-90, 90] : []}
            polos={ladoALado ? [{ texto: props.brujula[0], angulo: -90 }, { texto: props.brujula[1], angulo: 90 }]
              : [{ texto: props.brujula[0], angulo: 0 }, { texto: props.brujula[1], angulo: 180 }]} />
          {/* junto a cada polo, lo que pensaba en esa etapa: se ve el cambio, no solo se escucha (§2.1) */}
          {props.brujula_notas ? props.brujula_notas.map((notas, lado) => {
            const t0 = lado === 0 ? tIzq + DUR_IZQ : tGiro + DUR_DER;
            return (
              <div key={lado} style={{ position: 'absolute', top: 690, [lado === 0 ? 'left' : 'right']: 120, width: 500, textAlign: lado === 0 ? 'left' : 'right',
                opacity: 1 - tizaK }}>
                {notas.map((n, i) => (
                  // un título de libro (con su año) o una frase suya entre comillas van en itálica de libro
                  <div key={i} style={{ fontFamily: n.includes('(') || n.startsWith('«') ? fuente.libro : fuente.mono, fontStyle: n.includes('(') || n.startsWith('«') ? 'italic' : 'normal',
                    fontSize: n.startsWith('«') ? 32 : n.includes('(') ? 28 : 26, letterSpacing: n.includes('(') || n.startsWith('«') ? 0 : '0.12em',
                    color: n.startsWith('«') ? mezclar(pal.papel, pal.ocre, 0.35) : pal.papel, marginTop: n.startsWith('«') ? 18 : 10, lineHeight: 1.25,
                    opacity: tramo(t, t0 + 0.2 + i * 0.5, 0.6, 'natural') }}>{n}</div>
                ))}
              </div>
            );
          }) : null}
          {props.brujula_frase ? (
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
              <TextoTiza id={`${escena.id}-frase`} texto={props.brujula_frase} x={960} y={970} anchor="middle" k={tramo(t, tFrase, 2.4, 'natural')}
                size={60} ancho={0.44} fontFamily={fuente.imprentaItalica} brillo={0.4} />
            </svg>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {/* sonido */}
      <Sfx nombre="soplo" en={tParis} fps={fps} volumen={0.3} />
      <Sfx nombre="borrar" en={tDuda + 0.7} fps={fps} volumen={0.35} />
      <Sfx nombre="soplo" en={tSale} fps={fps} volumen={0.35} />
      {cruces.filter(Number.isFinite).map((tc, i) => <Sfx key={`x${i}`} nombre="tic" en={tc} fps={fps} volumen={0.3} />)}
      <Sfx nombre="campana" en={tLlega} fps={fps} volumen={0.3} />
      {props.ficha.split('').map((ch, i) => (ch === ' ' ? null : <Sfx key={`k${i}`} nombre={`tecla-${(i % 3) + 1}`} en={tFicha + 0.6 + i / 18} fps={fps} volumen={0.3} />))}
      {Array.from({ length: 12 }, (_, i) => <Sfx key={`p${i}`} nombre="tic" en={tCaen + i * 0.25} fps={fps} volumen={0.25} />)}
      <Sfx nombre="lapiz" en={tRecta} fps={fps} volumen={0.28} />
      {props.serie && Number.isFinite(tSerie) ? props.serie.valores.map((_, j) => (
        <Sfx key={`sv${j}`} nombre="tic" en={tSerie + 1.3 + j * Math.min(0.3, 3.4 / props.serie!.valores.length)} fps={fps} volumen={0.2} />
      )) : null}
      {tPendiente !== undefined ? <Sfx nombre="lapiz" en={tPendiente} fps={fps} volumen={0.22} /> : null}
      {props.ficha_estante ? props.ficha_estante.split('').map((ch, i) => (ch === ' ' ? null : <Sfx key={`e${i}`} nombre={`tecla-${(i % 3) + 1}`} en={tEstante + 0.4 + i / 18} fps={fps} volumen={0.3} />)) : null}
      <Sfx nombre="metal" en={tProf + 0.6} fps={fps} volumen={0.55} />
      <Sfx nombre="metal" en={tClar + 0.6} fps={fps} volumen={0.45} />
      {props.temas.map((_, i) => <Sfx key={`l${i}`} nombre="carpeta" en={tTemas + i * 0.55 + 0.35} fps={fps} volumen={0.4} />)}
      {props.ficha_aulas ? props.ficha_aulas.split('').map((ch, i) => (ch === ' ' ? null : <Sfx key={`a${i}`} nombre={`tecla-${(i % 3) + 1}`} en={tAulas + 0.4 + i / 18} fps={fps} volumen={0.3} />)) : null}
      {ladoALado ? (
        <>
          <Sfx nombre="metal" en={tIzq + DUR_IZQ} fps={fps} volumen={0.35} />
          <Sfx nombre="metal" en={tGiro + DUR_DER} fps={fps} volumen={0.4} />
          <Sfx nombre="lapiz" en={tFrase} fps={fps} volumen={0.22} />
        </>
      ) : Array.from({ length: 9 }, (_, i) => <Sfx key={`g${i}`} nombre="tic" en={tGiro + i * 0.5} fps={fps} volumen={0.2 + clamp(i / 9) * 0.1} />)}
    </AbsoluteFill>
  );
};
