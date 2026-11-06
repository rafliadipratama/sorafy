# SoraFy (Multiplatform Monorepo)

<div align="center">

<img src="shared/assets/logo_monogram.png" alt="SoraFy Logo" width="128" />

### **Aplikasi Streaming Musik Cepat, Elegan, dan Bebas Biaya Langganan Lintas Platform**

[![Release](https://img.shields.io/github/v/release/rafliadipratama/sorafy?color=00e599&style=flat-square)](https://github.com/rafliadipratama/sorafy/releases)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=flat-square)](LICENSE)
[![Website](https://img.shields.io/badge/Website-GitHub%20Pages-00e599?style=flat-square&logo=github)](https://rafliadipratama.github.io/sorafy/)
[![Android](https://img.shields.io/badge/Platform-Android_7.0%2B-brightgreen?style=flat-square&logo=android)](https://www.android.com/)
[![Linux](https://img.shields.io/badge/Platform-Linux_(AppImage%20%7C%20deb%20%7C%20snap%20%7C%20AUR)-FCC624?style=flat-square&logo=linux&logoColor=black)](https://kernel.org/)
[![Windows](https://img.shields.io/badge/Platform-Windows_10%2F11-0078D6?style=flat-square&logo=windows)](https://www.microsoft.com/)
[![macOS](https://img.shields.io/badge/Platform-macOS_(DMG)-black?style=flat-square&logo=apple)](https://apple.com/)
[![Kotlin](https://img.shields.io/badge/Kotlin-2.1-7F52FF?style=flat-square&logo=kotlin)](https://kotlinlang.org/)
[![Electron](https://img.shields.io/badge/Desktop-Electron_%26_Rust-47848F?style=flat-square&logo=electron)](https://www.electronjs.org/)

[**Website Resmi**](https://rafliadipratama.github.io/sorafy/) • [**Unduh Rilis**](https://github.com/rafliadipratama/sorafy/releases/latest) • [**Fitur Unggulan**](#-fitur-unggulan) • [**Instalasi**](#-instalasi--manajemen-paket) • [**Panduan Build**](#-panduan-membangun-build-instructions) • [**Lisensi**](#-lisensi)

</div>

---

## 🎧 Tentang SoraFy

**SoraFy** adalah aplikasi pemutar dan pengalir musik modern lintas platform (*cross-platform*) yang dibangun dengan arsitektur **Monorepo** serta mengedepankan privasi pengguna, performa audio beresolusi tinggi, dan antarmuka premium tanpa kompromi iklan atau biaya langganan.

### Platform yang Didukung:
- 📱 **Android**: Native Kotlin + Jetpack Compose (Material 3) + AndroidX Media3 + FFT Audio Fingerprinting.
- 🐧 **Linux**: Native Desktop App (AppImage, deb, rpm, snap, dan Arch Linux AUR).
- 🪟 **Windows**: Native Desktop App (Installer NSIS EXE dan Portable).
- 🍎 **macOS**: Native Desktop App (Apple Silicon & Intel DMG).
- 🌐 **Landing Page & Web Portal**: Dibangun dengan Astro & Tailwind CSS, di-host melalui [GitHub Pages](https://rafliadipratama.github.io/sorafy/).

Aplikasi mengusung bahasa visual gelap modern: kanvas utama *Obsidian Void*, kartu elevasi *Slate Surface*, serta aksen kembar *Priangan Emerald* & *Electric Lime*.

---

## 🎨 Sistem Desain & Palet Warna Resmi

| Token Desain | Kode Hex | Peran Antarmuka |
| :--- | :--- | :--- |
| **Obsidian Void** | `#0B0D10` | Latar belakang kanvas utama (*canvas background*), ramah daya layar OLED/AMOLED |
| **Slate Surface** | `#181C22` | Warna dasar kartu (*cards*), wadah baris lagu (*track rows*), *mini-player*, dan panel navigasi |
| **Priangan Emerald** | `#00E599` | Warna aksen utama (*primary brand*): tombol putar (*play*), *squiggly seekbar*, logo, dan status aktif |
| **Electric Lime** | `#C8FF29` | Aksen sekunder *neon energetic*: *glow active lyrics*, *badge* kualitas audio, dan highlight status |

---

## 🏛️ Arsitektur Monorepo

Repository ini disusun dalam struktur **Monorepo** modular untuk menjaga konsistensi lintas platform:

```text
sorafy/
├── android/                   # Aplikasi Mobile Android (Kotlin + Jetpack Compose)
│   ├── app/                   # Kode sumber Android native (Media3, UI, FFT Shazam)
│   ├── build.gradle.kts       # Konfigurasi Gradle root Android
│   └── settings.gradle.kts
│
├── desktop/                   # Aplikasi Desktop (macOS, Linux, & Windows)
│   ├── electron-main.js       # Runtime proses utama, window manager, & IPC bridge
│   ├── preload.js             # Context bridge aman antar proses
│   ├── package.json           # Konfigurasi paket & electron-builder
│   ├── src/                   # Antarmuka Desktop Modern (SoraFy UI + Audio Engine)
│   │   ├── app.js             # State management, playlist, equalizer, & DSP
│   │   ├── index.html         # Struktur tampilan desktop & modal sistem
│   │   └── style.css          # Desain sistem Obsidian Void & animasi responsif
│   ├── remote-web/            # SoraFy Jam web client (mobile companion Wi-Fi)
│   └── src-tauri/             # Modul backend Rust berarsitektur Hexagonal / DDD
│
├── packaging/                 # Konfigurasi distribusi paket resmi
│   ├── aur/                   # PKGBUILD untuk Arch Linux AUR
│   ├── flatpak/               # Manifest Flatpak untuk Flathub
│   ├── homebrew/              # Cask Formula untuk macOS Homebrew
│   ├── snap/                  # snapcraft.yaml untuk Ubuntu Snapcraft
│   └── winget/                # Manifest YAML untuk Windows Package Manager
│
├── shared/                    # Aset Bersama & Token Desain Lintas Platform
│   ├── design/                # tokens.json & colors.css
│   └── assets/                # Logo monogram, diagram branding, dan ikon origami
│
├── website/                   # Landing Page & Portal Dokumentasi Resmi
│   ├── src/                   # Komponen Astro, Tailwind CSS, & TypeScript
│   └── astro.config.mjs       # Konfigurasi static site generator
│
└── .github/workflows/
    ├── deploy-pages.yml       # CI/CD deployment otomatis ke GitHub Pages
    └── release.yml            # CI/CD otomatis untuk rilis multi-platform
```

---

## ✨ Fitur Unggulan

### 🎵 Pengalaman Audio & Visual
- **Squiggly Waveform Seekbar**: Bilah progres lagu bergelombang sinusoidal dinamis yang hidup saat audio berputar dan merata elastis saat dihentikan.
- **Screen Player View**: Mode tampilan layar penuh minimalis dengan album art responsif di tengah, pendaran dinamis *ambient color mesh overlay* dari cover lagu, serta interaktivitas *click-to-play/pause*.
- **Word-by-Word Synchronized Lyrics**: Lirik tersinkronisasi presisi milidetik dari LRCLIB dan Musixmatch, lengkap dengan kalibrasi offset baris lirik serta dukungan Furigana untuk trek berbahasa Jepang.
- **7-Band Parametric Equalizer**: Pengaturan profil akustik berbasis Web Audio API dengan opsi penyesuaian *sub-bass boost*, kejernihan vokal, *stereo surround*, dan *volume normalization*.
- **High-Fidelity Audio Badge**: Indikator langsung kualitas berkas (*FLAC Lossless*, *Opus Hi-Res 320kbps*, dan *AAC High*).

### 📚 Koleksi & Manajemen Playlist
- **Custom Playlist Cover Upload**: Unggah foto sampul kustom untuk playlist buatanmu melalui dialog bersih (dukungan berkas lokal, tautan gambar, atau kembali ke cover bawaan).
- **Downloaded Songs & Liked Songs Hub**: Halaman khusus untuk menjelajahi lagu yang disukai serta arsip lagu yang telah diunduh secara offline dengan indikator status unduhan.
- **Pin & Unpin Favorites**: Sematkan playlist, artis, atau album favorit langsung di posisi teratas *My Library*.
- **Shortcut Klik Kanan (Context Menu)**: Akses cepat pada item koleksi untuk memutar (*Play*), mengikuti/berhenti mengikuti artis (*Follow/Unfollow*), mengubah info & cover playlist, pin/unpin, atau menghapus dari library.
- **Universal Playlist Importer**: Impor daftar putar langsung dari Spotify, Apple Music, dan YouTube tanpa memerlukan autentikasi login atau akun pihak ketiga.

### 🛠️ Integrasi Power-User & Pengembang
- **SoraFy Jam (Port 4120)**: Remote playback nirkabel. Pindai kode QR dari ponsel di jaringan Wi-Fi lokal yang sama untuk mengontrol lagu dari browser tanpa perlu menginstal aplikasi tambahan.
- **Music Player Daemon / MPD (Port 6600)**: Soket protokol MPD bawaan untuk mengontrol SoraFy menggunakan perintah terminal Linux standar seperti `mpc`, `ncmpcpp`, `yams`, atau menghubungkannya ke widget Polybar / Waybar.
- **Model Context Protocol / AI MCP (Port 8800)**: Server JSON-RPC untuk menghubungkan asisten coding AI (Claude Code, Cursor, Windsurf) agar dapat mengontrol pemutaran musik, membaca lirik, dan menyesuaikan volume langsung dari editor kode.
- **Discord Rich Presence**: Menampilkan judul lagu, artis, artwork album, dan durasi berjalan secara *real-time* di profil Discord desktop.
- **Pendeteksi Musik Akustik (Android)**: Identifikasi judul lagu di sekitarmu secara instan melalui analisis spektrum audio *Fast Fourier Transform* (FFT).

---

## 📦 Instalasi & Manajemen Paket

Selain mengunduh berkas installer biner langsung dari [GitHub Releases](https://github.com/rafliadipratama/sorafy/releases/latest), SoraFy dapat dipasang melalui package manager resmi di berbagai sistem operasi:

### 🍎 macOS (Homebrew Cask)
```bash
brew install --cask sorafy
```
*Catatan untuk pengguna macOS jika aplikasi dibatasi oleh Gatekeeper saat instalasi manual:*
```bash
sudo xattr -r -d com.apple.quarantine /Applications/SoraFy.app
```

### 🪟 Windows (winget)
```powershell
winget install SoraFy
```

### 🐧 Linux

**Arch Linux (AUR):**
```bash
yay -S sorafy-bin
```

**Flathub / Flatpak:**
```bash
flatpak install flathub com.rafliadipratama.sorafy
```

**Ubuntu / Debian (Snap):**
```bash
sudo snap install sorafy
```

---

## 🚀 Panduan Membangun (*Build Instructions*)

### 1. Membangun Aplikasi Android (APK)

Pastikan JDK 17+ dan Android SDK telah terpasang:
```bash
cd android
./gradlew assembleDebug

# Membangun APK Release siap distribusi:
./gradlew assembleRelease
```
*Hasil berkas APK berada di folder `android/app/build/outputs/apk/`.*

### 2. Membangun Aplikasi Desktop (Linux, Windows & macOS)

Pastikan Node.js 20+ dan npm telah terpasang:
```bash
cd desktop
npm install

# Menjalankan mode pengembangan (Dev):
npm start
```

**Konfigurasi Discord Rich Presence (Opsional):**
Salin `desktop/.env.example` ke `desktop/.env` lalu masukkan Client ID Discord Anda:
```env
DISCORD_CLIENT_ID=ID_APLIKASI_DISCORD_ANDA
```

**Membangun Paket Rilis Desktop:**
```bash
# Linux (AppImage & deb):
npm run build:linux

# Windows (NSIS Installer EXE):
npm run build:win

# macOS (DMG & zip):
npm run build:dmg
```
*Hasil binary installer otomatis tersedia di folder `desktop/dist/`.*

### 3. Membangun Landing Page & Dokumentasi Web

Pastikan Bun telah terpasang:
```bash
cd website
bun install

# Menjalankan preview lokal:
bun run dev

# Membangun static site untuk produksi:
bun run build
```

---

## 📥 Unduh Rilis Resmi

Seluruh versi rilis biner untuk semua platform (Android APK, Linux AppImage/deb, Windows exe, macOS dmg) dipublikasikan secara terpadu di:

👉 **[Unduh SoraFy di GitHub Releases](https://github.com/rafliadipratama/sorafy/releases/latest)**

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [GNU General Public License v3.0 (GPLv3)](LICENSE).  
Dibuat dengan dedikasi oleh [Rafli Adi Pratama](https://github.com/rafliadipratama).
