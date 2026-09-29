import React, { useState } from 'react';
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
} from 'lucide-react';

export const PesanView: React.FC = () => {
  const { currentUser, users, chatMessages, sendMessage, markMessageAsRead } = useLms();

  const [activePartnerId, setActivePartnerId] = useState<string>(() => {
    if (currentUser?.role === 'siswa') {
      // Find guru
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

  if (!currentUser) return null;

  // Filter partners
  const partners = users.filter(u => {
    if (u.id === currentUser.id) return false;
    if (currentUser.role === 'siswa' && u.role !== 'guru') return false;
    if (searchUser.trim()) {
      return u.name.toLowerCase().includes(searchUser.toLowerCase());
    }
    return true;
  });

  const activePartner = users.find(u => u.id === activePartnerId) || partners[0];

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

  const quickQuestions = [
    'Assalamu\'alaikum Pak Guru, mohon izin bertanya terkait materi Tajwid untuk ujian PAS.',
    'Bapak/Ibu, apakah nilai remedial PAI sudah bisa dikerjakan kembali?',
    'Bagaimana cara membedakan Sujud Sahwi dan Sujud Tilawah dalam salat berjamaah?',
    'Terima kasih banyak atas bimbingan materi PAI hari ini Pak Ustadz.',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>KONSULTASI & TANYA JAWAB PAI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Pesan & Konsultasi Belajar
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Saluran komunikasi resmi antara Guru Pengampu PAI dan Siswa untuk konsultasi materi, persiapan CBT, serta pembimbingan akhlak.
          </p>
        </div>
      </div>

      {/* Main Chat Interface Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[580px]">
        {/* Left Column: Contact List */}
        <div className="md:col-span-4 border-r border-slate-200 bg-slate-50/70 flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
              {currentUser.role === 'siswa' ? 'Guru Pembimbing PAI' : 'Daftar Siswa & Percakapan'}
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari kontak..."
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {partners.map(p => {
              const isSelected = activePartner?.id === p.id;
              const lastMsg = chatMessages
                .filter(m => (m.senderId === p.id && m.recipientId === currentUser.id) || (m.senderId === currentUser.id && m.recipientId === p.id))
                .slice(-1)[0];

              return (
                <button
                  key={p.id}
                  type="button"
                  id={`chat-contact-${p.id}`}
                  onClick={() => setActivePartnerId(p.id)}
                  className={`w-full text-left p-3.5 transition flex items-start gap-3 ${
                    isSelected ? 'bg-emerald-50/80 border-l-4 border-emerald-600' : 'hover:bg-slate-100'
                  }`}
                >
                  <img
                    src={p.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 shrink-0 mt-0.5"
                  />
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-slate-900 truncate">{p.name}</p>
                      <span className="text-[10px] text-slate-400">
                        {p.role === 'guru' ? 'Guru' : `Kls ${p.gradeLevel || '7'}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {lastMsg ? lastMsg.message : p.subject || `Siswa ${p.className || '7A'}`}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat Stream */}
        <div className="md:col-span-8 flex flex-col h-[580px]">
          {/* Active Chat Header */}
          {activePartner ? (
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white shadow-2xs">
              <div className="flex items-center gap-3">
                <img
                  src={activePartner.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                  alt={activePartner.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{activePartner.name}</h4>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    {activePartner.role === 'guru'
                      ? 'Guru Pengampu PAI & BP'
                      : `Siswa Kelas ${activePartner.gradeLevel} (${activePartner.className || '7A'})`}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Aktif Terhubung</span>
              </span>
            </div>
          ) : (
            <div className="p-4 border-b border-slate-200 text-xs text-slate-500">Pilih kontak untuk berkirim pesan.</div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-slate-50/50">
            {conversation.map(msg => {
              const isMine = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-2xs ${
                      isMine
                        ? 'bg-emerald-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {!isMine && (
                      <span className="block text-[10px] font-bold text-emerald-800 mb-0.5">
                        {msg.senderName}
                      </span>
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <span
                      className={`block text-[9px] mt-1 text-right ${
                        isMine ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {conversation.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <MessageSquare className="w-10 h-10 mb-2 text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">Belum ada riwayat pesan.</p>
                <p className="text-[11px] text-slate-400">Ketik pesan pertama Anda di bawah ini.</p>
              </div>
            )}
          </div>

          {/* Quick Suggestions for Siswa */}
          {currentUser.role === 'siswa' && (
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-slate-400 shrink-0 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Pesan Cepat:</span>
              </span>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNewMessageText(q)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-[10px] font-medium border border-slate-200 shrink-0 transition"
                >
                  {q.slice(0, 32)}...
                </button>
              ))}
            </div>
          )}

          {/* Message Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              id="input-chat-message"
              placeholder="Tulis pesan atau pertanyaan materi PAI di sini..."
              value={newMessageText}
              onChange={e => setNewMessageText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button
              type="submit"
              id="btn-send-message"
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-2xs flex items-center justify-center shrink-0"
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
