# SoraFy iOS (Swift & SwiftUI Native Port)

Aplikasi klien musik modern untuk iOS yang di-porting langsung dari arsitektur Kotlin (Android) ke **Swift & SwiftUI native**, dengan estetika desain terinspirasi Apple Music ("Liquid Glass"), latar belakang ambient mesh dinamis, dan sinkronisasi lirik tanpa efek neon menyala.

---

## 📱 Arsitektur & Struktur Proyek

```
iosApp/
├── Package.swift                  # Swift Package Manager manifest
├── README.md                      # Dokumentasi teknis & panduan build
└── SoraFy/
    ├── App/
    │   └── SoraFyApp.swift        # Entry point SwiftUI (@main) & AVAudioSession background audio
    ├── Models/
    │   ├── Track.swift            # Model lagu, artis, filter judul otomatis, durasi
    │   ├── Album.swift            # Model album & tracklist
    │   ├── Playlist.swift         # Model playlist
    │   ├── Lyrics.swift           # Model lirik tersinkronisasi (LRC) & kata/suku kata
    │   └── HomeData.swift         # Model data beranda dan hasil pencarian
    ├── Services/
    │   ├── AudioPlayerService.swift     # Mesin pemutar AVPlayer + MPNowPlayingInfoCenter & Remote Command
    │   ├── MusicStreamSource.swift      # InnerTube YouTube Music resolver (klien VISIONOS & iOS unthrottled)
    │   ├── LrcLibService.swift          # Pengambil & parser lirik real-time LRCLIB
    │   └── CacheManager.swift           # Penyimpanan lokal lagu disukai & riwayat (UserDefaults JSON)
    ├── ViewModels/
    │   └── MusicPlayerViewModel.swift   # State manager utama (@MainActor ObservableObject)
    ├── Views/
    │   ├── MainTabView.swift      # Navigasi tab (Beranda, Cari, Pustaka) + MiniPlayer melayang
    │   ├── Home/
    │   │   └── HomeView.swift     # Layar beranda (Top 50 Indonesia, Putar Lagi)
    │   ├── Search/
    │   │   └── SearchView.swift   # Pencarian instan lagu, artis, dan album
    │   ├── Library/
    │   │   └── LibraryView.swift  # Layar lagu disukai & riwayat pemutaran
    │   └── Player/
    │       ├── MiniPlayerView.swift     # Mini player kapsul kaca melayang di atas tab bar
    │       ├── NowPlayingView.swift     # Layar pemutar penuh bergaya Apple Music
    │       ├── LyricsView.swift         # Lirik tersinkronisasi dengan auto-scroll dan tanpa neon glow
    │       ├── StatsForNerdsView.swift  # Diagnostik audio real-time (codec, bitrate, sample rate, buffer)
    │       └── AmbientMeshBackdrop.swift# Gradasi ambient cover album yang lembut dan dinamis
    └── Resources/
        └── Info.plist             # Konfigurasi background audio mode & transport security
```

---

## ✨ Fitur Unggulan di iOS

1. **Native AVPlayer dengan Background Playback**:
   - Berjalan lancar di latar belakang saat aplikasi diminimalkan atau layar dimatikan berkat konfigurasi `AVAudioSessionCategoryPlayback`.
   - Terintegrasi penuh dengan **Lock Screen** dan **Control Center iOS** (`MPNowPlayingInfoCenter` & `MPRemoteCommandCenter`), termasuk kontrol tombol headphone dan AirPods.
2. **Ambient Mesh Backdrop (Gaya Apple Music)**:
   - Gradasi warna lembut yang diekstrak langsung dari cover album lagu yang aktif dengan efek gaussian blur 80px tanpa efek neon silau.
3. **Lirik Tersinkronisasi**:
   - Mendukung format lirik LRC dengan penyorotan baris aktif berbobot tebal putih bersih dan peredupan otomatis baris yang belum dinyanyikan.
   - Ketuk baris lirik mana pun untuk langsung melompat (*seek*) ke menit lagu tersebut.
4. **Stats for Nerds**:
   - Memantau detail teknis audio secara langsung: Codec (AAC itag 140), Bitrate (160 kbps High Quality), Sample Rate (48,000 Hz Stereo), dan Hardware Decoding.
5. **Pencarian Cepat & Bersih**:
   - Terkoneksi langsung ke InnerTube API dengan pemfilteran konten regional yang ketat agar hasil pencarian tetap relevan.

---

## 🛠 Cara Membuka & Menjalankan di Mac / Xcode

1. Buka folder `iosApp` di Xcode:
   ```bash
   open iosApp/Package.swift
   ```
   *Atau buat Xcode Project baru (iOS App), lalu seret folder `iosApp/SoraFy` ke dalam proyek.*
2. Pilih target perangkat atau simulator (misal: **iPhone 15 Pro** / **iPhone 16**).
3. Jalankan aplikasi dengan menekan tombol **Run (Cmd + R)**.
