const { test } = require('node:test');
const assert = require('node:assert/strict');

const { normalizeAudioQuality, pickAudioFormat, AUDIO_QUALITY_VALUES } = require('../src/modules/audio-format');

// A typical YouTube adaptiveFormats audio set: Opus at three bitrates plus AAC.
const FORMATS = [
  { itag: 249, bitrate: 50000, mimeType: 'audio/webm; codecs="opus"', url: 'https://x/249' },
  { itag: 250, bitrate: 70000, mimeType: 'audio/webm; codecs="opus"', url: 'https://x/250' },
  { itag: 251, bitrate: 160000, mimeType: 'audio/webm; codecs="opus"', url: 'https://x/251' },
  { itag: 140, bitrate: 130000, mimeType: 'audio/mp4; codecs="mp4a.40.2"', url: 'https://x/140' }
];

test('every selectable quality is a known value', () => {
  assert.deepEqual(AUDIO_QUALITY_VALUES, ['saver', 'high', 'max']);
});

test('settings saved by older builds map onto the current values', () => {
  assert.equal(normalizeAudioQuality('auto'), 'high');
  assert.equal(normalizeAudioQuality('lossless'), 'max');
});

test('an unknown or missing quality falls back to high', () => {
  assert.equal(normalizeAudioQuality(undefined), 'high');
  assert.equal(normalizeAudioQuality(null), 'high');
  assert.equal(normalizeAudioQuality(''), 'high');
  assert.equal(normalizeAudioQuality('ultra'), 'high');
  assert.equal(normalizeAudioQuality(42), 'high');
});

test('a known quality survives normalization, whatever its casing', () => {
  assert.equal(normalizeAudioQuality('saver'), 'saver');
  assert.equal(normalizeAudioQuality('  MAX '), 'max');
});

test('each quality picks a different rendition', () => {
  assert.equal(pickAudioFormat(FORMATS, 'saver').itag, 249);
  assert.equal(pickAudioFormat(FORMATS, 'high').itag, 251);
  assert.equal(pickAudioFormat(FORMATS, 'max').itag, 251);
});

test('max picks the highest bitrate even when it is not Opus', () => {
  const aacWins = [
    { itag: 251, bitrate: 160000, mimeType: 'audio/webm; codecs="opus"', url: 'https://x/251' },
    { itag: 141, bitrate: 256000, mimeType: 'audio/mp4; codecs="mp4a.40.2"', url: 'https://x/141' }
  ];
  assert.equal(pickAudioFormat(aacWins, 'max').itag, 141);
});

test('a video with no Opus audio still resolves', () => {
  const aacOnly = FORMATS.filter((f) => f.mimeType.includes('mp4'));
  assert.equal(pickAudioFormat(aacOnly, 'high').itag, 140);
  assert.equal(pickAudioFormat(aacOnly, 'saver').itag, 140);
});

test('renditions with no url are never chosen', () => {
  const noUrl = FORMATS.map((f) => (f.itag === 251 ? { ...f, url: undefined } : f));
  assert.equal(pickAudioFormat(noUrl, 'high').itag, 140);
  assert.equal(pickAudioFormat(noUrl, 'max').itag, 140);
});

test('video renditions are ignored', () => {
  const mixed = [
    { itag: 137, bitrate: 4000000, mimeType: 'video/mp4; codecs="avc1"', url: 'https://x/137' },
    ...FORMATS
  ];
  assert.equal(pickAudioFormat(mixed, 'max').itag, 251);
});

test('an unusable format list yields null rather than a guess', () => {
  assert.equal(pickAudioFormat([], 'high'), null);
  assert.equal(pickAudioFormat(null, 'high'), null);
  assert.equal(pickAudioFormat(undefined, 'high'), null);
  assert.equal(pickAudioFormat([{ itag: 1 }], 'high'), null);
});

test('an unranked itag is still usable when nothing ranked is offered', () => {
  const odd = [{ itag: 774, bitrate: 256000, mimeType: 'audio/webm; codecs="opus"', url: 'https://x/774' }];
  assert.equal(pickAudioFormat(odd, 'high').itag, 774);
  assert.equal(pickAudioFormat(odd, 'saver').itag, 774);
});

test('saver prefers the smallest stream when no ranked itag is offered', () => {
  const unranked = [
    { itag: 801, bitrate: 240000, mimeType: 'audio/webm; codecs="opus"', url: 'https://x/801' },
    { itag: 802, bitrate: 60000, mimeType: 'audio/webm; codecs="opus"', url: 'https://x/802' }
  ];
  assert.equal(pickAudioFormat(unranked, 'saver').itag, 802);
  assert.equal(pickAudioFormat(unranked, 'max').itag, 801);
});
