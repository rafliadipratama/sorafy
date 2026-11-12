# SoraFy Desktop: High-Fidelity Music Streaming Player

SoraFy Desktop is a production-grade, high-fidelity music streaming application for **Linux, Windows, and macOS**. Built with **Electron, Chromium, and Node.js**, SoraFy provides an authentic, high-speed, and feature-rich alternative for users looking to migrate away from Spotify, Apple Music, and other subscription-based music players.

---

## 🌟 Why SoraFy? (The Ultimate Spotify Alternative)

- **100% Free & Open Source**: No accounts, no paywalls, zero ads, and no tracking.
- **Studio-Quality Audio**:
  - High-bitrate Opus HD & AAC 320 kbps direct streams.
  - Seamless fallback cascade to Lossless FLAC 16-bit / 24-bit.
- **Spotify Migration & Playlist Importer**:
  - Instantly import and sync any public Spotify playlist link into your personal SoraFy collection without needing a Spotify Premium account.
- **Dual-Deck Audio Engine with Smooth Crossfade**:
  - Deck A & Deck B architecture enabling studio-grade gapless transitions and customizable crossfade durations (1s – 12s).
- **Synchronized Karaoke Lyrics**:
  - Live timestamped karaoke lyrics powered by LRCLIB with manual timing calibration.
- **DSP Equalizer Studio**:
  - 10-band parametric equalizer with dynamic Bass Boost and 3D Virtualizer soundstage expansion.
- **Discord Rich Presence (Kizzy)**:
  - Real-time "Listening to..." status on your Discord profile with album art and track progress.
- **Local-First Audio Interceptor & Offline Library**:
  - Download songs locally to `~/Music/SoraFy` in MP3 320kbps or Opus format with instant offline detection and playback.
- **Native OS Desktop Integration**:
  - **Windows**: Interactive taskbar thumbnail toolbar (Play / Pause / Next / Prev).
  - **Linux**: MPRIS D-Bus media controls and system tray integration.
  - **macOS**: MediaSession API integration with Control Center support.

---

## 🏗️ Architecture Overview

```
                        SoraFy Desktop UI (HTML5 / Vanilla JS / CSS)
                             [Priangan Emerald & Obsidian Void]
                                           │
                                           ▼
                               Preload Script (preload.js)
                         ┌───────────────────────────────────┐
                         │ window.electronAPI (IPC Contract) │
                         └─────────────────┬─────────────────┘
                                           │
                                           ▼
                         Node.js Main Process (electron-main.js)
                         ┌───────────────────────────────────┐
                         │ • Dual-Engine Audio Stream Resolver│
                         │ • Local HTTP Audio & Embed Proxy  │
                         │ • Discord Rich Presence Client    │
                         │ • Offline Storage & File Downloader│
                         │ • Windows Thumbar & Tray Controls │
                         └───────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher (v20+ recommended)
- `npm` v9 or higher

### Installation & Run

Navigate to the `desktop` directory:
```bash
cd desktop
npm install
```

Launch SoraFy Desktop in development mode:
```bash
npm start
```

---

## 📦 Building Distribution Packages

SoraFy Desktop uses `electron-builder` to produce standalone installers and portable binaries across all desktop platforms:

### Linux
```bash
# Build standalone Linux AppImage (x86_64)
npm run build:linux

# Build all Linux targets (AppImage, deb, rpm, snap)
npm run build:linux:all
```

### Windows
```bash
# Build Windows NSIS installer and portable executable (.exe)
npm run build:win
```

### macOS
```bash
# Build macOS DMG installer and zip bundle
npm run build:dmg
```

### Multi-Platform
```bash
# Build for host platform
npm run dist
```

Outputs are automatically placed in `desktop/dist/`.

---

## 🧪 Testing & Quality Assurance

SoraFy includes a comprehensive Node.js native test suite (`node:test`) verifying audio proxy pipelines, crossfade transitions, dual-deck states, Discord RPC, loudness normalizers, and platform bridges:

```bash
npm test
```

### Test Suite Highlights:
- **`tests/audio-proxy.test.js`**: Validates local loopback proxy URL formatting, query parameter extraction, and CORS header compliance.
- **`tests/dual-deck.test.js`**: Tests seamless dual-deck prefetching, volume gain curves, and non-blocking crossfade transitions.
- **`tests/discord-rpc.test.js`**: Validates RPC handshake, activity serialization, and connection lifecycle management.
- **`tests/local-interceptor.test.js`**: Validates filename sanitization, local audio path resolution, and metadata fuzzy matching.
- **`tests/loudness-normalizer.test.js`**: Validates Web Audio DSP compressor dynamics and bit-perfect audio bypass.
- **`tests/thumbar-mediasession.test.js`**: Validates Windows taskbar thumbnail buttons, MediaSession API, and state synchronization.

---

## 📄 License

SoraFy Desktop is open-source software licensed under the [GNU General Public License v3.0 (GPLv3)](../LICENSE).
