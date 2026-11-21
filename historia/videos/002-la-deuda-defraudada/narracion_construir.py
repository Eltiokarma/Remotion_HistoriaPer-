"""Arma narracion.json desde guion.md: frases, pausas y etiquetas de emoción.

    python3 historia/videos/002-la-deuda-defraudada/narracion_construir.py

La voz y las pausas salen del guion (ESC n → sNN; una frase por oración o por marca de pausa). La
emoción de cada frase está aquí, en EMOCION, porque es dirección de locución y no texto del guion.
Si el guion cambia y una frase ya no coincide, el script avisa en vez de etiquetar a ciegas.
"""
import json
import re
from pathlib import Path

AQUI = Path(__file__).resolve().parent

# Etiquetas de audio de ElevenLabs (v3/v4), por escena y frase. Regla del canal: calma, no drama;
# lo fuerte se dice más bajo, no más alto (direccion-historia §3). Emociones de la tercera acta.
EMOCION = {
    "s00": ["[serious] [calm]", "[serious] [measured]", "[serious]", "[serious] [low voice]",
            "[dry] [restrained]", "[curious] [softly]", "[calm] [storytelling]", "[calm] [warm]"],
    "s01": ["[calm] [storytelling]", "[calm]", "[curious] [light]", "[calm]",
            "[serious]", "[serious] [low voice] [slowly]", "[calm] [clear]", "[calm]", "[warm] [relieved]"],
    "s02": ["[calm] [teacher]", "[calm]", "[calm]", "[teacher] [clear]",
            "[calm] [teacher]", "[clear] [measured]", "[warm] [confident]", "[warm]",
            "[teacher] [clear]", "[teacher] [clear]", "[suspicious] [lower]", "[serious] [measured]",
            "[dry] [restrained]", "[dry]", "[dry] [ironic]", "[serious]",
            "[serious] [restrained anger]", "[measured] [clear]", "[firm] [clear]", "[calm] [teacher] [slowly]"],
    "s03": ["[solemn] [low voice]", "[solemn] [slowly]", "[serious] [low voice] [slowly]", "[serious] [measured]",
            "[calm] [neutral]", "[calm]", "[calm] [measured]", "[dry]",
            "[tense] [measured]", "[tense] [slowly]", "[tense] [low voice]", "[serious] [softly] [slowly]",
            "[dry] [restrained]", "[serious] [restrained anger]", "[serious] [measured]",
            "[calm] [measured]", "[calm] [firm]"],
    "s04": ["[calm] [careful]", "[careful] [measured]", "[serious]", "[calm] [teacher]", "[careful] [clear]",
            "[dry]", "[dry] [ironic]", "[serious] [low voice] [slowly]", "[serious] [thoughtful]",
            "[calm] [teacher]", "[calm] [teacher]", "[clear] [measured]", "[dry] [measured]", "[dry] [measured]",
            "[dry] [measured]", "[dry] [ironic]", "[dry] [ironic]", "[dry] [pointed]", "[serious] [low voice]",
            "[tense] [storytelling]", "[tense]", "[serious] [measured]", "[tense] [quick]",
            "[measured] [even]", "[measured] [even]", "[measured] [fair]",
            "[serious]", "[serious] [low voice]", "[serious] [restrained anger]", "[serious] [restrained anger]",
            "[tense]", "[tense] [measured]", "[tense]",
            "[dry] [bitter]", "[dry] [bitter] [restrained]", "[measured] [precise]",
            "[serious] [weary]", "[serious] [weary] [low voice]"],
    "s05": ["[firm] [measured]", "[firm]", "[serious]", "[serious] [low voice]", "[serious] [slowly]",
            "[calm] [warm]", "[calm] [clear]", "[serious] [low voice]", "[serious] [thoughtful]",
            "[curious] [softly]"],
}

# Tomas aparte: la cifra de Novoa sola (s03) y la pregunta final sola (s05), para que la voz no las
# pegue a la frase anterior y la pregunta suba al final. {frase después de la cual se corta: aire en s}
CORTES = {"s03": {"10": 0.8, "11": 2.0}, "s05": {"8": 1.5}}


def frases_del_guion():
    t = (AQUI / "guion.md").read_text(encoding="utf-8")
    b = re.split(r"^## ESC (\d+) — (.+)$", t, flags=re.M)
    out = {}
    for i in range(1, len(b), 3):
        v = re.search(r"\*\*VO:\*\*\n(.*?)(?:\n\n\*\*|\n---|\Z)", b[i + 2], re.S)
        fr = []
        for p in [p.strip() for p in v.group(1).split("\n\n") if p.strip()]:
            trozos = re.split(r"\[(?:PAUSA|SILENCIO) ([\d,]+)s[^\]]*\]", p)
            for k in range(0, len(trozos), 2):
                txt = trozos[k].strip()
                pausa = float(trozos[k + 1].replace(",", ".")) if k + 1 < len(trozos) else None
                if not txt:
                    if fr and pausa:
                        fr[-1][1] = pausa
                    continue
                sents = [s for s in re.split(r"(?<=[.?!])\s+", txt) if s]
                for n, s in enumerate(sents):
                    ultima = n == len(sents) - 1
                    fr.append([s, (pausa if pausa is not None else 0.8) if ultima else 0.35])
        if fr and not fr[0][0].startswith("Sin voz"):
            out[f"s{int(b[i]):02d}"] = fr
    return out


def main():
    frases = frases_del_guion()
    for s, fr in frases.items():
        if len(EMOCION[s]) != len(fr):
            raise SystemExit(f"{s}: el guion tiene {len(fr)} frases y EMOCION {len(EMOCION[s])}: revisar las etiquetas")
        for f, tag in zip(fr, EMOCION[s]):
            f[0] = f"{tag} {f[0]}"
    cfg = {
        "voz": "sku3dGbfu1taqEDqvHsQ",
        "nombre": "Joder Jolines",
        "tipo": "clon de la voz de Gerson",
        "modelo": "eleven_v4",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.8},
        "nota": "Generado por narracion_construir.py desde guion.md; no se edita a mano. Una toma por escena "
                "(scripts/narracion.py); cada frase es [texto con etiquetas de emoción, pausa después en segundos]. "
                "Modelo eleven_v4 por pedido de Gerson el 2026-11-19 (el 0·1 se hizo con eleven_v3).",
        "respiro_minimo": 1.0,
        "nota_respiro": "v4 encadena los párrafos (las pausas de 1 a 1,2 s salían de ~0,45 s): desde 1 s se garantizan con el aire de la toma, para que cada párrafo tenga su corte al editar.",
        "cortes": CORTES,
        "frases": frases,
    }
    (AQUI / "narracion.json").write_text(json.dumps(cfg, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print("narracion.json:", {s: len(f) for s, f in frases.items()})


if __name__ == "__main__":
    main()
