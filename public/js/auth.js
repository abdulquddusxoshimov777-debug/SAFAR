(function () {
  const API = window.saffar_API_BASE || (location.protocol === "file:" ? "http://localhost:4000" : "");
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const urlParams = new URLSearchParams(window.location.search);
  const redirectTarget = urlParams.get("redirect");

  // ---------- password show/hide ----------
  document.querySelectorAll(".toggle-pass").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.target);
      if (input) {
        input.type = input.type === "password" ? "text" : "password";
      }
    });
  });

  function setInvalid(fieldId, invalid) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.toggle("invalid", invalid);
    field.querySelector(".field-input")?.classList.toggle("error", invalid);
  }

  function showAlert(message) {
    const box = document.getElementById("alertBox");
    if (!box) return;
    box.textContent = message;
    box.classList.add("show");
    document.getElementById("successBox")?.classList.remove("show");
  }
  function showSuccess(message) {
    const box = document.getElementById("successBox");
    if (!box) return;
    box.textContent = message;
    box.classList.add("show");
    document.getElementById("alertBox")?.classList.remove("show");
  }
  function clearAlerts() {
    document.getElementById("alertBox")?.classList.remove("show");
    document.getElementById("successBox")?.classList.remove("show");
  }

  function setLoading(btn, loading, labelWhenDone) {
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading ? "Please wait…" : labelWhenDone;
  }

  function saveSession(token, user) {
    localStorage.setItem("saffar_token", token);
    localStorage.setItem("saffar_user", JSON.stringify(user));
  }

  function getRedirectDestination() {
    if (redirectTarget === "reviews") return "index.html?open=reviews#reviews-section";
    if (redirectTarget) return redirectTarget;
    return "account.html";
  }

  // ---------- LOGIN ----------
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAlerts();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      let ok = true;
      const emailValid = EMAIL_RE.test(email);
      setInvalid("emailField", !emailValid);
      if (!emailValid) ok = false;
      setInvalid("passwordField", !password);
      if (!password) ok = false;
      if (!ok) return;

      const btn = document.getElementById("submitBtn");
      setLoading(btn, true, "Sign in");

      try {
        const res = await fetch(`${API}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          showAlert(data.message || "Could not sign in. Please try again.");
          setLoading(btn, false, "Sign in");
          return;
        }
        saveSession(data.token, data.user);
        showSuccess(`Welcome back, ${data.user.name}. Redirecting…`);
        setTimeout(() => (location.href = getRedirectDestination()), 700);
      } catch (err) {
        console.error("Login request failed:", err);
        showAlert("Couldn't reach the saffar server. Make sure the backend is running.");
        setLoading(btn, false, "Sign in");
      }
    });
  }

  // ---------- SIGNUP ----------
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAlerts();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirm = document.getElementById("confirm").value;

      let ok = true;
      setInvalid("nameField", !name);
      if (!name) ok = false;

      const emailValid = EMAIL_RE.test(email);
      setInvalid("emailField", !emailValid);
      if (!emailValid) ok = false;

      const passValid = password.length >= 6;
      setInvalid("passwordField", !passValid);
      if (!passValid) ok = false;

      const matches = password === confirm && confirm.length > 0;
      setInvalid("confirmField", !matches);
      if (!matches) ok = false;

      if (!ok) return;

      const btn = document.getElementById("submitBtn");
      setLoading(btn, true, "Create account");

      const role = document.getElementById("role")?.value || "tourist";

      try {
        const res = await fetch(`${API}/api/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, confirmPassword: confirm, role }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          showAlert(data.message || "Could not create your account. Please try again.");
          setLoading(btn, false, "Create account");
          return;
        }
        saveSession(data.token, data.user);
        showSuccess(`Account created for ${data.user.name}. Redirecting…`);
        setTimeout(() => (location.href = getRedirectDestination()), 700);
      } catch (err) {
        console.error("Signup request failed:", err);
        showAlert("Couldn't reach the saffar server. Make sure the backend is running.");
        setLoading(btn, false, "Create account");
      }
    });
  }
})();
