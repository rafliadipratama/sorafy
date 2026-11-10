const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { SoraFyDesktopApp } = require('../src/app');

// -------------------------------------------------------------
// 1. Electron Main & Local Proxy Polish Tests
// -------------------------------------------------------------
test('localAudioProxy in electron-main.js registers .webm audio/webm mimeType', () => {
  const mainSource = fs.readFileSync(path.join(__dirname, '../electron-main.js'), 'utf8');
  assert.match(mainSource, /'\.webm':\s*'audio\/webm'/);
});

test('preload.js exposes setThumbarState IPC channel', () => {
  const preloadSource = fs.readFileSync(path.join(__dirname, '../preload.js'), 'utf8');
  let exposedApi = null;
  const mockContextBridge = {
    exposeInMainWorld(key, api) {
      if (key === 'electronAPI') exposedApi = api;
    }
  };
  let sentData = null;
  const mockIpcRenderer = {
    send(channel, data) {
      sentData = { channel, data };
    },
    invoke() {},
    on() {}
  };

  const context = {
    require(mod) {
      if (mod === 'electron') return { contextBridge: mockContextBridge, ipcRenderer: mockIpcRenderer };
      return {};
    }
  };
  vm.createContext(context);
  vm.runInContext(preloadSource, context);

  assert.ok(exposedApi, 'electronAPI should be exposed');
  assert.equal(typeof exposedApi.setThumbarState, 'function');

  exposedApi.setThumbarState({ isPlaying: true });
  assert.deepEqual(sentData, { channel: 'set-thumbar-state', data: { isPlaying: true } });
});

// -------------------------------------------------------------
// 2. Windows Taskbar ThumbBar Controls Tests
// -------------------------------------------------------------
function createThumbarContext(platform = 'win32', windowConfig = {}) {
  const mainSource = fs.readFileSync(path.join(__dirname, '../electron-main.js'), 'utf8');

  let thumbarButtons = null;
  const ipcEvents = [];

  const mockMainWindow = windowConfig.noWindow ? null : {
    isDestroyed: () => Boolean(windowConfig.destroyed),
    setThumbarButtons(buttons) {
      thumbarButtons = buttons;
      return true;
    },
    webContents: {
      send(channel, action) {
        ipcEvents.push({ channel, action });
      }
    }
  };

  const mockNativeImage = {
    createFromDataURL(dataUrl) {
      return { dataUrl, isNativeImage: true };
    }
  };

  const context = {
    process: { platform },
    console: { log() {}, warn() {}, error() {} },
    nativeImage: mockNativeImage,
    mainWindow: mockMainWindow,
    Boolean,
    getThumbarButtons: () => thumbarButtons,
    getIpcEvents: () => ipcEvents
  };

  vm.createContext(context);
  const snippet = mainSource.slice(
    mainSource.indexOf('const THUMBAR_ICONS = {'),
    mainSource.indexOf('function createWindow()')
  );
  vm.runInContext(snippet, context);
  return context;
}

test('updateWindowsThumbar returns early on non-win32 platforms', () => {
  const ctx = createThumbarContext('linux');
  ctx.updateWindowsThumbar(false);
  assert.equal(ctx.getThumbarButtons(), null);

  const macCtx = createThumbarContext('darwin');
  macCtx.updateWindowsThumbar(true);
  assert.equal(macCtx.getThumbarButtons(), null);
});

test('updateWindowsThumbar returns early when mainWindow is null or destroyed', () => {
  const nullWinCtx = createThumbarContext('win32', { noWindow: true });
  nullWinCtx.updateWindowsThumbar(false);
  assert.equal(nullWinCtx.getThumbarButtons(), null);

  const destroyedWinCtx = createThumbarContext('win32', { destroyed: true });
  destroyedWinCtx.updateWindowsThumbar(true);
  assert.equal(destroyedWinCtx.getThumbarButtons(), null);
});

test('updateWindowsThumbar on win32 creates 3 buttons with accurate Play/Pause toggling', () => {
  const ctx = createThumbarContext('win32');

  // Test paused state
  ctx.updateWindowsThumbar(false);
  const pausedBtns = ctx.getThumbarButtons();
  assert.ok(Array.isArray(pausedBtns));
  assert.equal(pausedBtns.length, 3);
  assert.equal(pausedBtns[0].tooltip, 'Previous Track');
  assert.equal(pausedBtns[1].tooltip, 'Play');
  assert.equal(pausedBtns[2].tooltip, 'Next Track');
  assert.ok(pausedBtns[1].icon.dataUrl.includes('base64'));

  // Test playing state
  ctx.updateWindowsThumbar(true);
  const playingBtns = ctx.getThumbarButtons();
  assert.equal(playingBtns[1].tooltip, 'Pause');
  assert.notEqual(playingBtns[1].icon.dataUrl, pausedBtns[1].icon.dataUrl);

  // Test button click IPC dispatches
  playingBtns[0].click();
  playingBtns[1].click();
  playingBtns[2].click();

  const events = ctx.getIpcEvents();
  assert.deepEqual(events, [
    { channel: 'media-action', action: 'prev' },
    { channel: 'media-action', action: 'play-pause' },
    { channel: 'media-action', action: 'next' }
  ]);
});

