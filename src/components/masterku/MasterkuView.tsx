import React, { useState, useRef } from 'react';
import { useLms } from '../../context/LmsContext';
import {
  MASTER_QURAN_LIST,
  MASTER_BUKU_PELAJARAN,
  MASTER_HADITS_LIST,
  MASTER_KISAH_LIST,
  MASTER_EXTERNAL_LINKS,
} from '../../data/initialData';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Copy,
  Check,
  Search,
  ExternalLink,
  BookMarked,
  Sparkles,
  ScrollText,
  Bookmark,
  Download,
  Filter,
  X,
} from 'lucide-react';

export const MasterkuView: React.FC<{ isReadOnly?: boolean }> = ({ isReadOnly = false }) => {
  const { showToast } = useLms();
  const [activeTab, setActiveTab] = useState<'quran' | 'hadist' | 'buku' | 'kisah' | 'link'>('quran');
  const [selectedReadingBook, setSelectedReadingBook] = useState<any | null>(null);
  const [activeReadingBabIndex, setActiveReadingBabIndex] = useState(0);

  // Audio player state
  const [playingSurah, setPlayingSurah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerawi, setSelectedPerawi] = useState<string>('Semua');
  const [selectedKisahKat, setSelectedKisahKat] = useState<'Semua' | 'Nabi' | 'Sahabat' | 'Ulama'>('Semua');

  // Copy feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePlayAudio = (surahNomor: number, audioUrl: string) => {
    if (playingSurah === surahNomor && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(e => console.warn('Audio play error:', e));
        setPlayingSurah(surahNomor);
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hidden Global Audio Element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-400/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold border border-blue-300/30 mb-2">
            <BookMarked className="w-3.5 h-3.5 text-amber-300" />
            <span>PUSTAKA DIGITAL & ENSIKLOPEDIA ISLAMI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            MASTERKU PAI
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl leading-relaxed">
            Kumpulan komprehensif Al-Qur'an 30 Juz & audio murattal, 75 Hadits tematik 5 perawi, buku kurikulum merdeka CP 2026, 30 kisah teladan, dan tautan resmi layanan guru.
          </p>
          {isReadOnly && (
            <p className="text-[11px] text-amber-300 font-semibold mt-2">
              Mode Siswa: Anda dapat membaca, memutar audio tilawah, dan menyalin (copy) ayat serta hadits untuk tugas sekolah.
            </p>
          )}
        </div>

        {/* Currently playing audio indicator */}
        {isPlaying && (
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold animate-pulse">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-blue-200 font-bold uppercase block">
                Sedang Memutar Audio:
              </span>
              <span className="text-xs font-black text-white">
                Surah No. {playingSurah}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Master Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-1.5 text-xs font-bold">
        {[
          { id: 'quran', label: "Al-Qur'an 30 Juz & Audio", icon: BookOpen },
          { id: 'hadist', label: 'Hadist (5 Perawi @15 Hadits)', icon: ScrollText },
          { id: 'buku', label: 'Buku Pelajaran CP 2026', icon: BookMarked },
          { id: 'kisah', label: 'Kisah Teladan (30 Kisah)', icon: Sparkles },
          { id: 'link', label: 'Link Pintasan Resmi', icon: ExternalLink },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              id={`tab-master-${tab.id}`}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSearchTerm('');
              }}
              className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl transition cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. AL-QUR'AN 30 JUZ & AUDIO */}
      {activeTab === 'quran' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Al-Qur'anul Karim & Terjemahan Bahasa Indonesia
              </h2>
              <p className="text-xs text-slate-500">
                Lengkap dengan audio murattal qari internasional (Syekh Misyari Rasyid Al-Afasy)
              </p>
            </div>
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Cari surah (e.g. Al-Fatihah, Yasin)..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MASTER_QURAN_LIST.filter(
              s =>
                s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.arti.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.nomor.toString() === searchTerm
            ).map(surah => {
              const isSurahPlaying = playingSurah === surah.nomor && isPlaying;
              return (
                <div
                  key={surah.nomor}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3.5 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Surah Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          {surah.nomor}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">
                            Surah {surah.nama}
                          </h3>
                          <span className="text-[10px] text-slate-500">
                            {surah.arti} • {surah.jumlahAyat} Ayat ({surah.tempatTurun})
                          </span>
                        </div>
                      </div>
                      <span className="text-2xl font-serif font-bold text-blue-900" dir="rtl">
                        {surah.namaArab}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {surah.deskripsi}
                    </p>

                    {/* Verses Preview */}
                    <div className="space-y-2.5 pt-1">
                      {surah.contohAyat.map(ayat => (
                        <div
                          key={ayat.ayat}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                            <span className="font-bold text-blue-700">Ayat {ayat.ayat}</span>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyText(
                                  `${ayat.arab}\n"${ayat.arti}" (Q.S. ${surah.nama}: ${ayat.ayat})`,
                                  `ayat-${surah.nomor}-${ayat.ayat}`
                                )
                              }
                              className="text-slate-400 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                              title="Salin Ayat & Terjemah"
                            >
                              {copiedId === `ayat-${surah.nomor}-${ayat.ayat}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>
                                {copiedId === `ayat-${surah.nomor}-${ayat.ayat}` ? 'Tersalin' : 'Copy'}
                              </span>
                            </button>
                          </div>
                          <p className="text-xl font-serif font-bold text-right text-slate-900 leading-relaxed" dir="rtl">
                            {ayat.arab}
                          </p>
                          <p className="text-[11px] text-blue-900 italic font-medium">
                            {ayat.latin}
                          </p>
                          <p className="text-xs text-slate-700 leading-snug">
                            "{ayat.arti}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audio Player Action Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Audio Murottal 30 Juz</span>
                    <button
                      type="button"
                      id={`btn-play-surah-${surah.nomor}`}
                      onClick={() => handlePlayAudio(surah.nomor, surah.audioUrl)}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                        isSurahPlaying
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      }`}
                    >
                      {isSurahPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Putar Murottal</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. HADIST (5 Perawi: Bukhari, Muslim, Nasa'i, Ibnu Majah, Abu Daud @ 15 Hadits) */}
      {activeTab === 'hadist' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Koleksi 75 Hadits Pilihan (Bukhari, Muslim, Nasa'i, Ibnu Majah, Abu Daud)
              </h2>
              <p className="text-xs text-slate-500">
                15 hadits per perawi mencakup tema Aqidah, Akhlak, Fiqih, dan Muamalah
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {['Semua', 'Bukhari', 'Muslim', "Nasa'i", 'Ibnu Majah', 'Abu Daud'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPerawi(p)}
                  className={`py-1 px-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedPerawi === p
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MASTER_HADITS_LIST.filter(h => {
              const matchPerawi = selectedPerawi === 'Semua' ? true : h.perawi === selectedPerawi;
              const matchSearch =
                h.terjemah.toLowerCase().includes(searchTerm.toLowerCase()) ||
                h.tema.toLowerCase().includes(searchTerm.toLowerCase()) ||
                h.hikmah.toLowerCase().includes(searchTerm.toLowerCase());
              return matchPerawi && matchSearch;
            }).map(hadits => (
              <div
                key={hadits.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                      H.R. {hadits.perawi} • {hadits.tema}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          `${hadits.arab}\n"${hadits.terjemah}" (${hadits.sanadPerawi})`,
                          hadits.id
                        )
                      }
                      className="text-slate-400 hover:text-blue-600 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                      title="Salin Hadits"
                    >
                      {copiedId === hadits.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === hadits.id ? 'Tersalin' : 'Copy Hadits'}</span>
                    </button>
                  </div>

                  <p className="text-xl font-serif font-bold text-right text-slate-900 leading-relaxed pt-1" dir="rtl">
                    {hadits.arab}
                  </p>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    "{hadits.terjemah}"
                  </p>

                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/60 text-xs text-slate-700">
                    <span className="font-bold text-blue-900 block mb-0.5">Ibrah / Hikmah Pembelajaran:</span>
                    <p className="text-[11px] leading-snug">{hadits.hikmah}</p>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 font-mono border-t border-slate-100">
                  {hadits.sanadPerawi}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. BUKU PELAJARAN LENGKAP KELAS 7, 8, 9 KURIKULUM MERDEKA CP 2026 */}
      {activeTab === 'buku' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Buku Teks Utama Pendidikan Agama Islam Kelas 7, 8, 9
              </h2>
              <p className="text-xs text-slate-500">
                Edisi Resmi Kurikulum Merdeka Capaian Pembelajaran (CP) 20 Tahun 2026
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MASTER_BUKU_PELAJARAN.map(buku => (
              <div
                key={buku.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4 hover:shadow-lg transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative h-48 rounded-2xl overflow-hidden shadow-inner bg-slate-100">
                    <img
                      src={buku.coverUrl}
                      alt={buku.judul}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-blue-600 text-white font-black text-xs shadow-md">
                      Kelas {buku.tingkat}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                      {buku.tahunKurikulum}
                    </span>
                    <h3 className="font-black text-slate-900 text-base leading-snug mt-1">
                      {buku.judul}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Penulis: {buku.penulis}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {buku.deskripsi}
                  </p>

                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      Daftar Pembahasan Bab:
                    </span>
                    <ul className="text-[11px] text-slate-600 space-y-1">
                      {buku.daftarBab.map((bab, i) => (
                        <li key={i} className="truncate">
                          • {bab}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReadingBook(buku);
                      setActiveReadingBabIndex(0);
                      showToast(`Membuka buku teks ${buku.judul} kelas ${buku.tingkat}`, 'info');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Baca Buku Digital</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. KISAH TELADAN (10 Nabi, 10 Sahabat, 10 Ulama) */}
      {activeTab === 'kisah' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                30 Kisah Teladan Penuh Hikmah (10 Nabi, 10 Sahabat, 10 Ulama)
              </h2>
              <p className="text-xs text-slate-500">
                Kisah inspiratif pembentuk karakter akhlak mulia siswa SMP
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(['Semua', 'Nabi', 'Sahabat', 'Ulama'] as const).map(kat => (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setSelectedKisahKat(kat)}
                  className={`py-1 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedKisahKat === kat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MASTER_KISAH_LIST.filter(k =>
              selectedKisahKat === 'Semua' ? true : k.kategori === selectedKisahKat
            ).map(kisah => (
              <div
                key={kisah.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                      Kisah {kisah.kategori}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {kisah.periodeZaman}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {kisah.tokoh}
                  </h3>
                  <h4 className="text-xs font-semibold text-blue-700">
                    {kisah.judulKisah}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {kisah.ringkasan}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-0.5">
                  <strong className="text-slate-900 block text-[11px]">Hikmah & Ibrah:</strong>
                  <p className="text-[11px] leading-snug">{kisah.hikmahIbrah}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. LINK PINTASAN RESMI (SIAGAPENDIS, INFO GTK, MY ASN DIGITAL, E-KINERJA) */}
      {activeTab === 'link' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900">
              Tautan Layanan Resmi Guru PAI & ASN
            </h2>
            <p className="text-xs text-slate-500">
              Akses cepat ke portal Siagapendis Kemenag, Info GTK Kemdikbud, MyASN BKN, dan E-Kinerja BKN
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MASTER_EXTERNAL_LINKS.map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 hover:shadow-lg hover:border-blue-400 transition group space-y-3 block"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    {link.badge}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition">
                    {link.nama}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {link.url}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {link.deskripsi}
                </p>

                <div className="pt-2 text-xs font-bold text-blue-600 flex items-center gap-1">
                  <span>Buka Portal Resmi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Interactive Digital Book Reader */}
      {selectedReadingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    {selectedReadingBook.judul}
                  </h3>
                  <p className="text-[11px] text-blue-200">
                    Edisi Kurikulum Merdeka • Penulis: {selectedReadingBook.penulis}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReadingBook(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start pb-6 border-b border-slate-200">
                <img
                  src={selectedReadingBook.coverUrl}
                  alt={selectedReadingBook.judul}
                  className="w-32 h-44 object-cover rounded-2xl shadow-md shrink-0 border border-slate-200"
                />
                <div className="space-y-2">
                  <div className="inline-block px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">
                    Buku Teks Utama Kelas {selectedReadingBook.tingkat}
                  </div>
                  <h2 className="text-xl font-black text-slate-900">
                    {selectedReadingBook.judul}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedReadingBook.deskripsi}
                  </p>
                  <p className="text-xs text-slate-500 font-semibold pt-1">
                    Penerbit: Pusat Perbukuan Badan Standar, Kurikulum, dan Asesmen Pendidikan Kemendikbudristek
                  </p>
                </div>
              </div>

              {/* Chapters Navigator */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Pilih Bab Pembahasan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedReadingBook.daftarBab.map((bab: string, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveReadingBabIndex(idx)}
                      className={`p-3 rounded-2xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                        activeReadingBabIndex === idx
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate pr-2">{bab}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                        Bab {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chapter Content Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-blue-700 block">
                  Ikhtisar Pembelajaran:
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  Bab ini membahas materi <strong>{selectedReadingBook.daftarBab[activeReadingBabIndex]}</strong> sesuai alur tujuan pembelajaran (ATP) Kurikulum Merdeka Fase D. Siswa diajak untuk memahami dalil naqli, menghayati nilai budi pekerti luhur, dan menerapkannya dalam kehidupan sehari-hari baik di lingkungan sekolah, keluarga, maupun masyarakat.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs shrink-0">
              <span className="text-slate-500">
                Status: Buku Digital Resmi Terverifikasi Kemendikbudristek
              </span>
              <button
                type="button"
                onClick={() => setSelectedReadingBook(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold transition cursor-pointer"
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
