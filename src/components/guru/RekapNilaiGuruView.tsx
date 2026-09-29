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
  Printer,
  Eye,
  X,
  School,
  Award,
} from 'lucide-react';
import { RekapNilaiItem } from '../../types';
import { exportToCsv } from '../../utils/fileExport';

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
    currentUser,
    showToast,
  } = useLms();

  const [selectedParallelClass, setSelectedParallelClass] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNilai, setEditingNilai] = useState<RekapNilaiItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

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
      showToast(`Data nilai ${formNilai.nama} berhasil diperbarui`, 'success');
    } else {
      addRekapNilai({
        ...formNilai,
        rerata,
        semester: selectedSemester,
      });
      showToast(`Data nilai baru untuk ${formNilai.nama} berhasil ditambahkan`, 'success');
    }
    setIsModalOpen(false);
  };

  const handleExport = (format: 'Excel' | 'PDF') => {
    if (format === 'PDF') {
      handlePrint();
      return;
    }

    // Real CSV / Excel export
    const headers = [
      'No',
      'Nama Siswa',
      'Kelas',
      'UH1', 'UH2', 'UH3', 'UH4', 'UH5',
      'Tugas1', 'Tugas2', 'Tugas3', 'Tugas4', 'Tugas5',
      'Hafalan1', 'Hafalan2', 'Hafalan3', 'Hafalan4', 'Hafalan5',
      'PTS',
      'PAS',
      'Rerata',
      'KKM',
      'Status Ketuntasan'
    ];

    const rows = filteredData.map((d, idx) => [
      idx + 1,
      d.nama,
      d.kelasParalel,
      d.uh1, d.uh2, d.uh3, d.uh4, d.uh5,
      d.tgs1, d.tgs2, d.tgs3, d.tgs4, d.tgs5,
      d.hafalan1, d.hafalan2, d.hafalan3, d.hafalan4, d.hafalan5,
      d.pts,
      d.pas,
      d.rerata,
      d.kkm,
      d.rerata >= 75 ? 'Tuntas' : 'Remidial'
    ]);

    exportToCsv(
      `Rekap_Nilai_PAI_${selectedParallelClass}_${selectedSemester.replace(/\s+/g, '_')}.csv`,
      headers,
      rows
    );

    showToast(`Berhasil mengunduh ${filteredData.length} data Rekap Nilai format Excel / CSV`, 'success');
  };

  const handlePrint = () => {
    try {
      const printElement = document.getElementById('printable-rekap-document');
      if (printElement) {
        // Remove previous iframe if exists
        const oldIframe = document.getElementById('rekap-print-frame');
        if (oldIframe) {
          oldIframe.remove();
        }

        const iframe = document.createElement('iframe');
        iframe.id = 'rekap-print-frame';
        iframe.setAttribute(
          'style',
          'position:fixed;top:0;left:0;width:1px;height:1px;border:none;opacity:0;pointer-events:none;z-index:-999;'
        );
        document.body.appendChild(iframe);

        const frameDoc = iframe.contentWindow?.document;
        if (frameDoc) {
          frameDoc.open();
          frameDoc.write(`
            <!DOCTYPE html>
            <html lang="id">
              <head>
                <meta charset="utf-8">
                <title>Rekap Nilai PAI - UPT SMPN 2 Rebang Tangkas</title>
                <style>
                  @page {
                    size: A4 landscape;
                    margin: 8mm 10mm;
                  }
                  * {
                    box-sizing: border-box;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  body {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    background: #ffffff;
                    color: #000000;
                    font-size: 10px;
                  }
                  table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 8px;
                  }
                  th, td {
                    border: 1px solid #000000;
                    padding: 3px 4px;
                  }
                  .text-center { text-align: center; }
                  .text-left { text-align: left; }
                  .text-right { text-align: right; }
                  .font-bold { font-weight: bold; }
                  .font-black { font-weight: 900; }
                  .font-semibold { font-weight: 600; }
                  .font-medium { font-weight: 500; }
                  .font-mono { font-family: monospace; }
                  .text-red-600 { color: #dc2626 !important; }
                  .text-black { color: #000000 !important; }
                  .text-slate-900 { color: #0f172a !important; }
                  .text-slate-800 { color: #1e293b !important; }
                  .text-slate-700 { color: #334155 !important; }
                  .text-slate-600 { color: #475569 !important; }
                  .text-slate-500 { color: #64748b !important; }
                  .text-slate-300 { color: #cbd5e1 !important; }
                  .bg-white { background-color: #ffffff !important; }
                  .bg-slate-50 { background-color: #f8fafc !important; }
                  .bg-slate-100 { background-color: #f1f5f9 !important; }
                  .bg-slate-200 { background-color: #e2e8f0 !important; }
                  .bg-slate-300 { background-color: #cbd5e1 !important; }
                  .bg-blue-100 { background-color: #dbeafe !important; }
                  .bg-amber-100 { background-color: #fef3c7 !important; }
                  .bg-emerald-100 { background-color: #d1fae5 !important; }
                  .bg-purple-100 { background-color: #f3e8ff !important; }
                  .border-b-2 { border-bottom: 2px solid #000000; }
                  .border-t-2 { border-top: 2px solid #000000; }
                  .border-t { border-top: 1px solid #000000; }
                  .border-black { border-color: #000000; }
                  .border { border: 1px solid #000000; }
                  .grid { display: grid; }
                  .grid-cols-2 { grid-template-columns: 1fr 1fr; }
                  .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
                  .gap-4 { gap: 16px; }
                  .gap-2 { gap: 8px; }
                  .gap-8 { gap: 32px; }
                  .flex { display: flex; }
                  .items-center { align-items: center; }
                  .justify-between { justify-content: space-between; }
                  .justify-center { justify-content: center; }
                  .uppercase { text-transform: uppercase; }
                  .underline { text-decoration: underline; }
                  .w-16 { width: 50px; }
                  .h-16 { height: 50px; }
                  .h-20 { height: 60px; }
                  .w-full { width: 100%; }
                  .w-8 { width: 32px; }
                  .w-9 { width: 36px; }
                  .w-12 { width: 48px; }
                  .w-32 { width: 128px; }
                  .w-36 { width: 144px; }
                  .p-1 { padding: 4px; }
                  .p-2 { padding: 8px; }
                  .p-2\\.5 { padding: 10px; }
                  .pb-2 { padding-bottom: 8px; }
                  .pt-2 { padding-top: 8px; }
                  .mb-3 { margin-bottom: 12px; }
                  .mb-6 { margin-bottom: 24px; }
                  .my-3 { margin-top: 12px; margin-bottom: 12px; }
                  .mt-2 { margin-top: 8px; }
                  .mt-0\\.5 { margin-top: 2px; }
                  .rounded-md { border-radius: 4px; }
                  .rounded-lg { border-radius: 6px; }
                  .rounded-xl { border-radius: 8px; }
                  .space-y-1 > * + * { margin-top: 4px; }
                  .space-y-0\\.5 > * + * { margin-top: 2px; }
                  svg { display: inline-block; vertical-align: middle; }
                </style>
              </head>
              <body>
                ${printElement.innerHTML}
              </body>
            </html>
          `);
          frameDoc.close();

          setTimeout(() => {
            try {
              iframe.contentWindow?.focus();
              iframe.contentWindow?.print();
            } catch (errInner) {
              console.warn('Iframe print error, falling back to window.print', errInner);
              window.focus();
              window.print();
            }
          }, 300);

          return;
        }
      }
    } catch (err) {
      console.warn('Print handler error, fallback to window.print', err);
    }

    // Direct fallback
    window.focus();
    window.print();
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
  // Requirement: Nilai 75 ke atas berwarna HITAM (text-black), sedangkan di bawah 75 berwarna MERAH (text-red-600)
  const renderScoreCell = (score: number) => {
    const isBelow75 = score < 75;
    return (
      <span
        className={`px-1.5 py-0.5 rounded font-mono text-center inline-block transition-colors ${
          isBelow75
            ? 'text-red-600 font-bold bg-red-50 ring-1 ring-red-200'
            : 'text-black font-semibold'
        }`}
      >
        {score}
      </span>
    );
  };

  // Statistical calculations for printing
  const totalSiswaCount = filteredData.length;
  const tuntasCount = filteredData.filter(d => d.rerata >= 75).length;
  const remidialCount = filteredData.filter(d => d.rerata < 75).length;
  const tuntasPercentage = totalSiswaCount > 0 ? ((tuntasCount / totalSiswaCount) * 100).toFixed(1) : '0';
  const averageAllScores = totalSiswaCount > 0
    ? (filteredData.reduce((acc, curr) => acc + curr.rerata, 0) / totalSiswaCount).toFixed(1)
    : '0';

  // Indonesian Date Formatting for official letter/report
  const currentDateFormatted = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const guruMapelName = currentUser?.name || 'Ust. Sadiqul Alim, S.Pd.I., M.Pd.';
  const guruMapelNip = currentUser?.identifier || '198205142008011015';
  const kepalaSekolahName = schoolProfile?.kepalaSekolah || 'Drs. H. Mulyadi, M.Pd.';
  const kepalaSekolahNip = schoolProfile?.nipKepalaSekolah || '196807121994121002';

  // Printable Document Layout (rendered on paper via @media print & in preview modal)
  const renderPrintableDocument = (isModalPreview = false) => (
    <div
      className={`bg-white text-black font-sans ${
        isModalPreview ? 'p-6 max-w-6xl mx-auto' : 'w-full print-page p-1'
      }`}
    >
      {/* 1. KOP SURAT RESMI UPT SMPN 2 REBANG TANGKAS */}
      <div className="border-b-2 border-black pb-2 mb-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo / Emblem Kiri */}
          <div className="w-16 h-16 shrink-0 flex items-center justify-center border-2 border-black rounded-xl bg-slate-50">
            <School className="w-9 h-9 text-slate-900" />
          </div>

          {/* Teks Kop Surat Pusat */}
          <div className="text-center flex-1 space-y-0.5">
            <h3 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-800">
              PEMERINTAH KABUPATEN WAY KANAN
            </h3>
            <h2 className="text-sm sm:text-base font-black tracking-wider uppercase text-slate-900">
              DINAS PENDIDIKAN DAN KEBUDAYAAN
            </h2>
            <h1 className="text-lg sm:text-xl font-black tracking-wide uppercase text-black">
              UPT SMPN 2 REBANG TANGKAS
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-700 font-medium">
              Alamat: Jl. Poros Rebang Tangkas, Kec. Rebang Tangkas, Kab. Way Kanan, Lampung 34768
            </p>
            <p className="text-[10px] text-slate-600 font-mono">
              NPSN: <span className="font-bold font-mono">10806873</span> • NSS: 201120806873 • AKREDITASI B • Surel: smpn2rebangtangkas@gmail.com
            </p>
          </div>

          {/* Logo Tut Wuri Handayani / Kanan */}
          <div className="w-16 h-16 shrink-0 flex items-center justify-center border-2 border-black rounded-xl bg-slate-50">
            <Award className="w-9 h-9 text-slate-900" />
          </div>
        </div>

        {/* Double Border Kop Surat */}
        <div className="w-full mt-2">
          <div className="border-t-[2.5px] border-black w-full" />
          <div className="border-t border-black w-full mt-0.5" />
        </div>
      </div>

      {/* 2. JUDUL DOKUMEN & IDENTITAS PEMBELAJARAN */}
      <div className="text-center my-3 space-y-1">
        <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-black underline decoration-1 underline-offset-4">
          REKAPITULASI DAFTAR NILAI HASIL BELAJAR PESERTA DIDIK
        </h2>
        <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">
          KURIKULUM MERDEKA • TAHUN AJARAN 2024 / 2025
        </p>
      </div>

      {/* Identitas Meta Dokumen (Grid 2 Kolom) */}
      <div className="grid grid-cols-2 gap-4 text-[10px] sm:text-[11px] bg-slate-50/80 p-2.5 rounded-lg border border-slate-400 mb-3">
        <div className="space-y-1">
          <div className="flex">
            <span className="w-32 font-bold text-slate-700">Mata Pelajaran</span>
            <span className="font-bold text-black">: Pendidikan Agama Islam & Budi Pekerti (PAI & BP)</span>
          </div>
          <div className="flex">
            <span className="w-32 font-bold text-slate-700">Kelas / Rombel</span>
            <span className="font-bold text-black">
              : {selectedParallelClass === 'Semua' ? 'Seluruh Kelas (7A, 7B, 8A, 8B, 9A, 9B)' : `Kelas ${selectedParallelClass}`}
            </span>
          </div>
          <div className="flex">
            <span className="w-32 font-bold text-slate-700">Semester</span>
            <span className="font-bold text-black">: {selectedSemester}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex">
            <span className="w-36 font-bold text-slate-700">Guru Mata Pelajaran</span>
            <span className="font-bold text-black">: {guruMapelName}</span>
          </div>
          <div className="flex">
            <span className="w-36 font-bold text-slate-700">KKM Ketuntasan</span>
            <span className="font-bold text-black">: 75.00 (Skala 0 - 100)</span>
          </div>
          <div className="flex">
            <span className="w-36 font-bold text-slate-700">Ketentuan Tinta Cetak</span>
            <span className="font-semibold text-black">
              : <span className="text-black font-bold">≥ 75 Hitam (Tuntas)</span> | <span className="text-red-600 font-bold">&lt; 75 Merah (Remidial)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. TABEL DATA NILAI A4 LANDSCAPE DENGAN FORMAT WARNA PRESISI */}
      <div className="overflow-x-auto w-full mb-3">
        <table className="w-full border-collapse border border-black text-[9px] sm:text-[10px]">
          <thead>
            <tr className="bg-slate-200/90 text-black text-center font-bold">
              <th rowSpan={2} className="border border-black px-1.5 py-1 w-8">NO</th>
              <th rowSpan={2} className="border border-black px-2 py-1 text-left min-w-[130px]">NAMA SISWA</th>
              <th rowSpan={2} className="border border-black px-1 py-1 w-9">KLS</th>
              <th colSpan={5} className="border border-black px-1 py-0.5 bg-blue-100/60">ULANGAN HARIAN (UH)</th>
              <th colSpan={5} className="border border-black px-1 py-0.5 bg-amber-100/60">TUGAS & PROYEK (TGS)</th>
              <th colSpan={5} className="border border-black px-1 py-0.5 bg-emerald-100/60">SETORAN HAFALAN SURAT</th>
              <th rowSpan={2} className="border border-black px-1 py-1 w-9 bg-purple-100/60">PTS</th>
              <th rowSpan={2} className="border border-black px-1 py-1 w-9 bg-purple-100/60">PAS</th>
              <th rowSpan={2} className="border border-black px-1.5 py-1 w-12 bg-slate-300">RERATA AKHIR</th>
              <th rowSpan={2} className="border border-black px-1 py-1 w-9">KKM</th>
              <th rowSpan={2} className="border border-black px-1.5 py-1 w-16">KETUNTASAN</th>
            </tr>
            <tr className="bg-slate-100 text-black text-center font-semibold text-[8px] sm:text-[9px]">
              <th className="border border-black px-1 py-0.5">UH1</th>
              <th className="border border-black px-1 py-0.5">UH2</th>
              <th className="border border-black px-1 py-0.5">UH3</th>
              <th className="border border-black px-1 py-0.5">UH4</th>
              <th className="border border-black px-1 py-0.5">UH5</th>
              <th className="border border-black px-1 py-0.5">T1</th>
              <th className="border border-black px-1 py-0.5">T2</th>
              <th className="border border-black px-1 py-0.5">T3</th>
              <th className="border border-black px-1 py-0.5">T4</th>
              <th className="border border-black px-1 py-0.5">T5</th>
              <th className="border border-black px-1 py-0.5">H1</th>
              <th className="border border-black px-1 py-0.5">H2</th>
              <th className="border border-black px-1 py-0.5">H3</th>
              <th className="border border-black px-1 py-0.5">H4</th>
              <th className="border border-black px-1 py-0.5">H5</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => {
              const isRemidial = item.rerata < 75;
              const formatScore = (val: number) => (
                <span className={val < 75 ? 'text-red-600 font-bold' : 'text-black font-semibold'}>
                  {val}
                </span>
              );

              return (
                <tr
                  key={item.id}
                  className={`text-center ${idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}`}
                >
                  <td className="border border-black px-1 py-1 text-black font-medium">{idx + 1}</td>
                  <td className={`border border-black px-2 py-1 text-left font-bold ${isRemidial ? 'text-red-600' : 'text-black'}`}>
                    {item.nama}
                  </td>
                  <td className="border border-black px-1 py-1 font-bold text-black">{item.kelasParalel}</td>
                  <td className="border border-black px-1 py-0.5 font-mono">{formatScore(item.uh1)}</td>
                  <td className="border border-black px-1 py-0.5 font-mono">{formatScore(item.uh2)}</td>
                  <td className="border border-black px-1 py-0.5 font-mono">{formatScore(item.uh3)}</td>
                  <td className="border border-black px-1 py-0.5 font-mono">{formatScore(item.uh4)}</td>
                  <td className="border border-black px-1 py-0.5 font-mono">{formatScore(item.uh5)}</td>
                  <td className="border border-black px-1 py-0.5 font-mono">{formatScore(item.tgs1)}</td>
                  <td className="border border-black px-1 py-0.5 font-mono">{formatScore(item.tgs2)}</td>
                  <td className="border border-black px-1 py-0.5 font-mono">{formatScore(item.tgs3)}</td>
                  <td className="border border-black px-1 py-0.5 font-mono">{formatScore(item.tgs4)}</td>
                  <td className="border border-black px-1 py-0.5 font-mono">{formatScore(item.tgs5)}</td>
                  <td className="border border-black px-1 py-0.5 font-mono">{formatScore(item.hafalan1)}</td>
                  <td className="border border-black px-1 py-0.5 font-mono">{formatScore(item.hafalan2)}</td>
                  <td className="border border-black px-1 py-0.5 font-mono">{formatScore(item.hafalan3)}</td>
                  <td className="border border-black px-1 py-0.5 font-mono">{formatScore(item.hafalan4)}</td>
                  <td className="border border-black px-1 py-0.5 font-mono">{formatScore(item.hafalan5)}</td>
                  <td className="border border-black px-1 py-0.5 font-mono">{formatScore(item.pts)}</td>
                  <td className="border border-black px-1 py-0.5 font-mono">{formatScore(item.pas)}</td>
                  <td className="border border-black px-1.5 py-1 font-mono font-black bg-slate-100/80">
                    <span className={item.rerata < 75 ? 'text-red-600 font-black' : 'text-black font-black'}>
                      {item.rerata}
                    </span>
                  </td>
                  <td className="border border-black px-1 py-1 font-mono font-bold text-black">{item.kkm}</td>
                  <td className="border border-black px-1 py-1 font-bold">
                    {isRemidial ? (
                      <span className="text-red-600 uppercase font-black">REMIDIAL</span>
                    ) : (
                      <span className="text-black uppercase font-bold">TUNTAS</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. REKAPITULASI STATISTIK HASIL BELAJAR */}
      <div className="grid grid-cols-4 gap-2 text-[10px] text-center border border-black p-2 bg-slate-50/60 rounded-md mb-6">
        <div>
          <span className="block text-slate-600 font-medium">Jumlah Peserta Didik</span>
          <span className="font-bold text-black text-xs">{totalSiswaCount} Siswa</span>
        </div>
        <div>
          <span className="block text-slate-600 font-medium">Siswa Tuntas (Nilai ≥ 75)</span>
          <span className="font-bold text-black text-xs">{tuntasCount} Siswa ({tuntasPercentage}%)</span>
        </div>
        <div>
          <span className="block text-slate-600 font-medium">Siswa Belum Tuntas / Remidial (&lt; 75)</span>
          <span className="font-bold text-red-600 text-xs">{remidialCount} Siswa</span>
        </div>
        <div>
          <span className="block text-slate-600 font-medium">Rata-Rata Kelas Keseluruhan</span>
          <span className="font-bold text-black text-xs font-mono">{averageAllScores}</span>
        </div>
      </div>

      {/* 5. TANDA TANGAN GURU MAPEL & KEPALA SEKOLAH SERTA TEMPAT & TANGGAL CETAK */}
      <div className="grid grid-cols-2 gap-8 text-[11px] pt-2 page-break-inside-avoid">
        {/* Sisi Kiri: Mengetahui Kepala Sekolah */}
        <div className="text-center space-y-1">
          <p className="text-slate-800">Mengetahui,</p>
          <p className="font-bold text-black uppercase">Kepala UPT SMPN 2 Rebang Tangkas</p>
          <div className="h-20 flex items-center justify-center text-slate-300 italic text-[10px]">
            (Tanda Tangan & Cap Sekolah)
          </div>
          <div>
            <p className="font-black text-black underline decoration-1 uppercase tracking-wider">
              {kepalaSekolahName}
            </p>
            <p className="text-slate-800 font-mono text-[10px]">NIP. {kepalaSekolahNip}</p>
          </div>
        </div>

        {/* Sisi Kanan: Guru Mata Pelajaran dengan Tempat dan Tanggal Cetak */}
        <div className="text-center space-y-1">
          <p className="text-slate-800">
            Rebang Tangkas, <span className="font-semibold text-black">{currentDateFormatted}</span>
          </p>
          <p className="font-bold text-black uppercase">Guru Mata Pelajaran PAI & Budi Pekerti</p>
          <div className="h-20 flex items-center justify-center text-slate-300 italic text-[10px]">
            (Tanda Tangan Guru Mapel)
          </div>
          <div>
            <p className="font-black text-black underline decoration-1 uppercase tracking-wider">
              {guruMapelName}
            </p>
            <p className="text-slate-800 font-mono text-[10px]">NIP. {guruMapelNip}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ======================================================== */}
      {/* 1. SCREEN VIEW (Otomatis disembunyikan saat cetak)        */}
      {/* ======================================================== */}
      <div className="print:hidden space-y-6">
        {/* Header Title & Actions */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-1">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>REKAPITULASI NILAI PARALEL KURIKULUM MERDEKA</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900">
                REKAP NILAI PAI ({selectedSemester})
              </h1>
              <p className="text-xs text-slate-500">
                Kelompok kelas paralel (7A, 7B, 8A, 8B, 9A, 9B). KKM = 75: Nilai ≥ 75 bertinta <strong>HITAM</strong>, nilai &lt; 75 bertinta <strong className="text-red-600">MERAH</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Tombol Cetak A4 Landscape */}
              <button
                type="button"
                onClick={handlePrint}
                className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-blue-500/20 active:scale-95"
                title="Cetak Rekap Nilai ke Kertas A4 Landscape dengan Kop UPT SMPN 2 Rebang Tangkas dan Tanda Tangan"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak A4 Landscape</span>
              </button>

              {/* Tombol Pratinjau Cetak */}
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(true)}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
                title="Pratinjau Lembar Dokumen A4 Landscape sebelum mencetak"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau Cetak</span>
              </button>

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
                onClick={handleOpenAdd}
                className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
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
                onClick={() => {
                  if (searchTerm.trim()) {
                    showToast(`Ditemukan ${filteredData.length} data untuk pencarian "${searchTerm}"`, 'info');
                  } else {
                    showToast(`Menampilkan seluruh ${filteredData.length} data siswa`, 'info');
                  }
                }}
                className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs cursor-pointer shadow-xs transition"
              >
                Cari
              </button>
            </div>
          </div>

          {/* Legend Indicator */}
          <div className="flex flex-wrap items-center gap-4 text-xs pt-1 px-1">
            <span className="font-bold text-slate-600">Keterangan Warna Nilai:</span>
            <span className="flex items-center gap-1.5 font-bold text-black">
              <span className="w-3 h-3 rounded-full bg-black inline-block shadow-xs" />
              <span>Nilai ≥ 75: Tuntas (Teks Warna Hitam)</span>
            </span>
            <span className="flex items-center gap-1.5 font-bold text-red-600">
              <span className="w-3 h-3 rounded-full bg-red-600 inline-block shadow-xs" />
              <span>Nilai &lt; 75: Belum Tuntas / Remidial (Teks Warna Merah)</span>
            </span>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-center font-bold">
                  <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-200 w-10">No</th>
                  <th rowSpan={2} className="py-2.5 px-3 text-left border-r border-slate-200 min-w-[150px]">Nama Siswa</th>
                  <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-200 w-12">Kelas</th>
                  <th colSpan={5} className="py-1 px-2 border-r border-slate-200 bg-blue-50/70 text-blue-900">Ulangan Harian (UH)</th>
                  <th colSpan={5} className="py-1 px-2 border-r border-slate-200 bg-amber-50/70 text-amber-900">Tugas (TGS)</th>
                  <th colSpan={5} className="py-1 px-2 border-r border-slate-200 bg-emerald-50/70 text-emerald-900">Hafalan Surat</th>
                  <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-200 bg-purple-50/80 text-purple-900 w-12">PTS</th>
                  <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-200 bg-purple-50/80 text-purple-900 w-12">PAS</th>
                  <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200 bg-indigo-100 text-indigo-950 font-black w-16">Rerata</th>
                  <th rowSpan={2} className="py-2.5 px-2 border-r border-slate-200 w-12">KKM</th>
                  <th rowSpan={2} className="py-2.5 px-2 text-center w-16">Aksi</th>
                </tr>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-500 text-[10px] text-center font-bold">
                  <th className="py-1 px-1 bg-blue-50/40">1</th>
                  <th className="py-1 px-1 bg-blue-50/40">2</th>
                  <th className="py-1 px-1 bg-blue-50/40">3</th>
                  <th className="py-1 px-1 bg-blue-50/40">4</th>
                  <th className="py-1 px-1 bg-blue-50/40 border-r border-slate-200">5</th>
                  <th className="py-1 px-1 bg-amber-50/40">1</th>
                  <th className="py-1 px-1 bg-amber-50/40">2</th>
                  <th className="py-1 px-1 bg-amber-50/40">3</th>
                  <th className="py-1 px-1 bg-amber-50/40">4</th>
                  <th className="py-1 px-1 bg-amber-50/40 border-r border-slate-200">5</th>
                  <th className="py-1 px-1 bg-emerald-50/40">1</th>
                  <th className="py-1 px-1 bg-emerald-50/40">2</th>
                  <th className="py-1 px-1 bg-emerald-50/40">3</th>
                  <th className="py-1 px-1 bg-emerald-50/40">4</th>
                  <th className="py-1 px-1 bg-emerald-50/40 border-r border-slate-200">5</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item, idx) => {
                  const isRowBelow75 = item.rerata < 75;
                  return (
                    <tr
                      key={item.id}
                      className={`transition text-center ${
                        isRowBelow75
                          ? 'bg-red-50/40 hover:bg-red-100/40'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className={`py-2.5 px-2 text-center font-bold ${isRowBelow75 ? 'text-red-500' : 'text-slate-400'}`}>
                        {idx + 1}
                      </td>
                      <td className={`py-2.5 px-3 text-left font-bold ${isRowBelow75 ? 'text-red-600' : 'text-black'}`}>
                        <div className="flex items-center gap-1.5">
                          <span>{item.nama}</span>
                          {isRowBelow75 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-red-100 text-red-600 border border-red-200">
                              Remidial
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`py-2.5 px-2 font-bold ${isRowBelow75 ? 'text-red-600' : 'text-blue-700'}`}>
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
                      <td className={`py-2.5 px-3 font-black ${isRowBelow75 ? 'bg-red-100/60' : 'bg-indigo-50'}`}>
                        {renderScoreCell(item.rerata)}
                      </td>
                      <td className={`py-2.5 px-2 font-mono font-bold ${isRowBelow75 ? 'text-red-500' : 'text-slate-500'}`}>
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
                              deleteRekapNilai(item.id);
                              showToast(`Data nilai ${item.nama} berhasil dihapus`, 'info');
                            }}
                            className="p-1 rounded-md text-red-600 hover:bg-red-50 cursor-pointer active:scale-90 transition"
                            title="Hapus Nilai"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. OFFICIAL A4 LANDSCAPE PRINT VIEW                      */}
      {/* (Hanya tampak saat proses cetak window.print)             */}
      {/* ======================================================== */}
      <div className="hidden print:block w-full" id="printable-rekap-document">
        {renderPrintableDocument(false)}
      </div>

      {/* ======================================================== */}
      {/* 3. MODAL PRATINJAU CETAK DOKUMEN (PREVIEW)               */}
      {/* ======================================================== */}
      {isPreviewModalOpen && (
        <div className="print:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <Printer className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Pratinjau Lembar Rekap Nilai Resmi (A4 Landscape)
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Format cetak kertas A4 Landscape dengan Kop UPT SMPN 2 Rebang Tangkas & Tanda Tangan
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Sekarang</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable Sheet Preview */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-100">
              <div className="shadow-xl rounded-xl border border-slate-300 overflow-hidden bg-white">
                {renderPrintableDocument(true)}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span>
                Tips: Gunakan opsi printer <strong>"Landscape"</strong> dan <strong>"Paper size: A4"</strong> pada dialog cetak browser Anda.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold transition"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MODAL TAMBAH / EDIT NILAI                             */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="print:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-black text-slate-900 border-b pb-2">
              {editingNilai ? 'Edit Nilai Siswa' : 'Tambah Rekap Nilai Siswa'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Siswa</label>
                  <input
                    type="text"
                    value={formNilai.nama}
                    onChange={e => setFormNilai({ ...formNilai, nama: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas Paralel</label>
                  <select
                    value={formNilai.kelasParalel}
                    onChange={e => {
                      const val = e.target.value;
                      const ting = val.charAt(0) as any;
                      setFormNilai({ ...formNilai, kelasParalel: val, tingkat: ting });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold outline-none"
                  >
                    {['7A', '7B', '8A', '8B', '9A', '9B'].map(c => (
                      <option key={c} value={c}>
                        Kelas {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Input UH 1-5 */}
              <div>
                <label className="block font-bold text-blue-900 mb-1">
                  Nilai Ulangan Harian (UH 1 s/d 5)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i}>
                      <span className="block text-[10px] text-slate-500 mb-0.5 text-center">UH {i}</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={(formNilai as any)[`uh${i}`]}
                        onChange={e =>
                          setFormNilai({ ...formNilai, [`uh${i}`]: Number(e.target.value) })
                        }
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-center font-bold outline-none"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Tugas 1-5 */}
              <div>
                <label className="block font-bold text-amber-900 mb-1">
                  Nilai Tugas & Proyek Mandiri (TGS 1 s/d 5)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i}>
                      <span className="block text-[10px] text-slate-500 mb-0.5 text-center">Tgs {i}</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={(formNilai as any)[`tgs${i}`]}
                        onChange={e =>
                          setFormNilai({ ...formNilai, [`tgs${i}`]: Number(e.target.value) })
                        }
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-center font-bold outline-none"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Hafalan 1-5 */}
              <div>
                <label className="block font-bold text-emerald-900 mb-1">
                  Nilai Setoran Hafalan Surat (1 s/d 5)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i}>
                      <span className="block text-[10px] text-slate-500 mb-0.5 text-center">Hafalan {i}</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={(formNilai as any)[`hafalan${i}`]}
                        onChange={e =>
                          setFormNilai({ ...formNilai, [`hafalan${i}`]: Number(e.target.value) })
                        }
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-center font-bold outline-none"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Input PTS & PAS */}
              <div className="grid grid-cols-2 gap-3">
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
