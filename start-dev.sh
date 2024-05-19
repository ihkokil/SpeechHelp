
#!/bin/bash
# This script runs the Node.js script to start the development server

echo "======================================"
echo "Vite Development Server Launcher"
echo "======================================"

# First, check if node_modules/.bin/vite exists and use it directly
if [ -f "node_modules/.bin/vite" ]; then
    echo "✅ Using locally installed Vite..."
    node_modules/.bin/vite
    exit $?
fi

# Try running vite directly if it exists in PATH
if command -v vite &> /dev/null; then
    echo "✅ Running vite directly..."
    vite
    exit $?
fi

# Try to install vite locally if it doesn't exist
if [ ! -f "node_modules/.bin/vite" ]; then
    echo "⚠️ Vite not found. Installing vite locally..."
    npm install vite@latest --save-dev
    if [ -f "node_modules/.bin/vite" ]; then
        echo "✅ Vite installed. Starting server..."
        node_modules/.bin/vite
        exit $?
    fi
fi

# If vite is not in PATH, try using node to execute the start-dev.js script
echo "⚠️ Vite not found in PATH, trying node script..."
if command -v node &> /dev/null; then
    node start-dev.js
    exit $?
fi

# If node is not available, try using npx
echo "⚠️ Node not found, trying npx vite..."
if command -v npx &> /dev/null; then
    npx vite
    exit $?
fi

# Last resort, try npm run dev
echo "⚠️ Trying npm run dev..."
npm run dev

# If all else fails
echo "❌ Could not start development server."
echo "Please try manually running: npm install --save-dev vite && npx vite"
exit 1
