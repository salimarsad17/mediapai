import React, { useState } from 'react';
import { LmsProvider, useLms } from './context/LmsContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LoginView } from './components/auth/LoginView';
import { SiswaDashboard } from './components/siswa/SiswaDashboard';
import { ExamCbtRoom } from './components/siswa/ExamCbtRoom';
import { ExamResultView } from './components/siswa/ExamResultView';
import { GuruDashboard } from './components/guru/GuruDashboard';
import { MateriPaiView } from './components/materi/MateriPaiView';
import { NilaiView } from './components/nilai/NilaiView';
import { PesanView } from './components/pesan/PesanView';
import { BookOpen } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, activeView, activeTab, schoolConfig } = useLms();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If not logged in, display the Login View
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col font-sans antialiased text-slate-900">
        <main className="flex-1">
          <LoginView />
        </main>
        <Footer schoolConfig={schoolConfig} />
      </div>
    );
  }

  // If in CBT Exam Room, render ExamCbtRoom without sidebars/headers to ensure test integrity
  if (activeView === 'exam-cbt' && currentUser.role === 'siswa') {
    return (
      <div className="min-h-screen bg-slate-100 font-sans antialiased select-none">
        <ExamCbtRoom />
      </div>
    );
  }

  // Authenticated Layout with Sidebar & Top Bar
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-900 overflow-x-hidden">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block shrink-0 sticky top-0 h-screen z-20">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
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
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        <main className="flex-1">
          {/* Detailed Exam Result View */}
          {activeView === 'exam-result' ? (
            <ExamResultView />
          ) : (
            <>
              {/* Tab Navigation Views */}
              {activeTab === 'beranda' && (
                <>
                  {currentUser.role === 'guru' ? <GuruDashboard /> : <SiswaDashboard />}
                </>
              )}

              {activeTab === 'materi' && <MateriPaiView />}

              {activeTab === 'ujian' && (
                <>
                  {currentUser.role === 'guru' ? <GuruDashboard /> : <SiswaDashboard />}
                </>
              )}

              {activeTab === 'nilai' && <NilaiView />}

              {activeTab === 'pesan' && <PesanView />}
            </>
          )}
        </main>

        <Footer schoolConfig={schoolConfig} />
      </div>
    </div>
  );
};

const Footer: React.FC<{ schoolConfig: { name: string; academicYear: string; currentSemester: string; npsn: string } }> = ({
  schoolConfig,
}) => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-800">MEDIA PAI</span>
          <span className="hidden md:inline">• {schoolConfig.name}</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>NPSN: {schoolConfig.npsn}</span>
          <span>•</span>
          <span>T.A {schoolConfig.academicYear} ({schoolConfig.currentSemester})</span>
          <span>•</span>
          <span>Status Server CBT: <strong className="text-emerald-600 font-semibold">Online (Stabil)</strong></span>
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
