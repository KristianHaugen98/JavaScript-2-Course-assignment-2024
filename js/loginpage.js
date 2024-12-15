// Registreringsskjemaet
const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

// Feilmeldinger
const fullNameError = document.getElementById("fullNameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

// Funksjon for å rydde opp feilmeldinger

function clearErrors() {
  fullNameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";
  registerMessage.textContent = ""; // Nullstill melding før forespørsel
}

// Innloggingsskjemaet
const loginForm = document.getElementById("loginForm");
const loginMessage =
  document.getElementById("loginMessage") || document.createElement("div");

if (!document.getElementById("loginMessage")) {
  loginForm.appendChild(loginMessage);
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const loginData = { email, password };

  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": "790ebff1-28aa-41f4-a642-abffd4660a3d",
      },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.data.accessToken;

      if (token) {
        localStorage.setItem("jwtToken", token); // Lagre token
        console.log("Token lagret i localstore");
      }
      console.log("Token lagret:", token);
      // Vis suksessmelding.

      loginMessage.textContent = "Login successful!";
      loginForm.reset();
      // Navigerer til profilsiden.
      window.location.href = "/profilepage.html";
    } else {
      const error = await response.json();
      loginMessage.textContent = `Error: ${error.message}`;
    }
  } catch (err) {
    console.error("Network error:", err);
    loginMessage.textContent = "An error occurred. Please try again.";
  }
});
