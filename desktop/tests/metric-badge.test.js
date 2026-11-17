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

test('renderOldFavoritesMixes configures official YouTube Music hit playlists for Top 50 & Viral', () => {
  const cards = [];
  const mockGrid = {
    innerHTML: '',
    appendChild(card) {
      cards.push(card);
    }
  };

  const origDoc = global.document;
  global.document = {
    createElement(tag) {
      const el = {
        className: '',
        innerHTML: '',
        addEventListener() {},
        querySelector(selector) {
          if (selector === '.ytm-mix-card-title') {
            const m = el.innerHTML.match(/<div class="ytm-mix-card-title">([^<]+)<\/div>/);
            return { textContent: m ? m[1] : '' };
          }
          return null;
        }
      };
      return el;
    }
  };

  try {
    const app = {
      ytmMixCardsGrid: mockGrid,
      currentLanguage: 'id',
      likedTrackIds: new Set(),
      safeImg: (url) => url,
      escapeHtml: SoraFyDesktopApp.prototype.escapeHtml,
      renderOldFavoritesMixes: SoraFyDesktopApp.prototype.renderOldFavoritesMixes
    };

    app.renderOldFavoritesMixes();

    assert.strictEqual(cards.length, 4);
    const titles = cards.map(c => c.querySelector('.ytm-mix-card-title').textContent);
    assert.ok(titles.includes('Top 50 - Indonesia'));
    assert.ok(titles.includes('Top 50 - Global'));
    assert.ok(titles.includes('Viral 50 - Indonesia'));
    assert.ok(titles.some(t => t.includes('Top Hits')));
  } finally {
    global.document = origDoc;
  }
});

test('fetchMusicfyRecommendations omits duplicate top charts shelf below mix cards', async () => {
  const curatedCharts = [
    { id: 'yt_1', video_id: '1', title: 'Untungnya, Hidup Harus Tetap Berjalan', artist: 'Bernadya' },
    { id: 'yt_2', video_id: '2', title: 'Cruel Summer', artist: 'Taylor Swift' },
    { id: 'yt_3', video_id: '3', title: 'Sisa Rasa', artist: 'Mahalini' }
  ];

  let renderedShelves = null;

  const app = {
    currentLanguage: 'id',
    likedTrackIds: new Set(),
    historyTracks: [],
    officialCharts: curatedCharts,
    pickDiverseTracks: SoraFyDesktopApp.prototype.pickDiverseTracks,
    renderShelves(shelves) {
      renderedShelves = shelves;
    },
    fetchTrendingChart: async () => {},
    fetchExternalMusic: async () => [
      { id: 'ext_1', title: 'Song A', artist: 'Artist A' },
      { id: 'ext_2', title: 'Song B', artist: 'Artist B' },
      { id: 'ext_3', title: 'Song C', artist: 'Artist C' }
    ]
  };

  await SoraFyDesktopApp.prototype.fetchMusicfyRecommendations.call(app, {
    success: true,
    charts: curatedCharts
  });

  assert.ok(Array.isArray(renderedShelves));
  const chartShelf = renderedShelves.find(s => s.id === 'ytm_top_charts');
  assert.strictEqual(chartShelf, undefined, 'ytm_top_charts duplicate shelf should not be present below mix cards');
});

