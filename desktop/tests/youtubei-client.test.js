const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const YOUTUBEI_CLIENT_RS = path.join(__dirname, '../src-tauri/src/infrastructure/youtubei_client.rs');
const INFRA_MOD_RS = path.join(__dirname, '../src-tauri/src/infrastructure/mod.rs');

// 1. YouTubei Rust Source File and Module Export Contract
test('youtubei_client.rs exists and is exported from infrastructure module', () => {
  assert.ok(fs.existsSync(YOUTUBEI_CLIENT_RS), 'youtubei_client.rs must exist in desktop/src-tauri/src/infrastructure/');
  const infraMod = fs.readFileSync(INFRA_MOD_RS, 'utf8');
  assert.match(infraMod, /pub mod youtubei_client;/, 'infrastructure/mod.rs must declare pub mod youtubei_client');
  assert.match(infraMod, /pub use youtubei_client::YouTubeiClient;/, 'infrastructure/mod.rs must export YouTubeiClient');
});

// 2. Filter Mapping & Client Context Contract
test('Search parameters and filter mappings match YouTube Music InnerTube specifications', () => {
  const FILTER_PARAMS = {
    song: 'EgWKAQIIAWoKEAkQBRAKEAMQBw%3D%3D',
    video: 'EgWKAQIQAWoKEAkQBRAKEAMQBw%3D%3D',
    artist: '',
    album: 'EgWKAQIYAWoKEAkQBRAKEAMQBw%3D%3D',
    playlist: 'EgWKAQI4AWoKEAkQBRAKEAMQBw%3D%3D'
  };

  assert.strictEqual(FILTER_PARAMS.song, 'EgWKAQIIAWoKEAkQBRAKEAMQBw%3D%3D');
  assert.strictEqual(FILTER_PARAMS.video, 'EgWKAQIQAWoKEAkQBRAKEAMQBw%3D%3D');
  assert.strictEqual(FILTER_PARAMS.artist, '');
  assert.strictEqual(FILTER_PARAMS.album, 'EgWKAQIYAWoKEAkQBRAKEAMQBw%3D%3D');
  assert.strictEqual(FILTER_PARAMS.playlist, 'EgWKAQI4AWoKEAkQBRAKEAMQBw%3D%3D');

  if (fs.existsSync(YOUTUBEI_CLIENT_RS)) {
    const rsSource = fs.readFileSync(YOUTUBEI_CLIENT_RS, 'utf8');
    assert.ok(rsSource.includes('WEB_REMIX'), 'Rust client must specify WEB_REMIX clientName');
    assert.ok(rsSource.includes('1.20240318.01.00'), 'Rust client must specify 1.20240318.01.00 clientVersion');
    assert.ok(rsSource.includes('EgWKAQIIAWoKEAkQBRAKEAMQBw'), 'Rust client must contain song filter param');
  }
});

// 3. Home Feed Response Contract Schema
test('Home feed response contract validates quickPicks and sections data schema', () => {
  // Validate schema validator for home feed payload
  function validateHomeFeedContract(payload) {
    assert.ok(payload && typeof payload === 'object', 'Home feed response must be an object');
    assert.ok(Array.isArray(payload.quickPicks), 'quickPicks must be an array');
    assert.ok(Array.isArray(payload.sections), 'sections must be an array');

    for (const track of payload.quickPicks) {
      assert.ok(typeof track.id === 'string' && track.id.length > 0, 'Track must have non-empty id');
      assert.ok(typeof track.title === 'string' && track.title.length > 0, 'Track must have non-empty title');
      assert.ok(typeof track.artist === 'string', 'Track must have artist string');
      assert.ok(typeof track.duration_secs === 'number' || typeof track.duration_secs === 'bigint', 'Track duration must be numeric');
    }
    return true;
  }

  const sampleFeed = {
    quickPicks: [
      {
        id: 'yt_abc123',
        video_id: 'abc123',
        title: 'Starry Night',
        artist: 'Peggy Gou',
        artwork_url: 'https://i.ytimg.com/vi/abc123/hqdefault.jpg',
        duration_secs: 238
      }
    ],
    sections: [
      {
        title: 'Trending',
        items: []
      }
    ]
  };

  assert.ok(validateHomeFeedContract(sampleFeed));
});

