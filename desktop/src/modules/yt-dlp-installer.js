/**
 * Verified yt-dlp binary installer.
 * The downloaded file is executed by the app, so it is only written to disk
 * once its SHA-256 matches the checksum published with the same release.
 */

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const RELEASE_BASE_URL = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download';

/**
 * Read one file's hash out of a SHA2-256SUMS listing ("<hash>  <name>" per line).
 * @param {string} text - Contents of the checksum file
 * @param {string} binaryName - Exact release asset name
 * @returns {string|null} Lowercase hex digest, or null when absent
 */
function parseSha256Sums(text, binaryName) {
  if (typeof text !== 'string' || !binaryName) return null;
  for (const line of text.split('\n')) {
    const [hash, name] = line.trim().split(/\s+/);
    if (name === binaryName && /^[0-9a-f]{64}$/i.test(hash || '')) return hash.toLowerCase();
  }
  return null;
}

/**
 * Download a yt-dlp release asset and install it only if its checksum matches.
 * @param {object} options
 * @param {string} options.binaryName - Release asset name (e.g. yt-dlp_macos)
 * @param {string} options.destFile - Final path for the executable
 * @param {Function} [options.fetchImpl] - fetch implementation, for tests
 * @returns {Promise<string>} The installed path
 */
async function installVerifiedBinary({ binaryName, destFile, fetchImpl = fetch }) {
  const get = async (name) => {
    const res = await fetchImpl(`${RELEASE_BASE_URL}/${name}`, {
      headers: { 'User-Agent': 'SoraFy-Desktop-Installer' },
      redirect: 'follow'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${name}`);
    return res;
  };

  const sums = await (await get('SHA2-256SUMS')).text();
  const expected = parseSha256Sums(sums, binaryName);
  if (!expected) throw new Error(`No published checksum for ${binaryName}`);

  const payload = Buffer.from(await (await get(binaryName)).arrayBuffer());
  const actual = crypto.createHash('sha256').update(payload).digest('hex');
  if (actual !== expected) {
    throw new Error(`Checksum mismatch for ${binaryName}: expected ${expected}, got ${actual}`);
  }

  // Write beside the target then rename, so a failure never leaves a partial executable in place.
  const tempFile = `${destFile}.download`;
  fs.mkdirSync(path.dirname(destFile), { recursive: true });
  try {
    fs.writeFileSync(tempFile, payload, process.platform === 'win32' ? undefined : { mode: 0o755 });
    fs.renameSync(tempFile, destFile);
  } catch (err) {
    fs.rmSync(tempFile, { force: true });
    throw err;
  }
  return destFile;
}

module.exports = { parseSha256Sums, installVerifiedBinary, RELEASE_BASE_URL };
