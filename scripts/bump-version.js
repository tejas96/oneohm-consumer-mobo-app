#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PKG_PATH = path.join(ROOT, 'package.json');
const GRADLE_PATH = path.join(ROOT, 'android', 'app', 'build.gradle');
// Future: const PLIST_PATH = path.join(ROOT, 'ios', 'OneOhm', 'Info.plist');

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.includes('--skip')) {
    return { mode: 'skip' };
  }

  const typeIdx = args.indexOf('--type');
  if (typeIdx !== -1) {
    const type = args[typeIdx + 1];
    if (!type || !['patch', 'minor', 'major'].includes(type)) {
      console.error(
        `Invalid or missing bump type${
          type ? `: ${type}` : ''
        }. Must be patch, minor, or major.`,
      );
      process.exit(1);
    }
    return { mode: 'explicit', type };
  }

  if (args.includes('--auto') || args.length === 0) {
    return { mode: 'auto' };
  }

  console.error(
    'Usage: bump-version.js [--auto | --type patch|minor|major | --skip]',
  );
  process.exit(1);
}

function getLatestTag() {
  try {
    return execSync('git describe --tags --abbrev=0', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

function getCommitsSince(tag) {
  try {
    const cmd = tag ? `git log ${tag}..HEAD --oneline` : 'git log --oneline';
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch {
    return [];
  }
}

function getCommitBodies(tag) {
  try {
    const cmd = tag
      ? `git log ${tag}..HEAD --format="%B---COMMIT_SEPARATOR---"`
      : 'git log --format="%B---COMMIT_SEPARATOR---"';
    return execSync(cmd, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return '';
  }
}

function detectBumpType(commits, tag) {
  const bodies = getCommitBodies(tag);
  if (/BREAKING CHANGE/i.test(bodies)) {
    return 'major';
  }

  for (const line of commits) {
    const msg = line.replace(/^\w+\s+/, '');
    if (/^(\w+)!(\(|:)/i.test(msg)) {
      return 'major';
    }
  }

  for (const line of commits) {
    const msg = line.replace(/^\w+\s+/, '');
    if (/^feat[:(]/i.test(msg)) {
      return 'minor';
    }
  }

  return 'patch';
}

function bumpVersion(current, type) {
  const parts = current.split('.').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    console.error(`Invalid version format: ${current}`);
    process.exit(1);
  }
  const [major, minor, patch] = parts;
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      console.error(`Unknown bump type: ${type}`);
      process.exit(1);
  }
}

function readCurrentVersionCode() {
  const gradle = fs.readFileSync(GRADLE_PATH, 'utf8');
  const match = gradle.match(/versionCode\s+(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function updatePackageJson(newVersion) {
  const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
  pkg.version = newVersion;
  fs.writeFileSync(PKG_PATH, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
}

function updateBuildGradle(newVersion, newVersionCode) {
  let gradle = fs.readFileSync(GRADLE_PATH, 'utf8');
  gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${newVersionCode}`);
  gradle = gradle.replace(
    /versionName\s+"[^"]+"/,
    `versionName "${newVersion}"`,
  );
  fs.writeFileSync(GRADLE_PATH, gradle, 'utf8');
}

function setOutput(key, value) {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    fs.appendFileSync(outputFile, `${key}=${value}\n`);
  }
}

function main() {
  const config = parseArgs();
  const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
  const currentVersion = pkg.version;
  const currentVersionCode = readCurrentVersionCode();

  if (config.mode === 'skip') {
    updateBuildGradle(currentVersion, currentVersionCode);
    setOutput('version', currentVersion);
    setOutput('bump-type', 'skip');
    console.error(
      `[skip] Using current version: ${currentVersion} (versionCode: ${currentVersionCode})`,
    );
    return;
  }

  let bumpType;
  if (config.mode === 'explicit') {
    bumpType = config.type;
  } else {
    const tag = getLatestTag();
    const commits = getCommitsSince(tag);
    bumpType = detectBumpType(commits, tag);
    console.error(
      `Auto-detected bump type: ${bumpType} (from ${
        commits.length
      } commits since ${tag || 'beginning'})`,
    );
  }

  const newVersion = bumpVersion(currentVersion, bumpType);
  const newVersionCode = currentVersionCode + 1;

  updatePackageJson(newVersion);
  updateBuildGradle(newVersion, newVersionCode);

  setOutput('version', newVersion);
  setOutput('bump-type', bumpType);

  console.error(`Bumped ${currentVersion} -> ${newVersion} (${bumpType})`);
  console.error(`versionCode: ${currentVersionCode} -> ${newVersionCode}`);
}

main();
