const { test } = require('node:test');
const assert = require('node:assert/strict');
const { PlatformBridge, createBridge, initGlobalBridge } = require('../src/modules/platform-bridge');

function createMockStorage() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    }
  };
}

// 1. Runtime Detection
test('PlatformBridge detects electron runtime when native electronAPI is present', () => {
  const mockElectronAPI = {
    resolveFullStream: async () => ({ url: 'https://electron.test' }),
    _isBridge: false
  };
  const bridge = createBridge({
    window: { electronAPI: mockElectronAPI }
  });

  assert.strictEqual(bridge.runtime, 'electron');
  assert.strictEqual(bridge.isElectron, true);
  assert.strictEqual(bridge.isTauri, false);
  assert.strictEqual(bridge.isWeb, false);
});

test('PlatformBridge detects tauri runtime when window.__TAURI__ is present', () => {
  const bridge = createBridge({
    window: {
      __TAURI__: {
        core: { invoke: async () => ({}) }
      }
    }
  });

  assert.strictEqual(bridge.runtime, 'tauri');
  assert.strictEqual(bridge.isElectron, false);
  assert.strictEqual(bridge.isTauri, true);
  assert.strictEqual(bridge.isWeb, false);
});

test('PlatformBridge detects web runtime when neither electron nor tauri is present', () => {
  const bridge = createBridge({
    window: {}
  });

  assert.strictEqual(bridge.runtime, 'web');
  assert.strictEqual(bridge.isElectron, false);
  assert.strictEqual(bridge.isTauri, false);
  assert.strictEqual(bridge.isWeb, true);
});

test('PlatformBridge respects explicit runtime override', () => {
  const bridge = createBridge({
    runtime: 'tauri',
    window: {}
  });

  assert.strictEqual(bridge.runtime, 'tauri');
  assert.strictEqual(bridge.isTauri, true);
});

// 2. Transparent Delegation to window.electronAPI in Electron Mode
test('Electron mode transparently forwards methods and arguments to native electronAPI', async () => {
  const calls = [];
  const mockElectronAPI = {
    resolveFullStream: async (data) => {
      calls.push({ method: 'resolveFullStream', data });
      return { url: 'https://stream.mock', videoId: data.videoId };
    },
    searchYouTubeMusic: async (query, filterType) => {
      calls.push({ method: 'searchYouTubeMusic', query, filterType });
      return [{ id: '1', title: query }];
    },
    fetchYouTubeLyrics: async (videoId) => {
      calls.push({ method: 'fetchYouTubeLyrics', videoId });
      return { plainLyrics: 'hello', source: 'Official' };
    },
    getAppSettings: async () => {
      calls.push({ method: 'getAppSettings' });
      return { theme: 'dracula' };
    },
    saveAppSettings: async (settings) => {
      calls.push({ method: 'saveAppSettings', settings });
      return settings;
    },
    onMediaAction: (cb) => {
      calls.push({ method: 'onMediaAction', cb });
    },
    setThumbarState: (state) => {
      calls.push({ method: 'setThumbarState', state });
    }
  };

  const bridge = createBridge({
    runtime: 'electron',
    electronAPI: mockElectronAPI
  });

  const streamRes = await bridge.resolveFullStream({ videoId: 'abc1234', title: 'Song' });
  assert.deepStrictEqual(streamRes, { url: 'https://stream.mock', videoId: 'abc1234' });

  const searchRes = await bridge.searchYouTubeMusic('Queen', 'song');
  assert.deepStrictEqual(searchRes, [{ id: '1', title: 'Queen' }]);

  const lyricsRes = await bridge.fetchYouTubeLyrics('abc1234');
  assert.deepStrictEqual(lyricsRes, { plainLyrics: 'hello', source: 'Official' });

  const settings = await bridge.getAppSettings();
  assert.deepStrictEqual(settings, { theme: 'dracula' });

  const saved = await bridge.saveAppSettings({ theme: 'light' });
  assert.deepStrictEqual(saved, { theme: 'light' });

  const dummyCb = () => {};
  bridge.onMediaAction(dummyCb);
  bridge.setThumbarState({ isPlaying: true });

  assert.strictEqual(calls.length, 7);
  assert.strictEqual(calls[0].method, 'resolveFullStream');
  assert.strictEqual(calls[1].method, 'searchYouTubeMusic');
  assert.strictEqual(calls[2].method, 'fetchYouTubeLyrics');
  assert.strictEqual(calls[3].method, 'getAppSettings');
  assert.strictEqual(calls[4].method, 'saveAppSettings');
  assert.strictEqual(calls[5].method, 'onMediaAction');
  assert.strictEqual(calls[6].method, 'setThumbarState');
});

