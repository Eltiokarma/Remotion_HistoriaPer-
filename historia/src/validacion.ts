import { z } from 'zod';
import { esquemaVideo, type VideoData } from './esquema';
import { CATALOGO } from './escenas/esquemas';

type Issue = z.core.$ZodIssue;

// mensajes de error en español
z.config(z.locales.es());

const lugar = (camino: PropertyKey[]) => camino.map((p) => (typeof p === 'number' ? `[${p}]` : `.${String(p)}`)).join('').replace(/^\./, '');
const describir = (prefijo: string, issues: Issue[]) => issues.map((i) => `${prefijo}${lugar(i.path)}: ${i.message}`);

/** "escenas[1].cambio" → "s02 · cambio": se nombra la escena por su id, no por su posición. */
const describirBase = (datos: unknown, issues: Issue[]) => {
  const escenas = (datos as { escenas?: { id?: unknown }[] })?.escenas;
  return issues.map((i) => {
    const [raiz, n, ...resto] = i.path;
    const id = raiz === 'escenas' && typeof n === 'number' ? escenas?.[n]?.id : undefined;
    return typeof id === 'string' ? `${id} · ${lugar(resto) || '(escena)'}: ${i.message}` : `${lugar(i.path)}: ${i.message}`;
  });
};

/**
 * Revisa un escenas.json completo: la forma general y las props de cada escena según su
 * componente. Devuelve el video con los valores por defecto ya aplicados.
 */
export function validarVideo(datos: unknown, soloEscena?: string): { video: VideoData | null; errores: string[] } {
  const base = esquemaVideo.safeParse(datos);
  if (!base.success) return { video: null, errores: describirBase(datos, base.error.issues) };
  const errores: string[] = [];
  const escenas = base.data.escenas.map((e) => {
    // trabajando una escena sola, las demás no se revisan (una rota no bloquea a las otras)
    if (soloEscena && e.id !== soloEscena) return e;
    const entrada = CATALOGO[e.componente as keyof typeof CATALOGO];
    if (!entrada) {
      errores.push(`${e.id}: no existe la escena "${e.componente}". Las que hay: ${Object.keys(CATALOGO).join(', ')}`);
      return e;
    }
    const props = entrada.esquema.safeParse(e.props);
    if (!props.success) {
      errores.push(...describir(`${e.id} · props.`, props.error.issues));
      return e;
    }
    return { ...e, props: props.data as Record<string, unknown> };
  });
  const ids = base.data.escenas.map((e) => e.id);
  ids.forEach((id, i) => { if (ids.indexOf(id) !== i) errores.push(`${id}: id de escena repetido`); });
  return { video: { ...base.data, escenas }, errores };
}
