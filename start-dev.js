
#!/usr/bin/env node

// This script helps run the locally installed Vite
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to local vite executable - check both standard locations
const nodeModulesPath = path.join(__dirname, 'node_modules');
const binPath = path.join(nodeModulesPath, '.bin');
const vitePath = path.join(binPath, 'vite');
const viteModulePath = path.join(nodeModulesPath, 'vite');

// Log for debugging
console.log('\x1b[36mStarting development server...\x1b[0m');

// Function to attempt running vite with different approaches
function runVite() {
  // Check if the vite executable exists in .bin directory
  if (fs.existsSync(vitePath)) {
    console.log('\x1b[32mFound local Vite executable at:', vitePath, '\x1b[0m');
    
    // Use the local installation
    const viteProcess = spawn(vitePath, process.argv.slice(2), {
      stdio: 'inherit',
      shell: true
    });

    viteProcess.on('error', handleError);
    viteProcess.on('close', handleClose);
    
    return true;
  } 
  // Check if vite is installed as a module
  else if (fs.existsSync(viteModulePath)) {
    console.log('\x1b[32mFound Vite module at:', viteModulePath, '\x1b[0m');
    
    // Use npx to run the local vite module
    const viteProcess = spawn('npx', ['vite'].concat(process.argv.slice(2)), {
      stdio: 'inherit',
      shell: true
    });

    viteProcess.on('error', handleError);
    viteProcess.on('close', handleClose);
    
    return true;
  }
  
  return false;
}

// Error handler for spawn
function handleError(err) {
  console.error('\x1b[31mFailed to start Vite:', err, '\x1b[0m');
  console.log('\x1b[33mPlease ensure you have the required dependencies installed.\x1b[0m');
  process.exit(1);
}

// Close handler for spawn
function handleClose(code) {
  process.exit(code);
}

// Main execution
if (!runVite()) {
  // If local vite wasn't found, try using npx as fallback
  console.warn('\x1b[33mLocal Vite not found. Attempting to use npx...\x1b[0m');
  
  const viteProcess = spawn('npx', ['vite'].concat(process.argv.slice(2)), {
    stdio: 'inherit',
    shell: true
  });

  viteProcess.on('error', (err) => {
    console.error('\x1b[31mFailed to start Vite using npx:', err);
    console.log('\x1b[33mPlease install Vite by running one of these commands:');
    console.log('npm install vite');
    console.log('OR');
    console.log('npm install');
    console.log('Then try again.\x1b[0m');
    process.exit(1);
  });

  viteProcess.on('close', handleClose);
}