// 3. Tauri Mode Command Mapping & Result Unwrapping
test('Tauri mode maps resolveFullStream to resolve_full_stream and unwraps response', async () => {
  const invokeCalls = [];
  const mockInvoke = async (cmd, args) => {
    invokeCalls.push({ cmd, args });
    if (cmd === 'resolve_full_stream') {
      return {
        success: true,
        data: {
          url: 'http://127.0.0.1:4567/stream?url=https%3A%2F%2Fgooglevideo.com',
          videoId: args.data.videoId,
          title: args.data.title
        }
      };
    }
    throw new Error(`Unknown command ${cmd}`);
  };

  const bridge = createBridge({
    runtime: 'tauri',
    tauriInvoke: mockInvoke
  });

  const res = await bridge.resolveFullStream({ videoId: 'xyz987', title: 'Tauri Track' });
  assert.strictEqual(invokeCalls.length, 1);
  assert.strictEqual(invokeCalls[0].cmd, 'resolve_full_stream');
  assert.deepStrictEqual(invokeCalls[0].args, { data: { videoId: 'xyz987', title: 'Tauri Track' } });
  assert.strictEqual(res.url, 'http://127.0.0.1:4567/stream?url=https%3A%2F%2Fgooglevideo.com');
  assert.strictEqual(res.videoId, 'xyz987');
});

test('Tauri mode maps searchYouTubeMusic to search_tracks', async () => {
  const invokeCalls = [];
  const mockInvoke = async (cmd, args) => {
    invokeCalls.push({ cmd, args });
    if (cmd === 'search_tracks') {
      return {
        success: true,
        data: [
          { id: 't1', title: 'Track 1', artist: 'Artist 1' },
          { id: 't2', title: 'Track 2', artist: 'Artist 2' }
        ]
      };
    }
    return null;
  };

  const bridge = createBridge({
    runtime: 'tauri',
    tauriInvoke: mockInvoke
  });

  const res = await bridge.searchYouTubeMusic('Radiohead', 'song');
  assert.strictEqual(invokeCalls.length, 1);
  assert.strictEqual(invokeCalls[0].cmd, 'search_tracks');
  assert.strictEqual(res.length, 2);
  assert.strictEqual(res[0].title, 'Track 1');
});

test('Tauri mode maps fetchYouTubeLyrics to fetch_lyrics', async () => {
  const invokeCalls = [];
  const mockInvoke = async (cmd, args) => {
    invokeCalls.push({ cmd, args });
    if (cmd === 'fetch_lyrics') {
      return {
        plainLyrics: 'Line 1\nLine 2',
        source: 'LRCLIB'
      };
    }
    return null;
  };

  const bridge = createBridge({
    runtime: 'tauri',
    tauriInvoke: mockInvoke
  });

  const res = await bridge.fetchYouTubeLyrics('vid123');
  assert.strictEqual(invokeCalls.length, 1);
  assert.strictEqual(invokeCalls[0].cmd, 'fetch_lyrics');
  assert.strictEqual(res.plainLyrics, 'Line 1\nLine 2');
  assert.strictEqual(res.source, 'LRCLIB');
});

