#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const WHATSNEW_PATH = path.join(
  ROOT,
  'distribution',
  'whatsnew',
  'whatsnew-en-US',
);
const RELEASE_NOTES_PATH = path.join(ROOT, 'RELEASE_NOTES.md');
const PLAY_STORE_CHAR_LIMIT = 500;

const TYPE_MAP = {
  feat: 'Features',
  fix: 'Bug Fixes',
  perf: 'Performance',
  refactor: 'Refactoring',
  docs: 'Documentation',
  chore: 'Chores',
  style: 'Style',
  test: 'Tests',
  ci: 'CI',
  build: 'Build',
};

function parseArgs() {
  const args = process.argv.slice(2);
  const versionIdx = args.indexOf('--version');
  let version = null;
  if (
    versionIdx !== -1 &&
    args[versionIdx + 1] &&
    !args[versionIdx + 1].startsWith('--')
  ) {
    version = args[versionIdx + 1];
  }
  return { version };
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

function getCommitMessages(tag) {
  try {
    const cmd = tag
      ? `git log ${tag}..HEAD --format="%s"`
      : 'git log --format="%s"';
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch {
    return [];
  }
}

function parseCommit(message) {
  if (message.startsWith('chore(release):')) {
    return null;
  }

  const match = message.match(/^(\w+)(?:\(([^)]*)\))?!?:\s*(.+)/);
  if (!match) {
    return { type: 'other', scope: null, description: message };
  }

  return {
    type: match[1].toLowerCase(),
    scope: match[2] || null,
    description: match[3].charAt(0).toUpperCase() + match[3].slice(1),
  };
}

function groupCommits(messages) {
  const groups = {};
  for (const msg of messages) {
    const parsed = parseCommit(msg);
    if (!parsed) {
      continue;
    }
    const type = TYPE_MAP[parsed.type] ? parsed.type : 'other';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(parsed.description);
  }
  return groups;
}

function generatePlayStoreNotes(groups, version) {
  const userFacingTypes = ['feat', 'fix', 'perf'];
  const entries = [];
  for (const type of userFacingTypes) {
    if (!groups[type]) {
      continue;
    }
    for (const desc of groups[type]) {
      entries.push(`• ${desc}`);
    }
  }

  const versionLabel = version || 'latest';
  const fallback = `What's new in v${versionLabel}:\n\n• Bug fixes and improvements\n`;

  if (entries.length === 0) {
    return fallback;
  }

  const header = `What's new in v${versionLabel}:\n\n`;
  const suffix = '• ...and more improvements\n';
  let body = '';

  for (const entry of entries) {
    const candidate = `${body + entry}\n`;
    if (
      header.length + candidate.length + suffix.length >
        PLAY_STORE_CHAR_LIMIT &&
      body.length > 0
    ) {
      body += suffix;
      break;
    }
    body = candidate;
  }

  const result = header + body;
  if (result.length > PLAY_STORE_CHAR_LIMIT) {
    return fallback;
  }

  return result;
}

function generateGitHubReleaseNotes(groups, version) {
  const versionLabel = version || 'latest';
  const sections = [`## v${versionLabel}\n`];

  const typeOrder = [
    'feat',
    'fix',
    'perf',
    'refactor',
    'docs',
    'chore',
    'style',
    'test',
    'ci',
    'build',
    'other',
  ];

  for (const type of typeOrder) {
    if (!groups[type] || groups[type].length === 0) {
      continue;
    }
    const heading = TYPE_MAP[type] || 'Other Changes';
    sections.push(`### ${heading}\n`);
    for (const desc of groups[type]) {
      sections.push(`- ${desc}`);
    }
    sections.push('');
  }

  if (sections.length <= 1) {
    return `## v${versionLabel}\n\nBug fixes and improvements.\n`;
  }

  return `${sections.join('\n')}\n`;
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function main() {
  const { version } = parseArgs();
  const tag = getLatestTag();
  const messages = getCommitMessages(tag);

  console.error(`Found ${messages.length} commits since ${tag || 'beginning'}`);

  const groups = groupCommits(messages);

  const playStoreNotes = generatePlayStoreNotes(groups, version);
  ensureDir(WHATSNEW_PATH);
  fs.writeFileSync(WHATSNEW_PATH, playStoreNotes, 'utf8');
  console.error(
    `Wrote Play Store notes (${playStoreNotes.length} chars / ${PLAY_STORE_CHAR_LIMIT} limit)`,
  );

  const releaseNotes = generateGitHubReleaseNotes(groups, version);
  fs.writeFileSync(RELEASE_NOTES_PATH, releaseNotes, 'utf8');
  console.error('Wrote GitHub Release notes to RELEASE_NOTES.md');
}

main();
