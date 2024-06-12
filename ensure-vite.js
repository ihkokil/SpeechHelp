
// #!/usr/bin/env node

const { spawnSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log("====================================");
console.log("Ensuring Vite is available and starting development server");
console.log("====================================");

// Check if package.json exists and has correct scripts
function setupPackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check for dev script
    if (!packageJson.scripts || !packageJson.scripts.dev || packageJson.scripts.dev !== 'vite') {
      console.log("ℹ️ Adding/updating 'dev' script in package.json");
      
      if (!packageJson.scripts) packageJson.scripts = {};
      packageJson.scripts.dev = 'vite';
      packageJson.scripts['dev:ensure'] = 'node ensure-vite.js';
      
      try {
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log("✅ Updated package.json");
      } catch (error) {
        console.warn("⚠️ Unable to write to package.json, but we'll continue anyway:", error.message);
      }
    }
  } else {
    console.warn("⚠️ No package.json found in current directory. We'll continue anyway.");
  }
}

// Check if Vite is installed (globally or locally)
function isViteAvailable() {
  try {
    // Check for local installation
    const localVitePath = path.join(process.cwd(), 'node_modules', '.bin', 'vite');
    if (fs.existsSync(localVitePath)) {
      return { available: true, path: localVitePath, type: 'local' };
    }
    
    // Check for global installation
    try {
      execSync('vite --version', { stdio: 'ignore' });
      return { available: true, type: 'global' };
    } catch (e) {
      // Not available globally
      return { available: false };
    }
  } catch (error) {
    return { available: false, error };
  }
}

// Install Vite locally
function installVite() {
  console.log("📦 Vite not found. Installing it locally...");
  
  try {
    console.log("Running npm install...");
    execSync('npm install --no-save vite@latest @vitejs/plugin-react-swc@latest', { 
      stdio: 'inherit',
      timeout: 120000 // 2 minute timeout
    });
    console.log("✅ Vite installed successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to install Vite:", error.message);
    
    try {
      console.log("🔄 Trying alternative approach with npx...");
      execSync('npx --yes vite@latest --install=false', { stdio: 'inherit', timeout: 30000 });
      console.log("✅ Vite is available through npx");
      return true;
    } catch (npxError) {
      console.error("❌ All installation attempts failed");
      console.log("\nPlease try manually installing Vite with:");
      console.log("  npm install --save-dev vite @vitejs/plugin-react-swc");
      return false;
    }
  }
}

// Start the Vite development server
function startVite() {
  console.log("🚀 Starting Vite development server...");
  
  const startMethods = [
    // Method 1: Use local node_modules/.bin/vite
    () => {
      const localVitePath = path.join(process.cwd(), 'node_modules', '.bin', 'vite');
      if (fs.existsSync(localVitePath)) {
        console.log("Using local Vite installation...");
        const isWindows = os.platform() === 'win32';
        const command = isWindows ? localVitePath : localVitePath;
        return spawnSync(command, [], { stdio: 'inherit', shell: true });
      }
      return { status: -1 };
    },
    
    // Method 2: Use npx vite
    () => {
      console.log("Using npx to run Vite...");
      return spawnSync('npx', ['vite'], { stdio: 'inherit', shell: true });
    },

    // Method 3: Use global vite command
    () => {
      console.log("Using global Vite installation...");
      return spawnSync('vite', [], { stdio: 'inherit', shell: true });
    },
    
    // Method 4: Use npm run dev (if set up correctly)
    () => {
      console.log("Using npm run dev...");
      return spawnSync('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });
    }
  ];

  // Try each method until one works
  for (const method of startMethods) {
    const result = method();
    if (result.status === 0) {
      return true;
    }
  }
  
  console.error("❌ All attempts to start Vite failed");
  return false;
}

// Main execution
try {
  setupPackageJson();
  
  const viteStatus = isViteAvailable();
  if (!viteStatus.available && !installVite()) {
    process.exit(1);
  }
  
  if (!startVite()) {
    process.exit(1);
  }
} catch (error) {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
}
