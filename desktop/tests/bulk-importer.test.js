const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseLibraryData, parseMultiUrls } = require('../src/modules/bulk-importer');

// Lightweight Jest-compatible assertion wrapper around node:assert/strict
function expect(actual) {
  return {
    toBe(expected) {
      assert.strictEqual(actual, expected);
    },
    toEqual(expected) {
      assert.deepStrictEqual(actual, expected);
    },
    toBeDefined() {
      assert.notStrictEqual(actual, undefined);
    },
    toBeTruthy() {
      assert.ok(actual);
    },
    toBeFalsy() {
      assert.ok(!actual);
    },
    toContain(item) {
      if (typeof actual === 'string' || Array.isArray(actual)) {
        assert.ok(actual.includes(item), `Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(item)}`);
      } else {
        throw new Error('toContain requires string or array');
      }
    },
    toHaveLength(len) {
      assert.strictEqual(actual.length, len);
    }
  };
}

// 1. Standard brief tests
test('parses standard Soundiiz / TuneMyMusic CSV correctly', () => {
  const csv = `Title,Artist,Album
Starboy,The Weeknd,Starboy
Let Down,Radiohead,OK Computer`;
  const result = parseLibraryData(csv, 'csv');
  expect(result.playlists.length).toBe(1);
  expect(result.playlists[0].tracks.length).toBe(2);
  expect(result.playlists[0].tracks[0].title).toBe('Starboy');
  expect(result.playlists[0].tracks[0].artist).toBe('The Weeknd');
});

test('parses SpotMYBackup JSON with multiple playlists', () => {
  const json = JSON.stringify({
    playlists: [
      { name: "Rock Classics", tracks: [{ track: { name: "Creep", artists: [{ name: "Radiohead" }] } }] }
    ]
  });
  const result = parseLibraryData(json, 'json');
  expect(result.playlists[0].name).toBe('Rock Classics');
  expect(result.playlists[0].tracks[0].title).toBe('Creep');
});

test('parses multi-line URLs correctly', () => {
  const input = `https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
https://music.youtube.com/playlist?list=RDCLAK5uy_k`;
  const urls = parseMultiUrls(input);
  expect(urls.length).toBe(2);
});

// 2. CSV delimiter & quoting tests
test('parses semicolon-delimited CSV with quoted fields correctly', () => {
  const csv = `Track Name;Artist Name;Album Name;Duration
"Karma Police";"Radiohead";"OK Computer";"04:24"
"Blinding Lights";"The Weeknd";"After Hours";"200000"`;
  const result = parseLibraryData(csv, 'csv');
  expect(result.playlists.length).toBe(1);
  expect(result.playlists[0].tracks.length).toBe(2);
  expect(result.playlists[0].tracks[0].title).toBe('Karma Police');
  expect(result.playlists[0].tracks[0].artist).toBe('Radiohead');
  expect(result.playlists[0].tracks[0].album).toBe('OK Computer');
  expect(result.playlists[0].tracks[0].duration).toBe(264); // 4*60+24
  expect(result.playlists[0].tracks[1].duration).toBe(200); // 200000ms / 1000
});

test('parses CSV with playlist column grouping tracks into separate playlists', () => {
  const csv = `Playlist,Title,Artist,Album
Indie Favorites,There Is A Light That Never Goes Out,The Smiths,The Queen Is Dead
Indie Favorites,This Charming Man,The Smiths,The Smiths
Electronic Chill,Strobe,deadmau5,For Lack of a Better Name`;
  const result = parseLibraryData(csv, 'csv');
  expect(result.playlists.length).toBe(2);
  expect(result.playlists[0].name).toBe('Indie Favorites');
  expect(result.playlists[0].tracks.length).toBe(2);
  expect(result.playlists[1].name).toBe('Electronic Chill');
  expect(result.playlists[1].tracks.length).toBe(1);
  expect(result.playlists[1].tracks[0].title).toBe('Strobe');
});

// 3. JSON format variations
test('parses flat JSON track array correctly', () => {
  const json = JSON.stringify([
    { title: "Nude", artist: "Radiohead", album: "In Rainbows", duration: 255 },
    { title: "Reckoner", artist: "Radiohead", album: "In Rainbows" }
  ]);
  const result = parseLibraryData(json, 'json');
  expect(result.playlists.length).toBe(1);
  expect(result.playlists[0].tracks.length).toBe(2);
  expect(result.playlists[0].tracks[0].title).toBe('Nude');
  expect(result.playlists[0].tracks[0].duration).toBe(255);
});

test('parses Spotify personal data export (items array) correctly', () => {
  const json = JSON.stringify({
    playlists: [
      {
        name: "Morning Acoustic",
        items: [
          { track: { trackName: "Banana Pancakes", artistName: "Jack Johnson", albumName: "In Between Dreams" } }
        ]
      }
    ]
  });
  const result = parseLibraryData(json, 'json');
  expect(result.playlists.length).toBe(1);
  expect(result.playlists[0].name).toBe('Morning Acoustic');
  expect(result.playlists[0].tracks[0].title).toBe('Banana Pancakes');
  expect(result.playlists[0].tracks[0].artist).toBe('Jack Johnson');
});

// 4. Plain text parsing
test('parses text tracklist with Artist - Title lines', () => {
  const text = `
1. Radiohead - Weird Fishes/Arpeggi
2. The Weeknd - Save Your Tears
Daft Punk - Instant Crush
`;
  const result = parseLibraryData(text, 'text');
  expect(result.playlists.length).toBe(1);
  expect(result.playlists[0].tracks.length).toBe(3);
  expect(result.playlists[0].tracks[0].title).toBe('Weird Fishes/Arpeggi');
  expect(result.playlists[0].tracks[0].artist).toBe('Radiohead');
  expect(result.playlists[0].tracks[1].title).toBe('Save Your Tears');
  expect(result.playlists[0].tracks[1].artist).toBe('The Weeknd');
  expect(result.playlists[0].tracks[2].title).toBe('Instant Crush');
  expect(result.playlists[0].tracks[2].artist).toBe('Daft Punk');
});

// 5. Robustness & edge cases
test('handles empty or malformed inputs without throwing', () => {
  const res1 = parseLibraryData('', 'csv');
  expect(res1.playlists.length).toBe(0);

  const res2 = parseLibraryData('invalid json{', 'json');
  expect(res2.playlists.length).toBe(0);

  const res3 = parseLibraryData('just random non-music garbage text', 'text');
  expect(res3.playlists[0].tracks.length).toBe(0);

  const urls = parseMultiUrls('   \n\n  not a url  \n  ');
  expect(urls.length).toBe(0);
});

test('auto-detects fileType if not specified', () => {
  const csv = `Title,Artist\nJigsaw Falling Into Place,Radiohead`;
  const resCsv = parseLibraryData(csv);
  expect(resCsv.playlists[0].tracks[0].title).toBe('Jigsaw Falling Into Place');

  const json = `{"playlists":[{"name":"Favs","tracks":[{"track":{"name":"Paranoid Android","artists":[{"name":"Radiohead"}]}}]}]}`;
  const resJson = parseLibraryData(json);
  expect(resJson.playlists[0].tracks[0].title).toBe('Paranoid Android');
});
