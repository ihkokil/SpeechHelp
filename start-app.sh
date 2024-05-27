
#!/bin/bash
echo "======================================="
echo "Starting SpeechHelp Application"
echo "======================================="

# Make this script executable if it isn't already
if [ ! -x "$0" ]; then
  chmod +x "$0"
fi

# Try with node script first (most reliable)
node start-app.js
if [ $? -eq 0 ]; then
  exit 0
fi

# Try with direct run-vite.js
echo "Trying alternative method..."
node run-vite.js
if [ $? -eq 0 ]; then
  exit 0
fi

# Last resort - direct npx call
echo "Trying with npx directly..."
npx vite
