import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { ExamSubmission } from '../../types';
import {
  Award,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  X,
  FileSpreadsheet,
  Check,
  ShieldAlert,
} from 'lucide-react';

export const ExamGradingResults: React.FC = () => {
  const { submissions, exams, viewSubmissionDetails } = useLms();

  const [selectedExamId, setSelectedExamId] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubmissionForModal, setSelectedSubmissionForModal] =
    useState<ExamSubmission | null>(null);

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    if (selectedExamId !== 'all' && sub.examId !== selectedExamId) return false;
    if (selectedGrade !== 'all' && sub.gradeLevel !== selectedGrade) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sub.studentName.toLowerCase().includes(q);
      const matchNisn = sub.studentNisn.toLowerCase().includes(q);
      const matchClass = sub.studentClass.toLowerCase().includes(q);
      if (!matchName && !matchNisn && !matchClass) return false;
    }
    return true;
  });

  // Calculate analytics
  const totalSubmissions = filteredSubmissions.length;
  const averageScore =
    totalSubmissions > 0
      ? Math.round(
          filteredSubmissions.reduce((acc, curr) => acc + curr.score, 0) / totalSubmissions
        )
      : 0;
  const passedCount = filteredSubmissions.filter(s => s.isPassed).length;
  const passedPercentage =
    totalSubmissions > 0 ? Math.round((passedCount / totalSubmissions) * 100) : 0;
  const highestScore =
    totalSubmissions > 0 ? Math.max(...filteredSubmissions.map(s => s.score)) : 0;
  const lowestScore =
    totalSubmissions > 0 ? Math.min(...filteredSubmissions.map(s => s.score)) : 0;

  // Export CSV
  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) {
      alert('Tidak ada data nilai untuk diexport.');
      return;
    }

    const headers = [
      'No',
      'NISN',
      'Nama Siswa',
      'Kelas',
      'Jenjang',
      'Mata Pelajaran',
      'Judul Ujian',
      'Benar',
      'Salah',
      'Nilai Akhir',
      'Status KKM',
      'Pelanggaran',
      'Waktu Selesai',
    ];

    const rows = filteredSubmissions.map((sub, index) => [
      index + 1,
      `'${sub.studentNisn}`,
      `"${sub.studentName}"`,
      sub.studentClass,
      `Kelas ${sub.gradeLevel}`,
      `"${sub.subject}"`,
      `"${sub.examTitle}"`,
      sub.correctAnswersCount,
      sub.wrongAnswersCount,
      sub.score,
      sub.isPassed ? 'TUNTAS' : 'REMEDIAL',
      sub.violationCount,
      new Date(sub.submittedAt).toLocaleString('id-ID'),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_CBT_SMPN_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Analytic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 uppercase">Total Pengumpulan</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalSubmissions}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Lembar jawaban masuk</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 uppercase">Rata-Rata Nilai</p>
          <p className="text-2xl font-black text-blue-700 mt-1">{averageScore}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Dari skala 100</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 uppercase">Ketuntasan KKM</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{passedPercentage}%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {passedCount} dari {totalSubmissions} siswa tuntas
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 uppercase">Rentang Nilai</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-black text-emerald-700">{highestScore}</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-lg font-black text-rose-600">{lowestScore}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Tertinggi / Terendah</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa / NISN..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Filter Jenjang Kelas */}
          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="all">Semua Kelas (7, 8, 9)</option>
            <option value="7">Kelas 7</option>
            <option value="8">Kelas 8</option>
            <option value="9">Kelas 9</option>
          </select>

          {/* Filter Ujian */}
          <select
            value={selectedExamId}
            onChange={e => setSelectedExamId(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium max-w-[220px] truncate"
          >
            <option value="all">Semua Mata Ujian</option>
            {exams.map(e => (
              <option key={e.id} value={e.id}>
                Kelas {e.gradeLevel} - {e.title}
              </option>
            ))}
          </select>
        </div>

        {/* Download CSV Button */}
        <button
          type="button"
          id="btn-export-csv"
          onClick={handleExportCSV}
          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Excel / CSV</span>
        </button>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama Siswa & NISN</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Mata Ujian</th>
                <th className="py-3 px-4 text-center">Waktu Pengerjaan</th>
                <th className="py-3 px-4 text-center">Benar / Salah</th>
                <th className="py-3 px-4 text-center">Nilai Akhir</th>
                <th className="py-3 px-4 text-center">Status KKM</th>
                <th className="py-3 px-4 text-center">Integritas</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Tidak ditemukan data hasil ujian yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{sub.studentName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">NISN: {sub.studentNisn}</p>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {sub.studentClass}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800 line-clamp-1">{sub.examTitle}</p>
                      <p className="text-[10px] text-slate-500">{sub.subject}</p>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">
                      {Math.floor(sub.timeSpentSeconds / 60)}m {sub.timeSpentSeconds % 60}s
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-emerald-700 font-bold">{sub.correctAnswersCount}</span> /{' '}
                      <span className="text-rose-700 font-bold">{sub.wrongAnswersCount}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md font-black text-xs ${
                          sub.score >= 75
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sub.score}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {sub.isPassed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          TUNTAS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertCircle className="w-3 h-3" />
                          REMEDIAL
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {sub.violationCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <ShieldAlert className="w-3 h-3" />
                          {sub.violationCount}x Pindah
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Aman</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedSubmissionForModal(sub)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-[11px] transition flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Jawaban</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Lembar Jawaban Siswa */}
      {selectedSubmissionForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-black text-slate-900 text-sm">
                  Lembar Jawaban: {selectedSubmissionForModal.studentName}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedSubmissionForModal.studentClass} • NISN:{' '}
                  {selectedSubmissionForModal.studentNisn} • Nilai:{' '}
                  <strong className="text-blue-700 text-sm font-bold">
                    {selectedSubmissionForModal.score}
                  </strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmissionForModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                <div>
                  Ujian: <strong>{selectedSubmissionForModal.examTitle}</strong>
                </div>
                <div>
                  Status:{' '}
                  <strong
                    className={
                      selectedSubmissionForModal.isPassed ? 'text-emerald-700' : 'text-amber-700'
                    }
                  >
                    {selectedSubmissionForModal.isPassed ? 'TUNTAS KKM' : 'REMEDIAL'}
                  </strong>
                </div>
              </div>

              <h4 className="font-bold text-slate-800 text-xs">Rincian Jawaban:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(selectedSubmissionForModal.answers).map(([qId, ans], idx) => (
                  <div
                    key={qId}
                    className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
                  >
                    <span className="font-semibold text-slate-700">Soal #{idx + 1}</span>
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Opsi {ans}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  viewSubmissionDetails(selectedSubmissionForModal);
                  setSelectedSubmissionForModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition"
              >
                Buka Pembahasan Lengkap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
