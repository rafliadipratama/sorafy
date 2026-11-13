package com.rafliadipratama.musiceuy

import com.rafliadipratama.musiceuy.ui.components.calculateFractionFromOffset
import com.rafliadipratama.musiceuy.ui.components.volumeIndexToRatio
import com.rafliadipratama.musiceuy.ui.components.volumeRatioToIndex
import org.junit.Assert.assertEquals
import org.junit.Test

class AppleMusicVolumeSliderTest {

    @Test
    fun volumeRatioToIndex_normalConversions() {
        val maxVolume = 15
        assertEquals(0, volumeRatioToIndex(0.0f, maxVolume))
        assertEquals(15, volumeRatioToIndex(1.0f, maxVolume))
        assertEquals(8, volumeRatioToIndex(0.5f, maxVolume))
        assertEquals(1, volumeRatioToIndex(1f / 15f, maxVolume))
        assertEquals(14, volumeRatioToIndex(14f / 15f, maxVolume))
    }

    @Test
    fun volumeRatioToIndex_clampsOutOfBounds() {
        val maxVolume = 15
        assertEquals(0, volumeRatioToIndex(-0.5f, maxVolume))
        assertEquals(15, volumeRatioToIndex(1.5f, maxVolume))
        assertEquals(0, volumeRatioToIndex(Float.NEGATIVE_INFINITY, maxVolume))
        assertEquals(15, volumeRatioToIndex(Float.POSITIVE_INFINITY, maxVolume))
    }

    @Test
    fun volumeRatioToIndex_handlesZeroOrNegativeMaxVolume() {
        assertEquals(0, volumeRatioToIndex(0.5f, 0))
        assertEquals(0, volumeRatioToIndex(0.5f, -5))
    }

    @Test
    fun volumeIndexToRatio_normalConversions() {
        val maxVolume = 15
        assertEquals(0.0f, volumeIndexToRatio(0, maxVolume), 0.0001f)
        assertEquals(1.0f, volumeIndexToRatio(15, maxVolume), 0.0001f)
        assertEquals(7f / 15f, volumeIndexToRatio(7, maxVolume), 0.0001f)
    }

    @Test
    fun volumeIndexToRatio_clampsOutOfBounds() {
        val maxVolume = 15
        assertEquals(0.0f, volumeIndexToRatio(-2, maxVolume), 0.0001f)
        assertEquals(1.0f, volumeIndexToRatio(20, maxVolume), 0.0001f)
    }

    @Test
    fun volumeIndexToRatio_handlesZeroOrNegativeMaxVolume() {
        assertEquals(0.0f, volumeIndexToRatio(5, 0), 0.0001f)
        assertEquals(0.0f, volumeIndexToRatio(5, -10), 0.0001f)
    }

    @Test
    fun calculateFractionFromOffset_conversionsAndClamping() {
        val width = 200f
        assertEquals(0.0f, calculateFractionFromOffset(0f, width), 0.0001f)
        assertEquals(0.5f, calculateFractionFromOffset(100f, width), 0.0001f)
        assertEquals(1.0f, calculateFractionFromOffset(200f, width), 0.0001f)
        assertEquals(0.0f, calculateFractionFromOffset(-50f, width), 0.0001f)
        assertEquals(1.0f, calculateFractionFromOffset(350f, width), 0.0001f)
        assertEquals(0.0f, calculateFractionFromOffset(100f, 0f), 0.0001f)
        assertEquals(0.0f, calculateFractionFromOffset(100f, -10f), 0.0001f)
    }

    @Test
    fun roundTripConversion_preservesIndices() {
        val maxVolume = 25
        for (i in 0..maxVolume) {
            val ratio = volumeIndexToRatio(i, maxVolume)
            val convertedBack = volumeRatioToIndex(ratio, maxVolume)
            assertEquals(i, convertedBack)
        }
    }
}
