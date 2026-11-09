# LabLink — Implementasi Komponen Dasar Antarmuka (Tugas 2)

Implementasi antarmuka aplikasi web **LabLink (Sistem Katalog & Peminjaman Alat Laboratorium ITTS)** dari wireframe Tugas 1 menggunakan HTML5 Semantik, CSS Custom Properties, dan Vanilla JavaScript murni.

## Deskripsi Proyek
LabLink dirancang berdasarkan riset kebutuhan pengguna pada PT M2–M4 untuk membantu mahasiswa memeriksa ketersediaan stok, kondisi fisik, serta kelengkapan alat laboratorium sebelum datang ke ruang praktikum. Aplikasi ini juga memisahkan secara jelas antara status awal **Menunggu persetujuan** dengan **Resi Digital (`#LL-019`)** yang baru diterbitkan setelah pengembalian diverifikasi secara fisik oleh pengelola laboratorium.

## 5 Komponen Utama yang Diimplementasikan
1. **Sidebar Navigasi & Header Status (`#sidebar-nav`, `#topbar`)**: Sidebar selebar `222px` dengan indikator halaman aktif, penghitung peminjaman aktif (`#nav-loan-counter`), menu **Akun saya**, serta tombol toggle responsif untuk layar ponsel.
2. **Katalog Kartu Alat, Pencarian & Filter Tersedia (`#view-katalog`, `.alat-card`)**: Grid 2 kolom kartu perangkat laboratorium (*Raspberry Pi 4*, *MikroTik hAP ac2*, *Arduino Uno R3*, *ESP32 Dev Board*) dengan filter status `Tersedia` dan pencarian *real-time*.
3. **Panel Detail Alat & Catatan Kondisi (`#view-detail`, `.condition-note-card`)**: Menampilkan kotak visual pratinjau alat, ID inventaris (`LAB-RPI4-01`), stok, kelengkapan, dan catatan kondisi perangkat secara dinamis.
4. **Formulir Ajukan Peminjaman & Validasi Status Awal (`#form-peminjaman`, `.info-callout`)**: Formulir 2×2 kolom dengan validasi JavaScript dan kotak informasi status awal *Menunggu persetujuan*.
5. **Panel Peminjaman Saya, Kartu Resi Digital (`#LL-019`) & Dasbor Pengelola (`#view-peminjaman`, `#resi-card`, `#view-pengelola`)**: Mengelola pengajuan pengembalian, pelaporan masalah alat, tampilan bukti resi digital `#LL-019`, serta simulasi persetujuan oleh pengelola lab.

## Struktur Proyek
```text
├── index.html   # Struktur HTML5 semantik untuk seluruh komponen utama LabLink
├── styles.css   # Styling visual dengan CSS Custom Properties (Teal #0f766e & skala spacing 8px)
├── script.js    # Interaktivitas DOM: navigasi, filter katalog, detail dinamis, & validasi form
└── README.md    # Dokumentasi proyek