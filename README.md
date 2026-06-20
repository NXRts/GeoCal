# Geometric Calculator (Angular Version)

A premium, interactive geometric calculator web application built with **Angular 18**, **TypeScript**, and **Reactive Forms**.

## Overview

Kalkulator Geometri Interaktif adalah aplikasi web modern yang menghitung properti geometris bentuk 2D (Lingkaran, Persegi Panjang, Segitiga) dan bentuk 3D (Bola, Tabung, Kubus) secara instan. Desainnya disempurnakan dengan tema *glassmorphism* gelap yang premium, visualisasi bentuk interaktif menggunakan SVG dinamis, dan sistem pencatatan riwayat kalkulasi.

## Fitur Unggulan

- **Visualisasi Geometri SVG Real-time**: Menampilkan grafik representasi SVG untuk setiap geometri yang merespon input ukuran Anda secara instan di layar.
- **Riwayat Perhitungan**: Menyimpan daftar kalkulasi sebelumnya secara lokal (`localStorage`), lengkap dengan opsi salin hasil atau hapus item.
- **Validasi Cerdas**: Validasi form responsif untuk mencegah kesalahan input (misalnya nilai negatif atau nol).
- **Desain Premium Gelap**: Desain modern menggunakan gradien bersinar, efek *backdrop-filter blur*, serta mikro-animasi.

## Struktur Direktori Utama

- `src/index.html` — Berkas HTML utama.
- `src/main.ts` — Berkas inisialisasi / bootstrap aplikasi Angular.
- `src/styles.css` — Gaya CSS global dan variabel tema.
- `src/app/`
  - `app.component.*` — Cangkang tata letak utama (Header, Grid Layout, Footer).
  - `app.config.ts` — Konfigurasi aplikasi.
  - `services/`
    - `geometry.service.ts` — Logika matematika kalkulasi bentuk geometri.
    - `history.service.ts` — Manajemen data riwayat kalkulasi di `localStorage`.
  - `components/`
    - `calculator/` — Form kalkulator dan render visual SVG dinamis.
    - `history/` — Daftar riwayat perhitungan dan aksi salin/hapus.
    - `instructions/` — Panduan langkah demi langkah penggunaan aplikasi.

---

## Cara Menjalankan Aplikasi

Karena aplikasi ini dikembangkan menggunakan framework Angular, Anda perlu melakukan instalasi dependensi terlebih dahulu di komputer Anda (yang terhubung ke internet).

Jalankan perintah berikut di terminal Anda:

### 1. Masuk ke Direktori Proyek
```bash
cd "/home/nxrts/Program Koding/Geometric Calculator"
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Jalankan Server Pengembangan
```bash
npm start
```
*Atau:*
```bash
npx ng serve
```

### 4. Buka Aplikasi di Browser
Buka tautan berikut di browser Anda:
[http://localhost:4200](http://localhost:4200)

---

## Lisensi

Proyek ini dilisensikan di bawah MIT License. Lihat berkas `LICENSE` untuk informasi selengkapnya.
