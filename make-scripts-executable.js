
const fs = require('fs');
const { execSync } = require('child_process');

try {
  // Only try to make scripts executable on Unix-like systems
  if (process.platform !== 'win32') {
    console.log('Making all scripts executable...');
    
    // Make start-dev.sh executable
    try {
      execSync('chmod +x start-dev.sh', { stdio: 'inherit' });
      console.log('Made start-dev.sh executable');
    } catch (err) {
      console.error('Failed to make start-dev.sh executable:', err.message);
    }
    
    // Make setup.js executable
    try {
      execSync('chmod +x setup.js', { stdio: 'inherit' });
      console.log('Made setup.js executable');
    } catch (err) {
      console.error('Failed to make setup.js executable:', err.message);
    }
    
    console.log('All scripts are now executable');
  } else {
    console.log('Running on Windows, no need to make scripts executable.');
  }
} catch (error) {
  console.error('Failed to make scripts executable:', error.message);
}
