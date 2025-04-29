
#!/bin/bash
# This script ensures vite is available and starts the development server

# Make the script exit on error
set -e

# Ensure script is executable
if [ ! -x "$0" ]; then
  chmod +x "$0"
  echo "Made script executable"
fi

echo "Starting development server setup..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo "Error: npm is not installed. Please install Node.js and npm first."
  exit 1
fi

# Check if node_modules exists; if not, install dependencies
if [ ! -d "node_modules" ]; then
  echo "Node modules not found. Installing dependencies..."
  npm install
fi

# Ensure vite is installed globally or locally
if ! command -v vite &> /dev/null && [ ! -f "node_modules/.bin/vite" ] && [ ! -f "node_modules/vite/bin/vite.js" ]; then
  echo "Vite not found. Installing vite..."
  npm install vite --save-dev
fi

# Run the start-dev.js script which handles finding and running vite
echo "Starting development server..."
node start-dev.js

