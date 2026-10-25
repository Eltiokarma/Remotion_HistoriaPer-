#!/bin/sh
# Equivalente de iniciar.bat para Linux.
cd "$(dirname "$0")"
if [ ! -f .venv/instalado.txt ]; then
  echo "Primera vez: preparando el entorno..."
  { [ -x .venv/bin/python ] || python3 -m venv .venv; } && .venv/bin/python -m pip install -r requirements.txt && touch .venv/instalado.txt || exit 1
fi
exec .venv/bin/python run.py "$@"
