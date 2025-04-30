
#!/bin/bash
# Enhanced script to run Vite development server with better error handling

echo "======================================"
echo "Starting SpeechHelp Development Server"
echo "======================================"

# Try to run vite directly if it exists
if command -v vite &> /dev/null; then
    echo "✅ Found vite in PATH, starting server..."
    vite
    exit $?
fi

# First try: Direct NPM install of vite
echo "Installing Vite locally..."
npm install vite@latest --no-save

# Check if local vite exists
if [ -f "./node_modules/.bin/vite" ]; then
    echo "✅ Found local Vite installation, starting server..."
    ./node_modules/.bin/vite
    exit $?
fi

# Try with npx
if command -v npx &> /dev/null; then
    echo "🔄 Running with npx vite..."
    npx vite
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
echo "2. npx vite"
exit 1
