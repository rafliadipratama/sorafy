const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { parseSha256Sums, installVerifiedBinary } = require('../src/modules/yt-dlp-installer');

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

function fakeFetch(files) {
  return async (url) => {
    const name = url.split('/').pop();
    if (!(name in files)) return { ok: false, status: 404 };
    const body = Buffer.from(files[name]);
    return {
      ok: true,
      status: 200,
      text: async () => body.toString('utf8'),
      arrayBuffer: async () => body.buffer.slice(body.byteOffset, body.byteOffset + body.length)
    };
  };
}

function tempDest(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ytdlp-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return path.join(dir, 'yt-dlp');
}

test('parseSha256Sums returns the hash for an exact file name only', () => {
  const sums = `${'a'.repeat(64)}  yt-dlp\n${'b'.repeat(64)}  yt-dlp.exe\n${'c'.repeat(64)}  yt-dlp_macos\n`;
  assert.equal(parseSha256Sums(sums, 'yt-dlp'), 'a'.repeat(64));
  assert.equal(parseSha256Sums(sums, 'yt-dlp.exe'), 'b'.repeat(64));
  assert.equal(parseSha256Sums(sums, 'yt-dlp_linux'), null);
  assert.equal(parseSha256Sums('', 'yt-dlp'), null);
});

test('installVerifiedBinary writes the binary when its hash matches', async (t) => {
  const destFile = tempDest(t);
  const binary = 'genuine-binary';
  const fetchImpl = fakeFetch({ 'yt-dlp': binary, 'SHA2-256SUMS': `${sha256(binary)}  yt-dlp\n` });

  await installVerifiedBinary({ binaryName: 'yt-dlp', destFile, fetchImpl });

  assert.equal(fs.readFileSync(destFile, 'utf8'), binary);
  if (process.platform !== 'win32') assert.equal(fs.statSync(destFile).mode & 0o111, 0o111);
});

test('installVerifiedBinary rejects a tampered binary and keeps the existing one', async (t) => {
  const destFile = tempDest(t);
  fs.writeFileSync(destFile, 'previous-working-binary');
  const fetchImpl = fakeFetch({ 'yt-dlp': 'tampered', 'SHA2-256SUMS': `${sha256('genuine')}  yt-dlp\n` });

  await assert.rejects(installVerifiedBinary({ binaryName: 'yt-dlp', destFile, fetchImpl }), /checksum/i);

  assert.equal(fs.readFileSync(destFile, 'utf8'), 'previous-working-binary');
  assert.deepEqual(fs.readdirSync(path.dirname(destFile)), ['yt-dlp']);
});

test('installVerifiedBinary fails when the checksum list has no entry for the binary', async (t) => {
  const destFile = tempDest(t);
  const fetchImpl = fakeFetch({ 'yt-dlp': 'x', 'SHA2-256SUMS': `${'0'.repeat(64)}  other\n` });

  await assert.rejects(installVerifiedBinary({ binaryName: 'yt-dlp', destFile, fetchImpl }), /checksum/i);
  assert.equal(fs.existsSync(destFile), false);
});

test('installVerifiedBinary surfaces HTTP failures', async (t) => {
  const destFile = tempDest(t);
  await assert.rejects(
    installVerifiedBinary({ binaryName: 'yt-dlp', destFile, fetchImpl: fakeFetch({}) }),
    /HTTP 404/
  );
});
