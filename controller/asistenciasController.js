const jwt = require('jsonwebtoken');
const { promisify } = require('util');


// Controlador para obtener asistencias
exports.traer = async (req, res, next) => {
    try {
        const response = await fetch(`${process.env.pathApi}/obtener_asistenciaAdmin`);
        const data = await response.json();

        // Asignar los datos de asistencia a res.locals
        res.locals.data = data;
        next(); // Llamar al siguiente middleware para que renderice la vista
    } catch (error) {
        console.error('Error al obtener las asistencias:', error);
        res.status(500).send('Error interno del servidor');
    }
};


exports.traerAsistenciaData = async (req, res, next) => {
    try {
        // Obtener clases e instructores de la API
        const clasesResponse = await fetch(`${process.env.pathApi}/traer_clases`);
        const clases = await clasesResponse.json();

        const usuariosResponse = await fetch(`${process.env.pathApi}/traer_usuarios`); // Cambiado aquí
        const usuarios = await usuariosResponse.json();

        // Guardar los datos en res.locals
        res.locals.clases = clases;
        res.locals.usuarios = usuarios;
        next();
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        res.status(500).send('Error interno del servidor');
    }
};


// Controlador para obtener estudiantes por clase
exports.claseEstudiante = async (req, res, next) => {
    try {
        // Obtener el id_clase desde la URL
        const { id_clase } = req.params;

        // Hacemos la solicitud a la API, pasando el id_clase
        const clasesResponse = await fetch(`${process.env.pathApi}/claseEstudiante/${id_clase}`);
        const textResponse = await clasesResponse.text(); // Obtener la respuesta como texto para depuración
        console.log('Respuesta de la API:', textResponse); // Ver qué está devolviendo
        const clases = JSON.parse(textResponse); // Luego intentamos parsearlo como JSON

        res.locals.clases = clases;  // Pasamos los estudiantes a res.locals
        next();
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        res.status(500).send('Error interno del servidor');
    }
};



//camilo



exports.eliminarAsistencia = async (req, res, next) => {
    try {
        const { id } = req.params;
        const url = `${process.env.pathApi}/eliminarAsistencia/${id}`;

        const response = await fetch(url, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status}, Response: ${await response.text()}`);
        }

        res.json({ message: 'Asistencia eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar asistencia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


exports.actualizarAsistencia = async (req, res, next) => {
    try {
        const { id_asistencia } = req.body;
        let { id_usuario, id_clase, fecha_asistencia, hora_asistencia, asistencia_confirmada } = req.body;

        // Convertir asistencia_confirmada a número basado en su valor
        if (asistencia_confirmada === "on") {
            asistencia_confirmada = 1;
        } else {
            asistencia_confirmada = 0;
        }

        console.log(asistencia_confirmada);
        console.log(req.body);

        // Preparar el cuerpo de la solicitud
        const bodyData = {
            id_usuario,
            id_clase,
            fecha_asistencia,
            hora_asistencia,
            asistencia_confirmada
        };

        // Hacer la solicitud PUT a tu API externa
        const response = await fetch(`${process.env.pathApi}/actualizarAsistencia/${id_asistencia}`, {
            method: 'PUT', // Usar método PUT para actualizar
            headers: {
                'Content-Type': 'application/json',  // Asegurarse de que el contenido sea JSON
            },
            body: JSON.stringify(bodyData)  // Convertir los datos a formato JSON
        });

        // Verificar si la respuesta es exitosa
        if (response.ok) {
            // Redirigir al cliente después de una actualización exitosa
            return res.redirect("/asistencias");
        } else {
            const errorData = await response.json();
            return res.status(response.status).json({ message: errorData.message || 'Error al actualizar la asistencia' });
        }

    } catch (error) {
        console.error('Error en actualizarAsistencia:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};





exports.agregarAsistencia = async (req, res, next) => {
    try {
        const { id_usuario, id_clase, fecha_asistencia, hora_asistencia, asistencia_confirmada } = req.body;
        console.log(req.body)

        // Convertir asistencia_confirmada a número basado en su valor
        let confirmada;
        if (asistencia_confirmada === "on") {
            confirmada = 1;
        } else {
            confirmada = 0;
        }

        // Verificar si todos los campos obligatorios están presentes
        if (!id_usuario || !id_clase || !fecha_asistencia || !hora_asistencia || (confirmada !== 0 && confirmada !== 1)) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        // Preparar el cuerpo de la solicitud
        const bodyData = {
            id_usuario,
            id_clase,
            fecha_asistencia,
            hora_asistencia,
            asistencia_confirmada: confirmada
        };

        // Hacer la solicitud POST a tu API externa
        const response = await fetch(`${process.env.pathApi}/agregarAsistencia`, {
            method: 'POST', // Usar método POST para agregar
            headers: {
                'Content-Type': 'application/json',  // Asegurarse de que el contenido sea JSON
            },
            body: JSON.stringify(bodyData)  // Convertir los datos a formato JSON
        });

        // Verificar si la respuesta es exitosa
        if (response.ok) {
            // Redirigir al cliente después de una adición exitosa
            return res.redirect("/asistencias");
        } else {
            const errorData = await response.json();
            return res.status(response.status).json({ message: errorData.message || 'Error al agregar la asistencia' });
        }

    } catch (error) {
        console.error('Error en agregarAsistencia:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};



//consumir solo boxeo

exports.mostrarAsistenciaBoxeo = async (req, res, next) => {
    try {
        // Hacer la solicitud GET a la API
        const response = await fetch(`${process.env.pathApi}/soloBoxeo`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).render('error', { message: errorData.message || 'Error al obtener asistencias' });
        }

        // Obtener los datos de la API
        const data = await response.json();

        // Guardar los datos en res.locals
        res.locals.data = data;

        // Llamar al siguiente middleware
        next();
        
    } catch (error) {
        console.error('Error al obtener asistencia de boxeo:', error);
        return res.status(500).render('error', { message: 'Error interno del servidor' });
    }
};


exports.mostrarAsistenciaMixtas = async (req, res, next) => {
    try {
        // Hacer la solicitud GET a la API
        const response = await fetch(`${process.env.pathApi}/soloMixtas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).render('error', { message: errorData.message || 'Error al obtener asistencias' });
        }

        // Obtener los datos de la API
        const data = await response.json();

        // Guardar los datos en res.locals
        res.locals.data = data;

        // Llamar al siguiente middleware
        next();
        
    } catch (error) {
        console.error('Error al obtener asistencia de boxeo:', error);
        return res.status(500).render('error', { message: 'Error interno del servidor' });
    }
};



exports.mostrarAsistenciaParkour = async (req, res, next) => {
    try {
        // Hacer la solicitud GET a la API
        const response = await fetch(`${process.env.pathApi}/soloParkour`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).render('error', { message: errorData.message || 'Error al obtener asistencias' });
        }

        // Obtener los datos de la API
        const data = await response.json();

        // Guardar los datos en res.locals
        res.locals.data = data;

        // Llamar al siguiente middleware
        next();
        
    } catch (error) {
        console.error('Error al obtener asistencia de boxeo:', error);
        return res.status(500).render('error', { message: 'Error interno del servidor' });
    }
};

