const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { SoraFyDesktopApp } = require('../src/app');
const BulkImporter = require('../src/modules/bulk-importer');

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
    toBeNull() {
      assert.strictEqual(actual, null);
    },
    toBeTruthy() {
      assert.ok(actual);
    },
    toBeFalsy() {
      assert.ok(!actual);
    },
    toContain(item) {
      if (Array.isArray(actual)) {
        assert.ok(
          actual.includes(item),
          `Expected array to contain ${item}, but got: ${JSON.stringify(actual)}`
        );
      } else if (typeof actual === 'string') {
        assert.ok(
          actual.includes(item),
          `Expected string to contain "${item}", but got: "${actual}"`
        );
      } else {
        throw new Error('toContain requires array or string');
      }
    }
  };
}

// -------------------------------------------------------------
// 1. Static Markup Verification in index.html
// -------------------------------------------------------------
test('index.html contains all required modal markup, module scripts, and buttons', () => {
  const htmlPath = path.join(__dirname, '../src/index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Module scripts in <head>
  expect(html).toContain('<script src="modules/bulk-importer.js"></script>');
  expect(html).toContain('<script src="modules/audio-nodes.js"></script>');
  expect(html).toContain('<script src="modules/audio-deck-state.js"></script>');
  expect(html).toContain('<script src="modules/local-interceptor.js"></script>');

  // Sidebar migration buttons
  expect(html).toContain('id="sidebarMigrateLibraryBtn"');
  expect(html).toContain('id="sidebarMigrateLibraryActionBtn"');
  expect(html).toContain('btn-open-import-library');

  // Playlist download button with class
  expect(html).toContain('btn-download-playlist');
  expect(html).toContain('id="playlistDownloadAllBtn"');

  // Modal elements
  expect(html).toContain('id="modal-import-library"');
  expect(html).toContain('id="closeImportLibraryModalBtn"');
  expect(html).toContain('id="cancelImportLibraryBtn"');
  expect(html).toContain('id="startImportLibraryBtn"');

  // Tabs
  expect(html).toContain('id="tabBtnImportFile"');
  expect(html).toContain('id="tabBtnImportLinks"');
  expect(html).toContain('id="tabContentImportFile"');
  expect(html).toContain('id="tabContentImportLinks"');

  // Drop zone & file input
  expect(html).toContain('id="importDropZone"');
  expect(html).toContain('id="importFileInput"');
  expect(html).toContain('id="importFilePickBtn"');
  expect(html).toContain('id="importFileInfo"');
  expect(html).toContain('id="importFileName"');
  expect(html).toContain('id="importClearFileBtn"');

  // Multi-URL textarea
  expect(html).toContain('id="importMultiUrlInput"');

  // Destination options
  expect(html).toContain('id="destPlaylist"');
  expect(html).toContain('id="destLiked"');
  expect(html).toContain('name="importDestination"');

  // Progress bar elements
  expect(html).toContain('id="import-library-progress"');
  expect(html).toContain('id="importProgressBar"');
  expect(html).toContain('id="importProgressStatus"');
  expect(html).toContain('id="importProgressPercent"');
});

// -------------------------------------------------------------
// 2. CSS Design Tokens Verification in style.css
// -------------------------------------------------------------
test('style.css implements OLED Obsidian Void and Priangan Emerald styling', () => {
  const cssPath = path.join(__dirname, '../src/style.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  // Design tokens & colors
  expect(css).toContain('#0B0D10'); // Obsidian Void
  expect(css).toContain('#181C22'); // Slate Surface
  expect(css).toContain('#262C36'); // Border
  expect(css).toContain('#00E599'); // Priangan Emerald

  // Component classes
  expect(css).toContain('.import-library-backdrop');
  expect(css).toContain('.import-library-card');
  expect(css).toContain('.import-tab-btn');
  expect(css).toContain('.import-drop-zone');
  expect(css).toContain('.import-progress-bar');
  expect(css).toContain('.sidebar-migrate-btn');
  expect(css).toContain('.btn-download-playlist');
});

// -------------------------------------------------------------
// 3. UI Modal Mock Factory Helper
// -------------------------------------------------------------
function createMockModalEnv() {
  const listeners = {};

  function makeElement(id = '', tag = 'div') {
    const elListeners = {};
    const classes = new Set();
    return {
      id,
      tagName: tag.toUpperCase(),
      style: { display: 'none', width: '0%' },
      classList: {
        add: (c) => classes.add(c),
        remove: (c) => classes.delete(c),
        contains: (c) => classes.has(c)
      },
      textContent: '',
      value: '',
      disabled: false,
      addEventListener: (evt, fn) => {
        elListeners[evt] = elListeners[evt] || [];
        elListeners[evt].push(fn);
      },
      click: function() {
        if (elListeners['click']) {
          elListeners['click'].forEach(fn => fn({ target: this, stopPropagation() {} }));
        }
      },
      trigger: function(evt, eventObj = {}) {
        if (elListeners[evt]) {
          elListeners[evt].forEach(fn => fn({ target: this, preventDefault() {}, stopPropagation() {}, ...eventObj }));
        }
      },
      querySelector: () => null,
      querySelectorAll: () => []
    };
  }

  const modal = makeElement('modal-import-library');
  const sidebarBtn = makeElement('sidebarMigrateLibraryBtn');
  const sidebarActionBtn = makeElement('sidebarMigrateLibraryActionBtn');
  const closeBtn = makeElement('closeImportLibraryModalBtn');
  const cancelBtn = makeElement('cancelImportLibraryBtn');
  const startBtn = makeElement('startImportLibraryBtn');
  const tabBtnFile = makeElement('tabBtnImportFile');
  const tabBtnLinks = makeElement('tabBtnImportLinks');
  const tabContentFile = makeElement('tabContentImportFile');
  const tabContentLinks = makeElement('tabContentImportLinks');
  const dropZone = makeElement('importDropZone');
  const fileInput = makeElement('importFileInput', 'input');
  const filePickBtn = makeElement('importFilePickBtn');
  const fileInfo = makeElement('importFileInfo');
  const fileName = makeElement('importFileName');
  const fileSize = makeElement('importFileSize');
  const clearFileBtn = makeElement('importClearFileBtn');
  const multiUrlInput = makeElement('importMultiUrlInput', 'textarea');
  const progressSec = makeElement('import-library-progress');
  const progressBar = makeElement('importProgressBar');
  const progressStatus = makeElement('importProgressStatus');
  const progressPercent = makeElement('importProgressPercent');

  const elementsMap = {
    'modal-import-library': modal,
    'sidebarMigrateLibraryBtn': sidebarBtn,
    'sidebarMigrateLibraryActionBtn': sidebarActionBtn,
    'closeImportLibraryModalBtn': closeBtn,
    'cancelImportLibraryBtn': cancelBtn,
    'startImportLibraryBtn': startBtn,
    'tabBtnImportFile': tabBtnFile,
    'tabBtnImportLinks': tabBtnLinks,
    'tabContentImportFile': tabContentFile,
    'tabContentImportLinks': tabContentLinks,
    'tabContentFile': tabContentFile,
    'tabContentLinks': tabContentLinks,
    'importDropZone': dropZone,
    'importFileInput': fileInput,
    'importFilePickBtn': filePickBtn,
    'importFileInfo': fileInfo,
    'importFileName': fileName,
    'importFileSize': fileSize,
    'importClearFileBtn': clearFileBtn,
    'importMultiUrlInput': multiUrlInput,
    'import-library-progress': progressSec,
    'importProgressBar': progressBar,
    'importProgressStatus': progressStatus,
    'importProgressPercent': progressPercent
  };

  let mockDestination = 'playlist';

  const mockDocument = {
    getElementById: (id) => elementsMap[id] || null,
    querySelectorAll: () => [],
    querySelector: (sel) => {
      if (sel.includes('importDestination')) {
        return { value: mockDestination };
      }
      return null;
    }
  };

  const toasts = [];
  const mockLocalStorage = {};

  const app = {
    currentLanguage: 'id',
    modalImportLibrary: modal,
    sidebarMigrateLibraryBtn: sidebarBtn,
    sidebarMigrateLibraryActionBtn: sidebarActionBtn,
    closeImportLibraryModalBtn: closeBtn,
    cancelImportLibraryBtn: cancelBtn,
    startImportLibraryBtn: startBtn,
    tabBtnImportFile: tabBtnFile,
    tabBtnImportLinks: tabBtnLinks,
    tabContentImportFile: tabContentFile,
    tabContentImportLinks: tabContentLinks,
    importDropZone: dropZone,
    importFileInput: fileInput,
    importFilePickBtn: filePickBtn,
    importFileInfo: fileInfo,
    importFileName: fileName,
    importFileSize: fileSize,
    importClearFileBtn: clearFileBtn,
    importMultiUrlInput: multiUrlInput,
    importLibraryProgress: progressSec,
    importProgressBar: progressBar,
    importProgressStatus: progressStatus,
    importProgressPercent: progressPercent,
    likedTrackIds: new Set(),
    likedSongs: [],
    favoriteSongs: [],
    userPlaylists: [],
    showToast: (msg) => toasts.push(msg),
    updateLikeButton: () => {},
    renderUserPlaylists: () => {},
    saveUserPlaylists: () => {},
    openPlaylistDetail: () => {},
    initImportLibraryModal: SoraFyDesktopApp.prototype.initImportLibraryModal,
    resetImportLibraryState: SoraFyDesktopApp.prototype.resetImportLibraryState,
    clearSelectedImportFile: SoraFyDesktopApp.prototype.clearSelectedImportFile,
    updateImportLibraryProgress: SoraFyDesktopApp.prototype.updateImportLibraryProgress,
    handleStartImportLibrary: SoraFyDesktopApp.prototype.handleStartImportLibrary,
    saveCustomPlaylist: SoraFyDesktopApp.prototype.saveCustomPlaylist
  };

  return {
    app,
    elements: elementsMap,
    toasts,
    mockDocument,
    setDestination: (d) => { mockDestination = d; }
  };
}

// -------------------------------------------------------------
// 4. Modal Open/Close & Tab Switching Lifecycle Tests
// -------------------------------------------------------------
test('initImportLibraryModal binds open, close, and tab switching handlers correctly', () => {
  const { app, elements } = createMockModalEnv();
  app.initImportLibraryModal();

  // Initially hidden
  expect(elements['modal-import-library'].style.display).toBe('none');

  // Click sidebar migrate button -> open modal
  elements.sidebarMigrateLibraryBtn.click();
  expect(elements['modal-import-library'].style.display).toBe('flex');
  expect(app.activeImportTab).toBe('file');

  // Switch to Links Tab
  elements.tabBtnImportLinks.click();
  expect(app.activeImportTab).toBe('links');
  expect(elements.tabContentLinks.style.display).toBe('block');
  expect(elements.tabContentFile.style.display).toBe('none');
  expect(elements.tabBtnImportLinks.classList.contains('active')).toBe(true);

  // Switch back to File Tab
  elements.tabBtnImportFile.click();
  expect(app.activeImportTab).toBe('file');
  expect(elements.tabContentFile.style.display).toBe('block');
  expect(elements.tabContentLinks.style.display).toBe('none');
  expect(elements.tabBtnImportFile.classList.contains('active')).toBe(true);

  // Click Close button -> close modal
  elements.closeImportLibraryModalBtn.click();
  expect(elements['modal-import-library'].style.display).toBe('none');

  // Click Action button -> reopen modal
  elements.sidebarMigrateLibraryActionBtn.click();
  expect(elements['modal-import-library'].style.display).toBe('flex');

  // Click Cancel button -> close modal
  elements.cancelImportLibraryBtn.click();
  expect(elements['modal-import-library'].style.display).toBe('none');
});

// -------------------------------------------------------------
// 5. Drag-and-Drop & File Selection UI Tests
// -------------------------------------------------------------
test('importDropZone handles dragover and drop events cleanly', () => {
  const { app, elements } = createMockModalEnv();
  app.initImportLibraryModal();

  // Drag over drop zone
  elements.importDropZone.trigger('dragover');
  expect(elements.importDropZone.classList.contains('dragover')).toBe(true);

  // Drag leave drop zone
  elements.importDropZone.trigger('dragleave');
  expect(elements.importDropZone.classList.contains('dragover')).toBe(false);

  // Drop a simulated file
  const mockFile = {
    name: 'soundiiz_export.csv',
    size: 2048,
    text: async () => 'Title,Artist,Album\nKarma Police,Radiohead,OK Computer'
  };

  elements.importDropZone.trigger('drop', {
    dataTransfer: { files: [mockFile] }
  });

  expect(app.selectedImportFile).toBe(mockFile);
  expect(elements.importFileName.textContent).toBe('soundiiz_export.csv');
  expect(elements.importFileInfo.style.display).toBe('flex');

  // Clear selected file
  elements.importClearFileBtn.click();
  expect(app.selectedImportFile).toBeNull();
  expect(elements.importFileInfo.style.display).toBe('none');
});

// -------------------------------------------------------------
// 6. Ingestion Logic: "Simpan ke Liked Songs"
// -------------------------------------------------------------
test('handleStartImportLibrary imports CSV tracks directly into Liked Songs without duplicates', async () => {
  const { app, elements, toasts, setDestination, mockDocument } = createMockModalEnv();
  const originalDoc = global.document;
  const originalWindow = global.window;
  const originalLocalStorage = global.localStorage;

  const storageStore = {};
  global.localStorage = {
    getItem: (k) => storageStore[k] || null,
    setItem: (k, v) => { storageStore[k] = v; }
  };
  global.document = mockDocument;
  global.window = { BulkImporter };

  try {
    app.initImportLibraryModal();
    setDestination('liked');

    const csvData = [
      'Title,Artist,Album,Duration',
      'Let Down,Radiohead,OK Computer,299',
      'Paranoid Android,Radiohead,OK Computer,387',
      'No Surprises,Radiohead,OK Computer,228'
    ].join('\n');

    app.selectedImportFile = { name: 'my_songs.csv', size: 1024 };
    app.selectedImportFileContent = csvData;
    app.activeImportTab = 'file';

    await app.handleStartImportLibrary();

    expect(app.likedTrackIds.size).toBe(3);
    expect(app.likedSongs.length).toBe(3);
    expect(app.likedSongs[0].title).toBe('No Surprises');
    expect(storageStore['sorafy_liked_ids']).toBeDefined();
    expect(storageStore['sorafy_liked_tracks']).toBeDefined();
    expect(toasts.some(t => t.includes('Berhasil mengimpor 3 lagu'))).toBe(true);

    // Verify duplicate prevention on second import with same tracks
    toasts.length = 0;
    await app.handleStartImportLibrary();
    expect(app.likedTrackIds.size).toBe(3); // Count remains 3
    expect(toasts.some(t => t.includes('Berhasil mengimpor 0 lagu'))).toBe(true);
  } finally {
    global.document = originalDoc;
    global.window = originalWindow;
    global.localStorage = originalLocalStorage;
  }
});

// -------------------------------------------------------------
// 7. Ingestion Logic: "Buat Playlist Baru Otomatis"
// -------------------------------------------------------------
test('handleStartImportLibrary imports JSON playlists into userPlaylists', async () => {
  const { app, toasts, setDestination, mockDocument } = createMockModalEnv();
  const originalDoc = global.document;
  const originalWindow = global.window;

  global.document = mockDocument;
  global.window = { BulkImporter };

  try {
    app.initImportLibraryModal();
    setDestination('playlist');

    const spotMyBackupJson = JSON.stringify({
      playlists: [
        {
          name: 'Indie Classics',
          tracks: [
            { track: { name: 'There Is a Light That Never Goes Out', artists: [{ name: 'The Smiths' }], album: { name: 'The Queen Is Dead' } } },
            { track: { name: 'Disorder', artists: [{ name: 'Joy Division' }], album: { name: 'Unknown Pleasures' } } }
          ]
        },
        {
          name: 'Shoegaze Mix',
          tracks: [
            { track: { name: 'When You Sleep', artists: [{ name: 'My Bloody Valentine' }], album: { name: 'Loveless' } } }
          ]
        }
      ]
    });

    app.selectedImportFile = { name: 'backup.json', size: 4096 };
    app.selectedImportFileContent = spotMyBackupJson;
    app.activeImportTab = 'file';

    let detailOpened = null;
    app.openPlaylistDetail = (pl) => { detailOpened = pl; };

    await app.handleStartImportLibrary();

    expect(app.userPlaylists.length).toBe(2);
    expect(app.userPlaylists[1].title).toBe('Indie Classics');
    expect(app.userPlaylists[1].tracks.length).toBe(2);
    expect(app.userPlaylists[0].title).toBe('Shoegaze Mix');
    expect(app.userPlaylists[0].tracks.length).toBe(1);
    expect(detailOpened).toBeDefined();
    expect(detailOpened.title).toBe('Shoegaze Mix');
    expect(toasts.some(t => t.includes('Berhasil mengimpor 3 lagu ke 2 playlist'))).toBe(true);
  } finally {
    global.document = originalDoc;
    global.window = originalWindow;
  }
});

// -------------------------------------------------------------
// 8. Ingestion Logic: Multiple Links with external resolver
// -------------------------------------------------------------
test('handleStartImportLibrary resolves multiple links and tracks progress', async () => {
  const { app, elements, toasts, setDestination, mockDocument } = createMockModalEnv();
  const originalDoc = global.document;
  const originalWindow = global.window;

  const resolvedUrls = [];
  global.document = mockDocument;
  global.window = {
    BulkImporter,
    electronAPI: {
      importExternalPlaylist: async (url) => {
        resolvedUrls.push(url);
        return {
          success: true,
          provider: 'Spotify',
          title: url.includes('37i9dQZF1DXcBWIGoYBM5M') ? 'Today Top Hits' : 'Rock Classics',
          tracks: [
            { id: 't1_' + resolvedUrls.length, title: 'Hit ' + resolvedUrls.length, artist: 'Star', duration: 180 }
          ]
        };
      }
    }
  };

  try {
    app.initImportLibraryModal();
    setDestination('playlist');
    app.activeImportTab = 'links';

    elements.importMultiUrlInput.value = [
      'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
      'https://open.spotify.com/playlist/37i9dQZF1DXcfuutep9v1P'
    ].join('\n');

    await app.handleStartImportLibrary();

    expect(resolvedUrls.length).toBe(2);
    expect(app.userPlaylists.length).toBe(2);
    expect(toasts.some(t => t.includes('Berhasil mengimpor 2 lagu'))).toBe(true);
    expect(elements.importProgressBar.style.width).toBe('100%');
  } finally {
    global.document = originalDoc;
    global.window = originalWindow;
  }
});

// -------------------------------------------------------------
// 9. Edge Cases & Safe Error Guards
// -------------------------------------------------------------
test('handleStartImportLibrary alerts user when file is empty or no valid links entered', async () => {
  const { app, elements, toasts, mockDocument } = createMockModalEnv();
  const originalDoc = global.document;
  const originalWindow = global.window;

  global.document = mockDocument;
  global.window = { BulkImporter };

  try {
    app.initImportLibraryModal();

    // 1. File tab without selecting any file
    app.activeImportTab = 'file';
    app.selectedImportFileContent = null;
    await app.handleStartImportLibrary();
    expect(toasts.some(t => t.includes('Silakan pilih atau tarik file'))).toBe(true);

    // 2. File tab with empty file content
    toasts.length = 0;
    app.selectedImportFileContent = '   ';
    await app.handleStartImportLibrary();
    expect(toasts.some(t => t.includes('Tidak ada lagu yang ditemukan'))).toBe(true);

    // 3. Links tab without URLs
    toasts.length = 0;
    app.activeImportTab = 'links';
    elements.importMultiUrlInput.value = 'invalid non-url text';
    await app.handleStartImportLibrary();
    expect(toasts.some(t => t.includes('setidaknya satu tautan'))).toBe(true);
  } finally {
    global.document = originalDoc;
    global.window = originalWindow;
  }
});
