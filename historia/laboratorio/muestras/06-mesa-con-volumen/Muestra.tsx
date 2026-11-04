import { AbsoluteFill, Audio, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { Atmosfera } from '../../../src/components/atmosfera/Atmosfera';
import { Papel } from '../../../src/components/atmosfera/Papel';
import { Sfx } from '../../../src/components/audio/Sfx';
import { Pluma } from '../../../src/components/graficos/Pluma';
import { bordePapel, FiltroTinta, trazoManuscrito } from '../../../src/components/graficos/svg';
import { clamp, mix } from '../../../src/direction/anim';
import { azar } from '../../../src/direction/azar';
import { alfa, mezclar } from '../../../src/estilo/color';
import { fuente } from '../../../src/estilo/fuentes';
import { ambiente, textura } from '../../../src/estilo/recursos';
import { PALETA } from '../../remotion/comun';
import {
  B, DOC, ESCRITORIO, LAMPARA, LAMPARA_3D, LIBRO, MESA, PALABRA, PERSPECTIVA, PILA, RENGLON, SUBRAYADO,
  cadena, camara, estadoDoc, estadoLibro, estadoPluma, estela, luz as luzDe, posDoc, posLibro, posPluma, proyectar, temblor,
  type EstadoHoja, type EstadoLibro,
} from './movimiento';

/**
 * Muestra 06 · La mesa con volumen (10 s). Responde al veredicto de Gerson sobre la tanda 1: «está
 * bien, pero se ve muy plano». La escena de la 05 (un documento llega a la mesa y el corrector señala
 * «Puno») con volumen, fluidez y detalle:
 *
 *   - espacio: mesa de madera en perspectiva (CSS 3D); la cámara se acerca y, al final, se abre;
 *   - luz: una lámpara que se enciende y tiembla con el golpe; su charco cálido y un relleno frío;
 *     el haz con polvo, y polvo cerca de la cámara, desenfocado;
 *   - sombras: blandas que dicen la altura, y de contacto, que apoyan las cosas en la mesa;
 *   - movimiento con física (movimiento.ts): la hoja planea, el libro golpea, la pluma escribe;
 *   - desenfoque de movimiento solo en lo que va rápido (obturador de 180°): lo quieto no cuesta;
 *   - detalle: hoja doblada en tres con borde irregular; libro con tapas que sobresalen, lomo con
 *     nervios y cinta; la pluma del catálogo; el grano del canal (Atmosfera).
 *
 * v3 (veredicto de Gerson: «falta contexto: una mesa, una lámpara, la luz»): abre en plano amplio con el
 * escritorio entero (tapa, canto, faldón con cajón, patas), la pared con un estante en la penumbra y la
 * lámpara de banquero que se enciende con su cadenita; el haz sale de su pantalla (`proyectar`). Una
 * pila de libros en la esquina reemplaza los lomos desenfocados pegados a la cámara.
 *
 * Beats: ver `B` en movimiento.ts. Contenido: escritura asémica salvo «Puno», como en la 05.
 */

const capa3d: React.CSSProperties = { position: 'absolute', transformStyle: 'preserve-3d' };
const lleno: React.CSSProperties = { position: 'absolute', inset: 0 };
const BORDE = bordePapel(61, 0, 0, DOC.w, DOC.h, 1.6);
const MADERA = mezclar(PALETA.ocre, PALETA.fondo, 0.66);
const CUERO = mezclar(PALETA.verde, PALETA.fondo, 0.45);

/** Sombra blanda en la mesa de algo que está a `alto` px: se corre lejos de la luz, se agranda, se ablanda y se aclara. */
const sombra = (cx: number, cy: number, alto: number, tiembla: number) => {
  const dx = cx - (LAMPARA.x + tiembla);
  const dy = cy - LAMPARA.y;
  const d = Math.hypot(dx, dy) || 1;
  const corre = alto * 0.55;
  return {
    x: (dx / d) * corre + 10,
    y: (dy / d) * corre + 14,
    blur: 10 + alto * 0.09,
    escala: 1 + alto * 0.0006,
    opacidad: 0.62 * (1 - clamp(alto / 900)) + 0.1,
  };
};

export const MesaConVolumen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cam = camara(t);
  const luz = luzDe(t);
  const tiembla = temblor(t);

  // la hoja, el libro y la pluma, con su estela (una copia si están quietos)
  const docVisible = t >= B.caeDoc;
  const copiasDoc = docVisible ? estela(posDoc, t, fps, 8).map(estadoDoc).sort((a, b) => a.alto - b.alto) : [];
  const doc = estadoDoc(t);
  const libroVisible = t >= B.caeLibro - 0.05;
  const copiasLibro = libroVisible ? estela(posLibro, t, fps, 12).map(estadoLibro).sort((a, b) => a.alto - b.alto) : [];
  const libro = estadoLibro(t);
  const pluma = estadoPluma(t);
  const copiasPluma = pluma.visible ? estela(posPluma, t, fps, 16).map(estadoPluma) : [];

  const sDoc = sombra(doc.x + DOC.w / 2, doc.y + DOC.h / 2, doc.alto, tiembla);
  const sLibro = sombra(LIBRO.x + LIBRO.w / 2, LIBRO.y + LIBRO.h / 2 + libro.dy, libro.alto, tiembla);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0b0a09', overflow: 'hidden' }}>
      {/* sonido: el cuarto, la lámpara, la hoja, el golpe, la pluma */}
      <Sequence layout="none" name="ambiente cuarto">
        <Audio src={ambiente('cuarto')} volume={(f) => 0.32 * interpolate(f, [0, 20, 280, 300], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      </Sequence>
      <Sfx nombre="tic" en={B.enciende} fps={fps} volumen={0.45} />
      <Sfx nombre="hoja" en={B.tocaDoc - 0.1} fps={fps} volumen={0.5} />
      <Sfx nombre="golpe" en={B.tocaLibro} fps={fps} volumen={0.85} />
      <Sfx nombre="pluma" en={B.escribe} fps={fps} volumen={0.5} dura={0.7} />

      {/* Tres escenas 3D con la misma cámara, en orden fijo: la pared (siempre detrás), la mesa con lo que
          pasa en ella, y la lámpara (encima). Chrome no ordenaba bien el piso del escritorio contra el plano
          vertical de la lámpara: al acercarse la cámara, el piso la tapaba (probado: sin piso se ve entera).
          En esta coreografía nada pasa por delante de la lámpara en pantalla. */}
      <Espacio cam={cam}><Pared luz={luz} /></Espacio>
      <Espacio cam={cam}>
          {/* el piso, plano (sin preserve-3d): mesa, luz y sombras van juntas a z = 0 y los objetos en 3D
              siempre quedan encima (si no, Chrome a veces ordena una sombra sobre el papel) */}
          {/* el piso del escritorio: mesa, luz y sombras, en una capa plana */}
          {[0].map((k) => (
            <div key={k} style={{ ...lleno, clipPath: `inset(${ESCRITORIO.y0}px ${MESA.w - ESCRITORIO.x1}px ${MESA.h - ESCRITORIO.y1}px ${ESCRITORIO.x0}px)` }}>
            <div style={lleno}>
            <div style={{ ...lleno, backgroundColor: MADERA, backgroundImage: `url(${textura.madera})`, backgroundSize: '1300px 1300px', backgroundBlendMode: 'multiply' }} />
              {/* lo que la lámpara no alcanza queda a oscuras; antes de encenderse, todo */}
              <div style={{ ...lleno, background: `radial-gradient(ellipse 1500px 1250px at ${LAMPARA.x + tiembla}px ${LAMPARA.y + tiembla * 0.6}px, rgba(0,0,0,${mix(0.82, 0.08, luz)}) 0%, rgba(0,0,0,${mix(0.86, 0.5, luz)}) 45%, rgba(0,0,0,${mix(0.9, 0.86, luz)}) 75%)` }} />
              <div style={{ ...lleno, background: `radial-gradient(ellipse 1100px 900px at ${LAMPARA.x + tiembla}px ${LAMPARA.y + tiembla * 0.6}px, ${alfa(PALETA.ocre, 0.22 * luz)} 0%, rgba(0,0,0,0) 70%)` }} />
              {/* relleno frío desde la derecha: separa las sombras del negro */}
              <div style={{ ...lleno, background: `radial-gradient(ellipse 1300px 1100px at 3100px 500px, ${alfa(PALETA.verde, 0.05 + 0.07 * luz)} 0%, rgba(0,0,0,0) 70%)` }} />
  
              {/* sombras blandas (dicen la altura) */}
              {docVisible ? (
                <div style={{ position: 'absolute', left: DOC.x, top: DOC.y, width: DOC.w, height: DOC.h,
                  transform: `translate(${doc.x - DOC.x + sDoc.x}px, ${doc.y - DOC.y + sDoc.y}px) rotate(${doc.giro}deg) scale(${sDoc.escala})`,
                  background: alfa('#000000', sDoc.opacidad * mix(0.4, 1, luz)), filter: `blur(${sDoc.blur}px)`, borderRadius: 6 }} />
              ) : null}
              {libroVisible ? (
                <div style={{ position: 'absolute', left: LIBRO.x, top: LIBRO.y, width: LIBRO.w, height: LIBRO.h,
                  transform: `translate(${sLibro.x + 26}px, ${sLibro.y + 30 + libro.dy}px) rotate(4deg) scale(${sLibro.escala})`,
                  background: alfa('#000000', (sLibro.opacidad + 0.12) * mix(0.4, 1, luz)), filter: `blur(${sLibro.blur * 0.8}px)`, borderRadius: 8 }} />
              ) : null}
              {/* sombras de contacto: lo que toca la mesa, se apoya en ella */}
              {docVisible ? (
                <div style={{ position: 'absolute', left: DOC.x - 3, top: DOC.y - 3, width: DOC.w + 6, height: DOC.h + 6,
                  transform: `translate(${doc.x - DOC.x + 3}px, ${doc.y - DOC.y + 4}px) rotate(${doc.giro}deg)`,
                  background: alfa('#000000', 0.45 * (1 - clamp(doc.alto / 14))), filter: 'blur(3px)', borderRadius: 4 }} />
              ) : null}
              {libroVisible ? (
                <div style={{ position: 'absolute', left: LIBRO.x - 4, top: LIBRO.y - 4, width: LIBRO.w + 8, height: LIBRO.h + 8,
                  transform: `translate(4px, ${libro.dy + 6}px) rotate(4deg)`,
                  background: alfa('#000000', 0.8 * (1 - clamp(libro.alto / 24))), filter: 'blur(4px)', borderRadius: 6 }} />
              ) : null}
              {/* la base de la lámpara y la pila de libros, apoyadas */}
              <div style={{ position: 'absolute', left: LAMPARA_3D.x - 280 + tiembla * 0.3, top: LAMPARA_3D.y - 90, width: 560, height: 150,
                background: `radial-gradient(ellipse at 50% 45%, ${alfa('#000000', 0.75)} 0%, rgba(0,0,0,0) 70%)` }} />
              {PILA.filter((g) => !g.sobre).map((g, i) => (
                <div key={i} style={{ position: 'absolute', left: g.x, top: g.y, width: g.w, height: g.h, transform: `translate(30px, 46px) rotate(${g.giro}deg)`,
                  background: alfa('#000000', 0.7 * mix(0.4, 1, luz)), filter: 'blur(26px)', borderRadius: 8 }} />
              ))}
              {PILA.filter((g) => !g.sobre).map((g, i) => (
                <div key={`c${i}`} style={{ position: 'absolute', left: g.x - 4, top: g.y - 4, width: g.w + 8, height: g.h + 8, transform: `translate(4px, 6px) rotate(${g.giro}deg)`,
                  background: alfa('#000000', 0.8), filter: 'blur(4px)', borderRadius: 6 }} />
              ))}
            </div>
            </div>
          ))}

          {/* el mueble: canto de la tapa, faldón con su cajón, patas; detrás, la pared con un estante */}
          <Escritorio luz={luz} />
          {PILA.map((g, i) => (
            <Libro key={`p${i}`} g={{ ...g, cuero: i === 0 ? mezclar(PALETA.ocre, PALETA.fondo, g.tono) : mezclar(PALETA.verde, PALETA.fondo, g.tono) }}
              e={{ alto: g.sobre ?? 0, dy: 0, golpe: { sx: 1, sy: 1 } }} alfaCopia={1} luz={luz} />
          ))}

          {/* la hoja y su estela (ordenada de abajo arriba: así cada copia pesa lo mismo) */}
          {copiasDoc.map((e, i) => (
            <Hoja key={i} e={e} indice={i} alfaCopia={1 / (i + 1)} luz={luz} subraya={pluma.traza}
              pluma={copiasDoc.length === 1 && copiasPluma.length > 0 ? (
                <>
                  {copiasPluma.map((p, k) => (
                    <Pluma key={k} id={`lab06-pluma-${k}`} x={p.x} y={p.y} alzada={p.alzada} paleta={PALETA} escala={1.45} angulo={32} opacidad={1 / (k + 1)} />
                  ))}
                </>
              ) : null} />
          ))}

          {/* el libro y su estela */}
          {copiasLibro.map((e, i) => <Libro key={i} g={{ ...LIBRO, giro: 4, cuero: CUERO }} e={e} alfaCopia={1 / (i + 1)} luz={luz} />)}
      </Espacio>
      <Espacio cam={cam}><Lampara t={t} luz={luz} tiembla={tiembla} /></Espacio>

      {/* el haz de la lámpara y el polvo que flota en él */}
      <Haz t={t} luz={luz} golpe={B.tocaLibro} cam={cam} tiembla={tiembla} />
      {/* polvo cerca de la cámara, fuera de foco (se mueve más que la mesa) */}
      <PolvoCercano t={t} luz={luz} camara={cam.acerca - cam.abre * 0.5} />
      {/* el grano y la viñeta del canal */}
      <Atmosfera grano={0.07} vineta={0.6} />
    </AbsoluteFill>
  );
};

/** La perspectiva de la cámara y el plano de la mesa: todo lo que va adentro se ubica en px de la mesa. */
const Espacio: React.FC<{ cam: ReturnType<typeof camara>; children: React.ReactNode }> = ({ cam, children }) => (
  <AbsoluteFill style={{ perspective: PERSPECTIVA, perspectiveOrigin: '50% 30%' }}>
    <div style={{ ...capa3d, left: 960 - MESA.w / 2, top: 540 - MESA.h / 2, width: MESA.w, height: MESA.h,
      transform: `translateY(${cam.y + 180}px) translateZ(${cam.z}px) rotateX(${cam.inclina}deg)` }}>
      {children}
    </div>
  </AbsoluteFill>
);

/** La hoja: doblada en tres, con borde irregular, la luz que cambia cuando se inclina y, si la hay, la pluma encima. */
const Hoja: React.FC<{ e: EstadoHoja; indice: number; alfaCopia: number; luz: number; subraya: number; pluma: React.ReactNode }> = ({ e, indice, alfaCopia, luz, subraya, pluma }) => {
  // inclinada hacia la lámpara (atrás a la izquierda) se aclara; hacia la cámara o a la derecha, se oscurece
  const sombreado = clamp(0.05 + 0.01 * e.inclinaY - 0.006 * e.inclinaX, 0, 0.35);
  return (
    <div style={{ ...capa3d, left: DOC.x, top: DOC.y, width: DOC.w, height: DOC.h,
      transform: `translate3d(${e.x - DOC.x}px, ${e.y - DOC.y}px, ${e.alto + 2}px) rotateZ(${e.giro}deg)` }}>
      <div style={{ ...capa3d, inset: 0, transformOrigin: '50% 100%', transform: `rotateX(${e.soplo}deg)` }}>
        <div style={{ ...capa3d, inset: 0, transform: `rotateX(${e.inclinaX}deg) rotateY(${e.inclinaY}deg)` }}>
          <div style={{ ...lleno, opacity: alfaCopia, clipPath: `path('${BORDE}')` }}>
            <Papel color={PALETA.papel} envejecido={0.45} />
            <svg width={DOC.w} height={DOC.h} style={{ position: 'absolute', inset: 0 }}>
              <defs><FiltroTinta id={`lab06-tinta-${indice}`} /></defs>
              <g filter={`url(#lab06-tinta-${indice})`} fill="none" stroke={alfa(PALETA.fondo, 0.78)} strokeWidth={1.7} strokeLinecap="round">
                {Array.from({ length: 14 }, (_, i) => {
                  const y = 110 + i * RENGLON;
                  if (i === PALABRA.renglon) return <path key={i} d={trazoManuscrito(600 + i, 205, y, 330, 15)} />;
                  return <path key={i} d={trazoManuscrito(600 + i, 70, y, i === 13 ? 240 : 480, 15)} />;
                })}
              </g>
              <text x={PALABRA.x} y={110 + PALABRA.renglon * RENGLON} fontFamily={fuente.caligrafia} fontSize={46} fill={alfa(PALETA.fondo, 0.92)}>Puno</text>
              {/* el rojo de corrector: va justo detrás de la punta de la pluma */}
              <path d={SUBRAYADO} stroke={PALETA.rojo} strokeWidth={4.5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - subraya} opacity={0.92} />
            </svg>
            {/* doblada en tres: el tercio de arriba mira a la lámpara, el de abajo no; cada pliegue con su filo de luz */}
            <div style={{ ...lleno, background: `linear-gradient(180deg,
              rgba(255,244,220,0.06) 0%, rgba(255,244,220,0.02) 33%, rgba(0,0,0,0.13) 33.4%, rgba(0,0,0,0.02) 36%,
              rgba(0,0,0,0) 66%, rgba(255,246,226,0.12) 66.4%, rgba(0,0,0,0.03) 67.5%, rgba(0,0,0,0.08) 100%)` }} />
            {/* la luz viene de atrás a la izquierda */}
            <div style={{ ...lleno, background: `linear-gradient(150deg, rgba(0,0,0,0) 0%, ${alfa('#000000', 0.36)} 100%)`, opacity: mix(1, 0.75, luz) }} />
            <div style={{ ...lleno, background: '#000', opacity: mix(0.82, sombreado, luz) }} />
          </div>
          {pluma ? (
            <svg width={DOC.w} height={DOC.h} style={{ position: 'absolute', inset: 0, overflow: 'visible', transform: 'translateZ(1px)' }}>{pluma}</svg>
          ) : null}
        </div>
      </div>
    </div>
  );
};

/** Una cara del libro: su color, lo que lleva encima y cuánto la oscurece la luz. */
const Cara: React.FC<{ estilo: React.CSSProperties; oscuro: number; alfaCopia: number; children?: React.ReactNode }> = ({ estilo, oscuro, alfaCopia, children }) => (
  <div style={{ position: 'absolute', opacity: alfaCopia, ...estilo }}>
    {children}
    <div style={{ ...lleno, background: '#000', opacity: oscuro, borderRadius: estilo.borderRadius }} />
  </div>
);

const TAPA = 6; // grosor de cada tapa
const CEJA = 8; // cuánto sobresalen las tapas del bloque de hojas
const HOJAS = (dir: string) => `repeating-linear-gradient(${dir}, ${mezclar(PALETA.papel, PALETA.ocre, 0.3)} 0px, ${mezclar(PALETA.papel, PALETA.ocre, 0.3)} 2.4px, ${mezclar(PALETA.papel, '#000000', 0.32)} 3.2px)`;

type Geometria = { x: number; y: number; w: number; h: number; grosor: number; giro: number; cuero: string };

/** Un libro: dos tapas que sobresalen del bloque de hojas, lomo redondeado con nervios y una cinta. */
const Libro: React.FC<{ g: Geometria; e: EstadoLibro; alfaCopia: number; luz: number }> = ({ g, e, alfaCopia, luz }) => {
  const { w: W, h: H, grosor: G } = g;
  const CUERO = g.cuero;
  const s = Math.sqrt(e.golpe.sx);
  const o = (enLuz: number) => mix(0.85, enLuz, luz);
  const bordeTapa = (z: number) => [
    // canto de la tapa hacia la cámara y hacia la lámpara
    <Cara key={`f${z}`} alfaCopia={alfaCopia} oscuro={o(0.4)} estilo={{ left: 0, top: H, width: W, height: TAPA, transformOrigin: '50% 0', transform: `translateZ(${z}px) rotateX(90deg)`, backgroundColor: mezclar(CUERO, PALETA.ocre, 0.12) }} />,
    <Cara key={`i${z}`} alfaCopia={alfaCopia} oscuro={o(0.18)} estilo={{ left: -TAPA, top: 0, width: TAPA, height: H, transformOrigin: '100% 50%', transform: `translateZ(${z}px) rotateY(90deg)`, backgroundColor: mezclar(CUERO, PALETA.ocre, 0.12) }} />,
  ];
  return (
    <div style={{ ...capa3d, left: g.x, top: g.y, width: W, height: H, transformOrigin: '50% 50% 0',
      transform: `translate3d(0px, ${e.dy}px, ${e.alto + 2}px) rotateZ(${g.giro}deg) scale3d(${s}, ${s}, ${e.golpe.sy})` }}>
      {/* tapa de arriba */}
      <Cara alfaCopia={alfaCopia} oscuro={o(0)} estilo={{ left: 0, top: 0, width: W, height: H, transform: `translateZ(${G}px)`, borderRadius: 3, overflow: 'hidden',
        backgroundColor: CUERO, backgroundImage: `url(${textura.papel})`, backgroundSize: '700px 700px', backgroundBlendMode: 'multiply' }}>
        <div style={{ position: 'absolute', inset: 24, border: `2px solid ${alfa(PALETA.ocre, 0.42)}`, borderRadius: 2 }} />
        <div style={{ position: 'absolute', inset: 32, border: `1px solid ${alfa(PALETA.ocre, 0.25)}`, borderRadius: 2 }} />
        {/* esquinas gastadas por el uso */}
        <div style={{ ...lleno, background: `radial-gradient(circle at 0% 0%, ${alfa(PALETA.ocre, 0.35)} 0px, rgba(0,0,0,0) 40px),
          radial-gradient(circle at 100% 0%, ${alfa(PALETA.ocre, 0.25)} 0px, rgba(0,0,0,0) 34px),
          radial-gradient(circle at 0% 100%, ${alfa(PALETA.ocre, 0.3)} 0px, rgba(0,0,0,0) 38px),
          radial-gradient(circle at 100% 100%, ${alfa(PALETA.ocre, 0.22)} 0px, rgba(0,0,0,0) 30px)` }} />
        <div style={{ ...lleno, background: `linear-gradient(150deg, ${alfa(PALETA.ocre, 0.24)} 0%, rgba(0,0,0,0) 45%, ${alfa('#000000', 0.45)} 100%)` }} />
      </Cara>
      {bordeTapa(G - TAPA)}
      {bordeTapa(0)}
      {/* el bloque de hojas, metido CEJA px bajo las tapas */}
      <Cara alfaCopia={alfaCopia} oscuro={o(0.3)} estilo={{ left: CEJA, top: H - CEJA, width: W - CEJA, height: G - 2 * TAPA, transformOrigin: '50% 0', transform: `translateZ(${TAPA}px) rotateX(90deg)`, background: HOJAS('0deg') }} />
      <Cara alfaCopia={alfaCopia} oscuro={o(0.12)} estilo={{ left: CEJA - (G - 2 * TAPA), top: CEJA, width: G - 2 * TAPA, height: H - 2 * CEJA, transformOrigin: '100% 50%', transform: `translateZ(${TAPA}px) rotateY(90deg)`, background: HOJAS('90deg') }} />
      {/* la cinta: sale de entre las hojas y cuelga */}
      <Cara alfaCopia={alfaCopia} oscuro={o(0.25)} estilo={{ left: W * 0.62, top: H - CEJA, width: 13, height: 46, transformOrigin: '50% 0', transform: `translateZ(${G / 2}px) rotateX(-38deg)`,
        background: `linear-gradient(90deg, ${mezclar(PALETA.ocre, PALETA.fondo, 0.5)}, ${mezclar(PALETA.ocre, PALETA.fondo, 0.3)} 50%, ${mezclar(PALETA.ocre, PALETA.fondo, 0.55)})`,
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)' }} />
      {/* lomo (a la derecha, a la sombra): redondeado, con nervios y el borde frío de la luz de relleno */}
      <Cara alfaCopia={alfaCopia} oscuro={o(0.38)} estilo={{ left: W, top: 0, width: G, height: H, transformOrigin: '0 50%', transform: 'rotateY(-90deg)', borderRadius: 8,
        background: `linear-gradient(180deg, rgba(0,0,0,0) 17%, ${alfa(PALETA.ocre, 0.2)} 18%, rgba(0,0,0,0.35) 20%, rgba(0,0,0,0) 21%,
          rgba(0,0,0,0) 37%, ${alfa(PALETA.ocre, 0.2)} 38%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0) 41%,
          rgba(0,0,0,0) 57%, ${alfa(PALETA.ocre, 0.2)} 58%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0) 61%,
          rgba(0,0,0,0) 77%, ${alfa(PALETA.ocre, 0.2)} 78%, rgba(0,0,0,0.35) 80%, rgba(0,0,0,0) 81%),
          linear-gradient(90deg, ${mezclar(CUERO, '#000000', 0.55)} 0%, ${mezclar(CUERO, PALETA.verde, 0.35)} 55%, ${mezclar(CUERO, '#000000', 0.4)} 100%)` }} />
    </div>
  );
};

const POLVO = (() => {
  const a = azar(606);
  return Array.from({ length: 110 }, () => ({
    x: a.rango(0, 1), y: a.rango(0, 1), r: a.rango(1.0, 3.2), fase: a.rango(0, Math.PI * 2),
    vel: a.rango(0.15, 0.5), brillo: a.rango(0.35, 1),
  }));
})();

type Camara = ReturnType<typeof camara>;

/**
 * El haz: el cono de luz que sale de la pantalla de la lámpara y cae en el charco, con el polvo que flota
 * en él y salta con el golpe. Se dibuja en 2D, en los puntos que da `proyectar` para esta cámara.
 */
const Haz: React.FC<{ t: number; luz: number; golpe: number; cam: Camara; tiembla: number }> = ({ t, luz, golpe, cam, tiembla }) => {
  const L = LAMPARA_3D;
  const arribaI = proyectar(L.x - L.largo / 2 + 40 + tiembla, L.y, L.altoPantalla, cam);
  const arribaD = proyectar(L.x + L.largo / 2 - 40 + tiembla, L.y, L.altoPantalla, cam);
  const abajoI = proyectar(LAMPARA.x - 720, LAMPARA.y + 480, 0, cam);
  const abajoD = proyectar(LAMPARA.x + 720, LAMPARA.y + 480, 0, cam);
  const k = (arribaI.escala + abajoI.escala) / 2; // tamaño del polvo según lo lejos que está
  const empuje = t > golpe ? (1 - Math.exp(-(t - golpe) * 4)) * Math.exp(-(t - golpe) * 0.7) : 0;
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', pointerEvents: 'none', opacity: luz }}>
      <svg width={1920} height={1080}>
        <defs>
          <linearGradient id="lab06-haz" gradientUnits="userSpaceOnUse" x1={0} y1={arribaI.y} x2={0} y2={abajoI.y}>
            <stop offset="0" stopColor={PALETA.ocre} stopOpacity={0.4} />
            <stop offset="0.6" stopColor={PALETA.ocre} stopOpacity={0.12} />
            <stop offset="1" stopColor={PALETA.ocre} stopOpacity={0} />
          </linearGradient>
          <radialGradient id="lab06-foco">
            <stop offset="0" stopColor={PALETA.papel} stopOpacity={0.5} />
            <stop offset="0.4" stopColor={PALETA.ocre} stopOpacity={0.2} />
            <stop offset="1" stopColor={PALETA.ocre} stopOpacity={0} />
          </radialGradient>
          <filter id="lab06-suave"><feGaussianBlur stdDeviation={30 * k} /></filter>
        </defs>
        <polygon points={`${arribaI.x},${arribaI.y} ${arribaD.x},${arribaD.y} ${abajoD.x},${abajoD.y} ${abajoI.x},${abajoI.y}`} fill="url(#lab06-haz)" filter="url(#lab06-suave)" />
        {/* el brillo bajo la pantalla, donde sale la luz */}
        <ellipse cx={(arribaI.x + arribaD.x) / 2} cy={arribaI.y + 10 * k} rx={(arribaD.x - arribaI.x) * 0.6} ry={70 * k} fill="url(#lab06-foco)" />
        {POLVO.map((p, i) => {
          const v = (p.y + t * 0.012 * p.vel) % 1;
          const xa = mix(arribaI.x, abajoI.x, v);
          const xb = mix(arribaD.x, abajoD.x, v);
          let x = mix(xa, xb, p.x) + Math.sin(t * p.vel * 1.3 + p.fase) * 14 * k;
          let y = mix(mix(arribaI.y, arribaD.y, p.x), mix(abajoI.y, abajoD.y, p.x), v) + Math.cos(t * p.vel + p.fase) * 10 * k;
          // el golpe del libro sopla el polvo de abajo hacia arriba y hacia afuera
          const cerca = clamp((v - 0.45) / 0.55);
          y -= empuje * cerca * 90 * p.brillo * k;
          x += empuje * cerca * (p.x - 0.5) * 120 * k;
          const borde = Math.sin(Math.PI * clamp(p.x));
          return <circle key={i} cx={x} cy={y} r={p.r * Math.max(0.5, k)} fill={PALETA.papel} opacity={0.55 * p.brillo * borde * (1 - v * 0.5)} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

const CERCANO = (() => {
  const a = azar(707);
  return Array.from({ length: 9 }, () => ({ x: a.rango(0.05, 0.75), y: a.rango(0.05, 0.7), r: a.rango(14, 42), fase: a.rango(0, Math.PI * 2), vel: a.rango(0.1, 0.3) }));
})();

/** Polvo muy cerca de la cámara: grande, blando y lento. Da profundidad delante de todo. */
const PolvoCercano: React.FC<{ t: number; luz: number; camara: number }> = ({ t, luz, camara }) => (
  <AbsoluteFill style={{ mixBlendMode: 'screen', pointerEvents: 'none', opacity: luz }}>
    <svg width={1920} height={1080}>
      <defs>
        <radialGradient id="lab06-cercano">
          <stop offset="0" stopColor={PALETA.papel} stopOpacity={0.16} />
          <stop offset="0.6" stopColor={PALETA.ocre} stopOpacity={0.08} />
          <stop offset="1" stopColor={PALETA.ocre} stopOpacity={0} />
        </radialGradient>
      </defs>
      {CERCANO.map((p, i) => (
        <circle key={i} r={p.r} fill="url(#lab06-cercano)"
          cx={p.x * 1920 - camara * 140 + Math.sin(t * p.vel + p.fase) * 30}
          cy={p.y * 1080 + Math.cos(t * p.vel * 0.8 + p.fase) * 22 - t * 6} />
      ))}
    </svg>
  </AbsoluteFill>
);

/** Una cara vertical del mueble, de pie sobre la línea y = `y` (mira a la cámara) o colgando bajo la tapa. */
const caraVertical = (x: number, y: number, w: number, desdeZ: number, alto: number, hacia: 'arriba' | 'abajo'): React.CSSProperties => ({
  position: 'absolute', left: x, top: hacia === 'arriba' ? y - alto : y, width: w, height: alto,
  transformOrigin: hacia === 'arriba' ? '50% 100%' : '50% 0',
  transform: `translateZ(${desdeZ}px) rotateX(-90deg)`,
});

/** El escritorio como mueble: el canto de la tapa, el faldón con su cajón y tirador, las patas que se pierden en lo oscuro. */
const Escritorio: React.FC<{ luz: number }> = ({ luz }) => {
  const E = ESCRITORIO;
  const madera = { backgroundColor: MADERA, backgroundImage: `url(${textura.madera})`, backgroundSize: '1300px 1300px', backgroundBlendMode: 'multiply' as const };
  return (
    <>
      {/* canto de la tapa: con su filo de luz arriba */}
      <div style={{ ...caraVertical(E.x0, E.y1, E.x1 - E.x0, 0, E.grosor, 'abajo'), ...madera }}>
        <div style={{ ...lleno, background: `linear-gradient(180deg, ${alfa(PALETA.ocre, 0.35 * luz)} 0px, rgba(0,0,0,0) 6px), #000`, opacity: mix(0.9, 0.5, luz), mixBlendMode: 'normal' }} />
      </div>
      {/* faldón con el cajón, metido bajo la tapa */}
      <div style={{ ...caraVertical(E.x0 + 70, E.y1 - 40, E.x1 - E.x0 - 140, -E.grosor, E.faldon, 'abajo'), ...madera }}>
        <div style={{ position: 'absolute', left: '50%', top: 40, width: 760, height: 230, marginLeft: -380, border: `3px solid ${alfa('#000000', 0.55)}`, borderRadius: 4,
          boxShadow: `inset 0 2px 0 ${alfa(PALETA.ocre, 0.25)}` }} />
        <div style={{ position: 'absolute', left: '50%', top: 140, width: 90, height: 26, marginLeft: -45, borderRadius: 13,
          background: `linear-gradient(180deg, ${mezclar(PALETA.ocre, PALETA.papel, 0.35)}, ${mezclar(PALETA.ocre, '#000000', 0.45)})` }} />
        <div style={{ ...lleno, background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.85) 100%)', opacity: mix(1, 0.85, luz) }} />
      </div>
      {/* patas */}
      {[E.x0 + 30, E.x1 - 130].map((x) => (
        <div key={x} style={{ ...caraVertical(x, E.y1 - 30, 100, -E.grosor, 1100, 'abajo'), ...madera }}>
          <div style={{ ...lleno, background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(11,10,9,1) 70%)' }} />
        </div>
      ))}
    </>
  );
};

const ESTANTE = (() => {
  const a = azar(808);
  const lomos: { x: number; w: number; h: number; c: string }[] = [];
  let x = 2100;
  while (x < 3100) {
    const w = a.rango(38, 86);
    lomos.push({ x, w, h: a.rango(200, 320), c: mezclar(a.elegir([PALETA.verde, PALETA.ocre, PALETA.papel, PALETA.fondo]), '#000000', a.rango(0.55, 0.8)) });
    x += w + a.rango(2, 8);
  }
  return lomos;
})();

/** La pared detrás del escritorio: revoque oscuro, la luz de la lámpara que sube un poco, un estante en la penumbra. */
const Pared: React.FC<{ luz: number }> = ({ luz }) => {
  const ALTO = 2400;
  const base = ALTO; // y del pie de la pared en sus coordenadas
  return (
    <div style={{ ...caraVertical(0, ESCRITORIO.y0, MESA.w, 0, ALTO, 'arriba'),
      backgroundColor: mezclar(PALETA.fondo, PALETA.ocre, 0.22), backgroundImage: `url(${textura.papel})`, backgroundSize: '900px 900px', backgroundBlendMode: 'multiply' }}>
      {/* el estante: tabla y lomos */}
      {ESTANTE.map((l, i) => (
        <div key={i} style={{ position: 'absolute', left: l.x, top: base - 720 - l.h, width: l.w, height: l.h, backgroundColor: l.c, borderRadius: 3,
          boxShadow: `inset 6px 0 10px ${alfa('#000000', 0.5)}` }} />
      ))}
      <div style={{ position: 'absolute', left: 2050, top: base - 720, width: 1100, height: 30, backgroundColor: mezclar(MADERA, '#000000', 0.3) }} />
      {/* la luz: cálida cerca de la lámpara, el resto a oscuras */}
      <div style={{ ...lleno, background: `radial-gradient(ellipse 1500px 1100px at ${LAMPARA_3D.x}px ${base - 250}px, ${alfa(PALETA.ocre, 0.28 * luz)} 0%, rgba(0,0,0,0) 70%)` }} />
      <div style={{ ...lleno, background: `radial-gradient(ellipse 2400px 1500px at ${LAMPARA_3D.x}px ${base - 200}px, rgba(0,0,0,${mix(0.9, 0.15, luz)}) 0%, rgba(0,0,0,${mix(0.93, 0.7, luz)}) 55%, rgba(0,0,0,0.92) 100%)` }} />
    </div>
  );
};

/**
 * La lámpara de banquero: base y vara de bronce, pantalla de vidrio verde (oscura apagada; encendida, la
 * luz la atraviesa y su borde de abajo brilla) y la cadenita que se jala y se mece. Dibujada en un plano
 * vertical, vista desde unos 35° arriba (como la mira esta cámara).
 */
const Lampara: React.FC<{ t: number; luz: number; tiembla: number }> = ({ t, luz, tiembla }) => {
  const L = LAMPARA_3D;
  const ANCHO = 900;
  const c = cadena(t);
  const bronce = (k: number) => mezclar(mezclar(PALETA.ocre, '#000000', 0.55), mezclar(PALETA.ocre, PALETA.papel, 0.3), k);
  const vidrio = (k: number) => mezclar(mezclar(PALETA.verde, '#000000', 0.55), mezclar(PALETA.verde, PALETA.papel, 0.25), k);
  const pb = -L.altoPantalla; // borde de abajo de la pantalla (y local)
  const pantalla = `M ${-L.largo / 2} ${pb} C ${-L.largo / 2 - 12} ${pb - 70}, ${-L.largo / 2 + 30} ${pb - 160}, ${-L.largo / 2 + 120} ${pb - 172}
    L ${L.largo / 2 - 120} ${pb - 172} C ${L.largo / 2 - 30} ${pb - 160}, ${L.largo / 2 + 12} ${pb - 70}, ${L.largo / 2} ${pb}
    Q 0 ${pb + 34} ${-L.largo / 2} ${pb} Z`;
  return (
    <div style={{ ...caraVertical(L.x - ANCHO / 2, L.y, ANCHO, 0, L.alto, 'arriba') }}>
      <svg width={ANCHO} height={L.alto} viewBox={`${-ANCHO / 2} ${-L.alto} ${ANCHO} ${L.alto}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="lab06-bronce" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={bronce(0.15)} />
            <stop offset="0.35" stopColor={bronce(0.4 + 0.5 * luz)} />
            <stop offset="0.55" stopColor={bronce(0.3)} />
            <stop offset="1" stopColor={bronce(0.05)} />
          </linearGradient>
          <linearGradient id="lab06-base" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={bronce(0.35 + 0.45 * luz)} />
            <stop offset="1" stopColor={bronce(0.1)} />
          </linearGradient>
          <linearGradient id="lab06-vidrio" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={vidrio(0.15 + 0.2 * luz)} />
            <stop offset="0.25" stopColor={vidrio(0.45 + 0.15 * luz)} />
            <stop offset="0.5" stopColor={vidrio(0.1 + 0.45 * luz)} />
            <stop offset="1" stopColor={vidrio(0.05 + 0.75 * luz)} />
          </linearGradient>
          <filter id="lab06-brillo"><feGaussianBlur stdDeviation={9} /></filter>
        </defs>
        <g transform={`rotate(${tiembla * 0.12} 0 0)`}>
          {/* base: dos escalones de bronce */}
          <path d="M -240 -52 L -240 -18 Q -238 2 -205 4 L 205 4 Q 238 2 240 -18 L 240 -52 Z" fill={bronce(0.08)} />
          <ellipse cx={0} cy={-52} rx={240} ry={56} fill="url(#lab06-base)" />
          <path d="M -120 -70 L -120 -56 Q 0 -30 120 -56 L 120 -70 Z" fill={bronce(0.12)} />
          <ellipse cx={0} cy={-70} rx={120} ry={26} fill="url(#lab06-base)" />
          {/* vara con su anillo */}
          <rect x={-15} y={pb + 28} width={30} height={-pb - 98} fill="url(#lab06-bronce)" />
          <ellipse cx={0} cy={-420} rx={28} ry={9} fill={bronce(0.2 + 0.5 * luz)} />
          <rect x={-28} y={-420} width={56} height={14} fill="url(#lab06-bronce)" />
          {/* horquilla bajo la pantalla */}
          <path d={`M -70 ${pb + 30} Q 0 ${pb + 6} 70 ${pb + 30} L 70 ${pb + 16} Q 0 ${pb - 8} -70 ${pb + 16} Z`} fill={bronce(0.25 + 0.4 * luz)} />
          {/* la cadenita del interruptor */}
          <g transform={`rotate(${c.mece} 110 ${pb + 18})`}>
            <line x1={110} y1={pb + 18} x2={110} y2={pb + 170 + c.jala} stroke={bronce(0.5 + 0.4 * luz)} strokeWidth={4} strokeDasharray="5 3" />
            <circle cx={110} cy={pb + 180 + c.jala} r={11} fill={bronce(0.4 + 0.5 * luz)} />
          </g>
          {/* pantalla de vidrio verde; encendida, la luz la atraviesa */}
          <path d={pantalla} fill="url(#lab06-vidrio)" />
          <path d={`M ${-L.largo / 2 + 110} ${pb - 150} L ${L.largo / 2 - 110} ${pb - 150}`} stroke={alfa(PALETA.papel, 0.12 + 0.18 * luz)} strokeWidth={10} strokeLinecap="round" />
          {/* el borde de abajo, por donde sale la luz */}
          <path d={`M ${-L.largo / 2} ${pb} Q 0 ${pb + 34} ${L.largo / 2} ${pb}`} fill="none" stroke={alfa(PALETA.papel, 0.9 * luz)} strokeWidth={14} filter="url(#lab06-brillo)" />
          <path d={`M ${-L.largo / 2} ${pb} Q 0 ${pb + 34} ${L.largo / 2} ${pb}`} fill="none" stroke={mezclar(PALETA.ocre, PALETA.papel, 0.4 + 0.5 * luz)} strokeWidth={5} />
          {/* remates de bronce en las puntas */}
          <ellipse cx={-L.largo / 2 + 4} cy={pb - 40} rx={12} ry={42} fill={bronce(0.2 + 0.5 * luz)} />
          <ellipse cx={L.largo / 2 - 4} cy={pb - 40} rx={12} ry={42} fill={bronce(0.15 + 0.3 * luz)} />
        </g>
      </svg>
    </div>
  );
};
