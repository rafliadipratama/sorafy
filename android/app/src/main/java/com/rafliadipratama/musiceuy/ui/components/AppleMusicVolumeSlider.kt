package com.rafliadipratama.musiceuy.ui.components

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.media.AudioManager
import android.os.Build
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.clipRect
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.rafliadipratama.musiceuy.R
import kotlin.math.roundToInt

/**
 * Pure helper function to convert a volume fraction (0.0f - 1.0f) to AudioManager stream index.
 */
fun volumeRatioToIndex(ratio: Float, maxVolume: Int): Int {
    if (maxVolume <= 0) return 0
    val clampedRatio = ratio.coerceIn(0f, 1f)
    return (clampedRatio * maxVolume).roundToInt().coerceIn(0, maxVolume)
}

/**
 * Pure helper function to convert an AudioManager stream index to volume fraction (0.0f - 1.0f).
 */
fun volumeIndexToRatio(current: Int, maxVolume: Int): Float {
    if (maxVolume <= 0) return 0f
    val clampedCurrent = current.coerceIn(0, maxVolume)
    return (clampedCurrent.toFloat() / maxVolume.toFloat()).coerceIn(0f, 1f)
}

/**
 * Pure helper function to calculate fractional position from horizontal coordinate.
 */
fun calculateFractionFromOffset(x: Float, width: Float): Float {
    if (width <= 0f) return 0f
    return (x / width).coerceIn(0f, 1f)
}

/**
 * Apple Music style volume slider.
 * Features a sleek rounded capsule track with real-time hardware volume synchronization
 * via AudioManager and VOLUME_CHANGED_ACTION broadcast listener.
 */
@Composable
fun AppleMusicVolumeSlider(
    modifier: Modifier = Modifier,
    audioManager: AudioManager? = null
) {
    val context = LocalContext.current
    val actualAudioManager = audioManager ?: remember(context) {
        context.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
    }

    fun getSystemVolumeRatio(): Float {
        return actualAudioManager?.let { am ->
            val max = am.getStreamMaxVolume(AudioManager.STREAM_MUSIC)
            val curr = am.getStreamVolume(AudioManager.STREAM_MUSIC)
            volumeIndexToRatio(curr, max)
        } ?: 0.5f
    }

    var volumeRatio by remember { mutableFloatStateOf(getSystemVolumeRatio()) }
    var isDragging by remember { mutableStateOf(false) }
    var lastNonZeroRatio by remember { mutableFloatStateOf(if (volumeRatio > 0f) volumeRatio else 0.5f) }

    fun updateVolume(newRatio: Float) {
        val clamped = newRatio.coerceIn(0f, 1f)
        volumeRatio = clamped
        if (clamped > 0f) {
            lastNonZeroRatio = clamped
        }
        actualAudioManager?.let { am ->
            val max = am.getStreamMaxVolume(AudioManager.STREAM_MUSIC)
            val targetIndex = volumeRatioToIndex(clamped, max)
            try {
                am.setStreamVolume(AudioManager.STREAM_MUSIC, targetIndex, 0)
            } catch (_: Exception) {}
        }
    }

    DisposableEffect(context, actualAudioManager) {
        if (actualAudioManager != null) {
            volumeRatio = getSystemVolumeRatio()
        }
        val receiver = object : BroadcastReceiver() {
            override fun onReceive(c: Context?, intent: Intent?) {
                if (intent?.action == "android.media.VOLUME_CHANGED_ACTION") {
                    val streamTypeExtra = intent.getIntExtra("android.media.EXTRA_VOLUME_STREAM_TYPE", -1)
                    if (streamTypeExtra == -1 || streamTypeExtra == AudioManager.STREAM_MUSIC) {
                        if (!isDragging) {
                            volumeRatio = getSystemVolumeRatio()
                        }
                    }
                }
            }
        }
        val filter = IntentFilter("android.media.VOLUME_CHANGED_ACTION")
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                context.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED)
            } else {
                context.registerReceiver(receiver, filter)
            }
        } catch (_: Exception) {}

        onDispose {
            try {
                context.unregisterReceiver(receiver)
            } catch (_: Exception) {}
        }
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Left Icon: Volume Low / Mute
        IconButton(
            onClick = {
                val targetRatio = if (volumeRatio > 0.01f) {
                    lastNonZeroRatio = volumeRatio
                    0f
                } else {
                    if (lastNonZeroRatio > 0.05f) lastNonZeroRatio else 0.3f
                }
                updateVolume(targetRatio)
            },
            modifier = Modifier.size(36.dp)
        ) {
            Icon(
                painter = painterResource(id = R.drawable.ic_iconsax_volume_low_linear),
                contentDescription = "Mute or Volume Down",
                tint = Color.White.copy(alpha = 0.7f),
                modifier = Modifier.size(20.dp)
            )
        }

        // Apple Music style volume slider track
        Box(
            modifier = Modifier
                .weight(1f)
                .height(28.dp),
            contentAlignment = Alignment.Center
        ) {
            Canvas(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(28.dp)
                    .pointerInput(Unit) {
                        detectTapGestures { offset ->
                            val frac = calculateFractionFromOffset(offset.x, size.width.toFloat())
                            updateVolume(frac)
                        }
                    }
                    .pointerInput(Unit) {
                        detectDragGestures(
                            onDragStart = { isDragging = true },
                            onDragEnd = { isDragging = false },
                            onDragCancel = { isDragging = false },
                            onDrag = { change, _ ->
                                change.consume()
                                val frac = calculateFractionFromOffset(change.position.x, size.width.toFloat())
                                updateVolume(frac)
                            }
                        )
                    }
            ) {
                val w = size.width
                val cy = size.height / 2f
                val trackHeightPx = 5.dp.toPx()
                val radiusPx = trackHeightPx / 2f
                val activeWidth = (volumeRatio * w).coerceIn(0f, w)

                // 1. Inactive background track capsule
                drawRoundRect(
                    color = Color.White.copy(alpha = 0.15f),
                    topLeft = Offset(0f, cy - radiusPx),
                    size = Size(w, trackHeightPx),
                    cornerRadius = CornerRadius(radiusPx, radiusPx)
                )

                // 2. Active progress track capsule clipped
                if (activeWidth > 0f) {
                    clipRect(left = 0f, top = cy - radiusPx, right = activeWidth, bottom = cy + radiusPx) {
                        drawRoundRect(
                            color = Color.White.copy(alpha = 0.85f),
                            topLeft = Offset(0f, cy - radiusPx),
                            size = Size(w, trackHeightPx),
                            cornerRadius = CornerRadius(radiusPx, radiusPx)
                        )
                    }
                }

                // 3. Tactile thumb indicator while dragging
                if (isDragging) {
                    drawCircle(
                        color = Color.White,
                        radius = 6.dp.toPx(),
                        center = Offset(activeWidth, cy)
                    )
                }
            }
        }

        // Right Icon: Volume High / Max
        IconButton(
            onClick = {
                updateVolume(1f)
            },
            modifier = Modifier.size(36.dp)
        ) {
            Icon(
                painter = painterResource(id = R.drawable.ic_iconsax_volume_high_linear),
                contentDescription = "Maximum Volume",
                tint = Color.White.copy(alpha = 0.7f),
                modifier = Modifier.size(20.dp)
            )
        }
    }
}
