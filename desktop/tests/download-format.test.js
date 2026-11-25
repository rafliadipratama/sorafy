const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  DOWNLOAD_FORMAT_VALUES,
  normalizeDownloadFormat,
  buildDownloadArgs,
  resolveDownloadedPath
} = require('../src/modules/download-format');

const OUT = '/home/u/Music/SoraFy/Artist - Title.%(ext)s';
const URL = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';

test('normalizeDownloadFormat keeps MP3 as the default for existing installs', () => {
  assert.equal(normalizeDownloadFormat(undefined), 'mp3');
  assert.equal(normalizeDownloadFormat(null), 'mp3');
  assert.equal(normalizeDownloadFormat(''), 'mp3');
  assert.equal(normalizeDownloadFormat('flac'), 'mp3');
  assert.equal(normalizeDownloadFormat('MP3'), 'mp3');
});

test('normalizeDownloadFormat passes through the supported values', () => {
  assert.deepEqual(DOWNLOAD_FORMAT_VALUES, ['mp3', 'original']);
  assert.equal(normalizeDownloadFormat('mp3'), 'mp3');
  assert.equal(normalizeDownloadFormat('original'), 'original');
});

test('buildDownloadArgs re-encodes to MP3 at the best quality', () => {
  const args = buildDownloadArgs('mp3', OUT, URL);
  assert.deepEqual(args, [
    '-f', 'ba/b',
    '-x',
    '--audio-format', 'mp3',
    '--audio-quality', '0',
    '--no-playlist',
    '--embed-metadata',
    '--print', 'after_move:filepath',
    '-o', OUT,
    URL
  ]);
});

test('buildDownloadArgs leaves the source audio alone when original is chosen', () => {
  const args = buildDownloadArgs('original', OUT, URL);
  // No --audio-format: ffmpeg must not re-encode Opus into a lossy MP3.
  assert.equal(args.includes('--audio-format'), false);
  assert.equal(args.includes('--audio-quality'), false);
  assert.ok(args.includes('-x'), 'audio still has to be extracted from the container');
  assert.ok(args.includes('--embed-metadata'), 'title and artist tags must survive');
});

test('buildDownloadArgs always asks yt-dlp for the real output path', () => {
  for (const format of ['mp3', 'original', undefined]) {
    const args = buildDownloadArgs(format, OUT, URL);
    const i = args.indexOf('--print');
    assert.ok(i >= 0, `--print missing for ${format}`);
    assert.equal(args[i + 1], 'after_move:filepath');
  }
});

test('buildDownloadArgs never downloads a video stream', () => {
  // Pulling video and discarding it wastes the whole download budget.
  const args = buildDownloadArgs('original', OUT, URL);
  const i = args.indexOf('-f');
  assert.equal(args[i + 1], 'ba/b');
});

test('buildDownloadArgs keeps the output template and URL last', () => {
  const args = buildDownloadArgs('mp3', OUT, URL);
  assert.equal(args[args.length - 1], URL);
  assert.equal(args[args.length - 2], OUT);
  assert.equal(args[args.length - 3], '-o');
});

test('resolveDownloadedPath reads the path yt-dlp actually wrote', () => {
  assert.equal(
    resolveDownloadedPath('/home/u/Music/SoraFy/jawed - Me at the zoo.opus\n'),
    '/home/u/Music/SoraFy/jawed - Me at the zoo.opus'
  );
  assert.equal(
    resolveDownloadedPath('/home/u/Music/SoraFy/A - B.mp3'),
    '/home/u/Music/SoraFy/A - B.mp3'
  );
});

test('resolveDownloadedPath ignores progress chatter around the path', () => {
  const stdout = [
    '[youtube] Extracting URL: https://www.youtube.com/watch?v=x',
    '[ExtractAudio] Destination: ignored by this line',
    '/home/u/Music/SoraFy/A - B.opus',
    ''
  ].join('\n');
  assert.equal(resolveDownloadedPath(stdout), '/home/u/Music/SoraFy/A - B.opus');
});

test('resolveDownloadedPath takes the last path when a run prints several', () => {
  const stdout = '/tmp/intermediate.webm\n/home/u/Music/SoraFy/A - B.mp3\n';
  assert.equal(resolveDownloadedPath(stdout), '/home/u/Music/SoraFy/A - B.mp3');
});

test('resolveDownloadedPath reports nothing rather than guessing an extension', () => {
  // A guessed `.mp3` was being handed to the player as a success.
  assert.equal(resolveDownloadedPath(''), null);
  assert.equal(resolveDownloadedPath(undefined), null);
  assert.equal(resolveDownloadedPath('[download] 100% of 2.00MiB'), null);
});
