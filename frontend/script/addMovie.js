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
    let imagePreview = document.getElementById("imagePreview")
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
            imagePreview.src = base64Image;
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
        const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
            ? "http://127.0.0.1:5001"
            : "https://filmstack.onrender.com";
        
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

function back() {
    window.location.href = "../index.html"
}

document.getElementById("closeBtn").addEventListener("click", () => {
    window.location.href = "../index.html"
});