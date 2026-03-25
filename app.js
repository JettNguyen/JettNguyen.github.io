const D = window.siteData;
const mk = (tag, cls='', html='') => {
  const e = document.createElement(tag);
  if (cls)  e.className   = cls;
  if (html) e.innerHTML   = html;
  return e;
};
const div  = (cls, html='') => mk('div', cls, html);
const span = (cls, txt) => { const s = mk('span', cls); s.textContent = txt; return s; };

function sectionHeader(lbl, lines) {
  const h = div('section-header sr');
  const l = div('section-label'); l.textContent = lbl; h.appendChild(l);
  const t = div('section-title');
  lines.forEach(ln => {
    const rl = div('reveal-line');
    rl.appendChild(span('reveal-word', ln));
    t.appendChild(rl);
  });
  h.appendChild(t);
  return h;
}

function logoOrPlaceholder(url, alt, name, cls) {
  if (url) {
    const img = mk('img', cls); img.src = url; img.alt = alt;
    img.onerror = () => {
      const ph = div(cls.replace('large', 'placeholder')); ph.textContent = name[0]; img.replaceWith(ph);
    };
    return img;
  }
  const ph = div(cls.replace('large', 'placeholder')); ph.textContent = name[0]; return ph;
}

function scrollToSection(page, id) {
  const prefix = page === 'projects' ? 'project' : 'presentation';
  const highlight = el => {
    el.style.transition = 'all 0.3s ease';
    el.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
    el.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    setTimeout(() => { el.style.backgroundColor = ''; el.style.borderColor = ''; }, 2000);
  };
  const scroll = () => {
    const el = document.getElementById(`${prefix}-${id}`);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); highlight(el); }
  };
  if (currentPage !== page) { navigate(page, 0, 0); setTimeout(scroll, 600); }
  else scroll();
}

const builders = {};

builders.home = () => {
  const { home } = D;
  const layout   = div('home-layout');
  const left     = div('home-left');

  const ey = div('home-eyebrow'); ey.id = 'eyebrow'; ey.textContent = home.eyebrow; left.appendChild(ey);

  const nameEl = div('home-name');
  home.nameLines.forEach((line, li) => {
    const nl = div('name-line');
    const nw = mk('span', 'name-word'); nw.id = 'nw' + li;
    if (li === home.accentLine) {
      nw.textContent = line.slice(0, -1);
      const acc = mk('span', 'accent-green'); acc.textContent = line.slice(-1); nw.appendChild(acc);
    } else {
      nw.textContent = line;
    }
    nl.appendChild(nw); nameEl.appendChild(nl);
  });
  left.appendChild(nameEl);

  const desc = mk('p', 'home-desc'); desc.id = 'homeDesc'; desc.textContent = home.description; left.appendChild(desc);

  const ctas = div('home-ctas'); ctas.id = 'homeCtas';
  home.ctas.forEach(c => {
    const b = mk('button', c.style === 'primary' ? 'btn-primary' : 'btn-ghost');
    b.textContent = c.label;
    b.onclick = e => navigate(c.page, e.clientX, e.clientY);
    ctas.appendChild(b);
  });
  left.appendChild(ctas);

  const tags = div('home-tags'); tags.id = 'homeTags';
  home.tags.forEach(t => {
    tags.appendChild(Object.assign(mk('span', 'tag' + (t.highlight ? ' hl' : '')), { textContent: t.label }));
  });
  left.appendChild(tags);
  layout.appendChild(left);

  const right = div('home-right'); right.id = 'homeRight';
  const wrap  = div('headshot-wrap');
  wrap.appendChild(div('headshot-glow'));
  const frame = div('headshot-frame');
  if (home.headshotUrl) {
    const img = mk('img'); img.src = home.headshotUrl; img.alt = home.headshotAlt || D.meta.name;
    img.onerror = () => {
      img.style.display = 'none';
      const ph = div('hs-placeholder'); ph.textContent = D.meta.initials; frame.appendChild(ph);
    };
    frame.appendChild(img);
  } else {
    const ph = div('hs-placeholder'); ph.textContent = D.meta.initials; frame.appendChild(ph);
  }
  wrap.appendChild(frame);
  const meta = div('hs-meta'); meta.innerHTML = home.headshotCaption || '';
  right.appendChild(wrap); right.appendChild(meta);
  layout.appendChild(right);
  return layout;
};

