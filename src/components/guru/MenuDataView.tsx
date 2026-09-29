import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import {
  School,
  Users,
  GraduationCap,
  Layers,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Download,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Building2,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { GuruItem, KelasItem, SiswaItem } from '../../types';
import { AdaptiveImage } from '../common/AdaptiveImage';
import {
  normalizeImageUrl,
  isGoogleDriveUrl,
  compressImageFile,
  DEFAULT_AVATAR,
} from '../../utils/imageUtils';

export const MenuDataView: React.FC = () => {
  const {
    activeGuruSubMenu,
    setActiveGuruSubMenu,
    schoolProfile,
    updateSchoolProfile,
    guruList,
    addGuru,
    updateGuru,
    deleteGuru,
    kelasList,
    addKelas,
    updateKelas,
    deleteKelas,
    siswaList,
    addSiswa,
    updateSiswa,
    deleteSiswa,
    importSiswaBulk,
    selectedSemester,
    setSelectedSemester,
    selectedGrade,
    setSelectedGrade,
  } = useLms();

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editedVisi, setEditedVisi] = useState(schoolProfile.visi);
  const [editedSejarah, setEditedSejarah] = useState(schoolProfile.sejarah);

  // Modals for CRUD
  const [isGuruModalOpen, setIsGuruModalOpen] = useState(false);
  const [editingGuru, setEditingGuru] = useState<GuruItem | null>(null);
  const [guruForm, setGuruForm] = useState({
    nama: '',
    nip: '',
    mataPelajaran: '',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    pendidikan: 'S1 Pendidikan Agama Islam',
    statusKepegawaian: 'PNS',
  });

  const [isKelasModalOpen, setIsKelasModalOpen] = useState(false);
  const [editingKelas, setEditingKelas] = useState<KelasItem | null>(null);
  const [kelasForm, setKelasForm] = useState({
    kelas: '',
    tingkat: '7' as any,
    waliKelas: '',
    mataPelajaran: 'Pendidikan Agama Islam',
    jumlahSiswa: 32,
  });

  const [isSiswaModalOpen, setIsSiswaModalOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState<SiswaItem | null>(null);
  const [siswaForm, setSiswaForm] = useState({
    nama: '',
    nis: '',
    nisn: '',
    kelas: '7A',
    tingkat: '7' as any,
    jenisKelamin: 'L' as 'L' | 'P',
  });

  // Handlers for Guru CRUD
  const openAddGuru = () => {
    setEditingGuru(null);
    setGuruForm({
      nama: '',
      nip: '',
      mataPelajaran: 'Pendidikan Agama Islam & BP',
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      pendidikan: 'S1 Pendidikan Agama Islam',
      statusKepegawaian: 'PNS',
    });
    setIsGuruModalOpen(true);
  };

  const openEditGuru = (g: GuruItem) => {
    setEditingGuru(g);
    setGuruForm({
      nama: g.nama,
      nip: g.nip,
      mataPelajaran: g.mataPelajaran,
      foto: g.foto,
      pendidikan: g.pendidikan,
      statusKepegawaian: g.statusKepegawaian,
    });
    setIsGuruModalOpen(true);
  };

  const handleSaveGuru = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGuru) {
      updateGuru({ ...editingGuru, ...guruForm });
    } else {
      addGuru(guruForm);
    }
    setIsGuruModalOpen(false);
  };

  // Handlers for Kelas CRUD
  const openAddKelas = () => {
    setEditingKelas(null);
    setKelasForm({
      kelas: '7C',
      tingkat: '7',
      waliKelas: '',
      mataPelajaran: 'Pendidikan Agama Islam',
      jumlahSiswa: 30,
    });
    setIsKelasModalOpen(true);
  };

  const openEditKelas = (k: KelasItem) => {
    setEditingKelas(k);
    setKelasForm({
      kelas: k.kelas,
      tingkat: k.tingkat,
      waliKelas: k.waliKelas,
      mataPelajaran: k.mataPelajaran,
      jumlahSiswa: k.jumlahSiswa,
    });
    setIsKelasModalOpen(true);
  };

  const handleSaveKelas = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingKelas) {
      updateKelas({
        ...editingKelas,
        ...kelasForm,
        semester: selectedSemester,
      });
    } else {
      addKelas({
        ...kelasForm,
        semester: selectedSemester,
      });
    }
    setIsKelasModalOpen(false);
  };

  // Handlers for Siswa CRUD
  const openAddSiswa = () => {
    setEditingSiswa(null);
    setSiswaForm({
      nama: '',
      nis: '',
      nisn: '',
      kelas: kelasList[0]?.kelas || '7A',
      tingkat: '7',
      jenisKelamin: 'L',
    });
    setIsSiswaModalOpen(true);
  };

  const openEditSiswa = (s: SiswaItem) => {
    setEditingSiswa(s);
    setSiswaForm({
      nama: s.nama,
      nis: s.nis,
      nisn: s.nisn,
      kelas: s.kelas,
      tingkat: s.tingkat,
      jenisKelamin: s.jenisKelamin,
    });
    setIsSiswaModalOpen(true);
  };

  const handleSaveSiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSiswa) {
      updateSiswa({
        ...editingSiswa,
        ...siswaForm,
        semester: selectedSemester,
      });
    } else {
      addSiswa({
        ...siswaForm,
        semester: selectedSemester,
      });
    }
    setIsSiswaModalOpen(false);
  };

  // Simulated Excel/Word Upload & Download
  const handleUploadFile = (type: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls, .doc, .docx, .csv';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (file) {
        alert(`Berhasil mengunggah file ${file.name} untuk pembaruan ${type}. Data telah disinkronkan ke sistem.`);
      }
    };
    input.click();
  };

  const handleDownloadTemplate = (type: string) => {
    alert(`Mengunduh format template file Excel/Word untuk ${type}. Silakan lengkapi dan unggah kembali.`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Submenu Tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-1.5 text-xs font-bold">
        {[
          { id: 'profil_sekolah', label: 'PROFIL SEKOLAH', icon: Building2 },
          { id: 'profil_guru', label: 'Profil Guru', icon: Users },
          { id: 'data_sekolah', label: 'DATA SEKOLAH', icon: School },
          { id: 'data_kelas', label: 'Data Kelas (7,8,9)', icon: Layers },
          { id: 'data_siswa', label: 'DATA SISWA', icon: GraduationCap },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeGuruSubMenu === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              id={`tab-data-${tab.id}`}
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

      {/* Global Semester Filter Bar for Classes & Students */}
      {(activeGuruSubMenu === 'data_kelas' || activeGuruSubMenu === 'data_siswa') && (
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
            <span className="font-bold text-slate-700">Tingkat Kelas:</span>
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
                {lvl === 'Semua' ? 'Semua Tingkat' : `Kelas ${lvl}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 1. SUBMENU: PROFIL SEKOLAH */}
      {activeGuruSubMenu === 'profil_sekolah' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>IDENTITAS & KARAKTERISTIK SATUAN PENDIDIKAN</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                PROFIL SEKOLAH {schoolProfile.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Visi, Misi, dan Sejarah Singkat Perjalanan Sekolah
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditedVisi(schoolProfile.visi);
                setEditedSejarah(schoolProfile.sejarah);
                setIsEditProfileOpen(true);
              }}
              className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition self-start cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profil Visi & Misi</span>
            </button>
          </div>

          {/* VISI SEKOLAH Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-md space-y-2">
            <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">
              (VISI SEKOLAH)
            </span>
            <p className="text-xl sm:text-2xl font-black tracking-wide leading-snug">
              “{schoolProfile.visi}”
            </p>
            <p className="text-xs text-blue-100 pt-1">
              Menyelaraskan kecerdasan intelektual, kemajuan teknologi informasi, dan keluhuran akidah akhlakul karimah.
            </p>
          </div>

          {/* MISI SEKOLAH Card */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-black tracking-widest text-blue-700 uppercase block">
              (MISI SEKOLAH)
            </span>
            <ol className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              {schoolProfile.misi.map((m, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{m}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* SEJARAH SINGKAT SEKOLAH */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-black tracking-widest text-slate-900 uppercase block">
              SEJARAH SINGKAT SEKOLAH
            </span>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {schoolProfile.sejarah}
            </p>
          </div>
        </div>
      )}

      {/* 2. SUBMENU: PROFIL GURU */}
      {activeGuruSubMenu === 'profil_guru' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Profil Guru PAI & Tenaga Pendidik
              </h2>
              <p className="text-xs text-slate-500">
                No, Foto, Nama Lengkap, NIP, Mata Pelajaran, dan Status Kepegawaian
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleUploadFile('Profil Guru')}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Word/Excel</span>
              </button>
              <button
                type="button"
                onClick={openAddGuru}
                className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Guru</span>
              </button>
            </div>
          </div>

          {/* Table of Guru */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4 w-16 text-center">Foto</th>
                  <th className="py-3 px-4">Nama Lengkap & Gelar</th>
                  <th className="py-3 px-4">NIP / NUPTK</th>
                  <th className="py-3 px-4">Mata Pelajaran</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {guruList.map((g, idx) => (
                  <tr key={g.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-center font-bold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="w-10 h-10 rounded-xl overflow-hidden mx-auto ring-1 ring-slate-300 bg-slate-100 flex items-center justify-center">
                        <AdaptiveImage
                          src={g.foto}
                          fallbackSrc={DEFAULT_AVATAR}
                          alt={g.nama}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{g.nama}</span>
                      <span className="text-[11px] text-slate-500">{g.pendidikan}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {g.nip}
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-700">
                      {g.mataPelajaran}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditGuru(g)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Edit Guru"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Yakin hapus data guru ${g.nama}?`)) {
                              deleteGuru(g.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                          title="Hapus Guru"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SUBMENU: DATA SEKOLAH */}
      {activeGuruSubMenu === 'data_sekolah' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                DATA POKOK PENDIDIKAN SEKOLAH
              </h2>
              <p className="text-xs text-slate-500">
                Nama satuan pendidikan, Kepala Sekolah, NIP, NPSN, status, alamat, dan SK Izin Operasional
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleUploadFile('Data Pokok Sekolah')}
              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Dokumen SK</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
                Nama Satuan Pendidikan
              </span>
              <span className="font-black text-slate-900 text-base block">
                {schoolProfile.name}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
                NPSN (Nomor Pokok Sekolah Nasional)
              </span>
              <span className="font-black text-blue-700 font-mono text-base block">
                {schoolProfile.npsn}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
                Kepala Sekolah
              </span>
              <span className="font-bold text-slate-900 text-sm block">
                {schoolProfile.kepalaSekolah}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
                NIP Kepala Sekolah
              </span>
              <span className="font-mono text-slate-800 text-sm block">
                {schoolProfile.nipKepalaSekolah}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
                Status Satuan Pendidikan
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-xs">
                {schoolProfile.status}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
                SK Izin Operasional
              </span>
              <span className="font-mono text-slate-800 text-sm block">
                {schoolProfile.skIzinOperasional}
              </span>
            </div>

            <div className="md:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
                Alamat Lengkap Sekolah
              </span>
              <span className="text-slate-800 text-sm block leading-relaxed">
                {schoolProfile.alamat}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUBMENU: DATA KELAS */}
      {activeGuruSubMenu === 'data_kelas' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Data Kelas ({selectedSemester})
              </h2>
              <p className="text-xs text-slate-500">
                Terbagi Semester 1 dan 2, Kelas 7, 8, 9 (No, Kelas, Wali Kelas, Mata Pelajaran)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleUploadFile('Data Kelas')}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Word/Excel</span>
              </button>
              <button
                type="button"
                onClick={openAddKelas}
                className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Kelas</span>
              </button>
            </div>
          </div>

          {/* Table of Classes */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Wali Kelas</th>
                  <th className="py-3 px-4">Mata Pelajaran</th>
                  <th className="py-3 px-4 text-center">Jumlah Siswa</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {kelasList
                  .filter(k => (selectedGrade === 'Semua' ? true : k.tingkat === selectedGrade))
                  .map((k, idx) => (
                    <tr key={k.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 text-center font-bold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-black text-sm text-blue-700 block">
                          Kelas {k.kelas}
                        </span>
                        <span className="text-[10px] text-slate-500">Tingkat {k.tingkat}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {k.waliKelas}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {k.mataPelajaran}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-900">
                        {k.jumlahSiswa} Siswa
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditKelas(k)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                            title="Edit Kelas"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Yakin hapus kelas ${k.kelas}?`)) {
                                deleteKelas(k.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                            title="Hapus Kelas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. SUBMENU: DATA SISWA */}
      {activeGuruSubMenu === 'data_siswa' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                DATA SISWA ({selectedSemester})
              </h2>
              <p className="text-xs text-slate-500">
                Terbagi Semester 1 dan 2, Kelas 7, 8, 9 (No, Nama, NIS/NISN)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleDownloadTemplate('Data Siswa Excel')}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Format Template</span>
              </button>
              <button
                type="button"
                onClick={() => handleUploadFile('Data Siswa')}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Word/Excel</span>
              </button>
              <button
                type="button"
                onClick={openAddSiswa}
                className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Siswa</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Cari nama atau NIS/NISN siswa..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Table of Students */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Nama Lengkap Siswa</th>
                  <th className="py-3 px-4">NIS</th>
                  <th className="py-3 px-4">NISN</th>
                  <th className="py-3 px-4 text-center">Kelas</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {siswaList
                  .filter(s => {
                    const matchGrade = selectedGrade === 'Semua' ? true : s.tingkat === selectedGrade;
                    const matchSearch =
                      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      s.nis.includes(searchTerm) ||
                      s.nisn.includes(searchTerm);
                    return matchGrade && matchSearch;
                  })
                  .map((s, idx) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 text-center font-bold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{s.nama}</span>
                        <span className="text-[10px] text-slate-500">
                          {s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">{s.nis}</td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{s.nisn}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">
                          {s.kelas}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditSiswa(s)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                            title="Edit Siswa"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Yakin hapus data siswa ${s.nama}?`)) {
                                deleteSiswa(s.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Tambah/Edit Guru */}
      {isGuruModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              {editingGuru ? 'Edit Profil Guru' : 'Tambah Guru PAI Baru'}
            </h3>
            <form onSubmit={handleSaveGuru} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={guruForm.nama}
                  onChange={e => setGuruForm({ ...guruForm, nama: e.target.value })}
                  placeholder="Contoh: Ust. Sadiqul Alim, S.Pd.I., M.Pd."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">NIP / NUPTK</label>
                <input
                  type="text"
                  value={guruForm.nip}
                  onChange={e => setGuruForm({ ...guruForm, nip: e.target.value })}
                  placeholder="198205142008011015"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  value={guruForm.mataPelajaran}
                  onChange={e => setGuruForm({ ...guruForm, mataPelajaran: e.target.value })}
                  placeholder="Pendidikan Agama Islam & BP"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700">Foto Profil Guru (Google Drive / Berkas)</label>
                  {isGoogleDriveUrl(guruForm.foto) && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Link Google Drive Terkonversi
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={guruForm.foto}
                    onChange={e => {
                      const val = e.target.value;
                      setGuruForm({ ...guruForm, foto: normalizeImageUrl(val) });
                    }}
                    placeholder="Tempel link Google Drive atau URL foto..."
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
                            const dataUrl = await compressImageFile(file, 600, 0.85);
                            setGuruForm({ ...guruForm, foto: dataUrl });
                          } catch (err) {
                            alert('Gagal memproses berkas foto');
                          }
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Photo Preview & Fit Adjustment */}
                {guruForm.foto && (
                  <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 ring-2 ring-blue-500/20 shrink-0 flex items-center justify-center">
                      <AdaptiveImage
                        src={guruForm.foto}
                        fallbackSrc={DEFAULT_AVATAR}
                        alt="Pratinjau Guru"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="text-[11px] text-slate-600">
                      <span className="font-bold text-slate-800 block">Pratinjau Foto Berhasil</span>
                      <span className="text-slate-500">Foto otomatis menyesuaikan proporsi lingkaran dan kartu profil.</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGuruModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Tambah/Edit Kelas */}
      {isKelasModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              {editingKelas ? 'Edit Data Kelas' : 'Tambah Kelas Baru'}
            </h3>
            <form onSubmit={handleSaveKelas} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Kelas (e.g. 7A, 8B, 9C)</label>
                <input
                  type="text"
                  value={kelasForm.kelas}
                  onChange={e => setKelasForm({ ...kelasForm, kelas: e.target.value })}
                  placeholder="7A"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tingkat</label>
                <select
                  value={kelasForm.tingkat}
                  onChange={e => setKelasForm({ ...kelasForm, tingkat: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="7">Kelas 7</option>
                  <option value="8">Kelas 8</option>
                  <option value="9">Kelas 9</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Wali Kelas</label>
                <input
                  type="text"
                  value={kelasForm.waliKelas}
                  onChange={e => setKelasForm({ ...kelasForm, waliKelas: e.target.value })}
                  placeholder="Nama wali kelas..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsKelasModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Tambah/Edit Siswa */}
      {isSiswaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              {editingSiswa ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
            </h3>
            <form onSubmit={handleSaveSiswa} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  value={siswaForm.nama}
                  onChange={e => setSiswaForm({ ...siswaForm, nama: e.target.value })}
                  placeholder="Ahmad Rifai Pratama"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIS</label>
                  <input
                    type="text"
                    value={siswaForm.nis}
                    onChange={e => setSiswaForm({ ...siswaForm, nis: e.target.value })}
                    placeholder="24701"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NISN</label>
                  <input
                    type="text"
                    value={siswaForm.nisn}
                    onChange={e => setSiswaForm({ ...siswaForm, nisn: e.target.value })}
                    placeholder="0081234567"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas</label>
                  <select
                    value={siswaForm.kelas}
                    onChange={e => setSiswaForm({ ...siswaForm, kelas: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {kelasList.map(k => (
                      <option key={k.id} value={k.kelas}>
                        Kelas {k.kelas}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={siswaForm.jenisKelamin}
                    onChange={e => setSiswaForm({ ...siswaForm, jenisKelamin: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSiswaModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Visi & Misi Profil Sekolah */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Edit Visi & Sejarah Sekolah
            </h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                updateSchoolProfile({ visi: editedVisi, sejarah: editedSejarah });
                setIsEditProfileOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Visi Sekolah</label>
                <input
                  type="text"
                  value={editedVisi}
                  onChange={e => setEditedVisi(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Sejarah Singkat Sekolah</label>
                <textarea
                  rows={4}
                  value={editedSejarah}
                  onChange={e => setEditedSejarah(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
