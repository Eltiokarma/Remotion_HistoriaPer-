import { clamp } from '../../direction/anim';
import { azar } from '../../direction/azar';
import { fuente } from '../../estilo/fuentes';
import { FiltroTiza, TIZA, TextoTiza } from '../texto/Tiza';

type Props = {
  id: string;
  t: number;
  rotulos: { rapida: string; media: string; lenta: string };
  /** Nombres que aparecen y se borran en la capa de arriba. */
  nombres: string[];
  /** 0–1: el marco (las tres franjas, vacías). */
  marco: number;
  /** 0–1 por capa: cuánto está dibujada (se dibuja de izquierda a derecha, con tiza). */
  dibujo: [number, number, number];
  /** 0–1 por capa: el foco del profe. La que se nombra brilla; las otras quedan tenues. */
  brillo: [number, number, number];
  /** 0–1: todo se apaga (para escribir encima). */
  apaga?: number;
};

const BANDAS = [[190, 370], [400, 590], [620, 790]] as const;
const X0 = 430, X1 = 1790;
/** Tizas de color para la tierra: ocre, arcilla y piedra (las de la caja de cualquier aula). */
const TIERRA = ['#dcb574', '#c4835e', '#9e8a73'] as const;

/**
 * La idea de Braudel en la pizarra, como la dibujaría un profe: tres franjas, cada una con su ola
 * (nerviosa arriba, larga al medio, casi plana abajo) y su rótulo escrito a mano. Brilla la que se
 * está nombrando (DIRECCION_DE_VIDEO §2.2).
 */
