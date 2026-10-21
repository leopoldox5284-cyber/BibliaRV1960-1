export type Testament = 'AT' | 'NT';

export interface Verse {
  book: string;
  testament: Testament;
  chapter: number;
  verse: number;
  text: string;
  title?: string;
}

export interface Book {
  id: number;
  name: string;
  testament: Testament;
  chapters: number;
  verseCount: number;
  category: string;
  abbreviations?: string[];
}

export interface SearchResult {
  verse: Verse;
  snippet: string;
  matchType: 'reference' | 'exact-phrase' | 'keywords' | 'partial';
  score: number;
}

export interface VerseRange {
  start: number;
  end: number;
}

export type ThemeMode = 'light' | 'dark' | 'sepia';

export interface ReaderSettings {
  fontSize: number; // 14 to 28
  theme: ThemeMode;
  lineHeight: 'relaxed' | 'loose' | 'normal';
  showTitles: boolean;
  verseByVerse: boolean;
}

export interface Bookmark {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  savedAt: number;
}
