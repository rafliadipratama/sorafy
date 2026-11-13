package com.rafliadipratama.musiceuy.ui.theme

import androidx.compose.ui.graphics.Color

// Official SoraFy Design Tokens (Apple Music inspired Obsidian & Emerald)
val ObsidianVoid = Color(0xFF0B0D10) // Primary Deep Background
val SlateSurface = Color(0xFF141820) // Surface Containers & Glass Foundation
val PrianganEmerald = Color(0xFF00E599) // Primary Brand Accent (Clean SoraFy Emerald)
val ElectricLime = Color(0xFF00E599) // Harmonized with Emerald, removing harsh neon lime

// Extended Surface Levels
val ObsidianBackground = ObsidianVoid
val SurfaceContainerLowest = Color(0xFF07080A)
val SurfaceContainerLow = Color(0xFF0F1217)
val SurfaceContainer = SlateSurface
val SurfaceContainerHigh = Color(0xFF1C222C)
val SurfaceContainerHighest = Color(0xFF262D3B)

// Apple-style Liquid Glass Design Tokens
val LiquidGlassBase = Color(0x66141820) // 40% alpha Obsidian Glass
val LiquidGlassSurface = Color(0xCC12161F) // 80% alpha Floating Player Glass
val LiquidGlassBorder = Color(0x2EFFFFFF) // 18% alpha Hairline Glass Rim
val LiquidGlassBorderSubtle = Color(0x0DFFFFFF) // 5% alpha Lower Glass Rim
val LiquidGlassHighlight = Color(0x18FFFFFF) // Top Specular Reflection Sheen

// Brand Accents
val BrandGreen = PrianganEmerald
val BrandGreenBright = PrianganEmerald
val BrandGreenSecondary = Color(0xFF00C782)
val BrandGreenDeep = Color(0xFF007A50)

// Clean Typography Tokens
val TextPrimary = Color(0xFFF8FAFC)
val TextSecondary = Color(0xFF94A3B8)
val TextMuted = Color(0xFF64748B)
val VerifiedBadge = PrianganEmerald

// Aliases for backwards compatibility
val DarkBackground = ObsidianVoid
val DarkSurface = SlateSurface
val DarkSurfaceVariant = SurfaceContainerHigh
val AccentEmerald = PrianganEmerald
val AccentPurple = PrianganEmerald
