const {exec} = require('child_process');
const blocksites = ['reddit.com'];

const fs = require('fs');
const BLOCK_TAG= '# study-buddy-block';

function runAsAdmin(command) {
  return new Promise((resolve, reject) => {
    exec('osascript -e \'do shell script "' + command + '" with administrator privileges\'', 
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
  });
}

async function blockWebsites() {
  const entries = blocksites.flatMap(site => [
    `127.0.0.1 ${site}`,
    `127.0.0.1 www.${site}`
  ]).join('\n');

  const tempFile = '/tmp/study-buddy-block.txt';
  fs.writeFileSync(tempFile, `\n${BLOCK_TAG}\n${entries}\n${BLOCK_TAG}\n`);

  await runAsAdmin('cat /tmp/study-buddy-block.txt >> /etc/hosts' );
  await runAsAdmin('dscacheutil -flushcache; killall -HUP mDNSResponder');
}

async function unblockWebsites() {
  const hostsPath = '/etc/hosts';

  const content = fs.readFileSync(hostsPath, 'utf8');

  const updated = content.replace(
    new RegExp(`${BLOCK_TAG}[\\s\\S]*?${BLOCK_TAG}\\n?`, 'g'),
    ''
  );

  const tempFile = '/tmp/hosts-cleaned';

  fs.writeFileSync(tempFile, updated);

  await runAsAdmin(
    `cp ${tempFile} /etc/hosts`
  );

  await runAsAdmin('dscacheutil -flushcache; killall -HUP mDNSResponder');
}

module.exports = {
  blockWebsites,
  unblockWebsites,
};