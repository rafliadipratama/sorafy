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
