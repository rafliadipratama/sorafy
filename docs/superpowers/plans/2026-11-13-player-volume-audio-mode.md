# Player Volume Slider & Audio-Only Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Apple Music-style volume slider in the mobile player screen and hide the "Lagu | Video" toggle button for pure MP3/audio tracks so that the cover artwork is displayed cleanly.

**Architecture:**
1. Generate Iconsax Vector Drawables `ic_iconsax_volume_low_linear.xml` and `ic_iconsax_volume_high_linear.xml` from `desktop/src/iconsax-bundle.js`.
2. Build `AppleMusicVolumeSlider.kt` using Jetpack Compose, binding to Android `AudioManager.STREAM_MUSIC` with a flat Apple-style rounded track and real-time volume synchronization.
3. Update `PortraitPlayerLayout.kt` and `LandscapePlayerLayout.kt`:
   - Only display `AudioVideoToggleSwitch` when `track.isVideo == true`.
   - Insert `AppleMusicVolumeSlider` beneath `PrimaryControlsRow`.
4. Mirror these changes in `iosApp/` for SwiftUI Apple Music parity.

**Tech Stack:** Kotlin, Jetpack Compose, Android AudioManager, SwiftUI, JUnit4.

**Spec:** `docs/superpowers/specs/2026-11-13-player-volume-audio-mode-design.md`

## Global Constraints
- Android minSdk 26, targetSdk 35.
- 0% CPU idle impact: no frame loop animations for volume track.
- Clean 100% natural language communication with the user.
- TDD unit testing for newly created components and state mappings.

## Review Focus
1. Pure audio/MP3 tracks (`track.isVideo == false`) must NOT display the `Lagu | Video` toggle switch.
2. Video tracks (`track.isVideo == true`) must still display the `Lagu | Video` switch and allow toggling between audio and video modes.
3. The volume slider must reflect the device's actual media volume and update when dragged without freezing the UI thread.
4. Mute and maximum volume taps on the speaker icons must adjust volume cleanly.
5. All layouts in portrait and landscape must maintain balanced spacing without clipping on smaller screens.

---

### Task 1: Iconsax Volume Drawables & `AppleMusicVolumeSlider.kt`

**Files:**
- Create: `android/app/src/main/res/drawable/ic_iconsax_volume_low_linear.xml`
- Create: `android/app/src/main/res/drawable/ic_iconsax_volume_high_linear.xml`
- Create: `android/app/src/main/java/com/rafliadipratama/musiceuy/ui/components/AppleMusicVolumeSlider.kt`
- Test: `android/app/src/test/java/com/rafliadipratama/musiceuy/AppleMusicVolumeSliderTest.kt`

**Interfaces:**
- Produces:
  ```kotlin
  @Composable
  fun AppleMusicVolumeSlider(
      modifier: Modifier = Modifier,
      audioManager: AudioManager? = null
  )
  ```

- [x] **Step 1: Create `ic_iconsax_volume_low_linear.xml` and `ic_iconsax_volume_high_linear.xml`**
- [x] **Step 2: Write unit test `AppleMusicVolumeSliderTest.kt` for volume ratio calculations**
- [x] **Step 3: Implement `AppleMusicVolumeSlider.kt`**
  - Features: volume-low icon (left), volume-high icon (right), draggable linear track with subtle rounded capsule background (`Color.White.copy(alpha = 0.12f)`) and active fill (`Color.White.copy(alpha = 0.85f)`).
  - Listens to volume changes via `BroadcastReceiver` / `ContentObserver`.
- [x] **Step 4: Run test to verify it passes**
- [x] **Step 5: Commit**

---

### Task 2: Hide Audio/Video Switch for Audio Tracks & Integrate Volume Slider in Player Layouts

**Files:**
- Modify: `android/app/src/main/java/com/rafliadipratama/musiceuy/ui/player/PortraitPlayerLayout.kt`
- Modify: `android/app/src/main/java/com/rafliadipratama/musiceuy/ui/player/LandscapePlayerLayout.kt`

- [ ] **Step 1: Update `PortraitPlayerLayout.kt`**
  - Wrap `AudioVideoToggleSwitch` in `if (track.isVideo) { ... }`.
  - Place `AppleMusicVolumeSlider` between `PrimaryControlsRow` and `BottomUtilityRow`.
- [ ] **Step 2: Update `LandscapePlayerLayout.kt`**
  - Wrap `AudioVideoToggleSwitch` in `if (track.isVideo) { ... }`.
  - Add volume slider in the player controls column.
- [ ] **Step 3: Run `./gradlew testDebugUnitTest` to verify no regressions**
- [ ] **Step 4: Commit**

---

### Task 3: Port to iOS (`iosApp/`)

**Files:**
- Modify: `iosApp/SoraFy/Views/Player/PlayerView.swift`

- [ ] **Step 1: Check `track.isVideo` before rendering video toggle button**
- [ ] **Step 2: Add Apple Music volume slider row using MPVolumeView or custom SwiftUI slider**
- [ ] **Step 3: Commit**

---

### Task 4: Verification & Emulator Testing

- [ ] **Step 1: Assemble debug APK** (`./gradlew assembleDebug`)
- [ ] **Step 2: Install and run on emulator**
- [ ] **Step 3: Capture screenshot of Player Screen and verify volume slider and clean cover**
