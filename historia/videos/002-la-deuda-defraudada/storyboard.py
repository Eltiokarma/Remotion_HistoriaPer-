"""Storyboard del 0·2 sobre la voz real: planos, pantalla, cámara, efectos, sonido y métricas.

    python3 historia/videos/002-la-deuda-defraudada/storyboard.py               # storyboard.html y storyboard.md
    python3 historia/videos/002-la-deuda-defraudada/storyboard.py --autonomo SALIDA.html   # un archivo, imágenes dentro

Fuentes: storyboard.json (los planos y el sistema visual), narracion.json (texto y emoción de cada
frase), narracion_tiempos.json (dónde empieza y termina cada frase en voz/sNN.mp3) y las láminas de
diseno/storyboard-visual. Cada plano se ancla a frases de la voz, así que sus tiempos son los reales.

Mide lo que historia/CLAUDE.md pide comprobar (§3, §4, §5, §8): tiempo de lectura de cada rótulo
(0,3 s por palabra + 1 s), rótulos a la vez, texto que repite la voz, porcentaje de cámara quieta,
voz sobre tiempo de escena, rótulos con datos nuevos por minuto y tres planos seguidos de igual duración.
"""
import base64
import html
import io
import json
import re
import sys
import unicodedata
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SB = json.loads((AQUI / "storyboard.json").read_text(encoding="utf-8"))
NAR = json.loads((AQUI / "narracion.json").read_text(encoding="utf-8"))
TIE = json.loads((AQUI / "narracion_tiempos.json").read_text(encoding="utf-8"))
AUTONOMO = "--autonomo" in sys.argv
VACIAS = set("el la los las un una unos unas de del al a y o en con por para que se su sus es era fue lo le les como más muy".split())


# --- medidas ---------------------------------------------------------------------------------

sys.path.insert(0, str(AQUI.parents[1] / "scripts"))
from narracion import tokens, en_letras  # misma normalización que la narración: cifras en letras, sin tildes


def norm(t):
    """Unidades de sentido de un rótulo: cada palabra y cada número entero (un número cuenta una vez)."""
    unidades = []
    for trozo in re.findall(r"\d+(?:[ .]\d{3})*(?:,\d+)?|[^\d]+", t):
        if trozo[0].isdigit():
            unidades.append(" ".join(tokens(trozo)))
        else:
            unidades += [w for w in tokens(trozo) if w not in VACIAS]
    return unidades


def en_voz(unidad, voz_tokens):
    return f" {unidad} " in f" {' '.join(voz_tokens)} "


def es_dato(t):
    return bool(re.search(r"\d", t)) or bool(re.search(r"\b[A-ZÁÉÍÓÚ][a-záéíóúñ]+ [A-ZÁÉÍÓÚ]", t))


def medir():
    total = {"video": 0.0, "quieta": 0.0, "voz": 0.0}
    for e in SB["escenas"]:
        fr = TIE[e["s"]]["frases"]
        dur_voz = TIE[e["s"]]["duracion"]
        planos = e["planos"]
        e["_voz"] = sum(f["hasta"] - f["desde"] for f in fr)
        e["_respiros"] = sum(p.get("respiro", 0) for p in planos)
        e["_video"] = dur_voz + e["_respiros"]
        quieta, datos = 0.0, 0
        for k, p in enumerate(planos):
            a, b = p["frases"][0], p["frases"][-1]
            t0 = 0.0 if k == 0 else fr[a]["desde"]
            t1 = fr[planos[k + 1]["frases"][0]]["desde"] if k + 1 < len(planos) else dur_voz
            p["_t0"], p["_t1"] = t0, t1
            p["_dur"] = t1 - t0 + p.get("respiro", 0)
            if p["camara"]["tipo"] == "quieta":
                quieta += p["_dur"]
            avisos = []
            for r in p["pantalla"]:
                desde = fr[r["en"]]["desde"]
                disponible = t1 + p.get("respiro", 0) - desde
                necesita = 0.3 * len(r["t"].split()) + 1
                r["_lee"] = (disponible, necesita)
                if disponible < necesita:
                    avisos.append(f"«{r['t']}» necesita {necesita:.1f} s y tiene {disponible:.1f} s")
                voz = tokens(fr[r["en"]]["texto"])
                unidades = norm(r["t"])
                r["_repite"] = (bool(unidades) and not (r.get("termino") or r.get("refuerzo") or r.get("ficha"))
                                and sum(en_voz(u, voz) for u in unidades) / len(unidades) >= 0.85)
                if r["_repite"]:
                    avisos.append(f"«{r['t']}» repite la voz")
                if es_dato(r["t"]) and not r.get("termino"):
                    datos += 1
            if len(p["pantalla"]) > 2:
                avisos.append(f"{len(p['pantalla'])} rótulos en el plano: que no estén más de dos a la vez")
            p["_avisos"] = avisos
        durs = [p["_dur"] for p in planos]
        e["_parejas"] = [planos[i]["id"] for i in range(len(durs) - 2)
                         if max(durs[i:i + 3]) <= min(durs[i:i + 3]) * 1.1]
        e["_quieta"] = quieta / e["_video"]
        e["_voz_pct"] = e["_voz"] / e["_video"]
        e["_datos_min"] = datos / (e["_video"] / 60)
        total["video"] += e["_video"]
        total["quieta"] += quieta
        total["voz"] += e["_voz"]
    return total


