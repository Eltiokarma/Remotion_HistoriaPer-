/**
 * Crea un video nuevo, listo para abrir en el Studio.
 *
 *   npm run nuevo-video -- 001-reformas "El fracaso de las reformas coloniales"
 *   npm run nuevo-video -- 001-reformas "El fracaso…" --desde 000-quiroz
 *
 * Hace tres cosas:
 *  1. videos/<id>/ con escenas.json, guion.md, fuentes.md, glosario.txt y voz_provisional.txt
 *     (de videos/_plantilla/, o el escenas.json de otro video con --desde, para reciclarlo)
 *  2. public/videos/<id>/{musica,voz,imagenes}/ para los archivos de ese video
 *  3. lo agrega a src/registro.ts, así aparece en el Studio
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(__dirname, '..');
const VIDEOS = path.join(RAIZ, 'videos');
const PLANTILLA = path.join(VIDEOS, '_plantilla');
const REGISTRO = path.join(RAIZ, 'src', 'registro.ts');
const MARCA_IMPORT = '// ↑ nuevos videos aquí';
const MARCA_LISTA = '  // ↑ y aquí';

const salir = (msg: string): never => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};

const args = process.argv.slice(2);
const iDesde = args.indexOf('--desde');
const desde = iDesde >= 0 ? args[iDesde + 1] : undefined;
const [id, titulo] = args.filter((_, i) => iDesde < 0 || (i !== iDesde && i !== iDesde + 1));

if (!id || !titulo) salir('uso: npm run nuevo-video -- 001-nombre "Título del video" [--desde 000-otro]');
if (!/^\d{3}-[a-z0-9-]+$/.test(id)) salir(`el id es NNN-nombre en minúsculas y sin tildes (p. ej. 001-reformas), no "${id}"`);
const existentes = readdirSync(VIDEOS).filter((d) => !d.startsWith('_'));
if (existentes.includes(id)) salir(`ya existe videos/${id}/`);
const mismoNumero = existentes.find((d) => d.slice(0, 3) === id.slice(0, 3));
if (mismoNumero) salir(`el número ${id.slice(0, 3)} ya lo usa videos/${mismoNumero}/`);
if (desde && !existsSync(path.join(VIDEOS, desde, 'escenas.json'))) salir(`no existe videos/${desde}/escenas.json`);

const registro = readFileSync(REGISTRO, 'utf8');
if (!registro.includes(MARCA_IMPORT) || !registro.includes(MARCA_LISTA)) salir('src/registro.ts perdió sus marcas «↑ nuevos videos aquí» y «↑ y aquí»: agrégalo a mano');

// 1. carpeta del video
const destino = path.join(VIDEOS, id);
mkdirSync(destino);
const rellenar = (texto: string) => texto.replaceAll('{{ID}}', id).replaceAll('{{TITULO}}', titulo);
for (const archivo of readdirSync(PLANTILLA)) {
  if (archivo === 'escenas.json' && desde) continue;
  writeFileSync(path.join(destino, archivo), rellenar(readFileSync(path.join(PLANTILLA, archivo), 'utf8')));
}
if (desde) {
  const base = JSON.parse(readFileSync(path.join(VIDEOS, desde, 'escenas.json'), 'utf8'));
  writeFileSync(path.join(destino, 'escenas.json'), `${JSON.stringify({ ...base, id, titulo }, null, 2)}\n`);
  // el glosario del otro video suele servir de punto de partida
  if (existsSync(path.join(VIDEOS, desde, 'glosario.txt'))) copyFileSync(path.join(VIDEOS, desde, 'glosario.txt'), path.join(destino, 'glosario.txt'));
}

// 2. carpetas de archivos (voz/ e imagenes/ quedan fuera de git; ver .gitignore)
for (const sub of ['musica', 'voz', 'imagenes']) mkdirSync(path.join(RAIZ, 'public', 'videos', id, sub), { recursive: true });
writeFileSync(path.join(RAIZ, 'public', 'videos', id, 'musica', '.gitkeep'), '');

// 3. registro
const nombre = `v${id.replace(/-/g, '_')}`;
writeFileSync(
  REGISTRO,
  registro
    .replace(MARCA_IMPORT, `import ${nombre} from '../videos/${id}/escenas.json';\n${MARCA_IMPORT}`)
    .replace(MARCA_LISTA, `  ${nombre},\n${MARCA_LISTA}`),
);

console.log(`✓ videos/${id}/ creado${desde ? ` a partir de ${desde}` : ''} y agregado al Studio (v${id}).

Siguientes pasos:
  1. Escribe guion.md y pasa cada escena a escenas.json (busca «POR COMPLETAR»).
     Las escenas que se pueden reciclar están en la carpeta «catalogo» del Studio.
  2. npm run validar -- ${id}
  3. npm run studio`);
if (desde) console.log(`\nOjo: la música de ${desde} no se copia. Pon la de este video en public/videos/${id}/musica/ o cambia "musica" en escenas.json.`);
