import { Verse, SearchResult, Testament, VerseRange } from '../types';
import { BIBLE_BOOKS, findBookByNameOrAbbr, normalizeSearchStr } from './booksData';

export interface IndexedVerse extends Verse {
  _norm?: string;
}

// Initial preloaded chapter (Génesis 1) with clean title only at verse 1
const INITIAL_GENESIS_1: IndexedVerse[] = [
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 1, text: 'En el principio creó Dios los cielos y la tierra.', title: 'La Creación', _norm: 'en el principio creo dios los cielos y la tierra' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 2, text: 'Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la faz del abismo, y el Espíritu de Dios se movía sobre la faz de las aguas.', _norm: 'y la tierra estaba desordenada y vacia y las tinieblas estaban sobre la faz del abismo y el espiritu de dios se movia sobre la faz de las aguas' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 3, text: 'Y dijo Dios: Sea la luz; y fue la luz.', _norm: 'y dijo dios sea la luz y fue la luz' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 4, text: 'Y vio Dios que la luz era buena; y separó Dios la luz de las tinieblas.', _norm: 'y vio dios que la luz era buena y separo dios la luz de las tinieblas' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 5, text: 'Y llamó Dios a la luz Día, y a las tinieblas llamó Noche. Y fue la tarde y la mañana un día.', _norm: 'y llamo dios a la luz dia y a las tinieblas llamo noche y fue la tarde y la manana un dia' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 6, text: 'Luego dijo Dios: Haya expansión en medio de las aguas, y separe las aguas de las aguas.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 7, text: 'E hizo Dios la expansión, y separó las aguas que estaban debajo de la expansión, de las aguas que estaban sobre la expansión. Y fue así.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 8, text: 'Y llamó Dios a la expansión Cielos. Y fue la tarde y la mañana el día segundo.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 9, text: 'Dijo también Dios: Júntense las aguas que están debajo de los cielos en un lugar, y descúbrase lo seco. Y fue así.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 10, text: 'Y llamó Dios a lo seco Tierra, y a la reunión de las aguas llamó Mares. Y vio Dios que era bueno.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 11, text: 'Después dijo Dios: Produzca la tierra hierba verde, hierba que dé semilla; árbol de fruto que dé fruto según su género, que su semilla esté en él, sobre la tierra. Y fue así.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 12, text: 'Produjo, pues, la tierra hierba verde, hierba que da semilla según su naturaleza, y árbol que da fruto, cuya semilla está en él, según su género. Y vio Dios que era bueno.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 13, text: 'Y fue la tarde y la mañana el día tercero.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 14, text: 'Dijo luego Dios: Haya lumbreras en la expansión de los cielos para separar el día de la noche; y sirvan de señales para las estaciones, para días y años,' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 15, text: 'y sean por lumbreras en la expansión de los cielos para alumbrar sobre la tierra. Y fue así.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 16, text: 'E hizo Dios las dos grandes lumbreras; la lumbrera mayor para que señorease en el día, y la lumbrera menor para que señorease en la noche; hizo también las estrellas.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 17, text: 'Y las puso Dios en la expansión de los cielos para alumbrar sobre la tierra,' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 18, text: 'y para señorear en el día y en la noche, y para separar la luz de las tinieblas. Y vio Dios que era bueno.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 19, text: 'Y fue la tarde y la mañana el día cuarto.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 20, text: 'Dijo Dios: Produzcan las aguas seres vivientes, y aves que vuelen sobre la tierra, en la abierta expansión de los cielos.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 21, text: 'Y creó Dios los grandes monstruos marinos, y todo ser viviente que se mueve, que las aguas produjeron según su género, y toda ave alada según su especie. Y vio Dios que era bueno.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 22, text: 'Y Dios los bendijo, diciendo: Fructificad y multiplicaos, y llenad las aguas en los mares, y multiplíquense las aves en la tierra.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 23, text: 'Y fue la tarde y la mañana el día quinto.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 24, text: 'Luego dijo Dios: Produzca la tierra seres vivientes según su género, bestias y serpientes y animales de la tierra según su especie. Y fue así.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 25, text: 'E hizo Dios animales de la tierra según su género, y ganado según su género, y todo animal que se arrastra sobre la tierra según su especie. Y vio Dios que era bueno.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 26, text: 'Entonces dijo Dios: Hagamos al hombre a nuestra imagen, conforme a nuestra semejanza; y señoree en los peces del mar, en las aves de los cielos, en las bestias, en toda la tierra, y en todo animal que se arrastra sobre la tierra.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 27, text: 'Y creó Dios al hombre a su imagen, a imagen de Dios lo creó; varón y hembra los creó.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 28, text: 'Y los bendijo Dios, y les dijo: Fructificad y multiplicaos; llenad la tierra, y sojuzgadla, y señoread en los peces del mar, en las aves de los cielos, y en todas las bestias que se mueven sobre la tierra.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 29, text: 'Y dijo Dios: He aquí que os he dado toda planta que da semilla, que está sobre toda la tierra, y todo árbol en que hay fruto y que da semilla; os serán para comer.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 30, text: 'Y a toda bestia de la tierra, y a todas las aves de los cielos, y a todo lo que se arrastra sobre la tierra, en que hay vida, toda planta verde les será para comer. Y fue así.' },
  { book: 'Génesis', testament: 'AT', chapter: 1, verse: 31, text: 'Y vio Dios todo lo que había hecho, y he aquí que era bueno en gran manera. Y fue la tarde y la mañana el día sexto.' }
];