TOTAL = medir()


# --- imágenes --------------------------------------------------------------------------------

def src(ruta):
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
    return html.escape(str(t or ""))


def comillas(t):
    return re.sub(r"«([^»]+)»", r"«<em>\1</em>»", esc(t))


def mmss(s):
    return f"{int(s // 60)}:{s % 60:04.1f}"


def pct(x):
    return f"{x * 100:.0f} %"


def semaforo(ok, texto):
    return f'<span class="chip {"ok" if ok else "mal"}">{texto}</span>'


def voz_html(e, p):
    frases = NAR["frases"][e["s"]]
    out = []
    for i in range(p["frases"][0], p["frases"][-1] + 1):
        texto, pausa = frases[i]
        tags = " ".join(re.findall(r"\[[^\]]*\]", texto))
        limpio = re.sub(r"\[[^\]]*\]\s*", "", texto).strip()
        t = TIE[e["s"]]["frases"][i]["desde"]
        out.append(f'<p><span class="t">{mmss(t)}</span><span class="tags">{esc(tags)}</span> {esc(limpio)}'
                   f'<span class="pausa{" larga" if pausa >= 1 else ""}">{pausa:g} s</span></p>')
    return "".join(out)


def pantalla_html(p):
    if not p["pantalla"]:
        return '<p class="vacio">Sin rótulos: la imagen y la voz bastan.</p>'
    filas = []
    for r in p["pantalla"]:
        disp, nec = r["_lee"]
        marcas = semaforo(disp >= nec, f"lectura {disp:.1f}/{nec:.1f} s")
        if r.get("termino"):
            marcas += '<span class="chip neutro">término</span>'
        if r.get("ficha"):
            marcas += '<span class="chip neutro">ficha de identidad</span>'
        if r.get("refuerzo"):
            marcas += '<span class="chip neutro">refuerzo declarado</span>'
        if r["_repite"]:
            marcas += semaforo(False, "repite la voz")
        clase = " palabra" if r.get("palabra") else ""
        filas.append(f'<li><span class="rotulo{clase}">{esc(r["t"])}</span> <span class="en">con la frase {r["en"]}</span> {marcas}</li>')
    return f"<ul class='rotulos'>{''.join(filas)}</ul>"


