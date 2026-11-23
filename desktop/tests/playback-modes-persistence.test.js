const { test } = require('node:test');
const assert = require('node:assert/strict');
const { SoraFyDesktopApp } = require('../src/app');

function createMockElement(initialActive = false) {
  let active = initialActive;
  const attributes = {};
  const innerElements = {};

  return {
    classList: {
      toggle(cls, force) {
        if (typeof force === 'boolean') {
          active = force;
        } else {
          active = !active;
        }
        return active;
      },
      add(cls) { active = true; },
      remove(cls) { active = false; },
      contains(cls) { return active; }
    },
    setAttribute(name, val) {
      attributes[name] = String(val);
    },
    getAttribute(name) {
      return attributes[name];
    },
    querySelector(sel) {
      if (!innerElements[sel]) {
        innerElements[sel] = createMockElement(false);
      }
      return innerElements[sel];
    }
  };
}

function createMockLocalStorage() {
  const store = {};
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      for (const k of Object.keys(store)) delete store[k];
    }
  };
}

test('setShuffle updates app state and toggles button UI without persisting across app restarts', () => {
  const mockLocalStorage = createMockLocalStorage();
  globalThis.localStorage = mockLocalStorage;

  const shuffleBtn = createMockElement(false);
  const screenPlayerShuffleBtn = createMockElement(false);

  const app = {
    isShuffled: false,
    shuffleBtn,
    screenPlayerShuffleBtn,
    appSettings: {},
    currentLanguage: 'en',
    setShuffle: SoraFyDesktopApp.prototype.setShuffle
  };

  // Turn shuffle ON
  app.setShuffle(true, false);
  assert.strictEqual(app.isShuffled, true);
  assert.strictEqual(app.appSettings.isShuffled, true);
  assert.strictEqual(shuffleBtn.classList.contains('active'), true);
  assert.strictEqual(screenPlayerShuffleBtn.classList.contains('active'), true);

  // Turn shuffle OFF
  app.setShuffle(false, false);
  assert.strictEqual(app.isShuffled, false);
  assert.strictEqual(app.appSettings.isShuffled, false);
  assert.strictEqual(shuffleBtn.classList.contains('active'), false);
  assert.strictEqual(screenPlayerShuffleBtn.classList.contains('active'), false);
});

test('toggleShuffle inverts isShuffled state', () => {
  const app = {
    isShuffled: false,
    appSettings: {},
    currentLanguage: 'en',
    setShuffle: SoraFyDesktopApp.prototype.setShuffle,
    toggleShuffle: SoraFyDesktopApp.prototype.toggleShuffle
  };

  app.toggleShuffle();
  assert.strictEqual(app.isShuffled, true);

  app.toggleShuffle();
  assert.strictEqual(app.isShuffled, false);
});

test('setRepeatMode sets active classes and appropriate icons without locking into repeat across restarts', () => {
  const repeatBtn = createMockElement(false);
  const screenPlayerRepeatBtn = createMockElement(false);
  let gainsReset = false;

  const app = {
    repeatMode: 0,
    isCrossfading: true,
    repeatBtn,
    screenPlayerRepeatBtn,
    appSettings: {},
    currentLanguage: 'en',
    resetDeckGains() { gainsReset = true; },
    setRepeatMode: SoraFyDesktopApp.prototype.setRepeatMode
  };

  // 1. Repeat All (mode 1)
  app.setRepeatMode(1, false);
  assert.strictEqual(app.repeatMode, 1);
  assert.strictEqual(repeatBtn.classList.contains('active'), true);
  assert.strictEqual(screenPlayerRepeatBtn.classList.contains('active'), true);
  assert.strictEqual(repeatBtn.querySelector('iconsax-icon').getAttribute('name'), 'repeate-music');
  assert.strictEqual(screenPlayerRepeatBtn.querySelector('iconsax-icon').getAttribute('name'), 'repeate-music');

  // 2. Repeat This Track (mode 2)
  app.setRepeatMode(2, false);
  assert.strictEqual(app.repeatMode, 2);
  assert.strictEqual(repeatBtn.classList.contains('active'), true);
  assert.strictEqual(screenPlayerRepeatBtn.classList.contains('active'), true);
  assert.strictEqual(repeatBtn.querySelector('iconsax-icon').getAttribute('name'), 'repeate-one');
  assert.strictEqual(screenPlayerRepeatBtn.querySelector('iconsax-icon').getAttribute('name'), 'repeate-one');
  assert.strictEqual(gainsReset, true); // Crossfade cancelled and gains reset

  // 3. Repeat Off (mode 0)
  app.setRepeatMode(0, false);
  assert.strictEqual(app.repeatMode, 0);
  assert.strictEqual(repeatBtn.classList.contains('active'), false);
  assert.strictEqual(screenPlayerRepeatBtn.classList.contains('active'), false);
});

test('toggleRepeatMode cycles cleanly from 0 -> 1 -> 2 -> 0', () => {
  const app = {
    repeatMode: 0,
    appSettings: {},
    currentLanguage: 'en',
    setRepeatMode: SoraFyDesktopApp.prototype.setRepeatMode,
    toggleRepeatMode: SoraFyDesktopApp.prototype.toggleRepeatMode
  };

  app.toggleRepeatMode(); // 0 -> 1
  assert.strictEqual(app.repeatMode, 1);

  app.toggleRepeatMode(); // 1 -> 2
  assert.strictEqual(app.repeatMode, 2);

  app.toggleRepeatMode(); // 2 -> 0
  assert.strictEqual(app.repeatMode, 0);
});

test('initPersistedPlaybackModes resets repeatMode and isShuffled and cleans up old localStorage keys', () => {
  const mockLocalStorage = createMockLocalStorage();
  mockLocalStorage.setItem('sorafy_repeat_mode', '2');
  mockLocalStorage.setItem('sorafy_is_shuffled', 'true');
  globalThis.localStorage = mockLocalStorage;

  const app = {
    repeatMode: 2,
    isShuffled: true,
    initPersistedPlaybackModes: SoraFyDesktopApp.prototype.initPersistedPlaybackModes
  };

  app.initPersistedPlaybackModes();

  // Reset to default Repeat Off (0) and Shuffle Off (false)
  assert.strictEqual(app.repeatMode, 0);
  assert.strictEqual(app.isShuffled, false);
  assert.strictEqual(mockLocalStorage.getItem('sorafy_repeat_mode'), null);
  assert.strictEqual(mockLocalStorage.getItem('sorafy_is_shuffled'), null);
});
