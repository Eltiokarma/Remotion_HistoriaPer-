#!/usr/bin/env python3
"""
Muestra 10 · Escribe las llamadas MCP que dibujan la balsa de totora en Inkscape (servidor inksmcp).

  python3 dibujo.py <carpeta de trabajo>      → <carpeta>/llamadas.json y las geometrías (capas/*.json)
  python3 ../../scripts/mcp_llamar.py <carpeta>/llamadas.json -- inksmcp

Qué hace cada parte:
- Este script solo calcula la geometría (con semilla) y los colores (mezclas de la paleta del canal).
- Inkscape, por MCP, crea el documento, las capas, las une (operaciones booleanas para la balsa),
  devuelve vistas previas para revisar y exporta el SVG que anima Remotion.
El SVG final va a public/laboratorio/10-balsa.svg. Ids de grupo que usa Remotion: balsa, reflejo,
agua-lineas, totora-izq, totora-der, sol.
"""
import json
import math
import random
import sys
from pathlib import Path

ANCHO, ALTO = 1920, 1080
HORIZONTE = 600
R = random.Random(10)

# Paleta del canal (laboratorio/remotion/comun.ts)
FONDO, PAPEL, OCRE, ROJO, VERDE = "#1c1b19", "#ede4d3", "#c2a878", "#b3261e", "#5e6b4e"


