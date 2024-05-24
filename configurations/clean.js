// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require('node:child_process');

const platform = process.platform;

if (platform === 'win32') {
	// Для Windows
	execSync('del /F /Q /S build && rmdir /Q /S build', { stdio: 'inherit' });
} else {
	// Для Linux и MacOS
	execSync('rm -rf build', { stdio: 'inherit' });
}
