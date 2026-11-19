"""Storyboard del 0·2 en HTML: voz, láminas, encuadres, efectos, sonido y transiciones.

    python3 historia/videos/002-la-deuda-defraudada/storyboard.py              # storyboard.html (enlaza las láminas)
    python3 historia/videos/002-la-deuda-defraudada/storyboard.py --autonomo SALIDA.html
                                                                              # un solo archivo, imágenes incluidas

Fuentes: storyboard.json (la adaptación), guion.md (la voz), las secuencias de
diseno/storyboard-visual (encuadres) y diseno/escenas-largas/direccion-movimiento.json (sonido y
motivo de cámara). No se edita el HTML a mano.
"""
import base64
import html
import io
import json
import re
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SB = json.loads((AQUI / "storyboard.json").read_text(encoding="utf-8"))
AUTONOMO = "--autonomo" in sys.argv

ESTADO = {"igual": "Igual", "cambia": "Cambia", "nuevo": "Nuevo", "mueve": "Se mueve", "sale": "Sale"}


# --- datos -----------------------------------------------------------------------------------

def voz_por_parrafo():
    texto = (AQUI / "guion.md").read_text(encoding="utf-8")
    b = re.split(r"^## ESC (\d+) — (.+)$", texto, flags=re.M)
    voz, sonido = {}, {}
    for i in range(1, len(b), 3):
        esc, cuerpo = b[i], b[i + 2]
        v = re.search(r"\*\*VO:\*\*\n(.*?)(?:\n\n\*\*|\n---|\Z)", cuerpo, re.S)
        if v:
            for j, p in enumerate(x.strip() for x in v.group(1).split("\n\n") if x.strip()):
                voz[f"{esc}.{j}"] = p
        s = re.search(r"\*\*Sonido:\*\* (.+)", cuerpo)
        sonido[esc] = s.group(1) if s else ""
    return voz, sonido


def mini_escenas():
    out = {}
    for esc, carpeta in SB["revisiones"].items():
        for m in json.loads((AQUI / carpeta / "secuencia.json").read_text(encoding="utf-8")):
            m["_lamina"] = f"{carpeta}/{m['lamina'].replace('.svg', '.png')}"
            out[m["id"]] = m
    return out


def direccion():
    d = json.loads((AQUI / "diseno/escenas-largas/direccion-movimiento.json").read_text(encoding="utf-8"))
    return {m["id"]: m for e in d["escenas"] for m in e["momentos"]}


VOZ, SONIDO_ESC = voz_por_parrafo()
MINI = mini_escenas()
DIR = direccion()


# --- imágenes --------------------------------------------------------------------------------

def src(ruta):
    """Ruta relativa al HTML del repo, o data URI en la versión autónoma."""
    p = AQUI / ruta
    if not AUTONOMO:
        return html.escape(ruta)
    if p.suffix == ".svg":
        return "data:image/svg+xml;base64," + base64.b64encode(p.read_bytes()).decode()
    from PIL import Image
    im = Image.open(p).convert("RGB")
    im.thumbnail((1600, 1600))
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=72, optimize=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


# --- HTML ------------------------------------------------------------------------------------

def esc(t):
    return html.escape(t or "")


def con_comillas(t):
    return re.sub(r"«([^»]+)»", r"«<em>\1</em>»", esc(t))


def pausa(m):
    tipo, seg, nota = m.group(1), m.group(2), (m.group(3) or "").lstrip(": ").strip()
    clase = "silencio" if tipo == "SILENCIO" else ("p-larga" if float(seg.replace(",", ".")) >= 1 else "p-corta")
    titulo = f"{tipo.lower()} {seg} s" + (f": {nota}" if nota else "")
    extra = f" · {esc(nota)}" if nota else ""
    return f'<span class="pausa {clase}" title="{esc(titulo)}">{seg} s{extra}</span>'


def voz_html(refs):
    if not refs:
        return '<p class="sinvoz">Sin voz propia: corre bajo la frase anterior o en su pausa.</p>'
    partes = []
    for r in refs:
        t = esc(VOZ.get(r, f"[falta el párrafo {r} en guion.md]"))
        t = re.sub(r"\[(PAUSA|SILENCIO) ([\d,]+)s([^\]]*)\]", pausa, t)
        partes.append(f'<p><span class="ref">{r}</span>{t}</p>')
    return "".join(partes)


