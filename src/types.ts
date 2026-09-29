export type UserRole = 'guru' | 'siswa';

export type GradeLevel = '7' | '8' | '9';
export type SemesterType = 'Semester 1 (Ganjil)' | 'Semester 2 (Genap)';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  identifier: string; // NISN/NIS for Siswa, NIP/NIK for Guru
  gradeLevel?: GradeLevel; // for Siswa
  className?: string; // e.g., '7A', '7B', '8A', '8B', '9A', '9B'
  subject?: string; // for Guru e.g., 'Pendidikan Agama Islam & BP'
  avatar?: string;
  email?: string;
  phone?: string;
  bio?: string;
  password?: string;
}

export interface SchoolProfile {
  name: string;
  npsn: string;
  visi: string;
  misi: string[];
  sejarah: string;
  alamat: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  status: 'Negeri' | 'Swasta';
  skIzinOperasional: string;
  akreditasi: string;
  telepon: string;
  email: string;
  website: string;
}

export interface GuruItem {
  id: string;
  no: number;
  foto: string;
  nama: string;
  nip: string;
  mataPelajaran: string;
  pendidikan: string;
  statusKepegawaian: string;
  phone?: string;
}

export interface KelasItem {
  id: string;
  no: number;
  kelas: string; // e.g., '7A', '7B', '8A', '8B', '9A', '9B'
  tingkat: GradeLevel;
  semester: SemesterType;
  waliKelas: string;
  mataPelajaran: string;
  jumlahSiswa: number;
  ruangan?: string;
}

export interface SiswaItem {
  id: string;
  no: number;
  nama: string;
  nis: string;
  nisn: string;
  kelas: string;
  tingkat: GradeLevel;
  semester: SemesterType;
  jenisKelamin: 'L' | 'P';
  alamat?: string;
  waliMurid?: string;
  telepon?: string;
  foto?: string;
}

export interface PerangkatAjarItem {
  id: string;
  jenis: 'CP' | 'ATP' | 'Modul Ajar' | 'KKTP';
  judul: string;
  tingkat: GradeLevel;
  semester: SemesterType;
  deskripsi: string;
  konten: string;
  keterangan: string;
  tanggalUpdate: string;
  targetKktp?: number;
}

export type BahanAjarType =
  | 'materi'
  | 'video'
  | 'game_battle'
  | 'tts'
  | 'puzzle'
  | 'lkpd'
  | 'lms';

export interface BahanAjarItem {
  id: string;
  judul: string;
  tipe: BahanAjarType;
  tingkat: GradeLevel;
  semester: SemesterType;
  deskripsi: string;
  kontenUtama: string; // Text, video URL, JSON for games/puzzles
  mediaUrl?: string;
  isSentToStudents: boolean; // Crucial: tombol "Kirim ke Siswa"
  sentAt?: string;
  durasiMenit?: number;
  bobotNilai?: number;
  targetKelas: string[]; // e.g. ['7A', '7B']
  gameData?: any; // Questions for battle game, TTS grid, Puzzle cards
}

export interface StudentTaskSubmission {
  id: string;
  taskId: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  submittedAt: string;
  score: number;
  answers: any;
  feedback?: string;
}

export interface JurnalGuruItem {
  id: string;
  hariTanggal: string;
  kelas: string;
  tingkat: GradeLevel;
  semester: SemesterType;
  materi: string;
  kbm: string; // Kegiatan Belajar Mengajar
  absensiRingkasan: string; // e.g., 'Hadir: 30, Sakit: 1, Izin: 1, Alpa: 0'
  catatanRefleksi: string;
  siswaHadirCount: number;
  siswaTotalCount: number;
}

export interface JurnalSikapItem {
  id: string;
  hariTanggal: string;
  kelas: string;
  tingkat: GradeLevel;
  semester: SemesterType;
  siswaId: string;
  namaSiswa: string;
  nisNisn: string;
  kategoriSikap: 'Spiritual' | 'Sosial';
  butirSikap: string;
  kejadian: string;
  penyelesaian: string; // Tindak lanjut guru
  tindakLanjutStatus: 'Selesai' | 'Dalam Pembinaan' | 'Pemantauan';
}

export interface AbsenSiswaItem {
  id: string;
  siswaId: string;
  no: number;
  nama: string;
  kelas: string;
  tingkat: GradeLevel;
  semester: SemesterType;
  // Enam bulan data bulanan/rekapitulasi
  bulan: string; // e.g. 'Juli - Desember' atau nama bulan
  ijin: number;
  sakit: number;
  alpa: number;
  tanpaKeterangan: number;
  hadir: number;
  totalPertemuan: number;
  persentaseKehadiran: number;
}

