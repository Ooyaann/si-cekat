import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SplashScreen = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (user) {
          if (user.role === 'admin') navigate('/admin/dashboard');
          else navigate('/supir/dashboard');
        } else {
          navigate('/login');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, user, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary text-white relative overflow-hidden select-none">
      {/* Decorative gradient rings */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>

      <div className="flex flex-col items-center z-10">
        <div className="mb-6 rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center animate-pulse">
          <span 
            className="material-symbols-outlined text-[48px] text-white"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            directions_bus
          </span>
        </div>
        
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-white mb-2">SI-CEKAT</h1>
        <div className="h-[2px] w-12 bg-white/30 rounded mb-3"></div>
        <p className="text-white/80 font-medium text-sm tracking-wide text-center max-w-[280px]">
          Sistem Cek Armada Terpadu
        </p>
      </div>

      {/* Modern thin line spinner */}
      <div className="absolute bottom-24 flex items-center space-x-2.5">
        <span className="material-symbols-outlined text-[18px] animate-spin text-white/60">
          sync
        </span>
        <span className="text-xs font-medium tracking-wider text-white/60 uppercase">Memuat Sistem...</span>
      </div>

      <div className="absolute bottom-8 text-[11px] font-medium tracking-widest text-white/40 uppercase">
        DISHUB &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default SplashScreen;

