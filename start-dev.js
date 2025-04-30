
#!/usr/bin/env node

// This script helps run the locally installed Vite
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting development server...');

// Helper function to run a command and return success status
const runCommand = (command, args = [], options = {}) => {
  console.log(`Trying to run: ${command} ${args.join(' ')}`);
  
  return new Promise((resolve) => {
    const childProcess = spawn(command, args, { 
      stdio: 'inherit', 
      shell: true,
      ...options
    });
    
    childProcess.on('error', () => {
      resolve(false);
    });
    
    childProcess.on('close', (code) => {
      resolve(code === 0);
    });
  });
};

// Check if node_modules exists, if not install dependencies
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('Node modules not found. Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('Dependencies installed successfully.');
  } catch (error) {
    console.error('Failed to install dependencies:', error);
    process.exit(1);
  }
}

// Possible paths for the vite executable based on OS
const possiblePaths = [
  path.join(__dirname, 'node_modules', '.bin', 'vite'),
  path.join(__dirname, 'node_modules', '.bin', 'vite.cmd'), // Windows
  path.join(__dirname, 'node_modules', '.bin', 'vite.ps1'), // Windows PowerShell
  path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js')
];

// Try to start the development server using various methods
async function startDevServer() {
  // 1. Try to find and run Vite executable directly
  let vitePath = null;
  for (const potentialPath of possiblePaths) {
    if (fs.existsSync(potentialPath)) {
      vitePath = potentialPath;
      console.log(`Found Vite at: ${vitePath}`);
      break;
    }
  }

  if (vitePath) {
    console.log(`Starting Vite from ${vitePath}...`);
    const success = await runCommand(vitePath, process.argv.slice(2));
    if (success) return;
    
    console.log('Direct execution failed, trying with node...');
    const nodeSuccess = await runCommand('node', [vitePath, ...process.argv.slice(2)]);
    if (nodeSuccess) return;
  }
  
  // 2. Try using npx
  console.log('Trying to run vite with npx...');
  const npxSuccess = await runCommand('npx', ['vite', ...process.argv.slice(2)]);
  if (npxSuccess) return;
  
  // 3. Try using npm run dev
  console.log('Trying npm run dev...');
  const npmRunSuccess = await runCommand('npm', ['run', 'dev']);
  if (npmRunSuccess) return;
  
  // 4. Try installing vite globally and then running it
  console.log('All methods failed. Attempting to install Vite locally...');
  try {
    execSync('npm install --save-dev vite@latest', { stdio: 'inherit' });
    console.log('Vite installed, trying again with npx...');
    const finalAttempt = await runCommand('npx', ['vite', ...process.argv.slice(2)]);
    if (finalAttempt) return;
  } catch (error) {
    console.error('Failed to install vite:', error);
  }
  
  console.error('All attempts to start the development server failed.');
  process.exit(1);
}

startDevServer();
