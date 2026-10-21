import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Type,
  Sun,
  Moon,
  Copy,
  Check,
  Bookmark as BookmarkIcon,
  AlignLeft,
  ListOrdered,
  BookOpen,
  Share2,
  Grid
} from 'lucide-react';
import { Verse, Book, ReaderSettings } from '../types';
import {
  getChapterVerses,
  getNextChapter,
  getPreviousChapter,
  searchBible
} from '../data/bibleService';
import { BIBLE_BOOKS, normalizeSearchStr } from '../data/booksData';
import { HighlightedText } from './HighlightedText';
import { VerseRange } from '../types';

interface BibleReaderProps {
  currentBook: string;
  currentChapter: number;
  highlightedRange: VerseRange | null;
  onNavigateChapter: (book: string, chapter: number, range?: VerseRange | null) => void;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
  bookmarks: Array<{ book: string; chapter: number; verse: number }>;
  onToggleBookmark: (verse: Verse) => void;
  theme: string;
  onToggleTheme: () => void;
}

export const BibleReader: React.FC<BibleReaderProps> = ({
  currentBook,
  currentChapter,
  highlightedRange,
  onNavigateChapter,
  settings,
  onUpdateSettings,
  bookmarks,
  onToggleBookmark,
  theme,
  onToggleTheme
}) => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [inBookQuery, setInBookQuery] = useState('');
  const [isInBookSearchOpen, setIsInBookSearchOpen] = useState(false);
  const [inBookMatches, setInBookMatches] = useState<number[]>([]); // matching verse numbers
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);
  const [isChapterPickerOpen, setIsChapterPickerOpen] = useState(false);
  const [copiedVerseNum, setCopiedVerseNum] = useState<number | null>(null);

  const verseRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const chapterPickerRef = useRef<HTMLDivElement>(null);
  const inBookInputRef = useRef<HTMLInputElement>(null);

  const bookMeta = BIBLE_BOOKS.find(b => b.name === currentBook);
  const totalChapters = bookMeta?.chapters || 1;

  // Load chapter verses
  useEffect(() => {
    const list = getChapterVerses(currentBook, currentChapter);
    setVerses(list);
    setInBookQuery('');
    setInBookMatches([]);
    setIsInBookSearchOpen(false);
  }, [currentBook, currentChapter]);

  // Handle in-book search
  useEffect(() => {
    if (!inBookQuery.trim()) {
      setInBookMatches([]);
      setActiveMatchIndex(0);
      return;
    }

    const clean = normalizeSearchStr(inBookQuery);
    const matches: number[] = [];

    verses.forEach(v => {
      const matchText = normalizeSearchStr(v.text).includes(clean);
      const matchTitle = v.title && normalizeSearchStr(v.title).includes(clean);
      if (matchText || matchTitle) {
        matches.push(v.verse);
      }
    });

    setInBookMatches(matches);
    setActiveMatchIndex(0);

    // Scroll to first match if any
    if (matches.length > 0) {
      const firstEl = verseRefs.current.get(matches[0]);
      firstEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [inBookQuery, verses]);

  // Scroll to highlighted verse when changed (from global search, passage lookup or bookmarks)
  useEffect(() => {
    if (highlightedRange) {
      const timer = setTimeout(() => {
        const el = verseRefs.current.get(highlightedRange.start);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [highlightedRange, verses]);

  // Close chapter picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chapterPickerRef.current && !chapterPickerRef.current.contains(e.target as Node)) {
        setIsChapterPickerOpen(false);
      }
    };
    if (isChapterPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isChapterPickerOpen]);

  const handleNextMatch = () => {
    if (inBookMatches.length === 0) return;
    const nextIdx = (activeMatchIndex + 1) % inBookMatches.length;
    setActiveMatchIndex(nextIdx);
    const verseNum = inBookMatches[nextIdx];
    verseRefs.current.get(verseNum)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handlePrevMatch = () => {
    if (inBookMatches.length === 0) return;
    const prevIdx = (activeMatchIndex - 1 + inBookMatches.length) % inBookMatches.length;
    setActiveMatchIndex(prevIdx);
    const verseNum = inBookMatches[prevIdx];
    verseRefs.current.get(verseNum)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleCopyVerse = (verse: Verse) => {
    const quote = `"${verse.text}"\n— ${verse.book} ${verse.chapter}:${verse.verse} (Reina Valera 1960)`;
    navigator.clipboard.writeText(quote);
    setCopiedVerseNum(verse.verse);
    setTimeout(() => setCopiedVerseNum(null), 2000);
  };

  const prevNav = getPreviousChapter(currentBook, currentChapter);
  const nextNav = getNextChapter(currentBook, currentChapter);

  const isDark = theme === 'dark';

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* 2. MAIN BIBLE READER PANEL: Header / Selector Bar */}
      <header className={`px-4 sm:px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-[#FBF9F5] border-stone-200'
      }`}>
        {/* Left: Book title & Chapter Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative" ref={chapterPickerRef}>
            <button
              onClick={() => setIsChapterPickerOpen(!isChapterPickerOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold transition-all ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700 text-white hover:border-amber-400/50'
                  : 'bg-white border-stone-300 text-stone-900 hover:border-rose-900/50 shadow-xs'
              }`}
              title="Cambiar capítulo"
            >
              <span className="font-display text-base font-bold text-rose-900 dark:text-amber-400">
                {currentBook}
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-slate-700 font-mono text-xs">
                Cap. {currentChapter}
              </span>
              <Grid className="w-3.5 h-3.5 opacity-60 ml-0.5" />
            </button>

            {/* Chapter Selection Dropdown / Grid Picker */}
            {isChapterPickerOpen && (
              <div className={`absolute top-full left-0 mt-2 p-3 rounded-xl border shadow-xl z-50 w-72 sm:w-80 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 ${
                isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-stone-300'
              }`}>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200 dark:border-slate-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400">
                    Seleccionar Capítulo ({totalChapters})
                  </span>
                  <button
                    onClick={() => setIsChapterPickerOpen(false)}
                    className="p-1 rounded hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {Array.from({ length: totalChapters }, (_, i) => i + 1).map(ch => {
                    const isCurrent = ch === currentChapter;
                    return (
                      <button
                        key={ch}
                        onClick={() => {
                          onNavigateChapter(currentBook, ch, null);
                          setIsChapterPickerOpen(false);
                        }}
                        className={`h-9 rounded-md text-xs font-semibold font-mono tabular-nums transition-colors flex items-center justify-center ${
                          isCurrent
                            ? isDark
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : 'bg-rose-900 text-white font-bold'
                            : isDark
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                        }`}
                      >
                        {ch}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick prev/next chapter buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => prevNav && onNavigateChapter(prevNav.book, prevNav.chapter, null)}
              disabled={!prevNav}
              className={`p-1.5 rounded-lg border transition-colors ${
                !prevNav
                  ? 'opacity-30 cursor-not-allowed border-transparent'
                  : isDark
                  ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                  : 'border-stone-200 hover:bg-stone-200/70 text-stone-700'
              }`}
              title={prevNav ? `Capítulo anterior (${prevNav.book} ${prevNav.chapter})` : undefined}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => nextNav && onNavigateChapter(nextNav.book, nextNav.chapter, null)}
              disabled={!nextNav}
              className={`p-1.5 rounded-lg border transition-colors ${
                !nextNav
                  ? 'opacity-30 cursor-not-allowed border-transparent'
                  : isDark
                  ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                  : 'border-stone-200 hover:bg-stone-200/70 text-stone-700'
              }`}
              title={nextNav ? `Siguiente capítulo (${nextNav.book} ${nextNav.chapter})` : undefined}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: In-Book Search & Typography Controls */}
        <div className="flex items-center gap-2">
          {/* In-Book Search Bar Toggle & Input */}
          {isInBookSearchOpen ? (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-stone-300 shadow-xs'
            }`}>
              <Search className="w-3.5 h-3.5 text-stone-400" />
              <input
                ref={inBookInputRef}
                type="text"
                value={inBookQuery}
                onChange={e => setInBookQuery(e.target.value)}
                placeholder={`Buscar en ${currentBook}...`}
                className="w-32 sm:w-48 bg-transparent text-xs focus:outline-none"
              />
              {inBookMatches.length > 0 && (
                <div className="flex items-center gap-1 text-[11px] font-mono tabular-nums text-stone-500">
                  <span>{activeMatchIndex + 1}/{inBookMatches.length}</span>
                  <button onClick={handlePrevMatch} className="p-0.5 hover:text-stone-900 dark:hover:text-white">
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button onClick={handleNextMatch} className="p-0.5 hover:text-stone-900 dark:hover:text-white">
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
              <button
                onClick={() => {
                  setIsInBookSearchOpen(false);
                  setInBookQuery('');
                }}
                className="p-0.5 rounded text-stone-400 hover:text-stone-700 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsInBookSearchOpen(true);
                setTimeout(() => inBookInputRef.current?.focus(), 50);
              }}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isDark
                  ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                  : 'border-stone-200 hover:bg-stone-200/70 text-stone-700'
              }`}
              title={`Buscar palabras dentro de ${currentBook}`}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">En {currentBook}</span>
            </button>
          )}

          {/* Reading Mode Toggle (Paragraph vs Verse-by-verse) */}
          <button
            onClick={() => onUpdateSettings({ verseByVerse: !settings.verseByVerse })}
            className={`p-1.5 rounded-lg border transition-colors ${
              isDark
                ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                : 'border-stone-200 hover:bg-stone-200/70 text-stone-700'
            }`}
            title={settings.verseByVerse ? 'Cambiar a modo continuo' : 'Cambiar a versículo por versículo'}
          >
            {settings.verseByVerse ? (
              <ListOrdered className="w-4 h-4 text-rose-900 dark:text-amber-400" />
            ) : (
              <AlignLeft className="w-4 h-4" />
            )}
          </button>

          {/* Font Size Adjusters */}
          <div className={`flex items-center rounded-lg border overflow-hidden ${
            isDark ? 'border-slate-800 bg-slate-800/40' : 'border-stone-200 bg-white'
          }`}>
            <button
              onClick={() => onUpdateSettings({ fontSize: Math.max(14, settings.fontSize - 1) })}
              className={`px-2 py-1 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors ${
                settings.fontSize <= 14 ? 'opacity-30 cursor-not-allowed' : ''
              }`}
              title="Disminuir tamaño de letra"
            >
              A-
            </button>
            <span className="px-1.5 text-[11px] font-mono tabular-nums text-stone-500">
              {settings.fontSize}
            </span>
            <button
              onClick={() => onUpdateSettings({ fontSize: Math.min(26, settings.fontSize + 1) })}
              className={`px-2 py-1 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors ${
                settings.fontSize >= 26 ? 'opacity-30 cursor-not-allowed' : ''
              }`}
              title="Aumentar tamaño de letra"
            >
              A+
            </button>
          </div>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={onToggleTheme}
            className={`p-1.5 rounded-lg border transition-colors ${
              isDark
                ? 'border-slate-800 hover:bg-slate-800 text-amber-400'
                : 'border-stone-200 hover:bg-stone-200/70 text-stone-700'
            }`}
            title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            aria-label="Alternar tema claro y oscuro"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Reading Canvas */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Chapter Opening Header */}
          <div className="text-center mb-8 pb-6 border-b border-stone-200 dark:border-slate-800">
            <span className="text-xs uppercase tracking-widest font-semibold text-stone-500 dark:text-slate-400">
              {bookMeta?.testament === 'AT' ? 'Antiguo Testamento' : 'Nuevo Testamento'} · {bookMeta?.category}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mt-2 text-rose-950 dark:text-amber-300">
              {currentBook} {currentChapter}
            </h1>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-1 font-serif italic">
              Reina Valera 1960 (RVR1960)
            </p>
          </div>

          {/* Verses Container */}
          <div
            className={`font-reader transition-all ${
              settings.verseByVerse ? 'space-y-4' : 'leading-relaxed space-y-3'
            }`}
            style={{
              fontSize: `${settings.fontSize}px`,
              lineHeight: settings.lineHeight === 'loose' ? 1.85 : settings.lineHeight === 'relaxed' ? 1.7 : 1.55
            }}
          >
            {verses.map((verse) => {
              const isHighlighted = highlightedRange
                ? verse.verse >= highlightedRange.start && verse.verse <= highlightedRange.end
                : false;
              const isMatch = inBookMatches.includes(verse.verse);
              const isActiveMatch = inBookMatches[activeMatchIndex] === verse.verse;
              const isBookmarked = bookmarks.some(
                b => b.book === verse.book && b.chapter === verse.chapter && b.verse === verse.verse
              );
              const isCopied = copiedVerseNum === verse.verse;

              return (
                <div
                  key={verse.verse}
                  ref={el => {
                    if (el) verseRefs.current.set(verse.verse, el);
                    else verseRefs.current.delete(verse.verse);
                  }}
                  id={`verse-${verse.verse}`}
                  className={`group relative rounded-lg px-2.5 py-1.5 transition-all duration-300 ${
                    isHighlighted
                      ? 'highlight-pulse ring-2 ring-amber-400 dark:ring-amber-500 rounded-lg'
                      : isActiveMatch
                      ? 'bg-amber-100/80 dark:bg-amber-950/40 ring-1 ring-amber-400'
                      : isMatch
                      ? 'bg-amber-50/60 dark:bg-amber-950/20'
                      : 'hover:bg-stone-200/30 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {/* Section Title (Pericope) if present */}
                  {verse.title && (
                    <h3 className="font-display font-bold text-base sm:text-lg mb-2 mt-4 text-stone-800 dark:text-slate-200 italic">
                      {verse.title}
                    </h3>
                  )}

                  <div className="flex items-start gap-2">
                    {/* Verse Number */}
                    <span className={`select-none font-bold font-mono text-xs pt-1 shrink-0 tabular-nums ${
                      isHighlighted || isActiveMatch
                        ? 'text-amber-600 dark:text-amber-300'
                        : isDark
                        ? 'text-slate-400'
                        : 'text-rose-900 font-extrabold'
                    }`}>
                      {verse.verse}
                    </span>

                    {/* Verse Text with Highlight capability */}
                    <p className="flex-1 text-stone-800 dark:text-slate-100">
                      {inBookQuery ? (
                        <HighlightedText text={verse.text} query={inBookQuery} />
                      ) : (
                        verse.text
                      )}
                    </p>

                    {/* Floating Verse Action Buttons (Copy, Bookmark) */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 pt-0.5">
                      <button
                        onClick={() => handleCopyVerse(verse)}
                        className={`p-1 rounded-md transition-colors ${
                          isCopied
                            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                            : isDark
                            ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                            : 'hover:bg-stone-200 text-stone-500 hover:text-stone-900'
                        }`}
                        title={isCopied ? '¡Copiado!' : 'Copiar versículo'}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => onToggleBookmark(verse)}
                        className={`p-1 rounded-md transition-colors ${
                          isBookmarked
                            ? 'text-rose-900 dark:text-amber-400'
                            : isDark
                            ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                            : 'hover:bg-stone-200 text-stone-500 hover:text-stone-900'
                        }`}
                        title={isBookmarked ? 'Quitar marcador' : 'Guardar versículo'}
                      >
                        <BookmarkIcon className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {verses.length === 0 && (
              <div className="py-12 text-center text-stone-500">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>Cargando texto de las Sagradas Escrituras...</p>
              </div>
            )}
          </div>

          {/* Chapter Navigation Footer */}
          <div className="mt-12 pt-8 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between gap-4">
            {prevNav ? (
              <button
                onClick={() => onNavigateChapter(prevNav.book, prevNav.chapter, null)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  isDark
                    ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
                    : 'border-stone-200 bg-white hover:bg-stone-100 text-stone-700 shadow-xs'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-[10px] uppercase text-stone-500 dark:text-slate-400">Anterior</div>
                  <div className="font-semibold">{prevNav.book} {prevNav.chapter}</div>
                </div>
              </button>
            ) : <div />}

            {nextNav && (
              <button
                onClick={() => onNavigateChapter(nextNav.book, nextNav.chapter, null)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-colors ml-auto ${
                  isDark
                    ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
                    : 'border-stone-200 bg-white hover:bg-stone-100 text-stone-700 shadow-xs'
                }`}
              >
                <div className="text-right">
                  <div className="text-[10px] uppercase text-stone-500 dark:text-slate-400">Siguiente</div>
                  <div className="font-semibold">{nextNav.book} {nextNav.chapter}</div>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
