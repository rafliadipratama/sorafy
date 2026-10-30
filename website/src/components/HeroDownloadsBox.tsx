import React, { useState } from 'react';
import { Copy, TickCircle, Star1 } from 'iconsax-react';
import {
  OfficialAppleIcon,
  OfficialWindowsIcon,
  OfficialLinuxIcon,
  OfficialHomebrewIcon,
  OfficialFlathubIcon,
  OfficialSnapcraftIcon,
  OfficialArchIcon,
  OfficialGithubIcon,
} from './OfficialIcons';

interface Props {
  lang?: 'en' | 'id';
}

export default function HeroDownloadsBox({ lang = 'en' }: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const releaseUrl = "https://github.com/rafliadipratama/sorafy/releases/latest";

  const packageManagers = [
    { id: 'brew', name: 'Homebrew', icon: OfficialHomebrewIcon, cmd: 'brew install --cask sorafy' },
    { id: 'winget', name: 'winget', icon: OfficialWindowsIcon, cmd: 'winget install SoraFy' },
    { id: 'flathub', name: 'Flathub', icon: OfficialFlathubIcon, cmd: 'flatpak install flathub org.sorafy.SoraFy' },
    { id: 'snap', name: 'Snapcraft', icon: OfficialSnapcraftIcon, cmd: 'sudo snap install sorafy' },
    { id: 'aur', name: 'AUR', icon: OfficialArchIcon, cmd: 'yay -S sorafy-bin' },
  ];

  const macCmd = 'sudo xattr -r -d com.apple.quarantine /Applications/SoraFy.app';

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(id);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg">
      {/* Downloads Box Container */}
      <div className="relative w-full bg-surface border-2 border-subtle hover:border-[#00E599]/30 rounded-2xl p-6 sm:p-7 shadow-2xl transition-all">
        {/* Top Centered Floating Badge */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00E599] text-neutral-950 font-black text-xs uppercase tracking-widest px-4 py-1 rounded-full border border-neutral-950 shadow-md">
          {lang === 'id' ? 'UNDUHAN' : 'DOWNLOADS'}
        </div>

        {/* 3 Main Platform Buttons */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mt-2">
          <a
            href={releaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 sm:gap-2 bg-surface-elevated hover:bg-surface-subtle border border-medium hover:border-[#00E599]/40 text-white font-bold text-xs sm:text-sm py-2.5 px-2 rounded-lg transition-all hover:-translate-y-0.5 shadow-sm"
          >
            <OfficialAppleIcon className="w-4 h-4 shrink-0" />
            <span>macOS</span>
          </a>

          <a
            href={releaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 sm:gap-2 bg-surface-elevated hover:bg-surface-subtle border border-medium hover:border-[#00E599]/40 text-white font-bold text-xs sm:text-sm py-2.5 px-2 rounded-lg transition-all hover:-translate-y-0.5 shadow-sm"
          >
            <OfficialWindowsIcon className="w-4 h-4 shrink-0" />
            <span>Windows</span>
          </a>

          <a
            href={releaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 sm:gap-2 bg-surface-elevated hover:bg-surface-subtle border border-medium hover:border-[#00E599]/40 text-white font-bold text-xs sm:text-sm py-2.5 px-2 rounded-lg transition-all hover:-translate-y-0.5 shadow-sm"
          >
            <OfficialLinuxIcon className="w-4 h-4 shrink-0" />
            <span>Linux</span>
          </a>
        </div>

        {/* Package Manager Section */}
        <p className="mt-5 text-center text-xs font-medium text-neutral-400">
          {lang === 'id' ? 'Atau pasang dari repositori paket:' : 'Or install from a package repository:'}
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

        {/* All downloads text link */}
        <a
          href="#downloads"
          className="mt-4 block text-center text-xs font-semibold text-[#00E599] hover:underline"
        >
          {lang === 'id' ? 'Semua opsi unduhan & paket →' : 'All downloads & package details →'}
        </a>

        {/* macOS Tip Callout */}
        <div className="mt-5 pt-4 border-t border-subtle text-neutral-400 text-center text-[11px] leading-relaxed">
          <p>
            <strong className="text-white">macOS users:</strong> macOS may block SoraFy from opening. Run this in Terminal:
          </p>
          <div className="mt-2 flex items-center justify-between gap-2 bg-canvas border border-subtle px-3 py-1.5 rounded text-left font-mono-code text-[10px] text-neutral-300">
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
      </div>

      {/* GitHub Learn More Button with Star Badge */}
      <div className="relative z-10 mt-6">
        <span className="pointer-events-none absolute -top-2.5 -right-3 z-20 rotate-6 rounded-md px-2 py-0.5 text-[11px] font-black whitespace-nowrap bg-amber-400 text-neutral-950 shadow-md flex items-center gap-1">
          <Star1 size={12} variant="Bold" className="shrink-0" />
          <span>★ Star</span>
        </span>
        <a
          href="https://github.com/rafliadipratama/sorafy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 bg-surface hover:bg-surface-elevated border border-medium hover:border-strong text-white font-bold text-sm px-7 py-3 rounded-xl transition-all shadow-md hover:-translate-y-0.5"
        >
          <OfficialGithubIcon className="w-4 h-4 shrink-0" />
          <span>Learn more</span>
        </a>
      </div>
    </div>
  );
}
