
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Setting up the development environment...');

// Ensure node_modules exists
try {
  if (!fs.existsSync('node_modules')) {
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }
} catch (error) {
  console.error('Failed to install dependencies:', error);
}

// Make sure Vite is installed
try {
  console.log('Ensuring Vite is installed...');
  execSync('npm install vite @vitejs/plugin-react-swc --save-dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to install Vite:', error);
}

// Make scripts executable
try {
  if (process.platform !== 'win32') {
    console.log('Making scripts executable...');
    execSync('chmod +x start-dev.sh', { stdio: 'inherit' });
  }
} catch (error) {
  console.error('Failed to make scripts executable:', error);
}

console.log('\nSetup complete!');
console.log('\nTo start the development server:');
console.log('- On Windows: Run start-dev.bat');
console.log('- On macOS/Linux: Run ./start-dev.sh');
console.log('\nAlternatively, you can run: node start-dev.js');
