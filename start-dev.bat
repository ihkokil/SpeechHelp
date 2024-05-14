
@echo off
echo Starting development server...

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Run the JavaScript start script
node start-dev.js %*