builders.about = () => {
  const frag = document.createDocumentFragment();
  const { about } = D;
  
  frag.appendChild(sectionHeader(about.sectionLabel, about.sectionTitle));

  // Live Status / Signals
  const ls = about.liveSignals;
  const signals = [
    ls.currentlyListening && { label: 'listening', val: ls.currentlyListening },
    ls.recentlyWatched    && { label: 'watched',   val: ls.recentlyWatched },
    ls.currentlyInto      && { label: 'into',      val: ls.currentlyInto },
  ].filter(Boolean);

  if (signals.length) {
    const sig = div('live-signals sr');
    signals.forEach(s => {
      const si = div('signal-item');
      si.innerHTML = `<div class="signal-dot"></div><span class="signal-label">${s.label}</span><span class="signal-value">${s.val}</span>`;
      sig.appendChild(si);
    });
    frag.appendChild(sig);
  }

  // Bio & Sidebar
  const top = div('about-top');
  const text = div('about-text sr');
  about.bio.forEach(p => { 
    const para = mk('p'); 
    para.innerHTML = p; 
    text.appendChild(para); 
  });
  top.appendChild(text);

  const sidebar = div('sr');
  about.infoFields.forEach(f => {
    sidebar.appendChild(Object.assign(div('info-label'), { textContent: f.label }));
    const val = div('info-value');
    if (f.href) { 
        val.innerHTML = `<a href="${f.href}">${f.value}</a>`; 
    } else {
        val.textContent = f.value;
    }
    sidebar.appendChild(val);
  });
  
  sidebar.appendChild(Object.assign(div('skills-section-title'), { textContent: 'Technical Skills' }));
  about.skills.forEach(s => {
    const row = div('skill-row');
    row.innerHTML = `
      <span class="skill-name">${s.name}</span>
      <div class="skill-bar"><div class="skill-fill" data-w="${s.weight}"></div></div>
    `;
    sidebar.appendChild(row);
  });
  top.appendChild(sidebar);
  frag.appendChild(top);

  // Interest Sections (Music, Film, etc.)
  about.interestSections.forEach(sec => {
    const section = div('interest-section sr');
    section.innerHTML = `
      <div class="interest-section-header">
        <h3 class="interest-section-title">${sec.title}</h3>
      </div>
      <p class="interest-section-intro">${sec.intro}</p>
    `;

    const grid = div('interest-grid');
    if (sec.imageAspect) grid.dataset.aspect = sec.imageAspect;

    sec.items.forEach(item => {
      const isTee = sec.key === 'vintage';
      const card = div(`interest-card ${isTee ? 'tee-card' : ''}`);

      if (item.imageUrl) {
        if (isTee) {
          const imgContainer = div('card-img-container');

          const frontImg = mk('img', 'interest-card-img tee-front');
          frontImg.src = item.imageUrl;
          frontImg.alt = item.title;
            frontImg.loading = 'lazy';
            frontImg.decoding = 'async';
          imgContainer.appendChild(frontImg);

          const backImg = mk('img', 'interest-card-img back-img');
          backImg.src = item.imageUrl.replace('-front.png', '-back.png');
          backImg.onerror = () => backImg.remove();
            backImg.loading = 'lazy';
            backImg.decoding = 'async';
          imgContainer.appendChild(backImg);

          // Touch affordance: show which side is currently displayed.
          const flipHint = div('tee-flip-hint');
          flipHint.appendChild(Object.assign(div('tee-flip-icon'), { textContent: '↺' }));
          flipHint.appendChild(Object.assign(div('tee-flip-label'), { textContent: 'FRONT' }));
          imgContainer.appendChild(flipHint);

          card.appendChild(imgContainer);
        } else {
          const imgContainer = div('card-img-container');
          imgContainer.dataset.aspect = sec.imageAspect || 'square';
          const img = mk('img', 'interest-card-img');
          img.src = item.imageUrl;
          img.alt = item.title;
          img.loading = 'lazy';
          img.decoding = 'async';
          imgContainer.appendChild(img);
          card.appendChild(imgContainer);
        }
      }

      const body = div('interest-card-body');
      body.innerHTML = `
        <div class="interest-card-title">${item.title}</div>
        ${item.subtitle ? `<div class="interest-card-sub">${item.subtitle}</div>` : ''}
        ${item.description ? `<div class="interest-card-desc">${item.description}</div>` : ''}
      `;
      
      if (item.tags?.length) {
        const tgs = div('interest-card-tags');
        item.tags.forEach(t => tgs.appendChild(span('interest-card-tag', t)));
        body.appendChild(tgs);
      }
      
      card.appendChild(body);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    frag.appendChild(section);
  });

  const curSec = div('interest-section sr');
  const curHdr = div('interest-section-header');
  curHdr.appendChild(Object.assign(mk('h3', 'interest-section-title'), { textContent: 'Curiosities' }));
  curSec.appendChild(curHdr);
  curSec.appendChild(Object.assign(mk('p', 'interest-section-intro'), { textContent: 'Themes I keep coming back to across creation, interaction design, systems, and human behavior.' }));

  const curGrid = div('curiosity-grid');
  about.curiosities.forEach(c => {
    const card = div('curiosity-card');
    card.appendChild(Object.assign(div('curiosity-icon'),  { textContent: c.icon }));
    card.appendChild(Object.assign(div('curiosity-title'), { textContent: c.title }));
    card.appendChild(Object.assign(div('curiosity-sub'),   { textContent: c.subtitle }));
    card.appendChild(Object.assign(div('curiosity-desc'),  { textContent: c.description }));
    curGrid.appendChild(card);
  });
  curSec.appendChild(curGrid);
  curSec.style.paddingBottom = '80px';
  frag.appendChild(curSec);
  return frag;
};

builders.projects = () => {
  const frag = document.createDocumentFragment();
  frag.appendChild(sectionHeader(D.projects.sectionLabel, D.projects.sectionTitle));
  const list = div('projects-list');

  D.projects.items.forEach(p => {
    const item    = div('project-item sr');
    item.id = `project-${p.slug}`;
    
    const logoCol = div('proj-logo-col');
    logoCol.appendChild(logoOrPlaceholder(p.logo, p.title, p.title, 'proj-logo-large'));
    item.appendChild(logoCol);

    const body = div('proj-body');
    if (p.status) body.appendChild(Object.assign(div('proj-status'), { textContent: p.status }));
    body.appendChild(Object.assign(div('proj-title'), { textContent: p.title }));
    body.appendChild(Object.assign(mk('p', 'proj-desc'), { textContent: p.summary }));

    const tags = div('proj-tags');
    p.techStack.forEach(t => tags.appendChild(span('proj-tag', t)));
    body.appendChild(tags);

    const lnks = div('proj-links');
    if (p.githubUrl) lnks.appendChild(Object.assign(mk('a', 'proj-link'), { href: p.githubUrl, target: '_blank', textContent: 'GitHub' }));
    if (p.demoUrl)   lnks.appendChild(Object.assign(mk('a', 'proj-link'), { href: p.demoUrl,   target: '_blank', textContent: 'Live Demo' }));
    if (p.details) {
      const detailsA = Object.assign(mk('a', 'proj-link details-link'), { href: '#', textContent: 'Details' });
      detailsA.onclick = (e) => { e.preventDefault(); openDetailsModal(p); };
      lnks.appendChild(detailsA);
    }
    if (lnks.children.length) body.appendChild(lnks);

    item.appendChild(body);
    list.appendChild(item);
  });

  frag.appendChild(list);
  return frag;
};

builders.experience = () => {
  const frag = document.createDocumentFragment();
  frag.appendChild(sectionHeader(D.experience.sectionLabel, D.experience.sectionTitle));
  const tl  = div('timeline');
  tl.appendChild(Object.assign(div('tl-section-label'), { textContent: 'Education' }));
  const edu = D.experience.education;

  const eduBlock = div('tl-item sr');
  const eduLeft  = div('tl-left-col');
  eduLeft.appendChild(logoOrPlaceholder(edu.logo, edu.institution, edu.institution, 'tl-logo-large'));
  const eduDates = div('tl-date'); eduDates.innerHTML = edu.dates.replace(' - ', '<br><span style="color:var(--accent3); font-size: 14px">↓</span><br>'); eduLeft.appendChild(eduDates);
  eduBlock.appendChild(eduLeft);

  const eduBody = div('tl-body');
  eduBody.appendChild(Object.assign(div('edu-inst'), { textContent: edu.institution }));
  eduBody.appendChild(Object.assign(div('edu-deg'),  { textContent: edu.degree }));
  const gpa = div('edu-deg'); gpa.textContent = 'GPA: ' + edu.gpa; gpa.style.color = 'var(--muted)'; eduBody.appendChild(gpa);
  eduBody.appendChild(Object.assign(div('edu-date'), { textContent: edu.date }));
  if (D.experience.resumePdf) {
    eduBody.appendChild(Object.assign(mk('a', 'resume-dl'), { href: D.experience.resumePdf, target: '_blank', textContent: '↓ Download Resume' }));
  }
  eduBlock.appendChild(eduBody);
  tl.appendChild(eduBlock);
  tl.appendChild(Object.assign(div('tl-section-label'), { textContent: 'Work Experience' }));

  D.experience.jobs.forEach(j => {
    const item    = div('tl-item sr');
    const leftCol = div('tl-left-col');
    leftCol.appendChild(logoOrPlaceholder(j.logo, j.company, j.company, 'tl-logo-large'));
    const dc = div('tl-date'); dc.innerHTML = j.date.replace(' - ', '<br><span style="color:var(--accent3); font-size: 14px">↓</span><br>'); leftCol.appendChild(dc);
    item.appendChild(leftCol);

    const body = div('tl-body');
    body.appendChild(Object.assign(div('tl-role'), { textContent: j.role }));
    body.appendChild(Object.assign(div('tl-org'),  { textContent: j.company }));
    const pts = mk('ul', 'tl-points');
    j.highlights.forEach(h => pts.appendChild(Object.assign(mk('li'), { textContent: h })));
    body.appendChild(pts);
    item.appendChild(body);
    tl.appendChild(item);
  });

  frag.appendChild(tl);
  return frag;
};

builders.presentations = () => {
  const frag = document.createDocumentFragment();
  frag.appendChild(sectionHeader(D.presentations.sectionLabel, D.presentations.sectionTitle));
  const grid = div('pres-grid');

  D.presentations.items.forEach(p => {
    const card = div('pres-card sr');
    card.id = `presentation-${p.id}`;

    if (p.videoUrl) {
      const ytId      = p.videoUrl.split('/embed/')[1]?.split('?')[0];
      const thumbWrap = div('yt-thumb-wrap');
      const thumbImg = mk('img'); thumbImg.alt = p.title; thumbImg.loading = 'lazy';
      thumbImg.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      thumbWrap.appendChild(thumbImg);
      const playBtn  = div('yt-play-btn');
      const playIcon = div('yt-play-icon'); playIcon.textContent = '▶'; playBtn.appendChild(playIcon);
      thumbWrap.appendChild(playBtn);
      playBtn.addEventListener('click', () => {
        const yt     = div('yt-wrap');
        const iframe = mk('iframe');
        iframe.src             = p.videoUrl + '?autoplay=1&rel=0';
        iframe.allow           = 'accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture';
        iframe.allowFullscreen = true;
        yt.appendChild(iframe);
        thumbWrap.replaceWith(yt);
      });
      card.appendChild(thumbWrap);
    } else if (p.thumbnailUrl) {
      const img = mk('img', 'pres-thumb-static'); img.src = p.thumbnailUrl; img.alt = p.title; img.loading = 'lazy';
      img.onerror = () => { img.style.display = 'none'; };
      card.appendChild(img);
    } else {
      card.appendChild(Object.assign(div('pres-thumb-placeholder'), { textContent: '◈' }));
    }

    const body     = div('pres-body');
    if (p.course) body.appendChild(Object.assign(div('pres-course'), { textContent: p.course }));
    const titleRow = div('pres-title-row');
    titleRow.appendChild(Object.assign(div('pres-title'), { textContent: p.title }));
    if (p.date) titleRow.appendChild(Object.assign(div('pres-date'), { textContent: p.date }));
    body.appendChild(titleRow);
    body.appendChild(Object.assign(div('pres-desc'), { textContent: p.description }));
    const lnks = div('pres-links');
    if (p.deckUrl) lnks.appendChild(Object.assign(mk('a', 'pres-link'), { href: p.deckUrl, target: '_blank', textContent: 'Slides' }));
    if (lnks.children.length) body.appendChild(lnks);
    card.appendChild(body);
    grid.appendChild(card);
  });

  frag.appendChild(grid);
  return frag;
};

builders.coursework = () => {
    const frag = document.createDocumentFragment();
    const CW = D.coursework;
    
    // Section header
    frag.appendChild(sectionHeader(CW.sectionLabel, CW.sectionTitle));
    
    // Summary section with GPA and legend
    const summary = div('cw-summary');
    
    const gpaBlock = div('cw-gpa');
    gpaBlock.appendChild(Object.assign(div('cw-gpa-label'), { textContent: 'Overall GPA' }));
    gpaBlock.appendChild(Object.assign(div('cw-gpa-val'), { textContent: CW.overallGpa }));
    summary.appendChild(gpaBlock);
    
    const legend = div('cw-legend');
    const TYPE_COLORS = {
        project: '#44efb4',
        presentation: '#44b4ef',
        report: '#f97316',
        homework: '#9b44ef',
        other: '#ef44aa'
    };
    
    CW.artifactTypes.forEach(at => {
        const li = div('cw-legend-item');
        const dot = div('cw-legend-dot');
        dot.style.background = TYPE_COLORS[at.type];
        li.appendChild(dot);
        li.appendChild(Object.assign(div('cw-legend-label'), { textContent: at.label }));
        legend.appendChild(li);
    });
    summary.appendChild(legend);
    frag.appendChild(summary);
    
    // Years container
    const yearsContainer = div('cw-years');
    
    CW.years.forEach(yr => {
        // Calculate stats for the year
        let totalCourses = 0;
        let totalArtifacts = 0;
        yr.semesters.forEach(sem => {
            totalCourses += sem.classes.length;
            sem.classes.forEach(cls => {
                totalArtifacts += cls.artifacts?.length || 0;
            });
        });
        
        const yearCard = div('cw-year-card');
        
        // Year header
        const yearHeader = div('cw-year-header');
        yearHeader.appendChild(Object.assign(div('cw-year-title'), { textContent: yr.year }));
        
        const yearStats = div('cw-year-stats');
        yearStats.appendChild(Object.assign(div(''), { textContent: `${yr.semesters.length} semester${yr.semesters.length !== 1 ? 's' : ''}` }));
        yearStats.appendChild(Object.assign(div(''), { textContent: `${totalCourses} course${totalCourses !== 1 ? 's' : ''}` }));
        if (totalArtifacts > 0) {
            yearStats.appendChild(Object.assign(div(''), { textContent: `${totalArtifacts} artifact${totalArtifacts !== 1 ? 's' : ''}` }));
        }
        yearStats.appendChild(Object.assign(div('cw-year-chevron'), { textContent: '▾' }));
        yearHeader.appendChild(yearStats);
        yearCard.appendChild(yearHeader);
        
        // Year content
        const yearContent = div('cw-year-content');
        const semestersGrid = div('cw-semesters-grid');
        
        yr.semesters.forEach(sem => {
            const semesterBlock = div('cw-semester-block');
            
            // Semester header
            const semHeader = div('cw-semester-header');
            const semInfo = div('cw-semester-info');
            semInfo.appendChild(Object.assign(div('cw-semester-name'), { textContent: `${sem.term}` }));
            if (sem.termGpa && sem.termGpa !== 'TBA') {
                semInfo.appendChild(Object.assign(div('cw-semester-gpa'), { textContent: `GPA ${sem.termGpa}` }));
            } else if (sem.termGpa === 'TBA') {
                const tbaBadge = div('cw-semester-gpa');
                tbaBadge.textContent = 'TBA';
                tbaBadge.style.opacity = '0.5';
                semInfo.appendChild(tbaBadge);
            }
            semHeader.appendChild(semInfo);
            semHeader.appendChild(Object.assign(div('cw-semester-chevron'), { textContent: '▾' }));
            semesterBlock.appendChild(semHeader);
            
            // Semester courses
            const semesterCourses = div('cw-semester-courses');
            
            sem.classes.forEach(cls => {
                const courseCard = div('cw-course-card');
                const hasArtifacts = cls.artifacts?.length > 0;
                
                // Course header
                const courseHeader = div('cw-course-header');
                const courseLeft = div('cw-course-left');
                
                if (cls.courseCode) {
                    courseLeft.appendChild(Object.assign(div('cw-course-code'), { textContent: cls.courseCode }));
                }
                courseLeft.appendChild(Object.assign(div('cw-course-name'), { textContent: cls.course }));
                
                courseHeader.appendChild(courseLeft);
                
                const gradeClass = cls.grade.letter === 'TBA' ? 'tba' : cls.grade.letter[0];
                const gradeEl = Object.assign(div(`cw-course-grade ${gradeClass}`), { textContent: cls.grade.letter + (cls.grade.symbol || '') });
                courseHeader.appendChild(gradeEl);
                courseHeader.appendChild(Object.assign(div('cw-course-chevron'), { textContent: '▾' }));
                courseCard.appendChild(courseHeader);
                
                // Course content
                if (cls.theme || hasArtifacts) {
                    if (cls.theme) {
                        courseCard.appendChild(Object.assign(div('cw-course-theme'), { textContent: cls.theme }));
                    }
                    
                    const artifactsContainer = div('cw-course-artifacts');
                    
                    if (hasArtifacts) {
                        const artifactsGrid = div('cw-artifacts-grid');
                        
                        cls.artifacts.forEach(art => {
                        const isProjectLink = art.href && art.href.startsWith('/projects/');
                        const isPresentationLink = art.href && art.href.startsWith('/presentations/');
                        const projectSlug = isProjectLink ? art.href.replace('/projects/', '') : null;
                        const presentationId = isPresentationLink ? art.href.replace('/presentations/', '') : null;
                        
                        let associatedData = null;
                        let logoUrl = null;
                        
                        if (isProjectLink && projectSlug) {
                          associatedData = D.projects.items.find(p => p.slug === projectSlug);
                          if (associatedData && associatedData.logo) {
                            logoUrl = associatedData.logo;
                          }
                        } else if (isPresentationLink && presentationId) {
                          associatedData = D.presentations.items.find(p => p.id === presentationId);
                          // Presentations don't have logos, but we could use thumbnail if available
                          if (associatedData && associatedData.thumbnailUrl) {
                            logoUrl = associatedData.thumbnailUrl;
                          }
                        }
                        
                        const iconMap = {
                          project: { icon: '◈', cls: 'project' },
                          presentation: { icon: '▶', cls: 'presentation' },
                          report: { icon: '≡', cls: 'report' },
                          homework: { icon: '✎', cls: 'homework' },
                          other: { icon: '◇', cls: 'other' }
                        };
                        const iconInfo = iconMap[art.type] || iconMap.other;
                        
                        const hasLink = isProjectLink || isPresentationLink || !!art.href;
                        const artifactCard = document.createElement(art.href && !isProjectLink && !isPresentationLink ? 'a' : 'div');
                        artifactCard.className = 'cw-artifact-card' + (hasLink ? '' : ' no-link');

                        if (!isProjectLink && !isPresentationLink && art.href) {
                          artifactCard.href = art.href;
                          artifactCard.target = '_blank';
                        } else if (isProjectLink) {
                          artifactCard.addEventListener('click', () => scrollToSection('projects', projectSlug));
                        } else if (isPresentationLink) {
                          artifactCard.addEventListener('click', () => scrollToSection('presentations', presentationId));
                        }
                        
                        const iconContainer = div('cw-artifact-icon-container');
                        if (logoUrl) {
                          const logoImg = mk('img', 'cw-artifact-logo');
                          logoImg.src = logoUrl;
                          logoImg.alt = art.title;
                          logoImg.onerror = () => {
                            logoImg.style.display = 'none';
                            const fallbackIcon = div(`cw-artifact-icon ${iconInfo.cls}`);
                            fallbackIcon.textContent = iconInfo.icon;
                            iconContainer.appendChild(fallbackIcon);
                          };
                          iconContainer.appendChild(logoImg);
                        } else {
                          const iconDiv = div(`cw-artifact-icon ${iconInfo.cls}`);
                          iconDiv.textContent = iconInfo.icon;
                          iconContainer.appendChild(iconDiv);
                        }
                        artifactCard.appendChild(iconContainer);
                        
                        const contentDiv = div('cw-artifact-content');
                        contentDiv.appendChild(Object.assign(div('cw-artifact-title'), { textContent: art.title }));
                        if (art.note) {
                          contentDiv.appendChild(Object.assign(div('cw-artifact-note'), { textContent: art.note }));
                        }
                        artifactCard.appendChild(contentDiv);
                        
                        const badge = div('cw-artifact-badge ' + iconInfo.cls);

                        const badgeIcon = mk('span', 'badge-icon');
                        badgeIcon.textContent = iconInfo.icon;
                        badge.appendChild(badgeIcon);

                        const badgeText = mk('span', 'badge-text');
                        badgeText.textContent = art.type;
                        badge.appendChild(badgeText);

                        artifactCard.appendChild(badge);
                        
                        if (isProjectLink || isPresentationLink) {
                          const arrow = div('cw-artifact-arrow');
                          arrow.textContent = '↗';
                          artifactCard.appendChild(arrow);
                        }
                        
                        artifactsGrid.appendChild(artifactCard);
                      });
                        
                        artifactsContainer.appendChild(artifactsGrid);
                    } else {
                        artifactsContainer.appendChild(Object.assign(div('cw-no-artifacts'), { textContent: 'No shareable artifacts for this course.' }));
                    }
                    
                    courseCard.appendChild(artifactsContainer);
                }
                
                semesterCourses.appendChild(courseCard);
            });
            
            semesterBlock.appendChild(semesterCourses);
            semestersGrid.appendChild(semesterBlock);
        });
        
        yearContent.appendChild(semestersGrid);
        yearCard.appendChild(yearContent);
        yearsContainer.appendChild(yearCard);
    });
    
    frag.appendChild(yearsContainer);
    
    setTimeout(() => {
        document.querySelectorAll('.cw-year-header').forEach(header => {
            header.addEventListener('click', () => {
                const yearCard = header.closest('.cw-year-card');
                yearCard.classList.toggle('open');
            });
        });
        
        document.querySelectorAll('.cw-semester-header').forEach(header => {
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                const semesterBlock = header.closest('.cw-semester-block');
                semesterBlock.classList.toggle('open');
            });
        });
        
        document.querySelectorAll('.cw-course-header').forEach(header => {
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                const courseCard = header.closest('.cw-course-card');
                courseCard.classList.toggle('open');
            });
        });
    }, 100);
    
    return frag;
};

