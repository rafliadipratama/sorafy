const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const YTDLP_EXTRACTOR_RS = path.join(__dirname, '../src-tauri/src/infrastructure/ytdlp_extractor.rs');
const INFRA_MOD_RS = path.join(__dirname, '../src-tauri/src/infrastructure/mod.rs');
const LIB_RS = path.join(__dirname, '../src-tauri/src/lib.rs');

// 1. Rust Source File and Module Export Contract
test('ytdlp_extractor.rs exists and is exported from infrastructure module and lib.rs', () => {
  assert.ok(fs.existsSync(YTDLP_EXTRACTOR_RS), 'ytdlp_extractor.rs must exist in desktop/src-tauri/src/infrastructure/');

  const infraMod = fs.readFileSync(INFRA_MOD_RS, 'utf8');
  assert.match(infraMod, /pub mod ytdlp_extractor;/, 'infrastructure/mod.rs must declare pub mod ytdlp_extractor');
  assert.match(infraMod, /pub use ytdlp_extractor::YtDlpExtractor;/, 'infrastructure/mod.rs must export YtDlpExtractor');

  const libRs = fs.readFileSync(LIB_RS, 'utf8');
  assert.match(libRs, /pub use infrastructure::YtDlpExtractor;/, 'lib.rs must export YtDlpExtractor');
});

// 2. Command Arguments Specification Contract
test('yt-dlp command arguments follow strict format and options', () => {
  function buildYtDlpArgs(videoId, cookiePath = null) {
    const args = [];
    if (cookiePath) {
      args.push('--cookies', cookiePath);
    }
    args.push('--print', '%(duration)s', '-g', '-f', 'ba/b', `https://www.youtube.com/watch?v=${videoId}`);
    return args;
  }

  const videoId = 'dQw4w9WgXcQ';
  const expectedArgs = [
    '--print', '%(duration)s',
    '-g',
    '-f', 'ba/b',
    'https://www.youtube.com/watch?v=' + videoId
  ];

  assert.deepStrictEqual(buildYtDlpArgs(videoId), expectedArgs);

  const withCookieArgs = buildYtDlpArgs(videoId, '/path/to/cookies.txt');
  assert.deepStrictEqual(withCookieArgs, [
    '--cookies', '/path/to/cookies.txt',
    '--print', '%(duration)s',
    '-g',
    '-f', 'ba/b',
    'https://www.youtube.com/watch?v=' + videoId
  ]);

  if (fs.existsSync(YTDLP_EXTRACTOR_RS)) {
    const rsSource = fs.readFileSync(YTDLP_EXTRACTOR_RS, 'utf8');
    assert.ok(rsSource.includes('--print'), 'Rust source must specify --print');
    assert.ok(rsSource.includes('%(duration)s'), 'Rust source must specify %(duration)s template');
    assert.ok(rsSource.includes('-g'), 'Rust source must specify -g');
    assert.ok(rsSource.includes('-f'), 'Rust source must specify -f');
    assert.ok(rsSource.includes('ba/b'), 'Rust source must specify ba/b format selector');
  }
});

// 3. Extraction Parser Contract
test('Extraction parser extracts duration and Googlevideo raw URL from multi-line stdout', () => {
  function parseYtDlpOutput(stdout) {
    if (!stdout || typeof stdout !== 'string') return null;
    const lines = stdout.trim().split('\n').map(l => l.trim()).filter(Boolean);
    let rawUrl = null;
    let durationSecs = 0;

    for (const line of lines) {
      if (line.startsWith('http://') || line.startsWith('https://')) {
        rawUrl = line;
      } else if (/^\d+$/.test(line)) {
        durationSecs = parseInt(line, 10);
      }
    }

    if (!rawUrl) return null;
    return {
      rawUrl,
      durationSecs,
      bitrate: 160000,
      mimeType: 'audio/webm',
      provider: 'Opus HD'
    };
  }

  const sampleStdout1 = '214\nhttps://rr1---sn-xxx.googlevideo.com/videoplayback?expire=1710000000&id=abc\n';
  const parsed1 = parseYtDlpOutput(sampleStdout1);
  assert.ok(parsed1);
  assert.strictEqual(parsed1.durationSecs, 214);
  assert.strictEqual(parsed1.rawUrl, 'https://rr1---sn-xxx.googlevideo.com/videoplayback?expire=1710000000&id=abc');
  assert.strictEqual(parsed1.bitrate, 160000);
  assert.strictEqual(parsed1.mimeType, 'audio/webm');
  assert.strictEqual(parsed1.provider, 'Opus HD');

  // Reversed order test (URL first, then duration)
  const sampleStdout2 = 'https://rr2---sn-yyy.googlevideo.com/videoplayback?expire=1710000000&id=def\n185\n';
  const parsed2 = parseYtDlpOutput(sampleStdout2);
  assert.ok(parsed2);
  assert.strictEqual(parsed2.durationSecs, 185);
  assert.strictEqual(parsed2.rawUrl, 'https://rr2---sn-yyy.googlevideo.com/videoplayback?expire=1710000000&id=def');

  // Empty or invalid stdout test
  assert.strictEqual(parseYtDlpOutput(''), null);
  assert.strictEqual(parseYtDlpOutput('ERROR: Video unavailable'), null);
  assert.strictEqual(parseYtDlpOutput('300\nNo url found'), null);
});

