import React, { useState } from 'react';
import { LmsProvider, useLms } from './context/LmsContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LoginView } from './components/auth/LoginView';
import { GuruDashboard } from './components/guru/GuruDashboard';
import { MenuDataView } from './components/guru/MenuDataView';
import { PerangkatGuruView } from './components/guru/PerangkatGuruView';
import { RekapNilaiGuruView } from './components/guru/RekapNilaiGuruView';
import { MasterkuView } from './components/masterku/MasterkuView';
import { SiswaDashboard } from './components/siswa/SiswaDashboard';
import { ProfilSiswaView } from './components/siswa/ProfilSiswaView';
import { TugasSiswaView } from './components/siswa/TugasSiswaView';
import { RekapNilaiSiswaView } from './components/siswa/RekapNilaiSiswaView';
import { PesanView } from './components/pesan/PesanView';
import { PengaturanAkunView } from './components/common/PengaturanAkunView';
import { BookOpen } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentUser,
    activeGuruMenu,
    activeSiswaMenu,
    schoolProfile,
  } = useLms();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If not logged in, display the Login View
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col font-sans antialiased text-slate-900">
        <main className="flex-1">
          <LoginView />
        </main>
        <Footer schoolProfile={schoolProfile} />
      </div>
    );
  }

  // Authenticated Layout with Sidebar & Header
  return (
    <div className="min-h-screen bg-slate-100/70 flex font-sans antialiased text-slate-900 overflow-x-hidden print:bg-white print:overflow-visible">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-20 print:hidden">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex print:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-[80vw] h-full shadow-2xl">
            <Sidebar onCloseMobile={() => setIsMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen print:min-h-0 print:block">
        <div className="print:hidden">
          <Header onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
        </div>

        <main className="flex-1 print:p-0">
          {currentUser.role === 'guru' ? (
            /* --- GURU VIEWS --- */
            <>
              {activeGuruMenu === 'beranda' && <GuruDashboard />}
              {activeGuruMenu === 'data' && <MenuDataView />}
              {activeGuruMenu === 'perangkat' && <PerangkatGuruView />}
              {activeGuruMenu === 'rekap_nilai' && <RekapNilaiGuruView />}
              {activeGuruMenu === 'pesan' && <PesanView />}
              {activeGuruMenu === 'masterku' && <MasterkuView isReadOnly={false} />}
              {activeGuruMenu === 'pengaturan' && <PengaturanAkunView />}
            </>
          ) : (
            /* --- SISWA VIEWS --- */
            <>
              {activeSiswaMenu === 'beranda' && <SiswaDashboard />}
              {activeSiswaMenu === 'profil_siswa' && <ProfilSiswaView />}
              {activeSiswaMenu === 'masterku' && <MasterkuView isReadOnly={true} />}
              {activeSiswaMenu === 'tugas_siswa' && <TugasSiswaView />}
              {activeSiswaMenu === 'rekap_nilai' && <RekapNilaiSiswaView />}
              {activeSiswaMenu === 'pesan' && <PesanView />}
              {activeSiswaMenu === 'pengaturan' && <PengaturanAkunView />}
            </>
          )}
        </main>

        <Footer schoolProfile={schoolProfile} />
      </div>
    </div>
  );
};

const Footer: React.FC<{ schoolProfile: { name: string; npsn: string } }> = ({
  schoolProfile,
}) => {
  return (
    <footer className="bg-white border-t border-slate-200 py-5 text-xs text-slate-500 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <span className="font-black text-slate-900">MEDIA PAI</span>
          <span className="hidden md:inline">• {schoolProfile.name}</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>NPSN: {schoolProfile.npsn}</span>
          <span>•</span>
          <span>“Guru kreatif Siswa Aktif”</span>
          <span>•</span>
          <span>Status Server: <strong className="text-emerald-600 font-semibold">Online & Aktif</strong></span>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <LmsProvider>
      <AppContent />
    </LmsProvider>
  );
}
