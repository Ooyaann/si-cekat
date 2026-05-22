import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { useDialog } from '../../context/DialogContext';
import { CustomSelect } from '../../components/common/CustomSelect';

const LaporanBerkala = () => {
  const { inspeksiList, kendaraanList, supirList } = useData();
  const { showAlert } = useDialog();
  
  // Default rentang tanggal: 30 hari ke belakang hingga hari ini
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [selectedPO, setSelectedPO] = useState('Semua');

  // Mendapatkan daftar unik nama PO bus untuk filter
  const getUniquePOs = () => {
    const pos = new Set();
    kendaraanList.forEach(k => {
      if (k.namaPO) pos.add(k.namaPO);
    });
    return ['Semua', ...Array.from(pos)];
  };

  const uniquePOs = getUniquePOs();

  // Memfilter inspeksi berdasarkan rentang tanggal dan PO
  const getFilteredInspeksi = () => {
    return inspeksiList.filter(ins => {
      const withinDate = ins.tanggal >= startDate && ins.tanggal <= endDate;
      
      const bus = kendaraanList.find(k => k.id === ins.kendaraanId);
      const matchesPO = selectedPO === 'Semua' || bus?.namaPO === selectedPO;

      return withinDate && matchesPO;
    });
  };

  const filteredData = getFilteredInspeksi();

  // Perhitungan statistik rekap
  const total = filteredData.length;
  const layak = filteredData.filter(i => i.hasil.statusFinal === 'LAYAK').length;
  const tidakLayak = filteredData.filter(i => i.hasil.statusFinal === 'TIDAK_LAYAK').length;
  const peringatan = filteredData.filter(i => i.hasil.statusFinal === 'PERINGATAN').length;

  const rataSkor = total > 0 
    ? Math.round(filteredData.reduce((acc, curr) => acc + (curr.hasil.skorPersen || 0), 0) / total)
    : 0;

  const getStatusColor = (status) => {
    switch (status) {
      case 'LAYAK':
        return 'success';
      case 'PERINGATAN':
        return 'warning';
      case 'TIDAK_LAYAK':
      default:
        return 'danger';
    }
  };

  // Fungsi simulasi ekspor file rekapitulasi CSV
  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      showAlert({
        title: 'Ekspor Gagal',
        message: 'Tidak ada data laporan keselamatan pada periode dan filter PO yang dipilih.',
        type: 'error'
      });
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'ID Inspeksi,Nomor Rampcheck,Tanggal,Plat Nomor,Nama PO,Pengemudi,Skor Kelaikan (%),Status Akhir,Sanksi\n';

    filteredData.forEach(ins => {
      const bus = kendaraanList.find(k => k.id === ins.kendaraanId);
      const driver = supirList.find(s => s.id === ins.supirId);
      
      const row = [
        ins.id,
        ins.nomorRampCheck,
        ins.tanggal,
        bus?.nomorPolisi || '',
        bus?.namaPO || '',
        driver?.nama || '',
        ins.hasil.skorPersen,
        ins.hasil.statusFinal,
        ins.hasil.sanksi
      ].join(',');
      
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `REKAP_INSPEKSI_${startDate}_TO_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 select-none animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-neutral-dark">Laporan Berkala</h1>
          <p className="text-neutral-mid text-sm mt-1">Analisis tren kelayakan armada dan unduh data rekapitulasi</p>
        </div>
        
        <button 
          onClick={handleExportCSV}
          className="h-10 px-5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-card hover:shadow-card-hover btn-press self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">table_view</span>
          <span>Ekspor CSV</span>
        </button>
      </div>

      {/* Filter panel */}
      <Card className="p-5 bg-white/70 backdrop-blur-md hover:border-neutral-300 transition-all duration-300">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-neutral-mid uppercase tracking-wider mb-1.5">Tanggal Mulai</label>
            <div className="relative">
              <span className="material-symbols-outlined text-neutral-mid absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[18px]">
                calendar_today
              </span>
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-10 pl-10 pr-3 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm font-semibold outline-none transition-shadow"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-mid uppercase tracking-wider mb-1.5">Tanggal Akhir</label>
            <div className="relative">
              <span className="material-symbols-outlined text-neutral-mid absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[18px]">
                calendar_today
              </span>
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-10 pl-10 pr-3 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm font-semibold outline-none transition-shadow"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-mid uppercase tracking-wider mb-1.5">Nama Perusahaan (PO)</label>
            <CustomSelect
              value={selectedPO}
              onChange={(e) => setSelectedPO(e.target.value)}
              options={uniquePOs}
              placeholder="Pilih PO"
              heightClass="h-10"
            />
          </div>
        </div>
      </Card>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 flex flex-col justify-between bg-white/70 backdrop-blur-md hover:border-neutral-300 transition-all duration-300">
          <span className="text-[9px] font-bold text-neutral-mid uppercase tracking-wider">Total Inspeksi</span>
          <span className="text-2xl font-extrabold text-neutral-dark mt-2">{total}</span>
        </Card>
        
        <Card className="p-4 flex flex-col justify-between bg-white/70 backdrop-blur-md hover:border-neutral-300 transition-all duration-300">
          <span className="text-[9px] font-bold text-status-success uppercase tracking-wider">Layak Jalan</span>
          <span className="text-2xl font-extrabold text-status-success mt-2">{layak}</span>
        </Card>

        <Card className="p-4 flex flex-col justify-between bg-white/70 backdrop-blur-md hover:border-neutral-300 transition-all duration-300">
          <span className="text-[9px] font-bold text-status-warning uppercase tracking-wider">Peringatan</span>
          <span className="text-2xl font-extrabold text-status-warning mt-2">{peringatan}</span>
        </Card>

        <Card className="p-4 flex flex-col justify-between bg-white/70 backdrop-blur-md hover:border-neutral-300 transition-all duration-300">
          <span className="text-[9px] font-bold text-status-danger uppercase tracking-wider">Tidak Layak</span>
          <span className="text-2xl font-extrabold text-status-danger mt-2">{tidakLayak}</span>
        </Card>

        <Card className="p-4 flex flex-col justify-between col-span-2 md:col-span-1 bg-white/70 backdrop-blur-md hover:border-neutral-300 transition-all duration-300">
          <span className="text-[9px] font-bold text-neutral-mid uppercase tracking-wider">Rata-rata Skor</span>
          <span className="text-2xl font-extrabold text-neutral-dark mt-2">{rataSkor}%</span>
        </Card>
      </div>

      {/* Report Table */}
      <Card className="overflow-hidden bg-white/70 backdrop-blur-md">
        <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-light/20">
          <h3 className="font-display text-sm font-bold text-neutral-dark">Daftar Rekapitulasi Data</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3.5 font-bold text-[10px] uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3.5 font-bold text-[10px] uppercase tracking-wider">Plat Nomor</th>
                <th className="px-6 py-3.5 font-bold text-[10px] uppercase tracking-wider">Nama PO</th>
                <th className="px-6 py-3.5 font-bold text-[10px] uppercase tracking-wider">Pengemudi</th>
                <th className="px-6 py-3.5 font-bold text-[10px] uppercase tracking-wider text-center">Skor Kelaikan</th>
                <th className="px-6 py-3.5 font-bold text-[10px] uppercase tracking-wider">Status Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-dark">
              {filteredData.map((ins) => {
                const bus = kendaraanList.find(k => k.id === ins.kendaraanId);
                const driver = supirList.find(s => s.id === ins.supirId);
                
                return (
                  <tr key={ins.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-neutral-mid">{ins.tanggal}</td>
                    <td className="px-6 py-4 font-mono font-extrabold text-xs text-neutral-dark uppercase">{bus?.nomorPolisi || '-'}</td>
                    <td className="px-6 py-4 text-xs text-neutral-mid">{bus?.namaPO || '-'}</td>
                    <td className="px-6 py-4 text-xs text-neutral-dark">{driver?.nama || '-'}</td>
                    <td className="px-6 py-4 text-xs font-extrabold text-neutral-dark text-center">{ins.hasil.skorPersen}%</td>
                    <td className="px-6 py-4">
                      <Badge 
                        status={getStatusColor(ins.hasil.statusFinal)} 
                        text={ins.hasil.statusFinal.replace('_', ' ')} 
                        showIcon={false}
                      />
                    </td>
                  </tr>
                );
              })}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-neutral-mid font-semibold">
                    <span className="material-symbols-outlined text-[36px] text-neutral-350 mb-2">warning</span>
                    <p>Tidak ada data inspeksi dalam rentang tanggal dan filter terpilih.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default LaporanBerkala;
