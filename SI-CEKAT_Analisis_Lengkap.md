# SI-CEKAT — Analisis Kebutuhan Sistem Lengkap
**Sistem Cek Armada Terpadu | Platform Inspeksi Kelaikan Jalan Digital**

---

## 1. GAMBARAN UMUM SISTEM

SI-CEKAT adalah platform web berbasis mobile-first yang mendigitalisasi proses ramp check (inspeksi kelaikan jalan) armada bus pariwisata di satu pool. Sistem menggantikan formulir kertas dengan antarmuka digital yang menghasilkan hasil inspeksi otomatis, tersimpan di database terpusat, dan dapat dianalisis secara historis.

### Aktor Sistem
| Aktor | Identifikasi Login | Peran Utama |
|---|---|---|
| **Supir** | Nomor SIM | Mengisi form inspeksi sebelum operasional |
| **Admin** | Username + Password | Memantau dashboard, laporan, data armada |

---

## 2. ANALISIS KEDUA FORMULIR

Sistem menggunakan **gabungan dua formulir** yang dilebur menjadi satu form digital:

### Form 1 — Formulir Inspeksi Keselamatan LLAJ (Reguler)
Digunakan sebagai kerangka utama dengan 3 seksi:
- **Unsur Administrasi** (4 item) — bobot sanksi TILANG
- **Unsur Teknis Utama** (9 item) — bobot sanksi DILARANG OPERASIONAL
- **Unsur Teknis Penunjang** (14 item) — bobot sanksi PERINGATAN/PERBAIKI

### Form 2 — Formulir Ramp Check Baru (Diperluas)
Menambahkan item yang tidak ada di Form 1:
- **APAR** (Alat Pemadam Api Ringan) — status: Ada / Kadaluarsa / Tidak Ada
- **Kondisi Pintu Utama** — Baik / Kurang Baik
- **Lantai dan Tangga** — Baik / Keropos/Berlubang
- **Pengganjal Roda** — Ada / Tidak Ada
- **Sabuk Keselamatan Penumpang** — Ada dan Laik / Tidak Ada
- **Kotak PT3K** (P3K) — Ada / Tidak Ada
- **Kondisi Kaca Depan** — Baik / Kurang Baik (dipindah ke Teknis Penunjang)
- **Nomor Ramp Check** — field tambahan di header

### Struktur Form Digital Gabungan (Final)

```
HEADER DATA INSPEKSI
├── Tanggal & Waktu (auto)
├── No. Ramp Check (auto-generate)
├── Nama Lokasi / Pool
├── Nama Pengemudi (auto dari login)
├── Umur Pengemudi (dari profil)
├── Nama PO (dari data pool)
├── Nomor Kendaraan (pilih dari daftar armada)
├── Nomor STUK (auto dari data kendaraan)
├── Jenis Angkutan (AKAP/AKDP/Pariwisata/Lainnya)
└── Trayek

SEKSI I — UNSUR ADMINISTRASI [Sanksi: TILANG & DILARANG OPERASIONAL]
├── 1. Kartu Uji / STUK
├── 2. KP. Reguler
├── 3. KP. Cadangan (jika kendaraan cadangan)
└── 4. SIM Pengemudi

SEKSI II — UNSUR TEKNIS UTAMA [Sanksi: DILARANG OPERASIONAL]
├── A. Sistem Penerangan
│   ├── 1a. Lampu Utama Dekat
│   ├── 1b. Lampu Utama Jauh
│   ├── 2a. Lampu Penunjuk Arah Depan (Sein)
│   ├── 2b. Lampu Penunjuk Arah Belakang
│   ├── 3.  Lampu Rem
│   └── 4.  Lampu Mundur
├── B. Sistem Pengereman
│   ├── 5. Kondisi Rem Utama
│   └── 6. Kondisi Rem Parkir
├── C. Ban
│   ├── 7a. Kondisi Ban Depan
│   └── 7b. Kondisi Ban Belakang
├── D. Perlengkapan
│   └── 8. Sabuk Keselamatan Pengemudi
├── E. Pengukur Kecepatan
│   └── 9. Speedometer
├── F. Penghapus Kaca (Wiper)
│   └── 10. Wiper
└── G. Tanggap Darurat
    ├── 11. Pintu Darurat
    ├── 12. Jendela Darurat
    ├── 13. Alat Pemukul/Pemecah Kaca
    └── 14. APAR (Alat Pemadam Api Ringan) ★ Form 2

SEKSI III — UNSUR TEKNIS PENUNJANG [Sanksi: PERINGATAN/PERBAIKI]
├── A. Sistem Penerangan
│   ├── 15a. Lampu Posisi Depan
│   └── 15b. Lampu Posisi Belakang
├── B. Badan Kendaraan
│   ├── 16. Kondisi Kaca Depan
│   ├── 17. Pintu Utama ★ Form 2
│   ├── 18. Lantai dan Tangga ★ Form 2
│   ├── 19. Kaca Spion
│   ├── 20. Penghapus Kaca (Wiper) [jika tidak ada di Seksi II]
│   └── 21. Klakson
├── C. Kapasitas Tempat Duduk
│   └── 22. Jumlah Tempat Duduk Penumpang
└── D. Perlengkapan Kendaraan
    ├── 23. Ban Cadangan
    ├── 24. Segitiga Pengaman
    ├── 25. Dongkrak
    ├── 26. Pembuka Roda
    ├── 27. Lampu Senter
    ├── 28. Pengganjal Roda ★ Form 2
    ├── 29. Sabuk Keselamatan Penumpang ★ Form 2
    └── 30. Kotak PT3K ★ Form 2

FOTO DOKUMENTASI
└── Upload foto per item (opsional/wajib jika ada masalah)

TANDA TANGAN DIGITAL SUPIR

SUBMIT → SISTEM OTOMATIS MENGHITUNG HASIL
```

