
#!/usr/bin/env node

// This script helps run the locally installed Vite with improved error handling
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to check if a package is installed
function isPackageInstalled(packageName) {
  try {
    // Try to resolve the package from node_modules
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

// Ensure Vite is installed
async function ensureViteInstalled() {
  try {
    console.log('Checking Vite installation...');
    
    // Check if vite is installed
    if (!isPackageInstalled('vite')) {
      console.log('Vite not found in node_modules. Installing vite...');
      try {
        execSync('npm install vite@latest @vitejs/plugin-react-swc@latest', { stdio: 'inherit' });
        console.log('Vite installed successfully');
      } catch (err) {
        console.error('Failed to install vite:', err);
        throw new Error('Failed to install Vite');
      }
    } else {
      console.log('Vite is already installed.');
    }
    
    return true;
  } catch (err) {
    console.error('Error ensuring Vite installation:', err);
    return false;
  }
}

// Main function to start the dev server
async function startDevServer() {
  console.log('Starting development server...');
  
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
      const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
      if (fs.existsSync(vitePath)) {
        console.log('Starting Vite using local path...');
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
  
  // Method 3: Try using globally installed vite
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

  // Method 4: Try using node API as last resort
  if (!success) {
    try {
      console.log('Attempting to start Vite using Node API...');
      // Use require to run vite programmatically
      require('vite').createServer().then(server => server.listen());
      return; // Exit function if this method works
    } catch (err) {
      console.error('All methods to start Vite failed:', err);
      process.exit(1);
    }
  }

  // Handle process events for spawned processes
  if (viteProcess) {
    viteProcess.on('error', (err) => {
      console.error('Failed to start Vite:', err);
      process.exit(1);
    });

    viteProcess.on('close', (code) => {
      process.exit(code);
    });
  }
}

// Start the development server
startDevServer().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
