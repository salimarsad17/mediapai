import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { PaiModule, GradeLevel } from '../../types';
import {
  BookOpen,
  Plus,
  BookMarked,
  Sparkles,
  CheckCircle2,
  Trash2,
  Search,
  Filter,
  Volume2,
  Check,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const MateriPaiView: React.FC = () => {
  const { currentUser, modules, addModule, deleteModule, showToast } = useLms();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [activeModule, setActiveModule] = useState<PaiModule | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // New module form state (for Guru)
  const [newTitle, setNewTitle] = useState('');
  const [newArabicTitle, setNewArabicTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'quran_hadis' | 'akidah' | 'akhlak' | 'fikih' | 'tarikh'>('quran_hadis');
  const [newGrade, setNewGrade] = useState<GradeLevel>('7');
  const [newDescription, setNewDescription] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newArabicText, setNewArabicText] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [newKeyPoints, setNewKeyPoints] = useState('');

  const filteredModules = modules.filter(m => {
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    if (selectedGrade !== 'all' && m.gradeLevel !== selectedGrade) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchDesc = m.description.toLowerCase().includes(q);
      return matchTitle || matchDesc;
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    addModule({
      title: newTitle.trim(),
      arabicTitle: newArabicTitle.trim() || undefined,
      category: newCategory,
      gradeLevel: newGrade,
      semester: 'Ganjil',
      description: newDescription.trim(),
      content: newContent.trim() || newDescription.trim(),
      versesOrHadits: newArabicText.trim()
        ? [
            {
              arabic: newArabicText.trim(),
              translation: newTranslation.trim() || 'Terjemahan ayat/hadits.',
              source: 'Dalil Referensi PAI',
            },
          ]
        : undefined,
      keyPoints: newKeyPoints
        .split('\n')
        .map(p => p.trim())
        .filter(Boolean),
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewArabicTitle('');
    setNewDescription('');
    setNewContent('');
    setNewArabicText('');
    setNewTranslation('');
    setNewKeyPoints('');
  };

  const getCategoryBadge = (cat: PaiModule['category']) => {
    switch (cat) {
      case 'quran_hadis':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Al-Qur'an & Hadis</span>;
      case 'akidah':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Akidah</span>;
      case 'akhlak':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Akhlak Mulia</span>;
      case 'fikih':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Fikih Ibadah</span>;
      case 'tarikh':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">Tarikh / Sejarah Islam</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 mb-2">
            <BookMarked className="w-3.5 h-3.5" />
            <span>MODUL & SUMBER BELAJAR PAI BP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Materi Pembelajaran Pendidikan Agama Islam
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
            Kumpulan bahan ajar digital terpadu Kurikulum Merdeka PAI: Al-Qur'an, Akidah, Akhlak Terpuji, Fikih Ibadah, dan Sejarah Peradaban Islam untuk Kelas 7, 8, dan 9.
          </p>
        </div>

        {currentUser?.role === 'guru' && (
          <button
            type="button"
            id="btn-add-module"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition flex items-center gap-2 shadow-md shrink-0"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Tambah Modul PAI</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari materi, judul surah, atau topik pembahasan..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg bg-slate-50 border border-slate-200 font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Kategori</option>
            <option value="quran_hadis">Al-Qur'an & Hadis</option>
            <option value="akidah">Akidah</option>
            <option value="fikih">Fikih Ibadah</option>
            <option value="akhlak">Akhlak Mulia</option>
            <option value="tarikh">Tarikh / Sejarah Islam</option>
          </select>

          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg bg-slate-50 border border-slate-200 font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Tingkat</option>
            <option value="7">Kelas 7</option>
            <option value="8">Kelas 8</option>
            <option value="9">Kelas 9</option>
          </select>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModules.map(mod => (
          <div
            key={mod.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden group"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                {getCategoryBadge(mod.category)}
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  Kelas {mod.gradeLevel}
                </span>
              </div>

              {mod.arabicTitle && (
                <p className="text-right font-serif text-lg font-bold text-emerald-800 tracking-wider">
                  {mod.arabicTitle}
                </p>
              )}

              <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition leading-snug">
                {mod.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {mod.description}
              </p>

              {mod.keyPoints && mod.keyPoints.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Poin Utama:
                  </span>
                  {mod.keyPoints.slice(0, 2).map((point, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{point}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                id={`btn-read-module-${mod.id}`}
                onClick={() => setActiveModule(mod)}
                className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Pelajari Materi Lengkap</span>
              </button>

              {currentUser?.role === 'guru' && (
                <button
                  type="button"
                  title="Hapus Modul"
                  onClick={() => {
                    deleteModule(mod.id);
                    showToast(`Modul "${mod.title}" berhasil dihapus`, 'info');
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer active:scale-90 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <BookMarked className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Tidak ada materi PAI yang sesuai dengan filter.</p>
          <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau ubah kategori.</p>
        </div>
      )}

      {/* Reader Modal (Full Material View) */}
      {activeModule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  {getCategoryBadge(activeModule.category)}
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white">
                    Kelas {activeModule.gradeLevel} (Semester {activeModule.semester})
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {activeModule.title}
                </h2>
                {activeModule.arabicTitle && (
                  <p className="font-serif text-lg font-bold text-emerald-200 mt-1">
                    {activeModule.arabicTitle}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActiveModule(null)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm leading-relaxed">
              {/* Dalil Ayat / Hadits Box */}
              {activeModule.versesOrHadits && activeModule.versesOrHadits.length > 0 && (
                <div className="space-y-4">
                  {activeModule.versesOrHadits.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                          Dalil Al-Qur'an / Hadis: {item.source}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setAudioPlaying(!audioPlaying);
                            setTimeout(() => setAudioPlaying(false), 3000);
                          }}
                          className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition ${
                            audioPlaying
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{audioPlaying ? 'Memutar Murottal...' : 'Simulasi Audio'}</span>
                        </button>
                      </div>

                      <p className="font-serif text-xl sm:text-2xl text-right leading-loose text-slate-900 tracking-wide pt-2">
                        {item.arabic}
                      </p>

                      {item.transliteration && (
                        <p className="text-xs italic text-slate-600 pt-1">
                          "{item.transliteration}"
                        </p>
                      )}

                      <div className="pt-2 border-t border-emerald-200/60">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-0.5">
                          Terjemahan:
                        </span>
                        <p className="text-xs sm:text-sm text-slate-700">
                          {item.translation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Main Content */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-1">
                  Uraian Pembahasan Materi
                </h4>
                <div className="whitespace-pre-line text-slate-700 leading-relaxed text-xs sm:text-sm">
                  {activeModule.content}
                </div>
              </div>

              {/* Key Takeaways */}
              {activeModule.keyPoints && activeModule.keyPoints.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-800">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Rangkuman Inti Pelajaran</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {activeModule.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModule(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white transition"
              >
                Tutup Pembahasan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Module Modal (GURU ONLY) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
            <div className="p-5 bg-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-emerald-200" />
                <h3 className="font-bold text-base">Tambah Modul Pembelajaran PAI</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-emerald-200 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Modul PAI *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Meraih Keberkahan dengan Salat Berjamaah"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Pembahasan
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    <option value="quran_hadis">Al-Qur'an & Hadis</option>
                    <option value="akidah">Akidah</option>
                    <option value="fikih">Fikih Ibadah</option>
                    <option value="akhlak">Akhlak Mulia</option>
                    <option value="tarikh">Tarikh Islam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tingkat Kelas
                  </label>
                  <select
                    value={newGrade}
                    onChange={e => setNewGrade(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    <option value="7">Kelas 7</option>
                    <option value="8">Kelas 8</option>
                    <option value="9">Kelas 9</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul Bahasa Arab (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: صَلَاةُ الجَمَاعَةِ"
                    value={newArabicTitle}
                    onChange={e => setNewArabicTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-serif"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Ringkas *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Ringkasan singkat materi yang akan dipelajari..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Uraian Materi Lengkap
                </label>
                <textarea
                  rows={4}
                  placeholder="Penjelasan detail bahan ajar PAI..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="font-bold text-xs text-emerald-900 block">Dalil Pendukung (Opsional):</span>
                <input
                  type="text"
                  placeholder="Teks Arab ayat / hadits..."
                  value={newArabicText}
                  onChange={e => setNewArabicText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-serif bg-white"
                />
                <input
                  type="text"
                  placeholder="Terjemahan dalil..."
                  value={newTranslation}
                  onChange={e => setNewTranslation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Poin-Poin Rangkuman (Pisahkan dengan baris baru)
                </label>
                <textarea
                  rows={3}
                  placeholder="Poin 1&#10;Poin 2&#10;Poin 3"
                  value={newKeyPoints}
                  onChange={e => setNewKeyPoints(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Simpan Modul
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
