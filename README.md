# [JettNguyen.github.io](https://jettnguyen.github.io/)

Personal portfolio site for projects, coursework, reports, presentations, and resume content.

## Pages

- `#/` is one scrolling page: a short intro, four visual project cards, interest previews, a compact career
  timeline, recent writing, and the contact footer.
- `#/work` shows a gallery of top-level projects marked `featured:true`, followed by the remaining projects.
  Filters group all entries into agents, apps, games, and other work. Child entries link to their parent.
- `#/project/<slug>` shows a short summary, tools, links, screenshots, the idea, and the result. The longer
  overview, process, and reflection sit under “Behind the build.” User studies stay visible.
- `#/about` carries expandable bio sections, music, film, vintage clothing, and objects shelves, plus writing
  and skills. Shelf captions stay short; opening an image shows its full note. Links such as `#/about/vintage`
  jump directly to a collection. The home page shows the three most recent posts.
- `#/resume` is the résumé, and printing it makes `assets/Jett_Nguyen_Resume_2026.pdf`: one traditional page, single
  column, no logos. A pick or activity marked `print:false` in `data.js` shows on the page and stays off the PDF, so
  check that the print still fits one page after adding anything.
- `#/archive` holds presentations and coursework by semester. The old `#projects`, `#about`, and similar hashes still resolve.
- Light paper by default, warm dark when the system asks for it, and a toggle in the header that remembers the choice.

## Copy and color

- Hero headline, intro, facts, and the four selected slugs live under `home` in `data.js`.
- Posts under `writing` are hosted on the Otian blog, so every row leaves the site. Dates are ISO in the data and
  rendered month-first.
- Each project has a `shortSummary` for previews and a longer `summary` under its build story. Its `tint`,
  taken from its logo, colors the gallery frame and project header.
- Motion includes scroll reveals, page entrances, pointer depth, and hover effects. Reduced motion is
  honored on load and when the preference changes while the page is open.

## Tech Stack

- Vanilla JavaScript (client-side site behavior)
- CSS for responsive design and animations
- Static HTML with all content in `data.js`; no build step
- Images are resized WebP (photos around 900px, logos 512px, product screenshots in `assets/screens/`); keep new assets in that range
- `scripts/sync-spotify.js` writes the listening signal; it needs SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REFRESH_TOKEN as repository secrets
- `scripts/sync-letterboxd.js` rewrites the recently-watched signal in `data.js` on a schedule
