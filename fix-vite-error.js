
#!/usr/bin/env node

/**
 * Fix Vite not found error
 * This script implements all the suggested solutions:
 * 1. Checks if dependencies are installed
 * 2. Explicitly installs Vite
 * 3. Verifies the PATH includes node_modules/.bin
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("======================================");
console.log("Fixing 'vite: not found' error");
console.log("======================================");

// Step 1: Check if project dependencies are installed
console.log("\n1. Checking if project dependencies are installed...");
try {
  console.log("Running npm install...");
  execSync('npm install', { stdio: 'inherit' });
  console.log("✅ Dependencies installed successfully");
} catch (error) {
  console.log("⚠️ Error during npm install, continuing with other fixes");
}

// Step 2: Explicitly install Vite as a development dependency
console.log("\n2. Explicitly installing Vite as a development dependency...");
try {
  console.log("Running npm install --save-dev vite @vitejs/plugin-react-swc...");
  execSync('npm install --save-dev vite @vitejs/plugin-react-swc', { stdio: 'inherit' });
  console.log("✅ Vite installed successfully");
} catch (error) {
  console.log("⚠️ Error installing Vite:", error.message);
}

// Step 3: Verify the PATH includes node_modules/.bin
console.log("\n3. Ensuring PATH environment includes node_modules/.bin...");
const nodeModulesBinPath = path.join(process.cwd(), 'node_modules', '.bin');
const isWin = process.platform === 'win32';
const viteExec = path.join(nodeModulesBinPath, isWin ? 'vite.cmd' : 'vite');

if (fs.existsSync(viteExec)) {
  console.log("✅ Vite executable found at:", viteExec);
} else {
  console.log("⚠️ Vite executable not found at expected location!");
}

// Check if vite can be executed successfully
console.log("\n4. Testing if Vite can be executed...");
try {
  const npxViteCommand = isWin ? 'npx.cmd vite --version' : 'npx vite --version';
  const viteVersion = execSync(npxViteCommand, { encoding: 'utf8' }).trim();
  console.log(`✅ Vite can be executed successfully (Version: ${viteVersion})`);
} catch (error) {
  console.log("⚠️ Could not execute Vite:", error.message);
}

console.log("\n======================================");
console.log("All fixes have been attempted.");
console.log("To start your application, run one of:");
console.log(" - node start-app.js");
if (isWin) {
  console.log(" - start-app.bat");
} else {
  console.log(" - ./start-app.sh (make it executable with 'chmod +x start-app.sh' first)");
}
console.log("======================================");
