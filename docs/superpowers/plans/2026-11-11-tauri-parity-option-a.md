# SoraFy Desktop Tauri v2 Parity (Option A) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Option A (Direct Native YouTubei & yt-dlp Sidecar in Rust) to achieve 100% feature and stability parity between Tauri v2 and Electron while maintaining ~75-85% RAM savings.

**Architecture:** The Rust backend (`desktop/src-tauri/`) connects directly to official YouTube Music InnerTube v1 API endpoints (`search`, `browse`, `next`, `player`) using `reqwest` and executes local `yt-dlp` child process stream extraction. Extracted audio streams are piped through the embedded Tokio CORS loopback relay (`127.0.0.1:<port>`). `PlatformBridge` (`desktop/src/modules/platform-bridge.js`) routes all frontend calls (`getYtHomeFeed`, `fetchYouTubeRadioQueue`, `browseYouTube`, `searchYouTubeMusic`, `resolveFullStream`) to corresponding Tauri commands with normalized payload unwrapping.

**Tech Stack:** Rust (Tauri v2, Tokio, Reqwest, Serde, std::process), JavaScript (Vanilla DOM, Web Audio API, Node.js test runner), WebKitGTK 4.1.

**Spec:** [`docs/superpowers/specs/2026-11-11-tauri-parity-option-a.md`](file:///home/rafliadipratama/sorafy/docs/superpowers/specs/2026-11-11-tauri-parity-option-a.md)

## Global Constraints

- Do not modify or break `desktop/electron-main.js` or existing Electron runtime behavior.
- All existing 84 desktop unit tests must continue to pass (`npm test --prefix desktop`).
- All new and existing Rust unit tests must pass (`cargo test --manifest-path desktop/src-tauri/Cargo.toml`).
- Use loopback Tokio audio proxy (`http://127.0.0.1:<port>/stream?url=...`) for all remote Googlevideo audio to comply with WebKitGTK CORS rules.
- Maintain strict title and artist verification rules to prevent unintended cover/remix stream mismatches.

## Review Focus

1. **YouTubei Parsing Resilience:** Changes to YouTube's JSON response structures should not crash the Rust backend; unparseable items must be gracefully skipped.
2. **`yt-dlp` Process Timeout:** Child process execution of `yt-dlp` must strictly enforce a 9-second timeout to prevent zombie processes or hung requests.
3. **Radio Queue Continuity:** `fetch_yt_radio_queue` must reliably return next tracks and continuation tokens from `RDAMVM<vid>` so autoplay never stops.
4. **Home Feed Structure:** `get_yt_home_feed` must return quick picks, charts, and new release categories matching Electron's format.
5. **Serde Serialization Interop:** DTOs must deserialize camelCase from JS and serialize clean responses for `PlatformBridge`.

---

### Task 1: Direct YouTubei Client in Rust (`desktop/src-tauri/src/infrastructure/youtubei_client.rs`)

**Files:**
- Create: `desktop/src-tauri/src/infrastructure/youtubei_client.rs`
- Modify: `desktop/src-tauri/src/infrastructure/mod.rs`
- Test: `desktop/tests/youtubei-client.test.js`

- [x] **Step 1: Write failing unit test for YouTubei client contracts**
  Create `desktop/tests/youtubei-client.test.js` verifying expected request payloads and response normalization for:
  - `/youtubei/v1/search` with filter types (`song`, `video`, `artist`, `album`, `playlist`).
  - `/youtubei/v1/browse` (`FEmusic_home` Quick Picks and trending).
  - `/youtubei/v1/next` (`RDAMVM` radio queue).
- [x] **Step 2: Run test to verify it fails**
  `node --test desktop/tests/youtubei-client.test.js`
- [x] **Step 3: Implement `YouTubeiClient` in `desktop/src-tauri/src/infrastructure/youtubei_client.rs`**
  - Construct HTTPS POST requests with `WEB_REMIX` client context.
  - Implement `search(&self, query: &str, filter_type: Option<&str>) -> Result<Vec<Track>, DomainError>`.
  - Implement `get_home_feed(&self, lang: &str) -> Result<HomeFeedData, DomainError>`.
  - Implement `get_radio_queue(&self, video_id: &str, continuation: Option<&str>) -> Result<RadioQueueData, DomainError>`.
  - Implement `browse(&self, browse_id: &str) -> Result<BrowseData, DomainError>`.
  - Maintain strict title and artist verification rules.
  - Add Rust unit tests in `youtubei_client.rs`.
- [x] **Step 4: Register in `desktop/src-tauri/src/infrastructure/mod.rs`**
  Export `pub mod youtubei_client; pub use youtubei_client::YouTubeiClient;`.
- [x] **Step 5: Verify Rust compiles and test passes**
  `cargo check --manifest-path desktop/src-tauri/Cargo.toml`
  `node --test desktop/tests/youtubei-client.test.js`
- [x] **Step 6: Commit changes**
  `git commit -am "feat(tauri): implement native direct youtubei client in rust"`

---

### Task 2: Native `yt-dlp` Extractor & iOS Player Stream Resolver (`desktop/src-tauri/src/infrastructure/ytdlp_extractor.rs`)

**Files:**
- Create: `desktop/src-tauri/src/infrastructure/ytdlp_extractor.rs`
- Modify: `desktop/src-tauri/src/infrastructure/mod.rs`
- Test: `desktop/tests/ytdlp-extractor.test.js`

- [x] **Step 1: Write failing unit test for `yt-dlp` extractor contract**
  Create `desktop/tests/ytdlp-extractor.test.js` verifying:
  - Command argument formation: `[--print, %(duration)s, -g, -f, ba/b, https://www.youtube.com/watch?v=...]`.
  - Timeout enforcement and stdout parsing (extracting duration and direct URL).
  - Proxied stream URL formatting through Tokio CORS proxy.
- [x] **Step 2: Run test to verify it fails**
  `node --test desktop/tests/ytdlp-extractor.test.js`
- [x] **Step 3: Implement `YtDlpExtractor` in `desktop/src-tauri/src/infrastructure/ytdlp_extractor.rs`**
  - Binary discovery: check `desktop/bin/linux/yt-dlp` then system PATH.
  - Execute child process with 9-second Tokio timeout.
  - Fallback to direct iOS InnerTube `/youtubei/v1/player` endpoint if `yt-dlp` is missing or fails.
  - Add Rust unit tests in `ytdlp_extractor.rs`.
- [x] **Step 4: Register in `desktop/src-tauri/src/infrastructure/mod.rs` and `lib.rs`**
  Export `pub mod ytdlp_extractor; pub use ytdlp_extractor::YtDlpExtractor;`.
- [x] **Step 5: Verify Rust compiles and test passes**
  `cargo check --manifest-path desktop/src-tauri/Cargo.toml`
  `node --test desktop/tests/ytdlp-extractor.test.js`
- [x] **Step 6: Commit changes**
  `git commit -am "feat(tauri): implement ytdlp and ios player stream extractor in rust"`

---

### Task 3: Tauri Command Handlers for Home Feed, Radio Queue & Browse (`desktop/src-tauri/src/application/commands.rs`, `main.rs`)

**Files:**
- Modify: `desktop/src-tauri/src/application/commands.rs`
- Modify: `desktop/src-tauri/src/main.rs`
- Test: `desktop/tests/tauri-parity-commands.test.js`

- [x] **Step 1: Write failing unit test for parity command contracts**
  Create `desktop/tests/tauri-parity-commands.test.js` checking:
  - `get_yt_home_feed`: returns `{ success: true, quickPicks: [...], sections: [...] }`.
  - `fetch_yt_radio_queue`: returns `{ tracks: [...], continuation: string|null }`.
  - `browse_yt`: returns browse payload.
  - `get_search_suggestions`: returns query suggestion list.
  - `resolve_full_stream`: returns proxied URL with audio format metadata.
- [x] **Step 2: Run test to verify it fails**
  `node --test desktop/tests/tauri-parity-commands.test.js`
- [x] **Step 3: Implement handlers in `desktop/src-tauri/src/application/commands.rs`**
  - Wire `YouTubeiClient` and `YtDlpExtractor` into `AppState`.
  - Implement `get_yt_home_feed(state, lang)`.
  - Implement `fetch_yt_radio_queue(state, video_id, continuation_token)`.
  - Implement `browse_yt(state, browse_id)`.
  - Implement `get_search_suggestions(state, query)`.
  - Update `resolve_full_stream` to use `YtDlpExtractor` + proxy.
  - Update `search_tracks` to use `YouTubeiClient`.
- [x] **Step 4: Register in `desktop/src-tauri/src/main.rs`**
  Add all new commands to `tauri::generate_handler![...]`.
- [x] **Step 5: Verify Rust compiles and tests pass**
  `cargo test --manifest-path desktop/src-tauri/Cargo.toml`
  `node --test desktop/tests/tauri-parity-commands.test.js`
- [x] **Step 6: Commit changes**
  `git commit -am "feat(tauri): expose home feed, radio queue, and browse commands in tauri backend"`

---

### Task 4: Platform Bridge Integration & UI Wiring (`desktop/src/modules/platform-bridge.js`)

**Files:**
- Modify: `desktop/src/modules/platform-bridge.js`
- Test: `desktop/tests/platform-bridge.test.js`

- [x] **Step 1: Write unit test verifying bridge delegation for new commands**
  Update `desktop/tests/platform-bridge.test.js` asserting that in Tauri mode:
  - `getYtHomeFeed()` invokes `get_yt_home_feed` and unwraps.
  - `fetchYouTubeRadioQueue()` invokes `fetch_yt_radio_queue` and unwraps.
  - `browseYouTube()` invokes `browse_yt` and unwraps.
  - `getSearchSuggestions()` invokes `get_search_suggestions` and unwraps.
- [x] **Step 2: Run test to verify it fails**
  `node --test desktop/tests/platform-bridge.test.js`
- [x] **Step 3: Update `desktop/src/modules/platform-bridge.js`**
  Implement delegation for `getYtHomeFeed`, `fetchYouTubeRadioQueue`, `browseYouTube`, and `getSearchSuggestions` to Tauri `_invoke` with unwrapping and safe fallbacks.
- [x] **Step 4: Verify all desktop tests pass**
  `npm test --prefix desktop`
- [x] **Step 5: Commit changes**
  `git commit -am "feat(desktop): wire home feed, radio queue and suggestions in platform bridge"`

---

### Task 5: Full Regression Testing & Verification

**Files:**
- Test: `npm test --prefix desktop`
- Test: `cargo test --manifest-path desktop/src-tauri/Cargo.toml`
- Modify: `desktop/README.md`

- [x] **Step 1: Run comprehensive desktop test suite**
  Verify all 110 JavaScript tests and all 25 Rust unit tests pass cleanly.
- [x] **Step 2: Update documentation in `desktop/README.md`**
  Document the completed native YouTubei & `yt-dlp` integration and parity status.
- [x] **Step 3: Commit and push changes**
  `git commit -am "docs(desktop): complete option a full parity implementation and verification"`
  `git push origin main`
