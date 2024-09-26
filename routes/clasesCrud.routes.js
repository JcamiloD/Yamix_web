const express = require('express');
const router = express.Router();
const { restrictToPermiso } = require('../controller/middleware/rediect');
const { attachUserPermissions } = require('../controller/middleware/permisosParaVistas');
const { verifyToken } = require('../controller/middleware/verificarToken');
const clases = require('../controller/clases_crud'); // Aquí usas 'clases'

 // Traer todas las clases

router.post('/agregar_clase', verifyToken, restrictToPermiso('clases admin'),clases.agregarClase);  // Agregar una nueva clase
router.post('/actualizar_clase/:id', verifyToken, restrictToPermiso('clases admin'),clases.actualizarClase);  // Actualizar una clase existente
router.delete('/eliminar_clase/:id',  verifyToken, restrictToPermiso('clases admin'),clases.eliminarClase);  // Eliminar una clase por ID
router.get('/obtener_clase/:id_clase', verifyToken, restrictToPermiso('clases admin'),clases.obtenerClase);

router.get('/clases', verifyToken, restrictToPermiso('clases admin'), attachUserPermissions, clases.traerClases, (req, res) => {
    const userPermissions = req.usuario ? req.usuario.permisos : [];
    console.log(res.locals.data)
    res.render('./dashboard/clases', { data: res.locals.data, permisos: userPermissions  });
});

module.exports = router;
