# SoraFy Desktop Tauri v2 Dual-Target Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable a lightweight Tauri v2 (Rust) desktop build target alongside the existing Electron app, sharing 100% of the frontend via a unified Platform Bridge with embedded CORS audio relay.

**Architecture:** A dual-target architecture where a singleton `PlatformBridge` (`desktop/src/modules/platform-bridge.js`) detects runtime host (`electron`, `tauri`, `web`). In Tauri/Web mode, it aliases `window.electronAPI = window.sorafyBridge` to ensure zero regressions across 11,800+ lines of `app.js`. In the Rust backend (`desktop/src-tauri/`), an embedded Tokio HTTP proxy handles WebKitGTK CORS and chunked streaming, while Tauri v2 command handlers expose search, stream resolution, settings, and lyrics.

**Tech Stack:** Rust (Tokio, Reqwest, Serde, Tauri v2), JavaScript (Web Audio API, Vanilla DOM, Node.js test runner), WebKitGTK / Chromium.

**Spec:** [`docs/superpowers/specs/2026-11-11-tauri-dual-target-design.md`](file:///home/rafliadipratama/sorafy/docs/superpowers/specs/2026-11-11-tauri-dual-target-design.md)

## Global Constraints

- Electron build must continue passing all 51 existing tests (`npm test --prefix desktop`).
- No separate frontend forks (`index-tauri.html` is forbidden); single codebase for both runtimes.
- Do not break existing Web Audio API DSP nodes (Dual-Deck, Loudness Normalizer, 10-Band EQ).
- WebKitGTK cross-origin `<audio crossorigin="anonymous">` must have `Access-Control-Allow-Origin: *` via local proxy.

## Review Focus

1. **Web Audio CORS Blocking in WebKitGTK:** Remote audio fails to play or analyzer disconnects when CORS headers are absent.
2. **Missing window.__TAURI__ Global:** Unbundled vanilla JS scripts cannot access `core.invoke` without `withGlobalTauri: true`.
3. **Unmapped Electron API Calls:** Startup routines calling `getYtHomeFeed`, `loadPlaybackSession`, or `getAppSettings` failing or stalling if bridge returns undefined instead of safe stubs.
4. **Data Shape Incompatibility:** Promises failing because Rust returned `{ success, data, error }` instead of standard resolving payload.
5. **Regression on Existing 51 Unit Tests:** Changes to `index.html` or globals causing test runners to fail.

---

### Task 1: Universal Platform Bridge Core (`desktop/src/modules/platform-bridge.js`)

**Files:**
- Create: `desktop/src/modules/platform-bridge.js`
- Modify: `desktop/src/index.html:8-16`
- Test: `desktop/tests/platform-bridge.test.js`

- [x] **Step 1: Write failing unit test for `platform-bridge.js`**
  Create `desktop/tests/platform-bridge.test.js` testing:
  - Runtime detection (`electron`, `tauri`, `web`).
  - Transparent delegation to `window.electronAPI` when Electron is detected.
  - Safe fallback default returns for unmapped methods (`getYtHomeFeed`, `loadPlaybackSession`, `checkLocalAudioExists`, `getListeningStats`) when in Tauri/Web.
  - Global aliasing `window.electronAPI = window.sorafyBridge`.
- [x] **Step 2: Run test to verify it fails**
  `node --test desktop/tests/platform-bridge.test.js`
- [x] **Step 3: Implement `desktop/src/modules/platform-bridge.js`**
  Implement `PlatformBridge` class with runtime detection, `invoke` mapping, safe defaults, and global aliasing.
- [x] **Step 4: Add script tag to `desktop/src/index.html`**
  Add `<script src="modules/platform-bridge.js"></script>` in `<head>`.
- [x] **Step 5: Verify all tests pass**
  Run `npm test --prefix desktop` and verify all 52+ tests pass.
- [x] **Step 6: Commit changes**
  `git commit -am "feat(desktop): add isomorphic platform-bridge for dual electron and tauri runtime"`

---

### Task 2: Tauri v2 Capabilities and Permissions Configuration

**Files:**
- Create: `desktop/src-tauri/capabilities/default.json`
- Modify: `desktop/src-tauri/tauri.conf.json`
- Test: `desktop/tests/tauri-config.test.js`

- [x] **Step 1: Write failing test verifying Tauri v2 configuration contracts**
  Create `desktop/tests/tauri-config.test.js` checking:
  - `tauri.conf.json` contains `withGlobalTauri: true`.
  - Window title, dimensions (1280x840), minDimensions (960x640), and background `#0B0D10`.
  - `capabilities/default.json` exists with required core permissions.
- [x] **Step 2: Run test to verify it fails**
  `node --test desktop/tests/tauri-config.test.js`
- [x] **Step 3: Create `desktop/src-tauri/capabilities/default.json`**
  Define permissions (`core:default`, window permissions).
- [x] **Step 4: Update `desktop/src-tauri/tauri.conf.json`**
  Add `"withGlobalTauri": true` under `"app"`, register capabilities.
- [x] **Step 5: Run tests to verify pass**
  `node --test desktop/tests/tauri-config.test.js`
- [x] **Step 6: Commit changes**
  `git commit -am "chore(tauri): configure tauri v2 capabilities and global window bridge"`

---

### Task 3: Rust Audio Streaming Proxy (Tokio Local Relay with CORS)

**Files:**
- Create: `desktop/src-tauri/src/infrastructure/audio_proxy.rs`
- Modify: `desktop/src-tauri/src/infrastructure/mod.rs`
- Modify: `desktop/src-tauri/src/lib.rs`
- Test: `desktop/tests/audio-proxy.test.js`

- [x] **Step 1: Write unit test validating audio proxy contract & URL generation**
  Create `desktop/tests/audio-proxy.test.js` verifying:
  - Proxied URL formatting `http://127.0.0.1:<port>/stream?url=...`.
  - Decoding parameters and CORS header expectations.
- [x] **Step 2: Run test to verify it fails**
  `node --test desktop/tests/audio-proxy.test.js`
- [x] **Step 3: Implement `desktop/src-tauri/src/infrastructure/audio_proxy.rs`**
  Build embedded Tokio HTTP server listening on random loopback port, relaying remote audio with CORS and 206 chunking.
- [x] **Step 4: Register audio proxy in `desktop/src-tauri/src/infrastructure/mod.rs` and `lib.rs`**
  Export proxy helpers and wire into `AppState`.
- [x] **Step 5: Verify Rust compiles and test passes**
  `cd desktop/src-tauri && cargo check`
  `node --test desktop/tests/audio-proxy.test.js`
- [x] **Step 6: Commit changes**
  `git commit -am "feat(tauri): add embedded tokio cors audio streaming proxy"`

---

### Task 4: Rust Tauri Command Handlers & Result Normalization

**Files:**
- Modify: `desktop/src-tauri/src/application/commands.rs`
- Modify: `desktop/src-tauri/src/main.rs`
- Test: `desktop/tests/rust-commands.test.js`

- [x] **Step 1: Write test for command signatures and payload shapes**
  Create `desktop/tests/rust-commands.test.js` verifying expected payload shapes for `resolve_full_stream`, `search_tracks`, `fetch_lyrics`, and `get_app_settings`.
- [x] **Step 2: Run test to verify it fails**
  `node --test desktop/tests/rust-commands.test.js`
- [x] **Step 3: Update `desktop/src-tauri/src/application/commands.rs`**
  Expose command functions returning `Result<T, String>` or `CommandResponse<T>`:
  - `resolve_full_stream`
  - `search_tracks`
  - `fetch_lyrics`
  - `get_app_settings` / `save_app_settings`
  - `get_system_info`
- [x] **Step 4: Update `desktop/src-tauri/src/main.rs`**
  Update `main.rs` to wire commands into `tauri::Builder` or `sorafy_lib`.
- [x] **Step 5: Verify `cargo check` and tests pass**
  `cd desktop/src-tauri && cargo check`
  `node --test desktop/tests/rust-commands.test.js`
- [x] **Step 6: Commit changes**
  `git commit -am "feat(tauri): implement normalized rust command handlers for dual runtime"`

---

### Task 5: End-to-End Test Suite, Documentation & Developer Verification

**Files:**
- Create: `desktop/tests/dual-target-integration.test.js`
- Modify: `desktop/README.md`
- Test: `npm test --prefix desktop`

- [x] **Step 1: Create integration test `desktop/tests/dual-target-integration.test.js`**
  Simulate full app bootstrap in both Electron mode and Tauri mode, asserting that `loadInitialCatalog`, `restorePlaybackSession`, and audio nodes initialize cleanly in both.
- [x] **Step 2: Run all desktop tests**
  `npm test --prefix desktop`
- [x] **Step 3: Update `desktop/README.md` and root `README.md`**
  Document dual-target architecture, Fedora build instructions, run commands (`npm start` vs `npm run tauri:dev`), and memory comparison.
- [x] **Step 4: Commit changes**
  `git commit -am "docs(desktop): document dual-target electron and tauri workflow and add e2e integration tests"`
  Ensure 100% of test suites pass (55+ tests passing, 0 failing).
- [ ] **Step 3: Document Fedora build & benchmark instructions in `desktop/README.md`**
  Add instructions for running `npm run tauri:dev`, installing prerequisite `-devel` packages on Fedora, and measuring RAM.
- [ ] **Step 4: Commit changes and verify git status**
  `git commit -am "docs(tauri): add dual-target developer guide and integration tests"`
