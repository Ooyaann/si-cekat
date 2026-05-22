import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { useDialog } from '../../context/DialogContext';

const LogPerbaikan = () => {
  const { inspeksiList, kendaraanList, updateKendaraan } = useData();
  const { showAlert } = useDialog();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Dalam Perbaikan');

  // Menemukan armada yang bermasalah berdasarkan inspeksi terakhir
  // Kita buat daftar perbaikan secara dinamis dari inspeksi yang berstatus TIDAK_LAYAK atau PERINGATAN
  // Dan jika admin menekan "Selesai Perbaikan", kita simpan di state lokal (misalnya di localStorage 'sicekat_perbaikan_selesai') agar statusnya berubah
  const [completedRepairs, setCompletedRepairs] = useState(() => {
    const stored = localStorage.getItem('sicekat_completed_repairs');
    return stored ? JSON.parse(stored) : [];
  });

  const handleCompleteRepair = (inspeksiId, kendaraanId) => {
    const updatedCompleted = [...completedRepairs, inspeksiId];
    setCompletedRepairs(updatedCompleted);
    localStorage.setItem('sicekat_completed_repairs', JSON.stringify(updatedCompleted));

    // Update status kendaraan di DataContext jika ada
    const bus = kendaraanList.find(k => k.id === kendaraanId);
    if (bus) {
      // Kita asumsikan kendaraan menjadi aktif / layak jalan kembali
      const updatedBus = {
        ...bus,
        status: 'aktif'
      };
      updateKendaraan(updatedBus);
    }

    showAlert({
      title: 'Perbaikan Selesai',
      message: `Perbaikan armada dengan ID Inspeksi ${inspeksiId} telah berhasil diselesaikan. Status kendaraan kini aktif/layak kembali.`,
      type: 'success'
    });
  };

  const getRepairsData = () => {
    const repairs = [];
    
    // Kelompokkan inspeksi berdasarkan kendaraan, ambil inspeksi terbaru untuk setiap kendaraan
    const latestInspeksiByKendaraan = {};
    inspeksiList.forEach(ins => {
      const current = latestInspeksiByKendaraan[ins.kendaraanId];
      if (!current || new Date(ins.waktuSubmit) > new Date(current.waktuSubmit)) {
        latestInspeksiByKendaraan[ins.kendaraanId] = ins;
      }
    });

    Object.values(latestInspeksiByKendaraan).forEach(ins => {
      const isBermasalah = ins.hasil.statusFinal === 'TIDAK_LAYAK' || ins.hasil.statusFinal === 'PERINGATAN';
      if (isBermasalah) {
        const isSelesai = completedRepairs.includes(ins.id);
        const bus = kendaraanList.find(k => k.id === ins.kendaraanId);
        
        repairs.push({
          id: ins.id,
          tanggal: ins.tanggal,
          kendaraanId: ins.kendaraanId,
          nomorPolisi: bus?.nomorPolisi || 'B 1234 CD',
          namaPO: bus?.namaPO || 'PO Bus',
          merk: bus?.merk || 'Mercedes-Benz',
          statusFinal: ins.hasil.statusFinal,
          itemBermasalah: ins.hasil.itemBermasalah || [],
          catatan: ins.catatan || 'Ada kerusakan teknis',
          estimasiHari: ins.hasil.statusFinal === 'TIDAK_LAYAK' ? 3 : 1,
          isSelesai: isSelesai
        });
      }
    });

    return repairs;
  };

  const repairsData = getRepairsData();

  const filteredRepairs = repairsData.filter(r => {
    const matchesSearch = r.nomorPolisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.namaPO.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === 'Semua') return matchesSearch;
    if (activeFilter === 'Dalam Perbaikan') return matchesSearch && !r.isSelesai;
    if (activeFilter === 'Selesai') return matchesSearch && r.isSelesai;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 select-none animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-extrabold text-neutral-dark">Log Perbaikan</h1>
        <p className="text-neutral-mid text-sm mt-1">Pantau unit armada yang masuk bengkel serta detail kerusakan komponen</p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined text-neutral-mid absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[20px]">
            search
          </span>
          <input 
            type="text"
            placeholder="Cari Plat Nomor atau PO Bus..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm text-neutral-dark placeholder:text-neutral-mid outline-none transition-shadow shadow-sm font-medium"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
          {['Semua', 'Dalam Perbaikan', 'Selesai'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`h-11 px-4 rounded-lg font-bold text-xs uppercase tracking-wider border transition-all duration-200 shrink-0
                ${activeFilter === tab 
                  ? 'bg-primary border-primary text-white shadow-md' 
                  : 'bg-white border-neutral-200 text-neutral-mid hover:text-neutral-dark hover:border-neutral-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* List perbaikan */}
      <div className="space-y-4">
        {filteredRepairs.map((repair) => (
          <Card key={repair.id} className="p-5 hover:border-neutral-300 transition-all duration-300 shadow-sm relative overflow-hidden bg-white/70 backdrop-blur-md">
            {repair.isSelesai ? (
              <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-status-success"></div>
            ) : (
              <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-status-danger animate-pulse"></div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${repair.isSelesai ? 'bg-status-success/10 text-status-success border-status-success/25' : 'bg-status-danger/10 text-status-danger border-status-danger/25'}`}>
                  <span className="material-symbols-outlined text-[20px]">construction</span>
                </div>
                <div>
                  <h3 className="font-mono text-base font-extrabold text-neutral-dark uppercase tracking-tight">
                    {repair.nomorPolisi}
                  </h3>
                  <p className="text-xs font-bold text-neutral-mid">{repair.namaPO} • {repair.merk}</p>
                </div>
              </div>

              <div className="flex gap-3 items-center self-start sm:self-auto">
                {!repair.isSelesai && (
                  <div className="flex items-center gap-1.5 text-xs text-status-warning bg-status-warning/10 border border-status-warning/20 px-2.5 py-1 rounded-lg font-bold">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    <span>Est. {repair.estimasiHari} Hari</span>
                  </div>
                )}
                <Badge 
                  status={repair.isSelesai ? 'success' : 'danger'} 
                  text={repair.isSelesai ? 'Selesai Perbaikan' : 'Dalam Perbaikan'} 
                />
              </div>
            </div>

            {/* Detail Kerusakan */}
            <div className="mt-4 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-neutral-mid uppercase tracking-wider block mb-1.5">Daftar Komponen Bermasalah:</span>
                <div className="flex flex-wrap gap-2">
                  {repair.itemBermasalah.map((item, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1.5 bg-status-danger/5 border border-status-danger/15 text-status-danger rounded-lg text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[14px] text-status-danger" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                      <span>{item.label}</span>
                    </span>
                  ))}
                  {repair.itemBermasalah.length === 0 && (
                    <span className="text-xs font-bold text-neutral-mid italic">Tidak ada catatan komponen spesifik.</span>
                  )}
                </div>
              </div>

              <div className="bg-neutral-light/50 border border-neutral-200 rounded-lg p-3 text-xs font-semibold text-neutral-dark">
                <span className="text-[9px] font-bold text-neutral-mid block uppercase mb-1">Catatan Mekanik / Driver:</span>
                {repair.catatan}
              </div>

              {!repair.isSelesai && (
                <div className="pt-2 flex justify-end">
                  <button 
                    onClick={() => handleCompleteRepair(repair.id, repair.kendaraanId)}
                    className="px-4 py-2 bg-status-success text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm btn-press"
                  >
                    <span className="material-symbols-outlined text-[16px] font-bold">check_circle</span>
                    <span>Tandai Perbaikan Selesai</span>
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}

        {filteredRepairs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-neutral-300 shadow-sm animate-fade-in">
            <span className="material-symbols-outlined text-[48px] text-neutral-350 mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <p className="text-neutral-mid font-semibold">Tidak ada armada dalam antrean perbaikan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogPerbaikan;