def plano_html(e, p):
    cam = p["camara"]
    cam_txt = "Quieta" if cam["tipo"] == "quieta" else f"{cam['tipo'].capitalize()}: {cam.get('motivo', '')}"
    imgs = "".join(
        f'<figure><img loading="lazy" src="{src(SB["imagenes"][b])}" alt=""><figcaption>Lámina {esc(b)} (11 de noviembre) · referencia</figcaption></figure>'
        for b in p.get("base", []) if b in SB["imagenes"])
    piezas = "".join(
        f'<figure class="pieza"><img loading="lazy" src="{src(x)}" alt=""><figcaption>{esc(Path(x).name)}</figcaption></figure>'
        for x in p.get("piezas", []))
    avisos = "".join(f"<li>{esc(a)}</li>" for a in p["_avisos"])
    sello = '<span class="sello exc">excepción reservada</span>' if p.get("excepcion") else ""
    corte = '<span class="sello corte">punto posible de corte de escena</span>' if p.get("corte_posible") else ""
    resp = f' + {p["respiro"]:g} s de montaje' if p.get("respiro") else ""
    return f"""
<article class="plano{' exc' if p.get('excepcion') else ''}" id="p-{esc(p['id'])}">
  <div class="cabeza"><span class="pid">{esc(p['id'])}</span><span class="verbo">{esc(p['verbo'])}</span>
    <h3>{comillas(p['idea'])}</h3>{sello}{corte}
    <span class="tiempo">{mmss(p['_t0'])}–{mmss(p['_t1'])} de {e['s']}.mp3 · {p['_dur']:.1f} s en pantalla{resp}</span></div>
  <div class="cols">
    <div>
      <div class="bloque"><span class="et">Voz y emoción</span><div class="voz">{voz_html(e, p)}</div></div>
      <div class="bloque"><span class="et">Imagen</span><p>{comillas(p['imagen'])}</p></div>
      <div class="bloque"><span class="et">Pantalla</span>{pantalla_html(p)}</div>
    </div>
    <div>
      <div class="bloque"><span class="et">Cámara</span><p class="{'quieta' if cam['tipo'] == 'quieta' else 'mueve'}">{comillas(cam_txt)}</p></div>
      <div class="bloque"><span class="et">Efecto</span><p>{comillas(p.get('efecto', ''))}</p></div>
      <div class="bloque"><span class="et">Sonido</span><p>{comillas(p.get('sonido', ''))}</p></div>
      {f'<div class="bloque falta"><span class="et">Falta dibujar o generar</span><p>{comillas(p["falta"])}</p></div>' if p.get('falta') else ''}
      {f'<div class="bloque avisos"><span class="et">Avisos</span><ul>{avisos}</ul></div>' if avisos else ''}
    </div>
  </div>
  {f'<div class="laminas">{imgs}</div>' if imgs else ''}
  {f'<div class="piezas"><span class="et">Piezas existentes</span><div class="fila">{piezas}</div></div>' if piezas else ''}
</article>"""


def linea_html(e):
    partes = []
    for p in e["planos"]:
        clase = "q" if p["camara"]["tipo"] == "quieta" else "m"
        if p.get("excepcion"):
            clase += " x"
        partes.append(f'<a href="#p-{esc(p["id"])}" class="seg {clase}" style="flex:{p["_dur"]:.2f}" title="{esc(p["id"])} · {p["_dur"]:.1f} s · {esc(p["verbo"])}">'
                      f'<b>{esc(p["id"])}</b><span>{esc(p["verbo"])}</span></a>')
    return f'<div class="linea">{"".join(partes)}</div>'


def escena_html(e):
    metricas = (semaforo(e["_voz_pct"] <= 0.85, f"voz {pct(e['_voz_pct'])} (meta ≤ 80 %)")
                + semaforo(e["_quieta"] >= 0.2, f"cámara quieta {pct(e['_quieta'])}")
                + semaforo(e["_datos_min"] <= 6, f"{e['_datos_min']:.1f} rótulos con datos por minuto")
                + (semaforo(False, "tres planos parejos desde " + ", ".join(e["_parejas"])) if e["_parejas"] else semaforo(True, "duraciones variadas")))
    return f"""
<section id="{e['s']}">
  <header><span class="larga">{esc(e['espacio'])}</span>
  <h2><span class="num">{e['s']}</span>{esc(e['titulo'])}</h2>
  <p class="cambia">{comillas(e['cambia'])}</p>
  <p class="meta">{mmss(e['_video'])} en pantalla ({mmss(TIE[e['s']]['duracion'])} de voz + {e['_respiros']:g} s de respiros) · {len(e['planos'])} planos</p>
  <div class="chips">{metricas}</div></header>
  {linea_html(e)}
  <div class="trans"><div><span class="et">Entra</span>{comillas(e['entrada'])}</div><div><span class="et">Sale</span>{comillas(e['salida'])}</div></div>
  {''.join(plano_html(e, p) for p in e['planos'])}
</section>"""


def revision_html():
    r = SB["revision_anterior"]
    hojas = "".join(
        f"<tr><td><b>{esc(h['momento'])}</b></td><td>{comillas(h['observacion'])}</td><td>{comillas(h['hipotesis'])}</td>"
        f"<td>{comillas(h['cambio'])}</td><td>{comillas(h['resultado'])}</td><td>{comillas(h['comprobar'])}</td></tr>"
        for h in r["hojas"])
    v = r["veredicto"]
    return f"""
<details class="revision" open><summary>Revisión del storyboard anterior (11 de noviembre)</summary>
<p><b>¿Se entiende?</b> {esc(v['se_entiende'])} · <b>¿Se siente?</b> {esc(v['se_siente'])}</p>
<p>{comillas(r['diagnostico'])}</p>
<div class="tabla"><table><thead><tr><th>Momento</th><th>Observación</th><th>Hipótesis</th><th>Cambio</th><th>Resultado esperado</th><th>Cómo comprobar</th></tr></thead><tbody>{hojas}</tbody></table></div>
<p><b>Lo que funciona:</b> {comillas(r['funciona'])}</p>
<p><b>Orden de versiones:</b> {comillas(r['versiones'])}</p>
</details>"""


