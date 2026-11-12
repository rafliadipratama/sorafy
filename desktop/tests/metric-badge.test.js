const { test } = require('node:test');
const assert = require('node:assert/strict');
const { SoraFyDesktopApp } = require('../src/app');

function createMockApp(lang = 'id') {
  return {
    settings: { language: lang },
    currentLanguage: lang,
    formatMetricCount: SoraFyDesktopApp.prototype.formatMetricCount,
    getTrackMetricLabel: SoraFyDesktopApp.prototype.getTrackMetricLabel,
    parseMetricToNumber: SoraFyDesktopApp.prototype.parseMetricToNumber,
    normalizeSearchText: SoraFyDesktopApp.prototype.normalizeSearchText
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

test('parseMetricToNumber converts metric text to accurate numbers', () => {
  const app = createMockApp('id');
  assert.strictEqual(app.parseMetricToNumber('2.3B plays'), 2300000000);
  assert.strictEqual(app.parseMetricToNumber('122 jt pemutaran'), 122000000);
  assert.strictEqual(app.parseMetricToNumber('10 rb pemutaran'), 10000);
  assert.strictEqual(app.parseMetricToNumber('500K plays'), 500000);
  assert.strictEqual(app.parseMetricToNumber('1.6B views'), 1600000000);
  assert.strictEqual(app.parseMetricToNumber(12345), 12345);
  assert.strictEqual(app.parseMetricToNumber(null), 0);
});

test('normalizeSearchText strips punctuation and handles hyphenated phrases', () => {
  const app = createMockApp('id');
  assert.strictEqual(app.normalizeSearchText('Ada titik-titik di ujung doa'), 'ada titik titik di ujung doa');
  assert.strictEqual(app.normalizeSearchText('Ada Titik Titik di Ujung Doa'), 'ada titik titik di ujung doa');
  assert.strictEqual(app.normalizeSearchText('Sal Priadi - Dari planet lain (Official Video)!'), 'sal priadi dari planet lain official video');
});

test('candidate matching prioritizes official track with 122M plays over cover with 10k plays', () => {
  const app = createMockApp('id');
  const query = 'ada titik titik di ujung doa';
  const normQ = app.normalizeSearchText(query);
  const cleanQ = query.trim().toLowerCase();

  const candidates = [
    {
      id: 'eva_1',
      title: 'Ada Titik Titik di Ujung Doa',
      artist: 'Eva Pradila',
      play_count_text: '10 rb pemutaran'
    },
    {
      id: 'sal_1',
      title: 'Ada titik-titik di ujung doa',
      artist: 'Sal Priadi',
      play_count_text: '122 jt pemutaran'
    }
  ];

  const matched = candidates.filter(s => {
    const normT = app.normalizeSearchText(s.title);
    const st = s.title.trim().toLowerCase();
    return normT === normQ || normT.startsWith(normQ) || normQ.startsWith(normT) ||
           st === cleanQ || st.startsWith(cleanQ) || cleanQ.startsWith(st);
  });

  matched.sort((a, b) => {
    const playsA = app.parseMetricToNumber(a.play_count_text || 0);
    const playsB = app.parseMetricToNumber(b.play_count_text || 0);
    return playsB - playsA;
  });

  assert.strictEqual(matched.length, 2);
  assert.strictEqual(matched[0].artist, 'Sal Priadi');
  assert.strictEqual(matched[0].id, 'sal_1');
  assert.strictEqual(matched[1].artist, 'Eva Pradila');
});
