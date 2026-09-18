const SUPABASE_URL = "https://zrhxszzidolffnsqeoxy.supabase.co";

const SUPABASE_KEY = "TA_PUBLISHABLE_KEY";


const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


const authForm = document.getElementById("authForm");
const authButton = document.getElementById("authButton");
const switchButton = document.getElementById("switchButton");
const authMessage = document.getElementById("authMessage");
const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
const switchText = document.getElementById("switchText");


let isSignup = false;


switchButton.addEventListener("click", function () {

    isSignup = !isSignup;

    if (isSignup) {

        authTitle.textContent = "Créer votre compte";

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


authForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    authMessage.textContent = "Chargement...";


    if (isSignup) {

        const { data, error } =
            await supabaseClient.auth.signUp({
                email: email,
                password: password
            });


        if (error) {

            authMessage.textContent =
                error.message;

            return;
        }


        authMessage.textContent =
            "Compte créé ! Vérifiez votre email si Supabase demande une confirmation.";

    } else {

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });


        if (error) {

            authMessage.textContent =
                error.message;

            return;
        }


        window.location.href =
            "dashboard.html";

    }

});
