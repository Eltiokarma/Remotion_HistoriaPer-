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
/** Caja detrás de todo texto sobre el fondo: negro sólido al 50 %, sin degradado (Gerson, 20 de noviembre de 2026). */
const CAJA: CSSProperties = { background: 'rgba(0,0,0,.5)', padding: '7px 14px 8px' };

/** Quién es el dueño de un documento: retrato de época si lo hay, si no una silueta que lo caracterice. */
type Persona = 'novoa' | 'elias' | 'echenique' | 'torrico';
const SILUETA: Record<Persona, 'mujer' | 'capitalista' | 'presidente' | 'militar'> = {
  novoa: 'mujer', elias: 'capitalista', echenique: 'presidente', torrico: 'militar',
};
/** Retratos de época en dominio público, cuando estén en public/img/retrato-<persona>.png (ver README). */
/** Medallones ilustrados (ChatGPT, 20 de noviembre de 2026): redibujos de los retratos de Commons; Novoa en silueta. */
export const RETRATOS: Partial<Record<Persona, string>> = {
  elias: 'img/medallon-elias.png', echenique: 'img/medallon-echenique.png', torrico: 'img/medallon-torrico.png', novoa: 'img/medallon-novoa.png',
};

/** Silueta provisional de busto, para quien no tiene retrato conocido: se reemplaza por la ilustrada. */
const Silueta = ({ tipo }: { tipo: (typeof SILUETA)[Persona] }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <rect width="100" height="100" fill="#d8c9a6" />
    <g fill="#2a2018">
      {tipo === 'mujer' ? (
        <>
          <ellipse cx="50" cy="40" rx="15" ry="18" />
          <ellipse cx="50" cy="24" rx="17" ry="9" />
          <circle cx="66" cy="32" r="8" />
          <path d="M14 100 C16 72 30 62 50 62 C70 62 84 72 86 100 Z" />
          <path d="M22 100 L40 64 L50 80 L60 64 L78 100 Z" fill="#4a3a2c" />
        </>
      ) : (
        <>
          <ellipse cx="50" cy="44" rx="14" ry="17" />
          <path d="M14 100 C16 74 30 64 50 64 C70 64 84 74 86 100 Z" />
          <path d="M42 64 L50 82 L58 64 Z" fill="#efe6cf" />
          {tipo === 'capitalista' ? <><rect x="36" y="6" width="28" height="22" /><rect x="28" y="26" width="44" height="5" rx="2" /></> : null}
          {tipo === 'militar' ? <><path d="M34 30 L36 16 L64 16 L66 30 Z" /><rect x="30" y="29" width="40" height="4" /><rect x="14" y="70" width="18" height="6" fill="#c8a455" /><rect x="68" y="70" width="18" height="6" fill="#c8a455" /></> : null}
          {tipo === 'presidente' ? <path d="M30 100 L46 66 L54 66 L70 100" fill="none" stroke="#a3322a" strokeWidth="5" /> : null}
        </>
      )}
    </g>
  </svg>
);

const Medallon = ({ persona, size = 92 }: { persona: Persona; size?: number }) =>
  RETRATOS[persona] ? (
    // el PNG ya trae su círculo y su filete: solo se le pone sombra de contacto
    <Img src={staticFile(RETRATOS[persona]!)} style={{ width: size, height: size, flex: 'none', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,.55))' }} />
  ) : (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', border: '3px solid #efe6cf', flex: 'none' }}>
      <Silueta tipo={SILUETA[persona]} />
    </div>
  );

type Pose = { x: number; y: number; w: number; o: number };
const pose = (x: number, y: number, w: number, o = 1): Pose => ({ x, y, w, o });
const mezcla = (a: Pose, b: Pose, k: number): Pose => ({ x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), w: mix(a.w, b.w, k), o: mix(a.o, b.o, k) });

/**
 * Versiones E (auditoría con estructura-visual-motion, 20 de noviembre de 2026): acumulativas sobre D,
 * una capa por versión. E1 mesa desaturada · E2 una sola presentación por persona · E3 composición
 * (escala, asimetría, vale fijo) · E4 física (opacos con trayecto, sombra de contacto, solape) ·
 * E5 texto en tinta · E6 etiquetas como tiras de cartón en vez de la caja negra.
 */
