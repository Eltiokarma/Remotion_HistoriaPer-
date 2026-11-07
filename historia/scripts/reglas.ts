/**
 * Reglas del canal sobre el código (historia/CLAUDE.md §4, §11 y §15), comprobadas en cada archivo
 * .ts/.tsx de src/ y laboratorio/. Fallan aunque un skill o una costumbre digan otra cosa: así se
 * cumplen siempre, no solo cuando el agente se acuerda.
 *
 *   npm run reglas            → revisa el código; sale con error si hay una violación
 *   npm run reglas -- --probar → prueba que cada regla atrapa lo que debe y deja pasar lo permitido
 *
 * Excepción declarada (con motivo, como en escenas.json): un comentario en la misma línea o en la
 * anterior:   // reglas-permitir: reloj — R3F pide una marca de tiempo en advance(); no anima nada
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const RAIZ = join(__dirname, '..');
const CARPETAS = ['src', 'laboratorio/remotion', 'laboratorio/muestras'];

type Regla = {
  id: string;
  /** Qué está mal y qué se hace en su lugar. */
  explicacion: string;
  patron: RegExp;
  /** Archivos (ruta relativa a historia/) donde la regla no aplica. */
  permitidoEn?: string[];
  /** La línea coincide con el patrón pero está permitida (p. ej. un peso del canal escrito en línea). */
  excepto?: (linea: string) => boolean;
};

/**
 * Los cinco pesos del canal, leídos de src/direction/easings.ts (fuente única). Remotion Studio escribe
 * las curvas en línea como Easing.bezier(a, b, c, d): si los números son exactamente un peso, se permite
 * (laboratorio/muestras/12-titulo-editable). Cualquier otra curva sigue siendo una falta.
 */
const PESOS: string[] = (() => {
  const texto = readFileSync(join(__dirname, '..', 'src', 'direction', 'easings.ts'), 'utf8');
  return [...texto.matchAll(/Easing\.bezier\(([^)]*)\)/g)].map((m) => m[1].split(',').map((n) => Number(n)).join(','));
})();
const esPeso = (args: string) => PESOS.includes(args.split(',').map((n) => Number(n)).join(','));
const soloPesos = (linea: string): boolean => {
  const usos = [...linea.matchAll(/\bEasing\.(\w+)(\(([^)]*)\))?/g)];
  return usos.length > 0 && usos.every((u) => u[1] === 'bezier' && u[3] !== undefined && esPeso(u[3]));
};

