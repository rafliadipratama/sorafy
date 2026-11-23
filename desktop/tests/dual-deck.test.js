const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  shouldTriggerPrefetch,
  calculateCrossfadeGains,
  getEffectiveCrossfadeDuration,
  createDeckState,
  swapDeckState,
  resetDeckGainsState
} = require('../src/modules/audio-deck-state');
const { SoraFyDesktopApp } = require('../src/app');

// Lightweight Jest-compatible assertion helper
function expect(actual) {
  return {
    toBe(expected) {
      assert.strictEqual(actual, expected);
    },
    toEqual(expected) {
      assert.deepStrictEqual(actual, expected);
    },
    toBeDefined() {
      assert.notStrictEqual(actual, undefined);
    },
    toBeCloseTo(expected, delta = 0.001) {
      assert.ok(
        Math.abs(actual - expected) <= delta,
        `Expected ${actual} to be close to ${expected} within delta ${delta}`
      );
    }
  };
}

// -------------------------------------------------------------
// 1. Brief Requirements & Core Prefetch Tests
// -------------------------------------------------------------
test('triggers prefetch when remaining time <= 15s', () => {
  expect(shouldTriggerPrefetch(185, 200, false)).toBe(true);
  expect(shouldTriggerPrefetch(170, 200, false)).toBe(false);
  expect(shouldTriggerPrefetch(190, 200, true)).toBe(false); // already prefetching
});

test('shouldTriggerPrefetch edge cases and custom thresholds', () => {
  // Edge cases: duration 0, negative values, NaN
  expect(shouldTriggerPrefetch(0, 0, false)).toBe(false);
  expect(shouldTriggerPrefetch(-5, 100, false)).toBe(false);
  expect(shouldTriggerPrefetch(50, -100, false)).toBe(false);
  expect(shouldTriggerPrefetch(NaN, 100, false)).toBe(false);
  expect(shouldTriggerPrefetch(50, NaN, false)).toBe(false);
  expect(shouldTriggerPrefetch(null, 100, false)).toBe(false);

  // Custom threshold parameter
  expect(shouldTriggerPrefetch(90, 100, false, 10)).toBe(true);
  expect(shouldTriggerPrefetch(85, 100, false, 10)).toBe(false);
});

// -------------------------------------------------------------
// 2. Focus Requirement: Short Track (<20s) Crossfade Clamping
// -------------------------------------------------------------
test('caps effective crossfade duration on very short tracks (<20s) to 40%', () => {
  // When crossfadeDuration >= duration on a track < 20s:
  // effective = Math.max(0, Math.floor(duration * 0.4))
  expect(getEffectiveCrossfadeDuration(15, 15)).toBe(6); // floor(15 * 0.4) = 6
  expect(getEffectiveCrossfadeDuration(10, 12)).toBe(4); // floor(10 * 0.4) = 4
  expect(getEffectiveCrossfadeDuration(5, 10)).toBe(2);  // floor(5 * 0.4) = 2
  expect(getEffectiveCrossfadeDuration(1, 5)).toBe(0);   // floor(1 * 0.4) = 0

  // When crossfadeDuration < duration on short track, keep crossfade duration
  expect(getEffectiveCrossfadeDuration(18, 5)).toBe(5);

  // Normal track (>= 20s)
  expect(getEffectiveCrossfadeDuration(200, 6)).toBe(6);
  // Normal track where crossfade >= duration
  expect(getEffectiveCrossfadeDuration(25, 30)).toBe(10); // floor(25 * 0.4) = 10

  // Zero / negative duration
  expect(getEffectiveCrossfadeDuration(0, 6)).toBe(0);
  expect(getEffectiveCrossfadeDuration(-10, 6)).toBe(0);
  expect(getEffectiveCrossfadeDuration(100, 0)).toBe(0);
});

// -------------------------------------------------------------
// 3. Brief Requirements & Crossfade Gains Calculation
// -------------------------------------------------------------
test('calculates crossfade gains correctly during transition window', () => {
  // duration 100, crossfade 6, current 97 (middle of crossfade)
  const { currentGain, nextGain } = calculateCrossfadeGains(97, 100, 6);
  expect(currentGain).toBeCloseTo(0.5, 1);
  expect(nextGain).toBeCloseTo(0.5, 1);
});

