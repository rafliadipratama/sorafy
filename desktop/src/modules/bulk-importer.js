/**
 * SoraFy Desktop - Bulk Library Importer Core
 * Parsers for Soundiiz/TuneMyMusic CSV, SpotMYBackup/Spotify JSON, Plain Text, and Multi-line URLs.
 */

/**
 * Detect delimiter for CSV (comma, semicolon, or tab).
 * @param {string} text
 * @returns {string}
 */
function detectDelimiter(text) {
  let commaCount = 0;
  let semiCount = 0;
  let tabCount = 0;
  let inQuotes = false;

  const sample = text.slice(0, 4000);
  for (let i = 0; i < sample.length; i++) {
    const char = sample[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (!inQuotes) {
      if (char === ',') commaCount++;
      else if (char === ';') semiCount++;
      else if (char === '\t') tabCount++;
    }
  }

  if (semiCount > commaCount && semiCount > tabCount) return ';';
  if (tabCount > commaCount && tabCount > semiCount) return '\t';
  return ',';
}

/**
 * Tokenize CSV string into 2D array of cells with full quote support.
 * @param {string} text
 * @param {string} delimiter
 * @returns {Array<Array<string>>}
 */
function tokenizeCsv(text, delimiter = ',') {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && text[i + 1] === '\n') {
        i++;
      }
      currentRow.push(currentField);
      if (currentRow.some(c => c.trim().length > 0)) {
        rows.push(currentRow.map(f => f.trim()));
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(c => c.trim().length > 0)) {
      rows.push(currentRow.map(f => f.trim()));
    }
  }

  return rows;
}

/**
 * Parses duration value into integer seconds.
 * @param {string|number} val
 * @returns {number|undefined}
 */
function parseDuration(val) {
  if (typeof val === 'number') {
    if (val <= 0 || isNaN(val)) return undefined;
    return val > 10000 ? Math.round(val / 1000) : Math.round(val);
  }
  if (typeof val !== 'string') return undefined;
  const str = val.trim();
  if (!str) return undefined;

  if (str.includes(':')) {
    const parts = str.split(':').map(p => parseFloat(p));
    if (parts.some(isNaN)) return undefined;
    if (parts.length === 2) {
      return Math.round(parts[0] * 60 + parts[1]);
    } else if (parts.length === 3) {
      return Math.round(parts[0] * 3600 + parts[1] * 60 + parts[2]);
    }
  }

  const num = parseFloat(str);
  if (!isNaN(num) && num > 0) {
    return num > 10000 ? Math.round(num / 1000) : Math.round(num);
  }
  return undefined;
}

/**
 * Finds index of column header matching any pattern.
 * @param {Array<string>} headers
 * @param {Array<string|RegExp>} patterns
 * @returns {number}
 */
function findHeaderIndex(headers, patterns) {
  for (let i = 0; i < headers.length; i++) {
    const h = (headers[i] || '').toLowerCase().trim();
    for (const pattern of patterns) {
      if (typeof pattern === 'string' && h === pattern.toLowerCase()) return i;
      if (pattern instanceof RegExp && pattern.test(h)) return i;
    }
  }
  return -1;
}

/**
 * Parse CSV format library data (Soundiiz, TuneMyMusic, etc.)
 * @param {string} rawText
 * @returns {{ playlists: Array<{ name: string, tracks: Array<{ title: string, artist: string, album?: string, duration?: number }> }> }}
 */
