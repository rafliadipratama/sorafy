export type PlatformId = 'windows' | 'macos' | 'linux' | 'android' | 'ios';

export interface DownloadPackage {
  id: string;
  name: string;
  filename: string;
  format: string;
  downloadUrl: string;
  size: string;
  arch: string;
  // Set only when a package lags behind CURRENT_VERSION.
  version?: string;
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

// Sizes and checksums are copied from the release's sha256sums.txt and asset list.
// Update them together with the version, or the site advertises files that do not match.
export const CURRENT_VERSION = '2.1.2';
export const RELEASE_BASE_URL = 'https://github.com/rafliadipratama/sorafy/releases/latest';
export const CHECKSUMS_URL = `${RELEASE_BASE_URL}/download/sha256sums.txt`;

const v = CURRENT_VERSION;
const asset = (filename: string) => `${RELEASE_BASE_URL}/download/${filename}`;

// The iOS build stopped being published after v2.0.0, so it links to that release directly.
const IOS_VERSION = '2.0.0';

export const PLATFORMS: Record<PlatformId, PlatformConfig> = {
  windows: {
    id: 'windows',
    name: 'Windows',
    primaryPackageId: 'win-setup',
    ctaSubtext: {
      en: `v${v} • Windows 10 / 11 (64-bit) • Direct Download`,
      id: `v${v} • Windows 10 / 11 (64-bit) • Unduh Langsung`
    },
    packages: [
      {
        id: 'win-setup',
        name: 'SoraFy for Windows (.exe)',
        filename: `SoraFy.Setup.${v}.exe`,
        format: '.exe',
        downloadUrl: asset(`SoraFy.Setup.${v}.exe`),
        size: '131 MB',
        arch: 'Windows 10 / 11 (64-bit)',
        badge: {
          en: 'Recommended',
          id: 'Disarankan'
        },
        desc: {
          en: 'Standard Windows installer with a desktop shortcut and Start Menu entry.',
          id: 'Installer resmi Windows lengkap dengan shortcut desktop dan entri Start Menu.'
        },
        sha256: '1263da63a683111290963ae46aef7a16b3ce6588f7e49404e3ab16308e791e61'
      }
    ]
  },
  linux: {
    id: 'linux',
    name: 'Linux',
    primaryPackageId: 'linux-appimage',
    ctaSubtext: {
      en: `v${v} • Universal Linux (x86_64) • Direct Download`,
      id: `v${v} • Universal Linux (x86_64) • Unduh Langsung`
    },
    packages: [
      {
        id: 'linux-appimage',
        name: 'Universal AppImage Package',
        filename: `SoraFy-${v}.AppImage`,
        format: '.AppImage',
        downloadUrl: asset(`SoraFy-${v}.AppImage`),
        size: '161 MB',
        arch: 'x86_64',
        badge: {
          en: 'Universal',
          id: 'Universal'
        },
        desc: {
          en: 'Self-contained executable for Ubuntu, Fedora, Arch, Debian, openSUSE, and any standard Linux distro.',
          id: 'Aplikasi portabel mandiri untuk Ubuntu, Fedora, Arch, Debian, openSUSE, dan semua distro Linux modern.'
        },
        sha256: '0997560b407f593b508c24c8d8d1f8d5097e7cfccd62d6b98be9245cc6f573af'
      },
      {
        id: 'linux-deb',
        name: 'Debian / Ubuntu Package (.deb)',
        filename: `sorafy_${v}_amd64.deb`,
        format: '.deb',
        downloadUrl: asset(`sorafy_${v}_amd64.deb`),
        size: '136 MB',
        arch: 'APT / dpkg (amd64)',
        badge: {
          en: 'Debian / Ubuntu',
          id: 'Debian / Ubuntu'
        },
        desc: {
          en: 'Native package for Debian, Ubuntu, Linux Mint, and Pop!_OS with system package manager integration.',
          id: 'Paket installer native untuk Debian, Ubuntu, Linux Mint, dan Pop!_OS dengan manajemen sistem apt.'
        },
        sha256: '3b236fb3ec94f2dfe4b7b5bcb5a3330f7cd06366606fde279a6abc72834bdc3e'
      },
      {
        id: 'linux-rpm',
        name: 'Fedora / openSUSE Package (.rpm)',
        filename: `sorafy-${v}.x86_64.rpm`,
        format: '.rpm',
        downloadUrl: asset(`sorafy-${v}.x86_64.rpm`),
        size: '125 MB',
        arch: 'DNF / Zypper (x86_64)',
        badge: {
          en: 'Fedora / openSUSE',
          id: 'Fedora / openSUSE'
        },
        desc: {
          en: 'Native package for Fedora, RHEL-based distros, and openSUSE, installed through the system package manager.',
          id: 'Paket installer native untuk Fedora, distro berbasis RHEL, dan openSUSE melalui package manager sistem.'
        },
        sha256: '4509006ac78fd65ee656380084b2ec095313f942599fd8110bb1cda7056350a6'
      }
    ]
  },
  macos: {
    id: 'macos',
    name: 'macOS',
    primaryPackageId: 'mac-arm',
    ctaSubtext: {
      en: `v${v} • Apple Silicon (M1 and later) • Direct Download`,
      id: `v${v} • Apple Silicon (M1 ke atas) • Unduh Langsung`
    },
    packages: [
      {
        id: 'mac-arm',
        name: 'macOS (Apple Silicon)',
        filename: `SoraFy-${v}-arm64.dmg`,
        format: '.dmg',
        downloadUrl: asset(`SoraFy-${v}-arm64.dmg`),
        size: '161 MB',
        arch: 'Apple Silicon ARM64',
        badge: {
          en: 'Apple Silicon',
          id: 'Apple Silicon'
        },
        desc: {
          en: 'Native ARM64 DMG for Apple Silicon MacBooks, Mac mini, iMac, and Mac Studio. Intel Macs are not supported by this build.',
          id: 'Bundle DMG ARM64 native untuk MacBook, Mac mini, iMac, dan Mac Studio Apple Silicon. Mac Intel belum didukung oleh build ini.'
        },
        sha256: '98fce54a84c0ee5012ddb6b33bfe918d6687e37cd26c151bab6159ce890e86e4'
      }
    ]
  },
  android: {
    id: 'android',
    name: 'Android',
    primaryPackageId: 'android-apk',
    ctaSubtext: {
      en: `v${v} • Android 7.0+ (ARM64) • Direct APK`,
      id: `v${v} • Android 7.0+ (ARM64) • APK Langsung`
    },
    packages: [
      {
        id: 'android-apk',
        name: 'SoraFy for Android (.apk)',
        filename: 'app-release.apk',
        format: '.apk',
        downloadUrl: asset('app-release.apk'),
        size: '4.5 MB',
        arch: 'arm64-v8a • Android 7.0+',
        badge: {
          en: 'Recommended',
          id: 'Disarankan'
        },
        desc: {
          en: 'Built for the 64-bit ARM processors in nearly every phone and tablet sold since 2017.',
          id: 'Dibuat untuk prosesor ARM 64-bit yang dipakai hampir semua ponsel dan tablet sejak 2017.'
        },
        sha256: 'dbe8ad459ab0d02498b44e68e2a9b488e0864bb0f6da6a5ac0302c4e8350c51d'
      },
      {
        id: 'android-universal',
        name: 'Universal APK (all devices)',
        filename: 'app-universal-release.apk',
        format: '.apk',
        downloadUrl: asset('app-universal-release.apk'),
        size: '4.5 MB',
        arch: 'arm64 • armv7 • x86 • x86_64',
        badge: {
          en: 'Universal',
          id: 'Universal'
        },
        desc: {
          en: 'Runs on older 32-bit phones, Chromebooks, and emulators. Pick this one if the standard APK will not install.',
          id: 'Berjalan di ponsel 32-bit lama, Chromebook, dan emulator. Pilih ini bila APK standar gagal dipasang.'
        },
        sha256: '78be4ff27350a436676655c89b908d8439e43da9bca5772a0c274e01abda9760'
      }
    ]
  },
  ios: {
    id: 'ios',
    name: 'iOS',
    primaryPackageId: 'ios-ipa',
    ctaSubtext: {
      en: `v${IOS_VERSION} beta • iOS 16.0+ (ARM64) • SideStore & TrollStore IPA`,
      id: `v${IOS_VERSION} beta • iOS 16.0+ (ARM64) • IPA untuk SideStore & TrollStore`
    },
    packages: [
      {
        id: 'ios-ipa',
        name: 'SoraFy for iOS (.ipa)',
        filename: 'SoraFy-iOS.ipa',
        format: '.ipa',
        downloadUrl: `https://github.com/rafliadipratama/sorafy/releases/download/v${IOS_VERSION}/SoraFy-iOS.ipa`,
        size: '205 KB',
        arch: 'arm64 • iOS 16.0+',
        version: IOS_VERSION,
        badge: {
          en: 'Beta',
          id: 'Beta'
        },
        desc: {
          en: `Older v${IOS_VERSION} build, unsigned, for sideloading with SideStore, Sideloadly, or TrollStore. It does not include the fixes in v${v}.`,
          id: `Build lama v${IOS_VERSION} tanpa tanda tangan, untuk sideload via SideStore, Sideloadly, atau TrollStore. Belum memuat perbaikan di v${v}.`
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
