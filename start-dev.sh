
#!/bin/bash
# This script runs the Node.js script to start the development server

# Make sure this script is executable
chmod +x "$0"

echo "Starting development server..."

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Try multiple approaches to start the dev server
echo "Attempting to start the development server..."

# First attempt: Use the node script
node start-dev.js "$@"

# If the above failed (non-zero exit code), try using npx directly
if [ $? -ne 0 ]; then
  echo "Node script approach failed, trying npx vite..."
  npx vite "$@"
fi

# If that also failed, try npm run dev
if [ $? -ne 0 ]; then
  echo "npx approach failed, trying npm run dev..."
  npm run dev
fi

# Last resort: try to install vite globally if all else fails
if [ $? -ne 0 ]; then
  echo "All approaches failed. Attempting to install vite globally..."
  npm install -g vite
  vite "$@"
fi