def mezclar(a: str, b: str, k: float) -> str:
    x = [int(a[i:i + 2], 16) for i in (1, 3, 5)]
    y = [int(b[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join(f"{round(p + (q - p) * k):02x}" for p, q in zip(x, y))


BRUMA = mezclar(OCRE, PAPEL, 0.45)  # el aire del amanecer
HONDO = mezclar(VERDE, FONDO, 0.7)  # lo más cercano


def capa_color(k: float) -> str:
    """De lejos (0, toma el color del aire) a cerca (1, casi tinta)."""
    return mezclar(BRUMA, VERDE, k * 1.4) if k < 0.5 else mezclar(mezclar(BRUMA, VERDE, 0.7), HONDO, (k - 0.5) * 2)


def cresta(x0, x1, base, alto, picos, rug, semilla, isla=False):
    r = random.Random(semilla)
    pts = []
    n = 90
    fases = [r.uniform(0, 6.28) for _ in range(3)]
    for i in range(n + 1):
        u = i / n
        x = x0 + (x1 - x0) * u
        h = (0.55 + 0.25 * math.sin(u * picos * 3.1 + fases[0]) + 0.15 * math.sin(u * picos * 7.3 + fases[1])
             + 0.05 * math.sin(u * picos * 17 + fases[2]))
        if isla:  # una isla baja al agua en las dos puntas
            h *= math.sin(math.pi * u) ** 0.6
        pts.append([round(x, 1), round(base - alto * max(0.0 if isla else 0.05, h) + (0 if isla and i in (0, n) else r.uniform(-rug, rug)), 1)])
    return pts


def poligono_cresta(pts, base):
    return pts + [[pts[-1][0], base], [pts[0][0], base]]


def franjas(y0, y1, n, c0, c1, capa, prefijo):
    """Degradado en franjas (el MCP no crea degradados; el vector plano usa franjas)."""
    out = []
    for i in range(n):
        ya = y0 + (y1 - y0) * i / n
        yb = y0 + (y1 - y0) * (i + 1) / n
        out.append({"type": "rect", "id": f"{prefijo}-{i}", "x": -10, "y": round(ya, 1), "width": ANCHO + 20,
                    "height": round(yb - ya + 0.6, 1), "fill": mezclar(c0, c1, i / (n - 1)), "layer": capa})
    return out


def main() -> None:
    trabajo = Path(sys.argv[1]).resolve()
    (trabajo / "capas").mkdir(parents=True, exist_ok=True)
    capas: dict[str, list] = {}

    # 1. cielo: de verde gris arriba a ocre claro sobre el horizonte, en franjas
    capas["cielo"] = franjas(0, HORIZONTE + 5, 40, mezclar(VERDE, PAPEL, 0.32), mezclar(OCRE, PAPEL, 0.55), "cielo", "cielo")
    # 2. sol con halo (anillos de opacidad baja)
    sol = {"cx": 1290, "cy": 455, "r": 44}
    capas["sol"] = [{"type": "group", "id": "sol", "layer": "sol"}]
    for i in range(24, 0, -1):
        capas["sol"].append({"type": "circle", "parent": "sol", "cx": sol["cx"], "cy": sol["cy"], "r": round(sol["r"] + 420 * (i / 24) ** 1.7, 1),
                             "fill": mezclar(PAPEL, OCRE, 0.3), "opacity": 0.035})
    capas["sol"].append({"type": "circle", "parent": "sol", "id": "disco", "cx": sol["cx"], "cy": sol["cy"], "r": sol["r"], "fill": PAPEL})

    # 3. tres planos de cerros, de lejos a cerca, con su pie más claro (bruma)
    planos = [(0.1, cresta(-20, 1940, HORIZONTE, 230, 3, 4, 1), "nevados"),
              (0.3, cresta(-20, 1940, HORIZONTE + 2, 120, 5, 3, 2), "cerros"),
              (0.48, cresta(260, 1120, HORIZONTE + 4, 60, 4, 2, 3, isla=True), "isla")]
    for k, pts, nombre in planos:
        c = capa_color(k)
        capas[nombre] = [{"type": "polygon", "id": f"{nombre}-cuerpo", "points": poligono_cresta(pts, HORIZONTE + 6), "fill": c, "layer": nombre}]
        # bruma al pie: franjas de opacidad creciente, recortadas después a la forma de la capa
        alto_bruma = 40 + 60 * (1 - k)
        for j in range(8):
            capas[nombre].append({"type": "rect", "id": f"{nombre}-bruma-{j}", "x": pts[0][0], "y": round(HORIZONTE + 6 - alto_bruma * (1 - j / 8), 1),
                                  "width": pts[-1][0] - pts[0][0], "height": round(alto_bruma / 8 + 0.6, 1), "fill": BRUMA,
                                  "opacity": round(0.07 * (j + 1) * (1 - 0.4 * k), 3), "layer": nombre})
    # nieve en las cimas de los nevados (polígono recortado después por Inkscape con la montaña)
    nev = planos[0][1]
    linea = [[x, min(y + R.uniform(38, 70), HORIZONTE)] for x, y in nev]
    # la intersección conserva el estilo del objeto de ABAJO (E22 de inksmcp): el molde lleva el color de la nieve
    capas["nevados"].append({"type": "polygon", "id": "nevados-molde", "points": poligono_cresta(nev, HORIZONTE + 6), "fill": mezclar(PAPEL, OCRE, 0.08), "layer": "nevados"})
    capas["nevados"].append({"type": "polygon", "id": "nevados-nieve", "points": [[x, y - 2] for x, y in nev] + linea[::-1],
                             "fill": mezclar(PAPEL, OCRE, 0.08), "layer": "nevados"})

    # 4. el lago: franjas del reflejo del cielo (claro arriba) al verde hondo abajo
    capas["lago"] = franjas(HORIZONTE + 4, ALTO + 5, 30, mezclar(OCRE, PAPEL, 0.5), mezclar(VERDE, FONDO, 0.4), "lago", "lago")
    # columna de luz del sol en el agua
    for i in range(16):
        y = HORIZONTE + 10 + i * 13 + i * i * 0.4
        w = (30 + i * 10) * R.uniform(0.4, 1)
        capas["lago"].append({"type": "rect", "x": round(sol["cx"] - w / 2 + R.uniform(-8, 8) * i / 6, 1), "y": round(y, 1), "width": round(w, 1),
                              "height": 2 + i * 0.25, "fill": PAPEL, "opacity": round(0.55 * (1 - i / 16), 2), "layer": "lago"})
    # líneas del agua (un grupo que Remotion hace derivar)
    capas["agua"] = [{"type": "group", "id": "agua-lineas", "layer": "agua"}]
    for i in range(46):
        k = (i / 46) ** 1.7
        y = HORIZONTE + 12 + k * 450
        x = R.uniform(-260, 0)
        while x < ANCHO + 260:
            largo = R.uniform(40, 260) * (0.5 + k)
            capas["agua"].append({"type": "line", "parent": "agua-lineas", "x1": round(x, 1), "y1": round(y, 1), "x2": round(x + largo, 1), "y2": round(y, 1),
                                  "stroke": mezclar(PAPEL, OCRE, 0.2), "stroke_width": round(0.8 + 2 * k, 2), "opacity": round(0.4 - 0.15 * k, 2)})
            x += largo + R.uniform(50, 240) * (0.5 + k)

    # 5. la balsa de totora: dos atados curvos (el de abajo más largo) y la proa alzada; los une Inkscape
    def atado(cx, cy, largo, grueso, alza, ident):
        pts_arriba, pts_abajo = [], []
        for i in range(41):
            u = i / 40 * 2 - 1  # -1 popa, 1 proa
            x = cx + u * largo / 2
            curva = alza * (abs(u) ** 2.6) * (1.3 if u > 0 else 0.8)  # las puntas se levantan; la proa más
            esp = grueso * (1 - 0.55 * abs(u) ** 3)
            pts_arriba.append([round(x, 1), round(cy - curva - esp / 2, 1)])
            pts_abajo.append([round(x, 1), round(cy - curva + esp / 2, 1)])
        return {"type": "polygon", "id": ident, "points": pts_arriba + pts_abajo[::-1], "fill": mezclar(OCRE, VERDE, 0.35), "layer": "balsa", "parent": "balsa"}

    bx, by = 1180, 790
    capas["balsa"] = [{"type": "group", "id": "balsa", "layer": "balsa"},
                      atado(bx, by, 480, 62, 70, "atado-bajo"),
                      atado(bx + 20, by - 36, 350, 44, 50, "atado-alto"),
                      # la proa: el cuello del atado que sube y se dobla (un trazo grueso que Inkscape vuelve forma)
                      {"type": "path", "id": "proa", "d": f"M {bx+190} {by-70} Q {bx+252} {by-92} {bx+262} {by-150} Q {bx+266} {by-176} {bx+246} {by-184}",
                       "fill": "none", "stroke": mezclar(OCRE, VERDE, 0.35), "stroke_width": 30, "stroke_linecap": "round", "parent": "balsa"}]
    # amarres: franjas oscuras que cruzan los atados (se recortan a la balsa)
    for i, u in enumerate([-0.62, -0.38, -0.12, 0.14, 0.4, 0.64]):
        x = bx + u * 235
        capas["balsa"].append({"type": "rect", "id": f"amarre-{i}", "x": round(x - 3, 1), "y": by - 160, "width": 6, "height": 200,
                               "fill": mezclar(OCRE, FONDO, 0.55), "parent": "balsa"})
    # la boga: de pie en la popa, con la pértiga (silueta)
    px, py = bx - 120, by - 55
    capas["balsa"] += [
        {"type": "path", "id": "boga", "parent": "balsa", "fill": HONDO,
         "d": f"M {px-14} {py} L {px-10} {py-60} Q {px-16} {py-96} {px-2} {py-108} Q {px+14} {py-98} {px+12} {py-62} L {px+15} {py} Z"},
        {"type": "circle", "id": "cabeza", "parent": "balsa", "cx": px + 1, "cy": py - 121, "r": 12, "fill": HONDO},
        {"type": "path", "id": "sombrero", "parent": "balsa", "fill": HONDO, "d": f"M {px-18} {py-127} L {px+20} {py-127} L {px+9} {py-139} L {px-8} {py-139} Z"},
        {"type": "line", "id": "pertiga", "parent": "balsa", "x1": px + 40, "y1": py - 190, "x2": px - 80, "y2": py + 120,
         "stroke": HONDO, "stroke_width": 5, "stroke_linecap": "round"},
    ]

    # 6. totora del primer plano: hojas afinadas, cortadas por el borde, más a la izquierda
    def hojas(x0, x1, n, alto, lado, semilla):
        r = random.Random(semilla)
        out = [{"type": "group", "id": f"totora-{lado}", "layer": "totora"}]
        for i in range(n):
            x = r.uniform(x0, x1)
            borde = 1 - min(1, abs(x - (x0 if lado == "izq" else x1)) / abs(x1 - x0))
            h = alto * (0.45 + 0.7 * borde) * r.uniform(0.7, 1.1)
            inclina = r.uniform(-0.35, 0.2) * (1 if lado == "izq" else -1)
            base = ALTO + 10
            tx, ty = x + math.sin(inclina) * h, base - math.cos(inclina) * h
            cx, cy = x + math.sin(inclina * 0.4) * h * 0.5, base - h * 0.55
            w = r.uniform(3, 7)
            d = f"M {x-w:.1f} {base} Q {cx-w*0.6:.1f} {cy:.1f} {tx:.1f} {ty:.1f} Q {cx+w*0.6:.1f} {cy:.1f} {x+w:.1f} {base} Z"
            out.append({"type": "path", "parent": f"totora-{lado}", "d": d, "fill": HONDO if r.random() < 0.8 else mezclar(HONDO, OCRE, 0.25)})
            if h > alto * 0.7 and r.random() < 0.5:  # la espiga
                out.append({"type": "ellipse", "parent": f"totora-{lado}", "cx": round(tx, 1), "cy": round(ty + 16, 1), "rx": 4, "ry": 17,
                            "fill": mezclar(HONDO, OCRE, 0.35)})
        return out

    capas["totora-izq"] = hojas(-40, 520, 120, 420, "izq", 21)
    capas["totora-der"] = hojas(1640, 1960, 60, 260, "der", 22)

    llamadas = [{"herramienta": "document_create", "argumentos": {"width": ANCHO, "height": ALTO}}]
    for nombre, elems in capas.items():
        p = trabajo / "capas" / f"{nombre}.json"
        p.write_text(json.dumps({"elements": elems}, ensure_ascii=False))
        llamadas.append({"herramienta": "add_elements", "argumentos": {"elements_path": str(p)}})
    # Inkscape hace lo que el código solo no hace fácil:
    llamadas += [
        # la nieve, recortada a la forma de la montaña (intersección)
        {"herramienta": "path_operation", "argumentos": {"operation": "intersection", "ids": ["nevados-molde", "nevados-nieve"]}},
        # la proa, de trazo a forma; después los dos atados y la proa, unidos en un solo casco
        {"herramienta": "path_operation", "argumentos": {"operation": "stroke_to_path", "ids": ["proa"]}},
        {"herramienta": "path_operation", "argumentos": {"operation": "union", "ids": ["atado-bajo", "atado-alto", "proa"]}},
        # la bruma de cada plano, recortada a la forma de su cerro (clip de Inkscape)
        {"herramienta": "update_elements", "argumentos": {"updates": [{"id": f"{n}-bruma-{j}", "clip": f"{n}-cuerpo"} for n in ("nevados", "cerros", "isla") for j in range(8)]}},
        # los amarres, recortados a la forma del casco (clip de Inkscape)
        {"herramienta": "update_elements", "argumentos": {"updates": [{"id": f"amarre-{i}", "clip": "atado-bajo"} for i in range(6)]}},
        {"herramienta": "inspect", "argumentos": {"layer": "balsa"}},
        {"herramienta": "render_preview", "argumentos": {"max_size": 1200}},
        {"herramienta": "render_preview", "argumentos": {"max_size": 900, "ids": ["balsa"]}},
        {"herramienta": "document_save", "argumentos": {"path": str(trabajo / "balsa-inkscape.svg")}},
        {"herramienta": "export", "argumentos": {"path": str(trabajo / "balsa-plano.svg"), "format": "plain-svg"}},
    ]
    (trabajo / "llamadas.json").write_text(json.dumps(llamadas, ensure_ascii=False, indent=1))
    print(f"{len(llamadas)} llamadas, {sum(len(v) for v in capas.values())} elementos → {trabajo / 'llamadas.json'}")


if __name__ == "__main__":
    main()
