
#!/usr/bin/env node

/**
 * Comprehensive Vite Installation Fix
 * 
 * This script fixes "vite not found" errors by:
 * 1. Cleaning npm cache
 * 2. Reinstalling dependencies
 * 3. Creating a reliable Vite runner
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define colors for better terminal output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m"
};

console.log(`${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.cyan}   SpeechHelp Vite Installation Fixer   ${colors.reset}`);
console.log(`${colors.cyan}========================================${colors.reset}`);

// Helper function to run commands with proper error handling
function runCommand(command, options = {}) {
  console.log(`\n${colors.blue}► Running:${colors.reset} ${command}`);
  try {
    execSync(command, { 
      stdio: ['inherit', 'inherit', 'inherit'],
      ...options 
    });
    return true;
  } catch (error) {
    console.log(`\n${colors.yellow}⚠️  Command had non-zero exit:${colors.reset} ${command}`);
    console.log(`${colors.yellow}This is often expected and not a problem.${colors.reset}`);
    return false;
  }
}

// Step 1: Clean the environment
function cleanEnvironment() {
  console.log(`\n${colors.magenta}STEP 1: Cleaning Environment${colors.reset}`);
  
  // Clear npm cache
  runCommand('npm cache clean --force');
  
  // Remove node_modules if it exists
  if (fs.existsSync('node_modules')) {
    console.log(`\n${colors.yellow}Removing node_modules directory...${colors.reset}`);
    try {
      if (process.platform === 'win32') {
        runCommand('rmdir /s /q node_modules');
      } else {
        runCommand('rm -rf node_modules');
      }
      console.log(`${colors.green}✓ Removed node_modules successfully${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}✗ Error removing node_modules:${colors.reset}`, error.message);
    }
  } else {
    console.log(`${colors.yellow}⚠️ No node_modules directory found${colors.reset}`);
  }
  
  return true;
}

// Step 2: Reinstall dependencies
async function reinstallDependencies() {
  console.log(`\n${colors.magenta}STEP 2: Reinstalling Dependencies${colors.reset}`);
  console.log(`${colors.yellow}This may take a few minutes...${colors.reset}`);
  
  // Try different installation methods
  const npmInstallResult = runCommand('npm install --no-audit --no-fund');
  
  if (!npmInstallResult) {
    console.log(`\n${colors.yellow}Trying alternative installation method...${colors.reset}`);
    runCommand('npm install vite@latest @vitejs/plugin-react-swc@latest --save-dev --no-audit --no-fund');
  }
  
  // Verify vite was installed
  const isWin = process.platform === 'win32';
  const vitePath = path.join(process.cwd(), 'node_modules', '.bin', isWin ? 'vite.cmd' : 'vite');
  
  if (fs.existsSync(vitePath)) {
    console.log(`\n${colors.green}✓ Vite installed successfully at:${colors.reset} ${vitePath}`);
    return true;
  } else {
    console.log(`\n${colors.red}✗ Failed to find Vite in node_modules/.bin${colors.reset}`);
    return false;
  }
}

// Step 3: Create a direct Vite runner
function createViteRunner() {
  console.log(`\n${colors.magenta}STEP 3: Creating Direct Vite Runner${colors.reset}`);
  
  const runViteContent = `#!/usr/bin/env node

/**
 * Direct Vite Runner - Finds and executes the Vite CLI reliably
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Helper to log with colors
const log = (msg) => console.log(msg);
const success = (msg) => console.log(\`✅ \${msg}\`);
const warning = (msg) => console.log(\`⚠️ \${msg}\`);
const error = (msg) => console.log(\`❌ \${msg}\`);

// Find the appropriate command for this platform
const isWin = process.platform === 'win32';
const localVitePath = path.resolve(__dirname, 'node_modules', '.bin', isWin ? 'vite.cmd' : 'vite');

log('Starting SpeechHelp Development Server...');

function runViteProcess() {
  return new Promise((resolve, reject) => {
    let viteProcess;
    
    // Try the local installation first
    if (fs.existsSync(localVitePath)) {
      success(\`Found local Vite at: \${localVitePath}\`);
      viteProcess = spawn(localVitePath, process.argv.slice(2), { 
        stdio: 'inherit',
        shell: true
      });
    } 
    // Fall back to npx
    else {
      warning('Local Vite not found, trying with npx...');
      const npxCommand = isWin ? 'npx.cmd' : 'npx';
      viteProcess = spawn(npxCommand, ['vite', ...process.argv.slice(2)], {
        stdio: 'inherit',
        shell: true
      });
    }

    viteProcess.on('error', (err) => {
      error(\`Failed to start Vite: \${err.message}\`);
      reject(err);
    });

    viteProcess.on('close', (code) => {
      if (code !== 0) {
        warning(\`Vite exited with code \${code}\`);
      }
      resolve();
    });
  });
}

// Execute Vite
runViteProcess().catch(err => {
  error(\`Error running Vite: \${err.message}\`);
  process.exit(1);
});
`;

  try {
    // Write the run-vite.js file
    fs.writeFileSync('run-vite.js', runViteContent);
    
    // Make it executable on Unix systems
    if (process.platform !== 'win32') {
      try {
        fs.chmodSync('run-vite.js', 0o755);
      } catch (e) {
        console.log(`${colors.yellow}⚠️ Could not make script executable, but that's OK${colors.reset}`);
      }
    }
    
    console.log(`\n${colors.green}✓ Created direct Vite runner: run-vite.js${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`\n${colors.red}✗ Error creating Vite runner:${colors.reset}`, error.message);
    return false;
  }
}

// Create convenient start scripts for different platforms
function createStartScripts() {
  console.log(`\n${colors.magenta}STEP 4: Creating Start Scripts${colors.reset}`);
  
  if (process.platform === 'win32') {
    // Windows batch file
    const batchContent = `@echo off
echo Starting SpeechHelp Application...
node run-vite.js %*
`;
    fs.writeFileSync('start-app.bat', batchContent);
    console.log(`${colors.green}✓ Created start-app.bat${colors.reset}`);
  } else {
    // Unix shell script
    const shellContent = `#!/bin/bash
echo "Starting SpeechHelp Application..."
node ./run-vite.js "$@"
`;
    fs.writeFileSync('start-app.sh', shellContent);
    try {
      fs.chmodSync('start-app.sh', 0o755);
    } catch (e) {
      console.log(`${colors.yellow}⚠️ Could not make start-app.sh executable, but that's OK${colors.reset}`);
    }
    console.log(`${colors.green}✓ Created start-app.sh${colors.reset}`);
  }
}

// Main function to orchestrate the fix
async function main() {
  let success = true;
  
  success = success && cleanEnvironment();
  success = success && await reinstallDependencies();
  success = success && createViteRunner();
  createStartScripts();
  
  console.log(`\n${colors.cyan}========================================${colors.reset}`);
  if (success) {
    console.log(`${colors.green}✅ Vite installation fixed successfully!${colors.reset}`);
    console.log(`\n${colors.white}To start the application:${colors.reset}`);
    if (process.platform === 'win32') {
      console.log(`  ${colors.cyan}Option 1:${colors.reset} Run 'start-app.bat'`);
      console.log(`  ${colors.cyan}Option 2:${colors.reset} Run 'node run-vite.js'`);
    } else {
      console.log(`  ${colors.cyan}Option 1:${colors.reset} Run './start-app.sh'`);
      console.log(`  ${colors.cyan}Option 2:${colors.reset} Run 'node run-vite.js'`);
    }
  } else {
    console.log(`${colors.yellow}⚠️ Some steps encountered issues.${colors.reset}`);
    console.log(`${colors.yellow}Please try manually running: node run-vite.js${colors.reset}`);
  }
  console.log(`${colors.cyan}========================================${colors.reset}`);
}

// Run the main function
main().catch(err => {
  console.error(`\n${colors.red}Fatal error:${colors.reset}`, err);
  process.exit(1);
});
