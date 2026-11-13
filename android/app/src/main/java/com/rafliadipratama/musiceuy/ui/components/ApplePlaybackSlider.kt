package com.rafliadipratama.musiceuy.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.rafliadipratama.musiceuy.ui.theme.AccentEmerald

/**
 * Apple Music style static playback slider.
 * Replaces the animated squiggly wave line with a sleek, clean, high-precision
 * linear progress bar that causes zero CPU frame wakeups when idle.
 */
@Composable
fun ApplePlaybackSlider(
    value: Float,
    onValueChange: (Float) -> Unit,
    modifier: Modifier = Modifier,
    activeColor: Color = AccentEmerald,
    inactiveColor: Color = Color(0x33FFFFFF),
    trackHeight: Dp = 4.dp,
    thumbRadius: Dp = 6.dp,
    onValueChangeFinished: (() -> Unit)? = null,
) {
    var isDragging by remember { mutableStateOf(false) }
    var dragValue by remember { mutableFloatStateOf(value) }
    val displayValue = if (isDragging) dragValue else value

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Canvas(
            modifier = Modifier
                .fillMaxWidth()
                .height(24.dp)
                .pointerInput(Unit) {
                    detectTapGestures { offset ->
                        val newVal = (offset.x / size.width).coerceIn(0f, 1f)
                        onValueChange(newVal)
                        onValueChangeFinished?.invoke()
                    }
                }
                .pointerInput(Unit) {
                    detectDragGestures(
                        onDragStart = { isDragging = true },
                        onDragEnd = {
                            isDragging = false
                            onValueChange(dragValue)
                            onValueChangeFinished?.invoke()
                        },
                        onDragCancel = { isDragging = false },
                        onDrag = { change, _ ->
                            change.consume()
                            dragValue = (change.position.x / size.width).coerceIn(0f, 1f)
                            if (isDragging) onValueChange(dragValue)
                        }
                    )
                }
        ) {
            val w = size.width
            val cy = size.height / 2f
            val hPx = trackHeight.toPx()
            val thumbRPx = if (isDragging) (thumbRadius * 1.3f).toPx() else thumbRadius.toPx()
            val progressX = (displayValue * w).coerceIn(0f, w)

            // 1. Inactive background track
            drawLine(
                color = inactiveColor,
                start = Offset(0f, cy),
                end = Offset(w, cy),
                strokeWidth = hPx,
                cap = StrokeCap.Round
            )

            // 2. Active progress track
            if (progressX > 0f) {
                drawLine(
                    color = activeColor,
                    start = Offset(0f, cy),
                    end = Offset(progressX, cy),
                    strokeWidth = hPx,
                    cap = StrokeCap.Round
                )
            }

            // 3. Apple-style tactile thumb indicator while dragging
            if (isDragging) {
                drawCircle(
                    color = Color.White,
                    radius = thumbRPx,
                    center = Offset(progressX, cy)
                )
            }
        }
    }
}
