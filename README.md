# [JettNguyen.github.io](https://jettnguyen.github.io/)

Personal portfolio site for projects, coursework, reports, presentations, and resume content.

## Pages

- `#/` is one scrolling page: hero, four selected projects, a pull quote from the bio, experience, and the contact footer.
- `#/work` is the index of every project, split into Highlights and Also built. A project is a highlight when it
  carries `featured:true` in `data.js`; a child project follows whichever list its parent is in. The numbers run
  straight through both lists so the count in the lede still adds up.
- `#/project/<slug>` is the write-up: summary, stack, links, screenshots, the problem-to-reflection sections, and the user study where one exists.
- `#/about` carries the full bio, every post under `writing` in `data.js`, skills, and the music, film, vintage
  clothing, and objects shelves. The home page shows the three most recent posts and links out to the rest.
- `#/archive` holds presentations and coursework by semester. The old `#projects`, `#about`, and similar hashes still resolve.
- Light paper by default, warm dark when the system asks for it, and a toggle in the header that remembers the choice.

## Copy and colour

- Hero headline, intro, facts, and the four selected slugs live under `home` in `data.js`.
- Posts under `writing` are hosted on the Otian blog, so every row leaves the site. Dates are ISO in the data and
  rendered month-first.
- Each project has a `tint` in `data.js`, taken from its logo; it colours the frame on the home page, the band on its page, and the hover preview.

## Tech Stack

- Vanilla JavaScript (client-side site behavior)
- CSS for responsive design and animations
- Static HTML with all content in `data.js`; no build step
- Images are resized WebP (photos around 900px, logos 512px, product screenshots in `assets/screens/`); keep new assets in that range
- `scripts/sync-spotify.js` writes the listening signal; it needs SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REFRESH_TOKEN as repository secrets
- `scripts/sync-letterboxd.js` rewrites the recently-watched signal in `data.js` on a schedule
