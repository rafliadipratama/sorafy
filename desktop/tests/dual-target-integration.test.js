const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { initGlobalBridge, PlatformBridge } = require('../src/modules/platform-bridge');

function createMockStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    clear: () => map.clear()
  };
}

describe('Dual-Target Desktop Integration Test Suite', () => {
  // =========================================================================
  // 1. Electron Runtime Simulation
  // =========================================================================
  describe('Electron Runtime Bootstrap & Core Workflows', () => {
    test('initGlobalBridge preserves native window.electronAPI and routes all operations directly', async () => {
      const calls = [];
      const nativeElectronAPI = {
        _isBridge: false,
        resolveFullStream: async (data) => {
          calls.push({ method: 'resolveFullStream', data });
          return {
            url: `https://googlevideo.com/videoplayback?id=${data.videoId}`,
            videoId: data.videoId,
            title: data.title,
            artist: data.artist || 'Unknown'
          };
        },
        searchYouTubeMusic: async (query, filterType) => {
          calls.push({ method: 'searchYouTubeMusic', query, filterType });
          return [
            { id: 'el_1', title: `Result for ${query}`, artist: 'Electron Artist', duration: '3:45' }
          ];
        },
        fetchYouTubeLyrics: async (videoId) => {
          calls.push({ method: 'fetchYouTubeLyrics', videoId });
          return {
            plainLyrics: 'Electron lyrics line 1\nElectron lyrics line 2',
            syncedLyrics: '[00:01.00] Electron lyrics line 1\n[00:05.00] Electron lyrics line 2',
            source: 'Official LRCLIB'
          };
        },
        getAppSettings: async () => {
          calls.push({ method: 'getAppSettings' });
          return {
            theme: 'dark',
            audioQuality: 'high',
            volumeNormalization: true
          };
        },
        saveAppSettings: async (settings) => {
          calls.push({ method: 'saveAppSettings', settings });
          return settings;
        },
        onMediaAction: (cb) => {
          calls.push({ method: 'onMediaAction', cb });
        },
        onAppBeforeClose: (cb) => {
          calls.push({ method: 'onAppBeforeClose', cb });
        },
        onDownloadProgress: (cb) => {
          calls.push({ method: 'onDownloadProgress', cb });
        }
      };

      const mockWindow = {
        electronAPI: nativeElectronAPI
      };

      // Bootstrap bridge in Electron environment
      const bridge = initGlobalBridge(mockWindow);

      // Verify electronAPI is preserved and equals the native object
      assert.strictEqual(
        mockWindow.electronAPI,
        nativeElectronAPI,
        'window.electronAPI must strictly equal the native object'
      );
      assert.strictEqual(
        mockWindow.electronAPI._isBridge,
        false,
        '_isBridge must remain false for native Electron preload'
      );
      assert.strictEqual(
        bridge.runtime,
        'electron',
        'sorafyBridge runtime must detect electron'
      );
      assert.strictEqual(bridge.isElectron, true);
      assert.strictEqual(bridge.isTauri, false);

      // Execute core workflows through window.electronAPI
      const streamRes = await mockWindow.electronAPI.resolveFullStream({
        videoId: 'vid_el_1',
        title: 'Electron Track',
        artist: 'Priangan Sound'
      });
      assert.deepStrictEqual(streamRes, {
        url: 'https://googlevideo.com/videoplayback?id=vid_el_1',
        videoId: 'vid_el_1',
        title: 'Electron Track',
        artist: 'Priangan Sound'
      });

      const searchRes = await mockWindow.electronAPI.searchYouTubeMusic('Queen', 'song');
      assert.strictEqual(searchRes.length, 1);
      assert.strictEqual(searchRes[0].id, 'el_1');
      assert.strictEqual(searchRes[0].title, 'Result for Queen');

      const lyricsRes = await mockWindow.electronAPI.fetchYouTubeLyrics('vid_el_1');
      assert.strictEqual(lyricsRes.source, 'Official LRCLIB');
      assert.ok(lyricsRes.plainLyrics.includes('line 1'));

      const settings = await mockWindow.electronAPI.getAppSettings();
      assert.strictEqual(settings.theme, 'dark');

      const updatedSettings = await mockWindow.electronAPI.saveAppSettings({
        theme: 'amoled',
        audioQuality: 'high'
      });
      assert.strictEqual(updatedSettings.theme, 'amoled');

      // Register listeners
      const dummyAction = () => {};
      mockWindow.electronAPI.onMediaAction(dummyAction);
      mockWindow.electronAPI.onAppBeforeClose(dummyAction);
      mockWindow.electronAPI.onDownloadProgress(dummyAction);

      // Confirm all calls directly routed to native electronAPI
      assert.strictEqual(calls.length, 8);
      assert.strictEqual(calls[0].method, 'resolveFullStream');
      assert.strictEqual(calls[1].method, 'searchYouTubeMusic');
      assert.strictEqual(calls[2].method, 'fetchYouTubeLyrics');
      assert.strictEqual(calls[3].method, 'getAppSettings');
      assert.strictEqual(calls[4].method, 'saveAppSettings');
      assert.strictEqual(calls[5].method, 'onMediaAction');
      assert.strictEqual(calls[6].method, 'onAppBeforeClose');
      assert.strictEqual(calls[7].method, 'onDownloadProgress');
    });
  });

  // =========================================================================
  // 2. Tauri Runtime Simulation
  // =========================================================================
  describe('Tauri Runtime Bootstrap & Core Workflows', () => {
    test('initGlobalBridge polyfills window.electronAPI with sorafyBridge and unwraps Rust invoke calls', async () => {
      const invokeCalls = [];
      const mockStorage = createMockStorage();

      const mockInvoke = async (cmd, args) => {
        invokeCalls.push({ cmd, args });

        if (cmd === 'resolve_full_stream') {
          return {
            success: true,
            data: {
              url: `http://127.0.0.1:45892/stream?url=${encodeURIComponent('https://googlevideo.com/videoplayback?id=' + args.data.videoId)}`,
              videoId: args.data.videoId,
              title: args.data.title,
              artist: args.data.artist || 'Unknown'
            },
            error: null
          };
        }

        if (cmd === 'search_tracks') {
          return {
            success: true,
            data: [
              {
                id: 'tauri_1',
                title: `Result for ${args.query}`,
                artist: 'Tauri Artist',
                duration: '3:45'
              }
            ],
            error: null
          };
        }

        if (cmd === 'fetch_lyrics') {
          return {
            success: true,
            data: {
              plainLyrics: 'Tauri lyrics line 1\nTauri lyrics line 2',
              syncedLyrics: '[00:01.00] Tauri lyrics line 1\n[00:05.00] Tauri lyrics line 2',
              source: 'Official LRCLIB'
            },
            error: null
          };
        }

        if (cmd === 'get_app_settings') {
          return {
            success: true,
            data: {
              theme: 'dark',
              audioQuality: 'high',
              volumeNormalization: true
            },
            error: null
          };
        }

        if (cmd === 'save_app_settings') {
          return {
            success: true,
            data: args.settings,
            error: null
          };
        }

        throw new Error(`Unhandled mock Tauri command: ${cmd}`);
      };

      const mockWindow = {
        __TAURI__: {
          core: {
            invoke: mockInvoke
          }
        },
        localStorage: mockStorage
      };

      // Bootstrap bridge in Tauri environment
      const bridge = initGlobalBridge(mockWindow);

      // Verify window.electronAPI is polyfilled with sorafyBridge
      assert.ok(mockWindow.sorafyBridge, 'window.sorafyBridge should be defined');
      assert.strictEqual(
        mockWindow.electronAPI,
        mockWindow.sorafyBridge,
        'window.electronAPI must alias window.sorafyBridge'
      );
      assert.strictEqual(mockWindow.electronAPI, bridge);
      assert.strictEqual(
        mockWindow.electronAPI._isBridge,
        true,
        '_isBridge flag must be true for polyfilled bridge'
      );
      assert.strictEqual(bridge.runtime, 'tauri', 'PlatformBridge runtime must detect tauri');
      assert.strictEqual(bridge.isTauri, true);
      assert.strictEqual(bridge.isElectron, false);

      // 1. Test resolveFullStream -> invokes resolve_full_stream and unwraps result
      const streamRes = await mockWindow.electronAPI.resolveFullStream({
        videoId: 'vid_tauri_1',
        title: 'Tauri Track',
        artist: 'Priangan Sound'
      });
      assert.strictEqual(invokeCalls.length, 1);
      assert.strictEqual(invokeCalls[0].cmd, 'resolve_full_stream');
      assert.deepStrictEqual(invokeCalls[0].args, {
        data: {
          videoId: 'vid_tauri_1',
          title: 'Tauri Track',
          artist: 'Priangan Sound'
        }
      });
      assert.ok(streamRes.url.startsWith('http://127.0.0.1:45892/stream?url='));
      assert.strictEqual(streamRes.videoId, 'vid_tauri_1');
      assert.strictEqual(streamRes.title, 'Tauri Track');

      // 2. Test searchYouTubeMusic -> invokes search_tracks and unwraps result
      const searchRes = await mockWindow.electronAPI.searchYouTubeMusic('Queen', 'song');
      assert.strictEqual(invokeCalls.length, 2);
      assert.strictEqual(invokeCalls[1].cmd, 'search_tracks');
      assert.deepStrictEqual(invokeCalls[1].args, { query: 'Queen', filterType: 'song' });
      assert.strictEqual(searchRes.length, 1);
      assert.strictEqual(searchRes[0].id, 'tauri_1');
      assert.strictEqual(searchRes[0].title, 'Result for Queen');

      // 3. Test fetchYouTubeLyrics -> invokes fetch_lyrics and unwraps result
      const lyricsRes = await mockWindow.electronAPI.fetchYouTubeLyrics('vid_tauri_1');
      assert.strictEqual(invokeCalls.length, 3);
      assert.strictEqual(invokeCalls[2].cmd, 'fetch_lyrics');
      assert.deepStrictEqual(invokeCalls[2].args, { videoId: 'vid_tauri_1' });
      assert.strictEqual(lyricsRes.source, 'Official LRCLIB');
      assert.ok(lyricsRes.plainLyrics.includes('Tauri lyrics'));

      // 4. Test getAppSettings and saveAppSettings -> persists settings
      const settings = await mockWindow.electronAPI.getAppSettings();
      assert.strictEqual(invokeCalls.length, 4);
      assert.strictEqual(invokeCalls[3].cmd, 'get_app_settings');
      assert.strictEqual(settings.theme, 'dark');

      const savedSettings = await mockWindow.electronAPI.saveAppSettings({
        theme: 'amoled',
        audioQuality: 'high'
      });
      assert.strictEqual(invokeCalls.length, 5);
      assert.strictEqual(invokeCalls[4].cmd, 'save_app_settings');
      assert.strictEqual(savedSettings.theme, 'amoled');
      assert.strictEqual(
        mockStorage.getItem('sorafy_app_settings'),
        JSON.stringify({ theme: 'amoled', audioQuality: 'high' })
      );

      // 5. Test fallback methods -> return safe defaults without throwing or stalling
      const homeFeed = await mockWindow.electronAPI.getYtHomeFeed('en');
      assert.deepStrictEqual(homeFeed, { success: true, quickPicks: [] });

      const playbackSession = await mockWindow.electronAPI.loadPlaybackSession();
      assert.strictEqual(playbackSession, null);

      const audioExists = await mockWindow.electronAPI.checkLocalAudioExists({
        title: 'Song',
        artist: 'Band'
      });
      assert.strictEqual(audioExists, false);

      const stats = await mockWindow.electronAPI.getListeningStats();
      assert.deepStrictEqual(stats, { success: true, events: [] });

      // 6. Test registering event listeners -> registers without error
      assert.doesNotThrow(() => {
        mockWindow.electronAPI.onMediaAction(() => {});
        mockWindow.electronAPI.onAppBeforeClose(() => {});
        mockWindow.electronAPI.onDownloadProgress(() => {});
      });
    });
  });

  // =========================================================================
  // 3. Side-by-Side Parity
  // =========================================================================
  describe('Side-by-Side Runtime Parity', () => {
    test('window.electronAPI produces identical contract shapes in both Electron and Tauri runtimes', async () => {
      // Contract specification: keys and types expected by client-side frontend
      const streamInput = {
        videoId: 'parity_track_01',
        title: 'Priangan Reverie',
        artist: 'SoraFy Ensemble'
      };

      // 1. Electron Instance Setup
      const electronCalls = [];
      const mockElectronWindow = {
        electronAPI: {
          _isBridge: false,
          resolveFullStream: async (data) => {
            electronCalls.push(data);
            return {
              url: `https://googlevideo.com/videoplayback?id=${data.videoId}`,
              videoId: data.videoId,
              title: data.title,
              artist: data.artist
            };
          },
          searchYouTubeMusic: async (query, filterType) => {
            return [
              {
                id: 'track_01',
                title: query,
                artist: 'Artist X',
                duration: '3:30',
                thumbnail_url: 'https://i.ytimg.com/vi/track_01/hqdefault.jpg',
                artwork_url: 'https://i.ytimg.com/vi/track_01/hqdefault.jpg'
              }
            ];
          },
          fetchYouTubeLyrics: async (videoId) => {
            return {
              plainLyrics: 'Line A\nLine B',
              syncedLyrics: '[00:01.00] Line A\n[00:03.00] Line B',
              source: 'LRCLIB'
            };
          },
          getAppSettings: async () => {
            return {
              theme: 'dark',
              audioQuality: 'high',
              volumeNormalization: true,
              crossfadeDuration: 4
            };
          },
          saveAppSettings: async (settings) => {
            return settings;
          }
        }
      };
      initGlobalBridge(mockElectronWindow);

      // 2. Tauri Instance Setup
      const tauriCalls = [];
      const mockTauriWindow = {
        __TAURI__: {
          core: {
            invoke: async (cmd, args) => {
              tauriCalls.push({ cmd, args });
              if (cmd === 'resolve_full_stream') {
                return {
                  success: true,
                  data: {
                    url: `http://127.0.0.1:45892/stream?url=${encodeURIComponent('https://googlevideo.com/videoplayback?id=' + args.data.videoId)}`,
                    videoId: args.data.videoId,
                    title: args.data.title,
                    artist: args.data.artist
                  }
                };
              }
              if (cmd === 'search_tracks') {
                return {
                  success: true,
                  data: [
                    {
                      id: 'track_01',
                      title: args.query,
                      artist: 'Artist X',
                      duration: '3:30',
                      artwork_url: 'https://i.ytimg.com/vi/track_01/hqdefault.jpg'
                    }
                  ]
                };
              }
              if (cmd === 'fetch_lyrics') {
                return {
                  success: true,
                  data: {
                    plainLyrics: 'Line A\nLine B',
                    syncedLyrics: '[00:01.00] Line A\n[00:03.00] Line B',
                    source: 'LRCLIB'
                  }
                };
              }
              if (cmd === 'get_app_settings') {
                return {
                  success: true,
                  data: {
                    theme: 'dark',
                    audioQuality: 'high',
                    volumeNormalization: true,
                    crossfadeDuration: 4
                  }
                };
              }
              if (cmd === 'save_app_settings') {
                return {
                  success: true,
                  data: args.settings
                };
              }
              throw new Error(`Unknown command ${cmd}`);
            }
          }
        },
        localStorage: createMockStorage()
      };
      initGlobalBridge(mockTauriWindow);

      // Helper function representing consumer code written against window.electronAPI
      async function runClientWorkflow(api) {
        const stream = await api.resolveFullStream(streamInput);
        const search = await api.searchYouTubeMusic('Priangan Reverie', 'song');
        const lyrics = await api.fetchYouTubeLyrics(streamInput.videoId);
        const settings = await api.getAppSettings();
        const savedSettings = await api.saveAppSettings({ theme: 'emerald_night' });

        return { stream, search, lyrics, settings, savedSettings };
      }

      // Execute client workflow against both targets
      const electronResult = await runClientWorkflow(mockElectronWindow.electronAPI);
      const tauriResult = await runClientWorkflow(mockTauriWindow.electronAPI);

      // Assert side-by-side shape parity for stream resolution
      assert.deepStrictEqual(
        Object.keys(electronResult.stream).sort(),
        Object.keys(tauriResult.stream).sort(),
        'Stream resolution result keys must be identical across runtimes'
      );
      assert.strictEqual(typeof electronResult.stream.url, 'string');
      assert.strictEqual(typeof tauriResult.stream.url, 'string');
      assert.strictEqual(electronResult.stream.videoId, tauriResult.stream.videoId);
      assert.strictEqual(electronResult.stream.title, tauriResult.stream.title);
      assert.strictEqual(electronResult.stream.artist, tauriResult.stream.artist);

      // Assert side-by-side shape parity for search
      assert.strictEqual(Array.isArray(electronResult.search), true);
      assert.strictEqual(Array.isArray(tauriResult.search), true);
      assert.strictEqual(electronResult.search.length, tauriResult.search.length);
      assert.deepStrictEqual(
        Object.keys(electronResult.search[0]).sort(),
        Object.keys(tauriResult.search[0]).sort(),
        'Track search item keys must match across runtimes'
      );
      assert.strictEqual(electronResult.search[0].title, tauriResult.search[0].title);

      // Assert side-by-side shape parity for lyrics
      assert.deepStrictEqual(
        Object.keys(electronResult.lyrics).sort(),
        Object.keys(tauriResult.lyrics).sort(),
        'Lyrics result keys must match across runtimes'
      );
      assert.strictEqual(electronResult.lyrics.source, tauriResult.lyrics.source);
      assert.strictEqual(electronResult.lyrics.plainLyrics, tauriResult.lyrics.plainLyrics);
      assert.strictEqual(electronResult.lyrics.syncedLyrics, tauriResult.lyrics.syncedLyrics);

      // Assert side-by-side shape parity for settings
      assert.strictEqual(electronResult.settings.theme, tauriResult.settings.theme);
      assert.strictEqual(electronResult.settings.audioQuality, tauriResult.settings.audioQuality);
      assert.strictEqual(electronResult.settings.volumeNormalization, tauriResult.settings.volumeNormalization);
      assert.strictEqual(electronResult.savedSettings.theme, tauriResult.savedSettings.theme);
    });
  });
});
