import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useDialog } from '../../context/DialogContext';

export const Navbar = ({ showMenuBtn = false, onMenuClick, variant = 'supir' }) => {
  const { user, logout } = useAuth();
  const { 
    notifications, 
    unreadNotifCount, 
    markNotifAsRead, 
    markAllNotifsAsRead, 
    clearNotifications 
  } = useData();
  const { showNotificationsModal, showAlert } = useDialog();
  const navigate = useNavigate();

  const displayName = user?.nama || user?.name || 'Pengguna';
  const displayRole = user?.role === 'admin' ? 'Administrator' : 'Supir';

  const supirNavLinks = [
    { name: 'Beranda', path: '/supir/dashboard', icon: 'home' },
    { name: 'Inspeksi Baru', path: '/supir/inspeksi/baru', icon: 'fact_check' },
    { name: 'Riwayat', path: '/supir/riwayat', icon: 'history' },
    { name: 'Profil', path: '/supir/profil', icon: 'person' },
  ];

  const handleNotifClick = () => {
    // Filter notifications based on role
    const filtered = variant === 'admin' 
      ? notifications 
      : notifications.filter(n => n.supirId === user?.id || n.id.startsWith('notif-sim'));

    if (filtered.length > 0) {
      showNotificationsModal({
        notifications: filtered,
        onMarkAsRead: markNotifAsRead,
        onMarkAllAsRead: markAllNotifsAsRead,
        onClear: clearNotifications,
        userRole: variant,
        navigate,
      });
    } else {
      showAlert({
        title: 'Tidak Ada Notifikasi',
        message: 'Seluruh sistem aman. Belum ada aktivitas baru atau peringatan dokumen saat ini.',
        type: 'info'
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-light bg-white/95 backdrop-blur-md">
      <div className={`flex h-14 items-center justify-between mx-auto w-full px-4 sm:px-6 ${
        variant === 'admin' ? 'max-w-7xl lg:px-8' : 'max-w-6xl lg:px-6'
      }`}>
        {/* Left: Logo + Menu */}
        <div className="flex items-center gap-3">
          {showMenuBtn && (
            <button
              onClick={onMenuClick}
              className="rounded-md p-1.5 text-neutral-mid hover:bg-neutral-light hover:text-neutral-dark lg:hidden transition-colors flex items-center justify-center btn-press"
              aria-label="Menu"
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>
          )}
          <Link to={variant === 'admin' ? '/admin/dashboard' : '/supir/dashboard'} className="flex items-center gap-2 text-primary group cursor-pointer select-none">
            <span 
              className="material-symbols-outlined text-[20px] text-primary transition-transform duration-300 group-hover:rotate-6" 
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              directions_bus
            </span>
            <span className="font-display text-sm font-bold tracking-tight text-primary">SI-CEKAT</span>
          </Link>
        </div>

        {/* Center: Desktop Nav Links (only for Supir) */}
        {variant === 'supir' && (
          <nav className="hidden md:flex items-center gap-1.5">
            {supirNavLinks.map(link => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/5 text-primary'
                      : 'text-neutral-mid hover:text-neutral-dark hover:bg-neutral-light/60'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Right: User info */}
        <div className="flex items-center gap-2.5">
          {/* Notification Button */}
          <button 
            onClick={handleNotifClick}
            className="relative rounded-full p-1.5 text-neutral-mid hover:bg-neutral-light hover:text-neutral-dark transition-colors flex items-center justify-center btn-press"
            title="Notifikasi"
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            {unreadNotifCount > 0 && (
              <span className="absolute right-1 top-1 block h-1.5 w-1.5 rounded-full bg-status-danger ring-2 ring-white" />
            )}
          </button>
          
          {/* Clickable Profile Card */}
          <Link 
            to={variant === 'admin' ? '/admin/profil' : '/supir/profil'}
            className="hidden sm:flex items-center border-l border-neutral-light pl-2.5 gap-2 cursor-pointer group hover:bg-neutral-light/50 px-2 py-1 rounded-lg transition-all duration-200"
            title="Lihat Profil"
          >
            <div className="text-right">
              <div className="text-xs font-semibold text-neutral-dark leading-tight group-hover:text-primary transition-colors">{displayName}</div>
              <div className="text-[9px] font-medium text-neutral-mid uppercase tracking-wider">{displayRole}</div>
            </div>
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[11px] border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-200">
              {displayName.charAt(0)}
            </div>
          </Link>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-1 rounded-md hover:bg-neutral-light text-neutral-mid hover:text-status-danger transition-colors flex items-center justify-center btn-press"
            title="Keluar"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
