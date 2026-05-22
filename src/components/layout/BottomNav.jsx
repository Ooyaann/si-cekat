import { NavLink } from 'react-router-dom';

export const BottomNav = () => {
  const navItems = [
    { name: 'Beranda', path: '/supir/dashboard', icon: 'home' },
    { name: 'Inspeksi', path: '/supir/inspeksi/baru', icon: 'fact_check' },
    { name: 'Riwayat', path: '/supir/riwayat', icon: 'history' },
    { name: 'Profil', path: '/supir/profil', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-light shadow-[0px_-4px_12px_rgba(30,41,59,0.05)] md:hidden safe-bottom">
      <div className="flex h-16 w-full justify-around items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 border-t-2 ${
                isActive 
                  ? 'text-primary border-primary' 
                  : 'text-neutral-mid border-transparent hover:text-neutral-dark'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span 
                  className={`material-symbols-outlined text-[22px] transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
