
#!/bin/bash
echo "======================================="
echo "Starting SpeechHelp Application"
echo "======================================="

# Make this script executable
chmod +x "$0"

# Run the universal launcher script
node start-app.js "$@"

# If that fails, try these alternatives
if [ $? -ne 0 ]; then
  echo "Trying alternative methods..."
  
  # Try with npx
  echo "Trying with npx..."
  npx vite
  
  # If all else fails
  if [ $? -ne 0 ]; then
    echo "Failed to start the application."
    echo "Try running: npm install vite --save-dev"
    exit 1
  fi
fi
