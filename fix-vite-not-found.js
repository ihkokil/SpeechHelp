
#!/usr/bin/env node

/**
 * Comprehensive Vite Installation Troubleshooter
 * This script systematically attempts all recommended fixes for the "vite not found" error
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Helper for colored console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m"
};

// Print section headers
const printSection = (num, title) => {
  console.log(`\n${colors.cyan}===========================================${colors.reset}`);
  console.log(`${colors.cyan}STEP ${num}: ${title}${colors.reset}`);
  console.log(`${colors.cyan}===========================================${colors.reset}\n`);
};

// Execute a command and return its output
function runCommand(command, silent = false) {
  if (!silent) console.log(`${colors.blue}> ${command}${colors.reset}`);
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return { success: true, output };
  } catch (error) {
    if (!silent) {
      console.log(`${colors.yellow}Command failed with code ${error.status || 'unknown'}${colors.reset}`);
      console.log(`Error message: ${error.message}`);
    }
    return { success: false, error };
  }
}

// Check if a command exists in the system
function commandExists(command) {
  try {
    const checkCommand = process.platform === 'win32' 
      ? `where ${command} >nul 2>nul && echo Found || echo NotFound` 
      : `command -v ${command} >/dev/null && echo Found || echo NotFound`;
    
    const result = execSync(checkCommand, { encoding: 'utf8' }).trim();
    return result === 'Found';
  } catch (error) {
    return false;
  }
}

// Wait for user confirmation to continue
function waitForUserInput(message = 'Press Enter to continue...') {
  console.log(`\n${colors.yellow}${message}${colors.reset}`);
  return new Promise(resolve => {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.once('data', () => {
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdin.pause();
      resolve();
    });
  });
}

// STEP 1: Diagnose the environment
async function diagnoseEnvironment() {
  printSection(1, "Diagnosing Environment");
  
  // Print working directory
  console.log("Current working directory:");
  runCommand(`pwd 2>/dev/null || cd`);
  
  // Check Node.js and npm versions
  console.log("\nNode.js and npm versions:");
  runCommand("node -v && npm -v");
  
  // List installed packages
  console.log("\nChecking for Vite installation:");
  runCommand("npm list vite");
  
  // Check if vite is in PATH
  console.log("\nChecking if Vite is in PATH:");
  const viteInPath = commandExists('vite');
  console.log(viteInPath 
    ? `${colors.green}✓ Vite found in PATH${colors.reset}` 
    : `${colors.yellow}✗ Vite not found in PATH${colors.reset}`);
  
  // Check local installation
  const isWin = process.platform === 'win32';
  const localVitePath = path.join(process.cwd(), 'node_modules', '.bin', isWin ? 'vite.cmd' : 'vite');
  const localViteExists = fs.existsSync(localVitePath);
  console.log(`\nChecking for local Vite installation at: ${localVitePath}`);
  console.log(localViteExists 
    ? `${colors.green}✓ Local Vite installation found${colors.reset}` 
    : `${colors.yellow}✗ Local Vite installation not found${colors.reset}`);
  
  // Check global installation
  console.log("\nChecking for global Vite installation:");
  const globalCheck = runCommand("npm list -g vite", true);
  if (globalCheck.success && !globalCheck.output.includes("empty")) {
    console.log(`${colors.green}✓ Global Vite installation found${colors.reset}`);
  } else {
    console.log(`${colors.yellow}✗ Global Vite installation not found or incomplete${colors.reset}`);
  }

  // Check vite.config.ts existence
  const configFile = fs.existsSync('vite.config.ts') ? 'vite.config.ts' : 
                    (fs.existsSync('vite.config.js') ? 'vite.config.js' : null);
  console.log(`\nChecking for Vite configuration file:`);
  if (configFile) {
    console.log(`${colors.green}✓ Found configuration file: ${configFile}${colors.reset}`);
  } else {
    console.log(`${colors.yellow}✗ No Vite configuration file found${colors.reset}`);
  }

  await waitForUserInput();
}

// STEP 2: Complete reinstallation
async function completeReinstallation() {
  printSection(2, "Complete Reinstallation");
  
  console.log("Cleaning up previous installations:");
  
  // Delete node_modules
  console.log("\nRemoving node_modules directory...");
  if (fs.existsSync('node_modules')) {
    if (process.platform === 'win32') {
      runCommand('rmdir /s /q node_modules');
    } else {
      runCommand('rm -rf node_modules');
    }
    console.log(`${colors.green}✓ Removed node_modules${colors.reset}`);
  } else {
    console.log(`${colors.yellow}• node_modules directory not found${colors.reset}`);
  }
  
  // Delete lock files
  console.log("\nRemoving package lock files...");
  ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'].forEach(lockFile => {
    if (fs.existsSync(lockFile)) {
      fs.unlinkSync(lockFile);
      console.log(`${colors.green}✓ Removed ${lockFile}${colors.reset}`);
    }
  });
  
  // Clear npm cache
  console.log("\nClearing npm cache...");
  runCommand('npm cache clean --force');
  
  // Reinstall dependencies
  console.log("\nReinstalling all dependencies...");
  const installResult = runCommand('npm install');
  
  if (installResult.success) {
    console.log(`${colors.green}✓ Successfully reinstalled dependencies${colors.reset}`);
    
    // Try running vite after reinstallation
    console.log("\nTrying to run Vite with npx after reinstallation:");
    const viteResult = runCommand('npx vite --version', true);
    if (viteResult.success) {
      console.log(`${colors.green}✓ Vite is working! Version: ${viteResult.output.trim()}${colors.reset}`);
    } else {
      console.log(`${colors.yellow}✗ Vite still not working after reinstallation${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}✗ Dependency reinstallation failed${colors.reset}`);
  }
  
  await waitForUserInput();
}

// STEP 3: Explicitly install and configure Vite
async function explicitInstallation() {
  printSection(3, "Explicit Vite Installation");
  
  // Install vite locally
  console.log("Installing Vite locally:");
  runCommand('npm install --save-dev vite@latest @vitejs/plugin-react-swc@latest');
  
  // Install vite globally (as a backup)
  console.log("\nInstalling Vite globally (as a backup):");
  runCommand('npm install -g vite');
  
  // Modify a startup script to use explicit paths
  console.log("\nCreating a reliable Vite starter script...");
  
  const starterScript = `#!/usr/bin/env node

/**
 * Direct Vite Runner - uses explicit path to the Vite installation
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Possible locations for the Vite executable
const viteLocations = [
  // 1. Local installation in node_modules
  path.join(process.cwd(), 'node_modules', '.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite'),
  
  // 2. Direct path to vite package
  path.join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js'),
  
  // 3. Global installation (will be found via npx)
  null
];

// Find the first existing Vite location
const vitePath = viteLocations.find(location => location && fs.existsSync(location)) || 'npx vite';

console.log(\`Starting Vite from: \${vitePath === 'npx vite' ? 'npx (global)' : vitePath}\`);

// Command to run (if using npx or direct js file)
let command, args;
if (vitePath === 'npx vite') {
  command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  args = ['vite', ...process.argv.slice(2)];
} else if (vitePath.endsWith('.js')) {
  command = process.execPath; // node executable
  args = [vitePath, ...process.argv.slice(2)];
} else {
  command = vitePath;
  args = process.argv.slice(2);
}

// Run Vite with all passed arguments
const viteProcess = spawn(command, args, { 
  stdio: 'inherit',
  shell: true,
  env: { 
    ...process.env, 
    // Ensure node_modules/.bin is in PATH
    PATH: \`\${process.cwd()}/node_modules/.bin\${path.delimiter}\${process.env.PATH}\`
  }
});

viteProcess.on('error', (err) => {
  console.error(\`Error starting Vite: \${err}\`);
  process.exit(1);
});

viteProcess.on('close', (code) => {
  process.exit(code || 0);
});
`;

  fs.writeFileSync('start-vite.js', starterScript);
  if (process.platform !== 'win32') {
    fs.chmodSync('start-vite.js', 0o755);
  }
  console.log(`${colors.green}✓ Created start-vite.js${colors.reset}`);
  
  // Create platform-specific starter scripts
  if (process.platform === 'win32') {
    fs.writeFileSync('start-vite.bat', '@echo off\nnode start-vite.js %*\n');
    console.log(`${colors.green}✓ Created start-vite.bat${colors.reset}`);
  } else {
    fs.writeFileSync('start-vite.sh', '#!/bin/bash\nnode start-vite.js "$@"\n');
    fs.chmodSync('start-vite.sh', 0o755);
    console.log(`${colors.green}✓ Created start-vite.sh${colors.reset}`);
  }
  
  // Try running vite with the new script
  console.log("\nTesting the new Vite starter script:");
  runCommand('node start-vite.js --version');
  
  await waitForUserInput();
}

// STEP 4: Try alternative package manager
async function tryAlternativePackageManager() {
  printSection(4, "Alternative Package Manager (PNPM)");
  
  // Check if pnpm is installed
  let pnpmExists = commandExists('pnpm');
  
  if (!pnpmExists) {
    console.log("PNPM not found, installing globally...");
    runCommand('npm install -g pnpm');
    pnpmExists = commandExists('pnpm');
  }
  
  if (pnpmExists) {
    console.log(`${colors.green}✓ PNPM is available${colors.reset}`);
    
    // Clean installation with pnpm
    console.log("\nRemoving node_modules before PNPM installation:");
    if (process.platform === 'win32') {
      runCommand('rmdir /s /q node_modules 2>nul', true);
    } else {
      runCommand('rm -rf node_modules', true);
    }
    
    console.log("\nInstalling dependencies with PNPM:");
    runCommand('pnpm install');
    
    // Test if vite works with pnpm
    console.log("\nTesting Vite with PNPM:");
    runCommand('pnpm exec vite --version');
  } else {
    console.log(`${colors.red}✗ Failed to install or find PNPM${colors.reset}`);
  }
  
  await waitForUserInput();
}

// STEP 5: Verify project structure
async function verifyProjectStructure() {
  printSection(5, "Verify Project Structure");
  
  // Check Vite config existence and content
  const configFiles = ['vite.config.js', 'vite.config.ts'];
  const foundConfig = configFiles.find(file => fs.existsSync(file));
  
  if (foundConfig) {
    console.log(`${colors.green}✓ Found Vite configuration file: ${foundConfig}${colors.reset}`);
    
    try {
      const configContent = fs.readFileSync(foundConfig, 'utf8');
      console.log(`\nConfig file content preview:`);
      console.log(`${colors.cyan}----------------------------------------${colors.reset}`);
      console.log(configContent.slice(0, 500) + (configContent.length > 500 ? '...' : ''));
      console.log(`${colors.cyan}----------------------------------------${colors.reset}`);
      
      // Check for essential imports
      const hasDefineConfig = configContent.includes('defineConfig');
      const hasReactPlugin = configContent.includes('@vitejs/plugin-react') || 
                            configContent.includes('@vitejs/plugin-react-swc');
      
      console.log(`\nConfig file check:`);
      console.log(hasDefineConfig 
        ? `${colors.green}✓ 'defineConfig' found${colors.reset}` 
        : `${colors.yellow}✗ 'defineConfig' not found${colors.reset}`);
      console.log(hasReactPlugin 
        ? `${colors.green}✓ React plugin found${colors.reset}` 
        : `${colors.yellow}✗ React plugin not found${colors.reset}`);
    } catch (error) {
      console.log(`${colors.red}✗ Error reading config file: ${error.message}${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}✗ No Vite configuration file found${colors.reset}`);
    
    // Create a basic vite config
    console.log("\nCreating a basic Vite config file...");
    
    const configContent = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
    host: true,
  }
});
`;

    fs.writeFileSync('vite.config.ts', configContent);
    console.log(`${colors.green}✓ Created vite.config.ts${colors.reset}`);
  }
  
  // Check package.json for correct scripts
  if (fs.existsSync('package.json')) {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      console.log("\nChecking package.json scripts:");
      if (packageJson.scripts) {
        const devScript = packageJson.scripts.dev || packageJson.scripts.start;
        if (devScript) {
          console.log(`Current development script: "${devScript}"`);
          
          // Check if using direct path
          const usesExplicitPath = devScript.includes('node_modules') || devScript.includes('start-vite');
          console.log(usesExplicitPath 
            ? `${colors.green}✓ Script uses explicit path${colors.reset}` 
            : `${colors.yellow}✗ Script does not use explicit path${colors.reset}`);
        } else {
          console.log(`${colors.yellow}✗ No dev/start script found${colors.reset}`);
        }
      } else {
        console.log(`${colors.yellow}✗ No scripts section found in package.json${colors.reset}`);
      }
    } catch (error) {
      console.log(`${colors.red}✗ Error reading package.json: ${error.message}${colors.reset}`);
    }
  }
  
  await waitForUserInput();
}

// Final verification test
async function finalVerification() {
  printSection("FINAL", "Verification Test");
  
  console.log("Testing Vite using multiple methods:");
  
  // Method 1: Using our custom script
  console.log("\n1. Testing with custom start-vite.js script:");
  const customScriptResult = runCommand('node start-vite.js --version', true);
  console.log(customScriptResult.success 
    ? `${colors.green}✓ SUCCESS! Vite version: ${customScriptResult.output.trim()}${colors.reset}` 
    : `${colors.red}✗ Failed with custom script${colors.reset}`);
  
  // Method 2: Using npx
  console.log("\n2. Testing with npx:");
  const npxResult = runCommand('npx vite --version', true);
  console.log(npxResult.success 
    ? `${colors.green}✓ SUCCESS! Vite version: ${npxResult.output.trim()}${colors.reset}` 
    : `${colors.red}✗ Failed with npx${colors.reset}`);
  
  // Method 3: Direct path
  const localViteBin = path.join('node_modules', 'vite', 'bin', 'vite.js');
  if (fs.existsSync(localViteBin)) {
    console.log("\n3. Testing with direct path to Vite binary:");
    const directResult = runCommand(`node ${localViteBin} --version`, true);
    console.log(directResult.success 
      ? `${colors.green}✓ SUCCESS! Vite version: ${directResult.output.trim()}${colors.reset}` 
      : `${colors.red}✗ Failed with direct path${colors.reset}`);
  }
  
  // Method 4: Node modules .bin path
  const binVitePath = path.join('node_modules', '.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite');
  if (fs.existsSync(binVitePath)) {
    console.log("\n4. Testing with .bin path:");
    const binResult = runCommand(`${binVitePath} --version`, true);
    console.log(binResult.success 
      ? `${colors.green}✓ SUCCESS! Vite version: ${binResult.output.trim()}${colors.reset}` 
      : `${colors.red}✗ Failed with .bin path${colors.reset}`);
  }
  
  // Final summary
  console.log(`\n${colors.cyan}==================================================${colors.reset}`);
  console.log(`${colors.cyan}                 SUMMARY                         ${colors.reset}`);
  console.log(`${colors.cyan}==================================================${colors.reset}`);
  
  const anySuccess = customScriptResult.success || npxResult.success;
  
  if (anySuccess) {
    console.log(`${colors.green}✅ GOOD NEWS! Vite is now working with at least one method.${colors.reset}`);
    console.log(`\nTo start your development server, try these commands in order:`);
    console.log(`1. ${colors.cyan}node start-vite.js${colors.reset} (most reliable)`);
    console.log(`2. ${colors.cyan}npx vite${colors.reset}`);
    if (fs.existsSync(binVitePath)) {
      console.log(`3. ${colors.cyan}${binVitePath.replace(/\\/g, '/')}${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}❌ Unfortunately, Vite is still not working correctly.${colors.reset}`);
    console.log(`\nPossible solutions:`);
    console.log(`1. Try using a different Node.js version (use nvm or similar)`);
    console.log(`2. Create a new Vite project with: npm create vite@latest my-app`);
    console.log(`3. Check for system-specific issues like path length limits`);
  }
  
  console.log(`\n${colors.cyan}==================================================${colors.reset}`);
}

// Run all steps in sequence
async function main() {
  console.log(`${colors.cyan}==================================================${colors.reset}`);
  console.log(`${colors.cyan}    COMPREHENSIVE VITE INSTALLATION FIXER         ${colors.reset}`);
  console.log(`${colors.cyan}==================================================${colors.reset}`);
  
  await diagnoseEnvironment();
  await completeReinstallation();
  await explicitInstallation();
  await tryAlternativePackageManager();
  await verifyProjectStructure();
  await finalVerification();
}

// Start the main process
main().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
