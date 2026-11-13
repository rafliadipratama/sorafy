# English Default UI, 3-Tab Bottom Bar & Settings Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change mobile default language to English, reduce bottom navigation to 3 tabs (Home, Library, Settings), move Plugins into Settings, and add top-bar Search to Home screen.

**Architecture:**
1. Update `LanguageHelper.kt` to default to `"en"`.
2. Update `strings.xml` to include `nav_settings` ("Settings").
3. Update `BottomNavBar.kt` so `NavigationTab` contains only `HOME`, `LIBRARY`, and `SETTINGS`.
4. Create `SettingsScreen.kt` incorporating audio settings, language selector, clear cache, and an embedded/collapsible "Plugins & Extensions" manager.
5. In `HomeScreen.kt`, add a top-bar search action button and translate all hardcoded Indonesian headings/categories to English.
6. In `MainActivity.kt`, wire `SETTINGS` tab to `SettingsScreen` and handle `SearchScreen` overlay when search icon is clicked on Home.
7. In `PortraitPlayerLayout.kt`, change "SEDANG MEMUTAR" to "NOW PLAYING".
8. In `iosApp/`, update `MainTabView.swift` to 3 tabs (Home, Library, Settings) and ensure English labels.

**Tech Stack:** Kotlin, Jetpack Compose, SwiftUI, JUnit4.

**Spec:** `docs/superpowers/specs/2026-11-13-english-navigation-settings-design.md`

## Global Constraints
- 3 bottom navigation items only on mobile.
- Zero feature regression: plugins and search must remain completely functional.
- Clean English default strings throughout the user interface.

## Review Focus
1. Bottom bar displays exactly 3 items: Home, Library, Settings.
2. Clicking Settings displays the settings screen with the Plugins management section.
3. Clicking the Search icon in Home opens the Search screen properly.
4. Home screen and Player screen labels default to English.
5. iOS `MainTabView.swift` reflects the same 3 tabs.

---

### Task 1: English Default Locale & String Resources

**Files:**
- Modify: `android/app/src/main/res/values/strings.xml`
- Modify: `android/app/src/main/java/com/rafliadipratama/musiceuy/util/LanguageHelper.kt`
- Modify: `android/app/src/main/java/com/rafliadipratama/musiceuy/ui/viewmodel/MusicPlayerViewModel.kt`

- [ ] **Step 1: Add `nav_settings` string in `strings.xml`**
- [ ] **Step 2: Update `LanguageHelper.kt` default to `"en"`**
- [ ] **Step 3: Update `MusicPlayerViewModel.kt` initial language state to `"en"`**
- [ ] **Step 4: Run `./gradlew testDebugUnitTest` to verify no regressions**
- [ ] **Step 5: Commit**

---

### Task 2: 3-Tab BottomNavBar, SettingsScreen with Plugins, & Home Top Search

**Files:**
- Modify: `android/app/src/main/java/com/rafliadipratama/musiceuy/ui/components/BottomNavBar.kt`
- Create: `android/app/src/main/java/com/rafliadipratama/musiceuy/ui/screens/SettingsScreen.kt`
- Modify: `android/app/src/main/java/com/rafliadipratama/musiceuy/ui/screens/HomeScreen.kt`
- Modify: `android/app/src/main/java/com/rafliadipratama/musiceuy/ui/player/PortraitPlayerLayout.kt`
- Modify: `android/app/src/main/java/com/rafliadipratama/musiceuy/MainActivity.kt`

- [x] **Step 1: Update `NavigationTab` in `BottomNavBar.kt` to HOME, LIBRARY, SETTINGS**
- [x] **Step 2: Create `SettingsScreen.kt` with Plugins management section embedded**
- [x] **Step 3: Add Search icon to `HomeScreen.kt` top bar and translate labels to English**
- [x] **Step 4: Update `PortraitPlayerLayout.kt` header to "NOW PLAYING"**
- [x] **Step 5: Update `MainActivity.kt` to route `SETTINGS` and handle Search overlay**
- [x] **Step 6: Run `./gradlew testDebugUnitTest` and compile check**
- [x] **Step 7: Commit**

---

### Task 3: Port 3-Tab Navigation & English Labels to iOS (`iosApp/`)

**Files:**
- Modify: `iosApp/SoraFy/Views/MainTabView.swift`
- Modify: `iosApp/SoraFy/Views/Home/HomeView.swift`

- [ ] **Step 1: Update `MainTabView.swift` to 3 tabs: Home, Library, Settings**
- [ ] **Step 2: Ensure English labels on iOS Home and navigation bars**
- [ ] **Step 3: Commit**

---

### Task 4: Verification & Emulator Testing

- [ ] **Step 1: Build debug APK (`./gradlew assembleDebug`)**
- [ ] **Step 2: Install on emulator**
- [ ] **Step 3: Capture screenshots of Home (3 tabs + top search) and Settings (with plugins)**
