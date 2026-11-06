import React, { useState, useEffect, useRef } from 'react';
import { Copy, TickCircle } from 'iconsax-react';

interface Props {
  lang?: 'en' | 'id';
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function HeroInteractiveBackground({ lang = 'en' }: Props) {
  const [copied, setCopied] = useState(false);
  const [isInsideHero, setIsInsideHero] = useState(false);
  const [isOverInteractive, setIsOverInteractive] = useState(false);
  const [coords, setCoords] = useState({ clientX: -100, clientY: -100, localX: -100, localY: -100 });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const command = 'git clone https://github.com/rafliadipratama/sorafy.git';

  const copyToClipboard = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(command).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      }).catch(() => {
        fallbackCopy();
      });
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    try {
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
      setTimeout(() => setCopied(false), 2400);
    } catch (_) {}
  };

  useEffect(() => {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = heroSection.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!inside) {
        setIsInsideHero(false);
        return;
      }

      setIsInsideHero(true);
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      setCoords({
        clientX: e.clientX,
        clientY: e.clientY,
        localX,
        localY,
      });

      // Check if cursor is hovering over an interactive element (button, link, input)
      const target = e.target as HTMLElement | null;
      const overInteractive = Boolean(
        target?.closest('a, button, input, [role="button"], select, textarea, .no-copy-cursor')
      );
      setIsOverInteractive(overInteractive);
    };

    const handleMouseLeave = () => {
      setIsInsideHero(false);
      setIsOverInteractive(false);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const isInteractive = Boolean(
        target?.closest('a, button, input, [role="button"], select, textarea, .no-copy-cursor')
      );

      // Only copy when clicking on the background / non-interactive areas of the hero banner
      if (!isInteractive) {
        const rect = heroSection.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        copyToClipboard();

        // Add ripple animation
        const newRipple: Ripple = { id: Date.now(), x: clickX, y: clickY };
        setRipples((prev) => [...prev.slice(-4), newRipple]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 1000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    heroSection.addEventListener('mouseleave', handleMouseLeave);
    heroSection.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      heroSection.removeEventListener('mouseleave', handleMouseLeave);
      heroSection.removeEventListener('click', handleClick);
    };
  }, []);

  const promptText = copied
    ? (lang === 'id' ? 'Tersalin ke clipboard!' : 'Copied to clipboard!')
    : (lang === 'id' ? 'Klik background untuk salin' : 'Click background to copy');

  return (
    <>
      {/* 1. Interactive Cursor Radial Spotlight on the Banner Background Grid */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300"
        style={{
          opacity: isInsideHero ? 1 : 0,
          background: `radial-gradient(550px circle at ${coords.localX}px ${coords.localY}px, rgba(0, 229, 153, 0.12), rgba(0, 229, 153, 0.03) 45%, transparent 75%)`,
        }}
      >
        {/* Click Ripple Pulses */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full border border-[#00E599]/60 bg-[#00E599]/15 animate-ping pointer-events-none"
            style={{
              left: `${ripple.x - 30}px`,
              top: `${ripple.y - 30}px`,
              width: '60px',
              height: '60px',
            }}
          />
        ))}
      </div>

      {/* 2. Interactive Cursor Follower Badge (Active exclusively over Hero Banner background) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed z-[9999] hidden md:flex items-center gap-2 transition-all duration-150 ease-out ${
          isInsideHero && !isOverInteractive ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
        }`}
        style={{
          left: `${coords.clientX}px`,
          top: `${coords.clientY}px`,
          transform: 'translate(14px, 14px)',
        }}
      >
        {/* Cursor Point Indicator */}
        <div className="relative flex items-center justify-center shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00E599] shadow-[0_0_12px_#00E599]" />
          <div className="absolute w-4 h-4 rounded-full border border-[#00E599]/40 animate-ping" />
        </div>

        {/* Floating Tooltip Pill */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono-code font-bold backdrop-blur-md shadow-2xl transition-all duration-200 border ${
            copied
              ? 'bg-[#00E599] text-neutral-950 border-[#00E599] shadow-[0_0_24px_rgba(0,229,153,0.55)] scale-105'
              : 'bg-[#0B0D10]/95 text-neutral-200 border-[#00E599]/40 shadow-[0_8px_24px_rgba(0,0,0,0.85)]'
          }`}
        >
          {copied ? (
            <TickCircle size={14} variant="Bold" className="text-neutral-950 shrink-0" />
          ) : (
            <Copy size={13} variant="Bold" className="text-[#00E599] shrink-0" />
          )}
          <span className="whitespace-nowrap">{promptText}</span>

          {!copied && (
            <span className="hidden lg:inline text-[10px] text-neutral-400 font-normal border-l border-neutral-700 pl-2">
              git clone ...
            </span>
          )}
        </div>
      </div>
    </>
  );
}
