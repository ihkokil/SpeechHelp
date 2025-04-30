
#!/usr/bin/env node

// Enhanced script to run Vite with better error handling and installation
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("====================================");
console.log("Starting SpeechHelp Development Server");
console.log("====================================");

// Function to check if vite is accessible via npx or locally
function findVitePath() {
  // Check for local installation in node_modules
  const localVitePath = path.join(process.cwd(), 'node_modules', '.bin', 'vite');
  if (fs.existsSync(localVitePath)) {
    return { type: 'local', path: localVitePath };
  }
  
  // Check for global installation
  try {
    const npxPath = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    execSync(`${npxPath} vite --version`, { stdio: 'pipe' });
    return { type: 'npx', path: npxPath };
  } catch (e) {
    // Not found with npx
  }
  
  // Try direct global command
  try {
    execSync('vite --version', { stdio: 'pipe' });
    return { type: 'global', path: 'vite' };
  } catch (e) {
    // Not found globally
  }
  
  return null;
}

// Try to run vite with multiple approaches
function runVite() {
  // First try: Find best Vite access method
  const viteAccess = findVitePath();
  
  if (viteAccess) {
    console.log(`✅ Found Vite (${viteAccess.type}), starting server...`);
    
    try {
      let viteProcess;
      
      if (viteAccess.type === 'npx') {
        viteProcess = spawn(viteAccess.path, ['vite'], { stdio: 'inherit', shell: true });
      } else {
        viteProcess = spawn(viteAccess.path, [], { stdio: 'inherit', shell: true });
      }
      
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
    } catch (error) {
      console.error("⚠️ Failed to start with found method:", error.message);
    }
  }
  
  // If direct run failed, try alternative methods
  tryBackupMethods();
}

// Backup methods to run vite
function tryBackupMethods() {
  try {
    // Try to install vite locally first if not already installed
    console.log("🔄 Installing Vite locally and trying again...");
    
    try {
      execSync('npm install vite@latest --save-dev', { stdio: 'inherit' });
      execSync('npm install @vitejs/plugin-react-swc --save-dev', { stdio: 'inherit' });
    } catch (e) {
      console.log("⚠️ Local installation failed, trying global installation...");
    }
    
    // Check for local node_modules/.bin/vite again
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
  
  // Try using the local run-vite.js script
  if (fs.existsSync('./run-vite.js')) {
    console.log("🔄 Trying with local runner script...");
    try {
      const localRunnerProcess = spawn('node', ['run-vite.js'], { stdio: 'inherit', shell: true });
      
      localRunnerProcess.on('error', () => {
        tryGlobalInstall();
      });
      
      return;
    } catch (e) {
      console.log("⚠️ Local runner failed:", e.message);
    }
  }
  
  tryGlobalInstall();
}

// Try with global installation as absolute last resort
function tryGlobalInstall() {
  try {
    // Try to use global vite if installed
    console.log("🔄 Attempting global installation as last resort...");
    execSync('npm install -g vite', { stdio: 'inherit' });
    
    const globalViteProcess = spawn('vite', [], { stdio: 'inherit', shell: true });
    globalViteProcess.on('error', () => {
      showFailureMessage();
    });
  } catch (error) {
    showFailureMessage();
  }
}

// Show failure message with manual instructions
function showFailureMessage() {
  console.error("❌ All attempts failed. Please try manually:");
  console.log("1. npm install -g vite");
  console.log("2. npm install vite --save-dev");
  console.log("3. npx vite");
  process.exit(1);
}

// Start the process
runVite();
