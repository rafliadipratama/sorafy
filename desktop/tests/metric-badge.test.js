const { test } = require('node:test');
const assert = require('node:assert/strict');
const { SoraFyDesktopApp } = require('../src/app');

function createMockApp(lang = 'id') {
  return {
    settings: { language: lang },
    currentLanguage: lang,
    formatMetricCount: SoraFyDesktopApp.prototype.formatMetricCount,
    getTrackMetricLabel: SoraFyDesktopApp.prototype.getTrackMetricLabel,
    parseMetricToNumber: SoraFyDesktopApp.prototype.parseMetricToNumber,
    normalizeSearchText: SoraFyDesktopApp.prototype.normalizeSearchText
  };
}

test('formatMetricCount formats raw numbers into localized metrics for songs and videos', () => {
  const app = createMockApp('id');

  // Indonesian format
  assert.strictEqual(app.formatMetricCount(2300000000, false, 'id'), '2,3 M diputar');
  assert.strictEqual(app.formatMetricCount(229400000, false, 'id'), '229,4 jt diputar');
  assert.strictEqual(app.formatMetricCount(500000, false, 'id'), '500 rb diputar');
  assert.strictEqual(app.formatMetricCount(1600000000, true, 'id'), '1,6 M ditonton');
  assert.strictEqual(app.formatMetricCount(15000000, true, 'id'), '15 jt ditonton');

  // English format
  assert.strictEqual(app.formatMetricCount(2300000000, false, 'en'), '2.3B plays');
  assert.strictEqual(app.formatMetricCount(229400000, false, 'en'), '229.4M plays');
  assert.strictEqual(app.formatMetricCount(500000, false, 'en'), '500K plays');
  assert.strictEqual(app.formatMetricCount(1600000000, true, 'en'), '1.6B views');
  assert.strictEqual(app.formatMetricCount(15000000, true, 'en'), '15M views');
});

test('formatMetricCount safely converts and preserves pre-formatted InnerTube strings', () => {
  const app = createMockApp('id');

  // English string to Indonesian
  assert.strictEqual(app.formatMetricCount('2.3B plays', false, 'id'), '2,3 M diputar');
  assert.strictEqual(app.formatMetricCount('1.6B views', true, 'id'), '1,6 M ditonton');
  assert.strictEqual(app.formatMetricCount('19M plays', false, 'id'), '19 jt diputar');

  // Indonesian string to English
  assert.strictEqual(app.formatMetricCount('2,3 M pemutaran', false, 'en'), '2.3B plays');
  assert.strictEqual(app.formatMetricCount('1,6 M x ditonton', true, 'en'), '1.6B views');
  assert.strictEqual(app.formatMetricCount('19 jt pemutaran', false, 'en'), '19M plays');

  // Passthrough in matching locale
  assert.strictEqual(app.formatMetricCount('2.3B plays', false, 'en'), '2.3B plays');
  assert.strictEqual(app.formatMetricCount('2,3 M pemutaran', false, 'id'), '2,3 M pemutaran');
});

test('getTrackMetricLabel accurately distinguishes songs (plays) from videos (views)', () => {
  const app = createMockApp('en');

  // 1. Song with play_count_text
  const songTrack = {
    title: 'Creep',
    artist: 'Radiohead',
    is_video: false,
    play_count_text: '2.3B plays'
  };
  assert.strictEqual(app.getTrackMetricLabel(songTrack), '2.3B plays');

  // 2. Video with view_count_text
  const videoTrack = {
    title: 'Creep (Official Music Video)',
    artist: 'Radiohead',
    is_video: true,
    view_count_text: '1.6B views'
  };
  assert.strictEqual(app.getTrackMetricLabel(videoTrack), '1.6B views');

  // 3. Song with raw view_count from stream resolution
  const streamSong = {
    title: 'Karma Police',
    artist: 'Radiohead',
    is_video: false,
    view_count: '229380139'
  };
  assert.strictEqual(app.getTrackMetricLabel(streamSong), '229.4M plays');

  // 4. Video with raw view_count from stream resolution
  const streamVideo = {
    title: 'Karma Police (Live)',
    artist: 'Radiohead',
    is_video: true,
    view_count: '1624000000'
  };
  assert.strictEqual(app.getTrackMetricLabel(streamVideo), '1.6B views');
});

