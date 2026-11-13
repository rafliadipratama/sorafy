# Implementation Plan: Official YouTube Music Images & English Search Screen

## Goal
1. Convert all remaining Indonesian text in `SearchScreen.kt` and `LibraryScreen.kt` to English.
2. Incorporate official YouTube Music / Google User Content image sources for Explore categories, Playlists, Albums, and Videos across Android and iOS.
3. Validate with unit tests and emulator UI screenshots.

## Proposed Tasks

### Task 1: English Localization of SearchScreen and LibraryScreen
- Update `MusicPlayerViewModel.kt` default `searchCategory` from `"Semua"` to `"All"`.
- Update `SearchScreen.kt`:
  - Categories: `listOf("All", "Songs", "Videos", "Artists", "Albums")`.
  - Filter logic checks for both English ("All", "Songs", etc.) and legacy keys.
  - Convert all titles: "Recent Searches", "Clear All", "Trending Now", "Explore Categories", "Top Result", "Songs", "Videos", "Artists", "Albums".
  - Empty states: "No results found for '$searchInput'", "Try searching for another song, artist, or album."
- Update `LibraryScreen.kt`:
  - "Create New Playlist", "Create", "Cancel", "Playlist Name", "Description (Optional)", "Explore Popular Genres", "Create Playlist".
- Add unit test in `android/app/src/test/java/com/rafliadipratama/musiceuy/SearchLocalizationTest.kt`.

### Task 2: Official YouTube Music Images for Explore, Categories, Playlists & Videos
- Update `SearchScreen.kt`:
  - Enhance `ExploreGenre` to include `coverUrl: String`.
  - Add official YouTube Music / Google User Content cover URLs to each genre card.
  - Render cover artwork in `ExploreGenre` card with squircle curvature and rotated corner artwork matching desktop.
- Update `LibraryScreen.kt`:
  - Enhance `PopularGenre` with `coverUrl: String` and render cover thumbnails.
- Update `HomeScreen.kt`:
  - Enhance `topCategories` with official cover image URLs.
- Update `MusicStreamSource.kt`:
  - Change video thumbnail resolution from `hqdefault.jpg` to `hq720.jpg` with `maxresdefault.jpg` fallback for full 16:9 HD visuals.
  - Verify all playlist and album fallback catalogs use official high-res Google User Content URLs.

### Task 3: iOS Parity Updates
- Verify `SearchView.swift` and `LibraryView.swift` have matching English terminology and image assets.

### Task 4: Compilation, Unit Tests & Emulator Verification
- Run `./gradlew testDebugUnitTest`.
- Run `./gradlew assembleDebug`.
- Start emulator and install updated APK.
- Navigate to Search screen, take screenshot `sorafy_search_english_ytm.png`.
- Confirm 100% English text and official YouTube Music imagery.
- Commit all changes and push to `origin main`.
