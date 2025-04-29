
@echo off
echo Starting development server...

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Check if vite exists
if not exist "node_modules\.bin\vite.cmd" (
    echo Installing Vite...
    call npm install vite @vitejs/plugin-react-swc --save-dev
)

REM Run the JavaScript start script
node start-dev.js %*

