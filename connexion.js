// ================================
// AFFICHER / MASQUER MOT DE PASSE
// ================================

const password =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");


togglePassword.addEventListener(
    "click",
    function () {

        if (password.type === "password") {

            password.type = "text";

            togglePassword.textContent = "🙈";

        } else {

            password.type = "password";

            togglePassword.textContent = "👁";

        }

    }
);


// ================================
// CONNEXION
// ================================

const loginForm =
    document.getElementById("loginForm");

const message =
    document.getElementById("message");


loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const email =
            document.getElementById("email").value.trim();

        const passwordValue =
            document.getElementById("password").value;


        if (!email || !passwordValue) {

            message.textContent =
                "Veuillez remplir tous les champs.";

            return;
        }


        message.textContent =
            "Connexion réussie ✓";


        message.style.color =
            "lightgreen";


        setTimeout(function () {

            window.location.href =
                "index.html";

        }, 1000);

    }
);