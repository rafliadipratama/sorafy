const { app, BrowserWindow, ipcMain, session, Menu, Tray, globalShortcut, dialog } = require('electron');
const path = require('path');
const http = require('http');
const https = require('https');
const { execFile } = require('child_process');
const fs = require('fs');
const os = require('os');
const des = require('des.js');

// Disable incompatible Vulkan on Linux Wayland to guarantee silky smooth rendering
app.commandLine.appendSwitch('disable-features', 'Vulkan');
app.commandLine.appendSwitch('disable-dev-shm-usage');
app.commandLine.appendSwitch('log-level', '3'); // Suppress harmless Chromium Ozone/Vulkan warnings

// Apple / Safari User-Agent (exact match with Android MusicStreamSource.kt & MusicCacheManager.kt)
const APPLE_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15';
const IOS_UA = 'com.google.ios.youtube/21.03.3 (iPad7,6; U; CPU iPadOS 17_7_10 like Mac OS X; en-US)';

// Locate yt-dlp binary dynamically across platforms (bundled sidecar, user home, or system PATH)
function findYtDlpBinary() {
  const binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
  const candidatePaths = [
    path.join(process.resourcesPath || '', binaryName),
    path.join(process.resourcesPath || '', 'bin', binaryName),
    path.join(__dirname, 'bin', binaryName),
    path.join(os.homedir(), '.local', 'bin', binaryName),
    '/usr/local/bin/' + binaryName,
    '/usr/bin/' + binaryName
  ];

  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p)) return p;
    } catch (_) {}
  }
  return binaryName;
}

const YT_DLP_BIN = findYtDlpBinary();

function resolveYtDlpStream(videoId) {
  return new Promise((resolve) => {
    if (!videoId) return resolve(null);
    try {
      execFile(
        YT_DLP_BIN,
        ['--print', '%(duration)s', '-g', '-f', 'ba/b', `https://www.youtube.com/watch?v=${videoId}`],
        { timeout: 9000 },
        (error, stdout) => {
          if (error || !stdout) {
            return resolve(null);
          }
          const lines = stdout.trim().split('\n').map(l => l.trim()).filter(Boolean);
          let streamUrl = null;
          let duration = 0;
          for (const line of lines) {
            if (line.startsWith('http')) {
              streamUrl = line;
            } else if (/^\d+$/.test(line)) {
              duration = parseInt(line, 10);
            }
          }
          if (streamUrl) {
            const proxiedUrl = (localProxyPort > 0 && streamUrl)
              ? `http://127.0.0.1:${localProxyPort}/stream?url=${encodeURIComponent(streamUrl)}`
              : streamUrl;
            resolve({
              url: proxiedUrl,
              rawUrl: streamUrl,
              videoId: videoId,
              bitrate: 160000,
              mimeType: 'audio/webm',
              provider: 'Opus HD',
              duration: duration,
              isFull: true
            });
          } else {
            resolve(null);
          }
        }
      );
    } catch (_) {
      resolve(null);
    }
  });
}

const videoStreamCache = new Map();

function resolveYtDlpVideoStream(videoId) {
  if (!videoId) return Promise.resolve(null);
  const cached = videoStreamCache.get(videoId);
  if (cached && cached.expireAt > Date.now()) {
    return Promise.resolve(cached.data);
  }
  return new Promise((resolve) => {
    try {
      execFile(
        YT_DLP_BIN,
        ['-g', `https://www.youtube.com/watch?v=${videoId}`],
        { timeout: 12000 },
        (error, stdout) => {
          if (error || !stdout) {
            return resolve(null);
          }
          const lines = stdout.trim().split('\n').map(l => l.trim()).filter(Boolean);
          if (lines.length > 0 && lines[0].startsWith('http')) {
            const res = {
              url: lines[0],
              audioUrl: lines.length > 1 ? lines[1] : null,
              videoId: videoId,
              mimeType: 'video/mp4'
            };
            videoStreamCache.set(videoId, { data: res, expireAt: Date.now() + 45 * 60 * 1000 });
            resolve(res);
          } else {
            resolve(null);
          }
        }
      );
    } catch (_) {
      resolve(null);
    }
  });
}

