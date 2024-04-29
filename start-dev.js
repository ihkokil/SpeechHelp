#!/usr/bin/env node

// This script helps run the locally installed Vite with fallbacks
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("Finding Vite installation...");

// Possible paths to the vite executable
const possibleVitePaths = [
  path.join(__dirname, 'node_modules', '.bin', 'vite'),
  path.join(__dirname, 'node_modules', '.bin', 'vite.cmd'), // Windows
  path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js'),
  path.join(__dirname, 'node_modules', '.bin', 'vite.ps1') // PowerShell on Windows
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

if (!vitePath) {
  console.log("No local Vite installation found in expected locations.");
}

// Function to run vite with npx as a fallback
function runVite() {
  // Try different approaches to run Vite
  let command, args;

  if (vitePath) {
    // If we found a local installation path, use it
    if (process.platform === 'win32' && vitePath.endsWith('.cmd')) {
      command = vitePath;
      args = process.argv.slice(2);
    } else {
      command = 'node';
      args = [vitePath, ...process.argv.slice(2)];
    }
  } else {
    // Otherwise try npx which will use global or download temporary
    command = 'npx';
    args = ['vite', ...process.argv.slice(2)];
    console.log("Falling back to npx vite");
  }

  console.log(`Starting Vite with command: ${command} ${args.join(' ')}`);

  const viteProcess = spawn(command, args, {
    stdio: 'inherit',
    shell: true
  });

  viteProcess.on('error', (err) => {
    console.error('Failed to start Vite:', err);
    
    if (!vitePath) {
      console.log('Attempting to install Vite...');
      const installProcess = spawn('npm', ['install', 'vite', '--save-dev'], { 
        stdio: 'inherit', 
        shell: true 
      });
      
      installProcess.on('close', (code) => {
        if (code === 0) {
          console.log('Vite installed successfully. Restarting...');
          runVite(); // Try running vite again after installation
        } else {
          console.error('Failed to install Vite. Please install it manually with "npm install vite --save-dev"');
          process.exit(1);
        }
      });
    } else {
      console.error('Error occurred with existing Vite installation. Trying to repair...');
      const repairProcess = spawn('npm', ['install', 'vite', '--save-dev', '--force'], { 
        stdio: 'inherit', 
        shell: true 
      });
      
      repairProcess.on('close', (code) => {
        if (code === 0) {
          console.log('Vite reinstallation complete. Restarting...');
          runVite();
        } else {
          console.error('Failed to repair Vite installation.');
          process.exit(1);
        }
      });
    }
  });

  viteProcess.on('close', (code) => {
    if (code !== 0) {
      console.log(`Vite process exited with code ${code}`);
    }
    process.exit(code);
  });
}

// Start vite
runVite();
