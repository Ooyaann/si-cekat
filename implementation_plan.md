# SI-CEKAT — Product Requirements Document (PRD)
**Sistem Cek Armada Terpadu | Platform Inspeksi Kelayakan Jalan Digital**

> **Versi**: 1.1 | **Tanggal**: 22 Mei 2026
> **Tech Stack**: React + Vite SPA | Tailwind CSS v3 | LocalStorage + JSON | pdf-lib PDF Overlay

---

## 1. Ringkasan Eksekutif

SI-CEKAT adalah platform web **responsif penuh** (mobile, tablet, desktop) berbasis **React + Vite (SPA)** yang mendigitalisasi proses *ramp check* (inspeksi kelayakan jalan) armada bus pariwisata. Pendekatan **mobile-first** digunakan dalam development, namun tampilan di layar besar (tablet/desktop) tetap optimal dan menarik. Sistem menggantikan formulir kertas dengan antarmuka digital yang:

- Menghasilkan hasil inspeksi **otomatis** dengan penilaian layak/tidak layak
- Menyimpan data di **LocalStorage** dan JSON lokal (prototype frontend-only)
- Mengekspor hasil inspeksi ke **PDF yang persis identik** dengan formulir resmi pemerintah menggunakan **pdf-lib** (overlay data ke template PDF asli)
- Bahasa antarmuka **100% Bahasa Indonesia** (istilah "Laik" diganti "Layak" agar lebih mudah dipahami)
- Menggunakan **ikon SVG** (bukan emoji) untuk semua elemen visual

### Aktor Sistem

| Aktor | Login Via | Peran |
|-------|-----------|-------|
| **Supir** | Nomor SIM + PIN | Mengisi form inspeksi harian sebelum operasional |
| **Admin** | Username + Password | Memantau dashboard, mengelola data, ekspor laporan |

---

## 2. Tech Stack & Arsitektur

### 2.1 Frontend

| Komponen | Teknologi |
|----------|-----------|
| Framework | **React 18+** dengan Vite |
| Routing | **React Router v6** (client-side SPA) |
| Styling | **Tailwind CSS v3** (dengan `tailwind.config.js` custom design tokens) |
| State Management | **React Context** + `useReducer` untuk global state |
| Charts | **Recharts** (React-native chart library) |
| PDF Export | **pdf-lib** — overlay/inject data langsung ke file PDF template formulir resmi yang sudah ada (bukan convert HTML→PDF) |
| Icons | **Lucide React** (bukan emoji) |
| Fonts | **Poppins** (heading) + **Inter** (body) + **JetBrains Mono** (kode/nomor) — dikonfigurasi via Tailwind |

### 2.2 Data Layer (Frontend-Only Prototype)

| Komponen | Pendekatan |
|----------|------------|
| Database | **LocalStorage** + **JSON files** sebagai seed data awal |
| Auth | Simulasi login — validasi terhadap `data/supir.json` dan `data/admin.json` |
| Session | Simpan session di LocalStorage dengan expiry time |
| File Upload | Simpan sebagai **Base64** string di LocalStorage (foto & tanda tangan) |
| Offline Sync | IndexedDB via **idb** wrapper (Fase 3) |

### 2.3 Arsitektur Folder Proyek

```
si-cekat/
├── public/
│   ├── favicon.svg
│   ├── manifest.json
│   └── data/                          # Seed data JSON
│       ├── supir.json
│       ├── admin.json
│       ├── kendaraan.json
│       └── inspeksi-sample.json
│
├── src/
│   ├── main.jsx                       # Entry point
│   ├── App.jsx                        # Router + Layout wrapper
│   │
│   ├── assets/
│   │   ├── css/
│   │   │   ├── index.css              # Tailwind directives + custom base styles
│   │   │   └── print.css              # @media print styles
│   │   ├── icons/                     # SVG icons per kategori
│   │   └── img/                       # Logo, ilustrasi
│   │
│   ├── context/
│   │   ├── AuthContext.jsx            # Login state, user data, role
│   │   ├── InspeksiContext.jsx        # Form wizard state, auto-save
│   │   └── DataContext.jsx            # Global data (kendaraan, supir, inspeksi)
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.js         # Persistent state hook
│   │   ├── useFormWizard.js           # Multi-step form logic
│   │   └── useScoring.js             # Logika penilaian otomatis
│   │
│   ├── components/
│   │   ├── common/                    # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterTabs.jsx
│   │   │   └── EmptyState.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.jsx             # Top navigation bar
│   │   │   ├── Sidebar.jsx            # Desktop sidebar (admin)
│   │   │   ├── BottomNav.jsx          # Mobile bottom navigation
│   │   │   └── PageHeader.jsx
│   │   │
│   │   ├── form/                      # Form inspeksi components
│   │   │   ├── StepIndicator.jsx      # Progress bar 6 langkah
│   │   │   ├── FormDataKendaraan.jsx  # Step 1
│   │   │   ├── FormAdministrasi.jsx   # Step 2 (Seksi I)
│   │   │   ├── FormTeknisUtama.jsx    # Step 3 (Seksi II)
│   │   │   ├── FormTeknisPenunjang.jsx# Step 4 (Seksi III)
│   │   │   ├── FormDokumentasi.jsx    # Step 5 (Foto + TTD)
│   │   │   ├── FormReview.jsx         # Step 6 (Review + Submit)
│   │   │   ├── InspectionItem.jsx     # Single item toggle component
│   │   │   ├── SignatureCanvas.jsx    # Canvas tanda tangan digital
│   │   │   └── PhotoUpload.jsx        # Upload foto komponen
│   │   │
│   │   ├── dashboard/
│   │   │   ├── KPICard.jsx
│   │   │   ├── TrendChart.jsx
│   │   │   ├── IssueList.jsx
│   │   │   └── StatusOverview.jsx
│   │   │
│   │   └── pdf/
│   │       └── FormulirPDFTemplate.jsx # Template HTML persis formulir resmi
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── SplashScreen.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── ResetPassword.jsx
│   │   │
│   │   ├── supir/
│   │   │   ├── DashboardSupir.jsx
│   │   │   ├── InspeksiBaru.jsx       # Wizard container
│   │   │   ├── DetailInspeksi.jsx
│   │   │   ├── RiwayatInspeksi.jsx
│   │   │   └── ProfilSupir.jsx
│   │   │
│   │   └── admin/
│   │       ├── DashboardAdmin.jsx
│   │       ├── DaftarInspeksi.jsx
│   │       ├── DetailInspeksiAdmin.jsx
│   │       ├── ManajemenArmada.jsx
│   │       ├── TambahArmada.jsx
│   │       ├── ManajemenSupir.jsx
│   │       ├── TambahSupir.jsx
│   │       ├── PelacakDokumen.jsx
│   │       ├── LaporanBerkala.jsx
│   │       ├── PusatNotifikasi.jsx
│   │       ├── LogPerbaikan.jsx
│   │       └── PengaturanSistem.jsx
│   │
│   ├── utils/
│   │   ├── scoring.js                 # Logika penilaian laik/tidak laik
│   │   ├── pdfGenerator.js            # Generate PDF dari template
│   │   ├── formatters.js              # Format tanggal, nomor, dsb
│   │   ├── validators.js              # Validasi form
│   │   └── constants.js               # Item inspeksi, kode, label
│   │
│   └── data/
│       └── formItems.js               # Definisi 30 item inspeksi + opsi
│
├── index.html
├── vite.config.js
├── tailwind.config.js                 # Tailwind design tokens & custom config
├── postcss.config.js                  # PostCSS + Tailwind plugin
├── package.json
└── README.md
```

