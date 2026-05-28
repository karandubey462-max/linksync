import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Check, Copy, ExternalLink, LogOut, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewProfile = () => {
    if (user?.username) {
      window.open(`/${user.username}`, '_blank');
    }
  };

  const handleCopyProfile = async () => {
    if (!user?.username) return;

    const profileUrl = `${window.location.origin}/${user.username}`;
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 shadow-md shadow-indigo-500/10">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
            LinkSync
          </span>
        </div>

        {/* User Actions */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View public profile */}
            <button
              onClick={handleViewProfile}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 active:scale-[0.98] transition-all sm:px-4"
            >
              <span>My Page</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={handleCopyProfile}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-700 active:scale-[0.98] transition-all sm:px-4"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Link'}</span>
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 px-3 py-2 text-sm font-semibold text-rose-600 hover:text-rose-700 active:scale-[0.98] transition-all sm:px-4"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
