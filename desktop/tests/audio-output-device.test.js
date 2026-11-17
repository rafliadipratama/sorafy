const test = require('node:test');
const assert = require('node:assert/strict');
const {
  classifyAudioDevice,
  getDeviceIconName,
  filterAudioOutputDevices,
  applyAudioOutputSink
} = require('../src/modules/audio-device-helper.js');

test('classifyAudioDevice identifies headphones, bluetooth, and speaker types accurately', () => {
  assert.equal(classifyAudioDevice('WH-1000XM4 Stereo (Bluetooth)'), 'bluetooth');
  assert.equal(classifyAudioDevice('AirPods Pro - Find My'), 'bluetooth');
  assert.equal(classifyAudioDevice('Galaxy Buds2 Pro TWS'), 'bluetooth');
  assert.equal(classifyAudioDevice('JBL Flip 6 Wireless'), 'bluetooth');

  assert.equal(classifyAudioDevice('Headphones (Realtek High Definition Audio)'), 'headphone');
  assert.equal(classifyAudioDevice('USB Gaming Headset with Mic'), 'headphone');
  assert.equal(classifyAudioDevice('In-Ear Earphones (3.5mm)'), 'headphone');

  assert.equal(classifyAudioDevice('Speakers (Realtek(R) Audio)'), 'speaker');
  assert.equal(classifyAudioDevice('Built-in Output'), 'speaker');
  assert.equal(classifyAudioDevice('Default - Speakers / Headphones'), 'speaker');
  assert.equal(classifyAudioDevice(''), 'speaker');
  assert.equal(classifyAudioDevice(null), 'speaker');
});

test('getDeviceIconName returns appropriate Iconsax icon names for categories', () => {
  assert.equal(getDeviceIconName('bluetooth'), 'radar-2');
  assert.equal(getDeviceIconName('headphone'), 'headphone');
  assert.equal(getDeviceIconName('speaker'), 'monitor');
  assert.equal(getDeviceIconName('unknown'), 'devices');
});

test('filterAudioOutputDevices excludes input devices and normalizes device descriptors', () => {
  const rawDevices = [
    { deviceId: 'default', kind: 'audiooutput', label: 'Default - Speakers (Realtek)' },
    { deviceId: 'mic-1', kind: 'audioinput', label: 'Microphone Array' },
    { deviceId: 'cam-1', kind: 'videoinput', label: 'Integrated Webcam' },
    { deviceId: 'bt-1', kind: 'audiooutput', label: 'Sony WH-1000XM5' },
    { deviceId: 'empty-1', kind: 'audiooutput', label: '' }
  ];

  const filtered = filterAudioOutputDevices(rawDevices);
  assert.equal(filtered.length, 3);
  assert.equal(filtered[0].deviceId, 'default');
  assert.equal(filtered[0].type, 'speaker');
  assert.equal(filtered[1].deviceId, 'bt-1');
  assert.equal(filtered[1].type, 'bluetooth');
  assert.equal(filtered[2].deviceId, 'empty-1');
  assert.equal(filtered[2].label, 'Speakers / Headphones');
});

test('applyAudioOutputSink dispatches setSinkId to dual-decks and AudioContext', async () => {
  const calls = [];
  const deckA = {
    setSinkId: async (id) => { calls.push({ target: 'deckA', id }); }
  };
  const deckB = {
    setSinkId: async (id) => { calls.push({ target: 'deckB', id }); }
  };
  const audioCtx = {
    setSinkId: async (id) => { calls.push({ target: 'audioCtx', id }); }
  };

  const result = await applyAudioOutputSink([deckA, deckB], audioCtx, 'device-123');
  assert.equal(result.success, true);
  assert.equal(result.appliedDecks, 2);
  assert.equal(result.appliedAudioCtx, true);
  assert.deepEqual(calls, [
    { target: 'deckA', id: 'device-123' },
    { target: 'deckB', id: 'device-123' },
    { target: 'audioCtx', id: 'device-123' }
  ]);
});

test('applyAudioOutputSink handles environments where setSinkId is unavailable or rejects', async () => {
  const deckWithoutSink = {};
  const failingDeck = {
    setSinkId: async () => { throw new Error('Permission denied'); }
  };
  const audioCtxWithoutSink = {};

  const result = await applyAudioOutputSink([deckWithoutSink, failingDeck], audioCtxWithoutSink, 'device-456');
  assert.equal(result.success, false);
  assert.equal(result.appliedDecks, 0);
  assert.equal(result.appliedAudioCtx, false);
  assert.ok(result.errors.length > 0);
});