builders.contact = () => {
  const frag = document.createDocumentFragment();
  frag.appendChild(sectionHeader(D.contact.sectionLabel, D.contact.sectionTitle));
  const wrap = div('contact-wrap');
  wrap.appendChild(Object.assign(mk('p', 'contact-intro sr'), { textContent: D.contact.intro }));

  const links = div('contact-links');
  D.contact.links.forEach(l => {
    const a    = mk('a', 'contact-link sr'); a.href = l.href; a.target = '_blank';
    const left = div('cl-left');
    const icon = div('cl-icon');

    if (l.iconType === 'fa') {
      const i = mk('i', l.iconValue);
      if (l.iconColor) i.style.color = l.iconColor;
      icon.appendChild(i);
    } else if (l.iconType === 'img') {
      const img = mk('img'); img.src = l.iconValue; img.alt = l.label;
      img.style.cssText = 'width:20px;height:20px;object-fit:contain;border-radius:5px';
      img.onerror = () => { img.style.display = 'none'; icon.textContent = l.label[0]; };
      icon.appendChild(img);
    } else {
      icon.textContent = l.icon || l.label[0];
    }

    left.appendChild(icon);
    const info = div('');
    info.appendChild(span('cl-name',   l.label));
    info.appendChild(span('cl-handle', l.handle));
    left.appendChild(info);
    a.appendChild(left);
    a.appendChild(Object.assign(div('cl-arrow'), { textContent: '↗' }));
    links.appendChild(a);
  });
  wrap.appendChild(links);

  const avail = div('contact-availability sr');
  avail.appendChild(Object.assign(div('ca-title'), { textContent: D.contact.availability.title }));
  avail.appendChild(Object.assign(div('ca-text'),  { textContent: D.contact.availability.text }));
  wrap.appendChild(avail);

  frag.appendChild(wrap);
  return frag;
};

