
#!/bin/bash
# This script runs the Node.js script to start the development server

# Make sure this script is executable
chmod +x "$0"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Check if vite is installed globally
if ! command -v vite &> /dev/null; then
  echo "Vite command not found, using local installation..."
  
  # Run the node script with any provided arguments
  node start-dev.js "$@"
else
  # If vite is available, use it directly
  vite "$@"
fi
