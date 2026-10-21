import React from 'react';
import { Menu, Search, Bookmark, Sun, Moon, BookOpen, Sparkles } from 'lucide-react';
import { Bookmark as BookmarkType } from '../types';

interface TopHeaderProps {
  onToggleSidebar: () => void;
  onOpenSearch: (initialQuery?: string) => void;
  onOpenBookmarks: () => void;
  bookmarkCount: number;
  theme: string;
  onToggleTheme: () => void;
  onOpenDailyVerse: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onToggleSidebar,
  onOpenSearch,
  onOpenBookmarks,
  bookmarkCount,
  theme,
  onToggleTheme,
  onOpenDailyVerse
}) => {
  const isDark = theme === 'dark';

  return (
    <header className={`h-16 px-4 sm:px-6 border-b flex items-center justify-between gap-4 sm:gap-8 shrink-0 z-20 ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-[#FBF9F5] border-stone-200 text-stone-900'
    }`}>
      {/* Zone 1: Hamburger toggle & Brand Title wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className={`p-2 rounded-lg border transition-colors lg:hidden ${
            isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-stone-200 hover:bg-stone-200/70 text-stone-700'
          }`}
          aria-label="Abrir catálogo de libros"
          title="Abrir libros de la Biblia"
        >
          <Menu className="w-5 h-5" />
        </button>

        <a
          href="#reader"
          className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-rose-950 dark:text-amber-400 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-rose-900 dark:bg-amber-400 hidden sm:inline-block" />
          <span>Santa Biblia RVR1960</span>
        </a>
      </div>

      {/* Zone 2: Global Search Bar - Positioned prominently in the top header */}
      <div className="flex-1 max-w-xl mx-auto">
        <button
          onClick={() => onOpenSearch()}
          className={`w-full py-2 px-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm transition-all group shadow-2xs ${
            isDark
              ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-amber-400/50 hover:bg-slate-800'
              : 'bg-white border-stone-300 text-stone-500 hover:border-rose-900/50 hover:bg-white shadow-xs'
          }`}
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className={`w-4 h-4 shrink-0 transition-colors ${
              isDark ? 'group-hover:text-amber-400' : 'group-hover:text-rose-900 text-stone-400'
            }`} />
            <span className="truncate">
              Buscar por frase (ej. <em className="not-italic font-medium text-stone-700 dark:text-slate-300">&ldquo;en el principio creo Dios&rdquo;</em>) o cita (ej. <em className="not-italic font-medium text-stone-700 dark:text-slate-300">&ldquo;Juan 3:16&rdquo;</em>)...
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 shrink-0 ml-2">
            <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
              isDark ? 'border-slate-700 bg-slate-900 text-slate-400' : 'border-stone-200 bg-stone-100 text-stone-500'
            }`}>
              ⌘K
            </kbd>
          </div>
        </button>
      </div>

      {/* Zone 3: Primary Actions (Versículo Diario, Marcadores, Tema) */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenDailyVerse}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            isDark
              ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
              : 'border-stone-200 hover:bg-stone-100 text-stone-700 shadow-xs'
          }`}
          title="Ver versículo del día"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Versículo del Día</span>
        </button>

        <button
          onClick={onOpenBookmarks}
          className={`p-2 rounded-lg border relative transition-colors ${
            isDark
              ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
              : 'border-stone-200 hover:bg-stone-100 text-stone-700 shadow-xs'
          }`}
          title="Ver versículos guardados"
          aria-label="Marcadores guardados"
        >
          <Bookmark className="w-4 h-4" />
          {bookmarkCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-900 dark:bg-amber-400 text-white dark:text-slate-950 text-[9px] font-bold flex items-center justify-center">
              {bookmarkCount}
            </span>
          )}
        </button>

        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-lg border transition-colors ${
            isDark
              ? 'border-slate-800 hover:bg-slate-800 text-amber-400'
              : 'border-stone-200 hover:bg-stone-100 text-stone-700 shadow-xs'
          }`}
          title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          aria-label="Alternar tema"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
