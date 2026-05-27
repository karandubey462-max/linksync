import React, { useState, useEffect } from 'react';
import { Trash2, ExternalLink, BarChart2, ArrowUp, ArrowDown, Check, Loader2 } from 'lucide-react';

const LinkCard = ({ link, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) => {
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
        ? 'border-slate-200 bg-white shadow-sm hover:shadow-md' 
        : 'border-dashed border-slate-300 bg-slate-50/50 opacity-80'
    } p-5`}>
      <div className="flex items-start gap-4">
        {/* Left Side: Order Controls */}
        <div className="flex flex-col gap-1.5 pt-1">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Move link up"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Move link down"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>

        {/* Middle: Inputs */}
        <div className="flex-1 space-y-3.5">
          {/* Link Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              onKeyPress={handleKeyPress}
              className="w-full font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none pb-1 transition text-base"
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
              className="w-full text-sm text-slate-500 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none pb-0.5 transition"
              placeholder="URL (e.g. https://github.com)"
            />
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-600 transition"
              title="Open url in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Analytics & State Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2.5">
            {/* Click Count badge */}
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200/50 px-3 py-1 text-xs font-medium text-slate-600">
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
        <div className="flex flex-col items-end justify-between self-stretch pl-1">
          {/* Active Switch Toggle */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={link.active}
              onChange={handleToggleActive}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(link._id)}
            className="rounded-xl border border-slate-100 bg-white hover:bg-rose-50 p-2 text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all"
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