let allVerses: IndexedVerse[] = [];
const chapterCache = new Map<string, Verse[]>();
let isLoaded = false;
let loadPromise: Promise<Verse[]> | null = null;
const listeners: Array<(loaded: boolean) => void> = [];

export const initBibleService = (): Promise<Verse[]> => {
  if (isLoaded) return Promise.resolve(allVerses);
  if (loadPromise) return loadPromise;

  loadPromise = fetch('/bible-rvr1960.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then((data: Verse[]) => {
      chapterCache.clear();
      // Pre-compute normalized text for instant sub-millisecond search
      allVerses = new Array(data.length);
      for (let i = 0; i < data.length; i++) {
        const v = data[i] as IndexedVerse;
        v._norm = normalizeSearchStr(v.text);
        allVerses[i] = v;

        const key = `${v.book}:${v.chapter}`;
        let list = chapterCache.get(key);
        if (!list) {
          list = [];
          chapterCache.set(key, list);
        }
        list.push(v);
      }

      isLoaded = true;
      listeners.forEach(fn => fn(true));
      return allVerses;
    })
    .catch(err => {
      console.error('Failed to load Bible JSON:', err);
      allVerses = INITIAL_GENESIS_1;
      chapterCache.set('Génesis:1', INITIAL_GENESIS_1);
      return allVerses;
    });

  return loadPromise;
};

export const subscribeToLoadState = (fn: (loaded: boolean) => void) => {
  listeners.push(fn);
  if (isLoaded) fn(true);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx !== -1) listeners.splice(idx, 1);
  };
};

export const isBibleLoaded = () => isLoaded;

export const getChapterVerses = (bookName: string, chapter: number): Verse[] => {
  const key = `${bookName}:${chapter}`;
  const found = chapterCache.get(key);
  if (found && found.length > 0) {
    return found;
  }
  if (allVerses.length > 0) {
    const verses = allVerses.filter(v => v.book === bookName && v.chapter === chapter);
    if (verses.length > 0) {
      chapterCache.set(key, verses);
      return verses;
    }
  }
  if (bookName === 'Génesis' && chapter === 1) {
    return INITIAL_GENESIS_1;
  }
  return [];
};

export const getVerseCountForChapter = (bookName: string, chapter: number): number => {
  const verses = getChapterVerses(bookName, chapter);
  if (verses.length > 0) return verses.length;
  const meta = BIBLE_BOOKS.find(b => b.name === bookName);
  if (meta) {
    return Math.max(1, Math.round(meta.verseCount / meta.chapters));
  }
  return 30;
};

export const getNextChapter = (currentBook: string, currentChapter: number): { book: string; chapter: number } | null => {
  const bookIndex = BIBLE_BOOKS.findIndex(b => b.name === currentBook);
  if (bookIndex === -1) return null;
  const book = BIBLE_BOOKS[bookIndex];

  if (currentChapter < book.chapters) {
    return { book: currentBook, chapter: currentChapter + 1 };
  } else if (bookIndex < BIBLE_BOOKS.length - 1) {
    const nextBook = BIBLE_BOOKS[bookIndex + 1];
    return { book: nextBook.name, chapter: 1 };
  }
  return null;
};

