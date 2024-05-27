
@echo off
echo =======================================
echo Starting SpeechHelp Application
echo =======================================

:: Check if the node_modules/.bin directory exists and has vite
if exist "node_modules\.bin\vite.cmd" (
  echo Found local Vite installation
  node_modules\.bin\vite.cmd %*
  exit /b %errorlevel%
)

:: Try with node script (most reliable method)
echo Trying with start-app.js...
node start-app.js %*
if %errorlevel% equ 0 exit /b 0

:: Try with direct run-vite.js
echo Trying with run-vite.js...
node run-vite.js %*
if %errorlevel% equ 0 exit /b 0

:: Last resort - try to install and run
echo Attempting to install Vite...
npm install vite @vitejs/plugin-react-swc --save-dev
if %errorlevel% equ 0 (
  echo Vite installed. Running application...
  node_modules\.bin\vite.cmd %*
) else (
  echo Failed to install Vite. Try running "npm install" manually.
  exit /b 1
)
