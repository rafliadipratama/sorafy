/**
 * SoraFy Desktop - Dual-Deck Audio State & Crossfade Engine
 * Manages dual-deck transitions, silent prefetching, and gapless crossfading.
 */

/**
 * Determines if prefetching the next track in queue should be triggered.
 *
 * @param {number} currentTime Current playback position in seconds
 * @param {number} duration Total duration of current track in seconds
 * @param {boolean} isAlreadyPrefetching Whether next track is already buffered / prefetching
 * @param {number} [threshold=15] Remaining time threshold in seconds
 * @returns {boolean} True if prefetch should be initiated
 */
function shouldTriggerPrefetch(currentTime, duration, isAlreadyPrefetching, threshold = 15) {
  if (isAlreadyPrefetching) return false;
  if (typeof currentTime !== 'number' || isNaN(currentTime) || currentTime < 0) return false;
  if (typeof duration !== 'number' || isNaN(duration) || duration <= 0) return false;

  const remaining = duration - currentTime;
  return remaining <= threshold;
}

/**
 * Calculates effective crossfade duration with safety clamping for short tracks.
 * Lagu dengan durasi sangat pendek (<20 detik): jika crossfadeDuration >= duration,
 * batasi crossfade efektif ke Math.max(0, Math.floor(duration * 0.4)) agar tidak langsung
 * memicu crossfade saat lagu baru mulai.
 *
 * @param {number} duration Total duration of track in seconds
 * @param {number} crossfadeDuration Requested crossfade duration in seconds
 * @returns {number} Effective crossfade duration in seconds
 */
function getEffectiveCrossfadeDuration(duration, crossfadeDuration) {
  if (typeof duration !== 'number' || isNaN(duration) || duration <= 0) return 0;
  if (typeof crossfadeDuration !== 'number' || isNaN(crossfadeDuration) || crossfadeDuration <= 0) return 0;

  if (crossfadeDuration >= duration) {
    return Math.max(0, Math.floor(duration * 0.4));
  }

  return crossfadeDuration;
}

/**
 * Computes linear crossfade gains for current and next decks.
 *
 * @param {number} currentTime Current playback position in seconds
 * @param {number} duration Total duration of current track in seconds
 * @param {number} crossfadeDuration Configured crossfade duration in seconds
 * @returns {{
 *   currentGain: number,
 *   nextGain: number,
 *   isCrossfading: boolean,
 *   progress: number
 * }}
 */
function calculateCrossfadeGains(currentTime, duration, crossfadeDuration) {
  if (
    typeof currentTime !== 'number' || isNaN(currentTime) ||
    typeof duration !== 'number' || isNaN(duration) || duration <= 0
  ) {
    return { currentGain: 1, nextGain: 0, isCrossfading: false, progress: 0 };
  }

  const effectiveCrossfade = getEffectiveCrossfadeDuration(duration, crossfadeDuration);
  if (effectiveCrossfade <= 0) {
    return { currentGain: 1, nextGain: 0, isCrossfading: false, progress: 0 };
  }

  const windowStart = duration - effectiveCrossfade;
  if (currentTime < windowStart) {
    return { currentGain: 1, nextGain: 0, isCrossfading: false, progress: 0 };
  }

  const progress = (currentTime - windowStart) / effectiveCrossfade;
  const currentGain = Math.max(0, Math.min(1, 1 - progress));
  const nextGain = Math.max(0, Math.min(1, progress));

  return {
    currentGain,
    nextGain,
    isCrossfading: true,
    progress: Math.max(0, Math.min(1, progress))
  };
}

/**
 * Creates initial dual-deck state.
 *
 * @param {'A'|'B'} [initialActive='A']
 * @returns {{
 *   activeDeck: 'A'|'B',
 *   preloadDeck: 'A'|'B',
 *   isCrossfading: boolean,
 *   isPrefetching: boolean,
 *   gains: { A: number, B: number }
 * }}
 */
function createDeckState(initialActive = 'A') {
  const activeDeck = initialActive === 'B' ? 'B' : 'A';
  const preloadDeck = activeDeck === 'A' ? 'B' : 'A';
  return {
    activeDeck,
    preloadDeck,
    isCrossfading: false,
    isPrefetching: false,
    gains: {
      A: activeDeck === 'A' ? 1 : 0,
      B: activeDeck === 'B' ? 1 : 0
    }
  };
}

/**
 * Cleanly swaps active and preload decks, resetting gains to active: 1, preload: 0.
 *
 * @param {object} state
 * @returns {object} Updated state
 */
function swapDeckState(state) {
  if (!state) return createDeckState();
  const prevActive = state.activeDeck;
  state.activeDeck = prevActive === 'A' ? 'B' : 'A';
  state.preloadDeck = prevActive;
  state.isCrossfading = false;
  state.isPrefetching = false;
  state.gains = {
    A: state.activeDeck === 'A' ? 1 : 0,
    B: state.activeDeck === 'B' ? 1 : 0
  };
  return state;
}

/**
 * Resets deck gains instantly to active: 1, preload: 0 and clears crossfading.
 * Eliminates audio ghosting on manual track skip or load.
 *
 * @param {object} state
 * @returns {object} Updated state
 */
function resetDeckGainsState(state) {
  if (!state) return null;
  state.isCrossfading = false;
  state.gains = {
    A: state.activeDeck === 'A' ? 1 : 0,
    B: state.activeDeck === 'B' ? 1 : 0
  };
  return state;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    shouldTriggerPrefetch,
    getEffectiveCrossfadeDuration,
    calculateCrossfadeGains,
    createDeckState,
    swapDeckState,
    resetDeckGainsState
  };
}

if (typeof window !== 'undefined') {
  window.AudioDeckState = {
    shouldTriggerPrefetch,
    getEffectiveCrossfadeDuration,
    calculateCrossfadeGains,
    createDeckState,
    swapDeckState,
    resetDeckGainsState
  };
  window.shouldTriggerPrefetch = shouldTriggerPrefetch;
  window.getEffectiveCrossfadeDuration = getEffectiveCrossfadeDuration;
  window.calculateCrossfadeGains = calculateCrossfadeGains;
}
