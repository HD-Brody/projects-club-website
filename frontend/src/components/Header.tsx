import React from "react";
import { authUtils } from "../utils/api";

interface HeaderProps {
  onNavigate?: (route: string) => void;
}

function Header({ onNavigate }: HeaderProps) {
  const isAuthenticated = authUtils.isAuthenticated();

  const handleLogout = () => {
    authUtils.removeToken();
    window.location.hash = "#";
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/80 bg-white/90 border-b border-slate-200 shadow-[0_1px_12px_rgba(15,23,42,0.06)] will-change-transform">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-11 w-11 rounded-2xl bg-slate-900 text-white grid place-items-center font-bold text-base tracking-tight shadow-sm"
            aria-label="Projects Club logo"
          >
            PC
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-slate-900">UofT Projects Club</p>
            <p className="text-xs text-slate-500">Bridge business × tech</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <div className="flex items-center gap-5 pr-5 border-r border-slate-200">
            <a href="#about" className="transition hover:text-slate-900">About</a>
            <a href="#events" className="transition hover:text-slate-900">Events</a>
            <a href="#gallery" className="transition hover:text-slate-900">Photos</a>
            <a href="#sponsors" className="transition hover:text-slate-900">Sponsors</a>
            <a href="#/projects" className="transition hover:text-slate-900">Projects</a>
          </div>

          <div className="flex items-center gap-3 pl-1">
            {isAuthenticated && (
              <>
                <a
                  href="#/applications"
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                >
                  My Applications
                </a>
                <a
                  href="#/manage-projects"
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                >
                  Manage Projects
                </a>
                <a
                  href="#/submit-project"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
                >
                  + Create Project
                </a>
              </>
            )}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition"
              >
                Logout
              </button>
            ) : (
              <a
                href="#/login"
                className="px-4 py-2 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition"
              >
                Login/Signup
              </a>
            )}

            <a
              href="#join"
              className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:opacity-90 transition shadow-sm"
            >
              Join us
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default React.memo(Header);