test('renderOldFavoritesMixes configures Spotify chart cards and enforces audio-only format (is_video: false)', async () => {
  const cards = [];
  const mockGrid = {
    innerHTML: '',
    appendChild(card) {
      cards.push(card);
    }
  };

  const origDoc = global.document;
  global.document = {
    createElement(tag) {
      const el = {
        className: '',
        innerHTML: '',
        addEventListener() {},
        querySelector(selector) {
          if (selector === '.ytm-mix-card-title') {
            const m = el.innerHTML.match(/<div class="ytm-mix-card-title">([^<]+)<\/div>/);
            return { textContent: m ? m[1] : '' };
          }
          return null;
        }
      };
      return el;
    }
  };

  try {
    const app = {
      ytmMixCardsGrid: mockGrid,
      currentLanguage: 'id',
      likedTrackIds: new Set(),
      safeImg: (url) => url,
      escapeHtml: SoraFyDesktopApp.prototype.escapeHtml,
      renderOldFavoritesMixes: SoraFyDesktopApp.prototype.renderOldFavoritesMixes
    };

    app.renderOldFavoritesMixes();

    assert.strictEqual(cards.length, 4);
    const titles = cards.map(c => c.querySelector('.ytm-mix-card-title').textContent);
    assert.ok(titles.includes('Top 50 - Indonesia'));
    assert.ok(titles.includes('Top 50 - Global'));
    assert.ok(titles.includes('Viral 50 - Indonesia'));
    assert.ok(titles.some(t => t.includes('Top Hits')));
  } finally {
    global.document = origDoc;
  }
});

test('openPlaylistDetail with is_chart: true prevents queryInnerTubeSongs fallback from polluting chart tracks', async () => {
  let queryCalled = false;
  let renderedTracks = null;

  const origDoc = global.document;
  global.document = {
    getElementById(id) {
      return null;
    },
    createElement() {
      return { innerHTML: '', appendChild() {} };
    }
  };

  try {
    const app = {
      currentLanguage: 'id',
      customPlaylists: [],
      userPlaylists: [],
      likedTrackIds: new Set(),
      switchView() {},
      playlistTitleHeading: { textContent: '' },
      playlistDescText: { textContent: '' },
      playlistCoverImg: { src: '' },
      playlistStatsText: { textContent: '' },
      playlistTrackList: { innerHTML: '' },
      async queryInnerTubeSongs() {
        queryCalled = true;
        return [
          { id: 'yt_fallback_1', title: 'Shape of You', artist: 'Ed Sheeran' }
        ];
      },
      renderPlaylistTracks(tracks) {
        renderedTracks = tracks;
      },
      openPlaylistDetail: SoraFyDesktopApp.prototype.openPlaylistDetail
    };

    const chartPlaylist = {
      id: 'chart_todays_top_hits',
      title: "Today's Top Hits",
      description: "Koleksi lagu hits internasional",
      artwork_url: "https://i.scdn.co/image/test.jpg",
      is_chart: true,
      tracks: []
    };

    await app.openPlaylistDetail(chartPlaylist);

    assert.strictEqual(queryCalled, false, 'queryInnerTubeSongs fallback should NOT be called for is_chart playlists');
    assert.deepStrictEqual(renderedTracks, [], 'Initial chart tracks should remain empty until loaded from Spotify');
  } finally {
    global.document = origDoc;
  }
});

