let movies = [];

const fetchSidebar = async () => {
    const response = await fetch("/html/sidebar.html");

    const result = await response.text();
    document.getElementById("sidebar").innerHTML = result;

    setupSidebarListeners();
}

fetchSidebar();

const fetchAddMovieModal = async () => {
    const response = await fetch("/html/addMovie.html");

    const result = await response.text();
    document.getElementById("movieModal").innerHTML = result;

    setupModalLogic();
}

fetchAddMovieModal();

const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:5001"
    : "https://filmstack.onrender.com";

const fetchMovies = async () => {
    const movieContainer = document.getElementById("movieContainer");

    try {
        const [movieRes, userRes] = await Promise.all([
            fetch(`${API_BASE_URL}/movies`),
            fetch(`${API_BASE_URL}/auth/me`, { credentials: 'include' })
        ]);

        const movieData = await movieRes.json();
        const userData = await userRes.json();

        movies = movieData?.data?.result || [];
        const user = userData.data.user


        console.log(movies);
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

        document.getElementById("collectionCount").innerHTML = `<div style="font-size: 14px; color: var(--text-muted)">${movies.length} Movie(s)</div>`

        if (movies.length === 0) {
            document.getElementById("movieContainer").innerHTML = "<p>No movies available.</p>";
            return;
        }

        let moviesHTML = "";

        movies.forEach(movie => {
            moviesHTML += `<div class="movie-card" data-movie-id="${movie.id}" data-media-type="banani-button">
                    <div class="card-image-container">
                        <img src="${movie.posterUrl}"
                            class="movie-poster" alt="Movie" />
                        <div style="
                  position: absolute;
                  top: 12px;
                  right: 12px;
                  background: rgba(0, 0, 0, 0.6);
                  backdrop-filter: blur(4px);
                  padding: 4px 8px;
                  border-radius: 6px;
                  font-size: 12px;
                  font-weight: 600;
                  color: #fbbf24;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                ">
                            <div style="
                    width: 12px;
                    height: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                                <iconify-icon icon="lucide:star" style="font-size: 12px; color: #fbbf24"></iconify-icon>
                            </div>
                            ${movie.rating || ""}
                        </div>
                    </div>
                    <div class="card-content">
                        <h3 class="movie-title">${movie.title}</h3>
                        <div class="movie-meta">${movie.releaseYear} • ${movie.genres.join(" | ")}</div>
                        <div class="creator-badge">
                            <img src="${movie.creator.profileUrl}"
                                class="creator-avatar" alt="Creator" />
                            <span class="creator-name">Added by ${movie.creator.name}</span>
                        </div>
                    </div>
                </div>`
        });
        movieContainer.innerHTML = moviesHTML

        setupEventListeners()

    } catch (error) {
        console.error("Network issue.There was problem connecting with the server");
    }
};

function setupEventListeners() {
    document.querySelectorAll(".movie-card").forEach((m) => {
        m.addEventListener("click", () => {
            const movieId = m.dataset.movieId
            console.log(movieId);

            window.location.href = `../html/movieDetails.html?id=${movieId}`;
        })
    });
}

const handleSearch = async () => {
    try {
        const searchTerm = document.getElementById("searchInput").value

        const response = await fetch(`${API_BASE_URL}/movies?search=${searchTerm}`);

        const result = await response.json();
        console.log(result);

        if (result.error || !result.data) {
            document.getElementById("movieContainer").innerHTML = `<p class="no-results">${result.error || "No movies found."}</p>`;
            return;
        }

        const searchedMovies = result.data.result

        let moviesHTML = "";

        searchedMovies.forEach(movie => {
            moviesHTML += `<div class="movie-card movie-card-js" data-movie-id="${movie.id}" data-media-type="banani-button">
                <div class="card-image-container">
                    <img data-aspect-ratio="2:3" data-query="cyberpunk movie poster futuristic neon city"
                        class="movie-poster" alt="Movie"
                        src="${movie.posterUrl}" />
                </div>
                <div class="card-content">
                    <h3 class="movie-title">${movie.title}</h3>
                    <div class="movie-meta">${movie.releaseYear} • ${movie.genres.join("  ") }</div>
                    <div class="creator-badge">
                        <img src="${movie.posterUrl}"
                            class="creator-avatar" alt="Creator" />
                        <span class="creator-name">Added by ${movie.creator.name}</span>
                    </div>
                </div>
            </div>`
        });
        movieContainer.innerHTML = moviesHTML;

        setupEventListeners();
    } catch (error) {
        console.error("Search Error:", error);
    }
}

const addMovie = () => {
    // window.location.href = "../html/addMovie.html";
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("drawer").style.display = "block";
};

