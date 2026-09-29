import React, { useState, useEffect, useCallback } from 'react';
import { useLms } from '../../context/LmsContext';
import { KopSurat } from '../common/KopSurat';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  Maximize,
  Minimize,
  Type,
  HelpCircle,
  ShieldAlert,
  Menu,
  X,
  Eye,
} from 'lucide-react';

export const ExamCbtRoom: React.FC = () => {
  const {
    currentExam,
    examAnswers,
    examDoubtful,
    examViolations,
    examStartedAt,
    answerQuestion,
    toggleDoubtful,
    registerExamViolation,
    submitExam,
    exitExamEarly,
    currentUser,
    schoolConfig,
  } = useLms();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showCheatAlertModal, setShowCheatAlertModal] = useState(false);
  const [showMobileNavDrawer, setShowMobileNavDrawer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Remaining time in seconds
  const totalDurationSeconds = (currentExam?.durationMinutes || 45) * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    if (!examStartedAt) return totalDurationSeconds;
    const elapsedSeconds = Math.floor((Date.now() - examStartedAt) / 1000);
    const left = totalDurationSeconds - elapsedSeconds;
    return left > 0 ? left : 0;
  });

  // Countdown timer effect
  useEffect(() => {
    if (!currentExam) return;

    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when time runs out!
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentExam, submitExam]);

  // Anti-cheat detector: Visibility Change & Blur detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        registerExamViolation();
        setShowCheatAlertModal(true);
      }
    };

    const handleWindowBlur = () => {
      // Optional subtle warning on blur
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [registerExamViolation]);

  if (!currentExam || !currentUser) {
    return (
      <div className="p-8 text-center text-slate-600">
        <p>Tidak ada sesi ujian aktif.</p>
        <button
          onClick={exitExamEarly}
          className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const questions = currentExam.questions;
  const activeQuestion = questions[currentQuestionIndex];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = remainingSeconds < 300; // less than 5 minutes

  // Question stats
  const answeredCount = Object.keys(examAnswers).length;
  const doubtfulCount = Object.values(examDoubtful).filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;

  const getFontSizeClass = () => {
    switch (fontSizeLevel) {
      case 'large':
        return 'text-lg';
      case 'xlarge':
        return 'text-xl';
      default:
        return 'text-base';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col select-none">
      {/* CBT Fixed Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Exam Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              CBT
            </div>
            <div className="truncate max-w-[170px] sm:max-w-md">
              <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                {currentExam.title}
              </h1>
              <p className="text-[11px] text-slate-500 truncate">
                {currentUser.name} • {currentUser.className || `Kelas ${currentExam.gradeLevel}`}
              </p>
            </div>
          </div>

          {/* Center: Countdown Timer */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm sm:text-base font-bold transition shadow-xs ${
              isLowTime
                ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                : 'bg-slate-900 text-amber-300 border border-slate-800'
            }`}
          >
            <Clock className={`w-4 h-4 ${isLowTime ? 'text-rose-600' : 'text-amber-400'}`} />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          {/* Right: Controls & Drawer Toggle */}
          <div className="flex items-center gap-2">
            {/* Font Size Selector */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => setFontSizeLevel('normal')}
                className={`px-2 py-1 text-xs font-bold rounded ${
                  fontSizeLevel === 'normal' ? 'bg-white shadow-2xs text-blue-700' : 'text-slate-600'
                }`}
                title="Ukuran Font Normal"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSizeLevel('large')}
                className={`px-2 py-1 text-xs font-bold rounded ${
                  fontSizeLevel === 'large' ? 'bg-white shadow-2xs text-blue-700' : 'text-slate-600'
                }`}
                title="Ukuran Font Sedang"
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setFontSizeLevel('xlarge')}
                className={`px-2 py-1 text-xs font-bold rounded ${
                  fontSizeLevel === 'xlarge' ? 'bg-white shadow-2xs text-blue-700' : 'text-slate-600'
                }`}
                title="Ukuran Font Besar"
              >
                A++
              </button>
            </div>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              title="Layar Penuh"
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Mobile Navigator Drawer Toggle */}
            <button
              type="button"
              onClick={() => setShowMobileNavDrawer(true)}
              className="lg:hidden p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs flex items-center gap-1"
            >
              <Menu className="w-4 h-4" />
              <span>Daftar Soal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Examination Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center Area: Question & Options (8 Cols on Desktop) */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-6">
            {/* Kop Resmi Soal Ujian: Pemerintah Kab. Way Kanan - Dinas Pendidikan - UPT SMPN 2 Rebang Tangkas */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 sm:p-4">
              <KopSurat
                compact
                documentTitle={`NASKAH SOAL ASESMEN: ${currentExam.title.toUpperCase()}`}
                subTitle={`Mata Pelajaran: ${currentExam.subject} • Jenjang: Kelas ${currentExam.gradeLevel} • TP ${schoolConfig.academicYear} (Semester ${schoolConfig.currentSemester})`}
              />
            </div>

            {/* Question Header Status */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-extrabold text-sm">
                  Soal Nomor {currentQuestionIndex + 1}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  dari {questions.length} Soal
                </span>
              </div>

              <div className="flex items-center gap-3">
                {activeQuestion.topic && (
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                    Materi: {activeQuestion.topic}
                  </span>
                )}
                <span className="text-xs font-bold text-slate-700">
                  Bobot: {activeQuestion.score} Poin
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className={`text-slate-900 leading-relaxed font-normal ${getFontSizeClass()}`}>
              <p className="whitespace-pre-line">{activeQuestion.text}</p>
            </div>

            {/* Multiple Choice Options (A, B, C, D) */}
            <div className="space-y-3 pt-2">
              {activeQuestion.options.map(opt => {
                const isSelected = examAnswers[activeQuestion.id] === opt.label;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => answerQuestion(activeQuestion.id, opt.label)}
                    className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3.5 group cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-600 text-blue-950 ring-2 ring-blue-600/20 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Option Label Letter Circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-700'
                      }`}
                    >
                      {opt.label}
                    </div>

                    {/* Option Text */}
                    <div
                      className={`pt-1 font-medium leading-relaxed flex-1 ${getFontSizeClass()} ${
                        isSelected ? 'font-semibold text-blue-950' : 'text-slate-800'
                      }`}
                    >
                      {opt.text}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Navigation Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-wrap items-center justify-between gap-3">
            {/* Prev Question */}
            <button
              type="button"
              id="cbt-prev-btn"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                currentQuestionIndex === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {/* Ragu-ragu (Doubtful) Checkbox Button */}
            <button
              type="button"
              id="cbt-doubtful-btn"
              onClick={() => toggleDoubtful(activeQuestion.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border transition ${
                examDoubtful[activeQuestion.id]
                  ? 'bg-amber-400 border-amber-500 text-slate-950 font-extrabold shadow-xs'
                  : 'bg-white border-amber-300 text-amber-800 hover:bg-amber-50'
              }`}
            >
              <input
                type="checkbox"
                checked={!!examDoubtful[activeQuestion.id]}
                readOnly
                className="w-4 h-4 rounded text-amber-600 accent-amber-600 pointer-events-none"
              />
              <span>Ragu-ragu</span>
            </button>

            {/* Next or Finish */}
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                type="button"
                id="cbt-next-btn"
                onClick={() =>
                  setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))
                }
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1.5 shadow-xs"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                id="cbt-finish-btn"
                onClick={() => setShowSubmitModal(true)}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Selesaikan Ujian</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Sidebar: Question Grid Map (4 Cols on Desktop) */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sticky top-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-sm text-slate-900">Navigasi Nomor Soal</h2>
              <span className="text-xs text-slate-500">{questions.length} Butir</span>
            </div>

            {/* Number Grid */}
            <div className="grid grid-cols-5 gap-2.5 max-h-[360px] overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const isAnswered = !!examAnswers[q.id];
                const isDoubtful = !!examDoubtful[q.id];
                const isCurrent = idx === currentQuestionIndex;

                let colorClasses = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
                if (isDoubtful) {
                  colorClasses = 'bg-amber-400 text-slate-900 font-extrabold border-amber-500';
                } else if (isAnswered) {
                  colorClasses = 'bg-emerald-600 text-white font-bold border-emerald-700';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-11 rounded-xl font-bold text-xs flex flex-col items-center justify-center border transition relative ${colorClasses} ${
                      isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isAnswered && !isDoubtful && (
                      <span className="text-[10px] font-mono leading-none opacity-90">
                        {examAnswers[q.id]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Status Legend */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-3.5 h-3.5 rounded bg-emerald-600" />
                  <span>Sudah Dijawab</span>
                </div>
                <strong className="text-emerald-700">{answeredCount}</strong>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-3.5 h-3.5 rounded bg-amber-400" />
                  <span>Ragu-ragu</span>
                </div>
                <strong className="text-amber-700">{doubtfulCount}</strong>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-3.5 h-3.5 rounded bg-slate-200" />
                  <span>Belum Dijawab</span>
                </div>
                <strong className="text-slate-500">{unansweredCount}</strong>
              </div>
            </div>

            {/* Anti-cheat status pill */}
            {examViolations > 0 && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Pelanggaran tercatat: {examViolations}x</span>
              </div>
            )}

            {/* Final Submit Button */}
            <button
              type="button"
              id="cbt-sidebar-submit-btn"
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Kirimkan Hasil Ujian</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer for Question Navigation */}
      {showMobileNavDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-4/5 max-w-sm h-full p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-extrabold text-sm text-slate-900">Daftar Nomor Soal</h3>
                <button
                  type="button"
                  onClick={() => setShowMobileNavDrawer(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto p-1">
                {questions.map((q, idx) => {
                  const isAnswered = !!examAnswers[q.id];
                  const isDoubtful = !!examDoubtful[q.id];
                  const isCurrent = idx === currentQuestionIndex;

                  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
                  if (isDoubtful) colorClasses = 'bg-amber-400 text-slate-900 font-bold border-amber-500';
                  else if (isAnswered) colorClasses = 'bg-emerald-600 text-white font-bold border-emerald-700';

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setCurrentQuestionIndex(idx);
                        setShowMobileNavDrawer(false);
                      }}
                      className={`h-11 rounded-xl text-xs font-bold border flex flex-col items-center justify-center ${colorClasses} ${
                        isCurrent ? 'ring-2 ring-blue-600' : ''
                      }`}
                    >
                      <span>{idx + 1}</span>
                      {isAnswered && !isDoubtful && (
                        <span className="text-[10px] font-mono leading-none">{examAnswers[q.id]}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowMobileNavDrawer(false);
                setShowSubmitModal(true);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Selesaikan Ujian</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal to Submit Exam */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-amber-600 pb-2 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Konfirmasi Selesai Ujian</h3>
                <p className="text-xs text-slate-500">Periksa kembali jawaban sebelum mengirim</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>Total Soal:</span>
                <strong>{questions.length} Butir</strong>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Sudah Dijawab:</span>
                <strong>{answeredCount} Butir</strong>
              </div>
              <div className="flex justify-between text-amber-700 font-semibold">
                <span>Masih Ragu-ragu:</span>
                <strong>{doubtfulCount} Butir</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Belum Dijawab:</span>
                <strong className={unansweredCount > 0 ? 'text-rose-600' : ''}>
                  {unansweredCount} Butir
                </strong>
              </div>
            </div>

            {unansweredCount > 0 && (
              <p className="text-xs text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                ⚠️ Peringatan: Masih terdapat {unansweredCount} soal yang belum Anda jawab!
              </p>
            )}

            <p className="text-xs text-slate-600">
              Apakah Anda yakin ingin menyelesaikan ujian sekarang? Jawaban yang sudah dikirimkan tidak dapat diubah kembali.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Lanjutkan Mengerjakan
              </button>
              <button
                type="button"
                id="btn-confirm-submit-exam"
                onClick={() => {
                  setShowSubmitModal(false);
                  submitExam();
                }}
                className="px-5 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Ya, Kirimkan Jawaban</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Anti-Cheat Warning Modal */}
      {showCheatAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in zoom-in-95">
          <div className="bg-white rounded-2xl border-2 border-rose-500 shadow-2xl max-w-md w-full p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center ring-8 ring-rose-50">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                PERINGATAN INTEGRITAS SISTEM CBT!
              </h3>
              <p className="text-xs text-rose-600 font-bold mt-1">
                Pelanggaran Terdeteksi: Meninggalkan Halaman / Berpindah Jendela
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              Sistem mencatat bahwa Anda telah berpindah tab atau meminimize jendela ujian. Tindakan
              ini tercatat dalam log pengawasan guru pengampu (Pelanggaran Ke-
              <strong className="text-rose-700 font-black">{examViolations}</strong>).
            </p>

            <button
              type="button"
              id="btn-dismiss-cheat-alert"
              onClick={() => setShowCheatAlertModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
            >
              Saya Mengerti & Kembali ke Soal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
