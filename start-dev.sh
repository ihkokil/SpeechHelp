
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

# Try different methods to run Vite
echo "Attempting to start Vite development server..."

# Method 1: Try using local path
if [ -f "node_modules/.bin/vite" ]; then
    echo "Starting with local Vite..."
    node_modules/.bin/vite "$@"
    if [ $? -eq 0 ]; then exit 0; fi
fi

# Method 2: Try using npx
echo "Attempting to start Vite using npx..."
npx vite "$@"
if [ $? -eq 0 ]; then exit 0; fi

# Method 3: Try using npm run
echo "Attempting to start Vite using npm run..."
npm run dev
if [ $? -eq 0 ]; then exit 0; fi

# Method 4: Use Node.js to run the start-dev.js script as a last resort
echo "All direct methods failed, using JavaScript fallback..."
node start-dev.js "$@"
