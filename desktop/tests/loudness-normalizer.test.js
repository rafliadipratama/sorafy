const { test } = require('node:test');
const assert = require('node:assert/strict');
const { getNormalizationParams, applyNormalization } = require('../src/modules/audio-nodes');
const { SoraFyDesktopApp } = require('../src/app');

// Lightweight Jest-compatible assertion wrapper around node:assert/strict
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

// 1. Core requirement tests from brief
test('returns calibrated streaming compression values when enabled', () => {
  const params = getNormalizationParams(true);
  expect(params.threshold).toBe(-18);
  expect(params.ratio).toBe(4.0);
  expect(params.masterGain).toBe(1.15);
  expect(params.knee).toBe(12);
  expect(params.attack).toBe(0.003);
  expect(params.release).toBe(0.25);
});

test('returns transparent bit-perfect bypass values when disabled', () => {
  const params = getNormalizationParams(false);
  expect(params.threshold).toBe(0);
  expect(params.ratio).toBe(1.0);
  expect(params.masterGain).toBe(1.0);
});

// 2. Truthy and falsy argument handling
test('handles truthy and falsy values safely', () => {
  const nullParams = getNormalizationParams(null);
  expect(nullParams.threshold).toBe(0);
  expect(nullParams.ratio).toBe(1.0);
  expect(nullParams.masterGain).toBe(1.0);

  const undefinedParams = getNormalizationParams(undefined);
  expect(undefinedParams.threshold).toBe(0);
  expect(undefinedParams.ratio).toBe(1.0);
  expect(undefinedParams.masterGain).toBe(1.0);

  const zeroParams = getNormalizationParams(0);
  expect(zeroParams.threshold).toBe(0);
  expect(zeroParams.ratio).toBe(1.0);
  expect(zeroParams.masterGain).toBe(1.0);

  const truthyParams = getNormalizationParams(1);
  expect(truthyParams.threshold).toBe(-18);
  expect(truthyParams.ratio).toBe(4.0);
  expect(truthyParams.masterGain).toBe(1.15);
});

// 3. Web Audio Node Application Helper test
function createMockAudioParam(initialValue = 0) {
  return {
    value: initialValue,
    setValueAtTime(val, time) {
      this.value = val;
      this.lastTime = time;
    }
  };
}

test('applyNormalization updates compressor and masterGain nodes directly', () => {
  const compressorNode = {
    threshold: createMockAudioParam(0),
    ratio: createMockAudioParam(1),
    knee: createMockAudioParam(0),
    attack: createMockAudioParam(0),
    release: createMockAudioParam(0)
  };
  const masterGainNode = {
    gain: createMockAudioParam(1.0)
  };
  const audioContext = { currentTime: 1.5 };

  // Enable normalization
  applyNormalization({ compressorNode, masterGainNode, audioContext }, true);
  expect(compressorNode.threshold.value).toBe(-18);
  expect(compressorNode.ratio.value).toBe(4.0);
  expect(compressorNode.knee.value).toBe(12);
  expect(compressorNode.attack.value).toBe(0.003);
  expect(compressorNode.release.value).toBe(0.25);
  expect(masterGainNode.gain.value).toBe(1.15);
  expect(compressorNode.threshold.lastTime).toBe(1.5);
  expect(masterGainNode.gain.lastTime).toBe(1.5);

  // Disable normalization -> Transparent Bypass
  applyNormalization({ compressorNode, masterGainNode, audioContext }, false);
  expect(compressorNode.threshold.value).toBe(0);
  expect(compressorNode.ratio.value).toBe(1.0);
  expect(compressorNode.knee.value).toBe(0);
  expect(masterGainNode.gain.value).toBe(1.0);
});

test('applyNormalization handles missing or null nodes without crashing', () => {
  const params = applyNormalization(null, true);
  expect(params.threshold).toBe(-18);
  expect(params.ratio).toBe(4.0);
  expect(params.masterGain).toBe(1.15);

  const emptyNodes = {};
  const paramsEmpty = applyNormalization(emptyNodes, false);
  expect(paramsEmpty.threshold).toBe(0);
  expect(paramsEmpty.ratio).toBe(1.0);
});

// 4. SoraFyDesktopApp setVolumeNormalization integration test
test('SoraFyDesktopApp.prototype.setVolumeNormalization updates compressorNode and masterGainNode', () => {
  const compressorNode = {
    threshold: createMockAudioParam(0),
    ratio: createMockAudioParam(1.0),
    knee: createMockAudioParam(0),
    attack: createMockAudioParam(0.003),
    release: createMockAudioParam(0.25)
  };
  const masterGainNode = {
    gain: createMockAudioParam(1.0)
  };
  const mockApp = {
    audioCtx: { currentTime: 2.0 },
    compressorNode,
    normalizerNode: compressorNode,
    masterGainNode,
    setVolumeNormalization: SoraFyDesktopApp.prototype.setVolumeNormalization
  };

  // Test enabling normalization
  const enabledParams = mockApp.setVolumeNormalization(true);
  expect(enabledParams.threshold).toBe(-18);
  expect(enabledParams.ratio).toBe(4.0);
  expect(enabledParams.masterGain).toBe(1.15);
  expect(compressorNode.threshold.value).toBe(-18);
  expect(compressorNode.ratio.value).toBe(4.0);
  expect(compressorNode.knee.value).toBe(12);
  expect(masterGainNode.gain.value).toBe(1.15);

  // Test disabling normalization -> Transparent Bit-Perfect Bypass
  const bypassParams = mockApp.setVolumeNormalization(false);
  expect(bypassParams.threshold).toBe(0);
  expect(bypassParams.ratio).toBe(1.0);
  expect(bypassParams.masterGain).toBe(1.0);
  expect(compressorNode.threshold.value).toBe(0);
  expect(compressorNode.ratio.value).toBe(1.0);
  expect(compressorNode.knee.value).toBe(0);
  expect(masterGainNode.gain.value).toBe(1.0);
});

test('SoraFyDesktopApp.prototype.setVolumeNormalization works with normalizerNode fallback alias', () => {
  const normalizerNode = {
    threshold: createMockAudioParam(0),
    ratio: createMockAudioParam(1.0),
    knee: createMockAudioParam(0),
    attack: createMockAudioParam(0.003),
    release: createMockAudioParam(0.25)
  };
  const masterGainNode = {
    gain: createMockAudioParam(1.0)
  };
  const mockApp = {
    audioContext: { currentTime: 0.5 },
    normalizerNode,
    masterGainNode,
    setVolumeNormalization: SoraFyDesktopApp.prototype.setVolumeNormalization
  };

  mockApp.setVolumeNormalization(true);
  expect(normalizerNode.threshold.value).toBe(-18);
  expect(normalizerNode.ratio.value).toBe(4.0);
  expect(masterGainNode.gain.value).toBe(1.15);
});
