// Plantillas de estilo: guardar el estilo actual (y los colores por personaje) y aplicarlo a otro proyecto.
import { $, api, toast } from './util.js';
import { S, changed } from './store.js';

let list = [];

async function refresh(select){
  list = await api.get('/api/templates').catch(() => []);
  const sel = $('#tplSel'); sel.innerHTML = '';
  if(!list.length){ const o = document.createElement('option'); o.value = ''; o.textContent = '(todavía no hay plantillas)'; sel.append(o); }
  list.forEach(t => { const o = document.createElement('option'); o.value = t.slug; o.textContent = t.name; sel.append(o); });
  if(select) sel.value = select;
  $('#tplApply').disabled = $('#tplDel').disabled = !list.length;
}

export function initTemplates(onApplied){
  $('#templatesBox').innerHTML = `
    <div class="card">
      <strong>Plantillas de estilo</strong>
      <p class="help">Guarda la fuente, tamaños, brillo y los colores de cada personaje para que todos los videos de tu canal tengan la misma identidad.</p>
      <div class="row">
        <label class="sr-only" for="tplSel">Plantilla</label>
        <select id="tplSel" class="grow"></select>
        <button class="btn" id="tplApply" type="button">Aplicar</button>
        <button class="btn danger" id="tplDel" type="button" aria-label="Borrar plantilla">Borrar</button>
      </div>
      <button class="btn" id="tplSave" type="button">Guardar el estilo actual como plantilla…</button>
    </div>`;
  refresh();
  $('#tplSave').addEventListener('click', async () => {
    const name = prompt('Nombre de la plantilla (por ejemplo, el nombre de tu canal):');
    if(!name) return;
    try {
      const t = await api.post('/api/templates', { name, style: S.project.style, chars: S.project.chars });
      await refresh(t.slug); toast(`Plantilla «${t.name}» guardada`);
    } catch(e){ toast(e.message); }
  });
  $('#tplApply').addEventListener('click', () => {
    const t = list.find(x => x.slug === $('#tplSel').value); if(!t) return;
    Object.assign(S.project.style, t.style);
    Object.values(S.project.chars).forEach(c => {
      const col = t.colors[c.name.toLowerCase()];
      if(col){ c.color = col; c.auto = false; }
    });
    onApplied(); changed({ delay: 0 });
    toast(`Plantilla «${t.name}» aplicada`);
  });
  let armed = false;
  $('#tplDel').addEventListener('click', async e => {
    const t = list.find(x => x.slug === $('#tplSel').value); if(!t) return;
    if(!armed){ armed = true; e.target.textContent = '¿Seguro?'; setTimeout(() => { armed = false; e.target.textContent = 'Borrar'; }, 2500); return; }
    armed = false; e.target.textContent = 'Borrar';
    await api.del(`/api/templates/${t.slug}`);
    await refresh(); toast('Plantilla borrada');
  });
}
