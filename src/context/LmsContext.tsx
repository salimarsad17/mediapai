import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Exam, ExamSubmission, SchoolConfig, UserRole, GradeLevel, PaiModule, ChatMessage } from '../types';
import {
  INITIAL_USERS,
  INITIAL_EXAMS,
  INITIAL_SUBMISSIONS,
  INITIAL_SCHOOL_CONFIG,
  INITIAL_PAI_MODULES,
  INITIAL_CHAT_MESSAGES,
} from '../data/initialData';

export type MainNavTab = 'beranda' | 'materi' | 'ujian' | 'nilai' | 'pesan';

interface LmsContextType {
  currentUser: User | null;
  users: User[];
  exams: Exam[];
  submissions: ExamSubmission[];
  schoolConfig: SchoolConfig;
  modules: PaiModule[];
  chatMessages: ChatMessage[];
  
  // Navigation & UI state
  activeRole: UserRole | null;
  activeView: string;
  setActiveView: (view: string) => void;
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  
  // CBT Engine State
  currentExam: Exam | null;
  examAnswers: Record<string, string>;
  examDoubtful: Record<string, boolean>;
  examViolations: number;
  examStartedAt: number | null;
  lastCompletedSubmission: ExamSubmission | null;
  
  // Actions
  login: (identifier: string, role?: UserRole) => { success: boolean; message?: string };
  loginAsUser: (user: User) => void;
  logout: () => void;
  quickSwitchUser: (role: 'guru' | 'siswa', grade?: GradeLevel) => void;
  
  // Exam student actions
  startExamWithToken: (examId: string, token: string) => { success: boolean; message?: string };
  answerQuestion: (questionId: string, answer: string) => void;
  toggleDoubtful: (questionId: string) => void;
  registerExamViolation: () => void;
  submitExam: () => ExamSubmission | null;
  exitExamEarly: () => void;
  viewSubmissionDetails: (submission: ExamSubmission) => void;
  
  // Guru exam actions
  addExam: (exam: Omit<Exam, 'id' | 'createdAt'>) => Exam;
  updateExam: (exam: Exam) => void;
  deleteExam: (examId: string) => void;
  togglePublishExam: (examId: string) => void;
  
  // PAI Module Actions
  addModule: (module: Omit<PaiModule, 'id'>) => void;
  deleteModule: (moduleId: string) => void;
  
  // Chat Actions
  sendMessage: (recipientId: string, recipientName: string, message: string) => void;
  markMessageAsRead: (messageId: string) => void;
  
  // User Management
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  
  // Settings
  updateSchoolConfig: (config: Partial<SchoolConfig>) => void;
  resetAllData: () => void;
}

const LmsContext = createContext<LmsContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'media_pai_users_v4',
  EXAMS: 'media_pai_exams_v4',
  SUBMISSIONS: 'media_pai_submissions_v4',
  SCHOOL: 'media_pai_school_v4',
  MODULES: 'media_pai_modules_v4',
  MESSAGES: 'media_pai_messages_v4',
  ACTIVE_USER: 'media_pai_active_user_v4',
};

