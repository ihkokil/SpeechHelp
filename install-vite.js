
#!/usr/bin/env node

/**
 * This script ensures Vite is properly installed and available
 * It works across different environments and offers fallback methods
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("=======================================");
console.log("SpeechHelp Development Environment Setup");
console.log("=======================================");

// Function to check if a command exists
function commandExists(command) {
  try {
    const isWin = process.platform === 'win32';
    const cmd = isWin ? 'where' : 'which';
    execSync(`${cmd} ${command}`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Function to run a command and return its output
function runCommand(command, args = [], options = {}) {
  try {
    console.log(`Running: ${command} ${args.join(' ')}`);
    return execSync(`${command} ${args.join(' ')}`, { 
      encoding: 'utf8',
      ...options
    });
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    return null;
  }
}

// Install Vite locally
function installVite() {
  console.log("\n📦 Installing Vite and dependencies...");
  
  const installCommands = [
    'npm install vite@latest --save-dev',
    'npm install @vitejs/plugin-react-swc@latest --save-dev'
  ];
  
  let success = true;
  for (const cmd of installCommands) {
    try {
      console.log(`> ${cmd}`);
      execSync(cmd, { stdio: 'inherit' });
    } catch (error) {
      console.error(`Failed with command: ${cmd}`);
      console.error(error.message);
      success = false;
      break;
    }
  }
  
  return success;
}

// Check for Vite in local node_modules
function checkLocalVite() {
  const localVitePath = path.join(process.cwd(), 'node_modules', '.bin', 
                                 process.platform === 'win32' ? 'vite.cmd' : 'vite');
  
  if (fs.existsSync(localVitePath)) {
    console.log("✅ Vite is installed locally");
    return localVitePath;
  } else {
    console.log("❌ Vite not found in local node_modules");
    return null;
  }
}

// Check if npm is available
function checkNpm() {
  if (commandExists('npm')) {
    console.log("✅ npm is available");
    return true;
  } else {
    console.log("❌ npm not found - please install Node.js");
    return false;
  }
}

// Generate start script based on platform
function generateStartScript() {
  const isWin = process.platform === 'win32';
  
  if (isWin) {
    // Windows .bat file
    console.log("📝 Creating Windows start script (start-app.bat)...");
    const batchContent = `@echo off
echo Starting SpeechHelp Application...
IF EXIST "node_modules\\.bin\\vite.cmd" (
  node_modules\\.bin\\vite
) ELSE (
  echo Vite not found locally, trying with npx...
  npx vite
)
`;
    fs.writeFileSync('start-app.bat', batchContent);
    console.log("✅ Created start-app.bat");
  } else {
    // Unix shell script
    console.log("📝 Creating Unix start script (start-app.sh)...");
    const shellContent = `#!/bin/bash
echo "Starting SpeechHelp Application..."
if [ -f "./node_modules/.bin/vite" ]; then
  ./node_modules/.bin/vite
else
  echo "Vite not found locally, trying with npx..."
  npx vite
fi
`;
    fs.writeFileSync('start-app.sh', shellContent);
    execSync('chmod +x start-app.sh', { stdio: 'inherit' });
    console.log("✅ Created start-app.sh (executable)");
  }
}

// Main function
async function main() {
  // Step 1: Check if npm is available
  if (!checkNpm()) {
    console.error("\n❌ Error: npm is required but not found.");
    console.log("Please install Node.js from https://nodejs.org/");
    process.exit(1);
  }
  
  // Step 2: Check if Vite is already installed locally
  let vitePath = checkLocalVite();
  
  // Step 3: If not found locally, install it
  if (!vitePath) {
    console.log("Vite not found locally. Installing...");
    const success = installVite();
    
    if (success) {
      // Check again after installation
      vitePath = checkLocalVite();
    }
  }
  
  // Step 4: Generate platform-specific start script
  generateStartScript();
  
  // Step 5: Verification and instructions
  if (vitePath) {
    console.log("\n✅ Setup complete!");
    console.log("\nTo start the application:");
    if (process.platform === 'win32') {
      console.log("  Option 1: Run 'start-app.bat'");
      console.log("  Option 2: Run 'npx vite'");
      console.log("  Option 3: Run 'node ./node_modules/.bin/vite'");
    } else {
      console.log("  Option 1: Run './start-app.sh'");
      console.log("  Option 2: Run 'npx vite'");
      console.log("  Option 3: Run './node_modules/.bin/vite'");
    }
  } else {
    console.log("\n⚠️ Vite installation may have issues.");
    console.log("Try running one of these commands manually:");
    console.log("  npm install vite@latest --save-dev");
    console.log("  npx vite");
  }
}

// Run the main function
main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});
