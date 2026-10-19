'use strict';

// One document, hash routes, no build step. Every page is rendered from
// window.siteData in data.js; this file only decides how it reads.

const D  = window.siteData;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = window.matchMedia('(prefers-reduced-motion: reduce)');
const HOVER = window.matchMedia('(hover: hover)');

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const word = n => WORDS[n] ?? String(n);
const pad2 = n => String(n).padStart(2, '0');

const projects = D.projects.items;
const bySlug   = slug => projects.find(p => p.slug === slug);
const year     = p => (p.date || '').slice(0, 4);
const ongoing  = p => /ongoing/i.test(p.date || '');
const kind     = p => p.categories?.[0] || '';
const originOf = p => p.origin === 'school' ? 'Coursework' : 'Independent';
const parentOf = p => p.parent ? bySlug(p.parent) : null;
const kidsOf   = p => projects.filter(k => k.parent === p.slug);
const teamOf   = p => p.collaboration === 'team' ? 'Team' : 'Solo';

// Posts carry an ISO date; the page shows the month before the day.
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const postDate = s => {
  const [y, m, d] = String(s || '').split('-');
  return MON[+m - 1] ? (d ? `${MON[+m - 1]} ${+d}, ${y}` : `${MON[+m - 1]} ${y}`) : String(s || '');
};

// The writing lives on the Otian blog, so every row leaves the site.
function writingRows(items, compact = false) {
  return items.map((w, i) => `
    <li class="wr-row" data-reveal style="--i:${Math.min(i, 8)}">
      <a href="${w.url}" target="_blank" rel="noopener">
        <span class="mono wr-date">${esc(postDate(w.date))}</span>
        <span>
          <span class="wr-title">${esc(w.title)}</span>
          ${!compact && w.excerpt ? `<span class="wr-excerpt">${esc(w.excerpt)}</span>` : ''}
        </span>
      </a>
    </li>`).join('');
}

/* ------------------------------------------------------------------ */
/* routing                                                             */
/* ------------------------------------------------------------------ */

// Old links used #about, #projects and so on. Keep them working.
const LEGACY = {
  home: ['', null], about: ['about', null], projects: ['work', null],
  experience: ['', 'experience'], presentations: ['archive', 'presentations'],
  coursework: ['archive', 'coursework'], contact: ['', 'contact'],
};
const ROUTES = new Set(['', 'work', 'about', 'archive', 'resume', 'project']);

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [head = '', ...rest] = raw.split('/').map(decodeURIComponent);
  if (ROUTES.has(head)) return { head, arg: rest[0] || null };
  if (LEGACY[head]) return { head: LEGACY[head][0], arg: LEGACY[head][1] };
  return { head: '', arg: null };
}

const app = $('#app');
let current = null;          // { head, arg }
let pushed  = false;         // set by navigate(); cleared by the hashchange it causes
const scrollMemory = new Map();
function navigate(hash) {
  pushed = true;
  location.hash = hash;
}

function render() {
  const next = parseHash();
  const key = next.head + '/' + (next.arg || '');
  const sameDoc = current && current.head === next.head && (next.head !== 'project' || current.arg === next.arg);
  if (sameDoc) {
    if (next.arg) scrollToAnchor(next.arg);
    current = next; pushed = false; setNav(next);
    return;
  }
  if (current) scrollMemory.set(current.head + '/' + (current.arg || ''), window.scrollY);
  const restore = !pushed && scrollMemory.has(key) ? scrollMemory.get(key) : null;
  app.replaceChildren((PAGES[next.head] || PAGES[''])(next.arg));
  document.title = pageTitle(next);
  setNav(next);
  if (next.arg && next.head !== 'project') scrollToAnchor(next.arg, true);
  else window.scrollTo({ top: restore ?? 0, behavior: 'instant' });
  afterRender();
  current = next; pushed = false;
}

function pageTitle({ head, arg }) {
  const n = D.meta.name;
  if (head === 'project') return `${bySlug(arg)?.title || 'Project'} · ${n}`;
  if (head === 'work')    return `Work · ${n}`;
  if (head === 'about')   return `About · ${n}`;
  if (head === 'archive') return `Archive · ${n}`;
  if (head === 'resume')  return `Résumé · ${n}`;
  return n;
}

function scrollToAnchor(id, instant) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: instant ? 'instant' : RM.matches ? 'auto' : 'smooth' });
}

window.addEventListener('hashchange', render);

/* ------------------------------------------------------------------ */
/* header and footer                                                   */
/* ------------------------------------------------------------------ */

// The portrait is drawn twice, once per theme: a putty rim for paper, a cream
// rim for the dark page. Only the one in use is fetched.
const isDark = () => {
  const t = document.documentElement.dataset.theme;
  return t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
};
const portraitSrc = () => (isDark() && D.home.headshotUrlDark) || D.home.headshotUrl;
const syncPortraits = () => { $$('img[data-portrait]').forEach(i => { const s = portraitSrc(); if (i.getAttribute('src') !== s) i.src = s; }); };
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (!document.documentElement.dataset.theme) syncPortraits();
});

const NAV = [
  { label: 'Work',    href: '#/work',    head: 'work' },
  { label: 'About',   href: '#/about',   head: 'about' },
  { label: 'Archive', href: '#/archive', head: 'archive' },
  { label: 'Résumé',  href: '#/resume',  head: 'resume' },
];

