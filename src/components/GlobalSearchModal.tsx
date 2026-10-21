import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  BookOpen,
  Compass,
  ArrowRight,
  CornerDownLeft,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  BookMarked
} from 'lucide-react';
import {
  searchBible,
  getChapterVerses,
  getVerseCountForChapter,
  isBibleLoaded
} from '../data/bibleService';
import { SearchResult, Testament, VerseRange } from '../types';
import { BIBLE_BOOKS, OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS } from '../data/booksData';
import { HighlightedText } from './HighlightedText';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVerse: (book: string, chapter: number, startVerse: number, endVerse?: number) => void;
  initialQuery?: string;
  theme: string;
  currentBookName?: string;
  currentChapterNum?: number;
}

const POPULAR_SEARCHES = [
  'en el principio creo Dios los cielos y la tierra',
  'De tal manera',
  'Juan 3:16',
  'Jehová es mi pastor',
  'Todo lo puedo en Cristo',
  'Lámpara es a mis pies',
  'Salmos 23',
  'Amad a vuestros enemigos',
  'Génesis 1:1-5'
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectVerse,
  initialQuery = '',
  theme,
  currentBookName = 'Génesis',
  currentChapterNum = 1
}) => {
  // Modal view mode: 'text' (text/phrase search) or 'passage' (book/chapter/verse selector)
  const [activeTab, setActiveTab] = useState<'text' | 'passage'>('text');

  // Text search state with responsive 80ms debouncing
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [testamentFilter, setTestamentFilter] = useState<'ALL' | Testament>('ALL');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Debounce input typing so UI stays 100% fluid and responsive
  useEffect(() => {
    if (query !== debouncedQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setDebouncedQuery(query);
        setIsSearching(false);
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [query, debouncedQuery]);

  // Passage lookup state (Libro, Capítulo, Verso Desde, Verso Hasta)
  const [passageBook, setPassageBook] = useState(currentBookName);
  const [passageChapter, setPassageChapter] = useState(currentChapterNum);
  const [passageStartVerse, setPassageStartVerse] = useState(1);
  const [passageEndVerse, setPassageEndVerse] = useState<number | ''>('');
  const [previewVerses, setPreviewVerses] = useState<string[]>([]);

  // Selected book metadata
  const selectedBookMeta = BIBLE_BOOKS.find(b => b.name === passageBook) || BIBLE_BOOKS[0];
  const maxChapters = selectedBookMeta.chapters;
  const chapterVersesList = getChapterVerses(passageBook, passageChapter);
  const maxVerses = chapterVersesList.length > 0 ? chapterVersesList.length : getVerseCountForChapter(passageBook, passageChapter);

  // Update chapter if book changes and current chapter exceeds max
  useEffect(() => {
    if (passageChapter > maxChapters) {
      setPassageChapter(1);
    }
  }, [passageBook, maxChapters, passageChapter]);

  // Update verse range if exceeds max verses
  useEffect(() => {
    if (passageStartVerse > maxVerses) {
      setPassageStartVerse(1);
    }
    if (typeof passageEndVerse === 'number' && passageEndVerse > maxVerses) {
      setPassageEndVerse(maxVerses);
    }
  }, [passageChapter, maxVerses, passageStartVerse, passageEndVerse]);

  // Update passage preview
  useEffect(() => {
    if (activeTab !== 'passage') return;
    const vList = getChapterVerses(passageBook, passageChapter);
    if (vList.length === 0) {
      setPreviewVerses([]);
      return;
    }
    const end = typeof passageEndVerse === 'number' && passageEndVerse >= passageStartVerse
      ? passageEndVerse
      : passageStartVerse;

    const matched = vList.filter(v => v.verse >= passageStartVerse && v.verse <= end);
    setPreviewVerses(matched.map(v => `${v.verse}. ${v.text}`));
  }, [activeTab, passageBook, passageChapter, passageStartVerse, passageEndVerse]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setDebouncedQuery(initialQuery);
      setSelectedIndex(0);
      setTimeout(() => {
        if (activeTab === 'text') {
          inputRef.current?.focus();
          inputRef.current?.select();
        }
      }, 60);
    }
  }, [isOpen, initialQuery, activeTab]);

  // Execute search when debouncedQuery or testament filter changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setTotalCount(0);
      setIsSearching(false);
      return;
    }

    const { results: searchRes, totalCount: count } = searchBible(debouncedQuery, {
      testament: testamentFilter,
      limit: 50
    });

    setResults(searchRes);
    setTotalCount(count);
    setSelectedIndex(0);
    setIsSearching(false);
  }, [debouncedQuery, testamentFilter]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (activeTab === 'text') {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === 'Enter' && results.length > 0) {
          e.preventDefault();
          const selected = results[selectedIndex];
          if (selected) {
            onSelectVerse(selected.verse.book, selected.verse.chapter, selected.verse.verse);
            onClose();
          }
        }
      } else if (activeTab === 'passage' && e.key === 'Enter') {
        e.preventDefault();
        handleExecutePassageLookup();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeTab, results, selectedIndex, onClose, onSelectVerse]);

  // Scroll selected result into view
  useEffect(() => {
    if (!resultsContainerRef.current) return;
    const selectedEl = resultsContainerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  const handleExecutePassageLookup = () => {
    const end = typeof passageEndVerse === 'number' && passageEndVerse >= passageStartVerse
      ? passageEndVerse
      : passageStartVerse;

    onSelectVerse(passageBook, passageChapter, passageStartVerse, end);
    onClose();
  };

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Buscador de la Santa Biblia"
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-14 px-4 bg-stone-950/65 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-3xl rounded-xl shadow-2xl border overflow-hidden flex flex-col max-h-[88vh] transition-all transform ${
          isDark
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-[#FBF9F5] border-stone-300 text-stone-900'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Navigation Tabs between Text Search and Passage Lookup */}
        <div className={`flex items-center justify-between px-4 pt-3 pb-2 border-b ${
          isDark ? 'border-slate-800 bg-slate-950/50' : 'border-stone-200 bg-stone-100/70'
        }`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'text'
                  ? isDark
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-white text-rose-950 border border-stone-300 shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Búsqueda por Texto o Frase</span>
            </button>

            <button
              onClick={() => setActiveTab('passage')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'passage'
                  ? isDark
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-white text-rose-950 border border-stone-300 shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Búsqueda por Pasaje (Libro, Cap. y Versos)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-slate-200"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TAB 1: TEXT OR PHRASE SEARCH */}
        {activeTab === 'text' && (
          <>
            {/* Search Input Bar */}
            <div className={`p-4 border-b flex items-center gap-3 ${
              isDark ? 'border-slate-800 bg-slate-900/90' : 'border-stone-200 bg-white/70'
            }`}>
              <Search className={`w-5 h-5 shrink-0 ${isDark ? 'text-amber-400' : 'text-rose-900'}`} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Escribe una frase (ej. 'en el principio creo Dios') o cita (ej. Juan 3:16)..."
                className={`w-full bg-transparent text-base sm:text-lg focus:outline-none placeholder:text-stone-400 ${
                  isDark ? 'text-white placeholder:text-slate-500' : 'text-stone-900'
                }`}
              />
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-rose-900 dark:border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" title="Buscando..." />
              ) : query ? (
                <button
                  onClick={() => {
                    setQuery('');
                    setDebouncedQuery('');
                    inputRef.current?.focus();
                  }}
                  className={`p-1 rounded-md transition-colors ${
                    isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-stone-400 hover:text-stone-700 hover:bg-stone-200'
                  }`}
                  title="Borrar texto"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
            </div>

            {/* Filter bar & Result stats */}
            <div className={`px-4 py-2 border-b flex items-center justify-between text-xs gap-3 flex-wrap ${
              isDark ? 'border-slate-800 bg-slate-950/40 text-slate-400' : 'border-stone-200 bg-stone-100/60 text-stone-600'
            }`}>
              <div className="flex items-center gap-1">
                <span className="font-medium mr-1">Alcance:</span>
                <button
                  onClick={() => setTestamentFilter('ALL')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    testamentFilter === 'ALL'
                      ? (isDark ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'bg-rose-900 text-white font-semibold shadow-xs')
                      : (isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-stone-200 text-stone-600')
                  }`}
                >
                  Toda la Biblia
                </button>
                <button
                  onClick={() => setTestamentFilter('AT')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    testamentFilter === 'AT'
                      ? (isDark ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'bg-rose-900 text-white font-semibold shadow-xs')
                      : (isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-stone-200 text-stone-600')
                  }`}
                >
                  Antiguo Testamento
                </button>
                <button
                  onClick={() => setTestamentFilter('NT')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    testamentFilter === 'NT'
                      ? (isDark ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'bg-rose-900 text-white font-semibold shadow-xs')
                      : (isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-stone-200 text-stone-600')
                  }`}
                >
                  Nuevo Testamento
                </button>
              </div>

              <div className="text-xs font-mono">
                {query.trim() && (
                  <span>
                    {totalCount} {totalCount === 1 ? 'coincidencia' : 'coincidencias'}
                  </span>
                )}
              </div>
            </div>

            {/* Search Results List */}
            <div
              ref={resultsContainerRef}
              className="overflow-y-auto flex-1 divide-y divide-stone-200/50 dark:divide-slate-800 p-2 space-y-1"
            >
              {query.trim() === '' ? (
                /* Suggestions view when empty */
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-slate-400">
                    <Compass className="w-4 h-4 text-rose-900 dark:text-amber-400" />
                    <span>Búsquedas sugeridas y versículos célebres</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map(item => (
                      <button
                        key={item}
                        onClick={() => {
                          setQuery(item);
                          setDebouncedQuery(item);
                          inputRef.current?.focus();
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all border text-left flex items-center gap-2 ${
                          isDark
                            ? 'bg-slate-800/70 border-slate-700/80 hover:bg-slate-800 hover:border-amber-400/50 text-slate-300'
                            : 'bg-white border-stone-200 hover:border-rose-900/40 hover:bg-stone-50 text-stone-700 shadow-xs'
                        }`}
                      >
                        <span>{item}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 pt-4 border-t border-stone-200 dark:border-slate-800 text-xs text-stone-500 dark:text-slate-400 space-y-1.5">
                    <p>
                      <strong>Búsqueda avanzada:</strong> Puedes escribir frases exactas (ej. <em>&quot;en el principio creo Dios&quot;</em>), citas directas (ej. <em>&quot;Juan 3:16&quot;</em>, <em>&quot;Salmos 23&quot;</em>) o rangos de versículos (ej. <em>&quot;Génesis 1:1-5&quot;</em>).
                    </p>
                  </div>
                </div>
              ) : results.length === 0 ? (
                /* No results state */
                <div className="p-12 text-center">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-base font-medium">No se encontraron versículos</p>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                    No hay coincidencias para &quot;{query}&quot; en la versión Reina Valera 1960. Prueba a buscar en toda la Biblia o usa la pestaña <strong>Búsqueda por Pasaje</strong>.
                  </p>
                </div>
              ) : (
                /* Results list */
                results.map((result, idx) => {
                  const isSelected = idx === selectedIndex;
                  const { verse, matchType } = result;

                  return (
                    <div
                      key={`${verse.book}-${verse.chapter}-${verse.verse}`}
                      data-index={idx}
                      onClick={() => {
                        onSelectVerse(verse.book, verse.chapter, verse.verse);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors flex flex-col gap-1.5 ${
                        isSelected
                          ? isDark
                            ? 'bg-slate-800 border-l-2 border-l-amber-400 text-white'
                            : 'bg-rose-50/80 border-l-2 border-l-rose-900 text-stone-900 shadow-xs'
                          : isDark
                          ? 'hover:bg-slate-800/60 text-slate-300'
                          : 'hover:bg-stone-100/80 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm tracking-wide font-display text-rose-900 dark:text-amber-400">
                            {verse.book} {verse.chapter}:{verse.verse}
                          </span>
                          <span className="text-[11px] uppercase tracking-wider text-stone-500 dark:text-slate-400">
                            {verse.testament === 'AT' ? 'Antiguo Testamento' : 'Nuevo Testamento'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {matchType === 'reference' && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                              Cita directa
                            </span>
                          )}
                          {matchType === 'exact-phrase' && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                              Frase exacta
                            </span>
                          )}
                          {isSelected && (
                            <div className="hidden sm:flex items-center gap-1 text-[11px] opacity-70">
                              <span>Abrir versículo</span>
                              <CornerDownLeft className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </div>

                      {verse.title && (
                        <div className="text-xs font-semibold italic text-stone-600 dark:text-slate-300">
                          {verse.title}
                        </div>
                      )}

                      <p className="text-sm font-reader leading-relaxed">
                        <HighlightedText text={verse.text} query={query} />
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* TAB 2: PASSAGE LOOKUP (Libro, Capítulo, Versículo Desde -> Versículo Hasta) */}
        {activeTab === 'passage' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            <div className="border-b pb-4 dark:border-slate-800 border-stone-200">
              <h3 className="font-display font-bold text-base text-rose-950 dark:text-amber-400">
                Navegador de Citas y Pasajes Bíblicos
              </h3>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                Selecciona el libro, el capítulo y el rango de versículos que deseas consultar para saltar directamente a la lectura.
              </p>
            </div>

            {/* Selection Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* 1. Selector de Libro */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-slate-300">
                  1. Libro
                </label>
                <select
                  value={passageBook}
                  onChange={e => setPassageBook(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-sm font-medium focus:outline-none transition-colors ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                      : 'bg-white border-stone-300 text-stone-900 focus:border-rose-900 shadow-xs'
                  }`}
                >
                  <optgroup label="Antiguo Testamento (39 Libros)">
                    {OLD_TESTAMENT_BOOKS.map(b => (
                      <option key={b.id} value={b.name}>
                        {b.name} ({b.chapters} caps)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Nuevo Testamento (27 Libros)">
                    {NEW_TESTAMENT_BOOKS.map(b => (
                      <option key={b.id} value={b.name}>
                        {b.name} ({b.chapters} caps)
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* 2. Selector de Capítulo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-slate-300">
                  2. Capítulo (1 - {maxChapters})
                </label>
                <select
                  value={passageChapter}
                  onChange={e => setPassageChapter(parseInt(e.target.value, 10))}
                  className={`w-full p-2.5 rounded-lg border text-sm font-medium focus:outline-none transition-colors ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                      : 'bg-white border-stone-300 text-stone-900 focus:border-rose-900 shadow-xs'
                  }`}
                >
                  {Array.from({ length: maxChapters }, (_, i) => i + 1).map(ch => (
                    <option key={ch} value={ch}>
                      Capítulo {ch}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Selector de Versículo Desde */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-slate-300">
                  3. Versículo Desde
                </label>
                <input
                  type="number"
                  min={1}
                  max={maxVerses}
                  value={passageStartVerse}
                  onChange={e => {
                    const val = parseInt(e.target.value, 10);
                    setPassageStartVerse(isNaN(val) ? 1 : Math.max(1, Math.min(maxVerses, val)));
                  }}
                  className={`w-full p-2.5 rounded-lg border text-sm font-medium focus:outline-none transition-colors ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                      : 'bg-white border-stone-300 text-stone-900 focus:border-rose-900 shadow-xs'
                  }`}
                />
              </div>

              {/* 4. Selector de Versículo Hasta (Opcional) */}
              <div className="sm:col-span-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-slate-300">
                    4. Hasta Versículo (Opcional, para leer un pasaje)
                  </label>
                  {passageEndVerse !== '' && (
                    <button
                      type="button"
                      onClick={() => setPassageEndVerse('')}
                      className="text-xs text-rose-800 dark:text-amber-400 hover:underline"
                    >
                      Limpiar rango (sólo versículo {passageStartVerse})
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={passageStartVerse}
                    max={maxVerses}
                    placeholder={`Verso final (ej. ${Math.min(maxVerses, passageStartVerse + 4)})`}
                    value={passageEndVerse}
                    onChange={e => {
                      const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                      if (val === '') setPassageEndVerse('');
                      else setPassageEndVerse(Math.max(passageStartVerse, Math.min(maxVerses, val)));
                    }}
                    className={`flex-1 p-2.5 rounded-lg border text-sm font-medium focus:outline-none transition-colors ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                        : 'bg-white border-stone-300 text-stone-900 focus:border-rose-900 shadow-xs'
                    }`}
                  />
                  <div className="text-xs text-stone-500 dark:text-slate-400 shrink-0">
                    Total: {maxVerses} versículos en este capítulo
                  </div>
                </div>
              </div>
            </div>

            {/* Target Passage Summary Badge & Action Button */}
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-rose-50/70 border-rose-200'
            }`}>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-slate-400">
                  Pasaje seleccionado
                </span>
                <div className="font-display font-extrabold text-xl sm:text-2xl text-rose-950 dark:text-amber-400">
                  {passageBook} {passageChapter}:{passageStartVerse}
                  {typeof passageEndVerse === 'number' && passageEndVerse > passageStartVerse && `-${passageEndVerse}`}
                </div>
              </div>

              <button
                type="button"
                onClick={handleExecutePassageLookup}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-rose-900 hover:bg-rose-950'
                }`}
              >
                <span>Ir al Pasaje Bíblico</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Live Preview of selected verse(s) */}
            {previewVerses.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-slate-400">
                  Vista previa del texto:
                </span>
                <div className={`p-4 rounded-xl border max-h-48 overflow-y-auto font-reader text-sm leading-relaxed space-y-2 ${
                  isDark ? 'bg-slate-950/60 border-slate-800 text-slate-200' : 'bg-white border-stone-200 text-stone-800'
                }`}>
                  {previewVerses.map((pText, i) => (
                    <p key={i}>{pText}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className={`p-3 border-t text-xs flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-slate-950 text-slate-500' : 'border-stone-200 bg-stone-50 text-stone-500'
        }`}>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-xs border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px]">ENTER</kbd>
              <span>{activeTab === 'passage' ? 'Ir al pasaje' : 'Abrir selección'}</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded-xs border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px]">ESC</kbd>
              <span>Cerrar</span>
            </span>
          </div>

          <div className="font-serif italic text-xs">
            Santa Biblia Reina Valera 1960
          </div>
        </div>
      </div>
    </div>
  );
};
