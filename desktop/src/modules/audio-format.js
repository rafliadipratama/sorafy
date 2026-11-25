/**
 * Audio rendition selection.
 * YouTube offers the same track at several bitrates; this decides which one the
 * Audio Streaming Quality setting asks for.
 */

const AUDIO_QUALITY_VALUES = ['saver', 'high', 'max'];

// Values written by builds that shipped the setting before it did anything.
const LEGACY_QUALITY_ALIASES = { auto: 'high', lossless: 'max' };

// YouTube Opus renditions, smallest first; 140 is the AAC fallback for videos without Opus.
const ITAG_PREFERENCE = {
  saver: [249, 250, 251, 140],
  high: [251, 140, 250, 249]
};

/**
 * Coerce a stored setting into a quality this module understands.
 * @param {unknown} quality - Value read from app settings
 * @returns {'saver'|'high'|'max'}
 */
function normalizeAudioQuality(quality) {
  if (typeof quality !== 'string') return 'high';
  const key = quality.trim().toLowerCase();
  if (AUDIO_QUALITY_VALUES.includes(key)) return key;
  return LEGACY_QUALITY_ALIASES[key] || 'high';
}

/**
 * Choose one audio rendition for the requested quality.
 * @param {Array<object>} formats - adaptiveFormats entries from InnerTube
 * @param {unknown} quality - Requested quality, normalized internally
 * @returns {object|null} The chosen format, or null when none is playable
 */
function pickAudioFormat(formats, quality) {
  if (!Array.isArray(formats)) return null;

  const playable = formats.filter((f) => f && f.url && typeof f.mimeType === 'string' && f.mimeType.startsWith('audio/'));
  if (playable.length === 0) return null;

  const normalized = normalizeAudioQuality(quality);

  // "max" takes the largest stream on offer, whatever codec carries it.
  if (normalized === 'max') {
    return playable.reduce((best, f) => ((f.bitrate || 0) > (best.bitrate || 0) ? f : best));
  }

  for (const itag of ITAG_PREFERENCE[normalized]) {
    const match = playable.find((f) => f.itag === itag);
    if (match) return match;
  }

  // Nothing ranked was offered, so fall back on bitrate in the direction the quality asks for.
  return playable.reduce((best, f) =>
    (normalized === 'saver'
      ? (f.bitrate || Infinity) < (best.bitrate || Infinity)
      : (f.bitrate || 0) > (best.bitrate || 0))
      ? f
      : best
  );
}

module.exports = { AUDIO_QUALITY_VALUES, normalizeAudioQuality, pickAudioFormat };
