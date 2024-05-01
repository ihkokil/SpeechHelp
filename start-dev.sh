
#!/bin/bash

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js to run this script."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run the JavaScript script that handles Vite startup
node start-dev.js "$@"
