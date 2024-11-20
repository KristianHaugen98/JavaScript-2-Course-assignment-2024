// Registreringsskjemaet
const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

// Feilmeldinger
const fullNameError = document.getElementById("fullNameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

// Funksjon for validering
function validateForm({ fullName, email, password, confirmPassword }) {
  let isValid = true;

  fullNameError.textContent = fullName ? "" : "Full name is required.";
  if (!fullName) isValid = false;

  emailError.textContent =
    email.endsWith("@noroff.no") || email.endsWith("@stud.noroff.no")
      ? ""
      : "Email must end with @noroff.no or @stud.noroff.no";
  if (!email.endsWith("@noroff.no") && !email.endsWith("@stud.noroff.no"))
    isValid = false;

  passwordError.textContent =
    password.length >= 6 ? "" : "Password must be at least 6 characters.";
  if (password.length < 6) isValid = false;

  confirmPasswordError.textContent =
    password === confirmPassword ? "" : "Passwords do not match.";
  if (password !== confirmPassword) isValid = false;

  return isValid;
}

// Registreringsskjema
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();

  // Valider skjema
  if (!validateForm({ fullName, email, password, confirmPassword })) {
    return;
  }

  // Data for API
  const userData = { fullName, email, password };

  try {
    const response = await fetch("https://api.noroff.no/social/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      registerMessage.textContent =
        "Registration successful! You can now log in.";
      registerForm.reset();
    } else {
      const error = await response.json();
      registerMessage.textContent = `Error: ${error.message}`;
    }
  } catch (err) {
    registerMessage.textContent = "An error occurred. Please try again.";
  }
});

// Innloggingsskjemaet
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const loginData = { email, password };

  try {
    const response = await fetch("https://api.noroff.no/social/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem("jwtToken", token); // Lagre token
      loginMessage.textContent = "Login successful!";
      loginForm.reset();
    } else {
      const error = await response.json();
      loginMessage.textContent = `Error: ${error.message}`;
    }
  } catch (err) {
    loginMessage.textContent = "An error occurred. Please try again.";
  }
});
