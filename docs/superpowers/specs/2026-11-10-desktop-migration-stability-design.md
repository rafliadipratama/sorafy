# Spesifikasi Desain: SoraFy Desktop Native Migration & Playback Stability (Pendekatan A)

**Tanggal:** 2026-11-10  
**Status:** Draf Direvisi Pasca-Builder Review (Menunggu Persetujuan Pengguna)  
**Target:** SoraFy Desktop (Electron + Web Audio DSP + IPC Architecture)  
**Tujuan:** Menyediakan pengalaman migrasi instan, pemutaran tanpa jeda (*zero latency gapless & true crossfade*), normalisasi volume transparan (*loudness normalization*), unduhan playlist 1-klik dengan pemutaran *local-first*, dan kontrol sistem operasi native bagi pengguna yang bermigrasi dari Spotify, Apple Music, dan YouTube Music.

---

## 1. Latar Belakang & Intent

Pengguna yang bermigrasi dari layanan streaming komersial (Spotify, Apple Music, YouTube Music) memiliki ekspektasi standar:
1. **Koleksi Tidak Hilang**: Pengguna enggan beralih jika harus menyalin ratusan *Liked Songs* dan puluhan playlist satu per satu.
2. **Audio Instan & Nyaman**: Lagu berikutnya harus mulai seketika (<100ms) tanpa jeda resolusi URL web, serta level volume antar lagu tidak boleh melonjak drastis.
3. **Pengalaman Asli OS (Native Feel)**: Kontrol lagu dari taskbar thumbnail (Windows), flyout OSD, media keys tanpa bentrok, dan kemampuan memutar seluruh playlist secara offline.

---

## 2. Tujuan, Non-Tujuan, & Anti-Tujuan

### 2.1. Tujuan (Goals)
- **Bulk Library Importer (Metadata-First / JIT)**: Mengimpor koleksi musik secara massal dari berkas CSV/JSON (Soundiiz, TuneMyMusic, SpotMYBackup) serta multi-URL playlist dalam hitungan detik ke disk lokal pengguna, merekonstruksi masing-masing playlist secara terpisah.
- **Dual-Deck Gapless & True Crossfade Engine**: Menggunakan arsitektur A/B Deck bergantian (`audioA` dan `audioB`) dengan Web Audio Gain Nodes independen. Prefetching otomatis dipicu saat sisa durasi $\le 15$ detik, dan *crossfade* aktif berjalan $T$ detik sebelum lagu selesai (`currentTime >= duration - crossfadeDuration`).
- **Real Loudness Normalization & Transparent Bypass**: Mengintegrasikan `DynamicsCompressorNode` terkalibrasi (-14 LUFS standar streaming) pada Web Audio DSP. Saat dinonaktifkan (`volumeNormalization = false`), kompresor di-bypass secara transparan (`ratio = 1.0`, `threshold = 0`, `masterGain = 1.0`) sehingga kualitas audiophile tetap murni 100%.
- **1-Click Offline Playlist Download & Local-First Playback**: Tombol unduh playlist/album penuh di header playlist dengan *background queue manager* di `electron-main.js`. Saat offline atau saat file lokal tersedia di `~/Music/SoraFy`, pemutaran langsung mengambil file lokal (*Local-First Audio Interceptor*).
- **Windows Taskbar ThumbBar & Native Controls**: Tombol navigasi (Prev, Play/Pause, Next) pada thumbnail taskbar Windows dan sinkronisasi metadata `mediaSession` yang sempurna.

### 2.2. Non-Tujuan (Non-Goals)
- Tidak membuat akun cloud/server backend terpusat; semua data koleksi, cache, dan riwayat migrasi disimpan secara privat di disk lokal pengguna (`~/.config/sorafy/` dan `localStorage`).
- Tidak melakukan scraping massal 2.000 audio stream YouTube sekaligus di muka (*anti-eager upfront scraping*) untuk mencegah pemblokiran IP dan kedaluwarsa URL direct stream YouTube (yang habis dalam 6 jam).