### Logika Penilaian Otomatis
```
Jika ada item Seksi I bermasalah     → TILANG & DILARANG OPERASIONAL
Jika ada item Seksi II bermasalah    → DILARANG OPERASIONAL
Jika ada item Seksi III bermasalah   → PERINGATAN / PERBAIKI
Semua item OK                        → LAIK JALAN

Skor Kelaikan = (item_ok / total_item) × 100%
Eskalasi otomatis ke Admin jika status = DILARANG OPERASIONAL
```

---

## 3. STRUKTUR HALAMAN & MENU

### 3.1 Halaman Publik / Auth
```
/                          → Landing / Splash Screen
/login                     → Halaman Login (Supir: nomor SIM | Admin: username/password)
/lupa-password             → Reset password admin
```

### 3.2 Halaman Supir
```
/supir/dashboard           → Dashboard Supir (status hari ini, reminder)
/supir/inspeksi/baru       → Form Inspeksi Baru (wizard multi-step)
/supir/inspeksi/[id]       → Detail Hasil Inspeksi (read-only, form terisi otomatis)
/supir/riwayat             → Riwayat Inspeksi Saya
/supir/profil              → Profil & Data SIM
```

### 3.3 Halaman Admin
```
/admin/dashboard           → Dashboard Analitik Utama
/admin/inspeksi            → Daftar Semua Inspeksi
/admin/inspeksi/[id]       → Detail Hasil Inspeksi (cetak/export PDF)
/admin/kendaraan           → Manajemen Armada
/admin/kendaraan/[id]      → Profil Kendaraan + Timeline Riwayat
/admin/supir               → Manajemen Data Supir
/admin/supir/[id]          → Profil Supir + Riwayat Inspeksi
/admin/dokumen             → Pelacak Masa Berlaku Dokumen
/admin/laporan             → Generate Laporan Berkala
/admin/notifikasi          → Pusat Notifikasi & Eskalasi
/admin/pengaturan          → Pengaturan Sistem (nama pool, dsb)
```

---

## 4. FITUR LENGKAP PER MODUL

### MODUL A — AUTENTIKASI
- Login Supir via Nomor SIM (input: nomor SIM + PIN/password)
- Login Admin via username + password
- Session management (JWT / cookie)
- Remember device untuk supir
- Logout otomatis setelah 12 jam

### MODUL B — DASHBOARD SUPIR
**Tampilan:**
- Kartu status hari ini: sudah/belum inspeksi
- Nama kendaraan yang ditugaskan
- Reminder push notification jika belum inspeksi
- Tombol besar "Mulai Inspeksi" (CTA utama)
- Riwayat 5 inspeksi terakhir (mini cards)
- Status dokumen SIM (sisa hari berlaku)
- Indikator koneksi internet (online/offline mode)

