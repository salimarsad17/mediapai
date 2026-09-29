import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  GradeLevel,
  SemesterType,
  SchoolProfile,
  GuruItem,
  KelasItem,
  SiswaItem,
  PerangkatAjarItem,
  BahanAjarItem,
  JurnalGuruItem,
  JurnalSikapItem,
  AbsenSiswaItem,
  GuruWaliItem,
  RekapNilaiItem,
  PengumumanItem,
  ChatMessage,
} from '../types';
import {
  INITIAL_SCHOOL_PROFILE,
  INITIAL_GURU_LIST,
  INITIAL_KELAS_LIST,
  INITIAL_SISWA_LIST,
  INITIAL_USERS_AUTH,
  INITIAL_PERANGKAT_AJAR,
  INITIAL_BAHAN_AJAR,
  INITIAL_JURNAL_GURU,
  INITIAL_JURNAL_SIKAP,
  INITIAL_ABSEN_SISWA,
  INITIAL_GURU_WALI,
  INITIAL_REKAP_NILAI,
  INITIAL_PENGUMUMAN,
  INITIAL_CHAT_MESSAGES,
} from '../data/initialData';

export type GuruMenuType = 'beranda' | 'data' | 'perangkat' | 'rekap_nilai' | 'pesan' | 'masterku' | 'pengaturan';
export type SiswaMenuType = 'beranda' | 'profil_siswa' | 'masterku' | 'tugas_siswa' | 'rekap_nilai' | 'pesan' | 'pengaturan';

interface LmsContextType {
  currentUser: User | null;
  users: User[];
  schoolProfile: SchoolProfile;
  guruList: GuruItem[];
  kelasList: KelasItem[];
  siswaList: SiswaItem[];
  perangkatAjarList: PerangkatAjarItem[];
  bahanAjarList: BahanAjarItem[];
  jurnalGuruList: JurnalGuruItem[];
  jurnalSikapList: JurnalSikapItem[];
  absenSiswaList: AbsenSiswaItem[];
  guruWaliList: GuruWaliItem[];
  rekapNilaiList: RekapNilaiItem[];
  pengumumanList: PengumumanItem[];
  chatMessages: ChatMessage[];

  // Navigation
  activeGuruMenu: GuruMenuType;
  setActiveGuruMenu: (menu: GuruMenuType) => void;
  activeGuruSubMenu: string;
  setActiveGuruSubMenu: (sub: string) => void;

  activeSiswaMenu: SiswaMenuType;
  setActiveSiswaMenu: (menu: SiswaMenuType) => void;

  selectedSemester: SemesterType;
  setSelectedSemester: (sem: SemesterType) => void;
  selectedGrade: GradeLevel | 'Semua';
  setSelectedGrade: (g: GradeLevel | 'Semua') => void;

  // Auth
  login: (identifier: string, role?: UserRole, password?: string) => { success: boolean; message?: string };
  loginAsUser: (user: User) => void;
  logout: () => void;
  quickSwitchUser: (role: 'guru' | 'siswa', grade?: GradeLevel) => void;
  updateCurrentUserProfile: (data: Partial<User>) => void;

  // CRUD Operations
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;

  // Guru CRUD
  addGuru: (item: Omit<GuruItem, 'id' | 'no'>) => void;
  updateGuru: (item: GuruItem) => void;
  deleteGuru: (id: string) => void;
  importGuruBulk: (items: Omit<GuruItem, 'id' | 'no'>[]) => void;

  // Kelas CRUD
  addKelas: (item: Omit<KelasItem, 'id' | 'no'>) => void;
  updateKelas: (item: KelasItem) => void;
  deleteKelas: (id: string) => void;
  importKelasBulk: (items: Omit<KelasItem, 'id' | 'no'>[]) => void;

