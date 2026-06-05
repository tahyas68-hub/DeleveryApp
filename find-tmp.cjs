const fs = require('fs');
const { execSync } = require('child_process');

try {
  console.log('Searching for any files modified/created in the last 2 hours outside of the current run:');
  const tempFiles = execSync('find /tmp -type f -mmin -120 2>/dev/null', { encoding: 'utf8' });
  console.log('Temp files:', tempFiles);
} catch (e) {
  console.error(e);
}
