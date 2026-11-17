# Desain Teknis: Audio Output Device Selector (Bottom Player)

- **Tanggal**: 2026-11-15
- **Status**: Disetujui (Approved)
- **Topik**: Pemilih Perangkat Output Audio pada Bilah Bottom Player (Mirip Spotify)
- **Target Platform**: SoraFy Desktop (Electron, Tauri, & Web)

---

## 1. Latar Belakang & Tujuan (The Why)

Pengguna SoraFy sering mendengarkan musik menggunakan berbagai jenis perangkat audio fisik (speaker laptop bawaan, headset kabel 3.5mm/USB, dan speaker atau earphone TWS Bluetooth). Saat ini, pengguna harus mengubah *Default Audio Output* di pengaturan suara sistem operasi (Windows Settings / macOS Sound / Linux PulseAudio/PipeWire) jika ingin mengalihkan suara lagu ke headset atau speaker lain.

Fitur ini menyediakan tombol kendali perangkat audio bawaan di bilah pemutar bawah (*bottom player*), mirip fitur "Connect to a device" pada Spotify, sehingga pengguna dapat memilih dan mengalihkan tujuan output suara langsung dari dalam aplikasi SoraFy secara instan.

---

## 2. Tujuan, Non-Tujuan, & Anti-Tujuan

### Tujuan (Goals)
1. Menambahkan tombol perangkat audio (`#audioOutputDeviceBtn`) di grup kontrol kanan bilah bawah (`.player-right`), tepat di sebelah kiri bilah volume slider.
2. Menyajikan daftar perangkat audio yang terhubung dalam bentuk menu melayang (*floating popover*) yang bersih, natural, dan terstruktur rapi.
3. Mengkategorikan perangkat dengan ikon representatif:
   - 💻 Speaker Bawaan / Internal Laptop / PC
   - 🎧 Headphone / Headset / Earphone
   - 🔊 Bluetooth Speaker / TWS
4. Mengalihkan output suara secara instan tanpa menghentikan pemutaran lagu pada kedua deck pemutar (`deckA` dan `deckB`), serta `AudioContext` Web Audio API.
5. Mendukung deteksi dinamis saat perangkat audio baru dicolokkan atau dicabut (`navigator.mediaDevices.ondevicechange`).
6. Menyimpan perangkat pilihan pengguna ke `localStorage` agar otomatis digunakan kembali saat aplikasi dibuka berikutnya.

### Non-Tujuan (Non-Goals)
- Tidak mengontrol volume fisik hardware per-perangkat secara independen (volume tetap dikontrol oleh volume slider SoraFy dan master OS).
- Tidak memodifikasi output audio aplikasi lain di luar SoraFy.

### Anti-Tujuan (Anti-Goals)
- **Bebas AI Slop & Tanpa Efek Neon Berlebihan**: TIDAK menggunakan efek glow neon menyala terang, teks berpendar tebal, atau bayangan warna-warni yang mencolok. Gaya visual harus 100% selaras dengan tombol kontrol `.player-right` yang sudah ada (latar slate `#181C22`, border tipis halus `rgba(255, 255, 255, 0.08)`, dan aksen hijau tenang `#00E599` yang bersih).
- Tidak boleh memblokir atau menjeda (*pause*) audio saat membuka popover atau saat berganti perangkat.
- Tidak boleh menyebabkan crash jika browser atau sistem operasi tidak mengizinkan akses `setSinkId` (misal browser lama tanpa dukungan sink ID).

---

## 3. Batasan Teknis (Constraints)

1. **Dukungan Chromium/Electron**:
   - `HTMLMediaElement.prototype.setSinkId` dan `AudioContext.prototype.setSinkId` didukung secara native di Chromium/Electron modern.
   - Pada platform atau browser yang belum mendukung `setSinkId`, tombol harus menampilkan tooltip informatif atau fallback graceful tanpa merusak fungsionalitas pemutaran.
2. **Dual-Deck Engine**:
   - SoraFy menggunakan dua elemen audio independen (`this.deckA` dan `this.deckB`) untuk menangani crossfade. Pemindahan `sinkId` wajib dieksekusi pada kedua deck agar transisi lagu berikutnya tidak kembali ke speaker lama.
3. **Web Audio DSP Equalizer**:
   - Audio juga mengalir melalui `AudioContext`. Jika `AudioContext.prototype.setSinkId` tersedia di runtime, sink ID juga harus disinkronkan ke `AudioContext`.

---

## 4. Evaluasi Pendekatan (Approaches)

### Opsi A: Floating Popover di Atas Bottom Player (Dipilih & Disetujui)
- **Deskripsi**: Menu kecil berlatar belakang semi-transparan (`backdrop-filter: blur(16px)`) yang muncul melayang tepat di atas tombol perangkat di sudut kanan bawah saat tombol diklik.
- **Kelebihan**:
  - Kontekstual dan tidak mengalihkan fokus pengguna dari halaman yang sedang dibuka (Home, Search, Lyrics, dll.).
  - Mirip dengan interaksi standar industri (Spotify, Tidal, Apple Music).
  - Ringan, cepat dibuka, dan otomatis tertutup ketika pengguna mengklik area luar popover.
- **Kekurangan**: Memerlukan penanganan posisi relatif dan event listener penutupan saat *click outside*.