test('Tauri mode maps getAppSettings and saveAppSettings', async () => {
  const invokeCalls = [];
  const mockStorage = createMockStorage();
  const mockInvoke = async (cmd, args) => {
    invokeCalls.push({ cmd, args });
    if (cmd === 'get_app_settings') {
      return { theme: 'amoled', volumeNormalization: true };
    }
    if (cmd === 'save_app_settings') {
      return args.settings;
    }
    return null;
  };

  const bridge = createBridge({
    runtime: 'tauri',
    tauriInvoke: mockInvoke,
    storage: mockStorage
  });

  const settings = await bridge.getAppSettings();
  assert.strictEqual(settings.theme, 'amoled');

  const updated = await bridge.saveAppSettings({ theme: 'light', volumeNormalization: false });
  assert.strictEqual(updated.theme, 'light');
  assert.strictEqual(mockStorage.getItem('sorafy_app_settings'), JSON.stringify({ theme: 'light', volumeNormalization: false }));
});

test('Tauri mode maps getYtHomeFeed to get_yt_home_feed and unwraps response', async () => {
  const invokeCalls = [];
  const mockInvoke = async (cmd, args) => {
    invokeCalls.push({ cmd, args });
    if (cmd === 'get_yt_home_feed') {
      return {
        success: true,
        data: {
          quickPicks: [{ id: 'yt_1', title: 'Song 1' }],
          sections: [{ title: 'Explore', items: [] }]
        }
      };
    }
    throw new Error(`Unknown command ${cmd}`);
  };

  const bridge = createBridge({
    runtime: 'tauri',
    tauriInvoke: mockInvoke
  });

  const res = await bridge.getYtHomeFeed('id');
  assert.strictEqual(invokeCalls.length, 1);
  assert.strictEqual(invokeCalls[0].cmd, 'get_yt_home_feed');
  assert.deepStrictEqual(invokeCalls[0].args, { lang: 'id' });
  assert.strictEqual(res.quickPicks.length, 1);
  assert.strictEqual(res.quickPicks[0].title, 'Song 1');
  assert.strictEqual(res.sections.length, 1);
});

test('Tauri mode maps fetchYouTubeRadioQueue to fetch_yt_radio_queue and unwraps response', async () => {
  const invokeCalls = [];
  const mockInvoke = async (cmd, args) => {
    invokeCalls.push({ cmd, args });
    if (cmd === 'fetch_yt_radio_queue') {
      return {
        success: true,
        data: {
          tracks: [{ id: 'yt_next1', title: 'Radio Track 1', artist: 'Artist 1' }],
          continuation: 'ctoken_123'
        }
      };
    }
    throw new Error(`Unknown command ${cmd}`);
  };

  const bridge = createBridge({
    runtime: 'tauri',
    tauriInvoke: mockInvoke
  });

  const res = await bridge.fetchYouTubeRadioQueue('vid_123', 'cont_prev');
  assert.strictEqual(invokeCalls.length, 1);
  assert.strictEqual(invokeCalls[0].cmd, 'fetch_yt_radio_queue');
  assert.deepStrictEqual(invokeCalls[0].args, { videoId: 'vid_123', continuationToken: 'cont_prev' });
  assert.strictEqual(res.tracks.length, 1);
  assert.strictEqual(res.tracks[0].id, 'yt_next1');
  assert.strictEqual(res.continuation, 'ctoken_123');
});

test('Tauri mode maps browseYouTube to browse_yt and unwraps response', async () => {
  const invokeCalls = [];
  const mockInvoke = async (cmd, args) => {
    invokeCalls.push({ cmd, args });
    if (cmd === 'browse_yt') {
      return {
        success: true,
        data: {
          browseId: args.browseId,
          title: 'Top Hits',
          tracks: [{ id: 't1', title: 'Hit 1' }]
        }
      };
    }
    throw new Error(`Unknown command ${cmd}`);
  };

  const bridge = createBridge({
    runtime: 'tauri',
    tauriInvoke: mockInvoke
  });

  const res = await bridge.browseYouTube('VLPL123');
  assert.strictEqual(invokeCalls.length, 1);
  assert.strictEqual(invokeCalls[0].cmd, 'browse_yt');
  assert.deepStrictEqual(invokeCalls[0].args, { browseId: 'VLPL123' });
  assert.strictEqual(res.browseId, 'VLPL123');
  assert.strictEqual(res.tracks.length, 1);
});