def encuadres_html(lista):
    filas = "".join(
        f"<tr><td class='n'>{i}</td><td><b>{con_comillas(e['plano'])}</b></td>"
        f"<td>{con_comillas(e['camara_y_accion'])}</td><td>{con_comillas(e['efecto_y_pausa'])}</td></tr>"
        for i, e in enumerate(lista, 1))
    return ("<table><thead><tr><th></th><th>Plano</th><th>Cámara y acción</th><th>Efecto y pausa</th></tr></thead>"
            f"<tbody>{filas}</tbody></table>")


def figura(ruta, pie):
    img = f'<img loading="lazy" src="{src(ruta)}" alt="{esc(pie)}">'
    if not AUTONOMO:
        img = f'<a href="{src(ruta)}">{img}</a>'
    return f"<figure>{img}<figcaption>{esc(pie)}</figcaption></figure>"


def tramo_html(t):
    estado = t["estado"]
    base = MINI.get(t.get("base", ""))
    titulo = t.get("titulo") or (base["cambio"] if base else "")
    cabeza = (f'<div class="cabeza"><span class="sello {estado}">{ESTADO[estado]}</span>'
              f'<span class="tid">{esc(t["id"])}</span><h3>{con_comillas(titulo)}</h3></div>')
    cuerpo = [f'<div class="voz">{voz_html(t.get("voz", []))}</div>']
    imgs = []
    if base:
        imgs.append(figura(base["_lamina"], f"Lámina {base['id']} · storyboard ilustrado del 11 de noviembre"))
    for r in t.get("referencias", []):
        if r in MINI:
            imgs.append(figura(MINI[r]["_lamina"], f"Referencia: lámina {r}"))
    if imgs:
        cuerpo.append(f'<div class="laminas">{"".join(imgs)}</div>')
    if t.get("ajuste"):
        cuerpo.append(f'<div class="ajuste"><span class="et">Qué cambia</span>{con_comillas(t["ajuste"])}</div>')
    if t.get("nota"):
        cuerpo.append(f'<div class="ajuste"><span class="et">Nota</span>{con_comillas(t["nota"])}</div>')
    if t.get("palabra"):
        cuerpo.append(f'<div class="palabra"><span>{esc(t["palabra"])}</span><small>Q, p. 174</small></div>')
    encs = t.get("encuadres") or (base or {}).get("encuadres")
    if encs:
        origen = "Encuadres propuestos" if t.get("encuadres") else "Encuadres de la lámina (sin cambios salvo lo que dice «Qué cambia»)"
        cuerpo.append(f'<div class="encs"><span class="et">{origen}</span>{encuadres_html(encs)}</div>')
    if t.get("piezas"):
        miniaturas = "".join(
            f'<figure class="pieza"><img loading="lazy" src="{src(p)}" alt=""><figcaption>{esc(Path(p).name)}</figcaption></figure>'
            for p in t["piezas"])
        cuerpo.append(f'<div class="piezas"><span class="et">Piezas existentes que se reutilizan</span><div class="fila">{miniaturas}</div></div>')
    d = DIR.get(t.get("base", "")) or DIR.get((t.get("base") or "").split(".")[0])
    datos = []
    if d:
        datos.append(f"<div><span class='et'>Sonido y detalle</span>{con_comillas(d.get('detalle_y_sonido', ''))}</div>")
        datos.append(f"<div><span class='et'>Motivo de cámara</span>{con_comillas(d['camara'].get('motivo', ''))}</div>")
    if base and base.get("enlace"):
        datos.append(f"<div><span class='et'>Enlace con lo que sigue</span>{con_comillas(base['enlace'])}</div>")
    if datos:
        cuerpo.append(f'<div class="datos">{"".join(datos)}</div>')
    return f'<article class="tramo {estado}" id="t-{esc(t["id"])}">{cabeza}{"".join(cuerpo)}</article>'