test('calculates crossfade gains: outside window, start, middle, and end', () => {
  // Outside window (before 94s)
  const before = calculateCrossfadeGains(90, 100, 6);
  expect(before.currentGain).toBe(1);
  expect(before.nextGain).toBe(0);
  expect(before.isCrossfading).toBe(false);

  // Exact start of window (94s)
  const start = calculateCrossfadeGains(94, 100, 6);
  expect(start.currentGain).toBeCloseTo(1.0);
  expect(start.nextGain).toBeCloseTo(0.0);
  expect(start.isCrossfading).toBe(true);

  // Quarter way through (95.5s)
  const quarter = calculateCrossfadeGains(95.5, 100, 6);
  expect(quarter.currentGain).toBeCloseTo(0.75);
  expect(quarter.nextGain).toBeCloseTo(0.25);

  // End of window / track end (100s)
  const end = calculateCrossfadeGains(100, 100, 6);
  expect(end.currentGain).toBeCloseTo(0.0);
  expect(end.nextGain).toBeCloseTo(1.0);

  // Past duration (clamped)
  const past = calculateCrossfadeGains(105, 100, 6);
  expect(past.currentGain).toBe(0);
  expect(past.nextGain).toBe(1);

  // Crossfade disabled (0s)
  const disabled = calculateCrossfadeGains(98, 100, 0);
  expect(disabled.currentGain).toBe(1);
  expect(disabled.nextGain).toBe(0);
  expect(disabled.isCrossfading).toBe(false);
});

test('prevents immediate crossfade on short tracks at start of song', () => {
  // Track of 10 seconds with 12s requested crossfade:
  // Effective crossfade = 4s (window starts at 6s).
  // At currentTime = 0s, track must NOT crossfade immediately!
  const atStart = calculateCrossfadeGains(0, 10, 12);
  expect(atStart.currentGain).toBe(1);
  expect(atStart.nextGain).toBe(0);
  expect(atStart.isCrossfading).toBe(false);

  // In the crossfade window at 8s (middle of 6s to 10s)
  const inWindow = calculateCrossfadeGains(8, 10, 12);
  expect(inWindow.currentGain).toBeCloseTo(0.5);
  expect(inWindow.nextGain).toBeCloseTo(0.5);
  expect(inWindow.isCrossfading).toBe(true);
});

// -------------------------------------------------------------
// 4. Deck State Machine & Ghosting Prevention Helpers
// -------------------------------------------------------------
test('createDeckState initializes clean dual-deck state', () => {
  const state = createDeckState('A');
  expect(state.activeDeck).toBe('A');
  expect(state.preloadDeck).toBe('B');
  expect(state.isCrossfading).toBe(false);
  expect(state.gains.A).toBe(1);
  expect(state.gains.B).toBe(0);
});

test('swapDeckState cleanly flips active and preload decks and resets gains', () => {
  const state = createDeckState('A');
  state.isCrossfading = true;
  state.gains.A = 0.2;
  state.gains.B = 0.8;

  swapDeckState(state);
  expect(state.activeDeck).toBe('B');
  expect(state.preloadDeck).toBe('A');
  expect(state.isCrossfading).toBe(false);
  expect(state.gains.B).toBe(1);
  expect(state.gains.A).toBe(0);

  // Swap again back to A
  swapDeckState(state);
  expect(state.activeDeck).toBe('A');
  expect(state.preloadDeck).toBe('B');
  expect(state.gains.A).toBe(1);
  expect(state.gains.B).toBe(0);
});

test('resetDeckGainsState prevents audio ghosting during manual skip/load', () => {
  const state = createDeckState('A');
  state.isCrossfading = true;
  state.gains.A = 0.4;
  state.gains.B = 0.6;

  resetDeckGainsState(state);
  expect(state.isCrossfading).toBe(false);
  expect(state.gains.A).toBe(1);
  expect(state.gains.B).toBe(0);
});

// -------------------------------------------------------------
// 5. SoraFyDesktopApp Integration: Dual-Deck & Crossfade Methods
// -------------------------------------------------------------
function createMockAudioParam(initialValue = 1.0) {
  let val = initialValue;
  return {
    get value() { return val; },
    set value(v) { val = v; },
    setValueAtTime(v, time) { val = v; this.lastTime = time; },
    lastTime: null
  };
}

