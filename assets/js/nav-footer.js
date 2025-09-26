function togglePassword(inputId, toggleElement) {
  const input = document.getElementById(inputId);
  const icon = toggleElement.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    icon.className = "fa-solid fa-eye";
  } else {
    input.type = "password";
    icon.className = "fa-solid fa-eye-slash";
  }
}

// Handle form submissions
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("#loginModal form");
  const signupForm = document.querySelector("#signupModal form");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Login form submitted! (This is just a demo)");
  });

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert("Sign up form submitted! (This is just a demo)");
  });
});
