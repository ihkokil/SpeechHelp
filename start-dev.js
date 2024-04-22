
#!/usr/bin/env node

// This script helps run the locally installed Vite
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to local vite executable
const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');

// Check if the vite executable exists
if (!fs.existsSync(vitePath)) {
  console.error('\x1b[31mError: Vite executable not found at ' + vitePath + '\x1b[0m');
  console.log('\x1b[33mAttempting to use global vite installation...\x1b[0m');
  
  // Try to spawn using the global 'vite' command
  const viteProcess = spawn('npx', ['vite'].concat(process.argv.slice(2)), {
    stdio: 'inherit',
    shell: true
  });

  viteProcess.on('error', (err) => {
    console.error('\x1b[31mFailed to start Vite using npx:', err);
    console.log('Please ensure you have Vite installed. You can install it with:');
    console.log('npm install vite\x1b[0m');
    process.exit(1);
  });

  viteProcess.on('close', (code) => {
    process.exit(code);
  });
} else {
  // Use the local installation
  const viteProcess = spawn(vitePath, process.argv.slice(2), {
    stdio: 'inherit',
    shell: true
  });

  viteProcess.on('error', (err) => {
    console.error('\x1b[31mFailed to start local Vite:', err);
    console.log('Please ensure your node_modules are properly installed. Try running:');
    console.log('npm install\x1b[0m');
    process.exit(1);
  });

  viteProcess.on('close', (code) => {
    process.exit(code);
  });
}
