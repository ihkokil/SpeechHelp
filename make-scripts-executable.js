
// #!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

console.log("====================================");
console.log("Setting up SpeechHelp development environment");
console.log("====================================");

// Make scripts executable on Unix-like systems
if (os.platform() !== 'win32') {
  console.log('Making startup scripts executable...');
  try {
    execSync('chmod +x start-dev.sh', { stdio: 'inherit' });
    console.log('✅ Scripts are now executable');
  } catch (error) {
    console.error('❌ Failed to make scripts executable:', error.message);
    console.log('You may need to manually run: chmod +x start-dev.sh');
  }
}

// Create a package.json script for convenience if it doesn't exist
try {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add our custom scripts if they don't exist
    let modified = false;
    if (!packageJson.scripts) packageJson.scripts = {};
    
    if (!packageJson.scripts.start) {
      packageJson.scripts.start = 'vite';
      modified = true;
    }
    
    if (!packageJson.scripts.dev) {
      packageJson.scripts.dev = 'vite';
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Added convenience npm scripts to package.json');
    }
  }
} catch (error) {
  console.error('❌ Error updating package.json:', error.message);
}

console.log("\n====================================");
console.log("Setup complete! You can now start the app with:");
console.log(os.platform() === 'win32' ? 
  "start-dev.bat  OR  node start-dev.js" : 
  "./start-dev.sh  OR  node start-dev.js");
console.log("====================================");