---

## 3. Analisis Formulir Inspeksi Resmi

> [!IMPORTANT]
> Fitur inti: Hasil ekspor PDF harus **persis identik** dengan layout formulir resmi "FORMULIR INSPEKSI KESELAMATAN LALU LINTAS DAN ANGKUTAN JALAN UNTUK ANGKUTAN UMUM" dari Direktorat Jenderal Perhubungan Darat. Data di-overlay langsung ke template PDF asli menggunakan **pdf-lib**.

### 3.1 Header — Data Pemeriksaan (10 Field)

| No | Field | Input Type | Auto-fill? |
|----|-------|-----------|------------|
| 1 | Hari/Tanggal | Date | ✅ Auto dari sistem |
| 2 | Lokasi | Radio: Terminal / Pool / Lainnya | ❌ Manual |
| 3 | Nama Lokasi | Text | ❌ Manual (atau dari profil pool) |
| 4 | Nama Pengemudi | Text | ✅ Auto dari login supir |
| 5 | Umur | Number | ✅ Auto dari profil supir |
| 6 | Nama PO | Text | ✅ Auto dari data pool |
| 7 | Nomor Kendaraan | Dropdown + Radio: Reguler/Cadangan | ❌ Pilih dari daftar |
| 8 | Nomor STUK | Text | ✅ Auto dari data kendaraan |
| 9 | Jenis Trayek | Radio: AKAP / AKDP / Pariwisata / MPU | ✅ Auto dari data kendaraan |
| 10 | Trayek | Text (editable) | ✅ Auto dari data kendaraan (bisa diedit manual jika perlu) |

### 3.2 Seksi I — Unsur Administrasi (4 Item)

**Sanksi**: TILANG & DILARANG OPERASIONAL (Kendaraan dinyatakan **TIDAK LAYAK JALAN**)

| No | Item | Opsi Positif | Opsi Negatif |
|----|------|-------------|-------------|
| 1 | Kartu Uji / STUK | Ada, berlaku | Tdk berlaku / Tdk ada / Tdk Sesuai Fisik |
| 2 | KP. Reguler | Ada, berlaku | Tdk berlaku / Tdk ada / Tdk Sesuai Fisik |
| 3 | KP. Cadangan | Ada, berlaku | Tdk berlaku / Tdk ada / Tdk Sesuai Fisik |
| 4 | SIM Pengemudi | A Umum, B1 Umum, B2 Umum | Tdk berlaku / Tdk ada / SIM tidak sesuai |

### 3.3 Seksi II — Unsur Teknis Utama (9 Item, 14 Sub-item)

**Sanksi**: DILARANG OPERASIONAL (Kendaraan dinyatakan **TIDAK LAYAK JALAN**)

| No | Kategori | Item | Opsi OK | Opsi Gagal |
|----|----------|------|---------|-----------|
| **A** | **Sistem Penerangan** | | | |
| 1a | | Lampu Utama Dekat | Semua menyala | Tidak menyala: ☐ Kanan ☐ Kiri |
| 1b | | Lampu Utama Jauh | Semua menyala | Tidak menyala: ☐ Kanan ☐ Kiri |
| 2a | | Lampu Sein Depan | Semua menyala | Tidak menyala: ☐ Kanan ☐ Kiri |
| 2b | | Lampu Sein Belakang | Semua menyala | Tidak menyala: ☐ Kanan ☐ Kiri |
| 3 | | Lampu Rem | Semua menyala | Tidak menyala: ☐ Kanan ☐ Kiri |
| 4 | | Lampu Mundur | Semua menyala | Tidak menyala: ☐ Kanan ☐ Kiri |
| **B** | **Sistem Pengereman** | | | |
| 5 | | Rem Utama | Berfungsi | Tidak Berfungsi |
| 6 | | Rem Parkir | Berfungsi | Tidak Berfungsi |
| **C** | **Badan Kendaraan** | | | |
| 7 | | Kondisi Kaca Depan | Baik | Buruk |
| **D** | **Ban** | | | |
| 8a | | Ban Depan | Semua Laik | Tidak Laik: ☐ Kanan ☐ Kiri |
| 8b | | Ban Belakang | Semua Laik | Tidak Laik: ☐ Kanan ☐ Kiri |
| **E** | **Perlengkapan** | | | |
| 9 | | Sabuk Keselamatan Pengemudi | Ada dan Fungsi | Tidak Fungsi/Tidak ada |