export const REGLAS: Regla[] = [
  {
    id: 'easing-suelto',
    explicacion: 'Curva de animación suelta. Los pesos viven en src/direction/easings.ts y se usan con tramo(t, desde, dura, peso) (§4, §11, §15).',
    patron: /\bEasing\.\w+/,
    permitidoEn: ['src/direction/easings.ts'],
    excepto: soloPesos,
  },
  {
    id: 'azar-sin-semilla',
    explicacion: 'Azar sin semilla: cada cuadro saldría distinto. Usar azar(semilla) de src/direction/azar.ts (§11).',
    patron: /\bMath\.random\s*\(|\bcrypto\.getRandomValues\s*\(/,
  },
  {
    id: 'reloj',
    explicacion: 'Reloj del sistema: la animación tiene que depender del cuadro (useCurrentFrame), no de la hora (§11).',
    patron: /\bDate\.now\s*\(|\bnew Date\s*\(|\bperformance\.now\s*\(/,
  },
  {
    id: 'temporizador',
    explicacion: 'setTimeout/setInterval: Remotion dibuja cada cuadro por separado; nada se anima con temporizadores (§11).',
    patron: /\bset(Timeout|Interval)\s*\(/,
  },
  {
    id: 'css-animado',
    explicacion: 'Transición o animación CSS: no se renderiza bien. Animar con useCurrentFrame + interpolate/tramo (§11).',
    patron: /(^|[\s{,'"])(transition|animation|animationName)\s*:|@keyframes|\banimate-[a-z]/,
  },
  {
    id: 'fuente-remota',
    explicacion: 'Fuente desde internet: el canal usa las fuentes locales de public/compartido/fuentes (estilo/fuentes.ts, §15).',
    patron: /fonts\.googleapis\.com|fonts\.gstatic\.com|@remotion\/google-fonts/,
  },
  {
    id: 'fondo-sin-espera',
    explicacion: 'Imagen como fondo CSS que no es una textura del canal: Remotion no la espera y puede faltar en un cuadro. Usar <Img> o agregarla a PrecargaTexturas (laboratorio/INFORME_TECNICO.md §6.2).',
    patron: /url\(\$\{(?!textura\.)/,
  },
];

/** Quita comentarios /* … *\/ y // … (fuera de cadenas simples) conservando los saltos de línea. */
const sinComentarios = (codigo: string): string =>
  codigo
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .split('\n')
    .map((l) => l.replace(/(^|[^:'"`\\])\/\/.*$/, '$1'))
    .join('\n');

const PERMISO = /reglas-permitir:\s*([\w-]+)\s*[—–-]\s*(.{10,})/;

export type Falta = { archivo: string; linea: number; regla: string; texto: string };

export const revisarTexto = (archivo: string, codigo: string): { faltas: Falta[]; excepciones: Falta[] } => {
  const original = codigo.split('\n');
  const limpio = sinComentarios(codigo).split('\n');
  const faltas: Falta[] = [];
  const excepciones: Falta[] = [];
  limpio.forEach((linea, i) => {
    for (const r of REGLAS) {
      if (r.permitidoEn?.includes(archivo) || !r.patron.test(linea) || r.excepto?.(linea)) continue;
      const f = { archivo, linea: i + 1, regla: r.id, texto: original[i].trim() };
      const permiso = [original[i], original[i - 1] ?? ''].map((l) => l.match(PERMISO)).find((m) => m && m[1] === r.id);
      (permiso ? excepciones : faltas).push(permiso ? { ...f, texto: `motivo: ${permiso[2].trim()}` } : f);
    }
  });
  return { faltas, excepciones };
};

const archivos = (dir: string): string[] =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return n === 'node_modules' ? [] : archivos(p);
    return /\.tsx?$/.test(n) ? [p] : [];
  });

const probar = (): number => {
  // cada caso: [regla esperada o null, código]
  const casos: [string | null, string][] = [
    ['easing-suelto', "const e = Easing.bezier(0.2, 0, 0.3, 1);"],
    ['easing-suelto', "interpolate(f, [0, 9], [0, 1], { easing: Easing.inOut(Easing.ease) })"],
    [null, "opacity: interpolate(frame, [0, 9], [0, 1], { easing: Easing.bezier(0.65, 0, 0.35, 1) }),"],
    [null, "interpolate(frame, [0, 9], [0, 1], { easing: Easing.bezier(0.20, 0.6, 0.3, 1.0) })"],
    ['easing-suelto', "interpolate(frame, [0, 9], [0, 1], { easing: Easing.bezier(0.65, 0, 0.35, 0.9) })"],
    ['easing-suelto', "a: Easing.bezier(0.65, 0, 0.35, 1), b: Easing.linear"],
    ['azar-sin-semilla', 'const x = Math.random() * 10;'],
    ['reloj', 'const t = Date.now();'],
    ['reloj', 'advance(performance.now());'],
    ['temporizador', 'setTimeout(() => listo(), 100);'],
    ['css-animado', "style={{ opacity: 1, transition: 'opacity 1s' }}"],
    ['css-animado', '<div className="animate-pulse" />'],
    ['fuente-remota', "import { loadFont } from '@remotion/google-fonts/Inter';"],
    ['fondo-sin-espera', 'backgroundImage: `url(${staticFile("foto.jpg")})`'],
    [null, 'backgroundImage: `url(${textura.papel})`'],
    [null, '// Math.random() está prohibido: usar azar()'],
    [null, '/* Easing.bezier solo en easings.ts */ const p = tramo(t, 0, 1, "solemne");'],
    [null, 'const transicion_salida = "duro";'],
    [null, 'requestAnimationFrame(alDibujar);'],
    [null, "advance(performance.now()); // reglas-permitir: reloj — R3F pide una marca de tiempo; no anima nada"],
    ['reloj', "advance(performance.now()); // reglas-permitir: reloj — corto"],
  ];
  let mal = 0;
  for (const [esperada, codigo] of casos) {
    const { faltas } = revisarTexto('src/prueba.tsx', codigo);
    const obtenida = faltas[0]?.regla ?? null;
    const ok = obtenida === esperada && faltas.length <= 1;
    if (!ok) mal++;
    console.log(`${ok ? '✓' : '✗'} ${esperada ?? 'permitido'} ← ${codigo}${ok ? '' : `   (obtuvo: ${faltas.map((f) => f.regla).join(', ') || 'nada'})`}`);
  }
  // easings.ts es el único lugar donde Easing.* está permitido
  const enEasings = revisarTexto('src/direction/easings.ts', 'solemne: Easing.bezier(0.65, 0, 0.35, 1),').faltas.length === 0;
  console.log(`${enEasings ? '✓' : '✗'} Easing.bezier permitido en src/direction/easings.ts`);
  if (!enEasings) mal++;
  console.log(mal ? `\n${mal} caso(s) fallaron` : `\nTodas las reglas se comportan como se espera (${casos.length + 1} casos).`);
  return mal ? 1 : 0;
};

const main = (): number => {
  if (process.argv.includes('--probar')) return probar();
  const todas = CARPETAS.flatMap((c) => archivos(join(RAIZ, c)));
  const faltas: Falta[] = [];
  const excepciones: Falta[] = [];
  for (const a of todas) {
    const r = revisarTexto(relative(RAIZ, a), readFileSync(a, 'utf8'));
    faltas.push(...r.faltas);
    excepciones.push(...r.excepciones);
  }
  for (const e of excepciones) console.log(`  excepción declarada  ${e.archivo}:${e.linea}  [${e.regla}] ${e.texto}`);
  for (const f of faltas) {
    const r = REGLAS.find((x) => x.id === f.regla);
    console.log(`✗ ${f.archivo}:${f.linea}  [${f.regla}] ${f.texto}\n    ${r?.explicacion}`);
  }
  console.log(faltas.length
    ? `\n${faltas.length} violación(es) de las reglas del canal en ${todas.length} archivos.`
    : `✓ ${todas.length} archivos sin violaciones (${excepciones.length} excepción(es) declarada(s)).`);
  return faltas.length ? 1 : 0;
};

process.exit(main());
