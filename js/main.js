// Configuration
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
        'Splitsy': {
            description: 'A React Native app to split bills and expenses with friends, featuring real-time syncing and payment reminders.',
            order: 1,
        },
        'Jett2Fly': {
            description: 'An HTML business website for showcasing my audio and visual creative works in an organized portfolio format.',
            image: 'assets/jett2fly.png',
            order: 2,
        },
        'GatorFound': {
            description: 'A website designed for University of Florida students to report lost & found items on campus.',
            image: 'assets/gatorfound.jpg',
            order: 3,
        },
        'GridironGuru': {
            name: 'Gridiron Guru',
            description: 'A C++ program that predicts NFL game outcomes using historical data and statistical analysis.',
            order: 4,
        }
    }
};

// Fetch GitHub repositories (only runs on projects page)
async function fetchGitHubRepos() {
    const container = document.getElementById('projects-container');
    if (!container) return; // Not on projects page
    
    try {
        const response = await fetch(`https://api.github.com/users/${CONFIG.github.username}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }
        
        const repos = await response.json();
        
        const filteredRepos = repos
            .filter(repo => !repo.fork && !CONFIG.github.excludeRepos.includes(repo.name))
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, CONFIG.github.maxRepos);
        
        const cardData = filteredRepos.map(repo => {
            const override = (CONFIG.projects && CONFIG.projects[repo.name]) || {};
            if (override.enabled === false) return null;

            const displayName = override.name || repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const description = override.description || repo.description || 'A coding project showcasing development skills and problem-solving.';
            const homepage = override.homepage || repo.homepage || '';
            const language = override.language || repo.language || '';

            let topicsArr = [];
            if (override.topics) {
                topicsArr = Array.isArray(override.topics) ? override.topics : String(override.topics).split(',').map(t => t.trim()).filter(Boolean);
            } else if (Array.isArray(repo.topics)) {
                topicsArr = repo.topics.slice(0, 3);
            }

            const imageUrl = override.image || (repo.owner && repo.owner.avatar_url) || null;

            return {
                original: repo,
                displayName,
                description,
                homepage,
                language,
                topics: topicsArr,
                imageUrl,
                order: (typeof override.order === 'number') ? override.order : null,
            };
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
            const languages = data.language ? `${data.language}` : '';
            const topics = data.topics.length ? data.topics.slice(0,3).map(t => `${t}`).join('') : '';

            const imageHtml = (() => {
                if (data.imageUrl) return ``;

                const parts = data.displayName.split(/[-_\s]+/).filter(Boolean);
                const initials = (parts.length === 1)
                    ? parts[0].slice(0,2).toUpperCase()
                    : (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();

                const gid = `g-${data.displayName.replace(/[^a-zA-Z0-9]/g,'')}`;
                return `
                    
                        
                            
                                
                                
                            
                        
                        
                        ${initials}
                    
                `;
            })();

            return `
                
                    ${imageHtml}
                    
                        ${data.displayName}
                        ${data.description}
                        
                            ${languages}
                            ${topics}
                        
                        
                             ${repo.stargazers_count}
                             ${repo.forks_count}
                        
                        
                            View Code →
                            ${data.homepage ? `Live Demo →` : ''}
                        
                    
                
            `;
        }).join('');
        
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        container.innerHTML = `
            
                Unable to load projects. Please check back later.
                View on GitHub →
            
        `;
    }
}

// Initialize Spotify embed (only runs on ventures page)
function initializeSpotify() {
    const spotifyContainer = document.getElementById('spotify-container');
    if (!spotifyContainer) return; // Not on ventures page
    
    if (CONFIG.spotify.playlistId && CONFIG.spotify.playlistId !== 'YOUR_PLAYLIST_ID') {
        spotifyContainer.innerHTML = `
            
            
        `;
    }
}

// Initialize e-commerce links (only runs on ventures page)
function initializeEcommerce() {
    const depopLink = document.getElementById('depop-link');
    const mercariLink = document.getElementById('mercari-link');
    
    if (depopLink && CONFIG.ecommerce.depop && CONFIG.ecommerce.depop !== 'yourusername') {
        depopLink.href = `https://www.depop.com/${CONFIG.ecommerce.depop}`;
    }

    if (mercariLink && CONFIG.ecommerce.mercari && CONFIG.ecommerce.mercari !== 'yourusername') {
        mercariLink.href = `https://www.mercari.com/u/${CONFIG.ecommerce.mercari}`;
    }
}

// Add scroll effect to navigation
function initNavScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
        } else {
            nav.style.background = 'rgba(10, 10, 10, 0.8)';
        }
    });
}

// Initialize all dynamic content on page load
document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    fetchGitHubRepos();
    initializeSpotify();
    initializeEcommerce();
});