let cachedVisitorData = null;
function getVisitorData() {
  if (cachedVisitorData) return Promise.resolve(cachedVisitorData);
  return new Promise((resolve) => {
    https.get('https://music.youtube.com/sw.js_data', {
      headers: { 'User-Agent': APPLE_UA }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try {
          if (b.length > 5) {
            const arr = JSON.parse(b.substring(5));
            const candidates = arr[0] && arr[0][2];
            if (candidates) {
              for (const c of candidates) {
                if (typeof c === 'string' && c.startsWith('Cgt')) {
                  cachedVisitorData = c;
                  return resolve(c);
                }
              }
            }
          }
          resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

// Lightweight local proxy server for:
// 1. YouTube Video Embed relay (/embed) - completely eliminates Error 153 by providing a verified HTTP origin
// 2. Chunked audio stream relay (/stream) - safely bypasses chunk throttling on iOS streams
let localProxyPort = 0;
const localAudioProxy = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://127.0.0.1:${localProxyPort}`);

  // 1. YouTube Video Embed Relay
  if (reqUrl.pathname === '/embed') {
    const vid = reqUrl.searchParams.get('v') || '';
    const start = parseInt(reqUrl.searchParams.get('start') || '0', 10);
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="referrer" content="origin">
  <style>
    * { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #07080A; }
    iframe { border: none; width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  <iframe 
    src="https://www.youtube.com/embed/${encodeURIComponent(vid)}?autoplay=1&start=${start}&enablejsapi=1&controls=1&modestbranding=1&rel=0&origin=https://www.youtube.com&widget_referrer=https://www.youtube.com&playsinline=1" 
    referrerpolicy="origin" 
    allow="autoplay; encrypted-media; picture-in-picture; web-share" 
    allowfullscreen>
  </iframe>
</body>
</html>`;
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    return res.end(html);
  }

  // 2. High-Performance Audio Stream Relay with full Range & CORS support
  const target = reqUrl.searchParams.get('url');
  if (!target) {
    res.writeHead(400);
    return res.end('Missing url');
  }

  try {
    const u = new URL(target);
    const isIos = target.includes('c=IOS') || target.includes('c=ios');
    const upstreamUa = isIos ? IOS_UA : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

    const upstreamHeaders = {
      'User-Agent': upstreamUa
    };
    if (req.headers.range) {
      upstreamHeaders['Range'] = req.headers.range;
    }

    const upReq = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: upstreamHeaders
    }, (upRes) => {
      const mimeMatch = target.match(/mime=([^&]+)/);
      let detectedMime = upRes.headers['content-type'] || 'audio/mp4';
      if (mimeMatch) {
        detectedMime = decodeURIComponent(mimeMatch[1]);
      } else if (target.includes('.webm') || target.includes('webm')) {
        detectedMime = 'audio/webm';
      }

      const respHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Accept-Ranges': 'bytes',
        'Content-Type': detectedMime
      };

      if (upRes.headers['content-range']) respHeaders['Content-Range'] = upRes.headers['content-range'];
      if (upRes.headers['content-length']) respHeaders['Content-Length'] = upRes.headers['content-length'];

      res.writeHead(upRes.statusCode || 200, respHeaders);
      upRes.pipe(res);
    });

    upReq.on('error', () => {
      if (!res.headersSent) res.writeHead(502);
      res.end();
    });

    req.on('close', () => {
      upReq.destroy();
    });

    upReq.end();
  } catch (err) {
    if (!res.headersSent) res.writeHead(500);
    res.end();
  }
});

localAudioProxy.listen(0, '127.0.0.1', () => {
  localProxyPort = localAudioProxy.address().port;
});

// Persistent stream cache on disk for instant 0ms playback across sessions
const cacheDir = path.join(os.homedir(), '.config', 'sorafy', 'cache');
const cacheFile = path.join(cacheDir, 'stream_cache.json');
try {
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
} catch (_) {}

const streamCache = new Map();

function loadStreamCache() {
  try {
    if (fs.existsSync(cacheFile)) {
      const raw = fs.readFileSync(cacheFile, 'utf8');
      const parsed = JSON.parse(raw);
      const now = Date.now();
      for (const [k, v] of Object.entries(parsed)) {
        // Drop legacy/corrupted cache entries (e.g. JioSaavn cover cached under a YouTube video ID)
        if (k.startsWith('vid_') && v?.data?.provider?.includes('JioSaavn')) {
          continue;
        }
        if (v && v.expireAt > now) {
          streamCache.set(k, v);
        }
      }
    }
  } catch (_) {}
}

function saveStreamCache() {
  try {
    const obj = {};
    const now = Date.now();
    for (const [k, v] of streamCache.entries()) {
      if (v && v.expireAt > now) {
        obj[k] = v;
      }
    }
    fs.writeFileSync(cacheFile, JSON.stringify(obj), 'utf8');
  } catch (_) {}
}

loadStreamCache();

// Strict filters & matching algorithms (ported directly from Android MusicStreamSource.kt)
const BANNED_LANGUAGES = new Set([
  'hindi', 'punjabi', 'bhojpuri', 'tamil', 'telugu', 'marathi',
  'bengali', 'kannada', 'gujarati', 'malayalam', 'urdu', 'haryanvi',
  'rajasthani', 'odia', 'assamese', 'sanskrit'
]);

const BANNED_KEYWORDS = [
  't-series', 'zee music', 'bhangra', 'dholak', 'qawwali', 'naat',
  'sonu nigam', 'arijit', 'badshah', 'sidhu', 'shreya ghoshal', 'kumar sanu',
  'lata mangeshkar', 'dj remix', 'viral rimek', 'pashmina', 'punjabi', 'bhojpuri',
  'hawa hawa', 'dilbar', 'diljit', 'neha kakkar', 'yo yo honey', 'tribute', 'cover by'
];

function isIndianOrCoverContent(title, artist, language) {
  if (language && BANNED_LANGUAGES.has(language.toLowerCase())) {
    return true;
  }
  const lowerT = (title || '').toLowerCase();
  const lowerA = (artist || '').toLowerCase();
  return BANNED_KEYWORDS.some(k => lowerT.includes(k) || lowerA.includes(k));
}

function normalize(s) {
  return (s || '').toLowerCase()
    .replace(/\(.*\)|\[.*\]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseDurationSecs(val) {
  if (!val) return 0;
  if (typeof val === 'number') return val > 0 ? Math.round(val) : 0;
  const s = String(val).trim();
  if (!s) return 0;

  // Accessibility label e.g. "4 menit, 26 detik" or "3 min, 48 sec"
  const mMatch = s.match(/(\d+)\s*(?:menit|min)/i);
  const sMatch = s.match(/(\d+)\s*(?:detik|sec)/i);
  const hMatch = s.match(/(\d+)\s*(?:jam|hr|hour)/i);
  if (mMatch || sMatch || hMatch) {
    const h = hMatch ? parseInt(hMatch[1], 10) : 0;
    const m = mMatch ? parseInt(mMatch[1], 10) : 0;
    const sec = sMatch ? parseInt(sMatch[1], 10) : 0;
    const total = h * 3600 + m * 60 + sec;
    if (total > 0) return total;
  }

  // Format "HH:MM:SS" or "HH.MM.SS"
  const hhmmss = s.match(/^(\d{1,2})[:.](\d{2})[:.](\d{2})$/);
  if (hhmmss) {
    return parseInt(hhmmss[1], 10) * 3600 + parseInt(hhmmss[2], 10) * 60 + parseInt(hhmmss[3], 10);
  }

  // Format "MM:SS" or "MM.SS" (e.g. "3:48" or "3.48" or "4.26")
  const mmss = s.match(/^(\d{1,3})[:.](\d{2})$/);
  if (mmss) {
    return parseInt(mmss[1], 10) * 60 + parseInt(mmss[2], 10);
  }

  return 0;
}

function extractDurationFromListItem(r) {
  if (!r) return 0;
  // 1. Check fixedColumns (album tracklist & search table)
  if (r.fixedColumns && Array.isArray(r.fixedColumns)) {
    for (const col of r.fixedColumns) {
      const runs = col.musicResponsiveListItemFixedColumnRenderer?.text?.runs || [];
      for (const run of runs) {
        const d = parseDurationSecs(run.text);
        if (d > 0) return d;
      }
    }
  }
  // 2. Check flexColumns runs in reverse order
  if (r.flexColumns && Array.isArray(r.flexColumns)) {
    for (let i = r.flexColumns.length - 1; i >= 0; i--) {
      const runs = r.flexColumns[i]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || [];
      for (let j = runs.length - 1; j >= 0; j--) {
        const d = parseDurationSecs(runs[j].text);
        if (d > 0) return d;
      }
    }
  }
  // 3. Check accessibility labels
  const a1 = r.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.accessibility?.accessibilityData?.label;
  if (a1) {
    const d = parseDurationSecs(a1);
    if (d > 0) return d;
  }
  const a2 = r.accessibility?.accessibilityData?.label;
  if (a2) {
    const d = parseDurationSecs(a2);
    if (d > 0) return d;
  }
  return 0;
}

function isStrictMatch(expectedTitle, expectedArtist, candTitle, candArtist) {
  const normExpT = normalize(expectedTitle);
  const normCandT = normalize(candTitle);
  const normExpA = normalize(expectedArtist);
  const normCandA = normalize(candArtist);

  if (!normExpT || !normCandT) return false;
  // Official artist must be present; never match an empty or unknown candidate artist!
  if (!normExpA || !normCandA) return false;

  // Strictly reject unofficial covers, bootleg remixes, karaoke, instrumental, nightcore if expected song is original
  const isCoverOrRemix = /\b(cover|karaoke|instrumental|tribute|remix|nightcore|slowed|sped\s*up|reverb|techno|hardstyle|bootleg|flip|edit|drill|trap|acoustic|8d\s*audio)\b/i;
  if (isCoverOrRemix.test(candTitle) && !isCoverOrRemix.test(expectedTitle)) {
    return false;
  }

  const titleMatch = normExpT === normCandT ||
    normExpT.includes(normCandT) || normCandT.includes(normExpT) ||
    (() => {
      const expWords = normExpT.split(' ').filter(w => w.length > 2);
      const candWords = normCandT.split(' ').filter(w => w.length > 2);
      return (expWords.length > 0 && expWords.every(w => candWords.includes(w))) ||
             (candWords.length > 0 && candWords.every(w => expWords.includes(w)));
    })();

  if (!titleMatch) return false;

  const artistMatch = normExpA === normCandA ||
    normExpA.includes(normCandA) || normCandA.includes(normExpA) ||
    normExpA.split(' ').filter(w => w.length > 2).some(w => normCandA.includes(w));

  return artistMatch;
}

// JioSaavn DES 320kbps Stream Decryptor (Key: 38346591, matches Android MusicStreamSource.kt)
function decryptSaavnMediaUrl(encryptedUrl) {
  try {
    const key = Buffer.from('38346591', 'ascii');
    const d = des.DES.create({ type: 'decrypt', key: key });
    const input = Buffer.from(encryptedUrl, 'base64');
    const out = Buffer.concat([Buffer.from(d.update(input)), Buffer.from(d.final())]);
    const pad = out[out.length - 1];
    const cleanBuf = (pad > 0 && pad <= 8) ? out.slice(0, out.length - pad) : out;
    const rawUrl = cleanBuf.toString('utf8');
    return rawUrl.replace(/_(96|160|320)\.mp4/, '_320.mp4').replace('http://', 'https://');
  } catch (e) {
    return null;
  }
}

function resolveJioSaavnStream(title, artist) {
  return new Promise((resolve) => {
    const query = `${artist} ${title}`.trim();
    const encoded = encodeURIComponent(query);
    const url = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&n=5&p=1&q=${encoded}&_marker=0&ctx=android`;

    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          const results = json.results || [];
          if (!results.length) return resolve(null);

          for (const item of results) {
            const encUrl = item.encrypted_media_url || item.more_info?.encrypted_media_url;
            if (!encUrl) continue;
            const candTitle = item.title || item.song || '';
            const candArtist = (item.more_info?.artistMap?.primary_artists?.map(a => a.name).join(', '))
              || item.more_info?.primary_artists
              || item.primary_artists
              || '';
            const candLang = item.language;

            // Reject Indian regional & banned keywords
            if (isIndianOrCoverContent(candTitle, candArtist, candLang)) continue;

            // Reject if title and artist don't strictly match the requested song
            if (!isStrictMatch(title, artist, candTitle, candArtist)) continue;

            const fullUrl = decryptSaavnMediaUrl(encUrl);
            if (fullUrl && fullUrl.startsWith('https://')) {
              return resolve({
                url: fullUrl,
                bitrate: 320000,
                mimeType: 'audio/mp4',
                duration: parseInt(item.more_info?.duration || item.duration, 10) || 0,
                provider: 'JioSaavn 320k',
                isFull: true
              });
            }
          }
          resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
  });
}

function searchYouTubeMusicInnerTube(query, filterType = 'song') {
  return new Promise((resolve) => {
    let effectiveQuery = (query || '').trim();
    let params = 'EgWKAQIIAWoKEAkQBRAKEAMQBw%3D%3D'; // Songs
    if (filterType === 'video') {
      params = 'EgWKAQIQAWoKEAkQBRAKEAMQBw%3D%3D'; // Videos
    } else if (filterType === 'artist') {
      params = ''; // Unfiltered: yields musicCardShelfRenderer with top 3 songs & real monthly listeners
    } else if (filterType === 'playlist') {
      params = 'EgWKAQI4AWoKEAkQBRAKEAMQBw%3D%3D'; // Playlists
    } else if (filterType === 'album') {
      params = 'EgWKAQIYAWoKEAkQBRAKEAMQBw%3D%3D'; // Albums
    }

    const payloadObj = {
      query: effectiveQuery,
      context: {
        client: {
          clientName: 'WEB_REMIX',
          clientVersion: '1.20240318.01.00',
          hl: 'id',
          gl: 'ID'
        }
      }
    };
    if (params) {
      payloadObj.params = params;
    }
    const payload = JSON.stringify(payloadObj);

    const req = https.request({
      hostname: 'music.youtube.com',
      path: '/youtubei/v1/search',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          const contents = json.contents?.tabbedSearchResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents;
          const itemsList = [];

          if (contents) {
            for (const sec of contents) {
              // Top Verified Artist / Hero Card
              if (sec.musicCardShelfRenderer) {
                const card = sec.musicCardShelfRenderer;
                const title = card.title?.runs?.[0]?.text || '';
                const sub = card.subtitle?.runs?.map(r => r.text).join('') || '';
                const thumbs = card.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails
                  || card.thumbnail?.croppedSquareThumbnailRenderer?.thumbnail?.thumbnails || [];
                let artwork = thumbs.length ? thumbs[thumbs.length - 1].url : '';
                if (artwork) {
                  artwork = artwork.replace(/=(?:w\d+-h\d+|s\d+).*$/, '=w544-h544-p-l90-rj');
                }
                const browseId = card.onTap?.browseEndpoint?.browseId
                  || card.title?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId || '';
                const pageType = card.onTap?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType
                  || card.title?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType || '';

                const isArtistCard = pageType === 'MUSIC_PAGE_TYPE_ARTIST' || sub.toLowerCase().includes('artis') || (browseId && browseId.startsWith('UC'));
                const isPlaylistCard = pageType === 'MUSIC_PAGE_TYPE_PLAYLIST' || (browseId && (browseId.startsWith('VL') || browseId.startsWith('PL')));

                // Extract 3 top tracks from the artist card shelf (exact matches to YouTube Music)
                const cardSongs = [];
                for (const item of (card.contents || [])) {
                  const r = item.musicResponsiveListItemRenderer;
                  if (!r) continue;
                  const t = r.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.text || '';
                  const sRuns = r.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || [];
                  const subText = sRuns.map(x => x.text).join('');
                  const durStr = sRuns.length > 0 ? sRuns[sRuns.length - 1]?.text : '';
                  const dSec = extractDurationFromListItem(r) || parseDurationSecs(durStr) || 0;
                  const sThumbs = r.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails
                    || r.thumbnail?.croppedSquareThumbnailRenderer?.thumbnail?.thumbnails || [];
                  let sArt = sThumbs.length ? sThumbs[sThumbs.length - 1].url : '';
                  if (sArt) sArt = sArt.replace(/=(?:w\d+-h\d+|s\d+).*$/, '=w544-h544-l90-rj');
                  const sVid = r.overlay?.musicItemThumbnailOverlayRenderer?.content?.musicPlayButtonRenderer?.playNavigationEndpoint?.watchEndpoint?.videoId
                    || r.playlistItemData?.videoId || '';

                  if (t && sVid) {
                    cardSongs.push({
                      id: 'yt_' + sVid,
                      video_id: sVid,
                      title: t,
                      artist: title,
                      subtitle: subText,
                      duration_secs: dSec,
                      artwork_url: sArt || `https://i.ytimg.com/vi/${sVid}/hqdefault.jpg`,
                      stream_url: '',
                      source_label: 'SoraFy Stream',
                      audio_format: { codec: 'Opus HD', bitrate_kbps: 160, is_lossless: false }
                    });
                  }
                }

                if (isArtistCard && (filterType === 'artist' || filterType === 'all')) {
                  if (title) {
                    itemsList.unshift({
                      id: browseId || ('art_' + title.toLowerCase().replace(/[^a-z0-9]/g, '_')),
                      name: title,
                      title: title,
                      avatar_url: artwork || '',
                      artwork_url: artwork || '',
                      browse_id: browseId,
                      sub_label: sub || 'Artis Terverifikasi',
                      is_top_hero: true,
                      top_songs: cardSongs
                    });
                  }
                } else if (isPlaylistCard && filterType === 'playlist') {
                  itemsList.unshift({
                    id: browseId || ('pl_' + title.toLowerCase().replace(/[^a-z0-9]/g, '_')),
                    title: title,
                    author: 'SoraFy Koleksi',
                    artwork_url: artwork,
                    browse_id: browseId,
                    track_count: 'Daftar Putar',
                    source_label: 'Koleksi Spesial'
                  });
                } else if (filterType === 'all' || filterType === 'song' || filterType === 'video') {
                  const heroVid = card.onTap?.watchEndpoint?.videoId
                    || card.buttons?.[0]?.buttonRenderer?.command?.watchEndpoint?.videoId
                    || card.thumbnailOverlay?.musicItemThumbnailOverlayRenderer?.content?.musicPlayButtonRenderer?.playNavigationEndpoint?.watchEndpoint?.videoId || '';
                  if (heroVid && title) {
                    let heroDuration = 0;
                    for (const r of (card.subtitle?.runs || [])) {
                      const d = parseDurationSecs(r.text);
                      if (d > 0) { heroDuration = d; break; }
                    }
                    if (!heroDuration && card.subtitle?.accessibility?.accessibilityData?.label) {
                      heroDuration = parseDurationSecs(card.subtitle.accessibility.accessibilityData.label);
                    }
                    const heroArtist = card.subtitle?.runs?.find(r => r.navigationEndpoint?.browseEndpoint?.browseId?.startsWith('UC'))?.text
                      || (card.subtitle?.runs?.length > 2 ? card.subtitle.runs[2].text : '') || 'Artist';

                    itemsList.unshift({
                      id: 'yt_' + heroVid,
                      video_id: heroVid,
                      title: title.replace(/\s*\((?:official\s*)?(?:music\s*)?video\)/gi, '').trim(),
                      artist: heroArtist,
                      duration_secs: heroDuration || 0,
                      artwork_url: artwork || `https://i.ytimg.com/vi/${heroVid}/hqdefault.jpg`,
                      stream_url: '',
                      is_video: filterType === 'video',
                      source_label: 'Hasil Teratas',
                      audio_format: { codec: 'Opus HD', bitrate_kbps: 160, is_lossless: false }
                    });
                  }
                }
              }

              const rawItems = [];
              if (sec.musicShelfRenderer?.contents) {
                rawItems.push(...sec.musicShelfRenderer.contents);
              } else if (sec.musicPlaylistShelfRenderer?.contents) {
                rawItems.push(...sec.musicPlaylistShelfRenderer.contents);
              } else if (sec.itemSectionRenderer?.contents) {
                for (const itm of sec.itemSectionRenderer.contents) {
                  if (itm.musicResponsiveListItemRenderer) {
                    rawItems.push(itm);
                  } else if (itm.musicShelfRenderer?.contents) {
                    rawItems.push(...itm.musicShelfRenderer.contents);
                  }
                }
              }
              if (!rawItems.length) continue;

              for (const item of rawItems) {
                const renderer = item.musicResponsiveListItemRenderer;
                if (!renderer || !renderer.flexColumns) continue;

                // Title
                const title = renderer.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.text || '';
                if (!title) continue;

                // Subtitle (Artist, Album, Duration)
                const subRuns = renderer.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || [];

                // Extract all artists (supporting collaborations & multiple artists)
                const artistList = [];
                for (const run of subRuns) {
                  const pType = run.navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType;
                  const bId = run.navigationEndpoint?.browseEndpoint?.browseId || '';
                  if (pType === 'MUSIC_PAGE_TYPE_ARTIST' || bId.startsWith('UC')) {
                    artistList.push({ name: run.text, browse_id: bId });
                  }
                }
                if (artistList.length === 0 && subRuns.length > 0 && subRuns[0]?.text) {
                  const rawArtist = subRuns[0].text;
                  const parts = rawArtist.split(/\s*,\s*|\s+&\s+|\s+(?:feat|ft)\.?\s+/i);
                  if (parts.length > 1) {
                    parts.forEach(p => artistList.push({ name: p.trim(), browse_id: '' }));
                  } else {
                    artistList.push({ name: rawArtist, browse_id: subRuns[0]?.navigationEndpoint?.browseEndpoint?.browseId || '' });
                  }
                }
                const artist = artistList.length ? artistList.map(a => a.name).join(', ') : (subRuns[0]?.text || 'Artist');
                const artistBrowseId = artistList[0]?.browse_id || '';
                const album = subRuns.length > 2 ? subRuns[2]?.text : '';
                const durationStr = subRuns.length > 0 ? subRuns[subRuns.length - 1]?.text : '';
                const durationSec = extractDurationFromListItem(renderer) || parseDurationSecs(durationStr) || 0;

                // Video ID & Browse ID
                const overlay = renderer.overlay?.musicItemThumbnailOverlayRenderer;
                const videoId = overlay?.content?.musicPlayButtonRenderer?.playNavigationEndpoint?.watchEndpoint?.videoId
                  || renderer.playlistItemData?.videoId || '';
                const navEndpoint = item.navigationEndpoint || renderer.navigationEndpoint;
                const browseId = navEndpoint?.browseEndpoint?.browseId
                  || renderer.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId || '';

                // Thumbnail (upgrade resolution from Google/YouTube CDN)
                const thumbs = renderer.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails
                  || renderer.thumbnail?.croppedSquareThumbnailRenderer?.thumbnail?.thumbnails || [];
                let artwork = thumbs.length ? thumbs[thumbs.length - 1].url : '';
                if (artwork) {
                  artwork = artwork.replace(/=(?:w\d+-h\d+|s\d+).*$/, '=w544-h544-p-l90-rj');
                }

                if (filterType === 'artist') {
                  const pType = navEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType
                    || renderer.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType || '';
                  const subStr = subRuns.map(r => r.text).join('').toLowerCase();
                  const isArt = (pType === 'MUSIC_PAGE_TYPE_ARTIST' || subStr.includes('artis') || artist.toLowerCase() === 'artist' || (browseId && browseId.startsWith('UC'))) && !browseId.startsWith('VL') && !browseId.startsWith('PL');

                  if (isArt) {
                    itemsList.push({
                      id: browseId || ('art_' + title.toLowerCase().replace(/[^a-z0-9]/g, '_')),
                      name: title,
                      title: title,
                      avatar_url: artwork || '',
                      artwork_url: artwork || '',
                      browse_id: browseId,
                      sub_label: subRuns.map(r => r.text).join('') || 'Artis'
                    });
                  }
                } else if (filterType === 'album') {
                  const bId = browseId || navEndpoint?.browseEndpoint?.browseId || renderer.navigationEndpoint?.browseEndpoint?.browseId || '';
                  if (bId) {
                    let albumType = 'Album';
                    let year = '';
                    if (subRuns.length > 0) {
                      if (['album', 'single', 'ep'].includes(subRuns[0]?.text?.toLowerCase())) {
                        albumType = subRuns[0].text;
                      }
                      const yearRun = subRuns.find(r => /^\d{4}$/.test(r.text.trim()));
                      if (yearRun) year = yearRun.text.trim();
                    }

                    const isOfficialArtist = !/\b(karaoke|originally performed|in the style of|tribute|cover|instrumental)\b/i.test(title) &&
                                             !/\b(karaoke|instrumental|singer's edge|tribute|vox freaks)\b/i.test(artist);

                    itemsList.push({
                      id: bId || ('alb_' + title.toLowerCase().replace(/[^a-z0-9]/g, '_')),
                      title: title,
                      artist: artist,
                      artists: artistList,
                      artist_browse_id: artistBrowseId,
                      year: year || (subRuns.map(r => r.text).join('') || ''),
                      album_type: albumType,
                      artwork_url: artwork,
                      browse_id: bId,
                      is_official: isOfficialArtist,
                      source_label: 'Album Resmi'
                    });
                  }
                } else if (filterType === 'playlist') {
                  let authorClean = artist;
                  if (!authorClean || authorClean.toLowerCase().includes('youtube') || authorClean === 'Artist') {
                    authorClean = 'SoraFy Koleksi';
                  }
                  itemsList.push({
                    id: browseId || ('pl_' + title.toLowerCase().replace(/[^a-z0-9]/g, '_')),
                    title: title,
                    author: authorClean,
                    artwork_url: artwork,
                    browse_id: browseId,
                    track_count: album || 'Daftar Putar',
                    source_label: 'Koleksi Spesial'
                  });
                } else if (filterType === 'video') {
                  const isOfficial = /\b(official\s*(?:music\s*)?video|video\s*musik|music\s*video|mv|m\/v)\b/i.test(title);
                  const isLiveOrCover = /\b(live|acoustic|akustik|cover|session|remix|konser|karaoke)\b/i.test(title);
                  const videoBadge = isOfficial ? 'Official' : (isLiveOrCover ? 'Live / Session' : 'Video');

                  if (videoId) {
                    const isExplicitVid = !!(renderer.badges && renderer.badges.some(b => {
                      const icon = b.musicInlineBadgeRenderer?.icon?.iconType;
                      const label = b.musicInlineBadgeRenderer?.accessibilityData?.accessibilityData?.label?.toLowerCase() || '';
                      return icon === 'MUSIC_EXPLICIT_BADGE' || label.includes('explicit') || label.includes('eksplisit');
                    }));
                    itemsList.push({
                      id: 'yt_' + videoId,
                      video_id: videoId,
                      title: title,
                      artist: artist,
                      artists: artistList,
                      artist_browse_id: artistBrowseId,
                      album: album || title,
                      duration_secs: durationSec,
                      artwork_url: artwork || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                      stream_url: '',
                      is_video: true,
                      is_explicit: isExplicitVid,
                      video_badge: videoBadge,
                      source_label: 'Video Musik',
                      audio_format: { codec: 'Opus HD', bitrate_kbps: 160, is_lossless: false }
                    });
                  }
                } else {
                  // Standard Song format
                  if (videoId) {
                    const isOfficial = /\b(official\s*(?:music\s*)?video|official\s*audio|video\s*musik)\b/i.test(title);
                    const isExplicitSong = !!(renderer.badges && renderer.badges.some(b => {
                      const icon = b.musicInlineBadgeRenderer?.icon?.iconType;
                      const label = b.musicInlineBadgeRenderer?.accessibilityData?.accessibilityData?.label?.toLowerCase() || '';
                      return icon === 'MUSIC_EXPLICIT_BADGE' || label.includes('explicit') || label.includes('eksplisit');
                    }));
                    itemsList.push({
                      id: 'yt_' + videoId,
                      video_id: videoId,
                      title: title,
                      artist: artist,
                      artists: artistList,
                      artist_browse_id: artistBrowseId,
                      album: album || title,
                      duration_secs: durationSec,
                      artwork_url: artwork,
                      stream_url: '',
                      is_video: false,
                      is_official: isOfficial,
                      is_explicit: isExplicitSong,
                      source_label: 'SoraFy Stream',
                      audio_format: { codec: 'Opus HD', bitrate_kbps: 160, is_lossless: false }
                    });
                  }
                }
              }
            }
          }

          if (filterType === 'song' || filterType === 'all') {
            const isUnwantedCover = /\b(cover\b|karaoke|instrumental|originally performed|in the style of|tribute|backing track|nightcore|slowed\s*\+\s*reverb|sped\s*up|8d\s*audio|bass\s*boosted|hardstyle|techno\s*mix|fan\s*made|parody|ringtone)\b/i;
            const queryHasCover = isUnwantedCover.test(query);

            const qLower = (query || '').toLowerCase().trim();
            const qTokens = qLower.split(/\s+/).filter(t => t.length > 1);

            itemsList.forEach((item, idx) => {
              let score = 500 - idx * 5; // Preserve YouTube Music's native algorithmic rank

              if (item.source_label === 'Hasil Teratas') {
                score += 800; // Curated #1 card from YouTube Music
              }

              const titleLower = (item.title || '').toLowerCase();
              const artistLower = (item.artist || '').toLowerCase();

              // Exact title or artist match bonus
              if (titleLower === qLower || titleLower.startsWith(qLower)) {
                score += 300;
              }
              if (artistLower.includes(qLower) || qLower.includes(artistLower)) {
                score += 250;
              }

              // Matching search tokens
              let matchedTokens = 0;
              for (const tok of qTokens) {
                if (titleLower.includes(tok) || artistLower.includes(tok)) {
                  matchedTokens++;
                }
              }
              score += matchedTokens * 50;

              // Official release bonus
              if (item.is_official || /\b(official\s*(?:music\s*)?video|official\s*audio|album\s*version)\b/i.test(item.title)) {
                score += 180;
              }

              // Verified YouTube Channel (UC...)
              if (item.artist_browse_id && item.artist_browse_id.startsWith('UC')) {
                score += 150;
              }

              // Demote unwanted covers, knockoffs, karaoke, slowed/reverb unless user asked for it
              if (!queryHasCover && isUnwantedCover.test(titleLower + ' ' + artistLower)) {
                score -= 1000;
              }

              item._searchScore = score;
            });

            itemsList.sort((a, b) => (b._searchScore || 0) - (a._searchScore || 0));
          }

          if (filterType === 'album') {
            itemsList.sort((a, b) => {
              if (a.is_official && !b.is_official) return -1;
              if (!a.is_official && b.is_official) return 1;
              return 0;
            });
          }

          resolve(itemsList);
        } catch (e) {
          resolve([]);
        }
      });
    });
    req.on('error', () => resolve([]));
    req.write(payload);
    req.end();
  });
}

function browseYouTubeInnerTube(browseId) {
  if (!browseId) return Promise.resolve(null);
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      browseId,
      context: {
        client: {
          clientName: 'WEB_REMIX',
          clientVersion: '1.20240318.01.00',
          hl: 'id',
          gl: 'ID'
        }
      }
    });

    const req = https.request({
      hostname: 'music.youtube.com',
      path: '/youtubei/v1/browse',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          const twoCol = json.contents?.twoColumnBrowseResultsRenderer;
          const respHeader = twoCol?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.musicResponsiveHeaderRenderer;
          const header = json.header?.musicImmersiveHeaderRenderer || json.header?.musicVisualHeaderRenderer || json.header?.musicDetailHeaderRenderer || respHeader;
          const name = header?.title?.runs?.[0]?.text || json.microformat?.microformatDataRenderer?.title || '';
          const desc = header?.description?.runs?.[0]?.text || header?.description?.musicDescriptionShelfRenderer?.description?.runs?.map(x => x.text).join('') || '';
          const albumArtist = header?.straplineTextOne?.runs?.[0]?.text
            || header?.subtitle?.runs?.find(r => r.navigationEndpoint?.browseEndpoint?.browseId?.startsWith('UC'))?.text
            || '';
          const subText = header?.subscriptionButton?.subscribeButtonRenderer?.subscriberCountText?.runs?.[0]?.text
            || header?.straplineTextOne?.runs?.map(x => x.text).join('')
            || header?.subtitle?.runs?.map(x => x.text).join('')
            || '';
          const thumbs = header?.thumbnails
            || header?.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails
            || header?.thumbnail?.croppedSquareThumbnailRenderer?.thumbnail?.thumbnails
            || [];
          let avatarUrl = thumbs.length ? thumbs[thumbs.length - 1].url : '';
          if (avatarUrl) avatarUrl = avatarUrl.replace(/=(?:w\d+-h\d+|s\d+).*$/, '=w544-h544-p-l90-rj');

          // Extract tracks, albums, videos, and peers
          const parsedTracks = [];
          const parsedAlbums = [];
          const parsedVideos = [];
          const parsedPeers = [];

          const contents = json.contents?.singleColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents
            || twoCol?.secondaryContents?.sectionListRenderer?.contents || [];

          for (const sec of contents) {
            // Top Songs or Album Tracklist
            const shelf = sec.musicShelfRenderer || sec.musicPlaylistShelfRenderer;
            if (shelf && shelf.contents) {
              for (const item of shelf.contents) {
                const r = item.musicResponsiveListItemRenderer;
                if (!r || !r.flexColumns) continue;
                const tTitle = r.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.text || '';
                const subRuns = r.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || [];
                const tArtist = subRuns[0]?.text || albumArtist || name || 'Artist';
                const tAlbum = (subRuns.length > 2 ? subRuns[2]?.text : '') || (browseId.startsWith('MPRE') ? name : '');
                const overlay = r.overlay?.musicItemThumbnailOverlayRenderer;
                const videoId = overlay?.content?.musicPlayButtonRenderer?.playNavigationEndpoint?.watchEndpoint?.videoId
                  || r.playlistItemData?.videoId || '';
                const tThumbs = r.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails
                  || r.thumbnail?.croppedSquareThumbnailRenderer?.thumbnail?.thumbnails || [];
                let artwork = tThumbs.length ? tThumbs[tThumbs.length - 1].url : '';
                if (artwork) artwork = artwork.replace(/=(?:w\d+-h\d+|s\d+).*$/, '=w544-h544-p-l90-rj');

                if (tTitle && videoId) {
                  const isVideoTitle = /\b(official\s*(?:music\s*)?video|video\s*musik|music\s*video|\bmv\b|\bm\/v\b|video\s*clip)\b/i.test(tTitle);
                  if (isVideoTitle && browseId.startsWith('MPRE')) {
                    // Do not include music videos in album tracklist
                    continue;
                  }
                  const isExplicitSong = !!(r.badges && r.badges.some(b => {
                    const icon = b.musicInlineBadgeRenderer?.icon?.iconType;
                    const label = b.musicInlineBadgeRenderer?.accessibilityData?.accessibilityData?.label?.toLowerCase() || '';
                    return icon === 'MUSIC_EXPLICIT_BADGE' || label.includes('explicit') || label.includes('eksplisit');
                  }));
                  parsedTracks.push({
                    id: 'yt_' + videoId,
                    video_id: videoId,
                    title: tTitle.replace(/\s*\((?:official\s*)?(?:music\s*)?video\)/gi, '').trim(),
                    artist: tArtist,
                    album: tAlbum || tTitle,
                    duration_secs: extractDurationFromListItem(r),
                    artwork_url: artwork || avatarUrl || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                    stream_url: '',
                    is_video: false,
                    is_explicit: isExplicitSong,
                    source_label: 'SoraFy Stream',
                    audio_format: { codec: 'Opus HD', bitrate_kbps: 160, is_lossless: false }
                  });
                }
              }
            }

            // Carousels (Albums, Singles, Videos, Live Sessions, Peers)
            const carousel = sec.musicCarouselShelfRenderer;
            const grid = sec.gridRenderer;
            if (carousel || grid) {
              const cTitle = (carousel?.header?.musicCarouselShelfBasicHeaderRenderer?.title?.runs?.[0]?.text || grid?.header?.gridHeaderRenderer?.title?.runs?.[0]?.text || '').toLowerCase();
              const items = carousel?.contents || grid?.items || [];

              for (const it of items) {
                const r = it.musicTwoRowItemRenderer;
                if (!r) continue;
                const itTitle = r.title?.runs?.[0]?.text || '';
                const itSub = r.subtitle?.runs?.map(x => x.text).join('') || '';
                const itThumbs = r.thumbnailRenderer?.musicThumbnailRenderer?.thumbnail?.thumbnails
                  || r.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];
                let itArt = itThumbs.length ? itThumbs[itThumbs.length - 1].url : '';
                if (itArt) itArt = itArt.replace(/=(?:w\d+-h\d+|s\d+).*$/, '=w544-h544-p-l90-rj');

                const nav = r.navigationEndpoint;
                const itBrowseId = nav?.browseEndpoint?.browseId || '';
                const itVideoId = nav?.watchEndpoint?.videoId || '';
                const itPageType = nav?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType || '';

                if (cTitle.includes('album') || cTitle.includes('single') || cTitle.includes('terbaru') || cTitle.includes('rilisan') || cTitle.includes('new') || itPageType === 'MUSIC_PAGE_TYPE_ALBUM' || itBrowseId.startsWith('MPRE')) {
                  if (itTitle) {
                    let itArtist = name || '';
                    let itArtistBrowseId = '';
                    if (r.subtitle?.runs && r.subtitle.runs.length > 0) {
                      const artRun = r.subtitle.runs.find(run =>
                        run.navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType === 'MUSIC_PAGE_TYPE_ARTIST' ||
                        (run.navigationEndpoint?.browseEndpoint?.browseId && run.navigationEndpoint.browseEndpoint.browseId.startsWith('UC'))
                      );
                      if (artRun) {
                        itArtist = artRun.text;
                        itArtistBrowseId = artRun.navigationEndpoint?.browseEndpoint?.browseId || '';
                      } else if (r.subtitle.runs.length >= 3) {
                        itArtist = r.subtitle.runs[2].text;
                      } else if (r.subtitle.runs.length > 0 && !['album', 'single', 'ep', '•', ' · '].includes(r.subtitle.runs[0].text.trim().toLowerCase())) {
                        itArtist = r.subtitle.runs[0].text;
                      }
                    }
                    if (!itArtist) itArtist = 'Artis';

                    parsedAlbums.push({
                      id: itBrowseId || ('alb_' + itTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')),
                      title: itTitle,
                      artist: itArtist,
                      artist_browse_id: itArtistBrowseId,
                      year: itSub,
                      artwork_url: itArt,
                      browse_id: itBrowseId
                    });
                  }
                } else if (cTitle.includes('video') || cTitle.includes('langsung') || itVideoId) {
                  if (itTitle && itVideoId) {
                    const isOfficial = cTitle.includes('video') || /\b(official|mv|video musik)\b/i.test(itTitle);
                    parsedVideos.push({
                      id: 'yt_' + itVideoId,
                      video_id: itVideoId,
                      title: itTitle,
                      artist: name,
                      artwork_url: itArt || `https://i.ytimg.com/vi/${itVideoId}/hqdefault.jpg`,
                      duration_secs: parseDurationSecs(itSub) || 0,
                      is_official: isOfficial,
                      video_badge: isOfficial ? 'Official' : 'Live / Session'
                    });
                  }
                } else if (cTitle.includes('suka') || itPageType === 'MUSIC_PAGE_TYPE_ARTIST') {
                  if (itTitle) {
                    parsedPeers.push({
                      id: itBrowseId || ('art_' + itTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')),
                      name: itTitle,
                      avatar_url: itArt,
                      browse_id: itBrowseId,
                      sub_label: itSub
                    });
                  }
                }
              }
            }
          }

          resolve({
            name,
            description: desc,
            avatar_url: avatarUrl,
            sub_label: subText,
            tracks: parsedTracks,
            albums: parsedAlbums,
            videos: parsedVideos,
            peers: parsedPeers
          });
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.write(payload);
    req.end();
  });
}

function searchYouTubeMusicStrict(title, artist) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      query: `${artist} ${title}`.trim(),
      params: 'EgWKAQIIAWoKEAkQBRAKEAMQBw%3D%3D', // Filter Songs only
      context: {
        client: {
          clientName: 'WEB_REMIX',
          clientVersion: '1.20240318.01.00',
          hl: 'id',
          gl: 'ID'
        }
      }
    });

    const req = https.request({
      hostname: 'music.youtube.com',
      path: '/youtubei/v1/search',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          const contents = json.contents?.tabbedSearchResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents;
          const shelf = contents?.[0]?.musicShelfRenderer?.contents || [];

          // 1. First pass: strict match title and artist (guarantees authentic artist recording)
          for (const item of shelf) {
            const r = item.musicResponsiveListItemRenderer;
            const cTitle = r?.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.text;
            const subRuns = r?.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || [];
            const cArtist = subRuns.map(x => x.text).join(' ');
            const overlay = r?.overlay?.musicItemThumbnailOverlayRenderer;
            const videoId = overlay?.content?.musicPlayButtonRenderer?.playNavigationEndpoint?.watchEndpoint?.videoId
              || r?.playlistItemData?.videoId;
            if (videoId && isStrictMatch(title, artist, cTitle, cArtist)) {
              return resolve(videoId);
            }
          }

          // 2. Second pass: filter out bootlegs/remixes/covers before taking top result
          const isCoverOrRemix = /\b(cover|karaoke|instrumental|tribute|remix|nightcore|slowed|sped\s*up|reverb|techno|hardstyle|bootleg|flip|edit|drill|trap|acoustic|8d\s*audio)\b/i;
          for (const item of shelf) {
            const r = item.musicResponsiveListItemRenderer;
            const cTitle = r?.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs?.[0]?.text || '';
            if (isCoverOrRemix.test(cTitle) && !isCoverOrRemix.test(title)) continue;
            const overlay = r?.overlay?.musicItemThumbnailOverlayRenderer;
            const videoId = overlay?.content?.musicPlayButtonRenderer?.playNavigationEndpoint?.watchEndpoint?.videoId
              || r?.playlistItemData?.videoId;
            if (videoId) return resolve(videoId);
          }
          resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.write(payload);
    req.end();
  });
}

