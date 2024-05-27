
@echo off
echo =======================================
echo Starting SpeechHelp Application
echo =======================================

:: Try with node script first (most reliable)
node start-app.js
IF %ERRORLEVEL% EQU 0 goto :EOF

:: Try with direct run-vite.js
echo Trying alternative method...
node run-vite.js
IF %ERRORLEVEL% EQU 0 goto :EOF

:: Last resort - direct npx call
echo Trying with npx directly...
npx vite
