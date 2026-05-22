import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';

const RiwayatInspeksi = () => {
  const { user } = useAuth();
  const { inspeksiList, getKendaraanById } = useData();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const isAdmin = user?.role === 'admin';
  const myInspeksi = isAdmin ? inspeksiList : inspeksiList.filter(i => i.supirId === user.id);

  const filtered = myInspeksi.filter(i => {
    const k = getKendaraanById(i.kendaraanId);
    const nopol = k?.nomorPolisi || '';
    const matchSearch = nopol.toLowerCase().includes(search.toLowerCase()) || 
                        i.nomorRampCheck.toLowerCase().includes(search.toLowerCase());
    
    let matchFilter = true;
    if (filter !== 'ALL') {
      if (filter === 'LAYAK') {
        matchFilter = i.hasil?.statusFinal === 'LAYAK' || i.hasil?.statusFinal === 'LAYAK JALAN';
      } else {
        matchFilter = i.hasil?.statusFinal === filter;
      }
    }
    return matchSearch && matchFilter;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'LAYAK':
      case 'LAYAK JALAN':
        return { bar: 'bg-status-success', badge: 'bg-status-success/10 text-status-success border-status-success/20', label: 'LAYAK JALAN' };
      case 'PERINGATAN':
        return { bar: 'bg-status-warning', badge: 'bg-status-warning/10 text-status-warning border-status-warning/20', label: 'PERINGATAN' };
      default:
        return { bar: 'bg-status-danger', badge: 'bg-status-danger/10 text-status-danger border-status-danger/20', label: 'TIDAK LAYAK' };
    }
  };

  const detailPath = isAdmin ? '/admin/inspeksi/' : '/supir/inspeksi/';

  return (
    <div className="space-y-5 select-none">
      {/* Header */}
      <div className="flex flex-col space-y-1 animate-fade-in-up">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-neutral-dark">
          {isAdmin ? 'Daftar Semua Inspeksi' : 'Riwayat Inspeksi'}
        </h1>
        <p className="text-sm font-medium text-neutral-mid">
          {isAdmin ? 'Pantau seluruh catatan ramp check armada' : 'Catatan inspeksi yang pernah Anda lakukan'}
        </p>
      </div>
      
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up animation-delay-100">
        <div className="relative flex-1">
          <span className="absolute left-3 top-2.5 material-symbols-outlined text-[20px] text-neutral-mid">search</span>
          <input 
            type="text" 
            placeholder="Cari plat nomor atau No. Ramp Check..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-white ghost-border focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-neutral-dark outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 'LAYAK', label: 'Layak' },
            { id: 'PERINGATAN', label: 'Peringatan' },
            { id: 'TIDAK_LAYAK', label: 'Tidak Layak' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 h-10 text-xs font-semibold rounded-lg uppercase tracking-wider transition-all border whitespace-nowrap btn-press
                ${filter === f.id 
                  ? 'bg-primary text-white border-primary shadow-sm' 
                  : 'bg-white text-neutral-mid border-neutral-light hover:text-neutral-dark hover:border-neutral-mid/30'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs font-medium text-neutral-mid animate-fade-in-up animation-delay-150">
        Menampilkan {filtered.length} dari {myInspeksi.length} data
      </p>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((inspeksi, idx) => {
          const k = getKendaraanById(inspeksi.kendaraanId);
          const sc = getStatusConfig(inspeksi.hasil?.statusFinal);
          return (
            <div 
              key={inspeksi.id} 
              onClick={() => navigate(`${detailPath}${inspeksi.id}`)}
              className={`bg-white rounded-xl ghost-border p-4 flex items-center justify-between cursor-pointer group shadow-card card-interactive animate-fade-in-up ${idx < 5 ? `animation-delay-${(idx + 1) * 75}` : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-10 ${sc.bar} rounded-full shrink-0`} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-neutral-dark uppercase tracking-tight">
                      {k?.nomorPolisi || '-'}
                    </span>
                    <span className="text-[9px] font-semibold text-neutral-mid bg-neutral-light px-1.5 py-0.5 rounded">
                      {k?.jenisAngkutan || 'Bus'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-mid mt-0.5">
                    <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                    <span>{inspeksi.tanggal}</span>
                    <span>&bull;</span>
                    <span className="font-mono truncate">{inspeksi.nomorRampCheck}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-neutral-dark">{inspeksi.hasil?.skorPersen || 0}%</div>
                </div>
                <span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded border uppercase ${sc.badge}`}>
                  {sc.label}
                </span>
                <span className="material-symbols-outlined text-neutral-mid group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 text-[18px]">
                  chevron_right
                </span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-14 bg-white rounded-xl border border-dashed border-neutral-mid/20 shadow-card animate-fade-in-up">
            <span className="material-symbols-outlined text-neutral-mid/40 text-[40px] mb-2">search_off</span>
            <p className="text-sm font-medium text-neutral-mid">Tidak ada data inspeksi ditemukan</p>
            <p className="text-xs text-neutral-mid/60 mt-1">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiwayatInspeksi;
