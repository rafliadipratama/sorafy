# Design Specification: Official YouTube Music Images & English Search Screen

## 1. Problem Statement
1. **Search Screen Localization**: `SearchScreen.kt` still contains Indonesian text across category pills (`"Semua"`, `"Lagu"`, `"Video"`, `"Artis"`, `"Album"`), headers (`"Pencarian Terakhir"`, `"Hapus Semua"`, `"Sedang Tren"`, `"Jelajahi Kategori"`, `"Hasil Terbaik"`), content descriptions, empty states, and genre names.
2. **Official YouTube Music Image Sources**:
   - Explore categories on mobile (`topCategories` in `HomeScreen.kt`, `exploreGenres` in `SearchScreen.kt`, `popularGenres` in `LibraryScreen.kt`) lack real cover artwork or use hardcoded gradients. In contrast, desktop displays official YouTube Music/Spotify artwork for categories.
   - Video thumbnails across `HomeScreen.kt`, `SearchScreen.kt`, and `MusicStreamSource.kt` need high-definition 16:9 images (`hq720.jpg` / `maxresdefault.jpg`) without 4:3 letterboxing.
   - Playlists and albums must strictly resolve and display high-res Google User Content/InnerTube cover URLs (`yt3.googleusercontent.com` / `lh3.googleusercontent.com` with `=w544-h544-l90-rj` or `=s576`).

## 2. Technical Architecture & Changes

### A. Localization & Search Screen Refactor
- Update `MusicPlayerViewModel.uiState.searchCategory` default from `"Semua"` to `"All"`.
- Support category filtering in `SearchScreen.kt` for `"All"`, `"Songs"`, `"Videos"`, `"Artists"`, `"Albums"`.
- Convert all UI text strings to English:
  - Header: Search
  - History: "Recent Searches" / "Clear All"
  - Trending: "Trending Now"
  - Categories: "Explore Categories"
  - Top Result: "Top Result"
  - Section headers: "Songs", "Videos", "Artists", "Albums"
  - Empty state: "No results found for '$searchInput'" / "Try searching for another song, artist, or album."
- Refactor `LibraryScreen.kt`:
  - "Create New Playlist", "Create", "Cancel", "Playlist Name", "Description (Optional)", "Explore Popular Genres".

### B. Official YouTube Music Images for Explore, Playlists, Albums & Videos
- **Explore Genres (`ExploreGenre` & `TopCategory` & `PopularGenre`)**:
  - Add `coverUrl: String` to category data models.
  - Populate with official YouTube Music / Google User Content artwork:
    - Indo Pop: `https://yt3.googleusercontent.com/PR-EXqPEf4aHFFLHknd2II-rvvVINdq7mS_eaHe4NEX11w2P6N8SztkPlouSzvGX6gtuMeeJXro=s576`
    - Indie Vibe: `https://i.scdn.co/image/ab67706f000000027dea5c0e18df3727eacdc4e1`
    - Dangdut & Koplo: `https://yt3.googleusercontent.com/2qHUJ20mtWoAZBU80LpQkNfu7EXSKKNs8K-MFFV5vIuFKDseRNHb1cVbmuzmfHvNJKKZGJ-cJKI=s576`
    - 2000s Rock: `https://i.scdn.co/image/ab67706f00000002694bf33281695f3b7542a09a`
    - Chill & Relax: `https://i.scdn.co/image/ab67706f000000020408713c731caaf1f800615a`
    - Focus & Study: `https://i.scdn.co/image/ab67706f000000026020f2f6476db518ef747da4`
    - Hip-Hop & R&B: `https://i.scdn.co/image/ab67706f00000002876581e4be85838f0e1ad09d`
    - Dance / Electronic: `https://i.scdn.co/image/ab67706f00000002385ff7ec006cdc4922f52557`
  - In `SearchScreen.kt`, update card layout to display the rotated cover artwork in the bottom-right corner (mirroring desktop `.mood-genre-cover`).
- **Videos**:
  - Update `MusicStreamSource.fetchMusicVideosForArtists` and `getArtistMusicVideos`:
    Use `https://i.ytimg.com/vi/$vId/hq720.jpg` fallback `https://i.ytimg.com/vi/$vId/maxresdefault.jpg` fallback `https://i.ytimg.com/vi/$vId/mqdefault.jpg`.
  - In `SearchScreen.kt` and `HomeScreen.kt`: render crisp 16:9 thumbnails without letterbox borders.
- **Playlists & Albums**:
  - Ensure all fallback catalog items in `MusicStreamSource.kt` use high-res official Google User Content URLs with `=w544-h544-l90-rj` or `=s576`.

### C. iOS Parity
- Ensure `SearchView.swift` and `LibraryView.swift` mirror the same English strings and official YTM artwork where applicable.

### D. Verification
- Run unit tests: `./gradlew testDebugUnitTest`.
- Build debug APK: `./gradlew assembleDebug`.
- Capture emulator screenshot showing Search screen with 100% English and official YTM explore artwork.
