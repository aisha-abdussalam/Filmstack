const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:5001"
    : "https://filmstack.onrender.com";

const registrationButton = document.getElementById("registrationButton");
registrationButton.addEventListener("click", async () => {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })

        const result = await response.json()
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
})
    