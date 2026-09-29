import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { AdaptiveImage } from './AdaptiveImage';
import {
  LayoutDashboard,
  Database,
  Briefcase,
  FileSpreadsheet,
  BookOpenCheck,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  School,
  Users,
  GraduationCap,
  Layers,
  FileText,
  Sparkles,
  BookMarked,
  CalendarCheck,
  Award,
  BookOpen,
  User,
  HeartHandshake,
  MessageSquare,
} from 'lucide-react';

export const Sidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const {
    currentUser,
    logout,
    activeGuruMenu,
    setActiveGuruMenu,
    activeGuruSubMenu,
    setActiveGuruSubMenu,
    activeSiswaMenu,
    setActiveSiswaMenu,
    schoolProfile,
    unreadMessagesCount,
  } = useLms();

  const [isDataMenuOpen, setIsDataMenuOpen] = useState(true);
  const [isPerangkatMenuOpen, setIsPerangkatMenuOpen] = useState(true);

  if (!currentUser) return null;

  const handleGuruMenuClick = (menu: any, subMenu?: string) => {
    setActiveGuruMenu(menu);
    if (subMenu) {
      setActiveGuruSubMenu(subMenu);
    }
    if (onCloseMobile) onCloseMobile();
  };

  const handleSiswaMenuClick = (menu: any) => {
    setActiveSiswaMenu(menu);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 h-full bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800 shadow-xl select-none">
      {/* Top Section */}
      <div className="overflow-y-auto flex-1 py-4 px-3 space-y-4">
        {/* App Logo & School Name */}
        <div className="px-3 pb-3 border-b border-slate-800 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="leading-tight min-w-0">
            <span className="font-black text-base tracking-tight text-white block">
              MEDIA PAI
            </span>
            <span
              className="block truncate text-yellow-400 font-bold"
              style={{
                fontSize: '12px',
                fontFamily: '"Arial Narrow", Arial, sans-serif',
                color: '#facc15',
                fontWeight: 'bold',
              }}
              title="Sadiqul Alim, S.Pd.I.,M.Pd"
            >
              Sadiqul Alim, S.Pd.I.,M.Pd
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="mx-1 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-blue-500/40 shrink-0 bg-slate-700 flex items-center justify-center">
            <AdaptiveImage
              src={currentUser.avatar}
              fallbackSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt={currentUser.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-bold text-white truncate">
              {currentUser.name}
            </span>
            <span className="inline-block px-1.5 py-0.5 mt-0.5 rounded text-[9px] font-bold uppercase bg-blue-900/60 text-blue-300 border border-blue-400/20">
              {currentUser.role === 'guru' ? 'Guru Pengampu' : `Siswa ${currentUser.className || ''}`}
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1">
          {currentUser.role === 'guru' ? (
            /* --- GURU NAVIGATION --- */
            <>
              {/* Beranda Guru */}
              <button
                type="button"
                onClick={() => handleGuruMenuClick('beranda')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeGuruMenu === 'beranda'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                <span>Beranda Guru</span>
              </button>

              {/* Menu DATA (Dropdown) */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setIsDataMenuOpen(!isDataMenuOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeGuruMenu === 'data'
                      ? 'bg-slate-800 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-amber-400" />
                    <span>MENU DATA</span>
                  </div>
                  {isDataMenuOpen ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>

                {isDataMenuOpen && (
                  <div className="pl-6 space-y-0.5 border-l-2 border-slate-800 ml-4 py-1 text-xs">
                    <button
                      type="button"
                      onClick={() => handleGuruMenuClick('data', 'profil_sekolah')}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                        activeGuruMenu === 'data' && activeGuruSubMenu === 'profil_sekolah'
                          ? 'bg-blue-600/30 text-blue-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      • Profil Sekolah
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGuruMenuClick('data', 'profil_guru')}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                        activeGuruMenu === 'data' && activeGuruSubMenu === 'profil_guru'
                          ? 'bg-blue-600/30 text-blue-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      • Profil Guru
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGuruMenuClick('data', 'data_sekolah')}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                        activeGuruMenu === 'data' && activeGuruSubMenu === 'data_sekolah'
                          ? 'bg-blue-600/30 text-blue-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      • Data Sekolah
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGuruMenuClick('data', 'data_kelas')}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                        activeGuruMenu === 'data' && activeGuruSubMenu === 'data_kelas'
                          ? 'bg-blue-600/30 text-blue-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      • Data Kelas (7,8,9)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGuruMenuClick('data', 'data_siswa')}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                        activeGuruMenu === 'data' && activeGuruSubMenu === 'data_siswa'
                          ? 'bg-blue-600/30 text-blue-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      • DATA SISWA
                    </button>
                  </div>
                )}
              </div>

              {/* Menu Perangkat Guru (Dropdown) */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setIsPerangkatMenuOpen(!isPerangkatMenuOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeGuruMenu === 'perangkat'
                      ? 'bg-slate-800 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-emerald-400" />
                    <span>PERANGKAT GURU</span>
                  </div>
                  {isPerangkatMenuOpen ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                </button>

                {isPerangkatMenuOpen && (
                  <div className="pl-6 space-y-0.5 border-l-2 border-slate-800 ml-4 py-1 text-xs">
                    <button
                      type="button"
                      onClick={() => handleGuruMenuClick('perangkat', 'perangkat_ajar')}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                        activeGuruMenu === 'perangkat' && activeGuruSubMenu === 'perangkat_ajar'
                          ? 'bg-blue-600/30 text-blue-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      • Perangkat Ajar (CP/ATP)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGuruMenuClick('perangkat', 'bahan_ajar_ai')}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg transition flex items-center justify-between ${
                        activeGuruMenu === 'perangkat' && activeGuruSubMenu === 'bahan_ajar_ai'
                          ? 'bg-blue-600/30 text-blue-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>• BAHAN AJAR AI</span>
                      <Sparkles className="w-3 h-3 text-amber-300" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGuruMenuClick('perangkat', 'jurnal_guru')}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                        activeGuruMenu === 'perangkat' && activeGuruSubMenu === 'jurnal_guru'
                          ? 'bg-blue-600/30 text-blue-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      • JURNAL GURU
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGuruMenuClick('perangkat', 'jurnal_sikap')}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                        activeGuruMenu === 'perangkat' && activeGuruSubMenu === 'jurnal_sikap'
                          ? 'bg-blue-600/30 text-blue-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      • JURNAL SIKAP
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGuruMenuClick('perangkat', 'absen_siswa')}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                        activeGuruMenu === 'perangkat' && activeGuruSubMenu === 'absen_siswa'
                          ? 'bg-blue-600/30 text-blue-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      • Absen SISWA (6 Bulan)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGuruMenuClick('perangkat', 'guru_wali')}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                        activeGuruMenu === 'perangkat' && activeGuruSubMenu === 'guru_wali'
                          ? 'bg-blue-600/30 text-blue-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      • Guru Wali
                    </button>
                  </div>
                )}
              </div>

              {/* REKAB NILAI */}
              <button
                type="button"
                onClick={() => handleGuruMenuClick('rekap_nilai')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeGuruMenu === 'rekap_nilai'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                <span>REKAB NILAI (Paralel)</span>
              </button>

              {/* Menu Pesan Guru */}
              <button
                type="button"
                onClick={() => handleGuruMenuClick('pesan')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer group ${
                  activeGuruMenu === 'pesan'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Pesan & Konsultasi</span>
                </div>
                {unreadMessagesCount > 0 && (
                  <span
                    className="inline-flex items-center justify-center px-1.5 py-0.5 min-w-[20px] h-5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white shadow-sm shadow-rose-900/50 animate-pulse border border-rose-400/40"
                    title={`${unreadMessagesCount} pesan baru belum dibaca`}
                  >
                    {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                  </span>
                )}
              </button>

              {/* Masterku */}
              <button
                type="button"
                onClick={() => handleGuruMenuClick('masterku')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeGuruMenu === 'masterku'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BookOpenCheck className="w-4 h-4 text-cyan-400" />
                <span>Masterku (Pustaka PAI)</span>
              </button>

              {/* Pengaturan Akun Guru */}
              <button
                type="button"
                onClick={() => handleGuruMenuClick('pengaturan')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeGuruMenu === 'pengaturan'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Pengaturan Akun</span>
              </button>
            </>
          ) : (
            /* --- SISWA NAVIGATION --- */
            <>
              {/* Beranda Siswa */}
              <button
                type="button"
                onClick={() => handleSiswaMenuClick('beranda')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeSiswaMenu === 'beranda'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                <span>Beranda Siswa</span>
              </button>

              {/* Profil Siswa */}
              <button
                type="button"
                onClick={() => handleSiswaMenuClick('profil_siswa')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeSiswaMenu === 'profil_siswa'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span>Profil Siswa</span>
              </button>

              {/* Masterku Siswa (Read/Play only) */}
              <button
                type="button"
                onClick={() => handleSiswaMenuClick('masterku')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeSiswaMenu === 'masterku'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BookOpenCheck className="w-4 h-4 text-cyan-400" />
                <span>Masterku (Baca & Audio)</span>
              </button>

              {/* Tugas Siswa (Only what Guru sent!) */}
              <button
                type="button"
                onClick={() => handleSiswaMenuClick('tugas_siswa')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeSiswaMenu === 'tugas_siswa'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Tugas Siswa (Interaktif)</span>
              </button>

              {/* Rekap Nilai Siswa */}
              <button
                type="button"
                onClick={() => handleSiswaMenuClick('rekap_nilai')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeSiswaMenu === 'rekap_nilai'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Award className="w-4 h-4 text-purple-400" />
                <span>Rekap Nilai Saya</span>
              </button>

              {/* Menu Pesan Siswa */}
              <button
                type="button"
                onClick={() => handleSiswaMenuClick('pesan')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer group ${
                  activeSiswaMenu === 'pesan'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Pesan & Tanya Jawab</span>
                </div>
                {unreadMessagesCount > 0 && (
                  <span
                    className="inline-flex items-center justify-center px-1.5 py-0.5 min-w-[20px] h-5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white shadow-sm shadow-rose-900/50 animate-pulse border border-rose-400/40"
                    title={`${unreadMessagesCount} pesan baru belum dibaca`}
                  >
                    {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
                  </span>
                )}
              </button>

              {/* Pengaturan Akun Siswa */}
              <button
                type="button"
                onClick={() => handleSiswaMenuClick('pengaturan')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeSiswaMenu === 'pengaturan'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Pengaturan Akun</span>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Bottom Keluar Button (Red) */}
      <div className="p-3 border-t border-slate-800">
        <button
          type="button"
          onClick={logout}
          className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-red-900/40 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};
