/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TopHeader } from './components/TopHeader';
import { SidebarNav } from './components/SidebarNav';
import { BibleReader } from './components/BibleReader';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { BookmarksModal } from './components/BookmarksModal';
import { DailyVerseModal } from './components/DailyVerseModal';
import { initBibleService, subscribeToLoadState } from './data/bibleService';
import { ReaderSettings, Bookmark, Verse, VerseRange } from './types';

export default function App() {
  // Navigation state
  const [currentBook, setCurrentBook] = useState<string>(() => {
    return localStorage.getItem('rvr1960_book') || 'Génesis';
  });
  const [currentChapter, setCurrentChapter] = useState<number>(() => {
    const saved = localStorage.getItem('rvr1960_chapter');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [highlightedRange, setHighlightedRange] = useState<VerseRange | null>(null);

  // Settings
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    const saved = localStorage.getItem('rvr1960_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      fontSize: 18,
      theme: 'light',
      lineHeight: 'relaxed',
      showTitles: true,
      verseByVerse: false,
    };
  });

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('rvr1960_bookmarks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  // Modals & Drawers
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isDailyVerseOpen, setIsDailyVerseOpen] = useState(false);
  const [isBibleReady, setIsBibleReady] = useState(false);

  // Initialize Bible service
  useEffect(() => {
    initBibleService();
    const unsubscribe = subscribeToLoadState((ready) => {
      setIsBibleReady(ready);
    });
    return unsubscribe;
  }, []);

  // Save navigation position to localStorage
  useEffect(() => {
    localStorage.setItem('rvr1960_book', currentBook);
    localStorage.setItem('rvr1960_chapter', currentChapter.toString());
  }, [currentBook, currentChapter]);

  // Save settings
  useEffect(() => {
    localStorage.setItem('rvr1960_settings', JSON.stringify(settings));
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-[#1E293B] text-slate-100 antialiased selection:bg-amber-400/20 selection:text-amber-200';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-[#FBF9F5] text-stone-900 antialiased selection:bg-rose-900/20 selection:text-rose-950';
    }
  }, [settings]);

  // Save bookmarks
  useEffect(() => {
    localStorage.setItem('rvr1960_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K to search, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '/' && !isInput && !isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Handle Book Selection (starting automatically at Chapter 1 as specified in prompt)
  const handleSelectBook = useCallback((bookName: string) => {
    setCurrentBook(bookName);
    setCurrentChapter(1);
    setHighlightedRange(null);
  }, []);

  // Handle Chapter & Verse navigation
  const handleNavigateChapter = useCallback((book: string, chapter: number, range?: VerseRange | null) => {
    setCurrentBook(book);
    setCurrentChapter(chapter);
    setHighlightedRange(range || null);
  }, []);

  // Handle Verse Selection from Search, Passage Lookup, or Bookmarks
  const handleSelectVerse = useCallback((book: string, chapter: number, startVerse: number, endVerse?: number) => {
    setCurrentBook(book);
    setCurrentChapter(chapter);
    setHighlightedRange({ start: startVerse, end: endVerse && endVerse >= startVerse ? endVerse : startVerse });
  }, []);

  // Update Settings
  const handleUpdateSettings = useCallback((newSettings: Partial<ReaderSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Toggle Theme
  const handleToggleTheme = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  }, []);

  // Bookmark Toggle
  const handleToggleBookmark = useCallback((verse: Verse) => {
    setBookmarks(prev => {
      const exists = prev.some(
        b => b.book === verse.book && b.chapter === verse.chapter && b.verse === verse.verse
      );
      if (exists) {
        return prev.filter(
          b => !(b.book === verse.book && b.chapter === verse.chapter && b.verse === verse.verse)
        );
      } else {
        return [
          {
            book: verse.book,
            chapter: verse.chapter,
            verse: verse.verse,
            text: verse.text,
            savedAt: Date.now()
          },
          ...prev
        ];
      }
    });
  }, []);

  const handleRemoveBookmark = useCallback((book: string, chapter: number, verse: number) => {
    setBookmarks(prev => prev.filter(
      b => !(b.book === book && b.chapter === chapter && b.verse === verse)
    ));
  }, []);

  const isDark = settings.theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-sans ${isDark ? 'dark bg-[#1E293B] text-slate-100' : 'bg-[#FBF9F5] text-stone-900'}`}>
      {/* Top Header Bar */}
      <TopHeader
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenSearch={(initial) => {
          setSearchInitialQuery(initial || '');
          setIsSearchOpen(true);
        }}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        bookmarkCount={bookmarks.length}
        theme={settings.theme}
        onToggleTheme={handleToggleTheme}
        onOpenDailyVerse={() => setIsDailyVerseOpen(true)}
      />

      {/* Main Split Layout: Sidebar Navigation + Bible Reader Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 1. SIDEBAR NAVIGATION (Left Panel) */}
        <SidebarNav
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          selectedBook={currentBook}
          onSelectBook={handleSelectBook}
          theme={settings.theme}
          onOpenBookmarks={() => setIsBookmarksOpen(true)}
          bookmarkCount={bookmarks.length}
        />

        {/* 2. MAIN BIBLE READER PANEL */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <BibleReader
            currentBook={currentBook}
            currentChapter={currentChapter}
            highlightedRange={highlightedRange}
            onNavigateChapter={handleNavigateChapter}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            theme={settings.theme}
            onToggleTheme={handleToggleTheme}
          />
        </main>
      </div>

      {/* 3. GLOBAL SMART SEARCH MODAL */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectVerse={handleSelectVerse}
        initialQuery={searchInitialQuery}
        theme={settings.theme}
        currentBookName={currentBook}
        currentChapterNum={currentChapter}
      />

      {/* Bookmarks Modal */}
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectVerse={handleSelectVerse}
        onRemoveBookmark={handleRemoveBookmark}
        theme={settings.theme}
      />

      {/* Daily Verse Modal */}
      <DailyVerseModal
        isOpen={isDailyVerseOpen}
        onClose={() => setIsDailyVerseOpen(false)}
        onNavigateToVerse={handleSelectVerse}
        theme={settings.theme}
      />
    </div>
  );
}