function buildHeader() {
  const nav = $('#siteNav');
  nav.innerHTML = NAV.map(n => `<a href="${n.href}" data-head="${n.head}">${n.label}</a>`).join('')
    + `<button class="theme-btn" id="themeBtn" type="button">
         <svg viewBox="0 0 22 22" aria-hidden="true" focusable="false">
           <circle cx="11" cy="11" r="8.2"/><path d="M11 2.8a8.2 8.2 0 0 1 0 16.4z"/>
         </svg>
       </button>`;

  const btn = $('#themeBtn');
  const paint = () => {
    const label = isDark() ? 'Switch to light mode' : 'Switch to dark mode';
    btn.setAttribute('aria-label', label);
    btn.title = label;
  };
  btn.onclick = () => {
    const next = isDark() ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    paint();
    syncPortraits();
  };
  paint();

  const head = $('#siteHead');
  const onScroll = () => head.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function setNav(route) {
  const hit = h => h === route.head || (h === 'work' && route.head === 'project');
  $$('#siteNav a[data-head]').forEach(a => {
    if (hit(a.dataset.head)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  let active = null;
  $$('.tnav-item[data-head]').forEach(a => {
    const on = hit(a.dataset.head);
    a.classList.toggle('on', on);
    if (on) { a.setAttribute('aria-current', 'page'); active = a; } else a.removeAttribute('aria-current');
  });
  if (active) centreDrum(active);
}

// A drum of words: the one sitting in the centre is the page you are on, and
// the rest turn away from you as they leave. Touch only; the header carries
// the same links on pointer devices.
let drumRaf = 0, drumSettle = 0;
function buildDrum() {
  const track = $('#tnavTrack');
  if (!track || track.children.length) return;
  const items = [{ label: 'Home', href: '#/', head: '' }, ...NAV];
  track.innerHTML = items.map(i => `<a class="tnav-item" href="${i.href}" data-head="${i.head}">${i.label}</a>`).join('');
  track.addEventListener('scroll', () => {
    if (!drumRaf) drumRaf = requestAnimationFrame(paintDrum);
  }, { passive: true });
  window.addEventListener('resize', paintDrum);
  paintDrum();
}

function paintDrum() {
  drumRaf = 0;
  const track = $('#tnavTrack');
  if (!track || RM.matches) return;
  const r = track.getBoundingClientRect();
  const cx = r.left + r.width / 2, half = r.width / 2 || 1;
  $$('.tnav-item', track).forEach(it => {
    const b = it.getBoundingClientRect();
    const d = Math.max(-1.5, Math.min(1.5, (b.left + b.width / 2 - cx) / half));
    it.style.setProperty('--d', d.toFixed(3));
    it.style.setProperty('--a', Math.abs(d).toFixed(3));
  });
}

function centreDrum(el) {
  const track = el.parentElement;
  if (!track || !track.clientWidth) return;      // hidden on pointer devices
  clearTimeout(drumSettle);
  el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: RM.matches ? 'auto' : 'smooth' });
  drumSettle = setTimeout(paintDrum, 420);
}

function buildFooter() {
  const c = D.contact;
  const email = c.links.find(l => l.href.startsWith('mailto:'));
  const others = c.links.filter(l => l !== email);
  $('#siteFoot').innerHTML = `
    <div class="wrap foot-grid" id="contact">
      <div>
        <p class="foot-kicker"><span class="status-dot" aria-hidden="true"></span>${esc(D.meta.statusText)}</p>
        ${email ? `<a class="foot-big" href="${email.href}">Let's make something.<span aria-hidden="true">↗</span></a>
          <a class="foot-email" href="${email.href}">${esc(email.handle)}</a>` : ''}
      </div>
      <ul class="foot-links">
        ${others.map(l => `<li><a href="${l.href}" target="_blank" rel="noopener"><span class="l">${esc(l.label)}</span><span aria-hidden="true">↗</span></a></li>`).join('')}
        ${D.experience.resumePdf ? `<li><a href="${D.experience.resumePdf}" target="_blank" rel="noopener"><span class="l">Résumé PDF</span><span aria-hidden="true">↗</span></a></li>` : ''}
      </ul>
      <p class="foot-colophon"><span>Jett Nguyen</span><a href="#//hero">Back to the top ↑</a></p>
    </div>`;
}

/* ------------------------------------------------------------------ */
/* pages                                                               */
/* ------------------------------------------------------------------ */

const PAGES = {};
const frag = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content; };

PAGES[''] = () => {
  const h = D.home;
  const selected = (h.selected || []).map(bySlug).filter(Boolean);
  const xp = D.experience;
  const interests = D.about.interestSections || [];
  const headline = (h.headline || h.nameLines).map((l, i) =>
    `<span class="line"><span style="--i:${i}">${i === (h.headline || h.nameLines).length - 1 ? `<em>${esc(l)}</em>` : esc(l)}</span></span>`).join('');
  const jobs = xp.jobs.map(j => ({...j, title: j.company, subtitle: j.role}));
  jobs.push({logo: xp.education.logo, title: xp.education.institution, subtitle: 'Computer Science + Public Relations', date: xp.education.dates});

  return frag(`
    <section class="hero wrap" id="hero">
      <div class="hero-grid">
        <div class="hero-text">
          <a class="hero-kicker" href="#//contact"><span class="status-dot" aria-hidden="true"></span>${esc(D.meta.statusText)}<span aria-hidden="true">↗</span></a>
          <h1 class="display">${headline}</h1>
          <p class="hero-intro">${esc(h.intro || h.description)}</p>
          <div class="hero-actions"><a class="pill-link primary" href="#//work">Explore my work <span aria-hidden="true">↓</span></a><a class="pill-link" href="#/about">Meet Jett <span aria-hidden="true">↗</span></a></div>
          ${h.facts?.length ? `<ul class="hero-facts">${h.facts.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
        </div>
        <figure class="hero-portrait">
          <div class="portrait-stage">
            <span class="portrait-orbit" aria-hidden="true"></span>
            <div class="frame" data-tilt="-8"><img data-portrait src="${portraitSrc()}" alt="${esc(h.headshotAlt || D.meta.name)}" width="1400" height="1400" fetchpriority="high"></div>
            <a class="portrait-sticker sticker-one" href="#/project/archie"><img src="${bySlug('archie').logo}" alt=""><span>Building Archie <span aria-hidden="true">↗</span></span></a>
            <a class="portrait-sticker sticker-two" href="#/project/studioflow"><img src="${bySlug('studioflow').logo}" alt=""><span>Making music <span aria-hidden="true">↗</span></span></a>
            <svg class="hero-spark" viewBox="0 0 80 80" aria-hidden="true"><path d="M40 0 47 27 68 12 53 33 80 40 53 47 68 68 47 53 40 80 33 53 12 68 27 47 0 40 27 33 12 12 33 27Z" fill="currentColor"/></svg>
          </div>
          <figcaption>${esc(h.headshotCaption || '')}</figcaption>
        </figure>
      </div>
    </section>

    <section class="section wrap" id="work">
      <header class="section-head" data-reveal><h2>Selected work<span class="section-count" aria-hidden="true">${pad2(selected.length)}</span></h2><a class="arrow-link" href="#/work">All ${projects.length} projects</a></header>
      <ol class="work-list">${selected.map((p, i) => workItem(p, i)).join('')}</ol>
    </section>

    <section class="section wrap" id="about-teaser">
      <div class="off-clock" data-reveal>
        <div><span class="eyebrow">A few other tabs open</span><h2>Away from<br>the keyboard.</h2><a class="arrow-link" href="#/about">A little more about me</a></div>
        <div class="interest-deck">${interests.map((sec, i) => {
          const it = sec.items[0];
          return `<a class="interest-card" href="#/about/${sec.key}" style="--r:${[-10, 5, -5, 10][i]}deg;--i:${i}"><img src="${it.imageUrl}" alt="${esc(it.title)}" loading="lazy"><span>${esc(sec.title)} <span aria-hidden="true">↗</span></span></a>`;
        }).join('')}</div>
      </div>
    </section>

    <section class="section wrap" id="experience">
      <header class="section-head" data-reveal><h2>The path so far</h2><a class="arrow-link" href="#/resume">Full résumé</a></header>
      <ol class="career-timeline">${jobs.map((j, i) => `<li data-reveal style="--i:${i}">${j.logo ? `<img src="${j.logo}" alt="" loading="lazy">` : ''}<div><h3>${j.url ? `<a href="${j.url}" target="_blank" rel="noopener">${esc(j.title)} ↗</a>` : esc(j.title)}</h3><p>${esc(j.subtitle)}</p></div><span class="mono">${esc(j.date)}</span></li>`).join('')}</ol>
    </section>

    ${D.writing?.items?.length ? `<section class="section wrap" id="writing"><header class="section-head" data-reveal><h2>Notes from building</h2><a class="arrow-link" href="${D.writing.url}" target="_blank" rel="noopener">The blog</a></header><ol class="writing">${writingRows(D.writing.items.slice(0, 3), true)}</ol></section>` : ''}
  `);
};

function projectVisual(p, i = 1) {
  const shots = (p.screenshots || []).slice(0, 3);
  if (shots.length) return `<div class="work-frame-inner" style="--n:${shots.length}">${shots.map((s, j) => `<img src="${s.src}" alt="${esc(s.alt)}" loading="${i === 0 && j === 0 ? 'eager' : 'lazy'}" decoding="async">`).join('')}</div>`;
  if (p.slug === 'hudson') return `<div class="agent-map" aria-label="Hudson helps with mail, calendars, and leads"><span class="map-node node-one">Mail</span><span class="map-node node-two">Calendar</span><span class="map-node node-three">Leads</span><span class="map-ring" aria-hidden="true"></span><img src="${p.logo}" alt=""><span class="map-caption">A founder has the final say.</span></div>`;
  return `<div class="work-frame-inner logo-art"><span class="art-ring" aria-hidden="true"></span><img src="${p.logo || D.meta.logoUrl}" alt="" loading="lazy">${p.slug === 'studioflow' ? `<span class="sound-wave" aria-hidden="true">${Array.from({length:25}, (_, j) => `<i style="--bar:${[18,32,48,25,60,40,72,50,90,64,42,78,100,67,40,85,60,35,70,48,28,50,30,20,12][j]}%;--i:${j}"></i>`).join('')}</span>` : ''}</div>`;
}

function workItem(p, i, gallery = false) {
  const shots = p.screenshots || [];
  return `<li class="work-item${gallery ? ' project-entry' : ''}" data-reveal${gallery ? ` data-group="${projectGroup(p)}"` : ''} style="--tint:${p.tint || '#9a2f22'};--i:${i % 2}">
    <a class="work-card" href="#/project/${p.slug}" aria-label="${esc(p.title)}: ${esc(p.shortSummary || p.summary)}">
      <div class="work-frame" data-kind="${shots.length ? 'shots' : 'logo'}">
        <span class="work-number" aria-hidden="true">${pad2(i + 1)}</span>${p.status ? `<span class="work-status">${esc(p.status)}</span>` : ''}
        ${projectVisual(p, i)}<span class="work-open" aria-hidden="true">↗</span>
      </div>
      <div class="work-meta"><div class="work-title-row"><h3>${esc(p.title)}</h3><span class="mono">${esc(kind(p))}</span></div><p>${esc(p.shortSummary || p.summary)}</p></div>
    </a>
  </li>`;
}

function projectGroup(p) {
  const k = kind(p);
  if (/agent/i.test(k)) return 'agents';
  if (/game|puzzle/i.test(k)) return 'games';
  if (/app/i.test(k)) return 'apps';
  return 'other';
}

PAGES.work = () => {
  const top = projects.filter(p => p.featured && !p.parent);
  const rest = projects.filter(p => !top.includes(p));
  return frag(`
    <section class="wrap work-page">
      <header class="page-head work-page-head"><div><span class="eyebrow">Agents, apps, and experiments</span><h1>Made by me<span class="title-period">.</span></h1></div><p class="work-total"><strong>${projects.length}</strong><span>projects & counting</span></p></header>
      <div class="work-toolbar"><div class="work-filters" role="group" aria-label="Filter projects">${[['all','Everything'],['agents','Agents'],['apps','Apps'],['games','Games'],['other','Other']].map(([k,l], i) => `<button type="button" data-filter="${k}" aria-pressed="${i === 0}">${l}</button>`).join('')}</div><p class="mono filter-result" role="status" aria-live="polite">${projects.length} projects</p></div>
      <section class="project-group"><h2 class="idx-label">Highlights</h2><ol class="work-list project-gallery">${top.map((p, i) => workItem(p, i, true)).join('')}</ol></section>
      <section class="project-group more-projects"><h2 class="idx-label">More to explore</h2><ol class="index compact-index">${rest.map(p => {
        const up = parentOf(p);
        return `<li class="index-row project-entry${up ? ' child' : ''}" data-group="${projectGroup(p)}" data-reveal style="--tint:${p.tint || '#9a2f22'}"><a href="#/project/${p.slug}"><span class="idx-title">${p.logo ? `<img class="idx-logo" src="${p.logo}" alt="" loading="lazy">` : ''}<span>${esc(p.title)}${up ? `<small>Part of ${esc(up.title)}</small>` : ''}</span></span><span class="idx-sum">${esc(p.shortSummary || p.summary)}</span><span class="idx-type">${esc(kind(p))}</span><span class="idx-arrow" aria-hidden="true">↗</span></a></li>`;
      }).join('')}</ol></section>
    </section>`);
};

PAGES.project = slug => {
  const p = bySlug(slug);
  if (!p) return frag(`<section class="wrap page-head"><a class="arrow-link crumb" href="#/work">Back to work</a><h1>Not found</h1></section>`);
  const i = projects.indexOf(p);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const d = p.details || {};
  const up = parentOf(p);
  const kids = kidsOf(p);
  const shots = p.screenshots || [];
  const links = [
    p.appStoreUrl && `<a class="store-link" href="${p.appStoreUrl}" target="_blank" rel="noopener">On the App Store ↗</a>`,
    p.micrositeUrl && `<a href="${p.micrositeUrl}">Product page ↗</a>`,
    p.demoUrl   && `<a href="${p.demoUrl}" target="_blank" rel="noopener">${esc(p.demoLabel || 'Live site')} ↗</a>`,
    p.githubUrl && `<a href="${p.githubUrl}" target="_blank" rel="noopener">Source on GitHub ↗</a>`,
    p.embedUrl  && `<button class="text-link" type="button" data-embed="${p.embedUrl}">Play it here</button>`,
  ].filter(Boolean);

  const sec = (label, body) => body ? `<section class="proj-sec"><h2>${label}</h2><div>${body}</div></section>` : '';

  return frag(`
    <article${p.tint ? ` style="--tint:${p.tint}"` : ''}>
      <div class="proj-band"><header class="proj-head wrap">
        <a class="arrow-link crumb" href="#/work">All work</a>
        <h1>${p.logo ? `<img src="${p.logo}" alt="">` : ''}${esc(p.title)}${p.status ? `<span class="status" data-status="${esc(p.status.toLowerCase())}">${esc(p.status)}</span>` : ''}</h1>
        <p class="proj-summary">${esc(p.shortSummary || p.summary)}</p>
        <dl class="proj-meta">
          <div><dt>Year</dt><dd>${esc(p.date)}</dd></div>
          <div><dt>Context</dt><dd>${originOf(p)}, ${p.collaboration === 'team' ? 'with a team' : 'solo'}</dd></div>
          <div><dt>Built with</dt><dd><ul class="tech-tags">${(p.techStack || []).map(t => `<li>${esc(t)}</li>`).join('')}</ul></dd></div>
          ${up ? `<div><dt>Part of</dt><dd><a href="#/project/${up.slug}">${esc(up.title)}</a></dd></div>` : ''}
          ${kids.length ? `<div><dt>Related</dt><dd>${kids.map(k => `<a href="#/project/${k.slug}">${esc(k.title)}</a>`).join(', ')}</dd></div>` : ''}
          <div><dt>Links</dt><dd class="links">${links.join('') || '<span class="muted">No public link</span>'}</dd></div>
        </dl>
        <div class="embed-slot"></div>
      </header></div>

      <div class="wrap">
      ${shots.length ? `
      <div class="proj-shots" data-n="${Math.min(shots.length, 4)}">
        ${shots.map((s, j) => `
          <figure class="proj-shot${j === 0 ? ' first' : ''}" data-px="${[0.05, -0.04, 0.07, -0.03][j % 4]}" tabindex="0" role="button" aria-label="Enlarge: ${esc(s.alt)}">
            <img src="${s.src}" alt="${esc(s.alt)}" loading="${j < 2 ? 'eager' : 'lazy'}" decoding="async">
            ${s.caption ? `<figcaption>${esc(s.caption)}</figcaption>` : ''}
          </figure>`).join('')}
      </div>` : ''}

      <div class="proj-body">
        ${sec('The idea', d.problem && `<p>${esc(d.problem)}</p>`)}
        ${sec('The result', d.outcome && `<p>${esc(d.outcome)}</p>`)}
        ${p.study ? sec('By the numbers', studyHtml(p.study)) : ''}
        ${[p.summary, d.observation, d.hypothesis, d.experiment, d.reflection].some(Boolean) ? `<details class="build-story"><summary>Behind the build<span aria-hidden="true">+</span></summary><div class="build-story-body">
          ${sec('Overview', p.summary && `<p>${esc(p.summary)}</p>`)}
          ${sec('Observation', d.observation && `<p>${esc(d.observation)}</p>`)}
          ${sec('Hypothesis', d.hypothesis && `<p>${esc(d.hypothesis)}</p>`)}
          ${sec('The build', d.experiment && `<p>${esc(d.experiment)}</p>`)}
          ${sec('Looking back', d.reflection && `<p>${esc(d.reflection)}</p>`)}
        </div></details>` : ''}
        ${p.posterUrl ? sec('Poster', `<figure class="poster" tabindex="0" role="button" aria-label="Enlarge research poster"><img src="${p.posterUrl}" alt="${esc(p.title)} research poster" loading="lazy"></figure>`) : ''}
      </div>

      <nav class="proj-nav" aria-label="Other projects">
        <a class="prev" href="#/project/${prev.slug}"><span class="k">Previous</span><span class="t">${esc(prev.title)}</span></a>
        <a class="next" href="#/project/${next.slug}"><span class="k">Next</span><span class="t">${esc(next.title)}</span></a>
      </nav>
      </div>
    </article>
  `);
};

// A small, honest chart for the project that ran a study. Every number is
// printed beside its mark, so the figure reads without colour.
function studyHtml(st) {
  const t = st.time, sat = st.satisfaction;
  const W = 340, x0 = 78, barW = 210, maxV = Math.ceil((t.manual + t.sdManual) / 20) * 20;
  const sx = v => x0 + (v / maxV) * barW;
  const row = (y, label, v, sd, cls) => `
    <text x="0" y="${y + 17}" class="study-lbl">${label}</text>
    <rect x="${x0}" y="${y}" width="${sx(v) - x0}" height="24" rx="2" class="study-bar ${cls}"/>
    <line x1="${sx(v - sd)}" x2="${sx(v + sd)}" y1="${y + 12}" y2="${y + 12}" class="study-sd"/>
    <line x1="${sx(v - sd)}" x2="${sx(v - sd)}" y1="${y + 7}" y2="${y + 17}" class="study-sd"/>
    <line x1="${sx(v + sd)}" x2="${sx(v + sd)}" y1="${y + 7}" y2="${y + 17}" class="study-sd"/>
    <text x="${sx(v + sd) + 6}" y="${y + 17}" class="study-val">${v.toFixed(1)} s</text>`;
  const mx = v => 78 + (v / 100) * 210;
  return `
    <div class="study">
      <p>${esc(st.method)}</p>
      <svg viewBox="0 0 ${W} 70" class="study-chart" role="img" aria-label="Mean time to split the bill: ${t.manual} seconds by hand, ${t.splitsy} seconds with Splitsy">
        ${row(4, 'By hand', t.manual, t.sdManual, 'manual')}
        ${row(40, 'Splitsy', t.splitsy, t.sdSplitsy, 'splitsy')}
      </svg>
      <p class="study-note">Bars are means, whiskers are one standard deviation. Paired one-tailed t-test: t = ${t.t}, p = ${t.p}.</p>
      <svg viewBox="0 0 ${W} 40" class="study-chart" role="img" aria-label="Satisfaction ${sat.mean} of 100, neutral point ${sat.benchmark}">
        <text x="0" y="21" class="study-lbl">Satisfaction</text>
        <rect x="78" y="8" width="210" height="24" rx="2" class="study-track"/>
        <rect x="78" y="8" width="${mx(sat.mean) - 78}" height="24" rx="2" class="study-bar splitsy"/>
        <line x1="${mx(sat.benchmark)}" x2="${mx(sat.benchmark)}" y1="4" y2="36" class="study-mark"/>
        <text x="${mx(sat.mean) + 6}" y="21" class="study-val">${sat.mean}</text>
      </svg>
      <p class="study-note">Visual analog scale, 0 to 100, neutral point at ${sat.benchmark} marked. Scores ranged from ${sat.min} to ${sat.max}; SD ${sat.sd}.</p>
    </div>`;
}

PAGES.about = () => {
  const a = D.about, h = D.home;
  const facts = (a.infoFields || []).filter(f => !['GPA', 'Email', 'Degree'].includes(f.label));
  const bio = (a.bio || []).map(b => (typeof b === 'string' ? { text: b } : b));
  const ls = a.liveSignals || {};
  const now = [
    ls.currentlyListening && [ls.listeningLabel || 'listening', ls.currentlyListening],
    ls.recentlyWatched && ['last watched', ls.recentlyWatched],
  ].filter(Boolean);

  return frag(`
    <section class="wrap" id="story">
      <header class="page-head about-head"><span class="eyebrow">The person behind the projects</span><h1>A little more human<span class="title-period">.</span></h1><nav class="collection-nav" aria-label="About sections"><a href="#/about/story">My story</a>${a.interestSections.map(sec => `<a href="#/about/${sec.key}">${esc(sec.title)}</a>`).join('')}</nav></header>
      <div class="about-grid">
        <div class="about-bio">
          ${bio[0] ? `<p class="about-lede">${bio[0].text}</p>` : ''}
          <ul class="about-facts">${facts.map(f => `<li><span>${esc(f.label)}</span>${esc(f.value)}</li>`).join('')}</ul>
          <div class="bio-stories">${bio.slice(1).map((b, i) => `<details class="bio-block"${i === 0 ? ' open' : ''}><summary>${esc(b.label || 'More about me')}<span aria-hidden="true">+</span></summary><p>${b.text}</p></details>`).join('')}</div>
        </div>
        <aside class="about-side">
          <figure class="about-portrait"><div class="frame"><img data-portrait src="${portraitSrc()}" alt="${esc(h.headshotAlt || D.meta.name)}" width="1400" height="1400"></div></figure>
          ${now.length ? `<div class="now panel"><h2>On rotation</h2><dl>${now.map(([k, v], i) => `<div><dt>${i === 0 ? '<span class="mini-wave" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' : ''}${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>` : ''}
        </aside>
      </div>
    </section>

    <section class="section wrap essay">
      ${(a.interestSections || []).map(sec => `<section id="${sec.key}" class="collection-section"><div class="essay-head" data-reveal><h2>${esc(sec.title)}<span class="section-count" aria-hidden="true">${pad2(sec.items.length)}</span></h2><p>${esc(sec.intro)}</p></div><div class="shelf" data-aspect="${sec.imageAspect || 'square'}">${sec.items.map((it, i) => piece(it, sec.key === 'vintage', i)).join('')}</div></section>`).join('')}
    </section>

    <section class="section wrap"><details class="skills-disclosure"><summary>What I work with<span aria-hidden="true">+</span></summary><dl class="skills">${(a.skillGroups || []).map(g => `<div><dt>${esc(g.label)}</dt><dd class="skill-tags">${g.items.map(t => `<span>${esc(t)}</span>`).join('')}</dd></div>`).join('')}</dl></details></section>

    ${D.writing?.items?.length ? `<section class="section wrap" id="writing"><header class="section-head" data-reveal><h2>Writing</h2><a class="arrow-link" href="${D.writing.url}" target="_blank" rel="noopener">${esc(D.writing.urlLabel || 'the blog')}</a></header><ol class="writing">${writingRows(D.writing.items, true)}</ol></section>` : ''}
    ${a.curiosities?.length ? `<section class="section wrap"><details class="skills-disclosure"><summary>Questions I come back to<span aria-hidden="true">+</span></summary><ol class="questions">${a.curiosities.map(c => `<li><div><h4>${esc(c.title)}</h4><div class="sub">${esc(c.subtitle)}</div><p>${esc(c.description)}</p></div></li>`).join('')}</ol></details></section>` : ''}
  `);
};

function piece(it, isTee, i) {
  const back = isTee ? it.imageUrl.replace(/-front\.(\w+)$/, '-back.$1') : '';
  return `
    <figure class="piece${isTee ? ' tee' : ''}" data-reveal style="--i:${Math.min(i, 8)}" tabindex="0" role="button" aria-label="View ${esc(it.title)}${isTee ? ' (front and back)' : ''}"
      data-src="${it.imageUrl}" ${back ? `data-back="${back}"` : ''} data-title="${esc(it.title)}" data-sub="${esc(it.subtitle || '')}" data-desc="${esc(it.description || '')}">
      <div class="piece-img">
        <img class="front" src="${it.imageUrl}" alt="${esc(it.title)}" loading="lazy" decoding="async">
        ${back ? `<img class="back" src="${back}" alt="" loading="lazy" decoding="async" onerror="this.remove()">` : ''}
      </div>
      <figcaption>
        <div class="piece-title">${esc(it.title)}</div>
        ${it.subtitle ? `<div class="piece-sub">${esc(it.subtitle)}</div>` : ''}
      </figcaption>
    </figure>`;
}

// The résumé, rendered from the same data as everything else so the two can
// never drift. The PDF in assets is this page printed.
PAGES.resume = () => {
  const xp = D.experience, r = xp.resume || {}, c = D.contact;
  const lines = ['Email', 'GitHub', 'LinkedIn']
    .map(l => c.links.find(x => x.label === l)).filter(Boolean)
    .concat([{ label: 'Site', handle: 'jettnguyen.github.io', href: 'https://jettnguyen.github.io/' }]);
  // A pick or activity with print:false stays on this page and off the one-page PDF.
  const picks = (r.picks || []).map(k => { const p = bySlug(k.slug); return p && { ...p, note: k.note, print: k.print }; }).filter(Boolean);
  const points = a => a?.length ? `<ul class="rs-points">${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  const head = (title, aside) => `<h2 class="rs-h">${title}${aside ? `<span>${aside}</span>` : ''}</h2>`;

  const row = ({ logo, title, date, org, body, tint, print }) => `
    <article class="rs-item${print === false ? ' off-print' : ''}"${tint ? ` style="--tint:${tint}"` : ''}>
      ${logo ? `<img class="rs-logo" src="${logo}" alt="" loading="lazy">` : '<span class="rs-logo blank"></span>'}
      <div class="rs-body">
        <div class="rs-top"><h3>${title}</h3><span class="rs-date">${esc(date)}</span></div>
        <div class="rs-org">${org}</div>
        ${body}
      </div>
    </article>`;

  return frag(`
    <section class="wrap resume">
      <header class="page-head resume-head">
        <div class="resume-intro">
          <h1><span class="on-print">${esc(D.meta.name)}</span><span class="off-print">Résumé</span></h1>
          <p class="lede">${esc(r.statement || '')}</p>
        </div>
        <div class="resume-aside panel">
          <ul class="resume-contact">
            ${lines.map(l => `<li><span>${esc(l.label)}</span><a href="${l.href}"${l.href.startsWith('mailto') ? '' : ' target="_blank" rel="noopener"'}>${esc(l.handle)}</a></li>`).join('')}
          </ul>
          ${xp.resumePdf ? `<a class="resume-dl off-print" href="${xp.resumePdf}" download>Download the PDF</a>` : ''}
        </div>
      </header>

      <div class="resume-grid">
        <div class="resume-main">
          <section class="rs" data-reveal>
            ${head('Experience', `${word(xp.jobs.length)} roles`)}
            ${xp.jobs.map(j => row({
              logo: j.logo, title: esc(j.role), date: j.date,
              org: j.url ? `<a href="${j.url}" target="_blank" rel="noopener">${esc(j.company)}</a>` : esc(j.company),
              body: points(j.resumePoints),
            })).join('')}
          </section>

          <section class="rs" data-reveal>
            ${head('Selected projects', `<a href="#/work">all ${word(projects.length)}</a>`)}
            ${picks.map(p => row({
              logo: p.logo, tint: p.tint, print: p.print,
              title: `<a href="#/project/${p.slug}">${esc(p.title)}</a>${p.appStoreUrl ? '<span class="rs-flag">App Store</span>' : ''}`,
              date: `${year(p)}${ongoing(p) ? ' to now' : ''}`,
              org: `${originOf(p)}, ${teamOf(p).toLowerCase()} &middot; ${(p.techStack || []).slice(0, 5).map(esc).join(', ')}`,
              body: `<ul class="rs-points"><li>${esc(p.note)}</li></ul>`,
            })).join('')}
          </section>
        </div>

        <aside class="resume-side">
          <section class="rs panel" data-reveal>
            ${head('Education')}
            ${row({
              logo: xp.education.logo, title: esc(xp.education.degree), date: xp.education.dates,
              org: esc(xp.education.institution), body: points(xp.education.resumePoints),
            })}
          </section>

          <section class="rs panel" data-reveal>
            ${head('Skills')}
            <dl class="rs-skills">
              ${(D.about.skillGroups || []).map(g => `<div><dt>${esc(g.label)}</dt><dd>${g.items.map(esc).join(', ')}</dd></div>`).join('')}
            </dl>
          </section>

          ${r.activities?.length ? `
          <section class="rs panel" data-reveal>
            ${head('Activities')}
            ${r.activities.map(a => `
              <div class="rs-act${a.print === false ? ' off-print' : ''}">
                <div class="rs-act-org">${esc(a.org)}<span>${esc(a.place)}</span></div>
                <ul>${a.roles.map(x => `<li><span class="t">${esc(x.title)}</span>${x.date ? `<span class="m">${esc(x.date)}</span>` : ''}<span class="n">${esc(x.note)}</span></li>`).join('')}</ul>
              </div>`).join('')}
          </section>` : ''}

          ${r.certifications?.length ? `
          <section class="rs panel" data-reveal>
            ${head('Certifications')}
            <ul class="rs-certs">${r.certifications.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
          </section>` : ''}
        </aside>
      </div>
    </section>
  `);
};

PAGES.archive = () => {
  const P = D.presentations, CW = D.coursework;
  const ytId = url => url?.split('/embed/')[1]?.split('?')[0];
  const courses = CW.years.reduce((n, y) => n + y.semesters.reduce((m, s) => m + s.classes.length, 0), 0);
  return frag(`
    <section class="wrap">
      <header class="page-head">
        <h1>Archive</h1>
        <p class="lede">Class presentations and every course from four years at the University of Florida, with what came out of each one.</p>
        <nav class="page-jump" aria-label="Sections on this page">
          <a href="#/archive/presentations"><span class="k">Presentations</span><span class="m">${word(P.items.length)} talks</span></a>
          <a href="#/archive/coursework"><span class="k">Coursework</span><span class="m">${courses} courses${CW.overallGpa ? `, GPA ${esc(CW.overallGpa)}` : ''}</span></a>
        </nav>
      </header>
    </section>

    <section class="section wrap" id="presentations">
      <header class="section-head" data-reveal><h2>Presentations</h2><span class="aside">${word(P.items.length)} talks</span></header>
      <div class="pres-grid">
        ${P.items.map((p, i) => {
          const id = ytId(p.videoUrl);
          const thumb = id
            ? `<div class="pres-thumb playable" data-video="${p.videoUrl}" tabindex="0" role="button" aria-label="Play ${esc(p.title)}">
                 <img src="https://img.youtube.com/vi/${id}/maxresdefault.jpg" alt="" loading="lazy" onerror="this.onerror=null;this.src='https://img.youtube.com/vi/${id}/mqdefault.jpg'">
                 <span class="play">Play</span>
               </div>`
            : p.thumbnailUrl
              ? `<div class="pres-thumb static"><img src="${p.thumbnailUrl}" alt="" loading="lazy"></div>`
              : `<div class="pres-thumb"></div>`;
          return `
            <div class="pres" id="pres-${esc(p.id)}" data-reveal style="--i:${Math.min(i % 4, 4)}">
              ${thumb}
              <div>
                <div class="pres-course" data-subj="${subj(p.course)}">${esc(p.course || '')}</div>
                <div class="pres-title">${esc(p.title)}</div>
                <div class="pres-desc">${esc(p.description)}</div>
                <div class="pres-foot">
                  ${p.deckUrl ? `<a class="arrow-link" href="${p.deckUrl}" target="_blank" rel="noopener">Slides</a>` : '<span></span>'}
                  <span class="mono">${esc(p.date || '')}</span>
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>
    </section>

    <section class="section wrap" id="coursework">
      <header class="section-head" data-reveal><h2>Coursework</h2><span class="aside">${CW.overallGpa ? `GPA ${esc(CW.overallGpa)}` : ''}</span></header>
      <div class="cw">
        ${CW.years.flatMap(y => y.semesters.map(s => `
          <div class="cw-term" data-reveal>
            <h3><span>${esc(s.term)} ${esc(String(y.year))}</span><span class="mono">${word(s.classes.length)} courses</span></h3>
            ${s.classes.map(c => `
              <div class="cw-course">
                <div class="cw-code" data-subj="${subj(c.courseCode)}">${esc(c.courseCode || '')}</div>
                <div>
                  <div class="cw-name">${esc(c.course)}</div>
                  ${c.theme ? `<div class="cw-theme">${esc(c.theme)}</div>` : ''}
                  ${c.artifacts?.length ? `<div class="cw-arts">${c.artifacts.map(artLink).join('')}</div>` : ''}
                </div>
                <div class="cw-grade">${esc(c.grade?.letter || '')}${esc(c.grade?.symbol || '')}</div>
              </div>`).join('')}
          </div>`)).join('')}
      </div>
    </section>
  `);
};

// Course codes group by subject: PUR is the PR minor, C-prefixed codes are CS.
function subj(code) {
  const c = String(code || '').trim().toUpperCase();
  if (c.startsWith('PUR')) return 'pr';
  if (/^(CIS|COP|CEN|COT|CDA|CNT|CAP|EEL|EGN|MAC|MAS|STA)/.test(c)) return 'cs';
  return 'other';
}

function artLink(a) {
  const k = `<span class="k" data-type="${esc(a.type)}">${esc(a.type)}</span>`;
  if (a.href?.startsWith('/projects/'))      return `<a class="cw-art" href="#/project/${a.href.slice(10)}">${k}${esc(a.title)}</a>`;
  if (a.href?.startsWith('/presentations/')) return `<a class="cw-art" href="#/archive/pres-${a.href.slice(15)}">${k}${esc(a.title)}</a>`;
  if (a.href) return `<a class="cw-art" href="${a.href}" target="_blank" rel="noopener">${k}${esc(a.title)} ↗</a>`;
  return `<span class="cw-art" style="border:0">${k}${esc(a.title)}</span>`;
}

/* ------------------------------------------------------------------ */
/* behaviour after each render                                         */
/* ------------------------------------------------------------------ */

let revealObserver = null;

function afterRender() {
  // hero entrance
  const hero = $('#hero');
  if (hero) requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('in')));

  // reveal on scroll
  revealObserver?.disconnect();
  if (RM.matches) { $$('[data-reveal]').forEach(e => e.classList.add('in')); }
  else {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in'); revealObserver.unobserve(en.target);
        setTimeout(() => en.target.classList.add('settled'), 1200);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    $$('[data-reveal]').forEach(e => revealObserver.observe(e));
  }

  // Keep project navigation at the top while browser back restores its scroll position.
  $$('a[href^="#/project/"]').forEach(a => {
    a.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      navigate(a.getAttribute('href'));
    });
  });

  // A landscape first screenshot fills its frame alone; phones sit in a row.
  $$('.work-frame[data-kind="shots"]').forEach(f => {
    const img = f.querySelector('img');
    const check = () => { if (img.naturalWidth > img.naturalHeight) { f.dataset.kind = 'landscape'; f.querySelector('.work-frame-inner').style.setProperty('--n', 1);  } };
    if (img.complete && img.naturalWidth) check(); else img.addEventListener('load', check, { once: true });
  });

  $$('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    $$('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    let count = 0;
    $$('.project-entry').forEach(entry => {
      const show = filter === 'all' || entry.dataset.group === filter;
      entry.hidden = !show;
      if (show) { count++; entry.classList.add('in', 'settled'); }
    });
    $$('.project-group').forEach(group => { group.hidden = !$('.project-entry:not([hidden])', group); });
    $('.filter-result').textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
    measureParallax(); tickParallax();
  }));
  $$('details').forEach(el => el.addEventListener('toggle', () => { measureParallax(); tickParallax(); }));
  $$('img', app).forEach(img => { if (!img.complete) img.addEventListener('load', () => { measureParallax(); tickParallax(); }, { once: true }); });

  initLightboxTargets();
  initEmbeds();
  initVideos();
  initParallax();
  initTilt();
}