### 3.4 Seksi III — Unsur Teknis Penunjang (14 Item)

**Sanksi**: PERINGATAN / PERBAIKI (Kendaraan dinyatakan **LAYAK JALAN** dengan catatan)

| No | Kategori | Item | Opsi OK | Opsi Gagal |
|----|----------|------|---------|-----------|
| **A** | **Pengukur Kecepatan** | | | |
| 10 | | Pengukur Kecepatan | Ada dan Fungsi | Tidak Fungsi/Tidak Ada |
| **B** | **Sistem Penerangan** | | | |
| 11a | | Lampu Posisi Depan | Semua menyala | Tidak menyala: ☐ Kanan ☐ Kiri |
| 11b | | Lampu Posisi Belakang | Semua menyala | Tidak menyala: ☐ Kanan ☐ Kiri |
| **C** | **Badan Kendaraan** | | | |
| 12 | | Kaca Spion | Ada dan sesuai | Tidak ada/Tidak sesuai |
| 13 | | Penghapus Kaca (Wiper) | Ada dan Berfungsi | Tidak ada/Tidak berfungsi |
| 14 | | Klakson | Ada dan Berfungsi | Tidak ada/Tidak berfungsi |
| **D** | **Kapasitas Tempat Duduk** | | | |
| 15 | | Jumlah Tempat Duduk Penumpang | Sesuai | Tidak sesuai |
| **E** | **Perlengkapan Kendaraan** | | | |
| 16 | | Ban Cadangan | Ada dan Laik | Tidak ada/Tidak Laik |
| 17 | | Segitiga Pengaman | Ada | Tidak ada |
| 18 | | Dongkrak | Ada | Tidak ada |
| 19 | | Pembuka Roda | Ada | Tidak ada |
| 20 | | Lampu Senter | Ada dan Berfungsi | Tidak ada/Tidak Fungsi |
| **F** | **Tanggap Darurat** | | | |
| 21 | | Pintu Darurat | Ada dan Berfungsi | Tidak ada/Tidak Fungsi |
| 22 | | Jendela Darurat | Ada | Tidak ada |
| 23 | | Alat Pemukul/Pemecah Kaca | Ada | Tidak ada |

### 3.5 Item Tambahan dari Form 2 (Ramp Check Diperluas)

Item-item berikut ditambahkan ke dalam form digital gabungan:

| Item | Masuk ke Seksi | Opsi |
|------|---------------|------|
| APAR (Alat Pemadam Api Ringan) | Seksi II — Tanggap Darurat (No. 14) | Ada / Kadaluarsa / Tidak Ada |
| Kondisi Pintu Utama | Seksi III — Badan Kendaraan | Baik / Kurang Baik |
| Lantai dan Tangga | Seksi III — Badan Kendaraan | Baik / Keropos/Berlubang |
| Pengganjal Roda | Seksi III — Perlengkapan | Ada / Tidak Ada |
| Sabuk Keselamatan Penumpang | Seksi III — Perlengkapan | Ada dan Laik / Tidak Ada |
| Kotak P3K | Seksi III — Perlengkapan | Ada / Tidak Ada |

### 3.6 Kesimpulan Formulir (Auto-Generated)

Berdasarkan hasil inspeksi, sistem otomatis menentukan:

```
┌─────────────────────────────────────────────────────┐
│ KESIMPULAN                                          │
│                                                     │
│ ☐ LAYAK JALAN          ☐ TIDAK LAYAK JALAN         │
│   ☐ Diijinkan Operasi    ☐ Tilang & Dilarang Ops   │
│   ☐ Peringatan&Perbaik   ☐ Dilarang Operasional    │
│                                                     │
│ CATATAN: [auto-generated dari item bermasalah]      │
│                                                     │
│ PENGEMUDI    PENGUJI KENDARAAN    PENYIDIK PPNS     │
│ Nama:        Nama:                Nama:             │
│              NIP:                 NIP:              │
└─────────────────────────────────────────────────────┘
```

### 3.7 Logika Penilaian Otomatis

```javascript
// Pseudocode logika penilaian
if (seksiI.adaItemBermasalah) {
  status = "TIDAK LAYAK JALAN"
  sanksi = "TILANG & DILARANG OPERASIONAL"
}
else if (seksiII.adaItemBermasalah) {
  status = "TIDAK LAYAK JALAN"  
  sanksi = "DILARANG OPERASIONAL"
}
else if (seksiIII.adaItemBermasalah) {
  status = "LAYAK JALAN"
  sanksi = "PERINGATAN / PERBAIKI"
}
else {
  status = "LAYAK JALAN"
  sanksi = "DIIJINKAN OPERASIONAL"
}

// Catatan penting dari formulir asli:
// "Jika setiap unsur terdapat pelanggaran,
//  maka sanksi yang dikenakan adalah sanksi yang paling berat"
skorKelayakan = (itemOK / totalItem) * 100
```

---

## 4. Fitur Ekspor PDF — pdf-lib Overlay ke Template Asli

