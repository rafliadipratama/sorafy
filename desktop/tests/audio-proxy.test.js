const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const {
  buildProxiedAudioUrl,
  extractTargetStreamUrl,
  isAllowedStreamTarget,
  AUDIO_PROXY_CORS_HEADERS,
  resolveByteRange,
  STREAM_PREFLIGHT_TIMEOUT_MS,
  preflightStream,
  createAudioProxyServer
} = require('../src/modules/audio-proxy');

const UNSATISFIABLE = { unsatisfiable: true };

test('resolveByteRange serves the whole file when no range is asked for', () => {
  assert.equal(resolveByteRange(undefined, 1000), null);
  assert.equal(resolveByteRange('', 1000), null);
});

test('resolveByteRange reads the ranges a seeking player sends', () => {
  assert.deepEqual(resolveByteRange('bytes=0-', 1000), { start: 0, end: 999 });
  assert.deepEqual(resolveByteRange('bytes=500-', 1000), { start: 500, end: 999 });
  assert.deepEqual(resolveByteRange('bytes=100-199', 1000), { start: 100, end: 199 });
  assert.deepEqual(resolveByteRange('bytes=999-999', 1000), { start: 999, end: 999 });
});

test('resolveByteRange supports suffix ranges for the tail of a file', () => {
  assert.deepEqual(resolveByteRange('bytes=-200', 1000), { start: 800, end: 999 });
  // Asking for more than exists returns the whole file, not an error.
  assert.deepEqual(resolveByteRange('bytes=-5000', 1000), { start: 0, end: 999 });
});

test('resolveByteRange clamps an end past the file instead of overstating Content-Length', () => {
  assert.deepEqual(resolveByteRange('bytes=0-999999999', 1000), { start: 0, end: 999 });
});

test('resolveByteRange rejects a start the file no longer reaches', () => {
  // A player that cached a larger size seeks past the end of a smaller file.
  assert.deepEqual(resolveByteRange('bytes=1000-', 1000), UNSATISFIABLE);
  assert.deepEqual(resolveByteRange('bytes=5000-6000', 1000), UNSATISFIABLE);
});

test('resolveByteRange rejects malformed and inverted ranges', () => {
  assert.deepEqual(resolveByteRange('bytes=abc-', 1000), UNSATISFIABLE);
  assert.deepEqual(resolveByteRange('bytes=-', 1000), UNSATISFIABLE);
  assert.deepEqual(resolveByteRange('bytes=-0', 1000), UNSATISFIABLE);
  assert.deepEqual(resolveByteRange('bytes=500-100', 1000), UNSATISFIABLE);
  assert.deepEqual(resolveByteRange('items=0-10', 1000), UNSATISFIABLE);
  // Multiple ranges are not served; refusing beats silently returning only the first.
  assert.deepEqual(resolveByteRange('bytes=0-1,5-6', 1000), UNSATISFIABLE);
});

test('resolveByteRange has nothing to serve from an empty file', () => {
  assert.deepEqual(resolveByteRange('bytes=0-', 0), UNSATISFIABLE);
});

test('preflightStream accepts the statuses a playable stream returns', async () => {
  const seen = [];
  const fetchImpl = async (url, opts) => {
    seen.push({ url, method: opts.method, ua: opts.headers['User-Agent'] });
    return { status: 206 };
  };
  assert.equal(await preflightStream('https://x/stream', 'TestUA', fetchImpl), true);
  assert.deepEqual(seen, [{ url: 'https://x/stream', method: 'HEAD', ua: 'TestUA' }]);
  assert.equal(await preflightStream('https://x/stream', 'TestUA', async () => ({ status: 200 })), true);
});

test('preflightStream rejects a stream the egress IP is blocked from', async () => {
  assert.equal(await preflightStream('https://x/stream', 'TestUA', async () => ({ status: 403 })), false);
  assert.equal(await preflightStream('https://x/stream', 'TestUA', async () => ({ status: 500 })), false);
});

test('preflightStream treats a network failure as unplayable so the caller falls back', async () => {
  const failing = async () => { throw new Error('ETIMEDOUT'); };
  assert.equal(await preflightStream('https://x/stream', 'TestUA', failing), false);
});

test('preflightStream allows a slow link time to answer', async () => {
  // 1200ms cut off VPN and mobile links that were about to succeed.
  assert.ok(STREAM_PREFLIGHT_TIMEOUT_MS >= 2000, 'timeout must tolerate a slow round trip');
  assert.ok(STREAM_PREFLIGHT_TIMEOUT_MS <= 3000, 'timeout must not delay the fallback chain');
});

test('isAllowedStreamTarget accepts only HTTPS googlevideo.com stream hosts', () => {
  assert.equal(isAllowedStreamTarget('https://rr1---sn-xxx.googlevideo.com/videoplayback?id=abc'), true);
  assert.equal(isAllowedStreamTarget('https://googlevideo.com/videoplayback'), true);

  assert.equal(isAllowedStreamTarget('http://rr1---sn-xxx.googlevideo.com/videoplayback'), false);
  assert.equal(isAllowedStreamTarget('https://evilgooglevideo.com/videoplayback'), false);
  assert.equal(isAllowedStreamTarget('https://googlevideo.com.evil.test/videoplayback'), false);
  assert.equal(isAllowedStreamTarget('https://user@127.0.0.1/?googlevideo.com'), false);
  assert.equal(isAllowedStreamTarget('http://127.0.0.1:8080/admin'), false);
  assert.equal(isAllowedStreamTarget('http://169.254.169.254/latest/meta-data/'), false);
  assert.equal(isAllowedStreamTarget('file:///etc/passwd'), false);
  assert.equal(isAllowedStreamTarget('not a url'), false);
  assert.equal(isAllowedStreamTarget(''), false);
  assert.equal(isAllowedStreamTarget(null), false);
});

