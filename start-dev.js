
#!/usr/bin/env node

// This script helps run the locally installed Vite
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// First, let's check if vite is installed and install it if needed
try {
  // Check if node_modules exists, if not run npm install
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }
  
  // Multiple possible paths to vite executable
  const vitePaths = [
    path.join(__dirname, 'node_modules', '.bin', 'vite'),               // Standard path
    path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js'),     // Alternative path
  ];
  
  // Find the first valid path
  let vitePath = null;
  for (const potentialPath of vitePaths) {
    if (fs.existsSync(potentialPath)) {
      vitePath = potentialPath;
      break;
    }
  }
  
  if (!vitePath) {
    // If vite wasn't found, try to find it using npx
    console.log('Vite executable not found in expected locations. Trying with npx...');
    
    // Try to run vite using npx
    const viteProcess = spawn('npx', ['vite'].concat(process.argv.slice(2)), { 
      stdio: 'inherit',
      shell: true
    });
    
    viteProcess.on('error', (err) => {
      console.error('Failed to start Vite with npx:', err);
      
      // As a last resort, try running via npm script
      console.log('Trying via npm run...');
      const npmProcess = spawn('npm', ['run', 'vite'], { 
        stdio: 'inherit',
        shell: true
      });
      
      npmProcess.on('error', (npmErr) => {
        console.error('All attempts to run Vite failed:', npmErr);
        process.exit(1);
      });
    });
  } else {
    console.log(`Found Vite at: ${vitePath}`);
    
    // Spawn the vite process using the found path
    const viteProcess = spawn(vitePath, process.argv.slice(2), { 
      stdio: 'inherit',
      shell: true
    });
    
    viteProcess.on('error', (err) => {
      console.error('Failed to start Vite:', err);
      process.exit(1);
    });
    
    viteProcess.on('close', (code) => {
      process.exit(code);
    });
  }
} catch (error) {
  console.error('Error running Vite:', error);
  process.exit(1);
}
