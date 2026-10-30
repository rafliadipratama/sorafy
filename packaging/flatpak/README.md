# SoraFy Flathub Package (Flatpak)

Manifest dan metadata untuk merilis SoraFy ke Flathub.

## Uji Coba Build Flatpak Secara Lokal
Pastikan `flatpak-builder` telah terpasang:
```bash
sudo dnf install flatpak-builder  # Fedora
# atau
sudo apt install flatpak-builder  # Ubuntu/Debian

cd packaging/flatpak
flatpak-builder --user --install --force-clean build-dir org.sorafy.SoraFy.yaml
flatpak run org.sorafy.SoraFy
```

## Publikasi ke Flathub
1. Fork repositori resmi [https://github.com/flathub/flathub](https://github.com/flathub/flathub).
2. Buat branch baru bernama `new-pr-sorafy`:
   ```bash
   git checkout -b new-pr-sorafy
   ```
3. Letakkan file manifest (`org.sorafy.SoraFy.yaml`, `org.sorafy.SoraFy.metainfo.xml`, `org.sorafy.SoraFy.desktop`, `icon.png`) ke dalam folder baru `org.sorafy.SoraFy/`.
4. Ganti nilai SHA256 pada file YAML dengan hash SHA256 aktual dari file `.deb` rilis.
5. Buat Pull Request ke `flathub/flathub`.
6. Tim Flathub akan mereview manifest dan otomatis membuat repositori khusus `https://github.com/flathub/org.sorafy.SoraFy`.
7. Setelah di-merge, pengguna Linux di seluruh dunia dapat menginstal langsung via:
   ```bash
   flatpak install flathub org.sorafy.SoraFy
   ```
