const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const {
  buildProxiedAudioUrl,
  extractTargetStreamUrl,
  AUDIO_PROXY_CORS_HEADERS,
  createAudioProxyServer
} = require('../src/modules/audio-proxy');

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
