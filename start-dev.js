
#!/usr/bin/env node

// This script helps run the locally installed Vite with fallbacks
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Possible paths to the vite executable
const possibleVitePaths = [
  path.join(__dirname, 'node_modules', '.bin', 'vite'),
  path.join(__dirname, 'node_modules', '.bin', 'vite.cmd'), // Windows
  path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js')
];

// Find the first existing vite path
let vitePath = null;
for (const potentialPath of possibleVitePaths) {
  if (fs.existsSync(potentialPath)) {
    vitePath = potentialPath;
    console.log(`Found Vite at: ${vitePath}`);
    break;
  }
}

// Function to run vite with npx as a fallback
function runVite() {
  const command = vitePath ? 'node' : 'npx';
  const args = vitePath ? [vitePath, ...process.argv.slice(2)] : ['vite', ...process.argv.slice(2)];

  console.log(`Starting Vite with command: ${command} ${args.join(' ')}`);

  const viteProcess = spawn(command, args, {
    stdio: 'inherit',
    shell: true
  });

  viteProcess.on('error', (err) => {
    console.error('Failed to start Vite:', err);
    
    if (!vitePath) {
      console.log('Attempting to install Vite...');
      const installProcess = spawn('npm', ['install', 'vite'], { stdio: 'inherit', shell: true });
      
      installProcess.on('close', (code) => {
        if (code === 0) {
          console.log('Vite installed successfully. Restarting...');
          runVite(); // Try running vite again after installation
        } else {
          console.error('Failed to install Vite. Please install it manually with "npm install vite"');
          process.exit(1);
        }
      });
    } else {
      process.exit(1);
    }
  });

  viteProcess.on('close', (code) => {
    process.exit(code);
  });
}

// Start vite
runVite();
