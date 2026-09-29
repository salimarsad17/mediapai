// Master and initial data re-exports for Media PAI
export * from './schoolData';
export * from './masterData';
export * from './haditsKisahData';
export * from './perangkatData';
export * from './chatData';

// Compatibility exports
import { INITIAL_SCHOOL_PROFILE, INITIAL_USERS_AUTH } from './schoolData';
export const INITIAL_SCHOOL_CONFIG = {
  governmentHeader: 'PEMERINTAH KABUPATEN WAY KANAN',
  departmentHeader: 'DINAS PENDIDIKAN',
  name: INITIAL_SCHOOL_PROFILE.name,
  npsn: INITIAL_SCHOOL_PROFILE.npsn,
  address: INITIAL_SCHOOL_PROFILE.alamat,
  principal: INITIAL_SCHOOL_PROFILE.kepalaSekolah,
  academicYear: '2024/2025',
  currentSemester: 'Ganjil' as const,
};

export const INITIAL_USERS = INITIAL_USERS_AUTH;
