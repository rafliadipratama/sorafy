# Audio Output Device Selector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan tombol dan menu melayang (*floating popover*) pemilih perangkat audio fisik (Speaker, Headphone, Bluetooth) pada bilah bottom player SoraFy Desktop dengan gaya clean tanpa efek neon.

**Architecture:** Menggunakan W3C MediaDevices API (`enumerateDevices`, `ondevicechange`) dan sink ID assignment (`setSinkId`) yang disinkronkan ke kedua deck audio (`deckA` & `deckB`) serta `AudioContext` Web Audio API. Tampilan UI menggunakan popover melayang tepat di atas bilah `.player-right` dengan styling gelap OLED konsisten tanpa efek neon glow.

**Tech Stack:** JavaScript (ES6+), HTML5 Media Capture & Streams API, Web Audio API, CSS3 (OLED Dark tokens), Node.js Test Runner.

**Spec:** [docs/superpowers/specs/2026-11-15-audio-output-device-selector-design.md](file:///home/rafliadipratama/sorafy/docs/superpowers/specs/2026-11-15-audio-output-device-selector-design.md)

## Global Constraints

- **Bebas AI Slop & Tanpa Efek Neon**: Tidak menggunakan `text-shadow` bercahaya neon, `box-shadow` hijau berpendar tebal, atau animasi flashing. Gaya harus selaras dengan tombol `.player-right` yang ada (background `#181C22`, border `1px solid rgba(255, 255, 255, 0.08)`, text `#E0E0E0`, hover `rgba(255, 255, 255, 0.05)`, aksen aktif `#00E599` tenang).
- **Dual-Deck Synchronization**: Pemindahan output via `setSinkId` harus diterapkan bersamaan pada `this.deckA` dan `this.deckB` agar saat terjadi transisi *crossfade*, lagu berikutnya tetap mengalir ke perangkat yang sama.
- **Graceful Fallback**: Jika `setSinkId` atau `enumerateDevices` tidak didukung runtime atau ditolak sistem, fungsi pemutar musik utama tidak boleh terputus atau melempar unhandled rejection.
- **Zero Regression**: Seluruh 131 unit test yang ada di `desktop/tests/` harus tetap 100% lulus.

## Review Focus

1. **Device Disconnection Mid-Playback**: Perangkat Bluetooth/headset dicabut saat lagu sedang berputar; sistem harus mendeteksi event `devicechange` dan kembali ke default output tanpa freeze.
2. **Dual-Deck Crossfade State**: Pergantian lagu saat deck A aktif beralih ke deck B; deck B harus tetap menggunakan `sinkId` yang telah dipilih.
3. **Empty Device Labels / Permissions**: Sistem mendeteksi perangkat sebelum label audio terisi oleh browser; penamaan fallback yang bersih harus ditampilkan (misal "Default Speaker").
4. **Click-Outside Dismissal**: Popover harus tertutup mulus ketika pengguna mengklik bagian lain aplikasi atau tombol navigasi.
5. **Persistence Across Restarts**: Pilihan perangkat tersimpan di `localStorage` dan dipulihkan kembali saat startup jika perangkat tersebut masih terhubung.

---

### Task 1: Contract & Unit Test Suite

**Files:**
- Create: `desktop/tests/audio-output-device.test.js`

- [x] **Step 1: Tulis unit test untuk helper klasifikasi dan sinkronisasi audio device**
- [x] **Step 2: Jalankan test untuk memastikan test gagal (Red)**
- [x] **Step 3: Implementasikan fungsi helper modular di `desktop/src/modules/audio-device-helper.js`**
- [x] **Step 4: Jalankan test untuk memastikan seluruh test lolos (Green)**
- [x] **Step 5: Verifikasi regresi keseluruhan**

---

### Task 2: Markup & Clean CSS Styling Tanpa Neon Glow

**Files:**
- Modify: `desktop/src/index.html` (di dalam `.player-right`)
- Modify: `desktop/src/style.css` (gaya `.audio-device-popover` dan `.audio-device-item`)

- [x] **Step 1: Tambahkan tombol pemilih output di `.player-right` pada `desktop/src/index.html`**
- [x] **Step 2: Tambahkan styling clean CSS di `desktop/src/style.css`**
- [x] **Step 3: Tambahkan entri terjemahan di kamus i18n (`desktop/src/app.js`)**

---

### Task 3: Integrasi Logika Runtime & Event Handling

**Files:**
- Modify: `desktop/src/app.js`

- [x] **Step 1: Tambahkan state dan method inisialisasi pada `SoraFyDesktopApp`**
- [x] **Step 2: Implementasikan `refreshAudioOutputDevices()`**
- [x] **Step 3: Implementasikan `selectAudioOutputDevice(deviceId, label)`**
- [x] **Step 4: Jalankan verifikasi unit test**

---

### Task 4: Packaging & End-to-End Live Verification

**Files:**
- Verify & Update: `~/.local/share/sorafy/app/resources/app.asar`
- Verify & Update: `desktop/dist/win-unpacked/resources/app.asar`

- [x] **Step 1: Jalankan build dan packing asar lokal**
- [x] **Step 2: Restart aplikasi SoraFy dan uji coba langsung**
