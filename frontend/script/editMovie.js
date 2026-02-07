const movieId = new URLSearchParams(window.location.search).get("id");
const ALL_GENRES = ["Action", "Drama", "Sci-Fi", "Thriller", "Comedy", "Horror", "Mystery", "Romance", "Biography", "History"];

const fetchMovieDetails = async () => {
    try {
        const response = await fetch("http://127.0.0.1:5001/movies");

        const result = await response.json();
        const movies = result.data.result;
        const movie = movies.find((movie) => movie.id === movieId);

        const genreButtonsHTML = ALL_GENRES.map(genre => {
            // Check if this specific movie already has this genre
            const isSelected = movie.genres.includes(genre) ? "selected" : "";

            return `
                <button type="button" 
                        class="genre-pill ${isSelected}" 
                        data-genre="${genre}"
                        data-media-type="banani-button">
                    ${genre}
                </button>
            `;
        }).join("");

        document.getElementById("MovieContent").innerHTML = `
            <div class="poster-upload">
                <div class="poster-preview">
                    <img src="${movie.posterUrl}"
                        alt="Poster Preview" id="imagePreview"/>
                </div>
                <div class="upload-area" data-media-type="banani-button" id="imageDiv">
                    <div style="
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 12px;
            ">
                        <iconify-icon icon="lucide:image-plus"
                            style="font-size: 24px; color: var(--text-muted)"></iconify-icon>
                    </div>
                    <span style="font-size: 14px; font-weight: 500">Change Poster Image</span>
                    <span style="font-size: 12px; opacity: 0.6; margin-top: 4px">Drop image or click to
                        browse</span>
                </div>
            </div>

            <div class="form-group">
                <label class="label">Title</label>
                <input type="text" class="input-field" id="title" value="${movie.title}" data-media-type="banani-button" />
            </div>

            <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label class="label">Release Year</label>
                            <input type="number" class="input-field" id="releaseYear" value="${movie.releaseYear}" data-media-type="banani-button" />
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <label class="label">Runtime (min)</label>
                            <input type="number" class="input-field" id="runtime" value="${movie.runtime}" data-media-type="banani-button" />
                        </div>
                    </div>
                </div>

            <div class="form-group">
                <label class="label">Overview</label>
                <textarea class="input-field textarea-field" data-media-type="banani-button" id="overview">${movie.overview}</textarea>
            </div>

            <div class="form-group">
                <label class="label">Genres</label>
                <div class="genre-pill-container">
                    <div class="genre-pills" id="genreContainer">${genreButtonsHTML}</div>
                </div>
            </div>

            <div class="form-group">
                <label class="label">Comment</label>
                <textarea class="input-field textarea-field" data-media-type="banani-button" id="comment">${movie.comment || ""}</textarea>
            </div>

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
                        value="${movie.rating || 0}" data-media-type="banani-button" />
                    <div class="rating-value" id="volumeValue">${movie.rating || 0}</div>
                    <span class="rating-max">/5</span>
                </div>
            </div>
            `

        setupEventListeners();
        setupSliderListeners();
    } catch (error) {
        showError("Network issue.There was problem connecting with the server");
    }
};

function setupEventListeners() {
    const genreContainer = document.getElementById("genreContainer");
    const imageDiv = document.getElementById("imageDiv");

    imageDiv.addEventListener('click', () => {
        let imagePreview = document.getElementById("imagePreview")
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.id = "image";
        // input.setAttribute("id", "image");
        input.style.display = "none"; // To make it findable by ID later

        document.body.appendChild(input); // To make it findable by ID later


        input.onchange = (e) => {
            const file = e.target.files[0]
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64Image = reader.result
                imagePreview.src = base64Image
            }
            if (file) reader.readAsDataURL(file)
        }

        input.click();
    })

    genreContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("genre-pill")) {
            e.target.classList.toggle("selected");

            console.log(getSelectedGenres());
        }
    });
};

function getSelectedGenres() {
    const selectedPills = document.querySelectorAll(".genre-pill.selected");

    return Array.from(selectedPills).map(pill => pill.getAttribute("data-genre"));
};

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

const editMovieButton = async () => {
    const title = document.getElementById("title").value;
    const overview = document.getElementById("overview").value;
    const releaseYear = document.getElementById("releaseYear").value;
    const runtime = document.getElementById("runtime").value;
    const comment = document.getElementById("comment").value;
    const rating = parseInt(document.getElementById("rating-input").value);
    const genres = getSelectedGenres();
    let fileInput = document.getElementById("image");

    const formData = new FormData();
    formData.append("title", title)
    formData.append("overview", overview)
    formData.append("releaseYear", releaseYear)
    formData.append("runtime", runtime)
    formData.append("rating", rating)
    formData.append("comment", comment)

    formData.append("genres", JSON.stringify(genres));

    if (fileInput && fileInput.files[0]) {
        formData.append("posterUrl", fileInput.files[0]);
    }

    try {
        const response = await fetch(`http://127.0.0.1:5001/movies/${movieId}`, {
            method: 'PUT',
            credentials: 'include',
            body: formData
        })

        const result = await response.json();
        console.log(result);

        errorMessage.style.display = "none";
        errorMessage.innerText = "";

        if (!response.ok) {
            const messageToShow = result.error || result.message || "An unknown error occured"
            showError(messageToShow)
        } else {
            console.log("Registration successful", result);
            window.location.href = `../html/movieDetails.html?id=${movieId}`;
        }
    } catch (error) {
        showError("Network issue.There was problem connecting with the server");
    }

}
function showError(msg) {
    errorMessage.style.display = "block";
    errorMessage.innerText = msg;
}

fetchMovieDetails();