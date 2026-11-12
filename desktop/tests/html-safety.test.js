const { test } = require('node:test');
const assert = require('node:assert/strict');
const { escapeHtml, safeImageUrl, safeCssUrl } = require('../src/modules/html-safety');

const FALLBACK = 'assets/logo.png';

test('escapeHtml escapes every HTML-significant character', () => {
  assert.equal(escapeHtml(`<img src=x onerror="a('b')">&`), '&lt;img src=x onerror=&quot;a(&#039;b&#039;)&quot;&gt;&amp;');
});

test('escapeHtml stringifies non-string values and blanks nullish ones', () => {
  assert.equal(escapeHtml(42), '42');
  assert.equal(escapeHtml(0), '0');
  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml(undefined), '');
});

test('safeImageUrl keeps ordinary https artwork intact', () => {
  const url = 'https://i.ytimg.com/vi/abc123/hqdefault.jpg';
  assert.equal(safeImageUrl(url, FALLBACK), url);
});

test('safeImageUrl escapes query-string ampersands for attribute context', () => {
  assert.equal(
    safeImageUrl('https://ui-avatars.com/api/?name=A&background=181D24', FALLBACK),
    'https://ui-avatars.com/api/?name=A&amp;background=181D24'
  );
});

test('safeImageUrl cannot break out of a quoted attribute', () => {
  const out = safeImageUrl('https://x.test/a.jpg" onerror="alert(1)', FALLBACK);
  assert.ok(!out.includes('"'), `quote leaked: ${out}`);
});

test('safeImageUrl cannot break out of a single-quoted inline handler', () => {
  const out = safeImageUrl("https://x.test/a.jpg';alert(1);'", FALLBACK);
  assert.ok(!out.includes("'"), `apostrophe leaked: ${out}`);
});

test('safeImageUrl rejects script-capable schemes', () => {
  assert.equal(safeImageUrl('javascript:alert(1)', FALLBACK), FALLBACK);
  assert.equal(safeImageUrl(' JaVaScRiPt:alert(1)', FALLBACK), FALLBACK);
  assert.equal(safeImageUrl('data:text/html,<script>alert(1)</script>', FALLBACK), FALLBACK);
  assert.equal(safeImageUrl('vbscript:msgbox', FALLBACK), FALLBACK);
});

test('safeImageUrl rejects local file access', () => {
  assert.equal(safeImageUrl('file:///etc/passwd', FALLBACK), FALLBACK);
});

test('safeImageUrl allows inline image data URLs and bundled assets', () => {
  const svg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";
  assert.equal(safeImageUrl(svg, FALLBACK), svg.replace(/'/g, '&#039;'));
  assert.equal(safeImageUrl('data:image/jpeg;base64,AAAA', FALLBACK), 'data:image/jpeg;base64,AAAA');
  assert.equal(safeImageUrl('assets/logo.png', FALLBACK), 'assets/logo.png');
});

test('safeImageUrl falls back on empty or non-string input', () => {
  assert.equal(safeImageUrl('', FALLBACK), FALLBACK);
  assert.equal(safeImageUrl(null, FALLBACK), FALLBACK);
  assert.equal(safeImageUrl({ url: 'https://x.test' }, FALLBACK), FALLBACK);
});

test('safeImageUrl escapes the fallback too', () => {
  assert.equal(safeImageUrl('javascript:x', "data:image/svg+xml,a'b"), 'data:image/svg+xml,a&#039;b');
});

test('safeCssUrl keeps normal https artwork intact', () => {
  const url = 'https://lh3.googleusercontent.com/abc=w544-h544-l90-rj';
  assert.equal(safeCssUrl(url, FALLBACK), url);
});

test('safeCssUrl cannot close the url() token or the quoted string', () => {
  const out = safeCssUrl("https://x.test/a.jpg'); background: url(https://evil.test/track", FALLBACK);
  assert.ok(!/["'()\s]/.test(out), `css breakout chars leaked: ${out}`);
});

test('safeCssUrl rejects script-capable schemes', () => {
  assert.equal(safeCssUrl('javascript:alert(1)', FALLBACK), FALLBACK);
});

test('safeCssUrl percent-encodes quotes inside inline SVG data URLs', () => {
  assert.equal(safeCssUrl("data:image/svg+xml,%3Csvg a='b'/%3E", FALLBACK), 'data:image/svg+xml,%3Csvg%20a=%27b%27/%3E');
});

// Regression guards over src/app.js itself. The renderers build markup with
// template literals, so these keep a future edit from reintroducing a raw sink.
const fs = require('node:fs');
const APP_SRC = fs.readFileSync(require.resolve('../src/app.js'), 'utf8');

test('app.js has no inline event-handler attributes in generated markup', () => {
  const handlers = APP_SRC.match(/\son[a-z]+\s*=\s*"/g) || [];
  assert.deepEqual(handlers, [], `inline handler attributes found: ${handlers.join(', ')}`);
});

test('every img src interpolation goes through a URL sanitiser', () => {
  const raw = (APP_SRC.match(/src="\$\{[^"]*"/g) || [])
    .filter((m) => !/safeImg\(|safeImageUrl\(/.test(m));
  assert.deepEqual(raw, [], `unsanitised img src: ${raw.join(' | ')}`);
});

test('every CSS url() interpolation goes through the CSS sanitiser', () => {
  const raw = (APP_SRC.match(/url\((?:&quot;|["'])?\$\{[^}]*\}/g) || [])
    .filter((m) => !/safeCssImg\(|safeCssUrl\(/.test(m));
  assert.deepEqual(raw, [], `unsanitised css url(): ${raw.join(' | ')}`);
});