### Opsi B: Centered Modal Dialog
- **Deskripsi**: Membuka pop-up modal di tengah layar dengan backdrop gelap menutupi seluruh halaman.
- **Kelebihan**: Mudah diimplementasikan mengikuti struktur modal yang sudah ada (seperti `#unifiedImportModal`).
- **Kekurangan**: Terlalu intrusif untuk tugas sederhana seperti memilih headset/speaker, menutupi konten lirik atau antrean.

**Keputusan**: Opsi A dipilih karena memberikan pengalaman pengguna yang paling mulus dan intuitif.

---

## 5. Rencana Arsitektur & Implementasi Detail

### 5.1. Komponen Antarmuka (`desktop/src/index.html`)
1. **Tombol Pemicu di `.player-right`**:
   ```html
   <button class="control-btn" id="audioOutputDeviceBtn" title="Audio Output Device" data-i18n-title="tooltip_output_device" style="position: relative;">
     <iconsax-icon name="devices" type="linear" size="18" color="currentColor"></iconsax-icon>
   </button>
   ```
2. **Elemen Popover Melayang**:
   ```html
   <div id="audioDevicePopover" class="audio-device-popover" style="display: none;">
     <div class="audio-device-header">
       <span class="audio-device-title" data-i18n="audio_device_title">Audio Output</span>
       <span class="audio-device-subtitle" data-i18n="audio_device_subtitle">Select where audio plays</span>
     </div>
     <div class="audio-device-list" id="audioDeviceList">
       <!-- Item perangkat dirender secara dinamis -->
     </div>
   </div>
   ```

### 5.2. Styling CSS Bersih Tanpa Neon Glow (`desktop/src/style.css`)
- `.audio-device-popover`: Posisi `fixed`, `bottom: 84px`, `right: 170px`, `z-index: 9999`, latar belakang `#181C22`, border `1px solid rgba(255, 255, 255, 0.08)`, border-radius `12px`, box-shadow `0 8px 24px rgba(0, 0, 0, 0.5)`. **Tanpa efek neon glow atau text-shadow**.
- `.audio-device-item`: Layout flex horizontal, padding `10px 14px`, border-radius `8px`, warna teks `#E0E0E0`, transisi hover `background: rgba(255, 255, 255, 0.05)`.
- `.audio-device-item.active`: Background `rgba(0, 229, 153, 0.08)`, teks berwarna `#00E599`, dilengkapi ikon centang aktif.

### 5.3. Logika JavaScript (`desktop/src/app.js`)
1. **Inisialisasi**:
   - `initAudioOutputDevices()`: Mengecek dukungan `navigator.mediaDevices.enumerateDevices` dan `setSinkId`.
   - Mengambil ID perangkat tersimpan dari `localStorage.getItem('sorafy_audio_output_device')`.
   - Menambahkan event listener `devicechange` pada `navigator.mediaDevices`.
   - Menambahkan event listener `click` pada `#audioOutputDeviceBtn` untuk toggle popover.
   - Menambahkan event listener `document.addEventListener('click', ...)` untuk menutup popover ketika mengklik di luar.
2. **Enumerasi Perangkat**:
   - `getAudioOutputDevices()`:
     - Memfilter peranti dengan `kind === 'audiooutput'`.
     - Mendeteksi nama/label perangkat: jika label kosong (karena batasan izin awal), buat label informatif default (`Speaker / Headphone`).
     - Klasifikasi ikon:
       - Bluetooth: nama mengandung `bluetooth`, `tws`, `airpods`, `buds`, `wireless`.
       - Headphone: nama mengandung `headphone`, `headset`, `earphone`, `jack`.
       - Speaker: nama mengandung `speaker`, `realtek`, `built-in`, `internal`, atau `default`.
3. **Pengalihan Output**:
   - `setAudioOutputDevice(deviceId, deviceLabel)`:
     - Memanggil `deckA.setSinkId(deviceId)`.
     - Memanggil `deckB.setSinkId(deviceId)`.
     - Jika `audioCtx.setSinkId` tersedia: panggil `audioCtx.setSinkId(deviceId)`.
     - Simpan `currentAudioDeviceId = deviceId` ke `localStorage`.
     - Tampilkan feedback toast: `Audio output: [Nama Perangkat]`.
     - Perbarui status aktif pada daftar perangkat.

---

## 6. Rencana Pengujian (Verification Plan)

1. **Unit Test (`desktop/tests/audio-output-device.test.js`)**:
   - Pengujian parsing & klasifikasi jenis perangkat (Bluetooth, Headphone, Speaker Bawaan).
   - Pengujian pemanggilan `setSinkId` pada `deckA`, `deckB`, dan `audioCtx`.
   - Pengujian persistensi `localStorage` saat memilih perangkat baru.
   - Pengujian graceful fallback jika `setSinkId` mengembalikan error atau tidak didukung.
2. **Verifikasi Regresi**:
   - Menjalankan seluruh test suite yang ada (`npm test --prefix /home/rafliadipratama/sorafy/desktop`) untuk memastikan 126 tes yang ada tetap 100% lulus.
3. **Manual Verification**:
   - Menjalankan aplikasi desktop SoraFy, mengklik tombol audio device di player bar, memastikan popover terbuka dengan daftar perangkat fisik yang nyata, memilih perangkat, dan memverifikasi perpindahan suara.
