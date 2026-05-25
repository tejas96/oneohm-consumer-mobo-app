#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENV_PATH = path.join(ROOT, '.env');
const ENV_EXAMPLE_PATH = path.join(ROOT, '.env.example');

function loadTokenFromEnv() {
  if (!fs.existsSync(ENV_PATH)) {
    return null;
  }
  const content = fs.readFileSync(ENV_PATH, 'utf8');
  const match = content.match(
    /^GITHUB_PACKAGES_TOKEN\s*=\s*"?([^"\s\n\r]+)"?/m,
  );
  return match?.[1] || null;
}

function run() {
  let token = process.env.GITHUB_PACKAGES_TOKEN;

  if (!token) {
    token = loadTokenFromEnv();
    if (token) {
      console.log('✅ Loaded GITHUB_PACKAGES_TOKEN from .env');
    }
  } else {
    console.log('✅ GITHUB_PACKAGES_TOKEN found in shell environment');
  }

  if (!token) {
    console.error(
      '\n❌ GITHUB_PACKAGES_TOKEN is not set.\n\n' +
        'Option 1: Add it to .env\n' +
        `  cp ${path.basename(ENV_EXAMPLE_PATH)} .env\n` +
        '  # Then add: GITHUB_PACKAGES_TOKEN=ghp_your_token\n\n' +
        'Option 2: Export in your shell\n' +
        '  export GITHUB_PACKAGES_TOKEN="ghp_your_token"\n\n' +
        'Generate a token at: https://github.com/settings/tokens/new?scopes=read:packages\n',
    );
    process.exit(1);
  }

  console.log('📦 Running npm install...\n');

  try {
    execSync('npm install', {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env, GITHUB_PACKAGES_TOKEN: token },
    });
  } catch {
    process.exit(1);
  }
}

run();
