package com.rafliadipratama.musiceuy.ui.player

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import com.rafliadipratama.musiceuy.ui.theme.ObsidianVoid
import kotlin.math.cos
import kotlin.math.sin

/**
 * Dynamic Ambient Mesh Backdrop inspired by Apple Music.
 * Renders undulating chromatic nodes derived from album palette,
 * blended softly into an Obsidian canvas with OLED anti-banding gradients.
 */
@Composable
fun AmbientMeshBackdrop(
    dominantColor: Color,
    modifier: Modifier = Modifier
) {
    // Smoothly interpolate color changes when song changes
    val animatedPrimary by animateColorAsState(
        targetValue = dominantColor,
        animationSpec = tween(1200),
        label = "meshPrimaryColor"
    )

    val animatedSecondary by animateColorAsState(
        targetValue = Color(
            red = (dominantColor.red * 0.7f + 0.05f).coerceIn(0f, 1f),
            green = (dominantColor.green * 0.8f + 0.1f).coerceIn(0f, 1f),
            blue = (dominantColor.blue * 0.9f + 0.15f).coerceIn(0f, 1f),
            alpha = 1f
        ),
        animationSpec = tween(1400),
        label = "meshSecondaryColor"
    )

    val infiniteTransition = rememberInfiniteTransition(label = "meshDrift")

    val drift1 by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 2f * Math.PI.toFloat(),
        animationSpec = infiniteRepeatable(
            animation = tween(16000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "driftNode1"
    )

    val drift2 by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 2f * Math.PI.toFloat(),
        animationSpec = infiniteRepeatable(
            animation = tween(22000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "driftNode2"
    )

    val drift3 by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 2f * Math.PI.toFloat(),
        animationSpec = infiniteRepeatable(
            animation = tween(19000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "driftNode3"
    )

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(ObsidianVoid)
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val w = size.width
            val h = size.height

            // Node 1: Top-left dominant blob
            val cx1 = w * 0.25f + cos(drift1) * (w * 0.08f)
            val cy1 = h * 0.20f + sin(drift1) * (h * 0.06f)
            val r1 = maxOf(w, h) * 0.65f

            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        animatedPrimary.copy(alpha = 0.45f),
                        animatedPrimary.copy(alpha = 0.15f),
                        Color.Transparent
                    ),
                    center = Offset(cx1, cy1),
                    radius = r1
                ),
                radius = r1,
                center = Offset(cx1, cy1)
            )

            // Node 2: Top-right secondary blob
            val cx2 = w * 0.80f + sin(drift2) * (w * 0.10f)
            val cy2 = h * 0.35f + cos(drift2) * (h * 0.08f)
            val r2 = maxOf(w, h) * 0.70f

            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        animatedSecondary.copy(alpha = 0.35f),
                        animatedSecondary.copy(alpha = 0.10f),
                        Color.Transparent
                    ),
                    center = Offset(cx2, cy2),
                    radius = r2
                ),
                radius = r2,
                center = Offset(cx2, cy2)
            )

            // Node 3: Center-bottom accent blob
            val cx3 = w * 0.45f + cos(drift3) * (w * 0.12f)
            val cy3 = h * 0.65f + sin(drift3) * (h * 0.07f)
            val r3 = maxOf(w, h) * 0.75f

            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        animatedPrimary.copy(alpha = 0.30f),
                        animatedPrimary.copy(alpha = 0.08f),
                        Color.Transparent
                    ),
                    center = Offset(cx3, cy3),
                    radius = r3
                ),
                radius = r3,
                center = Offset(cx3, cy3)
            )

            // Anti-banding depth scrim & subtle darkening towards bottom controls
            drawRect(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        Color(0x330B0D10),
                        Color(0x880B0D10),
                        ObsidianVoid.copy(alpha = 0.94f),
                        ObsidianVoid
                    )
                )
            )
        }
    }
}