function parseCsv(rawText) {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return { playlists: [] };
  }

  const delimiter = detectDelimiter(rawText);
  const rows = tokenizeCsv(rawText, delimiter);
  if (rows.length === 0) return { playlists: [] };

  const titlePatterns = ['title', 'track name', 'song name', 'track', 'song', 'name', 'track title', /^track[\s_-]?name$/i, /^song[\s_-]?name$/i, /^title$/i];
  const artistPatterns = ['artist', 'artist name', 'artists', 'artist(s)', 'performer', 'creator', 'author', /^artist[\s_-]?name$/i, /^artist$/i];
  const albumPatterns = ['album', 'album name', 'album title', /^album[\s_-]?name$/i, /^album$/i];
  const durationPatterns = [
    'duration',
    'track duration',
    'duration (ms)',
    'duration_ms',
    'time',
    'length',
    /track[\s_-]?duration/i,
    /duration/i,
    /^length/i
  ];
  const playlistPatterns = ['playlist', 'playlist name', 'folder', 'collection', /^playlist[\s_-]?name$/i, /^playlist$/i];

  let headerRowIndex = -1;
  let titleIdx = -1;
  let artistIdx = -1;
  let albumIdx = -1;
  let durationIdx = -1;
  let playlistIdx = -1;

  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const r = rows[i];
    const tIdx = findHeaderIndex(r, titlePatterns);
    const aIdx = findHeaderIndex(r, artistPatterns);
    const albIdx = findHeaderIndex(r, albumPatterns);
    const dIdx = findHeaderIndex(r, durationPatterns);
    const pIdx = findHeaderIndex(r, playlistPatterns);

    // Require both title and artist, or at least two distinct matched columns
    const matchedCount = [tIdx, aIdx, albIdx, dIdx, pIdx].filter(idx => idx !== -1).length;
    if ((tIdx !== -1 && aIdx !== -1) || matchedCount >= 2) {
      headerRowIndex = i;
      titleIdx = tIdx;
      artistIdx = aIdx;
      albumIdx = albIdx;
      durationIdx = dIdx;
      playlistIdx = pIdx;
      break;
    }
  }

  const startRow = headerRowIndex !== -1 ? headerRowIndex + 1 : 0;
  if (headerRowIndex === -1) {
    titleIdx = 0;
    artistIdx = 1;
    albumIdx = 2;
  }

  const playlistMap = new Map();

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    const title = (titleIdx !== -1 && row[titleIdx] ? row[titleIdx] : '').trim();
    const artist = (artistIdx !== -1 && row[artistIdx] ? row[artistIdx] : '').trim();
    const album = (albumIdx !== -1 && row[albumIdx] ? row[albumIdx] : '').trim();
    const duration = durationIdx !== -1 ? parseDuration(row[durationIdx]) : undefined;
    const playlistName = (playlistIdx !== -1 && row[playlistIdx] ? row[playlistIdx].trim() : '') || 'Imported Playlist';

    if (!title && !artist) continue;

    const track = {
      title: title || 'Unknown Title',
      artist: artist || 'Unknown Artist'
    };
    if (album) track.album = album;
    if (duration !== undefined) track.duration = duration;

    if (!playlistMap.has(playlistName)) {
      playlistMap.set(playlistName, []);
    }
    playlistMap.get(playlistName).push(track);
  }

  const playlists = [];
  for (const [name, tracks] of playlistMap.entries()) {
    if (tracks.length > 0) {
      playlists.push({ name, tracks });
    }
  }

  return { playlists };
}

/**
 * Extracts normalized track from JSON track item.
 * @param {any} raw
 * @returns {{ title: string, artist: string, album?: string, duration?: number }|null}
 */
function extractTrackFromJson(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const item = (raw.track && typeof raw.track === 'object') ? raw.track : raw;

  let title = (typeof raw.track === 'string' ? raw.track : '') || item.name || item.title || item.trackName || item.songName || '';
  if (typeof title !== 'string') title = String(title || '');
  title = title.trim();

  let artist = '';
  if (Array.isArray(item.artists)) {
    artist = item.artists
      .map(a => (typeof a === 'string' ? a : a.name || a.artistName || ''))
      .filter(Boolean)
      .join(', ');
  } else if (typeof item.artist === 'string') {
    artist = item.artist;
  } else if (typeof item.artistName === 'string') {
    artist = item.artistName;
  } else if (typeof item.artists === 'string') {
    artist = item.artists;
  }
  artist = artist.trim();

  let album = '';
  if (item.album && typeof item.album === 'object') {
    album = item.album.name || item.album.title || '';
  } else if (typeof item.album === 'string') {
    album = item.album;
  } else if (typeof item.albumName === 'string') {
    album = item.albumName;
  }
  album = album.trim();

  const durRaw = item.duration_ms || item.duration || item.durationSec || item.duration_secs || item.length;
  const duration = parseDuration(durRaw);

  if (!title && !artist) return null;

  const result = {
    title: title || 'Unknown Title',
    artist: artist || 'Unknown Artist'
  };
  if (album) result.album = album;
  if (duration !== undefined) result.duration = duration;

  return result;
}

/**
 * Parse JSON format library data (SpotMYBackup, Spotify export, flat arrays).
 * @param {string} rawText
 * @returns {{ playlists: Array<{ name: string, tracks: Array<{ title: string, artist: string, album?: string, duration?: number }> }> }}
 */
