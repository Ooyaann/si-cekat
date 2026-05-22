import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { generatePDF } from '../../utils/pdfGenerator';

const DetailInspeksi = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { inspeksiList, getKendaraanById, getSupirById } = useData();

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('');
  const [downloadError, setDownloadError] = useState(null);

  const inspeksi = inspeksiList.find(i => i.id === id);

  if (!inspeksi) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center select-none animate-fade-in-up">
        <span className="material-symbols-outlined text-[48px] text-neutral-mid/40 mb-3">search_off</span>
        <p className="text-neutral-mid mb-4 font-medium">Data inspeksi tidak ditemukan.</p>
        <button 
          onClick={() => navigate(-1)} 
          className="px-5 py-2.5 bg-primary text-white font-semibold text-sm rounded-lg btn-press shadow-sm"
        >
          Kembali
        </button>
      </div>
    );
  }

  const kendaraan = getKendaraanById(inspeksi.kendaraanId);
  const supir = getSupirById(inspeksi.supirId);
  const hasil = inspeksi.hasil || {};

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setDownloadStatus('Menyiapkan berkas...');
    setDownloadError(null);
    try {
      await generatePDF(inspeksi, supir, kendaraan, (status) => {
        if (status && status.startsWith('ERROR:')) {
          setDownloadError(status.replace('ERROR:', '').trim());
        } else {
          setDownloadStatus(status || 'Memproses...');
        }
      });
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadStatus('');
      }, 600);
    } catch (err) {
      setDownloadError(err.message || 'Terjadi kesalahan saat memproses PDF.');
    }
  };

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

  const sc = getStatusConfig(hasil.statusFinal);

  return (
    <div className="space-y-5 pb-8 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-1.5 rounded-lg hover:bg-neutral-light text-neutral-mid hover:text-neutral-dark transition-colors btn-press"
            aria-label="Kembali"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-display font-bold text-neutral-dark">Hasil Inspeksi</h1>
            <p className="font-mono text-xs text-neutral-mid uppercase tracking-tight">{inspeksi.nomorRampCheck}</p>
          </div>
        </div>
        <button 
          onClick={handleDownloadPDF} 
          disabled={isDownloading}
          className="h-10 px-4 bg-status-warning text-neutral-dark font-semibold text-xs uppercase tracking-wider rounded-lg shadow-sm btn-press hover:shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span className="hidden sm:inline">Unduh PDF</span>
        </button>
      </div>

      {/* Status Summary */}
      <section className="bg-white rounded-xl ghost-border p-5 sm:p-6 shadow-card relative overflow-hidden animate-fade-in-up animation-delay-100">
        <div className={`absolute top-0 left-0 w-1.5 h-full ${sc.bar}`} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-2">
          <div className="space-y-1.5">
            <h2 className="text-[11px] font-semibold text-neutral-mid uppercase tracking-wider">Status Kelayakan Jalan</h2>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold tracking-wider px-3 py-1 rounded border uppercase ${sc.badge}`}>
                {sc.label}
              </span>
              <span className="font-display text-2xl font-black text-neutral-dark">{hasil.skorPersen || 0}%</span>
            </div>
            <p className="text-xs font-medium text-neutral-mid pt-1">
              Sanksi: <span className="text-neutral-dark capitalize font-semibold">{hasil.sanksi?.toLowerCase().replace(/_/g, ' ') || '-'}</span>
            </p>
          </div>
          <div className="flex items-start gap-2.5 bg-neutral-light/50 border border-neutral-light rounded-lg px-4 py-3 sm:max-w-xs">
            <span className="material-symbols-outlined text-[18px] text-primary mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            <p className="text-[11px] font-medium text-neutral-mid leading-relaxed">
              Persentase dihitung berdasarkan jumlah temuan item kritis dan minor di seluruh seksi pemeriksaan.
            </p>
          </div>
        </div>
      </section>

      {/* Grid: Kendaraan & Pelaksanaan */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Info Kendaraan */}
        <div className="bg-white rounded-xl ghost-border p-5 shadow-card card-interactive animate-fade-in-up animation-delay-200">
          <h3 className="font-display text-sm font-bold text-neutral-dark mb-4 pb-2 border-b border-neutral-light flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>directions_bus</span>
            Detail Kendaraan
          </h3>
          <div className="space-y-3 text-sm">
            {[
              ['Nomor Polisi', kendaraan?.nomorPolisi, true],
              ['Merk & Tipe', kendaraan?.merk],
              ['Nama PO', kendaraan?.namaPO || 'PO. Dishub Trans'],
              ['Nomor KP', kendaraan?.dokumen?.kpReguler?.nomor || '-'],
              ['Jenis Angkutan', kendaraan?.jenisAngkutan],
            ].map(([label, value, isMono]) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-xs font-medium text-neutral-mid">{label}</span>
                <span className={`font-semibold text-neutral-dark ${isMono ? 'font-mono bg-neutral-light px-2 py-0.5 rounded uppercase' : ''}`}>
                  {value || '-'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Pelaksanaan */}
        <div className="bg-white rounded-xl ghost-border p-5 shadow-card card-interactive animate-fade-in-up animation-delay-300">
          <h3 className="font-display text-sm font-bold text-neutral-dark mb-4 pb-2 border-b border-neutral-light flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
            Pelaksanaan Cek
          </h3>
          <div className="space-y-3 text-sm">
            {[
              ['Tanggal', inspeksi.tanggal],
              ['Pengemudi', supir?.nama || '-'],
              ['Lokasi', inspeksi.lokasi?.nama || '-'],
              ['Waktu', inspeksi.waktuMulai && inspeksi.waktuSubmit ? `${new Date(inspeksi.waktuMulai).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} - ${new Date(inspeksi.waktuSubmit).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}` : '-'],
              ['Durasi', inspeksi.durasiDetik ? `${Math.floor(inspeksi.durasiDetik / 60)} mnt ${inspeksi.durasiDetik % 60} dtk` : '-'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-xs font-medium text-neutral-mid">{label}</span>
                <span className="font-semibold text-neutral-dark">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Temuan Masalah */}
      {hasil.itemBermasalah?.length > 0 ? (
        <section className="bg-white rounded-xl border border-status-danger/15 p-5 shadow-card animate-fade-in-up animation-delay-400">
          <h3 className="font-display text-sm font-bold text-status-danger mb-4 pb-2 border-b border-status-danger/10 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            Temuan Masalah ({hasil.itemBermasalah.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hasil.itemBermasalah.map((item, idx) => {
              const getPhotoForItem = (item) => {
                if (item.seksi === 'I') return inspeksi.seksiI?.[item.kode || item.id]?.foto;
                if (item.seksi === 'II') return inspeksi.seksiII?.[item.kode || item.id]?.foto;
                if (item.seksi === 'III') return inspeksi.seksiIII?.[item.kode || item.id]?.foto;
                return null;
              };
              const foto = getPhotoForItem(item);
              return (
                <div key={idx} className="flex gap-3 p-3 bg-status-danger/5 border border-status-danger/10 rounded-lg text-xs">
                  {foto && (
                    <div 
                      className="w-14 h-14 rounded-lg border border-status-danger/25 overflow-hidden shrink-0 bg-neutral-100 cursor-pointer hover:opacity-90 transition-opacity" 
                      onClick={() => {
                        const newTab = window.open();
                        newTab.document.write(`<img src="${foto}" style="max-width:100%; max-height:100vh; display:block; margin:auto;" />`);
                        newTab.document.title = `Bukti Kerusakan - ${item.label}`;
                      }}
                    >
                      <img src={foto} alt={item.label} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[9px] text-neutral-mid font-semibold uppercase tracking-wide">{item.kode || item.id}</span>
                      <span className="px-1.5 py-0.2 bg-status-danger/10 text-status-danger rounded text-[8px] font-bold uppercase tracking-wide">
                        Seksi {item.seksi}
                      </span>
                    </div>
                    <p className="font-semibold text-neutral-dark text-xs mt-1 leading-tight">{item.label}</p>
                    <p className="text-[10px] text-status-danger font-medium mt-0.5">Bermasalah</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="bg-white rounded-xl border border-status-success/15 p-5 shadow-card text-center animate-fade-in-up animation-delay-400">
          <div className="py-4">
            <span className="material-symbols-outlined text-status-success text-[40px] mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <h3 className="font-display text-sm font-bold text-neutral-dark">Semua Komponen Layak Jalan</h3>
            <p className="text-xs text-neutral-mid mt-1 font-medium max-w-sm mx-auto">
              Hasil ramp check menunjukkan semua komponen berada dalam kondisi baik.
            </p>
          </div>
        </section>
      )}

      {/* Catatan & TTD */}
      <section className="bg-white rounded-xl ghost-border p-5 shadow-card animate-fade-in-up animation-delay-500">
        <h3 className="font-display text-sm font-bold text-neutral-dark mb-4 pb-2 border-b border-neutral-light flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_turned_in</span>
          Catatan & Pengesahan
        </h3>
        <div className="space-y-4">
          <div>
            <span className="text-xs font-semibold text-neutral-mid block mb-1.5">Catatan Tambahan</span>
            <p className="text-xs font-medium text-neutral-dark bg-neutral-light/50 p-3.5 rounded-lg border border-neutral-light min-h-[50px] leading-relaxed">
              {inspeksi.catatan || 'Tidak ada catatan tambahan.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-4">
            <div>
              <span className="text-xs font-semibold text-neutral-mid block mb-1">Pernyataan Pengemudi</span>
              <p className="text-xs font-medium text-neutral-dark leading-relaxed">
                Tanda tangan menyatakan keabsahan pemeriksaan.
              </p>
            </div>
            <div className="bg-white border border-neutral-light rounded-lg p-2.5 flex flex-col items-center justify-center w-full sm:w-auto max-w-[180px] shrink-0 shadow-sm">
              <span className="text-[9px] font-bold text-neutral-mid mb-1.5 uppercase tracking-wider">{supir?.nama || '-'}</span>
              {inspeksi.tandaTangan ? (
                <img src={inspeksi.tandaTangan} alt="Tanda Tangan" className="h-12 object-contain" />
              ) : (
                <div className="h-12 flex items-center justify-center text-xs text-neutral-mid/40 font-medium italic">
                  Tidak ada
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal Progress Overlay */}
      {isDownloading && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-dark/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-neutral-light flex flex-col items-center text-center animate-scale-in">
            {downloadError ? (
              <>
                <span className="material-symbols-outlined text-[44px] text-status-danger mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                <h3 className="font-display text-base font-bold text-neutral-dark mb-2">Gagal Mengunduh PDF</h3>
                <p className="text-xs font-medium text-neutral-mid mb-5 leading-relaxed max-w-xs">{downloadError}</p>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => { setIsDownloading(false); setDownloadError(null); }}
                    className="flex-1 py-2.5 bg-neutral-light hover:bg-neutral-light/80 text-neutral-dark font-bold text-xs uppercase tracking-wider rounded-lg transition-all btn-press"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => { setDownloadError(null); handleDownloadPDF(); }}
                    className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all btn-press"
                  >
                    Coba Lagi
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="relative flex items-center justify-center mb-4">
                  <div className="w-14 h-14 border-[3px] border-primary/15 border-t-primary rounded-full animate-spin" />
                  <span className="material-symbols-outlined text-primary text-[20px] absolute" style={{ fontVariationSettings: "'FILL' 1" }}>
                    directions_bus
                  </span>
                </div>
                <h3 className="font-display text-sm font-bold text-neutral-dark mb-1">Memproses Dokumen</h3>
                <p className="text-xs font-medium text-neutral-mid min-h-[18px]">{downloadStatus}</p>
                <div className="w-full bg-neutral-light h-1.5 rounded-full overflow-hidden mt-4">
                  <div className="h-full w-full animate-shimmer" />
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default DetailInspeksi;
