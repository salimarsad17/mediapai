import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { UserManagement } from './UserManagement';
import { SchoolSettings } from './SchoolSettings';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  Settings,
  School,
  CheckCircle2,
  Clock,
  KeyRound,
  Eye,
  EyeOff,
  BarChart3,
  Award,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    exams,
    submissions,
    schoolConfig,
    togglePublishExam,
    deleteExam,
  } = useLms();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'settings'>('overview');

  const students = users.filter((u) => u.role === 'siswa');
  const teachers = users.filter((u) => u.role === 'guru');
  const students7 = students.filter((s) => s.gradeLevel === '7');
  const students8 = students.filter((s) => s.gradeLevel === '8');
  const students9 = students.filter((s) => s.gradeLevel === '9');
  const activeExams = exams.filter((e) => e.isPublished);

  // Average score school-wide
  const avgScore =
    submissions.length > 0
      ? Math.round(submissions.reduce((acc, curr) => acc + curr.score, 0) / submissions.length)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header Banner Admin */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              <ShieldCheck className="w-9 h-9 text-purple-300" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-xs font-semibold mb-1 border border-purple-400/30">
                <School className="w-3.5 h-3.5 text-purple-300" />
                Pusat Kendali Administrator CBT
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                {schoolConfig.name}
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/80 mt-0.5">
                NPSN: {schoolConfig.npsn} • Kepala Sekolah: {schoolConfig.principal} • T.A: {schoolConfig.academicYear} ({schoolConfig.currentSemester})
              </p>
            </div>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15 text-center">
              <p className="text-[10px] text-purple-200 font-medium">Siswa Kelas 7</p>
              <p className="text-base font-bold text-white">{students7.length} Siswa</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15 text-center">
              <p className="text-[10px] text-purple-200 font-medium">Siswa Kelas 8</p>
              <p className="text-base font-bold text-white">{students8.length} Siswa</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15 text-center">
              <p className="text-[10px] text-purple-200 font-medium">Siswa Kelas 9</p>
              <p className="text-base font-bold text-white">{students9.length} Siswa</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15 text-center">
              <p className="text-[10px] text-purple-200 font-medium">Ujian Aktif</p>
              <p className="text-base font-bold text-emerald-300">{activeExams.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Monitoring & Status Ujian</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'users'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kelola Data Pengguna (Siswa & Guru)</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'settings'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Konfigurasi Lembaga & Sekolah</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & CENTRAL EXAM MONITORING */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2 text-xs">
                <span>Total Siswa Terdaftar</span>
                <GraduationCap className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{students.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Kls 7: {students7.length} | Kls 8: {students8.length} | Kls 9: {students9.length}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2 text-xs">
                <span>Total Guru Pengampu</span>
                <BookOpen className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{teachers.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">Pengampu Mata Pelajaran SMPN</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2 text-xs">
                <span>Total Lembar Masuk</span>
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-black text-slate-900">{submissions.length}</p>
              <p className="text-[11px] text-slate-500 mt-1">Pengerjaan Siswa Tersimpan</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2 text-xs">
                <span>Rerata Nilai Sekolah</span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-slate-900">{avgScore} / 100</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Standar KKM Nasional</p>
            </div>
          </div>

          {/* Central Exams List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Monitoring Seluruh Ujian & Token Akses
                </h3>
                <p className="text-xs text-slate-500">
                  Aktivasi atau tutup sesi asesmen dan pantau token siswa
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-800 rounded-lg">
                {activeExams.length} Dari {exams.length} Ujian Terbuka
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-3 font-semibold">Mata Pelajaran & Judul</th>
                    <th className="pb-3 font-semibold">Tingkat</th>
                    <th className="pb-3 font-semibold">Sasaran Rombel</th>
                    <th className="pb-3 font-semibold">Durasi</th>
                    <th className="pb-3 font-semibold">KKM</th>
                    <th className="pb-3 font-semibold">Token Aktif</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Kontrol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {exams.map((ex) => {
                    const subCount = submissions.filter((s) => s.examId === ex.id).length;
                    return (
                      <tr key={ex.id} className="hover:bg-slate-50">
                        <td className="py-3.5 pr-3">
                          <p className="font-bold text-slate-900">{ex.title}</p>
                          <p className="text-[11px] text-slate-500">{ex.subject} • Guru: {ex.teacherName}</p>
                        </td>
                        <td className="py-3.5 pr-3">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                            Kelas {ex.gradeLevel}
                          </span>
                        </td>
                        <td className="py-3.5 pr-3 text-slate-600 font-medium">
                          {ex.targetClasses.join(', ')}
                        </td>
                        <td className="py-3.5 pr-3 text-slate-600 font-medium">
                          {ex.durationMinutes} Menit ({ex.questions.length} Butir)
                        </td>
                        <td className="py-3.5 pr-3 font-bold text-slate-800">
                          {ex.passingGrade}
                        </td>
                        <td className="py-3.5 pr-3">
                          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                            {ex.token}
                          </span>
                        </td>
                        <td className="py-3.5 pr-3">
                          {ex.isPublished ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Terbuka
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-200 px-2.5 py-0.5 rounded-full">
                              Tertutup
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => togglePublishExam(ex.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                ex.isPublished
                                  ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                            >
                              {ex.isPublished ? 'Tutup Sesi' : 'Aktivasi'}
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
      )}

      {/* TAB 2: USER MANAGEMENT (STUDENTS & TEACHERS) */}
      {activeTab === 'users' && <UserManagement />}

      {/* TAB 3: SCHOOL SETTINGS */}
      {activeTab === 'settings' && <SchoolSettings />}
    </div>
  );
};