  // Siswa CRUD
  addSiswa: (item: Omit<SiswaItem, 'id' | 'no'>) => void;
  updateSiswa: (item: SiswaItem) => void;
  deleteSiswa: (id: string) => void;
  importSiswaBulk: (items: Omit<SiswaItem, 'id' | 'no'>[]) => void;

  // Perangkat Ajar CRUD
  addPerangkatAjar: (item: Omit<PerangkatAjarItem, 'id'>) => void;
  updatePerangkatAjar: (item: PerangkatAjarItem) => void;
  deletePerangkatAjar: (id: string) => void;

  // Bahan Ajar AI CRUD & Kirim ke Siswa
  addBahanAjar: (item: Omit<BahanAjarItem, 'id'>) => void;
  updateBahanAjar: (item: BahanAjarItem) => void;
  deleteBahanAjar: (id: string) => void;
  toggleKirimKeSiswa: (id: string) => void;

  // Jurnal Guru CRUD
  addJurnalGuru: (item: Omit<JurnalGuruItem, 'id'>) => void;
  updateJurnalGuru: (item: JurnalGuruItem) => void;
  deleteJurnalGuru: (id: string) => void;

  // Jurnal Sikap CRUD
  addJurnalSikap: (item: Omit<JurnalSikapItem, 'id'>) => void;
  updateJurnalSikap: (item: JurnalSikapItem) => void;
  deleteJurnalSikap: (id: string) => void;

  // Absen Siswa CRUD
  addAbsenSiswa: (item: Omit<AbsenSiswaItem, 'id' | 'no'>) => void;
  updateAbsenSiswa: (item: AbsenSiswaItem) => void;
  deleteAbsenSiswa: (id: string) => void;

  // Guru Wali CRUD
  addGuruWali: (item: Omit<GuruWaliItem, 'id'>) => void;
  updateGuruWali: (item: GuruWaliItem) => void;
  deleteGuruWali: (id: string) => void;

  // Rekap Nilai CRUD
  addRekapNilai: (item: Omit<RekapNilaiItem, 'id' | 'no'>) => void;
  updateRekapNilai: (item: RekapNilaiItem) => void;
  deleteRekapNilai: (id: string) => void;

  // Pengumuman CRUD
  addPengumuman: (item: Omit<PengumumanItem, 'id'>) => void;
  deletePengumuman: (id: string) => void;

  // Chat Actions
  unreadMessagesCount: number;
  sendMessage: (recipientId: string, recipientName: string, message: string) => void;
  markMessageAsRead: (messageId: string) => void;
  markConversationAsRead: (partnerId: string) => void;
  markAllMessagesAsRead: () => void;
  simulateIncomingMessage: (senderRole?: UserRole) => void;

  // Reset Data
  resetAllData: () => void;

  // Toast Notifications
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

const STORAGE_PREFIX = 'media_pai_smpn2_v1_';

const LmsContext = createContext<LmsContextType | undefined>(undefined);

export const LmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage loader helper
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const TARGET_NEW_GURU_NAME = 'Ust. Sadiqul Alim, S.Pd.I., M.Pd.';
  const TARGET_NEW_GURU_PHOTO = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80';