test('parseMetricToNumber converts metric text to accurate numbers', () => {
  const app = createMockApp('id');
  assert.strictEqual(app.parseMetricToNumber('2.3B plays'), 2300000000);
  assert.strictEqual(app.parseMetricToNumber('122 jt pemutaran'), 122000000);
  assert.strictEqual(app.parseMetricToNumber('10 rb pemutaran'), 10000);
  assert.strictEqual(app.parseMetricToNumber('500K plays'), 500000);
  assert.strictEqual(app.parseMetricToNumber('1.6B views'), 1600000000);
  assert.strictEqual(app.parseMetricToNumber(12345), 12345);
  assert.strictEqual(app.parseMetricToNumber(null), 0);
});

test('normalizeSearchText strips punctuation and handles hyphenated phrases', () => {
  const app = createMockApp('id');
  assert.strictEqual(app.normalizeSearchText('Ada titik-titik di ujung doa'), 'ada titik titik di ujung doa');
  assert.strictEqual(app.normalizeSearchText('Ada Titik Titik di Ujung Doa'), 'ada titik titik di ujung doa');
  assert.strictEqual(app.normalizeSearchText('Sal Priadi - Dari planet lain (Official Video)!'), 'sal priadi dari planet lain official video');
});

test('candidate matching prioritizes official track with 122M plays over cover with 10k plays', () => {
  const app = createMockApp('id');
  const query = 'ada titik titik di ujung doa';
  const normQ = app.normalizeSearchText(query);
  const cleanQ = query.trim().toLowerCase();

  const candidates = [
    {
      id: 'eva_1',
      title: 'Ada Titik Titik di Ujung Doa',
      artist: 'Eva Pradila',
      play_count_text: '10 rb pemutaran'
    },
    {
      id: 'sal_1',
      title: 'Ada titik-titik di ujung doa',
      artist: 'Sal Priadi',
      play_count_text: '122 jt pemutaran'
    }
  ];

  const matched = candidates.filter(s => {
    const normT = app.normalizeSearchText(s.title);
    const st = s.title.trim().toLowerCase();
    return normT === normQ || normT.startsWith(normQ) || normQ.startsWith(normT) ||
           st === cleanQ || st.startsWith(cleanQ) || cleanQ.startsWith(st);
  });

  matched.sort((a, b) => {
    const playsA = app.parseMetricToNumber(a.play_count_text || 0);
    const playsB = app.parseMetricToNumber(b.play_count_text || 0);
    return playsB - playsA;
  });

  assert.strictEqual(matched.length, 2);
  assert.strictEqual(matched[0].artist, 'Sal Priadi');
  assert.strictEqual(matched[0].id, 'sal_1');
  assert.strictEqual(matched[1].artist, 'Eva Pradila');
});

