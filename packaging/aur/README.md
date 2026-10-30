# SoraFy AUR Package (`sorafy-bin`)

Resep paket resmi untuk mendistribusikan SoraFy ke Arch User Repository (AUR).

## Uji Coba Lokal (Arch Linux)
Untuk mengetes instalasi paket secara lokal di Arch Linux:
```bash
cd packaging/aur
makepkg -si
```

## Publikasi ke AUR
1. Daftarkan akun di [https://aur.archlinux.org/register](https://aur.archlinux.org/register) dan pasang SSH public key Anda di profil AUR.
2. Clone repositori AUR kosong Anda:
   ```bash
   git clone ssh://aur@aur.archlinux.org/sorafy-bin.git
   ```
3. Salin `PKGBUILD` dan `.SRCINFO` ke repositori tersebut:
   ```bash
   cp PKGBUILD .SRCINFO sorafy-bin/
   cd sorafy-bin
   git add PKGBUILD .SRCINFO
   git commit -m "feat: initial release v2.0.0"
   git push origin master
   ```
4. Selesai! Pengguna Arch sekarang bisa menginstal dengan:
   ```bash
   yay -S sorafy-bin
   # atau
   paru -S sorafy-bin
   ```
