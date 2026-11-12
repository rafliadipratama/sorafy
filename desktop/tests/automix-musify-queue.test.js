const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  SoraFyDesktopApp,
  detectMusifyCulture,
  isCompatibleMusifyTrack,
  MUSIFY_CULTURE_CLUSTERS
} = require('../src/app');

test('detectMusifyCulture accurately classifies artists and titles into culture clusters', () => {
  const radiohead = detectMusifyCulture('Radiohead', 'Karma Police');
  assert.strictEqual(radiohead.id, 'western_alt_indie');

  const arcticMonkeys = detectMusifyCulture('Arctic Monkeys', 'Do I Wanna Know?');
  assert.strictEqual(arcticMonkeys.id, 'western_alt_indie');

  const linkinPark = detectMusifyCulture('Linkin Park', 'In the End');
  assert.strictEqual(linkinPark.id, 'western_rock_metal');

  const brunoMars = detectMusifyCulture('Bruno Mars', 'Just the Way You Are');
  assert.strictEqual(brunoMars.id, 'western_pop_rnb');

  const bernadya = detectMusifyCulture('Bernadya', 'Satu Bulan');
  assert.strictEqual(bernadya.id, 'indo_indie_folk');

  const dennyCaknan = detectMusifyCulture('Denny Caknan', 'Kartonyono Medot Janji');
  assert.strictEqual(dennyCaknan.id, 'indo_dangdut_koplo');

  const bts = detectMusifyCulture('BTS', 'Dynamite');
  assert.strictEqual(bts.id, 'kpop_asian');
});

test('isCompatibleMusifyTrack enforces genre purity and rejects bootlegs and cross-culture shifts', () => {
  const seedTrack = { artist: 'Radiohead', title: 'Karma Police' };
  const cluster = detectMusifyCulture(seedTrack.artist, seedTrack.title);

  // 1. Same artist is compatible
  assert.strictEqual(isCompatibleMusifyTrack({ artist: 'Radiohead', title: 'High and Dry' }, seedTrack, cluster), true);

  // 2. Peer in same western indie cluster is compatible
  assert.strictEqual(isCompatibleMusifyTrack({ artist: 'Coldplay', title: 'The Scientist' }, seedTrack, cluster), true);
  assert.strictEqual(isCompatibleMusifyTrack({ artist: 'Arctic Monkeys', title: 'I Wanna Be Yours' }, seedTrack, cluster), true);

  // 3. Reject bootlegs, karaoke, and slowed-reverb
  assert.strictEqual(isCompatibleMusifyTrack({ artist: 'Paris Music', title: 'Karma Police (Karaoke Version)' }, seedTrack, cluster), false);
  assert.strictEqual(isCompatibleMusifyTrack({ artist: 'The Karaoke Crew', title: 'Creep' }, seedTrack, cluster), false);
  assert.strictEqual(isCompatibleMusifyTrack({ artist: 'Solice', title: 'Apocalypse (slowed + reverb)' }, seedTrack, cluster), false);

  // 4. Reject cross-culture contamination (dangdut/koplo or Indonesian tracks into Western Alt/Indie)
  assert.strictEqual(isCompatibleMusifyTrack({ artist: 'Denny Caknan', title: 'Cundamani' }, seedTrack, cluster), false);
  assert.strictEqual(isCompatibleMusifyTrack({ artist: 'Guyon Waton', title: 'Korban Janji' }, seedTrack, cluster), false);
  assert.strictEqual(isCompatibleMusifyTrack({ artist: 'Bernadya', title: 'Untungnya, Hidup Terus Berjalan' }, seedTrack, cluster), false);
});

test('fetchAutomixQueue queries YouTube Music Radio via fetchYouTubeRadioQueue, resets continuation on seed change, and filters bootlegs', async () => {
  const app = Object.create(SoraFyDesktopApp.prototype);
  app.tracks = [{ id: 'seed_1', video_id: 'seed_1', title: 'Karma Police', artist: 'Radiohead' }];
  app.recentlySkippedArtists = new Map();
  app.recentlySkippedArtists.set('skipped band', Date.now());
  app.ytmRadioContinuationToken = 'old_stale_token';
  app._currentAutomixSeedId = 'old_vid';

  let calledWithVid = null;
  let calledWithCont = null;

  global.window = {
    electronAPI: {
      fetchYouTubeRadioQueue: async (vid, cont) => {
        calledWithVid = vid;
        calledWithCont = cont;
        return {
          tracks: [
            { id: 'yt_radio_1', video_id: 'radio_1', title: 'No Surprises', artist: 'Radiohead' },
            { id: 'yt_radio_2', video_id: 'radio_2', title: 'Do I Wanna Know?', artist: 'Arctic Monkeys' },
            { id: 'yt_radio_3', video_id: 'radio_3', title: 'Karma Police (Karaoke Version)', artist: 'The Karaoke Crew' },
            { id: 'yt_radio_4', video_id: 'radio_4', title: 'Song by Skipped Band', artist: 'Skipped Band' }
          ],
          continuation: 'next_token_123'
        };
      }
    }
  };

  const seed = { id: 'seed_new', video_id: 'new_vid_123', artist: 'Radiohead', title: 'Karma Police' };
  const result = await app.fetchAutomixQueue(seed, true);

  // Verifies that a new seed resets continuation
  assert.strictEqual(calledWithVid, 'new_vid_123');
  assert.strictEqual(calledWithCont, null);
  assert.strictEqual(app.ytmRadioContinuationToken, 'next_token_123');

  // Verifies that karaoke and skipped artists were filtered out
  assert.strictEqual(result.length, 2);
  assert.strictEqual(result[0].title, 'No Surprises');
  assert.strictEqual(result[1].title, 'Do I Wanna Know?');
});

test('fetchMusifyQueue interleaves catalog and peer artists while filtering duplicates and skipped artists', async () => {
  const app = Object.create(SoraFyDesktopApp.prototype);
  app.tracks = [{ id: 'seed_1', video_id: 'seed_1', title: 'Karma Police', artist: 'Radiohead' }];
  app.recentlySkippedArtists = new Map();
  app.recentlySkippedArtists.set('skipped band', Date.now());

  // Mock global electronAPI for YouTube Music search
  global.window = {
    electronAPI: {
      searchYouTubeMusic: async (query, type) => {
        if (query.includes('Radiohead hits')) {
          return [
            { id: 'yt_rh1', video_id: 'rh1', title: 'No Surprises', artist: 'Radiohead' },
            { id: 'yt_rh2', video_id: 'rh2', title: 'Creep', artist: 'Radiohead' }
          ];
        }
        if (query.includes('hits')) {
          return [
            { id: 'yt_peer1', video_id: 'peer1', title: 'Do I Wanna Know?', artist: 'Arctic Monkeys' },
            { id: 'yt_peer2', video_id: 'peer2', title: 'Bad Track', artist: 'Skipped Band' },
            { id: 'yt_peer3', video_id: 'peer3', title: 'Yellow', artist: 'Coldplay' }
          ];
        }
        return [];
      }
    }
  };

  const seed = { artist: 'Radiohead', title: 'Karma Police' };
  const queue = await app.fetchMusifyQueue(seed);

  assert.ok(queue.length > 0, 'Queue should not be empty');
  // Confirm skipped band was excluded
  assert.ok(!queue.some(t => (t.artist || '').toLowerCase() === 'skipped band'));
  // Confirm Radiohead and peers are present
  assert.ok(queue.some(t => t.artist === 'Radiohead'));
  assert.ok(queue.some(t => t.artist === 'Arctic Monkeys' || t.artist === 'Coldplay'));
});
