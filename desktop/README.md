# SoraFy Desktop: Dual-Target Architecture (Electron & Tauri v2)

SoraFy Desktop delivers high-fidelity, cross-platform music streaming across Linux, Windows, and macOS. To achieve optimal performance across diverse hardware—from memory-constrained laptops to high-end workstations—SoraFy employs a **Dual-Target Desktop Architecture**:

1. **Electron Target**: Production-proven runtime combining Chromium and Node.js for maximum backward compatibility and rich desktop integrations (Discord RPC, MPD server, local audio proxy, native Windows taskbar thumbnail toolbars).
2. **Tauri v2 Target**: Ultra-lightweight, high-performance runtime pairing native WebKitGTK (Linux) / WebView2 (Windows) / WebKit (macOS) with a memory-safe Rust backend built with Domain-Driven Design (DDD).

Both targets share identical front-end player logic, Web Audio DSP pipelines, and UI themes through our isomorphic `PlatformBridge`.

---

## Architecture Overview

```
                            SoraFy Desktop UI (HTML5 / Vanilla JS / CSS)
                                  [Priangan Emerald & Obsidian Void]
                                                │
                                                ▼
                              Isomorphic Platform Bridge (platform-bridge.js)
                             ┌──────────────────────────────────────────────┐
                             │  window.electronAPI (Standardized Interface)  │
                             └──────────────────────┬───────────────────────┘
                                                    │
                         ┌──────────────────────────┴──────────────────────────┐
                         │                                                     │
                         ▼ (Electron Runtime)                                  ▼ (Tauri v2 Runtime)
            Preload Script (preload.js)                           Tauri IPC (window.__TAURI__.core.invoke)
                         │                                                     │
                         ▼                                                     ▼
              Node.js Main Process                                  Rust Application Engine
              (electron-main.js)                                      (src-tauri/src/main.rs)
         ┌─────────────────────────┐                            ┌────────────────────────────────────┐
         │ • IPC Main Handlers     │                            │ • Commands & Ports (DDD)           │
         │ • Local Audio Proxy     │                            │ • Embedded Tokio Loopback Proxy    │
         │ • MPD Daemon (Port 6600)│                            │ • InnerTube / YouTube Stream Port  │
         │ • MCP Server (Port 8800)│                            │ • LRCLIB Lyrics Sync Port          │
         │ • Discord Rich Presence │                            │ • Settings & System Info Handlers  │
         └─────────────────────────┘                            └────────────────────────────────────┘
```

### The Universal `PlatformBridge`
The front-end code is written entirely against standard `window.electronAPI` calls. When launching under Tauri v2, `initGlobalBridge(window)` automatically polyfills `window.electronAPI` with `sorafyBridge`:
- Translates `window.electronAPI.resolveFullStream(...)` -> `invoke('resolve_full_stream', ...)`
- Translates `window.electronAPI.searchYouTubeMusic(...)` -> `invoke('search_tracks', ...)`
- Translates `window.electronAPI.fetchYouTubeLyrics(...)` -> `invoke('fetch_lyrics', ...)`
- Translates `window.electronAPI.getAppSettings()` -> `invoke('get_app_settings')`
- Transparently unwrap `CommandResponse<T>` envelopes (`{ success: true, data: T }`) into raw payloads
- Supplies non-blocking safe fallbacks for platform-specific APIs

---

## Memory Footprint & Performance Comparison

| Metric | Electron Runtime | Tauri v2 Runtime | Improvement |
| :--- | :--- | :--- | :--- |
| **GUI Engine** | Chromium (Blink) + V8 | WebKitGTK / WebKit / WebView2 | Native OS Webview |
| **Backend Runtime** | Node.js (V8) | Rust (Native compiled) | Zero GC overhead |
| **Idle Memory (PSS)** | ~520 MB PSS | ~65–95 MB PSS | **~82% reduction** |
| **Total Memory (RSS)** | ~1.05 GB Total RSS | ~80–140 MB RSS | **~75–85% reduction** |
| **Cold Startup Time** | ~1.8 – 2.4 seconds | ~0.3 – 0.5 seconds | **~4x faster launch** |
| **Installer / Binary Size**| ~95 – 120 MB | ~12 – 18 MB | **~85% smaller package** |

---

