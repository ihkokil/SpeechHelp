
@echo off
echo Starting development server...

REM Check if node_modules exists
IF NOT EXIST node_modules (
  echo Installing dependencies...
  call npm install
)

REM Run the development server using the Node.js script
echo Attempting to start the server with Node.js script...
node start-dev.js %*

REM If that fails, try npx directly
IF %ERRORLEVEL% NEQ 0 (
  echo Node script approach failed, trying npx vite...
  npx vite %*
)

REM If that also fails, try npm run dev
IF %ERRORLEVEL% NEQ 0 (
  echo npx approach failed, trying npm run dev...
  npm run dev
)
