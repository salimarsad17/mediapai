import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import {
  Sparkles,
  Gamepad2,
  Video,
  Layers,
  FileQuestion,
  BookOpen,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  Play,
  Check,
} from 'lucide-react';
import { BahanAjarItem } from '../../types';

export const TugasSiswaView: React.FC = () => {
  const { bahanAjarList, currentUser } = useLms();

  // Crucial requirement: HANYA TAMPIL TUGAS YANG SUDAH DIKIRIM OLEH GURU!
  const sentTasks = bahanAjarList.filter(b => b.isSentToStudents);

  const [activeTask, setActiveTask] = useState<BahanAjarItem | null>(null);

  // Game Battle state
  const [currentBattleQuestionIdx, setCurrentBattleQuestionIdx] = useState(0);
  const [battleScore, setBattleScore] = useState(0);
  const [isBattleFinished, setIsBattleFinished] = useState(false);
  const [selectedBattleOption, setSelectedBattleOption] = useState<number | null>(null);

  // Puzzle state
  const [puzzleItems, setPuzzleItems] = useState<string[]>([]);
  const [puzzleTarget, setPuzzleTarget] = useState<string[]>([]);
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);

  // TTS state
  const [ttsAnswers, setTtsAnswers] = useState<Record<number, string>>({});
  const [isTtsSubmitted, setIsTtsSubmitted] = useState(false);

  // LKPD / LMS response
  const [lkpdAnswer, setLkpdAnswer] = useState('');
  const [isLkpdSubmitted, setIsLkpdSubmitted] = useState(false);

  const handleOpenTask = (task: BahanAjarItem) => {
    setActiveTask(task);
    // Reset mini-game states
    if (task.tipe === 'game_battle' && task.gameData?.questions) {
      setCurrentBattleQuestionIdx(0);
      setBattleScore(0);
      setIsBattleFinished(false);
      setSelectedBattleOption(null);
    }
    if (task.tipe === 'puzzle' && task.gameData?.pieces) {
      setPuzzleItems([...task.gameData.pieces]);
      setPuzzleTarget([]);
      setIsPuzzleSolved(false);
    }
    if (task.tipe === 'tts') {
      setTtsAnswers({});
      setIsTtsSubmitted(false);
    }
    setIsLkpdSubmitted(false);
  };

  const handleBattleAnswer = (optionIdx: number, correctIdx: number) => {
    setSelectedBattleOption(optionIdx);
    if (optionIdx === correctIdx) {
      setBattleScore(prev => prev + 20);
    }
    setTimeout(() => {
      if (
        activeTask?.gameData?.questions &&
        currentBattleQuestionIdx + 1 < activeTask.gameData.questions.length
      ) {
        setCurrentBattleQuestionIdx(prev => prev + 1);
        setSelectedBattleOption(null);
      } else {
        setIsBattleFinished(true);
      }
    }, 700);
  };

  const handleSelectPuzzlePiece = (piece: string) => {
    setPuzzleTarget(prev => [...prev, piece]);
    setPuzzleItems(prev => prev.filter(p => p !== piece));

    // Check if matching correctOrder
    const newTarget = [...puzzleTarget, piece];
    if (activeTask?.gameData?.correctOrder) {
      if (
        newTarget.length === activeTask.gameData.correctOrder.length &&
        newTarget.every((val, idx) => val === activeTask.gameData.correctOrder[idx])
      ) {
        setIsPuzzleSolved(true);
      }
    }
  };

  const handleResetPuzzle = () => {
    if (activeTask?.gameData?.pieces) {
      setPuzzleItems([...activeTask.gameData.pieces]);
      setPuzzleTarget([]);
      setIsPuzzleSolved(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>TUGAS & BAHAN AJAR AKTIF DARI GURU PAI</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">
          Tugas Siswa Interaktif PAI
        </h1>
        <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
          Semua materi, video pembelajaran, game battle, teka-teki silang (TTS), puzzle, LKPD, dan LMS yang telah dikirim oleh Guru PAI dapat dikerjakan secara langsung di sini.
        </p>
      </div>

      {sentTasks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Belum Ada Tugas yang Dikirim oleh Guru
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Bahan ajar dan kuis interaktif akan otomatis muncul di sini setelah Guru PAI menekan tombol <strong>"Kirim ke Siswa"</strong>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sentTasks.map(task => (
            <div
              key={task.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3.5 hover:shadow-lg hover:border-blue-400 transition flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 flex items-center gap-1">
                    {task.tipe === 'game_battle' && <Gamepad2 className="w-3 h-3 text-blue-600" />}
                    {task.tipe === 'video' && <Video className="w-3 h-3 text-red-600" />}
                    {task.tipe === 'tts' && <Layers className="w-3 h-3 text-indigo-600" />}
                    {task.tipe === 'puzzle' && <FileQuestion className="w-3 h-3 text-amber-600" />}
                    {task.tipe.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Siap Dikerjakan
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {task.judul}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {task.deskripsi}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {task.durasiMenit || 30} Menit
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3 h-3" /> Bobot {task.bobotNilai || 100} Poin
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  id={`btn-kerjakan-${task.id}`}
                  onClick={() => handleOpenTask(task)}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Buka & Kerjakan Tugas</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TASK MODAL / WORKSPACE */}
      {activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                  {activeTask.tipe.toUpperCase()}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  {activeTask.judul}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTask(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>

            {/* Content By Type */}
            {/* 1. GAME BATTLE PAI */}
            {activeTask.tipe === 'game_battle' && (
              <div className="space-y-4">
                {!isBattleFinished ? (
                  activeTask.gameData?.questions ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>
                          Soal {currentBattleQuestionIdx + 1} dari{' '}
                          {activeTask.gameData.questions.length}
                        </span>
                        <span className="text-blue-600 font-black">
                          Skor Saat Ini: {battleScore}
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-slate-900 font-bold text-sm leading-relaxed">
                        {activeTask.gameData.questions[currentBattleQuestionIdx].q}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        {activeTask.gameData.questions[
                          currentBattleQuestionIdx
                        ].options.map((opt: string, i: number) => {
                          const isCorrect =
                            i ===
                            activeTask.gameData.questions[currentBattleQuestionIdx].correct;
                          const isSelected = selectedBattleOption === i;
                          return (
                            <button
                              key={i}
                              type="button"
                              disabled={selectedBattleOption !== null}
                              onClick={() =>
                                handleBattleAnswer(
                                  i,
                                  activeTask.gameData.questions[currentBattleQuestionIdx].correct
                                )
                              }
                              className={`p-3 rounded-xl border text-left font-bold transition flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? isCorrect
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-red-600 text-white border-red-600'
                                  : 'bg-slate-50 hover:bg-blue-50 border-slate-200 text-slate-800'
                              }`}
                            >
                              <span>
                                {String.fromCharCode(65 + i)}. {opt}
                              </span>
                              {isSelected && (
                                <span>{isCorrect ? '✓ Benar' : '✗ Salah'}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600">Kuis battle sedang disiapkan.</p>
                  )
                ) : (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-md">
                      ✓
                    </div>
                    <h4 className="text-lg font-black text-slate-900">
                      Game Battle PAI Selesai!
                    </h4>
                    <p className="text-sm font-bold text-emerald-800">
                      Skor Akhir Kamu: {battleScore} / 100
                    </p>
                    <p className="text-xs text-slate-600">
                      {battleScore >= 75
                        ? 'Masya Allah! Nilai kamu tuntas KKM dengan sangat baik.'
                        : 'Tetap semangat! Tingkatkan kembali pemahaman materi agama Islam.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 2. TEKA-TEKI SILANG (TTS) */}
            {activeTask.tipe === 'tts' && (
              <div className="space-y-4 text-xs">
                <p className="text-slate-600">
                  Isilah teka-teki silang istilah PAI di bawah ini dengan huruf kapital:
                </p>

                <div className="space-y-3">
                  {activeTask.gameData?.clues?.map((clue: any) => (
                    <div
                      key={clue.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-700">
                        <span className="text-blue-700">
                          {clue.num}. {clue.direction} ({clue.answer.length} Huruf)
                        </span>
                        {isTtsSubmitted && (
                          <span
                            className={`font-black ${
                              (ttsAnswers[clue.id] || '').toUpperCase() === clue.answer
                                ? 'text-emerald-600'
                                : 'text-red-600'
                            }`}
                          >
                            {(ttsAnswers[clue.id] || '').toUpperCase() === clue.answer
                              ? '✓ Tepat'
                              : `Jawaban: ${clue.answer}`}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-800 font-medium">{clue.clue}</p>
                      <input
                        type="text"
                        maxLength={clue.answer.length}
                        value={ttsAnswers[clue.id] || ''}
                        disabled={isTtsSubmitted}
                        onChange={e =>
                          setTtsAnswers({ ...ttsAnswers, [clue.id]: e.target.value.toUpperCase() })
                        }
                        placeholder={`Ketik ${clue.answer.length} huruf...`}
                        className="w-full px-3 py-1.5 uppercase font-mono font-bold tracking-widest border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>

                {!isTtsSubmitted ? (
                  <button
                    type="button"
                    onClick={() => setIsTtsSubmitted(true)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                  >
                    Periksa Jawaban TTS
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-center">
                    Teka-Teki Silang PAI telah selesai diperiksa!
                  </div>
                )}
              </div>
            )}

            {/* 3. PUZZLE SUSUN AYAT */}
            {activeTask.tipe === 'puzzle' && (
              <div className="space-y-4 text-xs">
                <p className="text-slate-600 font-medium">
                  Tarik / klik potongan kata acak berikut agar tersusun menjadi ayat yang benar:
                </p>

                {/* Target Drop Zone */}
                <div className="p-4 rounded-2xl bg-blue-50 border-2 border-dashed border-blue-300 min-h-20 flex flex-wrap items-center justify-center gap-2">
                  {puzzleTarget.length === 0 ? (
                    <span className="text-slate-400 italic">
                      Klik potongan kata di bawah untuk menyusun di sini...
                    </span>
                  ) : (
                    puzzleTarget.map((pt, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-serif font-bold text-sm shadow-xs"
                      >
                        {pt}
                      </span>
                    ))
                  )}
                </div>

                {/* Pieces */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-700 block">Potongan Kata Tersedia:</span>
                  <div className="flex flex-wrap gap-2">
                    {puzzleItems.map((piece, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectPuzzlePiece(piece)}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-blue-100 border border-slate-300 text-slate-800 font-serif font-bold text-sm cursor-pointer transition shadow-xs"
                      >
                        {piece}
                      </button>
                    ))}
                  </div>
                </div>

                {isPuzzleSolved && (
                  <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-center font-bold">
                    🎉 Masya Allah! Susunan ayat suci telah tersusun dengan sempurna dan tepat!
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleResetPuzzle}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    Reset Susunan
                  </button>
                </div>
              </div>
            )}

            {/* 4. MATERI / VIDEO / LKPD / LMS */}
            {(activeTask.tipe === 'materi' ||
              activeTask.tipe === 'video' ||
              activeTask.tipe === 'lkpd' ||
              activeTask.tipe === 'lms') && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 leading-relaxed text-slate-800 whitespace-pre-line">
                  {activeTask.kontenUtama}
                </div>

                {/* Form Respon / Tugas LKPD */}
                {(activeTask.tipe === 'lkpd' || activeTask.tipe === 'lms') && (
                  <div className="space-y-2">
                    <label className="block font-bold text-slate-800">
                      Tuliskan Jawaban / Refleksi Kamu:
                    </label>
                    <textarea
                      rows={4}
                      value={lkpdAnswer}
                      onChange={e => setLkpdAnswer(e.target.value)}
                      disabled={isLkpdSubmitted}
                      placeholder="Ketik tanggapan atau analisis tugas di sini..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    {!isLkpdSubmitted ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (lkpdAnswer.trim()) setIsLkpdSubmitted(true);
                        }}
                        className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                      >
                        Kirim Jawaban ke Guru
                      </button>
                    ) : (
                      <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold flex items-center gap-2">
                        <Check className="w-4 h-4" /> Jawaban tugasmu telah berhasil dikirim ke Guru PAI!
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
