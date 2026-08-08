#!/usr/bin/env node
// Rewrites liveSignals.recentlyWatched in data.js with the most recent RATED
// diary entry from a public Letterboxd RSS feed. No deps, no auth.
// Usage: LETTERBOXD_USER=yourname node scripts/sync-letterboxd.js

const fs = require('fs');
const path = require('path');

const USER = process.env.LETTERBOXD_USER || 'jett2fly';
const DATA_FILE = path.join(__dirname, '..', 'data.js');

const decode = s => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(d))
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&amp;/g, '&')
  .trim();

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : null;
};

// 3.5 -> ★★★½   4 -> ★★★★
const stars = n => '★'.repeat(Math.floor(n)) + (n % 1 >= 0.5 ? '½' : '');

async function main() {
  const res = await fetch(`https://letterboxd.com/${USER}/rss/`, {
    headers: { 'User-Agent': 'jettnguyen.github.io sync' }
  });
  if (!res.ok) throw new Error(`Letterboxd RSS returned ${res.status}`);
  const xml = await res.text();

  // The feed mixes diary entries with list posts, and is ordered by when a
  // post was made rather than when the film was watched. Keep only real diary
  // entries, then pick the latest watchedDate. Feed order breaks ties, so a
  // bulk backfill of one day resolves to the last one logged.
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  const entries = items
    .map(item => ({
      title: tag(item, 'letterboxd:filmTitle'),
      rating: tag(item, 'letterboxd:memberRating'),
      watched: tag(item, 'letterboxd:watchedDate')
    }))
    .filter(e => e.title && e.watched);

  if (!entries.length) {
    console.log('No diary entries in the feed, leaving data.js alone.');
    return;
  }

  const entry = entries.reduce((best, e) => (e.watched > best.watched ? e : best));

  // A log without a rating still counts; it just renders without stars.
  const rating = entry.rating ? parseFloat(entry.rating) : NaN;
  const value = Number.isNaN(rating)
    ? entry.title
    : `${entry.title} · ${stars(rating)}`;

  const src = fs.readFileSync(DATA_FILE, 'utf8');
  const pattern = /recentlyWatched:\s*"(?:[^"\\]|\\.)*"/;
  if (!pattern.test(src)) throw new Error('recentlyWatched not found in data.js');

  const next = src.replace(pattern, `recentlyWatched:${JSON.stringify(value)}`);
  if (next === src) {
    console.log(`Unchanged: ${value}`);
    return;
  }

  fs.writeFileSync(DATA_FILE, next);
  console.log(`Updated: ${value}`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
