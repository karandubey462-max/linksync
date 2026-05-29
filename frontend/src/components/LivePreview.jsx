import React from 'react';
import { Sparkles } from 'lucide-react';
import SiteLogo from './SiteLogo';
import { getAvatarUrl } from '../utils/avatarMapper';

const LivePreview = ({ profileData, links }) => {
  const { name, bio, avatar, accentColor, selectedTheme } = profileData;

  // Filter links to show only active ones in the mobile preview
  const activeLinks = links.filter((link) => link.active);

  const openPreviewLink = (targetUrl) => {
    if (!targetUrl) return;
    const formattedUrl = /^https?:\/\//i.test(targetUrl) ? targetUrl : `https://${targetUrl}`;
    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
  };

  // Theme-specific wrapper CSS
  const getThemeWrapperClass = () => {
    switch (selectedTheme) {
      case 'dark':
        return 'theme-dark';
      case 'neon':
        return 'theme-neon';
      case 'minimal':
      default:
        return 'theme-minimal';
    }
  };

  // Dynamic button styles based on theme and user accentColor
  const getButtonStyle = (theme) => {
    if (theme === 'minimal') {
      return {
        borderColor: accentColor || '#e2e8f0',
        color: accentColor || '#0f172a',
      };
    }
    if (theme === 'dark') {
      const color = accentColor || '#6366f1';
      return {
        borderColor: `${color}40`,
        boxShadow: `0 0 10px ${color}15`,
      };
    }
    if (theme === 'neon') {
      return {
        borderColor: accentColor || '#d946ef',
        color: accentColor || '#38bdf8',
        boxShadow: `0 0 8px ${accentColor}30`,
      };
    }
    return {};
  };

  return (
    <div className="flex h-full min-h-[520px] flex-col items-center justify-center py-3 sm:min-h-[580px] sm:py-6">
      {/* Smartphone frame container */}
      <div className="relative mx-auto h-[540px] w-full max-w-[290px] overflow-hidden rounded-[36px] border-[8px] border-slate-900 bg-slate-900 shadow-2xl ring-4 ring-slate-800 sm:h-[580px] sm:rounded-[48px] sm:border-[11px]">
        {/* Notch/Speaker */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-28 bg-slate-900 rounded-b-2xl z-30 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Screen Content Scroll Pane */}
        <div className={`w-full h-full pt-12 pb-6 px-4 overflow-y-auto select-none no-scrollbar flex flex-col justify-between ${getThemeWrapperClass()}`}>
          <div className="flex-1 flex flex-col items-center">
            {/* Avatar Section */}
            <div className="relative mt-2 mb-3">
              <img
                src={getAvatarUrl(avatar)}
                alt={name || 'Avatar'}
                className="w-18 h-18 rounded-full object-cover border-2 border-white shadow-md"
                style={{ borderColor: accentColor }}
              />
            </div>

            {/* Profile Info */}
            <h4 className="max-w-full truncate text-center font-display text-sm font-bold tracking-tight">
              {name || '@username'}
            </h4>
            <p className="text-[11px] text-center opacity-70 mt-1 max-w-[200px] line-clamp-3 leading-relaxed">
              {bio || 'Add a bio to tell people about yourself.'}
            </p>

            {/* Active Links Container */}
            <div className="w-full space-y-2.5 mt-6">
              {activeLinks.length > 0 ? (
                activeLinks.map((link, index) => (
                  <button
                    type="button"
                    key={link._id || link.id || `${link.title}-${link.url}-${index}`}
                    onClick={() => openPreviewLink(link.url)}
                    style={getButtonStyle(selectedTheme)}
                    className="profile-button w-full py-2.5 px-3 rounded-xl text-[12px] font-semibold cursor-pointer transition-all duration-200 border flex items-center gap-2 text-left hover:scale-[1.015] hover:-translate-y-0.5"
                  >
                    <SiteLogo url={link.url} size="sm" />
                    <span className="min-w-0 flex-1 truncate">{link.title || 'Untitled Link'}</span>
                  </button>
                ))
              ) : (
                <div className="text-center py-6 px-4 border border-dashed border-slate-300/30 rounded-2xl opacity-50 text-[10px]">
                  No active links added yet.
                </div>
              )}
            </div>
          </div>

          {/* Footer Logo */}
          <div className="mt-8 text-center flex items-center justify-center gap-1 opacity-40 text-[9px] font-semibold tracking-wider uppercase">
            <Sparkles className="h-2.5 w-2.5" />
            <span>Powered by LinkSync</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