def sistema_html():
    s = SB["sistema"]
    li = lambda xs: "".join(f"<li>{comillas(x)}</li>" for x in xs)
    return f"""
<div class="sistema">
  <div><span class="et">Qué permanece</span><ul>{li(s['constantes'])}</ul></div>
  <div><span class="et">Qué progresa</span><p>{comillas(s['progresion'])}</p>
       <span class="et">Qué se reserva</span><ul>{li(s['excepciones'])}</ul></div>
  <div><span class="et">Cámara</span><p>{comillas(s['recorridos'])}</p>
       <span class="et">Rojo</span><p>{comillas(s['rojo'])}</p>
       <span class="et">Texto en pantalla</span><p>{comillas(s['texto'])}</p>
       <span class="et">Respiros</span><p>{comillas(s['respiros'])}</p></div>
</div>"""


CSS = """
:root { --papel:#f3ecdc; --tinta:#2a2420; --suave:#6b5f53; --linea:#d9ccb2; --rojo:#a3322a; --ocre:#94690f; --verde:#4a6a40; --azul:#3d5f7a; --caja:#ebe1cb; --caja2:#e4d8bd; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --papel:#1d1a17; --tinta:#ece3d2; --suave:#a89a87; --linea:#3a332c; --rojo:#e0675c; --ocre:#d9a646; --verde:#8db07f; --azul:#86aac6; --caja:#26221e; --caja2:#2e2924; } }
:root[data-theme="dark"] { --papel:#1d1a17; --tinta:#ece3d2; --suave:#a89a87; --linea:#3a332c; --rojo:#e0675c; --ocre:#d9a646; --verde:#8db07f; --azul:#86aac6; --caja:#26221e; --caja2:#2e2924; }
* { box-sizing:border-box; } html { scroll-behavior:smooth; }
body { margin:0; background:var(--papel); color:var(--tinta); font:17px/1.55 "EB Garamond", Georgia, serif; }
main { max-width:1180px; margin:0 auto; padding:34px 16px 90px; }
.et, .chip, .sello, .pid, .verbo, .tiempo, .t, .tags, .pausa, .num, .larga, .meta, nav a b, th, .en, .seg { font-family:ui-monospace, "IBM Plex Mono", Menlo, monospace; }
h1 { font-size:2.1rem; line-height:1.15; margin:4px 0 8px; font-weight:600; }
.meta { font-size:.76rem; color:var(--suave); }
.intro { max-width:74ch; color:var(--suave); }
nav { position:sticky; top:0; z-index:5; background:var(--papel); border-bottom:1px solid var(--linea); display:flex; gap:4px 14px; flex-wrap:wrap; padding:8px 0; font-size:.9rem; }
nav a { color:var(--tinta); text-decoration:none; white-space:nowrap; } nav a b { color:var(--rojo); font-weight:400; margin-right:4px; }
.et { display:block; font-size:.64rem; letter-spacing:.08em; text-transform:uppercase; color:var(--suave); margin:0 0 3px; }
.chips { display:flex; flex-wrap:wrap; gap:6px; margin:8px 0; }
.chip { white-space:nowrap; display:inline-block; font-size:.66rem; padding:2px 7px; border-radius:3px; border:1px solid currentColor; }
.chip.ok { color:var(--verde); } .chip.mal { color:var(--rojo); } .chip.neutro { color:var(--suave); }
.revision, .sistema { background:var(--caja); border-radius:6px; padding:14px 16px; margin:16px 0; }
.revision summary { cursor:pointer; font-weight:600; }
.sistema { display:grid; grid-template-columns:repeat(auto-fit, minmax(280px,1fr)); gap:10px 24px; font-size:.93rem; }
.sistema ul { margin:0 0 8px; padding-left:18px; } .sistema p { margin:0 0 10px; }
.tabla { overflow-x:auto; } table { width:100%; border-collapse:collapse; font-size:.86rem; line-height:1.4; min-width:860px; }
th { text-align:left; font-size:.62rem; letter-spacing:.07em; text-transform:uppercase; color:var(--suave); font-weight:400; padding:4px 6px; border-bottom:1px solid var(--linea); }
td { padding:6px; border-bottom:1px solid var(--linea); vertical-align:top; }
section { padding:30px 0 6px; border-bottom:1px solid var(--linea); scroll-margin-top:46px; }
.larga { font-size:.7rem; letter-spacing:.07em; text-transform:uppercase; color:var(--ocre); }
h2 { font-size:1.7rem; margin:2px 0 4px; font-weight:600; } .num { color:var(--rojo); margin-right:12px; }
.cambia { margin:0 0 4px; font-style:italic; color:var(--suave); }
.linea { display:flex; gap:2px; margin:12px 0 14px; height:46px; }
.seg { display:flex; flex-direction:column; justify-content:center; padding:0 5px; min-width:0; overflow:hidden; text-decoration:none; color:var(--tinta); font-size:.62rem; border-radius:3px; background:var(--caja2); border-bottom:3px solid var(--suave); }
.seg.m { border-bottom-color:var(--azul); } .seg.x { background:var(--rojo); color:var(--papel); border-bottom-color:var(--rojo); }
.seg b { font-weight:600; } .seg span { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; opacity:.8; }
.trans { display:grid; grid-template-columns:repeat(auto-fit, minmax(260px,1fr)); gap:8px 20px; background:var(--caja); border-radius:6px; padding:10px 14px; font-size:.9rem; margin-bottom:18px; }
.plano { border-left:3px solid var(--linea); padding:4px 0 6px 16px; margin:0 0 28px; scroll-margin-top:46px; }
.plano.exc { border-left-color:var(--rojo); }
.cabeza { display:flex; flex-wrap:wrap; align-items:baseline; gap:6px 10px; }
.pid { color:var(--rojo); font-size:.85rem; } .verbo { font-size:.68rem; text-transform:uppercase; letter-spacing:.06em; color:var(--ocre); }
h3 { font-size:1.2rem; margin:0; font-weight:600; flex:1 1 320px; }
.tiempo { flex-basis:100%; font-size:.7rem; color:var(--suave); }
.sello { font-size:.6rem; text-transform:uppercase; letter-spacing:.05em; padding:2px 6px; border-radius:3px; border:1px solid currentColor; }
.sello.exc { color:var(--rojo); } .sello.corte { color:var(--azul); }
.cols { display:grid; grid-template-columns:minmax(0,1.3fr) minmax(0,1fr); gap:6px 26px; margin-top:8px; }
@media (max-width:760px) { .cols { grid-template-columns:1fr; } nav { flex-wrap:nowrap; overflow-x:auto; } }
.bloque { margin:0 0 10px; } .bloque p { margin:0; }
.voz p { margin:0 0 6px; }
.t { font-size:.68rem; color:var(--suave); margin-right:6px; }
.tags { font-size:.66rem; color:var(--ocre); }
.pausa { font-size:.6rem; color:var(--suave); border:1px solid var(--linea); border-radius:3px; padding:1px 4px; margin-left:5px; }
.pausa.larga { color:var(--tinta); }
.rotulos { list-style:none; margin:0; padding:0; } .rotulos li { margin:0 0 6px; }
.rotulo { background:var(--caja2); padding:2px 7px; border-radius:3px; font-family:ui-monospace, monospace; font-size:.82rem; }
.rotulo.palabra { font-family:Georgia, serif; font-style:italic; font-size:1rem; }
.en { font-size:.62rem; color:var(--suave); }
.vacio { color:var(--suave); font-style:italic; }
.quieta { color:var(--suave); } .mueve { color:var(--azul); }
.falta p { color:var(--ocre); }
.avisos ul { margin:0; padding-left:18px; color:var(--rojo); font-size:.9rem; }
.laminas figure { margin:8px 0; } .laminas img { width:100%; height:auto; display:block; border-radius:4px; border:1px solid var(--linea); }
figcaption { font-size:.74rem; color:var(--suave); margin-top:3px; }
.piezas .fila { display:flex; gap:10px; flex-wrap:wrap; } .pieza { margin:0; width:160px; }
.pieza img { width:100%; height:100px; object-fit:contain; background:var(--caja2); border-radius:4px; padding:6px; }
.pieza figcaption { font-family:ui-monospace, monospace; font-size:.6rem; word-break:break-all; }
@media (max-width:700px) { .laminas figure { overflow-x:auto; } .laminas img { width:auto; max-width:none; height:280px; } .linea { height:40px; } .seg span { display:none; } }
"""


