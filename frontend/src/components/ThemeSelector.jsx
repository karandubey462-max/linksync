import React from 'react';
import { Sparkles, Moon, Sun } from 'lucide-react';

const ThemeSelector = ({ selectedTheme, onSelectTheme }) => {
  const themes = [
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Bright Slate & Light Grey',
      icon: Sun,
      classes: 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 text-slate-900',
      pillBg: 'bg-white border-slate-200',
      textColor: 'text-slate-800',
    },
    {
      id: 'dark',
      name: 'Premium Dark',
      description: 'Sleek Obsidian & Charcoal',
      icon: Moon,
      classes: 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 text-slate-100',
      pillBg: 'bg-white/10 border-white/5',
      textColor: 'text-white',
    },
    {
      id: 'neon',
      name: 'Cyber Neon',
      description: 'Glowing Indigo & Hot Fuchsia',
      icon: Sparkles,
      classes: 'bg-radial-gradient from-purple-950 to-black border-purple-900 text-purple-100',
      pillBg: 'bg-black/50 border-pink-500',
      textColor: 'text-cyan-400',
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-slate-800">Choose Profile Theme</h3>
        <p className="text-sm text-slate-500">Pick a background and card aesthetic for your public link tree.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((theme) => {
          const Icon = theme.icon;
          const isSelected = selectedTheme === theme.id;

          return (
            <button
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              className={`relative flex flex-col text-left rounded-2xl border p-4 transition-all duration-300 ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md scale-[1.02]'
                  : 'border-slate-200 hover:border-slate-300 hover:scale-[1.01] hover:shadow-sm bg-white'
              }`}
            >
              {/* Miniature Theme Preview Mockup */}
              <div className={`w-full h-24 rounded-xl mb-4 border p-3 flex flex-col items-center justify-center gap-1.5 overflow-hidden ${theme.classes}`}>
                <div className="w-6 h-6 rounded-full bg-slate-300 opacity-80 shrink-0" />
                <div className="w-16 h-2 rounded bg-slate-300 opacity-60" />
                <div className={`w-full py-1.5 px-3 rounded-lg border ${theme.pillBg} flex items-center justify-between`}>
                  <div className="w-10 h-1.5 rounded bg-slate-300 opacity-40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300 opacity-40" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex items-center gap-2">
                <Icon className={`h-4.5 w-4.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="font-semibold text-slate-800 text-sm">{theme.name}</span>
              </div>
              <span className="text-xs text-slate-400 mt-1">{theme.description}</span>

              {/* Selection Badge */}
              {isSelected && (
                <span className="absolute top-3 right-3 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;
