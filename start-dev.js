
#!/usr/bin/env node

// Enhanced script to run Vite with better error handling and installation
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("====================================");
console.log("Starting SpeechHelp Development Server");
console.log("====================================");

// Function to check if vite is accessible via npx
function isViteAccessible() {
  try {
    const npxPath = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    execSync(`${npxPath} vite --version`, { stdio: 'pipe' });
    return true;
  } catch (e) {
    return false;
  }
}

// Try to run vite with multiple approaches
function runVite() {
  // First try: Direct vite command if already installed
  if (isViteAccessible()) {
    console.log("✅ Vite is accessible, starting server...");
    const npxPath = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const viteProcess = spawn(npxPath, ['vite'], { stdio: 'inherit', shell: true });
    
    viteProcess.on('close', (code) => {
      if (code !== 0) {
        console.log("⚠️ Server exited with code:", code);
        tryBackupMethods();
      }
    });
    
    viteProcess.on('error', () => {
      console.log("⚠️ Error running Vite, trying alternatives...");
      tryBackupMethods();
    });
    
    return;
  }
  
  // If direct run failed, try alternative methods
  tryBackupMethods();
}

// Backup methods to run vite
function tryBackupMethods() {
  try {
    // Try to install vite locally first
    console.log("🔄 Installing Vite locally and trying again...");
    
    try {
      execSync('npm install vite@latest --no-save', { stdio: 'inherit' });
    } catch (e) {
      console.log("⚠️ Local installation failed, trying global installation...");
    }
    
    // Check for local node_modules/.bin/vite
    const localVitePath = path.join(process.cwd(), 'node_modules', '.bin', 'vite');
    if (fs.existsSync(localVitePath)) {
      console.log("✅ Found local Vite installation, starting server...");
      const localViteProcess = spawn(localVitePath, [], { stdio: 'inherit', shell: true });
      
      localViteProcess.on('close', (code) => {
        if (code !== 0) {
          console.error("❌ Server exited with code:", code);
          tryLastResort();
        }
      });
      
      return;
    }
    
    // Try with npx vite
    console.log("🔄 Trying with npx vite...");
    const npxPath = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const npxProcess = spawn(npxPath, ['vite'], { stdio: 'inherit', shell: true });
    
    npxProcess.on('error', () => {
      tryLastResort();
    });
  } catch (error) {
    tryLastResort();
  }
}

// Last resort methods
function tryLastResort() {
  console.error("❌ All standard methods failed. Trying last resort approaches...");
  
  try {
    // Try to use global vite if installed
    execSync('npm install -g vite', { stdio: 'inherit' });
    
    const globalViteProcess = spawn('vite', [], { stdio: 'inherit', shell: true });
    globalViteProcess.on('error', () => {
      console.error("❌ All attempts failed. Please try manually:");
      console.log("1. npm install -g vite");
      console.log("2. npx vite");
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Could not start development server:", error.message);
    console.log("Please try these commands manually:");
    console.log("1. npm install -g vite");
    console.log("2. npx vite");
    process.exit(1);
  }
}

// Start the process
runVite();