function parseJsonLibrary(rawText) {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return { playlists: [] };
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    return { playlists: [] };
  }

  const playlists = [];

  // Top-level object with playlists array
  if (data && typeof data === 'object') {
    const rawPlaylists = data.playlists || data.Playlists;
    if (Array.isArray(rawPlaylists)) {
      for (const pl of rawPlaylists) {
        if (!pl || typeof pl !== 'object') continue;
        const name = (pl.name || pl.title || 'Imported Playlist').trim();
        const rawTracks = pl.tracks || pl.items || pl.songs || [];
        const tracks = [];
        if (Array.isArray(rawTracks)) {
          for (const item of rawTracks) {
            const tr = extractTrackFromJson(item);
            if (tr) tracks.push(tr);
          }
        }
        if (tracks.length > 0) {
          playlists.push({ name, tracks });
        }
      }
      return { playlists };
    }

    // Top-level array of playlists or tracks
    if (Array.isArray(data)) {
      if (data.length > 0 && data[0] && (data[0].tracks || data[0].items)) {
        for (const pl of data) {
          const name = (pl.name || pl.title || 'Imported Playlist').trim();
          const rawTracks = pl.tracks || pl.items || [];
          const tracks = [];
          if (Array.isArray(rawTracks)) {
            for (const item of rawTracks) {
              const tr = extractTrackFromJson(item);
              if (tr) tracks.push(tr);
            }
          }
          if (tracks.length > 0) {
            playlists.push({ name, tracks });
          }
        }
        return { playlists };
      }

      // Flat track array
      const tracks = [];
      for (const item of data) {
        const tr = extractTrackFromJson(item);
        if (tr) tracks.push(tr);
      }
      if (tracks.length > 0) {
        playlists.push({ name: 'Imported Playlist', tracks });
      }
      return { playlists };
    }

    // Object with tracks array (e.g. YourLibrary.json)
    const libraryTracks = data.tracks || data.saved || data.library || data.starred;
    if (Array.isArray(libraryTracks)) {
      const tracks = [];
      for (const item of libraryTracks) {
        const tr = extractTrackFromJson(item);
        if (tr) tracks.push(tr);
      }
      if (tracks.length > 0) {
        playlists.push({ name: 'Imported Library', tracks });
      }
      return { playlists };
    }
  }

  return { playlists };
}

/**
 * Parse plain text tracklist (e.g. "Artist - Title" or "1. Artist - Title").
 * @param {string} rawText
 * @returns {{ playlists: Array<{ name: string, tracks: Array<{ title: string, artist: string, album?: string, duration?: number }> }> }}
 */
function parseTextTracklist(rawText) {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return { playlists: [] };
  }

  const lines = rawText.split(/[\r\n]+/);
  const tracks = [];

  for (const rawLine of lines) {
    let line = rawLine.trim();
    if (!line) continue;

    // Strip leading track numbering (e.g. "1. ", "01. ", "1 - ", "#1 ")
    line = line.replace(/^\s*(?:\[\d+\]|\#?\d+[\.\-\)]\s*)/, '').trim();
    if (!line) continue;

    let artist = '';
    let title = '';

    if (line.includes(' - ') || line.includes(' – ') || line.includes(' — ')) {
      const parts = line.split(/\s+[\-\–\—]\s+/);
      if (parts.length >= 2) {
        artist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim();
      }
    } else if (/\s+by\s+/i.test(line)) {
      const parts = line.split(/\s+by\s+/i);
      if (parts.length >= 2) {
        title = parts[0].trim();
        artist = parts.slice(1).join(' by ').trim();
      }
    }

    if (title || artist) {
      tracks.push({
        title: title || line,
        artist: artist || 'Unknown Artist'
      });
    }
  }

  return {
    playlists: [{ name: 'Imported Playlist', tracks }]
  };
}

/**
 * Main parser entry point.
 * @param {string} rawText
 * @param {'csv'|'json'|'text'} [fileType]
 * @returns {{ playlists: Array<{ name: string, tracks: Array<{ title: string, artist: string, album?: string, duration?: number }> }> }}
 */
function parseLibraryData(rawText, fileType) {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return { playlists: [] };
  }

  let detectedType = fileType;
  if (!detectedType) {
    const trimmed = rawText.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      detectedType = 'json';
    } else if (trimmed.includes(',') || trimmed.includes(';') || trimmed.includes('\t')) {
      detectedType = 'csv';
    } else {
      detectedType = 'text';
    }
  }

  switch (detectedType) {
    case 'json':
      return parseJsonLibrary(rawText);
    case 'csv':
      return parseCsv(rawText);
    case 'text':
    default:
      return parseTextTracklist(rawText);
  }
}

/**
 * Extracts multiple valid URLs from text.
 * @param {string} urlText
 * @returns {Array<string>}
 */
function parseMultiUrls(urlText) {
  if (!urlText || typeof urlText !== 'string') return [];
  const lines = urlText.split(/[\r\n]+/);
  const urls = [];
  const urlRegex = /https?:\/\/[^\s"'<>`]+/gi;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const matches = trimmed.match(urlRegex);
    if (matches) {
      for (let url of matches) {
        url = url.replace(/[.,;)]+$/, '');
        if (url && !urls.includes(url)) {
          urls.push(url);
        }
      }
    }
  }

  return urls;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseLibraryData,
    parseMultiUrls,
    parseCsv,
    parseJsonLibrary,
    parseTextTracklist,
    parseDuration
  };
}

if (typeof window !== 'undefined') {
  window.BulkImporter = {
    parseLibraryData,
    parseMultiUrls,
    parseCsv,
    parseJsonLibrary,
    parseTextTracklist,
    parseDuration
  };
}
