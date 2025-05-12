
// #!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Checking Vite installation...');

function runCommand(command) {
  try {
    return execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

// Check if vite is installed globally
let viteInstalled = false;
try {
  execSync('vite --version', { stdio: 'ignore' });
  viteInstalled = true;
  console.log('Vite is installed globally.');
} catch (e) {
  console.log('Vite is not installed globally.');
}

if (!viteInstalled) {
  // Check if vite is in node_modules
  const viteLocalPath = path.join(__dirname, 'node_modules', '.bin', 'vite');
  const viteExists = fs.existsSync(viteLocalPath);
  
  if (!viteExists) {
    console.log('Installing vite locally...');
    runCommand('npm install --save-dev vite@latest');
    console.log('Vite installed successfully.');
  } else {
    console.log('Vite is already installed locally.');
  }
}

// Update package.json if needed
const packageJsonPath = path.join(__dirname, 'package.json');
let packageJson;

try {
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
  packageJson = JSON.parse(packageJsonContent);
  
  // Check if dev:ensure script exists
  if (!packageJson.scripts || !packageJson.scripts['dev:ensure']) {
    console.log('Adding dev:ensure script to package.json...');
    
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    packageJson.scripts['dev:ensure'] = 'node ensure-vite.js && npx vite';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Added dev:ensure script to package.json');
  }
} catch (error) {
  console.error('Error working with package.json:', error);
}

// Run the dev server
console.log('Starting Vite development server...');
runCommand('npx vite');