### MODUL C — FORM INSPEKSI (Multi-Step Wizard)
**Step 1 — Data Kendaraan**
- Pilih nomor kendaraan (dropdown dari daftar armada aktif)
- Data auto-fill: Nomor STUK, nama PO, trayek
- Jenis angkutan
- Tanggal & waktu (auto dari sistem, tidak bisa diubah)

**Step 2 — Unsur Administrasi**
- 4 item dengan pilihan toggle (Ada & Berlaku / Tidak Berlaku / Tidak Ada / Tidak Sesuai Fisik)
- Jika ada masalah: wajib upload foto bukti
- Warning real-time: "Item ini berakibat TILANG"

**Step 3 — Unsur Teknis Utama (Seksi II)**
- Item penerangan: toggle kanan/kiri jika tidak menyala
- Item rem, ban, perlengkapan: toggle berfungsi/tidak
- Progress bar antar step
- Wajib foto jika kondisi buruk
- Warning: "Item ini berakibat DILARANG OPERASIONAL"

**Step 4 — Unsur Teknis Penunjang (Seksi III)**
- Semua item Seksi III
- Untuk APAR: tiga pilihan (Ada / Kadaluarsa / Tidak Ada)
- Foto opsional (wajib jika ada masalah)
- Warning: "Item ini berakibat PERINGATAN/PERBAIKI"

**Step 5 — Foto Dokumentasi & Catatan**
- Upload foto kondisi umum kendaraan (depan, belakang, dalam)
- Field catatan tambahan
- Canvas tanda tangan digital supir
- Checkbox pernyataan: "Saya menyatakan data di atas adalah benar"

**Step 6 — Review & Submit**
- Tampilan ringkasan semua jawaban
- Preview hasil otomatis (Laik/Tidak Laik)
- Tombol Submit (sekali tekan, tidak bisa diedit setelah submit)
- Timestamp otomatis saat submit (WIB)
- Durasi pengisian tercatat di background

**Fitur Form:**
- Auto-save per step (tidak hilang jika app tertutup)
- Validasi setiap step sebelum lanjut
- Tidak bisa skip item wajib
- Tidak bisa kembali edit setelah submit (immutable data)
- Mode offline: data tersimpan lokal, sync saat online

### MODUL D — HASIL INSPEKSI (Auto-Generated)
Setelah submit, sistem menghasilkan:
- Nomor Ramp Check (format: RC-YYYYMMDD-XXX)
- Status kelaikan dengan warna (HIJAU = Laik, MERAH = Tidak Laik, KUNING = Peringatan)
- Persentase kelaikan (contoh: 87%)
- Form lengkap terisi otomatis (semua checkbox tercentang sesuai input)
- Daftar item bermasalah beserta foto
- Tanda tangan digital supir tertanam
- Bisa diekspor ke PDF (admin)
- Bisa dibagikan via WhatsApp (link read-only)

### MODUL E — DASHBOARD ADMIN
**Cards KPI:**
- Total inspeksi hari ini
- Jumlah bus laik hari ini
- Jumlah bus tidak laik (merah, ada notifikasi)
- Jumlah inspeksi tertunda (belum inspeksi hari ini)

**Grafik & Chart:**
- Line chart: tren laik/tidak laik per minggu/bulan
- Bar chart: item paling sering bermasalah (top 10)
- Pie/donut chart: distribusi status kendaraan
- Heatmap: frekuensi masalah per hari dalam seminggu

**Panel Cepat:**
- Daftar bus yang hari ini belum inspeksi
- Daftar bus tidak laik hari ini (dengan tombol eskalasi/tindak lanjut)
- Notifikasi terbaru (dokumen kadaluarsa, eskalasi)

### MODUL F — MANAJEMEN KENDARAAN (Admin)
**Daftar Armada:**
- Tabel/card list semua kendaraan di pool
- Filter: status hari ini (laik/tidak laik/belum inspeksi)
- Status dokumen kendaraan (STUK masa berlaku)

**Profil Kendaraan:**
- Info dasar: nomor polisi, merk, tahun, kapasitas
- Masa berlaku: KIR/STUK, KP, asuransi
- Timeline riwayat inspeksi (visual timeline vertikal)
- Grafik tren kondisi kendaraan
- Item yang paling sering bermasalah (per kendaraan)
- Catatan tindak lanjut perbaikan

