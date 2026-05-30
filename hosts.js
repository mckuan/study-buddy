const { exec } = require('child_process');
const fs = require('fs');
const keytar = require('keytar');
const Store = require('electron-store');
const store = new Store();

const KEYTAR_SERVICE = 'StudyBuddy';
const KEYTAR_ACCOUNT = 'sudoPassword';

const BLOCK_TAG = '# study-buddy-block';
let blocksites = store.get('blockedsites', ['reddit.com', 'youtube.com',
  'x.com', 'facebook.com', 'instagram.com']);
let sudoPassword = null;
let blockingEnabled = store.get('blockingEnabled', false);

// ── password management ───────────────────────────────────

function setSudoPassword(password) {
  sudoPassword = password;
}

async function persistPassword(password) {
  await keytar.setPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT, password);
}

async function loadPassword() {
  return await keytar.getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);
}

async function clearPassword() {
  sudoPassword = null;
  await keytar.deletePassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT);
}

// ── sudo helpers ──────────────────────────────────────────

function runWithSudo(command) {
  return new Promise((resolve, reject) => {
    const proc = exec(
      `sudo -S sh -c '${command.replace(/'/g, `'\\''`)}'`,
      (error, stdout) => {
        if (error) reject(error);
        else resolve(stdout);
      }
    );
    proc.stdin.write(sudoPassword + '\n');
    proc.stdin.end();
  });
}

function promptForPassword() {
  return new Promise((resolve, reject) => {
    const script = [
      'tell application "System Events"',
      '  set pwd to text returned of (display dialog ¬',
      '    "StudyBuddy needs admin access to block distracting sites." ¬',
      '    with title "StudyBuddy \u2013 Admin Access" ¬',
      '    default answer "" ¬',
      '    with hidden answer ¬',
      '    buttons {"Cancel", "OK"} default button "OK")',
      'end tell',
      'return pwd',
    ].join('\n');

    exec(`osascript << 'APPLESCRIPT'\n${script}\nAPPLESCRIPT`, (error, stdout) => {
      if (error) reject(new Error('cancelled'));
      else resolve(stdout.trim());
    });
  });
}

// -k forces a fresh credential check — intentional for validation only
function validatePassword(password) {
  return new Promise((resolve) => {
    const proc = exec(`sudo -S -k true`, (error) => resolve(!error));
    proc.stdin.write(password + '\n');
    proc.stdin.end();
  });
}

// ── admin access ──────────────────────────────────────────

// Only prompts if sudoPassword is not already in memory.
// Returns 'ok' | 'wrong-password' | 'cancelled'
async function ensureAdminAccess() {
  if (sudoPassword) return 'ok';

  // Try restoring from Keychain before prompting
  const cached = await loadPassword();
  if (cached) {
    sudoPassword = cached;
    return 'ok';
  }

  try {
    const password = await promptForPassword();
    const valid = await validatePassword(password);
    if (!valid) return 'wrong-password';
    sudoPassword = password;
    await persistPassword(password);
    return 'ok';
  } catch {
    return 'cancelled';
  }
}

// ── blocking ──────────────────────────────────────────────

async function blockWebsites() {
  if (!blockingEnabled) return;

  const result = await ensureAdminAccess();
  if (result !== 'ok') throw new Error(result);

  const entries = blocksites.flatMap(site => [
    `127.0.0.1 ${site}`,
    `127.0.0.1 www.${site}`
  ]).join('\n');

  const tempFile = '/tmp/study-buddy-block.txt';
  fs.writeFileSync(tempFile, `\n${BLOCK_TAG}\n${entries}\n${BLOCK_TAG}\n`);

  await runWithSudo('cat /tmp/study-buddy-block.txt >> /etc/hosts && dscacheutil -flushcache; killall -HUP mDNSResponder');
}

async function unblockWebsites() {
  if (!blockingEnabled) return;
  if (!sudoPassword) return;

  const hostsPath = '/etc/hosts';
  const content = fs.readFileSync(hostsPath, 'utf8');
  const updated = content.replace(
    new RegExp(`${BLOCK_TAG}[\\s\\S]*?${BLOCK_TAG}\\n?`, 'g'),
    ''
  );

  const tempFile = '/tmp/hosts-cleaned';
  fs.writeFileSync(tempFile, updated);

  await runWithSudo(`cp ${tempFile} /etc/hosts && dscacheutil -flushcache; killall -HUP mDNSResponder`);
}

// ── settings ──────────────────────────────────────────────

async function setBlockingEnabled(enabled) {
  if (!enabled) {
    blockingEnabled = false;
    store.set('blockingEnabled', false);
    await clearPassword();
    return 'ok';
  }

  const result = await ensureAdminAccess();
  if (result !== 'ok') return result;

  blockingEnabled = true;
  store.set('blockingEnabled', true);
  return 'ok';
}

function setBlockedSites(sites) {
  blocksites = sites;
  store.set('blockedsites', sites);
}

function getBlockedSites() { return blocksites; }
function getBlockingEnabled() { return blockingEnabled; }

module.exports = {
  blockWebsites,
  unblockWebsites,
  setBlockingEnabled,
  setBlockedSites,
  getBlockingEnabled,
  getBlockedSites,
  setSudoPassword,
};