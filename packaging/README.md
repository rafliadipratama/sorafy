# SoraFy Packaging & Distribution Hub

Direktori ini berisi seluruh resep, manifest, dan instruksi publikasi resmi untuk mendistribusikan SoraFy ke berbagai package manager:

| Package Manager | Platform Target | Perintah Pengguna | Lokasi Manifest |
| :--- | :--- | :--- | :--- |
| **AUR** | Arch Linux / Manjaro | `yay -S sorafy-bin` | [`aur/`](file:///home/rafliadipratama/sorafy/packaging/aur/) |
| **Homebrew** | macOS | `brew install --cask sorafy` | [`homebrew/`](file:///home/rafliadipratama/sorafy/packaging/homebrew/) |
| **winget** | Windows 10 & 11 | `winget install SoraFy` | [`winget/`](file:///home/rafliadipratama/sorafy/packaging/winget/) |
| **Snapcraft** | Ubuntu / Debian / Linux | `sudo snap install sorafy` | [`snap/`](file:///home/rafliadipratama/sorafy/packaging/snap/) |
| **Flathub** | Universal Linux | `flatpak install flathub org.sorafy.SoraFy` | [`flatpak/`](file:///home/rafliadipratama/sorafy/packaging/flatpak/) |

---

## 1. AUR (`packaging/aur`)
- Berkas: `PKGBUILD`, `.SRCINFO`
- Panduan: Push langsung ke `ssh://aur@aur.archlinux.org/sorafy-bin.git`.

## 2. Homebrew (`packaging/homebrew`)
- Berkas: `Casks/sorafy.rb`
- Panduan: Buat repo GitHub `rafliadipratama/homebrew-sorafy` atau ajukan ke `Homebrew/homebrew-cask`.

## 3. winget (`packaging/winget`)
- Berkas: `manifests/r/RafliAdiPratama/SoraFy/2.0.0/*.yaml`
- Panduan: Jalankan `wingetcreate new <url-exe>` atau ajukan PR ke `microsoft/winget-pkgs`.

## 4. Snapcraft (`packaging/snap`)
- Berkas: `snapcraft.yaml` (didukung native oleh `electron-builder`)
- Panduan: Daftarkan di `snapcraft.io` lalu jalankan `snapcraft upload`.

## 5. Flathub (`packaging/flatpak`)
- Berkas: `org.sorafy.SoraFy.yaml`, `org.sorafy.SoraFy.metainfo.xml`, `org.sorafy.SoraFy.desktop`
- Panduan: Ajukan Pull Request ke `flathub/flathub`.
