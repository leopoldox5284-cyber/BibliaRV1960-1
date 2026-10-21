import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('public/rvr1960_raw.json', 'utf8'));
const raw2Juan = JSON.parse(fs.readFileSync('public/2juan.json', 'utf8'));
const raw3Juan = JSON.parse(fs.readFileSync('public/3juan.json', 'utf8'));

// Format 2 Juan
const verses2Juan = raw2Juan.verses.map(v => ({
  book: '2 Juan',
  testament: 'NT',
  chapter: 1,
  verse: v.verse,
  text: v.text.trim(),
  title: v.verse === 1 ? 'Salutación y testimonio de la verdad' : undefined,
}));

// Format 3 Juan
const verses3Juan = raw3Juan.verses.map(v => ({
  book: '3 Juan',
  testament: 'NT',
  chapter: 1,
  verse: v.verse,
  text: v.text.trim(),
  title: v.verse === 1 ? 'Salutación y elogio a Gayo' : undefined,
}));

const fullBible = [];

for (const item of rawData) {
  const testament = item.Testament === 'Antiguo' ? 'AT' : 'NT';
  const verseObj = {
    book: item.Book.trim(),
    testament,
    chapter: item.Chapter,
    verse: item.Verse,
    text: item.Text.trim(),
    ...(item.Title ? { title: item.Title.trim() } : {}),
  };

  fullBible.push(verseObj);

  // If this was 1 Juan 5:21 (the last verse of 1 Juan), append 2 Juan and 3 Juan
  if (item.Book === '1 Juan' && item.Chapter === 5 && item.Verse === 21) {
    fullBible.push(...verses2Juan);
    fullBible.push(...verses3Juan);
  }
}

console.log('Total verses in fullBible:', fullBible.length);

// Extract books catalog
const booksMap = new Map();
for (const v of fullBible) {
  if (!booksMap.has(v.book)) {
    booksMap.set(v.book, {
      name: v.book,
      testament: v.testament,
      maxChapter: v.chapter,
      verseCount: 1,
    });
  } else {
    const b = booksMap.get(v.book);
    if (v.chapter > b.maxChapter) b.maxChapter = v.chapter;
    b.verseCount++;
  }
}

const booksList = Array.from(booksMap.values()).map((b, idx) => ({
  id: idx + 1,
  name: b.name,
  testament: b.testament,
  chapters: b.maxChapter,
  verseCount: b.verseCount,
}));

console.log('Total books:', booksList.length);
console.log('Old Testament books:', booksList.filter(b => b.testament === 'AT').length);
console.log('New Testament books:', booksList.filter(b => b.testament === 'NT').length);

// Write output files
fs.writeFileSync('public/bible-rvr1960.json', JSON.stringify(fullBible));
fs.writeFileSync('public/bible-books.json', JSON.stringify(booksList, null, 2));

// Clean up raw temp files
fs.unlinkSync('public/rvr1960_raw.json');
fs.unlinkSync('public/2juan.json');
fs.unlinkSync('public/3juan.json');

console.log('Successfully written public/bible-rvr1960.json and public/bible-books.json');
