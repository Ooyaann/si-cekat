import { NavLink } from 'react-router-dom';

export const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { name: 'Inspeksi', path: '/admin/inspeksi', icon: 'fact_check' },
    { name: 'Armada', path: '/admin/armada', icon: 'directions_bus' },
    { name: 'Supir', path: '/admin/supir', icon: 'badge' },
    { name: 'Dokumen', path: '/admin/dokumen', icon: 'description' },
    { name: 'Laporan', path: '/admin/laporan', icon: 'analytics' },
    { name: 'Notifikasi', path: '/admin/notifikasi', icon: 'notifications' },
    { name: 'Perbaikan', path: '/admin/perbaikan', icon: 'build' },
    { name: 'Pengaturan', path: '/admin/pengaturan', icon: 'settings' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-neutral-dark/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block border-r border-primary/20
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-white/10 space-x-2.5 group cursor-pointer">
          <span className="material-symbols-outlined text-[26px] text-white transition-transform duration-300 group-hover:rotate-6" style={{ fontVariationSettings: "'FILL' 1" }}>
            directions_bus
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">SI-CEKAT</span>
        </div>
        
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)] no-scrollbar">
          {menuItems.map(item => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => onClose()}
              className={({ isActive }) => 
                `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors text-sm font-medium
                ${isActive 
                  ? 'bg-white/10 text-white font-semibold' 
                  : 'text-white/80 hover:bg-white/5 hover:text-white'}`
              }
            >
              {({ isActive }) => (
                <>
                  <span 
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