document.getElementById("profile").addEventListener("click", () => {
    window.location.href = "../html/profile.html"
});

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

    function updateOutput() {
        try {
            const checkedBoxes = document.querySelectorAll('input[name="genres"]:checked');

            const values = Array.from(checkedBoxes).map(cb => cb.value);

            if (values.length === 0) {
                fetchMovies();
                return;
            }

            const filteredGenres = movies.filter(movie => movie.genres.some(genre => values.includes(genre)));

            if (filteredGenres.length === 0) {
                document.getElementById("movieContainer").innerHTML = "<p>No movies found.</p>";
                return;
            }

            let moviesHTML = "";

            filteredGenres.forEach(movie => {
                moviesHTML += `<div class="movie-card" data-movie-id="${movie.id}" data-media-type="banani-button">
                    <div class="card-image-container">
                        <img src="${movie.posterUrl}"
                            class="movie-poster" alt="Movie" />
                        <div style="
                  position: absolute;
                  top: 12px;
                  right: 12px;
                  background: rgba(0, 0, 0, 0.6);
                  backdrop-filter: blur(4px);
                  padding: 4px 8px;
                  border-radius: 6px;
                  font-size: 12px;
                  font-weight: 600;
                  color: #fbbf24;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                ">
                            <div style="
                    width: 12px;
                    height: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                                <iconify-icon icon="lucide:star" style="font-size: 12px; color: #fbbf24"></iconify-icon>
                            </div>
                            ${movie.rating || ""}
                        </div>
                    </div>
                    <div class="card-content">
                        <h3 class="movie-title">${movie.title}</h3>
                        <div class="movie-meta">${movie.releaseYear} • ${movie.genres.join("  ") }</div>
                        <div class="creator-badge">
                            <img src="${movie.creator.profileUrl}"
                                class="creator-avatar" alt="Creator" />
                            <span class="creator-name">Added by ${movie.creator.name}</span>
                        </div>
                    </div>
                </div>`
            });
            movieContainer.innerHTML = moviesHTML

            setupEventListeners()


        } catch (error) {
            console.error("Error fetching checked items:", error);
        }
    }

    document.querySelectorAll('input[name="genres"]').forEach(cb => {
        cb.addEventListener('change', updateOutput);
    });
}

function setupModalLogic() {
    document.getElementById("ratingDiv").innerHTML = `
    <!-- Rating -->
    <div class="form-group">
        <div class="rating-container">
            <div style="
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
">
                <iconify-icon icon="lucide:star"
                    style="font-size: 20px; color: #fbbf24"></iconify-icon>
            </div>
            <input type="range" id="rating-input" class="rating-slider" min="0" max="5" step="1"
                value="0" data-media-type="banani-button" />
            <div class="rating-value" id="volumeValue">0</div>
            <span class="rating-max">/5</span>
        </div>
    </div>
`

    function setupSliderListeners() {
        const output = document.getElementById("volumeValue");
        const slider = document.getElementById("rating-input");

        if (slider && output) {
            slider.addEventListener("input", () => {
                output.textContent = slider.value;
            });

            slider.addEventListener("change", () => {
                console.log("Final selected value:", slider.value);
            });
        }
    };

    setupSliderListeners();

    document.getElementById("imageDiv").addEventListener('click', () => {
        let preview = document.getElementById("imagePreview")
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.id = "image"

        input.style.display = "none";

        document.body.appendChild(input);


        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64Image = reader.result;
                preview.src = base64Image;

            }
            if (file) reader.readAsDataURL(file)
        }
        input.click();
    })

    const genreContainer = document.getElementById("genreContainer")

    genreContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("genre-pill")) {
            e.target.classList.toggle("selected");

            console.log(getSelectedGenres());
        }
    })
    function getSelectedGenres() {
        const selectedPills = document.querySelectorAll(".genre-pill.selected");

        return Array.from(selectedPills).map(pill => pill.getAttribute("data-genre"));
    };

    const addMovieButton = document.getElementById("addMovieButton");

    addMovieButton.addEventListener("click", async () => {
        const errorMessage = document.getElementById("errorMessage");

        const title = document.getElementById("title").value;
        const overview = document.getElementById("overview").value;
        const releaseYear = document.getElementById("releaseYear").value;
        const runtime = document.getElementById("runtime").value;
        const genres = getSelectedGenres();
        let fileInput = document.getElementById("image");
        const rating = parseInt(document.getElementById("rating-input").value);
        console.log(rating);


        const formData = new FormData();
        formData.append("title", title);
        formData.append("overview", overview);
        formData.append("releaseYear", releaseYear);
        formData.append("runtime", runtime);
        formData.append("rating", rating);

        formData.append("genres", JSON.stringify(genres));

        if (fileInput && fileInput.files[0]) {
            formData.append("posterUrl", fileInput.files[0]);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/movies`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            })

            const result = await response.json()
            console.log(result);

            errorMessage.style.display = "none"
            errorMessage.innerText = ""

            if (!response.ok) {
                const messageToShow = result.error || result.message || "An unknown error occured"
                showError(messageToShow)
            } else {
                console.log("Registration successful", result);
                window.location.href = "../index.html"
            }
        } catch (error) {
            showError("Network issue.There was problem connecting with the server");
        }

        function showError(msg) {
            errorMessage.style.display = "block"
            errorMessage.innerText = msg
        }
    });
    
    document.getElementById("closeBtn").addEventListener("click", () => {
        window.location.href = "../index.html"
    });
}

function back() {
    window.location.href = "../index.html"
}

fetchMovies();