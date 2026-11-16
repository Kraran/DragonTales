@echo off
rem DragonTales : lance l'etagere des aventures en plein ecran, dans une fenetre sans barre d'adresse,
rem avec la musique autorisee des l'ouverture. Utilise Edge, sinon Chrome, sinon le navigateur par defaut.
setlocal EnableDelayedExpansion
set "PAGE=%~dp0DragonTales.html"
if not exist "%PAGE%" (
  echo DragonTales.html est introuvable a cote de ce fichier.
  pause
  goto :eof
)
rem Adresse de la page : barres obliques, espaces remplaces par %%20
set "URL=file:///%PAGE:\=/%"
set "URL=!URL: =%%20!"
rem Le dossier de profil garde son ancien nom pour conserver les parties sauvegardees d'El Diablero.
set "PROFIL=%LOCALAPPDATA%\ElDiablero"
set "NAV="
set "N1=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
set "N2=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
set "N3=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
set "N4=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
set "N5=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if exist "%N1%" set "NAV=%N1%"
if not defined NAV if exist "%N2%" set "NAV=%N2%"
if not defined NAV if exist "%N3%" set "NAV=%N3%"
if not defined NAV if exist "%N4%" set "NAV=%N4%"
if not defined NAV if exist "%N5%" set "NAV=%N5%"
if not defined NAV (
  start "" "%PAGE%"
  goto :eof
)
start "" "%NAV%" --app="!URL!" --start-fullscreen --autoplay-policy=no-user-gesture-required --user-data-dir="%PROFIL%" --no-first-run --no-default-browser-check
