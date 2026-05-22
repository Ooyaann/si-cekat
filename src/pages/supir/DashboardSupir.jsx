import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';

const DashboardSupir = () => {
  const { user } = useAuth();
  const { kendaraanList, inspeksiList } = useData();
  const navigate = useNavigate();

  const activeKendaraan = kendaraanList.find(k => k.id === user.kendaraanAktif);
  
  const today = new Date().toISOString().split('T')[0];
  const myInspeksi = inspeksiList.filter(i => i.supirId === user.id);
  const inspeksiHariIni = myInspeksi.find(i => i.tanggal === today);

  // Calculate SIM expiry
  const calculateDaysRemaining = (expiryDate) => {
    if (!expiryDate) return 0;
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };
  const simDaysLeft = calculateDaysRemaining(user?.masaBerlakuSIM);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'LAYAK':
      case 'LAYAK JALAN':
        return { bar: 'bg-status-success', badge: 'bg-status-success/10 text-status-success border-status-success/20', label: 'LAYAK JALAN', icon: 'check_circle' };
      case 'PERINGATAN':
        return { bar: 'bg-status-warning', badge: 'bg-status-warning/10 text-status-warning border-status-warning/20', label: 'PERINGATAN', icon: 'warning' };
      default:
        return { bar: 'bg-status-danger', badge: 'bg-status-danger/10 text-status-danger border-status-danger/20', label: 'TIDAK LAYAK', icon: 'cancel' };
    }
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Selamat Pagi';
    if (hr < 15) return 'Selamat Siang';
    if (hr < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  return (
    <div className="space-y-6 select-none">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-750 to-primary text-white rounded-2xl p-6 shadow-md border border-primary/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-fade-in-up">
        {/* Floating background decorative details */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        <div className="absolute top-[-50%] right-[-10%] w-72 h-72 rounded-full bg-white/5 filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-50%] left-[30%] w-60 h-60 rounded-full bg-blue-500/10 filter blur-2xl pointer-events-none" />

        <div className="relative z-10 flex-grow space-y-3 text-left">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-extrabold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              SI-CEKAT Driver
            </span>
            <h1 className="font-display text-xl md:text-3xl font-extrabold tracking-tight mt-2">
              {getGreeting()}, {user?.nama || 'Pengguna'}!
            </h1>
            <p className="text-xs md:text-sm font-medium text-white/80 mt-1.5 max-w-xl leading-relaxed">
              Utamakan selalu keselamatan berkendara. Lakukan inspeksi keselamatan kelaikan jalan (Ramp Check) secara berkala sebelum bertugas.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-2 pt-1">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] font-bold backdrop-blur-sm shadow-inner text-white">
              <span className="material-symbols-outlined text-[14px]">badge</span>
              <span>SIM Aktif: {simDaysLeft} Hari</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] font-bold backdrop-blur-sm shadow-inner text-white">
              <span className="material-symbols-outlined text-[14px]">directions_bus</span>
              <span>Bus: {activeKendaraan ? activeKendaraan.nomorPolisi : 'Belum Ditugaskan'}</span>
            </span>
          </div>
        </div>

        <div className="hidden md:flex w-20 h-20 rounded-2xl bg-white/10 border border-white/20 items-center justify-center text-white/90 shadow-lg relative z-10 animate-float-slow shrink-0">
          <span className="material-symbols-outlined text-[44px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            directions_bus
          </span>
        </div>
      </div>

      {/* Hero Section: Status & CTA */}
      <section className="glass-card rounded-xl ghost-border p-5 sm:p-6 shadow-card relative overflow-hidden card-interactive glow-card animate-fade-in-up animation-delay-100">
        <div className={`absolute top-0 left-0 w-1.5 h-full ${inspeksiHariIni ? getStatusConfig(inspeksiHariIni.hasil?.statusFinal).bar : 'bg-status-warning'}`} />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div className="pl-2">
            <h2 className="text-[11px] font-semibold text-neutral-mid mb-2 uppercase tracking-wider">Status Hari Ini</h2>
            
            {inspeksiHariIni ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-status-success/10 flex items-center justify-center text-status-success border border-status-success/20">
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
                <div>
                  <span className="font-display text-lg font-bold text-neutral-dark block leading-tight">
                    Sudah Inspeksi
                  </span>
                  <span className={`inline-block text-[10px] font-bold tracking-wider px-2 py-0.5 rounded border mt-1 uppercase ${getStatusConfig(inspeksiHariIni.hasil?.statusFinal).badge}`}>
                    {getStatusConfig(inspeksiHariIni.hasil?.statusFinal).label}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-status-warning/10 border border-status-warning/20">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-warning/20 opacity-75" />
                  <span className="material-symbols-outlined text-status-warning text-[22px] relative" style={{ fontVariationSettings: "'FILL' 1" }}>
                    warning
                  </span>
                </div>
                <span className="font-display text-lg font-bold text-neutral-dark">
                  Belum Inspeksi
                </span>
              </div>
            )}
            
            <p className="text-sm text-neutral-mid mt-3 font-medium leading-relaxed">
              {inspeksiHariIni 
                ? 'Terima kasih telah melakukan inspeksi keselamatan sebelum keberangkatan.' 
                : 'Selesaikan inspeksi keselamatan pra-perjalanan untuk mulai bertugas.'}
            </p>
          </div>

          {!inspeksiHariIni ? (
            <button 
              onClick={() => navigate('/supir/inspeksi/baru')}
              className="bg-status-warning text-neutral-dark font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl flex items-center justify-center gap-2 w-full md:w-auto shadow-sm btn-press hover:bg-amber-500 hover:shadow-md transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
              <span>Mulai Inspeksi Baru</span>
            </button>
          ) : (
            <button 
              onClick={() => navigate(`/supir/inspeksi/${inspeksiHariIni.id}`)}
              className="bg-primary text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl flex items-center justify-center gap-2 w-full md:w-auto shadow-sm btn-press hover:bg-primary/95 hover:shadow-md transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              <span>Lihat Detail Hasil</span>
            </button>
          )}
        </div>
      </section>

      {/* Bento Grid: Info Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Assigned Bus Card */}
        <div className="bg-white rounded-xl ghost-border p-5 flex flex-col justify-between shadow-card card-interactive glow-card animate-fade-in-up animation-delay-150">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                directions_bus
              </span>
            </div>
            <span className="bg-neutral-light text-neutral-mid font-semibold text-[9px] uppercase tracking-wider px-2 py-1 rounded">
              Armada Aktif
            </span>
          </div>
          <div>
            <h3 className="font-mono text-lg font-bold text-neutral-dark mb-0.5 tracking-tight uppercase">
              {activeKendaraan ? activeKendaraan.nomorPolisi : 'Belum Ditugaskan'}
            </h3>
            <p className="text-xs font-semibold text-neutral-mid">
              {activeKendaraan ? `${activeKendaraan.merk}` : '-'}
            </p>
          </div>
        </div>

        {/* Route Card */}
        <div className="bg-white rounded-xl ghost-border p-5 flex flex-col justify-between shadow-card card-interactive glow-card animate-fade-in-up animation-delay-200">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                near_me
              </span>
            </div>
            <span className="bg-neutral-light text-neutral-mid font-semibold text-[9px] uppercase tracking-wider px-2 py-1 rounded">
              Rute Trayek
            </span>
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-neutral-dark mb-0.5">
              {activeKendaraan?.trayek || 'Belum Ditetapkan'}
            </h3>
            <p className="text-xs font-semibold text-neutral-mid">
              {activeKendaraan?.jenisAngkutan || '-'}
            </p>
          </div>
        </div>

        {/* SIM Expiry Card */}
        <div className={`bg-white rounded-xl ghost-border p-5 flex flex-col justify-between shadow-card card-interactive glow-card animate-fade-in-up animation-delay-300 ${simDaysLeft < 30 ? 'border-status-warning/30 bg-status-warning/5' : ''}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${simDaysLeft < 30 ? 'bg-status-warning/10 text-status-warning border-status-warning/20 animate-pulse' : 'bg-primary/5 text-primary border-primary/10'}`}>
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                badge
              </span>
            </div>
            <span className={`font-semibold text-[9px] uppercase tracking-wider px-2 py-1 rounded ${simDaysLeft < 30 ? 'bg-status-warning/10 text-status-warning font-bold' : 'bg-neutral-light text-neutral-mid'}`}>
              {simDaysLeft < 30 ? 'Segera Habis' : 'SIM Aktif'}
            </span>
          </div>
          <div>
            <h3 className={`font-mono text-lg font-bold mb-0.5 ${simDaysLeft < 30 ? 'text-status-warning' : 'text-neutral-dark'}`}>
              {simDaysLeft} Hari
            </h3>
            <p className="text-xs font-semibold text-neutral-mid">
              Sisa Masa Berlaku SIM
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="flex flex-col gap-3 animate-fade-in-up animation-delay-400">
        <div className="flex justify-between items-end mb-1">
          <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-neutral-mid">Riwayat Inspeksi Terakhir</h2>
          <button 
            onClick={() => navigate('/supir/riwayat')}
            className="text-xs font-bold text-primary hover:underline transition-all flex items-center gap-0.5 group btn-press"
          >
            <span>Lihat Semua</span>
            <span className="material-symbols-outlined text-[14px] transition-transform duration-200 group-hover:translate-x-1">arrow_right_alt</span>
          </button>
        </div>

        <div className="space-y-2">
          {myInspeksi.slice(0, 3).map((inspeksi, idx) => {
            const sc = getStatusConfig(inspeksi.hasil?.statusFinal);
            const kendaraan = kendaraanList.find(k => k.id === inspeksi.kendaraanId);
            const delays = ['animation-delay-100', 'animation-delay-150', 'animation-delay-200'];
            return (
              <div 
                key={inspeksi.id}
                onClick={() => navigate(`/supir/inspeksi/${inspeksi.id}`)}
                className={`bg-white rounded-xl ghost-border p-4 flex items-center justify-between cursor-pointer group shadow-card card-interactive glow-card animate-fade-in-up ${delays[idx] || ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-10 ${sc.bar} rounded-full`} />
                  <div>
                    <p className="font-mono text-sm font-bold text-neutral-dark uppercase tracking-tight">
                      {kendaraan?.nomorPolisi || inspeksi.kendaraanId}
                    </p>
                    <p className="text-xs font-medium text-neutral-mid">
                      {inspeksi.tanggal} &bull; {inspeksi.nomorRampCheck}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded border uppercase ${sc.badge}`}>
                    {sc.label}
                  </span>
                  <span className="material-symbols-outlined text-neutral-mid group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 text-[18px]">
                    chevron_right
                  </span>
                </div>
              </div>
            );
          })}

          {myInspeksi.length === 0 && (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-neutral-mid/20 shadow-card glow-card">
              <span className="material-symbols-outlined text-neutral-mid/40 text-[40px] mb-2">
                assignment_late
              </span>
              <p className="text-sm font-semibold text-neutral-mid">Belum ada riwayat inspeksi</p>
              <p className="text-xs text-neutral-mid/60 mt-1">Mulai inspeksi pertama Anda hari ini</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardSupir;