// Scroll-linked motion. Each [data-px] element gets a --py offset that its
// CSS transform reads: positive speeds drift up as you scroll, negative
// speeds drift down. "top" mode measures from the page top instead of the
// element's distance from the viewport centre, for things in the hero.
const PX = { items: [], raf: 0 };
function initParallax() {
  PX.items = [];
  if (RM.matches) return;
  $$('[data-px]').forEach(el => PX.items.push({ el, speed: parseFloat(el.dataset.px) || 0, top: 0, h: 0, mode: el.dataset.pxMode || 'center' }));
  measureParallax();
  tickParallax();
}
function measureParallax() {
  const y = window.scrollY;
  PX.items.forEach(it => {
    it.el.style.setProperty('--py', '0px');
    const r = it.el.getBoundingClientRect();
    it.top = r.top + y; it.h = r.height; it.last = null;
  });
}
function tickParallax() {
  const y = window.scrollY, vh = window.innerHeight;
  for (const it of PX.items) {
    let px;
    if (it.mode === 'top') px = y * it.speed;
    else {
      const centre = it.top + it.h / 2 - y;
      const p = (centre - vh / 2) / vh;
      if (p < -1.5 || p > 1.5) continue;
      px = -p * it.speed * vh;
    }
    const v = px.toFixed(1) + 'px';
    if (it.last !== v) { it.last = v; it.el.style.setProperty('--py', v); }
  }
}

