import React, { useState, useEffect } from 'react';
import { DocumentDownload, Copy, TickCircle, ShieldTick, ExportSquare } from 'iconsax-react';
import {
  OfficialWindowsIcon,
  OfficialLinuxIcon,
  OfficialAppleIcon,
  OfficialAndroidIcon,
} from './OfficialIcons';
import {
  PLATFORMS,
  detectPlatform,
  type PlatformId,
  RELEASE_BASE_URL,
  CURRENT_VERSION,
} from '../data/downloads';

interface Props {
  lang: 'en' | 'id';
  eyebrow: string;
  title: string;
  desc: string;
  recommendedText: string;
  universalText: string;
}

export default function Downloads({
  lang = 'en',
  eyebrow,
  title,
  desc,
}: Props) {
  const [platform, setPlatform] = useState<PlatformId>('windows');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const copyChecksum = (hash: string, pkgId: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(hash).then(() => {
        setCopiedHash(pkgId);
        setTimeout(() => setCopiedHash(null), 2500);
      });
    }
  };

  const currentPlatform = PLATFORMS[platform];

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
              <OfficialWindowsIcon className="w-4 h-4 shrink-0" />
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
              <OfficialLinuxIcon className="w-4 h-4 shrink-0" />
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
              <OfficialAppleIcon className="w-4 h-4 shrink-0" />
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
              <OfficialAndroidIcon className="w-4 h-4 shrink-0" />
              <span>Android</span>
            </button>
          </div>
        </div>

        {/* Dynamic Package Cards Grid */}
        <div className="max-w-4xl mx-auto">
          <div className={`grid grid-cols-1 ${currentPlatform.packages.length > 1 ? 'sm:grid-cols-2' : 'max-w-md mx-auto'} gap-6`}>
            {currentPlatform.packages.map((pkg) => {
              const isRecommended = pkg.id === currentPlatform.primaryPackageId;
              return (
                <div
                  key={pkg.id}
                  className={`bg-surface rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-5 relative transition-all ${
                    isRecommended
                      ? 'border-2 border-[#00E599]/40 shadow-lg shadow-[#00E599]/5'
                      : 'border border-subtle hover:border-medium'
                  }`}
                >
                  {pkg.badge && (
                    <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-subtle border border-emerald-subtle text-[#00E599]">
                      {pkg.badge[lang]}
                    </span>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{pkg.name}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {pkg.desc[lang]}
                    </p>

                    <div className="mt-4 pt-3 border-t border-subtle flex flex-col gap-1.5 text-[11px] font-mono-code text-neutral-400">
                      <div className="flex items-center justify-between">
                        <span>Version:</span>
                        <span className="text-white font-bold">{CURRENT_VERSION}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Target:</span>
                        <span>{pkg.arch}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Size:</span>
                        <span>{pkg.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {/* Direct 1-Click Download Button */}
                    <a
                      href={pkg.downloadUrl}
                      className={`w-full inline-flex items-center justify-center gap-2 font-bold text-sm py-3 rounded-lg transition-all ${
                        isRecommended
                          ? 'bg-[#00E599] hover:bg-[#00B377] text-neutral-950 shadow-md'
                          : 'bg-surface-elevated hover:bg-surface-subtle border border-subtle hover:border-medium text-white'
                      }`}
                    >
                      <DocumentDownload size={18} variant="Bold" className="shrink-0" />
                      <span>
                        {lang === 'id' ? `Unduh Langsung (${pkg.format})` : `Direct Download (${pkg.format})`}
                      </span>
                    </a>

                    {/* SHA-256 Verification Bar */}
                    {pkg.sha256 && (
                      <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded bg-canvas border border-subtle text-[10px] font-mono-code text-neutral-400">
                        <span className="truncate">
                          SHA256: {pkg.sha256.slice(0, 12)}...{pkg.sha256.slice(-8)}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyChecksum(pkg.sha256!, pkg.id)}
                          className="flex items-center gap-1 text-neutral-400 hover:text-[#00E599] shrink-0 font-medium transition-colors"
                          title="Copy full SHA-256 checksum"
                        >
                          {copiedHash === pkg.id ? (
                            <>
                              <TickCircle size={13} variant="Bold" className="text-[#00E599]" />
                              <span className="text-[#00E599] text-[9px]">{lang === 'id' ? 'Tersalin' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} variant="Linear" />
                              <span className="text-[9px]">{lang === 'id' ? 'Salin' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Security & GitHub Release Trust Footer */}
          <div className="mt-10 p-5 rounded-2xl bg-surface border border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-3">
              <ShieldTick size={24} variant="Bold" className="text-[#00E599] shrink-0" />
              <div>
                <p className="font-bold text-white">
                  {lang === 'id' ? '100% Open Source & Bebas Malware' : '100% Open Source & Verified Malware-Free'}
                </p>
                <p className="text-[11px] text-neutral-400">
                  {lang === 'id'
                    ? 'Dibuat otomatis oleh CI/CD GitHub Actions publik tanpa campur tangan kode tersembunyi.'
                    : 'Compiled automatically in public GitHub Actions without hidden binaries or trackers.'}
                </p>
              </div>
            </div>

            <a
              href={RELEASE_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00E599] hover:underline shrink-0"
            >
              <span>{lang === 'id' ? 'Lihat Semua Rilis di GitHub' : 'View All GitHub Releases'}</span>
              <ExportSquare size={14} variant="Linear" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