function searchYouTubeId(query) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      query: query.trim(),
      params: "EgWKAQIIAWoKEAkQBRAKEAMQBw%3D%3D", // Filter Songs only
      context: {
        client: {
          clientName: "WEB_REMIX",
          clientVersion: "1.20240318.01.00",
          hl: "id",
          gl: "ID"
        }
      }
    });

    const req = https.request({
      hostname: "music.youtube.com",
      path: "/youtubei/v1/search",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Content-Length": Buffer.byteLength(payload)
      }
    }, res => {
      let body = "";
      res.on("data", c => body += c);
      res.on("end", () => {
        try {
          const json = JSON.parse(body);
          const str = JSON.stringify(json);
          const vids = [...str.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]);
          const unique = [...new Set(vids)];
          resolve(unique[0] || null);
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on("error", () => resolve(null));
    req.write(payload);
    req.end();
  });
}

async function resolveInnerTubeStream(videoId) {
  return new Promise((resolve) => {
    const clientContext = {
      clientName: "IOS",
      clientVersion: "21.03.3",
      osName: "iPadOS",
      osVersion: "17.7.10.21H450",
      deviceMake: "Apple",
      deviceModel: "iPad7,6",
      hl: "id",
      gl: "ID"
    };

    const payload = JSON.stringify({
      context: { client: clientContext },
      videoId: videoId
    });

    const req = https.request({
      hostname: "www.youtube.com",
      path: "/youtubei/v1/player",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": IOS_UA,
        "Content-Length": Buffer.byteLength(payload)
      }
    }, res => {
      let body = "";
      res.on("data", c => body += c);
      res.on("end", () => {
        try {
          const json = JSON.parse(body);
          const formats = json.streamingData?.adaptiveFormats?.filter(f => f.mimeType?.includes("audio"));
          if (formats && formats.length > 0) {
            const chosen = formats.find(f => f.itag === 140) || formats.find(f => f.mimeType?.includes("mp4")) || formats[0];
            const rawUrl = chosen.url;
            const streamUrl = (localProxyPort > 0 && rawUrl)
              ? `http://127.0.0.1:${localProxyPort}/stream?url=${encodeURIComponent(rawUrl)}`
              : rawUrl;
            resolve({
              url: streamUrl,
              rawUrl: rawUrl,
              videoId: videoId,
              bitrate: chosen.bitrate || 160000,
              mimeType: chosen.mimeType || 'audio/mp4',
              provider: 'YouTube Music InnerTube',
              duration: parseInt(json.videoDetails?.lengthSeconds, 10) || 0,
              isFull: true
            });
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on("error", () => resolve(null));
    req.write(payload);
    req.end();
  });
}

let mainWindow = null;
let appTray = null;
let isQuitting = false;

function createTray() {
  const iconPath = path.join(__dirname, 'src/assets/logo.png');
  try {
    if (fs.existsSync(iconPath)) {
      appTray = new Tray(iconPath);
      const contextMenu = Menu.buildFromTemplate([
        {
          label: 'Buka SoraFy',
          click: () => {
            if (mainWindow) {
              mainWindow.show();
              mainWindow.focus();
            }
          }
        },
        {
          label: 'Putar / Jeda',
          click: () => {
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send('media-action', 'play-pause');
            }
          }
        },
        {
          label: 'Lagu Berikutnya',
          click: () => {
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send('media-action', 'next');
            }
          }
        },
        {
          label: 'Lagu Sebelumnya',
          click: () => {
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send('media-action', 'prev');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Keluar',
          click: () => {
            isQuitting = true;
            app.quit();
          }
        }
      ]);
      appTray.setToolTip('SoraFy Desktop Player');
      appTray.setContextMenu(contextMenu);
      appTray.on('double-click', () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      });
    }
  } catch (err) {
    console.warn('Tray init note:', err.message);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: '#0B0D10',
    title: 'SoraFy',
    icon: path.join(__dirname, 'src/assets/logo.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false // allow cross-origin audio streams & covers
    }
  });

  mainWindow = win;
  win.loadFile(path.join(__dirname, 'src/index.html'));
  win.setMenuBarVisibility(false);

  win.on('close', () => {
    isQuitting = true;
  });

  win.on('closed', () => {
    mainWindow = null;
    app.quit();
  });
}

async function resolveArtistProfile(name) {
  if (!name || !name.trim()) return null;
  const trimmed = name.trim();
  try {
    const artists = await searchYouTubeMusicInnerTube(trimmed, 'artist');
    if (!artists || !artists.length) return null;
    const match = artists.find(a => a.name.toLowerCase() === trimmed.toLowerCase()) || artists[0];
    let bio = null;
    if (match.browse_id) {
      bio = await browseYouTubeInnerTube(match.browse_id);
    }
    const artName = bio?.name || match.name || trimmed;
    const artAvatar = bio?.avatar_url || match.avatar_url || '';
    return {
      name: artName,
      title: artName,
      browse_id: match.browse_id || '',
      avatar_url: artAvatar,
      artwork_url: artAvatar,
      banner_url: artAvatar,
      sub_label: match.sub_label || (bio?.sub_label || ''),
      description: bio?.description || '',
      tracks: (match.top_songs && match.top_songs.length) ? match.top_songs : (bio?.tracks || []),
      albums: bio?.albums || [],
      videos: bio?.videos || [],
      peers: bio?.peers || []
    };
  } catch (err) {
    console.warn('resolveArtistProfile error:', err);
    return null;
  }
}

function fetchYouTubeMusicLyrics(videoId) {
  if (!videoId) return Promise.resolve(null);
  const cleanVid = videoId.replace(/^yt_/, '').trim();
  if (!cleanVid) return Promise.resolve(null);

  return new Promise((resolve) => {
    const payload = JSON.stringify({
      videoId: cleanVid,
      context: {
        client: {
          clientName: 'WEB_REMIX',
          clientVersion: '1.20240318.01.00',
          hl: 'id',
          gl: 'ID'
        }
      }
    });

    const req = https.request({
      hostname: 'music.youtube.com',
      path: '/youtubei/v1/next',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          const tabs = json.contents?.singleColumnMusicWatchNextResultsRenderer?.tabbedRenderer?.watchNextTabbedResultsRenderer?.tabs;
          const lyricsTab = tabs?.find(t => 
            t.tabRenderer?.title === 'Lirik' || 
            t.tabRenderer?.title === 'Lyrics' || 
            t.tabRenderer?.endpoint?.browseEndpoint?.browseId?.startsWith('MPLY')
          );
          const browseId = lyricsTab?.tabRenderer?.endpoint?.browseEndpoint?.browseId;
          if (!browseId) {
            resolve(null);
            return;
          }

          const bPayload = JSON.stringify({
            browseId,
            context: {
              client: {
                clientName: 'WEB_REMIX',
                clientVersion: '1.20240318.01.00',
                hl: 'id',
                gl: 'ID'
              }
            }
          });

          const bReq = https.request({
            hostname: 'music.youtube.com',
            path: '/youtubei/v1/browse',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Content-Length': Buffer.byteLength(bPayload)
            }
          }, bRes => {
            let bBody = '';
            bRes.on('data', c => bBody += c);
            bRes.on('end', () => {
              try {
                const bJson = JSON.parse(bBody);
                const desc = bJson.contents?.sectionListRenderer?.contents?.[0]?.musicDescriptionShelfRenderer?.description?.runs;
                if (desc && desc.length) {
                  const plainText = desc.map(r => r.text).join('').trim();
                  const source = bJson.contents?.sectionListRenderer?.contents?.[0]?.musicDescriptionShelfRenderer?.footer?.runs?.map(r => r.text).join('') || 'YouTube Music';
                  resolve({
                    plainLyrics: plainText,
                    source: source
                  });
                } else {
                  resolve(null);
                }
              } catch (_) {
                resolve(null);
              }
            });
          });
          bReq.on('error', () => resolve(null));
          bReq.write(bPayload);
          bReq.end();
        } catch (_) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.write(payload);
    req.end();
  });
}

// IPC Handlers for YouTube Music InnerTube Search & Audio Streaming
ipcMain.handle('search-yt-music', async (event, query, filterType = 'song') => {
  if (!query || !query.trim()) return [];
  return await searchYouTubeMusicInnerTube(query, filterType);
});

ipcMain.handle('fetch-yt-lyrics', async (event, videoId) => {
  return await fetchYouTubeMusicLyrics(videoId);
});

ipcMain.handle('browse-yt', async (event, browseId) => {
  if (!browseId) return null;
  return await browseYouTubeInnerTube(browseId);
});

ipcMain.handle('resolve-artist-profile', async (event, name) => {
  if (!name || !name.trim()) return null;
  return await resolveArtistProfile(name);
});

ipcMain.handle('get-video-embed-url', async (event, { videoId, start = 0 }) => {
  return `http://127.0.0.1:${localProxyPort}/embed?v=${encodeURIComponent(videoId)}&start=${start}`;
});

ipcMain.handle('resolve-direct-video', async (event, videoId) => {
  if (!videoId) return null;
  return await resolveYtDlpVideoStream(videoId);
});

ipcMain.handle('resolve-full-stream', async (event, { title, artist, videoId, isVideo }) => {
  const cacheKey = (videoId ? `vid_${videoId}` : `${artist} - ${title}`).toLowerCase().trim();
  const cached = streamCache.get(cacheKey);
  if (cached && cached.expireAt > Date.now()) {
    // If cache key is for a videoId, but contains a JioSaavn fallback, purge it immediately
    if (videoId && cached.data?.provider?.includes('JioSaavn')) {
      streamCache.delete(cacheKey);
    } else {
      const stream = { ...cached.data };
      if (localProxyPort > 0 && stream.url && stream.url.includes('googlevideo.com')) {
        const raw = stream.rawUrl || stream.url;
        stream.url = `http://127.0.0.1:${localProxyPort}/stream?url=${encodeURIComponent(raw)}`;
      }
      return stream;
    }
  }

  let vid = videoId;

  // 1. If videoId is not provided, strictly search YouTube Music for the official track by the official artist
  if (!vid && title && artist) {
    vid = await searchYouTubeMusicStrict(title, artist);
    if (!vid) {
      vid = await searchYouTubeId(`${artist} ${title}`);
    }
  }

  // 2. High-speed direct stream from official videoId (yt-dlp or InnerTube) - 100% authentic artist recording!
  if (vid) {
    const dlpStream = await resolveYtDlpStream(vid);
    if (dlpStream && dlpStream.url) {
      streamCache.set(cacheKey, { data: dlpStream, expireAt: Date.now() + 45 * 60 * 1000 });
      saveStreamCache();
      return dlpStream;
    }

    const innerStream = await resolveInnerTubeStream(vid);
    if (innerStream && innerStream.url) {
      streamCache.set(cacheKey, { data: innerStream, expireAt: Date.now() + 45 * 60 * 1000 });
      saveStreamCache();
      return innerStream;
    }
  }

  // 3. Fallback to JioSaavn ONLY if no videoId was specified AND candidate strictly matches official artist
  if (!videoId && !isVideo && title && artist) {
    try {
      const saavnStream = await resolveJioSaavnStream(title, artist);
      if (saavnStream && saavnStream.url) {
        streamCache.set(cacheKey, { data: saavnStream, expireAt: Date.now() + 6 * 3600 * 1000 });
        saveStreamCache();
        return saavnStream;
      }
    } catch (_) {}
  }

  return null;
});

// =========================================================
// Universal Importer Engine (Spotify, Apple Music & YouTube Music)
// =========================================================

function fetchTrackArtwork(title, artist) {
  return new Promise((resolve) => {
    if (!title) return resolve(null);
    const cleanArt = (artist || '').replace(/,\s*.*$/, '').trim();
    const q = encodeURIComponent(`${cleanArt} ${title}`.trim());
    const req = https.get(
      `https://itunes.apple.com/search?term=${q}&entity=song&limit=1`,
      { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 2500 },
      (res) => {
        let d = '';
        res.on('data', (c) => (d += c));
        res.on('end', () => {
          try {
            const j = JSON.parse(d);
            if (j.resultCount > 0 && j.results[0].artworkUrl100) {
              return resolve(j.results[0].artworkUrl100.replace('100x100bb', '600x600bb'));
            }
          } catch (_) {}
          resolve(null);
        });
      }
    );
    req.on('error', () => resolve(null));
    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });
  });
}

