export const formItems = {
  seksiI: [
    { id: 'ADM-001', label: 'Kartu Uji / STUK', type: 'radio_status' },
    { id: 'ADM-002', label: 'KP. Reguler', type: 'radio_status' },
    { id: 'ADM-003', label: 'KP. Cadangan', type: 'radio_status' },
    { id: 'ADM-004', label: 'SIM Pengemudi', type: 'radio_sim' }
  ],
  seksiII: {
    A: {
      title: 'Sistem Penerangan',
      items: [
        { id: 'TU-A-001a', label: 'Lampu Utama Dekat', type: 'toggle_lr' },
        { id: 'TU-A-001b', label: 'Lampu Utama Jauh', type: 'toggle_lr' },
        { id: 'TU-A-002a', label: 'Lampu Sein Depan', type: 'toggle_lr' },
        { id: 'TU-A-002b', label: 'Lampu Sein Belakang', type: 'toggle_lr' },
        { id: 'TU-A-003', label: 'Lampu Rem', type: 'toggle_lr' },
        { id: 'TU-A-004', label: 'Lampu Mundur', type: 'toggle_lr' }
      ]
    },
    B: {
      title: 'Sistem Pengereman',
      items: [
        { id: 'TU-B-005', label: 'Rem Utama', type: 'toggle_basic' },
        { id: 'TU-B-006', label: 'Rem Parkir', type: 'toggle_basic' }
      ]
    },
    C: {
      title: 'Badan Kendaraan',
      items: [
        { id: 'TU-C-007', label: 'Kondisi Kaca Depan', type: 'toggle_basic', okLabel: 'Baik', failLabel: 'Buruk' }
      ]
    },
    D: {
      title: 'Ban',
      items: [
        { id: 'TU-D-008a', label: 'Ban Depan', type: 'toggle_lr', failLabel: 'Tidak Laik' },
        { id: 'TU-D-008b', label: 'Ban Belakang', type: 'toggle_lr', failLabel: 'Tidak Laik' }
      ]
    },
    E: {
      title: 'Perlengkapan',
      items: [
        { id: 'TU-E-009', label: 'Sabuk Keselamatan Pengemudi', type: 'toggle_basic', okLabel: 'Ada & Fungsi', failLabel: 'Tidak Ada/Rusak' }
      ]
    },
    F: {
      title: 'Tanggap Darurat (Tambahan Form 2)',
      items: [
        { id: 'TU-F-014', label: 'APAR (Alat Pemadam Api Ringan)', type: 'toggle_basic', okLabel: 'Ada', failLabel: 'Tidak Ada/Kadaluarsa' }
      ]
    }
  },
  seksiIII: {
    A: {
      title: 'Pengukur Kecepatan',
      items: [
        { id: 'TP-A-010', label: 'Pengukur Kecepatan', type: 'toggle_basic', okLabel: 'Ada & Fungsi', failLabel: 'Tidak Ada/Rusak' }
      ]
    },
    B: {
      title: 'Sistem Penerangan',
      items: [
        { id: 'TP-B-011a', label: 'Lampu Posisi Depan', type: 'toggle_lr' },
        { id: 'TP-B-011b', label: 'Lampu Posisi Belakang', type: 'toggle_lr' }
      ]
    },
    C: {
      title: 'Badan Kendaraan',
      items: [
        { id: 'TP-C-012', label: 'Kaca Spion', type: 'toggle_basic', okLabel: 'Ada & Sesuai', failLabel: 'Tidak Ada/Sesuai' },
        { id: 'TP-C-013', label: 'Penghapus Kaca (Wiper)', type: 'toggle_basic', okLabel: 'Ada & Fungsi', failLabel: 'Tidak Ada/Rusak' },
        { id: 'TP-C-014', label: 'Klakson', type: 'toggle_basic', okLabel: 'Ada & Fungsi', failLabel: 'Tidak Ada/Rusak' },
        { id: 'TP-C-024', label: 'Kondisi Pintu Utama', type: 'toggle_basic', okLabel: 'Baik', failLabel: 'Kurang Baik' },
        { id: 'TP-C-025', label: 'Lantai dan Tangga', type: 'toggle_basic', okLabel: 'Baik', failLabel: 'Keropos/Berlubang' }
      ]
    },
    D: {
      title: 'Kapasitas Tempat Duduk',
      items: [
        { id: 'TP-D-015', label: 'Jumlah Tempat Duduk Penumpang', type: 'toggle_basic', okLabel: 'Sesuai', failLabel: 'Tidak Sesuai' }
      ]
    },
    E: {
      title: 'Perlengkapan Kendaraan',
      items: [
        { id: 'TP-E-016', label: 'Ban Cadangan', type: 'toggle_basic', okLabel: 'Ada & Laik', failLabel: 'Tidak Ada/Laik' },
        { id: 'TP-E-017', label: 'Segitiga Pengaman', type: 'toggle_basic', okLabel: 'Ada', failLabel: 'Tidak Ada' },
        { id: 'TP-E-018', label: 'Dongkrak', type: 'toggle_basic', okLabel: 'Ada', failLabel: 'Tidak Ada' },
        { id: 'TP-E-019', label: 'Pembuka Roda', type: 'toggle_basic', okLabel: 'Ada', failLabel: 'Tidak Ada' },
        { id: 'TP-E-020', label: 'Lampu Senter', type: 'toggle_basic', okLabel: 'Ada & Fungsi', failLabel: 'Tidak Ada/Rusak' },
        { id: 'TP-E-026', label: 'Pengganjal Roda', type: 'toggle_basic', okLabel: 'Ada', failLabel: 'Tidak Ada' },
        { id: 'TP-E-027', label: 'Sabuk Keselamatan Penumpang', type: 'toggle_basic', okLabel: 'Ada & Laik', failLabel: 'Tidak Ada' },
        { id: 'TP-E-028', label: 'Kotak P3K', type: 'toggle_basic', okLabel: 'Ada', failLabel: 'Tidak Ada' }
      ]
    },
    F: {
      title: 'Tanggap Darurat',
      items: [
        { id: 'TP-F-021', label: 'Pintu Darurat', type: 'toggle_basic', okLabel: 'Ada & Fungsi', failLabel: 'Tidak Ada/Rusak' },
        { id: 'TP-F-022', label: 'Jendela Darurat', type: 'toggle_basic', okLabel: 'Ada', failLabel: 'Tidak Ada' },
        { id: 'TP-F-023', label: 'Alat Pemukul/Pemecah Kaca', type: 'toggle_basic', okLabel: 'Ada', failLabel: 'Tidak Ada' }
      ]
    }
  }
};
