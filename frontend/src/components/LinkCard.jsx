import React, { useState, useEffect } from 'react';
import { Trash2, ExternalLink, BarChart2, ArrowUp, ArrowDown, Check, Loader2 } from 'lucide-react';
import SiteLogo from './SiteLogo';
import { getDomain, getSiteName } from '../utils/siteMeta';

const LinkCard = ({ link, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast, isDark = false }) => {
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Sync state if link updates from parent (e.g. initial fetch)
  useEffect(() => {
    setTitle(link.title);
    setUrl(link.url);
  }, [link.title, link.url]);

  // Handle auto-save on blur or enter key
  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    if (trimmedTitle === link.title && trimmedUrl === link.url) return;
    if (!trimmedTitle || !trimmedUrl) {
      setTitle(link.title);
      setUrl(link.url);
      return;
    }

    setIsUpdating(true);
    const success = await onUpdate(link._id, { title: trimmedTitle, url: trimmedUrl });
    setIsUpdating(false);

    if (success) {
      setTitle(trimmedTitle);
      setUrl(trimmedUrl);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } else {
      setTitle(link.title);
      setUrl(link.url);
    }
  };

  const handleToggleActive = async () => {
    setIsUpdating(true);
    await onUpdate(link._id, { active: !link.active });
    setIsUpdating(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <div className={`rounded-2xl border transition-all duration-300 ${
      link.active
        ? isDark ? 'border-slate-700 bg-slate-900 shadow-sm hover:border-slate-600' : 'border-slate-200 bg-white shadow-sm hover:shadow-md'
        : isDark ? 'border-dashed border-slate-700 bg-slate-900/50 opacity-80' : 'border-dashed border-slate-300 bg-slate-50/50 opacity-80'
    } p-5`}>
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
        {/* Left Side: Order Controls */}
        <div className="flex gap-1.5 pt-1 sm:flex-col">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className={`flex h-7 w-7 items-center justify-center rounded-lg border disabled:opacity-30 disabled:pointer-events-none transition-all ${isDark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
            title="Move link up"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className={`flex h-7 w-7 items-center justify-center rounded-lg border disabled:opacity-30 disabled:pointer-events-none transition-all ${isDark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
            title="Move link down"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>

        {/* Site logo */}
        <SiteLogo url={url || link.url} />

        {/* Middle: Inputs */}
        <div className="min-w-0 flex-1 space-y-3.5">
          {/* Link Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              onKeyPress={handleKeyPress}
              className={`w-full bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none pb-1 transition text-base font-semibold ${isDark ? 'text-slate-100 hover:border-slate-700' : 'text-slate-800 hover:border-slate-200'}`}
              placeholder="Link Title (e.g. My Portfolio)"
            />
          </div>

          {/* Link URL Input */}
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={handleSave}
              onKeyPress={handleKeyPress}
              className={`w-full text-sm bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none pb-0.5 transition ${isDark ? 'text-slate-400 hover:border-slate-700' : 'text-slate-500 hover:border-slate-200'}`}
              placeholder="URL (e.g. https://github.com)"
            />
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={isDark ? 'text-slate-500 hover:text-cyan-300 transition' : 'text-slate-400 hover:text-indigo-600 transition'}
              title="Open url in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <p className={`truncate text-[11px] font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {getSiteName(url || link.url)}{getDomain(url || link.url) ? ` - ${getDomain(url || link.url)}` : ''}
          </p>

          {/* Analytics & State Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2.5">
            {/* Click Count badge */}
            <div className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${isDark ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200/50 bg-slate-100 text-slate-600'}`}>
              <BarChart2 className="h-3.5 w-3.5" />
              <span>{link.clicks || 0} clicks</span>
            </div>

            {/* Auto-save status */}
            {isUpdating && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Loader2 className="h-3 w-3 animate-spin" /> Saving...
              </span>
            )}
            {isSaved && (
              <span className="flex items-center gap-0.5 text-[11px] text-emerald-600">
                <Check className="h-3.5 w-3.5" /> Saved
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Toggle Active & Delete */}
        <div className="flex items-center justify-between gap-3 self-stretch pl-0 sm:flex-col sm:items-end sm:pl-1">
          {/* Active Switch Toggle */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={link.active}
              onChange={handleToggleActive}
              className="sr-only peer"
            />
            <div className={`w-9 h-5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
          </label>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(link._id)}
            className={`rounded-xl border p-2 transition-all ${isDark ? 'border-slate-700 bg-slate-900 text-slate-400 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300' : 'border-slate-100 bg-white text-slate-400 hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600'}`}
            title="Delete link"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;
