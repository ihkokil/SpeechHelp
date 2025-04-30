
#!/usr/bin/env node

// This script redirects to the start-dev.js script
console.log('Starting development server via dev.js...');

// Use require to run the start-dev.js script
try {
  require('./start-dev.js');
} catch (error) {
  console.error('Error running start-dev.js:', error);
  
  // If that fails, try running npm directly
  const { spawn } = require('child_process');
  console.log('Falling back to npm run dev...');
  
  const npmProcess = spawn('npm', ['run', 'dev'], { 
    stdio: 'inherit',
    shell: true
  });
  
  npmProcess.on('error', (err) => {
    console.error('Failed to start npm run dev:', err);
    process.exit(1);
  });
}
