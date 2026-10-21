import React from 'react';

interface HighlightedTextProps {
  text: string;
  query: string;
  className?: string;
}

export const HighlightedText: React.FC<HighlightedTextProps> = React.memo(({ text, query, className = '' }) => {
  if (!query || !query.trim() || !text) {
    return <span className={className}>{text}</span>;
  }

  // Extract query words (minimum 2 chars)
  const cleanQuery = query.trim().replace(/[«»""''.,;:!¡?¿\-—_()[\]{}*#~`^/\\]/g, ' ');
  const words = cleanQuery
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length >= 2);

  if (words.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Create fast regex pattern escaping special chars
  const escaped = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  // Match exact phrase first if multiple words, or individual words
  const phrase = words.join('\\s+');
  let pattern: RegExp;
  try {
    pattern = new RegExp(`(${phrase}|${escaped.join('|')})`, 'gi');
  } catch (e) {
    return <span className={className}>{text}</span>;
  }

  const parts = text.split(pattern);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        // Quick check if part matches any word
        const lowerPart = part.toLowerCase();
        const isMatched = words.some(w => w.toLowerCase() === lowerPart) ||
          lowerPart === cleanQuery.toLowerCase();

        if (isMatched) {
          return (
            <mark
              key={index}
              className="bg-amber-200/95 dark:bg-amber-400 dark:text-slate-950 text-stone-900 font-semibold px-0.5 rounded-xs"
            >
              {part}
            </mark>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
});
