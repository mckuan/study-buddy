const { exec } = require('child_process');
const fs = require('fs');
 
const BLOCK_TAG = '# study-buddy-block';
let blocksites = ['reddit.com'];
 
let sudoPassword = null;        // cached after first auth
let blockingEnabled = true;     // toggled from settings
 
// ── helpers ──────────────────────────────────────────────────────────────────
 
function runWithSudo(command) {
  return new Promise((resolve, reject) => {
    // Use sudo -S so we can pipe the password via stdin; -k resets any
    // existing cached credential so our explicit password is always used.
    const proc = exec(
      `sudo -S -k sh -c '${command.replace(/'/g, `'\\''`)}'`,
      (error, stdout, stderr) => {
        if (error) reject(error);
        else resolve(stdout);
      }
    );
    proc.stdin.write(sudoPassword + '\n');
    proc.stdin.end();
  });
}
 
/**
 * Show a single macOS password prompt via osascript.
 * Returns the entered password, or throws if the user cancels.
 */
function promptForPassword() {
  return new Promise((resolve, reject) => {
    const script = `
      tell application "System Events"
        set pwd to text returned of (display dialog ¬
          "StudyBuddy needs one-time admin access to block distracting sites." ¬
          with title "StudyBuddy – Admin Access" ¬
          default answer "" ¬
          with hidden answer ¬
          buttons {"Cancel", "OK"} default button "OK")
      end tell
      return pwd
    `.trim().replace(/\n\s+/g, '\n');
 
    exec(`osascript -e '${script}'`, (error, stdout) => {
      if (error) reject(new Error('User cancelled or osascript failed'));
      else resolve(stdout.trim());
    });
  });
}
 
/**
 * Validate the password by running a harmless sudo command.
 * Returns true if it works, false if the password is wrong.
 */
function validatePassword(password) {
  return new Promise((resolve) => {
    const proc = exec(
      `sudo -S -k true`,
      (error) => resolve(!error)
    );
    proc.stdin.write(password + '\n');
    proc.stdin.end();
  });
}
 
/**
 * Call this before the first block/unblock.
 * Prompts once, validates, and caches the password for the session.
 * Returns true on success, false if the user cancels or enters a wrong password.
 */
async function ensureAdminAccess() {
  if (sudoPassword !== null) return true;   // already authenticated this session
 
  try {
    const password = await promptForPassword();
    const valid = await validatePassword(password);
    if (!valid) {
      sudoPassword = null;
      return false;
    }
    sudoPassword = password;
    return true;
  } catch {
    return false;
  }
}
 
/** Call from the settings toggle to forget the cached credential. */
function revokeAdminAccess() {
  sudoPassword = null;
}
 
// ── public API ────────────────────────────────────────────────────────────────
 
async function blockWebsites() {
  if (!blockingEnabled) return;
 
  const ok = await ensureAdminAccess();
  if (!ok) throw new Error('Admin access not granted');
 
  const entries = blocksites.flatMap(site => [
    `127.0.0.1 ${site}`,
    `127.0.0.1 www.${site}`
  ]).join('\n');
 
  const tempFile = '/tmp/study-buddy-block.txt';
  fs.writeFileSync(tempFile, `\n${BLOCK_TAG}\n${entries}\n${BLOCK_TAG}\n`);
 
  await runWithSudo('cat /tmp/study-buddy-block.txt >> /etc/hosts');
  await runWithSudo('dscacheutil -flushcache; killall -HUP mDNSResponder');
}
 
async function unblockWebsites() {
  if (!blockingEnabled) return;
 
  const ok = await ensureAdminAccess();
  if (!ok) throw new Error('Admin access not granted');
 
  const hostsPath = '/etc/hosts';
  const content = fs.readFileSync(hostsPath, 'utf8');
  const updated = content.replace(
    new RegExp(`${BLOCK_TAG}[\\s\\S]*?${BLOCK_TAG}\\n?`, 'g'),
    ''
  );
 
  const tempFile = '/tmp/hosts-cleaned';
  fs.writeFileSync(tempFile, updated);
 
  await runWithSudo(`cp ${tempFile} /etc/hosts`);
  await runWithSudo('dscacheutil -flushcache; killall -HUP mDNSResponder');
}
 
function setBlockingEnabled(enabled) {
  blockingEnabled = enabled;
  if (!enabled) {
    revokeAdminAccess();   // forget password when user turns the feature off
  }
}
 
function setBlockedSites(sites) {
  blocksites = sites;
}
 
module.exports = {
  blockWebsites,
  unblockWebsites,
  setBlockingEnabled,
  setBlockedSites,
  revokeAdminAccess,
};