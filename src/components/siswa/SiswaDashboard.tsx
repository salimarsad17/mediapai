import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { PhotoUploaderModal } from '../common/PhotoUploaderModal';
import { AdaptiveImage } from '../common/AdaptiveImage';
import {
  Sparkles,
  Camera,
  BookOpen,
  CalendarCheck,
  Award,
  Users,
  Megaphone,
  ArrowRight,
  TrendingUp,
  Gamepad2,
  CheckCircle2,
} from 'lucide-react';

export const SiswaDashboard: React.FC = () => {
  const {
    currentUser,
    updateCurrentUserProfile,
    schoolProfile,
    kelasList,
    siswaList,
    jurnalGuruList,
    absenSiswaList,
    pengumumanList,
    rekapNilaiList,
    bahanAjarList,
    setActiveSiswaMenu,
  } = useLms();

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState(currentUser?.avatar || '');

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (photoUrlInput.trim()) {
      updateCurrentUserProfile({ avatar: photoUrlInput.trim() });
      setIsPhotoModalOpen(false);
    }
  };

  // Student's own attendance
  const myAttendance = absenSiswaList.find(
    a => a.nama.toLowerCase() === currentUser?.name.toLowerCase()
  ) || {
    hadir: 71,
    ijin: 1,
    sakit: 0,
    alpa: 0,
    tanpaKeterangan: 0,
    totalPertemuan: 72,
    persentaseKehadiran: 98.6,
  };

  // Student's own grade recap
  const myGrades = rekapNilaiList.find(
    r => r.nama.toLowerCase() === currentUser?.name.toLowerCase()
  ) || rekapNilaiList[0];

  // Number of active tasks sent by Guru
  const sentTasksCount = bahanAjarList.filter(b => b.isSentToStudents).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Hero Card for Siswa */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-6 sm:p-8 shadow-xl border border-blue-400/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Student Profile Avatar with Google Drive & File Support */}
            <div className="relative group shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-4 ring-white/30 shadow-lg bg-blue-900/50">
              <AdaptiveImage
                src={currentUser?.avatar}
                fallbackSrc="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80"
                alt={currentUser?.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <button
                type="button"
                id="btn-change-siswa-photo"
                onClick={() => setIsPhotoModalOpen(true)}
                className="absolute inset-0 rounded-2xl bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition text-[11px] font-bold cursor-pointer backdrop-blur-2xs"
                title="Ganti Foto Profil Siswa (Google Drive / Berkas)"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                <span>Ganti Foto</span>
              </button>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold border border-blue-300/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>PORTAL SISWA AKTIF PAI</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Selamat Datang, {currentUser?.name}!
              </h1>
              <p className="text-sm font-semibold text-blue-200">
                Kelas {currentUser?.className || '7A'} • NISN: {currentUser?.identifier} • {schoolProfile.name}
              </p>
              <p className="text-xs text-blue-100 max-w-xl leading-relaxed pt-1">
                Jadilah pelajar muslim yang cerdas, tawadhu, dan berprestasi. Akses tugas interaktif, materi video, game cerdas cermat, serta pantau nilai belajarmu di sini.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveSiswaMenu('tugas_siswa')}
              className="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-blue-900" />
              <span>Kerjakan Tugas ({sentTasksCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSiswaMenu('rekap_nilai')}
              className="py-2.5 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Lihat Rekap Nilai</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Cards: Kehadiran Siswa, Jurnal Siswa, Pengumuman, Rekap Nilai Saya */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kehadiran */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Kehadiran Saya
            </span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">
              {myAttendance.persentaseKehadiran}%
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 mt-0.5 block">
              Hadir: {myAttendance.hadir} dari {myAttendance.totalPertemuan} KBM
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Tugas dari Guru */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Tugas Aktif
            </span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">
              {sentTasksCount}
            </span>
            <span className="text-[11px] font-semibold text-blue-600 mt-0.5 block">
              Telah Dikirim oleh Guru PAI
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Nilai Rerata Saya */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Rerata Nilai PAI
            </span>
            <span
              className={`text-3xl font-black mt-1 block ${
                myGrades.rerata >= 75 ? 'text-slate-900' : 'text-red-600'
              }`}
            >
              {myGrades.rerata}
            </span>
            <span className="text-[11px] font-semibold text-purple-600 mt-0.5 block">
              {myGrades.rerata >= 75 ? 'Tuntas KKM (≥75)' : 'Perlu Bimbingan (<75)'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Teman Sekelas */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Siswa Kelas {currentUser?.className || '7A'}
            </span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">
              {siswaList.filter(s => s.kelas === (currentUser?.className || '7A')).length || 32}
            </span>
            <span className="text-[11px] font-semibold text-indigo-600 mt-0.5 block">
              Rekan Belajar Sekelas
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Jurnal Pembelajaran Terkini & Pengumuman Sekolah */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Jurnal Pembelajaran Siswa */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Jurnal Pembelajaran Siswa Terkini
              </h2>
              <p className="text-xs text-slate-500">
                Catatan materi dan KBM Pendidikan Agama Islam kelasmu
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveSiswaMenu('tugas_siswa')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Buka Tugas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {jurnalGuruList.slice(0, 3).map(j => (
              <div
                key={j.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-xs transition space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-700">
                    Kelas {j.kelas} • {j.hariTanggal}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {j.absensiRingkasan}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{j.materi}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {j.kbm}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Pengumuman Sekolah */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Megaphone className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Pengumuman Sekolah & PAI
            </h2>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {pengumumanList.map(pg => (
              <div
                key={pg.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      pg.kategori === 'Penting'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {pg.kategori}
                  </span>
                  <span className="text-[10px] text-slate-400">{pg.tanggal}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900">{pg.judul}</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">{pg.isi}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Ganti Foto Siswa dengan Dukungan Google Drive & Berkas */}
      <PhotoUploaderModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentPhotoUrl={currentUser?.avatar}
        onSavePhoto={(newUrl) => {
          updateCurrentUserProfile({ avatar: newUrl });
        }}
        role="siswa"
        title="Ganti Foto Profil Siswa"
        subtitle="Mendukung tautan foto Google Drive atau unggah dari galeri/kamera."
      />
    </div>
  );
};
