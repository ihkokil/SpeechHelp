
#!/usr/bin/env node

// This script helps run the locally installed Vite
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting development server...');

// First, ensure dependencies are installed
try {
  if (!fs.existsSync('./node_modules')) {
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }
} catch (error) {
  console.error('Error checking/installing dependencies:', error);
}

// Possible paths for the vite executable based on OS
const possiblePaths = [
  path.join(__dirname, 'node_modules', '.bin', 'vite'),
  path.join(__dirname, 'node_modules', '.bin', 'vite.cmd'), // Windows
  path.join(__dirname, 'node_modules', '.bin', 'vite.ps1'), // Windows PowerShell
  path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js')
];

// Find the first path that exists
let vitePath = null;
for (const potentialPath of possiblePaths) {
  if (fs.existsSync(potentialPath)) {
    vitePath = potentialPath;
    console.log(`Found Vite at: ${vitePath}`);
    break;
  }
}

// If vite isn't found in expected locations, try to install it
if (!vitePath) {
  console.log('Vite executable not found in expected locations, attempting to install/repair...');
  try {
    console.log('Installing vite locally...');
    execSync('npm install --save-dev vite@latest', { stdio: 'inherit' });
    
    // Check again after installation
    for (const potentialPath of possiblePaths) {
      if (fs.existsSync(potentialPath)) {
        vitePath = potentialPath;
        console.log(`Found Vite at: ${vitePath} after installation`);
        break;
      }
    }
  } catch (error) {
    console.error('Failed to install vite:', error);
  }
}

// If we still don't have a vitePath, try using npx as a fallback
if (!vitePath) {
  console.log('Still cannot find Vite executable. Trying to run with npx...');
  const viteProcess = spawn('npx', ['vite', ...process.argv.slice(2)], {
    stdio: 'inherit',
    shell: true
  });

  viteProcess.on('error', (err) => {
    console.error('Failed to start Vite with npx:', err);
    process.exit(1);
  });

  viteProcess.on('close', (code) => {
    process.exit(code);
  });
} else {
  // If we have a vitePath, try to run it directly
  console.log(`Starting Vite from ${vitePath}...`);
  const viteProcess = spawn(vitePath, process.argv.slice(2), { 
    stdio: 'inherit',
    shell: true
  });

  viteProcess.on('error', (err) => {
    console.error('Failed to start Vite:', err);
    
    // If direct execution fails, try with node
    console.log('Trying to run Vite with node...');
    const nodeViteProcess = spawn('node', [vitePath, ...process.argv.slice(2)], {
      stdio: 'inherit',
      shell: true
    });
    
    nodeViteProcess.on('error', (nodeErr) => {
      console.error('Failed to start Vite with node:', nodeErr);
      process.exit(1);
    });
    
    nodeViteProcess.on('close', (code) => {
      process.exit(code);
    });
  });

  viteProcess.on('close', (code) => {
    if (code !== 0) {
      console.log(`Vite process exited with code ${code}`);
    }
    process.exit(code);
  });
}
