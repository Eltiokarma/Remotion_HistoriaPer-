import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { Atmosfera } from '../../../src/components/atmosfera/Atmosfera';
import { Luz } from '../../../src/components/atmosfera/Luz';
import { PrecargaTexturas } from '../../../src/components/atmosfera/PrecargaTexturas';
import { Sfx } from '../../../src/components/audio/Sfx';
import { Ficha } from '../../../src/components/texto/Ficha';
import { TrazoRojo } from '../../../src/components/texto/TrazoRojo';
import { fuente } from '../../../src/estilo/fuentes';
import { mix, tramo } from '../../../src/direction/anim';
import { F, FPS, Ffin, aVideo, aVoz, tramos, type Version } from './linea';

/**
 * Animatic de la escena 3 del episodio 0·2 («El expediente de Novoa»), sobre la voz real.
 * Cámara quieta en las tres versiones; cada versión cambia una sola variable:
 *  A · base: la cifra de Novoa entra como cualquier papel (se desliza, con halo, entre los demás).
 *  B · A + excepción reservada: la mesa se vacía en «Días después» y el vale queda solo, sin
 *      movimiento ni halo, durante el silencio.
 *  C · B + respiros de montaje al final de cada plano (storyboard.json, campo «respiro»).
 *  D · la elegida por Gerson (20 de noviembre de 2026): C, pero el vale entra deslizándose como en A
 *      (sin el halo), sobre la mesa ya vacía.
 * No es la escena terminada: es para decidir ritmo y énfasis antes de animar el resto.
 */

const PAPEL = '#efe6cf';
const TINTA = '#33251a';
const ROJO = '#a3322a';
const OCRE = '#c8a455';
const img = (n: string) => staticFile(`img/${n}.png`);
/** Sombra negra para todo texto claro sobre el fondo (indicación de Gerson, 20 de noviembre de 2026). */
const SOMBRA = 'drop-shadow(0 2px 3px rgba(0,0,0,.9)) drop-shadow(0 0 8px rgba(0,0,0,.55))';

type Pose = { x: number; y: number; w: number; o: number };
const pose = (x: number, y: number, w: number, o = 1): Pose => ({ x, y, w, o });
const mezcla = (a: Pose, b: Pose, k: number): Pose => ({ x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), w: mix(a.w, b.w, k), o: mix(a.o, b.o, k) });

/** Un papel de la galería con texto encima, en coordenadas del cuadro. `aspecto` = alto / ancho. */
const Papel = ({ src, p, aspecto, giro = 0, halo = 0, dueno, children }: { src: string; p: Pose; aspecto: number; giro?: number; halo?: number; dueno?: string; children?: ReactNode }) =>
  p.o <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: p.x, top: p.y, width: p.w, height: p.w * aspecto, opacity: p.o, transform: `rotate(${giro}deg)`,
      filter: `drop-shadow(12px 16px 12px rgba(0,0,0,.45))${halo > 0 ? ` drop-shadow(0 0 ${28 * halo}px rgba(222,184,105,${0.7 * halo}))` : ''}` }}>
      <Img src={src} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', inset: 0, containerType: 'inline-size' } as CSSProperties}>{children}</div>
      {dueno ? (
        <div style={{ position: 'absolute', left: 0, bottom: '100%', marginBottom: 12, whiteSpace: 'nowrap', fontFamily: fuente.mono, fontSize: 22,
          letterSpacing: '0.12em', color: PAPEL, filter: SOMBRA, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 9, height: 9, background: ROJO, display: 'inline-block' }} />{dueno}
        </div>
      ) : null}
    </div>
  );