export const getPreviousChapter = (currentBook: string, currentChapter: number): { book: string; chapter: number } | null => {
  const bookIndex = BIBLE_BOOKS.findIndex(b => b.name === currentBook);
  if (bookIndex === -1) return null;

  if (currentChapter > 1) {
    return { book: currentBook, chapter: currentChapter - 1 };
  } else if (bookIndex > 0) {
    const prevBook = BIBLE_BOOKS[bookIndex - 1];
    return { book: prevBook.name, chapter: prevBook.chapters };
  }
  return null;
};

export interface ParsedReference {
  book: string;
  chapter: number;
  verse?: number;
  endVerse?: number;
}

export const parseBibleReference = (query: string): ParsedReference | null => {
  const trimmed = query.trim();
  const match = trimmed.match(/^([1-3]?\s*[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+?)\s*(\d+)(?:[:\s]+(\d+)(?:[-–—](\d+))?)?$/);
  if (!match) return null;

  const rawBookStr = match[1].trim();
  const chapter = parseInt(match[2], 10);
  const verse = match[3] ? parseInt(match[3], 10) : undefined;
  const endVerse = match[4] ? parseInt(match[4], 10) : undefined;

  const matchedBook = findBookByNameOrAbbr(rawBookStr);
  if (!matchedBook) return null;
  if (chapter <= 0 || chapter > matchedBook.chapters) return null;

  return {
    book: matchedBook.name,
    chapter,
    verse,
    endVerse: endVerse && verse && endVerse >= verse ? endVerse : verse
  };
};

export interface SearchOptions {
  testament?: 'ALL' | Testament;
  book?: string;
  limit?: number;
}

export const searchBible = (query: string, options: SearchOptions = {}): { results: SearchResult[]; totalCount: number; parsedRef?: ParsedReference } => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return { results: [], totalCount: 0 };
  }

  const { testament = 'ALL', book, limit = 60 } = options;
  const normalizedQuery = normalizeSearchStr(trimmedQuery);
  if (!normalizedQuery) {
    return { results: [], totalCount: 0 };
  }

  const searchWords = normalizedQuery.split(/\s+/).filter(w => w.length > 0);
  const numWords = searchWords.length;
  const results: SearchResult[] = [];
  const sourceVerses = allVerses.length > 0 ? allVerses : INITIAL_GENESIS_1;

  // 1. Direct Reference Lookup (e.g. "Juan 3:16", "Génesis 1:1-5")
  const ref = parseBibleReference(trimmedQuery);
  if (ref) {
    const targetBook = BIBLE_BOOKS.find(b => b.name === ref.book);
    const passesTestament = testament === 'ALL' || (targetBook && targetBook.testament === testament);
    const passesBook = !book || book === ref.book;

    if (passesTestament && passesBook) {
      if (ref.verse) {
        const end = ref.endVerse || ref.verse;
        for (let vNum = ref.verse; vNum <= end; vNum++) {
          const matched = sourceVerses.find(
            v => v.book === ref.book && v.chapter === ref.chapter && v.verse === vNum
          );
          if (matched) {
            results.push({
              verse: matched,
              snippet: matched.text,
              matchType: 'reference',
              score: 25000 - (vNum - ref.verse) * 10
            });
          }
        }
      } else {
        const chapterVerses = sourceVerses.filter(v => v.book === ref.book && v.chapter === ref.chapter);
        for (const cv of chapterVerses.slice(0, 8)) {
          results.push({
            verse: cv,
            snippet: cv.text,
            matchType: 'reference',
            score: 20000 - cv.verse * 10
          });
        }
      }
    }
  }

  // 2. High-Performance Text and Phrase Search
  const queryLen = normalizedQuery.length;
  let matchesCount = results.length;

  // Sort words by length descending so longest/rarest words are checked first
  const sortedWords = [...searchWords].sort((a, b) => b.length - a.length);
  const longestWord = sortedWords[0];
  const secondWord = sortedWords[1];

  for (let i = 0; i < sourceVerses.length; i++) {
    const v = sourceVerses[i];

    if (testament !== 'ALL' && v.testament !== testament) continue;
    if (book && v.book !== book) continue;

    // Use pre-indexed normalized string (fallback to computed if not yet ready)
    const textNorm = v._norm || (v._norm = normalizeSearchStr(v.text));

    // A. Check exact phrase match (single fast substring indexOf)
    const exactIdx = textNorm.indexOf(normalizedQuery);
    if (exactIdx !== -1) {
      matchesCount++;
      const isAtStart = exactIdx === 0;
      results.push({
        verse: v,
        snippet: v.text,
        matchType: 'exact-phrase',
        score: 10000 + queryLen * 10 + (isAtStart ? 3000 : 0)
      });
      continue;
    }

    // B. Multi-word search with fast early-rejection (zero allocations)
    if (numWords > 1) {
      // If neither the longest nor second longest word is in this verse, skip immediately!
      if (longestWord && textNorm.indexOf(longestWord) === -1 && secondWord && textNorm.indexOf(secondWord) === -1) {
        continue;
      }

      let matchedWordsCount = 0;
      for (let w = 0; w < numWords; w++) {
        if (textNorm.indexOf(sortedWords[w]) !== -1) {
          matchedWordsCount++;
        }
      }

      const ratio = matchedWordsCount / numWords;
      if (ratio === 1) {
        matchesCount++;
        results.push({
          verse: v,
          snippet: v.text,
          matchType: 'keywords',
          score: 5000 + numWords * 50
        });
      } else if (numWords >= 3 && ratio >= 0.75) {
        matchesCount++;
        results.push({
          verse: v,
          snippet: v.text,
          matchType: 'partial',
          score: 2000 + Math.floor(ratio * 1500)
        });
      }
    } else if (numWords === 1 && longestWord.length >= 3) {
      if (textNorm.indexOf(longestWord) !== -1) {
        matchesCount++;
        results.push({
          verse: v,
          snippet: v.text,
          matchType: 'keywords',
          score: 800
        });
      }
    }
  }

  // Sort top matches by score descending, then Bible canonical order
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const bookA = BIBLE_BOOKS.find(x => x.name === a.verse.book)?.id || 0;
    const bookB = BIBLE_BOOKS.find(x => x.name === b.verse.book)?.id || 0;
    if (bookA !== bookB) return bookA - bookB;
    if (a.verse.chapter !== b.verse.chapter) return a.verse.chapter - b.verse.chapter;
    return a.verse.verse - b.verse.verse;
  });

  return {
    results: results.slice(0, limit),
    totalCount: matchesCount,
    parsedRef: ref || undefined
  };
};