def pagina():
    indice = "".join(f'<a href="#{e["s"]}"><b>{e["s"]}</b>{esc(e["titulo"])}</a>' for e in SB["escenas"])
    n_planos = sum(len(e["planos"]) for e in SB["escenas"])
    n_avisos = sum(len(p["_avisos"]) for e in SB["escenas"] for p in e["planos"])
    globales = (semaforo(TOTAL["voz"] / TOTAL["video"] <= 0.85, f"voz {pct(TOTAL['voz'] / TOTAL['video'])} del episodio (meta ~70 %)")
                + semaforo(TOTAL["quieta"] / TOTAL["video"] >= 0.2, f"cámara quieta {pct(TOTAL['quieta'] / TOTAL['video'])}")
                + semaforo(n_avisos == 0, f"{n_avisos} avisos de pantalla"))
    return f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Storyboard 0·2</title><style>{CSS}</style></head>
<body><main>
<p class="meta">HISTORIA DE LA CORRUPCIÓN EN EL PERÚ · EPISODIO 0·2 · VERSIÓN {SB['version']} · {esc(SB['fecha'])}</p>
<h1>{esc(SB['titulo'])}</h1>
<p class="meta">{n_planos} planos · {mmss(TOTAL['video'])} en pantalla · voz: {NAR['nombre']}, {NAR['modelo']} · generado con storyboard.py</p>
<p class="intro">{esc(SB['estado'])} Criterio: {esc(SB['criterio'])}</p>
<div class="chips">{globales}</div>
{revision_html()}
<h2 style="font-size:1.3rem">El sistema visual</h2>
{sistema_html()}
<p class="intro">La barra de cada escena muestra sus planos a escala de tiempo: gris, cámara quieta; borde azul, cámara en movimiento; rojo, excepción reservada. Cada plano trae la voz con su emoción y el segundo en que empieza en su MP3.</p>
<nav>{indice}</nav>
{''.join(escena_html(e) for e in SB['escenas'])}
</main></body></html>
"""


def markdown():
    out = [f"# {SB['titulo']} (versión {SB['version']})", "",
           f"Generado desde `storyboard.json` con `storyboard.py`; no se edita a mano. {SB['estado']}", "",
           "La versión completa, con láminas, voz con emoción, métricas y avisos, es `storyboard.html`.", "",
           f"**Episodio:** {mmss(TOTAL['video'])} en pantalla · voz {pct(TOTAL['voz'] / TOTAL['video'])} · cámara quieta {pct(TOTAL['quieta'] / TOTAL['video'])}.", ""]
    for e in SB["escenas"]:
        out += [f"## {e['s']} · {e['titulo']}", "", f"*{e['espacio']}.* {e['cambia']}", "",
                f"{mmss(e['_video'])} · voz {pct(e['_voz_pct'])} · cámara quieta {pct(e['_quieta'])} · {e['_datos_min']:.1f} rótulos con datos por minuto.", ""]
        for p in e["planos"]:
            cam = "quieta" if p["camara"]["tipo"] == "quieta" else f"{p['camara']['tipo']} ({p['camara']['motivo']})"
            rot = "; ".join(r["t"] for r in p["pantalla"]) or "sin rótulos"
            out += [f"### {p['id']} · {p['verbo']} · {p['_dur']:.1f} s" + (" · excepción reservada" if p.get("excepcion") else ""),
                    "", f"{p['idea']} {p['imagen']}", "", f"- **Pantalla:** {rot}.", f"- **Cámara:** {cam}.",
                    f"- **Efecto:** {p.get('efecto', '')}", f"- **Sonido:** {p.get('sonido', '')}"]
            if p.get("falta"):
                out.append(f"- **Falta:** {p['falta']}")
            for a in p["_avisos"]:
                out.append(f"- **Aviso:** {a}")
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
    for e in SB["escenas"]:
        print(f"{e['s']}: {mmss(e['_video'])} · voz {pct(e['_voz_pct'])} · quieta {pct(e['_quieta'])} · "
              f"{e['_datos_min']:.1f} datos/min · parejos {e['_parejas'] or '-'}")
        for p in e["planos"]:
            for a in p["_avisos"]:
                print(f"   {p['id']}: {a}")
    print(f"total {mmss(TOTAL['video'])} · voz {pct(TOTAL['voz'] / TOTAL['video'])} · quieta {pct(TOTAL['quieta'] / TOTAL['video'])}")
