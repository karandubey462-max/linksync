import React from 'react';
import { Smartphone, Sparkles, User } from 'lucide-react';
import SiteLogo from './SiteLogo';

const LivePreview = ({ profileData, links }) => {
  const { name, bio, avatar, accentColor, selectedTheme } = profileData;

  // Filter links to show only active ones in the mobile preview
  const activeLinks = links.filter((link) => link.active);

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
      return {
        borderColor: `${accentColor}40` || 'rgba(255, 255, 255, 0.1)',
        boxShadow: `0 0 10px ${accentColor}15`,
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
              {avatar ? (
                <img
                  src={avatar}
                  alt={name || 'Avatar'}
                  className="w-18 h-18 rounded-full object-cover border-2 border-white shadow-md"
                  style={{ borderColor: accentColor }}
                />
              ) : (
                <div
                  className="w-18 h-18 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md"
                  style={{ backgroundColor: accentColor || '#6366f1' }}
                >
                  {name ? name.charAt(0).toUpperCase() : <User className="h-8 w-8" />}
                </div>
              )}
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
                  <div
                    key={link._id || link.id || `${link.title}-${link.url}-${index}`}
                    style={getButtonStyle(selectedTheme)}
                    className="profile-button w-full py-2.5 px-3 rounded-xl text-[12px] font-semibold cursor-pointer transition-all border flex items-center gap-2 text-left"
                  >
                    <SiteLogo url={link.url} size="sm" />
                    <span className="min-w-0 flex-1 truncate">{link.title || 'Untitled Link'}</span>
                  </div>
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
