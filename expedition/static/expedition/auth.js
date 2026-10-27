(() => {
    "use strict";

    const form = document.querySelector("#auth-form");
    const status = document.querySelector("#auth-status");
    const logoutButton = document.querySelector("#logout-button");

    function csrfToken() {
        return document.cookie
            .split(";")
            .map(part => part.trim())
            .find(part => part.startsWith("csrftoken="))
            ?.slice("csrftoken=".length) || "";
    }

    function clearLearnerState() {
        Object.keys(localStorage)
            .filter(key => key.startsWith("geoshield-"))
            .forEach(key => localStorage.removeItem(key));
    }

    async function send(url, body = {}) {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken(),
            },
            body: JSON.stringify(body),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || "Не удалось выполнить запрос.");
        }
        return data;
    }

    form?.addEventListener("submit", async event => {
        event.preventDefault();
        const submitter = event.submitter;
        const action = submitter?.value === "register" ? "register" : "login";
        const data = new FormData(form);
        const buttons = [...form.querySelectorAll("button")];
        buttons.forEach(button => { button.disabled = true; });
        status.textContent = "";
        try {
            await send(`/api/auth/${action}/`, {
                name: data.get("name"),
                password: data.get("password"),
            });
            clearLearnerState();
            window.location.reload();
        } catch (error) {
            status.textContent = error instanceof Error ? error.message : "Не удалось выполнить запрос.";
            buttons.forEach(button => { button.disabled = false; });
        }
    });

    logoutButton?.addEventListener("click", async () => {
        logoutButton.disabled = true;
        try {
            await send("/api/auth/logout/");
            clearLearnerState();
            window.location.href = "/";
        } catch (error) {
            logoutButton.disabled = false;
        }
    });
})();
