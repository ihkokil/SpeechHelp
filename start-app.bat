
@echo off
echo =======================================
echo Starting SpeechHelp Application
echo =======================================

:: Run the universal launcher script
node start-app.js %*

:: If that fails, try these alternatives
IF %ERRORLEVEL% NEQ 0 (
  echo Trying alternative methods...
  
  :: Try with npx
  echo Trying with npx...
  npx vite
  
  :: If all else fails
  IF %ERRORLEVEL% NEQ 0 (
    echo Failed to start the application.
    echo Try running: npm install vite --save-dev
    pause
    exit /b 1
  )
)
