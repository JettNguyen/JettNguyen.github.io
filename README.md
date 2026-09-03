# [JettNguyen.github.io](https://jettnguyen.github.io/)

Personal portfolio site for projects, coursework, reports, presentations, and resume content.

## Features

- Browse project case studies with problem, approach, and outcome structure.
- Explore University of Florida coursework, report archives, and published deliverables.
- Watch presentations with slide decks and embedded videos.
- View and download digital resume content.
- Hash-routed pages that are linkable and survive refresh, with a tappable bottom nav on phones.

## Tech Stack

- Vanilla JavaScript (client-side site behavior)
- CSS for responsive design and animations
- Static HTML with all content in `data.js`; no build step
- Images are resized WebP (photos around 900px, logos 512px); keep new assets in that range
- `scripts/sync-letterboxd.js` rewrites the recently-watched signal in `data.js` on a schedule
