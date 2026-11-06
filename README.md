# SoraFy (Multiplatform Monorepo)

<div align="center">

<img src="shared/assets/logo_monogram.png" alt="SoraFy Logo" width="128" />

### **Fast, Elegant, and Subscription-Free Music Streaming Across Android, Linux, macOS, and Windows**

[![Release](https://img.shields.io/github/v/release/rafliadipratama/sorafy?color=00e599&style=flat-square)](https://github.com/rafliadipratama/sorafy/releases)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=flat-square)](LICENSE)
[![Website](https://img.shields.io/badge/Website-GitHub%20Pages-00e599?style=flat-square&logo=github)](https://rafliadipratama.github.io/sorafy/)
[![Android](https://img.shields.io/badge/Platform-Android_7.0%2B-brightgreen?style=flat-square&logo=android)](https://www.android.com/)
[![Linux](https://img.shields.io/badge/Platform-Linux_(AppImage%20%7C%20deb%20%7C%20snap%20%7C%20AUR)-FCC624?style=flat-square&logo=linux&logoColor=black)](https://kernel.org/)
[![Windows](https://img.shields.io/badge/Platform-Windows_10%2F11-0078D6?style=flat-square&logo=windows)](https://www.microsoft.com/)
[![macOS](https://img.shields.io/badge/Platform-macOS_(DMG)-black?style=flat-square&logo=apple)](https://apple.com/)
[![Kotlin](https://img.shields.io/badge/Kotlin-2.1-7F52FF?style=flat-square&logo=kotlin)](https://kotlinlang.org/)
[![Electron](https://img.shields.io/badge/Desktop-Electron_%26_Rust-47848F?style=flat-square&logo=electron)](https://www.electronjs.org/)

[**Official Website**](https://rafliadipratama.github.io/sorafy/) • [**Download Releases**](https://github.com/rafliadipratama/sorafy/releases/latest) • [**Key Features**](#-key-features) • [**Installation**](#-installation--package-managers) • [**Build Guide**](#-build-instructions) • [**License**](#-license)

</div>

---

## 🎧 About SoraFy

**SoraFy** is a modern, cross-platform music streaming and playback application built within a unified **Monorepo** architecture. It prioritizes user privacy, high-fidelity audio performance, and a sleek, uncompromised interface—completely free of advertisements, algorithmic feed clutter, or recurring subscription fees.

### Supported Platforms:
- 📱 **Android**: Native Kotlin + Jetpack Compose (Material 3) + AndroidX Media3 + Real FFT Audio Fingerprinting.
- 🐧 **Linux**: Native Desktop App (AppImage, deb, rpm, snap, and Arch Linux AUR).
- 🪟 **Windows**: Native Desktop App (NSIS Installer EXE and Portable).
- 🍎 **macOS**: Native Desktop App (Apple Silicon & Intel DMG).
- 🌐 **Web Landing Page & Portal**: Built with Astro & Tailwind CSS, hosted on [GitHub Pages](https://rafliadipratama.github.io/sorafy/).

Built with an intentional dark design language: deep *Obsidian Void* canvas, elevated *Slate Surface* cards, and energetic neon twin accents of *Priangan Emerald* & *Electric Lime*.

---

## 🎨 Design System & Official Color Tokens

| Design Token | Hex Code | Interface Role |
| :--- | :--- | :--- |
| **Obsidian Void** | `#0B0D10` | Primary canvas background; OLED/AMOLED battery-friendly deep tone |
| **Slate Surface** | `#181C22` | Surface containers, track rows, mini-player bar, modals, and sidebars |
| **Priangan Emerald** | `#00E599` | Primary brand accent: playback controls, squiggly seekbar, logo, and active badges |
| **Electric Lime** | `#C8FF29` | Energetic secondary accent: active synced lyrics glow, audio badges, and highlights |

---

## 🏛️ Monorepo Architecture

This repository is structured as a modular **Monorepo** to maintain architectural consistency across all target platforms:

```text
sorafy/
├── android/                   # Android Mobile Application (Kotlin + Jetpack Compose)
│   ├── app/                   # Native source code (Media3, UI, FFT Shazam fingerprinting)
│   ├── build.gradle.kts       # Android root Gradle configuration
│   └── settings.gradle.kts
│
├── desktop/                   # Cross-Platform Desktop App (macOS, Linux, & Windows)
│   ├── electron-main.js       # Main runtime process, window management, & IPC bridge
│   ├── preload.js             # Secure context bridge between main and renderer processes
│   ├── package.json           # App configuration, packaging, & electron-builder targets
│   ├── src/                   # Modern Desktop UI (SoraFy UI + Web Audio DSP Engine)
│   │   ├── app.js             # State management, playlist engine, equalizer, & audio core
│   │   ├── index.html         # Application shell structure, views, & modals
│   │   └── style.css          # Obsidian Void design tokens & responsive animations
│   ├── remote-web/            # SoraFy Jam web client (Wi-Fi companion for mobile devices)
│   └── src-tauri/             # Rust backend modules with Hexagonal / DDD architecture
│
├── packaging/                 # Official distribution packaging configurations
│   ├── aur/                   # PKGBUILD for Arch Linux AUR
│   ├── flatpak/               # Flatpak manifest for Flathub
│   ├── homebrew/              # Cask formula for macOS Homebrew
│   ├── snap/                  # snapcraft.yaml for Ubuntu Snapcraft
│   └── winget/                # Manifest YAML for Windows Package Manager (winget)
│
├── shared/                    # Shared Assets & Cross-Platform Design Tokens
│   ├── design/                # tokens.json & colors.css
│   └── assets/                # Monogram logo, branding diagrams, & visual assets
│
├── website/                   # Official Landing Page & Documentation Portal
│   ├── src/                   # Astro components, Tailwind CSS, & TypeScript
│   └── astro.config.mjs       # Static site generator configuration
│
└── .github/workflows/
    ├── deploy-pages.yml       # Automated CI/CD deployment to GitHub Pages
    └── release.yml            # Automated CI/CD multi-platform binary release pipeline
```

---

## ✨ Key Features

### 🎵 High-Fidelity Audio & Visual Experience
- **Squiggly Waveform Seekbar**: Dynamic sinusoidal progress bar that ripples fluidly during playback and flattens smoothly upon pause.
- **Screen Player View**: Minimalist, full-screen playback mode with a vertically and horizontally centered album artwork, ambient dynamic color mesh overlay / glow vignette extracted from the cover, and tap/click-to-play/pause.
- **Word-by-Word Synchronized Lyrics**: Millisecond-accurate timestamped lyrics sourced from LRCLIB and Musixmatch, with fine-tuned line-offset calibration and Furigana support for Japanese tracks.
- **7-Band Parametric Equalizer**: Precision Web Audio API DSP filters with sub-bass boost, vocal clarity enhancement, stereo surround expansion, and volume normalization.
- **High-Fidelity Audio Badges**: Instant stream quality indicators (*FLAC Lossless*, *Opus Hi-Res 320kbps*, and *AAC High*).

### 📚 Library & Playlist Management
- **Custom Playlist Cover Upload**: Upload custom artwork for your personal playlists through a clean dialog (supports local image files, remote image URLs, or resetting to default gradient art).
- **Downloaded Songs & Liked Songs Hub**: Dedicated library views to organize liked tracks and offline cached songs with download progress and availability indicators.
- **Pin & Unpin Favorites**: Pin your top playlists, favorite artists, and albums to the top of *My Library* for instant one-click access.
- **Right-Click Context Menu**: Swift action shortcuts on any library item to Play, Follow/Unfollow artists, Edit Playlist details & cover art, Pin/Unpin, or Remove from library.
- **Universal Playlist Importer**: One-click playlist resolution and import from Spotify, Apple Music, and YouTube without requiring accounts or login credentials.

### 🛠️ Developer & Power-User Integrations
- **SoraFy Jam (Port 4120)**: Wireless remote playback companion. Scan a QR code from any smartphone connected to the same local Wi-Fi to seamlessly control playback from a browser without installing extra apps.
- **Music Player Daemon / MPD (Port 6600)**: Native MPD socket protocol compatibility. Control SoraFy using standard Linux terminal clients like `mpc`, `ncmpcpp`, `yams`, or integrate playback status into desktop status bars (Polybar / Waybar).
- **Model Context Protocol / AI MCP (Port 8800)**: Built-in JSON-RPC server allowing AI coding assistants (Claude Code, Cursor, Windsurf) to query track metadata, queue songs, or tweak equalizers while you program.
- **Discord Rich Presence**: Real-time display of currently playing track, artist name, album artwork, and playback progress on your desktop Discord profile.
- **Acoustic Music Recognition (Android)**: Real-time audio identification of surrounding music using Fast Fourier Transform (FFT) acoustic fingerprinting.

---

## 📦 Installation & Package Managers

In addition to downloading standalone installers directly from [GitHub Releases](https://github.com/rafliadipratama/sorafy/releases/latest), SoraFy can be installed via package managers across major platforms:

### 🍎 macOS (Homebrew Cask)
```bash
brew install --cask sorafy
```
*Note for macOS users if blocked by Apple Gatekeeper on manual DMG installations:*
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

## 🚀 Build Instructions

### 1. Building the Android Application (APK)

Ensure JDK 17+ and the Android SDK are installed and configured:
```bash
cd android
./gradlew assembleDebug

# Build release-ready APK:
./gradlew assembleRelease
```
*The resulting APKs are located in `android/app/build/outputs/apk/`.*

### 2. Building the Desktop Application (Linux, Windows, & macOS)

Ensure Node.js 20+ and npm are installed:
```bash
cd desktop
npm install

# Run in local development mode:
npm start
```

**Configuring Discord Rich Presence (Optional):**
Copy `desktop/.env.example` to `desktop/.env` and specify your Discord Client ID:
```env
DISCORD_CLIENT_ID=YOUR_DISCORD_APPLICATION_ID
```

**Building Desktop Release Packages:**
```bash
# Linux (AppImage & deb):
npm run build:linux

# Windows (NSIS Installer EXE):
npm run build:win

# macOS (DMG & zip):
npm run build:dmg
```
*Installers and binaries will be generated inside the `desktop/dist/` directory.*

### 3. Building the Landing Page & Documentation Web

Ensure Bun is installed:
```bash
cd website
bun install

# Run local development preview:
bun run dev

# Build static production assets:
bun run build
```

---

## 📥 Download Official Releases

All precompiled binaries for every supported platform (Android APK, Linux AppImage/deb, Windows EXE, and macOS DMG) are published together at:

👉 **[Download SoraFy on GitHub Releases](https://github.com/rafliadipratama/sorafy/releases/latest)**

---

## 📄 License

This project is licensed under the [GNU General Public License v3.0 (GPLv3)](LICENSE).  
Crafted with passion and dedication by [Rafli Adi Pratama](https://github.com/rafliadipratama).
