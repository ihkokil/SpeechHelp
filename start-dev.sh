
#!/bin/bash
# Enhanced script to run Vite development server with better error handling

echo "======================================"
echo "Starting SpeechHelp Development Server"
echo "======================================"

# Try node script first (most reliable)
if [ -f "./start-dev.js" ]; then
    echo "✅ Using Node.js startup script..."
    node start-dev.js
    exit $?
fi

# Check for local node_modules/.bin/vite
if [ -f "./node_modules/.bin/vite" ]; then
    echo "✅ Found local Vite installation, starting server..."
    ./node_modules/.bin/vite
    exit $?
fi

# If not found, install vite
echo "📦 Vite not found. Installing Vite packages..."
npm install vite@latest --save-dev
npm install @vitejs/plugin-react-swc --save-dev

# Check if local vite exists after installation
if [ -f "./node_modules/.bin/vite" ]; then
    echo "✅ Vite installed successfully, starting server..."
    ./node_modules/.bin/vite
    exit $?
fi

# Try with npx
if command -v npx &> /dev/null; then
    echo "🔄 Running with npx vite..."
    npx vite
    exit $?
fi

# Try local runner script if it exists
if [ -f "./run-vite.js" ]; then
    echo "🔄 Using local runner script..."
    node run-vite.js
    exit $?
fi

# Create a local runner script
echo "📝 Creating local vite runner script..."
cat > run-vite.js << 'EOF'
#!/usr/bin/env node
// Simple script to run vite from node_modules
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const vitePath = path.resolve(__dirname, 'node_modules', '.bin', 'vite');
if (fs.existsSync(vitePath)) {
  console.log('Found local vite at:', vitePath);
  spawn(vitePath, process.argv.slice(2), { stdio: 'inherit', shell: true });
} else {
  console.log('Local vite not found, trying with npx...');
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  spawn(npx, ['vite', ...process.argv.slice(2)], { stdio: 'inherit', shell: true });
}
EOF

chmod +x run-vite.js
echo "🔄 Using newly created runner script..."
node run-vite.js
exit $?
