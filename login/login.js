document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const submitButton = document.getElementById("submit-button");

    usernameInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            passwordInput.focus();
        }
    });

    passwordInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            handleLogin();
        }
    });

    submitButton.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            handleLogin();
        }
    });

    submitButton.addEventListener("click", handleLogin);

    function handleLogin() {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username === "" || password === "") {
            showAlert("Please fill in both username and password fields.");
            return;
        }

        const users = [
            {
                username: "admin", password: "1234"
            },
            {
                username: "pepe", password: "el"
            },
            {
                username: "pepesand", password: "papadeindependiente"
            },
        ];

        const userFound = users.find(user => user.username === username && user.password === password);

        if (userFound) {
            window.location.href = "../index.html";
        } else {
            showAlert("Invalid username or password.");
            usernameInput.focus();
            passwordInput.value = ""; 
        }
    }

    function showAlert(message) {
        alert(message);
    }
});
