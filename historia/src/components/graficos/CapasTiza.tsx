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
  // capa de abajo: dos estratos más, casi quietos
  const estrato = (dy: number) => {
    let d = '';
    for (let x = X0; x <= X1; x += 8) d += `${x === X0 ? 'M' : 'L'}${x} ${(705 + dy + 6 * Math.sin((x + 80 * dy) / 380)).toFixed(1)} `;
    return d;
  };
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
            <path d={ola(i)} fill="none" stroke={TIZA} strokeWidth={14} opacity={0.18 * brillo[i]} style={{ filter: 'blur(10px)' }} clipPath={`url(#${id}-dib${i})`} />
          ) : null}
          <g clipPath={`url(#${id}-dib${i})`} filter={`url(#${id}-tiza)`}>
            <path d={ola(i)} fill="none" stroke={TIZA} strokeWidth={i === 0 ? 3 : 4} strokeLinejoin="round" />
            {i === 2 ? [<path key="a" d={estrato(34)} fill="none" stroke={TIZA} strokeWidth={3} />, <path key="b" d={estrato(62)} fill="none" stroke={TIZA} strokeWidth={3} />] : null}
          </g>
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
