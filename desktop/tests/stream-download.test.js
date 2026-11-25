const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');

const { downloadStreamToFile, STREAM_DOWNLOAD_TIMEOUT_MS } = require('../src/modules/stream-download');

// Serve one canned response, then hand the test a URL and a scratch destination.
async function withServer(handler, fn) {
  const server = http.createServer(handler);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sorafy-dl-'));
  const dest = path.join(dir, 'track.webm');
  try {
    await fn(`http://127.0.0.1:${server.address().port}/audio`, dest);
  } finally {
    server.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test('a served stream is written to disk byte for byte', async () => {
  const body = Buffer.from('OggS-fake-audio-payload');
  await withServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'audio/webm' });
    res.end(body);
  }, async (url, dest) => {
    const result = await downloadStreamToFile(url, dest);
    assert.equal(result.success, true);
    assert.equal(result.filePath, dest);
    assert.deepEqual(fs.readFileSync(dest), body);
  });
});

test('a partial-content response is accepted', async () => {
  await withServer((req, res) => {
    res.writeHead(206, { 'Content-Range': 'bytes 0-3/4' });
    res.end('data');
  }, async (url, dest) => {
    assert.equal((await downloadStreamToFile(url, dest)).success, true);
  });
});

test('an error page is never left on disk as a finished download', async () => {
  // An expired googlevideo URL answers 403 with an HTML body; piping it would
  // store that HTML as the track and report success.
  await withServer((req, res) => {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<html>Forbidden</html>');
  }, async (url, dest) => {
    const result = await downloadStreamToFile(url, dest);
    assert.equal(result.success, false);
    assert.match(result.error, /403/);
    assert.equal(fs.existsSync(dest), false);
  });
});

test('a connection cut mid-transfer leaves no partial file behind', async () => {
  await withServer((req, res) => {
    res.writeHead(200, { 'Content-Length': '1000' });
    res.write('partial');
    res.destroy();
  }, async (url, dest) => {
    const result = await downloadStreamToFile(url, dest);
    assert.equal(result.success, false);
    assert.equal(fs.existsSync(dest), false);
  });
});

test('a stalled transfer gives up instead of holding the caller forever', async () => {
  await withServer((req, res) => {
    res.writeHead(200, { 'Content-Length': '1000' });
    res.write('start');
    // Never finishes: without a timeout the promise would never settle.
  }, async (url, dest) => {
    const result = await downloadStreamToFile(url, dest, { timeoutMs: 150 });
    assert.equal(result.success, false);
    assert.match(result.error, /timed out/);
    assert.equal(fs.existsSync(dest), false);
  });
});

test('an http proxy URL downloads instead of throwing on protocol', async () => {
  // The resolver hands back a loopback http: URL; the old code called https.get
  // on it, which throws synchronously and left the promise unsettled.
  await withServer((req, res) => {
    res.writeHead(200);
    res.end('audio');
  }, async (url, dest) => {
    assert.ok(url.startsWith('http://'));
    assert.equal((await downloadStreamToFile(url, dest)).success, true);
  });
});

test('an unusable URL reports failure rather than throwing', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sorafy-dl-'));
  try {
    const result = await downloadStreamToFile('not-a-url', path.join(dir, 'x.webm'));
    assert.equal(result.success, false);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a refused connection reports failure and settles', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sorafy-dl-'));
  try {
    // Port 1 is reserved and nothing listens there.
    const result = await downloadStreamToFile('http://127.0.0.1:1/audio', path.join(dir, 'x.webm'));
    assert.equal(result.success, false);
    assert.ok(result.error);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the idle timeout tolerates a slow link without stranding a worker', () => {
  assert.ok(STREAM_DOWNLOAD_TIMEOUT_MS >= 15000, 'must survive a slow but moving transfer');
  assert.ok(STREAM_DOWNLOAD_TIMEOUT_MS <= 60000, 'must release a batch worker in reasonable time');
});
