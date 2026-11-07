#!/usr/bin/env python3
"""
Cliente MCP mínimo: abre un servidor MCP por stdio y le hace, en una sola sesión, las llamadas de un
archivo JSON. Sirve para probar un servidor MCP (muestra 10: inksmcp) y para que el dibujo se pueda
repetir: las llamadas quedan escritas.

  python mcp_llamar.py <llamadas.json> -- <comando del servidor...>
  python mcp_llamar.py --herramientas -- <comando del servidor...>

llamadas.json: [{"herramienta": "document_create", "argumentos": {...}}, ...]
Las imágenes que devuelva una herramienta se guardan junto al JSON como <nombre>-<n>.png.
"""
import asyncio
import base64
import json
import os
import sys
from pathlib import Path

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


async def main() -> int:
    i = sys.argv.index("--")
    args, cmd = sys.argv[1:i], sys.argv[i + 1:]
    # el SDK solo pasa unas pocas variables al servidor; se le pasan todas (p. ej. INKSCAPE_PATH)
    params = StdioServerParameters(command=cmd[0], args=cmd[1:], env=dict(os.environ))
    async with stdio_client(params) as (leer, escribir):
        async with ClientSession(leer, escribir) as s:
            await s.initialize()
            if args and args[0] == "--herramientas":
                for t in (await s.list_tools()).tools:
                    print(f"## {t.name}\n{t.description}\n{json.dumps(t.input_schema, ensure_ascii=False)[:1500]}\n")
                return 0
            ruta = Path(args[0])
            llamadas = json.loads(ruta.read_text())
            fallas = 0
            for n, ll in enumerate(llamadas):
                r = await s.call_tool(ll["herramienta"], ll.get("argumentos", {}))
                for c in r.content:
                    if c.type == "text":
                        print(f"[{n} {ll['herramienta']}] {c.text[:600]}")
                    elif c.type == "image":
                        destino = ruta.with_name(f"{ruta.stem}-{n}.png")
                        destino.write_bytes(base64.b64decode(c.data))
                        print(f"[{n} {ll['herramienta']}] imagen → {destino}")
                if r.is_error:
                    fallas += 1
                    print(f"[{n}] ERROR: se detiene")
                    break
            return 1 if fallas else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