/** Texto mecanografiado dentro de un papel: posición y tamaño en % del ancho del papel. */
const Renglon = ({ x, y, size, k, children, color = TINTA, familia = fuente.maquina, peso = 400, ancho = 80, centro = false }: { x: number; y: number; size: number; k: number; children: ReactNode; color?: string; familia?: string; peso?: number; ancho?: number; centro?: boolean }) =>
  k <= 0 ? null : (
    <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${ancho}%`, fontFamily: familia, fontWeight: peso, fontSize: `${size}cqw`, lineHeight: 1.15, color, opacity: k, textAlign: centro ? 'center' : 'left' }}>{children}</div>
  );

const FichaEn = ({ texto, x, y, voz, desde, hasta, foco = 1 }: { texto: string; x: number; y: number; voz: number; desde: number; hasta: number; foco?: number }) => (
  <div style={{ position: 'absolute', left: x, top: y, opacity: mix(0.45, 1, foco), filter: SOMBRA }}>
    <Ficha texto={texto} t={voz - desde} color={PAPEL} acento={ROJO} size={26} salida={tramo(voz, hasta, 0.5, 'natural')} />
  </div>
);

export const Animatic: React.FC<{ version: Version }> = ({ version }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { voz, plano } = aVoz(version, t);
  const reservada = version !== 'A';
  const entra = (a: number, d = 0.6) => tramo(voz, a, d, 'pesado');
  const sale = (a: number, d = 0.5) => 1 - tramo(voz, a, d, 'natural');

  // 3.1 · la carpeta de Novoa
  const carpeta = pose(150, 240, 1000, entra(0, 0.8) * sale(F(4)));
  // 3.2–3.5 · el folio de la gestión de Elías (en B y C se va con la mesa vacía y vuelve en 3.5)
  const eliasIn = entra(F(4) + 0.3);
  let elias = pose(mix(-500, 300, eliasIn), 250, 470, eliasIn);
  if (reservada) {
    elias = { ...elias, o: elias.o * sale(F(10), 0.8) };
    const vuelve = entra(F(12) + 0.2, 0.7);
    if (voz >= F(12)) elias = pose(mix(-500, 230, vuelve), 330, 400, vuelve);
  } else {
    elias = mezcla(elias, pose(230, 330, 400), tramo(voz, F(12), 0.9, 'pesado'));
  }
  elias = { ...elias, o: elias.o * sale(F(14), 0.6) };
  // 3.3 · la respuesta: fuera de plazo
  const respIn = entra(F(8) + 1);
  const respuesta = pose(mix(1920, 1140, respIn), 230, 470, respIn * (reservada ? sale(F(10), 0.8) : sale(F(12))));
  // 3.4 · el vale aprobado: en A entra como cualquier papel; en B y C, solo y quieto
  const valeA = pose(mix(1920, 600, entra(F(11) - 0.1, 0.7)), 560, 720, entra(F(11) - 0.1, 0.7));
  const valeB = pose(510, 250, 900, tramo(voz, F(11) - 0.05, 0.2, 'natural'));
  const valeD = pose(mix(1920, 510, entra(F(11) - 0.1, 0.7)), 250, 900, entra(F(11) - 0.1, 0.7));
  let vale = version === 'D' ? valeD : reservada ? valeB : valeA;
  vale = mezcla(vale, pose(860, 300, 820, vale.o), tramo(voz, F(12), 0.9, 'pesado'));
  vale = mezcla(vale, pose(170, 300, 820, vale.o), tramo(voz, F(14), 0.9, 'pesado'));
  const halo = reservada ? 0 : tramo(voz, F(11), 0.5, 'natural') * (0.6 + 0.4 * Math.sin(t * 3)) * (1 - tramo(voz, F(12), 0.5, 'natural'));
  const focoVale = 1 + 0.6 * tramo(voz, F(16) + 5.3, 0.4, 'natural');
  // 3.6 · lo que Novoa probablemente recibió
  const recIn = entra(F(14) + 0.6);
  const recibido = pose(mix(1920, 1190, recIn), 230, 470, recIn);

  const ecoTramos = tramos(version);
  const hojas = [0.2, F(4) + 0.3, F(8) + 1, ...(reservada && version !== 'D' ? [] : [F(11) - 0.1]), F(14) + 0.6, ...(reservada ? [F(12) + 0.2] : [])];
  return (
    <AbsoluteFill style={{ background: '#2a1d14' }}>
      <Img src={img('fondo-mesa-expediente')} style={{ position: 'absolute', inset: 0, width: 1920, height: 1080 }} />

      <Papel src={img('obj-07-carpeta-abierta')} p={carpeta} aspecto={1024 / 1536} dueno="NOVOA DE ARREDONDO · RECLAMO">
        <Renglon x={53} y={42} size={2.4} k={tramo(voz, F(1) + 0.4, 0.4)}>Hacienda expropiada</Renglon>
        <Renglon x={53} y={52} size={2.2} k={tramo(voz, F(2) + 1.6, 0.4)}>500 personas esclavizadas</Renglon>
        <Renglon x={53} y={62} size={2.4} k={tramo(voz, Ffin(2) - 1.6, 0.4)}>Lucro cesante: 32 años</Renglon>
      </Papel>

      <Papel src={img('obj-09-folio-sencillo')} p={elias} aspecto={1448 / 1086} giro={-2} dueno="ELÍAS · GESTIÓN">
        <Renglon x={9} y={50} size={6.2} k={tramo(voz, Ffin(6) - 2.6, 0.4)} ancho={84}>pide:<br />500 000–600 000<br />pesos</Renglon>
        <Renglon x={9} y={76} size={4.6} k={tramo(voz, F(7) + 0.5, 0.4)} ancho={84}>comisión esperada:<br />200 000</Renglon>
      </Papel>

      <Papel src={img('obj-09-folio-sencillo')} p={respuesta} aspecto={1448 / 1086} giro={1.5} dueno="ECHENIQUE · RESPUESTA">
        <Renglon x={9} y={55} size={7.4} k={tramo(voz, Ffin(9) - 1.1, 0.3)} ancho={84}>
          <TrazoRojo k={tramo(voz, Ffin(9) - 0.4, 0.6, 'ligero')} color={ROJO}>Fuera de plazo</TrazoRojo>
        </Renglon>
      </Papel>

      <Papel src={img('obj-04-vale')} p={vale} aspecto={1024 / 1536} giro={reservada ? 0 : 1.5} halo={halo} dueno="NOVOA · VALES APROBADOS">
        <Renglon x={8} y={33} size={12.5} k={tramo(voz, F(11) + 0.1, reservada ? 0.15 : 0.5)} familia={fuente.libro} peso={600} ancho={84} centro>
          <span style={{ opacity: Math.min(1, focoVale) }}>948 500</span>
        </Renglon>
        <Renglon x={8} y={58} size={4.6} k={tramo(voz, F(11) + 0.6, 0.4)} familia={fuente.libro} ancho={84} centro color="#4a3826">pesos en vales</Renglon>
      </Papel>

      <Papel src={img('obj-09-folio-sencillo')} p={recibido} aspecto={1448 / 1086} giro={2} dueno="NOVOA · RECIBIDO, SEGÚN QUIROZ">
        <Renglon x={9} y={45} size={6} k={tramo(voz, F(14) + 1.8, 0.4)} ancho={84}>probablemente</Renglon>
        <Renglon x={9} y={56} size={8} k={tramo(voz, F(14) + 2.6, 0.4)} ancho={84} familia={fuente.libro} peso={600}>≈ 180 000</Renglon>
        <Renglon x={9} y={68} size={6} k={tramo(voz, F(14) + 2.6, 0.4)} ancho={84}>pesos en vales</Renglon>
      </Papel>

      {/* fichas de identidad: una o dos a la vez, arriba a la izquierda */}
      <FichaEn texto="IGNACIA NOVOA DE ARREDONDO · RECLAMANTE" x={110} y={70} voz={voz} desde={F(1)} hasta={F(4)} />
      <FichaEn texto="ABOLICIÓN · DECRETO DEL 3 DE DICIEMBRE DE 1854" x={110} y={960} voz={voz} desde={F(3)} hasta={F(4)} />
      <FichaEn texto="DOMINGO ELÍAS · INTERMEDIARIO" x={110} y={70} voz={voz} desde={F(4)} hasta={F(8)} />
      <FichaEn texto="JOSÉ RUFINO ECHENIQUE · PRESIDENTE, 1851–1855" x={110} y={70} voz={voz} desde={F(8)} hasta={reservada ? F(10) : F(12)} />
      <FichaEn texto="JUAN CRISÓSTOMO TORRICO · MINISTRO DE GUERRA" x={110} y={70} voz={voz} desde={F(13)} hasta={F(15)} />
      <FichaEn texto="ECHENIQUE · FUERA DE PLAZO" x={110} y={70} voz={voz} desde={F(15) + 0.3} hasta={99}
        foco={tramo(voz, F(16) + 0.6, 0.3) * (1 - tramo(voz, F(16) + 3.4, 0.3))} />
      <FichaEn texto="TORRICO · INTERVINO" x={110} y={120} voz={voz} desde={F(15) + 0.8} hasta={99}
        foco={tramo(voz, F(16) + 3.4, 0.3) * (1 - tramo(voz, F(16) + 5.2, 0.3))} />

      <Luz color={OCRE} x={46} y={46} radio={60} intensidad={0.06} />
      <Atmosfera grano={0} vineta={0.3} />

      <div style={{ position: 'absolute', right: 40, bottom: 26, fontFamily: fuente.mono, fontSize: 20, letterSpacing: '0.12em', color: 'rgba(239,230,207,.7)', textAlign: 'right', filter: SOMBRA }}>
        ANIMATIC · ESCENA 3 · VERSIÓN {version}<br />
        {version === 'A' ? 'cámara quieta' : version === 'B' ? '+ momento reservado' : version === 'C' ? '+ respiros de montaje' : 'elegida: C con la entrada de A'} · plano {plano}
      </div>

      {ecoTramos.map((tr) => (
        <Sequence key={tr.id} from={Math.round(tr.video0 * FPS)} durationInFrames={Math.max(1, Math.round((tr.voz1 - tr.voz0) * FPS))} layout="none" name={`voz ${tr.id}`}>
          <Audio src={staticFile('voz/s03.mp3')} trimBefore={Math.round(tr.voz0 * FPS)} />
        </Sequence>
      ))}
      {hojas.map((s, i) => <Sfx key={i} nombre="hoja" en={aVideo(version, s)} fps={FPS} dura={1} volumen={0.16} />)}
      <Sfx nombre="pluma" en={aVideo(version, Ffin(9) - 0.4)} fps={FPS} dura={0.9} volumen={0.14} />
      <PrecargaTexturas />
    </AbsoluteFill>
  );
};