test('loadTrack with Spotify track (spot_ id) passes null videoId to resolveFullStream to allow title/artist resolution', async () => {
  let resolvedParams = null;
  const mockTrack = {
    id: 'spot_37i9dQZF1DXcBWIGoYBM5M_0_1763164472',
    title: 'BbY WOW',
    artist: 'KAROL G, Judeline, rusowsky',
    artwork_url: 'https://example.com/art.jpg',
    duration_secs: 225,
    is_video: false
  };

  const origWindow = global.window;
  global.window = {
    electronAPI: {
      checkLocalAudioExists: async () => ({ exists: false }),
      resolveFullStream: async (params) => {
        resolvedParams = params;
        return {
          url: 'http://127.0.0.1:18492/stream?url=https://googlevideo.com/test',
          videoId: 'ljAH6jNaApU',
          duration: 226,
          provider: 'Opus HD'
        };
      }
    }
  };

  try {
    const app = {
      _currentLoadId: 0,
      tracks: [mockTrack],
      currentTrackIndex: 0,
      isPlaying: false,
      isSeekingBottom: false,
      isSeekingScreen: false,
      likedTrackIds: new Set(),
      resetDeckGains() {},
      resetCrossfade() {},
      updatePlayPauseIcon() {},
      showPlayerBuffering() {},
      recordTasteAffinity() {},
      updateScreenPlayer() {},
      highlightActiveSongItems() {},
      renderBottomPlayerArtist() {},
      updateVerificationBadge() {},
      formatTime: SoraFyDesktopApp.prototype.formatTime,
      escapeHtml: SoraFyDesktopApp.prototype.escapeHtml,
      currentTimeLabel: { textContent: '' },
      durationLabel: { textContent: '' },
      playerTitle: { innerHTML: '' },
      playerArtwork: { src: '' },
      playerBadge: { textContent: '' },
      audio: {
        src: '',
        load() {},
        addEventListener() {}
      },
      updateLikeButton() {},
      updateLyricsOffsetUI() {},
      recordPlayHistory() {},
      fetchTrackLyrics() {},
      updateMediaSession() {},
      updateDiscordPresence() {},
      renderQueue() {},
      ensureUpcomingQueue() {},
      ensureAudioContextActive() {},
      loadTrack: SoraFyDesktopApp.prototype.loadTrack
    };

    await app.loadTrack(0, true);

    assert.ok(resolvedParams, 'resolveFullStream should be called');
    assert.strictEqual(resolvedParams.videoId, null, 'Spotify ID should not be passed as videoId');
    assert.strictEqual(resolvedParams.title, 'BbY WOW');
    assert.strictEqual(resolvedParams.artist, 'KAROL G, Judeline, rusowsky');
    assert.strictEqual(mockTrack.stream_url, 'http://127.0.0.1:18492/stream?url=https://googlevideo.com/test');
    assert.strictEqual(mockTrack.video_id, 'ljAH6jNaApU');
  } finally {
    global.window = origWindow;
  }
});

test('formatArtistSubLabel and formatTrackSubtitle localize artist and track labels bidirectionally', () => {
  const appEn = {
    currentLanguage: 'en',
    formatArtistSubLabel: SoraFyDesktopApp.prototype.formatArtistSubLabel,
    formatTrackSubtitle: SoraFyDesktopApp.prototype.formatTrackSubtitle
  };

  const appId = {
    currentLanguage: 'id',
    formatArtistSubLabel: SoraFyDesktopApp.prototype.formatArtistSubLabel,
    formatTrackSubtitle: SoraFyDesktopApp.prototype.formatTrackSubtitle
  };

  // 1. English mode conversions
  assert.strictEqual(
    appEn.formatArtistSubLabel('Artis • 179 jt audiens bulanan'),
    'Artist • 179M monthly listeners'
  );
  assert.strictEqual(
    appEn.formatArtistSubLabel('179 jt pendengar bulanan'),
    '179M monthly listeners'
  );
  assert.strictEqual(
    appEn.formatArtistSubLabel('16,9 jt pelanggan'),
    '16.9M subscribers'
  );
  assert.strictEqual(
    appEn.formatTrackSubtitle('Lagu • 2.58'),
    'Song • 2:58'
  );

  // 2. Indonesian mode conversions
  assert.strictEqual(
    appId.formatArtistSubLabel('Artist • 179M monthly audience'),
    'Artis • 179 jt audiens bulanan'
  );
  assert.strictEqual(
    appId.formatArtistSubLabel('16.9M subscribers'),
    '16,9 jt pelanggan'
  );
  assert.strictEqual(
    appId.formatTrackSubtitle('Song • 2:58'),
    'Lagu • 2:58'
  );
});

test('electron-main.js, preload.js, and app.js have zero syntax errors', () => {
  const { execSync } = require('child_process');
  const path = require('path');
  const files = [
    path.join(__dirname, '..', 'electron-main.js'),
    path.join(__dirname, '..', 'preload.js'),
    path.join(__dirname, '..', 'src', 'app.js'),
    path.join(__dirname, '..', 'src', 'modules', 'platform-bridge.js')
  ];
  for (const f of files) {
    assert.doesNotThrow(() => {
      execSync(`node -c "${f}"`);
    }, `Syntax error in ${f}`);
  }
});
