import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useDialog } from '../../context/DialogContext';

const PusatNotifikasi = () => {
  const { 
    notifications, 
    markNotifAsRead, 
    markAllNotifsAsRead, 
    clearNotifications 
  } = useData();
  const { showConfirm, showAlert } = useDialog();
  const [activeFilter, setActiveFilter] = useState('Semua');

  const getNotifIcon = (notif) => {
    if (notif.tipe === 'kritis') {
      if (notif.id.includes('doc') || notif.id.includes('sim')) {
        return <span className="material-symbols-outlined text-[20px] text-status-danger" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>;
      }
      return <span className="material-symbols-outlined text-[20px] text-status-danger" style={{ fontVariationSettings: "'FILL' 1" }}>gpp_bad</span>;
    }
    if (notif.tipe === 'peringatan') {
      if (notif.id.includes('dur')) {
        return <span className="material-symbols-outlined text-[20px] text-status-warning" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_ind</span>;
      }
      return <span className="material-symbols-outlined text-[20px] text-status-warning" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>;
    }
    return <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>;
  };

  const handleMarkAllAsRead = () => {
    const unreadCount = notifications.filter(n => !n.dibaca).length;
    if (unreadCount === 0) {
      showAlert({
        title: 'Informasi',
        message: 'Semua notifikasi Anda sudah ditandai sebagai dibaca.',
        type: 'info'
      });
      return;
    }
    showConfirm({
      title: 'Tandai Semua Dibaca?',
      message: `Apakah Anda yakin ingin menandai seluruh (${unreadCount}) notifikasi yang belum dibaca sebagai dibaca?`,
      confirmText: 'Ya, Tandai',
      cancelText: 'Batal',
      onConfirm: () => {
        markAllNotifsAsRead();
        showAlert({
          title: 'Berhasil',
          message: 'Seluruh notifikasi telah ditandai sebagai dibaca.',
          type: 'success'
        });
      }
    });
  };

  const handleClearNotifications = () => {
    if (notifications.length === 0) {
      showAlert({
        title: 'Informasi',
        message: 'Pusat notifikasi sudah kosong.',
        type: 'info'
      });
      return;
    }
    showConfirm({
      title: 'Bersihkan Notifikasi?',
      message: 'Apakah Anda yakin ingin membersihkan seluruh riwayat notifikasi? Tindakan ini akan menyembunyikan semua notifikasi saat ini dari dashboard dan panel.',
      confirmText: 'Bersihkan',
      cancelText: 'Batal',
      onConfirm: () => {
        clearNotifications();
        showAlert({
          title: 'Dibersihkan',
          message: 'Semua notifikasi telah berhasil dibersihkan dari sistem.',
          type: 'success'
        });
      }
    });
  };

  const filteredNotifs = notifications.filter(n => {
    if (activeFilter === 'Semua') return true;
    if (activeFilter === 'Belum Dibaca') return !n.dibaca;
    if (activeFilter === 'Kritis') return n.tipe === 'kritis';
    if (activeFilter === 'Peringatan') return n.tipe === 'peringatan';
    return true;
  });

  return (
    <div className="space-y-6 select-none animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-neutral-dark flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[28px]">notifications</span>
            <span>Pusat Notifikasi</span>
          </h1>
          <p className="text-neutral-mid text-sm mt-1">Tinjau seluruh peringatan sistem, dokumen kedaluwarsa, dan status kritis</p>
        </div>
        
        <div className="flex gap-2 self-start sm:self-auto">
          <button 
            onClick={handleMarkAllAsRead}
            className="px-3.5 py-2.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-mid hover:text-neutral-dark font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all btn-press shadow-sm"
          >
            Tandai Semua Dibaca
          </button>
          <button 
            onClick={handleClearNotifications}
            className="px-3.5 py-2.5 bg-white border border-status-danger/20 hover:bg-status-danger/5 text-status-danger font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 btn-press shadow-sm"
          >
            <span className="material-symbols-outlined text-[14px]">delete</span>
            <span>Bersihkan</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar border-b border-neutral-200">
        {['Semua', 'Belum Dibaca', 'Kritis', 'Peringatan'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`pb-3 px-2 font-bold text-xs uppercase tracking-wider transition-all border-b-2 shrink-0
              ${activeFilter === tab 
                ? 'border-primary text-primary font-extrabold' 
                : 'border-transparent text-neutral-mid hover:text-neutral-dark'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifs.map((notif) => (
          <div 
            key={notif.id} 
            className={`p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 shadow-sm relative overflow-hidden
              ${notif.dibaca 
                ? 'bg-white/60 border-neutral-200' 
                : 'bg-primary/5 border-primary/20 shadow-md'}`}
          >
            {!notif.dibaca && (
              <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-primary"></div>
            )}
            
            <div className="p-2 bg-white rounded-lg border border-neutral-200 shrink-0 shadow-sm flex items-center justify-center">
              {getNotifIcon(notif)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start gap-4">
                <h3 className={`text-sm font-extrabold leading-snug ${notif.dibaca ? 'text-neutral-dark/80' : 'text-neutral-dark'}`}>
                  {notif.judul}
                </h3>
                <span className="text-[10px] font-bold text-neutral-mid shrink-0">
                  {new Date(notif.waktu).toLocaleDateString('id-ID')} {new Date(notif.waktu).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <p className="text-xs font-semibold text-neutral-mid leading-relaxed">
                {notif.pesan}
              </p>
              
              {!notif.dibaca && (
                <div className="pt-2 flex justify-end">
                  <button 
                    onClick={() => markNotifAsRead(notif.id)}
                    className="px-2.5 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-[9px] font-bold text-primary uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1 transition-all duration-200 btn-press"
                  >
                    <span className="material-symbols-outlined text-[12px] text-status-success font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span>Tandai Dibaca</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredNotifs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-neutral-300 shadow-sm animate-fade-in">
            <span className="material-symbols-outlined text-[48px] text-neutral-300 mb-3">notifications</span>
            <p className="text-neutral-mid font-semibold">Tidak ada notifikasi baru.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PusatNotifikasi;
