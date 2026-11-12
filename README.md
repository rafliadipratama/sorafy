# SoraFy

<div align="center">

<img src="shared/assets/logo_monogram.png" alt="SoraFy Logo" width="128" />

### Fast, clean, subscription-free music streaming for desktop & mobile

[![Release](https://img.shields.io/github/v/release/rafliadipratama/sorafy?color=00e599&style=flat-square)](https://github.com/rafliadipratama/sorafy/releases)
[![Stars](https://img.shields.io/github/stars/rafliadipratama/sorafy?color=00e599&style=flat-square)](https://github.com/rafliadipratama/sorafy/stargazers)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=flat-square)](LICENSE)
[![Website](https://img.shields.io/badge/Website-GitHub%20Pages-00e599?style=flat-square&logo=github)](https://rafliadipratama.github.io/sorafy/)
[![Platform](https://img.shields.io/badge/Platforms-Android%20%7C%20Linux%20%7C%20Windows%20%7C%20macOS-white?style=flat-square)](https://github.com/rafliadipratama/sorafy/releases/latest)

[**Website**](https://rafliadipratama.github.io/sorafy/) • [**Download**](https://github.com/rafliadipratama/sorafy/releases/latest) • [**Features**](#-features) • [**Installation**](#-installation) • [**Build from Source**](#-build-from-source) • [**Star History**](#-star-history) • [**Contributors**](#-contributors)

</div>

---

## Overview

SoraFy is a free, open-source music player built around straightforward priorities: no subscription costs, no audio ads, and no algorithm-forced feeds. You get full control over your library, timestamped karaoke lyrics, fine parametric audio equalization, and local Wi-Fi remote playback.

### Where it runs
- **Android**: Native Kotlin with Jetpack Compose, AndroidX Media3, and acoustic song identification.
- **Linux**: Dual-target desktop runtime (Electron & lightweight Tauri v2) packaged as AppImage, deb, rpm, Snap, and Arch Linux AUR.
- **Windows**: Dual-target runtime (Electron & Tauri v2) with NSIS installer and portable executable for Windows 10 & 11.
- **macOS**: Dual-target runtime (Electron & Tauri v2) with native DMG bundle for Apple Silicon and Intel Macs.
- **Web**: Project documentation and static site hosted on [GitHub Pages](https://rafliadipratama.github.io/sorafy/).

---

## Color System

SoraFy uses an OLED-friendly dark palette across desktop and mobile interfaces:

| Token | Hex | Usage |
| :--- | :--- | :--- |
| **Obsidian Void** | `#0B0D10` | Main canvas background |
| **Slate Surface** | `#181C22` | Cards, track rows, bottom player bar, sidebars, and modals |
| **Priangan Emerald** | `#00E599` | Primary brand color: play buttons, squiggly seekbar, and active items |
| **Electric Lime** | `#C8FF29` | Highlights: active lyric glow and audio quality badges |

---

## Repository Layout

```text
sorafy/
├── android/         # Native Android app (Kotlin + Jetpack Compose)
├── desktop/         # Desktop application (macOS, Linux, Windows)
│   ├── src/         # UI markup, player logic, and Web Audio DSP
│   └── src-tauri/   # Rust backend services and domain ports
├── packaging/       # Distro packaging configs (AUR, Flatpak, Homebrew, Snap, Winget)
├── shared/          # Brand assets and design tokens
└── website/         # Official Astro landing page
```

---

## Features

### Audio & Playback
- **Squiggly Waveform Seekbar**: A fluid wave progress bar that ripples while audio plays and flattens smoothly when paused.
- **Screen Player View**: Full-screen player mode with a centered album cover, ambient color glow sampled from the artwork, and click-to-toggle play/pause.
- **Synchronized Lyrics**: Millisecond-accurate word-by-word karaoke lyrics fetched from LRCLIB and Musixmatch, with manual offset adjustments and Furigana support for Japanese songs.
- **7-Band Parametric Equalizer**: Web Audio DSP with presets and custom sliders for sub-bass, vocal clarity, stereo surround, and volume leveling.
- **Audio Quality Badges**: Quick visual badges indicating whether the active stream is FLAC Lossless, Opus 320kbps, or AAC.

### Library & Organization
- **Custom Playlist Artwork**: Upload local image files, paste external URLs, or reset to generated color gradients.
- **Liked & Downloaded Songs**: Dedicated views for favorited tracks and songs cached locally for offline listening.
- **Pin Items**: Pin your favorite playlists, artists, and albums to the top of the sidebar.
- **Context Menus**: Right-click any playlist, track, or artist to play, edit metadata, follow, or delete.
- **Universal Importer**: Paste public playlist links from Spotify, Apple Music, or YouTube to resolve tracks without logging in.

### Integrations
- **Discord Rich Presence**: Share current track titles, artist names, album art, and timestamps on your Discord profile.
- **Acoustic Song Search (Android)**: Tap to listen to surrounding music and detect titles using Fast Fourier Transform audio fingerprinting.

---

## Installation

Download the latest installer from [GitHub Releases](https://github.com/rafliadipratama/sorafy/releases/latest), or install through your system's package manager:

### macOS (Homebrew Cask)
```bash
brew install --cask sorafy
```
> If macOS Gatekeeper flags manual DMG installations, clear the quarantine attribute:
> ```bash
> sudo xattr -r -d com.apple.quarantine /Applications/SoraFy.app
> ```

### Windows (winget)
```powershell
winget install SoraFy
```

### Linux

**Arch Linux (AUR):**
```bash
yay -S sorafy-bin
```

**Flatpak (Flathub):**
```bash
flatpak install flathub com.rafliadipratama.sorafy
```

**Ubuntu / Debian (Snap):**
```bash
sudo snap install sorafy
```

---

## Build from Source

### Android (APK)
Requirements: JDK 17+ and Android SDK.
```bash
cd android
./gradlew assembleDebug

# For a release APK:
./gradlew assembleRelease
```
The output APK is generated in `android/app/build/outputs/apk/`.

### Desktop (Linux, Windows, macOS)
Requirements: Node.js 20+ and npm (and Rust 1.77+ for Tauri target). See [desktop/README.md](desktop/README.md) for full architecture and Fedora Linux prerequisites.
```bash
cd desktop
npm install

# Start Electron development app:
npm start

# Or start ultra-lightweight Tauri v2 development app:
npm run tauri:dev
```

To configure Discord Rich Presence, copy `desktop/.env.example` to `desktop/.env` and add your client ID:
```env
DISCORD_CLIENT_ID=YOUR_DISCORD_APPLICATION_ID
```

Package for your current operating system:
```bash
# Electron distribution packages:
npm run build:linux  # AppImage & deb
npm run build:win    # Windows installer
npm run build:dmg    # macOS DMG

# Tauri v2 native release binaries:
npm run tauri:build
```
Binary installers are written to `desktop/dist/` (Electron) and `desktop/src-tauri/target/release/` (Tauri).

### Website
Requirements: Bun.
```bash
cd website
bun install
bun run dev   # Local preview
bun run build # Static production output
```

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=rafliadipratama/sorafy&type=Date)](https://star-history.com/#rafliadipratama/sorafy&Date)

---

## 👥 Contributors

Thank you to everyone helping build and improve SoraFy!

<a href="https://github.com/rafliadipratama/sorafy/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=rafliadipratama/sorafy" alt="SoraFy Contributors" />
</a>

Contributions of all kinds—whether fixing bugs, improving documentation, or proposing new features—are warmly welcomed. Feel free to open an issue or pull request.

---

## 📄 License

SoraFy is released under the [GNU General Public License v3.0 (GPLv3)](LICENSE).  
Maintained by [Rafli Adi Pratama](https://github.com/rafliadipratama).
