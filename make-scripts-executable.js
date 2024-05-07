
#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

try {
  // Only try to make scripts executable on Unix-like systems
  if (process.platform !== 'win32') {
    console.log('Making all scripts executable...');
    
    const scripts = [
      'start-dev.sh',
      'setup.js',
      'start-dev.js',
      'vite-direct'
    ];
    
    for (const script of scripts) {
      try {
        if (fs.existsSync(script)) {
          execSync(`chmod +x ${script}`, { stdio: 'inherit' });
          console.log(`Made ${script} executable`);
        } else {
          console.log(`Script ${script} not found, skipping`);
        }
      } catch (err) {
        console.error(`Failed to make ${script} executable:`, err.message);
      }
    }
    
    console.log('All scripts are now executable');
  } else {
    console.log('Running on Windows, no need to make scripts executable.');
  }
} catch (error) {
  console.error('Failed to make scripts executable:', error.message);
}
