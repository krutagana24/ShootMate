import React from 'react';
import { useApp } from '../context/StateContext';
import { Share2, MessageSquare, Play, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-white border-t border-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto text-center space-y-6">
        
        {/* Logo & Info Description */}
        <div className="flex flex-col items-center space-y-4">
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer justify-center"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white pointer-events-none shadow-md shadow-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </div>
            <span className="font-sans font-black text-2xl tracking-tight text-[#0f172a]">
              Shoot<span className="text-blue-600">Mate</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-normal max-w-sm">
            Helping content creators discover local creative professionals anywhere in the world. Travel light, shoot great.
          </p>

          {/* Social icons */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <a href="#share" className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 flex items-center justify-center transition-colors">
              <Share2 className="w-4 h-4" />
            </a>
            <a href="#chat" className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 flex items-center justify-center transition-colors">
              <MessageSquare className="w-4 h-4" />
            </a>
            <a href="#play" className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 flex items-center justify-center transition-colors">
              <Play className="w-4 h-4" />
            </a>
            <a href="#mail" className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 flex items-center justify-center transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 text-[11px] text-slate-400 font-normal">
          &copy; {new Date().getFullYear()} ShootMate. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
