import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface Props {
  lang: 'en' | 'id';
  eyebrow: string;
  title: string;
  desc: string;
  recommendedText: string;
  universalText: string;
}

export default function Downloads({
  lang,
  eyebrow,
  title,
  desc,
  recommendedText,
  universalText,
}: Props) {
  const [platform, setPlatform] = useState<'windows' | 'linux' | 'macos' | 'android'>('linux');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent.toLowerCase();
    const plat = (navigator.platform || '').toLowerCase();

    if (ua.includes('android')) setPlatform('android');
    else if (ua.includes('iphone') || ua.includes('ipad') || plat.includes('mac') || ua.includes('macintosh')) setPlatform('macos');
    else if (plat.includes('win') || ua.includes('windows')) setPlatform('windows');
    else if (plat.includes('linux') || ua.includes('linux')) setPlatform('linux');
  }, []);

  const releaseBase = "https://github.com/rafliadipratama/sorafy/releases/latest";

  return (
    <section className="py-24 border-t border-subtle" id="downloads">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00E599] inline-block mb-3">
            {eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-neutral-400 text-base leading-relaxed">
            {desc}
          </p>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2 bg-surface border border-subtle p-1.5 rounded-xl flex-wrap justify-center">
            <button
              type="button"
              onClick={() => setPlatform('windows')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                platform === 'windows'
                  ? 'bg-surface-elevated text-[#00E599] border border-[#00E599]/30 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Windows</span>
            </button>

            <button
              type="button"
              onClick={() => setPlatform('linux')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                platform === 'linux'
                  ? 'bg-surface-elevated text-[#00E599] border border-[#00E599]/30 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Linux</span>
            </button>

            <button
              type="button"
              onClick={() => setPlatform('macos')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                platform === 'macos'
                  ? 'bg-surface-elevated text-[#00E599] border border-[#00E599]/30 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>macOS</span>
            </button>

            <button
              type="button"
              onClick={() => setPlatform('android')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                platform === 'android'
                  ? 'bg-surface-elevated text-[#00E599] border border-[#00E599]/30 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Android</span>
            </button>
          </div>
        </div>

        {/* Content Panes */}
        <div className="max-w-3xl mx-auto">
          {/* Windows Pane */}
          {platform === 'windows' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-surface border border-[#00E599]/30 rounded-2xl p-7 flex flex-col justify-between gap-5 relative">
                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-subtle border border-emerald-subtle text-[#00E599]">
                  {recommendedText}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">SoraFy for Windows (.exe)</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Standard Windows installer with desktop shortcuts, auto-updater, and start menu integration.
                  </p>
                  <div className="mt-4 pt-3 border-t border-subtle flex flex-col gap-1 text-[11px] font-mono-code text-neutral-500">
                    <span>Version: 2.0.0</span>
                    <span>Windows 10 / 11 (64-bit)</span>
                  </div>
                </div>
                <a
                  href={releaseBase}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#00E599] hover:bg-[#00B377] text-neutral-950 font-bold text-sm py-3 rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Installer (.exe)</span>
                </a>
              </div>

              <div className="bg-surface border border-subtle hover:border-medium rounded-2xl p-7 flex flex-col justify-between gap-5">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Windows Portable (.zip)</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    No installation required. Extract anywhere and launch immediately from flash drives or external disks.
                  </p>
                  <div className="mt-4 pt-3 border-t border-subtle flex flex-col gap-1 text-[11px] font-mono-code text-neutral-500">
                    <span>Version: 2.0.0</span>
                    <span>Standalone Portable</span>
                  </div>
                </div>
                <a
                  href={releaseBase}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-surface-elevated hover:bg-surface-subtle border border-subtle hover:border-medium text-white font-semibold text-sm py-3 rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Portable (.zip)</span>
                </a>
              </div>
            </div>
          )}

          {/* Linux Pane */}
          {platform === 'linux' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-surface border border-[#00E599]/30 rounded-2xl p-7 flex flex-col justify-between gap-5 relative">
                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-subtle border border-emerald-subtle text-[#00E599]">
                  {universalText}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">AppImage Package</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Self-contained executable for Ubuntu, Fedora, Arch, Debian, openSUSE, and any standard Linux distribution.
                  </p>
                  <div className="mt-4 pt-3 border-t border-subtle flex flex-col gap-1 text-[11px] font-mono-code text-neutral-500">
                    <span>Executable AppImage</span>
                    <span>glibc 2.31+</span>
                  </div>
                </div>
                <a
                  href={releaseBase}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#00E599] hover:bg-[#00B377] text-neutral-950 font-bold text-sm py-3 rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download AppImage</span>
                </a>
              </div>

              <div className="bg-surface border border-subtle hover:border-medium rounded-2xl p-7 flex flex-col justify-between gap-5">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Debian / Ubuntu (.deb)</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Native package for Debian, Ubuntu, Linux Mint, and Pop!_OS with system package manager integration.
                  </p>
                  <div className="mt-4 pt-3 border-t border-subtle flex flex-col gap-1 text-[11px] font-mono-code text-neutral-500">
                    <span>Native .deb</span>
                    <span>Apt compatible</span>
                  </div>
                </div>
                <a
                  href={releaseBase}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-surface-elevated hover:bg-surface-subtle border border-subtle hover:border-medium text-white font-semibold text-sm py-3 rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .deb Package</span>
                </a>
              </div>
            </div>
          )}

          {/* macOS Pane */}
          {platform === 'macos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-surface border border-[#00E599]/30 rounded-2xl p-7 flex flex-col justify-between gap-5 relative">
                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-subtle border border-emerald-subtle text-[#00E599]">
                  Apple Silicon
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">macOS (Apple Silicon M1-M4)</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Native ARM64 DMG bundle optimized for Apple Silicon MacBooks, Mac mini, and Mac Studio.
                  </p>
                  <div className="mt-4 pt-3 border-t border-subtle flex flex-col gap-1 text-[11px] font-mono-code text-neutral-500">
                    <span>macOS 12.0 Monterey or later</span>
                    <span>Native ARM64</span>
                  </div>
                </div>
                <a
                  href={releaseBase}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#00E599] hover:bg-[#00B377] text-neutral-950 font-bold text-sm py-3 rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Apple Silicon DMG</span>
                </a>
              </div>

              <div className="bg-surface border border-subtle hover:border-medium rounded-2xl p-7 flex flex-col justify-between gap-5">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">macOS Intel (.dmg)</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Standard x86_64 DMG package for Intel-powered Apple Mac computers.
                  </p>
                  <div className="mt-4 pt-3 border-t border-subtle flex flex-col gap-1 text-[11px] font-mono-code text-neutral-500">
                    <span>macOS 11.0 Big Sur or later</span>
                    <span>Intel x86_64</span>
                  </div>
                </div>
                <a
                  href={releaseBase}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-surface-elevated hover:bg-surface-subtle border border-subtle hover:border-medium text-white font-semibold text-sm py-3 rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Intel DMG</span>
                </a>
              </div>
            </div>
          )}

          {/* Android Pane */}
          {platform === 'android' && (
            <div className="max-w-md mx-auto">
              <div className="bg-surface border border-[#00E599]/30 rounded-2xl p-7 flex flex-col justify-between gap-5 relative">
                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-subtle border border-emerald-subtle text-[#00E599]">
                  Jetpack Compose Native
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">SoraFy for Android (.apk)</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Built with Jetpack Compose Material 3 and Media3 audio notification controls for phones and tablets.
                  </p>
                  <div className="mt-4 pt-3 border-t border-subtle flex flex-col gap-1 text-[11px] font-mono-code text-neutral-500">
                    <span>Android 8.0 Oreo or later</span>
                    <span>arm64-v8a</span>
                  </div>
                </div>
                <a
                  href={releaseBase}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#00E599] hover:bg-[#00B377] text-neutral-950 font-bold text-sm py-3 rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Android APK</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