function buildSite() {
  document.title = D.meta.name + ' — Portfolio';

  const loaderName = document.getElementById('loaderName');
  D.meta.name.toUpperCase().split('').forEach((ch, i) => {
    const s = mk('span', 'lchar');
    s.style.animationDelay = (i * .05) + 's';
    s.style.color = i < D.meta.loaderAccentChars ? 'var(--accent)' : 'inherit';
    s.textContent = ch === ' ' ? '\u00a0' : ch;
    loaderName.appendChild(s);
  });

  const nl = document.getElementById('navLogo');
  if (D.meta.logoUrl) {
    const img = mk('img'); img.src = D.meta.logoUrl; img.alt = D.meta.name;
    img.onerror = () => { nl.innerHTML = D.meta.initials.slice(0,-1) + '<span>' + D.meta.initials.slice(-1) + '</span>'; };
    nl.appendChild(img);
  } else {
    nl.innerHTML = D.meta.initials.slice(0,-1) + '<span>' + D.meta.initials.slice(-1) + '</span>';
  }
  nl.onclick = e => navigate('home', e.clientX, e.clientY);

  const navLinks = document.getElementById('navLinks');
  D.nav.forEach(item => {
    const li  = mk('li');
    const btn = mk('button', 'nav-btn');
    btn.dataset.page = item.id;
    btn.textContent  = item.label;
    btn.onclick = e => navigate(item.id, e.clientX, e.clientY);
    if (item.id === 'home') btn.classList.add('active');
    li.appendChild(btn);
    navLinks.appendChild(li);
  });

  document.getElementById('statusText').textContent = D.meta.statusText;

  const app = document.getElementById('app');
  D.nav.forEach(item => {
    const page = div('page'); page.id = 'page-' + item.id;
    if (item.id === 'home') page.classList.add('active');
    const content = builders[item.id]?.();
    if (content) page.appendChild(content);
    app.appendChild(page);
  });
}

