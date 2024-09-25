const express = require('express');
const router = express.Router();
const { restrictToPermiso } = require('../controller/middleware/rediect');
const { attachUserPermissions } = require('../controller/middleware/permisosParaVistas');
const { verifyToken } = require('../controller/middleware/verificarToken');
const clases = require('../controller/clases_crud'); // Aquí usas 'clases'

// Rutas para el CRUD de clases
router.get('/traer_clases', clases.traerClases);  // Traer todas las clases
router.post('/agregar_clase', clases.agregarClase);  // Agregar una nueva clase
router.post('/actualizar_clase/:id', clases.actualizarClase);  // Actualizar una clase existente
router.delete('/eliminar_clase/:id', clases.eliminarClase);  // Eliminar una clase por ID
router.get('/obtener_clase/:id_clase', clases.obtenerClase);

router.get('/clases', verifyToken, restrictToPermiso('clases'), clases.traerClases, (req, res) => {
    res.render('./dashboard/clases', { data: res.locals.data });
});

module.exports = router;
