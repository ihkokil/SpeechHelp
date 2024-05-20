
#!/usr/bin/env node

// Enhanced script to run Vite with better error handling and installation
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("====================================");
console.log("Starting SpeechHelp Development Server");
console.log("====================================");

// First, ensure vite is installed directly
try {
  console.log("Installing Vite locally...");
  execSync('npm install --save-dev vite@latest --no-audit --no-fund', { stdio: 'inherit' });
  
  // Check if package.json has the correct scripts
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (!packageJson.scripts || !packageJson.scripts.dev || packageJson.scripts.dev !== 'vite') {
      console.log("Adding dev script to package.json...");
      if (!packageJson.scripts) packageJson.scripts = {};
      packageJson.scripts.dev = 'vite';
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }
  }
  
  // Launch with local vite
  const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
  if (fs.existsSync(vitePath)) {
    console.log("✅ Starting Vite from local installation...");
    const viteProcess = spawn(vitePath, [], { stdio: 'inherit', shell: true });
    viteProcess.on('close', (code) => {
      process.exit(code);
    });
    return;
  }
} catch (error) {
  console.error("⚠️ Initial installation attempt failed, trying alternatives...");
}

// Try alternative approaches
try {
  console.log("🔄 Trying npx vite...");
  const npxProcess = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });
  npxProcess.on('error', () => {
    console.log("⚠️ npx vite failed, trying npm run dev...");
    const npmProcess = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });
    npmProcess.on('error', () => {
      console.error("❌ All attempts failed. Please try manually installing:");
      console.log("npm install --save-dev vite@latest");
      console.log("npx vite");
      process.exit(1);
    });
  });
} catch (error) {
  console.error("❌ Could not start development server:", error.message);
  console.log("Please try these commands manually:");
  console.log("1. npm install --save-dev vite");
  console.log("2. npx vite");
  process.exit(1);
}