const HOVER_TARGETS = 'a, button, .nav-logo, .yt-play-btn, .proj-link, .tee-card, .card-img-container';
document.addEventListener('mouseover', e => {
  document.body.classList.toggle('ch', !!e.target.closest(HOVER_TARGETS));
});
document.addEventListener('mouseout', e => {
  if (!e.relatedTarget?.closest(HOVER_TARGETS)) document.body.classList.remove('ch');
});

const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
let lastWasTouch = false;
document.addEventListener('mousemove', e => {
  if (lastWasTouch) { lastWasTouch = false; return; }
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  cursor.style.opacity = '1';
  cursorRing.style.opacity = '1';
});
document.addEventListener('touchstart', () => {
  lastWasTouch = true;
  cursor.style.opacity = '0';
  cursorRing.style.opacity = '0';
}, { passive: true });
(function loopRing() {
  rx += (mx - rx) * .09;
  ry += (my - ry) * .09;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(loopRing);
})();

const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let CW, CH;
function resizeCanvas() { CW = canvas.width = window.innerWidth; CH = canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Dot {
  constructor() { this.spawn(true); }
  spawn(rand) {
    this.x    = Math.random() * CW;
    this.y    = rand ? Math.random() * CH : CH + 5;
    this.vx   = (Math.random() - .5) * .1;
    this.vy   = -(0.1 + Math.random() * .22);
    this.life = 0;
    this.max  = 260 + Math.random() * 340;
    this.r    = Math.random() * 1.3 + .3;
  }
  tick() {
    this.x += this.vx; this.y += this.vy; this.life++;
    const t = this.life / this.max;
    this.a  = t < .2 ? t / .2 : (t > .75 ? (1 - (t - .75) / .25) : 1);
    if (this.life >= this.max) this.spawn(false);
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.a * .3;
    ctx.fillStyle   = '#ef4444';
    ctx.shadowBlur  = 5;
    ctx.shadowColor = '#ef4444';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
const DOTS = Array.from({ length: 50 }, () => new Dot());
(function animCanvas() {
  ctx.clearRect(0, 0, CW, CH);
  DOTS.forEach(p => { p.tick(); p.draw(); });
  requestAnimationFrame(animCanvas);
})();

let pct = 0;
const loaderBar = document.getElementById('loaderBar');
const loaderPct = document.getElementById('loaderPct');
const pi = setInterval(() => {
  pct = Math.min(pct + (Math.random() * 20 + 10), 100);
  loaderBar.style.width = pct + '%';
  loaderPct.textContent = String(Math.floor(pct)).padStart(3, '0');
  if (pct >= 100) {
    clearInterval(pi);
    loaderPct.textContent = '100';
    document.getElementById('loader').classList.add('exit');
    setTimeout(() => { document.getElementById('loader').style.display = 'none'; startSite(); }, 650);
  }
}, 60);

function startSite() {
  document.getElementById('mainNav').classList.add('visible');
  movePill();
  setTimeout(runHomeAnims, 200);
  const st = document.getElementById('statusText');
  if (st) { const orig = st.textContent; setInterval(() => scramble(st, orig, 700), 6000); }
  initTeeInteractions();
  initImageLightbox();
  initMobileNav();
}

function runHomeAnims() {
  document.getElementById('eyebrow')?.classList.add('go');
  setTimeout(() => {
    const nw0 = document.getElementById('nw0');
    const nw1 = document.getElementById('nw1');
    if (nw0) { nw0.style.animationDelay = '0s'; nw0.classList.add('go'); }
    setTimeout(() => { if (nw1) { nw1.style.animationDelay = '0s'; nw1.classList.add('go'); } }, 100);
  }, 200);
  setTimeout(() => document.getElementById('homeDesc')?.classList.add('go'),  460);
  setTimeout(() => document.getElementById('homeCtas')?.classList.add('go'),  600);
  setTimeout(() => document.getElementById('homeTags')?.classList.add('go'),  750);
  setTimeout(() => document.getElementById('homeRight')?.classList.add('go'), 150);
}

const CHARS = '!<>-_\\/[]{}—=+*^?#@abcdefghijklmnopqrstuvwxyz0123456789';
function scramble(el, finalText, dur = 600) {
  const total = Math.round(dur / 30); let f = 0;
  const t = setInterval(() => {
    el.textContent = finalText.split('').map((c, i) => {
      if (c === ' ') return ' ';
      if (i < Math.floor(f / total * finalText.length)) return c;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }).join('');
    if (++f > total) { clearInterval(t); el.textContent = finalText; }
  }, 30);
}

let currentPage = 'home', transitioning = false;
const overlay   = document.getElementById('transition-overlay');

function navigate(to, clickX, clickY) {
  if (to === currentPage || transitioning) return;
  transitioning = true;

  const ox = (clickX ? (clickX / window.innerWidth)  * 100 : 50).toFixed(2) + '%';
  const oy = (clickY ? (clickY / window.innerHeight) * 100 : 50).toFixed(2) + '%';
  overlay.style.setProperty('--ox', ox);
  overlay.style.setProperty('--oy', oy);
  overlay.className = 'cover';

  setTimeout(() => {
    document.getElementById('page-' + currentPage).classList.remove('active');
    const inEl = document.getElementById('page-' + to);
    inEl.classList.add('active');
    inEl.scrollTop = 0;
    currentPage = to;
    updateNav(to);
    triggerPageAnims(to);
  }, 275);

  setTimeout(() => { overlay.className = ''; transitioning = false; }, 550);
}

function updateNav(page) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.page === page));
  movePill();
}

