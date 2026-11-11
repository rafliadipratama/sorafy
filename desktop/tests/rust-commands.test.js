const { test } = require('node:test');
const assert = require('node:assert/strict');
const { PlatformBridge, createBridge } = require('../src/modules/platform-bridge');

// Helper to simulate Tauri invoke backend
function createMockTauriBackend(handlers = {}) {
  const calls = [];
  const invoke = async (cmd, args) => {
    calls.push({ cmd, args });
    if (handlers[cmd]) {
      return await handlers[cmd](args);
    }
    throw new Error(`Unhandled Tauri command: ${cmd}`);
  };
  return { invoke, calls };
}

// 1. PlatformBridge._unwrap Contract
test('PlatformBridge._unwrap unwraps both CommandResponse<T> and direct results', () => {
  // Test static method
  assert.strictEqual(typeof PlatformBridge._unwrap, 'function', 'PlatformBridge._unwrap should exist as static method');
  
  // Unwrapping CommandResponse<T> envelope ({ success: true, data: ... })
  const wrappedResponse = {
    success: true,
    data: { id: 'track_1', title: 'Emerald Wave' },
    error: null
  };
  assert.deepStrictEqual(
    PlatformBridge._unwrap(wrappedResponse),
    { id: 'track_1', title: 'Emerald Wave' }
  );

  // Unwrapping direct raw payload without envelope
  const directPayload = { id: 'track_2', title: 'Direct Wave' };
  assert.deepStrictEqual(PlatformBridge._unwrap(directPayload), directPayload);

  // Unwrapping primitives, null, and undefined safely
  assert.strictEqual(PlatformBridge._unwrap(42), 42);
  assert.strictEqual(PlatformBridge._unwrap('hello'), 'hello');
  assert.strictEqual(PlatformBridge._unwrap(null), null);
  assert.strictEqual(PlatformBridge._unwrap(undefined), undefined);

  // Also test instance method bridge._unwrap
  const bridge = createBridge({ runtime: 'tauri' });
  assert.deepStrictEqual(
    bridge._unwrap(wrappedResponse),
    { id: 'track_1', title: 'Emerald Wave' }
  );
  assert.deepStrictEqual(bridge._unwrap(directPayload), directPayload);
});

// 2. resolve_full_stream Contract & Schema
test('resolve_full_stream accepts { data: { title, artist, videoId, isVideo } } and validates proxied response', async () => {
  const mockBackend = createMockTauriBackend({
    resolve_full_stream: async (args) => {
      // Validate incoming request structure
      assert.ok(args.data, 'resolve_full_stream must receive data object');
      assert.strictEqual(args.data.videoId, 'abc1234');
      assert.strictEqual(args.data.title, 'Midnight Emerald');
      assert.strictEqual(args.data.artist, 'Priangan Sound Lab');
      assert.strictEqual(args.data.isVideo, false);

      const targetAudioUrl = 'https://rr1---sn-xxx.googlevideo.com/videoplayback?expire=123&id=abc1234';
      const proxyPort = 45892;
      const proxiedUrl = `http://127.0.0.1:${proxyPort}/stream?url=${encodeURIComponent(targetAudioUrl)}`;

      return {
        success: true,
        data: {
          url: proxiedUrl,
          videoId: args.data.videoId,
          title: args.data.title,
          artist: args.data.artist,
          audioQuality: 'high',
          proxied: true
        },
        error: null
      };
    }
  });

  const bridge = createBridge({
    runtime: 'tauri',
    tauriInvoke: mockBackend.invoke
  });

  const request = {
    title: 'Midnight Emerald',
    artist: 'Priangan Sound Lab',
    videoId: 'abc1234',
    isVideo: false
  };

  const payload = await bridge.resolveFullStream(request);

  // Validate Tauri invoke call
  assert.strictEqual(mockBackend.calls.length, 1);
  assert.strictEqual(mockBackend.calls[0].cmd, 'resolve_full_stream');
  assert.deepStrictEqual(mockBackend.calls[0].args, { data: request });

  // Validate response payload shape
  assert.ok(payload, 'Payload must not be null');
  assert.strictEqual(payload.videoId, 'abc1234');
  assert.strictEqual(payload.title, 'Midnight Emerald');
  assert.strictEqual(payload.artist, 'Priangan Sound Lab');
  assert.strictEqual(payload.audioQuality, 'high');
  assert.strictEqual(payload.proxied, true);

  // Validate proxied URL starts with http://127.0.0.1:<port>/stream?url=
  assert.match(
    payload.url,
    /^http:\/\/127\.0\.0\.1:\d+\/stream\?url=/,
    'Proxied stream URL must start with http://127.0.0.1:<port>/stream?url='
  );
});

