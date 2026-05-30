const { exec } = require('child_process');
const Store = require('electron-store');
const store = new Store();
const fs = require('fs');
const { get } = require('http');
const keytar = require('keytar'); 
const BLOCK_TAG = '# study-buddy-block';
let blocksites = store.get('blockedsites', ['reddit.com', 'youtube.com', 
  'x.com', 'facebook.com', 'instagram.com']);
let sudoPassword = null; 
let blockingEnabled = store.get('blockingEnabled', false); 
 
/**
 * we run the password we got previously into the terminal
 * and if it goes through we run in the commands 
 * @param {*} command given during block/unblock
 */
function runWithSudo(command) {
  return new Promise((resolve, reject) => {
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
  const cached = await keytar.getPassword('study-buddy', 'admin');
  if (cached !== null) {
    sudoPassword = cached;
    return 'ok';
  }

  try {
    const password = await promptForPassword();
    const valid = await validatePassword(password); // validate it!
    if (!valid) {
      return 'wrong-password';
    }
    await keytar.setPassword('study-buddy', 'admin', password);
    sudoPassword = password;
    blockingEnabled = true;
    return 'ok';
  } catch {
    return 'cancelled';
  }
}
/** Call from the settings toggle to forget the cached credential. */
async function revokeAdminAccess() {
  sudoPassword = null;
  await keytar.deletePassword('study-buddy', 'admin');
}

 /**
  * Call this to block the websites. It will prompt for a password if not cached, and validate it.
  * Checks if blocking was allowed previously writes to computer 
  * making all blocked sites start with local host and clears dns caches
  */
async function blockWebsites(force = false) {
  if (!blockingEnabled && !force) return;
 
  const result = await ensureAdminAccess();
  if (result === 'cancelled'){
    blockingEnabled = false;
    throw new Error(result);
  } 
  if (result === 'wrong-password'){
    blockingEnabled = false;
    throw new Error(result);
  }
  blockingEnabled = true;   
  store.set('blockingEnabled', true);

  const entries = blocksites.flatMap(site => [
    `127.0.0.1 ${site}`,
    `127.0.0.1 www.${site}`
  ]).join('\n');
 
  const tempFile = '/tmp/study-buddy-block.txt';
  fs.writeFileSync(tempFile, `\n${BLOCK_TAG}\n${entries}\n${BLOCK_TAG}\n`);
 
  await runWithSudo('cat /tmp/study-buddy-block.txt >> /etc/hosts');
  await runWithSudo('dscacheutil -flushcache; killall -HUP mDNSResponder');
}
 
/**
 * Calls to unblock websites
 * checks if blocking was allowed 
 * and deletes the lines we wrote when blocking and clears cache 
 */
async function unblockWebsites(force = false) {
  if (!blockingEnabled && !force) return;
 
  const result = await ensureAdminAccess();
  if (result !== 'ok') return;
 
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
 
/**
 * if blocking is true its true, if not (user toggles it off) 
 * we delete the current pswd if we turn on blocking we ask for new pswd
 * and if pswd is wrong or they decide not to we toggle back off
 * @param {*} enabled if blockingEnabled true or false then
 */
async function setBlockingEnabled(enabled) {
  blockingEnabled = enabled;
  store.set('blockingEnabled', enabled);
  if (!enabled) {
    await revokeAdminAccess();
    return 'ok';
  } else {
    const result = await ensureAdminAccess();
    if (result !== 'ok') {
      blockingEnabled = false;
    }
    return result;
  }
}
 
function setBlockedSites(sites) {
  blocksites = sites;
  store.set('blockedsites', sites);
}

function getBlockedSites(){
  return blocksites;
}
function getBlockingEnabled() {
  return blockingEnabled;
}
 
module.exports = {
  blockWebsites,
  unblockWebsites,
  setBlockingEnabled,
  setBlockedSites,
  revokeAdminAccess,
  getBlockingEnabled,
  getBlockedSites,
};