
#!/usr/bin/env node

/**
 * Simple Vite Development Server Runner
 * A streamlined script that ensures Vite starts correctly
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("=== Starting SpeechHelp Development Server ===");

// Find the appropriate Vite executable
const isWin = process.platform === 'win32';
const localVitePath = path.resolve(process.cwd(), 'node_modules', '.bin', isWin ? 'vite.cmd' : 'vite');
const directVitePath = path.resolve(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');

async function ensureViteInstalled() {
  if (!fs.existsSync(localVitePath) && !fs.existsSync(directVitePath)) {
    console.log("⚠️ Vite not found, installing now...");
    
    const npmCmd = isWin ? 'npm.cmd' : 'npm';
    return new Promise((resolve) => {
      const installProcess = spawn(npmCmd, ['install', '--save-dev', 'vite', '@vitejs/plugin-react-swc'], { 
        stdio: 'inherit',
        shell: true 
      });
      
      installProcess.on('close', (code) => {
        if (code === 0) {
          console.log("✅ Vite installed successfully");
        } else {
          console.log("⚠️ Vite installation may have issues");
        }
        resolve();
      });
    });
  }
}

async function runVite() {
  await ensureViteInstalled();
  
  // Choose the best method to run Vite
  let command, args;
  
  if (fs.existsSync(localVitePath)) {
    console.log(`🚀 Running Vite from local bin: ${localVitePath}`);
    command = localVitePath;
    args = [];
  } else if (fs.existsSync(directVitePath)) {
    console.log(`🚀 Running Vite directly from: ${directVitePath}`);
    command = process.execPath; // node executable
    args = [directVitePath];
  } else {
    console.log('🚀 Running Vite with npx');
    command = isWin ? 'npx.cmd' : 'npx';
    args = ['vite'];
  }
  
  const viteProcess = spawn(command, [...args, ...process.argv.slice(2)], { 
    stdio: 'inherit',
    shell: true,
    env: { 
      ...process.env, 
      PATH: `${process.cwd()}/node_modules/.bin:${process.env.PATH}` 
    }
  });
  
  viteProcess.on('error', (err) => {
    console.error(`❌ Error starting Vite: ${err.message}`);
    process.exit(1);
  });
  
  viteProcess.on('close', (code) => {
    if (code !== 0) {
      console.log(`⚠️ Vite exited with code ${code}`);
    }
  });
}

runVite().catch(err => {
  console.error(`❌ Fatal error: ${err.message}`);
  process.exit(1);
});
