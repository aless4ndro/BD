

const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

function showError(element, message) {
  $(element).text(message);
}

function clearError(element) {
  $(element).text("");
}

$("#form").on("submit", function (event) {
  event.preventDefault();

  let isValid = true;

  const email = $("#email").val();
  if (!emailRegex.test(email)) {
    showError("#email-error", "Veuillez saisir un email valide.");
    isValid = false;
  } else {
    clearError("#email-error");
  }

  const password = $("#password").val();
  if (!passwordRegex.test(password)) {
    showError("#password-error", "Le mot de passe doit contenir au moins 6 caractères, une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial.");
    isValid = false;
  } else {
    clearError("#password-error");
  }

  const confirmPassword = $("#confirm-password").val();
  if (password !== confirmPassword) {
    showError("#confirm-password-error", "Les mots de passe ne correspondent pas.");
    isValid = false;
  } else {
    clearError("#confirm-password-error");
  }


  if (isValid) {
    // Envoyez les données d'inscription au serveur
    console.log("Formulaire d'inscription validé");
    // Exemple : registerUser(nom, prenom, email, password);

    // Redirigez l'utilisateur vers la page de connexion
    window.location.href = "BD.html";
  }
});