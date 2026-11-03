#!/usr/bin/env node
// Genera ROADMAP.md (raíz del repo) a partir de roadmap/roadmap.json, la única fuente.
//   node roadmap/generar.mjs              → valida y escribe ROADMAP.md
//   node roadmap/generar.mjs --comprobar  → valida y falla si ROADMAP.md no coincide con el JSON
// Sin dependencias: Node 18+.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const FUENTE = join(RAIZ, 'roadmap', 'roadmap.json');
const DESTINO = join(RAIZ, 'ROADMAP.md');

const ESTADOS = {
  hecho: '✅ hecho',
  en_curso: '🔄 en curso',
  pendiente: '⏳ pendiente',
  propuesto: '💡 propuesto',
  bloqueado: '⛔ bloqueado',
  descartado: '✖️ descartado',
};
const FECHA = /^\d{4}-\d{2}-\d{2}$/;

const datos = JSON.parse(readFileSync(FUENTE, 'utf8'));

// --- validación: el JSON tiene que ser coherente antes de dibujar nada -------------------------
const errores = [];
const ids = new Set();
const fases = new Set(datos.fases.map((f) => f.id));
for (const t of datos.tareas) {
  if (ids.has(t.id)) errores.push(`${t.id}: id repetido`);
  ids.add(t.id);
}
for (const t of datos.tareas) {
  const e = (m) => errores.push(`${t.id}: ${m}`);
  if (!fases.has(t.fase)) e(`fase desconocida «${t.fase}»`);
  if (!(t.estado in ESTADOS)) e(`estado desconocido «${t.estado}» (válidos: ${Object.keys(ESTADOS).join(', ')})`);
  for (const d of t.depende_de) if (!ids.has(d)) e(`depende de «${d}», que no existe`);
  for (const campo of ['prevista', 'real']) {
    const r = t[campo];
    if (r == null) continue;
    for (const k of ['inicio', 'fin']) if (r[k] != null && !FECHA.test(r[k])) e(`${campo}.${k} no es AAAA-MM-DD`);
    if (r.inicio && r.fin && r.fin < r.inicio) e(`${campo}: termina antes de empezar`);
  }
  if (t.estado === 'hecho' && !t.real?.fin) e('está hecho pero no tiene fecha real de fin');
  if (t.estado === 'bloqueado' && !t.bloqueo) e('está bloqueado pero no dice por qué');
  if (t.estado === 'hecho' && t.evidencia.length === 0) e('está hecho pero no enlaza evidencia');
  if (t.prevista && t.prevista.origen !== 'propuesta' && t.prevista.origen !== 'acordada') e('prevista.origen debe ser «propuesta» o «acordada»');
  for (const ev of t.evidencia) if (!/^https?:/.test(ev) && ev !== 'ROADMAP.md' && !existsSync(join(RAIZ, ev))) e(`evidencia que no existe: ${ev}`);
  for (const k of ['humano_min', 'render_s']) if (t.tiempo?.[k] != null && typeof t.tiempo[k] !== 'number') e(`tiempo.${k} debe ser número o null`);
}
// ciclos en las dependencias
const porId = Object.fromEntries(datos.tareas.map((t) => [t.id, t]));
const visitando = new Set(), listo = new Set();
const recorrer = (id, camino) => {
  if (listo.has(id) || !porId[id]) return;
  if (visitando.has(id)) { errores.push(`dependencia circular: ${[...camino, id].join(' → ')}`); return; }
  visitando.add(id);
  for (const d of porId[id].depende_de) recorrer(d, [...camino, id]);
  visitando.delete(id);
  listo.add(id);
};
for (const t of datos.tareas) recorrer(t.id, []);
if (errores.length) {
  console.error(`roadmap.json tiene errores:\n- ${errores.join('\n- ')}`);
  process.exit(1);
}