### 2.3. Anti-Tujuan (Anti-Goals)
- **Anti-UI Freeze**: Proses parsing atau download massal tidak boleh membuat antarmuka desktop membeku atau lagging.
- **Anti-Distorsi Audio**: Normalisasi volume tidak boleh memotong frekuensi dinamis (*clipping*) atau merusak profil equalizer 7-band yang sudah diatur pengguna saat bypass aktif.
- **Anti-Dependency Bloat**: Menghindari penambahan library biner C++ eksternal yang rentan merusak build cross-platform di Linux, Mac, atau Windows.

---

## 3. Pendekatan yang Dipertimbangkan & Keputusan

- **Pendekatan A (In-Engine Electron & Web Audio DSP - Terpilih)**:
  - Mengoptimalkan secara langsung di atas arsitektur yang sudah berjalan di `desktop/electron-main.js` dan `desktop/src/app.js`.
  - *Alasan*: Kompatibel penuh dengan 7-band EQ, lirik kata-per-kata, dan SoraFy Jam LAN remote; ringan, modular, dan terbukti stabil di berbagai platform.
- **Pendekatan B (Subproses C++/Rust Subprocess / External Backend - Ditolak)**:
  - Memindahkan audio decoding dan downloader ke binary Rust terpisah.
  - *Alasan Ditolak*: Terlalu berisiko mematahkan Web Audio graph yang sudah berjalan baik, menambah kompleksitas kompilasi rilis, dan membutuhkan waktu refaktor yang jauh lebih lama.

---

## 4. Rincian Desain Arsitektur & Komponen

### 4.1. Pilar 1: Bulk Library Importer (Metadata-First Architecture)
- **Antarmuka (UI)**:
  - Modal pop-up baru: `"Import Music Library" / "Migrasi Koleksi Musik"`.
  - Tab 1: *Upload File*: Mendukung drag-and-drop file `.csv` atau `.json` (Soundiiz, TuneMyMusic, SpotMYBackup).
  - Tab 2: *Multiple Links*: Textarea input untuk menempelkan daftar URL playlist/album (1 URL per baris).
  - Opsi tujuan: Simpan ke *Liked Songs* atau merekonstruksi *Playlist Terpisah* otomatis sesuai nama asli sumber.
- **Backend IPC (`desktop/electron-main.js`)**:
  - `ipcMain.handle('parse-library-file', async (event, { filePath, content, format }))`:
    Mengekstrak deretan `{ title, artist, album, duration, sourcePlaylistName }` secara instan.
  - Penyimpanan langsung ke `localStorage` / config lokal tanpa perlu menunggu pencarian YouTube, sehingga 1.000+ lagu selesai diimpor dalam <3 detik.
  - Resolusi audio YouTube berjalan secara *Just-In-Time* (saat lagu akan diputar atau saat playlist diunduh ke offline storage).

