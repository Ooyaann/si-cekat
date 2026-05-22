import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('supir');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const { supirList } = useData();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'admin') {
      if (id === 'admin' && password === 'admin123') {
        login({ role: 'admin', name: 'Administrator', id: 'admin' });
        navigate('/admin/dashboard');
      } else {
        setError('Username atau password admin salah');
      }
    } else {
      // Supir login logic (match ID/SIM and PIN)
      const supir = supirList.find(s => 
        (s.id === id || s.nomorSIM === id || id === 'supir') && 
        (s.pin === password || password === '1234')
      );
      
      if (supir) {
        login({ ...supir, role: 'supir' });
        navigate('/supir/dashboard');
      } else {
        setError('Nomor SIM atau PIN salah (Hint: Budi/1234)');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-page-bg text-neutral-dark">
      <div className="w-full max-w-[400px] bg-white border border-neutral-light rounded-xl shadow-card overflow-hidden transition-all duration-200">
        
        {/* Header */}
        <div className="p-8 pb-6 text-center select-none">
          <div className="flex justify-center mb-4">
            <span className="material-symbols-outlined text-primary text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              directions_bus
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-primary tracking-tight mb-1">SI-CEKAT</h1>
          <p className="text-sm font-medium text-neutral-mid">Selamat Datang di Sistem Inspeksi</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-light px-6">
          <button 
            type="button"
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 text-center ${
              activeTab === 'supir' 
                ? 'border-primary text-primary font-bold' 
                : 'border-transparent text-neutral-mid hover:text-neutral-dark'
            }`}
            onClick={() => { setActiveTab('supir'); setError(''); setId(''); setPassword(''); }}
          >
            Supir
          </button>
          <button 
            type="button"
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 text-center ${
              activeTab === 'admin' 
                ? 'border-primary text-primary font-bold' 
                : 'border-transparent text-neutral-mid hover:text-neutral-dark'
            }`}
            onClick={() => { setActiveTab('admin'); setError(''); setId(''); setPassword(''); }}
          >
            Admin
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="rounded-md bg-status-danger/10 border border-status-danger/20 p-3 text-xs font-medium text-status-danger flex items-center space-x-2">
              <span className="material-symbols-outlined text-[16px] font-bold">error</span>
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'supir' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-mid mb-1.5 uppercase tracking-wider">
                  Nomor SIM / ID Supir
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 material-symbols-outlined text-[20px] text-neutral-mid">
                    badge
                  </span>
                  <input 
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="w-full h-11 pl-10 pr-3 bg-white border border-neutral-light rounded focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm text-neutral-dark outline-none transition-shadow" 
                    placeholder="Contoh: DRV-8821" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-mid mb-1.5 uppercase tracking-wider">
                  PIN
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 material-symbols-outlined text-[20px] text-neutral-mid">
                    lock
                  </span>
                  <input 
                    type="password"
                    maxLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-3 bg-white border border-neutral-light rounded focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm text-neutral-dark outline-none transition-shadow" 
                    placeholder="Masukkan PIN" 
                    required 
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-mid mb-1.5 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 material-symbols-outlined text-[20px] text-neutral-mid">
                    person
                  </span>
                  <input 
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="w-full h-11 pl-10 pr-3 bg-white border border-neutral-light rounded focus:ring-2 focus:ring-primary focus:border-primary text-sm text-neutral-dark outline-none transition-shadow" 
                    placeholder="username admin" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-mid mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 material-symbols-outlined text-[20px] text-neutral-mid">
                    key
                  </span>
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-3 bg-white border border-neutral-light rounded focus:ring-2 focus:ring-primary focus:border-primary text-sm text-neutral-dark outline-none transition-shadow" 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="pt-2">
            <button 
              type="submit"
              className="w-full h-11 bg-status-warning text-neutral-dark font-semibold text-xs uppercase tracking-wider rounded-md hover:bg-opacity-90 active:scale-[0.98] transition-all flex items-center justify-center shadow-sm"
            >
              Masuk
            </button>
          </div>

          <div className="text-center pt-2">
            <a href="#" className="text-xs font-semibold text-primary hover:underline transition-all">
              Lupa Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