// --- dibujo -------------------------------------------------------------------------------------
const dias = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000) + 1;
const limpio = (s) => s.replace(/[:#;]/g, ' ').replace(/\s+/g, ' ').trim();
const nulo = (v, sufijo = '') => (v == null ? '¿?' : `${v}${sufijo}`);
const enlace = (ev) => `[${ev.split('/').slice(-2).join('/')}](${ev})`;
const rango = (r) => (r ? (r.inicio === r.fin ? r.inicio : `${r.inicio} → ${r.fin ?? '…'}`) : '—');

const lineas = [];
const L = (s = '') => lineas.push(s);

L(`# ${datos.titulo}`);
L();
L(`<!-- GENERADO por roadmap/generar.mjs a partir de roadmap/roadmap.json. No editar a mano: editar el JSON y regenerar. -->`);
L();
L(`Actualizado: **${datos.actualizado}**. Fuente única: [\`roadmap/roadmap.json\`](roadmap/roadmap.json). Para cambiar algo, se edita el JSON y se corre \`node roadmap/generar.mjs\` (la CI comprueba que este archivo coincida).`);
L();
for (const n of datos.notas) L(`- ${n}`);
L();

// resumen
const cuenta = {};
for (const t of datos.tareas) cuenta[t.estado] = (cuenta[t.estado] ?? 0) + 1;
L('## Resumen');
L();
L(Object.keys(ESTADOS).filter((k) => cuenta[k]).map((k) => `${ESTADOS[k]}: **${cuenta[k]}**`).join(' · '));
L();
const bloqueos = datos.tareas.filter((t) => t.bloqueo);
if (bloqueos.length) {
  L('**Bloqueos y condiciones abiertas**');
  L();
  for (const t of bloqueos) L(`- \`${t.id}\` ${t.titulo}: ${t.bloqueo}`);
  L();
}

// gantt
L('## Vista temporal');
L();
L('Barras completas: fechas reales. Barras de lo pendiente: fechas previstas (las «propuestas» esperan confirmación). Las tareas sin fecha se listan debajo.');
L();
L('```mermaid');
L('gantt');
L('  dateFormat YYYY-MM-DD');
L('  axisFormat %d %b');
L('  todayMarker off');
const sinFecha = [];
for (const f of datos.fases) {
  const ts = datos.tareas.filter((t) => t.fase === f.id);
  const conFecha = ts.filter((t) => (t.real?.inicio && t.real?.fin) || (t.prevista?.inicio && t.prevista?.fin));
  sinFecha.push(...ts.filter((t) => !conFecha.includes(t)));
  if (!conFecha.length) continue;
  L(`  section ${limpio(f.titulo)}`);
  for (const t of conFecha) {
    const r = t.real?.inicio && t.real?.fin ? t.real : t.prevista;
    const marca = t.estado === 'hecho' ? 'done, ' : t.estado === 'en_curso' ? 'active, ' : t.estado === 'bloqueado' ? 'crit, ' : '';
    const prop = r === t.prevista && t.prevista.origen === 'propuesta' ? ' (propuesta)' : '';
    L(`  ${limpio(t.titulo)}${prop} :${marca}${t.id.replace(/[^a-z0-9]/gi, '')}, ${r.inicio}, ${dias(r.inicio, r.fin)}d`);
  }
}
L('```');
L();
if (sinFecha.length) {
  L(`Sin fecha (${sinFecha.length}): ${sinFecha.map((t) => `\`${t.id}\` (${ESTADOS[t.estado]})`).join(', ')}.`);
  L();
}

// lista
L('## Tareas');
L();
L('Tiempo: **H** = humano (min), **A** = ejecución del agente (ventana de reloj), **R** = render (s de pared) y máquina. `¿?` = desconocido, no medido.');
L();
for (const f of datos.fases) {
  const ts = datos.tareas.filter((t) => t.fase === f.id);
  if (!ts.length) continue;
  L(`### ${f.titulo}`);
  L();
  for (const t of ts) {
    const marca = t.estado === 'hecho' ? 'x' : ' ';
    L(`- [${marca}] **${t.titulo}** \`${t.id}\` — ${ESTADOS[t.estado]}`);
    L(`  - Entregable: ${t.entregable}`);
    if (t.depende_de.length) L(`  - Depende de: ${t.depende_de.map((d) => `\`${d}\``).join(', ')}`);
    const prev = t.prevista ? `${rango(t.prevista)} (${t.prevista.origen})` : '—';
    L(`  - Prevista: ${prev} · Real: ${rango(t.real)}`);
    const tm = t.tiempo ?? {};
    const maquina = tm.maquina ? ` en ${tm.maquina}` : '';
    L(`  - Tiempo: H ${nulo(tm.humano_min)} · A ${nulo(tm.agente)} · R ${nulo(tm.render_s, ' s')}${tm.render_s != null ? maquina : ''} · tokens ¿?`);
    if (t.bloqueo) L(`  - Bloqueo: ${t.bloqueo}`);
    if (t.nota) L(`  - Nota: ${t.nota}`);
    if (t.evidencia.length) L(`  - Evidencia: ${t.evidencia.map(enlace).join(' · ')}`);
  }
  L();
}

L('## Máquinas');
L();
for (const [id, d] of Object.entries(datos.maquinas)) L(`- \`${id}\`: ${d}`);
L();

const salida = lineas.join('\n');
if (process.argv.includes('--comprobar')) {
  const actual = existsSync(DESTINO) ? readFileSync(DESTINO, 'utf8') : '';
  if (actual !== salida) {
    console.error('ROADMAP.md no coincide con roadmap/roadmap.json. Correr: node roadmap/generar.mjs');
    process.exit(1);
  }
  console.log('ROADMAP.md coincide con roadmap/roadmap.json');
} else {
  writeFileSync(DESTINO, salida);
  console.log(`ROADMAP.md generado (${datos.tareas.length} tareas)`);
}
