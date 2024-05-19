
#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to install vite if it's not available
function installViteIfNeeded() {
  try {
    console.log('Checking for vite installation...');
    // Check if vite is installed locally
    if (!fs.existsSync(path.join(__dirname, 'node_modules', '.bin', 'vite'))) {
      console.log('Vite not found in node_modules. Installing vite locally...');
      execSync('npm install vite@latest --save-dev --no-audit', { stdio: 'inherit' });
      
      // Verify installation worked
      if (fs.existsSync(path.join(__dirname, 'node_modules', '.bin', 'vite'))) {
        console.log('✅ Vite installed successfully.');
      } else {
        console.log('⚠️ Vite installation verification failed. Trying alternative method...');
        execSync('npm install --save-dev vite', { stdio: 'inherit' });
      }
    } else {
      console.log('✅ Vite already installed in node_modules.');
    }
  } catch (error) {
    console.error('❌ Failed to install vite:', error.message);
    console.log('Please install vite manually with "npm install vite --save-dev"');
  }
}

// Make the script executable on Unix-like systems
function makeExecutable() {
  try {
    if (process.platform !== 'win32') {
      console.log('Making scripts executable...');
      execSync('chmod +x start-dev.sh', { stdio: 'inherit' });
      console.log('✅ Scripts are now executable.');
    }
  } catch (error) {
    console.error('❌ Failed to make scripts executable:', error.message);
    console.log('You may need to run: chmod +x start-dev.sh');
  }
}

// Check if package.json has vite in dependencies or devDependencies
function validatePackageJson() {
  try {
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const hasDev = packageJson.devDependencies && packageJson.devDependencies.vite;
      const hasDep = packageJson.dependencies && packageJson.dependencies.vite;
      
      if (!hasDev && !hasDep) {
        console.log('⚠️ Vite not found in package.json. Adding to devDependencies...');
        // Add vite to devDependencies using npm
        execSync('npm install --save-dev vite@latest', { stdio: 'inherit' });
      }
    }
  } catch (error) {
    console.error('❌ Failed to validate package.json:', error.message);
  }
}

// Main function
function main() {
  console.log('====================================');
  console.log('Setting up development environment...');
  console.log('====================================');
  validatePackageJson();
  installViteIfNeeded();
  makeExecutable();
  console.log('');
  console.log('Setup complete. You can now run:');
  if (process.platform === 'win32') {
    console.log('  node start-dev.js');
  } else {
    console.log('  ./start-dev.sh  OR  node start-dev.js');
  }
  console.log('');
  console.log('If you encounter any issues, try running:');
  console.log('  npm install --save-dev vite@latest');
  console.log('  npx vite');
  console.log('====================================');
}

main();
