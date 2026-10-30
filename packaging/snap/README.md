# SoraFy Snapcraft Package (Snap Store)

Konfigurasi untuk mendistribusikan SoraFy ke Canonical Snap Store.

## Metode 1: Menggunakan electron-builder (Otomatis)
Paket `.snap` otomatis dibangun saat menjalankan:
```bash
cd desktop
npm run build:snap
# atau
npm run build:linux:all
```
File biner `.snap` akan dihasilkan di dalam folder `desktop/dist/`.

## Metode 2: Rilis ke Snap Store
1. Daftarkan nama snap `sorafy` di [https://snapcraft.io/](https://snapcraft.io/):
   ```bash
   snapcraft register sorafy
   ```
2. Login ke Snapcraft CLI:
   ```bash
   snapcraft login
   ```
3. Unggah file `.snap` yang sudah dibangun ke channel `stable`:
   ```bash
   snapcraft upload --release=stable desktop/dist/sorafy_2.0.0_amd64.snap
   ```
4. Setelah terunggah, pengguna Linux dapat menginstal dengan:
   ```bash
   sudo snap install sorafy
   ```