function createMockAudioElement() {
  let currentTime = 0;
  let duration = 100;
  let volume = 1.0;
  let paused = true;
  let src = '';
  return {
    get currentTime() { return currentTime; },
    set currentTime(v) { currentTime = v; },
    get duration() { return duration; },
    set duration(v) { duration = v; },
    get volume() { return volume; },
    set volume(v) { volume = v; },
    get paused() { return paused; },
    set paused(v) { paused = v; },
    get src() { return src; },
    set src(v) { src = v; },
    play() { paused = false; return Promise.resolve(); },
    pause() { paused = true; },
    load() {}
  };
}

test('SoraFyDesktopApp.prototype.applyDeckGains sets gain on Web Audio nodes and elements', () => {
  const deckAGainNode = { gain: createMockAudioParam(1.0) };
  const deckBGainNode = { gain: createMockAudioParam(0.0) };
  const deckA = createMockAudioElement();
  const deckB = createMockAudioElement();

  const mockApp = {
    activeDeck: 'A',
    preloadDeck: 'B',
    deckAGainNode,
    deckBGainNode,
    deckA,
    deckB,
    audioCtx: { currentTime: 1.0 },
    currentVolume: 0.8,
    applyDeckGains: SoraFyDesktopApp.prototype.applyDeckGains
  };

  // Crossfade half-way: current 0.5, next 0.5
  mockApp.applyDeckGains(0.5, 0.5);
  expect(deckAGainNode.gain.value).toBeCloseTo(0.5);
  expect(deckBGainNode.gain.value).toBeCloseTo(0.5);
  // Web Audio GainNodes are active: maintain baseVolume (0.8) on audio elements so volume is not attenuated twice
  expect(deckA.volume).toBeCloseTo(0.8);
  expect(deckB.volume).toBeCloseTo(0.8);
});

test('SoraFyDesktopApp.prototype.applyDeckGains scales element volume directly when GainNodes absent', () => {
  const deckA = createMockAudioElement();
  const deckB = createMockAudioElement();

  const mockApp = {
    activeDeck: 'A',
    preloadDeck: 'B',
    deckA,
    deckB,
    currentVolume: 0.8,
    applyDeckGains: SoraFyDesktopApp.prototype.applyDeckGains
  };

  mockApp.applyDeckGains(0.5, 0.5);
  expect(deckA.volume).toBeCloseTo(0.4); // 0.8 * 0.5
  expect(deckB.volume).toBeCloseTo(0.4); // 0.8 * 0.5
});

test('SoraFyDesktopApp.prototype.handleCrossfadeTick drives crossfade gains and triggers swap at end', () => {
  const deckAGainNode = { gain: createMockAudioParam(1.0) };
  const deckBGainNode = { gain: createMockAudioParam(0.0) };
  const deckA = createMockAudioElement();
  const deckB = createMockAudioElement();
  deckB.src = 'https://example.com/song2.mp3';

  let swapped = false;
  const mockApp = {
    activeDeck: 'A',
    preloadDeck: 'B',
    deckAGainNode,
    deckBGainNode,
    deckA,
    deckB,
    audioCtx: { currentTime: 0.5 },
    appSettings: { crossfadeDuration: 6 },
    tracks: [{ title: 'Song 1', duration_secs: 100 }],
    currentTrackIndex: 0,
    isCrossfading: false,
    applyDeckGains: SoraFyDesktopApp.prototype.applyDeckGains,
    handleCrossfadeTick: SoraFyDesktopApp.prototype.handleCrossfadeTick,
    swapDecks() { swapped = true; }
  };

  // Before crossfade window at 90s
  deckA.currentTime = 90;
  deckA.duration = 100;
  const tick1 = mockApp.handleCrossfadeTick();
  expect(tick1.isCrossfading).toBe(false);
  expect(tick1.currentGain).toBe(1);
  expect(deckB.paused).toBe(true);

  // In crossfade window at 97s
  deckA.currentTime = 97;
  const tick2 = mockApp.handleCrossfadeTick();
  expect(tick2.isCrossfading).toBe(true);
  expect(tick2.currentGain).toBeCloseTo(0.5);
  expect(tick2.nextGain).toBeCloseTo(0.5);
  expect(mockApp.isCrossfading).toBe(true);
  expect(deckB.paused).toBe(false); // Playback was started on preload deck!

  // At 100s: crossfade completes, swapDecks should be called
  deckA.currentTime = 100;
  mockApp.handleCrossfadeTick();
  expect(swapped).toBe(true);
});

