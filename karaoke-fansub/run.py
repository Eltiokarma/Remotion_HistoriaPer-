"""Arranca Karaoke Fansub: `python run.py` (o doble clic en iniciar.bat en Windows)."""
import socket
import sys
import threading
import time
import urllib.request
import webbrowser

if sys.version_info < (3, 9):
    sys.exit("Karaoke Fansub necesita Python 3.9 o más nuevo.")

try:
    import uvicorn  # noqa: F401
    import fastapi  # noqa: F401
except ImportError:
    sys.exit("Faltan dependencias. Instálalas con:\n    python -m pip install -r requirements.txt")


def free_port(start=8765):
    for port in range(start, start + 50):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(("127.0.0.1", port)) != 0:
                return port
    raise SystemExit("No encontré un puerto libre entre 8765 y 8815.")


def open_when_ready(url):
    for _ in range(100):
        try:
            urllib.request.urlopen(url + "api/status", timeout=1)
            break
        except OSError:
            time.sleep(0.2)
    webbrowser.open(url)


def main():
    port = free_port()
    url = f"http://127.0.0.1:{port}/"
    print(f"\n  Karaoke Fansub corriendo en {url}\n  Cierra esta ventana (o Ctrl+C) para salir.\n")
    if "--no-browser" not in sys.argv:
        threading.Thread(target=open_when_ready, args=(url,), daemon=True).start()
    from app.main import app
    from app.storage import ensure_example
    ensure_example()
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="warning")


if __name__ == "__main__":
    main()
