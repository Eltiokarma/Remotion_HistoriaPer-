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

export const PAPEL = '#efe6cf';
export const TINTA = '#33251a';
export const ROJO = '#a3322a';
export const OCRE = '#c8a455';
export const img = (n: string) => staticFile(`img/${n}.png`);
/** Sombra negra para todo texto claro sobre el fondo (indicación de Gerson, 20 de noviembre de 2026). */
/** Caja detrás de todo texto sobre el fondo: negro sólido al 50 %, sin degradado (Gerson, 20 de noviembre de 2026). */
export const CAJA: CSSProperties = { background: 'rgba(0,0,0,.5)', padding: '7px 14px 8px' };

/** Quién es el dueño de un documento: retrato de época si lo hay, si no una silueta que lo caracterice. */
export type Persona = 'novoa' | 'elias' | 'echenique' | 'torrico' | 'mendiburu' | 'castilla';
const SILUETA: Record<Persona, 'mujer' | 'capitalista' | 'presidente' | 'militar'> = {
  novoa: 'mujer', elias: 'capitalista', echenique: 'presidente', torrico: 'militar', mendiburu: 'militar', castilla: 'presidente',
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

export const Medallon = ({ persona, size = 92 }: { persona: Persona; size?: number }) =>
  RETRATOS[persona] ? (
    // el PNG ya trae su círculo y su filete: solo se le pone sombra de contacto
    <Img src={staticFile(RETRATOS[persona]!)} style={{ width: size, height: size, flex: 'none', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,.55))' }} />
  ) : (
    <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', border: '3px solid #efe6cf', flex: 'none' }}>
      <Silueta tipo={SILUETA[persona]} />
    </div>
  );

export type Pose = { x: number; y: number; w: number; o: number };
export const pose = (x: number, y: number, w: number, o = 1): Pose => ({ x, y, w, o });
export const mezcla = (a: Pose, b: Pose, k: number): Pose => ({ x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), w: mix(a.w, b.w, k), o: mix(a.o, b.o, k) });

/** Centro del medallón de la etiqueta de un papel, en coordenadas del cuadro (el papel gira sobre su centro). */
export const anclaEtiqueta = (p: Pose, aspecto: number, giro: number) => {
  const cx = p.x + p.w / 2, cy = p.y + (p.w * aspecto) / 2;
  const lx = -6 + 50 - p.w / 2, ly = -12 - 50 - (p.w * aspecto) / 2;   // medallón de 100 px, 12 px sobre el papel
  const r = (giro * Math.PI) / 180;
  return { x: cx + lx * Math.cos(r) - ly * Math.sin(r), y: cy + lx * Math.sin(r) + ly * Math.cos(r), size: 100 };
};

/**
 * Versión F (Gerson, 21 de noviembre de 2026): cuando la voz nombra a alguien por primera vez, su medallón
 * y su nombre salen en primer plano y la mesa se desenfoca; a los 1,3 s el medallón viaja en arco hasta
 * su lugar (la etiqueta de su papel, que entra a la vez) y la mesa vuelve a foco. 1,8 s en total.
 * Los segundos de los nombres se midieron con Scribe sobre voz/s03.mp3 (21 de noviembre de 2026).
 */
export const PRES_IN = 0.35, PRES_VUELA = 1.3, PRES_LLEGA = 1.8;
export type Presentacion = { persona: Persona; nombre: string; rol: string; t0: number };
const PRESENTACIONES: Presentacion[] = [
  { persona: 'novoa', nombre: 'IGNACIA NOVOA DE ARREDONDO', rol: 'reclamante', t0: F(1) - 0.1 },          // «Ignacia» 7,14
  { persona: 'elias', nombre: 'DOMINGO ELÍAS', rol: 'intermediario', t0: F(4) + 0.94 },                   // «Domingo» 29,46
  { persona: 'echenique', nombre: 'JOSÉ RUFINO ECHENIQUE', rol: 'presidente, 1851–1855', t0: F(8) + 1.06 }, // «José» 45,92
  { persona: 'torrico', nombre: 'JUAN CRISÓSTOMO TORRICO', rol: 'ministro de Guerra', t0: F(13) + 4.16 },   // «Juan» 73,92
];
const presDe = (persona: Persona) => PRESENTACIONES.find((x) => x.persona === persona)!;

