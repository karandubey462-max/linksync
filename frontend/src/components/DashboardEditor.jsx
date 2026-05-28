import React, { useState } from 'react';
import LinkCard from './LinkCard';
import ThemeSelector from './ThemeSelector';
import { BarChart2, Plus, User, Link2, Sparkles, Upload, Loader2, Check } from 'lucide-react';

const avatarPresets = [
  { name: 'Male 1', bg: '#dbeafe', skin: '#f2b894', hair: '#2f241f', shirt: '#1d4ed8', kind: 'male', glasses: true, beard: true },
  { name: 'Male 2', bg: '#dcfce7', skin: '#c9865a', hair: '#111827', shirt: '#059669', kind: 'male', glasses: false, beard: true },
  { name: 'Male 3', bg: '#fef3c7', skin: '#8d5524', hair: '#3f2a1d', shirt: '#f97316', kind: 'male', glasses: true, beard: false },
  { name: 'Female 1', bg: '#fce7f3', skin: '#f0b78f', hair: '#4a2512', shirt: '#db2777', kind: 'female', glasses: false },
  { name: 'Female 2', bg: '#ede9fe', skin: '#b77952', hair: '#111827', shirt: '#7c3aed', kind: 'female', glasses: true },
  { name: 'Female 3', bg: '#cffafe', skin: '#f1c6a8', hair: '#8b3a24', shirt: '#0891b2', kind: 'female', glasses: false },
];