def escena_html(e):
    tramos = "".join(tramo_html(t) for t in e["tramos"])
    contacto = SB["contactos"].get(e["esc"])
    extra = ""
    if contacto:
        extra = (f'<details class="contacto"><summary>Piezas separadas para Remotion (17 de noviembre)</summary>'
                 f'{figura(contacto, "Hoja de contacto de diseno/recursos-escena0" + e["esc"])}</details>')
    trans = (f'<div class="trans"><div><span class="et">Entra</span>{con_comillas(e["entrada"])}</div>'
             f'<div><span class="et">Sale</span>{con_comillas(e["salida"])}</div>'
             + (f'<div><span class="et">Sonido de la escena</span>{con_comillas(SONIDO_ESC.get(e["esc"], ""))}</div>' if SONIDO_ESC.get(e["esc"]) else "")
             + "</div>")
    return (f'<section id="esc-{e["esc"]}"><header><span class="larga">{esc(e["larga"])}</span>'
            f'<h2><span class="num">{e["esc"]}</span>{esc(e["titulo"])}</h2></header>{trans}{tramos}{extra}</section>')


def pagina():
    cuenta = {k: 0 for k in ESTADO}
    for e in SB["escenas"]:
        for t in e["tramos"]:
            cuenta[t["estado"]] += 1
    usadas = {t.get("base") for e in SB["escenas"] for t in e["tramos"]}
    faltan = [m for m in MINI if m not in usadas]
    resumen = " · ".join(f'<span class="sello {k}">{ESTADO[k]}</span> {v}' for k, v in cuenta.items() if v)
    indice = "".join(f'<a href="#esc-{e["esc"]}"><b>{e["esc"]}</b> {esc(e["titulo"])}</a>' for e in SB["escenas"])
    palabras = sum(len(re.sub(r"\[[^\]]*\]", " ", v).split()) for v in VOZ.values())
    aviso_faltan = (f"<p class='aviso'>Mini escenas sin tramo asignado: {', '.join(faltan)}.</p>" if faltan else "")
    return f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Storyboard 0·2</title>
