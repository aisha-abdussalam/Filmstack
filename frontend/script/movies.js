const fetchSidebar = async () => {
    const response = await fetch("/html/sidebar.html")

    const result = await response.text()
    document.getElementById("sidebar").innerHTML = result

    setupSidebarListeners()
}

fetchSidebar();

const fetchAddMovieModal = async () => {
    const response = await fetch("/html/addMovie.html");

    const result = await response.text();
    document.getElementById("movieModal").innerHTML = result;

    setupModalLogic();
}

fetchAddMovieModal();

function setupSidebarListeners() {
    document.getElementById("goToBrowse").addEventListener("click", () => {
        window.location.href = "../html/dashboard.html"
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
        else if (currentPath.includes('dashboard.html') && item.id === 'goToBrowse') {
            item.classList.add('active');
        }
        else if (currentPath.includes('movies.html') && item.id === 'goToMovies') {
            item.classList.add('active');
        }
    });
}

const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:5001"
    : "https://filmstack.onrender.com";

let myCollection = [];
const displayMoviesCollection = async () => {
    const movieContainer = document.getElementById("movieContainer");
    movieContainer.innerHTML = "";

    try {
        const [movieRes, userRes] = await Promise.all([
            fetch(`${API_BASE_URL}/movies`),
            fetch(`${API_BASE_URL}/auth/me`, { credentials: 'include' })
        ]);

        const movieData = await movieRes.json();
        const userData = await userRes.json();

        const movies = movieData?.data?.result || [];

        const user = userData.data.user

        console.log(movies);

        console.log(user);

        if (!user) {
            console.error("User not logged in");
            return;
        }

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

        let moviesHTML = "";

        myCollection = movies.filter((movie) => movie.createdBy === user.id)
        console.log(myCollection);

        if (myCollection.length === 0) {
            movieContainer.innerHTML = `<tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <iconify-icon icon="lucide:search-x" style="font-size: 24px; margin-bottom: 8px;"></iconify-icon>
                    <p>Your collection is empty.</p>
                </td>
            </tr>`
            return;
        }

        document.getElementById("collectionCount").innerHTML = `<div style="font-size: 14px; color: var(--text-muted)">${myCollection.length} Movie(s)</div>`

        myCollection.forEach(movie => {
            const formattedDate = new Date(movie.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            moviesHTML += `
                <tr data-media-type="banani-button" class="movieRow">
                    <td>
                        <div class="movie-info-cell" data-movie-id="${movie.id}">
                            <img src="${movie.posterUrl}"
                                class="table-poster" alt="Inception" />
                            <div>
                                <span class="movie-title-text">${movie.title}</span>
                                <span style="font-size: 12px; color: var(--text-muted)">Added By: ${movie.creator.name}</span>
                            </div>
                        </div>
                    </td>
                    <td>${movie.genres.join(" | ")}</td>
                    <td>${movie.releaseYear}</td>
                    <td>
                        <div class="rating-badge">
                            <div style="
                width: 12px;
                height: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                ">
                                <iconify-icon icon="lucide:star"
                                    style="font-size: 12px; color: #fbbf24"></iconify-icon>
                            </div>
                            ${movie.rating}
                        </div>
                    </td>
                    <td style="color: var(--text-muted); font-size: 13px">
                        ${formattedDate}
                    </td>
                    <td>
                        <div class="action-cell">
                            <button class="action-btn delete" title="Delete" data-media-type="banani-button" data-movie-id="${movie.id}">
                                <div style="
                    width: 16px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                                    <iconify-icon icon="lucide:trash-2"
                                        style="font-size: 16px; color: currentColor"></iconify-icon>
                                </div>
                            </button>
                        </div>
                    </td>
                </tr>
            `
        });
        movieContainer.innerHTML = moviesHTML

        setupEventListeners();

    } catch (error) {
        console.error("Network issue.There was problem connecting with the server");
    }
};

function setupEventListeners() {
    document.querySelectorAll(".movie-info-cell").forEach((m) => {
        m.addEventListener("click", () => {
            const movieId = m.dataset.movieId;

            window.location.href = `../html/movieDetails.html?id=${movieId}`
        });
    });

    document.querySelectorAll(".delete").forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", async (e) => {
            e.stopPropagation();

            // if (!confirm("Are you sure you want to delete this movie?")) return;
            try {
                const movieId = deleteBtn.dataset.movieId;

                const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });

                const result = await response.json();
                console.log(result);

                if (!response.ok) {
                    const messageToShow = result.error || result.message || "An unknown error occured"
                    console.error(messageToShow)
                } else {
                    console.log("Deleted successfully", result);
                    await displayMoviesCollection();

                    const toastAlert = document.getElementById("toastAlert");
                    toastAlert.style.display = "block"

                    setTimeout(() => {
                        toastAlert.style.display = "none"
                    }, 3000);
                }
            } catch (error) {
                console.error("Network issue.There was problem connecting with the server");
            }
        })
    })
};


function handleSearch() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();

    const filteredMovies = myCollection.filter(movie => movie.title.toLowerCase().includes(searchInput))

    if (filteredMovies.length === 0) {
        document.getElementById("movieContainer").innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <iconify-icon icon="lucide:search-x" style="font-size: 24px; margin-bottom: 8px;"></iconify-icon>
                    <p>No movies found with that title.</p>
                </td>
            </tr>
        `
        return
    }

    let moviesHTML = "";

    filteredMovies.forEach(movie => {
        const formattedDate = new Date(movie.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        moviesHTML += `
                <tr data-media-type="banani-button" class="movieRow">
                    <td>
                        <div class="movie-info-cell" data-movie-id="${movie.id}">
                            <img src="${movie.posterUrl}"
                                class="table-poster" alt="Inception" />
                            <div>
                                <span class="movie-title-text">${movie.title}</span>
                                <span style="font-size: 12px; color: var(--text-muted)">Added By: ${movie.creator.name}</span>
                            </div>
                        </div>
                    </td>
                    <td>${movie.genres.join("  ")}</td>
                    <td>${movie.releaseYear}</td>
                    <td>
                        <div class="rating-badge">
                            <div style="
                width: 12px;
                height: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                ">
                                <iconify-icon icon="lucide:star"
                                    style="font-size: 12px; color: #fbbf24"></iconify-icon>
                            </div>
                            8.8
                        </div>
                    </td>
                    <td style="color: var(--text-muted); font-size: 13px">
                        ${formattedDate}
                    </td>
                    
                </tr>
            `
    });
    movieContainer.innerHTML = moviesHTML;

    setupEventListeners();
}

const addMovie = () => {
    // window.location.href = "../html/addMovie.html";
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("drawer").style.display = "block";
};

document.getElementById("profile").addEventListener("click", () => {
    window.location.href = "../html/profile.html";
});

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
                window.location.href = "../html/dashboard.html"
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
        window.location.href = "../html/dashboard.html"
    });
}

function back() {
    window.location.href = "../html/dashboard.html"
}

displayMoviesCollection();