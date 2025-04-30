
const fs = require('fs');
const { execSync } = require('child_process');

try {
  // Only try to make scripts executable on Unix-like systems
  if (process.platform !== 'win32') {
    console.log('Making scripts executable...');
    execSync('chmod +x start-dev.sh', { stdio: 'inherit' });
    console.log('Scripts are now executable');
  }
} catch (error) {
  console.error('Failed to make scripts executable:', error);
}
