
#!/bin/bash

# Make sure the script itself is executable
chmod +x "$0"

# Execute the setup script first to ensure all dependencies are installed
echo "Running setup script to ensure dependencies are installed..."
node setup.js

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js to run this script."
    exit 1
fi

echo "Starting development server..."

# Method 1: Try using the direct vite copy we created
if [ -f "./vite-direct" ]; then
    echo "Starting with direct Vite executable..."
    ./vite-direct "$@"
    if [ $? -eq 0 ]; then exit 0; fi
fi

# Method 2: Try using local path
if [ -f "node_modules/.bin/vite" ]; then
    echo "Starting with local Vite..."
    node_modules/.bin/vite "$@"
    if [ $? -eq 0 ]; then exit 0; fi
fi

# Method 3: Try using npx
echo "Attempting to start Vite using npx..."
npx vite "$@"
if [ $? -eq 0 ]; then exit 0; fi

# Method 4: Try using npm run
echo "Attempting to start Vite using npm run..."
npm run dev
if [ $? -eq 0 ]; then exit 0; fi

# Method 5: Try using global vite
echo "Attempting to start Vite using global installation..."
vite "$@"
if [ $? -eq 0 ]; then exit 0; fi

# Method 6: Use Node.js to run the start-dev.js script as a last resort
echo "All direct methods failed, using JavaScript fallback..."
node start-dev.js "$@"
