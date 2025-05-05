
const { execSync } = require('child_process');
const os = require('os');

// Only run chmod on Unix-like systems
if (os.platform() !== 'win32') {
  console.log('Making ensure-vite.js script executable...');
  try {
    execSync('chmod +x ensure-vite.js', { stdio: 'inherit' });
    console.log('Script is now executable.');
  } catch (error) {
    console.error('Failed to make script executable:', error.message);
    console.log('You may need to manually run: chmod +x ensure-vite.js');
  }
}