export const EnPrimerPlano = ({ pr, voz, destino, capas }: { pr: Presentacion; voz: number; destino: { x: number; y: number; size: number }; capas: Capas }) => {
  if (voz < pr.t0 || voz > pr.t0 + PRES_LLEGA + 0.15) return null;
  const entra = tramo(voz, pr.t0, PRES_IN, 'pesado');
  const vuela = tramo(voz, pr.t0 + PRES_VUELA, PRES_LLEGA - PRES_VUELA, 'pesado');
  const GRANDE = 280, cx = 960, cy = 430;
  const size = mix(GRANDE, destino.size, vuela) * mix(0.86, 1, entra);
  const x = mix(cx, destino.x, vuela);
  const y = mix(cy, destino.y, vuela) - 90 * Math.sin(Math.PI * vuela);   // arco, no línea recta
  const rotulo = entra * (1 - tramo(voz, pr.t0 + PRES_VUELA, 0.25, 'natural'));
  return (
    <>
      <div style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, opacity: entra }}>
        <Medallon persona={pr.persona} size={size} />
      </div>
      {rotulo > 0 ? (
        <div style={{ position: 'absolute', left: 0, width: 1920, top: cy + GRANDE / 2 + 28, display: 'flex', justifyContent: 'center', opacity: rotulo }}>
          <div style={{ ...(capas.tira ? TIRA : CAJA), padding: '14px 30px 16px', textAlign: 'center', color: PAPEL, transform: `translateY(${(1 - entra) * 14}px) rotate(-1.2deg)` }}>
            <div style={{ fontFamily: fuente.mono, fontSize: 46, letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
              <span style={{ width: 14, height: 14, background: ROJO, display: 'inline-block' }} />{pr.nombre}
            </div>
            <div style={{ fontFamily: fuente.maquina, fontSize: 30, marginTop: 6, opacity: 0.85 }}>{pr.rol}</div>
          </div>
        </div>
      ) : null}
    </>
  );
};

/**
 * Versiones E (auditoría con estructura-visual-motion, 20 de noviembre de 2026): acumulativas sobre D,
 * una capa por versión. E1 mesa desaturada · E2 una sola presentación por persona · E3 composición
 * (escala, asimetría, vale fijo) · E4 física (opacos con trayecto, sombra de contacto, solape) ·
 * E5 texto en tinta · E6 etiquetas como tiras de cartón en vez de la caja negra.
 */
export type Capas = { desat: boolean; unaPres: boolean; compo: boolean; fisica: boolean; tinta: boolean; tira: boolean; pres: boolean; folios: boolean };
export const capasDe = (v: Version): Capas => {
  const n = v === 'F' ? 6 : v.startsWith('E') ? Number(v.slice(1)) : 0;
  return { desat: n >= 1, unaPres: n >= 2, compo: n >= 3, fisica: n >= 4, tinta: n >= 5, tira: n >= 6, pres: v === 'F', folios: v === 'F' };
};
const SOMBRA_FLOTA = 'drop-shadow(12px 16px 12px rgba(0,0,0,.45))';
export const SOMBRA_APOYA = 'drop-shadow(1px 2px 1.5px rgba(0,0,0,.6)) drop-shadow(6px 8px 9px rgba(0,0,0,.28))';
/** Etiqueta como objeto del mundo: una tira de cartón oscuro, algo torcida, con su sombra de contacto. */
export const TIRA: CSSProperties = { background: '#3b2a20', border: '1px solid rgba(239,230,207,.16)', boxShadow: '1px 2px 2px rgba(0,0,0,.55)', padding: '7px 14px 8px', transform: 'rotate(-1.2deg)' };

