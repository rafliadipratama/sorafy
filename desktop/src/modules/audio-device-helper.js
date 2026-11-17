/**
 * audio-device-helper.js
 *
 * Helpers for discovering, classifying, and routing audio output devices
 * (Speakers, Headphones, Bluetooth TWS) to dual-deck audio elements
 * and Web Audio API AudioContext.
 */

function classifyAudioDevice(label) {
  if (!label || typeof label !== 'string') return 'speaker';
  const clean = label.toLowerCase().trim();
  if (!clean) return 'speaker';

  // 1. Bluetooth / Wireless Audio takes first priority
  if (/(?:bluetooth|tws|airpods|buds|wireless|wh-1000|wf-1000|freebuds|neckband)/i.test(clean)) {
    return 'bluetooth';
  }

  // 2. Speakers & Default on-board audio (e.g. "Default - Speakers / Headphones", "Speakers (Realtek)")
  if (/(?:speakers?|built-in|internal|monitor|tv|hdmi|display)/i.test(clean)) {
    return 'speaker';
  }

  // 3. Dedicated Wired / USB Headsets & Headphones
  if (/(?:headphone|headset|earphone|in-ear|3\.5mm|earbuds|usb\s*audio)/i.test(clean)) {
    return 'headphone';
  }

  // 4. Default fallback
  return 'speaker';
}

function getDeviceIconName(deviceType) {
  switch (deviceType) {
    case 'bluetooth':
      return 'radar-2';
    case 'headphone':
      return 'headphone';
    case 'speaker':
      return 'monitor';
    default:
      return 'devices';
  }
}

function filterAudioOutputDevices(rawDevices) {
  if (!Array.isArray(rawDevices)) return [];

  return rawDevices
    .filter(d => d && d.kind === 'audiooutput')
    .map((d, index) => {
      const rawLabel = (d.label || '').trim();
      const label = rawLabel || (index === 0 ? 'Default - Speakers / Headphones' : 'Speakers / Headphones');
      const type = classifyAudioDevice(label);
      const icon = getDeviceIconName(type);

      return {
        deviceId: d.deviceId || 'default',
        label,
        type,
        icon,
        groupId: d.groupId || ''
      };
    });
}

async function applyAudioOutputSink(decks, audioCtx, sinkId) {
  if (!sinkId || typeof sinkId !== 'string') {
    return { success: false, appliedDecks: 0, appliedAudioCtx: false, errors: ['Invalid sinkId'] };
  }

  const deckList = (Array.isArray(decks) ? decks : [decks]).filter(Boolean);
  let appliedDecks = 0;
  let appliedAudioCtx = false;
  const errors = [];

  for (const deck of deckList) {
    if (typeof deck.setSinkId === 'function') {
      try {
        await deck.setSinkId(sinkId);
        appliedDecks++;
      } catch (err) {
        errors.push(err.message || String(err));
      }
    }
  }

  if (audioCtx && typeof audioCtx.setSinkId === 'function') {
    try {
      await audioCtx.setSinkId(sinkId);
      appliedAudioCtx = true;
    } catch (err) {
      errors.push(err.message || String(err));
    }
  }

  const success = (appliedDecks > 0 || appliedAudioCtx) && errors.length === 0;

  return {
    success,
    appliedDecks,
    appliedAudioCtx,
    errors
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    classifyAudioDevice,
    getDeviceIconName,
    filterAudioOutputDevices,
    applyAudioOutputSink
  };
}

if (typeof window !== 'undefined') {
  window.AudioDeviceHelper = {
    classifyAudioDevice,
    getDeviceIconName,
    filterAudioOutputDevices,
    applyAudioOutputSink
  };
}
