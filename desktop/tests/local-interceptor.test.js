const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const {
  cleanMetadataString,
  getExpectedLocalFilenames,
  matchDownloadedTrack,
  resolveLocalAudioPath
} = require('../src/modules/local-interceptor');

// Lightweight Jest-compatible assertion wrapper
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
    toBeNull() {
      assert.strictEqual(actual, null);
    },
    toBeTruthy() {
      assert.ok(actual);
    },
    toBeFalsy() {
      assert.ok(!actual);
    },
    toContain(item) {
      if (Array.isArray(actual)) {
        assert.ok(
          actual.includes(item),
          `Expected array to contain ${item}, but got: ${JSON.stringify(actual)}`
        );
      } else if (typeof actual === 'string') {
        assert.ok(
          actual.includes(item),
          `Expected string to contain ${item}, but got: "${actual}"`
        );
      } else {
        throw new Error('toContain requires array or string');
      }
    }
  };
}

// -------------------------------------------------------------
// 1. Brief Requirements: getExpectedLocalFilenames
// -------------------------------------------------------------
test('generates expected local filenames for track matching', () => {
  const track = { title: "Let Down (Remastered)", artist: "Radiohead" };
  const filenames = getExpectedLocalFilenames(track);
  expect(filenames).toContain("Radiohead - Let Down.mp3");
  expect(filenames).toContain("Radiohead - Let Down.opus");
  expect(filenames).toContain("Radiohead - Let Down.m4a");
  expect(filenames).toContain("Radiohead - Let Down.flac");
});

// -------------------------------------------------------------
// 2. cleanMetadataString Unit Tests
// -------------------------------------------------------------
test('cleanMetadataString cleans remaster, official tags, and bracketed noise', () => {
  expect(cleanMetadataString("Let Down (Remastered)")).toBe("Let Down");
  expect(cleanMetadataString("Paranoid Android [Official Video]")).toBe("Paranoid Android");
  expect(cleanMetadataString("Karma Police (Official Audio)")).toBe("Karma Police");
  expect(cleanMetadataString("Creep [Remastered 2021]")).toBe("Creep");
  expect(cleanMetadataString("No Surprises (Deluxe Edition)")).toBe("No Surprises");
  expect(cleanMetadataString("Fake Plastic Trees [Live at Glastonbury]")).toBe("Fake Plastic Trees");
  expect(cleanMetadataString("High and Dry (Radio Edit)")).toBe("High and Dry");
});

test('cleanMetadataString sanitizes illegal filesystem characters', () => {
  // Characters: / \ : * ? " < > |
  expect(cleanMetadataString("AC/DC")).toBe("AC_DC");
  expect(cleanMetadataString("What: Is * This?")).toBe("What_ Is _ This_");
  expect(cleanMetadataString('<Song|Title> "Special"')).toBe("_Song_Title_ _Special_");
});

test('cleanMetadataString handles null, undefined, or empty values safely', () => {
  expect(cleanMetadataString(null)).toBe("");
  expect(cleanMetadataString(undefined)).toBe("");
  expect(cleanMetadataString("")).toBe("");
  expect(cleanMetadataString("   ")).toBe("");
});

// -------------------------------------------------------------
// 3. getExpectedLocalFilenames Edge Cases & Variations
// -------------------------------------------------------------
test('getExpectedLocalFilenames handles artist with illegal characters', () => {
  const track = { title: "Highway to Hell", artist: "AC/DC" };
  const filenames = getExpectedLocalFilenames(track);
  expect(filenames).toContain("AC_DC - Highway to Hell.mp3");
  expect(filenames).toContain("AC_DC - Highway to Hell.opus");
});

test('getExpectedLocalFilenames handles missing artist or title', () => {
  const trackNoArtist = { title: "Song Alone" };
  const filenames1 = getExpectedLocalFilenames(trackNoArtist);
  expect(filenames1).toContain("Unknown Artist - Song Alone.mp3");
  expect(filenames1).toContain("Song Alone.mp3");

  const emptyTrack = {};
  const filenames2 = getExpectedLocalFilenames(emptyTrack);
  expect(filenames2.length > 0).toBeTruthy();
});

