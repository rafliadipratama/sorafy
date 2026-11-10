import React, { useState, useEffect } from 'react';
import { DocumentDownload, Copy, TickCircle, ShieldTick } from 'iconsax-react';
import {
  OfficialAppleIcon,
  OfficialWindowsIcon,
  OfficialLinuxIcon,
  OfficialAndroidIcon,
  OfficialHomebrewIcon,
  OfficialFlathubIcon,
  OfficialSnapcraftIcon,
  OfficialArchIcon,
  OfficialGithubIcon,
} from './OfficialIcons';
import {
  PLATFORMS,
  detectPlatform,
  type PlatformId,
  CURRENT_VERSION,
} from '../data/downloads';

interface Props {
  lang?: 'en' | 'id';
}

export default function HeroDownloadsBox({ lang = 'en' }: Props) {
  const [platform, setPlatform] = useState<PlatformId>('windows');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const packageManagers = [
    { id: 'brew', name: 'Homebrew', icon: OfficialHomebrewIcon, cmd: 'brew install --cask sorafy' },
    { id: 'winget', name: 'winget', icon: OfficialWindowsIcon, cmd: 'winget install SoraFy' },
    { id: 'flathub', name: 'Flathub', icon: OfficialFlathubIcon, cmd: 'flatpak install flathub org.sorafy.SoraFy' },
    { id: 'snap', name: 'Snapcraft', icon: OfficialSnapcraftIcon, cmd: 'sudo snap install sorafy' },
    { id: 'aur', name: 'AUR', icon: OfficialArchIcon, cmd: 'yay -S sorafy-bin' },
  ];

  const macCmd = 'sudo xattr -r -d com.apple.quarantine /Applications/SoraFy.app';
  const linuxCmd = 'chmod +x SoraFy-2.0.0.AppImage && ./SoraFy-2.0.0.AppImage';

  const copyToClipboard = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedKey(id);
        setTimeout(() => setCopiedKey(null), 2000);
      });
    }
  };

  const currentConfig = PLATFORMS[platform];
  const primaryPkg = currentConfig.packages.find(p => p.id === currentConfig.primaryPackageId) || currentConfig.packages[0];

  const PlatformIcon = {
    windows: OfficialWindowsIcon,
    macos: OfficialAppleIcon,
    linux: OfficialLinuxIcon,
    android: OfficialAndroidIcon,
  }[platform];

  return (
    <div className="flex flex-col items-center w-full max-w-lg">
      {/* Downloads Box Container */}
      <div className="relative w-full bg-surface border-2 border-subtle hover:border-[#00E599]/30 rounded-2xl p-5 sm:p-7 shadow-2xl transition-all">
        {/* Top Centered Floating Badge */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00E599] text-neutral-950 font-black text-xs uppercase tracking-widest px-4 py-1 rounded-full border border-neutral-950 shadow-md">
          {lang === 'id' ? 'UNDUHAN LANGSUNG' : 'DIRECT DOWNLOAD'}
        </div>

        {/* 1-Click Primary Download CTA (Smart Auto-Detected) */}
        <div className="mt-2 flex flex-col gap-2">
          <a
            href={primaryPkg.downloadUrl}
            className="group relative flex flex-col items-center justify-center bg-[#00E599] hover:bg-[#00B377] text-neutral-950 rounded-xl px-4 py-3.5 transition-all shadow-lg hover:shadow-[#00E599]/20 hover:-translate-y-0.5"
            title={`${primaryPkg.name} (${primaryPkg.filename})`}
          >
            <div className="flex items-center gap-2.5">
              <PlatformIcon className="w-5 h-5 shrink-0 text-neutral-950" />
              <span className="font-extrabold text-sm sm:text-base tracking-tight">
                {lang === 'id'
                  ? `Unduh untuk ${currentConfig.name} (${primaryPkg.format})`
                  : `Download for ${currentConfig.name} (${primaryPkg.format})`}
              </span>
              <DocumentDownload size={18} variant="Bold" className="shrink-0 group-hover:translate-y-0.5 transition-transform" />
            </div>
            <span className="text-[11px] font-medium text-neutral-900/80 mt-1">
              {currentConfig.ctaSubtext[lang]}
            </span>
          </a>

          {/* Quick Platform Switcher Bar */}
          <div className="flex items-center justify-between gap-1 pt-2">
            <span className="text-[11px] font-semibold text-neutral-500 hidden sm:inline">
              {lang === 'id' ? 'Pilih OS lain:' : 'Other OS:'}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-end flex-1">
              {(['windows', 'macos', 'linux', 'android'] as PlatformId[]).map((pid) => {
                const Icon = {
                  windows: OfficialWindowsIcon,
                  macos: OfficialAppleIcon,
                  linux: OfficialLinuxIcon,
                  android: OfficialAndroidIcon,
                }[pid];
                const isActive = platform === pid;
                return (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => setPlatform(pid)}
                    className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all ${
                      isActive
                        ? 'bg-surface-elevated text-[#00E599] border border-[#00E599]/40 shadow-sm'
                        : 'text-neutral-400 hover:text-white bg-canvas hover:bg-surface-subtle border border-subtle'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{PLATFORMS[pid].name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* OS Specific Guidance & Trust Helper */}
        <div className="mt-4 pt-3.5 border-t border-subtle text-neutral-400 text-[11px] leading-relaxed">
          {platform === 'windows' && (
            <div className="flex items-center gap-2 bg-canvas border border-subtle/80 px-3 py-2 rounded-lg text-neutral-300">
              <ShieldTick size={16} variant="Linear" className="text-[#00E599] shrink-0" />
              <span>
                {lang === 'id'
                  ? 'Bebas malware & virus. Jika muncul layar SmartScreen, klik "More info" → "Run anyway".'
                  : 'Verified malware-free. If SmartScreen appears, click "More info" → "Run anyway".'}
              </span>
            </div>
          )}

          {platform === 'macos' && (
            <div className="flex flex-col gap-1.5">
              <span className="text-neutral-300">
                {lang === 'id'
                  ? 'Pengguna Mac: Jika dicegah oleh Gatekeeper, jalankan perintah ini di Terminal:'
                  : 'macOS users: If blocked by Gatekeeper quarantine, run in Terminal:'}
              </span>
              <div className="flex items-center justify-between gap-2 bg-canvas border border-subtle px-2.5 py-1.5 rounded font-mono-code text-[10px] text-neutral-300">
                <span className="truncate">{macCmd}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(macCmd, 'mac-quarantine')}
                  className="text-neutral-400 hover:text-[#00E599] shrink-0"
                  title="Copy command"
                >
                  {copiedKey === 'mac-quarantine' ? (
                    <TickCircle size={14} variant="Bold" className="text-[#00E599]" />
                  ) : (
                    <Copy size={14} variant="Linear" />
                  )}
                </button>
              </div>
            </div>
          )}

          {platform === 'linux' && (
            <div className="flex flex-col gap-1.5">
              <span className="text-neutral-300">
                {lang === 'id' ? 'Untuk menjalankan AppImage langsung:' : 'To execute AppImage directly:'}
              </span>
              <div className="flex items-center justify-between gap-2 bg-canvas border border-subtle px-2.5 py-1.5 rounded font-mono-code text-[10px] text-neutral-300">
                <span className="truncate">{linuxCmd}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(linuxCmd, 'linux-chmod')}
                  className="text-neutral-400 hover:text-[#00E599] shrink-0"
                  title="Copy command"
                >
                  {copiedKey === 'linux-chmod' ? (
                    <TickCircle size={14} variant="Bold" className="text-[#00E599]" />
                  ) : (
                    <Copy size={14} variant="Linear" />
                  )}
                </button>
              </div>
            </div>
          )}

          {platform === 'android' && (
            <div className="flex items-center gap-2 bg-canvas border border-subtle/80 px-3 py-2 rounded-lg text-neutral-300">
              <ShieldTick size={16} variant="Linear" className="text-[#00E599] shrink-0" />
              <span>
                {lang === 'id'
                  ? 'Buka file APK yang diunduh lalu izinkan "Install unknown apps" jika diminta oleh browser.'
                  : 'Open the downloaded APK and allow "Install unknown apps" if prompted by your browser.'}
              </span>
            </div>
          )}
        </div>

        {/* Package Manager Repositories Section */}
        <p className="mt-4 text-center text-xs font-medium text-neutral-400">
          {lang === 'id' ? 'Atau pasang dari repositori paket terminal:' : 'Or install from package repository:'}
        </p>

        <div className="mt-2.5 flex flex-wrap justify-center gap-2">
          {packageManagers.map((pm) => {
            const IconComponent = pm.icon;
            return (
              <div
                key={pm.id}
                className="inline-flex items-center bg-canvas border border-subtle rounded-md text-xs font-semibold overflow-hidden hover:border-medium transition-colors"
              >
                <span className="px-2.5 py-1 text-neutral-300 bg-surface flex items-center gap-1.5">
                  <IconComponent className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{pm.name}</span>
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(pm.cmd, pm.id)}
                  className="px-2 py-1 text-neutral-400 hover:text-[#00E599] hover:bg-surface-elevated border-l border-subtle transition-colors"
                  title={`Copy: ${pm.cmd}`}
                >
                  {copiedKey === pm.id ? (
                    <TickCircle size={14} variant="Bold" className="text-[#00E599]" />
                  ) : (
                    <Copy size={14} variant="Linear" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* All downloads & SHA-256 Checksums Link */}
        <a
          href="#downloads"
          className="mt-4 block text-center text-xs font-semibold text-[#00E599] hover:underline"
        >
          {lang === 'id'
            ? 'Semua paket (.deb, .zip, .dmg), checksum SHA-256 & info rilis →'
            : 'All packages (.deb, .zip, .dmg), SHA-256 checksums & release notes →'}
        </a>
      </div>

      {/* GitHub Learn More Button */}
      <div className="mt-5">
        <a
          href="https://github.com/rafliadipratama/sorafy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 bg-surface hover:bg-surface-elevated border border-medium hover:border-strong text-white font-bold text-sm px-7 py-2.5 rounded-xl transition-all shadow-md hover:-translate-y-0.5"
        >
          <OfficialGithubIcon className="w-4 h-4 shrink-0" />
          <span>{lang === 'id' ? 'Lihat Kode Sumber di GitHub' : 'View Source on GitHub'}</span>
        </a>
      </div>
    </div>
  );
}