/** Un papel de la galería con texto encima, en coordenadas del cuadro. `aspecto` = alto / ancho. */
export const Papel = ({ src, p, aspecto, giro = 0, halo = 0, dueno, persona, capas, etiqueta = 1, children }: { src: string; p: Pose; aspecto: number; giro?: number; halo?: number; dueno?: string; persona?: Persona; capas: Capas; etiqueta?: number; children?: ReactNode }) =>
  p.o <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: p.x, top: p.y, width: p.w, height: p.w * aspecto, opacity: p.o, transform: `rotate(${giro}deg)`,
      filter: `${capas.fisica ? SOMBRA_APOYA : SOMBRA_FLOTA}${halo > 0 ? ` drop-shadow(0 0 ${28 * halo}px rgba(222,184,105,${0.7 * halo}))` : ''}` }}>
      <Img src={src} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', inset: 0, containerType: 'inline-size' } as CSSProperties}>{children}</div>
      {dueno && etiqueta > 0 ? (
        <div style={{ position: 'absolute', left: -6, bottom: '100%', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          {persona ? <Medallon persona={persona} size={capas.unaPres ? 100 : 92} /> : null}
          <div style={{ ...(capas.tira ? TIRA : CAJA), clipPath: etiqueta < 1 ? `inset(-20% ${(1 - etiqueta) * 100}% -20% -20%)` : undefined, whiteSpace: 'nowrap', fontFamily: fuente.mono, fontSize: capas.unaPres ? 24 : 22, letterSpacing: '0.12em', color: PAPEL, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 9, height: 9, background: ROJO, display: 'inline-block' }} />{dueno}
          </div>
        </div>
      ) : null}
    </div>
  );

/**
 * Sello del papel sellado, reconstruido (Gerson, 21 de noviembre de 2026). Documentado (IRA-PUCP, Fondo
 * Riva-Agüero): en 1851 el papel sellado de Lima llevaba el escudo de la República y se emitía por bienio.
 * La forma, el marco y el lugar de las leyendas son reconstrucción: el grabado es de ChatGPT, sin letras
 * (obj-16), y las leyendas las escribe Remotion en el anillo vacío. Va en el reclamo de Novoa, el trámite
 * de un particular; el oficio de Echenique no lo lleva hasta saber si el gobierno respondía en papel sellado.
 */
export const SelloPapelSellado = ({ x, y, ancho, k }: { x: number; y: number; ancho: number; k: number }) => {
  const R_ARRIBA = 382, R_ABAJO = 432;   // el anillo vacío del grabado va de ~360 a ~448 (de 512)
  return k <= 0 ? null : (
    <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${ancho}cqw`, aspectRatio: '1', opacity: 0.82 * k, mixBlendMode: 'multiply', transform: 'rotate(-1.5deg)' }}>
      <Img src={img('obj-16-sello-papel-sellado')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <svg viewBox="0 0 1024 1024" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <path id="sello-arriba" d={`M ${512 - R_ARRIBA} 512 A ${R_ARRIBA} ${R_ARRIBA} 0 0 1 ${512 + R_ARRIBA} 512`} />
          <path id="sello-abajo" d={`M ${512 - R_ABAJO} 512 A ${R_ABAJO} ${R_ABAJO} 0 0 0 ${512 + R_ABAJO} 512`} />
        </defs>
        <g fill="#3a2a1e" fontFamily={fuente.libro} fontWeight={600} letterSpacing="6">
          <text fontSize={74}><textPath href="#sello-arriba" startOffset="50%" textAnchor="middle">REPÚBLICA PERUANA</textPath></text>
          <text fontSize={58}><textPath href="#sello-abajo" startOffset="50%" textAnchor="middle">BIENIO DE 1852 Y 1853</textPath></text>
          <circle cx={512 - 405} cy={512} r={9} /><circle cx={512 + 405} cy={512} r={9} />
        </g>
      </svg>
    </div>
  );
};

/** Texto mecanografiado dentro de un papel: posición y tamaño en % del ancho del papel. */
export const Renglon = ({ x, y, size, k, children, color = TINTA, familia = fuente.maquina, peso = 400, ancho = 80, centro = false, tinta = false }: { x: number; y: number; size: number; k: number; children: ReactNode; color?: string; familia?: string; peso?: number; ancho?: number; centro?: boolean; tinta?: boolean }) =>
  k <= 0 ? null : (
    <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${ancho}%`, fontFamily: familia, fontWeight: peso, fontSize: `${size}cqw`, lineHeight: 1.15,
      color: tinta ? '#3d2b1d' : color, opacity: k * (tinta ? 0.9 : 1), mixBlendMode: tinta ? 'multiply' : 'normal', textAlign: centro ? 'center' : 'left' }}>{children}</div>
  );

