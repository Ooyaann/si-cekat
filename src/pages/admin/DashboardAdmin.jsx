import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardAdmin = () => {
  const { inspeksiList, kendaraanList, supirList } = useData();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  
  // KPI Stats
  const inspeksiHariIni = inspeksiList.filter(i => i.tanggal === today);
  const layak = inspeksiHariIni.filter(i => i.hasil?.statusFinal === 'LAYAK').length;
  const tidakLayak = inspeksiHariIni.filter(i => i.hasil?.statusFinal === 'TIDAK_LAYAK').length;
  const peringatan = inspeksiHariIni.filter(i => i.hasil?.statusFinal === 'PERINGATAN').length;
  
  const totalKendaraan = kendaraanList.length;
  const totalSupir = supirList.length;
  const belumInspeksi = Math.max(0, totalKendaraan - inspeksiHariIni.length);

  // Chart Data (last 7 days)
  const chartData = Array.from({length: 7}).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const insps = inspeksiList.filter(ins => ins.tanggal === dateStr);
    return {
      name: `${d.getDate()}/${d.getMonth()+1}`,
      Layak: insps.filter(ins => ins.hasil?.statusFinal === 'LAYAK').length,
      Peringatan: insps.filter(ins => ins.hasil?.statusFinal === 'PERINGATAN').length,
      TidakLayak: insps.filter(ins => ins.hasil?.statusFinal === 'TIDAK_LAYAK').length,
    };
  });

  const kpiCards = [
    { 
      label: 'Total Inspeksi', 
      value: inspeksiHariIni.length, 
      icon: 'fact_check', 
      color: 'bg-primary/5 text-primary border-primary/10',
      glowClass: 'hover:shadow-[0_12px_30px_rgba(37,99,235,0.12)] hover:border-primary/30'
    },
    { 
      label: 'Layak Jalan', 
      value: layak, 
      icon: 'check_circle', 
      color: 'bg-status-success/5 text-status-success border-status-success/10',
      glowClass: 'hover:shadow-[0_12px_30px_rgba(22,163,74,0.12)] hover:border-status-success/30'
    },
    { 
      label: 'Peringatan', 
      value: peringatan, 
      icon: 'warning', 
      color: 'bg-status-warning/5 text-status-warning border-status-warning/10',
      glowClass: 'hover:shadow-[0_12px_30px_rgba(217,119,6,0.12)] hover:border-status-warning/30'
    },
    { 
      label: 'Tidak Layak', 
      value: tidakLayak, 
      icon: 'cancel', 
      color: 'bg-status-danger/5 text-status-danger border-status-danger/10',
      glowClass: 'hover:shadow-[0_12px_30px_rgba(220,38,38,0.12)] hover:border-status-danger/30'
    },
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-dark">Dashboard Utama</h1>
          <p className="text-sm text-neutral-mid font-medium mt-0.5">Ringkasan inspeksi harian — {today}</p>
        </div>
        <button 
          onClick={() => navigate('/admin/laporan')}
          className="flex items-center text-sm bg-white ghost-border px-4 py-2.5 rounded-lg font-medium text-neutral-dark shadow-card btn-press hover:shadow-card-hover transition-all gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Unduh Laporan
        </button>
      </div>

      {/* Greeting Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-lg animate-fade-in-up">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none animate-pulse-glow"></div>
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            Sistem Aktif
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">
            Selamat Datang Kembali, Admin! 👋
          </h2>
          <p className="text-blue-100 text-sm md:text-base mt-2 font-medium leading-relaxed">
            Pantau keselamatan armada bus secara real-time. Anda memiliki wewenang penuh untuk mengelola supir, armada, dan meninjau laporan ramp check.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>Kredensial Terverifikasi</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>Pembalikan Real-time</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiCards.map((kpi, idx) => (
          <div 
            key={kpi.label}
            className={`bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-card transition-all duration-300 ease-out hover:-translate-y-0.5 ${kpi.glowClass} animate-fade-in-up animation-delay-${(idx + 1) * 100}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${kpi.color}`}>
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {kpi.icon}
                </span>
              </div>
            </div>
            <p className="text-2xl font-bold text-neutral-dark font-mono">{kpi.value}</p>
            <p className="text-xs font-medium text-neutral-mid mt-0.5 uppercase tracking-wider">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl ghost-border shadow-card p-5 animate-fade-in-up animation-delay-300">
          <h3 className="font-display font-semibold text-neutral-dark mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
            Tren Kelaikan (7 Hari Terakhir)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: '1px solid #F1F5F9', boxShadow: '0 4px 12px rgba(30,41,59,0.08)', fontSize: 13}}
                />
                <Line type="monotone" dataKey="Layak" stroke="#16a34a" strokeWidth={2.5} dot={{r: 3, strokeWidth: 2}} activeDot={{r: 5}} />
                <Line type="monotone" dataKey="Peringatan" stroke="#d97706" strokeWidth={2.5} dot={{r: 3, strokeWidth: 2}} activeDot={{r: 5}} />
                <Line type="monotone" dataKey="TidakLayak" stroke="#dc2626" strokeWidth={2.5} dot={{r: 3, strokeWidth: 2}} activeDot={{r: 5}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl ghost-border shadow-card p-5 flex flex-col animate-fade-in-up animation-delay-400">
          <h3 className="font-display font-semibold text-neutral-dark mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
            Ringkasan Armada
          </h3>
          
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between p-3 bg-neutral-light/50 rounded-lg border border-neutral-light">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-neutral-mid" style={{ fontVariationSettings: "'FILL' 1" }}>directions_bus</span>
                <span className="text-sm font-medium text-neutral-dark">Total Armada</span>
              </div>
              <span className="font-bold text-lg font-mono text-neutral-dark">{totalKendaraan}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-neutral-light/50 rounded-lg border border-neutral-light">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-neutral-mid" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span>
                <span className="text-sm font-medium text-neutral-dark">Supir Terdaftar</span>
              </div>
              <span className="font-bold text-lg font-mono text-neutral-dark">{totalSupir}</span>
            </div>
            
            <div className={`flex items-center justify-between p-3 rounded-lg border ${belumInspeksi > 0 ? 'bg-status-warning/5 border-status-warning/15' : 'bg-neutral-light/50 border-neutral-light'}`}>
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[20px] ${belumInspeksi > 0 ? 'text-status-warning' : 'text-neutral-mid'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  pending
                </span>
                <span className={`text-sm font-medium ${belumInspeksi > 0 ? 'text-status-warning' : 'text-neutral-dark'}`}>Belum Inspeksi</span>
              </div>
              <span className={`font-bold text-lg font-mono ${belumInspeksi > 0 ? 'text-status-warning' : 'text-neutral-dark'}`}>{belumInspeksi}</span>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/admin/armada')}
            className="w-full mt-4 py-2.5 text-sm text-primary font-semibold hover:bg-primary/5 rounded-lg transition-all border border-primary/20 btn-press"
          >
            Lihat Detail Armada
          </button>
        </div>
      </div>

      {/* Table: Armada Bermasalah */}
      <div className="bg-white rounded-xl ghost-border shadow-card p-5 animate-fade-in-up animation-delay-500">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display font-semibold text-neutral-dark flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-status-danger" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            Peringatan & Tidak Layak (Hari Ini)
          </h3>
          <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded border uppercase ${
            (tidakLayak + peringatan) > 0 
              ? 'bg-status-danger/10 text-status-danger border-status-danger/20' 
              : 'bg-status-success/10 text-status-success border-status-success/20'
          }`}>
            {tidakLayak + peringatan} Kendaraan
          </span>
        </div>
        
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-neutral-light">
                <th className="px-4 py-3 font-semibold text-xs text-neutral-mid uppercase tracking-wider">No. Polisi</th>
                <th className="px-4 py-3 font-semibold text-xs text-neutral-mid uppercase tracking-wider">Trayek</th>
                <th className="px-4 py-3 font-semibold text-xs text-neutral-mid uppercase tracking-wider">Supir</th>
                <th className="px-4 py-3 font-semibold text-xs text-neutral-mid uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 font-semibold text-xs text-neutral-mid uppercase tracking-wider">Sanksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-light/60">
              {inspeksiHariIni.filter(i => i.hasil?.statusFinal !== 'LAYAK').map(ins => {
                const k = kendaraanList.find(x => x.id === ins.kendaraanId);
                const s = supirList.find(x => x.id === ins.supirId);
                const isDanger = ins.hasil?.statusFinal === 'TIDAK_LAYAK';
                return (
                  <tr 
                    key={ins.id} 
                    className="hover:bg-neutral-light/30 cursor-pointer transition-colors"
                    onClick={() => navigate(`/admin/inspeksi/${ins.id}`)}
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-neutral-dark">{k?.nomorPolisi}</td>
                    <td className="px-4 py-3 text-neutral-mid">{k?.trayek}</td>
                    <td className="px-4 py-3 font-medium">{s?.nama}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded border uppercase ${
                        isDanger 
                          ? 'bg-status-danger/10 text-status-danger border-status-danger/20'
                          : 'bg-status-warning/10 text-status-warning border-status-warning/20'
                      }`}>
                        {ins.hasil?.statusFinal}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-mid text-xs truncate max-w-[180px]" title={ins.hasil?.sanksi?.replace(/_/g, ' ')}>
                      {ins.hasil?.sanksi?.replace(/_/g, ' ')}
                    </td>
                  </tr>
                );
              })}
              {tidakLayak + peringatan === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center">
                    <span className="material-symbols-outlined text-status-success/40 text-[36px] mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                    <p className="text-sm text-neutral-mid font-medium">Tidak ada armada bermasalah hari ini</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
