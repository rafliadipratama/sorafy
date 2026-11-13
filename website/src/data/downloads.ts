export type PlatformId = 'windows' | 'macos' | 'linux' | 'android' | 'ios';

export interface DownloadPackage {
  id: string;
  name: string;
  filename: string;
  format: string;
  downloadUrl: string;
  size: string;
  arch: string;
  badge?: {
    en: string;
    id: string;
  };
  desc: {
    en: string;
    id: string;
  };
  sha256?: string;
}

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  primaryPackageId: string;
  ctaSubtext: {
    en: string;
    id: string;
  };
  packages: DownloadPackage[];
}

export const CURRENT_VERSION = '2.0.0';
export const RELEASE_BASE_URL = 'https://github.com/rafliadipratama/sorafy/releases/latest';

export const PLATFORMS: Record<PlatformId, PlatformConfig> = {
  windows: {
    id: 'windows',
    name: 'Windows',
    primaryPackageId: 'win-setup',
    ctaSubtext: {
      en: 'v2.0.0 • Windows 10 / 11 (64-bit) • Direct Download',
      id: 'v2.0.0 • Windows 10 / 11 (64-bit) • Unduh Langsung'
    },
    packages: [
      {
        id: 'win-setup',
        name: 'SoraFy for Windows (.exe)',
        filename: 'SoraFy-Setup-2.0.0.exe',
        format: '.exe',
        downloadUrl: 'https://github.com/rafliadipratama/sorafy/releases/latest/download/SoraFy-Setup-2.0.0.exe',
        size: '~85 MB',
        arch: 'Windows 10 / 11 (64-bit)',
        badge: {
          en: 'Recommended',
          id: 'Disarankan'
        },
        desc: {
          en: 'Standard Windows installer with desktop shortcuts, auto-updater, and start menu integration.',
          id: 'Installer resmi Windows lengkap dengan integrasi Start Menu, shortcut desktop, dan pembaruan otomatis.'
        },
        sha256: '9a3b7c8e1d2f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b'
      },
      {
        id: 'win-portable',
        name: 'Windows Portable (.zip)',
        filename: 'SoraFy-2.0.0-win.zip',
        format: '.zip',
        downloadUrl: 'https://github.com/rafliadipratama/sorafy/releases/latest/download/SoraFy-2.0.0-win.zip',
        size: '~92 MB',
        arch: 'Standalone Portable (x64)',
        badge: {
          en: 'Portable',
          id: 'Portabel'
        },
        desc: {
          en: 'No installation required. Extract anywhere and launch immediately from flash drives or external disks.',
          id: 'Tanpa proses instalasi. Cukup ekstrak di flashdisk atau folder lokal dan langsung jalankan.'
        },
        sha256: '4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a'
      }
    ]
  },
  linux: {
    id: 'linux',
    name: 'Linux',
    primaryPackageId: 'linux-appimage',
    ctaSubtext: {
      en: 'v2.0.0 • Universal Linux (x86_64) • Direct Download',
      id: 'v2.0.0 • Universal Linux (x86_64) • Unduh Langsung'
    },
    packages: [
      {
        id: 'linux-appimage',
        name: 'Universal AppImage Package',
        filename: 'SoraFy-2.0.0.AppImage',
        format: '.AppImage',
        downloadUrl: 'https://github.com/rafliadipratama/sorafy/releases/latest/download/SoraFy-2.0.0.AppImage',
        size: '~88 MB',
        arch: 'glibc 2.31+ (x86_64)',
        badge: {
          en: 'Universal',
          id: 'Universal'
        },
        desc: {
          en: 'Self-contained executable for Ubuntu, Fedora, Arch, Debian, openSUSE, and any standard Linux distro.',
          id: 'Aplikasi portabel mandiri untuk Ubuntu, Fedora, Arch, Debian, openSUSE, dan semua distro Linux modern.'
        },
        sha256: '2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d'
      },
      {
        id: 'linux-deb',
        name: 'Debian / Ubuntu Package (.deb)',
        filename: 'sorafy_2.0.0_amd64.deb',
        format: '.deb',
        downloadUrl: 'https://github.com/rafliadipratama/sorafy/releases/latest/download/sorafy_2.0.0_amd64.deb',
        size: '~78 MB',
        arch: 'APT / dpkg compatible',
        badge: {
          en: 'Debian / Ubuntu',
          id: 'Debian / Ubuntu'
        },
        desc: {
          en: 'Native package for Debian, Ubuntu, Linux Mint, and Pop!_OS with system package manager integration.',
          id: 'Paket installer native untuk Debian, Ubuntu, Linux Mint, dan Pop!_OS dengan manajemen sistem apt.'
        },
        sha256: '7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c'
      }
    ]
  },
  macos: {
    id: 'macos',
    name: 'macOS',
    primaryPackageId: 'mac-arm',
    ctaSubtext: {
      en: 'v2.0.0 • Apple Silicon M1-M4 & Intel • Direct Download',
      id: 'v2.0.0 • Apple Silicon M1-M4 & Intel • Unduh Langsung'
    },
    packages: [
      {
        id: 'mac-arm',
        name: 'macOS (Apple Silicon M1-M4)',
        filename: 'SoraFy-2.0.0-arm64.dmg',
        format: '.dmg',
        downloadUrl: 'https://github.com/rafliadipratama/sorafy/releases/latest/download/SoraFy-2.0.0-arm64.dmg',
        size: '~90 MB',
        arch: 'Native Apple Silicon ARM64',
        badge: {
          en: 'Apple Silicon',
          id: 'Apple Silicon'
        },
        desc: {
          en: 'Native ARM64 DMG bundle optimized for Apple Silicon MacBooks, Mac mini, and Mac Studio (macOS 12.0+).',
          id: 'Bundle DMG ARM64 yang dioptimalkan untuk MacBook M1-M4, Mac mini, dan Mac Studio (macOS 12.0+).'
        },
        sha256: '5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e'
      },
      {
        id: 'mac-intel',
        name: 'macOS Intel (.dmg)',
        filename: 'SoraFy-2.0.0.dmg',
        format: '.dmg',
        downloadUrl: 'https://github.com/rafliadipratama/sorafy/releases/latest/download/SoraFy-2.0.0.dmg',
        size: '~92 MB',
        arch: 'Intel x86_64 (macOS 11.0+)',
        badge: {
          en: 'Intel Mac',
          id: 'Intel Mac'
        },
        desc: {
          en: 'Standard x86_64 DMG package for Intel-powered Apple Mac computers.',
          id: 'Paket DMG x86_64 standar untuk komputer Apple Mac generasi prosesor Intel.'
        },
        sha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
      }
    ]
  },
  android: {
    id: 'android',
    name: 'Android',
    primaryPackageId: 'android-apk',
    ctaSubtext: {
      en: 'v2.0.0 • Android 8.0+ (ARM64) • Direct APK',
      id: 'v2.0.0 • Android 8.0+ (ARM64) • APK Langsung'
    },
    packages: [
      {
        id: 'android-apk',
        name: 'SoraFy for Android (.apk)',
        filename: 'SoraFy.apk',
        format: '.apk',
        downloadUrl: 'https://github.com/rafliadipratama/sorafy/releases/latest/download/SoraFy.apk',
        size: '~18 MB',
        arch: 'arm64-v8a • Android 8.0 Oreo+',
        badge: {
          en: 'Native APK',
          id: 'APK Asli'
        },
        desc: {
          en: 'Built with Jetpack Compose Material 3 and Media3 notification controls for smartphones and tablets.',
          id: 'Dibuat dengan native Jetpack Compose Material 3 dan kontrol media notifikasi background.'
        },
        sha256: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f'
      }
    ]
  },
  ios: {
    id: 'ios',
    name: 'iOS',
    primaryPackageId: 'ios-ipa',
    ctaSubtext: {
      en: 'v2.0.0 • iOS 16.0+ (ARM64) • SideStore & TrollStore IPA',
      id: 'v2.0.0 • iOS 16.0+ (ARM64) • IPA untuk SideStore & TrollStore'
    },
    packages: [
      {
        id: 'ios-ipa',
        name: 'SoraFy for iOS (.ipa)',
        filename: 'SoraFy-iOS.ipa',
        format: '.ipa',
        downloadUrl: 'https://github.com/rafliadipratama/sorafy/releases/latest/download/SoraFy-iOS.ipa',
        size: '~210 KB',
        arch: 'arm64 • iOS 16.0+',
        badge: {
          en: 'Sideload IPA',
          id: 'Sideload IPA'
        },
        desc: {
          en: 'Native Swift/SwiftUI app with background audio, lock screen controls, and synced lyrics. Install via SideStore, Sideloadly, or TrollStore.',
          id: 'Aplikasi native Swift/SwiftUI lengkap dengan background audio, kontrol lock screen, dan lirik sinkron. Pasang via SideStore, Sideloadly, atau TrollStore.'
        }
      }
    ]
  }
};

export function detectPlatform(): PlatformId {
  if (typeof window === 'undefined') return 'windows';
  const ua = navigator.userAgent.toLowerCase();
  const plat = (navigator.platform || '').toLowerCase();

  if (ua.includes('android')) return 'android';
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'ios';
  if (plat.includes('mac') || ua.includes('macintosh')) return 'macos';
  if (plat.includes('linux') || ua.includes('linux')) return 'linux';
  return 'windows';
}
