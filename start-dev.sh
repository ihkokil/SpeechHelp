
#!/bin/bash
# This script runs the Vite development server with proper error handling

echo "======================================"
echo "Vite Development Server Launcher"
echo "======================================"

# Try node script first (most reliable method)
if command -v node &> /dev/null; then
    echo "✅ Using Node.js to start Vite..."
    node start-dev.js
    exit $?
fi

# If node isn't available, try npm directly
if command -v npm &> /dev/null; then
    echo "✅ Running npm install and then npm run dev..."
    npm install --save-dev vite@latest --no-audit
    npm run dev
    exit $?
fi

# Last resort
echo "❌ Could not start development server."
echo "Please ensure Node.js is installed on your system and try again."
echo "Or manually run: npm install --save-dev vite && npx vite"
exit 1
