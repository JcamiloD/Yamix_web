const express = require('express');
const router = express.Router();
const { restrictToPermiso } = require('../controller/middleware/rediect');
const { attachUserPermissions } = require('../controller/middleware/permisosParaVistas');
const { verifyToken } = require('../controller/middleware/verificarToken');


const clases = require('../controller/clases_crud');

// Controlador artes mixtas
router.get('/mixtas', verifyToken, restrictToPermiso('mixtas'),  clases.traer, (req, res) => {
    res.render('./dashboard/mixtas', { data: res.locals.data });
});
// Controlador boxeo
router.get('/boxeo', verifyToken,restrictToPermiso('boxeo'),  clases.traer, (req, res) => {
    res.render('./dashboard/boxeo', { data: res.locals.data });
});
// Controlador parkour
router.get('/parkour', verifyToken,restrictToPermiso('parkour'),  clases.traer, (req, res) => {
    res.render('./dashboard/parkour', { data: res.locals.data });
});

// Controlador clases
router.get('/clases', verifyToken, restrictToPermiso('clases'),  clases.traer, (req, res) => {
    res.render('./dashboard/clases', { data: res.locals.data });
});


module.exports = router;
