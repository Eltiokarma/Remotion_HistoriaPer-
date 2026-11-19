"""Genera el manuscrito de locución del 0·2 a partir de guion.md.

    python3 historia/videos/002-la-deuda-defraudada/manuscrito.py

Escribe manuscrito.md (la voz sola, para leer en voz alta) y manuscrito.html (la voz y, al lado,
qué cambia en el storyboard). El guion es la fuente: no se edita el manuscrito a mano.
"""
import html
import re
from pathlib import Path

AQUI = Path(__file__).resolve().parent
GUION = AQUI / "guion.md"

# Escena del guion -> escena larga del storyboard (storyboard.md).
LARGA = {
    "0": "Nueva · antes de la escena larga 1",
    "1": "Escena larga 1",
    "2": "Escena larga 2",
    "3": "Escena larga 3",
    "4": "Escena larga 4",
    "5": "Escena larga 5",
    "6": "Cierre de la escena larga 5",
}

# Qué cambia en storyboard.md por cada escena del guion.
# Estados: igual, cambia, nuevo, sale.
CAMBIOS = {
    "0": [
        ("nuevo", "Gancho", "Pila de vales sobre las pruebas de imprenta: crece de 5 a 24 millones, el corrector marca la mitad (junta) y cae el sello de la ley de 1857. Ficha de la tesis de 1980 y el libro de 1987. Reutiliza el vale y las pruebas de imprenta aprobados."),
    ],
    "1": [
        ("igual", "1A", "Islas, mapa Lima–Pisco–Chincha, ficha «Perú · hacia 1850». La ficha de Castilla se muestra aquí."),
        ("igual", "1B", "Extracción y embarque, con la pausa sin voz."),
        ("cambia", "1C", "Se suma que las casas comerciales le adelantan dinero al gobierno (Q, pp. 166–167)."),
        ("sale", "1D · contexto fiscal", "La voz ya no menciona tributo indígena, aduanas ni comerciantes y funcionarios en las cuentas. Si el esquema fiscal de la revisión 2 se queda, va sin voz."),
        ("igual", "1D", "La cámara sigue el ingreso hasta las cuentas y descubre la carpeta de reclamos."),
    ],
    "2": [
        ("igual", "2A", "Los dos ejemplos de deuda bajo «Deuda interna»."),
        ("cambia", "2B", "Ficha de la ley; se agrega un plano corto del comerciante que vuelve al Estado con «crédito público»."),
        ("cambia", "2C", "El vale lleva «6 % de interés» [VERIFICAR si es anual]."),
        ("nuevo", "Los dos huecos", "Antes la falta de criterios iba al final, como cautela. Ahora va antes del negocio, como causa: el corrector encierra en rojo dos renglones de la ley."),
        ("igual", "2D–2E", "Traspaso del folio, precio de compra y valor reconocido; intermediario y funcionario con fichas de función."),
        ("cambia", "2F", "El circuito se cierra con una frase de «Entonces» y 2,5 s de cámara quieta."),
    ],
    "3": [
        ("cambia", "3A", "Entra la ficha de la abolición de 1854 (antes era opcional)."),
        ("cambia", "3B", "Entra la comisión que Elías esperaba, 200 000 pesos (antes era opcional)."),
        ("igual", "3C", "«Fuera de plazo» y el documento detenido."),
        ("cambia", "3D", "Primero la cifra, después Torrico: 948 500 cae sola, con 2 s de silencio absoluto, y la ficha del ministro llega con «Según Quiroz»."),
        ("cambia", "3E", "Se suma la comparación con lo que pidió Elías (entre 1,6 y 1,9 veces)."),
        ("igual", "3F", "Quedan juntos reclamante, intermediario, presidente, ministro y cantidades."),
    ],
    "4": [
        ("cambia", "4A", "Se agregan los plazos de junio y octubre de 1852 en la línea de tiempo."),
        ("nuevo", "Palabra del episodio", "«los consolidados», a pantalla completa y quieta, con 2,5 s de pausa."),
        ("cambia", "4B", "La conversión gana detalle: deuda externa definida en la voz, Londres, cerca del 46 %, el vale a ~40 % en plaza frente al bono casi a la par, el «lavado». Ficha de Mendiburu. Un porcentaje por vez."),
        ("igual", "4C", "Elías recupera su ficha; cartas del 12 y 16 de agosto de 1853."),
        ("igual", "4D", "Línea de tiempo y junta fiscal: 12,2 millones, 141 expedientes, 4 robados."),
        ("cambia", "4E", "Ley del 29 de diciembre de 1856, fuga de Torrico, Echenique y Mendiburu, barcos frente a las islas (regreso de islas v3), Vivanco y la nota de Ugarte."),
    ],
    "5": [
        ("cambia", "5A", "Se agrega la defensa de Echenique («una clase capitalista nacional») frente a la exclusión que señala Quiroz."),
        ("cambia", "5B", "Dos campos, «Aprobado» y «Estimado», en lugar de tres."),
        ("igual", "5C", "Índice de la serie con el episodio 003."),
    ],
    "6": [
        ("igual", "Tarjeta", "Sin voz: la pregunta ya se dijo. Pruebas de imprenta que se cierran y el tema del canal."),
    ],
}


