
#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to install vite with multiple fallbacks
function installVite() {
  console.log('📦 Installing Vite...');
  
  // Try different installation methods
  const installMethods = [
    'npm install vite@latest --no-save',
    'npm install --save-dev vite@latest --no-audit --no-fund',
    'npx vite@latest --no-install',
    'npm install -g vite'  // Global install as last resort
  ];
  
  for (const method of installMethods) {
    try {
      console.log(`🔄 Trying: ${method}`);
      execSync(method, { stdio: 'inherit' });
      
      // Check if installation worked by looking for vite binary
      const npxPath = process.platform === 'win32' ? 'npx.cmd' : 'npx';
      try {
        execSync(`${npxPath} vite --version`, { stdio: 'pipe' });
        console.log('✅ Vite is now accessible');
        return true;
      } catch (e) {
        console.log('⚠️ Vite installation method worked but vite command not available yet');
      }
    } catch (error) {
      console.log(`⚠️ Method failed: ${method}`);
    }
  }
  
  return false;
}

// Make scripts executable on Unix-like systems
function makeExecutable() {
  if (process.platform !== 'win32') {
    try {
      console.log('🔐 Making scripts executable...');
      execSync('chmod +x start-dev.sh', { stdio: 'inherit' });
      console.log('✅ Scripts are now executable');
      return true;
    } catch (error) {
      console.error('❌ Failed to make scripts executable:', error.message);
    }
  } else {
    console.log('✅ On Windows - no need to make scripts executable');
    return true;
  }
  return false;
}

// Main function
function main() {
  console.log('====================================');
  console.log('Setting up SpeechHelp development environment');
  console.log('====================================');
  
  const viteInstalled = installVite();
  const scriptsExecutable = makeExecutable();
  
  console.log('\nSetup summary:');
  console.log(`- Vite installation: ${viteInstalled ? '✅ Success' : '❌ Failed'}`);
  console.log(`- Scripts executable: ${scriptsExecutable ? '✅ Success' : '❌ Failed'}`);
  
  console.log('\n====================================');
  console.log('Next steps:');
  if (process.platform === 'win32') {
    console.log('1. Run: node start-dev.js');
  } else {
    console.log('1. Run: ./start-dev.sh  OR  node start-dev.js');
  }
  console.log('====================================');
}

main();
