
#!/usr/bin/env node

/**
 * Universal SpeechHelp App Launcher
 * Works across all platforms and environments
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper to log with colors
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m"
};

console.log(`${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.cyan}   Starting SpeechHelp Application      ${colors.reset}`);
console.log(`${colors.cyan}========================================${colors.reset}`);

// Check if Vite is installed locally
const isWin = process.platform === 'win32';
const localVitePath = path.join(process.cwd(), 'node_modules', '.bin', isWin ? 'vite.cmd' : 'vite');

async function startApp() {
  // Step 1: Try using local Vite installation
  if (fs.existsSync(localVitePath)) {
    console.log(`${colors.green}✓ Found local Vite installation${colors.reset}`);
    
    try {
      const viteProcess = spawn(localVitePath, [], { 
        stdio: 'inherit',
        shell: true 
      });
      
      return new Promise((resolve) => {
        viteProcess.on('close', (code) => {
          if (code !== 0) {
            console.log(`\n${colors.yellow}⚠️ Vite exited with code ${code}${colors.reset}`);
          }
          resolve(true);
        });
        
        viteProcess.on('error', (err) => {
          console.log(`\n${colors.red}✗ Error running local Vite: ${err.message}${colors.reset}`);
          resolve(false);
        });
      });
    } catch (error) {
      console.log(`${colors.red}✗ Failed to start local Vite: ${error.message}${colors.reset}`);
      return false;
    }
  }
  
  // Step 2: Try with npx
  console.log(`${colors.yellow}⚠️ Local Vite not found. Trying with npx...${colors.reset}`);
  
  try {
    const npxCommand = isWin ? 'npx.cmd' : 'npx';
    const npxProcess = spawn(npxCommand, ['vite'], { 
      stdio: 'inherit',
      shell: true 
    });
    
    return new Promise((resolve) => {
      npxProcess.on('close', (code) => {
        if (code !== 0) {
          console.log(`\n${colors.yellow}⚠️ npx Vite exited with code ${code}${colors.reset}`);
        }
        resolve(true);
      });
      
      npxProcess.on('error', (err) => {
        console.log(`\n${colors.red}✗ Error running npx Vite: ${err.message}${colors.reset}`);
        resolve(false);
      });
    });
  } catch (error) {
    console.log(`${colors.red}✗ Failed to start with npx: ${error.message}${colors.reset}`);
    return false;
  }
}

// Step 3: If all fails, try to install Vite
async function installAndStartVite() {
  console.log(`\n${colors.magenta}Installing Vite and required dependencies...${colors.reset}`);
  
  try {
    // Clean installation to avoid partial installs
    execSync('npm install vite@latest @vitejs/plugin-react-swc@latest --save-dev --no-fund --no-audit', {
      stdio: 'inherit'
    });
    
    console.log(`\n${colors.green}✓ Installation successful, starting Vite...${colors.reset}`);
    return await startApp();
  } catch (error) {
    console.log(`\n${colors.red}✗ Failed to install Vite: ${error.message}${colors.reset}`);
    return false;
  }
}

// Main execution flow
async function main() {
  let success = await startApp();
  
  // If direct start failed, try installation
  if (!success) {
    success = await installAndStartVite();
  }
  
  // Final message based on outcome
  if (!success) {
    console.log(`\n${colors.red}========================================${colors.reset}`);
    console.log(`${colors.red}Failed to start SpeechHelp Application${colors.reset}`);
    console.log(`${colors.red}========================================${colors.reset}`);
    console.log(`\nPlease try the following steps manually:`);
    console.log(`1. Run 'npm install vite@latest --save-dev'`);
    console.log(`2. Run 'npx vite'`);
    process.exit(1);
  }
}

// Run the main function
main().catch(err => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, err);
  process.exit(1);
});
