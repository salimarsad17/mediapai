import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import {
  Briefcase,
  Sparkles,
  BookOpen,
  CalendarCheck,
  HeartHandshake,
  UserCheck,
  Plus,
  Trash2,
  Edit2,
  Send,
  CheckCircle2,
  Download,
  Upload,
  FileText,
  Gamepad2,
  Video,
  Layers,
  HelpCircle,
  FileQuestion,
  Camera,
} from 'lucide-react';
import {
  PerangkatAjarItem,
  BahanAjarItem,
  JurnalGuruItem,
  JurnalSikapItem,
  AbsenSiswaItem,
  GuruWaliItem,
} from '../../types';
import { AdaptiveImage } from '../common/AdaptiveImage';
import {
  normalizeImageUrl,
  isGoogleDriveUrl,
  compressImageFile,
} from '../../utils/imageUtils';

export const PerangkatGuruView: React.FC = () => {
  const {
    activeGuruSubMenu,
    setActiveGuruSubMenu,
    perangkatAjarList,
    addPerangkatAjar,
    updatePerangkatAjar,
    deletePerangkatAjar,
    bahanAjarList,
    addBahanAjar,
    updateBahanAjar,
    deleteBahanAjar,
    toggleKirimKeSiswa,
    jurnalGuruList,
    addJurnalGuru,
    updateJurnalGuru,
    deleteJurnalGuru,
    jurnalSikapList,
    addJurnalSikap,
    updateJurnalSikap,
    deleteJurnalSikap,
    absenSiswaList,
    addAbsenSiswa,
    updateAbsenSiswa,
    deleteAbsenSiswa,
    guruWaliList,
    addGuruWali,
    updateGuruWali,
    deleteGuruWali,
    siswaList,
    kelasList,
    selectedSemester,
    setSelectedSemester,
    selectedGrade,
    setSelectedGrade,
    schoolProfile,
  } = useLms();

  // Export handlers
  const handleExportDoc = (type: string, format: 'PDF' | 'Word' | 'Excel') => {
    alert(
      `Mengekspor berkas ${type} ${selectedSemester} dalam format .${format.toLowerCase()} untuk ${schoolProfile.name}. File siap dicetak dan diarsipkan.`
    );
  };

  // Modals state
  const [isPerangkatModalOpen, setIsPerangkatModalOpen] = useState(false);
  const [perangkatForm, setPerangkatForm] = useState({
    jenis: 'Modul Ajar' as any,
    judul: '',
    tingkat: '7' as any,
    deskripsi: '',
    konten: '',
    keterangan: 'Kurikulum Merdeka CP 2026',
    tanggalUpdate: new Date().toISOString().split('T')[0],
  });

  const [isBahanModalOpen, setIsBahanModalOpen] = useState(false);
  const [bahanForm, setBahanForm] = useState({
    judul: '',
    tipe: 'materi' as any,
    tingkat: '7' as any,
    deskripsi: '',
    kontenUtama: '',
    mediaUrl: '',
    durasiMenit: 30,
    bobotNilai: 100,
    targetKelas: ['7A', '7B'],
    isSentToStudents: false,
  });

  const [isJurnalModalOpen, setIsJurnalModalOpen] = useState(false);
  const [jurnalForm, setJurnalForm] = useState({
    hariTanggal: 'Senin, ' + new Date().toLocaleDateString('id-ID'),
    kelas: '7A',
    tingkat: '7' as any,
    materi: '',
    kbm: '',
    absensiRingkasan: 'Hadir: 31, Sakit: 1, Izin: 0, Alpa: 0',
    catatanRefleksi: '',
    siswaHadirCount: 31,
    siswaTotalCount: 32,
  });

  const [isSikapModalOpen, setIsSikapModalOpen] = useState(false);
  const [sikapForm, setSikapForm] = useState({
    hariTanggal: 'Senin, ' + new Date().toLocaleDateString('id-ID'),
    kelas: '7A',
    tingkat: '7' as any,
    siswaId: '',
    namaSiswa: '',
    nisNisn: '',
    kategoriSikap: 'Spiritual' as 'Spiritual' | 'Sosial',
    butirSikap: 'Ketaatan Beribadah & Keteladanan Sholat',
    kejadian: '',
    penyelesaian: '',
    tindakLanjutStatus: 'Selesai' as any,
  });

  const [isWaliModalOpen, setIsWaliModalOpen] = useState(false);
  const [waliForm, setWaliForm] = useState({
    hariTanggal: 'Jumat, ' + new Date().toLocaleDateString('id-ID'),
    kelas: '7A',
    tingkat: '7' as any,
    siswaId: '',
    namaSiswa: '',
    nisNisn: '',
    kegiatan: 'Bimbingan Konseling & Motivasi Belajar',
    foto: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&auto=format&fit=crop&q=80',
    catatanWali: '',
    hasilPembinaan: 'Siswa menunjukkan peningkatan motivasi dan komitmen kedisiplinan.',
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Submenu Tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-1.5 text-xs font-bold">
        {[
          { id: 'perangkat_ajar', label: 'Perangkat Ajar (CP/ATP)', icon: BookOpen },
          { id: 'bahan_ajar_ai', label: 'BAHAN AJAR AI & GAME', icon: Sparkles },
          { id: 'jurnal_guru', label: 'JURNAL GURU', icon: Briefcase },
          { id: 'jurnal_sikap', label: 'JURNAL SIKAP', icon: HeartHandshake },
          { id: 'absen_siswa', label: 'Absen SISWA (6 Bulan)', icon: CalendarCheck },
          { id: 'guru_wali', label: 'Guru Wali', icon: UserCheck },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeGuruSubMenu === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              id={`tab-perangkat-${tab.id}`}
              onClick={() => setActiveGuruSubMenu(tab.id)}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-xl transition cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Global Filter Bar for Semester & Grade */}
      <div className="bg-blue-50/80 border border-blue-200 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Pilih Semester:</span>
          {(['Semester 1 (Ganjil)', 'Semester 2 (Genap)'] as const).map(sem => (
            <button
              key={sem}
              type="button"
              onClick={() => setSelectedSemester(sem)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                selectedSemester === sem
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-blue-100 border border-slate-200'
              }`}
            >
              {sem}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Tingkat:</span>
          {(['Semua', '7', '8', '9'] as const).map(lvl => (
            <button
              key={lvl}
              type="button"
              onClick={() => setSelectedGrade(lvl)}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                selectedGrade === lvl
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {lvl === 'Semua' ? 'Semua Kelas' : `Kelas ${lvl}`}
            </button>
          ))}
        </div>
      </div>

      {/* 1. PERANGKAT AJAR (CP, ATP, Modul Ajar, KKTP) */}
      {activeGuruSubMenu === 'perangkat_ajar' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Perangkat Ajar Guru (CP, ATP, Modul Ajar, KKTP)
              </h2>
              <p className="text-xs text-slate-500">
                Kurikulum Merdeka PAI SMPN 2 Rebang Tangkas - {selectedSemester}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleExportDoc('Perangkat Ajar', 'Word')}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Word / PDF</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPerangkatForm({
                    jenis: 'Modul Ajar',
                    judul: '',
                    tingkat: '7',
                    deskripsi: '',
                    konten: '',
                    keterangan: 'Kurikulum Merdeka CP 2026',
                    tanggalUpdate: new Date().toISOString().split('T')[0],
                  });
                  setIsPerangkatModalOpen(true);
                }}
                className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Perangkat</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {perangkatAjarList
              .filter(p => (selectedGrade === 'Semua' ? true : p.tingkat === selectedGrade))
              .map(p => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-md transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase ${
                          p.jenis === 'CP'
                            ? 'bg-blue-100 text-blue-800'
                            : p.jenis === 'ATP'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.jenis === 'Modul Ajar'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.jenis} • KELAS {p.tingkat}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {p.tanggalUpdate}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {p.judul}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {p.deskripsi}
                    </p>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700 max-h-28 overflow-y-auto whitespace-pre-line">
                      {p.konten}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">{p.keterangan}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Yakin hapus perangkat ajar ${p.judul}?`)) {
                          deletePerangkatAjar(p.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                      title="Hapus Perangkat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 2. BAHAN AJAR AI (Materi, Video, Game Battle, TTS, Puzzle, LKPD, LMS + Kirim ke Siswa) */}
      {activeGuruSubMenu === 'bahan_ajar_ai' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>INTEGRASI BAHAN AJAR AI & GAME INTERAKTIF</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">
                BAHAN AJAR AI (Materi, Video, Game Battle, TTS, Puzzle, LKPD, LMS)
              </h2>
              <p className="text-xs text-slate-500">
                Setelah dibuat oleh guru, klik tombol <strong>"Kirim ke Siswa"</strong> agar muncul dan bisa dikerjakan di portal Siswa!
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setBahanForm({
                  judul: '',
                  tipe: 'materi',
                  tingkat: '7',
                  deskripsi: '',
                  kontenUtama: '',
                  mediaUrl: '',
                  durasiMenit: 30,
                  bobotNilai: 100,
                  targetKelas: ['7A', '7B'],
                  isSentToStudents: false,
                });
                setIsBahanModalOpen(true);
              }}
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Bahan Ajar Baru</span>
            </button>
          </div>

          {/* List of Bahan Ajar Cards with Kirim ke Siswa Toggle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bahanAjarList
              .filter(b => (selectedGrade === 'Semua' ? true : b.tingkat === selectedGrade))
              .map(b => (
                <div
                  key={b.id}
                  className={`p-5 rounded-2xl border transition space-y-3.5 flex flex-col justify-between ${
                    b.isSentToStudents
                      ? 'border-emerald-300 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-200 bg-slate-50/70 hover:bg-white'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 flex items-center gap-1">
                        {b.tipe === 'game_battle' && <Gamepad2 className="w-3 h-3 text-blue-600" />}
                        {b.tipe === 'video' && <Video className="w-3 h-3 text-red-600" />}
                        {b.tipe === 'tts' && <Layers className="w-3 h-3 text-indigo-600" />}
                        {b.tipe === 'puzzle' && <FileQuestion className="w-3 h-3 text-amber-600" />}
                        {b.tipe.toUpperCase()} • KELAS {b.tingkat}
                      </span>

                      {/* Status Terkirim ke Siswa Badge */}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                          b.isSentToStudents
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {b.isSentToStudents ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Terkirim ke Siswa</span>
                          </>
                        ) : (
                          <span>Draft Guru (Belum Dikirim)</span>
                        )}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {b.judul}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {b.deskripsi}
                    </p>

                    {b.mediaUrl && (
                      <div className="p-2 rounded-xl bg-slate-100 text-[11px] font-mono text-blue-600 truncate">
                        Media: {b.mediaUrl}
                      </div>
                    )}
                  </div>

                  {/* Actions & "Kirim ke Siswa" Button */}
                  <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      id={`btn-kirim-${b.id}`}
                      onClick={() => toggleKirimKeSiswa(b.id)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                        b.isSentToStudents
                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/30'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{b.isSentToStudents ? 'Tarik Kembali (Draft)' : 'Kirim ke Siswa'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Yakin hapus bahan ajar ${b.judul}?`)) {
                            deleteBahanAjar(b.id);
                          }
                        }}
                        className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition"
                        title="Hapus Bahan Ajar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 3. JURNAL GURU (Smt 1 & 2, kls 7,8,9 dari data siswa, unduh PDF/Word, CRUD) */}
      {activeGuruSubMenu === 'jurnal_guru' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                JURNAL GURU ({selectedSemester})
              </h2>
              <p className="text-xs text-slate-500">
                Pilih hari/tanggal, kelas, materi, KBM, absensi, catatan guru/refleksi
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleExportDoc('Jurnal Guru', 'Word')}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Word / PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setIsJurnalModalOpen(true)}
                className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Jurnal KBM</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {jurnalGuruList
              .filter(j => (selectedGrade === 'Semua' ? true : j.tingkat === selectedGrade))
              .map(j => (
                <div
                  key={j.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-xs transition space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-black text-xs">
                        Kelas {j.kelas}
                      </span>
                      <span className="font-bold text-slate-700 text-xs">
                        {j.hariTanggal}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {j.absensiRingkasan}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">{j.materi}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Kegiatan KBM:</strong> {j.kbm}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      <strong className="text-slate-800">Refleksi / Catatan Guru:</strong> {j.catatanRefleksi}
                    </p>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Yakin hapus jurnal tanggal ${j.hariTanggal}?`)) {
                          deleteJurnalGuru(j.id);
                        }
                      }}
                      className="p-1 rounded-lg text-red-600 hover:bg-red-50 text-xs flex items-center gap-1 font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Jurnal</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. JURNAL SIKAP (Smt 1 & 2, kls 7,8,9, nama, nis/nisn, kejadian, penyelesaian, unduh PDF/Word, CRUD) */}
      {activeGuruSubMenu === 'jurnal_sikap' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                JURNAL SIKAP SISWA ({selectedSemester})
              </h2>
              <p className="text-xs text-slate-500">
                Pilih semua kelas, nama, nis/nisn, hari/tanggal, kejadian dan penyelesaian
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleExportDoc('Jurnal Sikap', 'Word')}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Word / PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSikapModalOpen(true)}
                className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Catat Kejadian Sikap</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Hari / Tanggal</th>
                  <th className="py-3 px-4">Nama Siswa & NISN</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Kategori & Butir Sikap</th>
                  <th className="py-3 px-4">Kejadian & Penyelesaian</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jurnalSikapList
                  .filter(s => (selectedGrade === 'Semua' ? true : s.tingkat === selectedGrade))
                  .map((s, idx) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 text-center font-bold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {s.hariTanggal}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{s.namaSiswa}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{s.nisNisn}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-700">
                        {s.kelas}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 mb-0.5">
                          {s.kategoriSikap}
                        </span>
                        <span className="block font-semibold text-slate-800">{s.butirSikap}</span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-slate-800 leading-snug">{s.kejadian}</p>
                        <p className="text-emerald-700 font-semibold mt-1">
                          Solusi: {s.penyelesaian}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Yakin hapus catatan sikap ${s.namaSiswa}?`)) {
                              deleteJurnalSikap(s.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                          title="Hapus Catatan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. ABSEN SISWA (Tampilan Enam Bulan: No, Nama, Kelas, Izin, Sakit, Alpa, Tanpa Keterangan, Total Kehadiran, Unduh PDF/Excel, CRUD) */}
      {activeGuruSubMenu === 'absen_siswa' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Absensi Siswa (Tampilan Rekapitulasi Enam Bulan)
              </h2>
              <p className="text-xs text-slate-500">
                No, Nama, Kelas, Izin, Sakit, Alpa, Tanpa Keterangan, dan Jumlah Kehadiran (%)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleExportDoc('Rekap Absensi 6 Bulan', 'Excel')}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF / Excel</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">No</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-3 text-center">Kelas</th>
                  <th className="py-3 px-3 text-center">Hadir</th>
                  <th className="py-3 px-3 text-center text-blue-700">Izin</th>
                  <th className="py-3 px-3 text-center text-amber-700">Sakit</th>
                  <th className="py-3 px-3 text-center text-red-600">Alpa</th>
                  <th className="py-3 px-3 text-center text-slate-600">Tanpa Ket</th>
                  <th className="py-3 px-4 text-center">Kehadiran (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {absenSiswaList
                  .filter(a => (selectedGrade === 'Semua' ? true : a.tingkat === selectedGrade))
                  .map((a, idx) => (
                    <tr key={a.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3 text-center font-bold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {a.nama}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-blue-700">
                        {a.kelas}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-emerald-700">
                        {a.hadir}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-blue-700">
                        {a.ijin}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-amber-700">
                        {a.sakit}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-red-600">
                        {a.alpa}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-500">
                        {a.tanpaKeterangan}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full font-black text-xs bg-emerald-100 text-emerald-800">
                          {a.persentaseKehadiran}%
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. GURU WALI (Pilih kelas, nama, nis/nisn, hari/tanggal, kegiatan, foto, unduh PDF/Word, CRUD) */}
      {activeGuruSubMenu === 'guru_wali' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Catatan Bimbingan Guru Wali ({selectedSemester})
              </h2>
              <p className="text-xs text-slate-500">
                Pilih semua kelas, nama, nis/nisn, hari/tanggal, kegiatan, dan foto dokumentasi pembinaan
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleExportDoc('Catatan Guru Wali', 'Word')}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Word / PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setIsWaliModalOpen(true)}
                className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Bimbingan Wali</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guruWaliList
              .filter(w => (selectedGrade === 'Semua' ? true : w.tingkat === selectedGrade))
              .map(w => (
                <div
                  key={w.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-xs transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-black text-xs">
                        Kelas {w.kelas}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {w.hariTanggal}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-20 h-20 rounded-xl overflow-hidden ring-1 ring-slate-300 shrink-0 bg-slate-100 flex items-center justify-center">
                        <AdaptiveImage
                          src={w.foto}
                          alt={w.kegiatan}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="font-black text-slate-900 text-sm block">
                          {w.namaSiswa}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {w.nisNisn}
                        </span>
                        <h4 className="text-xs font-bold text-blue-700">
                          {w.kegiatan}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                      <strong>Catatan Wali:</strong> {w.catatanWali}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Yakin hapus catatan bimbingan ${w.namaSiswa}?`)) {
                          deleteGuruWali(w.id);
                        }
                      }}
                      className="p-1 rounded-lg text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* MODAL: Tambah Bahan Ajar AI */}
      {isBahanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Buat Bahan Ajar AI & Game Interaktif
            </h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                addBahanAjar({
                  ...bahanForm,
                  semester: selectedSemester,
                });
                setIsBahanModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Bahan Ajar</label>
                <input
                  type="text"
                  value={bahanForm.judul}
                  onChange={e => setBahanForm({ ...bahanForm, judul: e.target.value })}
                  placeholder="Contoh: Game Battle: Cepat Cermat Rukun Islam..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipe Bahan</label>
                  <select
                    value={bahanForm.tipe}
                    onChange={e => setBahanForm({ ...bahanForm, tipe: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="materi">Materi Pelajaran</option>
                    <option value="video">Video Pembelajaran</option>
                    <option value="game_battle">Game Battle (Kuis Cermat)</option>
                    <option value="tts">Teka-Teki Silang (TTS)</option>
                    <option value="puzzle">Puzzle Susun Ayat</option>
                    <option value="lkpd">LKPD Lembar Kerja</option>
                    <option value="lms">LMS Diskusi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tingkat Kelas</label>
                  <select
                    value={bahanForm.tingkat}
                    onChange={e => setBahanForm({ ...bahanForm, tingkat: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="7">Kelas 7</option>
                    <option value="8">Kelas 8</option>
                    <option value="9">Kelas 9</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={bahanForm.deskripsi}
                  onChange={e => setBahanForm({ ...bahanForm, deskripsi: e.target.value })}
                  placeholder="Instruksi dan petunjuk pengerjaan bagi siswa..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Konten Utama / Materi Pembelajaran</label>
                <textarea
                  rows={4}
                  value={bahanForm.kontenUtama}
                  onChange={e => setBahanForm({ ...bahanForm, kontenUtama: e.target.value })}
                  placeholder="Tuliskan naskah materi, soal kuis battle, atau pertanyaan LKPD..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBahanModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Bahan Ajar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Tambah Jurnal Guru */}
      {isJurnalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Tambah Catatan Jurnal Pembelajaran Guru
            </h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                addJurnalGuru({
                  ...jurnalForm,
                  semester: selectedSemester,
                });
                setIsJurnalModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hari & Tanggal</label>
                  <input
                    type="text"
                    value={jurnalForm.hariTanggal}
                    onChange={e => setJurnalForm({ ...jurnalForm, hariTanggal: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas</label>
                  <select
                    value={jurnalForm.kelas}
                    onChange={e => {
                      const k = kelasList.find(x => x.kelas === e.target.value);
                      setJurnalForm({
                        ...jurnalForm,
                        kelas: e.target.value,
                        tingkat: k ? k.tingkat : '7',
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {kelasList.map(k => (
                      <option key={k.id} value={k.kelas}>
                        Kelas {k.kelas}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Materi Pembelajaran</label>
                <input
                  type="text"
                  value={jurnalForm.materi}
                  onChange={e => setJurnalForm({ ...jurnalForm, materi: e.target.value })}
                  placeholder="Bab 1: Asmaul Husna Al-Alim & Al-Khabir"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kegiatan Belajar Mengajar (KBM)</label>
                <textarea
                  rows={3}
                  value={jurnalForm.kbm}
                  onChange={e => setJurnalForm({ ...jurnalForm, kbm: e.target.value })}
                  placeholder="Uraian langkah pembelajaran..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Refleksi Guru</label>
                <textarea
                  rows={2}
                  value={jurnalForm.catatanRefleksi}
                  onChange={e => setJurnalForm({ ...jurnalForm, catatanRefleksi: e.target.value })}
                  placeholder="Refleksi tindak lanjut kelas..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJurnalModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Tambah Jurnal Sikap */}
      {isSikapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Catat Jurnal Sikap Siswa
            </h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                addJurnalSikap({
                  ...sikapForm,
                  semester: selectedSemester,
                });
                setIsSikapModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Siswa (Dari Data Siswa)</label>
                <select
                  value={sikapForm.siswaId}
                  onChange={e => {
                    const found = siswaList.find(s => s.id === e.target.value);
                    if (found) {
                      setSikapForm({
                        ...sikapForm,
                        siswaId: found.id,
                        namaSiswa: found.nama,
                        nisNisn: `${found.nis} / ${found.nisn}`,
                        kelas: found.kelas,
                        tingkat: found.tingkat,
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">-- Pilih Siswa --</option>
                  {siswaList.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.kelas} - {s.nisn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Sikap</label>
                  <select
                    value={sikapForm.kategoriSikap}
                    onChange={e => setSikapForm({ ...sikapForm, kategoriSikap: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Spiritual">Spiritual (Ibadah & Doa)</option>
                    <option value="Sosial">Sosial (Jujur, Disiplin, Tolong Menolong)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Butir Sikap</label>
                  <input
                    type="text"
                    value={sikapForm.butirSikap}
                    onChange={e => setSikapForm({ ...sikapForm, butirSikap: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kejadian yang Terjadi</label>
                <textarea
                  rows={2}
                  value={sikapForm.kejadian}
                  onChange={e => setSikapForm({ ...sikapForm, kejadian: e.target.value })}
                  placeholder="Uraikan perbuatan positif atau pelanggaran sikap..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Penyelesaian / Tindak Lanjut Guru</label>
                <textarea
                  rows={2}
                  value={sikapForm.penyelesaian}
                  onChange={e => setSikapForm({ ...sikapForm, penyelesaian: e.target.value })}
                  placeholder="Apresiasi atau pembinaan yang diberikan guru..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSikapModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Jurnal Sikap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Tambah Guru Wali */}
      {isWaliModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Tambah Catatan Pembinaan Guru Wali
            </h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                addGuruWali({
                  ...waliForm,
                  semester: selectedSemester,
                });
                setIsWaliModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Siswa (Dari Data Siswa)</label>
                <select
                  value={waliForm.siswaId}
                  onChange={e => {
                    const found = siswaList.find(s => s.id === e.target.value);
                    if (found) {
                      setWaliForm({
                        ...waliForm,
                        siswaId: found.id,
                        namaSiswa: found.nama,
                        nisNisn: `${found.nis} / ${found.nisn}`,
                        kelas: found.kelas,
                        tingkat: found.tingkat,
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">-- Pilih Siswa --</option>
                  {siswaList.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.kelas} - {s.nisn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kegiatan Bimbingan / Perwalian</label>
                <input
                  type="text"
                  value={waliForm.kegiatan}
                  onChange={e => setWaliForm({ ...waliForm, kegiatan: e.target.value })}
                  placeholder="Konseling mandiri / pembinaan hafalan Al-Qur'an..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700">Foto Dokumentasi (Google Drive / Berkas)</label>
                  {isGoogleDriveUrl(waliForm.foto) && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Link Google Drive Terkonversi
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={waliForm.foto}
                    onChange={e => {
                      const val = e.target.value;
                      setWaliForm({ ...waliForm, foto: normalizeImageUrl(val) });
                    }}
                    placeholder="Tempel tautan Google Drive atau URL foto..."
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
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
                            const dataUrl = await compressImageFile(file, 800, 0.85);
                            setWaliForm({ ...waliForm, foto: dataUrl });
                          } catch (err) {
                            alert('Gagal memproses berkas foto');
                          }
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Live Preview */}
                {waliForm.foto && (
                  <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 ring-2 ring-blue-500/20 shrink-0 flex items-center justify-center">
                      <AdaptiveImage
                        src={waliForm.foto}
                        alt="Pratinjau Dokumentasi"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="text-[11px] text-slate-600">
                      <span className="font-bold text-slate-800 block">Foto Dokumentasi Siap</span>
                      <span className="text-slate-500">Gambar otomatis menyesuaikan proporsi horizontal/vertikal.</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Wali Kelas</label>
                <textarea
                  rows={2}
                  value={waliForm.catatanWali}
                  onChange={e => setWaliForm({ ...waliForm, catatanWali: e.target.value })}
                  placeholder="Catatan perkembangan karakter dan akademis..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWaliModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
