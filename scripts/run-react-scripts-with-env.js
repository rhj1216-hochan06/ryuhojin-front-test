const { existsSync, readFileSync } = require('fs');
const { resolve } = require('path');
const { spawn } = require('child_process');

const envPath = resolve(process.cwd(), '.env.dev');
const scriptName = process.argv[2];
const scriptArgs = process.argv.slice(3);

if (!scriptName) {
  console.error('Usage: node scripts/run-react-scripts-with-env.js <start|build|test>');
  process.exit(1);
}

if (existsSync(envPath)) {
  const envFile = readFileSync(envPath, 'utf8');

  envFile.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return;
    }

    const separatorIndex = trimmedLine.indexOf('=');

    if (separatorIndex === -1) {
      return;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    let value = trimmedLine.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key) {
      process.env[key] = value;
    }
  });
}

const reactScriptsBin = require.resolve('react-scripts/bin/react-scripts.js');
const child = spawn(process.execPath, [reactScriptsBin, scriptName, ...scriptArgs], {
  env: process.env,
  stdio: 'inherit',
});

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

child.on('close', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code || 0);
});
