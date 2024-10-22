document.addEventListener('DOMContentLoaded', () => {

    // Función para crear confeti
    function crearConfeti() {
        const cantidadConfeti = 10; // Cantidad de piezas de confeti a generar
        for (let i = 0; i < cantidadConfeti; i++) {
            const confeti = document.createElement('div');
            confeti.classList.add('confeti');
            // Establecer una posición aleatoria en el contenedor
            confeti.style.left = Math.random() * 100 + 'vw'; // Ancho de la ventana
            confeti.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16); // Color aleatorio
            document.body.appendChild(confeti);

            // Eliminar el confeti después de que cae
            setTimeout(() => {
                confeti.remove();
            }, 4000); // Tiempo de vida del confeti, para que coincida con la duración de la caída
        }
    }
    
    let intentos = 0;

    const inputAdivinanza = document.getElementById('adivinanza');
    const botonAdivinar = document.getElementById('adivinar-btn');
    const botonReiniciar = document.getElementById('reiniciar-btn');
    const mensaje = document.getElementById('mensaje');
    const intentosDisplay = document.getElementById('intentos');
    const felicitaciones = document.getElementById('felicidades');

    // Evento al hacer clic en "Adivinar"
    botonAdivinar.addEventListener('click', () => {
        const adivinanza = parseInt(inputAdivinanza.value);
        intentos++;

        if (isNaN(adivinanza) || adivinanza < 1 || adivinanza > 50) {
            mensaje.textContent = "Por favor, introduce un número válido entre 1 y 50.";
            mensaje.style.color = "#e74c3c";  // Color rojo para los mensajes de error
            return;
        }

        fetch('/adivinar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                numero: adivinanza,
                intentos: intentos
            }),
        })
        .then(response => response.json())
        .then(data => {
            mensaje.textContent = data.mensaje;
            intentosDisplay.textContent = `Intentos: ${data.intentos}`;

            if (data.resultado) {
                mensaje.style.color = "#2ecc71";  // Verde si el número es correcto
                inputAdivinanza.disabled = true;
                botonAdivinar.style.display = 'none'; // Ocultar el botón de adivinar
                botonReiniciar.style.display = 'block'; // Mostrar el botón de reinicio

                // Mostrar mensaje de felicitaciones
                felicitaciones.style.display = 'block';
                crearConfeti(); // Llamar a la función para crear confeti
            } else {
                mensaje.style.color = "#e74c3c";  // Volver a color rojo si no es correcto
                inputAdivinanza.value = ''; // Limpiar el campo de entrada si es incorrecto
                inputAdivinanza.focus();    // Colocar el foco en el campo
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Evento al hacer clic en "Reiniciar"
    botonReiniciar.addEventListener('click', () => {
        intentos = 0;  // Reiniciar el contador de intentos
        mensaje.textContent = '';
        mensaje.style.color = "#e74c3c";  // Volver al color rojo al reiniciar
        intentosDisplay.textContent = 'Intentos: 0';
        felicitaciones.style.display = 'none'; // Ocultar mensaje de felicitaciones
        inputAdivinanza.disabled = false;
        inputAdivinanza.value = '';
        inputAdivinanza.focus();
        botonAdivinar.style.display = 'block'; // Volver a mostrar el botón de adivinar
        botonReiniciar.style.display = 'none'; // Ocultar el botón de reinicio
    });

    
});