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
  Layers,
  BookMarked,
  FileCheck,
} from 'lucide-react';

const SCHOOL_WALLPAPERS = [
  {
    id: 'gedung-utama',
    title: 'Gedung Utama Terang',
    subtitle: 'Arsitektur modern, bersih & langit biru cerah',
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 'halaman-asri',
    title: 'Halaman Sekolah Asri',
    subtitle: 'Taman hijau rindang & gedung sekolah megah',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=2000&q=85',
  },
  {
    id: 'kampus-modern',
    title: 'Paviliun Belajar Modern',
    subtitle: 'Suasana lingkungan sekolah terang dan nyaman',
    url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=2000&q=85',
  },
];

export const LoginView: React.FC = () => {
  const { login, loginAsUser, users, schoolConfig } = useLms();

  // ONLY Guru and Siswa - No Admin
  const [selectedRole, setSelectedRole] = useState<'siswa' | 'guru'>('siswa');
  const [identifier, setIdentifier] = useState('siswa7');
  const [password, setPassword] = useState('123456');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeWallpaperIndex, setActiveWallpaperIndex] = useState(0);
  const [isUltraBright, setIsUltraBright] = useState(false);

  const currentWallpaper = SCHOOL_WALLPAPERS[activeWallpaperIndex];

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

    const result = login(identifier, selectedRole);
    if (!result.success) {
      setErrorMessage(result.message || 'Login gagal. Data tidak ditemukan.');
    }
  };

  // Demo accounts for quick testing: GURU PAI & SISWA ONLY
  const guruPai = users.find(u => u.role === 'guru' && u.username === 'guru_pai') || users.find(u => u.role === 'guru');
  const siswaKls7 = users.find(u => u.role === 'siswa' && u.gradeLevel === '7');
  const siswaKls8 = users.find(u => u.role === 'siswa' && u.gradeLevel === '8');
  const siswaKls9 = users.find(u => u.role === 'siswa' && u.gradeLevel === '9');

  return (
    <div className="relative min-h-[calc(100vh-64px)] py-8 px-4 sm:px-6 flex flex-col justify-center items-center overflow-hidden">
      {/* Background Image: Bright, Crisp & Clear School Campus Building */}
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
        {/* Crisp Translucent Overlay */}
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            isUltraBright
              ? 'bg-slate-900/25 backdrop-blur-[0.5px]'
              : 'bg-gradient-to-tr from-slate-950/45 via-slate-900/30 to-emerald-950/35 backdrop-blur-[1px]'
          }`}
        />
      </div>

      {/* Top Floating Badge & Wallpaper Switcher Bar */}
      <div className="relative z-10 w-full max-w-5xl mb-4 flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/80 backdrop-blur-md text-white py-2 px-3.5 rounded-xl border border-white/20 shadow-lg text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/30 text-emerald-300 flex items-center justify-center">
            <Camera className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-200 hidden sm:inline">
            Foto Gedung Kampus Sekolah:
          </span>
          <span className="font-bold text-emerald-300">
            {schoolConfig.name} ({currentWallpaper.title})
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
                  ? 'bg-emerald-600 text-white shadow-xs font-bold ring-1 ring-white/40'
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
            <span>{isUltraBright ? 'Mode Terang Aktif' : 'Paling Terang'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Left Column: School Information & Portal Description */}
        <div className="lg:col-span-6 bg-white/95 backdrop-blur-md rounded-2xl border border-white/80 shadow-xl p-6 sm:p-7 space-y-5 text-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-bold border border-emerald-200">
            <BookMarked className="w-4 h-4 text-emerald-700" />
            <span>MEDIA PEMBELAJARAN PAI & CBT</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
              MEDIA PAI
            </h1>
            <p className="text-sm font-semibold text-emerald-700 mt-1">
              Pendidikan Agama Islam & Budi Pekerti • {schoolConfig.name}
            </p>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Sistem pembelajaran digital interaktif, bank materi PAI (Al-Qur'an, Hadits, Fiqih, Akidah Akhlak, SKI),
              serta Asesmen Sumatif CBT berbasis komputer untuk siswa <strong className="text-slate-900 font-semibold">Kelas 7, Kelas 8, dan Kelas 9</strong>.
            </p>
          </div>

          {/* Key Features List */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-slate-700 leading-snug">
                <strong className="font-semibold text-slate-900">Portal Guru & Siswa:</strong> Akses materi interaktif, latihan soal, dan konsultasi tanya jawab langsung.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-slate-700 leading-snug">
                <strong className="font-semibold text-slate-900">CBT Engine Terproteksi:</strong> Token ujian resmi, timer countdown, dan deteksi anti-kecurangan.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-slate-700 leading-snug">
                <strong className="font-semibold text-slate-900">Rekapitulasi Nilai & KKM:</strong> Analisis butir soal otomatis, rekapitulasi nilai per kelas, dan transparansi evaluasi.
              </p>
            </div>
          </div>

          {/* Quick Demo Login Preset Buttons - GURU & SISWA ONLY */}
          <div className="pt-3.5 border-t border-slate-200">
            <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1-KLIK LOGIN CEPAT DEMO:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {guruPai && (
                <button
                  type="button"
                  id="quick-demo-guru-pai-btn"
                  onClick={() => loginAsUser(guruPai)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-100 text-left transition group sm:col-span-2 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      GP
                    </div>
                    <div>
                      <span className="font-bold text-emerald-950 block group-hover:text-emerald-800">
                        Login Guru PAI
                      </span>
                      <span className="text-[11px] text-emerald-700">
                        {guruPai.name} (NIP: {guruPai.identifier})
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition" />
                </button>
              )}

              {siswaKls7 && (
                <button
                  type="button"
                  id="quick-demo-siswa7-btn"
                  onClick={() => loginAsUser(siswaKls7)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-left transition group"
                >
                  <div>
                    <span className="font-bold text-slate-900 block group-hover:text-blue-700">
                      Siswa Kelas 7 (7A)
                    </span>
                    <span className="text-[10px] text-slate-500">{siswaKls7.name}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition" />
                </button>
              )}

              {siswaKls8 && (
                <button
                  type="button"
                  id="quick-demo-siswa8-btn"
                  onClick={() => loginAsUser(siswaKls8)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-left transition group"
                >
                  <div>
                    <span className="font-bold text-slate-900 block group-hover:text-blue-700">
                      Siswa Kelas 8 (8B)
                    </span>
                    <span className="text-[10px] text-slate-500">{siswaKls8.name}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition" />
                </button>
              )}

              {siswaKls9 && (
                <button
                  type="button"
                  id="quick-demo-siswa9-btn"
                  onClick={() => loginAsUser(siswaKls9)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-left transition group sm:col-span-2"
                >
                  <div>
                    <span className="font-bold text-slate-900 block group-hover:text-blue-700">
                      Siswa Kelas 9 (9A - Persiapan Ujian Akhir)
                    </span>
                    <span className="text-[10px] text-slate-500">{siswaKls9.name} (NISN: {siswaKls9.identifier})</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login Form (ONLY GURU & SISWA) */}
        <div className="lg:col-span-6">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-white/80 shadow-xl p-6 sm:p-7">
            {/* Role Switcher Tabs - Strictly Siswa and Guru */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Pilih Peran Masuk
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  id="role-tab-siswa"
                  onClick={() => {
                    setSelectedRole('siswa');
                    setIdentifier('siswa7');
                    setPassword('123456');
                    setErrorMessage('');
                  }}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-xs font-bold transition ${
                    selectedRole === 'siswa'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Siswa (Peserta Didik)</span>
                </button>

                <button
                  type="button"
                  id="role-tab-guru"
                  onClick={() => {
                    setSelectedRole('guru');
                    setIdentifier('guru_pai');
                    setPassword('123456');
                    setErrorMessage('');
                  }}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-xs font-bold transition ${
                    selectedRole === 'guru'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Guru (Pengampu PAI)</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {selectedRole === 'siswa'
                    ? 'NISN Siswa / Username'
                    : 'NIP Guru / Username'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="input-identifier"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder={
                      selectedRole === 'siswa'
                        ? 'Contoh: 0081234567 atau siswa7'
                        : 'Contoh: 198205142008011015 atau guru_pai'
                    }
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    id="input-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 transition"
                  />
                </div>
              </div>

              {selectedRole === 'siswa' && (
                <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-900 text-xs flex items-center justify-between">
                  <span className="text-[11px] text-blue-700">Tingkat Kelas:</span>
                  <div className="flex gap-1.5 font-bold">
                    <button
                      type="button"
                      onClick={() => setIdentifier('siswa7')}
                      className={`px-2 py-0.5 rounded text-[11px] ${identifier === 'siswa7' ? 'bg-blue-600 text-white' : 'bg-white text-blue-700 border border-blue-200'}`}
                    >
                      Kelas 7
                    </button>
                    <button
                      type="button"
                      onClick={() => setIdentifier('siswa8')}
                      className={`px-2 py-0.5 rounded text-[11px] ${identifier === 'siswa8' ? 'bg-blue-600 text-white' : 'bg-white text-blue-700 border border-blue-200'}`}
                    >
                      Kelas 8
                    </button>
                    <button
                      type="button"
                      onClick={() => setIdentifier('siswa9')}
                      className={`px-2 py-0.5 rounded text-[11px] ${identifier === 'siswa9' ? 'bg-blue-600 text-white' : 'bg-white text-blue-700 border border-blue-200'}`}
                    >
                      Kelas 9
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                id="submit-login-btn"
                className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 mt-2 ${
                  selectedRole === 'siswa'
                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
                    : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300'
                }`}
              >
                <span>
                  Masuk Sebagai {selectedRole === 'siswa' ? 'Siswa' : 'Guru PAI'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-200 text-center">
              <p className="text-[11px] text-slate-500">
                Aplikasi Resmi <strong>Media PAI</strong> • {schoolConfig.name}
                <br />
                Tahun Ajaran {schoolConfig.academicYear} (Semester {schoolConfig.currentSemester})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
