document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar el envío del formulario

    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("password").value;

    fetch('https://risttorante-italiano-production.up.railway.app/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, contrasena })
    })
    .then(response => response.json())
    .then(data => {
        if (data.redirect) {
            window.location.href = data.redirect; // Redirigir a la página principal
        } else {
            alert('Error en el inicio de sesión: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});