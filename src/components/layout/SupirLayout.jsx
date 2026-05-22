import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { PageTransition } from './PageTransition';

export const SupirLayout = () => {
  const location = useLocation();
  const isInspectionWizard = location.pathname.startsWith('/supir/inspeksi/baru');

  return (
    <div className="flex min-h-screen flex-col bg-page-bg relative overflow-hidden bg-grid-pattern">
      {/* Glowing Background Ornaments */}
      <div className="fixed top-[10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-primary/8 filter blur-[100px] pointer-events-none animate-float-slow" />
      <div className="fixed bottom-[15%] right-[-10%] w-[450px] h-[450px] rounded-full bg-indigo-500/8 filter blur-[100px] pointer-events-none animate-float-slow-reverse" />

      {/* Navbar always visible (provides desktop navigation) */}
      {!isInspectionWizard && <Navbar variant="supir" />}

      {/* Main content with proper bottom padding for mobile nav */}
      <main className={`flex-1 w-full mx-auto ${
        isInspectionWizard 
          ? 'max-w-none p-0' 
          : 'max-w-6xl px-4 sm:px-6 py-6 pb-24 md:pb-8'
      }`}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      {/* Bottom Nav only on mobile, hidden during inspection wizard */}
      {!isInspectionWizard && <BottomNav />}
    </div>
  );
};
