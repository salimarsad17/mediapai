import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { Exam, ExamSubmission } from '../../types';
import {
  GraduationCap,
  Clock,
  BookOpen,
  CheckCircle,
  AlertCircle,
  KeyRound,
  FileText,
  Award,
  Calendar,
  User,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Check,
} from 'lucide-react';

export const SiswaDashboard: React.FC = () => {
  const {
    currentUser,
    exams,
    submissions,
    schoolConfig,
    startExamWithToken,
    viewSubmissionDetails,
  } = useLms();

  const [selectedExamForToken, setSelectedExamForToken] = useState<Exam | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [activeTab, setActiveTab] = useState<'available' | 'history'>('available');

  if (!currentUser) return null;

  const studentGrade = currentUser.gradeLevel || '7';
  const studentClass = currentUser.className || `${studentGrade}A`;

  // Filter exams matching this student's grade level and published
  const availableExamsForGrade = exams.filter(
    e => e.gradeLevel === studentGrade && e.isPublished
  );

  // Submissions made by this student
  const studentSubmissions = submissions.filter(s => s.studentId === currentUser.id);

  // Map of examId to submission if already submitted
  const submittedExamIds = new Set(studentSubmissions.map(s => s.examId));

  const handleOpenTokenModal = (exam: Exam) => {
    setSelectedExamForToken(exam);
    setTokenInput(exam.token); // Pre-fill with exam token for demo convenience
    setTokenError('');
  };

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamForToken) return;

    const result = startExamWithToken(selectedExamForToken.id, tokenInput);
    if (!result.success) {
      setTokenError(result.message || 'Token ujian tidak cocok.');
    } else {
      setSelectedExamForToken(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Identity Hero Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={
                currentUser.avatar ||
                'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
              }
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  PESERTA UJIAN AKTIF
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/30 text-amber-200 border border-amber-400/30">
                  SMP NEGERI KELAS {studentGrade}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black mt-1 tracking-tight text-white">
                {currentUser.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-300 mt-1">
                <span>
                  NISN: <strong className="text-white font-mono">{currentUser.identifier}</strong>
                </span>
                <span>•</span>
                <span>
                  Kelas: <strong className="text-white">{studentClass}</strong>
                </span>
                <span>•</span>
                <span>{schoolConfig.name}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs rounded-xl p-3.5 border border-white/10 self-stretch sm:self-auto justify-around sm:justify-start">
            <div className="text-center px-2">
              <p className="text-xs text-slate-300 font-medium">Ujian Tersedia</p>
              <p className="text-xl font-black text-white">{availableExamsForGrade.length}</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <p className="text-xs text-slate-300 font-medium">Sudah Selesai</p>
              <p className="text-xl font-black text-emerald-400">{studentSubmissions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Available Exams vs History */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            id="tab-available-exams"
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'available'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Daftar Ujian Kelas {studentGrade}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'available' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {availableExamsForGrade.length}
            </span>
          </button>

          <button
            id="tab-history-exams"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Riwayat & Nilai Ujian</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'history' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {studentSubmissions.length}
            </span>
          </button>
        </div>
      </div>

      {/* Available Exams Section */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Jadwal Ujian Aktif (Fase Kelas {studentGrade})</span>
            </h2>
            <span className="text-xs text-slate-500">
              Menampilkan {availableExamsForGrade.length} mata pelajaran
            </span>
          </div>

          {availableExamsForGrade.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-slate-800 text-sm">Belum Ada Ujian untuk Kelas {studentGrade}</p>
              <p className="text-xs text-slate-500 mt-1">
                Guru mata pelajaran belum mempublikasikan ujian baru untuk jenjang ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableExamsForGrade.map(exam => {
                const isCompleted = submittedExamIds.has(exam.id);
                const submission = studentSubmissions.find(s => s.examId === exam.id);

                return (
                  <div
                    key={exam.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 p-5 shadow-2xs hover:shadow-sm transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {exam.subject}
                        </span>
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <Check className="w-3 h-3" />
                            Selesai (Skor: {submission?.score})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Siap Dikerjakan
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-2 line-clamp-2">
                        {exam.title}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Pengampu: {exam.teacherName}</span>
                      </p>

                      {/* Specs */}
                      <div className="grid grid-cols-3 gap-2 mt-4 py-3 border-y border-slate-100 text-center text-xs">
                        <div className="p-1 rounded bg-slate-50">
                          <span className="text-slate-400 block text-[10px]">WAKTU</span>
                          <strong className="text-slate-800">{exam.durationMinutes} Menit</strong>
                        </div>
                        <div className="p-1 rounded bg-slate-50">
                          <span className="text-slate-400 block text-[10px]">SOAL</span>
                          <strong className="text-slate-800">{exam.questions.length} Butir</strong>
                        </div>
                        <div className="p-1 rounded bg-slate-50">
                          <span className="text-slate-400 block text-[10px]">KKM</span>
                          <strong className="text-slate-800">{exam.passingGrade} Poin</strong>
                        </div>
                      </div>

                      {/* Instructions excerpt */}
                      <p className="text-xs text-slate-500 mt-3 line-clamp-2 italic bg-slate-50 p-2 rounded-lg">
                        "{exam.instructions}"
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="text-xs text-slate-500">
                        Token Ujian:{' '}
                        <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-slate-800">
                          {exam.token}
                        </code>
                      </div>

                      {isCompleted && submission ? (
                        <button
                          type="button"
                          id={`btn-review-${exam.id}`}
                          onClick={() => viewSubmissionDetails(submission)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center gap-1"
                        >
                          <span>Lihat Hasil</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          id={`btn-start-exam-${exam.id}`}
                          onClick={() => handleOpenTokenModal(exam)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1.5 shadow-xs"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Mulai Ujian</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* History & Grades Section */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Rekapitulasi Hasil Ujian Saya</span>
            </h2>
            <span className="text-xs text-slate-500">
              {studentSubmissions.length} ujian telah diselesaikan
            </span>
          </div>

          {studentSubmissions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-slate-800 text-sm">Belum Ada Riwayat Ujian</p>
              <p className="text-xs text-slate-500 mt-1">
                Silakan pilih dan selesaikan ujian yang tersedia pada tab di atas.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="py-3 px-4">Mata Pelajaran & Ujian</th>
                      <th className="py-3 px-4">Waktu Selesai</th>
                      <th className="py-3 px-4 text-center">Benar / Salah</th>
                      <th className="py-3 px-4 text-center">Skor Akhir</th>
                      <th className="py-3 px-4 text-center">Status KKM</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentSubmissions.map(sub => (
                      <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{sub.examTitle}</p>
                          <p className="text-xs text-slate-500">{sub.subject}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {new Date(sub.submittedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-emerald-700">
                            {sub.correctAnswersCount}
                          </span>{' '}
                          /{' '}
                          <span className="font-semibold text-rose-700">
                            {sub.wrongAnswersCount}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-lg font-black text-sm ${
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
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle className="w-3.5 h-3.5" />
                              TUNTAS
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertCircle className="w-3.5 h-3.5" />
                              REMEDIAL
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            id={`btn-view-result-${sub.id}`}
                            onClick={() => viewSubmissionDetails(sub)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition"
                          >
                            Pembahasan & Kartu
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Konfirmasi Masuk Ujian CBT */}
      {selectedExamForToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Konfirmasi Masuk Ujian CBT</h3>
                  <p className="text-[11px] text-slate-500">Kelas {studentGrade} • {schoolConfig.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExamForToken(null)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
              <p className="text-slate-500">Mata Pelajaran:</p>
              <p className="font-bold text-slate-900 text-sm">{selectedExamForToken.title}</p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-slate-700">
                <div>Durasi: <strong>{selectedExamForToken.durationMinutes} Menit</strong></div>
                <div>Jumlah: <strong>{selectedExamForToken.questions.length} Butir Soal</strong></div>
                <div>KKM: <strong>{selectedExamForToken.passingGrade} Poin</strong></div>
                <div>Pengampu: <strong>{selectedExamForToken.teacherName}</strong></div>
              </div>
            </div>

            {/* Anti-cheat notice */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Peringatan Integritas Ujian:</span>
                Sistem mendeteksi perpindahan tab atau jendela browser. Segala aktivitas tidak wajar akan dicatat otomatis pada laporan guru.
              </div>
            </div>

            {tokenError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {tokenError}
              </div>
            )}

            <form onSubmit={handleStartExam} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Masukkan Token Ujian
                </label>
                <input
                  type="text"
                  id="input-token-ujian"
                  value={tokenInput}
                  onChange={e => setTokenInput(e.target.value)}
                  placeholder="Contoh: IPA7PAS"
                  className="w-full px-3.5 py-2 text-sm font-mono uppercase font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  autoFocus
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Token resmi diberikan oleh pengawas ujian: <code className="font-bold text-blue-700">{selectedExamForToken.token}</code>
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedExamForToken(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-confirm-start-cbt"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs flex items-center gap-1.5"
                >
                  <span>Mulai Kerjakan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
