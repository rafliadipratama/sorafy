// SoraFy Desktop Core Frontend Controller
// Domain-Driven Design (DDD) Client with Real Multi-Provider Search, 
// Live Streaming Playback, LRCLIB Synced Lyrics & Studio Equalizer DSP
// Musicfy Recommendation & Discovery Algorithm Engine

let _deckStateModule = null;
function getAudioDeckStateHelper() {
  if (_deckStateModule) return _deckStateModule;
  if (typeof window !== "undefined" && window.AudioDeckState) return window.AudioDeckState;
  try {
    if (typeof require !== "undefined") {
      _deckStateModule = require("./modules/audio-deck-state");
      return _deckStateModule;
    }
  } catch (_) {}
  return null;
}

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
    id: "mcp_server",
    name: "Model Context Protocol (MCP)",
    version: "2.0.0",
    author: "Anthropic / Model Context Protocol",
    description: "Built-in Streamable HTTP & SSE MCP server on port 8800. Enables AI assistants (Claude, Cursor, Windsurf) to play music, manage queue, and inspect lyrics.",
    category: "Tools & Utilities",
    icon: '<iconsax-icon name="cpu" type="bold" size="24" color="#00E599"></iconsax-icon>',
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
  },
  {
    id: "mpd_daemon",
    name: "Music Player Daemon (MPD)",
    version: "0.23.5",
    author: "MPD Protocol Spec",
    description: "Built-in TCP socket server on port 6600. Allows standard Linux audio tools (mpc, ncmpcpp, mpDris2) to control playback and view library/queue.",
    category: "Tools & Utilities",
    icon: '<iconsax-icon name="setting-4" type="bold" size="24" color="#38BDF8"></iconsax-icon>',
    is_enabled: true
  }
];