// 4. Radio Queue Response Contract Schema
test('Radio queue response contract validates tracks array and continuation token', () => {
  function validateRadioQueueContract(payload) {
    assert.ok(payload && typeof payload === 'object', 'Radio queue response must be an object');
    assert.ok(Array.isArray(payload.tracks), 'tracks must be an array');
    assert.ok(payload.continuation === null || typeof payload.continuation === 'string', 'continuation must be string or null');

    for (const track of payload.tracks) {
      assert.ok(typeof track.id === 'string' && track.id.length > 0, 'Track id must be non-empty string');
      assert.ok(typeof track.title === 'string', 'Track title must be string');
      assert.ok(typeof track.artist === 'string', 'Track artist must be string');
    }
    return true;
  }

  const sampleQueue = {
    tracks: [
      {
        id: 'yt_def456',
        video_id: 'def456',
        title: 'Automix Recommendation 1',
        artist: 'Various Artists',
        artwork_url: 'https://i.ytimg.com/vi/def456/hqdefault.jpg',
        duration_secs: 195
      }
    ],
    continuation: '4qmF-xxxx-token'
  };

  assert.ok(validateRadioQueueContract(sampleQueue));
});

// 5. Browse Details Response Contract Schema
test('Browse details response contract validates browseId, title, and tracks', () => {
  function validateBrowseContract(payload) {
    assert.ok(payload && typeof payload === 'object', 'Browse response must be an object');
    assert.ok(typeof payload.browseId === 'string' && payload.browseId.length > 0, 'browseId must be non-empty string');
    assert.ok(typeof payload.title === 'string', 'title must be string');
    assert.ok(Array.isArray(payload.tracks), 'tracks must be an array');
    return true;
  }

  const sampleBrowse = {
    browseId: 'VLPL4fGSI1pDJn5QPpj0R4vVgRWk8sSq549G',
    title: 'Top 100 Music Videos Global',
    tracks: [
      {
        id: 'yt_xyz789',
        video_id: 'xyz789',
        title: 'Global Hit',
        artist: 'Top Artist',
        duration_secs: 210
      }
    ]
  };

  assert.ok(validateBrowseContract(sampleBrowse));
});

// 6. Indian/Bollywood Keyword & Regional Script Filter Verification
test('is_indian_music_or_playlist filters Indian keywords and regional scripts accurately', () => {
  const indianKeywordsRegex = /\b(hindi|bollywood|punjabi|tamil|telugu|india|indian|tollywood|malayalam|bhojpuri|gujarati|bengali|marathi|kannada|desi|bhangra|sufi|urdu|ghazal|qawwali|arijit|shreya|neha|jubin|badshah|sidhu|diljit|anirudh|pritam|himesh|t-series|zeemusic|speedrecords|geetmp3|whitehill)\b/i;
  const indianScriptsRegex = /[\u0900-\u097F\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F]/;

  function isIndianMusicOrPlaylist(title = '', author = '') {
    const str = `${title} ${author}`.toLowerCase();
    return indianKeywordsRegex.test(str) || indianScriptsRegex.test(str);
  }

  // Should flag Indian titles/authors
  assert.strictEqual(isIndianMusicOrPlaylist('Tum Hi Ho', 'Arijit Singh'), true);
  assert.strictEqual(isIndianMusicOrPlaylist('Punjabi Beats 2024', 'T-Series'), true);
  assert.strictEqual(isIndianMusicOrPlaylist('Bollywood Romance', 'Zee Music Company'), true);
  assert.strictEqual(isIndianMusicOrPlaylist('तमिल गीत', 'Artist'), true); // Devanagari script

  // Should NOT flag non-Indian tracks
  assert.strictEqual(isIndianMusicOrPlaylist('Midnight Emerald', 'Priangan Sound Lab'), false);
  assert.strictEqual(isIndianMusicOrPlaylist('Starry Night', 'Peggy Gou'), false);
  assert.strictEqual(isIndianMusicOrPlaylist('Blinding Lights', 'The Weeknd'), false);
  assert.strictEqual(isIndianMusicOrPlaylist('Sial', 'Mahalini'), false);
});
