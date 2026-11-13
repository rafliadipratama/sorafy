package com.rafliadipratama.musiceuy.ui.player

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DownloadDone
import androidx.compose.material.icons.filled.MusicNote
import androidx.compose.material.icons.filled.Videocam
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rafliadipratama.musiceuy.R
import com.rafliadipratama.musiceuy.data.model.Track
import com.rafliadipratama.musiceuy.ui.components.ApplePlaybackSlider
import com.rafliadipratama.musiceuy.ui.components.AudioFormatBadge
import com.rafliadipratama.musiceuy.ui.components.ContinuousCornerShape
import com.rafliadipratama.musiceuy.ui.components.LikeBurst
import com.rafliadipratama.musiceuy.ui.theme.AccentEmerald
import com.rafliadipratama.musiceuy.ui.theme.DarkSurface
import com.rafliadipratama.musiceuy.ui.theme.TextMuted
import com.rafliadipratama.musiceuy.ui.theme.TextPrimary
import com.rafliadipratama.musiceuy.ui.theme.TextSecondary

@Composable
internal fun TrackInfoRow(
    track: Track,
    uiState: com.rafliadipratama.musiceuy.ui.viewmodel.PlayerUiState,
    onOpenArtist: () -> Unit,
    onToggleLike: () -> Unit,
    onDownload: () -> Unit,
    compact: Boolean = false,
    compactProgress: Float = if (compact) 1f else 0f,
    modifier: Modifier = Modifier
) {
    val isLiked = uiState.likedTrackIds.contains(track.id)
    val isDownloaded = uiState.downloadedTrackIds.contains(track.id)
    val downloadProgress = uiState.downloadingTrackIds[track.id]
    val isDownloading = downloadProgress != null

    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(
            modifier = Modifier.weight(1f),
            horizontalAlignment = Alignment.Start
        ) {
            Text(
                text = track.title,
                color = TextPrimary,
                fontSize = (20f - 4f * compactProgress).sp,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .clip(ContinuousCornerShape(6.dp))
                    .clickable(onClick = onOpenArtist)
                    .padding(vertical = 2.dp)
            ) {
                Text(
                    text = track.fullArtistDisplay,
                    color = TextSecondary,
                    fontSize = (15f - 2f * compactProgress).sp,
                    fontWeight = FontWeight.Medium,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                if (track.artist.isVerified || track.isVerified) {
                    Spacer(modifier = Modifier.width(6.dp))
                    Icon(
                        painter = painterResource(id = R.drawable.ic_iconsax_tick_circle_bold),
                        contentDescription = "Terverifikasi",
                        tint = AccentEmerald,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            if (!compact && uiState.audioFormatLabel.isNotBlank()) {
                Spacer(modifier = Modifier.height(4.dp))
                AudioFormatBadge(text = uiState.audioFormatLabel)
            }
        }

        Row(verticalAlignment = Alignment.CenterVertically) {
            // Iconsax Download Button
            IconButton(
                onClick = onDownload,
                enabled = !isDownloading && !isDownloaded,
                modifier = Modifier.size(42.dp)
            ) {
                if (isDownloading) {
                    CircularProgressIndicator(
                        progress = { downloadProgress ?: 0f },
                        modifier = Modifier.size(20.dp),
                        color = AccentEmerald,
                        strokeWidth = 2.dp
                    )
                } else if (isDownloaded) {
                    Icon(
                        imageVector = Icons.Default.DownloadDone,
                        contentDescription = "Telah Diunduh",
                        tint = AccentEmerald,
                        modifier = Modifier.size(22.dp)
                    )
                } else {
                    Icon(
                        painter = painterResource(id = R.drawable.ic_iconsax_document_download_linear),
                        contentDescription = "Unduh Lagu",
                        tint = TextSecondary,
                        modifier = Modifier.size(22.dp)
                    )
                }
            }

            // Iconsax Like Button with Heart
            LikeBurst(trigger = isLiked, key = track.id, modifier = Modifier.size(42.dp)) {
                IconButton(
                    onClick = onToggleLike,
                    modifier = Modifier.size(42.dp)
                ) {
                    Icon(
                        painter = painterResource(id = if (isLiked) R.drawable.ic_iconsax_heart_bold else R.drawable.ic_iconsax_heart_linear),
                        contentDescription = if (isLiked) "Hapus dari Favorit" else "Sukai",
                        tint = if (isLiked) Color(0xFFFF2D55) else TextSecondary,
                        modifier = Modifier.size(24.dp)
                    )
                }
            }
        }
    }
}

@Composable
internal fun PlaybackSeekbar(
    currentMs: Long,
    durationMs: Long,
    isUserSeeking: Boolean,
    seekProgress: Float,
    isPlaying: Boolean = false,
    onSeekChange: (Float) -> Unit,
    onSeekFinished: () -> Unit
) {
    val sliderValue = if (durationMs > 0) (currentMs.toFloat() / durationMs.toFloat()).coerceIn(0f, 1f) else 0f

    Column(modifier = Modifier.fillMaxWidth()) {
        // Clean static Apple Music slider (no wavy animation)
        ApplePlaybackSlider(
            value = if (isUserSeeking) seekProgress else sliderValue,
            onValueChange = onSeekChange,
            onValueChangeFinished = onSeekFinished,
            activeColor = AccentEmerald,
            inactiveColor = Color(0x33FFFFFF),
            modifier = Modifier.fillMaxWidth()
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = formatMs(currentMs),
                color = TextMuted,
                fontSize = 12.sp
            )
            val remainingMs = (durationMs - currentMs).coerceAtLeast(0L)
            Text(
                text = "-" + formatMs(remainingMs),
                color = TextMuted,
                fontSize = 12.sp
            )
        }
    }
}

@Composable
internal fun PrimaryControlsRow(
    isPlaying: Boolean,
    playButtonSize: androidx.compose.ui.unit.Dp = 66.dp,
    playIconSize: androidx.compose.ui.unit.Dp = 30.dp,
    onPrevious: () -> Unit,
    onTogglePlayPause: () -> Unit,
    onNext: () -> Unit,
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Spacer(Modifier.size(24.dp))

        // Iconsax Previous
        IconButton(onClick = onPrevious, modifier = Modifier.size(46.dp)) {
            Icon(
                painter = painterResource(id = R.drawable.ic_iconsax_previous_bold),
                contentDescription = "Sebelumnya",
                tint = TextPrimary,
                modifier = Modifier.size(28.dp)
            )
        }

        // Iconsax Play / Pause (Large Center Button)
        Box(
            modifier = Modifier
                .size(playButtonSize)
                .clip(CircleShape)
                .background(AccentEmerald)
                .clickable(onClick = onTogglePlayPause),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                painter = painterResource(id = if (isPlaying) R.drawable.ic_iconsax_pause_bold else R.drawable.ic_iconsax_play_bold),
                contentDescription = "Play/Pause",
                tint = Color.Black,
                modifier = Modifier.size(playIconSize)
            )
        }

        // Iconsax Next
        IconButton(onClick = onNext, modifier = Modifier.size(46.dp)) {
            Icon(
                painter = painterResource(id = R.drawable.ic_iconsax_next_bold),
                contentDescription = "Berikutnya",
                tint = TextPrimary,
                modifier = Modifier.size(28.dp)
            )
        }

        Spacer(Modifier.size(24.dp))
    }
}

