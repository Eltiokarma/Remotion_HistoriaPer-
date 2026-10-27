type Props = {
  valor: number;
  /** Cuántas cifras tiene el contador (las de la izquierda aparecen al llegar a ellas). */
  digitos: number;
  /** Cuánto cambia el valor por segundo (para el desenfoque de las cifras que giran rápido). */
  velocidad?: number;
  fps: number;
  fontFamily: string;
  fontSize: number;
  color: string;
  /** Espacio entre grupos de miles, en em. */
  separacion?: number;
};

/**
 * Contador mecánico: cada cifra es un rodillo que gira. Las cifras de la derecha giran tan
 * rápido que se desenfocan: el número "se infla" a la vista.
 */
export const Odometro: React.FC<Props> = ({ valor, digitos, velocidad = 0, fps, fontFamily, fontSize, color, separacion = 0.28 }) => {
  const alto = fontSize * 1.18;
  const cifras = Array.from({ length: digitos }, (_, i) => digitos - 1 - i); // posición decimal, de izquierda a derecha
  return (
    <div style={{ display: 'flex', fontFamily, fontSize, color, lineHeight: `${alto}px`, fontVariantNumeric: 'tabular-nums lining-nums' }}>
      {cifras.map((p, i) => {
        const escala = 10 ** p;
        // Como un contador real: el rodillo de la derecha gira siempre; los demás solo avanzan
        // cuando el de su derecha pasa de 9 a 0 (en el último 10 % de su vuelta).
        const entero = Math.floor(valor / escala) % 10;
        const resto = (valor % escala) / escala;
        const pos = p === 0 ? (valor % 10) : entero + Math.max(0, (resto - 0.9) / 0.1);
        const visible = p === 0 ? 1 : Math.max(0, Math.min(1, (valor / escala - 0.9) / 0.1));
        const giro = velocidad / escala / fps; // cifras por cuadro
        const desenfoque = Math.min(5, giro * fontSize * 0.08);
        return (
          <div key={p} style={{ display: 'flex' }}>
            <div style={{ height: alto, overflow: 'hidden', opacity: visible, width: visible > 0 ? undefined : 0 }}>
              <div style={{ transform: `translateY(${-pos * alto}px)`, filter: desenfoque > 0.3 ? `blur(${desenfoque}px)` : undefined }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, k) => <div key={k} style={{ height: alto, textAlign: 'center' }}>{d}</div>)}
              </div>
            </div>
            {/* separador de miles (un espacio de verdad: en flex los espacios de texto se pierden) */}
            {p > 0 && p % 3 === 0 && visible > 0 && i < cifras.length - 1 ? <div style={{ width: `${separacion}em` }} /> : null}
          </div>
        );
      })}
    </div>
  );
};
