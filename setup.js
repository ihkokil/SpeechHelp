
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('Setting up the development environment...');

function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Clear npm cache to avoid any corruption issues
console.log('Clearing npm cache...');
runCommand('npm cache clean --force');

// Ensure node_modules exists
console.log('Installing dependencies...');
if (!fs.existsSync('node_modules')) {
  runCommand('npm install');
} else {
  console.log('Reinstalling dependencies to ensure consistency...');
  runCommand('npm ci');
}

// Make sure Vite is installed both locally and globally
console.log('Ensuring Vite is installed...');
runCommand('npm install vite@latest @vitejs/plugin-react-swc@latest --save-dev');

// Try to install Vite globally as a fallback
console.log('Installing Vite globally as a fallback...');
runCommand('npm install -g vite');

// Make scripts executable on Unix systems
if (os.platform() !== 'win32') {
  console.log('Making scripts executable...');
  try {
    fs.chmodSync('start-dev.sh', 0o755);
    console.log('Made start-dev.sh executable');
    
    // Also make the make-scripts-executable.js file executable
    fs.chmodSync('make-scripts-executable.js', 0o755);
    console.log('Made make-scripts-executable.js executable');
    
    // Run the make-scripts-executable.js script to ensure all scripts are executable
    runCommand('node make-scripts-executable.js');
  } catch (error) {
    console.error('Failed to make scripts executable:', error.message);
  }
}

// Create a vite.config.js file if it doesn't exist
if (!fs.existsSync('vite.config.js') && !fs.existsSync('vite.config.ts')) {
  console.log('Creating a basic vite.config.js file...');
  const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
});
`;
  fs.writeFileSync('vite.config.js', viteConfig);
}

console.log('\nSetup complete!');
console.log('\nTo start the development server:');
console.log('- On Windows: Run start-dev.bat');
console.log('- On macOS/Linux: Run ./start-dev.sh');
console.log('\nAlternatively, you can run: node start-dev.js');
