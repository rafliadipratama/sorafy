package com.rafliadipratama.musiceuy.ui.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForwardIos
import androidx.compose.material.icons.automirrored.filled.VolumeUp
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Cached
import androidx.compose.material.icons.filled.Extension
import androidx.compose.material.icons.filled.GraphicEq
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.rafliadipratama.musiceuy.R
import com.rafliadipratama.musiceuy.audio.AudioEffectManager
import com.rafliadipratama.musiceuy.audio.CrossmixEngine
import com.rafliadipratama.musiceuy.audio.CrossmixStyle
import com.rafliadipratama.musiceuy.ui.components.ContinuousCornerShape
import com.rafliadipratama.musiceuy.ui.components.pressBounce
import com.rafliadipratama.musiceuy.ui.theme.BrandGreen
import com.rafliadipratama.musiceuy.ui.theme.BrandGreenBright
import com.rafliadipratama.musiceuy.ui.theme.ObsidianBackground
import com.rafliadipratama.musiceuy.ui.theme.SurfaceContainer
import com.rafliadipratama.musiceuy.ui.theme.SurfaceContainerHigh
import com.rafliadipratama.musiceuy.ui.theme.TextMuted
import com.rafliadipratama.musiceuy.ui.theme.TextPrimary
import com.rafliadipratama.musiceuy.ui.theme.TextSecondary
import com.rafliadipratama.musiceuy.ui.viewmodel.MusicPlayerViewModel
import java.util.Locale

