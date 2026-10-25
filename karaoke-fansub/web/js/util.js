export const $ = s => document.querySelector(s);

export function fmt(t){
  t = Math.max(0, t || 0);
  const m = Math.floor(t / 60), s = t - m * 60;
  return `${m}:${s.toFixed(2).padStart(5, '0')}`;
}

let toastT;
export function toast(msg, ms = 2800){
  const t = $('#toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toastT);
  toastT = setTimeout(() => t.hidden = true, ms);
}

export function darken(h, k){
  const rgb = [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16) * (1 - k));
  return '#' + rgb.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
}

async function call(method, url, body){
  const opt = { method, headers: {} };
  if(body instanceof FormData) opt.body = body;
  else if(body !== undefined){ opt.body = JSON.stringify(body); opt.headers['Content-Type'] = 'application/json'; }
  let r;
  try { r = await fetch(url, opt); }
  catch(e){ throw new Error('No hay conexión con el programa. ¿Cerraste la ventana de Karaoke Fansub?'); }
  const data = await r.json().catch(() => ({}));
  if(!r.ok) throw new Error(data.error || `Error ${r.status}`);
  return data;
}
export const api = {
  get: url => call('GET', url),
  post: (url, body) => call('POST', url, body ?? {}),
  put: (url, body) => call('PUT', url, body),
  del: url => call('DELETE', url),
};

/** Descarga un archivo que genera el backend a partir del proyecto. */
export async function downloadFrom(url, body, fallbackName){
  const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  if(!r.ok){ const d = await r.json().catch(() => ({})); throw new Error(d.error || `Error ${r.status}`); }
  const cd = r.headers.get('Content-Disposition') || '';
  const m = cd.match(/filename\*=UTF-8''([^;]+)/);
  saveBlob(await r.blob(), m ? decodeURIComponent(m[1]) : fallbackName);
}

export function saveBlob(blob, filename){
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = filename; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Atajos de teclado: no interceptar mientras se escribe en un campo de texto. */
export function typingIn(target){
  const tag = (target.tagName || '').toLowerCase();
  return tag === 'textarea' || tag === 'select' || target.isContentEditable ||
    (tag === 'input' && !/^(range|color|file|checkbox|radio|button)$/.test(target.type));
}
