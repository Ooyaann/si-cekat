import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { PageTransition } from './PageTransition';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-page-bg bg-grid-pattern">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-col flex-1 overflow-hidden w-full relative">
        {/* Glowing Background Ornaments */}
        <div className="fixed top-[10%] right-[5%] w-[450px] h-[450px] rounded-full bg-primary/8 filter blur-[120px] pointer-events-none animate-float-slow" />
        <div className="fixed bottom-[10%] left-[5%] w-[450px] h-[450px] rounded-full bg-indigo-500/8 filter blur-[120px] pointer-events-none animate-float-slow-reverse" />

        <Navbar variant="admin" showMenuBtn={true} onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
};
