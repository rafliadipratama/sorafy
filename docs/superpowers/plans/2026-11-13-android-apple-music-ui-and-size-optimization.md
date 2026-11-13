# Android Apple Music UI/UX Overhaul & APK Size Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the SoraFy Android app to drastically shrink APK size from ~75 MB to ~15 MB, implement Apple Music-inspired Liquid Glass, G2 Squircle continuous corners, critically damped spring sheet transitions, and dynamic ambient mesh backdrops without glowing neon "AI slop", while preserving SoraFy's signature emerald & obsidian palette, zero-ad purity, and security controls.

**Architecture:** 
- Strip heavy C++/Python runtime dependencies (`youtubedl-android`) and rely exclusively on lightweight native InnerTube + NewPipeExtractor stream resolving via OkHttp, adding ABI splits.
- Introduce a custom G2-continuous curvature shape (`ContinuousCornerShape`) for Apple squircle aesthetics.
- Implement an Apple Music Liquid Glass material design system with downscaled blur passes (0.33x) for silky 60/120 FPS performance on Android 12+.
- Drive player sheet transitions using critically damped spring physics (`stiffness = 195f`, `damping = 1.0`) with finger-following drag-to-fullscreen artwork flight.
- Render dynamic 4x4 ambient mesh backdrops with anti-banding dithering derived from album art.

**Tech Stack:** Kotlin, Jetpack Compose (Material 3 + Foundation 1.10.0), AndroidX Media3 (ExoPlayer 1.5.0), AndroidX Palette, Coil 2.7, OkHttp, NewPipeExtractor.

