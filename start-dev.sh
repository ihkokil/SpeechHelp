
#!/bin/bash
# This script ensures vite is available and starts the development server

# Make the script exit on error
set -e

# Check if node_modules exists; if not, install dependencies
if [ ! -d "node_modules" ]; then
  echo "Node modules not found. Installing dependencies..."
  npm install
fi

# Ensure vite is installed
if [ ! -f "node_modules/.bin/vite" ] && [ ! -f "node_modules/vite/bin/vite.js" ]; then
  echo "Vite not found. Installing vite..."
  npm install vite
fi

# Run the start-dev.js script which handles finding and running vite
node start-dev.js
