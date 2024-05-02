
#!/usr/bin/env node

// This script helps run the locally installed Vite with improved error handling
const { spawn, execSync, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

console.log('Vite Startup Helper - Emergency Fallback Mode');

// Function to check if a package is installed
function isPackageInstalled(packageName) {
  try {
    require.resolve(packageName);
    return true;
  } catch (e) {
    return false;
  }
}

// Function to run a command and return its output
function runCommand(command) {
  try {
    return execSync(command, { stdio: 'pipe' }).toString().trim();
  } catch (e) {
    console.error(`Error running command: ${command}`);
    console.error(e.message);
    return null;
  }
}

// First, try to fix potential issues
console.log('Checking environment and fixing potential issues...');

// Check Node.js version
const nodeVersion = process.version;
console.log(`Using Node.js ${nodeVersion}`);
    
// Extract major version number
const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0], 10);
    
if (majorVersion < 14) {
  console.warn('Warning: Vite requires Node.js version 14 or above. You are using version ' + majorVersion);
  console.warn('Please update your Node.js version for best results.');
}

// Ensure Vite is installed
console.log('Verifying Vite installation...');
if (!isPackageInstalled('vite')) {
  console.log('Vite not found in node_modules. Installing vite and plugin-react-swc...');
  
  try {
    console.log('Installing Vite locally...');
    execSync('npm install vite@latest @vitejs/plugin-react-swc@latest --save-dev', { stdio: 'inherit' });
    console.log('Vite and dependencies installed successfully');
  } catch (err) {
    console.error('Failed to install vite locally:', err.message);
    
    try {
      console.log('Trying to install Vite globally...');
      execSync('npm install -g vite', { stdio: 'inherit' });
      console.log('Vite installed globally as fallback');
    } catch (globalErr) {
      console.error('All installation attempts failed:', globalErr.message);
      console.error('Please run "npm install vite --save-dev" manually.');
    }
  }
} else {
  console.log('Vite is already installed.');
}

// Create a direct link to the current node_modules/.bin/vite file in the project root
try {
  console.log('Creating direct access to Vite executable...');
  const isWin = process.platform === 'win32';
  const viteSourcePath = path.join(process.cwd(), 'node_modules', '.bin', isWin ? 'vite.cmd' : 'vite');
  const viteDestPath = path.join(process.cwd(), isWin ? 'vite.cmd' : 'vite-local');
  
  if (fs.existsSync(viteSourcePath)) {
    fs.copyFileSync(viteSourcePath, viteDestPath);
    if (!isWin) {
      fs.chmodSync(viteDestPath, 0o755);
    }
    console.log('Created direct access to Vite at:', viteDestPath);
  } else {
    console.log('Could not find Vite executable in node_modules/.bin');
  }
} catch (err) {
  console.error('Failed to create direct access to Vite:', err.message);
}

// Try different methods to find and run vite
console.log('Starting development server - attempting multiple methods...');
let viteProcess;
let success = false;

// Method 1: Try using local vite path
if (!success) {
  try {
    // Determine the correct path to vite binary based on platform
    const binExtension = process.platform === 'win32' ? '.cmd' : '';
    const vitePath = path.join(process.cwd(), 'node_modules', '.bin', 'vite' + binExtension);
    
    if (fs.existsSync(vitePath)) {
      console.log('Starting Vite using local path:', vitePath);
      viteProcess = spawn(vitePath, process.argv.slice(2), { 
        stdio: 'inherit',
        shell: true
      });
      success = true;
    } else {
      console.log('Local Vite executable not found at:', vitePath);
    }
  } catch (err) {
    console.log('Error starting Vite from local path:', err.message);
  }
}

// Method 2: Try using the direct local copy we created
if (!success) {
  try {
    const directVitePath = process.platform === 'win32' ? 'vite.cmd' : './vite-local';
    if (fs.existsSync(directVitePath)) {
      console.log('Starting Vite using direct local copy:', directVitePath);
      viteProcess = spawn(directVitePath, process.argv.slice(2), { 
        stdio: 'inherit',
        shell: true
      });
      success = true;
    }
  } catch (err) {
    console.log('Error starting Vite from direct local copy:', err.message);
  }
}

// Method 3: Try using npx vite
if (!success) {
  try {
    console.log('Attempting to start Vite using npx...');
    viteProcess = spawn('npx', ['vite', ...process.argv.slice(2)], { 
      stdio: 'inherit',
      shell: true
    });
    success = true;
  } catch (err) {
    console.log('Error starting Vite using npx:', err.message);
  }
}

// Method 4: Try using npm run directly
if (!success) {
  try {
    console.log('Attempting to start Vite using npm run...');
    viteProcess = spawn('npm', ['run', 'dev'], { 
      stdio: 'inherit',
      shell: true
    });
    success = true;
  } catch (err) {
    console.log('Error starting Vite using npm run:', err.message);
  }
}

// Method 5: Try using globally installed vite
if (!success) {
  try {
    console.log('Attempting to start Vite using global installation...');
    viteProcess = spawn('vite', process.argv.slice(2), { 
      stdio: 'inherit',
      shell: true
    });
    success = true;
  } catch (err) {
    console.log('Error starting Vite from global installation:', err.message);
  }
}

// Method 6: Try using node API as last resort
if (!success) {
  try {
    console.log('Attempting to start Vite using Node API...');
    // Use require to run vite programmatically
    const viteModule = require('vite');
    viteModule.createServer().then(server => {
      console.log('Vite server started via Node API');
      server.listen();
    });
    return; // Exit function if this method works
  } catch (err) {
    console.error('All methods to start Vite failed:', err.message);
    
    // One final fallback attempt: direct npm install + run
    try {
      console.log('Final attempt: Installing dependencies and starting Vite...');
      execSync('npm install', { stdio: 'inherit' });
      execSync('npm install vite @vitejs/plugin-react-swc --save-dev', { stdio: 'inherit' });
      execSync('npx vite', { stdio: 'inherit' });
      return;
    } catch (finalErr) {
      console.error('All attempts to start Vite have failed.');
      console.error('Please try running "npm install" followed by "npm run dev" manually.');
      process.exit(1);
    }
  }
}

// Handle process events for spawned processes
if (viteProcess) {
  viteProcess.on('error', (err) => {
    console.error('Failed to start Vite:', err.message);
    process.exit(1);
  });

  viteProcess.on('close', (code) => {
    process.exit(code);
  });
}
