import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { PhotoUploaderModal } from '../common/PhotoUploaderModal';
import { AdaptiveImage } from '../common/AdaptiveImage';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  FileSpreadsheet,
  Megaphone,
  Plus,
  BookOpen,
  Sparkles,
  Camera,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  School,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const GuruDashboard: React.FC = () => {
  const {
    currentUser,
    updateCurrentUserProfile,
    schoolProfile,
    kelasList,
    siswaList,
    jurnalGuruList,
    absenSiswaList,
    pengumumanList,
    addPengumuman,
    rekapNilaiList,
    setActiveGuruMenu,
    setActiveGuruSubMenu,
  } = useLms();

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState(currentUser?.avatar || '');
  const [isNewPengumumanOpen, setIsNewPengumumanOpen] = useState(false);
  const [judulPengumuman, setJudulPengumuman] = useState('');
  const [isiPengumuman, setIsiPengumuman] = useState('');
  const [kategoriPengumuman, setKategoriPengumuman] = useState<'Penting' | 'Akademik' | 'Kegiatan Islami' | 'Umum'>('Akademik');

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (photoUrlInput.trim()) {
      updateCurrentUserProfile({ avatar: photoUrlInput.trim() });
      setIsPhotoModalOpen(false);
    }
  };

  const handleCreatePengumuman = (e: React.FormEvent) => {
    e.preventDefault();
    if (judulPengumuman.trim() && isiPengumuman.trim()) {
      addPengumuman({
        judul: judulPengumuman.trim(),
        isi: isiPengumuman.trim(),
        tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        penulis: currentUser?.name || 'Guru PAI',
        kategori: kategoriPengumuman,
        prioritas: 'Normal',
      });
      setJudulPengumuman('');
      setIsiPengumuman('');
      setIsNewPengumumanOpen(false);
    }
  };

  // Student counts per class
  const classBreakdown = kelasList.map(k => {
    const count = siswaList.filter(s => s.kelas === k.kelas).length;
    return {
      kelas: k.kelas,
      tingkat: k.tingkat,
      wali: k.waliKelas,
      count: count > 0 ? count : k.jumlahSiswa,
    };
  });

  const totalSiswaCount = classBreakdown.reduce((acc, curr) => acc + curr.count, 0);

  // Attendance stats
  const avgAttendance =
    absenSiswaList.length > 0
      ? (
          absenSiswaList.reduce((acc, curr) => acc + curr.persentaseKehadiran, 0) /
          absenSiswaList.length
        ).toFixed(1)
      : '98.5';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Futuristic Colorful Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-6 sm:p-8 shadow-xl border border-blue-400/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Guru Profile Avatar with Change Button */}
            <div className="relative group shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-4 ring-white/30 shadow-lg bg-blue-900/50">
              <AdaptiveImage
                src={currentUser?.avatar}
                fallbackSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
                alt={currentUser?.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <button
                type="button"
                id="btn-change-guru-photo"
                onClick={() => setIsPhotoModalOpen(true)}
                className="absolute inset-0 rounded-2xl bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition text-[11px] font-bold cursor-pointer backdrop-blur-2xs"
                title="Ganti Foto Profil (Google Drive / Berkas)"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                <span>Ganti Foto</span>
              </button>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold border border-blue-300/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>PORTAL GURU PAI & BUDI PEKERTI</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Ahlan wa Sahlan, {currentUser?.name}
              </h1>
              <p className="text-sm font-semibold text-blue-200">
                {schoolProfile.name} • NIP: {currentUser?.identifier}
              </p>
              <p className="text-xs text-blue-100 max-w-xl leading-relaxed pt-1">
                Selamat mengabdi mendidik tunas bangsa. Kelola data sekolah, susun perangkat kurikulum merdeka, pantau jurnal siswa, dan rekap nilai secara real-time.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveGuruMenu('perangkat');
                setActiveGuruSubMenu('bahan_ajar_ai');
              }}
              className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-900" />
              <span>Bahan Ajar AI & Game</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveGuruMenu('rekap_nilai')}
              className="py-2.5 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Rekab Nilai Siswa</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Siswa */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Siswa Terdata
            </span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">
              {totalSiswaCount}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 mt-0.5 block">
              6 Rombel Paralel (7, 8, 9)
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Kehadiran */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Rerata Kehadiran Siswa
            </span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">
              {avgAttendance}%
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 mt-0.5 block">
              Rekapitulasi 6 Bulan Berjalan
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Jurnal Guru */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Jurnal Pembelajaran
            </span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">
              {jurnalGuruList.length}
            </span>
            <span className="text-[11px] font-semibold text-blue-600 mt-0.5 block">
              Catatan KBM & Refleksi Aktif
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Ketuntasan KKM */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Target KKM (75)
            </span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">
              {rekapNilaiList.filter(r => r.rerata >= 75).length} / {rekapNilaiList.length}
            </span>
            <span className="text-[11px] font-semibold text-purple-600 mt-0.5 block">
              Siswa Mencapai Nilai Tuntas
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Jumlah Data Siswa Perkelas & Pengumuman Sekolah */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Data Jumlah Siswa Perkelas */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Jumlah Data Siswa Per Kelas (Paralel)
              </h2>
              <p className="text-xs text-slate-500">
                Distribusi rombel Kelas 7, Kelas 8, dan Kelas 9 UPT SMPN 2 Rebang Tangkas
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveGuruMenu('data');
                setActiveGuruSubMenu('data_siswa');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Kelola Siswa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {classBreakdown.map(cls => (
              <div
                key={cls.kelas}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 transition group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-black text-xs">
                    Kelas {cls.kelas}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    Tingkat {cls.tingkat}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 group-hover:text-blue-700 transition">
                  {cls.count} <span className="text-xs font-semibold text-slate-500">Siswa</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate mt-1">
                  Wali: {cls.wali}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Summary Banner of Journal & Attendance */}
          <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Jurnal KBM Terakhir:</span>
                <span className="text-slate-600">
                  {jurnalGuruList[0]?.materi || 'Bab 1: Asmaul Husna'} ({jurnalGuruList[0]?.kelas || '7A'})
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveGuruMenu('perangkat');
                setActiveGuruSubMenu('jurnal_guru');
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition shrink-0 cursor-pointer"
            >
              Lihat Jurnal Guru
            </button>
          </div>
        </div>

        {/* Right Column: Pengumuman Sekolah (dengan Tombol Tambah) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Pengumuman & Info PAI
                </h2>
              </div>
              <button
                type="button"
                id="btn-tambah-pengumuman"
                onClick={() => setIsNewPengumumanOpen(true)}
                className="py-1 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Baru</span>
              </button>
            </div>

            <div className="space-y-3 mt-4 max-h-[380px] overflow-y-auto pr-1">
              {pengumumanList.map(pg => (
                <div
                  key={pg.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-xs transition space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        pg.kategori === 'Penting'
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : pg.kategori === 'Kegiatan Islami'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {pg.kategori}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {pg.tanggal}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 leading-snug">
                    {pg.judul}
                  </h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                    {pg.isi}
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    Oleh: {pg.penulis}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Ganti Foto Profil Guru dengan Dukungan Google Drive & Berkas */}
      <PhotoUploaderModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentPhotoUrl={currentUser?.avatar}
        onSavePhoto={(newUrl) => {
          updateCurrentUserProfile({ avatar: newUrl });
        }}
        role="guru"
        title="Ganti Foto Profil Guru"
        subtitle="Mendukung tautan Google Drive dan unggah berkas langsung dari perangkat."
      />

      {/* Modal: Buat Pengumuman Baru */}
      {isNewPengumumanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Buat Pengumuman Sekolah / PAI Baru
            </h3>

            <form onSubmit={handleCreatePengumuman} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  value={judulPengumuman}
                  onChange={e => setJudulPengumuman(e.target.value)}
                  placeholder="Contoh: Jadwal Praktik Sholat Idul Adha..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kategori
                </label>
                <select
                  value={kategoriPengumuman}
                  onChange={e => setKategoriPengumuman(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Akademik">Akademik</option>
                  <option value="Kegiatan Islami">Kegiatan Islami</option>
                  <option value="Penting">Penting</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Pengumuman
                </label>
                <textarea
                  rows={4}
                  value={isiPengumuman}
                  onChange={e => setIsiPengumuman(e.target.value)}
                  placeholder="Tuliskan detail pengumuman secara jelas untuk siswa dan guru..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewPengumumanOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                >
                  Publikasikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
