
#!/usr/bin/env node

/**
 * Direct Vite Runner Script
 * Reliable way to run Vite regardless of installation method
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Find the Vite executable
const isWin = process.platform === 'win32';
const localVitePath = path.resolve(process.cwd(), 'node_modules', '.bin', isWin ? 'vite.cmd' : 'vite');

console.log(`Starting SpeechHelp development server...`);

// Run Vite directly if it exists, or using npx as fallback
async function runVite() {
  return new Promise((resolve, reject) => {
    let viteProcess;
    
    // Check for local installation first
    if (fs.existsSync(localVitePath)) {
      console.log(`✅ Using local Vite installation: ${localVitePath}`);
      viteProcess = spawn(localVitePath, process.argv.slice(2), {
        stdio: 'inherit',
        shell: true,
        env: { ...process.env, PATH: `${process.cwd()}/node_modules/.bin:${process.env.PATH}` } // Add node_modules/.bin to PATH
      });
    } else {
      // Fall back to npx
      console.log(`⚠️ Local Vite not found, trying with npx...`);
      const npxCommand = isWin ? 'npx.cmd' : 'npx';
      viteProcess = spawn(npxCommand, ['vite', ...process.argv.slice(2)], {
        stdio: 'inherit', 
        shell: true
      });
    }
    
    viteProcess.on('error', (err) => {
      console.error(`❌ Failed to start Vite: ${err.message}`);
      reject(err);
    });
    
    viteProcess.on('close', (code) => {
      if (code !== 0) {
        console.warn(`⚠️ Vite exited with code ${code}`);
      }
      resolve();
    });
  });
}

// Also try to install Vite if it's not found
function ensureViteInstalled() {
  if (fs.existsSync(localVitePath)) {
    return Promise.resolve(true);
  }
  
  console.log(`⚠️ Vite not found, attempting to install...`);
  return new Promise((resolve) => {
    const npmCommand = isWin ? 'npm.cmd' : 'npm';
    const installProcess = spawn(npmCommand, ['install', 'vite', '@vitejs/plugin-react-swc', '--save-dev'], { 
      stdio: 'inherit',
      shell: true
    });
    
    installProcess.on('close', (code) => {
      resolve(code === 0);
    });
    
    installProcess.on('error', () => {
      resolve(false);
    });
  });
}

// Run Vite with proper error handling
async function main() {
  try {
    // Try to ensure Vite is installed
    await ensureViteInstalled();
    // Run Vite
    await runVite();
  } catch (err) {
    console.error(`Fatal error running Vite: ${err.message}`);
    process.exit(1);
  }
}

main();
