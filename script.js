let games = [];
let selectedGame = null;
let searchQuery = '';

const gameGrid = document.getElementById('game-grid');
const gamePlayer = document.getElementById('game-player');
const searchInput = document.getElementById('search-input');
const heroSection = document.getElementById('hero-section');
const iframeContainer = document.getElementById('iframe-container');
const gameTitle = document.getElementById('game-title');
const gameDesc = document.getElementById('game-desc');
const moreGamesGrid = document.getElementById('more-games-grid');

async function init() {
    try {
        const response = await fetch('games.json');
        games = await response.json();
        renderGames();
    } catch (error) {
        console.error('Error loading games:', error);
    }
}

function renderGames() {
    const filtered = games.filter(game => 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    gameGrid.innerHTML = filtered.map(game => `
        <div class="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/10" onclick="selectGame('${game.id}')">
            <div class="aspect-video relative overflow-hidden">
                <img src="${game.thumbnail}" alt="${game.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerpolicy="no-referrer">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span class="bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        PLAY NOW
                    </span>
                </div>
            </div>
            <div class="p-4">
                <h3 class="font-bold text-lg mb-1 group-hover:text-emerald-400 transition-colors">${game.title}</h3>
                <p class="text-white/40 text-sm line-clamp-2">${game.description}</p>
            </div>
        </div>
    `).join('');
}

function selectGame(id) {
    selectedGame = games.find(g => g.id === id);
    if (!selectedGame) return;

    heroSection.classList.add('hidden');
    gameGrid.classList.add('hidden');
    gamePlayer.classList.remove('hidden');

    gameTitle.textContent = selectedGame.title;
    gameDesc.textContent = selectedGame.description;
    iframeContainer.innerHTML = `
        <iframe src="${selectedGame.iframeUrl}" class="w-full h-full border-none" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    `;

    renderMoreGames();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeGame() {
    selectedGame = null;
    gamePlayer.classList.add('hidden');
    heroSection.classList.remove('hidden');
    gameGrid.classList.remove('hidden');
    iframeContainer.innerHTML = '';
}

function renderMoreGames() {
    const others = games.filter(g => g.id !== selectedGame.id).slice(0, 6);
    moreGamesGrid.innerHTML = others.map(game => `
        <div class="group cursor-pointer" onclick="selectGame('${game.id}')">
            <div class="aspect-video rounded-xl overflow-hidden border border-white/10 mb-2">
                <img src="${game.thumbnail}" alt="${game.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerpolicy="no-referrer">
            </div>
            <p class="text-xs font-medium truncate group-hover:text-emerald-400 transition-colors">${game.title}</p>
        </div>
    `).join('');
}

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderGames();
});

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

init();
