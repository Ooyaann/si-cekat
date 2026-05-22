import { createContext, useContext, useState, useRef } from 'react';

const DialogContext = createContext();

export function DialogProvider({ children }) {
  // Alert/Confirm State
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success', // 'success', 'warning', 'danger', 'info'
    isConfirm: false,
    confirmText: 'OK',
    cancelText: 'Batal',
    onConfirm: null,
    onCancel: null,
  });
  
  const resolveRef = useRef(null);
  const onConfirmRef = useRef(null);
  const onCancelRef = useRef(null);

  // Notifications Modal State
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifProps, setNotifProps] = useState({
    notifications: [],
    onMarkAsRead: () => {},
    onMarkAllAsRead: () => {},
    onClear: () => {},
    userRole: 'supir',
    navigate: () => {},
  });

  const showAlert = ({ title, message, type = 'success', confirmText = 'OK', onClose }) => {
    onConfirmRef.current = onClose || null;
    onCancelRef.current = null;
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setDialogState({
        isOpen: true,
        title,
        message,
        type,
        isConfirm: false,
        confirmText,
        cancelText: 'Batal',
        onConfirm: onClose || null,
        onCancel: null,
      });
    });
  };

  const showConfirm = ({ title, message, type = 'warning', confirmText = 'Ya', cancelText = 'Batal', onConfirm, onCancel }) => {
    onConfirmRef.current = onConfirm || null;
    onCancelRef.current = onCancel || null;
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setDialogState({
        isOpen: true,
        title,
        message,
        type,
        isConfirm: true,
        confirmText,
        cancelText,
        onConfirm: onConfirm || null,
        onCancel: onCancel || null,
      });
    });
  };

  const showNotificationsModal = (props) => {
    setNotifProps(props);
    setIsNotifOpen(true);
  };

  const handleConfirm = () => {
    const callback = onConfirmRef.current;
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    if (callback) callback();
    if (resolveRef.current) resolveRef.current(true);
  };

  const handleCancel = () => {
    const callback = onCancelRef.current;
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    if (callback) callback();
    if (resolveRef.current) resolveRef.current(false);
  };

  // Icon selector based on dialog type
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-12 h-12 rounded-full bg-status-success/10 border border-status-success/20 flex items-center justify-center text-status-success mb-4">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
        );
      case 'warning':
        return (
          <div className="w-12 h-12 rounded-full bg-status-warning/10 border border-status-warning/20 flex items-center justify-center text-status-warning mb-4">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          </div>
        );
      case 'danger':
        return (
          <div className="w-12 h-12 rounded-full bg-status-danger/10 border border-status-danger/20 flex items-center justify-center text-status-danger mb-4">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>gpp_bad</span>
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
          </div>
        );
    }
  };

  const getConfirmBtnColor = (type) => {
    switch (type) {
      case 'danger':
        return 'bg-status-danger hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-status-warning hover:bg-amber-700 text-white';
      case 'success':
        return 'bg-status-success hover:bg-green-700 text-white';
      default:
        return 'bg-primary hover:bg-primary/95 text-white';
    }
  };

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm, showNotificationsModal }}>
      {children}

      {/* 1. Custom Alert/Confirm Dialog Modal */}
      {dialogState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-dark/40 backdrop-blur-sm animate-fade-in select-none">
          <div className="bg-white/95 border border-neutral-light rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-scale-in flex flex-col items-center text-center">
            {getIcon(dialogState.type)}
            
            <h3 className="font-display font-bold text-lg text-neutral-dark mb-2">
              {dialogState.title}
            </h3>
            
            <p className="text-xs font-semibold text-neutral-mid leading-relaxed mb-6">
              {dialogState.message}
            </p>

            <div className="flex gap-2.5 w-full justify-center">
              {dialogState.isConfirm && (
                <button
                  onClick={handleCancel}
                  className="h-10 flex-1 px-4 border border-neutral-200 hover:bg-neutral-50 text-[11px] font-bold uppercase tracking-wider text-neutral-mid hover:text-neutral-dark rounded-lg transition-all btn-press"
                >
                  {dialogState.cancelText}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className={`h-10 flex-1 px-5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all btn-press shadow-sm ${getConfirmBtnColor(dialogState.type)}`}
              >
                {dialogState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Custom Notifications Modal */}
      {isNotifOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-neutral-dark/40 backdrop-blur-sm animate-fade-in select-none">
          <div className="bg-white/95 border border-neutral-light rounded-2xl max-w-md w-full p-5 shadow-2xl animate-scale-in flex flex-col h-[500px]">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-neutral-light shrink-0">
              <div>
                <h3 className="font-display font-extrabold text-neutral-dark text-base flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[22px]">notifications</span>
                  <span>Notifikasi</span>
                </h3>
                {notifProps.notifications.filter(n => !n.dibaca).length > 0 && (
                  <p className="text-[10px] text-primary font-bold uppercase mt-0.5 tracking-wider">
                    {notifProps.notifications.filter(n => !n.dibaca).length} Belum Dibaca
                  </p>
                )}
              </div>
              <button 
                onClick={() => setIsNotifOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-light text-neutral-mid hover:text-neutral-dark transition-colors btn-press"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Actions Bar */}
            {notifProps.notifications.length > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-neutral-light/60 bg-neutral-light/20 px-1 shrink-0">
                <button
                  onClick={() => {
                    notifProps.onMarkAllAsRead();
                    // Keep modal open but update properties reactively
                  }}
                  className="text-[9px] font-bold text-primary hover:underline uppercase tracking-wide btn-press"
                >
                  Tandai Semua Dibaca
                </button>
                <button
                  onClick={() => {
                    notifProps.onClear();
                    setIsNotifOpen(false); // Close since empty
                  }}
                  className="text-[9px] font-bold text-status-danger hover:underline uppercase tracking-wide btn-press flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[12px]">delete</span>
                  <span>Bersihkan</span>
                </button>
              </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 no-scrollbar">
              {notifProps.notifications.map((notif) => {
                // Determine icon
                let notifIcon = <span className="material-symbols-outlined text-[18px] text-primary">info</span>;
                if (notif.tipe === 'kritis') {
                  notifIcon = <span className="material-symbols-outlined text-[18px] text-status-danger" style={{ fontVariationSettings: "'FILL' 1" }}>gpp_bad</span>;
                } else if (notif.tipe === 'peringatan') {
                  notifIcon = <span className="material-symbols-outlined text-[18px] text-status-warning" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>;
                }

                return (
                  <div 
                    key={notif.id}
                    className={`p-3 rounded-xl border transition-all duration-150 flex items-start gap-3 relative overflow-hidden ${
                      notif.dibaca 
                        ? 'bg-neutral-light/20 border-neutral-200/60 opacity-70' 
                        : 'bg-primary/5 border-primary/10 shadow-sm'
                    }`}
                  >
                    {!notif.dibaca && (
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary"></div>
                    )}
                    
                    <div className="p-1.5 bg-white rounded-lg border border-neutral-200/70 shrink-0 flex items-center justify-center">
                      {notifIcon}
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className={`text-xs font-bold leading-tight ${notif.dibaca ? 'text-neutral-dark/80' : 'text-neutral-dark'}`}>
                          {notif.judul}
                        </h4>
                        <span className="text-[9px] font-medium text-neutral-mid shrink-0">
                          {new Date(notif.waktu).toLocaleDateString([], {day: 'numeric', month:'short'})} {new Date(notif.waktu).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-neutral-mid leading-relaxed">
                        {notif.pesan}
                      </p>
                      {!notif.dibaca && (
                        <div className="pt-1.5 flex justify-end">
                          <button 
                            onClick={() => notifProps.onMarkAsRead(notif.id)}
                            className="px-2 py-1 bg-white border border-neutral-200 hover:bg-neutral-50 text-[8px] font-bold text-primary uppercase tracking-wider rounded shadow-sm flex items-center gap-0.5 transition-all btn-press"
                          >
                            <span className="material-symbols-outlined text-[10px] text-status-success font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            <span>Tandai Dibaca</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {notifProps.notifications.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  <span className="material-symbols-outlined text-[42px] text-neutral-200 mb-2">notifications_off</span>
                  <p className="text-xs font-bold text-neutral-mid">Tidak ada notifikasi baru</p>
                  <p className="text-[10px] font-semibold text-neutral-mid/70 mt-0.5 max-w-[200px]">Seluruh laporan berjalan aman dan terkendali.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-neutral-light flex gap-2 shrink-0">
              {notifProps.userRole === 'admin' && (
                <button
                  onClick={() => {
                    setIsNotifOpen(false);
                    notifProps.navigate('/admin/notifikasi');
                  }}
                  className="flex-grow h-10 border border-primary/20 hover:bg-primary/5 text-primary font-bold text-[11px] uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 btn-press shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  <span>Pusat Notifikasi</span>
                </button>
              )}
              <button
                onClick={() => setIsNotifOpen(false)}
                className={`h-10 ${notifProps.userRole === 'admin' ? 'w-24' : 'w-full'} bg-neutral-light hover:bg-neutral-light/80 text-neutral-dark font-bold text-[11px] uppercase tracking-wider rounded-lg transition-all btn-press`}
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export const useDialog = () => useContext(DialogContext);
