package com.rafliadipratama.musiceuy.data.local

import java.util.concurrent.ConcurrentHashMap

/**
 * Thread-safe manager for temporarily cooling down artists who were skipped early,
 * preventing them from dominating automix / radio suggestions.
 */
class SkippedArtistCooldown(private val cooldownDurationMs: Long = 30 * 60 * 1000L) {

    private val cooldownMap = ConcurrentHashMap<String, Long>()

    private fun normalize(artistName: String): String {
        return artistName.trim().lowercase()
    }

    /**
     * Records an artist skip with the given timestamp.
     */
    fun recordSkip(artistName: String, timestampMs: Long = System.currentTimeMillis()) {
        val normalized = normalize(artistName)
        if (normalized.isEmpty()) return
        cooldownMap[normalized] = timestampMs
    }

    /**
     * Checks if cooldown is currently active for the given artist.
     */
    fun isCooldownActive(artistName: String, currentTimeMs: Long = System.currentTimeMillis()): Boolean {
        val normalized = normalize(artistName)
        if (normalized.isEmpty()) return false
        val skippedAt = cooldownMap[normalized] ?: return false
        val elapsed = currentTimeMs - skippedAt
        return elapsed in 0 until cooldownDurationMs
    }

    /**
     * Clears all recorded cooldowns.
     */
    fun clear() {
        cooldownMap.clear()
    }

    /**
     * Cleans up expired cooldown entries to prevent unbounded memory growth.
     */
    fun clearExpired(currentTimeMs: Long = System.currentTimeMillis()) {
        cooldownMap.entries.removeIf { (_, skippedAt) ->
            (currentTimeMs - skippedAt) >= cooldownDurationMs
        }
    }
}
