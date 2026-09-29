import React from 'react';
import { useLms } from '../../context/LmsContext';
import { MainNavTab } from '../../context/LmsContext';
import {
  Home,
  BookOpen,
  FileText,
  Award,
  MessageSquare,
  LogOut,
  GraduationCap,
  Sparkles,
  School,
  X,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    logout,
    chatMessages,
    schoolConfig,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useLms();

  if (!currentUser) return null;

  // Unread messages count for this user
  const unreadMessagesCount = chatMessages.filter(
    m => !m.isRead && (m.recipientId === currentUser.id || (currentUser.role === 'guru' && m.recipientId === 'user-guru-pai-1'))
  ).length;

  const navItems: { id: MainNavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'materi', label: 'Materi PAI', icon: BookOpen },
    { id: 'ujian', label: 'Tugas & Ujian', icon: FileText },
    { id: 'nilai', label: 'Nilai', icon: Award },
    { id: 'pesan', label: 'Pesan', icon: MessageSquare, badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined },
  ];

  const handleTabClick = (tab: MainNavTab) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-300 select-none shadow-xl">
      {/* Sidebar Header with Brand */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-900/30">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">
                MEDIA PAI
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                BP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[140px]">
              {schoolConfig.name}
            </p>
          </div>
        </div>

        {/* Close button on mobile */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User Mini Profile Card in Sidebar */}
      <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
        <div className="flex items-center gap-3">
          <img
            src={
              currentUser.avatar ||
              (currentUser.role === 'guru'
                ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80')
            }
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/50"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate" title={currentUser.name}>
              {currentUser.name}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              {currentUser.role === 'guru' ? (
                <span className="inline-block text-[10px] font-semibold text-emerald-400">
                  Guru Pengampu PAI
                </span>
              ) : (
                <span className="inline-block text-[10px] font-semibold text-blue-400">
                  Siswa Kelas {currentUser.gradeLevel || '7'} ({currentUser.className || '7A'})
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              {currentUser.role === 'siswa' ? `NISN: ${currentUser.identifier}` : `NIP: ${currentUser.identifier.slice(0, 10)}...`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Menu Utama
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              id={`sidebar-nav-${item.id}`}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition duration-150 group ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 group-hover:text-emerald-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-white text-emerald-700'
                      : 'bg-emerald-500 text-slate-950 font-bold'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section with Red "Keluar" Button */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="text-[11px] text-slate-500 text-center">
          <span>T.A. {schoolConfig.academicYear} • Sem. {schoolConfig.currentSemester}</span>
        </div>

        <button
          type="button"
          id="sidebar-logout-btn"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 hover:border-rose-600 transition shadow-xs group"
        >
          <LogOut className="w-4 h-4 transition group-hover:-translate-x-0.5" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};