def leer_escenas():
    texto = GUION.read_text(encoding="utf-8")
    bloques = re.split(r"^## ESC (\d+) — (.+)$", texto, flags=re.M)
    escenas = []
    for i in range(1, len(bloques), 3):
        num, titulo, cuerpo = bloques[i], bloques[i + 1].strip(), bloques[i + 2]
        voz = re.search(r"\*\*VO:\*\*\n(.*?)(?:\n\n\*\*|\n---|\Z)", cuerpo, re.S)
        cambio = re.search(r"\*\*Cambio:\*\* (.+)", cuerpo)
        parrafos = [p.strip() for p in voz.group(1).split("\n\n") if p.strip()] if voz else []
        escenas.append({"num": num, "titulo": titulo, "parrafos": parrafos,
                        "cambio": cambio.group(1) if cambio else ""})
    return escenas


def sin_marcas(p):
    return re.sub(r"\s*\[[^\]]*\]\s*", " ", p).strip()


def solo_voz(p):
    return not sin_marcas(p)


def escribir_md(escenas):
    out = ["# La deuda defraudada · Manuscrito de locución", "",
           "Generado desde [guion.md](guion.md) con `manuscrito.py`; no se edita a mano. "
           "Las marcas `/` (pausa corta) y `//` (pausa de un segundo o más) salen de las pausas del guion.", ""]
    for e in escenas:
        out += [f"## {e['num']}. {e['titulo']}", ""]
        for p in e["parrafos"]:
            if solo_voz(p):
                out += ["*(sin voz)*", ""]
                continue
            t = re.sub(r"\s*\[(?:PAUSA|SILENCIO) ([\d,]+)s[^\]]*\]", lambda m: " //" if float(m.group(1).replace(",", ".")) >= 1 else " /", p)
            out += [t.strip(), ""]
    (AQUI / "manuscrito.md").write_text("\n".join(out), encoding="utf-8")


def pausa_html(m):
    tipo, seg, nota = m.group(1), m.group(2), (m.group(3) or "").lstrip(": ").strip()
    clase = "silencio" if tipo == "SILENCIO" else ("p-larga" if float(seg.replace(",", ".")) >= 1 else "corta")
    titulo = f"{tipo.lower()} {seg} s" + (f": {nota}" if nota else "")
    return f'<span class="pausa {clase}" title="{html.escape(titulo)}">{seg} s</span>'


def parrafo_html(p):
    t = html.escape(p)
    t = re.sub(r"\[(PAUSA|SILENCIO) ([\d,]+)s([^\]]*)\]", pausa_html, t)
    return f"<p>{t}</p>"


ESTADO = {"igual": "Igual", "cambia": "Cambia", "nuevo": "Nuevo", "sale": "Sale"}


def inline(t):
    t = html.escape(t)
    return re.sub(r"«([^»]+)»", r"«<em>\1</em>»", t)


def escribir_html(escenas):
    palabras = sum(len(sin_marcas(p).split()) for e in escenas for p in e["parrafos"])
    cuenta = {k: 0 for k in ESTADO}
    for lista in CAMBIOS.values():
        for estado, *_ in lista:
            cuenta[estado] += 1
    secciones = []
    for e in escenas:
        voz = "".join(parrafo_html(p) for p in e["parrafos"])
        filas = "".join(
            f'<li class="{est}"><span class="sello">{ESTADO[est]}</span><b>{html.escape(mom)}</b> {inline(det)}</li>'
            for est, mom, det in CAMBIOS.get(e["num"], []))
        secciones.append(f"""
<section>
  <header><span class="larga">{html.escape(LARGA.get(e['num'], ''))}</span>
  <h2><span class="num">{e['num']}</span>{html.escape(e['titulo'])}</h2>
  <p class="cambio">{inline(e['cambio'])}</p></header>
  <div class="cols"><div class="voz">{voz}</div>
  <aside><h3>Storyboard</h3><ul>{filas}</ul></aside></div>
</section>""")
    resumen = " · ".join(f"{cuenta[k]} {ESTADO[k].lower()}" for k in ESTADO)
    pagina = f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Manuscrito 0·2</title>
