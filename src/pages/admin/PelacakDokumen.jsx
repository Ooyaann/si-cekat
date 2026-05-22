import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { useDialog } from '../../context/DialogContext';

const PelacakDokumen = () => {
  const { kendaraanList, updateKendaraan } = useData();
  const { showAlert } = useDialog();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');

  const hitungSisaHari = (tanggalString) => {
    if (!tanggalString) return 0;
    const tgl = new Date(tanggalString);
    const hariIni = new Date();
    const selisihWaktu = tgl - hariIni;
    return Math.ceil(selisihWaktu / (1000 * 60 * 60 * 24));
  };

  const getUrgencyInfo = (sisaHari) => {
    if (sisaHari <= 0) {
      return { color: 'text-status-danger bg-status-danger/10 border-status-danger/20', label: 'Kedaluwarsa', badge: 'danger' };
    }
    if (sisaHari <= 30) {
      return { color: 'text-status-warning bg-status-warning/10 border-status-warning/20', label: `Segera Habis (${sisaHari} hari)`, badge: 'warning' };
    }
    return { color: 'text-status-success bg-status-success/10 border-status-success/20', label: `Aman (${sisaHari} hari)`, badge: 'success' };
  };

  // Fungsi simulasi memperpanjang dokumen
  const handleRenewDocument = (busId, docType) => {
    const bus = kendaraanList.find(k => k.id === busId);
    if (!bus) return;

    // Perpanjang 1 tahun (365 hari)
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 365);
    const newDateStr = newDate.toISOString().split('T')[0];

    const updatedBus = {
      ...bus,
      dokumen: {
        ...bus.dokumen,
        [docType]: {
          ...bus.dokumen[docType],
          berlakuSampai: newDateStr
        }
      }
    };

    updateKendaraan(updatedBus);
    showAlert({
      title: 'Dokumen Diperpanjang',
      message: `Dokumen ${docType.toUpperCase()} untuk armada ${bus.nomorPolisi} berhasil diperpanjang hingga ${newDateStr.split('-').reverse().join('-')}.`,
      type: 'success'
    });
  };

  const filteredKendaraan = kendaraanList.filter(k => {
    const matchesSearch = k.nomorPolisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          k.namaPO.toLowerCase().includes(searchTerm.toLowerCase());

    const sisaSTUK = hitungSisaHari(k.dokumen?.stuk?.berlakuSampai || k.nomorSTUK);
    const sisaKP = hitungSisaHari(k.dokumen?.kpReguler?.berlakuSampai);
    const sisaAsuransi = hitungSisaHari(k.dokumen?.asuransi?.berlakuSampai);

    const minSisa = Math.min(sisaSTUK, sisaKP, sisaAsuransi);

    if (activeFilter === 'Semua') return matchesSearch;
    if (activeFilter === 'Kedaluwarsa') return matchesSearch && minSisa <= 0;
    if (activeFilter === 'Segera Habis') return matchesSearch && minSisa > 0 && minSisa <= 30;
    if (activeFilter === 'Aman') return matchesSearch && minSisa > 30;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 select-none animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-extrabold text-neutral-dark">Pelacak Dokumen</h1>
        <p className="text-neutral-mid text-sm mt-1">Pantau masa berlaku KIR/STUK, KP Reguler, dan Asuransi Jasa Raharja</p>
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
          {['Semua', 'Kedaluwarsa', 'Segera Habis', 'Aman'].map((tab) => (
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

      {/* Document Table / List */}
      <div className="space-y-4">
        {filteredKendaraan.map((bus) => {
          const sisaSTUK = hitungSisaHari(bus.dokumen?.stuk?.berlakuSampai);
          const sisaKP = hitungSisaHari(bus.dokumen?.kpReguler?.berlakuSampai);
          const sisaAsuransi = hitungSisaHari(bus.dokumen?.asuransi?.berlakuSampai);

          const stukInfo = getUrgencyInfo(sisaSTUK);
          const kpInfo = getUrgencyInfo(sisaKP);
          const asuransiInfo = getUrgencyInfo(sisaAsuransi);

          return (
            <Card key={bus.id} className="p-5 hover:border-neutral-300 transition-all duration-300 shadow-sm bg-white/70 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <h3 className="font-mono text-base font-extrabold text-neutral-dark uppercase tracking-tight">
                    {bus.nomorPolisi}
                  </h3>
                  <p className="text-xs font-bold text-neutral-mid">{bus.namaPO} • {bus.merk}</p>
                </div>
                <div className="flex gap-1.5 items-center bg-neutral-light/50 border border-neutral-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-neutral-dark">
                  <span className="material-symbols-outlined text-neutral-mid text-[18px]">place</span>
                  <span>{bus.lokasi}</span>
                </div>
              </div>

              {/* Document items list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
                {/* KIR/STUK */}
                <div className="flex flex-col justify-between p-4 bg-neutral-light/35 border border-neutral-200/50 rounded-xl relative overflow-hidden">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">description</span>
                      <span className="text-xs font-bold text-neutral-dark">KIR / STUK</span>
                    </div>
                    <Badge status={stukInfo.badge} text={stukInfo.label.toUpperCase()} showIcon={false} />
                  </div>
                  <div className="text-xs font-semibold text-neutral-mid mb-4">
                    <p>Nomor: <span className="font-mono text-neutral-dark">{bus.dokumen?.stuk?.nomor || '-'}</span></p>
                    <p className="mt-1">Berlaku: <span className="text-neutral-dark">{bus.dokumen?.stuk?.berlakuSampai || '-'}</span></p>
                  </div>
                  <button 
                    onClick={() => handleRenewDocument(bus.id, 'stuk')}
                    className="w-full py-2 border border-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 btn-press shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[14px]">sync</span>
                    <span>Perpanjang KIR</span>
                  </button>
                </div>

                {/* KP Reguler */}
                <div className="flex flex-col justify-between p-4 bg-neutral-light/35 border border-neutral-200/50 rounded-xl relative overflow-hidden">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">assignment</span>
                      <span className="text-xs font-bold text-neutral-dark">Kartu Pengawasan</span>
                    </div>
                    <Badge status={kpInfo.badge} text={kpInfo.label.toUpperCase()} showIcon={false} />
                  </div>
                  <div className="text-xs font-semibold text-neutral-mid mb-4">
                    <p>Nomor: <span className="font-mono text-neutral-dark">{bus.dokumen?.kpReguler?.nomor || '-'}</span></p>
                    <p className="mt-1">Berlaku: <span className="text-neutral-dark">{bus.dokumen?.kpReguler?.berlakuSampai || '-'}</span></p>
                  </div>
                  <button 
                    onClick={() => handleRenewDocument(bus.id, 'kpReguler')}
                    className="w-full py-2 border border-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 btn-press shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[14px]">sync</span>
                    <span>Perpanjang KP</span>
                  </button>
                </div>

                {/* Asuransi Jasa Raharja */}
                <div className="flex flex-col justify-between p-4 bg-neutral-light/35 border border-neutral-200/50 rounded-xl relative overflow-hidden">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
                      <span className="text-xs font-bold text-neutral-dark">Asuransi</span>
                    </div>
                    <Badge status={asuransiInfo.badge} text={asuransiInfo.label.toUpperCase()} showIcon={false} />
                  </div>
                  <div className="text-xs font-semibold text-neutral-mid mb-4">
                    <p>Nomor: <span className="font-mono text-neutral-dark">{bus.dokumen?.asuransi?.nomor || '-'}</span></p>
                    <p className="mt-1">Berlaku: <span className="text-neutral-dark">{bus.dokumen?.asuransi?.berlakuSampai || '-'}</span></p>
                  </div>
                  <button 
                    onClick={() => handleRenewDocument(bus.id, 'asuransi')}
                    className="w-full py-2 border border-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 btn-press shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[14px]">sync</span>
                    <span>Perpanjang Asuransi</span>
                  </button>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredKendaraan.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-neutral-300 shadow-sm animate-fade-in">
            <span className="material-symbols-outlined text-[48px] text-neutral-300 mb-3">warning</span>
            <p className="text-neutral-mid font-semibold">Tidak ada armada yang sesuai filter dokumen.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PelacakDokumen;
