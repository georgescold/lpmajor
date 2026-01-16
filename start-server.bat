@echo off
title Major Blog - Serveur Local
echo.
echo ========================================
echo   Major Blog - Serveur de developpement
echo ========================================
echo.
echo Demarrage du serveur sur http://localhost:3000
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

cd /d "%~dp0"
npx http-server . -p 3000 -c-1

pause
