const { promisify } = require('util');

// Controlador para traer todas las clases y renderizar en la vista
exports.traerClases = async (req, res) => {
    try {
        // Realizar la solicitud GET a la API para obtener las clases
        const response = await fetch(`${process.env.pathApi}/traer_clases`);
        const data = await response.json(); // Convertir la respuesta a formato JSON
        
        // Renderizar la vista directamente con los datos obtenidos
        res.render('./dashboard/clases', { data });
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Controlador para agregar una nueva clase
exports.agregarClase = async (req, res) => {
    try {
        // Datos del formulario
        const { nombre_clase, descripcion, tipo_clase, dias_clase, inicio_clase, final_clase, id_horario } = req.body; // Asegúrate de incluir id_horario

        // Realizar la solicitud POST a la API para agregar la clase
        const response = await fetch(`${process.env.pathApi}/agregar_clase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre_clase,
                descripcion,
                tipo_clase,
                id_horario, // Asegúrate de enviar id_horario
                dias_clase,
                inicio_clase,
                final_clase
            })
        });

        // Verifica si la respuesta es válida y contiene JSON
        const contentType = response.headers.get("content-type");
        let result;

        if (contentType && contentType.includes("application/json")) {
            result = await response.json();
        } else {
            const text = await response.text(); // Captura el texto plano
            console.error('Error no JSON:', text);
            return res.status(500).send('Error no esperado al agregar la clase');
        }

        // Verificar si se agregó correctamente
        if (response.ok) {
            res.redirect('/clases'); // Redirigir a la página de clases después de agregar
        } else {
            console.error('Error al agregar clase:', result);
            res.status(500).send('Error al agregar la clase: ' + result.error || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error al enviar los datos de la clase:', error);
        res.status(500).send('Error interno del servidor');
    }
};


exports.actualizarClase = async (req, res) => {
    const { id } = req.params; // Obtener el ID de los parámetros de la solicitud

    try {
        const response = await fetch(`http://localhost:4000/api/actualizar_clase/${id}`, { // URL fija
            method: 'POST', // Cambiar a 'PUT' si la API lo requiere
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) // Enviar el cuerpo de la solicitud como JSON
        });

        // Verificar si la respuesta es válida y procesarla
        if (!response.ok) {
            const errorData = await response.json(); // Captura el error de la API
            console.error('Error al actualizar la clase:', errorData);
            return res.status(response.status).json({ error: errorData.error || 'Error al actualizar la clase' });
        }

        const result = await response.json(); // Procesar la respuesta como JSON
        res.json(result); // Devolver el resultado al cliente
    } catch (error) {
        console.error('Error al actualizar la clase:', error);
        res.status(500).send('Error interno del servidor');
    }
};


// Controlador para eliminar una clase
exports.eliminarClase = async (req, res) => {
    try {
        const { id_clase } = req.params;

        // Realizar la solicitud DELETE a la API para eliminar la clase
        const response = await fetch(`${process.env.pathApi}/eliminar_clase/${id_clase}`, {
            method: 'DELETE'
        });

        // Comprobar si la respuesta fue exitosa
        if (!response.ok) {
            const errorResult = await response.json(); // Intenta obtener el JSON de error
            console.error('Error al eliminar clase:', errorResult);
            return res.status(response.status).json({ error: errorResult.error || 'Error desconocido' });
        }

        // Si la eliminación fue exitosa
        const result = await response.json();
        res.redirect('/clases'); // Redirigir a la página de clases después de eliminar
    } catch (error) {
        console.error('Error al eliminar la clase:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};


// Controlador para obtener una clase específica por su ID
exports.obtenerClase = async (req, res) => {
    try {
        const { id_clase } = req.params; // Obtener el ID de la clase de los parámetros de la solicitud

        // Realizar la solicitud GET a la API para obtener la clase específica
        const response = await fetch(`${process.env.pathApi}/obtener_clase/${id_clase}`);
        const result = await response.json(); // Convertir la respuesta a formato JSON

        // Verificar si la respuesta es válida
        if (response.ok) {
            // Renderizar la vista con los datos de la clase obtenida
            res.render('./dashboard/detalleClase', { clase: result });
        } else {
            console.error('Error al obtener clase:', result);
            res.status(404).send('Clase no encontrada');
        }
    } catch (error) {
        console.error('Error al obtener datos de la clase:', error);
        res.status(500).send('Error interno del servidor');
    }
};
