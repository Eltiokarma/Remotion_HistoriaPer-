@echo off
setlocal
cd /d "%~dp0"
title Karaoke Fansub

rem Busca Python: primero el lanzador "py", luego "python".
set "PY="
where py >nul 2>nul && set "PY=py -3"
if not defined PY (where python >nul 2>nul && set "PY=python")
if not defined PY (
  echo No encuentro Python. Instalalo desde https://www.python.org/downloads/
  echo y marca la casilla "Add python.exe to PATH" durante la instalacion.
  pause
  exit /b 1
)

rem La marca .venv\instalado.txt solo se crea si pip termino bien.
if not exist ".venv\instalado.txt" (
  echo Primera vez: preparando el entorno, espera un momento...
  if not exist ".venv\Scripts\python.exe" %PY% -m venv .venv || goto :error
  ".venv\Scripts\python.exe" -m pip install --upgrade pip >nul
  ".venv\Scripts\python.exe" -m pip install -r requirements.txt || goto :error
  echo ok> ".venv\instalado.txt"
)

".venv\Scripts\python.exe" run.py
if errorlevel 1 goto :error
exit /b 0

:error
echo.
echo Algo fallo. Revisa el mensaje de arriba y la seccion "Problemas tipicos" del README.
pause
exit /b 1