@Composable
fun SettingsScreen(
    viewModel: MusicPlayerViewModel,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    val plugins by viewModel.pluginManager.plugins.collectAsState()
    val audioEffectState by AudioEffectManager.state.collectAsState()
    val context = LocalContext.current

    var selectedCrossmix by remember { mutableStateOf(CrossmixEngine.currentStyle) }
    var showAddPluginDialog by remember { mutableStateOf(false) }

    var newPluginName by remember { mutableStateOf("") }
    var newPluginDesc by remember { mutableStateOf("") }
    var newPluginUrl by remember { mutableStateOf("") }

    val activeCount = plugins.count { it.isEnabled }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(ObsidianBackground)
    ) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp),
            contentPadding = PaddingValues(top = 16.dp, bottom = 180.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Screen Header
            item {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(ContinuousCornerShape(14.dp))
                            .background(BrandGreen.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            painter = painterResource(id = R.drawable.ic_iconsax_setting_2_bold),
                            contentDescription = "Settings",
                            tint = BrandGreen,
                            modifier = Modifier.size(24.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(14.dp))

                    Column {
                        Text(
                            text = "Settings",
                            color = TextPrimary,
                            fontSize = 24.sp,
                            fontWeight = FontWeight.ExtraBold,
                            letterSpacing = (-0.5).sp
                        )
                        Text(
                            text = "Audio engine, extensions & preferences",
                            color = TextSecondary,
                            fontSize = 12.5.sp
                        )
                    }
                }
            }

            // ==================== SECTION 1: Audio & Playback ====================
            item {
                Text(
                    text = "Audio & Playback",
                    color = TextPrimary,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(top = 8.dp, bottom = 2.dp)
                )
            }

            item {
                Card(
                    shape = ContinuousCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = SurfaceContainerHigh),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        // Crossmix Transition Header
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(Color(0xFF00C9FF).copy(alpha = 0.15f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Speed,
                                    contentDescription = null,
                                    tint = Color(0xFF00C9FF),
                                    modifier = Modifier.size(20.dp)
                                )
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column {
                                Text(
                                    text = "Crossmix Transitions",
                                    color = TextPrimary,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.SemiBold
                                )
                                Text(
                                    text = "Active: ${selectedCrossmix.displayName}",
                                    color = Color(0xFF00C9FF),
                                    fontSize = 12.sp
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Crossmix Style Selector Chips
                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            items(CrossmixStyle.entries) { style ->
                                val isSelected = selectedCrossmix == style
                                Box(
                                    modifier = Modifier
                                        .clip(ContinuousCornerShape(12.dp))
                                        .background(if (isSelected) Color(0xFF00C9FF) else SurfaceContainer)
                                        .pressBounce(pressedScale = 0.92f)
                                        .clickable {
                                            selectedCrossmix = style
                                            CrossmixEngine.currentStyle = style
                                            Toast.makeText(context, "Transition: ${style.displayName}", Toast.LENGTH_SHORT).show()
                                        }
                                        .padding(horizontal = 14.dp, vertical = 8.dp)
                                ) {
                                    Text(
                                        text = style.displayName,
                                        color = if (isSelected) Color(0xFF0C0E11) else TextSecondary,
                                        fontSize = 12.sp,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Equalizer Shortcut Row
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(ContinuousCornerShape(14.dp))
                                .background(SurfaceContainer)
                                .pressBounce(pressedScale = 0.95f)
                                .clickable { viewModel.showEqualizer() }
                                .padding(horizontal = 14.dp, vertical = 12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(34.dp)
                                        .clip(CircleShape)
                                        .background(BrandGreen.copy(alpha = 0.15f)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.GraphicEq,
                                        contentDescription = null,
                                        tint = BrandGreen,
                                        modifier = Modifier.size(18.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.width(12.dp))

                                Column {
                                    Text(
                                        text = "Equalizer",
                                        color = TextPrimary,
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                    Text(
                                        text = "5-band DSP, bass boost & virtualizer",
                                        color = TextMuted,
                                        fontSize = 11.5.sp
                                    )
                                }
                            }

                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.ArrowForwardIos,
                                contentDescription = "Open",
                                tint = TextMuted,
                                modifier = Modifier.size(14.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // ReplayGain Normalization Toggle
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(ContinuousCornerShape(14.dp))
                                .background(SurfaceContainer)
                                .padding(horizontal = 14.dp, vertical = 12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                modifier = Modifier.weight(1f),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(34.dp)
                                        .clip(CircleShape)
                                        .background(Color(0xFFFF9800).copy(alpha = 0.15f)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.AutoMirrored.Filled.VolumeUp,
                                        contentDescription = null,
                                        tint = Color(0xFFFF9800),
                                        modifier = Modifier.size(18.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.width(12.dp))

                                Column {
                                    Text(
                                        text = "ReplayGain Normalization",
                                        color = TextPrimary,
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                    Text(
                                        text = "Auto volume leveling (-14 LUFS target)",
                                        color = TextMuted,
                                        fontSize = 11.5.sp
                                    )
                                }
                            }

                            Switch(
                                checked = audioEffectState.isLoudnessEnabled,
                                onCheckedChange = { isChecked ->
                                    AudioEffectManager.toggleLoudness(context, isChecked)
                                },
                                colors = SwitchDefaults.colors(
                                    checkedThumbColor = Color(0xFF0C0E11),
                                    checkedTrackColor = BrandGreen,
                                    uncheckedThumbColor = TextMuted,
                                    uncheckedTrackColor = SurfaceContainerHigh
                                )
                            )
                        }
                    }
                }
            }

            // ==================== SECTION 2: Plugins & Extensions ====================
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 10.dp, bottom = 2.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "Plugins & Extensions",
                            color = TextPrimary,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "$activeCount of ${plugins.size} active plugins",
                            color = BrandGreenBright,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }

                    Button(
                        onClick = { showAddPluginDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = BrandGreen),
                        shape = ContinuousCornerShape(10.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Add Plugin",
                            tint = Color(0xFF0C0E11),
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "Add Plugin",
                            color = Color(0xFF0C0E11),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            // List of Plugins
            items(plugins, key = { it.id }) { plugin ->
                PluginCard(
                    plugin = plugin,
                    onToggle = { isChecked ->
                        viewModel.pluginManager.togglePlugin(plugin.id, isChecked)
                    }
                )
            }

            // ==================== SECTION 3: Preferences ====================
            item {
                Text(
                    text = "Preferences",
                    color = TextPrimary,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(top = 10.dp, bottom = 2.dp)
                )
            }

            item {
                Card(
                    shape = ContinuousCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = SurfaceContainerHigh),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        // Language Selector
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(ContinuousCornerShape(14.dp))
                                .background(SurfaceContainer)
                                .pressBounce(pressedScale = 0.95f)
                                .clickable { viewModel.showLanguageDialog() }
                                .padding(horizontal = 14.dp, vertical = 12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(34.dp)
                                        .clip(CircleShape)
                                        .background(Color(0xFF38EF7D).copy(alpha = 0.15f)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Language,
                                        contentDescription = null,
                                        tint = Color(0xFF38EF7D),
                                        modifier = Modifier.size(18.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.width(12.dp))

                                Column {
                                    Text(
                                        text = "Language",
                                        color = TextPrimary,
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                    val langDisplayName = when (uiState.currentLanguageCode) {
                                        "id" -> "Bahasa Indonesia"
                                        "ja" -> "日本語 (Japanese)"
                                        else -> "English"
                                    }
                                    Text(
                                        text = langDisplayName,
                                        color = TextMuted,
                                        fontSize = 11.5.sp
                                    )
                                }
                            }

                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.ArrowForwardIos,
                                contentDescription = "Select Language",
                                tint = TextMuted,
                                modifier = Modifier.size(14.dp)
                            )
                        }

                        // Clear Cache Button
                        val cacheSizeFormatted = remember(uiState.audioCacheSizeBytes) {
                            val bytes = uiState.audioCacheSizeBytes
                            if (bytes <= 0) "0.0 MB"
                            else String.format(Locale.US, "%.1f MB", bytes / (1024.0 * 1024.0))
                        }

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(ContinuousCornerShape(14.dp))
                                .background(SurfaceContainer)
                                .pressBounce(pressedScale = 0.95f)
                                .clickable { viewModel.clearAppCache() }
                                .padding(horizontal = 14.dp, vertical = 12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(34.dp)
                                        .clip(CircleShape)
                                        .background(Color(0xFFFF5252).copy(alpha = 0.15f)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Cached,
                                        contentDescription = null,
                                        tint = Color(0xFFFF5252),
                                        modifier = Modifier.size(18.dp)
                                    )
                                }

                                Spacer(modifier = Modifier.width(12.dp))

                                Column {
                                    Text(
                                        text = "Clear Audio Cache",
                                        color = TextPrimary,
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                    Text(
                                        text = "Used: $cacheSizeFormatted",
                                        color = TextMuted,
                                        fontSize = 11.5.sp
                                    )
                                }
                            }

                            Box(
                                modifier = Modifier
                                    .clip(ContinuousCornerShape(8.dp))
                                    .background(Color(0xFFFF5252).copy(alpha = 0.12f))
                                    .padding(horizontal = 10.dp, vertical = 5.dp)
                            ) {
                                Text(
                                    text = "Clear",
                                    color = Color(0xFFFF5252),
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }

            // App Version Badge
            item {
                Spacer(modifier = Modifier.height(10.dp))
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Box(
                            modifier = Modifier
                                .clip(ContinuousCornerShape(20.dp))
                                .background(SurfaceContainerHigh)
                                .border(
                                    width = 1.dp,
                                    color = BrandGreen.copy(alpha = 0.3f),
                                    shape = ContinuousCornerShape(20.dp)
                                )
                                .padding(horizontal = 16.dp, vertical = 8.dp)
                        ) {
                            Text(
                                text = "SoraFy Mobile v2.0 - BitChord Edition",
                                color = BrandGreenBright,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.3.sp
                            )
                        }

                        Spacer(modifier = Modifier.height(6.dp))

                        Text(
                            text = "Next-Gen Modular Audio Architecture",
                            color = TextMuted,
                            fontSize = 11.sp
                        )
                    }
                }
            }
        }

        // Add Custom Plugin Dialog
        if (showAddPluginDialog) {
            AlertDialog(
                onDismissRequest = { showAddPluginDialog = false },
                containerColor = SurfaceContainerHigh,
                shape = ContinuousCornerShape(18.dp),
                title = {
                    Text(
                        text = "Add Custom Plugin",
                        color = TextPrimary,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text(
                            text = "Enter metadata for an external audio resolver (Audion / Spotube resolver format compatible):",
                            color = TextSecondary,
                            fontSize = 12.sp
                        )

                        OutlinedTextField(
                            value = newPluginName,
                            onValueChange = { newPluginName = it },
                            label = { Text("Plugin Name (e.g. SoundCloud / Web Stream)") },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = BrandGreen,
                                focusedLabelColor = BrandGreen,
                                cursorColor = BrandGreen,
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary
                            ),
                            modifier = Modifier.fillMaxWidth()
                        )

                        OutlinedTextField(
                            value = newPluginDesc,
                            onValueChange = { newPluginDesc = it },
                            label = { Text("Short Description") },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = BrandGreen,
                                focusedLabelColor = BrandGreen,
                                cursorColor = BrandGreen,
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary
                            ),
                            modifier = Modifier.fillMaxWidth()
                        )

                        OutlinedTextField(
                            value = newPluginUrl,
                            onValueChange = { newPluginUrl = it },
                            label = { Text("Endpoint URL / Manifest") },
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = BrandGreen,
                                focusedLabelColor = BrandGreen,
                                cursorColor = BrandGreen,
                                focusedTextColor = TextPrimary,
                                unfocusedTextColor = TextPrimary
                            ),
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            if (newPluginName.isNotBlank()) {
                                viewModel.pluginManager.registerCustomPlugin(
                                    name = newPluginName.trim(),
                                    description = newPluginDesc.ifBlank { "External custom audio plugin" },
                                    endpointUrl = newPluginUrl.trim()
                                )
                                newPluginName = ""
                                newPluginDesc = ""
                                newPluginUrl = ""
                                showAddPluginDialog = false
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = BrandGreen),
                        shape = ContinuousCornerShape(10.dp)
                    ) {
                        Text("Install Plugin", color = Color(0xFF0C0E11), fontWeight = FontWeight.Bold)
                    }
                },
                dismissButton = {
                    OutlinedButton(
                        onClick = { showAddPluginDialog = false },
                        shape = ContinuousCornerShape(10.dp)
                    ) {
                        Text("Cancel", color = TextSecondary)
                    }
                }
            )
        }
    }
}
