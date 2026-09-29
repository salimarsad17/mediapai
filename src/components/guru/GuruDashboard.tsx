import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { Exam, GradeLevel } from '../../types';
import { ExamEditorModal } from './ExamEditorModal';
import { ExamGradingResults } from './ExamGradingResults';
import {
  BookOpen,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  Edit,
  Trash2,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Award,
} from 'lucide-react';

export const GuruDashboard: React.FC = () => {
  const { currentUser, exams, submissions, deleteExam, togglePublishExam, schoolConfig } = useLms();

  const [activeTab, setActiveTab] = useState<'exams' | 'grading'>('exams');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [examToEdit, setExamToEdit] = useState<Exam | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  if (!currentUser) return null;

  // Filter exams by grade
  const filteredExams = exams.filter(e => {
    if (selectedGrade !== 'all' && e.gradeLevel !== selectedGrade) return false;
    return true;
  });

  const handleCopyToken = (token: string) => {
    navigator.clipboard?.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleCreateNew = () => {
    setExamToEdit(null);
    setIsEditorOpen(true);
  };

  const handleEditExam = (exam: Exam) => {
    setExamToEdit(exam);
    setIsEditorOpen(true);
  };

  const handleDelete = (exam: Exam) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ujian "${exam.title}"?`)) {
      deleteExam(exam.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Guru Hero Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={
              currentUser.avatar ||
              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
            }
            alt={currentUser.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                PORTAL GURU & PENGUJI CBT
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
                {currentUser.subject || 'Guru Mata Pelajaran'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1 text-white tracking-tight">
              {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              NIP: <span className="font-mono text-white">{currentUser.identifier}</span> • {schoolConfig.name}
            </p>
          </div>
        </div>

        <button
          type="button"
          id="btn-create-exam-top"
          onClick={handleCreateNew}
          className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center gap-2 shadow-sm self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Buat Ujian Baru (Kls 7/8/9)</span>
        </button>
      </div>

      {/* Main Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="tab-guru-exams"
            onClick={() => setActiveTab('exams')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'exams'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Kelola Bank Soal & Ujian</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'exams' ? 'bg-emerald-900 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {exams.length}
            </span>
          </button>

          <button
            type="button"
            id="tab-guru-grading"
            onClick={() => setActiveTab('grading')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'grading'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Rekapitulasi Nilai Siswa</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'grading' ? 'bg-emerald-900 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {submissions.length}
            </span>
          </button>
        </div>

        {/* Grade Level Selector */}
        {activeTab === 'exams' && (
          <div className="flex items-center gap-1.5 self-end sm:self-auto bg-slate-100 p-1 rounded-xl text-xs">
            <span className="text-slate-500 font-medium px-2">Jenjang:</span>
            {['all', '7', '8', '9'].map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedGrade(lvl)}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  selectedGrade === lvl
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl === 'all' ? 'Semua' : `Kelas ${lvl}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab Content: Exam Manager */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Daftar Ujian CBT Aktif & Terjadwal
            </h2>
            <span className="text-xs text-slate-500">
              Menampilkan {filteredExams.length} asesmen pembelajaran
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExams.map(exam => {
              const submissionCount = submissions.filter(s => s.examId === exam.id).length;

              return (
                <div
                  key={exam.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Grade & Publish toggle */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-blue-50 text-blue-800 border border-blue-200">
                        Kelas {exam.gradeLevel} ({exam.targetClasses.join(', ')})
                      </span>

                      <button
                        type="button"
                        onClick={() => togglePublishExam(exam.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition ${
                          exam.isPublished
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Klik untuk ubah status publikasi"
                      >
                        {exam.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Dipublikasikan</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Draft (Nonaktif)</span>
                          </>
                        )}
                      </button>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base mt-2 line-clamp-2">
                      {exam.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500">{exam.subject}</p>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-3 gap-2 mt-4 py-2.5 border-y border-slate-100 text-center text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">WAKTU</span>
                        <strong className="text-slate-800">{exam.durationMinutes} mnt</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">SOAL</span>
                        <strong className="text-slate-800">{exam.questions.length} butir</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">KKM</span>
                        <strong className="text-slate-800">{exam.passingGrade}</strong>
                      </div>
                    </div>

                    {/* Token bar */}
                    <div className="mt-3 p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-500">Token:</span>
                        <code className="font-mono font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {exam.token}
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyToken(exam.token)}
                        className="text-slate-500 hover:text-emerald-700 text-[11px] font-bold flex items-center gap-1"
                      >
                        {copiedToken === exam.token ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-2">
                      Peserta mengerjakan: <strong className="text-slate-800">{submissionCount} siswa</strong>
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditExam(exam)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit & Soal</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('grading');
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
                      >
                        Lihat Nilai
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(exam)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                        title="Hapus Ujian"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content: Grading & Analytics */}
      {activeTab === 'grading' && <ExamGradingResults />}

      {/* Exam Editor Modal */}
      {isEditorOpen && (
        <ExamEditorModal examToEdit={examToEdit} onClose={() => setIsEditorOpen(false)} />
      )}
    </div>
  );
};
