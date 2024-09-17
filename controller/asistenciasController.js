const { Console } = require('console');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');


// Controlador para obtener asistencias
exports.traer = async (req, res, next) => {
    try {
        const response = await fetch(`${process.env.pathApi}/obtenerAsistencias`);
        const data = await response.json();

        // Asignar los datos de asistencia a res.locals
        res.locals.data = data;
        next(); // Llamar al siguiente middleware para que renderice la vista
    } catch (error) {
        console.error('Error al obtener las asistencias:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Controlador para obtener asistencias por usuario
exports.obtenerAsistenciasPorUsuario = async (req, res, next) => {
    try {
        // Obtener el ID del usuario del token
        const token = req.cookies.jwt; // o la forma en que estés accediendo a las cookies
        const decodedToken = jwt.decode(token); // Decodifica el token para obtener los datos del usuario
        const idUsuario = decodedToken.id;

        // Hacer la solicitud a la API
        const response = await fetch(`${process.env.pathApi}/obtenerAsistenciasUsuario/${idUsuario}`);
        if (!response.ok) {
            throw new Error('Error al obtener las asistencias');
        }

        const data = await response.json();

        // Verifica si hay datos
        if (data.length === 0) {
            res.locals.data = []; // Enviar un array vacío si no hay datos
        } else {
            res.locals.data = data;
        }

        next(); // Llamar al siguiente middleware para que renderice la vista
    } catch (error) {
        console.error('Error al obtener las asistencias:', error);
        res.status(500).send('Error interno del servidor');
    }
};


exports.crearAsistencia = async (req, res) => {
    try {
        const { id_clase, fecha_asistencia, estudiantes } = req.body;
        console.log(req.body)
        // Validar los datos antes de enviarlos
        if (!id_clase || !fecha_asistencia || !Array.isArray(estudiantes) || estudiantes.length === 0) {
            return res.status(400).json({ message: 'Datos incompletos o inválidos.' });
        }


        // Enviar los datos al endpoint de creación de asistencia
        const response = await fetch(`${process.env.pathApi}/createAsistencia`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_clase, fecha_asistencia, estudiantes })
        });

        const data = await response.json();

        if (response.ok) {
            // Redirigir a la vista con un mensaje de éxito
            res.redirect('/asistencias'); // Redirige a una ruta donde se muestran las asistencias, por ejemplo
        } else {
            // Renderizar una vista de error o mostrar el mensaje de error
            res.status(response.status).render('error', { message: data.message });
        }
    } catch (error) {
        console.error('Error al crear la asistencia:', error);
        res.status(500).render('error', { message: 'Error interno del servidor' });
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
        const url = `${process.env.pathApi}/deleteAsistencia/${id}`;

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
        let { id_asistencia, id_clase, fecha_asistencia, id_usuario, presente_estado } = req.body;

        // Convertir 'on' a 1 y 'off' a 0 si es necesario
        const presenteNum = presente_estado === '0' ? 0 : 1;

        // Convertir id_clase e id_usuario a números
        id_clase = parseInt(id_clase, 10);
        id_usuario = parseInt(id_usuario, 10);


        // Validar datos de entrada
        if (!id_asistencia || !id_clase || !fecha_asistencia || isNaN(id_usuario) || (presenteNum !== 0 && presenteNum !== 1)) {
            return res.status(400).json({ message: 'Datos incompletos o inválidos. Verifica que todos los campos sean proporcionados y que presente sea 0 o 1.' });
        }

        // Preparar el cuerpo de la solicitud
        const bodyData = {
            id_clase,
            fecha_asistencia,
            estudiantes: [
            {
                id_usuario,
                presente: presenteNum
            }
        ]
        };


        // Imprimir bodyData en formato JSON para una representación más clara


        // Hacer la solicitud PUT a tu API externa
        const response = await fetch(`${process.env.pathApi}/updateAsistencia/${id_asistencia}`, {
            method: 'PUT', // Usar método PUT para actualizar
            headers: {
                'Content-Type': 'application/json' // Agregar token de autorización si es necesario
            },
            body: JSON.stringify(bodyData)  // Convertir los datos a formato JSON
        });

        // Verificar si la respuesta es exitosa
        if (response.ok) {
            // Redirige a la misma página para simular un refresco
            return res.redirect('back'); // Redirige a la página anterior
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


        // Obtener los datos de la API
        const data = await response.json();

        // Si no hay datos, renderizar la vista con un mensaje de no hay datos
        
            res.locals.data = data;
            next()
        
    
    } catch (error) {
        console.error('Error al obtener asistencia de mixtas:', error);
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

        // Obtener los datos de la API
        const data = await response.json();


        // Si no hay datos, renderizar la vista con un mensaje de no hay datos
        
            res.locals.data = data;
            next();
        
    
        

    } catch (error) {
        console.error('Error al obtener asistencia de parkour:', error);
        return res.status(500).render('error', { message: 'Error interno del servidor' });
    }
};
