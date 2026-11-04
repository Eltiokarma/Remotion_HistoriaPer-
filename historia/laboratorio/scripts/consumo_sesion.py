#!/usr/bin/env python3
"""
Consumo del agente en una sesión de Claude Code, leído de su registro (no estimado).

  python3 consumo_sesion.py <registro.jsonl> [--desde 2026-11-03T01:00] [--hasta 2026-11-03T02:00]
                            [--entrada 4 --salida 20 --lectura 0.20 --escritura 8] [--json salida.json]

El registro está en ~/.claude/projects/<carpeta del proyecto>/<id de sesión>.jsonl, en la máquina
donde corrió la sesión. En una sesión en la nube el contenedor se borra al cerrarse: hay que correr
esto ANTES de terminar (o anotar el total de la plataforma con get_session).

Cuenta, por llamada única al modelo (el registro repite una llamada en varias líneas con el mismo id):
tokens de entrada sin caché, de salida (incluye el razonamiento: el registro no los separa), lectura y
escritura de caché; errores devueltos por herramientas; usos de cada herramienta; primera y última
marca de tiempo. Solo lee números y nombres de herramientas, no el contenido de la conversación.

Costo API equivalente (USD) = (entrada·E + salida·S + lectura·L + escritura·W) / 1 000 000.
Las tarifas por defecto son las de claude-opus-5-5 (2026-10): E 4, S 20, L 0,20, W 8 (caché de
1 h; 5 con caché de 5 min). Verificarlas antes de usar el número: cambian. No es lo que se cobra
en una suscripción.
"""

import argparse
import collections
import json
import sys


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("registro")
    ap.add_argument("--desde")
    ap.add_argument("--hasta")
    ap.add_argument("--entrada", type=float, default=4.0)
    ap.add_argument("--salida", type=float, default=20.0)
    ap.add_argument("--lectura", type=float, default=0.20)
    ap.add_argument("--escritura", type=float, default=8.0)
    ap.add_argument("--json")
    a = ap.parse_args()

    dentro = lambda ts: ts and (not a.desde or ts >= a.desde) and (not a.hasta or ts < a.hasta)
    vistos: set[str] = set()
    tot = collections.Counter()
    herramientas = collections.Counter()
    primera = ultima = None
    for linea in open(a.registro, encoding="utf-8"):
        try:
            m = json.loads(linea)
        except json.JSONDecodeError:
            continue
        ts = m.get("timestamp")
        if not dentro(ts):
            continue
        msg = m.get("message") or {}
        if m.get("type") == "assistant":
            for c in msg.get("content") or []:
                if isinstance(c, dict) and c.get("type") == "tool_use":
                    herramientas[c.get("name", "?")] += 1
            mid = msg.get("id")
            if not mid or mid in vistos:
                continue
            vistos.add(mid)
            u = msg.get("usage") or {}
            tot["llamadas"] += 1
            tot["entrada"] += u.get("input_tokens") or 0
            tot["salida"] += u.get("output_tokens") or 0
            tot["lectura_cache"] += u.get("cache_read_input_tokens") or 0
            tot["escritura_cache"] += u.get("cache_creation_input_tokens") or 0
            primera = primera or ts
            ultima = ts
        elif m.get("type") == "user" and isinstance(msg.get("content"), list):
            tot["errores_herramienta"] += sum(1 for c in msg["content"] if isinstance(c, dict) and c.get("is_error"))

    costo = (tot["entrada"] * a.entrada + tot["salida"] * a.salida + tot["lectura_cache"] * a.lectura
             + tot["escritura_cache"] * a.escritura) / 1e6
    resultado = {
        "registro": a.registro.split("/")[-1],
        "ventana": {"desde": a.desde, "hasta": a.hasta, "primera_llamada": primera, "ultima_llamada": ultima},
        **{k: tot[k] for k in ("llamadas", "entrada", "salida", "lectura_cache", "escritura_cache", "errores_herramienta")},
        "herramientas": dict(herramientas.most_common()),
        "costo_api_equivalente_usd": round(costo, 2),
        "tarifas_usd_por_millon": {"entrada": a.entrada, "salida": a.salida, "lectura_cache": a.lectura, "escritura_cache": a.escritura},
        "desconocido": "razonamiento separado de la salida, reintentos de la API, cupo de la suscripción",
    }
    texto = json.dumps(resultado, ensure_ascii=False, indent=2)
    if a.json:
        open(a.json, "w", encoding="utf-8").write(texto + "\n")
    print(texto)
    return 0


if __name__ == "__main__":
    sys.exit(main())