  const [users, setUsers] = useState<User[]>(() => {
    const loaded = loadStored<User[]>('users', INITIAL_USERS_AUTH);
    return loaded.map(u =>
      u.name?.includes('Ahmad Fauzi')
        ? {
            ...u,
            name: TARGET_NEW_GURU_NAME,
            avatar: TARGET_NEW_GURU_PHOTO,
            email: 'sadiqul.alim@smpn2rebangtangkas.sch.id',
          }
        : u
    );
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = loadStored<User | null>('active_user', null);
    if (saved) {
      if (saved.name?.includes('Ahmad Fauzi')) {
        return {
          ...saved,
          name: TARGET_NEW_GURU_NAME,
          avatar: TARGET_NEW_GURU_PHOTO,
          email: 'sadiqul.alim@smpn2rebangtangkas.sch.id',
        };
      }
      return saved;
    }
    // Default logged in user: Guru PAI for instant full capability
    return INITIAL_USERS_AUTH[0];
  });

  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    const loaded = loadStored<SchoolProfile>('school_profile', INITIAL_SCHOOL_PROFILE);
    if (loaded && (loaded.npsn === '10806873' || !loaded.npsn)) {
      return { ...loaded, npsn: INITIAL_SCHOOL_PROFILE.npsn };
    }
    return loaded;
  });
  const [guruList, setGuruList] = useState<GuruItem[]>(() => {
    const loaded = loadStored<GuruItem[]>('guru_list', INITIAL_GURU_LIST);
    return loaded.map(g =>
      g.nama?.includes('Ahmad Fauzi')
        ? { ...g, nama: TARGET_NEW_GURU_NAME, foto: TARGET_NEW_GURU_PHOTO }
        : g
    );
  });
  const [kelasList, setKelasList] = useState<KelasItem[]>(() => {
    const loaded = loadStored<KelasItem[]>('kelas_list', INITIAL_KELAS_LIST);
    return loaded.map(k =>
      k.waliKelas?.includes('Ahmad Fauzi')
        ? { ...k, waliKelas: TARGET_NEW_GURU_NAME }
        : k
    );
  });
  const [siswaList, setSiswaList] = useState<SiswaItem[]>(() =>
    loadStored('siswa_list', INITIAL_SISWA_LIST)
  );
  const [perangkatAjarList, setPerangkatAjarList] = useState<PerangkatAjarItem[]>(() =>
    loadStored('perangkat_ajar', INITIAL_PERANGKAT_AJAR)
  );
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts(prev => [...prev.slice(-3), { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const [bahanAjarList, setBahanAjarList] = useState<BahanAjarItem[]>(() =>
    loadStored('bahan_ajar', INITIAL_BAHAN_AJAR)
  );
  const [jurnalGuruList, setJurnalGuruList] = useState<JurnalGuruItem[]>(() =>
    loadStored('jurnal_guru', INITIAL_JURNAL_GURU)
  );
  const [jurnalSikapList, setJurnalSikapList] = useState<JurnalSikapItem[]>(() =>
    loadStored('jurnal_sikap', INITIAL_JURNAL_SIKAP)
  );
  const [absenSiswaList, setAbsenSiswaList] = useState<AbsenSiswaItem[]>(() =>
    loadStored('absen_siswa', INITIAL_ABSEN_SISWA)
  );
  const [guruWaliList, setGuruWaliList] = useState<GuruWaliItem[]>(() =>
    loadStored('guru_wali', INITIAL_GURU_WALI)
  );
  const [rekapNilaiList, setRekapNilaiList] = useState<RekapNilaiItem[]>(() =>
    loadStored('rekap_nilai', INITIAL_REKAP_NILAI)
  );
  const [pengumumanList, setPengumumanList] = useState<PengumumanItem[]>(() => {
    const loaded = loadStored<PengumumanItem[]>('pengumuman', INITIAL_PENGUMUMAN);
    return loaded.map(p =>
      p.penulis?.includes('Ahmad Fauzi')
        ? { ...p, penulis: `${TARGET_NEW_GURU_NAME} (Guru PAI)` }
        : p
    );
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const loaded = loadStored<ChatMessage[]>('chat_messages', INITIAL_CHAT_MESSAGES);
    if (Array.isArray(loaded) && loaded.length > 0) {
      const mapped = loaded.map(m => ({
        ...m,
        senderName: m.senderName?.includes('Ahmad Fauzi') ? TARGET_NEW_GURU_NAME : m.senderName,
        senderAvatar: m.senderName?.includes('Ahmad Fauzi') ? TARGET_NEW_GURU_PHOTO : m.senderAvatar,
        recipientName: m.recipientName?.includes('Ahmad Fauzi') ? TARGET_NEW_GURU_NAME : m.recipientName,
        message: m.message?.replace(/Ustadz Fauzi/g, 'Ustadz Sadiqul Alim') || m.message,
      }));
      const existingIds = new Set(mapped.map(m => m.id));
      const missingSeeds = INITIAL_CHAT_MESSAGES.filter(m => !existingIds.has(m.id));
      if (missingSeeds.length > 0) {
        return [...mapped, ...missingSeeds];
      }
      return mapped;
    }
    return INITIAL_CHAT_MESSAGES;
  });

  // Nav states
  const [activeGuruMenu, setActiveGuruMenu] = useState<GuruMenuType>('beranda');
  const [activeGuruSubMenu, setActiveGuruSubMenu] = useState<string>('profil_sekolah');
  const [activeSiswaMenu, setActiveSiswaMenu] = useState<SiswaMenuType>('beranda');

  const [selectedSemester, setSelectedSemester] = useState<SemesterType>('Semester 1 (Ganjil)');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'Semua'>('Semua');

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'active_user', JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(users));
      localStorage.setItem(STORAGE_PREFIX + 'school_profile', JSON.stringify(schoolProfile));
      localStorage.setItem(STORAGE_PREFIX + 'guru_list', JSON.stringify(guruList));
      localStorage.setItem(STORAGE_PREFIX + 'kelas_list', JSON.stringify(kelasList));
      localStorage.setItem(STORAGE_PREFIX + 'siswa_list', JSON.stringify(siswaList));
      localStorage.setItem(STORAGE_PREFIX + 'perangkat_ajar', JSON.stringify(perangkatAjarList));
      localStorage.setItem(STORAGE_PREFIX + 'bahan_ajar', JSON.stringify(bahanAjarList));
      localStorage.setItem(STORAGE_PREFIX + 'jurnal_guru', JSON.stringify(jurnalGuruList));
      localStorage.setItem(STORAGE_PREFIX + 'jurnal_sikap', JSON.stringify(jurnalSikapList));
      localStorage.setItem(STORAGE_PREFIX + 'absen_siswa', JSON.stringify(absenSiswaList));
      localStorage.setItem(STORAGE_PREFIX + 'guru_wali', JSON.stringify(guruWaliList));
      localStorage.setItem(STORAGE_PREFIX + 'rekap_nilai', JSON.stringify(rekapNilaiList));
      localStorage.setItem(STORAGE_PREFIX + 'pengumuman', JSON.stringify(pengumumanList));
      localStorage.setItem(STORAGE_PREFIX + 'chat_messages', JSON.stringify(chatMessages));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [
    currentUser,
    users,
    schoolProfile,
    guruList,
    kelasList,
    siswaList,
    perangkatAjarList,
    bahanAjarList,
    jurnalGuruList,
    jurnalSikapList,
    absenSiswaList,
    guruWaliList,
    rekapNilaiList,
    pengumumanList,
    chatMessages,
  ]);

  // Auth functions
  const login = (identifier: string, role?: UserRole, inputPassword?: string): { success: boolean; message?: string } => {
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
      if (inputPassword && inputPassword.trim()) {
        const expectedPassword = foundUser.password || '123456';
        if (inputPassword.trim() !== expectedPassword) {
          return {
            success: false,
            message: 'Kata sandi salah. Silakan masukkan kata sandi yang sesuai dengan akun Anda (bawaan: 123456).',
          };
        }
      }
      setCurrentUser(foundUser);
      if (foundUser.role === 'guru') {
        setActiveGuruMenu('beranda');
      } else {
        setActiveSiswaMenu('beranda');
      }
      return { success: true };
    }

    return {
      success: false,
      message: `Data login tidak ditemukan. Pastikan NIP / NISN atau Username benar untuk ${
        role === 'guru' ? 'Guru' : 'Siswa'
      }.`,
    };
  };

  const loginAsUser = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'guru') {
      setActiveGuruMenu('beranda');
    } else {
      setActiveSiswaMenu('beranda');
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const quickSwitchUser = (role: 'guru' | 'siswa', grade?: GradeLevel) => {
    if (role === 'guru') {
      const g = users.find(u => u.role === 'guru');
      if (g) loginAsUser(g);
    } else {
      const s = users.find(u => u.role === 'siswa' && (grade ? u.gradeLevel === grade : true));
      if (s) loginAsUser(s);
    }
  };

  const updateCurrentUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
  };

  // CRUD implementations
  const updateSchoolProfile = (profile: Partial<SchoolProfile>) => {
    setSchoolProfile(prev => ({ ...prev, ...profile }));
  };

  // Guru CRUD
  const addGuru = (item: Omit<GuruItem, 'id' | 'no'>) => {
    const newItem: GuruItem = {
      ...item,
      id: `guru-${Date.now()}`,
      no: guruList.length + 1,
    };
    setGuruList(prev => [...prev, newItem]);
  };
  const updateGuru = (item: GuruItem) => {
    setGuruList(prev => prev.map(g => (g.id === item.id ? item : g)));
  };
  const deleteGuru = (id: string) => {
    setGuruList(prev => prev.filter(g => g.id !== id).map((g, idx) => ({ ...g, no: idx + 1 })));
  };
  const importGuruBulk = (items: Omit<GuruItem, 'id' | 'no'>[]) => {
    const formatted: GuruItem[] = items.map((it, idx) => ({
      ...it,
      id: `guru-imp-${Date.now()}-${idx}`,
      no: guruList.length + idx + 1,
    }));
    setGuruList(prev => [...prev, ...formatted]);
  };

  // Kelas CRUD
  const addKelas = (item: Omit<KelasItem, 'id' | 'no'>) => {
    const newItem: KelasItem = {
      ...item,
      id: `k-${Date.now()}`,
      no: kelasList.length + 1,
    };
    setKelasList(prev => [...prev, newItem]);
  };
  const updateKelas = (item: KelasItem) => {
    setKelasList(prev => prev.map(k => (k.id === item.id ? item : k)));
  };
  const deleteKelas = (id: string) => {
    setKelasList(prev => prev.filter(k => k.id !== id).map((k, idx) => ({ ...k, no: idx + 1 })));
  };
  const importKelasBulk = (items: Omit<KelasItem, 'id' | 'no'>[]) => {
    const formatted: KelasItem[] = items.map((it, idx) => ({
      ...it,
      id: `k-imp-${Date.now()}-${idx}`,
      no: kelasList.length + idx + 1,
    }));
    setKelasList(prev => [...prev, ...formatted]);
  };

  // Siswa CRUD
  const addSiswa = (item: Omit<SiswaItem, 'id' | 'no'>) => {
    const newItem: SiswaItem = {
      ...item,
      id: `s-${Date.now()}`,
      no: siswaList.length + 1,
    };
    setSiswaList(prev => [...prev, newItem]);
  };
  const updateSiswa = (item: SiswaItem) => {
    setSiswaList(prev => prev.map(s => (s.id === item.id ? item : s)));
  };
  const deleteSiswa = (id: string) => {
    setSiswaList(prev => prev.filter(s => s.id !== id).map((s, idx) => ({ ...s, no: idx + 1 })));
  };
  const importSiswaBulk = (items: Omit<SiswaItem, 'id' | 'no'>[]) => {
    const formatted: SiswaItem[] = items.map((it, idx) => ({
      ...it,
      id: `s-imp-${Date.now()}-${idx}`,
      no: siswaList.length + idx + 1,
    }));
    setSiswaList(prev => [...prev, ...formatted]);
  };

  // Perangkat Ajar CRUD
  const addPerangkatAjar = (item: Omit<PerangkatAjarItem, 'id'>) => {
    const newItem: PerangkatAjarItem = {
      ...item,
      id: `pa-${Date.now()}`,
    };
    setPerangkatAjarList(prev => [newItem, ...prev]);
  };
  const updatePerangkatAjar = (item: PerangkatAjarItem) => {
    setPerangkatAjarList(prev => prev.map(p => (p.id === item.id ? item : p)));
  };
  const deletePerangkatAjar = (id: string) => {
    setPerangkatAjarList(prev => prev.filter(p => p.id !== id));
  };

  // Bahan Ajar AI CRUD & Kirim ke Siswa
  const addBahanAjar = (item: Omit<BahanAjarItem, 'id'>) => {
    const newItem: BahanAjarItem = {
      ...item,
      id: `ba-${Date.now()}`,
    };
    setBahanAjarList(prev => [newItem, ...prev]);
  };
  const updateBahanAjar = (item: BahanAjarItem) => {
    setBahanAjarList(prev => prev.map(b => (b.id === item.id ? item : b)));
  };
  const deleteBahanAjar = (id: string) => {
    setBahanAjarList(prev => prev.filter(b => b.id !== id));
  };
  const toggleKirimKeSiswa = (id: string) => {
    setBahanAjarList(prev =>
      prev.map(b => {
        if (b.id === id) {
          const nextState = !b.isSentToStudents;
          return {
            ...b,
            isSentToStudents: nextState,
            sentAt: nextState ? new Date().toLocaleString('id-ID') : undefined,
          };
        }
        return b;
      })
    );
  };

  // Jurnal Guru CRUD
  const addJurnalGuru = (item: Omit<JurnalGuruItem, 'id'>) => {
    const newItem: JurnalGuruItem = {
      ...item,
      id: `jg-${Date.now()}`,
    };
    setJurnalGuruList(prev => [newItem, ...prev]);
  };
  const updateJurnalGuru = (item: JurnalGuruItem) => {
    setJurnalGuruList(prev => prev.map(j => (j.id === item.id ? item : j)));
  };
  const deleteJurnalGuru = (id: string) => {
    setJurnalGuruList(prev => prev.filter(j => j.id !== id));
  };

  // Jurnal Sikap CRUD
  const addJurnalSikap = (item: Omit<JurnalSikapItem, 'id'>) => {
    const newItem: JurnalSikapItem = {
      ...item,
      id: `js-${Date.now()}`,
    };
    setJurnalSikapList(prev => [newItem, ...prev]);
  };
  const updateJurnalSikap = (item: JurnalSikapItem) => {
    setJurnalSikapList(prev => prev.map(j => (j.id === item.id ? item : j)));
  };
  const deleteJurnalSikap = (id: string) => {
    setJurnalSikapList(prev => prev.filter(j => j.id !== id));
  };

  // Absen Siswa CRUD
  const addAbsenSiswa = (item: Omit<AbsenSiswaItem, 'id' | 'no'>) => {
    const newItem: AbsenSiswaItem = {
      ...item,
      id: `ab-${Date.now()}`,
      no: absenSiswaList.length + 1,
    };
    setAbsenSiswaList(prev => [...prev, newItem]);
  };
  const updateAbsenSiswa = (item: AbsenSiswaItem) => {
    setAbsenSiswaList(prev => prev.map(a => (a.id === item.id ? item : a)));
  };
  const deleteAbsenSiswa = (id: string) => {
    setAbsenSiswaList(prev => prev.filter(a => a.id !== id));
  };

  // Guru Wali CRUD
  const addGuruWali = (item: Omit<GuruWaliItem, 'id'>) => {
    const newItem: GuruWaliItem = {
      ...item,
      id: `gw-${Date.now()}`,
    };
    setGuruWaliList(prev => [newItem, ...prev]);
  };
  const updateGuruWali = (item: GuruWaliItem) => {
    setGuruWaliList(prev => prev.map(g => (g.id === item.id ? item : g)));
  };
  const deleteGuruWali = (id: string) => {
    setGuruWaliList(prev => prev.filter(g => g.id !== id));
  };

  // Rekap Nilai CRUD
  const addRekapNilai = (item: Omit<RekapNilaiItem, 'id' | 'no'>) => {
    const newItem: RekapNilaiItem = {
      ...item,
      id: `rn-${Date.now()}`,
      no: rekapNilaiList.length + 1,
    };
    setRekapNilaiList(prev => [...prev, newItem]);
  };
  const updateRekapNilai = (item: RekapNilaiItem) => {
    setRekapNilaiList(prev => prev.map(r => (r.id === item.id ? item : r)));
  };
  const deleteRekapNilai = (id: string) => {
    setRekapNilaiList(prev => prev.filter(r => r.id !== id));
  };

  // Pengumuman CRUD
  const addPengumuman = (item: Omit<PengumumanItem, 'id'>) => {
    const newItem: PengumumanItem = {
      ...item,
      id: `pg-${Date.now()}`,
    };
    setPengumumanList(prev => [newItem, ...prev]);
  };
  const deletePengumuman = (id: string) => {
    setPengumumanList(prev => prev.filter(p => p.id !== id));
  };

  // Chat Actions & Badge State
  const unreadMessagesCount = currentUser
    ? chatMessages.filter(m => m.recipientId === currentUser.id && !m.isRead).length
    : 0;

  const sendMessage = (recipientId: string, recipientName: string, message: string) => {
    if (!currentUser) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      recipientId,
      recipientName,
      message,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const markMessageAsRead = (messageId: string) => {
    setChatMessages(prev =>
      prev.map(m => (m.id === messageId ? { ...m, isRead: true } : m))
    );
  };

  const markConversationAsRead = (partnerId: string) => {
    if (!currentUser) return;
    setChatMessages(prev => {
      const hasUnread = prev.some(
        m => m.senderId === partnerId && m.recipientId === currentUser.id && !m.isRead
      );
      if (!hasUnread) return prev;
      return prev.map(m =>
        m.senderId === partnerId && m.recipientId === currentUser.id && !m.isRead
          ? { ...m, isRead: true }
          : m
      );
    });
  };

  const markAllMessagesAsRead = () => {
    if (!currentUser) return;
    setChatMessages(prev => {
      const hasUnread = prev.some(m => m.recipientId === currentUser.id && !m.isRead);
      if (!hasUnread) return prev;
      return prev.map(m =>
        m.recipientId === currentUser.id && !m.isRead ? { ...m, isRead: true } : m
      );
    });
  };

  const simulateIncomingMessage = (senderRole?: UserRole) => {
    if (!currentUser) return;
    if (currentUser.role === 'guru') {
      const student = users.find(u => u.role === 'siswa') || {
        id: 'user-siswa-8b',
        name: 'Siti Nurhaliza Azzahra',
        role: 'siswa' as UserRole,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      const samples = [
        'Assalamu\'alaikum Pak Guru, mohon penjelasan untuk soal nomor 12 tentang hukum mim sukun.',
        'Pak Ustadz, apakah tugas resume kisah Nabi Muhammad SAW dikumpulkan besok pagi?',
        'Izin bertanya Pak Guru, apakah ada jadwal remedial PAI untuk kelas 8 pekan ini?',
      ];
      const randomText = samples[Math.floor(Math.random() * samples.length)];
      const newMsg: ChatMessage = {
        id: `sim-${Date.now()}`,
        senderId: student.id,
        senderName: student.name,
        senderRole: 'siswa',
        senderAvatar: student.avatar,
        recipientId: currentUser.id,
        recipientName: currentUser.name,
        message: randomText,
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      setChatMessages(prev => [...prev, newMsg]);
    } else {
      const guru = users.find(u => u.role === 'guru') || {
        id: 'user-guru-1',
        name: TARGET_NEW_GURU_NAME,
        role: 'guru' as UserRole,
        avatar: TARGET_NEW_GURU_PHOTO,
      };
      const samples = [
        'Wa\'alaikumsalam. Latihan mandiri kamu sangat baik nilainya, istiqamah ya!',
        'Untuk materi tajwid surah Al-Hujurat ayat 13, perhatikan bacaan Mad Wajib Muttasil.',
        'Tugas hafalan Juz 30 sudah bapak catat, nilai 95.',
      ];
      const randomText = samples[Math.floor(Math.random() * samples.length)];
      const newMsg: ChatMessage = {
        id: `sim-${Date.now()}`,
        senderId: guru.id,
        senderName: guru.name,
        senderRole: 'guru',
        senderAvatar: guru.avatar,
        recipientId: currentUser.id,
        recipientName: currentUser.name,
        message: randomText,
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      setChatMessages(prev => [...prev, newMsg]);
    }
  };

  const resetAllData = () => {
    localStorage.clear();
    setSchoolProfile(INITIAL_SCHOOL_PROFILE);
    setGuruList(INITIAL_GURU_LIST);
    setKelasList(INITIAL_KELAS_LIST);
    setSiswaList(INITIAL_SISWA_LIST);
    setPerangkatAjarList(INITIAL_PERANGKAT_AJAR);
    setBahanAjarList(INITIAL_BAHAN_AJAR);
    setJurnalGuruList(INITIAL_JURNAL_GURU);
    setJurnalSikapList(INITIAL_JURNAL_SIKAP);
    setAbsenSiswaList(INITIAL_ABSEN_SISWA);
    setGuruWaliList(INITIAL_GURU_WALI);
    setRekapNilaiList(INITIAL_REKAP_NILAI);
    setPengumumanList(INITIAL_PENGUMUMAN);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setUsers(INITIAL_USERS_AUTH);
    setCurrentUser(INITIAL_USERS_AUTH[0]);
  };

  return (
    <LmsContext.Provider
      value={{
        currentUser,
        users,
        schoolProfile,
        guruList,
        kelasList,
        siswaList,
        perangkatAjarList,
        bahanAjarList,
        jurnalGuruList,
        jurnalSikapList,
        absenSiswaList,
        guruWaliList,
        rekapNilaiList,
        pengumumanList,

        activeGuruMenu,
        setActiveGuruMenu,
        activeGuruSubMenu,
        setActiveGuruSubMenu,

        activeSiswaMenu,
        setActiveSiswaMenu,

        selectedSemester,
        setSelectedSemester,
        selectedGrade,
        setSelectedGrade,

        login,
        loginAsUser,
        logout,
        quickSwitchUser,
        updateCurrentUserProfile,

        updateSchoolProfile,
        addGuru,
        updateGuru,
        deleteGuru,
        importGuruBulk,

        addKelas,
        updateKelas,
        deleteKelas,
        importKelasBulk,

        addSiswa,
        updateSiswa,
        deleteSiswa,
        importSiswaBulk,

        addPerangkatAjar,
        updatePerangkatAjar,
        deletePerangkatAjar,

        addBahanAjar,
        updateBahanAjar,
        deleteBahanAjar,
        toggleKirimKeSiswa,

        addJurnalGuru,
        updateJurnalGuru,
        deleteJurnalGuru,

        addJurnalSikap,
        updateJurnalSikap,
        deleteJurnalSikap,

        addAbsenSiswa,
        updateAbsenSiswa,
        deleteAbsenSiswa,

        addGuruWali,
        updateGuruWali,
        deleteGuruWali,

        addRekapNilai,
        updateRekapNilai,
        deleteRekapNilai,

        addPengumuman,
        deletePengumuman,

        chatMessages,
        unreadMessagesCount,
        sendMessage,
        markMessageAsRead,
        markConversationAsRead,
        markAllMessagesAsRead,
        simulateIncomingMessage,

        resetAllData,

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </LmsContext.Provider>
  );
};

export const useLms = () => {
  const context = useContext(LmsContext);
  if (!context) {
    throw new Error('useLms must be used within an LmsProvider');
  }
  return context;
};
