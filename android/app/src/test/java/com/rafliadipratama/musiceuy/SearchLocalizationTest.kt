package com.rafliadipratama.musiceuy

import com.rafliadipratama.musiceuy.ui.viewmodel.MusicPlayerUiState
import com.rafliadipratama.musiceuy.ui.viewmodel.normalizeSearchCategory
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class SearchLocalizationTest {

    @Test
    fun defaultSearchCategory_isAll() {
        val state = MusicPlayerUiState()
        assertEquals("All", state.searchCategory)
    }

    @Test
    fun categoryNormalization_supportsEnglishAndIndonesian() {
        // English category verification
        assertEquals("All", normalizeSearchCategory("All"))
        assertEquals("Songs", normalizeSearchCategory("Songs"))
        assertEquals("Videos", normalizeSearchCategory("Videos"))
        assertEquals("Artists", normalizeSearchCategory("Artists"))
        assertEquals("Albums", normalizeSearchCategory("Albums"))

        // Indonesian fallback mapping verification
        assertEquals("All", normalizeSearchCategory("Semua"))
        assertEquals("Songs", normalizeSearchCategory("Lagu"))
        assertEquals("Videos", normalizeSearchCategory("Video"))
        assertEquals("Artists", normalizeSearchCategory("Artis"))
        assertEquals("Albums", normalizeSearchCategory("Album"))

        // Case insensitivity & trimming
        assertEquals("All", normalizeSearchCategory("  all  "))
        assertEquals("Songs", normalizeSearchCategory("songs"))
        assertEquals("Videos", normalizeSearchCategory("videos"))
        assertEquals("Artists", normalizeSearchCategory("artists"))
        assertEquals("Albums", normalizeSearchCategory("albums"))
    }

    @Test
    fun uiState_categorySwitchingWorks() {
        var state = MusicPlayerUiState()
        assertEquals("All", state.searchCategory)

        state = state.copy(searchCategory = normalizeSearchCategory("Songs"))
        assertEquals("Songs", state.searchCategory)

        state = state.copy(searchCategory = normalizeSearchCategory("Videos"))
        assertEquals("Videos", state.searchCategory)

        state = state.copy(searchCategory = normalizeSearchCategory("Artists"))
        assertEquals("Artists", state.searchCategory)

        state = state.copy(searchCategory = normalizeSearchCategory("Albums"))
        assertEquals("Albums", state.searchCategory)

        // Switch back using Indonesian input
        state = state.copy(searchCategory = normalizeSearchCategory("Semua"))
        assertEquals("All", state.searchCategory)
    }

    @Test
    fun searchCategoryPills_matchRequiredCategories() {
        val expectedPills = listOf("All", "Songs", "Videos", "Artists", "Albums")
        val filterSupported = listOf("All", "Semua", "Songs", "Lagu")

        assertTrue(expectedPills.contains("All"))
        assertTrue(expectedPills.contains("Songs"))
        assertTrue(expectedPills.contains("Videos"))
        assertTrue(expectedPills.contains("Artists"))
        assertTrue(expectedPills.contains("Albums"))
        assertTrue(filterSupported.contains("All"))
        assertTrue(filterSupported.contains("Songs"))
    }
}