test('SoraFyDesktopApp.prototype.swapDecks switches active deck and stops old deck cleanly', () => {
  const deckA = createMockAudioElement();
  const deckB = createMockAudioElement();
  deckA.paused = false;
  deckA.currentTime = 100;
  deckB.paused = false;

  const deckAGainNode = { gain: createMockAudioParam(0.0) };
  const deckBGainNode = { gain: createMockAudioParam(1.0) };

  const mockApp = {
    activeDeck: 'A',
    preloadDeck: 'B',
    deckA,
    deckB,
    audio: deckA,
    preloadAudio: deckB,
    deckAGainNode,
    deckBGainNode,
    audioCtx: { currentTime: 0 },
    currentVolume: 1.0,
    tracks: [
      { id: '1', title: 'Track 1' },
      { id: '2', title: 'Track 2' }
    ],
    currentTrackIndex: 0,
    preloadedTrackIndex: 1,
    isCrossfading: true,
    isNextTrackPreloaded: true,
    applyDeckGains: SoraFyDesktopApp.prototype.applyDeckGains,
    resetDeckGains: SoraFyDesktopApp.prototype.resetDeckGains,
    swapDecks: SoraFyDesktopApp.prototype.swapDecks
  };

  mockApp.swapDecks();

  // Active deck is now B, preload deck is now A
  expect(mockApp.activeDeck).toBe('B');
  expect(mockApp.preloadDeck).toBe('A');
  expect(mockApp.currentTrackIndex).toBe(1);
  expect(mockApp.isCrossfading).toBe(false);
  expect(mockApp.isNextTrackPreloaded).toBe(false);

  // Old deck (A) is paused and reset to 0
  expect(deckA.paused).toBe(true);
  expect(deckA.currentTime).toBe(0);

  // Deck gains reset: active (B) is 1, preload (A) is 0
  expect(deckBGainNode.gain.value).toBe(1.0);
  expect(deckAGainNode.gain.value).toBe(0.0);
});

test('manual loadTrack / skip resets crossfade state to prevent audio ghosting', () => {
  const deckA = createMockAudioElement();
  const deckB = createMockAudioElement();
  deckB.paused = false;
  deckB.src = 'https://example.com/ghost.mp3';

  const deckAGainNode = { gain: createMockAudioParam(0.3) };
  const deckBGainNode = { gain: createMockAudioParam(0.7) };

  const mockApp = {
    activeDeck: 'A',
    preloadDeck: 'B',
    deckA,
    deckB,
    audio: deckA,
    preloadAudio: deckB,
    deckAGainNode,
    deckBGainNode,
    audioCtx: { currentTime: 0 },
    currentVolume: 1.0,
    isCrossfading: true,
    applyDeckGains: SoraFyDesktopApp.prototype.applyDeckGains,
    resetDeckGains: SoraFyDesktopApp.prototype.resetDeckGains
  };

  mockApp.resetDeckGains();

  expect(mockApp.isCrossfading).toBe(false);
  expect(deckAGainNode.gain.value).toBe(1.0);
  expect(deckBGainNode.gain.value).toBe(0.0);
  expect(deckB.paused).toBe(true);
  expect(deckB.currentTime).toBe(0);
});

// -------------------------------------------------------------
// 7. Repeat This Track (repeatMode === 2) Integration
// -------------------------------------------------------------
test('handleCrossfadeTick does not initiate crossfade when repeatMode === 2 (Repeat This Track)', () => {
  const deckA = createMockAudioElement();
  const deckB = createMockAudioElement();
  deckA.currentTime = 98;
  deckA.duration = 100;
  deckB.src = 'https://example.com/song2.mp3';

  let swapped = false;
  const mockApp = {
    activeDeck: 'A',
    preloadDeck: 'B',
    deckA,
    deckB,
    repeatMode: 2,
    appSettings: { crossfadeDuration: 6 },
    tracks: [{ title: 'Song 1', duration_secs: 100 }],
    currentTrackIndex: 0,
    isCrossfading: false,
    applyDeckGains: SoraFyDesktopApp.prototype.applyDeckGains,
    resetDeckGains: SoraFyDesktopApp.prototype.resetDeckGains,
    handleCrossfadeTick: SoraFyDesktopApp.prototype.handleCrossfadeTick,
    swapDecks() { swapped = true; }
  };

  const tick = mockApp.handleCrossfadeTick();
  expect(tick.isCrossfading).toBe(false);
  expect(tick.currentGain).toBe(1.0);
  expect(tick.nextGain).toBe(0.0);
  expect(swapped).toBe(false);
  expect(deckB.paused).toBe(true);
});

