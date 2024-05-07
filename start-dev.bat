
@echo off
echo Starting development environment...

:: Execute the setup script first to ensure all dependencies are installed
echo Running setup script to ensure dependencies are installed...
node setup.js

echo Starting development server...

:: Method 1: Try using the direct vite copy we created
if exist "vite-direct.cmd" (
    echo Starting with direct Vite executable...
    call vite-direct.cmd %*
    if %errorlevel% EQU 0 exit /b 0
)

:: Method 2: Try using local path
if exist "node_modules\.bin\vite.cmd" (
    echo Starting with local Vite...
    call node_modules\.bin\vite.cmd %*
    if %errorlevel% EQU 0 exit /b 0
)

:: Method 3: Try using npx
echo Attempting to start Vite using npx...
call npx vite %*
if %errorlevel% EQU 0 exit /b 0

:: Method 4: Try using npm run
echo Attempting to start Vite using npm run...
call npm run dev
if %errorlevel% EQU 0 exit /b 0

:: Method 5: Try using global vite
echo Attempting to start Vite using global installation...
call vite %*
if %errorlevel% EQU 0 exit /b 0

:: Method 6: Use Node.js to run the start-dev.js script as a last resort
echo All direct methods failed, using JavaScript fallback...
node start-dev.js %*
