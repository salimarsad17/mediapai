import React, { useState, useEffect } from 'react';
import { useLms } from '../../context/LmsContext';
import {
  MessageSquare,
  Send,
  User,
  CheckCircle,
  Clock,
  Sparkles,
  BookOpen,
  GraduationCap,
  HelpCircle,
  Search,
  CheckCheck,
  FileQuestion,
  Award,
  BellRing,
  Check,
} from 'lucide-react';

export const PesanView: React.FC = () => {
  const {
    currentUser,
    users,
    chatMessages,
    sendMessage,
    schoolProfile,
    unreadMessagesCount,
    markConversationAsRead,
    markAllMessagesAsRead,
    simulateIncomingMessage,
  } = useLms();

  const [activePartnerId, setActivePartnerId] = useState<string>(() => {
    if (currentUser?.role === 'siswa') {
      // Siswa defaults to first Guru
      const guru = users.find(u => u.role === 'guru');
      return guru ? guru.id : '';
    } else {
      // Guru views first student
      const student = users.find(u => u.role === 'siswa');
      return student ? student.id : '';
    }
  });

  const [newMessageText, setNewMessageText] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [topicTag, setTopicTag] = useState<'Seputar Soal Ujian' | 'Materi & Tajwid' | 'Remedial KKM' | 'Bimbingan Ibadah'>('Seputar Soal Ujian');

  if (!currentUser) return null;

  // Filter partners
  const partners = users.filter(u => {
    if (u.id === currentUser.id) return false;
    if (currentUser.role === 'siswa' && u.role !== 'guru') return false;
    if (searchUser.trim()) {
      return (
        u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
        (u.className && u.className.toLowerCase().includes(searchUser.toLowerCase()))
      );
    }
    return true;
  });

  const activePartner = users.find(u => u.id === activePartnerId) || partners[0];

  // Automatically mark active conversation as read when viewing
  useEffect(() => {
    if (activePartner && currentUser) {
      markConversationAsRead(activePartner.id);
    }
  }, [activePartnerId, activePartner?.id, currentUser?.id, chatMessages.length]);

  // Conversation between currentUser and activePartner
  const conversation = chatMessages.filter(m => {
    if (!activePartner) return false;
    const isDirect1 = m.senderId === currentUser.id && m.recipientId === activePartner.id;
    const isDirect2 = m.senderId === activePartner.id && m.recipientId === currentUser.id;
    return isDirect1 || isDirect2;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activePartner) return;

    sendMessage(activePartner.id, activePartner.name, newMessageText.trim());
    setNewMessageText('');
  };

  const quickQuestionsSiswa = [
    'Assalamu\'alaikum Pak Guru, mohon izin bertanya mengenai penjelasan soal ASTS PAI nomor 12 tentang hukum bacaan Mad.',
    'Bapak/Ibu Guru, apakah ada jadwal remedial PAI bagi siswa yang nilainya masih di bawah KKM 75?',
    'Bagaimana cara membedakan rukun wudhu yang wajib dan sunnah dalam soal ujian praktik?',
    'Pak Ustadz, apakah surat hafalan wajib Juz 30 disetorkan besok saat jam pelajaran pertama?',
  ];

  const quickRepliesGuru = [
    'Wa\'alaikumsalam warahmatullah. Pertanyaan yang sangat bagus, mari bapak jelaskan...',
    'Untuk jadwal remidial akan dilaksanakan hari Jumat setelah salat dhuha di musala sekolah.',
    'Bagus sekali inisiatif belajarmu. Pelajari kembali modul di menu Bahan Ajar ya.',
    'Alhamdulillah hafalanmu sudah lancar, tetap istiqamah muroja\'ah setiap hari.',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-blue-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold border border-blue-300/30 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
            <span>KONSULTASI & TANYA JAWAB PAI DIGITAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Pesan & Konsultasi Belajar
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl leading-relaxed">
            Saluran komunikasi resmi antara Guru Pengampu PAI dan Siswa {schoolProfile.name} untuk konsultasi dan tanya jawab seputar soal ujian, tugas, remedial KKM, materi, dan bimbingan ibadah.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-xs">
          <span className="text-[10px] text-blue-200 font-bold uppercase block">
            Status Layanan:
          </span>
          <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Tanya Jawab Aktif</span>
          </span>
        </div>
      </div>

      {/* Main Chat Interface Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[600px]">
        {/* Left Column: Contact List */}
        <div className="md:col-span-4 border-r border-slate-200 bg-slate-50/70 flex flex-col">
          <div className="p-3.5 border-b border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600">
                  {currentUser.role === 'siswa' ? 'Guru Pengampu PAI' : 'Daftar Siswa Konsultasi'}
                </h3>
                {unreadMessagesCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
                    {unreadMessagesCount} baru
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadMessagesCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllMessagesAsRead}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                    title="Tandai semua pesan telah dibaca"
                  >
                    <Check className="w-3 h-3" />
                    <span>Baca Semua</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => simulateIncomingMessage()}
                  className="text-[10px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                  title="Simulasi pesan baru untuk menguji notifikasi badge"
                >
                  <BellRing className="w-3 h-3 text-amber-600 animate-bounce" />
                  <span>Uji Notif</span>
                </button>
              </div>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={currentUser.role === 'siswa' ? 'Cari guru...' : 'Cari siswa / kelas...'}
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {partners.map(p => {
              const isSelected = activePartner?.id === p.id;
              const unreadFromPartner = chatMessages.filter(
                m => m.senderId === p.id && m.recipientId === currentUser.id && !m.isRead
              ).length;
              const lastMsg = chatMessages
                .filter(
                  m =>
                    (m.senderId === p.id && m.recipientId === currentUser.id) ||
                    (m.senderId === currentUser.id && m.recipientId === p.id)
                )
                .slice(-1)[0];

              return (
                <button
                  key={p.id}
                  type="button"
                  id={`chat-contact-${p.id}`}
                  onClick={() => {
                    setActivePartnerId(p.id);
                    markConversationAsRead(p.id);
                  }}
                  className={`w-full text-left p-3.5 transition flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/90 border-l-4 border-blue-600'
                      : unreadFromPartner > 0
                      ? 'bg-amber-50/40 hover:bg-amber-50/70 border-l-4 border-rose-500'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="relative shrink-0 mt-0.5">
                    <img
                      src={
                        p.avatar ||
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
                      }
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/20"
                    />
                    {unreadFromPartner > 0 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                    )}
                  </div>
                  <div className="overflow-hidden flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs truncate ${unreadFromPartner > 0 ? 'font-black text-slate-900' : 'font-bold text-slate-800'}`}>
                        {p.name}
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {unreadFromPartner > 0 && (
                          <span className="px-1.5 py-0.2 min-w-[18px] h-4.5 rounded-full text-[10px] font-black bg-rose-500 text-white flex items-center justify-center shadow-xs animate-pulse">
                            {unreadFromPartner}
                          </span>
                        )}
                        <span className="text-[10px] text-blue-700 font-bold">
                          {p.role === 'guru' ? 'Guru PAI' : `Kelas ${p.className || p.gradeLevel}`}
                        </span>
                      </div>
                    </div>
                    <p
                      className={`text-[11px] truncate mt-0.5 ${
                        unreadFromPartner > 0 ? 'font-semibold text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {lastMsg ? lastMsg.message : p.subject || `NISN: ${p.identifier}`}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat Stream & Message Input */}
        <div className="md:col-span-8 flex flex-col h-[600px] bg-white">
          {/* Active Chat Header */}
          {activePartner ? (
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white shadow-2xs">
              <div className="flex items-center gap-3">
                <img
                  src={
                    activePartner.avatar ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={activePartner.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/40"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">
                    {activePartner.name}
                  </h4>
                  <p className="text-[11px] text-blue-700 font-medium">
                    {activePartner.role === 'guru'
                      ? 'Guru Pengampu Pendidikan Agama Islam & BP'
                      : `Siswa Kelas ${activePartner.className || activePartner.gradeLevel} (NISN: ${activePartner.identifier})`}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Siap Konsultasi</span>
              </span>
            </div>
          ) : (
            <div className="p-4 border-b border-slate-200 text-xs text-slate-500">
              Pilih kontak untuk memulai tanya jawab.
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-slate-50/60">
            {conversation.map(msg => {
              const isMine = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs ${
                      isMine
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {!isMine && (
                      <span className="block text-[10px] font-bold text-blue-700 mb-0.5">
                        {msg.senderName}
                      </span>
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <span
                      className={`block text-[9px] mt-1 text-right flex items-center justify-end gap-1 ${
                        isMine ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isMine && <CheckCheck className="w-3 h-3 text-blue-200" />}
                    </span>
                  </div>
                </div>
              );
            })}

            {conversation.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-700">
                  Belum Ada Pesan dengan {activePartner?.name}
                </p>
                <p className="text-[11px] text-slate-400 max-w-sm mt-0.5">
                  Tuliskan pertanyaan seputar soal ujian CBT, remedial nilai, materi PAI, atau bimbingan ibadah di bawah.
                </p>
              </div>
            )}
          </div>

          {/* Quick Consultation Presets */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-slate-500 shrink-0 font-bold flex items-center gap-1 text-[10px]">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Contoh Tanya Jawab:</span>
            </span>
            {(currentUser.role === 'siswa' ? quickQuestionsSiswa : quickRepliesGuru).map(
              (q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNewMessageText(q)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 text-[10px] font-medium border border-slate-200 shrink-0 transition cursor-pointer"
                >
                  {q.slice(0, 36)}...
                </button>
              )
            )}
          </div>

          {/* Message Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              id="input-chat-message"
              placeholder="Tulis pesan atau tanya jawab seputar soal PAI di sini..."
              value={newMessageText}
              onChange={e => setNewMessageText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <button
              type="submit"
              id="btn-send-message"
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition shadow-md shadow-blue-500/20 flex items-center justify-center shrink-0 cursor-pointer"
              title="Kirim Pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
