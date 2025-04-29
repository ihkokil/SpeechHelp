
#!/usr/bin/env node

// This script helps run the locally installed Vite with improved error handling
const { spawn, execSync, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

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
    return null;
  }
}

// Function to run a command asynchronously
function runCommandAsync(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

// Ensure Vite is installed
async function ensureViteInstalled() {
  console.log('Checking Vite installation...');
  
  // Check if vite is installed
  if (!isPackageInstalled('vite')) {
    console.log('Vite not found in node_modules. Installing vite and plugin-react-swc...');
    
    try {
      console.log('Installing Vite...');
      execSync('npm install vite@latest @vitejs/plugin-react-swc@latest --save-dev', { stdio: 'inherit' });
      console.log('Vite and dependencies installed successfully');
      return true;
    } catch (err) {
      console.error('Failed to install vite:', err.message);
      
      try {
        console.log('Trying alternative installation method...');
        execSync('npm install vite --save-dev', { stdio: 'inherit' });
        console.log('Vite installed successfully with alternative method');
        return true;
      } catch (innerErr) {
        console.error('All installation attempts failed:', innerErr.message);
        return false;
      }
    }
  } else {
    console.log('Vite is already installed.');
    return true;
  }
}

// Check Node.js version
function checkNodeVersion() {
  try {
    const nodeVersion = process.version;
    console.log(`Using Node.js ${nodeVersion}`);
    
    // Extract major version number
    const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0], 10);
    
    if (majorVersion < 14) {
      console.warn('Warning: Vite requires Node.js version 14 or above. You are using version ' + majorVersion);
    }
    
    return true;
  } catch (err) {
    console.error('Error checking Node.js version:', err.message);
    return false;
  }
}

// Main function to start the dev server
async function startDevServer() {
  console.log('Starting development server...');
  
  // Check Node.js version
  checkNodeVersion();
  
  // Install Vite if needed
  const viteReady = await ensureViteInstalled();
  if (!viteReady) {
    console.error('Could not ensure Vite installation. Trying to continue anyway...');
  }

  // Try different methods to find and run vite
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
  
  // Method 2: Try using npx vite
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
  
  // Method 3: Try using npm run directly
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
  
  // Method 4: Try using globally installed vite
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

  // Method 5: Try using node API as last resort
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
}

// Start the development server
startDevServer().catch(err => {
  console.error('Unhandled error:', err.message);
  process.exit(1);
});