export const DAILY_VERSES: Array<{ book: string; chapter: number; verse: number; theme: string }> = [
  { book: 'Juan', chapter: 3, verse: 16, theme: 'El amor de Dios' },
  { book: 'Filipenses', chapter: 4, verse: 13, theme: 'Fortaleza en Cristo' },
  { book: 'Salmos', chapter: 23, verse: 1, theme: 'El Señor es mi Pastor' },
  { book: 'Romanos', chapter: 8, verse: 28, theme: 'El propósito divino' },
  { book: 'Jeremías', chapter: 29, verse: 11, theme: 'Pensamientos de paz' },
  { book: 'Isaías', chapter: 40, verse: 31, theme: 'Nuevas fuerzas' },
  { book: 'Proverbios', chapter: 3, verse: 5, theme: 'Confianza en Dios' },
  { book: 'Josué', chapter: 1, verse: 9, theme: 'Esfuérzate y sé valiente' },
  { book: 'Mateo', chapter: 6, verse: 33, theme: 'El reino primero' },
  { book: 'Salmos', chapter: 46, verse: 1, theme: 'Dios es nuestro amparo' },
  { book: '1 Corintios', chapter: 13, verse: 4, theme: 'El amor verdadero' },
  { book: 'Gálatas', chapter: 5, verse: 22, theme: 'El fruto del Espíritu' },
  { book: 'Efesios', chapter: 2, verse: 8, theme: 'Salvación por gracia' },
  { book: 'Salmos', chapter: 119, verse: 105, theme: 'Lámpara a mis pies' }
];

export const getDailyVerse = (): { book: string; chapter: number; verse: number; theme: string } => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const index = Math.abs(dayOfYear) % DAILY_VERSES.length;
  return DAILY_VERSES[index];
};
