import { useMemo } from 'react';
import { azar } from '../../direction/azar';
import { mezclar } from '../../estilo/color';
import { fuente } from '../../estilo/fuentes';
import { PatronPapel } from '../atmosfera/Papel';
import { bordePapel, FiltroDesgaste } from './svg';

type Props = {
  id: string;
  /** Texto del afiche; cada palabra larga va en su línea y se estira al ancho (tipografía de imprenta de cartel). */
  texto: string;
  papel: string;
  tinta: string;
  /** Segundo color de tinta (líneas alternas y trama). */
  acento: string;
  ancho?: number;
  alto?: number;
  semilla?: number;
  /** 0–1: la esquina de arriba a la derecha se despega y se dobla. */
  despegue?: number;
};

const VOCAL = /[AEIOUÁÉÍÓÚ]/;
/** Corta una palabra larga en dos, con guion, antes de una consonante seguida de vocal (como en un afiche). */
const partir = (p: string): string[] => {
  if (p.length <= 10) return [p];
  const medio = Math.ceil(p.length / 2);
  for (let d = 0; d < 4; d++) {
    for (const i of [medio - d, medio + d]) {
      if (i > 2 && i < p.length - 2 && !VOCAL.test(p[i]) && VOCAL.test(p[i + 1])) return [`${p.slice(0, i)}-`, p.slice(i)];
    }
  }
  return [`${p.slice(0, medio)}-`, p.slice(medio)];
};

/**
 * Afiche tipográfico de los años setenta, genérico (no reproduce afiches ni logos reales):
 * letras condensadas estiradas a todo el ancho, trama de puntos, tinta gastada, papel pegado
 * con arrugas de engrudo y una esquina que se puede despegar.
 */
export const Afiche: React.FC<Props> = ({ id, texto, papel, tinta, acento, ancho = 520, alto = 700, semilla = 1, despegue = 0 }) => {
  const g = useMemo(() => {
    const r = azar(semilla);
    const palabras = texto.split(/\s+/).flatMap(partir);
    // líneas: palabras cortas se juntan con la siguiente
    const lineas: string[] = [];
    for (const p of palabras) {
      const ult = lineas[lineas.length - 1];
      if (ult && (ult.length + p.length < 9)) lineas[lineas.length - 1] = `${ult} ${p}`;
      else lineas.push(p);
    }
    const arrugas = Array.from({ length: 7 }, () => ({ x: r.rango(0, ancho), y: r.rango(0, alto), l: r.rango(60, 200), a: r.rango(-70, -20) }));
    return { lineas, arrugas, borde: bordePapel(semilla, 0, 0, ancho, alto, 2.2) };
  }, [texto, ancho, alto, semilla]);

  const m = ancho * 0.08; // margen
  const util = ancho - 2 * m;
  // alto de cada línea según su largo: las cortas, más grandes
  const pesos = g.lineas.map((l) => 1 / Math.max(4, l.length));
  const total = pesos.reduce((a, b) => a + b, 0);
  const altoTexto = alto * 0.62;
  let y = m + alto * 0.05;
  // esquina despegada: un triángulo que se dobla hacia adentro
  const c = despegue * ancho * 0.42;

  return (
    <svg width={ancho} height={alto} viewBox={`0 0 ${ancho} ${alto}`} style={{ overflow: 'visible' }}>
      <defs>
        <PatronPapel id={`${id}-papel`} escala={600} />
        <FiltroDesgaste id={`${id}-gastado`} semilla={semilla + 3} desgaste={0.16} />
        <pattern id={`${id}-trama`} width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <circle cx={4.5} cy={4.5} r={2.3} fill={acento} />
        </pattern>
        <linearGradient id={`${id}-mascara-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#fff" stopOpacity={1} />
        </linearGradient>
        <mask id={`${id}-mascara`}><rect width={ancho} height={alto} fill={`url(#${id}-mascara-g)`} /></mask>
        <clipPath id={`${id}-recorte`}><path d={`M0 0 L${ancho - c} 0 L${ancho} ${c} L${ancho} ${alto} L0 ${alto} Z`} /></clipPath>
      </defs>
      <g clipPath={`url(#${id}-recorte)`}>
        <path d={g.borde} fill={papel} />
        <path d={g.borde} fill={`url(#${id}-papel)`} style={{ mixBlendMode: 'multiply' }} />
        <g filter={`url(#${id}-gastado)`}>
          {/* trama que se funde hacia abajo */}
          <rect x={0} y={alto * 0.55} width={ancho} height={alto * 0.45} fill={`url(#${id}-trama)`} mask={`url(#${id}-mascara)`} opacity={0.55} />
          {g.lineas.map((l, i) => {
            // ni muy estirada ni muy apretada: el cuerpo también depende del largo de la línea
            const h = Math.min((altoTexto * pesos[i]) / total, util / (0.5 * l.length) / 1.18);
            y += h;
            const color = i % 2 === 0 ? tinta : acento;
            return (
              <text key={i} x={m} y={y - h * 0.06} fontFamily={fuente.afiche} fontWeight={700} fontSize={h * 1.18} fill={color}
                textLength={util} lengthAdjust="spacingAndGlyphs">{l}</text>
            );
          })}
          {/* filetes de imprenta abajo */}
          <rect x={m} y={alto - m - 34} width={util} height={10} fill={tinta} />
          <rect x={m} y={alto - m - 16} width={util * 0.6} height={4} fill={tinta} />
        </g>
        {/* arrugas del engrudo */}
        {g.arrugas.map((a, i) => (
          <line key={i} x1={a.x} y1={a.y} x2={a.x + Math.cos((a.a * Math.PI) / 180) * a.l} y2={a.y + Math.sin((a.a * Math.PI) / 180) * a.l}
            stroke="#fff" strokeOpacity={0.12} strokeWidth={2} />
        ))}
        <path d={g.borde} fill="none" stroke="#000" strokeOpacity={0.18} />
      </g>
      {/* la solapa doblada: dorso del papel, más claro, con su sombra */}
      {c > 1 ? (
        <>
          <path d={`M${ancho - c} 0 L${ancho} ${c} L${ancho - c * 0.95} ${c * 0.95} Z`} fill="#000" opacity={0.25} transform="translate(-4 6)" />
          <path d={`M${ancho - c} 0 L${ancho} ${c} L${ancho - c * 0.95} ${c * 0.95} Z`} fill={mezclar(papel, '#ffffff', 0.25)} />
          <path d={`M${ancho - c} 0 L${ancho} ${c} L${ancho - c * 0.95} ${c * 0.95} Z`} fill={`url(#${id}-papel)`} style={{ mixBlendMode: 'multiply' }} />
        </>
      ) : null}
    </svg>
  );
};
