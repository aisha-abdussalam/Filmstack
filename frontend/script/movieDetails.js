const movieId = new URLSearchParams(window.location.search).get("id");

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

const fetchAddMovieModal = async () => {
    const response = await fetch("/html/addMovieModal.html");

    const result = await response.text();
    document.getElementById("movieModal").innerHTML = result;

    setupModalLogic();
}

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
}

const fetchMovieDetails = async () => {
    try {
        const backdrop = document.getElementById("backdrop")
        const details = document.getElementById("details")

        const [movieRes, userRes] = await Promise.all([
            fetch(`${API_BASE_URL}/movies/${movieId}`),
            fetch(`${API_BASE_URL}/auth/me`, { credentials: "include" })
        ])

        const movieData = await movieRes.json();
        const userData = await userRes.json();
        const movie = movieData.data.movie
        const creatorId = userData.data.user.id

        console.log(movie);
        
        const isCreator = movie.createdBy === creatorId

        const hours = Math.floor(movie.runtime / 60)
        const minutes = movie.runtime % 60

        const backdropHTML = `
            <img src="${movie.posterUrl}" class="hero-image" alt="Inception Backdrop" data-aspect-ratio="21:9" data-query="dreamy sci-fi city distortion inception movie scene" />
        `

        let movieHTML = "";

        movieHTML += `
            <!-- Left Column: Poster & Actions -->
            <div class="left-col" id="leftColumn">
                <div class="poster-card">
                    <img src="${movie.posterUrl}"
                        class="poster-image" alt="Inception Poster" data-aspect-ratio="2:3"
                        data-query="inception movie poster minimalist dark" />
                </div>
                <div class="poster-actions">
                    <button class="action-btn primary" data-media-type="banani-button" onclick="addToWatchlist()" id="watchlistText">
                        <iconify-icon icon="lucide:plus" style="font-size: 18px"></iconify-icon>
                        Add to Watchlist
                    </button>
                    <button class="action-btn" data-media-type="banani-button">
                        <iconify-icon icon="lucide:heart" style="font-size: 18px"></iconify-icon>
                        Favorite
                    </button>
                    <button class="action-btn" data-media-type="banani-button" id="sharePost">
                        <iconify-icon icon="lucide:share-2" style="font-size: 18px"></iconify-icon>
                        Share
                    </button>
                </div>
            </div>


            <!-- Right Column: Info -->
            <div class="movie-header" id="movieContainer">
                <div class="tags-container">
                    ${movie.genres.map((genre) => `
                        <span class="tag">${genre}</span>
                    `).join('')}
                </div>

                <h1 class="movie-title">${movie.title}</h1>

                <div class="meta-row">
                    <span class="rating-badge">8.8 IMDB</span>
                    <span class="dot-separator"></span>
                    <span>${movie.releaseYear}</span>
                    <span class="dot-separator"></span>
                    <span>${hours}h ${minutes}m</span>
                </div>

                <div class="added-by-pill" data-media-type="banani-button">
                    <img src="${movie.posterUrl}"
                        class="user-avatar-xs" alt="Sarah" />
                    <span>Added by <strong>${movie.creator.name}</strong></span>
                    <iconify-icon icon="lucide:chevron-right"
                        style="font-size: 14px; opacity: 0.5"></iconify-icon>
                </div>

                <p class="synopsis">
                    ${movie.overview}
                </p>

                <div class="review-section">
                    <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        ">
                        <h3 class="section-title" style="margin: 0">
                            Your Collection
                        </h3>
                        ${isCreator ? `
                        <button class="action-btn" style="padding: 8px 16px; font-size: 12px"
                            data-media-type="banani-button" onclick="editMovie()" data->
                            <iconify-icon icon="lucide:edit-2" style="font-size: 14px"></iconify-icon>
                            Edit
                        </button>
                        ` : ""}
                    </div>
                    <div style="
            background: var(--glass-surface);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            padding: 20px;
        ">
                        <div style="
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            ">
                            <div style="font-weight: 600; font-size: 14px">
                                Personal Rating
                            </div>
                            ${Array.from({ length: movie.rating }).map(() => `
                                <div style="color: #fbbf24; display: flex">
                                    <iconify-icon icon="lucide:star"
                                        style="font-size: 16px; fill: currentColor"></iconify-icon>
                                </div>
                            `).join('')}
                        </div>
                        <div style="
            color: var(--text-muted);
            font-size: 14px;
            font-style: italic;
            ">
                            "${movie.comment || ""}"
                        </div>
                    </div>
                </div>
            </div>  
        `
        backdrop.innerHTML += backdropHTML
        details.innerHTML += movieHTML

        setupEventListeners(movie.title, movie.creator.name);
    } catch (error) {
        console.error("Network issue.There was problem connecting with the server");
    }
}

function setupEventListeners(title, creator) {
    document.getElementById("sharePost").addEventListener("click", async (event) => {
        let shareBtn = event.target
        console.log(event);

        let shareData = {
            title: title,
            text: `Check out this post by ${creator}`,
            url: window.location.href
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
                console.log("Shared successfully!");
            }
            else {
                await navigator.clipboard.writeText(window.location.href)
                shareBtn.innerText = "✅ Copied"
                setTimeout(() => {
                    shareBtn.innerText = "Share"
                }, 2000)
            }
        } catch (error) {
            console.error("Could not copy text: ", err);
        }
    })
}
function editMovie() {
    window.location.href = `../html/editMovie.html?id=${movieId}`
}
function back() {
    window.location.href = "../html/movies.html";
}

const addToWatchlist = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/watchlist`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ movieId })
        })

        const result = await response.json()
        console.log(result);

        if (!response.ok) {
            const messageToShow = result.error || result.message || "An unknown error occured"
            console.error(messageToShow)
        } else {
            console.log("Added successfully", result);
            document.getElementById("watchlistText").innerText =  "Added to watchlist"
            
            const toastAlert = document.getElementById("toastAlert");
            toastAlert.style.display = "block"
            
            setTimeout(() => {
                toastAlert.style.display = "none"
                document.getElementById("watchlistText").innerText =  "Add to watchlist"
            }, 3000);
        }
    } catch (error) {
        console.error("Network issue.There was problem connecting with the server");
    }
};

fetchMovieDetails();
