(() => {
    const loginForm = document.getElementById("loginForm");
    const messageBox = document.getElementById("messageBox");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                credentials: "include",
                body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            });

            if (response.redirected) {
                window.location.href = response.url;
            } else if (response.status === 200) {
                window.location.href = "index.html";
            } else {
                messageBox.textContent = "Neispravno korisničko ime ili lozinka.";
                messageBox.className = "message error";
            }
        } catch (error) {
            console.error("Greška prilikom logina:", error);
            messageBox.textContent = "Greška na serveru. Pokušajte ponovo.";
            messageBox.className = "message error";
        }
    });

    async function provjeriSesiju() {
        try {
            const response = await fetch("http://localhost:8080/api/knjige", {
                method: "GET",
                credentials: "include"
            });

            if (response.status === 200) {
                const data = await response.json();
                console.log("Sesija OK, učitavamo podatke:", data);
            } else if (response.status === 401 || response.status === 403) {
                window.location.href = "login.html";
            }
        } catch (error) {
            console.error("Greška prilikom provjere sesije:", error);
            window.location.href = "login.html";
        }
    }

    if (window.location.pathname.endsWith("index.html")) {
        provjeriSesiju();
    }
})();
