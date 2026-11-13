package com.rafliadipratama.musiceuy

import com.rafliadipratama.musiceuy.data.local.SkippedArtistCooldown
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class SkippedArtistCooldownTest {

    @Test
    fun testCooldownBehavior() {
        val cooldown = SkippedArtistCooldown(cooldownDurationMs = 1000L)
        assertFalse(cooldown.isCooldownActive("Radiohead", currentTimeMs = 0L))

        cooldown.recordSkip("Radiohead", timestampMs = 100L)
        assertTrue(cooldown.isCooldownActive("Radiohead", currentTimeMs = 500L))
        assertTrue(cooldown.isCooldownActive("radiohead", currentTimeMs = 900L)) // case-insensitive
        assertTrue(cooldown.isCooldownActive("  Radiohead  ", currentTimeMs = 900L)) // trimmed

        // After cooldown expires
        assertFalse(cooldown.isCooldownActive("Radiohead", currentTimeMs = 1200L))

        // Empty/blank artist names
        cooldown.recordSkip("", timestampMs = 100L)
        cooldown.recordSkip("   ", timestampMs = 100L)
        assertFalse(cooldown.isCooldownActive("", currentTimeMs = 500L))
        assertFalse(cooldown.isCooldownActive("   ", currentTimeMs = 500L))
    }

    @Test
    fun testClear() {
        val cooldown = SkippedArtistCooldown(cooldownDurationMs = 1000L)
        cooldown.recordSkip("Coldplay", timestampMs = 100L)
        assertTrue(cooldown.isCooldownActive("Coldplay", currentTimeMs = 200L))

        cooldown.clear()
        assertFalse(cooldown.isCooldownActive("Coldplay", currentTimeMs = 200L))
    }

    @Test
    fun testClearExpired() {
        val cooldown = SkippedArtistCooldown(cooldownDurationMs = 1000L)
        cooldown.recordSkip("Coldplay", timestampMs = 100L) // expires at 1100
        cooldown.recordSkip("Radiohead", timestampMs = 500L) // expires at 1500

        // At t = 1200, Coldplay is expired, Radiohead is still active
        cooldown.clearExpired(currentTimeMs = 1200L)

        assertFalse(cooldown.isCooldownActive("Coldplay", currentTimeMs = 1200L))
        assertTrue(cooldown.isCooldownActive("Radiohead", currentTimeMs = 1200L))
    }
}
