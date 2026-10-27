import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Luz } from '../../components/atmosfera/Luz';
import { Papel } from '../../components/atmosfera/Papel';
import { Sfx } from '../../components/audio/Sfx';
import { Cordillera } from '../../components/graficos/Cordillera';
import { GotaMercurio } from '../../components/graficos/GotaMercurio';
import { IndiceSerie } from '../../components/graficos/IndiceSerie';
import { Ficha } from '../../components/texto/Ficha';
import { Renglones } from '../../components/texto/Renglones';
import { beat, mix, tramo } from '../../direction/anim';
import type { EscenaProps } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;
const NEGRO_FRAMES = 10;

export const Denunciantes: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const frame = useCurrentFrame();
  const fps = video.fps;
  const t = frame / fps;
  const pal = video.paleta;
  const b = escena.beats;
  const T = (n: string, d: number) => beat(b, n, d);
  const tLista = T('lista', 0.2), tTacha = T('tacha', 4.5), tCordillera = T('cordillera', 5.5), tHuanca = T('huanca', 14), tAltura = T('altura', 16);
  const tMercurio = T('mercurio', 20), tPlata = T('plata', 22), tLimpiar = T('limpiar', 24.5), tPerdio = T('perdio', 27.5);
  const tOtros = T('otros', 30), paso = T('paso_nombres', 1.4), tCapitulos = T('capitulos', 37), tSerie = T('serie', 43);
  const noche = mezclar(pal.fondo, '#000000', 0.3);
  const finNegro = tPerdio + NEGRO_FRAMES / fps;
  const fase = t < tCordillera + 0.6 ? 1 : t < tMercurio ? 2 : t < tPerdio ? 3 : t < finNegro ? 4 : t < tCapitulos - 0.3 ? 5 : 6;
  const sale = tramo(t, tCordillera, 0.9, 'pesado');
  const brillo = tramo(t, tLimpiar, 1.4, 'natural');

  return (
    <AbsoluteFill style={{ backgroundColor: fase === 4 ? '#000000' : noche }}>
      {/* 1–2: la lista que no es; la cordillera */}
      {fase <= 2 ? (
        <AbsoluteFill>
          {t >= tCordillera - 0.2 ? (
            <AbsoluteFill style={{ transform: `scale(${mix(1.0, 1.06, tramo(t, tCordillera, tMercurio - tCordillera, 'natural'))})` }}>
              <Cordillera paleta={pal} id={`${escena.id}-cord`} dibujo={tramo(t, tCordillera, 3, 'natural')} baja={tramo(t, tHuanca, 1.2, 'natural')}
                altura={tramo(t, tAltura, 1.2, 'natural')} rotuloAltura={props.altura} />
            </AbsoluteFill>
          ) : null}
          {t >= tHuanca ? (
            <div style={{ position: 'absolute', left: 120, top: 90 }}>
              <Ficha texto={props.ficha} t={t - tHuanca - 0.3} color={pal.papel} acento={pal.rojo} size={30} />
            </div>
          ) : null}
          {sale < 1 ? (
            <AbsoluteFill style={{ transform: `translateX(${-2100 * sale}px) rotate(${-4 * sale}deg)` }}>
              <Papel color={pal.papel} envejecido={0.3}>
                {Array.from({ length: 16 }, (_, i) => (
                  <div key={i} style={{ position: 'absolute', left: 360, top: 150 + i * 50, display: 'flex', gap: 30, alignItems: 'center', opacity: tramo(t, tLista + i * 0.05, 0.4, 'natural') }}>
                    <div style={{ fontFamily: fuente.mono, fontSize: 24, color: alfa(pal.fondo, 0.6), width: 40 }}>{i + 1}.</div>
                    <Renglones ancho={900} lineas={1} interlinea={20} alto={12} color={pal.fondo} opacidad={0.4} semilla={700 + i} />
                  </div>
                ))}
                <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
                  <path d="M330 150 L1340 930" stroke={pal.rojo} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tramo(t, tTacha, 0.5, 'tenso')} />
                  <path d="M1340 150 L330 930" stroke={pal.rojo} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tramo(t, tTacha + 0.35, 0.5, 'tenso')} />
                </svg>
              </Papel>
            </AbsoluteFill>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {/* 3: mercurio que se vuelve plata; un brillo intenta limpiarla */}
      {fase === 3 ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Luz color="#cfd6db" x={50} y={45} radio={50} intensidad={0.14} />
          <div style={{ position: 'relative', marginTop: 120 }}>
            {/* el brillo que barre la tapa: alguien intenta limpiarla */}
            <GotaMercurio id={`${escena.id}-hg`} size={720} caida={tramo(t, tMercurio, 0.7, 'tenso')} forma={tramo(t, tPlata, 1.3, 'natural')}
              latido={brillo > 0 && brillo < 1 ? brillo * 3.2 : undefined} />
          </div>
        </AbsoluteFill>
      ) : null}

      {/* 4: negro (10 cuadros) — no se dibuja nada */}

      {/* 5: los que vinieron después */}
      {fase === 5 ? (
        <AbsoluteFill>
          <Luz color={pal.ocre} x={35} y={50} radio={60} intensidad={0.12} />
          {props.denunciantes.map((n, i) => {
            const t0 = tOtros + i * paso;
            const letras = Math.floor(Math.max(0, t - t0) * 24);
            if (t < t0) return null;
            return (
              <div key={i} style={{ position: 'absolute', left: 300, top: 270 + i * 140, display: 'flex', alignItems: 'center', gap: 34 }}>
                <div style={{ width: 16, height: 16, background: pal.rojo, opacity: tramo(t, t0, 0.3, 'ligero') }} />
                <div style={{ fontFamily: fuente.libro, fontSize: 76, color: pal.papel, whiteSpace: 'pre' }}>{n.slice(0, letras)}</div>
              </div>
            );
          })}
        </AbsoluteFill>
      ) : null}

      {/* 6: el índice de la serie */}
      {fase === 6 ? (
        <AbsoluteFill>
          <Luz color={pal.ocre} x={50} y={40} radio={70} intensidad={0.14 + 0.06 * tramo(t, tSerie, 1, 'natural')} />
          <IndiceSerie paleta={pal} capitulos={props.capitulos} encabezado={props.encabezado} aparece={tramo(t, tCapitulos - 0.3, 0.8, 'natural')}
            encendido={props.capitulos.map((_, i) => tramo(t, tCapitulos + 0.3 + i * 0.62, 0.5, 'natural'))} />
        </AbsoluteFill>
      ) : null}

      <Sfx nombre="lapiz" en={tTacha} fps={fps} volumen={0.55} />
      <Sfx nombre="hoja" en={tCordillera} fps={fps} volumen={0.5} />
      <Sfx nombre="soplo" en={tHuanca} fps={fps} volumen={0.3} />
      {props.ficha.split('').map((ch, i) => (ch === ' ' ? null : <Sfx key={`k${i}`} nombre={`tecla-${(i % 3) + 1}`} en={tHuanca + 0.3 + i / 18} fps={fps} volumen={0.25} />))}
      <Sfx nombre="gota" en={tMercurio + 0.7} fps={fps} volumen={0.7} />
      <Sfx nombre="metal" en={tPlata + 1.2} fps={fps} volumen={0.5} />
      <Sfx nombre="soplo" en={tLimpiar} fps={fps} volumen={0.35} />
      {props.denunciantes.map((_, i) => <Sfx key={`n${i}`} nombre="tic" en={tOtros + i * paso} fps={fps} volumen={0.35} />)}
      {props.capitulos.map((_, i) => <Sfx key={`c${i}`} nombre="tic" en={tCapitulos + 0.3 + i * 0.62} fps={fps} volumen={0.3} />)}
    </AbsoluteFill>
  );
};
