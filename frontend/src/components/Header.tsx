import React, { useEffect, useRef, useState } from "react";
import { authUtils } from "../utils/api";

interface HeaderProps {
  onNavigate?: (route: string) => void;
}

function getProfileInitial(): string {
  try {
    const cached = localStorage.getItem("profile_cache");
    if (cached) {
      const profile = JSON.parse(cached);
      const name = profile.full_name || "";
      const initials = name
        .split(" ")
        .filter(Boolean)
        .map((part: string) => part[0]?.toUpperCase())
        .join("")
        .slice(0, 2);
      return initials || "U";
    }
  } catch {}
  return "U";
}

function Header({ onNavigate }: HeaderProps) {
  const isAuthenticated = authUtils.isAuthenticated();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    authUtils.removeToken();
    window.location.hash = "#";
    window.location.reload();
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/85 bg-white/95 border-b border-slate-200 will-change-transform">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/UTPC_logo.png"
            alt="Projects Club logo"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="leading-tight">
            <p className="font-semibold text-slate-900">UofT Projects Club</p>
            <p className="text-xs text-slate-500">Bridge business × tech</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center justify-between gap-6 text-sm text-slate-600">
          <div className="flex items-center gap-5 pr-5 text-slate-600/85 border-r border-slate-200">
            <a href="#about" className="transition hover:text-slate-900">About</a>
            <a href="#events" className="transition hover:text-slate-900">Events</a>
            <a href="#gallery" className="transition hover:text-slate-900">Photos</a>
            <a href="#sponsors" className="transition hover:text-slate-900">Sponsors</a>
            <a href="#/projects" className="transition hover:text-slate-900">Projects</a>
            <a href="#/htf" className="transition hover:text-slate-900">HTF</a>
          </div>

          <div className="flex items-center gap-3.5 pl-5">
            {!isAuthenticated && (
              <a
                href="#/login"
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 shadow-sm hover:-translate-y-px hover:shadow transition"
              >
                Login/Signup
              </a>
            )}

            {isAuthenticated ? (
              <a
                href="#/submit-project"
                className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:opacity-90 transition shadow-sm"
              >
                + Create Project
              </a>
            ) : (
              <a
                href="#join"
                className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:opacity-90 transition shadow-sm"
              >
                Join us
              </a>
            )}

            {isAuthenticated && (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-600 to-indigo-600 text-white grid place-items-center text-sm font-semibold shadow-[0_6px_16px_rgba(59,130,246,0.2)] hover:ring-2 hover:ring-sky-200 hover:ring-offset-1 transition"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  title="Account"
                >
                  {getProfileInitial()}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)] py-2 text-sm">
                    <a
                      href="#/profile"
                      className="block px-3 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      Profile
                    </a>
                    <a
                      href="#/applications"
                      className="block px-3 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      My Applications
                    </a>
                    <a
                      href="#/manage-projects"
                      className="block px-3 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      Manage Projects
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default React.memo(Header);
