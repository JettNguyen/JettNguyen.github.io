/* Main JS extracted from index.html */
const CONFIG = {
    github: {
        username: 'JettNguyen',
        maxRepos: 6,
        excludeRepos: ['JettNguyen', 'JettNguyen.github.io'],
    },
    spotify: {
        playlistId: '3A7pDOj3iWVYk1KKR8LjWJ',
    },
    ecommerce: {
        depop: 'allweknowisbangers',
        mercari: '7jettster7',
    },
    projects: {
        'Splitsy': { order: 1 },
        'Jett2Fly': { description: 'An HTML business website...', image: 'assets/jett2fly.png', order: 2 },
        'GatorFound': { description: 'A website designed for UF students', image: 'assets/gatorfound.jpg', order: 3 },
        'GridironGuru': { order: 4 }
    }
};

async function fetchGitHubRepos(containerId = 'projects-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const response = await fetch(`https://api.github.com/users/${CONFIG.github.username}/repos?sort=updated&per_page=100`);
        if (!response.ok) throw new Error('Failed to fetch repositories');
        const repos = await response.json();

        const filteredRepos = repos
            .filter(repo => !repo.fork && !CONFIG.github.excludeRepos.includes(repo.name))
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, CONFIG.github.maxRepos);

        const cardData = filteredRepos.map(repo => {
            const override = (CONFIG.projects && CONFIG.projects[repo.name]) || {};
            if (override.enabled === false) return null;
            const displayName = override.name || repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const description = override.description || repo.description || 'A coding project.';
            const homepage = override.homepage || repo.homepage || '';
            const language = override.language || repo.language || '';
            let topicsArr = [];
            if (override.topics) topicsArr = Array.isArray(override.topics) ? override.topics : String(override.topics).split(',').map(t=>t.trim()).filter(Boolean);
            else if (Array.isArray(repo.topics)) topicsArr = repo.topics.slice(0,3);
            const imageUrl = override.image || (repo.owner && repo.owner.avatar_url) || null;

            return { original: repo, displayName, description, homepage, language, topics: topicsArr, imageUrl, order: (typeof override.order === 'number') ? override.order : null };
        }).filter(Boolean);

        cardData.sort((a, b) => {
            if (a.order !== null || b.order !== null) {
                const ao = a.order === null ? Number.MAX_SAFE_INTEGER : a.order;
                const bo = b.order === null ? Number.MAX_SAFE_INTEGER : b.order;
                return ao - bo;
            }
            return b.original.stargazers_count - a.original.stargazers_count;
        });

        container.innerHTML = cardData.map(data => {
            const repo = data.original;
            const languages = data.language ? `<span class="tag">${data.language}</span>` : '';
            const topics = data.topics.length ? data.topics.slice(0,3).map(t => `<span class="tag">${t}</span>`).join('') : '';
            const imageHtml = (() => {
                if (data.imageUrl) return `<img src="${data.imageUrl}" alt="${data.displayName}" loading="lazy">`;
                const parts = data.displayName.split(/[-_\s]+/).filter(Boolean);
                const initials = (parts.length === 1) ? parts[0].slice(0,2).toUpperCase() : (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
                const gid = `g-${data.displayName.replace(/[^a-zA-Z0-9]/g,'')}`;
                return `
                    <svg class="svg-placeholder" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                        <defs>
                            <linearGradient id="${gid}" x1="0" x2="1">
                                <stop offset="0" stop-color="#2b2b2b" />
                                <stop offset="1" stop-color="#4b5563" />
                            </linearGradient>
                        </defs>
                        <rect width="120" height="120" fill="url(#${gid})" />
                        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="36" fill="#cbd5e1">${initials}</text>
                    </svg>
                `;
            })();

            return `
                <div class="project-card">
                    <div class="project-image">${imageHtml}</div>
                    <div class="project-content">
                        <h3>${data.displayName}</h3>
                        <p>${data.description}</p>
                        <div class="project-tags">${languages}${topics}</div>
                        <div class="project-stats">
                            <span class="project-stat"><i class="fa-solid fa-star stat-icon" aria-hidden="true"></i> ${repo.stargazers_count}</span>
                            <span class="project-stat"><i class="fa-solid fa-code-branch stat-icon" aria-hidden="true"></i> ${repo.forks_count}</span>
                        </div>
                        <div class="project-links">
                            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View Code →</a>
                            ${data.homepage ? `<a href="${data.homepage}" target="_blank" rel="noopener noreferrer">Live Demo →</a>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        if (container) container.innerHTML = `<div style="text-align:center;color:var(--text-secondary);padding:2rem;"><p>Unable to load projects. Please check back later.</p><p style="margin-top:1rem;"><a href="https://github.com/${CONFIG.github.username}" target="_blank" style="color:var(--accent);">View on GitHub →</a></p></div>`;
    }
}

function initializeSpotify(containerId = 'spotify-container') {
    const spotifyContainer = document.getElementById(containerId);
    if (!spotifyContainer) return;
    if (CONFIG.spotify.playlistId && CONFIG.spotify.playlistId !== 'YOUR_PLAYLIST_ID') {
        spotifyContainer.innerHTML = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/${CONFIG.spotify.playlistId}?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    }
}

function initializeEcommerce() {
    const depopLink = document.getElementById('depop-link');
    if (depopLink && CONFIG.ecommerce.depop && CONFIG.ecommerce.depop !== 'yourusername') {
        depopLink.href = `https://www.depop.com/${CONFIG.ecommerce.depop}`;
        depopLink.target = '_blank';
        depopLink.rel = 'noopener noreferrer';
    }
    const mercariLink = document.getElementById('mercari-link');
    if (mercariLink && CONFIG.ecommerce.mercari && CONFIG.ecommerce.mercari !== 'yourusername') {
        mercariLink.href = `https://www.mercari.com/u/${CONFIG.ecommerce.mercari}`;
        mercariLink.target = '_blank';
        mercariLink.rel = 'noopener noreferrer';
    }
}

function attachSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.target && anchor.target !== '') return;
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function attachNavScrollEffect() {
    let lastScroll = 0;
    const nav = document.querySelector('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) nav.style.background = 'rgba(10, 10, 10, 0.95)';
        else nav.style.background = 'rgba(10, 10, 10, 0.8)';
        lastScroll = currentScroll;
    });
}

function initHomePage() {
    fetchGitHubRepos();
    initializeSpotify();
    initializeEcommerce();
    attachSmoothScroll();
    attachNavScrollEffect();
}

// Export for other pages to call specific initializers
window.Site = {
    initHomePage,
    fetchGitHubRepos,
    initializeSpotify,
    initializeEcommerce,
    attachSmoothScroll,
    attachNavScrollEffect
};

document.addEventListener('DOMContentLoaded', () => {
    // Default initializer: try to run home page init if elements exist
    if (document.querySelector('.hero')) {
        initHomePage();
    } else {
        initializeEcommerce();
        attachSmoothScroll();
        attachNavScrollEffect();
    }
});
