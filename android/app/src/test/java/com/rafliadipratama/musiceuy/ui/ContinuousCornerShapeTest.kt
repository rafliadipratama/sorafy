package com.rafliadipratama.musiceuy.ui

import androidx.compose.foundation.shape.CornerSize
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Outline
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.rafliadipratama.musiceuy.ui.components.ContinuousCornerShape
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ContinuousCornerShapeTest {

    private val density = Density(density = 2.0f, fontScale = 1.0f)

    @Test
    fun zeroRadiusReturnsRectangleOutline() {
        val shape = ContinuousCornerShape(0.dp)
        val outline = shape.createOutline(
            size = Size(200f, 100f),
            layoutDirection = LayoutDirection.Ltr,
            density = density
        )
        assertTrue(outline is Outline.Rectangle)
    }

    @Test
    fun positiveRadiusReturnsGenericOutline() {
        val shape = ContinuousCornerShape(16.dp, smoothness = 0.6f)
        val outline = shape.createOutline(
            size = Size(200f, 100f),
            layoutDirection = LayoutDirection.Ltr,
            density = density
        )
        assertNotNull(outline)
        assertTrue(outline is Outline.Generic)
    }

    @Test
    fun smoothnessClampedBetweenZeroAndOne() {
        val shapeUnder = ContinuousCornerShape(12.dp, smoothness = -0.5f)
        assertEquals(0.0f, shapeUnder.smoothness, 0.001f)

        val shapeOver = ContinuousCornerShape(12.dp, smoothness = 2.0f)
        assertEquals(1.0f, shapeOver.smoothness, 0.001f)
    }

    @Test
    fun copyPreservesSmoothnessAndCorners() {
        val original = ContinuousCornerShape(
            topStart = 10.dp,
            topEnd = 20.dp,
            bottomEnd = 30.dp,
            bottomStart = 40.dp,
            smoothness = 0.75f
        )
        val copied = original.copy(topStart = CornerSize(15.dp))

        assertEquals(0.75f, copied.smoothness, 0.001f)
        assertEquals(15.dp.value * density.density, copied.topStart.toPx(Size(100f, 100f), density), 0.01f)
        assertEquals(20.dp.value * density.density, copied.topEnd.toPx(Size(100f, 100f), density), 0.01f)
    }

    @Test
    fun oversizedRadiiScaleGracefully() {
        val shape = ContinuousCornerShape(200.dp, smoothness = 0.6f)
        val size = Size(100f, 100f)
        val effective = shape.calculateEffectiveRadii(
            size = size,
            topStart = 400f,
            topEnd = 400f,
            bottomEnd = 400f,
            bottomStart = 400f
        )
        // factor = 1.6, maxHorizontal = 800 * 1.6 = 1280.
        // scale = 100 / 1280 = 0.078125
        assertTrue(effective.scale < 1.0f)
        assertTrue(effective.topStart * 1.6f + effective.topEnd * 1.6f <= size.width + 0.01f)
        assertTrue(effective.topStart * 1.6f + effective.bottomStart * 1.6f <= size.height + 0.01f)

        val outline = shape.createOutline(
            size = size,
            layoutDirection = LayoutDirection.Ltr,
            density = density
        )
        assertNotNull(outline)
        assertTrue(outline is Outline.Generic)
    }
}
