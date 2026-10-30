# SoraFy winget Manifest (Windows Package Manager)

Manifest resmi untuk mendistribusikan SoraFy ke repositori resmi Microsoft `winget-pkgs`.

## Metode 1: Menggunakan CLI `wingetcreate` (Paling Praktis)
Setelah merilis file biner `.exe` di GitHub Releases, jalankan perintah ini di Windows PowerShell:
```powershell
winget install wingetcreate
wingetcreate new https://github.com/rafliadipratama/sorafy/releases/download/v2.0.0/SoraFy-Setup-2.0.0.exe
```
`wingetcreate` akan otomatis menghitung hash SHA256, mengekstrak metadata, menguji instalasi, dan membuat Pull Request langsung ke [microsoft/winget-pkgs](https://github.com/microsoft/winget-pkgs).

## Metode 2: Manual Pull Request
1. Fork [https://github.com/microsoft/winget-pkgs](https://github.com/microsoft/winget-pkgs).
2. Salin folder manifest:
   `manifests/r/RafliAdiPratama/SoraFy/2.0.0/`
   ke dalam direktori fork Anda.
3. Masukkan nilai hash SHA256 aktual dari file installer `.exe` pada `RafliAdiPratama.SoraFy.installer.yaml`.
4. Uji validasi manifest:
   ```powershell
   winget validate --manifest manifests/r/RafliAdiPratama/SoraFy/2.0.0
   ```
5. Buat Pull Request ke `microsoft/winget-pkgs`. Setelah lolos automated CI validation dan di-merge, perintah:
   ```cmd
   winget install SoraFy
   ```
   akan langsung aktif di seluruh mesin Windows.
