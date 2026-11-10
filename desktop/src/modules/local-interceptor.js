/**
 * local-interceptor.js
 *
 * Local Audio Interceptor & Matching Engine for SoraFy Desktop.
 * Provides filename sanitization, metadata normalization, candidate generation,
 * and local file matching for offline-first playback.
 */

let fs, path, os;
try {
  fs = typeof require !== 'undefined' ? require('node:fs') : null;
  path = typeof require !== 'undefined' ? require('node:path') : null;
  os = typeof require !== 'undefined' ? require('node:os') : null;
} catch (_) {}

// Standard supported offline audio extensions
const SUPPORTED_EXTENSIONS = ['.mp3', '.opus', '.m4a', '.flac', '.ogg', '.wav', '.webm'];

/**
 * Strips bracketed/parenthesized noise (remaster, official, live, audio/video)
 * and sanitizes filesystem illegal characters (/ \ : * ? " < > |).
 *
 * @param {string} str - Raw title or artist string
 * @returns {string} Cleaned, sanitized, trimmed string
 */
function cleanMetadataString(str) {
  if (!str || typeof str !== 'string') return '';

  let cleaned = str;

  // 1. Remove bracketed / parenthesized metadata tags
  // Examples: (Remastered), [Official Video], (Live at Glastonbury), (Deluxe Edition)
  cleaned = cleaned.replace(/\s*[\(\[](?:remaster(?:ed)?(?:\s*\d{4})?|digital\s*remaster(?:ed)?|anniversary(?:\s*edition)?)[\)\]]/gi, '');
  cleaned = cleaned.replace(/\s*[\(\[](?:official(?:\s*(?:video|audio|music\s*video|lyric\s*video|hd\s*video))?|hd|hq|4k)[\)\]]/gi, '');
  cleaned = cleaned.replace(/\s*[\(\[](?:deluxe(?:\s*edition)?|special\s*edition|bonus\s*track|radio\s*edit|single\s*version|album\s*version|extended\s*mix)[\)\]]/gi, '');
  cleaned = cleaned.replace(/\s*[\(\[](?:live(?:\s*(?:at|in|from)[^)\]]*)?)[\)\]]/gi, '');
  cleaned = cleaned.replace(/\s*[\(\[](?:lyrics?|lyric\s*video|visualizer)[\)\]]/gi, '');

  // 2. Remove trailing dash versions (e.g. " - Remastered 2011", " - Radio Edit")
  cleaned = cleaned.replace(/\s+-\s+(?:remaster(?:ed)?(?:\s*\d{4})?|radio\s*edit|single\s*version)$/gi, '');

  // 3. Sanitize filesystem illegal characters (/ \ : * ? " < > |)
  cleaned = cleaned.replace(/[/\\:?*\"<>|]/g, '_');

  // 4. Normalize multiple whitespaces and trim
  return cleaned.replace(/\s+/g, ' ').trim();
}

/**
 * Sanitizes only illegal filesystem characters without stripping metadata tags.
 *
 * @param {string} str
 * @returns {string}
 */
function sanitizeFilenameChars(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[/\\:?*\"<>|]/g, '_').replace(/\s+/g, ' ').trim();
}

/**
 * Generates an array of expected candidate local filenames for a given track,
 * trying both cleaned metadata and sanitized literal versions across standard audio extensions.
 *
 * @param {Object} track - Track object ({ title, artist })
 * @returns {string[]} Array of candidate filenames
 */
function getExpectedLocalFilenames(track) {
  if (!track || typeof track !== 'object') return [];

  const rawTitle = typeof track.title === 'string' ? track.title.trim() : '';
  const rawArtist = typeof track.artist === 'string' ? track.artist.trim() : '';

  const cleanTitle = cleanMetadataString(rawTitle);
  const cleanArtist = cleanMetadataString(rawArtist);

  const sanitizedTitle = sanitizeFilenameChars(rawTitle);
  const sanitizedArtist = sanitizeFilenameChars(rawArtist);

  // Candidate title strings (prioritize cleaned, then literal sanitized)
  const candidateTitles = [];
  if (cleanTitle) candidateTitles.push(cleanTitle);
  if (sanitizedTitle && sanitizedTitle !== cleanTitle) candidateTitles.push(sanitizedTitle);
  if (candidateTitles.length === 0) candidateTitles.push('Track');

  // Candidate artist strings
  const candidateArtists = [];
  if (cleanArtist) candidateArtists.push(cleanArtist);
  if (sanitizedArtist && sanitizedArtist !== cleanArtist) candidateArtists.push(sanitizedArtist);
  if (candidateArtists.length === 0) candidateArtists.push('Unknown Artist');

  const filenames = [];

  // 1. Artist - Title combinations
  for (const art of candidateArtists) {
    for (const tit of candidateTitles) {
      for (const ext of SUPPORTED_EXTENSIONS) {
        filenames.push(`${art} - ${tit}${ext}`);
      }
    }
  }

  // 2. Title only combinations (e.g. tracks saved without artist prefix)
  for (const tit of candidateTitles) {
    for (const ext of SUPPORTED_EXTENSIONS) {
      filenames.push(`${tit}${ext}`);
    }
  }

  // Return unique filenames preserving order
  return Array.from(new Set(filenames));
}

/**
 * Matches a track against an array of downloaded tracks (either filenames/strings or track objects).
 *
 * @param {Object} track - Track to match
 * @param {Array<string|Object>} downloadedTracks - Array of downloaded track objects or filenames
 * @returns {string|Object|null} Matching downloaded item or null
 */
function matchDownloadedTrack(track, downloadedTracks) {
  if (!track || !Array.isArray(downloadedTracks) || downloadedTracks.length === 0) {
    return null;
  }

  const expectedFilenames = getExpectedLocalFilenames(track);
  const expectedLowerSet = new Set(expectedFilenames.map(f => f.toLowerCase()));

  const trackCleanTitle = cleanMetadataString(track.title).toLowerCase();
  const trackCleanArtist = cleanMetadataString(track.artist).toLowerCase();

  for (const item of downloadedTracks) {
    if (typeof item === 'string') {
      const base = path.basename(item).toLowerCase();
      if (expectedLowerSet.has(base) || expectedLowerSet.has(item.toLowerCase())) {
        return item;
      }
    } else if (item && typeof item === 'object') {
      const filename = typeof item.filename === 'string' ? item.filename.toLowerCase() : '';
      const rawPathBase = typeof item.raw_path === 'string' ? path.basename(item.raw_path).toLowerCase() : '';

      if (filename && expectedLowerSet.has(filename)) {
        return item;
      }
      if (rawPathBase && expectedLowerSet.has(rawPathBase)) {
        return item;
      }

      // Check cleaned metadata match if title and artist exist
      if (item.title && trackCleanTitle) {
        const itemCleanTitle = cleanMetadataString(item.title).toLowerCase();
        const itemCleanArtist = cleanMetadataString(item.artist || '').toLowerCase();

        if (itemCleanTitle === trackCleanTitle) {
          if (!trackCleanArtist || !itemCleanArtist || itemCleanArtist === trackCleanArtist) {
            return item;
          }
        }
      }
    }
  }

  return null;
}

/**
 * Resolves the full path to a local audio file in the specified directory if it exists.
 *
 * @param {Object} track - Track object
 * @param {string} [baseDir] - Base directory to search (defaults to ~/Music/SoraFy)
 * @returns {string|null} Full filesystem path or null
 */
function resolveLocalAudioPath(track, baseDir) {
  if (!track || typeof track !== 'object') return null;

  // Fast-path: if track already carries a valid raw_path on disk, verify and return directly
  if (typeof track.raw_path === 'string' && track.raw_path) {
    try {
      if (fs && typeof fs.existsSync === 'function' && fs.existsSync(track.raw_path)) {
        const stat = fs.statSync(track.raw_path);
        if (stat.isFile() && stat.size > 0) {
          return track.raw_path;
        }
      }
    } catch (_) {}
  }

  if (!fs || typeof fs.existsSync !== 'function') return null;
  const dir = baseDir || (os && typeof os.homedir === 'function' ? path.join(os.homedir(), 'Music', 'SoraFy') : '');
  if (!dir || !fs.existsSync(dir)) return null;

  const candidateFilenames = getExpectedLocalFilenames(track);

  // Fast check: direct existence of candidate filename
  for (const candidate of candidateFilenames) {
    const fullPath = path.join(dir, candidate);
    if (fs.existsSync(fullPath)) {
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isFile() && stat.size > 0) {
          return fullPath;
        }
      } catch (_) {}
    }
  }

  // Fallback: directory listing match
  try {
    const files = fs.readdirSync(dir);
    const matched = matchDownloadedTrack(track, files);
    if (matched) {
      const fullPath = path.join(dir, matched);
      const stat = fs.statSync(fullPath);
      if (stat.isFile() && stat.size > 0) {
        return fullPath;
      }
    }
  } catch (_) {}

  return null;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SUPPORTED_EXTENSIONS,
    cleanMetadataString,
    sanitizeFilenameChars,
    getExpectedLocalFilenames,
    matchDownloadedTrack,
    resolveLocalAudioPath
  };
}

if (typeof window !== 'undefined') {
  window.LocalInterceptor = {
    SUPPORTED_EXTENSIONS,
    cleanMetadataString,
    sanitizeFilenameChars,
    getExpectedLocalFilenames,
    matchDownloadedTrack,
    resolveLocalAudioPath
  };
}
