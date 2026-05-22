// Konfigurasi koordinat (x, y) untuk overlay data ke PDF template
// Posisi 0,0 biasanya di kiri bawah pada pdf-lib (standar PDF coordinate system)
// Asumsi ukuran kertas A4 (595 x 842 points)

// Helper: y coordinate is from bottom. If top is 0 in standard image, pdf Y = 842 - topY

export const PDF_FIELDS = {
  header: {
    // Top-left area
    hariTanggal: { x: 180, y: 720, size: 10 },
    lokasi: {
      terminal: { x: 165, y: 700, size: 10 }, // Checkbox
      pool:     { x: 215, y: 700, size: 10 }, // Checkbox
      lainnya:  { x: 265, y: 700, size: 10 }, // Checkbox
    },
    namaLokasi:    { x: 180, y: 680, size: 10 },
    namaPengemudi:  { x: 180, y: 660, size: 10 },
    umur:           { x: 180, y: 640, size: 10 },
    
    // Top-right area
    namaPO:         { x: 470, y: 720, size: 10 },
    nomorKendaraan: { x: 470, y: 700, size: 10 },
    nomorSTUK:      { x: 470, y: 680, size: 10 },
    jenisTrayek:    { x: 470, y: 660, size: 10 },
    trayek:         { x: 470, y: 640, size: 10 },
  },
  
  // Checkboxes for Seksi I, II, III
  // x_ok, x_gagal are for the checkboxes
  // Some items have specific left/right fail checkboxes
  seksiI: {
    'ADM-001': { x_ok: 300, y: 600, x_gagal: 350 },
    'ADM-002': { x_ok: 300, y: 580, x_gagal: 350 },
    'ADM-003': { x_ok: 300, y: 560, x_gagal: 350 },
    'ADM-004': { x_ok: 300, y: 540, x_gagal: 350 },
  },
  
  seksiII: {
    'TU-A-001a': { x_ok: 300, y: 500, x_gagal: 350, x_gagal_kanan: 400, x_gagal_kiri: 450 },
    'TU-A-001b': { x_ok: 300, y: 480, x_gagal: 350, x_gagal_kanan: 400, x_gagal_kiri: 450 },
    'TU-A-002a': { x_ok: 300, y: 460, x_gagal: 350, x_gagal_kanan: 400, x_gagal_kiri: 450 },
    'TU-A-002b': { x_ok: 300, y: 440, x_gagal: 350, x_gagal_kanan: 400, x_gagal_kiri: 450 },
    'TU-A-003':  { x_ok: 300, y: 420, x_gagal: 350, x_gagal_kanan: 400, x_gagal_kiri: 450 },
    'TU-A-004':  { x_ok: 300, y: 400, x_gagal: 350, x_gagal_kanan: 400, x_gagal_kiri: 450 },
    'TU-B-005':  { x_ok: 300, y: 380, x_gagal: 350 },
    'TU-B-006':  { x_ok: 300, y: 360, x_gagal: 350 },
    'TU-C-007':  { x_ok: 300, y: 340, x_gagal: 350 },
    'TU-D-008a': { x_ok: 300, y: 320, x_gagal: 350, x_gagal_kanan: 400, x_gagal_kiri: 450 },
    'TU-D-008b': { x_ok: 300, y: 300, x_gagal: 350, x_gagal_kanan: 400, x_gagal_kiri: 450 },
    'TU-E-009':  { x_ok: 300, y: 280, x_gagal: 350 },
  },
  
  seksiIII: {
    'TP-A-010':  { x_ok: 300, y: 240, x_gagal: 350 },
    'TP-B-011a': { x_ok: 300, y: 220, x_gagal: 350, x_gagal_kanan: 400, x_gagal_kiri: 450 },
    'TP-B-011b': { x_ok: 300, y: 200, x_gagal: 350, x_gagal_kanan: 400, x_gagal_kiri: 450 },
    'TP-C-012':  { x_ok: 300, y: 180, x_gagal: 350 },
    'TP-C-013':  { x_ok: 300, y: 160, x_gagal: 350 },
    'TP-C-014':  { x_ok: 300, y: 140, x_gagal: 350 },
    'TP-D-015':  { x_ok: 300, y: 120, x_gagal: 350 },
    'TP-E-016':  { x_ok: 300, y: 100, x_gagal: 350 },
    'TP-E-017':  { x_ok: 300, y: 80, x_gagal: 350 },
    'TP-E-018':  { x_ok: 300, y: 60, x_gagal: 350 },
    'TP-E-019':  { x_ok: 300, y: 40, x_gagal: 350 },
    'TP-E-020':  { x_ok: 300, y: 20, x_gagal: 350 },
    'TP-F-021':  { x_ok: 450, y: 240, x_gagal: 500 },
    'TP-F-022':  { x_ok: 450, y: 220, x_gagal: 500 },
    'TP-F-023':  { x_ok: 450, y: 200, x_gagal: 500 },
  },
  
  kesimpulan: {
    layakJalan:      { x: 100, y: 100, size: 14 },
    tidakLayakJalan: { x: 300, y: 100, size: 14 },
    // Checkboxes for sanksi
    diijinkanOperasi: { x: 100, y: 80 },
    peringatanPerbaiki: { x: 100, y: 60 },
    tilangDilarang: { x: 300, y: 80 },
    dilarangOperasi: { x: 300, y: 60 },
    catatan: { x: 100, y: 40, size: 10 },
  },
  
  tandaTangan: {
    pengemudi: { x: 80, y: 50, width: 100, height: 40 },
    namaPengemudi: { x: 80, y: 40, size: 10 },
  }
};
