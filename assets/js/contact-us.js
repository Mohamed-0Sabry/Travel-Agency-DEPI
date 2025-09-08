document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  let isValid = true;
  const name = document.getElementById("name");
  if (name.value.trim() === "") {
    name.classList.add("is-invalid");
    isValid = false;
  } else {
    name.classList.remove("is-invalid");
    name.classList.add("is-valid");
  }

  const email = document.getElementById("email"); 
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //online regex
  if (!emailPattern.test(email.value.trim())) {
    email.classList.add("is-invalid");
    isValid = false;
  } else {
    email.classList.remove("is-invalid");
    email.classList.add("is-valid");
  }

  const message = document.getElementById("message");
  if (message.value.trim().length < 10) {
    message.classList.add("is-invalid");
    isValid = false;
  } else {
    message.classList.remove("is-invalid");
    message.classList.add("is-valid");
  }

  if (isValid) {
    alert("✅ Form submitted successfully!");
    this.reset();

    [name, email, message].forEach((field) =>
      field.classList.remove("is-valid")
    );
  }
});