test('Tauri mode maps getSearchSuggestions to get_search_suggestions and unwraps response', async () => {
  const invokeCalls = [];
  const mockInvoke = async (cmd, args) => {
    invokeCalls.push({ cmd, args });
    if (cmd === 'get_search_suggestions') {
      return {
        success: true,
        data: ['coldplay', 'coldplay viva la vida']
      };
    }
    throw new Error(`Unknown command ${cmd}`);
  };

  const bridge = createBridge({
    runtime: 'tauri',
    tauriInvoke: mockInvoke
  });

  const res = await bridge.getSearchSuggestions('cold');
  assert.strictEqual(invokeCalls.length, 1);
  assert.strictEqual(invokeCalls[0].cmd, 'get_search_suggestions');
  assert.deepStrictEqual(invokeCalls[0].args, { query: 'cold' });
  assert.deepStrictEqual(res, ['coldplay', 'coldplay viva la vida']);
});

test('Tauri mode handles invoke failure gracefully with safe fallbacks', async () => {
  const mockInvoke = async (cmd) => {
    throw new Error(`Simulated failure in ${cmd}`);
  };

  const bridge = createBridge({
    runtime: 'tauri',
    tauriInvoke: mockInvoke
  });

  const homeFeed = await bridge.getYtHomeFeed('en');
  assert.deepStrictEqual(homeFeed, { success: true, quickPicks: [] });

  const radioQueue = await bridge.fetchYouTubeRadioQueue('vid_123');
  assert.deepStrictEqual(radioQueue, { tracks: [], continuation: null });

  const browse = await bridge.browseYouTube('VLPL123');
  assert.deepStrictEqual(browse, { success: true, tracks: [] });

  const suggestions = await bridge.getSearchSuggestions('query');
  assert.deepStrictEqual(suggestions, []);
});

test('Web mode returns safe defaults for home feed, radio queue, browse and suggestions', async () => {
  const bridge = createBridge({ runtime: 'web' });

  assert.deepStrictEqual(await bridge.getYtHomeFeed('id'), { success: true, quickPicks: [] });
  assert.deepStrictEqual(await bridge.fetchYouTubeRadioQueue('vid_123'), { tracks: [], continuation: null });
  assert.deepStrictEqual(await bridge.browseYouTube('browse_1'), { success: true, tracks: [] });
  assert.deepStrictEqual(await bridge.getSearchSuggestions('test'), []);
});

// 4. Safe Fallback Defaults for Web and Unmapped Tauri Commands
test('getYtHomeFeed returns safe fallback { success: true, quickPicks: [] }', async () => {
  const bridge = createBridge({ runtime: 'web' });
  const feed = await bridge.getYtHomeFeed('en');
  assert.deepStrictEqual(feed, { success: true, quickPicks: [] });
});

test('loadPlaybackSession and savePlaybackSession read/write localStorage fallback', async () => {
  const storage = createMockStorage();
  const bridge = createBridge({
    runtime: 'web',
    storage
  });

  const initial = await bridge.loadPlaybackSession();
  assert.strictEqual(initial, null);

  const sampleSession = {
    track: { id: 'yt_123', title: 'Test Track', artist: 'Test Artist' },
    position: 42.5
  };

  const saveRes = await bridge.savePlaybackSession(sampleSession);
  assert.strictEqual(saveRes, true);

  const loaded = await bridge.loadPlaybackSession();
  assert.deepStrictEqual(loaded, sampleSession);

  // Synchronous variant
  const syncSaveRes = bridge.savePlaybackSessionSync({ ...sampleSession, position: 50 });
  assert.strictEqual(syncSaveRes, true);

  const loadedSync = await bridge.loadPlaybackSession();
  assert.strictEqual(loadedSync.position, 50);
});