// -------------------------------------------------------------
// 3. MediaSession Sync & Renderer State Hooks Tests
// -------------------------------------------------------------
function setupRendererMocks() {
  let thumbarState = null;
  let metadataState = null;
  let playbackState = null;
  let positionState = null;

  globalThis.window = {
    electronAPI: {
      setThumbarState(state) {
        thumbarState = state;
      }
    }
  };

  globalThis.navigator.mediaSession = {
    set metadata(val) { metadataState = val; },
    get metadata() { return metadataState; },
    set playbackState(val) { playbackState = val; },
    get playbackState() { return playbackState; },
    setPositionState(val) { positionState = val; }
  };

  globalThis.MediaMetadata = class MediaMetadata {
    constructor(init) {
      Object.assign(this, init);
    }
  };

  return {
    getThumbarState: () => thumbarState,
    getMetadataState: () => metadataState,
    getPlaybackState: () => playbackState,
    getPositionState: () => positionState,
    resetPositionState: () => { positionState = null; }
  };
}

test('SoraFyDesktopApp onPlay and onPause update isPlaying, MediaSession, and thumbar', () => {
  const mocks = setupRendererMocks();
  const app = Object.create(SoraFyDesktopApp.prototype);

  app.isPlaying = false;
  app.tracks = [{ title: 'Track 1', artist: 'Artist 1', duration_secs: 200 }];
  app.currentTrackIndex = 0;
  app.audio = { duration: 200, currentTime: 25, playbackRate: 1.0 };

  // Trigger onPlay
  app.onPlay();
  assert.equal(app.isPlaying, true);
  assert.equal(mocks.getPlaybackState(), 'playing');
  assert.deepEqual(mocks.getThumbarState(), { isPlaying: true });
  assert.deepEqual(mocks.getPositionState(), { duration: 200, playbackRate: 1, position: 25 });

  // Trigger onPause
  app.onPause();
  assert.equal(app.isPlaying, false);
  assert.equal(mocks.getPlaybackState(), 'paused');
  assert.deepEqual(mocks.getThumbarState(), { isPlaying: false });
});

test('SoraFyDesktopApp updateMediaSession populates metadata, playbackState, and position', () => {
  const mocks = setupRendererMocks();
  const app = Object.create(SoraFyDesktopApp.prototype);

  app.isPlaying = true;
  app.DEFAULT_TRACK_ART = 'https://example.com/default.jpg';
  app.tracks = [{
    title: 'Starboy',
    artist: 'The Weeknd',
    album: 'Starboy Deluxe',
    artwork_url: 'https://example.com/starboy.png',
    duration_secs: 230
  }];
  app.currentTrackIndex = 0;
  app.audio = { duration: 230, currentTime: 50, playbackRate: 1.0 };

  app.updateMediaSession(app.tracks[0]);

  const meta = mocks.getMetadataState();
  assert.ok(meta);
  assert.equal(meta.title, 'Starboy');
  assert.equal(meta.artist, 'The Weeknd');
  assert.equal(meta.album, 'Starboy Deluxe');
  assert.equal(meta.artwork.length, 6);
  assert.equal(meta.artwork[0].type, 'image/png');
  assert.equal(mocks.getPlaybackState(), 'playing');
  assert.deepEqual(mocks.getPositionState(), { duration: 230, playbackRate: 1, position: 50 });
});

test('SoraFyDesktopApp updateMediaSessionPosition handles missing or invalid duration safely', () => {
  const mocks = setupRendererMocks();
  const app = Object.create(SoraFyDesktopApp.prototype);

  app.tracks = [{ title: 'Track', duration_secs: 0 }];
  app.currentTrackIndex = 0;
  app.audio = { duration: 0, currentTime: 0, playbackRate: 1.0 };

  mocks.resetPositionState();
  app.updateMediaSessionPosition();
  assert.equal(mocks.getPositionState(), null);

  // NaN duration
  app.audio.duration = NaN;
  mocks.resetPositionState();
  app.updateMediaSessionPosition();
  assert.equal(mocks.getPositionState(), null);

  // Valid duration bounds currentTime
  app.audio.duration = 100;
  app.audio.currentTime = 150; // exceeds duration
  app.updateMediaSessionPosition();
  assert.deepEqual(mocks.getPositionState(), { duration: 100, playbackRate: 1, position: 100 });
});

test('SoraFyDesktopApp updatePlayPauseIcon notifies electronAPI.setThumbarState', () => {
  const mocks = setupRendererMocks();
  const app = Object.create(SoraFyDesktopApp.prototype);

  app.isPlaying = true;
  app.updatePlayPauseIcon();
  assert.deepEqual(mocks.getThumbarState(), { isPlaying: true });

  app.isPlaying = false;
  app.updatePlayPauseIcon();
  assert.deepEqual(mocks.getThumbarState(), { isPlaying: false });
});
