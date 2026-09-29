export type UserRole = 'admin' | 'guru' | 'siswa';

export type GradeLevel = '7' | '8' | '9';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  identifier: string; // NISN for Siswa, NIP/NIK for Guru, NIP for Admin
  gradeLevel?: GradeLevel; // for Siswa
  className?: string; // e.g., '7A', '8B', '9C' for Siswa
  subject?: string; // for Guru e.g., 'Ilmu Pengetahuan Alam (IPA)'
  avatar?: string;
  email?: string;
  phone?: string;
}

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
  targetClasses: string[]; // e.g. ['7A', '7B', '7C']
  durationMinutes: number;
  passingGrade: number; // KKM (e.g. 75)
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
  answers: Record<string, string>; // questionId -> 'A' | 'B' | 'C' | 'D'
  doubtfulStatus: Record<string, boolean>; // questionId -> true/false
  totalQuestions: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  score: number;
  isPassed: boolean;
  startedAt: string;
  submittedAt: string;
  violationCount: number; // anti-cheat detection count
  timeSpentSeconds: number;
}

export interface SchoolConfig {
  governmentHeader: string;
  departmentHeader: string;
  name: string;
  npsn: string;
  address: string;
  principal: string;
  academicYear: string;
  currentSemester: 'Ganjil' | 'Genap';
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
  recipientId: string; // or 'all' or class e.g. '7A'
  recipientName: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}
