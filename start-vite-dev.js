
// #!/usr/bin/env node

// Enhanced script to ensure Vite is installed and runs properly
const { spawnSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("====================================");
console.log("Starting SpeechHelp Development Server");
console.log("====================================");

// Check if Vite is globally installed
function isViteInstalledGlobally() {
  try {
    execSync('vite --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Check if Vite is locally installed
function isViteInstalledLocally() {
  const localVitePath = path.join(process.cwd(), 'node_modules', '.bin', 'vite');
  return fs.existsSync(localVitePath);
}

// Install Vite if needed
function ensureViteInstalled() {
  if (!isViteInstalledGlobally() && !isViteInstalledLocally()) {
    console.log("📦 Vite not found. Installing it now...");
    
    try {
      // Install vite locally
      execSync('npm install vite@latest --no-save', { stdio: 'inherit' });
      console.log("✅ Vite installed successfully.");
    } catch (error) {
      console.error("❌ Failed to install Vite:", error.message);
      console.error("Please try running: npm install vite@latest --save-dev");
      process.exit(1);
    }
  }
}

// Start the Vite development server
function startViteServer() {
  // First try the locally installed vite
  const localVitePath = path.join(process.cwd(), 'node_modules', '.bin', 'vite');
  
  if (fs.existsSync(localVitePath)) {
    console.log("🚀 Starting Vite from local installation...");
    const result = spawnSync(localVitePath, [], { stdio: 'inherit', shell: true });
    return result.status;
  }
  
  // Fall back to global installation
  if (isViteInstalledGlobally()) {
    console.log("🚀 Starting Vite from global installation...");
    const result = spawnSync('vite', [], { stdio: 'inherit', shell: true });
    return result.status;
  }
  
  // Try with npx as last resort
  console.log("🚀 Starting Vite with npx...");
  const result = spawnSync('npx', ['vite'], { stdio: 'inherit', shell: true });
  return result.status;
}

// Main execution flow
try {
  ensureViteInstalled();
  const exitCode = startViteServer();
  
  if (exitCode !== 0) {
    console.error(`❌ Vite exited with code ${exitCode}`);
    process.exit(exitCode);
  }
} catch (error) {
  console.error("❌ Failed to start Vite:", error.message);
  process.exit(1);
}
