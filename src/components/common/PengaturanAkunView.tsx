import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import {
  Settings,
  User,
  Shield,
  Key,
  RotateCcw,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Camera,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertCircle,
  Info,
  Sparkles,
  ArrowRight,
  GraduationCap,
  School,
  Upload,
} from 'lucide-react';
import { AdaptiveImage } from './AdaptiveImage';
import {
  normalizeImageUrl,
  isGoogleDriveUrl,
  compressImageFile,
  DEFAULT_AVATAR,
  DEFAULT_STUDENT_AVATAR,
} from '../../utils/imageUtils';

export const PengaturanAkunView: React.FC = () => {
  const { currentUser, updateCurrentUserProfile, resetAllData, schoolProfile } = useLms();

  const activePassword = currentUser?.password || '123456';
  const roleName = currentUser?.role === 'guru' ? 'Guru PAI' : 'Siswa';

  // Profile states
  const [nama, setNama] = useState(currentUser?.name || '');
  const [identifier, setIdentifier] = useState(currentUser?.identifier || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  // Password visibility states - default true for active password so user can see it right away!
  const [isShowActivePassword, setIsShowActivePassword] = useState(true);
  const [isShowOldPassword, setIsShowOldPassword] = useState(true);
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  // Password change states
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Messages and copy feedback
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyPassword = (pwd: string) => {
    navigator.clipboard.writeText(pwd);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleAutoFillCurrentPassword = () => {
    setCurrentPasswordInput(activePassword);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    updateCurrentUserProfile({
      name: nama,
      identifier,
      email,
      phone,
      avatar,
    });
    setSuccessMsg('Profil akun Anda telah berhasil diperbarui!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Check old password matches active password
    if (currentPasswordInput.trim() !== activePassword) {
      setErrorMsg(
        `Kata sandi saat ini tidak cocok! Sandi yang Anda gunakan saat login masuk akun adalah "${activePassword}".`
      );
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi baru tidak sesuai dengan kata sandi baru yang dimasukkan.');
      return;
    }

    // Update password in user profile
    updateCurrentUserProfile({ password: newPassword });
    setSuccessMsg(
      `Kata sandi berhasil diperbarui! Sandi aktif untuk masuk akun ${roleName} sekarang adalah: "${newPassword}". Gunakan sandi baru ini saat masuk/login berikutnya.`
    );
    setCurrentPasswordInput('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-1.5">
              <Settings className="w-3.5 h-3.5" />
              <span>PENGATURAN AKUN PENGGUNA</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Pengaturan Akun & Kata Sandi {roleName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Periksa sandi yang digunakan saat masuk akun, ganti kata sandi baru, dan perbarui data profil {schoolProfile.name}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                currentUser?.role === 'guru'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
              }`}
            >
              {currentUser?.role === 'guru' ? (
                <GraduationCap className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span>{roleName} Aktif</span>
            </span>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-start gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="leading-relaxed">{successMsg}</p>
              <p className="text-[11px] font-normal text-emerald-700">
                Data kata sandi akun Anda telah diperbarui dan langsung tersimpan di sistem.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="leading-relaxed">{errorMsg}</p>
              <p className="text-[11px] font-normal text-red-600">
                Silakan periksa kembali kata sandi saat ini atau sesuaikan persyaratan kata sandi baru.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* BAGIAN 1: KATA SANDI YANG DIGUNAKAN / WAKTU MASUK AKUN (TAMPILAN UTAMA) */}
        {/* ========================================================================= */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-blue-400/40 space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Card Title & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/30 text-amber-300 flex items-center justify-center font-bold shrink-0 ring-1 ring-blue-300/40 shadow-inner">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  KATA SANDI YANG DIGUNAKAN WAKTU MASUK AKUN
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Sandi Masuk Akun {roleName} ({currentUser?.name})
                </h3>
              </div>
            </div>

            <span className="self-start sm:self-center px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sandi Login Aktif</span>
            </span>
          </div>

          <p className="text-xs text-blue-100/90 leading-relaxed relative z-10">
            Berikut adalah kata sandi yang telah Anda gunakan saat masuk (login) ke aplikasi <strong>Media PAI SMPN 2 Rebang Tangkas</strong>. Anda dapat melihat, menyalin, atau langsung mengisikannya ke formulir perubahan sandi di bawah:
          </p>

          {/* Big Password Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/20 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Kata Sandi Aktif Masuk Akun:
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30">
                  {currentUser?.role === 'guru' ? 'Guru PAI' : 'Siswa'}
                </span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-wider select-all bg-black/30 px-3 py-1 rounded-xl border border-amber-400/30 shadow-inner">
                  {isShowActivePassword ? activePassword : '••••••••••••'}
                </span>
                <span className="text-xs text-blue-200">
                  ({activePassword.length} karakter)
                </span>
              </div>
            </div>

            {/* Action Buttons for Password */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                id="btn-toggle-view-active-password"
                onClick={() => setIsShowActivePassword(!isShowActivePassword)}
                className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ring-1 ring-white/20 shadow-xs"
                title={isShowActivePassword ? 'Sembunyikan Sandi' : 'Tampilkan Sandi'}
              >
                {isShowActivePassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-amber-300" />
                    <span>Sembunyikan</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-amber-300" />
                    <span>Tampilkan Sandi</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="btn-copy-active-password"
                onClick={() => handleCopyPassword(activePassword)}
                className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
                title="Salin Sandi ke Clipboard"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="text-emerald-300">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Sandi</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="btn-fill-to-change-form"
                onClick={handleAutoFillCurrentPassword}
                className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                title="Isi otomatis sandi ini ke kolom form ubah sandi di bawah"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Isi ke Kolom Ubah Sandi</span>
              </button>
            </div>
          </div>

          {/* User Account Login Info Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs relative z-10">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] text-blue-200 block font-bold uppercase">
                {currentUser?.role === 'guru' ? 'NIP / User ID' : 'NISN / User ID'}
              </span>
              <span className="font-mono font-bold text-white text-xs block">
                {currentUser?.identifier}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] text-blue-200 block font-bold uppercase">
                Nama Pengguna Masuk
              </span>
              <span className="font-bold text-white text-xs block truncate">
                {currentUser?.name}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] text-blue-200 block font-bold uppercase">
                Status Sandi Masuk
              </span>
              <span className="font-semibold text-emerald-300 text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Aktif & Terverifikasi</span>
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BAGIAN 2: FORMULIR UBAH KATA SANDI (DENGAN TAMPILAN SANDI SAAT INI) */}
        {/* ========================================================================= */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Formulir Ubah Kata Sandi Baru
                </h2>
                <p className="text-[11px] text-slate-500">
                  Ganti kata sandi login {roleName} dengan sandi baru yang aman
                </p>
              </div>
            </div>

            {/* Quick helper badge */}
            <div className="flex items-center gap-1.5 self-start sm:self-center text-[11px] bg-blue-50 text-blue-800 px-3 py-1 rounded-xl border border-blue-200 font-semibold">
              <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Sandi Masuk Saat Ini: <strong className="font-mono text-blue-900 bg-white px-1.5 py-0.5 rounded border border-blue-300">{activePassword}</strong></span>
            </div>
          </div>

          {/* Helper Banner inside Change Password Form */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <Key className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">
                  Sandi yang sedang digunakan untuk masuk akun adalah: <span className="font-mono font-black text-slate-900 underline decoration-amber-500">{activePassword}</span>
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Klik tombol di samping untuk otomatis mengisi kolom "Kata Sandi Saat Ini".
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutoFillCurrentPassword}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition flex items-center gap-1 self-start sm:self-center"
            >
              <span>Isi Sandi Otomatis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Kolom 1: Kata Sandi Saat Ini */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <label className="font-bold text-slate-700">
                    Kata Sandi Saat Ini <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoFillCurrentPassword}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
                  >
                    Isi: {activePassword}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={isShowOldPassword ? 'text' : 'password'}
                    id="input-current-password"
                    value={currentPasswordInput}
                    onChange={e => setCurrentPasswordInput(e.target.value)}
                    placeholder={`Masukkan "${activePassword}"`}
                    className="w-full pr-9 pl-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsShowOldPassword(!isShowOldPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={isShowOldPassword ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    {isShowOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Sandi masuk aktif: <strong className="text-slate-800 font-mono">{activePassword}</strong>
                </span>
              </div>

              {/* Kolom 2: Kata Sandi Baru */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Kata Sandi Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={isShowNewPassword ? 'text' : 'password'}
                    id="input-new-password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pr-9 pl-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsShowNewPassword(!isShowNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={isShowNewPassword ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    {isShowNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Gunakan kombinasi yang mudah Anda ingat
                </span>
              </div>

              {/* Kolom 3: Konfirmasi Kata Sandi Baru */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Konfirmasi Sandi Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={isShowConfirmPassword ? 'text' : 'password'}
                    id="input-confirm-password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi sandi baru"
                    className="w-full pr-9 pl-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={isShowConfirmPassword ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    {isShowConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Harus sama dengan kolom sandi baru
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/80">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Sandi baru akan langsung aktif dan digunakan pada login berikutnya.</span>
              </span>

              <button
                type="submit"
                id="btn-save-new-password"
                className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 self-end sm:self-auto"
              >
                <Key className="w-4 h-4" />
                <span>Simpan & Terapkan Sandi Baru</span>
              </button>
            </div>
          </form>
        </div>

        {/* ========================================================================= */}
        {/* BAGIAN 3: INFORMASI PRIBADI & KONTAK AKUN */}
        {/* ========================================================================= */}
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Informasi Data Diri & Kontak Akun {roleName}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={nama}
                onChange={e => setNama(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {currentUser?.role === 'guru' ? 'NIP (Nomor Induk Pegawai)' : 'NISN (Nomor Induk Siswa Nasional)'}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@smpn2rebangtangkas.sch.id"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="0812-3456-7890"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-700">Foto Profil (Google Drive / Berkas)</label>
                {isGoogleDriveUrl(avatar) && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Link Google Drive Terkonversi
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={avatar}
                  onChange={e => {
                    const val = e.target.value;
                    setAvatar(normalizeImageUrl(val));
                  }}
                  placeholder="Tempel tautan Google Drive atau URL foto..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                />
                <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition flex items-center gap-1 shrink-0 border border-slate-200">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pilih Berkas</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const dataUrl = await compressImageFile(file, 600, 0.85);
                          setAvatar(dataUrl);
                        } catch (err) {
                          alert('Gagal memproses berkas foto');
                        }
                      }
                    }}
                  />
                </label>
              </div>

              {/* Preview */}
              {avatar && (
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 ring-2 ring-blue-500/20 shrink-0 flex items-center justify-center">
                    <AdaptiveImage
                      src={avatar}
                      fallbackSrc={currentUser?.role === 'guru' ? DEFAULT_AVATAR : DEFAULT_STUDENT_AVATAR}
                      alt="Pratinjau Foto"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <span className="font-bold text-slate-800 block">Foto Profil Siap Diterapkan</span>
                    <span className="text-slate-500">Mendukung tautan Google Drive dan penyesuaian rasio proporsional.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold cursor-pointer transition shadow-xs"
            >
              Simpan Perubahan Profil
            </button>
          </div>
        </form>

        {/* Reset Database to Factory defaults */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-red-600">
              Reset Data Sistem ke Bawaan
            </h3>
            <p className="text-[11px] text-slate-500">
              Mengembalikan seluruh data SMPN 2 Rebang Tangkas ke setelan awal pabrik (sandi default: 123456).
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm('Yakin ingin mereset seluruh data kembali ke setelan default awal?')) {
                resetAllData();
                alert('Data berhasil direset.');
              }
            }}
            className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer self-start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
