import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { CustomSelect } from '../../components/common/CustomSelect';

const ManajemenArmada = () => {
  const { kendaraanList, addKendaraan, inspeksiList } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [nomorPolisi, setNomorPolisi] = useState('');
  const [nomorSTUK, setNomorSTUK] = useState('');
  const [namaPO, setNamaPO] = useState('');
  const [merk, setMerk] = useState('');
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [kapasitas, setKapasitas] = useState(40);
  const [jenisAngkutan, setJenisAngkutan] = useState('AKAP');
  const [trayek, setTrayek] = useState('');
  const [lokasi, setLokasi] = useState('Pool Jakarta Utama');

  // Menentukan status kelaikan kendaraan dari hasil inspeksi terakhir
  const getKelaikanStatus = (kendaraanId) => {
    const inspeksiKendaraan = inspeksiList
      .filter(i => i.kendaraanId === kendaraanId)
      .sort((a, b) => new Date(b.waktuSubmit) - new Date(a.waktuSubmit));

    if (inspeksiKendaraan.length === 0) return 'BELUM';
    return inspeksiKendaraan[0].hasil.statusFinal; // LAYAK, PERINGATAN, atau TIDAK_LAYAK
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'LAYAK':
        return 'success';
      case 'PERINGATAN':
        return 'warning';
      case 'TIDAK_LAYAK':
        return 'danger';
      case 'BELUM':
      default:
        return 'neutral';
    }
  };

  const handleAddKendaraan = (e) => {
    e.preventDefault();
    const newId = `KND-00${kendaraanList.length + 1}`;
    const newKendaraan = {
      id: newId,
      nomorPolisi,
      nomorSTUK,
      namaPO,
      merk,
      tahun: Number(tahun),
      kapasitas: Number(kapasitas),
      jenisAngkutan,
      trayek,
      status: 'aktif',
      lokasi,
      dokumen: {
        stuk: { nomor: nomorSTUK, berlakuSampai: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        kpReguler: { nomor: `KP-00${kendaraanList.length + 1}`, berlakuSampai: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        asuransi: { nomor: `INS-00${kendaraanList.length + 1}`, berlakuSampai: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
      }
    };

    addKendaraan(newKendaraan);
    setIsModalOpen(false);

    // Reset Form
    setNomorPolisi('');
    setNomorSTUK('');
    setNamaPO('');
    setMerk('');
    setTahun(new Date().getFullYear());
    setKapasitas(40);
    setJenisAngkutan('AKAP');
    setTrayek('');
  };

  const filteredKendaraan = kendaraanList.filter(k => {
    const matchesSearch = k.nomorPolisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          k.namaPO.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          k.merk.toLowerCase().includes(searchTerm.toLowerCase());
    
    const status = getKelaikanStatus(k.id);

    if (activeFilter === 'Semua') return matchesSearch;
    if (activeFilter === 'Layak') return matchesSearch && status === 'LAYAK';
    if (activeFilter === 'Peringatan') return matchesSearch && status === 'PERINGATAN';
    if (activeFilter === 'Tidak Layak') return matchesSearch && status === 'TIDAK_LAYAK';
    if (activeFilter === 'Belum Inspeksi') return matchesSearch && status === 'BELUM';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 select-none relative min-h-[80vh] animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-neutral-dark">Manajemen Armada</h1>
          <p className="text-neutral-mid text-sm mt-1">Kelola dan pantau status kelayakan seluruh bus</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg hover:bg-opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-card hover:shadow-card-hover btn-press self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Tambah Bus</span>
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
            placeholder="Cari Plat Nomor, PO, atau Merk Bus..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm text-neutral-dark placeholder:text-neutral-mid outline-none transition-shadow shadow-sm font-medium"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
          {['Semua', 'Layak', 'Peringatan', 'Tidak Layak', 'Belum Inspeksi'].map((tab) => (
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
        {filteredKendaraan.map((bus) => {
          const status = getKelaikanStatus(bus.id);
          const badgeType = getStatusColor(status);
          const displayStatus = status === 'BELUM' ? 'Belum Inspeksi' : status.replace('_', ' ');

          return (
            <Card key={bus.id} className="p-5 flex flex-col justify-between hover:border-neutral-300 transition-all duration-300 shadow-sm relative overflow-hidden group hover:-translate-y-1 card-interactive bg-white/70 backdrop-blur-md">
              {status === 'TIDAK_LAYAK' && (
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-status-danger"></div>
              )}
              {status === 'PERINGATAN' && (
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-status-warning"></div>
              )}
              {status === 'LAYAK' && (
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-status-success"></div>
              )}
              {status === 'BELUM' && (
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-neutral-400"></div>
              )}

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-mono text-lg font-extrabold text-neutral-dark tracking-tight uppercase">
                      {bus.nomorPolisi}
                    </h3>
                    <p className="text-xs font-bold text-neutral-mid mt-0.5">{bus.namaPO}</p>
                  </div>
                  <Badge status={badgeType} text={displayStatus} />
                </div>

                <div className="space-y-2 text-xs font-semibold text-neutral-mid border-t border-neutral-light pt-3 mt-4">
                  <div className="flex justify-between items-center">
                    <span>Merk & Seri:</span>
                    <span className="text-neutral-dark font-bold">{bus.merk}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Trayek:</span>
                    <span className="text-neutral-dark font-bold">{bus.trayek}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Jenis Angkutan:</span>
                    <span className="text-neutral-dark font-bold">{bus.jenisAngkutan}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Kapasitas:</span>
                    <span className="text-neutral-dark font-bold">{bus.kapasitas} Kursi</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredKendaraan.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-neutral-300 shadow-sm animate-fade-in">
            <span className="material-symbols-outlined text-[48px] text-neutral-300 mb-3">directions_bus</span>
            <p className="text-neutral-mid font-semibold">Tidak ada armada yang sesuai filter.</p>
          </div>
        )}
      </div>

      {/* Modal Tambah Kendaraan */}
      {isModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <form 
            onSubmit={handleAddKendaraan} 
            className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="font-display text-base font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">directions_bus</span>
                  Tambah Kendaraan Baru
                </h2>
                <p className="text-[11px] text-neutral-mid font-medium mt-0.5">Daftarkan bus baru ke dalam sistem monitoring kelaikan</p>
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
              {/* Group 1: Identifikasi Kendaraan */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-primary tracking-wider uppercase flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <span className="material-symbols-outlined text-[16px]">badge</span>
                  Identifikasi Kendaraan
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">No. Polisi (Plat)</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: B 1234 ABC"
                      value={nomorPolisi}
                      onChange={(e) => setNomorPolisi(e.target.value.toUpperCase())}
                      className="w-full h-11 px-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">No. KIR / STUK</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: KIR-JKT-12345"
                      value={nomorSTUK}
                      onChange={(e) => setNomorSTUK(e.target.value.toUpperCase())}
                      className="w-full h-11 px-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Nama PO (Perusahaan Otobus)</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: PO. Sinar Jaya"
                    value={namaPO}
                    onChange={(e) => setNamaPO(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Group 2: Spesifikasi Armada */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-primary tracking-wider uppercase flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <span className="material-symbols-outlined text-[16px]">build</span>
                  Spesifikasi & Rute
                </h3>
                
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Merk & Tipe Bus</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Hino RK8 / Mercedes OH 1626"
                    value={merk}
                    onChange={(e) => setMerk(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Tahun Pembuatan</label>
                    <input 
                      type="number" 
                      value={tahun}
                      onChange={(e) => setTahun(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Kapasitas Kursi</label>
                    <input 
                      type="number" 
                      value={kapasitas}
                      onChange={(e) => setKapasitas(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Jenis Angkutan</label>
                    <CustomSelect 
                      value={jenisAngkutan}
                      onChange={(e) => setJenisAngkutan(e.target.value)}
                      options={[
                        { value: 'AKAP', label: 'AKAP (Antar Kota)' },
                        { value: 'AKDP', label: 'AKDP (Dalam Provinsi)' },
                        { value: 'Pariwisata', label: 'Pariwisata' }
                      ]}
                      placeholder="Pilih Jenis Angkutan"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Lokasi Penempatan</label>
                    <CustomSelect 
                      value={lokasi}
                      onChange={(e) => setLokasi(e.target.value)}
                      options={[
                        { value: 'Pool Jakarta Utama', label: 'Pool Jakarta Utama' },
                        { value: 'Pool Bandung Timur', label: 'Pool Bandung Timur' },
                        { value: 'Terminal Merak', label: 'Terminal Merak' }
                      ]}
                      placeholder="Pilih Lokasi"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Trayek Operasional</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Jakarta - Yogyakarta"
                    value={trayek}
                    onChange={(e) => setTrayek(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
                    required
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
                Simpan Armada
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ManajemenArmada;