export const LmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXAMS);
      return saved ? JSON.parse(saved) : INITIAL_EXAMS;
    } catch {
      return INITIAL_EXAMS;
    }
  });

  const [submissions, setSubmissions] = useState<ExamSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHOOL);
      return saved ? JSON.parse(saved) : INITIAL_SCHOOL_CONFIG;
    } catch {
      return INITIAL_SCHOOL_CONFIG;
    }
  });

  const [modules, setModules] = useState<PaiModule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MODULES);
      return saved ? JSON.parse(saved) : INITIAL_PAI_MODULES;
    } catch {
      return INITIAL_PAI_MODULES;
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
    } catch {
      return INITIAL_CHAT_MESSAGES;
    }
  });

  // Current logged in user (Default to Siswa Kelas 7 or saved)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      if (saved) return JSON.parse(saved);
      // Default to student 7A for immediate friendly experience
      return INITIAL_USERS.find(u => u.username === 'siswa7') || INITIAL_USERS[2];
    } catch {
      return INITIAL_USERS[2];
    }
  });

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [activeTab, setActiveTab] = useState<MainNavTab>('beranda');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // CBT Exam Session State
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [examDoubtful, setExamDoubtful] = useState<Record<string, boolean>>({});
  const [examViolations, setExamViolations] = useState<number>(0);
  const [examStartedAt, setExamStartedAt] = useState<number | null>(null);
  const [lastCompletedSubmission, setLastCompletedSubmission] = useState<ExamSubmission | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [exams]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [submissions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(modules));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [modules]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(chatMessages));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [chatMessages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(schoolConfig));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [schoolConfig]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [currentUser]);

  // Login handler - ONLY guru and siswa
  const login = (identifier: string, role?: UserRole): { success: boolean; message?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const foundUser = users.find(u => {
      const matchId = u.identifier.toLowerCase() === cleanId;
      const matchUsername = u.username.toLowerCase() === cleanId;
      if (role) {
        return (matchId || matchUsername) && u.role === role;
      }
      return matchId || matchUsername;
    });

    if (foundUser) {
      setCurrentUser(foundUser);
      setActiveView('dashboard');
      setActiveTab('beranda');
      setCurrentExam(null);
      return { success: true };
    }

    return {
      success: false,
      message: 'NISN / NIP / Username tidak ditemukan. Silakan cek kembali atau gunakan tombol Login Cepat Demo.',
    };
  };

  const loginAsUser = (user: User) => {
    setCurrentUser(user);
    setActiveView('dashboard');
    setActiveTab('beranda');
    setCurrentExam(null);
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentExam(null);
    setActiveView('login');
  };

  // Quick switch for test evaluation - ONLY Guru and Siswa
  const quickSwitchUser = (role: 'guru' | 'siswa', grade?: GradeLevel) => {
    let targetUser: User | undefined;
    if (role === 'guru') {
      targetUser = users.find(u => u.role === 'guru');
    } else if (role === 'siswa') {
      if (grade) {
        targetUser = users.find(u => u.role === 'siswa' && u.gradeLevel === grade);
      }
      if (!targetUser) {
        targetUser = users.find(u => u.role === 'siswa');
      }
    }

    if (targetUser) {
      setCurrentUser(targetUser);
      setCurrentExam(null);
      setActiveView('dashboard');
    }
  };

  // Student CBT Methods
  const startExamWithToken = (examId: string, token: string): { success: boolean; message?: string } => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) {
      return { success: false, message: 'Ujian tidak ditemukan.' };
    }

    if (!exam.isPublished) {
      return { success: false, message: 'Ujian ini belum dipublikasikan oleh guru pengampu.' };
    }

    if (exam.token.trim().toUpperCase() !== token.trim().toUpperCase()) {
      return { success: false, message: 'Token ujian salah! Silakan tanyakan kepada Guru PAI pengawas ujian.' };
    }

    // Check if student already submitted
    if (currentUser) {
      const alreadyDone = submissions.some(s => s.examId === examId && s.studentId === currentUser.id);
      if (alreadyDone) {
        return { success: false, message: 'Anda sudah menyelesaikan ujian ini sebelumnya.' };
      }
    }

    setCurrentExam(exam);
    setExamAnswers({});
    setExamDoubtful({});
    setExamViolations(0);
    setExamStartedAt(Date.now());
    setActiveView('exam-cbt');

    return { success: true };
  };

  const answerQuestion = (questionId: string, answer: string) => {
    setExamAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const toggleDoubtful = (questionId: string) => {
    setExamDoubtful(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const registerExamViolation = () => {
    setExamViolations(prev => prev + 1);
  };

  const submitExam = (): ExamSubmission | null => {
    if (!currentExam || !currentUser) return null;

    let correctCount = 0;
    const totalQuestions = currentExam.questions.length;

    currentExam.questions.forEach(q => {
      if (examAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const isPassed = calculatedScore >= currentExam.passingGrade;
    const timeSpentSeconds = examStartedAt ? Math.round((Date.now() - examStartedAt) / 1000) : 0;

    const newSubmission: ExamSubmission = {
      id: `sub-${Date.now()}`,
      examId: currentExam.id,
      examTitle: currentExam.title,
      subject: currentExam.subject,
      gradeLevel: currentExam.gradeLevel,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentNisn: currentUser.identifier,
      studentClass: currentUser.className || `${currentUser.gradeLevel || '7'}A`,
      answers: { ...examAnswers },
      doubtfulStatus: { ...examDoubtful },
      totalQuestions,
      correctAnswersCount: correctCount,
      wrongAnswersCount: totalQuestions - correctCount,
      score: calculatedScore,
      isPassed,
      startedAt: examStartedAt ? new Date(examStartedAt).toISOString() : new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      violationCount: examViolations,
      timeSpentSeconds,
    };

    setSubmissions(prev => [newSubmission, ...prev.filter(s => !(s.examId === currentExam.id && s.studentId === currentUser.id))]);
    setLastCompletedSubmission(newSubmission);
    setCurrentExam(null);
    setActiveView('exam-result');

    return newSubmission;
  };

  const exitExamEarly = () => {
    setCurrentExam(null);
    setActiveView('dashboard');
    setActiveTab('ujian');
  };

  const viewSubmissionDetails = (submission: ExamSubmission) => {
    setLastCompletedSubmission(submission);
    setActiveView('exam-result');
  };

  // Guru exam management actions
  const addExam = (examData: Omit<Exam, 'id' | 'createdAt'>): Exam => {
    const newExam: Exam = {
      ...examData,
      id: `exam-pai-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setExams(prev => [newExam, ...prev]);
    return newExam;
  };

  const updateExam = (updatedExam: Exam) => {
    setExams(prev => prev.map(e => (e.id === updatedExam.id ? updatedExam : e)));
  };

  const deleteExam = (examId: string) => {
    setExams(prev => prev.filter(e => e.id !== examId));
    setSubmissions(prev => prev.filter(s => s.examId !== examId));
  };

  const togglePublishExam = (examId: string) => {
    setExams(prev =>
      prev.map(e => (e.id === examId ? { ...e, isPublished: !e.isPublished } : e))
    );
  };

  // PAI Module Actions
  const addModule = (modData: Omit<PaiModule, 'id'>) => {
    const newMod: PaiModule = {
      ...modData,
      id: `modul-pai-${Date.now()}`,
    };
    setModules(prev => [newMod, ...prev]);
  };

  const deleteModule = (moduleId: string) => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
  };

  // Chat Actions
  const sendMessage = (recipientId: string, recipientName: string, message: string) => {
    if (!currentUser || !message.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      recipientId,
      recipientName,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setChatMessages(prev => [...prev, newMsg]);
  };

  const markMessageAsRead = (messageId: string) => {
    setChatMessages(prev => prev.map(m => m.id === messageId ? { ...m, isRead: true } : m));
  };

  // User Management
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const updateSchoolConfig = (config: Partial<SchoolConfig>) => {
    setSchoolConfig(prev => ({ ...prev, ...config }));
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.EXAMS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.SCHOOL);
    localStorage.removeItem(STORAGE_KEYS.MODULES);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);

    setUsers(INITIAL_USERS);
    setExams(INITIAL_EXAMS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setSchoolConfig(INITIAL_SCHOOL_CONFIG);
    setModules(INITIAL_PAI_MODULES);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setCurrentUser(INITIAL_USERS[2]); // Ahmad Rifai (Siswa 7)
    setActiveView('dashboard');
    setActiveTab('beranda');
    setCurrentExam(null);
  };

  return (
    <LmsContext.Provider
      value={{
        currentUser,
        users,
        exams,
        submissions,
        schoolConfig,
        modules,
        chatMessages,
        activeRole: currentUser?.role || null,
        activeView,
        setActiveView,
        activeTab,
        setActiveTab,
        isSidebarOpen,
        setIsSidebarOpen,
        currentExam,
        examAnswers,
        examDoubtful,
        examViolations,
        examStartedAt,
        lastCompletedSubmission,
        login,
        loginAsUser,
        logout,
        quickSwitchUser,
        startExamWithToken,
        answerQuestion,
        toggleDoubtful,
        registerExamViolation,
        submitExam,
        exitExamEarly,
        viewSubmissionDetails,
        addExam,
        updateExam,
        deleteExam,
        togglePublishExam,
        addModule,
        deleteModule,
        sendMessage,
        markMessageAsRead,
        addUser,
        updateUser,
        deleteUser,
        updateSchoolConfig,
        resetAllData,
      }}
    >
      {children}
    </LmsContext.Provider>
  );
};

export const useLms = (): LmsContextType => {
  const context = useContext(LmsContext);
  if (!context) {
    throw new Error('useLms must be used within an LmsProvider');
  }
  return context;
};
