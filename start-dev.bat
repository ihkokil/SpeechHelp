
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

REM Try different methods to run Vite
echo Attempting to start Vite development server...

REM Method 1: Try using local path
if exist "node_modules\.bin\vite.cmd" (
    echo Starting with local Vite...
    call node_modules\.bin\vite %*
    exit /b %errorlevel%
)

REM Method 2: Try using npx
echo Attempting to start Vite using npx...
call npx vite %*
if %errorlevel% EQU 0 exit /b 0

REM Method 3: Try using npm run
echo Attempting to start Vite using npm run...
call npm run dev
if %errorlevel% EQU 0 exit /b 0

REM Method 4: Use Node.js to run the start-dev.js script as a last resort
echo All direct methods failed, using JavaScript fallback...
node start-dev.js %*
