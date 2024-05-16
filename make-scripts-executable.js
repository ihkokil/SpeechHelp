
#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to install vite if it's not available
function installViteIfNeeded() {
  try {
    // Check if vite is installed locally
    if (!fs.existsSync(path.join(__dirname, 'node_modules', '.bin', 'vite'))) {
      console.log('Installing vite locally...');
      execSync('npm install vite@latest', { stdio: 'inherit' });
      console.log('Vite installed successfully.');
    }
  } catch (error) {
    console.error('Failed to install vite:', error.message);
  }
}

// Make the script executable on Unix-like systems
function makeExecutable() {
  try {
    if (process.platform !== 'win32') {
      console.log('Making scripts executable...');
      execSync('chmod +x start-dev.sh', { stdio: 'inherit' });
      console.log('Scripts are now executable.');
    }
  } catch (error) {
    console.error('Failed to make scripts executable:', error.message);
    console.log('You may need to run: chmod +x start-dev.sh');
  }
}

// Main function
function main() {
  console.log('Setting up development environment...');
  installViteIfNeeded();
  makeExecutable();
  console.log('Setup complete. You can now run:');
  if (process.platform === 'win32') {
    console.log('  node start-dev.js');
  } else {
    console.log('  ./start-dev.sh');
  }
}

main();
