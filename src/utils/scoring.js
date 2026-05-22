import { formItems } from '../data/formItems';

export const calculateScore = (formData) => {
  let isSeksiIFail = false;
  let isSeksiIIFail = false;
  let isSeksiIIIFail = false;
  
  const itemBermasalah = [];
  let totalItems = 0;
  let okItems = 0;

  // Cek Seksi I (Administrasi)
  formItems.seksiI.forEach(item => {
    totalItems++;
    const value = formData.seksiI[item.id];
    // if value is not 'ada_berlaku' then it's a fail
    if (value && value.kondisi !== 'ada_berlaku') {
      isSeksiIFail = true;
      itemBermasalah.push({ kode: item.id, label: item.label, seksi: 'I' });
    } else if (value && value.kondisi === 'ada_berlaku') {
      okItems++;
    }
  });

  // Cek Seksi II (Teknis Utama)
  Object.values(formItems.seksiII).forEach(section => {
    section.items.forEach(item => {
      totalItems++;
      const value = formData.seksiII[item.id];
      if (value && (value.kondisi === 'gagal' || value.kondisi === 'tidak_ada' || value.kondisi === 'buruk')) {
        isSeksiIIFail = true;
        
        // Cek detil Kanan/Kiri jika ada
        if (value.detail) {
          if (!value.detail.kanan) itemBermasalah.push({ kode: item.id, label: `${item.label} (Kanan)`, seksi: 'II' });
          if (!value.detail.kiri) itemBermasalah.push({ kode: item.id, label: `${item.label} (Kiri)`, seksi: 'II' });
        } else {
          itemBermasalah.push({ kode: item.id, label: item.label, seksi: 'II' });
        }
      } else if (value && (value.kondisi === 'ok' || value.kondisi === 'ada' || value.kondisi === 'baik')) {
        okItems++;
      }
    });
  });

  // Cek Seksi III (Teknis Penunjang)
  Object.values(formItems.seksiIII).forEach(section => {
    section.items.forEach(item => {
      totalItems++;
      const value = formData.seksiIII[item.id];
      if (value && (value.kondisi === 'gagal' || value.kondisi === 'tidak_ada' || value.kondisi === 'kurang_baik' || value.kondisi === 'keropos')) {
        isSeksiIIIFail = true;
        
        // Cek detil Kanan/Kiri jika ada
        if (value.detail) {
          if (!value.detail.kanan) itemBermasalah.push({ kode: item.id, label: `${item.label} (Kanan)`, seksi: 'III' });
          if (!value.detail.kiri) itemBermasalah.push({ kode: item.id, label: `${item.label} (Kiri)`, seksi: 'III' });
        } else {
          itemBermasalah.push({ kode: item.id, label: item.label, seksi: 'III' });
        }
      } else if (value && (value.kondisi === 'ok' || value.kondisi === 'ada' || value.kondisi === 'baik')) {
        okItems++;
      }
    });
  });

  // Tentukan Status Final dan Sanksi berdasarkan prioritas
  let statusFinal = 'LAYAK';
  let sanksi = 'DIIJINKAN_OPERASIONAL';

  if (isSeksiIFail) {
    statusFinal = 'TIDAK_LAYAK';
    sanksi = 'TILANG_DILARANG_OPERASIONAL';
  } else if (isSeksiIIFail) {
    statusFinal = 'TIDAK_LAYAK';
    sanksi = 'DILARANG_OPERASIONAL';
  } else if (isSeksiIIIFail) {
    statusFinal = 'PERINGATAN';
    sanksi = 'PERINGATAN_PERBAIKI';
  }

  const skorPersen = Math.round((okItems / totalItems) * 100) || 0;

  return {
    statusFinal,
    sanksi,
    skorPersen,
    itemBermasalah
  };
};