<style>
@font-face {{ font-family: "EB Garamond"; src: url("../../public/compartido/fuentes/EBGaramond-VF.ttf"); }}
@font-face {{ font-family: "IBM Plex Mono"; src: url("../../public/compartido/fuentes/IBMPlexMono-Regular.ttf"); }}
:root {{ --papel:#f3ecdc; --tinta:#2a2420; --suave:#6b5f53; --linea:#d9ccb2; --rojo:#a3322a; --ocre:#a8781f; --verde:#4f6b46; --caja:#ebe1cb; }}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --papel:#1d1a17; --tinta:#ece3d2; --suave:#a89a87; --linea:#3a332c; --rojo:#e0675c; --ocre:#d9a646; --verde:#8db07f; --caja:#26221e; }} }}
:root[data-theme="dark"] {{ --papel:#1d1a17; --tinta:#ece3d2; --suave:#a89a87; --linea:#3a332c; --rojo:#e0675c; --ocre:#d9a646; --verde:#8db07f; --caja:#26221e; }}
* {{ box-sizing: border-box; }}
body {{ margin:0; background:var(--papel); color:var(--tinta); font:19px/1.6 "EB Garamond", Georgia, serif; }}
main {{ max-width:1100px; margin:0 auto; padding:40px 16px 80px; }}
.mono, .larga, .sello, .pausa, .num, h3, .meta {{ font-family:"IBM Plex Mono", ui-monospace, monospace; }}
h1 {{ font-size:2.2rem; line-height:1.15; margin:0 0 6px; font-weight:600; }}
.meta {{ font-size:.8rem; color:var(--suave); }}
.intro {{ max-width:68ch; color:var(--suave); }}
section {{ border-top:1px solid var(--linea); padding:28px 0; }}
.larga {{ font-size:.75rem; letter-spacing:.06em; text-transform:uppercase; color:var(--ocre); }}
h2 {{ font-size:1.6rem; margin:4px 0 2px; font-weight:600; }}
.num {{ display:inline-block; min-width:1.8em; color:var(--rojo); }}
.cambio {{ margin:0 0 14px; color:var(--suave); font-style:italic; }}
.cols {{ display:grid; grid-template-columns:minmax(0,1.6fr) minmax(0,1fr); gap:32px; }}
@media (max-width:760px) {{ .cols {{ grid-template-columns:1fr; gap:16px; }} }}
.voz p {{ margin:0 0 .9em; max-width:62ch; }}
.pausa {{ display:inline-block; font-size:.66rem; line-height:1; padding:3px 5px; margin:0 3px; border-radius:3px; vertical-align:2px; color:var(--suave); border:1px solid var(--linea); }}
.pausa.p-larga {{ color:var(--tinta); }}
.pausa.silencio {{ color:var(--papel); background:var(--rojo); border-color:var(--rojo); }}
aside {{ background:var(--caja); border-radius:6px; padding:14px 16px; align-self:start; font-size:.92rem; line-height:1.45; }}
h3 {{ font-size:.72rem; letter-spacing:.08em; text-transform:uppercase; margin:0 0 8px; color:var(--suave); font-weight:400; }}
ul {{ list-style:none; margin:0; padding:0; }}
li {{ margin:0 0 10px; }}
li b {{ font-weight:600; }}
.sello {{ display:inline-block; font-size:.62rem; text-transform:uppercase; letter-spacing:.05em; padding:2px 5px; margin-right:6px; border-radius:3px; border:1px solid currentColor; vertical-align:2px; }}
li.igual .sello {{ color:var(--suave); }}
li.cambia .sello {{ color:var(--ocre); }}
li.nuevo .sello {{ color:var(--verde); }}
li.sale .sello {{ color:var(--rojo); }}
</style></head>
<body><main>
<p class="meta">HISTORIA DE LA CORRUPCIÓN EN EL PERÚ · EPISODIO 0·2</p>
<h1>La deuda defraudada · Manuscrito de locución</h1>
<p class="meta">{palabras} palabras de voz · generado desde guion.md con manuscrito.py</p>
<p class="intro">En cada escena va lo que dice la voz, con sus pausas en segundos (en rojo, los silencios sin música), y en el recuadro, qué pasa con cada momento del storyboard de las cinco escenas largas. En total: {resumen}.</p>
{''.join(secciones)}
</main></body></html>
"""
    (AQUI / "manuscrito.html").write_text(pagina, encoding="utf-8")


if __name__ == "__main__":
    escenas = leer_escenas()
    escribir_md(escenas)
    escribir_html(escenas)
    print(f"{len(escenas)} escenas -> manuscrito.md y manuscrito.html")
