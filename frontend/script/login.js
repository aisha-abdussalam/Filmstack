const loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    errorMessage.innerHTML = ""
    errorMessage.style.display = "none"

    try {
        const response = await fetch("http://127.0.0.1:5001/auth/login", {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok) {
            const messageToShow = result.error || result.message || "An unknown error occured";
            showError(messageToShow)
        } else {
            console.log("Login successful");
            window.location.href = "../html/dashboard.html"
        }
    } catch (error) {
        showError("Network issue.There was problem connecting with the server")
    }

    function showError(msg) {
        errorMessage.innerHTML = msg
        errorMessage.style.display = "block"
    }
})