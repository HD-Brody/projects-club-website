import React from "react";

interface HeaderProps {
  onNavigate?: (route: string) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/70 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center font-bold">PC</div>
          <div className="leading-tight">
            <p className="font-semibold">UofT Projects Club</p>
            <p className="text-xs text-slate-500">Bridge business × tech</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#about" className="hover:text-slate-900">About</a>
          <a href="#events" className="hover:text-slate-900">Events</a>
          <a href="#gallery" className="hover:text-slate-900">Photos</a>
          <a href="#sponsors" className="hover:text-slate-900">Sponsors</a>
          
          <a 
            href="#/login" 
            className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Login/Signup
          </a>
          
          <a href="#join" className="px-3 py-1.5 rounded-full bg-slate-900 text-white hover:opacity-90">Join us</a>
          
          {/* <a href="#/escape" aria-label="Open Escape Room registration" className="ml-3 inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-500 text-white font-semibold shadow-2xl hover:scale-105 transform transition-all animate-pulse">
            <span className="text-lg">🧩</span>
            <span>Register: Escape Room</span>
          </a> */}
        </nav>
      </div>
    </header>
  );
}
