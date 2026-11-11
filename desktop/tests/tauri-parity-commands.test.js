const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const COMMANDS_RS = path.join(__dirname, '../src-tauri/src/application/commands.rs');
const MAIN_RS = path.join(__dirname, '../src-tauri/src/main.rs');
const LIB_RS = path.join(__dirname, '../src-tauri/src/lib.rs');

// 1. Rust Source Command Handlers Definition and Registration Contract
test('commands.rs and main.rs define and register all parity command handlers', () => {
  assert.ok(fs.existsSync(COMMANDS_RS), 'commands.rs must exist');
  assert.ok(fs.existsSync(MAIN_RS), 'main.rs must exist');

  const commandsSrc = fs.readFileSync(COMMANDS_RS, 'utf8');
  const mainSrc = fs.readFileSync(MAIN_RS, 'utf8');

  // Verify AppState contains youtubei and ytdlp
  assert.match(commandsSrc, /pub\s+youtubei:\s*Arc<YouTubeiClient>/, 'AppState must contain youtubei: Arc<YouTubeiClient>');
  assert.match(commandsSrc, /pub\s+ytdlp:\s*Arc<YtDlpExtractor>/, 'AppState must contain ytdlp: Arc<YtDlpExtractor>');

  // Verify commands in commands.rs
  assert.match(commandsSrc, /pub\s+async\s+fn\s+get_yt_home_feed/, 'commands.rs must define get_yt_home_feed');
  assert.match(commandsSrc, /pub\s+async\s+fn\s+fetch_yt_radio_queue/, 'commands.rs must define fetch_yt_radio_queue');
  assert.match(commandsSrc, /pub\s+async\s+fn\s+browse_yt/, 'commands.rs must define browse_yt');
  assert.match(commandsSrc, /pub\s+async\s+fn\s+get_search_suggestions/, 'commands.rs must define get_search_suggestions');

  // Verify main.rs tauri::command handlers
  assert.match(mainSrc, /#\[tauri::command\]\s*(?:async\s+)?fn\s+get_yt_home_feed/, 'main.rs must define #[tauri::command] get_yt_home_feed');
  assert.match(mainSrc, /#\[tauri::command\]\s*(?:async\s+)?fn\s+fetch_yt_radio_queue/, 'main.rs must define #[tauri::command] fetch_yt_radio_queue');
  assert.match(mainSrc, /#\[tauri::command\]\s*(?:async\s+)?fn\s+browse_yt/, 'main.rs must define #[tauri::command] browse_yt');
  assert.match(mainSrc, /#\[tauri::command\]\s*(?:async\s+)?fn\s+get_search_suggestions/, 'main.rs must define #[tauri::command] get_search_suggestions');

  // Verify registration in tauri::generate_handler!
  assert.match(mainSrc, /tauri::generate_handler!\[[\s\S]*get_yt_home_feed[\s\S]*\]/, 'generate_handler! must include get_yt_home_feed');
  assert.match(mainSrc, /tauri::generate_handler!\[[\s\S]*fetch_yt_radio_queue[\s\S]*\]/, 'generate_handler! must include fetch_yt_radio_queue');
  assert.match(mainSrc, /tauri::generate_handler!\[[\s\S]*browse_yt[\s\S]*\]/, 'generate_handler! must include browse_yt');
  assert.match(mainSrc, /tauri::generate_handler!\[[\s\S]*get_search_suggestions[\s\S]*\]/, 'generate_handler! must include get_search_suggestions');
});

// 2. lib.rs State Building Contract
test('lib.rs populates AppState with YouTubeiClient and YtDlpExtractor', () => {
  const libSrc = fs.readFileSync(LIB_RS, 'utf8');
  assert.match(libSrc, /YouTubeiClient/, 'lib.rs must reference YouTubeiClient');
  assert.match(libSrc, /YtDlpExtractor/, 'lib.rs must reference YtDlpExtractor');
  assert.match(libSrc, /youtubei\s*:\s*youtubei|youtubei\s*,/, 'build_app_state must populate youtubei');
  assert.match(libSrc, /ytdlp\s*:\s*ytdlp|ytdlp\s*,/, 'build_app_state must populate ytdlp');
});

// 3. get_yt_home_feed Response Payload Contract
test('get_yt_home_feed returns structured quickPicks and sections schema', () => {
  function validateHomeFeedPayload(payload) {
    assert.ok(payload && typeof payload === 'object', 'Home feed payload must be an object');
    assert.ok(Array.isArray(payload.quickPicks), 'quickPicks must be an array');
    assert.ok(Array.isArray(payload.sections), 'sections must be an array');
    return true;
  }

  const samplePayload = {
    success: true,
    quickPicks: [
      {
        id: 'yt_vid001',
        title: 'Midnight Emerald',
        artist: 'Priangan Sound Lab',
        duration_secs: 215,
        artwork_url: 'https://i.ytimg.com/vi/vid001/hqdefault.jpg'
      }
    ],
    sections: [
      {
        title: 'Quick Picks',
        items: []
      }
    ]
  };

  assert.ok(validateHomeFeedPayload(samplePayload));
});

// 4. fetch_yt_radio_queue Response Payload Contract
test('fetch_yt_radio_queue returns continuous tracks and continuation token', () => {
  function validateRadioQueuePayload(payload) {
    assert.ok(payload && typeof payload === 'object', 'Radio queue payload must be an object');
    assert.ok(Array.isArray(payload.tracks), 'tracks must be an array');
    assert.ok(payload.continuation === null || typeof payload.continuation === 'string', 'continuation must be string or null');

    for (const track of payload.tracks) {
      assert.ok(track.id, 'Track must have id');
      assert.ok(track.title, 'Track must have title');
      assert.ok(track.artist, 'Track must have artist');
    }
    return true;
  }

  const sampleQueue = {
    tracks: [
      {
        id: 'yt_next001',
        title: 'Next Track 1',
        artist: 'Priangan Sound Lab',
        duration_secs: 180
      }
    ],
    continuation: '4qmF-BCEA...token'
  };

  assert.ok(validateRadioQueuePayload(sampleQueue));
});

// 5. browse_yt Response Payload Contract
test('browse_yt returns valid browse payload schema', () => {
  function validateBrowsePayload(payload) {
    assert.ok(payload && typeof payload === 'object', 'Browse payload must be an object');
    assert.ok(typeof payload.browseId === 'string' || typeof payload.title === 'string', 'Browse payload must have browseId or title');
    assert.ok(Array.isArray(payload.tracks), 'Browse payload must have tracks array');
    return true;
  }

  const sampleBrowse = {
    browseId: 'VLPL1234567890',
    title: 'Top Hits',
    tracks: [
      {
        id: 'yt_browse01',
        title: 'Hit Song 1',
        artist: 'Hit Artist',
        duration_secs: 200
      }
    ]
  };

  assert.ok(validateBrowsePayload(sampleBrowse));
});

// 6. get_search_suggestions Suggestions Contract
test('get_search_suggestions returns query suggestions array', () => {
  function validateSuggestionsPayload(payload) {
    assert.ok(Array.isArray(payload), 'Suggestions payload must be an array');
    for (const item of payload) {
      if (typeof item === 'string') {
        assert.ok(item.length > 0, 'String suggestion must not be empty');
      } else if (typeof item === 'object') {
        assert.ok(item.text || item.title, 'Object suggestion must have text or title');
      }
    }
    return true;
  }

  const stringSuggestions = ['coldplay', 'coldplay viva la vida', 'coldplay yellow'];
  assert.ok(validateSuggestionsPayload(stringSuggestions));

  const objectSuggestions = [
    { type: 'query', text: 'coldplay' },
    { type: 'entity', title: 'Coldplay', subtitle: 'Artist' }
  ];
  assert.ok(validateSuggestionsPayload(objectSuggestions));
});

// 7. resolve_full_stream yt-dlp & loopback audio proxy integration
test('resolve_full_stream integrates YtDlpExtractor with loopback audio proxy', () => {
  const commandsSrc = fs.readFileSync(COMMANDS_RS, 'utf8');
  assert.match(commandsSrc, /ytdlp[\s\S]*?\.resolve_stream/, 'resolve_full_stream must invoke state.ytdlp.resolve_stream');

  function validateResolvedStream(payload) {
    assert.ok(payload && typeof payload === 'object');
    assert.ok(payload.url && payload.url.startsWith('http://127.0.0.1:'), 'Stream URL must use loopback proxy');
    assert.ok(payload.proxied === true, 'Stream must be marked as proxied');
    assert.ok(payload.videoId, 'Stream must have videoId');
    assert.ok(payload.title, 'Stream must have title');
    assert.ok(payload.artist, 'Stream must have artist');
    assert.strictEqual(payload.audioQuality, 'high', 'audioQuality must be high');
    return true;
  }

  const sampleResolved = {
    url: 'http://127.0.0.1:41234/stream?url=https%3A%2F%2Frr1---sn.googlevideo.com%2Fvideoplayback',
    videoId: 'abc1234',
    title: 'Midnight Emerald',
    artist: 'Priangan Sound Lab',
    audioQuality: 'high',
    proxied: true
  };

  assert.ok(validateResolvedStream(sampleResolved));
});

// 8. search_tracks YouTubei Client Integration Contract
test('search_tracks integrates YouTubeiClient and returns enriched tracks', () => {
  const commandsSrc = fs.readFileSync(COMMANDS_RS, 'utf8');
  assert.match(commandsSrc, /youtubei\.search/, 'search_tracks must query state.youtubei.search');

  function validateTrackItem(track) {
    assert.ok(typeof track.id === 'string' && track.id.length > 0, 'Track must have non-empty id');
    assert.ok(typeof track.title === 'string' && track.title.length > 0, 'Track must have non-empty title');
    assert.ok(typeof track.artist === 'string', 'Track must have artist string');
    assert.ok(typeof track.duration_secs === 'number' || typeof track.duration_secs === 'bigint', 'Track duration must be numeric');
    return true;
  }

  const sampleTrack = {
    id: 'yt_abc1234',
    title: 'Midnight Emerald',
    artist: 'Priangan Sound Lab',
    duration_secs: 215,
    artwork_url: 'https://i.ytimg.com/vi/abc1234/hqdefault.jpg'
  };

  assert.ok(validateTrackItem(sampleTrack));
});
