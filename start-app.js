
#!/usr/bin/env node

/**
 * Universal SpeechHelp App Launcher
 * Works across all platforms and environments
 */

const { spawn } = require('child_process');
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

// Check for Vite in different locations
const isWin = process.platform === 'win32';
const viteLocations = [
  path.join(process.cwd(), 'node_modules', '.bin', isWin ? 'vite.cmd' : 'vite'),  // Local project installation
  path.resolve(__dirname, 'node_modules', '.bin', isWin ? 'vite.cmd' : 'vite'),   // In case script is run from different directory
];

async function findViteAndRun() {
  // Step 1: Check if Vite is directly available in any of our locations
  for (const vitePath of viteLocations) {
    if (fs.existsSync(vitePath)) {
      console.log(`${colors.green}✓ Found local Vite at: ${vitePath}${colors.reset}`);
      try {
        return runViteProcess(vitePath);
      } catch (error) {
        console.log(`${colors.yellow}⚠️ Error running ${vitePath}: ${error.message}${colors.reset}`);
      }
    }
  }

  // Step 2: Try with npx
  console.log(`${colors.yellow}⚠️ Local Vite not found, trying with npx...${colors.reset}`);
  try {
    const npxCommand = isWin ? 'npx.cmd' : 'npx';
    return runViteProcess(npxCommand, ['vite']);
  } catch (error) {
    console.log(`${colors.red}✗ Failed to run with npx: ${error.message}${colors.reset}`);
  }

  // Step 3: Try to install Vite and then run it
  console.log(`${colors.yellow}⚠️ Trying to install Vite and run...${colors.reset}`);
  try {
    const npmCommand = isWin ? 'npm.cmd' : 'npm';
    const installProcess = spawn(npmCommand, ['install', 'vite', '@vitejs/plugin-react-swc', '--save-dev'], { 
      stdio: 'inherit',
      shell: true
    });
    
    await new Promise((resolve, reject) => {
      installProcess.on('close', code => {
        if (code !== 0) {
          console.log(`${colors.yellow}⚠️ Installation exited with code ${code}${colors.reset}`);
        }
        resolve();
      });
      
      installProcess.on('error', err => reject(err));
    });
    
    // Check again for Vite after installation
    for (const vitePath of viteLocations) {
      if (fs.existsSync(vitePath)) {
        console.log(`${colors.green}✓ Successfully installed Vite at: ${vitePath}${colors.reset}`);
        return runViteProcess(vitePath);
      }
    }
    
    // If still not found, use npx as last resort
    return runViteProcess(isWin ? 'npx.cmd' : 'npx', ['vite']);
    
  } catch (error) {
    console.log(`${colors.red}✗ Failed to install and run Vite: ${error.message}${colors.reset}`);
  }
  
  return false;
}

function runViteProcess(command, args = []) {
  return new Promise((resolve, reject) => {
    // If command is a path to vite and not npx, don't add additional args
    const finalArgs = args.length ? args.concat(process.argv.slice(2)) : process.argv.slice(2);
    
    console.log(`${colors.blue}▶ Running: ${command} ${finalArgs.join(' ')}${colors.reset}`);
    
    const viteProcess = spawn(command, finalArgs, { 
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, PATH: `${process.cwd()}/node_modules/.bin:${process.env.PATH}` } // Add node_modules/.bin to PATH
    });
    
    viteProcess.on('error', (err) => {
      console.error(`${colors.red}✗ Error starting process: ${err.message}${colors.reset}`);
      reject(err);
    });
    
    viteProcess.on('close', (code) => {
      if (code !== 0) {
        console.log(`\n${colors.yellow}⚠️ Process exited with code ${code}${colors.reset}`);
      }
      resolve(true);
    });
  });
}

// Run the main function
findViteAndRun().catch(err => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, err);
  process.exit(1);
});
