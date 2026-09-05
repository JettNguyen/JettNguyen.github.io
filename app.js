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
const teamOf   = p => p.collaboration === 'team' ? 'Team' : 'Solo';
const previewOf = p => p.screenshots?.[0]?.src || p.logo || '';

/* ------------------------------------------------------------------ */
/* routing                                                             */
/* ------------------------------------------------------------------ */

// Old links used #about, #projects and so on. Keep them working.
const LEGACY = {
  home: ['', null], about: ['about', null], projects: ['work', null],
  experience: ['', 'experience'], presentations: ['archive', 'presentations'],
  coursework: ['archive', 'coursework'], contact: ['', 'contact'],
};
const ROUTES = new Set(['', 'work', 'about', 'archive', 'project']);

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

function navigate(hash, vtEl) {
  if (vtEl && document.startViewTransition && !RM.matches) vtEl.style.viewTransitionName = 'work-image';
  pushed = true;
  location.hash = hash;
}

function render() {
  const next = parseHash();
  const key  = next.head + '/' + (next.arg || '');
  const sameDoc = current && current.head === next.head && (next.head !== 'project' || current.arg === next.arg);

  if (sameDoc) {                       // only an anchor changed
    if (next.arg) scrollToAnchor(next.arg);
    current = next; pushed = false; setNav(next);
    return;
  }

  if (current) scrollMemory.set(current.head + '/' + (current.arg || ''), window.scrollY);
  const restore = !pushed && scrollMemory.has(key) ? scrollMemory.get(key) : null;

  const build = PAGES[next.head] || PAGES[''];
  const update = () => {
    app.innerHTML = '';
    app.appendChild(build(next.arg));
    document.title = pageTitle(next);
    setNav(next);
    if (next.arg && next.head !== 'project') scrollToAnchor(next.arg, true);
    else window.scrollTo(0, restore ?? 0);
    afterRender();
  };

  if (document.startViewTransition && !RM.matches && current) {
    document.startViewTransition(update).finished.finally(() => {
      $$('[style*="view-transition-name"]').forEach(e => { e.style.viewTransitionName = ''; });
    });
  } else {
    update();
  }
  current = next; pushed = false;
}

function pageTitle({ head, arg }) {
  const n = D.meta.name;
  if (head === 'project') return `${bySlug(arg)?.title || 'Project'} · ${n}`;
  if (head === 'work')    return `Work · ${n}`;
  if (head === 'about')   return `About · ${n}`;
  if (head === 'archive') return `Archive · ${n}`;
  return n;
}

function scrollToAnchor(id, instant) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: instant || RM.matches ? 'auto' : 'smooth' });
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
];

