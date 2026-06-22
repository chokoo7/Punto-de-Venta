// Base de datos simulada de usuarios con sus respectivos roles y accesos
const usuariosRegistrados = [
    {
        email: "admin@correo.com",
        password: "admin123",
        role: "Administrador",
        areas: ["Ventas", "Proveedores", "Inventario"]
    },
    {
        email: "empleado@correo.com",
        password: "empleado123",
        role: "Empleado",
        areas: ["Ventas"]
    }
];

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email').value.trim();
    const passwordInput = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // 1. Buscar si el correo existe en nuestra lista
    const usuarioEncontrado = usuariosRegistrados.find(user => user.email === emailInput);

    if (!usuarioEncontrado) {
        // Error específico si el usuario no existe
        errorMessage.textContent = "El usuario no se encuentra registrado.";
        return;
    }

    // 2. Si el usuario existe, validar la contraseña
    if (usuarioEncontrado.password !== passwordInput) {
        // Error específico si la contraseña está mal
        errorMessage.textContent = "Contraseña incorrecta.";
        return;
    }

    // 3. Si todo está correcto, limpiar errores y cargar el menú asignado
    errorMessage.textContent = "";
    mostrarDashboard(usuarioEncontrado);
});

function mostrarDashboard(usuario) {
    // Ocultar login y mostrar contenedor del menú
    document.getElementById('loginContainer').classList.add('hidden');
    document.getElementById('dashboardContainer').classList.remove('hidden');

    // Personalizar mensaje de bienvenida (CORREGIDO)
    document.getElementById('welcomeMessage').textContent = `¡Hola, ${usuario.role}!`;

    // Generar dinámicamente los botones de las áreas a las que tiene permiso
    const menuButtonsDiv = document.getElementById('menuButtons');
    menuButtonsDiv.innerHTML = ""; // Limpiar botones anteriores

    usuario.areas.forEach(area => {
        const boton = document.createElement('button');
        boton.className = "btn-area";
        // CORREGIDO: Uso de comillas invertidas para insertar la variable
        boton.textContent = `Área de ${area}`; 
        boton.onclick = function() {
            // CORREGIDO: Uso de comillas invertidas en el alert
            alert(`Ingresando al área de ${area}`);
        };
        menuButtonsDiv.appendChild(boton);
    });
}

// Lógica para el botón de cerrar sesión
document.getElementById('btnLogout').addEventListener('click', function() {
    document.getElementById('loginForm').reset();
    document.getElementById('dashboardContainer').classList.add('hidden');
    document.getElementById('loginContainer').classList.remove('hidden');
});
