
#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to install vite with multiple fallbacks and verification
function installVite() {
  console.log('📦 Installing Vite...');
  
  // First check if vite is already installed in node_modules
  const localVitePath = process.platform === 'win32' 
    ? path.join(process.cwd(), 'node_modules', '.bin', 'vite.cmd') 
    : path.join(process.cwd(), 'node_modules', '.bin', 'vite');
    
  if (fs.existsSync(localVitePath)) {
    console.log('✅ Vite is already installed locally');
    return true;
  }
  
  // Try different installation methods
  const installMethods = [
    'npm install vite@latest --save-dev',  // Install as dev dependency (preferred)
    'npm install vite@latest --no-save',   // Quick installation without saving
    'npm install --save-dev vite@latest --no-audit --no-fund',  // More options
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
  
  // Try to install @vitejs/plugin-react-swc as well, since it's needed
  try {
    console.log('📦 Installing @vitejs/plugin-react-swc...');
    execSync('npm install @vitejs/plugin-react-swc --save-dev', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ Failed to install @vitejs/plugin-react-swc');
  }
  
  return false;
}

// Make scripts executable on Unix-like systems
function makeExecutable() {
  if (process.platform !== 'win32') {
    try {
      console.log('🔐 Making scripts executable...');
      execSync('chmod +x start-dev.sh start-dev.js run-vite.js', { stdio: 'inherit' });
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

// Create a local vite runner script for compatibility
function createLocalViteRunner() {
  try {
    console.log('📝 Creating local vite runner script...');
    
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
      execSync('chmod +x run-vite.js', { stdio: 'inherit' });
    }
    
    console.log('✅ Local vite runner script created');
    return true;
  } catch (error) {
    console.error('❌ Failed to create local vite runner:', error.message);
    return false;
  }
}

// Main function
function main() {
  console.log('====================================');
  console.log('Setting up SpeechHelp development environment');
  console.log('====================================');
  
  const viteInstalled = installVite();
  const localRunnerCreated = createLocalViteRunner();
  const scriptsExecutable = makeExecutable();
  
  console.log('\nSetup summary:');
  console.log(`- Vite installation: ${viteInstalled ? '✅ Success' : '⚠️ Partial or failed'}`);
  console.log(`- Local runner: ${localRunnerCreated ? '✅ Success' : '❌ Failed'}`);
  console.log(`- Scripts executable: ${scriptsExecutable ? '✅ Success' : '⚠️ Warning - may need manual chmod'}`);
  
  console.log('\n====================================');
  console.log('Next steps:');
  if (process.platform === 'win32') {
    console.log('1. Run: node start-dev.js');
    console.log('   OR: node run-vite.js');
  } else {
    console.log('1. Run: ./start-dev.sh');
    console.log('   OR: node start-dev.js');
    console.log('   OR: ./run-vite.js');
  }
  console.log('====================================');
}

main();