function movePill() {
  const ab   = document.querySelector('.nav-btn.active');
  const pill = document.getElementById('navPill');
  const nl   = document.getElementById('navLinks');
  if (!ab || !nl) return;
  const r  = ab.getBoundingClientRect();
  const nr = nl.getBoundingClientRect();
  pill.style.left   = (r.left - nr.left) + 'px';
  pill.style.top    = (r.top  - nr.top)  + 'px';
  pill.style.width  = r.width  + 'px';
  pill.style.height = r.height + 'px';
}
window.addEventListener('resize', movePill);

function triggerPageAnims(page) {
  const pageEl = document.getElementById('page-' + page);
  if (!pageEl) return;
  pageEl.querySelectorAll('.sr').forEach(e => e.classList.add('vis'));
  pageEl.querySelector('.section-header')?.classList.add('in');
  if (page === 'about') {
    pageEl.querySelectorAll('.skill-fill').forEach(b => {
      b.style.transitionDelay = '0s';
      b.style.transform = `scaleX(${b.dataset.w})`;
    });
  }
}

function initMobileNav() {
  const pages  = D.nav.map(n => n.id);
  const labels = D.nav.map(n => n.label);
  const nav    = document.getElementById('mobile-nav');
  const track  = document.getElementById('mobile-nav-track');
  const lens   = document.getElementById('mob-lens');

  if (!track) return;

  // Build all items into the track
  labels.forEach((lbl, i) => {
    const el = document.createElement('div');
    el.className = 'mob-item';
    el.textContent = lbl;
    el.dataset.index = i;
    track.appendChild(el);
  });

  const items   = () => Array.from(track.querySelectorAll('.mob-item'));
  const NAV_W   = () => nav.offsetWidth;
  const ITEM_W  = (i) => items()[i].offsetWidth;

  // Calculate the translateX so item at index i is centered in the nav
  function offsetForIndex(i) {
    const its = items();
    // Sum widths of all items before i
    let left = 0;
    for (let j = 0; j < i; j++) left += its[j].offsetWidth;
    // Center: nav center minus (item's left edge + half item width)
    return NAV_W() / 2 - left - its[i].offsetWidth / 2;
  }

  let idx        = 0;
  let baseOffset = offsetForIndex(0);
  let dragStartX = 0;
  let dragDelta  = 0;
  let dragging   = false;

  function setActive(i) {
    items().forEach((el, j) => el.classList.toggle('active', j === i));
    lens.style.width = (items()[i].offsetWidth + 8) + 'px';
  }

  function snapTo(i, animate) {
    idx = Math.max(0, Math.min(pages.length - 1, i));
    baseOffset = offsetForIndex(idx);
    if (animate) {
      track.style.transition = 'transform .3s cubic-bezier(.16,1,.3,1)';
      setTimeout(() => { track.style.transition = ''; }, 300);
    }
    track.style.transform = `translateX(${baseOffset}px)`;
    setActive(idx);
  }

  // Find which item is closest to center given current transform
  function nearestIndex() {
    const navRect = nav.getBoundingClientRect();
    const center  = navRect.left + NAV_W() / 2;
    let best = 0, bestDist = Infinity;
    items().forEach((el, i) => {
      const r    = el.getBoundingClientRect();
      const dist = Math.abs((r.left + r.width / 2) - center);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    return best;
  }

  track.addEventListener('touchstart', e => {
    dragStartX = e.touches[0].clientX;
    dragDelta  = 0;
    dragging   = true;
    track.style.transition = '';
  }, { passive: true });

  track.addEventListener('touchmove', e => {
    if (!dragging) return;
    dragDelta = e.touches[0].clientX - dragStartX;
    track.style.transform = `translateX(${baseOffset + dragDelta * 1.8}px)`;
    // Highlight whichever item is currently under the lens — no label swapping
    const nearest = nearestIndex();
    setActive(nearest);
  }, { passive: true });

  track.addEventListener('touchend', () => {
    dragging = false;
    const nearest = nearestIndex();
    const changed = nearest !== idx;
    dragDelta = 0;
    snapTo(nearest, true);
    if (changed) navigate(pages[nearest], null, null);
  });

  track.addEventListener('mousedown', e => {
    dragStartX = e.clientX;
    dragDelta  = 0;
    dragging   = true;
    track.style.transition = '';
    e.preventDefault();
  });

  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    dragDelta = e.clientX - dragStartX;
    track.style.transform = `translateX(${baseOffset + dragDelta * 1.8}px)`;
    setActive(nearestIndex());
  });

  window.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    const nearest = nearestIndex();
    const changed = nearest !== idx;
    dragDelta = 0;
    snapTo(nearest, true);
    if (changed) navigate(pages[nearest], null, null);
  });

  // Wait one frame so items have rendered and have offsetWidth
  requestAnimationFrame(() => snapTo(0, false));
}

