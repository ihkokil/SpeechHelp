
#!/bin/bash
# This script runs the Node.js script to start the development server

# Make the script executable
chmod +x start-dev.js

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo -e "\033[31mError: npm is not installed or not in PATH\033[0m"
  echo -e "Please install npm and try again"
  exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo -e "\033[33mnode_modules not found. Installing dependencies...\033[0m"
  npm install
fi

# Run with direct path to node if possible, otherwise use the 'node' command
if [ -f /usr/bin/node ]; then
  /usr/bin/node start-dev.js
else
  node start-dev.js
fi