// -------------------------------------------------------------
// 4. matchDownloadedTrack Matching Logic
// -------------------------------------------------------------
test('matchDownloadedTrack matches track from list of filenames (strings)', () => {
  const track = { title: "Let Down (Remastered)", artist: "Radiohead" };
  const downloadedFiles = [
    "Coldplay - Yellow.mp3",
    "Radiohead - Let Down.opus",
    "Oasis - Wonderwall.mp3"
  ];
  const matched = matchDownloadedTrack(track, downloadedFiles);
  expect(matched).toBe("Radiohead - Let Down.opus");
});

test('matchDownloadedTrack matches track from list of track objects', () => {
  const track = { title: "Let Down", artist: "Radiohead" };
  const downloadedTracks = [
    {
      id: "local_1",
      filename: "Coldplay - Yellow.mp3",
      raw_path: "/home/user/Music/SoraFy/Coldplay - Yellow.mp3",
      title: "Yellow",
      artist: "Coldplay"
    },
    {
      id: "local_2",
      filename: "Radiohead - Let Down.mp3",
      raw_path: "/home/user/Music/SoraFy/Radiohead - Let Down.mp3",
      title: "Let Down",
      artist: "Radiohead"
    }
  ];
  const matched = matchDownloadedTrack(track, downloadedTracks);
  expect(matched).toBeDefined();
  expect(matched.id).toBe("local_2");
  expect(matched.filename).toBe("Radiohead - Let Down.mp3");
});

test('matchDownloadedTrack returns null when no matching local track exists', () => {
  const track = { title: "Everything In Its Right Place", artist: "Radiohead" };
  const downloadedFiles = ["Coldplay - Yellow.mp3", "Radiohead - Creep.mp3"];
  expect(matchDownloadedTrack(track, downloadedFiles)).toBeNull();
  expect(matchDownloadedTrack(track, [])).toBeNull();
  expect(matchDownloadedTrack(null, downloadedFiles)).toBeNull();
});