type Capas = { desat: boolean; unaPres: boolean; compo: boolean; fisica: boolean; tinta: boolean; tira: boolean };
const capasDe = (v: Version): Capas => {
  const n = v.startsWith('E') ? Number(v.slice(1)) : 0;
  return { desat: n >= 1, unaPres: n >= 2, compo: n >= 3, fisica: n >= 4, tinta: n >= 5, tira: n >= 6 };
};
const SOMBRA_FLOTA = 'drop-shadow(12px 16px 12px rgba(0,0,0,.45))';
const SOMBRA_APOYA = 'drop-shadow(1px 2px 1.5px rgba(0,0,0,.6)) drop-shadow(6px 8px 9px rgba(0,0,0,.28))';
/** Etiqueta como objeto del mundo: una tira de cartón oscuro, algo torcida, con su sombra de contacto. */
const TIRA: CSSProperties = { background: '#3b2a20', border: '1px solid rgba(239,230,207,.16)', boxShadow: '1px 2px 2px rgba(0,0,0,.55)', padding: '7px 14px 8px', transform: 'rotate(-1.2deg)' };

/** Un papel de la galería con texto encima, en coordenadas del cuadro. `aspecto` = alto / ancho. */
const Papel = ({ src, p, aspecto, giro = 0, halo = 0, dueno, persona, capas, children }: { src: string; p: Pose; aspecto: number; giro?: number; halo?: number; dueno?: string; persona?: Persona; capas: Capas; children?: ReactNode }) =>
  p.o <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: p.x, top: p.y, width: p.w, height: p.w * aspecto, opacity: p.o, transform: `rotate(${giro}deg)`,
      filter: `${capas.fisica ? SOMBRA_APOYA : SOMBRA_FLOTA}${halo > 0 ? ` drop-shadow(0 0 ${28 * halo}px rgba(222,184,105,${0.7 * halo}))` : ''}` }}>
      <Img src={src} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', inset: 0, containerType: 'inline-size' } as CSSProperties}>{children}</div>
      {dueno ? (
        <div style={{ position: 'absolute', left: -6, bottom: '100%', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          {persona ? <Medallon persona={persona} size={capas.unaPres ? 100 : 92} /> : null}
          <div style={{ ...(capas.tira ? TIRA : CAJA), whiteSpace: 'nowrap', fontFamily: fuente.mono, fontSize: capas.unaPres ? 24 : 22, letterSpacing: '0.12em', color: PAPEL, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 9, height: 9, background: ROJO, display: 'inline-block' }} />{dueno}
          </div>
        </div>
      ) : null}
    </div>
  );

/** Texto mecanografiado dentro de un papel: posición y tamaño en % del ancho del papel. */
const Renglon = ({ x, y, size, k, children, color = TINTA, familia = fuente.maquina, peso = 400, ancho = 80, centro = false, tinta = false }: { x: number; y: number; size: number; k: number; children: ReactNode; color?: string; familia?: string; peso?: number; ancho?: number; centro?: boolean; tinta?: boolean }) =>
  k <= 0 ? null : (
    <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${ancho}%`, fontFamily: familia, fontWeight: peso, fontSize: `${size}cqw`, lineHeight: 1.15,
      color: tinta ? '#3d2b1d' : color, opacity: k * (tinta ? 0.9 : 1), mixBlendMode: tinta ? 'multiply' : 'normal', textAlign: centro ? 'center' : 'left' }}>{children}</div>
  );

const FichaEn = ({ texto, x, y, voz, desde, hasta, foco = 1, persona, capas }: { texto: string; x: number; y: number; voz: number; desde: number; hasta: number; foco?: number; persona?: Persona; capas: Capas }) => (
  <div style={{ position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 14,
    opacity: mix(0.45, 1, foco) * (1 - tramo(voz, hasta, 0.5, 'natural')) * (voz >= desde ? tramo(voz, desde, 0.3, 'natural') : 0) }}>
    {persona ? <Medallon persona={persona} size={104} /> : null}
    <div style={capas.tira ? TIRA : CAJA}>
      <Ficha texto={texto} t={voz - desde} color={PAPEL} acento={ROJO} size={26} />
    </div>
  </div>
);

export const Animatic: React.FC<{ version: Version }> = ({ version }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { voz, plano } = aVoz(version, t);
  const reservada = version !== 'A';
  const capas = capasDe(version);
  const conEntradaA = version === 'D' || version.startsWith('E');
  const entra = (a: number, d = 0.6) => tramo(voz, a, d, 'pesado');
  const sale = (a: number, d = 0.5) => 1 - tramo(voz, a, d, 'natural');
  /** Con «física», lo que sale no se desvanece: se desliza fuera del cuadro, opaco. */
  const fuera = (p: Pose, a: number, haciaX: number, d = 0.7): Pose =>
    capas.fisica ? mezcla(p, { ...p, x: haciaX }, tramo(voz, a, d, 'tenso')) : { ...p, o: p.o * sale(a, d) };
  /** Con «física», lo que entra no aparece transparente: llega opaco desde fuera del cuadro. */
  const op = (k: number) => (capas.fisica ? (k > 0.001 ? 1 : 0) : k);

  // 3.1 · la carpeta de Novoa
  const cIn = entra(0, 0.8);
  let carpeta = capas.compo ? pose(mix(-1300, 110, cIn), 215, 1300, op(cIn)) : pose(150, 240, 1000, cIn);
  carpeta = fuera(carpeta, F(4), -1500);
  // 3.2–3.5 · el folio de la gestión de Elías
  const eliasIn = entra(F(4) + 0.3);
  const E0 = capas.compo ? pose(230, 205, 560) : pose(300, 250, 470);
  const E35 = capas.compo ? pose(160, 330, 490) : pose(230, 330, 400);
  let elias = pose(mix(-600, E0.x, eliasIn), E0.y, E0.w, op(eliasIn));
  elias = fuera(elias, F(10), -700, 0.8);
  const vuelve = entra(F(12) + 0.2, 0.7);
  if (voz >= F(12)) elias = pose(mix(-600, E35.x, vuelve), E35.y, E35.w, op(vuelve));
  elias = fuera(elias, F(14), -700, 0.6);
  // 3.3 · la respuesta: fuera de plazo
  const respIn = entra(F(8) + 1);
  const R0 = capas.compo ? pose(990, 185, 560) : pose(1140, 230, 470);
  const respuesta = fuera(pose(mix(1920, R0.x, respIn), R0.y, R0.w, op(respIn)), F(10), 1960, 0.8);
  // 3.4 · el vale aprobado
  const valeA = pose(mix(1920, 600, entra(F(11) - 0.1, 0.7)), 560, 720, entra(F(11) - 0.1, 0.7));
  const valeB = pose(510, 250, 900, tramo(voz, F(11) - 0.05, 0.2, 'natural'));
  const vIn = entra(F(11) - 0.1, 0.7);
  const valeD = capas.compo ? pose(mix(1920, 640, vIn), 290, 1080, op(vIn)) : pose(mix(1920, 510, vIn), 250, 900, vIn);
  let vale = conEntradaA ? valeD : reservada ? valeB : valeA;
  if (!capas.compo) {
    // sin «composición», el vale se corre a la derecha (3.5) y a la izquierda (3.6); con ella, queda fijo
    vale = mezcla(vale, pose(860, 300, 820, vale.o), tramo(voz, F(12), 0.9, 'pesado'));
    vale = mezcla(vale, pose(170, 300, 820, vale.o), tramo(voz, F(14), 0.9, 'pesado'));
  }
  const halo = reservada ? 0 : tramo(voz, F(11), 0.5, 'natural') * (0.6 + 0.4 * Math.sin(t * 3)) * (1 - tramo(voz, F(12), 0.5, 'natural'));
  const focoVale = 1 + 0.6 * tramo(voz, F(16) + 5.3, 0.4, 'natural');
  // 3.6 · lo que Novoa probablemente recibió
  const recIn = entra(F(14) + 0.6);
  const recibido = capas.compo ? pose(mix(-700, 130, recIn), 250, 500, op(recIn)) : pose(mix(1920, 1190, recIn), 230, 470, recIn);

  const ecoTramos = tramos(version);
  const hojas = [0.2, F(4) + 0.3, F(8) + 1, ...(reservada && !conEntradaA ? [] : [F(11) - 0.1]), F(14) + 0.6, ...(reservada ? [F(12) + 0.2] : [])];
  return (
    <AbsoluteFill style={{ background: '#2a1d14' }}>
      <Img src={img('fondo-mesa-expediente')} style={{ position: 'absolute', inset: 0, width: 1920, height: 1080, filter: capas.desat ? 'saturate(.5) brightness(.8)' : undefined }} />

      <Papel src={img('obj-07-carpeta-abierta')} p={carpeta} aspecto={1024 / 1536} capas={capas} dueno={capas.unaPres ? 'IGNACIA NOVOA DE ARREDONDO · RECLAMANTE' : 'NOVOA DE ARREDONDO · RECLAMO'} persona="novoa">
        <Renglon x={53} y={42} size={2.4} k={tramo(voz, F(1) + 0.4, 0.4)} tinta={capas.tinta}>Hacienda expropiada</Renglon>
        <Renglon x={53} y={52} size={2.2} k={tramo(voz, F(2) + 1.6, 0.4)} tinta={capas.tinta}>500 personas esclavizadas</Renglon>
        <Renglon x={53} y={62} size={2.4} k={tramo(voz, Ffin(2) - 1.6, 0.4)} tinta={capas.tinta}>Lucro cesante: 32 años</Renglon>
      </Papel>

      <Papel src={img('obj-09-folio-sencillo')} p={elias} aspecto={1448 / 1086} giro={-2} capas={capas} dueno={capas.unaPres ? 'DOMINGO ELÍAS · INTERMEDIARIO' : 'ELÍAS · GESTIÓN'} persona="elias">
        <Renglon x={9} y={50} size={6.2} k={tramo(voz, Ffin(6) - 2.6, 0.4)} ancho={84} tinta={capas.tinta}>pide:<br />500 000–600 000<br />pesos</Renglon>
        <Renglon x={9} y={76} size={4.6} k={tramo(voz, F(7) + 0.5, 0.4)} ancho={84} tinta={capas.tinta}>comisión esperada:<br />200 000</Renglon>
      </Papel>

      <Papel src={img('obj-09-folio-sencillo')} p={respuesta} aspecto={1448 / 1086} giro={1.5} capas={capas} dueno={capas.unaPres ? 'ECHENIQUE · PRESIDENTE, 1851–1855' : 'ECHENIQUE · RESPUESTA'} persona="echenique">
        <Renglon x={9} y={55} size={7.4} k={tramo(voz, Ffin(9) - 1.1, 0.3)} ancho={84} tinta={capas.tinta}>
          <TrazoRojo k={tramo(voz, Ffin(9) - 0.4, 0.6, 'ligero')} color={ROJO}>Fuera de plazo</TrazoRojo>
        </Renglon>
      </Papel>

      <Papel src={img('obj-04-vale')} p={vale} aspecto={1024 / 1536} giro={reservada ? 0 : 1.5} halo={halo} capas={capas} dueno="NOVOA · VALES APROBADOS" persona="novoa">
        <Renglon x={8} y={33} size={12.5} k={tramo(voz, F(11) + 0.1, reservada ? 0.15 : 0.5)} familia={fuente.libro} peso={600} ancho={84} centro tinta={capas.tinta}>
          <span style={{ opacity: Math.min(1, focoVale) }}>948 500</span>
        </Renglon>
        <Renglon x={8} y={58} size={4.6} k={tramo(voz, F(11) + 0.6, 0.4)} familia={fuente.libro} ancho={84} centro color="#4a3826" tinta={capas.tinta}>pesos en vales</Renglon>
      </Papel>

      <Papel src={img('obj-09-folio-sencillo')} p={recibido} aspecto={1448 / 1086} giro={2} capas={capas} dueno={capas.compo ? 'NOVOA · RECIBIDO' : 'NOVOA · RECIBIDO, SEGÚN QUIROZ'} persona="novoa">
        <Renglon x={9} y={45} size={6} k={tramo(voz, F(14) + 1.8, 0.4)} ancho={84} tinta={capas.tinta}>probablemente</Renglon>
        <Renglon x={9} y={56} size={8} k={tramo(voz, F(14) + 2.6, 0.4)} ancho={84} familia={fuente.libro} peso={600} tinta={capas.tinta}>≈ 180 000</Renglon>
        <Renglon x={9} y={68} size={6} k={tramo(voz, F(14) + 2.6, 0.4)} ancho={84} tinta={capas.tinta}>pesos en vales</Renglon>
        {capas.compo ? <Renglon x={9} y={84} size={4.4} k={tramo(voz, F(14) + 3.2, 0.4)} ancho={84} tinta={capas.tinta}>según Quiroz</Renglon> : null}
      </Papel>

      {/* fichas de identidad: una o dos a la vez, arriba a la izquierda */}
      {!capas.unaPres && <FichaEn capas={capas} texto="IGNACIA NOVOA DE ARREDONDO · RECLAMANTE" persona="novoa" x={110} y={50} voz={voz} desde={F(1)} hasta={F(4)} />}
      <FichaEn capas={capas} texto={capas.compo ? 'ABOLICIÓN · 3 DE DICIEMBRE DE 1854' : 'ABOLICIÓN · DECRETO DEL 3 DE DICIEMBRE DE 1854'} x={capas.compo ? 1000 : 110} y={capas.compo ? 120 : 960} voz={voz} desde={F(3)} hasta={F(4)} />
      {!capas.unaPres && <FichaEn capas={capas} texto="DOMINGO ELÍAS · INTERMEDIARIO" persona="elias" x={110} y={50} voz={voz} desde={F(4)} hasta={F(8)} />}
      {!capas.unaPres && <FichaEn capas={capas} texto="JOSÉ RUFINO ECHENIQUE · PRESIDENTE, 1851–1855" persona="echenique" x={110} y={50} voz={voz} desde={F(8)} hasta={reservada ? F(10) : F(12)} />}
      <FichaEn capas={capas} texto="JUAN CRISÓSTOMO TORRICO · MINISTRO DE GUERRA" persona="torrico" x={110} y={50} voz={voz} desde={F(13)} hasta={F(15)} />
      <FichaEn capas={capas} texto="ECHENIQUE · FUERA DE PLAZO" persona="echenique" x={110} y={capas.compo ? 28 : 830} voz={voz} desde={F(15) + 0.3} hasta={99}
        foco={tramo(voz, F(16) + 0.6, 0.3) * (1 - tramo(voz, F(16) + 3.4, 0.3))} />
      <FichaEn capas={capas} texto="TORRICO · INTERVINO" persona="torrico" x={capas.compo ? 760 : 110} y={capas.compo ? 28 : 940} voz={voz} desde={F(15) + 0.8} hasta={99}
        foco={tramo(voz, F(16) + 3.4, 0.3) * (1 - tramo(voz, F(16) + 5.2, 0.3))} />

      <Luz color={OCRE} x={46} y={46} radio={60} intensidad={0.06} />
      <Atmosfera grano={0} vineta={capas.desat ? 0.5 : 0.3} />

      <div style={{ position: 'absolute', right: 40, bottom: 26, fontFamily: fuente.mono, fontSize: 20, letterSpacing: '0.12em', color: 'rgba(239,230,207,.7)', textAlign: 'right', ...CAJA }}>
        ANIMATIC · ESCENA 3 · VERSIÓN {version}<br />
        {({ A: 'cámara quieta', B: '+ momento reservado', C: '+ respiros de montaje', D: 'elegida: C con la entrada de A', E1: 'D + mesa desaturada', E2: '+ una presentación por persona', E3: '+ composición', E4: '+ física', E5: '+ texto en tinta', E6: '+ etiquetas de cartón' } as Record<Version, string>)[version]} · plano {plano}
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
