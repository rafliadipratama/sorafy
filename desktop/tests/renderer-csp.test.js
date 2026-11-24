const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '../src/index.html'), 'utf8');
const csp = (html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/) || [])[1] || '';
const directive = (name) => (csp.split(';').map((d) => d.trim()).find((d) => d.startsWith(name + ' ')) || '');

test('renderer declares a Content-Security-Policy', () => {
  assert.ok(csp, 'index.html must carry a CSP meta tag');
});

test('script-src forbids injected and evaluated script', () => {
  const scriptSrc = directive('script-src');
  assert.ok(scriptSrc, 'script-src must be set explicitly');
  assert.ok(!scriptSrc.includes("'unsafe-inline'"));
  assert.ok(!scriptSrc.includes("'unsafe-eval'"));
  assert.ok(!/\shttps?:(\s|$)/.test(scriptSrc), 'script-src must not allow arbitrary remote hosts');
  assert.equal(directive('object-src'), "object-src 'none'");
});

test('every inline script is pinned by a matching sha256 source', () => {
  const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  for (const body of inline) {
    const hash = crypto.createHash('sha256').update(body).digest('base64');
    assert.ok(directive('script-src').includes(`'sha256-${hash}'`), `inline script changed; update CSP hash to sha256-${hash}`);
  }
});
