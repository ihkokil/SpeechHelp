
#!/usr/bin/env node

// This script helps run the locally installed Vite
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

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

// Check if vite needs to be installed
function ensureViteInstalled() {
  const localVitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
  
  if (!fs.existsSync(localVitePath)) {
    console.log('⚠️ Vite not found locally. Installing vite...');
    try {
      // Try with --no-audit for faster installation
      execSync('npm install --save-dev vite@latest --no-audit', { stdio: 'inherit' });
      
      if (fs.existsSync(localVitePath)) {
        console.log('✅ Vite installed successfully.');
        return true;
      }
      
      // Try alternative method if first method failed
      console.log('⚠️ First installation method failed. Trying alternative method...');
      execSync('npm install --save-dev vite', { stdio: 'inherit' });
      
      return fs.existsSync(localVitePath);
    } catch (err) {
      console.error('❌ Failed to install Vite:', err.message);
      return false;
    }
  }
  return true;
}

// Try to find the local vite executable
const localVitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');

function startVite() {
  console.log('Starting development server...');
  
  // First, make sure Vite is installed
  if (ensureViteInstalled()) {
    // Now check if local Vite exists (it should after ensureViteInstalled)
    if (fs.existsSync(localVitePath)) {
      console.log('✅ Using locally installed Vite...');
      const viteProcess = spawn(process.platform === 'win32' ? localVitePath : 'node_modules/.bin/vite', process.argv.slice(2), { 
        stdio: 'inherit',
        shell: true
      });
      
      viteProcess.on('error', (err) => {
        console.error('❌ Failed to start local Vite:', err);
        tryNpxVite();
      });
      
      viteProcess.on('close', (code) => {
        if (code !== 0) {
          console.log(`⚠️ Local Vite exited with code ${code}, trying alternatives...`);
          tryNpxVite();
        } else {
          process.exit(code);
        }
      });
      
    } else {
      // This shouldn't happen if ensureViteInstalled worked
      console.error('⚠️ Something went wrong with Vite installation, trying alternatives...');
      tryNpxVite();
    }
  } else {
    // If local Vite doesn't exist, try alternatives
    tryNpxVite();
  }
}

function tryNpxVite() {
  // Try using npx vite
  if (commandExists('npx')) {
    console.log('Trying npx vite...');
    const npxProcess = spawn('npx', ['vite', ...process.argv.slice(2)], {
      stdio: 'inherit',
      shell: true
    });
    
    npxProcess.on('error', (err) => {
      console.error('❌ Failed to start with npx:', err);
      tryNpmRunDev();
    });
    
    npxProcess.on('close', (code) => {
      if (code !== 0) {
        console.log(`⚠️ npx vite exited with code ${code}, trying npm run dev...`);
        tryNpmRunDev();
      } else {
        process.exit(code);
      }
    });
  } else {
    tryNpmRunDev();
  }
}

function tryNpmRunDev() {
  // Try using npm run dev as last resort
  console.log('Trying npm run dev...');
  const npmProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });
  
  npmProcess.on('error', (err) => {
    console.error('❌ Failed to start with npm run dev:', err);
    console.error('Could not start development server. Please try the following steps manually:');
    console.log('1. Run: npm install -g vite');
    console.log('2. Run: npm install --save-dev vite');
    console.log('3. Run: npx vite');
    process.exit(1);
  });
  
  npmProcess.on('close', (code) => {
    process.exit(code);
  });
}

// Start the main process
console.log('====================================');
console.log('Vite Development Server Launcher');
console.log('====================================');
startVite();
