
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
  cyan: "\x1b[36m"
};

console.log(`${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.cyan}   Starting SpeechHelp Application      ${colors.reset}`);
console.log(`${colors.cyan}========================================${colors.reset}`);

// Function to run command with proper error handling
async function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`${colors.blue}▶ Running: ${command} ${args.join(' ')}${colors.reset}`);
    
    const process = spawn(command, args, { 
      stdio: 'inherit',
      shell: true,
      ...options
    });
    
    process.on('error', (err) => {
      console.error(`${colors.red}✗ Error: ${err.message}${colors.reset}`);
      reject(err);
    });
    
    process.on('close', (code) => {
      if (code !== 0) {
        console.log(`${colors.yellow}⚠️ Process exited with code ${code}${colors.reset}`);
      }
      resolve(code === 0);
    });
  });
}

// All possible locations where Vite might be
async function findAndRunVite() {
  const isWin = process.platform === 'win32';
  
  // Method 1: Try local node_modules/.bin/vite
  const localVitePath = path.join(process.cwd(), 'node_modules', '.bin', isWin ? 'vite.cmd' : 'vite');
  if (fs.existsSync(localVitePath)) {
    console.log(`${colors.green}✓ Found local Vite at: ${localVitePath}${colors.reset}`);
    if (await runCommand(localVitePath, process.argv.slice(2), {
      env: { ...process.env, PATH: `${process.cwd()}/node_modules/.bin:${process.env.PATH}` }
    })) {
      return true;
    }
  }
  
  // Method 2: Try with npx
  console.log(`${colors.yellow}⚠️ Local Vite not found or failed, trying with npx...${colors.reset}`);
  if (await runCommand(isWin ? 'npx.cmd' : 'npx', ['vite', ...process.argv.slice(2)])) {
    return true;
  }
  
  // Method 3: Try to install and then run
  console.log(`${colors.yellow}⚠️ Trying to install Vite and dependencies...${colors.reset}`);
  
  try {
    console.log(`${colors.blue}▶ Running npm install${colors.reset}`);
    execSync('npm install', { stdio: 'inherit' });
    
    console.log(`${colors.blue}▶ Installing Vite explicitly${colors.reset}`);
    execSync('npm install vite @vitejs/plugin-react-swc --save-dev', { stdio: 'inherit' });
    
    // Try local installation again
    if (fs.existsSync(localVitePath)) {
      console.log(`${colors.green}✓ Vite installed successfully${colors.reset}`);
      return await runCommand(localVitePath, process.argv.slice(2), {
        env: { ...process.env, PATH: `${process.cwd()}/node_modules/.bin:${process.env.PATH}` }
      });
    }
  } catch (error) {
    console.log(`${colors.red}✗ Installation failed: ${error.message}${colors.reset}`);
  }
  
  return false;
}

// Main function
async function main() {
  if (await findAndRunVite()) {
    console.log(`${colors.green}✓ Application started successfully${colors.reset}`);
  } else {
    console.error(`${colors.red}✗ All attempts to start the application failed${colors.reset}`);
    console.log(`${colors.yellow}Try running these commands manually:${colors.reset}`);
    console.log(`  1. npm install`);
    console.log(`  2. npm install vite @vitejs/plugin-react-swc --save-dev`);
    console.log(`  3. npx vite`);
    process.exit(1);
  }
}

// Run the main function
main().catch(err => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, err);
  process.exit(1);
});
