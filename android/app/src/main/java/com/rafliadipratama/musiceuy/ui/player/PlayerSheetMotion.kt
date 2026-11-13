package com.rafliadipratama.musiceuy.ui.player

import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.SpringSpec
import androidx.compose.animation.core.spring
import androidx.compose.ui.unit.IntOffset

/**
 * Critically damped spring physics matching Apple Music's sheet motion.
 * Uses damping ratio 1.0f (no overshoot/rebound) and tuned stiffness 195f
 * for a natural ~0.45s finger-following transition settling within 0.5px.
 */
object PlayerSheetMotion {
    const val SLIDE_STIFFNESS = 195f
    const val DAMPING_RATIO_NO_BOUNCY = Spring.DampingRatioNoBouncy
    const val SETTLE_THRESHOLD_PX = 0.5f

    /**
     * Critically damped spring for sheet slide transitions (translationY as IntOffset).
     */
    val IntOffsetSlideSpring: SpringSpec<IntOffset> = spring(
        dampingRatio = DAMPING_RATIO_NO_BOUNCY,
        stiffness = SLIDE_STIFFNESS,
        visibilityThreshold = IntOffset(1, 1)
    )

    /**
     * Critically damped spring for sheet slide transitions (Float).
     */
    val SheetSlideSpring: SpringSpec<Float> = spring(
        dampingRatio = DAMPING_RATIO_NO_BOUNCY,
        stiffness = SLIDE_STIFFNESS,
        visibilityThreshold = SETTLE_THRESHOLD_PX
    )

    /**
     * Spring for artwork morphing and scaling.
     */
    val ArtworkMorphSpring: SpringSpec<Float> = spring(
        dampingRatio = DAMPING_RATIO_NO_BOUNCY,
        stiffness = SLIDE_STIFFNESS,
        visibilityThreshold = 0.001f
    )

    /**
     * Spring for fading elements in/out during sheet expansion.
     */
    val ElementFadeSpring: SpringSpec<Float> = spring(
        dampingRatio = DAMPING_RATIO_NO_BOUNCY,
        stiffness = 220f,
        visibilityThreshold = 0.01f
    )
}
