
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

// Main function to start the dev server
async function startDevServer() {
  console.log('Starting development server...');
  
  // Check if vite is installed
  if (!isPackageInstalled('vite')) {
    console.log('Vite not found in node_modules. Installing vite...');
    try {
      execSync('npm install vite@latest', { stdio: 'inherit' });
      console.log('Vite installed successfully');
    } catch (err) {
      console.error('Failed to install vite:', err);
      process.exit(1);
    }
  }

  // Try different methods to find and run vite
  let viteProcess;
  
  // Method 1: Try using local vite path
  try {
    const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
    if (fs.existsSync(vitePath)) {
      console.log('Starting Vite using local path...');
      viteProcess = spawn(vitePath, process.argv.slice(2), { 
        stdio: 'inherit',
        shell: true
      });
    } else {
      throw new Error('Local Vite executable not found');
    }
  } catch (err) {
    console.log('Could not start Vite using local path, trying alternative methods...');
    
    // Method 2: Try using npx
    try {
      console.log('Starting Vite using npx...');
      viteProcess = spawn('npx', ['vite', ...process.argv.slice(2)], { 
        stdio: 'inherit',
        shell: true
      });
    } catch (err) {
      console.log('Could not start Vite using npx, trying node API...');
      
      // Method 3: Try using node API
      try {
        console.log('Starting Vite using Node API...');
        // Use require to run vite programmatically
        require('vite').createServer().then(server => server.listen());
        return; // Exit function if this method works
      } catch (err) {
        console.error('All methods to start Vite failed:', err);
        process.exit(1);
      }
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
