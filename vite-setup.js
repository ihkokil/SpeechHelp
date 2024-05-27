
#!/usr/bin/env node

/**
 * One-time Vite Setup Script
 * Ensures Vite is properly installed in node_modules
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("====================================");
console.log("SpeechHelp Development Setup");
console.log("====================================");

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

// Clean installation process
function cleanInstall() {
  console.log("\n📦 Installing Vite and dependencies...");
  
  try {
    // Remove node_modules first to ensure clean installation
    if (fs.existsSync('node_modules')) {
      console.log("🧹 Removing existing node_modules for clean install...");
      if (process.platform === 'win32') {
        try { execSync('rmdir /s /q node_modules', { stdio: 'ignore' }); } catch (e) {}
      } else {
        try { execSync('rm -rf node_modules', { stdio: 'ignore' }); } catch (e) {}
      }
    }
    
    // Clean npm cache
    console.log("🧹 Cleaning npm cache...");
    try { execSync('npm cache clean --force', { stdio: 'ignore' }); } catch (e) {}
    
    // Install dependencies
    console.log("📦 Installing project dependencies...");
    execSync('npm install --no-fund --no-audit', { stdio: 'inherit' });
    
    // Make sure Vite and React SWC plugin are installed
    console.log("📦 Ensuring Vite is installed...");
    execSync('npm install vite@latest @vitejs/plugin-react-swc@latest --save-dev --no-fund --no-audit', { 
      stdio: 'inherit' 
    });
    
    return true;
  } catch (error) {
    console.error("❌ Installation error:", error.message);
    return false;
  }
}

// Make scripts executable on Unix systems
function makeScriptsExecutable() {
  if (process.platform !== 'win32') {
    console.log("\n🔐 Making scripts executable...");
    try {
      execSync('chmod +x start-app.sh run-vite.js start-app.js vite-setup.js', { stdio: 'ignore' });
      console.log("✅ Scripts are now executable");
    } catch (e) {
      console.log("⚠️ Could not make scripts executable, but that's OK");
    }
  }
}

// Main function
function main() {
  const success = cleanInstall();
  makeScriptsExecutable();
  
  console.log("\n====================================");
  if (success) {
    console.log("✅ Setup complete!");
    console.log("\nTo start the application:");
    if (process.platform === 'win32') {
      console.log("  Option 1: Run 'start-app.bat'");
      console.log("  Option 2: Run 'node start-app.js'");
    } else {
      console.log("  Option 1: Run './start-app.sh'");
      console.log("  Option 2: Run 'node start-app.js'");
    }
  } else {
    console.log("⚠️ Setup encountered some issues.");
    console.log("Please try manually running: npm install vite --save-dev");
  }
  console.log("====================================");
}

// Run the main function
main();
