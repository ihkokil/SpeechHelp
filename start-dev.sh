
#!/bin/bash
# Enhanced script to run Vite development server with better error handling

echo "======================================"
echo "Starting SpeechHelp Development Server"
echo "======================================"

# First try: Direct NPM install of vite
echo "Installing Vite locally..."
npm install --save-dev vite@latest --no-audit --no-fund

# Second try: Check if vite exists in node_modules
if [ -f "./node_modules/.bin/vite" ]; then
    echo "✅ Found local Vite installation, starting server..."
    ./node_modules/.bin/vite
    exit $?
fi

# Third try: Try with npx
if command -v npx &> /dev/null; then
    echo "🔄 Running with npx vite..."
    npx vite
    exit $?
fi

# Fourth try: Try npm run dev
if command -v npm &> /dev/null; then
    echo "🔄 Running npm run dev..."
    npm run dev
    exit $?
fi

# If all else fails
echo "❌ Could not start development server."
echo "Please try these commands manually:"
echo "1. npm install --save-dev vite"
echo "2. npx vite"
exit 1
