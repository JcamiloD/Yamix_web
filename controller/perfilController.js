const jwt = require('jsonwebtoken');
const { promisify } = require('util');

exports.obtenerPerfil = async (req, res) => {
    try {
        const id_usuario = req.usuario.id_usuario; // Obtén el id del usuario del token
        const response = await fetch(`http://localhost:4000/api/obtenerPerfil?id=${id_usuario}`, {
            method: 'GET',
            credentials: 'include', // Para incluir cookies
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario');
        }

        const usuario = await response.json();
        res.render('perfil', { usuario }); // Renderiza la vista con los datos del usuario
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el perfil');
    }
};

exports.actualizarPerfil = async (req, res) => {
    try {
        const { id_usuario, nombre, apellido, correo, fecha_nacimiento } = req.body;

        // Envía los datos a la API
        const response = await fetch(`http://localhost:4000/api/actualizarPerfil`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_usuario, nombre, apellido, gmail: correo, fecha_nacimiento }),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar los datos del usuario');
        }

        // Redirige de vuelta a la página del perfil o muestra un mensaje de éxito
        res.redirect('/perfil');
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).send('Error al actualizar el perfil');
    }
};