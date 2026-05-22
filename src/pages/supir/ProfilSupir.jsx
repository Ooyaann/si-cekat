import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '../../context/DialogContext';

const ProfilSupir = () => {
  const { user, logout } = useAuth();
  const { inspeksiList, getKendaraanById } = useData();
  const { showAlert } = useDialog();
  const navigate = useNavigate();

  const myInspeksi = inspeksiList.filter(i => i.supirId === user.id);
  const totalInspeksi = myInspeksi.length;
  
  const totalDuration = myInspeksi.reduce((acc, curr) => acc + (curr.durasiDetik || 0), 0);
  const avgDurationMin = totalInspeksi > 0
    ? Math.round((totalDuration / totalInspeksi) / 60 * 10) / 10
    : 0;

  const layakCount = myInspeksi.filter(i => i.hasil?.statusFinal === 'LAYAK' || i.hasil?.statusFinal === 'LAYAK JALAN').length;
  const complianceRate = totalInspeksi > 0
    ? Math.round((layakCount / totalInspeksi) * 100)
    : 100;

  const calculateDaysRemaining = (expiryDate) => {
    if (!expiryDate) return 0;
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };
  const daysLeft = calculateDaysRemaining(user?.masaBerlakuSIM);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'LAYAK':
      case 'LAYAK JALAN':
        return 'bg-status-success/10 text-status-success border-status-success/20';
      case 'PERINGATAN':
        return 'bg-status-warning/10 text-status-warning border-status-warning/20';
      default:
        return 'bg-status-danger/10 text-status-danger border-status-danger/20';
    }
  };

  return (
    <div className="space-y-5 pb-8 select-none">
      {/* Profile Header */}
      <section className="flex flex-col items-center text-center mt-2 animate-fade-in-up">
        <div className="relative w-20 h-20 mb-3">
          <div className="w-full h-full rounded-xl overflow-hidden border-2 border-primary/20 shadow-sm bg-neutral-light flex items-center justify-center">
            {user?.foto ? (
              <img src={user.foto} alt={user.nama} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-[40px] text-neutral-mid/50" style={{ fontVariationSettings: "'FILL' 1" }}>
                person
              </span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-status-success h-4 w-4 rounded-full border-2 border-white" />
        </div>
        <h2 className="text-xl font-display font-bold text-neutral-dark">{user?.nama || 'Supir'}</h2>
        <p className="font-mono text-xs text-neutral-mid mb-4">{user?.id || '-'}</p>
        
        <button 
          onClick={() => showAlert({
            title: 'Perbarui Profil',
            message: 'Fitur pengeditan profil driver akan tersedia di versi berikutnya.',
            type: 'info'
          })}
          className="bg-primary text-white w-full py-3 rounded-lg font-semibold text-xs uppercase tracking-wider btn-press flex items-center justify-center gap-2 max-w-xs shadow-sm"
        >
          <span>Perbarui Profil</span>
          <span className="material-symbols-outlined text-[16px]">edit</span>
        </button>
      </section>

      {/* SIM License Card */}
      <section className="bg-white ghost-border rounded-xl p-4 shadow-card card-interactive animate-fade-in-up animation-delay-100">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 text-neutral-dark">
            <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span>
            <span className="text-xs font-bold uppercase tracking-wider">SIM {user?.tipeSIM || 'B1 Umum'}</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide border ${daysLeft < 30 ? 'bg-status-warning/10 text-status-warning border-status-warning/20' : 'bg-status-success/10 text-status-success border-status-success/20'}`}>
            {daysLeft < 30 ? 'SEGERA HABIS' : 'AKTIF'}
          </span>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-lg font-bold text-neutral-dark font-mono leading-none">
              {user?.masaBerlakuSIM ? user.masaBerlakuSIM.split('-').reverse().join(' • ') : '-'}
            </p>
            <p className="text-[10px] text-neutral-mid mt-1 uppercase tracking-wider font-semibold">Tanggal Kedaluwarsa</p>
          </div>
          <div className="text-right">
            <p className={`text-base font-bold font-mono leading-none ${daysLeft < 30 ? 'text-status-warning' : 'text-status-success'}`}>
              {daysLeft} Hari
            </p>
            <p className="text-[10px] text-neutral-mid mt-1 uppercase tracking-wider font-semibold">Sisa Berlaku</p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="animate-fade-in-up animation-delay-200">
        <h3 className="text-xs font-bold text-neutral-mid mb-3 uppercase tracking-wider">Statistik Kepatuhan</h3>
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-primary p-4 rounded-xl flex flex-col justify-between h-28 shadow-sm card-interactive">
            <span className="material-symbols-outlined text-white/80 text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>fact_check</span>
            <div>
              <p className="text-white text-2xl font-bold font-mono leading-none">{totalInspeksi}</p>
              <p className="text-white/60 text-[9px] font-bold uppercase mt-1 tracking-wider">Total Inspeksi</p>
            </div>
          </div>
          <div className="grid grid-rows-2 gap-3">
            <div className="bg-white ghost-border rounded-xl p-3 flex justify-between items-center shadow-sm card-interactive">
              <div>
                <p className="text-primary font-bold font-mono leading-none">{avgDurationMin}m</p>
                <p className="text-neutral-mid text-[8px] font-bold uppercase mt-0.5 tracking-wider">Rata-Rata Waktu</p>
              </div>
              <span className="material-symbols-outlined text-neutral-mid text-[18px]">timer</span>
            </div>
            <div className="bg-white ghost-border rounded-xl p-3 flex justify-between items-center shadow-sm card-interactive">
              <div>
                <p className="text-status-success font-bold font-mono leading-none">{complianceRate}%</p>
                <p className="text-neutral-mid text-[8px] font-bold uppercase mt-0.5 tracking-wider">Kelaikan Armada</p>
              </div>
              <span className="material-symbols-outlined text-status-success text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
          </div>
        </section>
      </div>

      {/* Recent Inspections */}
      <div className="space-y-3 animate-fade-in-up animation-delay-300">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-neutral-mid uppercase tracking-wider">Riwayat Terakhir</h3>
          <button onClick={() => navigate('/supir/riwayat')} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wide btn-press">
            Lihat Semua
          </button>
        </div>
        
        <section className="space-y-2">
          {myInspeksi.slice(0, 3).map((inspeksi) => {
            const k = getKendaraanById(inspeksi.kendaraanId);
            const statusLabel = inspeksi.hasil?.statusFinal === 'LAYAK' ? 'LAYAK JALAN' : (inspeksi.hasil?.statusFinal === 'PERINGATAN' ? 'PERINGATAN' : 'TIDAK LAYAK');
            return (
              <div 
                key={inspeksi.id}
                onClick={() => navigate(`/supir/inspeksi/${inspeksi.id}`)}
                className="bg-white ghost-border rounded-xl p-3.5 flex items-center gap-3 cursor-pointer shadow-sm group card-interactive"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>directions_bus</span>
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-mono font-bold text-sm text-neutral-dark uppercase tracking-tight">{k?.nomorPolisi || '-'}</h4>
                  <p className="text-xs font-medium text-neutral-mid truncate">{inspeksi.tanggal} &bull; {inspeksi.nomorRampCheck}</p>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase border shrink-0 ${getStatusBadge(inspeksi.hasil?.statusFinal)}`}>
                  {statusLabel}
                </span>
              </div>
            );
          })}

          {myInspeksi.length === 0 && (
            <div className="text-center py-6 bg-white rounded-xl border border-dashed border-neutral-mid/20 text-xs font-medium text-neutral-mid">
              Belum ada riwayat inspeksi
            </div>
          )}
        </section>
      </div>

      {/* Logout Button */}
      <button 
        onClick={logout}
        className="w-full border border-status-danger/30 text-status-danger py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-status-danger/5 btn-press flex items-center justify-center gap-2 shadow-sm animate-fade-in-up animation-delay-400"
      >
        <span>Keluar Aplikasi</span>
        <span className="material-symbols-outlined text-[18px]">logout</span>
      </button>
    </div>
  );
};

export default ProfilSupir;