function fetchSpotifyPlaylistOrAlbum(url) {
  return new Promise((resolve, reject) => {
    const match = url.match(/(playlist|album)[/:]([a-zA-Z0-9]+)/);
    if (!match) return reject(new Error('Format URL Spotify tidak valid. Masukkan tautan playlist atau album publik.'));
    const [, type, id] = match;
    const embedUrl = `https://open.spotify.com/embed/${type}/${id}`;
    https.get(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', async () => {
        const matchScript = data.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
        if (!matchScript) return reject(new Error('Tidak dapat membaca data playlist dari Spotify Embed.'));
        try {
          const json = JSON.parse(matchScript[1]);
          const entity = json.props?.pageProps?.state?.data?.entity;
          if (!entity) return reject(new Error('Playlist Spotify tidak ditemukan atau bersifat privat.'));
          const title = entity.name || (type === 'album' ? 'Album Spotify' : 'Playlist Spotify');
          const playlistCover = entity.coverArt?.sources?.[0]?.url || '';
          const rawTracks = entity.trackList || [];

          // Resolve authentic individual album cover for each song in parallel chunks
          const chunkSize = 20;
          const individualCovers = [];
          for (let i = 0; i < rawTracks.length; i += chunkSize) {
            const chunk = rawTracks.slice(i, i + chunkSize);
            const covers = await Promise.all(chunk.map(t => fetchTrackArtwork(t.title, t.subtitle)));
            individualCovers.push(...covers);
          }

          const tracks = rawTracks.map((t, idx) => {
            const individualCover = individualCovers[idx];
            // If individual cover found, use it; if album, use album cover; if playlist, avoid mosaic for tracks
            const trackArtwork = individualCover || (type === 'album' ? playlistCover : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80');
            const isExplicit = !!(t.isExplicit || (t.contentRatings && t.contentRatings.labels && t.contentRatings.labels.includes('EXPLICIT')));

            return {
              id: `spot_${id}_${idx}_${Date.now()}`,
              title: (t.title || '').trim(),
              artist: (t.subtitle || entity.subtitle || 'Various Artists').trim(),
              duration_secs: Math.round((t.duration || 0) / 1000) || 180,
              artwork_url: trackArtwork,
              is_video: false,
              is_explicit: isExplicit,
              source_label: 'Spotify Match'
            };
          });

          resolve({
            title,
            artwork_url: playlistCover,
            provider: 'Spotify',
            type,
            tracks
          });
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function fetchAppleMusicPlaylistOrAlbum(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const titleMatch = data.match(/<title>([^<]+)<\/title>/);
          const pageTitle = titleMatch ? titleMatch[1].replace(/ - Apple Music.*$/i, '').replace(/^[^\w\s]+/, '').trim() : 'Apple Music Playlist';
          
          let tracks = [];
          // 1. Check serialized-server-data for trackLockup
          const scriptMatch = data.match(/<script type="application\/json" id="serialized-server-data">([\s\S]*?)<\/script>/);
          if (scriptMatch) {
            try {
              const json = JSON.parse(scriptMatch[1]);
              const rootData = Array.isArray(json) ? json[0]?.data : json.data?.[0]?.data;
              const sections = rootData?.sections || [];
              const trackSec = sections.find(s => s.itemKind === 'trackLockup') || sections.find(s => s.items && s.items.length > 0 && s.items[0].artistName);
              if (trackSec && trackSec.items) {
                tracks = trackSec.items.map((it, idx) => ({
                  id: `am_${idx}_${Date.now()}`,
                  title: (it.title || '').trim(),
                  artist: (it.artistName || it.subtitle || 'Various Artists').trim(),
                  duration_secs: it.duration ? Math.round(it.duration / 1000) : 180,
                  artwork_url: it.artwork?.dictionary?.url ? it.artwork.dictionary.url.replace('{w}x{h}', '600x600').replace('{f}', 'jpg') : '',
                  is_video: false,
                  is_explicit: !!(it.contentRating === 'explicit' || it.showExplicitBadge || it.isExplicit),
                  source_label: 'Apple Music Match'
                }));
              }
            } catch (_) {}
          }

          // 2. Fallback to LD+JSON Schema
          if (tracks.length === 0) {
            const schemaMatch = data.match(/<script id="?schema:music-(?:playlist|album)"? type="application\/ld\+json">([\s\S]*?)<\/script>/i);
            if (schemaMatch) {
              const ld = JSON.parse(schemaMatch[1]);
              const ldTracks = ld.track || [];
              tracks = ldTracks.map((t, idx) => ({
                id: `am_ld_${idx}_${Date.now()}`,
                title: (t.name || '').trim(),
                artist: (ld.author?.name || 'Various Artists').trim(),
                duration_secs: 180,
                artwork_url: t.audio?.thumbnailUrl || '',
                is_video: false,
                source_label: 'Apple Music Match'
              }));
            }
          }

          if (tracks.length === 0) {
            return reject(new Error('Tidak ada lagu yang ditemukan di halaman Apple Music tersebut. Pastikan tautan bersifat publik.'));
          }

          resolve({
            title: pageTitle,
            provider: 'Apple Music',
            tracks
          });
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function fetchYouTubePlaylist(url) {
  return new Promise((resolve, reject) => {
    let listId = '';
    const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    if (match) {
      listId = match[1];
    } else {
      const browseMatch = url.match(/\/browse\/(VL[a-zA-Z0-9_-]+|MPRE[a-zA-Z0-9_-]+)/);
      if (browseMatch) listId = browseMatch[1];
    }

    if (!listId) {
      return reject(new Error('URL YouTube Music tidak memiliki parameter playlist atau album (?list=...)'));
    }

    // Try yt-dlp first for fast comprehensive playlist extraction
    execFile(
      YT_DLP_BIN,
      ['--flat-playlist', '-J', url],
      { timeout: 25000, maxBuffer: 10 * 1024 * 1024 },
      async (err, stdout) => {
        if (!err && stdout) {
          try {
            const json = JSON.parse(stdout);
            const title = json.title || 'YouTube Music Playlist';
            const entries = json.entries || [];
            const tracks = entries.map((e, idx) => ({
              id: 'yt_' + (e.id || idx),
              video_id: e.id,
              title: (e.title || '').replace(/\s*\((?:official\s*)?(?:music\s*)?video\)/gi, '').trim(),
              artist: e.uploader || e.channel || 'Artist',
              duration_secs: Math.round(e.duration || 0) || 180,
              artwork_url: e.thumbnails?.length ? e.thumbnails[e.thumbnails.length - 1].url : `https://i.ytimg.com/vi/${e.id}/hqdefault.jpg`,
              is_video: false,
              source_label: 'YouTube Music'
            }));
            if (tracks.length > 0) {
              return resolve({ title, provider: 'YouTube Music', tracks });
            }
          } catch (_) {}
        }

        // Fallback: InnerTube browse
        const browseTarget = listId.startsWith('VL') ? listId : 'VL' + listId;
        const res = await browseYouTubeInnerTube(browseTarget);
        if (res && res.tracks && res.tracks.length > 0) {
          return resolve({
            title: res.name || 'YouTube Music Playlist',
            provider: 'YouTube Music',
            tracks: res.tracks
          });
        }

        reject(new Error('Tidak dapat mengekstrak daftar lagu dari playlist YouTube Music. Pastikan playlist bersifat publik.'));
      }
    );
  });
}

// IPC Handler: Universal Importer
ipcMain.handle('import-external-playlist', async (event, url) => {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { success: false, error: 'Tautan URL tidak boleh kosong.' };
  }
  const cleanUrl = url.trim();

  try {
    if (cleanUrl.includes('spotify.com') || cleanUrl.startsWith('spotify:')) {
      const res = await fetchSpotifyPlaylistOrAlbum(cleanUrl);
      return { success: true, ...res };
    } else if (cleanUrl.includes('music.apple.com')) {
      const res = await fetchAppleMusicPlaylistOrAlbum(cleanUrl);
      return { success: true, ...res };
    } else if (cleanUrl.includes('music.youtube.com') || cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
      const res = await fetchYouTubePlaylist(cleanUrl);
      return { success: true, ...res };
    } else {
      return { success: false, error: 'Platform tidak dikenali. Masukkan tautan dari Spotify, Apple Music, atau YouTube Music.' };
    }
  } catch (err) {
    return { success: false, error: err.message || 'Gagal mengimpor playlist.' };
  }
});

// IPC Handler: Offline Track Downloader (Local Audio Storage)
ipcMain.handle('download-track', async (event, track) => {
  if (!track || !track.title) return { success: false, error: 'Data lagu tidak valid.' };

  const downloadDir = path.join(os.homedir(), 'Music', 'SoraFy');
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  const cleanTitle = (track.title || 'Lagu').replace(/[/\\?%*:|"<>]/g, '_').trim();
  const cleanArtist = (track.artist || 'Artis').replace(/[/\\?%*:|"<>]/g, '_').trim();
  const baseFilename = `${cleanArtist} - ${cleanTitle}`;
  const outPattern = path.join(downloadDir, `${baseFilename}.%(ext)s`);

  let vid = track.video_id;
  if (!vid && track.id && track.id.startsWith('yt_')) {
    vid = track.id.replace('yt_', '');
  }

  if (!vid) {
    vid = await searchYouTubeMusicStrict(track.title, track.artist);
    if (!vid) {
      vid = await searchYouTubeId(`${track.artist} ${track.title}`);
    }
  }

  if (!vid) {
    return { success: false, error: 'Audio resmi tidak dapat ditemukan di YouTube Music.' };
  }

  const videoUrl = `https://www.youtube.com/watch?v=${vid}`;

  return new Promise((resolve) => {
    execFile(
      YT_DLP_BIN,
      [
        '-x',
        '--audio-format', 'mp3',
        '--audio-quality', '0',
        '--no-playlist',
        '--embed-metadata',
        '-o', outPattern,
        videoUrl
      ],
      { timeout: 60000 },
      (err) => {
        if (!err) {
          const finalFile = path.join(downloadDir, `${baseFilename}.mp3`);
          return resolve({
            success: true,
            filePath: finalFile,
            filename: `${baseFilename}.mp3`
          });
        }

        // Fallback: Pipe direct audio stream if yt-dlp conversion fails
        resolveYtDlpStream(vid).then(stream => {
          if (!stream || !stream.url) {
            return resolve({ success: false, error: err ? err.message : 'Gagal mengunduh audio.' });
          }

          const fallbackPath = path.join(downloadDir, `${baseFilename}.opus`);
          const fileStream = fs.createWriteStream(fallbackPath);
          const req = https.get(stream.url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
          }, res => {
            res.pipe(fileStream);
            fileStream.on('finish', () => {
              fileStream.close();
              resolve({ success: true, filePath: fallbackPath, filename: `${baseFilename}.opus` });
            });
          });
          req.on('error', (e) => {
            try { fs.unlinkSync(fallbackPath); } catch (_) {}
            resolve({ success: false, error: e.message });
          });
        });
      }
    );
  });
});

// IPC Handlers: Data Backup & Restore
ipcMain.handle('save-backup-file', async (event, data) => {
  try {
    const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
      title: 'Simpan Cadangan Data SoraFy',
      defaultPath: path.join(os.homedir(), `sorafy-backup-${new Date().toISOString().slice(0, 10)}.json`),
      filters: [{ name: 'JSON Backup', extensions: ['json'] }]
    });

    if (canceled || !filePath) return { success: false, canceled: true };

    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('load-backup-file', async () => {
  try {
    const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
      title: 'Pilih File Cadangan SoraFy (.json)',
      properties: ['openFile'],
      filters: [{ name: 'JSON Backup', extensions: ['json'] }]
    });

    if (canceled || !filePaths || filePaths.length === 0) return { success: false, canceled: true };

    const raw = await fs.promises.readFile(filePaths[0], 'utf-8');
    const parsed = JSON.parse(raw);
    return { success: true, data: parsed, filePath: filePaths[0] };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

app.whenReady().then(() => {
  if (session && session.defaultSession) {
    const CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
    session.defaultSession.setUserAgent(CHROME_UA);

    session.defaultSession.webRequest.onBeforeSendHeaders(
      { urls: ['*://*.googlevideo.com/*', '*://*.youtube.com/*', '*://*.youtube-nocookie.com/*'] },
      (details, callback) => {
        const u = details.url;
        if (u.includes('youtube.com') || u.includes('youtube-nocookie.com')) {
          details.requestHeaders['Referer'] = 'https://www.youtube.com/';
          details.requestHeaders['Origin'] = 'https://www.youtube.com';
        }
        if (u.includes('googlevideo.com')) {
          delete details.requestHeaders['Origin'];
          delete details.requestHeaders['sec-ch-ua'];
          delete details.requestHeaders['sec-ch-ua-mobile'];
          delete details.requestHeaders['sec-ch-ua-platform'];
          details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
        }
        callback({ cancel: false, requestHeaders: details.requestHeaders });
      }
    );

    session.defaultSession.webRequest.onHeadersReceived(
      { urls: ['*://*.youtube.com/*', '*://*.youtube-nocookie.com/*', '*://*.googlevideo.com/*'] },
      (details, callback) => {
        const responseHeaders = { ...details.responseHeaders };
        delete responseHeaders['x-frame-options'];
        delete responseHeaders['X-Frame-Options'];
        delete responseHeaders['content-security-policy'];
        delete responseHeaders['Content-Security-Policy'];
        delete responseHeaders['content-security-policy-report-only'];
        delete responseHeaders['Content-Security-Policy-Report-Only'];
        responseHeaders['Access-Control-Allow-Origin'] = ['*'];
        responseHeaders['Access-Control-Allow-Methods'] = ['GET, HEAD, OPTIONS'];
        responseHeaders['Access-Control-Allow-Headers'] = ['*'];
        callback({ cancel: false, responseHeaders });
      }
    );
  }

  createWindow();
  createTray();

  // Register Global Media Keys for hardware keyboard controls
  try {
    globalShortcut.register('MediaPlayPause', () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('media-action', 'play-pause');
      }
    });
    globalShortcut.register('MediaNextTrack', () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('media-action', 'next');
      }
    });
    globalShortcut.register('MediaPreviousTrack', () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('media-action', 'prev');
      }
    });
    globalShortcut.register('MediaStop', () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('media-action', 'stop');
      }
    });
  } catch (err) {
    console.warn('Global media shortcuts note:', err.message);
  }

  app.on('activate', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    } else if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('before-quit', () => {
  isQuitting = true;
  saveStreamCache();
  globalShortcut.unregisterAll();
  if (localAudioProxy) {
    try {
      localAudioProxy.close();
    } catch (_) {}
  }
  if (appTray) {
    try {
      appTray.destroy();
      appTray = null;
    } catch (_) {}
  }
});

app.on('window-all-closed', () => {
  isQuitting = true;
  app.quit();
});

app.on('will-quit', () => {
  process.exit(0);
});