function initTeeInteractions() {
  const isMobile = () => window.matchMedia('(hover: none)').matches;

  document.querySelectorAll('.tee-card').forEach(card => {
    const backImg = card.querySelector('.back-img');
    if (!backImg) return;
    const label = card.querySelector('.tee-flip-label');

    const setFlipped = flipped => {
      card.classList.toggle('is-flipped', flipped);
      if (label) label.textContent = flipped ? 'BACK' : 'FRONT';
    };

    card.addEventListener('mouseenter', () => { if (!isMobile()) setFlipped(true); });
    card.addEventListener('mouseleave', () => { if (!isMobile()) setFlipped(false); });

    // Mobile: tap image area flips, tap body opens modal
    card.querySelector('.tee-front')?.addEventListener('click', e => {
      if (!isMobile()) return;
      e.stopPropagation();
      setFlipped(!card.classList.contains('is-flipped'));
    });
    card.querySelector('.back-img')?.addEventListener('click', e => {
      if (!isMobile()) return;
      e.stopPropagation();
      setFlipped(!card.classList.contains('is-flipped'));
    });
  });

  document.addEventListener('click', e => {
    const card = e.target.closest('.tee-card');
    if (!card) return;

    // Mobile taps on the shirt images only flip — don't open modal
    if (isMobile() && (e.target.matches('.tee-front') || e.target.matches('.back-img'))) return;

    const label = card.querySelector('.tee-flip-label');
    card.classList.remove('is-flipped');
    if (label) label.textContent = 'FRONT';

    const frontImg = card.querySelector('.tee-front');
    const backImg  = card.querySelector('.back-img');
    const fromRect = frontImg.getBoundingClientRect();

    const body    = card.querySelector('.interest-card-body');
    const title   = body.querySelector('.interest-card-title')?.textContent   || '';
    const subtitle= body.querySelector('.interest-card-sub')?.textContent     || '';
    const desc    = body.querySelector('.interest-card-desc')?.textContent    || '';
    const tags    = [...body.querySelectorAll('.interest-card-tag')].map(t => t.textContent);

    setTimeout(() => openCardModal({
      fromRect,
      src:     frontImg.src,
      backSrc: backImg?.src || null,
      aspect:  'square',
      title, subtitle, desc, tags,
      isTee: true,
    }), 350);
  });
}

