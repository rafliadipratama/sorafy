/**
 * SoraFy Download Format Selection
 *
 * Two shapes of download: re-encode to MP3 so the file opens anywhere, or keep
 * the source audio (Opus or AAC) untouched. The second one cannot assume an
 * extension, so the real output path has to come back from yt-dlp itself.
 */

const DOWNLOAD_FORMAT_VALUES = ['mp3', 'original'];

/**
 * @param {unknown} value - Raw setting value, possibly absent or from an older build
 * @returns {'mp3'|'original'} MP3 unless the original was explicitly asked for
 */
function normalizeDownloadFormat(value) {
  return DOWNLOAD_FORMAT_VALUES.includes(value) ? value : 'mp3';
}

/**
 * Build the yt-dlp argument list for one track.
 * `after_move:filepath` is what makes the caller able to name the file it got:
 * the extension depends on the source codec and on whether ffmpeg re-encoded.
 * @param {unknown} format - Download format setting
 * @param {string} outPattern - Output template, extension left to yt-dlp
 * @param {string} videoUrl - Watch URL
 * @returns {string[]}
 */
function buildDownloadArgs(format, outPattern, videoUrl) {
  const args = ['-f', 'ba/b', '-x'];

  if (normalizeDownloadFormat(format) === 'mp3') {
    args.push('--audio-format', 'mp3', '--audio-quality', '0');
  }

  args.push(
    '--no-playlist',
    '--embed-metadata',
    '--print', 'after_move:filepath',
    '-o', outPattern,
    videoUrl
  );
  return args;
}

/**
 * Read the final file path out of yt-dlp's stdout.
 * Other --print output and progress lines can precede it, so the last absolute
 * path wins rather than the first line.
 * @param {string} stdout - Captured stdout
 * @returns {string|null} Absolute path, or null when yt-dlp printed none
 */
function resolveDownloadedPath(stdout) {
  if (!stdout || typeof stdout !== 'string') return null;

  const paths = stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('/') || /^[A-Za-z]:[\\/]/.test(line));

  return paths.length ? paths[paths.length - 1] : null;
}

module.exports = {
  DOWNLOAD_FORMAT_VALUES,
  normalizeDownloadFormat,
  buildDownloadArgs,
  resolveDownloadedPath
};
