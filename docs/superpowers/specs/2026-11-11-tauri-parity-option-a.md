# Technical Design Spec: SoraFy Desktop Tauri v2 Full Feature Parity (Option A)

**Date:** 2026-11-11  
**Status:** PROPOSED  
**Author:** Antigravity & Rafli Adi Pratama  
**Target:** Linux (Fedora 44 / Wayland / X11), Windows 10/11, macOS  

---

## 1. Context & Motivation

In the dual-target runtime implementation, SoraFy frontend code was unified via `PlatformBridge` (`desktop/src/modules/platform-bridge.js`). While the foundational architecture, window setup, and CORS audio proxy were verified, initial user testing in Fedora revealed stability gaps compared to Electron:
1. **Empty Home Feed:** `getYtHomeFeed()` returned `{ success: true, quickPicks: [] }`.
2. **Missing Radio Queue / Autoplay:** When a track ends, `fetchYouTubeRadioQueue()` returned `{ tracks: [] }`, preventing continuous playlist auto-mixing.
3. **Defunct Piped Instances in Rust:** `InnertubeCatalogClient` relied on public Piped API URLs (`kavin.rocks`, etc.) which are rate-limited or offline, causing search to fall back to hardcoded sample tracks.
4. **No Direct yt-dlp / InnerTube iOS Stream Extraction in Rust:** Electron extracts 100% authentic Googlevideo audio streams using a local `yt-dlp` sidecar or direct iOS InnerTube client headers.

**Goal:** Implement **Option A (Direct Native YouTubei & yt-dlp Sidecar in Rust)** to achieve 100% feature and stability parity with Electron while keeping memory usage under ~140 MB RSS.

---

## 2. Architecture & Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SoraFy Shared Frontend (app.js)                       │
│             100% identical UI, Web Audio API DSP, State Machine             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ calls window.electronAPI
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 Platform Bridge (platform-bridge.js)                        │
│              Detects runtime: Tauri v2 (window.__TAURI__)                   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ invokes Tauri commands
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Tauri v2 Rust Backend                               │
│                                                                             │
│  ┌──────────────────────────┐            ┌───────────────────────────────┐  │
│  │   Tauri Command Router   │            │   Tokio CORS Streaming Proxy  │  │
│  │  (application/commands)  │            │  (127.0.0.1:<random_port>)    │  │
│  └─────────────┬────────────┘            └───────────────▲───────────────┘  │
│                │                                         │ proxies URL      │
│  ┌─────────────┴─────────────────────────────────────────┴───────────────┐  │
│  │                     Infrastructure Services                           │  │
│  │                                                                       │  │
│  │  1. YouTubei Direct Client (infrastructure/youtubei_client.rs)        │  │
│  │     - /youtubei/v1/search (Songs, Artists, Albums, Playlists)         │  │
│  │     - /youtubei/v1/browse (FEmusic_home Quick Picks & Charts)         │  │
│  │     - /youtubei/v1/next (RDAMVM<vid> Radio Automix Queue)             │  │
│  │     - /youtubei/v1/player (Direct iOS stream extraction)              │  │
│  │                                                                       │  │
│  │  2. yt-dlp Native Sidecar (infrastructure/ytdlp_extractor.rs)         │  │
│  │     - Locates yt-dlp on host (bundled in bin/ or system PATH)         │  │
│  │     - Runs `yt-dlp -g -f ba/b https://www.youtube.com/watch?v=...`    │  │
│  │                                                                       │  │
│  │  3. LRCLIB Synchronized Lyrics Client (lrclib_client.rs)              │  │
│  │  4. Local Settings & Playlists (local_storage.rs)                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Component Specifications