### MODUL G — MANAJEMEN SUPIR (Admin)
- Data supir: nama, nomor SIM, masa berlaku SIM, foto
- Riwayat inspeksi yang dilakukan
- Statistik supir (total inspeksi, rata-rata durasi pengisian)
- Status aktif/nonaktif

### MODUL H — PELACAK DOKUMEN
- List semua dokumen per kendaraan (STUK/KIR, KP, asuransi)
- Alert warna:
  - MERAH: sudah kadaluarsa
  - KUNING: akan kadaluarsa dalam 30 hari
  - HIJAU: masih berlaku
- Filter berdasarkan status
- Reminder otomatis ke admin H-30 dan H-7

### MODUL I — LAPORAN BERKALA
- Generate laporan PDF/Excel untuk periode tertentu
- Laporan mingguan (otomatis setiap Senin pagi)
- Laporan bulanan (otomatis setiap tanggal 1)
- Isi laporan: total inspeksi, rekapitulasi laik/tidak, item paling sering bermasalah, daftar kendaraan dengan masalah terbanyak
- Download PDF / Excel
- Kirim otomatis via email (opsional)

### MODUL J — NOTIFIKASI & ESKALASI
**Untuk Supir:**
- Push notification pagi hari (reminder inspeksi)
- Konfirmasi hasil inspeksi setelah submit
- Notifikasi jika tindak lanjut perbaikan sudah selesai

**Untuk Admin:**
- Eskalasi otomatis: bus tidak laik → notifikasi ke admin segera
- Reminder: ada bus yang belum inspeksi siang hari
- Alert: dokumen akan/sudah kadaluarsa
- Ringkasan harian (jam 20.00)

### MODUL K — CATATAN TINDAK LANJUT PERBAIKAN
- Admin bisa menambah catatan perbaikan pada inspeksi yang bermasalah
- Status perbaikan: Belum Ditindaklanjuti / Dalam Proses / Selesai
- Histori catatan per kendaraan
- Supir bisa melihat status perbaikan kendaraan yang dia gunakan

### MODUL L — MODE OFFLINE (PWA)
- Service Worker untuk cache halaman utama
- Form inspeksi bisa diisi tanpa internet
- Data tersimpan di IndexedDB lokal
- Sinkronisasi otomatis saat koneksi kembali
- Indikator status sinkronisasi

---

## 5. STRUKTUR FILE PROYEK

