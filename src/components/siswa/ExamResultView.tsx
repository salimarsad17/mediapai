import React from 'react';
import { useLms } from '../../context/LmsContext';
import { KopSurat } from '../common/KopSurat';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  ArrowLeft,
  School,
  FileText,
  ShieldAlert,
  Check,
  X,
  HelpCircle,
} from 'lucide-react';

export const ExamResultView: React.FC = () => {
  const { lastCompletedSubmission, exams, setActiveView, schoolConfig } = useLms();

  if (!lastCompletedSubmission) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-slate-600">Belum ada data hasil ujian untuk ditampilkan.</p>
        <button
          onClick={() => setActiveView('dashboard')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const sub = lastCompletedSubmission;
  const exam = exams.find(e => e.id === sub.examId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0 print:m-0">
      {/* Action Bar (Hidden in Print) */}
      <div className="flex items-center justify-between gap-3 print:hidden">
        <button
          type="button"
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard Siswa</span>
        </button>

        <button
          type="button"
          id="btn-print-result"
          onClick={handlePrint}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-xl transition shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Simpan Hasil Ujian (PDF)</span>
        </button>
      </div>

      {/* Official School Header for Result Document */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Kop Surat Resmi: Pemerintah Kabupaten Way Kanan - Dinas Pendidikan - UPT SMPN 2 Rebang Tangkas */}
        <KopSurat
          documentTitle="LEMBAR HASIL ASESMEN UJIAN BERBASIS KOMPUTER (CBT)"
          subTitle={`SEMESTER ${schoolConfig.currentSemester.toUpperCase()} • TAHUN PELAJARAN ${schoolConfig.academicYear}`}
        />

        {/* Student & Exam Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs border border-slate-200">
          <div className="space-y-1.5">
            <div className="flex">
              <span className="w-32 text-slate-500 font-medium">Nama Peserta</span>
              <strong className="text-slate-900">: {sub.studentName}</strong>
            </div>
            <div className="flex">
              <span className="w-32 text-slate-500 font-medium">NISN</span>
              <strong className="text-slate-900 font-mono">: {sub.studentNisn}</strong>
            </div>
            <div className="flex">
              <span className="w-32 text-slate-500 font-medium">Kelas / Rombel</span>
              <strong className="text-slate-900">: Kelas {sub.gradeLevel} ({sub.studentClass})</strong>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex">
              <span className="w-32 text-slate-500 font-medium">Mata Pelajaran</span>
              <strong className="text-slate-900">: {sub.subject}</strong>
            </div>
            <div className="flex">
              <span className="w-32 text-slate-500 font-medium">Judul Asesmen</span>
              <strong className="text-slate-900">: {sub.examTitle}</strong>
            </div>
            <div className="flex">
              <span className="w-32 text-slate-500 font-medium">Waktu Selesai</span>
              <strong className="text-slate-900">
                : {new Date(sub.submittedAt).toLocaleString('id-ID')}
              </strong>
            </div>
          </div>
        </div>

        {/* Score & Status Highlight Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Main Score Card */}
          <div className="sm:col-span-2 bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-5 text-white flex items-center justify-between shadow-xs">
            <div>
              <span className="text-xs text-blue-200 font-bold uppercase tracking-wider block">
                SKOR AKHIR ASESMEN
              </span>
              <div className="text-4xl sm:text-5xl font-black mt-1 text-white flex items-baseline gap-1">
                <span>{sub.score}</span>
                <span className="text-sm font-medium text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Kriteria Ketuntasan Minimal (KKM): <strong>{exam?.passingGrade || 75}</strong>
              </p>
            </div>

            <div className="text-right">
              {sub.isPassed ? (
                <div className="inline-flex flex-col items-end">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    TUNTAS
                  </span>
                  <span className="text-[10px] text-emerald-300 mt-1">Lulus KKM</span>
                </div>
              ) : (
                <div className="inline-flex flex-col items-end">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 text-amber-400" />
                    REMEDIAL
                  </span>
                  <span className="text-[10px] text-amber-300 mt-1">Di Bawah KKM</span>
                </div>
              )}
            </div>
          </div>

          {/* Correct / Wrong stats */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase">Analisis Butir</span>
            <div className="space-y-1 my-2 text-xs">
              <div className="flex justify-between items-center text-emerald-700 font-bold">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Jawaban Benar
                </span>
                <span className="text-sm">{sub.correctAnswersCount}</span>
              </div>
              <div className="flex justify-between items-center text-rose-700 font-bold">
                <span className="flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Jawaban Salah
                </span>
                <span className="text-sm">{sub.wrongAnswersCount}</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400">
              Total {sub.totalQuestions} butir soal pilihan ganda
            </span>
          </div>

          {/* Time & Integrity stats */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase">Durasi & Integritas</span>
            <div className="space-y-1 my-2 text-xs">
              <div className="flex justify-between items-center text-slate-700">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Waktu Kerja
                </span>
                <span className="font-bold">
                  {Math.floor(sub.timeSpentSeconds / 60)} m {sub.timeSpentSeconds % 60} d
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 text-slate-600">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-400" /> Pelanggaran
                </span>
                <span
                  className={`font-bold ${
                    sub.violationCount > 0 ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  {sub.violationCount} Kali
                </span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400">
              {sub.violationCount === 0 ? 'Sesuai tata tertib CBT' : 'Pindah tab tercatat'}
            </span>
          </div>
        </div>

        {/* Detailed Question Review & Teacher's Solution Explanations */}
        {exam && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Pembahasan & Review Jawaban Soal</span>
              </h3>
              <span className="text-xs text-slate-500">
                Lengkap dengan kunci jawaban dan penjelasan guru
              </span>
            </div>

            <div className="space-y-4">
              {exam.questions.map((q, idx) => {
                const studentAns = sub.answers[q.id];
                const isCorrect = studentAns === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border transition ${
                      isCorrect
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-rose-50/30 border-rose-200'
                    }`}
                  >
                    {/* Question Meta Bar */}
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md font-bold text-xs bg-slate-800 text-white">
                          Soal #{idx + 1}
                        </span>
                        {q.topic && (
                          <span className="text-xs text-slate-600 font-medium">
                            Materi: {q.topic}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">
                          Bobot: {q.score} Poin
                        </span>
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <Check className="w-3.5 h-3.5" /> Benar (+{q.score})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <X className="w-3.5 h-3.5" /> Salah (+0)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Text */}
                    <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                      {q.text}
                    </p>

                    {/* Options List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                      {q.options.map(opt => {
                        const isStudentChoice = studentAns === opt.label;
                        const isKey = q.correctAnswer === opt.label;

                        let optClasses = 'bg-white border-slate-200 text-slate-700';
                        if (isKey) {
                          optClasses = 'bg-emerald-100/90 border-emerald-500 text-emerald-950 font-bold';
                        } else if (isStudentChoice && !isCorrect) {
                          optClasses = 'bg-rose-100/90 border-rose-500 text-rose-950 font-bold';
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-2.5 rounded-xl border flex items-start gap-2 ${optClasses}`}
                          >
                            <span className="font-mono font-bold w-5">{opt.label}.</span>
                            <span className="flex-1">{opt.text}</span>
                            {isKey && (
                              <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.5 rounded font-bold">
                                Kunci
                              </span>
                            )}
                            {isStudentChoice && !isKey && (
                              <span className="text-[10px] bg-rose-700 text-white px-1.5 py-0.5 rounded font-bold">
                                Jawaban Anda
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    {q.explanation && (
                      <div className="mt-3 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-800 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-blue-900">
                          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                          <span>Penjelasan Guru:</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Signature Box (Visible on Print) */}
        <div className="hidden print:grid grid-cols-2 pt-12 text-center text-xs">
          <div>
            <p>Mengetahui,</p>
            <p>Kepala {schoolConfig.name}</p>
            <div className="h-16" />
            <p className="font-bold underline">{schoolConfig.principal}</p>
            <p className="text-slate-500">NIP: 196805121994031005</p>
          </div>
          <div>
            <p>Way Kanan, {new Date(sub.submittedAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
            <p>Guru Pengampu Mata Pelajaran</p>
            <div className="h-16" />
            <p className="font-bold underline">{exam?.teacherName || 'Guru Mata Pelajaran'}</p>
            <p className="text-slate-500">NIP: 198205142008012015</p>
          </div>
        </div>
      </div>
    </div>
  );
};
