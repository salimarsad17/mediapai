import React from 'react';
import { useLms } from '../../context/LmsContext';
import {
  Award,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  GraduationCap,
  Calendar,
} from 'lucide-react';

export const RekapNilaiSiswaView: React.FC = () => {
  const { rekapNilaiList, currentUser, schoolProfile, selectedSemester } = useLms();

  // Find grade entry belonging to current logged-in student
  const studentNilai = rekapNilaiList.find(
    r =>
      r.nama.toLowerCase() === currentUser?.name.toLowerCase() ||
      r.siswaId === currentUser?.id
  ) || rekapNilaiList[0];

  const renderScore = (val: number) => {
    const isBelow75 = val < 75;
    return (
      <span
        className={`px-2 py-0.5 rounded font-mono transition-colors ${
          isBelow75
            ? 'text-red-600 font-bold bg-red-50 ring-1 ring-red-200'
            : 'text-black font-semibold'
        }`}
      >
        {val}
      </span>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-1">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>LEMBAR EVALUASI HASIL BELAJAR PAI</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              Rekapitulasi Nilai Saya
            </h1>
            <p className="text-xs text-slate-500">
              Diambil langsung dari input resmi Guru PAI • KKM: 75.00
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs self-start"
          >
            <Download className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>

        {/* Student Meta Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Nama Siswa</span>
            <span className="font-bold text-slate-900 text-sm block">{studentNilai.nama}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Kelas Paralel</span>
            <span className="font-bold text-blue-700 text-sm block">{studentNilai.kelasParalel}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Mata Pelajaran</span>
            <span className="font-bold text-slate-900 text-sm block">{studentNilai.mapel}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Semester</span>
            <span className="font-bold text-slate-900 text-sm block">{studentNilai.semester}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs px-1">
          <span className="font-bold text-slate-600">Ketentuan Nilai:</span>
          <span className="flex items-center gap-1.5 text-black font-bold">
            <span className="w-3 h-3 rounded-full bg-black inline-block shadow-xs" />
            Nilai ≥ 75: Tuntas (Teks Warna Hitam)
          </span>
          <span className="flex items-center gap-1.5 text-red-600 font-bold">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block shadow-xs" />
            Nilai &lt; 75: Remidial (Teks Warna Merah)
          </span>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Komponen Penilaian</th>
                <th className="py-3 px-4 text-center">Ke-1</th>
                <th className="py-3 px-4 text-center">Ke-2</th>
                <th className="py-3 px-4 text-center">Ke-3</th>
                <th className="py-3 px-4 text-center">Ke-4</th>
                <th className="py-3 px-4 text-center">Ke-5</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-bold text-blue-900">
                  Ulangan Harian (UH 1 - 5)
                </td>
                <td className="py-3 px-4 text-center">{renderScore(studentNilai.uh1)}</td>
                <td className="py-3 px-4 text-center">{renderScore(studentNilai.uh2)}</td>
                <td className="py-3 px-4 text-center">{renderScore(studentNilai.uh3)}</td>
                <td className="py-3 px-4 text-center">{renderScore(studentNilai.uh4)}</td>
                <td className="py-3 px-4 text-center">{renderScore(studentNilai.uh5)}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-amber-900">
                  Tugas Terstruktur (Tgs 1 - 5)
                </td>
                <td className="py-3 px-4 text-center">{renderScore(studentNilai.tgs1)}</td>
                <td className="py-3 px-4 text-center">{renderScore(studentNilai.tgs2)}</td>
                <td className="py-3 px-4 text-center">{renderScore(studentNilai.tgs3)}</td>
                <td className="py-3 px-4 text-center">{renderScore(studentNilai.tgs4)}</td>
                <td className="py-3 px-4 text-center">{renderScore(studentNilai.tgs5)}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-emerald-900">
                  Hafalan Surat Juz 'Amma (1 - 5)
                </td>
                <td className="py-3 px-4 text-center">{renderScore(studentNilai.hafalan1)}</td>
                <td className="py-3 px-4 text-center">{renderScore(studentNilai.hafalan2)}</td>
                <td className="py-3 px-4 text-center">{renderScore(studentNilai.hafalan3)}</td>
                <td className="py-3 px-4 text-center">{renderScore(studentNilai.hafalan4)}</td>
                <td className="py-3 px-4 text-center">{renderScore(studentNilai.hafalan5)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PTS, PAS & Rerata Akhir */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center space-y-1">
            <span className="text-[10px] font-bold text-purple-700 uppercase">
              Penilaian Tengah Semester (PTS)
            </span>
            <div className="text-2xl font-black">{renderScore(studentNilai.pts)}</div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center space-y-1">
            <span className="text-[10px] font-bold text-purple-700 uppercase">
              Penilaian Akhir Semester (PAS)
            </span>
            <div className="text-2xl font-black">{renderScore(studentNilai.pas)}</div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-600 text-white text-center space-y-1 shadow-md">
            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">
              Rerata Nilai Akhir (KKM: {studentNilai.kkm})
            </span>
            <div className="text-3xl font-black text-amber-300">
              {studentNilai.rerata}
            </div>
            <span className="text-[10px] font-semibold block text-blue-100">
              {studentNilai.rerata >= 75 ? '✓ Lulus KKM (Tuntas)' : 'Perlu Bimbingan Tambahan'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
