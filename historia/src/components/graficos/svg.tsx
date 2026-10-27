import { azar } from '../../direction/azar';

/**
 * Piezas sueltas para dibujar en SVG: filtros de tinta, bordes de papel y escritura.
 * Todo con azar de semilla: el mismo dibujo en cada cuadro.
 */

/** Bordes de tinta irregulares (la tinta "come" un poco el papel). */
export const FiltroTinta: React.FC<{ id: string; fuerza?: number }> = ({ id, fuerza = 1.6 }) => (
  <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves={2} seed={7} result="r" />
    <feDisplacementMap in="SourceGraphic" in2="r" scale={fuerza} xChannelSelector="R" yChannelSelector="G" />
  </filter>
);

/** Sello de goma gastado: se come partes de la tinta al azar y deja bordes irregulares. */
export const FiltroDesgaste: React.FC<{ id: string; semilla?: number; desgaste?: number }> = ({ id, semilla = 3, desgaste = 0.42 }) => (
  <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves={2} seed={semilla} result="r" />
    {/* convierte el ruido en una máscara dura: donde hay poco, no hay tinta */}
    <feColorMatrix in="r" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -9 ${9 * (1 - desgaste) + 0.5}`} result="m" />
    <feComposite in="SourceGraphic" in2="m" operator="in" result="g" />
    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={1} seed={semilla + 1} result="d" />
    <feDisplacementMap in="g" in2="d" scale={3} xChannelSelector="R" yChannelSelector="G" />
  </filter>
);

/** Sombra suave para objetos sobre la mesa. */
export const FiltroSombra: React.FC<{ id: string; desenfoque?: number }> = ({ id, desenfoque = 8 }) => (
  <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation={desenfoque} />
  </filter>
);

/** Rectángulo de papel con bordes apenas irregulares (no cortado a máquina). */
export const bordePapel = (semilla: number, x: number, y: number, w: number, h: number, temblor = 0.9): string => {
  const r = azar(semilla);
  const pts: [number, number][] = [];
  const paso = 18;
  for (let i = 0; i <= w; i += paso) pts.push([x + i, y + r.rango(-temblor, temblor)]);
  for (let i = 0; i <= h; i += paso) pts.push([x + w + r.rango(-temblor, temblor), y + i]);
  for (let i = w; i >= 0; i -= paso) pts.push([x + i, y + h + r.rango(-temblor, temblor)]);
  for (let i = h; i >= 0; i -= paso) pts.push([x + r.rango(-temblor, temblor), y + i]);
  return 'M' + pts.map(([a, b]) => `${a.toFixed(1)} ${b.toFixed(1)}`).join(' L') + ' Z';
};

/**
 * Escritura "asémica": parece letra cursiva pero no dice nada. Sirve para llenar libros
 * contables y notas al margen sin inventar contenido histórico.
 */
export const trazoManuscrito = (semilla: number, x0: number, y0: number, ancho: number, alto = 14, inclinacion = 0.3): string => {
  const r = azar(semilla);
  const k = alto / 14;
  let x = x0;
  let d = '';
  while (x < x0 + ancho - 12 * k) {
    const fin = Math.min(x + r.rango(28, 86) * k, x0 + ancho);
    d += ` M${x.toFixed(1)} ${y0.toFixed(1)}`;
    while (x < fin) {
      const w = r.rango(5, 11) * k;
      const tipo = r.n();
      const h = tipo < 0.16 ? alto * r.rango(1.0, 1.45) : alto * r.rango(0.32, 0.6); // alta o baja
      const baja = tipo > 0.93 ? alto * 0.75 : 0; // letra con cola
      const sk = h * inclinacion;
      d += ` C ${(x + w * 0.1).toFixed(1)} ${(y0 - h * 0.2).toFixed(1)}, ${(x + w * 0.3 + sk).toFixed(1)} ${(y0 - h).toFixed(1)}, ${(x + w * 0.5 + sk).toFixed(1)} ${(y0 - h).toFixed(1)}`;
      d += ` C ${(x + w * 0.72 + sk).toFixed(1)} ${(y0 - h).toFixed(1)}, ${(x + w * 0.62).toFixed(1)} ${(y0 + baja).toFixed(1)}, ${(x + w).toFixed(1)} ${(y0 + baja * 0.15).toFixed(1)}`;
      x += w;
    }
    x += r.rango(9, 17) * k;
  }
  return d.trim();
};

/** Renglones de texto a máquina vistos de lejos: bloques del ancho de palabras. */
export const renglonesTipeados = (
  semilla: number, x0: number, y0: number, ancho: number, lineas: number, interlinea: number,
): { x: number; y: number; w: number }[] => {
  const r = azar(semilla);
  const out: { x: number; y: number; w: number }[] = [];
  let y = y0;
  let enParrafo = 0;
  for (let i = 0; i < lineas; i++) {
    const fin = r.n() < 0.18 && enParrafo > 2; // última línea de párrafo, más corta
    let x = x0 + (enParrafo === 0 ? 22 : 0);
    const limite = fin ? x0 + ancho * r.rango(0.25, 0.7) : x0 + ancho;
    while (x < limite - 14) {
      const w = Math.min(r.rango(14, 58), limite - x);
      if (w > 6) out.push({ x, y, w });
      x += w + r.rango(6, 9);
    }
    y += interlinea;
    enParrafo = fin ? 0 : enParrafo + 1;
    if (fin) y += interlinea * 0.5;
  }
  return out;
};