> [!IMPORTANT]
> PDF yang dihasilkan harus **identik secara visual** dengan formulir resmi. Pendekatan: menggunakan **pdf-lib** untuk meng-overlay/inject data langsung ke atas file **PDF template asli** (formulir kosong). Bukan mengubah HTML menjadi PDF.

### Pendekatan Teknis

1. **Siapkan file PDF template kosong** — formulir resmi "FORMULIR INSPEKSI KESELAMATAN" dalam format PDF (user sudah memiliki file ini)
2. **Load PDF template** — gunakan `pdf-lib` untuk membaca file PDF template sebagai `PDFDocument`
3. **Map koordinat field** — petakan posisi (x, y) setiap field dan checkbox pada halaman PDF (dalam satuan point). Ini dilakukan sekali saat development, lalu disimpan sebagai config
4. **Isi teks ke posisi yang tepat** — gunakan `page.drawText()` untuk menulis data ke posisi field yang sesuai (tanggal, nama, nopol, dst)
5. **Centang checkbox** — gunakan `page.drawText('✓')` atau `page.drawImage()` pada posisi checkbox yang relevan sesuai jawaban supir
6. **Embed tanda tangan** — gunakan `page.drawImage()` untuk menempatkan gambar tanda tangan digital (dari Base64 PNG) di kolom PENGEMUDI
7. **Generate & download** — serialize PDF yang sudah terisi menjadi `Uint8Array`, buat Blob, lalu trigger download

### Keuntungan Pendekatan pdf-lib

| Aspek | pdf-lib Overlay | HTML→PDF (html2pdf.js) |
|-------|----------------|------------------------|
| **Akurasi layout** | 100% identik (template asli) | Perlu re-create layout, rawan beda |
| **Ukuran file** | Kecil (~200KB) | Besar (screenshot-based) |
| **Kualitas teks** | Vektor (sharp di zoom) | Raster (blur di zoom) |
| **Maintenance** | Ganti template PDF saja | Harus update HTML+CSS |
| **Dependencies** | `pdf-lib` saja | `html2canvas` + `jsPDF` |

### Konfigurasi Koordinat Field PDF

Setiap field di formulir PDF dipetakan dengan koordinat (x, y, width, height):

```javascript
// Contoh: pdfFieldConfig.js
export const PDF_FIELDS = {
  header: {
    hariTanggal: { x: 180, y: 720, size: 10 },
    lokasi: {
      terminal: { x: 165, y: 700, size: 10 },  // checkbox position
      pool:     { x: 215, y: 700, size: 10 },
      lainnya:  { x: 265, y: 700, size: 10 },
    },
    namaLokasi:    { x: 180, y: 680, size: 10 },
    namaPengemudi:  { x: 180, y: 660, size: 10 },
    umur:           { x: 180, y: 640, size: 10 },
    namaPO:         { x: 470, y: 720, size: 10 },
    nomorKendaraan: { x: 470, y: 700, size: 10 },
    nomorSTUK:      { x: 470, y: 680, size: 10 },
    jenisTrayek:    { x: 470, y: 660, size: 10 },
    trayek:         { x: 470, y: 640, size: 10 },
  },
  seksiI: {
    // ... koordinat per checkbox item administrasi
  },
  seksiII: {
    // ... koordinat per checkbox item teknis utama
  },
  seksiIII: {
    // ... koordinat per checkbox item teknis penunjang
  },
  kesimpulan: {
    layakJalan:      { x: 80, y: 120, size: 12 },
    tidakLayakJalan: { x: 280, y: 120, size: 12 },
  },
  tandaTangan: {
    pengemudi: { x: 200, y: 60, width: 120, height: 40 },
  }
}
```

### Data yang Auto-fill ke PDF

- Header: tanggal, lokasi, pengemudi, PO, nomor kendaraan, STUK, jenis trayek, trayek
- Seksi I-III: semua checkbox tercentang sesuai input
- Kesimpulan: LAIK/TIDAK LAIK otomatis tercentang
- Sub-kesimpulan: sanksi yang sesuai otomatis tercentang
- Catatan: daftar item bermasalah
- Tanda tangan: gambar tanda tangan digital supir
- Nomor Ramp Check: di bagian atas

---

## 5. Design System

### 5.1 Palet Warna (Tailwind Config)

Berdasarkan referensi UI mockup, dikonfigurasi dalam `tailwind.config.js`:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary — Biru dongker (otoritas, keselamatan)
        primary: {
          900: '#0F2442',
          800: '#1A3C6E',
          700: '#1E4D8C',
          600: '#2563EB',
          500: '#3B82F6',
        },
        // Secondary — Amber/Kuning (CTA, peringatan)
        secondary: {
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        // Status
        success: '#16A34A',      // Hijau — Layak Jalan
        danger: '#DC2626',       // Merah — Tidak Layak / Dilarang
        warning: '#D97706',      // Oranye — Peringatan/Perbaiki
        info: '#2563EB',         // Biru — Belum Inspeksi
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],      // Heading, judul
        body: ['Inter', 'sans-serif'],           // Teks umum
        mono: ['JetBrains Mono', 'monospace'],   // Nomor polisi, kode
      },
      borderRadius: {
        'card': '10px',
        'button': '8px',
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0,0,0,0.07)',
        'card-hover': '0 10px 15px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}
```

### 5.2 Tipografi

Dikonfigurasi di Tailwind config di atas. Penggunaan:
```jsx
{/* Heading */}
<h1 className="font-display font-bold text-2xl">Dashboard</h1>

{/* Body text */}
<p className="font-body text-sm">Selamat datang</p>

