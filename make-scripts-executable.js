
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');

// Function to make scripts executable
const makeExecutable = () => {
  try {
    if (os.platform() !== 'win32') {
      // On Unix-like systems
      console.log('Making scripts executable...');
      execSync('chmod +x start-dev.sh', { stdio: 'inherit' });
      execSync('chmod +x start-dev.js', { stdio: 'inherit' });
      execSync('chmod +x dev.js', { stdio: 'inherit' });
    }
    console.log('Scripts are now executable.');
  } catch (error) {
    console.error('Error making scripts executable:', error);
  }
};

// Make scripts executable
makeExecutable();

// Try to install Vite if it's not already installed
try {
  console.log('Checking for Vite...');
  if (!fs.existsSync('./node_modules/vite')) {
    console.log('Installing Vite...');
    execSync('npm install --save-dev vite@latest', { stdio: 'inherit' });
  }
} catch (error) {
  console.error('Error checking/installing Vite:', error);
}
