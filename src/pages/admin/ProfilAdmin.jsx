import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useDialog } from '../../context/DialogContext';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

const ProfilAdmin = () => {
  const { user, logout } = useAuth();
  const { supirList, kendaraanList, inspeksiList, resetSimulasi } = useData();
  const { showAlert, showConfirm } = useDialog();
  const navigate = useNavigate();

  const displayName = user?.nama || user?.name || 'Administrator';
  const displayEmail = user?.email || 'admin@sicekat.id';

  // 1. Hitung Statistik Utama
  const totalArmada = kendaraanList.length;
  const totalSupir = supirList.length;
  const totalInspeksi = inspeksiList.length;

  // Persentase kelaikan dari total inspeksi
  const layakCount = useMemo(() => {
    return inspeksiList.filter(i => i.hasil?.statusFinal === 'LAYAK' || i.hasil?.statusFinal === 'LAYAK JALAN').length;
  }, [inspeksiList]);

  const kelaikanRate = useMemo(() => {
    if (totalInspeksi === 0) return 100;
    return Math.round((layakCount / totalInspeksi) * 100);
  }, [totalInspeksi, layakCount]);

  // Helper untuk sisa hari
  const calculateDaysRemaining = (expiryDate) => {
    if (!expiryDate) return 999;
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  // 2. Daftar Dokumen Bermasalah / Hampir Kedaluwarsa (< 30 hari atau habis)
  const armadaBermasalah = useMemo(() => {
    const list = [];
    kendaraanList.forEach(k => {
      const sisaSTUK = calculateDaysRemaining(k.dokumen?.stuk?.berlakuSampai);
      const sisaKP = calculateDaysRemaining(k.dokumen?.kpReguler?.berlakuSampai);

      if (sisaSTUK <= 30) {
        list.push({
          id: `${k.id}-kir`,
          nopol: k.nomorPolisi,
          po: k.namaPO,
          tipe: 'KIR/STUK',
          sisaHari: sisaSTUK,
          expired: sisaSTUK <= 0
        });
      }
      if (sisaKP <= 30) {
        list.push({
          id: `${k.id}-kp`,
          nopol: k.nomorPolisi,
          po: k.namaPO,
          tipe: 'KP Reguler',
          sisaHari: sisaKP,
          expired: sisaKP <= 0
        });
      }
    });
    return list;
  }, [kendaraanList]);

  const supirBermasalah = useMemo(() => {
    const list = [];
    supirList.forEach(s => {
      const sisaSIM = calculateDaysRemaining(s.masaBerlakuSIM);
      if (sisaSIM <= 30) {
        list.push({
          id: `${s.id}-sim`,
          nama: s.nama,
          tipe: `SIM ${s.tipeSIM || 'B1 Umum'}`,
          sisaHari: sisaSIM,
          expired: sisaSIM <= 0
        });
      }
    });
    return list;
  }, [supirList]);

  // Action Handlers
  const handleEditProfil = () => {
    showAlert({
      title: 'Perbarui Profil',
      message: 'Fitur pengeditan profil instansi/admin akan tersedia di versi berikutnya.',
      type: 'info'
    });
  };

  const handleResetData = () => {
    showConfirm({
      title: 'Reset Simulasi?',
      message: 'Tindakan ini akan mengembalikan semua data armada, supir, inspeksi, dan notifikasi ke kondisi awal bawaan. Apakah Anda yakin?',
      confirmText: 'Reset Sekarang',
      cancelText: 'Batal',
      onConfirm: async () => {
        await resetSimulasi();
        showAlert({
          title: 'Reset Berhasil',
          message: 'Seluruh data simulasi telah dikembalikan ke kondisi default.',
          type: 'success'
        });
      }
    });
  };

  const handleLogout = () => {
    showConfirm({
      title: 'Keluar Akun?',
      message: 'Apakah Anda yakin ingin keluar dari panel Administrator SI-CEKAT?',
      confirmText: 'Keluar',
      cancelText: 'Batal',
      onConfirm: () => {
        logout();
      }
    });
  };

  return (
    <div className="space-y-6 pb-10 select-none animate-fade-in">
      {/* Header Profil */}
      <section className="bg-white/80 backdrop-blur-md border border-neutral-light rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
            <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              admin_panel_settings
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-status-success h-4.5 w-4.5 rounded-full border-2 border-white shadow-sm" />
        </div>
        
        <div className="flex-grow text-center md:text-left space-y-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
            Administrator
          </span>
          <h2 className="text-2xl font-display font-extrabold text-neutral-dark mt-1">{displayName}</h2>
          <p className="text-sm font-medium text-neutral-mid">{displayEmail}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button 
            onClick={handleEditProfil}
            className="flex-1 bg-white border border-neutral-light text-neutral-dark px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-neutral-light transition-all duration-200 flex items-center justify-center gap-2 btn-press"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            <span>Edit Profil</span>
          </button>
          <button 
            onClick={handleResetData}
            className="flex-1 bg-status-warning/10 border border-status-warning/30 text-status-warning-hover px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-status-warning/20 transition-all duration-200 flex items-center justify-center gap-2 btn-press"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Reset Data</span>
          </button>
        </div>
      </section>

      {/* Bento Grid Statistik */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Armada */}
        <div className="bg-white/80 backdrop-blur-md border border-neutral-light p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="flex justify-between items-center mb-2">
            <span className="material-symbols-outlined text-primary text-[28px] group-hover:scale-110 transition-transform duration-300" style={{ fontVariationSettings: "'FILL' 1" }}>
              directions_bus
            </span>
            <span className="text-[10px] font-extrabold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase">Armada</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-neutral-dark font-mono leading-none tracking-tight">{totalArmada}</p>
            <p className="text-neutral-mid text-[10px] font-bold uppercase mt-1 tracking-wider">Terdaftar</p>
          </div>
        </div>

        {/* Card 2: Supir */}
        <div className="bg-white/80 backdrop-blur-md border border-neutral-light p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="flex justify-between items-center mb-2">
            <span className="material-symbols-outlined text-purple-600 text-[28px] group-hover:scale-110 transition-transform duration-300" style={{ fontVariationSettings: "'FILL' 1" }}>
              badge
            </span>
            <span className="text-[10px] font-extrabold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 uppercase">Supir</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-neutral-dark font-mono leading-none tracking-tight">{totalSupir}</p>
            <p className="text-neutral-mid text-[10px] font-bold uppercase mt-1 tracking-wider">Aktif</p>
          </div>
        </div>

        {/* Card 3: Laporan */}
        <div className="bg-white/80 backdrop-blur-md border border-neutral-light p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="flex justify-between items-center mb-2">
            <span className="material-symbols-outlined text-emerald-600 text-[28px] group-hover:scale-110 transition-transform duration-300" style={{ fontVariationSettings: "'FILL' 1" }}>
              fact_check
            </span>
            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">Laporan</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-neutral-dark font-mono leading-none tracking-tight">{totalInspeksi}</p>
            <p className="text-neutral-mid text-[10px] font-bold uppercase mt-1 tracking-wider">Ramp Check</p>
          </div>
        </div>

        {/* Card 4: Kelaikan */}
        <div className="bg-white/80 backdrop-blur-md border border-neutral-light p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="flex justify-between items-center mb-2">
            <span className="material-symbols-outlined text-blue-600 text-[28px] group-hover:scale-110 transition-transform duration-300" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">Kelaikan</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-neutral-dark font-mono leading-none tracking-tight">{kelaikanRate}%</p>
            <p className="text-neutral-mid text-[10px] font-bold uppercase mt-1 tracking-wider">Status Layak</p>
          </div>
        </div>
      </section>

      {/* Dokumen & SIM Kedaluwarsa Monitor */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Armada dengan Berkas Segera Habis */}
        <div className="bg-white/80 backdrop-blur-md border border-neutral-light rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-light pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-status-warning text-[22px]">feed</span>
              <h3 className="font-display font-bold text-neutral-dark text-sm">Peringatan Dokumen Armada</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-neutral-light text-neutral-mid">
              {armadaBermasalah.length} Berkas
            </span>
          </div>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {armadaBermasalah.map(item => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-light/50 border border-neutral-light/70 hover:border-neutral-light transition-all duration-150"
              >
                <div>
                  <p className="text-xs font-bold text-neutral-dark font-mono uppercase leading-tight">{item.nopol}</p>
                  <p className="text-[10px] text-neutral-mid font-semibold mt-0.5 leading-none">{item.po} &bull; {item.tipe}</p>
                </div>
                <div className="text-right">
                  {item.expired ? (
                    <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-status-danger/10 text-status-danger border border-status-danger/20">
                      Kedaluwarsa
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-status-warning/10 text-status-warning-hover border border-status-warning/20">
                      {item.sisaHari} Hari Lagi
                    </span>
                  )}
                </div>
              </div>
            ))}

            {armadaBermasalah.length === 0 && (
              <div className="text-center py-10 text-xs font-medium text-neutral-mid flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-status-success text-[28px]">verified_user</span>
                <span>Semua dokumen armada aman dan teratur.</span>
              </div>
            )}
          </div>
        </div>

        {/* Supir dengan SIM Segera Habis */}
        <div className="bg-white/80 backdrop-blur-md border border-neutral-light rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-light pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-status-warning text-[22px]">badge</span>
              <h3 className="font-display font-bold text-neutral-dark text-sm">Peringatan SIM Supir</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-neutral-light text-neutral-mid">
              {supirBermasalah.length} Supir
            </span>
          </div>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {supirBermasalah.map(item => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-light/50 border border-neutral-light/70 hover:border-neutral-light transition-all duration-150"
              >
                <div>
                  <p className="text-xs font-bold text-neutral-dark leading-tight">{item.nama}</p>
                  <p className="text-[10px] text-neutral-mid font-semibold mt-0.5 leading-none">{item.tipe}</p>
                </div>
                <div className="text-right">
                  {item.expired ? (
                    <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-status-danger/10 text-status-danger border border-status-danger/20">
                      Kedaluwarsa
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-status-warning/10 text-status-warning-hover border border-status-warning/20">
                      {item.sisaHari} Hari Lagi
                    </span>
                  )}
                </div>
              </div>
            ))}

            {supirBermasalah.length === 0 && (
              <div className="text-center py-10 text-xs font-medium text-neutral-mid flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-status-success text-[28px]">verified_user</span>
                <span>Seluruh SIM driver aktif dan berlaku.</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Logout Action Card */}
      <section className="bg-white/80 backdrop-blur-md border border-neutral-light rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-neutral-dark text-sm">Keluar dari Panel Admin</h3>
          <p className="text-xs text-neutral-mid mt-0.5">Selesaikan sesi administrasi Anda di perangkat ini secara aman.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full sm:w-auto px-6 py-3 border border-status-danger/30 text-status-danger rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-status-danger/5 transition-all duration-200 flex items-center justify-center gap-2 btn-press"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Keluar Aplikasi</span>
        </button>
      </section>
    </div>
  );
};

export default ProfilAdmin;