<style>
:root {{ --papel:#f3ecdc; --tinta:#2a2420; --suave:#6b5f53; --linea:#d9ccb2; --rojo:#a3322a; --ocre:#94690f; --verde:#4a6a40; --azul:#3d5f7a; --caja:#ebe1cb; --caja2:#e4d8bd; }}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --papel:#1d1a17; --tinta:#ece3d2; --suave:#a89a87; --linea:#3a332c; --rojo:#e0675c; --ocre:#d9a646; --verde:#8db07f; --azul:#86aac6; --caja:#26221e; --caja2:#2e2924; }} }}
:root[data-theme="dark"] {{ --papel:#1d1a17; --tinta:#ece3d2; --suave:#a89a87; --linea:#3a332c; --rojo:#e0675c; --ocre:#d9a646; --verde:#8db07f; --azul:#86aac6; --caja:#26221e; --caja2:#2e2924; }}
* {{ box-sizing:border-box; }}
html {{ scroll-behavior:smooth; }}
body {{ margin:0; background:var(--papel); color:var(--tinta); font:18px/1.55 "EB Garamond", Georgia, serif; }}
main {{ max-width:1180px; margin:0 auto; padding:36px 16px 90px; }}
.mono, .et, .sello, .pausa, .num, .tid, .ref, .larga, .meta, nav a b, th {{ font-family:ui-monospace, "IBM Plex Mono", Menlo, monospace; }}
h1 {{ font-size:2.1rem; line-height:1.15; margin:4px 0 8px; font-weight:600; }}
.meta {{ font-size:.78rem; color:var(--suave); letter-spacing:.02em; }}
.intro {{ max-width:72ch; color:var(--suave); }}
nav {{ position:sticky; top:0; z-index:5; background:var(--papel); border-bottom:1px solid var(--linea); display:flex; gap:4px 14px; flex-wrap:wrap; padding:8px 0; font-size:.9rem; }}
nav a {{ color:var(--tinta); text-decoration:none; white-space:nowrap; }}
nav a b {{ color:var(--rojo); font-weight:400; margin-right:4px; }}
section {{ padding:30px 0 10px; border-bottom:1px solid var(--linea); scroll-margin-top:48px; }}
.larga {{ font-size:.72rem; letter-spacing:.07em; text-transform:uppercase; color:var(--ocre); }}
h2 {{ font-size:1.7rem; margin:2px 0 12px; font-weight:600; }}
.num {{ color:var(--rojo); margin-right:12px; }}
.trans {{ display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:10px 20px; background:var(--caja); border-radius:6px; padding:12px 14px; font-size:.92rem; margin-bottom:18px; }}
.et {{ display:block; font-size:.66rem; letter-spacing:.08em; text-transform:uppercase; color:var(--suave); margin-bottom:2px; }}
.tramo {{ border-left:3px solid var(--linea); padding:4px 0 6px 16px; margin:0 0 30px; scroll-margin-top:48px; }}
.tramo.cambia {{ border-color:var(--ocre); }} .tramo.nuevo {{ border-color:var(--verde); }} .tramo.mueve {{ border-color:var(--azul); }} .tramo.sale {{ border-color:var(--rojo); }}
.cabeza {{ display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; }}
.tid {{ font-size:.85rem; color:var(--suave); }}
h3 {{ font-size:1.25rem; margin:0; font-weight:600; flex:1 1 300px; }}
.sello {{ display:inline-block; font-size:.62rem; text-transform:uppercase; letter-spacing:.05em; padding:2px 6px; border-radius:3px; border:1px solid currentColor; vertical-align:2px; }}
.sello.igual {{ color:var(--suave); }} .sello.cambia {{ color:var(--ocre); }} .sello.nuevo {{ color:var(--verde); }} .sello.mueve {{ color:var(--azul); }} .sello.sale {{ color:var(--rojo); }}
.voz {{ margin:10px 0 12px; max-width:72ch; font-size:1.06rem; }}
.voz p {{ margin:0 0 .6em; }}
.ref {{ font-size:.66rem; color:var(--suave); border:1px solid var(--linea); border-radius:3px; padding:1px 4px; margin-right:7px; vertical-align:2px; }}
.sinvoz {{ color:var(--suave); font-style:italic; }}
.pausa {{ display:inline-block; font-size:.64rem; line-height:1.2; padding:2px 5px; margin:0 2px; border-radius:3px; vertical-align:2px; color:var(--suave); border:1px solid var(--linea); }}
.pausa.p-larga {{ color:var(--tinta); }}
.pausa.silencio {{ color:var(--papel); background:var(--rojo); border-color:var(--rojo); }}
.laminas figure {{ margin:0 0 10px; }}
.laminas img {{ width:100%; height:auto; display:block; border-radius:4px; border:1px solid var(--linea); background:#e8dfc6; }}
figcaption {{ font-size:.78rem; color:var(--suave); margin-top:3px; }}
.ajuste {{ background:var(--caja); border-left:3px solid var(--ocre); padding:9px 12px; margin:10px 0; border-radius:0 6px 6px 0; max-width:90ch; }}
.tramo.nuevo .ajuste {{ border-left-color:var(--verde); }} .tramo.mueve .ajuste {{ border-left-color:var(--azul); }}
.palabra {{ background:#1f1b17; color:#f0e6d2; display:flex; flex-direction:column; align-items:center; justify-content:center; aspect-ratio:16/9; max-width:640px; border-radius:4px; margin:10px 0; }}
.palabra span {{ font-size:clamp(1.6rem, 6vw, 3.4rem); font-style:italic; }}
.palabra small {{ font-family:ui-monospace, monospace; font-size:.7rem; opacity:.6; margin-top:8px; }}
.encs {{ margin:12px 0; overflow-x:auto; }}
table {{ width:100%; border-collapse:collapse; font-size:.9rem; line-height:1.4; min-width:560px; }}
th {{ text-align:left; font-size:.64rem; letter-spacing:.07em; text-transform:uppercase; color:var(--suave); font-weight:400; padding:4px 8px; border-bottom:1px solid var(--linea); }}
td {{ padding:6px 8px; border-bottom:1px solid var(--linea); vertical-align:top; }}
td.n {{ color:var(--suave); font-family:ui-monospace, monospace; font-size:.75rem; width:1.5em; }}
.piezas .fila {{ display:flex; gap:10px; flex-wrap:wrap; }}
.pieza {{ margin:0; width:170px; }}
.pieza img {{ width:100%; height:110px; object-fit:contain; background:var(--caja2); border-radius:4px; padding:6px; }}
.pieza figcaption {{ font-family:ui-monospace, monospace; font-size:.62rem; word-break:break-all; }}
.datos {{ display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:8px 20px; font-size:.88rem; color:var(--tinta); margin-top:8px; }}
details.contacto {{ margin:0 0 24px; }}
details.contacto summary {{ cursor:pointer; font-family:ui-monospace, monospace; font-size:.8rem; color:var(--ocre); }}
details.contacto img {{ width:100%; height:auto; margin-top:8px; border-radius:4px; }}
.aviso {{ color:var(--rojo); }}
@media (max-width:700px) {{ nav {{ flex-wrap:nowrap; overflow-x:auto; }} .laminas figure {{ overflow-x:auto; }} .laminas img {{ width:auto; max-width:none; height:300px; }} }}
.leyenda {{ font-size:.9rem; color:var(--suave); }}
</style></head>
<body><main>
<p class="meta">HISTORIA DE LA CORRUPCIÓN EN EL PERÚ · EPISODIO 0·2 · {esc(SB["fecha"])}</p>
<h1>{esc(SB["titulo"])}</h1>
<p class="meta">{palabras} palabras de voz · {sum(cuenta.values())} tramos · generado con storyboard.py</p>
<p class="intro">Cada tramo junta la voz nueva (con sus pausas en segundos; en rojo, los silencios sin música), la lámina del storyboard ilustrado que la acompaña, qué hay que cambiar, los encuadres con su cámara, efecto y pausa, y el sonido. Las escenas abren con su transición de entrada y salida. {esc(SB["estado"])}</p>
<p class="leyenda">{resumen}</p>
{aviso_faltan}
<nav>{indice}</nav>
{"".join(escena_html(e) for e in SB["escenas"])}
</main></body></html>
"""


def markdown():
    out = [f"# {SB['titulo']}", "",
           f"Generado desde `storyboard.json` con `storyboard.py`; no se edita a mano. {SB['estado']}", "",
           "La versión completa, con las láminas, los encuadres y el sonido, es [storyboard.html](storyboard.html). "
           "El storyboard ilustrado de base está en [diseno/storyboard-visual](diseno/storyboard-visual/README.md).", ""]
    for e in SB["escenas"]:
        out += [f"## {e['esc']}. {e['titulo']} ({e['larga']})", "",
                f"- **Entra:** {e['entrada']}", f"- **Sale:** {e['salida']}", ""]
        for t in e["tramos"]:
            base = MINI.get(t.get("base", ""))
            titulo = t.get("titulo") or (base["cambio"] if base else "")
            voz = ", ".join(t.get("voz", [])) or "sin voz propia"
            out.append(f"### {t['id']} · {ESTADO[t['estado']]} · {titulo}")
            out.append("")
            out.append(f"Voz: {voz}.")
            if t.get("ajuste"):
                out.append(f"{t['ajuste']}")
            if t.get("nota"):
                out.append(f"{t['nota']}")
            for i, en in enumerate(t.get("encuadres", []), 1):
                plano = en["plano"] if en["plano"][-1] in ".?!" else en["plano"] + "."
                out.append(f"{i}. **{plano}** {en['camara_y_accion']} {en['efecto_y_pausa']}")
            out.append("")
    return "\n".join(out)


if __name__ == "__main__":
    if AUTONOMO:
        destino = Path(sys.argv[sys.argv.index("--autonomo") + 1])
        destino.write_text(pagina(), encoding="utf-8")
        print(f"{destino} ({destino.stat().st_size / 1e6:.1f} MB)")
    else:
        (AQUI / "storyboard.html").write_text(pagina(), encoding="utf-8")
        (AQUI / "storyboard.md").write_text(markdown(), encoding="utf-8")
        print("storyboard.html y storyboard.md")
