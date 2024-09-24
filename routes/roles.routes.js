const express = require('express');
const router = express.Router();
const { restrictToPermiso } = require('../controller/middleware/rediect');
const { attachUserPermissions } = require('../controller/middleware/permisosParaVistas');
const { verifyToken } = require('../controller/middleware/verificarToken');



const roles = require('../controller/roles_controller');


// Controlador traer roles
router.get('/permisos', verifyToken, restrictToPermiso('roles'),  roles.traer, (req, res) => {
    res.render('./dashboard/permisos', { data: res.locals.data });
});

// Ruta para agregar rol
router.post('/agregar_rol', verifyToken, restrictToPermiso('roles'), roles.agregarRol);

// Ruta para editar rol
router.put('/editar_rol/:id_rol', verifyToken, restrictToPermiso('roles'), roles.editarRol);

// Ruta para eliminar rol
router.delete('/eliminar_rol/:id_rol', verifyToken, restrictToPermiso('roles'), roles.eliminarRol);


// Ruta para obtener todos los permisos
router.get('/todos_permisos',  roles.traerPermisos, (req, res) => {
    res.json(res.locals.data);
});

// Ruta para obtener permisos por rol
router.get('/permisos_rol/:rolId',  roles.traerPermisosPorRol, (req, res) => {
    res.json(res.locals.data);
});

// Ruta para actualizar permisos de un rol
router.post('/actualizar_permisos', roles.actualizarPermisosPorRol);


module.exports = router;
