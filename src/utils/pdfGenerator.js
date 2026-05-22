import { PDFDocument, rgb } from 'pdf-lib';
import { PDF_FIELDS } from './pdfFieldConfig';

// Helper to draw a checkmark
const drawCheck = (page, x, y, size = 12) => {
  try {
    page.drawText('✓', { x, y, size, color: rgb(0, 0, 0) });
  } catch {
    // Fallback: draw an X if checkmark fails
    page.drawText('X', { x, y, size, color: rgb(0, 0, 0) });
  }
};

// Helper to handle drawing text with fallback
const safeDrawText = (page, text, x, y, size = 10) => {
  if (text !== null && text !== undefined && String(text).trim() !== '') {
    try {
      page.drawText(String(text), { x, y, size, color: rgb(0, 0, 0) });
    } catch (err) {
      console.warn(`Gagal menulis teks "${text}" di (${x}, ${y}):`, err);
    }
  }
};

// Normalize inspeksi data to handle different data formats
const normalizeInspeksiData = (data) => {
  // Handle lokasi: could be { tipe, nama } object or flat fields
  let lokasi = data.lokasi;
  if (!lokasi || typeof lokasi !== 'object') {
    lokasi = {
      tipe: data.lokasiTipe || 'Lainnya',
      nama: data.lokasiNama || ''
    };
  }

  return {
    ...data,
    lokasi,
    tanggal: data.tanggal || new Date().toISOString().split('T')[0],
    catatan: data.catatan || '',
    hasil: data.hasil || { statusFinal: 'LAYAK', sanksi: 'DIIJINKAN_OPERASIONAL', skorPersen: 0, itemBermasalah: [] },
    seksiI: data.seksiI || {},
    seksiII: data.seksiII || {},
    seksiIII: data.seksiIII || {},
  };
};