```
si-cekat/
│
├── index.html                          # Landing/splash + redirect
│
├── assets/
│   ├── css/
│   │   ├── main.css                    # Variable CSS, reset, typography
│   │   ├── components.css              # Card, button, form, badge, modal
│   │   ├── layout.css                  # Grid, sidebar, navbar, responsive
│   │   ├── dashboard-admin.css         # Khusus layout dashboard admin
│   │   ├── dashboard-supir.css         # Khusus layout dashboard supir
│   │   ├── form-inspeksi.css           # Wizard form, step indicator, toggle
│   │   ├── charts.css                  # Styling wrapper chart
│   │   └── print.css                   # Style untuk cetak/export PDF
│   │
│   ├── js/
│   │   ├── app.js                      # Init, routing, global state
│   │   ├── auth.js                     # Login, session, logout
│   │   ├── api.js                      # Wrapper fetch API (CRUD)
│   │   ├── form-wizard.js              # Multi-step form logic, validasi
│   │   ├── form-scoring.js             # Logika penilaian otomatis laik/tidak
│   │   ├── signature.js                # Canvas tanda tangan digital
│   │   ├── camera.js                   # Akses kamera, upload foto
│   │   ├── offline.js                  # IndexedDB, sync queue
│   │   ├── notifications.js            # Push notification handler
│   │   ├── charts.js                   # Inisialisasi Chart.js/ApexCharts
│   │   ├── document-tracker.js         # Logika pelacak dokumen kadaluarsa
│   │   ├── report-generator.js         # Generate PDF laporan
│   │   └── utils.js                    # Format tanggal, nomor, helper umum
│   │
│   ├── img/
│   │   ├── logo-sicekat.svg
│   │   ├── logo-dishub.svg
│   │   ├── icon-bus.svg
│   │   └── icons/                      # Icon SVG per item inspeksi
│   │       ├── icon-lampu.svg
│   │       ├── icon-rem.svg
│   │       ├── icon-ban.svg
│   │       └── ... (icon per kategori)
│   │
│   └── fonts/                          # Font lokal jika tidak pakai CDN
│
├── auth/
│   ├── login.html                      # Halaman login unified
│   └── reset-password.html             # Reset password admin
│
├── supir/
│   ├── dashboard.html                  # Dashboard supir
│   ├── inspeksi-baru.html              # Form inspeksi wizard
│   ├── detail-inspeksi.html            # Hasil inspeksi (read-only)
│   ├── riwayat.html                    # Riwayat inspeksi supir
│   └── profil.html                     # Profil supir
│
├── admin/
│   ├── dashboard.html                  # Dashboard analitik admin
│   ├── inspeksi/
│   │   ├── index.html                  # Daftar semua inspeksi
│   │   └── detail.html                 # Detail inspeksi (cetak/export)
│   ├── kendaraan/
│   │   ├── index.html                  # Daftar armada
│   │   ├── profil.html                 # Profil & timeline kendaraan
│   │   └── tambah-edit.html            # Form tambah/edit kendaraan
│   ├── supir/
│   │   ├── index.html                  # Daftar supir
│   │   ├── profil.html                 # Profil supir
│   │   └── tambah-edit.html            # Form tambah/edit supir
│   ├── dokumen/
│   │   └── index.html                  # Pelacak masa berlaku dokumen
│   ├── laporan/
│   │   └── index.html                  # Generate laporan berkala
│   ├── notifikasi/
│   │   └── index.html                  # Pusat notifikasi & eskalasi
│   └── pengaturan/
│       └── index.html                  # Pengaturan sistem
│
├── components/                         # HTML partial/template (jika pakai JS templating)
│   ├── navbar-supir.html
│   ├── navbar-admin.html
│   ├── sidebar-admin.html
│   ├── card-inspeksi.html
│   ├── modal-konfirmasi.html
│   └── toast-notifikasi.html
│
├── data/                               # (jika static/prototype, hapus jika pakai backend)
│   ├── kendaraan.json
│   ├── supir.json
│   └── inspeksi.json
│
├── manifest.json                       # PWA manifest
├── sw.js                               # Service Worker (offline/PWA)
├── robots.txt
└── README.md
```

---

## 6. DESAIN TAMPILAN

### Prinsip Desain
- **Mobile-first**: lebar minimum 375px, optimal 390px (iPhone 14)
- **Responsif**: breakpoint tablet (768px) dan desktop (1024px+)
- **Aksesibilitas**: kontras tinggi, ukuran tap target min 44px
- **Kecepatan**: lazy load gambar, minimalkan dependency

### Palet Warna
```
Primary      : #1A3C6E  (biru dongker — otoritas, keselamatan)
Secondary    : #F59E0B  (kuning amber — peringatan, CTA)
Success      : #16A34A  (hijau — laik jalan)
Danger       : #DC2626  (merah — tidak laik / dilarang)
Warning      : #D97706  (oranye — peringatan/perbaiki)
Neutral Dark : #1E293B
Neutral Mid  : #64748B
Neutral Light: #F1F5F9
Background   : #F8FAFC
White        : #FFFFFF
```

### Tipografi
```
Display/Heading : Poppins (SemiBold 600, Bold 700)
Body            : Inter (Regular 400, Medium 500)
Monospace       : JetBrains Mono (nomor kendaraan, kode)
```

### Komponen Kunci

**Toggle Item Inspeksi (mobile):**
- Kartu per item dengan ikon representatif
- Toggle besar yang mudah disentuh jempol
- Warna hijau (OK) / merah (Bermasalah)
- Jika bermasalah: expand untuk sub-pilihan (kanan/kiri) + tombol kamera

**Status Badge:**
- 🟢 LAIK JALAN — hijau solid
- 🔴 TIDAK LAIK JALAN — merah solid
- 🟡 PERINGATAN/PERBAIKI — kuning
- 🔵 BELUM INSPEKSI — abu-abu biru

**Step Indicator Form:**
- 6 langkah dengan progress bar atas
- Nomor step + label singkat
- Checkmark setelah step selesai

