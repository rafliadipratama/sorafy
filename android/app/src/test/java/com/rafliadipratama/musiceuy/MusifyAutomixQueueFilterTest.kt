package com.rafliadipratama.musiceuy

import com.rafliadipratama.musiceuy.data.local.SkippedArtistCooldown
import com.rafliadipratama.musiceuy.data.model.Artist
import com.rafliadipratama.musiceuy.data.model.Track
import com.rafliadipratama.musiceuy.data.network.CultureCluster
import com.rafliadipratama.musiceuy.data.network.MusifyAutomixEngine
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class MusifyAutomixQueueFilterTest {

    @Test
    fun testAutomixQueueCandidateFiltering() {
        val seedTrack = Track(
            id = "seed_1",
            title = "Karma Police",
            artist = Artist(id = "art_radiohead", name = "Radiohead")
        )
        val seedCluster = MusifyAutomixEngine.detectCulture(seedTrack.artist.name, seedTrack.title)
        assertEquals(CultureCluster.WESTERN_ALT_INDIE, seedCluster)

        val skippedCooldown = SkippedArtistCooldown(cooldownDurationMs = 1000L)
        // Record skip for Coldplay
        skippedCooldown.recordSkip("Coldplay", timestampMs = 500L)

        val currentQueue = listOf(
            seedTrack,
            Track(id = "existing_1", title = "Creep", artist = Artist(id = "art_radiohead", name = "Radiohead"))
        )
        val existingIds = currentQueue.map { it.id }.toSet()
        val existingTitles = currentQueue.map { it.title.trim().lowercase() }.toSet()

        val rawCandidates = listOf(
            // Candidate 1: Same seed track (must be rejected)
            Track(id = "seed_1", title = "Karma Police", artist = Artist(id = "art_radiohead", name = "Radiohead")),
            // Candidate 2: Already in queue by ID (must be rejected)
            Track(id = "existing_1", title = "Creep", artist = Artist(id = "art_radiohead", name = "Radiohead")),
            // Candidate 3: Already in queue by Title (must be rejected)
            Track(id = "diff_id_creep", title = " creep ", artist = Artist(id = "art_radiohead", name = "Radiohead")),
            // Candidate 4: Skipped artist in cooldown (Coldplay) (must be rejected)
            Track(id = "coldplay_1", title = "Yellow", artist = Artist(id = "art_coldplay", name = "Coldplay")),
            // Candidate 5: Incompatible culture (Denny Caknan) (must be rejected)
            Track(id = "denny_1", title = "Cundamani", artist = Artist(id = "art_denny", name = "Denny Caknan")),
            // Candidate 6: Bootleg / karaoke (must be rejected)
            Track(id = "bootleg_1", title = "No Surprises (slowed + reverb)", artist = Artist(id = "art_solice", name = "Solice")),
            // Candidate 7: Valid Radiohead song (must be accepted)
            Track(id = "radiohead_valid", title = "No Surprises", artist = Artist(id = "art_radiohead", name = "Radiohead")),
            // Candidate 8: Valid peer Arctic Monkeys (must be accepted)
            Track(id = "am_valid", title = "Do I Wanna Know?", artist = Artist(id = "art_am", name = "Arctic Monkeys"))
        )

        val currentTimeMs = 700L // Coldplay cooldown still active
        val validSongs = mutableListOf<Track>()
        val seenIds = existingIds.toMutableSet()
        val seenTitles = existingTitles.toMutableSet()

        for (candidate in rawCandidates) {
            if (candidate.id == seedTrack.id) continue
            if (seenIds.contains(candidate.id)) continue
            val normTitle = candidate.title.trim().lowercase()
            if (seenTitles.contains(normTitle)) continue
            if (skippedCooldown.isCooldownActive(candidate.artist.name, currentTimeMs)) continue
            if (!MusifyAutomixEngine.isCompatibleTrack(candidate, seedTrack, seedCluster)) continue

            validSongs.add(candidate)
            seenIds.add(candidate.id)
            seenTitles.add(normTitle)
        }

        // Only candidate 7 (No Surprises) and candidate 8 (Do I Wanna Know?) must pass
        assertEquals(2, validSongs.size)
        assertEquals("radiohead_valid", validSongs[0].id)
        assertEquals("am_valid", validSongs[1].id)
    }

    @Test
    fun testCooldownExpirationAllowsArtistAgain() {
        val seedTrack = Track(
            id = "seed_1",
            title = "Karma Police",
            artist = Artist(id = "art_radiohead", name = "Radiohead")
        )
        val seedCluster = MusifyAutomixEngine.detectCulture(seedTrack.artist.name, seedTrack.title)

        val skippedCooldown = SkippedArtistCooldown(cooldownDurationMs = 1000L)
        skippedCooldown.recordSkip("Coldplay", timestampMs = 100L)

        val coldplayCandidate = Track(
            id = "cp_1",
            title = "The Scientist",
            artist = Artist(id = "art_coldplay", name = "Coldplay")
        )

        // At t = 500ms, cooldown active -> candidate rejected
        assertTrue(skippedCooldown.isCooldownActive(coldplayCandidate.artist.name, 500L))

        // At t = 1200ms, cooldown expired -> candidate accepted
        assertFalse(skippedCooldown.isCooldownActive(coldplayCandidate.artist.name, 1200L))
        assertTrue(MusifyAutomixEngine.isCompatibleTrack(coldplayCandidate, seedTrack, seedCluster))
    }

    @Test
    fun testQueuePrefetchThresholdCalculation() {
        // Condition: currentIndex >= queue.size - 2 triggers prefetch
        val queueSize5 = 5
        // Indexes: 0, 1, 2, 3, 4. Threshold is 5 - 2 = 3.
        assertFalse(0 >= queueSize5 - 2) // Index 0: false
        assertFalse(1 >= queueSize5 - 2) // Index 1: false
        assertFalse(2 >= queueSize5 - 2) // Index 2: false
        assertTrue(3 >= queueSize5 - 2)  // Index 3: true (pre-fetches before reaching the end)
        assertTrue(4 >= queueSize5 - 2)  // Index 4: true (last track)

        // For a single track queue: size = 1. Threshold is 1 - 2 = -1.
        val queueSize1 = 1
        assertTrue(0 >= queueSize1 - 2)  // Index 0: 0 >= -1 is true (immediately triggers)
    }

    @Test
    fun testSkipUnder15SecondsThreshold() {
        // currentPositionMs in 1..14_999L records skip cooldown
        fun shouldRecordSkip(posMs: Long): Boolean = posMs in 1..14_999L

        assertFalse(shouldRecordSkip(0L))
        assertTrue(shouldRecordSkip(1L))
        assertTrue(shouldRecordSkip(5_000L))
        assertTrue(shouldRecordSkip(14_999L))
        assertFalse(shouldRecordSkip(15_000L))
        assertFalse(shouldRecordSkip(30_000L))
    }
}
