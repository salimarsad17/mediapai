import React from 'react';
import { useLms } from '../../context/LmsContext';
import {
  Menu,
  Sparkles,
  BookOpen,
  GraduationCap,
  LogOut,
  RotateCcw,
  School,
  Bell,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    schoolConfig,
    logout,
    quickSwitchUser,
    activeTab,
    resetAllData,
  } = useLms();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'beranda':
        return 'Beranda & Ringkasan';
      case 'materi':
        return 'Materi & Modul Pembelajaran PAI';
      case 'ujian':
        return 'Tugas & Ujian CBT Online';
      case 'nilai':
        return 'Rekapitulasi Nilai & Evaluasi';
      case 'pesan':
        return 'Pesan & Tanya Jawab Guru-Siswa';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      {/* Simulation Bar (Evaluator Quick Testing - GURU & SISWA ONLY) */}
      <div className="bg-slate-900 text-white text-xs px-3 py-1.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulasi Role:</span>
            </span>
            <span className="hidden md:inline text-slate-400">
              Klik akun untuk beralih mode Guru atau Siswa:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              id="switch-to-guru-pai-btn"
              onClick={() => quickSwitchUser('guru')}
              className={`px-2.5 py-0.5 rounded transition text-xs font-medium flex items-center gap-1 ${
                currentUser?.role === 'guru'
                  ? 'bg-emerald-600 text-white font-bold ring-1 ring-white/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Guru PAI</span>
            </button>

            <div className="flex items-center bg-slate-800 rounded p-0.5 gap-1">
              <span className="text-[11px] text-slate-400 pl-1 flex items-center gap-0.5">
                <GraduationCap className="w-3 h-3 text-blue-400" />
                <span>Siswa:</span>
              </span>
              <button
                id="switch-to-siswa7-btn"
                onClick={() => quickSwitchUser('siswa', '7')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  currentUser?.role === 'siswa' && currentUser?.gradeLevel === '7'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Kls 7
              </button>
              <button
                id="switch-to-siswa8-btn"
                onClick={() => quickSwitchUser('siswa', '8')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  currentUser?.role === 'siswa' && currentUser?.gradeLevel === '8'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Kls 8
              </button>
              <button
                id="switch-to-siswa9-btn"
                onClick={() => quickSwitchUser('siswa', '9')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  currentUser?.role === 'siswa' && currentUser?.gradeLevel === '9'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Kls 9
              </button>
            </div>

            <button
              id="reset-demo-data-btn"
              onClick={() => {
                if (window.confirm('Reset data Media PAI ke setelan awal demo?')) {
                  resetAllData();
                }
              }}
              title="Reset data demo ke awal"
              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-amber-300 hover:bg-slate-700 transition ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Left: Sidebar toggle + Breadcrumbs */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                type="button"
                id="sidebar-toggle-btn"
                onClick={onToggleSidebar}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none"
                title="Buka / Tutup Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base tracking-tight">
                  MEDIA PAI
                </span>
                <span className="text-slate-400">/</span>
                <span className="text-xs sm:text-sm font-semibold text-emerald-700">
                  {getPageTitle()}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {schoolConfig.name} • TP {schoolConfig.academicYear} ({schoolConfig.currentSemester})
              </p>
            </div>
          </div>

          {/* Right: User Profile & Actions */}
          {currentUser && (
            <div className="flex items-center gap-3">
              {/* Role Indicator Pill */}
              <div className="hidden md:flex items-center">
                {currentUser.role === 'guru' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    Guru Pengampu PAI
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    Siswa Kelas {currentUser.gradeLevel} ({currentUser.className || `${currentUser.gradeLevel}A`})
                  </span>
                )}
              </div>

              {/* User Identity */}
              <div className="flex items-center gap-2.5 pl-2 sm:border-l border-slate-200">
                <img
                  src={
                    currentUser.avatar ||
                    (currentUser.role === 'guru'
                      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
                      : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80')
                  }
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight font-mono">
                    {currentUser.role === 'siswa' ? `NISN: ${currentUser.identifier}` : `NIP: ${currentUser.identifier.slice(0, 10)}...`}
                  </p>
                </div>
              </div>

              {/* Logout button in header */}
              <button
                type="button"
                id="header-logout-btn"
                onClick={logout}
                title="Keluar dari akun"
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
