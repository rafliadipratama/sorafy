/**
 * SoraFy Desktop - Web Audio DSP Nodes & Parameters Helper
 * Calibrated streaming loudness normalization & bit-perfect transparent bypass
 */

/**
 * Returns DSP parameters for loudness normalization.
 * Standard streaming profile (-14 to -18 LUFS dynamic compression) when enabled;
 * Bit-perfect 1:1 transparent bypass when disabled.
 *
 * @param {boolean} enabled
 * @returns {{
 *   threshold: number,
 *   ratio: number,
 *   knee: number,
 *   attack: number,
 *   release: number,
 *   masterGain: number
 * }}
 */
function getNormalizationParams(enabled) {
  if (enabled) {
    return {
      threshold: -18,
      knee: 12,
      ratio: 4.0,
      attack: 0.003,
      release: 0.25,
      masterGain: 1.15
    };
  }
  return {
    threshold: 0,
    knee: 0,
    ratio: 1.0,
    attack: 0.003,
    release: 0.25,
    masterGain: 1.0
  };
}

/**
 * Applies normalization parameters directly to compressor and gain nodes.
 * @param {{
 *   compressorNode?: any,
 *   masterGainNode?: any,
 *   audioContext?: any
 * }} nodes
 * @param {boolean} enabled
 * @returns {object} The applied parameters
 */
function applyNormalization(nodes, enabled) {
  const isNorm = !!enabled;
  const params = getNormalizationParams(isNorm);
  if (!nodes) return params;

  const { compressorNode, masterGainNode, audioContext } = nodes;
  const currentTime = (audioContext && typeof audioContext.currentTime === 'number')
    ? audioContext.currentTime
    : 0;

  if (compressorNode) {
    if (compressorNode.threshold) {
      if (typeof compressorNode.threshold.setValueAtTime === 'function') {
        compressorNode.threshold.setValueAtTime(params.threshold, currentTime);
      } else {
        compressorNode.threshold.value = params.threshold;
      }
    }
    if (compressorNode.ratio) {
      if (typeof compressorNode.ratio.setValueAtTime === 'function') {
        compressorNode.ratio.setValueAtTime(params.ratio, currentTime);
      } else {
        compressorNode.ratio.value = params.ratio;
      }
    }
    if (compressorNode.knee) {
      if (typeof compressorNode.knee.setValueAtTime === 'function') {
        compressorNode.knee.setValueAtTime(params.knee, currentTime);
      } else {
        compressorNode.knee.value = params.knee;
      }
    }
    if (compressorNode.attack) {
      if (typeof compressorNode.attack.setValueAtTime === 'function') {
        compressorNode.attack.setValueAtTime(params.attack, currentTime);
      } else {
        compressorNode.attack.value = params.attack;
      }
    }
    if (compressorNode.release) {
      if (typeof compressorNode.release.setValueAtTime === 'function') {
        compressorNode.release.setValueAtTime(params.release, currentTime);
      } else {
        compressorNode.release.value = params.release;
      }
    }
  }

  if (masterGainNode && masterGainNode.gain) {
    if (typeof masterGainNode.gain.setValueAtTime === 'function') {
      masterGainNode.gain.setValueAtTime(params.masterGain, currentTime);
    } else {
      masterGainNode.gain.value = params.masterGain;
    }
  }

  return params;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getNormalizationParams,
    applyNormalization
  };
}

if (typeof window !== 'undefined') {
  window.AudioNodes = {
    getNormalizationParams,
    applyNormalization
  };
  window.getNormalizationParams = getNormalizationParams;
  window.applyNormalization = applyNormalization;
}
