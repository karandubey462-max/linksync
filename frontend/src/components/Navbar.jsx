import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import QRCode from 'qrcode';
import { Check, Copy, Download, ExternalLink, LogOut, Moon, QrCode, Sparkles, Sun, X } from 'lucide-react';

const Navbar = ({ isDark = false, onToggleTheme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [qrCopied, setQrCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState('');
  const [qrData, setQrData] = useState(null);

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

  const handleOpenQr = async () => {
    if (!user?.username) return;

    setQrOpen(true);
    setQrError('');

    if (qrData) return;

    setQrLoading(true);
    try {
      const response = await API.get('/profile/qr');
      if (response.data.success) {
        setQrData(response.data);
      } else {
        setQrError('Could not generate your QR code.');
      }
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      try {
        const profileUrl = `${window.location.origin}/${user.username}`;
        const qrDataUrl = await QRCode.toDataURL(profileUrl, {
          errorCorrectionLevel: 'M',
          margin: 2,
          width: 512,
          color: {
            dark: user.accentColor || '#0f172a',
            light: '#ffffff',
          },
        });
        setQrData({ success: true, profileUrl, trackingUrl: profileUrl, qrDataUrl });
      } catch (qrError) {
        console.error('Failed to generate local QR code:', qrError);
        setQrError('Could not generate your QR code.');
      }
    } finally {
      setQrLoading(false);
    }
  };

  const handleCopyQrLink = async () => {
    if (!qrData?.profileUrl) return;

    await navigator.clipboard.writeText(qrData.profileUrl);
    setQrCopied(true);
    setTimeout(() => setQrCopied(false), 1800);
  };

  const handleDownloadQr = () => {
    if (!qrData?.qrDataUrl) return;

    const link = document.createElement('a');
    link.href = qrData.qrDataUrl;
    link.download = `${user.username}-linksync-qr.png`;
    link.click();
  };

  return (
    <>
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${isDark ? 'border-slate-800 bg-slate-950/85' : 'border-slate-200/80 bg-white/80'}`}>
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand logo */}
        <div className="flex items-center gap-2 cursor-pointer group transition-transform duration-300 hover:scale-[1.015]" onClick={() => navigate('/dashboard')}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 shadow-md shadow-indigo-500/10 transition-transform duration-300 group-hover:rotate-12">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className={`font-display text-xl font-bold tracking-tight transition-colors duration-300 group-hover:text-indigo-500 ${isDark ? 'text-white' : 'bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent'}`}>
            LinkSync
          </span>
        </div>

        {/* User Actions */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onToggleTheme}
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold active:scale-[0.98] transition-all ${isDark ? 'bg-slate-800 text-cyan-100 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="hidden md:inline">{isDark ? 'Light' : 'Dark'}</span>
            </button>

            {/* View public profile */}
            <button
              onClick={handleViewProfile}
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold active:scale-[0.98] transition-all sm:px-4 ${isDark ? 'bg-slate-800 text-slate-100 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'}`}
            >
              <span>My Page</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={handleCopyProfile}
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold active:scale-[0.98] transition-all sm:px-4 ${isDark ? 'bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/15' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleOpenQr}
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold active:scale-[0.98] transition-all sm:px-4 ${isDark ? 'bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/15' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
            >
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">QR</span>
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold active:scale-[0.98] transition-all sm:px-4 ${isDark ? 'border-slate-700 bg-slate-900 text-rose-300 hover:bg-slate-800' : 'border-slate-200 bg-white text-rose-600 hover:border-slate-300 hover:bg-slate-50 hover:text-rose-700'}`}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>

    </header>

    {qrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6 backdrop-blur-sm sm:py-8">
          <div className={`relative my-auto w-full max-w-sm rounded-3xl border p-5 shadow-2xl ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-900'}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold">Profile QR Code</h2>
                <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Share your public LinkSync page anywhere.
                </p>
              </div>
              <button
                onClick={() => setQrOpen(false)}
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${isDark ? 'border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700' : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                aria-label="Close QR dialog"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className={`mt-5 flex min-h-[17rem] items-center justify-center overflow-hidden rounded-2xl border p-4 ${isDark ? 'border-slate-700 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
              {qrLoading ? (
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
              ) : qrError ? (
                <p className="text-center text-sm text-rose-500">{qrError}</p>
              ) : qrData?.qrDataUrl ? (
                <img src={qrData.qrDataUrl} alt="QR code for your LinkSync profile" className="aspect-square h-auto max-h-60 w-full max-w-60 rounded-xl bg-white p-2 object-contain" />
              ) : null}
            </div>

            {qrData?.profileUrl && (
              <p className={`mt-3 truncate rounded-xl px-3 py-2 text-xs font-semibold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                {qrData.profileUrl}
              </p>
            )}

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setQrOpen(false)}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${isDark ? 'bg-slate-800 text-slate-100 hover:bg-slate-700' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleCopyQrLink}
                disabled={!qrData?.profileUrl}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition disabled:opacity-50 ${isDark ? 'bg-slate-800 text-slate-100 hover:bg-slate-700' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
              >
                {qrCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {qrCopied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownloadQr}
                disabled={!qrData?.qrDataUrl}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
