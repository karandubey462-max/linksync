import React from 'react';
import { Smartphone, Sparkles, User } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center py-6 h-full min-h-[580px]">
      {/* Smartphone frame container */}
      <div className="relative mx-auto w-[290px] h-[580px] rounded-[48px] border-[11px] border-slate-900 bg-slate-900 shadow-2xl overflow-hidden ring-4 ring-slate-800">
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
            <h4 className="font-display font-bold text-sm tracking-tight text-center truncate max-w-full">
              {name || '@username'}
            </h4>
            <p className="text-[11px] text-center opacity-70 mt-1 max-w-[200px] line-clamp-3 leading-relaxed">
              {bio || 'Add a bio to tell people about yourself.'}
            </p>

            {/* Active Links Container */}
            <div className="w-full space-y-2.5 mt-6">
              {activeLinks.length > 0 ? (
                activeLinks.map((link) => (
                  <div
                    key={link._id || link.id || Math.random().toString()}
                    style={getButtonStyle(selectedTheme)}
                    className="profile-button w-full py-2.5 px-4 rounded-xl text-[12px] font-semibold text-center truncate cursor-pointer transition-all border"
                  >
                    {link.title || 'Untitled Link'}
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