@Composable
internal fun BottomUtilityRow(
    isLyricsVisible: Boolean,
    isQueueVisible: Boolean,
    onToggleLyrics: () -> Unit,
    onToggleQueue: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Iconsax Lyrics Button
        IconButton(
            onClick = onToggleLyrics,
            modifier = Modifier.size(48.dp)
        ) {
            Icon(
                painter = painterResource(id = R.drawable.ic_iconsax_microphone_2_linear),
                contentDescription = "Lirik",
                tint = if (isLyricsVisible) AccentEmerald else TextSecondary,
                modifier = Modifier.size(22.dp)
            )
        }

        // Iconsax Queue Button
        IconButton(
            onClick = onToggleQueue,
            modifier = Modifier.size(48.dp).semantics { selected = isQueueVisible }
        ) {
            Icon(
                painter = painterResource(id = R.drawable.ic_iconsax_music_playlist_linear),
                contentDescription = if (isQueueVisible) "Tutup antrean" else "Buka antrean dan mode pemutaran",
                tint = if (isQueueVisible) AccentEmerald else TextSecondary,
                modifier = Modifier.size(22.dp)
            )
        }
    }
}

private fun formatMs(ms: Long): String {
    val totalSeconds = (ms / 1000).coerceAtLeast(0)
    val minutes = totalSeconds / 60
    val seconds = totalSeconds % 60
    return String.format("%02d:%02d", minutes, seconds)
}

@Composable
internal fun AudioVideoToggleSwitch(
    isVideoMode: Boolean,
    onToggle: (Boolean) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .clip(ContinuousCornerShape(20.dp))
            .background(Color.White.copy(alpha = 0.10f))
            .border(0.5.dp, Color.White.copy(alpha = 0.08f), ContinuousCornerShape(20.dp))
            .padding(3.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Option 1: Audio / Lagu
        val audioBg = if (!isVideoMode) Color.White.copy(alpha = 0.22f) else Color.Transparent
        val audioTint = if (!isVideoMode) Color.White else TextMuted
        Row(
            modifier = Modifier
                .clip(ContinuousCornerShape(16.dp))
                .background(audioBg)
                .clickable { onToggle(false) }
                .padding(horizontal = 14.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = Icons.Default.MusicNote,
                contentDescription = "Audio",
                tint = audioTint,
                modifier = Modifier.size(15.dp)
            )
            Spacer(modifier = Modifier.width(5.dp))
            Text(
                text = "Lagu",
                color = audioTint,
                fontSize = 12.sp,
                fontWeight = if (!isVideoMode) FontWeight.Bold else FontWeight.Medium
            )
        }

        // Option 2: Video
        val videoBg = if (isVideoMode) AccentEmerald.copy(alpha = 0.35f) else Color.Transparent
        val videoTint = if (isVideoMode) Color.White else TextMuted
        Row(
            modifier = Modifier
                .clip(ContinuousCornerShape(16.dp))
                .background(videoBg)
                .clickable { onToggle(true) }
                .padding(horizontal = 14.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = Icons.Default.Videocam,
                contentDescription = "Video",
                tint = videoTint,
                modifier = Modifier.size(15.dp)
            )
            Spacer(modifier = Modifier.width(5.dp))
            Text(
                text = "Video",
                color = videoTint,
                fontSize = 12.sp,
                fontWeight = if (isVideoMode) FontWeight.Bold else FontWeight.Medium
            )
        }
    }
}
