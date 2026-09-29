import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { School, Save, RotateCcw, Check, AlertTriangle } from 'lucide-react';

export const SchoolSettings: React.FC = () => {
  const { schoolConfig, updateSchoolConfig, resetAllData } = useLms();

  const [formData, setFormData] = useState({
    governmentHeader: schoolConfig.governmentHeader || 'PEMERINTAH KABUPATEN WAY KANAN',
    departmentHeader: schoolConfig.departmentHeader || 'DINAS PENDIDIKAN',
    name: schoolConfig.name,
    npsn: schoolConfig.npsn,
    address: schoolConfig.address,
    principal: schoolConfig.principal,
    academicYear: schoolConfig.academicYear,
    currentSemester: schoolConfig.currentSemester,
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolConfig(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Identitas & Konfigurasi Sekolah
            </h2>
            <p className="text-xs text-slate-500">
              Data ini tampil pada kartu ujian siswa, hasil asesmen, dan kop cetak resmi
            </p>
          </div>
        </div>

        {isSaved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Pengaturan identitas sekolah berhasil diperbarui.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kop Tingkat 1: Instansi Pemerintah
              </label>
              <input
                type="text"
                value={formData.governmentHeader}
                onChange={e => setFormData(prev => ({ ...prev, governmentHeader: e.target.value }))}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-bold uppercase"
                placeholder="PEMERINTAH KABUPATEN WAY KANAN"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kop Tingkat 2: Dinas Pengampu
              </label>
              <input
                type="text"
                value={formData.departmentHeader}
                onChange={e => setFormData(prev => ({ ...prev, departmentHeader: e.target.value }))}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-bold uppercase"
                placeholder="DINAS PENDIDIKAN"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Kop Tingkat 3: Nama Resmi Sekolah (UPT SMPN)
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nomor Pokok Sekolah Nasional (NPSN)
              </label>
              <input
                type="text"
                value={formData.npsn}
                onChange={e => setFormData(prev => ({ ...prev, npsn: e.target.value }))}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Kepala Sekolah & Gelar
              </label>
              <input
                type="text"
                value={formData.principal}
                onChange={e => setFormData(prev => ({ ...prev, principal: e.target.value }))}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap Sekolah</label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tahun Ajaran</label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={e => setFormData(prev => ({ ...prev, academicYear: e.target.value }))}
                placeholder="2024/2025"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Semester Aktif</label>
              <select
                value={formData.currentSemester}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    currentSemester: e.target.value as 'Ganjil' | 'Genap',
                  }))
                }
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-bold"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-xs text-rose-900 space-y-3">
        <div className="flex items-center gap-2 font-bold text-rose-800">
          <AlertTriangle className="w-4 h-4" />
          <span>Reset Data Demo Sistem CBT</span>
        </div>
        <p className="text-slate-600 text-xs">
          Jika Anda ingin mengembalikan seluruh data siswa, guru, soal ujian kelas 7, 8, 9, dan rekap
          nilai ke konfigurasi awal bawaan, Anda dapat menekan tombol di bawah ini.
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Apakah Anda yakin ingin mereset seluruh data LMS ke bawaan awal?')) {
              resetAllData();
            }
          }}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset ke Data Demo Awal</span>
        </button>
      </div>
    </div>
  );
};