{/* Nomor polisi, kode */}
<span className="font-mono text-lg font-semibold">B 7123 KCA</span>
```

### 5.3 Komponen Kunci (Dari Mockup UI)

| Komponen | Deskripsi | Dipakai di |
|----------|-----------|-----------|
| **KPICard** | Card metrik dengan angka besar + ikon + tren | Dashboard Admin |
| **StatusBadge** | Label warna (LAYAK/TIDAK LAYAK/PERINGATAN/BELUM) | Seluruh halaman |
| **InspectionItem** | Card per item inspeksi dengan toggle/radio | Form Wizard Step 2-4 |
| **StepIndicator** | Progress bar 6 langkah dengan label | Form Wizard |
| **SignatureCanvas** | Canvas HTML5 untuk tanda tangan jari | Form Step 5 |
| **BottomNav** | Navigasi bawah 4-5 tab dengan ikon | Mobile view |
| **Sidebar** | Menu samping kiri dengan ikon | Desktop admin |
| **FilterTabs** | Tab filter horizontal (Semua/Laik/Tidak Laik/dll) | List pages |
| **VehicleCard** | Card info kendaraan (nopol, PO, status) | Armada, Dashboard |
| **DriverCard** | Card info supir (nama, SIM, status) | Manajemen Supir |
| **DocumentCard** | Card dokumen dengan countdown expiry | Pelacak Dokumen |
| **NotificationItem** | Item notifikasi dengan ikon tipe + timestamp | Pusat Notifikasi |
| **RepairLogCard** | Card log perbaikan dengan status + estimasi | Log Perbaikan |

### 5.4 Navigasi

**Supir — Bottom Navigation (Mobile) & Top Nav (Desktop):**
```
Home  |  Inspeksi  |  Riwayat  |  Profil
(Gunakan ikon SVG Lucide: Home, ClipboardCheck, History, User)
```

**Admin — Desktop Sidebar (persistent) + Mobile Bottom Nav (collapsed):**
```
Desktop Sidebar:
├── Dashboard        (LayoutDashboard icon)
├── Inspeksi         (ClipboardList icon)
├── Armada           (Bus icon)
├── Supir            (Users icon)
├── Dokumen          (FileText icon)
├── Laporan          (BarChart3 icon)
├── Notifikasi       (Bell icon)
├── Perbaikan        (Wrench icon)
└── Pengaturan       (Settings icon)

Mobile Bottom Nav (5 item):
Home | Inspeksi | Armada | Notifikasi | Menu (hamburger → sidebar)
```

---

## 6. Halaman & Routing (22 Halaman)

```
/                              → SplashScreen.jsx
/login                         → LoginPage.jsx
/reset-password                → ResetPassword.jsx

/supir/dashboard               → DashboardSupir.jsx
/supir/inspeksi/baru           → InspeksiBaru.jsx (6-step wizard)
/supir/inspeksi/:id            → DetailInspeksi.jsx
/supir/riwayat                 → RiwayatInspeksi.jsx
/supir/profil                  → ProfilSupir.jsx

