import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { ExamSubmission } from '../../types';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Printer,
  Search,
  Filter,
  Eye,
  TrendingUp,
  GraduationCap,
} from 'lucide-react';

export const NilaiView: React.FC = () => {
  const { currentUser, submissions, exams, schoolConfig, viewSubmissionDetails } = useLms();
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedExamId, setSelectedExamId] = useState<string>('all');
  const [searchStudent, setSearchStudent] = useState('');

  if (!currentUser) return null;

  const isGuru = currentUser.role === 'guru';

  // Submissions filtered based on role
  const relevantSubmissions = submissions.filter(s => {
    if (!isGuru && s.studentId !== currentUser.id) return false;
    if (selectedClass !== 'all' && s.studentClass !== selectedClass) return false;
    if (selectedExamId !== 'all' && s.examId !== selectedExamId) return false;
    if (searchStudent.trim()) {
      const q = searchStudent.toLowerCase();
      return (
        s.studentName.toLowerCase().includes(q) ||
        s.studentNisn.toLowerCase().includes(q) ||
        s.examTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate statistics
  const totalSubmissions = relevantSubmissions.length;
  const passedCount = relevantSubmissions.filter(s => s.isPassed).length;
  const averageScore =
    totalSubmissions > 0
      ? Math.round(relevantSubmissions.reduce((acc, curr) => acc + curr.score, 0) / totalSubmissions)
      : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 print:hidden">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>REKAPITULASI HASIL EVALUASI PAI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {isGuru ? 'Rekapitulasi Nilai Asesmen PAI Siswa' : 'Daftar Perolehan Nilai & Raport CBT'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
            Data penilaian sumatif resmi mata pelajaran Pendidikan Agama Islam dan Budi Pekerti • {schoolConfig.name}.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-slate-900 hover:bg-slate-100 transition flex items-center gap-2 shadow-md shrink-0"
        >
          <Printer className="w-4 h-4 text-slate-700" />
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Hasil Ujian</p>
            <p className="text-2xl font-black text-slate-900">{totalSubmissions}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tuntas KKM (&ge; 75)</p>
            <p className="text-2xl font-black text-emerald-700">
              {passedCount} <span className="text-xs text-slate-500 font-normal">({totalSubmissions ? Math.round((passedCount / totalSubmissions) * 100) : 0}%)</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rata-Rata Nilai</p>
            <p className="text-2xl font-black text-slate-900">{averageScore}</p>
          </div>
        </div>
      </div>

      {/* Filter Row (Print hidden) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 print:hidden">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder={isGuru ? 'Cari nama siswa, NISN, atau judul asesmen...' : 'Cari judul asesmen...'}
            value={searchStudent}
            onChange={e => setSearchStudent(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {isGuru && (
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="text-xs py-2 px-3 rounded-lg bg-slate-50 border border-slate-200 font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Semua Rombel Kelas</option>
              <option value="7A">Kelas 7A</option>
              <option value="7B">Kelas 7B</option>
              <option value="8A">Kelas 8A</option>
              <option value="8B">Kelas 8B</option>
              <option value="9A">Kelas 9A</option>
              <option value="9C">Kelas 9C</option>
            </select>
          )}

          <select
            value={selectedExamId}
            onChange={e => setSelectedExamId(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg bg-slate-50 border border-slate-200 font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Paket Ujian PAI</option>
            {exams.map(ex => (
              <option key={ex.id} value={ex.id}>
                {ex.title.slice(0, 35)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">No.</th>
                {isGuru && <th className="py-3 px-4">Nama Siswa / NISN</th>}
                {isGuru && <th className="py-3 px-4">Kelas</th>}
                <th className="py-3 px-4">Judul Ujian PAI</th>
                <th className="py-3 px-4 text-center">Benar / Soal</th>
                <th className="py-3 px-4 text-center">Waktu Pengerjaan</th>
                <th className="py-3 px-4 text-center">Skor Nilai</th>
                <th className="py-3 px-4 text-center">Status KKM</th>
                <th className="py-3 px-4 text-center print:hidden">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {relevantSubmissions.map((sub, index) => (
                <tr key={sub.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono text-slate-500">{index + 1}</td>
                  {isGuru && (
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{sub.studentName}</span>
                      <span className="text-[11px] font-mono text-slate-500">NISN: {sub.studentNisn}</span>
                    </td>
                  )}
                  {isGuru && (
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {sub.studentClass}
                      </span>
                    </td>
                  )}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">{sub.examTitle}</span>
                    <span className="text-[11px] text-slate-400">
                      Diselesaikan: {new Date(sub.submittedAt).toLocaleDateString('id-ID')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span className="text-emerald-700 font-bold">{sub.correctAnswersCount}</span> / {sub.totalQuestions}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-500 text-xs">
                    {Math.round(sub.timeSpentSeconds / 60)} menit
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg font-black text-sm ${
                        sub.isPassed
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {sub.score}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {sub.isPassed ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tuntas</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Remedial</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center print:hidden">
                    <button
                      type="button"
                      id={`btn-view-submission-${sub.id}`}
                      onClick={() => viewSubmissionDetails(sub)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Rincian</span>
                    </button>
                  </td>
                </tr>
              ))}

              {relevantSubmissions.length === 0 && (
                <tr>
                  <td colSpan={isGuru ? 9 : 7} className="py-8 text-center text-slate-400 text-xs">
                    Belum ada riwayat pengerjaan nilai yang sesuai kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