test('renderBottomPlayerArtist renders only artist name and excludes play/view count badges', () => {
  const originalDoc = global.document;
  try {
    function createMockElement(tag = 'div') {
      return {
        tag,
        className: '',
        textContent: '',
        innerHTML: '',
        title: '',
        children: [],
        addEventListener() {},
        appendChild(child) {
          this.children.push(child);
        }
      };
    }

    global.document = {
      createElement: (tag) => createMockElement(tag)
    };

    const playerArtistEl = createMockElement('div');
    const app = {
      playerArtist: playerArtistEl,
      parseTrackArtists: SoraFyDesktopApp.prototype.parseTrackArtists,
      renderBottomPlayerArtist: SoraFyDesktopApp.prototype.renderBottomPlayerArtist,
      openArtistDetail() {}
    };

    // 1. Audio track with play count
    const songTrack = {
      title: 'Creep',
      artist: 'Radiohead',
      play_count_text: '2.3B plays',
      is_video: false
    };
    app.renderBottomPlayerArtist(songTrack);
    assert.strictEqual(playerArtistEl.children.length, 1);
    assert.strictEqual(playerArtistEl.children[0].className, 'player-artist-link');
    assert.strictEqual(playerArtistEl.children[0].textContent, 'Radiohead');
    assert.ok(!playerArtistEl.children.some(c => c.className?.includes('player-metric-badge')));

    // 2. Video track with view count
    playerArtistEl.children = [];
    const videoTrack = {
      title: 'Creep (Official Music Video)',
      artist: 'Radiohead',
      view_count_text: '1.6B views',
      is_video: true
    };
    app.renderBottomPlayerArtist(videoTrack);
    assert.strictEqual(playerArtistEl.children.length, 1);
    assert.strictEqual(playerArtistEl.children[0].className, 'player-artist-link');
    assert.strictEqual(playerArtistEl.children[0].textContent, 'Radiohead');
    assert.ok(!playerArtistEl.children.some(c => c.className?.includes('player-metric-badge')));
  } finally {
    global.document = originalDoc;
  }
});

test('screen player artist display excludes play and view count badges', () => {
  const track = {
    title: 'Creep',
    artist: 'Radiohead',
    play_count_text: '2.3B plays',
    view_count_text: '1.6B views',
    is_video: false
  };

  const app = {
    tracks: [track],
    currentTrackIndex: 0,
    screenPlayerArtist: { innerHTML: '' },
    videoOverlayArtist: { innerHTML: '' },
    videoOverlayTitle: { textContent: '' },
    screenPlayerTitle: { innerHTML: '' },
    likedTrackIds: new Set(),
    escapeHtml: SoraFyDesktopApp.prototype.escapeHtml,
    setScreenPlayerMode() {},
    updateScreenPlayer: SoraFyDesktopApp.prototype.updateScreenPlayer
  };

  app.updateScreenPlayer();
  assert.ok(!app.screenPlayerArtist.innerHTML.includes('screen-metric-badge'));
  assert.ok(!app.screenPlayerArtist.innerHTML.includes('plays'));
  assert.ok(!app.screenPlayerArtist.innerHTML.includes('views'));
  assert.ok(app.screenPlayerArtist.innerHTML.includes('Radiohead'));

  assert.ok(!app.videoOverlayArtist.innerHTML.includes('screen-metric-badge'));
  assert.ok(!app.videoOverlayArtist.innerHTML.includes('plays'));
  assert.ok(!app.videoOverlayArtist.innerHTML.includes('views'));
  assert.ok(app.videoOverlayArtist.innerHTML.includes('Radiohead'));
});

test('renderCommunityPlaylistsDirect does not include avatar badge or orange letter O', () => {
  const originalDoc = global.document;
  try {
    function createMockElement(tag = 'div') {
      return {
        tag,
        className: '',
        innerHTML: '',
        children: [],
        addEventListener() {},
        appendChild(child) {
          this.children.push(child);
        }
      };
    }

    global.document = {
      createElement: (tag) => createMockElement(tag)
    };

    const container = createMockElement('div');
    const app = {
      ytmCommunityPlaylistsRow: container,
      currentLanguage: 'en',
      escapeHtml: SoraFyDesktopApp.prototype.escapeHtml,
      safeImg: SoraFyDesktopApp.prototype.safeImg,
      renderCommunityPlaylistsDirect: SoraFyDesktopApp.prototype.renderCommunityPlaylistsDirect,
      openPlaylistDetail() {}
    };

    const samplePlaylists = [
      {
        title: "Today's Top Hits Pop",
        author: "Official Selection",
        artwork_url: "https://i.ytimg.com/vi/P5ZBISo2CaE/hqdefault.jpg"
      }
    ];

    app.renderCommunityPlaylistsDirect(samplePlaylists);
    assert.strictEqual(container.children.length, 1);
    const cardHtml = container.children[0].innerHTML;
    assert.ok(!cardHtml.includes('ytm-comm-avatar'));
    assert.ok(cardHtml.includes('ytm-comm-art-box'));
    assert.ok(cardHtml.includes('ytm-comm-play-overlay'));
  } finally {
    global.document = originalDoc;
  }
});

