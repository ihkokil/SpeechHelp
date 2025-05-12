
// #!/usr/bin/env node
const { chmod } = require('fs');
const path = require('path');

const ensureViteFilePath = path.join(__dirname, 'ensure-vite.js');

console.log('Making ensure-vite.js executable...');

// Change the permissions to make it executable (0o755 = rwxr-xr-x)
chmod(ensureViteFilePath, 0o755, (err) => {
  if (err) {
    console.error('Error making the file executable:', err);
  } else {
    console.log('ensure-vite.js is now executable!');
    console.log('You can now run it with:');
    console.log('  node ensure-vite.js');
    console.log('  Or on Unix-like systems: ./ensure-vite.js');
  }
});