// Pointer depth on the hero: planes with a positive tilt lean toward the
// cursor, negative ones away, so the headline and portrait separate.
const TILT = { items: [], tx: 0, ty: 0, x: 0, y: 0, raf: 0 };
function initTilt() {
  TILT.items = HOVER.matches && !RM.matches ? $$('[data-tilt]').map(el => ({ el, k: parseFloat(el.dataset.tilt) || 0 })) : [];
}
function tiltTick() {
  TILT.x += (TILT.tx - TILT.x) * 0.08; TILT.y += (TILT.ty - TILT.y) * 0.08;
  for (const it of TILT.items) {
    it.el.style.setProperty('--mx', (TILT.x * it.k).toFixed(2) + 'px');
    it.el.style.setProperty('--my', (TILT.y * it.k * 0.7).toFixed(2) + 'px');
  }
  if (Math.abs(TILT.tx - TILT.x) > 0.01 || Math.abs(TILT.ty - TILT.y) > 0.01) TILT.raf = requestAnimationFrame(tiltTick); else TILT.raf = 0;
}
window.addEventListener('pointermove', e => {
  if (!TILT.items.length) return;
  TILT.tx = (e.clientX / window.innerWidth - 0.5) * 2;
  TILT.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  if (!TILT.raf) TILT.raf = requestAnimationFrame(tiltTick);
}, { passive: true });
window.addEventListener('scroll', () => {
  if (!PX.raf) PX.raf = requestAnimationFrame(() => { PX.raf = 0; tickParallax(); });
}, { passive: true });
window.addEventListener('resize', () => { measureParallax(); tickParallax(); });
RM.addEventListener('change', () => {
  $$('[data-px], [data-tilt]').forEach(el => ['--py', '--mx', '--my'].forEach(k => el.style.removeProperty(k)));
  initParallax(); initTilt();
  if (RM.matches) { revealObserver?.disconnect(); $$('[data-reveal]').forEach(el => el.classList.add('in')); }
});
window.addEventListener('load', () => { measureParallax(); tickParallax(); });

