import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/StateContext';
import { ChatMessage, CollabRequest } from '../types';
import { Send, Image, File, Check, Paperclip, MoreVertical, ThumbsUp, MapPin, Calendar, CheckSquare, X } from 'lucide-react';

interface ChatSystemProps {
  requestId: string;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({ requestId }) => {
  const { messages, sendMessage, requests, activeUser, updateRequestStatus, activeRole } = useApp();
  const [inputText, setInputText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Filter messages for current request
  const currentMessages = messages.filter(m => m.requestId === requestId);
  const requestInfo = requests.find(r => r.id === requestId);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  if (!requestInfo) {
    return (
      <div className="py-20 text-center text-brand-muted text-xs">
        No active collaboration loaded in messenger.
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    sendMessage(requestId, inputText);
    setInputText('');
  };

  // Simulate picking visual attachments
  const simulateAttachment = (type: 'image' | 'video' | 'raw') => {
    setShowAttachMenu(false);
    if (type === 'image') {
      sendMessage(requestId, 'Attached Paris Shooting Spot Preview', {
        name: 'eiffel_sunrise_spot.jpg',
        url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=600',
        type: 'image/jpeg'
      });
    } else if (type === 'video') {
      sendMessage(requestId, 'Look at this amazing raw B-roll drone layout', {
        name: 'louvre_pyramids_4k.mp4',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-walking-under-eiffel-tower-in-paris-4531-large.mp4',
        type: 'video/mp4'
      });
    } else {
      sendMessage(requestId, 'Sent the final high-res Adobe Lightroom parameters preset', {
        name: 'paris_warm_editorial.xmp',
        url: '#preset',
        type: 'application/octet-stream'
      });
    }
  };

  return (
    <div className="bg-white border border-brand-border/60 rounded-3xl overflow-hidden flex flex-col h-[525px] sm:h-[600px] shadow-xs text-left">
      
      {/* 1. MESSENGER HEADER INFORMATION */}
      <div className="bg-brand-bg-soft/75 border-b border-brand-border/60 p-4 shrink-0 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src={activeUser.id === requestInfo.creatorId ? requestInfo.professionalPhoto : requestInfo.creatorPhoto} 
            alt="Interacting User" 
            className="w-10 h-10 rounded-xl object-cover border"
          />
          <div className="text-left">
            <h4 className="font-display font-extrabold text-xs text-brand-text leading-tight uppercase font-mono">
              COLLAB WITH {activeUser.id === requestInfo.creatorId ? requestInfo.professionalName : requestInfo.creatorName}
            </h4>
            <span className="text-[11px] text-brand-muted font-sans font-medium hover:underline">
              {requestInfo.title}
            </span>
          </div>
        </div>

        {/* Short details badge */}
        <div className="text-right flex items-center gap-1.5 bg-white border px-2.5 py-1 rounded-full text-[10px] font-mono">
          <MapPin className="w-3 h-3 text-brand-primary" />
          <span>{requestInfo.city}</span>
          <span className="text-slate-300">•</span>
          <span>Budget: <strong>${requestInfo.budget}</strong></span>
        </div>
      </div>

      {/* 2. CHAT SCROLL STREAM CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40">
        
        {/* System seed message greeting */}
        <div className="text-center py-2 shrink-0">
          <span className="bg-white border rounded-full px-3 py-1 text-[10px] text-brand-muted tracking-wider uppercase font-mono shadow-xs block max-w-sm mx-auto">
            🛡️ SECURE COOPERATION CHAT ROOM CREATED
          </span>
        </div>

        {currentMessages.map((msg) => {
          const isSender = msg.senderId === activeUser.id;
          return (
            <div 
              key={msg.id} 
              className={`flex flex-col max-w-[85%] ${isSender ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
              {/* Sender Tag */}
              <span className="text-[10px] font-bold text-brand-muted uppercase font-mono tracking-tight mb-1 scale-90">
                {isSender ? 'You' : msg.senderName}
              </span>

              {/* Box text detail */}
              <div className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                isSender 
                  ? 'bg-brand-primary text-white rounded-tr-none shadow-sm' 
                  : 'bg-white text-brand-text rounded-tl-none border border-brand-border/60 shadow-xs'
              }`}>
                {msg.text}

                {/* Sub Visual attachments panels if exist */}
                {msg.image && (
                  <div className="mt-2.5 rounded-xl overflow-hidden border border-black/10">
                    <img src={msg.image} alt="Preview Attachment" className="max-w-xs w-full h-auto object-cover max-h-40" />
                  </div>
                )}

                {msg.fileUrl && !msg.image && (
                  <div className={`mt-2 p-2 rounded-xl border flex items-center gap-2 ${
                    isSender ? 'bg-white/10 border-white/20 text-white' : 'bg-brand-bg-cream border-brand-border text-brand-text'
                  }`}>
                    <File className="w-4 h-4 shrink-0" />
                    <div className="text-left">
                      <span className="block font-bold text-[10px] font-mono break-all line-clamp-1">{msg.fileName}</span>
                      <span className="text-[9px] uppercase font-mono opacity-80 shrink-0">Double click mock download</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Short timestamp marker check */}
              <span className="text-[9px] text-brand-muted mt-1 font-mono">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}

        {/* Scroll anchor */}
        <div ref={bottomRef}></div>
      </div>

      {/* 3. ATTACHMENT ACTION MENU DIALOGUE */}
      {showAttachMenu && (
        <div className="border-t border-brand-border/60 bg-white p-3 flex gap-2 justify-center items-center shrink-0">
          <button 
            onClick={() => simulateAttachment('image')}
            className="flex items-center gap-1.5 border border-brand-border/80 hover:bg-brand-bg-cream py-1 px-3 text-xs font-bold rounded-lg cursor-pointer text-brand-text transition"
          >
            <Image className="w-3.5 h-3.5 text-brand-success" /> Select Mock Asset Photo
          </button>
          <button 
            onClick={() => simulateAttachment('video')}
            className="flex items-center gap-1.5 border border-brand-border/80 hover:bg-brand-bg-cream py-1 px-3 text-xs font-bold rounded-lg cursor-pointer text-brand-text transition"
          >
            <File className="w-3.5 h-3.5 text-brand-accent animate-pulse" /> Mock 4K B-Roll Clip
          </button>
          <button 
            onClick={() => simulateAttachment('raw')}
            className="flex items-center gap-1.5 border border-brand-border/80 hover:bg-brand-bg-cream py-1 px-3 text-xs font-bold rounded-lg cursor-pointer text-brand-text transition"
          >
            <Paperclip className="w-3.5 h-3.5 text-brand-secondary" /> Preset Parameters .xmp
          </button>
        </div>
      )}

      {/* 4. CHAT FORM CONTROLS PANEL */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-brand-border/50 flex gap-2 shrink-0">
        <button 
          type="button"
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-center ${
            showAttachMenu 
              ? 'bg-brand-text border-brand-text text-white' 
              : 'border-brand-border/80 hover:bg-brand-bg-soft text-brand-muted hover:text-brand-text'
          }`}
        >
          <Paperclip className="w-4 h-4 shrink-0" />
        </button>

        <input 
          type="text"
          placeholder="Type project discussion message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-brand-bg-cream/40 px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-brand-border/85 focus:border-brand-primary outline-hidden"
        />

        <button 
          type="submit"
          className="bg-brand-primary hover:bg-brand-primary/95 text-white p-2.5 rounded-xl transition shadow-xs flex items-center justify-center cursor-pointer"
        >
          <Send className="w-4.5 h-4.5 shrink-0" />
        </button>
      </form>
    </div>
  );
};
