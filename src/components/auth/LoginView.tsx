import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import {
  GraduationCap,
  BookOpen,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Sun,
  Camera,
  Shield,
  Layers,
  Award,
} from 'lucide-react';

const SCHOOL_WALLPAPERS = [
  {
    id: 'sekolah-masjid-1',
    title: 'Gedung Sekolah & Masjid Megah',
    subtitle: 'Arsitektur kampus modern dengan kubah masjid dan menara asri',
    url: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 'sekolah-masjid-2',
    title: 'Masjid Kampus & Halaman Hijau',
    subtitle: 'Suasana lingkungan sekolah religius, bersih, dan terang',
    url: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 'gedung-modern',
    title: 'Gedung Pembelajaran Modern',
    subtitle: 'Gedung sekolah SMP cerah dinaungi langit biru',
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2000&q=85',
  },
];

export const LoginView: React.FC = () => {
  const { login, loginAsUser, users, schoolProfile } = useLms();

  // ONLY Guru and Siswa - Strictly no admin
  const [selectedRole, setSelectedRole] = useState<'siswa' | 'guru'>('guru');
  const [identifier, setIdentifier] = useState('guru_pai');
  const [password, setPassword] = useState('123456');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeWallpaperIndex, setActiveWallpaperIndex] = useState(0);
  const [isUltraBright, setIsUltraBright] = useState(false);

  const currentWallpaper = SCHOOL_WALLPAPERS[activeWallpaperIndex];

  const handleRoleChange = (role: 'siswa' | 'guru') => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'guru') {
      setIdentifier('guru_pai');
    } else {
      setIdentifier('siswa7');
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage(
        selectedRole === 'siswa'
          ? 'Mohon masukkan NISN atau username siswa.'
          : 'Mohon masukkan NIP atau username guru.'
      );
      return;
    }

    const result = login(identifier, selectedRole, password);
    if (!result.success) {
      setErrorMessage(result.message || 'Login gagal. Data tidak ditemukan.');
    }
  };

  const guruPai = users.find(u => u.role === 'guru' && u.username === 'guru_pai') || users.find(u => u.role === 'guru');
  const siswaKls7 = users.find(u => u.role === 'siswa' && u.gradeLevel === '7');
  const siswaKls8 = users.find(u => u.role === 'siswa' && u.gradeLevel === '8');
  const siswaKls9 = users.find(u => u.role === 'siswa' && u.gradeLevel === '9');

  return (
    <div className="relative min-h-screen py-6 px-4 sm:px-6 flex flex-col justify-center items-center overflow-hidden">
      {/* Background Image: School with Mosque (Cerah, Jelas, Megah) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={currentWallpaper.url}
          alt={currentWallpaper.title}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out transform scale-100 ${
            isUltraBright
              ? 'brightness-110 contrast-105 saturate-110'
              : 'brightness-100 contrast-100'
          }`}
          referrerPolicy="no-referrer"
        />
        {/* Crisp Translucent Blue Overlay */}
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            isUltraBright
              ? 'bg-blue-950/30 backdrop-blur-[0.5px]'
              : 'bg-gradient-to-tr from-slate-950/75 via-blue-950/60 to-indigo-950/70 backdrop-blur-[1px]'
          }`}
        />
      </div>

      {/* Running Marquee Text: “Guru kreatif Siswa Aktif” */}
      <div className="relative z-20 w-full max-w-5xl mb-3 overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white rounded-xl shadow-lg border border-blue-400/40 py-2 px-4 flex items-center">
        <div className="shrink-0 flex items-center gap-2 pr-4 border-r border-blue-400/30 text-xs font-black uppercase tracking-wider text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>MOTTO PAI:</span>
        </div>
        <div className="overflow-hidden flex-1 relative whitespace-nowrap pl-4">
          <div className="animate-running-marquee text-xs sm:text-sm font-bold tracking-wide">
            🌟 GURU KREATIF • UPT SMPN 2 REBANG TANGKAS • MEDIA PAI 🌟 • Siswa Aktif, Berakhlak Mulia & Unggul Iptek-Imtaq • Pembelajaran Digital Terintegrasi 🌟 GURU KREATIF • UPT SMPN 2 REBANG TANGKAS • MEDIA PAI 🌟
          </div>
        </div>
      </div>

      {/* Top Floating Badge & Wallpaper Switcher Bar */}
      <div className="relative z-10 w-full max-w-5xl mb-4 flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/85 backdrop-blur-md text-white py-2 px-3.5 rounded-xl border border-blue-400/30 shadow-lg text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center">
            <Camera className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-300 hidden sm:inline">
            Latar Kampus Sekolah & Masjid:
          </span>
          <span className="font-bold text-amber-300">
            {schoolProfile.name}
          </span>
        </div>

        {/* Wallpaper selector buttons & brightness booster */}
        <div className="flex items-center gap-1.5 ml-auto">
          {SCHOOL_WALLPAPERS.map((wp, idx) => (
            <button
              key={wp.id}
              type="button"
              id={`wallpaper-select-${wp.id}`}
              onClick={() => setActiveWallpaperIndex(idx)}
              className={`px-2.5 py-1 rounded-lg font-medium transition text-[11px] flex items-center gap-1 ${
                activeWallpaperIndex === idx
                  ? 'bg-blue-600 text-white shadow-xs font-bold ring-1 ring-white/40'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
              }`}
              title={wp.subtitle}
            >
              <ImageIcon className="w-3 h-3" />
              <span>Gedung {idx + 1}</span>
            </button>
          ))}

          <button
            type="button"
            id="toggle-bright-mode-btn"
            onClick={() => setIsUltraBright(!isUltraBright)}
            className={`px-2.5 py-1 rounded-lg font-medium transition text-[11px] flex items-center gap-1 ml-1 ${
              isUltraBright
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
            }`}
            title="Tingkatkan kecerahan background sekolah"
          >
            <Sun className="w-3 h-3" />
            <span>{isUltraBright ? 'Terang Maksimal' : 'Mode Terang'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: School Identity, Animated Basmalah & Features */}
        <div className="lg:col-span-6 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-blue-500/40 shadow-2xl p-6 sm:p-7 space-y-4 text-white flex flex-col justify-between">
          <div className="space-y-4">
            {/* Animated Basmalah in Yellow-Gold & Glowing White */}
            <div className="text-center py-2 px-3 rounded-xl bg-blue-950/60 border border-amber-400/30">
              <p
                className="text-2xl sm:text-3xl font-serif font-bold tracking-wider animate-gold-white-glow select-none"
                dir="rtl"
                lang="ar"
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-[11px] text-amber-200/90 font-medium mt-1">
                "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang"
              </p>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/30 text-blue-200 text-xs font-bold border border-blue-400/30 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>APLIKASI GURU SMP MAPEL PAI</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                MEDIA PAI
              </h1>
              <p
                className="font-bold text-yellow-400 mt-1"
                style={{
                  fontSize: '12px',
                  fontFamily: '"Arial Narrow", Arial, sans-serif',
                  color: '#facc15',
                  fontWeight: 'bold',
                }}
              >
                Sadiqul Alim, S.Pd.I.,M.Pd
              </p>
              <p className="text-xs font-semibold text-blue-300 mt-1">
                Guru Pendidikan Agama Islam • {schoolProfile.name}
              </p>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Platform pembelajaran interaktif, perangkat ajar Kurikulum Merdeka, bahan ajar AI, jurnal guru, jurnal sikap, absensi, rekab nilai terintegrasi, dan master pustaka Islam.
              </p>
            </div>

            {/* School Vision Badge */}
            <div className="p-3 rounded-xl bg-blue-900/40 border border-blue-400/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block mb-0.5">
                VISI SEKOLAH:
              </span>
              <p className="text-sm font-bold text-white italic">
                “{schoolProfile.visi}”
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Perangkat Ajar (CP, ATP, Modul Ajar, KKTP) & Bahan Ajar AI</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Jurnal Guru, Jurnal Sikap, Absen 6 Bulan, & Bimbingan Guru Wali</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Rekab Nilai Paralel Kelas 7, 8, 9 (KKM 75: Merah & Hitam Otomatis)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Masterku: Al-Qur'an 30 Juz Audio, Hadits 5 Perawi, Buku CP 2026, & Kisah Teladan</span>
              </div>
            </div>
          </div>

          {/* Quick Demo 1-Click Buttons */}
          <div className="pt-4 border-t border-blue-500/20">
            <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> 1-KLIK LOGIN DEMO (GURU & SISWA):
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {guruPai && (
                <button
                  type="button"
                  id="btn-quick-login-guru"
                  onClick={() => loginAsUser(guruPai)}
                  className="col-span-2 flex items-center justify-between p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-md"
                >
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-7 h-7 rounded-lg bg-blue-800 text-white flex items-center justify-center font-bold text-xs">
                      GP
                    </div>
                    <div>
                      <span className="block text-xs">Login Guru PAI</span>
                      <span className="text-[10px] text-blue-200 font-normal">{guruPai.name}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {siswaKls7 && (
                <button
                  type="button"
                  id="btn-quick-login-siswa7"
                  onClick={() => loginAsUser(siswaKls7)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-left transition"
                >
                  <span className="font-bold block text-xs text-white">Siswa Kls 7 (7A)</span>
                  <span className="text-[10px] text-slate-400">{siswaKls7.name}</span>
                </button>
              )}
              {siswaKls8 && (
                <button
                  type="button"
                  id="btn-quick-login-siswa8"
                  onClick={() => loginAsUser(siswaKls8)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-left transition"
                >
                  <span className="font-bold block text-xs text-white">Siswa Kls 8 (8B)</span>
                  <span className="text-[10px] text-slate-400">{siswaKls8.name}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Dedicated Login Card (Guru & Siswa ONLY) */}
        <div className="lg:col-span-6 bg-white/95 backdrop-blur-md rounded-2xl border border-blue-200 shadow-2xl p-6 sm:p-7 flex flex-col justify-between">
          <div>
            {/* Header Login */}
            <div className="text-center pb-4 border-b border-slate-200">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 mb-2">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Masuk ke Portal Media PAI
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Silakan pilih peran untuk mengakses akun Anda
              </p>
            </div>

            {/* Role Tabs: GURU & SISWA ONLY */}
            <div className="mt-5 p-1 bg-slate-100 rounded-xl grid grid-cols-2 gap-1 border border-slate-200">
              <button
                type="button"
                id="tab-role-guru"
                onClick={() => handleRoleChange('guru')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedRole === 'guru'
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Guru (Pengampu PAI)</span>
              </button>

              <button
                type="button"
                id="tab-role-siswa"
                onClick={() => handleRoleChange('siswa')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  selectedRole === 'siswa'
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Siswa (Peserta Didik)</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleManualLogin} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {selectedRole === 'guru' ? 'NIP / Username Guru' : 'NISN / Username Siswa'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="login-identifier-input"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder={selectedRole === 'guru' ? 'Masukkan NIP atau guru_pai' : 'Masukkan NISN atau siswa7'}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    id="login-password-input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-submit-login"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Footer info inside card */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-600" /> Keamanan Terenkripsi
            </span>
            <span>UPT SMPN 2 Rebang Tangkas</span>
          </div>
        </div>
      </div>
    </div>
  );
};
