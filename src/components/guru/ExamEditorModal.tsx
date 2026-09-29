import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { KopSurat } from '../common/KopSurat';
import { Exam, GradeLevel, Question, QuestionOption } from '../../types';
import {
  Plus,
  Trash2,
  Save,
  X,
  Sparkles,
  HelpCircle,
  Clock,
  CheckCircle2,
  Shuffle,
  BookOpen,
} from 'lucide-react';

interface ExamEditorModalProps {
  examToEdit?: Exam | null;
  onClose: () => void;
}

export const ExamEditorModal: React.FC<ExamEditorModalProps> = ({ examToEdit, onClose }) => {
  const { addExam, updateExam, currentUser } = useLms();

  const [title, setTitle] = useState(examToEdit?.title || '');
  const [subject, setSubject] = useState(
    examToEdit?.subject || currentUser?.subject || 'Ilmu Pengetahuan Alam (IPA)'
  );
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>(examToEdit?.gradeLevel || '7');
  const [targetClasses, setTargetClasses] = useState(
    examToEdit?.targetClasses.join(', ') || `${examToEdit?.gradeLevel || '7'}A, ${examToEdit?.gradeLevel || '7'}B`
  );
  const [durationMinutes, setDurationMinutes] = useState(examToEdit?.durationMinutes || 45);
  const [passingGrade, setPassingGrade] = useState(examToEdit?.passingGrade || 75);
  const [token, setToken] = useState(
    examToEdit?.token || `SMPN${Math.floor(100 + Math.random() * 900)}`
  );
  const [instructions, setInstructions] = useState(
    examToEdit?.instructions ||
      '1. Berdoalah sebelum mengerjakan.\n2. Dilarang membuka tab atau aplikasi lain.\n3. Kerjakan dengan jujur dan teliti.'
  );
  const [isPublished, setIsPublished] = useState(examToEdit ? examToEdit.isPublished : true);

  const [questions, setQuestions] = useState<Question[]>(
    examToEdit?.questions || [
      {
        id: `q-new-1`,
        text: 'Tuliskan butir pertanyaan ujian di sini...',
        options: [
          { id: 'opt-a', label: 'A', text: 'Pilihan jawaban A' },
          { id: 'opt-b', label: 'B', text: 'Pilihan jawaban B' },
          { id: 'opt-c', label: 'C', text: 'Pilihan jawaban C' },
          { id: 'opt-d', label: 'D', text: 'Pilihan jawaban D' },
        ],
        correctAnswer: 'A',
        explanation: 'Penjelasan mengapa jawaban A adalah yang paling tepat.',
        score: 25,
        topic: 'Materi Pembelajaran',
      },
    ]
  );

  const [errorMsg, setErrorMsg] = useState('');

  const generateRandomToken = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = '';
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setToken(res);
  };

  const handleAddQuestion = () => {
    const newQ: Question = {
      id: `q-${Date.now()}`,
      text: '',
      options: [
        { id: `opt-a-${Date.now()}`, label: 'A', text: '' },
        { id: `opt-b-${Date.now()}`, label: 'B', text: '' },
        { id: `opt-c-${Date.now()}`, label: 'C', text: '' },
        { id: `opt-d-${Date.now()}`, label: 'D', text: '' },
      ],
      correctAnswer: 'A',
      explanation: '',
      score: 20,
      topic: 'Umum',
    };
    setQuestions(prev => [...prev, newQ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert('Ujian minimal harus memiliki minimal 1 butir soal.');
      return;
    }
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    setQuestions(prev => {
      const next = [...prev];
      next[index].text = text;
      return next;
    });
  };

  const handleOptionTextChange = (
    qIndex: number,
    optLabel: 'A' | 'B' | 'C' | 'D',
    text: string
  ) => {
    setQuestions(prev => {
      const next = [...prev];
      const opt = next[qIndex].options.find(o => o.label === optLabel);
      if (opt) opt.text = text;
      return next;
    });
  };

  const handleCorrectAnswerChange = (qIndex: number, label: 'A' | 'B' | 'C' | 'D') => {
    setQuestions(prev => {
      const next = [...prev];
      next[qIndex].correctAnswer = label;
      return next;
    });
  };

  const handleExplanationChange = (qIndex: number, explanation: string) => {
    setQuestions(prev => {
      const next = [...prev];
      next[qIndex].explanation = explanation;
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Judul ujian tidak boleh kosong.');
      return;
    }

    if (questions.length === 0) {
      setErrorMsg('Minimal harus ada 1 butir soal.');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) {
        setErrorMsg(`Soal nomor ${i + 1} belum memiliki teks pertanyaan.`);
        return;
      }
    }

    const classArray = targetClasses
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    if (examToEdit) {
      updateExam({
        ...examToEdit,
        title,
        subject,
        gradeLevel,
        targetClasses: classArray.length > 0 ? classArray : [`${gradeLevel}A`],
        durationMinutes: Number(durationMinutes),
        passingGrade: Number(passingGrade),
        token: token.toUpperCase(),
        instructions,
        isPublished,
        questions,
      });
    } else {
      addExam({
        title,
        subject,
        gradeLevel,
        targetClasses: classArray.length > 0 ? classArray : [`${gradeLevel}A`],
        durationMinutes: Number(durationMinutes),
        passingGrade: Number(passingGrade),
        token: token.toUpperCase(),
        instructions,
        isPublished,
        questions,
        teacherId: currentUser?.id || 'guru-1',
        teacherName: currentUser?.name || 'Guru Mata Pelajaran',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full my-8 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {examToEdit ? 'Edit Data Ujian & Soal' : 'Buat Ujian Baru (Kelas 7, 8, atau 9)'}
              </h2>
              <p className="text-xs text-slate-500">
                Konfigurasi jadwal, durasi, KKM, dan bank soal terpadu
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b pb-1">
              1. Identitas Ujian & Sasaran Siswa
            </h3>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Judul Ujian Asesmen</label>
              <input
                type="text"
                id="exam-title-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Contoh: Penilaian Akhir Semester IPA Kelas 7"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jenjang Kelas SMPN</label>
                <select
                  id="exam-grade-select"
                  value={gradeLevel}
                  onChange={e => setGradeLevel(e.target.value as GradeLevel)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                >
                  <option value="7">Kelas 7 (Fase D)</option>
                  <option value="8">Kelas 8</option>
                  <option value="9">Kelas 9 (Ujian Akhir)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="IPA / Matematika / dll"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Kelas / Rombel</label>
                <input
                  type="text"
                  value={targetClasses}
                  onChange={e => setTargetClasses(e.target.value)}
                  placeholder="7A, 7B, 7C"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Section 2: Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Durasi Pengerjaan (Menit)</label>
                <input
                  type="number"
                  min="10"
                  max="180"
                  value={durationMinutes}
                  onChange={e => setDurationMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">KKM / Nilai Minimal</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={passingGrade}
                  onChange={e => setPassingGrade(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kode Token Ujian</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={token}
                    onChange={e => setToken(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 font-mono font-bold uppercase border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={generateRandomToken}
                    title="Acak Kode Token"
                    className="px-2.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Petunjuk Pengerjaan Soal</label>
              <textarea
                rows={2}
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="check-published"
                checked={isPublished}
                onChange={e => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <label htmlFor="check-published" className="font-bold text-slate-800 text-xs">
                Publikasikan Ujian Sekarang (Langsung dapat dilihat oleh siswa Kelas {gradeLevel})
              </label>
            </div>
          </div>

          {/* Section 3: Questions List Builder */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            {/* Kop Soal Resmi UPT SMPN 2 Rebang Tangkas */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4">
              <KopSurat
                compact
                documentTitle={`FORMAT KOP RESMI SOAL UJIAN - TINGKAT KELAS ${gradeLevel}`}
                subTitle={`Mata Pelajaran: ${subject || 'Semua Mapel'} • Format Resmi UPT SMPN 2 Rebang Tangkas`}
              />
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Daftar Butir Soal Pilihan Ganda ({questions.length} Butir)
              </h3>
              <button
                type="button"
                id="btn-add-question"
                onClick={handleAddQuestion}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-emerald-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Soal</span>
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <div
                  key={q.id || qIndex}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-800 text-sm">
                      Soal #{qIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Soal</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Pertanyaan
                    </label>
                    <textarea
                      rows={2}
                      value={q.text}
                      onChange={e => handleQuestionTextChange(qIndex, e.target.value)}
                      placeholder="Masukkan teks soal..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                      required
                    />
                  </div>

                  {/* Options A, B, C, D */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-600">
                      Opsi Jawaban & Kunci:
                    </label>
                    {q.options.map(opt => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <label
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer ${
                            q.correctAnswer === opt.label
                              ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                              : 'bg-white border border-slate-300 text-slate-700'
                          }`}
                          title="Klik untuk jadikan kunci jawaban"
                          onClick={() => handleCorrectAnswerChange(qIndex, opt.label)}
                        >
                          {opt.label}
                        </label>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={e =>
                            handleOptionTextChange(qIndex, opt.label, e.target.value)
                          }
                          placeholder={`Teks pilihan jawaban ${opt.label}...`}
                          className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          required
                        />
                        {q.correctAnswer === opt.label && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            Kunci Jawaban
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Penjelasan / Pembahasan Guru (opsional)
                    </label>
                    <input
                      type="text"
                      value={q.explanation}
                      onChange={e => handleExplanationChange(qIndex, e.target.value)}
                      placeholder="Uraian pembahasan materi..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              id="btn-save-exam"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Ujian</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