## Web Audio CORS Solution (Embedded Tokio Proxy)

WebKitGTK on Linux enforces strict CORS policies when audio streams are loaded inside `<audio crossorigin="anonymous">` elements (mandatory for the Web Audio API DSP pipeline, parametric EQ, and loudness normalizers). Remote Google Video CDN URLs do not consistently serve the required `Access-Control-Allow-Origin: *` headers for audio contexts.

To resolve this seamlessly:
- **Tauri v2 Engine** spins up an embedded, asynchronous **Tokio HTTP proxy** on a dynamic loopback address (`127.0.0.1:<port>`).
- When resolving streams, `resolve_full_stream` wraps the remote stream URL:
  ```text
  http://127.0.0.1:<port>/stream?url=https%3A%2F%2Frr1---sn-xxx.googlevideo.com%2Fvideoplayback%3F...
  ```
- The embedded Tokio proxy streams chunked audio bytes while injecting required CORS and range headers:
  - `Access-Control-Allow-Origin: *`
  - `Access-Control-Allow-Methods: GET, HEAD, OPTIONS`
  - `Access-Control-Allow-Headers: Range, Content-Type, Accept`
  - `Accept-Ranges: bytes`
- This guarantees bit-perfect, zero-latency Web Audio processing with seamless visualizer ripple animations and zero browser security blocks.

---

## Fedora Linux Build Prerequisites

When developing or compiling the Tauri v2 runtime on Fedora Linux (Fedora 39, 40, 41, or Rawhide), install the required system libraries and headers:

```bash
sudo dnf install \
  webkit2gtk4.1-devel \
  gtk3-devel \
  libayatana-appindicator3-devel \
  libsoup3-devel \
  openssl-devel
```

*(Ensure Rust toolchain `rustc` and `cargo` 1.77+ are installed via `rustup` or `sudo dnf install cargo rust`)*.

---

## Development Workflows

Navigate to the `desktop` directory:
```bash
cd desktop
npm install
```

### 1. Running in Development Mode

- **Electron Target**:
  ```bash
  npm start
  ```
  Launches the Electron application with hot-reloading and DevTools.

- **Tauri v2 Target**:
  ```bash
  npm run tauri:dev
  ```
  Compiles the Rust backend in debug mode, binds the WebKitGTK window, and launches the Tauri v2 application.

---

## Building Distribution Binaries

### 1. Building Electron Packages
Packages are generated in `desktop/dist/`:
```bash
# Linux AppImage
npm run build:linux

# All Linux targets (AppImage, deb, rpm, snap)
npm run build:linux:all

# Windows NSIS installer & portable exe
npm run build:win

# macOS DMG & zip bundle
npm run build:dmg

# Multi-platform builder
npm run dist
```

### 2. Building Tauri v2 Packages
Compiles optimized native release binaries with Cargo LTO into `desktop/src-tauri/target/release/`:
```bash
npm run tauri:build
```
Produces native Linux packages (`.deb`, `.rpm`, `.AppImage`), Windows `.msi` installers, and macOS `.dmg` bundles depending on the host OS.

---

## Testing & Quality Assurance

SoraFy Desktop features a comprehensive Node.js native test suite (`node:test`) covering runtime bridges, audio proxies, crossfade engines, loudness normalizers, and dual-target integration:

```bash
npm test
```

### Integration Test Suite Highlights:
- **`tests/dual-target-integration.test.js`**: Verifies full lifecycle bootstrap, mock IPC routing, and shape parity across Electron and Tauri runtimes.
- **`tests/platform-bridge.test.js`**: Validates runtime detection, invoke dispatching, envelope unwrapping, and fallback defaults.
- **`tests/audio-proxy.test.js`**: Tests loopback proxy URL formatting, parameter extraction, and CORS header compliance.
- **`tests/rust-commands.test.js`**: Validates request and response schemas for all DDD Rust commands.
- **`tests/dual-deck.test.js`**: Tests seamless dual-deck prefetching and non-blocking crossfade transitions.
- **`tests/loudness-normalizer.test.js`**: Validates Web Audio DSP compressor dynamics and bit-perfect bypass.

---

## License

SoraFy Desktop is open-source software licensed under the [GNU General Public License v3.0 (GPLv3)](../LICENSE).
