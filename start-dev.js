
#!/usr/bin/env node

// Enhanced script to run Vite with better error handling and installation
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("====================================");
console.log("Starting SpeechHelp Development Server");
console.log("====================================");

// Function to check if Vite is installed at all
function checkViteInstallation() {
  try {
    // Check if package.json exists
    if (!fs.existsSync('package.json')) {
      console.error('❌ package.json not found. Are you in the correct directory?');
      return false;
    }

    // Check if vite is in package.json dependencies or devDependencies
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const hasViteInDeps = packageJson.dependencies?.vite || packageJson.devDependencies?.vite;
    
    if (!hasViteInDeps) {
      console.log('⚠️ Vite is not listed in package.json dependencies');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error checking Vite installation:', error.message);
    return false;
  }
}

// Function to check if vite is accessible via npx or locally
function findVitePath() {
  // Check for local installation in node_modules
  const localVitePath = process.platform === 'win32' 
    ? path.join(process.cwd(), 'node_modules', '.bin', 'vite.cmd') 
    : path.join(process.cwd(), 'node_modules', '.bin', 'vite');
    
  if (fs.existsSync(localVitePath)) {
    return { type: 'local', path: localVitePath };
  }
  
  // Check for global installation using npx
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

// Try to install vite packages
function installVite() {
  console.log('📦 Installing Vite packages...');
  
  try {
    console.log('Installing vite...');
    execSync('npm install vite@latest --save-dev', { stdio: 'inherit' });
    console.log('Installing @vitejs/plugin-react-swc...');
    execSync('npm install @vitejs/plugin-react-swc --save-dev', { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('❌ Failed to install Vite packages:', error.message);
    return false;
  }
}

// Try to run vite with multiple approaches
function runVite() {
  if (!checkViteInstallation()) {
    if (!installVite()) {
      showFailureMessage();
      return;
    }
  }
  
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
      
      viteProcess.on('error', (err) => {
        console.log("⚠️ Error running Vite, trying alternatives...", err.message);
        tryBackupMethods();
      });
      
      return;
    } catch (error) {
      console.error("⚠️ Failed to start with found method:", error.message);
    }
  } else {
    console.log("⚠️ Vite not found, installing now...");
    if (installVite()) {
      console.log("✅ Installation complete, trying again...");
      // Try running again after installation
      const newViteAccess = findVitePath();
      if (newViteAccess) {
        runWithPath(newViteAccess);
        return;
      }
    }
  }
  
  // If direct run failed, try alternative methods
  tryBackupMethods();
}

// Run with a specific path
function runWithPath(viteAccess) {
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
  } catch (error) {
    console.error("⚠️ Failed to start with path:", error.message);
    tryBackupMethods();
  }
}

// Backup methods to run vite
function tryBackupMethods() {
  try {
    console.log("🔄 Trying with npx vite...");
    const npxPath = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const npxProcess = spawn(npxPath, ['vite'], { stdio: 'inherit', shell: true });
    
    npxProcess.on('error', (err) => {
      console.log("⚠️ Error with npx vite:", err.message);
      tryLastResort();
    });
  } catch (error) {
    console.error("⚠️ Failed with npx approach:", error.message);
    tryLastResort();
  }
}

// Last resort methods
function tryLastResort() {
  console.error("❌ Standard methods failed. Trying last resort approaches...");
  
  // Try using the local run-vite.js script
  if (fs.existsSync('./run-vite.js')) {
    console.log("🔄 Trying with local runner script...");
    try {
      const localRunnerProcess = spawn('node', ['run-vite.js'], { stdio: 'inherit', shell: true });
      
      localRunnerProcess.on('error', (err) => {
        console.log("⚠️ Error with local runner:", err.message);
        tryGlobalInstall();
      });
      
      return;
    } catch (e) {
      console.log("⚠️ Local runner failed:", e.message);
    }
  } else {
    // Create a run-vite.js file
    console.log("📝 Creating local runner script...");
    createLocalViteRunner();
    console.log("🔄 Trying with new local runner script...");
    try {
      const localRunnerProcess = spawn('node', ['run-vite.js'], { stdio: 'inherit', shell: true });
      
      localRunnerProcess.on('error', (err) => {
        console.log("⚠️ Error with new local runner:", err.message);
        tryGlobalInstall();
      });
      
      return;
    } catch (e) {
      console.log("⚠️ New local runner failed:", e.message);
    }
  }
  
  tryGlobalInstall();
}

// Function to create a local vite runner script
function createLocalViteRunner() {
  try {
    // Create a simple JS script that runs vite with node
    const runViteScript = `#!/usr/bin/env node

// Simple script to run vite from node_modules
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Find the path to local vite executable
const isWindows = process.platform === 'win32';
const vitePath = path.resolve(__dirname, 'node_modules', '.bin', isWindows ? 'vite.cmd' : 'vite');

if (fs.existsSync(vitePath)) {
  console.log('✅ Found local Vite at:', vitePath);
  const viteProcess = spawn(vitePath, process.argv.slice(2), { 
    stdio: 'inherit',
    shell: true
  });

  viteProcess.on('error', (err) => {
    console.error('❌ Failed to start vite:', err);
    process.exit(1);
  });
} else {
  console.log('⚠️ Local Vite not found, trying with npx...');
  const npxPath = isWindows ? 'npx.cmd' : 'npx';
  const npxProcess = spawn(npxPath, ['vite', ...process.argv.slice(2)], {
    stdio: 'inherit',
    shell: true
  });
  
  npxProcess.on('error', (err) => {
    console.error('❌ Failed to start with npx:', err);
    process.exit(1);
  });
}
`;

    fs.writeFileSync('run-vite.js', runViteScript);
    
    // Make it executable on Unix systems
    if (process.platform !== 'win32') {
      try {
        execSync('chmod +x run-vite.js', { stdio: 'inherit' });
      } catch (e) {
        console.log("⚠️ Could not make script executable:", e.message);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to create local vite runner:', error.message);
    return false;
  }
}

// Try with global installation as absolute last resort
function tryGlobalInstall() {
  try {
    // Try to use global vite if installed
    console.log("🔄 Attempting global installation as last resort...");
    execSync('npm install -g vite', { stdio: 'inherit' });
    
    const globalViteProcess = spawn('vite', [], { stdio: 'inherit', shell: true });
    globalViteProcess.on('error', (err) => {
      console.log("⚠️ Error with global vite:", err.message);
      showFailureMessage();
    });
  } catch (error) {
    console.error("❌ Global installation failed:", error.message);
    showFailureMessage();
  }
}

// Show failure message with manual instructions
function showFailureMessage() {
  console.error("\n❌ All attempts failed. Please try these commands manually:");
  console.log("1. npm install");
  console.log("2. npm install vite@latest --save-dev @vitejs/plugin-react-swc --save-dev");
  console.log("3. npx vite");
  console.log("\nAlternatively, try:");
  console.log("node run-vite.js");
  process.exit(1);
}

// Start the process
runVite();
