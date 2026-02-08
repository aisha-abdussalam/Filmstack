const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:5001"
    : "https://filmstack.onrender.com";
    
const fetchSidebar = async () => {
    const response = await fetch("/html/sidebar.html")

    const result = await response.text()
    document.getElementById("sidebar").innerHTML = result

    setupSidebarListeners()
}

fetchSidebar();

function setupSidebarListeners() {
    document.getElementById("goToBrowse").addEventListener("click", () => {
        window.location.href = "../index.html"
    });

    document.getElementById("goToMovies").addEventListener("click", () => {
        window.location.href = "../html/movies.html"
    });

    document.getElementById("goToWatchlist").addEventListener("click", () => {
        window.location.href = "../html/watchlist.html"
    });

    document.getElementById("genresCheckboxes").style.display = "none"

    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.classList.remove('active');
        if (currentPath.includes('watchlist.html') && item.id === 'goToWatchlist') {
            item.classList.add('active');
        }
        else if (currentPath.includes('index.html') && item.id === 'goToBrowse') {
            item.classList.add('active');
        }
        else if (currentPath.includes('movies.html') && item.id === 'goToMovies') {
            item.classList.add('active');
        }
    });
}

const displayWatchlist = async () => {
    document.getElementById("watchlistContainer").innerHTML = "";

    const [watchlistRes, userRes] = await Promise.all([
        fetch(`${API_BASE_URL}/watchlist`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/auth/me`, { credentials: 'include' })
    ]);

    const watchlistData = await watchlistRes.json();
    const userData = await userRes.json();

    const watchlist = watchlistData.data.watchlist;
    const user = userData.data.user

    console.log(user);

    document.getElementById("profile").innerHTML = `
            <div style="text-align: right">
                <div style="font-size: 14px; font-weight: 600; color: white">
                    ${user.name}
                </div>
                <div style="font-size: 12px; color: var(--text-muted)">
                    @${user.username || ""}
                </div>
            </div>
            <img src="${user.profileUrl}"
                class="avatar" alt="User" />
        `

    if (watchlist.length === 0) {
        document.getElementById("watchlistContainer").innerHTML = "No movies in watchlist."
        return
    }
    
    let watchlistHTML = ""
    watchlist.forEach((watchlistItem, index) => {
        watchlistHTML += `
            <div class="watchlist-row" data-media-type="banani-button">
                <div class="watchlist-index">${index + 1}</div>
                <div class="watchlist-movie-title">
                    <div class="watchlist-movie-name">${watchlistItem.movie.title}</div>
                    <div class="watchlist-movie-meta">${watchlistItem.movie.genres.join(" | ")}</div>
                </div>
                <div>
                    <span class="status-pill ${(watchlistItem.status === 'PLANNED') ? 'status-planned' : (watchlistItem.status === 'COMPLETED') ? 'status-completed' : (watchlistItem.status === 'WATCHING') ? 'status-watching' : 'status-dropped'}">${watchlistItem.status}</span>
                </div>
                <div>
                    <span class="watchlist-rating">
                        <div style="
                width: 14px;
                height: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                ">
                            <iconify-icon icon="lucide:star" style="font-size: 14px; color: #fbbf24"></iconify-icon>
                        </div>
                        ${watchlistItem.rating || 0}
                    </span>
                </div>
                <div class="watchlist-notes">
                    ${watchlistItem.notes ? watchlistItem.notes : ""}
                </div>
                <div class="watchlist-actions">
                    <button class="icon-ghost-button editButton" data-watchlist-id="${watchlistItem.id}" data-media-type="banani-button" title="Edit">
                        <div style="
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                ">
                            <iconify-icon icon="lucide:pen-square"
                                style="font-size: 16px; color: white"></iconify-icon>
                        </div>
                    </button>
                    <button class="icon-ghost-button deleteButton" data-watchlist-id="${watchlistItem.id}" data-media-type="banani-button" title="Delete">
                        <div style="
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                ">
                            <iconify-icon icon="lucide:trash-2"
                                style="font-size: 16px; color: #f97373"></iconify-icon>
                        </div>
                    </button>
                </div>
            </div>
        `
    });
    document.getElementById("watchlistContainer").innerHTML = watchlistHTML

    document.getElementById("collectionCount").innerHTML = `<div style="font-size: 14px; color: var(--text-muted)">${watchlist.length} Movie(s) in watchlist</div>`

    setupEventListeners()
};

function setupEventListeners() {
    document.querySelectorAll(".editButton").forEach(btn => {
        btn.addEventListener("click", () => {
            const watchlistId = btn.dataset.watchlistId
            console.log(watchlistId);
            
            window.location.href = `../html/editWatchlist.html?id=${watchlistId}`
        })
    });

    document.querySelectorAll(".deleteButton").forEach(btn => {
        btn.addEventListener("click", async () => {
            const watchlistId = btn.dataset.watchlistId
            console.log(watchlistId);

            try {
                const response = await fetch(`${API_BASE_URL}/watchlist/${watchlistId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                })

                const result = await response.json()
                console.log(result);

                if (!response.ok) {
                    const messageToShow = result.error || result.message || "An unknown error occured"
                    console.error(messageToShow);
                } else {
                    console.log("Deleted successfully", result);
                    await displayWatchlist();

                    const toastAlert = document.getElementById("toastAlert");
                    toastAlert.style.display = "block";

                    setTimeout(() => {
                        toastAlert.style.display = "none"
                    }, 3000);
                }
            } catch (error) {
                console.error("Network issue.There was problem connecting with the server");
            }
        })
    });
};