function buildHeader() {
  const nav = $('#siteNav');
  nav.innerHTML = NAV.map(n => `<a href="${n.href}" data-head="${n.head}">${n.label}</a>`).join('')
    + (D.experience.resumePdf ? `<a href="${D.experience.resumePdf}" target="_blank" rel="noopener" data-resume>Résumé</a>` : '')
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
  if (D.experience.resumePdf) items.push({ label: 'Résumé', href: D.experience.resumePdf, ext: true });
  track.innerHTML = items.map(i => i.ext
    ? `<a class="tnav-item" href="${i.href}" target="_blank" rel="noopener">${i.label}<span class="ext">↗</span></a>`
    : `<a class="tnav-item" href="${i.href}" data-head="${i.head}">${i.label}</a>`).join('');
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
  const c = D.contact, ls = D.about.liveSignals || {};
  const email = c.links.find(l => l.href.startsWith('mailto:'));
  const others = c.links.filter(l => l !== email);
  const now = [
    ls.currentlyListening && [ls.listeningLabel || 'listening', ls.currentlyListening],
    ls.recentlyWatched    && ['watched', ls.recentlyWatched],
    ls.currentlyInto      && ['into', ls.currentlyInto],
  ].filter(Boolean);

  $('#siteFoot').innerHTML = `
    <div class="wrap foot-grid" id="contact">
      <div>
        <p class="foot-kicker">${esc(c.availability?.title || D.meta.statusText)}</p>
        ${email ? `<a class="foot-big" href="${email.href}">${esc(email.handle)}</a>` : ''}
        <p class="foot-avail">${esc(c.availability?.text || c.intro)}</p>
        ${now.length ? `<dl class="foot-now">${now.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
      </div>
      <ul class="foot-links">
        ${others.map(l => `<li><a href="${l.href}" target="_blank" rel="noopener"><span class="l">${esc(l.label)}</span><span class="h">${esc(l.handle)}</span></a></li>`).join('')}
        ${D.experience.resumePdf ? `<li><a href="${D.experience.resumePdf}" target="_blank" rel="noopener"><span class="l">Résumé</span><span class="h">PDF</span></a></li>` : ''}
      </ul>
      <p class="foot-colophon">
        <span>Set in Instrument Serif and Instrument Sans. Hand-written HTML, CSS, and JavaScript.</span>
        <span>The listening and watching lines update on their own from Spotify and Letterboxd.</span>
      </p>
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
  const bio = D.about.bio || [];
  const xp = D.experience;

  const headline = (h.headline || h.nameLines).map((l, i) =>
    `<span class="line"><span style="--i:${i}">${i === (h.headline || h.nameLines).length - 1 ? `<em>${esc(l)}</em>` : esc(l)}</span></span>`).join('');

  return frag(`
    <section class="hero wrap" id="hero">
      <div class="hero-grid">
        <div class="hero-text" data-px="0" data-tilt="6">
          <h1 class="display">${headline}</h1>
          <p class="hero-intro">${esc(h.intro || h.description)}</p>
          ${h.facts?.length ? `<ul class="hero-facts">${h.facts.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
        </div>
        <figure class="hero-portrait">
          <div class="frame" data-px="0.10" data-px-mode="top" data-tilt="-14"><img data-portrait src="${portraitSrc()}" alt="${esc(h.headshotAlt || D.meta.name)}" width="1400" height="1400" fetchpriority="high"></div>
          <figcaption>${esc(h.headshotCaption || '')}</figcaption>
        </figure>
      </div>
    </section>

    <section class="section wrap" id="work">
      <header class="section-head" data-reveal>
        <h2>Selected work</h2>
        <a class="arrow-link" href="#/work">All ${word(projects.length)} projects</a>
      </header>
      <ol class="work-list">
        ${selected.map((p, i) => workItem(p, i)).join('')}
      </ol>
    </section>

    ${bio[1] ? `
    <section class="section wrap" id="about-teaser">
      <div class="pull" data-reveal>
        <blockquote>${stripTags(bio[1])}</blockquote>
        <div class="pull-side">
          <p>${stripTags(bio[2] || '')}</p>
          <a class="arrow-link" href="#/about">More about me</a>
        </div>
      </div>
    </section>` : ''}

    <section class="section wrap" id="experience">
      <header class="section-head" data-reveal>
        <h2>Experience</h2>
        ${xp.resumePdf ? `<a class="arrow-link" href="${xp.resumePdf}" target="_blank" rel="noopener">Résumé as PDF</a>` : ''}
      </header>
      <div class="xp">
        ${xp.jobs.map((j, i) => `
          <div class="xp-row" data-reveal style="--i:${i}">
            <div class="xp-when">${j.logo ? `<img class="xp-logo" src="${j.logo}" alt="" loading="lazy">` : ''}<span>${esc(j.date)}</span></div>
            <div class="xp-body">
              <div class="xp-role">${esc(j.role)}</div>
              <div class="xp-org">${j.url ? `<a href="${j.url}" target="_blank" rel="noopener">${esc(j.company)}</a>` : esc(j.company)}</div>
              <ul class="xp-points">${j.highlights.map(x => `<li>${x}</li>`).join('')}</ul>
            </div>
          </div>`).join('')}
        <div class="xp-row" data-reveal style="--i:${xp.jobs.length}">
          <div class="xp-when">${xp.education.logo ? `<img class="xp-logo" src="${xp.education.logo}" alt="" loading="lazy">` : ''}<span>${esc(xp.education.dates)}</span></div>
          <div class="xp-body">
            <div class="xp-role">${esc(xp.education.degree)}</div>
            <div class="xp-org">${esc(xp.education.institution)}</div>
            <ul class="xp-points">${(xp.education.highlights || []).map(x => `<li>${x}</li>`).join('')}</ul>
          </div>
        </div>
      </div>
    </section>
  `);
};

function workItem(p, i) {
  const shots = (p.screenshots || []).slice(0, 3);
  // Each screenshot sits on its own plane: the middle one nearest, so it
  // moves the most as the page scrolls.
  const depth = [0.05, 0.11, 0.08];
  const imgs = shots.length
    ? shots.map((s, j) => `<img src="${s.src}" alt="${esc(s.alt)}" loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async" data-px="${depth[j] ?? 0.07}"${j === 0 ? ' data-vt' : ''}>`).join('')
    : `<img src="${p.logo}" alt="" data-vt data-px="0.06">`;
  return `
    <li class="work-item" data-reveal${p.tint ? ` style="--tint:${p.tint}"` : ''}>
      <a class="work-frame" data-kind="${shots.length ? 'shots' : 'logo'}" href="#/project/${p.slug}" aria-label="${esc(p.title)}">
        <div class="work-frame-inner" style="--n:${shots.length || 1}">${imgs}</div>
      </a>
      <div class="work-meta" data-px="-0.03">
        <h3>${p.logo ? `<img class="work-logo" src="${p.logo}" alt="">` : ''}<a href="#/project/${p.slug}">${esc(p.title)}</a></h3>
        <p>${esc(p.summary)}</p>
        <span class="mono">${esc(year(p))}${ongoing(p) ? ' to now' : ''} · ${esc(kind(p))}</span>
      </div>
    </li>`;
}

function stripTags(s) { return String(s).replace(/<[^>]+>/g, ''); }

PAGES.work = () => frag(`
  <section class="wrap">
    <header class="page-head">
      <h1>Work</h1>
      <p class="lede">${word(projects.length).replace(/^\w/, c => c.toUpperCase())} projects since ${esc(String(Math.min(...projects.map(year))))}, roughly newest first. Each row opens to a write-up with screenshots where I have them.</p>
    </header>
    <ol class="index">
      <li class="idx-head" aria-hidden="true"><span>No.</span><span>Project</span><span>What it is</span><span>Kind</span><span style="text-align:right">Year</span></li>
      ${projects.map((p, i) => `
        <li class="index-row" data-peek="${previewOf(p)}" data-reveal style="--i:${Math.min(i, 8)};--tint:${p.tint || 'transparent'}">
          <a href="#/project/${p.slug}">
            <span class="idx-n">${pad2(i + 1)}</span>
            <span class="idx-title">${p.logo ? `<img class="idx-logo" src="${p.logo}" alt="" loading="lazy">` : ''}${esc(p.title)}${p.status ? `<span class="flag">${esc(p.status)}</span>` : ''}</span>
            <span class="idx-sum">${esc(p.summary)}</span>
            <span class="idx-type">${esc(kind(p))}${p.origin === 'school' ? ', coursework' : ''}</span>
            <span class="idx-year">${esc(year(p))}</span>
          </a>
        </li>`).join('')}
    </ol>
  </section>
`);

PAGES.project = slug => {
  const p = bySlug(slug);
  if (!p) return frag(`<section class="wrap page-head"><a class="arrow-link crumb" href="#/work">Back to work</a><h1>Not found</h1></section>`);
  const i = projects.indexOf(p);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const d = p.details || {};
  const shots = p.screenshots || [];
  const links = [
    p.demoUrl   && `<a href="${p.demoUrl}" target="_blank" rel="noopener">${esc(p.demoLabel || 'Live site')} ↗</a>`,
    p.githubUrl && `<a href="${p.githubUrl}" target="_blank" rel="noopener">Source on GitHub ↗</a>`,
    p.embedUrl  && `<button class="text-link" type="button" data-embed="${p.embedUrl}">Play it here</button>`,
  ].filter(Boolean);

  const sec = (label, body) => body ? `<section class="proj-sec" data-reveal><h2>${label}</h2><div>${body}</div></section>` : '';

  return frag(`
    <article${p.tint ? ` style="--tint:${p.tint}"` : ''}>
      <div class="proj-band"><header class="proj-head wrap">
        <a class="arrow-link crumb" href="#/work">All work</a>
        <h1>${p.logo ? `<img src="${p.logo}" alt="">` : ''}${esc(p.title)}${p.status ? `<span class="status">${esc(p.status)}</span>` : ''}</h1>
        <p class="proj-summary">${esc(p.summary)}</p>
        <dl class="proj-meta">
          <div><dt>Year</dt><dd>${esc(p.date)}</dd></div>
          <div><dt>Context</dt><dd>${originOf(p)}, ${p.collaboration === 'team' ? 'with a team' : 'solo'}</dd></div>
          <div><dt>Built with</dt><dd>${(p.techStack || []).map(esc).join(', ')}</dd></div>
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
        ${sec('Problem', d.problem && `<p>${esc(d.problem)}</p>`)}
        ${sec('Observation', d.observation && `<p>${esc(d.observation)}</p>`)}
        ${sec('Hypothesis', d.hypothesis && `<p>${esc(d.hypothesis)}</p>`)}
        ${sec('Experiment', d.experiment && `<p>${esc(d.experiment)}</p>`)}
        ${sec('Outcome', d.outcome && `<p>${esc(d.outcome)}</p>`)}
        ${p.study ? sec('User study', studyHtml(p.study)) : ''}
        ${sec('Reflection', d.reflection && `<p>${esc(d.reflection)}</p>`)}
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
  const facts = (a.infoFields || []).filter(f => f.label !== 'GPA');
  return frag(`
    <section class="wrap">
      <header class="page-head"><h1>About</h1></header>
      <div class="about-grid">
        <div class="about-bio">
          ${a.bio.map(p => `<p>${p}</p>`).join('')}
        </div>
        <aside class="about-side">
          <div class="frame"><img data-portrait src="${portraitSrc()}" alt="${esc(h.headshotAlt || D.meta.name)}" width="1400" height="1400"></div>
          <dl class="facts">
            ${facts.map(f => `<div><dt>${esc(f.label)}</dt><dd>${f.href ? `<a href="${f.href}">${esc(f.value)}</a>` : esc(f.value)}</dd></div>`).join('')}
          </dl>
        </aside>
      </div>
    </section>

    <section class="section wrap">
      <header class="section-head" data-reveal><h2>Skills</h2></header>
      <dl class="skills" data-reveal>
        ${(a.skillGroups || []).map(g => `<div><dt>${esc(g.label)}</dt><dd>${g.items.map(esc).join(', ')}</dd></div>`).join('')}
      </dl>
    </section>

    <section class="section wrap essay">
      ${(a.interestSections || []).map(sec => `
        <div>
          <div class="essay-head" data-reveal>
            <h3>${esc(sec.title)}</h3>
            <p>${esc(sec.intro)}</p>
          </div>
          <div class="shelf" data-aspect="${sec.imageAspect || 'square'}">
            ${sec.items.map((it, i) => piece(it, sec.key === 'vintage', i)).join('')}
          </div>
        </div>`).join('')}
      ${a.curiosities?.length ? `
        <div>
          <div class="essay-head" data-reveal>
            <h3>Curiosities</h3>
            <p>Themes I keep coming back to across creation, interaction design, systems, and human behavior.</p>
          </div>
          <ol class="questions">
            ${a.curiosities.map((c, i) => `
              <li data-reveal style="--i:${i}">
                <div>
                  <h4>${esc(c.title)}</h4>
                  <div class="sub">${esc(c.subtitle)}</div>
                  <p>${esc(c.description)}</p>
                </div>
              </li>`).join('')}
          </ol>
        </div>` : ''}
    </section>
  `);
};

function piece(it, isTee, i) {
  const back = isTee ? it.imageUrl.replace(/-front\.(\w+)$/, '-back.$1') : '';
  return `
    <figure class="piece${isTee ? ' tee' : ''}" data-reveal style="--i:${Math.min(i, 8)}" tabindex="0" role="button"
      data-src="${it.imageUrl}" ${back ? `data-back="${back}"` : ''} data-title="${esc(it.title)}" data-sub="${esc(it.subtitle || '')}" data-desc="${esc(it.description || '')}">
      <div class="piece-img">
        <img class="front" src="${it.imageUrl}" alt="${esc(it.title)}" loading="lazy" decoding="async">
        ${back ? `<img class="back" src="${back}" alt="" loading="lazy" decoding="async" onerror="this.remove()">` : ''}
      </div>
      <figcaption>
        <div class="piece-title">${esc(it.title)}</div>
        ${it.subtitle ? `<div class="piece-sub">${esc(it.subtitle)}</div>` : ''}
        ${it.description ? `<div class="piece-desc">${esc(it.description)}</div>` : ''}
      </figcaption>
    </figure>`;
}

PAGES.archive = () => {
  const P = D.presentations, CW = D.coursework;
  const ytId = url => url?.split('/embed/')[1]?.split('?')[0];
  return frag(`
    <section class="wrap">
      <header class="page-head">
        <h1>Archive</h1>
        <p class="lede">Class presentations and every course from four years at the University of Florida, with what came out of each one.</p>
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

  // route links that carry an image into the next page
  $$('a[href^="#/project/"]').forEach(a => {
    a.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      const vt = a.querySelector('[data-vt]') || (a.closest('.index-row') && $('#peek').classList.contains('on') ? $('#peek img') : null);
      navigate(a.getAttribute('href'), vt);
    });
  });

  // A landscape first screenshot fills its frame alone; phones sit in a row.
  $$('.work-frame[data-kind="shots"]').forEach(f => {
    const img = f.querySelector('img');
    const check = () => { if (img.naturalWidth > img.naturalHeight) { f.dataset.kind = 'landscape'; f.querySelector('.work-frame-inner').style.setProperty('--n', 1); img.dataset.px = '0.07'; } };
    if (img.complete && img.naturalWidth) check(); else img.addEventListener('load', check, { once: true });
  });

  initPeek();
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
    it.top = r.top + y; it.h = r.height;
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
window.addEventListener('load', () => { measureParallax(); tickParallax(); });

// A preview that follows the cursor over index rows.
let peekRaf = 0;
function initPeek() {
  const peek = $('#peek'), img = $('#peek img');
  if (!HOVER.matches) return;
  let tx = 0, ty = 0, x = 0, y = 0, on = false;
  const tick = () => {
    x += (tx - x) * 0.18; y += (ty - y) * 0.18;
    peek.style.left = x + 'px'; peek.style.top = y + 'px';
    if (on || Math.abs(tx - x) > 0.5) peekRaf = requestAnimationFrame(tick); else peekRaf = 0;
  };
  $$('.index-row[data-peek]').forEach(row => {
    row.addEventListener('pointerenter', e => {
      const src = row.dataset.peek; if (!src) return;
      if (img.getAttribute('src') !== src) img.src = src;
      tx = e.clientX + 40; ty = e.clientY; if (!on) { x = tx; y = ty; }
      on = true; peek.classList.add('on');
      if (!peekRaf) peekRaf = requestAnimationFrame(tick);
    });
    row.addEventListener('pointermove', e => { tx = e.clientX + 40; ty = e.clientY; });
    row.addEventListener('pointerleave', () => { on = false; peek.classList.remove('on'); });
  });
}

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
  const onKey = e => { if (e.key === 'Escape') close(); };
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
