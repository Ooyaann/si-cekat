import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card } from '../../components/common/Card';
import { useDialog } from '../../context/DialogContext';

const PengaturanSistem = () => {
  const { resetSimulasi } = useData();
  const { showAlert, showConfirm } = useDialog();
  const [batasLayak, setBatasLayak] = useState(() => {
    return localStorage.getItem('sicekat_setting_batas_layak') || '90';
  });
  const [namaDinas, setNamaDinas] = useState(() => {
    return localStorage.getItem('sicekat_setting_nama_dinas') || 'DINAS PERHUBUNGAN KOTA SEMARANG';
  });
  const [notifAktif, setNotifAktif] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('sicekat_setting_batas_layak', batasLayak);
    localStorage.setItem('sicekat_setting_nama_dinas', namaDinas);
    showAlert({
      title: 'Pengaturan Disimpan',
      message: 'Konfigurasi parameter sistem dan informasi instansi berhasil diperbarui.',
      type: 'success'
    });
  };

  const handleResetSimulasi = async () => {
    showConfirm({
      title: 'Reset Simulasi?',
      message: 'Apakah Anda yakin ingin mengatur ulang seluruh data simulasi? Tindakan ini akan menghapus semua penambahan supir, armada, perpanjangan dokumen, dan riwayat inspeksi baru yang telah Anda buat.',
      confirmText: 'Reset Sekarang',
      cancelText: 'Batal',
      onConfirm: async () => {
        setRefreshing(true);
        await resetSimulasi();
        setRefreshing(false);
        showAlert({
          title: 'Reset Berhasil',
          message: 'Simulasi berhasil diatur ulang ke kondisi data awal.',
          type: 'success',
          onClose: () => {
            window.location.reload();
          }
        });
      }
    });
  };

  return (
    <div className="space-y-6 select-none max-w-4xl animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-extrabold text-neutral-dark flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[28px]">settings</span>
          <span>Pengaturan Sistem</span>
        </h1>
        <p className="text-neutral-mid text-sm mt-1">Konfigurasi variabel sistem inspeksi, batas kelayakan, dan data simulasi</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Batas Kelaikan */}
        <Card className="p-5 bg-white/70 backdrop-blur-md hover:border-neutral-300 transition-all duration-300">
          <h3 className="font-display text-sm font-bold text-neutral-dark mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
            <span>Kriteria Kelayakan (Scoring)</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-neutral-mid uppercase tracking-wider mb-1.5">
                Minimal Skor Kelayakan Jalan (%)
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  min="50" 
                  max="100"
                  value={batasLayak}
                  onChange={(e) => setBatasLayak(e.target.value)}
                  className="w-24 h-10 px-3 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm font-bold text-neutral-dark outline-none transition-shadow"
                  required
                />
                <span className="text-sm font-bold text-neutral-mid">%</span>
              </div>
              <p className="text-[11px] font-semibold text-neutral-mid mt-2 leading-relaxed">
                Menentukan batas persentase minimal item teknis yang harus bernilai &quot;Sesuai&quot; agar bus mendapatkan status akhir &quot;Layak Jalan&quot;.
              </p>
            </div>

            <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
              <p className="text-xs font-semibold text-primary leading-relaxed">
                Catatan: Item Kritis (seperti Rem Utama, Ban Depan, Lampu Utama Malam, Sabuk Keselamatan, Wiper, dan Dokumen STUK/SIM) bersifat wajib. Jika salah satu dari item kritis tersebut gagal/tidak ada, status akhir otomatis dinyatakan <span className="font-bold">Tidak Layak Jalan</span> tanpa melihat total persentase skor.
              </p>
            </div>
          </div>
        </Card>

        {/* Info Dinas */}
        <Card className="p-5 bg-white/70 backdrop-blur-md hover:border-neutral-300 transition-all duration-300">
          <h3 className="font-display text-sm font-bold text-neutral-dark mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">domain</span>
            <span>Informasi Instansi & Header</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-neutral-mid uppercase tracking-wider mb-1.5">
                Nama Dinas Perhubungan / Instansi
              </label>
              <input 
                type="text" 
                value={namaDinas}
                onChange={(e) => setNamaDinas(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm font-semibold text-neutral-dark outline-none transition-shadow"
                required
              />
              <p className="text-[11px] font-semibold text-neutral-mid mt-2">
                Nama instansi ini akan dicantumkan di bagian kop surat / judul header pada hasil ekspor formulir keselamatan PDF.
              </p>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-neutral-100 mt-4">
              <div>
                <span className="text-xs font-bold text-neutral-dark block">Kirim Notifikasi Alert</span>
                <span className="text-[11px] font-semibold text-neutral-mid">Aktifkan in-app banner alert ketika ada temuan armada kritis.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifAktif} 
                  onChange={(e) => setNotifAktif(e.target.checked)} 
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-neutral-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 border-b border-neutral-200 pb-6">
          <button 
            type="submit"
            className="h-10 px-5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-opacity-95 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm btn-press"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </form>

      {/* Zona Bahaya / Reset Simulasi */}
      <Card className="p-5 border-status-danger/25 bg-white/70 backdrop-blur-md relative overflow-hidden">
        <h3 className="font-display text-sm font-bold text-status-danger mb-4 pb-2 border-b border-status-danger/10 flex items-center gap-2">
          <span className="material-symbols-outlined text-status-danger text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>gpp_bad</span>
          <span>Zona Bahaya (Data Simulasi)</span>
        </h3>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-neutral-dark block">Atur Ulang Data Simulasi</span>
            <span className="text-[11px] font-semibold text-neutral-mid leading-relaxed block mt-1 max-w-lg">
              Tindakan ini akan mengosongkan seluruh data yang tersimpan di localStorage (termasuk riwayat inspeksi, supir baru, armada baru) dan mengembalikan data bawaan (seed data).
            </span>
          </div>

          <button 
            type="button"
            onClick={handleResetSimulasi}
            disabled={refreshing}
            className="h-10 px-4 bg-status-danger text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 shadow-sm btn-press"
          >
            <span className={`material-symbols-outlined text-[16px] ${refreshing ? 'animate-spin' : ''}`}>sync</span>
            <span>Reset Simulasi</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default PengaturanSistem;
