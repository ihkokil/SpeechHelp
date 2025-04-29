
#!/bin/bash
# This script runs the Node.js script to start the development server

# Make the Node.js script executable
chmod +x start-dev.js

# Run with direct path to node if possible, otherwise use the 'node' command
if [ -f /usr/bin/node ]; then
  /usr/bin/node start-dev.js
else
  node start-dev.js
fi