test('checkLocalAudioExists returns false safe fallback', async () => {
  const bridge = createBridge({ runtime: 'web' });
  const exists = await bridge.checkLocalAudioExists({ title: 'Song', artist: 'Artist' });
  assert.strictEqual(exists, false);
});

test('getListeningStats and recordListenEvent return safe defaults', async () => {
  const bridge = createBridge({ runtime: 'web' });
  const stats = await bridge.getListeningStats();
  assert.deepStrictEqual(stats, { success: true, events: [] });

  const record = await bridge.recordListenEvent({ title: 'Track', artist: 'Band' });
  assert.deepStrictEqual(record, { success: true });

  const clear = await bridge.clearListeningStats();
  assert.deepStrictEqual(clear, { success: true });
});

test('other unmapped methods provide safe non-crashing fallbacks', async () => {
  const bridge = createBridge({ runtime: 'web' });

  assert.deepStrictEqual(await bridge.getDownloadedTracks(), []);
  assert.deepStrictEqual(await bridge.checkForUpdates(), { updateAvailable: false });
  assert.strictEqual(await bridge.openDownloadFolder(), false);
  assert.deepStrictEqual(await bridge.getSearchSuggestions('foo'), []);
  assert.strictEqual(await bridge.resolveArtistProfile('Artist'), null);
  assert.deepStrictEqual(await bridge.getStreamCandidates({}), []);
  assert.strictEqual(await bridge.getJamInfo(), null);
  assert.strictEqual(await bridge.getMcpInfo(), null);

  // Void/event calls should never throw
  assert.doesNotThrow(() => bridge.updateDiscordPresence({}));
  assert.doesNotThrow(() => bridge.clearDiscordPresence());
  assert.doesNotThrow(() => bridge.showTrackNotification({}));
  assert.doesNotThrow(() => bridge.setThumbarState({ isPlaying: false }));
  assert.doesNotThrow(() => bridge.onMediaAction(() => {}));
  assert.doesNotThrow(() => bridge.onAppBeforeClose(() => {}));
  assert.doesNotThrow(() => bridge.onDownloadProgress(() => {}));
  assert.doesNotThrow(() => bridge.onDownloadPlaylistProgress(() => {}));
  assert.doesNotThrow(() => bridge.onJamAction(() => {}));
});

// 5. Global Aliasing: window.electronAPI = window.sorafyBridge
test('initGlobalBridge sets window.sorafyBridge and aliases window.electronAPI when missing', () => {
  const mockWindow = {};
  initGlobalBridge(mockWindow);

  assert.ok(mockWindow.sorafyBridge, 'window.sorafyBridge should be defined');
  assert.ok(mockWindow.PlatformBridge, 'window.PlatformBridge should be defined');
  assert.strictEqual(mockWindow.electronAPI, mockWindow.sorafyBridge, 'electronAPI should alias sorafyBridge');
  assert.strictEqual(mockWindow.electronAPI._isBridge, true, '_isBridge flag should be true');
});

test('initGlobalBridge does not overwrite native window.electronAPI if already present', () => {
  const nativeApi = {
    resolveFullStream: async () => ({ native: true }),
    _isBridge: false
  };
  const mockWindow = {
    electronAPI: nativeApi
  };

  initGlobalBridge(mockWindow);

  assert.ok(mockWindow.sorafyBridge, 'window.sorafyBridge should be defined');
  assert.strictEqual(mockWindow.electronAPI, nativeApi, 'electronAPI should remain native object');
  assert.strictEqual(mockWindow.electronAPI._isBridge, false);
});