export const CapasTiza: React.FC<Props> = ({ id, t, rotulos, nombres, marco, dibujo, brillo, apaga = 0 }) => {
  const ola = (i: number) => {
    let d = '';
    for (let x = X0; x <= X1; x += 4) {
      const mid = (BANDAS[i][0] + BANDAS[i][1]) / 2;
      const y = i === 0 ? mid + 34 * Math.sin(x / 13 + t * 7) * (0.6 + 0.4 * Math.sin(x / 71 + 1.7)) + 10 * Math.sin(x / 5.3 - t * 9)
        : i === 1 ? mid + 52 * Math.sin((x + t * 26) / 190) + 14 * Math.sin((x + t * 26) / 63 + 1.1)
          : mid + 8 * Math.sin((x + t * 2) / 420);
      d += `${x === X0 ? 'M' : 'L'}${x} ${y.toFixed(1)} `;
    }
    return d;
  };
  // capa de abajo: la tierra en corte, como la dibuja un profe con la tiza de costado. La superficie
  // (lomas suaves que casi no se mueven) y tres estratos de color que se apagan hacia abajo.
  const suelo = (x: number, dy: number) => 650 + dy + 12 * Math.sin((x + t * 2) / 260 + dy / 40) + 7 * Math.sin((x + 60 * dy) / 97 + 0.6);
  const curva = (dy: number) => {
    let d = '';
    for (let x = X0; x <= X1; x += 6) d += `${x === X0 ? 'M' : 'L'}${x} ${suelo(x, dy).toFixed(1)} `;
    return d;
  };
  const franja = (dy0: number, dy1: number) => {
    let d = curva(dy0);
    for (let x = X1; x >= X0; x -= 6) d += `L${x} ${dy1 >= 140 ? 790 : suelo(x, dy1).toFixed(1)} `;
    return d + 'Z';
  };
  const ESTRATOS = [[0, 38], [38, 82], [82, 140]] as const;
  // piedritas en el estrato de abajo y raíces cortas bajo la superficie (con semilla: siempre las mismas)
  const piedras = Array.from({ length: 46 }, (_, n) => {
    const r = azar(n * 911 + 5);
    const x = r.rango(X0 + 10, X1 - 10);
    return { x, y: r.rango(suelo(x, 92), 782), rx: r.rango(4, 11), ry: r.rango(3, 7), rot: r.rango(-30, 30) };
  });
  const raices = Array.from({ length: 22 }, (_, n) => {
    const r = azar(n * 397 + 3);
    const x = r.rango(X0 + 20, X1 - 20), y = suelo(x, 0);
    const l = r.rango(14, 30);
    return `M${x.toFixed(0)} ${(y + 2).toFixed(0)} q ${r.rango(-8, 8).toFixed(0)} ${(l / 2).toFixed(0)} ${r.rango(-10, 10).toFixed(0)} ${l.toFixed(0)}`;
  });
  // la tiza de costado: rayas inclinadas que rellenan cada estrato (más densas arriba)
  const rayado = (k: number) => Array.from({ length: 150 }, (_, n) => {
    const r = azar(n * 131 + k * 17);
    const x = r.rango(X0, X1);
    const y0 = suelo(x, ESTRATOS[k][0]) + 3, y1 = k === 2 ? 786 : suelo(x, ESTRATOS[k][1]) - 2;
    const y = y0 + (y1 - y0) * Math.pow(r.rango(0, 1), 1.8);
    const l = r.rango(10, 26);
    return `M${x.toFixed(0)} ${y.toFixed(0)} l ${(l * 0.9).toFixed(0)} ${(-l * 0.25).toFixed(0)}`;
  }).join(' ');
  // los nombres de la capa de arriba: aparecen escritos y se borran enseguida
  const PASO = 0.5, VIDA = 1.2;
  const ahora = Math.floor(t / PASO);
  const vivos = Array.from({ length: 4 }, (_, k) => ahora - k).filter((n) => n >= 0).map((n) => {
    const r = azar(n * 4729 + 11);
    return { n, nombre: nombres[(n * 7) % nombres.length], x: r.rango(X0 + 40, X1 - 300), y: r.rango(BANDAS[0][0] + 40, BANDAS[0][0] + 70), edad: t - n * PASO };
  }).filter((v) => v.edad >= 0 && v.edad < VIDA);
  const rotulo = [rotulos.rapida, rotulos.media, rotulos.lenta];
  const tempo = ['días · años', 'décadas', 'siglos'];
  const capa = (i: number) => (0.32 + 0.68 * clamp(brillo[i])) * (1 - 0.75 * apaga);
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <FiltroTiza id={`${id}-tiza`} semilla={11} />
        {TIERRA.map((c, k) => (
          <linearGradient key={k} id={`${id}-tierra${k}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c} stopOpacity={0.62} />
            <stop offset="0.55" stopColor={c} stopOpacity={0.3} />
            <stop offset="1" stopColor={c} stopOpacity={0.08} />
          </linearGradient>
        ))}
        <filter id={`${id}-polvo`} x="-2%" y="-10%" width="104%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.35" numOctaves={3} seed={23} result="ruido" />
          <feColorMatrix in="ruido" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.2 -0.7" result="mascara" />
          <feComposite in="SourceGraphic" in2="mascara" operator="in" />
        </filter>
        {[0, 1, 2].map((i) => (
          <clipPath key={i} id={`${id}-dib${i}`}><rect x={X0 - 10} y={0} width={(X1 - X0 + 20) * clamp(dibujo[i])} height={1080} /></clipPath>
        ))}
      </defs>
      {/* el marco: las franjas, con tiza tenue */}
      <g opacity={0.45 * marco * (1 - 0.6 * apaga)} filter={`url(#${id}-tiza)`}>
        {BANDAS.map(([a, b], i) => (
          <g key={i}>
            <line x1={X0} x2={X1} y1={a} y2={a} stroke={TIZA} strokeWidth={2.5} />
            <line x1={X0} x2={X1} y1={b} y2={b} stroke={TIZA} strokeWidth={1.6} strokeDasharray="14 12" />
          </g>
        ))}
      </g>
      {[0, 1, 2].map((i) => (
        <g key={i} opacity={dibujo[i] > 0 ? capa(i) : 0}>
          {/* el foco: un halo de tiza detrás de la ola que se está nombrando */}
          {brillo[i] > 0.05 ? (
            <path d={i === 2 ? curva(0) : ola(i)} fill="none" stroke={TIZA} strokeWidth={14} opacity={0.18 * brillo[i]} style={{ filter: 'blur(10px)' }} clipPath={`url(#${id}-dib${i})`} />
          ) : null}
          <g clipPath={`url(#${id}-dib${i})`} filter={`url(#${id}-tiza)`}>
            {i < 2 ? <path d={ola(i)} fill="none" stroke={TIZA} strokeWidth={i === 0 ? 3 : 4} strokeLinejoin="round" /> : null}
          </g>
          {i === 2 ? (
            <g clipPath={`url(#${id}-dib2)`}>
              {/* el relleno de color, con la tiza de costado: degradado y polvo */}
              <g filter={`url(#${id}-polvo)`}>
                {ESTRATOS.map(([a, z], k) => <path key={k} d={franja(a, z)} fill={`url(#${id}-tierra${k})`} />)}
              </g>
              <g filter={`url(#${id}-tiza)`}>
                {ESTRATOS.map((_, k) => <path key={k} d={rayado(k)} stroke={TIERRA[k]} strokeWidth={2.2} opacity={0.4} strokeLinecap="round" />)}
                {piedras.map((p, n) => (
                  <ellipse key={n} cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} transform={`rotate(${p.rot.toFixed(0)} ${p.x.toFixed(0)} ${p.y.toFixed(0)})`}
                    fill={TIERRA[2]} fillOpacity={0.25} stroke={TIZA} strokeWidth={1.6} opacity={0.7} />
                ))}
                <path d={raices.join(' ')} fill="none" stroke={TIERRA[0]} strokeWidth={1.6} opacity={0.6} />
                {/* los bordes entre estratos y, arriba, la superficie con más fuerza */}
                <path d={curva(ESTRATOS[1][0])} fill="none" stroke={TIZA} strokeWidth={2} opacity={0.55} strokeDasharray="30 8 4 8" />
                <path d={curva(ESTRATOS[2][0])} fill="none" stroke={TIZA} strokeWidth={2} opacity={0.5} strokeDasharray="22 10" />
                <path d={curva(0)} fill="none" stroke={TIZA} strokeWidth={4.5} strokeLinejoin="round" />
              </g>
            </g>
          ) : null}
          <TextoTiza id={`${id}-rot${i}`} texto={rotulo[i]} x={110} y={BANDAS[i][0] + 62} k={clamp(dibujo[i] * 1.6)} size={rotulo[i].length > 14 ? 34 : 42}
            fontFamily={fuente.imprentaItalica} brillo={brillo[i]} />
          <TextoTiza id={`${id}-tem${i}`} texto={tempo[i]} x={112} y={BANDAS[i][0] + 106} k={clamp(dibujo[i] * 1.6 - 0.4)} size={24}
            fontFamily={fuente.imprentaItalica} opacidad={0.7} />
        </g>
      ))}
      {/* arriba, los nombres: se escriben y se borran (cambian todo el tiempo) */}
      {dibujo[0] > 0.9 ? vivos.map((v) => (
        <text key={v.n} x={v.x} y={v.y} fill={TIZA} fontFamily={fuente.imprentaItalica} fontSize={30} filter={`url(#${id}-tiza)`}
          opacity={capa(0) * clamp(v.edad / 0.15) * clamp((VIDA - v.edad) / 0.4)}>{v.nombre.charAt(0) + v.nombre.slice(1).toLowerCase()}</text>
      )) : null}
    </svg>
  );
};
