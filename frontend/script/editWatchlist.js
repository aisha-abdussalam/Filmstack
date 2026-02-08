const watchlistId = new URLSearchParams(window.location.search).get("id");
const ALL_STATUSES = ["PLANNED", "COMPLETED", "WATCHING", "DROPPED"];

const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:5001"
    : "https://filmstack.onrender.com";

const fetchWatchlist = async () => {
    const response = await fetch(`${API_BASE_URL}/watchlist`,
        { credentials: 'include' }
    );

    const result = await response.json();

    console.log(result.data.watchlist);
    console.log(result.data.watchlist);

    const watchlist = result.data.watchlist;

    let watchlistItem = watchlist.find((w) => w.id === watchlistId);
    console.log(watchlistItem);

    const statusButtonsHTML = ALL_STATUSES.map(status => {
        // Check if this specific watchlist already has this status
        const isSelected = watchlistItem.status === status ? "selected" : "";

        return `
                <option value="${status}" ${isSelected}>${status}</option>
            `;
    }).join("");

    console.log(statusButtonsHTML);
    
    const editContainer = document.getElementById("editContainer");

    editContainer.innerHTML = `
        <!-- Header -->
        <div class="modal-header">
            <div class="modal-title-group">
                <h2 class="modal-title">Update "${watchlistItem.movie.title}"</h2>
                <span class="modal-subtitle">Modify your watchlist entry details</span>
            </div>
            <button class="close-btn" data-media-type="banani-button" aria-label="Close" onclick="window.history.back()">
                <div style="
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        ">
                    <iconify-icon icon="lucide:x"
                        style="font-size: 20px; color: currentColor"></iconify-icon>
                </div>
            </button>
        </div>

        <!-- Form -->
        <form id="watchlist-form" class="form-group" onsubmit="event.preventDefault();">
            <!-- Status -->
            <div class="form-group">
                <label class="label" for="status-select">Status</label>
                <div class="custom-select-wrapper">
                    <select id="status-select" class="custom-select" data-media-type="banani-button">
                        ${statusButtonsHTML}
                    </select>
                    <div class="select-icon">
                        <div style="
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            ">
                            <iconify-icon icon="lucide:chevron-down"
                                style="font-size: 16px; color: currentColor"></iconify-icon>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Rating -->
            <div class="form-group">
                <label class="label" for="rating-input">Your Rating</label>
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
                        value="${watchlistItem.rating || 0}" data-media-type="banani-button" />
                    <div class="rating-value" id="volumeValue">${watchlistItem.rating || 0}</div>
                    <span class="rating-max">/5</span>
                </div>
            </div>

            <!-- Notes -->
            <div class="form-group">
                <label class="label" for="notes-input">Notes</label>
                <textarea id="notes-input" class="textarea"
                    placeholder="Add your thoughts, review, or reminder..." data-media-type="banani-button">
${watchlistItem.notes ? watchlistItem.notes : ""}</textarea>
            </div>

            <div id="errorMessage" class="text-danger small mb-3" style="display: none;"></div>
            <!-- Actions -->
            <div class="modal-actions">
                <button type="button" class="btn btn-ghost" data-media-type="banani-button" onclick="window.history.back()">
                    Cancel
                </button>
                <button type="submit" class="btn btn-primary" onclick="editWatchlist()" data-media-type="banani-button">
                    Save Changes
                </button>
            </div>
        </form>
    `

    setupSliderListeners();
}

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

const editWatchlist = async () => {
    try {
        const status = document.getElementById("status-select").value;
        const rating = parseInt(document.getElementById("rating-input").value);
        const notes = document.getElementById("notes-input").value;

        console.log(status);
        console.log(typeof(status));
        console.log(rating);
        console.log(notes);

        const response = await fetch(`${API_BASE_URL}/watchlist/${watchlistId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, rating, notes })
        });

        const result = await response.json();
        console.log(result);

        errorMessage.style.display = "none";
        errorMessage.innerText = "";

        if (!response.ok) {
            const messageToShow = result.error || result.message || "An unknown error occured";
            showError(messageToShow);
        } else {
            console.log("Update successful", result);
            window.location.href = `../html/watchlist.html`;
        }
    } catch (error) {
        showError("Network issue.There was problem connecting with the server");
    };

    function showError(msg) {
        errorMessage.style.display = "block";
        errorMessage.style.color = "white";
        errorMessage.innerText = msg;
    };
}

fetchWatchlist()