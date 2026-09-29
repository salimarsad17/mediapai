import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import {
  FileSpreadsheet,
  Search,
  Download,
  Plus,
  Trash2,
  Edit2,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { RekapNilaiItem } from '../../types';

export const RekapNilaiGuruView: React.FC = () => {
  const {
    rekapNilaiList,
    addRekapNilai,
    updateRekapNilai,
    deleteRekapNilai,
    siswaList,
    selectedSemester,
    setSelectedSemester,
    selectedGrade,
    setSelectedGrade,
    schoolProfile,
  } = useLms();

  const [selectedParallelClass, setSelectedParallelClass] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNilai, setEditingNilai] = useState<RekapNilaiItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formNilai, setFormNilai] = useState({
    siswaId: '',
    nama: '',
    kelasParalel: '7A',
    tingkat: '7' as any,
    mapel: 'Pendidikan Agama Islam & BP',
    uh1: 85, uh2: 85, uh3: 85, uh4: 85, uh5: 85,
    tgs1: 85, tgs2: 85, tgs3: 85, tgs4: 85, tgs5: 85,
    hafalan1: 85, hafalan2: 85, hafalan3: 85, hafalan4: 85, hafalan5: 85,
    pts: 85, pas: 85,
    kkm: 75,
  });

  // Calculate average
  const computeRerata = (n: typeof formNilai) => {
    const total =
      n.uh1 + n.uh2 + n.uh3 + n.uh4 + n.uh5 +
      n.tgs1 + n.tgs2 + n.tgs3 + n.tgs4 + n.tgs5 +
      n.hafalan1 + n.hafalan2 + n.hafalan3 + n.hafalan4 + n.hafalan5 +
      n.pts + n.pas;
    return parseFloat((total / 17).toFixed(1));
  };

  const handleOpenAdd = () => {
    setEditingNilai(null);
    setFormNilai({
      siswaId: siswaList[0]?.id || '',
      nama: siswaList[0]?.nama || '',
      kelasParalel: siswaList[0]?.kelas || '7A',
      tingkat: siswaList[0]?.tingkat || '7',
      mapel: 'Pendidikan Agama Islam & BP',
      uh1: 80, uh2: 80, uh3: 80, uh4: 80, uh5: 80,
      tgs1: 80, tgs2: 80, tgs3: 80, tgs4: 80, tgs5: 80,
      hafalan1: 80, hafalan2: 80, hafalan3: 80, hafalan4: 80, hafalan5: 80,
      pts: 80, pas: 80,
      kkm: 75,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: RekapNilaiItem) => {
    setEditingNilai(item);
    setFormNilai({
      siswaId: item.siswaId,
      nama: item.nama,
      kelasParalel: item.kelasParalel,
      tingkat: item.tingkat,
      mapel: item.mapel,
      uh1: item.uh1, uh2: item.uh2, uh3: item.uh3, uh4: item.uh4, uh5: item.uh5,
      tgs1: item.tgs1, tgs2: item.tgs2, tgs3: item.tgs3, tgs4: item.tgs4, tgs5: item.tgs5,
      hafalan1: item.hafalan1, hafalan2: item.hafalan2, hafalan3: item.hafalan3, hafalan4: item.hafalan4, hafalan5: item.hafalan5,
      pts: item.pts, pas: item.pas,
      kkm: item.kkm,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const rerata = computeRerata(formNilai);
    if (editingNilai) {
      updateRekapNilai({
        ...editingNilai,
        ...formNilai,
        rerata,
        semester: selectedSemester,
      });
    } else {
      addRekapNilai({
        ...formNilai,
        rerata,
        semester: selectedSemester,
      });
    }
    setIsModalOpen(false);
  };

  const handleExport = (format: 'Excel' | 'PDF') => {
    alert(
      `Mengekspor Buku Rekap Nilai Paralel Kelas (${selectedParallelClass}) Mapel PAI ${selectedSemester} dalam format ${format}. Ketuntasan KKM 75 tercetak otomatis.`
    );
  };

  // Filter items
  const filteredData = rekapNilaiList.filter(item => {
    const matchSemester = item.semester === selectedSemester;
    const matchGrade = selectedGrade === 'Semua' ? true : item.tingkat === selectedGrade;
    const matchParallel = selectedParallelClass === 'Semua' ? true : item.kelasParalel === selectedParallelClass;
    const matchSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kelasParalel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSemester && matchGrade && matchParallel && matchSearch;
  });

  // Helper for color formatting
  // Requirement: Nilai 75 ke atas berwarna 'HITAM', sedangkan 75 ke bawah berwarna 'MERAH'
  const renderScoreCell = (score: number) => {
    const isBelowKkm = score < 75;
    return (
      <span
        className={`px-1.5 py-0.5 rounded font-mono text-center inline-block ${
          isBelowKkm
            ? 'text-red-600 font-black bg-red-100/90 ring-1 ring-red-400'
            : 'text-slate-900 font-bold'
        }`}
      >
        {score}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Title & Actions */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-1">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>REKABITULASI NILAI PARALEL KURIKULUM MERDEKA</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              REKAB NILAI PAI ({selectedSemester})
            </h1>
            <p className="text-xs text-slate-500">
              Dibuat kelompok per kelas paralel (7A, 7B, 8A, 8B, 9A, 9B). KKM = 75: Nilai ≥ 75 berwarna <strong>HITAM</strong>, nilai &lt; 75 berwarna <strong className="text-red-600">MERAH</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleExport('Excel')}
              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Excel</span>
            </button>
            <button
              type="button"
              onClick={() => handleExport('PDF')}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Unduh PDF</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-blue-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Nilai</span>
            </button>
          </div>
        </div>

        {/* Filter Controls: Semester, Grade, Parallel Class & Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          {/* Semester Selector */}
          <div className="md:col-span-3 flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            {(['Semester 1 (Ganjil)', 'Semester 2 (Genap)'] as const).map(sem => (
              <button
                key={sem}
                type="button"
                onClick={() => setSelectedSemester(sem)}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition text-center ${
                  selectedSemester === sem
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sem.split(' ')[0]} {sem.split(' ')[1]}
              </button>
            ))}
          </div>

          {/* Parallel Class Groups */}
          <div className="md:col-span-5 flex flex-wrap items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 px-1">Rombel:</span>
            {['Semua', '7A', '7B', '8A', '8B', '9A', '9B'].map(cls => (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedParallelClass(cls)}
                className={`py-1 px-2.5 rounded-lg font-bold text-[11px] transition ${
                  selectedParallelClass === cls
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          {/* Search Bar with button Cari */}
          <div className="md:col-span-4 flex items-center gap-1.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Cari nama siswa..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button
              type="button"
              className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
            >
              Cari
            </button>
          </div>
        </div>

        {/* Legend Indicator */}
        <div className="flex flex-wrap items-center gap-4 text-xs pt-1 px-1">
          <span className="font-bold text-slate-600">Keterangan Warna Nilai:</span>
          <span className="flex items-center gap-1 font-bold text-slate-900">
            <span className="w-3 h-3 rounded-full bg-slate-900 inline-block" />
            <span>Nilai ≥ 75: Tuntas (Warna Hitam)</span>
          </span>
          <span className="flex items-center gap-1 font-bold text-red-600">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
            <span>Nilai &lt; 75: Belum Tuntas / Remidial (Warna Merah)</span>
          </span>
        </div>

        {/* Table of Rekap Nilai */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-2 text-center w-8">No</th>
                <th className="py-2.5 px-3">Nama Siswa</th>
                <th className="py-2.5 px-2 text-center">Kelas</th>
                <th className="py-2.5 px-2 text-center bg-blue-50/70 border-x border-slate-200">UH 1</th>
                <th className="py-2.5 px-2 text-center bg-blue-50/70">UH 2</th>
                <th className="py-2.5 px-2 text-center bg-blue-50/70">UH 3</th>
                <th className="py-2.5 px-2 text-center bg-blue-50/70">UH 4</th>
                <th className="py-2.5 px-2 text-center bg-blue-50/70 border-r border-slate-200">UH 5</th>
                <th className="py-2.5 px-2 text-center bg-amber-50/70 border-r border-slate-200">Tgs 1</th>
                <th className="py-2.5 px-2 text-center bg-amber-50/70">Tgs 2</th>
                <th className="py-2.5 px-2 text-center bg-amber-50/70">Tgs 3</th>
                <th className="py-2.5 px-2 text-center bg-amber-50/70">Tgs 4</th>
                <th className="py-2.5 px-2 text-center bg-amber-50/70 border-r border-slate-200">Tgs 5</th>
                <th className="py-2.5 px-2 text-center bg-emerald-50/70 border-r border-slate-200">Hf. 1</th>
                <th className="py-2.5 px-2 text-center bg-emerald-50/70">Hf. 2</th>
                <th className="py-2.5 px-2 text-center bg-emerald-50/70">Hf. 3</th>
                <th className="py-2.5 px-2 text-center bg-emerald-50/70">Hf. 4</th>
                <th className="py-2.5 px-2 text-center bg-emerald-50/70 border-r border-slate-200">Hf. 5</th>
                <th className="py-2.5 px-2 text-center bg-purple-50">PTS</th>
                <th className="py-2.5 px-2 text-center bg-purple-50">PAS</th>
                <th className="py-2.5 px-3 text-center bg-indigo-100/70 font-black">Rerata</th>
                <th className="py-2.5 px-2 text-center">KKM</th>
                <th className="py-2.5 px-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50 transition text-center">
                  <td className="py-2.5 px-2 text-center font-bold text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-3 text-left font-bold text-slate-900">
                    {item.nama}
                  </td>
                  <td className="py-2.5 px-2 font-bold text-blue-700">
                    {item.kelasParalel}
                  </td>
                  <td className="py-2 px-2 bg-blue-50/30 border-l border-slate-100">{renderScoreCell(item.uh1)}</td>
                  <td className="py-2 px-2 bg-blue-50/30">{renderScoreCell(item.uh2)}</td>
                  <td className="py-2 px-2 bg-blue-50/30">{renderScoreCell(item.uh3)}</td>
                  <td className="py-2 px-2 bg-blue-50/30">{renderScoreCell(item.uh4)}</td>
                  <td className="py-2 px-2 bg-blue-50/30 border-r border-slate-100">{renderScoreCell(item.uh5)}</td>
                  <td className="py-2 px-2 bg-amber-50/30">{renderScoreCell(item.tgs1)}</td>
                  <td className="py-2 px-2 bg-amber-50/30">{renderScoreCell(item.tgs2)}</td>
                  <td className="py-2 px-2 bg-amber-50/30">{renderScoreCell(item.tgs3)}</td>
                  <td className="py-2 px-2 bg-amber-50/30">{renderScoreCell(item.tgs4)}</td>
                  <td className="py-2 px-2 bg-amber-50/30 border-r border-slate-100">{renderScoreCell(item.tgs5)}</td>
                  <td className="py-2 px-2 bg-emerald-50/30">{renderScoreCell(item.hafalan1)}</td>
                  <td className="py-2 px-2 bg-emerald-50/30">{renderScoreCell(item.hafalan2)}</td>
                  <td className="py-2 px-2 bg-emerald-50/30">{renderScoreCell(item.hafalan3)}</td>
                  <td className="py-2 px-2 bg-emerald-50/30">{renderScoreCell(item.hafalan4)}</td>
                  <td className="py-2 px-2 bg-emerald-50/30 border-r border-slate-100">{renderScoreCell(item.hafalan5)}</td>
                  <td className="py-2 px-2 bg-purple-50/40">{renderScoreCell(item.pts)}</td>
                  <td className="py-2 px-2 bg-purple-50/40">{renderScoreCell(item.pas)}</td>
                  <td className="py-2.5 px-3 bg-indigo-50 font-black">
                    {renderScoreCell(item.rerata)}
                  </td>
                  <td className="py-2.5 px-2 font-mono font-bold text-slate-500">
                    {item.kkm}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 rounded-md text-blue-600 hover:bg-blue-50"
                        title="Edit Nilai"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Yakin hapus nilai ${item.nama}?`)) {
                            deleteRekapNilai(item.id);
                          }
                        }}
                        className="p-1 rounded-md text-red-600 hover:bg-red-50"
                        title="Hapus Nilai"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Tambah/Edit Nilai */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">
              {editingNilai ? `Edit Nilai: ${formNilai.nama}` : 'Input Rekap Nilai Siswa Baru'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pilih Siswa</label>
                  <select
                    value={formNilai.siswaId}
                    onChange={e => {
                      const found = siswaList.find(s => s.id === e.target.value);
                      if (found) {
                        setFormNilai({
                          ...formNilai,
                          siswaId: found.id,
                          nama: found.nama,
                          kelasParalel: found.kelas,
                          tingkat: found.tingkat,
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">-- Pilih Siswa --</option>
                    {siswaList.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.nama} ({s.kelas})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas Paralel</label>
                  <input
                    type="text"
                    value={formNilai.kelasParalel}
                    onChange={e => setFormNilai({ ...formNilai, kelasParalel: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Ulangan Harian 1 - 5 */}
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
                <span className="font-bold text-blue-900 block">Ulangan Harian (UH 1 s/d UH 5)</span>
                <div className="grid grid-cols-5 gap-2">
                  {(['uh1', 'uh2', 'uh3', 'uh4', 'uh5'] as const).map((key, i) => (
                    <div key={key}>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">UH {i + 1}</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formNilai[key]}
                        onChange={e => setFormNilai({ ...formNilai, [key]: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 text-center font-bold border border-slate-300 rounded-lg outline-none"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tugas 1 - 5 */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <span className="font-bold text-amber-900 block">Tugas Terstruktur (Tgs 1 s/d Tgs 5)</span>
                <div className="grid grid-cols-5 gap-2">
                  {(['tgs1', 'tgs2', 'tgs3', 'tgs4', 'tgs5'] as const).map((key, i) => (
                    <div key={key}>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tgs {i + 1}</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formNilai[key]}
                        onChange={e => setFormNilai({ ...formNilai, [key]: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 text-center font-bold border border-slate-300 rounded-lg outline-none"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Hafalan Surat 1 - 5 */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="font-bold text-emerald-900 block">Hafalan Surat Juz Amma (1 s/d 5)</span>
                <div className="grid grid-cols-5 gap-2">
                  {(['hafalan1', 'hafalan2', 'hafalan3', 'hafalan4', 'hafalan5'] as const).map((key, i) => (
                    <div key={key}>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Surat {i + 1}</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formNilai[key]}
                        onChange={e => setFormNilai({ ...formNilai, [key]: Number(e.target.value) })}
                        className="w-full px-2 py-1.5 text-center font-bold border border-slate-300 rounded-lg outline-none"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* PTS & PAS */}
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-purple-900 mb-1">PTS (Penilaian Tengah Semester)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formNilai.pts}
                    onChange={e => setFormNilai({ ...formNilai, pts: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-center outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-purple-900 mb-1">PAS (Penilaian Akhir Semester)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formNilai.pas}
                    onChange={e => setFormNilai({ ...formNilai, pas: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-center outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Rekap Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
