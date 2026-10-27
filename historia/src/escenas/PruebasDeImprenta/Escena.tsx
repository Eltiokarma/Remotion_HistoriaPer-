import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Luz } from '../../components/atmosfera/Luz';
import { Papel } from '../../components/atmosfera/Papel';
import { Sfx } from '../../components/audio/Sfx';
import { PilaDePaginas } from '../../components/graficos/PilaDePaginas';
import { SelloFecha } from '../../components/graficos/Sello';
import { Ficha } from '../../components/texto/Ficha';
import { Renglones } from '../../components/texto/Renglones';
import { TrazoRojo } from '../../components/texto/TrazoRojo';
import { beat, mix, tramo } from '../../direction/anim';
import type { EscenaProps } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;
const DUR_CORR = 9, TRAZOS = 9, CPS = 18;

/** La frase con su parte subrayada. */
const Cita: React.FC<{ texto: string; subrayado?: string; k: number; color: string; rojo: string }> = ({ texto, subrayado, k, color, rojo }) => {
  const i = subrayado ? texto.indexOf(subrayado) : -1;
  if (i < 0 || !subrayado) return <span style={{ color }}>{texto}</span>;
  return (
    <span style={{ color }}>
      {texto.slice(0, i)}
      <TrazoRojo k={k} color={rojo} grosor={5}>{subrayado}</TrazoRojo>
      {texto.slice(i + subrayado.length)}
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
  const tAbajo = beat(b, 'abajo', 24), tCorte1 = beat(b, 'corte1', 30), tSello1 = beat(b, 'sello1', tCorte1 + 0.5);
  const tCorte2 = beat(b, 'corte2', 33), tSello2 = beat(b, 'sello2', tCorte2 + 1), tFinal = beat(b, 'final', 36);
  const noche = mezclar(pal.fondo, '#000000', 0.35);

  // —— A: la pila sobre la mesa (hasta entrar a la página)
  const entra = tramo(t, 0, 1.4, 'natural');
  // cámara quieta mientras la pluma corrige: se mueve recién para entrar a la página
  const zambulle = tramo(t, tCita - 0.5, 1.1, 'pesado'); // la cámara se mete en la hoja
  // —— C: la página del libro
  const pagina = tramo(t, tCita - 0.1, 0.9, 'natural');
  const zoomCita = mix(1, 1.08, tramo(t, tCita, tCorte1 - tCita, 'natural'));
  const baja = tramo(t, tAbajo, 2.6, 'pesado');
  // —— D/E: sellos
  const golpe = (tb: number) => (t < tb ? 0 : spring({ frame: frame - tb * fps, fps, config: { damping: 13, mass: 1.3, stiffness: 210 } }));
  const temblor = (tb: number) => (t > tb + 0.08 && t < tb + 0.26 ? Math.sin(frame * 3.3) * 3 : 0);
  const aleja = tramo(t, tFinal, 6, 'natural');

  const fase = t < tCorte1 ? 'mesa' : t < tCorte2 ? 'negro' : 'impresa';

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
                <AbsoluteFill style={{ transform: `scale(${zoomCita * mix(1.12, 1, pagina)}) translateY(${-130 * baja}px)`, transformOrigin: '50% 45%' }}>
                  <div style={{ position: 'absolute', left: 410, top: 96, width: 1100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontFamily: fuente.libro, fontSize: 30, letterSpacing: '0.42em', marginRight: '-0.42em', color: alfa(pal.fondo, 0.7), fontVariant: 'small-caps' }}>
                      {props.seccion.toLowerCase()}
                    </div>
                    <div style={{ width: 80, height: 1, background: alfa(pal.fondo, 0.4), margin: '22px 0 46px' }} />
                    <Renglones ancho={1100} lineas={5} interlinea={52} alto={13} color={pal.fondo} opacidad={0.28} semilla={35} style={{ filter: 'blur(1.2px)' }} />
                    <div style={{ fontFamily: fuente.libro, fontSize: 62, lineHeight: 1.42, textAlign: 'center', margin: '34px 0 40px', maxWidth: 1080,
                      opacity: tramo(t, tCita + 0.4, 1.2, 'natural') }}>
                      <Cita texto={props.cita.texto} subrayado={props.cita.subrayado} k={tramo(t, tSub, 1.1, 'natural')} color={pal.fondo} rojo={pal.rojo} />
                    </div>
                    <Renglones ancho={1100} lineas={9} interlinea={52} alto={13} color={pal.fondo} opacidad={0.28} semilla={36} style={{ filter: 'blur(1.2px)' }} />
                  </div>
                  {/* «unas líneas más abajo»: una marca del autor al margen */}
                  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                    <path d="M1546 905 l 9 13 l 18 -30" fill="none" stroke={pal.rojo} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"
                      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tramo(t, tAbajo + 1.6, 0.5, 'ligero')} opacity={0.85} />
                  </svg>
                </AbsoluteFill>
              </Papel>
            </AbsoluteFill>
          ) : null}
        </>
      ) : null}

      {/* D: corte seco a negro, primer sello */}
      {fase === 'negro' ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `translateY(${temblor(tSello1)}px)` }}>
          <div style={{ opacity: t >= tSello1 ? 1 : 0, transform: `scale(${t < tSello1 ? 0 : mix(1.6, 1, golpe(tSello1))}) rotate(-4deg)` }}>
            <SelloFecha id={`${escena.id}-s1`} texto={props.sellos[0]} color={pal.rojo} mezcla="normal" width={640} semilla={4} />
          </div>
        </AbsoluteFill>
      ) : null}

      {/* E: corte seco a la página impresa, limpia; segundo sello en tinta */}
      {fase === 'impresa' ? (
        <AbsoluteFill style={{ transform: `scale(${mix(1, 0.9, aleja)})` }}>
          <Papel color={mezclar(pal.papel, '#ffffff', 0.15)} envejecido={0.12}>
            <AbsoluteFill style={{ alignItems: 'center', paddingTop: 200, transform: `translateY(${temblor(tSello2)}px)` }}>
              <Renglones ancho={560} lineas={4} interlinea={40} alto={11} color={pal.fondo} opacidad={0.34} semilla={51} centrado />
              <div style={{ width: 60, height: 1, background: alfa(pal.fondo, 0.35), margin: '46px 0' }} />
              <Renglones ancho={420} lineas={3} interlinea={34} alto={9} color={pal.fondo} opacidad={0.3} semilla={52} centrado />
            </AbsoluteFill>
            <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 300 }}>
              <div style={{ opacity: t >= tSello2 ? 1 : 0, transform: `scale(${t < tSello2 ? 0 : mix(1.5, 1, golpe(tSello2))}) rotate(3deg)` }}>
                <SelloFecha id={`${escena.id}-s2`} texto={props.sellos[1]} color={pal.fondo} width={560} semilla={12} />
              </div>
            </AbsoluteFill>
          </Papel>
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, ${alfa('#000000', 0.55 * aleja)} 100%)` }} />
        </AbsoluteFill>
      ) : null}

      {/* sonido: solo papel, lápiz, máquina y sellos */}
      {props.ficha.split('').map((ch, i) => (ch === ' ' ? null : <Sfx key={`k${i}`} nombre={`tecla-${(i % 3) + 1}`} en={tFicha + i / CPS} fps={fps} volumen={0.32} />))}
      {Array.from({ length: TRAZOS }, (_, i) => <Sfx key={`p${i}`} nombre="lapiz" en={tCorr + (i * DUR_CORR) / TRAZOS} fps={fps} volumen={0.22} />)}
      <Sfx nombre="hoja" en={tCita - 0.4} fps={fps} volumen={0.5} />
      <Sfx nombre="lapiz" en={tSub} fps={fps} volumen={0.28} />
      <Sfx nombre="sello" en={tSello1} fps={fps} volumen={0.9} />
      <Sfx nombre="sello" en={tSello2} fps={fps} volumen={0.65} />
    </AbsoluteFill>
  );
};
