const jwt = require('jsonwebtoken')
const { promisify } = require('util')

exports.traer = async (req, res, next) => {
    try {
        const response = await fetch('http://localhost:4000/api/traer_roles');
        const data = await response.json(); 
        res.locals.data = data;
        next();
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        res.status(500).send('Error interno del servidor');
    }
};


// Obtener todos los permisos
exports.traerPermisos = async (req, res, next) => {
    try {
        const response = await fetch('http://localhost:4000/api/obtener_permisos');
        const data = await response.json();
        res.locals.data = data;
        next();
    } catch (error) {
        console.error('Error al obtener permisos:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// Obtener permisos por rol
exports.traerPermisosPorRol = async (req, res, next) => {
    const rolId = req.params.rolId;
    try {
        const response = await fetch(`http://localhost:4000/api/obtener_permisos_rol/${rolId}`);
        const data = await response.json();
        res.locals.data = data;
        next();
    } catch (error) {
        console.error('Error al obtener permisos por rol:', error);
        res.status(500).send('Error interno del servidor');
    }
};
