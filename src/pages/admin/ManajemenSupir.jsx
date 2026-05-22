import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { CustomSelect } from '../../components/common/CustomSelect';

const ManajemenSupir = () => {
  const { supirList, addSupir, kendaraanList } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [nama, setNama] = useState('');
  const [nomorSIM, setNomorSIM] = useState('');
  const [tipeSIM, setTipeSIM] = useState('B1 Umum');
  const [masaBerlakuSIM, setMasaBerlakuSIM] = useState('');
  const [umur, setUmur] = useState(30);
  const [telepon, setTelepon] = useState('');
  const [status, setStatus] = useState('aktif');
  const [kendaraanAktif, setKendaraanAktif] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'aktif':
        return 'success';
      case 'cuti':
        return 'warning';
      case 'nonaktif':
      default:
        return 'danger';
    }
  };

  const handleAddSupir = (e) => {
    e.preventDefault();
    const newId = `DRV-88${supirList.length + 3}`; // Biar ID unik
    const newSupir = {
      id: newId,
      nama,
      nomorSIM,
      tipeSIM,
      masaBerlakuSIM,
      umur: Number(umur),
      telepon,
      foto: null,
      pin: '1234', // default PIN
      status,
      kendaraanAktif: kendaraanAktif || null
    };

    addSupir(newSupir);
    setIsModalOpen(false);

    // Reset Form
    setNama('');
    setNomorSIM('');
    setTipeSIM('B1 Umum');
    setMasaBerlakuSIM('');
    setUmur(30);
    setTelepon('');
    setStatus('aktif');
    setKendaraanAktif('');
  };

  const filteredSupir = supirList.filter(s => {
    const matchesSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.nomorSIM.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === 'Semua') return matchesSearch;
    if (activeFilter === 'Aktif') return matchesSearch && s.status === 'aktif';
    if (activeFilter === 'Cuti') return matchesSearch && s.status === 'cuti';
    if (activeFilter === 'Nonaktif') return matchesSearch && s.status === 'nonaktif';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 select-none relative min-h-[80vh] animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-neutral-dark">Manajemen Supir</h1>
          <p className="text-neutral-mid text-sm mt-1">Kelola dan pantau data supir serta status SIM mereka</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg hover:bg-opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-card hover:shadow-card-hover btn-press self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Tambah Supir</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined text-neutral-mid absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[20px]">
            search
          </span>
          <input 
            type="text"
            placeholder="Cari Nama, ID, atau Nomor SIM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm text-neutral-dark placeholder:text-neutral-mid outline-none transition-shadow shadow-sm font-medium"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
          {['Semua', 'Aktif', 'Cuti', 'Nonaktif'].map((tab) => (
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

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSupir.map((driver) => {
          const matchedBus = kendaraanList.find(k => k.id === driver.kendaraanAktif);
          const isSimExpired = new Date(driver.masaBerlakuSIM) < new Date();
          const isSimExpiringSoon = !isSimExpired && (new Date(driver.masaBerlakuSIM) - new Date()) / (24 * 60 * 60 * 1000) < 30;

          return (
            <Card key={driver.id} className="p-5 flex flex-col justify-between hover:border-neutral-300 transition-all duration-300 shadow-sm relative overflow-hidden group hover:-translate-y-1 card-interactive bg-white/70 backdrop-blur-md">
              {driver.status === 'aktif' && (
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-status-success"></div>
              )}
              {driver.status === 'cuti' && (
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-status-warning"></div>
              )}
              {driver.status === 'nonaktif' && (
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-status-danger"></div>
              )}

              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-display text-sm font-extrabold text-neutral-dark">
                      {driver.nama}
                    </h3>
                    <p className="font-mono text-[10px] text-neutral-mid font-bold uppercase tracking-wider">{driver.id}</p>
                  </div>
                  <Badge status={getStatusColor(driver.status)} text={driver.status.toUpperCase()} />
                </div>

                <div className="space-y-3 mt-4 text-xs font-semibold text-neutral-mid border-t border-neutral-light pt-3">
                  <div className="flex items-center gap-2 text-neutral-dark">
                    <span className="material-symbols-outlined text-[16px] text-neutral-mid">phone</span>
                    <span>{driver.telepon}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-dark">
                    <span className="material-symbols-outlined text-[16px] text-neutral-mid">badge</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold">{driver.tipeSIM}</span>
                      <span className="text-neutral-mid">•</span>
                      <span className="font-mono">{driver.nomorSIM}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pl-6 text-neutral-mid">
                    <span className="text-[10px] font-bold">Masa Berlaku SIM:</span>
                    <span className={`font-bold ${isSimExpired ? 'text-status-danger' : isSimExpiringSoon ? 'text-status-warning' : 'text-neutral-dark'}`}>
                      {driver.masaBerlakuSIM} {isSimExpired && '(KADALUWARSA)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-dashed border-neutral-light flex justify-between items-center text-xs font-semibold">
                <span className="text-neutral-mid">Bus Ditugaskan:</span>
                {matchedBus ? (
                  <span className="font-mono font-extrabold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded uppercase">
                    {matchedBus.nomorPolisi}
                  </span>
                ) : (
                  <span className="text-neutral-400 font-bold italic">Tidak Ada</span>
                )}
              </div>
            </Card>
          );
        })}

        {filteredSupir.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-neutral-300 shadow-sm animate-fade-in">
            <span className="material-symbols-outlined text-[48px] text-neutral-300 mb-3">group</span>
            <p className="text-neutral-mid font-semibold">Tidak ada supir yang sesuai filter.</p>
          </div>
        )}
      </div>

      {/* Modal Tambah Supir */}
      {isModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <form 
            onSubmit={handleAddSupir} 
            className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="font-display text-base font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">badge</span>
                  Tambah Supir Baru
                </h2>
                <p className="text-[11px] text-neutral-mid font-medium mt-0.5">Daftarkan kru pengemudi bus baru ke dalam database</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all flex items-center btn-press"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh] no-scrollbar">
              {/* Group 1: Profil Supir */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-primary tracking-wider uppercase flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  Profil Pengemudi
                </h3>
                
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Muhammad Yusuf"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">No. Telepon</label>
                    <input 
                      type="tel" 
                      placeholder="Contoh: 0812345678"
                      value={telepon}
                      onChange={(e) => setTelepon(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Umur (Tahun)</label>
                    <input 
                      type="number" 
                      value={umur}
                      onChange={(e) => setUmur(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Surat Izin Mengemudi */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-primary tracking-wider uppercase flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <span className="material-symbols-outlined text-[16px]">credit_card</span>
                  Kredensial & Lisensi SIM
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Nomor SIM</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: 1234-5678-9012"
                      value={nomorSIM}
                      onChange={(e) => setNomorSIM(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Golongan SIM</label>
                    <CustomSelect 
                      value={tipeSIM}
                      onChange={(e) => setTipeSIM(e.target.value)}
                      options={[
                        { value: 'B1 Umum', label: 'B1 Umum' },
                        { value: 'B2 Umum', label: 'B2 Umum' },
                        { value: 'A', label: 'A' }
                      ]}
                      placeholder="Pilih Golongan SIM"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Masa Berlaku SIM</label>
                    <input 
                      type="date" 
                      value={masaBerlakuSIM}
                      onChange={(e) => setMasaBerlakuSIM(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold outline-none transition-all text-slate-700 font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Status Supir</label>
                    <CustomSelect 
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      options={[
                        { value: 'aktif', label: 'Aktif' },
                        { value: 'cuti', label: 'Cuti' },
                        { value: 'nonaktif', label: 'Nonaktif' }
                      ]}
                      placeholder="Pilih Status"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Bus yang Ditugaskan</label>
                  <CustomSelect 
                    value={kendaraanAktif}
                    onChange={(e) => setKendaraanAktif(e.target.value)}
                    options={[
                      { value: '', label: '-- Tidak Ada --' },
                      ...kendaraanList.map(k => ({ value: k.id, label: `${k.nomorPolisi} - ${k.merk}` }))
                    ]}
                    placeholder="Pilih Bus"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex gap-3 justify-end">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="h-11 px-5 border border-slate-200 hover:bg-slate-100 text-slate-650 font-bold text-xs uppercase tracking-wider rounded-xl active:scale-[0.98] transition-all btn-press"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="h-11 px-6 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-opacity-90 active:scale-[0.98] transition-all shadow-md hover:shadow-lg shadow-primary/20 btn-press"
              >
                Simpan Supir
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ManajemenSupir;
