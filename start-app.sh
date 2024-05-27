
#!/bin/bash
echo "======================================="
echo "Starting SpeechHelp Application"
echo "======================================="

# Make this script executable if it isn't already
if [ ! -x "$0" ]; then
  chmod +x "$0"
fi

# Check if the node_modules/.bin directory exists and has vite
if [ -x "./node_modules/.bin/vite" ]; then
  echo "Found local Vite installation"
  ./node_modules/.bin/vite "$@"
  exit $?
fi

# Try with node script (most reliable method)
echo "Trying with start-app.js..."
node start-app.js "$@"
if [ $? -eq 0 ]; then
  exit 0
fi

# Try with direct run-vite.js
echo "Trying with run-vite.js..."
node run-vite.js "$@"
if [ $? -eq 0 ]; then
  exit 0
fi

# Last resort - try to install and run
echo "Attempting to install Vite..."
npm install vite @vitejs/plugin-react-swc --save-dev
if [ $? -eq 0 ]; then
  echo "Vite installed. Running application..."
  ./node_modules/.bin/vite "$@"
else
  echo "Failed to install Vite. Try running 'npm install' manually."
  exit 1
fi
