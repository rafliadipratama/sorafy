# SoraFy Desktop Migration & Playback Stability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun ekosistem migrasi instan dan stabilitas pemutaran audio di SoraFy Desktop untuk pengguna yang beralih dari Spotify, Apple Music, dan YouTube Music, mencakup Bulk Library Importer (Soundiiz/TuneMyMusic/SpotMYBackup/Multi-URL), Dual-Deck Gapless & True Crossfade Engine, Real Loudness Normalization dengan Transparent Bypass, 1-Click Offline Playlist Download dengan Local-First Playback, serta Windows Taskbar ThumbBar Controls.

**Architecture:** Modul terpisah dan *in-engine* pada arsitektur Electron dan Web Audio API: modul parser file migrasi di backend/renderer, rantai Web Audio DSP (dual-deck gain -> equalizer -> dynamics compressor -> master gain), interceptor audio lokal berbasis disk cache di `electron-main.js`, dan tombol kontrol OS thumbnail melalui Electron native APIs.

**Tech Stack:** JavaScript (ES6+ / Node.js 18+), Electron 28+, Web Audio API (AudioContext, DynamicsCompressorNode, GainNode, BiquadFilterNode), HTML5 Audio, Jest / Node Test Runner.

**Spec:** [`docs/superpowers/specs/2026-11-10-desktop-migration-stability-design.md`](file:///home/rafliadipratama/sorafy/docs/superpowers/specs/2026-11-10-desktop-migration-stability-design.md)

## Global Constraints

- 100% kompatibel dengan Electron IPC dan Web Audio DSP yang sudah ada tanpa merusak 7-band parametric EQ, visualizer spektrum, dan SoraFy Jam LAN remote.
- Tidak menggunakan library biner C++ eksternal yang memerlukan kompilasi native khusus (menjaga portabilitas cross-platform Linux, macOS, dan Windows).
- Zero data loss pada impor koleksi: metadata (judul, artis, album, durasi) disimpan langsung secara persisten ke disk lokal pengguna (`localStorage` dan config lokal).
- Transparent bypass pada normalisasi volume: saat dimatikan, audio harus bebas distorsi tanpa kompresi dinamis (`ratio = 1.0`, `threshold = 0`, `masterGain = 1.0`).

## Review Focus

- File CSV / JSON Soundiiz atau SpotMYBackup dengan header kolom yang tidak standar atau format tanggal aneh harus tetap dapat mengekstrak judul dan artis dengan benar tanpa melempar runtime exception.
- Lagu dengan durasi sangat pendek (<20 detik) tidak boleh menyebabkan infinite loop atau pemanggilan ganda pada timer prefetching / crossfade.
- Pergantian lagu secara manual saat *crossfade* sedang berjalan tidak boleh meninggalkan suara tumpang tindih (*audio ghosting*) dari deck sebelumnya.
- Jika file offline di `~/Music/SoraFy` rusak atau terhapus sebagian, interceptor lokal harus otomatis fallback ke online streaming tanpa memutus playback.
- Pemanggilan `setThumbarButtons` di platform non-Windows (Linux / macOS) harus diabaikan secara aman (*graceful no-op*) tanpa menghasilkan error.

---

### Task 1: Bulk Library Importer Core (CSV, JSON, SpotMYBackup/Soundiiz Parser)

**Files:**
- Create: `desktop/src/modules/bulk-importer.js`
- Test: `desktop/tests/bulk-importer.test.js`

**Interfaces:**
- Produces:
  - `parseLibraryData(rawText: string, fileType: 'csv'|'json'|'text'): { playlists: Array<{ name: string, tracks: Array<{ title: string, artist: string, album?: string, duration?: number }> }> }`
  - `parseMultiUrls(urlText: string): Array<string>`

- [ ] **Step 1: Buat failing test untuk parser file library**

```javascript
// desktop/tests/bulk-importer.test.js
const { parseLibraryData, parseMultiUrls } = require('../src/modules/bulk-importer');

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
```

- [ ] **Step 2: Jalankan test untuk memverifikasi kegagalan**

Run: `node --test desktop/tests/bulk-importer.test.js`
Expected: FAIL dengan "Cannot find module"

- [ ] **Step 3: Implementasikan `bulk-importer.js`**

Implementasikan parser CSV otomatis mengenali delimiter (koma atau titik koma), pencocokan header fleksibel (`Title`, `Track Name`, `Song Name`, `Artist`, `Artist Name`, `Album`), serta JSON parser untuk struktur SpotMYBackup dan format array standar.

- [ ] **Step 4: Jalankan test untuk memverifikasi kelulusan**

Run: `node --test desktop/tests/bulk-importer.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add desktop/src/modules/bulk-importer.js desktop/tests/bulk-importer.test.js
git commit -m "feat(desktop): implement bulk library importer parser module"
```

---

### Task 2: Real Loudness Normalization & Transparent Bypass

**Files:**
- Modify: `desktop/src/app.js`
- Test: `desktop/tests/loudness-normalizer.test.js`

**Interfaces:**
- Consumes: `this.audioContext`, `this.appSettings.volumeNormalization`
- Produces: `this.compressorNode`, `this.setVolumeNormalization(enabled: boolean)`

- [ ] **Step 1: Buat failing test untuk konfigurasi compressor & bypass**

```javascript
// desktop/tests/loudness-normalizer.test.js
const { getNormalizationParams } = require('../src/modules/audio-nodes');

test('returns calibrated streaming compression values when enabled', () => {
  const params = getNormalizationParams(true);
  expect(params.threshold).toBe(-18);
  expect(params.ratio).toBe(4.0);
  expect(params.masterGain).toBe(1.15);
});

test('returns transparent bit-perfect bypass values when disabled', () => {
  const params = getNormalizationParams(false);
  expect(params.threshold).toBe(0);
  expect(params.ratio).toBe(1.0);
  expect(params.masterGain).toBe(1.0);
});
```

- [ ] **Step 2: Jalankan test untuk memverifikasi kegagalan**

Run: `node --test desktop/tests/loudness-normalizer.test.js`
Expected: FAIL dengan "Cannot find module"

- [ ] **Step 3: Implementasikan modul parameter audio dan integrasikan ke Web Audio Graph `app.js`**

Buat helper `desktop/src/modules/audio-nodes.js`. Di `desktop/src/app.js`, sambungkan `this.compressorNode` ke dalam rantai Web Audio:
`source -> eqNodes -> compressorNode -> masterGainNode -> destination`.
Pada event handler `settingVolumeNorm.addEventListener('change', ...)`, panggil `this.setVolumeNormalization(enabled)`.

- [ ] **Step 4: Jalankan test untuk memverifikasi kelulusan**

Run: `node --test desktop/tests/loudness-normalizer.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add desktop/src/modules/audio-nodes.js desktop/src/app.js desktop/tests/loudness-normalizer.test.js
git commit -m "feat(desktop): wire real loudness normalization compressor into web audio graph"
```

---

### Task 3: Dual-Deck Gapless & True Crossfade Engine

**Files:**
- Modify: `desktop/src/app.js`
- Test: `desktop/tests/dual-deck.test.js`

**Interfaces:**
- Consumes: `this.queue`, `this.currentIndex`, `this.appSettings.crossfadeDuration`
- Produces: `this.activeDeck`, `this.preloadDeck`, `this.handleCrossfadeTick()`, `this.swapDecks()`

- [ ] **Step 1: Buat test state machine transisi audio deck**

```javascript
// desktop/tests/dual-deck.test.js
const { shouldTriggerPrefetch, calculateCrossfadeGains } = require('../src/modules/audio-deck-state');

test('triggers prefetch when remaining time <= 15s', () => {
  expect(shouldTriggerPrefetch(185, 200, false)).toBe(true);
  expect(shouldTriggerPrefetch(170, 200, false)).toBe(false);
  expect(shouldTriggerPrefetch(190, 200, true)).toBe(false); // already prefetching
});

test('calculates crossfade gains correctly during transition window', () => {
  // duration 100, crossfade 6, current 97 (middle of crossfade)
  const { currentGain, nextGain } = calculateCrossfadeGains(97, 100, 6);
  expect(currentGain).toBeCloseTo(0.5, 1);
  expect(nextGain).toBeCloseTo(0.5, 1);
});
```

- [ ] **Step 2: Jalankan test untuk memverifikasi kegagalan**

Run: `node --test desktop/tests/dual-deck.test.js`
Expected: FAIL

- [ ] **Step 3: Implementasikan `desktop/src/modules/audio-deck-state.js` & pasang Dual-Deck di `app.js`**

Kembangkan `deckA` dan `deckB` dengan node Gain independen di `desktop/src/app.js`. Saat `timeupdate` mendeteksi sisa waktu $\le 15$s, panggil resolver stream track berikutnya ke buffer deck sekunder. Jalankan transisi gain halus saat `currentTime >= duration - crossfadeDuration`.

- [ ] **Step 4: Jalankan test untuk memverifikasi kelulusan**

Run: `node --test desktop/tests/dual-deck.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add desktop/src/modules/audio-deck-state.js desktop/src/app.js desktop/tests/dual-deck.test.js
git commit -m "feat(desktop): implement dual-deck gapless and true crossfade engine"
```

---

### Task 4: 1-Click Offline Playlist Download & Local-First Playback

**Files:**
- Modify: `desktop/electron-main.js`
- Modify: `desktop/preload.js`
- Modify: `desktop/src/app.js`
- Test: `desktop/tests/local-interceptor.test.js`

**Interfaces:**
- Consumes: `~/Music/SoraFy`, `download-track` IPC
- Produces:
  - IPC: `download-playlist-batch`
  - Helper: `resolveLocalAudioPath(track: Object): string | null`

- [ ] **Step 1: Buat failing test untuk deteksi dan sanitasi nama file lokal**

```javascript
// desktop/tests/local-interceptor.test.js
const { getExpectedLocalFilenames } = require('../src/modules/local-interceptor');

test('generates expected local filenames for track matching', () => {
  const track = { title: "Let Down (Remastered)", artist: "Radiohead" };
  const filenames = getExpectedLocalFilenames(track);
  expect(filenames).toContain("Radiohead - Let Down.mp3");
  expect(filenames).toContain("Radiohead - Let Down.opus");
});
```

- [ ] **Step 2: Jalankan test untuk memverifikasi kegagalan**

Run: `node --test desktop/tests/local-interceptor.test.js`
Expected: FAIL

- [ ] **Step 3: Implementasikan deteksi lokal & IPC batch download**

1. Buat `desktop/src/modules/local-interceptor.js`.
2. Di `desktop/electron-main.js`, tambahkan IPC handler `check-local-audio-exists` dan `download-playlist-batch`.
3. Di `desktop/src/app.js`: Di dalam `loadTrack(track)`, cek apakah file sudah ada di lokal disk; jika ada, putar langsung via proxy `http://127.0.0.1:3721/stream?file=...`.
4. Tambahkan tombol "Download Playlist" di header playlist yang memicu pengunduhan berurutan dengan indikator status unduh.

- [ ] **Step 4: Jalankan test untuk memverifikasi kelulusan**

Run: `node --test desktop/tests/local-interceptor.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add desktop/src/modules/local-interceptor.js desktop/electron-main.js desktop/preload.js desktop/src/app.js desktop/tests/local-interceptor.test.js
git commit -m "feat(desktop): add 1-click playlist download and local-first audio playback"
```

---

### Task 5: Windows Taskbar ThumbBar Controls & MediaSession Sync

**Files:**
- Modify: `desktop/electron-main.js`
- Modify: `desktop/preload.js`
- Modify: `desktop/src/app.js`

**Interfaces:**
- Produces:
  - IPC: `set-thumbar-state` (`{ isPlaying: boolean }`)
  - Electron: `mainWindow.setThumbarButtons()`

- [ ] **Step 1: Buat helper ikon tombol taskbar di `electron-main.js`**

Implementasikan pembuatan ikon dinamis (Prev, Play, Pause, Next) dengan `nativeImage.createFromBuffer` atau asset PNG 24x24 transparan.
Cek `process.platform === 'win32'` sebelum memanggil `mainWindow.setThumbarButtons()`.

- [ ] **Step 2: Tambahkan IPC channel `set-thumbar-state`**

Saat renderer mengirimkan event perubahan status pemutaran (`play`/`pause`), perbarui tombol thumbnail di taskbar Windows secara instan.

- [ ] **Step 3: Sempurnakan sinkronisasi `navigator.mediaSession`**

Pastikan metadata, artwork cover art, `playbackState`, dan `setPositionState` selalu ter-update secara konsisten di `app.js` setiap kali lagu berganti atau posisi seekbar bergeser.

- [ ] **Step 4: Commit**

```bash
git add desktop/electron-main.js desktop/preload.js desktop/src/app.js
git commit -m "feat(desktop): implement windows taskbar thumbbar controls and mediaSession sync"
```

---

### Task 6: UI Modal Integration (Import Library Modal & Download Playlist Button)

**Files:**
- Modify: `desktop/src/index.html`
- Modify: `desktop/src/style.css`
- Modify: `desktop/src/app.js`

**Interfaces:**
- Produces:
  - Element: `#modal-import-library`
  - Element: `.btn-download-playlist`
  - Event Listeners: Modal drag-and-drop file upload, URL submit, progress tracker

- [ ] **Step 1: Tambahkan markup HTML untuk Modal Impor Library di `index.html`**

Tambahkan modal elegan bertema OLED dengan dua tab: "Upload File (.csv / .json)" dan "Multi-URL Playlist". Tambahkan tombol pembuka modal di menu sidebar Library.

- [ ] **Step 2: Tambahkan styling CSS di `style.css`**

Terapkan style konsisten dengan tema Obsidian Void (`#0B0D10`), Slate Surface (`#181C22`), dan Priangan Emerald (`#00E599`).

- [ ] **Step 3: Sambungkan interaksi antarmuka di `app.js`**

Tambahkan logika buka/tutup modal, pembacaan file dengan `FileReader`, pemanggilan `parseLibraryData`, dan pembuatan playlist / penyimpanan ke Liked Songs dengan progress dialog interaktif.

- [ ] **Step 4: Commit**

```bash
git add desktop/src/index.html desktop/src/style.css desktop/src/app.js
git commit -m "feat(desktop): add library import modal and playlist download button UI"
```

---

### Task 7: Full Integration Testing & Build Verification

**Files:**
- Test: All tests in `desktop/tests/`

- [ ] **Step 1: Jalankan seluruh rangkaian test unit**

Run: `npm test` atau `node --test desktop/tests/*.test.js` di direktori `desktop/`
Expected: Semua pengujian lulus (PASS) tanpa error.

- [ ] **Step 2: Verifikasi sintaks & build desktop**

Pastikan tidak ada sintaks error di `electron-main.js`, `preload.js`, dan `app.js`.

- [ ] **Step 3: Commit & Push**

```bash
git add .
git commit -m "feat(desktop): finalize migration and stability features for desktop"
git push origin main
```
