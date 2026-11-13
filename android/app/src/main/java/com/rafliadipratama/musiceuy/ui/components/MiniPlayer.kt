package com.rafliadipratama.musiceuy.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.rafliadipratama.musiceuy.R
import com.rafliadipratama.musiceuy.data.model.Track
import com.rafliadipratama.musiceuy.ui.theme.AccentEmerald
import com.rafliadipratama.musiceuy.ui.theme.LiquidGlassSurface
import com.rafliadipratama.musiceuy.ui.theme.TextPrimary
import com.rafliadipratama.musiceuy.ui.theme.TextSecondary

@Composable
fun MiniPlayer(
    track: Track,
    isPlaying: Boolean,
    currentPosMs: Long,
    durationMs: Long,
    dominantColor: Long? = null,
    onPlayPause: () -> Unit,
    onNext: () -> Unit,
    onQueueClick: () -> Unit = {},
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val progress = if (durationMs > 0) (currentPosMs.toFloat() / durationMs.toFloat()).coerceIn(0f, 1f) else 0f
    val playerShape = ContinuousCornerShape(18.dp)

    Box(
        modifier = modifier
            .fillMaxWidth()
            .liquidGlass(
                shape = playerShape,
                backgroundColor = LiquidGlassSurface,
                tintColor = dominantColor?.let { Color(it.toInt()) }
            )
    ) {
        Column {
            // Subtle progress indicator at the top rim of the glass sheet
            LinearProgressIndicator(
                progress = { progress },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(2.dp),
                color = AccentEmerald,
                trackColor = Color(0x18FFFFFF)
            )

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 7.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Tappable song info area that opens PlayerScreen
                Row(
                    modifier = Modifier
                        .weight(1f)
                        .clip(ContinuousCornerShape(10.dp))
                        .pressBounce(pressedScale = 0.98f)
                        .clickable(onClick = onClick)
                        .padding(vertical = 2.dp, horizontal = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Artwork with Apple G2 continuous squircle
                    AsyncImage(
                        model = track.coverUrl,
                        contentDescription = track.title,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .size(46.dp)
                            .clip(ContinuousCornerShape(10.dp))
                    )

                    Spacer(modifier = Modifier.width(10.dp))

                    // Track details
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = track.title,
                            color = TextPrimary,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.SemiBold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = track.fullArtistDisplay,
                                color = TextSecondary,
                                fontSize = 12.sp,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            if (track.artist.isVerified || track.isVerified) {
                                Spacer(modifier = Modifier.width(4.dp))
                                Icon(
                                    painter = painterResource(id = R.drawable.ic_iconsax_tick_circle_bold),
                                    contentDescription = "Verified",
                                    tint = AccentEmerald,
                                    modifier = Modifier.size(13.dp)
                                )
                            }
                        }
                    }
                }

                // Dedicated Controls with tactile spring feedback & Iconsax icons
                IconButton(
                    onClick = onQueueClick,
                    modifier = Modifier
                        .size(38.dp)
                        .pressBounce(pressedScale = 0.85f)
                ) {
                    Icon(
                        painter = painterResource(id = R.drawable.ic_iconsax_music_playlist_linear),
                        contentDescription = "Antrean Musik",
                        tint = TextSecondary,
                        modifier = Modifier.size(20.dp)
                    )
                }

                IconButton(
                    onClick = onPlayPause,
                    modifier = Modifier
                        .size(42.dp)
                        .pressBounce(pressedScale = 0.85f)
                ) {
                    Icon(
                        painter = painterResource(id = if (isPlaying) R.drawable.ic_iconsax_pause_bold else R.drawable.ic_iconsax_play_bold),
                        contentDescription = "Play/Pause",
                        tint = AccentEmerald,
                        modifier = Modifier.size(24.dp)
                    )
                }

                IconButton(
                    onClick = onNext,
                    modifier = Modifier
                        .size(38.dp)
                        .pressBounce(pressedScale = 0.85f)
                ) {
                    Icon(
                        painter = painterResource(id = R.drawable.ic_iconsax_next_bold),
                        contentDescription = "Next",
                        tint = TextSecondary,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }
    }
}