// -------------------------------------------------------------
// 5. resolveLocalAudioPath Filesystem Resolution
// -------------------------------------------------------------
test('resolveLocalAudioPath finds existing file on disk and returns full path', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sorafy-local-test-'));
  try {
    const testFile = path.join(tempDir, 'Radiohead - Let Down.mp3');
    fs.writeFileSync(testFile, 'dummy audio content');

    const track = { title: 'Let Down (Remastered)', artist: 'Radiohead' };
    const resolvedPath = resolveLocalAudioPath(track, tempDir);
    expect(resolvedPath).toBe(testFile);

    const nonExistentTrack = { title: 'Karma Police', artist: 'Radiohead' };
    expect(resolveLocalAudioPath(nonExistentTrack, tempDir)).toBeNull();
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

// -------------------------------------------------------------
// 6. SoraFyDesktopApp Integration: Local-First Playback in loadTrack
// -------------------------------------------------------------
const { SoraFyDesktopApp } = require('../src/app');

test('SoraFyDesktopApp.prototype.loadTrack prefers local offline audio over remote stream', async () => {
  let resolveFullStreamCalled = false;
  let checkLocalAudioExistsCalled = false;

  const originalWindow = global.window;
  const originalDocument = global.document;

  global.window = {
    electronAPI: {
      checkLocalAudioExists: async (track) => {
        checkLocalAudioExistsCalled = true;
        return {
          exists: true,
          path: '/home/user/Music/SoraFy/Radiohead - Let Down.mp3',
          url: 'http://127.0.0.1:3721/local-file?path=%2Fhome%2Fuser%2FMusic%2FSoraFy%2FRadiohead%20-%20Let%20Down.mp3'
        };
      },
      resolveFullStream: async () => {
        resolveFullStreamCalled = true;
        return { url: 'https://youtube.com/stream-online' };
      }
    }
  };

  global.document = {
    querySelector: () => null
  };

  const loadedAudio = { src: '', load() {}, pause() {}, addEventListener() {} };
  const mockTrack = {
    id: 'track_1',
    title: 'Let Down (Remastered)',
    artist: 'Radiohead',
    artwork_url: 'artwork.jpg'
  };

  const mockApp = {
    tracks: [mockTrack],
    currentTrackIndex: 0,
    audio: loadedAudio,
    preloadAudio: { pause() {}, currentTime: 0 },
    playerTitle: { innerHTML: '' },
    playerArtwork: { src: '' },
    currentTimeLabel: { textContent: '' },
    durationLabel: { textContent: '' },
    playerBadge: { textContent: '' },
    screenPlayerBadge: { textContent: '' },
    likedTrackIds: new Set(),
    resetDeckGains() {},
    showPlayerBuffering() {},
    updatePlayPauseIcon() {},
    escapeHtml: (s) => s,
    renderBottomPlayerArtist() {},
    updateVerificationBadge() {},
    formatTime: () => '03:45',
    updateScreenPlayer() {},
    highlightActiveSongItems() {},
    recordTasteAffinity() {},
    updateLikeButton() {},
    updateLyricsOffsetUI() {},
    recordPlayHistory() {},
    fetchTrackLyrics() {},
    updateMediaSession() {},
    updateDiscordPresence() {},
    renderQueue() {},
    ensureUpcomingQueue() {},
    loadTrack: SoraFyDesktopApp.prototype.loadTrack
  };

  try {
    await mockApp.loadTrack(0, false, 0);

    expect(checkLocalAudioExistsCalled).toBe(true);
    expect(resolveFullStreamCalled).toBe(false); // Online stream resolver must be skipped!
    expect(mockTrack.is_local).toBe(true);
    expect(mockTrack.is_full_stream).toBe(true);
    expect(mockTrack.stream_url).toBe('http://127.0.0.1:3721/local-file?path=%2Fhome%2Fuser%2FMusic%2FSoraFy%2FRadiohead%20-%20Let%20Down.mp3');
    expect(mockTrack.raw_path).toBe('/home/user/Music/SoraFy/Radiohead - Let Down.mp3');
    expect(loadedAudio.src).toBe(mockTrack.stream_url);
    expect(mockApp.playerBadge.textContent).toBe('Offline HD');
  } finally {
    global.window = originalWindow;
    global.document = originalDocument;
  }
});

test('SoraFyDesktopApp.prototype.loadTrack falls back to remote stream when local audio is absent', async () => {
  let resolveFullStreamCalled = false;
  let checkLocalAudioExistsCalled = false;

  const originalWindow = global.window;
  const originalDocument = global.document;

  global.window = {
    electronAPI: {
      checkLocalAudioExists: async () => {
        checkLocalAudioExistsCalled = true;
        return { exists: false, path: null, url: null };
      },
      resolveFullStream: async () => {
        resolveFullStreamCalled = true;
        return { url: 'https://youtube.com/stream-online-direct', provider: 'YouTube Direct' };
      }
    }
  };

  global.document = {
    querySelector: () => null
  };

  const loadedAudio = { src: '', load() {}, pause() {}, addEventListener() {} };
  const mockTrack = {
    id: 'track_2',
    title: 'Karma Police',
    artist: 'Radiohead',
    artwork_url: 'artwork.jpg'
  };

  const mockApp = {
    tracks: [mockTrack],
    currentTrackIndex: 0,
    audio: loadedAudio,
    preloadAudio: { pause() {}, currentTime: 0 },
    playerTitle: { innerHTML: '' },
    playerArtwork: { src: '' },
    currentTimeLabel: { textContent: '' },
    durationLabel: { textContent: '' },
    playerBadge: { textContent: '' },
    screenPlayerBadge: { textContent: '' },
    likedTrackIds: new Set(),
    resetDeckGains() {},
    showPlayerBuffering() {},
    updatePlayPauseIcon() {},
    escapeHtml: (s) => s,
    renderBottomPlayerArtist() {},
    updateVerificationBadge() {},
    formatTime: () => '04:21',
    updateScreenPlayer() {},
    highlightActiveSongItems() {},
    recordTasteAffinity() {},
    updateLikeButton() {},
    updateLyricsOffsetUI() {},
    recordPlayHistory() {},
    fetchTrackLyrics() {},
    updateMediaSession() {},
    updateDiscordPresence() {},
    renderQueue() {},
    ensureUpcomingQueue() {},
    loadTrack: SoraFyDesktopApp.prototype.loadTrack
  };

  try {
    await mockApp.loadTrack(0, false, 0);

    expect(checkLocalAudioExistsCalled).toBe(true);
    expect(resolveFullStreamCalled).toBe(true);
    expect(mockTrack.stream_url).toBe('https://youtube.com/stream-online-direct');
    expect(loadedAudio.src).toBe('https://youtube.com/stream-online-direct');
  } finally {
    global.window = originalWindow;
    global.document = originalDocument;
  }
});

// -------------------------------------------------------------
// 7. SoraFyDesktopApp Integration: 1-Click Batch Playlist Download
// -------------------------------------------------------------
test('SoraFyDesktopApp.prototype.downloadCurrentPlaylist triggers batch download and updates UI state', async () => {
  let downloadBatchPayload = null;
  let reloadedDownloads = false;
  const toasts = [];

  const originalWindow = global.window;
  global.window = {
    electronAPI: {
      downloadPlaylistBatch: async (payload) => {
        downloadBatchPayload = payload;
        return {
          success: true,
          total: 2,
          downloaded: 1,
          skipped: 1,
          failed: 0
        };
      },
      getDownloadedTracks: async () => {
        reloadedDownloads = true;
        return [
          { filename: 'Radiohead - Let Down.mp3' },
          { filename: 'Radiohead - Karma Police.mp3' }
        ];
      }
    }
  };

  const btnLabel = { textContent: 'Download' };
  const downloadBtn = {
    classList: {
      add: (cls) => { downloadBtn[cls] = true; },
      remove: (cls) => { downloadBtn[cls] = false; }
    },
    disabled: false,
    querySelector: () => btnLabel
  };

  const mockApp = {
    currentPlaylist: {
      id: 'pl_1',
      title: 'OK Computer Full Album',
      tracks: [
        { id: '1', title: 'Let Down', artist: 'Radiohead' },
        { id: '2', title: 'Karma Police', artist: 'Radiohead' }
      ]
    },
    playlistDownloadAllBtn: downloadBtn,
    playlistDownloadAllLabel: btnLabel,
    downloadedTracks: [],
    showToast: (msg) => { toasts.push(msg); },
    renderUserPlaylists() {},
    downloadCurrentPlaylist: SoraFyDesktopApp.prototype.downloadCurrentPlaylist,
    updatePlaylistDownloadButtonState: SoraFyDesktopApp.prototype.updatePlaylistDownloadButtonState,
    handleDownloadPlaylistProgress: SoraFyDesktopApp.prototype.handleDownloadPlaylistProgress
  };

  try {
    await mockApp.downloadCurrentPlaylist();

    expect(downloadBatchPayload).toBeDefined();
    expect(downloadBatchPayload.playlistName).toBe('OK Computer Full Album');
    expect(downloadBatchPayload.tracks.length).toBe(2);
    expect(reloadedDownloads).toBe(true);
    expect(mockApp.downloadedTracks.length).toBe(2);
    expect(toasts.some(t => t.includes('Download completed'))).toBe(true);
    expect(downloadBtn.disabled).toBe(false);

    // Test progress event handling
    mockApp._isDownloadingPlaylist = true;
    mockApp.handleDownloadPlaylistProgress({ current: 1, total: 2, percentage: 50, status: 'downloading' });
    expect(btnLabel.textContent).toContain('1/2 (50%)');

    mockApp.handleDownloadPlaylistProgress({ current: 2, total: 2, percentage: 100, status: 'completed' });
    expect(downloadBtn.disabled).toBe(false);
  } finally {
    global.window = originalWindow;
  }
});

test('SoraFyDesktopApp.prototype.downloadCurrentPlaylist alerts when playlist has no tracks', async () => {
  const toasts = [];
  const mockApp = {
    currentPlaylist: {
      id: 'pl_empty',
      title: 'Empty Playlist',
      tracks: []
    },
    showToast: (msg) => { toasts.push(msg); },
    downloadCurrentPlaylist: SoraFyDesktopApp.prototype.downloadCurrentPlaylist
  };

  await mockApp.downloadCurrentPlaylist();
  expect(toasts.length).toBe(1);
  expect(toasts[0]).toContain('No tracks in this playlist');
});
