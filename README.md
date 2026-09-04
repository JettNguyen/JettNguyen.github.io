# [JettNguyen.github.io](https://jettnguyen.github.io/)

Personal portfolio site for projects, coursework, reports, presentations, and resume content.

## Pages

- `#/` is one scrolling page: hero, four selected projects, a pull quote from the bio, experience, and the contact footer.
- `#/work` is the index of every project; hovering a row previews it, clicking opens `#/project/<slug>`.
- `#/project/<slug>` is the write-up: summary, stack, links, screenshots, the problem-to-reflection sections, and the user study where one exists.
- `#/about` carries the full bio, skills, and the music, film, vintage clothing, and objects shelves.
- `#/archive` holds presentations and coursework by semester. The old `#projects`, `#about`, and similar hashes still resolve.
- Light paper by default, warm dark when the system asks for it, and a toggle in the header that remembers the choice.

## Copy and colour

- Hero headline, intro, facts, and the four selected slugs live under `home` in `data.js`.
- Each project has a `tint` in `data.js`, taken from its logo; it colours the frame on the home page, the band on its page, and the hover preview.

## Tech Stack

- Vanilla JavaScript (client-side site behavior)
- CSS for responsive design and animations
- Static HTML with all content in `data.js`; no build step
- Images are resized WebP (photos around 900px, logos 512px, product screenshots in `assets/screens/`); keep new assets in that range
- `scripts/sync-spotify.js` writes the listening signal; it needs SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REFRESH_TOKEN as repository secrets
- `scripts/sync-letterboxd.js` rewrites the recently-watched signal in `data.js` on a schedule
