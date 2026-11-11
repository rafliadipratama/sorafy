# Design Document: SoraFy Desktop Tauri v2 Dual-Target Architecture

**Date:** 2026-11-11  
**Author:** Pair programming (Rafli Adi Pratama & Antigravity)  
**Status:** In Review / Ready for Approval  
**Target Component:** `desktop/src-tauri/`, `desktop/src/modules/platform-bridge.js`, `desktop/src/app.js`

---

## 1. Intent & Context

SoraFy Desktop currently runs on **Electron v44.9.2** (Chromium V8 + Node.js). While responsive and free of telemetry/ad bloat compared to official Spotify or YouTube Music, Electron's inherent baseline footprint on Linux (Fedora 44) consumes:
- **Actual PSS Memory:** ~520 MB (Total RSS: ~1.05 GB across GPU, renderer, zygote, and audio processes).
- **Distribution Bundle:** ~161 MB (`SoraFy-2.0.0.AppImage`).

The user requested a much lighter alternative using **Rust and Tauri** to drastically minimize RAM and binary size, while keeping the application rock-solid and stable. A foundation for Tauri already exists in [`desktop/src-tauri`](file:///home/rafliadipratama/sorafy/desktop/src-tauri) with Clean Architecture / Domain-Driven Design (DDD).

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
1. **Dual-Target Runtime:** Enable building and running SoraFy via either Electron (`npm run start` / `npm run build:linux`) or Tauri (`npm run tauri:dev` / `npm run tauri:build`) from the exact same codebase.
2. **Seamless Aliased Platform Bridge (`desktop/src/modules/platform-bridge.js`):**
   - Automatically detects host runtime (`electron`, `tauri`, or `web`).
   - If running under Tauri or Web, dynamically polyfills/aliases `window.electronAPI = window.sorafyBridge`.
   - Eliminates the need to rewrite or disrupt 100+ call sites across 11,800+ lines in `desktop/src/app.js`.
   - Guarantees that all 51 existing unit tests continue to pass 100% without modification.
3. **Drastic Resource Reduction (Tauri Target):**
   - Active RAM usage: **~80 – 140 MB** (down from ~520 MB, saving ~75%).
   - Binary installer size: **~15 – 25 MB** (down from ~161 MB, saving ~85%).
   - Near-instant cold launch time.
4. **Preserve Audio DSP Fidelity & WebKitGTK CORS Compatibility:**
   - WebKitGTK enforces strict CORS on `<audio id="audioSource" crossorigin="anonymous">`.
   - Implement an embedded Tokio local HTTP audio proxy in Rust (mirroring Electron's `localAudioProxy`) to relay remote `googlevideo.com` audio and local offline tracks with proper `Access-Control-Allow-Origin: *` and `HTTP 206 Partial Content`.
   - Keep 100% of Web Audio engine features (Dual-Deck Gapless, Loudness Normalization, 10-Band EQ, Local-first Interceptor) completely functional.

### Non-Goals
1. **Not Deprecating Electron Immediately:** We do not delete `electron-main.js` or discard Electron packaging. Electron remains the battle-tested fallback.
2. **Not Forking the Frontend:** There will NOT be a separate `index-tauri.html` or duplicate UI code. One single frontend serves both targets.

### Anti-Goals
1. **No Broken Features on Either Target:** Running the Electron build must continue passing all 51 test suites and executing flawlessly.
2. **No Regression on Web Audio API:** Audio processing must continue to run with high fidelity without stutter or dropouts.

---

## 3. Approaches Considered & Trade-Offs

### Approach A: Immediate Full Cutover (Replace Electron Directly)
- *Concept:* Completely delete `electron-main.js` and force everything into Rust.
- *Trade-off:* High risk. `electron-main.js` has ~5,200 lines and ~45 IPC handlers. Rewriting all of them at once will leave the desktop app broken for days.
- *Verdict:* **Rejected.**

### Approach B: Dual-Target with Platform Bridge (CHOSEN)
- *Concept:* Introduce `desktop/src/modules/platform-bridge.js`. Add Tauri v2 integration to `desktop/src-tauri`. Map core commands (catalog search, stream resolution, settings, lyrics) to Rust. If a command is not yet in Rust on Tauri, bridge provides graceful fallback. Both Electron and Tauri can be launched and tested side-by-side on Fedora.
- *Trade-off:* Requires maintaining the IPC contract in two places during the transition, but guarantees **zero downtime** and immediate ability to benchmark RAM side-by-side.
- *Verdict:* **Selected.**

---

## 4. Technical Architecture & Component Details

### 4.1 System Prerequisites on Fedora Linux
Tauri v2 on Linux relies on system WebKitGTK and GTK3 libraries rather than bundling Chromium.
To compile `src-tauri` with Tauri v2 on Fedora, the host machine requires:
```bash
sudo dnf install webkit2gtk4.1-devel gtk3-devel libayatana-appindicator3-devel libsoup3-devel openssl-devel
```
*(Verified: Fedora 44 already has all required GStreamer runtime plugins installed: `gstreamer1-plugins-good`, `gstreamer1-plugins-bad-free`, and `gstreamer1-plugin-libav`, meaning audio playback for Opus, WebM, AAC, and MP3 is ready).*

### 4.2 Cargo & Tauri v2 Configuration (`desktop/src-tauri/Cargo.toml`)
Update `Cargo.toml` to include Tauri v2 dependencies:
```toml
[dependencies]
tauri = { version = "2.0", features = ["tray-icon"] }
tauri-plugin-shell = "2.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tokio = { version = "1.0", features = ["full"] }
reqwest = { version = "0.12", default-features = false, features = ["rustls-tls", "json"] }
async-trait = "0.1"
thiserror = "2.0"
regex = "1.10"
dirs = "6.0"

[build-dependencies]
tauri-build = { version = "2.0", features = [] }
```

### 4.3 `tauri.conf.json` Adjustments for Tauri v2
1. **Enable Global Window Tauri Object:**
   Set `"app": { "withGlobalTauri": true }` so vanilla HTML/JS without bundler can access `window.__TAURI__.core.invoke`.
2. **Capabilities Configuration:**
   Add `src-tauri/capabilities/default.json` with core permissions (`core:default`, `shell:default`, custom command permissions).
3. **Window Configurations:**
   Align window properties (title, dimensions, background `#0B0D10`) with `electron-main.js`.

### 4.4 Unified Platform Bridge (`desktop/src/modules/platform-bridge.js`)
An isomorphic singleton `window.sorafyBridge`:
- Detects environment: `isTauri`, `isElectron`, or `web`.
- In Tauri mode:
  - Translates `invoke('resolve_full_stream', { data })` and unwraps response directly into the standard Electron shape (`{ url, videoId, ... }`).
  - Implements safe fallback defaults for non-critical IPC calls (`getYtHomeFeed`, `loadPlaybackSession`, `checkLocalAudioExists`, `getListeningStats`) using `localStorage` and mock structures so `app.js` never stalls.
  - Implements event subscriber mocks (`onMediaAction`, `onAppBeforeClose`, `onDownloadProgress`).
- In Electron mode:
  - Transparently delegates 100% to native `window.electronAPI`.
- Exposes `window.sorafyBridge` and aliases `window.electronAPI = window.sorafyBridge` if `window.electronAPI` is undefined.

### 4.5 Rust Backend & Local Streaming Proxy (`desktop/src-tauri/`)
1. **Embedded Tokio HTTP Proxy (`desktop/src-tauri/src/infrastructure/audio_proxy.rs`):**
   - Listens on `127.0.0.1:<random_port>`.
   - Relays YouTube audio chunks with headers:
     - `Access-Control-Allow-Origin: *`
     - `Accept-Ranges: bytes`
     - `Content-Range: bytes ...`
   - Completely resolves WebKitGTK CORS issues for `<audio crossorigin="anonymous">`.
2. **Rust Command Handlers (`desktop/src-tauri/src/application/commands.rs`):**
   - Return standard Tauri `Result<T, String>` so Promises in JS resolve or reject natively.
   - Core commands:
     - `resolve_full_stream(data)` -> Calls InnerTube / streaming client, proxies URL via local Tokio proxy.
     - `search_tracks(query)` -> Queries InnerTube + plugins.
     - `fetch_lyrics(title, artist)` -> Queries LRCLIB adapter.
     - `get_app_settings()` / `save_app_settings(settings)` -> JSON in config dir.
     - `get_system_info()` -> Returns OS, runtime mode, and memory stats.

---

## 5. Phased Implementation Strategy

- **Phase 1: Pure JS Platform Bridge & Comprehensive Unit Tests**
  - Implement `desktop/src/modules/platform-bridge.js`.
  - Add `<script src="modules/platform-bridge.js"></script>` to `desktop/src/index.html`.
  - Write `desktop/tests/platform-bridge.test.js` covering Electron, Tauri, and Web fallbacks.
  - Run all 51 existing tests to prove 0% regression in Electron.

- **Phase 2: Tauri v2 Capabilities, Cargo Setup & Embedded Audio Proxy**
  - Configure `tauri.conf.json` (`withGlobalTauri: true`, capabilities).
  - Implement Tokio-based local HTTP proxy in Rust for CORS audio streaming.
  - Wire command handlers in `desktop/src-tauri/src/application/commands.rs` and `main.rs`.

- **Phase 3: Fedora Build, Verification & RAM Benchmark**
  - Provide developer instruction for `sudo dnf install webkit2gtk4.1-devel gtk3-devel ...`.
  - Build and launch Tauri application on Fedora (`npm run tauri:dev`).
  - Measure RAM (PSS / RSS) side-by-side with Electron and present empirical benchmark.