function initLightboxTargets() {
  $$('.piece').forEach(f => {
    const open = () => openLightbox({ src: f.dataset.src, back: f.dataset.back, title: f.dataset.title, sub: f.dataset.sub, desc: f.dataset.desc });
    f.addEventListener('click', e => {
      // On touch, tapping a tee flips it; tapping the caption opens it.
      if (f.classList.contains('tee') && !HOVER.matches && e.target.closest('.piece-img')) { f.classList.toggle('flipped'); return; }
      open();
    });
    f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  $$('.proj-shot, .poster').forEach(f => {
    const img = f.querySelector('img');
    const open = () => openLightbox({ src: img.src, title: img.alt, sub: f.querySelector('figcaption')?.textContent || '' });
    f.addEventListener('click', open);
    f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}

function initEmbeds() {
  $$('[data-embed]').forEach(btn => {
    btn.addEventListener('click', () => {
      const slot = $('.embed-slot');
      const open = slot.querySelector('.embed');
      if (open) { open.remove(); btn.textContent = 'Play it here'; return; }
      slot.innerHTML = `<div class="embed"><iframe src="${btn.dataset.embed}" title="Playable build" loading="lazy" allow="fullscreen"></iframe>
        <div class="embed-bar"><a class="arrow-link" href="${btn.dataset.embed}" target="_blank" rel="noopener">Open full size</a></div></div>`;
      btn.textContent = 'Close';
      slot.scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth', block: 'nearest' });
    });
  });
}

function initVideos() {
  $$('.pres-thumb.playable').forEach(t => {
    const play = () => {
      t.innerHTML = `<iframe src="${t.dataset.video}${t.dataset.video.includes('?') ? '&' : '?'}autoplay=1&rel=0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen title="Video"></iframe>`;
      t.classList.remove('playable'); t.removeAttribute('tabindex'); t.removeAttribute('role');
    };
    t.addEventListener('click', play);
    t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); } });
  });
}