**Spec:** [docs/superpowers/plans/2026-11-13-android-apple-music-ui-and-size-optimization.md](file:///home/rafliadipratama/sorafy/docs/superpowers/plans/2026-11-13-android-apple-music-ui-and-size-optimization.md)

---

## Global Constraints

- **Palette Identity:** Canvas Obsidian (`#0B0D10`), Elevated Glass (`#161A20`), Accent Emerald (`#00E599`). Never use harsh, blinding neon glowing borders or generic AI slop gradients.
- **Performance Budget:** Blur shaders must not exceed 0.33x resolution scaling to prevent GPU fillrate stalls on high-refresh displays.
- **Target SDK & Min SDK:** `minSdk = 24`, `targetSdk = 35`, `compileSdk = 35`.
- **Security & Privacy:** Retain ProGuard/R8 obfuscation, no analytics/telemetry trackers, no unencrypted credentials.

---

## Review Focus

1. **Stream Resolution Safety:** Ensure removing `youtubedl-android` does not break playback fallback when YouTube Music cipher signatures change.
2. **Backwards Compatibility:** On devices below Android 12 (API < 31 where `RenderEffect` is unavailable), ensure liquid glass degrades gracefully to a smooth translucent scrim without crashing.
3. **Curvature Stability:** Verify `ContinuousCornerShape` handles zero, negative, and large radii without crashing outline rendering.
4. **Spring Settling:** Ensure `PlayerSheetMotion` settles completely at 0.5px threshold and stops CPU wakeups when idle.
5. **APK Size Target:** Confirm release APK size is <= 20 MB (down from 74.5 MB).

---

## Tasks

### Task 1: APK Size Optimization & Dependency Trimming

- [ ] **Step 1: Inspect and isolate `youtubedl-android` usages**
  Check `YtDlpPlugin.kt` and `MusicStreamSource.kt` to ensure stream resolution falls back cleanly to native `NewPipeExtractor` and direct `InnerTube` HTTP extraction without invoking python binaries.

- [ ] **Step 2: Update `android/app/build.gradle.kts`**
  Remove `io.github.junkfood02.youtubedl-android:library:0.18.1`.
  Configure ABI splits:
  ```kotlin
  splits {
      abi {
          isEnable = true
          reset()
          include("armeabi-v7a", "arm64-v8a", "x86_64")
          isUniversalApk = true
      }
  }
  ```
  Ensure `isMinifyEnabled = true` and `isShrinkResources = true` in release build type.

- [ ] **Step 3: Update `proguard-rules.pro`**
  Add explicit rules preserving Media3, NewPipeExtractor, OkHttp, and Kotlinx Serialization without bloating the dex.

- [ ] **Step 4: Clean `YtDlpPlugin.kt`**
  Refactor `YtDlpPlugin.kt` to provide a no-op / disabled stub so the codebase compiles cleanly without the external python library.

- [ ] **Step 5: Verify build & test**
  Run `./gradlew testDebugUnitTest` and verify tests pass.

---

### Task 2: Continuous Corner Smoothing (`ContinuousCornerShape`)

- [ ] **Step 1: Write unit test for `ContinuousCornerShape`**
  Create `android/app/src/test/java/com/rafliadipratama/musiceuy/ui/ContinuousCornerShapeTest.kt`.
  Test outline creation, bounds calculation, and smoothing factors (0.0 to 1.0).

- [ ] **Step 2: Implement `ContinuousCornerShape.kt`**
  Create `android/app/src/main/java/com/rafliadipratama/musiceuy/ui/components/ContinuousCornerShape.kt`.
  Implement Apple-standard cubic G2 curvature ramp (continuous curvature smoothing) extending `CornerBasedShape`.

- [ ] **Step 3: Run unit tests**
  Execute `./gradlew testDebugUnitTest --tests "*ContinuousCornerShapeTest*"` and ensure tests pass.

- [ ] **Step 4: Commit Task 2 changes**
  Commit with `feat(android): add G2 continuous curvature squircle shape`.

---

### Task 3: Refined SoraFy Liquid Glass Design System (Anti-AI-Slop)

- [ ] **Step 1: Update Color & Theme Tokens**
  Edit `android/app/src/main/java/com/rafliadipratama/musiceuy/ui/theme/Color.kt` and `Theme.kt`:
  - Primary Background: `#0B0D10` (Deep Obsidian)
  - Surface Glass: `#141820` with 40% alpha (`0.40f`)
  - Accent: `#00E599` (SoraFy Emerald)
  - Text Primary: `#FFFFFF`, Secondary: `#94A3B8`, Tertiary: `#64748B`
  - Remove all bright saturated neon glowing borders.

- [ ] **Step 2: Create `LiquidGlassModifier.kt`**
  Create `android/app/src/main/java/com/rafliadipratama/musiceuy/ui/components/LiquidGlassModifier.kt`:
  - On API 31+ (Android 12+), apply `RenderEffect.createBlurEffect` with `8.dp` radius and `0.33x` downsampled resolution scaling.
  - On API < 31, apply a clean `#141820` translucent scrim with `ContinuousCornerShape`.
  - Add inner hairline border `0.5.dp` with `#FFFFFF` at `0.18f` opacity (Apple's signature glass rim).

- [ ] **Step 3: Apply Liquid Glass to `BottomNavBar.kt` and `MiniPlayer.kt`**
  Update `BottomNavBar.kt` and `MiniPlayer.kt` to use `Modifier.liquidGlass()` and `ContinuousCornerShape`.

- [ ] **Step 4: Verify UI compile & tests**
  Run `./gradlew testDebugUnitTest`.

- [ ] **Step 5: Commit Task 3 changes**
  Commit with `feat(android): implement refined Liquid Glass and squircle surfaces in navigation and mini player`.

---

### Task 4: Critically Damped Spring Physics & Sheet Motion

- [ ] **Step 1: Implement `PlayerSheetMotion.kt`**
  Create `android/app/src/main/java/com/rafliadipratama/musiceuy/ui/player/PlayerSheetMotion.kt`:
  - Physics constants: `SLIDE_STIFFNESS = 195f`, `DampingRatioNoBouncy = 1.0f`.
  - Track drag offsets and link finger position to artwork scaling and vertical translation.
  - Settle threshold: `0.5px`.

- [ ] **Step 2: Connect `MiniPlayer.kt` drag gesture to `PlayerSheetMotion`**
  Update `MiniPlayer.kt` so dragging up smoothly transitions artwork and sheet into `PortraitPlayerLayout.kt`.

- [ ] **Step 3: Update `PortraitPlayerLayout.kt` & `PortraitPlayerStage.kt`**
  Integrate `ContinuousCornerShape` on album art with subtle shadow and spring entrance.

- [ ] **Step 4: Test & Verify**
  Run `./gradlew testDebugUnitTest`.

- [ ] **Step 5: Commit Task 4 changes**
  Commit with `feat(android): add critically damped spring transitions for player sheet`.

---

### Task 5: Dynamic Ambient Mesh Backdrop Shader

- [ ] **Step 1: Implement `AmbientMeshBackdrop.kt`**
  Create `android/app/src/main/java/com/rafliadipratama/musiceuy/ui/player/AmbientMeshBackdrop.kt`:
  - Extract dominant, vibrant, and muted swatches from album art with `androidx.palette`.
  - Render 16 drifting harmonic color nodes on a low-resolution canvas (64x40) scaled up with bilinear filtering.
  - Add per-frame triangular dither noise hash to eliminate dark banding on OLED displays.

- [ ] **Step 2: Wire `AmbientMeshBackdrop` in `PlayerScreen.kt`**
  Place `AmbientMeshBackdrop` behind player controls in `PlayerScreen.kt` with smooth crossfade between tracks.

- [ ] **Step 3: Verify & Commit Task 5**
  Commit with `feat(android): add dynamic ambient mesh backdrop with OLED anti-banding dithering`.

---

### Task 6: Apple-Style Synced Lyrics Refinement

- [ ] **Step 1: Refactor `PlayerLyrics.kt`**
  - Active line: Bold white `#FFFFFF`, scale 1.05x, smooth auto-scroll to center.
  - Inactive lines: Soft muted `#94A3B8` at 0.35f alpha.
  - Interactive tap: Tap any line to seek instantly via `onSeekTo`.
  - Eliminate all neon glows.

- [ ] **Step 2: Verify & Commit Task 6**
  Commit with `feat(android): refine synced lyrics styling to Apple Music clean typography`.

---

### Task 7: Full Build, Size Verification & Release Package

- [ ] **Step 1: Run complete Android test suite**
  Run `./gradlew testDebugUnitTest`.

- [ ] **Step 2: Build release APKs**
  Run `./gradlew assembleRelease` (or assembleDebug).

- [ ] **Step 3: Measure APK sizes**
  Check `app/build/outputs/apk/` and verify that the target APK size is <= 20 MB (shrinking from ~75 MB).

- [ ] **Step 4: Final commit and summary**
  Push all changes to GitHub `main`.