test('swapDecks preserves currentTrackIndex and restarts active audio when repeatMode === 2', () => {
  const deckA = createMockAudioElement();
  const deckB = createMockAudioElement();
  deckA.currentTime = 100;
  deckA.paused = true;

  const deckAGainNode = { gain: createMockAudioParam(0.0) };
  const deckBGainNode = { gain: createMockAudioParam(1.0) };

  const mockApp = {
    activeDeck: 'A',
    preloadDeck: 'B',
    deckA,
    deckB,
    audio: deckA,
    preloadAudio: deckB,
    deckAGainNode,
    deckBGainNode,
    audioCtx: { currentTime: 0 },
    currentVolume: 1.0,
    repeatMode: 2,
    tracks: [
      { id: '1', title: 'Track 1' },
      { id: '2', title: 'Track 2' }
    ],
    currentTrackIndex: 0,
    preloadedTrackIndex: 1,
    isCrossfading: true,
    applyDeckGains: SoraFyDesktopApp.prototype.applyDeckGains,
    resetDeckGains: SoraFyDesktopApp.prototype.resetDeckGains,
    swapDecks: SoraFyDesktopApp.prototype.swapDecks
  };

  mockApp.swapDecks();

  // Active deck remains A, track index remains 0, audio replayed from 0
  expect(mockApp.activeDeck).toBe('A');
  expect(mockApp.currentTrackIndex).toBe(0);
  expect(deckA.currentTime).toBe(0);
  expect(deckA.paused).toBe(false);
  expect(mockApp.isCrossfading).toBe(false);
});

test('onTrackEnded replays active track and keeps currentTrackIndex intact when repeatMode === 2', () => {
  const deckA = createMockAudioElement();
  const deckB = createMockAudioElement();
  deckA.currentTime = 180;
  deckA.paused = true;

  const mockApp = {
    activeDeck: 'A',
    preloadDeck: 'B',
    deckA,
    deckB,
    audio: deckA,
    preloadAudio: deckB,
    repeatMode: 2,
    tracks: [
      { id: '1', title: 'Track 1' },
      { id: '2', title: 'Track 2' }
    ],
    currentTrackIndex: 0,
    isCrossfading: false,
    isPlaying: false,
    applyDeckGains: SoraFyDesktopApp.prototype.applyDeckGains,
    resetDeckGains: SoraFyDesktopApp.prototype.resetDeckGains,
    onTrackEnded: SoraFyDesktopApp.prototype.onTrackEnded
  };

  mockApp.onTrackEnded();

  expect(mockApp.currentTrackIndex).toBe(0);
  expect(deckA.currentTime).toBe(0);
  expect(deckA.paused).toBe(false);
  expect(mockApp.isPlaying).toBe(true);
});

test('preloadNextTrack does nothing when repeatMode === 2', () => {
  const mockApp = {
    repeatMode: 2,
    tracks: [
      { id: '1', title: 'Track 1' },
      { id: '2', title: 'Track 2' }
    ],
    currentTrackIndex: 0,
    preloadedTrackIndex: -1,
    preloadNextTrack: SoraFyDesktopApp.prototype.preloadNextTrack
  };

  mockApp.preloadNextTrack();
  expect(mockApp.preloadedTrackIndex).toBe(-1);
});

test('onTimeUpdate auto-advances via onTrackEnded when stream reaches end within 0.35s', () => {
  let onTrackEndedCalled = false;
  const mockAudio = {
    currentTime: 207.8,
    duration: 208,
    ended: false
  };

  const mockApp = {
    audio: mockAudio,
    tracks: [{ id: '1', title: 'Track 1', duration_secs: 208 }],
    currentTrackIndex: 0,
    isPlaying: true,
    isSeekingBottom: false,
    isSeekingScreen: false,
    currentTimeLabel: { textContent: '' },
    durationLabel: { textContent: '' },
    formatTime: SoraFyDesktopApp.prototype.formatTime,
    onTrackEnded() {
      onTrackEndedCalled = true;
    },
    onTimeUpdate: SoraFyDesktopApp.prototype.onTimeUpdate
  };

  mockApp.onTimeUpdate();
  expect(onTrackEndedCalled).toBe(true);
});

