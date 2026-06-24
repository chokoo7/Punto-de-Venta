document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const correo = document.getElementById("email").value;
  const contraseña = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contraseña }),
      credentials: "include", // para que se guarde la cookie
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "Dashboard.html";
    } else {
      document.getElementById("errorMessage").textContent = data.mensaje;
    }
  } catch (error) {
    document.getElementById("errorMessage").textContent =
      "Error de conexión con el servidor";
  }
});
