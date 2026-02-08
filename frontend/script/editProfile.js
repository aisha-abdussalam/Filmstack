const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:5001"
    : "https://filmstack.onrender.com";

const editUserInfo = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            credentials: 'include',
        })

        const result = await response.json()
        console.log(result);

        const user = result.data.user
        if (!user) return showError("Could not load user data.");

        document.getElementById("editContainer").innerHTML = `
            <div class="modal-body">
                <div class="avatar-section">
                    <div class="avatar-container" data-media-type="banani-button">
                        <img src="${user.profileUrl}"
                            class="current-avatar" alt="Profile Avatar" id="imagePreview" />
                        <div class="edit-avatar-btn" id="imageDiv">
                            <div style="
                    width: 14px;
                    height: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                                <iconify-icon icon="lucide:camera"
                                    style="font-size: 14px; color: white"></iconify-icon>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: center">
                        <div style="
                font-size: 14px;
                font-weight: 500;
                color: var(--text-main);
                margin-bottom: 4px;
                ">
                            Profile Photo
                        </div>
                    </div>
                </div>

                <div class="form-grid">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Display Name</label>
                            <input type="text" class="form-input" value="${user.name}" id="name" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Username</label>
                            <input type="text" class="form-input" value="${user.username ? user.username : ""}" placeholder="username" id="username"/>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Bio</label>
                        <textarea class="form-textarea" id="bio" placeholder="Tell us about your movie taste...">${user.bio ? user.bio : ""}</textarea>
                    </div>
                </div>
            </div>

            <div id="errorMessage" class="text-danger small mb-3" style="display: none;"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-ghost" data-media-type="banani-button" onclick="window.history.back()">
                    Cancel
                </button>
                <button type="button" class="btn btn-primary" data-media-type="banani-button" onclick="editButton()">
                    Save Changes
                </button>
            </div>
        `

        setupEventListeners();
    } catch (error) {
        showError("Network issue.There was problem connecting with the server");
    }
};

function setupEventListeners() {
    const imageDiv = document.getElementById("imageDiv");

    imageDiv.addEventListener('click', () => {
        let imagePreview = document.getElementById("imagePreview")
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.id = "image";
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
    });
};

const editButton = async () => {
    const name = document.getElementById("name").value;
    const username = document.getElementById("username").value;
    const bio = document.getElementById("bio").value;
    let fileInput = document.getElementById("image");


    const formData = new FormData();
    formData.append("name", name)
    formData.append("username", username)
    formData.append("bio", bio)

    if (fileInput && fileInput.files[0]) {
        formData.append("profileUrl", fileInput.files[0]);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
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
            showError(messageToShow);
        } else {
            console.log("Update successful", result);
            window.location.href = "../html/profile.html";
        }
    } catch (error) {
        showError("Network issue.There was problem connecting with the server");
    }

    function showError(msg) {
        errorMessage.style.display = "block";
        errorMessage.innerText = msg;
    }
}

editUserInfo()