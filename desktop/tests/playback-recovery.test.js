const { test } = require('node:test');
const assert = require('node:assert/strict');

const { SoraFyDesktopApp } = require('../src/app');

// Minimal renderer stand-in: enough surface for loadTrack to run without a DOM.
function createMockApp(track) {
  return {
    tracks: [track],
    currentTrackIndex: 0,
    audio: { src: '', load() {}, pause() {}, removeAttribute() {}, addEventListener() {} },
    preloadAudio: { pause() {}, load() {}, removeAttribute() {}, currentTime: 0 },
    playerTitle: { innerHTML: '' },
    playerArtwork: { src: '' },
    currentTimeLabel: { textContent: '' },
    durationLabel: { textContent: '' },
    playerBadge: { textContent: '' },
    screenPlayerBadge: { textContent: '' },
    likedTrackIds: new Set(),
    resetDeckGains() {},
    showPlayerBuffering() {},
    updatePlayPauseIcon() {},
    escapeHtml: (s) => s,
    renderBottomPlayerArtist() {},
    updateVerificationBadge() {},
    formatTime: () => '03:00',
    updateScreenPlayer() {},
    highlightActiveSongItems() {},
    recordTasteAffinity() {},
    updateLikeButton() {},
    updateLyricsOffsetUI() {},
    recordPlayHistory() {},
    fetchTrackLyrics() {},
    updateMediaSession() {},
    updateDiscordPresence() {},
    renderQueue() {},
    ensureUpcomingQueue() {},
    audioFormatFromStream: SoraFyDesktopApp.prototype.audioFormatFromStream,
    loadTrack: SoraFyDesktopApp.prototype.loadTrack
  };
}

async function withRenderer(electronAPI, fn) {
  const originalWindow = global.window;
  const originalDocument = global.document;
  global.window = { electronAPI };
  global.document = { querySelector: () => null };
  try {
    await fn();
  } finally {
    global.window = originalWindow;
    global.document = originalDocument;
  }
}

test('loading a track again restores its one fresh-stream retry', async () => {
  const track = { id: 'yt_abc', title: 'Song', artist: 'Artist', _retryFreshStream: true };
  const app = createMockApp(track);

  await withRenderer({
    checkLocalAudioExists: async () => ({ exists: false }),
    resolveFullStream: async () => ({ url: 'https://x/stream' })
  }, () => app.loadTrack(0, false, 0));

  assert.equal(track._retryFreshStream, undefined);
});

function createRecoveryApp() {
  const played = [];
  const audio = {
    src: '',
    currentTime: 0,
    load() {},
    play: async () => { played.push(audio.src); }
  };
  return {
    app: { audio, _currentLoadId: 1, playWithFreshStream: SoraFyDesktopApp.prototype.playWithFreshStream },
    played
  };
}

test('a stalled track re-resolves with forceRefresh and resumes where it was', async () => {
  const { app, played } = createRecoveryApp();
  const track = { title: 'Song', artist: 'Artist', video_id: 'abc', stream_url: 'https://x/dead' };
  let request = null;

  await withRenderer({
    resolveFullStream: async (req) => { request = req; return { url: 'https://x/fresh' }; }
  }, async () => {
    assert.equal(await app.playWithFreshStream(track, 1, 42), true);
  });

  assert.equal(request.forceRefresh, true);
  assert.equal(track.stream_url, 'https://x/fresh');
  assert.deepEqual(played, ['https://x/fresh']);
  assert.equal(app.audio.currentTime, 42);
});

test('fresh-stream recovery runs at most once per playback attempt', async () => {
  const { app } = createRecoveryApp();
  const track = { title: 'Song', artist: 'Artist' };
  let calls = 0;

  await withRenderer({
    resolveFullStream: async () => { calls += 1; return { url: 'https://x/fresh' }; }
  }, async () => {
    await app.playWithFreshStream(track, 1);
    assert.equal(await app.playWithFreshStream(track, 1), false);
  });

  assert.equal(calls, 1);
});

test('recovery reports failure when no stream resolves', async () => {
  const { app, played } = createRecoveryApp();

  await withRenderer({ resolveFullStream: async () => null }, async () => {
    assert.equal(await app.playWithFreshStream({ title: 'Song' }, 1), false);
  });

  assert.deepEqual(played, []);
});

test('recovery does not touch the player once a newer track has loaded', async () => {
  const { app, played } = createRecoveryApp();

  await withRenderer({
    resolveFullStream: async () => { app._currentLoadId = 2; return { url: 'https://x/fresh' }; }
  }, async () => {
    assert.equal(await app.playWithFreshStream({ title: 'Song' }, 1), false);
  });

  assert.deepEqual(played, []);
  assert.equal(app.audio.src, '');
});
