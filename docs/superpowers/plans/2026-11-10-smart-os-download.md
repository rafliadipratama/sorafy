# Smart OS Auto-Detect & 1-Click Direct Download Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide an intelligent, high-converting download experience across the SoraFy website that automatically detects the visitor's operating system (Windows, macOS, Linux, Android) and offers a direct 1-click download link to the exact installer file (.exe, .dmg, .AppImage, .apk) instead of bouncing users to the cluttered GitHub Release page.

**Architecture:**
1. A centralized download data repository (`website/src/data/downloads.ts`) containing verified asset URLs, filenames, versions, architectures, and fallback links.
2. A client-side platform detection utility with user-override memory and clean fallback logic.
3. An overhauled Hero Download Box (`website/src/components/HeroDownloadsBox.tsx`) featuring a prominent primary CTA button tailored to the visitor's OS, with one-click direct download and quick-switching platform pills.
4. An enhanced full Downloads section (`website/src/components/Downloads.tsx`) with direct asset URLs, SHA-256 checksum copy tools, and OS-specific setup guidance.

**Tech Stack:** Astro 5, React 18, Tailwind CSS v4, iconsax-react, TypeScript.

**Spec:** High-converting download funnel with zero user friction, eliminating GitHub Release navigation confusion.

## Global Constraints
- Target version: SoraFy v2.0.0.
- All direct download URLs must follow GitHub Releases standard format: `https://github.com/rafliadipratama/sorafy/releases/download/v2.0.0/<filename>` with fallback to `https://github.com/rafliadipratama/sorafy/releases/latest/download/<filename>`.
- Client-side OS detection must be SSR-safe (wrapped in `useEffect` or `typeof window !== 'undefined'`).
- Both English (`en`) and Indonesian (`id`) locales must be fully supported with natural phrasing.
- Mobile layout must remain 100% responsive and avoid horizontal overflows.

## Review Focus
1. User visits from Android smartphone: Hero button must offer Android APK directly instead of Windows .exe.
2. User visits from macOS Apple Silicon (M1-M4): Hero button must offer Apple Silicon DMG.
3. User visits from Linux: Hero button must offer Linux AppImage / deb.
4. User clicks direct download: Browser starts downloading the binary immediately without redirecting to GitHub release web UI.
5. User wants a different platform: Quick selector pills instantly change the download target without page reloads.

---

### Task 1: Create Centralized Download Data Module
**Files:**
- Create: `website/src/data/downloads.ts`
- Step: Define typed download metadata for Windows (.exe installer, .zip portable), Linux (.AppImage, .deb, .rpm), macOS (Apple Silicon .dmg, Intel .dmg), and Android (.apk). Include direct download URLs, file sizes, recommended architectures, and SHA-256 hashes.

### Task 2: Redesign HeroDownloadsBox Component with Smart Auto-Detection
**Files:**
- Modify: `website/src/components/HeroDownloadsBox.tsx`
- Step: Implement auto-detection hook on mount.
- Step: Render large, high-contrast Emerald primary CTA button with detected OS icon, direct download URL, version label, and file extension.
- Step: Render quick-switch platform pills directly underneath so users on dual-boot or downloading for other devices can switch OS with one click.
- Step: Add OS-specific trust tip (e.g., Windows SmartScreen guide or macOS quarantine command).

### Task 3: Overhaul Full Downloads Section with Direct Download Links & Checksums
**Files:**
- Modify: `website/src/components/Downloads.tsx`
- Step: Replace generic `releaseBase` links with exact direct asset URLs from `downloads.ts`.
- Step: Add 1-click "Copy SHA-256" checksum button on each package card.
- Step: Add secondary link to GitHub Release Archive for power users.

### Task 4: Update i18n Translations
**Files:**
- Modify: `website/src/i18n/ui.ts`
- Step: Add translation keys for direct download labels, platform detection badges, copy checksum toasts, and trust notes in both EN and ID.

### Task 5: Build Verification & Testing
**Files:**
- Run: `npm run build` in `website/` to verify zero TypeScript or Astro build errors.
- Verify: Inspect generated HTML to confirm SSR compatibility and correct hydration.
