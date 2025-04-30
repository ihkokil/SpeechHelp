
#!/bin/bash
# Enhanced script to run Vite development server with better error handling

echo "======================================"
echo "Starting SpeechHelp Development Server"
echo "======================================"

# Check for local node_modules/.bin/vite first (most reliable)
if [ -f "./node_modules/.bin/vite" ]; then
    echo "✅ Found local Vite installation, starting server..."
    ./node_modules/.bin/vite
    exit $?
fi

# Try to run vite directly if it exists globally
if command -v vite &> /dev/null; then
    echo "✅ Found vite in PATH, starting server..."
    vite
    exit $?
fi

# Try with npx
if command -v npx &> /dev/null; then
    echo "🔄 Running with npx vite..."
    npx vite
    exit $?
fi

# Try to install locally if not found
echo "📦 Installing Vite locally..."
npm install vite@latest --save-dev
npm install @vitejs/plugin-react-swc --save-dev

# Check if local vite exists after installation
if [ -f "./node_modules/.bin/vite" ]; then
    echo "✅ Found local Vite installation, starting server..."
    ./node_modules/.bin/vite
    exit $?
fi

# Try local runner script if it exists
if [ -f "./run-vite.js" ]; then
    echo "🔄 Using local runner script..."
    node run-vite.js
    exit $?
fi

# Global installation as last resort
echo "🔄 Attempting global installation..."
npm install -g vite

if command -v vite &> /dev/null; then
    echo "✅ Global Vite installation successful, starting server..."
    vite
    exit $?
fi

# If all else fails
echo "❌ Could not start development server."
echo "Please try these commands manually:"
echo "1. npm install -g vite"
echo "2. npm install vite --save-dev"
echo "3. npx vite"
exit 1