function openCardModal(opts) {
  // opts: { fromRect, src, backSrc, aspect, title, subtitle, desc, tags, isTee }
  const { fromRect, src, backSrc, aspect, title, subtitle, desc, tags, isTee } = opts;

  const tagsHtml = tags?.length
    ? tags.map(t => `<span class="modal-tag">${t}</span>`).join('')
    : '';

  const modal = div('card-modal');
  modal.style.opacity = '0';
  modal.innerHTML = `
    <div class="modal-inner">
      <button class="modal-close">×</button>
      <div class="modal-image-col">
        ${isTee ? `
          <div class="modal-flipper">
            <img class="modal-face modal-front" src="${src}" alt="${title}">
            ${backSrc ? `<img class="modal-face modal-back" src="${backSrc}" alt="${title} back">` : ''}
          </div>
          ${backSrc ? `<button class="modal-flip-btn">↺ flip</button>` : ''}
        ` : `
          <img class="modal-img modal-img--${aspect}" src="${src}" alt="${title}">
        `}
      </div>
      <div class="modal-info">
        <div class="modal-info-title">${title}</div>
        ${subtitle ? `<div class="modal-info-sub">${subtitle}</div>` : ''}
        ${desc    ? `<div class="modal-info-desc">${desc}</div>`    : ''}
        ${tagsHtml ? `<div class="modal-info-tags">${tagsHtml}</div>` : ''}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  // FLIP zoom from card image
  const zoomEl = modal.querySelector('.modal-flipper, .modal-img');
  const toRect  = zoomEl.getBoundingClientRect();
  const scaleX  = fromRect.width  / toRect.width;
  const scaleY  = fromRect.height / toRect.height;
  const dx      = fromRect.left + fromRect.width  / 2 - (toRect.left + toRect.width  / 2);
  const dy      = fromRect.top  + fromRect.height / 2 - (toRect.top  + toRect.height / 2);

  zoomEl.style.transform  = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
  zoomEl.style.transition = 'none';
  modal.style.opacity = '1';

  requestAnimationFrame(() => requestAnimationFrame(() => {
    zoomEl.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
    zoomEl.style.transform  = 'none';
  }));

  // Flip button for tees
  if (isTee && backSrc) {
    const flipper = modal.querySelector('.modal-flipper');
    const flipBtn = modal.querySelector('.modal-flip-btn');
    let flipped = false, flipping = false;
    flipBtn.onclick = ev => {
      ev.stopPropagation();
      if (flipping) return;
      flipping = true;
      flipped  = !flipped;
      flipper.style.transition = 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
      flipper.style.transform  = flipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
      setTimeout(() => { flipping = false; }, 600);
    };
  }

  const close = () => {
    modal.classList.add('exit');
    setTimeout(() => { modal.remove(); document.body.style.overflow = ''; }, 280);
  };
  modal.querySelector('.modal-close').onclick = close;
  modal.onclick = ev => { if (ev.target === modal) close(); };
}

function openDetailsModal(project) {
  const d = project.details || {};
  const modal = div('card-modal details-modal');
  modal.style.opacity = '0';
  const imgHtml = project.logo ? `<img class="modal-img modal-img--square" src="${project.logo}" alt="${project.title}">` : '';
  modal.innerHTML = `
    <div class="modal-inner">
      <button class="modal-close">×</button>
      ${project.logo ? `<div class="modal-image-col">${imgHtml}</div>` : ''}
      <div class="modal-info">
        <div class="modal-info-title">${project.title}</div>
        ${d.problem     ? `<div class="modal-info-desc"><strong>Problem:</strong> ${d.problem}</div>` : ''}
        ${d.observation ? `<div class="modal-info-desc"><strong>Observation:</strong> ${d.observation}</div>` : ''}
        ${d.hypothesis  ? `<div class="modal-info-desc"><strong>Hypothesis:</strong> ${d.hypothesis}</div>` : ''}
        ${d.experiment  ? `<div class="modal-info-desc"><strong>Experiment:</strong> ${d.experiment}</div>` : ''}
        ${d.outcome     ? `<div class="modal-info-desc"><strong>Outcome:</strong> ${d.outcome}</div>` : ''}
        ${d.reflection  ? `<div class="modal-info-desc"><strong>Reflection:</strong> ${d.reflection}</div>` : ''}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => { modal.style.opacity = '1'; });

  const close = () => {
    modal.classList.add('exit');
    document.removeEventListener('keydown', onKeyDown);
    setTimeout(() => { modal.remove(); document.body.style.overflow = ''; }, 220);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') close();
  };

  document.addEventListener('keydown', onKeyDown);
  modal.querySelector('.modal-close').onclick = close;
  modal.onclick = ev => { if (ev.target === modal) close(); };
}


function initImageLightbox() {
  document.addEventListener('click', e => {
    const img = e.target.matches('.interest-card-img') ? e.target : null;
    if (!img) return;
    if (img.closest('.tee-card')) return;

    const fromRect = img.getBoundingClientRect();
    const card     = img.closest('.interest-card');
    const aspect   = img.closest('.card-img-container')?.dataset.aspect || 'square';
    const body     = card?.querySelector('.interest-card-body');

    openCardModal({
      fromRect,
      src:      img.src,
      backSrc:  null,
      aspect,
      title:    body?.querySelector('.interest-card-title')?.textContent  || img.alt,
      subtitle: body?.querySelector('.interest-card-sub')?.textContent    || '',
      desc:     body?.querySelector('.interest-card-desc')?.textContent   || '',
      tags:     [...(body?.querySelectorAll('.interest-card-tag') || [])].map(t => t.textContent),
      isTee:    false,
    });
  });
}

buildSite();