/admin/dashboard               → DashboardAdmin.jsx
/admin/inspeksi                → DaftarInspeksi.jsx
/admin/inspeksi/:id            → DetailInspeksiAdmin.jsx (+ ekspor PDF)
/admin/armada                  → ManajemenArmada.jsx
/admin/armada/tambah           → TambahArmada.jsx
/admin/supir                   → ManajemenSupir.jsx
/admin/supir/tambah            → TambahSupir.jsx
/admin/dokumen                 → PelacakDokumen.jsx
/admin/laporan                 → LaporanBerkala.jsx
/admin/notifikasi              → PusatNotifikasi.jsx
/admin/perbaikan               → LogPerbaikan.jsx
/admin/pengaturan              → PengaturanSistem.jsx
```

---

## 7. Roadmap Pengembangan — 3 Fase

### Fase 1 — MVP (Prioritas Utama)

> **Fokus**: Sistem inti yang berfungsi penuh dari login sampai ekspor PDF

#### Modul A: Autentikasi
- [x] Splash screen dengan branding SI-CEKAT
- [ ] Login page — tab Supir (SIM + PIN) / Admin (username + password)
- [ ] Simulasi auth terhadap data JSON lokal
- [ ] Session management via LocalStorage (auto-logout 12 jam)
- [ ] Protected routes berdasarkan role
- [ ] Reset password (admin only)

#### Modul B: Dashboard Supir
- [ ] Kartu status hari ini (sudah/belum inspeksi)
- [ ] Info armada aktif yang ditugaskan
- [ ] Tombol CTA besar "Mulai Inspeksi Baru"
- [ ] Riwayat 5 inspeksi terakhir (mini cards)
- [ ] Status SIM (sisa hari berlaku)
- [ ] Info rute/trayek hari ini

#### Modul C: Form Inspeksi Digital (6-Step Wizard)
- [ ] **Step 1 — Data Kendaraan**: pilih armada, auto-fill STUK/PO, jenis trayek
- [ ] **Step 2 — Unsur Administrasi**: 4 item dengan radio button sesuai formulir
- [ ] **Step 3 — Unsur Teknis Utama**: 14 sub-item dengan toggle OK/Gagal + pilihan Kanan/Kiri
- [ ] **Step 4 — Unsur Teknis Penunjang**: 14 item + item tambahan Form 2
- [ ] **Step 5 — Dokumentasi**: upload foto + tanda tangan digital canvas + catatan
- [ ] **Step 6 — Review & Submit**: ringkasan + preview status + submit (immutable)
- [ ] Progress bar / step indicator antar langkah
- [ ] Validasi per step (tidak bisa skip item wajib)
- [ ] Auto-save per step ke LocalStorage
- [ ] Warning real-time sesuai tingkat sanksi per seksi
- [ ] Timestamp otomatis (waktu mulai + waktu submit)
- [ ] Durasi pengisian tercatat

#### Modul D: Hasil Inspeksi (Auto-Generated)
- [ ] Nomor Ramp Check otomatis (format: RC-YYYYMMDD-XXX)
- [ ] Status kelaikan dengan warna + badge (LAIK JALAN / TIDAK LAIK JALAN)
- [ ] Skor persentase kelaikan
- [ ] Daftar item bermasalah + foto bukti
- [ ] Tanda tangan digital tertanam
- [ ] **Ekspor PDF** — formulir resmi yang sudah terisi otomatis (fitur utama!)
- [ ] Bagikan via link (copy URL read-only)

#### Modul E: Dashboard Admin (Basic)
- [ ] KPI cards: total inspeksi hari ini, bus laik, bus tidak laik, tertunda
- [ ] Grafik tren inspeksi 7 hari terakhir (line/bar chart)
- [ ] Daftar bus tidak laik hari ini
- [ ] Daftar bus belum inspeksi hari ini

#### Modul F: Riwayat Inspeksi
- [ ] Daftar semua inspeksi (supir: milik sendiri, admin: semua)
- [ ] Filter berdasarkan status, tanggal, nomor kendaraan
- [ ] Search by plat nomor atau ID inspeksi
- [ ] Klik untuk lihat detail / ekspor PDF

#### Modul G: Data Immutable
- [ ] Data inspeksi tidak bisa diedit setelah submit
- [ ] Timestamp server-like (tidak bisa dimanipulasi)
- [ ] Durasi pengisian tersimpan (deteksi data fiktif)

---

### Fase 2 — Pengembangan Lanjutan

> **Fokus**: Manajemen data, analitik, dan operasional lanjutan

#### Modul H: Manajemen Armada (Admin)
- [ ] Daftar armada — card/list dengan filter status
- [ ] Tambah/edit kendaraan (nopol, STUK, merk, tahun, kapasitas)
- [ ] Profil kendaraan + riwayat inspeksi per kendaraan
- [ ] Item yang paling sering bermasalah per kendaraan

#### Modul I: Manajemen Supir (Admin)
- [ ] Daftar supir — card dengan info SIM, status (aktif/cuti/nonaktif)
- [ ] Tambah/edit supir (nama, SIM, masa berlaku, foto, phone)
- [ ] Profil supir + statistik (total inspeksi, rata-rata durasi)
- [ ] Riwayat inspeksi per supir

#### Modul J: Pelacak Dokumen
- [ ] List dokumen per kendaraan (STUK/KIR, KP, asuransi)
- [ ] Alert warna: MERAH (kadaluarsa), KUNING (< 30 hari), HIJAU (berlaku)
- [ ] Filter berdasarkan status expiry
- [ ] Countdown hari menuju kadaluarsa

#### Modul K: Analitik Lanjutan (Dashboard Admin)
- [ ] Bar chart: top 10 item paling sering bermasalah
- [ ] Pie/donut chart: distribusi status kendaraan
- [ ] Tren laik/tidak laik per minggu/bulan
- [ ] Filter rentang waktu

#### Modul L: Catatan Tindak Lanjut Perbaikan
- [ ] Admin menambah catatan perbaikan per inspeksi bermasalah
- [ ] Status: Belum Ditindaklanjuti / Dalam Proses / Selesai
- [ ] Estimasi waktu selesai
- [ ] Histori catatan per kendaraan

#### Modul M: Notifikasi & Eskalasi
- [ ] Pusat notifikasi (in-app) — semua alert terpusat
- [ ] Eskalasi otomatis: bus tidak laik → notifikasi admin
- [ ] Alert dokumen kadaluarsa
- [ ] Badge notifikasi belum dibaca di navbar

#### Modul N: Foto Dokumentasi per Item
- [ ] Upload foto per item inspeksi (opsional jika OK, wajib jika bermasalah)
- [ ] Kompresi foto sebelum simpan (Base64)
- [ ] Preview foto di detail inspeksi

---

### Fase 3 — Fitur Premium

> **Fokus**: Offline capability, laporan otomatis, fitur advanced

#### Modul O: Mode Offline (PWA)
- [ ] Service Worker untuk cache halaman + assets
- [ ] Form inspeksi bisa diisi tanpa internet (IndexedDB)
- [ ] Halaman sinkronisasi data — antrian upload
- [ ] Indikator status koneksi (online/offline)
- [ ] Auto-sync saat koneksi kembali

#### Modul P: Laporan Berkala
- [ ] Generate laporan PDF/Excel untuk periode tertentu
- [ ] Rekapitulasi: total inspeksi, laik/tidak laik, item bermasalah
- [ ] Laporan per kendaraan / per supir
- [ ] Download PDF/Excel

#### Modul Q: Riwayat Kondisi Kendaraan
- [ ] Timeline visual vertikal per kendaraan
- [ ] Grafik tren kondisi kendaraan dari waktu ke waktu
- [ ] Prediksi item yang akan bermasalah (pola berulang)

---

## 8. Data Model (LocalStorage + JSON)

### 8.1 Seed Data — `public/data/`

**supir.json** (2 supir):
```json
[
  {
    "id": "DRV-8821",
    "nama": "Budi Santoso",
    "nomorSIM": "8291-3321-998",
    "tipeSIM": "B1 Umum",
    "masaBerlakuSIM": "2026-12-08",
    "umur": 42,
    "telepon": "081234567890",
    "foto": null,
    "pin": "1234",
    "status": "aktif",
    "kendaraanAktif": "KND-001"
  },
  {
    "id": "DRV-8822",
    "nama": "Agus Setiawan",
    "nomorSIM": "7761-2219-445",
    "tipeSIM": "B2 Umum",
    "masaBerlakuSIM": "2025-11-05",
    "umur": 38,
    "telepon": "082198765432",
    "foto": null,
    "pin": "5678",
    "status": "aktif",
    "kendaraanAktif": "KND-002"
  }
]
```

**kendaraan.json** (3 kendaraan):
```json
[
  {
    "id": "KND-001",
    "nomorPolisi": "B 7123 KCA",
    "nomorSTUK": "KIR-JKT-8821-A",
    "namaPO": "PO. Sinar Jaya",
    "merk": "Mercedes-Benz OH 1626L",
    "tahun": 2019,
    "kapasitas": 40,
    "jenisAngkutan": "AKAP",
    "trayek": "Jakarta - Bandung",
    "status": "aktif",
    "lokasi": "Pool Jakarta Utama",
    "dokumen": {
      "stuk": { "nomor": "KIR-JKT-8821-A", "berlakuSampai": "2026-10-12" },
      "kpReguler": { "nomor": "KP-001", "berlakuSampai": "2027-01-15" },
      "asuransi": { "nomor": "INS-001", "berlakuSampai": "2026-08-30" }
    }
  },
  {
    "id": "KND-002",
    "nomorPolisi": "D 5678 EF",
    "nomorSTUK": "KIR-BDG-4421-B",
    "namaPO": "PO. Kramat Djati",
    "merk": "Hino RK8",
    "tahun": 2021,
    "kapasitas": 50,
    "jenisAngkutan": "Pariwisata",
    "trayek": "Bandung - Semarang",
    "status": "aktif",
    "lokasi": "Pool Jakarta Utama",
    "dokumen": {
      "stuk": { "nomor": "KIR-BDG-4421-B", "berlakuSampai": "2026-06-15" },
      "kpReguler": { "nomor": "KP-002", "berlakuSampai": "2026-09-20" },
      "asuransi": { "nomor": "INS-002", "berlakuSampai": "2026-12-01" }
    }
  },
  {
    "id": "KND-003",
    "nomorPolisi": "F 9012 GH",
    "nomorSTUK": "KIR-BGR-6601-C",
    "namaPO": "PO. Budiman",
    "merk": "Scania K410",
    "tahun": 2022,
    "kapasitas": 45,
    "jenisAngkutan": "AKDP",
    "trayek": "Bogor - Sukabumi",
    "status": "aktif",
    "lokasi": "Pool Jakarta Utama",
    "dokumen": {
      "stuk": { "nomor": "KIR-BGR-6601-C", "berlakuSampai": "2027-03-10" },
      "kpReguler": { "nomor": "KP-003", "berlakuSampai": "2027-05-25" },
      "asuransi": { "nomor": "INS-003", "berlakuSampai": "2027-01-18" }
    }
  }
]
```

### 8.2 Data Inspeksi (Simpan ke LocalStorage)

```json
{
  "id": "INS-20260522-001",
  "nomorRampCheck": "RC-20260522-001",
  "supirId": "DRV-8821",
  "kendaraanId": "KND-001",
  "tanggal": "2026-05-22",
  "waktuMulai": "2026-05-22T06:30:00+07:00",
  "waktuSubmit": "2026-05-22T06:48:22+07:00",
  "durasiDetik": 1092,
  "lokasi": { "tipe": "Pool", "nama": "Pool Jakarta Utama" },
  "jenisTrayek": "AKAP",
  "trayek": "Jakarta - Bandung",
  
  "seksiI": {
    "ADM-001": { "kondisi": "ada_berlaku" },
    "ADM-002": { "kondisi": "ada_berlaku" },
    "ADM-003": { "kondisi": "tidak_ada" },
    "ADM-004": { "kondisi": "ada_berlaku", "tipeSIM": "B1 Umum" }
  },
  
  "seksiII": {
    "TU-A-001a": { "kondisi": "ok" },
    "TU-A-001b": { "kondisi": "gagal", "detail": { "kanan": true, "kiri": false }, "foto": "base64..." },
    "TU-B-005": { "kondisi": "ok" },
    "TU-B-006": { "kondisi": "ok" }
  },
  
  "seksiIII": {
    "TP-A-010": { "kondisi": "ok" },
    "TP-E-016": { "kondisi": "gagal" },
    "TP-E-028": { "kondisi": "ok" }
  },
  
  "fotoUmum": ["base64..."],
  "catatan": "Ban cadangan perlu penggantian",
  "tandaTangan": "base64...",
  
  "hasil": {
    "statusFinal": "TIDAK_LAIK",
    "sanksi": "TILANG_DILARANG_OPERASIONAL",
    "skorPersen": 72,
    "itemBermasalah": [
      { "kode": "ADM-003", "label": "KP. Cadangan", "seksi": "I" },
      { "kode": "TU-A-001b", "label": "Lampu Utama Jauh (Kanan)", "seksi": "II" }
    ]
  }
}
```

---

## 9. Referensi UI Mockup

Semua desain UI mengacu pada 22 mockup yang ada di folder `stitch_si_cekat_design_system/`:

| Halaman | File Mockup Referensi |
|---------|----------------------|
| Splash Screen | `Splash Screen.jpg` |
| Login | `Login Screen.jpg` |
| Dashboard Supir | `Dashboard Supir.jpg` |
| Dashboard Admin | `Dashboard Admin.jpg` |
| Form Step 1 — Data Kendaraan | `Form Inspeksi - Data Kendaraan.jpg` |
| Form Step 2 — Administrasi | `Form Inspeksi - Unsur Administrasi (Standardized).jpg` |
| Form Step 3 — Teknis Utama | `Form Inspeksi - Teknis Utama.jpg` |
| Form Step 4 — Teknis Penunjang | `Form Inspeksi - Teknis Penunjang.jpg` |
| Form Step 5 — Finalisasi | `Form Inspeksi - Finalisasi.jpg` |
| Detail Hasil Inspeksi | `Detail Hasil Inspeksi - Form Analysis.jpg` |
| Riwayat Inspeksi | `Riwayat Inspeksi Lengkap.jpg` |
| Manajemen Armada | `Manajemen Armada (Mobile) - Revised Nav.jpg` |
| Daftar Armada Alt | `Manajemen Armada.jpg` |
| Tambah Armada | `Tambah Armada Baru.jpg` |
| Manajemen Supir | `Manajemen Supir (Mobile) - Revised Nav.jpg` |
| Tambah Supir | `Tambah Supir Baru.jpg` |
| Profil Supir | `Profil Supir.jpg` |
| Pelacak Dokumen | `Pelacak Dokumen.jpg` |
| Pusat Notifikasi | `Pusat Notifikasi.jpg` |
| Log Perbaikan | `Log Perbaikan Kendaraan.jpg` |
| Pengaturan Sistem | `Pengaturan Sistem.jpg` |
| Sinkronisasi Offline | `Status Sinkronisasi Offline.jpg` |

---

## 10. Verification Plan

### Fase 1 — Automated & Manual Testing

#### Automated
```bash
# Build check
npm run build

