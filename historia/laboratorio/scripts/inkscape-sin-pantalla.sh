#!/usr/bin/env bash
# Inkscape sin pantalla imprime un aviso de GTK ("Failed to wrap object of type 'GtkRecentManager'")
# que inksmcp toma por error. Se filtra solo esa línea; todo lo demás pasa igual.
exec inkscape "$@" 2> >(grep --line-buffered -v "GtkRecentManager" >&2)
