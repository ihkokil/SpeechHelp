
@echo off
echo Starting development server...

REM Check if node_modules exists
IF NOT EXIST node_modules (
  echo Installing dependencies...
  call npm install
)

REM Run the development server
node start-dev.js %*
