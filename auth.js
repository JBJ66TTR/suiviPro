 const SUPABASE_URL = "https://zrhxszzidolffnsqeoxy.supabase.co";

const SUPABASE_KEY = "sb_publishable_gT80mru92Zgyjv-egB86ZQ_xVjcwpEU";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// Éléments de la page
const authForm = document.getElementById("authForm");
const authButton = document.getElementById("authButton");
const switchButton = document.getElementById("switchButton");
const authMessage = document.getElementById("authMessage");
const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
const switchText = document.getElementById("switchText");


// Mode actuel
let isSignup = false;


// =========================
// BASCULER CONNEXION / INSCRIPTION
// =========================

switchButton.addEventListener("click", function () {

    isSignup = !isSignup;

    authMessage.textContent = "";

    if (isSignup) {

        authTitle.textContent =
            "Créer votre compte";

        authSubtitle.textContent =
            "Commencez à gérer vos prospects avec SuiviPro.";

        authButton.textContent =
            "Créer mon compte";

        switchText.textContent =
            "Vous avez déjà un compte ?";

        switchButton.textContent =
            "Se connecter";

    } else {

        authTitle.textContent =
            "Bienvenue sur SuiviPro";

        authSubtitle.textContent =
            "Connectez-vous pour accéder à votre espace.";

        authButton.textContent =
            "Se connecter";

        switchText.textContent =
            "Vous n'avez pas encore de compte ?";

        switchButton.textContent =
            "Créer un compte";
    }

});


// =========================
// FORMULAIRE
// =========================

authForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    // Vérification simple
    if (!email || !password) {

        authMessage.textContent =
            "Veuillez remplir tous les champs.";

        return;
    }


    if (password.length < 6) {

        authMessage.textContent =
            "Le mot de passe doit contenir au moins 6 caractères.";

        return;
    }


    authButton.disabled = true;

    authButton.textContent =
        "Chargement...";

    authMessage.textContent = "";


    // =========================
    // INSCRIPTION
    // =========================

    if (isSignup) {

        const { data, error } =
            await supabaseClient.auth.signUp({
                email: email,
                password: password
            });


        if (error) {

            console.error(error);

            authMessage.textContent =
                "Erreur : " + error.message;

            authButton.disabled = false;

            authButton.textContent =
                "Créer mon compte";

            return;
        }


        console.log("Utilisateur créé :", data);


        authMessage.textContent =
            "Compte créé avec succès !";


        authButton.disabled = false;

        authButton.textContent =
            "Créer mon compte";


        /*
        Selon les réglages Supabase,
        un email de confirmation peut être demandé.
        */


        if (data.session) {

            setTimeout(function () {

                window.location.href =
                    "dashboard.html";

            }, 1000);

        } else {

            authMessage.textContent =
                "Compte créé ! Vérifiez votre email pour confirmer votre compte.";
        }


        return;
    }


    // =========================
    // CONNEXION
    // =========================

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });


    if (error) {

        console.error(error);

        authMessage.textContent =
            "Email ou mot de passe incorrect.";

        authButton.disabled = false;

        authButton.textContent =
            "Se connecter";

        return;
    }


    console.log("Utilisateur connecté :", data);


    authMessage.textContent =
        "Connexion réussie !";


    setTimeout(function () {

        window.location.href =
            "dashboard.html";

    }, 500);

});
