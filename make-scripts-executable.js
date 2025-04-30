
#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to install vite with multiple fallbacks
function installVite() {
  console.log('Installing Vite...');
  
  // Try different installation methods
  const installMethods = [
    'npm install --save-dev vite@latest --no-audit --no-fund',
    'npm install --save-dev vite@latest',
    'npm cache clean --force && npm install --save-dev vite@latest',
    'npm install -g vite'  // Global install as last resort
  ];
  
  for (const method of installMethods) {
    try {
      console.log(`Trying: ${method}`);
      execSync(method, { stdio: 'inherit' });
      
      // Check if installation worked
      if (fs.existsSync(path.join(__dirname, 'node_modules', '.bin', 'vite'))) {
        console.log('✅ Vite installed successfully!');
        return true;
      }
    } catch (error) {
      console.log(`⚠️ Method failed: ${method}`);
    }
  }
  
  return false;
}

// Update package.json with required scripts
function updatePackageJson() {
  try {
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      console.log('Updating package.json...');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Ensure scripts section exists
      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }
      
      // Update scripts
      packageJson.scripts.dev = 'vite';
      packageJson.scripts.build = 'vite build';
      packageJson.scripts.preview = 'vite preview';
      
      // Add vite to dev dependencies if not present
      if (!packageJson.devDependencies) {
        packageJson.devDependencies = {};
      }
      if (!packageJson.devDependencies.vite) {
        packageJson.devDependencies.vite = "^5.0.0";
      }
      
      // Write updated package.json
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('✅ package.json updated successfully');
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to update package.json:', error.message);
  }
  return false;
}

// Make scripts executable on Unix-like systems
function makeExecutable() {
  if (process.platform !== 'win32') {
    try {
      console.log('Making scripts executable...');
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
  const packageUpdated = updatePackageJson();
  const scriptsExecutable = makeExecutable();
  
  console.log('\nSetup summary:');
  console.log(`- Vite installation: ${viteInstalled ? '✅ Success' : '❌ Failed'}`);
  console.log(`- Package.json update: ${packageUpdated ? '✅ Success' : '❌ Failed'}`);
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
