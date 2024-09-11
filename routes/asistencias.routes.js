const express = require('express');
const router = express.Router();
const { restrictToPermiso } = require('../controller/middleware/rediect');
const { attachUserPermissions } = require('../controller/middleware/permisosParaVistas');
const { verifyToken } = require('../controller/middleware/verificarToken');
const asistencias = require('../controller/asistenciasController');

// Ruta para obtener asistencias y renderizar la vista
router.get('/asistencias', verifyToken, restrictToPermiso('roles'), asistencias.traerAsistenciaData, asistencias.traer, (req, res) => {
    res.render('./dashboard/asistencias', { 
        data: res.locals.data, 
        clases: res.locals.clases,
        usuarios: res.locals.usuarios
    });
});

// Ruta para agregar asistencia
router.post('/agregar_asistencia', verifyToken, restrictToPermiso('roles'), asistencias.agregarAsistencia);

// Ruta para actualizar asistencia de estudiantes
router.post('/actualizar_asistencia', asistencias.actualizarAsistenciaEstudiantes);

module.exports = router;