test('playNext advances to next track immediately when upcoming tracks exist in queue', () => {
  let loadedTrackIndex = -1;
  const mockApp = {
    tracks: [
      { id: '1', title: 'Song 1' },
      { id: '2', title: 'Song 2' },
      { id: '3', title: 'Song 3' }
    ],
    currentTrackIndex: 0,
    isPlaying: true,
    isShuffled: false,
    repeatMode: 0,
    appSettings: { crossfadeDuration: 0 },
    loadTrack(idx) {
      loadedTrackIndex = idx;
    },
    ensureUpcomingQueue: async () => {},
    playNext: SoraFyDesktopApp.prototype.playNext
  };

  mockApp.playNext();
  expect(loadedTrackIndex).toBe(1);
});

test('checkPlaybackProgress auto-advances playback even when timeupdate stops firing at end of stream', () => {
  let onTrackEndedCalled = false;
  const mockAudio = {
    currentTime: 218,
    duration: 218,
    ended: false,
    paused: false
  };

  const mockApp = {
    audio: mockAudio,
    activeDeck: 'A',
    deckA: mockAudio,
    tracks: [{ id: 'yt_december', title: 'December (again)', duration_secs: 218 }],
    currentTrackIndex: 0,
    isPlaying: true,
    isSeekingBottom: false,
    isSeekingScreen: false,
    _isUserPaused: false,
    _endOfTrackHandled: false,
    onTrackEnded() {
      onTrackEndedCalled = true;
    },
    checkPlaybackProgress: SoraFyDesktopApp.prototype.checkPlaybackProgress
  };

  mockApp.checkPlaybackProgress();
  expect(onTrackEndedCalled).toBe(true);
  expect(mockApp._endOfTrackHandled).toBe(true);
});

test('checkPlaybackProgress catches stalled playback at near-end and triggers onTrackEnded', () => {
  let onTrackEndedCalled = false;
  const mockAudio = {
    currentTime: 217.2,
    duration: 218,
    ended: false,
    paused: false
  };

  const mockApp = {
    audio: mockAudio,
    activeDeck: 'A',
    deckA: mockAudio,
    tracks: [{ id: 'yt_december', title: 'December (again)', duration_secs: 218 }],
    currentTrackIndex: 0,
    isPlaying: true,
    isSeekingBottom: false,
    isSeekingScreen: false,
    _isUserPaused: false,
    _endOfTrackHandled: false,
    _lastWatchdogPos: 217.2,
    _lastWatchdogPosTime: Date.now() - 1500, // stalled for 1.5s
    onTrackEnded() {
      onTrackEndedCalled = true;
    },
    checkPlaybackProgress: SoraFyDesktopApp.prototype.checkPlaybackProgress
  };

  mockApp.checkPlaybackProgress();
  expect(onTrackEndedCalled).toBe(true);
});

test('checkPlaybackProgress triggers auto-advance when stream is within 1.2s of duration (e.g. 2:23 / 2:24)', () => {
  let onTrackEndedCalled = false;
  const mockAudio = {
    currentTime: 143.0,
    duration: 144.0, // 2:23 / 2:24
    ended: false,
    paused: false
  };

  const mockApp = {
    audio: mockAudio,
    activeDeck: 'A',
    deckA: mockAudio,
    tracks: [{ id: 'yt_mcr_track', title: 'It\'s Not a Fashion Statement', duration_secs: 144 }],
    currentTrackIndex: 0,
    isPlaying: true,
    isSeekingBottom: false,
    isSeekingScreen: false,
    _isUserPaused: false,
    _endOfTrackHandled: false,
    onTrackEnded() {
      onTrackEndedCalled = true;
    },
    checkPlaybackProgress: SoraFyDesktopApp.prototype.checkPlaybackProgress
  };

  mockApp.checkPlaybackProgress();
  expect(onTrackEndedCalled).toBe(true);
  expect(mockApp._endOfTrackHandled).toBe(true);
});

