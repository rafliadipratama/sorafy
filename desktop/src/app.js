// SoraFy Desktop Core Frontend Controller
// Domain-Driven Design (DDD) Client with Real Multi-Provider Search, 
// Live Streaming Playback, LRCLIB Synced Lyrics & Studio Equalizer DSP
// Musicfy Recommendation & Discovery Algorithm Engine

const DEFAULT_PLUGINS = [
  {
    id: "ytmusic",
    name: "SoraFy Audio Core (InnerTube)",
    version: "1.2.0",
    author: "Team NewPipe & SoraFy",
    description: "High fidelity audio stream extractor (Opus HD 160-320kbps) via official media RPC.",
    category: "Audio Streaming",
    icon: '<iconsax-icon name="video-play" type="bold" size="24" color="#EF4444"></iconsax-icon>',
    is_enabled: true
  },
  {
    id: "monochrome_lossless",
    name: "Monochrome Lossless",
    version: "2.0.0",
    author: "SoraFy Core Team",
    description: "Hi-Res 24-bit FLAC audio stream provider (monochrome.st) without account requirement.",
    category: "Audio Streaming",
    icon: '<iconsax-icon name="music" type="bold" size="24" color="#10B981"></iconsax-icon>',
    is_enabled: true
  },
  {
    id: "deezer",
    name: "Deezer Hi-Fi",
    version: "1.0.0",
    author: "SoraFy Core Team",
    description: "Deezer Hi-Fi catalog with 500x500 high-res album covers and crystal-clear global previews.",
    category: "Audio Streaming",
    icon: '<iconsax-icon name="headphone" type="bold" size="24" color="#8B5CF6"></iconsax-icon>',
    is_enabled: true
  },
  {
    id: "jiosaavn",
    name: "JioSaavn 320k",
    version: "1.0.0",
    author: "SoraFy Core Team",
    description: "High-speed 320kbps AAC audio streaming provider with strict title & artist matching.",
    category: "Audio Streaming",
    icon: '<iconsax-icon name="flash" type="bold" size="24" color="#F59E0B"></iconsax-icon>',
    is_enabled: true
  },
  {
    id: "bandcamp_jamendo",
    name: "Bandcamp & Jamendo",
    version: "1.0.0",
    author: "SoraFy Community",
    description: "Global independent musicians, Creative Commons music, and lossless audio catalog.",
    category: "Audio Streaming",
    icon: '<iconsax-icon name="radio" type="bold" size="24" color="#EC4899"></iconsax-icon>',
    is_enabled: true
  },
  {
    id: "spotify_importer",
    name: "Spotify Importer",
    version: "1.0.0",
    author: "SoraFy Core Team",
    description: "Extract and synchronize public Spotify playlists into SoraFy without a Premium account.",
    category: "Tools & Utilities",
    icon: '<iconsax-icon name="document-download" type="bold" size="24" color="#10B981"></iconsax-icon>',
    is_enabled: true
  },
  {
    id: "discord_rpc",
    name: "Discord Rich Presence",
    version: "1.0.0",
    author: "SoraFy Social",
    description: "Display currently playing track, artist, album art, and progress on your Discord profile.",
    category: "Social & Integration",
    icon: '<iconsax-icon name="cpu" type="bold" size="24" color="#6366F1"></iconsax-icon>',
    is_enabled: true
  },
  {
    id: "equalizer_dsp",
    name: "Equalizer DSP Studio",
    version: "1.0.0",
    author: "Priangan Sound Lab",
    description: "7-band parametric equalizer with dynamic Bass Boost and 3D Virtualizer.",
    category: "Audio DSP",
    icon: '<iconsax-icon name="setting-4" type="bold" size="24" color="#06B6D4"></iconsax-icon>',
    is_enabled: true
  },
  {
    id: "apple_canvas",
    name: "Apple Music Canvas",
    version: "1.0.0",
    author: "SoraFy Visuals",
    description: "Dynamic video artwork visualization and ambient Apple Music-style background animations.",
    category: "Visual & Lyrics",
    icon: '<iconsax-icon name="star" type="bold" size="24" color="#F43F5E"></iconsax-icon>',
    is_enabled: true
  },
  {
    id: "lrclib",
    name: "LRCLIB Synced Karaoke",
    version: "1.0.0",
    author: "LRCLIB Community",
    description: "Precision word-by-word synced karaoke lyrics with live glowing pulse effects.",
    category: "Visual & Lyrics",
    icon: '<iconsax-icon name="microphone-2" type="bold" size="24" color="#3B82F6"></iconsax-icon>',
    is_enabled: true
  },
  {
    id: "soundcloud",
    name: "SoundCloud Audio Stream",
    version: "1.0.0",
    author: "Team NewPipe",
    description: "Stream indie tracks, mixtapes, EDM, remixes, and DJ sets directly from SoundCloud.",
    category: "Audio Streaming",
    icon: '<iconsax-icon name="cloud" type="bold" size="24" color="#F97316"></iconsax-icon>',
    is_enabled: true
  },
  {
    id: "ytdlp_engine",
    name: "yt-dlp Native Engine",
    version: "2024.08.06",
    author: "yt-dlp Core",
    description: "High-speed native extraction engine for maximum bitrate audio and video streams.",
    category: "Audio Streaming",
    icon: '<iconsax-icon name="flash" type="bold" size="24" color="#EF4444"></iconsax-icon>',
    is_enabled: true
  },
  {
    id: "spotube_bridge",
    name: "Spotube Bridge Resolver",
    version: "1.0.1",
    author: "Spotube Open Spec",
    description: "Resolver protocol compatible with .smplug format for external audio track matching.",
    category: "Tools & Utilities",
    icon: '<iconsax-icon name="box" type="bold" size="24" color="#10B981"></iconsax-icon>',
    is_enabled: true
  },
  {
    id: "lastfm",
    name: "Last.fm Scrobbler",
    version: "1.0.0",
    author: "SoraFy Social",
    description: "Automatic scrobbling and artist biography integration directly to your Last.fm account.",
    category: "Social & Integration",
    icon: '<iconsax-icon name="chart-2" type="bold" size="24" color="#E11D48"></iconsax-icon>',
    is_enabled: true
  }
];

const EQ_FREQUENCIES = [60, 150, 400, 1000, 2400, 6000, 15000];
const EQ_PRESETS = {
  "Flat": [0, 0, 0, 0, 0, 0, 0],
  "Bass Boost": [8, 6, 3, 0, 0, 1, 2],
  "Electronic / Cyber": [6, 4, -1, 2, 4, 6, 7],
  "Vocal / Acoustic": [-2, 0, 2, 4, 3, 2, 0]
};

// Safe Tauri IPC Helper
async function invokeTauri(cmd, args = {}) {
  try {
    if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === 'function') {
      return await window.__TAURI__.core.invoke(cmd, args);
    } else if (window.__TAURI__ && window.__TAURI__.tauri && typeof window.__TAURI__.tauri.invoke === 'function') {
      return await window.__TAURI__.tauri.invoke(cmd, args);
    }
  } catch (err) {
    console.warn(`[Tauri IPC] ${cmd} notice:`, err);
  }
  return null;
}

// JSONP Fallback helper for Deezer in browsers with strict CORS
function fetchDeezerJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = 'dz_cb_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
    const script = document.createElement('script');
    const separator = url.includes('?') ? '&' : '?';
    script.src = `${url}${separator}output=jsonp&callback=${callbackName}`;

    window[callbackName] = (data) => {
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
      resolve(data);
    };

    script.onerror = (err) => {
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
      reject(err);
    };

    document.body.appendChild(script);
  });
}

// LRC parser
function parseLrc(lrcText) {
  if (!lrcText) return [];
  const lines = lrcText.split("\n");
  const result = [];
  const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;
  for (const line of lines) {
    const match = regex.exec(line.trim());
    if (match) {
      const min = parseInt(match[1], 10);
      const sec = parseInt(match[2], 10);
      const ms = parseInt(match[3].padEnd(3, '0').slice(0, 3), 10);
      const timestamp_ms = (min * 60 + sec) * 1000 + ms;
      const text = match[4].trim();
      if (text) {
        result.push({ timestamp_ms, text });
      }
    }
  }
  return result;
}

// =========================================================
// Notes-App In-Document Lyrics Search Engine
// =========================================================
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
      default: return m;
    }
  });
}

class LyricsSearchEngine {
  static normalize(str) {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  static findMatchRanges(text, query) {
    if (!text || !query || query.length > text.length) return [];
    const ranges = [];
    const normText = this.normalize(text);
    const normQuery = this.normalize(query);
    if (!normQuery) return [];

    let startIndex = 0;
    while (startIndex <= normText.length - normQuery.length) {
      const foundIndex = normText.indexOf(normQuery, startIndex);
      if (foundIndex < 0) break;
      ranges.push({
        start: foundIndex,
        end: foundIndex + normQuery.length
      });
      startIndex = foundIndex + Math.max(1, normQuery.length);
    }
    return ranges;
  }

  static search(lines, rawQuery) {
    const query = (rawQuery || '').trim();
    if (!query || !lines || lines.length === 0) return [];

    const results = [];
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      const ranges = this.findMatchRanges(line.text, query);
      if (ranges.length > 0) {
        results.push({
          lineIndex: index,
          line: line,
          matchRanges: ranges
        });
      }
    }
    return results;
  }
}

function buildHighlightedHtml(text, ranges, isActiveTarget) {
  if (!ranges || ranges.length === 0) {
    return escapeHtml(text);
  }
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  let html = '';
  let lastIndex = 0;
  const markClass = isActiveTarget ? 'lyric-mark-active' : 'lyric-mark-passive';

  for (const range of sorted) {
    if (range.start > lastIndex) {
      html += escapeHtml(text.slice(lastIndex, range.start));
    }
    const matchedText = text.slice(range.start, range.end);
    html += `<mark class="${markClass}">${escapeHtml(matchedText)}</mark>`;
    lastIndex = range.end;
  }
  if (lastIndex < text.length) {
    html += escapeHtml(text.slice(lastIndex));
  }
  return html;
}

// Master verified avatar directory for top artists (ported from Android ArtistCatalog.kt)
const MASTER_ARTIST_AVATARS = {
  "bernadya": "https://lh3.googleusercontent.com/hxROE1fvLWSxUYAFV3IgMp5vvjN91Jx6oS6uwSVyYN9_fb3I6PLaRa3Ufb4A0awxq4J5UoPFQAQM-Q=w544-h544-l90-rj",
  "tulus": "https://yt3.googleusercontent.com/h8P1jEIZLM8lkMxNA6Nbq98b43wcqllJSNmcZTCRPAB-F6rG_0Nqw5w7fwou0PN1QGwSW5viwWD5NV0=w544-h544-l90-rj",
  "hindia": "https://yt3.googleusercontent.com/8ImMAMQSD4FA6-gdqCZWSFaB-drHvkdfiFcFAk7Mcyy56ctfWD-Xxno-CHfGC4L6Ql8aR61XT0vX0F4b=w544-h544-l90-rj",
  "sal priadi": "https://lh3.googleusercontent.com/wmItRT4hTCJrmnlsh_JBgOeBXww9mquXhrNR0oW3_hPW9LsZ5Z2grMij01EaENdt6ensOJfKm-OCBKqJ=w544-h544-l90-rj",
  "mahalini": "https://yt3.googleusercontent.com/VdgLqr3Sno_U1IXj9qzk43azloCsjBeDy6MpFjfD8kMmco0AeL81qow0cpHynDfpaVlujCY11O7QO4d6=w544-h544-l90-rj",
  "niki": "https://yt3.googleusercontent.com/gKAVVgmPq8rRVjGXzkiaSxnHjfBdOBbl3kf1Nz2cel7vobVD5yzSVPE-Xr4c3brFq2nZ9xbbloRbPg=w544-h544-l90-rj",
  "juicy luicy": "https://yt3.googleusercontent.com/DDebW5VciXI_oMRQC1cRIWlpDIWVaS8c_CbcCkf89YeHVziP9lkgA0xUZmmVRxGKmC3qmppuMtvIsa5U=w544-h544-l90-rj",
  "nadin amizah": "https://yt3.googleusercontent.com/1MrTMYk3XQeTy0EDkJOOkRaHwV2jo-8Es2y8ksOyDThn1btv3VrtzRJy8PbRzVY1V-xj9DBaELpR8jnS=w544-h544-l90-rj",
  "dewa 19": "https://yt3.googleusercontent.com/xFQbHjuH9LO_HkIMSAOf-vu1jMe-hH8y0L0VVEKPSkQn650JFu1Y46RWIIE4oF_kt0JTR5DlxI-NJwBc=w544-h544-l90-rj",
  "sheila on 7": "https://lh3.googleusercontent.com/ZBI5XEhdUvkE59Kr7HKZYIjoopuA_kC0uPAWNsEw-EmLfTtRaXuDEv-qYWTv_lahkpA8Yuhe7P-sO2Y=w544-h544-l90-rj",
  "noah": "https://lh3.googleusercontent.com/6xEP8mOA5xguCiwfeNq08D1o0GK7iPSNMwp80jJpyxw4bwdOgo4EO-8T4rnb8gv3_283YEoQsZvRLD4k=w544-h544-l90-rj",
  "peterpan": "https://lh3.googleusercontent.com/6xEP8mOA5xguCiwfeNq08D1o0GK7iPSNMwp80jJpyxw4bwdOgo4EO-8T4rnb8gv3_283YEoQsZvRLD4k=w544-h544-l90-rj",
  "lyodra": "https://yt3.googleusercontent.com/fX1X2u4D_p36NXWXqmOJneksx8UuAC4YaZGU4IKShOMX4NtaA3CCKyMoFDh4B3WHEIjL6fg7Z4zwb0s=w544-h544-l90-rj",
  "tiara andini": "https://lh3.googleusercontent.com/gYD0RV885nA7hEE9gMEZyiB-aqbiOugfsXaVChO4zBXtOqzKsiiVFGBZin01zDizrp_LeBELRrSuRw=w544-h544-l90-rj",
  "denny caknan": "https://lh3.googleusercontent.com/woWOuYcLDhSRRyFn6kNHJtaiGpD3dW2SnYZanXVdqe96T9Qs1Bt1GchfV73HsIJq2R013krAX3DyLA=w544-h544-l90-rj",
  "guyon waton": "https://yt3.googleusercontent.com/BeY4sDpZ9zge0jFVH0s7v31UQoOb3FubZXQGQ3z_zgFraWot-MkUuF7JH3sSCjtEfzwDgjs3LDgnVsyDJg=w544-h544-l90-rj",
  "feby putri": "https://yt3.googleusercontent.com/BOaqGQqwh7TOLyGlLJI3QcIBezoMHpSHHN5Kn73bbvlqjhc1-hS4mDRYLs_N_yjR81RWrNi-ojwFlw=w544-h544-l90-rj",
  "pamungkas": "https://yt3.googleusercontent.com/taxtgIghV9GbhxPOJ2_Utqh8T72EEBcGynoNX2dw9z-sSurU2GIW7vEM06ZYHJLOtcIOXvQZTpkfoJc=w544-h544-l90-rj",
  "reality club": "https://lh3.googleusercontent.com/YfD3p4VViGZEJw-d5IrbyTjj7YFfd1LnpLP6BU2hFm0WGbHM25ot2BonJZHNV6CeGXjJ_zI5OZVXXyW0=w544-h544-l90-rj",
  "fourtwnty": "https://yt3.googleusercontent.com/2o9I4mMwti1cH7nILSQ4nu3X7f7scfSndSOKTqaJ7FGLo3bGLyXSadZOBIT6bSgbc6H8zYb_gQ=w544-h544-l90-rj",
  "raisa": "https://lh3.googleusercontent.com/HsZDqggC4CwKO3Jp3svqgLquXHRaMENJgx35ADX9ecZoozfxXSr1FgOOBEDIixwwsFWBTqpI1JLNvrho=w544-h544-l90-rj",
  "afgan": "https://yt3.googleusercontent.com/K5YkN0ruZFb_aqz2caPgencgflSqp0BqJYOSEhaCfVcjodcQS65vfH6_IO6JJUnaHI3D2s8v3i8AEyo=w544-h544-l90-rj",
  "rizky febian": "https://yt3.googleusercontent.com/uPbJD1rupFLyxWEOdwV7oO5joK_HbMKin5XsUR_hg1z0WZGp-u9_KtD6sF6X63qkdUZjkXXwabqmik_n=w544-h544-l90-rj",
  "idgitaf": "https://yt3.googleusercontent.com/UjGi4OiorRoR53C60a5AlpFgjno4czBHDD9b9GZXyVlhliSsA5ImOoLN9o2urdnGVmZ0hgkxQKAZkyU=w544-h544-l90-rj",
  "fiersa besari": "https://yt3.googleusercontent.com/uRhP7xgP0ceSFvwo3NP4sVL_iW1hn-NAdbmzl2i_iGvE0-8dwxWR6rhc5iFtoLUYK8EIFayp=w544-h544-l90-rj",
  "billie eilish": "https://lh3.googleusercontent.com/tQC4rOL6xz6FhmFr0ggQExxyGbYSOsyveXVSnPBh2WjEyIzQ9pMHablLJ-0GlMBrLBlBrbWQGmzrV6KN=w544-h544-l90-rj",
  "bruno mars": "https://lh3.googleusercontent.com/hnefGBrazRhn4Z92bdSZBUENl40ONjRiVDsmZKZh-WZ2iCKE-2c7KKR7SNcZfzLHoRyB3E6as8L87YA=w544-h544-l90-rj",
  "taylor swift": "https://yt3.googleusercontent.com/RCpTA6EXJQyjVFDosWOKa2SMmqkua_lA9mHPDWWciLwgqpZLz-k8rXWRF_367trrQ7up9BUwCbk6kRk=w544-h544-l90-rj",
  "coldplay": "https://lh3.googleusercontent.com/IOKuXtp8PCQ_Fc-vaRKm3sKIXBxFV51gZheLTH5br-YGnWHFQf_Jywcuk7wbprYRoEbQyS_XZY6-nMJX=w544-h544-l90-rj",
  "radiohead": "https://lh3.googleusercontent.com/G-Vsaq4pw6Bl5Ny4p_wV9obzu_eyZxynQycvCvQru4Wglzfxg4NO9owDKnSlKys_-WRzPEc0O6ydGA=w544-h544-l90-rj"
};

// Clean Dark Mode Vector SVGs (Replaces all static Unsplash / AI stock imagery)
const DEFAULT_TRACK_ART = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2371717A' stroke-width='1.5'%3E%3Crect width='24' height='24' fill='%2318181B'/%3E%3Ccircle cx='12' cy='12' r='4'/%3E%3Cpath d='M16 8V3l5 2'/%3E%3C/svg%3E";
const DEFAULT_ARTIST_ART = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2371717A' stroke-width='1.5'%3E%3Crect width='24' height='24' fill='%2318181B'/%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";

function getArtistAvatar(artistName) {
  if (!artistName) return DEFAULT_ARTIST_ART;
  const clean = artistName.trim().toLowerCase();
  if (MASTER_ARTIST_AVATARS[clean]) return MASTER_ARTIST_AVATARS[clean];
  for (const [key, val] of Object.entries(MASTER_ARTIST_AVATARS)) {
    if (clean.includes(key) || key.includes(clean)) return val;
  }
  return DEFAULT_ARTIST_ART;
}

// Comprehensive Verified Artist Catalog (Top Indonesian & International Superstars)
const FAMOUS_VERIFIED_ARTISTS = new Set([
  // Top Indonesian Artists & Bands
  "tulus", "raisa", "bernadya", "mahalini", "denny caknan", "sheila on 7", "dewa 19", "noah", "hindia",
  "nadin amizah", "judika", "tiara andini", "lyodra", "sal priadi", "pamungkas", "rizky febian",
  "glenn fredly", "chrisye", "fiersa besari", "juicy luicy", "guyon waton", "ndarboy genk", "wali",
  "peterpan", "geisha", "d'masiv", "kotak", "kerispatih", "ungu", "kangen band", "armada", "ada band",
  "padi", "padi reborn", "gigi", "slank", "iwan fals", "ebiet g. ade", "rossa", "bunga citra lestari",
  "bcl", "agnez mo", "isyana sarasvati", "yura yunita", "danilla", "feby putri", "for revenge",
  "reality club", "the changcuters", ".feast", "feast", "vierratale", "vierra", "maliq & d'essentials",
  "kahitna", "project pop", "reza artamevia", "marion jola", "ziva magnolya", "keisya levronka",
  "fabio asher", "stevan pasaribu", "ghea indrawari", "anggi marito", "batas senja", "soegi bornean",
  "idgitaf", "ardhito pramono", "kunto aji", "rendy pandugo", "afgan", "vidi aldiano", "ran", "hivi!",
  "hivi", "payung teduh", "fourtwnty", "barasuara", "efek rumah kaca", "shaggydog", "tipex", "tip-ex",
  "endank soekamti", "naif", "nidji", "letto", "seventeen", "laleilmanino", "diskoria", "morfem",
  "the sigit", "scaller", "sore", "white shoes & the couples company", "mocca", "pee wee gaskins",
  "kill the dj", "saykoji", "jflow", "rich brian", "niki", "stephanie poetri", "warren hue",
  "happy asmara", "vita alvia", "yeni inka", "tasya rosmala", "nella kharisma", "via vallen",
  "syahiba saufa", "sasya arkhisna", "difarina indra", "cantika davinca", "shinta arsinta",
  "masdo", "sekai no owari",

  // Top International Artists & Bands
  "taylor swift", "the weeknd", "drake", "kendrick lamar", "billie eilish", "bruno mars", "ed sheeran",
  "ariana grande", "justin bieber", "eminem", "rihanna", "post malone", "dua lipa", "coldplay", "queen",
  "bts", "blackpink", "lady gaga", "olivia rodrigo", "travis scott", "maroon 5", "sza", "adele",
  "beyonce", "beyoncé", "lana del rey", "harry styles", "michael jackson", "kanye west", "katy perry",
  "shawn mendes", "sam smith", "imagine dragons", "linkin park", "bring me the horizon", "green day",
  "nirvana", "red hot chili peppers", "oasis", "arctic monkeys", "the beatles", "one direction",
  "selena gomez", "camila cabello", "sabrina carpenter", "charlie puth", "joji", "keshi", "laufey",
  "daniel caesar", "frank ocean", "tyler, the creator", "childish gambino", "mac miller", "juice wrld",
  "xxxtentacion", "lil nas x", "doja cat", "cardi b", "nicki minaj", "megan thee stallion", "21 savage",
  "metro boomin", "future", "j. cole", "a$ap rocky", "calvin harris", "david guetta", "avicii",
  "alan walker", "marshmello", "the chainsmokers", "martin garrix", "kygo", "zedd", "skrillex",
  "daft punk", "sia", "bebe rexha", "halsey", "lorde", "mitski", "clairo", "phoebe bridgers",
  "chappell roan", "gracie abrams", "benson boone", "teddy swims", "hozier", "lewis capaldi",
  "twenty one pilots", "radiohead", "pink floyd", "led zeppelin", "guns n' roses", "metallica",
  "ac/dc", "bon jovi", "aerosmith", "u2", "the rolling stones", "fleetwood mac", "elvis presley",
  "david bowie", "prince", "whitney houston", "celine dion", "mariah carey", "shakira", "bad bunny",
  "j balvin", "maluma", "rosalia", "rosalía", "peso pluma", "karol g", "daddy yankee", "anuel aa",
  "rauw alejandro", "ozuna", "stray kids", "twice", "newjeans", "le sserafim", "aespa", "ive",
  "enhypen", "tomorrow x together", "txt", "exo", "nct", "ateez", "itzy", "fujii kaze", "yoasobi",
  "kenshi yonezu", "ado", "lisa", "jennie", "rose", "rosé", "jisoo", "jungkook", "jimin", "v",
  "suga", "rm", "j-hope", "jin", "suisei", "hoshimachi suisei", "limp bizkit", "sombr", "bleachers",
  "disturbed", "p.o.d.", "thom yorke"
]);

// Musify High-Fidelity Culture & Genre Clusters (Strict Se-Genre & Se-Kultur Algorithm)
const MUSIFY_CULTURE_CLUSTERS = [
  {
    id: "indo_indie_folk",
    name: "Indonesian Indie, Folk & Senja Pop",
    keywords: [
      "bernadya", "hindia", "sal priadi", "nadin amizah", "feby putri", "pamungkas",
      "danilla", "fiersa besari", "juicy luicy", "fourtwnty", "idgitaf", "dere",
      "eñau", "enau", "soegi bornean", "ardhito pramono", "kunto aji", "bilal indrajaya",
      "baskara putra", "lomba sihir", "coldiac", "batiga", "the adams", "morfem",
      "rumahsakit", "barasuara", "payung teduh", "parade hujan", "daun jatuh", "hal"
    ],
    searchSeeds: [
      "indie folk indonesia terpopuler",
      "lagu indie senja akustik",
      "pop indie indonesia terbaik"
    ],
    bannedWords: ["koplo", "dangdut", "kendang", "jedag jedug", "remix koplo"]
  },
  {
    id: "indo_pop_mainstream",
    name: "Indonesian Contemporary Pop & Ballad",
    keywords: [
      "tulus", "mahalini", "lyodra", "tiara andini", "raisa", "afgan", "rizky febian",
      "yura yunita", "jaz", "budi doremi", "judika", "anji", "keisya levronka",
      "ziva magnolya", "glenn fredly", "cakra khan", "fabio asher", "anggi marito",
      "ghea indrawari", "ade govind", "marion jola", "vidi aldiano", "rossa", "bcl"
    ],
    searchSeeds: [
      "pop indonesia terpopuler hits",
      "lagu pop galau indonesia",
      "indonesian pop ballad hits"
    ],
    bannedWords: ["koplo", "dangdut", "kendang", "jedag jedug", "metal"]
  },
  {
    id: "indo_band_nostalgia",
    name: "Indonesian 90s-2000s Pop & Rock Band",
    keywords: [
      "sheila on 7", "dewa 19", "noah", "peterpan", "padi", "ungu", "d'masiv",
      "gigi", "ada band", "kotak", "letto", "maliq & d'essentials", "kahitna",
      "kerispatih", "seventeen", "drive", "nidji", "samsons", "j-rocks", "radja",
      "element", "naff", "vierra", "vierratale", "geisha", "the changcuters", "slank"
    ],
    searchSeeds: [
      "band indonesia 2000an terbaik",
      "nostalgia pop rock indonesia",
      "band pop hits indonesia"
    ],
    bannedWords: ["koplo", "dangdut", "kpop", "jedag jedug"]
  },
  {
    id: "indo_dangdut_koplo",
    name: "Indonesian Dangdut & Koplo Jawa",
    keywords: [
      "denny caknan", "guyon waton", "happy asmara", "gilga sahid", "ndarboy genk",
      "shinta arsinta", "woro widowati", "difarina indra", "ndx aka", "aftershine",
      "didi kempot", "fira cantika", "yenny inka", "sasya arkhisna", "tasya rosmala"
    ],
    searchSeeds: [
      "dangdut koplo jawa hits",
      "lagu koplo ambyar terpopuler",
      "lagu jawa terpopuler"
    ],
    bannedWords: ["radiohead", "coldplay", "kpop", "metal"]
  },
  {
    id: "western_alt_indie",
    name: "Western Alternative & Dream Pop",
    keywords: [
      "radiohead", "billie eilish", "lana del rey", "coldplay", "lorde",
      "the neighbourhood", "cigarettes after sex", "arctic monkeys", "phoebe bridgers",
      "bleachers", "clairo", "mitski", "girl in red", "conan gray", "beabadoobee",
      "wallows", "the 1975", "beach house", "men i trust", "cage the elephant", "chappell roan"
    ],
    searchSeeds: [
      "dream pop indie hits",
      "chill indie alternative hits",
      "indie alternative songs"
    ],
    bannedWords: ["dangdut", "koplo", "kendang", "jedag jedug"]
  },
  {
    id: "western_pop_rnb",
    name: "Western Mainstream Pop & R&B",
    keywords: [
      "bruno mars", "taylor swift", "sabrina carpenter", "olivia rodrigo",
      "the weeknd", "ed sheeran", "ariana grande", "justin bieber", "dua lipa",
      "maroon 5", "harry styles", "charlie puth", "shawn mendes", "lady gaga",
      "adele", "sza", "post malone", "katy perry", "sam smith", "rihanna",
      "selena gomez", "tate mcrae", "camila cabello", "benson boone"
    ],
    searchSeeds: [
      "top billboard pop hits",
      "global pop hits terpopuler",
      "western pop acoustic hits"
    ],
    bannedWords: ["dangdut", "koplo", "kendang", "jedag jedug"]
  },
  {
    id: "western_rock_metal",
    name: "Western Rock & Alternative Metal",
    keywords: [
      "linkin park", "green day", "metallica", "avenged sevenfold", "nirvana",
      "muse", "foo fighters", "my chemical romance", "bring me the horizon",
      "red hot chili peppers", "paramore", "blink-182", "fall out boy", "oasis"
    ],
    searchSeeds: [
      "alternative rock anthems",
      "best modern rock hits",
      "classic rock songs"
    ],
    bannedWords: ["dangdut", "koplo", "kpop", "jedag jedug"]
  },
  {
    id: "kpop_asian",
    name: "K-Pop & Asian Wave",
    keywords: [
      "bts", "blackpink", "newjeans", "ive", "aespa", "twice", "stray kids",
      "seventeen", "txt", "le sserafim", "jungkook", "jennie", "rosé", "lisa",
      "taeyeon", "iu", "exo", "red velvet", "itzy", "enhypen", "babymonster"
    ],
    searchSeeds: [
      "kpop top trending hits",
      "korean pop best songs",
      "kpop girl group boy group hits"
    ],
    bannedWords: ["dangdut", "koplo", "kendang"]
  }
];

function detectMusifyCulture(artistName, trackTitle) {
  const cleanArt = (artistName || "").toLowerCase().trim();
  const cleanTit = (trackTitle || "").toLowerCase().trim();

  for (const cluster of MUSIFY_CULTURE_CLUSTERS) {
    if (cluster.keywords.some(k => cleanArt.includes(k) || k.includes(cleanArt))) {
      return cluster;
    }
  }

  const isJawa = /\b(tresno|lungo|loro|dalan|kisinan|tiwas|wirang|nemen|cidro|sewu|bojo|sayang|amung)\b/i.test(cleanTit) ||
                 /\b(tresno|lungo|loro|dalan|kisinan|tiwas|wirang|nemen|cidro|sewu|bojo|sayang|amung)\b/i.test(cleanArt);
  if (isJawa) {
    return MUSIFY_CULTURE_CLUSTERS.find(c => c.id === "indo_dangdut_koplo");
  }

  const isIndo = /\b(yang|dan|aku|kamu|kita|hati|cinta|senja|rindu|malam|tentang|kembali|bila|saat|menanti|hujan|hilang|selamat|pulang|bunga)\b/i.test(cleanTit);
  if (isIndo) {
    return MUSIFY_CULTURE_CLUSTERS.find(c => c.id === "indo_indie_folk");
  }

  const isHangulOrKpop = /[\u3131-\uD79D]/.test(cleanTit) || /[\u3131-\uD79D]/.test(cleanArt);
  if (isHangulOrKpop) {
    return MUSIFY_CULTURE_CLUSTERS.find(c => c.id === "kpop_asian");
  }

  return MUSIFY_CULTURE_CLUSTERS.find(c => c.id === "western_alt_indie");
}

function isCompatibleMusifyTrack(candidate, seedTrack, seedCluster) {
  if (!candidate || !candidate.title) return false;
  const candArt = (candidate.artist || "").toLowerCase().trim();
  const candTit = (candidate.title || "").toLowerCase().trim();
  const seedArt = (seedTrack.artist || "").toLowerCase().trim();

  // Same artist is always 100% compatible
  if (candArt.includes(seedArt) || seedArt.includes(candArt)) {
    return true;
  }

  // Check cluster banned words
  if (seedCluster && seedCluster.bannedWords) {
    for (const banned of seedCluster.bannedWords) {
      if (candArt.includes(banned) || candTit.includes(banned)) {
        return false;
      }
    }
  }

  // Reject generic bootlegs, unofficial covers, karaoke
  if (/\b(cover by|karaoke version|instrumental karaoke|tribute to|lofi remix cover|dj\s+(?:remix|tiktok|jedag))\b/i.test(candTit)) {
    return false;
  }

  // Strict culture isolation
  if (seedCluster) {
    const isSeedIndo = seedCluster.id.startsWith("indo_");
    const isSeedWestern = seedCluster.id.startsWith("western_");

    if (isSeedIndo) {
      if (seedCluster.id === "indo_dangdut_koplo") {
        const dangdutCluster = MUSIFY_CULTURE_CLUSTERS.find(c => c.id === "indo_dangdut_koplo");
        const isCandDangdut = dangdutCluster.keywords.some(k => candArt.includes(k));
        const hasJawa = /\b(tresno|lungo|loro|dalan|kisinan|tiwas|wirang|nemen|cidro|sewu|bojo|koplo|dangdut)\b/i.test(candTit);
        return isCandDangdut || hasJawa;
      }

      // If seed is non-dangdut Indo, strictly reject dangdut
      const dangdutCluster = MUSIFY_CULTURE_CLUSTERS.find(c => c.id === "indo_dangdut_koplo");
      if (dangdutCluster.keywords.some(k => candArt.includes(k))) return false;
      if (/\b(dangdut|koplo|kendang|remix koplo)\b/i.test(candTit)) return false;

      // Reject non-Indonesian candidate
      const candCulture = detectMusifyCulture(candArt, candTit);
      if (!candCulture || !candCulture.id.startsWith("indo_")) {
        return false;
      }
      return true;
    }

    if (isSeedWestern) {
      if (/\b(dangdut|koplo|kendang)\b/i.test(candTit)) return false;
      const candCulture = detectMusifyCulture(candArt, candTit);
      if (candCulture && candCulture.id.startsWith("indo_")) {
        return false;
      }
      return true;
    }

    if (seedCluster.id === "kpop_asian") {
      const candCulture = detectMusifyCulture(candArt, candTit);
      return candCulture && candCulture.id === "kpop_asian";
    }
  }

  return true;
}

const I18N_DICTIONARY = {
  en: {
    nav_home: "Home",
    nav_explore: "Explore",
    nav_plugins: "Plugins & Extensions",
    nav_equalizer: "Equalizer DSP",
    nav_settings: "Settings",
    sidebar_playlists: "My Playlists",
    quick_picks: "Quick Picks",
    quick_picks_sub: "START RADIO FROM A SONG",
    recommended: "Recommended For You",
    recommended_sub: "SIMILAR TO YOUR TASTE",
    trending_community: "Featured Playlists",
    featured_playlists: "Featured Playlists",
    featured_playlists_sub: "Official curated editorial playlists",
    new_releases: "Albums Recommended For You",
    recommended_albums: "Albums Recommended For You",
    recommended_albums_sub: "Based on songs and artists you listen to frequently",
    music_videos: "Music Videos",
    offline_notice: "You are currently offline. Local cache playback is active.",
    settings_tab_audio: "Audio & Quality",
    settings_tab_system: "System",
    settings_tab_data: "Data & Backup",
    settings_tab_shortcuts: "Shortcuts",
    settings_tab_about: "About",
    setting_language: "Language / Bahasa",
    setting_language_desc: "Select display language for user interface.",
    setting_audio_quality: "Audio Streaming Quality",
    setting_audio_quality_desc: "Select preferred bitrate for playback stream.",
    setting_volume_norm: "Volume Normalization",
    setting_volume_norm_desc: "Equalize loudness levels across tracks automatically.",
    setting_crossfade: "Crossfade Between Tracks",
    setting_crossfade_desc: "Smooth transition when switching to the next track.",
    setting_close_tray: "Close to System Tray",
    setting_close_tray_desc: "Keep playback running in background when window is closed (X).",
    setting_notifications: "Desktop Track Notifications",
    setting_notifications_desc: "Show pop-up notification when track changes in background.",
    setting_discord_rpc: "Discord Rich Presence",
    setting_discord_rpc_desc: "Show your currently playing track on your Discord profile.",
    setting_cache_storage: "Audio Cache & Storage",
    setting_cache_storage_desc: "Clear cached audio streams and artworks to free disk space.",
    setting_cache_quota: "Max Cache Quota (LRU)",
    setting_cache_quota_desc: "Automatically evict oldest streams when cache exceeds this limit.",
    setting_cookies_title: "YouTube Cookies (Anti-Bot Bypass)",
    setting_cookies_desc: "Import Netscape cookies.txt to bypass YouTube age gates and IP bot blocks.",
    setting_backup_all: "Backup All Data",
    setting_backup_all_desc: "Save your custom playlists, liked tracks, listening history, and sound preferences to a secure JSON file.",
    setting_restore_data: "Restore Data",
    setting_restore_data_desc: "Restore your playlists, liked tracks, and listening profile from a previously saved JSON file.",
    btn_clear_cache: "Clear Cache",
    btn_import_cookies: "Import cookies.txt",
    btn_backup_data: "Backup Data (.json)",
    btn_restore_data: "Restore Data",
    nav_downloads: "Downloads",
    nav_library: "Your Library",
    library_title: "Your Library",
    tab_all: "All",
    tab_liked_songs: "Liked Songs",
    tab_downloads: "Downloads",
    tab_albums: "Albums",
    tab_artists: "Artists",
    tab_playlists: "Playlists",
    liked_albums_empty: "No liked albums yet. Browse albums and click the heart icon to save them to your library.",
    followed_artists_empty: "You are not following any artists yet. Click '+ Follow' on an artist profile to tune your recommendations.",
    btn_like_album: "Like Album",
    btn_liked_album: "Liked Album",
    downloads_title: "Downloaded Music",
    downloads_empty_title: "No downloaded tracks yet",
    downloads_empty_desc: "Right-click any song while online and choose 'Download Track (MP3)' to listen offline anytime.",
    btn_open_folder: "Open Folder",
    btn_view_downloads: "View Downloads",
    btn_play_all: "Play All",
    btn_shuffle: "Shuffle",
    setting_ytdlp_title: "Audio Engine Companion (yt-dlp)",
    setting_ytdlp_desc: "Enables local offline MP3 downloads and unlimited 1000+ track playlist imports.",
    setting_cookies_hint: "Tip: Export cookies with browser extension 'Get cookies.txt LOCALLY' if YouTube restricts access.",
    btn_check_engine: "Check / Download Engine",
    search_placeholder: "Search songs, artists, music videos, or playlists...",
    popular_suggestions: "Popular Suggestions:",
    songs: "Songs",
    artists: "Artists",
    albums: "Albums",
    videos: "Videos",
    playlists: "Playlists",
    unit_seconds: "s",
    no_tracks: "No tracks in this playlist yet.",
    toast_playing: "Playing",
    toast_added_to_playlist: "Added to playlist",
    toast_removed_from_playlist: "Removed from playlist"
  },
  id: {
    nav_home: "Beranda",
    nav_explore: "Jelajah",
    nav_plugins: "Plugin & Ekstensi",
    nav_equalizer: "Equalizer DSP",
    nav_downloads: "Lagu Tersimpan",
    nav_library: "Koleksi Saya",
    library_title: "Koleksi Saya",
    tab_all: "Semua",
    tab_liked_songs: "Lagu Disukai",
    tab_downloads: "Lagu Terunduh",
    tab_albums: "Album Favorit",
    tab_artists: "Artis Diikuti",
    tab_playlists: "Playlist",
    liked_albums_empty: "Belum ada album favorit. Jelajahi album dan klik ikon hati untuk menyimpannya di koleksi Anda.",
    followed_artists_empty: "Anda belum mengikuti artis apa pun. Klik '+ Follow' di profil artis untuk menyesuaikan rekomendasi beranda Anda.",
    btn_like_album: "Sukai Album",
    btn_liked_album: "Album Disukai",
    nav_settings: "Pengaturan",
    sidebar_playlists: "Playlist Saya",
    quick_picks: "Pilihan Cepat",
    quick_picks_sub: "MULAI RADIO DARI LAGU",
    recommended: "Rekomendasi Untuk Anda",
    recommended_sub: "SESUAI DENGAN SELERA ANDA",
    trending_community: "Playlist Pilihan",
    featured_playlists: "Playlist Pilihan",
    featured_playlists_sub: "Playlist resmi terkurasi langsung",
    new_releases: "Rekomendasi Album Untukmu",
    recommended_albums: "Rekomendasi Album Untukmu",
    recommended_albums_sub: "Berdasarkan musik yang sering kamu dengarkan",
    music_videos: "Video Musik",
    offline_notice: "Anda sedang offline. Pemutaran cache lokal aktif.",
    settings_tab_audio: "Audio & Kualitas",
    settings_tab_system: "Sistem",
    settings_tab_data: "Data & Cadangan",
    settings_tab_shortcuts: "Pintasan Keyboard",
    settings_tab_about: "Tentang",
    setting_language: "Bahasa / Language",
    setting_language_desc: "Pilih bahasa tampilan untuk antarmuka pengguna.",
    setting_audio_quality: "Kualitas Streaming Audio",
    setting_audio_quality_desc: "Pilih bitrate yang diinginkan untuk streaming audio.",
    setting_volume_norm: "Normalisasi Volume",
    setting_volume_norm_desc: "Ratakan tingkat kenyaringan volume antar lagu secara otomatis.",
    setting_crossfade: "Crossfade Antar Lagu",
    setting_crossfade_desc: "Transisi halus saat berpindah ke lagu berikutnya.",
    setting_close_tray: "Tutup ke System Tray",
    setting_close_tray_desc: "Tetap jalankan musik di latar belakang saat jendela ditutup (X).",
    setting_notifications: "Notifikasi Lagu Desktop",
    setting_notifications_desc: "Tampilkan notifikasi pop-up saat lagu berganti di latar belakang.",
    setting_discord_rpc: "Discord Rich Presence",
    setting_discord_rpc_desc: "Tampilkan lagu yang sedang diputar di profil Discord Anda.",
    setting_cache_storage: "Penyimpanan & Cache Audio",
    setting_cache_storage_desc: "Bersihkan cache streaming audio dan gambar album untuk menghemat ruang disk.",
    setting_cache_quota: "Batas Kuota Cache (LRU)",
    setting_cache_quota_desc: "Hapus otomatis stream terlama saat cache melebihi batas ini.",
    setting_cookies_title: "Cookie YouTube (Anti-Bot & Verifikasi)",
    setting_cookies_desc: "Impor file cookies.txt untuk melewati pembatasan verifikasi atau batas usia YouTube.",
    setting_cookies_hint: "Tips: Ekspor cookies dengan ekstensi browser 'Get cookies.txt LOCALLY' jika YouTube membatasi akses.",
    setting_ytdlp_title: "Mesin Pendukung Audio (yt-dlp)",
    setting_ytdlp_desc: "Mengaktifkan unduhan MP3 offline lokal dan impor playlist tak terbatas 1000+ lagu.",
    setting_backup_all: "Cadangkan Semua Data",
    setting_backup_all_desc: "Simpan semua playlist kustom, lagu favorit, riwayat, dan preferensi ke file JSON yang aman.",
    setting_restore_data: "Pulihkan Data",
    setting_restore_data_desc: "Pulihkan playlist, lagu favorit, dan riwayat Anda dari file JSON cadangan.",
    btn_clear_cache: "Bersihkan Cache",
    btn_import_cookies: "Impor cookies.txt",
    btn_check_engine: "Periksa / Unduh Mesin",
    btn_backup_data: "Cadangkan Data (.json)",
    btn_restore_data: "Pulihkan Data",
    downloads_title: "Lagu Tersimpan",
    downloads_empty_title: "Belum ada lagu yang diunduh",
    downloads_empty_desc: "Klik kanan lagu saat online dan pilih 'Download Track (MP3)' untuk mendengarkan secara offline kapan saja.",
    btn_open_folder: "Buka Folder",
    btn_view_downloads: "Lihat Unduhan",
    btn_play_all: "Putar Semua",
    btn_shuffle: "Acak",
    setting_cache_storage_desc: "Bersihkan cache streaming audio dan gambar album untuk menghemat ruang disk.",
    setting_cache_quota: "Batas Kuota Cache (LRU)",
    setting_cache_quota_desc: "Hapus otomatis stream terlama saat cache melebihi batas ini.",
    setting_cookies_title: "Cookie YouTube (Anti-Bot & Verifikasi)",
    setting_cookies_desc: "Impor file cookies.txt untuk melewati pembatasan verifikasi atau batas usia YouTube.",
    setting_backup_all: "Cadangkan Semua Data",
    setting_backup_all_desc: "Simpan semua playlist kustom, lagu favorit, riwayat, dan preferensi ke file JSON yang aman.",
    setting_restore_data: "Pulihkan Data",
    setting_restore_data_desc: "Pulihkan playlist, lagu favorit, dan riwayat Anda dari file JSON cadangan.",
    btn_clear_cache: "Bersihkan Cache",
    btn_import_cookies: "Impor cookies.txt",
    btn_backup_data: "Cadangkan Data (.json)",
    btn_restore_data: "Pulihkan Data",
    search_placeholder: "Cari lagu, artis, video musik, atau playlist...",
    popular_suggestions: "Saran Populer:",
    songs: "Lagu",
    artists: "Artis",
    albums: "Album",
    videos: "Video",
    playlists: "Playlist",
    unit_seconds: " dtk",
    no_tracks: "Belum ada lagu di playlist ini.",
    toast_playing: "Memutar",
    toast_added_to_playlist: "Ditambahkan ke playlist",
    toast_removed_from_playlist: "Dihapus dari playlist"
  }
};

class SoraFyDesktopApp {
  constructor() {
    this.audio = document.getElementById("audioSource");
    this.tracks = [];
    this.homeTracks = [];
    this.officialQuickPicks = [];
    this.officialCharts = [];
    this.officialCommunityPlaylists = [];
    this.officialNewReleases = [];
    this.currentShelves = [];
    this.plugins = [...DEFAULT_PLUGINS];
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.isShuffled = false;
    this.repeatMode = 0; // 0: off, 1: all, 2: one
    this.currentLyrics = [];
    this.activeLyricIndex = -1;
    this.currentView = "home";
    this.isFetchingRadioQueue = false;
    this.isUpcomingQueueTriggeredForCurrent = false;

    // Persistence
    this.likedTrackIds = new Set(JSON.parse(localStorage.getItem("sorafy_liked_ids") || "[]"));
    this.historyTracks = JSON.parse(localStorage.getItem("sorafy_history") || "[]");
    this.userPlaylists = JSON.parse(localStorage.getItem("sorafy_user_playlists") || "[]");
    this.followedArtists = new Set(JSON.parse(localStorage.getItem("sorafy_followed_artists") || "[]"));
    this.followedArtistDetails = JSON.parse(localStorage.getItem("sorafy_followed_artist_details") || "{}");
    this.likedAlbums = JSON.parse(localStorage.getItem("sorafy_liked_albums") || "[]");
    this.activeLibraryTab = "all";

    // App state
    this.curatedPlaylists = [];
    this.currentArtist = null;
    this.currentPlaylist = null;
    this.selectedTrackForPlaylist = null;
    this.currentSearchFilter = "all";

    // Equalizer Web Audio API
    this.audioCtx = null;
    this.audioSourceNode = null;
    this.eqFilters = [];
    this.bassFilterNode = null;
    this.currentGains = [0, 0, 0, 0, 0, 0, 0];
    this.bassBoostAmount = 0;
    this.virtualizerAmount = 0;

    // Search Debounce Timer
    this.searchDebounceTimer = null;

    // Seekbar dragging states
    this.playerSeekbar = null;
    this.isSeekingBottom = false;
    this.isSeekingScreen = false;

    // Side panel tab & volume states
    this.activeSideTab = "lyrics";
    this.previousVolume = 0.85;

    // Spotify-Style Instant Engine: Dual Preload Player & Queue Prefetcher
    this.preloadAudio = new Audio();
    this.preloadAudio.preload = "auto";
    this.preloadAudio.volume = 0;
    this.isNextTrackPreloaded = false;
    this.preloadedTrackIndex = -1;

    // State for playback resume & persistence
    this.hasRestoredSession = false;
    this._lastSessionSave = 0;

    this.initElements();
    this.initEvents();
    this.initPlugins();
    this.initAudioEqualizer();
    this.initUserPlaylists();
    this.initYtmHomeLayout();
    this.loadCuratedPlaylists();
    this.loadInitialCatalog();

    // Initialize persisted volume
    const savedVol = localStorage.getItem("sorafy_volume");
    const initialVol = savedVol !== null ? parseFloat(savedVol) : 0.85;
    this.setVolume(isNaN(initialVol) ? 0.85 : initialVol);

    // Restore last played track and timestamp on launch
    setTimeout(() => {
      this.restorePlaybackSession().catch(err => {
        console.warn("Playback session restore notice:", err);
      });
    }, 120);
  }

  initElements() {
    this.playPauseBtn = document.getElementById("playPauseBtn");
    this.playPauseIcon = document.getElementById("playPauseIcon");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.shuffleBtn = document.getElementById("shuffleBtn");
    this.repeatBtn = document.getElementById("repeatBtn");
    this.likeBtn = document.getElementById("likeBtn");
    this.volumeSlider = document.getElementById("volumeSlider");
    this.volumeMuteBtn = document.getElementById("volumeMuteBtn");
    this.volumeIcon = document.getElementById("volumeIcon");
    this.volumeLabel = document.getElementById("volumeLabel");

    this.playerTitle = document.getElementById("playerTitle");
    this.playerArtist = document.getElementById("playerArtist");
    this.playerArtwork = document.getElementById("playerArtwork");
    this.playerBadge = document.getElementById("playerBadge");
    this.playerSourceTag = document.getElementById("playerSourceTag");

    this.currentTimeLabel = document.getElementById("currentTimeLabel");
    this.durationLabel = document.getElementById("durationLabel");

    this.lyricsContainer = document.getElementById("lyricsContainer");
    this.sideDrawer = document.getElementById("sideDrawer") || document.getElementById("lyricsPanel");
    this.lyricsPanel = this.sideDrawer;
    this.tabLyricsBtn = document.getElementById("tabLyricsBtn");
    this.tabQueueBtn = document.getElementById("tabQueueBtn");
    this.clearQueueBtn = document.getElementById("clearQueueBtn");
    this.closeSideDrawerBtn = document.getElementById("closeSideDrawerBtn") || document.getElementById("closeLyricsBtn");
    this.closeLyricsBtn = this.closeSideDrawerBtn;
    this.queueContainer = document.getElementById("queueContainer");
    this.queueNowPlaying = document.getElementById("queueNowPlaying");
    this.queueList = document.getElementById("queueList");
    this.queueBadge = document.getElementById("queueBadge");
    this.appLayout = document.getElementById("appLayout");
    this.toggleLyricsBtn = document.getElementById("toggleLyricsBtn");
    this.toggleQueueBtn = document.getElementById("toggleQueueBtn");

    // In-Document Notes-App Style Lyrics Search Components
    this.lyricsSearchToggleBtn = document.getElementById("lyricsSearchToggleBtn");
    this.lyricsSearchBar = document.getElementById("lyricsSearchBar");
    this.lyricsSearchInput = document.getElementById("lyricsSearchInput");
    this.lyricsClearBtn = document.getElementById("lyricsClearBtn");
    this.lyricsMatchCounter = document.getElementById("lyricsMatchCounter");
    this.lyricsPrevMatchBtn = document.getElementById("lyricsPrevMatchBtn");
    this.lyricsNextMatchBtn = document.getElementById("lyricsNextMatchBtn");
    this.lyricsSearchCloseBtn = document.getElementById("lyricsSearchCloseBtn");

    this.isLyricsSearchOpen = false;
    this.lyricsMatches = [];
    this.currentLyricsMatchIndex = -1;
    this.lyricsLineElements = [];

    // Lyrics Timing Offset Calibration Controls
    this.lyricsOffsetBadge = document.getElementById("lyricsOffsetBadge");
    this.lyricsOffsetMinusBtn = document.getElementById("lyricsOffsetMinusBtn");
    this.lyricsOffsetPlusBtn = document.getElementById("lyricsOffsetPlusBtn");
    this.lyricsOffsets = JSON.parse(localStorage.getItem("sorafy_lyrics_offsets") || "{}");

    this.searchInput = document.getElementById("searchInput");
    this.searchClearBtn = document.getElementById("searchClearBtn");
    this.searchSuggestions = document.getElementById("searchSuggestions");
    this.searchFilterTabs = document.getElementById("searchFilterTabs");
    this.filterTabBtns = document.querySelectorAll(".filter-tab-btn");
    this.suggestionChips = document.querySelectorAll(".suggestion-chip");

    this.categoryChips = document.querySelectorAll(".category-chips .chip");
    this.sectionTitleLabel = document.getElementById("sectionTitleLabel");
    this.viewAllBtn = document.getElementById("viewAllBtn");
    this.topToast = document.getElementById("topToast");
    this.toastMessage = document.getElementById("toastMessage");

    this.heroPlayBtn = document.getElementById("heroPlayBtn");
    this.trackGrid = document.getElementById("trackGrid");

    // Curated Playlists section on Home
    this.curatedPlaylistsSection = document.getElementById("curatedPlaylistsSection");
    this.curatedPlaylistsRow = document.getElementById("curatedPlaylistsRow");
    this.refreshPlaylistsBtn = document.getElementById("refreshPlaylistsBtn");

    // YouTube Music Modern Layout Elements
    this.DEFAULT_TRACK_ART = DEFAULT_TRACK_ART;
    this.DEFAULT_ARTIST_ART = DEFAULT_ARTIST_ART;
    this.ytmMixCardsGrid = document.getElementById("ytmMixCardsGrid");
    this.ytmMusicVideosRow = document.getElementById("ytmMusicVideosRow");
    this.ytmCommunityPlaylistsRow = document.getElementById("ytmCommunityPlaylistsRow");
    this.ytmNewReleasesRow = document.getElementById("ytmNewReleasesRow");
    this.playAllVideosBtn = document.getElementById("playAllVideosBtn");
    this.viewAllNewReleasesBtn = document.getElementById("viewAllNewReleasesBtn");
    this.videoNavPrevBtn = document.getElementById("videoNavPrevBtn");
    this.videoNavNextBtn = document.getElementById("videoNavNextBtn");
    this.commPlPrevBtn = document.getElementById("commPlPrevBtn");
    this.commPlNextBtn = document.getElementById("commPlNextBtn");
    this.newRelPrevBtn = document.getElementById("newRelPrevBtn");
    this.newRelNextBtn = document.getElementById("newRelNextBtn");
    this.currentMusicVideos = [];

    // User Custom Playlists in Sidebar
    this.sidebarCreatePlaylistBtn = document.getElementById("sidebarCreatePlaylistBtn");
    this.userPlaylistsNav = document.getElementById("userPlaylistsNav");

    // View Containers & Header
    this.contentHeader = document.querySelector(".content-header");
    this.homeViewContainer = document.getElementById("homeViewContainer");
    this.exploreViewContainer = document.getElementById("exploreViewContainer");
    this.pluginsViewContainer = document.getElementById("pluginsViewContainer");
    this.equalizerViewContainer = document.getElementById("equalizerViewContainer");
    this.libraryViewContainer = document.getElementById("libraryViewContainer");
    this.searchResultsContainer = document.getElementById("searchResultsContainer");
    this.artistViewContainer = document.getElementById("artistViewContainer");
    this.playlistViewContainer = document.getElementById("playlistViewContainer");

    // Your Library View Elements
    this.librarySubtitle = document.getElementById("librarySubtitle");
    this.libFilterPills = document.querySelectorAll(".library-filter-pill");
    this.libLikedSection = document.getElementById("libLikedSection");
    this.libDownloadsSection = document.getElementById("libDownloadsSection");
    this.libDownloadsCount = document.getElementById("libDownloadsCount");
    this.libAlbumsSection = document.getElementById("libAlbumsSection");
    this.libArtistsSection = document.getElementById("libArtistsSection");
    this.libPlaylistsSection = document.getElementById("libPlaylistsSection");
    this.libLikedList = document.getElementById("libLikedList");
    this.libLikedCount = document.getElementById("libLikedCount");
    this.libLikedEmpty = document.getElementById("libLikedEmpty");
    this.libLikedPlayAllBtn = document.getElementById("libLikedPlayAllBtn");
    this.libLikedShuffleBtn = document.getElementById("libLikedShuffleBtn");
    this.libAlbumsGrid = document.getElementById("libAlbumsGrid");
    this.libAlbumsCount = document.getElementById("libAlbumsCount");
    this.libAlbumsEmpty = document.getElementById("libAlbumsEmpty");
    this.libArtistsGrid = document.getElementById("libArtistsGrid");
    this.libArtistsCount = document.getElementById("libArtistsCount");
    this.libArtistsEmpty = document.getElementById("libArtistsEmpty");
    this.libPlaylistsGrid = document.getElementById("libPlaylistsGrid");
    this.libPlaylistsCount = document.getElementById("libPlaylistsCount");
    this.libCreatePlaylistBtn = document.getElementById("libCreatePlaylistBtn");

    // Album Like Button Elements
    this.playlistLikeAlbumBtn = document.getElementById("playlistLikeAlbumBtn");
    this.playlistLikeAlbumLabel = document.getElementById("playlistLikeAlbumLabel");

    // Downloads View Elements
    this.downloadsSubtitle = document.getElementById("downloadsSubtitle");
    this.downloadsTrackList = document.getElementById("downloadsTrackList");
    this.downloadsEmptyState = document.getElementById("downloadsEmptyState");
    this.downloadsPlayAllBtn = document.getElementById("downloadsPlayAllBtn");
    this.downloadsShuffleBtn = document.getElementById("downloadsShuffleBtn");
    this.downloadsOpenFolderBtn = document.getElementById("downloadsOpenFolderBtn");
    this.downloadsRefreshBtn = document.getElementById("downloadsRefreshBtn");
    this.offlineGoToDownloadsBtn = document.getElementById("offlineGoToDownloadsBtn");
    this.downloadedTracks = [];

    // Audio Engine Companion (yt-dlp) Settings Elements
    this.settingYtDlpStatus = document.getElementById("settingYtDlpStatus");
    this.settingInstallYtDlpBtn = document.getElementById("settingInstallYtDlpBtn");

    // Horizontal Swipe Carousels (YouTube Music Style)
    this.quickPicksSection = document.getElementById("quickPicksSection");
    this.quickPicksCarousel = document.getElementById("quickPicksCarousel");
    this.quickPicksPrevBtn = document.getElementById("quickPicksPrevBtn");
    this.quickPicksNextBtn = document.getElementById("quickPicksNextBtn");
    this.chartsCarousel = document.getElementById("chartsCarousel");
    this.chartsPrevBtn = document.getElementById("chartsPrevBtn");
    this.chartsNextBtn = document.getElementById("chartsNextBtn");
    this.moodGenreGrid = document.getElementById("moodGenreGrid");
    this.exploreNewReleasesRow = document.getElementById("exploreNewReleasesRow");
    this.screenPlayerNativeVideo = document.getElementById("screenPlayerNativeVideo");

    // Search Results Sections
    this.searchResultsTitle = document.getElementById("searchResultsTitle");
    this.searchResultsCount = document.getElementById("searchResultsCount");
    this.searchTopResultSection = document.getElementById("searchTopResultSection");
    this.searchTopResultCard = document.getElementById("searchTopResultCard");
    this.searchArtistsSection = document.getElementById("searchArtistsSection");
    this.searchArtistHeroSlot = document.getElementById("searchArtistHeroSlot");
    this.searchArtistsGrid = document.getElementById("searchArtistsGrid");
    this.searchAlbumsSection = document.getElementById("searchAlbumsSection");
    this.searchAlbumsGrid = document.getElementById("searchAlbumsGrid");
    this.searchVideosSection = document.getElementById("searchVideosSection");
    this.searchVideosGrid = document.getElementById("searchVideosGrid");
    this.searchPlaylistsSection = document.getElementById("searchPlaylistsSection");
    this.searchPlaylistsGrid = document.getElementById("searchPlaylistsGrid");
    this.searchSongsSection = document.getElementById("searchSongsSection");
    this.searchSongsList = document.getElementById("searchSongsList");

    // Artist Detail Screen Elements
    this.artistBackBtn = document.getElementById("artistBackBtn");
    this.artistHeroBanner = document.getElementById("artistHeroBanner");
    this.artistAvatarImg = document.getElementById("artistAvatarImg");
    this.artistNameHeading = document.getElementById("artistNameHeading");
    this.artistVerifiedBadge = document.getElementById("artistVerifiedBadge");
    this.artistBioText = document.getElementById("artistBioText");
    this.artistPlayAllBtn = document.getElementById("artistPlayAllBtn");
    this.artistShuffleBtn = document.getElementById("artistShuffleBtn");
    this.artistFollowBtn = document.getElementById("artistFollowBtn");
    this.artistTopTracksList = document.getElementById("artistTopTracksList");
    this.artistPopularCount = document.getElementById("artistPopularCount");
    this.artistVideosGrid = document.getElementById("artistVideosGrid");
    this.artistVideoCountLabel = document.getElementById("artistVideoCountLabel");
    this.artistAlbumsRow = document.getElementById("artistAlbumsRow");
    this.artistAlbumCountLabel = document.getElementById("artistAlbumCountLabel");
    this.artistPeerRow = document.getElementById("artistPeerRow");

    // Playlist Detail Screen Elements
    this.playlistBackBtn = document.getElementById("playlistBackBtn");
    this.playlistCoverImg = document.getElementById("playlistCoverImg");
    this.playlistTitleHeading = document.getElementById("playlistTitleHeading");
    this.playlistDescText = document.getElementById("playlistDescText");
    this.playlistStatsText = document.getElementById("playlistStatsText");
    this.playlistPlayAllBtn = document.getElementById("playlistPlayAllBtn");
    this.playlistShuffleBtn = document.getElementById("playlistShuffleBtn");
    this.playlistEditBtn = document.getElementById("playlistEditBtn");
    this.playlistDeleteBtn = document.getElementById("playlistDeleteBtn");
    this.playlistTrackList = document.getElementById("playlistTrackList");

    // Nav Items
    this.navItems = document.querySelectorAll(".nav-menu .nav-item");

    // Plugins view elements
    this.pluginListGrid = document.getElementById("pluginListGrid");
    this.resetPluginsBtn = document.getElementById("resetPluginsBtn");

    // Equalizer view elements
    this.eqBandsRow = document.getElementById("eqBandsRow");
    this.eqChips = document.querySelectorAll("#equalizerViewContainer .chip");
    this.bassBoostSlider = document.getElementById("bassBoostSlider");
    this.bassBoostVal = document.getElementById("bassBoostVal");
    this.virtualizerSlider = document.getElementById("virtualizerSlider");
    this.virtualizerVal = document.getElementById("virtualizerVal");

    // Unified Import Modal elements (Spotify, Apple Music, YouTube Music)
    this.unifiedImportModal = document.getElementById("unifiedImportModal");
    this.sidebarImportPlaylistBtn = document.getElementById("sidebarImportPlaylistBtn");
    this.closeUnifiedImportModalBtn = document.getElementById("closeUnifiedImportModalBtn");
    this.cancelUnifiedImportBtn = document.getElementById("cancelUnifiedImportBtn");
    this.submitUnifiedImportBtn = document.getElementById("submitUnifiedImportBtn");
    this.unifiedImportUrlInput = document.getElementById("unifiedImportUrlInput");
    this.importPlatformTabs = document.getElementById("importPlatformTabs");
    this.unifiedImportLabel = document.getElementById("unifiedImportLabel");
    this.unifiedImportStatus = document.getElementById("unifiedImportStatus");
    this.unifiedImportStatusText = document.getElementById("unifiedImportStatusText");
    this.selectedImportPlatform = "spotify";

    // Personalized Taste Shelf elements
    this.personalizedShelfSection = document.getElementById("personalizedShelfSection");
    this.personalizedShelfTitle = document.getElementById("personalizedShelfTitle");
    this.personalizedShelfRow = document.getElementById("personalizedShelfRow");

    // Backwards-compatible aliases
    this.spotifyModal = this.unifiedImportModal;
    this.openSpotifyImportBtn = this.sidebarImportPlaylistBtn;
    this.closeSpotifyModalBtn = this.closeUnifiedImportModalBtn;
    this.cancelSpotifyBtn = this.cancelUnifiedImportBtn;
    this.submitSpotifyBtn = this.submitUnifiedImportBtn;
    this.spotifyUrlInput = this.unifiedImportUrlInput;

    // Create Custom Playlist Modal elements
    this.createPlaylistModal = document.getElementById("createPlaylistModal");
    this.closeCreatePlaylistModalBtn = document.getElementById("closeCreatePlaylistModalBtn");
    this.cancelCreatePlaylistBtn = document.getElementById("cancelCreatePlaylistBtn");
    this.submitCreatePlaylistBtn = document.getElementById("submitCreatePlaylistBtn");
    this.playlistNameInput = document.getElementById("playlistNameInput");
    this.playlistDescInput = document.getElementById("playlistDescInput");

    // Edit Custom Playlist Modal elements
    this.editPlaylistModal = document.getElementById("editPlaylistModal");
    this.closeEditPlaylistModalBtn = document.getElementById("closeEditPlaylistModalBtn");
    this.cancelEditPlaylistBtn = document.getElementById("cancelEditPlaylistBtn");
    this.submitEditPlaylistBtn = document.getElementById("submitEditPlaylistBtn");
    this.editPlaylistNameInput = document.getElementById("editPlaylistNameInput");
    this.editPlaylistDescInput = document.getElementById("editPlaylistDescInput");

    // Add to Playlist Modal elements
    this.addToPlaylistModal = document.getElementById("addToPlaylistModal");
    this.closeAddToPlaylistModalBtn = document.getElementById("closeAddToPlaylistModalBtn");
    this.cancelAddToPlaylistBtn = document.getElementById("cancelAddToPlaylistBtn");
    this.modalCreateNewPlaylistBtn = document.getElementById("modalCreateNewPlaylistBtn");
    this.modalUserPlaylistsList = document.getElementById("modalUserPlaylistsList");
    this.addToPlaylistTrackTitle = document.getElementById("addToPlaylistTrackTitle");

    // Track Context Menu (Klik Kanan) Elements
    this.trackContextMenu = document.getElementById("trackContextMenu");
    this.contextMenuLikeText = document.getElementById("contextMenuLikeText");
    this.contextMenuTrack = null;
    this.artistRoleBadge = document.getElementById("artistRoleBadge");

    // Dedicated Screen Player Elements
    this.screenPlayerViewContainer = document.getElementById("screenPlayerViewContainer");
    this.screenPlayerBackBtn = document.getElementById("screenPlayerBackBtn");
    this.modeAudioBtn = document.getElementById("modeAudioBtn");
    this.modeVideoBtn = document.getElementById("modeVideoBtn");
    this.screenPlayerBadge = document.getElementById("screenPlayerBadge");
    this.screenPlayerToggleLyricsBtn = document.getElementById("screenPlayerToggleLyricsBtn");
    this.screenPlayerToggleQueueBtn = document.getElementById("screenPlayerToggleQueueBtn");
    this.screenPlayerAudioView = document.getElementById("screenPlayerAudioView");
    this.screenPlayerArtwork = document.getElementById("screenPlayerArtwork");
    this.screenPlayerVideoView = document.getElementById("screenPlayerVideoView");
    this.screenPlayerVideoLoading = document.getElementById("screenPlayerVideoLoading");
    this.screenPlayerNativeVideo = document.getElementById("screenPlayerNativeVideo");
    this.screenPlayerVideoFrame = document.getElementById("screenPlayerVideoFrame");
    this.screenPlayerVideoOverlay = document.getElementById("screenPlayerVideoOverlay");
    this.videoOverlayTitle = document.getElementById("videoOverlayTitle");
    this.videoOverlayArtist = document.getElementById("videoOverlayArtist");
    this.videoOverlayPipBtn = document.getElementById("videoOverlayPipBtn");
    this.videoOverlayFullscreenBtn = document.getElementById("videoOverlayFullscreenBtn");
    this.videoOverlayCenterPlayBtn = document.getElementById("videoOverlayCenterPlayBtn");
    this.videoOverlayCenterPlayIcon = document.getElementById("videoOverlayCenterPlayIcon");
    this.videoOverlayProgressBar = document.getElementById("videoOverlayProgressBar");
    this.videoOverlayProgressFill = document.getElementById("videoOverlayProgressFill");
    this.videoOverlayCurrentTime = document.getElementById("videoOverlayCurrentTime");
    this.videoOverlayDuration = document.getElementById("videoOverlayDuration");
    this.videoOverlaySwitchAudioBtn = document.getElementById("videoOverlaySwitchAudioBtn");
    this.screenPlayerTitle = document.getElementById("screenPlayerTitle");
    this.screenPlayerArtist = document.getElementById("screenPlayerArtist");
    this.screenPlayerLikeBtn = document.getElementById("screenPlayerLikeBtn");
    this.screenPlayerAddToPlaylistBtn = document.getElementById("screenPlayerAddToPlaylistBtn");
    this.screenPlayerCurrentTime = document.getElementById("screenPlayerCurrentTime");
    this.screenPlayerDuration = document.getElementById("screenPlayerDuration");
    this.screenPlayerSeekbar = document.getElementById("screenPlayerSeekbar");
    this.screenPlayerShuffleBtn = document.getElementById("screenPlayerShuffleBtn");
    this.screenPlayerPrevBtn = document.getElementById("screenPlayerPrevBtn");
    this.screenPlayerPlayPauseBtn = document.getElementById("screenPlayerPlayPauseBtn");
    this.screenPlayerPlayPauseIcon = document.getElementById("screenPlayerPlayPauseIcon");
    this.screenPlayerNextBtn = document.getElementById("screenPlayerNextBtn");
    this.screenPlayerRepeatBtn = document.getElementById("screenPlayerRepeatBtn");

    this.playerSeekbar = document.getElementById("playerSeekbar");
    this.bottomPlayerTrackInfo = document.getElementById("bottomPlayerTrackInfo");
    this.expandPlayerBtn = document.getElementById("expandPlayerBtn");

    // Sleep Timer Elements & State
    this.sleepTimerMinutes = 0;
    this.sleepTimerTargetMs = null;
    this.sleepTimerInterval = null;
    this.isSleepTimerAtTrackEnd = false;
    this.sleepTimerBtn = document.getElementById("sleepTimerBtn");
    this.sleepTimerBadge = document.getElementById("sleepTimerBadge");
    this.sleepTimerModal = document.getElementById("sleepTimerModal");
    this.closeSleepTimerModalBtn = document.getElementById("closeSleepTimerModalBtn");
    this.sleepTimerOptions = document.getElementById("sleepTimerOptions");

    // Settings Hub Elements & State
    this.navSettings = document.getElementById("navSettings");
    this.settingsModal = document.getElementById("settingsModal");
    this.closeSettingsModalBtn = document.getElementById("closeSettingsModalBtn");
    this.settingsTabBar = document.getElementById("settingsTabBar");
    this.settingAudioQuality = document.getElementById("settingAudioQuality");
    this.settingVolumeNorm = document.getElementById("settingVolumeNorm");
    this.settingCrossfade = document.getElementById("settingCrossfade");
    this.settingCrossfadeLabel = document.getElementById("settingCrossfadeLabel");
    this.settingCloseToTray = document.getElementById("settingCloseToTray");
    this.settingNotifications = document.getElementById("settingNotifications");
    this.settingDiscordRpc = document.getElementById("settingDiscordRpc");
    this.settingClearCacheBtn = document.getElementById("settingClearCacheBtn");
    this.settingCacheQuota = document.getElementById("settingCacheQuota");
    this.settingSelectCookieBtn = document.getElementById("settingSelectCookieBtn");
    this.settingClearCookieBtn = document.getElementById("settingClearCookieBtn");
    this.settingCookieStatus = document.getElementById("settingCookieStatus");
    this.settingLanguage = document.getElementById("settingLanguage");
    this.offlineBanner = document.getElementById("offlineBanner");
    this.currentLanguage = localStorage.getItem("sorafy_language") || "en";
    this.playlistChunkObserver = null;
    this.settingExportBackupBtn = document.getElementById("settingExportBackupBtn");
    this.settingRestoreBackupBtn = document.getElementById("settingRestoreBackupBtn");
    this.checkUpdateBtn = document.getElementById("checkUpdateBtn");
    this.updateStatusText = document.getElementById("updateStatusText");

    this.currentScreenMode = "audio"; // "audio" or "video"
    this.previousView = "home";
  }

  t(key, fallback = "") {
    const lang = this.currentLanguage || "en";
    if (I18N_DICTIONARY[lang] && I18N_DICTIONARY[lang][key]) {
      return I18N_DICTIONARY[lang][key];
    }
    if (I18N_DICTIONARY["en"] && I18N_DICTIONARY["en"][key]) {
      return I18N_DICTIONARY["en"][key];
    }
    return fallback || key;
  }

  applyLanguage(lang) {
    this.currentLanguage = lang === "id" ? "id" : "en";
    localStorage.setItem("sorafy_language", this.currentLanguage);
    if (this.appSettings) this.appSettings.language = this.currentLanguage;

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const translation = this.t(key);
      if (translation) {
        el.textContent = translation;
      }
    });

    if (this.searchInput) {
      this.searchInput.placeholder = this.t("search_placeholder");
    }

    if (this.settingCrossfadeLabel && this.appSettings) {
      const val = this.appSettings.crossfadeDuration || 0;
      this.settingCrossfadeLabel.textContent = `${val}${this.currentLanguage === "id" ? " dtk" : "s"}`;
    }

    if (this.settingLanguage) {
      this.settingLanguage.value = this.currentLanguage;
    }
  }

  initOfflineListener() {
    this.offlineBanner = document.getElementById("offlineBanner");
    const checkStatus = () => {
      const isOffline = !navigator.onLine;
      if (this.offlineBanner) {
        this.offlineBanner.style.display = isOffline ? "flex" : "none";
      }
    };
    window.addEventListener("online", checkStatus);
    window.addEventListener("offline", checkStatus);
    checkStatus();
  }

  fadeInAudio(durationSecs) {
    if (!this.audio || durationSecs <= 0) return;
    const targetVolume = this.volumeSlider ? parseFloat(this.volumeSlider.value) : 0.85;
    this.audio.volume = 0;
    const steps = 15;
    const intervalMs = Math.max(30, (durationSecs * 1000) / steps);
    let step = 0;
    const fadeTimer = setInterval(() => {
      step++;
      const ratio = step / steps;
      if (this.audio) {
        this.audio.volume = Math.min(targetVolume, targetVolume * ratio);
      }
      if (step >= steps) {
        clearInterval(fadeTimer);
        if (this.audio) this.audio.volume = targetVolume;
      }
    }, intervalMs);
  }

  fadeOutAudio(durationSecs) {
    return new Promise((resolve) => {
      if (!this.audio || !this.isPlaying || durationSecs <= 0) return resolve();
      const startVolume = this.audio.volume;
      const steps = 12;
      const intervalMs = Math.max(25, (durationSecs * 1000) / steps);
      let step = 0;
      const fadeTimer = setInterval(() => {
        step++;
        const ratio = 1 - (step / steps);
        if (this.audio) {
          this.audio.volume = Math.max(0, startVolume * ratio);
        }
        if (step >= steps) {
          clearInterval(fadeTimer);
          resolve();
        }
      }, intervalMs);
    });
  }

  // Official Verified Artist Rosette Checkmark
  getVerifiedBadgeHtml(size = 13) {
    return `<span class="verified-artist-badge" title="Verified Artist"><svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="#38BDF8"><path d="M10.007 2.22a2.89 2.89 0 0 1 3.986 0l.915.867a2.89 2.89 0 0 0 2.22.812l1.258-.088a2.89 2.89 0 0 1 2.818 2.818l-.088 1.258a2.89 2.89 0 0 0 .812 2.22l.867.915a2.89 2.89 0 0 1 0 3.986l-.867.915a2.89 2.89 0 0 0-.812 2.22l.088 1.258a2.89 2.89 0 0 1-2.818 2.818l-1.258-.088a2.89 2.89 0 0 0-2.22.812l-.915.867a2.89 2.89 0 0 1-3.986 0l-.915-.867a2.89 2.89 0 0 0-2.22-.812l-1.258.088a2.89 2.89 0 0 1-2.818-2.818l.088-1.258a2.89 2.89 0 0 0-.812-2.22l-.867-.915a2.89 2.89 0 0 1 0-3.986l.867-.915a2.89 2.89 0 0 0 .812-2.22l-.088-1.258a2.89 2.89 0 0 1 2.818-2.818l1.258.088a2.89 2.89 0 0 0 2.22-.812l.915-.867zM16.707 9.293a1 1 0 0 0-1.414 0L11 13.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l5-5a1 1 0 0 0 0-1.414z"/></svg></span>`;
  }

  isArtistVerified(artistName, browseId = '') {
    if (browseId && typeof browseId === 'string' && browseId.startsWith('UC')) return true;
    if (!artistName || typeof artistName !== 'string') return false;
    const clean = artistName.toLowerCase().replace(/official|vevo|channel|music|records/gi, '').trim();
    if (FAMOUS_VERIFIED_ARTISTS.has(clean)) return true;
    for (const fa of FAMOUS_VERIFIED_ARTISTS) {
      if (clean === fa || clean.startsWith(fa + ' ') || clean.endsWith(' ' + fa) || clean.includes(' ' + fa + ' ')) {
        return true;
      }
    }
    return false;
  }

  // =========================================================================
  // OS Native Media Session API (SMTC / macOS Control Center / Linux MPRIS)
  // =========================================================================
  initMediaSessionHandlers() {
    if (!('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.setActionHandler('play', () => {
        if (!this.isPlaying) this.togglePlayPause();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (this.isPlaying) this.togglePlayPause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        this.playPrevious();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        this.playNext();
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined && this.audio) {
          this.audio.currentTime = details.seekTime;
          this.updateMediaSessionPosition();
        }
      });
      navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        if (this.audio) {
          const skipTime = details.seekOffset || 5;
          this.audio.currentTime = Math.max(0, (this.audio.currentTime || 0) - skipTime);
          this.updateMediaSessionPosition();
        }
      });
      navigator.mediaSession.setActionHandler('seekforward', (details) => {
        if (this.audio) {
          const skipTime = details.seekOffset || 5;
          this.audio.currentTime = Math.min(this.audio.duration || 0, (this.audio.currentTime || 0) + skipTime);
          this.updateMediaSessionPosition();
        }
      });
    } catch (e) {
      console.warn("MediaSession handlers note:", e);
    }
  }

  updateMediaSession(track) {
    if (!('mediaSession' in navigator) || !track) return;
    try {
      const artUrl = track.artwork_url || this.DEFAULT_TRACK_ART;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title || 'Track Title',
        artist: track.artist || 'Artist',
        album: track.album || 'SoraFy Music',
        artwork: [
          { src: artUrl, sizes: '96x96', type: 'image/jpeg' },
          { src: artUrl, sizes: '128x128', type: 'image/jpeg' },
          { src: artUrl, sizes: '256x256', type: 'image/jpeg' },
          { src: artUrl, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.playbackState = this.isPlaying ? 'playing' : 'paused';
    } catch (e) {
      console.warn("MediaSession update note:", e);
    }
  }

  updateMediaSessionPosition() {
    if (!('mediaSession' in navigator) || !this.audio || !('setPositionState' in navigator.mediaSession)) return;
    try {
      const dur = this.audio.duration;
      if (dur && isFinite(dur) && dur > 0) {
        navigator.mediaSession.setPositionState({
          duration: dur,
          playbackRate: this.audio.playbackRate || 1.0,
          position: Math.min(this.audio.currentTime || 0, dur)
        });
      }
    } catch (_) {}
  }

  // =========================================================================
  // Discord Rich Presence Integration
  // =========================================================================
  updateDiscordPresence(track) {
    if (!track || !window.electronAPI || typeof window.electronAPI.updateDiscordPresence !== 'function') return;
    if (this.appSettings && this.appSettings.discordRpc === false) return;

    try {
      const startTimestamp = Math.floor(Date.now() / 1000) - Math.floor(this.audio ? (this.audio.currentTime || 0) : 0);
      const endTimestamp = (track.duration_secs && track.duration_secs > 0)
        ? startTimestamp + track.duration_secs
        : undefined;

      window.electronAPI.updateDiscordPresence({
        details: track.title || 'Mendengarkan Musik',
        state: track.artist || 'SoraFy Music',
        timestamps: this.isPlaying ? { start: startTimestamp, end: endTimestamp } : undefined,
        assets: {
          large_image: track.artwork_url || 'sorafy_logo',
          large_text: track.title ? `${track.title} - ${track.artist}` : 'SoraFy Desktop',
          small_image: this.isPlaying ? 'play' : 'pause',
          small_text: this.isPlaying ? 'Memutar' : 'Dijeda'
        }
      });
    } catch (_) {}
  }

  // =========================================================================
  // Sleep Timer (Pengatur Waktu Tidur)
  // =========================================================================
  initSleepTimer() {
    if (this.sleepTimerBtn) {
      this.sleepTimerBtn.addEventListener("click", () => {
        if (this.sleepTimerModal) this.sleepTimerModal.style.display = "flex";
      });
    }

    if (this.closeSleepTimerModalBtn) {
      this.closeSleepTimerModalBtn.addEventListener("click", () => {
        if (this.sleepTimerModal) this.sleepTimerModal.style.display = "none";
      });
    }

    if (this.sleepTimerOptions) {
      this.sleepTimerOptions.querySelectorAll('.sleep-timer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const mins = parseInt(btn.dataset.minutes, 10);
          this.setSleepTimer(mins);
          if (this.sleepTimerModal) this.sleepTimerModal.style.display = "none";
        });
      });
    }
  }

  setSleepTimer(minutes) {
    clearInterval(this.sleepTimerInterval);
    this.sleepTimerInterval = null;
    this.sleepTimerMinutes = minutes;
    this.isSleepTimerAtTrackEnd = (minutes === -1);

    if (minutes === 0) {
      this.sleepTimerTargetMs = null;
      if (this.sleepTimerBadge) this.sleepTimerBadge.style.display = "none";
      if (this.sleepTimerBtn) this.sleepTimerBtn.classList.remove("active");
      this.showToast("Sleep timer turned off");
      this.updateSleepTimerUI(0);
      return;
    }

    if (this.sleepTimerBtn) this.sleepTimerBtn.classList.add("active");
    if (this.sleepTimerBadge) this.sleepTimerBadge.style.display = "flex";

    if (this.isSleepTimerAtTrackEnd) {
      if (this.sleepTimerBadge) this.sleepTimerBadge.textContent = "1";
      this.showToast("Playback will stop at the end of this track");
      this.updateSleepTimerUI(-1);
      return;
    }

    this.sleepTimerTargetMs = Date.now() + (minutes * 60 * 1000);
    this.showToast(`Sleep timer set for ${minutes} minutes`);
    this.updateSleepTimerUI(minutes);

    this.sleepTimerInterval = setInterval(() => {
      const remainingMs = this.sleepTimerTargetMs - Date.now();
      if (remainingMs <= 0) {
        clearInterval(this.sleepTimerInterval);
        this.sleepTimerInterval = null;
        this.triggerSleepTimerFadeOut();
      } else {
        const remainingMins = Math.ceil(remainingMs / 60000);
        if (this.sleepTimerBadge) this.sleepTimerBadge.textContent = `${remainingMins}m`;
      }
    }, 1000);

    const initialMins = Math.ceil((this.sleepTimerTargetMs - Date.now()) / 60000);
    if (this.sleepTimerBadge) this.sleepTimerBadge.textContent = `${initialMins}m`;
  }

  updateSleepTimerUI(activeMinutes) {
    if (!this.sleepTimerOptions) return;
    this.sleepTimerOptions.querySelectorAll('.sleep-timer-btn').forEach(btn => {
      const m = parseInt(btn.dataset.minutes, 10);
      const isActive = (m === activeMinutes);
      btn.classList.toggle('active', isActive);
      const check = btn.querySelector('.timer-check');
      if (check) check.textContent = isActive ? '✓' : '';
    });
  }

  triggerSleepTimerFadeOut() {
    if (!this.audio || !this.isPlaying) {
      this.setSleepTimer(0);
      return;
    }
    const startVol = this.audio.volume;
    let step = 0;
    const fadeSteps = 20;
    const fadeInterval = setInterval(() => {
      step++;
      const currentRatio = 1 - (step / fadeSteps);
      if (this.audio) this.audio.volume = Math.max(0, startVol * currentRatio);
      if (step >= fadeSteps) {
        clearInterval(fadeInterval);
        this.pause();
        if (this.audio) this.audio.volume = startVol;
        this.setSleepTimer(0);
        this.showToast("Waktu tidur selesai. Musik dijeda.");
      }
    }, 150);
  }

  // =========================================================================
  // Settings Hub (Panel Pengaturan & Cadangan Data)
  // =========================================================================
  async initSettingsHub() {
    let currentSettings = {
      language: 'en',
      closeToTray: false,
      notifications: true,
      discordRpc: true,
      audioQuality: 'high',
      volumeNormalization: false,
      crossfadeDuration: 0,
      cacheQuotaMb: 2048
    };

    if (window.electronAPI && typeof window.electronAPI.getAppSettings === 'function') {
      try {
        const fetched = await window.electronAPI.getAppSettings();
        if (fetched) currentSettings = { ...currentSettings, ...fetched };
      } catch (_) {}
    } else {
      const local = localStorage.getItem("sorafy_app_settings");
      if (local) {
        try { currentSettings = { ...currentSettings, ...JSON.parse(local) }; } catch (_) {}
      }
    }

    this.appSettings = currentSettings;

    // Apply configured language
    const initialLang = this.appSettings.language || localStorage.getItem("sorafy_language") || "en";
    this.applyLanguage(initialLang);

    if (this.settingLanguage) {
      this.settingLanguage.value = initialLang;
    }
    if (this.settingAudioQuality) this.settingAudioQuality.value = this.appSettings.audioQuality || 'high';
    if (this.settingVolumeNorm) this.settingVolumeNorm.checked = !!this.appSettings.volumeNormalization;
    if (this.settingCrossfade) {
      this.settingCrossfade.value = this.appSettings.crossfadeDuration || 0;
      if (this.settingCrossfadeLabel) {
        this.settingCrossfadeLabel.textContent = `${this.appSettings.crossfadeDuration || 0}${this.currentLanguage === 'id' ? ' dtk' : 's'}`;
      }
    }
    if (this.settingCacheQuota) {
      this.settingCacheQuota.value = String(this.appSettings.cacheQuotaMb || 2048);
    }
    if (this.settingCloseToTray) this.settingCloseToTray.checked = !!this.appSettings.closeToTray;
    if (this.settingNotifications) this.settingNotifications.checked = this.appSettings.notifications !== false;
    if (this.settingDiscordRpc) this.settingDiscordRpc.checked = this.appSettings.discordRpc !== false;

    if (this.navSettings) {
      this.navSettings.addEventListener("click", () => {
        if (this.settingsModal) this.settingsModal.style.display = "flex";
      });
    }

    if (this.closeSettingsModalBtn) {
      this.closeSettingsModalBtn.addEventListener("click", () => {
        if (this.settingsModal) this.settingsModal.style.display = "none";
      });
    }

    if (this.settingsTabBar) {
      this.settingsTabBar.querySelectorAll('.settings-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.settingsTabBar.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const target = btn.dataset.tab;
          document.querySelectorAll('.settings-tab-pane').forEach(pane => {
            pane.style.display = pane.id === `settingsTab${target.charAt(0).toUpperCase() + target.slice(1)}` ? 'block' : 'none';
          });
        });
      });
    }

    const persistSettings = async () => {
      localStorage.setItem("sorafy_app_settings", JSON.stringify(this.appSettings));
      if (window.electronAPI && typeof window.electronAPI.saveAppSettings === 'function') {
        await window.electronAPI.saveAppSettings(this.appSettings).catch(() => {});
      }
    };

    if (this.settingLanguage) {
      this.settingLanguage.addEventListener("change", (e) => {
        this.appSettings.language = e.target.value;
        persistSettings();
        this.applyLanguage(e.target.value);
        this.showToast(e.target.value === 'id' ? 'Bahasa antarmuka diubah ke Bahasa Indonesia' : 'Interface language changed to English');
      });
    }

    if (this.settingAudioQuality) {
      this.settingAudioQuality.addEventListener("change", (e) => {
        this.appSettings.audioQuality = e.target.value;
        persistSettings();
        this.showToast(this.currentLanguage === 'id' ? `Kualitas audio: ${e.target.options[e.target.selectedIndex].text}` : `Audio quality: ${e.target.options[e.target.selectedIndex].text}`);
      });
    }

    if (this.settingVolumeNorm) {
      this.settingVolumeNorm.addEventListener("change", (e) => {
        this.appSettings.volumeNormalization = e.target.checked;
        persistSettings();
        this.showToast(this.currentLanguage === 'id' ? `Normalisasi volume ${e.target.checked ? 'diaktifkan' : 'dinonaktifkan'}` : `Volume normalization ${e.target.checked ? 'enabled' : 'disabled'}`);
      });
    }

    if (this.settingCrossfade) {
      this.settingCrossfade.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        this.appSettings.crossfadeDuration = val;
        if (this.settingCrossfadeLabel) this.settingCrossfadeLabel.textContent = `${val}${this.currentLanguage === 'id' ? ' dtk' : 's'}`;
        persistSettings();
      });
    }

    if (this.settingCacheQuota) {
      this.settingCacheQuota.addEventListener("change", async (e) => {
        this.appSettings.cacheQuotaMb = parseInt(e.target.value, 10);
        persistSettings();
        if (window.electronAPI && typeof window.electronAPI.pruneAudioCache === 'function') {
          await window.electronAPI.pruneAudioCache();
        }
      });
    }

    const updateCookieStatus = async () => {
      if (window.electronAPI && typeof window.electronAPI.getYouTubeCookieStatus === 'function') {
        const res = await window.electronAPI.getYouTubeCookieStatus();
        if (res && res.hasCookie) {
          if (this.settingCookieStatus) this.settingCookieStatus.textContent = res.filename || 'cookies.txt';
          if (this.settingClearCookieBtn) this.settingClearCookieBtn.style.display = 'inline-flex';
        } else {
          if (this.settingCookieStatus) this.settingCookieStatus.textContent = this.currentLanguage === 'id' ? 'Belum ada' : 'None';
          if (this.settingClearCookieBtn) this.settingClearCookieBtn.style.display = 'none';
        }
      }
    };
    updateCookieStatus();

    if (this.settingSelectCookieBtn) {
      this.settingSelectCookieBtn.addEventListener("click", async () => {
        if (window.electronAPI && typeof window.electronAPI.selectYouTubeCookie === 'function') {
          const res = await window.electronAPI.selectYouTubeCookie();
          if (res && res.success) {
            this.showToast(this.currentLanguage === 'id' ? 'Cookie YouTube berhasil diimpor' : 'YouTube cookies imported successfully');
            updateCookieStatus();
          }
        }
      });
    }

    if (this.settingClearCookieBtn) {
      this.settingClearCookieBtn.addEventListener("click", async () => {
        if (window.electronAPI && typeof window.electronAPI.clearYouTubeCookie === 'function') {
          await window.electronAPI.clearYouTubeCookie();
          this.showToast(this.currentLanguage === 'id' ? 'Cookie YouTube dihapus' : 'YouTube cookies removed');
          updateCookieStatus();
        }
      });
    }

    if (this.settingCloseToTray) {
      this.settingCloseToTray.addEventListener("change", (e) => {
        this.appSettings.closeToTray = e.target.checked;
        persistSettings();
      });
    }

    if (this.settingNotifications) {
      this.settingNotifications.addEventListener("change", (e) => {
        this.appSettings.notifications = e.target.checked;
        persistSettings();
      });
    }

    if (this.settingDiscordRpc) {
      this.settingDiscordRpc.addEventListener("change", (e) => {
        this.appSettings.discordRpc = e.target.checked;
        persistSettings();
        if (!e.target.checked && window.electronAPI && typeof window.electronAPI.clearDiscordPresence === 'function') {
          window.electronAPI.clearDiscordPresence();
        } else if (e.target.checked) {
          const cur = this.tracks[this.currentTrackIndex];
          if (cur) this.updateDiscordPresence(cur);
        }
      });
    }

    if (this.settingClearCacheBtn) {
      this.settingClearCacheBtn.addEventListener("click", async () => {
        if (window.electronAPI && typeof window.electronAPI.clearAppCache === 'function') {
          await window.electronAPI.clearAppCache();
          this.showToast("Audio cache and local storage cleared successfully");
        } else {
          this.showToast("Cache cleared successfully");
        }
      });
    }

    if (this.settingExportBackupBtn) {
      this.settingExportBackupBtn.addEventListener("click", () => this.handleDataBackup());
    }

    if (this.settingRestoreBackupBtn) {
      this.settingRestoreBackupBtn.addEventListener("click", () => this.handleDataRestore());
    }

    if (this.checkUpdateBtn) {
      this.checkUpdateBtn.addEventListener("click", async () => {
        if (this.updateStatusText) this.updateStatusText.textContent = "Checking for latest release on GitHub...";
        if (window.electronAPI && typeof window.electronAPI.checkForUpdates === 'function') {
          const res = await window.electronAPI.checkForUpdates();
          if (res && res.success) {
            if (res.hasUpdate) {
              if (this.updateStatusText) {
                this.updateStatusText.innerHTML = `<span style="color: #00E599; font-weight: 600;">New version ${res.latestVersion} available!</span> <a href="${res.htmlUrl}" target="_blank" style="color: #38BDF8; margin-left: 6px; text-decoration: underline;">Download on GitHub</a>`;
              }
            } else {
              if (this.updateStatusText) {
                this.updateStatusText.textContent = `You are running the latest version (${res.currentVersion}).`;
              }
            }
          } else {
            if (this.updateStatusText) this.updateStatusText.textContent = "Unable to check updates at this time.";
          }
        }
      });
    }

    // Initialize yt-dlp Audio Engine Companion status in Settings
    this.checkYtDlpCompanionStatus();
  }

  restoreBackupData(data) {
    if (!data) return;
    try {
      if (Array.isArray(data.userPlaylists)) {
        this.userPlaylists = data.userPlaylists;
        this.saveUserPlaylists();
        this.renderUserPlaylists();
      }
      if (Array.isArray(data.likedTrackIds)) {
        this.likedTrackIds = new Set(data.likedTrackIds);
        localStorage.setItem("sorafy_liked_track_ids", JSON.stringify(Array.from(this.likedTrackIds)));
        this.updateLikeButton();
      }
      if (Array.isArray(data.followedArtists)) {
        this.followedArtists = new Set(data.followedArtists);
        localStorage.setItem("sorafy_followed_artists", JSON.stringify(Array.from(this.followedArtists)));
      }
      this.showToast("Backup data restored successfully!");
      if (this.settingsModal) this.settingsModal.style.display = "none";
    } catch (e) {
      console.warn("Restore backup note:", e);
      this.showToast("Failed to read backup file");
    }
  }

  initEvents() {
    this.initSleepTimer();
    this.initSettingsHub();
    this.initMediaSessionHandlers();
    this.initOfflineListener();

    window.addEventListener('beforeunload', () => {
      if (this.audio) {
        this.audio.pause();
        this.audio.src = '';
      }
      if (this.screenPlayerNativeVideo) {
        this.screenPlayerNativeVideo.pause();
        this.screenPlayerNativeVideo.src = '';
      }
    });

    this.playPauseBtn.addEventListener("click", () => this.togglePlayPause());
    this.prevBtn.addEventListener("click", () => this.playPrevious());
    this.nextBtn.addEventListener("click", () => this.playNext());

    this.shuffleBtn.addEventListener("click", () => {
      this.isShuffled = !this.isShuffled;
      this.shuffleBtn.classList.toggle("active", this.isShuffled);
      this.showToast(this.isShuffled ? "Shuffle Enabled" : "Shuffle Disabled");
    });

    this.repeatBtn.addEventListener("click", () => {
      this.repeatMode = (this.repeatMode + 1) % 3;
      this.repeatBtn.classList.toggle("active", this.repeatMode > 0);
      const repIcon = this.repeatBtn.querySelector("iconsax-icon");
      if (repIcon) {
        repIcon.setAttribute("name", this.repeatMode === 2 ? "repeate-one" : "repeate-music");
      }
      if (this.screenPlayerRepeatBtn) {
        this.screenPlayerRepeatBtn.classList.toggle("active", this.repeatMode > 0);
        const scRepIcon = this.screenPlayerRepeatBtn.querySelector("iconsax-icon");
        if (scRepIcon) {
          scRepIcon.setAttribute("name", this.repeatMode === 2 ? "repeate-one" : "repeate-music");
        }
      }
      const labels = ["Repeat Off", "Repeat All", "Repeat This Track"];
      this.showToast(labels[this.repeatMode]);
    });

    this.likeBtn.addEventListener("click", () => {
      const current = this.tracks[this.currentTrackIndex];
      if (!current) return;
      this.toggleLikeTrack(current);
    });

    if (this.playerArtist) {
      this.playerArtist.style.cursor = "pointer";
      this.playerArtist.title = "View Artist Profile";
      this.playerArtist.addEventListener("click", () => {
        const cur = this.tracks[this.currentTrackIndex];
        if (cur && cur.artist) {
          this.openArtistDetail(cur.artist, cur.artist_browse_id || '');
        }
      });
    }

    if (this.volumeSlider) {
      this.volumeSlider.addEventListener("input", (e) => {
        this.setVolume(parseFloat(e.target.value));
      });
    }

    if (this.volumeMuteBtn) {
      this.volumeMuteBtn.addEventListener("click", () => {
        this.toggleMute();
      });
    }

    if (this.tabLyricsBtn) {
      this.tabLyricsBtn.addEventListener("click", () => {
        this.switchSideTab("lyrics");
      });
    }

    if (this.tabQueueBtn) {
      this.tabQueueBtn.addEventListener("click", () => {
        this.switchSideTab("queue");
      });
    }

    if (this.clearQueueBtn) {
      this.clearQueueBtn.addEventListener("click", () => {
        this.clearUpcomingQueue();
      });
    }

    if (this.closeSideDrawerBtn) {
      this.closeSideDrawerBtn.addEventListener("click", () => {
        this.toggleSideDrawer(false);
      });
    }

    if (this.toggleLyricsBtn) {
      this.toggleLyricsBtn.addEventListener("click", () => {
        this.toggleLyricsTab();
      });
    }

    if (this.lyricsOffsetMinusBtn) {
      this.lyricsOffsetMinusBtn.addEventListener("click", () => this.adjustLyricsOffset(-500));
    }
    if (this.lyricsOffsetPlusBtn) {
      this.lyricsOffsetPlusBtn.addEventListener("click", () => this.adjustLyricsOffset(500));
    }
    if (this.lyricsOffsetBadge) {
      this.lyricsOffsetBadge.addEventListener("click", () => this.resetLyricsOffset());
    }

    if (this.toggleQueueBtn) {
      this.toggleQueueBtn.addEventListener("click", () => {
        this.toggleQueueTab();
      });
    }

    // In-Document Lyrics Search Event Handlers
    if (this.lyricsSearchToggleBtn) {
      this.lyricsSearchToggleBtn.addEventListener("click", () => {
        this.toggleLyricsSearch();
      });
    }

    if (this.lyricsSearchCloseBtn) {
      this.lyricsSearchCloseBtn.addEventListener("click", () => {
        this.closeLyricsSearch();
      });
    }

    if (this.lyricsClearBtn) {
      this.lyricsClearBtn.addEventListener("click", () => {
        if (this.lyricsSearchInput) {
          this.lyricsSearchInput.value = "";
          this.searchLyrics("");
          this.lyricsSearchInput.focus();
        }
      });
    }

    if (this.lyricsNextMatchBtn) {
      this.lyricsNextMatchBtn.addEventListener("click", () => {
        this.nextLyricsMatch();
      });
    }

    if (this.lyricsPrevMatchBtn) {
      this.lyricsPrevMatchBtn.addEventListener("click", () => {
        this.prevLyricsMatch();
      });
    }

    if (this.lyricsSearchInput) {
      this.lyricsSearchInput.addEventListener("input", (e) => {
        this.searchLyrics(e.target.value);
      });

      this.lyricsSearchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (e.shiftKey) {
            this.prevLyricsMatch();
          } else {
            this.nextLyricsMatch();
          }
        } else if (e.key === "Escape") {
          e.preventDefault();
          this.closeLyricsSearch();
        }
      });
    }

    if (this.heroPlayBtn) {
      this.heroPlayBtn.addEventListener("click", () => {
        this.loadTrack(0, true);
      });
    }

    if (this.viewAllBtn) {
      this.viewAllBtn.addEventListener("click", () => {
        this.showToast(this.currentLanguage === 'id' ? "Menyinkronkan rekomendasi musik..." : "Syncing recommendations...");
        this.loadInitialCatalog();
      });
    }

    // YouTube Music Style Swipe Navigation Arrows
    if (this.quickPicksPrevBtn && this.quickPicksCarousel) {
      this.quickPicksPrevBtn.addEventListener("click", () => {
        this.quickPicksCarousel.scrollBy({ left: -340, behavior: "smooth" });
      });
    }
    if (this.quickPicksNextBtn && this.quickPicksCarousel) {
      this.quickPicksNextBtn.addEventListener("click", () => {
        this.quickPicksCarousel.scrollBy({ left: 340, behavior: "smooth" });
      });
    }
    if (this.chartsPrevBtn && this.chartsCarousel) {
      this.chartsPrevBtn.addEventListener("click", () => {
        this.chartsCarousel.scrollBy({ left: -340, behavior: "smooth" });
      });
    }
    if (this.chartsNextBtn && this.chartsCarousel) {
      this.chartsNextBtn.addEventListener("click", () => {
        this.chartsCarousel.scrollBy({ left: 340, behavior: "smooth" });
      });
    }

    // Cover Image Click -> Opens Dedicated Screen Player (as requested: "klik gambar cover dulu")
    const artworkBoxTrigger = document.getElementById("playerArtworkBox") || this.playerArtwork;
    if (artworkBoxTrigger) {
      artworkBoxTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        this.switchView("player");
      });
    }
    if (this.expandPlayerBtn) {
      this.expandPlayerBtn.addEventListener("click", () => {
        this.switchView("player");
      });
    }

    // Screen Player Actions & Synchronized Controls
    if (this.screenPlayerBackBtn) {
      this.screenPlayerBackBtn.addEventListener("click", () => {
        this.switchView(this.previousView && this.previousView !== "player" ? this.previousView : "home");
      });
    }
    if (this.modeAudioBtn) {
      this.modeAudioBtn.addEventListener("click", () => this.setScreenPlayerMode("audio"));
    }
    if (this.modeVideoBtn) {
      this.modeVideoBtn.addEventListener("click", () => this.setScreenPlayerMode("video"));
    }
    if (this.screenPlayerPlayPauseBtn) {
      this.screenPlayerPlayPauseBtn.addEventListener("click", () => this.togglePlayPause());
    }
    if (this.screenPlayerPrevBtn) {
      this.screenPlayerPrevBtn.addEventListener("click", () => this.playPrevious());
    }
    if (this.screenPlayerNextBtn) {
      this.screenPlayerNextBtn.addEventListener("click", () => this.playNext());
    }
    if (this.screenPlayerShuffleBtn) {
      this.screenPlayerShuffleBtn.addEventListener("click", () => {
        this.isShuffled = !this.isShuffled;
        this.shuffleBtn.classList.toggle("active", this.isShuffled);
        this.screenPlayerShuffleBtn.classList.toggle("active", this.isShuffled);
        this.showToast(this.isShuffled ? "Shuffle Diaktifkan" : "Shuffle Dimatikan");
      });
    }
    if (this.screenPlayerRepeatBtn) {
      this.screenPlayerRepeatBtn.addEventListener("click", () => {
        this.repeatMode = (this.repeatMode + 1) % 3;
        this.repeatBtn.classList.toggle("active", this.repeatMode > 0);
        this.screenPlayerRepeatBtn.classList.toggle("active", this.repeatMode > 0);
        const repIcon = this.repeatBtn.querySelector("iconsax-icon");
        if (repIcon) {
          repIcon.setAttribute("name", this.repeatMode === 2 ? "repeate-one" : "repeate-music");
        }
        const scRepIcon = this.screenPlayerRepeatBtn.querySelector("iconsax-icon");
        if (scRepIcon) {
          scRepIcon.setAttribute("name", this.repeatMode === 2 ? "repeate-one" : "repeate-music");
        }
        const labels = ["Repeat Off", "Repeat All", "Repeat This Track"];
        this.showToast(labels[this.repeatMode]);
      });
    }
    if (this.screenPlayerLikeBtn) {
      this.screenPlayerLikeBtn.addEventListener("click", () => {
        const cur = this.tracks[this.currentTrackIndex];
        if (cur) this.toggleLikeTrack(cur);
      });
    }
    if (this.screenPlayerAddToPlaylistBtn) {
      this.screenPlayerAddToPlaylistBtn.addEventListener("click", () => {
        const cur = this.tracks[this.currentTrackIndex];
        if (cur) this.openAddToPlaylistModal(cur);
      });
    }
    if (this.screenPlayerArtist) {
      this.screenPlayerArtist.addEventListener("click", () => {
        const cur = this.tracks[this.currentTrackIndex];
        if (cur && cur.artist) {
          this.openArtistDetail(cur.artist, cur.artist_browse_id || '');
        }
      });
    }
    if (this.screenPlayerSeekbar) {
      this.screenPlayerSeekbar.addEventListener("input", (e) => {
        this.isSeekingScreen = true;
        const val = parseFloat(e.target.value);
        if (this.audio.duration && !isNaN(this.audio.duration)) {
          const seekTime = (val / 100) * this.audio.duration;
          if (this.screenPlayerCurrentTime) this.screenPlayerCurrentTime.textContent = this.formatTime(seekTime);
          this.screenPlayerSeekbar.style.background = `linear-gradient(to right, #00E599 0%, #00E599 ${val}%, rgba(255, 255, 255, 0.16) ${val}%, rgba(255, 255, 255, 0.16) 100%)`;
        }
      });
      this.screenPlayerSeekbar.addEventListener("change", (e) => {
        const val = parseFloat(e.target.value);
        if (this.audio.duration && !isNaN(this.audio.duration)) {
          const seekTime = (val / 100) * this.audio.duration;
          this.audio.currentTime = seekTime;
          if (this.screenPlayerNativeVideo && this.screenPlayerNativeVideo.src) {
            this.screenPlayerNativeVideo.currentTime = seekTime;
          }
        }
        this.isSeekingScreen = false;
      });
    }

    if (this.screenPlayerNativeVideo) {
      this.screenPlayerNativeVideo.addEventListener("click", () => {
        this.togglePlayPause();
      });
    }

    // Video Overlay Controls (Pear Desktop cinema mode & PiP)
    if (this.videoOverlayPipBtn) {
      this.videoOverlayPipBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        try {
          if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
          } else if (this.screenPlayerNativeVideo && this.screenPlayerNativeVideo.src) {
            await this.screenPlayerNativeVideo.requestPictureInPicture();
          }
        } catch (err) {
          console.warn("PiP notice:", err);
          this.showToast("Picture-in-Picture is not supported for this video");
        }
      });
    }

    if (this.videoOverlayFullscreenBtn) {
      this.videoOverlayFullscreenBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else if (this.screenPlayerVideoView) {
          this.screenPlayerVideoView.requestFullscreen().catch(() => {});
        }
      });
    }

    if (this.videoOverlayCenterPlayBtn) {
      this.videoOverlayCenterPlayBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.togglePlayPause();
      });
    }

    if (this.videoOverlayProgressBar) {
      this.videoOverlayProgressBar.addEventListener("click", (e) => {
        e.stopPropagation();
        const rect = this.videoOverlayProgressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, clickX / rect.width));
        if (this.audio && this.audio.duration && !isNaN(this.audio.duration)) {
          const seekTime = pct * this.audio.duration;
          this.audio.currentTime = seekTime;
          if (this.screenPlayerNativeVideo && this.screenPlayerNativeVideo.src) {
            this.screenPlayerNativeVideo.currentTime = seekTime;
          }
        }
      });
    }

    if (this.videoOverlaySwitchAudioBtn) {
      this.videoOverlaySwitchAudioBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.setScreenPlayerMode("audio");
        this.showToast("Beralih ke mode audio");
      });
    }

    // Auto-hide video overlay during playback (Pear Desktop style)
    let videoOverlayTimeout = null;
    if (this.screenPlayerVideoView) {
      this.screenPlayerVideoView.addEventListener("mousemove", () => {
        if (this.screenPlayerVideoOverlay) {
          this.screenPlayerVideoOverlay.classList.add("active");
        }
        clearTimeout(videoOverlayTimeout);
        videoOverlayTimeout = setTimeout(() => {
          if (this.isPlaying && this.currentScreenMode === "video" && this.screenPlayerVideoOverlay) {
            this.screenPlayerVideoOverlay.classList.remove("active");
          }
        }, 2800);
      });

      this.screenPlayerVideoView.addEventListener("mouseleave", () => {
        clearTimeout(videoOverlayTimeout);
        if (this.isPlaying && this.screenPlayerVideoOverlay) {
          this.screenPlayerVideoOverlay.classList.remove("active");
        }
      });
    }

    if (this.screenPlayerToggleLyricsBtn) {
      this.screenPlayerToggleLyricsBtn.addEventListener("click", () => this.toggleLyricsTab());
    }
    if (this.screenPlayerToggleQueueBtn) {
      this.screenPlayerToggleQueueBtn.addEventListener("click", () => this.toggleQueueTab());
    }

    // Artist Detail screen actions
    if (this.artistBackBtn) {
      this.artistBackBtn.addEventListener("click", () => {
        this.switchView("home");
      });
    }

    if (this.artistPlayAllBtn) {
      this.artistPlayAllBtn.addEventListener("click", () => {
        if (this.currentArtistTracks && this.currentArtistTracks.length) {
          this.tracks = [...this.currentArtistTracks];
          this.loadTrack(0, true);
        }
      });
    }

    if (this.artistShuffleBtn) {
      this.artistShuffleBtn.addEventListener("click", () => {
        if (this.currentArtistTracks && this.currentArtistTracks.length) {
          this.tracks = [...this.currentArtistTracks].sort(() => Math.random() - 0.5);
          this.loadTrack(0, true);
        }
      });
    }

    if (this.artistFollowBtn) {
      this.artistFollowBtn.addEventListener("click", () => {
        if (!this.currentArtist) return;
        const artName = this.currentArtist.name;
        const key = artName.toLowerCase().trim();
        if (this.followedArtists.has(key)) {
          this.followedArtists.delete(key);
          delete this.followedArtistDetails[key];
          this.artistFollowBtn.textContent = "+ Follow";
          this.artistFollowBtn.classList.remove("active");
          this.showToast(this.currentLanguage === "id" ? `Berhenti mengikuti ${artName}` : `Unfollowed ${artName}`);
        } else {
          this.followedArtists.add(key);
          this.followedArtistDetails[key] = {
            name: artName,
            avatar_url: this.artistAvatarImg ? this.artistAvatarImg.src : getArtistAvatar(artName),
            browse_id: this.currentArtist.browse_id || '',
            followedAt: Date.now()
          };
          this.artistFollowBtn.textContent = "Following";
          this.artistFollowBtn.classList.add("active");
          this.showToast(this.currentLanguage === "id" ? `Mengikuti ${artName} • Rekomendasi beranda diperbarui` : `Following ${artName} • Home recommendations updated`);
        }
        localStorage.setItem("sorafy_followed_artists", JSON.stringify([...this.followedArtists]));
        localStorage.setItem("sorafy_followed_artist_details", JSON.stringify(this.followedArtistDetails));

        // Re-calculate taste affinity & trigger home recommendations update
        if (this._albumRecDebounce) clearTimeout(this._albumRecDebounce);
        this._albumRecDebounce = setTimeout(() => {
          this.fetchYtmNewReleases();
          this.fetchMusicfyRecommendations();
        }, 1200);
      });
    }

    if (this.playlistLikeAlbumBtn) {
      this.playlistLikeAlbumBtn.addEventListener("click", () => {
        if (this.currentPlaylist) {
          this.toggleLikeAlbum(this.currentPlaylist);
        }
      });
    }

    // Playlist Detail screen actions
    if (this.playlistBackBtn) {
      this.playlistBackBtn.addEventListener("click", () => {
        this.switchView("home");
      });
    }

    if (this.playlistPlayAllBtn) {
      this.playlistPlayAllBtn.addEventListener("click", () => {
        if (this.currentPlaylist && this.currentPlaylist.tracks && this.currentPlaylist.tracks.length) {
          this.tracks = [...this.currentPlaylist.tracks];
          this.loadTrack(0, true);
        }
      });
    }

    if (this.playlistShuffleBtn) {
      this.playlistShuffleBtn.addEventListener("click", () => {
        if (this.currentPlaylist && this.currentPlaylist.tracks && this.currentPlaylist.tracks.length) {
          this.tracks = [...this.currentPlaylist.tracks].sort(() => Math.random() - 0.5);
          this.loadTrack(0, true);
        }
      });
    }

    if (this.playlistEditBtn) {
      this.playlistEditBtn.addEventListener("click", () => {
        if (this.currentPlaylist) {
          this.openEditPlaylistModal(this.currentPlaylist);
        }
      });
    }

    if (this.playlistDeleteBtn) {
      this.playlistDeleteBtn.addEventListener("click", () => {
        if (this.currentPlaylist && confirm(`Delete playlist "${this.currentPlaylist.title}"?`)) {
          this.deletePlaylist(this.currentPlaylist.id);
        }
      });
    }

    if (this.closeEditPlaylistModalBtn) {
      this.closeEditPlaylistModalBtn.addEventListener("click", () => {
        this.editPlaylistModal.style.display = "none";
      });
    }

    if (this.cancelEditPlaylistBtn) {
      this.cancelEditPlaylistBtn.addEventListener("click", () => {
        this.editPlaylistModal.style.display = "none";
      });
    }

    if (this.submitEditPlaylistBtn) {
      this.submitEditPlaylistBtn.addEventListener("click", () => {
        const name = (this.editPlaylistNameInput.value || "").trim();
        const desc = (this.editPlaylistDescInput.value || "").trim();
        if (!name) {
          this.showToast("Masukkan nama playlist!");
          return;
        }
        if (this.editingPlaylistId) {
          this.updatePlaylist(this.editingPlaylistId, name, desc);
        }
        this.editPlaylistModal.style.display = "none";
      });
    }

    // Curated Playlists refresh
    if (this.refreshPlaylistsBtn) {
      this.refreshPlaylistsBtn.addEventListener("click", () => {
        this.loadCuratedPlaylists();
      });
    }

    // Custom Playlists Sidebar & Modals
    if (this.sidebarCreatePlaylistBtn) {
      this.sidebarCreatePlaylistBtn.addEventListener("click", () => {
        this.openCreatePlaylistModal();
      });
    }

    if (this.closeCreatePlaylistModalBtn) {
      this.closeCreatePlaylistModalBtn.addEventListener("click", () => {
        this.createPlaylistModal.style.display = "none";
      });
    }

    if (this.cancelCreatePlaylistBtn) {
      this.cancelCreatePlaylistBtn.addEventListener("click", () => {
        this.createPlaylistModal.style.display = "none";
      });
    }

    if (this.submitCreatePlaylistBtn) {
      this.submitCreatePlaylistBtn.addEventListener("click", () => {
        const name = (this.playlistNameInput.value || "").trim();
        const desc = (this.playlistDescInput.value || "").trim();
        if (!name) {
          this.showToast("Masukkan nama playlist!");
          return;
        }
        this.createPlaylist(name, desc);
        this.createPlaylistModal.style.display = "none";
        this.playlistNameInput.value = "";
        this.playlistDescInput.value = "";
      });
    }

    if (this.closeAddToPlaylistModalBtn) {
      this.closeAddToPlaylistModalBtn.addEventListener("click", () => {
        this.addToPlaylistModal.style.display = "none";
      });
    }

    if (this.cancelAddToPlaylistBtn) {
      this.cancelAddToPlaylistBtn.addEventListener("click", () => {
        this.addToPlaylistModal.style.display = "none";
      });
    }

    if (this.modalCreateNewPlaylistBtn) {
      this.modalCreateNewPlaylistBtn.addEventListener("click", () => {
        this.addToPlaylistModal.style.display = "none";
        this.openCreatePlaylistModal();
      });
    }

    // Suggestion chips
    this.suggestionChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const artist = chip.dataset.artist;
        if (artist) {
          this.searchInput.value = artist;
          if (this.searchClearBtn) this.searchClearBtn.style.display = "inline-flex";
          this.openArtistDetail(artist);
          return;
        }

        const q = chip.dataset.query;
        if (q) {
          this.searchInput.value = q;
          if (this.searchClearBtn) this.searchClearBtn.style.display = "inline-flex";
          if (this.currentSearchFilter === 'artist') {
            this.openArtistDetail(q);
          } else {
            this.searchOnlineMusic(q, this.currentSearchFilter);
          }
        }
      });
    });

    // Search filter tabs
    this.filterTabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.filterTabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentSearchFilter = btn.dataset.searchFilter || "all";
        const query = this.searchInput.value.trim();
        if (query) {
          this.searchOnlineMusic(query, this.currentSearchFilter);
        }
      });
    });

    // Enter keydown on search input: directly opens artist if on artist tab or matches artist
    this.searchInput.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        clearTimeout(this.searchDebounceTimer);
        const query = this.searchInput.value.trim();
        if (!query) return;

        if (this.currentSearchFilter === 'artist') {
          this.openArtistDetail(query);
          return;
        }

        if (window.electronAPI && typeof window.electronAPI.resolveArtistProfile === 'function') {
          const profile = await window.electronAPI.resolveArtistProfile(query).catch(() => null);
          if (profile && (profile.name.toLowerCase() === query.toLowerCase() || (profile.browse_id && profile.browse_id.startsWith('UC')))) {
            this.openArtistDetail(profile.name, profile.browse_id, profile);
            return;
          }
        }

        this.searchOnlineMusic(query, this.currentSearchFilter);
      }
    });

    // Search clear button
    if (this.searchClearBtn) {
      this.searchClearBtn.addEventListener("click", () => {
        this.searchInput.value = "";
        this.searchClearBtn.style.display = "none";
        this.switchView("home");
        this.fetchMusicfyRecommendations();
      });
    }

    this.audio.addEventListener("timeupdate", () => this.onTimeUpdate());
    this.audio.addEventListener("loadedmetadata", () => {
      if (this.audio.duration && !isNaN(this.audio.duration)) {
        const realSecs = Math.round(this.audio.duration);
        this.durationLabel.textContent = this.formatTime(realSecs);
        if (this.screenPlayerDuration) {
          this.screenPlayerDuration.textContent = this.formatTime(realSecs);
        }
        if (this.tracks[this.currentTrackIndex]) {
          this.tracks[this.currentTrackIndex].duration_secs = realSecs;
        }
        const activeRows = document.querySelectorAll('.track-row.active .track-row-duration, .ytm-song-item.active .ytm-song-duration, .queue-item.active .queue-item-duration');
        activeRows.forEach(el => el.textContent = this.formatTime(realSecs));
      }
    });
    this.audio.addEventListener("error", () => {
      console.warn("Audio element error on src:", this.audio.src, this.audio.error);
      const cur = this.tracks[this.currentTrackIndex];
      if (cur && cur.fallback_url && this.audio.src !== cur.fallback_url) {
        console.log("Switching to fallback preview stream:", cur.fallback_url);
        this.audio.src = cur.fallback_url;
        this.audio.play().catch(() => {});
      } else {
        this.isPlaying = false;
        this.updatePlayPauseIcon();
      }
    });
    this.audio.addEventListener("ended", () => this.onTrackEnded());
    this.audio.addEventListener("waiting", () => this.showPlayerBuffering(true));
    this.audio.addEventListener("canplay", () => this.showPlayerBuffering(false));
    this.audio.addEventListener("playing", () => this.showPlayerBuffering(false));

    this.audio.addEventListener("play", () => {
      this.showPlayerBuffering(false);
      if (this.currentScreenMode === "video" && this.screenPlayerNativeVideo && this.screenPlayerNativeVideo.src) {
        if (this.screenPlayerNativeVideo.paused) {
          this.screenPlayerNativeVideo.play().catch(() => {});
        }
      }
    });
    this.audio.addEventListener("pause", () => {
      if (this.screenPlayerNativeVideo && !this.screenPlayerNativeVideo.paused) {
        this.screenPlayerNativeVideo.pause();
      }
      this.savePlaybackSession();
    });

    // Playback session persistence hooks (on window close, unload, pagehide, and Electron app-before-close)
    window.addEventListener("beforeunload", () => this.savePlaybackSession());
    window.addEventListener("pagehide", () => this.savePlaybackSession());

    if (window.electronAPI && typeof window.electronAPI.onAppBeforeClose === "function") {
      window.electronAPI.onAppBeforeClose(() => {
        this.savePlaybackSession();
      });
    }

    // Bottom player linear seekbar
    if (this.playerSeekbar) {
      this.playerSeekbar.addEventListener("input", (e) => {
        this.isSeekingBottom = true;
        const val = parseFloat(e.target.value);
        if (this.audio.duration && !isNaN(this.audio.duration)) {
          const seekTime = (val / 100) * this.audio.duration;
          this.currentTimeLabel.textContent = this.formatTime(seekTime);
          this.playerSeekbar.style.background = `linear-gradient(to right, #00E599 0%, #00E599 ${val}%, rgba(255, 255, 255, 0.16) ${val}%, rgba(255, 255, 255, 0.16) 100%)`;
        }
      });
      this.playerSeekbar.addEventListener("change", (e) => {
        const val = parseFloat(e.target.value);
        if (this.audio.duration && !isNaN(this.audio.duration)) {
          const seekTime = (val / 100) * this.audio.duration;
          this.audio.currentTime = seekTime;
          if (this.screenPlayerNativeVideo && this.screenPlayerNativeVideo.src) {
            this.screenPlayerNativeVideo.currentTime = seekTime;
          }
        }
        this.isSeekingBottom = false;
      });
    }

    // Real Online Search Input with Debounce (Just like mobile!)
    this.searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      if (this.searchClearBtn) {
        this.searchClearBtn.style.display = query ? "inline-flex" : "none";
      }
      clearTimeout(this.searchDebounceTimer);

      if (!query) {
        this.switchView("home");
        this.fetchMusicfyRecommendations();
        return;
      }

      this.searchDebounceTimer = setTimeout(() => {
        this.searchOnlineMusic(query, this.currentSearchFilter);
      }, 350);
    });

    // Category filter chips
    this.categoryChips.forEach(chip => {
      chip.addEventListener("click", () => {
        this.categoryChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const category = chip.dataset.category;
        this.filterByCategory(category);
      });
    });

    // Navigation item click handlers for View Switching
    this.navItems.forEach(item => {
      item.addEventListener("click", () => {
        const view = item.dataset.view;
        const filter = item.dataset.filter;
        if (view) {
          this.switchView(view);
        } else if (filter === "favorites") {
          this.switchView("home");
          this.showLikedSongs();
        } else if (filter === "history") {
          this.switchView("home");
          this.showHistory();
        } else if (filter === "lossless") {
          this.switchView("home");
          this.filterByCategory("lossless");
        }
      });
    });

    // Unified Importer Modal & Brand Tabs events
    if (this.sidebarImportPlaylistBtn) {
      this.sidebarImportPlaylistBtn.addEventListener("click", () => {
        if (this.unifiedImportModal) {
          this.unifiedImportModal.style.display = "flex";
          if (this.unifiedImportUrlInput) this.unifiedImportUrlInput.focus();
        }
      });
    }

    if (this.closeUnifiedImportModalBtn) {
      this.closeUnifiedImportModalBtn.addEventListener("click", () => {
        if (this.unifiedImportModal) this.unifiedImportModal.style.display = "none";
      });
    }

    if (this.cancelUnifiedImportBtn) {
      this.cancelUnifiedImportBtn.addEventListener("click", () => {
        if (this.unifiedImportModal) this.unifiedImportModal.style.display = "none";
      });
    }

    if (this.submitUnifiedImportBtn) {
      this.submitUnifiedImportBtn.addEventListener("click", () => this.handleUnifiedImport());
    }

    if (this.importPlatformTabs) {
      this.importPlatformTabs.querySelectorAll(".import-platform-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          this.importPlatformTabs.querySelectorAll(".import-platform-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          this.selectedImportPlatform = btn.dataset.platform;

          if (this.selectedImportPlatform === "spotify") {
            if (this.unifiedImportLabel) this.unifiedImportLabel.textContent = "Tautan Playlist atau Album Spotify:";
            if (this.unifiedImportUrlInput) this.unifiedImportUrlInput.placeholder = "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M";
          } else if (this.selectedImportPlatform === "applemusic") {
            if (this.unifiedImportLabel) this.unifiedImportLabel.textContent = "Tautan Playlist atau Album Apple Music:";
            if (this.unifiedImportUrlInput) this.unifiedImportUrlInput.placeholder = "https://music.apple.com/us/playlist/todays-hits/pl.f4d106fed2bd41149aaacabb233eb5eb";
          } else if (this.selectedImportPlatform === "ytmusic") {
            if (this.unifiedImportLabel) this.unifiedImportLabel.textContent = this.currentLanguage === "id" ? "Tautan Playlist atau Album YouTube:" : "YouTube Playlist or Album URL:";
            if (this.unifiedImportUrlInput) this.unifiedImportUrlInput.placeholder = "https://www.youtube.com/playlist?list=RDCLAK5uy_kfdijBq98Yn3";
          }
        });
      });
    }

    // Reset plugins button
    if (this.resetPluginsBtn) {
      this.resetPluginsBtn.addEventListener("click", () => {
        this.plugins.forEach(p => p.is_enabled = true);
        this.renderPlugins();
        this.showToast("All 9 plugins reset to active status!");
      });
    }

    // Equalizer Preset chips
    this.eqChips.forEach(chip => {
      chip.addEventListener("click", () => {
        this.eqChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const presetName = chip.dataset.eq;
        this.applyEqualizerPreset(presetName);
      });
    });

    // Bass Boost & Virtualizer Sliders
    if (this.bassBoostSlider) {
      this.bassBoostSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        this.bassBoostAmount = val;
        this.bassBoostVal.textContent = `${val}%`;
        if (this.bassFilterNode) {
          this.bassFilterNode.gain.value = (val / 100) * 12;
        }
      });
    }

    if (this.virtualizerSlider) {
      this.virtualizerSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        this.virtualizerAmount = val;
        this.virtualizerVal.textContent = `${val}%`;
      });
    }

    // Your Library View & Downloads Listeners
    if (this.libFilterPills) {
      this.libFilterPills.forEach(pill => {
        pill.addEventListener("click", () => {
          this.libFilterPills.forEach(p => p.classList.remove("active"));
          pill.classList.add("active");
          const tab = pill.dataset.libTab || "all";
          this.switchLibraryTab(tab);
        });
      });
    }

    if (this.libLikedPlayAllBtn) {
      this.libLikedPlayAllBtn.addEventListener("click", () => {
        const liked = JSON.parse(localStorage.getItem("sorafy_liked_tracks") || "[]");
        if (liked.length > 0) {
          this.tracks = [...liked];
          this.loadTrack(0, true);
        } else {
          this.showToast(this.currentLanguage === "id" ? "Belum ada lagu disukai" : "No liked songs");
        }
      });
    }

    if (this.libLikedShuffleBtn) {
      this.libLikedShuffleBtn.addEventListener("click", () => {
        const liked = JSON.parse(localStorage.getItem("sorafy_liked_tracks") || "[]");
        if (liked.length > 0) {
          this.tracks = [...liked];
          this.isShuffled = true;
          if (this.shuffleBtn) this.shuffleBtn.classList.add("active");
          const r = Math.floor(Math.random() * this.tracks.length);
          this.loadTrack(r, true);
        } else {
          this.showToast(this.currentLanguage === "id" ? "Belum ada lagu disukai" : "No liked songs");
        }
      });
    }

    if (this.libCreatePlaylistBtn) {
      this.libCreatePlaylistBtn.addEventListener("click", () => {
        const name = prompt(this.currentLanguage === "id" ? "Masukkan nama playlist baru:" : "Enter new playlist name:");
        if (name && name.trim()) {
          this.createNewPlaylist(name.trim());
          this.renderLibraryPlaylists();
        }
      });
    }

    if (this.downloadsPlayAllBtn) {
      this.downloadsPlayAllBtn.addEventListener("click", () => {
        if (this.downloadedTracks && this.downloadedTracks.length > 0) {
          this.tracks = [...this.downloadedTracks];
          this.loadTrack(0, true);
        } else {
          this.showToast(this.currentLanguage === "id" ? "Tidak ada lagu tersimpan" : "No downloaded tracks");
        }
      });
    }

    if (this.downloadsShuffleBtn) {
      this.downloadsShuffleBtn.addEventListener("click", () => {
        if (this.downloadedTracks && this.downloadedTracks.length > 0) {
          this.tracks = [...this.downloadedTracks];
          this.isShuffled = true;
          if (this.shuffleBtn) this.shuffleBtn.classList.add("active");
          const randIdx = Math.floor(Math.random() * this.tracks.length);
          this.loadTrack(randIdx, true);
        } else {
          this.showToast(this.currentLanguage === "id" ? "Tidak ada lagu tersimpan" : "No downloaded tracks");
        }
      });
    }

    if (this.downloadsOpenFolderBtn) {
      this.downloadsOpenFolderBtn.addEventListener("click", async () => {
        if (window.electronAPI && typeof window.electronAPI.openDownloadFolder === "function") {
          await window.electronAPI.openDownloadFolder();
        }
      });
    }

    if (this.downloadsRefreshBtn) {
      this.downloadsRefreshBtn.addEventListener("click", () => this.loadDownloadedTracksView());
    }

    if (this.offlineGoToDownloadsBtn) {
      this.offlineGoToDownloadsBtn.addEventListener("click", () => {
        this.switchView("library");
        this.switchLibraryTab("downloads");
      });
    }

    if (this.settingInstallYtDlpBtn) {
      this.settingInstallYtDlpBtn.addEventListener("click", () => this.installYtDlpCompanion());
    }

    // Comprehensive Native Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      // Allow escape to close modals or fullscreen even if inside inputs
      if (e.code === "Escape") {
        if (this.settingsModal && this.settingsModal.style.display !== "none") {
          this.settingsModal.style.display = "none";
          return;
        }
        if (this.sleepTimerModal && this.sleepTimerModal.style.display !== "none") {
          this.sleepTimerModal.style.display = "none";
          return;
        }
        if (this.unifiedImportModal && this.unifiedImportModal.style.display !== "none") {
          this.unifiedImportModal.style.display = "none";
          return;
        }
        if (this.currentView === "player") {
          this.switchView(this.previousView && this.previousView !== "player" ? this.previousView : "home");
          return;
        }
        if (this.searchInput && document.activeElement === this.searchInput) {
          this.searchInput.blur();
          return;
        }
      }

      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) return;

      if (e.code === "Space") {
        e.preventDefault();
        this.togglePlayPause();
      } else if (e.code === "KeyM") {
        e.preventDefault();
        this.toggleMute();
      } else if (e.code === "KeyL") {
        e.preventDefault();
        this.toggleLyricsTab();
      } else if ((e.ctrlKey || e.metaKey) && e.code === "KeyF") {
        e.preventDefault();
        if (this.searchInput) {
          this.searchInput.focus();
          this.searchInput.select();
        }
      } else if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (this.searchInput) {
          this.searchInput.focus();
          this.searchInput.select();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.code === "ArrowRight") {
        e.preventDefault();
        this.playNext();
      } else if ((e.ctrlKey || e.metaKey) && e.code === "ArrowLeft") {
        e.preventDefault();
        this.playPrevious();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        if (this.audio) {
          this.audio.currentTime = Math.min(this.audio.duration || 0, (this.audio.currentTime || 0) + 5);
          this.updateMediaSessionPosition();
        }
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        if (this.audio) {
          this.audio.currentTime = Math.max(0, (this.audio.currentTime || 0) - 5);
          this.updateMediaSessionPosition();
        }
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        this.setVolume(Math.min(1, (this.audio?.volume ?? 0.85) + 0.05));
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        this.setVolume(Math.max(0, (this.audio?.volume ?? 0.85) - 0.05));
      }
    });


    // Track Context Menu (Klik Kanan) Events
    document.addEventListener("click", (e) => {
      if (this.trackContextMenu && !this.trackContextMenu.contains(e.target)) {
        this.hideContextMenu();
      }
    });

    window.addEventListener("blur", () => this.hideContextMenu());
    window.addEventListener("scroll", () => this.hideContextMenu(), true);

    if (this.trackContextMenu) {
      this.trackContextMenu.querySelectorAll(".context-menu-item").forEach(item => {
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          const action = item.dataset.action;
          const track = this.contextMenuTrack;
          this.hideContextMenu();
          if (!track) return;

          if (action === "play-next") {
            this.playNextTrack(track);
          } else if (action === "add-queue") {
            this.addToQueue(track);
          } else if (action === "play-now") {
            this.playTrackNow(track);
          } else if (action === "artist-profile") {
            this.openArtistDetail(track.artist, track.artist_browse_id || '');
          } else if (action === "add-playlist") {
            this.openAddToPlaylistModal(track);
          } else if (action === "toggle-like") {
            this.toggleLikeTrack(track);
          } else if (action === "download-track") {
            this.downloadOfflineTrack(track);
          }
        });
      });
    }
  }

  // =========================================================
  // Track Context Menu (Klik Kanan) & Queue Operations
  // =========================================================
  showContextMenu(e, track) {
    if (!this.trackContextMenu || !track) return;
    this.contextMenuTrack = track;

    const isLiked = this.likedTrackIds.has(track.id);
    if (this.contextMenuLikeText) {
      this.contextMenuLikeText.textContent = isLiked ? "Unlike Track" : "Like Track";
    }

    this.trackContextMenu.style.display = "block";

    const menuWidth = 220;
    const menuHeight = 240;
    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 12;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 12;
    }

    this.trackContextMenu.style.left = `${Math.max(8, x)}px`;
    this.trackContextMenu.style.top = `${Math.max(8, y)}px`;
  }

  hideContextMenu() {
    if (this.trackContextMenu) {
      this.trackContextMenu.style.display = "none";
    }
    this.contextMenuTrack = null;
  }

  playNextTrack(track) {
    if (!track) return;
    if (!this.tracks || this.tracks.length === 0) {
      this.tracks = [track];
      this.loadTrack(0, true);
      this.showToast(`Playing: ${track.title}`);
      return;
    }
    const existingIdx = this.tracks.findIndex((t, idx) => idx > this.currentTrackIndex && t.id === track.id);
    if (existingIdx !== -1) {
      this.tracks.splice(existingIdx, 1);
    }
    const insertIdx = this.currentTrackIndex + 1;
    this.tracks.splice(insertIdx, 0, track);
    this.renderQueue();
    this.showToast(`Playing next: ${track.title}`);
  }

  addToQueue(track) {
    if (!track) return;
    if (!this.tracks || this.tracks.length === 0) {
      this.tracks = [track];
      this.loadTrack(0, true);
      this.showToast(`Playing: ${track.title}`);
      return;
    }
    this.tracks.push(track);
    this.renderQueue();
    this.showToast(`Added to queue: ${track.title}`);
  }

  playTrackNow(track) {
    if (!track) return;
    if (!this.tracks) this.tracks = [];
    const existingIdx = this.tracks.findIndex(t => t.id === track.id);
    if (existingIdx !== -1) {
      this.loadTrack(existingIdx, true);
    } else {
      this.tracks.splice(this.currentTrackIndex + 1, 0, track);
      this.loadTrack(this.currentTrackIndex + 1, true);
    }
    this.showToast(`Playing: ${track.title}`);
  }

  renderArtistHero(topArt, fallbackSongs = []) {
    const container = document.createElement("div");
    container.className = "search-hero-container";

    const topArtName = topArt.name || topArt.title || "";
    const topArtAvatar = topArt.avatar_url || topArt.artwork_url || getArtistAvatar(topArtName);
    if (topArtAvatar && topArtName) {
      MASTER_ARTIST_AVATARS[topArtName.toLowerCase().trim()] = topArtAvatar;
    }

    // Format real monthly listeners / sub label
    let subLabel = topArt.sub_label || "";
    if (!subLabel || subLabel === "Artis Terverifikasi" || subLabel === "Verified Artist") {
      subLabel = "Artist • Official Profile";
    }

    // Top 3 songs (only matching this artist)
    let heroTracks = (topArt.top_songs && topArt.top_songs.length > 0) ? [...topArt.top_songs] : [];
    if (heroTracks.length === 0 && fallbackSongs.length > 0) {
      const artistMatches = fallbackSongs.filter(s => (s.artist || "").toLowerCase().includes(topArtName.toLowerCase()));
      heroTracks = artistMatches.slice(0, 3);
    } else {
      heroTracks = heroTracks.slice(0, 3);
    }

    // Left Card: Artist Hero
    const artistCard = document.createElement("div");
    artistCard.className = "search-hero-artist-card";
    artistCard.innerHTML = `
      <img src="${topArtAvatar}" class="search-hero-avatar" alt="${this.escapeHtml(topArtName)}" onerror="this.src='${getArtistAvatar(topArtName)}'">
      <div class="search-hero-info">
        <h2 class="search-hero-name" title="${this.escapeHtml(topArtName)}">${this.escapeHtml(topArtName)}</h2>
        <div class="search-hero-sub">${this.escapeHtml(subLabel)}</div>
        <div class="search-hero-actions">
          <button class="btn-hero-shuffle" type="button">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>
            Shuffle
          </button>
          <button class="btn-hero-mix" type="button">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg>
            Radio
          </button>
        </div>
      </div>
      <div class="search-hero-chevron">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </div>
    `;

    artistCard.addEventListener("click", (e) => {
      if (e.target.closest('.btn-hero-shuffle') || e.target.closest('.btn-hero-mix')) return;
      this.openArtistDetail(topArtName, topArt.browse_id || topArt.id || '');
    });

    const shuffleBtn = artistCard.querySelector('.btn-hero-shuffle');
    if (shuffleBtn) {
      shuffleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (heroTracks.length > 0) {
          this.tracks = [...heroTracks].sort(() => Math.random() - 0.5);
          this.loadTrack(0, true);
          this.showToast(`Shuffling tracks by ${topArtName}`);
        } else {
          this.openArtistDetail(topArtName, topArt.browse_id || topArt.id || '');
        }
      });
    }

    const mixBtn = artistCard.querySelector('.btn-hero-mix');
    if (mixBtn) {
      mixBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.searchOnlineMusic(`${topArtName} radio mix`, 'song');
        this.showToast(`Loading radio mix for ${topArtName}...`);
      });
    }

    container.appendChild(artistCard);

    // Right Card: 3 Top Tracks
    if (heroTracks.length > 0) {
      const tracksCard = document.createElement("div");
      tracksCard.className = "search-hero-tracks-card";

      heroTracks.forEach((track) => {
        const row = document.createElement("div");
        row.className = "search-hero-track-row";
        
        const dur = track.duration_secs ? this.formatTime(track.duration_secs) : '';
        const sub = track.subtitle || (dur ? `Track • ${dur}` : (track.artist || 'Track'));

        row.innerHTML = `
          <img src="${track.artwork_url || this.DEFAULT_TRACK_ART}" class="search-hero-track-art" alt="${this.escapeHtml(track.title)}" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
          <div class="search-hero-track-info">
            <span class="search-hero-track-title">${this.escapeHtml(track.title)}</span>
            <span class="search-hero-track-sub">${this.escapeHtml(sub)}</span>
          </div>
        `;

        row.addEventListener("click", () => {
          this.tracks = [track, ...heroTracks.filter(t => t.id !== track.id), ...fallbackSongs.filter(t => t.id !== track.id)];
          this.loadTrack(0, true);
          this.showToast(`Playing ${track.title}`);
        });

        row.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          this.showContextMenu(e, track);
        });

        tracksCard.appendChild(row);
      });

      container.appendChild(tracksCard);
    } else {
      container.classList.add("single-card");
    }

    return container;
  }

  createArtistCard(art) {
    if (!art) return null;
    const artName = art.name || art.title || "";
    if (!artName) return null;
    const artAvatar = art.avatar_url || art.artwork_url || getArtistAvatar(artName);
    if (artAvatar) {
      MASTER_ARTIST_AVATARS[artName.toLowerCase().trim()] = artAvatar;
    }
    const card = document.createElement("div");
    card.className = "artist-card";
    card.innerHTML = `
      <div class="artist-card-art-box">
        <img src="${artAvatar}" class="artist-card-art" alt="${this.escapeHtml(artName)}" onerror="this.src='${getArtistAvatar(artName)}'">
      </div>
      <div class="artist-card-name" title="${this.escapeHtml(artName)}">${this.escapeHtml(artName)}</div>
      <div class="artist-card-role">${this.escapeHtml(art.sub_label || 'Artist')}</div>
    `;
    card.addEventListener("click", () => {
      this.openArtistDetail(artName, art.browse_id || art.id || '');
    });
    return card;
  }

  createAlbumCard(album) {
    if (!album) return null;
    const card = document.createElement("div");
    card.className = "album-card";
    const artwork = album.artwork_url || this.DEFAULT_TRACK_ART;

    card.innerHTML = `
      <div class="album-card-art-box">
        <img src="${artwork}" class="album-card-art" alt="${this.escapeHtml(album.title)}" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
        <div class="playlist-card-play-overlay">
          <iconsax-icon name="play" type="bold" size="20" color="#000000"></iconsax-icon>
        </div>
      </div>
      <div class="album-card-title" title="${this.escapeHtml(album.title)}">${this.escapeHtml(album.title)}</div>
      <div class="album-card-year">${this.escapeHtml(album.album_type || 'Album')} • ${this.escapeHtml(album.artist || 'Artist')} ${album.year ? '• ' + this.escapeHtml(album.year) : ''}</div>
    `;

    card.addEventListener("click", () => {
      this.openAlbumDetail(album);
    });

    return card;
  }

  // =========================================================
  // Musicfy Recommendation Algorithm & Multi-Provider Search
  // (Ported from Android MusicStreamSource.kt with Zero Static Data)
  // =========================================================
  async loadInitialCatalog() {
    this.renderLoadingPlaceholder(this.currentLanguage === 'id' ? "Memuat rekomendasi musik..." : "Loading music recommendations...");

    let feed = null;
    if (window.electronAPI && typeof window.electronAPI.getYtHomeFeed === 'function') {
      try {
        feed = await window.electronAPI.getYtHomeFeed(this.currentLanguage);
      } catch (err) {
        console.warn("getYtHomeFeed notice:", err);
      }
    }

    if (feed && feed.success) {
      if (Array.isArray(feed.quickPicks) && feed.quickPicks.length > 0) {
        this.officialQuickPicks = feed.quickPicks;
        if (this.quickPicksCarousel) {
          this.renderYtmSongCarousel(this.quickPicksCarousel, feed.quickPicks.slice(0, 16));
        }
      }
      if (Array.isArray(feed.charts) && feed.charts.length > 0) {
        this.officialCharts = feed.charts;
      }
      const plList = feed.featuredPlaylists || feed.communityPlaylists;
      if (Array.isArray(plList) && plList.length > 0) {
        this.officialCommunityPlaylists = plList;
        this.renderCommunityPlaylistsDirect(plList);
      }
      if (Array.isArray(feed.newReleases) && feed.newReleases.length > 0) {
        this.officialNewReleases = feed.newReleases;
      }
      // Render personalized album recommendations based on songs and artists the user listens to frequently
      this.fetchYtmNewReleases();
    }

    await this.fetchMusicfyRecommendations(feed);
  }

  renderLoadingPlaceholder(text = "Loading...") {
    if (!this.trackGrid) return;
    this.trackGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px 0; color: var(--color-text-secondary);">
        <div style="margin-bottom: 12px;"><iconsax-icon name="star" type="bold" size="28" color="#00E599"></iconsax-icon></div>
        <div style="font-size: 13px; font-weight: 600;">${this.escapeHtml(text)}</div>
      </div>
    `;
  }

  /**
   * Musicfy track picking algorithm:
   * - Filters out avoided songs and avoided artists.
   * - Partitions into heard vs unheard tracks:
   *   Keeps a balanced familiar ratio (familiar = Math.max(1, Math.floor(limit / 4))),
   *   filling the remaining with unheard discoveries.
   * - Enforces perArtist limit to spread diverse artists across the shelf.
   */
  pickDiverseTracks(songs, heardIds = new Set(), avoidSongs = new Set(), avoidArtists = new Set(), limit = 8, perArtist = 2) {
    if (!songs || !Array.isArray(songs)) return [];

    const usable = [];
    const seen = new Set();
    for (const track of songs) {
      if (!track || !track.id) continue;
      const artistName = (track.artist || "").trim().toLowerCase();
      if (avoidSongs.has(track.id) || avoidArtists.has(artistName)) continue;
      if (!seen.has(track.id)) {
        seen.add(track.id);
        usable.push(track);
      }
    }

    const heard = [];
    const unheard = [];
    for (const track of usable) {
      if (heardIds.has(track.id)) {
        heard.push(track);
      } else {
        unheard.push(track);
      }
    }

    const familiar = Math.max(1, Math.floor(limit / 4));
    const shuffledHeard = [...heard].sort(() => Math.random() - 0.5);
    const shuffledUnheard = [...unheard].sort(() => Math.random() - 0.5);

    const chosenHeard = shuffledHeard.slice(0, Math.min(familiar, heard.length));
    const neededUnheard = limit - chosenHeard.length;
    const chosenUnheard = shuffledUnheard.slice(0, neededUnheard);

    const combined = [...chosenUnheard, ...chosenHeard].sort(() => Math.random() - 0.5);

    const perArtistCount = new Map();
    const filtered = [];
    for (const track of combined) {
      const key = (track.artist || "").trim().toLowerCase();
      const count = perArtistCount.get(key) || 0;
      if (count < perArtist) {
        perArtistCount.set(key, count + 1);
        filtered.push(track);
        if (filtered.length >= limit) break;
      }
    }
    return filtered;
  }

  /**
   * Dynamic Randomized AI Recommendation Engine:
   * 1. Because You Like <Song>: related tracks minus the seed song, partitioned for discovery.
   * 2. More Like <Artist>: artist radio filtered to strictly exclude the seed artist itself (peer artists).
   * 3. Because You Listen to <Cluster>: top user culture/genre cluster from persistent listening behavior.
   * 4. Discover Something New: fresh randomized discovery vibe (acoustic, lofi, synthwave, dream pop).
   * 5. Musicfy interleaved row arrangement with across-row deduplication.
   */
  async fetchMusicfyRecommendations(feed = null) {
    if (this.sectionTitleLabel) {
      this.sectionTitleLabel.textContent = this.currentLanguage === 'id' ? "Trending & Rekomendasi Musik" : "Trending & Recommended Music";
    }

    const history = this.historyTracks || [];
    const liked = Array.from(this.likedTrackIds);
    const likedTracks = JSON.parse(localStorage.getItem("sorafy_liked_tracks") || "[]");
    const heardIds = new Set([...history.map(t => t.id), ...liked]);
    const avoidSongs = new Set();
    const avoidArtists = new Set();

    // Read stored user taste profile
    let tasteProfile = {};
    try {
      tasteProfile = JSON.parse(localStorage.getItem("sorafy_taste_profile") || "{}");
    } catch (_) {}

    // Calculate aggregated weighted artist affinity (history + liked + followed + likedAlbums + tasteProfile)
    const artistAffinity = {};
    history.forEach((t, idx) => {
      if (t.artist) {
        // Recency-weighted scoring: tracks played more recently get higher weight
        const recencyWeight = 1.0 + (1.0 - Math.min(1.0, idx / 30));
        artistAffinity[t.artist] = (artistAffinity[t.artist] || 0) + (1.5 * recencyWeight);
      }
    });
    likedTracks.forEach(t => {
      if (t.artist) {
        artistAffinity[t.artist] = (artistAffinity[t.artist] || 0) + 2.5;
      }
    });
    // Explicit followed artists get the highest recommendation weight (+12.0)
    if (this.followedArtists) {
      this.followedArtists.forEach(artKey => {
        const details = this.followedArtistDetails ? this.followedArtistDetails[artKey] : null;
        const artName = details?.name || artKey;
        artistAffinity[artName] = (artistAffinity[artName] || 0) + 12.0;
      });
    }
    // Saved full albums also grant strong artist affinity (+7.0)
    if (Array.isArray(this.likedAlbums)) {
      this.likedAlbums.forEach(alb => {
        if (alb && alb.artist) {
          artistAffinity[alb.artist] = (artistAffinity[alb.artist] || 0) + 7.0;
        }
      });
    }
    if (tasteProfile.artists) {
      for (const [art, count] of Object.entries(tasteProfile.artists)) {
        artistAffinity[art] = (artistAffinity[art] || 0) + (count * 1.2);
      }
    }

    const sortedArtists = Object.keys(artistAffinity).sort((a, b) => artistAffinity[b] - artistAffinity[a]);

    // Curated rich pool of varied discovery seeds for new users or randomized fallback
    const GLOBAL_DISCOVERY_SEEDS = [
      { artist: "The Weeknd", song: "Blinding Lights", clusterId: "western_pop_rnb" },
      { artist: "Bruno Mars", song: "Die With A Smile", clusterId: "western_pop_rnb" },
      { artist: "Billie Eilish", song: "BIRDS OF A FEATHER", clusterId: "western_alt_indie" },
      { artist: "Taylor Swift", song: "Cruel Summer", clusterId: "western_pop_rnb" },
      { artist: "Coldplay", song: "Yellow", clusterId: "western_alt_indie" },
      { artist: "SZA", song: "Saturn", clusterId: "western_pop_rnb" },
      { artist: "Kendrick Lamar", song: "Not Like Us", clusterId: "western_pop_rnb" },
      { artist: "Bernadya", song: "Satu Bulan", clusterId: "indo_indie_folk" },
      { artist: "Hindia", song: "Evaluasi", clusterId: "indo_indie_folk" },
      { artist: "Tulus", song: "Hati-Hati di Jalan", clusterId: "indo_pop_mainstream" },
      { artist: "NIKI", song: "Every Summertime", clusterId: "western_pop_rnb" },
      { artist: "Post Malone", song: "Chemical", clusterId: "western_pop_rnb" },
      { artist: "Sabrina Carpenter", song: "Espresso", clusterId: "western_pop_rnb" },
      { artist: "Olivia Dean", song: "Dive", clusterId: "western_alt_indie" }
    ];

    let seedArtist = "";
    let seedSong = null;

    if (sortedArtists.length > 0) {
      // User has listening/watching history! Sample dynamically and randomly from top candidates
      const candidateCount = Math.min(sortedArtists.length, 5);
      const randIdx = Math.floor(Math.random() * candidateCount);
      seedArtist = sortedArtists[randIdx];

      // Pick random seed song from recent history or liked tracks matching user's taste
      const songPool = history.length > 0 ? history.slice(0, 10) : likedTracks.slice(0, 10);
      const matchingSong = songPool.find(s => s.artist && s.artist.toLowerCase().includes(seedArtist.toLowerCase()));
      seedSong = matchingSong || songPool[Math.floor(Math.random() * songPool.length)] || {
        id: "seed_top",
        title: "Die With A Smile",
        artist: seedArtist
      };
    } else {
      // Dynamic random seed from discovery pool
      const randomSeed = GLOBAL_DISCOVERY_SEEDS[Math.floor(Math.random() * GLOBAL_DISCOVERY_SEEDS.length)];
      seedArtist = randomSeed.artist;
      seedSong = { id: `seed_${randomSeed.artist}`, title: randomSeed.song, artist: randomSeed.artist };
    }

    // Determine user's favorite culture cluster or fallback dynamically
    let topCluster = null;
    if (tasteProfile.clusters) {
      let maxScore = 0;
      let topId = null;
      for (const [cId, score] of Object.entries(tasteProfile.clusters)) {
        if (score > maxScore) {
          maxScore = score;
          topId = cId;
        }
      }
      if (topId) {
        topCluster = MUSIFY_CULTURE_CLUSTERS.find(c => c.id === topId);
      }
    }
    if (!topCluster) {
      const defaultClusterId = (GLOBAL_DISCOVERY_SEEDS.find(s => s.artist === seedArtist) || {}).clusterId || "western_pop_rnb";
      topCluster = MUSIFY_CULTURE_CLUSTERS.find(c => c.id === defaultClusterId) || MUSIFY_CULTURE_CLUSTERS[0];
    }

    // Pick dynamic randomized queries for genre & mood discovery
    const genreQuerySeed = (topCluster.searchSeeds && topCluster.searchSeeds.length > 0)
      ? topCluster.searchSeeds[Math.floor(Math.random() * topCluster.searchSeeds.length)]
      : "top global hits 2026";

    const DISCOVERY_VIBE_QUERIES = [
      { label: "CHILL & RELAXING", title: "Chill Lofi & Acoustic Beats", query: "lofi chill beats acoustic relaxing instrumental" },
      { label: "FRESH DISCOVERIES", title: "Indie & Alternative Essentials", query: "indie alternative dream pop hits" },
      { label: "LATE NIGHT VIBES", title: "Late Night Drive & Synthwave", query: "synthwave retro electro late night drive" },
      { label: "WARM ACOUSTIC", title: "Coffee House Acoustic Sessions", query: "acoustic guitar vocal cafe vibes live" },
      { label: "GLOBAL TRENDS", title: "Viral Global Chart Toppers", query: "top billboard viral pop hits 2026" }
    ];
    const discoveryVibe = DISCOVERY_VIBE_QUERIES[Math.floor(Math.random() * DISCOVERY_VIBE_QUERIES.length)];

    const shelves = [];

    // 1. Official YouTube Music Charts Shelf
    const officialChartsList = (feed && Array.isArray(feed.charts) && feed.charts.length > 0)
      ? feed.charts
      : (this.officialCharts && this.officialCharts.length > 0 ? this.officialCharts : []);

    if (officialChartsList.length >= 4) {
      const pickedCharts = this.pickDiverseTracks(officialChartsList, heardIds, avoidSongs, avoidArtists, 8, 2);
      if (pickedCharts.length >= 3) {
        shelves.push({
          id: "ytm_top_charts",
          label: "OFFICIAL CHARTS",
          title: this.currentLanguage === 'id' ? "Tangga Lagu & Trending" : "Top Charts & Trending",
          tracks: pickedCharts
        });
      }
    }

    const queryInnerTube = async (q) => {
      const fetchPromise = (async () => {
        if (window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function') {
          try {
            const res = await window.electronAPI.searchYouTubeMusic(q);
            if (res && res.length) {
              return res.map(t => ({
                ...t,
                is_liked: this.likedTrackIds.has(t.id)
              }));
            }
          } catch (_) {}
        }
        return await this.fetchExternalMusic(q);
      })();

      return Promise.race([
        fetchPromise,
        new Promise(resolve => setTimeout(() => resolve([]), 5000))
      ]);
    };

    try {
      const [rawSongRadio, rawArtistRadio, rawGenre, rawVibe] = await Promise.all([
        queryInnerTube(`${seedSong.artist} ${seedSong.title} radio hits`),
        queryInnerTube(`${seedArtist} hits radio mix`),
        queryInnerTube(genreQuerySeed),
        queryInnerTube(discoveryVibe.query)
      ]);

      // Shelf: "BECAUSE YOU LIKE <Song>"
      if (rawSongRadio && rawSongRadio.length) {
        const candidates = rawSongRadio.filter(t => t.id !== seedSong.id && !t.title.toLowerCase().includes(seedSong.title.toLowerCase()));
        const picked = this.pickDiverseTracks(candidates, heardIds, avoidSongs, avoidArtists, 8, 2);
        if (picked.length >= 3) {
          shelves.push({
            id: `because_${seedSong.id || 'seed'}`,
            label: "BECAUSE YOU LIKE",
            title: `${seedSong.title} • ${seedSong.artist}`,
            tracks: picked
          });
        }
      }

      // Shelf: "MORE LIKE <Artist>"
      if (rawArtistRadio && rawArtistRadio.length) {
        const peerCandidates = rawArtistRadio.filter(t => !t.artist.toLowerCase().includes(seedArtist.toLowerCase()));
        const picked = this.pickDiverseTracks(peerCandidates, heardIds, avoidSongs, avoidArtists, 8, 1);
        if (picked.length >= 3) {
          shelves.push({
            id: `more_like_${seedArtist.toLowerCase().replace(/\s+/g, '_')}`,
            label: `MORE LIKE ${seedArtist.toUpperCase()}`,
            title: `More Like ${seedArtist}`,
            tracks: picked
          });
        }
      }

      // Shelf: Dynamic Genre / Culture Shelf based on user affinity
      if (rawGenre && rawGenre.length) {
        const picked = this.pickDiverseTracks(rawGenre, heardIds, avoidSongs, avoidArtists, 8, 2);
        if (picked.length >= 3) {
          const shortClusterName = (topCluster.name || "POP").split(',')[0].trim().toUpperCase();
          shelves.push({
            id: `genre_${topCluster.id || 'pop'}`,
            label: `BECAUSE YOU LISTEN TO ${shortClusterName}`,
            title: `Best of ${topCluster.name.split(',')[0]}`,
            tracks: picked
          });
        }
      }

      // Shelf: Fresh randomized discoveries
      if (rawVibe && rawVibe.length) {
        const picked = this.pickDiverseTracks(rawVibe, heardIds, avoidSongs, avoidArtists, 8, 2);
        if (picked.length >= 3) {
          shelves.push({
            id: "discover_new",
            label: discoveryVibe.label,
            title: discoveryVibe.title,
            tracks: picked
          });
        }
      }

      // Musicfy Interleaved Arrangement + Across-Row Deduplication
      const seenSongIds = new Set();
      const finalShelves = [];

      for (const shelf of shelves) {
        const uniqueTracks = [];
        for (const track of shelf.tracks) {
          const trackKey = `${track.title.toLowerCase().trim()}__${track.artist.toLowerCase().trim()}`;
          if (!seenSongIds.has(track.id) && !seenSongIds.has(trackKey)) {
            seenSongIds.add(track.id);
            seenSongIds.add(trackKey);
            uniqueTracks.push(track);
          }
        }
        if (uniqueTracks.length >= 3) {
          finalShelves.push({
            ...shelf,
            tracks: uniqueTracks
          });
        }
      }

      this.currentShelves = finalShelves;
      this.homeTracks = finalShelves.flatMap(s => s.tracks);
      if (!this.isPlaying || !this.tracks || this.tracks.length === 0) {
        this.tracks = this.homeTracks;
      }

      if (this.homeTracks.length === 0) {
        await this.fetchTrendingChart();
        return;
      }

      // Populate Quick Picks Horizontal Swipe Carousel (YouTube Music mobile style)
      if (this.quickPicksCarousel) {
        const qpTracks = (this.officialQuickPicks && this.officialQuickPicks.length > 0)
          ? this.officialQuickPicks
          : (this.homeTracks ? this.homeTracks.slice(0, 16) : []);
        if (qpTracks && qpTracks.length > 0) {
          this.renderYtmSongCarousel(this.quickPicksCarousel, qpTracks.slice(0, 16));
        }
      }

      this.renderShelves(finalShelves);

      if (!this.isPlaying && !this.hasRestoredSession && this.tracks.length > 0 && !this.audio.src) {
        this.loadTrack(0, false);
      }
    } catch (e) {
      console.warn("Musicfy recommendations error:", e);
      await this.fetchTrendingChart();
    }
  }

  createTrackRow(track, idx, isActive, isLiked, onPlay, onRemove = null) {
    const row = document.createElement("div");
    row.className = `track-row ${isActive ? 'active' : ''}`;
    row.id = `track_row_${track.id}`;

    const artists = this.parseTrackArtists(track);
    let artistsHtml = '';
    if (artists.length > 0) {
      artistsHtml = artists.map(art => {
        return `<span class="player-artist-link" data-artist="${this.escapeHtml(art.name)}" data-browse="${art.browse_id || ''}">${this.escapeHtml(art.name)}</span>`;
      }).join('<span style="opacity: 0.6; margin: 0 2px;">, </span>');
    } else {
      const artName = track.artist || 'Artist';
      artistsHtml = `<span class="player-artist-link" data-artist="${this.escapeHtml(artName)}">${this.escapeHtml(artName)}</span>`;
    }

    row.innerHTML = `
      <div class="track-row-num">
        <span class="num-text">${idx + 1}</span>
        <span class="play-icon">▶</span>
        ${isActive && this.isPlaying ? '<div class="playing-bars"><span></span><span></span><span></span></div>' : ''}
      </div>
      <img src="${track.artwork_url || this.DEFAULT_TRACK_ART}" class="track-row-art" alt="${this.escapeHtml(track.title)}" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
      <div class="track-row-info">
        <div class="track-row-title">
          <span class="title-text">${this.escapeHtml(track.title)}</span>
          ${track.is_explicit ? '<span class="explicit-badge" title="Explicit">E</span>' : ''}
        </div>
        <div class="track-row-sub">${artistsHtml}</div>
      </div>
      <div class="track-row-actions">
        <button class="track-row-add-btn" title="Add to Playlist" id="row_add_${track.id}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
        <button class="track-row-heart ${isLiked ? 'liked' : ''}" title="Like" id="row_like_${track.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${isLiked ? '#00E599' : 'none'}" stroke="${isLiked ? '#00E599' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        ${onRemove ? `
          <button class="track-row-add-btn" title="Remove from Playlist" id="row_rem_${track.id}" style="color: #EF4444;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        ` : ''}
      </div>
      <div class="track-row-duration">${track.duration_secs ? this.formatTime(track.duration_secs) : ''}</div>
    `;

    row.addEventListener("click", (e) => {
      if (e.target.closest('.track-row-actions') || e.target.closest('.player-artist-link') || e.target.closest('.clickable')) return;
      onPlay();
    });

    row.querySelectorAll('.player-artist-link').forEach(link => {
      link.addEventListener("click", (e) => {
        e.stopPropagation();
        const aName = link.getAttribute('data-artist');
        const aBrowse = link.getAttribute('data-browse') || '';
        if (aName) this.openArtistDetail(aName, aBrowse);
      });
    });

    const addBtn = row.querySelector(`#row_add_${track.id}`);
    if (addBtn) {
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.openAddToPlaylistModal(track);
      });
    }

    const heartBtn = row.querySelector(`#row_like_${track.id}`);
    if (heartBtn) {
      heartBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleLikeTrack(track);
        const currentlyLiked = this.likedTrackIds.has(track.id);
        heartBtn.classList.toggle("liked", currentlyLiked);
        const svg = heartBtn.querySelector("svg");
        if (svg) {
          svg.setAttribute("fill", currentlyLiked ? "#00E599" : "none");
          svg.setAttribute("stroke", currentlyLiked ? "#00E599" : "currentColor");
        }
      });
    }

    if (onRemove) {
      const remBtn = row.querySelector(`#row_rem_${track.id}`);
      if (remBtn) {
        remBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          onRemove();
        });
      }
    }

    row.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.showContextMenu(e, track);
    });

    return row;
  }

  renderShelves(shelves) {
    if (!this.trackGrid) return;
    this.trackGrid.innerHTML = "";

    if (!shelves || shelves.length === 0) {
      this.trackGrid.innerHTML = `
        <div style="text-align: center; padding: 48px 0; color: var(--color-text-secondary); font-size: 13px;">
          No tracks found. Try refreshing.
        </div>
      `;
      return;
    }

    shelves.forEach(shelf => {
      const shelfEl = document.createElement("div");
      shelfEl.className = "musicfy-shelf";

      const headerEl = document.createElement("div");
      headerEl.className = "shelf-header";
      headerEl.innerHTML = `
        <span class="shelf-label">${this.escapeHtml(shelf.label)}</span>
        <h3 class="shelf-title">${this.escapeHtml(shelf.title)}</h3>
      `;
      shelfEl.appendChild(headerEl);

      const listEl = document.createElement("div");
      listEl.className = "track-list";

      shelf.tracks.forEach((track, idx) => {
        const isActive = this.tracks[this.currentTrackIndex]?.id === track.id;
        const isLiked = this.likedTrackIds.has(track.id);
        const row = this.createTrackRow(track, idx, isActive, isLiked, () => {
          if (this.homeTracks && this.homeTracks.length > 0) {
            this.tracks = [...this.homeTracks];
          }
          const globalIdx = this.tracks.findIndex(t => t.id === track.id);
          this.loadTrack(globalIdx !== -1 ? globalIdx : 0, true);
          this.showToast(`Playing ${track.title}`);
          this.renderShelves(this.currentShelves);
        });
        listEl.appendChild(row);
      });

      shelfEl.appendChild(listEl);
      this.trackGrid.appendChild(shelfEl);
    });

    this.renderQueue();
  }

  // =========================================================
  // YouTube Music Style Horizontal Swipe Song Carousel
  // =========================================================
  renderYtmSongCarousel(container, tracks) {
    if (!container) return;
    container.innerHTML = "";
    if (!tracks || tracks.length === 0) {
      container.innerHTML = `<div style="padding: 24px; color: var(--color-text-secondary); font-size: 13px;">No tracks to display at this time.</div>`;
      return;
    }

    // Group tracks into columns of 4 (YouTube Music layout)
    const columns = [];
    for (let i = 0; i < tracks.length; i += 4) {
      columns.push(tracks.slice(i, i + 4));
    }

    columns.forEach(colTracks => {
      const col = document.createElement("div");
      col.className = "ytm-song-column";

      colTracks.forEach(track => {
        const isActive = this.tracks[this.currentTrackIndex]?.id === track.id;
        const isLiked = this.likedTrackIds.has(track.id);

        const item = document.createElement("div");
        item.className = `ytm-song-item ${isActive ? 'active' : ''}`;
        item.id = `ytm_item_${track.id}`;

        const artists = this.parseTrackArtists(track);
        let artistsHtml = '';
        if (artists.length > 0) {
          artistsHtml = artists.map(art => {
            return `<span class="player-artist-link" data-artist="${this.escapeHtml(art.name)}" data-browse="${art.browse_id || ''}">${this.escapeHtml(art.name)}</span>`;
          }).join('<span style="opacity: 0.6; margin: 0 2px;">, </span>');
        } else {
          const artName = track.artist || 'Artist';
          artistsHtml = `<span class="player-artist-link" data-artist="${this.escapeHtml(artName)}">${this.escapeHtml(artName)}</span>`;
        }

        item.innerHTML = `
          <div class="ytm-song-art-box">
            <img src="${track.artwork_url || this.DEFAULT_TRACK_ART}" class="ytm-song-art" alt="${this.escapeHtml(track.title)}" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
            <div class="ytm-play-overlay">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
          </div>
          <div class="ytm-song-info">
            <div class="ytm-song-title">
              <span class="title-text">${this.escapeHtml(track.title)}</span>
              ${track.is_explicit ? '<span class="explicit-badge" title="Explicit">E</span>' : ''}
            </div>
            <div class="ytm-song-sub">${artistsHtml}${track.album ? ' • ' + this.escapeHtml(track.album) : ''}</div>
          </div>
          <div class="ytm-song-actions">
            <button class="track-row-heart ${isLiked ? 'liked' : ''}" title="Like" id="ytm_like_${track.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="${isLiked ? '#00E599' : 'none'}" stroke="${isLiked ? '#00E599' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
            <button class="track-row-add-btn" title="Add to Playlist" id="ytm_add_${track.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
            <span class="ytm-song-duration">${track.duration_secs ? this.formatTime(track.duration_secs) : ''}</span>
          </div>
        `;

        item.addEventListener("click", (e) => {
          if (e.target.closest('.track-row-heart') || e.target.closest('.track-row-add-btn') || e.target.closest('.player-artist-link')) return;
          const globalIdx = this.tracks.findIndex(t => t.id === track.id);
          if (globalIdx !== -1) {
            this.loadTrack(globalIdx, true);
          } else {
            if (this.homeTracks && this.homeTracks.length > 0) {
              this.tracks = [...this.homeTracks];
            }
            const homeIdx = this.tracks.findIndex(t => t.id === track.id);
            if (homeIdx !== -1) {
              this.loadTrack(homeIdx, true);
            } else {
              this.tracks.unshift(track);
              this.loadTrack(0, true);
            }
          }
          this.showToast(`Playing ${track.title}`);
          this.highlightActiveSongItems();
        });

        item.querySelectorAll('.player-artist-link').forEach(link => {
          link.addEventListener("click", (e) => {
            e.stopPropagation();
            const aName = link.getAttribute('data-artist');
            const aBrowse = link.getAttribute('data-browse') || '';
            if (aName) this.openArtistDetail(aName, aBrowse);
          });
        });

        const likeBtn = item.querySelector(`#ytm_like_${track.id}`);
        if (likeBtn) {
          likeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.toggleLikeTrack(track);
            const nowLiked = this.likedTrackIds.has(track.id);
            likeBtn.classList.toggle("liked", nowLiked);
            likeBtn.querySelector("svg").setAttribute("fill", nowLiked ? "#00E599" : "none");
            likeBtn.querySelector("svg").setAttribute("stroke", nowLiked ? "#00E599" : "currentColor");
          });
        }

        const addBtn = item.querySelector(`#ytm_add_${track.id}`);
        if (addBtn) {
          addBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.promptAddToPlaylist(track);
          });
        }

        item.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          this.showContextMenu(e, track);
        });

        col.appendChild(item);
      });

      container.appendChild(col);
    });
  }

  highlightActiveSongItems() {
    const curTrack = this.tracks[this.currentTrackIndex];
    if (!curTrack) return;
    document.querySelectorAll(".ytm-song-item").forEach(el => {
      el.classList.toggle("active", el.id === `ytm_item_${curTrack.id}`);
    });
  }

  // =========================================================
  // Exploration Screen Loader (Distinct from Home)
  // =========================================================
  async loadExploreView() {
    if (this.exploreLoaded) return;
    this.exploreLoaded = true;

    // 1. Render Mood & Genre Cards (Iconsax Icons)
    if (this.moodGenreGrid) {
      const moodCategories = [
        { name: "Relax & Chill", query: "santai chill acoustic indonesia relaxing", bg: "linear-gradient(135deg, #1E3A8A, #3B82F6)", icon: '<iconsax-icon name="coffee" type="bold" size="26" color="#FFFFFF"></iconsax-icon>' },
        { name: "Focus & Study", query: "focus study lofi beats instrumental", bg: "linear-gradient(135deg, #065F46, #10B981)", icon: '<iconsax-icon name="book" type="bold" size="26" color="#FFFFFF"></iconsax-icon>' },
        { name: "Workout & Energy", query: "workout cardio motivation EDM hits", bg: "linear-gradient(135deg, #991B1B, #EF4444)", icon: '<iconsax-icon name="flash" type="bold" size="26" color="#FFFFFF"></iconsax-icon>' },
        { name: "Romance & Love", query: "romantic love songs indonesia pop", bg: "linear-gradient(135deg, #831843, #EC4899)", icon: '<iconsax-icon name="heart" type="bold" size="26" color="#FFFFFF"></iconsax-icon>' },
        { name: "Sleep & Ambient", query: "sleep peaceful ambient calm piano", bg: "linear-gradient(135deg, #312E81, #6366F1)", icon: '<iconsax-icon name="moon" type="bold" size="26" color="#FFFFFF"></iconsax-icon>' },
        { name: "Party & Dance", query: "party dance club hits electronic", bg: "linear-gradient(135deg, #581C87, #A855F7)", icon: '<iconsax-icon name="music-filter" type="bold" size="26" color="#FFFFFF"></iconsax-icon>' },
        { name: "Indonesian Pop", query: "pop indonesia hits 2026", bg: "linear-gradient(135deg, #0F766E, #14B8A6)", icon: '<iconsax-icon name="music" type="bold" size="26" color="#FFFFFF"></iconsax-icon>' },
        { name: "Indie & Alternative", query: "indie pop indonesia alternative", bg: "linear-gradient(135deg, #92400E, #F59E0B)", icon: '<iconsax-icon name="musicnote" type="bold" size="26" color="#FFFFFF"></iconsax-icon>' },
        { name: "Acoustic Cafe", query: "acoustic guitar vocal cafe vibes", bg: "linear-gradient(135deg, #78350F, #D97706)", icon: '<iconsax-icon name="cup" type="bold" size="26" color="#FFFFFF"></iconsax-icon>' },
        { name: "R&B & Soul", query: "r&b soul smooth groove urban", bg: "linear-gradient(135deg, #701A75, #D946EF)", icon: '<iconsax-icon name="music-square" type="bold" size="26" color="#FFFFFF"></iconsax-icon>' },
        { name: "Classic & Modern Rock", query: "rock hits guitar solos alternative rock", bg: "linear-gradient(135deg, #18181B, #475569)", icon: '<iconsax-icon name="audio-square" type="bold" size="26" color="#FFFFFF"></iconsax-icon>' },
        { name: "Jazz & Bossa", query: "jazz cafe bossa nova smooth instrumental", bg: "linear-gradient(135deg, #134E4A, #2DD4BF)", icon: '<iconsax-icon name="radio" type="bold" size="26" color="#FFFFFF"></iconsax-icon>' }
      ];

      this.moodGenreGrid.innerHTML = "";
      moodCategories.forEach(item => {
        const card = document.createElement("div");
        card.className = "mood-genre-card";
        card.style.background = item.bg;
        card.innerHTML = `
          <span class="mood-genre-title">${this.escapeHtml(item.name)}</span>
          <span class="mood-genre-icon" style="display: flex; align-items: center; justify-content: center;">${item.icon}</span>
        `;
        card.addEventListener("click", () => {
          this.searchInput.value = item.name;
          this.searchOnlineMusic(item.query, 'song');
        });
        this.moodGenreGrid.appendChild(card);
      });
    }

    // 2. Fetch Top Charts for Tangga Lagu (columns of 4)
    if (this.chartsCarousel) {
      this.chartsCarousel.innerHTML = `<div style="padding: 24px; color: var(--color-text-secondary); font-size: 13px;">Loading top charts...</div>`;
      try {
        const chartTracks = await this.queryInnerTubeSongs("top 50 indonesia hits billboard");
        if (chartTracks && chartTracks.length) {
          this.renderYtmSongCarousel(this.chartsCarousel, chartTracks.slice(0, 24));
        }
      } catch (e) {
        console.warn("Chart tracks error:", e);
      }
    }

    // 3. Fetch New Releases Albums & Singles directly from YouTube Music Explore
    if (this.exploreNewReleasesRow) {
      this.exploreNewReleasesRow.innerHTML = `<div style="grid-column: 1/-1; padding: 24px; text-align: center; color: var(--color-text-secondary); font-size: 13px;">Loading latest releases and singles...</div>`;
      try {
        let albums = [];
        if (window.electronAPI && typeof window.electronAPI.browseYouTube === 'function') {
          const exploreData = await window.electronAPI.browseYouTube('FEmusic_explore').catch(() => null);
          if (exploreData && exploreData.albums && exploreData.albums.length) {
            albums = exploreData.albums;
          }
        }
        if ((!albums || !albums.length) && window.electronAPI && typeof window.electronAPI.browseYouTube === 'function') {
          const newRelData = await window.electronAPI.browseYouTube('FEmusic_new_releases').catch(() => null);
          if (newRelData && newRelData.albums && newRelData.albums.length) {
            albums = newRelData.albums;
          }
        }
        if ((!albums || !albums.length) && window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function') {
          albums = await window.electronAPI.searchYouTubeMusic("album baru indonesia rilis", 'album').catch(() => []);
        }

        if (albums && albums.length) {
          this.exploreNewReleasesRow.innerHTML = "";
          albums.slice(0, 24).forEach(album => {
            const card = document.createElement("div");
            card.className = "album-card";
            card.innerHTML = `
              <div class="album-card-art-box">
                <img src="${album.artwork_url || this.DEFAULT_TRACK_ART}" class="album-card-art" alt="${this.escapeHtml(album.title)}" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
              </div>
              <div class="album-card-title">${this.escapeHtml(album.title)}</div>
              <div class="album-card-year">${this.escapeHtml(album.year || ('Album • ' + (album.artist || 'Artist')))}</div>
            `;
            card.addEventListener("click", async () => {
              if (album.browse_id && window.electronAPI && typeof window.electronAPI.browseYouTube === 'function') {
                this.showToast(`Loading album tracks for ${album.title}...`);
                try {
                  const albumData = await window.electronAPI.browseYouTube(album.browse_id);
                  if (albumData && albumData.tracks && albumData.tracks.length) {
                    const audioTracks = albumData.tracks.filter(t => !t.is_video && t.type !== 'video');
                    this.tracks = audioTracks.length ? audioTracks : albumData.tracks;
                    this.loadTrack(0, true);
                    this.showToast(`Playing album ${album.title} (${this.tracks.length} tracks)`);
                    return;
                  }
                } catch (_) {}
              }
              this.searchOnlineMusic(`${album.artist || ''} ${album.title}`, 'song');
            });
            this.exploreNewReleasesRow.appendChild(card);
          });
        } else {
          this.exploreNewReleasesRow.innerHTML = `<div style="grid-column: 1/-1; padding: 24px; text-align: center; color: var(--color-text-secondary); font-size: 13px;">Unable to load new releases at this time.</div>`;
        }
      } catch (e) {
        console.warn("New releases error:", e);
      }
    }

    // 4. Wire up Explore navigation pill buttons
    document.querySelectorAll(".explore-nav-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".explore-nav-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        const tab = pill.dataset.exploreTab;
        if (tab === "charts") {
          document.getElementById("exploreChartsSection")?.scrollIntoView({ behavior: "smooth" });
        } else if (tab === "moods") {
          document.getElementById("exploreMoodsSection")?.scrollIntoView({ behavior: "smooth" });
        } else if (tab === "new-releases") {
          document.getElementById("exploreNewReleasesSection")?.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  toggleLikeTrack(track) {
    if (!track || !track.id) return;
    const isLiked = this.likedTrackIds.has(track.id);
    let likedTracks = JSON.parse(localStorage.getItem("sorafy_liked_tracks") || "[]");

    if (isLiked) {
      this.likedTrackIds.delete(track.id);
      track.is_liked = false;
      likedTracks = likedTracks.filter(t => t.id !== track.id);
      this.showToast(this.currentLanguage === "id" ? "Dihapus dari Lagu Disukai" : "Removed from Liked Songs");
    } else {
      this.likedTrackIds.add(track.id);
      track.is_liked = true;
      if (!likedTracks.some(t => t.id === track.id)) {
        likedTracks.unshift(track);
      }
      this.showToast(this.currentLanguage === "id" ? "Ditambahkan ke Lagu Disukai" : "Added to Liked Songs");
    }
    localStorage.setItem("sorafy_liked_ids", JSON.stringify([...this.likedTrackIds]));
    localStorage.setItem("sorafy_liked_tracks", JSON.stringify(likedTracks));
    this.updateLikeButton();
    if (this.currentView === "library") {
      this.renderLibraryLikedSongs();
    }
  }

  async fetchExternalMusic(query) {
    try {
      const dzRes = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=20`);
      if (dzRes.ok) {
        const json = await dzRes.json();
        if (json && json.data) {
          return json.data.map(item => ({
            id: `dz_${item.id}`,
            title: item.title,
            artist: item.artist.name,
            album: item.album ? item.album.title : item.title,
            duration_secs: item.duration || 0,
            stream_url: item.preview,
            artwork_url: item.album ? (item.album.cover_xl || item.album.cover_medium) : item.artist.picture_medium,
            audio_format: { codec: "Hi-Fi AAC", bitrate_kbps: 320, is_lossless: false },
            source_label: "Deezer Hi-Fi",
            is_liked: this.likedTrackIds.has(`dz_${item.id}`)
          }));
        }
      }
    } catch (_) {}

    try {
      const itRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=20`);
      if (itRes.ok) {
        const itJson = await itRes.json();
        if (itJson && itJson.results) {
          return itJson.results.map(r => ({
            id: `it_${r.trackId}`,
            title: r.trackName,
            artist: r.artistName,
            album: r.collectionName || r.trackName,
            duration_secs: Math.round(r.trackTimeMillis / 1000),
            stream_url: r.previewUrl,
            artwork_url: (r.artworkUrl100 || "").replace('100x100bb', '600x600bb'),
            audio_format: { codec: "Apple AAC", bitrate_kbps: 256, is_lossless: false },
            source_label: "Apple Music",
            is_liked: this.likedTrackIds.has(`it_${r.trackId}`)
          }));
        }
      }
    } catch (_) {}

    return [];
  }

  async fetchTrendingChart() {
    try {
      let tracks = [];
      if (this.officialCharts && this.officialCharts.length > 0) {
        tracks = this.officialCharts;
      } else if (window.electronAPI && typeof window.electronAPI.browseYouTube === 'function') {
        const res = await window.electronAPI.browseYouTube("VLPL4fGSI1pDJn5QPpj0R4vVgRWk8sSq549G");
        if (res && res.tracks && res.tracks.length) tracks = res.tracks;
      }
      if (!tracks.length && window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function') {
        const res = await window.electronAPI.searchYouTubeMusic("top hits indonesia 2026");
        if (res && res.length) tracks = res;
      }
      if (!tracks.length) {
        tracks = await this.fetchExternalMusic("top global hits");
      }
      if (tracks.length) {
        this.homeTracks = tracks.map(t => ({
          ...t,
          is_liked: this.likedTrackIds.has(t.id)
        }));
        if (!this.isPlaying || !this.tracks || this.tracks.length === 0) {
          this.tracks = this.homeTracks;
        }
        if (this.quickPicksCarousel) {
          this.renderYtmSongCarousel(this.quickPicksCarousel, this.homeTracks.slice(0, 16));
        }
        this.renderTrackGrid(this.homeTracks);
        if (!this.isPlaying && !this.hasRestoredSession && this.tracks.length > 0 && !this.audio.src) {
          this.loadTrack(0, false);
        }
      }
    } catch (e) {
      console.warn("Chart fetch notice:", e);
    }
  }

  // =========================================================
  // Curated Playlists & Custom Playlists Manager
  // =========================================================
  async loadCuratedPlaylists() {
    if (!this.curatedPlaylistsRow) return;
    this.curatedPlaylistsRow.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 20px; color: var(--color-text-secondary); font-size: 13px;">
        Loading curated playlists...
      </div>
    `;

    try {
      let playlists = [];
      if (window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function') {
        const res = await window.electronAPI.searchYouTubeMusic("pop hits playlist", "playlist");
        if (res && res.length) {
          playlists.push(...res.slice(0, 6));
        }
      }

      if (!playlists.length) {
        playlists = [
          { id: "pl_top_indo", title: "Top Pop Hits 2026", author: "SoraFy Curated", artwork_url: "https://i.ytimg.com/vi/anMYu17aZT4/hqdefault.jpg", track_count: "50 Tracks", browse_id: "VLPLx0sYbCqOb8TBPRdmBH6572A2_vE13B7b" },
          { id: "pl_indie_senja", title: "Indie Senja & Acoustic", author: "Special Curated", artwork_url: "https://i.ytimg.com/vi/7jY7lS1RkmM/hqdefault.jpg", track_count: "40 Tracks", browse_id: "VLPLx0sYbCqOb8TBPRdmBH6572A2_vE13B7b" },
          { id: "pl_chill_lofi", title: "Chill & Lofi Instrumental", author: "SoraFy Studio", artwork_url: "https://i.ytimg.com/vi/pXRviuL6v_U/hqdefault.jpg", track_count: "35 Tracks", browse_id: "VLPLx0sYbCqOb8TBPRdmBH6572A2_vE13B7b" },
          { id: "pl_fokus_kerja", title: "Focus & Deep Work Beats", author: "Study Hub", artwork_url: "https://i.ytimg.com/vi/P5ZBISo2CaE/hqdefault.jpg", track_count: "45 Tracks", browse_id: "VLPLx0sYbCqOb8TBPRdmBH6572A2_vE13B7b" }
        ];
      }

      // Strictly scrub any YouTube Music mentions
      this.curatedPlaylists = playlists.map(p => ({
        ...p,
        author: (!p.author || p.author.toLowerCase().includes('youtube') || p.author === 'Artist') ? 'SoraFy Curated' : p.author
      }));

      this.renderCuratedPlaylists(this.curatedPlaylists);
      this.renderPersonalizedShelf();
    } catch (e) {
      console.warn("Curated playlists notice:", e);
    }
  }

  renderCuratedPlaylists(playlists) {
    if (!this.curatedPlaylistsRow) return;
    this.curatedPlaylistsRow.innerHTML = "";

    playlists.forEach(pl => {
      const card = document.createElement("div");
      card.className = "playlist-card";
      card.innerHTML = `
        <div class="playlist-card-art-box">
          <img src="${pl.artwork_url || this.DEFAULT_TRACK_ART}" class="playlist-card-art" alt="${this.escapeHtml(pl.title)}" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
          <div class="playlist-card-play-overlay">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
        </div>
        <div class="playlist-card-title">${this.escapeHtml(pl.title)}</div>
        <div class="playlist-card-author">${this.escapeHtml(pl.author)}</div>
        <div class="playlist-card-count">${this.escapeHtml(pl.track_count || 'Curated Selection')}</div>
      `;

      card.addEventListener("click", () => {
        this.openPlaylistDetail(pl);
      });

      this.curatedPlaylistsRow.appendChild(card);
    });
  }

  // =========================================================
  // YouTube Music Modern Home Layout Engine
  // =========================================================
  initYtmHomeLayout() {
    // 1. Navigation Arrows Wire-Up
    if (this.videoNavPrevBtn && this.ytmMusicVideosRow) {
      this.videoNavPrevBtn.addEventListener("click", () => this.ytmMusicVideosRow.scrollBy({ left: -600, behavior: "smooth" }));
    }
    if (this.videoNavNextBtn && this.ytmMusicVideosRow) {
      this.videoNavNextBtn.addEventListener("click", () => this.ytmMusicVideosRow.scrollBy({ left: 600, behavior: "smooth" }));
    }

    if (this.commPlPrevBtn && this.ytmCommunityPlaylistsRow) {
      this.commPlPrevBtn.addEventListener("click", () => this.ytmCommunityPlaylistsRow.scrollBy({ left: -500, behavior: "smooth" }));
    }
    if (this.commPlNextBtn && this.ytmCommunityPlaylistsRow) {
      this.commPlNextBtn.addEventListener("click", () => this.ytmCommunityPlaylistsRow.scrollBy({ left: 500, behavior: "smooth" }));
    }

    if (this.newRelPrevBtn && this.ytmNewReleasesRow) {
      this.newRelPrevBtn.addEventListener("click", () => this.ytmNewReleasesRow.scrollBy({ left: -500, behavior: "smooth" }));
    }
    if (this.newRelNextBtn && this.ytmNewReleasesRow) {
      this.newRelNextBtn.addEventListener("click", () => this.ytmNewReleasesRow.scrollBy({ left: 500, behavior: "smooth" }));
    }

    // 2. Play All Videos Button
    if (this.playAllVideosBtn) {
      this.playAllVideosBtn.addEventListener("click", () => {
        if (this.currentMusicVideos && this.currentMusicVideos.length > 0) {
          this.tracks = [...this.currentMusicVideos];
          this.loadTrack(0, true);
          this.showToast(`Playing music videos (${this.tracks.length} videos)`);
          this.switchView("player");
          this.setScreenPlayerMode("video");
        } else {
          this.showToast("Loading videos...");
          this.fetchYtmMusicVideos(true);
        }
      });
    }

    // 3. View All New Releases Button
    if (this.viewAllNewReleasesBtn) {
      this.viewAllNewReleasesBtn.addEventListener("click", () => {
        this.switchView("explore");
        const relTab = document.querySelector('.explore-nav-pill[data-explore-tab="new-releases"]');
        if (relTab) relTab.click();
      });
    }

    // 4. Populate All Dynamic Sections
    this.renderOldFavoritesMixes();
    this.fetchYtmMusicVideos();
    this.fetchYtmCommunityPlaylists();
    this.fetchYtmNewReleases();
  }

  renderOldFavoritesMixes() {
    if (!this.ytmMixCardsGrid) return;
    this.ytmMixCardsGrid.innerHTML = "";

    const topArtists = [...new Set(this.historyTracks.map(t => t.artist))].filter(Boolean).slice(0, 4);
    const replaySubtitle = topArtists.length > 0
      ? topArtists.join(', ')
      : "twenty one pilots, Olivia Rodrigo, The Weeknd, Bruno Mars";

    const likedCount = this.likedTrackIds.size;
    const likedTracks = JSON.parse(localStorage.getItem("sorafy_liked_tracks") || "[]");
    const likedArtworks = likedTracks.filter(t => t.artwork_url && !t.artwork_url.includes('unsplash')).map(t => t.artwork_url).slice(0, 4);

    const historyArtworks = this.historyTracks.filter(t => t.artwork_url && !t.artwork_url.includes('unsplash')).map(t => t.artwork_url).slice(0, 4);

    // Authentic YouTube Music Google CDN artwork for the mixes
    const archiveMosaic = [
      "https://i.ytimg.com/vi/uY5s4mN6Y3A/hqdefault.jpg", // MASDO
      "https://i.ytimg.com/vi/Gs069dndIYk/hqdefault.jpg", // SEKAI NO OWARI
      "https://i.ytimg.com/vi/a51VH9BYzZA/hqdefault.jpg", // suisei
      "https://i.ytimg.com/vi/RYnFIRc0k6E/hqdefault.jpg"  // Limp Bizkit
    ];

    const replayMosaic = historyArtworks.length >= 4 ? historyArtworks : [
      "https://i.ytimg.com/vi/pXRviuL6v_U/hqdefault.jpg", // twenty one pilots
      "https://i.ytimg.com/vi/7jY7lS1RkmM/hqdefault.jpg", // Raisa
      "https://i.ytimg.com/vi/qY_3m6j09iA/hqdefault.jpg", // sombr
      "https://i.ytimg.com/vi/o50LpG_c40k/hqdefault.jpg"  // Bleachers
    ];

    const discoverMosaic = [
      "https://i.ytimg.com/vi/k3ChphiX7Wk/hqdefault.jpg", // P.O.D.
      "https://i.ytimg.com/vi/u9Dg-g7t2l4/hqdefault.jpg", // Disturbed
      "https://i.ytimg.com/vi/YVw1P6C76-c/hqdefault.jpg", // Thom Yorke
      "https://i.ytimg.com/vi/QxZ6X2_Yh1U/hqdefault.jpg"  // Laleilmanino
    ];

    const mixes = [
      {
        id: "mix_archive",
        title: "Archive Mix",
        sub: "MASDO, SEKAI NO OWARI, suisei, Limp Bizkit",
        bgClass: "mix-bg-archive",
        query: "MASDO SEKAI NO OWARI suisei Limp Bizkit hits",
        type: "archive",
        covers: archiveMosaic
      },
      {
        id: "mix_replay",
        title: "Replay Mix",
        sub: replaySubtitle,
        bgClass: "mix-bg-replay",
        query: replaySubtitle,
        type: "replay",
        covers: replayMosaic
      },
      {
        id: "mix_liked",
        title: "Liked Music",
        sub: `${likedCount > 0 ? likedCount + ' liked songs' : 'Auto playlist'}`,
        bgClass: "mix-bg-liked",
        type: "liked",
        covers: likedArtworks
      },
      {
        id: "mix_discover",
        title: "Discover Mix",
        sub: "P.O.D., Disturbed, Thom Yorke, Laleilmanino",
        bgClass: "mix-bg-discover",
        query: "P.O.D. Disturbed Thom Yorke Laleilmanino hits",
        type: "discover",
        covers: discoverMosaic
      }
    ];

    mixes.forEach(mix => {
      const card = document.createElement("div");
      card.className = "ytm-mix-card";

      let innerArtHtml = "";
      if (mix.type === "liked" && mix.covers.length < 4) {
        innerArtHtml = `
          <div class="ytm-mix-card-art ${mix.bgClass}">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;">
              <svg width="68" height="68" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </div>
            <div class="mix-play-overlay">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
          </div>
        `;
      } else {
        const coverList = (mix.covers && mix.covers.length >= 4) ? mix.covers : (mix.type === 'liked' ? archiveMosaic : archiveMosaic);
        innerArtHtml = `
          <div class="ytm-mix-card-art ${mix.bgClass}">
            <div class="mix-inner-mosaic">
              <img src="${coverList[0] || this.DEFAULT_TRACK_ART}" alt="Art" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
              <img src="${coverList[1] || this.DEFAULT_TRACK_ART}" alt="Art" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
              <img src="${coverList[2] || this.DEFAULT_TRACK_ART}" alt="Art" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
              <img src="${coverList[3] || this.DEFAULT_TRACK_ART}" alt="Art" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
            </div>
            <div style="position: absolute; top: 12px; left: 14px; font-size: 19px; font-weight: 800; color: #FFFFFF; text-shadow: 0 2px 8px rgba(0,0,0,0.8); letter-spacing: -0.3px; line-height: 1.15;">
              ${mix.type === 'archive' ? 'Archive<br><span style="font-size: 13px; opacity: 0.85; font-weight: 600;">Mix</span>' : ''}
              ${mix.type === 'replay' ? 'Replay<br><span style="font-size: 13px; opacity: 0.85; font-weight: 600;">Mix</span>' : ''}
              ${mix.type === 'discover' ? 'Discover<br><span style="font-size: 13px; opacity: 0.85; font-weight: 600;">Mix</span>' : ''}
              ${mix.type === 'liked' ? '<span style="font-size: 14px; background: rgba(0,0,0,0.6); padding: 4px 8px; border-radius: 4px;">Liked</span>' : ''}
            </div>
            <div class="mix-play-overlay">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        ${innerArtHtml}
        <div class="ytm-mix-card-title">${this.escapeHtml(mix.title)}</div>
        <div class="ytm-mix-card-sub">${this.escapeHtml(mix.sub)}</div>
      `;

      card.addEventListener("click", () => {
        if (mix.type === "liked") {
          this.switchView("liked");
          const curLiked = JSON.parse(localStorage.getItem("sorafy_liked_tracks") || "[]");
          if (curLiked.length > 0) {
            this.tracks = [...curLiked];
            this.loadTrack(0, true);
          }
        } else if (mix.query) {
          this.showToast(`Playing ${mix.title}...`);
          this.searchOnlineMusic(mix.query, 'song');
        }
      });

      this.ytmMixCardsGrid.appendChild(card);
    });
  }

  async fetchYtmMusicVideos(autoPlayFirst = false) {
    if (!this.ytmMusicVideosRow) return;
    this.ytmMusicVideosRow.innerHTML = `<div style="padding: 24px; color: var(--color-text-secondary); font-size: 13px;">Loading music videos...</div>`;

    try {
      const topArtists = [...new Set(this.historyTracks.map(t => t.artist))].filter(Boolean);
      const vidArtistSeed = topArtists.length > 0
        ? topArtists[Math.floor(Math.random() * Math.min(topArtists.length, 5))]
        : ["Olivia Rodrigo", "The Weeknd", "Bruno Mars", "Billie Eilish", "Taylor Swift", "Tulus", "Coldplay", "SZA"][Math.floor(Math.random() * 8)];
      const videoQuery = `${vidArtistSeed} official music video`;

      let videos = [];
      if (window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function') {
        videos = await window.electronAPI.searchYouTubeMusic(videoQuery, 'video').catch(() => []);
      }

      if (!videos || videos.length === 0) {
        videos = [
          {
            id: "yt_m0BFZKPsoWY",
            video_id: "m0BFZKPsoWY",
            title: "Love Me Not (Live) (Cover)",
            artist: "Olivia Dean",
            views: "13M views",
            artwork_url: "https://i.ytimg.com/vi/m0BFZKPsoWY/hqdefault.jpg",
            duration_secs: 245,
            is_video: true,
            source_label: "Music Video"
          },
          {
            id: "yt_X7UqPXvWUzw",
            video_id: "X7UqPXvWUzw",
            title: "Drag Path",
            artist: "twenty one pilots",
            views: "17M views",
            artwork_url: "https://i.ytimg.com/vi/X7UqPXvWUzw/hqdefault.jpg",
            duration_secs: 230,
            is_video: true,
            source_label: "Music Video"
          },
          {
            id: "yt_P5ZBISo2CaE",
            video_id: "P5ZBISo2CaE",
            title: "the cure",
            artist: "Olivia Rodrigo",
            views: "52M views",
            artwork_url: "https://i.ytimg.com/vi/P5ZBISo2CaE/hqdefault.jpg",
            duration_secs: 220,
            is_video: true,
            source_label: "Music Video"
          },
          {
            id: "yt_anMYu17aZT4",
            video_id: "anMYu17aZT4",
            title: "Andai Aku Bisa (Virtual Collaboration)",
            artist: "Erwin Gutawa, Tulus",
            views: "141M views",
            artwork_url: "https://i.ytimg.com/vi/anMYu17aZT4/hqdefault.jpg",
            duration_secs: 280,
            is_video: true,
            source_label: "Music Video"
          }
        ];
      }

      this.currentMusicVideos = videos;
      this.ytmMusicVideosRow.innerHTML = "";

      videos.forEach((vid, idx) => {
        const card = document.createElement("div");
        card.className = "ytm-video-card";
        const highThumb = vid.artwork_url || `https://i.ytimg.com/vi/${vid.video_id}/hqdefault.jpg`;
        const durText = vid.duration_secs ? this.formatTime(vid.duration_secs) : "";
        const isVidArtVer = this.isArtistVerified(vid.artist || '');
        const subText = `${this.escapeHtml(vid.artist || 'Artist')}${vid.views ? ' • ' + this.escapeHtml(vid.views) : (durText ? ' • ' + durText : '')}`;

        card.innerHTML = `
          <div class="ytm-video-art-box">
            <img src="${highThumb}" alt="${this.escapeHtml(vid.title)}" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
            <div class="ytm-video-play-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
            ${durText ? `<div class="ytm-video-badge-tag">${durText}</div>` : ''}
          </div>
          <div class="ytm-video-title">${this.escapeHtml(vid.title)}</div>
          <div class="ytm-video-sub">${subText}</div>
        `;

        card.addEventListener("click", () => {
          this.tracks = [...this.currentMusicVideos];
          this.loadTrack(idx, true);
          this.showToast(`Playing video: ${vid.title}`);
          this.switchView("player");
          this.setScreenPlayerMode("video");
        });

        this.ytmMusicVideosRow.appendChild(card);
      });

      if (autoPlayFirst && videos.length > 0) {
        this.tracks = [...videos];
        this.loadTrack(0, true);
        this.switchView("player");
        this.setScreenPlayerMode("video");
      }
    } catch (e) {
      console.warn("fetchYtmMusicVideos notice:", e);
      this.ytmMusicVideosRow.innerHTML = `<div style="padding: 18px; color: var(--color-text-secondary); font-size: 13px;">Unable to load music videos at this time.</div>`;
    }
  }

  // Filter to strictly exclude Indian songs, playlists, Bollywood, and regional Indian scripts
  isIndianMusic(title = '', author = '') {
    const str = `${title} ${author}`.toLowerCase();
    const indianKeywords = /\b(hindi|bollywood|punjabi|tamil|telugu|india|indian|tollywood|malayalam|bhojpuri|gujarati|bengali|marathi|kannada|desi|bhangra|sufi|urdu|ghazal|qawwali|arijit|shreya|neha|jubin|badshah|sidhu|diljit|anirudh|pritam|himesh|t-series|zeemusic|speedrecords|geetmp3|whitehill)\b/i;
    const indianScripts = /[\u0900-\u097F\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F]/;
    return indianKeywords.test(str) || indianScripts.test(str);
  }

  renderCommunityPlaylistsDirect(playlists) {
    if (!this.ytmCommunityPlaylistsRow || !playlists || playlists.length === 0) return;
    this.ytmCommunityPlaylistsRow.innerHTML = "";

    // Strictly keep only Indonesian and Global curated playlists
    const cleanList = playlists.filter(pl => !this.isIndianMusic(pl.title || '', pl.author || ''));
    if (cleanList.length === 0) return;

    cleanList.slice(0, 16).forEach(pl => {
      const card = document.createElement("div");
      card.className = "ytm-comm-card";
      const authorInitial = (pl.avatar_letter || pl.author?.charAt(0) || 'S').toUpperCase();

      let cleanAuthor = pl.author || '';
      cleanAuthor = cleanAuthor.replace(/YouTube Music/gi, 'Official Selection')
                               .replace(/YouTube/gi, 'Official')
                               .replace(/Community/gi, 'Curated')
                               .trim();
      if (!cleanAuthor || cleanAuthor === '•') {
        cleanAuthor = this.currentLanguage === 'id' ? 'Playlist Pilihan' : 'Curated Selection';
      }

      const countStr = pl.track_count && !cleanAuthor.toLowerCase().includes('lagu') && !cleanAuthor.toLowerCase().includes('song')
        ? ' • ' + this.escapeHtml(pl.track_count)
        : '';
      const sub = `${this.escapeHtml(cleanAuthor)}${countStr}`;

      card.innerHTML = `
        <div class="ytm-comm-art-box">
          <img src="${pl.artwork_url || this.DEFAULT_TRACK_ART}" alt="${this.escapeHtml(pl.title)}" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
          <div class="ytm-comm-avatar">${authorInitial}</div>
          <div class="ytm-comm-play-overlay">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
        </div>
        <div class="ytm-comm-title">${this.escapeHtml(pl.title)}</div>
        <div class="ytm-comm-sub">${sub}</div>
      `;

      card.addEventListener("click", () => {
        this.openPlaylistDetail(pl);
      });

      this.ytmCommunityPlaylistsRow.appendChild(card);
    });
  }

  renderNewReleasesDirect(albums) {
    if (!this.ytmNewReleasesRow || !albums || albums.length === 0) return;
    this.ytmNewReleasesRow.innerHTML = "";

    albums.slice(0, 18).forEach(alb => {
      const card = document.createElement("div");
      card.className = "ytm-release-card";
      const artNameHtml = `<span class="player-artist-link" data-artist="${this.escapeHtml(alb.artist || 'Artist')}" data-browse="${alb.artist_browse_id || ''}">${this.escapeHtml(alb.artist || 'Artist')}</span>`;
      const sub = `${this.escapeHtml(alb.album_type || alb.year || 'Album')} • ${artNameHtml}`;

      card.innerHTML = `
        <div class="ytm-release-art-box">
          <img src="${alb.artwork_url || this.DEFAULT_TRACK_ART}" alt="${this.escapeHtml(alb.title)}" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
          <div class="ytm-release-play-overlay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
        </div>
        <div class="ytm-release-title">
          <span class="title-text">${this.escapeHtml(alb.title)}</span>
          ${alb.is_explicit ? '<span class="explicit-badge" title="Explicit">E</span>' : ''}
        </div>
        <div class="ytm-release-sub">${sub}</div>
      `;

      card.addEventListener("click", async (e) => {
        if (e.target.closest('.player-artist-link')) return;
        if (alb.browse_id && window.electronAPI && typeof window.electronAPI.browseYouTube === 'function') {
          this.showToast(`Loading tracks for ${alb.title}...`);
          try {
            const albumData = await window.electronAPI.browseYouTube(alb.browse_id);
            if (albumData && albumData.tracks && albumData.tracks.length) {
              const audioTracks = albumData.tracks.filter(t => !t.is_video && t.type !== 'video');
              this.tracks = audioTracks.length ? audioTracks : albumData.tracks;
              this.loadTrack(0, true);
              this.showToast(`Playing ${alb.title} (${this.tracks.length} tracks)`);
              return;
            }
          } catch (_) {}
        }
        this.openAlbumDetail(alb);
      });

      card.querySelectorAll('.player-artist-link').forEach(link => {
        link.addEventListener("click", (e) => {
          e.stopPropagation();
          const aName = link.getAttribute('data-artist');
          const aBrowse = link.getAttribute('data-browse') || '';
          if (aName) this.openArtistDetail(aName, aBrowse);
        });
      });

      this.ytmNewReleasesRow.appendChild(card);
    });
  }

  // Extract frequently listened & favored artists from user history, liked tracks, liked albums, and followed artists
  getFrequentArtists() {
    const counts = {};

    // 1. Followed Artists give HIGHEST weight (+12)
    if (this.followedArtists) {
      this.followedArtists.forEach(artKey => {
        const details = this.followedArtistDetails?.[artKey];
        const artName = details?.name || artKey;
        if (artName && artName.toLowerCase() !== 'artist') {
          counts[artName] = (counts[artName] || 0) + 12;
        }
      });
    }

    // 2. Liked Albums artists give strong weight (+7)
    if (this.likedAlbums && Array.isArray(this.likedAlbums)) {
      this.likedAlbums.forEach(alb => {
        if (!alb || !alb.artist) return;
        const primary = alb.artist.split(/\s*,\s*|\s+&\s+|\s+(?:feat|ft)\.?\s+/i)[0].trim();
        if (primary && primary.toLowerCase() !== 'artist') {
          counts[primary] = (counts[primary] || 0) + 7;
        }
      });
    }

    // 3. Liked Songs give solid weight (+3)
    try {
      const liked = JSON.parse(localStorage.getItem("sorafy_liked_tracks") || "[]");
      liked.forEach(t => {
        if (!t || !t.artist) return;
        const primary = t.artist.split(/\s*,\s*|\s+&\s+|\s+(?:feat|ft)\.?\s+/i)[0].trim();
        if (primary && primary.toLowerCase() !== 'artist' && primary.toLowerCase() !== 'unknown') {
          counts[primary] = (counts[primary] || 0) + 3;
        }
      });
    } catch (_) {}

    // 4. Play History gives incremental recency weight (+1)
    const history = this.historyTracks || [];
    history.forEach(t => {
      if (!t || !t.artist) return;
      const primary = t.artist.split(/\s*,\s*|\s+&\s+|\s+(?:feat|ft)\.?\s+/i)[0].trim();
      if (primary && primary.toLowerCase() !== 'artist' && primary.toLowerCase() !== 'unknown') {
        counts[primary] = (counts[primary] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(e => e[0]);
  }

  async fetchYtmCommunityPlaylists() {
    if (!this.ytmCommunityPlaylistsRow) return;
    if (this.officialCommunityPlaylists && this.officialCommunityPlaylists.length > 0) {
      this.renderCommunityPlaylistsDirect(this.officialCommunityPlaylists);
      return;
    }
    this.ytmCommunityPlaylistsRow.innerHTML = `<div style="padding: 24px; color: var(--color-text-secondary); font-size: 13px;">${this.currentLanguage === 'id' ? "Memuat playlist pilihan..." : "Loading featured playlists..."}</div>`;

    try {
      // Use official editorial playlists fallback immediately with high-res official covers
      const officialFallback = [
        {
          title: "Indonesian Pop Hits 2024",
          author: "Official Selection • 50 lagu",
          track_count: "50 lagu",
          artwork_url: "https://yt3.googleusercontent.com/Cwn13zlewJHGWBR4qKHZ0ykL5d8VGgFqDSZZdBEBedcKlnFB5RxoxRy9gz-slET1mPD5--diAB-qHaiJ=w544-h544-p-l90-rj",
          browse_id: "VLRDCLAK5uy_khVZocvQocnmtzkOUZlAapWuIJss51XEk",
          avatar_letter: "S"
        },
        {
          title: "Today's Top Hits Pop",
          author: "Official Selection • 50 songs",
          track_count: "50 songs",
          artwork_url: "https://i.ytimg.com/vi/P5ZBISo2CaE/hqdefault.jpg",
          browse_id: "VLPL4fGSI1pDJn5QPpj0R4vVgRWk8sSq549G",
          avatar_letter: "S"
        },
        {
          title: "Trend Viral Sekarang",
          author: "Official Selection • 100 lagu",
          track_count: "100 lagu",
          artwork_url: "https://yt3.googleusercontent.com/sxj4Jr1CXagkdEc4aFZ5q5QTffWALYYuNXZGGaU8j0yu-szSvxNcmrpV6fDExbEFvE3UVHSDhUUqycs=w544-h544-p-l90-rj",
          browse_id: "VLRDCLAK5uy_nOVpLE7yC1hOzKOA9SqiVIeLqmoUDWBkE",
          avatar_letter: "S"
        },
        {
          title: "Global Pop Chart Toppers",
          author: "Official Selection • 50 songs",
          track_count: "50 songs",
          artwork_url: "https://i.ytimg.com/vi/k3ChphiX7Wk/hqdefault.jpg",
          browse_id: "VLOLAK5uy_n7Ig_LAUbKE6_ZeQ1pwHmJcEhwX7BekBo",
          avatar_letter: "S"
        },
        {
          title: "Hits Rock Indonesia Sepanjang Masa",
          author: "Official Selection • 100 lagu",
          track_count: "100 lagu",
          artwork_url: "https://yt3.googleusercontent.com/r6jWzR3V6nJkI4yG9wK1b8cWj5dG7vN2pM9kL4sJ2u1pQ4kL8rT=w544-h544-p-l90-rj",
          browse_id: "VLRDCLAK5uy_mxlxWmgiUEfWzajrw_LtH0PVbjtdhxTXE",
          avatar_letter: "S"
        },
        {
          title: "Pop Indonesia '00-an",
          author: "Official Selection • 100 lagu",
          track_count: "100 lagu",
          artwork_url: "https://yt3.googleusercontent.com/qIBzahyqZKQhUGZ5vxP5EO0gLKyau4mGykVmnYHtdU__R5Ej9QA5kW4Xsh-2cmfO7X_hb2AHxqtx5Q8=w544-h544-p-l90-rj",
          browse_id: "VLRDCLAK5uy_n8TF7zJYjsxhmtGa7h_YcxUgIdta4ruxE",
          avatar_letter: "S"
        },
        {
          title: "Top Jawa Ngangeni",
          author: "Official Selection • 76 lagu",
          track_count: "76 lagu",
          artwork_url: "https://yt3.googleusercontent.com/aZbT8Fd8BCmA5rSSmSW0-cEpdhzUD7DtncUl1brQD4CWLcBR1suxiWugDL1QW7IM9ZfnWuCJg0ej19o=w544-h544-p-l90-rj",
          browse_id: "VLRDCLAK5uy_lhjY1aXe7buvbe6jo3XOb3bEP5Jv3g0hU",
          avatar_letter: "S"
        },
        {
          title: "Indie Hits Indonesia",
          author: "Official Selection • 50 lagu",
          track_count: "50 lagu",
          artwork_url: "https://yt3.googleusercontent.com/Cwn13zlewJHGWBR4qKHZ0ykL5d8VGgFqDSZZdBEBedcKlnFB5RxoxRy9gz-slET1mPD5--diAB-qHaiJ=w544-h544-p-l90-rj",
          browse_id: "VLRDCLAK5uy_kixp1WFKVVxB_w-Thypn7wV09tU_vgrYE",
          avatar_letter: "S"
        }
      ];

      this.renderCommunityPlaylistsDirect(officialFallback);
    } catch (e) {
      console.warn("fetchYtmCommunityPlaylists notice:", e);
      this.ytmCommunityPlaylistsRow.innerHTML = `<div style="padding: 18px; color: var(--color-text-secondary); font-size: 13px;">${this.currentLanguage === 'id' ? "Tidak dapat memuat playlist pilihan saat ini." : "Unable to load featured playlists at this time."}</div>`;
    }
  }

  // Personalized album recommendations tailored to songs and artists the user listens to frequently
  async fetchYtmNewReleases() {
    if (!this.ytmNewReleasesRow) return;

    const topArtists = this.getFrequentArtists();
    const titleEl = document.getElementById("homeAlbumsTitle");
    const subEl = document.getElementById("homeAlbumsSub");

    if (topArtists.length > 0) {
      if (titleEl) titleEl.textContent = this.currentLanguage === 'id' ? "Rekomendasi Album Untukmu" : "Albums Recommended For You";
      if (subEl) subEl.textContent = this.currentLanguage === 'id'
        ? `Berdasarkan musik yang sering kamu dengarkan (${topArtists.slice(0, 3).join(', ')})`
        : `Based on your favorite listening taste (${topArtists.slice(0, 3).join(', ')})`;
    } else {
      if (titleEl) titleEl.textContent = this.currentLanguage === 'id' ? "Album Pilihan Terpopuler" : "Featured & Trending Albums";
      if (subEl) subEl.textContent = this.currentLanguage === 'id'
        ? "Album dan rilisan terpopuler minggu ini"
        : "Top albums and new releases this week";
    }

    this.ytmNewReleasesRow.innerHTML = `<div style="padding: 24px; color: var(--color-text-secondary); font-size: 13px;">${this.currentLanguage === 'id' ? "Memuat rekomendasi album..." : "Loading recommended albums..."}</div>`;

    try {
      let personalizedAlbums = [];

      // 1. If user has favorite/frequently listened artists, fetch real albums for these artists
      if (topArtists.length > 0 && window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function') {
        const artistsToFetch = topArtists.slice(0, 4);
        const searchPromises = artistsToFetch.map(art =>
          window.electronAPI.searchYouTubeMusic(art, 'album').catch(() => [])
        );
        const results = await Promise.all(searchPromises);

        // Deduplicate and filter out karaoke / cover / tribute albums
        const seen = new Set();
        const artistBuckets = results.map((list, idx) => {
          const artName = artistsToFetch[idx].toLowerCase();
          return list.filter(alb => {
            if (!alb || !alb.browse_id || seen.has(alb.browse_id)) return false;
            const albArt = (alb.artist || '').toLowerCase();
            const albTitle = (alb.title || '').toLowerCase();
            if (albArt.includes('karaoke') || albTitle.includes('karaoke') || albArt.includes('tribute') || albTitle.includes('tribute')) return false;
            return albArt.includes(artName) || artName.includes(albArt) || alb.is_official !== false;
          });
        });

        // Interleave albums from top artists so user gets a balanced diversity
        let hasMore = true;
        let round = 0;
        while (hasMore && personalizedAlbums.length < 18) {
          hasMore = false;
          for (let b = 0; b < artistBuckets.length; b++) {
            if (artistBuckets[b][round]) {
              const alb = artistBuckets[b][round];
              if (!seen.has(alb.browse_id)) {
                seen.add(alb.browse_id);
                personalizedAlbums.push(alb);
              }
              hasMore = true;
            }
          }
          round++;
        }
      }

      // 2. If fewer than 8 albums, pad with official new releases or top albums
      if (personalizedAlbums.length < 8) {
        const fallbacks = (this.officialNewReleases && this.officialNewReleases.length > 0)
          ? this.officialNewReleases
          : (window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function'
              ? await window.electronAPI.searchYouTubeMusic(this.currentLanguage === 'id' ? "hits album indonesia" : "top hits album", 'album').catch(() => [])
              : []);

        for (const f of fallbacks) {
          if (f.browse_id && !personalizedAlbums.some(a => a.browse_id === f.browse_id)) {
            personalizedAlbums.push(f);
            if (personalizedAlbums.length >= 16) break;
          }
        }
      }

      if (personalizedAlbums.length > 0) {
        this.renderNewReleasesDirect(personalizedAlbums);
      } else {
        this.ytmNewReleasesRow.innerHTML = `<div style="padding: 18px; color: var(--color-text-secondary); font-size: 13px;">${this.currentLanguage === 'id' ? "Belum ada rekomendasi album." : "No album recommendations available yet."}</div>`;
      }
    } catch (e) {
      console.warn("fetchYtmNewReleases notice:", e);
      if (this.officialNewReleases && this.officialNewReleases.length > 0) {
        this.renderNewReleasesDirect(this.officialNewReleases);
      } else {
        this.ytmNewReleasesRow.innerHTML = `<div style="padding: 18px; color: var(--color-text-secondary); font-size: 13px;">${this.currentLanguage === 'id' ? "Tidak dapat memuat album saat ini." : "Unable to load albums at this time."}</div>`;
      }
    }
  }

  async initUserPlaylists() {
    if (!this.userPlaylistsNav) return;

    if (window.electronAPI && typeof window.electronAPI.loadUserPlaylistsDisk === 'function') {
      try {
        const diskPlaylists = await window.electronAPI.loadUserPlaylistsDisk();
        if (Array.isArray(diskPlaylists) && diskPlaylists.length > 0) {
          if (!this.userPlaylists || this.userPlaylists.length === 0) {
            this.userPlaylists = diskPlaylists;
          } else {
            const currentIds = new Set(this.userPlaylists.map(p => p.id));
            for (const dp of diskPlaylists) {
              if (dp && dp.id && !currentIds.has(dp.id)) {
                this.userPlaylists.push(dp);
                currentIds.add(dp.id);
              }
            }
          }
        }
      } catch (err) {
        console.warn("Disk playlists load note:", err);
      }
    }

    this.userPlaylists = (this.userPlaylists || []).filter(pl => pl && pl.id && pl.id !== "upl_favorites" && pl.title !== "Lagu Santai Saya");
    this.saveUserPlaylists();
    this.renderUserPlaylists();
  }

  renderUserPlaylists() {
    if (!this.userPlaylistsNav) return;
    this.userPlaylistsNav.innerHTML = "";

    if (!this.userPlaylists || this.userPlaylists.length === 0) {
      this.userPlaylistsNav.innerHTML = `
        <div style="padding: 10px 14px; font-size: 12px; color: var(--color-text-tertiary); font-style: italic;">
          No playlists yet
        </div>
      `;
      return;
    }

    this.userPlaylists.forEach(pl => {
      const item = document.createElement("div");
      item.className = "nav-item";
      item.style.position = "relative";
      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.justifyContent = "space-between";

      item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" style="flex-shrink: 0;"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">${this.escapeHtml(pl.title)}</span>
        </div>
        <button class="playlist-more-dots-btn" title="Playlist options" style="background: none; border: none; color: var(--color-text-tertiary); padding: 4px 6px; cursor: pointer; border-radius: 4px; display: none;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="19" r="2"></circle></svg>
        </button>
      `;

      item.addEventListener("mouseenter", () => {
        const btn = item.querySelector(".playlist-more-dots-btn");
        if (btn) btn.style.display = "inline-flex";
      });
      item.addEventListener("mouseleave", () => {
        const btn = item.querySelector(".playlist-more-dots-btn");
        if (btn) btn.style.display = "none";
      });

      const moreBtn = item.querySelector(".playlist-more-dots-btn");
      if (moreBtn) {
        moreBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.showPlaylistContextMenu(e, pl);
        });
      }

      item.addEventListener("click", () => {
        this.openPlaylistDetail(pl);
      });

      item.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.showPlaylistContextMenu(e, pl);
      });

      this.userPlaylistsNav.appendChild(item);
    });
  }

  showPlaylistContextMenu(e, pl) {
    if (this.playlistContextMenu) {
      this.playlistContextMenu.remove();
      this.playlistContextMenu = null;
    }

    const menu = document.createElement("div");
    menu.className = "context-menu";
    menu.id = "playlistContextMenu";
    menu.style.top = `${e.clientY}px`;
    menu.style.left = `${Math.min(e.clientX, window.innerWidth - 220)}px`;
    menu.style.display = "block";

    menu.innerHTML = `
      <div class="context-menu-item" id="ctx_pl_play">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        <span>Play Playlist</span>
      </div>
      <div class="context-menu-item" id="ctx_pl_edit">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
        <span>Edit Details</span>
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" id="ctx_pl_delete" style="color: #EF4444;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        <span>Delete Playlist</span>
      </div>
    `;

    document.body.appendChild(menu);
    this.playlistContextMenu = menu;

    menu.querySelector("#ctx_pl_play")?.addEventListener("click", () => {
      this.openPlaylistDetail(pl).then(() => {
        if (pl.tracks && pl.tracks.length) {
          this.tracks = [...pl.tracks];
          this.loadTrack(0, true);
        }
      });
      menu.remove();
    });

    menu.querySelector("#ctx_pl_edit")?.addEventListener("click", () => {
      this.openEditPlaylistModal(pl);
      menu.remove();
    });

    menu.querySelector("#ctx_pl_delete")?.addEventListener("click", () => {
      if (confirm(`Are you sure you want to delete playlist "${pl.title}"?`)) {
        this.deletePlaylist(pl.id);
      }
      menu.remove();
    });

    const closeHandler = (evt) => {
      if (!menu.contains(evt.target)) {
        menu.remove();
        document.removeEventListener("click", closeHandler);
      }
    };
    setTimeout(() => document.addEventListener("click", closeHandler), 10);
  }

  openCreatePlaylistModal() {
    if (this.createPlaylistModal) {
      this.createPlaylistModal.style.display = "flex";
      this.playlistNameInput.value = "";
      this.playlistDescInput.value = "";
      setTimeout(() => this.playlistNameInput.focus(), 50);
    }
  }

  createPlaylist(name, desc = "") {
    const newPl = {
      id: "upl_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      title: name,
      description: desc || "Custom user playlist",
      tracks: []
    };

    if (this.selectedTrackForPlaylist) {
      newPl.tracks.push(this.selectedTrackForPlaylist);
      newPl.artwork_url = this.selectedTrackForPlaylist.artwork_url;
      this.selectedTrackForPlaylist = null;
    }

    this.userPlaylists.push(newPl);
    this.saveUserPlaylists();
    this.renderUserPlaylists();
    this.showToast(`Playlist "${name}" created successfully!`);
    this.openPlaylistDetail(newPl);
  }

  openEditPlaylistModal(playlist = null) {
    const target = playlist || this.currentPlaylist;
    if (!target) return;
    this.editingPlaylistId = target.id;
    if (this.editPlaylistModal) {
      if (this.editPlaylistNameInput) this.editPlaylistNameInput.value = target.title || "";
      if (this.editPlaylistDescInput) this.editPlaylistDescInput.value = target.description || "";
      this.editPlaylistModal.style.display = "flex";
      setTimeout(() => this.editPlaylistNameInput?.focus(), 50);
    }
  }

  updatePlaylist(playlistId, newTitle, newDesc) {
    if (!playlistId) return;
    const pl = this.userPlaylists.find(p => p.id === playlistId);
    if (!pl) return;
    pl.title = newTitle;
    pl.description = newDesc;
    this.saveUserPlaylists();
    this.renderUserPlaylists();
    if (this.currentPlaylist && this.currentPlaylist.id === playlistId) {
      this.currentPlaylist.title = newTitle;
      this.currentPlaylist.description = newDesc;
      if (this.playlistTitleHeading) this.playlistTitleHeading.textContent = newTitle;
      if (this.playlistDescText) this.playlistDescText.textContent = newDesc || "Curated playlist.";
    }
    this.showToast(`Playlist "${newTitle}" updated successfully!`);
  }

  deletePlaylist(playlistId) {
    if (!playlistId) return;
    const plIndex = this.userPlaylists.findIndex(p => p.id === playlistId);
    if (plIndex === -1) return;
    const title = this.userPlaylists[plIndex].title || "Playlist";
    this.userPlaylists.splice(plIndex, 1);
    this.saveUserPlaylists();
    this.renderUserPlaylists();
    this.showToast(this.currentLanguage === 'id' ? `Playlist "${title}" berhasil dihapus` : `Playlist "${title}" deleted`);
    this.switchView("home");
  }

  openAddToPlaylistModal(track) {
    this.selectedTrackForPlaylist = track;
    if (this.addToPlaylistTrackTitle) {
      this.addToPlaylistTrackTitle.textContent = `Select playlist for "${track.title}":`;
    }
    if (this.modalUserPlaylistsList) {
      this.modalUserPlaylistsList.innerHTML = "";
      if (this.userPlaylists.length === 0) {
        this.modalUserPlaylistsList.innerHTML = `
          <div style="font-size: 13px; color: var(--color-text-secondary); text-align: center; padding: 16px;">
            No playlists yet. Create a new playlist now.
          </div>
        `;
      } else {
        this.userPlaylists.forEach(pl => {
          const isAlreadyIn = pl.tracks && pl.tracks.some(t => t.id === track.id);
          const item = document.createElement("div");
          item.className = "modal-playlist-item";
          item.innerHTML = `
            <div class="modal-playlist-info">
              <span class="modal-playlist-title">${this.escapeHtml(pl.title)}</span>
              <span class="modal-playlist-count">${pl.tracks ? pl.tracks.length : 0} songs</span>
            </div>
            <button class="modal-add-btn" ${isAlreadyIn ? 'disabled style="opacity: 0.5;"' : ''}>
              ${isAlreadyIn ? 'Added' : '+ Add'}
            </button>
          `;
          if (!isAlreadyIn) {
            item.querySelector('.modal-add-btn').addEventListener("click", () => {
              this.addTrackToPlaylist(pl.id, track);
              this.addToPlaylistModal.style.display = "none";
            });
          }
          this.modalUserPlaylistsList.appendChild(item);
        });
      }
    }
    if (this.addToPlaylistModal) {
      this.addToPlaylistModal.style.display = "flex";
    }
  }

  addTrackToPlaylist(playlistId, track) {
    if (!playlistId || !track) return;
    const pl = this.userPlaylists.find(p => p.id === playlistId);
    if (!pl) return;
    if (!pl.tracks) pl.tracks = [];
    if (!pl.tracks.some(t => t.id === track.id)) {
      pl.tracks.push(track);
      if (!pl.artwork_url) pl.artwork_url = track.artwork_url;
      this.saveUserPlaylists();
      this.renderUserPlaylists();
      this.showToast(`Added to "${pl.title}"`);
      if (this.currentPlaylist && this.currentPlaylist.id === pl.id) {
        this.openPlaylistDetail(pl);
      }
    } else {
      this.showToast(`Song is already in "${pl.title}"`);
    }
  }

  removeTrackFromPlaylist(playlistId, trackId) {
    if (!playlistId || !trackId) return;
    const pl = this.userPlaylists.find(p => p.id === playlistId);
    if (!pl || !pl.tracks) return;
    const tIndex = pl.tracks.findIndex(t => t.id === trackId);
    if (tIndex !== -1) {
      pl.tracks.splice(tIndex, 1);
      if (pl.tracks.length > 0) {
        pl.artwork_url = pl.tracks[0].artwork_url;
      }
      this.saveUserPlaylists();
      this.renderUserPlaylists();
      this.showToast(this.currentLanguage === 'id' ? "Lagu dihapus dari playlist" : "Song removed from playlist");
      this.openPlaylistDetail(pl);
    }
  }

  async openAlbumDetail(album) {
    if (!album) return;
    this.currentPlaylist = album;
    this.switchView("playlist");

    if (this.playlistDeleteBtn) this.playlistDeleteBtn.style.display = "none";
    if (this.playlistEditBtn) this.playlistEditBtn.style.display = "none";
    if (this.playlistLikeAlbumBtn) {
      this.playlistLikeAlbumBtn.style.display = "inline-flex";
      this.updateAlbumLikeButton(album);
    }

    const typeBadge = document.getElementById("playlistTypeBadge");
    if (typeBadge) typeBadge.textContent = "Official Album";

    this.playlistTitleHeading.textContent = album.title;
    this.playlistDescText.textContent = album.year ? `Official album by ${album.artist || 'Artist'} (${album.year})` : `Official album by ${album.artist || 'Artist'}`;
    this.playlistCoverImg.src = album.artwork_url || this.DEFAULT_TRACK_ART;
    this.playlistStatsText.textContent = "Loading album tracks...";
    this.playlistTrackList.innerHTML = `<div style="text-align: center; padding: 32px; color: var(--color-text-secondary); font-size: 13px;">Fetching official tracklist...</div>`;

    let tracks = [];
    if (album.browse_id && window.electronAPI && typeof window.electronAPI.browseYouTube === 'function') {
      try {
        const res = await window.electronAPI.browseYouTube(album.browse_id);
        if (res && res.tracks && res.tracks.length) {
          tracks = res.tracks.map((t, idx) => ({
            ...t,
            album: album.title,
            artwork_url: t.artwork_url || album.artwork_url,
            is_liked: this.likedTrackIds.has(t.id)
          }));
          if (res.avatar_url) this.playlistCoverImg.src = res.avatar_url;
          if (res.description) this.playlistDescText.textContent = res.description;
        }
      } catch (_) {}
    }

    if (!tracks.length) {
      try {
        const searchTracks = await this.queryInnerTubeSongs(`${album.artist || ''} ${album.title}`);
        if (searchTracks && searchTracks.length) tracks = searchTracks;
      } catch (_) {}
    }

    album.tracks = tracks;
    this.playlistStatsText.textContent = `${tracks.length} Songs`;
    this.renderPlaylistTracks(tracks, null);
  }

  async openPlaylistDetail(playlist) {
    if (!playlist) return;
    this.currentPlaylist = playlist;
    this.switchView("playlist");

    const isUserPl = this.userPlaylists.some(p => p.id === playlist.id);
    if (this.playlistDeleteBtn) this.playlistDeleteBtn.style.display = isUserPl ? "inline-flex" : "none";
    if (this.playlistEditBtn) this.playlistEditBtn.style.display = isUserPl ? "inline-flex" : "none";
    if (this.playlistLikeAlbumBtn) this.playlistLikeAlbumBtn.style.display = "none";

    this.playlistTitleHeading.textContent = playlist.title;
    this.playlistDescText.textContent = playlist.description || (playlist.author ? `Curated collection: ${playlist.author}` : "Curated playlist.");
    this.playlistCoverImg.src = playlist.artwork_url || (playlist.tracks?.[0]?.artwork_url) || this.DEFAULT_TRACK_ART;

    let tracks = playlist.tracks || [];

    // Only query YouTube if this is an external / online curated playlist, NOT a user custom playlist
    if (!isUserPl && playlist.browse_id && window.electronAPI && typeof window.electronAPI.browseYouTube === 'function') {
      this.playlistTrackList.innerHTML = `<div style="text-align: center; padding: 32px; color: var(--color-text-secondary); font-size: 13px;">Loading playlist tracks...</div>`;
      try {
        const res = await window.electronAPI.browseYouTube(playlist.browse_id);
        if (res && res.tracks && res.tracks.length) {
          tracks = res.tracks.map(t => ({
            ...t,
            is_liked: this.likedTrackIds.has(t.id)
          }));
          if (res.avatar_url) this.playlistCoverImg.src = res.avatar_url;
          if (res.description) this.playlistDescText.textContent = res.description;
        }
      } catch (_) {}
    }

    if (!isUserPl && !tracks.length && playlist.title) {
      try {
        const searchTracks = await this.queryInnerTubeSongs(`${playlist.title} hits`);
        if (searchTracks && searchTracks.length) tracks = searchTracks;
      } catch (_) {}
    }

    playlist.tracks = tracks;
    this.playlistStatsText.textContent = `${tracks.length} Songs`;
    this.renderPlaylistTracks(tracks, isUserPl ? playlist.id : null);
  }

  renderPlaylistTracks(tracks, userPlaylistId = null) {
    if (!this.playlistTrackList) return;
    this.playlistTrackList.innerHTML = "";

    if (!tracks || tracks.length === 0) {
      this.playlistTrackList.innerHTML = `
        <div style="text-align: center; padding: 48px 0; color: var(--color-text-secondary); font-size: 13px;">
          ${this.t("no_tracks", "No tracks in this playlist yet.")}
        </div>
      `;
      return;
    }

    if (this.playlistChunkObserver) {
      this.playlistChunkObserver.disconnect();
      this.playlistChunkObserver = null;
    }

    const CHUNK_SIZE = 50;
    let renderedCount = 0;

    const renderNextChunk = () => {
      const chunk = tracks.slice(renderedCount, renderedCount + CHUNK_SIZE);
      const fragment = document.createDocumentFragment();

      chunk.forEach((track, offset) => {
        const idx = renderedCount + offset;
        const isActive = this.tracks[this.currentTrackIndex]?.id === track.id;
        const isLiked = this.likedTrackIds.has(track.id);
        const onRemove = userPlaylistId ? () => this.removeTrackFromPlaylist(userPlaylistId, track.id) : null;
        const row = this.createTrackRow(track, idx, isActive, isLiked, () => {
          this.tracks = [...tracks];
          this.loadTrack(idx, true);
          this.showToast(`${this.t("toast_playing", "Playing")} ${track.title}`);
          this.highlightActiveSongItems();
        }, onRemove);
        fragment.appendChild(row);
      });

      renderedCount += chunk.length;

      const existingSentinel = document.getElementById("playlistScrollSentinel");
      if (existingSentinel) existingSentinel.remove();

      this.playlistTrackList.appendChild(fragment);

      if (renderedCount < tracks.length) {
        const sentinel = document.createElement("div");
        sentinel.id = "playlistScrollSentinel";
        sentinel.style.height = "24px";
        sentinel.style.width = "100%";
        this.playlistTrackList.appendChild(sentinel);

        if (!this.playlistChunkObserver) {
          this.playlistChunkObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
              renderNextChunk();
            }
          }, { rootMargin: "300px" });
        }
        this.playlistChunkObserver.observe(sentinel);
      } else if (this.playlistChunkObserver) {
        this.playlistChunkObserver.disconnect();
        this.playlistChunkObserver = null;
      }
    };

    renderNextChunk();

    // Auto-resolve real individual album covers if track has mosaic or generic artwork
    this.autoHealTrackArtworks(tracks.slice(0, 50), userPlaylistId);
  }

  autoHealTrackArtworks(tracks, userPlaylistId = null) {
    if (!tracks || !Array.isArray(tracks)) return;

    // Auto-heal explicit badges for previously imported Spotify playlists
    const missingExplicit = tracks.filter(t => t.is_explicit === undefined);
    if (missingExplicit.length > 0 && userPlaylistId && window.electronAPI && typeof window.electronAPI.importExternalPlaylist === 'function') {
      const spotMatch = tracks.find(t => t.id && t.id.startsWith('spot_'));
      if (spotMatch) {
        const spotId = spotMatch.id.split('_')[1];
        if (spotId) {
          window.electronAPI.importExternalPlaylist(`https://open.spotify.com/playlist/${spotId}`).then(res => {
            if (res && res.tracks) {
              const map = new Map(res.tracks.map(st => [(st.title || '').toLowerCase().trim(), !!st.is_explicit]));
              let updated = false;
              tracks.forEach(t => {
                const key = (t.title || '').toLowerCase().trim();
                if (map.has(key)) {
                  t.is_explicit = map.get(key);
                  updated = true;
                  const row = document.querySelector(`#track_row_${t.id} .track-row-title`);
                  if (row && t.is_explicit && !row.querySelector('.explicit-badge')) {
                    const badge = document.createElement('span');
                    badge.className = 'explicit-badge';
                    badge.title = 'Explicit';
                    badge.textContent = 'E';
                    row.appendChild(badge);
                  }
                }
              });
              if (updated) {
                this.saveUserPlaylists();
              }
            }
          }).catch(() => {});
        }
      }
    }

    const tracksToHeal = tracks.filter(t => t.artwork_url && (t.artwork_url.includes('mosaic.scdn.co') || t.artwork_url.includes('unsplash.com')));
    if (tracksToHeal.length === 0) return;

    tracksToHeal.forEach(async (t) => {
      try {
        const cleanArt = (t.artist || '').replace(/,\s*.*$/, '').trim();
        const q = encodeURIComponent(`${cleanArt} ${t.title}`.trim());
        const res = await fetch(`https://itunes.apple.com/search?term=${q}&entity=song&limit=1`);
        const json = await res.json();
        if (json && json.resultCount > 0 && json.results[0].artworkUrl100) {
          const highRes = json.results[0].artworkUrl100.replace('100x100bb', '600x600bb');
          t.artwork_url = highRes;
          const rowArt = document.querySelector(`#track_row_${t.id} .track-row-art`);
          if (rowArt) rowArt.src = highRes;
          if (this.currentTrackIndex !== -1 && this.tracks[this.currentTrackIndex]?.id === t.id) {
            this.playerArtwork.src = highRes;
            if (this.screenPlayerArtwork) this.screenPlayerArtwork.src = highRes;
          }
          if (userPlaylistId) {
            this.saveUserPlaylists();
          }
        }
      } catch (_) {}
    });
  }

  // =========================================================
  // Artist Detail Screen (Gaya Mobile Android Parallax Hero)
  // =========================================================
  async openArtistDetail(artistName, browseId = '', prefetchedBio = null) {
    if (!artistName) return;

    // Guard: never allow playlist/album IDs to be treated as artist browseId
    if (browseId && (browseId.startsWith('VL') || browseId.startsWith('PL') || browseId.startsWith('MPRE'))) {
      browseId = '';
    }

    this.currentArtist = { name: artistName, browseId };
    this.switchView("artist");

    this.artistNameHeading.textContent = artistName;
    const initialVerified = this.isArtistVerified(artistName, browseId);
    if (this.artistVerifiedBadge) {
      this.artistVerifiedBadge.style.display = initialVerified ? "inline-flex" : "none";
    }
    this.artistBioText.textContent = `Loading official profile for ${artistName}...`;
    let avatar = prefetchedBio?.avatar_url || getArtistAvatar(artistName);
    this.artistAvatarImg.src = avatar;
    this.artistHeroBanner.style.backgroundImage = `url('${avatar}')`;

    const isFollowed = this.followedArtists.has(artistName.toLowerCase().trim());
    this.artistFollowBtn.textContent = isFollowed ? "Following" : "+ Follow";
    this.artistFollowBtn.classList.toggle("active", isFollowed);

    this.artistTopTracksList.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--color-text-secondary); font-size: 13px;">Loading popular songs for ${artistName}...</div>`;
    this.artistVideosGrid.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--color-text-secondary); font-size: 13px;">Loading music videos...</div>`;
    this.artistAlbumsRow.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--color-text-secondary); font-size: 13px;">Loading album discography...</div>`;
    this.artistPeerRow.innerHTML = `<div style="color: var(--color-text-secondary); font-size: 12px; padding: 8px;">Loading similar artists...</div>`;

    try {
      let bioData = prefetchedBio;

      // 1. Resolve artist official profile & browseId if missing
      if (!bioData && !browseId && window.electronAPI && typeof window.electronAPI.resolveArtistProfile === 'function') {
        bioData = await window.electronAPI.resolveArtistProfile(artistName).catch(() => null);
        if (bioData && bioData.browse_id) {
          browseId = bioData.browse_id;
          this.currentArtist.browseId = browseId;
        }
      }

      // 2. If browseId is available and bioData doesn't have albums/videos carousels yet, fetch from browse
      if (browseId && (!bioData || !bioData.albums || !bioData.albums.length) && window.electronAPI && typeof window.electronAPI.browseYouTube === 'function') {
        const fullBrowse = await window.electronAPI.browseYouTube(browseId).catch(() => null);
        if (fullBrowse) {
          bioData = { ...(bioData || {}), ...fullBrowse };
        }
      }

      const effectiveBio = bioData;
      if (effectiveBio) {
        if (effectiveBio.name) {
          this.artistNameHeading.textContent = effectiveBio.name;
        }
        if (effectiveBio.avatar_url) {
          this.artistAvatarImg.src = effectiveBio.avatar_url;
          this.artistHeroBanner.style.backgroundImage = `url('${effectiveBio.avatar_url}')`;
          MASTER_ARTIST_AVATARS[artistName.toLowerCase().trim()] = effectiveBio.avatar_url;
          if (effectiveBio.name) {
            MASTER_ARTIST_AVATARS[effectiveBio.name.toLowerCase().trim()] = effectiveBio.avatar_url;
          }
        }
        const isVer = this.isArtistVerified(effectiveBio.name || artistName, effectiveBio.browse_id || browseId);
        if (this.artistVerifiedBadge) {
          this.artistVerifiedBadge.style.display = isVer ? "inline-flex" : "none";
        }
        if (effectiveBio.sub_label && this.artistRoleBadge) {
          this.artistRoleBadge.textContent = effectiveBio.sub_label;
        } else if (this.artistRoleBadge) {
          this.artistRoleBadge.textContent = isVer ? "Verified Artist" : "Artist";
        }
        if (effectiveBio.description) {
          this.artistBioText.textContent = effectiveBio.description;
        } else {
          this.artistBioText.textContent = `Official artist profile for ${effectiveBio.name || artistName}. Listen to their discography, music videos, and top tracks on SoraFy.`;
        }
      } else {
        this.artistBioText.textContent = `Official artist profile for ${artistName}. Listen to their discography, music videos, and top tracks on SoraFy.`;
      }

      // 3. Fallbacks for tracks, videos, albums, peers if channel didn't have all carousels
      let topSongs = (effectiveBio && effectiveBio.tracks && effectiveBio.tracks.length)
        ? effectiveBio.tracks
        : await this.queryInnerTubeSongs(`${artistName} top hits songs`);

      let videos = (effectiveBio && effectiveBio.videos && effectiveBio.videos.length)
        ? effectiveBio.videos
        : (window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function'
            ? await window.electronAPI.searchYouTubeMusic(`${artistName} official music video live`, 'video').catch(() => [])
            : []);

      let albums = (effectiveBio && effectiveBio.albums) ? [...effectiveBio.albums] : [];
      if (window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function') {
        try {
          const searchedAlbums = await window.electronAPI.searchYouTubeMusic(artistName, 'album').catch(() => []);
          if (searchedAlbums && searchedAlbums.length) {
            const normArtist = artistName.toLowerCase().trim();
            for (const sa of searchedAlbums) {
              const isMatch = (sa.artist || '').toLowerCase().includes(normArtist) || normArtist.includes((sa.artist || '').toLowerCase());
              if (isMatch && !albums.some(a => (a.browse_id && a.browse_id === sa.browse_id) || a.title.toLowerCase() === sa.title.toLowerCase())) {
                albums.push(sa);
              }
            }
          }
        } catch (_) {}
      }

      let peers = (effectiveBio && effectiveBio.peers && effectiveBio.peers.length)
        ? effectiveBio.peers
        : (window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function'
            ? await window.electronAPI.searchYouTubeMusic(`${artistName} radio mix`, 'artist').catch(() => [])
            : []);

      // Filter popular tracks: ensure authentic recordings
      const legitimate = (topSongs || []).filter(t => {
        const tArtist = (t.artist || "").toLowerCase();
        const aName = artistName.toLowerCase();
        return tArtist.includes(aName) || aName.includes(tArtist) || t.title.toLowerCase().includes(aName);
      });
      this.currentArtistTracks = legitimate.length ? legitimate : topSongs;
      this.renderArtistTopTracks(this.currentArtistTracks);

      // Render 16:9 Music Videos & Live Sessions
      this.renderArtistVideos(videos);

      // Render Albums
      this.renderArtistAlbums(albums, artistName);

      // Render Peer Artists
      this.renderArtistPeers(peers, artistName);
    } catch (e) {
      console.warn("Artist detail fetch error:", e);
    }
  }

  renderArtistTopTracks(tracks) {
    if (!this.artistTopTracksList) return;
    this.artistTopTracksList.innerHTML = "";
    if (!tracks || tracks.length === 0) {
      this.artistTopTracksList.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--color-text-secondary); font-size: 13px;">No songs found.</div>`;
      return;
    }
    const displayTracks = tracks.slice(0, 8);
    if (this.artistPopularCount) this.artistPopularCount.textContent = `${displayTracks.length} Top Songs`;

    displayTracks.forEach((track, idx) => {
      const isActive = this.tracks[this.currentTrackIndex]?.id === track.id;
      const isLiked = this.likedTrackIds.has(track.id);
      const row = this.createTrackRow(track, idx, isActive, isLiked, () => {
        this.tracks = [...displayTracks];
        this.loadTrack(idx, true);
        this.showToast(`Playing ${track.title}`);
        this.renderArtistTopTracks(displayTracks);
      });
      this.artistTopTracksList.appendChild(row);
    });
  }

  renderArtistVideos(videos) {
    if (!this.artistVideosGrid) return;
    this.artistVideosGrid.innerHTML = "";
    if (!videos || videos.length === 0) {
      this.artistVideosGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 24px; color: var(--color-text-secondary); font-size: 13px;">No music videos found.</div>`;
      if (this.artistVideoCountLabel) this.artistVideoCountLabel.textContent = "0 Videos";
      return;
    }
    const displayVideos = videos.slice(0, 6);
    if (this.artistVideoCountLabel) this.artistVideoCountLabel.textContent = `${displayVideos.length} Videos`;

    displayVideos.forEach(vid => {
      const card = document.createElement("div");
      card.className = "video-card";
      const isOfficial = vid.is_official || vid.video_badge === 'Official' || /\b(official\s*(?:music\s*)?video|video\s*musik|music\s*video|mv)\b/i.test(vid.title);
      const badgeClass = isOfficial ? "badge-official" : "badge-unofficial";
      const badgeText = isOfficial ? "Official" : (vid.video_badge || "Live / Session");

      card.innerHTML = `
        <div class="video-thumb-wrapper">
          <img src="${vid.artwork_url || `https://i.ytimg.com/vi/${vid.video_id}/hqdefault.jpg`}" class="video-thumb" alt="${this.escapeHtml(vid.title)}" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
          <div class="video-badges-row">
            <span class="${badgeClass}">${badgeText}</span>
          </div>
          <span class="video-duration-pill">${vid.duration_secs ? this.formatTime(vid.duration_secs) : ''}</span>
        </div>
        <div class="video-card-info">
          <span class="video-card-title">${this.escapeHtml(vid.title)}</span>
          <span class="video-card-artist">${this.escapeHtml(vid.artist)}</span>
        </div>
      `;

      card.addEventListener("click", () => {
        vid.is_video = true;
        this.tracks = [vid, ...this.tracks.filter(t => t.id !== vid.id)];
        this.loadTrack(0, true);
        this.switchView("player");
        this.setScreenPlayerMode("video");
        this.showToast(`Playing video: ${vid.title}`);
      });

      card.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.showContextMenu(e, vid);
      });

      this.artistVideosGrid.appendChild(card);
    });
  }

  renderArtistAlbums(albums, artistName) {
    if (!this.artistAlbumsRow) return;
    this.artistAlbumsRow.innerHTML = "";
    if (!albums || albums.length === 0) {
      this.artistAlbumsRow.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 24px; color: var(--color-text-secondary); font-size: 13px;">Album discography is being synchronized.</div>`;
      if (this.artistAlbumCountLabel) this.artistAlbumCountLabel.textContent = "0 Albums";
      return;
    }
    const displayAlbums = albums.slice(0, 36);
    if (this.artistAlbumCountLabel) this.artistAlbumCountLabel.textContent = `${displayAlbums.length} Albums & EPs`;

    displayAlbums.forEach(album => {
      const card = document.createElement("div");
      card.className = "album-card";
      card.innerHTML = `
        <div class="album-card-art-box">
          <img src="${album.artwork_url || this.DEFAULT_TRACK_ART}" class="album-card-art" alt="${this.escapeHtml(album.title)}" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
          <div class="playlist-card-play-overlay">
            <iconsax-icon name="play" type="bold" size="20" color="#000000"></iconsax-icon>
          </div>
        </div>
        <div class="album-card-title">${this.escapeHtml(album.title)}</div>
        <div class="album-card-year">${this.escapeHtml(album.album_type || 'Album')} • ${this.escapeHtml(artistName)} ${album.year ? '• ' + this.escapeHtml(album.year) : ''}</div>
      `;
      card.addEventListener("click", () => {
        this.openAlbumDetail({ ...album, artist: artistName });
      });
      this.artistAlbumsRow.appendChild(card);
    });
  }

  renderArtistPeers(peers, currentArtistName) {
    if (!this.artistPeerRow) return;
    this.artistPeerRow.innerHTML = "";
    const filteredPeers = (peers || []).filter(p => p.name && !p.name.toLowerCase().includes(currentArtistName.toLowerCase())).slice(0, 6);
    if (filteredPeers.length === 0) {
      const defaultPeers = ["Bernadya", "Tulus", "Sal Priadi", "Hindia", "Mahalini", "NIKI"].filter(n => !n.toLowerCase().includes(currentArtistName.toLowerCase()));
      defaultPeers.forEach(name => {
        const chip = document.createElement("div");
        chip.className = "peer-chip";
        chip.innerHTML = `
          <img src="${getArtistAvatar(name)}" class="peer-avatar" alt="${name}">
          <span style="font-size: 13px; font-weight: 600;">${name}</span>
        `;
        chip.addEventListener("click", () => this.openArtistDetail(name));
        this.artistPeerRow.appendChild(chip);
      });
      return;
    }

    filteredPeers.forEach(peer => {
      const chip = document.createElement("div");
      chip.className = "peer-chip";
      chip.innerHTML = `
        <img src="${peer.avatar_url || getArtistAvatar(peer.name)}" class="peer-avatar" alt="${this.escapeHtml(peer.name)}" onerror="this.src='${getArtistAvatar(peer.name)}'">
        <span style="font-size: 13px; font-weight: 600;">${this.escapeHtml(peer.name)}</span>
      `;
      chip.addEventListener("click", () => this.openArtistDetail(peer.name, peer.browse_id));
      this.artistPeerRow.appendChild(chip);
    });
  }

  // Helper for songs query
  async queryInnerTubeSongs(query) {
    let tracks = [];
    if (this.isPluginEnabled("ytmusic") && window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function') {
      try {
        const ytTracks = await window.electronAPI.searchYouTubeMusic(query, 'song');
        if (ytTracks && ytTracks.length) {
          tracks.push(...ytTracks.map(item => ({
            ...item,
            is_liked: this.likedTrackIds.has(item.id)
          })));
        }
      } catch (e) {
        console.warn("InnerTube search notice:", e);
      }
    }
    if (tracks.length < 10) {
      try {
        const extTracks = await this.fetchExternalMusic(query);
        tracks.push(...extTracks);
      } catch (_) {}
    }
    const unique = [];
    const seen = new Set();
    for (const t of tracks) {
      const k = `${t.title.toLowerCase().trim()}__${t.artist.toLowerCase().trim()}`;
      if (!seen.has(t.id) && !seen.has(k)) {
        seen.add(t.id);
        seen.add(k);
        unique.push(t);
      }
    }
    return unique;
  }

  // =========================================================
  // Top Result Card (Matching Mobile Apple Music & Spotify layout)
  // =========================================================
  renderTopResultCard(item, type, allSongs = [], allVideos = []) {
    if (!this.searchTopResultSection || !this.searchTopResultCard || !item) {
      if (this.searchTopResultSection) this.searchTopResultSection.style.display = "none";
      return;
    }

    let badgeText = "Song";
    let badgeClass = "top-result-badge";
    let badgeStyle = "";
    let title = "";
    let artistName = "";
    let extraMeta = "";
    let artworkUrl = "";
    let isArtist = false;
    let isVideo = false;
    let isAlbum = false;

    if (type === "artist") {
      isArtist = true;
      title = item.name || item.title || "";
      artistName = "Verified Artist";
      badgeText = "Artist";
      badgeStyle = "background: rgba(139, 92, 246, 0.16); color: #A78BFA;";
      artworkUrl = item.avatar_url || item.artwork_url || getArtistAvatar(title);
      extraMeta = item.sub_label || "Artist Profile";
    } else if (type === "video") {
      isVideo = true;
      title = item.title || "";
      artistName = item.artist || "Artist";
      badgeText = "Music Video";
      badgeStyle = "background: rgba(239, 68, 68, 0.16); color: #F87171;";
      artworkUrl = item.artwork_url || (item.video_id ? `https://i.ytimg.com/vi/${item.video_id}/hqdefault.jpg` : "");
      extraMeta = item.duration_secs ? this.formatTime(item.duration_secs) : '';
    } else if (type === "album") {
      isAlbum = true;
      title = item.title || "";
      artistName = item.artist || "Artist";
      badgeText = "Official Album";
      badgeStyle = "background: rgba(59, 130, 246, 0.16); color: #60A5FA;";
      artworkUrl = item.artwork_url || this.DEFAULT_TRACK_ART;
      extraMeta = item.year || item.album_type || "Official Album";
    } else {
      // Default: song
      title = item.title || "";
      artistName = item.artist || "Artist";
      badgeText = "Song";
      badgeStyle = "background: rgba(0, 229, 153, 0.14); color: #00E599;";
      artworkUrl = item.artwork_url || this.DEFAULT_TRACK_ART;
      extraMeta = item.duration_secs ? this.formatTime(item.duration_secs) : '';
    }

    this.searchTopResultCard.innerHTML = `
      <div class="top-result-backdrop" style="background-image: url('${artworkUrl}');"></div>
      <div class="top-result-gradient"></div>
      <div class="top-result-content">
        <img src="${artworkUrl}" class="top-result-art ${isArtist ? 'top-result-art-artist' : ''}" alt="${this.escapeHtml(title)}" onerror="this.src='${this.DEFAULT_TRACK_ART}'" style="${isArtist ? 'border-radius: 50%;' : ''}">
        <div class="top-result-info">
          <div class="top-result-badge-row">
            <span class="${badgeClass}" style="${badgeStyle}">
              ${isVideo ? '<iconsax-icon name="video-play" type="bold" size="13" color="#F87171"></iconsax-icon>' : ''}
              ${isArtist ? '<iconsax-icon name="star" type="bold" size="13" color="#A78BFA"></iconsax-icon>' : ''}
              ${isAlbum ? '<iconsax-icon name="music-playlist" type="bold" size="13" color="#60A5FA"></iconsax-icon>' : ''}
              ${!isVideo && !isArtist && !isAlbum ? '<iconsax-icon name="music" type="bold" size="13" color="#00E599"></iconsax-icon>' : ''}
              <span>${badgeText}</span>
            </span>
          </div>
          <div class="top-result-title" title="${this.escapeHtml(title)}">${this.escapeHtml(title)}</div>
          <div class="top-result-artist-row">
            <span class="top-result-artist-name">${this.escapeHtml(artistName)}</span>
            ${extraMeta ? `<span style="opacity: 0.5;">•</span><span class="top-result-meta">${this.escapeHtml(extraMeta)}</span>` : ''}
          </div>
        </div>
        <div class="top-result-actions">
          <button class="top-result-play-btn" id="topResultPlayBtn" title="${isArtist ? 'View Artist' : (isAlbum ? 'Open Album' : 'Play Now')}">
            ${isArtist ? '<iconsax-icon name="arrow-right" type="linear" size="24" color="#000000"></iconsax-icon>' : '<iconsax-icon name="play" type="bold" size="24" color="#000000"></iconsax-icon>'}
          </button>
        </div>
      </div>
    `;

    const handleAction = () => {
      if (isArtist) {
        this.openArtistDetail(title, item.browse_id || item.id || '');
      } else if (isAlbum) {
        this.openAlbumDetail(item);
      } else if (isVideo) {
        item.is_video = true;
        this.tracks = [item, ...(allSongs || [])];
        this.loadTrack(0, true);
        this.switchView("player");
        this.setScreenPlayerMode("video");
        this.showToast(`Playing video: ${title}`);
      } else {
        const songList = allSongs && allSongs.length ? allSongs : [item];
        this.tracks = [...songList];
        const idx = songList.findIndex(s => s.id === item.id);
        this.loadTrack(idx >= 0 ? idx : 0, true);
        this.showToast(`Playing ${title}`);
      }
    };

    this.searchTopResultCard.onclick = (e) => {
      if (e.target.closest(".top-result-artist-name") && !isArtist && item.artist) {
        this.openArtistDetail(item.artist, item.artist_browse_id || '');
        return;
      }
      handleAction();
    };

    const playBtn = this.searchTopResultCard.querySelector("#topResultPlayBtn");
    if (playBtn) {
      playBtn.onclick = (e) => {
        e.stopPropagation();
        handleAction();
      };
    }

    this.searchTopResultCard.oncontextmenu = (e) => {
      e.preventDefault();
      if (!isArtist) {
        this.showContextMenu(e, item);
      }
    };

    this.searchTopResultSection.style.display = "block";
  }

  // =========================================================
  // Multi-Type Search (Songs, Artists, Videos, Playlists)
  // =========================================================
  async searchOnlineMusic(query, filterType = 'all') {
    this.switchView("search_results");
    this.searchResultsTitle.textContent = `Search Results for "${query}"`;
    this.searchResultsCount.textContent = "Searching...";

    if (this.searchTopResultSection) this.searchTopResultSection.style.display = "none";
    if (this.searchArtistHeroSlot) this.searchArtistHeroSlot.innerHTML = "";
    this.searchArtistsSection.style.display = "none";
    if (this.searchAlbumsSection) this.searchAlbumsSection.style.display = "none";
    this.searchVideosSection.style.display = "none";
    this.searchPlaylistsSection.style.display = "none";
    this.searchSongsSection.style.display = "none";

    this.searchSongsList.innerHTML = `<div style="text-align: center; padding: 32px; color: var(--color-text-secondary); font-size: 13px;">Searching across music catalog...</div>`;

    try {
      if (filterType === 'all') {
        const [songs, rawArtists, videos, rawAlbums] = await Promise.all([
          this.queryInnerTubeSongs(query),
          window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function'
            ? window.electronAPI.searchYouTubeMusic(query, 'artist').catch(() => [])
            : Promise.resolve([]),
          window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function'
            ? window.electronAPI.searchYouTubeMusic(query, 'video').catch(() => [])
            : Promise.resolve([]),
          window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function'
            ? window.electronAPI.searchYouTubeMusic(query, 'album').catch(() => [])
            : Promise.resolve([])
        ]);

        let artists = rawArtists || [];
        // Auto-resolve official artist if no artist shelf was returned
        if (artists.length === 0 && window.electronAPI && typeof window.electronAPI.resolveArtistProfile === 'function') {
          const resolved = await window.electronAPI.resolveArtistProfile(query).catch(() => null);
          if (resolved && resolved.name && resolved.avatar_url) {
            artists = [{
              id: resolved.browse_id || ('art_' + resolved.name.toLowerCase().replace(/[^a-z0-9]/g, '_')),
              name: resolved.name,
              avatar_url: resolved.avatar_url,
              browse_id: resolved.browse_id,
              sub_label: 'Verified Artist'
            }];
          }
        }

        let total = 0;

        // Render Top Result (Apple Music & Spotify inspired, matches mobile)
        let topItem = null;
        let topType = 'song';
        const cleanQ = query.trim().toLowerCase();
        const matchedArtist = artists.find(a => {
          const an = (a.name || a.title || '').trim().toLowerCase();
          return an === cleanQ || an.startsWith(cleanQ);
        });

        if (matchedArtist) {
          topItem = matchedArtist;
          topType = 'artist';
        } else if (songs && songs.length > 0) {
          topItem = songs[0];
          topType = 'song';
        } else if (videos && videos.length > 0) {
          topItem = videos[0];
          topType = 'video';
        } else if (artists && artists.length > 0) {
          topItem = artists[0];
          topType = 'artist';
        }

        if (topItem) {
          this.renderTopResultCard(topItem, topType, songs, videos);
        } else if (this.searchTopResultSection) {
          this.searchTopResultSection.style.display = "none";
        }

        // Render Artists
        if (this.searchArtistHeroSlot) this.searchArtistHeroSlot.innerHTML = "";
        if (artists && artists.length) {
          total += artists.length;
          this.searchArtistsSection.style.display = "block";
          this.searchArtistsGrid.innerHTML = "";

          // In 'all' view, render artists cleanly as circular cards in the grid
          artists.slice(0, 6).forEach(art => {
            const card = this.createArtistCard(art);
            if (card) this.searchArtistsGrid.appendChild(card);
          });
        }

        // Render Videos (16:9)
        if (videos && videos.length) {
          total += videos.length;
          this.searchVideosSection.style.display = "block";
          this.searchVideosGrid.innerHTML = "";
          videos.slice(0, 6).forEach(vid => {
            const card = document.createElement("div");
            card.className = "video-card";
            const isOfficial = vid.is_official || vid.video_badge === 'Official' || /\b(official\s*(?:music\s*)?video|video\s*musik|music\s*video|mv)\b/i.test(vid.title);
            const badgeClass = isOfficial ? "badge-official" : "badge-unofficial";
            const badgeText = isOfficial ? "Official" : (vid.video_badge || "Live / Session");

            card.innerHTML = `
              <div class="video-thumb-wrapper">
                <img src="${vid.artwork_url || `https://i.ytimg.com/vi/${vid.video_id}/hqdefault.jpg`}" class="video-thumb" alt="${this.escapeHtml(vid.title)}" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
                <div class="video-badges-row">
                  <span class="${badgeClass}">${badgeText}</span>
                </div>
                <span class="video-duration-pill">${vid.duration_secs ? this.formatTime(vid.duration_secs) : ''}</span>
              </div>
              <div class="video-card-info">
                <span class="video-card-title">${this.escapeHtml(vid.title)}</span>
                <span class="video-card-artist">${this.escapeHtml(vid.artist)}</span>
              </div>
            `;
            card.addEventListener("click", () => {
              vid.is_video = true;
              this.tracks = [vid, ...songs];
              this.loadTrack(0, true);
              this.switchView("player");
              this.setScreenPlayerMode("video");
              this.showToast(`Playing video: ${vid.title}`);
            });
            card.addEventListener("contextmenu", (e) => {
              e.preventDefault();
              this.showContextMenu(e, vid);
            });
            this.searchVideosGrid.appendChild(card);
          });
        }

        // Render Albums (Official releases & EPs)
        if (rawAlbums && rawAlbums.length && this.searchAlbumsSection && this.searchAlbumsGrid) {
          total += rawAlbums.length;
          this.searchAlbumsSection.style.display = "block";
          this.searchAlbumsGrid.innerHTML = "";
          rawAlbums.slice(0, 8).forEach(alb => {
            const card = this.createAlbumCard(alb);
            if (card) this.searchAlbumsGrid.appendChild(card);
          });
        }

        // Render Songs
        if (songs && songs.length) {
          total += songs.length;
          this.searchSongsSection.style.display = "block";
          this.searchSongsList.innerHTML = "";
          songs.forEach((track, idx) => {
            const isActive = this.tracks[this.currentTrackIndex]?.id === track.id;
            const isLiked = this.likedTrackIds.has(track.id);
            const row = this.createTrackRow(track, idx, isActive, isLiked, () => {
              this.tracks = [...songs];
              this.loadTrack(idx, true);
              this.showToast(`Playing ${track.title}`);
            });
            this.searchSongsList.appendChild(row);
          });
        }

        this.searchResultsCount.textContent = `Found ${total} results`;
      } else if (filterType === 'song') {
        let songs = window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function'
          ? await window.electronAPI.searchYouTubeMusic(query, 'song').catch(() => [])
          : [];
        if (!songs || songs.length === 0) {
          songs = await this.queryInnerTubeSongs(query);
        }
        if (songs && songs.length > 0) {
          this.renderTopResultCard(songs[0], 'song', songs, []);
        } else if (this.searchTopResultSection) {
          this.searchTopResultSection.style.display = "none";
        }
        this.searchSongsSection.style.display = "block";
        this.searchSongsList.innerHTML = "";
        songs.forEach((track, idx) => {
          const isActive = this.tracks[this.currentTrackIndex]?.id === track.id;
          const isLiked = this.likedTrackIds.has(track.id);
          const row = this.createTrackRow(track, idx, isActive, isLiked, () => {
            this.tracks = [...songs];
            this.loadTrack(idx, true);
            this.showToast(`Playing ${track.title}`);
          });
          this.searchSongsList.appendChild(row);
        });
        this.searchResultsCount.textContent = `Found ${songs.length} songs`;
      } else if (filterType === 'artist') {
        let artists = window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function'
          ? await window.electronAPI.searchYouTubeMusic(query, 'artist').catch(() => [])
          : [];
        if ((!artists || artists.length === 0) && window.electronAPI && typeof window.electronAPI.resolveArtistProfile === 'function') {
          const resolved = await window.electronAPI.resolveArtistProfile(query).catch(() => null);
          if (resolved && resolved.name && resolved.avatar_url) {
            artists = [{
              id: resolved.browse_id || ('art_' + resolved.name.toLowerCase().replace(/[^a-z0-9]/g, '_')),
              name: resolved.name,
              avatar_url: resolved.avatar_url,
              browse_id: resolved.browse_id,
              sub_label: 'Verified Artist'
            }];
          }
        }
        if (artists && artists.length > 0) {
          this.renderTopResultCard(artists[0], 'artist', [], []);
        } else if (this.searchTopResultSection) {
          this.searchTopResultSection.style.display = "none";
        }
        if (this.searchArtistHeroSlot) this.searchArtistHeroSlot.innerHTML = "";
        this.searchArtistsSection.style.display = "block";
        this.searchArtistsGrid.innerHTML = "";
        if (!artists || artists.length === 0) {
          this.searchArtistsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 24px; color: var(--color-text-secondary); font-size: 13px;">No artists found for "${this.escapeHtml(query)}".</div>`;
        } else {
          // Top Hero Artist Card in the dedicated hero slot
          const topArt = artists[0];
          let topSongs = (topArt.top_songs && topArt.top_songs.length > 0) ? topArt.top_songs : [];
          if (topSongs.length === 0) {
            topSongs = await this.queryInnerTubeSongs(topArt.name || topArt.title || query);
          }
          const heroEl = this.renderArtistHero(topArt, topSongs);
          if (this.searchArtistHeroSlot) {
            this.searchArtistHeroSlot.appendChild(heroEl);
          }

          // Remaining artists go directly into searchArtistsGrid
          if (artists.length > 1) {
            artists.slice(1).forEach(art => {
              const card = this.createArtistCard(art);
              if (card) this.searchArtistsGrid.appendChild(card);
            });
          }
        }
        this.searchResultsCount.textContent = `Found ${artists.length} artists`;
      } else if (filterType === 'video') {
        const videos = window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function'
          ? await window.electronAPI.searchYouTubeMusic(query, 'video')
          : [];
        if (videos && videos.length > 0) {
          this.renderTopResultCard(videos[0], 'video', [], videos);
        } else if (this.searchTopResultSection) {
          this.searchTopResultSection.style.display = "none";
        }
        this.searchVideosSection.style.display = "block";
        this.searchVideosGrid.innerHTML = "";
        videos.forEach(vid => {
          const card = document.createElement("div");
          card.className = "video-card";
          const isOfficial = vid.is_official || vid.video_badge === 'Official' || /\b(official\s*(?:music\s*)?video|video\s*musik|music\s*video|mv)\b/i.test(vid.title);
          const badgeClass = isOfficial ? "badge-official" : "badge-unofficial";
          const badgeText = isOfficial ? "Official" : (vid.video_badge || "Live / Session");

          card.innerHTML = `
            <div class="video-thumb-wrapper">
              <img src="${vid.artwork_url || `https://i.ytimg.com/vi/${vid.video_id}/hqdefault.jpg`}" class="video-thumb" alt="${this.escapeHtml(vid.title)}" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
              <div class="video-badges-row">
                <span class="${badgeClass}">${badgeText}</span>
              </div>
              <span class="video-duration-pill">${vid.duration_secs ? this.formatTime(vid.duration_secs) : ''}</span>
            </div>
            <div class="video-card-info">
              <span class="video-card-title">${this.escapeHtml(vid.title)}</span>
              <span class="video-card-artist">${this.escapeHtml(vid.artist)}</span>
            </div>
          `;
          card.addEventListener("click", () => {
            vid.is_video = true;
            this.tracks = [vid];
            this.loadTrack(0, true);
            this.switchView("player");
            this.setScreenPlayerMode("video");
            this.showToast(`Playing video: ${vid.title}`);
          });
          card.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            this.showContextMenu(e, vid);
          });
          this.searchVideosGrid.appendChild(card);
        });
        this.searchResultsCount.textContent = `Found ${videos.length} videos`;
      } else if (filterType === 'album') {
        const albums = window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function'
          ? await window.electronAPI.searchYouTubeMusic(query, 'album').catch(() => [])
          : [];
        if (albums && albums.length > 0) {
          this.renderTopResultCard(albums[0], 'album', [], []);
        } else if (this.searchTopResultSection) {
          this.searchTopResultSection.style.display = "none";
        }
        if (this.searchAlbumsSection && this.searchAlbumsGrid) {
          this.searchAlbumsSection.style.display = "block";
          this.searchAlbumsGrid.innerHTML = "";
          if (!albums || albums.length === 0) {
            this.searchAlbumsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 24px; color: var(--color-text-secondary); font-size: 13px;">No albums found for "${this.escapeHtml(query)}".</div>`;
          } else {
            albums.forEach(alb => {
              const card = this.createAlbumCard(alb);
              if (card) this.searchAlbumsGrid.appendChild(card);
            });
          }
        }
        this.searchResultsCount.textContent = `Found ${albums.length} albums`;
      } else if (filterType === 'playlist') {
        if (this.searchTopResultSection) this.searchTopResultSection.style.display = "none";
        const rawPlaylists = window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function'
          ? await window.electronAPI.searchYouTubeMusic(query, 'playlist')
          : [];
        const playlists = rawPlaylists.map(p => ({
          ...p,
          author: (!p.author || p.author.toLowerCase().includes('youtube') || p.author === 'Artist') ? 'SoraFy Curated' : p.author
        }));
        this.searchPlaylistsSection.style.display = "block";
        this.searchPlaylistsGrid.innerHTML = "";
        playlists.forEach(pl => {
          const card = document.createElement("div");
          card.className = "playlist-card";
          card.innerHTML = `
            <div class="playlist-card-art-box">
              <img src="${pl.artwork_url || this.DEFAULT_TRACK_ART}" class="playlist-card-art" alt="${this.escapeHtml(pl.title)}" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
              <div class="playlist-card-play-overlay">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </div>
            </div>
            <div class="playlist-card-title">${this.escapeHtml(pl.title)}</div>
            <div class="playlist-card-author">${this.escapeHtml(pl.author)}</div>
            <div class="playlist-card-count">${this.escapeHtml(pl.track_count || 'Curated Selection')}</div>
          `;
          card.addEventListener("click", () => {
            this.openPlaylistDetail(pl);
          });
          this.searchPlaylistsGrid.appendChild(card);
        });
        this.searchResultsCount.textContent = `Found ${playlists.length} playlists`;
      }
    } catch (err) {
      console.error("Multi-type search error:", err);
      this.searchResultsCount.textContent = "Failed to load search results";
    }
  }

  async filterByCategory(category) {
    if (category === "all") {
      this.renderLoadingPlaceholder("Loading smart recommendations...");
      await this.fetchMusicfyRecommendations();
      return;
    }

    const categoryQueries = {
      pop: "pop hits 2026",
      chill: "chill acoustic lofi relaxing",
      indie: "indie pop alternative hits",
      fokus: "focus study lofi ambient beats instrumental",
      workout: "workout cardio high energy EDM pop",
      lossless: "flac lossless acoustic hi-res hits"
    };

    const query = categoryQueries[category] || `${category} hits`;
    const labels = {
      pop: "Pop Hits",
      chill: "Chill & Relaxing Lofi",
      indie: "Indie & Alternative",
      fokus: "Focus & Study",
      workout: "Workout & Energy",
      lossless: "Hi-Res Audio"
    };

    if (this.sectionTitleLabel) {
      this.sectionTitleLabel.textContent = labels[category] || `Genre: ${category}`;
    }

    this.renderLoadingPlaceholder(`Finding ${labels[category] || category} tracks...`);

    try {
      let tracks = [];
      if (window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function') {
        const res = await window.electronAPI.searchYouTubeMusic(query);
        if (res && res.length) {
          tracks = res.map(t => ({
            ...t,
            is_liked: this.likedTrackIds.has(t.id)
          }));
        }
      }
      if (!tracks.length) {
        tracks = await this.fetchExternalMusic(query);
      }

      this.tracks = tracks;
      this.renderTrackGrid(this.tracks);
      this.showToast(`Loading category: ${labels[category] || category}`);
    } catch (e) {
      console.warn("Category filter notice:", e);
    }
  }

  // =========================================================
  // Playback Control & Wave Rendering
  // =========================================================
  parseTrackArtists(track) {
    if (!track) return [];
    if (Array.isArray(track.artists) && track.artists.length > 0) {
      return track.artists.map(a => typeof a === 'string' ? { name: a, browse_id: '' } : a);
    }
    const artistStr = track.artist || "";
    if (!artistStr) return [];
    // Split collaborating artists by comma, ampersand, feat., ft., with, x
    const rawTokens = artistStr.split(/(?:,\s*|\s+&\s+|\s+(?:feat|ft)\.?\s+|\s+with\s+|\s+x\s+)/i).map(t => t.trim()).filter(Boolean);
    if (rawTokens.length > 1) {
      return rawTokens.map(name => ({
        name,
        browse_id: ''
      }));
    }
    return [{
      name: artistStr,
      browse_id: track.artist_browse_id || ''
    }];
  }

  renderBottomPlayerArtist(track) {
    if (!this.playerArtist) return;
    const artists = this.parseTrackArtists(track);
    if (!artists || artists.length === 0) {
      this.playerArtist.textContent = track ? (track.artist || "Artist") : "Select a track to play";
      return;
    }

    this.playerArtist.innerHTML = "";
    artists.forEach((art, index) => {
      const link = document.createElement("span");
      link.className = "player-artist-link";
      link.textContent = art.name;
      link.title = `View ${art.name}'s Profile`;
      link.addEventListener("click", (e) => {
        e.stopPropagation();
        this.openArtistDetail(art.name, art.browse_id || "");
      });
      this.playerArtist.appendChild(link);

      if (index < artists.length - 1) {
        const sep = document.createElement("span");
        sep.className = "player-artist-sep";
        sep.textContent = ", ";
        this.playerArtist.appendChild(sep);
      }
    });
  }

  savePlaybackSession() {
    if (!this.tracks || !this.tracks[this.currentTrackIndex]) return;
    const currentTrack = this.tracks[this.currentTrackIndex];
    const currentTime = Math.max(0, this.audio ? (this.audio.currentTime || 0) : 0);
    const duration = (this.audio && this.audio.duration && !isNaN(this.audio.duration))
      ? this.audio.duration
      : (currentTrack.duration_secs || 0);

    const session = {
      track: currentTrack,
      currentTrackIndex: this.currentTrackIndex,
      currentTime: currentTime,
      duration: duration,
      queue: this.tracks.slice(0, 50),
      savedAt: Date.now()
    };

    try {
      localStorage.setItem("sorafy_last_playback_session", JSON.stringify(session));
    } catch (_) {}

    if (window.electronAPI && typeof window.electronAPI.savePlaybackSession === "function") {
      window.electronAPI.savePlaybackSession(session).catch(() => {});
    }
  }

  async restorePlaybackSession() {
    let session = null;

    // 1. Try reading from Electron disk persistence
    if (window.electronAPI && typeof window.electronAPI.loadPlaybackSession === "function") {
      try {
        session = await window.electronAPI.loadPlaybackSession();
      } catch (e) {
        console.warn("loadPlaybackSession error:", e);
      }
    }

    // 2. Fallback to localStorage if disk read returned null
    if (!session || !session.track) {
      try {
        const localRaw = localStorage.getItem("sorafy_last_playback_session");
        if (localRaw) session = JSON.parse(localRaw);
      } catch (_) {}
    }

    if (!session || !session.track) return false;

    this.hasRestoredSession = true;

    // Refresh expired GoogleVideo stream URLs if saved session is older than 45 minutes
    if (session.savedAt && (Date.now() - session.savedAt > 2700000)) {
      if (session.track) {
        session.track.stream_url = null;
        session.track.is_full_stream = false;
      }
      if (Array.isArray(session.queue)) {
        session.queue.forEach(t => {
          t.stream_url = null;
          t.is_full_stream = false;
        });
      }
    }

    // Restore queue and track index
    if (Array.isArray(session.queue) && session.queue.length > 0) {
      this.tracks = session.queue;
      this.currentTrackIndex = (typeof session.currentTrackIndex === "number" && session.currentTrackIndex < this.tracks.length)
        ? session.currentTrackIndex
        : 0;
    } else {
      this.tracks = [session.track];
      this.currentTrackIndex = 0;
    }

    const startPos = (typeof session.currentTime === "number" && session.currentTime > 0)
      ? session.currentTime
      : 0;

    await this.loadTrack(this.currentTrackIndex, false, startPos);
    return true;
  }

  async loadTrack(index, autoPlay = true, startPosition = 0) {
    this.currentTrackIndex = index;
    const track = this.tracks[index];
    if (!track) return;

    this.isNextTrackPreloaded = false;

    if (!track.video_id && track.id && track.id.startsWith("yt_")) {
      track.video_id = track.id.replace(/^yt_/, "");
    }

    this.playerTitle.innerHTML = `
      <span class="title-text">${this.escapeHtml(track.title)}</span>
      ${track.is_explicit ? '<span class="explicit-badge" title="Explicit">E</span>' : ''}
    `;
    this.renderBottomPlayerArtist(track);
    this.playerArtwork.src = track.artwork_url;
    if (this.playerBadge) {
      this.playerBadge.textContent = track.audio_format?.codec || "Opus HD";
    }
    if (this.playerSourceTag) {
      this.playerSourceTag.textContent = "";
    }

    // Set initial display times immediately
    const initialPos = startPosition > 0 ? startPosition : 0;
    this.currentTimeLabel.textContent = this.formatTime(initialPos);
    this.durationLabel.textContent = track.duration_secs ? this.formatTime(track.duration_secs) : "--:--";
    if (this.screenPlayerCurrentTime) this.screenPlayerCurrentTime.textContent = this.formatTime(initialPos);
    if (this.screenPlayerDuration) this.screenPlayerDuration.textContent = track.duration_secs ? this.formatTime(track.duration_secs) : "--:--";

    if (startPosition > 0 && track.duration_secs && track.duration_secs > 0) {
      const initialPct = Math.min(100, (startPosition / track.duration_secs) * 100);
      if (this.playerSeekbar) {
        this.playerSeekbar.value = initialPct;
        this.playerSeekbar.style.background = `linear-gradient(to right, #00E599 0%, #00E599 ${initialPct}%, rgba(255, 255, 255, 0.16) ${initialPct}%, rgba(255, 255, 255, 0.16) 100%)`;
      }
      if (this.screenPlayerSeekbar) {
        this.screenPlayerSeekbar.value = initialPct;
        this.screenPlayerSeekbar.style.background = `linear-gradient(to right, #00E599 0%, #00E599 ${initialPct}%, rgba(255, 255, 255, 0.16) ${initialPct}%, rgba(255, 255, 255, 0.16) 100%)`;
      }
    }

    // Synchronize Screen Player immediately
    this.updateScreenPlayer();
    this.highlightActiveSongItems();

    // Record listening taste affinity for persistent "se-genre & se-kultur" profile
    this.recordTasteAffinity(track);

    if (!track.video_id && track.id && track.id.startsWith("yt_")) {
      track.video_id = track.id.replace(/^yt_/, "");
    }

    // Spotify/Apple Music Instant Stream: Skip network resolver if already preloaded or cached
    if (window.electronAPI && typeof window.electronAPI.resolveFullStream === 'function' && (!track.is_full_stream || !track.stream_url)) {
      try {
        const full = await window.electronAPI.resolveFullStream({
          title: track.title,
          artist: track.artist,
          videoId: track.video_id,
          isVideo: !!track.is_video
        });
        if (full && full.url) {
          track.fallback_url = track.stream_url;
          track.stream_url = full.url;
          track.is_full_stream = true;
          if (full.videoId) {
            track.video_id = full.videoId;
          }
          if (full.duration && full.duration > 0) {
            track.duration_secs = full.duration;
            this.durationLabel.textContent = this.formatTime(full.duration);
            if (this.screenPlayerDuration) this.screenPlayerDuration.textContent = this.formatTime(full.duration);
            const activeDurEl = document.querySelector('.track-row.active .track-row-duration, .ytm-song-item.active .ytm-song-duration');
            if (activeDurEl) activeDurEl.textContent = this.formatTime(full.duration);
          }
          let codecName = full.provider || (full.mimeType?.includes("mp4") ? "AAC 320k" : "Opus HD");
          if (codecName.includes("yt-dlp") || codecName.includes("YouTube Direct")) {
            codecName = "Opus HD";
          }
          track.audio_format = track.audio_format || {};
          track.audio_format.codec = codecName;
          track.audio_format.bitrate_kbps = Math.round((full.bitrate || 320000) / 1000);
          if (this.playerBadge) this.playerBadge.textContent = track.audio_format.codec;
          if (this.screenPlayerBadge) this.screenPlayerBadge.textContent = track.audio_format.codec;

          // Update individual artwork if track currently has playlist mosaic or placeholder
          const fullArt = full.artwork_url || (full.videoId ? `https://i.ytimg.com/vi/${full.videoId}/hqdefault.jpg` : null);
          if (fullArt && (!track.artwork_url || track.artwork_url.includes('mosaic.scdn.co') || track.artwork_url.includes('unsplash.com'))) {
            track.artwork_url = fullArt;
            this.playerArtwork.src = fullArt;
            if (this.screenPlayerArtwork) this.screenPlayerArtwork.src = fullArt;
            const rowArt = document.querySelector(`#track_row_${track.id} .track-row-art`);
            if (rowArt) rowArt.src = fullArt;
            if (this.currentPlaylist && Array.isArray(this.currentPlaylist.tracks)) {
              this.saveUserPlaylists();
            }
          }
        }
      } catch (err) {
        console.warn("Full stream resolver notice:", err);
      }
    }

    if (!track.stream_url) {
      this.showToast("Failed to load audio stream for this track");
      return;
    }

    this.audio.src = track.stream_url;
    this.audio.load();

    if (startPosition > 0) {
      const applyRestoredSeek = () => {
        try {
          if (this.audio && !isNaN(this.audio.duration) && this.audio.duration > 0) {
            this.audio.currentTime = Math.min(startPosition, Math.max(0, this.audio.duration - 1));
          } else {
            this.audio.currentTime = startPosition;
          }
          this.onTimeUpdate();
        } catch (e) {
          console.warn("Restore seek position notice:", e);
        }
      };

      this.audio.addEventListener("loadedmetadata", applyRestoredSeek, { once: true });
      this.audio.addEventListener("canplay", applyRestoredSeek, { once: true });
    }

    this.updateLikeButton();
    this.updateLyricsOffsetUI();

    // Record into history
    this.recordPlayHistory(track);

    // Fetch dynamic LRCLIB Synced Karaoke Lyrics
    this.fetchTrackLyrics(track);

    // OS Native Media Session API (Windows SMTC / macOS Control Center / Linux MPRIS)
    this.updateMediaSession(track);

    // Desktop Notification on Track Change
    if (window.electronAPI && typeof window.electronAPI.showTrackNotification === 'function') {
      window.electronAPI.showTrackNotification({
        title: track.title,
        artist: track.artist,
        album: track.album || 'SoraFy Music',
        artwork_url: track.artwork_url
      });
    }

    // Discord Rich Presence
    this.updateDiscordPresence(track);

    // Update responsive drag-and-drop queue
    this.renderQueue();

    // YouTube Music Automix: proactively ensure upcoming queue has matching recommended tracks
    this.isUpcomingQueueTriggeredForCurrent = false;
    setTimeout(() => this.ensureUpcomingQueue(), 1200);

    if (autoPlay) {
      this.ensureAudioContextActive();
      if (this.appSettings && this.appSettings.crossfadeDuration > 0) {
        this.fadeInAudio(this.appSettings.crossfadeDuration);
      }
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.updatePlayPauseIcon();
        if (this.currentView === "player" && (track.is_video || this.currentScreenMode === "video")) {
          this.setScreenPlayerMode("video");
        }
        // Spotify Preload Hook: resolve and buffer next track in background after 1s
        setTimeout(() => this.preloadNextTrack(), 1000);
      }).catch(async (err) => {
        console.warn("Audio autoplay notice:", err);
        if (track.fallback_url && track.fallback_url !== track.stream_url) {
          try {
            this.audio.src = track.fallback_url;
            this.audio.load();
            if (startPosition > 0) {
              this.audio.currentTime = startPosition;
            }
            await this.audio.play();
            this.isPlaying = true;
            this.updatePlayPauseIcon();
            setTimeout(() => this.preloadNextTrack(), 1000);
            return;
          } catch (e2) {}
        }
        this.isPlaying = false;
        this.updatePlayPauseIcon();
        this.showToast("Unable to play audio");
      });
    } else {
      this.isPlaying = false;
      this.updatePlayPauseIcon();
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    }
  }

  // =========================================================
  // Spotify / Apple Music Instant Playback Preload Engine
  // =========================================================
  preloadNextTrack() {
    if (!this.tracks || this.tracks.length <= 1) return;
    let nextIdx;
    if (this.isShuffled) {
      nextIdx = Math.floor(Math.random() * this.tracks.length);
    } else {
      nextIdx = (this.currentTrackIndex + 1) % this.tracks.length;
    }

    const nextTrack = this.tracks[nextIdx];
    if (!nextTrack) return;
    this.preloadedTrackIndex = nextIdx;

    if (window.electronAPI && typeof window.electronAPI.resolveFullStream === 'function' && (!nextTrack.is_full_stream || !nextTrack.stream_url)) {
      if (nextTrack._isResolvingStream) return;
      nextTrack._isResolvingStream = true;

      if (!nextTrack.video_id && nextTrack.id && nextTrack.id.startsWith("yt_")) {
        nextTrack.video_id = nextTrack.id.replace(/^yt_/, "");
      }

      window.electronAPI.resolveFullStream({
        title: nextTrack.title,
        artist: nextTrack.artist,
        videoId: nextTrack.video_id,
        isVideo: !!nextTrack.is_video
      }).then(full => {
        nextTrack._isResolvingStream = false;
        if (full && full.url) {
          nextTrack.fallback_url = nextTrack.stream_url;
          nextTrack.stream_url = full.url;
          nextTrack.is_full_stream = true;
          if (full.videoId) nextTrack.video_id = full.videoId;
          if (full.duration) nextTrack.duration_secs = full.duration;

          let codecName = full.provider || (full.mimeType?.includes("mp4") ? "AAC 320k" : "Opus HD");
          if (codecName.includes("yt-dlp") || codecName.includes("YouTube Direct")) {
            codecName = "Opus HD";
          }
          nextTrack.audio_format = nextTrack.audio_format || {};
          nextTrack.audio_format.codec = codecName;
          nextTrack.audio_format.bitrate_kbps = Math.round((full.bitrate || 320000) / 1000);

          this.warmupAudioBuffer(full.url);
        }
      }).catch(err => {
        nextTrack._isResolvingStream = false;
      });
    } else if (nextTrack.stream_url) {
      this.warmupAudioBuffer(nextTrack.stream_url);
    }
  }

  warmupAudioBuffer(url) {
    if (!url) return;
    try {
      if (!this.preloadAudio) {
        this.preloadAudio = new Audio();
        this.preloadAudio.preload = "auto";
        this.preloadAudio.volume = 0;
      }
      if (this.preloadAudio.src !== url) {
        this.preloadAudio.src = url;
        this.preloadAudio.load();
      }
    } catch (_) {}
  }

  preloadTopTracks(tracksList) {
    if (!tracksList || !Array.isArray(tracksList)) return;
    const targets = tracksList.slice(0, 2);
    targets.forEach(t => {
      if (t && !t.is_full_stream && !t._isResolvingStream && window.electronAPI && typeof window.electronAPI.resolveFullStream === 'function') {
        t._isResolvingStream = true;
        if (!t.video_id && t.id && t.id.startsWith("yt_")) {
          t.video_id = t.id.replace(/^yt_/, "");
        }
        window.electronAPI.resolveFullStream({
          title: t.title,
          artist: t.artist,
          videoId: t.video_id,
          isVideo: !!t.is_video
        }).then(full => {
          t._isResolvingStream = false;
          if (full && full.url) {
            t.fallback_url = t.stream_url;
            t.stream_url = full.url;
            t.is_full_stream = true;
            if (full.videoId) t.video_id = full.videoId;
            if (full.duration) t.duration_secs = full.duration;
          }
        }).catch(() => {
          t._isResolvingStream = false;
        });
      }
    });
  }

  async fetchTrackLyrics(track) {
    // If track already has pre-embedded lyrics
    if (track.lyrics && track.lyrics.length > 0) {
      this.loadLyrics(track.lyrics);
      return;
    }

    this.lyricsContainer.innerHTML = `
      <div style="color: var(--color-brand-primary); text-align: center; margin-top: 40px; font-size: 13px;">
        Searching for synchronized lyrics...
      </div>
    `;

    try {
      let cleanTitle = (track.title || "")
        .replace(/\s*\(remastered.*?\)/gi, '')
        .replace(/\s*\[remastered.*?\]/gi, '')
        .replace(/\s*\(official.*?\)/gi, '')
        .replace(/\s*\[official.*?\]/gi, '')
        .replace(/\s*\(video.*?\)/gi, '')
        .replace(/\s*\(audio.*?\)/gi, '')
        .replace(/\s*\(live.*?\)/gi, '')
        .replace(/\(.*?\)|\[.*?\]/g, '')
        .trim();

      let cleanArtist = (track.artist || "")
        .replace(/\s*\(.*?\)/g, '')
        .replace(/\s*-\s*topic/gi, '')
        .replace(/,\s*feat\..*/gi, '')
        .replace(/\s*feat\..*/gi, '')
        .trim();

      let data = null;

      // 1. Try LRCLIB exact match with duration tolerance validation
      try {
        const exactUrl = `https://lrclib.net/api/get?track_name=${encodeURIComponent(cleanTitle)}&artist_name=${encodeURIComponent(cleanArtist)}`;
        const res = await fetch(exactUrl);
        if (res.ok) {
          const candidate = await res.json();
          if (!track.duration_secs || !candidate.duration || Math.abs(candidate.duration - track.duration_secs) <= 8) {
            data = candidate;
          }
        }
      } catch (_) {}

      // 2. If not found or duration mismatched, try LRCLIB search by artist + title
      if (!data || (!data.syncedLyrics && !data.plainLyrics)) {
        try {
          const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(cleanArtist + ' ' + cleanTitle)}`;
          const searchRes = await fetch(searchUrl);
          if (searchRes.ok) {
            const list = await searchRes.json();
            if (Array.isArray(list) && list.length > 0) {
              let validCandidates = list;
              if (track.duration_secs) {
                validCandidates = list.filter(item => !item.duration || Math.abs(item.duration - track.duration_secs) <= 8);
              }
              if (validCandidates.length > 0) {
                data = validCandidates.find(item => item.syncedLyrics) || validCandidates[0];
              }
            }
          }
        } catch (_) {}
      }

      // 3. Official YouTube Music lyrics fallback via Electron Main
      if (!data || (!data.syncedLyrics && !data.plainLyrics)) {
        const videoId = track.video_id || (track.id && track.id.startsWith("yt_") ? track.id.replace(/^yt_/, "") : null);
        if (window.electronAPI && typeof window.electronAPI.fetchYouTubeLyrics === 'function' && videoId) {
          try {
            const ytLyrics = await window.electronAPI.fetchYouTubeLyrics(videoId);
            if (ytLyrics && ytLyrics.plainLyrics) {
              data = {
                plainLyrics: ytLyrics.plainLyrics,
                source: ytLyrics.source || "Official Synced"
              };
            }
          } catch (_) {}
        }
      }

      // 4. Fallback to NetEase Cloud Music if still not found
      if (!data || (!data.syncedLyrics && !data.plainLyrics)) {
        try {
          const nRes = await fetch(`https://music.163.com/api/search/get/web?csrf_token=type=1&offset=0&total=true&limit=1&s=${encodeURIComponent(cleanArtist + ' ' + cleanTitle)}`);
          if (nRes.ok) {
            const nJson = await nRes.json();
            const songId = nJson?.result?.songs?.[0]?.id;
            if (songId) {
              const lrcRes = await fetch(`https://music.163.com/api/song/lyric?os=pc&id=${songId}&lv=-1&kv=-1&tv=-1`);
              if (lrcRes.ok) {
                const lrcJson = await lrcRes.json();
                const lrcStr = lrcJson?.lrc?.lyric;
                if (lrcStr) {
                  data = { syncedLyrics: lrcStr };
                }
              }
            }
          }
        } catch (_) {}
      }

      if (data && data.syncedLyrics) {
        const parsed = parseLrc(data.syncedLyrics);
        track.lyrics = parsed;
        this.loadLyrics(parsed);
        return;
      } else if (data && data.plainLyrics) {
        const plainLines = data.plainLyrics.split("\n")
          .map(t => ({ text: t.trim(), timestamp_ms: -1 }))
          .filter(l => l.text.length > 0);
        track.lyrics = plainLines;
        this.loadLyrics(plainLines);
        return;
      }
    } catch (e) {
      console.warn("Lyrics fetch notice:", e);
    }

    this.lyricsContainer.innerHTML = `
      <div style="color: var(--color-text-tertiary); text-align: center; margin-top: 40px;">
        Lyrics are not available for this track.
      </div>
    `;
  }

  recordPlayHistory(track) {
    this.historyTracks = this.historyTracks.filter(t => t.id !== track.id);
    this.historyTracks.unshift({
      id: track.id,
      title: track.title,
      artist: track.artist,
      artwork_url: track.artwork_url,
      stream_url: track.stream_url,
      audio_format: track.audio_format,
      source_label: track.source_label,
      played_at: Date.now()
    });
    if (this.historyTracks.length > 50) this.historyTracks.pop();
    localStorage.setItem("sorafy_history", JSON.stringify(this.historyTracks));

    // Dynamically refresh recommended albums to reflect newly played artists
    if (this.currentView === 'home' || !this.currentView) {
      if (this._albumRecDebounce) clearTimeout(this._albumRecDebounce);
      this._albumRecDebounce = setTimeout(() => {
        this.fetchYtmNewReleases();
      }, 5000);
    }
  }

  showLikedSongs() {
    const saved = JSON.parse(localStorage.getItem("sorafy_liked_tracks") || "[]");
    const currentLiked = this.tracks.filter(t => this.likedTrackIds.has(t.id));
    const map = new Map();
    saved.forEach(t => map.set(t.id, t));
    currentLiked.forEach(t => map.set(t.id, t));
    const liked = Array.from(map.values()).filter(t => this.likedTrackIds.has(t.id));

    this.sectionTitleLabel.textContent = `Liked Songs (${liked.length})`;
    if (liked.length === 0) {
      this.trackGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px 0; color: var(--color-text-secondary); font-size: 13px;">
          <div style="margin-bottom: 12px;"><iconsax-icon name="heart" type="bold" size="32" color="#EF4444"></iconsax-icon></div>
          No liked songs yet. Click the heart icon on any song to save it here.
        </div>
      `;
    } else {
      this.tracks = liked;
      this.renderTrackGrid(liked);
    }
  }

  showHistory() {
    this.sectionTitleLabel.textContent = `Listening History (${this.historyTracks.length})`;
    if (this.historyTracks.length === 0) {
      this.trackGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px 0; color: var(--color-text-secondary);">
          No listening history yet.
        </div>
      `;
    } else {
      this.renderTrackGrid(this.historyTracks);
    }
  }

  updateLikeButton() {
    const current = this.tracks[this.currentTrackIndex];
    const isLiked = current && this.likedTrackIds.has(current.id);
    if (this.likeBtn) {
      this.likeBtn.classList.toggle("liked", !!isLiked);
      this.likeBtn.innerHTML = `<iconsax-icon name="heart" type="${isLiked ? 'bold' : 'linear'}" size="20" color="${isLiked ? '#00E599' : 'currentColor'}"></iconsax-icon>`;
    }

    if (this.screenPlayerLikeBtn) {
      this.screenPlayerLikeBtn.classList.toggle("liked", !!isLiked);
      this.screenPlayerLikeBtn.innerHTML = `<iconsax-icon name="heart" type="${isLiked ? 'bold' : 'linear'}" size="22" color="${isLiked ? '#00E599' : 'currentColor'}"></iconsax-icon>`;
    }
  }

  togglePlayPause() {
    this.ensureAudioContextActive();
    if (this.isPlaying) {
      this.audio.pause();
      if (this.screenPlayerNativeVideo && !this.screenPlayerNativeVideo.paused) {
        this.screenPlayerNativeVideo.pause();
      }
      this.isPlaying = false;
      this.updatePlayPauseIcon();
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
      const cur = this.tracks[this.currentTrackIndex];
      if (cur) this.updateDiscordPresence(cur);
    } else {
      if (!this.audio.src || this.audio.error) {
        this.loadTrack(this.currentTrackIndex, true);
        return;
      }
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.updatePlayPauseIcon();
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
        const cur = this.tracks[this.currentTrackIndex];
        if (cur) this.updateDiscordPresence(cur);
        if (this.currentScreenMode === "video" && this.screenPlayerNativeVideo && this.screenPlayerNativeVideo.src) {
          if (this.screenPlayerNativeVideo.paused) {
            this.screenPlayerNativeVideo.play().catch(() => {});
          }
        }
      }).catch(async (err) => {
        console.warn("Audio play error, reloading track:", err);
        try {
          await this.loadTrack(this.currentTrackIndex, true);
        } catch (e2) {
          this.isPlaying = false;
          this.updatePlayPauseIcon();
          if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
          this.showToast("Unable to play audio");
        }
      });
    }
  }

  updatePlayPauseIcon() {
    const iconName = this.isPlaying ? "pause" : "play";
    if (this.playPauseIcon) {
      this.playPauseIcon.setAttribute("name", iconName);
    }
    if (this.screenPlayerPlayPauseIcon) {
      this.screenPlayerPlayPauseIcon.setAttribute("name", iconName);
    }
    if (this.videoOverlayCenterPlayIcon) {
      this.videoOverlayCenterPlayIcon.setAttribute("name", iconName);
    }
  }

  async playNext() {
    if (!this.tracks || this.tracks.length === 0) return;

    if (this.appSettings && this.appSettings.crossfadeDuration > 0 && this.isPlaying) {
      await this.fadeOutAudio(Math.min(1.2, this.appSettings.crossfadeDuration));
    }

    // YouTube Music Automix: proactively fetch more tracks if at or near the end of the queue
    const upcomingCount = Math.max(0, this.tracks.length - 1 - this.currentTrackIndex);
    if (upcomingCount <= 1) {
      await this.ensureUpcomingQueue();
    }

    if (this.currentTrackIndex < this.tracks.length - 1) {
      if (this.isShuffled) {
        // Smart Shuffle: pick from remaining upcoming tracks rather than repeating past tracks
        const remaining = this.tracks.length - 1 - this.currentTrackIndex;
        if (remaining > 1) {
          const randomOffset = Math.floor(Math.random() * remaining) + 1;
          const nextIdx = this.currentTrackIndex + randomOffset;
          const targetTrack = this.tracks.splice(nextIdx, 1)[0];
          this.tracks.splice(this.currentTrackIndex + 1, 0, targetTrack);
        }
        this.loadTrack(this.currentTrackIndex + 1, true);
      } else {
        this.loadTrack(this.currentTrackIndex + 1, true);
      }
    } else {
      this.loadTrack(0, true);
    }
  }

  playPrevious() {
    if (!this.tracks || this.tracks.length === 0) return;
    // Friendly UX: if song has played > 3 seconds, replay from start first
    if (this.audio && this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }
    const prevIdx = this.currentTrackIndex > 0 ? this.currentTrackIndex - 1 : 0;
    this.loadTrack(prevIdx, true);
  }

  onTrackEnded() {
    if (this.isSleepTimerAtTrackEnd) {
      this.pause();
      this.setSleepTimer(0);
      this.showToast("Sleep timer ended. Playback paused.");
      return;
    }
    if (this.repeatMode === 2) {
      this.audio.currentTime = 0;
      this.audio.play();
    } else {
      this.playNext();
    }
  }

  onTimeUpdate() {
    const current = this.audio.currentTime || 0;
    const total = this.audio.duration || this.tracks[this.currentTrackIndex]?.duration_secs || 1;
    const pct = total > 0 ? (current / total) * 100 : 0;

    // Periodically persist playback session state (throttled every 3 seconds)
    const now = Date.now();
    if (!this._lastSessionSave || (now - this._lastSessionSave > 3000)) {
      this._lastSessionSave = now;
      this.savePlaybackSession();
    }

    // YT Music Background Autoplay Preload: when 70% completed, ensure next radio tracks
    if (pct > 70 && !this.isUpcomingQueueTriggeredForCurrent) {
      this.isUpcomingQueueTriggeredForCurrent = true;
      this.ensureUpcomingQueue();
    }

    this.currentTimeLabel.textContent = this.formatTime(current);
    this.durationLabel.textContent = this.formatTime(total);

    if (this.playerSeekbar && !this.isSeekingBottom) {
      this.playerSeekbar.value = pct;
      this.playerSeekbar.style.background = `linear-gradient(to right, #00E599 0%, #00E599 ${pct}%, rgba(255, 255, 255, 0.16) ${pct}%, rgba(255, 255, 255, 0.16) 100%)`;
    }

    if (this.screenPlayerCurrentTime) this.screenPlayerCurrentTime.textContent = this.formatTime(current);
    if (this.screenPlayerDuration) this.screenPlayerDuration.textContent = this.formatTime(total);

    if (this.screenPlayerSeekbar && !this.isSeekingScreen) {
      this.screenPlayerSeekbar.value = pct;
      this.screenPlayerSeekbar.style.background = `linear-gradient(to right, #00E599 0%, #00E599 ${pct}%, rgba(255, 255, 255, 0.16) ${pct}%, rgba(255, 255, 255, 0.16) 100%)`;
    }

    if (this.currentScreenMode === "video" && this.screenPlayerNativeVideo && this.screenPlayerNativeVideo.src && !this.screenPlayerNativeVideo.paused) {
      if (Math.abs(this.screenPlayerNativeVideo.currentTime - current) > 1.0) {
        this.screenPlayerNativeVideo.currentTime = current;
      }
    }

    if (this.videoOverlayCurrentTime) this.videoOverlayCurrentTime.textContent = this.formatTime(current);
    if (this.videoOverlayDuration) this.videoOverlayDuration.textContent = this.formatTime(total);
    if (this.videoOverlayProgressFill) {
      this.videoOverlayProgressFill.style.width = `${pct}%`;
    }

    this.syncLyrics(Math.max(0, (current * 1000) + this.getCurrentTrackLyricsOffset()));

    // Spotify-Style Instant Playback: Trigger preload of the next track when 6s into song or 25s left
    if ((current > 6 || (total > 30 && total - current < 25)) && !this.isNextTrackPreloaded) {
      this.isNextTrackPreloaded = true;
      this.preloadNextTrack();
    }
  }

  formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Synchronized Glowing Karaoke Lyrics with Notes-App Search Architecture
  loadLyrics(lyrics) {
    this.currentLyrics = lyrics;
    this.lyricsContainer.innerHTML = "";
    this.lyricsLineElements = [];
    this.activeLyricIndex = -1;

    if (!lyrics || lyrics.length === 0) {
      this.lyricsContainer.innerHTML = `<div style="color: var(--color-text-tertiary); text-align: center; margin-top: 40px;">No synchronized lyrics available for this track.</div>`;
      if (this.lyricsSearchToggleBtn) this.lyricsSearchToggleBtn.style.display = "none";
      if (this.isLyricsSearchOpen) this.closeLyricsSearch();
      return;
    }

    if (this.lyricsSearchToggleBtn && this.activeSideTab === "lyrics") {
      this.lyricsSearchToggleBtn.style.display = "flex";
    }

    lyrics.forEach((line, idx) => {
      const p = document.createElement("p");
      p.className = "lyric-line";
      p.textContent = line.text;
      p.dataset.time = line.timestamp_ms;
      p.dataset.index = idx;
      p.addEventListener("click", () => {
        if (typeof line.timestamp_ms === "number" && line.timestamp_ms >= 0) {
          this.audio.currentTime = line.timestamp_ms / 1000;
        }
      });
      this.lyricsContainer.appendChild(p);
      this.lyricsLineElements.push(p);
    });

    // If search is currently active and query exists, re-apply search to new lyrics
    if (this.isLyricsSearchOpen && this.lyricsSearchInput && this.lyricsSearchInput.value.trim()) {
      this.searchLyrics(this.lyricsSearchInput.value);
    }
  }

  syncLyrics(currentMs) {
    if (!this.currentLyrics || this.currentLyrics.length === 0) return;

    let activeIdx = -1;
    for (let i = 0; i < this.currentLyrics.length; i++) {
      if (typeof this.currentLyrics[i].timestamp_ms === "number" && this.currentLyrics[i].timestamp_ms >= 0 && currentMs >= this.currentLyrics[i].timestamp_ms) {
        activeIdx = i;
      } else if (typeof this.currentLyrics[i].timestamp_ms === "number" && this.currentLyrics[i].timestamp_ms >= 0 && currentMs < this.currentLyrics[i].timestamp_ms) {
        break;
      }
    }

    if (activeIdx !== this.activeLyricIndex) {
      this.activeLyricIndex = activeIdx;
      const lines = this.lyricsLineElements.length > 0 ? this.lyricsLineElements : this.lyricsContainer.querySelectorAll(".lyric-line");
      lines.forEach((l, idx) => {
        if (idx === activeIdx) {
          l.classList.add("active");
          // Non-destructive playback follow decoupling:
          // When search is active, suspend auto-scroll follow so user can browse search results calmly.
          if (!this.isLyricsSearchOpen) {
            l.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else {
          l.classList.remove("active");
        }
      });
    }
  }

  getCurrentTrackLyricsOffset() {
    const cur = this.tracks[this.currentTrackIndex];
    if (!cur) return 0;
    const key = cur.id || (cur.artist + ' - ' + cur.title);
    return this.lyricsOffsets[key] || 0;
  }

  updateLyricsOffsetUI() {
    if (!this.lyricsOffsetBadge) return;
    const offsetMs = this.getCurrentTrackLyricsOffset();
    const secs = (offsetMs / 1000).toFixed(1);
    this.lyricsOffsetBadge.textContent = `${offsetMs > 0 ? '+' : ''}${secs}s`;
    this.lyricsOffsetBadge.classList.toggle("calibrated", offsetMs !== 0);
  }

  adjustLyricsOffset(deltaMs) {
    const cur = this.tracks[this.currentTrackIndex];
    if (!cur) return;
    const key = cur.id || (cur.artist + ' - ' + cur.title);
    const currentOffset = this.lyricsOffsets[key] || 0;
    const newOffset = Math.max(-10000, Math.min(10000, currentOffset + deltaMs));
    if (newOffset === 0) {
      delete this.lyricsOffsets[key];
    } else {
      this.lyricsOffsets[key] = newOffset;
    }
    localStorage.setItem("sorafy_lyrics_offsets", JSON.stringify(this.lyricsOffsets));
    this.updateLyricsOffsetUI();
    const sign = newOffset > 0 ? "+" : "";
    this.showToast(`Lyrics offset set to ${sign}${(newOffset / 1000).toFixed(1)}s`);
  }

  resetLyricsOffset() {
    const cur = this.tracks[this.currentTrackIndex];
    if (!cur) return;
    const key = cur.id || (cur.artist + ' - ' + cur.title);
    delete this.lyricsOffsets[key];
    localStorage.setItem("sorafy_lyrics_offsets", JSON.stringify(this.lyricsOffsets));
    this.updateLyricsOffsetUI();
    this.showToast("Lyrics offset reset to 0.0s");
  }

  // =========================================================
  // In-Document Lyrics Search System (Notes App & Musicfy UX)
  // =========================================================
  openLyricsSearch() {
    const isCollapsed = this.appLayout.classList.contains("lyrics-collapsed");
    if (isCollapsed) {
      this.toggleSideDrawer(true);
    }
    if (this.activeSideTab !== "lyrics") {
      this.switchSideTab("lyrics");
    }

    this.isLyricsSearchOpen = true;
    if (this.lyricsSearchBar) {
      this.lyricsSearchBar.classList.add("active");
    }
    if (this.lyricsSearchToggleBtn) {
      this.lyricsSearchToggleBtn.classList.add("active");
    }
    if (this.lyricsSearchInput) {
      this.lyricsSearchInput.focus();
      this.lyricsSearchInput.select();
      if (this.lyricsSearchInput.value.trim()) {
        this.searchLyrics(this.lyricsSearchInput.value);
      }
    }
  }

  closeLyricsSearch() {
    this.isLyricsSearchOpen = false;
    if (this.lyricsSearchBar) {
      this.lyricsSearchBar.classList.remove("active");
    }
    if (this.lyricsSearchToggleBtn) {
      this.lyricsSearchToggleBtn.classList.remove("active");
    }
    if (this.lyricsSearchInput) {
      this.lyricsSearchInput.value = "";
    }
    if (this.lyricsClearBtn) {
      this.lyricsClearBtn.style.display = "none";
    }
    this.lyricsMatches = [];
    this.currentLyricsMatchIndex = -1;
    if (this.lyricsMatchCounter) {
      this.lyricsMatchCounter.textContent = "0 / 0";
      this.lyricsMatchCounter.classList.remove("has-matches");
    }
    if (this.lyricsPrevMatchBtn) this.lyricsPrevMatchBtn.disabled = true;
    if (this.lyricsNextMatchBtn) this.lyricsNextMatchBtn.disabled = true;

    this.restoreLyricLines();

    // Smoothly restore viewport focus to current singing line if active
    if (this.activeLyricIndex >= 0 && this.lyricsLineElements[this.activeLyricIndex]) {
      this.lyricsLineElements[this.activeLyricIndex].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  toggleLyricsSearch() {
    if (this.isLyricsSearchOpen) {
      this.closeLyricsSearch();
    } else {
      this.openLyricsSearch();
    }
  }

  restoreLyricLines() {
    if (!this.lyricsLineElements || !this.currentLyrics) return;
    this.lyricsLineElements.forEach((p, idx) => {
      const line = this.currentLyrics[idx];
      if (line) p.textContent = line.text;
      p.classList.remove("active-search-match", "passive-search-match", "dimmed-search-line");
    });
  }

  searchLyrics(rawQuery) {
    const query = (rawQuery || "").trim();
    if (this.lyricsClearBtn) {
      this.lyricsClearBtn.style.display = (rawQuery || "").length > 0 ? "flex" : "none";
    }

    if (!query || !this.currentLyrics || this.currentLyrics.length === 0) {
      this.lyricsMatches = [];
      this.currentLyricsMatchIndex = -1;
      if (this.lyricsMatchCounter) {
        this.lyricsMatchCounter.textContent = "0 / 0";
        this.lyricsMatchCounter.classList.remove("has-matches");
      }
      if (this.lyricsPrevMatchBtn) this.lyricsPrevMatchBtn.disabled = true;
      if (this.lyricsNextMatchBtn) this.lyricsNextMatchBtn.disabled = true;
      this.restoreLyricLines();
      return;
    }

    this.lyricsMatches = LyricsSearchEngine.search(this.currentLyrics, query);
    const total = this.lyricsMatches.length;

    if (total === 0) {
      this.currentLyricsMatchIndex = -1;
      if (this.lyricsMatchCounter) {
        this.lyricsMatchCounter.textContent = "0 / 0";
        this.lyricsMatchCounter.classList.remove("has-matches");
      }
      if (this.lyricsPrevMatchBtn) this.lyricsPrevMatchBtn.disabled = true;
      if (this.lyricsNextMatchBtn) this.lyricsNextMatchBtn.disabled = true;

      // Dim all lines when no matches are found, preserving full document context
      this.lyricsLineElements.forEach((p, idx) => {
        const line = this.currentLyrics[idx];
        if (line) p.textContent = line.text;
        p.classList.remove("active-search-match", "passive-search-match");
        p.classList.add("dimmed-search-line");
      });
      return;
    }

    this.currentLyricsMatchIndex = 0;
    if (this.lyricsMatchCounter) {
      this.lyricsMatchCounter.textContent = `1 / ${total}`;
      this.lyricsMatchCounter.classList.add("has-matches");
    }
    if (this.lyricsPrevMatchBtn) this.lyricsPrevMatchBtn.disabled = false;
    if (this.lyricsNextMatchBtn) this.lyricsNextMatchBtn.disabled = false;

    this.renderHighlightedLines();
    this.scrollToCurrentMatch();
  }

  nextLyricsMatch() {
    if (!this.lyricsMatches || this.lyricsMatches.length === 0) return;
    this.currentLyricsMatchIndex = (this.currentLyricsMatchIndex + 1) % this.lyricsMatches.length;
    this.updateMatchNavigation();
  }

  prevLyricsMatch() {
    if (!this.lyricsMatches || this.lyricsMatches.length === 0) return;
    this.currentLyricsMatchIndex = (this.currentLyricsMatchIndex - 1 + this.lyricsMatches.length) % this.lyricsMatches.length;
    this.updateMatchNavigation();
  }

  updateMatchNavigation() {
    const total = this.lyricsMatches.length;
    if (this.lyricsMatchCounter) {
      this.lyricsMatchCounter.textContent = `${this.currentLyricsMatchIndex + 1} / ${total}`;
      this.lyricsMatchCounter.classList.add("has-matches");
    }
    this.renderHighlightedLines();
    this.scrollToCurrentMatch();
  }

  scrollToCurrentMatch() {
    if (this.currentLyricsMatchIndex < 0 || this.currentLyricsMatchIndex >= this.lyricsMatches.length) return;
    const targetMatch = this.lyricsMatches[this.currentLyricsMatchIndex];
    const targetEl = this.lyricsLineElements[targetMatch.lineIndex];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  renderHighlightedLines() {
    if (!this.lyricsLineElements || !this.currentLyrics) return;
    const matchMap = new Map();
    this.lyricsMatches.forEach((m, idx) => {
      matchMap.set(m.lineIndex, { match: m, isTarget: idx === this.currentLyricsMatchIndex });
    });

    this.lyricsLineElements.forEach((p, idx) => {
      const line = this.currentLyrics[idx];
      if (!line) return;
      const entry = matchMap.get(idx);
      if (entry) {
        p.classList.remove("dimmed-search-line");
        if (entry.isTarget) {
          p.classList.add("active-search-match");
          p.classList.remove("passive-search-match");
        } else {
          p.classList.add("passive-search-match");
          p.classList.remove("active-search-match");
        }
        p.innerHTML = buildHighlightedHtml(line.text, entry.match.matchRanges, entry.isTarget);
      } else {
        p.textContent = line.text;
        p.classList.remove("active-search-match", "passive-search-match");
        p.classList.add("dimmed-search-line");
      }
    });
  }

  // Render Track List (Streamlined Minimalist Spotify/Apple Music Style)
  renderTrackGrid(tracks) {
    this.trackGrid.innerHTML = "";
    tracks.forEach((track, idx) => {
      const isActive = this.tracks[this.currentTrackIndex]?.id === track.id;
      const isLiked = this.likedTrackIds.has(track.id);
      const row = this.createTrackRow(track, idx, isActive, isLiked, () => {
        const originalIndex = this.tracks.findIndex(t => t.id === track.id);
        this.loadTrack(originalIndex !== -1 ? originalIndex : 0, true);
        this.showToast(`Memutar ${track.title}`);
        this.renderTrackGrid(this.tracks);
      });
      this.trackGrid.appendChild(row);
    });

    // Spotify/Apple Music Instant Preload: Pre-cache top 2 tracks of the current grid
    if (tracks && tracks.length > 0) {
      this.preloadTopTracks(tracks);
    }
  }

  // =========================================================
  // View Switching
  // =========================================================
  switchView(viewName) {
    if (this.currentView !== "player") {
      this.previousView = this.currentView;
    }
    this.currentView = viewName;

    this.navItems.forEach(item => {
      item.classList.toggle("active", item.dataset.view === viewName);
    });

    if (this.contentHeader) {
      this.contentHeader.style.display = (viewName === "player") ? "none" : "flex";
    }

    if (this.homeViewContainer) {
      this.homeViewContainer.style.display = (viewName === "home") ? "block" : "none";
      if (viewName === "home") {
        if (this.currentShelves && this.currentShelves.length > 0) {
          this.renderShelves(this.currentShelves);
        }
        if (this.quickPicksCarousel) {
          const qp = (this.officialQuickPicks && this.officialQuickPicks.length > 0)
            ? this.officialQuickPicks
            : (this.homeTracks ? this.homeTracks.slice(0, 16) : []);
          if (qp.length > 0) {
            this.renderYtmSongCarousel(this.quickPicksCarousel, qp.slice(0, 16));
          }
        }
      }
    }
    if (this.exploreViewContainer) {
      this.exploreViewContainer.style.display = (viewName === "explore") ? "block" : "none";
      if (viewName === "explore") {
        this.loadExploreView();
      }
    }
    if (this.pluginsViewContainer) {
      this.pluginsViewContainer.style.display = (viewName === "plugins") ? "block" : "none";
    }
    if (this.equalizerViewContainer) {
      this.equalizerViewContainer.style.display = (viewName === "equalizer") ? "block" : "none";
    }
    if (this.libraryViewContainer) {
      this.libraryViewContainer.style.display = (viewName === "library") ? "block" : "none";
      if (viewName === "library") {
        this.renderLibraryView();
      }
    }
    if (viewName === "downloads") {
      this.currentView = "library";
      if (this.libraryViewContainer) this.libraryViewContainer.style.display = "block";
      this.switchLibraryTab("downloads");
    }
    if (this.searchResultsContainer) {
      this.searchResultsContainer.style.display = (viewName === "search_results") ? "block" : "none";
    }
    if (this.artistViewContainer) {
      this.artistViewContainer.style.display = (viewName === "artist") ? "block" : "none";
    }
    if (this.playlistViewContainer) {
      this.playlistViewContainer.style.display = (viewName === "playlist") ? "block" : "none";
    }
    if (this.screenPlayerViewContainer) {
      this.screenPlayerViewContainer.style.display = (viewName === "player") ? "block" : "none";
      if (viewName === "player") {
        this.updateScreenPlayer(true);
      } else {
        // If exiting screen player while video was active, clear iframe/native video and resume audio
        if (this.screenPlayerNativeVideo) {
          this.screenPlayerNativeVideo.pause();
          this.screenPlayerNativeVideo.src = "";
          this.screenPlayerNativeVideo.style.display = "none";
        }
        if (this.screenPlayerVideoFrame && this.currentScreenMode === "video") {
          this.screenPlayerVideoFrame.src = "";
          if (this.audio && this.audio.paused && this.isPlaying) {
            this.audio.play().catch(() => {});
          }
        }
      }
    }

    if (viewName === "plugins") {
      this.renderPlugins();
    } else if (viewName === "equalizer") {
      this.renderEqualizerBands();
    }
  }

  showToast(message) {
    this.toastMessage.textContent = message;
    this.topToast.classList.add("show");
    setTimeout(() => {
      this.topToast.classList.remove("show");
    }, 2400);
  }

  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // =========================================================
  // Volume Controller & Persistence
  // =========================================================
  setVolume(val) {
    const clamped = Math.max(0, Math.min(1, val));
    if (this.audio) {
      this.audio.volume = clamped;
    }
    const percent = Math.round(clamped * 100);
    if (this.volumeSlider) {
      this.volumeSlider.value = clamped;
      this.volumeSlider.style.background = `linear-gradient(to right, var(--color-brand-primary) 0%, var(--color-brand-primary) ${percent}%, rgba(255, 255, 255, 0.12) ${percent}%, rgba(255, 255, 255, 0.12) 100%)`;
    }
    if (this.volumeLabel) {
      this.volumeLabel.textContent = `${percent}%`;
    }
    this.updateVolumeIcon(clamped);
    localStorage.setItem("sorafy_volume", clamped.toString());
  }

  updateVolumeIcon(val) {
    if (!this.volumeIcon) return;
    let iconName = "volume-high";
    if (val <= 0.001) {
      iconName = "volume-slash";
      if (this.volumeMuteBtn) this.volumeMuteBtn.title = "Bunyikan (Unmute)";
    } else if (val < 0.5) {
      iconName = "volume-low";
      if (this.volumeMuteBtn) this.volumeMuteBtn.title = "Bisukan (Mute)";
    } else {
      iconName = "volume-high";
      if (this.volumeMuteBtn) this.volumeMuteBtn.title = "Bisukan (Mute)";
    }
    this.volumeIcon.setAttribute("name", iconName);
  }

  toggleMute() {
    if (this.audio.volume > 0.01) {
      this.previousVolume = this.audio.volume;
      this.setVolume(0);
      this.showToast("Volume Dibisukan (Muted)");
    } else {
      const restoreVol = this.previousVolume > 0.05 ? this.previousVolume : 0.85;
      this.setVolume(restoreVol);
      this.showToast(`Volume ${Math.round(restoreVol * 100)}%`);
    }
  }

  // =========================================================
  // Side Panel (Lyrics & Queue) Controls
  // =========================================================
  toggleSideDrawer(forceState) {
    const isCurrentlyCollapsed = this.appLayout.classList.contains("lyrics-collapsed");
    const willCollapse = forceState !== undefined ? !forceState : !isCurrentlyCollapsed;
    this.appLayout.classList.toggle("lyrics-collapsed", willCollapse);

    if (!willCollapse) {
      this.switchSideTab(this.activeSideTab || "lyrics");
    } else {
      if (this.toggleLyricsBtn) this.toggleLyricsBtn.classList.remove("active");
      if (this.toggleQueueBtn) this.toggleQueueBtn.classList.remove("active");
    }
    setTimeout(() => this.setupWaveCanvas(), 250);
  }

  toggleLyricsDrawer(forceState) {
    this.toggleSideDrawer(forceState);
  }

  switchSideTab(tab) {
    this.activeSideTab = tab;
    if (tab === "lyrics") {
      if (this.tabLyricsBtn) this.tabLyricsBtn.classList.add("active");
      if (this.tabQueueBtn) this.tabQueueBtn.classList.remove("active");
      if (this.lyricsContainer) this.lyricsContainer.style.display = "flex";
      if (this.queueContainer) this.queueContainer.style.display = "none";
      if (this.clearQueueBtn) this.clearQueueBtn.style.display = "none";
      if (this.toggleLyricsBtn) this.toggleLyricsBtn.classList.add("active");
      if (this.toggleQueueBtn) this.toggleQueueBtn.classList.remove("active");
      if (this.lyricsSearchToggleBtn) {
        this.lyricsSearchToggleBtn.style.display = (this.currentLyrics && this.currentLyrics.length > 0) ? "flex" : "none";
      }
      if (this.isLyricsSearchOpen && this.lyricsSearchBar) {
        this.lyricsSearchBar.classList.add("active");
      }
    } else {
      if (this.tabLyricsBtn) this.tabLyricsBtn.classList.remove("active");
      if (this.tabQueueBtn) this.tabQueueBtn.classList.add("active");
      if (this.lyricsContainer) this.lyricsContainer.style.display = "none";
      if (this.queueContainer) this.queueContainer.style.display = "flex";
      const upcomingCount = Math.max(0, this.tracks.length - 1 - this.currentTrackIndex);
      if (this.clearQueueBtn) this.clearQueueBtn.style.display = upcomingCount > 0 ? "inline-flex" : "none";
      if (this.toggleLyricsBtn) this.toggleLyricsBtn.classList.remove("active");
      if (this.toggleQueueBtn) this.toggleQueueBtn.classList.add("active");
      if (this.lyricsSearchToggleBtn) {
        this.lyricsSearchToggleBtn.style.display = "none";
      }
      if (this.lyricsSearchBar) {
        this.lyricsSearchBar.classList.remove("active");
      }
      this.renderQueue();
    }
  }

  toggleLyricsTab() {
    const isCollapsed = this.appLayout.classList.contains("lyrics-collapsed");
    if (isCollapsed) {
      this.toggleSideDrawer(true);
      this.switchSideTab("lyrics");
    } else if (this.activeSideTab === "lyrics") {
      this.toggleSideDrawer(false);
    } else {
      this.switchSideTab("lyrics");
    }
  }

  toggleQueueTab() {
    const isCollapsed = this.appLayout.classList.contains("lyrics-collapsed");
    if (isCollapsed) {
      this.toggleSideDrawer(true);
      this.switchSideTab("queue");
    } else if (this.activeSideTab === "queue") {
      this.toggleSideDrawer(false);
    } else {
      this.switchSideTab("queue");
    }
  }

  // =========================================================
  // Musify Strict Se-Genre & Se-Kultur Dynamic Recommendation Queue
  // =========================================================
  async fetchMusifyQueue(seedTrack) {
    if (!seedTrack) return [];
    if (!window.electronAPI || typeof window.electronAPI.searchYouTubeMusic !== "function") return [];

    const artist = (seedTrack.artist || "").trim();
    const title = (seedTrack.title || "").trim();
    const lowerArtist = artist.toLowerCase();
    const cluster = detectMusifyCulture(artist, title);

    const existingIds = new Set();
    this.tracks.forEach(t => {
      if (t.id) existingIds.add(t.id);
      if (t.video_id) existingIds.add(t.video_id);
    });

    const sameArtistSongs = [];
    const peerArtistSongs = [];

    const addTrack = (track, isSameArtist) => {
      if (!track || !track.title) return;
      const vid = track.video_id || (track.id ? track.id.replace(/^yt_/, "") : "");
      const key = track.id || vid;
      if (!key || existingIds.has(key) || existingIds.has(vid)) return;
      const tLower = (track.title || "").toLowerCase().trim();

      // Avoid duplicate song titles
      if (sameArtistSongs.some(c => (c.title || "").toLowerCase().trim() === tLower)) return;
      if (peerArtistSongs.some(c => (c.title || "").toLowerCase().trim() === tLower)) return;
      if (this.tracks.some(c => (c.title || "").toLowerCase().trim() === tLower)) return;

      // Ensure strict vibe and cultural compatibility
      if (!isCompatibleMusifyTrack(track, seedTrack, cluster)) return;

      existingIds.add(key);
      if (vid) existingIds.add(vid);

      if (isSameArtist) {
        sameArtistSongs.push(track);
      } else {
        peerArtistSongs.push(track);
      }
    };

    try {
      // 1. Same Artist Deep Catalog (Musify 40% ratio)
      if (artist) {
        const artistSongs = await window.electronAPI.searchYouTubeMusic(`${artist} hits`, "song").catch(() => []);
        if (Array.isArray(artistSongs)) {
          artistSongs.forEach(t => {
            const cArt = (t.artist || "").toLowerCase();
            if (cArt.includes(lowerArtist) || lowerArtist.includes(cArt)) {
              addTrack(t, true);
            } else {
              addTrack(t, false);
            }
          });
        }
      }

      // 2. Strict Peer Artists from the Exact Same Culture & Genre (Musify 60% ratio)
      if (cluster && cluster.keywords) {
        const peerKeywords = cluster.keywords.filter(k => !lowerArtist.includes(k) && !k.includes(lowerArtist));
        const samplePeers = peerKeywords.sort(() => 0.5 - Math.random()).slice(0, 4);
        for (const peer of samplePeers) {
          if (peerArtistSongs.length >= 18) break;
          const peerTracks = await window.electronAPI.searchYouTubeMusic(`${peer} hits`, "song").catch(() => []);
          if (Array.isArray(peerTracks)) {
            peerTracks.slice(0, 4).forEach(t => addTrack(t, false));
          }
        }
      }

      // 3. Fallback cluster search seeds if more tracks are needed
      if ((sameArtistSongs.length + peerArtistSongs.length) < 12 && cluster && cluster.searchSeeds) {
        const randomSeed = cluster.searchSeeds[Math.floor(Math.random() * cluster.searchSeeds.length)];
        const clusterTracks = await window.electronAPI.searchYouTubeMusic(randomSeed, "song").catch(() => []);
        if (Array.isArray(clusterTracks)) {
          clusterTracks.forEach(t => addTrack(t, false));
        }
      }
    } catch (err) {
      console.warn("Musify queue generator note:", err);
    }

    // 4. Interleave for optimal Musify listening flow:
    // Pattern: [Same Artist, Peer 1, Peer 2, Same Artist, Peer 3, Peer 4, ...]
    const finalQueue = [];
    let sIdx = 0;
    let pIdx = 0;

    while (sIdx < sameArtistSongs.length || pIdx < peerArtistSongs.length) {
      if (sIdx < sameArtistSongs.length) {
        finalQueue.push(sameArtistSongs[sIdx++]);
      }
      if (pIdx < peerArtistSongs.length) {
        finalQueue.push(peerArtistSongs[pIdx++]);
      }
      if (pIdx < peerArtistSongs.length) {
        finalQueue.push(peerArtistSongs[pIdx++]);
      }
    }

    return finalQueue;
  }

  async ensureUpcomingQueue() {
    if (this.isFetchingRadioQueue) return;
    const upcomingCount = Math.max(0, this.tracks.length - 1 - this.currentTrackIndex);
    if (upcomingCount <= 2) {
      this.isFetchingRadioQueue = true;
      try {
        const currentTrack = this.tracks[this.currentTrackIndex];
        if (currentTrack) {
          const newTracks = await this.fetchMusifyQueue(currentTrack);
          if (newTracks && newTracks.length > 0) {
            this.tracks.push(...newTracks);
            this.renderQueue();
            setTimeout(() => this.preloadNextTrack(), 500);
          }
        }
      } catch (_) {
      } finally {
        this.isFetchingRadioQueue = false;
      }
    }
  }

  // =========================================================
  // Drag & Drop Responsive Queue Manager
  // =========================================================
  renderQueue() {
    if (!this.queueContainer) return;

    const currentTrack = this.tracks[this.currentTrackIndex];
    const upcomingCount = Math.max(0, this.tracks.length - 1 - this.currentTrackIndex);
    if (this.queueBadge) {
      this.queueBadge.textContent = upcomingCount;
    }
    if (this.clearQueueBtn) {
      this.clearQueueBtn.style.display = upcomingCount > 0 && this.activeSideTab === "queue" ? "inline-flex" : "none";
    }

    // Render "Sedang Diputar"
    if (this.queueNowPlaying) {
      if (currentTrack) {
        this.queueNowPlaying.innerHTML = `
          <img src="${currentTrack.artwork_url || this.DEFAULT_TRACK_ART}" class="queue-item-art" alt="${this.escapeHtml(currentTrack.title)}" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
          <div class="queue-item-info">
            <span class="queue-item-title">
              <span class="title-text">${this.escapeHtml(currentTrack.title)}</span>
              ${currentTrack.is_explicit ? '<span class="explicit-badge" title="Explicit">E</span>' : ''}
            </span>
            <span class="queue-item-artist">${this.escapeHtml(currentTrack.artist)}</span>
          </div>
          <span class="queue-item-duration">${this.formatTime(currentTrack.duration_secs || 0)}</span>
        `;
        this.queueNowPlaying.oncontextmenu = (e) => {
          e.preventDefault();
          this.showContextMenu(e, currentTrack);
        };
      } else {
        this.queueNowPlaying.innerHTML = `
          <div style="font-size: 12px; color: var(--color-text-secondary); padding: 8px;">No track currently playing</div>
        `;
        this.queueNowPlaying.oncontextmenu = null;
      }
    }

    // Render "Up Next" (Upcoming tracks)
    if (!this.queueList) return;
    this.queueList.innerHTML = "";

    const queueHeader = document.querySelector(".queue-section-header .queue-section-title");
    if (queueHeader) {
      queueHeader.textContent = "Up Next";
    }

    if (upcomingCount === 0) {
      this.queueList.innerHTML = `
        <div style="text-align: center; padding: 32px 16px; color: var(--color-text-tertiary); font-size: 13px;">
          <div style="margin-bottom: 8px;"><iconsax-icon name="musicnote" type="bold" size="32" color="#00E599"></iconsax-icon></div>
          No upcoming tracks in queue.<br>Select a track to play.
        </div>
      `;
      return;
    }

    let draggedItemIndex = null;

    for (let i = this.currentTrackIndex + 1; i < this.tracks.length; i++) {
      const track = this.tracks[i];
      const queueIdx = i;

      const item = document.createElement("div");
      item.className = "queue-item";
      item.draggable = true;
      item.dataset.index = queueIdx;

      item.innerHTML = `
        <span class="queue-drag-handle" title="Drag to reorder">⋮⋮</span>
        <img src="${track.artwork_url || this.DEFAULT_TRACK_ART}" class="queue-item-art" alt="${this.escapeHtml(track.title)}" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
        <div class="queue-item-info">
          <span class="queue-item-title">
            <span class="title-text">${this.escapeHtml(track.title)}</span>
            ${track.is_explicit ? '<span class="explicit-badge" title="Explicit">E</span>' : ''}
          </span>
          <span class="queue-item-artist">${this.escapeHtml(track.artist)}</span>
        </div>
        <span class="queue-item-duration">${this.formatTime(track.duration_secs || 0)}</span>
        <button class="queue-item-remove" title="Remove from queue" data-action="remove">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;

      // Click to play directly
      item.addEventListener("click", (e) => {
        if (e.target.closest('[data-action="remove"]') || e.target.closest('.queue-drag-handle')) {
          return;
        }
        this.loadTrack(queueIdx, true);
      });

      // Context menu on queue item
      item.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.showContextMenu(e, track);
      });

      // Remove single track
      const removeBtn = item.querySelector('[data-action="remove"]');
      if (removeBtn) {
        removeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const removed = this.tracks.splice(queueIdx, 1);
          this.renderQueue();
          if (removed && removed[0]) {
            this.showToast(`Removed from queue: ${removed[0].title}`);
          }
        });
      }

      // Drag and Drop Listeners
      item.addEventListener("dragstart", (e) => {
        draggedItemIndex = queueIdx;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", queueIdx.toString());
        setTimeout(() => item.classList.add("dragging"), 0);
      });

      item.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        const rect = item.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (e.clientY < midY) {
          item.classList.add("drag-over-top");
          item.classList.remove("drag-over-bottom");
        } else {
          item.classList.add("drag-over-bottom");
          item.classList.remove("drag-over-top");
        }
      });

      item.addEventListener("dragleave", () => {
        item.classList.remove("drag-over-top", "drag-over-bottom");
      });

      item.addEventListener("drop", (e) => {
        e.preventDefault();
        item.classList.remove("drag-over-top", "drag-over-bottom");
        const fromIndex = draggedItemIndex !== null ? draggedItemIndex : parseInt(e.dataTransfer.getData("text/plain"), 10);
        const toIndex = queueIdx;

        if (fromIndex !== null && !isNaN(fromIndex) && fromIndex !== toIndex) {
          const [movedTrack] = this.tracks.splice(fromIndex, 1);
          this.tracks.splice(toIndex, 0, movedTrack);
          this.renderQueue();
          this.showToast("Queue order updated");
        }
      });

      item.addEventListener("dragend", () => {
        item.classList.remove("dragging", "drag-over-top", "drag-over-bottom");
        draggedItemIndex = null;
        document.querySelectorAll(".queue-item").forEach(el => {
          el.classList.remove("drag-over-top", "drag-over-bottom", "dragging");
        });
      });

      this.queueList.appendChild(item);
    }
  }

  clearUpcomingQueue() {
    if (this.currentTrackIndex < this.tracks.length - 1) {
      this.tracks.splice(this.currentTrackIndex + 1);
      this.renderQueue();
      this.showToast("Upcoming queue cleared");
    }
  }

  // =========================================================
  // Dedicated Screen Player Methods
  // =========================================================
  async setScreenPlayerMode(mode) {
    this.currentScreenMode = mode;
    if (this.modeAudioBtn) this.modeAudioBtn.classList.toggle("active", mode === "audio");
    if (this.modeVideoBtn) this.modeVideoBtn.classList.toggle("active", mode === "video");

    const screenPlayerBody = document.querySelector(".screen-player-body");
    const track = this.tracks[this.currentTrackIndex];
    let vid = track ? (track.video_id || (track.id && track.id.startsWith("yt_") ? track.id.replace(/^yt_/, "") : (track.id && track.id.length === 11 ? track.id : ""))) : "";
    const nativeVideo = this.screenPlayerNativeVideo || document.getElementById("screenPlayerNativeVideo");
    const videoLoading = this.screenPlayerVideoLoading || document.getElementById("screenPlayerVideoLoading");

    if (mode === "video") {
      if (screenPlayerBody) screenPlayerBody.classList.add("video-mode");
      if (this.screenPlayerAudioView) this.screenPlayerAudioView.style.display = "none";
      if (this.screenPlayerVideoView) this.screenPlayerVideoView.style.display = "block";

      // Dynamically resolve YouTube video ID if missing from track
      if (!vid && track && window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function') {
        try {
          const results = await window.electronAPI.searchYouTubeMusic(`${track.artist} ${track.title}`, 'song');
          if (results && results.length > 0 && results[0].video_id) {
            vid = results[0].video_id;
            track.video_id = vid;
          }
        } catch (_) {}
      }

      if (vid) {
        const curSec = this.audio ? (this.audio.currentTime || 0) : 0;

        // Hide iframe completely so YouTube Error 152 never flashes
        if (this.screenPlayerVideoFrame) {
          this.screenPlayerVideoFrame.style.display = "none";
          this.screenPlayerVideoFrame.src = "";
        }

        // Show smooth loading indicator
        if (videoLoading) {
          videoLoading.style.display = "flex";
        }
        if (nativeVideo) {
          nativeVideo.style.display = "none";
        }

        // Keep audio stream playing! Audio provides master high-fidelity Opus HD
        // sound via Web Audio API Equalizer DSP, while native video runs muted in sync (matching Android).
        if (this.audio && this.audio.paused && this.isPlaying) {
          this.audio.play().catch(() => {});
        }

        // 1. Direct unthrottled MP4 playback via yt-dlp: Completely bypasses YouTube Error 153 & Error 152
        if (window.electronAPI && typeof window.electronAPI.resolveDirectVideo === 'function') {
          try {
            const videoData = await window.electronAPI.resolveDirectVideo(vid);
            if (videoData && videoData.url && nativeVideo) {
              if (videoLoading) videoLoading.style.display = "none";
              nativeVideo.style.display = "block";
              nativeVideo.muted = true;
              if (nativeVideo.src !== videoData.url) {
                nativeVideo.src = videoData.url;
              }
              nativeVideo.currentTime = this.audio ? (this.audio.currentTime || 0) : curSec;
              if (this.isPlaying && this.audio && !this.audio.paused) {
                nativeVideo.play().catch(() => {});
              }
              return;
            }
          } catch (e) {
            console.warn("Direct video resolution notice:", e);
          }
        }

        // 2. Fallback to embed iframe if direct video not available
        if (videoLoading) videoLoading.style.display = "none";
        if (nativeVideo) {
          nativeVideo.pause();
          nativeVideo.style.display = "none";
        }
        if (this.screenPlayerVideoFrame) {
          this.screenPlayerVideoFrame.style.display = "block";
          const currentSrc = this.screenPlayerVideoFrame.src || "";
          if (!currentSrc.includes(vid)) {
            if (window.electronAPI && typeof window.electronAPI.getVideoEmbedUrl === 'function') {
              window.electronAPI.getVideoEmbedUrl({ videoId: vid, start: Math.floor(curSec) }).then(url => {
                this.screenPlayerVideoFrame.src = url;
              }).catch(() => {
                this.screenPlayerVideoFrame.src = `https://www.youtube.com/embed/${vid}?autoplay=1&start=${Math.floor(curSec)}&enablejsapi=1&origin=https://www.youtube.com`;
              });
            } else {
              this.screenPlayerVideoFrame.src = `https://www.youtube.com/embed/${vid}?autoplay=1&start=${Math.floor(curSec)}&enablejsapi=1&origin=https://www.youtube.com`;
            }
          }
        }
      } else {
        if (videoLoading) videoLoading.style.display = "none";
        this.showToast("Music video is not available for this track");
        this.setScreenPlayerMode("audio");
      }
    } else {
      // Audio mode
      if (screenPlayerBody) screenPlayerBody.classList.remove("video-mode");
      if (this.screenPlayerAudioView) this.screenPlayerAudioView.style.display = "flex";
      if (this.screenPlayerVideoView) this.screenPlayerVideoView.style.display = "none";
      if (videoLoading) videoLoading.style.display = "none";

      if (nativeVideo) {
        nativeVideo.pause();
        nativeVideo.src = "";
        nativeVideo.style.display = "none";
      }
      if (this.screenPlayerVideoFrame) {
        this.screenPlayerVideoFrame.src = "";
        this.screenPlayerVideoFrame.style.display = "none";
      }
      if (this.audio && this.audio.paused && this.isPlaying) {
        this.audio.play().catch(() => {});
        this.updatePlayPauseIcon();
      }
    }
  }

  updateScreenPlayer(isInitialOpen = false) {
    const track = this.tracks[this.currentTrackIndex];
    if (!track) return;

    if (this.screenPlayerTitle) {
      this.screenPlayerTitle.innerHTML = `
        <span class="title-text">${this.escapeHtml(track.title)}</span>
        ${track.is_explicit ? '<span class="explicit-badge" title="Explicit">E</span>' : ''}
      `;
    }
    if (this.screenPlayerArtist) {
      this.screenPlayerArtist.textContent = track.artist || 'Artis';
    }
    if (this.videoOverlayArtist) {
      this.videoOverlayArtist.textContent = track.artist || 'Artis';
    }
    if (this.screenPlayerArtwork) {
      this.screenPlayerArtwork.src = track.artwork_url || this.DEFAULT_TRACK_ART;
    }
    if (this.screenPlayerBadge) {
      let bText = track.audio_format?.codec || "Opus HD";
      if (bText.includes("yt-dlp") || bText.includes("YouTube Direct")) {
        bText = "Opus HD";
      }
      this.screenPlayerBadge.textContent = bText;
    }

    if (this.screenPlayerLikeBtn) {
      const isLiked = this.likedTrackIds.has(track.id);
      this.screenPlayerLikeBtn.classList.toggle("liked", isLiked);
      this.screenPlayerLikeBtn.innerHTML = isLiked
        ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="#00E599" stroke="#00E599" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
        : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
    }

    if (this.screenPlayerPlayPauseIcon) {
      if (this.isPlaying) {
        this.screenPlayerPlayPauseIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
      } else {
        this.screenPlayerPlayPauseIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
      }
    }

    if (this.screenPlayerShuffleBtn) {
      this.screenPlayerShuffleBtn.classList.toggle("active", this.isShuffled);
    }
    if (this.screenPlayerRepeatBtn) {
      this.screenPlayerRepeatBtn.classList.toggle("active", this.repeatMode > 0);
    }

    // Auto-detect if track is a video or has video_id
    if (track.is_video) {
      this.setScreenPlayerMode("video");
    } else if (this.currentScreenMode === "video" && !isInitialOpen) {
      this.setScreenPlayerMode("video");
    } else {
      this.setScreenPlayerMode("audio");
    }
  }

  // =========================================================
  // Web Audio API & Equalizer DSP Engine
  // =========================================================
  initAudioEqualizer() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();
      this.audioSourceNode = this.audioCtx.createMediaElementSource(this.audio);

      let lastNode = this.audioSourceNode;
      this.eqFilters = EQ_FREQUENCIES.map((freq, idx) => {
        const filter = this.audioCtx.createBiquadFilter();
        if (idx === 0) {
          filter.type = "lowshelf";
        } else if (idx === EQ_FREQUENCIES.length - 1) {
          filter.type = "highshelf";
        } else {
          filter.type = "peaking";
          filter.Q.value = 1.4;
        }
        filter.frequency.value = freq;
        filter.gain.value = 0;

        lastNode.connect(filter);
        lastNode = filter;
        return filter;
      });

      this.bassFilterNode = this.audioCtx.createBiquadFilter();
      this.bassFilterNode.type = "lowshelf";
      this.bassFilterNode.frequency.value = 80;
      this.bassFilterNode.gain.value = 0;
      lastNode.connect(this.bassFilterNode);
      lastNode = this.bassFilterNode;

      // Dynamics Compressor (Audio Normalization / Anti-Kaget Loudness Equalization)
      this.normalizerNode = this.audioCtx.createDynamicsCompressor();
      this.normalizerNode.threshold.value = -24; // dB threshold
      this.normalizerNode.knee.value = 30; // smooth compression knee
      this.normalizerNode.ratio.value = 12; // tame abrupt peak surges
      this.normalizerNode.attack.value = 0.003; // 3ms rapid surge reaction
      this.normalizerNode.release.value = 0.25; // 250ms release
      lastNode.connect(this.normalizerNode);
      lastNode = this.normalizerNode;

      lastNode.connect(this.audioCtx.destination);
    } catch (e) {
      console.warn("AudioContext init notice:", e);
    }

    this.renderEqualizerBands();
  }

  ensureAudioContextActive() {
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  renderEqualizerBands() {
    if (!this.eqBandsRow) return;
    this.eqBandsRow.innerHTML = "";

    EQ_FREQUENCIES.forEach((freq, idx) => {
      const currentGain = this.currentGains[idx] || 0;
      const col = document.createElement("div");
      col.className = "eq-band-col";
      const formattedFreq = freq >= 1000 ? `${(freq / 1000).toFixed(1)} kHz` : `${freq} Hz`;

      col.innerHTML = `
        <span class="eq-gain-label" id="eqGainLabel_${idx}">${currentGain > 0 ? '+' : ''}${currentGain} dB</span>
        <div class="eq-v-slider-wrapper">
          <input type="range" class="eq-vertical-slider" min="-12" max="12" step="0.5" value="${currentGain}" id="eqSlider_${idx}">
        </div>
        <span class="eq-freq-label">${formattedFreq}</span>
      `;

      const slider = col.querySelector(`#eqSlider_${idx}`);
      const label = col.querySelector(`#eqGainLabel_${idx}`);

      slider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        this.currentGains[idx] = val;
        label.textContent = `${val > 0 ? '+' : ''}${val} dB`;
        if (this.eqFilters[idx]) {
          this.eqFilters[idx].gain.value = val;
        }
      });

      this.eqBandsRow.appendChild(col);
    });
  }

  applyEqualizerPreset(presetName) {
    const preset = EQ_PRESETS[presetName];
    if (!preset) return;

    this.currentGains = [...preset];
    this.currentGains.forEach((gain, idx) => {
      if (this.eqFilters[idx]) {
        this.eqFilters[idx].gain.value = gain;
      }
      const slider = document.getElementById(`eqSlider_${idx}`);
      const label = document.getElementById(`eqGainLabel_${idx}`);
      if (slider) slider.value = gain;
      if (label) label.textContent = `${gain > 0 ? '+' : ''}${gain} dB`;
    });

    if (presetName === "Bass Boost") {
      this.bassBoostSlider.value = 45;
      this.bassBoostVal.textContent = "45%";
      if (this.bassFilterNode) this.bassFilterNode.gain.value = 5.4;
    } else if (presetName === "Electronic / Cyber") {
      this.bassBoostSlider.value = 30;
      this.bassBoostVal.textContent = "30%";
      if (this.bassFilterNode) this.bassFilterNode.gain.value = 3.6;
    } else {
      this.bassBoostSlider.value = 0;
      this.bassBoostVal.textContent = "0%";
      if (this.bassFilterNode) this.bassFilterNode.gain.value = 0;
    }

    this.showToast(`Preset Equalizer: ${presetName}`);
  }

  isPluginEnabled(id) {
    const p = this.plugins.find(x => x.id === id);
    return p ? p.is_enabled !== false : true;
  }

  // =========================================================
  // Modular Plugins Manager
  // =========================================================
  async initPlugins() {
    const saved = localStorage.getItem("sorafy_plugins_state");
    if (saved) {
      try {
        const stateMap = JSON.parse(saved);
        this.plugins.forEach(p => {
          if (stateMap[p.id] !== undefined) p.is_enabled = stateMap[p.id];
        });
      } catch (e) {}
    }

    const nativePlugins = await invokeTauri("get_plugins");
    if (nativePlugins && Array.isArray(nativePlugins) && nativePlugins.length > 0) {
      this.plugins = nativePlugins;
    }
  }

  renderPlugins() {
    if (!this.pluginListGrid) return;
    this.pluginListGrid.innerHTML = "";

    this.plugins.forEach(plugin => {
      const card = document.createElement("div");
      card.className = `plugin-card ${plugin.is_enabled ? '' : 'disabled'}`;
      card.id = `plugin_card_${plugin.id}`;

      card.innerHTML = `
        <div class="plugin-header">
          <div class="plugin-info">
            <div class="plugin-icon-box">${plugin.icon || '<iconsax-icon name="box" type="bold" size="24" color="#00E599"></iconsax-icon>'}</div>
            <div class="plugin-meta-col">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="plugin-title">${plugin.name}</span>
                <span class="plugin-category-badge">${plugin.category}</span>
                <span class="plugin-author-version">v${plugin.version}</span>
              </div>
              <p class="plugin-desc">${plugin.description}</p>
            </div>
          </div>
        </div>
        <div class="plugin-footer">
          <span style="font-size: 11px; color: ${plugin.is_enabled ? 'var(--color-brand-primary)' : 'var(--color-text-tertiary)'}; font-weight: 600;" id="status_${plugin.id}">
            ${plugin.is_enabled ? '● Active' : '○ Inactive'}
          </span>
          <label class="switch">
            <input type="checkbox" ${plugin.is_enabled ? 'checked' : ''} id="toggle_${plugin.id}">
            <span class="slider"></span>
          </label>
        </div>
      `;

      const checkbox = card.querySelector(`#toggle_${plugin.id}`);
      checkbox.addEventListener("change", (e) => {
        this.togglePlugin(plugin.id, e.target.checked);
      });

      this.pluginListGrid.appendChild(card);
    });
  }

  async togglePlugin(id, isEnabled) {
    const plugin = this.plugins.find(p => p.id === id);
    if (plugin) {
      plugin.is_enabled = isEnabled;
    }

    try {
      const stateMap = Object.fromEntries(this.plugins.map(p => [p.id, p.is_enabled]));
      localStorage.setItem("sorafy_plugins_state", JSON.stringify(stateMap));
    } catch (e) {}

    const card = document.getElementById(`plugin_card_${id}`);
    const status = document.getElementById(`status_${id}`);
    if (card) card.classList.toggle("disabled", !isEnabled);
    if (status) {
      status.textContent = isEnabled ? '● Active' : '○ Disabled';
      status.style.color = isEnabled ? 'var(--color-brand-primary)' : 'var(--color-text-tertiary)';
    }

    await invokeTauri("toggle_plugin", { id, enabled: isEnabled });
    this.showToast(`${plugin ? plugin.name : id}: ${isEnabled ? 'Enabled' : 'Disabled'}`);
  }

  // =========================================================
  // Universal Importer & Platform Integrations (Spotify, Apple Music, YT Music)
  // =========================================================
  async handleUnifiedImport() {
    const url = (this.unifiedImportUrlInput?.value || "").trim();
    if (!url) {
      this.showToast("Please enter a playlist or album link first.");
      return;
    }

    if (!window.electronAPI || typeof window.electronAPI.importExternalPlaylist !== 'function') {
      this.showToast("Import feature is only available on the SoraFy desktop app.");
      return;
    }

    if (this.submitUnifiedImportBtn) {
      this.submitUnifiedImportBtn.disabled = true;
      this.submitUnifiedImportBtn.textContent = "Importing...";
    }
    if (this.unifiedImportStatus) {
      this.unifiedImportStatus.style.display = "flex";
      if (this.unifiedImportStatusText) {
        this.unifiedImportStatusText.textContent = `Connecting to ${this.selectedImportPlatform.toUpperCase()} & extracting metadata...`;
      }
    }

    try {
      const res = await window.electronAPI.importExternalPlaylist(url);
      if (!res || !res.success || !res.tracks || res.tracks.length === 0) {
        throw new Error(res?.error || "No tracks found from the provided link.");
      }

      const playlistTitle = res.title || `Imported ${res.provider || 'Music'}`;
      const newPlaylist = {
        id: `pl_imp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: playlistTitle,
        title: playlistTitle,
        author: `Imported ${res.provider || 'Spotify'}`,
        description: `Imported from ${res.provider} (${res.tracks.length} tracks). High-fidelity audio playback.`,
        artwork_url: res.tracks[0]?.artwork_url || this.DEFAULT_TRACK_ART,
        tracks: res.tracks,
        track_count: `${res.tracks.length} Tracks`,
        createdAt: Date.now()
      };

      this.userPlaylists.unshift(newPlaylist);
      this.saveUserPlaylists();
      this.renderUserPlaylists();

      if (this.unifiedImportModal) this.unifiedImportModal.style.display = "none";
      if (this.unifiedImportUrlInput) this.unifiedImportUrlInput.value = "";
      this.showToast(`Successfully imported "${playlistTitle}" (${res.tracks.length} tracks)!`);

      // Switch to this imported playlist view immediately
      this.openPlaylistDetail(newPlaylist);
    } catch (err) {
      console.error("Import error:", err);
      this.showToast(`Failed to import: ${err.message || 'Please check your URL'}`);
    } finally {
      if (this.submitUnifiedImportBtn) {
        this.submitUnifiedImportBtn.disabled = false;
        this.submitUnifiedImportBtn.textContent = "Start Import";
      }
      if (this.unifiedImportStatus) {
        this.unifiedImportStatus.style.display = "none";
      }
    }
  }

  saveUserPlaylists() {
    try {
      localStorage.setItem("sorafy_user_playlists", JSON.stringify(this.userPlaylists));
    } catch (e) {
      console.warn("localStorage quota exceeded, syncing to disk:", e);
    }
    if (window.electronAPI && typeof window.electronAPI.saveUserPlaylistsDisk === 'function') {
      window.electronAPI.saveUserPlaylistsDisk(this.userPlaylists).catch(() => {});
    }
    if (this.libPlaylistsGrid) {
      this.renderLibraryPlaylists();
    }
  }

  renderUserPlaylistsNav() {
    this.renderUserPlaylists();
  }

  openUserPlaylist(playlistId) {
    const pl = this.userPlaylists.find(p => p.id === playlistId);
    if (pl) {
      this.openPlaylistDetail(pl);
    }
  }

  saveLikedTracks() {
    localStorage.setItem("sorafy_liked_ids", JSON.stringify([...this.likedTrackIds]));
  }

  handleSpotifyImport() {
    return this.handleUnifiedImport();
  }

  // =========================================================
  // Data Backup & Restore Engine (Local JSON Sovereignty)
  // =========================================================
  async handleDataBackup() {
    if (!window.electronAPI || typeof window.electronAPI.saveBackupFile !== 'function') {
      this.showToast("File backup is only available on SoraFy desktop.");
      return;
    }

    const backupPayload = {
      version: 1,
      appName: "SoraFy",
      exportedAt: new Date().toISOString(),
      userPlaylists: this.userPlaylists || [],
      likedTrackIds: Array.from(this.likedTrackIds || []),
      history: this.historyTracks || [],
      tasteProfile: JSON.parse(localStorage.getItem("sorafy_taste_profile") || "{}"),
      dspSettings: JSON.parse(localStorage.getItem("sorafy_dsp_settings") || "{}")
    };

    const res = await window.electronAPI.saveBackupFile(backupPayload);
    if (res && res.success) {
      const filename = res.filePath ? res.filePath.split('/').pop() : 'backup.json';
      this.showToast(`Data backup saved: ${filename}`);
    } else if (res && !res.canceled) {
      this.showToast(`Failed to save backup: ${res.error || 'An error occurred'}`);
    }
  }

  async handleDataRestore() {
    if (!window.electronAPI || typeof window.electronAPI.loadBackupFile !== 'function') {
      this.showToast("File restore is only available on SoraFy desktop.");
      return;
    }

    const res = await window.electronAPI.loadBackupFile();
    if (!res || !res.success || !res.data) {
      if (!res?.canceled) {
        this.showToast(`Failed to load file: ${res?.error || 'Invalid format'}`);
      }
      return;
    }

    try {
      const data = res.data;
      if (Array.isArray(data.userPlaylists)) {
        const existingIds = new Set(this.userPlaylists.map(p => p.id));
        for (const pl of data.userPlaylists) {
          if (!existingIds.has(pl.id)) {
            this.userPlaylists.push(pl);
          }
        }
        this.saveUserPlaylists();
        this.renderUserPlaylistsNav();
      }

      if (Array.isArray(data.likedTrackIds)) {
        data.likedTrackIds.forEach(id => this.likedTrackIds.add(id));
        this.saveLikedTracks();
      }

      if (data.tasteProfile && typeof data.tasteProfile === 'object') {
        localStorage.setItem("sorafy_taste_profile", JSON.stringify(data.tasteProfile));
      }

      this.renderPersonalizedShelf();
      const filename = res.filePath ? res.filePath.split('/').pop() : 'backup';
      this.showToast(`Successfully restored data from ${filename}!`);
    } catch (e) {
      this.showToast(`Failed to process backup file: ${e.message}`);
    }
  }

  // =========================================================
  // Offline Track Downloader (Local MP3 in ~/Music/SoraFy)
  // =========================================================
  async downloadOfflineTrack(track) {
    if (!track) return;
    if (!window.electronAPI || typeof window.electronAPI.downloadTrack !== 'function') {
      this.showToast("Offline downloads are only available on SoraFy desktop app.");
      return;
    }

    this.showToast(`Downloading "${track.title}" to ~/Music/SoraFy...`);

    try {
      const res = await window.electronAPI.downloadTrack(track);
      if (res && res.success) {
        this.showToast(`Successfully downloaded: ${res.filename}`);
        if (this.currentView === "downloads") {
          this.loadDownloadedTracksView();
        }
      } else {
        this.showToast(`Download failed: ${res?.error || 'Audio stream unavailable'}`);
      }
    } catch (err) {
      console.error("Download error:", err);
      this.showToast(`Download failed: ${err.message}`);
    }
  }

  // =========================================================
  // Local Downloaded Music Library & Portability Engine
  // =========================================================
  async loadDownloadedTracksView() {
    if (!this.downloadsTrackList) return;
    this.downloadsTrackList.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--color-text-secondary); font-size: 13px;">${this.currentLanguage === 'id' ? 'Memuat lagu tersimpan...' : 'Loading downloaded tracks...'}</div>`;

    if (!window.electronAPI || typeof window.electronAPI.getDownloadedTracks !== 'function') {
      this.downloadsTrackList.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--color-text-secondary); font-size: 13px;">Local downloads are supported on SoraFy desktop app.</div>`;
      return;
    }

    try {
      const tracks = await window.electronAPI.getDownloadedTracks();
      this.downloadedTracks = Array.isArray(tracks) ? tracks : [];

      const count = this.downloadedTracks.length;
      const totalBytes = this.downloadedTracks.reduce((sum, t) => sum + (t.size_bytes || 0), 0);
      const mbStr = (totalBytes / (1024 * 1024)).toFixed(1);

      if (this.libDownloadsCount) {
        this.libDownloadsCount.textContent = this.currentLanguage === 'id' ? `${count} lagu` : `${count} tracks`;
      }

      if (this.downloadsSubtitle) {
        if (this.currentLanguage === 'id') {
          this.downloadsSubtitle.textContent = `${count} lagu tersimpan di ~/Music/SoraFy • ${mbStr} MB ruang disk`;
        } else {
          this.downloadsSubtitle.textContent = `${count} tracks stored locally in ~/Music/SoraFy • ${mbStr} MB disk space`;
        }
      }

      if (count === 0) {
        this.downloadsTrackList.innerHTML = "";
        if (this.downloadsEmptyState) this.downloadsEmptyState.style.display = "block";
        return;
      }

      if (this.downloadsEmptyState) this.downloadsEmptyState.style.display = "none";
      this.downloadsTrackList.innerHTML = "";

      this.downloadedTracks.forEach((track, idx) => {
        const isCurrentActive = this.tracks[this.currentTrackIndex]?.id === track.id;
        const row = document.createElement("div");
        row.className = `track-row ${isCurrentActive ? 'active' : ''}`;
        row.id = `download_row_${track.id}`;

        const sizeStr = track.size_bytes ? `${(track.size_bytes / (1024 * 1024)).toFixed(1)} MB` : '';
        const codecBadge = track.audio_format?.codec || 'MP3';

        row.innerHTML = `
          <div class="track-row-num" style="display: flex; align-items: center; justify-content: center; width: 28px;">
            <span class="num-text">${idx + 1}</span>
            <iconsax-icon class="play-icon" name="play" type="bold" size="14" color="#00E599"></iconsax-icon>
          </div>
          <div class="track-row-art-box" style="position: relative; width: 42px; height: 42px; border-radius: 8px; overflow: hidden; background: #181D24; display: flex; align-items: center; justify-content: center;">
            <iconsax-icon name="music" type="bold" size="20" color="#00E599"></iconsax-icon>
          </div>
          <div class="track-row-info" style="flex: 1; min-width: 0;">
            <div class="track-row-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; font-size: 14px;">${this.escapeHtml(track.title)}</div>
            <div class="track-row-artist" style="font-size: 12px; color: var(--color-text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${this.escapeHtml(track.artist)} • <span style="font-size: 11px; padding: 1px 4px; border-radius: 4px; background: rgba(255,255,255,0.06);">${codecBadge}</span></div>
          </div>
          <div style="font-size: 12px; color: var(--color-text-secondary); min-width: 60px; text-align: right; margin-right: 12px;">${sizeStr}</div>
          <div class="track-row-actions" style="display: flex; align-items: center; gap: 6px;">
            <button class="control-btn delete-download-btn" title="Delete from disk" style="padding: 6px; color: var(--color-text-secondary);">
              <iconsax-icon name="trash" type="linear" size="16" color="#EF4444"></iconsax-icon>
            </button>
          </div>
        `;

        row.addEventListener("click", (e) => {
          if (e.target.closest(".delete-download-btn")) return;
          this.tracks = [...this.downloadedTracks];
          this.loadTrack(idx, true);
        });

        const deleteBtn = row.querySelector(".delete-download-btn");
        if (deleteBtn) {
          deleteBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const confirmMsg = this.currentLanguage === 'id' 
              ? `Hapus "${track.title}" dari penyimpanan lokal?`
              : `Delete "${track.title}" from your disk?`;
            if (confirm(confirmMsg)) {
              if (window.electronAPI && typeof window.electronAPI.deleteDownloadedTrack === 'function') {
                const delRes = await window.electronAPI.deleteDownloadedTrack(track.raw_path);
                if (delRes && delRes.success) {
                  this.showToast(this.currentLanguage === 'id' ? "Lagu dihapus dari disk" : "Track deleted from disk");
                  this.loadDownloadedTracksView();
                } else {
                  this.showToast(`Failed: ${delRes?.error || 'Could not delete'}`);
                }
              }
            }
          });
        }

        this.downloadsTrackList.appendChild(row);
      });
    } catch (err) {
      console.warn("loadDownloadedTracksView error:", err);
      this.downloadsTrackList.innerHTML = `<div style="text-align: center; padding: 40px; color: #EF4444; font-size: 13px;">Error reading local library: ${this.escapeHtml(err.message)}</div>`;
    }
  }

  async checkYtDlpCompanionStatus() {
    if (!this.settingYtDlpStatus || !window.electronAPI || typeof window.electronAPI.checkYtDlpStatus !== 'function') return;
    this.settingYtDlpStatus.textContent = "Checking...";
    try {
      const res = await window.electronAPI.checkYtDlpStatus();
      if (res && res.installed) {
        this.settingYtDlpStatus.innerHTML = `<span style="color: #00E599; font-weight: 600;">✓ Installed (${res.version})</span>`;
        if (this.settingInstallYtDlpBtn) {
          this.settingInstallYtDlpBtn.textContent = this.currentLanguage === 'id' ? "Perbarui Mesin" : "Update Engine";
        }
      } else {
        this.settingYtDlpStatus.innerHTML = `<span style="color: #EF4444; font-weight: 600;">✗ Not Installed</span>`;
        if (this.settingInstallYtDlpBtn) {
          this.settingInstallYtDlpBtn.textContent = this.currentLanguage === 'id' ? "Unduh Mesin (yt-dlp)" : "Download Engine (yt-dlp)";
        }
      }
    } catch (_) {
      this.settingYtDlpStatus.textContent = "Status Unknown";
    }
  }

  async installYtDlpCompanion() {
    if (!this.settingInstallYtDlpBtn || !window.electronAPI || typeof window.electronAPI.downloadYtDlpBinary !== 'function') return;
    this.settingInstallYtDlpBtn.disabled = true;
    this.settingInstallYtDlpBtn.textContent = this.currentLanguage === 'id' ? "Mengunduh mesin..." : "Downloading engine...";
    if (this.settingYtDlpStatus) this.settingYtDlpStatus.textContent = "Downloading latest standalone binary...";

    try {
      const res = await window.electronAPI.downloadYtDlpBinary();
      if (res && res.success) {
        this.showToast(this.currentLanguage === 'id' ? "Mesin audio pendukung berhasil diinstal!" : "Audio engine companion installed successfully!");
        await this.checkYtDlpCompanionStatus();
      } else {
        this.showToast(`Installation failed: ${res?.error || 'Network error'}`);
        await this.checkYtDlpCompanionStatus();
      }
    } catch (err) {
      this.showToast(`Error: ${err.message}`);
      await this.checkYtDlpCompanionStatus();
    } finally {
      this.settingInstallYtDlpBtn.disabled = false;
    }
  }

  showPlayerBuffering(isBuffering) {
    let buff = document.getElementById("playerBufferingIndicator");
    if (isBuffering) {
      if (!buff) {
        const artBox = document.getElementById("playerArtworkBox") || (this.playerArtwork ? this.playerArtwork.parentElement : null);
        if (artBox) {
          buff = document.createElement("div");
          buff.id = "playerBufferingIndicator";
          buff.className = "player-buffering-pulse";
          buff.innerHTML = `<div class="buffering-spinner"></div>`;
          artBox.appendChild(buff);
        }
      }
    } else {
      if (buff) buff.remove();
    }
  }

  // =========================================================
  // Persistent Taste Profile & Personalized Shelf
  // =========================================================
  recordTasteAffinity(track) {
    if (!track || !track.title) return;
    try {
      const cluster = detectMusifyCulture(track.artist, track.title);
      let profile = {};
      try {
        profile = JSON.parse(localStorage.getItem("sorafy_taste_profile") || "{}");
      } catch (_) {}

      if (!profile.clusters) profile.clusters = {};
      if (!profile.artists) profile.artists = {};

      const clusterId = cluster?.id || "indo_indie_folk";
      profile.clusters[clusterId] = (profile.clusters[clusterId] || 0) + 1;

      const artist = (track.artist || "").trim();
      if (artist) {
        profile.artists[artist] = (profile.artists[artist] || 0) + 1;
      }

      profile.lastPlayed = {
        title: track.title,
        artist: track.artist,
        clusterId,
        timestamp: Date.now()
      };

      localStorage.setItem("sorafy_taste_profile", JSON.stringify(profile));
    } catch (_) {}
  }

  renderPersonalizedShelf() {
    if (!this.personalizedShelfSection || !this.personalizedShelfRow) return;

    let profile = {};
    try {
      profile = JSON.parse(localStorage.getItem("sorafy_taste_profile") || "{}");
    } catch (_) {}

    // Find top cluster
    let topClusterId = "indo_indie_folk";
    let maxClusterScore = 0;
    if (profile.clusters) {
      for (const [cId, score] of Object.entries(profile.clusters)) {
        if (score > maxClusterScore) {
          maxClusterScore = score;
          topClusterId = cId;
        }
      }
    }

    const cluster = MUSIFY_CULTURE_CLUSTERS.find(c => c.id === topClusterId) || MUSIFY_CULTURE_CLUSTERS[0];

    // Find top artist
    let topArtist = "";
    let maxArtistScore = 0;
    if (profile.artists) {
      for (const [art, score] of Object.entries(profile.artists)) {
        if (score > maxArtistScore) {
          maxArtistScore = score;
          topArtist = art;
        }
      }
    }

    // Build personalized shelf cards
    const personalizedCards = [
      {
        id: "mix_cluster",
        title: `Mix ${cluster.name.split(',')[0]}`,
        subtitle: "Based on your listening taste",
        artwork: getMasterAvatar(topArtist || cluster.keywords[0]),
        action: () => {
          this.searchOnlineMusic(cluster.searchQueries[0] || cluster.keywords[0]);
          this.showToast(`Loading culture mix: ${cluster.name}`);
        }
      },
      {
        id: "mix_radio",
        title: topArtist ? `Artist Radio: ${topArtist}` : "Taste Radio",
        subtitle: "Curated seamless vibe matching your flow",
        artwork: getMasterAvatar(topArtist || cluster.keywords[1] || "The Weeknd"),
        action: () => {
          const query = topArtist ? `${topArtist} official audio` : cluster.searchQueries[0];
          this.searchOnlineMusic(query);
          this.showToast(`Starting artist radio: ${topArtist || 'Personalized'}`);
        }
      },
      {
        id: "mix_senja",
        title: "Exclusive Acoustic & Chill Sessions",
        subtitle: "Warm acoustic instruments & clean vocals",
        artwork: "https://i.ytimg.com/vi/7jY7lS1RkmM/hqdefault.jpg",
        action: () => {
          this.searchOnlineMusic("acoustic guitar chill session");
          this.showToast("Loading chill & acoustic collection...");
        }
      }
    ];

    if (this.personalizedShelfTitle) {
      this.personalizedShelfTitle.textContent = topArtist ? `Your Taste Mix: ${topArtist} & Similar` : "Made For You";
    }

    this.personalizedShelfRow.innerHTML = "";
    personalizedCards.forEach(c => {
      const cardEl = document.createElement("div");
      cardEl.className = "curated-playlist-card";
      cardEl.innerHTML = `
        <div class="curated-card-cover-wrapper">
          <img src="${c.artwork}" alt="${c.title}" class="curated-card-cover" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
          <div class="curated-card-play-overlay">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
          </div>
        </div>
        <div class="curated-card-info">
          <div class="personalized-badge">TASTE MIX</div>
          <div class="curated-card-title" title="${c.title}">${c.title}</div>
          <div class="curated-card-author">${c.subtitle}</div>
        </div>
      `;
      cardEl.addEventListener("click", () => c.action());
      this.personalizedShelfRow.appendChild(cardEl);
    });

    this.personalizedShelfSection.style.display = "block";
  }

  // =========================================================================
  // Your Library (Unified Collection: Liked, Downloads, Albums, Artists, Playlists)
  // =========================================================================
  renderLibraryView() {
    if (this.librarySubtitle) {
      this.librarySubtitle.textContent = this.currentLanguage === "id"
        ? "Kelola lagu favorit, musik offline, album tersimpan, dan artis yang diikuti"
        : "Manage your favorite tracks, offline music, albums, and followed artists";
    }

    this.renderLibraryLikedSongs();
    this.loadDownloadedTracksView();
    this.renderLibraryAlbums();
    this.renderLibraryArtists();
    this.renderLibraryPlaylists();

    this.switchLibraryTab(this.activeLibraryTab || "all");
  }

  switchLibraryTab(tab = "all") {
    this.activeLibraryTab = tab;

    if (this.libFilterPills) {
      this.libFilterPills.forEach(pill => {
        if (pill.dataset.libTab === tab) {
          pill.classList.add("active");
        } else {
          pill.classList.remove("active");
        }
      });
    }

    const showAll = tab === "all";
    if (this.libLikedSection) this.libLikedSection.style.display = (showAll || tab === "liked") ? "block" : "none";
    if (this.libDownloadsSection) this.libDownloadsSection.style.display = (showAll || tab === "downloads") ? "block" : "none";
    if (this.libAlbumsSection) this.libAlbumsSection.style.display = (showAll || tab === "albums") ? "block" : "none";
    if (this.libArtistsSection) this.libArtistsSection.style.display = (showAll || tab === "artists") ? "block" : "none";
    if (this.libPlaylistsSection) this.libPlaylistsSection.style.display = (showAll || tab === "playlists") ? "block" : "none";
  }

  renderLibraryLikedSongs() {
    if (!this.libLikedList) return;
    const liked = JSON.parse(localStorage.getItem("sorafy_liked_tracks") || "[]");
    const count = liked.length;

    if (this.libLikedCount) {
      this.libLikedCount.textContent = this.currentLanguage === "id" ? `${count} lagu` : `${count} songs`;
    }

    if (count === 0) {
      this.libLikedList.innerHTML = "";
      if (this.libLikedEmpty) this.libLikedEmpty.style.display = "block";
      if (this.libLikedActions) this.libLikedActions.style.display = "none";
      return;
    }

    if (this.libLikedEmpty) this.libLikedEmpty.style.display = "none";
    if (this.libLikedActions) this.libLikedActions.style.display = "flex";

    this.libLikedList.innerHTML = "";
    liked.forEach((track, idx) => {
      const isCurrentActive = this.tracks[this.currentTrackIndex]?.id === track.id;
      const row = document.createElement("div");
      row.className = `track-row ${isCurrentActive ? "active" : ""}`;
      row.id = `lib_liked_row_${track.id}`;

      const artUrl = track.artwork_url || this.DEFAULT_TRACK_ART;
      const durSecs = track.duration_secs || track.duration || 0;
      const durStr = this.formatDuration ? this.formatDuration(durSecs) : `${Math.floor(durSecs / 60)}:${String(Math.floor(durSecs % 60)).padStart(2, '0')}`;

      row.innerHTML = `
        <div class="track-row-num" style="display: flex; align-items: center; justify-content: center; width: 28px;">
          <span class="num-text">${idx + 1}</span>
          <iconsax-icon class="play-icon" name="play" type="bold" size="14" color="#00E599"></iconsax-icon>
        </div>
        <div class="track-row-art-box" style="position: relative; width: 42px; height: 42px; border-radius: 8px; overflow: hidden; background: #181D24; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <img src="${artUrl}" alt="${this.escapeHtml(track.title)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
        </div>
        <div class="track-row-info" style="flex: 1; min-width: 0;">
          <div class="track-row-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; font-size: 14px;">${this.escapeHtml(track.title)}</div>
          <div class="track-row-artist" style="font-size: 12px; color: var(--color-text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${this.escapeHtml(track.artist || 'Unknown Artist')}</div>
        </div>
        <div style="font-size: 12px; color: var(--color-text-secondary); min-width: 50px; text-align: right; margin-right: 12px;">${durStr}</div>
        <div class="track-row-actions" style="display: flex; align-items: center; gap: 6px;">
          <button class="control-btn lib-unlike-btn" title="Remove from Liked Songs" style="padding: 6px; color: #EF4444;">
            <iconsax-icon name="heart" type="bold" size="16" color="#EF4444"></iconsax-icon>
          </button>
        </div>
      `;

      row.addEventListener("click", (e) => {
        if (e.target.closest(".lib-unlike-btn")) return;
        this.tracks = [...liked];
        this.loadTrack(idx, true);
      });

      const unlikeBtn = row.querySelector(".lib-unlike-btn");
      if (unlikeBtn) {
        unlikeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.toggleLikeTrack(track);
          this.renderLibraryLikedSongs();
        });
      }

      this.libLikedList.appendChild(row);
    });
  }

  renderLibraryAlbums() {
    if (!this.libAlbumsGrid) return;
    const albums = Array.isArray(this.likedAlbums) ? this.likedAlbums : [];
    const count = albums.length;

    if (this.libAlbumsCount) {
      this.libAlbumsCount.textContent = this.currentLanguage === "id" ? `${count} album` : `${count} albums`;
    }

    if (count === 0) {
      this.libAlbumsGrid.innerHTML = "";
      if (this.libAlbumsEmpty) this.libAlbumsEmpty.style.display = "block";
      return;
    }

    if (this.libAlbumsEmpty) this.libAlbumsEmpty.style.display = "none";
    this.libAlbumsGrid.innerHTML = "";

    albums.forEach(album => {
      const card = document.createElement("div");
      card.className = "curated-playlist-card";
      const artUrl = album.artwork_url || this.DEFAULT_TRACK_ART;
      const subtitle = album.artist ? (album.year ? `${album.artist} • ${album.year}` : album.artist) : "Album";

      card.innerHTML = `
        <div class="curated-card-cover-wrapper">
          <img src="${artUrl}" alt="${this.escapeHtml(album.title)}" class="curated-card-cover" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
          <div class="curated-card-play-overlay">
            <iconsax-icon name="play" type="bold" size="20" color="#07080A"></iconsax-icon>
          </div>
        </div>
        <div class="curated-card-info">
          <div class="curated-card-title" title="${this.escapeHtml(album.title)}">${this.escapeHtml(album.title)}</div>
          <div class="curated-card-author" title="${this.escapeHtml(subtitle)}">${this.escapeHtml(subtitle)}</div>
        </div>
      `;

      card.addEventListener("click", () => {
        this.openAlbumDetail(album);
      });

      const playOverlay = card.querySelector(".curated-card-play-overlay");
      if (playOverlay) {
        playOverlay.addEventListener("click", async (e) => {
          e.stopPropagation();
          await this.openAlbumDetail(album);
          if (album.tracks && album.tracks.length > 0) {
            this.tracks = [...album.tracks];
            this.loadTrack(0, true);
          }
        });
      }

      this.libAlbumsGrid.appendChild(card);
    });
  }

  renderLibraryArtists() {
    if (!this.libArtistsGrid) return;
    const artistKeys = Array.isArray(this.followedArtists)
      ? this.followedArtists
      : Array.from(this.followedArtists || []);
    const count = artistKeys.length;

    if (this.libArtistsCount) {
      this.libArtistsCount.textContent = this.currentLanguage === "id" ? `${count} artis` : `${count} artists`;
    }

    if (count === 0) {
      this.libArtistsGrid.innerHTML = "";
      if (this.libArtistsEmpty) this.libArtistsEmpty.style.display = "block";
      return;
    }

    if (this.libArtistsEmpty) this.libArtistsEmpty.style.display = "none";
    this.libArtistsGrid.innerHTML = "";

    artistKeys.forEach(artKey => {
      const details = (this.followedArtistDetails && this.followedArtistDetails[artKey]) || {};
      const artName = details.name || artKey;
      const avatarUrl = details.avatar_url || "";
      const browseId = details.browse_id || "";

      const card = document.createElement("div");
      card.className = "library-artist-card";

      const avatarMarkup = avatarUrl
        ? `<img src="${avatarUrl}" alt="${this.escapeHtml(artName)}" class="library-artist-avatar" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(artName)}&background=181D24&color=00E599';">`
        : `<div class="library-artist-avatar" style="display:flex; align-items:center; justify-content:center; background:#181D24;"><iconsax-icon name="user" type="bold" size="36" color="#00E599"></iconsax-icon></div>`;

      card.innerHTML = `
        ${avatarMarkup}
        <div class="library-artist-name" title="${this.escapeHtml(artName)}">${this.escapeHtml(artName)}</div>
        <div class="library-artist-sub">${this.currentLanguage === "id" ? "Artis" : "Artist"}</div>
        <button class="library-artist-follow-btn following" title="Unfollow">
          <iconsax-icon name="tick-circle" type="bold" size="14" color="#00E599"></iconsax-icon>
          <span>${this.currentLanguage === "id" ? "Mengikuti" : "Following"}</span>
        </button>
      `;

      card.addEventListener("click", (e) => {
        if (e.target.closest(".library-artist-follow-btn")) return;
        this.openArtistDetail(artName, browseId);
      });

      const unfollowBtn = card.querySelector(".library-artist-follow-btn");
      if (unfollowBtn) {
        unfollowBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const lowerName = artName.toLowerCase();
          this.followedArtists.delete(lowerName);
          if (this.followedArtistDetails) delete this.followedArtistDetails[lowerName];

          localStorage.setItem("sorafy_followed_artists", JSON.stringify([...this.followedArtists]));
          localStorage.setItem("sorafy_followed_artist_details", JSON.stringify(this.followedArtistDetails));

          this.showToast(this.currentLanguage === "id" ? `Berhenti mengikuti ${artName}` : `Unfollowed ${artName}`);
          this.renderLibraryArtists();
          this.fetchYtmNewReleases();
          this.fetchMusicfyRecommendations();
        });
      }

      this.libArtistsGrid.appendChild(card);
    });
  }

  renderLibraryPlaylists() {
    if (!this.libPlaylistsGrid) return;
    const playlists = (this.userPlaylists || []).filter(pl => pl && pl.id && pl.id !== "upl_favorites" && pl.title !== "Lagu Santai Saya");
    const count = playlists.length;

    if (this.libPlaylistsCount) {
      this.libPlaylistsCount.textContent = `${count} playlists`;
    }

    this.libPlaylistsGrid.innerHTML = "";

    playlists.forEach(pl => {
      const card = document.createElement("div");
      card.className = "curated-playlist-card";
      const trackCount = pl.tracks?.length || 0;
      const artUrl = pl.artwork_url || (pl.tracks?.[0]?.artwork_url) || this.DEFAULT_TRACK_ART;

      card.innerHTML = `
        <div class="curated-card-cover-wrapper">
          <img src="${artUrl}" alt="${this.escapeHtml(pl.title)}" class="curated-card-cover" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
          <div class="curated-card-play-overlay">
            <iconsax-icon name="play" type="bold" size="20" color="#07080A"></iconsax-icon>
          </div>
        </div>
        <div class="curated-card-info">
          <div class="curated-card-title" title="${this.escapeHtml(pl.title)}">${this.escapeHtml(pl.title)}</div>
          <div class="curated-card-author">${trackCount} ${trackCount === 1 ? 'track' : 'tracks'}</div>
        </div>
      `;

      card.addEventListener("click", () => {
        this.openPlaylistDetail(pl);
      });

      const playOverlay = card.querySelector(".curated-card-play-overlay");
      if (playOverlay) {
        playOverlay.addEventListener("click", (e) => {
          e.stopPropagation();
          if (pl.tracks && pl.tracks.length > 0) {
            this.tracks = [...pl.tracks];
            this.loadTrack(0, true);
          } else {
            this.openPlaylistDetail(pl);
          }
        });
      }

      this.libPlaylistsGrid.appendChild(card);
    });
  }

  isAlbumLiked(album) {
    if (!album) return false;
    const albId = String(album.id || album.browse_id || "");
    const titleKey = `${(album.title || "").toLowerCase()}::${(album.artist || "").toLowerCase()}`;
    return (this.likedAlbums || []).some(a => {
      if (!a) return false;
      const currentId = String(a.id || a.browse_id || "");
      if (albId && currentId && albId === currentId) return true;
      const existingKey = `${(a.title || "").toLowerCase()}::${(a.artist || "").toLowerCase()}`;
      return existingKey === titleKey;
    });
  }

  toggleLikeAlbum(album = null) {
    const targetAlbum = album || this.currentPlaylist;
    if (!targetAlbum || !targetAlbum.title) return;

    const isLiked = this.isAlbumLiked(targetAlbum);
    let likedAlbums = Array.isArray(this.likedAlbums) ? [...this.likedAlbums] : [];
    const albId = String(targetAlbum.id || targetAlbum.browse_id || "");
    const titleKey = `${(targetAlbum.title || "").toLowerCase()}::${(targetAlbum.artist || "").toLowerCase()}`;

    if (isLiked) {
      likedAlbums = likedAlbums.filter(a => {
        if (!a) return false;
        const currentId = String(a.id || a.browse_id || "");
        if (albId && currentId && albId === currentId) return false;
        const existingKey = `${(a.title || "").toLowerCase()}::${(a.artist || "").toLowerCase()}`;
        return existingKey !== titleKey;
      });
      this.likedAlbums = likedAlbums;
      localStorage.setItem("sorafy_liked_albums", JSON.stringify(this.likedAlbums));
      this.updateAlbumLikeButton(targetAlbum);
      this.showToast(this.currentLanguage === "id" ? "Album dihapus dari koleksi" : "Album removed from library");
    } else {
      const albumObj = {
        id: targetAlbum.id || targetAlbum.browse_id || `alb_${Date.now()}`,
        browse_id: targetAlbum.browse_id || targetAlbum.id || "",
        title: targetAlbum.title,
        artist: targetAlbum.artist || "Unknown Artist",
        artwork_url: targetAlbum.artwork_url || this.DEFAULT_TRACK_ART,
        year: targetAlbum.year || "",
        savedAt: Date.now()
      };
      likedAlbums.unshift(albumObj);
      this.likedAlbums = likedAlbums;
      localStorage.setItem("sorafy_liked_albums", JSON.stringify(this.likedAlbums));
      this.updateAlbumLikeButton(targetAlbum);
      this.showToast(this.currentLanguage === "id" ? "Album disimpan ke koleksi" : "Album saved to library");
    }

    if (this.currentView === "library") {
      this.renderLibraryAlbums();
    }

    // Refresh recommendations to reflect updated taste weights
    this.fetchYtmNewReleases();
    this.fetchMusicfyRecommendations();
  }

  updateAlbumLikeButton(album = null) {
    if (!this.playlistLikeAlbumBtn) return;
    const targetAlbum = album || this.currentPlaylist;
    if (!targetAlbum) return;

    const isLiked = this.isAlbumLiked(targetAlbum);
    const heartIcon = this.playlistLikeAlbumBtn.querySelector("iconsax-icon");

    if (isLiked) {
      this.playlistLikeAlbumBtn.classList.add("active");
      this.playlistLikeAlbumBtn.style.color = "#EF4444";
      this.playlistLikeAlbumBtn.style.borderColor = "rgba(239, 68, 68, 0.4)";
      if (heartIcon) {
        heartIcon.setAttribute("type", "bold");
        heartIcon.setAttribute("color", "#EF4444");
      }
      if (this.playlistLikeAlbumLabel) {
        this.playlistLikeAlbumLabel.textContent = this.currentLanguage === "id" ? "Disimpan" : "Saved";
      }
    } else {
      this.playlistLikeAlbumBtn.classList.remove("active");
      this.playlistLikeAlbumBtn.style.color = "currentColor";
      this.playlistLikeAlbumBtn.style.borderColor = "rgba(255, 255, 255, 0.12)";
      if (heartIcon) {
        heartIcon.setAttribute("type", "linear");
        heartIcon.setAttribute("color", "currentColor");
      }
      if (this.playlistLikeAlbumLabel) {
        this.playlistLikeAlbumLabel.textContent = this.currentLanguage === "id" ? "Simpan Album" : "Save Album";
      }
    }
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  window.sorafyApp = new SoraFyDesktopApp();

  // Hardware Media Keys & OS Tray Action Hook
  if (window.electronAPI && typeof window.electronAPI.onMediaAction === 'function') {
    window.electronAPI.onMediaAction((action) => {
      if (!window.sorafyApp) return;
      if (action === 'play-pause') {
        window.sorafyApp.togglePlayPause();
      } else if (action === 'next') {
        window.sorafyApp.playNext();
      } else if (action === 'prev') {
        window.sorafyApp.playPrevious();
      } else if (action === 'stop') {
        if (window.sorafyApp.audio && !window.sorafyApp.audio.paused) {
          window.sorafyApp.togglePlayPause();
        }
      }
    });
  }
});
