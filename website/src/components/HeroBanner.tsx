import React, { useState } from 'react';
import { Copy, TickCircle } from 'iconsax-react';

interface Props {
  lang?: 'en' | 'id';
}

export default function HeroBanner({ lang = 'en' }: Props) {
  const [copied, setCopied] = useState(false);

  const command = "git clone https://github.com/rafliadipratama/sorafy.git";

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(command).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }).catch(() => {
        fallbackCopy();
      });
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    const el = document.createElement('textarea');
    el.value = command;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const badgeText = lang === 'id' ? 'CLI & DESKTOP' : 'CLI & DESKTOP';
  const promptText = copied
    ? (lang === 'id' ? 'Tersalin ke clipboard!' : 'Copied to clipboard!')
    : (lang === 'id' ? 'Klik untuk salin' : 'Click to copy');

  return (
    <>
      {/* Banner Container */}
      <div
        onClick={handleCopy}
        className="relative group inline-flex items-center gap-2 sm:gap-3.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0D1015]/90 hover:bg-[#12161E] border border-subtle hover:border-[#00E599]/60 shadow-lg hover:shadow-[0_0_24px_rgba(0,229,153,0.18)] transition-all duration-300 select-none cursor-pointer max-w-full overflow-hidden"
        role="button"
        tabIndex={0}
        aria-label={`Copy command: ${command}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCopy();
          }
        }}
      >
        {/* Ambient neon emerald glow backdrop */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00E599]/15 via-transparent to-[#00E599]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Left Badge */}
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00E599]/15 border border-[#00E599]/30 text-[#00E599] text-[10px] sm:text-[11px] font-bold tracking-wider shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse" />
          <span>{badgeText}</span>
        </span>

        {/* Command Line */}
        <div className="flex items-center gap-1.5 font-mono-code text-xs sm:text-sm text-neutral-300 group-hover:text-white transition-colors truncate">
          <span className="text-[#00E599] font-bold select-none">$</span>
          <span className="truncate">{command}</span>
        </div>

        {/* Copy Status Icon Pill */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-canvas/90 border border-subtle group-hover:border-[#00E599]/50 text-neutral-400 group-hover:text-[#00E599] transition-all shrink-0 ml-0.5">
          {copied ? (
            <>
              <TickCircle size={14} variant="Bold" className="text-[#00E599] scale-110 transition-transform" />
              <span className="text-[10px] text-[#00E599] font-bold font-mono-code">{lang === 'id' ? 'Tersalin!' : 'Copied!'}</span>
            </>
          ) : (
            <Copy size={13} variant="Linear" />
          )}
        </div>
      </div>
    </>
  );
}
