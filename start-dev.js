
#!/usr/bin/env node

// Simplified script focused on running Vite with proper error handling
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("====================================");
console.log("Starting SpeechHelp Development Server");
console.log("====================================");

// Function to check if a command exists
function commandExists(command) {
  try {
    const isWin = process.platform === 'win32';
    const cmd = isWin ? 'where' : 'which';
    execSync(`${cmd} ${command}`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Get local vite path
function getLocalVitePath() {
  const isWin = process.platform === 'win32';
  const vitePath = path.join(process.cwd(), 'node_modules', '.bin', isWin ? 'vite.cmd' : 'vite');
  return fs.existsSync(vitePath) ? vitePath : null;
}

// Try to start vite in different ways
async function startVite() {
  // Method 1: Local installation in node_modules
  const localVitePath = getLocalVitePath();
  if (localVitePath) {
    console.log("✅ Found local Vite installation, starting server...");
    const viteProcess = spawn(localVitePath, [], { stdio: 'inherit', shell: true });
    await new Promise((resolve) => {
      viteProcess.on('close', (code) => {
        if (code !== 0) {
          console.log(`⚠️ Vite exited with code ${code}`);
        }
        resolve();
      });
    });
    return true;
  }

  // Method 2: Try with npx
  if (commandExists('npx')) {
    console.log("✅ Using npx to run Vite...");
    try {
      const npxProcess = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });
      await new Promise((resolve) => {
        npxProcess.on('close', (code) => {
          if (code !== 0) {
            console.log(`⚠️ npx vite exited with code ${code}`);
          }
          resolve();
        });
      });
      return true;
    } catch (error) {
      console.log("⚠️ Error running npx vite:", error.message);
    }
  }

  // Method 3: Install and run
  console.log("⚠️ Vite not found, attempting to install...");
  try {
    if (commandExists('npm')) {
      execSync('npm install vite@latest --save-dev @vitejs/plugin-react-swc --save-dev', { stdio: 'inherit' });
      
      // Check if installation worked
      const newVitePath = getLocalVitePath();
      if (newVitePath) {
        console.log("✅ Vite installed successfully, starting server...");
        const viteProcess = spawn(newVitePath, [], { stdio: 'inherit', shell: true });
        await new Promise((resolve) => {
          viteProcess.on('close', (code) => resolve());
        });
        return true;
      }
    }
  } catch (error) {
    console.log("⚠️ Error installing Vite:", error.message);
  }

  return false;
}

// Main function
async function main() {
  const success = await startVite();
  
  if (!success) {
    console.error("\n❌ All attempts to run Vite failed.");
    console.log("\nPlease try running: node install-vite.js");
    console.log("Then try starting the development server again.");
    process.exit(1);
  }
}

main();
