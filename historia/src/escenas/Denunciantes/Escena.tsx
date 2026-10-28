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
import type { Peso } from '../../direction/easings';
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
  const personas = [props.abre, ...props.denunciantes];
  // el parentesco (si hay): de quién desciende quién, como índices en `personas`
  const lazo = props.lazo
    ? { de: personas.findIndex((p) => p.nombre === props.lazo?.de), a: personas.findIndex((p) => p.nombre === props.lazo?.a) }
    : null;
  const hayLazo = lazo !== null && lazo.de >= 0 && lazo.a > 0;
  const tLazo = T('lazo', hayLazo ? tNombres[lazo.a - 1] + 1.5 : 0), tLazoLlega = T('lazo_llega', tLazo + 1.6);
  /**
   * Los movimientos de cámara, en orden: de un nombre al siguiente (sale cuando la voz ya lo dijo y
   * llega cuando dice el próximo) y, si hay parentesco, una mirada hacia atrás que deja ver a los dos.
   */
  type Mov = { sale: number; llega: number; c: number; z: number; peso: Peso; impulso?: boolean; aire?: boolean; avanza?: boolean };
  const movs: Mov[] = [];
  let tAntes = tOtros + 0.05;
  props.denunciantes.forEach((d, i) => {
    movs.push({ sale: tAntes + 0.3, llega: tNombres[i] + 0.15, c: d.en, z: Z_CERCA, peso: 'natural', impulso: i === 0, aire: true, avanza: true });
    tAntes = tNombres[i];
    if (hayLazo && lazo.a === i + 1) {
      // «descendía de Ulloa»: la cámara retrocede y se aleja lo justo para ver a los dos; el arco la guía
      const de = personas[lazo.de].en;
      movs.push({ sale: tLazo, llega: tLazoLlega + 0.2, c: (de + d.en) / 2, z: Math.min(Z_CERCA, 1250 / Math.abs(d.en - de)), peso: 'solemne' });
      // se queda medio segundo con los dos unidos antes de seguir
      tAntes = tLazoLlega + 0.35;
    }
  });
  /** La cámara (qué año está en el centro y cuántos píxeles mide un año) y lo ya recorrido, en el segundo s. */
  const viaje = (s: number) => {
    let c = props.abre.en, z = Z_CERCA, r = props.abre.en, cAntes = c, zAntes = z, rAntes = r;
    for (const m of movs) {
      const dur = Math.max(0.6, m.llega - m.sale);
      // la primera vez, antes de salir, retrocede apenas: toma impulso
      const k = m.impulso ? anticipa(s, m.sale, dur, m.peso, 0.04, 0.35) : tramo(s, m.sale, dur, m.peso);
      c += (m.c - cAntes) * k;
      // en los tramos largos la cámara se aleja un poco y vuelve: un arco en profundidad, no una recta
      z *= Math.pow(m.z / zAntes, clamp(k)) * (m.aire ? 1 - arqueo(clamp(k), Math.min(0.14, Math.abs(m.c - cAntes) / 700)) : 1);
      // lo recorrido solo avanza (cuando la cámara mira atrás, la línea encendida se queda donde estaba)
      if (m.avanza) {
        r += (m.c - rAntes) * clamp(k);
        rAntes = m.c;
      }
      cAntes = m.c;
      zAntes = m.z;
    }
    // después del último nombre no se clava: sigue a la deriva, apenas
    c += 2.5 * tramo(s, tNombres[tNombres.length - 1] + 0.4, 2.4, 'natural');
    const enciende = ini + (props.abre.en - ini) * tramo(s, finNegro + 0.1, 0.9, 'natural');
    const rc = Math.max(enciende, Math.min(r, fin));
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
            eventos={personas.map((d, i) => ({ en: d.en, rotulo: d.corto ?? d.nombre, detalle: d.detalle, tono: 'persona' as const, nivel: (i % 2) as 0 | 1 }))}
            centro={cam.centro} escala={cam.escala} recorrido={cam.recorrido} aparece={tramo(t, finNegro, 0.6, 'natural')}
            guia={tramo(t, tOtros, 0.5, 'natural') * (1 - tramo(t, tCapitulos + 0.9, 0.5, 'natural'))}
            realce={personas.map((_, i) => (i === 0 ? (hayLazo && lazo.de === 0 ? pulso(tLazoLlega) : 0) : pulso(tNombres[i - 1])))}
            lazos={hayLazo ? [{ desde: lazo.a, hasta: lazo.de, dibujo: tramo(t, tLazo + 0.1, tLazoLlega - tLazo, 'natural') }] : []}
            fondoVisible={1 - tramo(t, tCapitulos, 0.8, 'natural')}
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
      {hayLazo ? <Sfx nombre="lapiz" en={tLazo + 0.1} fps={fps} volumen={0.16} /> : null}
      {caps.map((_, i) => <Sfx key={`c${i}`} nombre="tic" en={tCiclos + 0.1 + i * 0.28} fps={fps} volumen={0.3} />)}
      <Sfx nombre="hoja" en={tSerie + 0.5} fps={fps} volumen={0.4} />
    </AbsoluteFill>
  );
};
