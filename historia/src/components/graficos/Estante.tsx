import { useMemo } from 'react';
import { clamp, mix, type Escala } from '../../direction/anim';
import { azar } from '../../direction/azar';
import type { Paleta } from '../../esquema';
import { alfa, mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import { CapaVC, DefsLamina, usePrefijo, type Lamina } from './vectorcraft/Lamina';

type Props = {
  paleta: Paleta;
  id: string;
  /** Libros con título (los temas); el resto de la repisa son libros sin rótulo. */
  titulos: string[];
  /** 0–1 por libro con título: entra a la repisa desde arriba y se enciende su lomo. */
  entra: number[];
  /** Comprimir y estirar de cada libro con título (se estira al caer, se aplasta contra la repisa). */
  escalas?: Escala[];
  /** 0–1: aparición de la repisa y los libros sin rótulo. */
  aparece?: number;
  /** Lámina aprobada (biblioteca-video01): cuatro libros sueltos con su título en el lomo, en el orden de `titulos`. */
  lamina?: Lamina | null;
};

const REPISA = 820, X0 = 260, X1 = 1660;

/**
 * Una repisa de biblioteca: libros de tela sin rótulo y, entre ellos, los temas del autor que
 * bajan a su lugar con el título dorado en el lomo.
 */
/** Escala desde el punto de contacto con la repisa (el libro se aplasta contra la madera, no en el aire). */
const deforma = (e: Escala | undefined, cx: number) =>
  e && (e.sx !== 1 || e.sy !== 1) ? ` translate(${cx} ${REPISA}) scale(${e.sx} ${e.sy}) translate(${-cx} ${-REPISA})` : '';

export const Estante: React.FC<Props> = ({ lamina, ...props }) => {
  const uid = usePrefijo();
  if (lamina) return <EstanteLamina {...props} lamina={lamina} uid={uid} />;
  return <EstanteDibujado {...props} />;
};

/** En la lámina la repisa está en y = 850. El encabezado de presentación no se usa: la ficha de la escena da el lugar. */
const REPISA_LAMINA = 850;
const EstanteLamina: React.FC<Omit<Props, 'lamina'> & { lamina: Lamina; uid: string }> = ({ titulos, entra, escalas = [], aparece = 1, lamina, uid }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
    <DefsLamina lamina={lamina} uid={uid} />
    <CapaVC lamina={lamina} uid={uid} nombre="Repisa_de_madera" opacity={aparece} />
    {titulos.slice(0, 4).map((_, i) => {
      const k = clamp(entra[i] ?? 0);
      if (k <= 0) return null;
      const c = lamina.layers.find((l) => l.name.startsWith(`Libro_${i + 1}`));
      const cx = c ? c.box[0] + c.box[2] / 2 : 960;
      const e = escalas[i];
      // Cae desde arriba (lo mismo que el dibujado) y se aplasta contra la madera desde su base.
      const aplasta = e && (e.sx !== 1 || e.sy !== 1) ? ` translate(${cx} ${REPISA_LAMINA}) scale(${e.sx} ${e.sy}) translate(${-cx} ${-REPISA_LAMINA})` : '';
      return <CapaVC key={i} lamina={lamina} uid={uid} nombre={`Libro_${i + 1}`} transform={`translate(0 ${(1 - k) * -560})${aplasta}`} opacity={Math.min(1, k * 3)} />;
    })}
  </svg>
);

const EstanteDibujado: React.FC<Omit<Props, 'lamina'>> = ({ paleta, id, titulos, entra, escalas = [], aparece = 1 }) => {
  const libros = useMemo(() => {
    const r = azar(2005);
    const out: { x: number; w: number; h: number; tela: number; titulo?: number; incl: number }[] = [];
    let x = X0;
    // los libros con título van repartidos entre los otros
    const huecos = titulos.map((_, i) => Math.round(((i + 1) * 14) / (titulos.length + 1)));
    let n = 0;
    while (x < X1 - 40) {
      const ti = huecos.indexOf(n);
      const w = ti >= 0 ? 118 : r.rango(38, 74);
      out.push({ x, w, h: ti >= 0 ? 470 : r.rango(330, 450), tela: Math.floor(r.rango(0, 4)), titulo: ti >= 0 ? ti : undefined, incl: ti >= 0 ? 0 : r.n() < 0.08 ? r.rango(-4, 4) : 0 });
      x += w + r.rango(2, 6);
      n++;
    }
    return out;
  }, [titulos]);
  const telas = [mezclar(paleta.fondo, paleta.rojo, 0.5), mezclar(paleta.fondo, paleta.verde, 0.7), mezclar(paleta.fondo, paleta.ocre, 0.4), mezclar(paleta.fondo, paleta.papel, 0.18)];
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id={`${id}-lomo`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity={0.5} />
          <stop offset="0.35" stopColor="#fff" stopOpacity={0.12} />
          <stop offset="1" stopColor="#000" stopOpacity={0.55} />
        </linearGradient>
        <filter id={`${id}-sombra`}><feGaussianBlur stdDeviation={9} /></filter>
      </defs>
      <g opacity={aparece}>
        <rect x={X0 - 70} y={REPISA + 8} width={X1 - X0 + 140} height={30} fill="#000" opacity={0.5} filter={`url(#${id}-sombra)`} />
        <rect x={X0 - 70} y={REPISA} width={X1 - X0 + 140} height={26} fill={mezclar(paleta.fondo, paleta.ocre, 0.32)} />
        <rect x={X0 - 70} y={REPISA} width={X1 - X0 + 140} height={3} fill={mezclar(paleta.ocre, paleta.papel, 0.3)} opacity={0.6} />
      </g>
      {libros.map((l, i) => {
        const conTitulo = l.titulo !== undefined;
        const k = conTitulo ? clamp(entra[l.titulo!] ?? 0) : aparece;
        if (k <= 0) return null;
        const baja = conTitulo ? (1 - k) * -520 : 0;
        const y = REPISA - l.h + baja;
        const tela = conTitulo ? telas[(l.titulo! + 1) % telas.length] : telas[l.tela];
        const oro = mezclar(paleta.ocre, '#ffffff', 0.2);
        return (
          <g key={i} transform={`rotate(${l.incl} ${l.x + l.w / 2} ${REPISA})${deforma(conTitulo ? escalas[l.titulo!] : undefined, l.x + l.w / 2)}`}
            opacity={conTitulo ? Math.min(1, k * 3) : 0.75 * k}>
            <rect x={l.x} y={y} width={l.w} height={l.h} rx={3} fill={tela} />
            <rect x={l.x} y={y} width={l.w} height={l.h} rx={3} fill={`url(#${id}-lomo)`} />
            {[24, 32, l.h - 32, l.h - 24].map((dy, j) => (
              <line key={j} x1={l.x + 3} x2={l.x + l.w - 3} y1={y + dy} y2={y + dy} stroke={paleta.ocre} strokeWidth={j % 2 ? 1 : 2} opacity={conTitulo ? 0.9 : 0.35} />
            ))}
            {conTitulo ? (
              <>
                <rect x={l.x + 10} y={y + 60} width={l.w - 20} height={l.h - 130} fill={alfa('#000000', 0.25)} stroke={alfa(oro, 0.6)} />
                <text x={l.x + l.w / 2} y={y + l.h / 2 - 4} textAnchor="middle" dominantBaseline="middle" fill={oro} fontFamily={fuente.libro} fontSize={mix(38, 30, Math.min(1, titulos[l.titulo!].length / 18))}
                  transform={`rotate(-90 ${l.x + l.w / 2} ${y + l.h / 2 - 4})`} letterSpacing={2}>{titulos[l.titulo!]}</text>
              </>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};
