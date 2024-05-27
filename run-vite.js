
#!/usr/bin/env node

/**
 * Direct Vite Runner Script
 * Finds and executes Vite reliably
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Find the Vite executable
const isWin = process.platform === 'win32';
const localVitePath = path.resolve(process.cwd(), 'node_modules', '.bin', isWin ? 'vite.cmd' : 'vite');

console.log(`Starting SpeechHelp development server...`);

// Run Vite directly if it exists, or using npx as fallback
function runVite() {
  return new Promise((resolve, reject) => {
    let viteProcess;
    
    // Check for local installation first
    if (fs.existsSync(localVitePath)) {
      console.log(`✅ Using local Vite installation: ${localVitePath}`);
      viteProcess = spawn(localVitePath, process.argv.slice(2), {
        stdio: 'inherit',
        shell: true
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

// Run Vite with proper error handling
runVite().catch(err => {
  console.error(`Fatal error running Vite: ${err.message}`);
  console.log(`Try running 'node install-vite.js' to fix installation issues.`);
  process.exit(1);
});
