const fetchSidebar = async () => {
    const response = await fetch("http://127.0.0.1:5500/html/sidebar.html")

    const result = await response.text()
    document.getElementById("sidebar").innerHTML = result

    setupSidebarListeners()
}

fetchSidebar();

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
}

const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:5001"
    : "https://filmstack.onrender.com";

const fetchUser = async () => {
    try {
        const [watchlistRes, userRes, movieRes] = await Promise.all([
            fetch(`${API_BASE_URL}/watchlist`, { credentials: 'include' }),
            fetch(`${API_BASE_URL}/auth/me`, { credentials: 'include' }),
            fetch(`${API_BASE_URL}/movies`)
        ]);

        const watchlistData = await watchlistRes.json();
        const userData = await userRes.json();
        const movieData = await movieRes.json();

        if (!userRes.ok) {
            const messageToShow = userData.error || userData.message || "An unknown error occured"
            console.error(messageToShow)
        }

        const watchlist = watchlistData?.data?.watchlist || [];
        const user = userData.data.user
        const movies = movieData?.data?.result || [];

        console.log(user);
        console.log(watchlist);
        console.log(movies);


        const completedMovies = watchlist.filter(watchlistItem => watchlistItem.status === "COMPLETED");
        console.log(completedMovies);

        let totalWatchTime = 0
        totalWatchTime = completedMovies.reduce((acc, item) => {
            return acc + (item.movie.runtime || 0)
        }, 0)
        console.log(totalWatchTime);
        
        const hours = Math.floor(totalWatchTime / 60)
        const minutes = totalWatchTime % 60;
        console.log(`${hours}h ${minutes}m`);
        
        myCollection = movies.filter((movie) => movie.createdBy === user.id)
        console.log(myCollection);

        const formattedDate = new Date(user.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        let userHTML = "";

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

        userHTML = `
            <!-- Profile Header -->
            <div class="profile-header">
                <img src="${user.profileUrl}"
                    class="profile-avatar-large" alt="${user.name}" />
                <div class="profile-info">
                    <h1 class="profile-name">${user.name}</h1>
                    <div class="profile-meta">
                        <span>@${user.username || "username"}</span>
                        <span>•</span>
                        <span>Joined ${formattedDate}</span>
                    </div>
                </div>
                <button class="btn btn-primary" data-media-type="banani-button" onclick="editProfile()">
                    Edit Profile
                </button>

                <button class="btn btn-secondary" style="border-color: var(--destructive); color: var(--destructive)"
                    data-media-type="banani-button" onclick="logout()">
                    <div style="
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 6px;
              ">
                        <iconify-icon icon="lucide:log-out" style="font-size: 16px; color: currentColor"></iconify-icon>
                    </div>
                    Log Out
                </button>
            </div>

            <!-- Bio Section -->
            <section class="settings-section" id="profile-bio-section">
                <h2 class="settings-title">Bio</h2>
                <div style="
              max-width: 100%;
              background: var(--glass-surface);
              border: 1px solid var(--glass-border);
              border-radius: 12px;
              padding: 20px 24px;
              font-size: 14px;
              color: var(--text-muted);
              line-height: 1.6;
            ">
                    ${user.bio || "No bio available"}
                </div>
            </section>

            <!-- Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${completedMovies.length}</div>
                    <div class="stat-label">Movies Watched</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${myCollection.length}</div>
                    <div class="stat-label">Lists Created</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${hours}h ${minutes} m</div>
                    <div class="stat-label">Total Watch Time</div>
                </div>
            </div>
        `

        document.getElementById("userDetailsContainer").innerHTML = userHTML

    } catch (error) {
        console.error("Network issue.There was problem connecting with the server");
    }
}

function editProfile() {
    window.location.href = "../html/editProfile.html"
}

const logout = async () => {
    try {
        const response = await fetch("http://127.0.0.1:5001/auth/logout", {
            method: "POST"
        });
        const result = await response.json();

        console.log("logout successful");
        window.location.href = "../html/login.html";
    } catch (error) {
        console.error("Network error. There was a problem connecting with the server.");
    }
}

document.getElementById("profile").addEventListener("click", () => {
    window.location.href = "../html/profile.html";
});

fetchUser()