export const generatePDF = async (inspeksiData, supirData, kendaraanData, onProgress) => {
  try {
    if (onProgress) onProgress('Menghubungkan ke server...');

    // Normalize data
    const data = normalizeInspeksiData(inspeksiData);

    // 1. Fetch template PDF
    const baseUrl = import.meta.env.BASE_URL || '/';
    const pdfUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}templates/formulir_inspeksi_keselamatan.pdf`;
    
    if (onProgress) onProgress('Mengunduh template formulir...');
    
    let response;
    try {
      response = await fetch(pdfUrl);
    } catch (fetchError) {
      throw new Error(`Tidak dapat mengakses template PDF. Pastikan file tersedia di server. (${fetchError.message})`, { cause: fetchError });
    }
    
    if (!response.ok) {
      throw new Error(`Template PDF tidak ditemukan (status ${response.status}). Pastikan file "formulir_inspeksi_keselamatan.pdf" ada di folder public/templates/.`);
    }
    
    const templateBytes = await response.arrayBuffer();
    
    if (!templateBytes || templateBytes.byteLength === 0) {
      throw new Error('Template PDF kosong atau rusak.');
    }
    
    if (onProgress) onProgress('Membaca template PDF...');
    
    // 2. Load PDF
    const pdfDoc = await PDFDocument.load(templateBytes);
    const pages = pdfDoc.getPages();
    
    if (pages.length === 0) {
      throw new Error('Template PDF tidak memiliki halaman.');
    }
    
    const page = pages[0];
    
    if (onProgress) onProgress('Mengisi data formulir...');
    
    // 3. Header mapping
    const h = PDF_FIELDS.header;
    safeDrawText(page, data.tanggal, h.hariTanggal.x, h.hariTanggal.y, h.hariTanggal.size);
    safeDrawText(page, data.lokasi?.nama, h.namaLokasi.x, h.namaLokasi.y, h.namaLokasi.size);
    safeDrawText(page, supirData?.nama, h.namaPengemudi.x, h.namaPengemudi.y, h.namaPengemudi.size);
    safeDrawText(page, supirData?.umur, h.umur.x, h.umur.y, h.umur.size);
    
    safeDrawText(page, kendaraanData?.namaPO, h.namaPO.x, h.namaPO.y, h.namaPO.size);
    safeDrawText(page, kendaraanData?.nomorPolisi, h.nomorKendaraan.x, h.nomorKendaraan.y, h.nomorKendaraan.size);
    safeDrawText(page, kendaraanData?.dokumen?.stuk?.nomor || kendaraanData?.nomorSTUK, h.nomorSTUK.x, h.nomorSTUK.y, h.nomorSTUK.size);
    safeDrawText(page, kendaraanData?.jenisAngkutan, h.jenisTrayek.x, h.jenisTrayek.y, h.jenisTrayek.size);
    safeDrawText(page, kendaraanData?.trayek, h.trayek.x, h.trayek.y, h.trayek.size);
    
    // Lokasi checkbox
    const lokasiTipe = data.lokasi?.tipe || '';
    if (lokasiTipe === 'Terminal') drawCheck(page, h.lokasi.terminal.x, h.lokasi.terminal.y);
    else if (lokasiTipe === 'Pool') drawCheck(page, h.lokasi.pool.x, h.lokasi.pool.y);
    else if (lokasiTipe) drawCheck(page, h.lokasi.lainnya.x, h.lokasi.lainnya.y);

    // 4. Fill Seksi I, II, III Checkboxes
    if (onProgress) onProgress('Mengisi data pemeriksaan...');
    
    const fillCheckboxes = (seksiData, seksiConfig) => {
      if (!seksiData || !seksiConfig) return;
      Object.keys(seksiConfig).forEach(kode => {
        const item = seksiData[kode];
        const coords = seksiConfig[kode];
        if (item && coords) {
          if (item.kondisi === 'ok' || item.kondisi === 'ada_berlaku' || item.kondisi === 'ada' || item.kondisi === 'baik') {
            drawCheck(page, coords.x_ok, coords.y);
          } else if (item.kondisi === 'gagal' || item.kondisi === 'tidak_berlaku' || item.kondisi === 'tidak_ada' || item.kondisi === 'buruk' || item.kondisi === 'kurang_baik') {
            drawCheck(page, coords.x_gagal, coords.y);
            if (item.detail && coords.x_gagal_kanan && coords.x_gagal_kiri) {
              if (!item.detail.kanan) drawCheck(page, coords.x_gagal_kanan, coords.y);
              if (!item.detail.kiri) drawCheck(page, coords.x_gagal_kiri, coords.y);
            }
          }
        }
      });
    };

    fillCheckboxes(data.seksiI, PDF_FIELDS.seksiI);
    fillCheckboxes(data.seksiII, PDF_FIELDS.seksiII);
    fillCheckboxes(data.seksiIII, PDF_FIELDS.seksiIII);

    // 5. Kesimpulan
    if (onProgress) onProgress('Menulis kesimpulan...');
    
    const res = data.hasil;
    const k = PDF_FIELDS.kesimpulan;
    
    if (res?.statusFinal === 'LAYAK' || res?.statusFinal === 'LAYAK JALAN') {
      drawCheck(page, k.layakJalan.x, k.layakJalan.y, k.layakJalan.size);
    } else if (res?.statusFinal === 'TIDAK_LAYAK' || res?.statusFinal === 'TIDAK LAYAK') {
      drawCheck(page, k.tidakLayakJalan.x, k.tidakLayakJalan.y, k.tidakLayakJalan.size);
    }
    
    if (res?.sanksi === 'DIIJINKAN_OPERASIONAL') drawCheck(page, k.diijinkanOperasi.x, k.diijinkanOperasi.y);
    else if (res?.sanksi === 'PERINGATAN_PERBAIKI') drawCheck(page, k.peringatanPerbaiki.x, k.peringatanPerbaiki.y);
    else if (res?.sanksi === 'TILANG_DILARANG_OPERASIONAL') drawCheck(page, k.tilangDilarang.x, k.tilangDilarang.y);
    else if (res?.sanksi === 'DILARANG_OPERASIONAL') drawCheck(page, k.dilarangOperasi.x, k.dilarangOperasi.y);

    // Catatan
    safeDrawText(page, data.catatan, k.catatan.x, k.catatan.y, k.catatan.size);

    // 6. Tanda Tangan Pengemudi (Embed Image)
    if (data.tandaTangan) {
      if (onProgress) onProgress('Memproses tanda tangan digital...');
      try {
        const ttdData = data.tandaTangan;
        let imgBytes;
        
        if (ttdData.startsWith('data:image/png')) {
          // It's a base64 data URL - convert to bytes
          const base64 = ttdData.split(',')[1];
          const binaryString = atob(base64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          imgBytes = bytes.buffer;
        } else {
          imgBytes = await fetch(ttdData).then(r => r.arrayBuffer());
        }
        
        const pngImage = await pdfDoc.embedPng(imgBytes);
        const t = PDF_FIELDS.tandaTangan.pengemudi;
        page.drawImage(pngImage, {
          x: t.x,
          y: t.y,
          width: t.width,
          height: t.height,
        });
      } catch (err) {
        console.warn("Tanda tangan tidak bisa ditempel (lanjut tanpa TTD):", err.message);
      }
    }
    
    safeDrawText(page, supirData?.nama, PDF_FIELDS.tandaTangan.namaPengemudi.x, PDF_FIELDS.tandaTangan.namaPengemudi.y, PDF_FIELDS.tandaTangan.namaPengemudi.size);

    if (onProgress) onProgress('Menyusun dokumen PDF...');
    
    // 7. Serialize and Trigger Download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    if (onProgress) onProgress('Memulai pengunduhan...');
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `SI-CEKAT_${data.nomorRampCheck || 'inspeksi'}.pdf`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (onProgress) onProgress(null);
    }, 200);

  } catch (error) {
    console.error("Error generating PDF:", error);
    if (onProgress) onProgress(`ERROR: ${error.message}`);
    throw error;
  }
};
