import React, { useState, useMemo } from 'react';
import { Book as BookIcon, Search, ChevronRight, X, Sparkles, Bookmark as BookmarkIcon } from 'lucide-react';
import { Book, Testament } from '../types';
import { OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS, normalizeSearchStr } from '../data/booksData';

interface SidebarNavProps {
  isOpen: boolean;
  onCloseMobile: () => void;
  selectedBook: string;
  onSelectBook: (bookName: string) => void;
  theme: string;
  onOpenBookmarks: () => void;
  bookmarkCount: number;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  isOpen,
  onCloseMobile,
  selectedBook,
  onSelectBook,
  theme,
  onOpenBookmarks,
  bookmarkCount
}) => {
  const [activeTestament, setActiveTestament] = useState<Testament>('AT');
  const [bookFilterQuery, setBookFilterQuery] = useState('');

  // Switch testament automatically if selectedBook belongs to the other testament
  React.useEffect(() => {
    const isNT = NEW_TESTAMENT_BOOKS.some(b => b.name === selectedBook);
    if (isNT && activeTestament !== 'NT') {
      setActiveTestament('NT');
    } else if (!isNT && activeTestament !== 'AT') {
      setActiveTestament('AT');
    }
  }, [selectedBook]);

  const currentBooks = activeTestament === 'AT' ? OLD_TESTAMENT_BOOKS : NEW_TESTAMENT_BOOKS;

  const filteredBooks = useMemo(() => {
    if (!bookFilterQuery.trim()) return currentBooks;
    const clean = normalizeSearchStr(bookFilterQuery);
    return currentBooks.filter(b => {
      const nameMatch = normalizeSearchStr(b.name).includes(clean);
      const abbrMatch = b.abbreviations?.some(a => normalizeSearchStr(a).includes(clean));
      const catMatch = normalizeSearchStr(b.category).includes(clean);
      return nameMatch || abbrMatch || catMatch;
    });
  }, [currentBooks, bookFilterQuery]);

  // Group books by category
  const groupedBooks = useMemo(() => {
    const groups: { [key: string]: Book[] } = {};
    for (const b of filteredBooks) {
      if (!groups[b.category]) groups[b.category] = [];
      groups[b.category].push(b);
    }
    return groups;
  }, [filteredBooks]);

  const isDark = theme === 'dark';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-stone-950/60 z-30 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-80 flex flex-col transition-transform duration-300 ease-in-out border-r shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-[#FBF9F5] border-stone-200 text-stone-900'
        }`}
      >
        {/* Sidebar Header / Brand wordmark & Close on mobile */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isDark ? 'border-slate-800' : 'border-stone-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-base ${
              isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-900 text-white'
            }`}>
              R
            </div>
            <div>
              <h2 className="font-display font-bold text-sm tracking-wide">
                Reina Valera 1960
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-slate-400">
                66 Libros Canónicos
              </p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-md hover:bg-stone-200 dark:hover:bg-slate-800 text-stone-500 dark:text-slate-400"
            aria-label="Cerrar menú de libros"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Selectors / Tabs: Antiguo Testamento vs Nuevo Testamento */}
        <div className="p-3">
          <div className={`p-1 rounded-lg flex items-center gap-1 border ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-stone-200/60 border-stone-300/70'
          }`}>
            <button
              onClick={() => {
                setActiveTestament('AT');
                setBookFilterQuery('');
              }}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold tracking-wide transition-all ${
                activeTestament === 'AT'
                  ? isDark
                    ? 'bg-amber-500/20 text-amber-300 shadow-xs'
                    : 'bg-white text-rose-950 shadow-xs font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Antiguo (39)
            </button>
            <button
              onClick={() => {
                setActiveTestament('NT');
                setBookFilterQuery('');
              }}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold tracking-wide transition-all ${
                activeTestament === 'NT'
                  ? isDark
                    ? 'bg-amber-500/20 text-amber-300 shadow-xs'
                    : 'bg-white text-rose-950 shadow-xs font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Nuevo (27)
            </button>
          </div>

          {/* Quick Book Filter Input */}
          <div className="mt-2.5 relative">
            <Search className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-slate-500' : 'text-stone-400'
            }`} />
            <input
              type="text"
              value={bookFilterQuery}
              onChange={e => setBookFilterQuery(e.target.value)}
              placeholder={`Filtrar en ${activeTestament === 'AT' ? 'Antiguo' : 'Nuevo'} Testamento...`}
              className={`w-full pl-8 pr-7 py-1.5 rounded-md text-xs focus:outline-none border transition-colors ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-amber-400'
                  : 'bg-white border-stone-200 text-stone-900 placeholder:text-stone-400 focus:border-rose-900'
              }`}
            />
            {bookFilterQuery && (
              <button
                onClick={() => setBookFilterQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-stone-400 hover:text-stone-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Book List */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-4">
          {Object.entries(groupedBooks).map(([category, books]) => (
            <div key={category} className="space-y-1">
              {/* Category subheader */}
              <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-stone-600 dark:text-slate-400 flex items-center justify-between">
                <span>{category}</span>
                <span className="text-[10px] opacity-80">{books.length}</span>
              </div>

              {/* Books */}
              <div className="space-y-0.5">
                {books.map(b => {
                  const isSelected = b.name === selectedBook;
                  return (
                    <button
                      key={b.id}
                      onClick={() => {
                        onSelectBook(b.name);
                        onCloseMobile();
                      }}
                      className={`w-full px-2.5 py-2 rounded-lg text-left text-xs font-medium flex items-center justify-between transition-colors ${
                        isSelected
                          ? isDark
                            ? 'bg-slate-800 text-amber-300 font-semibold shadow-xs'
                            : 'bg-rose-900 text-white font-semibold shadow-xs'
                          : isDark
                          ? 'hover:bg-slate-800/60 text-slate-300'
                          : 'hover:bg-stone-200/70 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-5 text-right font-mono text-[11px] tabular-nums shrink-0 ${
                          isSelected
                            ? isDark ? 'text-amber-400' : 'text-rose-200'
                            : isDark ? 'text-slate-500' : 'text-stone-400'
                        }`}>
                          {b.id}
                        </span>
                        <span className="truncate">{b.name}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] tabular-nums ${
                          isSelected
                            ? isDark ? 'text-amber-200/80' : 'text-rose-100'
                            : isDark ? 'text-slate-400' : 'text-stone-500'
                        }`}>
                          {b.chapters} {b.name === 'Salmos' ? 'salmos' : 'caps'}
                        </span>
                        <ChevronRight className={`w-3.5 h-3.5 ${
                          isSelected
                            ? isDark ? 'text-amber-300' : 'text-white'
                            : 'opacity-40'
                        }`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredBooks.length === 0 && (
            <div className="text-center py-8 text-xs text-stone-500 dark:text-slate-400">
              No se encontraron libros que coincidan con &quot;{bookFilterQuery}&quot;.
            </div>
          )}
        </div>

        {/* Sidebar Footer with Bookmarks quick link */}
        <div className={`p-3 border-t flex items-center justify-between text-xs ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-stone-200 bg-stone-100/60'
        }`}>
          <button
            onClick={() => {
              onOpenBookmarks();
              onCloseMobile();
            }}
            className={`flex items-center gap-2 py-1.5 px-3 rounded-lg w-full font-medium transition-colors ${
              isDark
                ? 'hover:bg-slate-800 text-slate-300'
                : 'hover:bg-stone-200 text-stone-700'
            }`}
          >
            <BookmarkIcon className="w-3.5 h-3.5 text-rose-900 dark:text-amber-400" />
            <span>Versículos Guardados</span>
            {bookmarkCount > 0 && (
              <span className={`ml-auto px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isDark ? 'bg-amber-400/20 text-amber-300' : 'bg-rose-900 text-white'
              }`}>
                {bookmarkCount}
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
