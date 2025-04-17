// Simple script to run SonarQube with environment variables from .env file
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read the .env.local file
const envPath = path.join(__dirname, '.env.local');
let token = null; // No default token - will require one from .env file
let url = null; // Default URL

try {
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    // Parse the .env file
    const envVars = envFile.split('\n').reduce((acc, line) => {
      // Skip comments and empty lines
      if (line.startsWith('#') || !line.trim()) return acc;
      
      const [key, value] = line.split('=');
      if (key && value) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {});
    
    // Set values from .env file
    if (envVars.SONAR_TOKEN) token = envVars.SONAR_TOKEN;
    if (envVars.SONAR_HOST_URL) url = envVars.SONAR_HOST_URL;
  } else {
    console.error('Error: .env.local file not found');
    console.log('Please create a .env.local file with your SonarQube token:');
    process.exit(1);
  }
} catch (err) {
  console.error('Error reading .env.local file:', err);
  process.exit(1);
}

// Verify that token exists
if (!token) {
  console.error('Error: No SonarQube token found in .env.local file');
  console.log('Please add SONAR_TOKEN=your_token_here to your .env.local file');
  process.exit(1);
}

// Build the command
const command = `sonar -Dsonar.host.url=${url} -Dsonar.token=${token} -Dsonar.projectKey=elegent -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info -Dsonar.coverage.exclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx,**/*.config.js,**/*.d.ts`;

console.log('Running SonarQube analysis...');
console.log('Note: To get coverage reports, run tests with coverage first: npm run test:coverage');
try {
  execSync(command, { stdio: 'inherit' });
  console.log('SonarQube analysis completed successfully!');
} catch (error) {
  console.error('SonarQube analysis failed:', error.message);
  process.exit(1);
} 