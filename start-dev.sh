
#!/bin/bash
# This script runs the Node.js script to start the development server

# Try running vite directly first
if command -v vite &> /dev/null; then
    echo "Running vite directly..."
    vite
    exit $?
fi

# If vite is not in PATH, try using node to execute the start-dev.js script
echo "Vite not found in PATH, trying node script..."
if command -v node &> /dev/null; then
    node start-dev.js
    exit $?
fi

# If node is not available, try using npx
echo "Node not found, trying npx vite..."
if command -v npx &> /dev/null; then
    npx vite
    exit $?
fi

# Last resort, try npm run dev
echo "Trying npm run dev..."
npm run dev
