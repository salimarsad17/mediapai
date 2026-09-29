import React from 'react';
import { useLms } from '../../context/LmsContext';
import { AdaptiveImage } from './AdaptiveImage';
import {
  Menu,
  BookOpen,
  LogOut,
  UserCheck,
  GraduationCap,
  Sparkles,
  School,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';

export const Header: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    logout,
    quickSwitchUser,
    schoolProfile,
    activeGuruMenu,
    setActiveGuruMenu,
    activeSiswaMenu,
    setActiveSiswaMenu,
    unreadMessagesCount,
  } = useLms();

  const getBreadcrumb = () => {
    if (!currentUser) return 'Media PAI';
    if (currentUser.role === 'guru') {
      const labels: Record<string, string> = {
        beranda: 'Beranda Guru',
        data: 'Menu Data Sekolah & Siswa',
        perangkat: 'Perangkat & Bahan Ajar Guru',
        rekap_nilai: 'Rekab Nilai Siswa',
        pesan: 'Pesan & Konsultasi Tanya Jawab',
        masterku: 'Pustaka Masterku',
        pengaturan: 'Pengaturan Akun',
      };
      return labels[activeGuruMenu] || 'Menu Guru';
    } else {
      const labels: Record<string, string> = {
        beranda: 'Beranda Siswa',
        profil_siswa: 'Profil Siswa',
        masterku: 'Pustaka Masterku',
        tugas_siswa: 'Tugas & Bahan Ajar PAI',
        rekap_nilai: 'Rekap Nilai Pribadi',
        pesan: 'Pesan & Konsultasi Tanya Jawab',
        pengaturan: 'Pengaturan Akun',
      };
      return labels[activeSiswaMenu] || 'Menu Siswa';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner Running Marquee */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-700 to-blue-900 text-white text-xs py-1.5 px-4 flex items-center justify-between overflow-hidden gap-4 shadow-inner">
        <div className="overflow-hidden flex-1 relative whitespace-nowrap flex items-center">
          <div className="animate-running-marquee flex items-center gap-8 text-xs font-bold tracking-wide">
            <span className="text-amber-300 flex items-center gap-1.5 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              GURU KREATIF • UPT SMPN 2 REBANG TANGKAS • MEDIA PAI
            </span>
            <span className="text-blue-200 shrink-0">•</span>
            <span className="text-slate-100 shrink-0">
              Siswa Aktif, Berakhlak Mulia & Unggul Iptek-Imtaq
            </span>
            <span className="text-blue-200 shrink-0">•</span>
            <span className="text-amber-300 flex items-center gap-1.5 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              GURU KREATIF • UPT SMPN 2 REBANG TANGKAS • MEDIA PAI
            </span>
            <span className="text-blue-200 shrink-0">•</span>
            <span className="text-slate-100 shrink-0">
              Pembelajaran Pendidikan Agama Islam Digital Terintegrasi
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[11px] shrink-0 text-blue-100 bg-blue-950/70 px-3 py-0.5 rounded-full border border-blue-400/30">
          <span>NPSN: {schoolProfile.npsn}</span>
          <span>•</span>
          <span className="text-emerald-300 font-bold">Akreditasi {schoolProfile.akreditasi}</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-3">
        {/* Left Side: Mobile Menu Button & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 tracking-tight text-base sm:text-lg">
                  MEDIA PAI
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-blue-800">
                  SMPN 2 Rebang Tangkas
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="font-bold"
                  style={{
                    fontSize: '12px',
                    fontFamily: '"Arial Narrow", Arial, sans-serif',
                    color: '#b45309',
                    fontWeight: 'bold',
                  }}
                >
                  Sadiqul Alim, S.Pd.I.,M.Pd
                </span>
                <span className="text-[10px] text-slate-300">•</span>
                <span className="text-[11px] text-slate-500">{getBreadcrumb()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Role Switcher for seamless testing & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Simulation Bar */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-500 px-2 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-blue-600" /> Uji Peran:
            </span>
            <button
              type="button"
              onClick={() => quickSwitchUser('guru')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                currentUser?.role === 'guru'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              Guru PAI
            </button>
            <button
              type="button"
              onClick={() => quickSwitchUser('siswa', '7')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                currentUser?.role === 'siswa' && currentUser?.gradeLevel === '7'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              Siswa Kls 7
            </button>
            <button
              type="button"
              onClick={() => quickSwitchUser('siswa', '8')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                currentUser?.role === 'siswa' && currentUser?.gradeLevel === '8'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              Siswa Kls 8
            </button>
            <button
              type="button"
              onClick={() => quickSwitchUser('siswa', '9')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                currentUser?.role === 'siswa' && currentUser?.gradeLevel === '9'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              Siswa Kls 9
            </button>
          </div>

          {/* User Profile Info - Disembunyikan untuk Guru Pengampu sesuai permintaan */}
          {currentUser && currentUser.role !== 'guru' && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-blue-500/30 shrink-0 bg-slate-100 flex items-center justify-center">
                <AdaptiveImage
                  src={currentUser.avatar}
                  fallbackSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt={currentUser.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-slate-800 leading-tight truncate max-w-[140px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-semibold text-blue-600 uppercase">
                  {`Siswa ${currentUser.className || ''}`}
                </span>
              </div>
            </div>
          )}

          {/* Quick Message Notification Icon with Badge */}
          <button
            type="button"
            onClick={() => {
              if (currentUser?.role === 'guru') {
                setActiveGuruMenu('pesan');
              } else {
                setActiveSiswaMenu('pesan');
              }
            }}
            className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
            title="Pesan & Konsultasi Belajar"
          >
            <MessageSquare className="w-5 h-5 text-slate-600" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] px-1 items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-black shadow-xs animate-pulse border-2 border-white">
                {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Logout button */}
          <button
            type="button"
            onClick={logout}
            className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
            title="Keluar Aplikasi"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
