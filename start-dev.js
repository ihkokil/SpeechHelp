
#!/usr/bin/env node

// This script helps run the locally installed Vite with enhanced error handling
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to ensure vite is added to package.json
function ensureViteInPackageJson() {
  try {
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const devDeps = packageJson.devDependencies || {};
      const deps = packageJson.dependencies || {};
      
      if (!devDeps.vite && !deps.vite) {
        console.log('⚠️ Vite not found in package.json. Adding it...');
        packageJson.devDependencies = {
          ...devDeps,
          "vite": "^4.4.0"  // Using a stable version
        };
        
        // Write updated package.json
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log('✅ Updated package.json with Vite dependency');
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('❌ Failed to update package.json:', error.message);
    return false;
  }
}

// Function to check if a command exists
function commandExists(command) {
  try {
    execSync(command === 'vite' 
      ? 'vite --version 2>/dev/null' 
      : `${command} --version 2>/dev/null`, 
      { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Function to install vite with different methods
function installVite() {
  console.log('⚠️ Installing Vite...');
  
  try {
    // Method 1: Normal install with no-audit (faster)
    console.log('Trying installation method 1...');
    execSync('npm install --save-dev vite@latest --no-audit', { stdio: 'inherit' });
    return true;
  } catch (e1) {
    try {
      // Method 2: Force install with cache clean
      console.log('Trying installation method 2...');
      execSync('npm cache clean --force && npm install --save-dev vite', { stdio: 'inherit' });
      return true;
    } catch (e2) {
      try {
        // Method 3: Install globally as last resort
        console.log('Trying global installation...');
        execSync('npm install -g vite', { stdio: 'inherit' });
        return true;
      } catch (e3) {
        console.error('❌ All installation methods failed');
        return false;
      }
    }
  }
}

// Update package.json if needed
const packageUpdated = ensureViteInPackageJson();
if (packageUpdated) {
  console.log('Installing dependencies after updating package.json...');
  try {
    execSync('npm install', { stdio: 'inherit' });
  } catch (e) {
    console.error('⚠️ Failed to run npm install, will try alternative methods');
  }
}

// Local vite path
const localVitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');

// Main function to start vite
function startVite() {
  console.log('====================================');
  console.log('Starting Vite Development Server...');
  console.log('====================================');
  
  // Check if local vite exists
  if (fs.existsSync(localVitePath)) {
    console.log('✅ Found local Vite installation, using it...');
    const viteProcess = spawn(process.platform === 'win32' ? localVitePath : 'node_modules/.bin/vite', [], {
      stdio: 'inherit',
      shell: true
    });
    
    viteProcess.on('error', (err) => {
      console.error('❌ Failed to start local Vite:', err.message);
      tryAlternativeMethods();
    });
    
    return;
  }
  
  // Try to install vite if not found
  console.log('⚠️ Local Vite not found, installing...');
  if (installVite()) {
    // Check again after installation
    if (fs.existsSync(localVitePath)) {
      console.log('✅ Vite installed successfully, starting server...');
      const viteProcess = spawn(process.platform === 'win32' ? localVitePath : 'node_modules/.bin/vite', [], {
        stdio: 'inherit',
        shell: true
      });
      
      return;
    }
  }
  
  // If installation didn't work, try alternatives
  tryAlternativeMethods();
}

function tryAlternativeMethods() {
  // Try using npx vite
  if (commandExists('npx')) {
    console.log('Trying npx vite...');
    const npxProcess = spawn('npx', ['vite'], {
      stdio: 'inherit',
      shell: true
    });
    
    npxProcess.on('error', (err) => {
      console.error('❌ Failed to start with npx:', err.message);
      tryNpmRunDev();
    });
    
    return;
  }
  
  tryNpmRunDev();
}

function tryNpmRunDev() {
  // Try using npm run dev as last resort
  console.log('Trying npm run dev...');
  const npmProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });
  
  npmProcess.on('error', (err) => {
    console.error('❌ All methods failed. Please try these manual steps:');
    console.log('1. Run: npm install -g vite');
    console.log('2. Run: npm install --save-dev vite');
    console.log('3. Run: npx vite');
    process.exit(1);
  });
}

// Start the main process
startVite();