# Dev server
npm run dev
```

#### Manual Verification Checklist

**Auth:**
- [ ] Login sebagai supir → redirect ke `/supir/dashboard`
- [ ] Login sebagai admin → redirect ke `/admin/dashboard`
- [ ] Login gagal → tampil error message
- [ ] Protected route → redirect ke login jika belum auth
- [ ] Logout → clear session, redirect ke login

**Form Inspeksi:**
- [ ] Step 1: Pilih kendaraan → auto-fill STUK, PO
- [ ] Step 2: Pilih kondisi per item administrasi → warning muncul jika bermasalah
- [ ] Step 3: Toggle item teknis utama → detail kanan/kiri muncul jika gagal
- [ ] Step 4: Toggle item teknis penunjang → semua 14+ item tersedia
- [ ] Step 5: Upload foto + tanda tangan canvas berfungsi
- [ ] Step 6: Review menampilkan semua data + preview status
- [ ] Submit → data tersimpan, tidak bisa diedit
- [ ] Auto-save berfungsi (tutup browser → buka lagi → data masih ada)

**Hasil & PDF:**
- [ ] Detail inspeksi menampilkan semua data dengan benar
- [ ] Status badge warna sesuai (hijau=LAYAK/merah=TIDAK LAYAK/kuning=PERINGATAN)
- [ ] Skor persentase terhitung benar
- [ ] **PDF export** — formulir terisi persis sesuai layout formulir resmi
- [ ] Semua checkbox di PDF tercentang sesuai input
- [ ] Tanda tangan muncul di PDF
- [ ] Ukuran PDF = A4

**Dashboard Admin:**
- [ ] KPI cards menampilkan data akurat
- [ ] Chart render dengan benar
- [ ] Daftar bus tidak laik muncul

**Responsif:**
- [ ] Mobile (375px) — bottom nav, cards full-width, single column
- [ ] Tablet (768px) — 2-column grid, sidebar collapsible
- [ ] Desktop (1024px+) — sidebar admin persistent, multi-column dashboard, tampilan profesional penuh

---

## User Review Required

> [!IMPORTANT]
> **Pendekatan PDF Export**: Menggunakan **pdf-lib** untuk meng-overlay data langsung ke file PDF template formulir resmi yang sudah dimiliki user. Koordinat setiap field/checkbox akan dipetakan saat development. User perlu menyediakan file PDF template kosong di folder `public/templates/formulir-inspeksi.pdf`.

> [!IMPORTANT]
> **Item Inspeksi Gabungan**: Form digital menggabungkan **Form 1 (23 item asli)** + **Form 2 (6 item tambahan)** menjadi total **~30 item**. Pada PDF export, hanya item dari Form 1 yang ditampilkan sesuai layout formulir resmi. Item Form 2 tambahan bisa ditampilkan sebagai lampiran atau di halaman tambahan. Apakah pendekatan ini benar, atau semua item harus masuk ke satu halaman PDF?

> [!WARNING]
> **Prototype Frontend-Only**: Semua data disimpan di **LocalStorage** browser. Artinya data akan hilang jika browser di-clear. Ini cocok untuk demo/presentasi. Jika nanti perlu persistent storage, bisa di-upgrade ke Firebase/Supabase tanpa banyak perubahan arsitektur karena data layer sudah dipisah di `context/` dan `hooks/`.

> [!NOTE]
> **Terminologi**: Istilah "Laik Jalan" di formulir resmi akan ditampilkan sebagai "Layak Jalan" di seluruh antarmuka website untuk kemudahan pemahaman pengguna. Namun pada **PDF export**, teks tetap mengikuti formulir resmi (karena data di-overlay ke template PDF asli yang sudah menggunakan istilah "Laik").

## Keputusan Final (Resolved)

Semua pertanyaan terbuka telah dijawab:

| # | Pertanyaan | Keputusan |
|---|-----------|-----------|
| 1 | **Data Sampel** | **2 supir, 3 kendaraan, 3 inspeksi** (1 Layak, 1 Peringatan, 1 Tidak Layak) |
| 2 | **Logo** | **Teks biasa** — tidak perlu file logo, gunakan teks "SI-CEKAT" dengan styling font |
| 3 | **File PDF Template** | ✅ **Sudah tersedia** — `FORMULIR INSPEKSI KESELAMATAN.pdf` (557 KB) di folder proyek. Akan di-copy ke `public/templates/` saat setup |
| 4 | **Kolom Penguji & PPNS** | **Dikosongkan** di hasil export PDF — hanya kolom PENGEMUDI yang diisi dengan tanda tangan digital supir |

