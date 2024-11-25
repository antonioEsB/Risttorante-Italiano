document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío tradicional del formulario

    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;

    // Enviar los datos al servidor utilizando fetch
    fetch('http://localhost:3000/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: nombre,
            correo: correo,
            password: password
        })
    })
    .then(response => {
        if (response.ok) {
            // Si la respuesta es exitosa, redirigir al usuario
            alert('Usuario registrado correctamente');
            window.location.href = 'proyectoFinal.html'; // Redirigir a la página principal
        } else {
            // Si hay un error, mostrar el mensaje de error
            return response.text();
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});