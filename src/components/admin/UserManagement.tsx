import React, { useState } from 'react';
import { useLms } from '../../context/LmsContext';
import { User, GradeLevel } from '../../types';
import {
  Users,
  Plus,
  Trash2,
  Edit,
  GraduationCap,
  BookOpen,
  Search,
  Check,
  X,
} from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, currentUser } = useLms();

  const [activeTab, setActiveTab] = useState<'siswa' | 'guru'>('siswa');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal form states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    identifier: '',
    gradeLevel: '7' as GradeLevel,
    className: '7A',
    subject: '',
    email: '',
  });

  const students = users.filter(u => u.role === 'siswa');
  const teachers = users.filter(u => u.role === 'guru');

  // Filter students
  const filteredStudents = students.filter(s => {
    if (selectedGrade !== 'all' && s.gradeLevel !== selectedGrade) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.identifier.toLowerCase().includes(q) ||
        (s.className && s.className.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filter teachers
  const filteredTeachers = teachers.filter(t => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.identifier.toLowerCase().includes(q) ||
        (t.subject && t.subject.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      username: '',
      identifier: '',
      gradeLevel: '7',
      className: '7A',
      subject: '',
      email: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      identifier: user.identifier,
      gradeLevel: user.gradeLevel || '7',
      className: user.className || `${user.gradeLevel || '7'}A`,
      subject: user.subject || '',
      email: user.email || '',
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = (user: User) => {
    if (user.id === currentUser?.id) {
      alert('Tidak dapat menghapus akun Anda sendiri yang sedang aktif.');
      return;
    }
    if (window.confirm(`Hapus pengguna ${user.name}?`)) {
      deleteUser(user.id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.identifier.trim()) {
      alert('Nama dan NISN/NIP wajib diisi.');
      return;
    }

    if (editingUser) {
      updateUser({
        ...editingUser,
        name: formData.name,
        username: formData.username || formData.identifier,
        identifier: formData.identifier,
        gradeLevel: activeTab === 'siswa' ? formData.gradeLevel : undefined,
        className: activeTab === 'siswa' ? formData.className : undefined,
        subject: activeTab === 'guru' ? formData.subject : undefined,
        email: formData.email,
      });
    } else {
      addUser({
        name: formData.name,
        username: formData.username || `user_${Date.now().toString().slice(-4)}`,
        identifier: formData.identifier,
        role: activeTab === 'siswa' ? 'siswa' : 'guru',
        gradeLevel: activeTab === 'siswa' ? formData.gradeLevel : undefined,
        className: activeTab === 'siswa' ? formData.className : undefined,
        subject: activeTab === 'guru' ? formData.subject : undefined,
        email: formData.email,
        avatar:
          activeTab === 'siswa'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('siswa')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'siswa'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Data Siswa (Kelas 7, 8, 9)</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'siswa' ? 'bg-rose-900 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {students.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guru')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'guru'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Data Guru & Pengampu</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'guru' ? 'bg-rose-900 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {teachers.length}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs self-end sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{activeTab === 'siswa' ? 'Tambah Siswa Baru' : 'Tambah Guru Baru'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[200px] flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'siswa'
                ? 'Cari nama siswa, NISN, atau kelas...'
                : 'Cari nama guru, NIP, mapel...'
            }
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {activeTab === 'siswa' && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            <span className="text-slate-500 px-2 font-medium">Filter:</span>
            {['all', '7', '8', '9'].map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedGrade(lvl)}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  selectedGrade === lvl
                    ? 'bg-white text-rose-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl === 'all' ? 'Semua' : `Kelas ${lvl}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table of Students */}
      {activeTab === 'siswa' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">NISN (10 Digit)</th>
                  <th className="py-3 px-4">Tingkat / Jenjang</th>
                  <th className="py-3 px-4">Kelas / Rombel</th>
                  <th className="py-3 px-4">Username Login</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            student.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                          }
                          alt=""
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <strong className="text-slate-900">{student.name}</strong>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 font-bold">
                      {student.identifier}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        Kelas {student.gradeLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {student.className || `${student.gradeLevel}A`}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {student.username}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(student)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Edit Siswa"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(student)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Hapus Siswa"
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
      )}

      {/* Table of Teachers */}
      {activeTab === 'guru' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Nama Guru</th>
                  <th className="py-3 px-4">NIP</th>
                  <th className="py-3 px-4">Mata Pelajaran yang Diampu</th>
                  <th className="py-3 px-4">Email Dinas</th>
                  <th className="py-3 px-4">Username Login</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map(teacher => (
                  <tr key={teacher.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            teacher.avatar ||
                            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
                          }
                          alt=""
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <strong className="text-slate-900">{teacher.name}</strong>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 font-bold">
                      {teacher.identifier}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {teacher.subject || 'Guru Pengampu'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{teacher.email || '-'}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{teacher.username}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(teacher)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Edit Guru"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(teacher)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Hapus Guru"
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
      )}

      {/* Add / Edit User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-sm text-slate-900">
                {editingUser
                  ? `Edit Data ${activeTab === 'siswa' ? 'Siswa' : 'Guru'}`
                  : `Tambah ${activeTab === 'siswa' ? 'Siswa Baru' : 'Guru Baru'}`}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Contoh: Muhammad Ilham"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {activeTab === 'siswa' ? 'NISN (10 Digit)' : 'NIP (18 Digit)'}
                </label>
                <input
                  type="text"
                  value={formData.identifier}
                  onChange={e => setFormData(prev => ({ ...prev, identifier: e.target.value }))}
                  placeholder={activeTab === 'siswa' ? '0081234567' : '198205142008012015'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Username Login</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Contoh: siswa7_ilham"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {activeTab === 'siswa' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Jenjang Kelas</label>
                    <select
                      value={formData.gradeLevel}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          gradeLevel: e.target.value as GradeLevel,
                        }))
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold"
                    >
                      <option value="7">Kelas 7</option>
                      <option value="8">Kelas 8</option>
                      <option value="9">Kelas 9</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Rombel / Kelas</label>
                    <input
                      type="text"
                      value={formData.className}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, className: e.target.value }))
                      }
                      placeholder="Contoh: 7A, 7B"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'guru' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Contoh: Ilmu Pengetahuan Alam (IPA)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email (Opsional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="nama@smpn2rebangtangkas.sch.id"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 transition"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