function makeAvatarDataUrl(avatar) {
  const hairShape = avatar.kind === 'female'
    ? `<path d="M61 109c-10-38 8-73 45-83 42-11 82 12 90 54 5 25-2 48-12 66-10-21-26-32-50-32H96c-16 0-27 7-35 21z" fill="${avatar.hair}"/>`
    : `<path d="M63 84c7-37 33-57 69-57 33 0 56 18 62 51-22-14-44-13-69-9-21 3-42 4-62 15z" fill="${avatar.hair}"/>`;
  const beard = avatar.beard
    ? `<path d="M84 126c10 28 31 43 48 43s38-15 48-43c-12 10-28 15-48 15s-36-5-48-15z" fill="${avatar.hair}" opacity=".92"/>`
    : '';
  const glasses = avatar.glasses
    ? `<g fill="none" stroke="#1f2937" stroke-width="6"><circle cx="105" cy="106" r="19"/><circle cx="153" cy="106" r="19"/><path d="M124 106h10"/></g>`
    : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><rect width="256" height="256" rx="128" fill="${avatar.bg}"/><circle cx="207" cy="50" r="28" fill="#fff" opacity=".45"/><path d="M54 224c11-42 39-65 74-65s63 23 74 65z" fill="${avatar.shirt}"/><circle cx="128" cy="96" r="58" fill="${avatar.skin}"/>${hairShape}<path d="M78 99c3-18 13-30 28-38 21 15 55 18 82 8 9 11 14 25 14 42 0 48-34 78-74 78s-74-30-74-78c0-4 0-8 1-12z" fill="${avatar.skin}"/>${beard}<circle cx="107" cy="108" r="6" fill="#1f2937"/><circle cx="151" cy="108" r="6" fill="#1f2937"/>${glasses}<path d="M111 135c10 9 25 9 35 0" fill="none" stroke="#7f3f2a" stroke-width="6" stroke-linecap="round"/></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const DashboardEditor = ({
  profileData,
  links,
  onProfileChange,
  onAutoSaveField,
  onSaveProfile,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onMoveLink,
  onResetStats,
  isProfileSaving,
  isProfileSaved,
  isDark = false,
}) => {
  const [activeTab, setActiveTab] = useState('links');
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  // Handle adding a link
  const handleAddLinkSubmit = async (e) => {
    e.preventDefault();
    setAddError('');

    if (!newTitle.trim() || !newUrl.trim()) {
      setAddError('Please fill in both title and URL.');
      return;
    }

    setAddLoading(true);
    const success = await onAddLink(newTitle, newUrl);
    setAddLoading(false);

    if (success) {
      setNewTitle('');
      setNewUrl('');
    } else {
      setAddError('Failed to add link. Check URL format.');
    }
  };

  // Base64 image compression handler
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (e.g. 5MB raw, but we compress it anyway)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Please select an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 120;
        const MAX_HEIGHT = 120;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed jpeg string (70% quality)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        onProfileChange('avatar', compressedBase64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Editor Tabs Navigation */}
      <div className={`flex overflow-x-auto border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <button
          onClick={() => setActiveTab('links')}
          className={`flex shrink-0 items-center gap-2 px-4 py-3 font-semibold text-sm transition-all border-b-2 -mb-[2px] sm:px-6 ${
            activeTab === 'links'
              ? isDark ? 'border-cyan-300 text-cyan-200' : 'border-indigo-600 text-indigo-600'
              : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Link2 className="h-4.5 w-4.5" />
          <span>Links</span>
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex shrink-0 items-center gap-2 px-4 py-3 font-semibold text-sm transition-all border-b-2 -mb-[2px] sm:px-6 ${
            activeTab === 'appearance'
              ? isDark ? 'border-cyan-300 text-cyan-200' : 'border-indigo-600 text-indigo-600'
              : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="h-4.5 w-4.5" />
          <span>Appearance</span>
        </button>
      </div>

      {/* TABS CONTENT */}

      {/* 1. LINKS MANAGEMENT TAB */}
      {activeTab === 'links' && (
        <div className="space-y-6">
          {/* Add Link Form Card */}
          <div className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Add New Link</h3>
            
            {addError && (
              <div className={`mb-4 text-xs font-medium border p-2.5 rounded-xl ${isDark ? 'border-rose-500/20 bg-rose-500/10 text-rose-200' : 'border-rose-100 bg-rose-50 text-rose-600'}`}>
                {addError}
              </div>
            )}

            <form onSubmit={handleAddLinkSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Link Title
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. My GitHub Profile"
                    className={`w-full rounded-xl border py-2.5 px-3.5 text-sm transition focus:outline-none focus:border-indigo-500 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 focus:bg-slate-900' : 'border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white'}`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    URL Address
                  </label>
                  <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="e.g. https://github.com/myname"
                    className={`w-full rounded-xl border py-2.5 px-3.5 text-sm transition focus:outline-none focus:border-indigo-500 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 focus:bg-slate-900' : 'border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white'}`}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={addLoading}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {addLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4.5 w-4.5" />
                )}
                <span>Add Link</span>
              </button>
            </form>
          </div>

          {/* Links List */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Manage Links</h3>
              {links.length > 0 && (
                <button
                  type="button"
                  onClick={onResetStats}
                  className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${isDark ? 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <BarChart2 className="h-3.5 w-3.5" />
                  <span>Reset Stats</span>
                </button>
              )}
            </div>
            
            {links.length > 0 ? (
              <div className="space-y-3.5">
                {links.map((link, index) => (
                  <LinkCard
                    key={link._id}
                    link={link}
                    onUpdate={onUpdateLink}
                    onDelete={onDeleteLink}
                    onMoveUp={() => onMoveLink(index, index - 1)}
                    onMoveDown={() => onMoveLink(index, index + 1)}
                    isFirst={index === 0}
                    isLast={index === links.length - 1}
                    isDark={isDark}
                  />
                ))}
              </div>
            ) : (
              <div className={`text-center rounded-2xl border border-dashed py-10 px-4 shadow-sm ${isDark ? 'border-slate-700 bg-slate-950' : 'border-slate-200 bg-white'}`}>
                <Link2 className={`mx-auto h-8 w-8 mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                <p className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>No links added yet</p>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Use the form above to add your first bio link.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. APPEARANCE TAB */}
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          {/* Profile Form Card */}
          <div className={`rounded-2xl border p-4 shadow-sm space-y-6 sm:p-5 ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Customize Bio Profile</h3>

            <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
              {/* Profile Image View */}
              <div className="relative group shrink-0">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-inner"
                    style={{ backgroundColor: profileData.accentColor || '#6366f1' }}
                  >
                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
                {/* Upload Hover Overlay */}
                <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-all">
                  <Upload className="h-5 w-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Upload Prompts */}
              <div className="flex-1 text-center sm:text-left space-y-1">
                <h4 className={`font-semibold text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Profile Picture</h4>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Upload a photo or choose a clean avatar below.</p>
                <label className={`inline-block mt-2 cursor-pointer rounded-lg py-1.5 px-3 text-xs font-semibold transition ${isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Quick Avatar
              </label>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {avatarPresets.map((avatar) => {
                  const dataUrl = makeAvatarDataUrl(avatar);
                  const selected = profileData.avatar === dataUrl;
                  return (
                    <button
                      key={avatar.name}
                      type="button"
                      onClick={() => onProfileChange('avatar', dataUrl)}
                      className={`rounded-2xl border p-2 transition hover:-translate-y-0.5 ${selected ? 'border-indigo-500 ring-2 ring-indigo-500/25' : isDark ? 'border-slate-700 hover:border-slate-500' : 'border-slate-200 hover:border-slate-300'}`}
                      aria-label={`Use ${avatar.name} avatar`}
                    >
                      <img src={dataUrl} alt="" className="mx-auto h-12 w-12 rounded-full" />
                      <span className={`mt-1 block text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{avatar.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Avatar Image URL
              </label>
              <input
                type="url"
                value={profileData.avatar && !profileData.avatar.startsWith('data:') ? profileData.avatar : ''}
                onChange={(e) => onProfileChange('avatar', e.target.value)}
                onBlur={(e) => onAutoSaveField?.('avatar', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className={`w-full rounded-xl border py-2.5 px-3.5 text-sm transition focus:outline-none focus:border-indigo-500 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 focus:bg-slate-900' : 'border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white'}`}
              />
            </div>

            {/* Form details */}
            <form onSubmit={onSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => onProfileChange('name', e.target.value)}
                    placeholder="Full Name"
                    className={`w-full rounded-xl border py-2.5 px-3.5 text-sm transition focus:outline-none focus:border-indigo-500 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 focus:bg-slate-900' : 'border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white'}`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Username
                  </label>
                  <input
                    type="text"
                  value={profileData.username}
                    onChange={(e) => onProfileChange('username', e.target.value.toLowerCase().replace(/\s/g, ''))}
                    placeholder="username"
                    className={`w-full rounded-xl border py-2.5 px-3.5 text-sm transition focus:outline-none focus:border-indigo-500 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 focus:bg-slate-900' : 'border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white'}`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Bio Summary
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => onProfileChange('bio', e.target.value)}
                  onBlur={(e) => onAutoSaveField?.('bio', e.target.value)}
                  placeholder="Tell your visitors who you are..."
                  rows={3}
                  maxLength={160}
                  className={`w-full resize-none rounded-xl border py-2.5 px-3.5 text-sm transition focus:outline-none focus:border-indigo-500 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 focus:bg-slate-900' : 'border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white'}`}
                />
                <span className={`text-[10px] flex justify-end ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {profileData.bio ? profileData.bio.length : 0}/160 characters
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={profileData.accentColor}
                      onChange={(e) => onProfileChange('accentColor', e.target.value)}
                      className="h-9 w-9 rounded-lg border border-slate-200 cursor-pointer overflow-hidden p-0"
                    />
                    <input
                      type="text"
                      value={profileData.accentColor}
                      onChange={(e) => onProfileChange('accentColor', e.target.value)}
                      className={`w-24 rounded-lg border py-1.5 px-2.5 text-xs focus:outline-none focus:border-indigo-500 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}
                    />
                  </div>
                </div>
              </div>

              <div className={`pt-4 border-t flex justify-end ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  type="submit"
                  disabled={isProfileSaving}
                  className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none sm:w-auto"
                >
                  {isProfileSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isProfileSaved ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span>{isProfileSaving ? 'Saving...' : isProfileSaved ? 'Profile Saved' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Theme Selector Section */}
          <div className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'}`}>
            <ThemeSelector
              selectedTheme={profileData.selectedTheme}
              onSelectTheme={(themeId) => onProfileChange('selectedTheme', themeId)}
              isDark={isDark}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardEditor;
