
// #!/usr/bin/env node

/**
 * Enhanced script to ensure Vite is installed and runs properly
 * This script handles various edge cases and provides helpful error messages
 */
const { spawnSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

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
    // Try with npm first
    console.log("Trying to install Vite with npm...");
    execSync('npm install --no-save vite@latest @vitejs/plugin-react-swc@latest', { 
      stdio: 'inherit',
      timeout: 120000 // 2 minute timeout
    });
    console.log("✅ Vite installed successfully with npm.");
    return true;
  } catch (npmError) {
    console.error("⚠️ Failed to install Vite with npm:", npmError.message);
    
    // Try with npx as fallback
    try {
      console.log("🔄 Trying with npx...");
      execSync('npx --yes vite@latest', { stdio: 'inherit', timeout: 60000 });
      console.log("✅ Vite available through npx.");
      return true;
    } catch (npxError) {
      console.error("❌ All installation attempts failed.");
      console.log("\nPlease try manually installing Vite with one of these commands:");
      console.log("- npm install vite @vitejs/plugin-react-swc --save-dev");
      console.log("- yarn add vite @vitejs/plugin-react-swc --dev");
      console.log("- pnpm add vite @vitejs/plugin-react-swc --save-dev");
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
    // Method 1: Use local Vite from node_modules/.bin
    () => {
      const localVitePath = path.join(process.cwd(), 'node_modules', '.bin', 'vite');
      if (fs.existsSync(localVitePath)) {
        console.log("Using local Vite installation from node_modules/.bin...");
        const isWindows = os.platform() === 'win32';
        const command = isWindows ? localVitePath : localVitePath;
        return spawnSync(command, [], { stdio: 'inherit', shell: true });
      }
      return { status: -1 };
    },
    
    // Method 2: Use local Vite with node
    () => {
      const vitePath = path.join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');
      if (fs.existsSync(vitePath)) {
        console.log("Directly executing Vite with Node...");
        return spawnSync('node', [vitePath], { stdio: 'inherit', shell: true });
      }
      return { status: -1 };
    },
    
    // Method 3: Use global Vite
    () => {
      console.log("Trying global Vite installation...");
      return spawnSync('vite', [], { stdio: 'inherit', shell: true });
    },
    
    // Method 4: Use npx Vite
    () => {
      console.log("Trying npx Vite...");
      return spawnSync('npx', ['--yes', 'vite'], { stdio: 'inherit', shell: true });
    },

    // Method 5: Use npm run
    () => {
      // Check if package.json exists and has vite script
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          if (packageJson.scripts && (packageJson.scripts.dev || packageJson.scripts.start)) {
            const scriptName = packageJson.scripts.dev ? 'dev' : 'start';
            console.log(`Trying npm run ${scriptName}...`);
            return spawnSync('npm', ['run', scriptName], { stdio: 'inherit', shell: true });
          }
        } catch (e) {
          // Ignore package.json parsing errors
        }
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
  console.error("\nPossible solutions:");
  console.error("1. Manually install Vite: npm install vite @vitejs/plugin-react-swc --save-dev");
  console.error("2. Try running: npx vite");
  console.error("3. Check your package.json for proper scripts configuration");
  
  return false;
}

// Execute the main function
startVite();
