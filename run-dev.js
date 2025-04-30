
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

async function ensureViteInstalled() {
  if (!fs.existsSync(localVitePath)) {
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
  
  const vitePath = fs.existsSync(localVitePath) ? localVitePath : (isWin ? 'npx.cmd' : 'npx');
  const viteArgs = fs.existsSync(localVitePath) ? [] : ['vite'];
  
  console.log(`🚀 Running Vite from: ${fs.existsSync(localVitePath) ? localVitePath : 'npx vite'}`);
  
  const viteProcess = spawn(vitePath, [...viteArgs], { 
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PATH: `${process.cwd()}/node_modules/.bin:${process.env.PATH}` }
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