### 4.2. Pilar 2: Stabilitas Audio, True Crossfade & Local-First Playback
- **Dual-Deck Gapless & True Crossfade Engine**:
  - Di `desktop/src/app.js`, arsitektur audio diperluas dengan dua instance MediaElement: `deckA` dan `deckB`.
  - Keduanya terhubung ke Web Audio graph melalui `GainNode` independen:
    - `deckA -> gainA \`
    - `deckB -> gainB -> eqNodes -> compressorNode -> masterGainNode -> destination`
  - Prefetching dipicu saat `activeDeck.currentTime >= activeDeck.duration - 15`.
  - Jika `crossfadeDuration > 0`:
    - Pada detik `currentTime >= duration - crossfadeDuration`, `incomingDeck` mulai berputar dari detik 0.
    - Nilai `activeGain` diturunkan secara linear dari 1.0 ke 0.0, sedangkan `incomingGain` dinaikkan dari 0.0 ke 1.0.
  - Jika `crossfadeDuration == 0` (gapless murni):
    - Pada event `ended`, `incomingDeck` langsung mengambil alih tanpa ada jeda decoding (0ms gapless).
- **Real Loudness Normalization & Transparent Bypass (Web Audio DSP)**:
  - Sisipkan `DynamicsCompressorNode` terkalibrasi ke dalam Web Audio chain.
  - Konfigurasi parameter saat `volumeNormalization = true`:
    - `threshold.value = -18` (dB)
    - `knee.value = 12` (dB)
    - `ratio.value = 4.0`
    - `attack.value = 0.003` (s)
    - `release.value = 0.25` (s)
    - `masterGain.gain.value = 1.15` (makeup gain)
  - Saat `volumeNormalization = false` (Transparent Bypass):
    - `ratio.value = 1.0` (kompresi linear 1:1, tidak ada dinamika yang terpotong bahkan saat EQ di-boost)
    - `threshold.value = 0`
    - `masterGain.gain.value = 1.0`
- **1-Click Offline Playlist Download & Local-First Audio Interceptor**:
  - Tombol aksi `"Download Playlist"` pada header tampilan playlist/album di `renderPlaylistDetail()`.
  - Menjalankan download antrean di `electron-main.js` (`downloadManager`) agar tidak terputus saat pengguna berpindah halaman.
  - **Local-First Audio Interceptor**:
    Saat `loadTrack(track)` dipanggil:
    1. Cek terlebih dahulu apakah file lokal `~/Music/SoraFy/<artist> - <title>.mp3` (atau `.opus`) sudah ada di disk.
    2. Jika ada: Langsung putar via endpoint internal proxy audio lokal (`http://localhost:3721/stream?file=...`) dengan respon HTTP 206 Partial Content seketika (0ms latensi dan 100% offline).
    3. Jika belum ada: Baru lakukan resolusi streaming web YouTube/Opus seperti biasa.

### 4.3. Pilar 3: Integrasi Sistem Operasi Asli (Native OS Feel)
- **Windows Taskbar ThumbBar Controls**:
  - Di `desktop/electron-main.js`, panggil `mainWindow.setThumbarButtons()` saat jendela utama selesai dimuat.
  - Menyediakan 3 tombol thumbnail:
    1. *Previous*: Ikon mundur lagu.
    2. *Play/Pause*: Ikon dinamis sesuai status putar.
    3. *Next*: Ikon maju lagu.
  - Handler IPC `playback-state-changed` mengupdate status tombol Play/Pause secara instan.
- **Sinkronisasi `navigator.mediaSession` Penuh**:
  - Pastikan setiap penggantian lagu memperbarui:
    - `title`, `artist`, `album`, dan `artwork` (resolusi 512x512).
    - `playbackState`: `'playing'` | `'paused'`.
    - `setPositionState`: `{ duration, playbackRate: 1.0, position }`.

---

## 5. Keputusan Builder yang Telah Ditetapkan (Calls Made by Builder)
- **Dual-Deck Engine**: Dipilih arsitektur A/B Deck agar *crossfade* sejati dan transisi *0ms gapless* dapat terwujud tanpa glitch audio.
- **Local-First Audio Interceptor**: Lagu yang sudah tersimpan offline di `~/Music/SoraFy` wajib langsung diputar dari disk lokal tanpa menghubungi jaringan.
- **Transparent Compressor Bypass**: Penonaktifan normalisasi volume menyetel `ratio = 1.0` dan `masterGain = 1.0` untuk menjamin transparansi 100% tanpa kompresi yang tak disengaja.
- **Metadata-First (JIT) Import**: Impor massal ribuan lagu menyimpan metadata seketika ke disk, sedangkan pencarian stream YouTube dilakukan saat lagu hendak diputar atau saat diunduh, guna menghindari pemblokiran IP dan kedaluwarsa URL.
- **Struktur Playlist Otomatis**: Berkas multi-playlist (seperti SpotMYBackup atau multi-URL) secara otomatis merekonstruksi masing-masing playlist terpisah sesuai nama aslinya.
