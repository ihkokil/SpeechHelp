
#!/bin/bash

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

# Make sure the script itself is executable
chmod +x "$0"

# Run the JavaScript script that handles Vite startup
node start-dev.js "$@"
