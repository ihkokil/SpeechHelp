
#!/usr/bin/env node

// This script helps run the locally installed Vite
const { spawn } = require('child_process');
const path = require('path');

// Path to local vite executable
const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');

// Spawn the vite process
const viteProcess = spawn(vitePath, process.argv.slice(2), { 
  stdio: 'inherit',
  shell: true
});

viteProcess.on('error', (err) => {
  console.error('Failed to start Vite:', err);
  process.exit(1);
});

viteProcess.on('close', (code) => {
  process.exit(code);
});
