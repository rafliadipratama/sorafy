# SoraFy Homebrew Cask

Formula Cask resmi untuk macOS menggunakan Homebrew.

## Metode 1: Custom Tap (Langsung Aktif Mandiri)
1. Buat repositori publik di akun GitHub Anda:
   `https://github.com/rafliadipratama/homebrew-sorafy`
2. Letakkan folder `Casks/sorafy.rb` di dalam repositori tersebut:
   ```bash
   homebrew-sorafy/
   └── Casks/
       └── sorafy.rb
   ```
3. Pengguna macOS dapat langsung menginstal dengan:
   ```bash
   brew tap rafliadipratama/sorafy
   brew install --cask sorafy
   ```

## Metode 2: Submit ke Official Homebrew Cask
Jika ingin pengguna bisa mengetik langsung `brew install --cask sorafy` tanpa tap:
1. Fork `https://github.com/Homebrew/homebrew-cask`.
2. Letakkan `sorafy.rb` di dalam direktori `Casks/s/sorafy.rb`.
3. Hitung SHA256 dari file DMG rilis (`shasum -a 256 SoraFy-2.0.0.dmg`) dan ganti `:no_check` dengan nilai hash tersebut.
4. Uji formula secara lokal di macOS:
   ```bash
   brew audit --cask --new sorafy
   brew install --cask ./Casks/sorafy.rb
   ```
5. Buat Pull Request ke `Homebrew/homebrew-cask`.