const handleSearch = async () => {
    const searchTerm = document.getElementById("searchInput").value

    const response = await fetch(`${API_BASE_URL}/watchlist?search=${searchTerm}`, { credentials: 'include' });

    const result = await response.json();
    watchlist = result.data.watchlist

    if (watchlist.length === 0) {
        document.getElementById("watchlistContainer").innerHTML = "No movie found with that title."
        return
    }

    let watchlistHTML = "";

    watchlist.forEach((watchlistItem, index) => {
        watchlistHTML += `<div class="watchlist-row" data-media-type="banani-button">
                <div class="watchlist-index">${index + 1}</div>
                <div class="watchlist-movie-title">
                    <div class="watchlist-movie-name">${watchlistItem.movie.title}</div>
                    <div class="watchlist-movie-meta">${watchlistItem.movie.genres.join("  ")}</div>
                </div>
                <div>
                    <span class="status-pill ${(watchlistItem.status === 'PLANNED') ? 'status-planned' : (watchlistItem.status === 'COMPLETED') ? 'status-completed' : (watchlistItem.status === 'WATCHING') ? 'status-watching' : 'status-dropped'}">${watchlistItem.status}</span>
                </div>
                <div>
                    <span class="watchlist-rating">
                        <div style="
                width: 14px;
                height: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                ">
                            <iconify-icon icon="lucide:star" style="font-size: 14px; color: #fbbf24"></iconify-icon>
                        </div>
                        ${watchlistItem.rating || 0}
                    </span>
                </div>
                <div class="watchlist-notes">
                    ${watchlistItem.notes ? watchlistItem.notes : ""}
                </div>
                <div class="watchlist-actions">
                    <button class="icon-ghost-button editButton" data-watchlist-id="${watchlistItem.id}" data-media-type="banani-button" title="Edit">
                        <div style="
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                ">
                            <iconify-icon icon="lucide:pen-square"
                                style="font-size: 16px; color: white"></iconify-icon>
                        </div>
                    </button>
                    <button class="icon-ghost-button deleteButton" data-watchlist-id="${watchlistItem.id}" data-media-type="banani-button" title="Delete">
                        <div style="
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                ">
                            <iconify-icon icon="lucide:trash-2"
                                style="font-size: 16px; color: #f97373"></iconify-icon>
                        </div>
                    </button>
                </div>
            </div>`
        });
        document.getElementById("watchlistContainer").innerHTML = watchlistHTML

        setupEventListeners()
}

document.getElementById("profile").addEventListener("click", () => {
    window.location.href = "../html/profile.html"
});

displayWatchlist();