// 1. Audio Proxy URL Generation Contract
test('buildProxiedAudioUrl formats stream URL targeting local loopback with port and encoded target', () => {
  const targetUrl = 'https://rr1---sn-xxx.googlevideo.com/videoplayback?expire=123&id=abc';
  const port = 38945;
  const proxied = buildProxiedAudioUrl(targetUrl, port);

  assert.strictEqual(
    proxied,
    `http://127.0.0.1:${port}/stream?url=${encodeURIComponent(targetUrl)}`,
    'Proxied URL should target 127.0.0.1 on the designated port with encoded url param'
  );
  assert.ok(proxied.startsWith(`http://127.0.0.1:${port}/stream?url=`), 'Must match loopback stream endpoint');
});

test('extractTargetStreamUrl properly decodes nested query parameters and special characters', () => {
  const complexTarget = 'https://rr1---sn-xxx.googlevideo.com/videoplayback?expire=1731320000&id=abcd1234efgh&itag=251&source=youtube&range=0-1000&cpn=xyz%2B123%3D&signature=AA.BB%3D%3D';
  const port = 54321;
  const proxied = buildProxiedAudioUrl(complexTarget, port);

  const decoded = extractTargetStreamUrl(proxied);
  assert.strictEqual(decoded, complexTarget, 'Extracted target URL must match original complex URL');

  // Verify URL parameters inside the extracted URL survive without corruption
  const parsedTarget = new URL(decoded);
  assert.strictEqual(parsedTarget.searchParams.get('expire'), '1731320000');
  assert.strictEqual(parsedTarget.searchParams.get('id'), 'abcd1234efgh');
  assert.strictEqual(parsedTarget.searchParams.get('itag'), '251');
  assert.strictEqual(parsedTarget.searchParams.get('range'), '0-1000');
});

test('extractTargetStreamUrl handles invalid or missing url parameter safely', () => {
  assert.strictEqual(extractTargetStreamUrl('http://127.0.0.1:1234/stream'), null);
  assert.strictEqual(extractTargetStreamUrl('http://127.0.0.1:1234/other?foo=bar'), null);
  assert.strictEqual(extractTargetStreamUrl('invalid-url-string'), null);
  assert.strictEqual(extractTargetStreamUrl(null), null);
});

// 2. Security / CORS Headers Contract
test('AUDIO_PROXY_CORS_HEADERS contains mandatory CORS and streaming headers', () => {
  assert.strictEqual(AUDIO_PROXY_CORS_HEADERS['Access-Control-Allow-Origin'], '*');
  assert.strictEqual(AUDIO_PROXY_CORS_HEADERS['Access-Control-Allow-Methods'], 'GET, HEAD, OPTIONS');
  assert.ok(AUDIO_PROXY_CORS_HEADERS['Access-Control-Allow-Headers'].includes('Range'));
  assert.ok(AUDIO_PROXY_CORS_HEADERS['Access-Control-Allow-Headers'].includes('Content-Type'));
  assert.ok(AUDIO_PROXY_CORS_HEADERS['Access-Control-Allow-Headers'].includes('Accept'));
  assert.strictEqual(AUDIO_PROXY_CORS_HEADERS['Accept-Ranges'], 'bytes');
});

// 3. HTTP Server Behavior & OPTIONS Preflight Contract
test('OPTIONS preflight request returns HTTP 204 or 200 with required CORS headers', async () => {
  const server = createAudioProxyServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;

  try {
    const res = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: '127.0.0.1',
        port,
        path: '/stream?url=https%3A%2F%2Fexample.com%2Faudio.webm',
        method: 'OPTIONS',
        headers: {
          'Origin': 'tauri://localhost',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Range'
        }
      }, (res) => {
        resolve(res);
      });
      req.on('error', reject);
      req.end();
    });

    assert.ok(
      res.statusCode === 204 || res.statusCode === 200,
      `Expected status 204 or 200 for OPTIONS preflight, got ${res.statusCode}`
    );
    assert.strictEqual(res.headers['access-control-allow-origin'], '*');
    assert.strictEqual(res.headers['access-control-allow-methods'], 'GET, HEAD, OPTIONS');
    assert.ok(res.headers['access-control-allow-headers'].includes('Range'));
    assert.strictEqual(res.headers['accept-ranges'], 'bytes');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET request without url parameter returns 400 Bad Request with CORS header', async () => {
  const server = createAudioProxyServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;

  try {
    const res = await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: '127.0.0.1',
        port,
        path: '/stream',
        method: 'GET'
      }, resolve);
      req.on('error', reject);
      req.end();
    });

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.headers['access-control-allow-origin'], '*');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