test('exploreNewReleasesRow populates top Western and Indonesian artist albums with proper cards', async () => {
  const originalDoc = global.document;
  const originalWindow = global.window;
  try {
    function createMockElement(tag = 'div') {
      return {
        tag,
        className: '',
        innerHTML: '',
        children: [],
        addEventListener() {},
        appendChild(child) {
          this.children.push(child);
        }
      };
    }

    global.document = {
      createElement: (tag) => createMockElement(tag),
      getElementById: () => null,
      querySelectorAll: () => []
    };

    const curatedMockAlbums = [
      { id: 'alb_1', title: 'Semoga Hanya di Mimpi', artist: 'Bernadya', year: 'Album • Bernadya • 2026', artwork_url: 'https://example.com/b.jpg' },
      { id: 'alb_2', title: 'Patient Zero', artist: 'Taylor Swift', year: 'Single • Taylor Swift • 2026', artwork_url: 'https://example.com/ts.jpg' }
    ];

    global.window = {
      electronAPI: {
        fetchNewAlbumReleases: async () => curatedMockAlbums
      }
    };

    const row = createMockElement('div');
    const app = {
      exploreNewReleasesRow: row,
      currentLanguage: 'id',
      exploreLoaded: false,
      escapeHtml: SoraFyDesktopApp.prototype.escapeHtml,
      safeImg: SoraFyDesktopApp.prototype.safeImg,
      loadExploreView: SoraFyDesktopApp.prototype.loadExploreView,
      openAlbumDetail() {}
    };

    await app.loadExploreView();
    assert.strictEqual(row.children.length, 2);
    assert.ok(row.children[0].innerHTML.includes('Bernadya'));
    assert.ok(row.children[1].innerHTML.includes('Taylor Swift'));
    assert.ok(row.children[0].className.includes('album-card'));
  } finally {
    global.document = originalDoc;
    global.window = originalWindow;
  }
});

test('screen player hides audio/video toggle button for mp3 or audio-only tracks', () => {
  const modePill = { style: { display: '' } };
  const modeAudioBtn = { classList: { toggle() {} } };
  const modeVideoBtn = { classList: { toggle() {} } };

  const audioTrack = {
    title: 'Audio Song',
    artist: 'Singer',
    is_video: false
  };

  const videoTrack = {
    id: 'yt_dQw4w9WgXcQ',
    video_id: 'dQw4w9WgXcQ',
    title: 'Music Video',
    artist: 'Singer',
    is_video: true
  };

  const app = {
    tracks: [audioTrack],
    currentTrackIndex: 0,
    currentScreenMode: 'audio',
    screenPlayerModePill: modePill,
    modeAudioBtn,
    modeVideoBtn,
    showToast() {},
    updatePlayPauseIcon() {},
    escapeHtml: SoraFyDesktopApp.prototype.escapeHtml,
    setScreenPlayerMode: SoraFyDesktopApp.prototype.setScreenPlayerMode,
    updateScreenPlayer: SoraFyDesktopApp.prototype.updateScreenPlayer
  };

  // 1. Audio track: mode pill must be hidden ('none') and mode forced to audio
  app.updateScreenPlayer();
  assert.strictEqual(modePill.style.display, 'none');
  assert.strictEqual(app.currentScreenMode, 'audio');

  // Attempting to set video mode on audio track must force audio
  app.setScreenPlayerMode('video');
  assert.strictEqual(app.currentScreenMode, 'audio');

  // 2. Video track: mode pill must be displayed ('inline-flex') and video mode permitted
  app.tracks = [videoTrack];
  app.updateScreenPlayer();
  assert.strictEqual(modePill.style.display, 'inline-flex');
  assert.strictEqual(app.currentScreenMode, 'video');

  app.setScreenPlayerMode('audio');
  assert.strictEqual(app.currentScreenMode, 'audio');
  app.setScreenPlayerMode('video');
  assert.strictEqual(app.currentScreenMode, 'video');
});