/* ------------------------------------------------------------------ */
/* lightbox                                                            */
/* ------------------------------------------------------------------ */

function openLightbox({ src, back, title = '', sub = '', desc = '' }) {
  const opener = document.activeElement;
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', title || 'Image');
  box.innerHTML = `
    <button class="lightbox-close" type="button">Close</button>
    <div class="lightbox-inner">
      <div class="lightbox-stage">
        <img class="front" src="${src}" alt="${esc(title)}">
        ${back ? `<img class="back" src="${back}" alt="${esc(title)}, back">` : ''}
      </div>
      <div class="lightbox-cap">
        <span class="t">${esc(title)}</span>
        <span class="s">${esc(sub)}</span>
        ${back ? `<button class="flip-btn" type="button">Flip</button>` : ''}
        ${desc ? `<span class="d">${esc(desc)}</span>` : ''}
      </div>
    </div>`;
  document.body.appendChild(box);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => box.classList.add('on'));

  const close = () => {
    box.classList.remove('on');
    document.removeEventListener('keydown', onKey);
    setTimeout(() => { box.remove(); document.body.style.overflow = ''; opener?.focus?.({ preventScroll: true }); }, 300);
  };
  const onKey = e => {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const buttons = $$('button', box), first = buttons[0], last = buttons[buttons.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  document.addEventListener('keydown', onKey);
  box.querySelector('.lightbox-close').onclick = close;
  box.addEventListener('click', e => { if (e.target === box) close(); });
  box.querySelector('.flip-btn')?.addEventListener('click', () => box.querySelector('.lightbox-stage').classList.toggle('flipped'));
  box.querySelector('.lightbox-close').focus({ preventScroll: true });
}

/* ------------------------------------------------------------------ */
/* boot                                                                */
/* ------------------------------------------------------------------ */

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
buildHeader();
buildFooter();
buildDrum();
$('#wordmark').addEventListener('click', e => {
  if (parseHash().head === '' ) { e.preventDefault(); window.scrollTo({ top: 0, behavior: RM.matches ? 'auto' : 'smooth' }); }
});
Promise.race([document.fonts?.ready, new Promise(r => setTimeout(r, 500))]).then(render);