export interface GuruWaliItem {
  id: string;
  hariTanggal: string;
  kelas: string;
  tingkat: GradeLevel;
  semester: SemesterType;
  siswaId: string;
  namaSiswa: string;
  nisNisn: string;
  kegiatan: string;
  foto: string;
  catatanWali: string;
  hasilPembinaan: string;
}

export interface RekapNilaiItem {
  id: string;
  no: number;
  siswaId: string;
  nama: string;
  kelasParalel: string; // '7A', '7B', '8A', '8B', '9A', '9B'
  tingkat: GradeLevel;
  semester: SemesterType;
  mapel: string;
  // UH 1 - UH 5
  uh1: number;
  uh2: number;
  uh3: number;
  uh4: number;
  uh5: number;
  // Tugas 1 - Tugas 5
  tgs1: number;
  tgs2: number;
  tgs3: number;
  tgs4: number;
  tgs5: number;
  // Hafalan Surat 1 - Hafalan Surat 5
  hafalan1: number;
  hafalan2: number;
  hafalan3: number;
  hafalan4: number;
  hafalan5: number;
  // Ujian
  pts: number;
  pas: number;
  rerata: number;
  kkm: number; // default 75
}

export interface PengumumanItem {
  id: string;
  judul: string;
  isi: string;
  tanggal: string;
  penulis: string;
  kategori: 'Penting' | 'Akademik' | 'Kegiatan Islami' | 'Umum';
  prioritas: 'Normal' | 'Tinggi';
}

export interface MasterHaditsItem {
  id: string;
  perawi: 'Bukhari' | 'Muslim' | 'Nasa\'i' | 'Ibnu Majah' | 'Abu Daud';
  tema: 'Aqidah' | 'Akhlak' | 'Fiqih' | 'Muamalah';
  nomor: number;
  arab: string;
  terjemah: string;
  sanadPerawi: string;
  hikmah: string;
}

export interface MasterSurahItem {
  nomor: number;
  nama: string;
  namaArab: string;
  arti: string;
  jumlahAyat: number;
  tempatTurun: 'Makkiyah' | 'Madaniyah';
  deskripsi: string;
  audioUrl: string;
  contohAyat: {
    ayat: number;
    arab: string;
    latin: string;
    arti: string;
  }[];
}

export interface MasterBukuItem {
  id: string;
  judul: string;
  tingkat: GradeLevel;
  tahunKurikulum: string; // 'CP 20 Tahun 2026'
  penulis: string;
  penerbit: string;
  deskripsi: string;
  coverUrl: string;
  daftarBab: string[];
  pdfDownloadUrl?: string;
}

export interface MasterKisahItem {
  id: string;
  kategori: 'Nabi' | 'Sahabat' | 'Ulama';
  tokoh: string;
  judulKisah: string;
  ringkasan: string;
  hikmahIbrah: string;
  periodeZaman: string;
}

export interface ExternalPortalLink {
  id: string;
  nama: string;
  akronim: string;
  deskripsi: string;
  url: string;
  kategori: string;
  badge: string;
}

// Compatibility types for legacy components
export interface QuestionOption {
  id: string;
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: string;
  text: string;
  image?: string;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  score: number;
  topic?: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  gradeLevel: GradeLevel;
  targetClasses: string[];
  durationMinutes: number;
  passingGrade: number;
  token: string;
  isPublished: boolean;
  questions: Question[];
  createdAt: string;
  teacherId: string;
  teacherName: string;
  instructions: string;
  shuffleQuestions?: boolean;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  examTitle: string;
  subject: string;
  gradeLevel: GradeLevel;
  studentId: string;
  studentName: string;
  studentNisn: string;
  studentClass: string;
  answers: Record<string, string>;
  doubtfulStatus: Record<string, boolean>;
  totalQuestions: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  score: number;
  isPassed: boolean;
  startedAt: string;
  submittedAt: string;
  violationCount: number;
  timeSpentSeconds: number;
}

export interface PaiModule {
  id: string;
  title: string;
  arabicTitle?: string;
  category: 'quran_hadis' | 'akidah' | 'akhlak' | 'fikih' | 'tarikh';
  gradeLevel: GradeLevel;
  semester: 'Ganjil' | 'Genap';
  description: string;
  content: string;
  versesOrHadits?: {
    arabic: string;
    transliteration?: string;
    translation: string;
    source: string;
  }[];
  keyPoints: string[];
  audioUrl?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

