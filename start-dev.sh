
#!/bin/bash
# Enhanced script to run Vite development server with better error handling

echo "======================================"
echo "Starting SpeechHelp Development Server"
echo "======================================"

# Function to check if a command exists
command_exists() {
  command -v "$1" &> /dev/null
}

# Try node_modules local binary first
if [ -f "./node_modules/.bin/vite" ]; then
    echo "✅ Using local Vite installation..."
    ./node_modules/.bin/vite
    exit $?
fi

# Try run-vite.js if it exists
if [ -f "./run-vite.js" ]; then
    echo "✅ Using run-vite.js script..."
    node run-vite.js
    exit $?
fi

# Try with NPX
if command_exists npx; then
    echo "✅ Using npx to run Vite..."
    npx vite
    exit $?
fi

# If nothing worked, try installing vite
echo "⚠️ Vite not found. Trying to install it..."
if command_exists npm; then
    npm install vite@latest --save-dev @vitejs/plugin-react-swc --save-dev
    
    # Try again with local installation
    if [ -f "./node_modules/.bin/vite" ]; then
        echo "✅ Installation successful, running Vite..."
        ./node_modules/.bin/vite
        exit $?
    fi
fi

# As a last resort, suggest the install-vite.js script
echo "❌ Could not start Vite."
echo "Please run: node install-vite.js"
echo "Then try starting the development server again."
exit 1