const EQ_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
const EQ_BAND_ROLES = [
  "Sub-Bass",
  "Bass",
  "Upper Bass",
  "Warmth",
  "Low Mid",
  "Mid Body",
  "Clarity",
  "Presence",
  "Brilliance",
  "Air"
];
const EQ_PRESETS = {
  "Flat": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "Hi-Fi Clarity": [2.5, 2.0, 1.0, -0.5, 0.0, 1.5, 2.0, 3.0, 3.5, 4.0],
  "Bass Boost": [7.0, 6.0, 4.0, 1.5, 0.0, 0.0, 0.5, 1.0, 1.5, 2.0],
  "Acoustic & Classical": [1.5, 2.0, 1.5, 0.0, 1.0, 2.0, 2.5, 3.0, 3.5, 3.0],
  "Warm Tube Sound": [3.5, 3.0, 2.0, 1.0, 0.5, 0.0, -0.5, -1.0, -1.5, -2.0],
  "Vocal & Acoustic": [-1.5, -0.5, 0.5, 2.0, 3.5, 4.0, 3.0, 1.5, 0.5, 0.0],
  "Electronic / EDM": [6.0, 5.0, 2.5, 0.0, -1.0, 1.5, 3.0, 4.0, 4.5, 5.0],
  "Rock & Metal": [4.5, 3.5, 1.5, -0.5, 1.0, 2.5, 4.0, 3.5, 3.0, 3.5],
  "Late Night / Headphone": [4.0, 3.0, 1.5, 0.0, 0.0, 0.0, 1.0, 2.0, 3.0, 3.5]
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

// =========================================================
// Advanced Lyrics Engine (Phase 4):
// Word-Level Timing & Enhanced LRC
// =========================================================
function parseLrc(lrcText) {
  if (!lrcText) return [];
  const lines = lrcText.split("\n");
  const result = [];
  const lineRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;
  const wordTagRegex = /<(\d{2}):(\d{2})\.(\d{2,3})>([^<]+)/g;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = lineRegex.exec(line);
    if (!match) continue;

    const min = parseInt(match[1], 10);
    const sec = parseInt(match[2], 10);
    const ms = parseInt(match[3].padEnd(3, '0').slice(0, 3), 10);
    const timestamp_ms = (min * 60 + sec) * 1000 + ms;
    const rawText = match[4].trim();
    if (!rawText) continue;

    let words = [];
    let cleanText = '';
    if (rawText.includes('<') && rawText.includes('>')) {
      let wMatch;
      while ((wMatch = wordTagRegex.exec(rawText)) !== null) {
        const wMin = parseInt(wMatch[1], 10);
        const wSec = parseInt(wMatch[2], 10);
        const wMs = parseInt(wMatch[3].padEnd(3, '0').slice(0, 3), 10);
        const startMs = (wMin * 60 + wSec) * 1000 + wMs;
        const wordStr = wMatch[4].trim();
        if (wordStr) {
          words.push({ word: wordStr, startMs, endMs: startMs + 400 });
        }
      }
      for (let w = 0; w < words.length - 1; w++) {
        words[w].endMs = words[w + 1].startMs;
      }
      cleanText = words.map(w => w.word).join(' ');
    }

    if (!cleanText) {
      cleanText = rawText.replace(/<[^>]+>/g, '').trim();
    }

    result.push({
      timestamp_ms,
      text: cleanText,
      words: words.length > 0 ? words : null
    });
  }

  // Synthesize proportional syllable / word timing for lines without explicit word tags
  for (let i = 0; i < result.length; i++) {
    const cur = result[i];
    const next = result[i + 1];
    const nextTime = next ? next.timestamp_ms : cur.timestamp_ms + 4000;
    const durationMs = Math.max(800, Math.min(8000, nextTime - cur.timestamp_ms));
    cur.durationMs = durationMs;

    if (!cur.words || cur.words.length === 0) {
      const parts = cur.text.split(/(\s+)/).filter(p => p.trim().length > 0);
      if (parts.length > 0) {
        const perWord = durationMs / parts.length;
        cur.words = parts.map((w, idx) => ({
          word: w,
          startMs: cur.timestamp_ms + idx * perWord,
          endMs: cur.timestamp_ms + (idx + 1) * perWord
        }));
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

// =========================================================
// Nuclear Feature 6: Theme Presets & Color Tokens
// =========================================================
const THEME_PRESETS = {
  emerald: {
    name: "SoraFy Emerald",
    isDark: true,
    accent: "#00E599",
    secondary: "#00B377",
    tokens: {
      "--color-surface-canvas": "#07080A",
      "--color-surface-container": "#121519",
      "--color-surface-elevated": "#1A1E24",
      "--color-surface-overlay": "rgba(7, 8, 10, 0.92)",
      "--color-text-primary": "#FFFFFF",
      "--color-text-secondary": "#9AA0A6",
      "--color-text-tertiary": "#5F6368",
      "--color-border": "rgba(255, 255, 255, 0.08)",
      "--color-border-subtle": "rgba(255, 255, 255, 0.05)"
    }
  },
  arctic: {
    name: "Arctic Obsidian",
    isDark: true,
    accent: "#E0E0E0",
    secondary: "#B0B0B0",
    tokens: {
      "--color-surface-canvas": "#000000",
      "--color-surface-container": "#0C0C0C",
      "--color-surface-elevated": "#161616",
      "--color-surface-overlay": "rgba(0, 0, 0, 0.94)",
      "--color-text-primary": "#FFFFFF",
      "--color-text-secondary": "#A0A0A0",
      "--color-text-tertiary": "#666666",
      "--color-border": "rgba(255, 255, 255, 0.10)",
      "--color-border-subtle": "rgba(255, 255, 255, 0.06)"
    }
  },
  cyber: {
    name: "Lagoon Cyber",
    isDark: true,
    accent: "#00D2FF",
    secondary: "#0099CC",
    tokens: {
      "--color-surface-canvas": "#070D18",
      "--color-surface-container": "#0C1424",
      "--color-surface-elevated": "#142038",
      "--color-surface-overlay": "rgba(7, 13, 24, 0.94)",
      "--color-text-primary": "#EAF2FD",
      "--color-text-secondary": "#7E97B8",
      "--color-text-tertiary": "#4A5D78",
      "--color-border": "rgba(0, 210, 255, 0.14)",
      "--color-border-subtle": "rgba(0, 210, 255, 0.08)"
    }
  },
  purple: {
    name: "Aurora Purple",
    isDark: true,
    accent: "#A855F7",
    secondary: "#9333EA",
    tokens: {
      "--color-surface-canvas": "#0D0714",
      "--color-surface-container": "#160E22",
      "--color-surface-elevated": "#231535",
      "--color-surface-overlay": "rgba(13, 7, 20, 0.94)",
      "--color-text-primary": "#F5EEFD",
      "--color-text-secondary": "#A592BD",
      "--color-text-tertiary": "#6B5780",
      "--color-border": "rgba(168, 85, 247, 0.14)",
      "--color-border-subtle": "rgba(168, 85, 247, 0.08)"
    }
  },
  light: {
    name: "Oasis Light",
    isDark: false,
    accent: "#00A86B",
    secondary: "#00875A",
    tokens: {
      "--color-surface-canvas": "#F8F9FA",
      "--color-surface-container": "#FFFFFF",
      "--color-surface-elevated": "#EEF1F5",
      "--color-surface-overlay": "rgba(248, 249, 250, 0.95)",
      "--color-text-primary": "#12151A",
      "--color-text-secondary": "#5F6775",
      "--color-text-tertiary": "#8A94A6",
      "--color-border": "rgba(0, 0, 0, 0.08)",
      "--color-border-subtle": "rgba(0, 0, 0, 0.05)"
    }
  }
};

const I18N_DICTIONARY = {
  en: {
    nav_home: "Home",
    nav_explore: "Explore",
    nav_plugins: "Plugins & Extensions",
    nav_equalizer: "DSP Equalizer",
    nav_stats: "Listening Stats",
    nav_settings: "Settings",
    nav_downloads: "Downloads",
    nav_library: "Your Library",
    library_title: "Your Library",
    sidebar_playlists: "My Library",
    sidebar_library: "My Library",
    lib_filter_all: "All",
    lib_filter_playlists: "Playlists",
    lib_filter_artists: "Artists",
    lib_filter_albums: "Albums",
    quick_picks: "Listen Again",
    quick_picks_sub: "RECENTLY PLAYED",
    recommended: "Recommended For You",
    recommended_sub: "SIMILAR TO YOUR TASTE",
    trending_community: "Featured Playlists",
    featured_playlists: "Featured Playlists",
    featured_playlists_sub: "Official curated editorial playlists",
    section_top_charts: "Top Charts & Trending",
    section_top_charts_sub: "Official weekly & daily most streamed songs updated automatically",
    new_releases: "Albums Recommended For You",
    recommended_albums: "Albums Recommended For You",
    recommended_albums_sub: "Based on songs and artists you listen to frequently",
    music_videos: "Music Videos",
    offline_notice: "You are currently offline. Local cache playback is active.",

    // Explore View
    explore_charts_title: "Top Charts & Trending",
    explore_charts_desc: "The most streamed songs in Indonesia and around the world",
    explore_moods_title: "Moods & Genres",
    explore_moods_desc: "Music carefully curated for every feeling and occasion",
    explore_new_releases_title: "New Releases",
    explore_new_releases_desc: "Fresh albums and tracks released this week",
    explore_charts: "Top Charts",
    explore_new_releases: "New Releases",
    explore_moods: "Moods & Genres",
    explore_trends_sub: "The most played songs right now",
    explore_top_charts: "Top Charts & Trending",
    explore_all_categories: "All Moods & Genres",
    explore_new_albums: "New Album Releases",
    explore_see_all: "See All",

    // Search and Categories
    search_placeholder: "Search songs, artists, music videos, or playlists...",
    search_suggestions_title: "Search Suggestions",
    recent_searches_title: "Recent Searches",
    clear_recent_searches: "Clear All",
    category_all: "All",
    category_pop_indo: "Indonesian Pop",
    category_relax: "Relax & Chill",
    category_indie: "Indie",
    category_focus: "Focus & Study",
    category_workout: "Workout & Energy",
    category_sleep: "Sleep & Rest",
    genre_pop: "Indonesian Pop",
    genre_chill: "Relax & Chill",
    genre_indie: "Indie",
    genre_focus: "Focus & Study",
    genre_workout: "Workout & Energy",
    col_title_artist: "Title & Artist",
    col_duration: "Duration",
    search_results_title: "Search Results",
    search_top_result: "Top Result",
    search_related_artists: "Related Artists",
    search_albums_eps: "Official Albums & EPs",
    search_videos_live: "Music Videos & Live Sessions",
    search_playlists_collections: "Playlists & Collections",
    search_songs_list: "Songs",
    tab_all: "All",
    songs: "Songs",
    artists: "Artists",
    albums: "Albums",
    videos: "Videos",
    playlists: "Playlists",
    tab_liked_songs: "Liked Songs",
    tab_downloads: "Downloads",
    tab_albums: "Albums",
    tab_artists: "Artists",
    tab_playlists: "Playlists",

    // Artist & Playlist Screen
    btn_back: "Back",
    artist_popular_tracks: "Popular Tracks",
    artist_videos_title: "Official Music Videos & Live Sessions",
    artist_albums_title: "Albums & Discography",
    artist_fans_like: "Fans Also Like",
    btn_play_all: "Play All",
    btn_shuffle: "Shuffle",
    btn_like_album: "Like Album",
    btn_liked_album: "Liked Album",
    liked_albums_empty: "No liked albums yet. Browse albums and click the heart icon to save them to your library.",
    followed_artists_empty: "You are not following any artists yet. Click '+ Follow' on an artist profile to tune your recommendations.",
    downloads_title: "Downloaded Music",
    downloads_empty_title: "No downloaded tracks yet",
    downloads_empty_desc: "Right-click any song while online and choose 'Download Track (MP3)' to listen offline anytime.",
    btn_open_folder: "Open Folder",
    btn_view_downloads: "View Downloads",
    no_tracks: "No tracks in this playlist yet.",

    // Listening Stats & Music Recap
    stats_main_title: "Listening Stats & Recap",
    stats_sub_title: "Track habits, favorite artists, and listening rhythm privately.",
    stats_range_all: "All Time",
    stats_range_1y: "1 Year",
    stats_range_30d: "30 Days",
    stats_range_7d: "7 Days",
    stats_badge_top_artist: "👑 TOP ARTIST",
    stats_badge_top_track: "🔥 FAVORITE TRACK",
    stats_badge_vibe: "✨ LISTENING VIBE",
    stats_total_time: "Total Listening Time",
    stats_total_tracks: "Tracks Played",
    stats_unique_artists: "Unique Artists",
    stats_daily_average: "Daily Average",
    stats_activity_chart_title: "Weekly Music Activity Rhythm",
    stats_activity_chart_desc: "Daily listening duration visualized as an audio equalizer rhythm.",
    stats_day_rhythm_title: "Listening Habit Character",
    stats_day_rhythm_desc: "When you stream music most frequently across the 24-hour day.",
    stats_top_artists_title: "Top 10 Most Streamed Artists",
    stats_top_tracks_title: "Top 10 Favorite Tracks",
    stats_recent_history_title: "Recently Played History",
    stats_recent_history_desc: "Tracks that recently finished streaming.",
    stats_clear_btn: "Clear History",

    // Screen Player & Drawers
    player_mode_song: "Song",
    player_mode_video: "Video",
    audio_mode: "Audio Mode",
    side_tab_lyrics: "Lyrics",
    side_tab_queue: "Queue",
    side_queue_clear: "Clear",
    side_clear_queue: "Clear",
    side_queue_now_playing: "NOW PLAYING",
    queue_now_playing: "NOW PLAYING",
    side_queue_up_next: "UP NEXT",
    queue_next: "UP NEXT",
    side_lyrics_search_placeholder: "Search lyrics or jump to line...",
    lyrics_search_placeholder: "Search lyrics or jump to line...",
    lyrics_search_done: "Done",
    select_track_prompt: "Select a track to play",

    // Bottom Player Tooltips
    tooltip_expand: "Open Fullscreen Player",
    tooltip_sidebar_import: "Import Hub: Spotify, Apple Music & YouTube",
    tooltip_sidebar_create: "Create New Playlist",
    tooltip_verify_stream: "Verify Audio Recording (Candidate)",
    tooltip_like: "Like Track",
    tooltip_shuffle: "Shuffle",
    tooltip_prev: "Previous",
    tooltip_play_pause: "Play / Pause",
    tooltip_next: "Next",
    tooltip_repeat: "Repeat",
    tooltip_sleep_timer: "Sleep Timer",
    tooltip_mute: "Mute / Unmute",
    tooltip_refresh_automix: "Refresh Automix Radio Queue",

    // Settings Modal
    settings_title: "SoraFy Settings",
    settings_search_placeholder: "Search settings",
    settings_cat_audio: "AUDIO & STREAMING",
    settings_cat_app: "APP SETTINGS",
    settings_cat_storage: "STORAGE & ABOUT",
    settings_desc_audio: "Configure streaming quality, volume normalization, and track transitions.",
    settings_desc_sources: "Manage track metadata sources, artwork quality, and streaming backends.",
    settings_desc_appearance: "Customize interface theme and custom accent colors.",
    settings_desc_system: "Window options, Discord Rich Presence, and developer APIs.",
    settings_desc_data: "Cache management, YouTube cookies, companion engine, and backup.",
    settings_desc_shortcuts: "Keyboard keybinds for controlling playback anywhere in the app.",
    settings_desc_plugins: "Manage streaming audio providers, synchronized lyrics sources, DSP audio engines, and extensions.",
    settings_desc_equalizer: "Calibrated 10-band ISO octave equalizer, headroom control, and acoustic DSP modules.",
    settings_desc_about: "Desktop application information, version status, and updates.",
    settings_tab_audio: "Audio & Quality",
    settings_tab_equalizer: "Equalizer & DSP",
    settings_tab_sources: "Sources & Metadata",
    settings_tab_appearance: "Appearance & Theme",
    settings_tab_system: "System",
    settings_tab_data: "Data & Backup",
    settings_tab_shortcuts: "Shortcuts",
    settings_tab_plugins: "Plugins & Extensions",
    settings_tab_about: "About",
    setting_metadata_provider: "Primary Metadata Provider",
    setting_metadata_provider_desc: "Select primary service for song titles, artist names, albums, and artwork.",
    setting_stream_source: "Audio Streaming Engine",
    setting_stream_source_desc: "Backend engine used to extract and stream audio playback.",
    setting_title_cleanup: "Automatic Title Cleanup",
    setting_title_cleanup_desc: "Remove noisy tags from YouTube titles like [Official Music Video], (Lyrics), 4K, etc.",
    setting_cover_hd: "High-Resolution Artwork (HD Cover)",
    setting_cover_hd_desc: "Always load maximum resolution album covers (544x544 / 640x640 px).",
    setting_spotify_explore: "Spotify Explore Shelf",
    setting_spotify_explore_desc: "Display Spotify Charts & Curated Playlists in the Explore tab.",
    setting_theme: "Interface Theme",
    setting_theme_desc: "Choose the overall visual theme and color palette.",
    setting_accent: "Custom Accent Color",
    setting_accent_desc: "Customize primary highlights, waveforms, and button accents.",
    setting_language: "Language / Bahasa",
    setting_language_desc: "Select display language for user interface.",
    setting_audio_quality: "Audio Streaming Quality",
    setting_audio_quality_desc: "Select preferred bitrate for playback stream.",
    setting_volume_norm: "Volume Normalization",
    setting_volume_norm_desc: "Equalize loudness levels across tracks automatically.",
    setting_crossfade: "Crossfade Between Tracks",
    setting_crossfade_desc: "Smooth transition when switching to the next track.",
    setting_automix_queue: "Continuous Radio Automix",
    setting_automix_queue_desc: "Automatically append seamlessly matching recommended songs when nearing queue end.",
    setting_close_tray: "Close to System Tray",
    setting_close_tray_desc: "Keep playback running in background when window is closed (X).",
    setting_notifications: "Desktop Track Notifications",
    setting_notifications_desc: "Show pop-up notification when track changes in background.",
    setting_discord_rpc: "Discord Rich Presence",
    setting_discord_rpc_desc: "Show your currently playing track on your Discord profile.",
    setting_discord_activity_name: "Activity Name",
    setting_discord_activity_name_desc: "The name after Listening to, for example Sorafy or Music.",
    setting_discord_display_name: "Display Name",
    setting_discord_display_name_desc: "Choose what appears in your Discord activity status.",
    setting_discord_artist_name: "Artist Name",
    setting_discord_song_title: "Song Title",
    setting_discord_hide_paused: "Hide When Paused",
    setting_discord_hide_paused_desc: "Hide your activity while playback is paused.",
    setting_discord_show_logo: "Show Logo",
    setting_discord_show_logo_desc: "Show the SoraFy logo beside the cover, or on its own.",
    setting_discord_show_cover: "Show Cover",
    setting_discord_show_cover_desc: "Show the current track's cover art.",
    setting_discord_youtube_button: "Show Music Link Button",
    setting_discord_youtube_button_desc: "Show the listening link in your Discord activity.",
    setting_discord_sorafy_button: "Show Get SoraFy Button",
    setting_discord_sorafy_button_desc: "Show the SoraFy download link in your Discord activity.",
    setting_cache_storage: "Audio Cache & Storage",
    setting_cache_storage_desc: "Clear cached audio streams and artworks to free disk space.",
    setting_cache_quota: "Max Cache Quota (LRU)",
    setting_cache_quota_desc: "Automatically evict oldest streams when cache exceeds this limit.",
    setting_cookies_title: "YouTube Cookies (Anti-Bot Bypass)",
    setting_cookies_desc: "Import Netscape cookies.txt to bypass YouTube age gates and IP bot blocks.",
    setting_cookies_hint: "Tip: Export cookies with browser extension 'Get cookies.txt LOCALLY' if YouTube restricts access.",
    setting_ytdlp_title: "Audio Engine Companion (yt-dlp)",
    setting_ytdlp_desc: "Enables local offline MP3 downloads and unlimited 1000+ track playlist imports.",
    setting_backup_all: "Backup All Data",
    setting_backup_all_desc: "Save your custom playlists, liked tracks, listening history, and sound preferences to a secure JSON file.",
    setting_restore_data: "Restore Data",
    setting_restore_data_desc: "Restore your playlists, liked tracks, and listening profile from a previously saved JSON file.",
    setting_mcp_title: "Model Context Protocol (MCP Server)",
    setting_mcp_desc: "Local AI integration for Claude Code, Cursor, Windsurf, and AI assistants.",
    btn_copy_ai_config: "Copy AI Config",
    setting_mpd_title: "Music Player Daemon (MPD Protocol)",
    setting_mpd_desc: "Integrate Linux terminal controls for ncmpcpp, mpc, and mpDris2.",
    btn_copy_cmd: "Copy Command",
    btn_clear_cache: "Clear Cache",
    btn_import_cookies: "Import cookies.txt",
    btn_check_engine: "Check / Download Engine",
    btn_backup_data: "Backup Data (.json)",
    btn_restore_data: "Restore Data",

    // Modals
    import_hub_title: "Import Playlists & Albums",
    import_hub_desc: "Seamlessly import tracks from your favorite streaming platforms without any login required.",
    import_hub_label: "Playlist or Album URL:",
    btn_cancel: "Cancel",
    btn_close: "Close",
    import_hub_start: "Start Import",
    create_playlist_title: "+ Create New Playlist",
    create_playlist_desc: "Name your playlist to organize favorite tracks, chill sessions, or focus mixes.",
    create_playlist_placeholder: "Playlist Name (e.g., Evening Vibes, Deep Focus)",
    create_playlist_desc_placeholder: "Optional description...",
    create_playlist_btn: "Create Playlist",
    edit_playlist_title: "Edit Playlist Details",
    edit_playlist_desc: "Update your playlist's name and description.",
    edit_playlist_placeholder: "Playlist Name",
    btn_save: "Save Changes",
    add_to_playlist_title: "Add to Playlist",
    btn_done: "Done",

    // Sleep Timer
    sleep_timer_title: "Sleep Timer",
    sleep_timer_desc: "Playback will stop automatically after the timer expires.",
    timer_turn_off: "Turn off timer",
    timer_off: "Turn off timer",
    timer_15m: "15 Minutes",
    timer_30m: "30 Minutes",
    timer_45m: "45 Minutes",
    timer_60m: "60 Minutes",
    timer_end_song: "End of this song",

    // Shortcuts
    shortcut_play_pause: "Play / Pause Track",
    shortcut_mute: "Mute / Unmute Volume",
    shortcut_next: "Next Track",
    shortcut_prev: "Previous Track",
    shortcut_seek: "Seek Forward / Backward (5s)",
    shortcut_volume: "Volume Up / Down (5%)",
    shortcut_search: "Focus Search Bar",
    shortcut_lyrics: "Open / Close Lyrics Drawer",
    shortcut_close: "Close Fullscreen Player / Modal",

    // About
    about_version: "Version 2.0.0 • GPL-3.0 License",
    about_desc: "High-resolution streaming music player with real-time synchronized lyrics, DSP equalizer, and multi-platform playlist import.",
    btn_check_update: "Check for Updates",

    // Context Menu
    ctx_start_radio: "Start Radio (Automix)",
    ctx_play_next: "Play Next",
    ctx_add_queue: "Add to Queue",
    ctx_play_now: "Play Now",
    ctx_view_artist: "View Artist Profile",
    ctx_add_playlist: "Add to Playlist",
    ctx_like_track: "Like Track",
    ctx_download_track: "Download Track (MP3)",
    ctx_choose_stream: "Choose Audio Recording (Candidates)",

    // Stream Verification & Jam
    stream_verify_title: "Audio Stream Verification",
    stream_verify_subtitle: "Select verified audio stream for this track",
    stream_searching: "Searching for alternative audio streams...",
    btn_remove_verification: "Remove Verification (Reset to Auto)",

    unit_seconds: "s",
    toast_playing: "Playing",
    toast_added_to_playlist: "Added to playlist",
    toast_removed_from_playlist: "Removed from playlist"
  },
  id: {
    nav_home: "Beranda",
    nav_explore: "Jelajah",
    nav_plugins: "Plugin & Ekstensi",
    nav_equalizer: "DSP Equalizer",
    nav_downloads: "Lagu Tersimpan",
    nav_library: "Koleksi Saya",
    nav_stats: "Statistik Mendengar",
    nav_settings: "Pengaturan",
    library_title: "Koleksi Saya",
    sidebar_playlists: "Koleksi Saya",
    sidebar_library: "Koleksi Saya",
    lib_filter_all: "Semua",
    lib_filter_playlists: "Playlist",
    lib_filter_artists: "Artis",
    lib_filter_albums: "Album",
    quick_picks: "Putar Lagi",
    quick_picks_sub: "TERAKHIR DIDENGARKAN",
    recommended: "Rekomendasi Untuk Anda",
    recommended_sub: "SESUAI DENGAN SELERA ANDA",
    trending_community: "Playlist Pilihan",
    featured_playlists: "Playlist Pilihan",
    featured_playlists_sub: "Playlist resmi terkurasi langsung",
    section_top_charts: "Tangga Lagu & Trending Terkini",
    section_top_charts_sub: "Tangga lagu resmi mingguan & harian terpopuler yang diperbarui otomatis",
    new_releases: "Rekomendasi Album Untukmu",
    recommended_albums: "Rekomendasi Album Untukmu",
    recommended_albums_sub: "Berdasarkan musik yang sering kamu dengarkan",
    music_videos: "Video Musik",
    offline_notice: "Anda sedang offline. Pemutaran cache lokal aktif.",

    // Explore View
    explore_charts_title: "Tangga Lagu & Tren Teratas",
    explore_charts_desc: "Lagu paling banyak diputar di Indonesia dan seluruh dunia",
    explore_moods_title: "Suasana Hati & Genre",
    explore_moods_desc: "Musik pilihan untuk setiap suasana dan momen Anda",
    explore_new_releases_title: "Rilisan Album & Single Baru",
    explore_new_releases_desc: "Album dan karya musik terbaru yang dirilis minggu ini",
    explore_charts: "Tangga Lagu",
    explore_new_releases: "Rilisan Baru",
    explore_moods: "Suasana Hati & Genre",
    explore_trends_sub: "Lagu yang paling banyak diputar saat ini",
    explore_top_charts: "Tangga Lagu & Tren Teratas",
    explore_all_categories: "Semua Suasana Hati & Genre",
    explore_new_albums: "Rilisan Album Baru",
    explore_see_all: "Lihat Semua",

    // Search and Categories
    search_placeholder: "Cari lagu, artis, video musik, atau playlist...",
    search_suggestions_title: "Saran Pencarian",
    recent_searches_title: "Pencarian Terbaru",
    clear_recent_searches: "Hapus Semua",
    category_all: "Semua",
    category_pop_indo: "Pop Indonesia",
    category_relax: "Santai & Tenang",
    category_indie: "Indie",
    category_focus: "Fokus & Belajar",
    category_workout: "Olahraga & Semangat",
    category_sleep: "Tidur & Istirahat",
    genre_pop: "Pop Indonesia",
    genre_chill: "Santai & Tenang",
    genre_indie: "Indie",
    genre_focus: "Fokus & Belajar",
    genre_workout: "Olahraga & Semangat",
    col_title_artist: "Judul Lagu & Artis",
    col_duration: "Durasi",
    search_results_title: "Hasil Pencarian",
    search_top_result: "Hasil Teratas",
    search_related_artists: "Artis Terkait",
    search_albums_eps: "Album & EP Resmi",
    search_videos_live: "Video Musik & Sesi Live",
    search_playlists_collections: "Playlist & Koleksi",
    search_songs_list: "Lagu",
    tab_all: "Semua",
    songs: "Lagu",
    artists: "Artis",
    albums: "Album",
    videos: "Video",
    playlists: "Playlist",
    tab_liked_songs: "Lagu Disukai",
    tab_downloads: "Lagu Terunduh",
    tab_albums: "Album Favorit",
    tab_artists: "Artis Diikuti",
    tab_playlists: "Playlist",

    // Artist & Playlist Screen
    btn_back: "Kembali",
    artist_popular_tracks: "Lagu Populer",
    artist_videos_title: "Video Musik Resmi & Sesi Live",
    artist_albums_title: "Album & Diskografi",
    artist_fans_like: "Penggemar Juga Menyukai",
    btn_play_all: "Putar Semua",
    btn_shuffle: "Acak",
    btn_like_album: "Sukai Album",
    btn_liked_album: "Album Disukai",
    liked_albums_empty: "Belum ada album favorit. Jelajahi album dan klik ikon hati untuk menyimpannya di koleksi Anda.",
    followed_artists_empty: "Anda belum mengikuti artis apa pun. Klik '+ Follow' di profil artis untuk menyesuaikan rekomendasi beranda Anda.",
    downloads_title: "Lagu Tersimpan",
    downloads_empty_title: "Belum ada lagu yang diunduh",
    downloads_empty_desc: "Klik kanan lagu saat online dan pilih 'Download Track (MP3)' untuk mendengarkan secara offline kapan saja.",
    btn_open_folder: "Buka Folder",
    btn_view_downloads: "Lihat Unduhan",
    no_tracks: "Belum ada lagu di playlist ini.",

    // Listening Stats & Music Recap
    stats_main_title: "Statistik & Kilas Musik",
    stats_sub_title: "Pantau kebiasaan, artis favorit, dan ritme mendengarkan musik Anda secara privat.",
    stats_range_all: "Semua Waktu",
    stats_range_1y: "1 Tahun",
    stats_range_30d: "30 Hari",
    stats_range_7d: "7 Hari",
    stats_badge_top_artist: "👑 ARTIS TERATAS",
    stats_badge_top_track: "🔥 LAGU TERFAVORIT",
    stats_badge_vibe: "✨ VIBE MENDENGAR",
    stats_total_time: "Total Waktu Dengar",
    stats_total_tracks: "Lagu Diputar",
    stats_unique_artists: "Artis Berbeda",
    stats_daily_average: "Rata-Rata Harian",
    stats_activity_chart_title: "Aktivitas Musik Mingguan",
    stats_activity_chart_desc: "Durasi waktu mendengarkan musik per hari dalam format equalizer ritme audio.",
    stats_day_rhythm_title: "Karakter Waktu Mendengar",
    stats_day_rhythm_desc: "Pola waktu kapan Anda paling sering memutar musik dalam 24 jam.",
    stats_top_artists_title: "Top 10 Artis Terbanyak Diputar",
    stats_top_tracks_title: "Top 10 Lagu Terfavorit",
    stats_recent_history_title: "Riwayat Putar Terakhir",
    stats_recent_history_desc: "Daftar lagu yang baru saja selesai Anda putar.",
    stats_clear_btn: "Bersihkan Riwayat",

    // Screen Player & Drawers
    player_mode_song: "Lagu",
    player_mode_video: "Video",
    audio_mode: "Mode Audio",
    side_tab_lyrics: "Lirik",
    side_tab_queue: "Antrean",
    side_queue_clear: "Kosongkan",
    side_clear_queue: "Kosongkan",
    side_queue_now_playing: "SEDANG DIPUTAR",
    queue_now_playing: "SEDANG DIPUTAR",
    side_queue_up_next: "BERIKUTNYA",
    queue_next: "BERIKUTNYA",
    side_lyrics_search_placeholder: "Cari lirik atau lompat ke baris...",
    lyrics_search_placeholder: "Cari lirik atau lompat ke baris...",
    lyrics_search_done: "Selesai",
    select_track_prompt: "Pilih lagu untuk memutar",

    // Bottom Player Tooltips
    tooltip_expand: "Buka Pemutar Layar Penuh",
    tooltip_sidebar_import: "Impor: Spotify, Apple Music & YouTube",
    tooltip_sidebar_create: "Buat Playlist Baru",
    tooltip_verify_stream: "Periksa / Verifikasi Rekaman Audio",
    tooltip_like: "Sukai Lagu",
    tooltip_shuffle: "Acak",
    tooltip_prev: "Sebelumnya",
    tooltip_play_pause: "Putar / Jeda",
    tooltip_next: "Berikutnya",
    tooltip_repeat: "Ulangi",
    tooltip_sleep_timer: "Pengatur Waktu Tidur",
    tooltip_mute: "Bisu / Nyalakan Suara",
    tooltip_refresh_automix: "Segarkan Antrean Radio Automix",

    // Settings Modal
    settings_title: "Pengaturan SoraFy",
    settings_search_placeholder: "Cari pengaturan...",
    settings_cat_audio: "AUDIO & STREAMING",
    settings_cat_app: "PENGATURAN APLIKASI",
    settings_cat_storage: "PENYIMPANAN & TENTANG",
    settings_desc_audio: "Atur kualitas streaming audio, perataan volume, dan transisi crossfade.",
    settings_desc_sources: "Kelola sumber metadata lagu, resolusi artwork, dan backend streaming.",
    settings_desc_appearance: "Sesuaikan tema tampilan antarmuka dan palet warna aksen.",
    settings_desc_system: "Opsi jendela, Discord Rich Presence, dan protokol integrasi lokal.",
    settings_desc_data: "Manajemen cache audio, cookies YouTube, mesin yt-dlp, dan cadangan data.",
    settings_desc_shortcuts: "Pintasan keyboard untuk mengontrol pemutaran di aplikasi.",
    settings_desc_plugins: "Kelola penyedia streaming audio, sumber lirik sinkron, mesin DSP audio, dan ekstensi.",
    settings_desc_equalizer: "Equalizer 10-band ISO terkalibrasi, kontrol headroom, dan modul DSP akustik.",
    settings_desc_about: "Informasi aplikasi desktop, status versi, dan pembaruan.",
    settings_tab_audio: "Audio & Kualitas",
    settings_tab_equalizer: "Equalizer & DSP",
    settings_tab_sources: "Sumber & Metadata",
    settings_tab_appearance: "Tampilan & Tema",
    settings_tab_system: "Sistem",
    settings_tab_data: "Data & Cadangan",
    settings_tab_shortcuts: "Pintasan Keyboard",
    settings_tab_plugins: "Plugin & Ekstensi",
    settings_tab_about: "Tentang",
    setting_metadata_provider: "Penyedia Metadata Utama",
    setting_metadata_provider_desc: "Pilih penyedia utama untuk judul lagu, artis, album, dan cover art.",
    setting_stream_source: "Mesin Streaming Audio",
    setting_stream_source_desc: "Backend utama yang digunakan untuk mengekstrak dan memutar audio.",
    setting_title_cleanup: "Pembersihan Judul Otomatis",
    setting_title_cleanup_desc: "Hapus teks pengganggu dari judul YouTube seperti [Official Music Video], (Lyrics), 4K, dll.",
    setting_cover_hd: "Sampul Album Kualitas Tinggi (HD Cover)",
    setting_cover_hd_desc: "Selalu gunakan resolusi gambar cover tertinggi (544x544 / 640x640).",
    setting_spotify_explore: "Rak Spotify di Halaman Jelajah",
    setting_spotify_explore_desc: "Tampilkan rak Spotify Charts & Playlist Terkurasi di tab Jelajah.",
    setting_theme: "Tema Antarmuka",
    setting_theme_desc: "Pilih palet tema tampilan keseluruhan aplikasi.",
    setting_accent: "Warna Aksen Kustom",
    setting_accent_desc: "Sesuaikan warna sorotan utama, tombol aktif, dan seekbar.",
    setting_language: "Bahasa / Language",
    setting_language_desc: "Pilih bahasa tampilan untuk antarmuka pengguna.",
    setting_audio_quality: "Kualitas Streaming Audio",
    setting_audio_quality_desc: "Pilih bitrate yang diinginkan untuk streaming audio.",
    setting_volume_norm: "Normalisasi Volume",
    setting_volume_norm_desc: "Ratakan tingkat kenyaringan volume antar lagu secara otomatis.",
    setting_crossfade: "Crossfade Antar Lagu",
    setting_crossfade_desc: "Transisi halus saat berpindah ke lagu berikutnya.",
    setting_automix_queue: "Automix Radio Tanpa Batas",
    setting_automix_queue_desc: "Otomatis rekomendasikan dan sambung lagu serupa saat antrean mendekati akhir.",
    setting_close_tray: "Tutup ke System Tray",
    setting_close_tray_desc: "Tetap jalankan musik di latar belakang saat jendela ditutup (X).",
    setting_notifications: "Notifikasi Lagu Desktop",
    setting_notifications_desc: "Tampilkan notifikasi pop-up saat lagu berganti di latar belakang.",
    setting_discord_rpc: "Discord Rich Presence",
    setting_discord_rpc_desc: "Tampilkan lagu yang sedang diputar di profil Discord Anda.",
    setting_discord_activity_name: "Nama Aktivitas",
    setting_discord_activity_name_desc: "Nama setelah Listening to, misalnya Sorafy atau Music.",
    setting_discord_display_name: "Nama yang Ditampilkan",
    setting_discord_display_name_desc: "Pilih nama yang muncul di status aktivitas Discord.",
    setting_discord_artist_name: "Nama Artis",
    setting_discord_song_title: "Judul Lagu",
    setting_discord_hide_paused: "Sembunyikan Saat Dijeda",
    setting_discord_hide_paused_desc: "Sembunyikan aktivitas saat pemutaran dijeda.",
    setting_discord_show_logo: "Tampilkan Logo",
    setting_discord_show_logo_desc: "Tampilkan logo SoraFy di samping cover, atau sebagai gambar utama.",
    setting_discord_show_cover: "Tampilkan Cover",
    setting_discord_show_cover_desc: "Tampilkan cover lagu yang sedang diputar.",
    setting_discord_youtube_button: "Tampilkan Tombol Dengarkan Musik",
    setting_discord_youtube_button_desc: "Tampilkan tautan mendengarkan di aktivitas Discord.",
    setting_discord_sorafy_button: "Tampilkan Tombol Dapatkan SoraFy",
    setting_discord_sorafy_button_desc: "Tampilkan tautan unduhan SoraFy di aktivitas Discord.",
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
    setting_mcp_title: "Model Context Protocol (Server MCP)",
    setting_mcp_desc: "Integrasi AI lokal untuk Claude Code, Cursor, Windsurf, dan asisten AI.",
    btn_copy_ai_config: "Salin Config AI",
    setting_mpd_title: "Music Player Daemon (Protokol MPD)",
    setting_mpd_desc: "Integrasi kontrol terminal Linux untuk ncmpcpp, mpc, dan mpDris2.",
    btn_copy_cmd: "Salin Perintah",
    btn_clear_cache: "Bersihkan Cache",
    btn_import_cookies: "Impor cookies.txt",
    btn_check_engine: "Periksa / Unduh Mesin",
    btn_backup_data: "Cadangkan Data (.json)",
    btn_restore_data: "Pulihkan Data",

    // Modals
    import_hub_title: "Impor Playlist & Album",
    import_hub_desc: "Impor lagu dari platform streaming favorit Anda secara mulus tanpa login.",
    import_hub_label: "URL Playlist atau Album:",
    btn_cancel: "Batal",
    btn_close: "Tutup",
    import_hub_start: "Mulai Impor",
    create_playlist_title: "+ Buat Playlist Baru",
    create_playlist_desc: "Beri nama playlist untuk merapikan lagu favorit, sesi santai, atau fokus.",
    create_playlist_placeholder: "Nama Playlist (contoh: Santai Sore, Fokus Kerja)",
    create_playlist_desc_placeholder: "Deskripsi opsional...",
    create_playlist_btn: "Buat Playlist",
    edit_playlist_title: "Ubah Detail Playlist",
    edit_playlist_desc: "Perbarui nama dan deskripsi playlist Anda.",
    edit_playlist_placeholder: "Nama Playlist",
    btn_save: "Simpan Perubahan",
    add_to_playlist_title: "Tambah ke Playlist",
    btn_done: "Selesai",

    // Sleep Timer
    sleep_timer_title: "Pengatur Waktu Tidur",
    sleep_timer_desc: "Pemutaran musik akan berhenti otomatis setelah waktu timer habis.",
    timer_turn_off: "Matikan timer",
    timer_off: "Matikan timer",
    timer_15m: "15 Menit",
    timer_30m: "30 Menit",
    timer_45m: "45 Menit",
    timer_60m: "60 Menit",
    timer_end_song: "Akhir lagu ini",

    // Shortcuts
    shortcut_play_pause: "Putar / Jeda Lagu",
    shortcut_mute: "Bisu / Nyalakan Suara",
    shortcut_next: "Lagu Berikutnya",
    shortcut_prev: "Lagu Sebelumnya",
    shortcut_seek: "Maju / Mundur (5 dtk)",
    shortcut_volume: "Volume Naik / Turun (5%)",
    shortcut_search: "Fokus Kolom Pencarian",
    shortcut_lyrics: "Buka / Tutup Panel Lirik",
    shortcut_close: "Tutup Layar Penuh / Dialog",

    // About
    about_version: "Versi 2.0.0 • Lisensi GPL-3.0",
    about_desc: "Pemutar musik streaming resolusi tinggi dengan lirik tersinkronisasi, DSP equalizer, dan pengimpor playlist lintas platform.",
    btn_check_update: "Periksa Pembaruan",

    // Context Menu
    ctx_start_radio: "Mulai Radio (Automix)",
    ctx_play_next: "Putar Berikutnya",
    ctx_add_queue: "Tambah ke Antrean",
    ctx_play_now: "Putar Sekarang",
    ctx_view_artist: "Lihat Profil Artis",
    ctx_add_playlist: "Tambah ke Playlist",
    ctx_like_track: "Sukai Lagu",
    ctx_download_track: "Unduh Lagu (MP3)",
    ctx_choose_stream: "Pilih Rekaman Audio (Candidates)",

    // Stream Verification & Jam
    stream_verify_title: "Verifikasi Sumber Audio",
    stream_verify_subtitle: "Pilih rekaman audio yang benar untuk lagu ini",
    stream_searching: "Mencari kandidat audio alternatif...",
    btn_remove_verification: "Hapus Verifikasi (Reset ke Otomatis)",

    unit_seconds: " dtk",
    toast_playing: "Memutar",
    toast_added_to_playlist: "Ditambahkan ke playlist",
    toast_removed_from_playlist: "Dihapus dari playlist"
  }
};

const LIKED_COVER_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Cdefs%3E%3ClinearGradient id='heartGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%236366F1'/%3E%3Cstop offset='50%25' stop-color='%238B5CF6'/%3E%3Cstop offset='100%25' stop-color='%23A855F7'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='300' rx='16' fill='url(%23heartGrad)'/%3E%3Cpath d='M150 225l-13.8-12.5C87.2 168.2 55 138.9 55 102.5 55 72.9 77.9 50 107.5 50c16.7 0 32.7 7.8 42.5 20 9.8-12.2 25.8-20 42.5-20 29.6 0 52.5 22.9 52.5 52.5 0 36.4-32.2 65.7-81.2 110L150 225z' fill='%23FFFFFF'/%3E%3C/svg%3E";

const DOWNLOADS_COVER_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Cdefs%3E%3ClinearGradient id='dlGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23059669'/%3E%3Cstop offset='50%25' stop-color='%2310B981'/%3E%3Cstop offset='100%25' stop-color='%2314B8A6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='300' rx='16' fill='url(%23dlGrad)'/%3E%3Cg fill='none' stroke='%23FFFFFF' stroke-width='16' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M80 180v35c0 8.3 6.7 15 15 15h110c8.3 0 15-6.7 15-15v-35'/%3E%3Cpath d='M150 65v105'/%3E%3Cpath d='M110 130l40 40 40-40'/%3E%3C/g%3E%3C/svg%3E";

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
    this.ytmRadioContinuationToken = null;
    this.recentlySkippedArtists = new Map();

    // Persistence
    this.likedTrackIds = new Set(JSON.parse(localStorage.getItem("sorafy_liked_ids") || "[]"));
    this.historyTracks = JSON.parse(localStorage.getItem("sorafy_history") || "[]");
    this.userPlaylists = JSON.parse(localStorage.getItem("sorafy_user_playlists") || "[]");
    this.followedArtists = new Set(JSON.parse(localStorage.getItem("sorafy_followed_artists") || "[]"));
    this.followedArtistDetails = JSON.parse(localStorage.getItem("sorafy_followed_artist_details") || "{}");
    this.likedAlbums = JSON.parse(localStorage.getItem("sorafy_liked_albums") || "[]");
    this.pinnedKeys = new Set(JSON.parse(localStorage.getItem("sorafy_pinned_items") || '["liked", "downloads"]'));
    this.activeLibraryTab = "all";
    this.sidebarLibraryFilter = "all";

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

    // Dual-Deck Architecture: Deck A (Primary) & Deck B (Preload / Secondary)
    this.deckA = this.audio || (typeof Audio !== "undefined" ? new Audio() : null);
    this.deckB = typeof Audio !== "undefined" ? new Audio() : null;
    if (this.deckB) {
      this.deckB.preload = "auto";
      this.deckB.volume = 0;
    }
    this.preloadAudio = this.deckB;
    this.activeDeck = "A";
    this.preloadDeck = "B";
    this.deckAGainNode = null;
    this.deckBGainNode = null;
    this.isCrossfading = false;
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
    this.verifyStreamBtn = document.getElementById("verifyStreamBtn");
    this.verifyStreamIcon = document.getElementById("verifyStreamIcon");
    this.screenVerifyStreamBtn = document.getElementById("screenVerifyStreamBtn");
    this.screenVerifyStreamIcon = document.getElementById("screenVerifyStreamIcon");
    this.streamCandidatesModal = document.getElementById("streamCandidatesModal");
    this.closeStreamCandidatesBtn = document.getElementById("closeStreamCandidatesBtn");
    this.cancelStreamCandidatesBtn = document.getElementById("cancelStreamCandidatesBtn");
    this.streamCandidatesSubtitle = document.getElementById("streamCandidatesSubtitle");
    this.streamCandidatesStatusNotice = document.getElementById("streamCandidatesStatusNotice");
    this.streamCandidatesLoading = document.getElementById("streamCandidatesLoading");
    this.streamCandidatesList = document.getElementById("streamCandidatesList");
    this.unverifyStreamBtn = document.getElementById("unverifyStreamBtn");
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
    this.startAutomixRadioBtn = document.getElementById("startAutomixRadioBtn");
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
    this.searchSuggestionsDropdown = document.getElementById("searchSuggestionsDropdown");
    this.searchSuggestionsHeader = document.getElementById("searchSuggestionsHeader");
    this.searchSuggestionsHeaderTitle = document.getElementById("searchSuggestionsHeaderTitle");
    this.clearRecentSearchesBtn = document.getElementById("clearRecentSearchesBtn");
    this.searchSuggestionsList = document.getElementById("searchSuggestionsList");
    this.activeSuggestionIndex = -1;
    this.currentSuggestions = [];
    this.originalSearchQuery = "";
    this.suggestionDebounceTimer = null;
    this.searchFilterTabs = document.getElementById("searchFilterTabs");
    this.filterTabBtns = document.querySelectorAll(".filter-tab-btn");

    // Spotify Instant Link Banner
    this.spotifyLinkBanner = document.getElementById("spotifyLinkBanner");
    this.spotifyLinkBannerTitle = document.getElementById("spotifyLinkBannerTitle");
    this.spotifyLinkBannerDesc = document.getElementById("spotifyLinkBannerDesc");
    this.spotifyLinkBannerBtn = document.getElementById("spotifyLinkBannerBtn");

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

    // Listening Statistics & Analytics View Elements (Music Recap & Habits Style)
    this.statsViewContainer = document.getElementById("statsViewContainer");
    this.statsTimeFilterPills = document.getElementById("statsTimeFilterPills");
    this.statsTopArtistCard = document.getElementById("statsTopArtistCard");
    this.statsTopArtistImg = document.getElementById("statsTopArtistImg");
    this.statsTopArtistName = document.getElementById("statsTopArtistName");
    this.statsTopArtistMeta = document.getElementById("statsTopArtistMeta");
    this.statsTopTrackCard = document.getElementById("statsTopTrackCard");
    this.statsTopTrackImg = document.getElementById("statsTopTrackImg");
    this.statsTopTrackTitle = document.getElementById("statsTopTrackTitle");
    this.statsTopTrackMeta = document.getElementById("statsTopTrackMeta");
    this.statsVibeCard = document.getElementById("statsVibeCard");
    this.statsVibeEmoji = document.getElementById("statsVibeEmoji");
    this.statsVibeTitle = document.getElementById("statsVibeTitle");
    this.statsVibeDesc = document.getElementById("statsVibeDesc");
    this.statsTotalTime = document.getElementById("statsTotalTime");
    this.statsTotalTracks = document.getElementById("statsTotalTracks");
    this.statsUniqueArtists = document.getElementById("statsUniqueArtists");
    this.statsDailyAvg = document.getElementById("statsDailyAvg");
    this.statsPeakDayBadge = document.getElementById("statsPeakDayBadge");
    this.statsActivityBars = document.getElementById("statsActivityBars");
    this.statsDaySegmentsGrid = document.getElementById("statsDaySegmentsGrid");
    this.statsTopArtistsList = document.getElementById("statsTopArtistsList");
    this.statsTopTracksList = document.getElementById("statsTopTracksList");
    this.statsRecentScrobblesList = document.getElementById("statsRecentScrobblesList");
    this.statsClearHistoryBtn = document.getElementById("statsClearHistoryBtn");
    this.currentStatsRange = "all";
    this._currentListenRecorded = false;
    this._currentListenTrack = null;

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
    this.playlistCoverWrapper = document.getElementById("playlistCoverWrapper");
    this.playlistCoverImg = document.getElementById("playlistCoverImg");
    this.playlistCoverEditOverlay = document.getElementById("playlistCoverEditOverlay");
    this.playlistTitleHeading = document.getElementById("playlistTitleHeading");
    this.playlistDescText = document.getElementById("playlistDescText");
    this.playlistStatsText = document.getElementById("playlistStatsText");
    this.playlistPlayAllBtn = document.getElementById("playlistPlayAllBtn");
    this.playlistShuffleBtn = document.getElementById("playlistShuffleBtn");
    this.playlistEditBtn = document.getElementById("playlistEditBtn");
    this.playlistDeleteBtn = document.getElementById("playlistDeleteBtn");
    this.playlistOpenFolderBtn = document.getElementById("playlistOpenFolderBtn");
    this.playlistDownloadAllBtn = document.getElementById("playlistDownloadAllBtn");
    this.playlistDownloadAllLabel = document.getElementById("playlistDownloadAllLabel");
    this.playlistTrackList = document.getElementById("playlistTrackList");

    // Nav Items
    this.navItems = document.querySelectorAll(".nav-menu .nav-item");

    // Plugins elements (Inside Settings Modal)
    this.pluginListGrid = document.getElementById("pluginListGrid");
    this.resetPluginsBtn = document.getElementById("resetPluginsBtn");

    // Hi-Fi Equalizer DSP elements
    this.eqBandsRow = document.getElementById("eqBandsRow");
    this.eqChips = document.querySelectorAll("#settingsTabEqualizer .chip, #equalizerViewContainer .chip");
    this.eqResponseCanvas = document.getElementById("eqResponseCanvas");
    this.eqBypassBtn = document.getElementById("eqBypassBtn");
    this.eqBypassStatusText = document.getElementById("eqBypassStatusText");
    this.eqResetFlatBtn = document.getElementById("eqResetFlatBtn");
    this.eqActivePresetTag = document.getElementById("eqActivePresetTag");
    this.eqHeadroomTag = document.getElementById("eqHeadroomTag");
    this.preampSlider = document.getElementById("preampSlider");
    this.preampVal = document.getElementById("preampVal");
    this.bassBoostSlider = document.getElementById("bassBoostSlider");
    this.bassBoostVal = document.getElementById("bassBoostVal");
    this.virtualizerSlider = document.getElementById("virtualizerSlider");
    this.virtualizerVal = document.getElementById("virtualizerVal");
    this.airExciterSlider = document.getElementById("airExciterSlider");
    this.airExciterVal = document.getElementById("airExciterVal");
    this.isEqBypassed = localStorage.getItem("sorafy_eq_bypass") === "true";
    this.currentPreamp = parseFloat(localStorage.getItem("sorafy_eq_preamp") || "0");
    this.currentAirExciter = parseFloat(localStorage.getItem("sorafy_eq_air") || "0");
    const savedGains = localStorage.getItem("sorafy_eq_gains");
    try {
      this.currentGains = savedGains ? JSON.parse(savedGains) : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      if (!Array.isArray(this.currentGains) || this.currentGains.length !== 10) {
        this.currentGains = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
    } catch {
      this.currentGains = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

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
    this.editPlaylistCoverBox = document.getElementById("editPlaylistCoverBox");
    this.editPlaylistCoverPreview = document.getElementById("editPlaylistCoverPreview");
    this.editPlaylistCoverFileInput = document.getElementById("editPlaylistCoverFileInput");
    this.editPlaylistRemoveCoverBtn = document.getElementById("editPlaylistRemoveCoverBtn");
    this.editPlaylistToggleUrlBtn = document.getElementById("editPlaylistToggleUrlBtn");
    this.editPlaylistUrlRow = document.getElementById("editPlaylistUrlRow");
    this.editPlaylistUrlInput = document.getElementById("editPlaylistUrlInput");
    this.editPlaylistApplyUrlBtn = document.getElementById("editPlaylistApplyUrlBtn");
    this.editingPlaylistCoverUrl = null;

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
    this.screenPlayerMeshBackdrop = document.getElementById("screenPlayerMeshBackdrop");
    this.screenPlayerStatsBtn = document.getElementById("screenPlayerStatsBtn");
    this.statsForNerdsModal = document.getElementById("statsForNerdsModal");
    this.closeStatsForNerdsBtn = document.getElementById("closeStatsForNerdsBtn");
    this.statsNerdsGrid = document.getElementById("statsNerdsGrid");

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
    this.settingAutoMixQueue = document.getElementById("settingAutoMixQueue");
    this.settingMetadataProvider = document.getElementById("settingMetadataProvider");
    this.settingStreamingSource = document.getElementById("settingStreamingSource");
    this.settingTitleCleanup = document.getElementById("settingTitleCleanup");
    this.settingCoverHD = document.getElementById("settingCoverHD");
    this.settingCloseToTray = document.getElementById("settingCloseToTray");
    this.settingNotifications = document.getElementById("settingNotifications");
    this.settingDiscordRpc = document.getElementById("settingDiscordRpc");
    this.settingDiscordActivityName = document.getElementById("settingDiscordActivityName");
    this.settingDiscordDisplayName = document.getElementById("settingDiscordDisplayName");
    this.settingDiscordHideWhenPaused = document.getElementById("settingDiscordHideWhenPaused");
    this.settingDiscordShowLogo = document.getElementById("settingDiscordShowLogo");
    this.settingDiscordShowCover = document.getElementById("settingDiscordShowCover");
    this.settingDiscordShowYouTubeButton = document.getElementById("settingDiscordShowYouTubeButton");
    this.settingDiscordShowSorafyButton = document.getElementById("settingDiscordShowSorafyButton");
    this.settingClearCacheBtn = document.getElementById("settingClearCacheBtn");
    this.settingCacheQuota = document.getElementById("settingCacheQuota");
    this.settingSelectCookieBtn = document.getElementById("settingSelectCookieBtn");
    this.settingClearCookieBtn = document.getElementById("settingClearCookieBtn");
    this.settingCookieStatus = document.getElementById("settingCookieStatus");
    this.settingLanguage = document.getElementById("settingLanguage");
    this.settingThemeSelect = document.getElementById("settingThemeSelect");
    this.settingAccentColorPicker = document.getElementById("settingAccentColorPicker");
    this.settingResetAccentBtn = document.getElementById("settingResetAccentBtn");
    this.accentSwatchesRow = document.getElementById("accentSwatchesRow");
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

    // 1. Text elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const translation = this.t(key);
      if (translation) {
        el.textContent = translation;
      }
    });

    // 2. Tooltip attributes with data-i18n-title
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
      const key = el.getAttribute("data-i18n-title");
      const translation = this.t(key);
      if (translation) {
        el.setAttribute("title", translation);
      }
    });

    // 3. Placeholders with data-i18n-placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      const translation = this.t(key);
      if (translation) {
        el.setAttribute("placeholder", translation);
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

    // Dynamic views update
    if (this.currentView === "stats") {
      this.renderStatsView();
    } else if (this.currentView === "library" && typeof this.updateLibraryView === "function") {
      this.updateLibraryView();
    }
  }

  // =========================================================
  // Nuclear Feature 6: Theme & Design Tokens Application
  // =========================================================
  applyTheme(themeKey, customAccent = null) {
    const key = (themeKey && THEME_PRESETS[themeKey]) ? themeKey : "emerald";
    const theme = THEME_PRESETS[key];
    this.currentTheme = key;
    localStorage.setItem("sorafy_theme", key);
    if (this.appSettings) this.appSettings.theme = key;

    document.documentElement.setAttribute("data-theme", key);

    // Apply token definitions
    if (theme.tokens) {
      for (const [prop, val] of Object.entries(theme.tokens)) {
        document.documentElement.style.setProperty(prop, val);
      }
    }

    // Determine final accent color
    const effectiveAccent = (customAccent && customAccent.trim()) ? customAccent.trim() : theme.accent;
    this.currentAccent = effectiveAccent;
    document.documentElement.style.setProperty("--color-brand-primary", effectiveAccent);
    document.documentElement.style.setProperty("--color-brand-gradient", effectiveAccent);

    // Set secondary color
    if (customAccent && customAccent.trim()) {
      document.documentElement.style.setProperty("--color-brand-secondary", customAccent.trim());
    } else {
      document.documentElement.style.setProperty("--color-brand-secondary", theme.secondary);
    }

    // Update Theme dropdown in Settings
    if (this.settingThemeSelect) {
      this.settingThemeSelect.value = key;
    }

    // Update color picker input
    if (this.settingAccentColorPicker) {
      this.settingAccentColorPicker.value = effectiveAccent;
    }

    // Update swatch buttons active state
    if (this.accentSwatchesRow) {
      const swatches = this.accentSwatchesRow.querySelectorAll(".accent-swatch-btn");
      swatches.forEach(btn => {
        const c = btn.dataset.color;
        const matches = c && c.toLowerCase() === effectiveAccent.toLowerCase();
        btn.classList.toggle("active", matches);
        if (matches) {
          btn.style.boxShadow = `0 0 12px ${effectiveAccent}`;
        } else {
          btn.style.boxShadow = "none";
        }
      });
    }

    // Refresh seekbars so they immediately show the new accent
    if (this.audio && this.playerSeekbar) {
      const current = this.audio.currentTime || 0;
      const total = this.audio.duration || 1;
      const pct = total > 0 ? (current / total) * 100 : 0;
      this.playerSeekbar.style.background = `linear-gradient(to right, var(--color-brand-primary) 0%, var(--color-brand-primary) ${pct}%, rgba(255, 255, 255, 0.16) ${pct}%, rgba(255, 255, 255, 0.16) 100%)`;
      if (this.screenPlayerSeekbar) {
        this.screenPlayerSeekbar.style.background = `linear-gradient(to right, var(--color-brand-primary) 0%, var(--color-brand-primary) ${pct}%, rgba(255, 255, 255, 0.16) ${pct}%, rgba(255, 255, 255, 0.16) 100%)`;
      }
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

  get queue() {
    return this.tracks;
  }
  set queue(val) {
    this.tracks = val;
  }
  get currentIndex() {
    return this.currentTrackIndex;
  }
  set currentIndex(val) {
    this.currentTrackIndex = val;
  }

  // =========================================================
  // Dual-Deck Gapless & True Crossfade Engine
  // =========================================================
  bindDeckEvents(element, deckName) {
    if (!element || typeof element.addEventListener !== "function") return;

    element.addEventListener("timeupdate", () => {
      if (this.activeDeck === deckName) {
        this.onTimeUpdate();
      }
    });

    element.addEventListener("loadedmetadata", () => {
      if (this.activeDeck === deckName && element.duration && !isNaN(element.duration)) {
        const realSecs = Math.round(element.duration);
        if (this.durationLabel) this.durationLabel.textContent = this.formatTime(realSecs);
        if (this.screenPlayerDuration) {
          this.screenPlayerDuration.textContent = this.formatTime(realSecs);
        }
        if (this.tracks && this.tracks[this.currentTrackIndex]) {
          this.tracks[this.currentTrackIndex].duration_secs = realSecs;
        }
        if (typeof document !== "undefined") {
          const activeRows = document.querySelectorAll('.track-row.active .track-row-duration, .ytm-song-item.active .ytm-song-duration, .queue-item.active .queue-item-duration');
          activeRows.forEach(el => el.textContent = this.formatTime(realSecs));
        }
      }
    });

    element.addEventListener("error", () => {
      if (this.activeDeck === deckName) {
        console.warn("Audio element error on src:", element.src, element.error);
        const cur = this.tracks ? this.tracks[this.currentTrackIndex] : null;
        if (cur && cur.fallback_url && element.src !== cur.fallback_url) {
          console.log("Switching to fallback preview stream:", cur.fallback_url);
          element.src = cur.fallback_url;
          element.play().catch(() => {});
        } else {
          this.isPlaying = false;
          if (typeof this.updatePlayPauseIcon === "function") this.updatePlayPauseIcon();
        }
      }
    });

    element.addEventListener("ended", () => {
      if (this.activeDeck === deckName) {
        this.onTrackEnded();
      }
    });

    element.addEventListener("waiting", () => {
      if (this.activeDeck === deckName && typeof this.showPlayerBuffering === "function") {
        this.showPlayerBuffering(true);
      }
    });

    element.addEventListener("canplay", () => {
      if (this.activeDeck === deckName && typeof this.showPlayerBuffering === "function") {
        this.showPlayerBuffering(false);
      }
    });

    element.addEventListener("playing", () => {
      if (this.activeDeck === deckName && typeof this.showPlayerBuffering === "function") {
        this.showPlayerBuffering(false);
      }
    });

    element.addEventListener("play", () => {
      if (this.activeDeck === deckName) {
        if (typeof this.onPlay === "function") this.onPlay();
        if (typeof this.showPlayerBuffering === "function") this.showPlayerBuffering(false);
        if (this.tracks && this.tracks[this.currentTrackIndex] && typeof this.updateDiscordPresence === "function") {
          this.updateDiscordPresence(this.tracks[this.currentTrackIndex]);
        }
        if (this.currentScreenMode === "video" && this.screenPlayerNativeVideo && this.screenPlayerNativeVideo.src) {
          if (this.screenPlayerNativeVideo.paused) {
            this.screenPlayerNativeVideo.play().catch(() => {});
          }
        }
      }
    });

    element.addEventListener("pause", () => {
      if (this.activeDeck === deckName) {
        if (typeof this.onPause === "function") this.onPause();
        if (this.tracks && this.tracks[this.currentTrackIndex] && typeof this.updateDiscordPresence === "function") {
          this.updateDiscordPresence(this.tracks[this.currentTrackIndex]);
        }
        if (this.screenPlayerNativeVideo && !this.screenPlayerNativeVideo.paused) {
          this.screenPlayerNativeVideo.pause();
        }
        if (typeof this.savePlaybackSession === "function") this.savePlaybackSession();
      }
    });

    element.addEventListener("seeked", () => {
      if (this.activeDeck === deckName) {
        if (this.tracks && this.tracks[this.currentTrackIndex] && typeof this.updateDiscordPresence === "function") {
          this.updateDiscordPresence(this.tracks[this.currentTrackIndex]);
        }
        if (typeof this.updateMediaSessionPosition === "function") {
          this.updateMediaSessionPosition();
        }
      }
    });
  }

  applyDeckGains(currentGain, nextGain) {
    const activeGainNode = this.activeDeck === 'A' ? this.deckAGainNode : this.deckBGainNode;
    const preloadGainNode = this.activeDeck === 'A' ? this.deckBGainNode : this.deckAGainNode;
    const curTime = (this.audioCtx && typeof this.audioCtx.currentTime === 'number')
      ? this.audioCtx.currentTime
      : (this.audioContext && typeof this.audioContext.currentTime === 'number')
        ? this.audioContext.currentTime
        : 0;

    const hasGainNodes = Boolean(activeGainNode && preloadGainNode && activeGainNode.gain && preloadGainNode.gain);

    if (activeGainNode && activeGainNode.gain) {
      if (typeof activeGainNode.gain.setValueAtTime === 'function') {
        activeGainNode.gain.setValueAtTime(currentGain, curTime);
      } else {
        activeGainNode.gain.value = currentGain;
      }
    }
    if (preloadGainNode && preloadGainNode.gain) {
      if (typeof preloadGainNode.gain.setValueAtTime === 'function') {
        preloadGainNode.gain.setValueAtTime(nextGain, curTime);
      } else {
        preloadGainNode.gain.value = nextGain;
      }
    }

    const activeAudio = this.activeDeck === 'A' ? (this.deckA || this.audio) : (this.deckB || this.preloadAudio);
    const preloadAudio = this.activeDeck === 'A' ? (this.deckB || this.preloadAudio) : (this.deckA || this.audio);

    const baseVolume = (this.volumeSlider && !isNaN(parseFloat(this.volumeSlider.value)))
      ? parseFloat(this.volumeSlider.value)
      : (typeof this.currentVolume === 'number' ? this.currentVolume : 0.85);

    // If Web Audio GainNodes are active, maintain audio.volume = baseVolume to prevent double attenuation
    if (activeAudio) {
      try {
        activeAudio.volume = Math.max(0, Math.min(1, hasGainNodes ? baseVolume : baseVolume * currentGain));
      } catch (_) {}
    }
    if (preloadAudio) {
      try {
        preloadAudio.volume = Math.max(0, Math.min(1, hasGainNodes ? baseVolume : baseVolume * nextGain));
      } catch (_) {}
    }
  }

  resetDeckGains() {
    this.isCrossfading = false;
    this.applyDeckGains(1.0, 0.0);
    if (this.preloadAudio) {
      try {
        this.preloadAudio.pause();
        this.preloadAudio.currentTime = 0;
      } catch (_) {}
    }
  }

  handleCrossfadeTick() {
    const activeAudio = this.activeDeck === 'A' ? (this.deckA || this.audio) : (this.deckB || this.preloadAudio);
    const preloadAudio = this.activeDeck === 'A' ? (this.deckB || this.preloadAudio) : (this.deckA || this.audio);
    if (!activeAudio) {
      return { currentGain: 1.0, nextGain: 0.0, isCrossfading: false, progress: 0 };
    }

    const currentTime = (typeof activeAudio.currentTime === 'number' && !isNaN(activeAudio.currentTime))
      ? activeAudio.currentTime
      : 0;
    const duration = (typeof activeAudio.duration === 'number' && !isNaN(activeAudio.duration) && activeAudio.duration > 0)
      ? activeAudio.duration
      : ((this.tracks && this.tracks[this.currentTrackIndex]?.duration_secs) || 0);

    const crossfadeDuration = (this.appSettings && typeof this.appSettings.crossfadeDuration === 'number')
      ? this.appSettings.crossfadeDuration
      : 0;

    if (crossfadeDuration <= 0 || duration <= 0) {
      if (this.isCrossfading) {
        this.resetDeckGains();
      }
      return { currentGain: 1.0, nextGain: 0.0, isCrossfading: false, progress: 0 };
    }

    const helper = getAudioDeckStateHelper();
    const effectiveCrossfade = helper && typeof helper.getEffectiveCrossfadeDuration === 'function'
      ? helper.getEffectiveCrossfadeDuration(duration, crossfadeDuration)
      : (crossfadeDuration >= duration ? Math.max(0, Math.floor(duration * 0.4)) : crossfadeDuration);

    if (effectiveCrossfade <= 0) {
      if (this.isCrossfading) {
        this.resetDeckGains();
      }
      return { currentGain: 1.0, nextGain: 0.0, isCrossfading: false, progress: 0 };
    }

    const windowStart = duration - effectiveCrossfade;
    const gains = helper && typeof helper.calculateCrossfadeGains === 'function'
      ? helper.calculateCrossfadeGains(currentTime, duration, crossfadeDuration)
      : (currentTime < windowStart
        ? { currentGain: 1.0, nextGain: 0.0, isCrossfading: false, progress: 0 }
        : {
            currentGain: Math.max(0, Math.min(1, 1 - ((currentTime - windowStart) / effectiveCrossfade))),
            nextGain: Math.max(0, Math.min(1, (currentTime - windowStart) / effectiveCrossfade)),
            isCrossfading: true,
            progress: Math.max(0, Math.min(1, (currentTime - windowStart) / effectiveCrossfade))
          });

    if (currentTime >= windowStart && duration > 0) {
      if (!this.isCrossfading) {
        this.isCrossfading = true;
        if (preloadAudio && preloadAudio.src && preloadAudio.paused) {
          preloadAudio.currentTime = 0;
          try {
            const playPromise = preloadAudio.play();
            if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.catch(e => {
                console.warn("Crossfade secondary deck autoplay notice:", e);
              });
            }
          } catch (e) {
            console.warn("Crossfade secondary deck play call notice:", e);
          }
        }
      }

      this.applyDeckGains(gains.currentGain, gains.nextGain);

      if (gains.currentGain <= 0 && gains.nextGain >= 1.0) {
        if (typeof this.swapDecks === 'function') {
          this.swapDecks();
        }
      }
    } else if (this.isCrossfading) {
      this.resetDeckGains();
    }

    return gains;
  }

  swapDecks() {
    const oldActiveDeck = this.activeDeck;
    const newActiveDeck = oldActiveDeck === 'A' ? 'B' : 'A';
    this.activeDeck = newActiveDeck;
    this.preloadDeck = oldActiveDeck;

    const oldActiveAudio = oldActiveDeck === 'A' ? (this.deckA || this.audio) : (this.deckB || this.preloadAudio);
    const newActiveAudio = newActiveDeck === 'A' ? (this.deckA || this.audio) : (this.deckB || this.preloadAudio);

    if (oldActiveAudio) {
      try {
        oldActiveAudio.pause();
        oldActiveAudio.currentTime = 0;
      } catch (_) {}
    }

    this.audio = newActiveAudio;
    this.preloadAudio = oldActiveAudio;

    this.applyDeckGains(1.0, 0.0);
    this.isCrossfading = false;
    this.isNextTrackPreloaded = false;

    if (typeof this.preloadedTrackIndex === 'number' && this.preloadedTrackIndex !== -1 && this.tracks && this.tracks[this.preloadedTrackIndex]) {
      this.currentTrackIndex = this.preloadedTrackIndex;
      this.preloadedTrackIndex = -1;
    } else if (this.tracks && this.tracks.length > 0) {
      if (this.isShuffled) {
        this.currentTrackIndex = Math.floor(Math.random() * this.tracks.length);
      } else {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
      }
    }

    const currentTrack = (this.tracks && this.tracks[this.currentTrackIndex]) ? this.tracks[this.currentTrackIndex] : null;
    if (currentTrack) {
      if (typeof this.updateScreenPlayer === 'function') this.updateScreenPlayer();
      if (typeof this.highlightActiveSongItems === 'function') this.highlightActiveSongItems();
      if (typeof this.updateMediaSession === 'function') this.updateMediaSession(currentTrack);
      if (typeof this.updateDiscordPresence === 'function') this.updateDiscordPresence(currentTrack);
      if (typeof this.renderQueue === 'function') this.renderQueue();
      if (this.playerTitle) {
        this.playerTitle.innerHTML = `
          <span class="title-text">${typeof this.escapeHtml === 'function' ? this.escapeHtml(currentTrack.title) : currentTrack.title}</span>
          ${currentTrack.is_explicit ? '<span class="explicit-badge" title="Explicit">E</span>' : ''}
        `;
      }
      if (typeof this.renderBottomPlayerArtist === 'function') this.renderBottomPlayerArtist(currentTrack);
      if (this.playerArtwork && currentTrack.artwork_url) this.playerArtwork.src = currentTrack.artwork_url;
      if (typeof this.fetchTrackLyrics === 'function') this.fetchTrackLyrics(currentTrack);
      if (typeof this.recordPlayHistory === 'function') this.recordPlayHistory(currentTrack);
    }
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
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator) || !track) return;
    try {
      const artUrl = track.artwork_url || this.DEFAULT_TRACK_ART;
      const artType = (typeof artUrl === 'string' && (artUrl.includes('.png') ? 'image/png' : (artUrl.includes('.webp') ? 'image/webp' : 'image/jpeg'))) || 'image/jpeg';

      if (typeof MediaMetadata !== 'undefined') {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title || 'Track Title',
          artist: track.artist || 'Artist',
          album: track.album || 'SoraFy Music',
          artwork: [
            { src: artUrl, sizes: '96x96', type: artType },
            { src: artUrl, sizes: '128x128', type: artType },
            { src: artUrl, sizes: '192x192', type: artType },
            { src: artUrl, sizes: '256x256', type: artType },
            { src: artUrl, sizes: '384x384', type: artType },
            { src: artUrl, sizes: '512x512', type: artType }
          ]
        });
      }

      navigator.mediaSession.playbackState = this.isPlaying ? 'playing' : 'paused';
      this.updateMediaSessionPosition();
    } catch (e) {
      console.warn("MediaSession update note:", e);
    }
  }

  updateMediaSessionPosition() {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator) || !this.audio || typeof navigator.mediaSession?.setPositionState !== 'function') return;
    try {
      const rawDur = (typeof this.audio.duration === 'number' && isFinite(this.audio.duration) && this.audio.duration > 0)
        ? this.audio.duration
        : ((this.tracks && this.tracks[this.currentTrackIndex]?.duration_secs) || 0);
      const dur = Number(rawDur);
      if (dur && isFinite(dur) && dur > 0) {
        const rawCur = typeof this.audio.currentTime === 'number' ? this.audio.currentTime : 0;
        const cur = (isFinite(rawCur) && rawCur >= 0) ? Math.min(rawCur, dur) : 0;
        const rawRate = typeof this.audio.playbackRate === 'number' ? this.audio.playbackRate : 1.0;
        const rate = (isFinite(rawRate) && rawRate > 0) ? rawRate : 1.0;
        navigator.mediaSession.setPositionState({
          duration: dur,
          playbackRate: rate,
          position: cur
        });
      }
    } catch (_) {}
  }

  onPlay() {
    this.isPlaying = true;
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = 'playing';
      } catch (_) {}
      this.updateMediaSessionPosition();
    }
    if (typeof window !== 'undefined' && window.electronAPI && typeof window.electronAPI.setThumbarState === 'function') {
      try {
        window.electronAPI.setThumbarState({ isPlaying: this.isPlaying });
      } catch (_) {}
    }
  }

  onPause() {
    this.isPlaying = false;
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = 'paused';
      } catch (_) {}
    }
    if (typeof window !== 'undefined' && window.electronAPI && typeof window.electronAPI.setThumbarState === 'function') {
      try {
        window.electronAPI.setThumbarState({ isPlaying: this.isPlaying });
      } catch (_) {}
    }
  }

  // =========================================================================
  // Discord Rich Presence Integration
  // =========================================================================
  updateDiscordPresence(track) {
    if (!window.electronAPI || typeof window.electronAPI.updateDiscordPresence !== 'function') return;
    const settings = this.appSettings || {};
    const playing = this.audio ? !this.audio.paused && !this.audio.ended : this.isPlaying;
    if (!track || settings.discordRpc === false || (!playing && settings.discordHideWhenPaused !== false)) {
      window.electronAPI.clearDiscordPresence?.();
      return;
    }

    try {
      const startTimestamp = Math.floor(Date.now() / 1000) - Math.floor(this.audio ? (this.audio.currentTime || 0) : 0);
      const endTimestamp = (track.duration_secs && track.duration_secs > 0)
        ? startTimestamp + track.duration_secs
        : undefined;

      const coverUrl = track.artwork_url || track.cover_url || track.thumbnail_url || '';
      const fallbackLogo = 'https://raw.githubusercontent.com/rafliadipratama/sorafy/main/shared/assets/logo_monogram.png';
      const ytUrl = track.id && !track.id.startsWith('local_')
        ? `https://music.youtube.com/watch?v=${track.id.replace(/^yt:/, '')}`
        : null;

      const buttons = [];
      if (ytUrl && settings.discordShowYouTubeButton !== false) {
        buttons.push({ label: 'Dengarkan Musik', url: ytUrl });
      }
      if (settings.discordShowSorafyButton !== false) {
        buttons.push({ label: 'Dapatkan SoraFy', url: 'https://github.com/rafliadipratama/sorafy' });
      }

      const assets = {};
      if (settings.discordShowCover !== false && /^https?:\/\//i.test(coverUrl)) {
        assets.large_image = coverUrl;
        assets.large_text = track.title ? `${track.title} - ${track.artist || ''}` : 'SoraFy Desktop';
        if (settings.discordShowLogo !== false) {
          assets.small_image = fallbackLogo;
          assets.small_text = 'SoraFy';
        }
      } else if (settings.discordShowLogo !== false) {
        assets.large_image = fallbackLogo;
        assets.large_text = 'SoraFy';
      }

      window.electronAPI.updateDiscordPresence({
        type: 2,
        name: String(settings.discordActivityName || 'Sorafy').trim().substring(0, 128) || 'Sorafy',
        status_display_type: settings.discordDisplayName === 'artist' ? 1 : settings.discordDisplayName === 'title' ? 2 : 0,
        details: track.title || 'Mendengarkan Musik',
        state: track.artist || 'SoraFy Music',
        timestamps: playing ? { start: startTimestamp, end: endTimestamp } : undefined,
        assets: Object.keys(assets).length ? assets : undefined,
        buttons: buttons.slice(0, 2)
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
      discordActivityName: 'Sorafy',
      discordDisplayName: 'activity',
      discordHideWhenPaused: true,
      discordShowLogo: true,
      discordShowCover: true,
      discordShowYouTubeButton: true,
      discordShowSorafyButton: true,
      audioQuality: 'high',
      volumeNormalization: false,
      crossfadeDuration: 0,
      cacheQuotaMb: 2048,
      theme: 'emerald',
      customAccent: ''
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

    // Apply configured theme & custom accent (Nuclear Feature 6)
    const initialTheme = this.appSettings.theme || localStorage.getItem("sorafy_theme") || "emerald";
    const initialAccent = this.appSettings.customAccent || localStorage.getItem("sorafy_custom_accent") || "";
    this.applyTheme(initialTheme, initialAccent);

    if (this.settingLanguage) {
      this.settingLanguage.value = initialLang;
    }
    if (this.settingAudioQuality) this.settingAudioQuality.value = this.appSettings.audioQuality || 'high';
    if (this.settingVolumeNorm) {
      this.settingVolumeNorm.checked = !!this.appSettings.volumeNormalization;
      this.setVolumeNormalization(!!this.appSettings.volumeNormalization);
    }
    if (this.settingMetadataProvider) {
      this.settingMetadataProvider.value = this.appSettings.metadataProvider || 'spotify';
    }
    if (this.settingStreamingSource) {
      this.settingStreamingSource.value = this.appSettings.streamingSource || 'yt_opus';
    }
    if (this.settingTitleCleanup) {
      this.settingTitleCleanup.checked = this.appSettings.titleCleanup !== false;
    }
    if (this.settingCoverHD) {
      this.settingCoverHD.checked = this.appSettings.coverHD !== false;
    }
    if (this.settingCrossfade) {
      this.settingCrossfade.value = this.appSettings.crossfadeDuration || 0;
      if (this.settingCrossfadeLabel) {
        this.settingCrossfadeLabel.textContent = `${this.appSettings.crossfadeDuration || 0}${this.currentLanguage === 'id' ? ' dtk' : 's'}`;
      }
    }
    if (this.settingAutoMixQueue) {
      this.settingAutoMixQueue.checked = this.appSettings.autoMixQueue !== false;
    }
    if (this.settingCacheQuota) {
      this.settingCacheQuota.value = String(this.appSettings.cacheQuotaMb || 2048);
    }
    if (this.settingCloseToTray) this.settingCloseToTray.checked = !!this.appSettings.closeToTray;
    if (this.settingNotifications) this.settingNotifications.checked = this.appSettings.notifications !== false;
    if (this.settingDiscordRpc) this.settingDiscordRpc.checked = this.appSettings.discordRpc !== false;
    if (this.settingDiscordActivityName) this.settingDiscordActivityName.value = this.appSettings.discordActivityName;
    if (this.settingDiscordDisplayName) this.settingDiscordDisplayName.value = this.appSettings.discordDisplayName;
    if (this.settingDiscordHideWhenPaused) this.settingDiscordHideWhenPaused.checked = this.appSettings.discordHideWhenPaused !== false;
    if (this.settingDiscordShowLogo) this.settingDiscordShowLogo.checked = this.appSettings.discordShowLogo !== false;
    if (this.settingDiscordShowCover) this.settingDiscordShowCover.checked = this.appSettings.discordShowCover !== false;
    if (this.settingDiscordShowYouTubeButton) this.settingDiscordShowYouTubeButton.checked = this.appSettings.discordShowYouTubeButton !== false;
    if (this.settingDiscordShowSorafyButton) this.settingDiscordShowSorafyButton.checked = this.appSettings.discordShowSorafyButton !== false;

    const settingsSearchInput = document.getElementById("settingsSearchInput");

    if (this.navSettings) {
      this.navSettings.addEventListener("click", () => {
        if (this.settingsModal) {
          this.settingsModal.style.display = "flex";
          if (settingsSearchInput && settingsSearchInput.value) {
            settingsSearchInput.value = "";
            settingsSearchInput.dispatchEvent(new Event("input"));
          }
          if (this.activeSettingsTab === "equalizer") {
            this.renderEqualizerBands();
            setTimeout(() => {
              this.drawEqResponseCurve();
              this.startEqAnimationLoop();
            }, 60);
          }
        }
      });
    }

    if (this.closeSettingsModalBtn) {
      this.closeSettingsModalBtn.addEventListener("click", () => {
        if (this.settingsModal) this.settingsModal.style.display = "none";
      });
    }

    if (this.settingsModal) {
      this.settingsModal.addEventListener("click", (e) => {
        if (e.target === this.settingsModal) {
          this.settingsModal.style.display = "none";
        }
      });
    }

    if (this.settingsTabBar) {
      this.settingsTabBar.querySelectorAll('.settings-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (settingsSearchInput && settingsSearchInput.value) {
            settingsSearchInput.value = "";
            document.querySelectorAll("#settingsModal .setting-item, #settingsModal .shortcut-row").forEach(el => el.style.display = "");
            document.querySelectorAll("#settingsModal .discord-group-title, #settingsModal .discord-callout-card, #settingsModal .discord-pane-header").forEach(el => el.style.display = "");
          }
          this.settingsTabBar.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const target = btn.dataset.tab;
          this.activeSettingsTab = target;
          document.querySelectorAll('.settings-tab-pane').forEach(pane => {
            pane.style.display = pane.id === `settingsTab${target.charAt(0).toUpperCase() + target.slice(1)}` ? 'block' : 'none';
          });
          if (target === "plugins") {
            this.renderPlugins();
          } else if (target === "equalizer") {
            this.renderEqualizerBands();
            setTimeout(() => {
              this.drawEqResponseCurve();
              this.startEqAnimationLoop();
            }, 60);
          }
        });
      });
    }

    if (settingsSearchInput) {
      settingsSearchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();
        const items = document.querySelectorAll("#settingsModal .setting-item, #settingsModal .shortcut-row");
        const panes = document.querySelectorAll("#settingsModal .settings-tab-pane");
        const headers = document.querySelectorAll("#settingsModal .discord-group-title, #settingsModal .discord-callout-card");

        if (!query) {
          items.forEach(el => el.style.display = "");
          headers.forEach(el => el.style.display = "");
          const activeBtn = this.settingsTabBar ? this.settingsTabBar.querySelector('.settings-tab-btn.active') : null;
          const target = activeBtn ? activeBtn.dataset.tab : "audio";
          panes.forEach(pane => {
            pane.style.display = pane.id === `settingsTab${target.charAt(0).toUpperCase() + target.slice(1)}` ? 'block' : 'none';
          });
          return;
        }

        panes.forEach(pane => pane.style.display = "block");
        headers.forEach(el => el.style.display = "none");
        const matchCountPerTab = {};
        items.forEach(item => {
          const match = item.textContent.toLowerCase().includes(query);
          item.style.display = match ? "flex" : "none";
          const pane = item.closest(".settings-tab-pane");
          if (pane) {
            matchCountPerTab[pane.id] = (matchCountPerTab[pane.id] || 0) + (match ? 1 : 0);
          }
        });

        panes.forEach(pane => {
          if (!matchCountPerTab[pane.id]) {
            pane.style.display = "none";
          }
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

    // Theme & Appearance Change Handlers (Nuclear Feature 6)
    if (this.settingThemeSelect) {
      this.settingThemeSelect.addEventListener("change", (e) => {
        const themeKey = e.target.value;
        this.appSettings.theme = themeKey;
        persistSettings();
        this.applyTheme(themeKey, this.appSettings.customAccent);
        const name = THEME_PRESETS[themeKey]?.name || themeKey;
        this.showToast(this.currentLanguage === 'id' ? `Tema antarmuka diubah ke ${name}` : `Interface theme changed to ${name}`);
      });
    }

    if (this.settingAccentColorPicker) {
      this.settingAccentColorPicker.addEventListener("input", (e) => {
        const color = e.target.value;
        this.appSettings.customAccent = color;
        persistSettings();
        this.applyTheme(this.appSettings.theme || 'emerald', color);
      });
    }

    if (this.settingResetAccentBtn) {
      this.settingResetAccentBtn.addEventListener("click", () => {
        this.appSettings.customAccent = "";
        persistSettings();
        this.applyTheme(this.appSettings.theme || 'emerald', "");
        this.showToast(this.currentLanguage === 'id' ? "Warna aksen dikembalikan ke bawaan tema" : "Accent color reset to theme default");
      });
    }

    if (this.accentSwatchesRow) {
      const swatches = this.accentSwatchesRow.querySelectorAll(".accent-swatch-btn");
      swatches.forEach(btn => {
        btn.addEventListener("click", () => {
          const color = btn.dataset.color;
          this.appSettings.customAccent = color;
          persistSettings();
          this.applyTheme(this.appSettings.theme || 'emerald', color);
        });
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
        this.setVolumeNormalization(e.target.checked);
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

    if (this.settingAutoMixQueue) {
      this.settingAutoMixQueue.addEventListener("change", (e) => {
        this.appSettings.autoMixQueue = e.target.checked;
        persistSettings();
        this.showToast(this.currentLanguage === 'id'
          ? `Automix Radio ${e.target.checked ? 'diaktifkan' : 'dinonaktifkan'}`
          : `Automix Radio ${e.target.checked ? 'enabled' : 'disabled'}`);
        if (e.target.checked) {
          this.ensureUpcomingQueue(true);
        }
      });
    }

    // Sources & Metadata settings listeners (Nuclear Feature)
    if (this.settingMetadataProvider) {
      this.settingMetadataProvider.addEventListener("change", (e) => {
        this.appSettings.metadataProvider = e.target.value;
        persistSettings();
        const labelMap = {
          spotify: 'Spotify (Official)',
          ytmusic: 'InnerTube Engine',
          hybrid: 'Hybrid / Auto',
          deezer: 'Deezer'
        };
        this.showToast(this.currentLanguage === 'id' 
          ? `Penyedia metadata diubah ke: ${labelMap[e.target.value] || e.target.value}` 
          : `Metadata provider set to: ${labelMap[e.target.value] || e.target.value}`);
      });
    }

    if (this.settingStreamingSource) {
      this.settingStreamingSource.addEventListener("change", (e) => {
        this.appSettings.streamingSource = e.target.value;
        persistSettings();
        const labelMap = {
          yt_opus: 'YouTube Opus HD',
          lossless: 'Monochrome FLAC (Hi-Res)',
          jiosaavn: 'JioSaavn 320k'
        };
        this.showToast(this.currentLanguage === 'id' 
          ? `Mesin streaming diubah ke: ${labelMap[e.target.value] || e.target.value}` 
          : `Streaming engine set to: ${labelMap[e.target.value] || e.target.value}`);
      });
    }

    if (this.settingTitleCleanup) {
      this.settingTitleCleanup.addEventListener("change", (e) => {
        this.appSettings.titleCleanup = e.target.checked;
        persistSettings();
        this.showToast(this.currentLanguage === 'id'
          ? (e.target.checked ? 'Pembersihan judul YouTube diaktifkan' : 'Pembersihan judul YouTube dinonaktifkan')
          : (e.target.checked ? 'Automatic title cleanup enabled' : 'Automatic title cleanup disabled'));
      });
    }

    if (this.settingCoverHD) {
      this.settingCoverHD.addEventListener("change", (e) => {
        this.appSettings.coverHD = e.target.checked;
        persistSettings();
        this.showToast(this.currentLanguage === 'id'
          ? (e.target.checked ? 'Cover art resolusi tinggi diaktifkan' : 'Cover art resolusi standar diaktifkan')
          : (e.target.checked ? 'High-resolution artwork enabled' : 'Standard resolution artwork enabled'));
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
      this.settingDiscordRpc.addEventListener("change", async (e) => {
        this.appSettings.discordRpc = e.target.checked;
        await persistSettings();
        if (!e.target.checked && window.electronAPI && typeof window.electronAPI.clearDiscordPresence === 'function') {
          window.electronAPI.clearDiscordPresence();
        } else if (e.target.checked) {
          const cur = this.tracks[this.currentTrackIndex];
          if (cur) this.updateDiscordPresence(cur);
        }
      });
    }

    for (const [control, key] of [
      [this.settingDiscordActivityName, 'discordActivityName'],
      [this.settingDiscordDisplayName, 'discordDisplayName'],
      [this.settingDiscordHideWhenPaused, 'discordHideWhenPaused'],
      [this.settingDiscordShowLogo, 'discordShowLogo'],
      [this.settingDiscordShowCover, 'discordShowCover'],
      [this.settingDiscordShowYouTubeButton, 'discordShowYouTubeButton'],
      [this.settingDiscordShowSorafyButton, 'discordShowSorafyButton']
    ]) {
      control?.addEventListener('change', async () => {
        this.appSettings[key] = control.type === 'checkbox' ? control.checked : control.value.trim();
        if (key === 'discordActivityName') {
          this.appSettings[key] = this.appSettings[key] || 'Sorafy';
          control.value = this.appSettings[key];
        }
        await persistSettings();
        this.updateDiscordPresence(this.tracks[this.currentTrackIndex]);
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
    this.initStatsEvents();

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

    if (this.startAutomixRadioBtn) {
      this.startAutomixRadioBtn.addEventListener("click", () => {
        const cur = this.tracks[this.currentTrackIndex];
        if (cur) {
          this.ensureUpcomingQueue(true);
          this.showToast(this.currentLanguage === "id" ? "Menyegarkan antrean radio Automix..." : "Refreshing Automix radio queue...");
        } else {
          this.showToast(this.currentLanguage === "id" ? "Putar lagu terlebih dahulu untuk memulai radio" : "Play a song first to start radio");
        }
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
    if (this.screenPlayerAudioView) {
      this.screenPlayerAudioView.addEventListener("click", () => this.togglePlayPause());
    }
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
    if (this.screenPlayerStatsBtn) {
      this.screenPlayerStatsBtn.addEventListener("click", () => this.toggleStatsForNerds());
    }
    if (this.screenPlayerBadge) {
      this.screenPlayerBadge.style.cursor = "pointer";
      this.screenPlayerBadge.title = "Klik untuk membuka Stats for Nerds";
      this.screenPlayerBadge.addEventListener("click", () => this.toggleStatsForNerds());
    }
    if (this.closeStatsForNerdsBtn) {
      this.closeStatsForNerdsBtn.addEventListener("click", () => {
        if (this.statsForNerdsModal) this.statsForNerdsModal.style.display = "none";
      });
    }
    if (this.statsForNerdsModal) {
      this.statsForNerdsModal.addEventListener("click", (e) => {
        if (e.target === this.statsForNerdsModal) {
          this.statsForNerdsModal.style.display = "none";
        }
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
          this.screenPlayerSeekbar.style.background = `linear-gradient(to right, var(--color-brand-primary) 0%, var(--color-brand-primary) ${val}%, rgba(255, 255, 255, 0.16) ${val}%, rgba(255, 255, 255, 0.16) 100%)`;
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
          if (typeof this.updateMediaSessionPosition === 'function') {
            this.updateMediaSessionPosition();
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
          if (typeof this.updateMediaSessionPosition === 'function') {
            this.updateMediaSessionPosition();
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
        this.renderUserPlaylists();

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
        this.switchView(this.previousView && this.previousView !== "playlist" ? this.previousView : "home");
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

    if (this.playlistCoverWrapper) {
      this.playlistCoverWrapper.addEventListener("click", () => {
        const isUserPl = this.currentPlaylist && !this.currentPlaylist.is_special && this.userPlaylists.some(p => p.id === this.currentPlaylist.id);
        if (isUserPl) {
          this.openEditPlaylistModal(this.currentPlaylist);
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

    if (this.playlistDownloadAllBtn) {
      this.playlistDownloadAllBtn.addEventListener("click", () => {
        this.downloadCurrentPlaylist();
      });
    }

    if (this.playlistOpenFolderBtn) {
      this.playlistOpenFolderBtn.addEventListener("click", () => {
        if (window.electronAPI && typeof window.electronAPI.openDownloadFolder === 'function') {
          window.electronAPI.openDownloadFolder();
        } else {
          this.showToast(this.currentLanguage === "id" ? "Membuka folder unduhan..." : "Opening downloads folder...");
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

    // Cover picker events in Edit Playlist Modal
    if (this.editPlaylistCoverBox) {
      this.editPlaylistCoverBox.addEventListener("click", () => {
        if (this.editPlaylistCoverFileInput) this.editPlaylistCoverFileInput.click();
      });
    }

    if (this.editPlaylistCoverFileInput) {
      this.editPlaylistCoverFileInput.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
          this.showToast(this.currentLanguage === "id" ? "Pilih berkas gambar yang valid!" : "Please select a valid image file!");
          return;
        }

        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          const img = new Image();
          img.onload = () => {
            // Offscreen canvas center-crop to 480x480 JPEG (clean & lightweight)
            const canvas = document.createElement("canvas");
            const TARGET_SIZE = 480;
            canvas.width = TARGET_SIZE;
            canvas.height = TARGET_SIZE;
            const ctx = canvas.getContext("2d");

            const minSide = Math.min(img.width, img.height);
            const sx = (img.width - minSide) / 2;
            const sy = (img.height - minSide) / 2;
            ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, TARGET_SIZE, TARGET_SIZE);

            const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.88);
            this.editingPlaylistCoverUrl = optimizedDataUrl;
            if (this.editPlaylistCoverPreview) {
              this.editPlaylistCoverPreview.src = optimizedDataUrl;
            }
            if (this.editPlaylistRemoveCoverBtn) {
              this.editPlaylistRemoveCoverBtn.style.display = "inline-flex";
            }
            this.showToast(this.currentLanguage === "id" ? "Foto cover siap disimpan!" : "Cover photo ready to save!");
          };
          img.onerror = () => {
            this.showToast(this.currentLanguage === "id" ? "Gagal memproses gambar." : "Failed to process image.");
          };
          img.src = loadEvt.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    if (this.editPlaylistToggleUrlBtn) {
      this.editPlaylistToggleUrlBtn.addEventListener("click", () => {
        if (this.editPlaylistUrlRow) {
          const isShown = this.editPlaylistUrlRow.style.display !== "none";
          this.editPlaylistUrlRow.style.display = isShown ? "none" : "block";
          if (!isShown && this.editPlaylistUrlInput) {
            this.editPlaylistUrlInput.focus();
          }
        }
      });
    }

    if (this.editPlaylistApplyUrlBtn) {
      this.editPlaylistApplyUrlBtn.addEventListener("click", () => {
        const url = (this.editPlaylistUrlInput?.value || "").trim();
        if (!url) {
          this.showToast(this.currentLanguage === "id" ? "Masukkan tautan URL gambar!" : "Please enter an image URL!");
          return;
        }
        const testImg = new Image();
        testImg.onload = () => {
          this.editingPlaylistCoverUrl = url;
          if (this.editPlaylistCoverPreview) {
            this.editPlaylistCoverPreview.src = url;
          }
          if (this.editPlaylistRemoveCoverBtn) {
            this.editPlaylistRemoveCoverBtn.style.display = "inline-flex";
          }
          this.showToast(this.currentLanguage === "id" ? "Foto cover dari URL berhasil dimuat!" : "Cover from URL loaded!");
        };
        testImg.onerror = () => {
          this.showToast(this.currentLanguage === "id" ? "Gagal memuat URL gambar. Pastikan link langsung ke berkas gambar." : "Failed to load image URL.");
        };
        testImg.src = url;
      });
    }

    if (this.editPlaylistUrlInput) {
      this.editPlaylistUrlInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.editPlaylistApplyUrlBtn?.click();
        }
      });
    }

    if (this.editPlaylistRemoveCoverBtn) {
      this.editPlaylistRemoveCoverBtn.addEventListener("click", () => {
        this.editingPlaylistCoverUrl = null;
        const pl = this.userPlaylists.find(p => p.id === this.editingPlaylistId);
        const fallback = (pl?.tracks && pl.tracks[0]?.artwork_url) || this.DEFAULT_TRACK_ART;
        if (this.editPlaylistCoverPreview) {
          this.editPlaylistCoverPreview.src = fallback;
        }
        this.editPlaylistRemoveCoverBtn.style.display = "none";
        if (this.editPlaylistUrlInput) this.editPlaylistUrlInput.value = "";
        if (this.editPlaylistCoverFileInput) this.editPlaylistCoverFileInput.value = "";
        this.showToast(this.currentLanguage === "id" ? "Foto kustom dihapus, menggunakan cover bawaan." : "Custom cover removed, using default.");
      });
    }

    if (this.submitEditPlaylistBtn) {
      this.submitEditPlaylistBtn.addEventListener("click", () => {
        const name = (this.editPlaylistNameInput.value || "").trim();
        const desc = (this.editPlaylistDescInput.value || "").trim();
        if (!name) {
          this.showToast(this.currentLanguage === "id" ? "Masukkan nama playlist!" : "Please enter a playlist name!");
          return;
        }
        if (this.editingPlaylistId) {
          this.updatePlaylist(this.editingPlaylistId, name, desc, this.editingPlaylistCoverUrl);
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

    // Sidebar My Library Filter Pills (Spotify Desktop Style)
    const sidebarLibPills = document.querySelectorAll("#sidebarLibraryPills .lib-pill");
    if (sidebarLibPills.length > 0) {
      sidebarLibPills.forEach(pill => {
        pill.addEventListener("click", () => {
          const filter = pill.dataset.filter;
          if (this.sidebarLibraryFilter === filter && filter !== "all") {
            this.sidebarLibraryFilter = "all";
            sidebarLibPills.forEach(p => p.classList.toggle("active", p.dataset.filter === "all"));
          } else {
            this.sidebarLibraryFilter = filter;
            sidebarLibPills.forEach(p => p.classList.toggle("active", p === pill));
          }
          this.renderUserPlaylists();
        });
      });
    }

    const sidebarLibTitleWrap = document.querySelector(".sidebar-section-title-wrap");
    if (sidebarLibTitleWrap) {
      sidebarLibTitleWrap.addEventListener("click", () => {
        this.sidebarLibraryFilter = "all";
        const pills = document.querySelectorAll("#sidebarLibraryPills .lib-pill");
        pills.forEach(p => p.classList.toggle("active", p.dataset.filter === "all"));
        this.renderUserPlaylists();
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

    // Stream Verification & Candidates Modal Listeners (Nuclear Feature)
    if (this.verifyStreamBtn) {
      this.verifyStreamBtn.addEventListener("click", () => {
        const cur = this.tracks[this.currentTrackIndex];
        if (cur) this.openStreamCandidatesModal(cur);
      });
    }

    if (this.screenVerifyStreamBtn) {
      this.screenVerifyStreamBtn.addEventListener("click", () => {
        const cur = this.tracks[this.currentTrackIndex];
        if (cur) this.openStreamCandidatesModal(cur);
      });
    }

    if (this.closeStreamCandidatesBtn) {
      this.closeStreamCandidatesBtn.addEventListener("click", () => {
        if (this.streamCandidatesModal) this.streamCandidatesModal.style.display = "none";
      });
    }

    if (this.cancelStreamCandidatesBtn) {
      this.cancelStreamCandidatesBtn.addEventListener("click", () => {
        if (this.streamCandidatesModal) this.streamCandidatesModal.style.display = "none";
      });
    }

    if (this.streamCandidatesModal) {
      this.streamCandidatesModal.addEventListener("click", (e) => {
        if (e.target === this.streamCandidatesModal) {
          this.streamCandidatesModal.style.display = "none";
        }
      });
    }

    if (this.unverifyStreamBtn) {
      this.unverifyStreamBtn.addEventListener("click", async () => {
        if (!this.candidateActiveTrack) return;
        if (window.electronAPI && typeof window.electronAPI.unverifyStream === 'function') {
          await window.electronAPI.unverifyStream({
            title: this.candidateActiveTrack.title,
            artist: this.candidateActiveTrack.artist
          });
          this.showToast(this.currentLanguage === 'id' ? 'Verifikasi audio dihapus (kembali ke otomatis)' : 'Stream verification reset to auto');
          this.updateVerificationBadge(this.candidateActiveTrack);
          if (this.streamCandidatesModal) this.streamCandidatesModal.style.display = "none";
        }
      });
    }

    // Hook Remote Actions (MPD & MCP AI Agents)
    if (window.electronAPI && typeof window.electronAPI.onJamAction === 'function') {
      window.electronAPI.onJamAction((action) => {
        if (!action) return;
        const act = action.action;
        if (act === 'toggle-play') {
          this.togglePlayPause();
        } else if (act === 'play') {
          if (this.audio && this.audio.paused) this.togglePlayPause();
        } else if (act === 'pause') {
          if (this.audio && !this.audio.paused) this.togglePlayPause();
        } else if (act === 'next') {
          this.playNext();
        } else if (act === 'prev') {
          this.playPrevious();
        } else if (act === 'toggle-shuffle') {
          this.toggleShuffle();
        } else if (act === 'set-shuffle') {
          this.isShuffled = !!action.value;
          if (this.shuffleBtn) this.shuffleBtn.classList.toggle("active", this.isShuffled);
          this.syncJamState();
        } else if (act === 'toggle-repeat') {
          this.toggleRepeat();
        } else if (act === 'set-repeat') {
          this.repeatMode = action.value === 'track' ? 2 : (action.value === 'context' ? 1 : 0);
          if (this.repeatIcon) {
            this.repeatIcon.setAttribute("color", this.repeatMode > 0 ? "var(--color-brand-primary)" : "currentColor");
          }
          this.syncJamState();
        } else if (act === 'stop') {
          if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isPlaying = false;
            if (this.playPauseIcon) this.playPauseIcon.setAttribute("name", "play");
            this.syncJamState();
          }
        } else if (act === 'seek' && typeof action.value === 'number') {
          if (this.audio) {
            this.audio.currentTime = action.value;
            this.updateProgress();
            this.syncJamState();
          }
        } else if (act === 'volume' && typeof action.value === 'number') {
          this.setVolume(action.value);
          this.syncJamState();
        } else if (act === 'play-index' && typeof action.value === 'number') {
          this.loadTrack(action.value, true);
        } else if (act === 'remove-index' && typeof action.value === 'number') {
          if (this.tracks && this.tracks[action.value]) {
            this.tracks.splice(action.value, 1);
            this.renderQueue();
            this.syncJamState();
          }
        } else if (act === 'clear-queue') {
          if (this.tracks) {
            const cur = this.tracks[this.currentTrackIndex];
            this.tracks = cur ? [cur] : [];
            this.currentTrackIndex = 0;
            this.renderQueue();
            this.syncJamState();
          }
        } else if (act === 'play-track-now' && action.track) {
          const t = action.track;
          const newTrack = {
            id: t.videoId || t.id,
            video_id: t.videoId || t.id,
            title: t.title,
            artist: t.artist || '',
            artwork_url: t.artwork || t.artwork_url || t.cover || this.DEFAULT_TRACK_ART,
            duration_secs: t.durationSec || t.duration_secs || 0
          };
          this.tracks.splice(this.currentTrackIndex + 1, 0, newTrack);
          this.loadTrack(this.currentTrackIndex + 1, true);
        } else if (act === 'add-queue' && action.track) {
          const t = action.track;
          const newTrack = {
            id: t.videoId || t.id,
            video_id: t.videoId || t.id,
            title: t.title,
            artist: t.artist || '',
            artwork_url: t.artwork || t.artwork_url || t.cover || this.DEFAULT_TRACK_ART,
            duration_secs: t.durationSec || t.duration_secs || 0
          };
          this.addToQueue(newTrack);
          this.syncJamState();
        } else if (act === 'import-playlist-result' && action.playlist) {
          const res = action.playlist;
          if (res && res.tracks && res.tracks.length > 0) {
            const playlistTitle = res.customName || res.title || `Imported ${res.provider || 'Playlist'}`;
            const newPlaylist = {
              id: `pl_imp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
              name: playlistTitle,
              title: playlistTitle,
              author: `Imported ${res.provider || 'External'}`,
              description: `Imported via MCP from ${res.provider || 'Link'} (${res.tracks.length} tracks).`,
              artwork_url: res.tracks[0]?.artwork_url || this.DEFAULT_TRACK_ART,
              tracks: res.tracks,
              track_count: `${res.tracks.length} Tracks`,
              createdAt: Date.now()
            };
            this.userPlaylists.unshift(newPlaylist);
            this.saveUserPlaylists();
            this.renderUserPlaylists();
            this.showToast(`MCP: Imported "${playlistTitle}" (${res.tracks.length} tracks)!`);
          }
        }
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

    // Keydown on search input (Keyboard navigation + Enter execution)
    this.searchInput.addEventListener("keydown", async (e) => {
      if (e.key === "ArrowDown") {
        if (this.searchSuggestionsDropdown && this.searchSuggestionsDropdown.style.display !== "none") {
          e.preventDefault();
          this.navigateSuggestions(1);
          return;
        }
      } else if (e.key === "ArrowUp") {
        if (this.searchSuggestionsDropdown && this.searchSuggestionsDropdown.style.display !== "none") {
          e.preventDefault();
          this.navigateSuggestions(-1);
          return;
        }
      } else if (e.key === "Escape") {
        if (this.searchSuggestionsDropdown && this.searchSuggestionsDropdown.style.display !== "none") {
          e.preventDefault();
          this.hideSearchSuggestions();
          return;
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        clearTimeout(this.searchDebounceTimer);
        clearTimeout(this.suggestionDebounceTimer);

        if (this.searchSuggestionsDropdown && this.searchSuggestionsDropdown.style.display !== "none" && this.activeSuggestionIndex >= 0 && this.currentSuggestions[this.activeSuggestionIndex]) {
          this.selectSuggestion(this.currentSuggestions[this.activeSuggestionIndex]);
          return;
        }

        const query = this.searchInput.value.trim();
        if (!query) return;

        this.hideSearchSuggestions();

        // Check for Spotify or external playlist/album/track link
        const isSpotify = /(?:open\.)?spotify\.com\/(playlist|album|track)[/:]([a-zA-Z0-9]+)/i.test(query) || /^spotify:(playlist|album|track):([a-zA-Z0-9]+)/i.test(query);
        if (isSpotify) {
          if (this.spotifyLinkBanner) this.spotifyLinkBanner.style.display = "none";
          this.handleUniversalLinkImport(query);
          return;
        }

        this.saveRecentSearch(query);

        if (this.currentSearchFilter === 'artist') {
          this.openArtistDetail(query);
          return;
        }

        this.searchOnlineMusic(query, this.currentSearchFilter);
      }
    });

    // Search focus
    this.searchInput.addEventListener("focus", () => {
      const query = this.searchInput.value.trim();
      if (!query) {
        this.renderRecentSearches();
      } else {
        if (this.currentSuggestions && this.currentSuggestions.length > 0) {
          this.showSearchSuggestions();
        } else {
          this.fetchAndRenderSuggestions(query);
        }
      }
    });

    // Search clear button
    if (this.searchClearBtn) {
      this.searchClearBtn.addEventListener("click", () => {
        this.searchInput.value = "";
        this.originalSearchQuery = "";
        this.searchClearBtn.style.display = "none";
        this.hideSearchSuggestions();
        this.switchView("home");
        this.fetchMusicfyRecommendations();
      });
    }

    // Clear all recent searches button
    if (this.clearRecentSearchesBtn) {
      this.clearRecentSearchesBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.clearAllRecentSearches();
      });
    }

    // Outside click dismisses suggestions
    document.addEventListener("click", (e) => {
      if (this.searchSuggestionsDropdown && !e.target.closest(".search-container-col")) {
        this.hideSearchSuggestions();
      }
    });

    // Bind Dual-Deck event listeners to Deck A and Deck B
    this.bindDeckEvents(this.deckA || this.audio, 'A');
    this.bindDeckEvents(this.deckB || this.preloadAudio, 'B');

    // Playback session persistence hooks (on window close, unload, pagehide, and Electron app-before-close)
    window.addEventListener("beforeunload", () => this.savePlaybackSession(true));
    window.addEventListener("pagehide", () => this.savePlaybackSession(true));

    if (window.electronAPI && typeof window.electronAPI.onAppBeforeClose === "function") {
      window.electronAPI.onAppBeforeClose(() => {
        this.savePlaybackSession(true);
      });
    }

    // 1-Click Offline Playlist Download Progress Hook
    if (window.electronAPI && typeof window.electronAPI.onDownloadPlaylistProgress === "function") {
      window.electronAPI.onDownloadPlaylistProgress((progress) => {
        this.handleDownloadPlaylistProgress(progress);
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
          this.playerSeekbar.style.background = `linear-gradient(to right, var(--color-brand-primary) 0%, var(--color-brand-primary) ${val}%, rgba(255, 255, 255, 0.16) ${val}%, rgba(255, 255, 255, 0.16) 100%)`;
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
          if (typeof this.updateMediaSessionPosition === 'function') {
            this.updateMediaSessionPosition();
          }
        }
        this.isSeekingBottom = false;
      });
    }

    // Real Online Search Input with Debounce & Live Suggestions
    this.searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      this.originalSearchQuery = query;
      if (this.searchClearBtn) {
        this.searchClearBtn.style.display = query ? "inline-flex" : "none";
      }
      clearTimeout(this.searchDebounceTimer);
      clearTimeout(this.suggestionDebounceTimer);

      const isSpotify = /(?:open\.)?spotify\.com\/(playlist|album|track)[/:]([a-zA-Z0-9]+)/i.test(query) || /^spotify:(playlist|album|track):([a-zA-Z0-9]+)/i.test(query);
      if (this.spotifyLinkBanner) {
        if (isSpotify) {
          const type = query.includes('track') ? (this.currentLanguage === "id" ? 'Lagu' : 'Track') : (query.includes('album') ? 'Album' : 'Playlist');
          if (this.spotifyLinkBannerTitle) {
            this.spotifyLinkBannerTitle.textContent = this.currentLanguage === "id" ? `Tautan Spotify ${type} Terdeteksi` : `Spotify ${type} Link Detected`;
          }
          if (this.spotifyLinkBannerDesc) {
            this.spotifyLinkBannerDesc.textContent = this.currentLanguage === "id" ? `Tekan Enter atau klik tombol untuk impor & putar instan di SoraFy` : `Press Enter or click button to import & play instantly in SoraFy`;
          }
          this.spotifyLinkBanner.style.display = "flex";
          this.hideSearchSuggestions();
        } else {
          this.spotifyLinkBanner.style.display = "none";
        }
      }

      if (!query) {
        this.renderRecentSearches();
        this.switchView("home");
        this.fetchMusicfyRecommendations();
        return;
      }

      if (isSpotify) {
        return;
      }

      this.suggestionDebounceTimer = setTimeout(() => {
        this.fetchAndRenderSuggestions(query);
      }, 120);

      this.searchDebounceTimer = setTimeout(() => {
        this.searchOnlineMusic(query, this.currentSearchFilter);
      }, 450);
    });

    if (this.spotifyLinkBannerBtn) {
      this.spotifyLinkBannerBtn.addEventListener("click", () => {
        const query = (this.searchInput?.value || "").trim();
        if (query) {
          if (this.spotifyLinkBanner) this.spotifyLinkBanner.style.display = "none";
          this.handleUniversalLinkImport(query);
        }
      });
    }

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
          if (view === "home") {
            this.currentCustomView = null;
          }
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

    if (this.unifiedImportModal) {
      this.unifiedImportModal.addEventListener("click", (e) => {
        if (e.target === this.unifiedImportModal) {
          this.unifiedImportModal.style.display = "none";
        }
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
        try {
          const stateMap = Object.fromEntries(this.plugins.map(p => [p.id, true]));
          localStorage.setItem("sorafy_plugins_state", JSON.stringify(stateMap));
        } catch (e) {}
        this.renderPlugins();
        this.showToast("All 9 plugins reset to active status!");
      });
    }

    // Hi-Fi Equalizer Preset chips
    if (this.eqChips) {
      this.eqChips.forEach(chip => {
        chip.addEventListener("click", () => {
          this.eqChips.forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          const presetName = chip.dataset.eq;
          this.applyEqualizerPreset(presetName);
        });
      });
    }

    // Hi-Fi Equalizer Reset to Flat button
    if (this.eqResetFlatBtn) {
      this.eqResetFlatBtn.addEventListener("click", () => {
        this.applyEqualizerPreset("Flat");
        if (this.preampSlider) {
          this.preampSlider.value = 0;
          this.currentPreamp = 0;
          if (this.preampVal) this.preampVal.textContent = "0.0 dB";
          if (this.preampNode && !this.isEqBypassed) this.preampNode.gain.value = 1.0;
          localStorage.setItem("sorafy_eq_preamp", 0);
        }
        if (this.airExciterSlider) {
          this.airExciterSlider.value = 0;
          this.currentAirExciter = 0;
          if (this.airExciterVal) this.airExciterVal.textContent = "0%";
          if (this.airFilterNode && !this.isEqBypassed) this.airFilterNode.gain.value = 0;
          localStorage.setItem("sorafy_eq_air", 0);
        }
        if (this.virtualizerSlider) {
          this.virtualizerSlider.value = 0;
          if (this.virtualizerVal) this.virtualizerVal.textContent = "0%";
        }
        this.showToast("Equalizer reset to Flat (0.0 dB Reference)");
      });
    }

    // Hi-Fi Equalizer Bypass Toggle
    if (this.eqBypassBtn) {
      this.updateEqBypassUI();
      this.eqBypassBtn.addEventListener("click", () => {
        this.toggleEqBypass();
      });
    }

    // Hi-Fi Preamp Gain Slider
    if (this.preampSlider) {
      this.preampSlider.value = this.currentPreamp;
      if (this.preampVal) this.preampVal.textContent = `${this.currentPreamp > 0 ? '+' : ''}${this.currentPreamp.toFixed(1)} dB`;
      this.preampSlider.addEventListener("input", (e) => {
        this.currentPreamp = parseFloat(e.target.value);
        if (this.preampVal) this.preampVal.textContent = `${this.currentPreamp > 0 ? '+' : ''}${this.currentPreamp.toFixed(1)} dB`;
        if (this.preampNode && !this.isEqBypassed) {
          this.preampNode.gain.value = Math.pow(10, this.currentPreamp / 20);
        }
        localStorage.setItem("sorafy_eq_preamp", this.currentPreamp);
        this.updateHeadroomTag();
        this.drawEqResponseCurve();
      });
    }

    // Hi-Fi Bass Boost Slider
    if (this.bassBoostSlider) {
      this.bassBoostSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        this.bassBoostAmount = val;
        if (this.bassBoostVal) this.bassBoostVal.textContent = `${val}%`;
        if (this.bassFilterNode && !this.isEqBypassed) {
          this.bassFilterNode.gain.value = (val / 100) * 8.0;
        }
        this.drawEqResponseCurve();
      });
    }

    // Hi-Fi Virtualizer Slider
    if (this.virtualizerSlider) {
      this.virtualizerSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        this.virtualizerAmount = val;
        if (this.virtualizerVal) this.virtualizerVal.textContent = `${val}%`;
      });
    }

    // Hi-Fi Air Exciter Slider
    if (this.airExciterSlider) {
      this.airExciterSlider.value = this.currentAirExciter;
      if (this.airExciterVal) this.airExciterVal.textContent = `${this.currentAirExciter}%`;
      this.airExciterSlider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        this.currentAirExciter = val;
        if (this.airExciterVal) this.airExciterVal.textContent = `${val}%`;
        if (this.airFilterNode && !this.isEqBypassed) {
          this.airFilterNode.gain.value = (val / 100) * 6.0;
        }
        localStorage.setItem("sorafy_eq_air", val);
        this.drawEqResponseCurve();
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

      // Shortcut Ctrl + , to open Settings Modal
      if ((e.ctrlKey || e.metaKey) && e.code === "Comma") {
        e.preventDefault();
        if (this.settingsModal) {
          this.settingsModal.style.display = this.settingsModal.style.display === "none" ? "flex" : "none";
        }
        return;
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

          if (action === "start-radio") {
            this.startRadioForTrack(track);
          } else if (action === "play-next") {
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
          } else if (action === "stream-candidates") {
            this.openStreamCandidatesModal(track);
          }
        });
      });
    }

    if (window.electronAPI && typeof window.electronAPI.getDownloadedTracks === 'function') {
      window.electronAPI.getDownloadedTracks().then(tracks => {
        this.downloadedTracks = Array.isArray(tracks) ? tracks : [];
        this.renderUserPlaylists();
      }).catch(() => {});
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
          this.renderQuickPicksCarousel();
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
      if (!this.hasRestoredSession && (!this.isPlaying || !this.tracks || this.tracks.length === 0)) {
        this.tracks = this.homeTracks;
      }

      if (this.homeTracks.length === 0) {
        await this.fetchTrendingChart();
        return;
      }

      // Populate Quick Picks Horizontal Swipe Carousel (User Listening History)
      if (this.quickPicksCarousel) {
        this.renderQuickPicksCarousel();
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
  // Quick Picks Carousel (Driven by User Listening History)
  // =========================================================
  getQuickPicksTracks() {
    const history = (this.historyTracks || []).map(t => ({
      ...t,
      is_liked: this.likedTrackIds.has(t.id)
    }));

    if (history.length >= 16) {
      return history.slice(0, 16);
    }

    const seenIds = new Set(history.map(t => t.id));
    const padded = [...history];

    try {
      const likedTracks = JSON.parse(localStorage.getItem("sorafy_liked_tracks") || "[]");
      for (const t of likedTracks) {
        if (!seenIds.has(t.id)) {
          seenIds.add(t.id);
          padded.push({ ...t, is_liked: true });
          if (padded.length >= 16) break;
        }
      }
    } catch (_) {}

    const backupPool = (this.officialQuickPicks && this.officialQuickPicks.length > 0)
      ? this.officialQuickPicks
      : (this.homeTracks || []);

    for (const t of backupPool) {
      if (padded.length >= 16) break;
      if (!seenIds.has(t.id)) {
        seenIds.add(t.id);
        padded.push({
          ...t,
          is_liked: this.likedTrackIds.has(t.id)
        });
      }
    }

    return padded;
  }

  renderQuickPicksCarousel() {
    if (!this.quickPicksCarousel) return;
    const tracks = this.getQuickPicksTracks();
    if (tracks && tracks.length > 0) {
      this.renderYtmSongCarousel(this.quickPicksCarousel, tracks);
    }
  }

  // =========================================================
  // Modern Horizontal Swipe Song Carousel (4 rows per column)
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
          this.tracks = [...tracks];
          const itemIdx = this.tracks.findIndex(t => t.id === track.id);
          this.loadTrack(itemIdx >= 0 ? itemIdx : 0, true);
          this.showToast(this.currentLanguage === 'id' ? `Memutar ${track.title}` : `Playing ${track.title}`);
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

    // 1. Render Mood & Genre Cards (Spotify & YouTube Music Official Cover Layout)
    if (this.moodGenreGrid) {
      const moodCategories = [
        { 
          name: "Music", 
          query: "top hits 2026 music billboard", 
          bg: "#DC148C", 
          cover: "https://i.scdn.co/image/ab67706f00000002960019ea66cba66a44fdd4c2" 
        },
        { 
          name: "Podcasts", 
          query: "podcast indonesia cerita edukasi", 
          bg: "#006450", 
          cover: "https://i.scdn.co/image/ab6765630000ba8ac3865d12f0a37c8dc7d20cc3" 
        },
        { 
          name: "Live Events", 
          query: "live acoustic concert performance", 
          bg: "#7358FF", 
          cover: "https://yt3.googleusercontent.com/0gueaZgvg_Qp9RssMO_SS2E-ENZgPDNGv-epQfn7foDFHG5WWRuohExueC6uOE6G7KM6wIKTHvtfnANy=w544-h544-l90-rj" 
        },
        { 
          name: "Made For You", 
          query: "mix for you daily recommended songs", 
          bg: "#1E3264", 
          cover: "https://i.scdn.co/image/ab67706f0000000281ee550c81bbff8053a023e8" 
        },
        { 
          name: "New Releases", 
          query: "rilisan baru lagu baru 2026", 
          bg: "#608108", 
          cover: "https://i.scdn.co/image/ab67706f00000002c359d225c77567fbfd28470e" 
        },
        { 
          name: "Pop", 
          query: "pop hits billboard top 50", 
          bg: "#477D95", 
          cover: "https://i.scdn.co/image/ab67706f00000002a55a2460abc3810af9e7ea1d" 
        },
        { 
          name: "Indie", 
          query: "indie folk alternative pop indonesia", 
          bg: "#601E23", 
          cover: "https://i.scdn.co/image/ab67706f000000027dea5c0e18df3727eacdc4e1" 
        },
        { 
          name: "Musik Indonesia", 
          query: "pop indonesia hits viral terpopuler", 
          bg: "#E91429", 
          cover: "https://i.scdn.co/image/ab67706f00000002b90b3792eef5bc66cd01ceb9" 
        },
        { 
          name: "K-pop", 
          query: "k-pop top hits bts blackpink newjeans", 
          bg: "#E61E32", 
          cover: "https://i.scdn.co/image/ab67706f0000000234ef3ce806c69bc55826c1d9" 
        },
        { 
          name: "Charts", 
          query: "top songs global billboard charts", 
          bg: "#8D67AB", 
          cover: "https://charts-images.scdn.co/assets/locale_en/regional/daily/region_global_default.jpg" 
        },
        { 
          name: "Podcast Charts", 
          query: "podcast teratas chart indonesia", 
          bg: "#0D73EC", 
          cover: "https://charts-images.scdn.co/assets/locale_en/regional/daily/region_id_default.jpg" 
        },
        { 
          name: "Podcast New Releases", 
          query: "podcast episode baru terbaru indonesia", 
          bg: "#8D67AB", 
          cover: "https://i.scdn.co/image/ab67706f00000002c359d225c77567fbfd28470e" 
        },
        { 
          name: "Video Podcast", 
          query: "video podcast visual talkshow", 
          bg: "#1E3264", 
          cover: "https://i.scdn.co/image/ab67706f000000026020f2f6476db518ef747da4" 
        },
        { 
          name: "In the car", 
          query: "road trip perjalanan santai lagu mobil", 
          bg: "#0D73EC", 
          cover: "https://i.scdn.co/image/ab67706f00000002266beb50b0032b0f140a749e" 
        },
        { 
          name: "Kids & Family", 
          query: "lagu anak anak ceria family hits", 
          bg: "#509BF5", 
          cover: "https://i.scdn.co/image/ab67706f00000002aad4cfd507bf1a051d1398ed" 
        },
        { 
          name: "Hip-Hop", 
          query: "hip-hop rap urban beat 2026", 
          bg: "#BC5900", 
          cover: "https://i.scdn.co/image/ab67706f00000002876581e4be85838f0e1ad09d" 
        },
        { 
          name: "Rock", 
          query: "rock alternative rock hits indonesia barat", 
          bg: "#222326", 
          cover: "https://i.scdn.co/image/ab67706f00000002694bf33281695f3b7542a09a" 
        },
        { 
          name: "Focus & Study", 
          query: "lofi study beats instrumental focus work", 
          bg: "#065F46", 
          cover: "https://i.scdn.co/image/ab67706f000000026020f2f6476db518ef747da4" 
        },
        { 
          name: "Chill & Relax", 
          query: "santai chill acoustic malam hari piano", 
          bg: "#1E3A8A", 
          cover: "https://i.scdn.co/image/ab67706f000000020408713c731caaf1f800615a" 
        },
        { 
          name: "Dance / Electronic", 
          query: "edm dance club party electronic music", 
          bg: "#7E22CE", 
          cover: "https://i.scdn.co/image/ab67706f00000002385ff7ec006cdc4922f52557" 
        }
      ];

      this.moodGenreGrid.innerHTML = "";
      moodCategories.forEach(item => {
        const card = document.createElement("div");
        card.className = "mood-genre-card";
        card.style.backgroundColor = item.bg;
        card.innerHTML = `
          <span class="mood-genre-title">${this.escapeHtml(item.name)}</span>
          <img class="mood-genre-cover" src="${item.cover}" alt="${this.escapeHtml(item.name)}" loading="lazy" onerror="this.style.display='none'">
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
            card.addEventListener("click", () => {
              this.openAlbumDetail(album);
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

  async loadSpotifyFeaturedPlaylist(url, name) {
    if (!window.electronAPI || typeof window.electronAPI.importExternalPlaylist !== 'function') {
      this.showToast("Spotify import is only available on desktop.");
      return;
    }

    this.showToast(this.currentLanguage === "id" ? `Mengambil metadata Spotify "${name}"...` : `Fetching Spotify playlist "${name}"...`);
    try {
      const res = await window.electronAPI.importExternalPlaylist(url);
      if (!res || !res.tracks || !res.tracks.length) {
        throw new Error(res?.error || "Gagal mengambil daftar lagu dari Spotify.");
      }

      const playlistTitle = res.title || name || "Spotify Playlist";
      const playlistObj = {
        id: `spot_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        title: playlistTitle,
        name: playlistTitle,
        author: "Spotify Curated",
        description: `Spotify Curated Playlist • ${res.tracks.length} tracks. Audio dialirkan via Opus stream berkualitas tinggi.`,
        artwork_url: res.artwork_url || res.tracks[0]?.artwork_url || this.DEFAULT_TRACK_ART,
        tracks: res.tracks,
        track_count: `${res.tracks.length} Tracks`,
        createdAt: Date.now()
      };

      const existingIdx = this.userPlaylists.findIndex(p => p.name === playlistTitle || p.title === playlistTitle);
      if (existingIdx >= 0) {
        this.userPlaylists[existingIdx] = playlistObj;
      } else {
        this.userPlaylists.unshift(playlistObj);
      }
      this.saveUserPlaylists();
      this.renderUserPlaylists();

      this.openPlaylistDetail(playlistObj);
      this.showToast(this.currentLanguage === "id" ? `Berhasil memuat "${playlistTitle}" (${res.tracks.length} lagu)!` : `Loaded "${playlistTitle}" (${res.tracks.length} tracks)!`);
    } catch (err) {
      console.error("Gagal memuat playlist Spotify:", err);
      this.showToast(`Gagal memuat Spotify playlist: ${err.message || 'Periksa koneksi internet'}`);
    }
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
    if (this.currentView === "playlist" && this.currentPlaylist?.is_special === "liked") {
      this.openLikedSongsView();
    }
    this.renderUserPlaylists();
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
          this.renderQuickPicksCarousel();
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

    // 5. Shift + Mouse Scroll support for horizontal carousels (with hidden scrollbars)
    document.addEventListener("wheel", (e) => {
      if (!e.shiftKey) return;
      const horizontalContainer = e.target.closest(
        ".ytm-swipe-carousel, .ytm-video-cards-row, .ytm-community-playlists-row, .ytm-new-releases-row, .category-chips, .curated-playlists-row, .explore-pill-grid, .artist-peers-row, .charts-carousel, .hifi-presets-scroll"
      );
      if (horizontalContainer) {
        e.preventDefault();
        let delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
        if (e.deltaMode === 1) delta *= 33;
        else if (e.deltaMode === 2) delta *= 100;
        horizontalContainer.scrollBy({ left: delta, behavior: "auto" });
      }
    }, { passive: false });
  }

  renderOldFavoritesMixes() {
    if (!this.ytmMixCardsGrid) return;
    this.ytmMixCardsGrid.innerHTML = "";

    const chartsData = [
      {
        id: "chart_top50_id",
        title: "Top 50 - Indonesia",
        sub: this.currentLanguage === "id"
          ? "Lagu teratas di Indonesia yang paling banyak diputar setiap hari & minggu ini."
          : "Daily update of the most played tracks in Indonesia right now.",
        cover: "https://charts-images.scdn.co/assets/locale_en/regional/daily/region_id_default.jpg",
        type: "yt_chart",
        playlistId: "VLPL4fGSI1pDJn5QPpj0R4vVgRWk8sSq549G",
        fallbackQuery: "Top 50 Indonesia 2026 hits"
      },
      {
        id: "chart_top50_global",
        title: "Top 50 - Global",
        sub: this.currentLanguage === "id"
          ? "Update harian trek musik paling populer & didengarkan di seluruh dunia."
          : "Daily update of the most played tracks right now - Global.",
        cover: "https://charts-images.scdn.co/assets/locale_en/regional/daily/region_global_default.jpg",
        type: "spotify_chart",
        spotifyUrl: "https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF",
        fallbackPlaylistId: "VLPL4fGSI1pDJn6O1EdETRLet88vhkIxCQjI",
        fallbackQuery: "Top 50 Global hits 2026"
      },
      {
        id: "chart_viral50_id",
        title: "Viral 50 - Indonesia",
        sub: this.currentLanguage === "id"
          ? "Trek paling viral dan banyak dibagikan di media sosial minggu ini."
          : "The most viral tracks in Indonesia updated weekly.",
        cover: "https://charts-images.scdn.co/assets/locale_en/viral/daily/region_id_default.jpg",
        type: "search",
        query: "Lagi Viral Indonesia 2026",
        fallbackQuery: "Viral Hits Indonesia 2026"
      },
      {
        id: "chart_todays_top_hits",
        title: "Today's Top Hits",
        sub: this.currentLanguage === "id"
          ? "Koleksi lagu hits internasional terbesar dan terpopuler pilihan kurator."
          : "The biggest hits on the planet curated today.",
        cover: "https://i.scdn.co/image/ab67706f00000002960019ea66cba66a44fdd4c2",
        type: "spotify_chart",
        spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
        fallbackQuery: "Today's Top Hits pop 2026"
      }
    ];

    chartsData.forEach(chart => {
      const card = document.createElement("div");
      card.className = "ytm-mix-card ytm-chart-card";

      card.innerHTML = `
        <div class="ytm-mix-card-art" style="background: #181818; position: relative; overflow: hidden; border-radius: 12px; aspect-ratio: 1/1;">
          <img src="${chart.cover}" alt="${this.escapeHtml(chart.title)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
          <div class="mix-play-overlay" title="Play">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
        </div>
        <div class="ytm-mix-card-title">${this.escapeHtml(chart.title)}</div>
        <div class="ytm-mix-card-sub">${this.escapeHtml(chart.sub)}</div>
      `;

      let cachedTracks = null;
      const loadChartTracks = async () => {
        if (cachedTracks && cachedTracks.length > 0) return cachedTracks;
        let loadedTracks = [];
        try {
          if (chart.type === "spotify_chart" && chart.spotifyUrl && window.electronAPI && typeof window.electronAPI.importExternalPlaylist === "function") {
            const res = await window.electronAPI.importExternalPlaylist(chart.spotifyUrl);
            if (res && res.success && Array.isArray(res.tracks) && res.tracks.length > 0) {
              loadedTracks = res.tracks;
            }
          }

          if (!loadedTracks.length && chart.playlistId && window.electronAPI && typeof window.electronAPI.browseYouTube === "function") {
            const res = await window.electronAPI.browseYouTube(chart.playlistId);
            if (res && Array.isArray(res.tracks) && res.tracks.length > 0) {
              loadedTracks = res.tracks;
            }
          }

          if (!loadedTracks.length && chart.fallbackPlaylistId && window.electronAPI && typeof window.electronAPI.browseYouTube === "function") {
            const res = await window.electronAPI.browseYouTube(chart.fallbackPlaylistId);
            if (res && Array.isArray(res.tracks) && res.tracks.length > 0) {
              loadedTracks = res.tracks;
            }
          }

          if (!loadedTracks.length && (chart.query || chart.fallbackQuery)) {
            const q = chart.query || chart.fallbackQuery;
            if (window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === "function") {
              const res = await window.electronAPI.searchYouTubeMusic(q);
              if (Array.isArray(res) && res.length > 0) {
                loadedTracks = res;
              }
            }
          }
        } catch (err) {
          console.warn("Chart load error:", err);
        }

        cachedTracks = loadedTracks.map(t => ({
          ...t,
          is_liked: this.likedTrackIds.has(t.id)
        }));
        return cachedTracks;
      };

      // 1. Play Button Overlay on Card -> Explicitly start playback immediately
      const playBtn = card.querySelector(".mix-play-overlay");
      if (playBtn) {
        playBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          const loadingMsg = this.currentLanguage === "id" ? `Memuat & memutar ${chart.title}...` : `Loading & playing ${chart.title}...`;
          this.showToast(loadingMsg);
          const tracks = await loadChartTracks();
          if (tracks.length > 0) {
            this.tracks = tracks;
            this.currentTrackIndex = 0;
            this.loadTrack(0, true);
            this.showToast(this.currentLanguage === "id"
              ? `Memutar ${chart.title} (${tracks.length} lagu)`
              : `Playing ${chart.title} (${tracks.length} tracks)`);
          } else {
            this.searchOnlineMusic(chart.fallbackQuery || chart.title, "song");
          }
        });
      }

      // 2. Card Body Click -> Opens the playlist track list screen WITHOUT auto-playing
      card.addEventListener("click", async () => {
        const playlistObj = {
          id: chart.id,
          title: chart.title,
          description: chart.sub,
          artwork_url: chart.cover,
          tracks: []
        };
        this.openPlaylistDetail(playlistObj);
        this.playlistTrackList.innerHTML = `
          <div style="text-align: center; padding: 48px 0; color: var(--color-text-secondary); font-size: 13px;">
            ${this.currentLanguage === "id" ? "Memuat daftar lagu tangga lagu..." : "Loading chart tracks..."}
          </div>
        `;

        const tracks = await loadChartTracks();
        if (tracks.length > 0) {
          playlistObj.tracks = tracks;
          this.currentPlaylist = playlistObj;
          this.playlistStatsText.textContent = `${tracks.length} ${this.currentLanguage === "id" ? "Lagu" : "Songs"}`;
          this.renderPlaylistTracks(tracks);
        } else {
          this.playlistTrackList.innerHTML = `
            <div style="text-align: center; padding: 48px 0; color: var(--color-text-secondary); font-size: 13px;">
              ${this.currentLanguage === "id" ? "Tidak dapat memuat daftar lagu saat ini. Silakan coba kembali." : "Unable to load chart tracks. Please try again."}
            </div>
          `;
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

      // 1. Play button overlay on card -> explicitly start playback immediately
      const playOverlay = card.querySelector(".ytm-release-play-overlay");
      if (playOverlay) {
        playOverlay.addEventListener("click", async (e) => {
          e.stopPropagation();
          const loadingMsg = this.currentLanguage === "id" ? `Memuat album ${alb.title}...` : `Loading ${alb.title}...`;
          this.showToast(loadingMsg);
          if (alb.browse_id && window.electronAPI && typeof window.electronAPI.browseYouTube === 'function') {
            try {
              const albumData = await window.electronAPI.browseYouTube(alb.browse_id);
              if (albumData && albumData.tracks && albumData.tracks.length) {
                const audioTracks = albumData.tracks.filter(t => !t.is_video && t.type !== 'video');
                this.tracks = (audioTracks.length ? audioTracks : albumData.tracks).map(t => ({
                  ...t,
                  album: alb.title,
                  artwork_url: t.artwork_url || alb.artwork_url,
                  is_liked: this.likedTrackIds.has(t.id)
                }));
                this.currentTrackIndex = 0;
                this.loadTrack(0, true);
                this.showToast(this.currentLanguage === "id"
                  ? `Memutar ${alb.title} (${this.tracks.length} lagu)`
                  : `Playing ${alb.title} (${this.tracks.length} tracks)`);
                return;
              }
            } catch (_) {}
          }
          await this.openAlbumDetail(alb);
          if (alb.tracks && alb.tracks.length > 0) {
            this.tracks = [...alb.tracks];
            this.currentTrackIndex = 0;
            this.loadTrack(0, true);
          }
        });
      }

      // 2. Card body click -> opens the album track list screen WITHOUT auto-playing
      card.addEventListener("click", (e) => {
        if (e.target.closest('.player-artist-link') || e.target.closest('.ytm-release-play-overlay')) return;
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
      let playlists = [];
      if (window.electronAPI && typeof window.electronAPI.searchYouTubeMusic === 'function') {
        const query = this.currentLanguage === 'id' ? "Top Hits Indonesia 2024" : "Top Hits 2024";
        playlists = await window.electronAPI.searchYouTubeMusic(query, 'playlist').catch(() => []);
      }

      if (playlists && playlists.length > 0) {
        this.renderCommunityPlaylistsDirect(playlists);
        return;
      }

      // Official verified editorial playlists fallback (Indonesia & Global)
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

  isItemPinned(key) {
    return this.pinnedKeys && this.pinnedKeys.has(key);
  }

  togglePin(key, title = "") {
    const isId = (this.currentLanguage === "id");
    if (!this.pinnedKeys) {
      this.pinnedKeys = new Set(["liked", "downloads"]);
    }
    if (this.pinnedKeys.has(key)) {
      this.pinnedKeys.delete(key);
      this.showToast(isId ? `Sematan dilepas: ${title}` : `Unpinned: ${title}`);
    } else {
      this.pinnedKeys.add(key);
      this.showToast(isId ? `Disematkan ke atas: ${title}` : `Pinned to top: ${title}`);
    }
    localStorage.setItem("sorafy_pinned_items", JSON.stringify([...this.pinnedKeys]));
    this.renderUserPlaylists();
  }

  unfollowArtist(artName) {
    if (!artName) return;
    this.followedArtists.delete(artName);
    if (this.followedArtistDetails) {
      delete this.followedArtistDetails[artName];
    }
    localStorage.setItem("sorafy_followed_artists", JSON.stringify([...this.followedArtists]));
    localStorage.setItem("sorafy_followed_artist_details", JSON.stringify(this.followedArtistDetails));
    this.showToast(this.currentLanguage === "id" ? `Berhenti mengikuti ${artName}` : `Unfollowed ${artName}`);
    if (this.currentView === "artist" && this.currentArtist && this.currentArtist.name && this.currentArtist.name.toLowerCase() === artName.toLowerCase()) {
      if (this.artistFollowBtn) {
        this.artistFollowBtn.textContent = this.currentLanguage === "id" ? "+ Ikuti" : "+ Follow";
        this.artistFollowBtn.classList.remove("active");
      }
    }
    this.renderUserPlaylists();
  }

  removeSavedAlbum(albumId, albumTitle = "") {
    const idx = this.likedAlbums.findIndex(a => a.id === albumId || a.title === albumTitle);
    if (idx >= 0) {
      const title = this.likedAlbums[idx].title || albumTitle || "Album";
      this.likedAlbums.splice(idx, 1);
      localStorage.setItem("sorafy_liked_albums", JSON.stringify(this.likedAlbums));
      this.showToast(this.currentLanguage === "id" ? `Album "${title}" dihapus dari library` : `Album "${title}" removed from library`);
      if (this.currentPlaylist && (this.currentPlaylist.id === albumId || this.currentPlaylist.title === albumTitle)) {
        if (this.playlistLikeAlbumBtn) {
          this.playlistLikeAlbumBtn.classList.remove("active");
          if (this.playlistLikeAlbumLabel) this.playlistLikeAlbumLabel.textContent = this.currentLanguage === "id" ? "Simpan Album" : "Like Album";
        }
      }
      this.renderUserPlaylists();
    }
  }

  openLikedSongsView() {
    const isId = (this.currentLanguage === "id");
    const likedTracks = JSON.parse(localStorage.getItem("sorafy_liked_tracks") || "[]");
    const likedPlaylist = {
      id: "special_liked_songs",
      is_special: "liked",
      title: isId ? "Lagu Disukai" : "Liked Songs",
      description: isId ? "Koleksi semua lagu favorit yang Anda sukai di SoraFy." : "Collection of all tracks you liked on SoraFy.",
      artwork_url: LIKED_COVER_SVG,
      tracks: likedTracks
    };
    this.openPlaylistDetail(likedPlaylist);
  }

  openDownloadedSongsView() {
    const isId = (this.currentLanguage === "id");
    const dlTracks = Array.isArray(this.downloadedTracks) ? this.downloadedTracks : [];
    const dlPlaylist = {
      id: "special_downloaded_songs",
      is_special: "downloads",
      title: isId ? "Lagu Terunduh" : "Downloaded Songs",
      description: isId ? "Koleksi musik offline yang tersimpan di perangkat lokal Anda." : "Collection of offline tracks saved on your local device.",
      artwork_url: DOWNLOADS_COVER_SVG,
      tracks: dlTracks
    };
    this.openPlaylistDetail(dlPlaylist);
  }

  renderUserPlaylists() {
    if (!this.userPlaylistsNav) return;
    this.userPlaylistsNav.innerHTML = "";

    const isId = (this.currentLanguage === "id");
    const activeFilter = this.sidebarLibraryFilter || "all";
    const likedTracks = JSON.parse(localStorage.getItem("sorafy_liked_tracks") || "[]");
    const likedCount = likedTracks.length;
    const userPlaylists = (this.userPlaylists || []).filter(pl => pl && pl.id && pl.id !== "upl_favorites" && pl.title !== "Lagu Santai Saya");
    const followedArtists = Array.isArray(this.followedArtists) ? this.followedArtists : Array.from(this.followedArtists || []);
    const likedAlbums = Array.isArray(this.likedAlbums) ? this.likedAlbums : [];

    const allItems = [];

    // 1. Liked Songs
    if (activeFilter === "all" || activeFilter === "playlists") {
      const isLikedActive = (this.currentView === "playlist" && this.currentPlaylist && this.currentPlaylist.is_special === "liked");
      allItems.push({
        key: "liked",
        type: "liked",
        title: isId ? "Lagu Disukai" : "Liked Songs",
        subtitle: `Playlist • ${likedCount} ${isId ? "lagu" : "songs"}`,
        isActive: isLikedActive,
        artMarkup: `<div class="lib-sidebar-art-wrap liked-songs"><iconsax-icon name="heart" type="bold" size="20" color="#FFFFFF"></iconsax-icon></div>`,
        onOpen: () => this.openLikedSongsView(),
        onPlay: () => {
          this.openLikedSongsView();
          if (likedTracks.length) {
            this.tracks = [...likedTracks];
            this.loadTrack(0, true);
          }
        }
      });
    }

    // 2. Downloaded Songs
    if (activeFilter === "all" || activeFilter === "playlists") {
      const isDownloadedActive = (this.currentView === "playlist" && this.currentPlaylist && this.currentPlaylist.is_special === "downloads");
      const dlCount = (this.downloadedTracks && this.downloadedTracks.length) || 0;
      allItems.push({
        key: "downloads",
        type: "downloads",
        title: isId ? "Lagu Terunduh" : "Downloaded Songs",
        subtitle: `Playlist • ${dlCount} ${isId ? "lagu" : "songs"}`,
        isActive: isDownloadedActive,
        artMarkup: `<div class="lib-sidebar-art-wrap downloaded-songs"><iconsax-icon name="folder-cloud" type="bold" size="20" color="#FFFFFF"></iconsax-icon></div>`,
        onOpen: () => this.openDownloadedSongsView(),
        onPlay: () => {
          this.openDownloadedSongsView();
          if (this.downloadedTracks && this.downloadedTracks.length) {
            this.tracks = [...this.downloadedTracks];
            this.loadTrack(0, true);
          }
        }
      });
    }

    // 3. User Playlists (Created & Imported)
    if (activeFilter === "all" || activeFilter === "playlists") {
      userPlaylists.forEach(pl => {
        const isPlActive = (this.currentView === "playlist" && this.currentPlaylist && this.currentPlaylist.id === pl.id);
        const artUrl = pl.artwork_url || (pl.tracks && pl.tracks[0]?.artwork_url) || "";
        const author = pl.author || (pl.source ? (pl.source.charAt(0).toUpperCase() + pl.source.slice(1)) : "SoraFy");
        const artMarkup = artUrl
          ? `<div class="lib-sidebar-art-wrap"><img src="${artUrl}" alt="${this.escapeHtml(pl.title || 'Playlist')}" class="lib-sidebar-art-img" onerror="this.onerror=null; this.parentElement.innerHTML='<iconsax-icon name=\\'music-playlist\\' type=\\'bold\\' size=\\'20\\' color=\\'#949ba4\\'></iconsax-icon>';"></div>`
          : `<div class="lib-sidebar-art-wrap"><iconsax-icon name="music-playlist" type="bold" size="20" color="#949ba4"></iconsax-icon></div>`;

        allItems.push({
          key: `playlist:${pl.id}`,
          type: "playlist",
          title: pl.title || pl.name || "Playlist",
          subtitle: `Playlist • ${author}`,
          isActive: isPlActive,
          artMarkup,
          data: pl,
          onOpen: () => this.openPlaylistDetail(pl),
          onPlay: () => {
            this.openPlaylistDetail(pl).then(() => {
              if (pl.tracks && pl.tracks.length) {
                this.tracks = [...pl.tracks];
                this.loadTrack(0, true);
              }
            });
          },
          onQueue: () => {
            if (pl.tracks && pl.tracks.length) {
              this.queue.push(...pl.tracks);
              this.renderQueue();
              this.showToast(isId ? `${pl.tracks.length} lagu ditambahkan ke antrean` : `Added ${pl.tracks.length} tracks to queue`);
            }
          }
        });
      });
    }

    // 4. Followed Artists
    if (activeFilter === "all" || activeFilter === "artists") {
      followedArtists.forEach(artKey => {
        const details = (this.followedArtistDetails && this.followedArtistDetails[artKey]) || {};
        const artName = details.name || artKey;
        const avatarUrl = details.avatar_url || getArtistAvatar(artName);
        const browseId = details.browse_id || "";
        const isCurrentArtist = (this.currentView === "artist" && (
          (this.currentArtist && this.currentArtist.name && this.currentArtist.name.toLowerCase() === artName.toLowerCase()) ||
          (this.currentArtistName && this.currentArtistName.toLowerCase() === artName.toLowerCase())
        ));
        const artMarkup = avatarUrl
          ? `<div class="lib-sidebar-art-wrap artist"><img src="${avatarUrl}" alt="${this.escapeHtml(artName)}" class="lib-sidebar-art-img circle" onerror="this.onerror=null; this.parentElement.innerHTML='<iconsax-icon name=\\'user\\' type=\\'bold\\' size=\\'20\\' color=\\'#949ba4\\'></iconsax-icon>';"></div>`
          : `<div class="lib-sidebar-art-wrap artist"><iconsax-icon name="user" type="bold" size="20" color="#949ba4"></iconsax-icon></div>`;

        allItems.push({
          key: `artist:${artName}`,
          type: "artist",
          title: artName,
          subtitle: isId ? "Artis" : "Artist",
          isActive: isCurrentArtist,
          artMarkup,
          data: { name: artName, browseId },
          onOpen: () => this.openArtistDetail(artName, browseId),
          onPlay: async () => {
            await this.openArtistDetail(artName, browseId);
            if (this.tracks && this.tracks.length) {
              this.loadTrack(0, true);
            }
          }
        });
      });
    }

    // 5. Liked Albums
    if (activeFilter === "all" || activeFilter === "albums") {
      likedAlbums.forEach(album => {
        const isAlbumActive = (this.currentView === "playlist" && this.currentPlaylist && (this.currentPlaylist.id === album.id || this.currentPlaylist.title === album.title));
        const artUrl = album.artwork_url || this.DEFAULT_TRACK_ART;
        const artMarkup = `<div class="lib-sidebar-art-wrap"><img src="${artUrl}" alt="${this.escapeHtml(album.title)}" class="lib-sidebar-art-img" onerror="this.src='${this.DEFAULT_TRACK_ART}'"></div>`;

        allItems.push({
          key: `album:${album.id}`,
          type: "album",
          title: album.title,
          subtitle: `Album • ${album.artist || 'Unknown'}`,
          isActive: isAlbumActive,
          artMarkup,
          data: album,
          onOpen: () => this.openAlbumDetail(album),
          onPlay: async () => {
            await this.openAlbumDetail(album);
            if (this.currentPlaylist && this.currentPlaylist.tracks && this.currentPlaylist.tracks.length) {
              this.tracks = [...this.currentPlaylist.tracks];
              this.loadTrack(0, true);
            }
          },
          onQueue: async () => {
            if (album.tracks && album.tracks.length) {
              this.queue.push(...album.tracks);
              this.renderQueue();
              this.showToast(isId ? `Album ditambahkan ke antrean` : `Album added to queue`);
            } else {
              await this.openAlbumDetail(album);
              if (this.currentPlaylist && this.currentPlaylist.tracks) {
                this.queue.push(...this.currentPlaylist.tracks);
                this.renderQueue();
                this.showToast(isId ? `Album ditambahkan ke antrean` : `Album added to queue`);
              }
            }
          }
        });
      });
    }

    // Sort: Pinned items float to the top!
    const pinnedItems = allItems.filter(item => this.isItemPinned(item.key));
    const unpinnedItems = allItems.filter(item => !this.isItemPinned(item.key));
    const sortedItems = [...pinnedItems, ...unpinnedItems];

    let totalItemsRendered = 0;

    sortedItems.forEach(item => {
      const isPinned = this.isItemPinned(item.key);
      const div = document.createElement("div");
      div.className = `lib-sidebar-item playlist-nav-item ${item.isActive ? "active" : ""}`;
      div.dataset.type = item.type;
      div.dataset.key = item.key;
      if (item.type === "playlist" && item.data) div.dataset.playlistId = item.data.id;
      if (item.type === "artist" && item.data) div.dataset.artistName = item.data.name;
      if (item.type === "album" && item.data) div.dataset.albumId = item.data.id;

      const pinIcon = isPinned ? `<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="lib-pin-icon" style="color: var(--color-brand-primary, #23a55a); transform: rotate(45deg); flex-shrink: 0;"><path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/></svg>` : ``;

      div.innerHTML = `
        ${item.artMarkup}
        <div class="lib-sidebar-info">
          <div class="lib-item-title" title="${this.escapeHtml(item.title)}">${this.escapeHtml(item.title)}</div>
          <div class="lib-item-meta" title="${this.escapeHtml(item.subtitle)}">
            ${pinIcon}
            <span>${this.escapeHtml(item.subtitle)}</span>
          </div>
        </div>
        <button class="playlist-more-dots-btn" title="Opsi ${this.escapeHtml(item.title)}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="19" r="2"></circle></svg>
        </button>
      `;

      const moreBtn = div.querySelector(".playlist-more-dots-btn");
      if (moreBtn) {
        moreBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.showLibraryContextMenu(e, item);
        });
      }

      div.addEventListener("click", () => {
        item.onOpen();
        this.renderUserPlaylists();
      });

      div.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.showLibraryContextMenu(e, item);
      });

      this.userPlaylistsNav.appendChild(div);
      totalItemsRendered++;
    });

    // Empty state if nothing in this filter
    if (totalItemsRendered === 0) {
      const emptyMsg = activeFilter === "artists"
        ? (isId ? "Belum ada artis yang diikuti" : "No followed artists yet")
        : (activeFilter === "albums"
          ? (isId ? "Belum ada album tersimpan" : "No saved albums yet")
          : (activeFilter === "playlists"
            ? (isId ? "Belum ada playlist" : "No playlists yet")
            : (isId ? "Koleksi Anda masih kosong" : "Your library is empty")));

      this.userPlaylistsNav.innerHTML = `
        <div style="padding: 16px 12px; font-size: 12px; color: var(--color-text-tertiary); text-align: center;">
          ${emptyMsg}
        </div>
      `;
    }
  }

  showLibraryContextMenu(e, item) {
    if (this.playlistContextMenu) {
      this.playlistContextMenu.remove();
      this.playlistContextMenu = null;
    }

    const isId = (this.currentLanguage === "id");
    const isPinned = this.isItemPinned(item.key);
    const pinLabel = isPinned
      ? (isId ? "Lepas Sematan dari Atas" : "Unpin from top")
      : (isId ? "Sematkan ke Atas" : "Pin to top");
    const pinIconSvg = isPinned
      ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/><line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" stroke-width="2"/></svg>`
      : `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="transform: rotate(45deg);"><path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/></svg>`;

    const menu = document.createElement("div");
    menu.className = "context-menu";
    menu.id = "playlistContextMenu";

    let menuHtml = "";

    if (item.type === "liked") {
      menuHtml = `
        <div class="context-menu-item" id="ctx_lib_open">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <span>${isId ? "Buka Lagu Disukai" : "Open Liked Songs"}</span>
        </div>
        <div class="context-menu-item" id="ctx_lib_play">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>${isId ? "Putar Semua" : "Play All"}</span>
        </div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item" id="ctx_lib_pin">
          ${pinIconSvg}
          <span>${pinLabel}</span>
        </div>
      `;
    } else if (item.type === "downloads") {
      menuHtml = `
        <div class="context-menu-item" id="ctx_lib_open">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
          <span>${isId ? "Buka Lagu Terunduh" : "Open Downloaded Songs"}</span>
        </div>
        <div class="context-menu-item" id="ctx_lib_play">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>${isId ? "Putar Semua" : "Play All"}</span>
        </div>
        <div class="context-menu-item" id="ctx_lib_open_folder">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          <span>${isId ? "Buka Folder di File Manager" : "Open in File Manager"}</span>
        </div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item" id="ctx_lib_pin">
          ${pinIconSvg}
          <span>${pinLabel}</span>
        </div>
      `;
    } else if (item.type === "playlist") {
      const pl = item.data;
      menuHtml = `
        <div class="context-menu-item" id="ctx_lib_open">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>${isId ? "Buka Playlist" : "Open Playlist"}</span>
        </div>
        <div class="context-menu-item" id="ctx_lib_play">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>${isId ? "Putar Playlist" : "Play Playlist"}</span>
        </div>
        <div class="context-menu-item" id="ctx_lib_queue">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          <span>${isId ? "Tambahkan ke Antrean" : "Add to Queue"}</span>
        </div>
        <div class="context-menu-item" id="ctx_lib_pin">
          ${pinIconSvg}
          <span>${pinLabel}</span>
        </div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item" id="ctx_lib_edit">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
          <span>${isId ? "Edit Detail" : "Edit Details"}</span>
        </div>
        <div class="context-menu-item" id="ctx_lib_delete" style="color: #EF4444;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          <span>${isId ? "Hapus Playlist" : "Delete Playlist"}</span>
        </div>
      `;
    } else if (item.type === "artist") {
      menuHtml = `
        <div class="context-menu-item" id="ctx_lib_open">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          <span>${isId ? "Buka Profil Artis" : "Open Artist Profile"}</span>
        </div>
        <div class="context-menu-item" id="ctx_lib_play">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>${isId ? "Putar Artis Ini" : "Play Artist"}</span>
        </div>
        <div class="context-menu-item" id="ctx_lib_pin">
          ${pinIconSvg}
          <span>${pinLabel}</span>
        </div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item" id="ctx_lib_unfollow" style="color: #EF4444;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line></svg>
          <span>${isId ? "Berhenti Mengikuti" : "Unfollow Artist"}</span>
        </div>
      `;
    } else if (item.type === "album") {
      menuHtml = `
        <div class="context-menu-item" id="ctx_lib_open">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>
          <span>${isId ? "Buka Album" : "Open Album"}</span>
        </div>
        <div class="context-menu-item" id="ctx_lib_play">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>${isId ? "Putar Album" : "Play Album"}</span>
        </div>
        <div class="context-menu-item" id="ctx_lib_queue">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          <span>${isId ? "Tambahkan ke Antrean" : "Add to Queue"}</span>
        </div>
        <div class="context-menu-item" id="ctx_lib_pin">
          ${pinIconSvg}
          <span>${pinLabel}</span>
        </div>
        <div class="context-menu-divider"></div>
        <div class="context-menu-item" id="ctx_lib_remove_album" style="color: #EF4444;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          <span>${isId ? "Hapus dari Library" : "Remove from Library"}</span>
        </div>
      `;
    }

    menu.innerHTML = menuHtml;

    // Positioning
    const posX = Math.min(e.clientX, window.innerWidth - 240);
    const posY = Math.min(e.clientY, window.innerHeight - 260);
    menu.style.top = `${posY}px`;
    menu.style.left = `${posX}px`;
    menu.style.display = "block";

    document.body.appendChild(menu);
    this.playlistContextMenu = menu;

    // Actions binding
    menu.querySelector("#ctx_lib_open")?.addEventListener("click", () => {
      item.onOpen();
      menu.remove();
    });

    menu.querySelector("#ctx_lib_play")?.addEventListener("click", () => {
      if (item.onPlay) {
        item.onPlay();
      } else {
        item.onOpen();
      }
      menu.remove();
    });

    menu.querySelector("#ctx_lib_queue")?.addEventListener("click", () => {
      if (item.onQueue) item.onQueue();
      menu.remove();
    });

    menu.querySelector("#ctx_lib_open_folder")?.addEventListener("click", () => {
      if (window.electronAPI && typeof window.electronAPI.openDownloadFolder === 'function') {
        window.electronAPI.openDownloadFolder();
      }
      menu.remove();
    });

    menu.querySelector("#ctx_lib_pin")?.addEventListener("click", () => {
      this.togglePin(item.key, item.title);
      menu.remove();
    });

    menu.querySelector("#ctx_lib_edit")?.addEventListener("click", () => {
      if (item.type === "playlist") this.openEditPlaylistModal(item.data);
      menu.remove();
    });

    menu.querySelector("#ctx_lib_delete")?.addEventListener("click", () => {
      if (confirm(isId ? `Hapus playlist "${item.title}"?` : `Delete playlist "${item.title}"?`)) {
        this.deletePlaylist(item.data.id);
      }
      menu.remove();
    });

    menu.querySelector("#ctx_lib_unfollow")?.addEventListener("click", () => {
      this.unfollowArtist(item.data.name);
      menu.remove();
    });

    menu.querySelector("#ctx_lib_remove_album")?.addEventListener("click", () => {
      this.removeSavedAlbum(item.data.id, item.data.title);
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

  showPlaylistContextMenu(e, pl) {
    if (!pl) return;
    this.showLibraryContextMenu(e, {
      key: `playlist:${pl.id}`,
      type: "playlist",
      title: pl.title || pl.name || "Playlist",
      data: pl,
      onOpen: () => this.openPlaylistDetail(pl),
      onPlay: () => {
        this.openPlaylistDetail(pl).then(() => {
          if (pl.tracks && pl.tracks.length) {
            this.tracks = [...pl.tracks];
            this.loadTrack(0, true);
          }
        });
      },
      onQueue: () => {
        if (pl.tracks && pl.tracks.length) {
          this.queue.push(...pl.tracks);
          this.renderQueue();
          this.showToast(this.currentLanguage === "id" ? `${pl.tracks.length} lagu ditambahkan ke antrean` : `Added ${pl.tracks.length} tracks to queue`);
        }
      }
    });
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
    this.editingPlaylistCoverUrl = target.artwork_url || (target.tracks && target.tracks[0]?.artwork_url) || "";
    const hasCustomCover = target.custom_artwork || (target.artwork_url && (!target.tracks || !target.tracks.length || target.artwork_url !== target.tracks[0]?.artwork_url));

    if (this.editPlaylistModal) {
      if (this.editPlaylistNameInput) this.editPlaylistNameInput.value = target.title || "";
      if (this.editPlaylistDescInput) this.editPlaylistDescInput.value = target.description || "";
      if (this.editPlaylistCoverPreview) {
        this.editPlaylistCoverPreview.src = this.editingPlaylistCoverUrl || this.DEFAULT_TRACK_ART;
      }
      if (this.editPlaylistRemoveCoverBtn) {
        this.editPlaylistRemoveCoverBtn.style.display = hasCustomCover ? "inline-flex" : "none";
      }
      if (this.editPlaylistUrlRow) {
        this.editPlaylistUrlRow.style.display = "none";
      }
      if (this.editPlaylistUrlInput) {
        this.editPlaylistUrlInput.value = "";
      }
      if (this.editPlaylistCoverFileInput) {
        this.editPlaylistCoverFileInput.value = "";
      }
      this.editPlaylistModal.style.display = "flex";
      setTimeout(() => this.editPlaylistNameInput?.focus(), 50);
    }
  }

  updatePlaylist(playlistId, newTitle, newDesc, newArtworkUrl = undefined) {
    if (!playlistId) return;
    const pl = this.userPlaylists.find(p => p.id === playlistId);
    if (!pl) return;
    pl.title = newTitle;
    pl.description = newDesc;
    if (newArtworkUrl !== undefined) {
      if (newArtworkUrl === null) {
        pl.custom_artwork = false;
        pl.artwork_url = (pl.tracks && pl.tracks[0]?.artwork_url) || "";
      } else if (newArtworkUrl) {
        pl.artwork_url = newArtworkUrl;
        pl.custom_artwork = true;
      }
    }
    this.saveUserPlaylists();
    this.renderUserPlaylists();
    if (this.currentPlaylist && this.currentPlaylist.id === playlistId) {
      this.currentPlaylist.title = newTitle;
      this.currentPlaylist.description = newDesc;
      if (newArtworkUrl !== undefined) {
        this.currentPlaylist.artwork_url = pl.artwork_url;
        this.currentPlaylist.custom_artwork = pl.custom_artwork;
        if (this.playlistCoverImg) {
          this.playlistCoverImg.src = pl.artwork_url || this.DEFAULT_TRACK_ART;
        }
      }
      if (this.playlistTitleHeading) this.playlistTitleHeading.textContent = newTitle;
      if (this.playlistDescText) this.playlistDescText.textContent = newDesc || "Curated playlist.";
    }
    this.showToast(this.currentLanguage === "id" ? `Playlist "${newTitle}" berhasil diperbarui!` : `Playlist "${newTitle}" updated successfully!`);
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
    if (this.playlistDownloadAllBtn) this.playlistDownloadAllBtn.style.display = "inline-flex";

    const typeBadge = document.getElementById("playlistTypeBadge");
    if (typeBadge) typeBadge.textContent = this.currentLanguage === "id" ? "Album Resmi" : "Official Album";

    this.playlistTitleHeading.textContent = album.title;
    this.playlistDescText.textContent = album.year
      ? (this.currentLanguage === 'id' ? `Album resmi oleh ${album.artist || 'Artis'} (${album.year})` : `Official album by ${album.artist || 'Artist'} (${album.year})`)
      : (this.currentLanguage === 'id' ? `Album resmi oleh ${album.artist || 'Artis'}` : `Official album by ${album.artist || 'Artist'}`);
    this.playlistCoverImg.src = album.artwork_url || this.DEFAULT_TRACK_ART;
    this.playlistStatsText.textContent = this.currentLanguage === 'id' ? "Memuat daftar lagu album..." : "Loading album tracks...";
    this.playlistTrackList.innerHTML = `<div style="text-align: center; padding: 32px; color: var(--color-text-secondary); font-size: 13px;">${this.currentLanguage === 'id' ? "Mengambil daftar lagu resmi..." : "Fetching official tracklist..."}</div>`;

    let tracks = [];
    if (album.tracks && album.tracks.length > 0) {
      tracks = album.tracks;
    } else if (album.browse_id && window.electronAPI && typeof window.electronAPI.browseYouTube === 'function') {
      try {
        const res = await window.electronAPI.browseYouTube(album.browse_id);
        if (res && res.tracks && res.tracks.length) {
          tracks = res.tracks.map((t, idx) => ({
            ...t,
            album: album.title,
            artwork_url: t.artwork_url || album.artwork_url,
            is_liked: this.likedTrackIds.has(t.id)
          }));
          if (res.avatar_url && !album.artwork_url) this.playlistCoverImg.src = res.avatar_url;
          if (res.description && !album.description) this.playlistDescText.textContent = res.description;
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
    this.playlistStatsText.textContent = this.currentLanguage === 'id' ? `${tracks.length} Lagu` : `${tracks.length} Songs`;
    this.renderPlaylistTracks(tracks, null);
  }

  async openPlaylistDetail(playlist) {
    if (!playlist) return;
    this.currentPlaylist = playlist;
    this.switchView("playlist");

    if (this.userPlaylistsNav) {
      const plItems = this.userPlaylistsNav.querySelectorAll(".playlist-nav-item");
      plItems.forEach(el => {
        if (playlist.is_special === "liked") {
          el.classList.toggle("active", el.dataset.type === "liked");
        } else if (playlist.is_special === "downloads") {
          el.classList.toggle("active", el.dataset.type === "downloads");
        } else {
          el.classList.toggle("active", el.dataset.playlistId === playlist.id || el.dataset.key === `playlist:${playlist.id}`);
        }
      });
    }

    const typeBadge = document.getElementById("playlistTypeBadge");
    if (typeBadge) typeBadge.textContent = "PLAYLIST";

    const isUserPl = !playlist.is_special && this.userPlaylists.some(p => p.id === playlist.id);
    if (this.playlistDeleteBtn) this.playlistDeleteBtn.style.display = isUserPl ? "inline-flex" : "none";
    if (this.playlistEditBtn) this.playlistEditBtn.style.display = isUserPl ? "inline-flex" : "none";
    if (this.playlistLikeAlbumBtn) this.playlistLikeAlbumBtn.style.display = "none";
    if (this.playlistOpenFolderBtn) this.playlistOpenFolderBtn.style.display = (playlist.is_special === "downloads") ? "inline-flex" : "none";
    if (this.playlistDownloadAllBtn) this.playlistDownloadAllBtn.style.display = (playlist.is_special === "downloads") ? "none" : "inline-flex";

    if (this.playlistCoverWrapper) {
      this.playlistCoverWrapper.classList.toggle("editable", isUserPl);
      if (this.playlistCoverEditOverlay) {
        this.playlistCoverEditOverlay.style.display = isUserPl ? "flex" : "none";
      }
    }

    this.playlistTitleHeading.textContent = playlist.title;
    this.playlistDescText.textContent = playlist.description || (playlist.author ? `Curated collection: ${playlist.author}` : "Curated playlist.");
    this.playlistCoverImg.src = playlist.artwork_url || (playlist.tracks?.[0]?.artwork_url) || this.DEFAULT_TRACK_ART;

    let tracks = playlist.tracks || [];

    // Only query YouTube if this is an external / online curated playlist, NOT a user custom playlist or special playlist
    if (!isUserPl && !playlist.is_special && playlist.browse_id && window.electronAPI && typeof window.electronAPI.browseYouTube === 'function') {
      this.playlistTrackList.innerHTML = `<div style="text-align: center; padding: 32px; color: var(--color-text-secondary); font-size: 13px;">Loading playlist tracks...</div>`;
      try {
        const res = await window.electronAPI.browseYouTube(playlist.browse_id);
        if (res && res.tracks && res.tracks.length) {
          tracks = res.tracks.map(t => ({
            ...t,
            is_liked: this.likedTrackIds.has(t.id)
          }));
          if (res.avatar_url && !playlist.artwork_url) this.playlistCoverImg.src = res.avatar_url;
          if (res.description && !playlist.description) this.playlistDescText.textContent = res.description;
        }
      } catch (_) {}
    }

    if (!isUserPl && !playlist.is_special && !tracks.length && playlist.title) {
      try {
        const searchTracks = await this.queryInnerTubeSongs(`${playlist.title} hits`);
        if (searchTracks && searchTracks.length) tracks = searchTracks;
      } catch (_) {}
    }

    playlist.tracks = tracks;
    this.playlistStatsText.textContent = `${tracks.length} ${this.currentLanguage === 'id' ? 'Lagu' : 'Songs'}`;
    this.renderPlaylistTracks(tracks, isUserPl ? playlist.id : null);
  }

  renderPlaylistTracks(tracks, userPlaylistId = null) {
    if (!this.playlistTrackList) return;
    this.playlistTrackList.innerHTML = "";

    if (!tracks || tracks.length === 0) {
      const isId = (this.currentLanguage === "id");
      let emptyMsg = this.t("no_tracks", "No tracks in this playlist yet.");
      if (this.currentPlaylist?.is_special === "liked") {
        emptyMsg = isId
          ? "Lagu yang Anda sukai akan muncul di sini. Klik ikon hati pada lagu apa saja untuk menyimpannya."
          : "Songs you like will appear here. Click the heart icon on any track to save it.";
      } else if (this.currentPlaylist?.is_special === "downloads") {
        emptyMsg = isId
          ? "Belum ada lagu yang diunduh. Klik tombol download pada lagu untuk mendengarkannya secara offline."
          : "No downloaded songs yet. Click the download button on any track to listen offline.";
      }
      this.playlistTrackList.innerHTML = `
        <div style="text-align: center; padding: 48px 0; color: var(--color-text-secondary); font-size: 13px; line-height: 1.6;">
          ${emptyMsg}
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
            title: this.formatTrackTitle(item.title),
            artwork_url: this.formatCoverArt(item.artwork_url),
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
  // Search Suggestions & Recent Search History Engine
  // =========================================================
  getRecentSearches() {
    try {
      const data = localStorage.getItem("sorafy_recent_searches");
      if (!data) return [];
      const list = JSON.parse(data);
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  saveRecentSearch(query) {
    if (!query || typeof query !== "string") return;
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("spotify:")) return;
    try {
      let list = this.getRecentSearches();
      list = list.filter(item => typeof item === "string" && item.toLowerCase() !== trimmed.toLowerCase());
      list.unshift(trimmed);
      if (list.length > 8) list = list.slice(0, 8);
      localStorage.setItem("sorafy_recent_searches", JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to save recent search:", e);
    }
  }

  deleteRecentSearch(query) {
    try {
      let list = this.getRecentSearches();
      list = list.filter(item => typeof item === "string" && item.toLowerCase() !== query.toLowerCase());
      localStorage.setItem("sorafy_recent_searches", JSON.stringify(list));
      this.renderRecentSearches();
    } catch (e) {
      console.warn("Failed to delete recent search:", e);
    }
  }

  clearAllRecentSearches() {
    try {
      localStorage.removeItem("sorafy_recent_searches");
      this.hideSearchSuggestions();
    } catch (e) {
      console.warn("Failed to clear recent searches:", e);
    }
  }

  showSearchSuggestions() {
    if (this.searchSuggestionsDropdown) {
      this.searchSuggestionsDropdown.style.display = "flex";
    }
  }

  hideSearchSuggestions() {
    if (this.searchSuggestionsDropdown) {
      this.searchSuggestionsDropdown.style.display = "none";
    }
    this.activeSuggestionIndex = -1;
  }

  renderRecentSearches() {
    const list = this.getRecentSearches();
    if (!list || list.length === 0) {
      this.hideSearchSuggestions();
      return;
    }

    if (this.searchSuggestionsHeaderTitle) {
      this.searchSuggestionsHeaderTitle.textContent = this.currentLanguage === "id" ? "Pencarian Terbaru" : "Recent Searches";
    }
    if (this.clearRecentSearchesBtn) {
      this.clearRecentSearchesBtn.textContent = this.currentLanguage === "id" ? "Hapus Semua" : "Clear All";
      this.clearRecentSearchesBtn.style.display = "inline-block";
    }

    this.currentSuggestions = list.map(text => ({ type: "recent", text }));
    this.activeSuggestionIndex = -1;

    if (!this.searchSuggestionsList) return;
    this.searchSuggestionsList.innerHTML = "";

    this.currentSuggestions.forEach((item, idx) => {
      const el = document.createElement("div");
      el.className = "suggestion-item";
      el.dataset.index = idx;
      el.innerHTML = `
        <div class="suggestion-item-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div class="suggestion-item-text">
          <div class="suggestion-item-title">${escapeHtml(item.text)}</div>
        </div>
        <button class="suggestion-delete-btn" title="Hapus" data-query="${escapeHtml(item.text)}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;

      el.addEventListener("click", (e) => {
        if (e.target.closest(".suggestion-delete-btn")) {
          e.stopPropagation();
          this.deleteRecentSearch(item.text);
          return;
        }
        this.selectSuggestion(item);
      });

      this.searchSuggestionsList.appendChild(el);
    });

    this.showSearchSuggestions();
  }

  renderOnlineSuggestions(query, suggestions) {
    if (!suggestions || suggestions.length === 0) {
      this.hideSearchSuggestions();
      return;
    }

    if (this.searchSuggestionsHeaderTitle) {
      this.searchSuggestionsHeaderTitle.textContent = this.currentLanguage === "id" ? "Saran Pencarian" : "Search Suggestions";
    }
    if (this.clearRecentSearchesBtn) {
      this.clearRecentSearchesBtn.style.display = "none";
    }

    this.currentSuggestions = suggestions;
    this.activeSuggestionIndex = -1;

    if (!this.searchSuggestionsList) return;
    this.searchSuggestionsList.innerHTML = "";

    const cleanQ = query.trim().toLowerCase();

    suggestions.forEach((item, idx) => {
      const el = document.createElement("div");
      el.className = "suggestion-item";
      el.dataset.index = idx;

      if (item.type === "entity") {
        const isArtist = item.subtitle && (item.subtitle.toLowerCase().includes("artist") || item.subtitle.toLowerCase().includes("artis"));
        el.innerHTML = `
          ${item.thumbnail ? `<img class="suggestion-item-thumb ${isArtist ? 'artist' : ''}" src="${escapeHtml(item.thumbnail)}" alt="" onerror="this.style.display='none'">` : `
            <div class="suggestion-item-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          `}
          <div class="suggestion-item-text">
            <div class="suggestion-item-title">${this.highlightSuggestion(item.title, cleanQ)}</div>
            ${item.subtitle ? `<div class="suggestion-item-subtitle">${escapeHtml(item.subtitle)}</div>` : ''}
          </div>
          <div class="suggestion-item-action" title="Lanjutkan pencarian">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </div>
        `;
      } else {
        el.innerHTML = `
          <div class="suggestion-item-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <div class="suggestion-item-text">
            <div class="suggestion-item-title">${this.highlightSuggestion(item.text, cleanQ)}</div>
          </div>
          <div class="suggestion-item-action" title="Lanjutkan pencarian">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </div>
        `;
      }

      el.addEventListener("click", (e) => {
        if (e.target.closest(".suggestion-item-action")) {
          e.stopPropagation();
          const qText = item.type === "entity" ? item.title : item.text;
          if (this.searchInput) {
            this.searchInput.value = qText;
            this.originalSearchQuery = qText;
            this.searchInput.focus();
            if (this.searchClearBtn) this.searchClearBtn.style.display = "inline-flex";
            this.fetchAndRenderSuggestions(qText);
          }
          return;
        }
        this.selectSuggestion(item);
      });

      this.searchSuggestionsList.appendChild(el);
    });

    this.showSearchSuggestions();
  }

  highlightSuggestion(text, query) {
    if (!text) return "";
    if (!query) return escapeHtml(text);
    const escapedText = escapeHtml(text);
    const escapedQuery = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return escapedText.replace(regex, '<b>$1</b>');
  }

  async fetchAndRenderSuggestions(query) {
    if (!query || !query.trim()) {
      this.renderRecentSearches();
      return;
    }
    const cleanQ = query.trim();
    if (window.electronAPI && typeof window.electronAPI.getSearchSuggestions === "function") {
      try {
        const results = await window.electronAPI.getSearchSuggestions(cleanQ);
        if (this.searchInput && this.searchInput.value.trim() === cleanQ) {
          this.renderOnlineSuggestions(cleanQ, results);
        }
      } catch (err) {
        console.warn("fetchAndRenderSuggestions error:", err);
      }
    }
  }

  selectSuggestion(item) {
    if (!item) return;
    const query = item.type === "entity" ? item.title : item.text;
    if (this.searchInput) {
      this.searchInput.value = query;
      this.originalSearchQuery = query;
      if (this.searchClearBtn) this.searchClearBtn.style.display = "inline-flex";
    }
    this.saveRecentSearch(query);
    this.hideSearchSuggestions();

    if (item.type === "entity") {
      const isArtist = item.subtitle && (item.subtitle.toLowerCase().includes("artist") || item.subtitle.toLowerCase().includes("artis"));
      if (isArtist) {
        this.openArtistDetail(item.title);
        return;
      }
    }
    this.searchOnlineMusic(query, this.currentSearchFilter);
  }

  navigateSuggestions(direction) {
    if (!this.searchSuggestionsDropdown || this.searchSuggestionsDropdown.style.display === "none") return;
    const items = this.searchSuggestionsList ? this.searchSuggestionsList.querySelectorAll(".suggestion-item") : [];
    if (!items.length) return;

    if (direction > 0) {
      this.activeSuggestionIndex = (this.activeSuggestionIndex + 1) % items.length;
    } else {
      this.activeSuggestionIndex = this.activeSuggestionIndex <= 0 ? items.length - 1 : this.activeSuggestionIndex - 1;
    }

    items.forEach((it, idx) => {
      const isActive = idx === this.activeSuggestionIndex;
      it.classList.toggle("active", isActive);
      if (isActive) {
        it.scrollIntoView({ block: "nearest" });
        const selected = this.currentSuggestions[idx];
        if (selected && this.searchInput) {
          const val = selected.type === "entity" ? selected.title : selected.text;
          this.searchInput.value = val;
          if (this.searchClearBtn) this.searchClearBtn.style.display = "inline-flex";
        }
      }
    });
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

        let artists = (rawArtists || []).filter(a => {
          if (!a) return false;
          const sub = (a.sub_label || '').toLowerCase();
          if (sub.includes('saluran') && !sub.includes('saluran artis')) return false;
          if (sub.includes('channel') && !sub.includes('artist')) return false;
          return true;
        });

        const cleanQ = query.trim().toLowerCase();

        // 1. Detect if the user is searching for a SONG title:
        const matchingSong = (songs || []).find(s => {
          if (!s || !s.title) return false;
          const st = s.title.trim().toLowerCase();
          return st === cleanQ || st.startsWith(cleanQ) || cleanQ.startsWith(st);
        });

        // 2. If a matching song exists and the song's real artist is different from the query,
        // strictly filter out any "artist" profile whose name matches the song title / query
        // (eliminates obscure YouTube channels named after popular songs)
        if (matchingSong) {
          const songArtist = (matchingSong.artist || '').trim().toLowerCase();
          if (songArtist && !songArtist.includes(cleanQ)) {
            artists = artists.filter(a => {
              const an = (a.name || a.title || '').trim().toLowerCase();
              return an !== cleanQ && !cleanQ.startsWith(an);
            });
          }
        }

        let total = 0;

        // 3. Render Top Result:
        // - If matchingSong is found (user searched for a song), always prioritize the song!
        // - If no matching song, but a genuine artist matches cleanQ (e.g. "Sal Priadi"), prioritize Artist!
        // - Otherwise fallback to songs[0] -> videos[0] -> artists[0]
        let topItem = null;
        let topType = 'song';

        if (matchingSong) {
          topItem = matchingSong;
          topType = 'song';
        } else {
          const matchedArtist = artists.find(a => {
            const an = (a.name || a.title || '').trim().toLowerCase();
            return an === cleanQ;
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
        } else {
          songs = songs.map(s => ({
            ...s,
            title: this.formatTrackTitle(s.title),
            artwork_url: this.formatCoverArt(s.artwork_url)
          }));
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
          artists = artists.filter(a => {
            if (!a) return false;
            const sub = (a.sub_label || '').toLowerCase();
            if (sub.includes('saluran') && !sub.includes('saluran artis')) return false;
            if (sub.includes('channel') && !sub.includes('artist')) return false;
            return true;
          });
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

  savePlaybackSession(isSync = false) {
    if (!this.tracks || !this.tracks[this.currentTrackIndex]) return;
    const currentTrack = this.tracks[this.currentTrackIndex];
    let currentTime = 0;
    if (this.audio && !isNaN(this.audio.currentTime) && this.audio.currentTime > 0) {
      currentTime = this.audio.currentTime;
    } else if (this._restoredSeekPosition > 0) {
      currentTime = this._restoredSeekPosition;
    }
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

    if (window.electronAPI) {
      if (isSync && typeof window.electronAPI.savePlaybackSessionSync === "function") {
        window.electronAPI.savePlaybackSessionSync(session);
      } else if (typeof window.electronAPI.savePlaybackSession === "function") {
        window.electronAPI.savePlaybackSession(session).catch(() => {});
      }
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

    // Clear stale local proxy and direct stream URLs because local proxy port changes on every run
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

    this._restoredSeekPosition = startPos;
    await this.loadTrack(this.currentTrackIndex, false, startPos);
    return true;
  }

  async loadTrack(index, autoPlay = true, startPosition = 0) {
    this.currentTrackIndex = index;
    const track = this.tracks[index];
    if (!track) return;

    this.isNextTrackPreloaded = false;

    // Immediately stop previous audio and assign unique load token to avoid race conditions
    if (this.audio) {
      try {
        this.audio.pause();
      } catch (_) {}
    }

    // Clean up any ongoing crossfade and secondary deck to prevent audio ghosting
    this.resetDeckGains();
    if (this.preloadAudio) {
      try {
        this.preloadAudio.pause();
        this.preloadAudio.currentTime = 0;
      } catch (_) {}
    }
    this._currentLoadId = (this._currentLoadId || 0) + 1;
    const loadId = this._currentLoadId;

    if (autoPlay) {
      this.isPlaying = true;
      this.updatePlayPauseIcon();
      this.showPlayerBuffering(true);
      if (typeof window !== 'undefined' && window.electronAPI && typeof window.electronAPI.setThumbarState === 'function') {
        window.electronAPI.setThumbarState({ isPlaying: this.isPlaying });
      }
    }

    if (!track.video_id && track.id && track.id.startsWith("yt_")) {
      track.video_id = track.id.replace(/^yt_/, "");
    }

    // Reset listening analytics scrobble session (Nuclear Feature 5)
    this._currentListenRecorded = false;
    this._currentListenTrack = track;

    this.playerTitle.innerHTML = `
      <span class="title-text">${this.escapeHtml(track.title)}</span>
      ${track.is_explicit ? '<span class="explicit-badge" title="Explicit">E</span>' : ''}
    `;
    this.renderBottomPlayerArtist(track);
    this.playerArtwork.src = track.artwork_url;
    this.updateVerificationBadge(track);
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
        this.playerSeekbar.style.background = `linear-gradient(to right, var(--color-brand-primary) 0%, var(--color-brand-primary) ${initialPct}%, rgba(255, 255, 255, 0.16) ${initialPct}%, rgba(255, 255, 255, 0.16) 100%)`;
      }
      if (this.screenPlayerSeekbar) {
        this.screenPlayerSeekbar.value = initialPct;
        this.screenPlayerSeekbar.style.background = `linear-gradient(to right, var(--color-brand-primary) 0%, var(--color-brand-primary) ${initialPct}%, rgba(255, 255, 255, 0.16) ${initialPct}%, rgba(255, 255, 255, 0.16) 100%)`;
      }
    }

    // Synchronize Screen Player immediately
    this.updateScreenPlayer();
    this.highlightActiveSongItems();

    // Record listening taste affinity for persistent "se-genre & se-kultur" profile
    this.recordTasteAffinity(track);

    // Local-First Audio Interceptor: check if audio is already downloaded locally in ~/Music/SoraFy
    if (window.electronAPI && typeof window.electronAPI.checkLocalAudioExists === 'function' && !track.is_local) {
      try {
        const localResult = await window.electronAPI.checkLocalAudioExists(track);
        if (loadId !== this._currentLoadId) return;
        if (localResult && localResult.exists && localResult.url) {
          track.fallback_url = track.stream_url;
          track.stream_url = localResult.url;
          track.raw_path = localResult.path;
          track.is_local = true;
          track.is_full_stream = true;
          track.audio_format = track.audio_format || {};
          track.audio_format.codec = "Offline HD";
          track.audio_format.bitrate_kbps = 320;
          if (this.playerBadge) this.playerBadge.textContent = "Offline HD";
          if (this.screenPlayerBadge) this.screenPlayerBadge.textContent = "Offline HD";
        }
      } catch (err) {
        console.warn("Local audio interceptor notice:", err);
      }
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
        if (loadId !== this._currentLoadId) return;
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

    if (loadId !== this._currentLoadId) return;

    if (!track.stream_url) {
      this.isPlaying = false;
      this.showPlayerBuffering(false);
      this.updatePlayPauseIcon();
      this.showToast("Failed to load audio stream for this track");
      return;
    }

    this.audio.src = track.stream_url;
    this.audio.load();

    this._restoredSeekPosition = startPosition > 0 ? startPosition : 0;

    if (startPosition > 0) {
      const applyRestoredSeek = () => {
        try {
          if (this.audio && !isNaN(this.audio.duration) && this.audio.duration > 0) {
            this.audio.currentTime = Math.min(startPosition, Math.max(0, this.audio.duration - 1));
          } else {
            this.audio.currentTime = startPosition;
          }
          const dur = (this.audio && !isNaN(this.audio.duration) && this.audio.duration > 0)
            ? this.audio.duration
            : (track.duration_secs || 1);
          const pct = Math.min(100, Math.max(0, (startPosition / dur) * 100));
          if (this.playerSeekbar && !this.isSeekingBottom) {
            this.playerSeekbar.value = pct;
            this.playerSeekbar.style.background = `linear-gradient(to right, var(--color-brand-primary) 0%, var(--color-brand-primary) ${pct}%, rgba(255, 255, 255, 0.16) ${pct}%, rgba(255, 255, 255, 0.16) 100%)`;
          }
          if (this.screenPlayerSeekbar && !this.isSeekingScreen) {
            this.screenPlayerSeekbar.value = pct;
            this.screenPlayerSeekbar.style.background = `linear-gradient(to right, var(--color-brand-primary) 0%, var(--color-brand-primary) ${pct}%, rgba(255, 255, 255, 0.16) ${pct}%, rgba(255, 255, 255, 0.16) 100%)`;
          }
          this.currentTimeLabel.textContent = this.formatTime(startPosition);
          if (this.screenPlayerCurrentTime) this.screenPlayerCurrentTime.textContent = this.formatTime(startPosition);
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
      const attemptPlayback = async (retryCount = 0) => {
        if (loadId !== this._currentLoadId) return;
        try {
          this.ensureAudioContextActive();
          if (this.appSettings && this.appSettings.crossfadeDuration > 0) {
            this.fadeInAudio(this.appSettings.crossfadeDuration);
          }
          await this.audio.play();
          if (loadId !== this._currentLoadId) return;
          this.isPlaying = true;
          this.showPlayerBuffering(false);
          this.updatePlayPauseIcon();
          this.syncJamState();
          if (this.currentView === "player" && (track.is_video || this.currentScreenMode === "video")) {
            this.setScreenPlayerMode("video");
          }
          // Spotify Preload Hook: resolve and buffer next track in background after 1s
          setTimeout(() => this.preloadNextTrack(), 1000);
        } catch (err) {
          if (loadId !== this._currentLoadId) return;
          console.warn("Audio autoplay attempt rejected:", err);

          // Retry on canplay or quick buffer delay if interrupted / buffering
          if (retryCount === 0) {
            const onCanPlay = () => {
              this.audio.removeEventListener("canplay", onCanPlay);
              if (loadId === this._currentLoadId) {
                attemptPlayback(1);
              }
            };
            this.audio.addEventListener("canplay", onCanPlay, { once: true });

            setTimeout(() => {
              if (loadId === this._currentLoadId && this.audio.paused) {
                attemptPlayback(1);
              }
            }, 300);
            return;
          }

          // Try fallback stream URL if available
          if (track.fallback_url && track.fallback_url !== track.stream_url) {
            try {
              this.audio.src = track.fallback_url;
              this.audio.load();
              if (startPosition > 0) {
                this.audio.currentTime = startPosition;
              }
              await this.audio.play();
              if (loadId !== this._currentLoadId) return;
              this.isPlaying = true;
              this.showPlayerBuffering(false);
              this.updatePlayPauseIcon();
              setTimeout(() => this.preloadNextTrack(), 1000);
              return;
            } catch (e2) {}
          }

          this.isPlaying = false;
          this.showPlayerBuffering(false);
          this.updatePlayPauseIcon();
          this.showToast("Unable to play audio");
        }
      };

      attemptPlayback();
    } else {
      this.isPlaying = false;
      this.showPlayerBuffering(false);
      this.updatePlayPauseIcon();
      if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
      if (typeof window !== 'undefined' && window.electronAPI && typeof window.electronAPI.setThumbarState === 'function') {
        window.electronAPI.setThumbarState({ isPlaying: this.isPlaying });
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
      const preloadEl = this.activeDeck === 'A' ? (this.deckB || this.preloadAudio) : (this.deckA || this.audio);
      if (preloadEl) {
        if (preloadEl.src !== url) {
          preloadEl.src = url;
          preloadEl.load();
        }
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

    // Live refresh Quick Picks carousel to immediately reflect recently played songs
    if (this.quickPicksCarousel && (this.currentView === 'home' || !this.currentView)) {
      this.renderQuickPicksCarousel();
    }

    // Dynamically refresh recommended albums to reflect newly played artists
    if (this.currentView === 'home' || !this.currentView) {
      if (this._albumRecDebounce) clearTimeout(this._albumRecDebounce);
      this._albumRecDebounce = setTimeout(() => {
        this.fetchYtmNewReleases();
      }, 5000);
    }
  }

  showLikedSongs() {
    this.currentCustomView = "liked";
    const isId = (this.currentLanguage === "id");
    const saved = JSON.parse(localStorage.getItem("sorafy_liked_tracks") || "[]");
    const currentLiked = this.tracks.filter(t => this.likedTrackIds.has(t.id));
    const map = new Map();
    saved.forEach(t => map.set(t.id, t));
    currentLiked.forEach(t => map.set(t.id, t));
    const liked = Array.from(map.values()).filter(t => this.likedTrackIds.has(t.id));

    this.sectionTitleLabel.textContent = isId ? `Lagu Disukai (${liked.length})` : `Liked Songs (${liked.length})`;
    if (liked.length === 0) {
      this.trackGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px 0; color: var(--color-text-secondary); font-size: 13px;">
          <div style="margin-bottom: 12px;"><iconsax-icon name="heart" type="bold" size="32" color="#EF4444"></iconsax-icon></div>
          ${isId ? "Belum ada lagu yang disukai. Klik ikon hati pada lagu untuk menyimpannya di sini." : "No liked songs yet. Click the heart icon on any song to save it here."}
        </div>
      `;
    } else {
      this.tracks = liked;
      this.renderTrackGrid(liked);
    }
  }

  async showDownloadedSongs() {
    this.currentCustomView = "downloads";
    const isId = (this.currentLanguage === "id");
    this.sectionTitleLabel.textContent = isId ? "Lagu Terunduh" : "Downloaded Songs";

    if (!window.electronAPI || typeof window.electronAPI.getDownloadedTracks !== 'function') {
      this.trackGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px 0; color: var(--color-text-secondary); font-size: 13px;">
          <div style="margin-bottom: 12px;"><iconsax-icon name="folder-cloud" type="bold" size="32" color="#00E599"></iconsax-icon></div>
          ${isId ? "Fitur lagu terunduh didukung pada aplikasi desktop SoraFy." : "Local downloads are supported on SoraFy desktop app."}
        </div>
      `;
      return;
    }

    try {
      const tracks = await window.electronAPI.getDownloadedTracks();
      this.downloadedTracks = Array.isArray(tracks) ? tracks : [];
      const count = this.downloadedTracks.length;
      this.sectionTitleLabel.textContent = isId ? `Lagu Terunduh (${count})` : `Downloaded Songs (${count})`;

      if (count === 0) {
        this.trackGrid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 48px 0; color: var(--color-text-secondary); font-size: 13px;">
            <div style="margin-bottom: 12px;"><iconsax-icon name="folder-cloud" type="bold" size="32" color="#00E599"></iconsax-icon></div>
            <div style="font-weight: 700; color: #FFFFFF; margin-bottom: 6px; font-size: 15px;">
              ${isId ? "Belum ada lagu yang diunduh" : "No downloaded tracks yet"}
            </div>
            <div style="font-size: 13px; max-width: 380px; margin: 0 auto; line-height: 1.5;">
              ${isId ? "Klik kanan pada lagu mana saja saat online dan pilih 'Download Track (MP3)' untuk mendengarkannya secara offline kapan saja." : "Right-click any song while online and select 'Download Track (MP3)' to listen offline anytime."}
            </div>
          </div>
        `;
      } else {
        this.tracks = [...this.downloadedTracks];
        this.renderTrackGrid(this.tracks);
      }
      this.renderUserPlaylists();
    } catch (err) {
      this.trackGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px 0; color: #EF4444; font-size: 13px;">
          Error reading local downloads: ${this.escapeHtml(err.message)}
        </div>
      `;
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
      this.syncJamState();
      if (typeof this.onPause === 'function') this.onPause();
      if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
      if (typeof window !== 'undefined' && window.electronAPI && typeof window.electronAPI.setThumbarState === 'function') {
        window.electronAPI.setThumbarState({ isPlaying: this.isPlaying });
      }
      const cur = this.tracks[this.currentTrackIndex];
      if (cur) this.updateDiscordPresence(cur);
    } else {
      const resumePos = Math.max(0, (this.audio && this.audio.currentTime > 0) ? this.audio.currentTime : (this._restoredSeekPosition || 0));
      if (!this.audio.src || this.audio.error) {
        this.loadTrack(this.currentTrackIndex, true, resumePos);
        return;
      }
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.updatePlayPauseIcon();
        this.syncJamState();
        if (typeof this.onPlay === 'function') this.onPlay();
        if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
        if (typeof window !== 'undefined' && window.electronAPI && typeof window.electronAPI.setThumbarState === 'function') {
          window.electronAPI.setThumbarState({ isPlaying: this.isPlaying });
        }
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
          await this.loadTrack(this.currentTrackIndex, true, resumePos);
        } catch (e2) {
          this.isPlaying = false;
          this.updatePlayPauseIcon();
          if (typeof this.onPause === 'function') this.onPause();
          if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
          if (typeof window !== 'undefined' && window.electronAPI && typeof window.electronAPI.setThumbarState === 'function') {
            window.electronAPI.setThumbarState({ isPlaying: this.isPlaying });
          }
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
    if (this.screenPlayerVideoOverlay) {
      if (!this.isPlaying && this.currentScreenMode === "video") {
        this.screenPlayerVideoOverlay.classList.add("active");
      }
    }
    if (typeof window !== 'undefined' && window.electronAPI && typeof window.electronAPI.setThumbarState === 'function') {
      window.electronAPI.setThumbarState({ isPlaying: this.isPlaying });
    }
  }

  async playNext() {
    if (!this.tracks || this.tracks.length === 0) return;

    // Track rapid skips (< 20 seconds) for real-time recommendation session tuning
    const curTrack = this.tracks[this.currentTrackIndex];
    if (this.audio && !this.audio.paused && this.audio.currentTime > 0 && this.audio.currentTime < 20) {
      if (curTrack && curTrack.artist) {
        this.recentlySkippedArtists.set(curTrack.artist.toLowerCase().trim(), Date.now());
      }
    }

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
      this.resetDeckGains();
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
      this.resetDeckGains();
      this.audio.currentTime = 0;
      this.audio.play();
    } else {
      if (this.isCrossfading) {
        this.swapDecks();
      } else {
        this.playNext();
      }
    }
  }

  onTimeUpdate() {
    const current = this.audio.currentTime || 0;
    const total = this.audio.duration || this.tracks[this.currentTrackIndex]?.duration_secs || 1;
    const pct = total > 0 ? (current / total) * 100 : 0;

    // Reset restored seek once user has legitimately progressed into playback
    if (current > 1 && this._restoredSeekPosition > 0) {
      this._restoredSeekPosition = 0;
    }

    // Periodically persist playback session state (throttled every 3 seconds)
    const now = Date.now();
    if (!this._lastSessionSave || (now - this._lastSessionSave > 3000)) {
      this._lastSessionSave = now;
      this.savePlaybackSession();
    }

    // Throttled sync state to SoraFy Jam mobile remote (every 1 second)
    if (!this._lastJamSync || (now - this._lastJamSync > 1000)) {
      this._lastJamSync = now;
      this.syncJamState();
    }

    // Throttled sync to OS Native Media Session position (every 1 second)
    if (!this._lastMediaSessionSync || (now - this._lastMediaSessionSync > 1000)) {
      this._lastMediaSessionSync = now;
      this.updateMediaSessionPosition();
    }

    // Nuclear Feature 5: Record listening analytics event (at 30s or 50% duration)
    if (!this._currentListenRecorded && this._currentListenTrack && current > 0) {
      const dur = total > 1 ? total : (this._currentListenTrack.duration_secs || 0);
      const threshold = (dur > 0 && dur < 60) ? Math.max(10, dur * 0.5) : 30;
      if (current >= threshold) {
        this._currentListenRecorded = true;
        this.recordListenEvent(this._currentListenTrack, dur, current);
      }
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
      this.playerSeekbar.style.background = `linear-gradient(to right, var(--color-brand-primary) 0%, var(--color-brand-primary) ${pct}%, rgba(255, 255, 255, 0.16) ${pct}%, rgba(255, 255, 255, 0.16) 100%)`;
    }

    if (this.screenPlayerCurrentTime) this.screenPlayerCurrentTime.textContent = this.formatTime(current);
    if (this.screenPlayerDuration) this.screenPlayerDuration.textContent = this.formatTime(total);

    if (this.screenPlayerSeekbar && !this.isSeekingScreen) {
      this.screenPlayerSeekbar.value = pct;
      this.screenPlayerSeekbar.style.background = `linear-gradient(to right, var(--color-brand-primary) 0%, var(--color-brand-primary) ${pct}%, rgba(255, 255, 255, 0.16) ${pct}%, rgba(255, 255, 255, 0.16) 100%)`;
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

    // Dual-Deck Queue Prefetcher: Trigger preload when within prefetch window (<= 15s remaining)
    const helper = getAudioDeckStateHelper();
    const shouldPrefetch = helper && typeof helper.shouldTriggerPrefetch === 'function'
      ? helper.shouldTriggerPrefetch(current, total, this.isNextTrackPreloaded)
      : ((total > 0 && total - current <= 15) && !this.isNextTrackPreloaded);

    if (shouldPrefetch) {
      this.isNextTrackPreloaded = true;
      this.preloadNextTrack();
    }

    // Dual-Deck Gapless & True Crossfade Engine Tick
    this.handleCrossfadeTick();
  }

  formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  formatTrackTitle(title) {
    if (!title || typeof title !== 'string') return title || '';
    if (this.appSettings && this.appSettings.titleCleanup === false) return title;
    return title
      .replace(/\s*\[(?:Official\s*(?:Music\s*)?Video|Official\s*Audio|Official\s*Lyric\s*Video|Lyrics?|Lirik|Video\s*Klip|Clip\s*Officiel|4K|HD|HQ|MV|Audio)\]/gi, '')
      .replace(/\s*\((?:Official\s*(?:Music\s*)?Video|Official\s*Audio|Official\s*Lyric\s*Video|Lyrics?|Lirik|Video\s*Klip|Clip\s*Officiel|4K|HD|HQ|MV|Audio)\)/gi, '')
      .replace(/\s*-\s*(?:Official\s*(?:Music\s*)?Video|Official\s*Audio|Lyrics?|Video\s*Klip)\s*$/gi, '')
      .trim();
  }

  formatCoverArt(url) {
    if (!url || typeof url !== 'string') return url || this.DEFAULT_TRACK_ART;
    if (this.appSettings && this.appSettings.coverHD === false) return url;
    if (url.includes('googleusercontent.com') || url.includes('ggpht.com')) {
      return url.replace(/=w\d+-h\d+[^?&=]*/, '=w544-h544-l90-rj');
    }
    return url;
  }

  // Synchronized Glowing Karaoke Lyrics with Notes-App Search Architecture
  loadLyrics(lyrics) {
    this.currentLyrics = lyrics;
    this.syncJamState();
    this.lyricsContainer.innerHTML = "";
    this.lyricsLineElements = [];
    this.activeLyricIndex = -1;
    this.updateLyricsOffsetUI();

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
      p.dataset.time = line.timestamp_ms;
      p.dataset.index = idx;

      // 1. Main line with word spans for progressive karaoke fill
      const mainDiv = document.createElement("div");
      mainDiv.className = "lyric-main";

      if (line.words && line.words.length > 0) {
        line.words.forEach((w) => {
          const span = document.createElement("span");
          span.className = "lyric-word";
          span.textContent = w.word;
          span.dataset.start = Math.round(w.startMs);
          span.dataset.end = Math.round(w.endMs);
          mainDiv.appendChild(span);
          mainDiv.appendChild(document.createTextNode(" "));
        });
      } else {
        mainDiv.textContent = line.text;
      }
      p.appendChild(mainDiv);

      p.addEventListener("click", () => {
        if (typeof line.timestamp_ms === "number" && line.timestamp_ms >= 0) {
          const offsetMs = this.getCurrentTrackLyricsOffset();
          this.audio.currentTime = Math.max(0, (line.timestamp_ms - offsetMs) / 1000);
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

    // Apply manual offset calibration (Phase 4)
    const offsetMs = this.getCurrentTrackLyricsOffset();
    const effectiveMs = currentMs + offsetMs;

    let activeIdx = -1;
    for (let i = 0; i < this.currentLyrics.length; i++) {
      if (typeof this.currentLyrics[i].timestamp_ms === "number" && this.currentLyrics[i].timestamp_ms >= 0 && effectiveMs >= this.currentLyrics[i].timestamp_ms) {
        activeIdx = i;
      } else if (typeof this.currentLyrics[i].timestamp_ms === "number" && this.currentLyrics[i].timestamp_ms >= 0 && effectiveMs < this.currentLyrics[i].timestamp_ms) {
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
          // Reset words outside active line
          if (idx < activeIdx) {
            l.querySelectorAll(".lyric-word").forEach(w => {
              w.classList.add("sung");
              w.classList.remove("singing");
            });
          } else {
            l.querySelectorAll(".lyric-word").forEach(w => {
              w.classList.remove("sung", "singing");
            });
          }
        }
      });
    }

    // High-precision word-level karaoke sync on active line
    if (activeIdx >= 0 && this.lyricsLineElements[activeIdx]) {
      const activeEl = this.lyricsLineElements[activeIdx];
      const wordSpans = activeEl.querySelectorAll(".lyric-word");
      if (wordSpans.length > 0) {
        wordSpans.forEach(span => {
          const wStart = Number(span.dataset.start);
          const wEnd = Number(span.dataset.end);
          if (effectiveMs >= wEnd) {
            span.classList.add("sung");
            span.classList.remove("singing");
          } else if (effectiveMs >= wStart) {
            span.classList.add("singing");
            span.classList.remove("sung");
          } else {
            span.classList.remove("sung", "singing");
          }
        });
      }
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
    if (viewName !== "search_results") {
      this.hideSearchSuggestions();
    }

    this.navItems.forEach(item => {
      item.classList.toggle("active", item.dataset.view === viewName);
    });

    if (this.userPlaylistsNav) {
      const plItems = this.userPlaylistsNav.querySelectorAll(".playlist-nav-item, .lib-sidebar-item");
      plItems.forEach(el => {
        if (viewName === "playlist" && this.currentPlaylist?.is_special === "liked" && el.dataset.type === "liked") {
          el.classList.add("active");
        } else if (viewName === "playlist" && this.currentPlaylist?.is_special === "downloads" && el.dataset.type === "downloads") {
          el.classList.add("active");
        } else if (viewName === "playlist" && this.currentPlaylist && el.dataset.playlistId === this.currentPlaylist.id) {
          el.classList.add("active");
        } else if (viewName === "playlist" && this.currentPlaylist && el.dataset.albumId && (el.dataset.albumId === this.currentPlaylist.id || el.dataset.albumId === this.currentPlaylist.browse_id)) {
          el.classList.add("active");
        } else if (viewName === "artist" && this.currentArtist && el.dataset.artistName && el.dataset.artistName.toLowerCase() === this.currentArtist.name.toLowerCase()) {
          el.classList.add("active");
        } else {
          el.classList.remove("active");
        }
      });
    }

    if (viewName === "equalizer") {
      if (this.settingsModal) {
        this.settingsModal.style.display = "flex";
        const eqBtn = this.settingsTabBar ? this.settingsTabBar.querySelector('[data-tab="equalizer"]') : null;
        if (eqBtn) eqBtn.click();
      }
      return;
    }

    if (viewName === "stats") {
      this.switchView("home");
      return;
    }

    if (viewName === "library") {
      this.openLikedSongsView();
      return;
    }

    if (viewName === "downloads") {
      this.openDownloadedSongsView();
      return;
    }

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
          this.renderQuickPicksCarousel();
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

  // =========================================================
  // Official YouTube Music Automix / Radio Engine
  // =========================================================
  async startRadioForTrack(seedTrack) {
    if (!seedTrack) return;
    this.tracks = [seedTrack];
    this.currentTrackIndex = 0;
    this.ytmRadioContinuationToken = null;
    this.loadTrack(0, true);
    const msg = this.currentLanguage === "id"
      ? `Memulai radio Automix: ${seedTrack.title}`
      : `Starting Automix radio: ${seedTrack.title}`;
    this.showToast(msg);
    await this.ensureUpcomingQueue(true);
  }

  async fetchAutomixQueue(seedTrack, forceRefresh = false) {
    if (!seedTrack) return [];
    if (!window.electronAPI || typeof window.electronAPI.fetchYouTubeRadioQueue !== "function") {
      return await this.fetchMusifyQueue(seedTrack);
    }

    try {
      // 1. Resolve seed video ID
      let vid = seedTrack.video_id;
      if (!vid && seedTrack.id && seedTrack.id.startsWith("yt_")) {
        vid = seedTrack.id.replace("yt_", "");
      }
      if (!vid && typeof window.electronAPI.resolveFullStream === "function") {
        const stream = await window.electronAPI.resolveFullStream({
          title: seedTrack.title,
          artist: seedTrack.artist
        }).catch(() => null);
        if (stream && stream.videoId) vid = stream.videoId;
      }
      if (!vid && typeof window.electronAPI.searchYouTubeMusic === "function") {
        const searchRes = await window.electronAPI.searchYouTubeMusic(`${seedTrack.artist} ${seedTrack.title}`, "song").catch(() => []);
        if (searchRes && searchRes.length && (searchRes[0].videoId || searchRes[0].id)) {
          vid = searchRes[0].videoId || (searchRes[0].id ? searchRes[0].id.replace("yt_", "") : "");
        }
      }

      if (!vid && !this.ytmRadioContinuationToken) {
        return await this.fetchMusifyQueue(seedTrack);
      }

      const continuation = forceRefresh ? null : this.ytmRadioContinuationToken;
      const radioResult = await window.electronAPI.fetchYouTubeRadioQueue(vid, continuation).catch(() => null);

      if (!radioResult || !Array.isArray(radioResult.tracks) || radioResult.tracks.length === 0) {
        return await this.fetchMusifyQueue(seedTrack);
      }

      if (radioResult.continuation) {
        this.ytmRadioContinuationToken = radioResult.continuation;
      }

      // Deduplicate against existing songs in current session
      const existingIds = new Set();
      const existingTitles = new Set();
      this.tracks.forEach(t => {
        if (t.id) existingIds.add(t.id);
        if (t.video_id) existingIds.add(t.video_id);
        if (t.title) existingTitles.add(t.title.toLowerCase().trim());
      });

      const now = Date.now();
      const candidateTracks = [];

      for (const t of radioResult.tracks) {
        const tVid = t.video_id || (t.id ? t.id.replace("yt_", "") : "");
        if (!tVid || existingIds.has(tVid) || existingIds.has(t.id)) continue;

        const cleanTitle = (t.title || "").toLowerCase().trim();
        if (cleanTitle && existingTitles.has(cleanTitle)) continue;

        // Skip Deprioritization: if artist was recently skipped quickly (< 5 mins), skip in this batch
        const artLower = (t.artist || "").toLowerCase().trim();
        if (this.recentlySkippedArtists.has(artLower)) {
          const skippedAt = this.recentlySkippedArtists.get(artLower);
          if (now - skippedAt < 5 * 60 * 1000) {
            continue;
          }
        }

        existingIds.add(tVid);
        existingIds.add(t.id);
        if (cleanTitle) existingTitles.add(cleanTitle);

        candidateTracks.push(t);
      }

      // If deduplication removed all tracks, fallback to raw candidate tracks or Musify queue
      if (candidateTracks.length === 0 && radioResult.tracks.length > 0) {
        return radioResult.tracks.slice(0, 15);
      }

      return candidateTracks;
    } catch (err) {
      console.warn("fetchAutomixQueue note:", err);
      return await this.fetchMusifyQueue(seedTrack);
    }
  }

  async ensureUpcomingQueue(force = false) {
    if (this.isFetchingRadioQueue) return;
    if (this.appSettings && this.appSettings.autoMixQueue === false) return;

    const upcomingCount = Math.max(0, this.tracks.length - 1 - this.currentTrackIndex);
    if (upcomingCount <= 2 || force) {
      this.isFetchingRadioQueue = true;
      try {
        const currentTrack = this.tracks[this.currentTrackIndex];
        if (currentTrack) {
          const newTracks = await this.fetchAutomixQueue(currentTrack, force);
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
      if (track) {
        if (this.videoOverlayTitle) this.videoOverlayTitle.textContent = track.title || 'Video Title';
        if (this.videoOverlayArtist) this.videoOverlayArtist.textContent = track.artist || '';
      }

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
    if (this.videoOverlayTitle) {
      this.videoOverlayTitle.textContent = track.title || 'Video Title';
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

    if (this.screenPlayerMeshBackdrop) {
      if (track.artwork_url) {
        this.screenPlayerMeshBackdrop.style.backgroundImage = `url("${track.artwork_url}")`;
        this.screenPlayerMeshBackdrop.style.opacity = "0.75";
      } else {
        this.screenPlayerMeshBackdrop.style.backgroundImage = "none";
        this.screenPlayerMeshBackdrop.style.opacity = "0";
      }
    }

    if (this.statsForNerdsModal && this.statsForNerdsModal.style.display === "flex") {
      this.renderStatsForNerds();
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

  toggleStatsForNerds() {
    if (!this.statsForNerdsModal) return;
    const isVisible = this.statsForNerdsModal.style.display === "flex";
    if (isVisible) {
      this.statsForNerdsModal.style.display = "none";
    } else {
      this.renderStatsForNerds();
      this.statsForNerdsModal.style.display = "flex";
    }
  }

  renderStatsForNerds() {
    if (!this.statsNerdsGrid) return;
    const track = this.tracks[this.currentTrackIndex];
    if (!track) {
      this.statsNerdsGrid.innerHTML = `<div style="color: #94A3B8; text-align: center; padding: 12px;">Tidak ada trek audio yang sedang aktif.</div>`;
      return;
    }

    let codec = track.audio_format?.codec || (track.stream_url?.includes(".mp4") ? "AAC (mp4a)" : "Opus (webm)");
    if (codec.includes("yt-dlp") || codec.includes("YouTube Direct")) {
      codec = "Opus (itag 251)";
    }
    let sampleRate = "48,000 Hz · Stereo (2 ch)";
    let bitrate = track.audio_format?.bitrate ? `${Math.round(track.audio_format.bitrate / 1000)} kbps` : "160 kbps (VBR)";

    let bufSecs = "0.0s";
    if (this.audio && this.audio.buffered && this.audio.buffered.length > 0) {
      try {
        const cur = this.audio.currentTime || 0;
        let found = 0;
        for (let i = 0; i < this.audio.buffered.length; i++) {
          if (this.audio.buffered.start(i) <= cur && this.audio.buffered.end(i) >= cur) {
            found = this.audio.buffered.end(i) - cur;
            break;
          }
        }
        bufSecs = `${found.toFixed(1)}s`;
      } catch (_) {}
    }

    const curTime = this.formatTime(this.audio?.currentTime || 0);
    const totalTime = this.formatTime(this.audio?.duration || track.duration_secs || 0);
    const audioBackend = this.audioCtx ? "Web Audio API (DSP Graph)" : "HTML5 MediaElement";
    const volumeLevel = `${Math.round((this.audio?.volume ?? 0.85) * 100)}%`;
    const playbackRate = `${(this.audio?.playbackRate || 1.0).toFixed(2)}x`;
    const sourceKind = track.source_label || (track.is_full_stream ? "Resolved Direct Stream" : "Cached / Internal Stream");

    const rows = [
      { key: "Track Title", val: this.escapeHtml(track.title || "Unknown") },
      { key: "Artist", val: this.escapeHtml(track.artist || "Unknown") },
      { key: "Video / Audio ID", val: track.video_id || track.id || "N/A" },
      { key: "Stream Codec", val: codec },
      { key: "Sample Rate", val: sampleRate },
      { key: "Audio Bitrate", val: bitrate },
      { key: "Buffer Health", val: bufSecs },
      { key: "Playhead Position", val: `${curTime} / ${totalTime}` },
      { key: "DSP Engine", val: audioBackend },
      { key: "Volume Level", val: volumeLevel },
      { key: "Speed / Rate", val: playbackRate },
      { key: "Stream Delivery", val: sourceKind }
    ];

    this.statsNerdsGrid.innerHTML = rows.map(r => `
      <div class="stats-nerds-row">
        <span class="stats-nerds-key">${r.key}:</span>
        <span class="stats-nerds-val">${r.val}</span>
      </div>
    `).join("");
  }

  // =========================================================
  // Web Audio API & Hi-Fi DSP Equalizer Studio Engine
  // =========================================================
  initAudioEqualizer() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();
      this.audioContext = this.audioCtx; // Expose standard AudioContext alias

      // Dual-Deck independent gain nodes connected to unified DSP equalizer chain
      this.deckAGainNode = this.audioCtx.createGain();
      this.deckBGainNode = this.audioCtx.createGain();
      this.deckAGainNode.gain.value = (this.activeDeck === 'A') ? 1.0 : 0.0;
      this.deckBGainNode.gain.value = (this.activeDeck === 'B') ? 1.0 : 0.0;

      const deckAEl = this.deckA || this.audio;
      const deckBEl = this.deckB || this.preloadAudio;

      if (deckAEl) {
        try {
          this.audioSourceNode = this.audioCtx.createMediaElementSource(deckAEl);
          this.audioSourceNode.connect(this.deckAGainNode);
        } catch (e) {
          console.warn("Deck A AudioSourceNode notice:", e);
        }
      }
      if (deckBEl) {
        try {
          this.preloadAudioSourceNode = this.audioCtx.createMediaElementSource(deckBEl);
          this.preloadAudioSourceNode.connect(this.deckBGainNode);
        } catch (e) {
          console.warn("Deck B AudioSourceNode notice:", e);
        }
      }

      // 1. Preamp Gain Node (Headroom & Anti-Clipping Attenuation)
      this.preampNode = this.audioCtx.createGain();
      const preampFactor = Math.pow(10, (this.currentPreamp || 0) / 20);
      this.preampNode.gain.value = this.isEqBypassed ? 1.0 : preampFactor;

      if (this.deckAGainNode) this.deckAGainNode.connect(this.preampNode);
      if (this.deckBGainNode) this.deckBGainNode.connect(this.preampNode);

      let lastNode = this.preampNode;

      // 2. 10-Band ISO Graphic Equalizer Filters (Direct Form II Biquads)
      this.eqFilters = EQ_FREQUENCIES.map((freq, idx) => {
        const filter = this.audioCtx.createBiquadFilter();
        if (idx === 0) {
          filter.type = "lowshelf";
        } else if (idx === EQ_FREQUENCIES.length - 1) {
          filter.type = "highshelf";
        } else {
          filter.type = "peaking";
          filter.Q.value = 1.414;
        }
        filter.frequency.value = freq;
        const targetGain = this.isEqBypassed ? 0 : (this.currentGains[idx] || 0);
        filter.gain.value = targetGain;

        lastNode.connect(filter);
        lastNode = filter;
        return filter;
      });

      // 3. Sub-Bass Dynamic Filter (40-80 Hz sub-harmonic resonance)
      this.bassFilterNode = this.audioCtx.createBiquadFilter();
      this.bassFilterNode.type = "lowshelf";
      this.bassFilterNode.frequency.value = 75;
      this.bassFilterNode.gain.value = (this.isEqBypassed || !this.bassBoostAmount) ? 0 : (this.bassBoostAmount / 100) * 8.0;
      lastNode.connect(this.bassFilterNode);
      lastNode = this.bassFilterNode;

      // 4. High-Treble Air Exciter Filter (12 kHz+ sparkle)
      this.airFilterNode = this.audioCtx.createBiquadFilter();
      this.airFilterNode.type = "highshelf";
      this.airFilterNode.frequency.value = 12000;
      this.airFilterNode.gain.value = (this.isEqBypassed || !this.currentAirExciter) ? 0 : (this.currentAirExciter / 100) * 6.0;
      lastNode.connect(this.airFilterNode);
      lastNode = this.airFilterNode;

      // 5. Dynamics Compressor (Calibrated Loudness Normalization & Anti-Clipping Limiter)
      this.compressorNode = this.audioCtx.createDynamicsCompressor();
      this.normalizerNode = this.compressorNode; // Backward compatibility alias
      lastNode.connect(this.compressorNode);
      lastNode = this.compressorNode;

      // 5b. Master Makeup Gain Node (Calibrated Streaming Output & Transparent Bypass)
      this.masterGainNode = this.audioCtx.createGain();
      lastNode.connect(this.masterGainNode);
      lastNode = this.masterGainNode;

      // Apply initial volume normalization setting
      this.setVolumeNormalization(!!(this.appSettings && this.appSettings.volumeNormalization));

      // 6. AnalyserNode for Real-Time Frequency Spectrum Display
      this.analyserNode = this.audioCtx.createAnalyser();
      this.analyserNode.fftSize = 512;
      this.analyserNode.smoothingTimeConstant = 0.82;
      lastNode.connect(this.analyserNode);
      lastNode = this.analyserNode;

      lastNode.connect(this.audioCtx.destination);
    } catch (e) {
      console.warn("AudioContext init notice:", e);
    }

    this.renderEqualizerBands();
    this.updateHeadroomTag();
  }

  setVolumeNormalization(enabled) {
    const isNorm = !!enabled;
    let params;
    try {
      if (typeof getNormalizationParams === "function") {
        params = getNormalizationParams(isNorm);
      } else if (typeof window !== "undefined" && typeof window.getNormalizationParams === "function") {
        params = window.getNormalizationParams(isNorm);
      } else if (typeof window !== "undefined" && window.AudioNodes && typeof window.AudioNodes.getNormalizationParams === "function") {
        params = window.AudioNodes.getNormalizationParams(isNorm);
      } else if (typeof require !== "undefined") {
        const { getNormalizationParams: gnp } = require("./modules/audio-nodes");
        params = gnp(isNorm);
      }
    } catch (_) {}

    if (!params) {
      params = isNorm
        ? { threshold: -18, knee: 12, ratio: 4.0, attack: 0.003, release: 0.25, masterGain: 1.15 }
        : { threshold: 0, knee: 0, ratio: 1.0, attack: 0.003, release: 0.25, masterGain: 1.0 };
    }

    const curTime = (this.audioCtx && typeof this.audioCtx.currentTime === "number")
      ? this.audioCtx.currentTime
      : (this.audioContext && typeof this.audioContext.currentTime === "number")
        ? this.audioContext.currentTime
        : 0;

    const comp = this.compressorNode || this.normalizerNode;
    if (comp) {
      if (comp.threshold) {
        if (typeof comp.threshold.setValueAtTime === "function") {
          comp.threshold.setValueAtTime(params.threshold, curTime);
        } else {
          comp.threshold.value = params.threshold;
        }
      }
      if (comp.ratio) {
        if (typeof comp.ratio.setValueAtTime === "function") {
          comp.ratio.setValueAtTime(params.ratio, curTime);
        } else {
          comp.ratio.value = params.ratio;
        }
      }
      if (comp.knee && params.knee !== undefined) {
        if (typeof comp.knee.setValueAtTime === "function") {
          comp.knee.setValueAtTime(params.knee, curTime);
        } else {
          comp.knee.value = params.knee;
        }
      }
      if (comp.attack && params.attack !== undefined) {
        if (typeof comp.attack.setValueAtTime === "function") {
          comp.attack.setValueAtTime(params.attack, curTime);
        } else {
          comp.attack.value = params.attack;
        }
      }
      if (comp.release && params.release !== undefined) {
        if (typeof comp.release.setValueAtTime === "function") {
          comp.release.setValueAtTime(params.release, curTime);
        } else {
          comp.release.value = params.release;
        }
      }
    }

    if (this.masterGainNode && this.masterGainNode.gain) {
      if (typeof this.masterGainNode.gain.setValueAtTime === "function") {
        this.masterGainNode.gain.setValueAtTime(params.masterGain, curTime);
      } else {
        this.masterGainNode.gain.value = params.masterGain;
      }
    }

    return params;
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
      col.className = "hifi-eq-band-col";
      const formattedFreq = freq >= 1000 ? `${(freq / 1000).toFixed(freq % 1000 === 0 ? 0 : 1)}k` : `${freq}`;
      const role = EQ_BAND_ROLES[idx] || "";
      const gainClass = currentGain > 0 ? "boost" : (currentGain < 0 ? "cut" : "zero");

      col.innerHTML = `
        <span class="hifi-gain-val ${gainClass}" id="eqGainLabel_${idx}">${currentGain > 0 ? '+' : ''}${currentGain.toFixed(1)} dB</span>
        <div class="hifi-fader-wrap">
          <div class="hifi-fader-tick"></div>
          <input type="range" class="hifi-v-fader" min="-12" max="12" step="0.5" value="${currentGain}" id="eqSlider_${idx}">
        </div>
        <span class="hifi-freq-badge">${formattedFreq}</span>
        <span class="hifi-freq-role" title="${role}">${role}</span>
      `;

      const slider = col.querySelector(`#eqSlider_${idx}`);
      const label = col.querySelector(`#eqGainLabel_${idx}`);

      slider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        this.currentGains[idx] = val;
        label.textContent = `${val > 0 ? '+' : ''}${val.toFixed(1)} dB`;
        label.className = `hifi-gain-val ${val > 0 ? 'boost' : (val < 0 ? 'cut' : 'zero')}`;
        if (this.eqFilters[idx] && !this.isEqBypassed) {
          this.eqFilters[idx].gain.value = val;
        }
        localStorage.setItem("sorafy_eq_gains", JSON.stringify(this.currentGains));
        if (this.eqActivePresetTag) {
          this.eqActivePresetTag.textContent = "Preset: Custom";
        }
        this.updateHeadroomTag();
        this.drawEqResponseCurve();
      });

      this.eqBandsRow.appendChild(col);
    });

    this.drawEqResponseCurve();
  }

  applyEqualizerPreset(presetName) {
    const preset = EQ_PRESETS[presetName];
    if (!preset) return;

    this.currentGains = [...preset];
    localStorage.setItem("sorafy_eq_gains", JSON.stringify(this.currentGains));

    this.currentGains.forEach((gain, idx) => {
      if (this.eqFilters[idx] && !this.isEqBypassed) {
        this.eqFilters[idx].gain.value = gain;
      }
      const slider = document.getElementById(`eqSlider_${idx}`);
      const label = document.getElementById(`eqGainLabel_${idx}`);
      if (slider) slider.value = gain;
      if (label) {
        label.textContent = `${gain > 0 ? '+' : ''}${gain.toFixed(1)} dB`;
        label.className = `hifi-gain-val ${gain > 0 ? 'boost' : (gain < 0 ? 'cut' : 'zero')}`;
      }
    });

    if (this.eqActivePresetTag) {
      this.eqActivePresetTag.textContent = `Preset: ${presetName}`;
    }

    if (presetName === "Bass Boost") {
      if (this.bassBoostSlider) {
        this.bassBoostSlider.value = 45;
        this.bassBoostAmount = 45;
      }
      if (this.bassBoostVal) this.bassBoostVal.textContent = "45%";
      if (this.bassFilterNode && !this.isEqBypassed) this.bassFilterNode.gain.value = 3.6;
    } else if (presetName === "Hi-Fi Clarity") {
      if (this.bassBoostSlider) {
        this.bassBoostSlider.value = 15;
        this.bassBoostAmount = 15;
      }
      if (this.bassBoostVal) this.bassBoostVal.textContent = "15%";
      if (this.bassFilterNode && !this.isEqBypassed) this.bassFilterNode.gain.value = 1.2;
      if (this.airExciterSlider) {
        this.airExciterSlider.value = 35;
        this.currentAirExciter = 35;
      }
      if (this.airExciterVal) this.airExciterVal.textContent = "35%";
      if (this.airFilterNode && !this.isEqBypassed) this.airFilterNode.gain.value = 2.1;
    } else if (presetName === "Electronic / EDM") {
      if (this.bassBoostSlider) {
        this.bassBoostSlider.value = 35;
        this.bassBoostAmount = 35;
      }
      if (this.bassBoostVal) this.bassBoostVal.textContent = "35%";
      if (this.bassFilterNode && !this.isEqBypassed) this.bassFilterNode.gain.value = 2.8;
    } else {
      if (this.bassBoostSlider) {
        this.bassBoostSlider.value = 0;
        this.bassBoostAmount = 0;
      }
      if (this.bassBoostVal) this.bassBoostVal.textContent = "0%";
      if (this.bassFilterNode) this.bassFilterNode.gain.value = 0;
    }

    this.updateHeadroomTag();
    this.drawEqResponseCurve();
    this.showToast(`Preset Equalizer: ${presetName}`);
  }

  toggleEqBypass() {
    this.isEqBypassed = !this.isEqBypassed;
    localStorage.setItem("sorafy_eq_bypass", this.isEqBypassed);

    if (this.isEqBypassed) {
      if (this.preampNode) this.preampNode.gain.value = 1.0;
      if (this.eqFilters) this.eqFilters.forEach(f => f.gain.value = 0);
      if (this.bassFilterNode) this.bassFilterNode.gain.value = 0;
      if (this.airFilterNode) this.airFilterNode.gain.value = 0;
      this.showToast("DSP Equalizer di-Bypass (Bit-Perfect Direct Output)");
    } else {
      if (this.preampNode) this.preampNode.gain.value = Math.pow(10, (this.currentPreamp || 0) / 20);
      if (this.eqFilters) {
        this.eqFilters.forEach((f, idx) => {
          f.gain.value = this.currentGains[idx] || 0;
        });
      }
      if (this.bassFilterNode) this.bassFilterNode.gain.value = ((this.bassBoostAmount || 0) / 100) * 8.0;
      if (this.airFilterNode) this.airFilterNode.gain.value = ((this.currentAirExciter || 0) / 100) * 6.0;
      this.showToast("DSP Equalizer Aktif");
    }

    this.updateEqBypassUI();
    this.drawEqResponseCurve();
  }

  updateEqBypassUI() {
    if (!this.eqBypassBtn || !this.eqBypassStatusText) return;
    if (this.isEqBypassed) {
      this.eqBypassBtn.classList.remove("active");
      this.eqBypassStatusText.textContent = "Bypass (Bit-Perfect)";
    } else {
      this.eqBypassBtn.classList.add("active");
      this.eqBypassStatusText.textContent = "Active";
    }
  }

  updateHeadroomTag() {
    if (!this.eqHeadroomTag) return;
    const maxBoost = Math.max(0, ...(this.currentGains || [0]));
    const totalHeadroom = (this.currentPreamp || 0) + maxBoost;
    if (totalHeadroom > 4.0) {
      this.eqHeadroomTag.textContent = "Headroom: Reduce Preamp (-3dB)";
      this.eqHeadroomTag.style.color = "#EF4444";
      this.eqHeadroomTag.style.borderColor = "rgba(239, 68, 68, 0.4)";
    } else if (totalHeadroom > 1.5) {
      this.eqHeadroomTag.textContent = "Headroom: Caution";
      this.eqHeadroomTag.style.color = "#F59E0B";
      this.eqHeadroomTag.style.borderColor = "rgba(245, 158, 11, 0.4)";
    } else {
      this.eqHeadroomTag.textContent = "Headroom: Safe";
      this.eqHeadroomTag.style.color = "#23a55a";
      this.eqHeadroomTag.style.borderColor = "rgba(35, 165, 90, 0.3)";
    }
  }

  startEqAnimationLoop() {
    if (this.eqAnimRunning) return;
    this.eqAnimRunning = true;
    const loop = () => {
      const isEqTabActive = this.settingsModal && 
                            this.settingsModal.style.display !== "none" && 
                            this.activeSettingsTab === "equalizer";
      if (isEqTabActive || this.currentView === "equalizer") {
        this.drawEqResponseCurve();
        requestAnimationFrame(loop);
      } else {
        this.eqAnimRunning = false;
      }
    };
    requestAnimationFrame(loop);
  }

  drawEqResponseCurve() {
    if (!this.eqResponseCanvas) return;
    const canvas = this.eqResponseCanvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = rect.width > 0 ? rect.width : 1000;
    const displayHeight = rect.height > 0 ? rect.height : 190;
    if (canvas.width !== Math.round(displayWidth * dpr) || canvas.height !== Math.round(displayHeight * dpr)) {
      canvas.width = Math.round(displayWidth * dpr);
      canvas.height = Math.round(displayHeight * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const w = displayWidth;
    const h = displayHeight;

    // 1. Sleek studio background
    ctx.fillStyle = "#1e1f22";
    ctx.fillRect(0, 0, w, h);

    const padLeft = 44;
    const padRight = 24;
    const padTop = 14;
    const padBottom = 22;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;

    const minFreq = 20;
    const maxFreq = 20000;
    const minDb = -12;
    const maxDb = 12;

    const freqToX = (f) => padLeft + (Math.log10(f / minFreq) / Math.log10(maxFreq / minFreq)) * plotW;
    const dbToY = (db) => padTop + (1 - (db - minDb) / (maxDb - minDb)) * plotH;

    // 2. Horizontal dB Grid Lines
    const dbLines = [12, 6, 0, -6, -12];
    ctx.lineWidth = 1;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.font = "10px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

    dbLines.forEach(db => {
      const y = dbToY(db);
      ctx.beginPath();
      if (db === 0) {
        ctx.strokeStyle = "rgba(35, 165, 90, 0.35)";
        ctx.setLineDash([4, 4]);
      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.setLineDash([]);
      }
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();

      ctx.fillStyle = db === 0 ? "#23a55a" : "#94a3b8";
      ctx.fillText(`${db > 0 ? '+' : ''}${db} dB`, padLeft - 6, y);
    });
    ctx.setLineDash([]);

    // 3. Vertical Log Frequency Grid Lines
    const gridFreqs = [50, 100, 250, 500, 1000, 2000, 4000, 8000, 16000];
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    gridFreqs.forEach(f => {
      const x = freqToX(f);
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, h - padBottom);
      ctx.stroke();

      const label = f >= 1000 ? `${f / 1000}k` : `${f}`;
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(label, x, h - padBottom + 4);
    });

    // 4. Real-Time FFT Spectrum Analyzer (RTA)
    if (this.analyserNode && this.audio && !this.audio.paused) {
      const binCount = this.analyserNode.frequencyBinCount;
      const freqData = new Uint8Array(binCount);
      this.analyserNode.getByteFrequencyData(freqData);

      const nyquist = (this.audioCtx ? this.audioCtx.sampleRate : 44100) / 2;
      const rtaPoints = 80;
      const rtaGradient = ctx.createLinearGradient(0, padTop, 0, h - padBottom);
      rtaGradient.addColorStop(0, "rgba(35, 165, 90, 0.25)");
      rtaGradient.addColorStop(1, "rgba(35, 165, 90, 0.02)");

      ctx.beginPath();
      ctx.moveTo(padLeft, h - padBottom);
      for (let i = 0; i < rtaPoints; i++) {
        const f = minFreq * Math.pow(maxFreq / minFreq, i / (rtaPoints - 1));
        const binIndex = Math.min(binCount - 1, Math.max(0, Math.round((f / nyquist) * binCount)));
        const magnitude = freqData[binIndex] / 255;
        const x = freqToX(f);
        const y = h - padBottom - (magnitude * plotH * 0.85);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w - padRight, h - padBottom);
      ctx.closePath();
      ctx.fillStyle = rtaGradient;
      ctx.fill();
    }

    // 5. Authentic Biquad Frequency Response Curve
    const numPoints = 140;
    const freqArray = new Float32Array(numPoints);
    for (let i = 0; i < numPoints; i++) {
      freqArray[i] = minFreq * Math.pow(maxFreq / minFreq, i / (numPoints - 1));
    }

    const totalMag = new Float32Array(numPoints).fill(1.0);
    const magOut = new Float32Array(numPoints);
    const phaseOut = new Float32Array(numPoints);

    if (!this.isEqBypassed && this.eqFilters && this.eqFilters.length === 10) {
      try {
        this.eqFilters.forEach(f => {
          f.getFrequencyResponse(freqArray, magOut, phaseOut);
          for (let j = 0; j < numPoints; j++) {
            totalMag[j] *= magOut[j];
          }
        });
        if (this.bassFilterNode && this.bassFilterNode.gain.value !== 0) {
          this.bassFilterNode.getFrequencyResponse(freqArray, magOut, phaseOut);
          for (let j = 0; j < numPoints; j++) {
            totalMag[j] *= magOut[j];
          }
        }
        if (this.airFilterNode && this.airFilterNode.gain.value !== 0) {
          this.airFilterNode.getFrequencyResponse(freqArray, magOut, phaseOut);
          for (let j = 0; j < numPoints; j++) {
            totalMag[j] *= magOut[j];
          }
        }
      } catch (e) {}
    }

    const preampOffset = this.isEqBypassed ? 0 : (this.currentPreamp || 0);

    // Draw Curve Fill & Stroke
    const curvePoints = [];
    for (let i = 0; i < numPoints; i++) {
      const f = freqArray[i];
      let db = this.isEqBypassed ? 0 : (20 * Math.log10(Math.max(1e-6, totalMag[i])) + preampOffset);
      db = Math.max(-14, Math.min(14, db));
      curvePoints.push({ x: freqToX(f), y: dbToY(db) });
    }

    if (curvePoints.length > 0) {
      // Underfill
      const fillGrad = ctx.createLinearGradient(0, padTop, 0, h - padBottom);
      if (this.isEqBypassed) {
        fillGrad.addColorStop(0, "rgba(100, 116, 139, 0.08)");
        fillGrad.addColorStop(1, "rgba(100, 116, 139, 0)");
      } else {
        fillGrad.addColorStop(0, "rgba(35, 165, 90, 0.15)");
        fillGrad.addColorStop(1, "rgba(35, 165, 90, 0)");
      }

      ctx.beginPath();
      ctx.moveTo(curvePoints[0].x, h - padBottom);
      curvePoints.forEach(pt => ctx.lineTo(pt.x, pt.y));
      ctx.lineTo(curvePoints[curvePoints.length - 1].x, h - padBottom);
      ctx.closePath();
      ctx.fillStyle = fillGrad;
      ctx.fill();

      // Spline Stroke
      const strokeGrad = ctx.createLinearGradient(padLeft, 0, w - padRight, 0);
      if (this.isEqBypassed) {
        strokeGrad.addColorStop(0, "#64748B");
        strokeGrad.addColorStop(1, "#94A3B8");
      } else {
        strokeGrad.addColorStop(0, "#23a55a");
        strokeGrad.addColorStop(1, "#2dc770");
      }

      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = strokeGrad;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
      for (let i = 1; i < curvePoints.length; i++) {
        const prev = curvePoints[i - 1];
        const cur = curvePoints[i];
        const midX = (prev.x + cur.x) / 2;
        const midY = (prev.y + cur.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }
      ctx.lineTo(curvePoints[curvePoints.length - 1].x, curvePoints[curvePoints.length - 1].y);
      ctx.stroke();

      // Band Nodes
      if (!this.isEqBypassed) {
        EQ_FREQUENCIES.forEach((freq, idx) => {
          const x = freqToX(freq);
          const rawDb = (this.currentGains[idx] || 0) + preampOffset;
          const y = dbToY(Math.max(-13, Math.min(13, rawDb)));

          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#23a55a";
          ctx.stroke();
        });
      }
    }

    // 6. Watermark Badge if Bit-Perfect Bypass is Active
    if (this.isEqBypassed) {
      ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
      ctx.font = "700 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("BIT-PERFECT BYPASS ACTIVE (DIRECT UNPROCESSED AUDIO)", w / 2, h / 2);
    }

    ctx.restore();
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
      const isEnabled = plugin.is_enabled !== false;
      const card = document.createElement("div");
      card.className = `plugin-card ${isEnabled ? '' : 'disabled'}`;
      card.id = `plugin_card_${plugin.id}`;

      card.innerHTML = `
        <div class="plugin-header">
          <div class="plugin-info">
            <div class="plugin-icon-box">${plugin.icon || '<iconsax-icon name="box" type="bold" size="22" color="#b5bac1"></iconsax-icon>'}</div>
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
          <span class="plugin-status-text ${isEnabled ? 'active' : 'disabled'}" id="status_${plugin.id}">
            ${isEnabled ? '● Active' : '○ Inactive'}
          </span>
          <label class="toggle-switch">
            <input type="checkbox" ${isEnabled ? 'checked' : ''} id="toggle_${plugin.id}">
            <span class="toggle-slider"></span>
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
      status.className = `plugin-status-text ${isEnabled ? 'active' : 'disabled'}`;
    }

    await invokeTauri("toggle_plugin", { id, enabled: isEnabled });
    this.showToast(`${plugin ? plugin.name : id}: ${isEnabled ? 'Enabled' : 'Disabled'}`);
  }

  // =========================================================
  // Universal Importer & Platform Integrations (Spotify, Apple Music, YT Music)
  // =========================================================
  async handleUniversalLinkImport(url) {
    return this.handleUnifiedImport(url);
  }

  async handleUnifiedImport(overrideUrl = null) {
    const url = (overrideUrl || this.unifiedImportUrlInput?.value || "").trim();
    if (!url) {
      this.showToast(this.currentLanguage === "id" ? "Silakan masukkan tautan playlist, album, atau lagu." : "Please enter a playlist, album, or track link first.");
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
        this.unifiedImportStatusText.textContent = `Connecting & extracting metadata...`;
      }
    }

    try {
      this.showToast(this.currentLanguage === "id" ? "Menghubungkan ke penyedia & mengekstrak metadata..." : "Connecting & extracting metadata...");
      const res = await window.electronAPI.importExternalPlaylist(url);
      if (!res || !res.success || !res.tracks || res.tracks.length === 0) {
        throw new Error(res?.error || "No tracks found from the provided link.");
      }

      // Single track instant playback (e.g. Spotify Track URL pasted)
      if (res.type === 'track' && res.tracks && res.tracks.length) {
        const track = res.tracks[0];
        this.tracks = [track];
        this.currentTrackIndex = 0;
        this.loadTrack(0, true);
        if (this.unifiedImportModal) this.unifiedImportModal.style.display = "none";
        if (this.unifiedImportUrlInput) this.unifiedImportUrlInput.value = "";
        if (this.spotifyLinkBanner) this.spotifyLinkBanner.style.display = "none";
        this.showToast(this.currentLanguage === "id" ? `Memutar track Spotify: "${track.title}" oleh ${track.artist}` : `Playing Spotify track: "${track.title}" by ${track.artist}`);
        return;
      }

      const playlistTitle = res.title || `Imported ${res.provider || 'Music'}`;
      const newPlaylist = {
        id: `pl_imp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: playlistTitle,
        title: playlistTitle,
        author: `Imported ${res.provider || 'Spotify'}`,
        description: `Imported from ${res.provider} (${res.tracks.length} tracks). High-fidelity audio playback.`,
        artwork_url: res.artwork_url || res.tracks[0]?.artwork_url || this.DEFAULT_TRACK_ART,
        tracks: res.tracks,
        track_count: `${res.tracks.length} Tracks`,
        createdAt: Date.now()
      };

      this.userPlaylists.unshift(newPlaylist);
      this.saveUserPlaylists();
      this.renderUserPlaylists();

      if (this.unifiedImportModal) this.unifiedImportModal.style.display = "none";
      if (this.unifiedImportUrlInput) this.unifiedImportUrlInput.value = "";
      if (this.spotifyLinkBanner) this.spotifyLinkBanner.style.display = "none";
      this.showToast(this.currentLanguage === "id" ? `Berhasil mengimpor "${playlistTitle}" (${res.tracks.length} lagu)!` : `Successfully imported "${playlistTitle}" (${res.tracks.length} tracks)!`);

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
        if (window.electronAPI && typeof window.electronAPI.getDownloadedTracks === 'function') {
          const dlTracks = await window.electronAPI.getDownloadedTracks();
          this.downloadedTracks = Array.isArray(dlTracks) ? dlTracks : [];
          this.renderUserPlaylists();
          if (this.currentView === "playlist" && this.currentPlaylist?.is_special === "downloads") {
            this.openDownloadedSongsView();
          }
          if (this.currentCustomView === "downloads") {
            this.showDownloadedSongs();
          }
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
  // 1-Click Offline Playlist Downloader (Batch in ~/Music/SoraFy)
  // =========================================================
  async downloadCurrentPlaylist() {
    const playlist = this.currentPlaylist;
    if (!playlist) return;
    const tracks = playlist.tracks || [];
    if (!tracks.length) {
      this.showToast(this.currentLanguage === "id" ? "Tidak ada lagu untuk diunduh di playlist ini." : "No tracks in this playlist to download.");
      return;
    }

    if (!window.electronAPI || typeof window.electronAPI.downloadPlaylistBatch !== 'function') {
      this.showToast("Batch downloads are only available on SoraFy desktop app.");
      return;
    }

    if (this._isDownloadingPlaylist) {
      this.showToast(this.currentLanguage === "id" ? "Pengunduhan playlist sedang berjalan..." : "Playlist download is already in progress...");
      return;
    }

    this._isDownloadingPlaylist = true;
    this.updatePlaylistDownloadButtonState(true, `0/${tracks.length} (0%)`);
    this.showToast(this.currentLanguage === "id"
      ? `Mulai mengunduh playlist "${playlist.title}" (${tracks.length} lagu)...`
      : `Starting download of playlist "${playlist.title}" (${tracks.length} tracks)...`);

    try {
      const res = await window.electronAPI.downloadPlaylistBatch({
        playlistName: playlist.title,
        tracks: tracks
      });

      if (res && res.success) {
        this.showToast(this.currentLanguage === "id"
          ? `Unduhan selesai: ${res.downloaded} diunduh, ${res.skipped} sudah ada.`
          : `Download completed: ${res.downloaded} downloaded, ${res.skipped} already saved.`);
        if (typeof window.electronAPI.getDownloadedTracks === 'function') {
          const dlTracks = await window.electronAPI.getDownloadedTracks();
          this.downloadedTracks = Array.isArray(dlTracks) ? dlTracks : [];
          this.renderUserPlaylists();
        }
      } else {
        this.showToast(`Batch download failed: ${res?.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Batch download error:", err);
      this.showToast(`Batch download failed: ${err.message}`);
    } finally {
      this._isDownloadingPlaylist = false;
      this.updatePlaylistDownloadButtonState(false);
    }
  }

  updatePlaylistDownloadButtonState(isDownloading, progressText = '') {
    if (!this.playlistDownloadAllBtn) return;
    const label = this.playlistDownloadAllLabel || this.playlistDownloadAllBtn.querySelector("span");
    if (isDownloading) {
      this.playlistDownloadAllBtn.classList.add("loading");
      this.playlistDownloadAllBtn.disabled = true;
      if (label) label.textContent = progressText ? `Downloading (${progressText})` : "Downloading...";
    } else {
      this.playlistDownloadAllBtn.classList.remove("loading");
      this.playlistDownloadAllBtn.disabled = false;
      if (label) label.textContent = this.currentLanguage === "id" ? "Unduh Playlist" : "Download";
    }
  }

  handleDownloadPlaylistProgress(progress) {
    if (!progress) return;
    if (progress.status === 'completed') {
      this.updatePlaylistDownloadButtonState(false);
    } else if (this._isDownloadingPlaylist) {
      const text = `${progress.current}/${progress.total} (${progress.percentage}%)`;
      this.updatePlaylistDownloadButtonState(true, text);
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
          this.renderUserPlaylists();
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
    this.renderUserPlaylists();

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

  // =========================================================
  // Stream Verification & Multi-Candidate Stream Picker (Nuclear Feature)
  // =========================================================
  async updateVerificationBadge(track) {
    if (!track) return;
    try {
      if (window.electronAPI && typeof window.electronAPI.getVerifiedStream === "function") {
        const verified = await window.electronAPI.getVerifiedStream({
          title: track.title,
          artist: track.artist
        });
        const isVerified = Boolean(verified && verified.verifiedId);
        if (this.verifyStreamBtn) {
          this.verifyStreamBtn.classList.toggle("verified", isVerified);
          this.verifyStreamBtn.title = isVerified
            ? (this.currentLanguage === 'id' ? `Terverifikasi (Kunci Audio: ${verified.metadata?.channel || verified.verifiedId})` : `Verified Stream (${verified.metadata?.channel || verified.verifiedId})`)
            : (this.currentLanguage === 'id' ? "Verifikasi Sumber Audio (Pilih Rekaman)" : "Check / Verify Audio Stream");
        }
        if (this.screenVerifyStreamBtn) {
          this.screenVerifyStreamBtn.classList.toggle("verified", isVerified);
          this.screenVerifyStreamBtn.title = this.verifyStreamBtn ? this.verifyStreamBtn.title : "Verify Audio";
        }
      }
    } catch (_) {}
  }

  async openStreamCandidatesModal(track) {
    if (!track || !this.streamCandidatesModal) return;
    this.candidateActiveTrack = track;
    this.streamCandidatesModal.style.display = "flex";

    if (this.streamCandidatesSubtitle) {
      this.streamCandidatesSubtitle.textContent = `${track.title} • ${track.artist || 'Unknown Artist'}`;
    }

    if (this.streamCandidatesLoading) this.streamCandidatesLoading.style.display = "flex";
    if (this.streamCandidatesList) this.streamCandidatesList.innerHTML = "";
    if (this.streamCandidatesStatusNotice) this.streamCandidatesStatusNotice.style.display = "none";
    if (this.unverifyStreamBtn) this.unverifyStreamBtn.style.display = "none";

    try {
      // 1. Check verified state
      let verified = null;
      if (window.electronAPI && typeof window.electronAPI.getVerifiedStream === "function") {
        verified = await window.electronAPI.getVerifiedStream({
          title: track.title,
          artist: track.artist
        });
      }

      if (this.streamCandidatesStatusNotice) {
        this.streamCandidatesStatusNotice.style.display = "flex";
        if (verified && verified.verifiedId) {
          this.streamCandidatesStatusNotice.className = "stream-status-notice verified";
          this.streamCandidatesStatusNotice.innerHTML = `
            <iconsax-icon name="shield-tick" type="bold" size="18" color="#00E599"></iconsax-icon>
            <div><strong>Terkunci & Terverifikasi:</strong> Rekaman oleh <em>${this.escapeHtml(verified.metadata?.channel || verified.artist || 'Official')}</em> dikunci sebagai sumber utama lagu ini.</div>
          `;
          if (this.unverifyStreamBtn) this.unverifyStreamBtn.style.display = "inline-flex";
        } else {
          this.streamCandidatesStatusNotice.className = "stream-status-notice unverified";
          this.streamCandidatesStatusNotice.innerHTML = `
            <iconsax-icon name="info-circle" type="linear" size="18" color="currentColor"></iconsax-icon>
            <div>Lagu ini menggunakan pencarian otomatis. Pilih rekaman resmi di bawah ini untuk mengunci sumber audio yang benar.</div>
          `;
          if (this.unverifyStreamBtn) this.unverifyStreamBtn.style.display = "none";
        }
      }

      // 2. Query candidates
      const currentVid = track.video_id || (track.id && track.id.startsWith("yt_") ? track.id.replace(/^yt_/, "") : track.id);
      let candidates = [];
      if (window.electronAPI && typeof window.electronAPI.getStreamCandidates === "function") {
        candidates = await window.electronAPI.getStreamCandidates({
          title: track.title,
          artist: track.artist,
          currentId: currentVid
        });
      }

      if (this.streamCandidatesLoading) this.streamCandidatesLoading.style.display = "none";

      if (!candidates || candidates.length === 0) {
        if (this.streamCandidatesList) {
          this.streamCandidatesList.innerHTML = `
            <div style="text-align: center; padding: 32px 16px; color: var(--color-text-tertiary); font-size: 13px;">
              Tidak ada kandidat alternatif yang ditemukan untuk lagu ini.
            </div>
          `;
        }
        return;
      }

      if (this.streamCandidatesList) {
        this.streamCandidatesList.innerHTML = "";
        candidates.forEach(c => {
          const item = document.createElement("div");
          item.className = "stream-candidate-item";
          if (c.isCurrent) item.classList.add("is-current");
          if (c.isVerified) item.classList.add("is-verified");

          const tagHtml = c.isVerified
            ? '<span class="candidate-tag verified">✓ Terverifikasi</span>'
            : (c.isCurrent ? '<span class="candidate-tag current">Sedang Diputar</span>' : `<span class="candidate-tag">${c.type === 'video' ? 'Video' : 'Lagu'}</span>`);

          item.innerHTML = `
            <img src="${c.artwork || this.DEFAULT_TRACK_ART}" class="candidate-art" alt="${this.escapeHtml(c.title)}" onerror="this.src='${this.DEFAULT_TRACK_ART}'">
            <div class="candidate-info">
              <div class="candidate-title" title="${this.escapeHtml(c.title)}">${this.escapeHtml(c.title)}</div>
              <div class="candidate-meta">
                <span>${this.escapeHtml(c.artist || 'Artist')}</span>
                <span>•</span>
                <span>${c.duration || '--:--'}</span>
                ${tagHtml}
              </div>
            </div>
            <div class="candidate-actions">
              ${c.isVerified
                ? '<button class="candidate-btn active-verified" disabled>✓ Terkunci</button>'
                : `<button class="candidate-btn btn-pick-candidate" data-vid="${c.videoId}">${c.isCurrent ? 'Kunci Sumber Ini' : 'Pilih & Kunci'}</button>`
              }
            </div>
          `;

          const pickBtn = item.querySelector(".btn-pick-candidate");
          if (pickBtn) {
            pickBtn.addEventListener("click", async (e) => {
              e.stopPropagation();
              pickBtn.textContent = "Mengunci...";
              pickBtn.disabled = true;

              if (window.electronAPI && typeof window.electronAPI.verifyStreamCandidate === "function") {
                await window.electronAPI.verifyStreamCandidate({
                  title: track.title,
                  artist: track.artist,
                  candidateId: c.videoId,
                  metadata: {
                    duration: c.duration,
                    channel: c.artist,
                    artwork: c.artwork
                  }
                });

                track.video_id = c.videoId;
                track.artwork_url = c.artwork || track.artwork_url;
                if (c.durationSec && c.durationSec > 0) {
                  track.duration_secs = c.durationSec;
                }

                // If currently playing track, reload immediately to play verified audio
                const isCurrentPlaying = (this.tracks[this.currentTrackIndex]?.id === track.id || this.tracks[this.currentTrackIndex]?.title === track.title);
                if (isCurrentPlaying) {
                  this.loadTrack(this.currentTrackIndex, true, this.audio?.currentTime || 0);
                }

                this.showToast(`Sumber audio dikunci: ${c.title}`);
                this.updateVerificationBadge(track);
                if (this.streamCandidatesModal) this.streamCandidatesModal.style.display = "none";
              }
            });
          }

          this.streamCandidatesList.appendChild(item);
        });
      }
    } catch (err) {
      if (this.streamCandidatesLoading) this.streamCandidatesLoading.style.display = "none";
      if (this.streamCandidatesList) {
        this.streamCandidatesList.innerHTML = `
          <div style="text-align: center; padding: 24px; color: #FF6B6B; font-size: 13px;">
            Gagal mengambil kandidat audio: ${this.escapeHtml(err.message)}
          </div>
        `;
      }
    }
  }

  // =========================================================
  // SoraFy Jam: State Synchronization & QR Modal
  // =========================================================
  syncJamState() {
    if (!window.electronAPI || typeof window.electronAPI.sendJamState !== 'function') return;
    const cur = this.tracks ? this.tracks[this.currentTrackIndex] : null;
    const lrc = (this.currentLyrics || []).map(l => ({
      text: l.text || '',
      time: typeof l.timestamp_ms === 'number' ? l.timestamp_ms : (l.time || -1)
    }));
    window.electronAPI.sendJamState({
      isPlaying: this.audio ? !this.audio.paused : false,
      currentTime: this.audio ? this.audio.currentTime : 0,
      duration: this.audio && this.audio.duration ? this.audio.duration : (cur?.duration_secs || 0),
      currentTrack: cur,
      queue: this.tracks || [],
      lyrics: lrc,
      volume: this.audio ? this.audio.volume : 0.85,
      isShuffle: Boolean(this.isShuffled),
      repeatMode: this.repeatMode || 'off'
    });
  }

  // =========================================================
  // Listening Statistics & Analytics Engine (Nuclear Feature 5)
  // =========================================================
  initStatsEvents() {
    if (this.statsTimeFilterPills) {
      const pills = this.statsTimeFilterPills.querySelectorAll(".stats-pill");
      pills.forEach((pill) => {
        pill.addEventListener("click", () => {
          pills.forEach((p) => p.classList.remove("active"));
          pill.classList.add("active");
          this.currentStatsRange = pill.dataset.range || "all";
          this.renderStatsView();
        });
      });
    }

    if (this.statsClearHistoryBtn) {
      this.statsClearHistoryBtn.addEventListener("click", async () => {
        const isId = (this.currentLanguage === "id");
        const confirmMsg = isId
          ? "Apakah Anda yakin ingin menghapus seluruh riwayat analitik mendengar?"
          : "Are you sure you want to clear your listening history and analytics?";
        if (!confirm(confirmMsg)) return;
        if (window.electronAPI && typeof window.electronAPI.clearListeningStats === "function") {
          await window.electronAPI.clearListeningStats();
          this.showToast(isId ? "Riwayat analitik berhasil dibersihkan" : "Listening analytics cleared successfully");
          this.renderStatsView();
        }
      });
    }
  }

  async recordListenEvent(track, totalSec, currentSec) {
    if (!window.electronAPI || typeof window.electronAPI.recordListenEvent !== "function") return;
    try {
      await window.electronAPI.recordListenEvent({
        trackId: track.video_id || track.id || "",
        title: track.title || "Unknown Title",
        artist: track.artist || "Unknown Artist",
        album: track.album || "",
        artworkUrl: track.artwork_url || "",
        durationSeconds: Math.round(totalSec || 0),
        secondsListened: Math.round(currentSec || 0),
        timestamp: Date.now()
      });
    } catch (err) {
      console.warn("recordListenEvent note:", err);
    }
  }

  async renderStatsView() {
    if (!this.statsViewContainer || !window.electronAPI || typeof window.electronAPI.getListeningStats !== "function") return;
    try {
      const res = await window.electronAPI.getListeningStats();
      const allEvents = (res && res.success && Array.isArray(res.events)) ? res.events : [];
      const isId = (this.currentLanguage === "id");

      // Filter based on selected time range
      const now = Date.now();
      let filteredEvents = allEvents;
      if (this.currentStatsRange === "7d") {
        filteredEvents = allEvents.filter(e => e.timestamp >= now - 7 * 86400000);
      } else if (this.currentStatsRange === "30d") {
        filteredEvents = allEvents.filter(e => e.timestamp >= now - 30 * 86400000);
      } else if (this.currentStatsRange === "1y") {
        filteredEvents = allEvents.filter(e => e.timestamp >= now - 365 * 86400000);
      }

      // Calculate Metrics & Time-of-Day Habits
      let totalSeconds = 0;
      const artistsMap = new Map();
      const tracksMap = new Map();
      const timeOfDayCounts = {
        morning: { count: 0, seconds: 0 },   // 06:00 - 12:00
        afternoon: { count: 0, seconds: 0 }, // 12:00 - 17:00
        evening: { count: 0, seconds: 0 },   // 17:00 - 21:00
        night: { count: 0, seconds: 0 }      // 21:00 - 06:00
      };

      filteredEvents.forEach((e) => {
        const secs = (e.durationSeconds && e.durationSeconds > 0) ? e.durationSeconds : (e.secondsListened || 180);
        totalSeconds += secs;

        const art = (e.artist || "Unknown Artist").trim();
        if (art) {
          const prev = artistsMap.get(art) || { count: 0, seconds: 0, artwork: e.artworkUrl };
          prev.count += 1;
          prev.seconds += secs;
          if (!prev.artwork && e.artworkUrl) prev.artwork = e.artworkUrl;
          artistsMap.set(art, prev);
        }

        const trackKey = `${(e.title || "Unknown").trim().toLowerCase()}:::${art.toLowerCase()}`;
        const prevTrack = tracksMap.get(trackKey) || {
          trackId: e.trackId,
          title: e.title || "Unknown Title",
          artist: art,
          artworkUrl: e.artworkUrl,
          count: 0,
          seconds: 0
        };
        prevTrack.count += 1;
        prevTrack.seconds += secs;
        if (!prevTrack.artworkUrl && e.artworkUrl) prevTrack.artworkUrl = e.artworkUrl;
        tracksMap.set(trackKey, prevTrack);

        const d = new Date(e.timestamp);
        const h = d.getHours();
        if (h >= 6 && h < 12) {
          timeOfDayCounts.morning.count += 1;
          timeOfDayCounts.morning.seconds += secs;
        } else if (h >= 12 && h < 17) {
          timeOfDayCounts.afternoon.count += 1;
          timeOfDayCounts.afternoon.seconds += secs;
        } else if (h >= 17 && h < 21) {
          timeOfDayCounts.evening.count += 1;
          timeOfDayCounts.evening.seconds += secs;
        } else {
          timeOfDayCounts.night.count += 1;
          timeOfDayCounts.night.seconds += secs;
        }
      });

      // Sorted artists & tracks
      const sortedArtists = Array.from(artistsMap.entries())
        .map(([name, data]) => ({ name, count: data.count, seconds: data.seconds, artwork: data.artwork }))
        .sort((a, b) => b.count - a.count);

      const sortedTracks = Array.from(tracksMap.values())
        .sort((a, b) => b.count - a.count);

      // --- SPOTLIGHT 1: Top Artist (#1) ---
      const topArtist = sortedArtists[0];
      if (this.statsTopArtistCard) {
        if (topArtist) {
          const avatar = topArtist.artwork || getArtistAvatar(topArtist.name);
          if (this.statsTopArtistImg) this.statsTopArtistImg.src = avatar;
          if (this.statsTopArtistName) this.statsTopArtistName.textContent = topArtist.name;
          if (this.statsTopArtistMeta) {
            const mins = Math.round(topArtist.seconds / 60);
            this.statsTopArtistMeta.textContent = isId
              ? `${topArtist.count} putaran • ${mins} menit`
              : `${topArtist.count} plays • ${mins} mins`;
          }
          this.statsTopArtistCard.style.cursor = "pointer";
          this.statsTopArtistCard.onclick = () => this.openArtistDetail(topArtist.name);
        } else {
          if (this.statsTopArtistImg) this.statsTopArtistImg.src = "assets/logo.png";
          if (this.statsTopArtistName) this.statsTopArtistName.textContent = isId ? "Belum ada artis" : "No artists yet";
          if (this.statsTopArtistMeta) this.statsTopArtistMeta.textContent = isId ? "0 putaran • 0 menit" : "0 plays • 0 mins";
          this.statsTopArtistCard.onclick = null;
          this.statsTopArtistCard.style.cursor = "default";
        }
      }

      // --- SPOTLIGHT 2: Top Track (#1) ---
      const topTrack = sortedTracks[0];
      if (this.statsTopTrackCard) {
        if (topTrack) {
          const art = topTrack.artworkUrl || "assets/logo.png";
          if (this.statsTopTrackImg) this.statsTopTrackImg.src = art;
          if (this.statsTopTrackTitle) this.statsTopTrackTitle.textContent = topTrack.title;
          if (this.statsTopTrackMeta) {
            this.statsTopTrackMeta.textContent = isId
              ? `${topTrack.artist} • ${topTrack.count} putaran`
              : `${topTrack.artist} • ${topTrack.count} plays`;
          }
          this.statsTopTrackCard.style.cursor = "pointer";
          this.statsTopTrackCard.onclick = () => {
            const trackObj = {
              id: topTrack.trackId ? (topTrack.trackId.startsWith("yt_") ? topTrack.trackId : `yt_${topTrack.trackId}`) : `yt_${Date.now()}`,
              video_id: topTrack.trackId ? topTrack.trackId.replace(/^yt_/, "") : "",
              title: topTrack.title,
              artist: topTrack.artist,
              artwork_url: topTrack.artworkUrl || "assets/logo.png",
              duration_secs: topTrack.seconds || 180
            };
            this.playTrackNow(trackObj);
          };
        } else {
          if (this.statsTopTrackImg) this.statsTopTrackImg.src = "assets/logo.png";
          if (this.statsTopTrackTitle) this.statsTopTrackTitle.textContent = isId ? "Belum ada lagu" : "No tracks yet";
          if (this.statsTopTrackMeta) this.statsTopTrackMeta.textContent = isId ? "0 putaran" : "0 plays";
          this.statsTopTrackCard.onclick = null;
          this.statsTopTrackCard.style.cursor = "default";
        }
      }

      // --- SPOTLIGHT 3: Listening Personality / Time Vibe ---
      if (this.statsVibeCard) {
        let maxPeriod = "";
        let maxPeriodCount = 0;
        Object.entries(timeOfDayCounts).forEach(([period, data]) => {
          if (data.count > maxPeriodCount) {
            maxPeriodCount = data.count;
            maxPeriod = period;
          }
        });

        if (maxPeriodCount === 0) {
          if (this.statsVibeEmoji) this.statsVibeEmoji.textContent = "🎧";
          if (this.statsVibeTitle) this.statsVibeTitle.textContent = isId ? "Penjelajah Nada" : "Music Explorer";
          if (this.statsVibeDesc) this.statsVibeDesc.textContent = isId
            ? "Putar lebih banyak lagu untuk melihat profil karakter kebiasaan Anda."
            : "Stream more songs to unveil your unique listening habit persona.";
        } else if (maxPeriod === "morning") {
          if (this.statsVibeEmoji) this.statsVibeEmoji.textContent = "🌅";
          if (this.statsVibeTitle) this.statsVibeTitle.textContent = isId ? "Penyemangat Pagi" : "Morning Motivator";
          if (this.statsVibeDesc) this.statsVibeDesc.textContent = isId
            ? "Mendengarkan lagu di pagi hari adalah ritual harian favorit Anda."
            : "Starting your morning with vibrant tunes is your signature ritual.";
        } else if (maxPeriod === "afternoon") {
          if (this.statsVibeEmoji) this.statsVibeEmoji.textContent = "☀️";
          if (this.statsVibeTitle) this.statsVibeTitle.textContent = isId ? "Fokus Siang Hari" : "Afternoon Focus";
          if (this.statsVibeDesc) this.statsVibeDesc.textContent = isId
            ? "Musik menemani produktivitas dan momen konsentrasi di tengah hari."
            : "Music fuels your productivity and focus throughout the busy day.";
        } else if (maxPeriod === "evening") {
          if (this.statsVibeEmoji) this.statsVibeEmoji.textContent = "🌆";
          if (this.statsVibeTitle) this.statsVibeTitle.textContent = isId ? "Pelepas Penat Sore" : "Sunset Unwind";
          if (this.statsVibeDesc) this.statsVibeDesc.textContent = isId
            ? "Sore hari adalah momen terbaik Anda untuk bersantai dan relaksasi."
            : "Late afternoon chill sessions help you unwind after a long day.";
        } else {
          if (this.statsVibeEmoji) this.statsVibeEmoji.textContent = "🌙";
          if (this.statsVibeTitle) this.statsVibeTitle.textContent = isId ? "Penikmat Larut Malam" : "Midnight Dreamer";
          if (this.statsVibeDesc) this.statsVibeDesc.textContent = isId
            ? "Menikmati harmoni musik di saat malam hening dan damai."
            : "Immersed in deep, serene melodies under the peaceful midnight sky.";
        }
      }

      // --- 4 METRIC CARDS ---
      // 1. Total Time
      if (this.statsTotalTime) {
        const totalMinutes = Math.round(totalSeconds / 60);
        if (totalMinutes < 60) {
          this.statsTotalTime.textContent = isId ? `${totalMinutes} Menit` : `${totalMinutes} Mins`;
        } else {
          const hours = Math.floor(totalMinutes / 60);
          const mins = totalMinutes % 60;
          this.statsTotalTime.textContent = isId ? `${hours} Jam ${mins} Menit` : `${hours}h ${mins}m`;
        }
      }

      // 2. Total Tracks
      if (this.statsTotalTracks) {
        this.statsTotalTracks.textContent = isId
          ? `${filteredEvents.length} Putaran`
          : `${filteredEvents.length} Plays`;
      }

      // 3. Unique Artists
      if (this.statsUniqueArtists) {
        this.statsUniqueArtists.textContent = isId
          ? `${artistsMap.size} Artis`
          : `${artistsMap.size} Artists`;
      }

      // 4. Daily Average
      if (this.statsDailyAvg) {
        let daysCount = 7;
        if (this.currentStatsRange === "30d") daysCount = 30;
        else if (this.currentStatsRange === "1y") daysCount = 365;
        else if (this.currentStatsRange === "all") {
          if (filteredEvents.length > 0) {
            const earliest = Math.min(...filteredEvents.map(e => e.timestamp || Date.now()));
            daysCount = Math.max(1, Math.ceil((Date.now() - earliest) / 86400000));
          } else {
            daysCount = 1;
          }
        }
        const totalMins = Math.round(totalSeconds / 60);
        const avg = Math.round(totalMins / daysCount);
        this.statsDailyAvg.textContent = isId ? `${avg} Menit / Hari` : `${avg} Mins / Day`;
      }

      // Render Sub-components
      this.renderActivityBars(allEvents, filteredEvents);
      this.renderDaySegments(timeOfDayCounts, filteredEvents.length);
      this.renderRankings(artistsMap, tracksMap);
      this.renderRecentScrobbles(allEvents);
    } catch (err) {
      console.warn("renderStatsView note:", err);
    }
  }

  renderActivityBars(allEvents, filteredEvents) {
    if (!this.statsActivityBars) return;
    this.statsActivityBars.innerHTML = "";
    const isId = (this.currentLanguage === "id");

    const daysId = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const daysEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const fullDaysId = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const fullDaysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNamesId = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const monthNamesEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Build map for each calendar date: YYYY-MM-DD -> { minutes, count }
    const dayMap = new Map();
    filteredEvents.forEach((e) => {
      const d = new Date(e.timestamp);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const m = Math.round(((e.durationSeconds && e.durationSeconds > 0) ? e.durationSeconds : (e.secondsListened || 180)) / 60);
      const prev = dayMap.get(k) || { minutes: 0, count: 0 };
      prev.minutes += m;
      prev.count += 1;
      dayMap.set(k, prev);
    });

    // 7 Days: from 6 days ago up to today
    const daysData = [];
    let maxMinutes = 1;
    let peakDayInfo = null;

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const stats = dayMap.get(key) || { minutes: 0, count: 0 };
      if (stats.minutes > maxMinutes) {
        maxMinutes = stats.minutes;
      }
      const dayIdx = d.getDay();
      const monthIdx = d.getMonth();
      const dayName = isId ? daysId[dayIdx] : daysEn[dayIdx];
      const fullDayName = isId ? fullDaysId[dayIdx] : fullDaysEn[dayIdx];
      const dateStr = `${d.getDate()} ${isId ? monthNamesId[monthIdx] : monthNamesEn[monthIdx]}`;

      daysData.push({
        date: d,
        key,
        dayName,
        fullDayName,
        dateStr,
        minutes: stats.minutes,
        count: stats.count
      });
    }

    // Find peak day
    let peakMinutes = 0;
    daysData.forEach((item) => {
      if (item.minutes > peakMinutes) {
        peakMinutes = item.minutes;
        peakDayInfo = item;
      }
    });

    // Update peak day badge
    if (this.statsPeakDayBadge) {
      if (peakDayInfo && peakDayInfo.minutes > 0) {
        this.statsPeakDayBadge.innerHTML = `<span>⭐ ${isId ? 'Hari Teraktif' : 'Peak Day'}: ${peakDayInfo.fullDayName} (${peakDayInfo.minutes} ${isId ? 'Menit' : 'Mins'})</span>`;
      } else {
        this.statsPeakDayBadge.innerHTML = `<span>${isId ? 'Hari Teraktif: Belum ada data' : 'Peak Day: No data yet'}</span>`;
      }
    }

    // Floating Tooltip
    let tooltip = document.getElementById("statsFloatingTooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "statsFloatingTooltip";
      tooltip.className = "stats-floating-tooltip";
      document.body.appendChild(tooltip);
    }

    // Render 7 equalizer bars
    daysData.forEach((item) => {
      const isPeak = (peakDayInfo && item.key === peakDayInfo.key && item.minutes > 0);
      const heightPct = item.minutes > 0 ? Math.max(10, Math.round((item.minutes / maxMinutes) * 100)) : 8;

      const col = document.createElement("div");
      col.className = "activity-bar-col";

      const val = document.createElement("span");
      val.className = "activity-bar-val";
      val.textContent = item.minutes > 0 ? `${item.minutes}m` : "0";

      const track = document.createElement("div");
      track.className = "activity-bar-track";

      const fill = document.createElement("div");
      fill.className = `activity-bar-fill ${isPeak ? 'peak' : ''}`;
      fill.style.height = `${heightPct}%`;

      track.appendChild(fill);

      const label = document.createElement("span");
      label.className = "activity-bar-label";
      label.textContent = item.dayName;

      const dateSub = document.createElement("span");
      dateSub.className = "activity-bar-date";
      dateSub.textContent = item.dateStr;

      col.appendChild(val);
      col.appendChild(track);
      col.appendChild(label);
      col.appendChild(dateSub);

      col.addEventListener("mouseenter", (e) => {
        if (!tooltip) return;
        const msg = isId
          ? `<strong>${item.fullDayName}, ${item.dateStr}</strong><br>${item.minutes} menit (${item.count} lagu diputar)`
          : `<strong>${item.fullDayName}, ${item.dateStr}</strong><br>${item.minutes} minutes (${item.count} tracks played)`;
        tooltip.innerHTML = msg;
        tooltip.style.display = "block";
        tooltip.style.left = `${e.clientX + 12}px`;
        tooltip.style.top = `${e.clientY - 30}px`;
      });

      col.addEventListener("mousemove", (e) => {
        if (!tooltip) return;
        tooltip.style.left = `${e.clientX + 12}px`;
        tooltip.style.top = `${e.clientY - 30}px`;
      });

      col.addEventListener("mouseleave", () => {
        if (tooltip) tooltip.style.display = "none";
      });

      this.statsActivityBars.appendChild(col);
    });
  }

  renderDaySegments(timeOfDayCounts, totalTracks) {
    if (!this.statsDaySegmentsGrid) return;
    this.statsDaySegmentsGrid.innerHTML = "";
    const isId = (this.currentLanguage === "id");

    const segments = [
      {
        key: "morning",
        icon: "🌅",
        title: isId ? "Pagi Hari" : "Morning",
        hours: "06:00 - 12:00",
        data: timeOfDayCounts.morning
      },
      {
        key: "afternoon",
        icon: "☀️",
        title: isId ? "Siang Hari" : "Afternoon",
        hours: "12:00 - 17:00",
        data: timeOfDayCounts.afternoon
      },
      {
        key: "evening",
        icon: "🌆",
        title: isId ? "Sore Hari" : "Evening",
        hours: "17:00 - 21:00",
        data: timeOfDayCounts.evening
      },
      {
        key: "night",
        icon: "🌙",
        title: isId ? "Larut Malam" : "Late Night",
        hours: "21:00 - 06:00",
        data: timeOfDayCounts.night
      }
    ];

    segments.forEach((seg) => {
      const pct = (totalTracks > 0) ? Math.round((seg.data.count / totalTracks) * 100) : 0;
      const mins = Math.round(seg.data.seconds / 60);

      const card = document.createElement("div");
      card.className = "day-segment-card";

      card.innerHTML = `
        <div class="day-segment-header">
          <div class="day-segment-title">
            <span>${seg.icon}</span>
            <span>${seg.title}</span>
          </div>
          <span class="day-segment-badge">${pct}%</span>
        </div>
        <div class="day-segment-progress">
          <div class="day-segment-progress-fill" style="width: ${pct}%;"></div>
        </div>
        <div class="day-segment-meta">
          <span>${seg.hours}</span>
          <span>${seg.data.count} ${isId ? 'lagu' : 'tracks'} • ${mins} ${isId ? 'mnt' : 'min'}</span>
        </div>
      `;

      this.statsDaySegmentsGrid.appendChild(card);
    });
  }

  renderRankings(artistsMap, tracksMap) {
    const isId = (this.currentLanguage === "id");

    // 1. Top Artists
    if (this.statsTopArtistsList) {
      this.statsTopArtistsList.innerHTML = "";
      const sortedArtists = Array.from(artistsMap.entries())
        .map(([name, data]) => ({ name, count: data.count, seconds: data.seconds, artwork: data.artwork }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      if (sortedArtists.length === 0) {
        this.statsTopArtistsList.innerHTML = `<div style="color: var(--color-text-tertiary); font-size: 13px; padding: 12px 0;">${isId ? 'Belum ada data artis.' : 'No artist data yet.'}</div>`;
      } else {
        sortedArtists.forEach((item, idx) => {
          const div = document.createElement("div");
          div.className = "ranking-item";

          const rankClass = idx === 0 ? "top1" : idx === 1 ? "top2" : idx === 2 ? "top3" : "";
          const avatar = item.artwork || getArtistAvatar(item.name);
          const mins = Math.round(item.seconds / 60);

          div.innerHTML = `
            <div class="ranking-rank ${rankClass}">#${idx + 1}</div>
            <img class="ranking-art artist" src="${this.escapeHtml(avatar)}" onerror="this.src='assets/logo.png'">
            <div class="ranking-info">
              <div class="ranking-title">${this.escapeHtml(item.name)}</div>
              <div class="ranking-sub">${mins} ${isId ? 'menit didengar' : 'mins streamed'}</div>
            </div>
            <div class="ranking-badge">${item.count} ${isId ? 'putar' : 'plays'}</div>
          `;

          div.addEventListener("click", () => {
            this.openArtistDetail(item.name);
          });

          this.statsTopArtistsList.appendChild(div);
        });
      }
    }

    // 2. Top Tracks
    if (this.statsTopTracksList) {
      this.statsTopTracksList.innerHTML = "";
      const sortedTracks = Array.from(tracksMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      if (sortedTracks.length === 0) {
        this.statsTopTracksList.innerHTML = `<div style="color: var(--color-text-tertiary); font-size: 13px; padding: 12px 0;">${isId ? 'Belum ada data lagu.' : 'No track data yet.'}</div>`;
      } else {
        sortedTracks.forEach((item, idx) => {
          const div = document.createElement("div");
          div.className = "ranking-item";

          const rankClass = idx === 0 ? "top1" : idx === 1 ? "top2" : idx === 2 ? "top3" : "";
          const art = item.artworkUrl || "assets/logo.png";

          div.innerHTML = `
            <div class="ranking-rank ${rankClass}">#${idx + 1}</div>
            <img class="ranking-art" src="${this.escapeHtml(art)}" onerror="this.src='assets/logo.png'">
            <div class="ranking-info">
              <div class="ranking-title">${this.escapeHtml(item.title)}</div>
              <div class="ranking-sub">${this.escapeHtml(item.artist)}</div>
            </div>
            <div class="ranking-badge">${item.count} ${isId ? 'putar' : 'plays'}</div>
          `;

          div.addEventListener("click", () => {
            const trackObj = {
              id: item.trackId ? (item.trackId.startsWith("yt_") ? item.trackId : `yt_${item.trackId}`) : `yt_${Date.now()}`,
              video_id: item.trackId ? item.trackId.replace(/^yt_/, "") : "",
              title: item.title,
              artist: item.artist,
              artwork_url: item.artworkUrl || "assets/logo.png",
              duration_secs: item.seconds || 180
            };
            this.playTrackNow(trackObj);
          });

          this.statsTopTracksList.appendChild(div);
        });
      }
    }
  }

  renderRecentScrobbles(allEvents) {
    if (!this.statsRecentScrobblesList) return;
    this.statsRecentScrobblesList.innerHTML = "";
    const isId = (this.currentLanguage === "id");

    const recent = [...allEvents].reverse().slice(0, 10);
    if (recent.length === 0) {
      this.statsRecentScrobblesList.innerHTML = `<div style="color: var(--color-text-tertiary); font-size: 13px; padding: 12px 0;">${isId ? 'Belum ada lagu yang baru diputar.' : 'No recently played tracks.'}</div>`;
      return;
    }

    recent.forEach((item) => {
      const row = document.createElement("div");
      row.className = "recent-scrobble-row";
      const art = item.artworkUrl || "assets/logo.png";
      const timeAgo = this.formatTimeAgo(item.timestamp);

      row.innerHTML = `
        <img class="ranking-art" src="${this.escapeHtml(art)}" onerror="this.src='assets/logo.png'">
        <div class="ranking-info">
          <div class="ranking-title">${this.escapeHtml(item.title)}</div>
          <div class="ranking-sub">${this.escapeHtml(item.artist)}</div>
        </div>
        <div class="recent-scrobble-time">${timeAgo}</div>
      `;

      row.style.cursor = "pointer";
      row.addEventListener("click", () => {
        const trackObj = {
          id: item.trackId ? (item.trackId.startsWith("yt_") ? item.trackId : `yt_${item.trackId}`) : `yt_${Date.now()}`,
          video_id: item.trackId ? item.trackId.replace(/^yt_/, "") : "",
          title: item.title,
          artist: item.artist,
          artwork_url: item.artworkUrl || "assets/logo.png",
          duration_secs: item.durationSeconds || 180
        };
        this.playTrackNow(trackObj);
      });

      this.statsRecentScrobblesList.appendChild(row);
    });
  }

  formatTimeAgo(timestamp) {
    if (!timestamp) return "";
    const isId = (this.currentLanguage === "id");
    const diff = Math.max(0, Date.now() - timestamp);
    const secs = Math.floor(diff / 1000);
    if (secs < 60) return isId ? "Baru saja" : "Just now";
    const mins = Math.floor(secs / 60);
    if (mins < 60) return isId ? `${mins} mnt lalu` : `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return isId ? `${hours} jam lalu` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return isId ? "Kemarin" : "Yesterday";
    if (days < 30) return isId ? `${days} hari lalu` : `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months === 1) return isId ? "1 bulan lalu" : "1 month ago";
    if (months < 12) return isId ? `${months} bulan lalu` : `${months} months ago`;
    return new Date(timestamp).toLocaleDateString(isId ? "id-ID" : "en-US", { month: "short", day: "numeric" });
  }
}

// Instantiate on DOMContentLoaded
if (typeof document !== "undefined") {
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
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SoraFyDesktopApp
  };
}
