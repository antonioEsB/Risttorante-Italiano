// Función para validar y enviar el formulario
document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    // Obtener los valores de los campos
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const tel = document.getElementById('tel').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const personas = document.getElementById('personas').value;
    const comentarios = document.getElementById('comentarios').value;

    // Validar campos requeridos
    if (!nombre || !apellido || !email || !tel || !fecha || !hora || !personas) {
        alert('Por favor, completa todos los campos requeridos.');
        return; // Detener la ejecución si hay campos vacíos
    }

    // Mostrar confirmación
    alert(`¡Gracias, ${nombre}! Tu reservación para ${personas} personas el ${fecha} a las ${hora} ha sido recibida.`);

    // Crear un objeto con los datos del formulario
    const reservacionData = {
        nombre: nombre,
        apellido: apellido,
        correo: email,
        tel: tel,
        fecha: fecha,
        hora: hora,
        personas: personas,
        comentarios: comentarios
    };

    // Enviar los datos al servidor usando fetch
    fetch('https://risttorante-italiano-production.up.railway.app/reservacion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Indicar que los datos son de tipo JSON en el encabezado de la petición 
        },
        body: JSON.stringify(reservacionData) // Convertir los datos a formato JSON
    })
    .then(response => {
        if (response.ok) {
            return response.text(); // Retornar el texto de la respuesta
        }
        throw new Error('Error al enviar la reservación');
    })
    .then(data => {
        console.log(data); // Mostrar la respuesta del servidor en la consola
        // Limpiar el formulario después de enviar
        document.getElementById('formulario').reset();
    })
    .catch(error => {
        console.error(error);
        alert('Hubo un problema al enviar la reservación. Por favor, inténtalo de nuevo.');
    });
});


// Función para buscar una reservación por ID
        function searchReservation() {
            const searchId = document.getElementById('search-id').value;

            fetch(`https://risttorante-italiano-production.up.railway.app/reservacion/${searchId}`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Reservación no encontrada');
                    }
                })
                .then(data => {
                    const reservationsList = document.getElementById('reservations-list');
                    reservationsList.innerHTML = `
                        <tr>
                            <td>${data.id_Reservacion}</td>
                            <td>${data.nombre}</td>
                            <td>${data.apellido}</td>
                            <td>${data.correo}</td>
                            <td>${data.tel}</td>
                            <td>${data.fecha}</td>
                            <td>${data.hora}</td>
                            <td>${data.cantidad}</td>
                            <td>${data.comentarios}</td>
                            <td><button class="btn btn-danger" onclick="deleteReservation(${data.id_Reservacion})">Eliminar</button></td>
                        </tr>
                    `;
                })
                .catch(error => {
                    alert(error.message);
                });
        }

        // Función para eliminar una reservación
function deleteReservation(id) {
    if (confirm(`¿Seguro que quieres eliminar la reservación con ID ${id}?`)) {
        fetch(`https://risttorante-italiano-production.up.railway.app/reservacion/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            // Si la respuesta es OK (200)
            if (response.ok) {
                alert('Reservación eliminada correctamente');
                // Remover la fila de la tabla
                const row = document.querySelector(`tr td:first-child`).innerText == id ? document.querySelector(`tr td:first-child`).parentNode : null;
                if (row) {
                    row.remove();
                }
            } else {
                alert('Error al eliminar la reservación');
            }
        })
        .catch(error => {
            console.error('Error al eliminar la reservación:', error);
            alert('Error al eliminar la reservación');
        });
    }
}