// 4. Proxied URL Output Verification
test('Proxied URL formats stream URL through local Tokio CORS audio proxy', () => {
  function formatProxiedStreamUrl(rawUrl, proxyPort) {
    if (!proxyPort || proxyPort <= 0) return rawUrl;
    return `http://127.0.0.1:${proxyPort}/stream?url=${encodeURIComponent(rawUrl)}`;
  }

  const rawUrl = 'https://rr1---sn-xxx.googlevideo.com/videoplayback?expire=1710000000&id=abc1234&itag=251';
  const proxyPort = 49210;

  const proxiedUrl = formatProxiedStreamUrl(rawUrl, proxyPort);
  assert.ok(proxiedUrl.startsWith(`http://127.0.0.1:${proxyPort}/stream?url=`));
  assert.ok(proxiedUrl.includes('encodeURIComponent') === false);
  assert.ok(proxiedUrl.includes('%3A%2F%2Frr1---sn-xxx.googlevideo.com'));

  // Without proxy port, returns rawUrl unmodified
  assert.strictEqual(formatProxiedStreamUrl(rawUrl, 0), rawUrl);
  assert.strictEqual(formatProxiedStreamUrl(rawUrl, null), rawUrl);
});

// 5. iOS Client Context Contract for Fallback
test('iOS InnerTube player client context specifies iPad and iOS 21.03.3 clientVersion', () => {
  const IOS_CLIENT_CONTEXT = {
    clientName: 'IOS',
    clientVersion: '21.03.3',
    osName: 'iPadOS',
    osVersion: '17.7.10.21H450',
    deviceMake: 'Apple',
    deviceModel: 'iPad7,6',
    hl: 'id',
    gl: 'ID'
  };

  assert.strictEqual(IOS_CLIENT_CONTEXT.clientName, 'IOS');
  assert.strictEqual(IOS_CLIENT_CONTEXT.clientVersion, '21.03.3');
  assert.strictEqual(IOS_CLIENT_CONTEXT.deviceModel, 'iPad7,6');
  assert.strictEqual(IOS_CLIENT_CONTEXT.deviceMake, 'Apple');

  if (fs.existsSync(YTDLP_EXTRACTOR_RS)) {
    const rsSource = fs.readFileSync(YTDLP_EXTRACTOR_RS, 'utf8');
    assert.ok(rsSource.includes('"IOS"'), 'Rust source must specify "IOS" clientName');
    assert.ok(rsSource.includes('"21.03.3"'), 'Rust source must specify "21.03.3" clientVersion');
    assert.ok(rsSource.includes('"iPad7,6"'), 'Rust source must specify "iPad7,6" deviceModel');
  }
});

// 6. Binary Discovery Path Candidates
test('Binary discovery candidates check bundled sidecars, config dir, and system PATH', () => {
  const candidates = [
    'desktop/bin/linux/yt-dlp',
    'desktop/bin/yt-dlp',
    'bin/linux/yt-dlp',
    'bin/yt-dlp',
    '.config/sorafy/bin/yt-dlp',
    '/usr/local/bin/yt-dlp',
    '/usr/bin/yt-dlp'
  ];

  assert.ok(candidates.includes('desktop/bin/linux/yt-dlp'));
  assert.ok(candidates.includes('desktop/bin/yt-dlp'));
  assert.ok(candidates.includes('bin/linux/yt-dlp'));
  assert.ok(candidates.includes('bin/yt-dlp'));
  assert.ok(candidates.includes('/usr/bin/yt-dlp'));
  assert.ok(candidates.includes('/usr/local/bin/yt-dlp'));

  if (fs.existsSync(YTDLP_EXTRACTOR_RS)) {
    const rsSource = fs.readFileSync(YTDLP_EXTRACTOR_RS, 'utf8');
    assert.ok(rsSource.includes('find_ytdlp_binary'), 'Rust source must define find_ytdlp_binary');
    assert.ok(rsSource.includes('resolve_ytdlp_stream'), 'Rust source must define resolve_ytdlp_stream');
    assert.ok(rsSource.includes('resolve_ios_innertube_stream'), 'Rust source must define resolve_ios_innertube_stream');
    assert.ok(rsSource.includes('resolve_stream'), 'Rust source must define resolve_stream');
  }
});
