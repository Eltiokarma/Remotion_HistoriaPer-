import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import type { z } from 'zod';
import { Luz } from '../../components/atmosfera/Luz';
import { Papel } from '../../components/atmosfera/Papel';
import { Sfx } from '../../components/audio/Sfx';
import { Cordillera } from '../../components/graficos/Cordillera';
import { GotaMercurio } from '../../components/graficos/GotaMercurio';
import { IndiceSerie } from '../../components/graficos/IndiceSerie';
import { LineaDeTiempo } from '../../components/graficos/LineaDeTiempo';
import { Ficha } from '../../components/texto/Ficha';
import { Renglones } from '../../components/texto/Renglones';
import { anticipa, arqueo, beat, clamp, tramo } from '../../direction/anim';
import type { EscenaProps } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import type { esquema } from './esquema';

type P = z.infer<typeof esquema>;
const NEGRO_FRAMES = 10;
const ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
/** Píxeles por año mientras se recorre: los nombres caben sin pisarse y los años se sienten. */
const Z_CERCA = 11;

export const Denunciantes: React.FC<EscenaProps<P>> = ({ escena, props, video }) => {
  const frame = useCurrentFrame();
  const fps = video.fps;
  const t = frame / fps;
  const pal = video.paleta;
  const b = escena.beats;
  const T = (n: string, d: number) => beat(b, n, d);
  const tLista = T('lista', 0.2), tTacha = T('tacha', 4.5), tCordillera = T('cordillera', 5.5), tHuanca = T('huanca', 14), tAltura = T('altura', 16);
  const tMercurio = T('mercurio', 20), tPlata = T('plata', 22), tLimpiar = T('limpiar', 24.5), tPerdio = T('perdio', 27.5);
  const tOtros = T('otros', 29), tCapitulos = T('capitulos', 40.4), tCiclos = T('ciclos', 42.6), tSerie = T('serie', 48.2);
  const tVirreinato = T('virreinato', 45), tDosMil = T('dos_mil', 46.2);
  const tNombres = props.denunciantes.map((_, i) => T(`nombre_${i + 1}`, tOtros + 2.3 + i * 2.2));
  const noche = mezclar(pal.fondo, '#000000', 0.3);
  const finNegro = tPerdio + NEGRO_FRAMES / fps;
  const fase = t < tCordillera + 0.6 ? 1 : t < tMercurio ? 2 : t < tPerdio ? 3 : t < finNegro ? 4 : 5;
  // la lista se corre un poco hacia la derecha antes de irse (anticipación) y sale en arco, como un papel que se retira de la mesa
  const sale = anticipa(t, tCordillera, 0.9, 'pesado', 0.03, 0.3);
  const brillo = tramo(t, tLimpiar, 1.4, 'natural');

  // 5: la línea de tiempo de la serie, con el largo real de cada capítulo (la misma del índice)
  const caps = props.capitulos;
  const ini = caps[0].desde, fin = caps[caps.length - 1].hasta + 1;
  const cortes = [...caps.map((c) => c.desde), fin];
  const zAbierta = 1320 / (fin - ini); // como en el índice: el comienzo en x = 300 y el final en x = 1620
  const cAbierta = ini + 660 / zAbierta;
  const paradas = [{ t: tOtros, en: props.abre.en }, ...props.denunciantes.map((d, i) => ({ t: tNombres[i], en: d.en }))];
  /** La cámara (qué año está en el centro y cuántos píxeles mide un año) y lo ya recorrido, en el segundo s. */
  const viaje = (s: number) => {
    // de un nombre al siguiente: sale cuando la voz ya lo dijo y llega cuando dice el próximo; arranca y frena
    let c = paradas[0].en, z = Z_CERCA;
    for (let i = 1; i < paradas.length; i++) {
      const a = paradas[i - 1], d = paradas[i];
      const sale = a.t + (i === 1 ? 0.35 : 0.3);
      const dur = Math.max(0.6, d.t + 0.15 - sale);
      // la primera vez, antes de salir, retrocede apenas: toma impulso
      const k = i === 1 ? anticipa(s, sale, dur, 'natural', 0.04, 0.35) : tramo(s, sale, dur, 'natural');
      c += (d.en - a.en) * k;
      // en los tramos largos la cámara se aleja un poco y vuelve: un arco en profundidad, no una recta
      z *= 1 - arqueo(clamp(k), Math.min(0.14, (d.en - a.en) / 700));
    }
    // después del último nombre no se clava: sigue a la deriva, apenas
    c += 2.5 * tramo(s, paradas[paradas.length - 1].t + 0.4, 2.4, 'natural');
    const enciende = ini + (props.abre.en - ini) * tramo(s, finNegro + 0.1, 0.9, 'natural');
    const rc = Math.max(enciende, Math.min(c, fin));
    // «siete capítulos»: toma aire (se acerca un poco) y se abre hasta ver la línea entera, que se enciende hasta el final
    const o = anticipa(s, tCapitulos, 1.5, 'solemne', 0.035, 0.3);
    return {
      centro: c + (cAbierta - c) * o,
      escala: z * Math.pow(zAbierta / z, o),
      recorrido: rc + (fin - rc) * tramo(s, tCapitulos + 0.15, 1.6, 'natural'),
    };
  };
  const cam = viaje(t);
  // un tic cada vez que lo recorrido cruza el borde de un capítulo
  const cruces = useMemo(() => {
    const out: number[] = [];
    let j = 1;
    for (let f = Math.ceil(finNegro * fps); j < cortes.length - 1 && f < (tCapitulos + 2) * fps; f++) {
      while (j < cortes.length - 1 && viaje(f / fps).recorrido >= cortes[j]) {
        out.push(f / fps);
        j++;
      }
    }
    return out;
    // viaje depende solo de los beats y las props
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fps, escena.beats, props]);
  const pulso = (s0: number) => tramo(t, s0, 0.2, 'ligero') * (1 - tramo(t, s0 + 0.5, 0.9, 'natural'));
  const yLinea = 560 + 240 * anticipa(t, tSerie, 1.2, 'solemne', 0.04, 0.25);

  return (
    <AbsoluteFill style={{ backgroundColor: fase === 4 ? '#000000' : noche }}>
      {/* 1–2: la lista que no es; la cordillera */}
      {fase <= 2 ? (
        <AbsoluteFill>
          {t >= tCordillera - 0.2 ? (
            <AbsoluteFill>
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
            <AbsoluteFill style={{ transform: `translate(${-2100 * sale}px, ${-arqueo(sale, 60)}px) rotate(${-4 * sale}deg)` }}>
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
            <GotaMercurio id={`${escena.id}-hg`} size={720} caida={tramo(t, tMercurio, 0.7, 'tenso')} tras={t - (tMercurio + 0.7)} forma={tramo(t, tPlata, 1.3, 'natural')}
              latido={brillo > 0 && brillo < 1 ? brillo * 3.2 : undefined} />
          </div>
        </AbsoluteFill>
      ) : null}

      {/* 4: negro (10 cuadros) — no se dibuja nada */}

      {/* 5: la línea de la serie: de Ulloa a los que vinieron después; se abre, se enciende por ciclos y se vuelve el índice */}
      {fase === 5 ? (
        <AbsoluteFill>
          <Luz color={pal.ocre} x={50} y={45} radio={65} intensidad={0.1 + 0.06 * tramo(t, tSerie, 1, 'natural')} />
          <IndiceSerie paleta={pal} capitulos={caps} encabezado={props.encabezado} linea={false} aparece={tramo(t, tSerie + 0.5, 0.9, 'natural')}
            encendido={caps.map((_, i) => tramo(t, tSerie + 0.7 + i * 0.16, 0.45, 'natural'))} />
          <LineaDeTiempo paleta={pal} id={`${escena.id}-serie`} y={yLinea} tramos={caps.map((_, i) => ROMANOS[i])} cortes={cortes}
            subtramos={caps.map((c) => `${c.desde}–${c.hasta}`)} fondo={caps.map((c) => c.titulo)}
            eventos={[props.abre, ...props.denunciantes].map((d) => ({ en: d.en, rotulo: d.nombre, detalle: d.detalle, tono: 'persona' as const }))}
            centro={cam.centro} escala={cam.escala} recorrido={cam.recorrido} aparece={tramo(t, finNegro, 0.6, 'natural')}
            guia={tramo(t, tOtros, 0.5, 'natural') * (1 - tramo(t, tCapitulos + 0.9, 0.5, 'natural'))}
            realce={[0, ...tNombres.map(pulso)]} fondoVisible={1 - tramo(t, tCapitulos, 0.8, 'natural')}
            nombres={1 - tramo(t, tCapitulos + 0.2, 0.7, 'natural')}
            bandas={caps.map((_, i) => tramo(t, tCiclos + 0.1 + i * 0.28, 0.35, 'ligero'))}
            extremos={[tramo(t, tVirreinato, 0.6, 'natural'), tramo(t, tDosMil, 0.6, 'natural')]} rotulosExtremos={[String(ini), String(fin - 1)]}
            barrido={tramo(t, tVirreinato - 0.15, tDosMil + 0.45 - tVirreinato, 'natural')} />
        </AbsoluteFill>
      ) : null}

      <Sfx nombre="lapiz" en={tTacha} fps={fps} volumen={0.28} />
      <Sfx nombre="hoja" en={tCordillera} fps={fps} volumen={0.5} />
      <Sfx nombre="soplo" en={tHuanca} fps={fps} volumen={0.3} />
      {props.ficha.split('').map((ch, i) => (ch === ' ' ? null : <Sfx key={`k${i}`} nombre={`tecla-${(i % 3) + 1}`} en={tHuanca + 0.3 + i / 18} fps={fps} volumen={0.25} />))}
      <Sfx nombre="gota" en={tMercurio + 0.7} fps={fps} volumen={0.7} />
      <Sfx nombre="metal" en={tPlata + 1.2} fps={fps} volumen={0.5} />
      <Sfx nombre="soplo" en={tLimpiar} fps={fps} volumen={0.35} />
      {cruces.map((c, i) => <Sfx key={`x${i}`} nombre="tic" en={c} fps={fps} volumen={0.16} />)}
      {tNombres.map((n, i) => <Sfx key={`n${i}`} nombre="pluma" en={n - 0.05} fps={fps} volumen={0.2} />)}
      {caps.map((_, i) => <Sfx key={`c${i}`} nombre="tic" en={tCiclos + 0.1 + i * 0.28} fps={fps} volumen={0.3} />)}
      <Sfx nombre="hoja" en={tSerie + 0.5} fps={fps} volumen={0.4} />
    </AbsoluteFill>
  );
};
