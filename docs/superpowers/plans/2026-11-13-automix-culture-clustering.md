# Automix Radio & Culture Clustering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port Desktop SoraFy's Musify Culture Clustering (`detectMusifyCulture`), Anti-Bootleg/Karaoke Filter (`isCompatibleMusifyTrack`), Recently Skipped Artists Cooldown, and Automix Infinite Radio Queue into mobile (`android/` and `iosApp/`) so mobile users experience the exact same seamless music discovery as on desktop, while clarifying the Android 13+ SystemUI notification seekbar boundary.

**Architecture:** 
1. Create `MusifyAutomixEngine.kt` to classify tracks into 6 culture clusters (`western_alt_indie`, `western_rock_metal`, `western_pop_rnb`, `indo_indie_folk`, `indo_dangdut_koplo`, `kpop_asian`) and filter out bootlegs, karaoke, sped-up/slowed tracks, and jarring genre shifts.
2. Create `SkippedArtistCooldown.kt` to temporarily blacklist skipped artists for 30 minutes in automix recommendations.
3. Wire `MusifyAutomixEngine` and `SkippedArtistCooldown` into `MusicPlayerViewModel.kt` to trigger seamless infinite radio queuing when tracks are played or queue is nearing its end.
4. Port equivalent Swift implementation `MusifyAutomixEngine.swift` into `iosApp/` for iOS parity.
5. Provide clear technical analysis regarding Android 13+ SystemUI `SquigglyProgress` notification seekbar.

**Tech Stack:** Kotlin, Jetpack Compose, AndroidX Media3 / ExoPlayer, Swift, SwiftUI, Coroutines, JUnit4.

**Spec:** Ported from Desktop implementations in `desktop/src/app.js`, `desktop/tests/automix-musify-queue.test.js`, and `desktop/src/modules/audio-deck-state.js`.

---

## Global Constraints
- Android minSdk 26, targetSdk 35.
- Kotlin Coroutines with Dispatchers.IO for background network & filtering.
- Zero extra APK size overhead (pure mathematical & pattern-matching logic, 0 external binaries).
- 100% natural language communication (no slash commands in user chat).

## Review Focus
1. Bootleg titles like "Karma Police (Karaoke Version)" or "Apocalypse (slowed + reverb)" must be strictly rejected from automix.
2. Cross-culture contamination (e.g. Dangdut Koplo appearing in a Western Alt/Indie Radio session) must be rejected.
3. Skipped artists must be suppressed from subsequent automix batches during their 30-minute cooldown.
4. Same-artist tracks and verified genre peers must be accepted.
5. Network failures in automix fetching must fail gracefully without interrupting current playback.

---

### Task 1: Musify Culture Clustering & Anti-Bootleg Filter (`MusifyAutomixEngine.kt`)

**Files:**
- Create: `android/app/src/main/java/com/rafliadipratama/musiceuy/data/network/MusifyAutomixEngine.kt`
- Test: `android/app/src/test/java/com/rafliadipratama/musiceuy/MusifyAutomixEngineTest.kt`

**Interfaces:**
- Produces:
  ```kotlin
  enum class CultureCluster {
      WESTERN_ALT_INDIE,
      WESTERN_ROCK_METAL,
      WESTERN_POP_RNB,
      INDO_INDIE_FOLK,
      INDO_DANGDUT_KOPLO,
      KPOP_ASIAN,
      UNKNOWN
  }

  object MusifyAutomixEngine {
      fun detectCulture(artist: String, title: String): CultureCluster
      fun isCompatibleTrack(candidate: Track, seedTrack: Track, seedCluster: CultureCluster): Boolean
      fun isBootlegOrKaraoke(title: String, artist: String): Boolean
  }
  ```

- [x] **Step 1: Write failing unit tests for MusifyAutomixEngine**
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement `MusifyAutomixEngine.kt`**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit**
`git add android/app/src/main/java/com/rafliadipratama/musiceuy/data/network/MusifyAutomixEngine.kt android/app/src/test/java/com/rafliadipratama/musiceuy/MusifyAutomixEngineTest.kt`
`git commit -m "feat(automix): add Musify culture clustering and anti-bootleg engine"`

---

### Task 2: Recently Skipped Artists Cooldown (`SkippedArtistCooldown.kt`)

**Files:**
- Create: `android/app/src/main/java/com/rafliadipratama/musiceuy/data/local/SkippedArtistCooldown.kt`
- Test: `android/app/src/test/java/com/rafliadipratama/musiceuy/SkippedArtistCooldownTest.kt`

**Interfaces:**
- Produces:
  ```kotlin
  class SkippedArtistCooldown(private val cooldownDurationMs: Long = 30 * 60 * 1000L) {
      fun recordSkip(artistName: String, timestampMs: Long = System.currentTimeMillis())
      fun isCooldownActive(artistName: String, currentTimeMs: Long = System.currentTimeMillis()): Boolean
      fun clear()
  }
  ```

- [x] **Step 1: Write failing unit test for SkippedArtistCooldown**
- [x] **Step 2: Run test to verify it fails**
- [x] **Step 3: Implement `SkippedArtistCooldown.kt`**
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit**

---

### Task 3: Automix Radio Queue in `MusicPlayerViewModel.kt`

**Files:**
- Modify: `android/app/src/main/java/com/rafliadipratama/musiceuy/ui/viewmodel/MusicPlayerViewModel.kt`

- [x] **Step 1: Add automix state and trigger logic to `MusicPlayerViewModel.kt`**
- [x] **Step 2: Verify unit tests and build**
- [x] **Step 3: Commit**

---

### Task 4: Clarify and Verify Notification Seek Bar Behavior

- [x] **Step 1: Technical validation of SystemUI SquigglyProgress**
- [x] **Step 2: Verify in-app seek bars are static**
- [x] **Step 3: Build APK and test on emulator**

---

### Task 5: Port Automix & Culture Engine to iOS (`iosApp/`)

**Files:**
- Create: `iosApp/SoraFy/Services/MusifyAutomixEngine.swift`
- Modify: `iosApp/SoraFy/ViewModels/MusicPlayerViewModel.swift`

- [x] **Step 1: Implement `MusifyAutomixEngine.swift` in SwiftUI codebase**
- [x] **Step 2: Integrate into `MusicPlayerViewModel.swift`**
- [x] **Step 3: Commit and push**
`git add iosApp/`
`git commit -m "feat(ios): add Musify culture clustering and automix engine to iOS"`