**Dashboard Admin:**
- Sidebar kiri (desktop), bottom navigation (mobile)
- KPI cards baris pertama
- Charts di bawahnya
- Tabel / list di bawah charts

### Navigasi

**Supir (Mobile Bottom Nav):**
```
🏠 Home  |  📋 Inspeksi  |  📜 Riwayat  |  👤 Profil
```

**Admin (Desktop Sidebar + Mobile Bottom Nav):**
```
Desktop Sidebar:
- 📊 Dashboard
- 📋 Inspeksi
- 🚌 Kendaraan
- 👤 Supir
- 📄 Dokumen
- 📈 Laporan
- 🔔 Notifikasi
- ⚙️ Pengaturan

Mobile (Bottom Nav, 5 item):
- 📊 Home  |  📋 Inspeksi  |  🚌 Armada  |  🔔 Notif  |  ☰ Menu
```

---

## 7. DATABASE SCHEMA (Referensi)

### Tabel Utama
```
users             → id, nama, nomor_sim, role, password_hash, aktif, created_at
kendaraan         → id, nomor_polisi, nomor_stuk, merk, tahun, kapasitas, pool_id
dokumen_kendaraan → id, kendaraan_id, jenis, nomor, tanggal_berlaku, file_url
inspeksi          → id, nomor_rampcheck, supir_id, kendaraan_id, waktu_mulai, waktu_submit, status_final, skor_persen, tanda_tangan_url
item_inspeksi     → id, inspeksi_id, kode_item, seksi, kondisi, foto_url, catatan
tindak_lanjut     → id, inspeksi_id, catatan, status, admin_id, updated_at
notifikasi        → id, user_id, judul, pesan, tipe, dibaca, created_at
```

### Kode Item Inspeksi
```
ADM-001 s/d ADM-004     → Unsur Administrasi
TU-A-001 s/d TU-G-004  → Teknis Utama (A=Penerangan, B=Rem, C=Ban, dst)
TP-A-001 s/d TP-D-008  → Teknis Penunjang
```

---

## 8. FITUR KEAMANAN DATA

- Data inspeksi bersifat **immutable** setelah submit (tidak ada UPDATE/DELETE)
- Setiap record menyimpan `submitted_at` timestamp server (bukan client)
- Durasi pengisian tersimpan (mencegah data fiktif yang diisi terlalu cepat)
- Tanda tangan digital tersimpan sebagai Base64 PNG dengan hash
- Log aktivitas untuk semua aksi admin
- HTTPS wajib

---

## 9. PRIORITAS PENGEMBANGAN (Roadmap)

### MVP (Fase 1) — Wajib Ada
1. ✅ Auth (login supir & admin)
2. ✅ Form inspeksi digital (gabungan 2 formulir)
3. ✅ Penilaian otomatis (laik/tidak laik + persentase)
4. ✅ Hasil inspeksi auto-generated (tampilan form terisi)
5. ✅ Tanda tangan digital
6. ✅ Dashboard admin (basic)
7. ✅ Riwayat inspeksi
8. ✅ Eskalasi otomatis ke admin saat tidak laik
9. ✅ Data tidak bisa diedit setelah submit

### Fase 2 — Pengembangan Lanjutan
10. 📷 Foto dokumentasi per item
11. 📊 Analitik item paling sering bermasalah
12. 📅 Pelacak masa berlaku dokumen
13. 📝 Catatan tindak lanjut perbaikan
14. 🔔 Notifikasi & reminder inspeksi harian
15. ⏱️ Timestamping & durasi pengisian

### Fase 3 — Fitur Premium
16. 📶 Mode offline (PWA)
17. 📈 Laporan berkala otomatis
18. 🕐 Riwayat kondisi per kendaraan (timeline)

---

## 10. RINGKASAN JUMLAH KOMPONEN

| Kategori | Jumlah |
|---|---|
| Total halaman HTML | 20 halaman |
| File CSS | 8 file |
| File JavaScript | 14 file |
| Tabel database | 7 tabel |
| Item inspeksi dalam form | 30 item |
| Role pengguna | 2 role |
| Modul fitur | 12 modul |

---

*Dokumen ini merupakan analisis kebutuhan awal SI-CEKAT. Versi: 1.0 | Dibuat: Mei 2026*
