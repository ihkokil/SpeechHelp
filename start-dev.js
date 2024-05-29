
#!/usr/bin/env node

// Enhanced script to ensure Vite is installed and runs properly
const { spawnSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("====================================");
console.log("Starting SpeechHelp Development Server");
console.log("====================================");

// Check if Vite is installed (either globally or locally)
function isViteAvailable() {
  try {
    // Check local installation first
    const localVitePath = path.join(process.cwd(), 'node_modules', '.bin', 'vite');
    if (fs.existsSync(localVitePath)) {
      return { available: true, path: localVitePath, type: 'local' };
    }
    
    // Then check global installation
    execSync('vite --version', { stdio: 'ignore' });
    return { available: true, type: 'global' };
  } catch (e) {
    return { available: false };
  }
}

// Install Vite locally if needed
function installVite() {
  console.log("📦 Vite not found. Installing it now...");
  
  try {
    execSync('npm install vite@latest --no-save', { 
      stdio: 'inherit',
      timeout: 60000 // 60 second timeout
    });
    console.log("✅ Vite installed successfully.");
    return true;
  } catch (error) {
    console.error("❌ Failed to install Vite with npm:", error.message);
    
    // Try with alternative package managers
    try {
      console.log("🔄 Trying with npx...");
      execSync('npx vite@latest --no-install', { stdio: 'inherit' });
      return true;
    } catch (npxError) {
      console.error("❌ All installation attempts failed.");
      console.error("Please try manually running one of these commands:");
      console.error("1. npm install vite --save-dev");
      console.error("2. yarn add vite --dev");
      console.error("3. pnpm add vite --save-dev");
      return false;
    }
  }
}

// Start the Vite development server
function startVite() {
  // Check for existing Vite installation
  const viteStatus = isViteAvailable();
  
  if (!viteStatus.available && !installVite()) {
    process.exit(1);
  }
  
  console.log("🚀 Starting Vite development server...");
  
  // Try different methods to start Vite
  const startMethods = [
    // Method 1: Use local Vite from node_modules
    () => {
      const localVitePath = path.join(process.cwd(), 'node_modules', '.bin', 'vite');
      if (fs.existsSync(localVitePath)) {
        console.log("Using local Vite installation...");
        return spawnSync(localVitePath, [], { stdio: 'inherit', shell: true });
      }
      return { status: -1 };
    },
    
    // Method 2: Use global Vite
    () => {
      console.log("Trying global Vite installation...");
      return spawnSync('vite', [], { stdio: 'inherit', shell: true });
    },
    
    // Method 3: Use npx
    () => {
      console.log("Trying npx Vite...");
      return spawnSync('npx', ['vite'], { stdio: 'inherit', shell: true });
    },
    
    // Method 4: Try direct node execution
    () => {
      const vitePath = path.join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');
      if (fs.existsSync(vitePath)) {
        console.log("Directly executing Vite with Node...");
        return spawnSync('node', [vitePath], { stdio: 'inherit', shell: true });
      }
      return { status: -1 };
    }
  ];
  
  // Try each method until one works
  for (const method of startMethods) {
    const result = method();
    if (result.status === 0) {
      return true;
    }
  }
  
  console.error("❌ All attempts to start Vite have failed.");
  console.error("Please try manually running: npx vite");
  return false;
}

// Execute the main function
startVite();
