import React, { useState, useRef } from 'react';
import {
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  AlertCircle,
  X,
  Sparkles,
  Maximize2,
  RefreshCw,
  Camera,
  Info,
} from 'lucide-react';
import {
  normalizeImageUrl,
  isGoogleDriveUrl,
  extractGoogleDriveFileId,
  compressImageFile,
  DEFAULT_AVATAR,
  DEFAULT_STUDENT_AVATAR,
} from '../../utils/imageUtils';

interface PhotoUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoUrl?: string;
  onSavePhoto: (newUrl: string) => void;
  title?: string;
  subtitle?: string;
  role?: 'guru' | 'siswa';
  presets?: string[];
}

export const PhotoUploaderModal: React.FC<PhotoUploaderModalProps> = ({
  isOpen,
  onClose,
  currentPhotoUrl = '',
  onSavePhoto,
  title = 'Ganti Foto Profil',
  subtitle = 'Unggah foto dari Google Drive atau pilih berkas dari perangkat Anda.',
  role = 'guru',
  presets = [],
}) => {
  const [activeTab, setActiveTab] = useState<'drive' | 'file' | 'preset'>('drive');
  const [urlInput, setUrlInput] = useState(currentPhotoUrl || '');
  const [previewUrl, setPreviewUrl] = useState(normalizeImageUrl(currentPhotoUrl) || '');
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const defaultPresets =
    presets.length > 0
      ? presets
      : role === 'guru'
      ? [
          'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        ]
      : [
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
        ];

  const handleUrlChange = (val: string) => {
    setUrlInput(val);
    setErrorMessage('');
    if (val.trim()) {
      const converted = normalizeImageUrl(val);
      setPreviewUrl(converted);
    } else {
      setPreviewUrl('');
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsProcessingFile(true);
      setErrorMessage('');
      const compressedDataUrl = await compressImageFile(file, 800, 0.85);
      setUrlInput(compressedDataUrl);
      setPreviewUrl(compressedDataUrl);
      setActiveTab('drive'); // Show preview with URL
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memproses berkas foto');
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl && !urlInput.trim()) {
      setErrorMessage('Silakan masukkan tautan Google Drive atau pilih berkas foto.');
      return;
    }
    const finalUrl = previewUrl || normalizeImageUrl(urlInput.trim());
    onSavePhoto(finalUrl);
    onClose();
  };

  const isDrive = isGoogleDriveUrl(urlInput);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 via-white to-indigo-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {title}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('drive')}
              className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'drive'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Google Drive / URL</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('file')}
              className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'file'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah Berkas</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preset')}
              className={`py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'preset'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Foto Contoh</span>
            </button>
          </div>

          {/* Tab 1: Google Drive URL */}
          {activeTab === 'drive' && (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Tautan Google Drive atau URL Gambar</span>
                  {isDrive && (
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Link Drive Terdeteksi
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={e => handleUrlChange(e.target.value)}
                    placeholder="Contoh: https://drive.google.com/file/d/1a2b3c.../view?usp=sharing"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs transition"
                  />
                  {urlInput && (
                    <button
                      type="button"
                      onClick={() => handleUrlChange('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Google Drive Guide Box */}
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-800">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Petunjuk Link Google Drive:</span>
                </div>
                <p className="text-[11px] text-amber-800/90 leading-relaxed pl-5">
                  1. Di Google Drive, klik kanan foto &gt; pilih <strong>Bagikan (Share)</strong>.<br />
                  2. Ubah Akses umum menjadi: <strong>"Siapa saja yang memiliki link"</strong> (Anyone with link).<br />
                  3. Salin link dan tempelkan di kotak di atas. Sistem otomatis mengonversi ke foto langsung!
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: File Upload */}
          {activeTab === 'file' && (
            <div className="space-y-3">
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-xs">
                    {isProcessingFile
                      ? 'Sedang memproses gambar...'
                      : 'Klik atau tarik foto ke sini'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Mendukung format JPG, PNG, WEBP dari komputer, HP, atau hasil unduhan Google Drive
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs"
                >
                  Pilih File Foto
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Presets */}
          {activeTab === 'preset' && (
            <div className="space-y-2">
              <span className="font-bold text-slate-700 block">
                Pilih Contoh Foto Resmi:
              </span>
              <div className="grid grid-cols-4 gap-2.5">
                {defaultPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUrlInput(preset);
                      setPreviewUrl(preset);
                    }}
                    className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition group cursor-pointer ${
                      previewUrl === preset
                        ? 'border-blue-600 ring-2 ring-blue-400 shadow-md'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <img
                      src={preset}
                      alt={`Preset ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {previewUrl === preset && (
                      <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center text-white">
                        <Check className="w-5 h-5 drop-shadow-md" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preview & Aspect Fit Adjustment Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>Pratinjau & Penyesuaian Gambar:</span>
              </span>

              {/* Fit adjustment mode buttons */}
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setFitMode('cover')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    fitMode === 'cover'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Isi penuh bingkai secara simetris"
                >
                  Penuh (Cover)
                </button>
                <button
                  type="button"
                  onClick={() => setFitMode('contain')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    fitMode === 'contain'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Tampilkan foto utuh tanpa terpotong"
                >
                  Utuh (Contain)
                </button>
              </div>
            </div>

            {/* Visual Preview Containers: Circular Avatar + Rectangle Card */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
              {/* Circular Avatar Preview */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200 border-4 border-white shadow-lg ring-2 ring-blue-500/30 flex items-center justify-center relative">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview Bulat"
                      onError={e => {
                        // Fallback if primary link fails
                        const target = e.currentTarget;
                        if (!target.dataset.triedAlternate && isDrive) {
                          target.dataset.triedAlternate = 'true';
                          const id = extractGoogleDriveFileId(urlInput);
                          if (id) {
                            target.src = `https://lh3.googleusercontent.com/d/${id}=w1000`;
                            return;
                          }
                        }
                        target.src = role === 'guru' ? DEFAULT_AVATAR : DEFAULT_STUDENT_AVATAR;
                      }}
                      className={`w-full h-full ${
                        fitMode === 'cover' ? 'object-cover object-center' : 'object-contain bg-slate-900/10'
                      }`}
                    />
                  ) : (
                    <div className="text-slate-400 text-center p-2">
                      <Camera className="w-7 h-7 mx-auto opacity-40 mb-1" />
                      <span className="text-[9px] block">Belum ada foto</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-500">Tampilan Profil</span>
              </div>

              {/* Rectangular Card Preview */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-32 h-24 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-md ring-1 ring-slate-200 flex items-center justify-center relative">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview Kartu"
                      onError={e => {
                        e.currentTarget.src =
                          role === 'guru' ? DEFAULT_AVATAR : DEFAULT_STUDENT_AVATAR;
                      }}
                      className={`w-full h-full ${
                        fitMode === 'cover' ? 'object-cover object-center' : 'object-contain bg-slate-900/10'
                      }`}
                    />
                  ) : (
                    <div className="text-slate-400 text-center p-2">
                      <ImageIcon className="w-7 h-7 mx-auto opacity-40 mb-1" />
                      <span className="text-[9px] block">Pratinjau Kartu</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-500">Tampilan Kartu</span>
              </div>
            </div>

            <p className="text-[10px] text-center text-slate-500 italic">
              Foto otomatis menyesuaikan proporsi resolusi terbaik pada profil guru, siswa, dan kartu identitas.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm shadow-blue-600/30 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan & Simpan Foto</span>
          </button>
        </div>
      </div>
    </div>
  );
};
