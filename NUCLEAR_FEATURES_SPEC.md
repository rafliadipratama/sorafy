# Spesifikasi Implementasi Fitur Adopsi Nuclear untuk SoraFy Desktop

Dokumen ini merupakan cetak biru teknis (*technical blueprint*) terstruktur untuk memandu proses pengkodean dan pelatihan implementasi fitur-fitur unggulan dari repositori Nuclear ke dalam SoraFy Desktop. Seluruh implementasi dirancang modular, kompatibel dengan arsitektur SoraFy saat ini (Electron / Node.js + IPC), serta siap untuk jalur migrasi masa depan ke Tauri (Rust).

---

## Daftar Fitur yang Diadopsi

1. [Fitur 1: Stream Verification & Multi-Candidate Stream Picker](#fitur-1-stream-verification--multi-candidate-stream-picker)
2. [Fitur 2: SoraFy Jam (Remote Control LAN via QR Code)](#fitur-2-sorafy-jam-remote-control-lan-via-qr-code)
3. [Fitur 3: Built-in MCP Server (Model Context Protocol untuk AI)](#fitur-3-built-in-mcp-server-model-context-protocol-untuk-ai)
4. [Fitur 4: Advanced Lyrics Engine (Word-Level Sync, Offset, & Furigana)](#fitur-4-advanced-lyrics-engine-word-level-sync-offset--furigana)
5. [Fitur 5: Listening Statistics & Analytics Dashboard](#fitur-5-listening-statistics--analytics-dashboard)
6. [Fitur 6: Theming Engine (Mode Terang/Gelap & Custom Accent)](#fitur-6-theming-engine-mode-teranggelap--custom-accent)
7. [Fitur 7: MPD Protocol Compatibility Daemon](#fitur-7-mpd-protocol-compatibility-daemon)

---

## Fitur 1: Stream Verification & Multi-Candidate Stream Picker

### 1.1. Latar Belakang Masalah
Pencarian audio otomatis berbasis query nama lagu sering kali mengambil stream yang salah: versi live yang bising, potongan cuplikan 30 detik (*preview*), cover tidak resmi, atau lagu berbeda dengan judul mirip. Pengguna memerlukan kontrol untuk memilih stream yang tepat dan mengunci (*pin*) pilihan tersebut.

### 1.2. Arsitektur Data & Penyimpanan
Penyimpanan verifikasi menggunakan file lokal JSON terstruktur:
* **Lokasi File**: `~/.config/sorafy/verified_streams.json`
* **Skema Format Data**:
```json
{
  "version": 1,
  "verifications": {
    "radiohead:let down": {
      "verifiedId": "M_wgl3uQ5fs",
      "title": "Let Down",
      "artist": "Radiohead",
      "source": "youtube",
      "verifiedAt": 1729837200000,
      "votes": 1,
      "metadata": {
        "duration": 299,
        "channel": "Radiohead - Topic",
        "audioQuality": "AUDIO_QUALITY_HIGH"
      }
    }
  }
}
```

### 1.3. Backend IPC & Resolver Flow (`desktop/electron-main.js`)
1. **Normalisasi Key**:
   ```javascript
   function generateTrackKey(title, artist) {
     const clean = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
     return `${clean(artist)}:${clean(title)}`;
   }
   ```
2. **Prioritas Resolusi Stream**:
   * Urutan 1: Cek cache verifikasi lokal di `verified_streams.json`.
   * Urutan 2: Jika ada verifikasi, langsung pakai `verifiedId` tanpa pencarian ulang.
   * Urutan 3: Fallback ke pencarian otomatis biasa jika belum diverifikasi.
3. **IPC Channel Baru**:
   * `ipcMain.handle('get-stream-candidates', async (event, { title, artist, currentId }))`:
     Mencari 5–8 kandidat alternatif dari YouTube Music API dan YouTube Search API, mengembalikan list lengkap berisi: `videoId`, `title`, `author`, `duration`, `views`, `thumbnail`, dan flag `isCurrent`.
   * `ipcMain.handle('verify-stream-candidate', async (event, { title, artist, candidateId, metadata }))`:
     Menyimpan kandidat terpilih ke `verified_streams.json`.
   * `ipcMain.handle('unverify-stream', async (event, { title, artist }))`:
     Menghapus entri verifikasi lokal.

### 1.4. Antarmuka Pengguna (UI)
* **Trigger**: Klik kanan pada item di antrean (*Queue list*) atau tombol perisai (*Verify Badge*) di bilah player.
* **Komponen Modal Popover**:
  * Daftar kandidat horizontal/vertikal dengan info durasi dan channel.
  * Tombol *Preview* (memutar sampel 10 detik tanpa mengubah antrean).
  * Tombol aksi: **"Gunakan & Kunci Sumber Ini"** (`btn-verify-stream`).
  * Status badge di Player Bar:
    * 🟢 *Verified*: Stream sudah diverifikasi dan terkunci.
    * ⚪ *Unverified*: Menggunakan hasil pencarian otomatis standar.

---

## Fitur 2: SoraFy Jam (Remote Control LAN via QR Code)

### 2.1. Konsep & Arsitektur
Menyediakan server web ultra-ringan di dalam proses Electron yang berjalan pada jaringan lokal (Wi-Fi). Pengguna cukup memindai QR Code di layar desktop menggunakan kamera smartphone untuk membuka Web App pengendali jarak jauh tanpa perlu menginstal aplikasi tambahan di HP.

### 2.2. Spesifikasi Server (`desktop/electron-main.js`)
* **Protokol**: HTTP/1.1 + Server-Sent Events (SSE) atau WebSocket.
* **Port**: Default `4120` (jika terpakai, otomatis mencoba `4121`–`4129`).
* **Host Binding**: `0.0.0.0` (dapat diakses seluruh perangkat dalam subnet lokal yang sama).
* **Endpoints HTTP**:
  * `GET /`: Menyajikan SPA statis *SoraFy Remote* (`desktop/remote-web/index.html`).
  * `GET /api/status`: Mengembalikan JSON snapshot state saat ini (lagu aktif, waktu putar, status play/pause, volume, antrean).
  * `GET /api/events`: Stream SSE untuk pembaruan state instan ke semua HP yang tersambung.
  * `POST /api/action`: Menerima perintah kontrol `{ action: "play" | "pause" | "next" | "prev" | "seek" | "volume" | "shuffle" | "repeat", value: any }`.
  * `GET /api/search?q=query`: Endpoint pencarian lagu langsung dari HP.
  * `POST /api/queue/add`: Menambahkan lagu hasil pencarian di HP langsung ke antrean desktop.
  * `GET /api/lyrics`: Mengambil lirik lagu aktif secara real-time.

### 2.3. Antarmuka Web Mobile (`desktop/remote-web/`)
* Dibangun murni dengan HTML5, CSS3, dan vanilla JS tanpa framework berat (ukuran bundle < 50 KB).
* **Fitur Remote di Layar HP**:
  * **Now Playing Card**: Cover seni album besar, judul lagu, nama artis, dan seekbar interaktif.
  * **Tombol Kontrol**: Play/Pause, Next, Prev, Volume Slider, Repeat, Shuffle.
  * **Drawer Lirik**: Lirik tersinkronisasi baris demi baris yang berjalan otomatis di HP.
  * **Drawer Antrean (Queue)**: Menampilkan urutan lagu berikutnya dengan opsi hapus lagu.
  * **Pencarian Lagu**: Input pencarian dengan hasil instan; klik lagu langsung memutarnya di komputer.

### 2.4. Integrasi di Antarmuka Desktop
* Tambahkan ikon **Mobile Remote / QR Code** di Header Bar desktop (di sebelah kanan indikator volume).
* Klik ikon memunculkan popover berisi:
  * Kode QR dinamis yang menunjuk ke `http://<IP_KOMPUTER>:4120`.
  * Teks URL yang dapat diklik atau disalin manual.
  * Toggle Switch: "Aktifkan Remote Control Lokal".

---

## Fitur 3: Built-in MCP Server (Model Context Protocol untuk AI)

### 3.1. Deskripsi
Mengimplementasikan spesifikasi resmi *Model Context Protocol (MCP)* dengan transport `Streamable HTTP` pada port `8800`. Fitur ini memungkinkan AI Assistant (Claude Code, Cursor, Windsurf, OpenCode) untuk berinteraksi langsung dengan SoraFy.

### 3.2. Endpoint & Transport
* **URL Server**: `http://127.0.0.1:8800/mcp`
* **Transport**: HTTP POST / JSON-RPC 2.0 (Streamable HTTP).

### 3.3. Skema Alat (Tools Definition)
1. **`sorafy_get_player_state`**:
   * Input: Kosong.
   * Output: `{ isPlaying, currentTrack: { title, artist, duration, progress, coverUrl }, queueLength, volume }`.
2. **`sorafy_control_playback`**:
   * Input: `{ action: "play" | "pause" | "toggle" | "next" | "previous" | "seek" | "set_volume", value?: number }`.
   * Output: `{ success: true, newState: ... }`.
3. **`sorafy_search_and_play`**:
   * Input: `{ query: string, playImmediately?: boolean }`.
   * Output: `{ trackPlayed: { title, artist, videoId }, queueIndex: number }`.
4. **`sorafy_manage_queue`**:
   * Input: `{ action: "list" | "clear" | "remove", index?: number }`.
   * Output: Array antrean lagu saat ini.
5. **`sorafy_get_lyrics`**:
   * Input: `{ videoId?: string }` (opsional, bawaan adalah lagu saat ini).
   * Output: `{ hasLyrics: boolean, synced: boolean, lines: Array<{ timeMs, text }> }`.
6. **`sorafy_import_playlist`**:
   * Input: `{ url: string, customName?: string }`.
   * Output: `{ playlistId, name, trackCount }`.

### 3.4. Konfigurasi Client untuk User
* **Claude Code**:
  `claude mcp add sorafy --transport http http://127.0.0.1:8800/mcp`
* **Cursor / Windsurf (`mcp.json`)**:
  ```json
  {
    "mcpServers": {
      "sorafy": {
        "url": "http://127.0.0.1:8800/mcp"
      }
    }
  }
  ```

---

## Fitur 4: Advanced Lyrics Engine (Word-Level Sync, Offset, & Furigana)

### 4.1. Hirarki Sumber Lirik
Perluas pengambilan lirik dengan sistem *Multi-Engine Fallback*:
1. **Tingkat 1 (Word-Synced)**: Integrasi dengan API LRCLIB (`https://lrclib.net/api/get?artist_name=...&track_name=...`). Menghasilkan format kata-per-kata yang tepat.
2. **Tingkat 2 (Line-Synced)**: YouTube Music timed lyrics via Innertube.
3. **Tingkat 3 (Plain Text)**: Ekstraksi lirik statis Genius / YouTube Music description.

### 4.2. Format Data Lirik Kata (Word-Synced Schema)
```javascript
{
  type: "word-synced",
  lines: [
    {
      startTimeMs: 12400,
      endTimeMs: 15600,
      text: "I wish I was special",
      words: [
        { word: "I", startMs: 12400, endMs: 12800 },
        { word: "wish", startMs: 12850, endMs: 13300 },
        { word: "I", startMs: 13350, endMs: 13700 },
        { word: "was", startMs: 13750, endMs: 14200 },
        { word: "special", startMs: 14250, endMs: 15600 }
      ]
    }
  ]
}
```

### 4.3. Renderer Karaoke Visual
* Setiap suku kata dibungkus dalam tag `<span class="lyric-word" data-start="12850" data-end="13300">wish</span>`.
* Pada baris aktif, gunakan efek visual CSS gradient fill yang terisi secara proporsional sesuai waktu audio berjalan, menghadirkan efek karaoke presisi.

### 4.4. Penyesuaian Offset Manual (Timing Adjustment)
* Tambahkan bilah pengaturan kecil di panel lirik:
  * Tombol `[-100ms]`, `[Reset]`, `[+100ms]`.
  * Simpan nilai offset per `videoId` di `localStorage` atau file konfigurasi:
    `sorafy_lyrics_offsets[videoId] = offsetMs`.
  * Waktu sinkronisasi aktual dihitung: `currentTimeMs + offsetMs`.

### 4.5. Dukungan Furigana & Terjemahan (Lagu Jepang/Korea)
* Untuk teks yang terdeteksi mengandung Kanji (`[\u4e00-\u9faf]`), parser menambahkan anotasi `<ruby>漢<rt>かん</rt>字<rt>じ</rt></ruby>`.
* Toggle switch di panel lirik: "Tampilkan Furigana/Romaji" dan "Tampilkan Terjemahan Baris".

---

## Fitur 5: Listening Statistics & Analytics Dashboard

### 5.1. Mekanisme Tracking Event
SoraFy merekam log riwayat pemutaran secara lokal saat sebuah lagu diputar minimal 30 detik atau lebih dari 50% durasinya:
* **Lokasi File**: `~/.config/sorafy/listening_stats.json`
* **Log Entry**:
  ```json
  {
    "timestamp": 1729837500000,
    "trackId": "M_wgl3uQ5fs",
    "title": "Let Down",
    "artist": "Radiohead",
    "album": "OK Computer",
    "durationSeconds": 299,
    "secondsListened": 299
  }
  ```

### 5.2. Halaman Visualisasi Baru (`#statsView`)
Tambahkan menu navigasi **"Listening Stats"** di sidebar. Halaman ini berisi:
1. **GitHub-Style Contribution Heatmap (12 Bulan Terakhir)**:
   * Grid matriks 7 baris (hari dalam seminggu) x 52 kolom (minggu dalam setahun).
   * Kotak diwarnai dengan gradasi hijau brand SoraFy berdasarkan jumlah menit mendengarkan lagu per hari:
     * 0 menit: `#161B22`
     * 1–30 menit: `rgba(0, 229, 153, 0.25)`
     * 31–90 menit: `rgba(0, 229, 153, 0.50)`
     * 91–180 menit: `rgba(0, 229, 153, 0.75)`
     * > 180 menit: `rgba(0, 229, 153, 1.0)`
   * Tooltip saat kursor diarahkan ke kotak: tanggal dan total durasi mendengar.
2. **Diagram Jam Dengar (24-Hour Circular Clock)**:
   * Menampilkan grafik polar/lingkaran yang menunjukkan jam-jam di mana pengguna paling aktif mendengarkan musik (pagi, siang, malam, tengah malam).
3. **Peringkat Teratas (Top Lists)**:
   * Filter rentang waktu: 7 Hari Terakhir, 30 Hari Terakhir, 1 Tahun, Sepanjang Waktu.
   * Top 10 Artis, Top 10 Album, dan Top 10 Lagu Terbanyak Diputar.

### 5.3. Integrasi Scrobbler Eksternal
* Integrasikan API scrobble ke **Last.fm** dan **ListenBrainz** via tombol koneksi di menu Settings.

---

## Fitur 6: Theming Engine (Mode Terang/Gelap & Custom Accent)

### 6.1. Abstraksi Token Desain CSS
Ganti variabel warna keras dengan sistem CSS theme tokens:
```css
:root {
  /* Dynamic CSS Tokens */
  --color-bg-base: #0B0E14;
  --color-bg-surface: #121824;
  --color-bg-sidebar: #0E121B;
  --color-text-main: #FFFFFF;
  --color-text-muted: #8A99AD;
  --color-accent: #00E599;
  --color-accent-hover: #00FFAC;
  --color-accent-subtle: rgba(0, 229, 153, 0.12);
  --color-border: rgba(255, 255, 255, 0.08);
}
```

### 6.2. Daftar Preset Tema Bawaan
1. **SoraFy Emerald (Bawaan)**: Latar belakang dark sleek (#07080A) dengan aksen hijau neon khas SoraFy (#00E599).
2. **Arctic Obsidian (Monochrome)**: Dominasi hitam murni (#000000) dan abu-abu minimalis (#E0E0E0).
3. **Lagoon Cyber (Blue-Cyan)**: Latar belakang biru dongker gelap (#0A0F1D) dengan aksen cyan elektrik (#00D2FF).
4. **Aurora Purple**: Nuansa ungu gelap (#0F0A1A) dengan aksen ungu neon (#A855F7).
5. **Oasis Light (Mode Terang)**: Latar belakang putih bersih (#F8F9FA) dengan teks kontras tinggi (#1A1D20) untuk penggunaan di siang hari atau luar ruangan.

### 6.3. Theme Switcher di Pengaturan
* Selector drop-down di `Settings -> Appearance`.
* Pemilih warna kustom (*Hex Color Picker*) untuk mengganti `--color-accent` secara bebas.
* Nilai tema tersimpan secara persisten di `settings.json`.

---

## Fitur 7: MPD Protocol Compatibility Daemon

### 7.1. Konsep Kerja
Menjalankan soket TCP lokal pada port `6600` yang mengimplementasikan protokol Music Player Daemon (MPD). Ini memungkinkan alat terminal Linux populer (`ncmpcpp`, `mpc`, `mpDris2`) mengendalikan pemutar audio SoraFy.

### 7.2. Implementasi Soket TCP (`desktop/electron-main.js`)
* Gunakan modul bawaan Node.js `net.createServer()`.
* Parsing perintah teks berakhiran newline (`\n`):
  * `status`: Mengembalikan format key-value standar MPD (`volume`, `repeat`, `random`, `state: play|pause|stop`, `song`, `elapsed`).
  * `currentsong`: Mengembalikan `file`, `Title`, `Artist`, `Album`, `Time`.
  * `play [pos]`: Memutar lagu pada posisi antrean tertentu.
  * `pause [0|1]`: Menjeda atau melanjutkan pemutaran.
  * `next` / `previous`: Berpindah lagu.
  * `setvol [0-100]`: Mengatur volume.
  * `idle [subsystems]`: Menunggu perubahan event secara asinkron.
  * `close`: Menutup koneksi klien MPD.

---

## Rencana Tahapan Eksekusi (Implementation Milestones)

| Tahapan | Fitur | File Utama yang Terlibat | Estimasi Kompleksitas |
| :--- | :--- | :--- | :--- |
| **Fase 1** | **Stream Verification & Candidate Picker** | `electron-main.js`, `app.js`, `style.css` | Menengah (Prioritas #1) |
| **Fase 2** | **SoraFy Jam (LAN Remote Web Control)** | `electron-main.js`, `desktop/remote-web/*` | Menengah (Prioritas #2) |
| **Fase 3** | **Built-in MCP Server (AI Integration)** | `electron-main.js`, `preload.js` | Ringan–Menengah |
| **Fase 4** | **Word-Synced Karaoke Lyrics & Offset** | `electron-main.js`, `app.js`, `style.css` | Menengah |
| **Fase 5** | **Listening Analytics & GitHub Heatmap** | `electron-main.js`, `app.js`, `style.css` | Ringan–Menengah |
| **Fase 6** | **Theming Engine & MPD Daemon** | `style.css`, `app.js`, `electron-main.js` | Ringan |

---

## Catatan Standar Pengkodean

1. **Clean Code & Kemurnian File**:
   * Pertahankan arsitektur *event-driven* yang bersih antara proses Electron Main dan Renderer.
   * Hindari penambahan dependensi npm pihak ketiga yang tidak perlu; optimalkan modul standar Node.js (`http`, `net`, `fs`, `crypto`) untuk server Jam, MPD, dan verifikasi stream.
2. **Keamanan Jaringan**:
   * Server Jam (port 4120) hanya menerima koneksi dari subnet lokal pribadi (RFC 1918: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
   * Server MCP (port 8800) dan MPD (port 6600) hanya terikat pada `127.0.0.1` (*localhost only*).
3. **Penyimpanan Lokal**:
   * Semua data pengguna (verifikasi stream, analitik dengar, token tema) disimpan di direktori standar OS: `~/.config/sorafy/` pada Linux dan `%APPDATA%\sorafy\` pada Windows.
