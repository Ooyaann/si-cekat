import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { SupirLayout } from './components/layout/SupirLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public
import SplashScreen from './pages/public/SplashScreen';
import LoginPage from './pages/public/LoginPage';

import DashboardSupir from './pages/supir/DashboardSupir';
import InspeksiBaru from './pages/supir/InspeksiBaru';
import DetailInspeksi from './pages/supir/DetailInspeksi';
import ProfilSupir from './pages/supir/ProfilSupir';
import RiwayatInspeksi from './pages/supir/RiwayatInspeksi';

// Admin Pages
import DashboardAdmin from './pages/admin/DashboardAdmin';
import ManajemenArmada from './pages/admin/ManajemenArmada';
import ManajemenSupir from './pages/admin/ManajemenSupir';
import PelacakDokumen from './pages/admin/PelacakDokumen';
import LaporanBerkala from './pages/admin/LaporanBerkala';
import PusatNotifikasi from './pages/admin/PusatNotifikasi';
import LogPerbaikan from './pages/admin/LogPerbaikan';
import PengaturanSistem from './pages/admin/PengaturanSistem';
import ProfilAdmin from './pages/admin/ProfilAdmin';

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 font-body text-neutral-900">
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Supir Routes */}
        <Route element={<ProtectedRoute allowedRole="supir" />}>
          <Route element={<SupirLayout />}>
            <Route path="/supir/dashboard" element={<DashboardSupir />} />
            <Route path="/supir/inspeksi/baru" element={<InspeksiBaru />} />
            <Route path="/supir/inspeksi/:id" element={<DetailInspeksi />} />
            <Route path="/supir/riwayat" element={<RiwayatInspeksi />} />
            <Route path="/supir/profil" element={<ProfilSupir />} />
          </Route>
        </Route>
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />
            <Route path="/admin/inspeksi" element={<RiwayatInspeksi />} />
            <Route path="/admin/inspeksi/:id" element={<DetailInspeksi />} />
            <Route path="/admin/armada" element={<ManajemenArmada />} />
            <Route path="/admin/supir" element={<ManajemenSupir />} />
            <Route path="/admin/dokumen" element={<PelacakDokumen />} />
            <Route path="/admin/laporan" element={<LaporanBerkala />} />
            <Route path="/admin/notifikasi" element={<PusatNotifikasi />} />
            <Route path="/admin/perbaikan" element={<LogPerbaikan />} />
            <Route path="/admin/pengaturan" element={<PengaturanSistem />} />
            <Route path="/admin/profil" element={<ProfilAdmin />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
