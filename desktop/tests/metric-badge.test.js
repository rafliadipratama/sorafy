const { test } = require('node:test');
const assert = require('node:assert/strict');
const { SoraFyDesktopApp } = require('../src/app');

function createMockApp(lang = 'id') {
  return {
    settings: { language: lang },
    currentLanguage: lang,
    formatMetricCount: SoraFyDesktopApp.prototype.formatMetricCount,
    getTrackMetricLabel: SoraFyDesktopApp.prototype.getTrackMetricLabel
  };
}

test('formatMetricCount formats raw numbers into localized metrics for songs and videos', () => {
  const app = createMockApp('id');

  // Indonesian format
  assert.strictEqual(app.formatMetricCount(2300000000, false, 'id'), '2,3 M diputar');
  assert.strictEqual(app.formatMetricCount(229400000, false, 'id'), '229,4 jt diputar');
  assert.strictEqual(app.formatMetricCount(500000, false, 'id'), '500 rb diputar');
  assert.strictEqual(app.formatMetricCount(1600000000, true, 'id'), '1,6 M ditonton');
  assert.strictEqual(app.formatMetricCount(15000000, true, 'id'), '15 jt ditonton');

  // English format
  assert.strictEqual(app.formatMetricCount(2300000000, false, 'en'), '2.3B plays');
  assert.strictEqual(app.formatMetricCount(229400000, false, 'en'), '229.4M plays');
  assert.strictEqual(app.formatMetricCount(500000, false, 'en'), '500K plays');
  assert.strictEqual(app.formatMetricCount(1600000000, true, 'en'), '1.6B views');
  assert.strictEqual(app.formatMetricCount(15000000, true, 'en'), '15M views');
});

test('formatMetricCount safely converts and preserves pre-formatted InnerTube strings', () => {
  const app = createMockApp('id');

  // English string to Indonesian
  assert.strictEqual(app.formatMetricCount('2.3B plays', false, 'id'), '2,3 M diputar');
  assert.strictEqual(app.formatMetricCount('1.6B views', true, 'id'), '1,6 M ditonton');
  assert.strictEqual(app.formatMetricCount('19M plays', false, 'id'), '19 jt diputar');

  // Indonesian string to English
  assert.strictEqual(app.formatMetricCount('2,3 M pemutaran', false, 'en'), '2.3B plays');
  assert.strictEqual(app.formatMetricCount('1,6 M x ditonton', true, 'en'), '1.6B views');
  assert.strictEqual(app.formatMetricCount('19 jt pemutaran', false, 'en'), '19M plays');

  // Passthrough in matching locale
  assert.strictEqual(app.formatMetricCount('2.3B plays', false, 'en'), '2.3B plays');
  assert.strictEqual(app.formatMetricCount('2,3 M pemutaran', false, 'id'), '2,3 M pemutaran');
});

test('getTrackMetricLabel accurately distinguishes songs (plays) from videos (views)', () => {
  const app = createMockApp('en');

  // 1. Song with play_count_text
  const songTrack = {
    title: 'Creep',
    artist: 'Radiohead',
    is_video: false,
    play_count_text: '2.3B plays'
  };
  assert.strictEqual(app.getTrackMetricLabel(songTrack), '2.3B plays');

  // 2. Video with view_count_text
  const videoTrack = {
    title: 'Creep (Official Music Video)',
    artist: 'Radiohead',
    is_video: true,
    view_count_text: '1.6B views'
  };
  assert.strictEqual(app.getTrackMetricLabel(videoTrack), '1.6B views');

  // 3. Song with raw view_count from stream resolution
  const streamSong = {
    title: 'Karma Police',
    artist: 'Radiohead',
    is_video: false,
    view_count: '229380139'
  };
  assert.strictEqual(app.getTrackMetricLabel(streamSong), '229.4M plays');

  // 4. Video with raw view_count from stream resolution
  const streamVideo = {
    title: 'Karma Police (Live)',
    artist: 'Radiohead',
    is_video: true,
    view_count: '1624000000'
  };
  assert.strictEqual(app.getTrackMetricLabel(streamVideo), '1.6B views');
});
