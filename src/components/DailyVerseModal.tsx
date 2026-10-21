import React from 'react';
import { Sparkles, X, BookOpen, Share2, Copy, Check } from 'lucide-react';
import { getDailyVerse, getChapterVerses } from '../data/bibleService';
import { Verse } from '../types';

interface DailyVerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToVerse: (book: string, chapter: number, verse: number) => void;
  theme: string;
}

export const DailyVerseModal: React.FC<DailyVerseModalProps> = ({
  isOpen,
  onClose,
  onNavigateToVerse,
  theme
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const daily = getDailyVerse();
  const chapterVerses = getChapterVerses(daily.book, daily.chapter);
  const verseObj = chapterVerses.find(v => v.verse === daily.verse) || {
    book: daily.book,
    chapter: daily.chapter,
    verse: daily.verse,
    text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
    testament: 'NT' as const
  };

  const isDark = theme === 'dark';

  const handleCopy = () => {
    const text = `"${verseObj.text}" — ${verseObj.book} ${verseObj.chapter}:${verseObj.verse} (RVR1960)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Versículo del Día"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden p-6 sm:p-8 flex flex-col gap-6 text-center ${
          isDark
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-[#FBF9F5] border-stone-300 text-stone-900'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Versículo del Día</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-stone-200 dark:hover:bg-slate-800 text-stone-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 my-2">
          <blockquote className="font-reader text-lg sm:text-xl italic leading-relaxed text-stone-800 dark:text-slate-100">
            &ldquo;{verseObj.text}&rdquo;
          </blockquote>

          <div>
            <div className="font-display font-bold text-base text-rose-950 dark:text-amber-400">
              {verseObj.book} {verseObj.chapter}:{verseObj.verse}
            </div>
            <div className="text-xs text-stone-500 dark:text-slate-400 font-serif">
              Reina Valera 1960 · {daily.theme}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-4 border-t border-stone-200 dark:border-slate-800">
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
              copied
                ? 'bg-emerald-50 text-emerald-600 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400'
                : isDark
                ? 'border-slate-700 hover:bg-slate-800 text-slate-200'
                : 'border-stone-300 hover:bg-stone-100 text-stone-700'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>

          <button
            onClick={() => {
              onNavigateToVerse(verseObj.book, verseObj.chapter, verseObj.verse);
              onClose();
            }}
            className={`px-5 py-2 rounded-lg text-xs font-bold text-white shadow-xs transition-colors ${
              isDark ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' : 'bg-rose-900 hover:bg-rose-950'
            }`}
          >
            Leer en contexto
          </button>
        </div>
      </div>
    </div>
  );
};
