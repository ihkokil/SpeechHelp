
#!/bin/bash
# This script runs the Node.js script to start the development server

# Make sure the script is executable
chmod +x start-dev.js

# Try multiple methods to run Vite
echo "Starting development server..."

# Method 1: Using node to run our start-dev.js
node start-dev.js "$@" || \
# Method 2: Try direct npx
npx vite "$@" || \
# Method 3: Try npm script
npm run dev "$@" || \
# Method 4: As a last resort, try installing vite globally
echo "Failed to run Vite. Attempting to install it globally..." && \
npm install -g vite && \
vite "$@"
