/**
 * SoraFy Landing Page Script
 * Features:
 * - Multi-language translation engine (EN / ID) with localStorage persistence
 * - OS auto-detection for instant download routing
 * - Platform download tabs
 * - Interactive terminal switcher with one-click clipboard copy
 * - Accordion FAQ expander
 * - Mobile navigation drawer
 */

(function () {
  'use strict';

  // Complete Translation Dictionary (Clean, direct, zero AI-slop)
  const I18N = {
    en: {
      announcement_pill: "Open Source",
      announcement_text: "SoraFy v2.0 is live with Linux MPD Daemon, AI Model Context Protocol, and Phone Jam Remote.",
      announcement_link: "Get v2.0 &rarr;",
      nav_features: "Features",
      nav_superpowers: "Integrations",
      nav_downloads: "Downloads",
      nav_comparison: "Comparison",
      nav_faq: "FAQ",
      btn_header_download: "Download",
      hero_badge: "Desktop & Mobile • Zero Telemetry • 100% Free",
      hero_title: "Music streaming without subscriptions, accounts, or telemetry.",
      hero_desc: "SoraFy streams high-fidelity music from open sources across the web. Import your Spotify and Apple Music playlists, sing along with real-time synchronized lyrics, fine-tune sound with DSP EQ, and control playback right from your phone or terminal.",
      btn_hero_download: "Download Free for Desktop",
      btn_hero_github: "View Source Code",
      hero_available_on: "Available on:",
      mockup_nav_home: "Home",
      mockup_nav_explore: "Explore",
      mockup_nav_equalizer: "DSP Studio",
      mockup_nav_stats: "Listening Recap",
      mockup_search_placeholder: "Search songs, artists, or paste Spotify / Apple Music link...",
      mockup_now_playing: "NOW PLAYING",
      mockup_eq_title: "7-Band Parametric EQ Active Curve",
      mockup_lyrics_title: "Synchronized Lyrics",
      features_eyebrow: "Everything You Need",
      features_title: "A modern player built without commercial compromises.",
      features_desc: "No forced algorithm feeds, no audio compression degradation, and no data surveillance. Pure audio playback designed around your tastes.",
      feat_import_title: "Universal Playlist Importer",
      feat_import_desc: "Import playlists directly from Spotify, Apple Music, and YouTube without logging in or handing over credentials. SoraFy resolves and matches each song automatically against high-fidelity audio streams.",
      feat_lyrics_title: "Word-by-Word Synchronized Lyrics",
      feat_lyrics_desc: "Sing along with millisecond-accurate lyrics fetched from LRCLIB and Musixmatch. Features automatic Furigana and Romaji romanization for Japanese and Korean songs, plus manual sync calibration controls.",
      feat_eq_title: "7-Band Parametric Equalizer",
      feat_eq_desc: "Take complete acoustic command over your audio output. Real-time Web Audio DSP filters let you boost sub-bass, enhance vocal clarity, adjust stereo surround, and normalize volume spikes across different albums.",
      feat_cache_title: "Smart Local Cache & Offline Play",
      feat_cache_desc: "Tracks you stream are cached automatically using an LRU eviction strategy so you can listen seamlessly on flights or during network outages. Download complete MP3 tracks for permanent offline archives.",
      super_eyebrow: "Advanced Integrations",
      super_title: "Engineered for developers, audiophiles, and power users.",
      super_desc: "SoraFy exposes native protocols so your music player integrates seamlessly into your terminal workflows, home Wi-Fi, and AI coding assistants.",
      super_jam_title: "SoraFy Jam • Phone Remote Control",
      super_jam_desc: "Control playback from anywhere in your room. Scan a quick QR code with your phone browser to skip songs, tweak volume, and search tracks over your local Wi-Fi without installing third-party mobile apps.",
      super_mpd_title: "Music Player Daemon (MPD Protocol)",
      super_mpd_desc: "Native protocol socket compatibility on TCP 6600. Control SoraFy using standard Linux terminal CLI tools such as mpc, ncmpcpp, yams, or integrate it with your desktop polybar/waybar status widgets.",
      super_mcp_title: "Model Context Protocol (AI MCP)",
      super_mcp_desc: "Connect Claude Code, Cursor, Windsurf, or custom LLM agents to your music player via JSON-RPC on port 8800. Ask your AI to queue playlists, summarize lyrics, or adjust equalizers while coding.",
      super_recap_title: "Private Habits & Music Recap",
      super_recap_desc: "Track your top artists, most streamed songs, and weekly listening trends with clean, modern cards. 100% of your listening data is stored locally in your private SQLite database—never transmitted.",
      super_discord_title: "Discord Rich Presence",
      super_discord_desc: "Broadcast your active track, album artwork, artist, and remaining duration directly to your Discord profile so your friends can see what you are listening to in real time.",
      super_theme_title: "Custom Theming & Design Tokens",
      super_theme_desc: "Match your desktop aesthetic with 5 carefully tuned design palettes (Obsidian Void, Priangan Emerald, Midnight Studio, Nordic Frost, Crimson) plus custom primary accent color pickers.",
      dl_eyebrow: "Install SoraFy",
      dl_title: "Download for your preferred operating system.",
      dl_desc: "Free forever. No telemetry, no hidden accounts, and zero installation paywalls. Built and signed for Linux, Windows, macOS, and Android.",
      dl_recommended: "Recommended",
      dl_universal: "Universal Linux",
      comp_eyebrow: "Comparison",
      comp_title: "How SoraFy compares to commercial streaming.",
      comp_desc: "A direct, honest overview of where SoraFy excels compared to proprietary streaming platforms.",
      comp_col_feature: "Feature",
      comp_cost: "Cost & Subscription",
      comp_ads: "Audio & Banner Ads",
      comp_login: "Account / Registration",
      comp_import: "Spotify / Apple Import",
      comp_eq: "Parametric DSP Equalizer",
      comp_offline: "Offline Storage",
      comp_protocols: "Terminal MPD & AI MCP",
      comp_privacy: "Privacy & Telemetry",
      faq_eyebrow: "FAQ",
      faq_title: "Frequently Asked Questions",
      faq_desc: "Direct, factual answers without technical obfuscation.",
      faq_q1: "Where does SoraFy get its music?",
      faq_a1: "SoraFy indexes and streams audio from public, open sources across the web without hosting or re-selling copyrighted media files. It functions similarly to open-source media indexers like Nuclear Player, NewPipe, and FreeTube.",
      faq_q2: "Is SoraFy safe and privacy-friendly?",
      faq_a2: "Yes. SoraFy is completely open source under the GNU GPL v3 license. There are no tracking scripts, analytics SDKs, user telemetry pings, or forced cloud registrations. All user preferences, history, and cache stay on your machine.",
      faq_q3: "How does playlist importing work without logging in?",
      faq_a3: "SoraFy parses public metadata (track titles, artists, and album info) from Spotify and Apple Music public playlist links using open APIs. It then resolves each track to optimal high-fidelity audio streams in real time without accessing private accounts.",
      faq_q4: "What is the Music Player Daemon (MPD) protocol socket?",
      faq_a4: "MPD is the standard Linux audio protocol supported by countless terminal utilities. SoraFy implements an MPD-compatible TCP server on port 6600, allowing tools like 'mpc next' or terminal clients like 'ncmpcpp' to manipulate playback seamlessly.",
      faq_q5: "How does the SoraFy Jam phone remote work?",
      faq_a5: "When you click the mobile icon in SoraFy, the app boots a lightweight local HTTP server on port 4120 and displays a QR code. Any phone on your local Wi-Fi can scan this code to open a responsive web remote—no app installation needed.",
      faq_q6: "Can I listen to music completely offline?",
      faq_a6: "Yes. Songs you stream are automatically stored in an intelligent LRU disk cache so they can be replayed without an internet connection. You can also explicitly save and export permanent MP3 files to your local music directory.",
      footer_desc: "High-fidelity music streaming for desktop and mobile. No ads, no paywalls, and zero telemetry. Built for music lovers and power users.",
      footer_license: "Released under GNU General Public License v3.0 (GPL-3.0).",
      footer_col_platform: "Platforms",
      footer_col_features: "Features",
      footer_col_project: "Project",
      footer_back_to_top: "&uarr; Back to top"
    },
    id: {
      announcement_pill: "Sumber Terbuka",
      announcement_text: "SoraFy v2.0 telah rilis dengan Linux MPD Daemon, AI Model Context Protocol, dan Phone Jam Remote.",
      announcement_link: "Unduh v2.0 &rarr;",
      nav_features: "Fitur",
      nav_superpowers: "Integrasi",
      nav_downloads: "Unduhan",
      nav_comparison: "Perbandingan",
      nav_faq: "FAQ",
      btn_header_download: "Unduh",
      hero_badge: "Desktop & Mobile • Bebas Telemetri • 100% Gratis",
      hero_title: "Streaming musik bebas langganan, tanpa akun, dan tanpa telemetri.",
      hero_desc: "SoraFy memutar audio high-fidelity dari berbagai sumber terbuka di web. Impor daftar putar Spotify dan Apple Music Anda, bernyanyi dengan lirik tersinkronisasi presisi, atur tata suara lewat Equalizer parametrik DSP, dan kendalikan pemutaran langsung dari ponsel atau terminal.",
      btn_hero_download: "Unduh Gratis untuk Desktop",
      btn_hero_github: "Lihat Kode Sumber",
      hero_available_on: "Tersedia untuk:",
      mockup_nav_home: "Beranda",
      mockup_nav_explore: "Jelajahi",
      mockup_nav_equalizer: "DSP Studio",
      mockup_nav_stats: "Rekap Musik",
      mockup_search_placeholder: "Cari lagu, musisi, atau tempel tautan Spotify / Apple Music...",
      mockup_now_playing: "SEDANG DIPUTAR",
      mockup_eq_title: "Kurva Aktif 7-Band Parametric EQ",
      mockup_lyrics_title: "Lirik Tersinkronisasi",
      features_eyebrow: "Lengkap & Bebas Hambatan",
      features_title: "Pemutar musik modern tanpa kompromi komersial.",
      features_desc: "Tanpa algoritma feed paksaan, tanpa kompresi audio yang merusak kualitas suara, dan bebas pelacakan data pribadi. Pengalaman audio murni sesuai preferensi Anda.",
      feat_import_title: "Universal Playlist Importer",
      feat_import_desc: "Impor playlist langsung dari Spotify, Apple Music, dan YouTube tanpa harus login atau memberikan data akun. SoraFy mendeteksi dan mencocokkan setiap lagu secara otomatis dengan sumber audio berkualitas tinggi.",
      feat_lyrics_title: "Lirik Tersinkronisasi Kata per Kata",
      feat_lyrics_desc: "Bernyanyi bersama dengan lirik berakurasi milidetik dari LRCLIB dan Musixmatch. Dilengkapi romanisasi otomatis Furigana & Romaji untuk lagu Jepang dan Korea, serta kalibrasi sinkronisasi manual.",
      feat_eq_title: "Equalizer Parametrik 7-Band",
      feat_eq_desc: "Kendalikan karakter akustik output audio Anda seutuhnya. Filter DSP Web Audio real-time memungkinkan Anda mendongkrak sub-bass, memperjelas vokal, mengatur stereo surround, dan menormalkan lonjakan volume.",
      feat_cache_title: "Cache Lokal Cerdas & Putar Offline",
      feat_cache_desc: "Lagu yang Anda putar otomatis disimpan ke cache dengan strategi LRU sehingga dapat didengarkan di pesawat atau saat koneksi internet terputus. Unduh file MP3 lengkap untuk arsip permanen.",
      super_eyebrow: "Integrasi Tingkat Lanjut",
      super_title: "Dirancang untuk pengembang, audiophile, dan power user.",
      super_desc: "SoraFy menyediakan protokol bawaan agar pemutar musik Anda terhubung mulus dengan alur kerja terminal, Wi-Fi rumah, dan asisten koding berbasis AI.",
      super_jam_title: "SoraFy Jam • Remote Kontrol Ponsel",
      super_jam_desc: "Kendalikan lagu dari mana saja di ruangan Anda. Cukup pindai kode QR lewat browser ponsel untuk berpindah lagu, mengatur volume, dan mencari musik melalui jaringan Wi-Fi lokal tanpa perlu instal aplikasi tambahan.",
      super_mpd_title: "Music Player Daemon (Protokol MPD)",
      super_mpd_desc: "Kompatibilitas socket protokol Linux di port TCP 6600. Kendalikan SoraFy menggunakan perangkat CLI standar seperti mpc, ncmpcpp, yams, atau integrasikan dengan widget status polybar/waybar Anda.",
      super_mcp_title: "Model Context Protocol (AI MCP)",
      super_mcp_desc: "Hubungkan Claude Code, Cursor, Windsurf, atau agen LLM kustom ke pemutar musik melalui JSON-RPC di port 8800. Minta AI Anda mengantrekan playlist, merangkum lirik, atau menyetel equalizer saat ngoding.",
      super_recap_title: "Rekap & Kebiasaan Mendengar Pribadi",
      super_recap_desc: "Lihat musisi favorit, lagu yang paling sering diputar, dan tren mendengarkan mingguan dengan tampilan kartu yang bersih. 100% data tersimpan di database lokal SQLite Anda—tidak pernah dikirim ke internet.",
      super_discord_title: "Discord Rich Presence",
      super_discord_desc: "Tampilkan lagu yang sedang diputar, sampul album, nama musisi, dan sisa durasi langsung di profil Discord Anda sehingga rekan Anda tahu apa yang sedang Anda nikmati.",
      super_theme_title: "Tema Kustom & Desain Palet",
      super_theme_desc: "Sesuaikan estetika desktop Anda dengan 5 palet warna yang dirancang teliti (Obsidian Void, Priangan Emerald, Midnight Studio, Nordic Frost, Crimson) ditambah pemilih warna aksen kustom.",
      dl_eyebrow: "Pasang SoraFy",
      dl_title: "Unduh untuk sistem operasi pilihan Anda.",
      dl_desc: "Gratis selamanya. Tanpa telemetri, tanpa akun tersembunyi, dan tanpa biaya instalasi. Tersedia untuk Linux, Windows, macOS, dan Android.",
      dl_recommended: "Direkomendasikan",
      dl_universal: "Universal Linux",
      comp_eyebrow: "Perbandingan",
      comp_title: "Bagaimana SoraFy dibanding layanan streaming komersial.",
      comp_desc: "Ulasan perbandingan lugas dan jujur tentang keunggulan SoraFy dibanding platform streaming berpemilik.",
      comp_col_feature: "Fitur",
      comp_cost: "Biaya & Langganan",
      comp_ads: "Iklan Audio & Banner",
      comp_login: "Kewajiban Akun / Registrasi",
      comp_import: "Impor Spotify / Apple",
      comp_eq: "Equalizer Parametrik DSP",
      comp_offline: "Penyimpanan Offline",
      comp_protocols: "Terminal MPD & AI MCP",
      comp_privacy: "Privasi & Bebas Telemetri",
      faq_eyebrow: "Tanya Jawab",
      faq_title: "Pertanyaan yang Sering Diajukan",
      faq_desc: "Jawaban lugas dan faktual tanpa istilah yang membingungkan.",
      faq_q1: "Dari mana SoraFy memperoleh musiknya?",
      faq_a1: "SoraFy mengindeks dan memutar audio dari sumber publik terbuka di web tanpa menyimpan atau menjual kembali konten berhak cipta. Mekanismenya serupa dengan pemutar open source seperti Nuclear Player, NewPipe, dan FreeTube.",
      faq_q2: "Apakah SoraFy aman dan menjaga privasi saya?",
      faq_a2: "Ya. SoraFy sepenuhnya bersumber terbuka dengan lisensi GNU GPL v3. Tidak ada skrip pelacak, SDK analitik, pengiriman data telemetri, maupun registrasi akun cloud paksaan. Seluruh preferensi, riwayat, dan cache tersimpan aman di perangkat Anda.",
      faq_q3: "Bagaimana cara impor playlist tanpa perlu login akun?",
      faq_a3: "SoraFy membaca metadata publik (judul lagu, artis, dan album) dari tautan playlist publik Spotify dan Apple Music melalui API terbuka. Lagu-lagu tersebut kemudian dicari dan dicocokkan secara otomatis dengan sumber streaming beresolusi tinggi.",
      faq_q4: "Apa itu socket protokol Music Player Daemon (MPD)?",
      faq_a4: "MPD adalah standar protokol audio Linux yang didukung berbagai utilitas terminal. SoraFy menjalankan server TCP kompatibel MPD di port 6600, sehingga perintah seperti 'mpc next' atau klien 'ncmpcpp' dapat mengontrol pemutaran tanpa repot.",
      faq_q5: "Bagaimana cara kerja remote ponsel SoraFy Jam?",
      faq_a5: "Saat Anda menekan ikon ponsel di SoraFy, aplikasi menjalankan web server lokal ringan di port 4120 dan memunculkan kode QR. Perangkat ponsel yang berada di jaringan Wi-Fi yang sama dapat memindai QR ini untuk membuka remote kontrol web tanpa instal aplikasi.",
      faq_q6: "Bisakah saya mendengarkan musik saat benar-benar offline?",
      faq_a6: "Bisa. Setiap lagu yang Anda putar otomatis tersimpan di cache disk cerdas (LRU) sehingga bisa diputar kembali tanpa koneksi internet. Anda juga bisa mengekspor lagu secara permanen ke format MP3 di folder musik lokal Anda.",
      footer_desc: "Streaming musik high-fidelity untuk desktop dan mobile. Bebas iklan, bebas biaya langganan, dan tanpa telemetri. Dibangun untuk pencinta musik dan antusias teknologi.",
      footer_license: "Dirilis di bawah GNU General Public License v3.0 (GPL-3.0).",
      footer_col_platform: "Platform",
      footer_col_features: "Fitur",
      footer_col_project: "Proyek",
      footer_back_to_top: "&uarr; Kembali ke atas"
    }
  };

  // --- State & DOM Elements ---
  let currentLang = 'en';

  const langEnBtn = document.getElementById('langEnBtn');
  const langIdBtn = document.getElementById('langIdBtn');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const heroDownloadBtn = document.getElementById('heroDownloadBtn');

  // Terminal elements
  const termTabs = document.querySelectorAll('.term-tab');
  const termCodes = document.querySelectorAll('.terminal-code');
  const copyBtn = document.getElementById('terminalCopyBtn');
  const copyLabel = document.getElementById('copyBtnLabel');

  // Download platform elements
  const dlTabs = document.querySelectorAll('.dl-tab');
  const dlPanes = document.querySelectorAll('.download-pane');

  // FAQ items
  const faqItems = document.querySelectorAll('.faq-item');

  /**
   * Applies the selected language to all data-i18n elements
   * @param {string} lang - 'en' or 'id'
   */
  function setLanguage(lang) {
    if (!I18N[lang]) return;
    currentLang = lang;
    localStorage.setItem('sorafy_site_lang', lang);
    document.documentElement.lang = lang;

    // Update buttons state
    if (langEnBtn && langIdBtn) {
      if (lang === 'en') {
        langEnBtn.classList.add('active');
        langEnBtn.setAttribute('aria-pressed', 'true');
        langIdBtn.classList.remove('active');
        langIdBtn.setAttribute('aria-pressed', 'false');
      } else {
        langIdBtn.classList.add('active');
        langIdBtn.setAttribute('aria-pressed', 'true');
        langEnBtn.classList.remove('active');
        langEnBtn.setAttribute('aria-pressed', 'false');
      }
    }

    // Translate all annotated nodes
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (I18N[lang][key] !== undefined) {
        el.innerHTML = I18N[lang][key];
      }
    });

    // Update dynamic button label for hero if OS is detected
    updateHeroDownloadButton();
  }

  /**
   * Detects the user's Operating System
   * @returns {'windows'|'linux'|'macos'|'android'|'unknown'}
   */
  function detectOS() {
    const ua = navigator.userAgent.toLowerCase();
    const platform = (navigator.platform || '').toLowerCase();

    if (ua.includes('android')) return 'android';
    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'macos';
    if (platform.includes('win') || ua.includes('windows')) return 'windows';
    if (platform.includes('mac') || ua.includes('macintosh')) return 'macos';
    if (platform.includes('linux') || ua.includes('linux')) return 'linux';
    return 'unknown';
  }

  /**
   * Selects download platform tab
   * @param {string} platform - 'windows'|'linux'|'macos'|'android'
   */
  function selectDownloadPlatform(platform) {
    dlTabs.forEach(function (t) {
      if (t.getAttribute('data-dl-tab') === platform) {
        t.classList.add('active');
        t.setAttribute('aria-selected', 'true');
      } else {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      }
    });

    dlPanes.forEach(function (p) {
      if (p.id === 'pane' + platform.charAt(0).toUpperCase() + platform.slice(1)) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
  }

  /**
   * Updates hero CTA button text and destination based on detected OS
   */
  function updateHeroDownloadButton() {
    if (!heroDownloadBtn) return;
    const os = detectOS();
    const osNames = {
      windows: 'Windows',
      linux: 'Linux',
      macos: 'macOS',
      android: 'Android',
      unknown: 'Desktop'
    };

    const targetOS = osNames[os] || 'Desktop';
    const textPrefix = currentLang === 'id' ? 'Unduh Gratis untuk ' : 'Download Free for ';
    heroDownloadBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      <span>${textPrefix}${targetOS}</span>
    `;

    heroDownloadBtn.href = '#downloads';
  }

  /**
   * Terminal tab switching & clipboard copy
   */
  function initTerminalShowcase() {
    termTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const target = this.getAttribute('data-term-tab');

        termTabs.forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');

        termCodes.forEach(function (c) {
          if (c.id === 'code' + target.charAt(0).toUpperCase() + target.slice(1)) {
            c.classList.add('active');
          } else {
            c.classList.remove('active');
          }
        });
      });
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        const activeCode = document.querySelector('.terminal-code.active');
        if (!activeCode) return;

        const textToCopy = activeCode.innerText.trim();
        navigator.clipboard.writeText(textToCopy).then(function () {
          copyBtn.classList.add('copied');
          if (copyLabel) copyLabel.textContent = currentLang === 'id' ? 'Tersalin!' : 'Copied!';

          setTimeout(function () {
            copyBtn.classList.remove('copied');
            if (copyLabel) copyLabel.textContent = currentLang === 'id' ? 'Salin' : 'Copy';
          }, 2000);
        }).catch(function (err) {
          console.error('Clipboard copy failed:', err);
        });
      });
    }
  }

  /**
   * Setup FAQ Accordion behavior
   */
  function initFAQ() {
    faqItems.forEach(function (item) {
      const trigger = item.querySelector('.faq-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');

        // Close other FAQ items for clean focus
        faqItems.forEach(function (other) {
          other.classList.remove('open');
          const otherTrigger = other.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        } else {
          item.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /**
   * Setup Mobile Navigation Drawer
   */
  function initMobileDrawer() {
    if (!mobileMenuBtn || !mobileDrawer) return;

    mobileMenuBtn.addEventListener('click', function () {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    const mobileLinks = mobileDrawer.querySelectorAll('.mobile-nav-item');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /**
   * Setup Download platform tabs
   */
  function initDownloadTabs() {
    dlTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const platform = this.getAttribute('data-dl-tab');
        selectDownloadPlatform(platform);
      });
    });

    // Auto select tab based on detected OS
    const os = detectOS();
    if (['windows', 'linux', 'macos', 'android'].includes(os)) {
      selectDownloadPlatform(os);
    }
  }

  /**
   * Initialize All Components
   */
  function init() {
    // 1. Language preference resolution
    const savedLang = localStorage.getItem('sorafy_site_lang');
    const browserLang = (navigator.language || 'en').toLowerCase().startsWith('id') ? 'id' : 'en';
    const initialLang = savedLang || browserLang || 'en';

    if (langEnBtn) {
      langEnBtn.addEventListener('click', function () { setLanguage('en'); });
    }
    if (langIdBtn) {
      langIdBtn.addEventListener('click', function () { setLanguage('id'); });
    }

    setLanguage(initialLang);

    // 2. Component initializations
    initTerminalShowcase();
    initFAQ();
    initMobileDrawer();
    initDownloadTabs();
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
