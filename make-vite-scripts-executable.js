
const { execSync } = require('child_process');
const os = require('os');

// Only run chmod on Unix-like systems
if (os.platform() !== 'win32') {
  console.log('Making Vite startup scripts executable...');
  try {
    execSync('chmod +x start-vite-dev.sh', { stdio: 'inherit' });
    console.log('Scripts are now executable.');
  } catch (error) {
    console.error('Failed to make scripts executable:', error.message);
  }
}
