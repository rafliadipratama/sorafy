/**
 * Direct stream download, used when yt-dlp cannot produce a file itself.
 */

const fs = require('node:fs');
const http = require('node:http');
const https = require('node:https');

// Socket idle time, not total duration: a slow but moving transfer never trips it,
// while a dead connection releases a playlist's download worker.
const STREAM_DOWNLOAD_TIMEOUT_MS = 30000;

const DOWNLOAD_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

/**
 * Save a stream URL straight to disk, with no transcode.
 * Resolves rather than rejects so a caller awaiting several downloads cannot stall.
 * A partial or rejected response is deleted: a half-written file would otherwise
 * be mistaken for a completed download and never retried.
 * @param {string} url - Upstream stream URL, http: or https:
 * @param {string} destPath - File to write
 * @param {object} [deps] - Injection seam for tests
 * @param {typeof https.get} [deps.get] - Overrides protocol-based client choice
 * @param {number} [deps.timeoutMs]
 * @returns {Promise<{success: boolean, filePath?: string, error?: string}>}
 */
function downloadStreamToFile(url, destPath, deps = {}) {
  const { get, timeoutMs = STREAM_DOWNLOAD_TIMEOUT_MS } = deps;

  return new Promise((resolve) => {
    let settled = false;
    let fileStream = null;
    let req = null;

    const fail = (error) => {
      if (settled) return;
      settled = true;
      if (req) req.destroy();
      if (fileStream) fileStream.destroy();
      try { fs.unlinkSync(destPath); } catch (_) {}
      resolve({ success: false, error });
    };

    let client = get;
    if (!client) {
      try {
        client = new URL(url).protocol === 'http:' ? http.get : https.get;
      } catch (_) {
        return fail('Invalid stream URL.');
      }
    }

    try {
      req = client(url, { headers: { 'User-Agent': DOWNLOAD_UA } }, (res) => {
        if (res.statusCode !== 200 && res.statusCode !== 206) {
          res.resume();
          return fail(`Stream download returned HTTP ${res.statusCode}`);
        }

        fileStream = fs.createWriteStream(destPath);
        fileStream.on('error', (e) => fail(e.message));
        res.on('error', (e) => fail(e.message));

        fileStream.on('finish', () => {
          if (settled) return;
          settled = true;
          resolve({ success: true, filePath: destPath });
        });
        res.pipe(fileStream);
      });
    } catch (e) {
      // A protocol mismatch throws synchronously rather than emitting 'error'.
      return fail(e.message);
    }

    req.on('error', (e) => fail(e.message));
    req.setTimeout(timeoutMs, () => fail('Stream download timed out.'));
  });
}

module.exports = { STREAM_DOWNLOAD_TIMEOUT_MS, downloadStreamToFile };