// 3. search_tracks Contract & Schema
test('search_tracks accepts { query, filterType } and validates track array schema', async () => {
  const mockBackend = createMockTauriBackend({
    search_tracks: async (args) => {
      assert.strictEqual(args.query, 'Neon Bandung');
      assert.strictEqual(args.filterType, 'song');

      return {
        success: true,
        data: [
          {
            id: 'sora_002',
            title: 'Electric Lime Pulse',
            artist: 'Neon Bandung',
            artist_id: 'art_neon_bdg',
            album: 'West Java Cyber',
            duration_secs: 185,
            thumbnail_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
            stream_url: null,
            audio_format: {
              codec: 'Opus Hi-Res',
              bitrate_kbps: 320,
              sample_rate_hz: 48000,
              is_lossless: false
            },
            is_liked: false,
            source_label: 'SoraFy Cyber'
          }
        ],
        error: null
      };
    }
  });

  const bridge = createBridge({
    runtime: 'tauri',
    tauriInvoke: mockBackend.invoke
  });

  const tracks = await bridge.searchYouTubeMusic('Neon Bandung', 'song');

  assert.strictEqual(mockBackend.calls.length, 1);
  assert.strictEqual(mockBackend.calls[0].cmd, 'search_tracks');
  assert.deepStrictEqual(mockBackend.calls[0].args, { query: 'Neon Bandung', filterType: 'song' });

  assert.ok(Array.isArray(tracks), 'Search must return array of tracks');
  assert.strictEqual(tracks.length, 1);

  const track = tracks[0];
  assert.strictEqual(track.id, 'sora_002');
  assert.strictEqual(track.title, 'Electric Lime Pulse');
  assert.strictEqual(track.artist, 'Neon Bandung');
  assert.strictEqual(track.duration_secs, 185);
  assert.strictEqual(track.thumbnail_url, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23');
  assert.strictEqual(track.audio_format.codec, 'Opus Hi-Res');
  assert.strictEqual(track.audio_format.bitrate_kbps, 320);
});

// 4. fetch_lyrics Contract & Schema
test('fetch_lyrics accepts { videoId, title, artist, duration } and validates lyrics structure', async () => {
  const mockBackend = createMockTauriBackend({
    fetch_lyrics: async (args) => {
      assert.strictEqual(args.videoId, 'vid_999');
      assert.strictEqual(args.title, 'Origami Ribbons');
      assert.strictEqual(args.artist, 'Sora Ambient');
      assert.strictEqual(args.duration, 242);

      return {
        success: true,
        data: {
          track_id: 'vid_999',
          plain_lyrics: 'Folded papers in the rain\nWaves of silence ease the pain',
          synced_lines: [
            { timestamp_ms: 10500, text: 'Folded papers in the rain' },
            { timestamp_ms: 22000, text: 'Waves of silence ease the pain' }
          ]
        },
        error: null
      };
    }
  });

  const bridge = createBridge({
    runtime: 'tauri',
    tauriInvoke: mockBackend.invoke
  });

  const lyrics = await bridge.fetchLyrics({
    videoId: 'vid_999',
    title: 'Origami Ribbons',
    artist: 'Sora Ambient',
    duration: 242
  });

  assert.strictEqual(mockBackend.calls.length, 1);
  assert.strictEqual(mockBackend.calls[0].cmd, 'fetch_lyrics');
  assert.deepStrictEqual(mockBackend.calls[0].args, {
    videoId: 'vid_999',
    title: 'Origami Ribbons',
    artist: 'Sora Ambient',
    duration: 242
  });

  assert.ok(lyrics, 'Lyrics object must be returned');
  assert.strictEqual(lyrics.track_id, 'vid_999');
  assert.ok(lyrics.plain_lyrics.includes('Folded papers'));
  assert.ok(Array.isArray(lyrics.synced_lines));
  assert.strictEqual(lyrics.synced_lines.length, 2);
  assert.strictEqual(lyrics.synced_lines[0].timestamp_ms, 10500);
  assert.strictEqual(lyrics.synced_lines[0].text, 'Folded papers in the rain');
});

// 5. get_app_settings & save_app_settings Contract & Schema
test('get_app_settings and save_app_settings round-trip settings object schema', async () => {
  let storedSettings = null;

  const mockBackend = createMockTauriBackend({
    save_app_settings: async (args) => {
      assert.ok(args.settings, 'save_app_settings must receive settings object');
      storedSettings = { ...args.settings };
      return { success: true, data: true, error: null };
    },
    get_app_settings: async () => {
      return {
        success: true,
        data: storedSettings || {
          theme: 'dark',
          audioQuality: 'high',
          volume: 0.85,
          streamingServer: 'piped'
        },
        error: null
      };
    }
  });

  const bridge = createBridge({
    runtime: 'tauri',
    tauriInvoke: mockBackend.invoke
  });

  const newSettings = {
    theme: 'emerald-dark',
    audioQuality: 'lossless-flac',
    volume: 0.95,
    streamingServer: 'invidious',
    volumeNormalization: true,
    crossfadeDuration: 6
  };

  // Save settings
  const saveResult = await bridge.saveAppSettings(newSettings);
  assert.deepStrictEqual(saveResult, newSettings);

  // Retrieve settings
  const retrieved = await bridge.getAppSettings();
  assert.strictEqual(retrieved.theme, 'emerald-dark');
  assert.strictEqual(retrieved.audioQuality, 'lossless-flac');
  assert.strictEqual(retrieved.volume, 0.95);
  assert.strictEqual(retrieved.streamingServer, 'invidious');
  assert.strictEqual(retrieved.volumeNormalization, true);
  assert.strictEqual(retrieved.crossfadeDuration, 6);
});

// 6. get_system_info Contract & Schema
test('get_system_info returns { os, arch, runtime: "tauri", version }', async () => {
  const mockBackend = createMockTauriBackend({
    get_system_info: async () => {
      return {
        success: true,
        data: {
          os: 'linux',
          arch: 'x86_64',
          runtime: 'tauri',
          version: '1.0.0'
        },
        error: null
      };
    }
  });

  const bridge = createBridge({
    runtime: 'tauri',
    tauriInvoke: mockBackend.invoke
  });

  const info = await bridge.getSystemInfo();

  assert.strictEqual(mockBackend.calls.length, 1);
  assert.strictEqual(mockBackend.calls[0].cmd, 'get_system_info');
  assert.deepStrictEqual(info, {
    os: 'linux',
    arch: 'x86_64',
    runtime: 'tauri',
    version: '1.0.0'
  });
  assert.strictEqual(info.runtime, 'tauri');
  assert.strictEqual(info.version, '1.0.0');
});