test('checkPlaybackProgress recovers stuck playback after stall timeout by calling playNext', () => {
  let playNextCalled = false;
  const mockAudio = {
    currentTime: 143.2,
    duration: 144.0,
    ended: false,
    paused: false
  };

  const mockApp = {
    audio: mockAudio,
    activeDeck: 'A',
    deckA: mockAudio,
    tracks: [{ id: 'yt_mcr_track', title: 'It\'s Not a Fashion Statement', duration_secs: 144 }],
    currentTrackIndex: 0,
    isPlaying: true,
    isSeekingBottom: false,
    isSeekingScreen: false,
    _isUserPaused: false,
    _endOfTrackHandled: true,
    _endOfTrackTriggerTime: Date.now() - 2000, // triggered 2s ago but still stuck
    playNext() {
      playNextCalled = true;
    },
    checkPlaybackProgress: SoraFyDesktopApp.prototype.checkPlaybackProgress
  };

  mockApp.checkPlaybackProgress();
  expect(playNextCalled).toBe(true);
});

test('renderArtistTopTracks slices display to 5 songs and displays accurate Top Songs count', () => {
  const mockList = { innerHTML: '', appendChild() {} };
  const mockCount = { textContent: '' };
  const sampleTracks = [
    { id: '1', title: 'Song 1' },
    { id: '2', title: 'Song 2' },
    { id: '3', title: 'Song 3' },
    { id: '4', title: 'Song 4' },
    { id: '5', title: 'Song 5' },
    { id: '6', title: 'Song 6' },
    { id: '7', title: 'Song 7' }
  ];

  const mockApp = {
    artistTopTracksList: mockList,
    artistPopularCount: mockCount,
    currentLanguage: 'en',
    tracks: [],
    currentTrackIndex: 0,
    likedTrackIds: new Set(),
    createTrackRow: () => ({}),
    renderArtistTopTracks: SoraFyDesktopApp.prototype.renderArtistTopTracks
  };

  mockApp.renderArtistTopTracks(sampleTracks);
  expect(mockCount.textContent).toBe('5 Top Songs');

  mockApp.currentLanguage = 'id';
  mockApp.renderArtistTopTracks(sampleTracks);
  expect(mockCount.textContent).toBe('5 Lagu Teratas');
});

test('highlightActiveSongItems toggles track-row active class and animates equalizer bars', () => {
  const origDoc = global.document;

  function createMockElement(id, classes, trackId) {
    const classSet = new Set(classes);
    let children = [];
    return {
      id,
      getAttribute(attr) {
        if (attr === 'data-track-id') return trackId;
        return null;
      },
      classList: {
        contains(c) { return classSet.has(c); },
        add(c) { classSet.add(c); },
        remove(c) { classSet.delete(c); },
        toggle(c, force) {
          if (force !== undefined) {
            if (force) classSet.add(c); else classSet.delete(c);
            return force;
          }
          if (classSet.has(c)) { classSet.delete(c); return false; }
          classSet.add(c);
          return true;
        }
      },
      querySelector(sel) {
        if (sel === '.track-row-num') {
          return {
            querySelector(s) {
              return children.find(ch => ch.className === s.replace('.', '')) || null;
            },
            appendChild(child) {
              children.push(child);
            }
          };
        }
        return children.find(ch => ch.className === sel.replace('.', '')) || null;
      }
    };
  }

  const row1 = createMockElement('track_row_yt_song1', ['track-row'], 'yt_song1');
  const row2 = createMockElement('track_row_yt_song2', ['track-row', 'active'], 'yt_song2');

  const rows = [row1, row2];

  global.document = {
    querySelectorAll(sel) {
      if (sel === '.track-row') return rows;
      if (sel === '.ytm-song-item' || sel === '.queue-item') return [];
      return [];
    },
    createElement(tag) {
      return {
        className: '',
        innerHTML: '',
        remove() {}
      };
    }
  };

  try {
    const mockApp = {
      tracks: [
        { id: 'yt_song1', title: 'Song 1' },
        { id: 'yt_song2', title: 'Song 2' }
      ],
      currentTrackIndex: 0, // Song 1 is now active!
      isPlaying: true,
      highlightActiveSongItems: SoraFyDesktopApp.prototype.highlightActiveSongItems
    };

    mockApp.highlightActiveSongItems();

    expect(row1.classList.contains('active')).toBe(true);
    expect(row2.classList.contains('active')).toBe(false);
  } finally {
    global.document = origDoc;
  }
});
