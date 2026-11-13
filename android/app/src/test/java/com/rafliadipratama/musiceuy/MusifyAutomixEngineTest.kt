package com.rafliadipratama.musiceuy

import com.rafliadipratama.musiceuy.data.model.Artist
import com.rafliadipratama.musiceuy.data.model.Track
import com.rafliadipratama.musiceuy.data.network.CultureCluster
import com.rafliadipratama.musiceuy.data.network.MusifyAutomixEngine
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class MusifyAutomixEngineTest {

    @Test
    fun testDetectCultureAccuracy() {
        assertEquals(CultureCluster.WESTERN_ALT_INDIE, MusifyAutomixEngine.detectCulture("Radiohead", "Karma Police"))
        assertEquals(CultureCluster.WESTERN_ALT_INDIE, MusifyAutomixEngine.detectCulture("Arctic Monkeys", "Do I Wanna Know?"))
        assertEquals(CultureCluster.WESTERN_ROCK_METAL, MusifyAutomixEngine.detectCulture("Linkin Park", "In the End"))
        assertEquals(CultureCluster.WESTERN_POP_RNB, MusifyAutomixEngine.detectCulture("Bruno Mars", "Just the Way You Are"))
        assertEquals(CultureCluster.INDO_INDIE_FOLK, MusifyAutomixEngine.detectCulture("Bernadya", "Satu Bulan"))
        assertEquals(CultureCluster.INDO_DANGDUT_KOPLO, MusifyAutomixEngine.detectCulture("Denny Caknan", "Kartonyono Medot Janji"))
        assertEquals(CultureCluster.KPOP_ASIAN, MusifyAutomixEngine.detectCulture("BTS", "Dynamite"))
    }

    @Test
    fun testRejectBootlegAndKaraoke() {
        val seed = Track(id = "1", title = "Karma Police", artist = Artist(id = "a1", name = "Radiohead"))
        val cluster = MusifyAutomixEngine.detectCulture(seed.artist.name, seed.title)

        // Bootleg & Karaoke rejection
        assertFalse(MusifyAutomixEngine.isCompatibleTrack(
            Track(id = "2", title = "Karma Police (Karaoke Version)", artist = Artist(id = "a2", name = "Paris Music")),
            seed, cluster
        ))
        assertFalse(MusifyAutomixEngine.isCompatibleTrack(
            Track(id = "3", title = "Apocalypse (slowed + reverb)", artist = Artist(id = "a3", name = "Solice")),
            seed, cluster
        ))
        assertFalse(MusifyAutomixEngine.isCompatibleTrack(
            Track(id = "4", title = "Creep", artist = Artist(id = "a4", name = "The Karaoke Crew")),
            seed, cluster
        ))

        assertTrue(MusifyAutomixEngine.isBootlegOrKaraoke("Karma Police (Karaoke Version)", "Paris Music"))
        assertTrue(MusifyAutomixEngine.isBootlegOrKaraoke("Apocalypse (slowed + reverb)", "Solice"))
        assertTrue(MusifyAutomixEngine.isBootlegOrKaraoke("Creep", "The Karaoke Crew"))
        assertFalse(MusifyAutomixEngine.isBootlegOrKaraoke("Karma Police", "Radiohead"))
    }

    @Test
    fun testRejectCrossCultureContamination() {
        val seed = Track(id = "1", title = "Karma Police", artist = Artist(id = "a1", name = "Radiohead"))
        val cluster = MusifyAutomixEngine.detectCulture(seed.artist.name, seed.title)

        // Dangdut or Indo tracks into Western Alt/Indie
        assertFalse(MusifyAutomixEngine.isCompatibleTrack(
            Track(id = "5", title = "Cundamani", artist = Artist(id = "a5", name = "Denny Caknan")),
            seed, cluster
        ))
        assertFalse(MusifyAutomixEngine.isCompatibleTrack(
            Track(id = "6", title = "Untungnya, Hidup Terus Berjalan", artist = Artist(id = "a6", name = "Bernadya")),
            seed, cluster
        ))

        // Legitimate peers in same cluster
        assertTrue(MusifyAutomixEngine.isCompatibleTrack(
            Track(id = "7", title = "The Scientist", artist = Artist(id = "a7", name = "Coldplay")),
            seed, cluster
        ))
        assertTrue(MusifyAutomixEngine.isCompatibleTrack(
            Track(id = "8", title = "High and Dry", artist = Artist(id = "a1", name = "Radiohead")),
            seed, cluster
        ))
    }
}
