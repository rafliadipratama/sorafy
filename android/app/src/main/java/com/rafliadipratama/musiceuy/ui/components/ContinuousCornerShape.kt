package com.rafliadipratama.musiceuy.ui.components

import androidx.compose.foundation.shape.CornerBasedShape
import androidx.compose.foundation.shape.CornerSize
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.geometry.toRect
import androidx.compose.ui.graphics.Outline
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp

/**
 * Continuous curvature squircle shape based on Apple's G2 curvature continuity curve.
 * Eliminates the abrupt optical transition ("shoulder") of standard circular rounded rectangles
 * by smoothly accelerating curvature using cubic Bézier splines.
 *
 * @param smoothness Continuous corner smoothing factor between 0.0f (circular arc) and 1.0f (maximum squircle).
 *                   Apple iOS standard is approximately 0.6f.
 */
class ContinuousCornerShape(
    topStart: CornerSize,
    topEnd: CornerSize,
    bottomEnd: CornerSize,
    bottomStart: CornerSize,
    smoothness: Float = 0.6f
) : CornerBasedShape(topStart, topEnd, bottomEnd, bottomStart) {

    val smoothness: Float = smoothness.coerceIn(0f, 1f)

    constructor(
        corner: CornerSize,
        smoothness: Float = 0.6f
    ) : this(corner, corner, corner, corner, smoothness)

    constructor(
        size: Dp,
        smoothness: Float = 0.6f
    ) : this(CornerSize(size), smoothness)

    constructor(
        topStart: Dp = 0.dp,
        topEnd: Dp = 0.dp,
        bottomEnd: Dp = 0.dp,
        bottomStart: Dp = 0.dp,
        smoothness: Float = 0.6f
    ) : this(
        CornerSize(topStart),
        CornerSize(topEnd),
        CornerSize(bottomEnd),
        CornerSize(bottomStart),
        smoothness
    )

    fun copy(
        topStart: CornerSize = this.topStart,
        topEnd: CornerSize = this.topEnd,
        bottomEnd: CornerSize = this.bottomEnd,
        bottomStart: CornerSize = this.bottomStart,
        smoothness: Float = this.smoothness
    ): ContinuousCornerShape {
        return ContinuousCornerShape(topStart, topEnd, bottomEnd, bottomStart, smoothness)
    }

    override fun copy(
        topStart: CornerSize,
        topEnd: CornerSize,
        bottomEnd: CornerSize,
        bottomStart: CornerSize
    ): ContinuousCornerShape {
        return copy(topStart, topEnd, bottomEnd, bottomStart, smoothness)
    }

    data class EffectiveRadii(
        val topStart: Float,
        val topEnd: Float,
        val bottomEnd: Float,
        val bottomStart: Float,
        val scale: Float
    )

    fun calculateEffectiveRadii(
        size: Size,
        topStart: Float,
        topEnd: Float,
        bottomEnd: Float,
        bottomStart: Float
    ): EffectiveRadii {
        val factor = 1f + smoothness
        val maxHorizontal = maxOf(topStart + topEnd, bottomStart + bottomEnd) * factor
        val maxVertical = maxOf(topStart + bottomStart, topEnd + bottomEnd) * factor

        val scaleH = if (maxHorizontal > size.width && maxHorizontal > 0f) size.width / maxHorizontal else 1f
        val scaleV = if (maxVertical > size.height && maxVertical > 0f) size.height / maxVertical else 1f
        val scale = minOf(scaleH, scaleV, 1f)

        return EffectiveRadii(
            topStart = (topStart * scale).coerceAtLeast(0f),
            topEnd = (topEnd * scale).coerceAtLeast(0f),
            bottomEnd = (bottomEnd * scale).coerceAtLeast(0f),
            bottomStart = (bottomStart * scale).coerceAtLeast(0f),
            scale = scale
        )
    }

    override fun createOutline(
        size: Size,
        topStart: Float,
        topEnd: Float,
        bottomEnd: Float,
        bottomStart: Float,
        layoutDirection: LayoutDirection
    ): Outline {
        if (size.width <= 0f || size.height <= 0f) {
            return Outline.Rectangle(Rect.Zero)
        }

        val (rTopStart, rTopEnd) = if (layoutDirection == LayoutDirection.Ltr) {
            topStart to topEnd
        } else {
            topEnd to topStart
        }
        val (rBottomStart, rBottomEnd) = if (layoutDirection == LayoutDirection.Ltr) {
            bottomStart to bottomEnd
        } else {
            bottomEnd to bottomStart
        }

        if (rTopStart <= 0f && rTopEnd <= 0f && rBottomEnd <= 0f && rBottomStart <= 0f) {
            return Outline.Rectangle(size.toRect())
        }

        val s = smoothness
        val factor = 1f + s
        val effective = calculateEffectiveRadii(size, rTopStart, rTopEnd, rBottomEnd, rBottomStart)

        val rTS = effective.topStart
        val rTE = effective.topEnd
        val rBE = effective.bottomEnd
        val rBS = effective.bottomStart

        val w = size.width
        val h = size.height

        val path = Path().apply {
            reset()

            // 1. Top-Left Corner
            if (rTS > 0.5f) {
                val L = rTS * factor
                val c1 = 0.519f * (factor / 1.6f) * rTS
                val c2 = 0.054f * (s / 0.6f) * rTS
                val c3 = 0.518f * rTS
                val m = 0.293f * rTS

                moveTo(0f, L)
                cubicTo(0f, L - c1, c2, rTS - c3, m, m)
                cubicTo(rTS - c3, c2, L - c1, 0f, L, 0f)
            } else {
                moveTo(0f, 0f)
            }

            // 2. Top Edge -> Top-Right Corner
            if (rTE > 0.5f) {
                val L = rTE * factor
                val c1 = 0.519f * (factor / 1.6f) * rTE
                val c2 = 0.054f * (s / 0.6f) * rTE
                val c3 = 0.518f * rTE
                val m = 0.293f * rTE

                lineTo(w - L, 0f)
                cubicTo(w - (L - c1), 0f, w - (rTE - c3), c2, w - m, m)
                cubicTo(w - c2, rTE - c3, w, L - c1, w, L)
            } else {
                lineTo(w, 0f)
            }

            // 3. Right Edge -> Bottom-Right Corner
            if (rBE > 0.5f) {
                val L = rBE * factor
                val c1 = 0.519f * (factor / 1.6f) * rBE
                val c2 = 0.054f * (s / 0.6f) * rBE
                val c3 = 0.518f * rBE
                val m = 0.293f * rBE

                lineTo(w, h - L)
                cubicTo(w, h - (L - c1), w - c2, h - (rBE - c3), w - m, h - m)
                cubicTo(w - (rBE - c3), h - c2, w - (L - c1), h, w - L, h)
            } else {
                lineTo(w, h)
            }

            // 4. Bottom Edge -> Bottom-Left Corner
            if (rBS > 0.5f) {
                val L = rBS * factor
                val c1 = 0.519f * (factor / 1.6f) * rBS
                val c2 = 0.054f * (s / 0.6f) * rBS
                val c3 = 0.518f * rBS
                val m = 0.293f * rBS

                lineTo(L, h)
                cubicTo(L - c1, h, rBS - c3, h - c2, m, h - m)
                cubicTo(c2, h - (rBS - c3), 0f, h - (L - c1), 0f, h - L)
            } else {
                lineTo(0f, h)
            }

            // 5. Left Edge back to Top-Left
            close()
        }

        return Outline.Generic(path)
    }
}

// Apple-style squircle design tokens
val SquircleLarge = ContinuousCornerShape(24.dp)
val SquircleMedium = ContinuousCornerShape(16.dp)
val SquircleSmall = ContinuousCornerShape(12.dp)
val SquirclePill = ContinuousCornerShape(9999.dp)
