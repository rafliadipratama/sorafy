import React, { useState, useEffect } from 'react';
import { DocumentDownload } from 'iconsax-react';

interface Props {
  defaultText: string;
  lang: 'en' | 'id';
}

export default function HeroDownloadButton({ defaultText, lang }: Props) {
  const [buttonLabel, setButtonLabel] = useState(defaultText);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ua = navigator.userAgent.toLowerCase();
    const platform = (navigator.platform || '').toLowerCase();
    let os = 'Desktop';

    if (ua.includes('android')) os = 'Android';
    else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod') || platform.includes('mac') || ua.includes('macintosh')) os = 'macOS';
    else if (platform.includes('win') || ua.includes('windows')) os = 'Windows';
    else if (platform.includes('linux') || ua.includes('linux')) os = 'Linux';

    const prefix = lang === 'id' ? 'Unduh Gratis untuk ' : 'Download Free for ';
    setButtonLabel(`${prefix}${os}`);
  }, [lang]);

  return (
    <a
      href="#downloads"
      className="inline-flex items-center justify-center gap-2.5 bg-[#00E599] hover:bg-[#00B377] text-neutral-950 font-bold text-base px-6 py-3.5 rounded-lg transition-all shadow-md hover:-translate-y-0.5"
    >
      <DocumentDownload size={20} variant="Bold" />
      <span>{buttonLabel}</span>
    </a>
  );
}
