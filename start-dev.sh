
#!/bin/bash

# Make sure the script itself is executable
chmod +x "$0"

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js to run this script."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Install Vite if needed
if [ ! -f "node_modules/.bin/vite" ]; then
    echo "Installing Vite..."
    npm install vite @vitejs/plugin-react-swc --save-dev
fi

# Run the JavaScript script that handles Vite startup
node start-dev.js "$@"

