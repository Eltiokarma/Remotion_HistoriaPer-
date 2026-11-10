#!/usr/bin/env python3
"""
Muestra 11 · Escribe las llamadas MCP con las que Inkscape (servidor inksmcp) compone el título del
episodio 0·1 con las fuentes del canal y lo convierte a trazos (cada letra, un contorno que Remotion
puede dibujar). Las fuentes tienen que estar instaladas en el sistema (public/compartido/fuentes).

  python3 dibujo.py <carpeta de trabajo>
  python3 ../../scripts/mcp_llamar.py <carpeta>/llamadas.json -- inksmcp

Ids que usa Remotion: w-<n> (una palabra cada uno, en orden de lectura) y su línea en data-linea.
El texto es el título de videos/001-el-hombre/escenas.json.
"""
import json
import sys
from pathlib import Path

TITULO = "El hombre que le sacó la cuenta al Perú"  # videos/001-el-hombre/escenas.json, "titulo"
X = 236  # margen izquierdo: bloque a la izquierda, composición asimétrica
LINEAS = [
    # (palabras, familia, peso, estilo, tamaño, línea base)
    (["El", "hombre", "que"], "EB Garamond", "normal", "italic", 78, 418),
    (["le", "sacó", "la", "cuenta"], "Playfair Display", "bold", "normal", 172, 612),
    (["al", "Perú."], "Playfair Display", "normal", "italic", 128, 772),
]
TINTA = "#1c1b19"


def main() -> None:
    trabajo = Path(sys.argv[1]).resolve()
    trabajo.mkdir(parents=True, exist_ok=True)
    assert " ".join(w for l in LINEAS for w in l[0]).rstrip(".") == TITULO, "el texto tiene que ser el título exacto"
    elementos, n = [], 0
    for linea, (palabras, familia, peso, estilo, tam, base) in enumerate(LINEAS):
        for i, palabra in enumerate(palabras):
            e = {"type": "text", "id": f"w-{n}", "text": palabra, "font_family": familia, "font_weight": peso,
                 "font_style": estilo, "font_size": tam, "fill": TINTA, "layer": "titulo", "label": f"linea-{linea}"}
            if i == 0:
                e.update({"x": X, "y": base})
            else:  # la palabra se pone a la derecha de la anterior, medida por Inkscape (no adivinada)
                e.update({"x": 0, "y": base, "place": {"right_of": f"w-{n-1}", "gap": round(tam * 0.26, 1), "align": "end"}})
            elementos.append(e)
            n += 1
    llamadas = [
        {"herramienta": "document_create", "argumentos": {"width": 1920, "height": 1080}},
        {"herramienta": "add_elements", "argumentos": {"elements": elementos}},
        # place alinea por la caja (una q con descendente sube la palabra): se suelta y se vuelve a la base
        {"herramienta": "update_elements", "argumentos": {"updates": [{"id": e["id"], "place": None, "y": e["y"]} for e in elementos if "place" in e]}},
        {"herramienta": "inspect", "argumentos": {"layer": "titulo"}},
        {"herramienta": "render_preview", "argumentos": {"max_size": 1200}},
        # texto a trazos: cada palabra pasa a contornos de letra (lo que permite dibujarlas)
        {"herramienta": "path_operation", "argumentos": {"operation": "to_path", "ids": [f"w-{i}" for i in range(n)]}},
        {"herramienta": "inspect", "argumentos": {"layer": "titulo"}},
        {"herramienta": "document_save", "argumentos": {"path": str(trabajo / "titulo-inkscape.svg")}},
        {"herramienta": "export", "argumentos": {"path": str(trabajo / "titulo-plano.svg"), "format": "plain-svg"}},
    ]
    (trabajo / "llamadas.json").write_text(json.dumps(llamadas, ensure_ascii=False, indent=1))
    print(f"{len(llamadas)} llamadas, {n} palabras → {trabajo / 'llamadas.json'}")


if __name__ == "__main__":
    main()
