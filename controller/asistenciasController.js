const jwt = require('jsonwebtoken');
const { promisify } = require('util');

exports.traer = async (req, res, next) => {
    try {
        const response = await fetch(`${process.env.pathApi}/obtener_asistencia`);
        const data = await response.json();

        // Asignar los datos a res.locals
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

exports.agregarAsistencia = async (req, res) => {
    try {
        const { clase, instructor, fecha, hora } = req.body;

        // Llamada a la API para agregar la asistencia
        const response = await fetch(`${process.env.pathApi}/agregar_asistencia`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ clase, instructor, fecha, hora })
        });

        const data = await response.json();

        if (response.ok) {
            res.status(200).json({ message: 'Asistencia registrada con éxito' });
        } else {
            res.status(500).json({ error: 'Error al registrar asistencia', details: data });
        }
    } catch (error) {
        console.error('Error al registrar asistencia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.actualizarAsistenciaEstudiantes = async (req, res) => {
    try {
        const response = await fetch(`${process.env.pathApi}/actualizar_asistencia`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error al actualizar asistencia de estudiantes en el proyecto:', error);
        res.status(500).json({ error: 'Error al actualizar asistencia de estudiantes' });
    }
};
