import React from 'react';
import { Bookmark, X, Trash2, ArrowRight, BookOpen, Copy, Check } from 'lucide-react';
import { Bookmark as BookmarkType } from '../types';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkType[];
  onSelectVerse: (book: string, chapter: number, verse: number) => void;
  onRemoveBookmark: (book: string, chapter: number, verse: number) => void;
  theme: string;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onSelectVerse,
  onRemoveBookmark,
  theme
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const handleCopy = (b: BookmarkType) => {
    const text = `"${b.text}" — ${b.book} ${b.chapter}:${b.verse} (RVR1960)`;
    navigator.clipboard.writeText(text);
    const id = `${b.book}-${b.chapter}-${b.verse}`;
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Versículos Guardados"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-xl rounded-xl shadow-2xl border overflow-hidden flex flex-col max-h-[80vh] ${
          isDark
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-[#FBF9F5] border-stone-300 text-stone-900'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`p-4 border-b flex items-center justify-between ${
          isDark ? 'border-slate-800' : 'border-stone-200'
        }`}>
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-rose-900 dark:text-amber-400" />
            <h2 className="font-display font-bold text-base">
              Versículos Guardados ({bookmarks.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-stone-200 dark:hover:bg-slate-800 text-stone-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {bookmarks.length === 0 ? (
            <div className="py-12 text-center text-stone-500">
              <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="font-medium text-sm">No tienes versículos guardados aún</p>
              <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                Pasa el cursor o pulsa sobre cualquier versículo durante la lectura y toca el icono de marcador para guardarlo aquí.
              </p>
            </div>
          ) : (
            bookmarks.map(b => {
              const id = `${b.book}-${b.chapter}-${b.verse}`;
              const isCopied = copiedId === id;

              return (
                <div
                  key={id}
                  className={`p-3.5 rounded-lg border transition-colors flex flex-col gap-2 ${
                    isDark
                      ? 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                      : 'bg-white border-stone-200 hover:border-stone-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        onSelectVerse(b.book, b.chapter, b.verse);
                        onClose();
                      }}
                      className="font-display font-bold text-sm text-rose-900 dark:text-amber-400 hover:underline flex items-center gap-1.5"
                    >
                      <span>{b.book} {b.chapter}:{b.verse}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(b)}
                        className={`p-1.5 rounded hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-400 transition-colors ${
                          isCopied ? 'text-emerald-500' : ''
                        }`}
                        title="Copiar texto"
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => onRemoveBookmark(b.book, b.chapter, b.verse)}
                        className="p-1.5 rounded hover:bg-rose-100 dark:hover:bg-rose-950/50 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                        title="Eliminar de guardados"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-reader italic text-stone-700 dark:text-slate-300 leading-relaxed">
                    &ldquo;{b.text}&rdquo;
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