### 3.1 YouTubei Direct Client (`desktop/src-tauri/src/infrastructure/youtubei_client.rs`)
Direct HTTPS JSON requests using `reqwest` targeting `https://music.youtube.com/youtubei/v1/`:
1. **Search (`/youtubei/v1/search`):**
   - Client context: `WEB_REMIX` (`clientVersion: 1.20240318.01.00`, `hl: id/en`, `gl: ID/US`).
   - Query filters: Song (`EgWKAQIIAWoKEAkQBRAKEAMQBw%3D%3D`), Video, Artist, Album, Playlist.
   - Parses `musicCardShelfRenderer` and `musicResponsiveListItemRenderer` into standardized `Track` objects.
2. **Home Feed (`/youtubei/v1/browse`):**
   - Browse ID: `FEmusic_home`.
   - Extracts Quick Picks shelves, trending rows, and recommended albums into structured `{ quick_picks: Vec<Track>, sections: Vec<HomeSection> }`.
3. **Radio Automix Queue (`/youtubei/v1/next`):**
   - Payload: `{ playlistId: "RDAMVM" + videoId, isAudioOnly: true }`.
   - Extracts next 25 continuous recommendations and continuation tokens into `{ tracks: Vec<Track>, continuation: Option<String> }`.
4. **Browse Details (`/youtubei/v1/browse`):**
   - Supports browsing artist channels and album playlists.

### 3.2 Dual-Engine Audio Stream Resolution (`desktop/src-tauri/src/infrastructure/ytdlp_extractor.rs`)
Replicates Electron's cascade:
1. **Step 1: yt-dlp Sidecar Resolution:**
   - Detects `yt-dlp` executable in:
     - `desktop/bin/linux/yt-dlp`
     - System `PATH` (`/usr/bin/yt-dlp` or `/usr/local/bin/yt-dlp`)
   - Executes with 9-second timeout:
     `yt-dlp --print %(duration)s -g -f ba/b https://www.youtube.com/watch?v=<videoId>`
   - Captures stdout direct Googlevideo playback URL.
2. **Step 2: Direct iOS InnerTube Player Fallback:**
   - If `yt-dlp` is unavailable or times out, sends POST to `/youtubei/v1/player` with iOS client headers:
     `clientName: "IOS", clientVersion: "21.03.3", deviceModel: "iPad7,6"`.
   - Extracts highest bitrate audio format from `streamingData.adaptiveFormats` (`audio/webm; codecs="opus"` or `audio/mp4`).
3. **Step 3: Loopback Audio Proxy Relay:**
   - Proxies the resolved URL via `http://127.0.0.1:<port>/stream?url=<encoded>` with CORS headers to guarantee seamless WebKitGTK playback.

### 3.3 Bridge Method Wiring (`desktop/src/modules/platform-bridge.js`)
Update `PlatformBridge` to invoke the newly wired Tauri commands:
- `getYtHomeFeed(lang)` -> `invoke('get_yt_home_feed', { lang })`
- `fetchYouTubeRadioQueue(videoId, continuationToken)` -> `invoke('fetch_yt_radio_queue', { videoId, continuationToken })`
- `browseYouTube(browseId)` -> `invoke('browse_yt', { browseId })`
- `getSearchSuggestions(query)` -> `invoke('get_search_suggestions', { query })`

---

## 4. Stability & Non-Regression Guarantees
- **Electron Unaffected:** Existing Electron runtime continues to run independently; zero changes to `electron-main.js`.
- **Unit Test Coverage:** All 84 existing tests in `desktop/tests` must continue to pass 100%.
- **Graceful Fallbacks:** If network drops or an endpoint fails, Rust returns clean errors without panicking the Tokio runtime or crashing WebKitGTK.

---

## 5. Implementation Phases
1. **Phase 1: YouTubei Direct Client in Rust** (`search`, `browse`, `next`, `player`).
2. **Phase 2: yt-dlp Extractor Service in Rust** with binary locator and timeout runner.
3. **Phase 3: Wire Tauri Commands & Platform Bridge** (`get_yt_home_feed`, `fetch_yt_radio_queue`, `browse_yt`, `get_search_suggestions`).
4. **Phase 4: Contract Tests & Verification** (End-to-end testing with mock/live checks, `cargo test`, `npm test`).
