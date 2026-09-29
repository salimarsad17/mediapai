import React from 'react';
import { useLms } from '../../context/LmsContext';
import { AdaptiveImage } from '../common/AdaptiveImage';
import {
  User,
  GraduationCap,
  School,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const ProfilSiswaView: React.FC = () => {
  const { currentUser, schoolProfile, siswaList, kelasList } = useLms();

  const siswaDetail = siswaList.find(
    s => s.nama.toLowerCase() === currentUser?.name.toLowerCase()
  ) || {
    id: 's-curr',
    no: 1,
    nama: currentUser?.name || 'Ahmad Rifai Pratama',
    nis: '24701',
    nisn: currentUser?.identifier || '0081234567',
    kelas: currentUser?.className || '7A',
    tingkat: currentUser?.gradeLevel || '7',
    semester: 'Semester 1 (Ganjil)' as const,
    jenisKelamin: 'L' as const,
    alamat: 'Kecamatan Rebang Tangkas, Kabupaten Way Kanan, Lampung',
    waliMurid: 'Bambang Pratama',
    telepon: '0852-1122-3344',
  };

  const kelasDetail = kelasList.find(k => k.kelas === siswaDetail.kelas);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 text-center sm:text-left">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden ring-4 ring-blue-500/20 shadow-md bg-slate-100 shrink-0 flex items-center justify-center">
            <AdaptiveImage
              src={currentUser?.avatar}
              fallbackSrc="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80"
              alt={currentUser?.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 inline-block mb-1">
              Peserta Didik Aktif
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {siswaDetail.nama}
            </h1>
            <p className="text-sm font-bold text-blue-600">
              NIS: {siswaDetail.nis} • NISN: {siswaDetail.nisn}
            </p>
            <p className="text-xs text-slate-500">
              Kelas {siswaDetail.kelas} (Tingkat {siswaDetail.tingkat}) • {schoolProfile.name}
            </p>
          </div>
        </div>

        {/* Detail Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 block text-[10px] uppercase">
              Nama Lengkap
            </span>
            <span className="font-black text-slate-900 text-sm block">
              {siswaDetail.nama}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 block text-[10px] uppercase">
              Nomor Induk Siswa (NIS)
            </span>
            <span className="font-mono font-bold text-slate-900 text-sm block">
              {siswaDetail.nis}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 block text-[10px] uppercase">
              Nomor Induk Siswa Nasional (NISN)
            </span>
            <span className="font-mono font-black text-blue-700 text-sm block">
              {siswaDetail.nisn}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 block text-[10px] uppercase">
              Kelas & Rombel
            </span>
            <span className="font-bold text-slate-900 text-sm block">
              Kelas {siswaDetail.kelas} (Tingkat {siswaDetail.tingkat})
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 block text-[10px] uppercase">
              Wali Kelas
            </span>
            <span className="font-bold text-slate-900 text-sm block">
              {kelasDetail?.waliKelas || 'Ust. Sadiqul Alim, S.Pd.I., M.Pd.'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 block text-[10px] uppercase">
              Jenis Kelamin
            </span>
            <span className="font-bold text-slate-900 text-sm block">
              {siswaDetail.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
            </span>
          </div>

          <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 block text-[10px] uppercase">
              Satuan Pendidikan
            </span>
            <span className="font-bold text-slate-900 text-sm block">
              {schoolProfile.name} (NPSN: {schoolProfile.npsn})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
