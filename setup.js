
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('Setting up the development environment...');

function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Create necessary directories if they don't exist
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
const nodeModulesBinPath = path.join(nodeModulesPath, '.bin');

if (!fs.existsSync(nodeModulesPath)) {
  fs.mkdirSync(nodeModulesPath, { recursive: true });
}

if (!fs.existsSync(nodeModulesBinPath)) {
  fs.mkdirSync(nodeModulesBinPath, { recursive: true });
}

// Clear npm cache to avoid any corruption issues
console.log('Clearing npm cache...');
runCommand('npm cache clean --force');

// Ensure dependencies are installed properly
console.log('Installing dependencies...');
runCommand('npm install');

// Make sure Vite is installed both locally and globally
console.log('Ensuring Vite is installed locally...');
runCommand('npm install vite@latest @vitejs/plugin-react-swc@latest --save-dev');

// Try to install Vite globally as a fallback
console.log('Installing Vite globally as a fallback...');
runCommand('npm install -g vite');

// Create a direct executable copy of vite to work around PATH issues
console.log('Creating direct access to Vite executable...');
const isWin = process.platform === 'win32';
const viteSourcePath = path.join(process.cwd(), 'node_modules', '.bin', isWin ? 'vite.cmd' : 'vite');
const viteDestPath = path.join(process.cwd(), isWin ? 'vite-direct.cmd' : 'vite-direct');

try {
  if (fs.existsSync(viteSourcePath)) {
    fs.copyFileSync(viteSourcePath, viteDestPath);
    if (!isWin) {
      fs.chmodSync(viteDestPath, 0o755);
    }
    console.log('Created direct access to Vite at:', viteDestPath);
  } else {
    console.log(`Could not find Vite executable at: ${viteSourcePath}`);
    
    // Create a simple shell script that attempts to run vite through npx
    const fallbackScript = isWin 
      ? '@echo off\nnpx vite %*'
      : '#!/bin/bash\nnpx vite "$@"';
    
    fs.writeFileSync(viteDestPath, fallbackScript);
    if (!isWin) {
      fs.chmodSync(viteDestPath, 0o755);
    }
    console.log('Created fallback Vite launcher at:', viteDestPath);
  }
} catch (error) {
  console.error('Failed to create direct access to Vite:', error.message);
}

// Make scripts executable on Unix systems
if (!isWin) {
  console.log('Making scripts executable...');
  const scriptsToMakeExecutable = [
    'start-dev.sh',
    'make-scripts-executable.js',
    'start-dev.js',
    'setup.js',
  ];
  
  for (const script of scriptsToMakeExecutable) {
    try {
      fs.chmodSync(script, 0o755);
      console.log(`Made ${script} executable`);
    } catch (error) {
      console.error(`Failed to make ${script} executable:`, error.message);
    }
  }
  
  // Run the make-scripts-executable.js script to ensure all scripts are executable
  runCommand('node make-scripts-executable.js');
}

// Create or update npm scripts in package.json to use the direct vite executable
try {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Update the dev script to use the direct vite executable
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    packageJson.scripts.dev = isWin ? '.\\vite-direct.cmd' : './vite-direct';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Updated package.json scripts to use direct Vite executable');
  }
} catch (error) {
  console.error('Failed to update package.json:', error.message);
}

// Create a vite.config.js file if it doesn't exist
if (!fs.existsSync('vite.config.js') && !fs.existsSync('vite.config.ts')) {
  console.log('Creating a basic vite.config.js file...');
  const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
});
`;
  fs.writeFileSync('vite.config.js', viteConfig);
}

console.log('\nSetup complete!');
console.log('\nTo start the development server:');
console.log('- On Windows: Run start-dev.bat');
console.log('- On macOS/Linux: Run ./start-dev.sh');
console.log('\nAlternatively, you can run: node start-dev.js');
