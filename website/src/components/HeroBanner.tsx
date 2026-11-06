import React, { useState, useEffect, useRef } from 'react';
import { Copy, TickCircle } from 'iconsax-react';

interface Props {
  lang?: 'en' | 'id';
}

export default function HeroBanner({ lang = 'en' }: Props) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const bannerRef = useRef<HTMLDivElement>(null);

  const command = "git clone https://github.com/rafliadipratama/sorafy.git";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bannerRef.current) return;
      const rect = bannerRef.current.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isInside) {
        setIsHovered(true);
        setCursorPos({ x: e.clientX, y: e.clientY });
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeaveWindow = () => {
      setIsHovered(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
    };
  }, []);

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
        ref={bannerRef}
        onClick={handleCopy}
        className="relative group inline-flex items-center gap-2 sm:gap-3.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0D1015]/90 hover:bg-[#12161E] border border-subtle hover:border-[#00E599]/60 shadow-lg hover:shadow-[0_0_24px_rgba(0,229,153,0.18)] transition-all duration-300 select-none cursor-pointer md:cursor-none max-w-full overflow-hidden"
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
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-canvas/90 border border-subtle group-hover:border-[#00E599]/50 text-neutral-400 group-hover:text-[#00E599] transition-all shrink-0 ml-0.5">
          {copied ? (
            <TickCircle size={14} variant="Bold" className="text-[#00E599] scale-110 transition-transform" />
          ) : (
            <Copy size={13} variant="Linear" />
          )}
        </div>
      </div>

      {/* Interactive Cursor Follower (Strictly active only inside banner) */}
      <div
        className={`pointer-events-none fixed z-[9999] hidden md:flex items-center gap-2 transition-opacity duration-150 ease-out ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: 'translate(-4px, -4px)',
        }}
      >
        {/* Custom Neon Emerald Cursor Dot */}
        <div className="relative flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#00E599] shadow-[0_0_12px_#00E599]" />
          <div className="absolute w-5 h-5 rounded-full border border-[#00E599]/40 animate-ping" />
        </div>

        {/* Floating Tooltip Pill */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono-code font-bold backdrop-blur-md shadow-2xl transition-all duration-150 border ${
            copied
              ? 'bg-[#00E599] text-neutral-950 border-[#00E599] shadow-[0_0_24px_rgba(0,229,153,0.5)] scale-105'
              : 'bg-[#0B0D10]/95 text-neutral-100 border-[#00E599]/50 shadow-[0_4px_20px_rgba(0,0,0,0.8)]'
          }`}
        >
          {copied ? (
            <TickCircle size={13} variant="Bold" className="text-neutral-950 shrink-0" />
          ) : (
            <Copy size={12} variant="Bold" className="text-[#00E599] shrink-0" />
          )}
          <span>{promptText}</span>
        </div>
      </div>
    </>
  );
}
