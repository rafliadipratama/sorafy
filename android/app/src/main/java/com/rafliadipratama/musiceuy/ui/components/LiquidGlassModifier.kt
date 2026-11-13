package com.rafliadipratama.musiceuy.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.rafliadipratama.musiceuy.ui.theme.LiquidGlassBase
import com.rafliadipratama.musiceuy.ui.theme.LiquidGlassBorder
import com.rafliadipratama.musiceuy.ui.theme.LiquidGlassBorderSubtle
import com.rafliadipratama.musiceuy.ui.theme.LiquidGlassHighlight

/**
 * Liquid Glass Modifier inspired by Apple Music's translucent glass materials.
 * Features:
 * - G2 Continuous Curvature clipping.
 * - Deep Obsidian frosted glass foundation.
 * - Specular top-light gradient reflection.
 * - 0.5dp hairline glass rim with vertical illumination gradient.
 * - Zero glowing neon slop.
 */
fun Modifier.liquidGlass(
    shape: Shape = SquircleMedium,
    backgroundColor: Color = LiquidGlassBase,
    tintColor: Color? = null,
    borderWidth: Dp = 0.5.dp,
    borderColor: Color = LiquidGlassBorder
): Modifier {
    val topSheen = tintColor?.copy(alpha = 0.16f) ?: LiquidGlassHighlight

    return this
        .clip(shape)
        .background(
            brush = Brush.verticalGradient(
                colors = listOf(
                    topSheen,
                    backgroundColor
                )
            ),
            shape = shape
        )
        .border(
            width = borderWidth,
            brush = Brush.verticalGradient(
                colors = listOf(
                    borderColor,
                    LiquidGlassBorderSubtle
                )
            ),
            shape = shape
        )
}