export const FichaEn = ({ texto, x, y, voz, desde, hasta, foco = 1, persona, capas }: { texto: string; x: number; y: number; voz: number; desde: number; hasta: number; foco?: number; persona?: Persona; capas: Capas }) => (
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
  const conEntradaA = version === 'D' || version === 'F' || version.startsWith('E');
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
  // con presentaciones (F), el papel llega con el medallón que vuela hacia su etiqueta
  const eliasIn = capas.pres ? tramo(voz, presDe('elias').t0 + PRES_VUELA, PRES_LLEGA - PRES_VUELA, 'pesado') : entra(F(4) + 0.3);
  const E0 = capas.compo ? pose(230, 205, 560) : pose(300, 250, 470);
  // al volver junto al vale, más abajo: su etiqueta queda bajo la del vale y no la pisa (Gerson, 2026-11-21)
  const E35 = capas.compo ? pose(150, 420, 450) : pose(230, 330, 400);
  let elias = pose(mix(-600, E0.x, eliasIn), E0.y, E0.w, op(eliasIn));
  elias = fuera(elias, F(10), -700, 0.8);
  const vuelve = entra(F(12) + 0.2, 0.7);
  if (voz >= F(12)) elias = pose(mix(-600, E35.x, vuelve), E35.y, E35.w, op(vuelve));
  elias = fuera(elias, F(14), -700, 0.6);
  // 3.3 · la respuesta: fuera de plazo
  const respIn = capas.pres ? tramo(voz, presDe('echenique').t0 + PRES_VUELA, PRES_LLEGA - PRES_VUELA, 'pesado') : entra(F(8) + 1);
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
  // el recibo de Novoa (F) es una tira angosta: menos ancho y un poco más arriba para que quepa entero
  const recibido = capas.folios ? pose(mix(-700, 200, recIn), 395, 272, op(recIn)) : capas.compo ? pose(mix(-700, 130, recIn), 380, 470, op(recIn)) : pose(mix(1920, 1190, recIn), 230, 470, recIn);

  /** F: un papel distinto por dueño (ChatGPT, 21 de noviembre de 2026); antes, el mismo folio para los tres. */
  const folio = capas.folios
    ? { elias: { src: img('obj-13-carta-elias'), aspecto: 1416 / 1056 }, echenique: { src: img('obj-14-oficio-echenique'), aspecto: 1412 / 1057 }, novoa: { src: img('obj-15-recibo-novoa'), aspecto: 1434 / 575 } }
    : { elias: { src: img('obj-09-folio-sencillo'), aspecto: 1448 / 1086 }, echenique: { src: img('obj-09-folio-sencillo'), aspecto: 1448 / 1086 }, novoa: { src: img('obj-09-folio-sencillo'), aspecto: 1448 / 1086 } };
  /** Etiqueta de un papel en F: oculta hasta que llega su medallón; después la tira se despliega desde él. */
  const etiq = (persona: Persona) => (capas.pres ? (voz < presDe(persona).t0 + PRES_LLEGA ? 0 : tramo(voz, presDe(persona).t0 + PRES_LLEGA, 0.3, 'natural') || 0.001) : 1);
  const foco = capas.pres ? Math.max(0, ...PRESENTACIONES.map((pr) => tramo(voz, pr.t0, PRES_IN, 'natural') * (1 - tramo(voz, pr.t0 + PRES_VUELA, PRES_LLEGA - PRES_VUELA, 'natural')))) : 0;
  const destinos: Partial<Record<Persona, { x: number; y: number; size: number }>> = {
    novoa: anclaEtiqueta(carpeta, 1024 / 1536, 0), elias: anclaEtiqueta(elias, folio.elias.aspecto, -2),
    echenique: anclaEtiqueta(respuesta, folio.echenique.aspecto, 1.5), torrico: { x: 110 + 52, y: 50 + 52, size: 104 },
  };
  const ecoTramos = tramos(version);
  const hojas = [0.2, capas.pres ? presDe('elias').t0 + PRES_VUELA : F(4) + 0.3, capas.pres ? presDe('echenique').t0 + PRES_VUELA : F(8) + 1, ...(reservada && !conEntradaA ? [] : [F(11) - 0.1]), F(14) + 0.6, ...(reservada ? [F(12) + 0.2] : [])];
  return (
    <AbsoluteFill style={{ background: '#2a1d14' }}>
      <AbsoluteFill style={{ filter: foco > 0.001 ? `blur(${9 * foco}px) brightness(${1 - 0.35 * foco})` : undefined }}>
      <Img src={img('fondo-mesa-expediente')} style={{ position: 'absolute', inset: 0, width: 1920, height: 1080, filter: capas.desat ? 'saturate(.5) brightness(.8)' : undefined }} />

      <Papel src={img('obj-07-carpeta-abierta')} p={carpeta} aspecto={1024 / 1536} capas={capas} etiqueta={etiq('novoa')} dueno={capas.unaPres ? 'IGNACIA NOVOA DE ARREDONDO · RECLAMANTE' : 'NOVOA DE ARREDONDO · RECLAMO'} persona="novoa">
        {capas.folios ? <SelloPapelSellado x={50.5} y={11} ancho={13.5} k={1} /> : null}
        <Renglon x={53} y={42} size={2.4} k={tramo(voz, F(1) + 0.4, 0.4)} tinta={capas.tinta}>Hacienda expropiada</Renglon>
        <Renglon x={53} y={52} size={2.2} k={tramo(voz, F(2) + 1.6, 0.4)} tinta={capas.tinta}>500 personas esclavizadas</Renglon>
        <Renglon x={53} y={62} size={2.4} k={tramo(voz, Ffin(2) - 1.6, 0.4)} tinta={capas.tinta}>Lucro cesante: 32 años</Renglon>
      </Papel>

      <Papel src={folio.elias.src} p={elias} aspecto={folio.elias.aspecto} giro={-2} capas={capas} etiqueta={etiq('elias')} dueno={capas.unaPres ? (voz >= F(12) ? 'ELÍAS · LO QUE PEDÍA' : 'DOMINGO ELÍAS · INTERMEDIARIO') : 'ELÍAS · GESTIÓN'} persona="elias">
        {capas.folios ? (
          <>
            {/* Gerson (2026-11-21): lo que pedía Elías también en soles de hoy, para medir después lo que aprobó Torrico.
                1 peso = 1 dólar de 1852 (Q, p. 546) × ≈ 42 (IPC de EE. UU.) × 3,41 soles por dólar (noviembre de 2026) ≈ 143 soles. */}
            <Renglon x={9} y={44} size={6.2} k={tramo(voz, Ffin(6) - 2.6, 0.4)} ancho={84} tinta={capas.tinta}>pide:<br />500 000–600 000 pesos</Renglon>
            <Renglon x={9} y={58.5} size={4.6} k={tramo(voz, Ffin(6) - 1.2, 0.4)} ancho={84} tinta={capas.tinta}>≈ 70–85 millones de soles de hoy*</Renglon>
            <Renglon x={9} y={72} size={4.6} k={tramo(voz, F(7) + 0.5, 0.4)} ancho={84} tinta={capas.tinta}>comisión esperada:<br />200 000</Renglon>
            <Renglon x={9} y={89} size={3.3} k={tramo(voz, Ffin(6) - 1.2, 0.4)} ancho={84} tinta={capas.tinta}>* conversión aproximada</Renglon>
          </>
        ) : (<>
        <Renglon x={9} y={50} size={6.2} k={tramo(voz, Ffin(6) - 2.6, 0.4)} ancho={84} tinta={capas.tinta}>pide:<br />500 000–600 000<br />pesos</Renglon>
        <Renglon x={9} y={76} size={4.6} k={tramo(voz, F(7) + 0.5, 0.4)} ancho={84} tinta={capas.tinta}>comisión esperada:<br />200 000</Renglon>
        </>)}
      </Papel>

      <Papel src={folio.echenique.src} p={respuesta} aspecto={folio.echenique.aspecto} giro={1.5} capas={capas} etiqueta={etiq('echenique')} dueno={capas.unaPres ? 'ECHENIQUE · PRESIDENTE, 1851–1855' : 'ECHENIQUE · RESPUESTA'} persona="echenique">
        <Renglon x={9} y={55} size={7.4} k={tramo(voz, Ffin(9) - 1.1, 0.3)} ancho={84} tinta={capas.tinta}>
          <TrazoRojo k={tramo(voz, Ffin(9) - 0.4, 0.6, 'ligero')} color={ROJO}>Fuera de plazo</TrazoRojo>
        </Renglon>
      </Papel>

      <Papel src={img('obj-04-vale')} p={vale} aspecto={1024 / 1536} giro={reservada ? 0 : 1.5} halo={halo} capas={capas} dueno="NOVOA · VALES APROBADOS" persona="novoa">
        <Renglon x={8} y={33} size={12.5} k={tramo(voz, F(11) + 0.1, reservada ? 0.15 : 0.5)} familia={fuente.libro} peso={600} ancho={84} centro tinta={capas.tinta}>
          <span style={{ opacity: Math.min(1, focoVale) }}>948 500</span>
        </Renglon>
        <Renglon x={8} y={58} size={4.6} k={tramo(voz, F(11) + 0.6, 0.4)} familia={fuente.libro} ancho={84} centro color="#4a3826" tinta={capas.tinta}>pesos en vales</Renglon>
        {/* Gerson (2026-11-21): también en soles de hoy. Entra en 3.5, cuando la voz lo compara con lo que pedía Elías, para no tocar el silencio de la cifra. */}
        {capas.folios ? <Renglon x={8} y={69} size={3.6} k={tramo(voz, F(12) + 0.8, 0.4)} familia={fuente.libro} ancho={84} centro color="#4a3826" tinta={capas.tinta}>≈ 135 millones de soles de hoy*</Renglon> : null}
        {capas.folios ? <Renglon x={8} y={80} size={2.4} k={tramo(voz, F(12) + 0.8, 0.4)} ancho={84} centro color="#4a3826" tinta={capas.tinta}>* conversión aproximada</Renglon> : null}
      </Papel>

      <Papel src={folio.novoa.src} p={recibido} aspecto={folio.novoa.aspecto} giro={capas.folios ? 1 : 2} capas={capas} dueno={capas.compo ? 'NOVOA · SU PARTE' : 'NOVOA · RECIBIDO, SEGÚN QUIROZ'} persona="novoa">
        {/* Gerson (2026-11-21): no se entendía si los 180 000 eran aparte o una tajada de los 948 500 */}
        {capas.folios ? (
          <>
            <Renglon x={10} y={35} size={8.6} k={tramo(voz, F(14) + 1.8, 0.4)} ancho={82} tinta={capas.tinta}>probablemente<br />recibió</Renglon>
            <Renglon x={10} y={46} size={13} k={tramo(voz, F(14) + 2.6, 0.4)} ancho={86} familia={fuente.libro} peso={600} tinta={capas.tinta}>≈ 180 000</Renglon>
            <Renglon x={10} y={55.5} size={8.6} k={tramo(voz, F(14) + 3.0, 0.4)} ancho={82} tinta={capas.tinta}>de los 948 500<br />en vales</Renglon>
            <Renglon x={10} y={84} size={7} k={tramo(voz, F(14) + 3.2, 0.4)} ancho={82} tinta={capas.tinta}>según Quiroz</Renglon>
          </>
        ) : (<>
        <Renglon x={9} y={42} size={5.4} k={tramo(voz, F(14) + 1.8, 0.4)} ancho={84} tinta={capas.tinta}>probablemente recibió</Renglon>
        <Renglon x={9} y={51} size={8} k={tramo(voz, F(14) + 2.6, 0.4)} ancho={84} familia={fuente.libro} peso={600} tinta={capas.tinta}>≈ 180 000</Renglon>
        <Renglon x={9} y={63} size={5.4} k={tramo(voz, F(14) + 3.0, 0.4)} ancho={84} tinta={capas.tinta}>de los 948 500</Renglon>
        <Renglon x={9} y={71} size={5.4} k={tramo(voz, F(14) + 3.0, 0.4)} ancho={84} tinta={capas.tinta}>en vales</Renglon>
        {capas.compo ? <Renglon x={9} y={84} size={4.4} k={tramo(voz, F(14) + 3.2, 0.4)} ancho={84} tinta={capas.tinta}>según Quiroz</Renglon> : null}
        </>)}
      </Papel>

      {/* fichas de identidad: una o dos a la vez, arriba a la izquierda */}
      {!capas.unaPres && <FichaEn capas={capas} texto="IGNACIA NOVOA DE ARREDONDO · RECLAMANTE" persona="novoa" x={110} y={50} voz={voz} desde={F(1)} hasta={F(4)} />}
      <FichaEn capas={capas} texto={capas.compo ? 'ABOLICIÓN · 3 DE DICIEMBRE DE 1854' : 'ABOLICIÓN · DECRETO DEL 3 DE DICIEMBRE DE 1854'} x={capas.compo ? 1000 : 110} y={capas.compo ? 120 : 960} voz={voz} desde={F(3)} hasta={F(4)} />
      {!capas.unaPres && <FichaEn capas={capas} texto="DOMINGO ELÍAS · INTERMEDIARIO" persona="elias" x={110} y={50} voz={voz} desde={F(4)} hasta={F(8)} />}
      {!capas.unaPres && <FichaEn capas={capas} texto="JOSÉ RUFINO ECHENIQUE · PRESIDENTE, 1851–1855" persona="echenique" x={110} y={50} voz={voz} desde={F(8)} hasta={reservada ? F(10) : F(12)} />}
      <FichaEn capas={capas} texto="JUAN CRISÓSTOMO TORRICO · MINISTRO DE GUERRA" persona="torrico" x={110} y={50} voz={voz} desde={capas.pres ? presDe('torrico').t0 + PRES_LLEGA - 0.05 : F(13)} hasta={F(15)} />
      <FichaEn capas={capas} texto="ECHENIQUE · FUERA DE PLAZO" persona="echenique" x={110} y={capas.compo ? 28 : 830} voz={voz} desde={F(15) + 0.3} hasta={99}
        foco={tramo(voz, F(16) + 0.6, 0.3) * (1 - tramo(voz, F(16) + 3.4, 0.3))} />
      <FichaEn capas={capas} texto="TORRICO · INTERVINO" persona="torrico" x={capas.compo ? 850 : 110} y={capas.compo ? 28 : 940} voz={voz} desde={F(15) + 0.8} hasta={99}
        foco={tramo(voz, F(16) + 3.4, 0.3) * (1 - tramo(voz, F(16) + 5.2, 0.3))} />

      <Luz color={OCRE} x={46} y={46} radio={60} intensidad={0.06} />
      <Atmosfera grano={0} vineta={capas.desat ? 0.5 : 0.3} />

      </AbsoluteFill>

      {capas.pres && PRESENTACIONES.map((pr) => <EnPrimerPlano key={pr.persona} pr={pr} voz={voz} destino={destinos[pr.persona]!} capas={capas} />)}

      <div style={{ position: 'absolute', right: 40, bottom: 26, fontFamily: fuente.mono, fontSize: 20, letterSpacing: '0.12em', color: 'rgba(239,230,207,.7)', textAlign: 'right', ...CAJA }}>
        ANIMATIC · ESCENA 3 · VERSIÓN {version}<br />
        {({ A: 'cámara quieta', B: '+ momento reservado', C: '+ respiros de montaje', D: 'elegida: C con la entrada de A', E1: 'D + mesa desaturada', E2: '+ una presentación por persona', E3: '+ composición', E4: '+ física', E5: '+ texto en tinta', E6: '+ etiquetas de cartón', F: 'E6 + presentación de personajes' } as Record<Version, string>)[version]} · plano {plano}
      </div>

      {ecoTramos.map((tr) => (
        <Sequence key={tr.id} from={Math.round(tr.video0 * FPS)} durationInFrames={Math.max(1, Math.round((tr.voz1 - tr.voz0) * FPS))} layout="none" name={`voz ${tr.id}`}>
          <Audio src={staticFile('voz/s03.mp3')} trimBefore={Math.round(tr.voz0 * FPS)} />
        </Sequence>
      ))}
      {hojas.map((s, i) => <Sfx key={i} nombre="hoja" en={aVideo(version, s)} fps={FPS} dura={1} volumen={0.16} />)}
      {/* presentaciones (F): un soplo bajo mientras la mesa se desenfoca y un tic cuando el medallón llega a su lugar (Gerson, 21 de noviembre de 2026) */}
      {capas.pres && PRESENTACIONES.map((pr) => <Sfx key={`soplo-${pr.persona}`} nombre="soplo" en={aVideo(version, pr.t0)} fps={FPS} dura={1} volumen={0.1} />)}
      {capas.pres && PRESENTACIONES.map((pr) => <Sfx key={`tic-${pr.persona}`} nombre="tic" en={aVideo(version, pr.t0 + PRES_LLEGA)} fps={FPS} volumen={0.16} />)}
      <Sfx nombre="pluma" en={aVideo(version, Ffin(9) - 0.4)} fps={FPS} dura={0.9} volumen={0.14} />
      <PrecargaTexturas />
    </AbsoluteFill>
  );
};
