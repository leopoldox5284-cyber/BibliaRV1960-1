import { Book } from '../types';

export const BIBLE_BOOKS: Book[] = [
  // Antiguo Testamento (39 Libros)
  { id: 1, name: 'Génesis', testament: 'AT', chapters: 50, verseCount: 1533, category: 'Pentateuco', abbreviations: ['gn', 'gen', 'ge'] },
  { id: 2, name: 'Éxodo', testament: 'AT', chapters: 40, verseCount: 1213, category: 'Pentateuco', abbreviations: ['ex', 'exo'] },
  { id: 3, name: 'Levítico', testament: 'AT', chapters: 27, verseCount: 859, category: 'Pentateuco', abbreviations: ['lv', 'lev'] },
  { id: 4, name: 'Números', testament: 'AT', chapters: 36, verseCount: 1288, category: 'Pentateuco', abbreviations: ['nm', 'num'] },
  { id: 5, name: 'Deuteronomio', testament: 'AT', chapters: 34, verseCount: 959, category: 'Pentateuco', abbreviations: ['dt', 'deut'] },
  { id: 6, name: 'Josué', testament: 'AT', chapters: 24, verseCount: 658, category: 'Históricos', abbreviations: ['jos', 'josue'] },
  { id: 7, name: 'Jueces', testament: 'AT', chapters: 21, verseCount: 618, category: 'Históricos', abbreviations: ['jue', 'jdc'] },
  { id: 8, name: 'Rut', testament: 'AT', chapters: 4, verseCount: 85, category: 'Históricos', abbreviations: ['rt', 'rut'] },
  { id: 9, name: '1 Samuel', testament: 'AT', chapters: 31, verseCount: 810, category: 'Históricos', abbreviations: ['1s', '1sam', '1 samuel'] },
  { id: 10, name: '2 Samuel', testament: 'AT', chapters: 24, verseCount: 695, category: 'Históricos', abbreviations: ['2s', '2sam', '2 samuel'] },
  { id: 11, name: '1 Reyes', testament: 'AT', chapters: 22, verseCount: 816, category: 'Históricos', abbreviations: ['1r', '1rey', '1 reyes'] },
  { id: 12, name: '2 Reyes', testament: 'AT', chapters: 25, verseCount: 719, category: 'Históricos', abbreviations: ['2r', '2rey', '2 reyes'] },
  { id: 13, name: '1 Crónicas', testament: 'AT', chapters: 29, verseCount: 942, category: 'Históricos', abbreviations: ['1cr', '1cron', '1 cronicas'] },
  { id: 14, name: '2 Crónicas', testament: 'AT', chapters: 36, verseCount: 822, category: 'Históricos', abbreviations: ['2cr', '2cron', '2 cronicas'] },
  { id: 15, name: 'Esdras', testament: 'AT', chapters: 10, verseCount: 280, category: 'Históricos', abbreviations: ['esd', 'esdras'] },
  { id: 16, name: 'Nehemías', testament: 'AT', chapters: 13, verseCount: 406, category: 'Históricos', abbreviations: ['neh', 'nehemias'] },
  { id: 17, name: 'Ester', testament: 'AT', chapters: 10, verseCount: 167, category: 'Históricos', abbreviations: ['est', 'ester'] },
  { id: 18, name: 'Job', testament: 'AT', chapters: 42, verseCount: 1070, category: 'Poéticos', abbreviations: ['job'] },
  { id: 19, name: 'Salmos', testament: 'AT', chapters: 150, verseCount: 2461, category: 'Poéticos', abbreviations: ['sal', 'salm', 'ps', 'salmo', 'salmos'] },
  { id: 20, name: 'Proverbios', testament: 'AT', chapters: 31, verseCount: 915, category: 'Poéticos', abbreviations: ['pr', 'prov', 'proverbios'] },
  { id: 21, name: 'Eclesiastés', testament: 'AT', chapters: 12, verseCount: 222, category: 'Poéticos', abbreviations: ['ec', 'ecl', 'eclesiastes'] },
  { id: 22, name: 'Cantares', testament: 'AT', chapters: 8, verseCount: 117, category: 'Poéticos', abbreviations: ['cnt', 'cant', 'cantares'] },
  { id: 23, name: 'Isaías', testament: 'AT', chapters: 66, verseCount: 1292, category: 'Profetas Mayores', abbreviations: ['is', 'isaias'] },
  { id: 24, name: 'Jeremías', testament: 'AT', chapters: 52, verseCount: 1364, category: 'Profetas Mayores', abbreviations: ['jer', 'jeremias'] },
  { id: 25, name: 'Lamentaciones', testament: 'AT', chapters: 5, verseCount: 154, category: 'Profetas Mayores', abbreviations: ['lam', 'lamentaciones'] },
  { id: 26, name: 'Ezequiel', testament: 'AT', chapters: 48, verseCount: 1273, category: 'Profetas Mayores', abbreviations: ['ez', 'ezeq', 'ezequiel'] },
  { id: 27, name: 'Daniel', testament: 'AT', chapters: 12, verseCount: 357, category: 'Profetas Mayores', abbreviations: ['dn', 'dan', 'daniel'] },
  { id: 28, name: 'Oseas', testament: 'AT', chapters: 14, verseCount: 197, category: 'Profetas Menores', abbreviations: ['os', 'oseas'] },
  { id: 29, name: 'Joel', testament: 'AT', chapters: 3, verseCount: 73, category: 'Profetas Menores', abbreviations: ['jl', 'joel'] },
  { id: 30, name: 'Amós', testament: 'AT', chapters: 9, verseCount: 146, category: 'Profetas Menores', abbreviations: ['am', 'amos'] },
  { id: 31, name: 'Abdías', testament: 'AT', chapters: 1, verseCount: 21, category: 'Profetas Menores', abbreviations: ['abd', 'abdias'] },
  { id: 32, name: 'Jonás', testament: 'AT', chapters: 4, verseCount: 48, category: 'Profetas Menores', abbreviations: ['jon', 'jonas'] },
  { id: 33, name: 'Miqueas', testament: 'AT', chapters: 7, verseCount: 105, category: 'Profetas Menores', abbreviations: ['miq', 'miqueas'] },
  { id: 34, name: 'Nahúm', testament: 'AT', chapters: 3, verseCount: 47, category: 'Profetas Menores', abbreviations: ['nah', 'nahum'] },
  { id: 35, name: 'Habacuc', testament: 'AT', chapters: 3, verseCount: 56, category: 'Profetas Menores', abbreviations: ['hab', 'habacuc'] },
  { id: 36, name: 'Sofonías', testament: 'AT', chapters: 3, verseCount: 53, category: 'Profetas Menores', abbreviations: ['sof', 'sofonias'] },
  { id: 37, name: 'Hageo', testament: 'AT', chapters: 2, verseCount: 38, category: 'Profetas Menores', abbreviations: ['hag', 'hageo'] },
  { id: 38, name: 'Zacarías', testament: 'AT', chapters: 14, verseCount: 211, category: 'Profetas Menores', abbreviations: ['zac', 'zacarias'] },
  { id: 39, name: 'Malaquías', testament: 'AT', chapters: 4, verseCount: 55, category: 'Profetas Menores', abbreviations: ['mal', 'malaquias'] },

  // Nuevo Testamento (27 Libros)
  { id: 40, name: 'Mateo', testament: 'NT', chapters: 28, verseCount: 1071, category: 'Evangelios', abbreviations: ['mt', 'mat', 'mateo'] },
  { id: 41, name: 'Marcos', testament: 'NT', chapters: 16, verseCount: 678, category: 'Evangelios', abbreviations: ['mc', 'mr', 'marcos'] },
  { id: 42, name: 'Lucas', testament: 'NT', chapters: 24, verseCount: 1151, category: 'Evangelios', abbreviations: ['lc', 'luc', 'lucas'] },
  { id: 43, name: 'Juan', testament: 'NT', chapters: 21, verseCount: 879, category: 'Evangelios', abbreviations: ['jn', 'jhn', 'juan'] },
  { id: 44, name: 'Hechos', testament: 'NT', chapters: 28, verseCount: 1007, category: 'Historia', abbreviations: ['hch', 'hech', 'hechos'] },
  { id: 45, name: 'Romanos', testament: 'NT', chapters: 16, verseCount: 433, category: 'Epístolas Paulinas', abbreviations: ['ro', 'rom', 'romanos'] },
  { id: 46, name: '1 Corintios', testament: 'NT', chapters: 16, verseCount: 437, category: 'Epístolas Paulinas', abbreviations: ['1co', '1cor', '1 corintios'] },
  { id: 47, name: '2 Corintios', testament: 'NT', chapters: 13, verseCount: 257, category: 'Epístolas Paulinas', abbreviations: ['2co', '2cor', '2 corintios'] },
  { id: 48, name: 'Gálatas', testament: 'NT', chapters: 6, verseCount: 149, category: 'Epístolas Paulinas', abbreviations: ['ga', 'gal', 'galatas'] },
  { id: 49, name: 'Efesios', testament: 'NT', chapters: 6, verseCount: 155, category: 'Epístolas Paulinas', abbreviations: ['ef', 'efe', 'efesios'] },
  { id: 50, name: 'Filipenses', testament: 'NT', chapters: 4, verseCount: 104, category: 'Epístolas Paulinas', abbreviations: ['flp', 'fil', 'filipenses'] },
  { id: 51, name: 'Colosenses', testament: 'NT', chapters: 4, verseCount: 95, category: 'Epístolas Paulinas', abbreviations: ['col', 'colosenses'] },
  { id: 52, name: '1 Tesalonicenses', testament: 'NT', chapters: 5, verseCount: 89, category: 'Epístolas Paulinas', abbreviations: ['1ts', '1tes', '1 tesalonicenses'] },
  { id: 53, name: '2 Tesalonicenses', testament: 'NT', chapters: 3, verseCount: 47, category: 'Epístolas Paulinas', abbreviations: ['2ts', '2tes', '2 tesalonicenses'] },
  { id: 54, name: '1 Timoteo', testament: 'NT', chapters: 6, verseCount: 113, category: 'Epístolas Paulinas', abbreviations: ['1tm', '1tim', '1 timoteo'] },
  { id: 55, name: '2 Timoteo', testament: 'NT', chapters: 4, verseCount: 83, category: 'Epístolas Paulinas', abbreviations: ['2tm', '2tim', '2 timoteo'] },
  { id: 56, name: 'Tito', testament: 'NT', chapters: 3, verseCount: 46, category: 'Epístolas Paulinas', abbreviations: ['tit', 'tito'] },
  { id: 57, name: 'Filemón', testament: 'NT', chapters: 1, verseCount: 25, category: 'Epístolas Paulinas', abbreviations: ['flm', 'filemon'] },
  { id: 58, name: 'Hebreos', testament: 'NT', chapters: 13, verseCount: 303, category: 'Epístolas Generales', abbreviations: ['heb', 'hebreos'] },
  { id: 59, name: 'Santiago', testament: 'NT', chapters: 5, verseCount: 108, category: 'Epístolas Generales', abbreviations: ['stg', 'sant', 'santiago'] },
  { id: 60, name: '1 Pedro', testament: 'NT', chapters: 5, verseCount: 105, category: 'Epístolas Generales', abbreviations: ['1p', '1ped', '1 pedro'] },
  { id: 61, name: '2 Pedro', testament: 'NT', chapters: 3, verseCount: 61, category: 'Epístolas Generales', abbreviations: ['2p', '2ped', '2 pedro'] },
  { id: 62, name: '1 Juan', testament: 'NT', chapters: 5, verseCount: 105, category: 'Epístolas Generales', abbreviations: ['1jn', '1juan', '1 juan'] },
  { id: 63, name: '2 Juan', testament: 'NT', chapters: 1, verseCount: 13, category: 'Epístolas Generales', abbreviations: ['2jn', '2juan', '2 juan'] },
  { id: 64, name: '3 Juan', testament: 'NT', chapters: 1, verseCount: 14, category: 'Epístolas Generales', abbreviations: ['3jn', '3juan', '3 juan'] },
  { id: 65, name: 'Judas', testament: 'NT', chapters: 1, verseCount: 25, category: 'Epístolas Generales', abbreviations: ['jud', 'judas'] },
  { id: 66, name: 'Apocalipsis', testament: 'NT', chapters: 22, verseCount: 404, category: 'Profecía', abbreviations: ['ap', 'apoc', 're', 'apocalipsis'] }
];

export const OLD_TESTAMENT_BOOKS = BIBLE_BOOKS.filter(b => b.testament === 'AT');
export const NEW_TESTAMENT_BOOKS = BIBLE_BOOKS.filter(b => b.testament === 'NT');

export const normalizeSearchStr = (text: string): string => {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[«»""''.,;:!¡?¿\-—_()[\]{}*#~`^/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const findBookByNameOrAbbr = (query: string): Book | undefined => {
  const clean = normalizeSearchStr(query);
  if (!clean) return undefined;
  return BIBLE_BOOKS.find(b => {
    if (normalizeSearchStr(b.name) === clean) return true;
    if (b.abbreviations?.some(abbr => normalizeSearchStr(abbr) === clean)) return true;
    return false;
  });
};

